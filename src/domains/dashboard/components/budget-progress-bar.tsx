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
 * Visual-only progress indicator (percentage shown in header badge)
 */
export function BudgetProgressBar({
  percentageUsed,
  healthStatus,
  className
}: BudgetProgressBarProps) {
  // Cap percentage display at 100% for visual consistency
  const displayPercentage = Math.min(percentageUsed, 100);

  const progressColors = {
    exceeded: {
      bg: 'bg-red-100',
      fill: 'bg-red-500'
    },
    warning: {
      bg: 'bg-amber-100',
      fill: 'bg-amber-500'
    },
    healthy: {
      bg: 'bg-gray-100',
      fill: 'bg-gray-800'
    }
  }[healthStatus];

  return (
    <div className={className}>
      <Progress
        value={displayPercentage}
        className={cn('h-2', progressColors.bg)}
        indicatorClassName={cn(
          'transition-all duration-700',
          progressColors.fill
        )}
        aria-label={`${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.PROGRESS_LABEL}: ${percentageUsed}%`}
      />
    </div>
  );
}
