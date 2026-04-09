/**
 * MiniMax 聊天 API Route
 * 使用 MiniMax OpenAI 兼容接口 + MINIMAX_API_KEY
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';

/** MiniMax 配置 */
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MODEL_ID = process.env.MINIMAX_MODEL_ID || 'MiniMax-Text-01';
const API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';

/** 限流配置：每IP每分钟50次，全局每天300次 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_IP = 50;
const DAILY_LIMIT_MAX = 300;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
let dailyCount = 0;
let dailyResetAt = Date.now() + 86_400_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 86_400_000;
  }
  dailyCount += 1;
  if (dailyCount > DAILY_LIMIT_MAX) return true;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_PER_IP;
}

setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, ip) => {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  });
}, RATE_LIMIT_WINDOW_MS);

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
        ? 'Job matching requires MINIMAX_API_KEY environment variable to be set in Vercel.'
        : 'Hello! I\'m the NiagaraDataAnalyst AI assistant. AI service is not configured yet.';
      return NextResponse.json({ content: fallback });
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

    const minimaxResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
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

    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      console.error('[API/chat] No text in response:', JSON.stringify(data).slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    return NextResponse.json({ content: text });

  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
  }
}
