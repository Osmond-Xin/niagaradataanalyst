/**
 * 合成股票数据
 * 预生成的模拟数据，用于展示数据分析方法论
 * 基于真实市场特征生成（走势、波动率、成交量模式）
 * 运行时零API成本
 */
import type { StockDataPoint } from '@/types';

/**
 * 确定性伪随机数生成器（Mulberry32）
 * 使用种子确保每次生成相同的数据
 */
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 生成合成股票数据 (~200个交易日) */
function generateSyntheticData(): StockDataPoint[] {
  const random = seededRandom(42);
  const data: StockDataPoint[] = [];

  let price = 150; // 起始价格
  const startDate = new Date('2024-01-02');
  const tradingDays = 200;

  /** 模拟真实市场的趋势和波动 */
  const trendPhases = [
    { start: 0, end: 40, drift: 0.001, vol: 0.015 },    // 温和上涨
    { start: 40, end: 80, drift: 0.002, vol: 0.02 },     // 强势上涨
    { start: 80, end: 120, drift: -0.001, vol: 0.025 },  // 调整期
    { start: 120, end: 160, drift: 0.0005, vol: 0.018 }, // 震荡
    { start: 160, end: 200, drift: 0.0015, vol: 0.02 },  // 恢复上涨
  ];

  for (let i = 0; i < tradingDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i * 7 / 5)); // 跳过周末

    /** 获取当前阶段的趋势参数 */
    const phase = trendPhases.find((p) => i >= p.start && i < p.end) || trendPhases[trendPhases.length - 1];

    /** 几何布朗运动模拟价格变动 */
    const dailyReturn = phase.drift + phase.vol * (random() * 2 - 1);
    price = price * (1 + dailyReturn);
    price = Math.max(price, 80); // 价格下限

    /** 生成日内价格（开高低收） */
    const intraVol = price * 0.02;
    const open = price + (random() - 0.5) * intraVol * 0.5;
    const high = Math.max(open, price) + random() * intraVol;
    const low = Math.min(open, price) - random() * intraVol;
    const close = price;

    /** 成交量模式：趋势明确时成交量放大 */
    const baseVolume = 1000000 + random() * 500000;
    const volumeMultiplier = 1 + Math.abs(dailyReturn) * 20;
    const volume = Math.round(baseVolume * volumeMultiplier);

    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
  }

  return data;
}

/** 导出预生成的合成数据 */
export const syntheticStockData: StockDataPoint[] = generateSyntheticData();

// ==================== 技术指标计算函数 ====================

/** 计算简单移动平均线 (SMA) */
export function calculateMA(data: StockDataPoint[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, d) => acc + d.close, 0);
    return Math.round((sum / period) * 100) / 100;
  });
}

/** 计算指数移动平均线 (EMA) */
export function calculateEMA(data: StockDataPoint[], period: number): (number | null)[] {
  const multiplier = 2 / (period + 1);
  const result: (number | null)[] = [];

  let ema: number | null = null;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const sum = data.slice(0, period).reduce((acc, d) => acc + d.close, 0);
      ema = sum / period;
      result.push(Math.round(ema * 100) / 100);
    } else {
      ema = (data[i].close - ema!) * multiplier + ema!;
      result.push(Math.round(ema * 100) / 100);
    }
  }
  return result;
}

/** 计算RSI (相对强弱指标) */
export function calculateRSI(data: StockDataPoint[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(Math.round((100 - 100 / (1 + rs)) * 100) / 100);
    } else {
      /** 使用滑动窗口的Wilder平滑方式计算RSI */
      const recentGains = gains.slice(gains.length - period);
      const recentLosses = losses.slice(losses.length - period);
      const avgGain = recentGains.reduce((a, b) => a + b, 0) / period;
      const avgLossVal = recentLosses.reduce((a, b) => a + b, 0) / period;
      const rs = avgLossVal === 0 ? 100 : avgGain / avgLossVal;
      result.push(Math.round((100 - 100 / (1 + rs)) * 100) / 100);
    }
  }
  return result;
}

/** 计算MACD */
export function calculateMACD(data: StockDataPoint[]): {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
} {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const macdLine: (number | null)[] = data.map((_, i) => {
    if (ema12[i] === null || ema26[i] === null) return null;
    return Math.round((ema12[i]! - ema26[i]!) * 100) / 100;
  });

  /** 信号线：MACD的9日EMA */
  const signalLine: (number | null)[] = [];
  const multiplier = 2 / 10;
  let signalEma: number | null = null;
  let validCount = 0;

  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] === null) {
      signalLine.push(null);
    } else {
      validCount++;
      if (validCount < 9) {
        signalLine.push(null);
      } else if (validCount === 9) {
        let sum = 0;
        let count = 0;
        for (let j = i; count < 9; j--) {
          if (macdLine[j] !== null) {
            sum += macdLine[j]!;
            count++;
          }
        }
        signalEma = sum / 9;
        signalLine.push(Math.round(signalEma * 100) / 100);
      } else {
        signalEma = (macdLine[i]! - signalEma!) * multiplier + signalEma!;
        signalLine.push(Math.round(signalEma * 100) / 100);
      }
    }
  }

  const histogram: (number | null)[] = macdLine.map((m, i) => {
    if (m === null || signalLine[i] === null) return null;
    return Math.round((m - signalLine[i]!) * 100) / 100;
  });

  return { macd: macdLine, signal: signalLine, histogram };
}

/** 计算布林带 */
export function calculateBollinger(data: StockDataPoint[], period: number = 20, stdDev: number = 2): {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
} {
  const middle = calculateMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = middle[i]!;
      const variance = slice.reduce((acc, d) => acc + Math.pow(d.close - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      upper.push(Math.round((mean + stdDev * std) * 100) / 100);
      lower.push(Math.round((mean - stdDev * std) * 100) / 100);
    }
  }

  return { upper, middle, lower };
}

/** 计算日收益率 */
export function calculateReturns(data: StockDataPoint[]): number[] {
  return data.slice(1).map((d, i) => {
    return Math.round(((d.close - data[i].close) / data[i].close) * 10000) / 10000;
  });
}

/** 计算统计摘要 */
export function calculateStatistics(values: number[]): {
  mean: number; std: number; min: number; max: number; skewness: number; kurtosis: number;
} {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const skewness = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0) / n;
  const kurtosis = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0) / n - 3;

  return {
    mean: Math.round(mean * 10000) / 10000,
    std: Math.round(std * 10000) / 10000,
    min: Math.round(min * 10000) / 10000,
    max: Math.round(max * 10000) / 10000,
    skewness: Math.round(skewness * 10000) / 10000,
    kurtosis: Math.round(kurtosis * 10000) / 10000,
  };
}
