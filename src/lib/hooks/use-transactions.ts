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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.findAll(user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.findById(id, user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.findByBudget(budgetId, user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.findByCategory(categoryId, user.id);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.findByType(user.id, type);
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
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new TransactionRepository(supabase);
      return repository.getStats(user.id);
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
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    }
  });
}
