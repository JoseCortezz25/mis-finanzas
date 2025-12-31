import { SupabaseRepository } from '@/lib/supabase/base-repository';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

/**
 * Budget Repository
 * Handles all budget-related database operations
 */
export class BudgetRepository extends SupabaseRepository<Budget> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'budgets');
  }

  /**
   * Find budget by month and year
   * @param userId - User ID
   * @param month - Month (1-12)
   * @param year - Year (YYYY)
   * @returns Budget or null if not found
   */
  async findByMonthYear(
    userId: string,
    month: number,
    year: number
  ): Promise<Budget | null> {
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  /**
   * Find all active budgets for a user
   * @param userId - User ID
   * @returns Array of active budgets
   */
  async findActive(userId: string): Promise<Budget[]> {
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Find budgets by year
   * @param userId - User ID
   * @param year - Year (YYYY)
   * @returns Array of budgets
   */
  async findByYear(userId: string, year: number): Promise<Budget[]> {
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get current active budget (current month/year)
   * @param userId - User ID
   * @returns Current budget or null
   */
  async findCurrent(userId: string): Promise<Budget | null> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return this.findByMonthYear(userId, month, year);
  }

  /**
   * Update budget status
   * @param id - Budget ID
   * @param status - New status
   * @param userId - User ID for security check
   * @returns Updated budget
   */
  async updateStatus(
    id: string,
    status: 'draft' | 'active' | 'closed',
    userId: string
  ): Promise<Budget> {
    return this.update(id, { status }, userId);
  }

  /**
   * Get budget statistics
   * @param userId - User ID
   * @returns Budget statistics
   */
  async getStats(userId: string): Promise<{
    total: number;
    active: number;
    draft: number;
    closed: number;
  }> {
    const { data, error } = await this.supabase
      .from('budgets')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      active: data.filter(b => b.status === 'active').length,
      draft: data.filter(b => b.status === 'draft').length,
      closed: data.filter(b => b.status === 'closed').length
    };

    return stats;
  }
}
