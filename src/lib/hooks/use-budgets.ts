'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/client';
import { BudgetRepository, type Budget } from '@/lib/repositories';
import {
  createBudget,
  updateBudget,
  deleteBudget,
  updateBudgetStatus
} from '@/app/actions/budget-actions';

/**
 * Query key factory for budgets
 */
export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (userId: string) => [...budgetKeys.lists(), userId] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
  current: (userId: string) => [...budgetKeys.all, 'current', userId] as const,
  active: (userId: string) => [...budgetKeys.all, 'active', userId] as const,
  year: (userId: string, year: number) =>
    [...budgetKeys.all, 'year', userId, year] as const
};

/**
 * Hook to fetch all budgets for the current user
 */
export function useBudgets() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      return repository.findAll(user.id);
    }
  });
}

/**
 * Hook to fetch a single budget by ID
 */
export function useBudget(id: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      return repository.findById(id, user.id);
    },
    enabled: !!id
  });
}

/**
 * Hook to fetch current budget (current month/year)
 */
export function useCurrentBudget() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      return repository.findCurrent(user.id);
    },
    select: data => data
  });
}

/**
 * Hook to fetch active budgets
 */
export function useActiveBudgets() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      return repository.findActive(user.id);
    }
  });
}

/**
 * Hook to create a new budget
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    }
  });
}

/**
 * Hook to update a budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    }
  });
}

/**
 * Hook to delete a budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    }
  });
}

/**
 * Hook to update budget status
 */
export function useUpdateBudgetStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status
    }: {
      id: string;
      status: 'draft' | 'active' | 'closed';
    }) => updateBudgetStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    }
  });
}
