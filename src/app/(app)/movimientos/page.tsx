'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '@/lib/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { DataTableActions } from '@/components/molecules/data-table-actions';
import { TRANSACTION_MESSAGES } from '@/domains/transaction/messages';

export default function MovimientosPage() {
  const router = useRouter();
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    const result = await deleteTransaction.mutateAsync(transactionToDelete);

    if (result.success) {
      toast.success(TRANSACTION_MESSAGES.SUCCESS.DELETED);
    } else {
      toast.error(result.error);
    }

    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  return (
    <PageLayout
      title={TRANSACTION_MESSAGES.PAGE.TITLE}
      description={TRANSACTION_MESSAGES.PAGE.SUBTITLE}
      isLoading={isLoading}
      loadingMessage={TRANSACTION_MESSAGES.LOADING.LIST}
    >
      {transactions && transactions.length === 0 ? (
        <EmptyState
          icon={ArrowUpCircle}
          title={TRANSACTION_MESSAGES.EMPTY.TITLE}
          description={TRANSACTION_MESSAGES.EMPTY.DESCRIPTION}
          actionLabel={TRANSACTION_MESSAGES.EMPTY.ACTION}
          onAction={() => router.push('/movimientos/crear')}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{TRANSACTION_MESSAGES.PAGE.LIST_TITLE}</CardTitle>
                <CardDescription>
                  {TRANSACTION_MESSAGES.PAGE.LIST_DESCRIPTION}
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push('/movimientos/crear')}
                className="hidden md:block"
              >
                Crear Movimiento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{TRANSACTION_MESSAGES.TABLE.TYPE}</TableHead>
                  <TableHead>{TRANSACTION_MESSAGES.TABLE.DATE}</TableHead>
                  <TableHead>
                    {TRANSACTION_MESSAGES.TABLE.DESCRIPTION}
                  </TableHead>
                  <TableHead>{TRANSACTION_MESSAGES.TABLE.AMOUNT}</TableHead>
                  <TableHead className="text-right">
                    {TRANSACTION_MESSAGES.TABLE.ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {transaction.type === 'income' ? (
                        <Badge variant="default" className="gap-1">
                          <ArrowUpCircle className="h-3 w-3" />
                          {TRANSACTION_MESSAGES.TYPES.INCOME}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <ArrowDownCircle className="h-3 w-3" />
                          {TRANSACTION_MESSAGES.TYPES.EXPENSE}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), 'dd MMM yyyy', {
                        locale: es
                      })}
                    </TableCell>
                    <TableCell>
                      {transaction.description ||
                        TRANSACTION_MESSAGES.NO_DESCRIPTION}
                    </TableCell>
                    <TableCell
                      className={
                        transaction.type === 'income'
                          ? 'font-medium text-green-600'
                          : 'font-medium text-red-600'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DataTableActions
                        onEdit={() =>
                          router.push(`/movimientos/editar/${transaction.id}`)
                        }
                        onDelete={() => handleDeleteClick(transaction.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              {TRANSACTION_MESSAGES.CONFIRMATIONS.DELETE}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteTransaction.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteTransaction.isPending}
            >
              {deleteTransaction.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
