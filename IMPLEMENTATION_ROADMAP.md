# Implementation Roadmap - Mis Finanzas

**Project**: Personal Finance Management App (Offline-First with Cloud Sync)  
**Created**: 2025-12-30  
**Architecture**: Next.js 15 + Supabase + IndexedDB (Offline Cache)  
**Timeline**: 8-10 weeks

---

## 📐 Architecture Overview

### Hybrid Offline-First Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌────────────────────────────────────────────────┐    │
│  │  React Components                               │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  React Query Hooks                              │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Server Actions (RPC to server)                │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    │                                     │
│  ┌────────────────┴───────────────┐                    │
│  │  IndexedDB Cache                │                    │
│  │  (Offline-first fallback)       │                    │
│  └─────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                     │
                     ↓ (Network Request)
┌─────────────────────────────────────────────────────────┐
│                    Server (Next.js)                      │
│  ┌────────────────────────────────────────────────┐    │
│  │  Server Actions                                 │    │
│  │  (Session Validation + Zod Validation)         │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Repository Pattern                             │    │
│  │  (SupabaseRepository<T>)                       │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Supabase Client (Server)                      │    │
│  └─────────────────┬──────────────────────────────┘    │
└────────────────────┼────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase (Cloud Database)                   │
│  ┌────────────────────────────────────────────────┐    │
│  │  PostgreSQL Database                            │    │
│  │  - Row Level Security (RLS)                    │    │
│  │  - Business Rules as CHECK constraints         │    │
│  │  - Indexes for performance                     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Write Flow (Create/Update/Delete)**:

1. Component calls mutation hook (e.g., `useCreateBudget()`)
2. Hook invokes Server Action
3. Server Action validates session + input (Zod)
4. Repository executes database operation (Supabase)
5. Success response triggers cache update (IndexedDB)
6. React Query invalidates queries and refetches

**Read Flow (Online)**:

1. Component renders, React Query hook runs
2. Hook invokes Server Action (read operation)
3. Server fetches from Supabase
4. Data returned to client, cached in IndexedDB
5. React Query caches in memory

**Read Flow (Offline)**:

1. Component renders, React Query hook detects offline
2. Hook reads from IndexedDB cache
3. Shows cached data with "Offline" indicator
4. When online, syncs pending changes and refetches

---

## 🗂️ Project Structure

```
mis-finanzas/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Public routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (app)/                    # Protected routes
│   │   │   ├── layout.tsx            # Shared layout with navigation
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── presupuesto/
│   │   │   │   └── page.tsx
│   │   │   ├── movimientos/
│   │   │   │   └── page.tsx
│   │   │   ├── reportes/
│   │   │   │   └── page.tsx
│   │   │   ├── metas/
│   │   │   │   └── page.tsx
│   │   │   └── configuracion/
│   │   │       └── page.tsx
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── middleware.ts             # Auth protection
│   │
│   ├── domains/                      # Business logic by domain
│   │   ├── auth/
│   │   │   ├── actions.ts            # Server Actions (login, register, logout)
│   │   │   ├── schema.ts             # Zod validation
│   │   │   ├── types.ts              # TypeScript types
│   │   │   └── hooks/
│   │   │       └── use-auth.ts
│   │   ├── budgets/
│   │   │   ├── repository.ts         # BudgetRepository extends SupabaseRepository
│   │   │   ├── actions.ts            # Server Actions (CRUD)
│   │   │   ├── queries.ts            # Read operations
│   │   │   ├── schema.ts             # Zod validation
│   │   │   ├── types.ts
│   │   │   ├── services/
│   │   │   │   └── budget-calculations.ts
│   │   │   └── hooks/
│   │   │       ├── use-budgets.ts
│   │   │       └── use-budget-calculations.ts
│   │   ├── transactions/
│   │   │   ├── repository.ts
│   │   │   ├── actions.ts
│   │   │   ├── queries.ts
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── hooks/
│   │   │       ├── use-transactions.ts
│   │   │       └── use-transaction-filters.ts
│   │   ├── categories/
│   │   │   ├── repository.ts
│   │   │   ├── actions.ts
│   │   │   ├── queries.ts
│   │   │   ├── schema.ts
│   │   │   ├── types.ts
│   │   │   └── hooks/
│   │   │       └── use-categories.ts
│   │   ├── goals/                    # Phase 2
│   │   ├── reports/                  # Phase 2
│   │   └── settings/                 # Phase 2
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # shadcn components
│   │   ├── atoms/                    # Atomic design
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── supabase/
│   │   │   ├── server.ts             # Server-side Supabase client
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   └── base-repository.ts    # Abstract repository
│   │   ├── offline/
│   │   │   ├── indexeddb-setup.ts    # IndexedDB database setup
│   │   │   ├── cache-service.ts      # Cache operations
│   │   │   ├── sync-manager.ts       # Offline sync queue
│   │   │   └── use-online-status.ts  # Online/offline hook
│   │   ├── react-query/
│   │   │   ├── client.ts             # QueryClient configuration
│   │   │   └── provider.tsx          # QueryClientProvider
│   │   └── utils.ts                  # Utility functions
│   │
│   └── styles/
│       └── globals.css
│
├── supabase/
│   └── migrations/
│       └── 20250101000000_initial_schema.sql  # Database schema
│
├── .env.local                        # Environment variables
└── package.json
```

