/**
 * 案例研究页面
 * 展示 job-hunt 项目的流水线模拟器、架构图和 AI 理解内容
 */
import type { Metadata } from 'next';
import CaseStudyContent from './CaseStudyContent';

export const metadata: Metadata = {
  title: 'job-hunt Case Study — Open-Source LangGraph Job-Search System',
  description: 'job-hunt case study: a LangGraph evaluation graph, an ATS/WebSearch discovery service, and a Playwright application assistant with a human-in-the-loop apply flow.',
  keywords: ['job-hunt', 'LangGraph', 'LangChain', 'RAG', 'Playwright', 'LLM agent', 'Python', 'pytest'],
};

export default function CaseStudyPage() {
  return <CaseStudyContent />;
}
