'use client';

/**
 * Teammate competition showcase — English only, no navigation
 * Certificate image and highlighted name vary per person prop
 */
import React from 'react';
import Image from 'next/image';

export interface TeammatePerson {
  name: string;
  pdfPath: string;
  imagePath: string;
}

const STATS = [
  { value: '275,156', label: 'City-owned trees' },
  { value: '15',      label: 'Municipal wards' },
  { value: '98.9%',  label: 'Species matched' },
  { value: '+4.47°C',label: 'Projected warming by 2080' },
];

const SKILLS = [
  {
    stat: '275,156', statLabel: 'multi-source records',
    title: 'Data Engineering',
    desc: 'Built a multi-source ETL pipeline integrating tree inventory, climate records (1866–2026), species resilience DB, land use classification, and road network data.',
    icon: '🔧',
  },
  {
    stat: '98.9%', statLabel: 'GBIF match rate',
    title: 'API Integration & Validation',
    desc: 'Queried GBIF Backbone Taxonomy API with exact + genus-fallback matching for 299 species, achieving complete family classification across 275K records.',
    icon: '🔗',
  },
  {
    stat: '3', statLabel: 'climate horizons',
    title: 'Statistical Modelling',
    desc: 'Implemented IPCC AR5 vulnerability equation (Exposure + Sensitivity − Adaptive Capacity) with ISA heat-index amplification for 2030, 2050, and 2080 projections.',
    icon: '📊',
  },
  {
    stat: '14/15', statLabel: 'wards exceed cap',
    title: 'Visualization & Decision Support',
    desc: 'Delivered ward-level vulnerability maps, Santamour diversity diagnostics, and species replacement priority models — translating analysis into an actionable replanting plan.',
    icon: '🗺️',
  },
];

const HIGHLIGHTS = [
  {
    src: '/head2026/presantation/act1_climate.mp4',
    title: 'Climate Trend',
    desc: 'Hamilton\'s temperature record from 1866 to present. Under SSP2-4.5, summer mean temperature is projected to rise +4.47°C by 2080, accelerating urban heat stress.',
    stat: '+4.47°C', statLabel: 'by 2080',
  },
  {
    src: '/head2026/presantation/act4b_vuln_evolution.mp4',
    title: 'Vulnerability Evolution',
    desc: 'Ward-level vulnerability scores evolving from 2030 → 2050 → 2080. Ward 3 rises from 0.956 to 1.423, establishing itself as the highest-risk zone.',
    stat: '1.423', statLabel: 'Ward 3 peak score',
  },
  {
    src: '/head2026/presantation/act5_solution.mp4',
    title: 'Replanting Strategy',
    desc: 'Priority replanting model combining built-environment stress, climate vulnerability, and biodiversity pressure. Recommends 10 high-resilience species — 9 from new genera, breaking Acer dominance.',
    stat: '0.966', statLabel: 'Ward 3 priority',
  },
];

const MODULES = [
  { step: '01', href: '/head2026/HTML/01_data_cleaning.html',       title: 'Data Cleaning',        desc: 'Multi-source data integration' },
  { step: '02', href: '/head2026/HTML/02_gbif_validation.html',     title: 'GBIF Validation',      desc: 'GBIF API taxonomy cross-check' },
  { step: '03', href: '/head2026/HTML/03_santamour_analysis.html',  title: 'Santamour Analysis',   desc: '10/20/30 diversity rule assessment' },
  { step: '04', href: '/head2026/HTML/04_vulnerability_score.html', title: 'Vulnerability Score',  desc: 'IPCC AR5 composite vulnerability' },
  { step: '05', href: '/head2026/HTML/05_replanting_strategy.html', title: 'Replanting Strategy',  desc: 'Ward-level priority & species recs' },
];

const TEAM_NAMES = ['Susana Carolina Romero Aparicio', 'Su Myat Aung', 'Tessy Ramirez', 'Yi Xin'];

/* ─── Section label ─── */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="px-3 py-1 rounded-full text-label font-sans font-medium
                     bg-terracotta/10 text-terracotta border border-terracotta/20 flex-shrink-0">
      {label}
    </span>
    <div className="flex-1 h-px bg-border-cream" />
  </div>
);

