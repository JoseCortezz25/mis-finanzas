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
  console.log('[CATEGORY] createCategory - Iniciando peticion:', data);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[CATEGORY] createCategory - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);

    const exists = await repository.existsByName(data.name, user.id);
    if (exists) {
      console.log(
        '[CATEGORY] createCategory - Categoria ya existe:',
        data.name
      );
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

    console.log('[CATEGORY] createCategory - Exito:', category);
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true, data: category };
  } catch (error) {
    console.error('[CATEGORY] createCategory - Error:', error);
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
  console.log('[CATEGORY] updateCategory - Iniciando peticion:', { id, data });
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[CATEGORY] updateCategory - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);

    if (data.name) {
      const exists = await repository.existsByName(data.name, user.id);
      if (exists) {
        console.log(
          '[CATEGORY] updateCategory - Categoria ya existe:',
          data.name
        );
        return {
          success: false,
          error: ERROR_MESSAGES.CATEGORY_NAME_EXISTS
        };
      }
    }

    const category = await repository.update(id, data, user.id);

    console.log('[CATEGORY] updateCategory - Exito:', category);
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true, data: category };
  } catch (error) {
    console.error('[CATEGORY] updateCategory - Error:', error);
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
  console.log('[CATEGORY] deleteCategory - Iniciando peticion:', id);
  try {
    const supabase = await createServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[CATEGORY] deleteCategory - Usuario no autenticado');
      return { success: false, error: ERROR_MESSAGES.AUTH_REQUIRED };
    }

    const repository = new CategoryRepository(supabase);
    await repository.delete(id, user.id);

    console.log('[CATEGORY] deleteCategory - Exito');
    revalidatePath('/dashboard');
    revalidatePath('/movimientos');

    return { success: true };
  } catch (error) {
    console.error('[CATEGORY] deleteCategory - Error:', error);
    return {
      success: false,
      error: getUserFriendlyError(error)
    };
  }
}
