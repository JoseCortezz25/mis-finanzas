/**
 * User-friendly error messages
 * Maps technical errors to safe, user-friendly messages
 */

export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_REQUIRED: 'Debes iniciar sesión para continuar',
  AUTH_INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  AUTH_USER_NOT_FOUND: 'No se encontró una cuenta con ese correo',
  AUTH_EMAIL_NOT_CONFIRMED: 'Por favor confirma tu correo electrónico',
  AUTH_WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  AUTH_EMAIL_EXISTS: 'Ya existe una cuenta con ese correo',

  // Budget errors
  BUDGET_CREATE_ERROR: 'No se pudo crear el presupuesto. Intenta de nuevo',
  BUDGET_UPDATE_ERROR: 'No se pudo actualizar el presupuesto',
  BUDGET_DELETE_ERROR: 'No se pudo eliminar el presupuesto',
  BUDGET_NOT_FOUND: 'Presupuesto no encontrado',
  BUDGET_DUPLICATE: 'Ya existe un presupuesto para ese mes y año',

  // Transaction errors
  TRANSACTION_CREATE_ERROR: 'No se pudo registrar el movimiento',
  TRANSACTION_UPDATE_ERROR: 'No se pudo actualizar el movimiento',
  TRANSACTION_DELETE_ERROR: 'No se pudo eliminar el movimiento',
  TRANSACTION_NOT_FOUND: 'Movimiento no encontrado',

  // Category errors
  CATEGORY_CREATE_ERROR: 'No se pudo crear la categoría',
  CATEGORY_UPDATE_ERROR: 'No se pudo actualizar la categoría',
  CATEGORY_DELETE_ERROR: 'No se pudo eliminar la categoría',
  CATEGORY_NOT_FOUND: 'Categoría no encontrada',
  CATEGORY_NAME_EXISTS: 'Ya existe una categoría con ese nombre',
  CATEGORY_IN_USE: 'No se puede eliminar porque tiene movimientos asociados',

  // Generic errors
  GENERIC_ERROR: 'Ocurrió un error inesperado. Por favor intenta de nuevo',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados',
  PERMISSION_DENIED: 'No tienes permiso para realizar esta acción',
  NOT_FOUND: 'No se encontró el recurso solicitado'
} as const;

/**
 * Get user-friendly error message
 * @param error - Error object or message
 * @returns User-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  // If it's already a user-friendly message from our constants, return it
  if (typeof error === 'string') {
    const errorMessages = Object.values(ERROR_MESSAGES) as readonly string[];
    if (errorMessages.includes(error)) {
      return error;
    }
  }

  // Map common Supabase/PostgreSQL errors
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as { code: string; message?: string };

    switch (pgError.code) {
      case '23505': // unique_violation
        if (pgError.message?.includes('budgets_user_id_month_year_key')) {
          return ERROR_MESSAGES.BUDGET_DUPLICATE;
        }
        if (pgError.message?.includes('categories')) {
          return ERROR_MESSAGES.CATEGORY_NAME_EXISTS;
        }
        return ERROR_MESSAGES.VALIDATION_ERROR;

      case '23503': // foreign_key_violation
        return ERROR_MESSAGES.NOT_FOUND;

      case '23514': // check_violation
        return ERROR_MESSAGES.VALIDATION_ERROR;

      case 'PGRST116': // not found
        return ERROR_MESSAGES.NOT_FOUND;

      case '42501': // insufficient_privilege
        return ERROR_MESSAGES.PERMISSION_DENIED;

      default:
        // Don't expose technical error codes
        console.error('Database error:', pgError);
        return ERROR_MESSAGES.GENERIC_ERROR;
    }
  }

  // Map Supabase Auth errors
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message.toLowerCase();

    if (message.includes('invalid login credentials')) {
      return ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS;
    }
    if (message.includes('email not confirmed')) {
      return ERROR_MESSAGES.AUTH_EMAIL_NOT_CONFIRMED;
    }
    if (message.includes('user already registered')) {
      return ERROR_MESSAGES.AUTH_EMAIL_EXISTS;
    }
    if (message.includes('password')) {
      return ERROR_MESSAGES.AUTH_WEAK_PASSWORD;
    }
  }

  // Log the actual error for debugging (server-side only)
  if (typeof window === 'undefined') {
    console.error('Unhandled error:', error);
  }

  // Return generic message to user
  return ERROR_MESSAGES.GENERIC_ERROR;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const err = error as { message?: string; name?: string };
    return (
      err.name === 'NetworkError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('network')
    );
  }
  return false;
}
