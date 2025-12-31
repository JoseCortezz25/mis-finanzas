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
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    const transaction = await repository.create(data, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true, data: transaction };
  } catch (error) {
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
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    const transaction = await repository.update(id, data, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true, data: transaction };
  } catch (error) {
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
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new TransactionRepository(supabase);
    await repository.delete(id, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');
    revalidatePath('/reportes');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
