import { PageController } from '@/components/PageController';
import { Inter } from '@next/font/google';
import { useRouter } from "next/router";

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // BETA FLAG - REMOVE
  const router = useRouter();
  if (router.basePath === 'twinleaf.gg') return;

  return (
    <PageController />
  );
}
