# Next.js 15 App Router Structure Plan - Mis Finanzas

**Created**: 2025-12-30  
**Session**: 1767147315  
**Agent**: nextjs-builder  
**Type**: Next.js Architecture  
**Complexity**: High

---

## 1. Executive Summary

This plan defines the complete Next.js 15 App Router structure for the Mis Finanzas personal finance management application. The architecture prioritizes Server Components by default, strategic use of Client Components for IndexedDB operations and interactivity, and follows Screaming Architecture principles.

**Key Architectural Decisions**:

- IndexedDB requires ALL data operations in Client Components
- Server Components for layouts, metadata, and static content
- Middleware for authentication (Supabase) route protection
- React Query for IndexedDB caching (not server data)
- Route groups for organization and shared layouts

**Critical Constraint**: Since ALL data lives in IndexedDB (browser storage), most pages that interact with data MUST be Client Components. Server Components will be used for layouts, metadata, and routing structure.

---

## 2. Complete Route Structure

### 2.1 Route Groups

```
app/
├── (auth)/                 # Public routes (login, register)
│   └── layout.tsx         # Minimal auth layout (Server Component)
│
└── (app)/                 # Protected routes (main application)
    └── layout.tsx         # App layout with navigation (Server Component wrapper)
```

**Why Route Groups**:

- Different layouts for auth vs app
- No URL segment pollution
- Clear separation of protected vs public

---

### 2.2 Public Routes (auth group)

#### Route: `/login`

**File**: `app/(auth)/login/page.tsx`  
**Type**: Client Component (form with state)  
**Purpose**: User authentication with Supabase  
**Metadata**: Yes (static)

```tsx
// Server Component wrapper for metadata
export const metadata = {
  title: 'Iniciar Sesión - Mis Finanzas',
  description: 'Accede a tu cuenta de Mis Finanzas'
};

export default function LoginPage() {
  return <LoginClient />;
}
```

**Client Component**: `app/(auth)/login/_components/login-client.tsx`

- Login form with React Hook Form
- Supabase authentication
- Redirect to / on success

---

#### Route: `/register`

**File**: `app/(auth)/register/page.tsx`  
**Type**: Client Component (form with state)  
**Purpose**: User registration with Supabase  
**Metadata**: Yes (static)

```tsx
// Server Component wrapper for metadata
export const metadata = {
  title: 'Registrarse - Mis Finanzas',
  description: 'Crea tu cuenta en Mis Finanzas'
};

export default function RegisterPage() {
  return <RegisterClient />;
}
```

**Client Component**: `app/(auth)/register/_components/register-client.tsx`

- Registration form with React Hook Form
- Supabase user creation
- Redirect to / on success

---

### 2.3 Protected Routes (app group)

#### Route: `/` (Home/Dashboard)

**File**: `app/(app)/page.tsx`  
**Type**: Server Component wrapper → Client Component content  
**Purpose**: Monthly financial summary dashboard  
**Metadata**: Yes (dynamic based on month)

**Data Requirements**:

- Current month budget (IndexedDB)
- Current month transactions (IndexedDB)
- Total income, expenses, balance calculations
- Top 5 spending categories
- Recent 10 transactions

**Component Structure**:

```
app/(app)/page.tsx (Server - metadata only)
└── _components/
    └── dashboard-client.tsx (Client)
        ├── monthly-summary.tsx (Client)
        ├── budget-status.tsx (Client)
        ├── quick-actions.tsx (Client)
        ├── top-categories.tsx (Client)
        └── recent-transactions.tsx (Client)
```

**IndexedDB Queries**:

- `useBudget(month, year)` - Current month budget
- `useTransactions({ month, year })` - All transactions for month
- `useCategoryTotals(month, year)` - Spending by category

---

#### Route: `/presupuesto` (Budget Management)

**File**: `app/(app)/presupuesto/page.tsx`  
**Type**: Server Component wrapper → Client Component content  
**Purpose**: Create, view, edit budgets and category allocations  
**Metadata**: Yes (static)

**Features**:

- View all budgets (list)
- Create new budget
- Edit existing budget
- Allocate categories
- Duplicate budget to new month
- Delete budget

