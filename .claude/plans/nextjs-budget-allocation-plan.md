# Budget Allocation - Next.js Implementation Plan

**Created**: 2026-01-28
**Session**: budget-allocation-20260128
**Type**: Next.js Architecture
**Complexity**: Medium

## 1. Feature Overview

**Feature**: Budget Allocation System
**User Flow**:
1. User views home page → Sees allocation distribution pie chart
2. User navigates to budget detail → Clicks "Añadir del Fondo General"
3. Inline form appears → User enters amount and category → Submits
4. Allocation created → Chart updates → User sees updated distribution

**Routes Affected**:
- `/home` - Add allocation distribution chart
- `/budgets/[id]` - Add allocation creation form

## 2. Routing Structure

### Existing Routes to Modify

#### Route: `/home`

**File**: `src/app/(app)/home/page.tsx`
**Type**: Server Component (already)
**Change**: Add AllocationDistributionChart component

**Current Structure** (assumed):
```typescript
// Server Component
export default async function HomePage() {
  // Fetches dashboard data
  return (
    <div>
      <BalanceGaugeCard />
      <StatsCardsSection />
      {/* Add AllocationDistributionChart here */}
    </div>
  );
}
```

**Modification**: Insert AllocationDistributionChart below balance gauge or stats

#### Route: `/budgets/[id]`

**File**: `src/app/(app)/budgets/[id]/page.tsx`
**Type**: Server Component (already)
**Change**: Budget detail header needs allocation button + inline form capability

**Current Structure** (assumed):
```typescript
// Server Component
export default async function BudgetDetailPage({ params }: { params: { id: string } }) {
  const budget = await getBudgetById(params.id);
  const transactions = await getTransactionsByBudget(params.id);

  return (
    <div>
      <BudgetDetailHeader budget={budget} />
      <BudgetStats budget={budget} />
      <BudgetTransactionList transactions={transactions} />
    </div>
  );
}
```

**Modification**: BudgetDetailHeader needs allocation button that triggers form

## 3. Server Component Architecture

### Page Component: Home Page (Server Component)

**File**: `src/app/(app)/home/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")
**Why Server Component**: Already a Server Component, can remain so

**Integration**:
```typescript
import { Suspense } from 'react';
import { BalanceGaugeCard } from '@/domains/dashboard/components/organisms/balance-gauge-card';
import { StatsCardsSection } from '@/domains/dashboard/components/organisms/stats-cards-section';
import { AllocationDistributionChart } from '@/domains/budget/components/organisms/allocation-distribution-chart';
import { AllocationDistributionChartSkeleton } from '@/domains/budget/components/atoms/allocation-distribution-chart-skeleton';

export default async function HomePage() {
  return (
    <div className="space-y-6">
      {/* Existing components */}
      <Suspense fallback={<BalanceGaugeSkeleton />}>
        <BalanceGaugeCard />
      </Suspense>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCardsSection />
      </Suspense>

      {/* NEW: Allocation distribution chart */}
      <Suspense fallback={<AllocationDistributionChartSkeleton />}>
        <AllocationDistributionChart />
      </Suspense>
    </div>
  );
}
```

**Data Fetching**: AllocationDistributionChart is a Client Component (uses React Query)
**Suspense**: Wraps chart for loading state

### Page Component: Budget Detail Page (Server Component)

**File**: `src/app/(app)/budgets/[id]/page.tsx`
**Component Type**: ✅ Server Component (NO "use client")
**Why Server Component**: Already Server Component, stays that way

**Integration**:
```typescript
import { Suspense } from 'react';
import { BudgetDetailHeader } from '@/domains/budget/components/organisms/budget-detail-header';
import { BudgetTransactionList } from '@/domains/budget/components/organisms/budget-transaction-list';
import { getBudgetById } from '@/domains/budget/queries'; // Or wherever budget fetch is

export default async function BudgetDetailPage({
  params
}: {
  params: { id: string };
}) {
  const budget = await getBudgetById(params.id);

  return (
    <div className="space-y-6">
      {/* Header includes allocation button now */}
      <BudgetDetailHeader
        budgetId={params.id}
        budgetName={budget.name}
      />

      <Suspense fallback={<TransactionListSkeleton />}>
        <BudgetTransactionList budgetId={params.id} />
      </Suspense>
    </div>
  );
}
```

**Note**: BudgetDetailHeader will be modified to include allocation functionality

## 4. Client Components (Interactivity Required)

### Client Component 1: AllocationDistributionChart

**File**: `src/domains/budget/components/organisms/allocation-distribution-chart.tsx`
**Component Type**: ❌ Client Component (needs "use client")

**Why Client Component**:
- [x] Uses React Query hook (`useAllocationDistribution`)
- [x] Interactive chart (hover, click)
- [x] State for loading/error handling

**Structure**:
```typescript
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAllocationDistribution } from "@/lib/hooks/use-allocation-distribution";
import { allocationTextMap } from "@/domains/budget/allocation.text-map";

