# Budget Allocation - Domain Business Logic Plan

**Created**: 2026-01-28
**Session**: budget-allocation-20260128
**Domain**: budget (extending existing)
**Complexity**: Medium

## 1. Business Context

### Problem Statement

Users have income transactions without assigned budgets (general fund). They need a way to virtually allocate portions of this general fund to specific budgets for internal tracking, and visualize this distribution via a pie chart.

### Business Goals

- **Primary Goal**: Enable virtual allocation of general fund to budgets
- **Secondary Goals**:
  - Visualize allocation distribution in home page
  - Maintain simple UX (minimal clicks)
  - Track internal budget accounting without moving real money
- **Success Metrics**: Users can see how their general fund is distributed across budgets

### User Stories

**US-1**: As a user, I want to allocate money from the general fund to a specific budget so that I can track how I plan to use my available funds.

**Acceptance Criteria**:
- [ ] User can create an allocation from budget detail page
- [ ] Allocation links general fund to specific budget
- [ ] Allocation amount is positive number
- [ ] Allocation doesn't modify real transaction balances
- [ ] User can delete allocation (but not edit)

**US-2**: As a user, I want to see a pie chart of my allocation distribution so that I understand how my general fund is planned.

**Acceptance Criteria**:
- [ ] Pie chart shows percentage per budget
- [ ] Chart shows unallocated portion
- [ ] Chart is interactive (click to see details)
- [ ] Data updates when allocations change

## 2. Domain Model

### Approach: Extend Transaction Type (NOT new table)

**Decision**: Use existing `transactions` table with new type `'allocation'` instead of creating separate table.

**Rationale**:
- Allocations are conceptually similar to transactions (amount, date, budget relationship)
- Reuse existing repository pattern and infrastructure
- Simpler queries and less joins
- Maintains consistency with current architecture

### Transaction Type Extension

**Current types**: `'income' | 'expense'`
**New type**: `'allocation'`

### Allocation as Transaction

```typescript
// src/lib/repositories/transaction-repository.ts
export type TransactionType = 'income' | 'expense' | 'allocation';

// Allocation properties:
interface AllocationTransaction {
  id: string;
  type: 'allocation'; // NEW type
  amount: number; // Positive amount allocated
  budget_id: string; // Target budget (REQUIRED for allocations)
  category_id: string; // Category for allocation tracking
  date: string; // When allocation was made
  description?: string | null; // Optional note
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
```

**Key Differences from Income/Expense**:
- `budget_id` is **REQUIRED** (allocations always target a budget)
- Does NOT affect real balance calculations (filtered out in balance queries)
- Only used for visualization and distribution tracking

## 3. Business Rules

### Validation Rules

1. **Allocation Amount Rule**:
   - Condition: Creating/updating allocation
   - Action: Amount must be positive (> 0)
   - Error: "El monto debe ser mayor a 0"

2. **Budget Required Rule**:
   - Condition: Creating allocation
   - Action: budget_id must be present and valid UUID
   - Error: "Debe seleccionar un presupuesto"

3. **Category Required Rule**:
   - Condition: Creating allocation
   - Action: category_id must be present and valid UUID
   - Error: "Debe seleccionar una categoría"

4. **User Ownership Rule**:
   - Condition: Creating/deleting allocation
   - Action: User must own the budget
   - Error: "No tiene permisos para este presupuesto"

### Invariants (must always be true)

- Allocation type always has budget_id (never null)
- Allocation amount is always positive
- Allocations belong to authenticated user
- Allocations are excluded from real balance calculations

### Business Constraints

- **No Limits**: No maximum allocation per budget (user requirement)
- **No Editing**: Only create or delete operations allowed
- **No Overlap Validation**: Can allocate more than available (virtual tracking)

## 4. Zod Validation Schema

### Allocation Schema

