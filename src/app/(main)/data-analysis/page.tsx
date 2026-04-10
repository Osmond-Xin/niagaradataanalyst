/**
 * 数据分析页面 — H.E.A.D. Competition 2026
 * 展示 Hamilton Urban Forest 气候脆弱性分析竞赛作品与获奖证书
 */
import type { Metadata } from 'next';
import HEAD2026Showcase from '@/components/HEAD2026Showcase';

export const metadata: Metadata = {
  title: 'H.E.A.D. Competition 2026 — Hamilton Urban Forest Climate Vulnerability Analysis',
  description: 'H.E.A.D. Competition 2026 竞赛作品：Hamilton 城市森林气候脆弱性分析，涵盖数据清洗、GBIF验证、Santamour分析、脆弱性评分与重植策略五大模块。University of Niagara Falls Canada.',
  keywords: [
    'H.E.A.D. Competition', 'Hamilton Urban Forest', 'Climate Vulnerability',
    'Data Analysis', 'Urban Ecology', 'GIS', 'Python', 'Pandas',
    'Biodiversity', 'Replanting Strategy', 'Santamour Rule',
    '城市森林', '气候脆弱性', '数据分析竞赛',
  ],
};

export default function DataAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <HEAD2026Showcase />
    </div>
  );
}