---

## 📅 Implementation Timeline

### Phase 1: Foundation (Week 1)

**Goal**: Set up infrastructure, database, and authentication

**Tasks**:

1. ✅ Supabase project setup
   - Create Supabase project
   - Run migration: `20250101000000_initial_schema.sql`
   - Configure environment variables

2. ✅ Base infrastructure
   - [ ] `src/lib/supabase/server.ts` - Server client
   - [ ] `src/lib/supabase/client.ts` - Browser client
   - [ ] `src/lib/supabase/base-repository.ts` - Abstract repository
   - [ ] `src/lib/react-query/client.ts` - QueryClient
   - [ ] `src/lib/react-query/provider.tsx` - Provider component

3. ✅ Authentication domain
   - [ ] `src/domains/auth/types.ts`
   - [ ] `src/domains/auth/schema.ts`
   - [ ] `src/domains/auth/actions.ts` (register, login, logout)
   - [ ] `src/domains/auth/hooks/use-auth.ts`

4. ✅ Next.js setup
   - [ ] `app/layout.tsx` - Root layout with providers
   - [ ] `middleware.ts` - Route protection
   - [ ] `app/(auth)/login/page.tsx`
   - [ ] `app/(auth)/register/page.tsx`

**Deliverables**:

- Working authentication (register, login, logout)
- Protected routes with middleware
- Supabase database with RLS enabled

---

### Phase 2: Categories Domain (Week 2)

**Goal**: Implement category management (default + custom)

**Tasks**:

1. ✅ Categories repository and actions
   - [ ] `src/domains/categories/types.ts`
   - [ ] `src/domains/categories/schema.ts`
   - [ ] `src/domains/categories/repository.ts`
   - [ ] `src/domains/categories/actions.ts` (CRUD custom categories)
   - [ ] `src/domains/categories/queries.ts` (read operations)
   - [ ] `src/domains/categories/hooks/use-categories.ts`

2. ✅ UI components
   - [ ] Category selector component
   - [ ] Custom category form (modal/sheet)
   - [ ] Category badge component

**Deliverables**:

- View default categories (9 seeded)
- Create/edit/delete custom categories
- Category selector in forms

---

### Phase 3: Budgets Domain (Week 3)

**Goal**: Implement budget creation and management

**Tasks**:

