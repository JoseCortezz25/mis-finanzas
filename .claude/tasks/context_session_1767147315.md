# Session Context: Mis Finanzas App - Financial Management Application

**Session ID**: 1767147315  
**Created**: 2025-12-30  
**Status**: 🟢 Active  
**Type**: New Feature Development (Full Application)

---

## Session Overview

**Objective**: Design and plan complete implementation of "Mis Finanzas" - a minimalist personal finance management application.

**Scope**: Full application development from scratch including:

- User authentication (Supabase)
- Budget management
- Transaction tracking (income/expenses)
- Reporting and analytics
- Data persistence (IndexedDB)

**Agents Involved**:

- business-analyst (PROJECT.md + business rules)
- domain-architect (Domain entities and business logic)
- nextjs-builder (App Router structure)
- ux-ui-designer (UI/UX architecture)
- shadcn-builder (Component selection)

---

## Initial Requirements (From User)

### Application Description

Personal finance management app with extreme focus on simplicity, minimalism, and clarity.

**Core Pages**:

1. **Home** - Dashboard with monthly summary
2. **Movimientos** - Transaction management (income/expenses)
3. **Presupuesto** - Budget planning and tracking
4. **Reportes** - Analytics and visualizations

**Key Features**:

- Monthly budget creation with category distribution
- Transaction logging (income/expenses) linked to categories
- Budget vs actual tracking
- Historical analysis with filters
- Goals and savings tracking
- Visual reports (charts, trends, comparisons)
- Settings and preferences
- Financial education content

**Data Storage**: IndexedDB (client-side)
**Authentication**: Supabase (user registration/login)

### Design Philosophy

**Minimalist Interface**:

- Clean, single-column layout
- Generous spacing and soft shadows
- Clear visual hierarchy
- Large numbers for financial data
- Sans-serif modern typography
- Purposeful color usage (green=income, red=expenses, blue=balance)
- Soft rounded cards
- Subtle animations for continuity
- Mobile-first responsive design

**User Experience Principles**:

- Understand situation in seconds
- No visual clutter or unnecessary elements
- Calm and confidence-inspiring
- Clear next actions
- Fast data entry
- Helpful empty states
- Accessible (WCAG compliance)
- Intuitive navigation

### Technical Requirements

**Tech Stack** (already in place):

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Supabase (auth only)
- IndexedDB (data storage)

**Architecture Constraints**:

- Screaming Architecture (domain-driven)
- Server Components by default
- Server Actions for mutations
- React Query for server state
- Zustand for UI state only
- Named exports (no default except pages)
- Custom hooks for business logic

### User Roles

**Single Role**: Authenticated User

- Can register and login
- Can create/manage their own budgets
- Can track their own transactions
- Can view their own reports
- Personal data isolation (no multi-user sharing)

---

## Context Entries

### Entry 1: Initial Planning Session

**Agent**: parent  
**Date**: 2025-12-30  
**Action**: Session created, agents being invoked

**Tasks Delegated**:

1. business-analyst → Create PROJECT.md and extract business rules
2. domain-architect → Define domain entities and data models
3. nextjs-builder → Plan App Router structure
4. ux-ui-designer → Create UI/UX architecture plan
5. shadcn-builder → Select shadcn components

**Next**: Await agent outputs and consolidate into implementation plan

---

## Notes

- User will provide Supabase environment variables
- IndexedDB requires client-side logic (Client Components for data operations)
- Budget can be general or category-specific
- Pre-built categories available but user can create custom ones
- Financial education section is low-priority (P3)

---

### Entry 2: Business Analysis Complete

**Agent**: business-analyst  
**Date**: 2025-12-30  
**Action**: Created comprehensive Product Requirements Document and Business Rules

**Deliverables**:

1. **PROJECT.md** (root directory)
   - Executive summary
   - Problem statement and value proposition
   - Stakeholder analysis (single user persona)
   - Complete scope definition (in/out of scope)
   - 7 Epics with 31 user stories
   - Detailed functional requirements (7 categories)
   - Non-functional requirements (8 categories: performance, security, accessibility, usability, reliability, maintainability, browser compatibility, responsive design)
   - 36 business rules with validation logic
   - 6 data entities (User, Budget, CategoryAllocation, Category, Transaction, Goal)
   - UI requirements for 5 main pages
   - Risk assessment (8 risks identified with mitigation)
   - Success metrics and KPIs
   - 3-phase implementation plan (MVP → Enhancement → Optimization)

2. **/.claude/knowledge/business-rules.md**
   - 36 business rules optimized for AI agent consumption
   - 7 rule categories with code examples
   - Validation logic and error messages
   - Implementation guidance with TypeScript examples

**Key Findings**:

**Epics Breakdown**:

- Epic 1: Authentication & Onboarding (4 user stories) - P0
- Epic 2: Budget Management (6 user stories) - P0
- Epic 3: Transaction Tracking (7 user stories) - P0
- Epic 4: Reports & Analytics (5 user stories) - P0/P1
- Epic 5: Savings Goals (3 user stories) - P1
- Epic 6: Settings & Preferences (4 user stories) - P1
- Epic 7: Help & Education (2 user stories) - P3

**MVP Scope (P0 Features)**:

- User registration, login, logout
- Create, edit, view budgets with category allocation
- Add, edit, delete income/expense transactions
- View monthly summary dashboard
- View category breakdown
- Real-time budget tracking

**Phase 2 (P1 Features)**:

- Password reset
- Budget duplication
- Transaction filtering and search
- Spending trends and comparisons
- Savings goals
- Custom categories
- Data export

**Phase 3 (P2/P3 Features)**:

- Delete account
- Financial education content
- Advanced analytics
- Performance optimizations

**Data Model**:

- 6 entities: User (Supabase), Budget, CategoryAllocation (embedded), Category, Transaction, Goal (all IndexedDB)
- 9 default categories provided
- User data isolation enforced via userId filtering
- Hard deletes (no soft delete/recovery)

**Business Rules Highlights**:

- One budget per month/year per user
- Category allocations cannot exceed total budget
- All transaction amounts must be positive
- Budget status workflow: draft → active → closed
- Auto-linking transactions to budgets by date
- Real-time calculation of spent/remaining/balance

