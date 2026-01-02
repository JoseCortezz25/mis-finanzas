import { SupabaseRepository } from '@/lib/supabase/base-repository';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert =
  Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate =
  Database['public']['Tables']['transactions']['Update'];

/**
 * Transaction Repository
 * Handles all transaction-related database operations
 */
export class TransactionRepository extends SupabaseRepository<
  Transaction,
  'transactions'
> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, 'transactions');
  }

  /**
   * Find transactions by budget ID
   * @param budgetId - Budget ID
   * @param userId - User ID for security check
   * @returns Array of transactions
   */
  async findByBudget(budgetId: string, userId: string): Promise<Transaction[]> {
    console.log(
      '[TRANSACTION-REPO] findByBudget - Buscando transacciones por presupuesto:',
      { budgetId, userId }
    );
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('budget_id', budgetId)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('[TRANSACTION-REPO] findByBudget - Error:', error);
      throw error;
    }
    console.log(
      '[TRANSACTION-REPO] findByBudget - Exito:',
      data?.length || 0,
      'transacciones'
    );
    return data || [];
  }

  /**
   * Find transactions by category ID
   * @param categoryId - Category ID
   * @param userId - User ID for security check
   * @returns Array of transactions
   */
  async findByCategory(
    categoryId: string,
    userId: string
  ): Promise<Transaction[]> {
    console.log(
      '[TRANSACTION-REPO] findByCategory - Buscando transacciones por categoria:',
      { categoryId, userId }
    );
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('category_id', categoryId)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('[TRANSACTION-REPO] findByCategory - Error:', error);
      throw error;
    }
    console.log(
      '[TRANSACTION-REPO] findByCategory - Exito:',
      data?.length || 0,
      'transacciones'
    );
    return data || [];
  }

  /**
   * Find transactions by date range
   * @param userId - User ID
   * @param startDate - Start date (ISO string)
   * @param endDate - End date (ISO string)
   * @returns Array of transactions
   */
  async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    console.log(
      '[TRANSACTION-REPO] findByDateRange - Buscando transacciones por rango de fechas:',
      { userId, startDate, endDate }
    );
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('[TRANSACTION-REPO] findByDateRange - Error:', error);
      throw error;
    }
    console.log(
      '[TRANSACTION-REPO] findByDateRange - Exito:',
      data?.length || 0,
      'transacciones'
    );
    return data || [];
  }

  /**
   * Find transactions by type (income/expense)
   * @param userId - User ID
   * @param type - Transaction type
   * @returns Array of transactions
   */
  async findByType(
    userId: string,
    type: 'income' | 'expense'
  ): Promise<Transaction[]> {
    console.log(
      '[TRANSACTION-REPO] findByType - Buscando transacciones por tipo:',
      { userId, type }
    );
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('date', { ascending: false });

    if (error) {
      console.error('[TRANSACTION-REPO] findByType - Error:', error);
      throw error;
    }
    console.log(
      '[TRANSACTION-REPO] findByType - Exito:',
      data?.length || 0,
      'transacciones'
    );
    return data || [];
  }

  /**
   * Get total income for a user
   * @param userId - User ID
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @returns Total income amount
   */
  async getTotalIncome(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    console.log(
      '[TRANSACTION-REPO] getTotalIncome - Obteniendo total de ingresos:',
      { userId, startDate, endDate }
    );
    let query = this.supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income');

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;

    if (error) {
      console.error('[TRANSACTION-REPO] getTotalIncome - Error:', error);
      throw error;
    }

    const transactions = (data || []) as Array<{ amount: number }>;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('[TRANSACTION-REPO] getTotalIncome - Exito:', total);
    return total;
  }

  /**
   * Get total expenses for a user
   * @param userId - User ID
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   * @returns Total expense amount
   */
  async getTotalExpenses(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    console.log(
      '[TRANSACTION-REPO] getTotalExpenses - Obteniendo total de gastos:',
      { userId, startDate, endDate }
    );
    let query = this.supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense');

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;

    if (error) {
      console.error('[TRANSACTION-REPO] getTotalExpenses - Error:', error);
      throw error;
    }

    const transactions = (data || []) as Array<{ amount: number }>;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('[TRANSACTION-REPO] getTotalExpenses - Exito:', total);
    return total;
  }

  /**
   * Get transaction statistics
   * @param userId - User ID
   * @returns Transaction statistics
   */
  async getStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    count: number;
  }> {
    console.log(
      '[TRANSACTION-REPO] getStats - Obteniendo estadisticas:',
      userId
    );
    const [income, expenses, count] = await Promise.all([
      this.getTotalIncome(userId),
      this.getTotalExpenses(userId),
      this.count(userId)
    ]);

    const stats = {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      count
    };

    console.log('[TRANSACTION-REPO] getStats - Exito:', stats);
    return stats;
  }
}
