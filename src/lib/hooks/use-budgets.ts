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
 * Hook to fetch all budgets for the current user with computed amounts
 * Amount is calculated from assigned income transactions
 */
export function useBudgets() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: async () => {
      console.log('[BUDGETS] useBudgets - Obteniendo presupuestos con montos');
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      const result = await repository.findAllWithAmounts(user.id);
      console.log(
        '[BUDGETS] useBudgets - Exito:',
        result.length,
        'presupuestos'
      );
      return result;
    }
  });
}

/**
 * Hook to fetch a single budget by ID with computed amount
 * Amount is calculated from assigned income transactions
 */
export function useBudget(id: string) {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: async () => {
      console.log('[BUDGETS] useBudget - Obteniendo presupuesto con monto:', id);
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      const result = await repository.findByIdWithAmount(id, user.id);
      console.log('[BUDGETS] useBudget - Exito:', result);
      return result;
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
      console.log('[BUDGETS] useCurrentBudget - Obteniendo presupuesto actual');
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      const result = await repository.findCurrent(user.id);
      console.log('[BUDGETS] useCurrentBudget - Exito:', result);
      return result;
    },
    select: data => data
  });
}

/**
 * Hook to fetch active budgets with computed amounts
 * Amount is calculated from assigned income transactions
 */
export function useActiveBudgets() {
  const supabase = createBrowserClient();

  return useQuery({
    queryKey: budgetKeys.all,
    queryFn: async () => {
      console.log(
        '[BUDGETS] useActiveBudgets - Obteniendo presupuestos activos con montos'
      );
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const repository = new BudgetRepository(supabase);
      const result = await repository.findActiveWithAmounts(user.id);
      console.log(
        '[BUDGETS] useActiveBudgets - Exito:',
        result.length,
        'presupuestos'
      );
      return result;
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
      console.log(
        '[BUDGETS] useCreateBudget - Presupuesto creado exitosamente'
      );
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
      console.log(
        '[BUDGETS] useUpdateBudget - Presupuesto actualizado exitosamente'
      );
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
      console.log(
        '[BUDGETS] useDeleteBudget - Presupuesto eliminado exitosamente'
      );
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
      console.log(
        '[BUDGETS] useUpdateBudgetStatus - Estado actualizado exitosamente'
      );
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    }
  });
}
