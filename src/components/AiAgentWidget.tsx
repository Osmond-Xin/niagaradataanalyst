'use client';

/**
 * AI聊天小部件组件
 * Vertex AI驱动的浮动聊天窗口
 * 支持普通聊天和工作匹配两种模式
 * 呼吸动画启动按钮，流式响应显示
 */
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ChatMessage, ChatMode } from '@/types';

/** 聊天模式配置 */
const chatModes: ChatMode[] = [
  { id: 'chat', nameKey: 'ai.chatTab', descriptionKey: 'ai.greeting' },
  { id: 'job-match', nameKey: 'ai.jobMatchTab', descriptionKey: 'ai.jobMatchGreeting' },
];

const AiAgentWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'job-match'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 自动滚动到最新消息 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** 打开聊天窗口时聚焦输入框 */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /** 切换模式时重置消息 */
  const switchMode = (mode: 'chat' | 'job-match') => {
    setActiveMode(mode);
    setMessages([]);
  };

  /** 发送消息 */
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: activeMode,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        /** 处理流式响应 */
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
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
                } catch {
                  /* 忽略解析错误 */
                }
              }
            }
          }
        }
      } else {
        /** 处理非流式响应（回退模式） */
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content || data.error || t('ai.error') }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('ai.error') }]);
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
      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[80vh]
                        bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50
                        flex flex-col z-50 overflow-hidden">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/95">
            <h3 className="text-sm font-semibold text-gray-200">{t('ai.widgetTitle')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 模式切换标签 */}
          <div className="flex border-b border-gray-800">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => switchMode(mode.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors
                  ${activeMode === mode.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/30'
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {t(mode.nameKey)}
              </button>
            ))}
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* 欢迎消息 */}
            {messages.length === 0 && (
              <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-400">
                {t(chatModes.find((m) => m.id === activeMode)?.descriptionKey || 'ai.greeting')}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                    }`}
                >
                  {msg.content || (isLoading && i === messages.length - 1 ? t('ai.thinking') : '')}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.placeholder')}
                disabled={isLoading}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
                           disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors"
              >
                {t('ai.send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 浮动启动按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:right-6 w-14 h-14 rounded-full z-50
                    bg-gradient-to-r from-blue-600 to-cyan-600
                    hover:from-blue-500 hover:to-cyan-500
                    shadow-lg shadow-blue-500/30
                    flex items-center justify-center transition-all duration-300
                    ${!isOpen ? 'animate-breathe' : ''}`}
        aria-label={t('ai.widgetTitle')}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default AiAgentWidget;
