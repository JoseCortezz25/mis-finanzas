'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, type BudgetFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { CategorySelector } from '@/domains/budget/components/molecules/category-selector';
import { CurrencyInput } from '@/domains/budget/components/molecules/currency-input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => void;
  defaultValues?: Partial<BudgetFormValues>;
  isLoading?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function BudgetForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  onClose,
  showCloseButton = false
}: BudgetFormProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: defaultValues || {
      name: '',
      category: '',
      total_amount: 0,
      month: currentMonth,
      year: currentYear
    }
  });

  const category = watch('category');
  const totalAmount = watch('total_amount');

  const handleCategoryChange = (categoryId: string) => {
    setValue('category', categoryId, { shouldValidate: true });
    // Auto-generate name based on category
    const categoryLabel =
      categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    setValue('name', `Presupuesto ${categoryLabel}`);
  };

  const handleAmountChange = (amount: number) => {
    setValue('total_amount', amount, { shouldValidate: true });
  };

  return (
    <div className="budget-form">
      <div className="budget-form__header">
        <h2 className="budget-form__title">Nuevo presupuesto</h2>
        {showCloseButton && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="budget-form__close"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="budget-form__content">
        <CategorySelector
          value={category}
          onChange={handleCategoryChange}
          disabled={isLoading}
        />
        {errors.category && (
          <p className="budget-form__error">{errors.category.message}</p>
        )}

        <div className="budget-form__divider" />

        <CurrencyInput
          value={totalAmount}
          onChange={handleAmountChange}
          disabled={isLoading}
        />
        {errors.total_amount && (
          <p className="budget-form__error">{errors.total_amount.message}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading || !category || totalAmount === 0}
          className={cn(
            'budget-form__submit',
            (!category || totalAmount === 0) && 'budget-form__submit--disabled'
          )}
        >
          {isLoading ? 'Creando...' : 'Crear presupuesto'}
        </Button>
      </form>
    </div>
  );
}
