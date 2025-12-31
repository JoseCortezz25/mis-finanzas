'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository, type CategoryInsert } from '@/lib/repositories';
import {
  getUserFriendlyError,
  ERROR_MESSAGES
} from '@/lib/errors/error-messages';

/**
 * Create a new custom category
 */
export async function createCategory(
  data: Omit<CategoryInsert, 'user_id' | 'is_custom'>
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);

    // Check if category name already exists
    const exists = await repository.existsByName(data.name, user.id);
    if (exists) {
      return {
        success: false,
        error: ERROR_MESSAGES.CATEGORY_NAME_EXISTS
      };
    }

    const category = await repository.create(
      {
        ...data,
        is_custom: true
      },
      user.id
    );

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true, data: category };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Update a custom category
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryInsert>
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);

    // Check if new name already exists
    if (data.name) {
      const exists = await repository.existsByName(data.name, user.id);
      if (exists) {
        return {
          success: false,
          error: ERROR_MESSAGES.CATEGORY_NAME_EXISTS
        };
      }
    }

    const category = await repository.update(id, data, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true, data: category };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}

/**
 * Delete a custom category
 */
export async function deleteCategory(id: string) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);
    await repository.delete(id, user.id);

    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
