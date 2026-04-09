'use client';

/**
 * 英雄区块组件
 * Claude 编辑风：居中大标题（display 字体）+ 短副标题 + 单赤陶 CTA
 * 羊皮纸背景，无渐变，宽松行高，magazine 节奏
 */
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="section-light py-24 lg:py-40">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">

        {/* 居中编辑式布局 */}
        <div className="max-w-3xl mx-auto text-center">

          {/* 上标签 — 小号 sans，赤陶色，字间距 */}
          <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-6">
            {t('hero.overline')}
          </p>

          {/* 主标题 — display 字体，紧行高 */}
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-display text-text-primary leading-[1.10] mb-6">
            {t('hero.title')}
          </h1>

          {/* 副标题 — sans，宽松行高 */}
          <p className="text-body-lg font-sans text-text-secondary leading-relaxed mb-4">
            {t('hero.subtitle')}
          </p>

          {/* 描述段落 */}
          <p className="text-body font-sans text-text-muted leading-[1.6] mb-10 max-w-xl mx-auto">
            {t('hero.description')}
          </p>

          {/* CTA 区：主按钮（赤陶）+ 次按钮（暖沙） */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/case-study"
              className="inline-flex items-center px-6 py-3 rounded-lg
                         bg-terracotta text-ivory font-sans font-medium text-body-sm
                         shadow-btn-terracotta
                         hover:brightness-110 transition-all duration-200"
            >
              {t('hero.cta')}
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-lg
                         bg-warm-sand text-text-secondary font-sans font-medium text-body-sm
                         shadow-btn-sand
                         hover:text-text-primary transition-all duration-200"
            >
              {t('hero.secondary')}
            </Link>
          </div>
        </div>

        {/* 底部装饰分隔线 */}
        <div className="mt-24 flex items-center justify-center gap-8 text-text-muted">
          <div className="h-px flex-1 bg-border-cream" />
          <span className="text-label font-sans tracking-widest uppercase">{t('hero.tagline')}</span>
          <div className="h-px flex-1 bg-border-cream" />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
