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

  /** 信号颜色（暖色调色板）*/
  const signalColor = (signal: string) => {
    if (signal === 'bullish') return 'text-emerald-400';
    if (signal === 'bearish') return 'text-red-400';
    return 'text-amber-400';
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
        <p className="text-label font-sans font-medium text-terracotta uppercase tracking-widest mb-4">
          Data Analysis · Methodology
        </p>
        <h1 className="font-display font-medium text-subhead lg:text-subhead-lg text-text-primary leading-[1.10] mb-4">
          {t('dataAnalysis.pageTitle')}
        </h1>
        <p className="text-body font-sans text-text-secondary max-w-3xl mx-auto mb-8">
          {t('dataAnalysis.pageDescription')}
        </p>
        <div className="bg-ivory border border-border-cream rounded-xl p-6 max-w-2xl mx-auto shadow-whisper">
          <h3 className="font-sans font-medium text-text-primary mb-2">{t('dataAnalysis.overview')}</h3>
          <p className="text-body-sm font-sans text-text-muted">{t('dataAnalysis.overviewDescription')}</p>
        </div>
      </div>

      {/* 第一步：数据探索与清洗 */}
      <section>
        <h3 className="font-display font-medium text-feature text-text-primary mb-2">
          {t('dataAnalysis.step1.title')}
        </h3>
        <p className="text-body-sm font-sans text-text-muted mb-6">{t('dataAnalysis.step1.description')}</p>

        <div className="bg-dark-surface border border-border-dark rounded-xl p-6">
          <h4 className="text-text-on-dark font-sans font-medium mb-4">{t('dataAnalysis.step1.stats')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: t('dataAnalysis.step1.mean'), value: step1Data.mean.toFixed(2) },
              { label: t('dataAnalysis.step1.std'), value: step1Data.std.toFixed(2) },
              { label: t('dataAnalysis.step1.min'), value: step1Data.min.toFixed(2) },
              { label: t('dataAnalysis.step1.max'), value: step1Data.max.toFixed(2) },
              { label: t('dataAnalysis.step1.skewness'), value: step1Data.skewness.toFixed(4) },
              { label: t('dataAnalysis.step1.kurtosis'), value: step1Data.kurtosis.toFixed(4) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-near-black rounded-lg p-3 text-center">
                <p className="text-text-muted text-xs mb-1 font-sans">{label}</p>
                <p className="text-text-on-dark font-mono text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-text-muted text-xs mt-4 font-sans">
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
        <h3 className="font-display font-medium text-feature text-text-primary mb-2">
          {t('dataAnalysis.step4.title')}
        </h3>
        <p className="text-body-sm font-sans text-text-muted mb-6">{t('dataAnalysis.step4.description')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 信号汇总 */}
          <div className="bg-dark-surface border border-border-dark rounded-xl p-6">
            <h4 className="text-text-on-dark font-sans font-medium mb-4">
              {t('dataAnalysis.step4.signalSummary')}
            </h4>
            <div className="space-y-3">
              {[
                { label: 'RSI', signal: signalSummary.rsiSignal, value: `${signalSummary.rsiValue.toFixed(1)}` },
                { label: 'MACD', signal: signalSummary.macdSignal, value: `${signalSummary.macdValue.toFixed(4)}` },
                { label: 'Trend (20d)', signal: signalSummary.trendSignal, value: `${signalSummary.trendPct.toFixed(2)}%` },
              ].map(({ label, signal, value }) => (
                <div key={label} className="flex items-center justify-between bg-near-black rounded-lg p-3">
                  <span className="text-text-muted text-sm font-sans">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted font-mono text-sm">{value}</span>
                    <span className={`font-medium text-sm font-sans ${signalColor(signal)}`}>
                      {signalLabel(signal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 方法论总结 */}
          <div className="bg-ivory border border-border-cream rounded-xl p-6 shadow-whisper">
            <h4 className="text-text-primary font-sans font-medium mb-4">
              {t('dataAnalysis.step4.methodology')}
            </h4>
            <div className="space-y-3 text-body-sm text-text-secondary font-sans">
              {[
                { num: '01', key: 'dataAnalysis.step1.title', color: 'text-terracotta' },
                { num: '02', key: 'dataAnalysis.step2.title', color: 'text-coral' },
                { num: '03', key: 'dataAnalysis.step3.title', color: 'text-terracotta' },
                { num: '04', key: 'dataAnalysis.step4.title', color: 'text-coral' },
              ].map(({ num, key, color }) => (
                <div key={num} className="flex gap-3">
                  <span className={`${color} font-bold shrink-0`}>{num}</span>
                  <p>{t(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataAnalysisShowcase;
