import type { Metadata } from 'next';
import TeammateShowcase from '@/components/TeammateShowcase';

export const metadata: Metadata = {
  title: 'H.E.A.D. Competition 2026 — Su Myat Aung',
  robots: { index: false, follow: false },
};

export default function SuPage() {
  return (
    <TeammateShowcase
      person={{
        name: 'Su Myat Aung',
        pdfPath: '/resume/head/position_Su Myat Aung.pdf',
        imagePath: '/resume/head/position_Su_Myat_Aung-1.png',
      }}
    />
  );
}
