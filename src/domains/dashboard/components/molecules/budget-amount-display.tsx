'use client';

import { cn } from '@/lib/utils';
import type { BudgetCardVariant } from '../../types';
import { formatCurrency } from '../../types';
import { DASHBOARD_MESSAGES } from '../../messages';
import { StatusBullet } from '../atoms/status-bullet';

interface BudgetAmountDisplayProps {
  currentAmount: number;
  totalAmount: number;
  availableAmount: number;
  variant: BudgetCardVariant;
  className?: string;
}

/**
 * BudgetAmountDisplay - Molecule component
 * Displays current vs total budget amounts and availability status
 * Shows exceeded or available amount with colored bullet indicator
 */
export function BudgetAmountDisplay({
  currentAmount,
  totalAmount,
  availableAmount,
  variant,
  className
}: BudgetAmountDisplayProps) {
  const isExceeded = availableAmount < 0;

  const amountColors = {
    exceeded: 'text-red-500',
    warning: 'text-gray-800',
    healthy: 'text-gray-800'
  }[variant];

  const statusLabel = isExceeded
    ? DASHBOARD_MESSAGES.ACTIVE_BUDGETS.EXCEEDED_BY_LABEL
    : DASHBOARD_MESSAGES.ACTIVE_BUDGETS.AVAILABLE_LABEL;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Current Amount / Total Amount */}
      <div className="flex items-baseline gap-2">
        <span className={cn('text-3xl leading-tight font-bold', amountColors)}>
          {formatCurrency(currentAmount)}
        </span>
        <span className="text-lg font-normal text-gray-400">
          /{formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Available/Exceeded Status */}
      <div className="flex items-center gap-1.5">
        <StatusBullet variant={variant} />
        <span className="text-sm font-medium text-gray-600">
          {statusLabel}: {formatCurrency(Math.abs(availableAmount))}
        </span>
      </div>
    </div>
  );
}
