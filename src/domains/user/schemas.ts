import { z } from 'zod';
import { USER_MESSAGES } from './user.text-map';

/**
 * Update Display Name Schema
 */
export const updateNameSchema = z.object({
  name: z
    .string()
    .min(2, USER_MESSAGES.ERROR.NAME_TOO_SHORT)
    .max(50, USER_MESSAGES.ERROR.NAME_TOO_LONG)
    .trim()
});

export type UpdateNameFormValues = z.infer<typeof updateNameSchema>;

/**
 * Change Password Schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, USER_MESSAGES.ERROR.PASSWORD_REQUIRED),
    newPassword: z
      .string()
      .min(8, USER_MESSAGES.ERROR.PASSWORD_TOO_SHORT)
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string()
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: USER_MESSAGES.ERROR.PASSWORD_MISMATCH,
    path: ['confirmPassword']
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Delete Account Schema
 */
export const deleteAccountSchema = z.object({
  confirmation: z.string().refine(val => val === 'ELIMINAR', {
    message: USER_MESSAGES.DELETE.MISMATCH_ERROR
  })
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

/**
 * Password Strength Calculator
 */
export type PasswordStrength =
  | 'weak'
  | 'fair'
  | 'good'
  | 'strong'
  | 'very_strong';

export function calculatePasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
} {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
  }

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const lengthBonus = password.length >= 12 ? 1 : 0;
  const score = metRequirements + lengthBonus;

  let strength: PasswordStrength;
  if (score <= 2) strength = 'weak';
  else if (score === 3) strength = 'fair';
  else if (score === 4) strength = 'good';
  else if (score === 5) strength = 'strong';
  else strength = 'very_strong';

  return {
    strength,
    score: Math.min((score / 6) * 100, 100),
    requirements
  };
}
