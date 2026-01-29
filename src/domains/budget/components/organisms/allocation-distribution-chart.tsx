'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAllocationDistribution } from '@/lib/hooks/use-allocation-distribution';
import { AllocationDistributionChartSkeleton } from '../atoms/allocation-distribution-chart-skeleton';
import { EmptyAllocationsState } from '../molecules/empty-allocations-state';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';
import { AlertCircle } from 'lucide-react';

/**
 * Chart colors from shadcn/ui theme
 */
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

/**
 * Pie chart component displaying allocation distribution across budgets
 * Shows how the general fund is virtually allocated to different budgets
 */
export function AllocationDistributionChart() {
  const { data, isLoading, error } = useAllocationDistribution();

  // Loading state
  if (isLoading) {
    return <AllocationDistributionChartSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center">
          <AlertCircle className="text-destructive mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Error al cargar distribución de asignaciones
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!data || data.distribution.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{allocationTextMap.chartTitle}</CardTitle>
          <CardDescription>{allocationTextMap.chartSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyAllocationsState />
        </CardContent>
      </Card>
    );
  }

  // Prepare data for chart
  const chartData = data.distribution.map(item => ({
    name: item.budgetName,
    value: item.totalAllocated,
    percentage: item.percentage
  }));

  // Custom label renderer for pie slices
  const renderLabel = (entry: { percentage: number }) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{allocationTextMap.chartTitle}</CardTitle>
        <CardDescription>{allocationTextMap.chartSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">
                              {data.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-sm">
                              Monto:
                            </span>
                            <span className="text-sm font-bold">
                              ${data.value.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-sm">
                              Porcentaje:
                            </span>
                            <span className="text-sm font-bold">
                              {data.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value, entry: any) => {
                  const data = entry.payload;
                  return `${value} ($${data.value.toFixed(2)})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Total Summary */}
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {allocationTextMap.totalAllocated}:
            </p>
            <p className="text-lg font-bold">
              ${data.totalAllocated.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
