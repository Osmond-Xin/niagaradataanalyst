/**
 * 架构设计哲学页面
 * 展示基于创业小团队的务实架构方法论与项目案例
 */
import type { Metadata } from 'next';
import ArchitectureContent from './ArchitectureContent';

export const metadata: Metadata = {
  title: '架构设计哲学 - 务实架构方法论 | Architecture Design Philosophy',
  description: '20年经验沉淀的10条实战架构原则，基于创业小团队的务实方法论。涵盖选型决策、工程纪律、运维保障、团队文化，附InterviewPass与爱棋道项目案例。',
  keywords: ['架构设计', '架构方法论', 'Architecture Philosophy', '无服务器', 'Serverless', 'AWS', '微服务', '系统架构', '技术选型'],
};

export default function ArchitecturePage() {
  return <ArchitectureContent />;
}
