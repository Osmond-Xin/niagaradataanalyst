/**
 * Vertex AI 聊天 API Route
 * 直接调用 Vertex AI REST API，使用 API Key 鉴权（无需服务账号文件）
 * 支持流式响应，服务端运行，凭证不暴露到客户端
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';

/** Vertex AI 配置 */
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = process.env.GCP_LOCATION || 'global';
const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-3-flash-preview';

/** 根据 location 构建 API base URL */
function getApiBaseUrl(): string {
  if (GCP_LOCATION === 'global') {
    return 'https://aiplatform.googleapis.com/v1';
  }
  return `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1`;
}

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
     * 如果 API Key 或 Project ID 未配置，返回回退响应
     */
    if (!GOOGLE_AI_API_KEY || !GCP_PROJECT_ID) {
      const fallbackResponse = mode === 'job-match'
        ? '工作匹配功能需要配置 Vertex AI API Key。请设置 GOOGLE_AI_API_KEY 和 GCP_PROJECT_ID 环境变量。\n\nJob matching requires Vertex AI configuration. Please set GOOGLE_AI_API_KEY and GCP_PROJECT_ID.'
        : '你好！我是 NiagaraDataAnalyst 的 AI 助手。目前 AI 服务未配置，但你可以浏览网站了解更多信息。\n\nHello! I\'m the NiagaraDataAnalyst AI assistant. AI service is not configured yet, but feel free to explore the website.';
      return NextResponse.json({ content: fallbackResponse });
    }

    /** 构建 Vertex AI REST API 请求体 */
    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    };

    /** 调用 Vertex AI generateContent 接口（global endpoint 不支持 streamGenerateContent） */
    const apiUrl = `${getApiBaseUrl()}/projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/publishers/google/models/${MODEL_ID}:generateContent?key=${GOOGLE_AI_API_KEY}`;

    const vertexResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!vertexResponse.ok) {
      const errText = await vertexResponse.text();
      console.error('[API/chat] Vertex AI error:', vertexResponse.status, errText);
      return NextResponse.json(
        { error: '服务暂时不可用，请稍后重试。' },
        { status: 500 },
      );
    }

    const responseData = await vertexResponse.json();
    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('[API/chat] Empty response from Vertex AI:', JSON.stringify(responseData));
      return NextResponse.json(
        { error: '服务暂时不可用，请稍后重试。' },
        { status: 500 },
      );
    }

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后重试。' },
      { status: 500 },
    );
  }
}
