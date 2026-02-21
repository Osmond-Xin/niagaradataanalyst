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
const API_URL = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL_ID}:streamGenerateContent`;

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
     * 收集完整 JSON 数组流，拼接所有 chunk 的 text，以 SSE 格式转发给前端
     * Vertex AI 返回格式：[{candidates:[{content:{parts:[{text:"..."}]}}]}, ...]
     */
    const decoder = new TextDecoder();
    const reader = vertexResponse.body!.getReader();
    const rawChunks: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      rawChunks.push(decoder.decode(value, { stream: true }));
    }

    const rawText = rawChunks.join('');
    let fullText = '';

    try {
      const parsed = JSON.parse(rawText);
      for (const chunk of parsed) {
        const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) fullText += text;
      }
    } catch {
      console.error('[API/chat] JSON parse error, raw:', rawText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    if (!fullText) {
      console.error('[API/chat] Empty text in response:', rawText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    return NextResponse.json({ content: fullText });

  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
  }
}
