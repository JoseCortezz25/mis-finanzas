'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { BUDGET_DETAIL_MESSAGES } from '@/domains/budget/budget-detail.text-map';
import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';
import { AllocationForm } from '@/domains/budget/components/molecules/allocation-form';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';
import type { Database } from '@/types/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];

interface BudgetDetailHeaderProps {
  budget: Budget;
}

const STATUS_CONFIG = {
  draft: { color: 'bg-stone-100 text-stone-600', label: 'Borrador' },
  active: { color: 'bg-emerald-50 text-emerald-700', label: 'Activo' },
  closed: { color: 'bg-slate-100 text-slate-500', label: 'Cerrado' }
};

export function BudgetDetailHeader({ budget }: BudgetDetailHeaderProps) {
  const router = useRouter();
  const [isAllocationFormOpen, setIsAllocationFormOpen] = useState(false);

  const category = budget.category
    ? BUDGET_CATEGORIES.find(c => c.id === budget.category)
    : null;

  const statusConfig = STATUS_CONFIG[budget.status];

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/presupuesto/editar/${budget.id}`);
  };

  const periodText =
    budget.month && budget.year
      ? `${getMonthName(budget.month)} ${budget.year}`
      : null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground -ml-2 gap-2"
        aria-label={BUDGET_DETAIL_MESSAGES.PAGE.BACK}
      >
        <ArrowLeft className="h-4 w-4" />
        {BUDGET_DETAIL_MESSAGES.PAGE.BACK}
      </Button>

      {/* Header content with category background */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 md:p-8">
        {/* Decorative gradient background */}
        {category && (
          <div
            className={`absolute top-0 right-0 h-32 w-32 ${category.bgColor} opacity-50 blur-3xl`}
            aria-hidden="true"
          />
        )}

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            {/* Category icon */}
            {category && (
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${category.bgColor} transition-transform duration-200 hover:scale-105`}
                aria-hidden="true"
              >
                <category.icon size={32} className={category.iconColor} />
              </div>
            )}

            {/* Text content */}
            <div className="space-y-2">
              <h1 className="text-foreground text-3xl font-bold md:text-4xl">
                {budget.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {category && (
                  <span className="text-muted-foreground font-medium">
                    {category.label}
                  </span>
                )}

                {category && (periodText || statusConfig) && (
                  <span className="text-stone-300" aria-hidden="true">
                    •
                  </span>
                )}

                {periodText && (
                  <time className="text-muted-foreground">{periodText}</time>
                )}

                {periodText && statusConfig && (
                  <span className="text-stone-300" aria-hidden="true">
                    •
                  </span>
                )}

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsAllocationFormOpen(!isAllocationFormOpen)}
              className="gap-2 text-sm"
              aria-label={allocationTextMap.addAllocationButton}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {allocationTextMap.addAllocationButton}
              </span>
              <span className="sm:hidden">Añadir</span>
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={handleEdit}
              className="gap-2 text-sm"
              aria-label={BUDGET_DETAIL_MESSAGES.ACTIONS.EDIT_BUDGET}
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

      {/* Allocation Form - Inline */}
      {isAllocationFormOpen && (
        <AllocationForm
          budgetId={budget.id}
          onSuccess={() => setIsAllocationFormOpen(false)}
          onCancel={() => setIsAllocationFormOpen(false)}
        />
      )}
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
