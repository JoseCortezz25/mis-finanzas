'use client';

import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { useBudgetCalculations } from '@/domains/budget/hooks';
import type { Database } from '@/types/supabase';
import type { BudgetWithAmount } from '@/lib/repositories';
import { cn } from '@/lib/utils';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface BudgetMetricsProps {
  budget: BudgetWithAmount;
  transactions: Transaction[];
}

const HEALTH_STATUS_CONFIG = {
  healthy: {
    color: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.HEALTHY,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.HEALTHY_DESC
  },
  warning: {
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.WARNING,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.WARNING_DESC
  },
  alert: {
    color: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    label: BUDGET_DETAIL_MESSAGES.HEALTH.ALERT,
    description: BUDGET_DETAIL_MESSAGES.HEALTH.ALERT_DESC
  },
  danger: {
    color: 'bg-rose-500',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
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
    <div className="space-y-8">
      {/* Budget exceeded warning */}
      {calculations.isOverBudget && (
        <Alert variant="destructive" className="border-rose-200 bg-rose-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {BUDGET_DETAIL_MESSAGES.WARNING.BUDGET_EXCEEDED_DESC}
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section: Circular Progress with Main Amount */}
      <div className="relative">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left: Main card with dramatic presentation */}
          <div className="relative">
            <div
              className={cn(
                'relative overflow-hidden rounded-3xl border-2 p-10 lg:p-14',
                healthConfig.bgLight,
                healthConfig.borderColor
              )}
            >
              {/* Decorative circle blur */}
              <div
                className={cn(
                  'absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl',
                  healthConfig.color
                )}
                aria-hidden="true"
              />

              <div className="relative space-y-8">
                {/* Title */}
                <div>
                  <h2 className="text-muted-foreground/60 mb-2 text-xs font-bold tracking-widest uppercase">
                    {BUDGET_DETAIL_MESSAGES.OVERVIEW.TITLE}
                  </h2>
                  <div
                    className="h-1 w-12 rounded-full bg-stone-200"
                    aria-hidden="true"
                  />
                </div>

                {/* Main amount - super prominent */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-4">
                    <span className="text-foreground text-6xl font-black tracking-tight tabular-nums lg:text-7xl xl:text-8xl">
                      {formatCurrency(calculations.totalSpent).replace(
                        /\s/g,
                        ''
                      )}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    de{' '}
                    <span className="text-foreground text-xl font-bold">
                      {formatCurrency(budget.total_amount)}
                    </span>{' '}
                    total
                  </p>
                </div>

                {/* Progress bar - sleek and minimal */}
                <div className="space-y-4 pt-4">
                  <Progress
                    value={Math.min(calculations.percentageUsed, 100)}
                    className="h-2 bg-white/80"
                    indicatorClassName={healthConfig.color}
                    aria-label={`Progreso del presupuesto: ${calculations.percentageUsed.toFixed(1)}%`}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full',
                          healthConfig.color
                        )}
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground text-sm font-semibold">
                        {healthConfig.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-3xl font-black tabular-nums',
                        healthConfig.textColor
                      )}
                    >
                      {calculations.percentageUsed.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Floating circular progress indicator */}
          <div className="hidden items-center justify-center lg:flex">
            <div className="relative">
              {/* Circular background */}
              <svg
                className="h-56 w-56 -rotate-90 transform"
                aria-hidden="true"
              >
                {/* Background circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-stone-100"
                />
                {/* Progress circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={healthConfig.textColor}
                  strokeDasharray={`${(calculations.percentageUsed / 100) * 628} 628`}
                  style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={cn(
                    'mb-2 flex h-16 w-16 items-center justify-center rounded-2xl',
                    healthConfig.color
                  )}
                  aria-hidden="true"
                >
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <span
                  className={cn(
                    'text-4xl font-black tabular-nums',
                    healthConfig.textColor
                  )}
                >
                  {calculations.percentageUsed.toFixed(0)}%
                </span>
                <span className="text-muted-foreground mt-1 text-xs">
                  usado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Box Grid for Metrics */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Spent - larger, prominent */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 via-rose-50/50 to-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-rose-200 hover:shadow-2xl md:col-span-2 lg:col-span-2">
          <div className="relative">
            <div className="mb-6 flex items-start justify-between">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                aria-hidden="true"
              >
                <TrendingDown className="h-8 w-8 text-rose-600" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground/60 text-xs font-bold tracking-wider uppercase">
                {BUDGET_DETAIL_MESSAGES.OVERVIEW.SPENT_LABEL}
              </p>
              <p className="text-foreground text-5xl font-black tracking-tight tabular-nums">
                {formatCurrency(calculations.totalSpent)}
              </p>
            </div>
          </div>
          {/* Decorative element */}
          <div
            className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-rose-100/50 blur-2xl"
            aria-hidden="true"
          />
        </div>

        {/* Income - smaller, top right */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-2xl lg:col-span-2">
          <div className="relative">
            <div className="mb-4 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                aria-hidden="true"
              >
                <TrendingUp className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground/60 text-xs font-bold tracking-wider uppercase">
                  {BUDGET_DETAIL_MESSAGES.OVERVIEW.INCOME_LABEL}
                </p>
                <p className="text-foreground text-3xl font-black tabular-nums">
                  {formatCurrency(calculations.totalIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available - dramatic, spans full width */}
        <div
          className={cn(
            'group relative overflow-hidden rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:col-span-2 lg:col-span-4 lg:p-10',
            calculations.available >= 0
              ? 'border-blue-100 bg-gradient-to-r from-blue-50 via-blue-50/30 to-indigo-50/20 hover:border-blue-200'
              : 'border-rose-100 bg-gradient-to-r from-rose-50 via-rose-50/30 to-red-50/20 hover:border-rose-200'
          )}
        >
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                  calculations.available >= 0 ? 'bg-blue-100' : 'bg-rose-100'
                )}
                aria-hidden="true"
              >
                <Wallet
                  className={cn(
                    'h-10 w-10',
                    calculations.available >= 0
                      ? 'text-blue-600'
                      : 'text-rose-600'
                  )}
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground/60 text-xs font-bold tracking-widest uppercase">
                  {BUDGET_DETAIL_MESSAGES.OVERVIEW.AVAILABLE_LABEL}
                </p>
                <p
                  className={cn(
                    'text-5xl font-black tracking-tight tabular-nums lg:text-6xl',
                    calculations.available >= 0
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  )}
                >
                  {formatCurrency(calculations.available)}
                </p>
              </div>
            </div>

            {/* Percentage badge */}
            <div
              className={cn(
                'flex flex-col items-center justify-center rounded-xl px-8 py-4 shadow-lg',
                calculations.available >= 0 ? 'bg-emerald-100' : 'bg-rose-100'
              )}
            >
              <span className="text-muted-foreground mb-1 text-xs font-bold tracking-wider uppercase">
                Restante
              </span>
              <span
                className={cn(
                  'text-4xl font-black tabular-nums',
                  calculations.available >= 0
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                )}
              >
                {((calculations.available / budget.total_amount) * 100).toFixed(
                  0
                )}
                %
              </span>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            className={cn(
              'absolute -bottom-6 -left-6 h-32 w-32 rounded-full opacity-30 blur-3xl',
              calculations.available >= 0 ? 'bg-blue-200' : 'bg-rose-200'
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
