'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { BudgetHealthStatus } from '../types';
import { DASHBOARD_MESSAGES } from '../messages';

interface BudgetProgressBarProps {
  percentageUsed: number;
  healthStatus: BudgetHealthStatus;
  className?: string;
}

/**
 * Budget progress bar with dynamic health-based coloring
 * Shows percentage both visually and numerically for accessibility
 */
export function BudgetProgressBar({
  percentageUsed,
  healthStatus,
  className
}: BudgetProgressBarProps) {
  // Cap percentage display at 100% for visual consistency
  const displayPercentage = Math.min(percentageUsed, 100);

  const colorClasses = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    alert: 'bg-orange-500',
    danger: 'bg-red-500'
  }[healthStatus];

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress bar with custom colored fill */}
      <div className="relative">
        <Progress
          value={displayPercentage}
          className="h-3 bg-slate-200"
          indicatorClassName={cn('transition-all duration-700', colorClasses)}
          aria-label={`${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.PROGRESS_LABEL}: ${percentageUsed}%`}
        />

        {/* Percentage label */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 pr-2">
          <span
            className={cn(
              'text-sm font-medium',
              // Use white text if percentage is high enough to overlap with dark background
              displayPercentage > 50 ? 'text-white' : 'text-slate-700'
            )}
          >
            {percentageUsed}%
          </span>
        </div>
      </div>
    </div>
  );
}
