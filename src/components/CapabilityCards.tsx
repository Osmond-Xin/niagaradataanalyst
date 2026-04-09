'use client';

/**
 * 能力展示卡片组件
 * Claude 编辑风：象牙白卡片 + 暖边框 + display 字体标题
 * 三栏编辑式 feature list，去掉渐变背景
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/** 能力类型 */
type CapabilityKey = 'engineering' | 'ai' | 'data';

/** 每张卡片使用的图标（赤陶色 stroke） */
const icons: Record<CapabilityKey, React.ReactNode> = {
  /** 工程能力图标 - Lambda 符号 */
  engineering: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  /** AI 与视觉图标 - 星芒 */
  ai: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  ),
  /** 数据循环图标 - 循环箭头 */
  data: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
};

const capabilities: CapabilityKey[] = ['engineering', 'ai', 'data'];

const CapabilityCards: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="section-light py-20 lg:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">

        {/* 区块标题 */}
        <div className="text-center mb-16">
          <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-4">
            {t('capabilities.sectionTitle')}
          </p>
          <h2 className="font-display font-medium text-subhead-lg text-text-primary leading-[1.30]">
            {t('capabilities.sectionHeading')}
          </h2>
        </div>

        {/* 三栏编辑式卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((key) => (
            <div
              key={key}
              className="bg-ivory border border-border-cream rounded-xl p-8
                         shadow-whisper hover:shadow-whisper transition-shadow duration-300"
            >
              {/* 图标 — 赤陶色 */}
              <div className="text-terracotta mb-5">
                {icons[key]}
              </div>

              {/* 标题 — display 字体 */}
              <h3 className="font-display font-medium text-feature text-text-primary leading-[1.20] mb-2">
                {t(`capabilities.${key}.title`)}
              </h3>

              {/* 描述 — 中号 sans，次级文字 */}
              <p className="text-body-sm font-sans font-medium text-text-secondary mb-3">
                {t(`capabilities.${key}.description`)}
              </p>

              {/* 详细说明 — 宽松行高 */}
              <p className="text-body-sm font-sans text-text-muted leading-[1.6] mb-5">
                {t(`capabilities.${key}.details`)}
              </p>

              {/* 技术标签 — 暖沙色背景 */}
              <div className="flex flex-wrap gap-2">
                {t(`capabilities.${key}.tech`).split(', ').map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded-md bg-warm-sand text-text-secondary font-sans text-label"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilityCards;
