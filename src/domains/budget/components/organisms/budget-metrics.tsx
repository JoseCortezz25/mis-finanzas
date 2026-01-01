'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { useBudgetCalculations } from '@/domains/budget/hooks';
import type { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';

type Budget = Database['public']['Tables']['budgets']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

interface BudgetMetricsProps {
  budget: Budget;
  transactions: Transaction[];
}

const HEALTH_STATUS_CONFIG = {
  healthy: {
    color: 'bg-green-500',
    textColor: 'text-green-600',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.HEALTHY,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.HEALTHY_DESC
  },
  warning: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.WARNING,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.WARNING_DESC
  },
  alert: {
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.ALERT,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.ALERT_DESC
  },
  danger: {
    color: 'bg-red-500',
    textColor: 'text-red-600',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.DANGER,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.DANGER_DESC
  }
};

export function BudgetMetrics({ budget, transactions }: BudgetMetricsProps) {
  const calculations = useBudgetCalculations(budget, transactions);
  const healthConfig = HEALTH_STATUS_CONFIG[calculations.healthStatus];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{BUDGET_DETAIL_MESSAGES.OVERVIEW.TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget exceeded warning */}
        {calculations.isOverBudget && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {BUDGET_DETAIL_MESSAGES.WARNING.BUDGET_EXCEEDED_DESC}
            </AlertDescription>
          </Alert>
        )}

        {/* Main amount display */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold md:text-4xl">
              {formatCurrency(calculations.totalSpent)}
            </span>
            <span className="text-muted-foreground text-lg">
              {BUDGET_DETAIL_MESSAGES.OVERVIEW.OF_TOTAL}{' '}
              {formatCurrency(budget.total_amount)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {BUDGET_DETAIL_MESSAGES.OVERVIEW.SPENT_LABEL}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {BUDGET_DETAIL_MESSAGES.OVERVIEW.PROGRESS_LABEL}
            </span>
            <span className={cn('font-semibold', healthConfig.textColor)}>
              {calculations.percentageUsed.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(calculations.percentageUsed, 100)}
            className="h-3"
            indicatorClassName={healthConfig.color}
          />
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', healthConfig.color)} />
            <span className="text-muted-foreground text-xs">
              {healthConfig.label} - {healthConfig.description}
            </span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Spent */}
          <div className="space-y-1 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500" />
              {BUDGET_DETAIL_MESSAGES.OVERVIEW.SPENT_LABEL}
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(calculations.totalSpent)}
            </p>
          </div>

          {/* Total Income */}
          <div className="space-y-1 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              {BUDGET_DETAIL_MESSAGES.OVERVIEW.INCOME_LABEL}
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(calculations.totalIncome)}
            </p>
          </div>

          {/* Available */}
          <div className="space-y-1 rounded-lg border p-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              {BUDGET_DETAIL_MESSAGES.OVERVIEW.AVAILABLE_LABEL}
            </div>
            <p
              className={cn(
                'text-2xl font-bold',
                calculations.available >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatCurrency(calculations.available)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
