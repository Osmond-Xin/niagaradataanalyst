'use client';

/**
 * 关于页面客户端内容
 * 包含6个模块：ProfileHero、DualIdentity、CareerTimeline、Certifications、SkillRadar、KeyMetrics
 * 核心叙事：产品×技术双栖的稀缺复合型人才
 */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

// ==================== 数据定义 ====================

/** 职业时间线数据 */
const timelineEntries = [
  { id: 'unfc', type: 'tech' as const, isMilestone: false },
  { id: 'freelancer', type: 'both' as const, isMilestone: false },
  { id: 'bailongma', type: 'product' as const, isMilestone: false },
  { id: 'iqidao', type: 'both' as const, isMilestone: true },
  { id: 'trends', type: 'tech' as const, isMilestone: false },
  { id: 'pangu', type: 'product' as const, isMilestone: false },
  { id: 'startup', type: 'both' as const, isMilestone: false },
  { id: 'izp', type: 'tech' as const, isMilestone: false },
  { id: 'yisiteng', type: 'tech' as const, isMilestone: false },
  { id: 'zhongxun', type: 'tech' as const, isMilestone: true },
];

/** 产品侧能力项 */
const productItems = ['strategy', 'crossTeam', 'dataDecision', 'userExperience', 'platformArch'];

/** 技术侧能力项 */
const techItems = ['awsCert', 'fullStack', 'teamLead', 'availability', 'globalDelivery'];

/** 认证数据 */
const certifications = [
  { id: 'pmp', icon: '📋', color: 'amber' },
  { id: 'awsSaa', icon: '☁️', color: 'blue' },
  { id: 'awsSap', icon: '☁️', color: 'cyan' },
];

/** 教育数据 */
const educationEntries = [
  { id: 'bupt', icon: '🎓', color: 'purple' },
  { id: 'unfc', icon: '📊', color: 'green' },
];

/** 关键指标列表 */
const metricKeys = ['years', 'team', 'availability', 'certs', 'satisfaction', 'costReduction'];

/** 指标渐变色映射 */
const metricGradients: Record<string, string> = {
  years: 'from-amber-400 to-orange-400',
  team: 'from-blue-400 to-cyan-400',
  availability: 'from-green-400 to-emerald-400',
  certs: 'from-purple-400 to-pink-400',
  satisfaction: 'from-cyan-400 to-blue-400',
  costReduction: 'from-red-400 to-orange-400',
};

// ==================== 子组件 ====================

/** 模块1：个人简介头部 */
const ProfileHero: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="text-center space-y-6">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
      <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
        {t('about.hero.name')}
      </span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-300 font-medium">
      {t('about.hero.title')}
    </p>
    <p className="text-gray-500 flex items-center justify-center gap-2">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      {t('about.hero.location')}
    </p>

    {/* 核心定位语 */}
    <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 rounded-xl p-6">
      <p className="text-lg font-medium bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
        {t('about.hero.positioning')}
      </p>
    </div>

    {/* 社交链接 + 简历下载 */}
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <a
        href="https://github.com/Osmond-Xin"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/osmond-xin-92a736308/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <a
        href="/resume/Yi_Xin_Data_Analyst_Resume.pdf"
        download
        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {t('about.hero.downloadResume')}
      </a>
    </div>
  </section>
);

