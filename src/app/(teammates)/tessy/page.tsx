import type { Metadata } from 'next';
import TeammateShowcase from '@/components/TeammateShowcase';

export const metadata: Metadata = {
  title: 'H.E.A.D. Competition 2026 — Tessy Ramirez',
  robots: { index: false, follow: false },
};

export default function TessyPage() {
  return (
    <TeammateShowcase
      person={{
        name: 'Tessy Ramirez',
        pdfPath: '/resume/head/position_Tessy Ramirez.pdf',
        imagePath: '/resume/head/position_Tessy_Ramirez-1.png',
      }}
    />
  );
}
