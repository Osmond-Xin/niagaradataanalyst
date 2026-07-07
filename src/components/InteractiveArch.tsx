'use client';

/**
 * 交互式架构图组件
 * 使用ReactFlow展示job-hunt系统的流水线架构（发现 → 评估图 → 投递助手）
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
      'discovery': {
        label: '发现服务',
        description: '扫描直连 ATS 与 WebSearch，去重后进入待评估队列',
        technologies: ['Brave WebSearch', 'Greenhouse / Lever / Ashby API', 'Python'],
        specs: { '来源': 'ATS API + WebSearch', '去重': '本地 tracker + 历史', '缓存': '24 小时磁盘缓存' },
      },
      'extract': {
        label: 'JD 抽取与门控',
        description: 'LangGraph 节点抽取职位描述，做资格与在招门控',
        technologies: ['LangGraph', 'Claude / OpenAI API'],
        specs: { '图节点': '约 20 个类型化节点', '门控': '资格 + 是否在招', '输出': '结构化 JD' },
      },
      'score': {
        label: '匹配评分',
        description: '按加权维度对 JD 与候选人做匹配打分，决定是否生成材料',
        technologies: ['LangGraph', '加权评分', 'Claude / OpenAI API'],
        specs: { '维度': '多维加权', '模式': 'student | full 开关', '测试': '460+ pytest' },
      },
      'generate': {
        label: '定制材料生成',
        description: '通过评分后，生成定制简历、求职信与评估报告',
        technologies: ['Jinja2', 'Playwright PDF', 'Claude / OpenAI API'],
        specs: { '产物': '简历 + 求职信 + 报告', '格式': 'HTML → PDF', '质量': '生成-审计循环' },
      },
      'apply': {
        label: '投递助手',
        description: 'Playwright 自动填表（Workday / LinkedIn），只填不提交',
        technologies: ['Playwright', 'Workday', 'LinkedIn Easy Apply'],
        specs: { '模式': '仅填写（fill-only）', '提交': '人工点击', '协调': '文件锁 IPC sentinel' },
      },
      'review': {
        label: '人工审核与提交',
        description: '停在审核页，人工检查后提交；不满足门槛绝不自动提交',
        technologies: ['Human-in-the-loop', 'JSONL 事件日志'],
        specs: { '门槛': '默认永不自动提交', '证据': '截图存档', '日志': '每次运行 JSONL' },
      },
    },
    en: {
      'discovery': {
        label: 'Discovery Service',
        description: 'Scans direct ATS APIs and WebSearch; de-duplicates into a queue',
        technologies: ['Brave WebSearch', 'Greenhouse / Lever / Ashby API', 'Python'],
        specs: { 'Sources': 'ATS APIs + WebSearch', 'Dedup': 'local tracker + history', 'Cache': '24h on-disk' },
      },
      'extract': {
        label: 'JD Extract & Gate',
        description: 'LangGraph nodes extract the job description and gate on eligibility',
        technologies: ['LangGraph', 'Claude / OpenAI API'],
        specs: { 'Graph': '~20 typed nodes', 'Gate': 'eligibility + active', 'Output': 'structured JD' },
      },
      'score': {
        label: 'Fit Scoring',
        description: 'Scores the JD against the candidate across weighted dimensions',
        technologies: ['LangGraph', 'Weighted rubric', 'Claude / OpenAI API'],
        specs: { 'Dimensions': 'weighted', 'Mode': 'student | full switch', 'Tests': '460+ pytest' },
      },
      'generate': {
        label: 'Tailored Generation',
        description: 'On a passing score, generates a tailored resume, cover letter, and report',
        technologies: ['Jinja2', 'Playwright PDF', 'Claude / OpenAI API'],
        specs: { 'Artifacts': 'CV + cover letter + report', 'Format': 'HTML → PDF', 'Quality': 'generate-audit loop' },
      },
      'apply': {
        label: 'Application Assistant',
        description: 'Playwright fills the ATS form (Workday / LinkedIn) — fill-only',
        technologies: ['Playwright', 'Workday', 'LinkedIn Easy Apply'],
        specs: { 'Mode': 'fill-only', 'Submit': 'manual click', 'IPC': 'file-lock sentinels' },
      },
      'review': {
        label: 'Human Review & Submit',
        description: 'Stops at review; a human submits. Never auto-submits behind unmet gates',
        technologies: ['Human-in-the-loop', 'JSONL event log'],
        specs: { 'Gate': 'never auto-submit by default', 'Evidence': 'screenshots', 'Log': 'per-run JSONL' },
      },
    },
  };
  return data[lang];
};

/** 节点颜色映射（暖色图表调色板）*/
const nodeColors: Record<string, string> = {
  'discovery': '#c96442',  // terracotta
  'extract':   '#c9a46a',  // ochre
  'score':     '#d97757',  // coral
  'generate':  '#8b5a3c',  // clay
  'apply':     '#d4b896',  // sand
  'review':    '#4d4c48',  // ink
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
  { id: 'discovery', position: { x: 50, y: 150 }, data: { label: details['discovery'].label }, style: nodeStyle('discovery') },
  { id: 'extract', position: { x: 250, y: 50 }, data: { label: details['extract'].label }, style: nodeStyle('extract') },
  { id: 'score', position: { x: 250, y: 250 }, data: { label: details['score'].label }, style: nodeStyle('score') },
  { id: 'generate', position: { x: 480, y: 150 }, data: { label: details['generate'].label }, style: nodeStyle('generate') },
  { id: 'apply', position: { x: 680, y: 50 }, data: { label: details['apply'].label }, style: nodeStyle('apply') },
  { id: 'review', position: { x: 680, y: 250 }, data: { label: details['review'].label }, style: nodeStyle('review') },
];

/** ReactFlow边连接（暖色调色板）*/
const edges: Edge[] = [
  { id: 'e1', source: 'discovery', target: 'extract', animated: true, style: { stroke: '#c96442' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#c9a46a' } },
  { id: 'e2', source: 'extract', target: 'score', animated: true, style: { stroke: '#c9a46a' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#d97757' } },
  { id: 'e3', source: 'score', target: 'generate', animated: true, style: { stroke: '#d97757' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5a3c' } },
  { id: 'e4', source: 'generate', target: 'apply', animated: true, style: { stroke: '#8b5a3c' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#d4b896' } },
  { id: 'e5', source: 'apply', target: 'review', animated: true, style: { stroke: '#d4b896' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4d4c48' } },
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
