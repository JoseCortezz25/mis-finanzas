'use client';

import { useTransactions, useTransactionStats, useBudgets } from '@/lib/hooks';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const { isLoading: statsLoading } = useTransactionStats();
  const { isLoading: budgetsLoading } = useBudgets();

  // Filter transactions by periodd
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (selectedPeriod === 'all') return transactions;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const txDate = new Date(t.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      if (selectedPeriod === 'month') {
        return txMonth === currentMonth && txYear === currentYear;
      } else if (selectedPeriod === 'year') {
        return txYear === currentYear;
      }

      return true;
    });
  }, [transactions, selectedPeriod]);

  // Calculate period stats
  const periodStats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Group transactions by category
  const categoryStats = useMemo(() => {
    const grouped = filteredTransactions.reduce(
      (acc, transaction) => {
        const key = transaction.category_id;
        if (!acc[key]) {
          acc[key] = {
            count: 0,
            total: 0,
            type: transaction.type
          };
        }
        acc[key].count++;
        acc[key].total += transaction.amount;
        return acc;
      },
      {} as Record<string, { count: number; total: number; type: string }>
    );

    return Object.entries(grouped)
      .map(([categoryId, data]) => ({
        categoryId,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [filteredTransactions]);

  if (transactionsLoading || statsLoading || budgetsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-6 py-6">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y estadísticas de tus finanzas
          </p>
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Selecciona período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tiempos</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${periodStats.income.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${periodStats.expenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                periodStats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${periodStats.balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.count}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
            <CardDescription>
              Distribución de gastos en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.filter(c => c.type === 'expense').length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No hay gastos en este período
              </p>
            ) : (
              <div className="space-y-4">
                {categoryStats
                  .filter(c => c.type === 'expense')
                  .map((stat, index) => (
                    <div
                      key={stat.categoryId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{index + 1}</span>
                        <span className="text-muted-foreground text-sm">
                          ID: {stat.categoryId.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${stat.total.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {stat.count} {stat.count === 1 ? 'gasto' : 'gastos'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Categoría</CardTitle>
            <CardDescription>
              Distribución de ingresos en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.filter(c => c.type === 'income').length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No hay ingresos en este período
              </p>
            ) : (
              <div className="space-y-4">
                {categoryStats
                  .filter(c => c.type === 'income')
                  .map((stat, index) => (
                    <div
                      key={stat.categoryId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{index + 1}</span>
                        <span className="text-muted-foreground text-sm">
                          ID: {stat.categoryId.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${stat.total.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {stat.count}{' '}
                          {stat.count === 1 ? 'ingreso' : 'ingresos'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
          <CardDescription>
            Los 10 movimientos más recientes del período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No hay movimientos en este período
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), 'dd MMM yyyy', {
                        locale: es
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === 'income'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
