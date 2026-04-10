/**
 * (teammates) 路由组布局
 * 无导航条、无 AI 悬浮组件，仅供内部直链访问
 */
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function TeammatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <main className="min-h-screen">
        {children}
      </main>
    </LanguageProvider>
  );
}
