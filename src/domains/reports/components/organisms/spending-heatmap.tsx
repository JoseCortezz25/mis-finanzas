'use client';

import { useState, useMemo } from 'react';
import { format, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { DateRangeSelector } from '@/components/molecules/date-range-selector';
import { HeatmapCell } from '@/components/molecules/heatmap-cell';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSpendingHeatmapData } from '@/domains/reports/hooks/use-spending-heatmap-data';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export interface SpendingHeatmapProps {
  transactions: Transaction[] | undefined;
  categories: Category[] | undefined;
  isLoading?: boolean;
}

const LEVEL_COLORS = {
  0: 'bg-gray-100',
  1: 'bg-red-100',
  2: 'bg-red-200',
  3: 'bg-red-300',
  4: 'bg-red-500'
} as const;

export function SpendingHeatmap({
  transactions,
  categories,
  isLoading = false
}: SpendingHeatmapProps) {
  const [months, setMonths] = useState<'6' | '12'>('12');

  const heatmapData = useSpendingHeatmapData(
    transactions,
    months === '6' ? 6 : 12
  );

  // Create category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories ?? []) {
      map.set(category.id, category.name);
    }
    return map;
  }, [categories]);

  // Calculate month labels
  const monthLabels = useMemo(() => {
    if (heatmapData.grid.length === 0) return [];

    const labels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    for (let weekIdx = 0; weekIdx < heatmapData.grid.length; weekIdx++) {
      const week = heatmapData.grid[weekIdx];

      // Check all valid days in the week
      for (const day of week.days) {
        if (!day.date) continue;

        const date = new Date(day.date);
        const month = getMonth(date);
        const dayOfMonth = date.getDate();

        // Only add label if this is a new month and it's early in the month (day 1-7)
        // This ensures the label appears at the start of the month visually
        if (month !== lastMonth && dayOfMonth <= 7) {
          labels.push({
            label: format(date, 'MMM', { locale: es }),
            weekIndex: weekIdx
          });
          lastMonth = month;
          break; // Move to next week
        }
      }
    }

    return labels;
  }, [heatmapData.grid]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex w-4 flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-3" />
              ))}
            </div>
            <div className="flex gap-0.5 overflow-x-auto">
              {Array.from({ length: 52 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-0.5">
                  {Array.from({ length: 7 }).map((_, dayIdx) => (
                    <Skeleton key={dayIdx} className="h-3 w-3" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = heatmapData.summary.daysWithActivity > 0;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Mapa de Calor de Gastos</CardTitle>
            <DateRangeSelector
              value={months}
              onChange={value => setMonths(value as '6' | '12')}
              options={[
                { value: '6', label: 'Últimos 6 meses' },
                { value: '12', label: 'Últimos 12 meses' }
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="text-muted-foreground mb-4 h-16 w-16 opacity-20" />
              <h3 className="mb-2 text-lg font-semibold">
                Sin gastos registrados
              </h3>
              <p className="text-muted-foreground text-sm">
                No hay gastos en el período seleccionado.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs">
                    Total Gastado
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(heatmapData.summary.totalSpent)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs">
                    Promedio Diario
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(heatmapData.summary.averageDailySpending)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1 text-xs">Día Pico</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(heatmapData.summary.peakDay.amount)}
                  </p>
                </div>
              </div>

              {/* Month labels */}
              <div className="mb-2 ml-6 flex gap-0.5 overflow-x-auto">
                {monthLabels.map((month, idx) => (
                  <div
                    key={idx}
                    className="text-muted-foreground text-xs"
                    style={{
                      marginLeft:
                        idx === 0
                          ? 0
                          : `${(month.weekIndex - (monthLabels[idx - 1]?.weekIndex || 0)) * 16}px`
                    }}
                  >
                    {month.label}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-2 overflow-x-auto pb-4">
                {/* Day labels */}
                <div className="text-muted-foreground flex flex-col justify-around gap-0.5 text-xs">
                  <span>D</span>
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                </div>

                {/* Grid cells */}
                <div className="flex gap-0.5">
                  {heatmapData.grid.map(week => (
                    <div
                      key={week.weekNumber}
                      className="flex flex-col gap-0.5"
                    >
                      {week.days.map((day, dayIdx) => {
                        if (!day.date) {
                          // Empty cell (padding)
                          return (
                            <div
                              key={`empty-${dayIdx}`}
                              className="h-[14px] w-[14px]"
                            />
                          );
                        }

                        // Resolve category name
                        const cellData = {
                          ...day,
                          topCategory: day.topCategory
                            ? categoryMap.get(day.topCategory) ||
                              'Categoría desconocida'
                            : undefined
                        };

                        return (
                          <HeatmapCell
                            key={day.date}
                            data={cellData}
                            size={14}
                            animationDelay={week.weekNumber * 7 + dayIdx * 2}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
                <span>Menos</span>
                <div className="flex gap-1">
                  {([0, 1, 2, 3, 4] as const).map(level => (
                    <div
                      key={level}
                      className={cn(
                        'h-3 w-3 rounded-sm border',
                        LEVEL_COLORS[level]
                      )}
                    />
                  ))}
                </div>
                <span>Más</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