**Component Structure**:

```
app/(app)/presupuesto/page.tsx (Server)
└── _components/
    ├── budget-list-client.tsx (Client)
    ├── budget-form-dialog.tsx (Client)
    ├── budget-card.tsx (Client)
    ├── category-allocation-form.tsx (Client)
    └── budget-summary.tsx (Client)
```

**IndexedDB Operations**:

- `useBudgets()` - All budgets for user
- `useBudget(id)` - Single budget details
- `useCreateBudget()` - Mutation for create
- `useUpdateBudget()` - Mutation for update
- `useDeleteBudget()` - Mutation for delete

---

#### Route: `/movimientos` (Transactions)

**File**: `app/(app)/movimientos/page.tsx`  
**Type**: Server Component wrapper → Client Component content  
**Purpose**: View, add, edit, delete, filter, search transactions  
**Metadata**: Yes (static)

**Features**:

- Transaction list (income/expense tabs)
- Add income transaction
- Add expense transaction
- Edit transaction
- Delete transaction
- Filter by date, category, type, budget
- Search by description

**Component Structure**:

```
app/(app)/movimientos/page.tsx (Server)
└── _components/
    ├── transactions-client.tsx (Client - main orchestrator)
    ├── transaction-tabs.tsx (Client)
    ├── transaction-list.tsx (Client)
    ├── transaction-item.tsx (Client)
    ├── transaction-form-dialog.tsx (Client)
    ├── transaction-filters.tsx (Client)
    └── transaction-search.tsx (Client)
```

**IndexedDB Operations**:

- `useTransactions(filters)` - Filtered transaction list
- `useTransaction(id)` - Single transaction
- `useCreateTransaction()` - Mutation for create
- `useUpdateTransaction()` - Mutation for update
- `useDeleteTransaction()` - Mutation for delete

---

#### Route: `/reportes` (Reports & Analytics)

**File**: `app/(app)/reportes/page.tsx`  
**Type**: Client Component (charts require client-side rendering)  
**Purpose**: Visual analytics and reports  
**Metadata**: Yes (static)

**Features**:

- Date range selector
- Monthly summary stats
- Category breakdown (pie chart)
- Spending trends (line chart)
- Month-over-month comparison
- Export to CSV

**Component Structure**:

```
app/(app)/reportes/page.tsx (Server)
└── _components/
    ├── reports-client.tsx (Client - main)
    ├── date-range-selector.tsx (Client)
    ├── summary-stats.tsx (Client)
    ├── category-pie-chart.tsx (Client)
    ├── spending-trend-chart.tsx (Client)
    ├── month-comparison.tsx (Client)
    └── export-button.tsx (Client)
```

**Chart Library**: recharts (client-side only)

**IndexedDB Operations**:

- `useTransactions({ startDate, endDate })` - Range query
- `useCategoryTotals(startDate, endDate)` - Aggregation
- `useMonthlyTotals(months)` - Time series data

---

#### Route: `/metas` (Savings Goals) - Phase 2 (P1)

**File**: `app/(app)/metas/page.tsx`  
**Type**: Server Component wrapper → Client Component content  
**Purpose**: Create and track savings goals  
**Metadata**: Yes (static)

**Features**:

- View all goals
- Create new goal
- Update goal progress
- Mark goal complete/cancelled
- View archived goals

**Component Structure**:

```
app/(app)/metas/page.tsx (Server)
└── _components/
    ├── goals-client.tsx (Client)
    ├── goal-list.tsx (Client)
    ├── goal-card.tsx (Client)
    ├── goal-form-dialog.tsx (Client)
    └── goal-progress.tsx (Client)
```

**IndexedDB Operations**:

- `useGoals()` - All active goals
- `useGoal(id)` - Single goal
- `useCreateGoal()` - Mutation
- `useUpdateGoal()` - Mutation
- `useArchiveGoal()` - Mutation

---

#### Route: `/configuracion` (Settings)

**File**: `app/(app)/configuracion/page.tsx`  
**Type**: Client Component  
**Purpose**: User preferences, categories, data management  
**Metadata**: Yes (static)

**Features**:

