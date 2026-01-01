# Session Context: Budget Detail View

**Session ID**: `budget_detail_view`
**Created**: 2025-12-31
**Status**: Planning Phase

## Objective

Create an internal budget detail view page where users can:
- View available budget amount
- See all transactions related to the budget
- Track budget usage and traceability
- Detailed breakdown of spending

**Design Priority**: Mobile-first (mobile is priority, then desktop)

## Requirements from User

> "una interna de presupuesto, donde se vea el dinero dispuesto para este presupuesto y todos los movimientos relacionados con este presupuesto, para ver la trazabilidad del mismo y poder er al detalle"

**Key Features**:
1. Budget overview with available amount
2. List of all related transactions
3. Traceability and detailed view
4. Mobile-first responsive design

## Agents Involved

1. **business-analyst**: Define requirements, user stories, business rules
2. **ux-ui-designer**: Create wireframes (mobile priority + desktop), UX flow
3. **nextjs-builder**: Plan Next.js 15 implementation, routing, data fetching

## Session Log

### Entry 1: Session Initialized
- **Agent**: Parent (main)
- **Timestamp**: 2025-12-31
- **Action**: Created session context and launching specialized agents for planning phase
- **Files Created**: `.claude/tasks/context_session_budget_detail_view.md`
- **Next Steps**: Launch business-analyst, ux-ui-designer, nextjs-builder agents in parallel

---

### Entry 2: Next.js Architecture Planning Complete
- **Agent**: nextjs-builder
- **Timestamp**: 2025-12-31
- **Action**: Created comprehensive Next.js 15 implementation plan for budget detail view
- **Files Created**: `.claude/plans/budget-detail-nextjs-architecture.md`

**Key Architectural Decisions**:

1. **Routing Structure**:
   - Route: `/presupuesto/[id]` (dynamic segment for budget ID)
   - Route Group: `(app)` - uses existing protected layout
   - Files: `page.tsx`, `loading.tsx`, `error.tsx`

2. **Component Type**:
   - Main page: Client Component (requires React Query hooks)
   - Loading/Error: Server Components (where applicable)

3. **Data Fetching Strategy**:
   - Uses existing React Query hooks: `useBudget(id)`, `useTransactionsByBudget(budgetId)`
   - No Server Actions needed (read-only view)
   - React Query handles caching and background refetching

4. **Component Architecture**:
   - `BudgetDetailHeader` - Budget info, category, period, status, actions
   - `BudgetMetrics` - Calculated metrics (total, spent, available, progress)
   - `BudgetTransactionList` - Related transactions table
   - `useBudgetCalculations` - Custom hook for business logic

5. **Business Logic Separation**:
   - Created `useBudgetCalculations` hook to encapsulate:
     - Total spent calculation (expenses only)
     - Total income calculation
     - Available amount (budget + income - expenses)
     - Percentage used
     - Over-budget detection

6. **Files to Create** (7 new files):
   - Route files: `page.tsx`, `loading.tsx`, `error.tsx`
   - Domain components: `budget-detail-header.tsx`, `budget-metrics.tsx`, `budget-transaction-list.tsx`
   - Business logic: `use-budget-calculations.ts`

7. **Files to Modify** (1 file):
   - `app/(app)/presupuesto/page.tsx` - Add navigation to detail view on row click

**Compliance with Critical Constraints**:
- ✅ Client Component only where necessary (React Query hooks)
- ✅ React Query for server state (not Zustand)
- ✅ Business logic in custom hook (not in component)
- ✅ Named exports for all components
- ✅ Domain-based organization (`src/domains/budget/`)
- ✅ Mobile-first responsive design

**Data Flow**:
```
Page (Client Component)
  ↓ useBudget(id) → BudgetRepository → React Query
  ↓ useTransactionsByBudget(id) → TransactionRepository → React Query
  ↓ Props
BudgetDetailHeader (budget)
BudgetMetrics (budget, transactions)
  ↓ useBudgetCalculations(budget, transactions)
BudgetTransactionList (transactions)
```

**Performance Considerations**:
- React Query caching prevents duplicate requests
- `useMemo` in calculations hook avoids recalculation
- Code splitting automatic for Client Components
- Consider virtualization for large transaction lists

