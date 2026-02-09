/**
 * 关于页面（占位）
 * 展示个人简介和经验
 */
import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: '关于 - 产品×技术双栖 | 20年复合型人才',
  description: '产品经理+技术总监+数据分析师。20年产品与技术双栖经验，AWS双认证，PMP认证。About: Product Manager & Tech Director with 20 years of compound expertise.',
  keywords: ['产品经理', '技术总监', 'Product Manager', 'Tech Director', 'AWS认证', 'PMP', '数据分析师', 'Data Analyst', '全栈开发'],
};

export default function AboutPage() {
  return <AboutContent />;
}
