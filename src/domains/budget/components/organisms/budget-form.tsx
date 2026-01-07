'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, type BudgetFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { CategorySelector } from '@/domains/budget/components/molecules/category-selector';
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
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: defaultValues || {
      name: '',
      category: null
    }
  });

  const name = watch('name');
  const category = watch('category');

  const handleCategoryChange = (categoryId: string) => {
    setValue('category', categoryId || null, { shouldValidate: true });
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
        {/* Budget Name Input */}
        <div className="budget-form__field">
          <label htmlFor="name" className="budget-form__label">
            Nombre del presupuesto
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ej: Servicios Públicos, Viaje a Cartagena, Mercado del Mes"
            className="budget-form__input"
            disabled={isLoading}
            {...register('name')}
          />
          {errors.name && (
            <p className="budget-form__error">{errors.name.message}</p>
          )}
        </div>

        {/* Category Selector (Optional) */}
        <div className="budget-form__field">
          <label className="budget-form__label">
            Categoría (opcional)
            <span className="budget-form__label-hint">
              Solo para identificar visualmente
            </span>
          </label>
          <CategorySelector
            value={category || ''}
            onChange={handleCategoryChange}
            disabled={isLoading}
          />
          {errors.category && (
            <p className="budget-form__error">{errors.category.message}</p>
          )}
        </div>

        <div className="budget-form__info-message">
          <p>
            El monto del presupuesto se calculará automáticamente sumando los
            ingresos que asignes a este presupuesto.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !name}
          className={cn(
            'budget-form__submit',
            !name && 'budget-form__submit--disabled'
          )}
        >
          {isLoading ? 'Creando...' : 'Crear presupuesto'}
        </Button>
      </form>
    </div>
  );
}