1. ✅ Budgets repository and actions
   - [ ] `src/domains/budgets/types.ts`
   - [ ] `src/domains/budgets/schema.ts`
   - [ ] `src/domains/budgets/repository.ts`
   - [ ] `src/domains/budgets/actions.ts` (CRUD budgets)
   - [ ] `src/domains/budgets/queries.ts`
   - [ ] `src/domains/budgets/services/budget-calculations.ts`
   - [ ] `src/domains/budgets/hooks/use-budgets.ts`
   - [ ] `src/domains/budgets/hooks/use-budget-calculations.ts`

2. ✅ Budget UI
   - [ ] `app/(app)/presupuesto/page.tsx`
   - [ ] Budget creation form
   - [ ] Category allocation inputs
   - [ ] Budget summary cards

**Business Rules Implemented**:

- BR-1.1: Positive amounts
- BR-1.2: One budget per month/year
- BR-1.3: Valid month range
- BR-1.4: Total allocations ≤ total budget

**Deliverables**:

- Create monthly budgets
- Allocate budget to categories
- View budget summary (spent/available)

---

### Phase 4: Transactions Domain (Week 4)

**Goal**: Implement transaction tracking (income/expenses)

**Tasks**:

1. ✅ Transactions repository and actions
   - [ ] `src/domains/transactions/types.ts`
   - [ ] `src/domains/transactions/schema.ts`
   - [ ] `src/domains/transactions/repository.ts`
   - [ ] `src/domains/transactions/actions.ts` (CRUD transactions)
   - [ ] `src/domains/transactions/queries.ts`
   - [ ] `src/domains/transactions/services/transaction-calculations.ts`
   - [ ] `src/domains/transactions/hooks/use-transactions.ts`
   - [ ] `src/domains/transactions/hooks/use-transaction-filters.ts`

2. ✅ Transaction UI
   - [ ] `app/(app)/movimientos/page.tsx`
   - [ ] Transaction form (Sheet on mobile, Dialog on desktop)
   - [ ] Transaction list with filters
   - [ ] Search functionality

**Business Rules Implemented**:

- TR-1.1: Positive amounts
- TR-1.2: Valid type (income/expense)
- TR-1.3: Date not in future
- TR-1.4: Required category
- TR-1.5: Auto-link to active budget

**Deliverables**:

- Add income/expense transactions
- Edit/delete transactions
- Filter by date, category, type
- Search transactions

---

### Phase 5: Dashboard & Reports (Week 5-6)

**Goal**: Implement dashboard and reporting features

**Tasks**:

1. ✅ Dashboard
   - [ ] `app/(app)/page.tsx`
   - [ ] Month selector component
   - [ ] Summary cards (Income, Expenses, Balance)
   - [ ] Budget progress component
   - [ ] Recent transactions list

2. ✅ Reports domain
   - [ ] `src/domains/reports/types.ts`
   - [ ] `src/domains/reports/services/report-generator.ts`
   - [ ] `src/domains/reports/hooks/use-reports.ts`

3. ✅ Reports UI
   - [ ] `app/(app)/reportes/page.tsx`
   - [ ] Date range selector
   - [ ] Pie chart (category distribution)
   - [ ] Line chart (income vs expenses over time)
   - [ ] Bar chart (month-over-month comparison)

**Calculations Implemented**:

- CR-1.1: Budget spent calculation
- CR-1.2: Budget remaining calculation
- CR-1.3: Budget percentage used
- CR-2.1 to CR-2.3: Category totals
- CR-3.1 to CR-3.3: Income/expense summaries
- CR-4.1: Balance calculation

**Deliverables**:

- Monthly dashboard
- Category breakdown charts
- Trend analysis
- Month comparisons

---

### Phase 6: Offline Support (Week 7)

**Goal**: Implement IndexedDB cache and offline sync

**Tasks**:

1. ✅ IndexedDB setup
   - [ ] `src/lib/offline/indexeddb-setup.ts`
   - [ ] `src/lib/offline/cache-service.ts`
   - [ ] `src/lib/offline/sync-manager.ts`
   - [ ] `src/lib/offline/use-online-status.ts`

