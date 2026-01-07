# Budget Amount Removal - Domain Business Logic Plan

**Created**: 2026-01-06
**Session**: budget_amount_removal_1767754905
**Domain**: budget / transaction
**Complexity**: High

## 1. Business Context

### Problem Statement

Currently, budgets store a `total_amount` field which creates data redundancy and synchronization issues. The budget amount should be calculated dynamically from income transactions assigned to that budget, making it a computed property rather than a stored field.

### Business Goals

- **Primary Goal**: Eliminate data redundancy by removing stored `total_amount` from budgets
- **Secondary Goals**:
  - Ensure budget calculations remain performant with computed amounts
  - Maintain backward compatibility during migration
  - Simplify budget creation UX (no manual amount entry)
- **Success Metrics**:
  - All budget displays show correct computed amounts
  - No performance degradation in budget queries
  - Zero data inconsistencies between stored and computed amounts

### User Stories

**As a user**, I want budgets to automatically reflect the sum of my income transactions so that I don't have to manually update budget amounts.

**Acceptance Criteria**:
- [ ] Budget amount = SUM of all income transactions where `budget_id` matches
- [ ] Budget creation form no longer requires manual amount input
- [ ] Budget detail views show correct computed amounts
- [ ] Budget health calculations work with computed amounts
- [ ] Dashboard displays accurate budget metrics
- [ ] Migration preserves existing budget data integrity

## 2. Domain Model

### Core Entity: `Budget` (Modified)

**Purpose**: Container for organizing income and expense transactions with computed total amount

**TypeScript Interface** (AFTER changes):

```typescript
// src/lib/repositories/budget-repository.ts
export type Budget = Database['public']['Tables']['budgets']['Row'];
// After migration, this will NOT include total_amount

// Extended type with computed amount
export interface BudgetWithAmount extends Omit<Budget, 'total_amount'> {
  total_amount: number; // Computed from income transactions
}
```

**REMOVED Fields**:
- `total_amount`: number (⚠️ TO BE REMOVED - will be computed)

**KEPT Fields**:
- `id`: string (UUID)
- `user_id`: string (UUID)
- `name`: string
- `category`: string | null
- `month`: number | null (1-12)
- `year`: number | null (2000-2100)
- `status`: 'draft' | 'active' | 'closed'
- `created_at`: timestamp
- `updated_at`: timestamp

### Related Entities

- **Transaction**: Has `budget_id` field linking it to budgets
- **Category**: Optional visual categorization for budgets

### Value Objects

```typescript
// Budget amount is now a computed value object
export interface BudgetAmountCalculation {
  total_amount: number;        // SUM of income transactions
  income_count: number;         // Number of income transactions
  last_income_date: Date | null; // Most recent income transaction
}
```

## 3. Business Rules

### Validation Rules

1. **BR-BUD-001: Budget Amount Calculation**
   - Condition: Always when budget is queried
   - Action: Calculate `total_amount = SUM(transactions.amount WHERE budget_id = budget.id AND type = 'income')`
   - Error: N/A (calculation, not validation)

2. **BR-BUD-002: Zero Amount Budgets**
   - Condition: Budget has no income transactions
   - Action: `total_amount = 0`
   - Error: No error - valid state for new budgets

3. **BR-BUD-003: Budget Creation**
   - Condition: Creating new budget
   - Action: No longer requires `total_amount` input
   - Error: Validation error if `total_amount` is provided in creation payload

4. **BR-BUD-004: Budget Health Calculation Update**
   - Condition: Calculating budget health
   - Action: Use computed `total_amount` instead of stored value
   - Error: N/A

### Invariants (must always be true)

- Budget `total_amount` must equal SUM of related income transactions at all times
- Budget can exist with `total_amount = 0` (no income transactions assigned yet)
- Deleting income transactions must automatically update computed budget amount

### Business Constraints

- **Performance**: Budget amount calculation must not cause N+1 query problems
- **Consistency**: All views of budget must show same computed amount
- **Migration Safety**: Existing budgets must preserve their current total during migration

## 4. Zod Validation Schema

### Updated Budget Schema

