'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Loader2 } from 'lucide-react';
import {
  transactionFormSchema,
  type TransactionFormValues
} from '@/lib/validations';
import {
  Form,
  FormControl,
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
import { cn } from '@/lib/utils';
import { useCategories, useBudgets } from '@/lib/hooks';
import { TRANSACTION_MESSAGES } from '@/domains/transaction/messages';
import { getCategoryColors } from '@/domains/transaction/constants/category-styles';
import { getIconComponent } from '@/domains/transaction/utils/icon-mapper';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormValues) => void;
  defaultValues?: Partial<TransactionFormValues>;
  isLoading?: boolean;
}

export function TransactionForm({
  onSubmit,
  defaultValues,
  isLoading = false
}: TransactionFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: budgets } = useBudgets();
  const [amountInput, setAmountInput] = useState('0');

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues || {
      type: 'expense',
      amount: 0,
      category_id: '',
      budget_id: null,
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
      payment_method: ''
    }
  });

  const selectedType = form.watch('type');
  const selectedAmount = form.watch('amount');
  const selectedDate = form.watch('date');

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmountInput(numericValue);
    form.setValue('amount', parseFloat(numericValue) || 0);
  };

  const formatDisplayAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO').format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Toggle Type Selector */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="bg-muted flex gap-2 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => field.onChange('expense')}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 rounded-full px-6 py-3 text-sm font-medium transition-all',
                      selectedType === 'expense'
                        ? 'text-foreground bg-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {TRANSACTION_MESSAGES.TYPES.EXPENSE}
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('income')}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 rounded-full px-6 py-3 text-sm font-medium transition-all',
                      selectedType === 'income'
                        ? 'text-foreground bg-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {TRANSACTION_MESSAGES.TYPES.INCOME}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Large Amount Display */}
        <FormField
          control={form.control}
          name="amount"
          render={() => (
            <FormItem>
              <div className="bg-muted/30 border-muted rounded-3xl border-2 p-8 text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  {TRANSACTION_MESSAGES.FORM.AMOUNT_LABEL}
                </p>
                <div className="mb-4 text-5xl font-bold">
                  COP {formatDisplayAmount(selectedAmount)}
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={amountInput}
                    onChange={e => handleAmountChange(e.target.value)}
                    disabled={isLoading}
                    className="h-14 rounded-2xl border-2 text-center text-2xl"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Grid */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {TRANSACTION_MESSAGES.FORM.CATEGORY_LABEL}
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {categoriesLoading ? (
                    <div className="col-span-2 md:col-span-4">
                      <Loader2 className="animate-spin" />
                      <p className="text-muted-foreground col-span-2 py-8 text-center md:col-span-4">
                        Cargando categorías...
                      </p>
                    </div>
                  ) : categories && categories.length > 0 ? (
                    categories.map(category => {
                      const colors = getCategoryColors(category.name);
                      const Icon = getIconComponent(category.icon || '');
                      const isSelected = field.value === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => field.onChange(category.id)}
                          disabled={isLoading}
                          className={cn(
                            'flex aspect-square flex-col items-center gap-1 rounded-2xl border transition-all',
                            isSelected
                              ? 'border-2 border-black bg-gray-100 shadow-sm'
                              : 'border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow'
                          )}
                        >
                          <div className="relative flex h-20 w-20 items-center justify-center">
                            <div
                              className={cn(
                                'absolute h-12 w-12 rounded-full',
                                colors.bgColor
                              )}
                            />
                            <Icon
                              className={cn(
                                'relative h-6 w-6',
                                colors.iconColor
                              )}
                            />
                          </div>
                          <span className="text-center text-xs leading-tight font-medium text-gray-700">
                            {category.name}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground col-span-2 py-8 text-center md:col-span-4">
                      No hay categorías disponibles
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Budget Selection Field */}
        <FormField
          control={form.control}
          name="budget_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Presupuesto (opcional)
              </FormLabel>
              <Select
                onValueChange={value =>
                  field.onChange(value === 'none' ? null : value)
                }
                value={field.value || 'none'}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl border-2">
                    <SelectValue placeholder="Selecciona un presupuesto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sin presupuesto</SelectItem>
                  {budgets?.map(budget => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.name} - ${budget.total_amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {TRANSACTION_MESSAGES.FORM.DESCRIPTION_LABEL}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Almuerzo con amigos"
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                  className="h-12 rounded-2xl border-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {TRANSACTION_MESSAGES.FORM.DATE_LABEL}
              </FormLabel>
              <div className="relative">
                <Calendar className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isLoading}
                    className="h-12 rounded-2xl border-2 pl-12"
                  />
                </FormControl>
                {selectedDate && (
                  <div className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    {format(new Date(selectedDate), 'dd/MM/yyyy', {
                      locale: es
                    })}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Method Field */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {TRANSACTION_MESSAGES.FORM.PAYMENT_METHOD_LABEL}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    TRANSACTION_MESSAGES.FORM.PAYMENT_METHOD_PLACEHOLDER
                  }
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                  className="h-12 rounded-2xl border-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                {TRANSACTION_MESSAGES.FORM.NOTES_LABEL}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={TRANSACTION_MESSAGES.FORM.NOTES_PLACEHOLDER}
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                  className="h-12 rounded-2xl border-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          {isLoading
            ? TRANSACTION_MESSAGES.LOADING.CREATING
            : TRANSACTION_MESSAGES.FORM.SAVE_BUTTON}
        </Button>
      </form>
    </Form>
  );
}