- Update user profile (Supabase)
- Manage custom categories (IndexedDB)
- Set currency preference
- Export all data (JSON)
- Delete account

**Component Structure**:

```
app/(app)/configuracion/page.tsx (Server)
└── _components/
    ├── settings-client.tsx (Client)
    ├── profile-settings.tsx (Client)
    ├── category-settings.tsx (Client)
    ├── preferences-settings.tsx (Client)
    ├── data-export.tsx (Client)
    └── danger-zone.tsx (Client)
```

**Operations**:

- Supabase: Profile updates
- IndexedDB: Categories, preferences
- Browser API: Download JSON export

---

#### Route: `/ayuda` (Help & Education) - Phase 3 (P3)

**File**: `app/(app)/ayuda/page.tsx`  
**Type**: Server Component (static content)  
**Purpose**: Financial tips, guides, tutorials  
**Metadata**: Yes (static)

**Component Structure**:

```
app/(app)/ayuda/page.tsx (Server)
└── Static markdown content or Server Components
```

**Note**: This is one of the few pages that can be fully Server Component since it's static educational content.

---

## 3. Layouts

### 3.1 Root Layout

**File**: `app/layout.tsx`  
**Type**: Server Component  
**Purpose**: HTML structure, global providers, metadata

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import '@/styles/main.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Mis Finanzas - Gestión Personal de Finanzas',
    template: '%s | Mis Finanzas'
  },
  description: 'Aplicación minimalista para gestionar tus finanzas personales',
  keywords: ['finanzas', 'presupuesto', 'gastos', 'ingresos']
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Providers** (Client Component):

```tsx
// components/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SupabaseProvider } from '@/domains/auth/components/supabase-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30 // 30 minutes
          }
        }
      })
  );

  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SupabaseProvider>
  );
}
```

---

### 3.2 Auth Layout

**File**: `app/(auth)/layout.tsx`  
**Type**: Server Component  
**Purpose**: Minimal layout for login/register (centered card)

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

---

### 3.3 App Layout (Protected)

**File**: `app/(app)/layout.tsx`  
**Type**: Server Component wrapper → Client Component navigation  
**Purpose**: Shared layout with navigation for all protected pages

```tsx
// app/(app)/layout.tsx
import { AppLayoutClient } from './_components/app-layout-client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
```

**Client Layout**:

```tsx
// app/(app)/_components/app-layout-client.tsx
'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Header } from '@/components/layout/header';

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user menu */}
      <Header />

      {/* Main content */}
      <main className="pb-20 md:ml-64 md:pb-0">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Bottom navigation (mobile) / Sidebar (desktop) */}
      <BottomNav currentPath={pathname} />
    </div>
  );
}
```

---

## 4. Middleware for Route Protection

**File**: `middleware.ts` (root)  
**Purpose**: Protect all routes except login/register with Supabase auth

```tsx
// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value: '',
            ...options
          });
        }
      }
    }
  );

  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Public routes that don't require auth
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login
  if (!session && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
```

---

## 5. Loading and Error States

### 5.1 Loading States

**Strategy**: Use `loading.tsx` for route-level loading, Suspense for component-level

#### Root Loading

**File**: `app/loading.tsx`  
**Type**: Server Component

```tsx
// app/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
```

#### App Loading (per route)

**Files**:

- `app/(app)/loading.tsx` - Dashboard loading skeleton
- `app/(app)/presupuesto/loading.tsx` - Budget list skeleton
- `app/(app)/movimientos/loading.tsx` - Transaction list skeleton
- `app/(app)/reportes/loading.tsx` - Chart skeleton

Each loading state should match the page layout with skeleton components.

---

### 5.2 Error States

**Strategy**: Use `error.tsx` at route level, implement graceful degradation

#### Root Error

**File**: `app/error.tsx`  
**Type**: Client Component (required)

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Algo salió mal
        </h2>
        <p className="mb-6 text-gray-600">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  );
}
```

#### App Error (per route)

**Files**:

- `app/(app)/error.tsx` - App-wide error boundary
- Route-specific error.tsx files as needed

---

### 5.3 Not Found

**File**: `app/not-found.tsx`  
**Type**: Server Component

```tsx
// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Página no encontrada
        </h2>
        <p className="mb-8 text-gray-600">
          La página que buscas no existe o ha sido movida.
        </p>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
