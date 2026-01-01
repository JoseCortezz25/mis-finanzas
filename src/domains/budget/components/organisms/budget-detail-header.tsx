'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';
import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';
import type { Database } from '@/types/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];

interface BudgetDetailHeaderProps {
  budget: Budget;
}

const STATUS_VARIANT = {
  draft: 'secondary' as const,
  active: 'default' as const,
  closed: 'outline' as const
};

export function BudgetDetailHeader({ budget }: BudgetDetailHeaderProps) {
  const router = useRouter();

  const category = budget.category
    ? BUDGET_CATEGORIES.find(c => c.id === budget.category)
    : null;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/presupuesto/editar/${budget.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {BUDGET_DETAIL_MESSAGES.PAGE.BACK}
      </Button>

      {/* Header content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          {/* Budget name */}
          <h1 className="text-2xl font-bold md:text-3xl">{budget.name}</h1>

          {/* Category and status */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category */}
            {category && (
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.bgColor}`}
                >
                  <category.icon size={16} className={category.iconColor} />
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {category.label}
                </span>
              </div>
            )}

            {/* Status badge */}
            <Badge variant={STATUS_VARIANT[budget.status]}>
              {
                BUDGET_MESSAGES.STATUS[
                  budget.status.toUpperCase() as keyof typeof BUDGET_MESSAGES.STATUS
                ]
              }
            </Badge>

            {/* Period (if available) */}
            {budget.month && budget.year && (
              <span className="text-muted-foreground text-sm">
                {getMonthName(budget.month)} {budget.year}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={handleEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">
              {BUDGET_DETAIL_MESSAGES.ACTIONS.EDIT_BUDGET}
            </span>
            <span className="sm:hidden">Editar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to get month name in Spanish
 */
function getMonthName(month: number): string {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  return months[month - 1] || '';
}
