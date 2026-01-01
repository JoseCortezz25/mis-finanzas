# Budget Detail View - Next.js Implementation Plan

**Created**: 2025-12-31
**Session**: budget_detail_view
**Type**: Next.js Architecture
**Complexity**: Medium

## 1. Feature Overview

**Feature**: Budget Detail View
**User Flow**: User clicks on a budget from the budget list → Navigates to detail page → Views budget information, metrics, and all related transactions
**Route**: `/presupuesto/[id]`

**Key Requirements**:
- Display budget information (name, category, period, total amount, status)
- Show budget metrics (spent amount, available amount, progress percentage)
- List all transactions related to the budget
- Mobile-first responsive design
- Real-time data updates via React Query
- Traceability and detailed analytics

## 2. Routing Structure

### New Routes to Create

#### Route: `/presupuesto/[id]`

**File**: `app/(app)/presupuesto/[id]/page.tsx`
**Type**: Client Component (needs interactivity and React Query hooks)
**Purpose**: Display detailed budget information with related transactions
**Dynamic**: Yes (dynamic segment: `[id]` - budget ID)

**Layout Needed**: No
- Uses existing `app/(app)/layout.tsx` with AppHeader and MobileBottomNav

**Route Group**: `(app)` (existing)
**Why**: Protected route requiring authentication, uses consistent app layout with navigation

**Additional Files Needed**:
- `app/(app)/presupuesto/[id]/loading.tsx` - Loading state for budget detail
- `app/(app)/presupuesto/[id]/error.tsx` - Error boundary for failed data fetching

### Existing Routes to Modify

#### Route: `/presupuesto`
**File**: `app/(app)/presupuesto/page.tsx`
**Change**: Add click handler to navigate to detail view when clicking on a budget row
**Implementation**: Wrap TableRow in clickable element or add onClick handler to navigate to `/presupuesto/${budget.id}`

## 3. Server Component Architecture

### Page Component (Client Component - necessary for hooks)

**File**: `app/(app)/presupuesto/[id]/page.tsx`
**Component Type**: ❌ Client Component (needs "use client")

```typescript
'use client';

import { useBudget, useTransactionsByBudget } from '@/lib/hooks';
import { BudgetDetailHeader } from '@/domains/budget/components/organisms/budget-detail-header';
import { BudgetMetrics } from '@/domains/budget/components/organisms/budget-metrics';
import { BudgetTransactionList } from '@/domains/budget/components/organisms/budget-transaction-list';
import { PageLayout } from '@/components/templates/page-layout';
import { ErrorState } from '@/components/molecules/error-state';

export default function BudgetDetailPage({ params }: { params: { id: string } }) {
  // React Query hooks for data fetching
  const { data: budget, isLoading: isBudgetLoading, error: budgetError } = useBudget(params.id);
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactionsByBudget(params.id);

  const isLoading = isBudgetLoading || isTransactionsLoading;

  if (budgetError) {
    return <ErrorState message="No se pudo cargar el presupuesto" />;
  }

  return (
    <PageLayout
      title="Detalle del Presupuesto"
      showBackButton={true}
      backHref="/presupuesto"
      isLoading={isLoading}
      loadingMessage="Cargando presupuesto..."
    >
      {budget && (
        <div className="space-y-6">
          {/* Budget Header with basic info */}
          <BudgetDetailHeader budget={budget} />

          {/* Budget Metrics: spent, available, progress */}
          <BudgetMetrics budget={budget} transactions={transactions || []} />

          {/* List of related transactions */}
          <BudgetTransactionList
            budgetId={budget.id}
            transactions={transactions || []}
            isLoading={isTransactionsLoading}
          />
        </div>
      )}
    </PageLayout>
  );
}
```

**Why Client Component**:
- [x] Uses React Query hooks (useBudget, useTransactionsByBudget)
- [x] Interactive UI with potential state management
- [x] Event handlers for transaction actions

**Note**: Keep data fetching in hooks, business logic in custom hooks, UI in separate components.

## 4. Layouts and Templates

### Root Layout (no modifications needed)

**File**: `app/(app)/layout.tsx`
**Changes**: None required - existing layout already provides:
- AppHeader with user info and sign out
- MobileBottomNav for mobile navigation
- FloatingActionButton for quick actions