```

---

## 6. Data Fetching Strategy

### 6.1 IndexedDB + React Query Pattern

**Key Principle**: Since ALL data is in IndexedDB (browser storage), we use React Query for caching and state management, NOT for server data fetching.

**Repository Pattern** (in domains):

```tsx
// domains/budgets/repositories/budget-repository.ts
import { openDB, type IDBPDatabase } from 'idb';
import type { Budget } from '../types';

class BudgetRepository {
  private dbName = 'misfinanzas';
  private storeName = 'budgets';

  private async getDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('budgets')) {
          const budgetStore = db.createObjectStore('budgets', {
            keyPath: 'id'
          });
          budgetStore.createIndex('userId', 'userId');
          budgetStore.createIndex('monthYear', ['userId', 'month', 'year'], {
            unique: true
          });
        }
        // Other stores...
      }
    });
  }

  async findAll(userId: string): Promise<Budget[]> {
    const db = await this.getDB();
    const index = db.transaction(this.storeName).store.index('userId');
    return index.getAll(userId);
  }

  async findById(id: string): Promise<Budget | undefined> {
    const db = await this.getDB();
    return db.get(this.storeName, id);
  }

  async create(budget: Budget): Promise<Budget> {
    const db = await this.getDB();
    await db.add(this.storeName, budget);
    return budget;
  }

  async update(budget: Budget): Promise<Budget> {
    const db = await this.getDB();
    await db.put(this.storeName, budget);
    return budget;
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(this.storeName, id);
  }
}

export const budgetRepository = new BudgetRepository();
```

**React Query Hooks**:

```tsx
// domains/budgets/hooks/use-budgets.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetRepository } from '../repositories/budget-repository';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import type { Budget } from '../types';

export function useBudgets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: () => budgetRepository.findAll(user!.id),
    enabled: !!user
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () => budgetRepository.findById(id),
    enabled: !!id
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (budget: Budget) => budgetRepository.create(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    }
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (budget: Budget) => budgetRepository.update(budget),
    onSuccess: budget => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['budgets', budget.id] });
    }
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => budgetRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id] });
    }
  });
}
```

**Usage in Components**:

```tsx
// app/(app)/presupuesto/_components/budget-list-client.tsx
'use client';

import {
  useBudgets,
  useDeleteBudget
} from '@/domains/budgets/hooks/use-budgets';
import { BudgetCard } from './budget-card';
import { Skeleton } from '@/components/ui/skeleton';

export function BudgetListClient() {
  const { data: budgets, isLoading, error } = useBudgets();
  const deleteBudget = useDeleteBudget();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error al cargar presupuestos</p>
      </div>
    );
  }

  if (!budgets?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No tienes presupuestos creados</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map(budget => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onDelete={() => deleteBudget.mutate(budget.id)}
        />
      ))}
    </div>
  );
}
```

---

### 6.2 Supabase Auth Pattern

**Hook**:

```tsx
// domains/auth/hooks/use-auth.ts
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
```

---

## 7. Metadata and SEO

### 7.1 Static Metadata

**Per route**:

```tsx
// app/(app)/presupuesto/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presupuestos',
  description: 'Gestiona tus presupuestos mensuales'
};
```

### 7.2 Dynamic Metadata

**For routes with dynamic content**:

```tsx
// app/(app)/presupuesto/[id]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Note: Can't access IndexedDB here (server-side)
  // Return generic metadata or use searchParams for title
  return {
    title: 'Detalle de Presupuesto',
    description: 'Ver y editar presupuesto'
  };
}
```

---

## 8. Navigation Component Design

### 8.1 Bottom Navigation (Mobile)

**File**: `components/layout/bottom-nav.tsx`  
**Type**: Client Component

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  CogIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: HomeIcon },
  { href: '/presupuesto', label: 'Presupuesto', icon: WalletIcon },
  { href: '/movimientos', label: 'Movimientos', icon: BanknotesIcon },
  { href: '/reportes', label: 'Reportes', icon: ChartBarIcon },
  { href: '/configuracion', label: 'Config', icon: CogIcon }
];

export function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 8.2 Sidebar Navigation (Desktop)

**File**: `components/layout/sidebar.tsx`  
**Type**: Client Component

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// Icons...

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 bottom-0 left-0 hidden w-64 border-r border-gray-200 bg-white md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Mis Finanzas</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'mb-1 flex items-center gap-3 rounded-lg px-4 py-3',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User menu at bottom */}
        <div className="border-t p-4">{/* User info and logout */}</div>
      </div>
    </aside>
  );
}
```

