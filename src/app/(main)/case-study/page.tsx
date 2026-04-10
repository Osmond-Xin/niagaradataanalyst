/**
 * 案例研究页面
 * 展示InterviewPass项目的管道模拟器、架构图和AI理解内容
 */
import type { Metadata } from 'next';
import CaseStudyContent from './CaseStudyContent';

export const metadata: Metadata = {
  title: 'InterviewPass案例研究 - AI驱动的技术面试平台',
  description: 'InterviewPass案例研究：展示AI应用、系统架构、数据管道设计。AWS Lambda, Kinesis, Rekognition, Vertex AI集成。',
  keywords: ['InterviewPass', 'AI应用', '系统架构', '数据管道', 'AWS Lambda', 'Kinesis', 'Rekognition'],
};

export default function CaseStudyPage() {
  return <CaseStudyContent />;
}
