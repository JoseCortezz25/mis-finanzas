import { z } from 'zod';

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'El tipo de movimiento es requerido'
  }),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado grande'),
  category_id: z.string().uuid('ID de categoría inválido'),
  budget_id: z
    .string()
    .uuid('ID de presupuesto inválido')
    .nullable()
    .optional(),
  date: z.string().refine(
    val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Fecha inválida' }
  ),
  payment_method: z
    .string()
    .max(50, 'El método de pago no puede exceder 50 caracteres')
    .nullable()
    .optional(),
  description: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .nullable()
    .optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .nullable()
    .optional()
});

/**
 * Transaction update schema (all fields optional)
 */
export const transactionUpdateSchema = transactionSchema.partial();

/**
 * Transaction form schema
 */
export const transactionFormSchema = transactionSchema;

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type TransactionUpdateValues = z.infer<typeof transactionUpdateSchema>;
