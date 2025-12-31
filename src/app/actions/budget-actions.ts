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
 */
export async function createBudget(data: Omit<BudgetInsert, 'user_id'>) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.create(data, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Update an existing budget
 */
export async function updateBudget(id: string, data: Partial<BudgetInsert>) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.update(id, data, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
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
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    await repository.delete(id, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true };
  } catch (error) {
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
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new BudgetRepository(supabase);
    const budget = await repository.updateStatus(id, status, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
