import type { Metadata } from 'next';
import TeammateShowcase from '@/components/TeammateShowcase';

export const metadata: Metadata = {
  title: 'H.E.A.D. Competition 2026 — Susana Carolina Romero Aparicio',
  robots: { index: false, follow: false },
};

export default function SusanaPage() {
  return (
    <TeammateShowcase
      person={{
        name: 'Susana Carolina Romero Aparicio',
        pdfPath: '/resume/head/position_Susana Carolina Romero Aparicio.pdf',
        imagePath: '/resume/head/position_Susana_Carolina-1.png',
      }}
    />
  );
}
