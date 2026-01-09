'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { SemicircularGauge } from '@/components/molecules/semicircular-gauge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBalanceGaugeData } from '@/domains/dashboard/hooks/use-balance-gauge-data';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export interface BalanceGaugeCardProps {
  transactions: Transaction[] | undefined;
  categories: Category[] | undefined;
  isLoading?: boolean;
}

export function BalanceGaugeCard({
  transactions,
  categories,
  isLoading = false
}: BalanceGaugeCardProps) {
  const gaugeData = useBalanceGaugeData(transactions, categories);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="space-y-8 p-6 sm:p-8">
          {/* Balance skeleton */}
          <div className="text-center">
            <Skeleton className="mx-auto mb-2 h-12 w-48" />
            <Skeleton className="mx-auto h-4 w-32" />
          </div>

          {/* Gauge skeleton */}
          <div className="flex h-48 items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-t-full" />
          </div>

          {/* Legend skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 flex-shrink-0 rounded-sm" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData =
    gaugeData.summary.totalIncome > 0 || gaugeData.summary.totalExpenses > 0;

  return (
    <TooltipProvider>
      <Card className="shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-6 sm:p-8">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="text-muted-foreground mb-4 h-16 w-16 opacity-20" />
              <h3 className="mb-2 text-lg font-semibold">
                Sin movimientos registrados
              </h3>
              <p className="text-muted-foreground text-sm">
                Agrega tus primeros ingresos y gastos para ver tu balance.
              </p>
            </div>
          ) : (
            <>
              {/* Top: Balance Display */}
              <div className="mb-8 text-center">
                <div
                  className={cn(
                    'text-3xl font-bold sm:text-4xl lg:text-5xl',
                    gaugeData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {formatCurrency(gaugeData.balance)}
                </div>
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                  Balance Disponible
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {gaugeData.balancePercentage.toFixed(1)}% de tus ingresos
                </p>
              </div>

              {/* Center: Semicircular Gauge */}
              <div className="my-8 flex items-center justify-center">
                <SemicircularGauge
                  balance={gaugeData.balance}
                  needleAngle={gaugeData.needleAngle}
                  segments={gaugeData.segments}
                  diameter={280}
                  thickness={32}
                />
              </div>

              {/* Bottom: Category Legend */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {gaugeData.segments.map(segment => (
                  <div key={segment.type} className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 flex-shrink-0 rounded-sm"
                      style={{ backgroundColor: segment.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-xs">
                        {segment.label}
                      </p>
                      <p className="text-foreground truncate text-sm font-semibold">
                        {formatCurrency(segment.amount)}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {segment.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 border-t pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Ingresos
                    </p>
                    <p className="text-base font-semibold text-emerald-600">
                      {formatCurrency(gaugeData.summary.totalIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Egresos
                    </p>
                    <p className="text-base font-semibold text-red-600">
                      {formatCurrency(gaugeData.summary.totalEgresos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">Gastos</p>
                    <p className="text-base font-semibold text-orange-600">
                      {formatCurrency(gaugeData.summary.totalGastos)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
