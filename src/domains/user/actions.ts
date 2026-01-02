'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import {
  updateNameSchema,
  changePasswordSchema,
  deleteAccountSchema
} from './schemas';
import { USER_MESSAGES } from './user.text-map';

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Update user display name
 */
export async function updateDisplayName(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();

    // Validate session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'No autenticado'
      };
    }

    // Validate input
    const name = formData.get('name') as string;
    const validation = updateNameSchema.safeParse({ name });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message
      };
    }

    // Update display name
    const { error: updateError } = await supabase
      .from('users')
      // @ts-expect-error - Supabase type inference issue with users table
      .update({
        display_name: validation.data.name, // eslint-disable-line camelcase
        updated_at: new Date().toISOString() // eslint-disable-line camelcase
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update display name error:', updateError);
      return {
        success: false,
        error: USER_MESSAGES.ERROR.NAME_UPDATE_FAILED
      };
    }

    revalidatePath('/perfil');

    return {
      success: true
    };
  } catch (error) {
    console.error('Update display name error:', error);
    return {
      success: false,
      error: USER_MESSAGES.ERROR.UNKNOWN_ERROR
    };
  }
}

/**
 * Change user password
 * Requires current password verification
 * Signs out user after successful change
 */
export async function changePassword(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();

    // Validate session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'No autenticado'
      };
    }

    // Validate input
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message
      };
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return {
        success: false,
        error: USER_MESSAGES.ERROR.CURRENT_PASSWORD_WRONG
      };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Change password error:', updateError);
      return {
        success: false,
        error: USER_MESSAGES.ERROR.PASSWORD_CHANGE_FAILED
      };
    }

    // Sign out (force re-authentication)
    await supabase.auth.signOut();

    return {
      success: true
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      success: false,
      error: USER_MESSAGES.ERROR.UNKNOWN_ERROR
    };
  }
}

/**
 * Delete user account (soft delete)
 * Requires confirmation text "ELIMINAR"
 * Signs out user and redirects to login
 */
export async function deleteAccount(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();

    // Validate session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'No autenticado'
      };
    }

    // Validate confirmation
    const confirmation = formData.get('confirmation') as string;
    const validation = deleteAccountSchema.safeParse({ confirmation });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message
      };
    }

    // Soft delete user
    const { error: deleteError } = await supabase
      .from('users')
      // @ts-expect-error - Supabase type inference issue with users table
      .update({
        deleted_at: new Date().toISOString() // eslint-disable-line camelcase
      })
      .eq('id', user.id);

    if (deleteError) {
      console.error('Delete account error:', deleteError);
      return {
        success: false,
        error: USER_MESSAGES.ERROR.DELETE_FAILED
      };
    }

    // Sign out
    await supabase.auth.signOut();

    // Redirect to login
    redirect('/auth/login');
  } catch (error) {
    console.error('Delete account error:', error);
    return {
      success: false,
      error: USER_MESSAGES.ERROR.UNKNOWN_ERROR
    };
  }
}