/** 模块2：双栖身份 */
const DualIdentity: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
          {t('about.dual.sectionTitle')}
        </span>
      </h2>
      <p className="text-gray-400">{t('about.dual.sectionSubtitle')}</p>
    </div>

    {/* 两列布局：产品 vs 技术 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 产品思维（琥珀色） */}
      <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
        <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          {t('about.dual.product.title')}
        </h3>
        <div className="space-y-3">
          {productItems.map((item) => (
            <div key={item} className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-gray-200 text-sm font-medium">{t(`about.dual.product.items.${item}`)}</p>
              <p className="text-gray-500 text-xs mt-1">{t(`about.dual.product.items.${item}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 技术纵深（蓝色） */}
      <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          {t('about.dual.tech.title')}
        </h3>
        <div className="space-y-3">
          {techItems.map((item) => (
            <div key={item} className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-gray-200 text-sm font-medium">{t(`about.dual.tech.items.${item}`)}</p>
              <p className="text-gray-500 text-xs mt-1">{t(`about.dual.tech.items.${item}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 交叉价值卡片（紫色，全宽） */}
    <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
      <h3 className="text-xl font-bold text-purple-400 mb-2 text-center">
        {t('about.dual.crossValue.title')}
      </h3>
      <p className="text-gray-500 text-sm text-center mb-6">{t('about.dual.crossValue.subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-purple-300 font-medium mb-1">{t('about.dual.crossValue.item1')}</p>
          <p className="text-gray-500 text-sm">{t('about.dual.crossValue.item1Desc')}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-purple-300 font-medium mb-1">{t('about.dual.crossValue.item2')}</p>
          <p className="text-gray-500 text-sm">{t('about.dual.crossValue.item2Desc')}</p>
        </div>
      </div>
    </div>
  </section>
);

/** 时间线类型标签颜色映射 */
const typeTagColors: Record<string, { bg: string; text: string; label: string }> = {
  product: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'about.timeline.tagProduct' },
  tech: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'about.timeline.tagTech' },
  both: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'about.timeline.tagBoth' },
};

/** 时间线节点颜色映射 */
const typeDotColors: Record<string, string> = {
  product: 'bg-amber-400',
  tech: 'bg-blue-400',
  both: 'bg-purple-400',
};

/** 里程碑发光色映射 */
const milestoneGlow: Record<string, string> = {
  product: 'shadow-amber-400/50',
  tech: 'shadow-blue-400/50',
  both: 'shadow-purple-400/50',
};

/** 模块3：职业时间线 */
const CareerTimeline: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
          {t('about.timeline.sectionTitle')}
        </span>
      </h2>
      <p className="text-gray-400">{t('about.timeline.sectionSubtitle')}</p>
    </div>

    <div className="relative">
      {/* 垂直线 */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />

      <div className="space-y-6">
        {timelineEntries.map((entry) => {
          const tag = typeTagColors[entry.type];
          return (
            <div key={entry.id} className="relative pl-10">
              {/* 圆点节点 */}
              <div
                className={`absolute left-2.5 top-2 rounded-full ${typeDotColors[entry.type]} ${
                  entry.isMilestone
                    ? 'w-4 h-4 -ml-0.5 shadow-lg ' + milestoneGlow[entry.type]
                    : 'w-3 h-3'
                }`}
              />

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:border-gray-700">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-gray-500 text-sm font-mono">
                    {t(`about.timeline.entries.${entry.id}.period`)}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag.bg} ${tag.text}`}>
                    {t(tag.label)}
                  </span>
                </div>
                <h4 className="text-gray-200 font-semibold">
                  {t(`about.timeline.entries.${entry.id}.title`)}
                </h4>
                <p className="text-gray-500 text-sm">
                  {t(`about.timeline.entries.${entry.id}.company`)}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {t(`about.timeline.entries.${entry.id}.description`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/** 认证卡片颜色映射 */
const certColorMap: Record<string, { gradient: string; border: string }> = {
  amber: { gradient: 'from-amber-500/5 to-orange-500/5', border: 'border-amber-500/20' },
  blue: { gradient: 'from-blue-500/5 to-cyan-500/5', border: 'border-blue-500/20' },
  cyan: { gradient: 'from-cyan-500/5 to-teal-500/5', border: 'border-cyan-500/20' },
  purple: { gradient: 'from-purple-500/5 to-pink-500/5', border: 'border-purple-500/20' },
  green: { gradient: 'from-green-500/5 to-emerald-500/5', border: 'border-green-500/20' },
};

/** 模块4：认证与教育 */
const Certifications: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t('about.certs.sectionTitle')}
        </span>
      </h2>
    </div>

    {/* 认证卡片 */}
    <div>
      <h3 className="text-gray-300 font-medium mb-4">{t('about.certs.certifications')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {certifications.map((cert) => {
          const colors = certColorMap[cert.color];
          return (
            <div
              key={cert.id}
              className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl p-5 text-center transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20`}
            >
              <span className="text-3xl mb-3 block">{cert.icon}</span>
              <p className="text-gray-200 font-semibold">{t(`about.certs.${cert.id}.name`)}</p>
              <p className="text-gray-500 text-sm mt-1">{t(`about.certs.${cert.id}.issuer`)}</p>
              <p className="text-gray-600 text-xs mt-1">{t(`about.certs.${cert.id}.year`)}</p>
            </div>
          );
        })}
      </div>
    </div>

    {/* 教育卡片 */}
    <div>
      <h3 className="text-gray-300 font-medium mb-4">{t('about.certs.education')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {educationEntries.map((edu) => {
          const colors = certColorMap[edu.color];
          return (
            <div
              key={edu.id}
              className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-xl p-5 text-center transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20`}
            >
              <span className="text-3xl mb-3 block">{edu.icon}</span>
              <p className="text-gray-200 font-semibold">{t(`about.certs.${edu.id}.name`)}</p>
              <p className="text-gray-500 text-sm mt-1">{t(`about.certs.${edu.id}.issuer`)}</p>
              <p className="text-gray-600 text-xs mt-1">{t(`about.certs.${edu.id}.year`)}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/** 模块5：技能雷达图 */
const SkillRadar: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const radarData = [
    { subject: t('about.radar.productStrategy'), value: 85, fullMark: 100 },
    { subject: t('about.radar.techLeadership'), value: 92, fullMark: 100 },
    { subject: t('about.radar.cloudArch'), value: 88, fullMark: 100 },
    { subject: t('about.radar.fullStackDev'), value: 90, fullMark: 100 },
    { subject: t('about.radar.dataAnalysis'), value: 78, fullMark: 100 },
    { subject: t('about.radar.crossFunc'), value: 87, fullMark: 100 },
  ];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t('about.radar.sectionTitle')}
          </span>
        </h2>
        <p className="text-gray-400">{t('about.radar.sectionSubtitle')}</p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#E5E7EB',
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

/** 模块6：关键数字墙 */
const KeyMetrics: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <section className="space-y-8">
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          {t('about.metrics.sectionTitle')}
        </span>
      </h2>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {metricKeys.map((key) => (
        <div
          key={key}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20"
        >
          <p className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${metricGradients[key]} bg-clip-text text-transparent`}>
            {t(`about.metrics.${key}.value`)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {t(`about.metrics.${key}.label`)}
          </p>
        </div>
      ))}
    </div>
  </section>
);

// ==================== 主组件 ====================

const AboutContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <ProfileHero t={t} />
      <DualIdentity t={t} />
      <CareerTimeline t={t} />
      <Certifications t={t} />
      <SkillRadar t={t} />
      <KeyMetrics t={t} />
    </div>
  );
};

export default AboutContent;
