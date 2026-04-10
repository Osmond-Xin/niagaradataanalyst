'use client';

/**
 * 架构设计哲学页面客户端内容
 * 三个模块：ArchHero / PhilosophyPrinciples / ProjectShowcase
 */
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

/* ========== ArchHero — 页面头部 ========== */
const ArchHero: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="text-center space-y-5">
    <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest">
      Architecture · Design Philosophy
    </p>
    <h1 className="font-display font-medium text-subhead lg:text-subhead-lg text-text-primary leading-[1.10]">
      {t('architecture.hero.title')}
    </h1>
    <p className="text-body-lg font-sans text-text-secondary">
      {t('architecture.hero.subtitle')}
    </p>
    <p className="text-body font-sans text-text-muted max-w-2xl mx-auto">
      {t('architecture.hero.description')}
    </p>
  </section>
);

/* ========== 单条原则卡片 ========== */
interface PrincipleCardProps {
  number: number;
  titleKey: string;
  descKey: string;
  t: (key: string) => string;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({ number, titleKey, descKey, t }) => (
  <div className="bg-ivory border border-border-cream rounded-xl p-6 lg:p-8
                  shadow-whisper hover:shadow-ring-warm transition-all duration-300
                  hover:translate-y-[-2px]">
    <div className="text-feature font-display font-medium text-terracotta mb-3">
      #{String(number).padStart(2, '0')}
    </div>
    <h3 className="font-display font-medium text-body-serif text-text-primary mb-2">
      {t(titleKey)}
    </h3>
    <p className="text-body-sm font-sans text-text-muted leading-relaxed">
      {t(descKey)}
    </p>
  </div>
);

/* ========== 原则分组 ========== */
interface PrincipleGroupProps {
  groupTitleKey: string;
  principles: { number: number; titleKey: string; descKey: string }[];
  columns: string;
  t: (key: string) => string;
}

const PrincipleGroup: React.FC<PrincipleGroupProps> = ({
  groupTitleKey,
  principles,
  columns,
  t,
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <span className="px-3 py-1 rounded-full text-label font-sans font-medium
                       bg-terracotta/10 text-terracotta border border-terracotta/20">
        {t(groupTitleKey)}
      </span>
      <div className="flex-1 h-px bg-border-cream" />
    </div>
    <div className={`grid grid-cols-1 ${columns} gap-6`}>
      {principles.map((p) => (
        <PrincipleCard
          key={p.number}
          number={p.number}
          titleKey={p.titleKey}
          descKey={p.descKey}
          t={t}
        />
      ))}
    </div>
  </div>
);

/* ========== PhilosophyPrinciples — 10条设计哲学 ========== */
const PhilosophyPrinciples: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const groups: Omit<PrincipleGroupProps, 't'>[] = [
    {
      groupTitleKey: 'architecture.principles.groupA.title',
      columns: 'md:grid-cols-3',
      principles: [
        { number: 1, titleKey: 'architecture.principles.groupA.p1.title', descKey: 'architecture.principles.groupA.p1.description' },
        { number: 2, titleKey: 'architecture.principles.groupA.p2.title', descKey: 'architecture.principles.groupA.p2.description' },
        { number: 3, titleKey: 'architecture.principles.groupA.p3.title', descKey: 'architecture.principles.groupA.p3.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupB.title',
      columns: 'md:grid-cols-3',
      principles: [
        { number: 4, titleKey: 'architecture.principles.groupB.p4.title', descKey: 'architecture.principles.groupB.p4.description' },
        { number: 5, titleKey: 'architecture.principles.groupB.p5.title', descKey: 'architecture.principles.groupB.p5.description' },
        { number: 6, titleKey: 'architecture.principles.groupB.p6.title', descKey: 'architecture.principles.groupB.p6.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupC.title',
      columns: 'md:grid-cols-2',
      principles: [
        { number: 7, titleKey: 'architecture.principles.groupC.p7.title', descKey: 'architecture.principles.groupC.p7.description' },
        { number: 8, titleKey: 'architecture.principles.groupC.p8.title', descKey: 'architecture.principles.groupC.p8.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupD.title',
      columns: 'md:grid-cols-2',
      principles: [
        { number: 9, titleKey: 'architecture.principles.groupD.p9.title', descKey: 'architecture.principles.groupD.p9.description' },
        { number: 10, titleKey: 'architecture.principles.groupD.p10.title', descKey: 'architecture.principles.groupD.p10.description' },
      ],
    },
  ];

  return (
    <section className="space-y-10">
      <div className="text-center">
        <h2 className="font-display font-medium text-subhead-sm text-text-primary">
          {t('architecture.principles.sectionTitle')}
        </h2>
      </div>
      <div className="space-y-10">
        {groups.map((group) => (
          <PrincipleGroup key={group.groupTitleKey} {...group} t={t} />
        ))}
      </div>
    </section>
  );
};

/* ========== 时间线阶段（爱棋道专用） ========== */
const TimelinePhase: React.FC<{
  phase: number;
  titleKey: string;
  descKey: string;
  isLast?: boolean;
  t: (key: string) => string;
}> = ({ phase, titleKey, descKey, isLast, t }) => (
  <div className="flex-1 relative">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 rounded-full bg-terracotta/10 border border-terracotta/30
                      flex items-center justify-center text-terracotta text-sm font-sans font-bold shrink-0">
        {phase}
      </div>
      {!isLast && (
        <div className="flex-1 h-px bg-border-warm ml-2" />
      )}
    </div>
    <h4 className="text-body-sm font-sans font-semibold text-text-primary mb-1">{t(titleKey)}</h4>
    <p className="text-label font-sans text-text-muted leading-relaxed">{t(descKey)}</p>
  </div>
);

/* ========== ProjectShowcase — 项目架构案例 ========== */
const ProjectShowcase: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="font-display font-medium text-subhead-sm text-text-primary mb-2">
        {t('architecture.showcase.sectionTitle')}
      </h2>
      <p className="text-body font-sans text-text-muted">{t('architecture.showcase.sectionSubtitle')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* InterviewPass 卡片 */}
      <div className="bg-ivory border border-border-cream rounded-xl p-6 lg:p-8
                      shadow-whisper hover:translate-y-[-2px] transition-all duration-300">
        <h3 className="font-display font-medium text-subhead-sm text-text-primary mb-1">
          {t('architecture.showcase.interviewpass.title')}
        </h3>
        <p className="text-body-sm font-sans text-terracotta font-medium mb-5">
          {t('architecture.showcase.interviewpass.subtitle')}
        </p>

        <ul className="space-y-3 mb-6">
          {(['point1', 'point2', 'point3'] as const).map((key) => (
            <li key={key} className="flex items-start gap-2 text-body-sm font-sans text-text-secondary">
              <span className="text-terracotta mt-0.5 shrink-0">&#10003;</span>
              {t(`architecture.showcase.interviewpass.${key}`)}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {['#1', '#3'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-label font-sans font-medium
                           bg-terracotta/10 text-terracotta border border-terracotta/20"
              >
                {t('architecture.showcase.relatedPrinciples')} {tag}
              </span>
            ))}
          </div>
          <Link
            href="/case-study"
            className="inline-flex items-center gap-1 text-body-sm font-sans text-terracotta
                       hover:text-coral transition-colors"
          >
            {t('architecture.showcase.viewCaseStudy')} &rarr;
          </Link>
        </div>
      </div>

      {/* 爱棋道卡片 */}
      <div className="bg-ivory border border-border-cream rounded-xl p-6 lg:p-8
                      shadow-whisper hover:translate-y-[-2px] transition-all duration-300">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-display font-medium text-subhead-sm text-text-primary">
            {t('architecture.showcase.iqidao.title')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-label font-sans font-medium
                           bg-terracotta/10 text-terracotta border border-terracotta/20">
            {t('architecture.showcase.iqidao.yearsLabel')}
          </span>
        </div>
        <p className="text-body-sm font-sans text-terracotta font-medium mb-5">
          {t('architecture.showcase.iqidao.subtitle')}
        </p>

        {/* 时间线 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <TimelinePhase phase={1} titleKey="architecture.showcase.iqidao.phase1.title" descKey="architecture.showcase.iqidao.phase1.description" t={t} />
          <TimelinePhase phase={2} titleKey="architecture.showcase.iqidao.phase2.title" descKey="architecture.showcase.iqidao.phase2.description" t={t} />
          <TimelinePhase phase={3} titleKey="architecture.showcase.iqidao.phase3.title" descKey="architecture.showcase.iqidao.phase3.description" t={t} isLast />
        </div>

        {/* 总结 */}
        <div className="bg-warm-sand rounded-lg p-3 mb-5">
          <p className="text-body-sm font-sans text-text-secondary">{t('architecture.showcase.iqidao.summary')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['#1', '#6', '#7', '#8'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-label font-sans font-medium
                         bg-terracotta/10 text-terracotta border border-terracotta/20"
            >
              {t('architecture.showcase.relatedPrinciples')} {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ========== 主组件 ========== */
const ArchitectureContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <ArchHero t={t} />
      <PhilosophyPrinciples t={t} />
      <ProjectShowcase t={t} />
    </div>
  );
};

export default ArchitectureContent;
