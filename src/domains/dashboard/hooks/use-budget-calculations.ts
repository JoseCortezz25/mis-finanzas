import { useMemo } from 'react';
import type { Database } from '@/types/supabase';
import type { BudgetWithAmount } from '@/lib/repositories';
import { calculateBudgetHealth, type BudgetWithHealth } from '../types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface UseBudgetCalculationsParams {
  budgets: BudgetWithAmount[] | undefined;
  transactions: Transaction[] | undefined;
}

/**
 * Calculate budget health metrics including spent amount and health status
 * Combines budget data with transaction data to compute real-time progress
 */
export function useBudgetCalculations({
  budgets,
  transactions
}: UseBudgetCalculationsParams): BudgetWithHealth[] {
  return useMemo(() => {
    if (!budgets || !transactions) return [];

    return budgets.map(budget => {
      // Calculate spent amount from transactions for this budget period
      const budgetTransactions = transactions.filter(
        t => t.budget_id === budget.id && t.type === 'expense' // Only count expenses
      );

      const spent_amount = budgetTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      const available_amount = budget.total_amount - spent_amount;
      const percentage_used =
        budget.total_amount > 0
          ? Math.round((spent_amount / budget.total_amount) * 100)
          : 0;

      const health_status = calculateBudgetHealth(percentage_used);

      return {
        id: budget.id,
        name: budget.name,
        total_amount: budget.total_amount,
        spent_amount,
        available_amount,
        percentage_used,
        health_status,
        month: budget.month || 0,
        year: budget.year || 0,
        status: budget.status,
        category: budget.category
      };
    });
  }, [budgets, transactions]);
}
