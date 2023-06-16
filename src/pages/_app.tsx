import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import store from '../app/store';
import { Provider } from 'react-redux';
import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient({ options: {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }}))
  const isMobile = useIsMobile();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
              <Component {...pageProps} />
            </DndProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </Provider>
    </SessionContextProvider>
  );
}
