'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BudgetCardVariant } from '../../types';

interface BudgetStatusHeaderProps {
  title: string;
  subtitle: string;
  percentageUsed: number;
  variant: BudgetCardVariant;
  className?: string;
}

/**
 * BudgetStatusHeader - Molecule component
 * Header section with budget title, subtitle and percentage badge
 * Displays alert icon for exceeded budgets
 */
export function BudgetStatusHeader({
  title,
  subtitle,
  percentageUsed,
  variant,
  className
}: BudgetStatusHeaderProps) {
  const badgeColors = {
    exceeded: {
      bg: 'bg-red-100',
      text: 'text-red-500'
    },
    warning: {
      bg: 'bg-gray-100',
      text: 'text-gray-600'
    },
    healthy: {
      bg: 'bg-gray-100',
      text: 'text-gray-600'
    }
  }[variant];

  const displayPercentage = Math.round(percentageUsed);

  return (
    <div className={cn('space-y-1', className)}>
      {/* Title and Badge Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Title Section */}
        <div className="flex-1 space-y-1">
          <h3 className="text-lg leading-tight font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
            {subtitle}
          </p>
        </div>

        {/* Percentage Badge */}
        <div
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1',
            badgeColors.bg
          )}
        >
          {variant === 'exceeded' && (
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className={cn('text-sm font-semibold', badgeColors.text)}>
            {displayPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
