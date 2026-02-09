'use client';

/**
 * 语言切换按钮组件
 * 在中文和英文之间切换，显示当前语言状态
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="px-3 py-1.5 rounded-md border border-gray-600 text-sm font-medium
                 hover:bg-gray-800 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <span className={language === 'zh' ? 'text-blue-400' : 'text-gray-400'}>中</span>
      <span className="text-gray-500 mx-1">/</span>
      <span className={language === 'en' ? 'text-blue-400' : 'text-gray-400'}>En</span>
    </button>
  );
};

export default LanguageToggle;
