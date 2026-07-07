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
import { Analytics } from '@vercel/analytics/next';

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
    default: 'Yi Xin — Data & AI-Application Engineer',
    template: '%s | Yi Xin',
  },
  description: 'Data & AI-application engineer in Canada. Builds LLM agents (LangGraph), RAG pipelines, and data/IIoT backends. Master of Data Analytics; PGWP-eligible, no sponsorship required.',
  keywords: [
    'AI Engineer', 'Data Engineer', 'AI Application Engineer', 'ML Engineer',
    'LangGraph', 'LangChain', 'RAG', 'LLM', 'Prompt Engineering',
    'Python', 'Playwright', 'FAISS', 'Chroma',
    'Data Pipeline', 'TimescaleDB', 'AWS',
    'Canada', 'Ontario', 'PGWP',
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
    title: 'Yi Xin — Data & AI-Application Engineer',
    description: 'Building production AI end to end: LangGraph agents, RAG pipelines, and data/IIoT backends. Master of Data Analytics in Canada; PGWP-eligible.',
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
        <Analytics />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
