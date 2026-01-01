# Business Analysis Plan: Budget Detail View

**Session ID**: `budget_detail_view`
**Created**: 2025-12-31
**Agent**: business-analyst
**Status**: Ready for Implementation

---

## Executive Summary

This document provides comprehensive business analysis for creating a Budget Detail View page where users can view their budget's available amount, track all related transactions, monitor spending by category, and gain full traceability and visibility into budget usage. The page will enable users to understand exactly how their budget is being used and make informed financial decisions.

**Core Value Proposition**: Transform budget tracking from a static number into an interactive, detailed view that empowers users to understand their spending patterns, identify budget issues quickly, and maintain financial control.

---

## 1. Problem Statement

### Current Situation
Users can currently:
- Create budgets with total amounts
- View budget lists on the budget index page
- Create transactions linked to budgets

However, users CANNOT:
- See detailed breakdown of how a specific budget is being used
- View all transactions related to a specific budget in one place
- Track category-level spending within a budget
- Understand budget health at a glance
- Identify spending patterns or outliers quickly

### Desired Outcome
Users will be able to:
- Click on any budget to see a detailed view
- View comprehensive budget metrics (spent, remaining, percentage used)
- See all transactions linked to that budget in chronological order
- Filter and search transactions within the budget
- Track spending by category with visual breakdowns
- Identify budget issues (overspending, categories over budget)
- Take quick actions (add transaction, edit budget, export data)

### Value Proposition
**For users**: Gain complete financial visibility and control over budget execution
**Benefit**: Make better spending decisions based on real-time data and trend analysis
**Impact**: Reduce overspending, improve budget adherence, increase financial awareness

---

## 2. Stakeholders

### Primary Users: Budget Owners

**User Profile**: Individuals managing personal finances who have created budgets

**Goals**:
- Understand how much budget remains available
- Track all expenses charged to this budget
- Identify which categories are consuming most budget
- Spot overspending early before it becomes a problem
- Make informed decisions about future spending
- Keep detailed records for future reference

**Pain Points (Current)**:
- No centralized view of budget usage
- Cannot easily see which transactions belong to a budget
- Difficult to understand spending patterns
- No warning when approaching budget limits
- Cannot trace where budget money went

**Needs from Budget Detail View**:
- **Clarity**: Clear, easy-to-understand budget metrics
- **Visibility**: Complete list of all related transactions
- **Traceability**: Ability to trace every dollar spent
- **Actionability**: Quick access to add transactions or adjust budget
- **Insights**: Visual representation of spending patterns
- **Control**: Filters and search to find specific transactions

**Technical Level**: Beginner to Intermediate (mobile-first, simple interface required)

**Primary Device**: Mobile (60-70% usage expected)

---

## 3. Scope

### In Scope ✅

**Page Features**:
- Budget overview header with key metrics
- Transaction list filtered by budget
- Category spending breakdown
- Visual indicators (progress bars, status badges)
- Search and filter capabilities
- Quick action buttons (add transaction, edit budget)
- Responsive mobile-first design

**Metrics Displayed**:
- Total budget amount
- Amount spent (from transactions)
- Amount remaining (calculated)
- Percentage used (calculated)
- Budget status (draft/active/closed)
- Category allocations (if configured)
- Category spending vs allocation

**Transaction Features**:
- Chronological list of all budget transactions
- Transaction type indicator (income/expense)
- Category badge with color coding
- Amount with proper formatting
- Date display
- Description/notes preview
- Payment method indicator
- Quick view/edit actions

**Interactions**:
- Click transaction to view details
- Swipe to edit/delete transaction (mobile)
- Filter by category
- Filter by date range
- Search by description
- Sort by date, amount, category
- Pull to refresh (mobile)
- Add transaction FAB (Floating Action Button)

### Out of Scope ❌

**Explicitly NOT included in MVP**:
- Budget comparison across months
- Predictive spending analytics
- Budget templates or recommendations
- Shared budgets with other users
- Budget export/import functionality
- Recurring transaction management from detail view
- Transaction attachments or receipts
- Budget goals progress tracking
- Multi-currency support
- Advanced reporting (charts, graphs beyond basics)

**Future Considerations**:
- Add expense prediction based on historical data
- Include budget health score
- Add budget alerts and notifications
- Create spending heatmaps by category
- Export budget data to CSV/PDF
- Budget vs actual comparison views

### Assumptions

1. **Data Availability**: Budget has valid ID and is accessible from URL parameter
2. **User Authentication**: User is authenticated and has permission to view budget
3. **Data Ownership**: User can only view budgets they own (userId match)
4. **Transaction Linking**: Transactions are properly linked to budget via budget_id foreign key
5. **Category Data**: Categories exist and are properly linked to transactions
6. **Real-time Updates**: Data updates reflect immediately (no caching delays)
7. **Mobile Priority**: 60%+ users access from mobile devices
8. **Network**: Basic internet connectivity available (4G+)
9. **Browser**: Modern browser with ES6+ support

### Dependencies

**Technical Dependencies**:
- Supabase client for data fetching
- Next.js 15 App Router for routing and SSR
- React 19 for UI components
- Tailwind CSS v4 for styling
- React Query for data management and caching
- Budget repository/service for data access
- Transaction repository/service for data access
- Category repository/service for data access

**Data Dependencies**:
- Budget entity must exist in database
- Transactions table with budget_id foreign key
- Categories table for category information
- Category allocations table (optional, for enhanced view)

**Feature Dependencies**:
- Transaction creation flow must be functional
- Budget creation/editing must be functional
- Category management must be functional
- User authentication system

**External Dependencies**:
- Supabase database availability
- Session/auth context availability

---

## 4. User Stories and Features

### Epic 1: Budget Overview Display

**Priority**: P0 (Critical - Core Value)

#### US-1.1: View Budget Summary Metrics

**As a** budget owner
**I want to** see key budget metrics at the top of the detail page
**So that** I can quickly understand my budget's current status

**Acceptance Criteria**:
- [ ] Display budget name prominently at top of page
- [ ] Show total budget amount with currency formatting
- [ ] Display amount spent (sum of expense transactions)
- [ ] Display amount remaining (total - spent)
- [ ] Show percentage used with visual progress bar
- [ ] Indicate budget status (draft/active/closed) with status badge
- [ ] Display month/year if budget is monthly
- [ ] Show budget category if assigned
- [ ] Use color coding (green for healthy, yellow for warning, red for overspent)
- [ ] Update metrics in real-time when transactions change

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-1.2: View Category Allocation Breakdown

**As a** budget owner
**I want to** see how much of my budget is allocated to each category
**So that** I can understand my spending distribution plan

