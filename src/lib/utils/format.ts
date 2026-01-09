/**
 * Formatting utilities for currency, dates, and numbers
 */

import { format as dateFnsFormat } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency in Colombian Pesos (COP)
 *
 * @param amount - Amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1500000) // Returns: "$1.500.000"
 * formatCurrency(1500000, { compact: true }) // Returns: "$1,5M"
 */
export function formatCurrency(
  amount: number,
  options?: {
    compact?: boolean;
    showDecimals?: boolean;
  }
): string {
  const { compact = false, showDecimals = false } = options || {};

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
    ...(compact && {
      notation: 'compact',
      compactDisplay: 'short'
    })
  });

  return formatter.format(amount);
}

/**
 * Format currency for chart axes (abbreviated)
 *
 * @example
 * formatCurrencyAbbr(1500000) // Returns: "$1,5M"
 * formatCurrencyAbbr(1500) // Returns: "$1,5K"
 */
export function formatCurrencyAbbr(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
}

/**
 * Format date in long format
 *
 * @example
 * formatDateLong('2026-01-08') // Returns: "8 de enero de 2026"
 */
export function formatDateLong(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Format date in short format
 *
 * @example
 * formatDateShort('2026-01-08') // Returns: "08 Ene"
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, 'dd MMM', { locale: es });
}

/**
 * Format date in medium format
 *
 * @example
 * formatDateMedium('2026-01-08') // Returns: "08 Ene 2026"
 */
export function formatDateMedium(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, 'dd MMM yyyy', { locale: es });
}

/**
 * Format percentage
 *
 * @example
 * formatPercentage(0.755) // Returns: "75,5%"
 * formatPercentage(75.5, { isDecimal: false }) // Returns: "75,5%"
 */
export function formatPercentage(
  value: number,
  options?: {
    isDecimal?: boolean;
    decimals?: number;
  }
): string {
  const { isDecimal = true, decimals = 1 } = options || {};

  const percentage = isDecimal ? value * 100 : value;

  return `${percentage.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format number with thousand separators
 *
 * @example
 * formatNumber(1500000) // Returns: "1.500.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}
