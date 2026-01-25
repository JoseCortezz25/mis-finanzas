import { useMemo } from 'react';
import type { Database } from '@/types/supabase';
import type { BudgetWithAmount } from '@/lib/repositories';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export type BudgetHealthStatus = 'healthy' | 'warning' | 'alert' | 'danger';

export interface BudgetCalculations {
  totalSpent: number;
  totalIncome: number;
  available: number;
  percentageUsed: number;
  healthStatus: BudgetHealthStatus;
  isOverBudget: boolean;
}

/**
 * Custom hook to calculate budget metrics and health status
 *
 * Business Rules:
 * - BR-BD-1: Budget metrics calculations
 *   - Spent = SUM(expense transactions)
 *   - Income = SUM(income transactions)
 *   - Available = budget total - spent
 *   - Percentage = (spent / total) × 100
 *   - Budget total_amount is computed from assigned income transactions
 *
 * - BR-BD-2: Budget health status thresholds
 *   - 0-69%: Healthy (green)
 *   - 70-89%: Warning (yellow)
 *   - 90-99%: Alert (orange)
 *   - 100%+: Danger (red)
 *
 * @param budget - The budget entity with computed total_amount
 * @param transactions - Array of transactions related to this budget
 * @returns Calculated budget metrics and health status
 */
export function useBudgetCalculations(
  budget: BudgetWithAmount | null | undefined,
  transactions: Transaction[] | undefined
): BudgetCalculations {
  return useMemo(() => {
    // Default values when data is not available
    if (!budget || !transactions) {
      return {
        totalSpent: 0,
        totalIncome: 0,
        available: 0,
        percentageUsed: 0,
        healthStatus: 'healthy',
        isOverBudget: false
      };
    }

    // Calculate total spent (sum of all expense transactions)
    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total income (sum of all income transactions)
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate available amount
    // Available = budget total - spent
    // Note: budget.total_amount already includes income transactions
    const available = budget.total_amount - totalSpent;

    // Calculate percentage used
    // Percentage = (spent / total) × 100
    // Handle division by zero
    const percentageUsed =
      budget.total_amount > 0 ? (totalSpent / budget.total_amount) * 100 : 0;

    // Determine health status based on percentage used
    let healthStatus: BudgetHealthStatus;
    if (percentageUsed < 70) {
      healthStatus = 'healthy';
    } else if (percentageUsed < 90) {
      healthStatus = 'warning';
    } else if (percentageUsed < 100) {
      healthStatus = 'alert';
    } else {
      healthStatus = 'danger';
    }

    // Check if budget is exceeded
    const isOverBudget = percentageUsed >= 100;

    return {
      totalSpent,
      totalIncome,
      available,
      percentageUsed: Math.round(percentageUsed * 100) / 100, // Round to 2 decimals
      healthStatus,
      isOverBudget
    };
  }, [budget, transactions]);
}