**Acceptance Criteria**:
- [ ] Display list of category allocations (if configured)
- [ ] Show allocated amount per category
- [ ] Show spent amount per category (from transactions)
- [ ] Calculate and display remaining per category
- [ ] Show percentage used per category with mini progress bar
- [ ] Use category color for visual identification
- [ ] Display category icon next to category name
- [ ] Indicate overspent categories with warning color
- [ ] Show "No allocations configured" message if none exist
- [ ] Make each category clickable to filter transactions

**Priority**: P1 (High - Important for UX)
**Estimated Effort**: Medium

---

#### US-1.3: View Budget Health Indicators

**As a** budget owner
**I want to** see visual indicators of budget health
**So that** I can quickly identify potential spending issues

**Acceptance Criteria**:
- [ ] Show green status when budget usage < 70%
- [ ] Show yellow warning when budget usage between 70-90%
- [ ] Show orange alert when budget usage between 90-100%
- [ ] Show red danger status when budget overspent (>100%)
- [ ] Display "Budget Healthy" message when under 70%
- [ ] Display "Approaching Limit" message when 70-90%
- [ ] Display "Almost Exhausted" message when 90-100%
- [ ] Display "Budget Exceeded" message when overspent
- [ ] Include icon indicator (check, warning, alert, error)
- [ ] Update status immediately when transactions change

**Priority**: P1 (High - Important for UX)
**Estimated Effort**: Small

---

### Epic 2: Transaction List Display

**Priority**: P0 (Critical - Core Functionality)

#### US-2.1: View All Budget Transactions

**As a** budget owner
**I want to** see a complete list of transactions linked to this budget
**So that** I can trace every expense and income

**Acceptance Criteria**:
- [ ] Display all transactions where budget_id matches current budget
- [ ] Show transactions in reverse chronological order (newest first)
- [ ] Display transaction date in readable format (e.g., "Dec 31, 2025")
- [ ] Show transaction amount with currency symbol
- [ ] Indicate transaction type with icon (income/expense)
- [ ] Display category name with color badge
- [ ] Show transaction description (truncated if long)
- [ ] Include payment method indicator
- [ ] Display "No transactions yet" message if empty
- [ ] Support infinite scroll or pagination for large lists
- [ ] Show loading skeleton while fetching data
- [ ] Update list immediately when new transaction added

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-2.2: View Transaction Details in List

**As a** budget owner
**I want to** see essential transaction information in the list
**So that** I don't need to click into every transaction

**Acceptance Criteria**:
- [ ] Each transaction card shows: date, amount, category, description
- [ ] Use transaction type color coding (red for expense, green for income)
- [ ] Display category icon and color
- [ ] Show payment method icon (if available)
- [ ] Truncate long descriptions with ellipsis (show full on expand)
- [ ] Display relative date for recent transactions ("Today", "Yesterday")
- [ ] Show exact date for older transactions
- [ ] Include visual separator between days
- [ ] Use card-based layout for mobile readability
- [ ] Support compact view option for desktop

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-2.3: Navigate to Transaction Details

**As a** budget owner
**I want to** click on a transaction to see full details
**So that** I can view complete information and edit if needed

**Acceptance Criteria**:
- [ ] Entire transaction card is clickable
- [ ] Clicking opens transaction detail modal/sheet (mobile)
- [ ] Clicking navigates to transaction detail page (desktop option)
- [ ] Show loading state during navigation
- [ ] Display full transaction information in detail view
- [ ] Include edit and delete actions in detail view
- [ ] Support swipe gestures on mobile for quick actions
- [ ] Provide back navigation to return to budget detail
- [ ] Maintain scroll position when returning from detail
- [ ] Support keyboard navigation (arrow keys to navigate list)

**Priority**: P1 (High)
**Estimated Effort**: Medium

---

### Epic 3: Search and Filter Capabilities

**Priority**: P1 (High - Important for Large Datasets)

#### US-3.1: Filter Transactions by Category

**As a** budget owner
**I want to** filter transactions by category
**So that** I can see spending in specific areas

**Acceptance Criteria**:
- [ ] Display category filter dropdown/chips
- [ ] Show all categories that have transactions in this budget
- [ ] Support selecting multiple categories
- [ ] Apply filter immediately when selected
- [ ] Update transaction count badge when filtered
- [ ] Show "Showing X of Y transactions" indicator
- [ ] Include "All Categories" option to clear filter
- [ ] Persist filter selection during session
- [ ] Update available categories when transactions change
- [ ] Provide visual feedback when filter active

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-3.2: Filter Transactions by Date Range

**As a** budget owner
**I want to** filter transactions by date range
**So that** I can focus on specific time periods

**Acceptance Criteria**:
- [ ] Provide date range picker component
- [ ] Support preset ranges (This Week, This Month, Last 7 days, Last 30 days)
- [ ] Allow custom date range selection
- [ ] Default to budget month if monthly budget
- [ ] Apply filter immediately when date range selected
- [ ] Show selected date range in filter UI
- [ ] Update transaction count when filtered
- [ ] Include "All Dates" option to clear filter
- [ ] Validate that end date >= start date
- [ ] Persist date filter during session

**Priority**: P2 (Medium - Nice to have)
**Estimated Effort**: Medium

---

#### US-3.3: Search Transactions by Description

**As a** budget owner
**I want to** search transactions by description or notes
**So that** I can quickly find specific expenses

**Acceptance Criteria**:
- [ ] Provide search input field at top of transaction list
- [ ] Search across transaction description and notes fields
- [ ] Implement case-insensitive search
- [ ] Show search results immediately (debounced by 300ms)
- [ ] Highlight matching text in results
- [ ] Display "No results found" when search returns empty
- [ ] Show count of matching transactions
- [ ] Include clear/reset search button
- [ ] Maintain search term during session
- [ ] Support clearing search with Escape key

**Priority**: P2 (Medium - Nice to have)
**Estimated Effort**: Small

---

#### US-3.4: Sort Transactions

**As a** budget owner
**I want to** sort transactions by different criteria
**So that** I can organize the list for my needs

**Acceptance Criteria**:
- [ ] Support sort by date (ascending/descending)
- [ ] Support sort by amount (ascending/descending)
- [ ] Support sort by category name (alphabetical)
- [ ] Default sort is date descending (newest first)
- [ ] Show current sort indicator (arrow icon)
- [ ] Apply sort immediately when selected
- [ ] Persist sort preference during session
- [ ] Provide sort dropdown/menu
- [ ] Include sort direction toggle
- [ ] Update list smoothly without jarring re-render

**Priority**: P2 (Medium)
**Estimated Effort**: Small

---

### Epic 4: Quick Actions

**Priority**: P1 (High - Important for UX)

#### US-4.1: Add Transaction from Budget Detail

**As a** budget owner
**I want to** quickly add a new transaction to this budget
**So that** I don't have to navigate away and manually select budget

