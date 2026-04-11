/**
 * 联系表单邮件 HTML 模板
 * 生成发送给 Yi Xin Outlook 收件箱的通知邮件
 */
import type { ChatMessage } from '@/types';

interface EmailTemplateParams {
  contactInfo: string;
  context?: ChatMessage[];
  locale: string;
  ip: string;
}

export function renderEmailHtml(params: EmailTemplateParams): string {
  const { contactInfo, context, locale, ip } = params;
  const now = new Date().toUTCString();

  const contextRows = (context || [])
    .filter((m) => m.content && !m.type)
    .map(
      (m) =>
        `<div style="margin-bottom:10px">
          <span style="font-weight:600;color:${m.role === 'user' ? '#1f2937' : '#6b7280'}">
            ${m.role === 'user' ? '👤 Visitor' : '🤖 AI'}
          </span>
          <p style="margin:4px 0 0;white-space:pre-wrap;color:${m.role === 'user' ? '#111827' : '#6b7280'}">${escapeHtml(m.content)}</p>
        </div>`,
    )
    .join('');

  const contextSection = contextRows
    ? `<details style="margin-top:24px">
        <summary style="cursor:pointer;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">
          Conversation history (${(context || []).filter((m) => !m.type).length} messages)
        </summary>
        <div style="margin-top:12px;padding:16px;background:#f9f7f4;border-radius:8px;font-size:13px;font-family:sans-serif">
          ${contextRows}
        </div>
      </details>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

    <div style="background:#b45309;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">
        📇 New contact via niagaradataanalyst.com
      </h1>
    </div>

    <div style="padding:32px">

      <div style="background:#fdf8f4;border-left:3px solid #b45309;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px">
        <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em">Contact Info</p>
        <p style="margin:0;color:#111827;font-size:16px;font-weight:500;white-space:pre-wrap">${escapeHtml(contactInfo)}</p>
      </div>

      <table style="width:100%;border-collapse:collapse">
        <tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#9ca3af;font-size:13px;width:70px">Locale</td>
          <td style="padding:10px 0;color:#9ca3af;font-size:13px">${escapeHtml(locale)}</td>
        </tr>
        <tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:10px 0;color:#9ca3af;font-size:13px">IP</td>
          <td style="padding:10px 0;color:#9ca3af;font-size:13px">${escapeHtml(ip)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#9ca3af;font-size:13px">Time</td>
          <td style="padding:10px 0;color:#9ca3af;font-size:13px">${now}</td>
        </tr>
      </table>

      ${contextSection}
    </div>

    <div style="padding:16px 32px;background:#f9f7f4;border-top:1px solid #e5e7eb">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        Sent via niagaradataanalyst.com
      </p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
