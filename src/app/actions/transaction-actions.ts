'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import {
  TransactionRepository,
  type TransactionInsert
} from '@/lib/repositories';
import {
  getUserFriendlyError,
  ERROR_MESSAGES
} from '@/lib/errors/error-messages';

/**
 * Create a new transaction
 */
export async function createTransaction(
  data: Omit<TransactionInsert, 'user_id'>
) {
  console.log('[TRANSACTION] createTransaction - Iniciando peticion:', data);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[TRANSACTION] createTransaction - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    const transaction = await repository.create(data, user.id);

    console.log('[TRANSACTION] createTransaction - Exito:', transaction);
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true, data: transaction };
  } catch (error) {
    console.error('[TRANSACTION] createTransaction - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(
  id: string,
  data: Partial<TransactionInsert>
) {
  console.log('[TRANSACTION] updateTransaction - Iniciando peticion:', {
    id,
    data
  });
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[TRANSACTION] updateTransaction - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    const transaction = await repository.update(id, data, user.id);

    console.log('[TRANSACTION] updateTransaction - Exito:', transaction);
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true, data: transaction };
  } catch (error) {
    console.error('[TRANSACTION] updateTransaction - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string) {
  console.log('[TRANSACTION] deleteTransaction - Iniciando peticion:', id);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[TRANSACTION] deleteTransaction - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    await repository.delete(id, user.id);

    console.log('[TRANSACTION] deleteTransaction - Exito');
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true };
  } catch (error) {
    console.error('[TRANSACTION] deleteTransaction - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
