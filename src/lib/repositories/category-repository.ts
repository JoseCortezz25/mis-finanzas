import { SupabaseRepository } from '@/lib/supabase/base-repository';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert =
  Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate =
  Database['public']['Tables']['categories']['Update'];

/**
 * Category Repository
 * Handles all category-related database operations
 */
export class CategoryRepository extends SupabaseRepository<
  Category,
  'categories'
> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'categories');
  }

  /**
   * Find all default (non-custom) categories
   * @returns Array of default categories
   */
  async findDefault(): Promise<Category[]> {
    console.log(
      '[CATEGORY-REPO] findDefault - Obteniendo categorias por defecto'
    );
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_custom', false)
      .order('name', { ascending: true });

    if (error) {
      console.error('[CATEGORY-REPO] findDefault - Error:', error);
      throw error;
    }
    console.log(
      '[CATEGORY-REPO] findDefault - Exito:',
      data?.length || 0,
      'categorias'
    );
    return data || [];
  }

  /**
   * Find all custom categories for a user
   * @param userId - User ID
   * @returns Array of custom categories
   */
  async findCustom(userId: string): Promise<Category[]> {
    console.log(
      '[CATEGORY-REPO] findCustom - Obteniendo categorias personalizadas:',
      userId
    );
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_custom', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('[CATEGORY-REPO] findCustom - Error:', error);
      throw error;
    }
    console.log(
      '[CATEGORY-REPO] findCustom - Exito:',
      data?.length || 0,
      'categorias'
    );
    return data || [];
  }

  /**
   * Find all available categories for a user (default + custom)
   * @param userId - User ID
   * @returns Array of categories
   */
  async findAvailable(userId: string): Promise<Category[]> {
    console.log(
      '[CATEGORY-REPO] findAvailable - Obteniendo categorias disponibles:',
      userId
    );
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${userId},is_custom.eq.false`)
      .order('is_custom', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('[CATEGORY-REPO] findAvailable - Error:', error);
      throw error;
    }
    console.log(
      '[CATEGORY-REPO] findAvailable - Exito:',
      data?.length || 0,
      'categorias'
    );
    return data || [];
  }

  /**
   * Find category by name
   * @param name - Category name
   * @param userId - User ID (optional, for custom categories)
   * @returns Category or null
   */
  async findByName(name: string, userId?: string): Promise<Category | null> {
    console.log('[CATEGORY-REPO] findByName - Buscando categoria:', {
      name,
      userId
    });
    let query = this.supabase.from('categories').select('*').eq('name', name);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('is_custom', false);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('[CATEGORY-REPO] findByName - No encontrada');
        return null;
      }
      console.error('[CATEGORY-REPO] findByName - Error:', error);
      throw error;
    }

    console.log('[CATEGORY-REPO] findByName - Exito:', data);
    return data;
  }

  /**
   * Check if a custom category name already exists for a user
   * @param name - Category name
   * @param userId - User ID
   * @returns True if exists, false otherwise
   */
  async existsByName(name: string, userId: string): Promise<boolean> {
    const category = await this.findByName(name, userId);
    return category !== null;
  }

  /**
   * Get category statistics
   * @param userId - User ID
   * @returns Category statistics
   */
  async getStats(userId: string): Promise<{
    total: number;
    custom: number;
    default: number;
  }> {
    console.log('[CATEGORY-REPO] getStats - Obteniendo estadisticas:', userId);
    const [custom, defaultCategories] = await Promise.all([
      this.findCustom(userId),
      this.findDefault()
    ]);

    const stats = {
      total: custom.length + defaultCategories.length,
      custom: custom.length,
      default: defaultCategories.length
    };

    console.log('[CATEGORY-REPO] getStats - Exito:', stats);
    return stats;
  }
}
