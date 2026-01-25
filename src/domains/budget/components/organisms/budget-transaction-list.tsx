'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Receipt,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { useCategories } from '@/lib/hooks';
import type { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface BudgetTransactionListProps {
  transactions: Transaction[];
  budgetId: string;
}

const ITEMS_PER_PAGE = 12;

export function BudgetTransactionList({
  transactions,
  budgetId
}: BudgetTransactionListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: categories = [] } = useCategories();

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleCreateTransaction = () => {
    router.push(`/movimientos/crear?budgetId=${budgetId}`);
  };

  const handleViewTransaction = (id: string) => {
    router.push(`/movimientos/${id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-xl font-semibold">
              {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.TITLE}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.SUBTITLE}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100"
            aria-hidden="true"
          >
            <Receipt className="h-8 w-8 text-stone-400" />
          </div>
          <p className="text-foreground text-lg font-semibold">
            {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_TITLE}
          </p>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_DESC}
          </p>
          <Button onClick={handleCreateTransaction} className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_ACTION}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-semibold">
            {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.TITLE}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {transactions.length}{' '}
            {transactions.length === 1
              ? BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT_SINGULAR
              : BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT}
          </p>
        </div>
        <Button onClick={handleCreateTransaction} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">
            {BUDGET_DETAIL_MESSAGES.ACTIONS.CREATE_TRANSACTION}
          </span>
          <span className="sm:hidden">Crear</span>
        </Button>
      </div>

      {/* Transaction cards */}
      <div className="space-y-3">
        {paginatedTransactions.map(transaction => {
          const isIncome = transaction.type === 'income';

          return (
            <article
              key={transaction.id}
              className={cn(
                'group relative cursor-pointer touch-manipulation rounded-xl border p-4 transition-all duration-200 hover:shadow-md',
                isIncome
                  ? 'border-emerald-100 bg-emerald-50/30 hover:border-emerald-200'
                  : 'border-rose-100 bg-rose-50/30 hover:border-rose-200'
              )}
              onClick={() => handleViewTransaction(transaction.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleViewTransaction(transaction.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalles de transacción: ${transaction.description || getCategoryLabel(transaction.category_id)}`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Icon and content */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110',
                      isIncome ? 'bg-emerald-100' : 'bg-rose-100'
                    )}
                    aria-hidden="true"
                  >
                    {isIncome ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-rose-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate font-semibold">
                      {transaction.description ||
                        getCategoryLabel(transaction.category_id)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <time className="text-muted-foreground text-sm">
                        {formatDate(transaction.date)}
                      </time>
                      <span className="text-stone-300" aria-hidden="true">
                        •
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {getCategoryLabel(transaction.category_id)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      'text-xl font-bold tabular-nums',
                      isIncome ? 'text-emerald-700' : 'text-rose-700'
                    )}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {
                      BUDGET_DETAIL_MESSAGES.TRANSACTION_TYPES[
                        transaction.type.toUpperCase() as 'EXPENSE' | 'INCOME'
                      ]
                    }
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            {BUDGET_DETAIL_MESSAGES.PAGINATION.SHOWING} {startIndex + 1} -{' '}
            {Math.min(endIndex, transactions.length)}{' '}
            {BUDGET_DETAIL_MESSAGES.PAGINATION.OF} {transactions.length}{' '}
            {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="gap-1"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {BUDGET_DETAIL_MESSAGES.PAGINATION.PREVIOUS}
              </span>
            </Button>
            <div className="flex items-center gap-2 px-3 text-sm font-medium tabular-nums">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="gap-1"
              aria-label="Página siguiente"
            >
              <span className="hidden sm:inline">
                {BUDGET_DETAIL_MESSAGES.PAGINATION.NEXT}
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
