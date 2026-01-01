import { z } from 'zod';

/**
 * Budget validation schema
 * Budgets are flexible groups for organizing transactions
 */
export const budgetSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  category: z.string().nullable().optional(),
  total_amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado grande'),
  month: z
    .number()
    .int('El mes debe ser un número entero')
    .min(1, 'El mes debe estar entre 1 y 12')
    .max(12, 'El mes debe estar entre 1 y 12')
    .nullable()
    .optional(),
  year: z
    .number()
    .int('El año debe ser un número entero')
    .min(2000, 'El año debe ser mayor o igual a 2000')
    .max(2100, 'El año debe ser menor o igual a 2100')
    .nullable()
    .optional(),
  status: z.enum(['draft', 'active', 'closed']).default('draft')
});

/**
 * Budget update schema (all fields optional)
 */
export const budgetUpdateSchema = budgetSchema.partial();

/**
 * Budget form schema (excludes status for creation)
 */
export const budgetFormSchema = budgetSchema.omit({ status: true });

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
export type BudgetUpdateValues = z.infer<typeof budgetUpdateSchema>;
