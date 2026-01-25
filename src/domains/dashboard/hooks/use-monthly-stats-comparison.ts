'use client';

import { useMemo } from 'react';
import { useTransactionStats, useTransactions } from '@/lib/hooks';

interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  isLoading: boolean;
}

/**
 * Hook to calculate monthly statistics with month-over-month comparison
 * Returns current month stats and percentage change vs previous month
 */
export function useMonthlyStatsComparison(): MonthlyStats {
  const { data: allTransactions, isLoading: transactionsLoading } =
    useTransactions();
  const { data: totalStats, isLoading: statsLoading } = useTransactionStats();

  const stats = useMemo(() => {
    if (!allTransactions || !totalStats) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        incomeChange: 0,
        expenseChange: 0,
        balanceChange: 0
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter transactions for current month
    const currentMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Filter transactions for previous month
    const previousMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === previousMonth &&
        transactionDate.getFullYear() === previousYear
      );
    });

    // Calculate current month totals
    const currentIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = currentIncome - currentExpenses;

    // Calculate previous month totals
    const previousIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousBalance = previousIncome - previousExpenses;

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const incomeChange = calculatePercentageChange(
      currentIncome,
      previousIncome
    );
    const expenseChange = calculatePercentageChange(
      currentExpenses,
      previousExpenses
    );
    const balanceChange = calculatePercentageChange(
      currentBalance,
      previousBalance
    );

    return {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      balance: currentBalance,
      incomeChange,
      expenseChange,
      balanceChange
    };
  }, [allTransactions, totalStats]);

  return {
    ...stats,
    isLoading: transactionsLoading || statsLoading
  };
}
