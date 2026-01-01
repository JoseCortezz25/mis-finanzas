'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import {
  useBudgets,
  useDeleteBudget,
  useUpdateBudgetStatus
} from '@/lib/hooks';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PageLayout } from '@/components/templates/page-layout';
import { EmptyState } from '@/components/molecules/empty-state';
import { DataTableActions } from '@/components/molecules/data-table-actions';
import { BUDGET_MESSAGES } from '@/domains/budget/messages';
import { getMonthName } from '@/domains/shared/messages';
import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';

const STATUS_CONFIG = {
  draft: { variant: 'secondary' as const, label: BUDGET_MESSAGES.STATUS.DRAFT },
  active: { variant: 'default' as const, label: BUDGET_MESSAGES.STATUS.ACTIVE },
  closed: { variant: 'outline' as const, label: BUDGET_MESSAGES.STATUS.CLOSED }
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
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{BUDGET_MESSAGES.PAGE.LIST_TITLE}</CardTitle>
                <CardDescription>
                  {BUDGET_MESSAGES.PAGE.LIST_DESCRIPTION}
                </CardDescription>
              </div>
              <Button
                className="hidden md:block"
                onClick={() => router.push('/presupuesto/crear')}
              >
                Crear Presupuesto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{BUDGET_MESSAGES.TABLE.NAME}</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.PERIOD}</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.AMOUNT}</TableHead>
                  <TableHead>{BUDGET_MESSAGES.TABLE.STATUS}</TableHead>
                  <TableHead className="text-right">
                    {BUDGET_MESSAGES.TABLE.ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets?.map(budget => {
                  const category = budget.category
                    ? BUDGET_CATEGORIES.find(c => c.id === budget.category)
                    : null;

                  return (
                    <TableRow
                      key={budget.id}
                      className="hover:bg-accent/50 cursor-pointer"
                      onClick={() => router.push(`/presupuesto/${budget.id}`)}
                    >
                      <TableCell className="font-medium">
                        {budget.name}
                      </TableCell>
                      <TableCell>
                        {category ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.bgColor}`}
                            >
                              <category.icon
                                size={16}
                                className={category.iconColor}
                              />
                            </div>
                            <span className="text-sm">{category.label}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {budget.month && budget.year
                          ? `${getMonthName(budget.month)} ${budget.year}`
                          : '-'}
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
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={e => e.stopPropagation()}
                        >
                          {/* Status Change Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Cambiar estado
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(budget.id, 'draft')
                                }
                                disabled={budget.status === 'draft'}
                              >
                                <Circle className="mr-2 h-4 w-4" />
                                Borrador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(budget.id, 'active')
                                }
                                disabled={budget.status === 'active'}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(budget.id, 'closed')
                                }
                                disabled={budget.status === 'closed'}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cerrar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Edit/Delete Actions */}
                          <DataTableActions
                            onEdit={() =>
                              router.push(`/presupuesto/editar/${budget.id}`)
                            }
                            onDelete={() => handleDelete(budget.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
