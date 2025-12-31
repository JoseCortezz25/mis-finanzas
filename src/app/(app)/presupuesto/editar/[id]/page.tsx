'use client';

import { useRouter, useParams } from 'next/navigation';
import { useBudgets, useUpdateBudget } from '@/lib/hooks';
import { BudgetForm } from '@/domains/budget/components/organisms/budget-form';
import type { BudgetFormValues } from '@/lib/validations/budget-schema';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';

export default function EditarPresupuestoPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params.id as string;

  const { data: budgets, isLoading } = useBudgets();
  const updateBudget = useUpdateBudget();

  const budget = budgets?.find(b => b.id === budgetId);

  const handleSubmit = async (data: BudgetFormValues) => {
    const result = await updateBudget.mutateAsync({
      id: budgetId,
      data
    });

    if (result.success) {
      toast.success(BUDGET_MESSAGES.SUCCESS.UPDATED);
      router.push('/presupuesto');
    } else {
      toast.error(result.error);
    }
  };

  if (!budget && !isLoading) {
    return (
      <PageLayout
        title="Presupuesto no encontrado"
        description="El presupuesto que buscas no existe"
      >
        <div className="text-center">
          <p className="text-muted-foreground">Presupuesto no encontrado</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={BUDGET_MESSAGES.DIALOG.EDIT_TITLE}
      description={BUDGET_MESSAGES.DIALOG.EDIT_DESCRIPTION}
      isLoading={isLoading}
      loadingMessage={BUDGET_MESSAGES.LOADING.LIST}
    >
      {budget && (
        <div className="mx-auto max-w-2xl">
          <BudgetForm
            onSubmit={handleSubmit}
            defaultValues={{
              name: budget.name,
              total_amount: budget.total_amount,
              month: budget.month,
              year: budget.year
            }}
            isLoading={updateBudget.isPending}
          />
        </div>
      )}
    </PageLayout>
  );
}
