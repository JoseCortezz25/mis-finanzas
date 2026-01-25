/**
 * Dashboard domain types and utilities
 */

export type BudgetHealthStatus = 'healthy' | 'warning' | 'exceeded';

export type BudgetCardVariant = 'healthy' | 'warning' | 'exceeded';

export interface BudgetWithHealth {
  id: string;
  name: string;
  total_amount: number;
  spent_amount: number;
  available_amount: number;
  percentage_used: number;
  health_status: BudgetHealthStatus;
  month: number;
  year: number;
  status: 'active' | 'draft' | 'closed';
  category: string | null;
}

/**
 * Calculate budget health status based on percentage used
 * - Healthy: 0-79% spent
 * - Warning: 80-99% spent
 * - Exceeded: 100%+ spent (over budget)
 */
export function calculateBudgetHealth(
  percentageUsed: number
): BudgetHealthStatus {
  if (percentageUsed >= 100) return 'exceeded';
  if (percentageUsed >= 80) return 'warning';
  return 'healthy';
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get month name in Spanish
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  return months[month - 1] || '';
}
