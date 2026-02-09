'use client';

/**
 * 案例研究页面客户端内容
 * 集成管道模拟器、架构图（动态导入）和AI理解展示
 */
import React from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import PipelineSimulator from '@/components/PipelineSimulator';
import AiInsightSection from '@/components/AiInsightSection';

/** 动态导入ReactFlow架构图（避免SSR问题） */
const InteractiveArch = dynamic(() => import('@/components/InteractiveArch'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Loading architecture diagram...</div>
    </div>
  ),
});

const CaseStudyContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t('caseStudy.pageTitle')}
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          {t('caseStudy.pageDescription')}
        </p>
      </div>

      {/* 管道模拟器 */}
      <section>
        <PipelineSimulator />
      </section>

      {/* 架构图 */}
      <section>
        <InteractiveArch />
      </section>

      {/* AI理解展示 */}
      <section>
        <AiInsightSection />
      </section>
    </div>
  );
};

export default CaseStudyContent;
