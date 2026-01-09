'use client';

import {
  useBudgets,
  useTransactionStats,
  useTransactions,
  useCategories
} from '@/lib/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { DASHBOARD_MESSAGES } from '@/domains/dashboard/messages';
import { ActiveBudgetsSection } from '@/domains/dashboard/components/active-budgets-section';
import { BalanceGaugeCard } from '@/domains/dashboard/components/organisms/balance-gauge-card';

export default function DashboardPage() {
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Current budget for stats card
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentBudget = budgets
    ?.filter(b => b.status === 'active')
    .find(b => b.month === currentMonth && b.year === currentYear);

  return (
    <div className="container mx-auto space-y-6 px-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">{DASHBOARD_MESSAGES.PAGE.TITLE}</h1>
        <p className="text-muted-foreground">
          {DASHBOARD_MESSAGES.PAGE.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {DASHBOARD_MESSAGES.STATS.TOTAL_INCOME}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {statsLoading
                ? '...'
                : stats?.totalIncome.toLocaleString() || '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              {DASHBOARD_MESSAGES.STATS.HISTORICAL}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {DASHBOARD_MESSAGES.STATS.TOTAL_EXPENSES}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {statsLoading
                ? '...'
                : stats?.totalExpenses.toLocaleString() || '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              {DASHBOARD_MESSAGES.STATS.HISTORICAL}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {DASHBOARD_MESSAGES.STATS.BALANCE}
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statsLoading ? '...' : stats?.balance.toLocaleString() || '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              {DASHBOARD_MESSAGES.STATS.INCOME_MINUS_EXPENSES}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {DASHBOARD_MESSAGES.STATS.CURRENT_BUDGET}
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {budgetsLoading
                ? '...'
                : currentBudget?.total_amount.toLocaleString() || '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              {currentBudget
                ? currentBudget.name
                : DASHBOARD_MESSAGES.STATS.NO_BUDGET}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Gauge Card */}
      <BalanceGaugeCard
        transactions={transactions}
        categories={categories}
        isLoading={transactionsLoading || categoriesLoading}
      />

      {/* Active Budgets Section - New distinctive design */}
      <ActiveBudgetsSection />

      {/* Transactions Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {DASHBOARD_MESSAGES.SECTIONS.TRANSACTIONS_SUMMARY_TITLE}
            </CardTitle>
            <CardDescription>
              {DASHBOARD_MESSAGES.SECTIONS.TRANSACTIONS_SUMMARY_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <p className="text-muted-foreground">
                {DASHBOARD_MESSAGES.LOADING.STATS}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {DASHBOARD_MESSAGES.SUMMARY.TOTAL_TRANSACTIONS}
                  </span>
                  <span className="font-medium">{stats?.count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">
                    {DASHBOARD_MESSAGES.SUMMARY.INCOMES}
                  </span>
                  <span className="font-medium text-green-600">
                    ${stats?.totalIncome.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">
                    {DASHBOARD_MESSAGES.SUMMARY.EXPENSES}
                  </span>
                  <span className="font-medium text-red-600">
                    ${stats?.totalExpenses.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">
                    {DASHBOARD_MESSAGES.SUMMARY.NET_BALANCE}
                  </span>
                  <span
                    className={`font-bold ${
                      (stats?.balance || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${stats?.balance.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
