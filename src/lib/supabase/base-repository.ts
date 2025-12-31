import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

type TableName = keyof Database['public']['Tables'];

/**
 * Base repository providing common CRUD operations for Supabase tables
 * All domain repositories should extend this class
 *
 * @template T - The entity type
 * @template TName - The table name from Database schema
 */
export abstract class SupabaseRepository<
  T,
  TName extends TableName = TableName
> {
  constructor(
    protected supabase: SupabaseClient<Database>,
    protected tableName: TName
  ) {}

  /**
   * Find all records for a user
   * @param userId - User ID to filter by
   * @returns Array of records
   */
  async findAll(userId: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as T[]) || [];
  }

  /**
   * Find a single record by ID
   * @param id - Record ID
   * @param userId - User ID for security check
   * @returns Record or null if not found
   */
  async findById(id: string, userId: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('id', id)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as T;
  }

  /**
   * Create a new record
   * @param data - Record data (without id, created_at, updated_at)
   * @param userId - User ID to associate the record with
   * @returns Created record
   */
  async create(data: Partial<T>, userId: string): Promise<T> {
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      // @ts-expect-error - Generic type limitation with Supabase
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return created as T;
  }

  /**
   * Update an existing record
   * @param id - Record ID
   * @param data - Partial record data to update
   * @param userId - User ID for security check
   * @returns Updated record
   */
  async update(id: string, data: Partial<T>, userId: string): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      // @ts-expect-error - Generic type limitation with Supabase
      .update(data)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('id', id)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return updated as T;
  }

  /**
   * Delete a record
   * @param id - Record ID
   * @param userId - User ID for security check
   */
  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('id', id)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Count records for a user
   * @param userId - User ID to filter by
   * @returns Number of records
   */
  async count(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }
}