## 5. Loading and Error States

### Loading UI

**File**: `app/(app)/presupuesto/[id]/loading.tsx`
**Purpose**: Streaming loading state while data is fetching

```typescript
// ✅ Server Component
import { PageLayout } from '@/components/templates/page-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function BudgetDetailLoading() {
  return (
    <PageLayout
      title="Detalle del Presupuesto"
      showBackButton={true}
      backHref="/presupuesto"
    >
      <div className="space-y-6">
        {/* Header skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
        </Card>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Transaction list skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
```

**When shown**: While page.tsx is loading data (automatic with Next.js)

### Error Boundary

**File**: `app/(app)/presupuesto/[id]/error.tsx`
**Purpose**: Catch and handle errors during data fetching

```typescript
'use client'; // ❌ Must be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function BudgetDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Budget detail error:', error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error al cargar el presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            No se pudo cargar la información del presupuesto. Por favor, intenta nuevamente.
          </p>
          <div className="flex gap-2">
            <Button onClick={reset}>Intentar nuevamente</Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 6. Data Fetching Strategy

### Client Component Fetch (React Query hooks)

**Hooks to use**:

1. **`useBudget(id: string)`** - Already exists in `src/lib/hooks/use-budgets.ts`
   - Fetches single budget by ID
   - Returns: `{ data: Budget, isLoading, error }`
   - Uses React Query with caching

2. **`useTransactionsByBudget(budgetId: string)`** - Already exists in `src/lib/hooks/use-transactions.ts`
   - Fetches all transactions related to a budget
   - Returns: `{ data: Transaction[], isLoading, error }`
   - Uses React Query with caching

**Data Flow**:
```typescript
// In page.tsx
const { data: budget, isLoading: isBudgetLoading } = useBudget(params.id);
const { data: transactions, isLoading: isTransactionsLoading } = useTransactionsByBudget(params.id);

// Pass data down to presentation components
<BudgetMetrics budget={budget} transactions={transactions} />
```

**Cache Strategy**:
- React Query handles caching automatically
- Data invalidation on mutations (already configured in existing hooks)
- Background refetching for fresh data

### No Server Actions Needed
- This is a read-only view (no mutations on this page)
- All mutations happen on edit/delete pages (existing)

## 7. Component Architecture & New Components

### Domain Components to Create

#### 1. `BudgetDetailHeader` (Organism)

**File**: `src/domains/budget/components/organisms/budget-detail-header.tsx`
**Type**: Client Component (needs interactivity for actions)
**Purpose**: Display budget name, category, period, status, and action buttons

```typescript
'use client';

import { Budget } from '@/lib/repositories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BUDGET_CATEGORIES } from '@/domains/budget/constants/categories';
import { getMonthName } from '@/domains/shared/messages';
import { useRouter } from 'next/navigation';

interface BudgetDetailHeaderProps {
  budget: Budget;
}