export function AllocationDistributionChart() {
  const { data, isLoading, error } = useAllocationDistribution();

  if (isLoading) return <AllocationDistributionChartSkeleton />;
  if (error) return <ErrorState />;
  if (!data || data.distribution.length === 0) return <EmptyAllocationsState />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{allocationTextMap.chartTitle}</CardTitle>
        <CardDescription>{allocationTextMap.chartSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribution}
                dataKey="totalAllocated"
                nameKey="budgetName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.distribution.map((entry, index) => (
                  <Cell key={entry.budgetId} fill={CHART_COLORS[index]} />
                ))}
              </Pie>
              <ChartTooltip />
              <ChartLegend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {allocationTextMap.totalAllocated}:{" "}
            <span className="font-semibold">${data.totalAllocated.toFixed(2)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Client Component 2: BudgetDetailHeader (with Allocation Button)

**File**: `src/domains/budget/components/organisms/budget-detail-header.tsx`
**Component Type**: ❌ Client Component (needs "use client" for button interactivity)

**Why Client Component**:
- [x] Button onClick handler (interactive)
- [x] State for showing/hiding inline form

**Structure**:
```typescript
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AllocationForm } from "@/domains/budget/components/molecules/allocation-form";
import { allocationTextMap } from "@/domains/budget/allocation.text-map";

export function BudgetDetailHeader({
  budgetId,
  budgetName
}: {
  budgetId: string;
  budgetName: string;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{budgetName}</h1>

        <Button
          variant="secondary"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {allocationTextMap.addAllocationButton}
        </Button>
      </div>

      {/* Inline form appears when button clicked */}
      {isFormOpen && (
        <AllocationForm
          budgetId={budgetId}
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
```

**Alternative**: If BudgetDetailHeader is already a Server Component and should stay that way, extract button + form to separate Client Component:

```typescript
// budget-detail-header.tsx (Server Component)
import { AddAllocationButton } from './add-allocation-button'; // Client Component

export function BudgetDetailHeader({ budgetId, budgetName }) {
  return (
    <div className="flex items-center justify-between">
      <h1>{budgetName}</h1>
      <AddAllocationButton budgetId={budgetId} />
    </div>
  );
}

// add-allocation-button.tsx (Client Component)
'use client';
// Button + form logic here
```

### Client Component 3: AllocationForm

**File**: `src/domains/budget/components/molecules/allocation-form.tsx`
**Component Type**: ❌ Client Component (needs "use client")

**Why Client Component**:
- [x] Form state management (amount, category, description)
- [x] Event handlers (onChange, onSubmit)
- [x] React Query mutation (useCreateAllocation)

**Structure**:
```typescript
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCreateAllocation } from "@/lib/hooks/use-allocations";
import { toast } from "sonner";
import { allocationTextMap } from "@/domains/budget/allocation.text-map";

export function AllocationForm({
  budgetId,
  onSuccess,
  onCancel
}: {
  budgetId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const createAllocation = useCreateAllocation();

  const handleSubmit = async () => {
    const result = await createAllocation.mutateAsync({
      amount: parseFloat(amount),
      budget_id: budgetId,
      category_id: categoryId,
      date: new Date().toISOString(),
      description: description || null
    });

    if (result.success) {
      toast.success(allocationTextMap.successCreate);
      onSuccess();
    } else {
      toast.error(result.error || allocationTextMap.errorCreate);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">{allocationTextMap.formTitle}</h3>

      {/* Form fields */}
      <div className="space-y-2">
        <Label htmlFor="amount">{allocationTextMap.amountLabel} *</Label>
        <Input
          id="amount"
          type="number"
          placeholder={allocationTextMap.amountPlaceholder}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{allocationTextMap.categoryLabel} *</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category">
            <SelectValue placeholder={allocationTextMap.categoryPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {/* Categories fetched from somewhere */}
            <SelectItem value="cat1">Comida</SelectItem>
            <SelectItem value="cat2">Transporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{allocationTextMap.descriptionLabel}</Label>
        <Input
          id="description"
          type="text"
          placeholder={allocationTextMap.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          {allocationTextMap.cancelButton}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!amount || !categoryId || createAllocation.isPending}
        >
          {createAllocation.isPending ? "Asignando..." : allocationTextMap.confirmButton}
        </Button>
      </div>
    </div>
  );
}
```

### Client Component 4: BudgetTransactionList (modified)

**File**: `src/domains/budget/components/organisms/budget-transaction-list.tsx`
**Component Type**: Likely already Client Component
**Change**: Display allocations differently (badge, icon)

**Modification**:
```typescript
'use client';

import { Badge } from "@/components/ui/badge";
import { Tag, Trash2 } from "lucide-react";
import { DeleteAllocationDialog } from "@/domains/budget/components/molecules/delete-allocation-dialog";

export function BudgetTransactionList({ budgetId }) {
  const { data: transactions } = useTransactions(budgetId); // Including allocations

  return (
    <div className="space-y-2">
      {transactions?.map((transaction) => (
        <div key={transaction.id} className={cn(
          "p-4 rounded-lg border",
          transaction.type === 'allocation' && "bg-blue-50 dark:bg-blue-950/20"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transaction.type === 'allocation' && (
                <>
                  <Tag className="h-4 w-4 text-blue-600" />
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">
                    Asignación
                  </Badge>
                </>
              )}
              <span className="font-medium">{transaction.description}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono">
                +${transaction.amount.toFixed(2)}
              </span>

              {transaction.type === 'allocation' && (
                <DeleteAllocationDialog
                  allocationId={transaction.id}
                  budgetId={budgetId}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 5. Suspense and Loading States

### Loading Component: Home Page

**File**: `src/app/(app)/home/loading.tsx` (if doesn't exist)
**Purpose**: Loading state for entire home page

```typescript
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full" /> {/* Balance Gauge */}
      <Skeleton className="h-[150px] w-full" /> {/* Stats */}
      <Skeleton className="h-[400px] w-full" /> {/* Allocation Chart */}
    </div>
  );
}
```

### Skeleton: AllocationDistributionChart

**File**: `src/domains/budget/components/atoms/allocation-distribution-chart-skeleton.tsx`
**Purpose**: Loading state for chart component

```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AllocationDistributionChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" /> {/* Title */}
        <Skeleton className="h-4 w-[300px]" /> {/* Subtitle */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-full" /> {/* Chart circle */}
      </CardContent>
    </Card>
  );
}
```

## 6. Data Fetching Strategy

### Server Components

**Home Page**: Stays Server Component, child components (AllocationDistributionChart) use client-side React Query

**Budget Detail Page**: Stays Server Component, child components use client-side React Query

### Client Components

**AllocationDistributionChart**:
- Uses `useAllocationDistribution()` hook (React Query)
- Fetches on component mount
- Automatic refetch on window focus

**BudgetTransactionList**:
- Uses `useTransactions(budgetId)` hook (React Query)
- Includes allocations in query (filter `type='allocation'`)

**AllocationForm**:
- Uses `useCreateAllocation()` mutation hook (React Query)
- On success: invalidates queries, closes form, shows toast

## 7. Server Actions Integration

### createAllocation Server Action

**File**: `src/app/actions/allocation-actions.ts`
**Usage**: Called by `useCreateAllocation` hook

**Flow**:
1. Client Component calls `createAllocation.mutateAsync(data)`
2. React Query mutation invokes Server Action
3. Server Action validates, creates allocation, returns result
4. React Query invalidates cache, triggers refetch
5. Chart and transaction list auto-update

### deleteAllocation Server Action

**File**: `src/app/actions/allocation-actions.ts`
**Usage**: Called by `useDeleteAllocation` hook

**Flow**:
1. User clicks delete in DeleteAllocationDialog
2. Dialog confirms, calls `deleteAllocation.mutateAsync(id)`
3. Server Action validates ownership, deletes
4. React Query invalidates cache
5. UI updates automatically

## 8. Error Handling

### Error Boundary: Budget Detail Page

**File**: `src/app/(app)/budgets/[id]/error.tsx` (if doesn't exist)
**Purpose**: Catch errors in budget detail route

```typescript
'use client';

