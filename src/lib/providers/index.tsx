'use client';

import { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from '@/components/ui/sonner';

/**
 * Combined Providers Wrapper
 * Wraps all application providers in the correct order
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
      <Toaster />
    </ReactQueryProvider>
  );
}