```typescript
// src/lib/validations/budget-schema.ts

import { z } from 'zod';

/**
 * Budget validation schema (UPDATED - total_amount removed)
 * Budgets are flexible groups for organizing transactions
 */
export const budgetSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  category: z.string().nullable().optional(),
  // ❌ REMOVED: total_amount field
  month: z
    .number()
    .int('El mes debe ser un número entero')
    .min(1, 'El mes debe estar entre 1 y 12')
    .max(12, 'El mes debe estar entre 1 y 12')
    .nullable()
    .optional(),
  year: z
    .number()
    .int('El año debe ser un número entero')
    .min(2000, 'El año debe ser mayor o igual a 2000')
    .max(2100, 'El año debe ser menor o igual a 2100')
    .nullable()
    .optional(),
  status: z.enum(['draft', 'active', 'closed']).default('draft')
});

/**
 * Budget update schema (all fields optional)
 */
export const budgetUpdateSchema = budgetSchema.partial();

/**
 * Budget form schema (excludes status for creation)
 */
export const budgetFormSchema = budgetSchema.omit({ status: true });

// TypeScript types inferred from schemas
export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
export type BudgetUpdateValues = z.infer<typeof budgetUpdateSchema>;
```

### Migration Note

The schema MUST be updated AFTER the database migration is complete to avoid breaking existing code during the transition.

## 5. Use Cases / Business Operations

### Use Case 1: Create Budget (UPDATED)

**Actor**: Authenticated user
**Pre-conditions**: User has valid session
**Post-conditions**: Budget created with `total_amount = 0` (no income transactions yet)

**Business Logic Steps**:

1. Validate input using `budgetFormSchema` (NO `total_amount` field)
2. Verify user session (auth validation)
3. Create budget entity (without `total_amount`)
4. Return success with new budget
5. Budget displays with `total_amount = 0` until income transactions are added

**Server Action Location**: `src/app/actions/budget-actions.ts`

**Changes Required**:
- Remove `total_amount` from creation payload
- No validation for `total_amount`
- Form UI removes amount input field

### Use Case 2: Update Budget (UPDATED)

**Actor**: Authenticated user
**Pre-conditions**: Budget exists and user owns it
**Post-conditions**: Budget updated (without affecting computed amount)

**Business Logic Steps**:

1. Validate input using `budgetUpdateSchema`
2. Check budget exists
3. Verify user owns budget
4. Update budget fields (name, category, month, year, status)
5. Return updated budget with computed `total_amount`

**Changes Required**:
- Prevent `total_amount` from being updated manually
- Computed amount remains accurate

### Use Case 3: Get Budget with Amount (NEW)

**Actor**: System / User
**Pre-conditions**: Budget ID is valid
**Post-conditions**: Budget returned with computed `total_amount`

**Business Logic Steps**:

1. Fetch budget from database
2. Fetch all income transactions for this budget
3. Calculate `total_amount = SUM(transactions.amount WHERE budget_id = budget.id AND type = 'income')`
4. Return budget with computed amount

**Repository Method**: `budgetRepository.findByIdWithAmount(id, userId)`

### Use Case 4: Get All Budgets with Amounts (UPDATED)

**Actor**: User viewing dashboard or budget list
**Pre-conditions**: User has valid session
**Post-conditions**: All user's budgets returned with computed amounts

**Business Logic Steps**:

1. Fetch all user's budgets
2. Fetch all user's income transactions (in single query)
3. Group transactions by `budget_id`
4. Calculate amount for each budget
5. Return budgets with computed amounts

**Repository Method**: `budgetRepository.findAllWithAmounts(userId)`

**Performance Optimization**:
- Use JOIN or separate queries with grouping
- Avoid N+1 queries (fetch all transactions once)

### Use Case 5: Calculate Budget Health (UPDATED)

**Actor**: System (for UI display)
**Pre-conditions**: Budget and transactions are available
**Post-conditions**: Health status and metrics calculated

**Business Logic Steps**:

1. Get budget with computed `total_amount`
2. Get all budget transactions (income + expense)
3. Calculate:
   - `totalIncome = computed total_amount`
   - `totalSpent = SUM(expenses)`
   - `available = total_amount + totalIncome - totalSpent`
   - `percentageUsed = (totalSpent / total_amount) × 100`
4. Determine health status based on percentage

**Hook**: `useBudgetCalculations` (UPDATED)

**Changes Required**:
- Use computed `total_amount` instead of stored value
- Handle `total_amount = 0` case (prevent division by zero)

## 6. Repository Methods Design

### New Repository Methods

