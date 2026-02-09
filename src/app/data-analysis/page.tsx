/**
 * 数据分析方法论页面
 * 展示技术指标分析和统计建模能力
 */
import type { Metadata } from 'next';
import DataAnalysisShowcase from '@/components/DataAnalysisShowcase';

export const metadata: Metadata = {
  title: '数据分析方法论 - 技术指标分析与统计建模',
  description: '展示数据分析全流程：数据探索、技术指标计算(MA/RSI/MACD)、统计建模、可视化分析。Data Analysis, Technical Indicators, Statistical Modeling.',
  keywords: ['数据分析', 'Data Analysis', '技术指标', 'Technical Indicators', '统计建模', 'Statistical Modeling', 'MA', 'RSI', 'MACD'],
};

export default function DataAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DataAnalysisShowcase />
    </div>
  );
}