---

## 9. Provider Setup

### 9.1 React Query Provider

**File**: `components/providers.tsx` (already covered in section 3.1)

### 9.2 Supabase Provider

**File**: `domains/auth/components/supabase-provider.tsx`

```tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}
```

---

## 10. Implementation Steps (Order of Creation)

### Phase 1: Foundation (Week 1)

1. **Setup Middleware and Auth**
   - Create `middleware.ts` with Supabase auth
   - Create `domains/auth/` structure
   - Implement `use-auth.ts` hook
   - Implement Supabase provider

2. **Create Root Layout and Providers**
   - `app/layout.tsx` with metadata
   - `components/providers.tsx` with React Query
   - Global styles setup

3. **Create Route Groups**
   - `app/(auth)/layout.tsx`
   - `app/(app)/layout.tsx`
   - Basic navigation components

4. **Auth Pages**
   - `app/(auth)/login/page.tsx`
   - `app/(auth)/register/page.tsx`
   - Login/Register forms with React Hook Form

### Phase 2: Core Data Layer (Week 2)

5. **IndexedDB Setup**
   - Install `idb` package
   - Create database initialization
   - Implement repository pattern for each entity

6. **Budget Domain**
   - `domains/budgets/repositories/budget-repository.ts`
   - `domains/budgets/hooks/use-budgets.ts`
   - `domains/budgets/types.ts`
   - `domains/budgets/schema.ts` (Zod)

7. **Transaction Domain**
   - `domains/transactions/repositories/transaction-repository.ts`
   - `domains/transactions/hooks/use-transactions.ts`
   - `domains/transactions/types.ts`
   - `domains/transactions/schema.ts`

8. **Category Domain**
   - `domains/categories/repositories/category-repository.ts`
   - `domains/categories/hooks/use-categories.ts`
   - `domains/categories/constants.ts` (default categories)
   - `domains/categories/types.ts`

### Phase 3: Core Pages (Weeks 3-4)

9. **Dashboard Page**
   - `app/(app)/page.tsx`
   - `app/(app)/_components/dashboard-client.tsx`
   - Sub-components: monthly-summary, budget-status, etc.
   - Loading and error states

10. **Budget Page**
    - `app/(app)/presupuesto/page.tsx`
    - Budget list, form, allocation components
    - CRUD operations with React Query mutations

11. **Transactions Page**
    - `app/(app)/movimientos/page.tsx`
    - Transaction list, forms, filters
    - Income/Expense tabs
    - Search functionality

12. **Reports Page**
    - `app/(app)/reportes/page.tsx`
    - Install recharts
    - Implement charts (pie, line)
    - Date range filtering
    - CSV export

### Phase 4: Navigation and Polish (Week 5)

13. **Navigation Components**
    - Bottom navigation (mobile)
    - Sidebar (desktop)
    - Header with user menu
    - Responsive behavior

14. **Loading States**
    - Create loading.tsx for each route
    - Skeleton components
    - Suspense boundaries

15. **Error States**
    - Error boundaries for each route
    - Empty states for lists
    - Validation error displays

### Phase 5: Additional Features (Weeks 6-7)

16. **Goals Page** (P1)
    - `app/(app)/metas/page.tsx`
    - Goals domain setup
    - CRUD operations

17. **Settings Page** (P1)
    - `app/(app)/configuracion/page.tsx`
    - Profile settings
    - Category management
    - Data export

18. **Help Page** (P3)
    - `app/(app)/ayuda/page.tsx`
    - Static educational content

