'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/client';
import { TransactionRepository, type Transaction } from '@/lib/repositories';
import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '@/app/actions/transaction-actions';

/**
 * Query key factory for transactions
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (userId: string) => [...transactionKeys.lists(), userId] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  byBudget: (budgetId: string) =>
    [...transactionKeys.all, 'budget', budgetId] as const,
  byCategory: (categoryId: string) =>
    [...transactionKeys.all, 'category', categoryId] as const,
  byType: (type: 'income' | 'expense') =>
    [...transactionKeys.all, 'type', type] as const,
  byDateRange: (startDate: string, endDate: string) =>
    [...transactionKeys.all, 'dateRange', startDate, endDate] as const
};

/**
 * Hook to fetch all transactions for the current user
 */
export function useTransactions() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: transactionKeys.all,
    queryFn: async () => {
      console.log('[TRANSACTIONS] useTransactions - Obteniendo transacciones');
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.findAll(user.id);
      console.log(
        '[TRANSACTIONS] useTransactions - Exito:',
        result.length,
        'transacciones'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch a single transaction by ID
 */
export function useTransaction(id: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      console.log(
        '[TRANSACTIONS] useTransaction - Obteniendo transaccion:',
        id
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.findById(id, user.id);
      console.log('[TRANSACTIONS] useTransaction - Exito:', result);
      return result;
    },
    enabled: !!id
  });
}

/**
 * Hook to fetch transactions by budget
 */
export function useTransactionsByBudget(budgetId: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: transactionKeys.byBudget(budgetId),
    queryFn: async () => {
      console.log(
        '[TRANSACTIONS] useTransactionsByBudget - Obteniendo transacciones por presupuesto:',
        budgetId
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.findByBudget(budgetId, user.id);
      console.log(
        '[TRANSACTIONS] useTransactionsByBudget - Exito:',
        result.length,
        'transacciones'
      );
      return result;
    },
    enabled: !!budgetId
  });
}

/**
 * Hook to fetch transactions by category
 */
export function useTransactionsByCategory(categoryId: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: transactionKeys.byCategory(categoryId),
    queryFn: async () => {
      console.log(
        '[TRANSACTIONS] useTransactionsByCategory - Obteniendo transacciones por categoria:',
        categoryId
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.findByCategory(categoryId, user.id);
      console.log(
        '[TRANSACTIONS] useTransactionsByCategory - Exito:',
        result.length,
        'transacciones'
      );
      return result;
    },
    enabled: !!categoryId
  });
}

/**
 * Hook to fetch transactions by type
 */
export function useTransactionsByType(type: 'income' | 'expense') {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: transactionKeys.byType(type),
    queryFn: async () => {
      console.log(
        '[TRANSACTIONS] useTransactionsByType - Obteniendo transacciones por tipo:',
        type
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.findByType(user.id, type);
      console.log(
        '[TRANSACTIONS] useTransactionsByType - Exito:',
        result.length,
        'transacciones'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch transaction statistics
 */
export function useTransactionStats() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: [...transactionKeys.all, 'stats'],
    queryFn: async () => {
      console.log(
        '[TRANSACTIONS] useTransactionStats - Obteniendo estadisticas'
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      const result = await repository.getStats(user.id);
      console.log('[TRANSACTIONS] useTransactionStats - Exito:', result);
      return result;
    }
  });
}

/**
 * Hook to create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      console.log(
        '[TRANSACTIONS] useCreateTransaction - Transaccion creada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    }
  });
}

/**
 * Hook to update a transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      console.log(
        '[TRANSACTIONS] useUpdateTransaction - Transaccion actualizada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    }
  });
}

/**
 * Hook to delete a transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      console.log(
        '[TRANSACTIONS] useDeleteTransaction - Transaccion eliminada exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    }
  });
}