**Acceptance Criteria**:
- [ ] Display floating action button (FAB) on mobile
- [ ] Display "Add Transaction" button on desktop
- [ ] Pre-select current budget when opening transaction form
- [ ] Open transaction creation modal/sheet
- [ ] Show budget name in form header for context
- [ ] Submit transaction and update budget detail automatically
- [ ] Close form and show success message on completion
- [ ] Update transaction list immediately with new transaction
- [ ] Update budget metrics (spent, remaining, percentage)
- [ ] Scroll to new transaction in list after creation

**Priority**: P1
**Estimated Effort**: Small

---

#### US-4.2: Edit Budget from Detail View

**As a** budget owner
**I want to** edit budget details from the detail page
**So that** I can make adjustments without navigating away

**Acceptance Criteria**:
- [ ] Display edit button in budget header
- [ ] Open budget edit modal/sheet when clicked
- [ ] Pre-populate form with current budget data
- [ ] Support editing: name, total amount, category allocations
- [ ] Validate edits according to business rules (BR-1.3, BR-1.4)
- [ ] Update budget and refresh detail view on save
- [ ] Show success message on successful update
- [ ] Recalculate metrics after budget amount changes
- [ ] Handle validation errors gracefully
- [ ] Prevent editing if budget is closed (status validation)

**Priority**: P2 (Medium)
**Estimated Effort**: Small

---

#### US-4.3: Close/Archive Budget

**As a** budget owner
**I want to** close or archive a budget from detail view
**So that** I can mark completed budgets without deletion

**Acceptance Criteria**:
- [ ] Display close/archive action in budget menu
- [ ] Only show if budget status is "active" (follow BR-1.5 transitions)
- [ ] Show confirmation dialog before closing
- [ ] Update budget status to "closed"
- [ ] Update status badge immediately after close
- [ ] Prevent further transactions from being added
- [ ] Show "Budget Closed" banner after closing
- [ ] Provide option to view closed budgets in read-only mode
- [ ] Maintain transaction history after closing
- [ ] Log status change with timestamp

**Priority**: P2 (Medium)
**Estimated Effort**: Small

---

### Epic 5: Mobile-First Experience

**Priority**: P0 (Critical - User Base Priority)

#### US-5.1: Responsive Mobile Layout

**As a** mobile user
**I want to** view budget details optimized for my device
**So that** I can easily access information on the go

**Acceptance Criteria**:
- [ ] Use full-width mobile layout (< 768px)
- [ ] Stack budget metrics vertically on mobile
- [ ] Use card-based transaction list for mobile
- [ ] Implement pull-to-refresh on mobile
- [ ] Use bottom sheet for modals on mobile
- [ ] Display FAB (Floating Action Button) for quick actions
- [ ] Optimize touch targets (min 44x44px)
- [ ] Support swipe gestures for transaction actions
- [ ] Use sticky header for budget name on scroll
- [ ] Minimize text on mobile, prioritize visual indicators
- [ ] Test on iOS and Android devices
- [ ] Ensure readability without zooming

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-5.2: Desktop Enhanced View

**As a** desktop user
**I want to** see additional information and actions on larger screens
**So that** I can take advantage of available screen space

**Acceptance Criteria**:
- [ ] Use multi-column layout on desktop (>= 768px)
- [ ] Display budget metrics in horizontal card layout
- [ ] Show transaction list in table format with more columns
- [ ] Include additional transaction details (payment method, notes preview)
- [ ] Display category breakdown sidebar
- [ ] Provide toolbar with search, filter, sort actions
- [ ] Show hover states for interactive elements
- [ ] Support keyboard shortcuts (N for new transaction, / for search)
- [ ] Display tooltips on hover for metrics
- [ ] Use pagination instead of infinite scroll on desktop

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-5.3: Performance Optimization

**As a** user
**I want to** experience fast load times and smooth interactions
**So that** the app feels responsive

**Acceptance Criteria**:
- [ ] Initial page load within 2 seconds on 4G
- [ ] Transaction list renders within 500ms
- [ ] Use skeleton loaders during data fetch
- [ ] Implement virtual scrolling for large transaction lists (>100 items)
- [ ] Optimize images and icons (SVG preferred)
- [ ] Lazy load transaction details
- [ ] Cache budget data with React Query
- [ ] Invalidate cache on transaction mutations
- [ ] Use optimistic updates for quick feedback
- [ ] Minimize re-renders with React.memo
- [ ] Prefetch budget data on hover (desktop)
- [ ] Use web vitals monitoring (LCP, FID, CLS)

**Priority**: P0
**Estimated Effort**: Medium

---

## 5. Functional Requirements

### FR-1: Budget Data Display

**Priority**: P0

**Requirements**:

- **FR-1.1**: System SHALL fetch budget data by budget ID from URL parameter
  - **AC**: Given budget ID in URL `/presupuesto/[id]`, fetch budget from Supabase

- **FR-1.2**: System SHALL validate user ownership before displaying budget
  - **AC**: Only display budget if budget.user_id matches authenticated user's ID

- **FR-1.3**: System SHALL display budget not found error for invalid IDs
  - **AC**: Show 404 page if budget ID doesn't exist or user doesn't own it

- **FR-1.4**: System SHALL calculate and display spent amount
  - **AC**: Sum all expense transactions where budget_id matches (CR-1.1)

- **FR-1.5**: System SHALL calculate and display remaining amount
  - **AC**: Subtract spent from total budget (CR-1.2)

- **FR-1.6**: System SHALL calculate and display percentage used
  - **AC**: Calculate (spent / total) * 100, rounded to 2 decimals (CR-1.3)

- **FR-1.7**: System SHALL display budget status with appropriate badge
  - **AC**: Show status as badge with color coding (draft=gray, active=blue, closed=red)

---

### FR-2: Transaction Data Display

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL fetch all transactions linked to budget
  - **AC**: Query transactions where budget_id = current budget ID and user_id = current user

- **FR-2.2**: System SHALL display transactions in reverse chronological order
  - **AC**: Sort transactions by date descending (newest first)

- **FR-2.3**: System SHALL join category data with transactions
  - **AC**: Include category name, color, and icon for each transaction

- **FR-2.4**: System SHALL format transaction amounts with currency
  - **AC**: Display amounts as "$1,234.56" format based on user locale

- **FR-2.5**: System SHALL differentiate income vs expense visually
  - **AC**: Use green for income, red for expense, with appropriate icons

- **FR-2.6**: System SHALL handle empty transaction list gracefully
  - **AC**: Show "No transactions yet" empty state with call-to-action

---

### FR-3: Category Breakdown Display

**Priority**: P1

**Requirements**:

- **FR-3.1**: System SHALL fetch category allocations for budget
  - **AC**: Query category_allocations table where budget_id = current budget

- **FR-3.2**: System SHALL calculate spent amount per category
  - **AC**: Sum expense transactions grouped by category_id (CR-1.4)

