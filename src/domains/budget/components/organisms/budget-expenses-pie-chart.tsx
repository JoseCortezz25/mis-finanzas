'use client';

import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface ExpensePieChartItem {
  name: string;
  value: number;
  color: string;
}

interface BudgetExpensesPieChartProps {
  transactions: Transaction[];
}

// Color mapping for categories - hex colors for recharts
const CATEGORY_COLORS: Record<string, string> = {
  comida: '#f97316',
  transporte: '#3b82f6',
  entretenimiento: '#a855f7',
  salud: '#ef4444',
  compras: '#ec4899',
  servicios: '#14b8a6',
  educacion: '#f59e0b',
  educación: '#f59e0b',
  'otros gastos': '#6b7280',
  otros: '#6b7280',
  vivienda: '#f59e0b',
  tecnología: '#06b6d4',
  tecnologia: '#06b6d4',
  regalos: '#f43f5e',
  'sin categoría': '#94a3b8'
};

const DEFAULT_COLOR = '#94a3b8';

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function CustomTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ExpensePieChartItem;
  }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-lg">
      <p className="text-sm font-semibold text-stone-900 capitalize">
        {data.name}
      </p>
      <p className="text-base font-bold text-stone-700">
        {formatMoney(data.value)}
      </p>
    </div>
  );
}

function CustomLegend({
  payload
}: {
  payload?: Array<{
    value: string;
    color: string;
    payload: ExpensePieChartItem;
  }>;
}) {
  if (!payload) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate text-xs font-medium text-stone-600 capitalize">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BudgetExpensesPieChart({
  transactions
}: BudgetExpensesPieChartProps) {
  // Filter only expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  if (expenseTransactions.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8">
        <h3 className="mb-2 text-lg font-bold text-stone-900">
          {BUDGET_DETAIL_MESSAGES.CATEGORIES.TITLE}
        </h3>
        <p className="mb-6 text-sm text-stone-500">
          {BUDGET_DETAIL_MESSAGES.CATEGORIES.SUBTITLE}
        </p>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-medium text-stone-500">
            {BUDGET_DETAIL_MESSAGES.EMPTY.NO_CATEGORY_BREAKDOWN}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {BUDGET_DETAIL_MESSAGES.EMPTY.NO_CATEGORY_BREAKDOWN_DESC}
          </p>
        </div>
      </div>
    );
  }

  // Group expenses by category
  const expensesByCategory = expenseTransactions.reduce(
    (acc, transaction) => {
      const category = (transaction.category || 'sin categoría').toLowerCase();
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // Convert to chart data
  const chartData: ExpensePieChartItem[] = Object.entries(
    expensesByCategory
  ).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name.toLowerCase()] || DEFAULT_COLOR
  }));

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8">
      <h3 className="mb-2 text-lg font-bold text-stone-900">
        {BUDGET_DETAIL_MESSAGES.CATEGORIES.TITLE}
      </h3>
      <p className="mb-6 text-sm text-stone-500">
        {BUDGET_DETAIL_MESSAGES.CATEGORIES.SUBTITLE}
      </p>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