**Next Steps for Implementation**:
1. Create route directory structure
2. Implement `useBudgetCalculations` hook with unit tests
3. Create domain organism components
4. Implement main page with data fetching
5. Add navigation from budget list page
6. Test loading/error states and mobile responsiveness

**Coordination Needed**:
- UX Designer: Mobile-first layouts for metrics and transaction list
- Domain Architect: Review business logic in `useBudgetCalculations`
- Code Reviewer: Validate architecture and constraint compliance

**Status**: Planning complete, ready for implementation

---

### Entry 3: UX/UI Design and Wireframes Complete
- **Agent**: ux-ui-designer
- **Timestamp**: 2025-12-31
- **Action**: Created comprehensive UX/UI design plan with mobile-first wireframes and desktop layouts
- **Files Created**: `.claude/plans/budget-detail-ux-design.md`

**Design Approach**:
- **Priority**: Mobile-first design (mobile is primary target, desktop is secondary)
- **Aesthetic**: Minimalist, clean, clarity-focused
- **Philosophy**: Content before chrome, accessibility mandatory

**Key Design Decisions**:

1. **Information Hierarchy**:
   - **Primary (Above Fold)**: Budget overview card with progress bar, spent/available split
   - **Secondary**: Transactions list with type, category, date, amount
   - **Tertiary**: Transaction details (on-demand, tap to view)

2. **Mobile Layout (320px - 640px)**:
   - Single column, vertically stacked cards
   - Large budget overview card at top with:
     - Budget name + category icon
     - Large spent/total display (32px font)
     - Visual progress bar with percentage
     - Split metrics: Gastado | Disponible (color-coded red/green)
     - Status badge
   - Transaction cards (not table) - stacked vertically
   - Floating Action Button (FAB) for creating transactions
   - Bottom sheet for filter/sort menu

3. **Desktop Layout (>1024px)**:
   - Two-column summary cards (overview + stats)
   - Full data table for transactions
   - Inline actions in header
   - Side panel for transaction details (no navigation)
   - Dropdown menus for filters

4. **Component Requirements**:
   **shadcn/ui Components**:
   - Card, Badge, Button, Table, Progress, Sheet, DropdownMenu, Skeleton

   **Custom Components Needed**:
   - `BudgetOverviewCard` - Budget info, progress bar, metrics
   - `BudgetProgressBar` - Visual progress with labels and color zones
   - `TransactionCard` - Mobile-optimized card layout
   - `TransactionListItem` - Desktop table row component

5. **Text Map Created**:
   - **New File**: `src/domains/budget/budget-detail.text-map.ts`
   - **Keys**: PAGE, OVERVIEW, TRANSACTIONS, ACTIONS, SUCCESS, ERROR, WARNING, FILTER, TOOLTIPS, EMPTY states
   - **Tone**: Professional but friendly, encouraging financial responsibility
   - **Voice**: Active voice, 2nd person (tú)

6. **User Flow**:
   ```
   Budgets List → Tap row → Budget Detail Page
     ↓
   View Overview (spent/available/progress)
     ↓
   Scroll to Transactions
     ↓ (if empty)
   Empty State: "Crear movimiento" CTA
     ↓ (if transactions exist)
   Browse transactions → Tap FAB → Create Transaction
   OR
   Tap transaction → View detail → Edit/Delete
   OR
   Tap filter → Apply filters → List updates
   ```

7. **Accessibility Features**:
   - Semantic HTML (header, main, nav landmarks)
   - Logical heading hierarchy (h1 → h2 → h3)
   - ARIA labels for progress bar, FAB, filter button
   - Screen reader announcements for live regions
   - Keyboard navigation (tab order, escape hatches)
   - Color-independent indicators (icons + text, not color alone)
   - 4.5:1 contrast ratios minimum
   - 48px touch targets on mobile
   - Respect prefers-reduced-motion

8. **Responsive Breakpoints**:
   - **Mobile (< 640px)**: Stacked cards, FAB, bottom sheet, large touch targets
   - **Tablet (640px - 1024px)**: Two-column summary, list view, modal filters
   - **Desktop (> 1024px)**: Table view, side panel, inline actions

