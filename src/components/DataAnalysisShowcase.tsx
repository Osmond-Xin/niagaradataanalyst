'use client';

/**
 * 数据分析方法论展示主组件
 * 整合4步分析流程：数据探索→指标计算→统计建模→结论
 * 使用合成数据，运行时零API成本
 */
import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { syntheticStockData, calculateReturns, calculateStatistics, calculateRSI, calculateMACD } from '@/data/synthetic-stock-data';
import TechnicalIndicatorChart from './TechnicalIndicatorChart';
import StatisticalModelPanel from './StatisticalModelPanel';

const DataAnalysisShowcase: React.FC = () => {
  const { t } = useLanguage();

  /** 第一步数据：统计摘要 */
  const step1Data = useMemo(() => {
    const closes = syntheticStockData.map((d) => d.close);
    return calculateStatistics(closes);
  }, []);

  /** 第四步数据：信号汇总 */
  const signalSummary = useMemo(() => {
    const rsi = calculateRSI(syntheticStockData);
    const lastRsi = rsi.filter((v) => v !== null).pop() || 50;
    const macd = calculateMACD(syntheticStockData);
    const lastMacd = macd.macd.filter((v) => v !== null).pop() || 0;
    const lastSignal = macd.signal.filter((v) => v !== null).pop() || 0;

    const lastClose = syntheticStockData[syntheticStockData.length - 1].close;
    const prev20Close = syntheticStockData[syntheticStockData.length - 21]?.close || lastClose;
    const trendPct = ((lastClose - prev20Close) / prev20Close * 100);

    return {
      rsiSignal: lastRsi > 70 ? 'overbought' : lastRsi < 30 ? 'oversold' : 'neutral',
      macdSignal: lastMacd > lastSignal ? 'bullish' : 'bearish',
      trendSignal: trendPct > 2 ? 'bullish' : trendPct < -2 ? 'bearish' : 'neutral',
      rsiValue: lastRsi,
      macdValue: lastMacd,
      trendPct,
    };
  }, []);

  /** 信号颜色 */
  const signalColor = (signal: string) => {
    if (signal === 'bullish') return 'text-green-400';
    if (signal === 'bearish') return 'text-red-400';
    return 'text-yellow-400';
  };

  const signalLabel = (signal: string) => {
    if (signal === 'bullish' || signal === 'overbought') return t('dataAnalysis.step4.bullish');
    if (signal === 'bearish' || signal === 'oversold') return t('dataAnalysis.step4.bearish');
    return t('dataAnalysis.step4.neutral');
  };

  return (
    <div className="space-y-16">
      {/* 概述 */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            {t('dataAnalysis.pageTitle')}
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-6">
          {t('dataAnalysis.pageDescription')}
        </p>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-gray-300 font-medium mb-2">{t('dataAnalysis.overview')}</h3>
          <p className="text-gray-500 text-sm">{t('dataAnalysis.overviewDescription')}</p>
        </div>
      </div>

      {/* 第一步：数据探索与清洗 */}
      <section>
        <h3 className="text-xl font-bold text-gray-100 mb-2">{t('dataAnalysis.step1.title')}</h3>
        <p className="text-gray-400 text-sm mb-6">{t('dataAnalysis.step1.description')}</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h4 className="text-gray-300 font-medium mb-4">{t('dataAnalysis.step1.stats')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: t('dataAnalysis.step1.mean'), value: step1Data.mean.toFixed(2) },
              { label: t('dataAnalysis.step1.std'), value: step1Data.std.toFixed(2) },
              { label: t('dataAnalysis.step1.min'), value: step1Data.min.toFixed(2) },
              { label: t('dataAnalysis.step1.max'), value: step1Data.max.toFixed(2) },
              { label: t('dataAnalysis.step1.skewness'), value: step1Data.skewness.toFixed(4) },
              { label: t('dataAnalysis.step1.kurtosis'), value: step1Data.kurtosis.toFixed(4) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-gray-200 font-mono text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-4">
            N = {syntheticStockData.length} trading days | Synthetic data (seed=42)
          </p>
        </div>
      </section>

      {/* 第二步：技术指标计算与可视化 */}
      <section>
        <TechnicalIndicatorChart />
      </section>

      {/* 第三步：统计建模 */}
      <section>
        <StatisticalModelPanel />
      </section>

      {/* 第四步：分析结论与决策框架 */}
      <section>
        <h3 className="text-xl font-bold text-gray-100 mb-2">{t('dataAnalysis.step4.title')}</h3>
        <p className="text-gray-400 text-sm mb-6">{t('dataAnalysis.step4.description')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 信号汇总 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h4 className="text-gray-300 font-medium mb-4">{t('dataAnalysis.step4.signalSummary')}</h4>
            <div className="space-y-3">
              {[
                { label: 'RSI', signal: signalSummary.rsiSignal, value: `${signalSummary.rsiValue.toFixed(1)}` },
                { label: 'MACD', signal: signalSummary.macdSignal, value: `${signalSummary.macdValue.toFixed(4)}` },
                { label: 'Trend (20d)', signal: signalSummary.trendSignal, value: `${signalSummary.trendPct.toFixed(2)}%` },
              ].map(({ label, signal, value }) => (
                <div key={label} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-sm">{value}</span>
                    <span className={`font-medium text-sm ${signalColor(signal)}`}>
                      {signalLabel(signal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 方法论总结 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h4 className="text-gray-300 font-medium mb-4">{t('dataAnalysis.step4.methodology')}</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold shrink-0">01</span>
                <p>{t('dataAnalysis.step1.title')}</p>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-bold shrink-0">02</span>
                <p>{t('dataAnalysis.step2.title')}</p>
              </div>
              <div className="flex gap-3">
                <span className="text-purple-400 font-bold shrink-0">03</span>
                <p>{t('dataAnalysis.step3.title')}</p>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">04</span>
                <p>{t('dataAnalysis.step4.title')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataAnalysisShowcase;
