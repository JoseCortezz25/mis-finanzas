'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BudgetWithHealth, BudgetCardVariant } from '../../types';
import { formatCurrency, getMonthName } from '../../types';
import { DASHBOARD_MESSAGES } from '../../messages';
import { BudgetStatusHeader } from '../molecules/budget-status-header';
import { BudgetAmountDisplay } from '../molecules/budget-amount-display';
import { BudgetHelpText } from '../molecules/budget-help-text';
import { BudgetProgressBar } from '../budget-progress-bar';

interface BudgetStatusCardProps {
  budget: BudgetWithHealth;
  className?: string;
}

/**
 * BudgetStatusCard - Organism component
 * Complete budget status card with health-based visual variants
 * Features interactive navigation, accessibility, and responsive design
 *
 * Variants:
 * - healthy (0-79%): Gray colors, emerald bullet
 * - warning (80-99%): Amber progress bar
 * - exceeded (100%+): Red colors, shows help text, alert icon
 */
export function BudgetStatusCard({ budget, className }: BudgetStatusCardProps) {
  const router = useRouter();

  const variant: BudgetCardVariant = budget.health_status;

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
    exceeded: 'hover:border-red-500'
  }[variant];

  // Build subtitle with period information
  const subtitle = `${DASHBOARD_MESSAGES.ACTIVE_BUDGETS.MONTHLY_BUDGET_LABEL} • ${getMonthName(budget.month)} ${budget.year}`;

  return (
    <Card
      role="article"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group border-border cursor-pointer border-2 transition-all duration-200',
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
      <CardContent className="space-y-4 p-6">
        {/* Header Section: Title + Subtitle + Badge */}
        <BudgetStatusHeader
          title={budget.name}
          subtitle={subtitle}
          percentageUsed={budget.percentage_used}
          variant={variant}
        />

        {/* Amounts Section: Current/Total + Available */}
        <BudgetAmountDisplay
          currentAmount={budget.spent_amount}
          totalAmount={budget.total_amount}
          availableAmount={budget.available_amount}
          variant={variant}
        />

        {/* Progress Bar Section */}
        <BudgetProgressBar
          percentageUsed={budget.percentage_used}
          healthStatus={budget.health_status}
        />

        {/* Help Text - Only for exceeded budgets */}
        {variant === 'exceeded' && (
          <BudgetHelpText
            text={DASHBOARD_MESSAGES.ACTIVE_BUDGETS.HELP_TEXT.EXCEEDED}
          />
        )}
      </CardContent>
    </Card>
  );
}
