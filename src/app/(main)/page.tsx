/**
 * 首页
 * 包含英雄区块、能力展示卡片和JSON-LD结构化数据
 */
import HeroSection from '@/components/HeroSection';
import CapabilityCards from '@/components/CapabilityCards';

/** JSON-LD结构化数据：schema.org Person */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yi Xin',
  jobTitle: 'Data & AI-Application Engineer',
  url: 'https://niagaradataanalyst.com',
  knowsAbout: [
    'Artificial Intelligence', 'Machine Learning', 'LLM Applications',
    'LangGraph', 'LangChain', 'RAG', 'Retrieval-Augmented Generation',
    'Data Engineering', 'Data Pipelines', 'Python',
    'AWS', 'PostgreSQL', 'TimescaleDB',
    'Prompt Engineering', 'Playwright Automation',
  ],
  description: 'Data & AI-application engineer in Canada. Builds LLM agents, RAG pipelines, and data/IIoT backends. Master of Data Analytics; PGWP-eligible, no sponsorship required.',
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <CapabilityCards />
    </>
  );
}
