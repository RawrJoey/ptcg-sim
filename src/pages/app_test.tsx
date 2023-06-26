import { PageController } from '@/components/PageController';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // BETA FLAG - REMOVE
  if (location.hostname === 'twinleaf.gg') return;

  return (
    <PageController />
  );
}
