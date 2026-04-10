'use client';

/**
 * H.E.A.D. 2026 竞赛作品展示
 * 信息层次：第一名奖状 → 竞赛背景 → 技术能力 → 精彩视频 → 完整仪表板 → 模块导航
 * 目标受众：忙且挑剔的潜在雇主，5 秒内建立权威感
 */
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

/* ─── 统计数据 ─── */
const STATS = [
  { value: '275,156', zh: '棵城市树木', en: 'City-owned trees' },
  { value: '15',      zh: '个市辖区',   en: 'Municipal wards' },
  { value: '98.9%',  zh: '物种匹配率', en: 'Species matched' },
  { value: '+4.47°C',zh: '2080年预测升温', en: 'Projected warming by 2080' },
];

/* ─── 技能卡片数据 ─── */
const SKILLS = [
  {
    stat: '275,156',
    zhStat: '条多源记录',
    enStat: 'multi-source records',
    zhTitle: '数据工程',
    enTitle: 'Data Engineering',
    zhDesc: '整合树木清查、气候记录（1866–2026）、物种弹性库、土地利用分类和路网数据，完成五源异构数据清洗管道。',
    enDesc: 'Built a multi-source ETL pipeline integrating tree inventory, climate records (1866–2026), species resilience DB, land use classification, and road network data.',
    icon: '🔧',
  },
  {
    stat: '98.9%',
    zhStat: 'GBIF 匹配率',
    enStat: 'GBIF match rate',
    zhTitle: 'API 集成 & 数据验证',
    enTitle: 'API Integration & Validation',
    zhDesc: '调用 GBIF Backbone Taxonomy API 对 299 个物种进行精确 + 属级双重匹配，实现对 275K 棵树的全量分类覆盖。',
    enDesc: 'Queried GBIF Backbone Taxonomy API with exact + genus-fallback matching for 299 species, achieving complete family classification across 275K records.',
    icon: '🔗',
  },
  {
    stat: '3',
    zhStat: '气候情景',
    enStat: 'climate horizons',
    zhTitle: '统计建模',
    enTitle: 'Statistical Modelling',
    zhDesc: '实现 IPCC AR5 脆弱性方程，构建暴露度 + 敏感性 − 适应能力的复合评分体系，覆盖 2030 / 2050 / 2080 三个气候预测节点。',
    enDesc: 'Implemented IPCC AR5 vulnerability equation (Exposure + Sensitivity − Adaptive Capacity) with ISA heat-index amplification for 2030, 2050, and 2080 projections.',
    icon: '📊',
  },
  {
    stat: '14/15',
    zhStat: '区超标',
    enStat: 'wards exceed cap',
    zhTitle: '数据可视化 & 决策支持',
    enTitle: 'Visualization & Decision Support',
    zhDesc: '输出区级脆弱性热力图、Santamour 多样性诊断、物种替换优先级矩阵，转化为可执行的重植行动计划。',
    enDesc: 'Delivered ward-level vulnerability maps, Santamour diversity diagnostics, and species replacement priority models — translating analysis into an actionable replanting plan.',
    icon: '🗺️',
  },
];

/* ─── 精彩视频数据 ─── */
const HIGHLIGHTS = [
  {
    src: '/head2026/presantation/act1_climate.mp4',
    zhTitle: '气候变化趋势',
    enTitle: 'Climate Trend',
    zhDesc: 'Hamilton 从 1866 年至今的气温演变实录。SSP2-4.5 情景下，2080 年预测夏季均温较基准升高 +4.47°C——城市热岛效应将加速恶化。',
    enDesc: 'Hamilton\'s temperature record from 1866 to present. Under SSP2-4.5, summer mean temperature is projected to rise +4.47°C by 2080, accelerating urban heat stress.',
    stat: '+4.47°C',
    zhStatLabel: '2080 年升温',
    enStatLabel: 'by 2080',
  },
  {
    src: '/head2026/presantation/act4b_vuln_evolution.mp4',
    zhTitle: '脆弱性演变轨迹',
    enTitle: 'Vulnerability Evolution',
    zhDesc: '15 个市辖区在 2030→2050→2080 三个节点的脆弱性评分动态演变。Ward 3 评分从 0.956 升至 1.423，成为最高风险区。',
    enDesc: 'Ward-level vulnerability scores evolving from 2030 → 2050 → 2080. Ward 3 rises from 0.956 to 1.423, establishing itself as the highest-risk zone.',
    stat: '1.423',
    zhStatLabel: 'Ward 3 峰值评分',
    enStatLabel: 'Ward 3 peak score',
  },
  {
    src: '/head2026/presantation/act5_solution.mp4',
    zhTitle: '重植策略',
    enTitle: 'Replanting Strategy',
    zhDesc: '综合建筑环境压力、气候脆弱性和生物多样性压力的重植优先级模型。推荐 10 个高弹性替代树种，其中 9 个来自全新属——有效打破 Acer 垄断。',
    enDesc: 'Priority replanting model combining built-environment stress, climate vulnerability, and biodiversity pressure. Recommends 10 high-resilience species — 9 from new genera, breaking Acer dominance.',
    stat: '0.966',
    zhStatLabel: 'Ward 3 优先级',
    enStatLabel: 'Ward 3 priority',
  },
];