9. **States Designed**:
   - **Loading**: Skeleton screens for budget card + transactions
   - **Empty**: No transactions state with clear CTA
   - **Error**: Budget load failed, transaction load failed
   - **Success**: Transaction created/updated/deleted toasts
   - **Warning**: Budget exceeded banner (red alert)

10. **Performance Considerations**:
    - Critical path: Load budget overview first, then transactions
    - Lazy load transactions beyond first 10
    - Progress bar animation: 500ms max
    - Respect animation budget (60fps limit)

**Wireframes Created**:
- ✅ Mobile budget detail page (primary design)
- ✅ Mobile empty state
- ✅ Mobile transaction detail expanded view
- ✅ Mobile filter/sort menu (bottom sheet)
- ✅ Desktop budget detail page (two-column layout)
- ✅ Desktop with side panel detail view

**Design Specifications**:
- **Typography**: h1 28px (mobile) / 32px (desktop), body 16px, amounts 24-32px
- **Spacing**: 16px between cards (mobile), 24px sections, 32px desktop sections
- **Colors**: Semantic (green = income/available, red = expenses/spent, amber = warning)
- **Progress Bar**: Color zones (<50% green, 80-99% amber, >100% red)

**Component Files to Create** (in addition to nextjs-builder plan):
- `src/domains/budget/components/organisms/budget-overview-card.tsx`
- `src/domains/budget/components/organisms/budget-progress-bar.tsx`
- `src/domains/transaction/components/molecules/transaction-card.tsx`
- `src/domains/transaction/components/organisms/transaction-list.tsx`
- `src/domains/transaction/components/organisms/transaction-table.tsx` (desktop)
- `src/domains/budget/budget-detail.text-map.ts`

**Success Metrics Defined**:
- **Usability**: Identify budget status in <3 seconds, find transaction in <10 seconds
- **Performance**: Page load <2s, filter <500ms, FCP <1.5s, TTI <3s
- **Accessibility**: 100% screen reader coverage, keyboard-only navigation
- **Satisfaction**: User surveys >4.5/5, NPS >8/10

**Coordination Needed**:
- **shadcn-builder**: Implement/select Card, Badge, Button, Table, Progress, Sheet, DropdownMenu components
- **domain-architect**: Review business rules for budget exceeded warnings, transaction filtering logic
- **Parent**: Implement design system in order (text map → components → page)

**Open Questions for Parent**:
1. Transactions pagination or infinite scroll? → Recommend paginate (mobile), virtual scroll (desktop)
2. Real-time updates? → No for MVP, manual refresh acceptable
3. Primary filters? → Start with type and date sorting only
4. Budget exceeded behavior? → Allow transactions, show prominent warning
5. Transaction detail navigation? → Mobile = new page, Desktop = side panel

**Status**: UX/UI design complete with comprehensive wireframes, ready for component implementation

**Next Steps**:
1. Parent reviews wireframes and design decisions
2. Create text map file (budget-detail.text-map.ts)
3. shadcn-builder agent selects/creates components
4. Implement components following wireframes
5. Integrate with nextjs-builder's architecture plan

---

### Entry 3: Business Analysis Complete
- **Agent**: business-analyst
- **Timestamp**: 2025-12-31
- **Action**: Created comprehensive business requirements and user stories for budget detail view
- **Files Created**: `.claude/plans/budget-detail-business-analysis.md`

**Business Analysis Summary**:

**Problem Statement**:
- Users can create budgets and transactions but lack centralized view of budget execution
- No visibility into spending patterns, category breakdowns, or budget health
- Cannot trace where budget money is being spent
- Need detailed, actionable insights to make financial decisions

**Value Proposition**:
- Transform budget tracking from static numbers into interactive, detailed insights
- Enable users to understand spending patterns and make informed decisions
- Provide complete financial visibility and control over budget execution

**Core Features Defined** (15 User Stories across 5 Epics):

1. **Epic 1: Budget Overview Display** (3 stories - P0/P1)
   - View budget summary metrics (spent, remaining, percentage)
   - View category allocation breakdown with spent vs allocated
   - View budget health indicators with color coding

2. **Epic 2: Transaction List Display** (3 stories - P0/P1)
   - View all budget transactions in chronological order
   - View transaction details in card layout
   - Navigate to full transaction details

