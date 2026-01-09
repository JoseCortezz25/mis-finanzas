'use client';

import { useMemo } from 'react';
import { valueToAngle } from '@/lib/utils/svg';
import type { Database } from '@/types/supabase';
import type { GaugeSegment } from '@/components/molecules/semicircular-gauge';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export interface BalanceGaugeData {
  balance: number;
  balancePercentage: number; // balance / totalIncome * 100
  needleAngle: number; // 0-180 degrees
  segments: GaugeSegment[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalEgresos: number;
    totalGastos: number;
  };
}

/**
 * Hook to process transactions and categories into balance gauge data
 *
 * @param transactions - Array of transactions
 * @param categories - Array of categories with category_type field
 * @returns Processed gauge data
 */
export function useBalanceGaugeData(
  transactions: Transaction[] | undefined,
  categories: Category[] | undefined
): BalanceGaugeData {
  return useMemo(() => {
    if (!transactions || !categories) {
      return createEmptyGaugeData();
    }

    // Create category lookup map
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // Calculate totals by category type
    let totalIncome = 0;
    let totalEgresos = 0;
    let totalGastos = 0;

    for (const tx of transactions) {
      const category = categoryMap.get(tx.category_id);

      if (!category) continue;

      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else if (tx.type === 'expense') {
        // Determine if egreso or gasto based on category_type
        // Fallback to 'gasto' if category_type is not set
        const categoryType = category.category_type || 'gasto';

        if (categoryType === 'egreso') {
          totalEgresos += tx.amount;
        } else {
          totalGastos += tx.amount;
        }
      }
    }

    const totalExpenses = totalEgresos + totalGastos;
    const balance = totalIncome - totalExpenses;

    // Calculate balance percentage
    // If no income, show as -100% (needle at left extreme)
    const balancePercentage =
      totalIncome > 0 ? (balance / totalIncome) * 100 : -100;

    // Calculate needle angle (0-180 degrees)
    // -100% → 0°, 0% → 90°, +100% → 180°
    const needleAngle = valueToAngle(balancePercentage, -100, 100, 0, 180);

    // Calculate segment angles and percentages
    // Segments are proportional to their amounts relative to total activity
    const totalActivity = totalIncome + totalExpenses;

    if (totalActivity === 0) {
      // No activity - show equal segments
      return createEmptyGaugeData();
    }

    const incomePercentage = (totalIncome / totalActivity) * 100;
    const egresosPercentage = (totalEgresos / totalActivity) * 100;
    const gastosPercentage = (totalGastos / totalActivity) * 100;

    // Distribute 180 degrees proportionally
    const incomeAngle = (incomePercentage / 100) * 180;
    const egresosAngle = (egresosPercentage / 100) * 180;
    const gastosAngle = (gastosPercentage / 100) * 180;

    // Create segments (order: egresos, gastos, ingresos)
    const segments: GaugeSegment[] = [];
    let currentAngle = 0;

    // Egresos (red) - fixed expenses
    if (totalEgresos > 0) {
      segments.push({
        type: 'egreso',
        label: 'Egresos',
        amount: totalEgresos,
        percentage: egresosPercentage,
        startAngle: currentAngle,
        endAngle: currentAngle + egresosAngle,
        color: '#EF4444' // red-500
      });
      currentAngle += egresosAngle;
    }

    // Gastos (orange) - variable expenses
    if (totalGastos > 0) {
      segments.push({
        type: 'gasto',
        label: 'Gastos',
        amount: totalGastos,
        percentage: gastosPercentage,
        startAngle: currentAngle,
        endAngle: currentAngle + gastosAngle,
        color: '#F97316' // orange-500
      });
      currentAngle += gastosAngle;
    }

    // Ingresos (green)
    if (totalIncome > 0) {
      segments.push({
        type: 'ingreso',
        label: 'Ingresos',
        amount: totalIncome,
        percentage: incomePercentage,
        startAngle: currentAngle,
        endAngle: currentAngle + incomeAngle,
        color: '#10B981' // emerald-500
      });
    }

    return {
      balance,
      balancePercentage,
      needleAngle,
      segments,
      summary: {
        totalIncome,
        totalExpenses,
        totalEgresos,
        totalGastos
      }
    };
  }, [transactions, categories]);
}

function createEmptyGaugeData(): BalanceGaugeData {
  // Default empty state with equal segments
  return {
    balance: 0,
    balancePercentage: 0,
    needleAngle: 90, // Center
    segments: [
      {
        type: 'egreso',
        label: 'Egresos',
        amount: 0,
        percentage: 33.33,
        startAngle: 0,
        endAngle: 60,
        color: '#EF4444'
      },
      {
        type: 'gasto',
        label: 'Gastos',
        amount: 0,
        percentage: 33.33,
        startAngle: 60,
        endAngle: 120,
        color: '#F97316'
      },
      {
        type: 'ingreso',
        label: 'Ingresos',
        amount: 0,
        percentage: 33.33,
        startAngle: 120,
        endAngle: 180,
        color: '#10B981'
      }
    ],
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      totalEgresos: 0,
      totalGastos: 0
    }
  };
}