/* ─── 分析模块导航 ─── */
const MODULES = [
  { step: '01', href: '/head2026/HTML/01_data_cleaning.html',       zhTitle: '数据清洗',         enTitle: 'Data Cleaning',           zhDesc: '五源异构数据整合与清洗',                    enDesc: 'Multi-source data integration' },
  { step: '02', href: '/head2026/HTML/02_gbif_validation.html',     zhTitle: '生物多样性验证',   enTitle: 'GBIF Validation',         zhDesc: 'GBIF API 物种分类交叉验证',               enDesc: 'GBIF API taxonomy cross-check' },
  { step: '03', href: '/head2026/HTML/03_santamour_analysis.html',  zhTitle: 'Santamour 分析',   enTitle: 'Santamour Analysis',      zhDesc: '10/20/30 法则多样性评估',                 enDesc: '10/20/30 diversity rule assessment' },
  { step: '04', href: '/head2026/HTML/04_vulnerability_score.html', zhTitle: '脆弱性评分',       enTitle: 'Vulnerability Score',     zhDesc: 'IPCC AR5 复合脆弱性评分体系',            enDesc: 'IPCC AR5 composite vulnerability' },
  { step: '05', href: '/head2026/HTML/05_replanting_strategy.html', zhTitle: '重植策略',         enTitle: 'Replanting Strategy',     zhDesc: '区级重植优先级与物种推荐',               enDesc: 'Ward-level priority & species recs' },
];

/* ════════════ 子组件 ════════════ */

/** 分节标题 */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="px-3 py-1 rounded-full text-label font-sans font-medium
                     bg-terracotta/10 text-terracotta border border-terracotta/20 flex-shrink-0">
      {label}
    </span>
    <div className="flex-1 h-px bg-border-cream dark:bg-border-dark" />
  </div>
);

/** 技能卡片 */
const SkillCard: React.FC<{ skill: typeof SKILLS[0]; lang: string }> = ({ skill, lang }) => (
  <div className="bg-ivory dark:bg-dark-surface border border-border-cream dark:border-border-dark
                  rounded-xl p-6 shadow-whisper hover:border-terracotta hover:shadow-ring-warm
                  transition-all duration-300 hover:translate-y-[-2px]">
    <div className="flex items-start justify-between mb-4">
      <span className="text-2xl">{skill.icon}</span>
      <div className="text-right">
        <div className="font-display font-medium text-feature text-terracotta leading-none">
          {skill.stat}
        </div>
        <div className="text-label font-sans text-text-muted mt-0.5">
          {lang === 'zh' ? skill.zhStat : skill.enStat}
        </div>
      </div>
    </div>
    <h3 className="font-display font-medium text-body-serif text-text-primary mb-2">
      {lang === 'zh' ? skill.zhTitle : skill.enTitle}
    </h3>
    <p className="text-body-sm font-sans text-text-muted leading-relaxed">
      {lang === 'zh' ? skill.zhDesc : skill.enDesc}
    </p>
  </div>
);

