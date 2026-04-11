'use client';

/**
 * AI聊天小部件组件
 * Claude 编辑风：象牙白面板 + 暖灰边框 + 赤陶 CTA
 * 浮动按钮使用 terracotta 色与呼吸动画
 * 支持内联联系表单：常驻按钮触发 + AI 意图检测自动触发
 */
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ChatMessage, ChatMode } from '@/types';
import { analytics } from '@/lib/analytics';
import ContactCard from '@/components/ContactCard';

/** 生成唯一会话ID */
const generateSessionId = (): string =>
  `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 聊天模式配置 */
const chatModes: ChatMode[] = [
  { id: 'chat', nameKey: 'ai.chatTab', descriptionKey: 'ai.greeting' },
  { id: 'job-match', nameKey: 'ai.jobMatchTab', descriptionKey: 'ai.jobMatchGreeting' },
];

const AiAgentWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'job-match'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>('');
  const sessionStartTimeRef = useRef<number>(0);

  /** 自动滚动到最新消息 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 打开时聚焦输入框并上报会话开始 */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      sessionIdRef.current = generateSessionId();
      sessionStartTimeRef.current = Date.now();
      analytics.chatSessionStart(sessionIdRef.current, language);
    } else {
      if (sessionIdRef.current) {
        const userMessages = messages.filter((m) => m.role === 'user');
        if (userMessages.length === 0) {
          analytics.chatOpenedNoMessage(sessionIdRef.current, language);
        } else {
          const durationSec = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
          analytics.chatSessionEnd(sessionIdRef.current, userMessages.length, durationSec);
        }
        sessionIdRef.current = '';
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /** 切换模式时重置消息 */
  const switchMode = (mode: 'chat' | 'job-match') => {
    setActiveMode(mode);
    setMessages([]);
  };

  /** 插入联系表单气泡（常驻按钮点击时调用） */
  const insertContactCard = () => {
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', type: 'contact-form' },
    ]);
    analytics.contactFormShown('button', sessionIdRef.current);
  };

  /** 联系表单提交回调：把 contact-form 气泡替换为成功/失败气泡 */
  const handleContactResult = (status: 'success' | 'error') => {
    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.type === 'contact-form');
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const updated = [...prev];
      updated[realIdx] = {
        role: 'assistant',
        content: status === 'success' ? t('ai.contactSuccess') : t('ai.contactError'),
        type: status === 'success' ? 'contact-success' : 'contact-error',
      };
      return updated;
    });
    if (status === 'success') {
      analytics.contactFormSubmitted(sessionIdRef.current);
    } else {
      analytics.contactFormError(sessionIdRef.current);
    }
  };

  /** 发送消息 */
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const currentUserMessageCount = messages.filter((m) => m.role === 'user').length;
    analytics.chatMessageSent(sessionIdRef.current, currentUserMessageCount);

    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], mode: activeMode }),
      });

      if (!response.ok) throw new Error('API error');

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            for (const line of chunk.split('\n')) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') break;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    assistantContent += parsed.content;
                    setMessages((prev) => {
                      const updated = [...prev];
                      updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                      return updated;
                    });
                  }
                } catch { /* 忽略解析错误 */ }
              }
            }
          }
        }
      } else {
        const data = await response.json() as { content?: string; error?: string; showContactForm?: boolean };

        /** 替换占位气泡为实际 AI 回复 */
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: data.content || data.error || t('ai.error'),
          };
          return updated;
        });

        /** AI 检测到联系意图时，自动追加联系表单气泡 */
        if (data.showContactForm) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '', type: 'contact-form' },
          ]);
          analytics.contactFormShown('ai', sessionIdRef.current);
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: t('ai.error') };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** 回车发送 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* 聊天窗口 — 象牙白面板 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[80vh]
                        bg-ivory border border-border-warm rounded-2xl shadow-whisper
                        flex flex-col z-50 overflow-hidden">

          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-cream bg-ivory/95">
            <h3 className="font-display font-medium text-feature text-text-primary">{t('ai.widgetTitle')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 模式切换标签 */}
          <div className="flex border-b border-border-cream">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => switchMode(mode.id)}
                className={`flex-1 px-3 py-2 text-body-sm font-sans font-medium transition-colors
                  ${activeMode === mode.id
                    ? 'text-terracotta border-b-2 border-terracotta bg-warm-sand/30'
                    : 'text-text-muted hover:text-text-secondary'
                  }`}
              >
                {t(mode.nameKey)}
              </button>
            ))}
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <>
                <div className="bg-warm-sand/50 rounded-lg p-3 text-body-sm font-sans text-text-secondary">
                  {t(chatModes.find((m) => m.id === activeMode)?.descriptionKey || 'ai.greeting')}
                </div>

                {/* 常驻联系按钮（仅 chat 模式 + 无消息时显示） */}
                {activeMode === 'chat' && (
                  <button
                    onClick={insertContactCard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5
                               rounded-full border border-terracotta/30 text-terracotta
                               text-label font-sans hover:bg-terracotta/5 transition-colors duration-200"
                  >
                    <span>📇</span>
                    <span>{t('ai.contactChip')}</span>
                  </button>
                )}
              </>
            )}

            {messages.map((msg, i) => {
              /** 联系表单气泡 */
              if (msg.type === 'contact-form') {
                return (
                  <div key={i} className="flex justify-start w-full">
                    <div className="w-full">
                      <ContactCard
                        context={messages.filter((m) => !m.type).slice(-10)}
                        sessionId={sessionIdRef.current}
                        onSubmitted={handleContactResult}
                      />
                    </div>
                  </div>
                );
              }

              /** 联系成功气泡 */
              if (msg.type === 'contact-success') {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-3 py-2 text-body-sm font-sans
                                    bg-green-50 text-green-800 border border-green-200">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              /** 联系失败气泡 */
              if (msg.type === 'contact-error') {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[85%] rounded-xl px-3 py-2 text-body-sm font-sans
                                    bg-red-50 text-red-800 border border-red-200">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              /** 普通文本气泡 */
              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-body-sm font-sans whitespace-pre-wrap
                      ${msg.role === 'user'
                        ? 'bg-terracotta text-ivory'
                        : 'bg-warm-sand text-text-primary border border-border-cream'
                      }`}
                  >
                    {msg.content || (isLoading && i === messages.length - 1 ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="ml-2 text-text-muted">{t('ai.thinking')}</span>
                      </span>
                    ) : '')}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-3 border-t border-border-cream">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.placeholder')}
                disabled={isLoading}
                className="flex-1 bg-white border border-border-warm rounded-lg px-3 py-2
                           text-body-sm font-sans text-text-primary
                           placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-focus-blue focus:border-focus-blue
                           disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-terracotta hover:brightness-110 disabled:bg-warm-sand
                           disabled:cursor-not-allowed rounded-lg text-ivory text-body-sm font-sans font-medium
                           transition-all duration-200"
              >
                {t('ai.send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 浮动启动按钮 — terracotta + 呼吸动画 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full z-50
                    bg-terracotta text-ivory
                    shadow-whisper
                    flex items-center justify-center transition-all duration-300
                    hover:brightness-110
                    ${!isOpen ? 'animate-breathe' : ''}`}
        aria-label={t('ai.widgetTitle')}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default AiAgentWidget;
