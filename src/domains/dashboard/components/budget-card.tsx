'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BudgetWithHealth } from '../types';
import { formatCurrency, getMonthName } from '../types';
import { DASHBOARD_MESSAGES } from '../messages';
import { BudgetHealthBadge } from './budget-health-badge';
import { BudgetProgressBar } from './budget-progress-bar';

interface BudgetCardProps {
  budget: BudgetWithHealth;
  className?: string;
}

/**
 * Interactive budget card with health status and progress
 * Entire card is clickable - navigates to budget detail page
 * Features smooth hover effects, border highlighting, and scale animation
 */
export function BudgetCard({ budget, className }: BudgetCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/presupuesto/${budget.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Health-based border color for hover state
  const borderColorClass = {
    healthy: 'hover:border-emerald-500',
    warning: 'hover:border-amber-500',
    alert: 'hover:border-orange-500',
    danger: 'hover:border-red-500'
  }[budget.health_status];

  const isNegative = budget.available_amount < 0;

  return (
    <Card
      role="article"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group cursor-pointer transition-all duration-200',
        'border-border border-2',
        'hover:shadow-md active:scale-[0.98]',
        // Smooth scale and hover effects
        'motion-safe:hover:scale-[1.02]',
        // Reduced motion alternative
        'motion-reduce:hover:scale-100 motion-reduce:hover:opacity-90',
        // Focus ring for keyboard navigation
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        borderColorClass,
        className
      )}
      aria-label={`${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.TOOLTIP.CARD}: ${budget.name}, ${formatCurrency(budget.spent_amount)} ${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.OF_LABEL} ${formatCurrency(budget.total_amount)} gastado, ${budget.health_status}`}
    >
      <CardContent className="space-y-4 p-4 sm:p-5 lg:p-6">
        {/* Health Status Badge */}
        <div>
          <BudgetHealthBadge healthStatus={budget.health_status} />
        </div>

        {/* Progress Bar */}
        <BudgetProgressBar
          percentageUsed={budget.percentage_used}
          healthStatus={budget.health_status}
        />

        {/* Budget Name */}
        <div>
          <h3 className="text-foreground text-base font-semibold sm:text-lg lg:text-xl">
            {budget.name}
          </h3>
        </div>

        {/* Amount Details */}
        <div className="space-y-1">
          {/* Spent vs Total */}
          <div className="text-foreground text-xl font-bold sm:text-2xl">
            {formatCurrency(budget.spent_amount)}{' '}
            <span className="text-muted-foreground text-sm font-normal sm:text-base">
              {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.OF_LABEL}
            </span>{' '}
            {formatCurrency(budget.total_amount)}
          </div>

          {/* Available Amount */}
          <div
            className={cn(
              'text-muted-foreground text-sm',
              isNegative && 'font-medium text-red-600'
            )}
          >
            {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.REMAINING_LABEL}:{' '}
            {formatCurrency(budget.available_amount)}
          </div>
        </div>

        {/* Period (Month/Year) */}
        <div className="text-muted-foreground text-sm">
          {getMonthName(budget.month)} {budget.year}
        </div>
      </CardContent>
    </Card>
  );
}
