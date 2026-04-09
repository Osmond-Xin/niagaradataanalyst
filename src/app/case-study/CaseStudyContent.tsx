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
    <div className="h-96 bg-near-black border border-border-dark rounded-xl flex items-center justify-center">
      <div className="text-text-muted">Loading architecture diagram...</div>
    </div>
  ),
});

const CaseStudyContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* 页面标题 */}
      <div className="text-center">
        <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-4">
          InterviewPass · Case Study
        </p>
        <h1 className="font-display font-medium text-subhead lg:text-subhead-lg text-text-primary leading-[1.10] mb-4">
          {t('caseStudy.pageTitle')}
        </h1>
        <p className="text-body font-sans text-text-secondary max-w-3xl mx-auto">
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
