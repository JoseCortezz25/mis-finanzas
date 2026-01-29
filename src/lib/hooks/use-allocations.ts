'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAllocation,
  deleteAllocation
} from '@/app/actions/allocation-actions';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * Fetch allocations for a specific budget or all allocations
 *
 * @param budgetId - Optional budget ID to filter allocations
 * @returns React Query result with allocations data
 */
export function useAllocations(budgetId?: string) {
  return useQuery({
    queryKey: ['allocations', budgetId],
    queryFn: async () => {
      console.log(
        '[USE-ALLOCATIONS] Fetching allocations for budget:',
        budgetId
      );

      const supabase = createBrowserClient();

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('type', 'allocation')
        .order('date', { ascending: false });

      // Filter by budget if budgetId provided
      if (budgetId) {
        query = query.eq('budget_id', budgetId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[USE-ALLOCATIONS] Error fetching allocations:', error);
        throw error;
      }

      console.log('[USE-ALLOCATIONS] Fetched allocations:', data?.length || 0);
      return data || [];
    },
    // Enable query if no budgetId (fetch all) or budgetId is provided
    enabled: budgetId === undefined || !!budgetId
  });
}

/**
 * Create a new allocation
 *
 * @returns React Query mutation for creating allocations
 */
export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAllocation,
    onSuccess: data => {
      console.log('[USE-ALLOCATIONS] Allocation created:', data);

      // Invalidate allocations queries to refetch
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      // Also invalidate allocation distribution for pie chart
      queryClient.invalidateQueries({ queryKey: ['allocation-distribution'] });
      // Invalidate transactions to update transaction lists
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => {
      console.error('[USE-ALLOCATIONS] Error creating allocation:', error);
    }
  });
}

/**
 * Delete an allocation
 *
 * @returns React Query mutation for deleting allocations
 */
export function useDeleteAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      console.log('[USE-ALLOCATIONS] Allocation deleted');

      // Invalidate allocations queries to refetch
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      // Also invalidate allocation distribution for pie chart
      queryClient.invalidateQueries({ queryKey: ['allocation-distribution'] });
      // Invalidate transactions to update transaction lists
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => {
      console.error('[USE-ALLOCATIONS] Error deleting allocation:', error);
    }
  });
}
