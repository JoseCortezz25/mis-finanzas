'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  categoryFormSchema,
  type CategoryFormValues
} from '@/lib/validations/category-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '../molecules/color-picker';
import { IconPicker } from '../molecules/icon-picker';
import { CATEGORIES_MESSAGES } from '../../messages';
import { DEFAULT_COLOR, DEFAULT_ICON } from '../../constants';

interface CategoryFormProps {
  onSubmit: (data: CategoryFormValues) => void | Promise<void>;
  defaultValues?: Partial<CategoryFormValues>;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

/**
 * CategoryForm - Organism component
 * Complete form for creating/editing categories with validation
 */
export function CategoryForm({
  onSubmit,
  defaultValues,
  isLoading,
  submitLabel,
  onCancel,
  cancelLabel
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      color: DEFAULT_COLOR.hex,
      icon: DEFAULT_ICON.id
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 md:space-y-8"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{CATEGORIES_MESSAGES.FORM.NAME_LABEL}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={CATEGORIES_MESSAGES.FORM.NAME_PLACEHOLDER}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field (Optional) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {CATEGORIES_MESSAGES.FORM.DESCRIPTION_LABEL}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={CATEGORIES_MESSAGES.FORM.DESCRIPTION_PLACEHOLDER}
                  disabled={isLoading}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Picker */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Icon Picker */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <IconPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex flex-wrap justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel || CATEGORIES_MESSAGES.ACTIONS.CANCEL}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel || CATEGORIES_MESSAGES.FORM.SUBMIT_CREATE}
          </Button>
        </div>
      </form>
    </Form>
  );
}
