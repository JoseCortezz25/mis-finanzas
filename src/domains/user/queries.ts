'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Get profile from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Get user profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}
