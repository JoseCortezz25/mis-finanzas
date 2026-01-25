'use client';

import { useBudgets } from '@/lib/hooks';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useBudgetCalculations } from '../hooks/use-budget-calculations';
import { DASHBOARD_MESSAGES } from '../messages';
import { BudgetStatusCard } from './organisms/budget-status-card';
import { BudgetCardSkeleton } from './budget-card-skeleton';
import { EmptyBudgetsState } from './empty-budgets-state';
import { ErrorBudgetsState } from './error-budgets-state';

/**
 * Active Budgets Section - Main container component
 * Displays grid of budget cards with health status and progress
 * Handles loading, empty, and error states gracefully
 */
export function ActiveBudgetsSection() {
  const {
    data: budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
    refetch: refetchBudgets
  } = useBudgets();

  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();

  // Calculate budget health metrics
  const budgetsWithHealth = useBudgetCalculations({
    budgets,
    transactions
  });

  // Filter only active budgets
  const activeBudgets = budgetsWithHealth.filter(b => b.status === 'active');

  const isLoading = budgetsLoading || transactionsLoading;
  const hasError = budgetsError;
  const isEmpty = !isLoading && !hasError && activeBudgets.length === 0;

  return (
    <section aria-labelledby="active-budgets-title" className="space-y-5">
      {/* Section Header */}
      <div className="space-y-1">
        <h2
          id="active-budgets-title"
          className="text-foreground text-2xl font-bold"
        >
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.TITLE}
        </h2>
        <p className="text-muted-foreground text-sm">
          {DASHBOARD_MESSAGES.ACTIVE_BUDGETS.SUBTITLE}
        </p>
      </div>

      {/* Content Area */}
      <div>
        {/* Loading State */}
        {isLoading && (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={DASHBOARD_MESSAGES.ACTIVE_BUDGETS.LOADING_ACCESSIBLE}
          >
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
            <BudgetCardSkeleton />
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <ErrorBudgetsState onRetry={() => refetchBudgets()} />
        )}

        {/* Empty State */}
        {isEmpty && <EmptyBudgetsState />}

        {/* Budget Cards Grid */}
        {!isLoading && !hasError && activeBudgets.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeBudgets.map(budget => (
              <BudgetStatusCard key={budget.id} budget={budget} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
