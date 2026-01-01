'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { useBudget } from '@/lib/hooks/use-budgets';
import { useTransactionsByBudget } from '@/lib/hooks/use-transactions';
import { BudgetDetailHeader } from '@/domains/budget/components/organisms/budget-detail-header';
import { BudgetMetrics } from '@/domains/budget/components/organisms/budget-metrics';
import { BudgetTransactionList } from '@/domains/budget/components/organisms/budget-transaction-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
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
      <div className="container mx-auto space-y-6 p-6">
        <Skeleton className="h-10 w-40" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <BudgetDetailHeader budget={budget} />

      {/* Metrics */}
      <BudgetMetrics budget={budget} transactions={transactions} />

      {/* Transactions List */}
      {isTransactionsLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <BudgetTransactionList transactions={transactions} budgetId={id} />
      )}
    </div>
  );
}