```typescript
// src/lib/validations/allocation-schema.ts
import { z } from 'zod';

/**
 * Allocation creation schema
 * Allocations are virtual assignments of general fund to budgets
 */
export const allocationSchema = z.object({
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(999999999, 'El monto es demasiado grande'),
  budget_id: z
    .string()
    .uuid('ID de presupuesto inválido'),
  category_id: z
    .string()
    .uuid('ID de categoría inválido'),
  date: z.string().refine(
    val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Fecha inválida' }
  ),
  description: z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .nullable()
    .optional()
});

// TypeScript types inferred from schema
export type AllocationFormValues = z.infer<typeof allocationSchema>;
```

**Note**: No update schema needed (allocations cannot be edited per requirements)

## 5. Use Cases / Business Operations

### Use Case 1: Create Allocation

**Actor**: Authenticated user
**Pre-conditions**:
- User is authenticated
- Target budget exists and belongs to user
- Category exists

**Post-conditions**:
- Allocation transaction created with type='allocation'
- General fund allocation tracking updated
- React Query cache invalidated

**Business Logic Steps**:

1. Validate session (auth required)
2. Validate input using `allocationSchema`
3. Verify budget ownership (user_id matches)
4. Verify category exists
5. Create transaction with type='allocation'
6. Return success result

**Server Action Location**: `src/app/actions/allocation-actions.ts` (new file)

### Use Case 2: Delete Allocation

**Actor**: Authenticated user
**Pre-conditions**:
- User is authenticated
- Allocation exists and belongs to user

**Post-conditions**:
- Allocation transaction deleted
- React Query cache invalidated

**Business Logic Steps**:

1. Validate session (auth required)
2. Fetch allocation transaction
3. Verify ownership (user_id matches)
4. Verify type is 'allocation' (safety check)
5. Delete transaction
6. Return success result

**Server Action Location**: `src/app/actions/allocation-actions.ts`

### Use Case 3: Get Allocations by Budget

**Actor**: Authenticated user
**Pre-conditions**: User is authenticated

**Post-conditions**: Returns list of allocations

**Business Logic Steps**:

1. Optional session check (if data is private)
2. Query transactions WHERE type='allocation' AND budget_id=X
3. Return filtered results

**Repository Location**: `src/lib/repositories/transaction-repository.ts` (extend existing)

### Use Case 4: Get Allocation Distribution

**Actor**: Authenticated user
**Purpose**: Data for pie chart

**Pre-conditions**: User is authenticated

**Post-conditions**: Returns allocation distribution data

**Business Logic Steps**:

1. Query all allocations for user
2. Group by budget_id
3. Calculate total allocated
4. Calculate percentage per budget
5. Return distribution data

**Hook Location**: `src/lib/hooks/use-allocation-distribution.ts` (new file)

## 6. Server Actions Design

### Mutation Actions

```typescript
// src/app/actions/allocation-actions.ts
'use server';

import { auth } from '@/auth';
import { allocationSchema } from '@/lib/validations/allocation-schema';
import { TransactionRepository } from '@/lib/repositories/transaction-repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAllocation(input: unknown) {
  // ✅ 1. Session validation (MANDATORY)
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'No autenticado' };
  }

  // ✅ 2. Input validation with Zod
  const validationResult = allocationSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Datos inválidos',
      details: validationResult.error.errors
    };
  }

  const validatedInput = validationResult.data;

  // ✅ 3. Verify budget ownership
  const supabase = await createClient();
  const { data: budget } = await supabase
    .from('budgets')
    .select('id')
    .eq('id', validatedInput.budget_id)
    .eq('user_id', session.user.id)
    .single();

  if (!budget) {
    return { success: false, error: 'Presupuesto no encontrado' };
  }

  // ✅ 4. Create allocation transaction
  const repository = new TransactionRepository(supabase);

  try {
    const allocation = await repository.create({
      type: 'allocation',
      amount: validatedInput.amount,
      budget_id: validatedInput.budget_id,
      category_id: validatedInput.category_id,
      date: validatedInput.date,
      description: validatedInput.description || null,
      payment_method: null,
      notes: null,
      user_id: session.user.id
    });

    // Revalidate paths
    revalidatePath('/home');
    revalidatePath(`/budgets/${validatedInput.budget_id}`);

    return { success: true, data: allocation };
  } catch (error) {
    console.error('[ALLOCATION] Create error:', error);
    return { success: false, error: 'Error al crear asignación' };
  }
}

export async function deleteAllocation(allocationId: string) {
  // ✅ 1. Session validation
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'No autenticado' };
  }

  // ✅ 2. Verify ownership and type
  const supabase = await createClient();
  const { data: allocation } = await supabase
    .from('transactions')
    .select('id, type, budget_id')
    .eq('id', allocationId)
    .eq('user_id', session.user.id)
    .eq('type', 'allocation')
    .single();

  if (!allocation) {
    return { success: false, error: 'Asignación no encontrada' };
  }

  // ✅ 3. Delete allocation
  const repository = new TransactionRepository(supabase);

  try {
    await repository.delete(allocationId, session.user.id);

    // Revalidate paths
    revalidatePath('/home');
    revalidatePath(`/budgets/${allocation.budget_id}`);

    return { success: true };
  } catch (error) {
    console.error('[ALLOCATION] Delete error:', error);
    return { success: false, error: 'Error al eliminar asignación' };
  }
}
```