```typescript
// src/lib/repositories/budget-repository.ts

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

  const total = (data || []).reduce((sum, t) => sum + t.amount, 0);
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
  const { data: transactions, error } = await this.supabase
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
  const budgetAmounts = new Map<string, number>();
  (transactions || []).forEach(t => {
    const current = budgetAmounts.get(t.budget_id!) || 0;
    budgetAmounts.set(t.budget_id!, current + t.amount);
  });

  // Attach computed amounts to budgets
  const budgetsWithAmounts: BudgetWithAmount[] = budgets.map(budget => ({
    ...budget,
    total_amount: budgetAmounts.get(budget.id) || 0
  }));

  console.log('[BUDGET-REPO] findAllWithAmounts - Success:', budgetsWithAmounts.length);
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
  console.log('[BUDGET-REPO] findByMonthYearWithAmount:', { userId, month, year });

  const budget = await this.findByMonthYear(userId, month, year);
  if (!budget) return null;

  const total_amount = await this.calculateBudgetAmount(budget.id, userId);

  return {
    ...budget,
    total_amount
  };
}
```

## 7. Custom Hooks Design

### Updated: `useBudgetCalculations`

**File**: `src/domains/budget/hooks/use-budget-calculations.ts`

**Changes Required**:

```typescript
// BEFORE (uses stored total_amount)
const available = budget.total_amount + totalIncome - totalSpent;
const percentageUsed = budget.total_amount > 0
  ? (totalSpent / budget.total_amount) * 100
  : 0;

// AFTER (uses computed total_amount passed in)
// The budget object passed to this hook will have computed total_amount
const available = budget.total_amount + totalIncome - totalSpent;
const percentageUsed = budget.total_amount > 0
  ? (totalSpent / budget.total_amount) * 100
  : 0;
```

**Note**: The hook logic remains the same, but the `budget` parameter will have a computed `total_amount` instead of stored value.

### Updated: Dashboard `useBudgetCalculations`

**File**: `src/domains/dashboard/hooks/use-budget-calculations.ts`

**Changes Required**:

```typescript
// BEFORE
return budgets.map(budget => {
  const budgetTransactions = transactions.filter(
    t => t.budget_id === budget.id && t.type === 'expense'
  );

  const spent_amount = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
  const available_amount = budget.total_amount - spent_amount;
  const percentage_used = budget.total_amount > 0
    ? Math.round((spent_amount / budget.total_amount) * 100)
    : 0;
  // ...
});

// AFTER
return budgets.map(budget => {
  // budget.total_amount is now computed (passed from repository)
  const budgetTransactions = transactions.filter(
    t => t.budget_id === budget.id && t.type === 'expense'
  );

  const spent_amount = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
  const available_amount = budget.total_amount - spent_amount; // Uses computed amount
  const percentage_used = budget.total_amount > 0
    ? Math.round((spent_amount / budget.total_amount) * 100)
    : 0;
  // ...
});
```

**Note**: The hook receives budgets with computed amounts from the repository, so minimal changes needed.

## 8. Server Actions Updates

### Updated: `createBudget`

**File**: `src/app/actions/budget-actions.ts`

**Changes**:

```typescript
// BEFORE
export async function createBudget(data: Omit<BudgetInsert, 'user_id'>) {
  // data includes total_amount
  const repository = new BudgetRepository(supabase);
  const budget = await repository.create(data, user.id);
  return { success: true, data: budget };
}

// AFTER
export async function createBudget(data: Omit<BudgetInsert, 'user_id' | 'total_amount'>) {
  // Validate that total_amount is NOT provided
  if ('total_amount' in data) {
    return {
      success: false,
      error: 'total_amount no debe ser proporcionado. Se calcula automáticamente.'
    };
  }

  const repository = new BudgetRepository(supabase);
  const budget = await repository.create(data, user.id);

  // Return budget with computed amount
  const budgetWithAmount = await repository.findByIdWithAmount(budget.id, user.id);

  revalidatePath('/dashboard');
  revalidatePath('/presupuesto');

  return { success: true, data: budgetWithAmount };
}
```

### Updated: `updateBudget`

**File**: `src/app/actions/budget-actions.ts`

**Changes**:

```typescript
// BEFORE
export async function updateBudget(id: string, data: Partial<BudgetInsert>) {
  const repository = new BudgetRepository(supabase);
  const budget = await repository.update(id, data, user.id);
  return { success: true, data: budget };
}

// AFTER
export async function updateBudget(id: string, data: Partial<BudgetInsert>) {
  // Prevent manual total_amount updates
  if ('total_amount' in data) {
    const { total_amount, ...safeData } = data;
    data = safeData;
  }

  const repository = new BudgetRepository(supabase);
  const budget = await repository.update(id, data, user.id);

  // Return budget with computed amount
  const budgetWithAmount = await repository.findByIdWithAmount(budget.id, user.id);

  revalidatePath('/dashboard');
  revalidatePath('/presupuesto');

  return { success: true, data: budgetWithAmount };
}
```

