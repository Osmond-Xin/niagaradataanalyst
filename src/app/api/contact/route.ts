/**
 * 联系表单 API Route（极简版）
 * 接收一条联系信息字符串 → 限流 → Resend 发邮件至 Yi Xin Outlook
 * RESEND_API_KEY 未设置时优雅降级：记录日志并返回成功
 */
import { NextRequest, NextResponse } from 'next/server';
import { createRateLimiter } from '@/lib/rate-limit';
import { renderEmailHtml } from '@/lib/email-template';
import type { ChatMessage } from '@/types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_FROM   = process.env.CONTACT_FROM_EMAIL || 'NiagaraDataAnalyst <onboarding@resend.dev>';
const CONTACT_TO     = process.env.CONTACT_TO_EMAIL   || 'yi.xin7319@myunfc.ca';

/** 限流：每IP每分钟5次，全局每天50次 */
const isRateLimited = createRateLimiter({ perIp: 5, perDay: 50, windowMs: 60_000 });

interface ContactRequestBody {
  contactInfo: string;
  context?: ChatMessage[];
  locale: 'zh' | 'en';
  honeypot?: string;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: '提交过于频繁，请稍后再试。Too many requests.' },
        { status: 429 },
      );
    }

    const body: ContactRequestBody = await request.json();
    const { contactInfo, context, locale, honeypot } = body;

    /** 蜜罐静默通过 */
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!contactInfo?.trim() || contactInfo.trim().length > 200) {
      return NextResponse.json({ error: '请留下联系方式（1–200 字符）' }, { status: 400 });
    }

    const clean        = contactInfo.trim();
    const safeContext  = (context || []).slice(-10);

    if (!RESEND_API_KEY) {
      console.log('[API/contact] No RESEND_API_KEY — contact form submission:', { contactInfo: clean });
      return NextResponse.json({ ok: true, fallback: true });
    }

    const html    = renderEmailHtml({ contactInfo: clean, context: safeContext, locale: locale || 'en', ip });
    const subject = `[Portfolio] New contact: ${clean.slice(0, 60)}`;

    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from:    CONTACT_FROM,
      to:      CONTACT_TO,
      subject,
      html,
    });

    if (error) {
      console.error('[API/contact] Resend error:', error);
      return NextResponse.json({ error: '发送失败，请稍后重试。' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('[API/contact] Error:', error);
    return NextResponse.json({ error: '发送失败，请稍后重试。' }, { status: 500 });
  }
}
