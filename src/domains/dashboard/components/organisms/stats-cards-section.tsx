'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { StatCard } from '../molecules/stat-card';
import { useMonthlyStatsComparison } from '../../hooks/use-monthly-stats-comparison';
import { DASHBOARD_MESSAGES } from '../../messages';

export function StatsCardsSection() {
  const { totalIncome, totalExpenses, balance, isLoading } =
    useMonthlyStatsComparison();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Income Card */}
      <StatCard
        label={DASHBOARD_MESSAGES.STATS_CARDS.INCOME_LABEL}
        value={totalIncome}
        icon={TrendingUp}
        variant="income"
        isLoading={isLoading}
      />

      {/* Expenses Card */}
      <StatCard
        label={DASHBOARD_MESSAGES.STATS_CARDS.EXPENSES_LABEL}
        value={totalExpenses}
        icon={TrendingDown}
        variant="expense"
        isLoading={isLoading}
      />

      {/* Balance Card */}
      <StatCard
        label={DASHBOARD_MESSAGES.STATS_CARDS.BALANCE_LABEL}
        value={balance}
        icon={Wallet}
        variant="balance"
        isLoading={isLoading}
      />
    </div>
  );
}
