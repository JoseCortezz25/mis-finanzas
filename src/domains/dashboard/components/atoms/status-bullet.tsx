'use client';

import { cn } from '@/lib/utils';
import type { BudgetCardVariant } from '../../types';

interface StatusBulletProps {
  variant: BudgetCardVariant;
  className?: string;
}

/**
 * StatusBullet - Atom component
 * Circular bullet point (6x6px) with color based on budget health variant
 * Used as a visual indicator in budget status displays
 */
export function StatusBullet({ variant, className }: StatusBulletProps) {
  const colorClass = {
    exceeded: 'bg-red-500',
    warning: 'bg-amber-500',
    healthy: 'bg-emerald-500'
  }[variant];

  return (
    <span
      className={cn('h-1.5 w-1.5 rounded-full', colorClass, className)}
      aria-hidden="true"
    />
  );
}
