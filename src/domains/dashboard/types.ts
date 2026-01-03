/**
 * Dashboard domain types and utilities
 */

export type BudgetHealthStatus = 'healthy' | 'warning' | 'alert' | 'danger';

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
 * - Healthy: 0-69% spent
 * - Warning: 70-89% spent
 * - Alert: 90-99% spent
 * - Danger: 100%+ spent (over budget)
 */
export function calculateBudgetHealth(
  percentageUsed: number
): BudgetHealthStatus {
  if (percentageUsed >= 100) return 'danger';
  if (percentageUsed >= 90) return 'alert';
  if (percentageUsed >= 70) return 'warning';
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