- **FR-3.3**: System SHALL display allocation vs spent comparison
  - **AC**: Show allocated amount, spent amount, and remaining for each category

- **FR-3.4**: System SHALL highlight overspent categories
  - **AC**: Use red/warning color when spent > allocated for any category

- **FR-3.5**: System SHALL show uncategorized expenses separately
  - **AC**: Display sum of transactions with null category_id as "Uncategorized"

---

### FR-4: Search and Filter Operations

**Priority**: P1

**Requirements**:

- **FR-4.1**: System SHALL filter transactions by selected categories
  - **AC**: Show only transactions where category_id in selected category IDs

- **FR-4.2**: System SHALL filter transactions by date range
  - **AC**: Show only transactions where date between start_date and end_date

- **FR-4.3**: System SHALL search transactions by text
  - **AC**: Filter transactions where description or notes contains search term (case-insensitive)

- **FR-4.4**: System SHALL combine multiple filters with AND logic
  - **AC**: When multiple filters active, show transactions matching ALL filters

- **FR-4.5**: System SHALL update transaction count when filters applied
  - **AC**: Display "Showing X of Y transactions" with correct counts

---

### FR-5: Quick Action Operations

**Priority**: P1

**Requirements**:

- **FR-5.1**: System SHALL provide add transaction action
  - **AC**: Button/FAB opens transaction creation form

- **FR-5.2**: System SHALL pre-populate budget in transaction form
  - **AC**: New transaction form has budget_id field set to current budget

- **FR-5.3**: System SHALL update view after transaction creation
  - **AC**: New transaction appears in list and metrics update without page reload

- **FR-5.4**: System SHALL provide budget edit action
  - **AC**: Edit button opens budget edit form with current data pre-populated

- **FR-5.5**: System SHALL validate budget status transitions
  - **AC**: Only allow status changes per BR-1.5 allowed transitions

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

**Requirements**:

- **NFR-1.1**: Initial page load time SHALL be < 2 seconds on 4G connection
  - **Measurement**: Lighthouse performance score > 90

- **NFR-1.2**: Transaction list render time SHALL be < 500ms for 100 items
  - **Measurement**: React DevTools profiler

- **NFR-1.3**: Filter/search operations SHALL complete within 200ms
  - **Measurement**: User-perceivable instant feedback

- **NFR-1.4**: Budget metric calculations SHALL be cached
  - **Measurement**: React Query cache hit rate > 80%

---

### NFR-2: Usability

**Priority**: P0

**Requirements**:

- **NFR-2.1**: New users SHALL understand budget metrics within 10 seconds
  - **Validation**: User testing with 5 participants

- **NFR-2.2**: All interactive elements SHALL have min 44x44px touch targets (mobile)
  - **Validation**: Automated accessibility testing

- **NFR-2.3**: Budget health status SHALL be immediately recognizable
  - **Validation**: Color coding + icons + text labels

- **NFR-2.4**: Error messages SHALL be clear and actionable
  - **Validation**: All error states have specific messages with next steps

---

### NFR-3: Accessibility

**Priority**: P1

**Requirements**:

- **NFR-3.1**: Page SHALL meet WCAG 2.1 AA standards
  - **Validation**: Lighthouse accessibility score > 95

- **NFR-3.2**: All interactive elements SHALL be keyboard accessible
  - **Validation**: Tab navigation reaches all controls

- **NFR-3.3**: Color indicators SHALL have text alternatives
  - **Validation**: Status communicated through text + icons, not color alone

- **NFR-3.4**: Screen reader SHALL announce budget status and metrics
  - **Validation**: Testing with NVDA/JAWS screen readers

---

### NFR-4: Responsive Design

**Priority**: P0

**Requirements**:

- **NFR-4.1**: Layout SHALL adapt to screen sizes 320px - 2560px
  - **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

- **NFR-4.2**: Mobile layout SHALL be tested on iOS and Android
  - **Devices**: iPhone 13, Samsung Galaxy S21, common viewports

- **NFR-4.3**: Touch gestures SHALL work on mobile devices
  - **Gestures**: Pull to refresh, swipe to reveal actions

- **NFR-4.4**: Desktop layout SHALL utilize screen space efficiently
  - **Layout**: Multi-column, sidebar, expanded information

---

### NFR-5: Data Accuracy

**Priority**: P0

**Requirements**:

- **NFR-5.1**: Budget calculations SHALL be accurate to 2 decimal places
  - **Validation**: Unit tests for all calculation functions

- **NFR-5.2**: Displayed data SHALL match database state
  - **Validation**: React Query cache invalidation on mutations

- **NFR-5.3**: Metrics SHALL update immediately after data changes
  - **Validation**: Optimistic updates + background revalidation

- **NFR-5.4**: Percentage calculations SHALL handle edge cases
  - **Validation**: Test cases for division by zero, negative values

---

### NFR-6: Security

**Priority**: P0

**Requirements**:

- **NFR-6.1**: Page SHALL only display budgets owned by authenticated user
  - **Validation**: Server-side RLS (Row Level Security) enforcement

- **NFR-6.2**: Budget ID SHALL be validated before data fetch
  - **Validation**: UUID format validation + ownership check

- **NFR-6.3**: User session SHALL be verified on page load
  - **Validation**: Redirect to login if not authenticated

- **NFR-6.4**: Transaction mutations SHALL validate user permissions
  - **Validation**: Server actions check user_id matches resource owner

---

## 7. Business Rules

### BR-BD-1: Budget Metric Calculations

**Rule**: Budget metrics MUST be calculated according to established formulas

**Calculations Required**:
- **Spent**: SUM(transactions WHERE type='expense' AND budget_id=current) (CR-1.1)
- **Remaining**: total_amount - spent (CR-1.2)
- **Percentage**: (spent / total_amount) * 100 (CR-1.3)
- **Category Spent**: SUM(transactions WHERE category_id=X AND budget_id=current) (CR-1.4)
- **Category Remaining**: allocated - category_spent (CR-1.5)

**Rationale**: Consistent calculations across application

**Validation**: Unit tests verify calculation accuracy

**Implementation**: Extract to utility functions in `/domains/budget/utils/calculations.ts`

---

### BR-BD-2: Budget Health Status

**Rule**: Budget health status MUST follow percentage thresholds

**Status Levels**:
| Percentage | Status | Color | Message |
|------------|--------|-------|---------|
| 0-69% | Healthy | Green | "Budget Healthy" |
| 70-89% | Warning | Yellow | "Approaching Limit" |
| 90-99% | Alert | Orange | "Almost Exhausted" |
| 100%+ | Danger | Red | "Budget Exceeded" |

**Rationale**: Provides clear visual feedback on budget health

**Validation**: Status updates when percentage crosses threshold

**Implementation**: Status utility function in budget domain

---

### BR-BD-3: Transaction Ownership Validation

**Rule**: Users can ONLY view transactions they own

