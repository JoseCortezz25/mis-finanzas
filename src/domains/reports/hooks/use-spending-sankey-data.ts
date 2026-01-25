'use client';

import { useMemo } from 'react';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths
} from 'date-fns';
import { REPORTS_MESSAGES } from '@/domains/reports/messages';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];

export type SankeyPeriod =
  | 'last-month'
  | 'this-month'
  | 'this-week'
  | 'this-year';

export interface SankeyFilters {
  period: SankeyPeriod;
  categoryId: string;
  budgetId: string;
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface SankeySummary {
  totalSpent: number;
  transactionCount: number;
}

export interface SankeyResult {
  data: SankeyData;
  summary: SankeySummary;
  hasData: boolean;
}

const NO_BUDGET_KEY = 'no-budget';

export function useSpendingSankeyData(
  transactions: Transaction[] | undefined,
  categories: Category[] | undefined,
  budgets: Budget[] | undefined,
  filters: SankeyFilters,
  referenceDate?: Date | null
): SankeyResult {
  return useMemo(() => {
    if (!transactions || !referenceDate) {
      return {
        data: { nodes: [], links: [] },
        summary: { totalSpent: 0, transactionCount: 0 },
        hasData: false
      };
    }

    const categoryNameMap = new Map<string, string>();
    for (const category of categories ?? []) {
      categoryNameMap.set(category.id, category.name);
    }

    const budgetNameMap = new Map<string, string>();
    for (const budget of budgets ?? []) {
      budgetNameMap.set(budget.id, budget.name);
    }

    const { startDate, endDate } = getDateRange(filters.period, referenceDate);
    const start = startOfDay(startDate);
    const end = endOfDayInclusive(endDate);

    const budgetNodes = new Map<string, string>();
    const categoryNodes = new Map<string, string>();
    const linksMap = new Map<string, number>();

    let totalSpent = 0;
    let transactionCount = 0;

    for (const transaction of transactions) {
      if (transaction.type !== 'expense') continue;

      const txDate = new Date(transaction.date);
      if (!isWithinInterval(txDate, { start, end })) continue;

      if (
        filters.categoryId !== 'all' &&
        transaction.category_id !== filters.categoryId
      ) {
        continue;
      }

      if (filters.budgetId !== 'all') {
        if (filters.budgetId === NO_BUDGET_KEY) {
          if (transaction.budget_id !== null) continue;
        } else if (transaction.budget_id !== filters.budgetId) {
          continue;
        }
      }

      const budgetKey = transaction.budget_id ?? NO_BUDGET_KEY;
      const budgetLabel =
        budgetKey === NO_BUDGET_KEY
          ? REPORTS_MESSAGES.SANKEY.BUDGET_NONE
          : (budgetNameMap.get(budgetKey) ??
            REPORTS_MESSAGES.SANKEY.UNKNOWN_BUDGET);

      const categoryLabel =
        categoryNameMap.get(transaction.category_id) ??
        REPORTS_MESSAGES.SANKEY.UNKNOWN_CATEGORY;

      budgetNodes.set(budgetKey, budgetLabel);
      categoryNodes.set(transaction.category_id, categoryLabel);

      const linkKey = `${budgetKey}::${transaction.category_id}`;
      linksMap.set(linkKey, (linksMap.get(linkKey) ?? 0) + transaction.amount);

      totalSpent += transaction.amount;
      transactionCount += 1;
    }

    if (linksMap.size === 0) {
      return {
        data: { nodes: [], links: [] },
        summary: { totalSpent: 0, transactionCount: 0 },
        hasData: false
      };
    }

    const budgetKeys = Array.from(budgetNodes.keys());
    const categoryKeys = Array.from(categoryNodes.keys());

    const budgetIndex = new Map(budgetKeys.map((key, index) => [key, index]));
    const categoryIndex = new Map(
      categoryKeys.map((key, index) => [key, index])
    );

    const nodes: SankeyNode[] = [
      ...budgetKeys.map(key => ({ name: budgetNodes.get(key) ?? key })),
      ...categoryKeys.map(key => ({ name: categoryNodes.get(key) ?? key }))
    ];

    const links: SankeyLink[] = [];
    for (const [key, value] of linksMap.entries()) {
      const [budgetKey, categoryKey] = key.split('::');
      const source = budgetIndex.get(budgetKey);
      const target = categoryIndex.get(categoryKey);

      if (source === undefined || target === undefined) continue;

      links.push({
        source,
        target: budgetKeys.length + target,
        value
      });
    }

    return {
      data: { nodes, links },
      summary: { totalSpent, transactionCount },
      hasData: links.length > 0
    };
  }, [transactions, categories, budgets, filters, referenceDate]);
}

function getDateRange(period: SankeyPeriod, now: Date) {
  switch (period) {
    case 'this-week':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 })
      };
    case 'this-month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      };
    case 'this-year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now)
      };
    case 'last-month':
    default: {
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };
    }
  }
}

function endOfDayInclusive(date: Date) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}