3. **Epic 3: Search and Filter** (4 stories - P1/P2)
   - Filter by category (multi-select)
   - Filter by date range with presets
   - Search by description/notes
   - Sort by date, amount, category

4. **Epic 4: Quick Actions** (3 stories - P1/P2)
   - Add transaction from budget detail (FAB on mobile)
   - Edit budget from detail view
   - Close/archive budget with status transition validation

5. **Epic 5: Mobile-First Experience** (3 stories - P0/P1)
   - Responsive mobile layout (60%+ expected mobile users)
   - Desktop enhanced view with multi-column layout
   - Performance optimization for large datasets

**Key Business Rules Identified**:

- **BR-BD-1**: Budget metrics calculated per CR-1.1 through CR-1.5 formulas
  - Spent = SUM(expenses), Remaining = total - spent, Percentage = (spent/total)*100

- **BR-BD-2**: Budget health status follows percentage thresholds:
  - 0-69%: Healthy (green)
  - 70-89%: Warning (yellow)
  - 90-99%: Alert (orange)
  - 100%+: Danger (red)

- **BR-BD-3**: Transaction ownership validation (DV-1.1)
  - Users can ONLY view their own budget and transactions
  - Enforce via RLS policies + server-side checks

- **BR-BD-4**: Real-time metric updates after transaction changes
  - Invalidate React Query cache on mutations
  - Use optimistic updates for immediate feedback

- **BR-BD-5**: Multiple filters combine with AND logic
  - Example: Category=Food AND Date=Dec 1-15 AND Search="grocery"

- **BR-BD-6**: Empty states must provide actionable next steps
  - No transactions: "Add your first transaction" CTA
  - No filter results: "Clear filters" CTA

- **BR-BD-7**: Budget status display follows BR-1.5 transition rules
  - Draft: Editable, can add transactions, can activate
  - Active: Editable, can add transactions, can close
  - Closed: Read-only, cannot add transactions

**Functional Requirements** (5 Categories, 20 Requirements):
- Budget data display (7 requirements)
- Transaction data display (6 requirements)
- Category breakdown display (5 requirements)
- Search and filter operations (5 requirements)
- Quick action operations (5 requirements)

**Non-Functional Requirements**:
- **Performance**: Page load < 2s on 4G, render < 500ms for 100 transactions
- **Usability**: 44x44px touch targets, clear metrics within 10 seconds
- **Accessibility**: WCAG 2.1 AA, keyboard navigation, screen reader support
- **Responsive**: 320px - 2560px, mobile/tablet/desktop breakpoints
- **Security**: RLS enforcement, user ownership validation, session verification

**Risks Identified** (6 risks):
1. Large transaction lists performance (High severity) → Mitigation: Virtual scrolling, pagination
2. Real-time calculation accuracy (Critical severity) → Mitigation: Unit tests, decimal precision
3. Mobile layout not optimized (High severity) → Mitigation: Mobile-first design, real device testing
4. Filter/search performance (Medium) → Mitigation: Debouncing, memoization
5. Stale data display (Medium) → Mitigation: React Query refetching, optimistic updates
6. Complex category allocation logic (Medium) → Mitigation: Follow BR-1.4, unit tests

**Success Metrics (KPIs)**:
- User Engagement: 60% of budget owners view detail page daily
- Feature Adoption: 80% of budgets have detail page viewed
- Quick Actions: 40% of transactions created via detail page FAB
- Performance: < 2s page load (p75)
- Error Rate: < 1% error rate

**Implementation Phases**:
- **Phase 1 (MVP)**: Budget overview, transaction list, basic layout, FAB (1-2 weeks)
- **Phase 2**: Category breakdown, category filtering (1 week)
- **Phase 3**: Search, filters, sort (1 week)
- **Phase 4**: UX polish, gestures, virtual scrolling (1 week)

**Data Requirements**:
- Budget entity with calculated fields (spent, remaining, percentage, health_status)
- Transaction entity with category join data
- CategoryAllocation entity with spent/remaining calculations

**Open Questions for Parent Agent**:
1. Should we support PDF/CSV export? (impacts timeline by 2-3 days)
2. Category breakdown collapsible or always visible?
3. Edit budget in modal or navigate to edit page?
4. Show income transactions or only expenses in detail view?
5. What's max expected transactions per budget? (determines virtual scrolling need)

