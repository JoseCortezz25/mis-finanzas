'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useBudgetCalculations } from '@/domains/budget/hooks';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import type { Database } from '@/types/supabase';
import type { BudgetWithAmount } from '@/lib/repositories';
import { cn } from '@/lib/utils';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface BudgetStatsCardsProps {
  budget: BudgetWithAmount;
  transactions: Transaction[];
}

const variantStyles = {
  income: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700'
  },
  expense: {
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700'
  },
  balance: {
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700'
  }
} as const;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function BudgetStatsCards({
  budget,
  transactions
}: BudgetStatsCardsProps) {
  const calculations = useBudgetCalculations(budget, transactions);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Income Card */}
      <div
        className="flex flex-col gap-0 rounded-[25px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 py-6"
        style={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div
          className={cn(
            'mb-6 flex size-[60px] items-center justify-center rounded-lg',
            variantStyles.income.iconBg
          )}
        >
          <TrendingUp
            className={cn('size-[28px]', variantStyles.income.iconColor)}
          />
        </div>

        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {BUDGET_DETAIL_MESSAGES.OVERVIEW.INCOME_LABEL}
        </p>

        <div className="mt-2 mb-6">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(calculations.totalIncome)}
          </p>
        </div>
      </div>

      {/* Expenses Card */}
      <div
        className="flex flex-col gap-0 rounded-[25px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 py-6"
        style={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div
          className={cn(
            'mb-6 flex size-[60px] items-center justify-center rounded-lg',
            variantStyles.expense.iconBg
          )}
        >
          <TrendingDown
            className={cn('size-[28px]', variantStyles.expense.iconColor)}
          />
        </div>

        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {BUDGET_DETAIL_MESSAGES.OVERVIEW.SPENT_LABEL}
        </p>

        <div className="mt-2 mb-6">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(calculations.totalSpent)}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div
        className="flex flex-col gap-0 rounded-[25px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-8 py-6"
        style={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div
          className={cn(
            'mb-6 flex size-[60px] items-center justify-center rounded-lg',
            variantStyles.balance.iconBg
          )}
        >
          <Wallet
            className={cn('size-[28px]', variantStyles.balance.iconColor)}
          />
        </div>

        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {BUDGET_DETAIL_MESSAGES.OVERVIEW.AVAILABLE_LABEL}
        </p>

        <div className="mt-2 mb-6">
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(calculations.available)}
          </p>
        </div>
      </div>
    </div>
  );
}
