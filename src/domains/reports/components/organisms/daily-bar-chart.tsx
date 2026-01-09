'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { DateRangeSelector } from '@/components/molecules/date-range-selector';
import { Separator } from '@/components/ui/separator';
import {
  formatCurrency,
  formatDateShort,
  formatDateLong
} from '@/lib/utils/format';
import { useDailyBarChartData } from '@/domains/reports/hooks/use-daily-bar-chart-data';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface DailyBarChartProps {
  transactions: Transaction[] | undefined;
  isLoading?: boolean;
}

// Custom tooltip component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border-border text-foreground rounded-md border p-3 shadow-lg">
      <p className="mb-2 text-sm font-semibold">{formatDateLong(data.date)}</p>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ingresos:</span>
          <span className="font-medium text-emerald-600">
            {formatCurrency(data.income)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Gastos:</span>
          <span className="font-medium text-red-600">
            {formatCurrency(data.expense)}
          </span>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground font-semibold">Neto:</span>
          <span
            className={cn(
              'font-semibold',
              data.net >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {formatCurrency(data.net)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function DailyBarChart({
  transactions,
  isLoading = false
}: DailyBarChartProps) {
  const [dateRange, setDateRange] = useState('30d');

  const chartData = useDailyBarChartData(transactions, dateRange);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-around gap-1 px-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-end gap-1">
                  <Skeleton
                    className="w-4"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  />
                  <Skeleton
                    className="w-4"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.summary.daysWithActivity > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Ingresos y Gastos Diarios</CardTitle>
          <DateRangeSelector
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: '7d', label: 'Últimos 7 días' },
              { value: '30d', label: 'Últimos 30 días' },
              { value: '90d', label: 'Últimos 90 días' }
            ]}
          />
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-80 flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="text-muted-foreground mb-4 h-16 w-16 opacity-20" />
            <h3 className="mb-2 text-lg font-semibold">
              Sin movimientos en este período
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              No hay transacciones registradas para el rango de fechas
              seleccionado.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1 text-xs">
                  Total Ingresos
                </p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(chartData.summary.totalIncome)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1 text-xs">
                  Total Gastos
                </p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(chartData.summary.totalExpense)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1 text-xs">Balance</p>
                <p
                  className={cn(
                    'text-lg font-bold',
                    chartData.summary.netBalance >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  )}
                >
                  {formatCurrency(chartData.summary.netBalance)}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1 text-xs">
                  Días con actividad
                </p>
                <p className="text-lg font-bold">
                  {chartData.summary.daysWithActivity}
                </p>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={chartData.dataPoints}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={formatDateShort}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={value =>
                    value >= 1000000
                      ? `$${(value / 1000000).toFixed(1)}M`
                      : `$${(value / 1000).toFixed(0)}k`
                  }
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  width={80}
                />
                <RechartsTooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="square"
                  formatter={value =>
                    value === 'income' ? 'Ingresos' : 'Gastos'
                  }
                />
                <Bar
                  dataKey="income"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  barSize={20}
                  name="income"
                />
                <Bar
                  dataKey="expense"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  barSize={20}
                  name="expense"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
