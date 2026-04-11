'use client';

/**
 * 联系卡片组件（极简版）
 * 一个输入框 + 一个按钮，用户写下任意联系方式即可
 */
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ChatMessage } from '@/types';

interface ContactCardProps {
  context: ChatMessage[];
  sessionId: string;
  onSubmitted: (status: 'success' | 'error') => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ context, onSubmitted }) => {
  const { t, language } = useLanguage();
  const [contactInfo, setContactInfo] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactInfo.trim()) {
      setError(language === 'zh' ? '请留下联系方式' : 'Please enter your contact info');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactInfo: contactInfo.trim(),
          honeypot,
          context,
          locale: language,
        }),
      });
      const data = await res.json();
      onSubmitted(data.ok ? 'success' : 'error');
    } catch {
      onSubmitted('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-warm-sand border border-border-cream rounded-xl p-4 space-y-3"
    >
      <p className="text-body-sm font-display font-medium text-text-primary">
        {t('ai.contactFormTitle')}
      </p>

      {/* 蜜罐（人类不可见） */}
      <input
        type="text"
        name="website"
        aria-hidden="true"
        tabIndex={-1}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] w-px h-px opacity-0"
        autoComplete="off"
      />

      {/* 唯一输入框 */}
      <div>
        <input
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder={t('ai.contactInfoPlaceholder')}
          disabled={submitting}
          maxLength={200}
          className="w-full bg-white border border-border-warm rounded-lg px-3 py-2
                     text-body-sm font-sans text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:ring-2 focus:ring-focus-blue focus:border-focus-blue
                     disabled:opacity-50"
        />
        {error && <p className="text-label font-sans text-red-500 mt-1">{error}</p>}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-label font-sans text-text-muted">{t('ai.contactPrivacy')}</p>
        <button
          type="submit"
          disabled={submitting || !contactInfo.trim()}
          className="px-4 py-2 bg-terracotta hover:brightness-110 disabled:bg-warm-sand
                     disabled:cursor-not-allowed rounded-lg text-ivory text-body-sm
                     font-sans font-medium transition-all duration-200 flex-shrink-0 ml-3"
        >
          {submitting ? t('ai.contactSending') : t('ai.contactSubmit')}
        </button>
      </div>
    </form>
  );
};

export default ContactCard;
