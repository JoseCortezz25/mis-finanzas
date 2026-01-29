'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCreateAllocation } from '@/lib/hooks/use-allocations';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { allocationTextMap } from '@/domains/budget/allocation.text-map';
import type { AllocationFormValues } from '@/lib/validations/allocation-schema';
import { ArrowDownRight, Wallet } from 'lucide-react';

interface AllocationFormProps {
  budgetId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  name: string;
}

/**
 * Inline form for creating budget allocations
 * Minimal design with pastel colors and improved visual hierarchy
 */
export function AllocationForm({
  budgetId,
  onSuccess,
  onCancel
}: AllocationFormProps) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const createAllocation = useCreateAllocation();

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('[ALLOCATION-FORM] Error fetching categories:', error);
        toast.error('Error al cargar categorías');
      } else {
        setCategories(data || []);
      }
      setIsLoadingCategories(false);
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(allocationTextMap.amountPositive);
      return;
    }

    if (!categoryId) {
      toast.error(allocationTextMap.categoryRequired);
      return;
    }

    const allocationData: AllocationFormValues = {
      amount: parseFloat(amount),
      budget_id: budgetId,
      category_id: categoryId,
      date: new Date().toISOString(),
      description: description || null
    };

    const result = await createAllocation.mutateAsync(allocationData);

    if (result.success) {
      toast.success(allocationTextMap.successCreate);
      // Reset form
      setAmount('');
      setCategoryId('');
      setDescription('');
      onSuccess();
    } else {
      toast.error(result.error || allocationTextMap.errorCreate);
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && categoryId;

  const formattedAmount = amount
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(parseFloat(amount) || 0)
    : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in slide-in-from-top-2 duration-200/50 space-y-6 rounded-xl border border-neutral-200 p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <Wallet className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-stone-900">
            {allocationTextMap.formTitle}
          </h3>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <ArrowDownRight className="h-3 w-3" />
            Del fondo general a este presupuesto
          </p>
        </div>
      </div>

      {/* Amount Input - Hero element */}
      <div className="space-y-3">
        <Label
          htmlFor="allocation-amount"
          className="text-sm font-medium text-stone-700"
        >
          {allocationTextMap.amountLabel}{' '}
          <span className="text-emerald-600">*</span>
        </Label>

        {formattedAmount && amount !== '' && (
          <p className="rounded-lg bg-gray-100 p-4 text-center text-sm font-medium text-gray-700 md:text-xl">
            {formattedAmount}
          </p>
        )}
        <div className="relative">
          <Input
            id="allocation-amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="rounded-xl bg-white p-8 text-4xl font-semibold placeholder:text-stone-300 focus:border-emerald-400 focus:ring-emerald-100"
            aria-describedby="amount-helper"
            autoFocus
          />
        </div>

        <p id="amount-helper" className="pl-1 text-xs text-stone-500">
          {allocationTextMap.amountHelper}
        </p>
      </div>

      <div className="flex flex-col flex-wrap gap-3 md:flex-row">
        {/* Category Select */}
        <div className="flex-1 space-y-3">
          <Label
            htmlFor="allocation-category"
            className="text-sm font-medium text-stone-700"
          >
            {allocationTextMap.categoryLabel}{' '}
            <span className="text-emerald-600">*</span>
          </Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger
              id="allocation-category"
              className="h-11 w-full rounded-lg border-2 border-stone-200 bg-white focus:border-emerald-400 focus:ring-emerald-100"
            >
              <SelectValue
                placeholder={
                  isLoadingCategories
                    ? 'Cargando...'
                    : allocationTextMap.categoryPlaceholder
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="pl-1 text-xs text-stone-500">
            {allocationTextMap.categoryHelper}
          </p>
        </div>

        {/* Description Input (Optional) */}
        <div className="flex-1 space-y-3">
          <Label
            htmlFor="allocation-description"
            className="text-sm font-medium text-stone-700"
          >
            {allocationTextMap.descriptionLabel}
          </Label>
          <Input
            id="allocation-description"
            type="text"
            placeholder={allocationTextMap.descriptionPlaceholder}
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={200}
            className="h-11 rounded-lg border-2 border-stone-200 bg-white focus:border-blue-300 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full gap-3 pt-2 md:w-[40%]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 flex-1 rounded-lg border-stone-200 hover:bg-stone-50"
        >
          {allocationTextMap.cancelButton}
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || createAllocation.isPending}
          className="h-11 flex-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {createAllocation.isPending
            ? allocationTextMap.creating
            : allocationTextMap.confirmButton}
        </Button>
      </div>
    </form>
  );
}
