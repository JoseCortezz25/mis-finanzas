'use client';

import { useMemo } from 'react';
import {
  subDays,
  format,
  eachDayOfInterval,
  startOfDay,
  getDay
} from 'date-fns';
import { calculateLevels } from '@/lib/utils/percentile';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface HeatmapDataPoint {
  date: string; // ISO date
  amount: number; // Total spent
  level: 0 | 1 | 2 | 3 | 4; // Color intensity
  transactionCount: number;
  topCategory?: string;
}

export interface HeatmapWeek {
  weekNumber: number;
  days: HeatmapDataPoint[];
}

export interface HeatmapData {
  dateRange: {
    start: string;
    end: string;
    totalDays: number;
  };
  grid: HeatmapWeek[];
  summary: {
    totalSpent: number;
    daysWithActivity: number;
    averageDailySpending: number;
    peakDay: { date: string; amount: number };
  };
  colorScale: {
    levels: [number, number, number, number, number];
    percentiles: { 25: number; 50: number; 75: number };
  };
}

/**
 * Hook to process transactions into GitHub-style heatmap data
 *
 * @param transactions - Array of transactions
 * @param months - Number of months to show (6 or 12)
 * @returns Processed heatmap data
 */
export function useSpendingHeatmapData(
  transactions: Transaction[] | undefined,
  months: 6 | 12 = 12
): HeatmapData {
  return useMemo(() => {
    if (!transactions) {
      return createEmptyHeatmap(months);
    }

    const days = months === 6 ? 180 : 365;
    const endDate = startOfDay(new Date());
    const startDate = subDays(endDate, days - 1);

    // Generate all dates in range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Group expenses by date
    const expensesByDate = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue;

      const txDate = startOfDay(new Date(tx.date));
      if (txDate >= startDate && txDate <= endDate) {
        const dateKey = format(txDate, 'yyyy-MM-dd');
        if (!expensesByDate.has(dateKey)) {
          expensesByDate.set(dateKey, []);
        }
        expensesByDate.get(dateKey)!.push(tx);
      }
    }

    // Calculate daily amounts
    const dailyAmounts = allDates.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayExpenses = expensesByDate.get(dateKey) || [];
      const amount = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
      return { date: dateKey, amount, transactions: dayExpenses };
    });

    // Calculate levels using percentiles
    const amounts = dailyAmounts.map(d => d.amount);
    const leveled = calculateLevels(amounts);

    // Create data points with top category
    const dataPoints: HeatmapDataPoint[] = dailyAmounts.map((day, index) => {
      // Find top category for the day
      const categoryCount = new Map<string, number>();
      for (const tx of day.transactions) {
        const count = categoryCount.get(tx.category_id) || 0;
        categoryCount.set(tx.category_id, count + 1);
      }

      const topCategoryId =
        categoryCount.size > 0
          ? Array.from(categoryCount.entries()).sort(
              (a, b) => b[1] - a[1]
            )[0][0]
          : undefined;

      return {
        date: day.date,
        amount: day.amount,
        level: leveled[index].level,
        transactionCount: day.transactions.length,
        topCategory: topCategoryId // Will be resolved to name in component
      };
    });

    // Organize into weeks (7 days each, starting from first day of range)
    const weeks: HeatmapWeek[] = [];
    let currentWeek: HeatmapDataPoint[] = [];
    let weekNumber = 0;

    // Pad beginning to align with Sunday
    const firstDayOfWeek = getDay(allDates[0]);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        amount: 0,
        level: 0,
        transactionCount: 0
      });
    }

    // Add all data points
    for (const dataPoint of dataPoints) {
      currentWeek.push(dataPoint);

      if (currentWeek.length === 7) {
        weeks.push({ weekNumber: weekNumber++, days: currentWeek });
        currentWeek = [];
      }
    }

    // Pad end if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({
        date: '',
        amount: 0,
        level: 0,
        transactionCount: 0
      });
    }
    if (currentWeek.length === 7) {
      weeks.push({ weekNumber: weekNumber++, days: currentWeek });
    }

    // Calculate summary
    const totalSpent = dataPoints.reduce((sum, d) => sum + d.amount, 0);
    const daysWithActivity = dataPoints.filter(
      d => d.transactionCount > 0
    ).length;
    const peakDay = dataPoints.reduce(
      (max, d) => (d.amount > max.amount ? d : max),
      dataPoints[0]
    );

    // Extract percentiles for color scale
    const nonZeroAmounts = amounts.filter(a => a > 0).sort((a, b) => a - b);
    const p25 = nonZeroAmounts[Math.floor(nonZeroAmounts.length * 0.25)] || 0;
    const p50 = nonZeroAmounts[Math.floor(nonZeroAmounts.length * 0.5)] || 0;
    const p75 = nonZeroAmounts[Math.floor(nonZeroAmounts.length * 0.75)] || 0;

    return {
      dateRange: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
        totalDays: allDates.length
      },
      grid: weeks,
      summary: {
        totalSpent,
        daysWithActivity,
        averageDailySpending: totalSpent / allDates.length,
        peakDay: {
          date: peakDay.date,
          amount: peakDay.amount
        }
      },
      colorScale: {
        levels: [0, p25, p50, p75, Math.max(...amounts)],
        percentiles: { 25: p25, 50: p50, 75: p75 }
      }
    };
  }, [transactions, months]);
}

function createEmptyHeatmap(months: 6 | 12): HeatmapData {
  const days = months === 6 ? 180 : 365;
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days - 1);

  const weeks: HeatmapWeek[] = [];
  const weeksCount = Math.ceil(days / 7);

  for (let w = 0; w < weeksCount; w++) {
    const week: HeatmapDataPoint[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: '',
        amount: 0,
        level: 0,
        transactionCount: 0
      });
    }
    weeks.push({ weekNumber: w, days: week });
  }

  return {
    dateRange: {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd'),
      totalDays: days
    },
    grid: weeks,
    summary: {
      totalSpent: 0,
      daysWithActivity: 0,
      averageDailySpending: 0,
      peakDay: { date: '', amount: 0 }
    },
    colorScale: {
      levels: [0, 0, 0, 0, 0],
      percentiles: { 25: 0, 50: 0, 75: 0 }
    }
  };
}
