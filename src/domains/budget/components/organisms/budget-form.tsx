'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, type BudgetFormValues } from '@/lib/validations';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => void;
  defaultValues?: Partial<BudgetFormValues>;
  isLoading?: boolean;
}

const MONTHS = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

export function BudgetForm({
  onSubmit,
  defaultValues,
  isLoading = false
}: BudgetFormProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: defaultValues || {
      name: '',
      total_amount: 0,
      month: currentMonth,
      year: currentYear
    }
  });

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del presupuesto</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Presupuesto mensual"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Un nombre descriptivo para identificar este presupuesto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={e =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                El monto total disponible para este presupuesto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mes</FormLabel>
                <Select
                  onValueChange={value => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un mes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map(month => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año</FormLabel>
                <Select
                  onValueChange={value => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un año" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar presupuesto'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
