import { PageController } from '@/components/PageController';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // BETA FLAG - REMOVE
  const origin =
  typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (origin.includes('twinleaf.gg')) return;

  return (
    <PageController />
  );
}