2. ✅ Offline integration
   - [ ] Update React Query hooks with offline fallback
   - [ ] Implement sync queue for pending writes
   - [ ] Add offline indicator UI
   - [ ] Service worker (optional PWA)

**Deliverables**:

- App works offline (reads from cache)
- Writes queued when offline
- Auto-sync when back online
- Offline indicator in UI

---

### Phase 7: Goals & Settings (Week 8) - Phase 2

**Goal**: Implement goals and settings features

**Tasks**:

1. ✅ Goals domain
   - [ ] `src/domains/goals/repository.ts`
   - [ ] `src/domains/goals/actions.ts`
   - [ ] `src/domains/goals/hooks/use-goals.ts`
   - [ ] `app/(app)/metas/page.tsx`

2. ✅ Settings domain
   - [ ] `src/domains/settings/repository.ts`
   - [ ] `src/domains/settings/actions.ts`
   - [ ] `src/domains/settings/hooks/use-settings.ts`
   - [ ] `app/(app)/configuracion/page.tsx`
   - [ ] Export data functionality (JSON/CSV)

**Deliverables**:

- Create/track savings goals
- User preferences (currency, locale, theme)
- Export/import data

---

### Phase 8: Testing & Optimization (Week 9-10)

**Goal**: Testing, optimization, and production readiness

**Tasks**:

1. ✅ Testing
   - [ ] Unit tests (business logic, repositories)
   - [ ] Integration tests (Server Actions)
   - [ ] E2E tests (critical flows)
   - [ ] Offline scenario testing

2. ✅ Optimization
   - [ ] Database query optimization
   - [ ] React Query cache tuning
   - [ ] Code splitting
   - [ ] Image optimization

3. ✅ Accessibility audit
   - [ ] Lighthouse score > 95
   - [ ] Keyboard navigation
   - [ ] Screen reader testing
   - [ ] Color contrast validation

4. ✅ Documentation
   - [ ] User guide
   - [ ] Developer documentation
   - [ ] Deployment guide

**Deliverables**:

- Production-ready application
- Passing test suite
- Accessible interface
- Documentation complete

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Git

### Setup Steps

1. **Clone repository**

   ```bash
   git clone <repo>
   cd mis-finanzas
   pnpm install
   ```

2. **Create Supabase project**
   - Go to https://supabase.com
   - Create new project
   - Copy project URL and anon key

3. **Run database migration**

   ```bash
   cd supabase
   supabase db push
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add to `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

5. **Install shadcn components**

   ```bash
   pnpm dlx shadcn@latest add button input card toast dialog sheet tabs progress badge skeleton
   pnpm install recharts react-hook-form @hookform/resolvers zod date-fns
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

---

## 📊 Success Metrics

### Performance

- Page load < 2 seconds
- First Contentful Paint < 1.5s
- Lighthouse Performance > 90

### Accessibility

- WCAG 2.1 AA compliance
- Lighthouse Accessibility > 95
- Keyboard navigation 100%

### Usability

- Create first budget < 5 minutes
- Add transaction < 30 seconds
- User activation rate > 70%

### Reliability

- Uptime > 99%
- Offline mode works 100%
- Data sync success > 99%

---

## 📝 Notes

- **Security**: All data operations protected by RLS
- **Validation**: Zod validation on both client and server
- **Business Rules**: 36 rules enforced at database + application level
- **Offline-First**: IndexedDB cache provides instant reads
- **Progressive Enhancement**: Works online (full features) and offline (read + queued writes)

---

## 🤝 Contributors

- Domain Architect: Designed domain structure, repositories, Server Actions
- Next.js Builder: Designed App Router structure, routing, middleware
- UX Designer: Designed minimalist interface, accessibility, user flows
- shadcn Builder: Selected components, integration strategy

---

**Last Updated**: 2025-12-30  
**Version**: 1.0.0
