'use client';

import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { REPORTS_MESSAGES } from '@/domains/reports/messages';
import {
  useSpendingSankeyData,
  type SankeyPeriod
} from '@/domains/reports/hooks/use-spending-sankey-data';
import { formatCurrency } from '@/lib/utils/format';
import type { Database } from '@/types/supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];

export interface SpendingSankeyProps {
  transactions: Transaction[] | undefined;
  categories: Category[] | undefined;
  budgets: Budget[] | undefined;
  isLoading?: boolean;
}

const PERIOD_OPTIONS: Array<{ value: SankeyPeriod; label: string }> = [
  {
    value: 'last-month',
    label: REPORTS_MESSAGES.SANKEY.PERIOD_OPTIONS.LAST_MONTH
  },
  {
    value: 'this-month',
    label: REPORTS_MESSAGES.SANKEY.PERIOD_OPTIONS.THIS_MONTH
  },
  {
    value: 'this-week',
    label: REPORTS_MESSAGES.SANKEY.PERIOD_OPTIONS.THIS_WEEK
  },
  {
    value: 'this-year',
    label: REPORTS_MESSAGES.SANKEY.PERIOD_OPTIONS.THIS_YEAR
  }
];

const NO_BUDGET_KEY = 'no-budget';

function SankeyTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: Array<{
    payload?: {
      source?: { name?: string };
      target?: { name?: string };
      value?: number;
    };
  }>;
}) {
  if (!active) return null;
  const link = payload?.[0]?.payload;
  if (!link) return null;

  return (
    <div className="bg-background rounded-md border p-3 text-xs shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">
          {REPORTS_MESSAGES.SANKEY.TOOLTIP.FROM}:
          <span className="text-foreground ml-1 font-medium">
            {link.source?.name}
          </span>
        </span>
        <span className="text-muted-foreground">
          {REPORTS_MESSAGES.SANKEY.TOOLTIP.TO}:
          <span className="text-foreground ml-1 font-medium">
            {link.target?.name}
          </span>
        </span>
        <span className="text-muted-foreground">
          {REPORTS_MESSAGES.SANKEY.TOOLTIP.AMOUNT}:
          <span className="text-foreground ml-1 font-semibold">
            {formatCurrency(link.value ?? 0)}
          </span>
        </span>
      </div>
    </div>
  );
}

export function SpendingSankey({
  transactions,
  categories,
  budgets,
  isLoading = false
}: SpendingSankeyProps) {
  const [referenceDate, setReferenceDate] = useState<Date | null>(null);
  const [selectedPeriod, setSelectedPeriod] =
    useState<SankeyPeriod>('this-month');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedBudgetId, setSelectedBudgetId] = useState('all');

  useEffect(() => {
    setReferenceDate(new Date());
  }, []);

  const { data, hasData } = useSpendingSankeyData(
    transactions,
    categories,
    budgets,
    {
      period: selectedPeriod,
      categoryId: selectedCategoryId,
      budgetId: selectedBudgetId
    },
    referenceDate
  );

  const categoryOptions = useMemo(() => {
    const items = (categories ?? [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(category => ({
        value: category.id,
        label: category.name
      }));

    return [
      { value: 'all', label: REPORTS_MESSAGES.SANKEY.CATEGORY_ALL },
      ...items
    ];
  }, [categories]);

  const budgetOptions = useMemo(() => {
    const items = (budgets ?? [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(budget => ({
        value: budget.id,
        label: budget.name
      }));

    return [
      { value: 'all', label: REPORTS_MESSAGES.SANKEY.BUDGET_ALL },
      { value: NO_BUDGET_KEY, label: REPORTS_MESSAGES.SANKEY.BUDGET_NONE },
      ...items
    ];
  }, [budgets]);

  const isHydrating = referenceDate === null;

  if (isLoading || isHydrating) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Skeleton className="h-9 w-full sm:w-40" />
              <Skeleton className="h-9 w-full sm:w-40" />
              <Skeleton className="h-9 w-full sm:w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{REPORTS_MESSAGES.SANKEY.TITLE}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {REPORTS_MESSAGES.SANKEY.DESCRIPTION}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>{REPORTS_MESSAGES.SANKEY.FILTERS.PERIOD}</Label>
            <Select
              value={selectedPeriod}
              onValueChange={value => setSelectedPeriod(value as SankeyPeriod)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={REPORTS_MESSAGES.SANKEY.FILTERS.PERIOD}
                />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{REPORTS_MESSAGES.SANKEY.FILTERS.CATEGORY}</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={REPORTS_MESSAGES.SANKEY.FILTERS.CATEGORY}
                />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{REPORTS_MESSAGES.SANKEY.FILTERS.BUDGET}</Label>
            <Select
              value={selectedBudgetId}
              onValueChange={setSelectedBudgetId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={REPORTS_MESSAGES.SANKEY.FILTERS.BUDGET}
                />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!hasData ? (
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold">
              {REPORTS_MESSAGES.SANKEY.EMPTY_TITLE}
            </h3>
            <p className="text-muted-foreground text-sm">
              {REPORTS_MESSAGES.SANKEY.EMPTY_DESCRIPTION}
            </p>
          </div>
        ) : (
          <div
            aria-label={REPORTS_MESSAGES.SANKEY.ARIA_LABEL}
            className="h-72 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={data}
                nodePadding={24}
                nodeWidth={12}
                linkCurvature={0.5}
              >
                <Tooltip content={<SankeyTooltip />} />
              </Sankey>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