**Critical Constraints**:

- IndexedDB browser support required
- Data loss risk if browser storage cleared (mitigation: export feature)
- Supabase dependency for auth (offline view-only after login)
- WCAG 2.1 AA compliance required
- Mobile-first responsive design
- Page load < 2 seconds

**Risks Identified**:

1. IndexedDB browser support (High severity, Low likelihood)
2. Data loss from browser clearing (High severity, Medium likelihood)
3. Supabase downtime (Medium severity, Low likelihood)
4. User adoption/retention (Medium severity, Medium likelihood)
5. Mobile performance (Medium severity, Medium likelihood)
6. Accessibility compliance (Medium severity, Low likelihood)
7. Feature creep (Low severity, High likelihood)
8. Currency/localization (Low severity, Medium likelihood)

**Success Metrics**:

- 100 users within 3 months
- 70% user activation rate (create first budget)
- 40% DAU
- 50% 30-day retention
- 15 transactions/user/month average
- < 2 second page load
- < 5 minutes to create first budget

**Implementation Timeline**:

- Phase 1 (MVP): 8-10 weeks
- Phase 2 (Enhancement): 4-6 weeks
- Phase 3 (Optimization): 4-6 weeks
- Total: ~16-22 weeks

**Next Steps for Other Agents**:

1. **domain-architect**: Use PROJECT.md section 8 (Data Requirements) and business-rules.md to design:
   - Domain entities with TypeScript interfaces
   - Repository patterns for IndexedDB access
   - Business logic services for calculations
   - Validation schemas (zod)

2. **nextjs-builder**: Use PROJECT.md section 9 (UI Requirements) to design:
   - App Router structure for 5 main pages
   - Server vs Client Component strategy
   - Server Actions for mutations
   - Route organization

3. **ux-ui-designer**: Use PROJECT.md sections 9.1-9.4 to design:
   - Component hierarchy for each page
   - Design system (colors, typography, spacing)
   - Interaction patterns (empty states, loading, errors)
   - Accessibility requirements

4. **shadcn-builder**: Use ux-ui-designer output to select:
   - shadcn/ui components for forms, cards, buttons
   - Chart library for reports
   - Additional UI libraries if needed

**Open Questions** (from PROJECT.md section 13):

- Q1: Should we support recurring transactions in Phase 2?
- Q2: How do we handle users in different time zones? (decide before MVP)
- Q3: Should we implement optional cloud backup in Phase 2?
- Q4: Do we need budget approval workflow (draft → active)? (already decided: yes)
- Q5: Should income have categories? (already decided: yes, optional)

**Assumptions to Validate**:

- Users prefer local data (privacy) over cloud sync
- Users will manually enter transactions daily
- Monthly budget cycles are standard (validated)
- Users have modern browsers with IndexedDB support
- Simplicity is more important than features

**Documentation References**:

- Full requirements: PROJECT.md (root)
- Business rules: .claude/knowledge/business-rules.md
- Session context: .claude/tasks/context_session_1767147315.md

**Status**: ✅ Business analysis complete, ready for technical planning

---

### Entry 3: Next.js 15 App Router Architecture Complete

**Agent**: nextjs-builder  
**Date**: 2025-12-30  
**Action**: Created comprehensive Next.js App Router structure plan

**Deliverable**: `.claude/plans/nextjs-structure-plan.md`

**Key Architectural Decisions**:

1. **Server vs Client Components Strategy**:
   - Server Components: Layouts, metadata, routing structure, static content
   - Client Components: ALL data operations (IndexedDB requires browser), forms, charts, navigation
   - Pattern: Server Component page wrappers for metadata → Client Component content

2. **Critical Constraint - IndexedDB**:
   - ALL application data lives in IndexedDB (browser storage)
   - NO server-side data fetching (no async page components with data)
   - React Query used for IndexedDB caching, NOT server data
   - Repository pattern for IndexedDB access in each domain

3. **Route Structure**:
   - **Route Groups**: `(auth)` for public, `(app)` for protected
   - **Public Routes**: `/login`, `/register` (2 pages)
   - **Protected Routes**: `/` (dashboard), `/presupuesto`, `/movimientos`, `/reportes`, `/metas`, `/configuracion`, `/ayuda` (7 pages)
   - **Total**: 9 pages

4. **Middleware Authentication**:
   - Supabase SSR for session management
   - Protect all routes except `/login` and `/register`
   - Redirect authenticated users away from auth pages
   - Redirect unauthenticated users to login with return URL

5. **Layouts**:
   - Root layout: HTML structure, providers (React Query, Supabase)
   - Auth layout: Minimal centered card for login/register
   - App layout: Navigation (bottom mobile, sidebar desktop) + header
   - All layouts are Server Components (wrappers for Client Components)

6. **Data Fetching Pattern**:

   ```tsx
   // Repository pattern for IndexedDB
   budgetRepository.findAll(userId) // In repository file

   // React Query hooks in domain
   useBudgets() → React Query → budgetRepository → IndexedDB
   useCreateBudget() → Mutation → invalidate cache

   // Usage in Client Components
   const { data, isLoading } = useBudgets();
   const createBudget = useCreateBudget();
   ```

7. **Navigation Components**:
   - Bottom navigation (mobile): Fixed bottom bar with 5 items
   - Sidebar (desktop): Fixed left sidebar with same items
   - Header: User menu, logout
   - All navigation components are Client Components (usePathname)

8. **Loading and Error States**:
   - `loading.tsx` at route level for streaming UI
   - Skeleton components matching page layout
   - `error.tsx` (Client Component required) for error boundaries
   - Empty states for zero-data scenarios
   - `not-found.tsx` for 404 pages