## 9. Component Updates Required

### Files to Modify

#### 1. `src/domains/budget/components/organisms/budget-form.tsx`

**Changes**:
- Remove `CurrencyInput` component
- Remove `total_amount` field from form
- Remove validation for `total_amount`
- Update submit button to not check `totalAmount === 0`

**Updated Form**:

```typescript
// Remove these imports
// import { CurrencyInput } from '@/domains/budget/components/molecules/currency-input';

// Remove from defaultValues
defaultValues: defaultValues || {
  name: '',
  category: null,
  // ❌ REMOVED: total_amount: 0
}

// Remove from watch
const name = watch('name');
const category = watch('category');
// ❌ REMOVED: const totalAmount = watch('total_amount');

// Remove from handlers
// ❌ REMOVED: handleAmountChange function

// Remove from JSX
// ❌ REMOVED: CurrencyInput component section

// Update submit button
<Button
  type="submit"
  disabled={isLoading || !name} // Remove totalAmount check
  className="budget-form__submit"
>
  {isLoading ? 'Creando...' : 'Crear presupuesto'}
</Button>
```

#### 2. `src/domains/budget/components/organisms/budget-metrics.tsx`

**Changes**: None required (already uses `budget.total_amount` which will be computed)

#### 3. `src/domains/dashboard/components/budget-card.tsx`

**Changes**: Verify it receives budgets with computed amounts (likely no code change needed)

#### 4. `src/domains/dashboard/types.ts`

**Changes**:
- Update `BudgetWithHealth` interface documentation to note `total_amount` is computed

```typescript
export interface BudgetWithHealth {
  id: string;
  name: string;
  total_amount: number; // ✅ Computed from income transactions
  spent_amount: number;
  available_amount: number;
  percentage_used: number;
  health_status: BudgetHealthStatus;
  month: number;
  year: number;
  status: 'active' | 'draft' | 'closed';
  category: string | null;
}
```

#### 5. `src/app/(app)/presupuesto/page.tsx`

**Changes**: Update to use `findAllWithAmounts()` instead of `findAll()`

#### 6. `src/app/(app)/presupuesto/editar/[id]/page.tsx`

**Changes**:
- Update to use `findByIdWithAmount()`
- Remove `total_amount` from edit form

#### 7. `src/app/(app)/dashboard/page.tsx`

**Changes**: Update to use `findActiveWithAmounts()` instead of `findActive()`

## 10. Database Migration Plan

### Migration Steps (NOT part of this domain plan, but documented for reference)

This domain plan focuses on business logic. The database migration will be handled separately:

1. **Phase 1**: Add computed column or view (optional, for transition)
2. **Phase 2**: Update all application code (this plan)
3. **Phase 3**: Remove `total_amount` column from `budgets` table
4. **Phase 4**: Update Supabase TypeScript types

**Migration Safety**:
- Existing budgets: Store current `total_amount` as initial income transaction during migration
- OR: Keep column as deprecated until all code is updated

## 11. Files to Create

None (all files already exist, only modifications needed)

## 12. Files to Modify

### Domain Layer

1. **`src/lib/validations/budget-schema.ts`**
   - Remove `total_amount` field from schema
   - Update TypeScript types

2. **`src/lib/repositories/budget-repository.ts`**
   - Add `BudgetWithAmount` type export
   - Add `calculateBudgetAmount()` method
   - Add `findByIdWithAmount()` method
   - Add `findAllWithAmounts()` method
   - Add `findActiveWithAmounts()` method
   - Add `findByMonthYearWithAmount()` method

3. **`src/app/actions/budget-actions.ts`**
   - Update `createBudget()` to exclude `total_amount`
   - Update `updateBudget()` to prevent `total_amount` modification
   - Return budgets with computed amounts

4. **`src/domains/budget/hooks/use-budget-calculations.ts`**
   - Documentation update (no code change - receives computed amount)

5. **`src/domains/dashboard/hooks/use-budget-calculations.ts`**
   - Documentation update (receives computed amounts from repository)

6. **`src/domains/dashboard/types.ts`**
   - Add comment noting `total_amount` is computed

### UI Layer

7. **`src/domains/budget/components/organisms/budget-form.tsx`**
   - Remove `CurrencyInput` component
   - Remove `total_amount` field
   - Update form validation