### Phase 6: Testing and Optimization (Week 8)

19. **Testing**
    - Unit tests for repositories
    - Integration tests for hooks
    - E2E tests for critical flows

20. **Performance Optimization**
    - React Query cache optimization
    - Code splitting
    - Image optimization
    - Bundle analysis

21. **Accessibility**
    - Keyboard navigation
    - Screen reader testing
    - Color contrast validation
    - ARIA labels

---

## 11. File Structure Summary

```
app/
├── layout.tsx                    # Root layout (Server)
├── loading.tsx                   # Root loading
├── error.tsx                     # Root error (Client)
├── not-found.tsx                 # 404 page
│
├── (auth)/
│   ├── layout.tsx               # Auth layout (Server)
│   ├── login/
│   │   ├── page.tsx             # Login page (Server wrapper)
│   │   └── _components/
│   │       └── login-client.tsx # Login form (Client)
│   └── register/
│       ├── page.tsx             # Register page (Server wrapper)
│       └── _components/
│           └── register-client.tsx
│
└── (app)/
    ├── layout.tsx               # App layout (Server wrapper)
    ├── _components/
    │   └── app-layout-client.tsx # Navigation (Client)
    │
    ├── page.tsx                 # Dashboard (Server wrapper)
    ├── loading.tsx
    ├── error.tsx
    └── _components/
        ├── dashboard-client.tsx  # Main dashboard (Client)
        ├── monthly-summary.tsx   # Client
        ├── budget-status.tsx     # Client
        ├── quick-actions.tsx     # Client
        ├── top-categories.tsx    # Client
        └── recent-transactions.tsx # Client
    │
    ├── presupuesto/
    │   ├── page.tsx             # Budget page (Server wrapper)
    │   ├── loading.tsx
    │   ├── error.tsx
    │   └── _components/
    │       ├── budget-list-client.tsx
    │       ├── budget-form-dialog.tsx
    │       ├── budget-card.tsx
    │       ├── category-allocation-form.tsx
    │       └── budget-summary.tsx
    │
    ├── movimientos/
    │   ├── page.tsx             # Transactions (Server wrapper)
    │   ├── loading.tsx
    │   ├── error.tsx
    │   └── _components/
    │       ├── transactions-client.tsx
    │       ├── transaction-tabs.tsx
    │       ├── transaction-list.tsx
    │       ├── transaction-item.tsx
    │       ├── transaction-form-dialog.tsx
    │       ├── transaction-filters.tsx
    │       └── transaction-search.tsx
    │
    ├── reportes/
    │   ├── page.tsx             # Reports (Server wrapper)
    │   ├── loading.tsx
    │   ├── error.tsx
    │   └── _components/
    │       ├── reports-client.tsx
    │       ├── date-range-selector.tsx
    │       ├── summary-stats.tsx
    │       ├── category-pie-chart.tsx
    │       ├── spending-trend-chart.tsx
    │       ├── month-comparison.tsx
    │       └── export-button.tsx
    │
    ├── metas/                   # P1
    │   ├── page.tsx
    │   ├── loading.tsx
    │   └── _components/
    │       ├── goals-client.tsx
    │       ├── goal-list.tsx
    │       ├── goal-card.tsx
    │       ├── goal-form-dialog.tsx
    │       └── goal-progress.tsx
    │
    ├── configuracion/           # P1
    │   ├── page.tsx
    │   └── _components/
    │       ├── settings-client.tsx
    │       ├── profile-settings.tsx
    │       ├── category-settings.tsx
    │       ├── preferences-settings.tsx
    │       ├── data-export.tsx
    │       └── danger-zone.tsx
    │
    └── ayuda/                   # P3
        └── page.tsx             # Server Component (static)

middleware.ts                    # Supabase auth protection

components/
├── providers.tsx                # React Query provider (Client)
├── layout/
│   ├── bottom-nav.tsx          # Mobile navigation (Client)
│   ├── sidebar.tsx             # Desktop navigation (Client)
│   └── header.tsx              # Header with user menu (Client)
└── ui/                         # shadcn components

domains/
├── auth/
│   ├── components/
│   │   └── supabase-provider.tsx
│   ├── hooks/
│   │   └── use-auth.ts
│   └── types.ts
│
├── budgets/
│   ├── repositories/
│   │   └── budget-repository.ts
│   ├── hooks/
│   │   └── use-budgets.ts
│   ├── types.ts
│   └── schema.ts
│
├── transactions/
│   ├── repositories/
│   │   └── transaction-repository.ts
│   ├── hooks/
│   │   └── use-transactions.ts
│   ├── types.ts
│   └── schema.ts
│
├── categories/
│   ├── repositories/
│   │   └── category-repository.ts
│   ├── hooks/
│   │   └── use-categories.ts
│   ├── constants.ts            # Default categories
│   └── types.ts
│
└── goals/                      # P1
    ├── repositories/
    │   └── goal-repository.ts
    ├── hooks/
    │   └── use-goals.ts
    └── types.ts
```

