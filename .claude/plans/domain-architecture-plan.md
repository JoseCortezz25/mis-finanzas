# Domain Architecture Plan - Mis Finanzas (HYBRID OFFLINE-FIRST)

**Created**: 2025-12-30  
**Updated**: 2025-12-30 (COMPLETE REWRITE)  
**Session**: 1767147315  
**Agent**: domain-architect  
**Complexity**: High (Supabase + IndexedDB Hybrid Offline-First Architecture)

---

## ⚠️ CRITICAL ARCHITECTURE CHANGE

**This plan represents a COMPLETE rewrite from IndexedDB-only to Supabase + IndexedDB hybrid architecture.**

### OLD Architecture (Replaced):

```
Component (Client) → IndexedDB (Browser) ← Only storage
```

### NEW Architecture (Current):

```
Component (Client)
    ↓
Server Action (Server) ← Repository Pattern + Session Validation
    ↓
Supabase Database (PostgreSQL) ← Source of Truth
    ↓
Sync to IndexedDB (Client) ← Offline Cache
```

**Key Changes**:

1. **Supabase PostgreSQL** is now the PRIMARY database (source of truth)
2. **IndexedDB** is now a CACHE layer for offline capability
3. **Server Actions** handle ALL data operations (with session validation)
4. **Repository Pattern** on the server-side (Supabase repositories)
5. **Offline Sync Manager** syncs pending changes when back online

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Supabase Database Schema](#2-supabase-database-schema)
3. [Repository Pattern (Server-Side)](#3-repository-pattern-server-side)
4. [Server Actions Architecture](#4-server-actions-architecture)
5. [IndexedDB Cache Layer](#5-indexeddb-cache-layer)
6. [Offline Sync Manager](#6-offline-sync-manager)
7. [React Query Integration](#7-react-query-integration)
8. [Domain: auth](#8-domain-auth)
9. [Domain: budgets](#9-domain-budgets)
10. [Domain: categories](#10-domain-categories)
11. [Domain: transactions](#11-domain-transactions)
12. [Domain: goals](#12-domain-goals)
13. [Domain: reports](#13-domain-reports)
14. [Domain: settings](#14-domain-settings)
15. [Migration from Old Architecture](#15-migration-from-old-architecture)
16. [Implementation Steps](#16-implementation-steps)
17. [Files to Create](#17-files-to-create)

---

## 1. Architectural Overview

### 1.1 Hybrid Offline-First Strategy

**Mis Finanzas uses a hybrid storage model with offline-first capability**:

- **Supabase PostgreSQL**: Primary database (source of truth)
- **IndexedDB**: Offline cache layer (synced from Supabase)
- **Sync Manager**: Handles online/offline transitions and data synchronization

### 1.2 Data Flow Architecture

#### Online Mode (Default):

```
1. User action → Server Action
2. Server Action → Validate session (Supabase Auth)
3. Server Action → Validate input (Zod)
4. Server Action → Business rules check
5. Server Action → Repository → Supabase DB
6. Success → revalidatePath()
7. Background: Sync to IndexedDB cache
```

#### Offline Mode:

```
1. User action → Detected offline
2. Write to IndexedDB with _pendingSync flag
3. Show "Pending sync" indicator
4. When online: Sync Manager → Server Action → Supabase DB
5. Remove _pendingSync flag
```

#### Read Strategy:

```
1. Online: React Query → Server Action → Supabase DB
2. Offline: React Query → IndexedDB cache
3. Stale-while-revalidate pattern
```

### 1.3 State Management Strategy

| State Type        | Tool              | Usage                                                                       |
| ----------------- | ----------------- | --------------------------------------------------------------------------- |
| **Server Data**   | React Query       | Budgets, transactions, categories, goals (from Supabase via Server Actions) |
| **Offline Cache** | IndexedDB         | Mirror of Supabase data for offline access                                  |
| **Pending Sync**  | IndexedDB + Queue | Operations waiting for online connection                                    |
| **Auth State**    | Zustand           | User session (from Supabase Auth)                                           |
| **UI State**      | Zustand           | Filters, sidebar, date ranges                                               |
| **Form State**    | React Hook Form   | Create/edit forms with Zod validation                                       |

### 1.4 Component Strategy

**ALL components use Server Actions for data operations:**

```typescript
// Page (Server Component)
export default function BudgetsPage() {
  return <BudgetsClient />;
}

// Client Component
'use client';
function BudgetsClient() {
  const { data, isLoading } = useBudgets(); // Calls Server Action via React Query
  const createBudget = useCreateBudget(); // Mutation via Server Action
}
```

### 1.5 Offline Detection

```typescript
// src/lib/offline/offline-detector.ts
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

## 2. Supabase Database Schema

### 2.1 Database Structure

**Database**: Supabase PostgreSQL (cloud-hosted)  
**Authentication**: Supabase Auth (integrated)  
**Row Level Security (RLS)**: Enabled on ALL tables

### 2.2 Tables

#### Table: `users`

**Purpose**: Extended user profile (links to auth.users)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  currency TEXT DEFAULT 'MXN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

#### Table: `budgets`

**Purpose**: Monthly budgets with category allocations

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount > 0), -- BR-1.3
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12), -- BR-1.1
  year INTEGER NOT NULL CHECK (year BETWEEN 2000 AND 2100), -- BR-1.1
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'closed')), -- BR-1.5
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- BR-1.2: One budget per month/year per user
  CONSTRAINT unique_user_month_year UNIQUE (user_id, month, year)
);

-- Indexes
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_month_year ON budgets(month, year);
CREATE INDEX idx_budgets_status ON budgets(status);

-- RLS Policies
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own budgets"
  ON budgets
  USING (auth.uid() = user_id);
```

---

#### Table: `category_allocations`

**Purpose**: Budget category allocations (linked to budgets)

```sql
CREATE TABLE category_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  allocated_amount NUMERIC(12, 2) NOT NULL CHECK (allocated_amount >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_budget_category UNIQUE (budget_id, category_id)
);

-- Indexes
CREATE INDEX idx_allocations_budget_id ON category_allocations(budget_id);
CREATE INDEX idx_allocations_category_id ON category_allocations(category_id);

-- RLS Policies
ALTER TABLE category_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage allocations for own budgets"
  ON category_allocations
  USING (EXISTS (
    SELECT 1 FROM budgets
    WHERE budgets.id = category_allocations.budget_id
    AND budgets.user_id = auth.uid()
  ));
```

---

#### Table: `categories`

**Purpose**: Spending categories (default + custom)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for defaults
  name TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'), -- BR-2.5
  icon TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- BR-2.1: Unique category name per user (or global defaults)
  CONSTRAINT unique_user_category_name UNIQUE (user_id, name)
);

-- Indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_is_custom ON categories(is_custom);

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all categories (defaults + own custom)"
  ON categories FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can CRUD own custom categories"
  ON categories FOR ALL
  USING (user_id = auth.uid() AND is_custom = true);
```

**Seed Default Categories**:

```sql
INSERT INTO categories (id, user_id, name, color, icon, is_custom) VALUES
  ('default-housing', NULL, 'Housing', '#3B82F6', 'home', false),
  ('default-food', NULL, 'Food', '#EF4444', 'utensils', false),
  ('default-transportation', NULL, 'Transportation', '#F59E0B', 'car', false),
  ('default-entertainment', NULL, 'Entertainment', '#8B5CF6', 'film', false),
  ('default-healthcare', NULL, 'Healthcare', '#10B981', 'heart', false),
  ('default-personal', NULL, 'Personal', '#EC4899', 'user', false),
  ('default-utilities', NULL, 'Utilities', '#6366F1', 'bolt', false),
  ('default-savings', NULL, 'Savings', '#14B8A6', 'piggy-bank', false),
  ('default-other', NULL, 'Other', '#6B7280', 'dots', false);
```

---

#### Table: `transactions`

**Purpose**: Income and expense records

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')), -- TR-1.2
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0), -- TR-1.1
  date DATE NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit_card', 'credit_card', 'bank_transfer', 'other')),
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- RLS Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own transactions"
  ON transactions
  USING (auth.uid() = user_id);
```

---

#### Table: `goals` (Phase 2)

**Purpose**: Savings goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline DATE,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- RLS Policies
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own goals"
  ON goals
  USING (auth.uid() = user_id);
```

---

#### Table: `user_settings` (Phase 2)

**Purpose**: User preferences and settings

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'MXN',
  locale TEXT DEFAULT 'es-MX',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own settings"
  ON user_settings
  USING (auth.uid() = user_id);
```

---

### 2.3 Database Functions

#### Function: Auto-Update `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

---

## 3. Repository Pattern (Server-Side)

### 3.1 Abstract Base Repository

**File**: `src/lib/supabase/base-repository.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js';

export abstract class SupabaseRepository<T extends { id: string }> {
  constructor(
    protected supabase: SupabaseClient,
    protected tableName: string
  ) {}

  async findAll(userId: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error)
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    return data as T[];
  }

  async findById(id: string, userId: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }

    return data as T | null;
  }

  async create(data: Partial<T>, userId: string): Promise<T> {
    const { data: created, error } = await this.supabase
      .from(this.tableName)
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    return created as T;
  }

  async update(id: string, data: Partial<T>, userId: string): Promise<T> {
    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    return updated as T;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error)
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`);
  }

  async count(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error)
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    return count || 0;
  }
}
```

---

## 4. Server Actions Architecture

### 4.1 Server Action Pattern (Mandatory for ALL Data Operations)

**ALL Server Actions MUST follow this structure:**

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BudgetRepository } from './repository';
import { createBudgetSchema } from './schema';

export async function createBudget(input: unknown) {
  // ✅ 1. Get authenticated session (MANDATORY)
  const supabase = createServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // ✅ 2. Validate input with Zod
    const validated = createBudgetSchema.parse(input);

    // ✅ 3. Business rules validation
    const budgetRepo = new BudgetRepository(supabase);
    const existing = await budgetRepo.findByMonthYear(
      user.id,
      validated.month,
      validated.year
    );

    if (existing) {
      return {
        success: false,
        error: `A budget for ${validated.month}/${validated.year} already exists`
      };
    }

    // ✅ 4. Repository operation
    const budget = await budgetRepo.create(validated, user.id);

    // ✅ 5. Revalidate cache
    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

**Key Requirements**:

1. ✅ **Session Validation**: ALWAYS check `auth.getUser()` first
2. ✅ **Input Validation**: Use Zod schemas for type safety
3. ✅ **Business Rules**: Check rules before DB operations
4. ✅ **Repository Pattern**: Use repositories, NOT direct Supabase calls
5. ✅ **Revalidation**: Call `revalidatePath()` after mutations
6. ✅ **Error Handling**: Return structured error objects

---

## 5. IndexedDB Cache Layer

### 5.1 IndexedDB as Cache (NOT Source of Truth)

**IndexedDB stores a MIRROR of Supabase data for offline access.**

**Database Name**: `misfinanzas_cache_v1`  
**Version**: 1

### 5.2 Object Stores (Same Structure as Supabase)

```typescript
// src/lib/offline/indexeddb-cache.ts

interface CachedRecord {
  // Same fields as Supabase
  id: string;
  user_id: string;
  // ... other fields

  // Cache metadata
  _cached_at: number; // Timestamp when cached
  _pending_sync: boolean; // True if offline mutation pending
}

export async function initCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('misfinanzas_cache_v1', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Cache stores (mirror Supabase tables)
      if (!db.objectStoreNames.contains('budgets')) {
        const budgets = db.createObjectStore('budgets', { keyPath: 'id' });
        budgets.createIndex('user_id', 'user_id');
        budgets.createIndex('_pending_sync', '_pending_sync');
      }

      if (!db.objectStoreNames.contains('transactions')) {
        const txns = db.createObjectStore('transactions', { keyPath: 'id' });
        txns.createIndex('user_id', 'user_id');
        txns.createIndex('_pending_sync', '_pending_sync');
      }

      // Repeat for categories, goals, etc.
    };
  });
}
```

### 5.3 Cache Operations

```typescript
// src/lib/offline/cache-service.ts

export class CacheService {
  /**
   * Write to cache after successful Supabase operation
   */
  async cacheRecord(table: string, record: any): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction([table], 'readwrite');
    const store = tx.objectStore(table);

    const cached = {
      ...record,
      _cached_at: Date.now(),
      _pending_sync: false
    };

    await store.put(cached);
  }

  /**
   * Read from cache (used when offline)
   */
  async readFromCache(table: string, userId: string): Promise<any[]> {
    const db = await initCacheDB();
    const tx = db.transaction([table], 'readonly');
    const store = tx.objectStore(table);
    const index = store.index('user_id');

    const records = await index.getAll(userId);
    return records.filter(r => !r._pending_sync); // Exclude pending
  }

  /**
   * Write pending operation (offline mutation)
   */
  async writePending(table: string, record: any): Promise<void> {
    const db = await initCacheDB();
    const tx = db.transaction([table], 'readwrite');
    const store = tx.objectStore(table);

    const pending = {
      ...record,
      _cached_at: Date.now(),
      _pending_sync: true
    };

    await store.put(pending);
  }

  /**
   * Get all pending operations
   */
  async getPendingOps(table: string): Promise<any[]> {
    const db = await initCacheDB();
    const tx = db.transaction([table], 'readonly');
    const store = tx.objectStore(table);
    const index = store.index('_pending_sync');

    return await index.getAll(true);
  }
}

export const cacheService = new CacheService();
```

---

## 6. Offline Sync Manager

### 6.1 Sync Manager Architecture

**File**: `src/lib/offline/sync-manager.ts`

```typescript
'use client';

import { useEffect } from 'react';
import { useOnlineStatus } from './offline-detector';
import { cacheService } from './cache-service';

export function SyncManager() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      syncPendingOperations();
    }
  }, [isOnline]);

  return null; // No UI, background process
}

async function syncPendingOperations() {
  const tables = ['budgets', 'transactions', 'categories', 'goals'];

  for (const table of tables) {
    const pending = await cacheService.getPendingOps(table);

    for (const record of pending) {
      try {
        // Call appropriate Server Action
        await syncRecord(table, record);

        // Remove _pending_sync flag
        await cacheService.cacheRecord(table, {
          ...record,
          _pending_sync: false
        });
      } catch (error) {
        console.error(`Failed to sync ${table} record:`, error);
        // Keep _pending_sync flag for retry
      }
    }
  }
}

async function syncRecord(table: string, record: any) {
  // Call Server Action based on table
  switch (table) {
    case 'budgets':
      return createBudgetAction(record); // Server Action
    case 'transactions':
      return createTransactionAction(record);
    // ... other tables
  }
}
```

### 6.2 Offline Detection & Fallback

```typescript
// src/lib/offline/offline-detector.ts
'use client';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online. Syncing data...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Changes will sync when reconnected.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

## 7. React Query Integration

### 7.1 React Query with Server Actions

**Pattern**: React Query calls Server Actions (Server Actions call Supabase)

```typescript
// src/domains/budgets/hooks/use-budgets.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} from '../actions';
import { cacheService } from '@/lib/offline/cache-service';
import { useOnlineStatus } from '@/lib/offline/offline-detector';

export function useBudgets() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      if (isOnline) {
        // Online: Fetch from Supabase via Server Action
        const result = await getBudgets();

        if (result.success && result.data) {
          // Cache in IndexedDB
          for (const budget of result.data) {
            await cacheService.cacheRecord('budgets', budget);
          }
          return result.data;
        }

        throw new Error(result.error || 'Failed to fetch budgets');
      } else {
        // Offline: Read from IndexedDB cache
        return cacheService.readFromCache('budgets', userId);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000 // 30 minutes
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (input: CreateBudgetInput) => {
      if (isOnline) {
        // Online: Server Action → Supabase
        const result = await createBudget(input);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Cache result
        await cacheService.cacheRecord('budgets', result.data);

        return result.data;
      } else {
        // Offline: Write to IndexedDB with pending flag
        const budget = {
          id: uuidv4(),
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await cacheService.writePending('budgets', budget);

        return budget;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });
}
```

---

## 8. Domain: auth

### 8.1 Overview

**Purpose**: User authentication using Supabase Auth  
**Storage**: Supabase Auth  
**Special**: ONLY domain that uses Server Actions for auth operations

### 8.2 Server Actions

```typescript
// src/domains/auth/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { registerSchema, loginSchema } from './schema';
import { redirect } from 'next/navigation';

export async function registerAction(input: unknown) {
  try {
    const validated = registerSchema.parse(input);

    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: { display_name: validated.displayName }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create user profile in users table
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: validated.email,
        display_name: validated.displayName
      });
    }

    redirect('/dashboard');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
}

export async function loginAction(input: unknown) {
  try {
    const validated = loginSchema.parse(input);

    const supabase = createServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    redirect('/dashboard');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
}

export async function logoutAction() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}
```

### 8.3 Files to Create

1. `src/domains/auth/types.ts` - User, AuthSession interfaces
2. `src/domains/auth/schema.ts` - Zod schemas for register/login
3. `src/domains/auth/actions.ts` - Server Actions (register, login, logout)
4. `src/domains/auth/hooks/use-auth.ts` - Auth state management
5. `src/domains/auth/errors.ts` - Custom error classes

---

## 9. Domain: budgets

### 9.1 Repository

```typescript
// src/domains/budgets/repository.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRepository } from '@/lib/supabase/base-repository';
import type { Budget, BudgetStatus } from './types';

export class BudgetRepository extends SupabaseRepository<Budget> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'budgets');
  }

  async findByMonthYear(
    userId: string,
    month: number,
    year: number
  ): Promise<Budget | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch budget: ${error.message}`);
    }

    return data as Budget | null;
  }

  async findActive(userId: string): Promise<Budget[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active budgets: ${error.message}`);
    }

    return data as Budget[];
  }

  async calculateSpent(budgetId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('amount')
      .eq('budget_id', budgetId)
      .eq('type', 'expense');

    if (error) {
      throw new Error(`Failed to calculate spent: ${error.message}`);
    }

    return data.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }
}
```

### 9.2 Server Actions

```typescript
// src/domains/budgets/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BudgetRepository } from './repository';
import { createBudgetSchema } from './schema';

export async function getBudgets() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const repo = new BudgetRepository(supabase);
    const budgets = await repo.findAll(user.id);

    return { success: true, data: budgets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch budgets'
    };
  }
}

export async function createBudget(input: unknown) {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const validated = createBudgetSchema.parse(input);

    // BR-1.2: Check uniqueness
    const repo = new BudgetRepository(supabase);
    const existing = await repo.findByMonthYear(
      user.id,
      validated.month,
      validated.year
    );

    if (existing) {
      return {
        success: false,
        error: `A budget for ${validated.month}/${validated.year} already exists`
      };
    }

    const budget = await repo.create(validated, user.id);

    revalidatePath('/presupuesto');

    return { success: true, data: budget };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create budget'
    };
  }
}

// Similar patterns for updateBudget, deleteBudget, etc.
```

### 9.3 Files to Create

1. `src/domains/budgets/types.ts` - Budget, CategoryAllocation interfaces
2. `src/domains/budgets/schema.ts` - Zod schemas
3. `src/domains/budgets/repository.ts` - BudgetRepository class
4. `src/domains/budgets/actions.ts` - Server Actions (CRUD)
5. `src/domains/budgets/hooks/use-budgets.ts` - React Query hooks
6. `src/domains/budgets/services/budget-calculations.ts` - Business logic

---

## 10. Domain: categories

### 10.1 Repository

```typescript
// src/domains/categories/repository.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRepository } from '@/lib/supabase/base-repository';
import type { Category } from './types';

export class CategoryRepository extends SupabaseRepository<Category> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'categories');
  }

  async findDefaults(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .is('user_id', null)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch default categories: ${error.message}`);
    }

    return data as Category[];
  }

  async findCustom(userId: string): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_custom', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch custom categories: ${error.message}`);
    }

    return data as Category[];
  }

  async findAllForUser(userId: string): Promise<Category[]> {
    const [defaults, custom] = await Promise.all([
      this.findDefaults(),
      this.findCustom(userId)
    ]);

    return [...defaults, ...custom];
  }
}
```

### 10.2 Files to Create

1. `src/domains/categories/types.ts` - Category interface
2. `src/domains/categories/schema.ts` - Zod schemas
3. `src/domains/categories/repository.ts` - CategoryRepository class
4. `src/domains/categories/actions.ts` - Server Actions
5. `src/domains/categories/hooks/use-categories.ts` - React Query hooks

---

## 11. Domain: transactions

### 11.1 Repository

```typescript
// src/domains/transactions/repository.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRepository } from '@/lib/supabase/base-repository';
import type { Transaction } from './types';

