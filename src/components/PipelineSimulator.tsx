'use client';

/**
 * 管道模拟器组件
 * 展示 job-hunt 流水线运行的终端控制台和 Recharts 匹配分图表
 * 支持双语，暗色终端美学
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SimulationLog, ConfidenceData } from '@/types';

/** 模拟日志数据（中英文） */
const getSimulationLogs = (lang: 'zh' | 'en'): SimulationLog[] => {
  const logs: Record<'zh' | 'en', SimulationLog[]> = {
    zh: [
      { timestamp: '10:30:00', level: 'info', message: '扫描 ATS 与 WebSearch 职位源...' },
      { timestamp: '10:30:01', level: 'success', message: '发现新职位，去重后入队' },
      { timestamp: '10:30:02', level: 'info', message: '抽取职位描述 (LangGraph extract_jd)' },
      { timestamp: '10:30:03', level: 'success', message: '资格门控通过 (mode=full)' },
      { timestamp: '10:30:05', level: 'success', message: 'CV 匹配完成 — 命中核心技能关键词' },
      { timestamp: '10:30:07', level: 'info', message: '按加权维度评分中 (Claude/OpenAI)...' },
      { timestamp: '10:30:09', level: 'success', message: '综合匹配分 = 4.3 / 5 → 生成材料' },
      { timestamp: '10:30:11', level: 'info', message: '定制简历与求职信生成 (HTML → PDF)' },
      { timestamp: '10:30:13', level: 'success', message: '质量审计循环通过' },
      { timestamp: '10:30:14', level: 'info', message: 'Playwright 打开申请页 (fill-only)' },
      { timestamp: '10:30:16', level: 'warning', message: '停在审核页 — 等待人工检查并提交' },
      { timestamp: '10:30:16', level: 'success', message: '✓ 就绪待提交 — 门槛未满足绝不自动提交' },
    ],
    en: [
      { timestamp: '10:30:00', level: 'info', message: 'Scanning ATS APIs and WebSearch...' },
      { timestamp: '10:30:01', level: 'success', message: 'New posting found; de-duplicated into queue' },
      { timestamp: '10:30:02', level: 'info', message: 'Extracting job description (LangGraph extract_jd)' },
      { timestamp: '10:30:03', level: 'success', message: 'Eligibility gate passed (mode=full)' },
      { timestamp: '10:30:05', level: 'success', message: 'CV match complete — core skill keywords hit' },
      { timestamp: '10:30:07', level: 'info', message: 'Scoring weighted dimensions (Claude/OpenAI)...' },
      { timestamp: '10:30:09', level: 'success', message: 'Fit score = 4.3 / 5 → generating artifacts' },
      { timestamp: '10:30:11', level: 'info', message: 'Tailoring resume and cover letter (HTML → PDF)' },
      { timestamp: '10:30:13', level: 'success', message: 'Quality-audit loop passed' },
      { timestamp: '10:30:14', level: 'info', message: 'Playwright opened application page (fill-only)' },
      { timestamp: '10:30:16', level: 'warning', message: 'Stopped at review — awaiting human submit' },
      { timestamp: '10:30:16', level: 'success', message: '✓ Ready to submit — never auto-submits behind unmet gates' },
    ],
  };
  return logs[lang];
};

/** 匹配分进度图表数据（随流水线阶段上升） */
const confidenceData: ConfidenceData[] = [
  { time: 0, confidence: 0.45, stage: 'Extract' },
  { time: 3, confidence: 0.60, stage: 'CV match' },
  { time: 6, confidence: 0.72, stage: 'Score' },
  { time: 9, confidence: 0.82, stage: 'Generate' },
  { time: 12, confidence: 0.88, stage: 'Apply' },
  { time: 15, confidence: 0.92, stage: 'Review' },
];

/** 日志级别对应的样式（终端内部保持深色配色） */
const logLevelColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
};

const PipelineSimulator: React.FC = () => {
  const { t, language } = useLanguage();
  const [visibleLogs, setVisibleLogs] = useState<SimulationLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [chartData, setChartData] = useState<ConfidenceData[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  /** 启动模拟 */
  const startSimulation = () => {
    const logs = getSimulationLogs(language);
    setVisibleLogs([]);
    setChartData([]);
    setIsRunning(true);

    logs.forEach((log, index) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log]);
        /* 同步更新图表数据 */
        if (index < confidenceData.length) {
          setChartData((prev) => [...prev, confidenceData[index]]);
        }
        if (index === logs.length - 1) {
          setIsRunning(false);
          setChartData(confidenceData);
        }
      }, (index + 1) * 800);
    });
  };

  /** 重置模拟 */
  const resetSimulation = () => {
    setVisibleLogs([]);
    setChartData([]);
    setIsRunning(false);
  };

  /** 自动滚动终端到底部 */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div className="space-y-8">
      {/* 标题和控制按钮 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-medium text-subhead-sm text-text-primary">
            {t('caseStudy.simulation.title')}
          </h3>
          <p className="text-body-sm font-sans text-text-muted mt-1">{t('caseStudy.simulation.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-terracotta hover:brightness-110
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-ivory text-body-sm font-sans font-medium transition-all"
          >
            {t('caseStudy.simulation.startSimulation')}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg border border-border-warm hover:bg-warm-sand
                       text-text-secondary text-body-sm font-sans font-medium transition-colors"
          >
            {t('caseStudy.simulation.resetSimulation')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 终端控制台 — 保持暗色 macOS 风格 */}
        <div className="bg-near-black border border-border-dark rounded-xl overflow-hidden">
          {/* 终端标题栏 */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-dark-surface border-b border-border-dark">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-text-muted text-xs font-mono ml-2">pipeline-simulator</span>
          </div>

          {/* 终端内容 */}
          <div
            ref={terminalRef}
            className="p-4 h-80 overflow-y-auto font-mono text-sm"
          >
            {visibleLogs.length === 0 && (
              <p className="text-text-muted">
                {'>'} {language === 'zh' ? '等待启动模拟...' : 'Waiting to start simulation...'}
                <span className="animate-blink">_</span>
              </p>
            )}
            {visibleLogs.map((log, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-text-muted shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 ${logLevelColors[log.level]}`}>
                  [{log.level.toUpperCase().padEnd(7)}]
                </span>
                <span className="text-text-on-dark">{log.message}</span>
              </div>
            ))}
            {isRunning && (
              <span className="text-emerald-400 animate-blink">_</span>
            )}
          </div>
        </div>

        {/* 置信度图表 — 暗色面板，暖色图表 */}
        <div className="bg-dark-surface border border-border-dark rounded-xl p-6">
          <h4 className="text-text-on-dark font-sans font-medium mb-4">
            {t('caseStudy.simulation.confidenceScore')}
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : confidenceData}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c96442" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#c96442" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30302e" />
                <XAxis
                  dataKey="time"
                  stroke="#4d4c48"
                  tick={{ fill: '#87867f', fontSize: 12 }}
                  label={{ value: 's', position: 'insideBottomRight', fill: '#87867f' }}
                />
                <YAxis
                  stroke="#4d4c48"
                  tick={{ fill: '#87867f', fontSize: 12 }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#30302e',
                    border: '1px solid #4d4c48',
                    borderRadius: '8px',
                    color: '#faf9f5',
                  }}
                  formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, t('caseStudy.simulation.confidenceScore')]}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#c96442"
                  strokeWidth={2}
                  fill="url(#confidenceGradient)"
                  dot={{ fill: '#c96442', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#d97757' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineSimulator;
