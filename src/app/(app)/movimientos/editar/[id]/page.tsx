'use client';

import { useRouter, useParams } from 'next/navigation';
import { useTransactions, useUpdateTransaction } from '@/lib/hooks';
import { TransactionForm } from '@/domains/transaction/components/organisms/transaction-form';
import type { TransactionFormValues } from '@/lib/validations';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { TRANSACTION_MESSAGES } from '@/domains/transaction/messages';

export default function EditarMovimientoPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const { data: transactions, isLoading } = useTransactions();
  const updateTransaction = useUpdateTransaction();

  const transaction = transactions?.find(t => t.id === transactionId);

  const handleSubmit = async (data: TransactionFormValues) => {
    const result = await updateTransaction.mutateAsync({
      id: transactionId,
      data
    });

    if (result.success) {
      toast.success(TRANSACTION_MESSAGES.SUCCESS.UPDATED);
      router.push('/movimientos');
    } else {
      toast.error(result.error);
    }
  };

  if (!transaction && !isLoading) {
    return (
      <PageLayout
        title="Movimiento no encontrado"
        description="El movimiento que buscas no existe"
      >
        <div className="text-center">
          <p className="text-muted-foreground">Movimiento no encontrado</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={TRANSACTION_MESSAGES.DIALOG.EDIT_TITLE}
      description={TRANSACTION_MESSAGES.DIALOG.EDIT_DESCRIPTION}
      isLoading={isLoading}
      loadingMessage={TRANSACTION_MESSAGES.LOADING.LIST}
    >
      {transaction && (
        <div className="mx-auto max-w-2xl">
          <TransactionForm
            onSubmit={handleSubmit}
            defaultValues={{
              type: transaction.type,
              amount: transaction.amount,
              category_id: transaction.category_id,
              budget_id: transaction.budget_id,
              date: transaction.date,
              payment_method: transaction.payment_method,
              description: transaction.description,
              notes: transaction.notes
            }}
            isLoading={updateTransaction.isPending}
          />
        </div>
      )}
    </PageLayout>
  );
}
