'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { BudgetRepository, type BudgetInsert } from '@/lib/repositories';
import {
  getUserFriendlyError,
  ERROR_MESSAGES
} from '@/lib/errors/error-messages';

/**
 * Create a new budget
 * Budget amount is computed dynamically from assigned income transactions
 */
export async function createBudget(data: Omit<BudgetInsert, 'user_id'>) {
  console.log('[BUDGET] createBudget - Iniciando peticion:', data);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[BUDGET] createBudget - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.create(data, user.id);

    console.log('[BUDGET] createBudget - Exito:', budget);
    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    console.error('[BUDGET] createBudget - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Update an existing budget
 * Budget amount is computed dynamically and cannot be updated directly
 */
export async function updateBudget(id: string, data: Partial<BudgetInsert>) {
  console.log('[BUDGET] updateBudget - Iniciando peticion:', { id, data });
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[BUDGET] updateBudget - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.update(id, data, user.id);

    console.log('[BUDGET] updateBudget - Exito:', budget);
    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    console.error('[BUDGET] updateBudget - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Delete a budget
 */
export async function deleteBudget(id: string) {
  console.log('[BUDGET] deleteBudget - Iniciando peticion:', id);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[BUDGET] deleteBudget - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    await repository.delete(id, user.id);

    console.log('[BUDGET] deleteBudget - Exito');
    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true };
  } catch (error) {
    console.error('[BUDGET] deleteBudget - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Update budget status
 */
export async function updateBudgetStatus(
  id: string,
  status: 'draft' | 'active' | 'closed'
) {
  console.log('[BUDGET] updateBudgetStatus - Iniciando peticion:', {
    id,
    status
  });
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[BUDGET] updateBudgetStatus - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.updateStatus(id, status, user.id);

    console.log('[BUDGET] updateBudgetStatus - Exito:', budget);
    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    console.error('[BUDGET] updateBudgetStatus - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