## 7. Custom Hooks (Business Logic)

### Hook 1: `useAllocations`

**File**: `src/lib/hooks/use-allocations.ts`
**Purpose**: Fetch allocations for a budget using React Query

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAllocation, deleteAllocation } from '@/app/actions/allocation-actions';

export function useAllocations(budgetId?: string) {
  return useQuery({
    queryKey: ['allocations', budgetId],
    queryFn: async () => {
      // Fetch allocations from Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('type', 'allocation');

      if (budgetId) {
        query = query.eq('budget_id', budgetId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!budgetId || budgetId === undefined // Allow fetching all if no budgetId
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAllocation,
    onSuccess: () => {
      // Invalidate allocations queries
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['allocation-distribution'] });
    }
  });
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['allocation-distribution'] });
    }
  });
}
```

### Hook 2: `useAllocationDistribution`

**File**: `src/lib/hooks/use-allocation-distribution.ts`
**Purpose**: Calculate allocation distribution for pie chart

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface AllocationDistribution {
  budgetId: string;
  budgetName: string;
  totalAllocated: number;
  percentage: number;
}

export function useAllocationDistribution() {
  return useQuery({
    queryKey: ['allocation-distribution'],
    queryFn: async () => {
      const supabase = createClient();

      // Fetch all allocations with budget info
      const { data: allocations, error } = await supabase
        .from('transactions')
        .select(`
          amount,
          budget_id,
          budgets (
            id,
            name
          )
        `)
        .eq('type', 'allocation');

      if (error) throw error;

      // Group by budget and calculate totals
      const distribution = new Map<string, AllocationDistribution>();
      let grandTotal = 0;

      allocations?.forEach(allocation => {
        const budget = allocation.budgets as unknown as { id: string; name: string };
        if (!budget) return;

        const existing = distribution.get(budget.id);
        if (existing) {
          existing.totalAllocated += allocation.amount;
        } else {
          distribution.set(budget.id, {
            budgetId: budget.id,
            budgetName: budget.name,
            totalAllocated: allocation.amount,
            percentage: 0 // Calculate after
          });
        }
        grandTotal += allocation.amount;
      });

      // Calculate percentages
      const result: AllocationDistribution[] = [];
      distribution.forEach(item => {
        item.percentage = grandTotal > 0 ? (item.totalAllocated / grandTotal) * 100 : 0;
        result.push(item);
      });

      return {
        distribution: result,
        totalAllocated: grandTotal
      };
    }
  });
}
```

## 8. State Management Strategy

### Server State (Backend Data)

**Tool**: React Query ✅
**Location**: Custom hooks in `src/lib/hooks/`
**Usage**: Fetching allocations, creating/deleting allocations

```typescript
// ✅ CORRECT: React Query for allocation data
const { data: allocations } = useAllocations(budgetId);
const createAllocation = useCreateAllocation();
const deleteAllocation = useDeleteAllocation();
```

### Client/UI State (if needed)

