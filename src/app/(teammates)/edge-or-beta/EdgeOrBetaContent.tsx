'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';

// Define ResultBundle type structure
interface Trade {
  ticker: string;
  signal_date: string;
  entry_date: string;
  exit_date: string;
  entry_price: number;
  exit_price: number;
  gross_return: number;
  net_return: number;
  spy_return: number;
  rsi_at_signal: number;
  consecutive_at_signal: number;
}

interface ResultBundle {
  schema_version: string;
  run_id: string;
  created_at: string;
  rule: {
    id: string;
    label: string;
    params: Record<string, any>;
  };
  settings: {
    universe: string;
    start: string;
    end: string;
    hold_days: number;
    commission: number;
    top_k: number;
    n_null: number;
    seed: number;
  };
  data_quality: {
    tickers_requested: number;
    tickers_used: number;
    trades: number;
    warnings: string[];
  };
  strategy: {
    cagr: number;
    sharpe: number;
    win_rate: number;
    profit_factor: number;
    max_drawdown: number;
    composite: number;
    equity_curve: Array<{ date: string; value: number }>;
  };
  benchmarks: {
    random_stock_same_dates: {
      metric: string;
      mean: number;
      median: number;
      p_value: number;
      percentile: number;
      distribution: number[];
    };
    random_etf_timing: {
      metric: string;
      mean: number;
      median: number;
      p_value: number;
      percentile: number;
      distribution: number[];
    };
    buy_hold_spy: {
      cagr: number;
      sharpe: number;
      max_drawdown: number;
      equity_curve: Array<{ date: string; value: number }>;
    };
  };
  decomposition: {
    alpha_annualized: number;
    alpha_t: number;
    alpha_p: number;
    beta: number;
    beta_share: number | null;
    method: string;
  };
  verdict: {
    status: string;
    headline: string;
    headline_zh: string;
    reasons: string[];
  };
}