9. **Metadata Strategy**:
   - Static metadata for most pages (title, description)
   - Dynamic metadata limited (can't access IndexedDB server-side)
   - Template in root layout: `%s | Mis Finanzas`

10. **Performance Optimizations**:
    - Route-level code splitting (automatic with App Router)
    - Dynamic imports for heavy components (charts with recharts)
    - React Query cache: 5 min staleTime, 30 min gcTime
    - Optimistic updates for mutations

**Route Breakdown**:

| Route            | Type                  | Component Type  | IndexedDB | Priority |
| ---------------- | --------------------- | --------------- | --------- | -------- |
| `/login`         | Public                | Client (form)   | No        | P0       |
| `/register`      | Public                | Client (form)   | No        | P0       |
| `/`              | Protected (Dashboard) | Client          | Yes       | P0       |
| `/presupuesto`   | Protected             | Client          | Yes       | P0       |
| `/movimientos`   | Protected             | Client          | Yes       | P0       |
| `/reportes`      | Protected             | Client (charts) | Yes       | P0       |
| `/metas`         | Protected             | Client          | Yes       | P1       |
| `/configuracion` | Protected             | Client          | Yes       | P1       |
| `/ayuda`         | Protected             | Server          | No        | P3       |

**Component Architecture**:

- **Pages**: 9 total (2 public, 7 protected)
- **Layouts**: 4 (root, auth, app wrapper, app client)
- **Client Components**: 50+ (6 per major page average)
- **Repositories**: 4 (budgets, transactions, categories, goals)
- **Custom Hooks**: 15+ (CRUD operations per domain)
- **Route Files**: 27+ (pages, loading, error states)

**File Structure Summary**:

```
app/
├── layout.tsx (root - Server)
├── (auth)/
│   ├── layout.tsx (Server)
│   ├── login/page.tsx (Server wrapper → Client)
│   └── register/page.tsx (Server wrapper → Client)
└── (app)/
    ├── layout.tsx (Server wrapper)
    ├── _components/app-layout-client.tsx (Client)
    ├── page.tsx (Dashboard - Server wrapper → Client)
    ├── presupuesto/page.tsx
    ├── movimientos/page.tsx
    ├── reportes/page.tsx
    ├── metas/page.tsx
    ├── configuracion/page.tsx
    └── ayuda/page.tsx (Server - static)

middleware.ts (Supabase auth protection)

domains/
├── auth/ (hooks, provider, types)
├── budgets/ (repository, hooks, types, schema)
├── transactions/ (repository, hooks, types, schema)
├── categories/ (repository, hooks, constants, types)
└── goals/ (repository, hooks, types)
```

**Implementation Plan**:

**Phase 1 (Week 1)**: Foundation

- Middleware and auth setup
- Root layout and providers
- Route groups and basic navigation
- Auth pages (login, register)

**Phase 2 (Week 2)**: Data Layer

- IndexedDB initialization
- Repository pattern for all entities
- React Query hooks for CRUD operations
- Domain structure (budgets, transactions, categories)

**Phase 3 (Weeks 3-4)**: Core Pages

- Dashboard with monthly summary
- Budget management (CRUD)
- Transaction tracking (CRUD, filters)
- Reports with charts (recharts)

**Phase 4 (Week 5)**: Navigation & Polish

- Bottom nav and sidebar
- Header with user menu
- Loading states (skeletons)
- Error boundaries and empty states

**Phase 5 (Weeks 6-7)**: Additional Features

- Goals page (P1)
- Settings page (P1)
- Help page (P3)

**Phase 6 (Week 8)**: Testing & Optimization

- Unit and integration tests
- Performance optimization
- Accessibility audit
- Bundle analysis

**Open Questions**:

1. Timezone handling: UTC or user local?
2. Currency display: Fixed es-MX or user preference?
3. Draft budget visibility in transaction linking?
4. CSV/JSON import in MVP?
5. Offline transaction sync (currently view-only offline)?

**Dependencies for Other Agents**:

- **domain-architect**: Needs to implement repository classes and validation schemas
- **ux-ui-designer**: Needs component designs for each page section
- **shadcn-builder**: Needs to select shadcn components (forms, dialogs, cards, etc.)

**Next Steps**:

1. Parent agent reviews plan
2. Domain architect implements repositories and schemas
3. UX designer creates component designs
4. shadcn builder selects UI components
5. Implementation begins following Phase 1 steps

**Status**: ✅ Next.js architecture plan complete, ready for domain and UX planning

---

**End of Session Context (Append-Only)**

### Entry 4: Domain Architecture Plan Complete

**Agent**: domain-architect  
**Date**: 2025-12-30  
**Action**: Created comprehensive domain architecture plan for all 7 domains with IndexedDB repository pattern

**Deliverable**: `.claude/plans/domain-architecture-plan.md`

**Key Architectural Decisions**:

1. **Hybrid Storage Strategy**:
   - **Supabase Auth**: User authentication only (email/password, sessions)
   - **IndexedDB**: ALL financial data (budgets, transactions, categories, goals)
   - **NO Server Actions for data**: IndexedDB is browser-only (Client Components required)
   - **Server Actions ONLY for auth**: Login, register, logout, password reset

2. **Critical Deviation from Standard Pattern**:
   - Traditional Next.js: Server Actions for mutations → Database
   - Mis Finanzas: Client Components → IndexedDB (browser-only)
   - Reason: IndexedDB requires browser environment, cannot run server-side
   - Impact: All data fetching components MUST use `'use client'` directive

3. **State Management Strategy**:
   - **Auth State**: Zustand (user session from Supabase)
   - **IndexedDB Data**: React Query (treat as "server state" for caching)
   - **UI State**: Zustand (filters, sidebar open, date ranges)
   - **Form State**: React Hook Form (with Zod validation)
   - **Why React Query for IndexedDB?**: Automatic caching, invalidation, optimistic updates, loading/error states

4. **Repository Pattern Architecture**:
   - **Base Class**: `IndexedDBRepository<T>` with generic CRUD operations
   - **Domain Repos**: `BudgetRepository`, `TransactionRepository`, `CategoryRepository`, `GoalRepository`
   - **Specialized Queries**: Each repo extends base with domain-specific queries
   - **Separation of Concerns**: Repositories for data access, Services for business logic

5. **IndexedDB Schema Design**:
   - **Database**: `misfinanzas_v1` (version 1)
   - **Object Stores**: `budgets`, `categories`, `transactions`, `goals`
   - **Indexes**: Compound indexes for uniqueness (userId + month + year), performance (userId + date)
   - **User Isolation**: All queries filtered by `userId` (client-side scoping)

6. **Data Flow Pattern**:
   ```
   Component → Custom Hook → React Query → Repository → IndexedDB
               ↓
           Cache/Invalidation
   ```

**Domain Summary**:

### 1. **auth** (Storage: Supabase)

- **Entities**: User, AuthSession, UserSettings
- **Operations**: register, login, logout, resetPassword
- **Implementation**: Server Actions (ONLY domain with server-side logic)
- **Files**: 8 (types, schema, actions, hooks, errors, 3 components)
- **Special**: Uses Zustand for auth state persistence

### 2. **budgets** (Storage: IndexedDB)

- **Entities**: Budget, CategoryAllocation (embedded), BudgetSummary (computed)
- **Operations**: create, update, delete, duplicate, findByMonthYear, findByStatus
- **Business Rules**: BR-1.1 to BR-1.5 (monthly scope, uniqueness, allocation limits, status workflow)
- **Calculations**: CR-1.1 to CR-1.5 (spent, remaining, percentage used, category breakdowns)
- **Files**: 7 (types, schema, repository, calculation service, 2 hook files, errors)
- **Indexes**: userId, month, year, userId_month_year (unique), status

### 3. **categories** (Storage: Constants + IndexedDB)

- **Entities**: Category (default in code + custom in DB)
- **Default Categories**: 9 pre-built (Housing, Food, Transportation, Entertainment, Healthcare, Personal, Utilities, Savings, Other)
- **Operations**: getAllCategoriesForUser (default + custom), createCustom, updateCustom, deleteCustom
- **Business Rules**: BR-2.1 to BR-2.5 (uniqueness, defaults, custom, deletion constraints)
- **Files**: 6 (types, constants, schema, repository, validation service, hooks)
- **Special**: Default categories NOT stored in IndexedDB (code constants only)

### 4. **transactions** (Storage: IndexedDB)

- **Entities**: Transaction, TransactionSummary (computed)
- **Operations**: create, update, delete, filter (multi-criteria), findByDateRange, findByBudget, findByCategory
- **Business Rules**: TR-1.1 to TR-1.9 (positive amounts, type validation, date limits, auto-linking)
- **Calculations**: CR-1.6 to CR-1.8 (total income, expenses, balance)
- **Files**: 7 (types, schema, repository, calculation service, linking service, 2 hook files)
- **Indexes**: userId, date, categoryId, budgetId, userId_date, userId_budgetId
- **Auto-Linking**: Transactions auto-link to budget based on transaction date's month

### 5. **goals** (Storage: IndexedDB) - Phase 2

- **Entities**: Goal, GoalProgress (computed)
- **Operations**: create, update, delete, addToGoal, findActiveGoals
- **Calculations**: CR-1.9 (progress percentage, days remaining)
- **Files**: 5 (types, schema, repository, calculation service, hooks)
- **Indexes**: userId, status, userId_status
- **Auto-Complete**: Goals auto-mark as completed when target reached

### 6. **reports** (Storage: Computed - no persistence)

- **Entities**: MonthlyReport, CategoryBreakdown, ComparisonReport, TrendData
- **Operations**: generateMonthlyReport, generateCategoryBreakdown, generateComparison, generateTrends
- **Data Source**: All computed from transactions + budgets (no IndexedDB store)
- **Files**: 3 (types, report generation service, hooks)
- **Performance**: Results cached by React Query based on query keys

### 7. **settings** (Storage: IndexedDB - Phase 2)

- **Entities**: UserSettings, ExportData
- **Operations**: updateSettings, exportAllData (JSON), exportTransactionsCSV
- **Files**: 5 (types, schema, export service, settings store, export hooks)
- **Export**: Full data export to JSON with all domains

**IndexedDB Object Stores**:

| Store          | Key Path | Indexes                                                 | Size Est. |
| -------------- | -------- | ------------------------------------------------------- | --------- |
| `budgets`      | `id`     | userId, month, year, userId_month_year (unique), status | ~1KB/doc  |
| `categories`   | `id`     | userId, userId_name (unique), isCustom                  | ~200B/doc |
| `transactions` | `id`     | userId, date, categoryId, budgetId, userId_date, type   | ~500B/doc |
| `goals`        | `id`     | userId, status, userId_status                           | ~300B/doc |

**Business Rules Implementation**:

- **Total Rules**: 36 from business-rules.md
- **Budget Rules**: BR-1.1 to BR-1.5 (5 rules) ✅
- **Category Rules**: BR-2.1 to BR-2.5 (5 rules) ✅
- **Transaction Rules**: TR-1.1 to TR-1.9 (9 rules) ✅
- **Calculation Rules**: CR-1.1 to CR-1.9 (9 rules) ✅
- **Validation Rules**: VR-1.1 to VR-1.5 (5 rules) ✅
- **Data Visibility Rules**: DV-1.1 to DV-1.2 (2 rules) ✅
- **Budget Workflow**: BW-1.1 to BW-1.2 (2 rules) ✅

**Zod Validation**:

- Every domain has validation schemas for create/update operations
- Runtime type safety with TypeScript type inference
- Input validation before IndexedDB writes
- Error messages defined in schemas
- Business rule checks integrated with Zod refinements

**React Query Patterns**:

```typescript
// Query keys organized by domain
budgetKeys = {
  all: ['budgets'],
  lists: () => [...budgetKeys.all, 'list'],
  list: userId => [...budgetKeys.lists(), userId],
  detail: id => [...budgetKeys.all, 'detail', id],
  current: userId => [...budgetKeys.all, 'current', userId]
};

// Usage in hooks
useBudgets(); // Fetch all user budgets
useCreateBudget(); // Mutation with auto-invalidation
useBudgetSummary(id); // Computed summary with transactions
```

**Custom Error Classes**:

- Each domain has specific error types
- `BudgetNotFoundError`, `DuplicateBudgetError`, `InvalidStatusTransitionError`
- `CategoryValidationError`, `TransactionValidationError`
- `AuthenticationError`, `SessionExpiredError`, `InvalidCredentialsError`
- `IndexedDBError`, `DatabaseNotSupportedError`, `DatabaseVersionError`

**Cross-Domain Dependencies**:

1. **transactions → budgets**: Auto-linking based on date
2. **transactions → categories**: Category spent calculations
3. **budgets → categories**: Category allocations
4. **reports → transactions + budgets**: All report calculations
5. **settings → all domains**: Full data export

**Performance Optimizations**:

- **Compound Indexes**: For efficient uniqueness checks (userId + month + year)
- **React Query Cache**: 5 min staleTime, 30 min gcTime
- **Optimistic Updates**: Immediate UI updates, rollback on error
- **Filtered Queries**: Client-side filtering after IndexedDB retrieval
- **Lazy Loading**: Charts and heavy components dynamically imported

**File Structure Summary**:

```
src/
├── lib/
│   ├── indexeddb/
│   │   ├── database.ts (initialization)
│   │   ├── base-repository.ts (abstract CRUD)
│   │   └── errors.ts
│   ├── react-query/
│   │   ├── client.ts (config)
│   │   └── provider.tsx
│   └── utils/
│       └── date.ts
├── domains/
│   ├── auth/ (8 files)
│   ├── budgets/ (7 files)
│   ├── categories/ (6 files)
│   ├── transactions/ (7 files)
│   ├── goals/ (5 files)
│   ├── reports/ (3 files)
│   └── settings/ (5 files)
```

**Total Files to Create**: 71 files across 7 domains + infrastructure

**Implementation Phases**:

**Phase 1 (Week 1-2)**: Foundation

- IndexedDB infrastructure (database, base repository, errors)
- React Query setup (client, provider)
- Auth domain (Supabase integration)

**Phase 2 (Week 3-4)**: Core Domains

- Categories (constants + repository)
- Budgets (repository, calculation service, hooks)
- Transactions (repository, calculation service, linking service, hooks)

**Phase 3 (Week 5-6)**: Analytics & Goals

- Reports (generation service, hooks)
- Goals (repository, calculation service, hooks)

**Phase 4 (Week 7)**: Settings & Export

- Settings (store, export service, hooks)

**Phase 5 (Week 8)**: Testing & Optimization

- Integration testing
- Performance optimization
- Error scenario testing

**Key Constraints Followed**:

✅ **Screaming Architecture**: Business logic in `/domains/`  
✅ **Repository Pattern**: Data access abstraction  
✅ **Custom Hooks**: Business logic encapsulation  
✅ **React Query for Data**: Server state pattern for IndexedDB  
✅ **Zustand for UI State**: Client-side preferences only  
✅ **Zod Validation**: Runtime type safety  
✅ **Named Exports**: No default exports (except pages)  
✅ **Client Components**: Required for all IndexedDB access

**Critical Notes**:

⚠️ **IndexedDB is browser-only**: Cannot use Server Components for data operations  
⚠️ **NO Server Actions for CRUD**: Only for Supabase auth  
⚠️ **User isolation client-side**: All queries filter by userId  
⚠️ **Hard deletes**: No soft delete/recovery (user must confirm)  
⚠️ **Data loss risk**: Browser storage can be cleared (mitigated by export feature)

**Dependencies for Other Agents**:

- **nextjs-builder**: Use repositories and hooks in page components
- **ux-ui-designer**: Design forms/components using domain types
- **shadcn-builder**: Select components for CRUD operations (forms, dialogs, tables)

**Next Steps**:

1. Parent agent reviews plan
2. Create infrastructure (IndexedDB, React Query)
3. Implement domains sequentially (auth → categories → budgets → transactions → reports → goals → settings)
4. Test each domain before proceeding
5. Integrate with UI components from ux-ui-designer

**Status**: ✅ Domain architecture complete, ready for implementation

---

### Entry 5: UX/UI Design Architecture Complete

**Agent**: ux-ui-designer  
**Date**: 2025-12-30  
**Action**: Created comprehensive UX/UI design plan for all 6 main pages with complete interaction patterns and accessibility guidelines

**Deliverable**: `.claude/plans/ux-design-plan.md`

**Design Summary**:

**Pages Designed**: 6 main pages

1. **Dashboard (/)**: Monthly summary, quick actions, budget status, recent transactions
2. **Presupuesto (/presupuesto)**: Budget creation/editing with category allocations
3. **Movimientos (/movimientos)**: Transaction management with filters and search
4. **Reportes (/reportes)**: Analytics with charts (pie, line, bar)
5. **Metas (/metas)**: Savings goals with progress tracking
6. **Configuración (/configuracion)**: Settings, preferences, data management

**Component Architecture**:

**shadcn/ui Components (16 total)**:

- Forms: Button, Input, Select, Textarea, DatePicker, Form, Label, Checkbox
- Feedback: Toast (Sonner), Dialog, Sheet, AlertDialog
- Display: Card, Badge, Progress, Separator, Skeleton, Table
- Navigation: Tabs, Command, DropdownMenu

**Charts (recharts - 8 components)**:

- PieChart, LineChart, BarChart, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis/YAxis

**Custom Components (8 total)**:

- Atoms: `CurrencyInput`, `CategoryIcon`, `FloatingActionButton` (FAB)
- Molecules: `SummaryCard`, `TransactionListItem`, `MonthSelector`, `BudgetProgressBar`, `EmptyState`

**Total Component Types**: 32 components

**Text Maps Created**: 6 comprehensive text map specifications

1. `budgets/budget.text-map.ts` (~50 keys)
2. `transactions/transaction.text-map.ts` (~60 keys)
3. `reports/report.text-map.ts` (~30 keys)
4. `goals/goal.text-map.ts` (~40 keys)
5. `settings/setting.text-map.ts` (~25 keys)
6. `components/common.text-map.ts` (~60 keys)

**Total Text Keys**: ~265 localized strings

**Design Principles Applied**:

**Visual Design**:

- **Minimalism**: Generous white space (24px+ padding), clean single-column layouts (max-width: 1200px), soft shadows (shadow-sm to shadow-md)
- **Color System**: Semantic color usage
  - Green (#10B981): Income, positive balance, success states
  - Red (#EF4444): Expenses, negative balance, errors
  - Blue (#3B82F6): Neutral balance, primary actions
  - Yellow (#F59E0B): Warning states, near budget limits
- **Typography**:
  - Financial numbers: text-3xl to text-5xl, font-bold, tabular-nums
  - Page titles: text-3xl to text-4xl, font-bold
  - Section titles: text-2xl, font-semibold
  - Body: text-base (16px minimum)
- **Spacing**: Comfortable density with 24-32px section spacing, 16-24px card padding

**User Experience**:

- **Clarity**: Large financial numbers, color-coded status indicators
- **Efficiency**: Add transaction in < 30 seconds (3 taps on mobile)
- **Feedback**: Immediate visual response to all actions (optimistic updates, toasts, animations)
- **Consistency**: Same interaction patterns across all pages
- **Error Prevention**: Real-time validation, confirmation dialogs for destructive actions

**Accessibility (WCAG 2.1 AA Minimum)**:

**Keyboard Navigation**:

- Logical tab order (top to bottom, left to right)
- All interactive elements focusable
- Escape closes modals/sheets
- Enter submits forms
- Arrow keys for month selector and lists

**Screen Reader Support**:

- ARIA labels on all icons and action buttons
- ARIA descriptions for additional context
- Live regions for dynamic updates (budget calculations, form errors)
- Hidden content with `.sr-only` for screen reader-only context

**Visual Accessibility**:

- Color contrast ≥ 4.5:1 for text (AA), targeting 7:1 (AAA)
- Color independence: Status uses color + icon + text label
- Touch targets ≥ 44x44px (mobile-first)
- Focus indicators always visible (3px ring)
- Respects `prefers-reduced-motion`

**Responsive Design Strategy**:

**Mobile (< 640px)**:

- Single column, full-width cards
- Bottom navigation (fixed, 5 items)
- Floating Action Button for primary action
- Sheets for forms (slide-up from bottom)
- Full-width buttons
- Stacked layout

**Tablet (640px - 1024px)**:

- 2-column grid for summary cards
- Bottom nav or horizontal nav
- Dialogs for forms (centered modals)
- Side-by-side layouts where appropriate

**Desktop (> 1024px)**:

- Left sidebar navigation (240px, collapsible)
- 3-column grid for summary cards
- Centered dialogs (max-w-2xl)
- Table view for transactions
- Hover states on all interactive elements
- Inline actions (no FAB)
- Command palette (Cmd+K)

**Interaction Patterns**:

**Primary Actions**:

- Add Expense: Red FAB (mobile), red button (desktop), opens Sheet/Dialog
- Add Income: Green FAB/button, same pattern as expense
- Create Budget: Blue CTA card (empty state) or button

**Micro-interactions**:

- Hover: Cards shadow increase, buttons darken, transaction rows highlight
- Loading: Skeleton screens (no spinners), button spinners during submission
- Success: Green toast (3s auto-dismiss), count-up animations for numbers
- Error: Inline validation with shake animation, red toast (5s)
- Transitions: Fade (200ms), slide-up (300ms), stagger lists (50ms delay)

**States & Feedback**:

**Loading States**:

- Skeleton screens for initial page load
- Button loading states ("Guardando..." with spinner)
- Optimistic updates (transaction appears immediately)

**Error States**:

- Validation errors: Inline, specific, actionable (red border + message + icon)
- System errors: Toast notifications with retry option
- Recovery guidance: Clear instructions on how to fix

**Empty States**:

- Encouraging tone: "No tienes presupuestos" + helpful description
- Clear CTA: "Crear mi primer presupuesto" (primary button)
- Illustrations: Icon-based, not decorative

**Success States**:

- Toast confirmations: "Presupuesto creado exitosamente"
- Next-step guidance: Suggest adding first transaction
- Milestone celebrations: Confetti for first budget, goal achievement

**User Flows Documented**:

1. **First-Time User - Budget Creation**: Registration → Empty state → Budget form → Category allocation → Success
2. **Daily User - Add Expense (Mobile)**: Dashboard → FAB → Form → Submit → Optimistic update
3. **Desktop User - Monthly Report**: Reports page → Date range → Analyze charts → Export CSV
4. **Error Recovery - Validation**: Enter invalid amount → See error → Correct → Error clears
5. **Delete Confirmation**: Delete action → Confirmation dialog → Success/Cancel

**Design Specifications**:

**Spacing Scale**:

- Tight: 4px (inline elements)
- Normal: 12-16px (default content)
- Relaxed: 24-32px (major sections)

**Typography Scale**:

- Financial numbers: 36-48px (tabular-nums)
- H1: 28-36px (bold)
- H2: 24px (semibold)
- H3: 20px (semibold)
- Body: 16px (normal)

**Color Usage Guidelines**:

- Primary (Blue): Neutral actions, links, focus states
- Success (Green): Income, positive outcomes, under budget
- Destructive (Red): Expenses, negative outcomes, over budget
- Warning (Yellow): Near limits, caution states

**Performance Considerations**:

- Critical path: App shell → Summary data → Budget status → Recent transactions
- Lazy loading: Charts, historical data, heavy components
- Animation budget: Max 3 simultaneous, GPU-accelerated properties only
- IndexedDB: Indexed queries, cursor for large datasets, React Query caching

**Implementation Coordination**:

**shadcn-builder needs**:

- Install 16 shadcn components
- Install recharts for analytics charts
- Install sonner for toast notifications
- Customize Button variants for income/expense (green/red)

**domain-architect needs**:

- Entity interfaces for component props (Transaction, Budget, Category, Goal types)
- Calculation functions for real-time budget totals
- Validation schemas for form integration (Zod)

**nextjs-builder needs**:

- Page layouts for 6 main pages
- Server vs Client Component strategy (all data pages are Client Components)
- Loading and error boundary implementations
- Responsive layout wrappers (mobile nav vs desktop sidebar)

**Implementation Phases**:

**Phase 1 (Weeks 1-2)**: Foundation

- Design tokens (CSS variables)
- Text maps (6 files)
- Atomic components (CurrencyInput, CategoryIcon, FAB)

**Phase 2 (Weeks 3-4)**: Core Pages

- Dashboard (summary cards, recent transactions)
- Movimientos (transaction list, add/edit forms)

**Phase 3 (Weeks 5-6)**: Budget & Reports

- Presupuesto (budget creation, category allocations)
- Reportes (charts, analytics)

**Phase 4 (Weeks 7-8)**: Goals, Settings & Polish

- Metas (goal tracking)
- Configuración (settings, export)
- Accessibility audit
- Performance optimization

**Estimated Implementation Time**: 7-10 weeks for complete UI

**Success Metrics**:

**Usability**:

- Task completion rate: 9/10 users can create budget without help
- Time on task: < 30 seconds to add transaction
- Error rate: < 0.5 validation errors per submission

**Efficiency**:

- Average transaction entry time: < 30 seconds
- Time to understand budget status: < 5 seconds

**Accessibility**:

- Lighthouse score: > 95
- Screen reader compatibility: 100% of features
- Keyboard-only navigation: 100% accessible
- Color contrast violations: 0

**Performance**:

- Lighthouse performance: > 90
- FCP: < 1.5s
- LCP: < 2.5s
- CLS: < 0.1

**Critical Constraints Followed**:

✅ **Mobile-first design**: All layouts designed for mobile (320px+) first, then scale up  
✅ **Accessibility is mandatory**: WCAG 2.1 AA minimum, not an afterthought  
✅ **Content before chrome**: Financial data prioritized over decorative elements  
✅ **Purposeful color**: Every color has semantic meaning (green/red/blue)  
✅ **Generous spacing**: 24px+ section spacing, no visual clutter  
✅ **Large touch targets**: 44x44px minimum (mobile-friendly)  
✅ **Real-time feedback**: All actions provide immediate visual response  
✅ **Encouraging tone**: Non-judgmental, helpful microcopy

**Open Questions for Parent**:

1. Should we implement multi-step budget creation wizard or single-page form?
2. Transaction list: Infinite scroll or pagination for large datasets?
3. Charts: Client-side rendering or consider server-side chart generation (future)?
4. Dark mode: Implement in MVP or Phase 2?
5. Onboarding tour: Interactive tooltips or video tutorial?

**Dependencies for Other Agents**:

- **shadcn-builder**: Coordinate component installation and customization
- **domain-architect**: Receive entity types and validation schemas
- **nextjs-builder**: Coordinate page structure and layout implementations

**Next Steps**:

1. Parent reviews UX plan and approves design approach
2. shadcn-builder installs required components
3. domain-architect confirms data structures support UI needs
4. Parent implements design phase-by-phase (mobile-first)
5. Conduct usability testing after core pages complete
6. Iterate based on feedback

**Status**: ✅ UX/UI design plan complete, ready for component selection and implementation

---

**End of Session Context (Append-Only)**

---

### Entry 6: Domain Architecture COMPLETE REWRITE - Supabase + IndexedDB Hybrid Offline-First

**Agent**: domain-architect  
**Date**: 2025-12-30  
**Action**: COMPLETELY REWROTE domain architecture plan with new hybrid offline-first architecture

**Deliverable**: `.claude/plans/domain-architecture-plan.md` (REWRITTEN)

**CRITICAL ARCHITECTURE CHANGE**:

**OLD Architecture (Replaced)**:
```
Component (Client) → IndexedDB (Browser) ← Only storage
```

**NEW Architecture (Current)**:
```
Component (Client)
    ↓
Server Action (Server) ← Repository Pattern + Session Validation
    ↓
Supabase Database (PostgreSQL) ← Source of Truth
    ↓
Sync to IndexedDB (Client) ← Offline Cache
```

**Key Architectural Decisions**:

1. **Supabase PostgreSQL as Primary Database**:
   - Source of truth for ALL financial data
   - Row Level Security (RLS) enabled on all tables
   - Automatic backups and data persistence
   - Multi-device sync capability (future)

2. **IndexedDB as Offline Cache**:
   - Mirrors Supabase data for offline access
   - Stores pending operations with `_pending_sync` flag
   - Automatically syncs when back online

3. **Server Actions for ALL Data Operations**:
   - MANDATORY session validation with `auth.getUser()`
   - Zod schema validation for all inputs
   - Business rules enforcement
   - Repository pattern (no direct Supabase calls)
   - `revalidatePath()` after mutations

4. **Repository Pattern (Server-Side)**:
   - `SupabaseRepository<T>` base class with CRUD operations
   - Domain-specific repositories extend base (BudgetRepository, TransactionRepository, etc.)
   - All repositories accept `SupabaseClient` and `tableName`
   - User isolation via `user_id` filtering

5. **Offline Sync Manager**:
   - Detects online/offline status
   - Queues operations when offline
   - Syncs pending operations when back online
   - Shows "Pending sync" indicator to user

**Supabase Database Schema**:

**Tables Created** (7 tables):

1. **users** (extends auth.users)
   - id, email, display_name, currency
   - created_at, updated_at

2. **budgets** 
   - id, user_id, name, total_amount, month, year, status
   - UNIQUE constraint on (user_id, month, year) ← BR-1.2
   - CHECK constraint: total_amount > 0 ← BR-1.3
   - CHECK constraint: month BETWEEN 1 AND 12 ← BR-1.1
   - CHECK constraint: status IN ('draft', 'active', 'closed') ← BR-1.5

3. **category_allocations**
   - id, budget_id, category_id, allocated_amount
   - UNIQUE constraint on (budget_id, category_id)
   - ON DELETE CASCADE (deleted with budget)

4. **categories**
   - id, user_id (nullable for defaults), name, color, icon, is_custom
   - UNIQUE constraint on (user_id, name) ← BR-2.1
   - CHECK constraint: color matches hex pattern ← BR-2.5
   - Seeded with 9 default categories (Housing, Food, Transportation, Entertainment, Healthcare, Personal, Utilities, Savings, Other)

5. **transactions**
   - id, user_id, budget_id, category_id, type, amount, date, payment_method, description, notes
   - CHECK constraint: amount > 0 ← TR-1.1
   - CHECK constraint: type IN ('income', 'expense') ← TR-1.2
   - Indexes on user_id, budget_id, category_id, date, type

6. **goals** (Phase 2)
   - id, user_id, name, target_amount, current_amount, deadline, status
   - CHECK constraint: target_amount > 0, current_amount >= 0

7. **user_settings** (Phase 2)
   - id, user_id (UNIQUE), currency, locale, theme

**Row Level Security (RLS)**:
- Enabled on ALL tables
- Users can ONLY access their own data (WHERE user_id = auth.uid())
- Default categories (user_id IS NULL) readable by all

**Server Actions Pattern** (MANDATORY for ALL data operations):

```typescript
'use server';

export async function createBudget(input: unknown) {
  // ✅ 1. Get authenticated session (MANDATORY)
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // ✅ 2. Validate input with Zod
  const validated = createBudgetSchema.parse(input);

  // ✅ 3. Business rules validation
  const budgetRepo = new BudgetRepository(supabase);
  const existing = await budgetRepo.findByMonthYear(user.id, validated.month, validated.year);
  if (existing) {
    return { success: false, error: 'Budget already exists for this month' };
  }

  // ✅ 4. Repository operation
  const budget = await budgetRepo.create(validated, user.id);

  // ✅ 5. Revalidate cache
  revalidatePath('/presupuesto');

  return { success: true, data: budget };
}
```

**React Query + Server Actions Integration**:

```typescript
'use client';

export function useBudgets() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      if (isOnline) {
        // Online: Server Action → Supabase
        const result = await getBudgets(); // Server Action
        if (result.success) {
          // Cache in IndexedDB
          await cacheService.cacheRecords('budgets', result.data);
          return result.data;
        }
        throw new Error(result.error);
      } else {
        // Offline: Read from IndexedDB cache
        return cacheService.readFromCache('budgets', userId);
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
}
```

**IndexedDB Cache Layer**:

- **Database**: `misfinanzas_cache_v1`
- **Stores**: budgets, transactions, categories, goals (mirror Supabase tables)
- **Cache Metadata**: `_cached_at`, `_pending_sync` fields added to each record
- **Sync Strategy**:
  - Online: Server Action → Supabase → Success → Cache in IndexedDB
  - Offline: Write to IndexedDB with `_pending_sync: true`
  - When online: Sync Manager processes pending queue

**Offline Sync Manager**:

```typescript
'use client';

export function SyncManager() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      syncPendingOperations(); // Process queue
    }
  }, [isOnline]);

  return null; // Background process
}

async function syncPendingOperations() {
  const pending = await cacheService.getPendingOps('budgets');
  for (const record of pending) {
    try {
      await createBudgetAction(record); // Server Action
      await cacheService.removePendingFlag(record.id);
    } catch (error) {
      console.error('Sync failed:', error);
      // Keep _pending_sync flag for retry
    }
  }
}
```

**Domains Summary**:

1. **auth**: Supabase Auth (register, login, logout) - Server Actions ONLY for auth operations
2. **budgets**: Repository, Server Actions, React Query hooks, calculation services
3. **categories**: Repository (defaults + custom), Server Actions, hooks
4. **transactions**: Repository, Server Actions, hooks, calculation services
5. **goals**: Repository, Server Actions, hooks (Phase 2)
6. **reports**: Report generators, hooks (computed, no persistence)
7. **settings**: Repository, Server Actions, export service (Phase 2)

**Files to Create**: ~50 files

**Infrastructure** (7 files):
- Supabase server/client setup
- Base repository class
- IndexedDB cache layer
- Cache service
- Sync manager
- Offline detector

**Per Domain** (~5-7 files each):
- types.ts
- schema.ts
- repository.ts (server-side Supabase repository)
- actions.ts (Server Actions with session validation)
- hooks/*.ts (React Query hooks calling Server Actions)
- services/*.ts (business logic)

**Implementation Timeline**:

- **Phase 1 (Week 1)**: Supabase setup, database schema, RLS policies, base repository
- **Phase 2 (Weeks 2-4)**: Core domains (auth, categories, budgets, transactions)
- **Phase 3 (Week 5)**: Offline support (IndexedDB cache, sync manager)
- **Phase 4 (Weeks 6-7)**: Advanced features (goals, reports, settings)
- **Phase 5 (Week 8)**: Testing and optimization

**Migration from Old Architecture**:

| Aspect | OLD (IndexedDB-only) | NEW (Supabase + IndexedDB) |
|--------|---------------------|---------------------------|
| **Primary Storage** | IndexedDB (browser) | Supabase PostgreSQL (cloud) |
| **Data Operations** | Client Components → IndexedDB | Server Actions → Supabase |
| **Session Validation** | Client-side only | Server-side (MANDATORY) |
| **Offline Support** | Native | IndexedDB cache + sync queue |
| **Repository Pattern** | Client-side | Server-side |

**Why This Change?**:

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

**Critical Constraints Followed**:

✅ **Server Actions MANDATORY**: All data operations through Server Actions  
✅ **Session Validation**: Every Server Action checks `auth.getUser()`  
✅ **Zod Validation**: All inputs validated  
✅ **Repository Pattern**: Server-side Supabase repositories  
✅ **Business Rules**: Database CHECK constraints + application validation  
✅ **RLS Policies**: Database-level user isolation  
✅ **Offline Support**: IndexedDB cache + sync manager  
✅ **React Query**: For server state management  
✅ **Named Exports**: All files use named exports

**Dependencies for Other Agents**:

- **nextjs-builder**: Use Server Actions in pages, understand offline/online flows
- **ux-ui-designer**: Design offline indicators, sync status, error states
- **shadcn-builder**: Select components for forms, loading states, error displays

**Next Steps**:

1. Parent agent reviews NEW architecture plan
2. Set up Supabase project and create database schema
3. Implement infrastructure (base repository, cache layer, sync manager)
4. Implement domains sequentially (auth → categories → budgets → transactions → reports → goals → settings)
5. Test online/offline scenarios thoroughly
6. Integrate with UI components from ux-ui-designer

**Status**: ✅ Domain architecture COMPLETELY REWRITTEN with hybrid offline-first approach

---

**End of Session Context (Append-Only)**