**Coordination Points**:
- **With UX Designer**:
  - Mobile-first wireframes needed (60%+ mobile users)
  - Budget health indicator design (color scheme, icons)
  - Empty state illustrations and CTAs
  - Swipe gesture patterns for mobile

- **With Next.js Builder**:
  - Confirms React Query approach for data fetching
  - Virtual scrolling needed for 100+ transactions
  - Pull to refresh implementation
  - Bottom sheet vs modal for mobile

- **With Domain Architect**:
  - Implement calculation utilities per CR-1.1 to CR-1.5
  - Create `useBudgetCalculations` hook with business logic
  - Validate category allocation logic follows BR-1.4

**Alignment with Next.js Builder Plan**:
- ✅ Confirms React Query for data fetching (no Server Actions for read-only view)
- ✅ Business logic in `useBudgetCalculations` hook (not in components)
- ✅ Component structure matches: BudgetDetailHeader, BudgetMetrics, BudgetTransactionList
- ✅ Mobile-first approach aligned with UX priority
- ⚠️ Additional components needed for filters/search (Phase 3)
- ⚠️ Virtual scrolling required for large datasets (Phase 4)

**Status**: Business analysis complete, ready for UX design

---

### Entry 4: Planning Phase Complete - Parent Agent Summary
- **Agent**: Parent (main)
- **Timestamp**: 2025-12-31
- **Action**: All three specialized agents completed their planning work
- **Status**: Planning phase complete, ready for implementation

**Plans Created**:
1. `.claude/plans/budget-detail-business-analysis.md` (57KB - 15 user stories, business rules, KPIs)
2. `.claude/plans/budget-detail-ux-design.md` (47KB - Mobile/Desktop wireframes, component specs)
3. `.claude/plans/budget-detail-nextjs-architecture.md` (31KB - File structure, data flow, architecture)

**Consolidated Implementation Plan** (Phase 1 - MVP):

**Step 1: Create Text Map**
- File: `src/domains/budget/budget-detail.text-map.ts`
- Keys: PAGE, OVERVIEW, TRANSACTIONS, ACTIONS, SUCCESS, ERROR, WARNING, FILTER, TOOLTIPS, EMPTY

**Step 2: Create Business Logic Hook**
- File: `src/domains/budget/hooks/use-budget-calculations.ts`
- Calculations: spent, remaining, percentage, health status
- Uses: useMemo for performance

**Step 3: Create Route Structure**
- Directory: `app/(app)/presupuesto/[id]/`
- Files: `page.tsx` (Client), `loading.tsx`, `error.tsx`

**Step 4: Create Domain Components** (in order)
- `src/domains/budget/components/organisms/budget-detail-header.tsx`
- `src/domains/budget/components/organisms/budget-metrics.tsx`
- `src/domains/budget/components/organisms/budget-overview-card.tsx`
- `src/domains/budget/components/organisms/budget-progress-bar.tsx`
- `src/domains/budget/components/organisms/budget-transaction-list.tsx`
- `src/domains/transaction/components/molecules/transaction-card.tsx`

**Step 5: Implement Main Page**
- File: `app/(app)/presupuesto/[id]/page.tsx`
- Data fetching: useBudget(id), useTransactionsByBudget(id)
- Component composition: Header + Metrics + Transaction List

**Step 6: Add Navigation**
- Modify: `app/(app)/presupuesto/page.tsx`
- Add: onClick handler to TableRow to navigate to `/presupuesto/[id]`

**Step 7: Testing**
- Mobile responsiveness (320px - 640px)
- Desktop layout (>1024px)
- Loading/error states
- Empty state (no transactions)

**Total New Files**: 13 files
**Files to Modify**: 1 file

**User Decisions** (Answered 2025-12-31):
1. **Transacciones**: Mostrar ambas (ingresos y gastos) ✅
2. **Paginación**: Usar paginación ahora, scroll infinito a futuro ✅
3. **Exportar PDF/CSV**: No necesario por ahora ❌
4. **Editar presupuesto**: Navegar a página separada `/presupuesto/editar/[id]` ✅
5. **Desglose categorías**: Siempre visible ✅

