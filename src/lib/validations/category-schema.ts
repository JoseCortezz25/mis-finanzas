import { z } from 'zod';

/**
 * Category validation schema
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (ej: #FF5733)'
    ),
  icon: z
    .string()
    .min(1, 'El ícono es requerido')
    .max(50, 'El ícono no puede exceder 50 caracteres'),
  is_custom: z.boolean().default(true)
});

/**
 * Category update schema (all fields optional)
 */
export const categoryUpdateSchema = categorySchema.partial();

/**
 * Category form schema (excludes is_custom for creation)
 */
export const categoryFormSchema = categorySchema.omit({ is_custom: true });

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type CategoryUpdateValues = z.infer<typeof categoryUpdateSchema>;
