'use client';

import { useMemo } from 'react';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface DailyBarChartDataPoint {
  date: string; // ISO date (YYYY-MM-DD)
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

export interface DailyBarChartData {
  dateRange: {
    start: string;
    end: string;
    totalDays: number;
  };
  dataPoints: DailyBarChartDataPoint[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    daysWithActivity: number;
    daysWithoutActivity: number;
  };
}

/**
 * Hook to process transactions into daily bar chart data
 *
 * @param transactions - Array of transactions
 * @param dateRangeKey - Date range key ('7d', '30d', '90d')
 * @returns Processed chart data
 */
export function useDailyBarChartData(
  transactions: Transaction[] | undefined,
  dateRangeKey: string = '30d'
): DailyBarChartData {
  return useMemo(() => {
    if (!transactions) {
      return createEmptyData('30d');
    }

    // Calculate date range based on key
    const { startDate, endDate } = getDateRange(dateRangeKey);

    // Generate all dates in range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    // Group transactions by date
    const transactionsByDate = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const txDate = startOfDay(new Date(tx.date));
      if (txDate >= startDate && txDate <= endDate) {
        const dateKey = format(txDate, 'yyyy-MM-dd');
        if (!transactionsByDate.has(dateKey)) {
          transactionsByDate.set(dateKey, []);
        }
        transactionsByDate.get(dateKey)!.push(tx);
      }
    }

    // Create data points for each day
    const dataPoints: DailyBarChartDataPoint[] = allDates.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayTransactions = transactionsByDate.get(dateKey) || [];

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: dateKey,
        income,
        expense,
        net: income - expense,
        transactionCount: dayTransactions.length
      };
    });

    // Calculate summary stats
    const totalIncome = dataPoints.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = dataPoints.reduce((sum, d) => sum + d.expense, 0);
    const daysWithActivity = dataPoints.filter(
      d => d.transactionCount > 0
    ).length;

    return {
      dateRange: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
        totalDays: allDates.length
      },
      dataPoints,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        daysWithActivity,
        daysWithoutActivity: allDates.length - daysWithActivity
      }
    };
  }, [transactions, dateRangeKey]);
}

function getDateRange(key: string): { startDate: Date; endDate: Date } {
  const endDate = startOfDay(new Date());
  let days = 30;

  switch (key) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    case '6m':
      days = 180;
      break;
    case '12m':
      days = 365;
      break;
  }

  const startDate = subDays(endDate, days - 1);
  return { startDate, endDate };
}

function createEmptyData(dateRangeKey: string): DailyBarChartData {
  const { startDate, endDate } = getDateRange(dateRangeKey);
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  return {
    dateRange: {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd'),
      totalDays: allDates.length
    },
    dataPoints: allDates.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      income: 0,
      expense: 0,
      net: 0,
      transactionCount: 0
    })),
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      daysWithActivity: 0,
      daysWithoutActivity: allDates.length
    }
  };
}
