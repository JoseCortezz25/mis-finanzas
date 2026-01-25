'use client';

import {
  useTransactions,
  useTransactionStats,
  useBudgets,
  useCategories
} from '@/lib/hooks';
import { REPORTS_MESSAGES } from '@/domains/reports/messages';
import { ExpensesByCategoryChart } from '@/domains/reports/components/organisms/expenses-by-category-chart';
import { DailyBarChart } from '@/domains/reports/components/organisms/daily-bar-chart';
import { SpendingHeatmap } from '@/domains/reports/components/organisms/spending-heatmap';
import { SpendingSankey } from '@/domains/reports/components/organisms/spending-sankey';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReportesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const { isLoading: statsLoading } = useTransactionStats();
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categoriesById = useMemo(() => {
    const map = new Map<string, { name: string; color?: string }>();
    for (const category of categories ?? []) {
      map.set(category.id, {
        name: category.name,
        color: category.color ?? undefined
      });
    }
    return map;
  }, [categories]);

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (selectedPeriod === 'all') return transactions;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const txDate = new Date(t.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      if (selectedPeriod === 'month') {
        return txMonth === currentMonth && txYear === currentYear;
      } else if (selectedPeriod === 'year') {
        return txYear === currentYear;
      }

      return true;
    });
  }, [transactions, selectedPeriod]);

  // Calculate period stats
  const periodStats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const expenseCategoryStats = useMemo(() => {
    const grouped = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce(
        (acc, transaction) => {
          const key = transaction.category_id;
          if (!acc[key]) {
            acc[key] = {
              count: 0,
              total: 0
            };
          }
          acc[key].count++;
          acc[key].total += transaction.amount;
          return acc;
        },
        {} as Record<string, { count: number; total: number }>
      );

    return Object.entries(grouped)
      .map(([categoryId, data]) => ({
        categoryId,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const incomeCategoryStats = useMemo(() => {
    const grouped = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce(
        (acc, transaction) => {
          const key = transaction.category_id;
          if (!acc[key]) {
            acc[key] = {
              count: 0,
              total: 0
            };
          }
          acc[key].count++;
          acc[key].total += transaction.amount;
          return acc;
        },
        {} as Record<string, { count: number; total: number }>
      );

    return Object.entries(grouped)
      .map(([categoryId, data]) => ({
        categoryId,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const expensesByCategoryChartData = useMemo(() => {
    const maxCategories = 6;

    const items = expenseCategoryStats.map(stat => {
      const category = categoriesById.get(stat.categoryId);

      return {
        categoryName: category?.name ?? `${stat.categoryId.slice(0, 8)}...`,
        total: stat.total,
        color: category?.color
      };
    });

    if (items.length <= maxCategories) return items;

    const head = items.slice(0, maxCategories - 1);
    const tail = items.slice(maxCategories - 1);

    const othersTotal = tail.reduce((sum, item) => sum + item.total, 0);
    return [
      ...head,
      {
        categoryName: REPORTS_MESSAGES.CHART.OTHERS_CATEGORY,
        total: othersTotal,
        color: 'hsl(var(--destructive))',
        fillOpacity: 0.35
      }
    ];
  }, [categoriesById, expenseCategoryStats]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [filteredTransactions]);

  if (
    !isMounted ||
    transactionsLoading ||
    statsLoading ||
    budgetsLoading ||
    categoriesLoading
  ) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">
          {REPORTS_MESSAGES.LOADING.REPORTS}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-6">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{REPORTS_MESSAGES.PAGE.TITLE}</h1>
          <p className="text-muted-foreground">
            {REPORTS_MESSAGES.PAGE.SUBTITLE}
          </p>
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={REPORTS_MESSAGES.PERIOD.SELECT_PERIOD} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {REPORTS_MESSAGES.PERIOD.ALL_TIME}
            </SelectItem>
            <SelectItem value="month">
              {REPORTS_MESSAGES.PERIOD.THIS_MONTH}
            </SelectItem>
            <SelectItem value="year">
              {REPORTS_MESSAGES.PERIOD.THIS_YEAR}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {REPORTS_MESSAGES.STATS.TOTAL_INCOME}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${periodStats.income.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {REPORTS_MESSAGES.STATS.TOTAL_EXPENSES}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${periodStats.expenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {REPORTS_MESSAGES.STATS.BALANCE}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                periodStats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${periodStats.balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {REPORTS_MESSAGES.STATS.TRANSACTIONS}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.count}</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Bar Chart */}
      <DailyBarChart
        transactions={transactions}
        isLoading={transactionsLoading}
      />

      {/* Spending Heatmap */}
      <SpendingHeatmap
        transactions={transactions}
        categories={categories}
        isLoading={transactionsLoading || categoriesLoading}
      />

      {/* Spending Sankey */}
      <SpendingSankey
        transactions={transactions}
        categories={categories}
        budgets={budgets}
        isLoading={transactionsLoading || categoriesLoading || budgetsLoading}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              {REPORTS_MESSAGES.SECTIONS.EXPENSES_BY_CATEGORY_TITLE}
            </CardTitle>
            <CardDescription>
              {REPORTS_MESSAGES.SECTIONS.EXPENSES_BY_CATEGORY_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenseCategoryStats.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                {REPORTS_MESSAGES.EMPTY.NO_EXPENSES}
              </p>
            ) : (
              <div className="space-y-4">
                <ExpensesByCategoryChart data={expensesByCategoryChartData} />
                {expenseCategoryStats.map((stat, index) => (
                  <div
                    key={stat.categoryId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{index + 1}</span>
                      <span className="text-muted-foreground text-sm">
                        {categoriesById.get(stat.categoryId)?.name ??
                          `${REPORTS_MESSAGES.CATEGORY.ID_PREFIX}: ${stat.categoryId.slice(0, 8)}...`}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${stat.total.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {stat.count}{' '}
                        {stat.count === 1
                          ? REPORTS_MESSAGES.CATEGORY.EXPENSE
                          : REPORTS_MESSAGES.CATEGORY.EXPENSES}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              {REPORTS_MESSAGES.SECTIONS.INCOME_BY_CATEGORY_TITLE}
            </CardTitle>
            <CardDescription>
              {REPORTS_MESSAGES.SECTIONS.INCOME_BY_CATEGORY_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incomeCategoryStats.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                {REPORTS_MESSAGES.EMPTY.NO_INCOMES}
              </p>
            ) : (
              <div className="space-y-4">
                {incomeCategoryStats.map((stat, index) => (
                  <div
                    key={stat.categoryId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{index + 1}</span>
                      <span className="text-muted-foreground text-sm">
                        {categoriesById.get(stat.categoryId)?.name ??
                          `${REPORTS_MESSAGES.CATEGORY.ID_PREFIX}: ${stat.categoryId.slice(0, 8)}...`}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${stat.total.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {stat.count}{' '}
                        {stat.count === 1
                          ? REPORTS_MESSAGES.CATEGORY.INCOME
                          : REPORTS_MESSAGES.CATEGORY.INCOMES}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {REPORTS_MESSAGES.SECTIONS.RECENT_TRANSACTIONS_TITLE}
          </CardTitle>
          <CardDescription>
            {REPORTS_MESSAGES.SECTIONS.RECENT_TRANSACTIONS_DESCRIPTION}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {REPORTS_MESSAGES.EMPTY.NO_TRANSACTIONS}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{REPORTS_MESSAGES.TABLE.DATE}</TableHead>
                  <TableHead>{REPORTS_MESSAGES.TABLE.TYPE}</TableHead>
                  <TableHead>{REPORTS_MESSAGES.TABLE.DESCRIPTION}</TableHead>
                  <TableHead className="text-right">
                    {REPORTS_MESSAGES.TABLE.AMOUNT}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), 'dd MMM yyyy', {
                        locale: es
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === 'income'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {transaction.type === 'income'
                          ? REPORTS_MESSAGES.TRANSACTION.TYPE_INCOME
                          : REPORTS_MESSAGES.TRANSACTION.TYPE_EXPENSE}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.description ||
                        REPORTS_MESSAGES.TRANSACTION.NO_DESCRIPTION}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
