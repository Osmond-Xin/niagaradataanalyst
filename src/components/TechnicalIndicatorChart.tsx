'use client';

/**
 * 技术指标图表组件
 * 使用Recharts展示K线叠加MA/EMA、RSI、MACD、布林带等技术指标
 * 支持用户交互切换不同指标组合
 */
import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, ComposedChart, Area,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  syntheticStockData, calculateMA, calculateEMA, calculateRSI,
  calculateMACD, calculateBollinger,
} from '@/data/synthetic-stock-data';

/** 可选指标类型 */
type IndicatorKey = 'ma' | 'ema' | 'rsi' | 'macd' | 'bollinger';

const TechnicalIndicatorChart: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndicators, setActiveIndicators] = useState<Set<IndicatorKey>>(() => new Set<IndicatorKey>(['ma']));

  /** 切换指标显示 */
  const toggleIndicator = (key: IndicatorKey) => {
    setActiveIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /** 预计算所有指标数据 */
  const chartData = useMemo(() => {
    const ma20 = calculateMA(syntheticStockData, 20);
    const ma50 = calculateMA(syntheticStockData, 50);
    const ema12 = calculateEMA(syntheticStockData, 12);
    const ema26 = calculateEMA(syntheticStockData, 26);
    const rsi = calculateRSI(syntheticStockData);
    const macd = calculateMACD(syntheticStockData);
    const bollinger = calculateBollinger(syntheticStockData);

    return syntheticStockData.map((d, i) => ({
      date: d.date.slice(5), // MM-DD格式
      close: d.close,
      volume: d.volume,
      ma20: ma20[i],
      ma50: ma50[i],
      ema12: ema12[i],
      ema26: ema26[i],
      rsi: rsi[i],
      macd: macd.macd[i],
      signal: macd.signal[i],
      histogram: macd.histogram[i],
      bollingerUpper: bollinger.upper[i],
      bollingerMiddle: bollinger.middle[i],
      bollingerLower: bollinger.lower[i],
    }));
  }, []);

  /** 指标按钮配置 */
  const indicatorButtons: { key: IndicatorKey; label: string }[] = [
    { key: 'ma', label: t('dataAnalysis.step2.ma') },
    { key: 'ema', label: t('dataAnalysis.step2.ema') },
    { key: 'rsi', label: t('dataAnalysis.step2.rsi') },
    { key: 'macd', label: t('dataAnalysis.step2.macd') },
    { key: 'bollinger', label: t('dataAnalysis.step2.bollinger') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-medium text-feature text-text-primary mb-2">
          {t('dataAnalysis.step2.title')}
        </h3>
        <p className="text-body-sm font-sans text-text-muted">{t('dataAnalysis.step2.description')}</p>
      </div>

      {/* 指标切换按钮 */}
      <div className="flex flex-wrap gap-2">
        {indicatorButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleIndicator(key)}
            className={`px-3 py-1.5 rounded-lg text-body-sm font-sans font-medium transition-colors
              ${activeIndicators.has(key)
                ? 'bg-terracotta text-ivory'
                : 'bg-warm-sand text-text-secondary hover:text-text-primary'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 价格图表 + MA/EMA/布林带 */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4">
        <h4 className="text-text-on-dark text-sm font-sans font-medium mb-3">{t('dataAnalysis.step2.price')}</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30302e" />
              <XAxis dataKey="date" stroke="#4d4c48" tick={{ fontSize: 10, fill: '#87867f' }} interval={19} />
              <YAxis stroke="#4d4c48" tick={{ fontSize: 11, fill: '#87867f' }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#30302e', border: '1px solid #4d4c48', borderRadius: '8px', color: '#faf9f5', fontSize: 12 }} />
              <Line type="monotone" dataKey="close" stroke="#faf9f5" strokeWidth={1.5} dot={false} />
              {activeIndicators.has('ma') && (
                <>
                  <Line type="monotone" dataKey="ma20" stroke="#c9a46a" strokeWidth={1} dot={false} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="ma50" stroke="#c96442" strokeWidth={1} dot={false} strokeDasharray="4 2" />
                </>
              )}
              {activeIndicators.has('ema') && (
                <>
                  <Line type="monotone" dataKey="ema12" stroke="#d97757" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="ema26" stroke="#8b5a3c" strokeWidth={1} dot={false} />
                </>
              )}
              {activeIndicators.has('bollinger') && (
                <>
                  <Line type="monotone" dataKey="bollingerUpper" stroke="#d4b896" strokeWidth={1} dot={false} opacity={0.6} />
                  <Line type="monotone" dataKey="bollingerMiddle" stroke="#d4b896" strokeWidth={1} dot={false} strokeDasharray="4 2" opacity={0.4} />
                  <Line type="monotone" dataKey="bollingerLower" stroke="#d4b896" strokeWidth={1} dot={false} opacity={0.6} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 成交量 */}
      <div className="bg-dark-surface border border-border-dark rounded-xl p-4">
        <h4 className="text-text-on-dark text-sm font-sans font-medium mb-3">{t('dataAnalysis.step2.volume')}</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30302e" />
              <XAxis dataKey="date" stroke="#4d4c48" tick={{ fontSize: 10, fill: '#87867f' }} interval={19} />
              <YAxis stroke="#4d4c48" tick={{ fontSize: 10, fill: '#87867f' }} />
              <Bar dataKey="volume" fill="#c96442" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RSI面板 */}
      {activeIndicators.has('rsi') && (
        <div className="bg-dark-surface border border-border-dark rounded-xl p-4">
          <h4 className="text-text-on-dark text-sm font-sans font-medium mb-3">{t('dataAnalysis.step2.rsi')}</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30302e" />
                <XAxis dataKey="date" stroke="#4d4c48" tick={{ fontSize: 10, fill: '#87867f' }} interval={19} />
                <YAxis stroke="#4d4c48" tick={{ fontSize: 11, fill: '#87867f' }} domain={[0, 100]} />
                <ReferenceLine y={70} stroke="#c96442" strokeDasharray="3 3" label={{ value: t('dataAnalysis.step2.overbought'), fill: '#c96442', fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#c9a46a" strokeDasharray="3 3" label={{ value: t('dataAnalysis.step2.oversold'), fill: '#c9a46a', fontSize: 10 }} />
                <Line type="monotone" dataKey="rsi" stroke="#c9a46a" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MACD面板 */}
      {activeIndicators.has('macd') && (
        <div className="bg-dark-surface border border-border-dark rounded-xl p-4">
          <h4 className="text-text-on-dark text-sm font-sans font-medium mb-3">{t('dataAnalysis.step2.macd')}</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30302e" />
                <XAxis dataKey="date" stroke="#4d4c48" tick={{ fontSize: 10, fill: '#87867f' }} interval={19} />
                <YAxis stroke="#4d4c48" tick={{ fontSize: 11, fill: '#87867f' }} />
                <ReferenceLine y={0} stroke="#4d4c48" />
                <Bar dataKey="histogram" fill="#c96442" opacity={0.5} />
                <Line type="monotone" dataKey="macd" stroke="#d97757" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="signal" stroke="#c9a46a" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalIndicatorChart;
