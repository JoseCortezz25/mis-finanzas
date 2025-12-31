'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useBudgets, useDeleteBudget } from '@/lib/hooks';
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
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { DataTableActions } from '@/components/molecules/data-table-actions';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';
import { getMonthName } from '@/domains/shared/messages';

const STATUS_CONFIG = {
  draft: { variant: 'secondary' as const, label: BUDGET_MESSAGES.STATUS.DRAFT },
  active: { variant: 'default' as const, label: BUDGET_MESSAGES.STATUS.ACTIVE },
  closed: { variant: 'outline' as const, label: BUDGET_MESSAGES.STATUS.CLOSED }
};

export default function PresupuestoPage() {
  const router = useRouter();
  const { data: budgets, isLoading } = useBudgets();
  const deleteBudget = useDeleteBudget();

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
        <Card>
          <CardHeader>
            <CardTitle>{BUDGET_MESSAGES.PAGE.LIST_TITLE}</CardTitle>
            <CardDescription>
              {BUDGET_MESSAGES.PAGE.LIST_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{BUDGET_MESSAGES.TABLE.NAME}</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.PERIOD}</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.AMOUNT}</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.STATUS}</TableHead>
                  <TableHead className="text-right">
                    {BUDGET_MESSAGES.TABLE.ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets?.map(budget => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.name}</TableCell>
                    <TableCell>
                      {getMonthName(budget.month)} {budget.year}
                    </TableCell>
                    <TableCell>
                      ${budget.total_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_CONFIG[budget.status].variant}>
                        {STATUS_CONFIG[budget.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DataTableActions
                        onEdit={() =>
                          router.push(`/presupuesto/editar/${budget.id}`)
                        }
                        onDelete={() => handleDelete(budget.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
