'use client';

import { REPORTS_MESSAGES } from '@/domains/reports/messages';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export interface ExpensesByCategoryChartItem {
  categoryName: string;
  total: number;
  color?: string;
  fillOpacity?: number;
}

interface ExpensesByCategoryChartProps {
  data: ExpensesByCategoryChartItem[];
}

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

function ExpensesByCategoryTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: Array<{ payload?: ExpensesByCategoryChartItem }>;
}) {
  if (!active) return null;
  const item = payload?.[0]?.payload;
  if (!item) return null;

  return (
    <div className="bg-background text-foreground rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium">{item.categoryName}</p>
      <p className="text-muted-foreground text-xs">
        {REPORTS_MESSAGES.TABLE.AMOUNT}: {formatMoney(item.total)}
      </p>
    </div>
  );
}

export function ExpensesByCategoryChart({
  data
}: ExpensesByCategoryChartProps) {
  return (
    <div aria-label={REPORTS_MESSAGES.CHART.EXPENSES_BY_CATEGORY_ARIA_LABEL}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            barCategoryGap={8}
            accessibilityLayer
          >
            <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              width={60}
              tickFormatter={value => formatMoney(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="categoryName"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<ExpensesByCategoryTooltip />} />
            <Bar dataKey="total" radius={[6, 6, 6, 6]}>
              {data.map(item => (
                <Cell
                  key={item.categoryName}
                  fill={item.color ?? 'hsl(var(--destructive))'}
                  fillOpacity={item.fillOpacity ?? 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
