import type { Metadata } from 'next';
import EdgeOrBetaContent from './EdgeOrBetaContent';

export const metadata: Metadata = {
  title: 'Edge or Beta? — Capstone Trading Rule Tester',
  description: 'Evaluate technical indicator trading strategies against random stock selection, random timing, and buy-and-hold SPY.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EdgeOrBetaPage() {
  return <EdgeOrBetaContent />;
}