**Validation**:
1. Check user authentication (session exists)
2. Verify budget ownership (budget.user_id = user.id)
3. Verify transaction ownership (transaction.user_id = user.id)
4. Apply Row Level Security (RLS) policies in Supabase

**Rationale**: Data privacy and security (DV-1.1)

**Error Handling**: Show 404 if ownership check fails

**Implementation**: Middleware + Server Component + RLS policies

---

### BR-BD-4: Real-time Metric Updates

**Rule**: Budget metrics MUST update immediately after transaction changes

**Trigger Events**:
- Transaction created
- Transaction updated (amount, category, type changed)
- Transaction deleted
- Transaction budget_id changed

**Update Behavior**:
- Invalidate React Query cache for budget metrics
- Trigger re-calculation of spent, remaining, percentage
- Update category breakdown if category changed
- Use optimistic updates for immediate UI feedback

**Rationale**: Users expect real-time data accuracy

**Implementation**: React Query mutation callbacks with cache invalidation

---

### BR-BD-5: Filter Combination Logic

**Rule**: Multiple filters MUST combine with AND logic

**Example**:
- Category filter: "Food"
- Date range: "Dec 1-15"
- Search: "grocery"
- Result: Transactions that are Food AND in date range AND contain "grocery"

**Rationale**: Provides precise filtering capability

**Validation**: Each filter narrows results further

**Implementation**: Sequentially apply filters in transaction list logic

---

### BR-BD-6: Empty State Handling

**Rule**: Empty states MUST provide actionable next steps

**Empty State Scenarios**:

1. **No Transactions**:
   - Message: "No transactions yet"
   - CTA: "Add your first transaction" button

2. **No Filter Results**:
   - Message: "No transactions match your filters"
   - CTA: "Clear filters" button

3. **No Category Allocations**:
   - Message: "No category allocations configured"
   - CTA: "Configure allocations" link (if budget editable)

**Rationale**: Guides users toward productive actions

**Implementation**: Conditional rendering with empty state components

---

### BR-BD-7: Budget Status Display Rules

**Rule**: Budget status MUST follow status transition rules (BR-1.5)

**Display Rules**:
- **Draft**: Show "Draft" badge (gray), allow full editing
- **Active**: Show "Active" badge (blue), allow transaction additions and budget edits
- **Closed**: Show "Closed" badge (red), read-only mode, prevent new transactions

**Actions by Status**:
| Status | Add Transaction | Edit Budget | Close Budget | Delete Budget |
|--------|----------------|-------------|--------------|---------------|
| Draft | ✅ | ✅ | ✅ | ✅ |
| Active | ✅ | ✅ | ✅ | ❌ |
| Closed | ❌ | ❌ | N/A | ❌ |

**Rationale**: Enforce budget lifecycle workflow

**Implementation**: Conditional rendering based on budget.status

---

## 8. Data Requirements

### Entity: Budget (Extended View)

**Source Table**: `budgets`

**Required Attributes**:
- `id`: UUID - Budget identifier
- `user_id`: UUID - Owner reference
- `name`: string - Budget name
- `category`: string (nullable) - Budget category
- `total_amount`: number - Total budget
- `month`: number (1-12, nullable) - Budget month
- `year`: number (nullable) - Budget year
- `status`: enum('draft', 'active', 'closed') - Budget status
- `created_at`: timestamp
- `updated_at`: timestamp

**Calculated Fields** (not stored, computed at runtime):
- `spent`: number - Sum of expense transactions
- `remaining`: number - total_amount - spent
- `percentage_used`: number - (spent / total_amount) * 100
- `health_status`: enum('healthy', 'warning', 'alert', 'danger')
- `transaction_count`: number - Count of linked transactions

**Relationships**:
- Has many: `transactions` (via budget_id foreign key)
- Has many: `category_allocations` (via budget_id foreign key)
- Belongs to: `user` (via user_id foreign key)

---

### Entity: Transaction (for Display)

**Source Table**: `transactions`

**Required Attributes**:
- `id`: UUID - Transaction identifier
- `user_id`: UUID - Owner reference
- `budget_id`: UUID (nullable) - Budget reference
- `category_id`: UUID - Category reference
- `type`: enum('income', 'expense') - Transaction type
- `amount`: number - Transaction amount
- `date`: date - Transaction date
- `payment_method`: string (nullable) - Payment method
- `description`: string (nullable) - Description
- `notes`: string (nullable) - Additional notes
- `created_at`: timestamp
- `updated_at`: timestamp

**Join Data** (from category):
- `category.name`: string - Category name
- `category.color`: string - Category color (hex)
- `category.icon`: string - Category icon identifier

**Display Formatting**:
- `formatted_amount`: string - "$1,234.56" format
- `formatted_date`: string - "Dec 31, 2025" or "Today"
- `type_icon`: string - Icon based on type
- `type_color`: string - Color based on type

**Relationships**:
- Belongs to: `budget` (via budget_id)
- Belongs to: `category` (via category_id)
- Belongs to: `user` (via user_id)

---

### Entity: CategoryAllocation

**Source Table**: `category_allocations`

**Required Attributes**:
- `id`: UUID - Allocation identifier
- `budget_id`: UUID - Budget reference
- `category_id`: UUID - Category reference
- `allocated_amount`: number - Allocated amount
- `created_at`: timestamp
- `updated_at`: timestamp

**Calculated Fields**:
- `spent`: number - Sum of expense transactions in this category for this budget
- `remaining`: number - allocated_amount - spent
- `percentage_used`: number - (spent / allocated_amount) * 100

**Join Data** (from category):
- `category.name`: string
- `category.color`: string
- `category.icon`: string

**Relationships**:
- Belongs to: `budget` (via budget_id)
- Belongs to: `category` (via category_id)

---

## 9. Integration Requirements

### INT-1: Supabase Database Queries

**Type**: Database Queries via Supabase Client

**Purpose**: Fetch budget, transactions, and category data

**Operations**:

**Fetch Budget with Metrics**:
```typescript
// Query budget by ID with user ownership check
SELECT * FROM budgets
WHERE id = :budgetId AND user_id = :userId
LIMIT 1
```

**Fetch Budget Transactions**:
```typescript
// Query transactions with category join
SELECT
  t.*,
  c.name as category_name,
  c.color as category_color,
  c.icon as category_icon
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.budget_id = :budgetId
  AND t.user_id = :userId
ORDER BY t.date DESC, t.created_at DESC
```

**Fetch Category Allocations**:
```typescript
// Query allocations with category details
SELECT
  ca.*,
  c.name as category_name,
  c.color as category_color,
  c.icon as category_icon
FROM category_allocations ca
JOIN categories c ON ca.category_id = c.id
WHERE ca.budget_id = :budgetId
ORDER BY c.name ASC
```

