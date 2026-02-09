/**
 * 全局TypeScript类型定义
 * 定义所有组件、数据模型和接口的类型
 */

// ==================== 语言系统类型 ====================

/** 支持的语言类型 */
export type Language = 'zh' | 'en';

/** 语言上下文接口 */
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// ==================== 导航类型 ====================

/** 导航项配置 */
export interface NavItem {
  key: string;
  href: string;
  translationKey: string;
}

// ==================== 首页组件类型 ====================

/** 英雄区块内容 */
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
}

/** 能力卡片数据 */
export interface CapabilityCard {
  id: string;
  iconName: string;
  titleKey: string;
  descriptionKey: string;
  detailsKey: string;
  technologies: string[];
}

// ==================== 案例研究类型 ====================

/** 模拟日志条目 */
export interface SimulationLog {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

/** 置信度数据点 */
export interface ConfidenceData {
  time: number;
  confidence: number;
  stage: string;
}

/** 架构节点 */
export interface ArchNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    technologies: string[];
    specs: Record<string, string>;
  };
}

/** 架构边 */
export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  label?: string;
}

// ==================== AI聊天类型 ====================

/** 聊天消息 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** 聊天模式 */
export interface ChatMode {
  id: 'chat' | 'job-match';
  nameKey: string;
  descriptionKey: string;
}

// ==================== AI人设数据类型 ====================

/** 技能分类 */
export interface SkillCategory {
  category: string;
  skills: string[];
}

/** 项目信息 */
export interface Project {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

/** 工作经验 */
export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

/** AI人设数据 */
export interface AiPersona {
  systemPrompt: string;
  portfolio: PortfolioData;
  jobMatchingPrompt: string;
}

/** 作品集数据 */
export interface PortfolioData {
  name: string;
  title: string;
  skills: SkillCategory[];
  projects: Project[];
  experience: Experience[];
}

// ==================== 数据分析类型 ====================

/** 股票数据点 */
export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 技术指标类型 */
export type IndicatorType = 'ma' | 'ema' | 'rsi' | 'macd' | 'bollinger';

/** 统计摘要 */
export interface StatisticalSummary {
  mean: number;
  std: number;
  min: number;
  max: number;
  skewness: number;
  kurtosis: number;
}

// ==================== About页面类型 ====================

/** 职业时间线条目 */
export interface CareerTimelineEntry {
  id: string;
  period: string;
  titleKey: string;
  companyKey: string;
  descriptionKey: string;
  type: 'product' | 'tech' | 'both';
  isMilestone?: boolean;
}

/** 认证/教育条目 */
export interface CertificationEntry {
  id: string;
  nameKey: string;
  issuerKey: string;
  year: string;
  icon: string;
  color: string;
}

/** 技能雷达数据点 */
export interface SkillRadarPoint {
  subjectKey: string;
  value: number;
  fullMark: number;
}

/** 关键指标 */
export interface KeyMetric {
  id: string;
  valueKey: string;
  labelKey: string;
  gradient: string;
}

// ==================== SEO类型 ====================

/** SEO关键词结构 */
export interface SeoKeywords {
  primary: { zh: string[]; en: string[] };
  secondary: { zh: string[]; en: string[] };
  longTail: { zh: string[]; en: string[] };
}
