'use client';

import { useRouter } from 'next/navigation';
import { useCreateBudget } from '@/lib/hooks';
import { BudgetForm } from '@/domains/budget/components/organisms/budget-form';
import type { BudgetFormValues } from '@/lib/validations/budget-schema';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';

export default function CrearPresupuestoPage() {
  const router = useRouter();
  const createBudget = useCreateBudget();

  const handleSubmit = async (data: BudgetFormValues) => {
    const result = await createBudget.mutateAsync(data);

    if (result.success) {
      toast.success(BUDGET_MESSAGES.SUCCESS.CREATED);
      router.push('/presupuesto');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <PageLayout
      title={BUDGET_MESSAGES.DIALOG.CREATE_TITLE}
      description={BUDGET_MESSAGES.DIALOG.CREATE_DESCRIPTION}
    >
      <div className="mx-auto max-w-2xl">
        <BudgetForm
          onSubmit={handleSubmit}
          isLoading={createBudget.isPending}
        />
      </div>
    </PageLayout>
  );
}