export class TransactionRepository extends SupabaseRepository<Transaction> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'transactions');
  }

  async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return data as Transaction[];
  }

  async findByCategory(
    userId: string,
    categoryId: string
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return data as Transaction[];
  }

  async sumByType(
    userId: string,
    type: 'income' | 'expense',
    dateRange?: { start: string; end: string }
  ): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select('amount')
      .eq('user_id', userId)
      .eq('type', type);

    if (dateRange) {
      query = query.gte('date', dateRange.start).lte('date', dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to sum transactions: ${error.message}`);
    }

    return data.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }
}
```

### 11.2 Files to Create

1. `src/domains/transactions/types.ts` - Transaction interface
2. `src/domains/transactions/schema.ts` - Zod schemas
3. `src/domains/transactions/repository.ts` - TransactionRepository class
4. `src/domains/transactions/actions.ts` - Server Actions
5. `src/domains/transactions/hooks/use-transactions.ts` - React Query hooks
6. `src/domains/transactions/services/transaction-calculations.ts` - Business logic

---

## 12. Domain: goals

### 12.1 Files to Create (Phase 2)

1. `src/domains/goals/types.ts` - Goal interface
2. `src/domains/goals/schema.ts` - Zod schemas
3. `src/domains/goals/repository.ts` - GoalRepository class
4. `src/domains/goals/actions.ts` - Server Actions
5. `src/domains/goals/hooks/use-goals.ts` - React Query hooks

---

## 13. Domain: reports

### 13.1 Overview

**Purpose**: Generate reports from transaction and budget data  
**Storage**: Computed (no persistence)  
**Data Source**: Supabase via Server Actions

### 13.2 Files to Create

1. `src/domains/reports/types.ts` - Report interfaces
2. `src/domains/reports/services/report-generation.ts` - Report generators
3. `src/domains/reports/hooks/use-reports.ts` - React Query hooks

---

## 14. Domain: settings

### 14.1 Files to Create (Phase 2)

1. `src/domains/settings/types.ts` - UserSettings interface
2. `src/domains/settings/schema.ts` - Zod schemas
3. `src/domains/settings/repository.ts` - SettingsRepository class
4. `src/domains/settings/actions.ts` - Server Actions
5. `src/domains/settings/services/export-service.ts` - Data export logic

---

## 15. Migration from Old Architecture

### 15.1 What Changed

| Aspect                 | OLD (IndexedDB-only)                | NEW (Supabase + IndexedDB)                        |
| ---------------------- | ----------------------------------- | ------------------------------------------------- |
| **Primary Storage**    | IndexedDB (browser)                 | Supabase PostgreSQL (cloud)                       |
| **Data Operations**    | Client Components → IndexedDB       | Server Actions → Supabase                         |
| **Session Validation** | Client-side only                    | Server-side (MANDATORY)                           |
| **Offline Support**    | Native (IndexedDB always available) | IndexedDB cache + sync queue                      |
| **Repository Pattern** | Client-side (IndexedDB)             | Server-side (Supabase)                            |
| **Data Flow**          | Component → Repository → IndexedDB  | Component → Server Action → Repository → Supabase |

### 15.2 Why This Change?

**Problems with IndexedDB-only**:

- ❌ No server-side validation
- ❌ No data backup/recovery
- ❌ No cross-device sync
- ❌ Data loss if browser storage cleared
- ❌ No audit trail

**Benefits of Supabase + IndexedDB**:

- ✅ Server-side validation (secure)
- ✅ Automatic backups (Supabase)
- ✅ Multi-device sync (future)
- ✅ Data persistence (cloud)
- ✅ Offline capability (IndexedDB cache)
- ✅ Audit trail (Supabase timestamps)

---

## 16. Implementation Steps

### Phase 1: Foundation (Week 1)

- [ ] Set up Supabase project
- [ ] Create database schema (tables, indexes, RLS policies)
- [ ] Seed default categories
- [ ] Create base repository class
- [ ] Set up Server Actions infrastructure

### Phase 2: Core Domains (Weeks 2-4)

- [ ] **auth domain**: Server Actions for registration, login, logout
- [ ] **categories domain**: Repository, Server Actions, hooks
- [ ] **budgets domain**: Repository, Server Actions, hooks, calculations
- [ ] **transactions domain**: Repository, Server Actions, hooks, calculations

### Phase 3: Offline Support (Week 5)

- [ ] IndexedDB cache layer
- [ ] Offline detection hook
- [ ] Sync Manager
- [ ] React Query integration with online/offline fallback

### Phase 4: Advanced Features (Weeks 6-7)

- [ ] **goals domain**: Repository, Server Actions, hooks
- [ ] **reports domain**: Report generators, hooks
- [ ] **settings domain**: Repository, Server Actions, export functionality

### Phase 5: Testing & Optimization (Week 8)

- [ ] Integration tests (Supabase + Server Actions)
- [ ] Offline scenario testing
- [ ] Performance optimization
- [ ] RLS policy verification

---

## 17. Files to Create

### Infrastructure (7 files)

1. `src/lib/supabase/server.ts` - Supabase server client
2. `src/lib/supabase/client.ts` - Supabase client (for client components)
3. `src/lib/supabase/base-repository.ts` - Abstract repository class
4. `src/lib/offline/indexeddb-cache.ts` - IndexedDB cache layer
5. `src/lib/offline/cache-service.ts` - Cache operations
6. `src/lib/offline/sync-manager.ts` - Offline sync manager
7. `src/lib/offline/offline-detector.ts` - Online/offline detection

### Domain: auth (5 files)

1. `src/domains/auth/types.ts`
2. `src/domains/auth/schema.ts`
3. `src/domains/auth/actions.ts`
4. `src/domains/auth/hooks/use-auth.ts`
5. `src/domains/auth/errors.ts`

### Domain: budgets (7 files)

1. `src/domains/budgets/types.ts`
2. `src/domains/budgets/schema.ts`
3. `src/domains/budgets/repository.ts`
4. `src/domains/budgets/actions.ts`
5. `src/domains/budgets/hooks/use-budgets.ts`
6. `src/domains/budgets/hooks/use-budget-summary.ts`
7. `src/domains/budgets/services/budget-calculations.ts`

### Domain: categories (5 files)

1. `src/domains/categories/types.ts`
2. `src/domains/categories/schema.ts`
3. `src/domains/categories/repository.ts`
4. `src/domains/categories/actions.ts`
5. `src/domains/categories/hooks/use-categories.ts`

### Domain: transactions (7 files)

1. `src/domains/transactions/types.ts`
2. `src/domains/transactions/schema.ts`
3. `src/domains/transactions/repository.ts`
4. `src/domains/transactions/actions.ts`
5. `src/domains/transactions/hooks/use-transactions.ts`
6. `src/domains/transactions/hooks/use-transaction-summary.ts`
7. `src/domains/transactions/services/transaction-calculations.ts`

### Domain: goals (5 files - Phase 2)

1. `src/domains/goals/types.ts`
2. `src/domains/goals/schema.ts`
3. `src/domains/goals/repository.ts`
4. `src/domains/goals/actions.ts`
5. `src/domains/goals/hooks/use-goals.ts`

### Domain: reports (3 files)

1. `src/domains/reports/types.ts`
2. `src/domains/reports/services/report-generation.ts`
3. `src/domains/reports/hooks/use-reports.ts`

### Domain: settings (5 files - Phase 2)

1. `src/domains/settings/types.ts`
2. `src/domains/settings/schema.ts`
3. `src/domains/settings/repository.ts`
4. `src/domains/settings/actions.ts`
5. `src/domains/settings/services/export-service.ts`

**Total Files**: ~50 files

---

## Summary

### New Architecture Benefits

1. **Supabase as Source of Truth**: Reliable, backed-up, scalable
2. **Server Actions for ALL operations**: Secure, validated, session-checked
3. **IndexedDB as Offline Cache**: Fast offline access
4. **Sync Manager**: Seamless online/offline transitions
5. **Repository Pattern on Server**: Clean separation of concerns
6. **RLS Policies**: Database-level security
7. **React Query Integration**: Optimal caching and state management

### Critical Constraints Followed

✅ **Server Actions MANDATORY**: All data operations through Server Actions  
✅ **Session Validation**: Every Server Action checks `auth.getUser()`  
✅ **Zod Validation**: All inputs validated before processing  
✅ **Repository Pattern**: No direct Supabase calls in Server Actions  
✅ **Business Rules**: Enforced at database level (CHECK constraints, UNIQUE) and application level  
✅ **RLS Policies**: Database-level user isolation  
✅ **Offline Support**: IndexedDB cache + sync manager

---

**END OF DOMAIN ARCHITECTURE PLAN**
