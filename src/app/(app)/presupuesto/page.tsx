'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';
import {
  useBudgets,
  useDeleteBudget,
  useUpdateBudgetStatus
} from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';
import { getMonthName } from '@/domains/shared/messages';
import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';
import type { BudgetCategory } from '@/domains/budget/constants/categories';

const STATUS_CONFIG = {
  draft: { color: 'bg-stone-100 text-stone-600', label: 'Borrador' },
  active: { color: 'bg-emerald-50 text-emerald-700', label: 'Activo' },
  closed: { color: 'bg-slate-100 text-slate-500', label: 'Cerrado' }
};

type Budget = {
  id: string;
  name: string;
  category: string | null;
  month: number | null;
  year: number | null;
  total_amount: number;
  status: 'draft' | 'active' | 'closed';
};

export default function PresupuestoPage() {
  const router = useRouter();
  const { data: budgets, isLoading } = useBudgets();
  const deleteBudget = useDeleteBudget();
  const updateStatus = useUpdateBudgetStatus();

  const handleStatusChange = async (
    id: string,
    status: 'draft' | 'active' | 'closed'
  ) => {
    const result = await updateStatus.mutateAsync({ id, status });

    if (result.success) {
      toast.success('Estado actualizado correctamente');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(BUDGET_MESSAGES.CONFIRMATIONS.DELETE)) return;

    const result = await deleteBudget.mutateAsync(id);

    if (result.success) {
      toast.success(BUDGET_MESSAGES.SUCCESS.DELETED);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <PageLayout
      title={BUDGET_MESSAGES.PAGE.TITLE}
      description={BUDGET_MESSAGES.PAGE.SUBTITLE}
      isLoading={isLoading}
      loadingMessage={BUDGET_MESSAGES.LOADING.LIST}
    >
      {budgets && budgets.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={BUDGET_MESSAGES.EMPTY.TITLE}
          description={BUDGET_MESSAGES.EMPTY.DESCRIPTION}
          actionLabel={BUDGET_MESSAGES.EMPTY.ACTION}
          onAction={() => router.push('/presupuesto/crear')}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground text-xl font-semibold">
                Mis Presupuestos
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {budgets?.length}{' '}
                {budgets?.length === 1 ? 'presupuesto' : 'presupuestos'}
              </p>
            </div>
            <Button
              onClick={() => router.push('/presupuesto/crear')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Crear Presupuesto</span>
              <span className="sm:hidden">Crear</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets?.map((budget: Budget) => {
              const category: BudgetCategory | undefined = budget.category
                ? BUDGET_CATEGORIES.find(c => c.id === budget.category)
                : undefined;

              return (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  category={category}
                  onView={() => router.push(`/presupuesto/${budget.id}`)}
                  onEdit={() => router.push(`/presupuesto/editar/${budget.id}`)}
                  onDelete={() => handleDelete(budget.id)}
                  onStatusChange={status =>
                    handleStatusChange(budget.id, status)
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

function BudgetCard({
  budget,
  category,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}: {
  budget: Budget;
  category?: BudgetCategory;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'draft' | 'active' | 'closed') => void;
}) {
  const statusConfig = STATUS_CONFIG[budget.status];
  const periodText =
    budget.month && budget.year
      ? `${getMonthName(budget.month)} ${budget.year}`
      : 'Sin período';

  return (
    <article
      className="group relative cursor-pointer touch-manipulation rounded-xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:border-stone-300 hover:shadow-lg"
      onClick={onView}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${budget.name}`}
    >
      <div className="mb-4 flex items-start justify-between">
        {category ? (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor} transition-transform duration-200 group-hover:scale-110`}
            aria-hidden="true"
          >
            <category.icon size={24} className={category.iconColor} />
          </div>
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100"
            aria-hidden="true"
          >
            <Calendar size={24} className="text-stone-400" />
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              onClick={e => e.stopPropagation()}
              aria-label="Opciones de presupuesto"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onStatusChange('active');
              }}
              disabled={budget.status === 'active'}
            >
              <span
                className="mr-2 h-2 w-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Activar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onStatusChange('closed');
              }}
              disabled={budget.status === 'closed'}
            >
              <span
                className="mr-2 h-2 w-2 rounded-full bg-slate-400"
                aria-hidden="true"
              />
              Cerrar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-foreground mb-1 text-lg leading-tight font-semibold">
            {budget.name}
          </h3>
          {category && (
            <p className="text-muted-foreground text-sm">{category.label}</p>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-foreground text-2xl font-bold tabular-nums">
            ${budget.total_amount.toLocaleString('es-ES')}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-2">
          <time className="text-muted-foreground text-sm">{periodText}</time>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>
    </article>
  );
}
