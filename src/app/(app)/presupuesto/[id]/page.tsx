'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { useBudget } from '@/lib/hooks/use-budgets';
import { useTransactionsByBudget } from '@/lib/hooks/use-transactions';
import { BudgetDetailHeader } from '@/domains/budget/components/organisms/budget-detail-header';
import { BudgetStatsCards } from '@/domains/budget/components/organisms/budget-stats-cards';
import { BudgetTransactionList } from '@/domains/budget/components/organisms/budget-transaction-list';
import { BudgetExpensesPieChart } from '@/domains/budget/components/organisms/budget-expenses-pie-chart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';

interface BudgetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BudgetDetailPage({ params }: BudgetDetailPageProps) {
  const { id } = use(params);

  const {
    data: budget,
    isLoading: isBudgetLoading,
    error: budgetError
  } = useBudget(id);
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: transactionsError
  } = useTransactionsByBudget(id);

  // Handle budget not found
  if (!isBudgetLoading && !budget) {
    notFound();
  }

  // Handle errors
  if (budgetError || transactionsError) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Alert variant="destructive" className="border-rose-200 bg-rose-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {BUDGET_DETAIL_MESSAGES.ERROR.LOAD_FAILED}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isBudgetLoading || !budget) {
    return (
      <div className="container mx-auto space-y-8 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="h-8 w-32 animate-pulse rounded bg-stone-100" />
          <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
            <div className="flex gap-4">
              <div className="h-16 w-16 animate-pulse rounded-2xl bg-stone-100" />
              <div className="flex-1 space-y-3">
                <div className="h-10 w-64 animate-pulse rounded bg-stone-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-stone-100" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
          <div className="space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-stone-100" />
            <div className="h-12 w-full animate-pulse rounded bg-stone-100" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="h-28 animate-pulse rounded-xl bg-stone-100" />
              <div className="h-28 animate-pulse rounded-xl bg-stone-100" />
              <div className="h-28 animate-pulse rounded-xl bg-stone-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <BudgetDetailHeader budget={budget} />

      {/* Stats Cards - Ingresos, Gastos, Balance */}
      <BudgetStatsCards budget={budget} transactions={transactions} />

      {/* Transactions List */}
      {isTransactionsLoading ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-stone-100" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-stone-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-stone-100" />
                      <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />
                    </div>
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded bg-stone-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <BudgetTransactionList transactions={transactions} budgetId={id} />
      )}

      {/* Pie Chart - Distribución de gastos por categoría */}
      {!isTransactionsLoading && (
        <BudgetExpensesPieChart transactions={transactions} />
      )}
    </div>
  );
}