export default function EdgeOrBetaContent() {
  const { language, setLanguage } = useLanguage();
  const [selectedRule, setSelectedRule] = useState<string>('capstone_expiry_rule');
  const [bundle, setBundle] = useState<ResultBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChartTab, setActiveChartTab] = useState<'equity' | 'distribution'>('equity');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    fetch(`/edge-or-beta/demo_results/${selectedRule}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load JSON preset');
        return res.json();
      })
      .then((data) => {
        setBundle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedRule, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center font-sans">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading visual engine...</p>
        </div>
      </div>
    );
  }

  // Bilingual UI Dictionary
  const ui = {
    title: language === 'zh' ? 'Edge or Beta? — 策略归因检验工具' : 'Edge or Beta? — Strategy Attribution Tester',
    subtitle: language === 'zh' 
      ? '一个客观的量化工具，旨在检验技术指标规则在扣除交易费用后，能否战胜随机选股、随机择时和被动大盘指数。' 
      : 'An anti-hype quantitative tool to verify if a technical trading rule beats random stock picks, random timing, and passive indexing after transaction costs.',
    presetLabel: language === 'zh' ? '选择规则预设：' : 'Select Strategy Preset:',
    capstoneLabel: language === 'zh' ? 'Capstone 周期反转' : 'Capstone Expiry Reversal',
    rsiLabel: language === 'zh' ? '简单 RSI 超卖' : 'Simple RSI Oversold',
    maLabel: language === 'zh' ? '均线金叉 (SMA 9/50)' : 'MA Crossover (SMA 9/50)',
    verdictTitle: language === 'zh' ? '检验判决报告' : 'Attribution Verdict',
    metricsTitle: language === 'zh' ? '对照基准指标' : 'Attribution Metrics Comparison',
    chartTitle: language === 'zh' ? '可视化归因分析' : 'Attribution Visualizations',
    equityTab: language === 'zh' ? '累计净值曲线' : 'Equity Curve',
    distTab: language === 'zh' ? '蒙特卡洛随机选股分布' : 'Monte Carlo Stock Selection',
    capmTitle: language === 'zh' ? 'CAPM 风险与超额收益归因 (Alpha/Beta)' : 'CAPM Attribution Panel (Alpha/Beta)',
    methodologyTitle: language === 'zh' ? '学术检验方法与常见问题' : 'Methodology & Technical FAQ',
    cagr: language === 'zh' ? '年化收益率 (CAGR)' : 'Annualized Return (CAGR)',
    sharpe: language === 'zh' ? '夏普比率 (Sharpe)' : 'Sharpe Ratio',
    winRate: language === 'zh' ? '胜率 (Win Rate)' : 'Win Rate',
    profitFactor: language === 'zh' ? '盈亏比 (Profit Factor)' : 'Profit Factor',
    maxDd: language === 'zh' ? '最大回撤 (Max DD)' : 'Max Drawdown',
    composite: language === 'zh' ? '综合评分 (Composite)' : 'Composite Score',
    tradesCount: language === 'zh' ? '交易笔数' : 'Trade Count',
    settings: language === 'zh' ? '设置参数' : 'Parameters',
    settingsText: language === 'zh' 
      ? '时间范围: 2015-01-01 至 2025-06-30 | 单次持股: 6个交易日 | 交易成本: 单边 0.10% (往返 0.20%) | 每期持股上限: 3只 | 随机迭代: 1000次'
      : 'Span: 2015-01-01 to 2025-06-30 | Holding: 6 trading days | Cost: 0.20% round-trip | Top K: 3 stocks | MC Iterations: 1,000',
    strategyCol: language === 'zh' ? '策略表现 (Strategy)' : 'Strategy',
    randStockCol: language === 'zh' ? '随机同日期选股 (Random Stock)' : 'Random Stock Same-Dates',
    randEtfCol: language === 'zh' ? '随机 ETF 择时 (Random ETF)' : 'Random ETF Timing',
    spyCol: language === 'zh' ? '大盘买入持有 (Buy & Hold SPY)' : 'Passive SPY',
    alphaText: language === 'zh' ? '超额年化收益 (Annualized Alpha)' : 'Annualized Alpha (α)',
    betaText: language === 'zh' ? '贝塔系数 (Beta)' : 'Market Beta (β)',
    alphaTText: language === 'zh' ? 'Alpha t 统计量 (t-stat)' : 'Alpha t-statistic',
    betaShareText: language === 'zh' ? 'Beta 收益占比' : 'Beta Explained Share',
    backBtn: language === 'zh' ? '返回个人主页' : 'Back to Home',
    // —— 新增：使用引导与各区块的“如何阅读”说明 ——
    howTitle: language === 'zh' ? '这个工具是做什么的？三步看懂' : 'What is this tool? Three steps',
    howIntro: language === 'zh'
      ? '很多技术指标“看起来能赚钱”，其实只是赶上了大盘上涨。本工具帮你区分：你的规则是真有选股本事（Alpha），还是只是搭了大盘的便车（Beta）。'
      : 'Many technical rules “look profitable” simply because the market went up. This tool separates genuine skill (Alpha) from just riding the rising market (Beta).',
    step1Title: language === 'zh' ? '① 选一个规则' : '① Pick a rule',
    step1Body: language === 'zh' ? '从下面三个预设里选一个交易规则。' : 'Choose one of the three preset trading rules below.',
    step2Title: language === 'zh' ? '② 跑四道对照' : '② Run four benchmarks',
    step2Body: language === 'zh' ? '用相同日期，对比 1000 次随机选股、随机择时和被动持有 SPY。' : 'On the same dates, we race it against 1,000 random stock picks, random timing, and buy-and-hold SPY.',
    step3Title: language === 'zh' ? '③ 读判决' : '③ Read the verdict',
    step3Body: language === 'zh' ? '看它能否同时跑赢“随机选股”和“大盘 SPY”。' : 'See whether it beats both random picking AND just holding SPY.',
    // 预设说明
    presetDescLabel: language === 'zh' ? '当前规则：' : 'Current rule:',
    // 判决区
    verdictHelp: language === 'zh'
      ? '判决把规则放在四个等级上（从优到劣）。两个关键问题：① 能否跑赢随机选股（是否有 Alpha）？② 能否跑赢只持有 SPY？'
      : 'The verdict places the rule on a 4-level scale (best → worst). Two key questions: (1) does it beat random stock-picking (any Alpha)? (2) does it beat simply holding SPY?',
    legendTitle: language === 'zh' ? '判决等级（从优到劣）' : 'Verdict scale (best → worst)',
    // 各区块“如何阅读”
    metricsHelp: language === 'zh'
      ? 'CAGR = 年化收益率。随机对照只在年化收益上可比，故其余列显示“-”。关键看：策略 CAGR 是否高于最后一行“大盘买入持有”。'
      : 'CAGR = annualized return. Random benchmarks are only comparable on CAGR, so other columns show “-”. Key check: is the strategy CAGR above the last row “Buy & Hold SPY”?',
    equityHelp: language === 'zh'
      ? '红色实线（策略）高于棕色虚线（SPY）= 真正跑赢大盘；低于 = 只是搭了大盘的便车。'
      : 'The red line (strategy) above the brown dashed line (SPY) = genuinely beat the market; below = it merely rode market beta.',
    distHelp: language === 'zh'
      ? '灰柱 = 1000 次同日期随机选股的收益分布；红色竖线 = 你的规则。竖线越靠右，说明越优于随机选股。'
      : 'Grey bars = the return distribution of 1,000 same-date random stock picks; the red line = your rule. The further right the line sits, the more it beats random picking.',
    capmHelp: language === 'zh'
      ? '把收益拆成两块：大盘 Beta（免费就能拿到）与 Alpha（真正的超额本事）。Alpha 的 t 值 ≥ 2 才算统计显著。'
      : 'Splits the return into two parts: market Beta (free to obtain) and Alpha (genuine excess skill). Alpha only counts as statistically real when its t-statistic ≥ 2.',
    howToRead: language === 'zh' ? '如何阅读：' : 'How to read:',
  };

  // 判决状态 → 友好的中英文标签（替换原始下划线状态名）
  const statusMeta: Record<string, { en: string; zh: string }> = {
    candidate_edge_needs_validation: { en: 'Candidate edge — needs validation', zh: '疑似有效 · 待进一步验证' },
    beats_random_but_not_spy: { en: 'Beats random, but trails SPY', zh: '赢随机选股 · 但跑输大盘' },
    mostly_beta: { en: 'Mostly market beta', zh: '主要是大盘 Beta' },
    no_evidence_of_edge: { en: 'No evidence of an edge', zh: '无优势证据' },
  };
  const statusLabel = (status: string) =>
    statusMeta[status] ? (language === 'zh' ? statusMeta[status].zh : statusMeta[status].en) : status.replace(/_/g, ' ');

  // 预设规则的一句话说明
  const presetMeta: Record<string, { en: string; zh: string }> = {
    capstone_expiry_rule: {
      en: 'Our capstone rule: RSI oversold + 3 consecutive red candles before monthly SPY expiry.',
      zh: '本毕业项目规则：SPY 月度到期日前，RSI 超卖 + 连续 3 根阴线。',
    },
    rsi_oversold: {
      en: 'Textbook entry: buy when RSI falls below the oversold threshold.',
      zh: '教科书式入场：RSI 跌破超卖阈值时买入。',
    },
    ma_crossover: {
      en: 'Trend-following: buy on a fast/slow moving-average golden cross (SMA 9/50).',
      zh: '趋势跟随：均线金叉买入（SMA 9/50）。',
    },
  };

  // 判决等级图例（从优到劣），用于帮助用户理解当前结果的位置
  const verdictLegend = [
    { key: 'candidate_edge_needs_validation', dot: 'bg-green-600', en: 'Candidate edge', zh: '疑似有效' },
    { key: 'beats_random_but_not_spy', dot: 'bg-yellow-500', en: 'Beats random, trails SPY', zh: '赢随机 · 输大盘' },
    { key: 'mostly_beta', dot: 'bg-terracotta', en: 'Mostly beta', zh: '主要是 Beta' },
    { key: 'no_evidence_of_edge', dot: 'bg-red-600', en: 'No edge', zh: '无优势' },
  ];

  // Helper to translate JSON reasons array
  const translateReason = (engReason: string) => {
    if (language !== 'zh') return engReason;
    if (engReason.includes("did not beat random stock picks")) {
      return "未跑赢同日期随机选股（表明无突出的选股能力，p-value >= 0.05）。";
    }
    if (engReason.includes("successfully beat random same-date stock selections")) {
      return "成功跑赢同日期随机选股（表明选股表现显著，p-value < 0.05）。";
    }
    if (engReason.includes("did not beat random ETF timing")) {
      return "未跑赢随机 ETF 择时（表明没有优于大盘的入场择时能力，p-value >= 0.05）。";
    }
    if (engReason.includes("successfully beat random ETF timing")) {
      return "成功跑赢随机 ETF 择时（表明入场时间窗口有效，p-value < 0.05）。";
    }
    if (engReason.includes("trailed passive buy-and-hold SPY")) {
      return "跑输了被动买入并持有 SPY 指数。";
    }
    if (engReason.includes("outperformed passive buy-and-hold SPY")) {
      return "跑赢了被动买入并持有 SPY 指数。";
    }
    if (engReason.includes("Alpha is not statistically significant")) {
      return "CAPM 回归超额年化收益 Alpha 无统计学显著性（t值 < 2.0，可能由随机波动引起）。";
    }
    if (engReason.includes("produced statistically significant alpha")) {
      return "CAPM 回归产生了统计学上显著的 Alpha 超额收益（t值 >= 2.0）。";
    }
    if (engReason.includes("of the rule's return is explained by ordinary market beta")) {
      const match = engReason.match(/(\d+\.\d+)%/);
      const pct = match ? match[1] : '';
      return `该策略收益的 ${pct}% 可归因于普通市场贝塔（大盘上涨带来的贝塔）。`;
    }
    if (engReason.includes("beta share is not meaningful")) {
      return "由于该策略年化收益为负或接近零，贝塔收益占比无实际计算意义。";
    }
    return engReason;
  };

  // Prepares data for Monte Carlo histogram
  const getHistogramData = () => {
    if (!bundle) return [];
    const dist = bundle.benchmarks.random_stock_same_dates.distribution;
    // create 15 bins
    const minVal = Math.min(...dist);
    const maxVal = Math.max(...dist);
    const binWidth = (maxVal - minVal) / 15;
    
    const bins = Array.from({ length: 15 }, (_, i) => {
      const start = minVal + i * binWidth;
      const end = start + binWidth;
      return {
        binLabel: `${(start * 100).toFixed(1)}%`,
        start,
        end,
        count: 0
      };
    });

    dist.forEach(val => {
      for (let i = 0; i < bins.length; i++) {
        if (val >= bins[i].start && (i === bins.length - 1 ? val <= bins[i].end : val < bins[i].end)) {
          bins[i].count++;
          break;
        }
      }
    });

    return bins;
  };

  const getVerdictStyles = (status: string) => {
    switch (status) {
      case 'candidate_edge_needs_validation':
        return {
          border: 'border-green-600/30',
          bg: 'bg-green-50/40 dark:bg-green-950/10',
          iconColor: 'text-green-600',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'beats_random_but_not_spy':
        return {
          border: 'border-yellow-600/30',
          bg: 'bg-yellow-50/40 dark:bg-yellow-950/10',
          iconColor: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      case 'mostly_beta':
        return {
          border: 'border-terracotta/30',
          bg: 'bg-orange-50/30 dark:bg-orange-950/10',
          iconColor: 'text-terracotta',
          badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
        };
      case 'no_evidence_of_edge':
      default:
        return {
          border: 'border-red-600/30',
          bg: 'bg-red-50/30 dark:bg-red-950/10',
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
    }
  };

  const faqData = [
    {
      q: language === 'zh' ? '为什么要引入“同日期随机选股”对照？' : 'Why compare against "Same-Dates Random Stock Selection"?',
      a: language === 'zh'
        ? '很多技术指标看似有效，是因为它交易的时期正值股票市场普涨。如果我们把这个策略交易的那些时间点扣留下来，在同样的日期去随机买入股票，我们会发现，随机选股往往也能获得相似的收益。如果你的规则不能显著战胜随机选股，就说明其并不具备选股的超额收益能力（Alpha）。'
        : 'Many technical indicators appear profitable simply because they trade during market upswings. If we freeze the strategy\'s exact entry dates and pick random stocks instead, we often find that random selection achieves similar returns. If your rule cannot significantly outperform random stock picks, it provides no genuine stock-selection alpha.'
    },
    {
      q: language === 'zh' ? '“随机 ETF 择时”测试代表了什么？' : 'What does "Random ETF Timing" test represent?',
      a: language === 'zh'
        ? '这个测试是为了剥离“时机选择”（Timing Skill）。我们保留原策略持有的总次数，但从2015-2025十年的任意交易日中随机抽取时间段去交易 SPY 指数基金。如果策略的表现没有显著战胜随机的指数交易时机，就说明其对入场时间的选择（大盘周期的把握）同样接近于随机抛硬币。'
        : 'This test isolates "Timing Skill". We run a simulation that enters SPY on random dates throughout the ten-year period, holding for the same duration. If the indicator rule does not perform significantly better than random entries in the index, it indicates that the rule\'s timing ability is no better than simple coin-tossing.'
    },
    {
      q: language === 'zh' ? '什么是存活偏差（Survivorship Bias）？' : 'What is Survivorship Bias?',
      a: language === 'zh'
        ? '本工具所依赖的 S&P 500 历史数据缓存，来自当前的标普500成分股。这意味着，那些在过去10年中因破产或退市被剔除出成分股的公司，没有包含在我们的回测池中。这会天然地高估所有策略的平均表现。我们在本工具的计算中对此进行了说明，并倡导用户理性看待回测指标。'
        : 'The S&P 500 constituents data cache is based on the current constituents list. This means companies that failed, went bankrupt, or were delisted over the last 10 years are not included. This creates an upward bias for all backtests. We explicitly highlight this limitation and advocate for a realistic interpretation of historical backtests.'
    },
    {
      q: language === 'zh' ? 'CAPM 归因中的 Beta Share 是怎么计算的？' : 'How is Beta Share calculated in CAPM Attribution?',
      a: language === 'zh'
        ? 'Beta Share 反映了你的收益中，有多少比例是可以通过“跟随大盘涨跌”来解释的。如果该值为 80%，代表即便你的策略获得了 10% 的年化收益，也有 8% 纯粹是因为大盘在涨，仅有 2% 可能是超额收益。如果策略本身跑输大盘且年化收益很低，该值则不具备分析意义（记为 None）。'
        : 'Beta Share shows what percentage of your strategy\'s return is explained by market movements. If the share is 80%, it means that if your strategy returned 10% annualized, 8% of it was just from the market rising, leaving only 2% potentially as alpha. If the strategy return is negative or underperforms, this share is not meaningful (None).'
    }
  ];

  return (
    <div className="min-h-screen bg-parchment text-text-primary px-4 py-8 md:px-8 max-w-7xl mx-auto font-sans antialiased selection:bg-terracotta/20">
      {/* Dynamic Header */}
      <header className="mb-10 border-b border-border-warm pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-near-black mb-2 tracking-tight">
            {ui.title}
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-3xl leading-relaxed">
            {ui.subtitle}
          </p>
        </div>
        
        {/* Isolated Language Toggle */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs rounded border transition-all ${
              language === 'en' 
                ? 'bg-near-black text-ivory border-near-black' 
                : 'bg-ivory text-text-secondary border-border-warm hover:bg-warm-sand/20'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-3 py-1 text-xs rounded border transition-all ${
              language === 'zh' 
                ? 'bg-near-black text-ivory border-near-black' 
                : 'bg-ivory text-text-secondary border-border-warm hover:bg-warm-sand/20'
            }`}
          >
            中文
          </button>
        </div>
      </header>

      {/* 使用引导：三步看懂工具 */}
      <section className="mb-8 bg-ivory border border-border-warm rounded-xl p-6 shadow-whisper">
        <h2 className="text-lg font-display text-near-black mb-1">{ui.howTitle}</h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl mb-5">{ui.howIntro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: ui.step1Title, b: ui.step1Body },
            { t: ui.step2Title, b: ui.step2Body },
            { t: ui.step3Title, b: ui.step3Body },
          ].map((step, i) => (
            <div key={i} className="relative bg-parchment/40 border border-border-cream rounded-lg p-4">
              <p className="text-sm font-semibold text-terracotta mb-1.5">{step.t}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{step.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preset Rule Selector */}
      <section className="mb-8">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          {ui.presetLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'capstone_expiry_rule', label: ui.capstoneLabel },
            { id: 'rsi_oversold', label: ui.rsiLabel },
            { id: 'ma_crossover', label: ui.maLabel }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedRule(preset.id)}
              className={`px-4 py-2.5 rounded-lg text-sm transition-all border font-medium ${
                selectedRule === preset.id
                  ? 'bg-ivory border-terracotta text-terracotta shadow-whisper'
                  : 'bg-ivory/60 border-border-warm text-text-secondary hover:bg-ivory hover:text-text-primary'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {presetMeta[selectedRule] && (
          <p className="mt-3 text-xs text-text-secondary leading-relaxed">
            <span className="font-medium text-text-primary">{ui.presetDescLabel}</span>{' '}
            {language === 'zh' ? presetMeta[selectedRule].zh : presetMeta[selectedRule].en}
          </p>
        )}
      </section>

      {loading || !bundle ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary text-sm">Computing Monte Carlo permutations...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Verdict Block */}
          <section className={`border rounded-xl p-6 ${getVerdictStyles(bundle.verdict.status).bg} ${getVerdictStyles(bundle.verdict.status).border} transition-all`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${getVerdictStyles(bundle.verdict.status).iconColor}`}>
                  {bundle.verdict.status === 'candidate_edge_needs_validation' ? '✓' : '⚠'}
                </span>
                <h2 className="text-xl font-display font-medium text-near-black">
                  {ui.verdictTitle}
                </h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${getVerdictStyles(bundle.verdict.status).badge}`}>
                {statusLabel(bundle.verdict.status)}
              </span>
            </div>

            {/* 如何阅读判决 */}
            <p className="text-xs text-text-muted leading-relaxed mb-4 border-l-2 border-border-warm pl-3">
              <span className="font-medium text-text-secondary">{ui.howToRead}</span> {ui.verdictHelp}
            </p>

            <p className="text-lg font-medium text-near-black mb-4 leading-snug">
              {language === 'zh' ? bundle.verdict.headline_zh : bundle.verdict.headline}
            </p>

            <div className="space-y-2 border-t border-border-warm/50 pt-4">
              {bundle.verdict.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                  <span className="text-terracotta mt-0.5">•</span>
                  <span>{translateReason(r)}</span>
                </div>
              ))}
            </div>

            {/* 判决等级图例：高亮当前结果所在位置 */}
            <div className="mt-5 pt-4 border-t border-border-warm/50">
              <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">{ui.legendTitle}</p>
              <div className="flex flex-wrap gap-2">
                {verdictLegend.map((lv) => {
                  const isActive = lv.key === bundle.verdict.status;
                  return (
                    <span
                      key={lv.key}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
                        isActive
                          ? 'border-near-black bg-ivory text-near-black font-semibold shadow-whisper'
                          : 'border-border-cream bg-ivory/40 text-text-muted'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${lv.dot} ${isActive ? '' : 'opacity-40'}`}></span>
                      {language === 'zh' ? lv.zh : lv.en}
                      {isActive && <span className="ml-0.5">←</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comparison Metrics Grid */}
          <section className="bg-ivory border border-border-warm rounded-xl p-6 shadow-whisper">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
              <h2 className="text-lg font-display text-near-black">
                {ui.metricsTitle}
              </h2>
              <span className="text-xs text-text-muted">
                {ui.settingsText}
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4 border-l-2 border-border-warm pl-3">
              <span className="font-medium text-text-secondary">{ui.howToRead}</span> {ui.metricsHelp}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-cream text-text-muted font-medium">
                    <th className="py-3 px-4 font-normal">{ui.settings}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.cagr}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.sharpe}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.winRate}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.maxDd}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.composite}</th>
                    <th className="py-3 px-4 text-right font-normal">{ui.tradesCount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-cream/40">
                  <tr className="bg-terracotta/[0.02] font-medium text-near-black">
                    <td className="py-3.5 px-4 text-terracotta">{ui.strategyCol}</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.strategy.cagr * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 text-right">{bundle.strategy.sharpe.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.strategy.win_rate * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.strategy.max_drawdown * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right">{bundle.strategy.composite.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-right">{bundle.data_quality.trades}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-text-secondary">{ui.randStockCol}</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.benchmarks.random_stock_same_dates.mean * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">{bundle.data_quality.trades}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-text-secondary">{ui.randEtfCol}</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.benchmarks.random_etf_timing.mean * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">{bundle.data_quality.trades}</td>
                  </tr>
                  <tr className="text-text-secondary">
                    <td className="py-3.5 px-4">{ui.spyCol}</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.benchmarks.buy_hold_spy.cagr * 100).toFixed(2)}%</td>
                    <td className="py-3.5 px-4 text-right">{bundle.benchmarks.buy_hold_spy.sharpe.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">{(bundle.benchmarks.buy_hold_spy.max_drawdown * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Chart Section */}
          <section className="bg-ivory border border-border-warm rounded-xl p-6 shadow-whisper">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-display text-near-black">
                {ui.chartTitle}
              </h2>
              <div className="flex bg-warm-sand/30 rounded-lg p-0.5 border border-border-cream">
                <button
                  onClick={() => setActiveChartTab('equity')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                    activeChartTab === 'equity'
                      ? 'bg-ivory text-near-black shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {ui.equityTab}
                </button>
                <button
                  onClick={() => setActiveChartTab('distribution')}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                    activeChartTab === 'distribution'
                      ? 'bg-ivory text-near-black shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {ui.distTab}
                </button>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-4 border-l-2 border-border-warm pl-3">
              <span className="font-medium text-text-secondary">{ui.howToRead}</span>{' '}
              {activeChartTab === 'equity' ? ui.equityHelp : ui.distHelp}
              {activeChartTab === 'distribution' && (
                <span className="block mt-1 text-text-secondary">
                  {language === 'zh' ? '本策略位于第 ' : 'This rule sits at the '}
                  <span className="font-semibold text-terracotta">{bundle.benchmarks.random_stock_same_dates.percentile.toFixed(1)}</span>
                  {language === 'zh' ? ' 百分位，p = ' : 'th percentile, p = '}
                  <span className="font-semibold text-terracotta">{bundle.benchmarks.random_stock_same_dates.p_value.toFixed(3)}</span>
                  {language === 'zh' ? '（p < 0.05 才算显著跑赢随机选股）。' : ' (p < 0.05 = significantly beats random picking).'}
                </span>
              )}
            </p>

            {activeChartTab === 'equity' ? (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={bundle.strategy.equity_curve.map((pt, idx) => ({
                      date: pt.date,
                      Strategy: parseFloat(pt.value.toFixed(4)),
                      SPY: parseFloat((bundle.benchmarks.buy_hold_spy.equity_curve[idx]?.value || 1).toFixed(4))
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#87867f', fontSize: 11 }} 
                      stroke="#e8e6dc" 
                    />
                    <YAxis 
                      tickFormatter={(val) => `${((val - 1) * 100).toFixed(0)}%`}
                      tick={{ fill: '#87867f', fontSize: 11 }}
                      stroke="#e8e6dc"
                    />
                    <Tooltip
                      formatter={(value: any) => [`${((parseFloat(value) - 1) * 100).toFixed(1)}%`]}
                      contentStyle={{ backgroundColor: '#faf9f5', borderColor: '#e8e6dc' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line 
                      type="monotone" 
                      dataKey="Strategy" 
                      stroke="#c96442" 
                      strokeWidth={2.5} 
                      dot={false}
                      name={language === 'zh' ? '本策略净值' : 'Strategy Equity'}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="SPY" 
                      stroke="#8b5a3c" 
                      strokeWidth={1.5} 
                      strokeDasharray="4 4"
                      dot={false}
                      name={language === 'zh' ? '被动 SPY' : 'Passive SPY'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getHistogramData()}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0eee6" />
                    <XAxis 
                      dataKey="binLabel" 
                      tick={{ fill: '#87867f', fontSize: 11 }} 
                      stroke="#e8e6dc" 
                    />
                    <YAxis 
                      tick={{ fill: '#87867f', fontSize: 11 }} 
                      stroke="#e8e6dc" 
                    />
                    <Tooltip 
                      formatter={(val) => [val, language === 'zh' ? '频数' : 'Frequency']}
                      contentStyle={{ backgroundColor: '#faf9f5', borderColor: '#e8e6dc' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#d4b896" 
                      radius={[4, 4, 0, 0]}
                      name={language === 'zh' ? '随机选股模拟数' : 'Simulations'}
                    />
                    <ReferenceLine 
                      x={`${(bundle.strategy.cagr * 100).toFixed(1)}%`} 
                      stroke="#c96442" 
                      strokeWidth={2} 
                      label={{ 
                        value: language === 'zh' ? '当前策略' : 'Strategy', 
                        fill: '#c96442', 
                        position: 'top' 
                      }} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* CAPM Attribution Panel */}
          <section className="bg-near-black text-ivory border border-border-dark rounded-xl p-6">
            <h2 className="text-lg font-display text-text-heading-dark mb-2">
              {ui.capmTitle}
            </h2>
            <p className="text-xs text-text-on-dark leading-relaxed mb-6 border-l-2 border-border-dark/60 pl-3 max-w-3xl">
              <span className="font-medium text-text-heading-dark">{ui.howToRead}</span> {ui.capmHelp}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="border-r border-border-dark/60 pr-4">
                <p className="text-xs text-text-on-dark mb-1">{ui.betaText}</p>
                <p className="text-2xl font-display font-medium text-text-heading-dark">
                  {bundle.decomposition.beta.toFixed(2)}
                </p>
                <span className="text-[10px] text-text-on-dark leading-tight block mt-1">
                  {language === 'zh' ? '市场敏感度，~1.0 表示与大盘同步' : 'Market sensitivity relative to SPY'}
                </span>
              </div>

              <div className="border-r border-border-dark/60 pr-4">
                <p className="text-xs text-text-on-dark mb-1">{ui.betaShareText}</p>
                <p className="text-2xl font-display font-medium text-text-heading-dark">
                  {bundle.decomposition.beta_share !== null 
                    ? `${(bundle.decomposition.beta_share * 100).toFixed(1)}%`
                    : 'None'
                  }
                </p>
                <span className="text-[10px] text-text-on-dark leading-tight block mt-1">
                  {language === 'zh' ? '大盘贝塔贡献收益所占比例' : 'Percentage of returns from market Beta'}
                </span>
              </div>

              <div className="border-r border-border-dark/60 pr-4">
                <p className="text-xs text-text-on-dark mb-1">{ui.alphaText}</p>
                <p className="text-2xl font-display font-medium text-text-heading-dark">
                  {(bundle.decomposition.alpha_annualized * 100).toFixed(2)}%
                </p>
                <span className="text-[10px] text-text-on-dark leading-tight block mt-1">
                  {language === 'zh' ? '剥离大盘贝塔后的净超额收益' : 'Net annualized strategy excess return'}
                </span>
              </div>

              <div>
                <p className="text-xs text-text-on-dark mb-1">{ui.alphaTText}</p>
                <p className="text-2xl font-display font-medium text-text-heading-dark">
                  {bundle.decomposition.alpha_t.toFixed(2)}
                </p>
                <span className="text-[10px] text-text-on-dark leading-tight block mt-1">
                  {language === 'zh' ? '显著性检验，>= 2.0 代表统计显著' : 'Significance check (>= 2.0 is robust)'}
                </span>
              </div>
            </div>
          </section>

          {/* Technical FAQ Accordion */}
          <section className="bg-ivory border border-border-warm rounded-xl p-6 shadow-whisper">
            <h2 className="text-lg font-display text-near-black mb-4">
              {ui.methodologyTitle}
            </h2>

            <div className="divide-y divide-border-cream">
              {faqData.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full flex justify-between items-center text-left text-sm font-medium text-near-black focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-terracotta text-lg">{openFaqIndex === i ? '−' : '+'}</span>
                  </button>
                  {openFaqIndex === i && (
                    <p className="mt-3 text-xs text-text-secondary leading-relaxed bg-parchment/30 p-3 rounded border border-border-cream">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Footer Return navigation */}
      <footer className="mt-12 pt-6 border-t border-border-warm text-center flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-muted">
          {language === 'zh' 
            ? '© 2026 NiagaraDataAnalyst. 基于标普500期权到期压力学术研究所构建。非投资建议。' 
            : '© 2026 NiagaraDataAnalyst. Built on SPY Options Expiry research. No financial advice.'
          }
        </p>
        <a
          href="/"
          className="text-xs text-terracotta border border-terracotta/40 hover:bg-terracotta hover:text-ivory px-4 py-2 rounded-md transition-all font-medium"
        >
          {ui.backBtn}
        </a>
      </footer>
    </div>
  );
}