8. **`src/app/(app)/presupuesto/page.tsx`**
   - Use `findAllWithAmounts()` repository method

9. **`src/app/(app)/presupuesto/editar/[id]/page.tsx`**
   - Use `findByIdWithAmount()` repository method
   - Remove `total_amount` from edit form

10. **`src/app/(app)/dashboard/page.tsx`**
    - Use `findActiveWithAmounts()` repository method

11. **`src/domains/budget/components/organisms/budget-metrics.tsx`**
    - Verify compatibility (likely no changes needed)

12. **`src/domains/dashboard/components/budget-card.tsx`**
    - Verify compatibility (likely no changes needed)

### Type Definitions

13. **`src/types/supabase.ts`**
    - Update after database migration (generated file)

## 13. Implementation Sequence

**CRITICAL**: Follow this exact order to avoid breaking changes:

### Phase 1: Repository Layer (Foundation)

1. Add new repository methods (`calculateBudgetAmount`, `findByIdWithAmount`, etc.)
2. Add `BudgetWithAmount` type export
3. Test repository methods with existing database schema

### Phase 2: Server Actions

4. Update `createBudget` action to exclude `total_amount`
5. Update `updateBudget` action to prevent `total_amount` modification
6. Test actions return budgets with computed amounts

### Phase 3: UI Components

7. Update budget form to remove amount input
8. Update pages to use new repository methods (`*WithAmount`)
9. Test all budget displays show correct amounts

### Phase 4: Schema & Validation

10. Update Zod schemas to remove `total_amount`
11. Update TypeScript types

### Phase 5: Database Migration (Final)

12. Run database migration to remove `total_amount` column
13. Regenerate Supabase types
14. Final testing

## 14. Testing Strategy

### Repository Method Tests

```typescript
// Test: calculateBudgetAmount
- Should return 0 for budget with no income transactions
- Should return sum of income transactions
- Should ignore expense transactions
- Should handle multiple income transactions

// Test: findByIdWithAmount
- Should return budget with computed amount
- Should return null for non-existent budget

// Test: findAllWithAmounts
- Should compute amounts for all budgets
- Should use single query (no N+1)
- Should handle budgets with no transactions
```

### Business Logic Tests

```typescript
// Test: useBudgetCalculations
- Should handle budget with total_amount = 0
- Should calculate correct percentages
- Should determine correct health status

// Test: Budget health thresholds
- 0-69%: healthy
- 70-89%: warning
- 90-99%: alert
- 100%+: danger
```

### Integration Tests

```typescript
// Test: Create budget flow
- Budget created without total_amount
- Budget displays with total_amount = 0
- Adding income transaction updates budget amount

// Test: Budget calculations
- Dashboard shows correct computed amounts
- Budget detail shows correct metrics
- Budget health updates when transactions change
```

## 15. Performance Considerations

### Optimization Strategies

1. **Batch Queries**: Use `findAllWithAmounts()` to fetch all budgets and transactions in 2 queries (not N+1)

2. **Caching**: React Query will cache computed budget amounts (no additional caching needed)

3. **Database Indexes**: Ensure indexes on:
   - `transactions.budget_id`
   - `transactions.user_id`
   - `transactions.type`

4. **Aggregation**: Consider database view or stored procedure for high-volume users

### Query Performance

**BEFORE (N queries for N budgets)**:
```sql
SELECT * FROM budgets WHERE user_id = ?;
-- For each budget:
SELECT SUM(amount) FROM transactions WHERE budget_id = ? AND type = 'income';
```

**AFTER (2 queries total)**:
```sql
SELECT * FROM budgets WHERE user_id = ?;
SELECT budget_id, SUM(amount) as total
FROM transactions
WHERE user_id = ? AND type = 'income' AND budget_id IS NOT NULL
GROUP BY budget_id;
```

## 16. Error Handling

### Edge Cases

1. **Budget with no income transactions**: `total_amount = 0` (valid state)
2. **Deleted budget with transactions**: Transactions remain (orphaned) - consider cascade delete
3. **Concurrent transaction updates**: React Query will refetch and show correct amount
4. **Division by zero**: Handle in percentage calculation (`total_amount = 0`)

### Error Messages

```typescript
// When user tries to manually set total_amount
'total_amount no debe ser proporcionado. Se calcula automáticamente desde los ingresos.'

// When budget has no income
'Este presupuesto aún no tiene ingresos asignados. El monto actual es $0.'
```

