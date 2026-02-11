/**
 * 根布局组件
 * 包含全局SEO Metadata、LanguageProvider、Navbar和暗色主题
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import AiAgentWidget from '@/components/AiAgentWidget';

const inter = Inter({ subsets: ['latin'] });

/** 全局SEO元数据 */
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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <AiAgentWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
