'use client';

/**
 * 交互式架构图组件
 * 使用ReactFlow展示InterviewPass系统的6节点架构
 * 支持节点点击查看详情面板，动画数据流
 */
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeMouseHandler,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useLanguage } from '@/contexts/LanguageContext';

/** 节点详情数据接口 */
interface NodeDetail {
  label: string;
  description: string;
  technologies: string[];
  specs: Record<string, string>;
}

/** 获取节点数据（双语） */
const getNodeDetails = (lang: 'zh' | 'en'): Record<string, NodeDetail> => {
  const data: Record<'zh' | 'en', Record<string, NodeDetail>> = {
    zh: {
      'user-client': {
        label: '用户客户端',
        description: '面试者视频输入界面，支持实时视频流传输',
        technologies: ['React', 'WebRTC', 'MediaStream API'],
        specs: { '输入格式': 'H.264视频流', '分辨率': '1080p', '帧率': '30fps' },
      },
      'kinesis': {
        label: 'Kinesis视频流',
        description: '实时视频流接收和缓冲服务',
        technologies: ['AWS Kinesis Video Streams'],
        specs: { '吞吐量': '每秒1000帧', '延迟': '<100ms', '存储': '7天自动删除' },
      },
      'lambda': {
        label: 'Lambda处理',
        description: '无服务器计算，帧提取和预处理',
        technologies: ['AWS Lambda', 'Python', 'FFmpeg'],
        specs: { '内存': '3008MB', '超时': '15分钟', '并发': '1000' },
      },
      'rekognition': {
        label: 'Rekognition',
        description: 'AI面部表情分析和情绪检测',
        technologies: ['Amazon Rekognition', 'Face Detection API'],
        specs: { '检测类型': '面部+表情+情绪', '准确率': '>95%', '响应时间': '<200ms' },
      },
      'airbyte': {
        label: 'Airbyte',
        description: '数据同步管道，DynamoDB到Snowflake',
        technologies: ['Airbyte', 'CDC', 'ELT'],
        specs: { '同步频率': '每小时', '数据格式': 'JSON→Parquet', '压缩': 'Snappy' },
      },
      'snowflake': {
        label: 'Snowflake',
        description: '数据仓库，多维面试数据分析',
        technologies: ['Snowflake', 'dbt', 'SQL'],
        specs: { '存储': '列式存储', '查询引擎': 'MPP', '缓存': '自动结果缓存' },
      },
    },
    en: {
      'user-client': {
        label: 'User Client',
        description: 'Interview video input interface with real-time streaming',
        technologies: ['React', 'WebRTC', 'MediaStream API'],
        specs: { 'Input': 'H.264 Stream', 'Resolution': '1080p', 'FPS': '30' },
      },
      'kinesis': {
        label: 'Kinesis Video',
        description: 'Real-time video stream ingestion and buffering',
        technologies: ['AWS Kinesis Video Streams'],
        specs: { 'Throughput': '1000 frames/s', 'Latency': '<100ms', 'Retention': '7 days' },
      },
      'lambda': {
        label: 'Lambda',
        description: 'Serverless compute for frame extraction & preprocessing',
        technologies: ['AWS Lambda', 'Python', 'FFmpeg'],
        specs: { 'Memory': '3008MB', 'Timeout': '15min', 'Concurrency': '1000' },
      },
      'rekognition': {
        label: 'Rekognition',
        description: 'AI facial expression & emotion analysis',
        technologies: ['Amazon Rekognition', 'Face Detection API'],
        specs: { 'Detection': 'Face+Expression+Emotion', 'Accuracy': '>95%', 'Response': '<200ms' },
      },
      'airbyte': {
        label: 'Airbyte',
        description: 'Data sync pipeline from DynamoDB to Snowflake',
        technologies: ['Airbyte', 'CDC', 'ELT'],
        specs: { 'Sync': 'Hourly', 'Format': 'JSON→Parquet', 'Compression': 'Snappy' },
      },
      'snowflake': {
        label: 'Snowflake',
        description: 'Data warehouse for multi-dimensional interview analytics',
        technologies: ['Snowflake', 'dbt', 'SQL'],
        specs: { 'Storage': 'Columnar', 'Engine': 'MPP', 'Cache': 'Auto Result Cache' },
      },
    },
  };
  return data[lang];
};

