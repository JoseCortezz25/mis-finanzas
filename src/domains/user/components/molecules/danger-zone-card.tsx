'use client';

import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DangerZoneCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Layered card design for dangerous actions
 * Uses offset borders and subtle shadows for visual hierarchy
 */
export function DangerZoneCard({ children, className }: DangerZoneCardProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Background layer - offset */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-red-100 to-rose-50 opacity-50" />

      {/* Border layer - offset */}
      <div className="absolute -inset-px rounded-2xl border-2 border-red-200/60" />

      {/* Main card */}
      <div className="relative rounded-2xl border-2 border-red-300/40 bg-white p-6 shadow-sm">
        {/* Warning indicator */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">
            Zona de Peligro
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
