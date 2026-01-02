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
    console.log(
      `[REPO-BASE] findAll - Obteniendo todos los registros de ${String(this.tableName)}:`,
      userId
    );
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        `[REPO-BASE] findAll - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }
    console.log(
      `[REPO-BASE] findAll - Exito en ${String(this.tableName)}:`,
      data?.length || 0,
      'registros'
    );
    return (data as T[]) || [];
  }

  /**
   * Find a single record by ID
   * @param id - Record ID
   * @param userId - User ID for security check
   * @returns Record or null if not found
   */
  async findById(id: string, userId: string): Promise<T | null> {
    console.log(
      `[REPO-BASE] findById - Buscando en ${String(this.tableName)}:`,
      { id, userId }
    );
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('id', id)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(
          `[REPO-BASE] findById - No encontrado en ${String(this.tableName)}`
        );
        return null;
      }
      console.error(
        `[REPO-BASE] findById - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }

    console.log(
      `[REPO-BASE] findById - Exito en ${String(this.tableName)}:`,
      data
    );
    return data as T;
  }

  /**
   * Create a new record
   * @param data - Record data (without id, created_at, updated_at)
   * @param userId - User ID to associate the record with
   * @returns Created record
   */
  async create(data: Partial<T>, userId: string): Promise<T> {
    console.log(`[REPO-BASE] create - Creando en ${String(this.tableName)}:`, {
      data,
      userId
    });
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      // @ts-expect-error - Generic type limitation with Supabase
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error(
        `[REPO-BASE] create - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }
    console.log(
      `[REPO-BASE] create - Exito en ${String(this.tableName)}:`,
      created
    );
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
    console.log(
      `[REPO-BASE] update - Actualizando en ${String(this.tableName)}:`,
      { id, data, userId }
    );
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

    if (error) {
      console.error(
        `[REPO-BASE] update - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }
    console.log(
      `[REPO-BASE] update - Exito en ${String(this.tableName)}:`,
      updated
    );
    return updated as T;
  }

  /**
   * Delete a record
   * @param id - Record ID
   * @param userId - User ID for security check
   */
  async delete(id: string, userId: string): Promise<void> {
    console.log(
      `[REPO-BASE] delete - Eliminando en ${String(this.tableName)}:`,
      { id, userId }
    );
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('id', id)
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId);

    if (error) {
      console.error(
        `[REPO-BASE] delete - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }
    console.log(`[REPO-BASE] delete - Exito en ${String(this.tableName)}`);
  }

  /**
   * Count records for a user
   * @param userId - User ID to filter by
   * @returns Number of records
   */
  async count(userId: string): Promise<number> {
    console.log(
      `[REPO-BASE] count - Contando en ${String(this.tableName)}:`,
      userId
    );
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      // @ts-expect-error - Generic type limitation with Supabase
      .eq('user_id', userId);

    if (error) {
      console.error(
        `[REPO-BASE] count - Error en ${String(this.tableName)}:`,
        error
      );
      throw error;
    }
    console.log(
      `[REPO-BASE] count - Exito en ${String(this.tableName)}:`,
      count || 0
    );
    return count || 0;
  }
}
