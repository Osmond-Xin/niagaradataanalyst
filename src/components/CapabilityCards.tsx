'use client';

/**
 * 能力展示卡片组件
 * 展示三个核心能力领域：工程、AI与视觉、数据循环
 * 响应式网格布局，暗色主题卡片
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/** 能力卡片图标组件 */
const icons = {
  /** 工程能力图标 - Lambda符号 */
  engineering: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  /** AI与视觉图标 - 大脑/芯片 */
  ai: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  /** 数据循环图标 - 循环箭头 */
  data: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
};

/** 卡片颜色配置 */
const cardColors = {
  engineering: {
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300',
  },
  ai: {
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    icon: 'text-purple-400',
    badge: 'bg-purple-500/10 text-purple-300',
  },
  data: {
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20 hover:border-green-500/40',
    icon: 'text-green-400',
    badge: 'bg-green-500/10 text-green-300',
  },
};

/** 能力类型 */
type CapabilityKey = 'engineering' | 'ai' | 'data';

/** 卡片数据配置 */
const capabilities: CapabilityKey[] = ['engineering', 'ai', 'data'];

const CapabilityCards: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 区块标题 */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            {t('capabilities.sectionTitle')}
          </span>
        </h2>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((key) => {
            const colors = cardColors[key];
            return (
              <div
                key={key}
                className={`relative rounded-xl border bg-gradient-to-br ${colors.gradient} ${colors.border}
                           p-6 lg:p-8 transition-all duration-300 hover:translate-y-[-2px]
                           hover:shadow-lg hover:shadow-black/20`}
              >
                {/* 图标 */}
                <div className={`${colors.icon} mb-4`}>
                  {icons[key]}
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {t(`capabilities.${key}.title`)}
                </h3>

                {/* 描述 */}
                <p className="text-gray-300 font-medium mb-3">
                  {t(`capabilities.${key}.description`)}
                </p>

                {/* 详细说明 */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {t(`capabilities.${key}.details`)}
                </p>

                {/* 技术标签 */}
                <div className="flex flex-wrap gap-2">
                  {t(`capabilities.${key}.tech`).split(', ').map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilityCards;