export default function BudgetError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold">Algo salió mal</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-4">
        Intentar de nuevo
      </button>
    </div>
  );
}
```

### Component-Level Error States

**AllocationDistributionChart**:
```typescript
if (error) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-[300px]">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground">
          Error al cargar distribución de asignaciones
        </p>
      </CardContent>
    </Card>
  );
}
```

## 9. Files to Create

### New Page Files

None - Using existing pages (`/home`, `/budgets/[id]`)

### New Component Files

- `src/domains/budget/components/organisms/allocation-distribution-chart.tsx` - Pie chart component (Client)
- `src/domains/budget/components/atoms/allocation-distribution-chart-skeleton.tsx` - Loading skeleton
- `src/domains/budget/components/molecules/allocation-form.tsx` - Allocation creation form (Client)
- `src/domains/budget/components/molecules/delete-allocation-dialog.tsx` - Deletion confirmation (Client)
- `src/domains/budget/components/atoms/allocation-badge.tsx` - Badge component
- `src/domains/budget/components/molecules/empty-allocations-state.tsx` - Empty state

### New Text Map

- `src/domains/budget/allocation.text-map.ts` - All user-facing text

## 10. Files to Modify

### Page Files

- `src/app/(app)/home/page.tsx` - Add AllocationDistributionChart
- `src/app/(app)/budgets/[id]/page.tsx` - Ensure header has allocation button

### Component Files

- `src/domains/budget/components/organisms/budget-detail-header.tsx` - Add allocation button + form
- `src/domains/budget/components/organisms/budget-transaction-list.tsx` - Display allocations with badge

### Optional Loading Files

- `src/app/(app)/home/loading.tsx` - Loading state for home (if doesn't exist)
- `src/app/(app)/budgets/[id]/error.tsx` - Error boundary (if doesn't exist)

## 11. Implementation Steps

### Phase 1: Domain Files

1. ✅ Create domain model files (from domain-architect plan)
2. ✅ Create Server Actions (allocation-actions.ts)
3. ✅ Create React Query hooks (use-allocations.ts, use-allocation-distribution.ts)
4. ✅ Create text map (allocation.text-map.ts)

### Phase 2: UI Components

1. ✅ Create AllocationDistributionChart component
2. ✅ Create AllocationForm component
3. ✅ Create DeleteAllocationDialog component
4. ✅ Create AllocationBadge component
5. ✅ Create EmptyAllocationsState component
6. ✅ Create skeletons

### Phase 3: Page Integration

1. ✅ Modify home page to include AllocationDistributionChart
2. ✅ Modify budget detail header to include allocation button
3. ✅ Modify transaction list to display allocations differently
4. ✅ Test full flow: create allocation → see in chart → delete → updates

### Phase 4: Polish

1. Add loading states with Suspense
2. Add error boundaries
3. Test responsive behavior
4. Test accessibility

## 12. Coordination with Other Agents

- **Domain Architect**:
  - Uses Server Actions: `createAllocation`, `deleteAllocation`
  - Uses hooks: `useAllocations`, `useAllocationDistribution`, `useCreateAllocation`, `useDeleteAllocation`
  - Uses types: `AllocationFormValues`, `AllocationDistribution`

- **UX Designer**:
  - Implements inline form design (not modal)
  - Implements pie chart layout as specified
  - Uses text from allocation.text-map.ts

- **shadcn Builder**:
  - Uses shadcn components as specified
  - Card, Button, Input, Label, Select, Badge, AlertDialog, chart
  - Uses recharts for PieChart

## 13. Performance Considerations

### React Query Caching

- Allocations are cached by React Query
- Auto-refetch on window focus
- Manual invalidation after mutations

### Suspense Streaming

- AllocationDistributionChart wrapped in Suspense
- Doesn't block page render while loading data

### Code Splitting

- Client Components automatically code-split by Next.js
- Chart library (recharts) only loaded when needed

## 14. Testing Considerations

### Manual Testing Checklist

- [ ] Home page shows pie chart correctly
- [ ] Chart displays empty state when no allocations
- [ ] Budget detail page shows "Add Allocation" button
- [ ] Clicking button reveals inline form
- [ ] Form validation works (amount > 0, category required)
- [ ] Creating allocation updates chart immediately
- [ ] Allocations appear in transaction list with badge
- [ ] Deleting allocation shows confirmation dialog
- [ ] Deleting allocation updates chart and list
- [ ] Toast notifications appear on success/error
- [ ] Loading states appear correctly
- [ ] Error states display gracefully
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## 15. Deployment Notes

### Database Migration

Before deploying, run migration:
```bash
pnpm supabase migration up
# Or apply migration: supabase/migrations/YYYYMMDD_add_allocation_type.sql
```

### Environment Variables

No new environment variables needed (uses existing Supabase config)

### Build Verification

```bash
pnpm build
# Verify no build errors
# Check bundle size (chart library may increase size)
```

---

**Next Steps**:
1. Parent implements domain files (schema, actions, hooks)
2. Parent implements UI components (chart, form, badge)
3. Parent modifies pages to integrate components
4. Parent tests full user flow
5. Parent creates database migration
6. Parent deploys to production