/** 视频高亮块（奇数左图右文，偶数左文右图） */
const VideoHighlight: React.FC<{ highlight: typeof HIGHLIGHTS[0]; index: number; lang: string }> = ({
  highlight, index, lang,
}) => {
  const isEven = index % 2 === 0;
  const video = (
    <div className="rounded-xl overflow-hidden border border-border-cream dark:border-border-dark
                    shadow-whisper bg-near-black">
      <video
        src={highlight.src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full block"
      />
    </div>
  );
  const text = (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-2">
          {lang === 'zh' ? `亮点 ${index + 1}` : `Highlight ${index + 1}`}
        </p>
        <h3 className="font-display font-medium text-subhead-sm text-text-primary leading-snug mb-3">
          {lang === 'zh' ? highlight.zhTitle : highlight.enTitle}
        </h3>
        <p className="text-body font-sans text-text-muted leading-relaxed">
          {lang === 'zh' ? highlight.zhDesc : highlight.enDesc}
        </p>
      </div>
      <div className="inline-flex items-baseline gap-2 pt-2">
        <span className="font-display font-medium text-feature text-terracotta">
          {highlight.stat}
        </span>
        <span className="text-body-sm font-sans text-text-muted">
          {lang === 'zh' ? highlight.zhStatLabel : highlight.enStatLabel}
        </span>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {isEven ? <>{video}{text}</> : <>{text}{video}</>}
    </div>
  );
};

/* ════════════ 主组件 ════════════ */

const HEAD2026Showcase: React.FC = () => {
  const { t, language } = useLanguage();
  const lang = language;

  return (
    <div className="space-y-20">

      {/* ══ 1. Hero：标题全宽 → 证书 + 右侧详情双列 ══ */}
      <section className="space-y-8">

        {/* 全宽标题区 — 先建立主题，再展示证据 */}
        <div className="space-y-3">
          <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest">
            {t('head2026.tag')}
          </p>
          <h1 className="font-display font-medium text-subhead lg:text-subhead-lg
                         text-text-primary leading-tight">
            {t('head2026.projectTitle')}
          </h1>
          <p className="text-body-lg font-sans text-text-secondary">
            {t('head2026.projectSubtitle')}
          </p>
        </div>

        {/* 双列：左=证书，右=第一名+详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">

          {/* 左：奖状图片（宽列，图片自然撑高） */}
          <div className="space-y-2.5">
            <a
              href="/resume/position_Yi Xin.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden
                         border-2 border-amber-200 dark:border-amber-700
                         shadow-[0_0_0_5px_theme(colors.amber.50)] dark:shadow-[0_0_0_5px_theme(colors.amber.950/30)]
                         hover:border-amber-400 dark:hover:border-amber-500
                         transition-all duration-300"
            >
              <Image
                src="/resume/position_Yi_Xin-1.png"
                alt={lang === 'zh' ? 'H.E.A.D. Competition 2026 第一名证书' : 'H.E.A.D. Competition 2026 First Prize Certificate'}
                width={2200}
                height={1700}
                className="w-full h-auto block"
                priority
              />
            </a>
            <a
              href="/resume/position_Yi Xin.pdf"
              download
              className="inline-flex items-center gap-1.5 text-body-sm font-sans
                         text-text-muted hover:text-terracotta transition-colors duration-200"
            >
              <span>↓</span>
              <span>{lang === 'zh' ? '下载 PDF' : 'Download PDF'}</span>
            </a>
          </div>

          {/* 右：第一名 → 主办 → 简介 → 数据 → 团队 */}
          <div className="flex flex-col gap-5">

            {/* 第一名徽章 */}
            <div className="inline-flex items-center gap-3 self-start
                            px-4 py-3 rounded-xl
                            bg-amber-50 dark:bg-amber-900/20
                            border-2 border-amber-300 dark:border-amber-600">
              <span className="text-2xl leading-none">🏆</span>
              <div>
                <p className="font-display font-medium text-feature text-amber-700 dark:text-amber-400 leading-none">
                  {t('head2026.firstPrize')}
                </p>
                <p className="text-label font-sans text-amber-600 dark:text-amber-500 mt-0.5">
                  {t('head2026.competition')}
                </p>
              </div>
            </div>

            {/* 主办信息 */}
            <div className="border-l-2 border-terracotta/30 pl-4 space-y-0.5">
              <p className="text-body-sm font-sans text-text-secondary">
                {t('head2026.organizer')}
              </p>
              <p className="text-body-sm font-sans text-text-muted">
                {t('head2026.university')} · {t('head2026.awardDate')}
              </p>
            </div>

            {/* 竞赛简介 */}
            <p className="text-body-sm font-sans text-text-muted leading-relaxed">
              {t('head2026.intro')}
            </p>

            {/* 四项核心数据 */}
            <div className="grid grid-cols-2 gap-2">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="bg-warm-sand dark:bg-dark-surface rounded-lg px-3 py-2.5
                             border border-border-cream dark:border-border-dark text-center"
                >
                  <div className="font-display font-medium text-feature text-terracotta leading-none">
                    {s.value}
                  </div>
                  <div className="text-label font-sans text-text-muted mt-1">
                    {lang === 'zh' ? s.zh : s.en}
                  </div>
                </div>
              ))}
            </div>

            {/* 团队成员 */}
            <div>
              <p className="text-label font-sans font-medium text-text-muted uppercase tracking-widest mb-2.5">
                {t('head2026.team')} · Team #20
              </p>
              <ul className="space-y-1.5">
                {['Susana Carolina Romero Aparicio', 'Su Myat Aung', 'Tessy Ramirez', 'Yi Xin'].map((name) => (
                  <li key={name} className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${name === 'Yi Xin' ? 'bg-terracotta' : 'bg-border-warm dark:bg-border-dark'}`} />
                    <span className={`text-body-sm font-sans ${name === 'Yi Xin' ? 'text-terracotta font-semibold' : 'text-text-secondary'}`}>
                      {name}
                      {name === 'Yi Xin' && (
                        <span className="ml-1.5 text-label text-text-muted font-normal">
                          {lang === 'zh' ? '（本人）' : '(me)'}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 3. 可迁移技术能力 ══ */}
      <section>
        <SectionLabel label={t('head2026.skillsTitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.zhTitle} skill={skill} lang={lang} />
          ))}
        </div>
      </section>

      {/* ══ 4. 分析亮点（动画视频）══ */}
      <section>
        <SectionLabel label={t('head2026.highlightsTitle')} />
        <div className="space-y-16">
          {HIGHLIGHTS.map((h, i) => (
            <VideoHighlight key={h.zhTitle} highlight={h} index={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* ══ 5. 分析模块快速导航 ══ */}
      <section>
        <SectionLabel label={t('head2026.modulesTitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Interactive Dashboard — 置顶，跨两列突出显示 */}
          <a
            href="/head2026/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group sm:col-span-2 lg:col-span-3 flex items-center gap-5 p-5 rounded-xl
                       bg-terracotta/5 dark:bg-terracotta/10
                       border border-terracotta/20 hover:border-terracotta
                       shadow-whisper hover:shadow-ring-warm
                       transition-all duration-300"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-terracotta text-ivory
                             flex items-center justify-center text-lg font-bold">
              ⊞
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-text-primary text-body-serif
                             group-hover:text-terracotta transition-colors duration-200">
                {lang === 'zh' ? '交互式分析仪表板' : 'Interactive Analysis Dashboard'}
              </p>
              <p className="text-body-sm font-sans text-text-muted mt-0.5">
                {lang === 'zh'
                  ? '五步分析流程 · 竞赛海报 · 演示视频 — 完整仪表板，在新窗口中打开'
                  : 'Five-step pipeline · Competition poster · Presentation videos — full dashboard in a new tab'}
              </p>
            </div>
            <span className="flex-shrink-0 text-terracotta text-sm font-medium
                             group-hover:translate-x-0.5 transition-transform duration-200">
              {t('head2026.openFull')} ↗
            </span>
          </a>

          {MODULES.map((mod) => (
            <a
              key={mod.step}
              href={mod.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-xl
                         bg-ivory dark:bg-dark-surface
                         border border-border-cream dark:border-border-dark
                         hover:border-terracotta shadow-whisper hover:shadow-ring-warm
                         transition-all duration-300 hover:translate-y-[-2px]"
            >
              <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-terracotta/10 text-terracotta
                               flex items-center justify-center font-mono text-sm font-bold">
                {mod.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-medium text-text-primary text-body-serif
                               group-hover:text-terracotta transition-colors duration-200 leading-snug">
                  {lang === 'zh' ? mod.zhTitle : mod.enTitle}
                </p>
                <p className="text-sm font-sans text-text-muted mt-1">
                  {lang === 'zh' ? mod.zhDesc : mod.enDesc}
                </p>
              </div>
              <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta
                               transition-colors duration-200 text-sm mt-0.5">↗</span>
            </a>
          ))}

          {/* 竞赛海报 */}
          <a
            href="/head2026/poster.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 rounded-xl
                       bg-amber-50 dark:bg-amber-900/10
                       border border-amber-200 dark:border-amber-800
                       hover:border-terracotta shadow-whisper hover:shadow-ring-warm
                       transition-all duration-300 hover:translate-y-[-2px]"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30
                             text-amber-700 dark:text-amber-400
                             flex items-center justify-center text-base">
              🖼
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-text-primary text-body-serif
                             group-hover:text-terracotta transition-colors duration-200 leading-snug">
                {lang === 'zh' ? '竞赛海报' : 'Competition Poster'}
              </p>
              <p className="text-sm font-sans text-text-muted mt-1">
                {lang === 'zh' ? '完整研究海报（含全部图表）' : 'Full poster with all charts & findings'}
              </p>
            </div>
            <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta
                             transition-colors duration-200 text-sm mt-0.5">↗</span>
          </a>

          {/* 演示视频 */}
          <a
            href="/head2026/presantation/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 rounded-xl
                       bg-teal-50 dark:bg-teal-900/10
                       border border-teal-200 dark:border-teal-800
                       hover:border-terracotta shadow-whisper hover:shadow-ring-warm
                       transition-all duration-300 hover:translate-y-[-2px]"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/30
                             text-teal-700 dark:text-teal-400
                             flex items-center justify-center text-base font-bold">
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-text-primary text-body-serif
                             group-hover:text-terracotta transition-colors duration-200 leading-snug">
                {lang === 'zh' ? '团队演示' : 'Team Presentation'}
              </p>
              <p className="text-sm font-sans text-text-muted mt-1">
                {lang === 'zh' ? 'Team #20 完整演示视频（8幕）' : 'Team #20 full 8-act video presentation'}
              </p>
            </div>
            <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta
                             transition-colors duration-200 text-sm mt-0.5">↗</span>
          </a>
        </div>
      </section>

    </div>
  );
};

export default HEAD2026Showcase;