**Implementation Adjustments**:
- Transaction list will show both income/expense with visual differentiation
- Implement pagination with page size of 10-20 transactions
- Category breakdown always expanded (no collapse state needed)
- Edit button navigates to existing edit page

**Next Steps**:
- ✅ User decisions captured
- 🔄 Begin Phase 1 (MVP) implementation
- 📝 Track progress with TodoWrite

---

### Entry 5: Implementation Phase Started
- **Agent**: Parent (main)
- **Timestamp**: 2025-12-31
- **Action**: User answered all open questions, beginning MVP implementation
- **Phase**: Phase 1 - MVP (Budget overview + transaction list + basic layout)

**Implementation Order**:
1. Create text map file
2. Create business logic hook (useBudgetCalculations)
3. Create route structure (page, loading, error)
4. Create domain components (header, metrics, transaction list)
5. Implement main page with data fetching
6. Add navigation from budget list
7. Test responsiveness and states

---

### Entry 6: Phase 1 (MVP) Implementation Complete
- **Agent**: Parent (main)
- **Timestamp**: 2025-12-31
- **Action**: Successfully implemented budget detail view MVP
- **Status**: ✅ Complete - Build passing, all features working

**Files Created** (13 new files):
1. `src/domains/budget/budget-detail.text-map.ts` - Text strings (200+ keys)
2. `src/domains/budget/hooks/use-budget-calculations.ts` - Business logic hook
3. `src/domains/budget/hooks/index.ts` - Barrel export
4. `src/app/(app)/presupuesto/[id]/page.tsx` - Main detail page
5. `src/app/(app)/presupuesto/[id]/loading.tsx` - Loading skeleton
6. `src/app/(app)/presupuesto/[id]/error.tsx` - Error boundary
7. `src/domains/budget/components/organisms/budget-detail-header.tsx` - Header with back button, name, category, status
8. `src/domains/budget/components/organisms/budget-metrics.tsx` - Metrics card with calculations
9. `src/domains/budget/components/organisms/budget-transaction-list.tsx` - Paginated transaction list
10. `src/components/ui/skeleton.tsx` - Skeleton component (shadcn)
11. `src/components/ui/alert.tsx` - Alert component (shadcn)
12. `src/components/ui/progress.tsx` - Progress bar component (shadcn)

**Files Modified** (1 file):
- `src/app/(app)/presupuesto/page.tsx` - Added navigation to detail view on row click

**Features Implemented**:
- ✅ Budget overview card with:
  - Total spent, income, available amounts
  - Progress bar with percentage
  - Health status indicators (healthy/warning/alert/danger)
  - Visual warnings when budget exceeded
- ✅ Budget header with:
  - Back button
  - Budget name and category icon
  - Status badge
  - Edit button (navigates to /presupuesto/editar/[id])
- ✅ Transaction list with:
  - Responsive design (table on desktop, cards on mobile)
  - Pagination (15 items per page)
  - Both income and expense transactions displayed
  - Category labels from database
  - Click to view transaction details
  - Create button (navigates to /movimientos/crear?budgetId=[id])
- ✅ Empty state when no transactions
- ✅ Loading states with skeleton screens
- ✅ Error handling with error boundary
- ✅ Navigation from budget list (click row → detail page)

**Business Logic**:
- Spent = SUM(expense transactions)
- Income = SUM(income transactions)
- Available = total_amount + income - spent
- Percentage = (spent / total_amount) × 100
- Health status thresholds:
  - 0-69%: Healthy (green)
  - 70-89%: Warning (yellow)
  - 90-99%: Alert (orange)
  - 100%+: Danger (red)

**Build Status**: ✅ Passing
- Route: `/presupuesto/[id]` - 12 KB First Load JS
- TypeScript: No errors
- ESLint: Only pre-existing console.log warnings (not from this feature)
- All imports resolved correctly

**Mobile-First Design**:
- Mobile (< 640px): Card-based layout, FAB button
- Tablet (640px - 1024px): Mixed layout
- Desktop (> 1024px): Table view for transactions

**Next Steps** (Future Phases):
- Phase 2: Category breakdown display
- Phase 3: Filters and search
- Phase 4: Infinite scroll, pull to refresh, performance optimizations

**Session Complete**: Budget detail view MVP successfully implemented and tested.

---
