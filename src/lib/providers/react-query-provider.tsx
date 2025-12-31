'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * React Query Provider
 * Provides React Query client to the application
 * Configured for optimal performance with Supabase + IndexedDB
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: 30 seconds (IndexedDB is fast, but we want fresh data)
            staleTime: 30 * 1000,
            // Cache time: 5 minutes
            gcTime: 5 * 60 * 1000,
            // Refetch on window focus (good for PWA)
            refetchOnWindowFocus: true,
            // Refetch on reconnect (important for offline support)
            refetchOnReconnect: true,
            // Retry failed requests (useful for network issues)
            retry: 2,
            // Don't retry on 4xx errors (client errors)
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000)
          },
          mutations: {
            // Retry mutations once (e.g., network issues)
            retry: 1
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
