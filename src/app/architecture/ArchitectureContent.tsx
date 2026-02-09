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
  <section className="text-center space-y-6">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
        {t('architecture.hero.title')}
      </span>
    </h1>
    <p className="text-xl sm:text-2xl text-gray-300">
      {t('architecture.hero.subtitle')}
    </p>
    <p className="text-gray-400 max-w-2xl mx-auto">
      {t('architecture.hero.description')}
    </p>
  </section>
);

/* ========== 单条原则卡片 ========== */
interface PrincipleCardProps {
  number: number;
  titleKey: string;
  descKey: string;
  colorClass: {
    gradient: string;
    border: string;
    hoverBorder: string;
    number: string;
  };
  t: (key: string) => string;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({
  number,
  titleKey,
  descKey,
  colorClass,
  t,
}) => (
  <div
    className={`bg-gradient-to-br ${colorClass.gradient} border ${colorClass.border} ${colorClass.hoverBorder} rounded-xl p-6 lg:p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20`}
  >
    <div className={`text-3xl font-bold mb-3 bg-gradient-to-r ${colorClass.number} bg-clip-text text-transparent`}>
      #{String(number).padStart(2, '0')}
    </div>
    <h3 className="text-lg font-bold text-gray-100 mb-2">
      {t(titleKey)}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {t(descKey)}
    </p>
  </div>
);

/* ========== 原则分组 ========== */
interface PrincipleGroupProps {
  groupTitleKey: string;
  principles: { number: number; titleKey: string; descKey: string }[];
  colorClass: {
    gradient: string;
    border: string;
    hoverBorder: string;
    number: string;
    badge: string;
  };
  columns: string;
  t: (key: string) => string;
}

const PrincipleGroup: React.FC<PrincipleGroupProps> = ({
  groupTitleKey,
  principles,
  colorClass,
  columns,
  t,
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass.badge}`}>
        {t(groupTitleKey)}
      </span>
    </div>
    <div className={`grid grid-cols-1 ${columns} gap-6`}>
      {principles.map((p) => (
        <PrincipleCard
          key={p.number}
          number={p.number}
          titleKey={p.titleKey}
          descKey={p.descKey}
          colorClass={colorClass}
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
      colorClass: {
        gradient: 'from-amber-500/5 to-orange-500/5',
        border: 'border-amber-500/20',
        hoverBorder: 'hover:border-amber-500/40',
        number: 'from-amber-400 to-orange-400',
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      },
      principles: [
        { number: 1, titleKey: 'architecture.principles.groupA.p1.title', descKey: 'architecture.principles.groupA.p1.description' },
        { number: 2, titleKey: 'architecture.principles.groupA.p2.title', descKey: 'architecture.principles.groupA.p2.description' },
        { number: 3, titleKey: 'architecture.principles.groupA.p3.title', descKey: 'architecture.principles.groupA.p3.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupB.title',
      columns: 'md:grid-cols-3',
      colorClass: {
        gradient: 'from-blue-500/5 to-cyan-500/5',
        border: 'border-blue-500/20',
        hoverBorder: 'hover:border-blue-500/40',
        number: 'from-blue-400 to-cyan-400',
        badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      },
      principles: [
        { number: 4, titleKey: 'architecture.principles.groupB.p4.title', descKey: 'architecture.principles.groupB.p4.description' },
        { number: 5, titleKey: 'architecture.principles.groupB.p5.title', descKey: 'architecture.principles.groupB.p5.description' },
        { number: 6, titleKey: 'architecture.principles.groupB.p6.title', descKey: 'architecture.principles.groupB.p6.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupC.title',
      columns: 'md:grid-cols-2',
      colorClass: {
        gradient: 'from-green-500/5 to-emerald-500/5',
        border: 'border-green-500/20',
        hoverBorder: 'hover:border-green-500/40',
        number: 'from-green-400 to-emerald-400',
        badge: 'bg-green-500/10 text-green-400 border border-green-500/20',
      },
      principles: [
        { number: 7, titleKey: 'architecture.principles.groupC.p7.title', descKey: 'architecture.principles.groupC.p7.description' },
        { number: 8, titleKey: 'architecture.principles.groupC.p8.title', descKey: 'architecture.principles.groupC.p8.description' },
      ],
    },
    {
      groupTitleKey: 'architecture.principles.groupD.title',
      columns: 'md:grid-cols-2',
      colorClass: {
        gradient: 'from-purple-500/5 to-pink-500/5',
        border: 'border-purple-500/20',
        hoverBorder: 'hover:border-purple-500/40',
        number: 'from-purple-400 to-pink-400',
        badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      },
      principles: [
        { number: 9, titleKey: 'architecture.principles.groupD.p9.title', descKey: 'architecture.principles.groupD.p9.description' },
        { number: 10, titleKey: 'architecture.principles.groupD.p10.title', descKey: 'architecture.principles.groupD.p10.description' },
      ],
    },
  ];

  return (
    <section className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
            {t('architecture.principles.sectionTitle')}
          </span>
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
    {/* 连接线 */}
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-sm font-bold shrink-0">
        {phase}
      </div>
      {!isLast && (
        <div className="flex-1 h-px bg-gradient-to-r from-green-500/40 to-green-500/10 ml-2" />
      )}
    </div>
    <h4 className="text-sm font-bold text-gray-200 mb-1">{t(titleKey)}</h4>
    <p className="text-gray-400 text-xs leading-relaxed">{t(descKey)}</p>
  </div>
);

/* ========== ProjectShowcase — 项目架构案例 ========== */
const ProjectShowcase: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          {t('architecture.showcase.sectionTitle')}
        </span>
      </h2>
      <p className="text-gray-400">{t('architecture.showcase.sectionSubtitle')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* InterviewPass 卡片 */}
      <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-6 lg:p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
        <h3 className="text-2xl font-bold text-gray-100 mb-1">
          {t('architecture.showcase.interviewpass.title')}
        </h3>
        <p className="text-blue-400 text-sm font-medium mb-5">
          {t('architecture.showcase.interviewpass.subtitle')}
        </p>

        <ul className="space-y-3 mb-6">
          {(['point1', 'point2', 'point3'] as const).map((key) => (
            <li key={key} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="text-cyan-400 mt-0.5 shrink-0">&#10003;</span>
              {t(`architecture.showcase.interviewpass.${key}`)}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {['#1', '#3'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                {t('architecture.showcase.relatedPrinciples')} {tag}
              </span>
            ))}
          </div>
          <Link
            href="/case-study"
            className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t('architecture.showcase.viewCaseStudy')} &rarr;
          </Link>
        </div>
      </div>

      {/* 爱棋道卡片 */}
      <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 rounded-xl p-6 lg:p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-2xl font-bold text-gray-100">
            {t('architecture.showcase.iqidao.title')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            {t('architecture.showcase.iqidao.yearsLabel')}
          </span>
        </div>
        <p className="text-green-400 text-sm font-medium mb-5">
          {t('architecture.showcase.iqidao.subtitle')}
        </p>

        {/* 时间线 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <TimelinePhase phase={1} titleKey="architecture.showcase.iqidao.phase1.title" descKey="architecture.showcase.iqidao.phase1.description" t={t} />
          <TimelinePhase phase={2} titleKey="architecture.showcase.iqidao.phase2.title" descKey="architecture.showcase.iqidao.phase2.description" t={t} />
          <TimelinePhase phase={3} titleKey="architecture.showcase.iqidao.phase3.title" descKey="architecture.showcase.iqidao.phase3.description" t={t} isLast />
        </div>

        {/* 总结 */}
        <div className="bg-gray-900/50 rounded-lg p-3 mb-5">
          <p className="text-gray-300 text-sm">{t('architecture.showcase.iqidao.summary')}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['#1', '#6', '#7', '#8'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <ArchHero t={t} />
      <PhilosophyPrinciples t={t} />
      <ProjectShowcase t={t} />
    </div>
  );
};

export default ArchitectureContent;