**Error Handling**:
- Database connection errors: Show error toast, retry with exponential backoff
- Budget not found: Show 404 page
- Invalid user access: Show 403 forbidden
- Network errors: Show offline message with retry button

**Fallback**:
- Use React Query stale data if available
- Cache budget data for 5 minutes
- Invalidate cache on mutations

---

### INT-2: React Query Cache Management

**Type**: Client-side cache and state management

**Purpose**: Optimize data fetching and provide real-time updates

**Query Keys**:
```typescript
// Budget detail query
['budget', budgetId]

// Budget transactions query
['budget', budgetId, 'transactions']

// Budget metrics query (computed)
['budget', budgetId, 'metrics']

// Category allocations query
['budget', budgetId, 'allocations']
```

**Cache Invalidation Rules**:

| Mutation Event | Invalidate Queries |
|----------------|-------------------|
| Transaction created | `['budget', budgetId, 'transactions']`, `['budget', budgetId, 'metrics']` |
| Transaction updated | Same as created |
| Transaction deleted | Same as created |
| Budget updated | `['budget', budgetId]`, `['budget', budgetId, 'metrics']` |
| Allocation updated | `['budget', budgetId, 'allocations']`, `['budget', budgetId, 'metrics']` |

**Stale Time**: 5 minutes (300,000ms)

**Cache Time**: 10 minutes (600,000ms)

**Refetch Settings**:
- On window focus: Yes
- On reconnect: Yes
- On mount: Only if stale

---

## 10. User Interface Requirements

### UI-1: Budget Header Section

**Purpose**: Display budget overview and key metrics

**Key Elements**:

1. **Budget Name** (h1):
   - Font: Text-2xl, font-bold
   - Color: Primary text color
   - Truncate if exceeds container width

2. **Budget Status Badge**:
   - Position: Next to name
   - Colors: Draft (gray), Active (blue), Closed (red)
   - Include icon + text label

3. **Month/Year Display** (if applicable):
   - Format: "December 2025"
   - Font: Text-sm, secondary color
   - Below budget name

4. **Total Budget Amount**:
   - Font: Text-3xl, font-bold
   - Currency symbol + formatted amount
   - Prominent display

5. **Metrics Cards** (3 cards):
   - **Spent**: Amount with red/orange color if high percentage
   - **Remaining**: Amount with green/yellow/red based on status
   - **Percentage Used**: Progress bar with percentage text

6. **Health Status Indicator**:
   - Icon (check, warning, alert, x-circle)
   - Status text ("Budget Healthy", "Approaching Limit", etc.)
   - Color coded background badge

**Mobile Layout**:
- Stack vertically
- Full width cards
- Large touch-friendly metrics

**Desktop Layout**:
- Horizontal card layout
- 3-column grid for metrics
- Right-aligned action buttons

---

### UI-2: Category Breakdown Section

**Purpose**: Show spending by category with allocations

**Key Elements**:

1. **Section Header**:
   - Title: "Spending by Category"
   - Toggle collapse/expand (accordion style)

2. **Category List Items** (each):
   - Category icon (left)
   - Category name (left, after icon)
   - Allocated amount (right)
   - Spent amount (right, below allocated)
   - Progress bar (full width below)
   - Percentage used text

3. **Category Progress Bars**:
   - Height: 8px
   - Color: Category color (from category.color)
   - Background: Light gray
   - Overspent: Red color

4. **Uncategorized Section** (if applicable):
   - Show total uncategorized expenses
   - Gray color, "Uncategorized" label

5. **Empty State**:
   - Message: "No category allocations configured"
   - Optional CTA: "Set up allocations"

**Interaction**:
- Click category to filter transactions
- Visual feedback on selection (highlight)

**Mobile Layout**:
- Stacked list items
- Full width progress bars

**Desktop Layout**:
- Grid layout (2 columns if > 6 categories)
- Hover states with additional info

---

### UI-3: Transaction List Section

**Purpose**: Display all budget transactions

**Key Elements**:

1. **Section Header**:
   - Title: "Transactions"
   - Transaction count badge
   - Search input (desktop)
   - Filter/sort buttons

2. **Search and Filter Bar**:
   - Search input with icon
   - Category filter dropdown/chips
   - Date range picker
   - Sort dropdown
   - Active filter indicators

3. **Transaction Card** (each):
   - **Left Section**:
     - Category color stripe (4px width)
     - Category icon
   - **Middle Section**:
     - Description (main text, truncated)
     - Category name badge
     - Date (small text, gray)
     - Payment method icon
   - **Right Section**:
     - Amount (large, bold)
     - Type indicator (+ or -)

4. **Transaction Grouping**:
   - Group by date (optional)
   - Date headers ("Today", "Yesterday", "Dec 29, 2025")
   - Separator lines between days

5. **Empty State**:
   - No transactions: Illustration + "Add first transaction" CTA
   - No results: "No transactions match filters" + "Clear filters" button

6. **Loading State**:
   - Skeleton loaders (3-5 cards)
   - Shimmer animation

**Mobile Interactions**:
- Tap card to open detail
- Swipe left for quick actions (edit, delete)
- Pull to refresh at top
- Infinite scroll at bottom

**Desktop Interactions**:
- Click card to open modal
- Hover for quick preview
- Keyboard navigation (arrow keys)

---

### UI-4: Floating Action Button (Mobile)

**Purpose**: Quick access to add transaction

**Key Elements**:

1. **FAB Button**:
   - Position: Fixed bottom-right
   - Size: 56x56px (Material Design standard)
   - Icon: Plus or add icon
   - Color: Primary color
   - Shadow: Elevation 6

2. **Behavior**:
   - Visible when scrolling up
   - Hidden when scrolling down (auto-hide)
   - Tap to open transaction form
   - Smooth animation

**Mobile Only**: Desktop uses regular button in header

---

### UI-5: Empty States

**Purpose**: Guide users when no data available

**Variants**:

1. **No Transactions Yet**:
   - Illustration: Empty wallet or list icon
   - Heading: "No transactions yet"
   - Subtext: "Start tracking your budget by adding your first transaction"
   - CTA Button: "Add Transaction" (primary)

2. **No Filter Results**:
   - Icon: Search with x
   - Heading: "No transactions found"
   - Subtext: "Try adjusting your filters or search term"
   - CTA Button: "Clear All Filters" (secondary)

3. **No Category Allocations**:
   - Icon: Category icon
   - Heading: "No budget allocations"
   - Subtext: "Configure how you want to distribute your budget"
   - CTA Link: "Set up allocations" (if editable)

**Design**: Center-aligned, generous padding, soft colors

---

## 11. Risk Assessment

### Risk 1: Large Transaction Lists Performance Degradation

**Category**: Technical

**Severity**: High

**Likelihood**: Medium

**Impact**: Users with 100+ transactions experience slow rendering, janky scrolling, and poor UX

