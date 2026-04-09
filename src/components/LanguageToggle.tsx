'use client';

/**
 * 语言切换按钮组件
 * Claude 编辑风：暖沙色边框，赤陶色激活态
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/lib/analytics';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  /** 切换语言并上报埋点 */
  const handleToggle = () => {
    const nextLang = language === 'zh' ? 'en' : 'zh';
    analytics.languageToggle(language, nextLang);
    setLanguage(nextLang);
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-1.5 rounded-md border border-border-warm dark:border-border-dark
                 text-label font-sans font-medium
                 hover:bg-warm-sand dark:hover:bg-dark-surface
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-focus-blue"
      aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      {/* 激活语言高亮为赤陶色，未激活为 muted */}
      <span className={language === 'zh' ? 'text-terracotta' : 'text-text-muted dark:text-text-on-dark'}>中</span>
      <span className="text-text-muted dark:text-text-on-dark mx-1">/</span>
      <span className={language === 'en' ? 'text-terracotta' : 'text-text-muted dark:text-text-on-dark'}>En</span>
    </button>
  );
};

export default LanguageToggle;