**Tool**: Zustand (only if UI state needed, e.g., modal open/close)
**Location**: Component-level `useState` for simple cases

```typescript
// ✅ Simple UI state
const [isModalOpen, setIsModalOpen] = useState(false);
```

**❌ NEVER use Zustand for allocation data** (use React Query)

## 9. Database Schema Changes

### Option A: Extend Transaction Type (RECOMMENDED)

**No schema changes needed** - just use existing `transactions` table with new type value.

**Migration**: Update type enum to include 'allocation'

```sql
-- File: supabase/migrations/YYYYMMDD_add_allocation_type.sql

-- Add 'allocation' to transaction type enum
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'allocation';

-- Optional: Add comment for clarity
COMMENT ON TYPE transaction_type IS 'Transaction types: income, expense, allocation (virtual)';
```

### Option B: Separate Allocations Table (NOT RECOMMENDED)

Would require new table and joins - adds complexity without benefit.

**Decision**: Use Option A (extend transaction type)

## 10. Files to Create

### `src/lib/validations/allocation-schema.ts`
**Purpose**: Zod validation schema for allocations
**Content**: allocationSchema, types

### `src/app/actions/allocation-actions.ts`
**Purpose**: Server Actions for allocation mutations
**Content**: createAllocation, deleteAllocation

### `src/lib/hooks/use-allocations.ts`
**Purpose**: React Query hooks for allocations
**Content**: useAllocations, useCreateAllocation, useDeleteAllocation

### `src/lib/hooks/use-allocation-distribution.ts`
**Purpose**: Hook for pie chart data
**Content**: useAllocationDistribution

## 11. Files to Modify

### `src/lib/repositories/transaction-repository.ts`
**Changes**:
- Add method `findAllocationsByBudget(budgetId, userId)`
- Add method `getTotalAllocated(userId, budgetId?)`
- Update TypeScript types to include 'allocation' in TransactionType

### Database Migration
**File**: `supabase/migrations/YYYYMMDD_add_allocation_type.sql`
**Changes**: Add 'allocation' to transaction_type enum

## 12. Implementation Steps

1. ✅ Create migration to add 'allocation' type to enum
2. ✅ Create `allocation-schema.ts` with Zod validation
3. ✅ Extend `TransactionRepository` with allocation methods
4. ✅ Create `allocation-actions.ts` with Server Actions
5. ✅ Create `use-allocations.ts` hook with React Query
6. ✅ Create `use-allocation-distribution.ts` hook for chart
7. ✅ Test business rules and validation

## 13. Integration Notes

### Coordination with Other Agents

- **UX Designer**: Use `AllocationDistribution` type for pie chart design
- **Next.js Builder**:
  - Home page needs pie chart component
  - Budget detail page needs allocation button/form
- **shadcn Builder**: Select chart component (recharts), modal/dialog

### API Contracts

**Operations Exposed**:
- `createAllocation(input: AllocationFormValues)` → Returns `{ success, data?, error? }`
- `deleteAllocation(id: string)` → Returns `{ success, error? }`
- `useAllocations(budgetId?)` → Hook returning `{ data, isLoading, error }`
- `useAllocationDistribution()` → Hook returning `{ data: { distribution, totalAllocated }, isLoading }`

## 14. Important Notes

⚠️ **Allocation is type='allocation' NOT separate table** (reuse infrastructure)
⚠️ **budget_id is REQUIRED for allocations** (unlike income/expense where it's optional)
⚠️ **Allocations excluded from balance calculations** (virtual tracking only)
💡 **Use React Query for all allocation data** (NOT Zustand)
💡 **No editing allowed** (only create/delete per requirements)
📝 **Migration needed** (add 'allocation' to enum)

## 15. Testing Considerations

### Business Logic Tests

- Validate allocationSchema with invalid input
- Test budget ownership verification
- Test allocation creation flow
- Test allocation deletion with ownership check
- Test distribution calculation with edge cases (no allocations, one budget, multiple budgets)

### Integration Tests

- Test Server Actions with auth context
- Test React Query hooks
- Test cache invalidation after mutations
- Test pie chart data transformation
