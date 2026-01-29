'use client';

import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * Allocation distribution data for pie chart
 */
export interface AllocationDistribution {
  budgetId: string;
  budgetName: string;
  totalAllocated: number;
  percentage: number;
  color?: string; // Optional color for chart
}

/**
 * Result of allocation distribution query
 */
export interface AllocationDistributionResult {
  distribution: AllocationDistribution[];
  totalAllocated: number;
}

/**
 * Fetch allocation distribution for pie chart
 * Groups allocations by budget and calculates totals and percentages
 *
 * @returns React Query result with distribution data
 */
export function useAllocationDistribution() {
  return useQuery<AllocationDistributionResult>({
    queryKey: ['allocation-distribution'],
    queryFn: async () => {
      console.log('[USE-ALLOCATION-DISTRIBUTION] Fetching distribution data');

      const supabase = createBrowserClient();

      // Fetch all allocations with budget info
      const { data: allocations, error } = await supabase
        .from('transactions')
        .select(
          `
          amount,
          budget_id,
          budgets (
            id,
            name
          )
        `
        )
        .eq('type', 'allocation');

      if (error) {
        console.error(
          '[USE-ALLOCATION-DISTRIBUTION] Error fetching allocations:',
          error
        );
        throw error;
      }

      console.log(
        '[USE-ALLOCATION-DISTRIBUTION] Fetched allocations:',
        allocations?.length || 0
      );

      // Group by budget and calculate totals
      const distributionMap = new Map<string, AllocationDistribution>();
      let grandTotal = 0;

      allocations?.forEach(allocation => {
        // Type assertion for budget data
        const budget = allocation.budgets as unknown as {
          id: string;
          name: string;
        } | null;

        if (!budget) {
          console.warn(
            '[USE-ALLOCATION-DISTRIBUTION] Allocation without budget:',
            allocation
          );
          return;
        }

        const existing = distributionMap.get(budget.id);
        if (existing) {
          existing.totalAllocated += allocation.amount;
        } else {
          distributionMap.set(budget.id, {
            budgetId: budget.id,
            budgetName: budget.name,
            totalAllocated: allocation.amount,
            percentage: 0 // Will be calculated after
          });
        }
        grandTotal += allocation.amount;
      });

      // Calculate percentages and convert to array
      const distribution: AllocationDistribution[] = [];
      distributionMap.forEach(item => {
        item.percentage =
          grandTotal > 0 ? (item.totalAllocated / grandTotal) * 100 : 0;
        distribution.push(item);
      });

      // Sort by total allocated (descending) for better chart display
      distribution.sort((a, b) => b.totalAllocated - a.totalAllocated);

      console.log('[USE-ALLOCATION-DISTRIBUTION] Distribution:', {
        items: distribution.length,
        total: grandTotal
      });

      return {
        distribution,
        totalAllocated: grandTotal
      };
    },
    // Refetch when window gains focus to keep data fresh
    refetchOnWindowFocus: true,
    // Keep data for 5 minutes before marking as stale
    staleTime: 5 * 60 * 1000
  });
}
