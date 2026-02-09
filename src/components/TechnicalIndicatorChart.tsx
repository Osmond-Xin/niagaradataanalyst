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
        <h3 className="text-xl font-bold text-gray-100 mb-2">{t('dataAnalysis.step2.title')}</h3>
        <p className="text-gray-400 text-sm">{t('dataAnalysis.step2.description')}</p>
      </div>

      {/* 指标切换按钮 */}
      <div className="flex flex-wrap gap-2">
        {indicatorButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleIndicator(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${activeIndicators.has(key)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 价格图表 + MA/EMA/布林带 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step2.price')}</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={19} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#E5E7EB', fontSize: 12 }} />
              <Line type="monotone" dataKey="close" stroke="#E5E7EB" strokeWidth={1.5} dot={false} />
              {activeIndicators.has('ma') && (
                <>
                  <Line type="monotone" dataKey="ma20" stroke="#F59E0B" strokeWidth={1} dot={false} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="ma50" stroke="#EF4444" strokeWidth={1} dot={false} strokeDasharray="4 2" />
                </>
              )}
              {activeIndicators.has('ema') && (
                <>
                  <Line type="monotone" dataKey="ema12" stroke="#10B981" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="ema26" stroke="#8B5CF6" strokeWidth={1} dot={false} />
                </>
              )}
              {activeIndicators.has('bollinger') && (
                <>
                  <Line type="monotone" dataKey="bollingerUpper" stroke="#06B6D4" strokeWidth={1} dot={false} opacity={0.6} />
                  <Line type="monotone" dataKey="bollingerMiddle" stroke="#06B6D4" strokeWidth={1} dot={false} strokeDasharray="4 2" opacity={0.4} />
                  <Line type="monotone" dataKey="bollingerLower" stroke="#06B6D4" strokeWidth={1} dot={false} opacity={0.6} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 成交量 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step2.volume')}</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={19} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Bar dataKey="volume" fill="#3B82F6" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RSI面板 */}
      {activeIndicators.has('rsi') && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step2.rsi')}</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={19} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} domain={[0, 100]} />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" label={{ value: t('dataAnalysis.step2.overbought'), fill: '#EF4444', fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" label={{ value: t('dataAnalysis.step2.oversold'), fill: '#10B981', fontSize: 10 }} />
                <Line type="monotone" dataKey="rsi" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MACD面板 */}
      {activeIndicators.has('macd') && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-3">{t('dataAnalysis.step2.macd')}</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={19} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <ReferenceLine y={0} stroke="#6B7280" />
                <Bar dataKey="histogram" fill="#3B82F6" opacity={0.5} />
                <Line type="monotone" dataKey="macd" stroke="#EF4444" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="signal" stroke="#10B981" strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalIndicatorChart;