/* ─── Skill card ─── */
const SkillCard: React.FC<{ skill: typeof SKILLS[0] }> = ({ skill }) => (
  <div className="bg-ivory border border-border-cream rounded-xl p-6 shadow-whisper
                  hover:border-terracotta hover:shadow-ring-warm
                  transition-all duration-300 hover:translate-y-[-2px]">
    <div className="flex items-start justify-between mb-4">
      <span className="text-2xl">{skill.icon}</span>
      <div className="text-right">
        <div className="font-display font-medium text-feature text-terracotta leading-none">{skill.stat}</div>
        <div className="text-label font-sans text-text-muted mt-0.5">{skill.statLabel}</div>
      </div>
    </div>
    <h3 className="font-display font-medium text-body-serif text-text-primary mb-2">{skill.title}</h3>
    <p className="text-body-sm font-sans text-text-muted leading-relaxed">{skill.desc}</p>
  </div>
);

/* ─── Video highlight ─── */
const VideoHighlight: React.FC<{ highlight: typeof HIGHLIGHTS[0]; index: number }> = ({ highlight, index }) => {
  const isEven = index % 2 === 0;
  const video = (
    <div className="rounded-xl overflow-hidden border border-border-cream shadow-whisper bg-near-black">
      <video src={highlight.src} autoPlay muted loop playsInline className="w-full block" />
    </div>
  );
  const text = (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-2">
          Highlight {index + 1}
        </p>
        <h3 className="font-display font-medium text-subhead-sm text-text-primary leading-snug mb-3">
          {highlight.title}
        </h3>
        <p className="text-body font-sans text-text-muted leading-relaxed">{highlight.desc}</p>
      </div>
      <div className="inline-flex items-baseline gap-2 pt-2">
        <span className="font-display font-medium text-feature text-terracotta">{highlight.stat}</span>
        <span className="text-body-sm font-sans text-text-muted">{highlight.statLabel}</span>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {isEven ? <>{video}{text}</> : <>{text}{video}</>}
    </div>
  );
};

/* ════════════ Main component ════════════ */

