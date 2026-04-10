/**
 * (teammates) 路由组布局 — 无导航条，仅供直链访问
 */
export default function TeammatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  );
}
