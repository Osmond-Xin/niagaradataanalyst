'use client';

/**
 * 统计建模面板组件
 * 展示收益率分布、相关性分析、回归和假设检验结果
 * 使用Recharts可视化统计数据
 */
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Line, LineChart, Cell,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { syntheticStockData, calculateReturns, calculateStatistics } from '@/data/synthetic-stock-data';

const StatisticalModelPanel: React.FC = () => {
  const { t } = useLanguage();

  /** 计算收益率和统计数据 */
  const analysisData = useMemo(() => {
    const returns = calculateReturns(syntheticStockData);
    const stats = calculateStatistics(returns);

    /** 收益率分布直方图数据 */
    const binCount = 30;
    const binWidth = (stats.max - stats.min) / binCount;
    const histogram = Array.from({ length: binCount }, (_, i) => {
      const binStart = stats.min + i * binWidth;
      const binEnd = binStart + binWidth;
      const count = returns.filter((r) => r >= binStart && r < binEnd).length;
      return {
        bin: `${(binStart * 100).toFixed(1)}%`,
        binCenter: (binStart + binEnd) / 2,
        count,
        /** 正态分布拟合值 */
        normal: Math.round(
          (returns.length * binWidth / (stats.std * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * Math.pow((binStart + binWidth / 2 - stats.mean) / stats.std, 2))
        ),
      };
    });

    /** 散点图数据：价格 vs 成交量 */
    const scatterData = syntheticStockData.slice(0, 100).map((d) => ({
      price: d.close,
      volume: d.volume / 1000000,
    }));

    /** 简单线性回归：前一日收益率 vs 当日收益率 */
    const regressionData = returns.slice(1).map((r, i) => ({
      x: returns[i],
      y: r,
    }));

    /** 计算回归系数 */
    const n = regressionData.length;
    const sumX = regressionData.reduce((a, d) => a + d.x, 0);
    const sumY = regressionData.reduce((a, d) => a + d.y, 0);
    const sumXY = regressionData.reduce((a, d) => a + d.x * d.y, 0);
    const sumXX = regressionData.reduce((a, d) => a + d.x * d.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const rSquared = Math.pow(
      (n * sumXY - sumX * sumY) /
      Math.sqrt((n * sumXX - sumX * sumX) * (n * regressionData.reduce((a, d) => a + d.y * d.y, 0) - sumY * sumY)),
      2,
    );

    /** 假设检验：均值是否显著不等于0（t检验） */
    const tStat = stats.mean / (stats.std / Math.sqrt(returns.length));
    const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));

    return { returns, stats, histogram, scatterData, regressionData, slope, intercept, rSquared, tStat, pValue };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-100 mb-2">{t('dataAnalysis.step3.title')}</h3>
        <p className="text-gray-400 text-sm">{t('dataAnalysis.step3.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收益率分布直方图 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step3.returnDistribution')}</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData.histogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="bin" stroke="#6B7280" tick={{ fontSize: 9, fill: '#9CA3AF' }} interval={4} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#E5E7EB', fontSize: 12 }} />
                <Bar dataKey="count" fill="#3B82F6" opacity={0.7} />
                <Bar dataKey="normal" fill="#F59E0B" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {t('dataAnalysis.step3.normalFit')}: μ={analysisData.stats.mean}, σ={analysisData.stats.std}
          </p>
        </div>

        {/* 散点图：价格 vs 成交量 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step3.correlationMatrix')}</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="price" stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} name="Price" />
                <YAxis dataKey="volume" stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} name="Volume (M)" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#E5E7EB', fontSize: 12 }} />
                <Scatter data={analysisData.scatterData} fill="#8B5CF6" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 回归分析 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step3.regression')}</h4>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="x" stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} name="R(t-1)" />
                <YAxis dataKey="y" stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} name="R(t)" />
                <Scatter data={analysisData.regressionData.slice(0, 100)} fill="#10B981" opacity={0.4} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p>y = {analysisData.slope.toFixed(4)}x + {analysisData.intercept.toFixed(6)}</p>
            <p>R² = {analysisData.rSquared.toFixed(4)}</p>
          </div>
        </div>

        {/* 假设检验结果 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step3.hypothesisTest')}</h4>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">H₀</p>
                <p className="text-gray-300 text-sm">μ = 0</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">H₁</p>
                <p className="text-gray-300 text-sm">μ ≠ 0</p>
              </div>
            </div>

            {/* 统计摘要 */}
            <div className="space-y-2">
              {[
                { label: 't-statistic', value: analysisData.tStat.toFixed(4) },
                { label: 'p-value', value: analysisData.pValue.toFixed(4) },
                { label: t('dataAnalysis.step1.mean'), value: analysisData.stats.mean.toFixed(6) },
                { label: t('dataAnalysis.step1.std'), value: analysisData.stats.std.toFixed(6) },
                { label: t('dataAnalysis.step1.skewness'), value: analysisData.stats.skewness.toFixed(4) },
                { label: t('dataAnalysis.step1.kurtosis'), value: analysisData.stats.kurtosis.toFixed(4) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-300 font-mono">{value}</span>
                </div>
              ))}
            </div>

            <div className={`rounded-lg p-3 text-sm font-medium ${
              analysisData.pValue < 0.05
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-gray-800/50 text-gray-400'
            }`}>
              {analysisData.pValue < 0.05
                ? 'p < 0.05 → Reject H₀ (significant)'
                : 'p ≥ 0.05 → Fail to reject H₀ (not significant)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 正态分布CDF近似（Abramowitz & Stegun公式） */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export default StatisticalModelPanel;