const TeammateShowcase: React.FC<{ person: TeammatePerson }> = ({ person }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

    {/* ══ 1. Hero ══ */}
    <section className="space-y-8">

      {/* Full-width header */}
      <div className="space-y-3">
        <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest">
          Award Winner
        </p>
        <h1 className="font-display font-medium text-subhead lg:text-subhead-lg text-text-primary leading-tight">
          Hamilton Urban Forest Climate Vulnerability Analysis
        </h1>
        <p className="text-body-lg font-sans text-text-secondary">
          Climate-Driven Vulnerability Assessment &amp; Urban Forest Replanting Strategy
        </p>
      </div>

      {/* Two columns: certificate left, details right */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">

        {/* Left: certificate */}
        <div className="space-y-2.5">
          <a
            href={person.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden
                       border-2 border-amber-200
                       shadow-[0_0_0_5px_theme(colors.amber.50)]
                       hover:border-amber-400 transition-all duration-300"
          >
            <Image
              src={person.imagePath}
              alt={`H.E.A.D. Competition 2026 First Prize Certificate — ${person.name}`}
              width={2200}
              height={1700}
              className="w-full h-auto block"
              priority
            />
          </a>
          <a
            href={person.pdfPath}
            download
            className="inline-flex items-center gap-1.5 text-body-sm font-sans
                       text-text-muted hover:text-terracotta transition-colors duration-200"
          >
            <span>↓</span>
            <span>Download PDF</span>
          </a>
        </div>

        {/* Right: details */}
        <div className="flex flex-col gap-5">

          {/* First prize badge */}
          <div className="inline-flex items-center gap-3 self-start px-4 py-3 rounded-xl
                          bg-amber-50 border-2 border-amber-300">
            <span className="text-2xl leading-none">🏆</span>
            <div>
              <p className="font-display font-medium text-feature text-amber-700 leading-none">First Prize</p>
              <p className="text-label font-sans text-amber-600 mt-0.5">H.E.A.D. Competition 2026</p>
            </div>
          </div>

          {/* Organizer */}
          <div className="border-l-2 border-terracotta/30 pl-4 space-y-0.5">
            <p className="text-body-sm font-sans text-text-secondary">
              Hosted by Mohawk College · McKeil School of Business
            </p>
            <p className="text-body-sm font-sans text-text-muted">
              University of Niagara Falls Canada · March 23, 2026
            </p>
          </div>

          {/* Description */}
          <p className="text-body-sm font-sans text-text-muted leading-relaxed">
            H.E.A.D. (Higher Education Analytics Data Competition) is a cross-institution
            analytics competition hosted by Mohawk College's McKeil School of Business,
            requiring teams to deliver end-to-end data analysis projects under time pressure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {STATS.map((s) => (
              <div key={s.value}
                className="bg-warm-sand rounded-lg px-3 py-2.5
                           border border-border-cream text-center">
                <div className="font-display font-medium text-feature text-terracotta leading-none">{s.value}</div>
                <div className="text-label font-sans text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Team */}
          <div>
            <p className="text-label font-sans font-medium text-text-muted uppercase tracking-widest mb-2.5">
              Team Members · Team #20
            </p>
            <ul className="space-y-1.5">
              {TEAM_NAMES.map((name) => (
                <li key={name} className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${name === person.name ? 'bg-terracotta' : 'bg-border-warm'}`} />
                  <span className={`text-body-sm font-sans ${name === person.name ? 'text-terracotta font-semibold' : 'text-text-secondary'}`}>
                    {name}
                    {name === person.name && (
                      <span className="ml-1.5 text-label text-text-muted font-normal">(me)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>

    {/* ══ 2. Transferable Technical Skills ══ */}
    <section>
      <SectionLabel label="Transferable Technical Skills" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SKILLS.map((skill) => <SkillCard key={skill.title} skill={skill} />)}
      </div>
    </section>

    {/* ══ 3. Analysis Highlights ══ */}
    <section>
      <SectionLabel label="Analysis Highlights" />
      <div className="space-y-16">
        {HIGHLIGHTS.map((h, i) => <VideoHighlight key={h.title} highlight={h} index={i} />)}
      </div>
    </section>

    {/* ══ 4. Analysis Modules ══ */}
    <section>
      <SectionLabel label="Analysis Modules" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Interactive Dashboard — full width */}
        <a href="/head2026/index.html" target="_blank" rel="noopener noreferrer"
          className="group sm:col-span-2 lg:col-span-3 flex items-center gap-5 p-5 rounded-xl
                     bg-terracotta/5 border border-terracotta/20 hover:border-terracotta
                     shadow-whisper hover:shadow-ring-warm transition-all duration-300">
          <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-terracotta text-ivory
                           flex items-center justify-center text-lg font-bold">⊞</span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-medium text-text-primary text-body-serif
                           group-hover:text-terracotta transition-colors duration-200">
              Interactive Analysis Dashboard
            </p>
            <p className="text-body-sm font-sans text-text-muted mt-0.5">
              Five-step pipeline · Competition poster · Presentation videos — full dashboard in a new tab
            </p>
          </div>
          <span className="flex-shrink-0 text-terracotta text-sm font-medium
                           group-hover:translate-x-0.5 transition-transform duration-200">
            Open in New Tab ↗
          </span>
        </a>

        {MODULES.map((mod) => (
          <a key={mod.step} href={mod.href} target="_blank" rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 rounded-xl bg-ivory
                       border border-border-cream hover:border-terracotta
                       shadow-whisper hover:shadow-ring-warm transition-all duration-300 hover:translate-y-[-2px]">
            <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-terracotta/10 text-terracotta
                             flex items-center justify-center font-mono text-sm font-bold">{mod.step}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-text-primary text-body-serif
                             group-hover:text-terracotta transition-colors duration-200 leading-snug">{mod.title}</p>
              <p className="text-sm font-sans text-text-muted mt-1">{mod.desc}</p>
            </div>
            <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta transition-colors duration-200 text-sm mt-0.5">↗</span>
          </a>
        ))}

        <a href="/head2026/poster.html" target="_blank" rel="noopener noreferrer"
          className="group flex items-start gap-4 p-5 rounded-xl bg-amber-50
                     border border-amber-200 hover:border-terracotta
                     shadow-whisper hover:shadow-ring-warm transition-all duration-300 hover:translate-y-[-2px]">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-100 text-amber-700
                           flex items-center justify-center text-base">🖼</span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-medium text-text-primary text-body-serif
                           group-hover:text-terracotta transition-colors duration-200 leading-snug">Competition Poster</p>
            <p className="text-sm font-sans text-text-muted mt-1">Full poster with all charts &amp; findings</p>
          </div>
          <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta transition-colors duration-200 text-sm mt-0.5">↗</span>
        </a>

        <a href="/head2026/presantation/presentation.html" target="_blank" rel="noopener noreferrer"
          className="group flex items-start gap-4 p-5 rounded-xl bg-teal-50
                     border border-teal-200 hover:border-terracotta
                     shadow-whisper hover:shadow-ring-warm transition-all duration-300 hover:translate-y-[-2px]">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-teal-100 text-teal-700
                           flex items-center justify-center text-base font-bold">▶</span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-medium text-text-primary text-body-serif
                           group-hover:text-terracotta transition-colors duration-200 leading-snug">Team Presentation</p>
            <p className="text-sm font-sans text-text-muted mt-1">Team #20 full 8-act video presentation</p>
          </div>
          <span className="flex-shrink-0 text-text-muted group-hover:text-terracotta transition-colors duration-200 text-sm mt-0.5">↗</span>
        </a>

      </div>
    </section>

    {/* ══ CityLAB Project Showcase — April 7, 2026 ══ */}
    <section>
      <SectionLabel label="CityLAB Project Showcase" />

      {/* Event announcement */}
      <div className="mb-6 flex flex-col sm:flex-row items-start gap-4
                      p-5 rounded-xl bg-blue-50 border border-blue-200">
        <span className="flex-shrink-0 text-3xl leading-none mt-0.5">🏙️</span>
        <div className="space-y-1.5">
          <p className="font-display font-medium text-body-serif text-text-primary leading-snug">
            Invited to Winter 2026 CityLAB Project Showcase
          </p>
          <p className="text-body-sm font-sans text-text-muted">
            April 7, 2026 · 1:00 PM – 3:30 PM · 58 Jackson St W · CityLAB Space
          </p>
          <p className="text-body-sm font-sans text-text-muted leading-relaxed">
            As first-prize winners of H.E.A.D. 2026, our team was invited by CityLAB to present at the
            Winter 2026 Project Showcase. We prepared an infographic poster and a 3-minute presentation
            to share our Hamilton Urban Forest Climate Vulnerability Analysis with urban planners and
            community partners.
          </p>
        </div>
      </div>

      {/* Materials grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: PDF Downloads */}
        <div className="space-y-3">
          <p className="text-label font-sans font-medium text-text-muted uppercase tracking-widest">
            Presentation Materials
          </p>
          <a
            href="/head2026/City Lab Presentation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-xl bg-ivory
                       border border-border-cream hover:border-terracotta
                       shadow-whisper hover:shadow-ring-warm transition-all duration-300"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-terracotta/10 text-terracotta
                             flex items-center justify-center text-lg">📋</span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-body-serif text-text-primary
                             group-hover:text-terracotta transition-colors duration-200 leading-snug">
                CityLAB Presentation
              </p>
              <p className="text-sm font-sans text-text-muted mt-0.5">PDF</p>
            </div>
            <span className="flex-shrink-0 text-terracotta text-sm font-medium
                             group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
          </a>
          <a
            href="/head2026/CityLab Infographic.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-xl bg-ivory
                       border border-border-cream hover:border-terracotta
                       shadow-whisper hover:shadow-ring-warm transition-all duration-300"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100
                             text-amber-700 flex items-center justify-center text-lg">🖼</span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-body-serif text-text-primary
                             group-hover:text-terracotta transition-colors duration-200 leading-snug">
                CityLAB Infographic Poster
              </p>
              <p className="text-sm font-sans text-text-muted mt-0.5">PDF</p>
            </div>
            <span className="flex-shrink-0 text-terracotta text-sm font-medium
                             group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
          </a>
        </div>

        {/* Right: Canva embedded interactive infographic */}
        <div className="space-y-3">
          <p className="text-label font-sans font-medium text-text-muted uppercase tracking-widest">
            Interactive Infographic
          </p>
          <div className="rounded-xl overflow-hidden border border-border-cream shadow-whisper">
            <iframe
              src="https://www.canva.com/design/DAHFGQaB1-o/2Z61hedjKJL2WgK1xv0zOQ/view?embed"
              className="w-full aspect-video block"
              allowFullScreen
              loading="lazy"
              title="CityLAB Interactive Infographic"
            />
          </div>
          <a
            href="https://www.canva.com/design/DAHFGQaB1-o/2Z61hedjKJL2WgK1xv0zOQ/view?utm_content=DAHFGQaB1-o&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he6b310ba46"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-body-sm font-sans
                       text-text-muted hover:text-terracotta transition-colors duration-200"
          >
            <span>View full size on Canva</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </section>

  </div>
);

export default TeammateShowcase;
