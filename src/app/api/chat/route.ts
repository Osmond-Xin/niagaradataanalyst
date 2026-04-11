/**
 * MiniMax 聊天 API Route
 * 使用自定义代理端点 + Bearer Key + X-Proxy-Token
 * MiniMax-M2.7 为推理模型，响应含 <think>...</think> 块，需过滤
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';
import { createRateLimiter } from '@/lib/rate-limit';

/** MiniMax 代理配置 */
const MINIMAX_API_KEY     = process.env.MINIMAX_API_KEY;
const MINIMAX_API_URL     = process.env.MINIMAX_API_URL || 'https://mini.niagaradataanalyst.com/v1';
const MINIMAX_PROXY_TOKEN = process.env.MINIMAX_PROXY_TOKEN;
const MODEL_ID            = process.env.MINIMAX_MODEL_ID || 'MiniMax-M2.7';

/** 去除推理模型输出的 <think>...</think> 块 */
function stripThinkingBlock(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
}

/** 限流：每IP每分钟50次，全局每天300次 */
const isRateLimited = createRateLimiter({ perIp: 50, perDay: 300, windowMs: 60_000 });

/** 联系意图关键词：匹配时自动展示联系表单 */
const CONTACT_INTENT_RE = /\b(contact|hire|reach|email|get in touch|connect with|work with)\b|联系|雇佣?|邮箱|找你|合作|怎么联系/i;

interface ChatRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
  mode: 'chat' | 'job-match';
}

export async function POST(request: NextRequest) {
  try {
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

    const systemPrompt = mode === 'job-match'
      ? aiPersona.jobMatchingPrompt
      : aiPersona.systemPrompt;

    /** API Key 未配置时返回回退响应 */
    if (!MINIMAX_API_KEY) {
      const fallback = mode === 'job-match'
        ? 'Job matching requires MINIMAX_API_KEY to be set in Vercel environment variables.'
        : "Hello! I'm the NiagaraDataAnalyst AI assistant. AI service is not configured yet.";
      return NextResponse.json({ content: fallback, showContactForm: false });
    }

    /** 构造请求头 */
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    };
    if (MINIMAX_PROXY_TOKEN) {
      headers['X-Proxy-Token'] = MINIMAX_PROXY_TOKEN;
    }

    /** OpenAI 兼容格式请求体 */
    const requestBody = {
      model: MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

    const minimaxResponse = await fetch(`${MINIMAX_API_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!minimaxResponse.ok) {
      const errText = await minimaxResponse.text();
      console.error('[API/chat] MiniMax error:', minimaxResponse.status, errText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    const data = await minimaxResponse.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      console.error('[API/chat] No text in response:', JSON.stringify(data).slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    /** 过滤推理块，只返回最终回答 */
    const text = stripThinkingBlock(raw);

    /** 检测联系意图，仅在普通聊天模式下触发 */
    const lastUserContent = messages[messages.length - 1]?.content || '';
    const showContactForm = mode === 'chat' && CONTACT_INTENT_RE.test(lastUserContent);

    return NextResponse.json({ content: text, showContactForm });

  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
  }
}
