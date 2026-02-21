/**
 * Vertex AI 聊天 API Route
 * 使用 /v1/publishers/google/models/{model}:streamGenerateContent + API Key
 * 解析 JSON 数组流响应，转发给前端
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';

/** Vertex AI 配置 */
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-3-flash-preview';
const API_URL = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL_ID}:generateContent`;

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
    if (!GOOGLE_AI_API_KEY) {
      const fallback = mode === 'job-match'
        ? 'Job matching requires GOOGLE_AI_API_KEY environment variable to be set in Vercel.'
        : 'Hello! I\'m the NiagaraDataAnalyst AI assistant. AI service is not configured yet.';
      return NextResponse.json({ content: fallback });
    }

    const requestBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
    };

    /** 调用 Vertex AI（publisher URL，不含 project/location） */
    const vertexResponse = await fetch(`${API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!vertexResponse.ok) {
      const errText = await vertexResponse.text();
      console.error('[API/chat] Vertex AI error:', vertexResponse.status, errText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    /**
     * 使用 text() 读取原始响应，手动 parse 以便记录详细错误
     */
    const rawText = await vertexResponse.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawText) as Record<string, unknown>;
    } catch (e) {
      console.error('[API/chat] JSON parse failed. Status:', vertexResponse.status);
      console.error('[API/chat] Raw response (200 chars):', rawText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    const candidates = data.candidates as Array<Record<string, unknown>> | undefined;
    const fullText = (candidates?.[0]?.content as Record<string, unknown> | undefined)
      ?.parts as Array<{ text?: string }> | undefined;
    const text = fullText?.[0]?.text;

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
