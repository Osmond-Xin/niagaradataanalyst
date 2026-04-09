'use client';

/**
 * AI技术理解与应用展示区块
 * Claude 编辑风：暗色区块 + 象牙白卡片 + 暖灰文字
 * 去掉彩色 border，统一用 dark-surface 边框
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/** AI技术卡片配置（全部用 terracotta 图标） */
const insightCards = [
  {
    key: 'promptEngineering',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    key: 'rag',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    key: 'agent',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    key: 'mcp',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.086-9.086a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 006.364 6.364l1.757-1.757" />
      </svg>
    ),
  },
  {
    key: 'vertexAi',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const AiInsightSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* 区块标题 */}
      <div>
        <h3 className="font-display font-medium text-subhead text-text-heading-dark leading-[1.10]">
          {t('aiInsight.sectionTitle')}
        </h3>
        <p className="text-body-sm font-sans text-text-on-dark mt-2 leading-[1.6]">
          {t('aiInsight.sectionDescription')}
        </p>
      </div>

      {/* 卡片网格 — 象牙白卡片在暗色区块内 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card) => (
          <div
            key={card.key}
            className="bg-dark-surface border border-border-dark rounded-xl p-5
                       hover:border-terracotta/40 transition-colors duration-300"
          >
            {/* 图标 — 赤陶色 */}
            <div className="text-terracotta mb-4">
              {card.icon}
            </div>
            {/* 标题 — display 字体 */}
            <h4 className="font-display font-medium text-feature text-text-heading-dark leading-[1.20] mb-2">
              {t(`aiInsight.${card.key}.title`)}
            </h4>
            {/* 描述 */}
            <p className="text-body-sm font-sans text-text-on-dark leading-[1.6]">
              {t(`aiInsight.${card.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsightSection;
