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
  name: 'NiagaraDataAnalyst',
  jobTitle: 'AI & Data Architect | Software Architect',
  url: 'https://niagaradataanalyst.com',
  knowsAbout: [
    'Artificial Intelligence', 'Machine Learning', 'LLM Integration',
    'Software Architecture', 'Serverless Computing', 'AWS',
    'Data Analysis', 'Data Engineering', 'Data Pipeline',
    'Product Design', 'Product Development',
    'Prompt Engineering', 'RAG', 'MCP Protocol',
  ],
  description: '18年经验的软件架构师，专注于AI集成、数据工程和产品设计。AI-Era One-Person Army.',
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