**Mitigation Strategy**:
- Implement virtual scrolling using `react-window` or `react-virtual`
- Use pagination (load 50 transactions at a time)
- Implement infinite scroll with intersection observer
- Memoize transaction card components with React.memo
- Use React Query window focusing to manage cache size

**Contingency Plan**: If performance still poor, add server-side pagination and limit initial load to 20 transactions

**Owner**: nextjs-builder (implementation), ux-ui-designer (UX fallback)

---

### Risk 2: Real-time Calculation Accuracy Issues

**Category**: Technical

**Severity**: Critical

**Likelihood**: Low

**Impact**: Displayed metrics (spent, remaining, percentage) don't match actual data, eroding user trust

**Mitigation Strategy**:
- Write comprehensive unit tests for all calculation functions
- Use precise decimal arithmetic (avoid floating point errors)
- Round to 2 decimal places consistently
- Validate calculations against database aggregations
- Add E2E tests for budget detail page scenarios

**Contingency Plan**: If calculations drift, add server-side calculation endpoint as source of truth and reconcile client-side

**Owner**: domain-architect (calculation logic), code-reviewer (testing)

---

### Risk 3: Mobile Layout Not Optimized

**Category**: Business/UX

**Severity**: High

**Likelihood**: Medium

**Impact**: Poor mobile experience leads to low user adoption since 60%+ users are mobile

**Mitigation Strategy**:
- Start with mobile-first design (design mobile, then scale up)
- Test on real devices (iOS and Android)
- Use responsive Tailwind breakpoints
- Optimize touch targets (min 44x44px)
- Implement swipe gestures for common actions
- Use bottom sheets for modals on mobile

**Contingency Plan**: If mobile UX poor, create separate mobile-optimized view with simplified layout

**Owner**: ux-ui-designer (design), nextjs-builder (implementation)

---

### Risk 4: Filter and Search Performance

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Slow filter/search operations frustrate users, especially with large datasets

**Mitigation Strategy**:
- Debounce search input (300ms delay)
- Use memoization for filter calculations
- Implement client-side filtering with useMemo
- Consider server-side filtering for very large datasets
- Add loading indicators for operations > 200ms

**Contingency Plan**: Move filtering to server-side API endpoint with indexed database queries

**Owner**: nextjs-builder (implementation)

---

### Risk 5: Stale Data Display

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Users see outdated metrics after adding transactions, requiring manual refresh

**Mitigation Strategy**:
- Use React Query automatic refetching
- Implement optimistic updates for mutations
- Invalidate cache immediately on mutations
- Use WebSocket or polling for real-time updates (future)
- Add manual refresh capability (pull to refresh)

**Contingency Plan**: Add prominent "Refresh" button if automatic updates fail

**Owner**: nextjs-builder (React Query setup)

---

### Risk 6: Complex Category Allocation Logic

**Category**: Business/Technical

**Severity**: Medium

**Likelihood**: Low

**Impact**: Category breakdown shows incorrect spent amounts or allocations

**Mitigation Strategy**:
- Follow BR-1.4 strictly (sum of allocations <= total budget)
- Write tests for edge cases (no allocations, overspent categories)
- Validate allocation calculations against business rules
- Display clear warnings when allocations exceed budget

**Contingency Plan**: Simplify category display to show only spent amounts without allocations if logic too complex

**Owner**: domain-architect (business logic), business-analyst (rule validation)

---

## 12. Success Metrics (KPIs)

### User Engagement

**Metric**: Daily active users viewing budget detail page

**Target**: 60% of users with active budgets view detail page at least once per day

**Measurement**: Analytics tracking page views by unique user

**Rationale**: Indicates users find value in detailed budget tracking

---

### Feature Adoption

**Metric**: Percentage of budgets that have detail page visited

**Target**: 80% of created budgets have detail page viewed at least once

**Measurement**: Count budgets with detail page view vs total budgets created

**Rationale**: Validates that users discover and use the feature

---

### Transaction Visibility

**Metric**: Average time spent on budget detail page

**Target**: 45-90 seconds per session

**Measurement**: Analytics session duration on budget detail page

**Rationale**: Indicates users engage with transaction list and metrics

---

### Quick Action Usage

**Metric**: Percentage of transactions created via budget detail page FAB

**Target**: 40% of transactions created from budget detail vs other entry points

**Measurement**: Track transaction creation source (detail page FAB vs main transaction page)

**Rationale**: Validates quick action convenience and contextual workflow

---

### Performance

**Metric**: Page load time (Largest Contentful Paint)

**Target**: < 2 seconds on 4G connection (p75)

**Measurement**: Lighthouse performance metrics, Real User Monitoring (RUM)

**Rationale**: Fast page loads improve user experience and retention

---

### User Satisfaction

**Metric**: User satisfaction score for budget detail page

**Target**: 4.5+ out of 5 stars

**Measurement**: In-app feedback survey (optional future feature)

**Rationale**: Direct user feedback on feature usefulness

---

### Error Rate

**Metric**: Percentage of budget detail page loads that result in errors

**Target**: < 1% error rate

**Measurement**: Error tracking (Sentry or similar), failed page loads

**Rationale**: Low error rate ensures reliability and trust

---

## 13. Implementation Phases

### Phase 1: MVP - Core Budget Detail View

**Timeline**: Sprint 1 (1-2 weeks)

**Includes**:
- ✅ Budget overview header with metrics (spent, remaining, percentage)
- ✅ Budget status badge and health indicator
- ✅ Transaction list (reverse chronological)
- ✅ Basic transaction card layout (mobile-first)
- ✅ Add transaction FAB (mobile) / button (desktop)
- ✅ Loading states and error handling
- ✅ Basic responsive layout (mobile + desktop)
- ✅ User ownership validation
- ✅ React Query data fetching and caching

**Success Criteria**:
- Users can view budget details and metrics
- Users can see all budget transactions
- Page loads in < 2 seconds
- Mobile layout functional and touch-friendly

**Dependencies**: Budget and transaction repositories must be functional

---

### Phase 2: Enhancement - Category Breakdown

**Timeline**: Sprint 2 (1 week)

**Includes**:
- Category allocations display
- Spent vs allocated comparison per category
- Category progress bars
- Click category to filter transactions
- Overspent category warnings
- Uncategorized expenses section

**Success Criteria**:
- Users can see spending by category
- Category filtering works correctly
- Overspent categories visually highlighted

**Dependencies**: Category allocations feature must exist

---

### Phase 3: Enhancement - Search and Filters

**Timeline**: Sprint 2-3 (1 week)

**Includes**:
- Search transactions by description
- Filter by category (multi-select)
- Filter by date range
- Sort transactions (date, amount, category)
- Active filter indicators
- Clear filters action

**Success Criteria**:
- All filters work independently and combined
- Search completes within 200ms (debounced)
- Filter results update immediately

---