export function BudgetDetailHeader({ budget }: BudgetDetailHeaderProps) {
  const router = useRouter();
  const category = budget.category
    ? BUDGET_CATEGORIES.find(c => c.id === budget.category)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{budget.name}</CardTitle>

            {/* Category */}
            {category && (
              <div className="flex items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.bgColor}`}>
                  <category.icon size={20} className={category.iconColor} />
                </div>
                <span className="text-sm font-medium">{category.label}</span>
              </div>
            )}

            {/* Period */}
            <div className="text-sm text-muted-foreground">
              {budget.month && budget.year
                ? `${getMonthName(budget.month)} ${budget.year}`
                : 'Sin período definido'}
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant={budget.status === 'active' ? 'default' : 'secondary'}>
            {budget.status}
          </Badge>
        </div>
      </CardHeader>

      {/* Action Buttons */}
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/presupuesto/editar/${budget.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/movimientos/crear?budgetId=' + budget.id)}
          >
            Agregar Movimiento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 2. `BudgetMetrics` (Organism)

**File**: `src/domains/budget/components/organisms/budget-metrics.tsx`
**Type**: Client Component (may need interactivity)
**Purpose**: Display budget metrics (total, spent, available, progress)

```typescript
'use client';

import { Budget } from '@/lib/repositories';
import { Transaction } from '@/lib/repositories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBudgetCalculations } from '@/domains/budget/hooks/use-budget-calculations';

interface BudgetMetricsProps {
  budget: Budget;
  transactions: Transaction[];
}

export function BudgetMetrics({ budget, transactions }: BudgetMetricsProps) {
  // Custom hook for business logic
  const { totalSpent, available, percentageUsed } = useBudgetCalculations(budget, transactions);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Budget */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Presupuesto Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${budget.total_amount.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Spent */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gastado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${totalSpent.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Available */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Disponible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${available.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Progreso del Presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={percentageUsed} className="h-3" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{percentageUsed.toFixed(1)}% utilizado</span>
            <span>{(100 - percentageUsed).toFixed(1)}% restante</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 3. `BudgetTransactionList` (Organism)

**File**: `src/domains/budget/components/organisms/budget-transaction-list.tsx`
**Type**: Client Component (interactive table)
**Purpose**: Display list of transactions related to the budget

```typescript
'use client';

import { Transaction } from '@/lib/repositories';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/molecules/empty-state';
import { ArrowUpCircle, ArrowDownCircle, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BudgetTransactionListProps {
  budgetId: string;
  transactions: Transaction[];
  isLoading: boolean;
}

export function BudgetTransactionList({
  budgetId,
  transactions,
  isLoading
}: BudgetTransactionListProps) {
  if (isLoading) {
    return <div>Cargando transacciones...</div>;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No hay movimientos"
        description="Aún no hay transacciones asociadas a este presupuesto"
        actionLabel="Agregar Movimiento"
        onAction={() => window.location.href = `/movimientos/crear?budgetId=${budgetId}`}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos del Presupuesto</CardTitle>
        <CardDescription>
          {transactions.length} {transactions.length === 1 ? 'movimiento' : 'movimientos'} registrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.type === 'income' ? (
                    <Badge variant="default" className="gap-1">
                      <ArrowUpCircle className="h-3 w-3" />
                      Ingreso
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <ArrowDownCircle className="h-3 w-3" />
                      Gasto
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>{transaction.description || '-'}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

### Business Logic Hooks to Create

#### 4. `useBudgetCalculations` (Custom Hook)

**File**: `src/domains/budget/hooks/use-budget-calculations.ts`
**Type**: Custom Hook (business logic)
**Purpose**: Calculate budget metrics (spent, available, percentage)

```typescript
'use client';

import { useMemo } from 'react';
import { Budget, Transaction } from '@/lib/repositories';

/**
 * Custom hook for budget calculations
 * Encapsulates business logic for budget metrics
 */
export function useBudgetCalculations(budget: Budget, transactions: Transaction[]) {
  const calculations = useMemo(() => {
    // Calculate total spent (only expenses)
    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total income
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate available (budget + income - expenses)
    const available = budget.total_amount + totalIncome - totalSpent;

    // Calculate percentage used
    const percentageUsed = budget.total_amount > 0
      ? (totalSpent / budget.total_amount) * 100
      : 0;

    return {
      totalSpent,
      totalIncome,
      available,
      percentageUsed: Math.min(percentageUsed, 100), // Cap at 100%
      isOverBudget: available < 0,
      transactionCount: transactions.length,
      expenseCount: transactions.filter(t => t.type === 'expense').length,
      incomeCount: transactions.filter(t => t.type === 'income').length,
    };
  }, [budget, transactions]);

  return calculations;
}
```

## 8. Component Placement Strategy

### Domain Components (Budget)
- **Location**: `src/domains/budget/components/organisms/`
  - `budget-detail-header.tsx`
  - `budget-metrics.tsx`
  - `budget-transaction-list.tsx`

### Business Logic Hooks
- **Location**: `src/domains/budget/hooks/`
  - `use-budget-calculations.ts`

### Shared Components (already exist)
- `src/components/templates/page-layout.tsx` - Page wrapper
- `src/components/molecules/empty-state.tsx` - Empty state UI
- `src/components/ui/*` - shadcn/ui primitives

## 9. Files to Create

### Route Files

1. **`app/(app)/presupuesto/[id]/page.tsx`**
   - Purpose: Budget detail page
   - Type: Client Component
   - Exports: `default export function BudgetDetailPage()`

2. **`app/(app)/presupuesto/[id]/loading.tsx`**
   - Purpose: Loading state
   - Type: Server Component
   - Exports: `default export function BudgetDetailLoading()`

3. **`app/(app)/presupuesto/[id]/error.tsx`**
   - Purpose: Error boundary
   - Type: Client Component (required)
   - Exports: `default export function BudgetDetailError()`

### Domain Components

4. **`src/domains/budget/components/organisms/budget-detail-header.tsx`**
   - Purpose: Budget header with info and actions
   - Type: Client Component
   - Exports: `export function BudgetDetailHeader()`

5. **`src/domains/budget/components/organisms/budget-metrics.tsx`**
   - Purpose: Budget metrics display
   - Type: Client Component
   - Exports: `export function BudgetMetrics()`

6. **`src/domains/budget/components/organisms/budget-transaction-list.tsx`**
   - Purpose: Transaction list for budget
   - Type: Client Component
   - Exports: `export function BudgetTransactionList()`

### Business Logic

7. **`src/domains/budget/hooks/use-budget-calculations.ts`**
   - Purpose: Budget calculation logic
   - Type: Custom Hook
   - Exports: `export function useBudgetCalculations()`

## 10. Files to Modify

### 1. `app/(app)/presupuesto/page.tsx`
**Change**: Add navigation to detail page when clicking on budget row

**Add**:
```typescript
// In TableRow mapping
<TableRow
  key={budget.id}
  className="cursor-pointer hover:bg-muted/50"
  onClick={() => router.push(`/presupuesto/${budget.id}`)}
>
  {/* Existing table cells */}
</TableRow>
```

**Note**: Keep existing dropdown actions (edit, delete) - they should stop propagation to avoid triggering navigation.

### 2. `src/components/templates/page-layout.tsx` (if needed)
**Check if exists**: `showBackButton` and `backHref` props
**If not**: Add optional back button support

```typescript
interface PageLayoutProps {
  // ... existing props
  showBackButton?: boolean;
  backHref?: string;
}
```

## 11. Implementation Steps

1. **Create route structure**:
   - Create `app/(app)/presupuesto/[id]/` directory
   - Create `page.tsx`, `loading.tsx`, `error.tsx`

2. **Create business logic hook**:
   - Create `src/domains/budget/hooks/use-budget-calculations.ts`
   - Implement calculation logic (spent, available, percentage)
   - Add unit tests

3. **Create domain components**:
   - Create `budget-detail-header.tsx`
   - Create `budget-metrics.tsx` (integrate hook)
   - Create `budget-transaction-list.tsx`

4. **Implement main page**:
   - Set up data fetching with React Query hooks
   - Compose components
   - Add error handling

5. **Add navigation from list**:
   - Modify budget list page to navigate to detail view

6. **Test loading and error states**:
   - Test loading.tsx rendering
   - Test error.tsx with invalid ID
   - Test with no transactions

7. **Mobile responsive testing**:
   - Test layout on mobile
   - Verify table scrolling
   - Check metrics grid responsiveness

8. **Add messages to text maps**:
   - Add new messages to `src/domains/budget/messages.ts`
   - Follow externalization pattern

## 12. Metadata and SEO

### Dynamic Metadata

**File**: `app/(app)/presupuesto/[id]/page.tsx`

```typescript
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  // Note: This requires making the component async or using a separate function
  // For now, use static metadata since budget name needs to be fetched

  return {
    title: 'Detalle del Presupuesto - Mis Finanzas',
    description: 'Visualiza el detalle de tu presupuesto y movimientos asociados',
  };
}
```

**Note**: Since this is a Client Component due to React Query hooks, metadata should be static. For dynamic metadata, consider using a separate Server Component wrapper or middleware.

## 13. Performance Considerations

### React Query Caching
- Both `useBudget` and `useTransactionsByBudget` use React Query caching
- Data is cached and shared across components
- Background refetching keeps data fresh

### Code Splitting
- Client Components are automatically code-split
- Page bundle includes only necessary components
- Shared components are reused from existing bundles

### Optimizations
- Use `useMemo` in `useBudgetCalculations` to avoid recalculating on every render
- Transactions list uses virtualization if needed (consider `@tanstack/react-virtual` for large lists)
- Images/icons lazy loaded by Next.js automatically

## 14. Important Notes

⚠️ **Client Component Required** - Page uses React Query hooks, so must be Client Component
⚠️ **Existing Hooks** - Use `useBudget()` and `useTransactionsByBudget()` from `@/lib/hooks`
⚠️ **Business Logic in Hooks** - Extract calculations to `useBudgetCalculations` hook
💡 **Mobile-First** - Design mobile layout first, then enhance for desktop
💡 **Empty States** - Handle case when budget has no transactions
💡 **Error Handling** - Comprehensive error states (budget not found, network errors)
📝 **Text Externalization** - Add all new text to `src/domains/budget/messages.ts`
🎯 **Component Composition** - Keep page simple, delegate to domain organisms

## 15. Coordination with Other Agents

### Domain Architect
- **Needs**: `useBudgetCalculations` hook for metrics logic
- **Provides**: Clean separation of business logic from UI

### UX Designer
- **Receives**: Component structure from this plan
- **Provides**: Mobile-first layout designs for metrics and transaction list

### Code Reviewer
- **Reviews**: Component architecture, hook implementation, error handling
- **Validates**: Follows critical constraints (React Query for server state, hooks for logic)

## 16. Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│  app/(app)/presupuesto/[id]/page.tsx        │
│  (Client Component)                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ useBudget(id)                       │   │
│  │   → BudgetRepository                │   │
│  │   → React Query Cache               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ useTransactionsByBudget(budgetId)   │   │
│  │   → TransactionRepository           │   │
│  │   → React Query Cache               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ↓ Pass data to presentation components    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ BudgetDetailHeader                  │   │
│  │   - budget prop                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ BudgetMetrics                       │   │
│  │   - budget prop                     │   │
│  │   - transactions prop               │   │
│  │   ↓                                 │   │
│  │   useBudgetCalculations()           │   │
│  │     → Calculate metrics             │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ BudgetTransactionList               │   │
│  │   - budgetId prop                   │   │
│  │   - transactions prop               │   │
│  │   - isLoading prop                  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 17. Testing Strategy

### Unit Tests
- `useBudgetCalculations` hook
  - Test spent calculation
  - Test available calculation
  - Test percentage calculation
  - Test over-budget scenario

### Integration Tests
- Budget detail page rendering
- Data fetching with React Query
- Error states
- Empty states

### E2E Tests (recommended)
- Navigate from budget list to detail
- View budget metrics
- View transaction list
- Handle invalid budget ID

## 18. Accessibility Considerations

- Use semantic HTML (tables for transaction list)
- Add proper ARIA labels for metrics
- Ensure keyboard navigation works for interactive elements
- Color contrast for metrics (green/red text)
- Screen reader friendly table structure

## 19. Future Enhancements (Out of Scope)

- Export budget report to PDF
- Filter/sort transactions by date, type, amount
- Graphical charts for spending trends
- Budget comparison with previous periods
- Transaction search within budget
- Bulk transaction operations

## 20. Summary

**Routes Created**:
- `/presupuesto/[id]` → `app/(app)/presupuesto/[id]/page.tsx` (Client Component)

**Components Created**:
- `BudgetDetailHeader` (displays budget info and actions)
- `BudgetMetrics` (displays calculated metrics with progress bar)
- `BudgetTransactionList` (displays related transactions)

**Hooks Created**:
- `useBudgetCalculations` (encapsulates budget metric calculations)

**Data Flow**:
- React Query hooks: `useBudget()`, `useTransactionsByBudget()`
- Business logic: `useBudgetCalculations()`
- Presentation: Domain organisms

**Key Decisions**:
1. Client Component page (requires React Query hooks)
2. Business logic in custom hook (separation of concerns)
3. Component composition (header + metrics + list)
4. Mobile-first responsive design
5. Comprehensive error and loading states

**Next Steps for Parent Agent**:
1. Create route directory structure
2. Implement `useBudgetCalculations` hook
3. Create domain organism components
4. Implement main page with data fetching
5. Add navigation from budget list page
6. Test loading and error states
7. Verify mobile responsiveness
