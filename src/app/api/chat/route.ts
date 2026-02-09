/**
 * Vertex AI聊天API Route
 * 接收前端消息，注入系统提示词，调用Gemini模型，返回流式响应
 * 服务端运行，凭证不暴露到客户端
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';

/** Vertex AI配置 */
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = process.env.GCP_LOCATION || 'us-central1';
const MODEL_ID = 'gemini-2.0-flash';

/** 限流配置：每IP每分钟50次，全局每天300次 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_IP = 50;
const DAILY_LIMIT_MAX = 300;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let dailyCount = 0;
let dailyResetAt = Date.now() + 86_400_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  /** 全局每日限额检查 */
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 86_400_000;
  }
  dailyCount += 1;
  if (dailyCount > DAILY_LIMIT_MAX) return true;

  /** 单IP每分钟限额检查 */
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_PER_IP;
}

/** 定期清理过期条目，防止内存泄漏 */
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, ip) => {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  });
}, RATE_LIMIT_WINDOW_MS);

/** 聊天消息接口 */
interface ChatRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  mode: 'chat' | 'job-match';
}

export async function POST(request: NextRequest) {
  try {
    /** IP限流检查 */
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试。Too many requests, please try again later.' },
        { status: 429 },
      );
    }

    const body: ChatRequestBody = await request.json();
    const { messages, mode } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    /** 根据模式选择系统提示词 */
    const systemPrompt = mode === 'job-match'
      ? aiPersona.jobMatchingPrompt
      : aiPersona.systemPrompt;

    /**
     * 如果Vertex AI未配置，使用回退响应
     * 这允许在没有GCP凭证的开发环境中运行
     */
    if (!GCP_PROJECT_ID) {
      const fallbackResponse = mode === 'job-match'
        ? '工作匹配功能需要配置Vertex AI。请设置GCP_PROJECT_ID环境变量。\n\nJob matching requires Vertex AI configuration. Please set GCP_PROJECT_ID.'
        : '你好！我是NiagaraDataAnalyst的AI助手。目前AI服务未配置，但你可以浏览网站了解更多信息。\n\nHello! I\'m the NiagaraDataAnalyst AI assistant. AI service is not configured yet, but feel free to explore the website.';

      return NextResponse.json({ content: fallbackResponse });
    }

    /** 动态导入Vertex AI SDK（仅服务端） */
    const { VertexAI } = await import('@google-cloud/vertexai');

    const vertexAi = new VertexAI({
      project: GCP_PROJECT_ID,
      location: GCP_LOCATION,
    });

    const model = vertexAi.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] },
    });

    /** 构建对话历史 */
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    /** 调用Vertex AI生成内容（流式） */
    const result = await model.generateContentStream({ contents });

    /** 创建流式响应 */
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后重试。' },
      { status: 500 },
    );
  }
}
