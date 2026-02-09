'use client';

/**
 * 英雄区块组件
 * 首页的主要展示区域，左侧文本右侧无限循环图标
 * 支持双语，暗色渐变美学，移动端上下堆叠
 */
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

/** 无限循环SVG图标 - 代表 Dev→Data→Insight 循环 */
const InfinityLoopIcon: React.FC = () => (
  <svg
    viewBox="0 0 200 100"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      {/* 动画路径 */}
      <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
        <stop offset="50%" stopColor="#06B6D4" stopOpacity="1" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* 无限循环路径 */}
    <path
      d="M50 50 C50 20, 90 20, 100 50 C110 80, 150 80, 150 50 C150 20, 110 20, 100 50 C90 80, 50 80, 50 50 Z"
      stroke="url(#loopGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* 动画流动效果 */}
    <circle r="4" fill="url(#flowGradient)">
      <animateMotion
        dur="4s"
        repeatCount="indefinite"
        path="M50 50 C50 20, 90 20, 100 50 C110 80, 150 80, 150 50 C150 20, 110 20, 100 50 C90 80, 50 80, 50 50 Z"
      />
    </circle>
    <circle r="4" fill="url(#flowGradient)" opacity="0.5">
      <animateMotion
        dur="4s"
        repeatCount="indefinite"
        begin="2s"
        path="M50 50 C50 20, 90 20, 100 50 C110 80, 150 80, 150 50 C150 20, 110 20, 100 50 C90 80, 50 80, 50 50 Z"
      />
    </circle>

    {/* 标签文字 */}
    <text x="35" y="55" fill="#3B82F6" fontSize="8" fontWeight="bold" textAnchor="middle">Dev</text>
    <text x="100" y="25" fill="#06B6D4" fontSize="8" fontWeight="bold" textAnchor="middle">Data</text>
    <text x="165" y="55" fill="#8B5CF6" fontSize="8" fontWeight="bold" textAnchor="middle">Insight</text>
  </svg>
);

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 左侧：文本内容 */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-medium mb-6">
              {t('hero.subtitle')}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {t('hero.description')}
            </p>
            <Link
              href="/case-study"
              className="inline-flex items-center px-6 py-3 rounded-lg
                         bg-gradient-to-r from-blue-600 to-cyan-600
                         hover:from-blue-500 hover:to-cyan-500
                         text-white font-medium transition-all duration-300
                         shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              {t('hero.cta')}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* 右侧：无限循环图标 */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="relative p-8">
              <InfinityLoopIcon />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
