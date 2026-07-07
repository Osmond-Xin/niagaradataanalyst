/**
 * 关于页面（占位）
 * 展示个人简介和经验
 */
import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About — Data & AI-Application Engineer in Canada',
  description: 'Yi Xin — data & AI-application engineer with a compound product-and-engineering background. Master of Data Analytics in Canada (GPA 4.13/4.3), AWS SAA+SAP certified, PGWP-eligible. 关于：数据与 AI 应用工程师，产品×技术复合背景。',
  keywords: ['Data Engineer', 'AI Engineer', 'AI Application Engineer', 'LangGraph', 'RAG', 'Python', 'AWS认证', 'PGWP', 'Canada', '数据工程师', 'AI 应用工程师'],
};

export default function AboutPage() {
  return <AboutContent />;
}