---

## 12. Component Count Summary

### Pages (9 total)

- **Public**: 2 (login, register)
- **Protected**: 7 (dashboard, presupuesto, movimientos, reportes, metas, configuracion, ayuda)

### Layouts (4 total)

- Root layout
- Auth layout
- App layout
- App layout client wrapper

### Route-Level Files (27+ total)

- 9 page.tsx
- 8 loading.tsx
- 8 error.tsx
- 1 not-found.tsx
- 1 middleware.ts

### Client Components (50+ total)

- Dashboard: 6 components
- Presupuesto: 5 components
- Movimientos: 7 components
- Reportes: 7 components
- Metas: 5 components
- Configuracion: 6 components
- Navigation: 3 components (bottom-nav, sidebar, header)
- Providers: 2 components
- Auth: 3 components (login, register, provider)
- Additional UI components as needed

### Repositories (4 total)

- BudgetRepository
- TransactionRepository
- CategoryRepository
- GoalRepository

### Custom Hooks (15+ total)

- Auth: use-auth
- Budgets: use-budgets, use-budget, use-create-budget, use-update-budget, use-delete-budget
- Transactions: use-transactions, use-transaction, use-create-transaction, use-update-transaction, use-delete-transaction
- Categories: use-categories, use-create-category
- Goals: use-goals, use-goal, use-create-goal

---

## 13. Critical Architecture Decisions Recap

### ✅ Server Components (Default)

- All page.tsx files (metadata)
- All layout.tsx files (structure)
- Help page (static content)
- Root error boundaries

### ✅ Client Components (Strategic Use)

- ALL components accessing IndexedDB
- ALL forms with state
- ALL charts and visualizations
- Navigation components
- Providers (React Query, Supabase)
- Interactive filters and search

### ✅ Data Strategy

- **NO server-side data fetching** (all data in browser)
- **React Query** for IndexedDB caching
- **Repository pattern** for IndexedDB access
- **Zustand** for UI state only (sidebar open, theme, etc.)

### ✅ Authentication

- **Middleware** protects routes at edge
- **Supabase** for auth only (no data storage)
- **Session** checked in middleware
- **Redirect** to login if unauthenticated

### ✅ Performance

- Route-level code splitting (automatic)
- Dynamic imports for heavy components (charts)
- React Query caching (5 min stale, 30 min GC)
- Optimistic updates for mutations

---

## 14. Next Steps for Parent Agent

1. **Read this plan thoroughly**
2. **Create session context entry** documenting this plan
3. **Start Phase 1 implementation**:
   - Middleware setup
   - Auth domain structure
   - Root layout and providers
4. **Follow implementation steps** in order (section 10)
5. **Coordinate with other agents**:
   - Domain architect for repository implementations
   - UX designer for component designs
   - shadcn builder for component selection

---

## 15. Open Questions for Clarification

1. **Timezone Handling**: Should dates be stored in UTC or user's local timezone?
2. **Currency Display**: Fixed locale (es-MX) or user preference?
3. **Budget Workflow**: Should draft budgets be visible in transaction linking?
4. **Data Migration**: Should we provide import from CSV/JSON in MVP?
5. **Offline Capability**: Should transactions created offline sync when online? (Currently: view-only offline)

---

**End of Plan**
