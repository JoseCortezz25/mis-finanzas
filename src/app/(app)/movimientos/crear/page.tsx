'use client';

import { useRouter } from 'next/navigation';
import { useCreateTransaction } from '@/lib/hooks';
import { TransactionForm } from '@/domains/transaction/components/organisms/transaction-form';
import type { TransactionFormValues } from '@/lib/validations';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { TRANSACTION_MESSAGES } from '@/domains/transaction/messages';

export default function CrearMovimientoPage() {
  const router = useRouter();
  const createTransaction = useCreateTransaction();

  const handleSubmit = async (data: TransactionFormValues) => {
    const result = await createTransaction.mutateAsync(data);

    if (result.success) {
      toast.success(TRANSACTION_MESSAGES.SUCCESS.CREATED);
      router.push('/movimientos');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <PageLayout
      title={TRANSACTION_MESSAGES.DIALOG.CREATE_TITLE}
      description={TRANSACTION_MESSAGES.DIALOG.CREATE_DESCRIPTION}
    >
      <div className="mx-auto max-w-2xl">
        <TransactionForm
          onSubmit={handleSubmit}
          isLoading={createTransaction.isPending}
        />
      </div>
    </PageLayout>
  );
}