## 17. Migration Data Integrity

### Pre-Migration Validation

Before removing `total_amount` column:

1. **Audit existing data**:
   ```sql
   SELECT b.id, b.total_amount as stored,
          COALESCE(SUM(t.amount), 0) as computed
   FROM budgets b
   LEFT JOIN transactions t ON t.budget_id = b.id AND t.type = 'income'
   GROUP BY b.id, b.total_amount
   HAVING b.total_amount != COALESCE(SUM(t.amount), 0);
   ```

2. **Create migration transactions**: For budgets with `total_amount > 0` but no income transactions, create a migration income transaction.

3. **Verify calculations**: Ensure all budgets compute correctly before dropping column.

## 18. Rollback Plan

If issues arise:

1. **Revert schema changes**: Re-add `total_amount` column with default 0
2. **Restore Server Actions**: Revert to accepting `total_amount`
3. **Restore form UI**: Re-add `CurrencyInput` component
4. **Recalculate stored amounts**: Run migration to populate from computed values

## 19. Important Notes

⚠️ **Critical Constraints Met**:
- ✅ Repository pattern used (no direct DB access in hooks/components)
- ✅ Server Actions with session validation
- ✅ Business logic extracted to custom hooks
- ✅ Zod validation for all inputs
- ✅ React Query for server state management

⚠️ **Performance**: `findAllWithAmounts()` uses optimized batch query to avoid N+1 problem

⚠️ **Migration Safety**: Implement in phases, test thoroughly before dropping column

💡 **UX Improvement**: Budget creation is now simpler - users just add income transactions

💡 **Data Integrity**: Single source of truth (transactions) eliminates sync issues

📝 **Documentation**: Update user-facing docs to explain budget amount calculation

## 20. Coordination with Other Agents

### Next.js Builder
**Provides**:
- Repository methods with computed amounts
- Updated Server Actions
- Updated domain hooks

**Needs**:
- Integration with page components
- Server Component updates for data fetching

### UX Designer
**Provides**:
- Business rules for budget calculations
- Domain model changes

**Needs**:
- UI/UX updates for budget form (remove amount input)
- Help text explaining automatic amount calculation

### shadcn Builder
**No direct coordination needed** - uses existing components

## 21. API Contracts

### Repository Methods (New)

```typescript
// Get single budget with computed amount
budgetRepository.findByIdWithAmount(id: string, userId: string): Promise<BudgetWithAmount | null>

// Get all budgets with computed amounts (optimized)
budgetRepository.findAllWithAmounts(userId: string): Promise<BudgetWithAmount[]>

// Get active budgets with amounts
budgetRepository.findActiveWithAmounts(userId: string): Promise<BudgetWithAmount[]>

// Calculate amount for specific budget
budgetRepository.calculateBudgetAmount(budgetId: string, userId: string): Promise<number>
```

### Server Actions (Updated)

```typescript
// Create budget (no total_amount input)
createBudget(data: Omit<BudgetInsert, 'user_id' | 'total_amount'>): Promise<Result<BudgetWithAmount>>

// Update budget (total_amount ignored if provided)
updateBudget(id: string, data: Partial<BudgetInsert>): Promise<Result<BudgetWithAmount>>
```

### Custom Hooks (No signature changes)

```typescript
// Receives budget with computed total_amount
useBudgetCalculations(budget: BudgetWithAmount, transactions: Transaction[]): BudgetCalculations

// Receives budgets with computed amounts from repository
useBudgetCalculations({ budgets: BudgetWithAmount[], transactions: Transaction[] }): BudgetWithHealth[]
```

## 22. Success Criteria

**Implementation Complete When**:

- [ ] Budget creation works without `total_amount` input
- [ ] All budget queries return computed amounts correctly
- [ ] Dashboard displays accurate budget metrics
- [ ] Budget detail page shows correct calculations
- [ ] Budget health status calculates correctly with computed amounts
- [ ] No N+1 query problems in budget lists
- [ ] All tests pass
- [ ] Migration preserves data integrity
- [ ] Performance benchmarks meet requirements (<200ms for budget list)

---

**Total Estimated Effort**: 8-12 hours
**Risk Level**: Medium (requires careful migration and testing)
**Priority**: High (eliminates data redundancy and sync issues)

**Next Steps for Parent Agent**:
1. Review this plan for completeness
2. Execute Phase 1 (Repository Layer) first
3. Test thoroughly before proceeding to next phase
4. Coordinate with database migration separately
5. Update documentation after implementation