### Phase 4: Polish - UX Improvements

**Timeline**: Sprint 3 (1 week)

**Includes**:
- Skeleton loaders for better perceived performance
- Pull to refresh (mobile)
- Swipe gestures for transaction actions (mobile)
- Empty states with illustrations
- Keyboard shortcuts (desktop)
- Improved hover states and animations
- Transaction grouping by date
- Virtual scrolling for large lists

**Success Criteria**:
- Smooth, polished user experience
- Performance optimized for 100+ transactions
- Accessibility score > 95

---

## 14. Open Questions

- [ ] **Q1**: Should we support exporting budget detail to PDF or CSV?
  - **Owner**: Product Owner (user feedback needed)
  - **Due**: Before Phase 4
  - **Impact**: If yes, adds 2-3 days to implementation

- [ ] **Q2**: Should category breakdown be collapsible/expandable?
  - **Owner**: ux-ui-designer
  - **Due**: During Phase 2 design
  - **Impact**: Affects layout, minimal implementation change

- [ ] **Q3**: What should happen when user clicks "Edit Budget" - modal or navigate to edit page?
  - **Owner**: ux-ui-designer
  - **Due**: Before Phase 1 implementation
  - **Impact**: Affects navigation flow

- [ ] **Q4**: Should we show income transactions in budget detail, or only expenses?
  - **Owner**: business-analyst (clarify with user)
  - **Due**: Before Phase 1
  - **Impact**: If income included, need separate sections or type toggle

- [ ] **Q5**: What is maximum number of transactions expected per budget?
  - **Owner**: Product Owner (user research)
  - **Due**: Before Phase 3
  - **Impact**: Determines if virtual scrolling is required

- [ ] **Q6**: Should budget detail support printing/print view?
  - **Owner**: Product Owner
  - **Due**: Before Phase 4
  - **Impact**: If yes, add print-specific CSS

---

## 15. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Users primarily access from mobile devices (60%+) | ⏳ Pending | Analytics data after launch | TBD |
| Average budget has 20-50 transactions | ⏳ Pending | User testing, database analysis post-launch | TBD |
| Users want to see category breakdown | ✅ Validated | User request mentioned "detailed breakdown" | Confirmed |
| Users need traceability of every transaction | ✅ Validated | User explicitly requested "trazabilidad" | Confirmed |
| Page must load in < 2 seconds | ✅ Validated | Industry standard, user expectation | Confirmed |
| Category allocations exist for budgets | ⏳ Pending | Check current budget form implementation | TBD |

---

## 16. Glossary

**Budget**: A financial plan for a specific time period (usually monthly) with a total allocated amount

**Transaction**: A single financial event (income or expense) linked to a budget

**Category**: A classification for transactions (e.g., Food, Housing, Transportation)

**Category Allocation**: Amount of budget assigned to a specific category

**Budget Health**: Status indicating how much of budget has been used (healthy, warning, alert, danger)

**Spent**: Total amount of expense transactions charged to budget

**Remaining**: Amount of budget still available (total - spent)

**Percentage Used**: Proportion of budget consumed, expressed as percentage

**Overspent**: Condition where spent amount exceeds total budget or category allocation

**Uncategorized**: Transactions without an assigned category

**FAB**: Floating Action Button - prominent circular button for primary action (mobile pattern)

**Pull to Refresh**: Mobile gesture to reload page content by pulling down from top

**Virtual Scrolling**: Performance technique that renders only visible items in large lists

**Skeleton Loader**: Placeholder UI shown during data loading

**RLS**: Row Level Security - database-level security ensuring users only access their data

---

## 17. Next Steps

### For UX/UI Designer:
1. Review business requirements and user stories
2. Create low-fidelity wireframes for mobile view
3. Create wireframes for desktop view
4. Design component specifications
5. Create interaction flow diagrams
6. Specify visual states (loading, error, empty, success)
7. Define color scheme for budget health indicators
8. Create design plan document

### For Next.js Builder:
1. Review business requirements and technical constraints
2. Plan page routing structure (`/presupuesto/[id]`)
3. Design data fetching strategy (Server Components + React Query)
4. Plan component hierarchy and structure
5. Identify reusable components from design system
6. Plan state management approach
7. Define server actions needed
8. Create technical implementation plan

### For Domain Architect:
1. Review calculation business rules (CR-1.1 through CR-1.8)
2. Design calculation utility functions
3. Specify custom hooks for budget metrics
4. Define repository methods needed
5. Plan data transformation layer
6. Specify type definitions for calculated fields
7. Create domain logic plan document

---

## Appendix A: User Story Summary

**Total User Stories**: 15

**By Priority**:
- **P0 (Critical)**: 6 stories - Core budget display, transaction list, mobile layout, performance
- **P1 (High)**: 7 stories - Category breakdown, health indicators, navigation, filters, quick actions, desktop layout
- **P2 (Medium)**: 2 stories - Date range filter, search, sort, edit budget, close budget

**By Epic**:
- **Epic 1**: Budget Overview Display (3 stories)
- **Epic 2**: Transaction List Display (3 stories)
- **Epic 3**: Search and Filter (4 stories)
- **Epic 4**: Quick Actions (3 stories)
- **Epic 5**: Mobile-First Experience (3 stories)

---

## Appendix B: Calculation Reference

All calculations follow business rules defined in `.claude/knowledge/business-rules.md` section 4 (Calculation Rules).

**Key Formulas**:

```typescript
// Budget Spent (CR-1.1)
spent = SUM(transactions WHERE type='expense' AND budget_id=current)

// Budget Remaining (CR-1.2)
remaining = total_budget - spent

// Budget Percentage (CR-1.3)
percentage = (spent / total_budget) * 100

// Category Spent (CR-1.4)
category_spent = SUM(transactions WHERE type='expense' AND category_id=X AND budget_id=current)

// Category Remaining (CR-1.5)
category_remaining = allocated - category_spent
```

**Edge Cases**:
- If `total_budget = 0`: percentage = 0
- If `spent > total_budget`: percentage > 100 (overspent)
- If `category_spent > allocated`: category overspent (show warning)
- Round all percentages to 2 decimal places
- Round all currency amounts to 2 decimal places

---

## Appendix C: Mobile-First Design Priorities

Given 60%+ expected mobile usage, these mobile features take precedence:

1. **Touch-first interactions** (44x44px minimum touch targets)
2. **Vertical scrolling** (no horizontal scroll)
3. **Pull to refresh** for data updates
4. **FAB for quick actions** (floating action button)
5. **Swipe gestures** for secondary actions
6. **Bottom sheets** for modals (not centered modals)
7. **Sticky header** on scroll
8. **Large, readable fonts** (minimum 16px for body text)
9. **Single-column layout** for small screens
10. **Progressive enhancement** for desktop

---

**END OF BUSINESS ANALYSIS PLAN**
