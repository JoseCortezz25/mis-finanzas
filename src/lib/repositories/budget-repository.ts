import { SupabaseRepository } from '@/lib/supabase/base-repository';
import { type SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

/**
 * Budget with computed amount from income transactions
 * This type extends Budget with a dynamically calculated total_amount
 */
export interface BudgetWithAmount extends Budget {
  total_amount: number; // Computed: SUM(transactions WHERE budget_id AND type='income')
}

/**
 * Budget Repository
 * Handles all budget-related database operations
 */
export class BudgetRepository extends SupabaseRepository<Budget, 'budgets'> {
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
    console.log('[BUDGET-REPO] findByMonthYear - Buscando:', {
      userId,
      month,
      year
    });
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('[BUDGET-REPO] findByMonthYear - No encontrado');
        return null;
      }
      console.error('[BUDGET-REPO] findByMonthYear - Error:', error);
      throw error;
    }

    console.log('[BUDGET-REPO] findByMonthYear - Exito:', data);
    return data;
  }

  /**
   * Find all active budgets for a user
   * @param userId - User ID
   * @returns Array of active budgets
   */
  async findActive(userId: string): Promise<Budget[]> {
    console.log(
      '[BUDGET-REPO] findActive - Buscando presupuestos activos:',
      userId
    );
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      console.error('[BUDGET-REPO] findActive - Error:', error);
      throw error;
    }
    console.log(
      '[BUDGET-REPO] findActive - Exito:',
      data?.length || 0,
      'presupuestos'
    );
    return data || [];
  }

  /**
   * Find budgets by year
   * @param userId - User ID
   * @param year - Year (YYYY)
   * @returns Array of budgets
   */
  async findByYear(userId: string, year: number): Promise<Budget[]> {
    console.log('[BUDGET-REPO] findByYear - Buscando presupuestos por año:', {
      userId,
      year
    });
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .order('month', { ascending: false });

    if (error) {
      console.error('[BUDGET-REPO] findByYear - Error:', error);
      throw error;
    }
    console.log(
      '[BUDGET-REPO] findByYear - Exito:',
      data?.length || 0,
      'presupuestos'
    );
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
    console.log('[BUDGET-REPO] getStats - Obteniendo estadisticas:', userId);
    const { data, error } = await this.supabase
      .from('budgets')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('[BUDGET-REPO] getStats - Error:', error);
      throw error;
    }

    const budgets = (data || []) as Array<{
      status: 'draft' | 'active' | 'closed';
    }>;

    const stats = {
      total: budgets.length,
      active: budgets.filter(b => b.status === 'active').length,
      draft: budgets.filter(b => b.status === 'draft').length,
      closed: budgets.filter(b => b.status === 'closed').length
    };

    console.log('[BUDGET-REPO] getStats - Exito:', stats);
    return stats;
  }

  // ============================================================
  // COMPUTED AMOUNT METHODS
  // Methods for calculating budget amounts dynamically from income transactions
  // ============================================================

  /**
   * Calculate total amount for a budget from income transactions
   * @param budgetId - Budget ID
   * @param userId - User ID for security
   * @returns Computed budget amount
   */
  async calculateBudgetAmount(
    budgetId: string,
    userId: string
  ): Promise<number> {
    console.log('[BUDGET-REPO] calculateBudgetAmount:', { budgetId, userId });

    const { data, error } = await this.supabase
      .from('transactions')
      .select('amount')
      .eq('budget_id', budgetId)
      .eq('user_id', userId)
      .eq('type', 'income');

    if (error) {
      console.error('[BUDGET-REPO] calculateBudgetAmount - Error:', error);
      throw error;
    }

    const transactions = (data || []) as Array<{ amount: number }>;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log('[BUDGET-REPO] calculateBudgetAmount - Result:', total);
    return total;
  }

  /**
   * Find budget by ID with computed amount
   * @param id - Budget ID
   * @param userId - User ID for security
   * @returns Budget with computed total_amount
   */
  async findByIdWithAmount(
    id: string,
    userId: string
  ): Promise<BudgetWithAmount | null> {
    console.log('[BUDGET-REPO] findByIdWithAmount:', { id, userId });

    const budget = await this.findById(id, userId);
    if (!budget) return null;

    const total_amount = await this.calculateBudgetAmount(id, userId);

    return {
      ...budget,
      total_amount
    };
  }

  /**
   * Find all budgets for user with computed amounts
   * Optimized to avoid N+1 queries
   * @param userId - User ID
   * @returns Array of budgets with computed amounts
   */
  async findAllWithAmounts(userId: string): Promise<BudgetWithAmount[]> {
    console.log('[BUDGET-REPO] findAllWithAmounts:', userId);

    // Fetch all budgets
    const budgets = await this.findAll(userId);

    if (budgets.length === 0) return [];

    // Fetch all income transactions for user in one query
    const { data: transactionsData, error } = await this.supabase
      .from('transactions')
      .select('budget_id, amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .not('budget_id', 'is', null);

    if (error) {
      console.error('[BUDGET-REPO] findAllWithAmounts - Error:', error);
      throw error;
    }

    // Group transactions by budget_id and sum amounts
    const transactions = (transactionsData || []) as Array<{
      budget_id: string;
      amount: number;
    }>;
    const budgetAmounts = new Map<string, number>();
    transactions.forEach(t => {
      const current = budgetAmounts.get(t.budget_id) || 0;
      budgetAmounts.set(t.budget_id, current + t.amount);
    });

    // Attach computed amounts to budgets
    const budgetsWithAmounts: BudgetWithAmount[] = budgets.map(budget => ({
      ...budget,
      total_amount: budgetAmounts.get(budget.id) || 0
    }));

    console.log(
      '[BUDGET-REPO] findAllWithAmounts - Success:',
      budgetsWithAmounts.length
    );
    return budgetsWithAmounts;
  }

  /**
   * Find active budgets with computed amounts
   * @param userId - User ID
   * @returns Array of active budgets with amounts
   */
  async findActiveWithAmounts(userId: string): Promise<BudgetWithAmount[]> {
    console.log('[BUDGET-REPO] findActiveWithAmounts:', userId);

    const allBudgetsWithAmounts = await this.findAllWithAmounts(userId);

    return allBudgetsWithAmounts.filter(b => b.status === 'active');
  }

  /**
   * Find budget by month/year with computed amount
   * @param userId - User ID
   * @param month - Month (1-12)
   * @param year - Year
   * @returns Budget with computed amount or null
   */
  async findByMonthYearWithAmount(
    userId: string,
    month: number,
    year: number
  ): Promise<BudgetWithAmount | null> {
    console.log('[BUDGET-REPO] findByMonthYearWithAmount:', {
      userId,
      month,
      year
    });

    const budget = await this.findByMonthYear(userId, month, year);
    if (!budget) return null;

    const total_amount = await this.calculateBudgetAmount(budget.id, userId);

    return {
      ...budget,
      total_amount
    };
  }
}
