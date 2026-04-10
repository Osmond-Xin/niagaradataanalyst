/**
 * 根布局组件
 * Claude 编辑风设计系统：羊皮纸基底 + 暖赤陶强调
 * 字体：Fraunces（display，500 权重）+ Inter（正文）
 * 默认浅色模式（darkMode: 'class' 可按需添加 dark className）
 */
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Inter：正文 / UI — 400 & 500 权重
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

// Fraunces：标题 display 字体（类 Anthropic Serif）— 500 权重
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-fraunces',
  display: 'swap',
});

/** 全局 SEO 元数据 */
export const metadata: Metadata = {
  title: {
    default: 'NiagaraDataAnalyst - AI时代软件架构师',
    template: '%s | NiagaraDataAnalyst',
  },
  description: 'AI工程、软件架构与数据分析专家。18年经验，专注无服务器架构、AI集成、数据工程与产品设计。AI Engineer, Software Architect, Data Analyst.',
  keywords: [
    'AI Engineer', 'Software Architect', 'Data Analyst', 'Product Design',
    'AI工程师', '软件架构师', '数据分析', '产品设计',
    'Serverless', 'LLM', 'MCP', 'Vertex AI',
    'Next.js', 'TypeScript', 'Full-Stack Developer',
    'Niagara', 'Data Pipeline', 'Airbyte', 'Snowflake',
  ],
  authors: [{ name: 'NiagaraDataAnalyst' }],
  creator: 'NiagaraDataAnalyst',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://niagaradataanalyst.com'),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NiagaraDataAnalyst',
    title: 'NiagaraDataAnalyst - AI & Data Architect',
    description: 'AI-Era One-Person Army: Software Architecture × Data Engineering × Product Design. 18 years of experience.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Osmond_Xin',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 默认浅色模式（移除了硬编码的 className="dark"）
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans bg-parchment text-text-primary antialiased`}>
        <GoogleAnalytics />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
