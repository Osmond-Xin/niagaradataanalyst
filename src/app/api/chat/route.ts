/**
 * Claude Haiku 聊天 API Route
 * 使用 Anthropic Messages API，替换原 MiniMax 实现
 * 响应速度约 1-3s，远低于 Vercel 10s 限制
 */
import { NextRequest, NextResponse } from 'next/server';
import { aiPersona } from '@/data/ai-persona';
import { createRateLimiter } from '@/lib/rate-limit';

/** Vercel 函数最大执行时间（秒） */
export const maxDuration = 10;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const MODEL_ID          = 'claude-haiku-4-5';

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
        { error: '请求过于频繁，请稍后再试。Too many requests.' },
        { status: 429 },
      );
    }

    const body: ChatRequestBody = await request.json();
    const { messages, mode } = body;
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        content: "Hello! I'm the NiagaraDataAnalyst AI assistant. AI service is not configured yet.",
        showContactForm: false,
      });
    }

    /** 8 秒超时，留余量在 Vercel 10s 限制前返回 */
    const abort = new AbortController();
    const abortTimer = setTimeout(() => abort.abort(), 8_000);

    let response: Response;
    try {
      response = await fetch(`${ANTHROPIC_API_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type':    'application/json',
          'x-api-key':       ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      MODEL_ID,
          max_tokens: 600,
          system:     aiPersona.systemPrompt,
          messages:   messages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abort.signal,
      });
    } catch (err) {
      clearTimeout(abortTimer);
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      console.error('[API/chat] Fetch error:', isTimeout ? 'timeout' : err);
      return NextResponse.json(
        { error: isTimeout ? 'AI 响应超时，请稍后重试。' : '服务暂时不可用，请稍后重试。' },
        { status: 504 },
      );
    }
    clearTimeout(abortTimer);

    if (!response.ok) {
      const errText = await response.text();
      console.error('[API/chat] Anthropic error:', response.status, errText.slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    const data = await response.json() as {
      content?: Array<{ type: string; text: string }>;
    };

    const text = data.content?.find((b) => b.type === 'text')?.text;
    if (!text) {
      console.error('[API/chat] No text in response:', JSON.stringify(data).slice(0, 200));
      return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
    }

    /** 检测联系意图，仅在普通聊天模式下触发 */
    const lastUserContent = messages[messages.length - 1]?.content || '';
    const showContactForm = mode === 'chat' && CONTACT_INTENT_RE.test(lastUserContent);

    return NextResponse.json({ content: text, showContactForm });

  } catch (error) {
    console.error('[API/chat] Error:', error);
    return NextResponse.json({ error: '服务暂时不可用，请稍后重试。' }, { status: 500 });
  }
}