/** 节点颜色映射（暖色图表调色板）*/
const nodeColors: Record<string, string> = {
  'user-client': '#c96442',  // terracotta
  'kinesis':     '#c9a46a',  // ochre
  'lambda':      '#d97757',  // coral
  'rekognition': '#8b5a3c',  // clay
  'airbyte':     '#d4b896',  // sand
  'snowflake':   '#4d4c48',  // ink
};

/** 创建ReactFlow节点（暗色面板 + 暖色边框）*/
const nodeStyle = (id: string) => ({
  background: '#30302e',
  border: `2px solid ${nodeColors[id]}`,
  color: '#faf9f5',
  borderRadius: '12px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: 600,
});

const createNodes = (details: Record<string, NodeDetail>): Node[] => [
  { id: 'user-client', position: { x: 50, y: 150 }, data: { label: details['user-client'].label }, style: nodeStyle('user-client') },
  { id: 'kinesis', position: { x: 250, y: 50 }, data: { label: details['kinesis'].label }, style: nodeStyle('kinesis') },
  { id: 'lambda', position: { x: 250, y: 250 }, data: { label: details['lambda'].label }, style: nodeStyle('lambda') },
  { id: 'rekognition', position: { x: 480, y: 150 }, data: { label: details['rekognition'].label }, style: nodeStyle('rekognition') },
  { id: 'airbyte', position: { x: 680, y: 50 }, data: { label: details['airbyte'].label }, style: nodeStyle('airbyte') },
  { id: 'snowflake', position: { x: 680, y: 250 }, data: { label: details['snowflake'].label }, style: nodeStyle('snowflake') },
];

/** ReactFlow边连接（暖色调色板）*/
const edges: Edge[] = [
  { id: 'e1', source: 'user-client', target: 'kinesis', animated: true, style: { stroke: '#c96442' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#c96442' } },
  { id: 'e2', source: 'kinesis', target: 'lambda', animated: true, style: { stroke: '#c9a46a' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#c9a46a' } },
  { id: 'e3', source: 'user-client', target: 'lambda', animated: true, style: { stroke: '#c96442' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#d97757' } },
  { id: 'e4', source: 'lambda', target: 'rekognition', animated: true, style: { stroke: '#d97757' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5a3c' } },
  { id: 'e5', source: 'rekognition', target: 'airbyte', animated: true, style: { stroke: '#8b5a3c' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#d4b896' } },
  { id: 'e6', source: 'airbyte', target: 'snowflake', animated: true, style: { stroke: '#d4b896' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4d4c48' } },
];

const InteractiveArch: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const nodeDetails = getNodeDetails(language);
  const nodes = createNodes(nodeDetails);

  /** 节点点击处理 */
  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node.id);
  }, []);

  /** 关闭详情面板 */
  const closePanel = () => setSelectedNode(null);

  const detail = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display font-medium text-subhead-sm text-text-primary">
          {t('caseStudy.architecture.title')}
        </h3>
        <p className="text-body-sm font-sans text-text-muted mt-1">{t('caseStudy.architecture.subtitle')}</p>
      </div>

      <div className="relative">
        {/* ReactFlow图表 — 保持暗色背景 */}
        <div className="bg-near-black border border-border-dark rounded-xl overflow-hidden" style={{ height: 400 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#30302e" gap={20} />
            <Controls
              style={{ background: '#30302e', border: '1px solid #4d4c48', borderRadius: '8px' }}
            />
          </ReactFlow>
        </div>

        {/* 节点详情面板 */}
        {detail && selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-dark-surface border border-border-dark rounded-xl shadow-2xl p-5 z-10">
            <div className="flex items-center justify-between mb-4">
              <h4
                className="text-base font-display font-medium"
                style={{ color: nodeColors[selectedNode] }}
              >
                {detail.label}
              </h4>
              <button
                onClick={closePanel}
                className="text-text-muted hover:text-text-on-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-text-muted text-sm mb-4 font-sans">{detail.description}</p>

            {/* 技术栈 */}
            <div className="mb-4">
              <h5 className="text-text-on-dark text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                {t('caseStudy.architecture.technologies')}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {detail.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded text-xs bg-near-black text-text-on-dark font-sans">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 技术规格 */}
            <div>
              <h5 className="text-text-on-dark text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                {t('caseStudy.architecture.specifications')}
              </h5>
              <div className="space-y-1.5">
                {Object.entries(detail.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-text-muted font-sans">{key}</span>
                    <span className="text-text-on-dark font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveArch;
