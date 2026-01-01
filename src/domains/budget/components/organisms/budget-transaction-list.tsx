'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { TRANSACTION_MESSAGES } from '@/domains/transaction/messages';
import { useCategories } from '@/lib/hooks';
import type { Database } from '@/types/supabase';
import { cn } from '@/lib/utils';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface BudgetTransactionListProps {
  transactions: Transaction[];
  budgetId: string;
}

const ITEMS_PER_PAGE = 15;

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{BUDGET_DETAIL_MESSAGES.TRANSACTIONS.TITLE}</CardTitle>
              <CardDescription>
                {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.SUBTITLE}
              </CardDescription>
            </div>
            <Button onClick={handleCreateTransaction} className="gap-2">
              <Plus className="h-4 w-4" />
              {BUDGET_DETAIL_MESSAGES.ACTIONS.CREATE_TRANSACTION}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">
              {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_TITLE}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_DESC}
            </p>
            <Button onClick={handleCreateTransaction} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              {BUDGET_DETAIL_MESSAGES.EMPTY.NO_TRANSACTIONS_ACTION}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{BUDGET_DETAIL_MESSAGES.TRANSACTIONS.TITLE}</CardTitle>
            <CardDescription>
              {transactions.length}{' '}
              {transactions.length === 1
                ? BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT_SINGULAR
                : BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT}
            </CardDescription>
          </div>
          <Button onClick={handleCreateTransaction} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">
              {BUDGET_DETAIL_MESSAGES.ACTIONS.CREATE_TRANSACTION}
            </span>
            <span className="sm:hidden">Crear</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop table view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{TRANSACTION_MESSAGES.TABLE.DATE}</TableHead>
                <TableHead>{TRANSACTION_MESSAGES.TABLE.DESCRIPTION}</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>{TRANSACTION_MESSAGES.TABLE.TYPE}</TableHead>
                <TableHead className="text-right">
                  {TRANSACTION_MESSAGES.TABLE.AMOUNT}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map(transaction => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer"
                  onClick={() => handleViewTransaction(transaction.id)}
                >
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    {transaction.description || transaction.notes || '-'}
                  </TableCell>
                  <TableCell>
                    {getCategoryLabel(transaction.category_id)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === 'income' ? 'default' : 'secondary'
                      }
                    >
                      {
                        BUDGET_DETAIL_MESSAGES.TRANSACTION_TYPES[
                          transaction.type.toUpperCase() as 'EXPENSE' | 'INCOME'
                        ]
                      }
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold',
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile card view */}
        <div className="space-y-3 md:hidden">
          {paginatedTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors"
              onClick={() => handleViewTransaction(transaction.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <p className="font-medium">
                    {transaction.description ||
                      getCategoryLabel(transaction.category_id)}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <Badge
                      variant={
                        transaction.type === 'income' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {
                        BUDGET_DETAIL_MESSAGES.TRANSACTION_TYPES[
                          transaction.type.toUpperCase() as 'EXPENSE' | 'INCOME'
                        ]
                      }
                    </Badge>
                  </div>
                </div>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              {BUDGET_DETAIL_MESSAGES.PAGINATION.SHOWING} {startIndex + 1} -{' '}
              {Math.min(endIndex, transactions.length)}{' '}
              {BUDGET_DETAIL_MESSAGES.PAGINATION.OF} {transactions.length}{' '}
              {BUDGET_DETAIL_MESSAGES.TRANSACTIONS.COUNT}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {BUDGET_DETAIL_MESSAGES.PAGINATION.PREVIOUS}
              </Button>
              <div className="flex items-center gap-2 px-3 text-sm">
                {BUDGET_DETAIL_MESSAGES.PAGINATION.PAGE} {currentPage}{' '}
                {BUDGET_DETAIL_MESSAGES.PAGINATION.OF} {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                {BUDGET_DETAIL_MESSAGES.PAGINATION.NEXT}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
