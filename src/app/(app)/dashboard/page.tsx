'use client';

import { useTransactions, useCategories } from '@/lib/hooks';
import { DASHBOARD_MESSAGES } from '@/domains/dashboard/messages';
import { ActiveBudgetsSection } from '@/domains/dashboard/components/active-budgets-section';
import { BalanceGaugeCard } from '@/domains/dashboard/components/organisms/balance-gauge-card';
import { StatsCardsSection } from '@/domains/dashboard/components/organisms/stats-cards-section';

export default function DashboardPage() {
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <div className="container mx-auto space-y-6 px-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">{DASHBOARD_MESSAGES.PAGE.TITLE}</h1>
        <p className="text-muted-foreground">
          {DASHBOARD_MESSAGES.PAGE.SUBTITLE}
        </p>
      </div>

      {/* Stats Cards Section - New Design */}
      <StatsCardsSection />

      {/* Balance Gauge Card */}
      <BalanceGaugeCard
        transactions={transactions}
        categories={categories}
        isLoading={transactionsLoading || categoriesLoading}
      />

      {/* Active Budgets Section - New distinctive design */}
      <ActiveBudgetsSection />
    </div>
  );
}
