'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { allocationSchema } from '@/lib/validations/allocation-schema';
import { TransactionRepository } from '@/lib/repositories/transaction-repository';
import {
  getUserFriendlyError,
  ERROR_MESSAGES
} from '@/lib/errors/error-messages';

/**
 * Create a new allocation
 * Allocations are virtual assignments from general fund to specific budgets
 *
 * @param input - Allocation data (amount, budget_id, category_id, date, description)
 * @returns Success/error result with created allocation data
 */
export async function createAllocation(input: unknown) {
  console.log('[ALLOCATION-ACTIONS] createAllocation - Start:', input);

  try {
    // ✅ 1. Session validation (MANDATORY)
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('[ALLOCATION-ACTIONS] createAllocation - No session');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    // ✅ 2. Input validation with Zod
    const validationResult = allocationSchema.safeParse(input);
    if (!validationResult.success) {
      console.error(
        '[ALLOCATION-ACTIONS] createAllocation - Validation failed:',
        validationResult.error.errors
      );
      return {
        success: false,
        error: 'Datos inválidos',
        details: validationResult.error.errors
      };
    }

    const validatedInput = validationResult.data;
    console.log(
      '[ALLOCATION-ACTIONS] createAllocation - Validated input:',
      validatedInput
    );

    // ✅ 3. Verify budget ownership
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('id')
      .eq('id', validatedInput.budget_id)
      .eq('user_id', user.id)
      .single();

    if (budgetError || !budget) {
      console.error(
        '[ALLOCATION-ACTIONS] createAllocation - Budget not found or not owned:',
        budgetError
      );
      return { success: false, error: 'Presupuesto no encontrado' };
    }

    // ✅ 4. Verify category exists and belongs to user
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', validatedInput.category_id)
      .eq('user_id', user.id)
      .single();

    if (categoryError || !category) {
      console.error(
        '[ALLOCATION-ACTIONS] createAllocation - Category not found or not owned:',
        categoryError
      );
      return { success: false, error: 'Categoría no encontrada' };
    }

    // ✅ 5. Create allocation transaction
    const repository = new TransactionRepository(supabase);

    const allocation = await repository.create(
      {
        type: 'allocation',
        amount: validatedInput.amount,
        budget_id: validatedInput.budget_id,
        category_id: validatedInput.category_id,
        date: validatedInput.date,
        description: validatedInput.description || null,
        payment_method: null,
        notes: null
      },
      user.id
    );

    console.log('[ALLOCATION-ACTIONS] createAllocation - Success:', allocation);

    // Revalidate paths to update UI
    revalidatePath('/home');
    revalidatePath(`/budgets/${validatedInput.budget_id}`);

    return { success: true, data: allocation };
  } catch (error) {
    console.error('[ALLOCATION-ACTIONS] createAllocation - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Delete an allocation
 *
 * @param allocationId - ID of the allocation to delete
 * @returns Success/error result
 */
export async function deleteAllocation(allocationId: string) {
  console.log('[ALLOCATION-ACTIONS] deleteAllocation - Start:', allocationId);

  try {
    // ✅ 1. Session validation
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('[ALLOCATION-ACTIONS] deleteAllocation - No session');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    // ✅ 2. Verify allocation exists, belongs to user, and is type 'allocation'
    const { data: allocation, error: fetchError } = await supabase
      .from('transactions')
      .select('id, type, budget_id')
      .eq('id', allocationId)
      .eq('user_id', user.id)
      .eq('type', 'allocation')
      .single();

    if (fetchError || !allocation) {
      console.error(
        '[ALLOCATION-ACTIONS] deleteAllocation - Allocation not found or not owned:',
        fetchError
      );
      return { success: false, error: 'Asignación no encontrada' };
    }

    console.log(
      '[ALLOCATION-ACTIONS] deleteAllocation - Found allocation:',
      allocation
    );

    // ✅ 3. Delete allocation
    const repository = new TransactionRepository(supabase);
    await repository.delete(allocationId, user.id);

    console.log('[ALLOCATION-ACTIONS] deleteAllocation - Success');

    // Revalidate paths to update UI
    revalidatePath('/home');
    revalidatePath(`/budgets/${allocation.budget_id}`);

    return { success: true };
  } catch (error) {
    console.error('[ALLOCATION-ACTIONS] deleteAllocation - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
