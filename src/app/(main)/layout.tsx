import Navbar from '@/components/Navbar';
import AiAgentWidget from '@/components/AiAgentWidget';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <AiAgentWidget />
    </>
  );
}
