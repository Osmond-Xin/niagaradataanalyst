'use client';

/**
 * 管道模拟器组件
 * 展示InterviewPass数据处理管道的终端控制台和Recharts置信度图表
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
      { timestamp: '10:30:00', level: 'info', message: '初始化视频流接收服务...' },
      { timestamp: '10:30:01', level: 'success', message: 'Kinesis视频流连接已建立' },
      { timestamp: '10:30:02', level: 'info', message: '开始H.264视频解码 (1080p@30fps)' },
      { timestamp: '10:30:03', level: 'info', message: '发送帧到Lambda处理管道...' },
      { timestamp: '10:30:05', level: 'success', message: 'Rekognition面部检测完成 - 检测到1张面部' },
      { timestamp: '10:30:06', level: 'info', message: '分析面部表情: 置信度=0.65' },
      { timestamp: '10:30:08', level: 'warning', message: '面试者表情紧张度上升 - 调整评分权重' },
      { timestamp: '10:30:10', level: 'success', message: 'LLM评估引擎返回结果: 综合得分=78/100' },
      { timestamp: '10:30:12', level: 'info', message: '数据写入DynamoDB - 会话ID: sess_a1b2c3' },
      { timestamp: '10:30:13', level: 'success', message: 'Airbyte同步触发 → Snowflake数据仓库' },
      { timestamp: '10:30:15', level: 'info', message: '分析报告生成完成' },
      { timestamp: '10:30:16', level: 'success', message: '✓ 管道处理完成 - 总耗时: 16秒' },
    ],
    en: [
      { timestamp: '10:30:00', level: 'info', message: 'Initializing video stream receiver...' },
      { timestamp: '10:30:01', level: 'success', message: 'Kinesis video stream connected' },
      { timestamp: '10:30:02', level: 'info', message: 'Starting H.264 decode (1080p@30fps)' },
      { timestamp: '10:30:03', level: 'info', message: 'Sending frames to Lambda pipeline...' },
      { timestamp: '10:30:05', level: 'success', message: 'Rekognition face detection complete - 1 face found' },
      { timestamp: '10:30:06', level: 'info', message: 'Analyzing facial expression: confidence=0.65' },
      { timestamp: '10:30:08', level: 'warning', message: 'Nervousness rising - adjusting score weight' },
      { timestamp: '10:30:10', level: 'success', message: 'LLM evaluation result: score=78/100' },
      { timestamp: '10:30:12', level: 'info', message: 'Writing to DynamoDB - session: sess_a1b2c3' },
      { timestamp: '10:30:13', level: 'success', message: 'Airbyte sync triggered → Snowflake' },
      { timestamp: '10:30:15', level: 'info', message: 'Analysis report generated' },
      { timestamp: '10:30:16', level: 'success', message: '✓ Pipeline complete - total: 16s' },
    ],
  };
  return logs[lang];
};

/** 置信度图表数据 */
const confidenceData: ConfidenceData[] = [
  { time: 0, confidence: 0.45, stage: '初始' },
  { time: 5, confidence: 0.65, stage: '面部检测' },
  { time: 8, confidence: 0.72, stage: '表情分析' },
  { time: 10, confidence: 0.78, stage: 'LLM评估' },
  { time: 13, confidence: 0.85, stage: '数据同步' },
  { time: 16, confidence: 0.92, stage: '完成' },
];

/** 日志级别对应的样式 */
const logLevelColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
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
          <h3 className="text-2xl font-bold text-gray-100">{t('caseStudy.simulation.title')}</h3>
          <p className="text-gray-400 text-sm mt-1">{t('caseStudy.simulation.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
                       disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {t('caseStudy.simulation.startSimulation')}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800
                       text-gray-300 text-sm font-medium transition-colors"
          >
            {t('caseStudy.simulation.resetSimulation')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 终端控制台 */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
          {/* 终端标题栏 */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-gray-500 text-xs font-mono ml-2">pipeline-simulator</span>
          </div>

          {/* 终端内容 */}
          <div
            ref={terminalRef}
            className="p-4 h-80 overflow-y-auto font-mono text-sm"
          >
            {visibleLogs.length === 0 && (
              <p className="text-gray-600">
                {'>'} {language === 'zh' ? '等待启动模拟...' : 'Waiting to start simulation...'}
                <span className="animate-blink">_</span>
              </p>
            )}
            {visibleLogs.map((log, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 ${logLevelColors[log.level]}`}>
                  [{log.level.toUpperCase().padEnd(7)}]
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            {isRunning && (
              <span className="text-green-400 animate-blink">_</span>
            )}
          </div>
        </div>

        {/* 置信度图表 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h4 className="text-gray-300 font-medium mb-4">
            {t('caseStudy.simulation.confidenceScore')}
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : confidenceData}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  label={{ value: 's', position: 'insideBottomRight', fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#E5E7EB',
                  }}
                  formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, t('caseStudy.simulation.confidenceScore')]}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#confidenceGradient)"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#60A5FA' }}
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
