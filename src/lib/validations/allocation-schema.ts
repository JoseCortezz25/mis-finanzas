import { z } from 'zod';

/**
 * Allocation creation schema
 * Allocations are virtual assignments of general fund to budgets
 * They do NOT move real money, only track planned distribution
 */
export const allocationSchema = z.object({
  amount: z
    .number({
      required_error: 'El monto es requerido',
      // eslint-disable-next-line camelcase
      invalid_type_error: 'El monto debe ser un número'
    })
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado grande'),
  budget_id: z
    .string({
      required_error: 'Debe seleccionar un presupuesto'
    })
    .uuid('ID de presupuesto inválido'),
  category_id: z
    .string({
      required_error: 'Debe seleccionar una categoría'
    })
    .uuid('ID de categoría inválido'),
  date: z
    .string({
      required_error: 'La fecha es requerida'
    })
    .refine(
      val => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Fecha inválida' }
    ),
  description: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .nullable()
    .optional()
});

/**
 * TypeScript type inferred from schema
 */
export type AllocationFormValues = z.infer<typeof allocationSchema>;

/**
 * Partial schema for updates (currently not used since allocations can't be edited)
 */
export const allocationUpdateSchema = allocationSchema.partial();

export type AllocationUpdateValues = z.infer<typeof allocationUpdateSchema>;
