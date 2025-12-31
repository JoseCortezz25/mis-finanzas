# Product Requirements Document (PRD)

**Project Name**: Mis Finanzas - Personal Finance Management App  
**Version**: 1.0  
**Last Updated**: 2025-12-30  
**Document Owner**: Business Analyst Agent  
**Session ID**: 1767147315

---

## Executive Summary

Mis Finanzas is a minimalist personal finance management application designed to help individuals take control of their finances through simple, intuitive budget planning and expense tracking. The application empowers users to create monthly budgets, track income and expenses, monitor spending against budgets in real-time, and gain insights through visual analytics.

The product prioritizes simplicity and clarity over feature complexity, offering a clean, mobile-first interface that allows users to understand their financial situation at a glance. Built with modern web technologies (Next.js 15, React 19, TypeScript), the application uses Supabase for authentication and IndexedDB for client-side data storage, ensuring privacy and offline capability.

The MVP focuses on core functionality: user authentication, budget creation with category allocation, transaction tracking, and basic reporting. Future enhancements include savings goals, advanced analytics, and financial education content.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Stakeholders](#2-stakeholders)
3. [Scope](#3-scope)
4. [User Stories and Features](#4-user-stories-and-features)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Business Rules](#7-business-rules)
8. [Data Requirements](#8-data-requirements)
9. [User Interface Requirements](#9-user-interface-requirements)
10. [Risk Assessment](#10-risk-assessment)
11. [Success Metrics](#11-success-metrics)
12. [Implementation Phases](#12-implementation-phases)

---

## 1. Problem Statement

### 1.1 Current Situation

Many individuals struggle to manage their personal finances effectively due to:

- **Lack of visibility**: Not knowing where money goes each month
- **Complex tools**: Existing finance apps are overwhelming with excessive features
- **Poor budgeting habits**: Difficulty creating and sticking to budgets
- **Manual tracking**: Spreadsheets are tedious and error-prone
- **No real-time feedback**: Discovering overspending only at month-end
- **Information overload**: Too many metrics without clear actionable insights

### 1.2 Desired Outcome

Users will be able to:

- Create and manage monthly budgets with ease
- Track all income and expenses in real-time
- See immediately how much budget remains in each category
- Understand spending patterns through visual reports
- Make informed financial decisions based on clear data
- Achieve financial goals through structured planning

### 1.3 Value Proposition

**Mis Finanzas provides**:

- **Simplicity**: Clean, uncluttered interface focused on essential features
- **Clarity**: Large numbers, clear visualizations, obvious next actions
- **Speed**: Fast data entry with minimal friction
- **Privacy**: Client-side data storage (IndexedDB) keeps financial data local
- **Accessibility**: Works on all devices, accessible to users with disabilities
- **Confidence**: Real-time budget tracking prevents overspending

**Target users**: Regular individuals (not financial experts) who want to manage personal or household finances without complexity.

---

## 2. Stakeholders

### 2.1 Primary Users (Authenticated Users)

**Description**: Individuals managing their personal or household finances.

**Demographics**:

- Age: 18-65+
- Technical Level: Beginner to Intermediate
- Financial Literacy: Basic to Intermediate
- Device Usage: Primarily mobile, some desktop

**Goals**:

- Create monthly budgets and stick to them
- Track all income and expenses accurately
- Understand where money is being spent
- Reduce overspending in specific categories
- Save money toward specific goals
- Gain financial confidence and control

**Pain Points**:

- Existing tools are too complex or expensive
- Don't know where to start with budgeting
- Forgetting to log transactions
- Difficulty understanding financial reports
- Fear of judgment (want privacy)
- Limited time for financial management

**Needs**:

- Simple, fast transaction entry (mobile-first)
- Clear visual feedback on budget status
- Ability to categorize spending meaningfully
- Historical data to identify patterns
- Flexible budgeting (not rigid categories)
- Offline capability for anytime access

**Technical Level**: Beginner to Intermediate (must be extremely intuitive)

---

### 2.2 Decision Makers

**Role**: Product Owner (Internal)

**Success Criteria**:

- User adoption (active monthly users)
- User retention (return rate after 30 days)
- Task completion rate (% of users who complete first budget)
- User satisfaction (qualitative feedback)
- Technical performance (load times, uptime)

---

## 3. Scope

### 3.1 In Scope ✅

**Authentication**:

- User registration with email/password
- User login/logout
- Password reset functionality
- Session management

**Budget Management**:

- Create monthly budgets with total amount
- Allocate budget across categories (percentage or fixed amount)
- Edit and update existing budgets
- Delete budgets
- Duplicate budgets to new months
- View budget summary (planned vs spent vs available)

**Transaction Tracking**:

- Add income transactions
- Add expense transactions
- Link transactions to budget categories
- Link transactions to general budget (uncategorized)
- Edit transaction details
- Delete transactions
- Filter transactions (date range, category, type)
- Search transactions (description, amount)
- View transaction history

**Category Management**:

- Pre-built default categories (housing, food, transport, etc.)
- Create custom categories
- Edit category details (name, color, icon)
- Delete custom categories (with transaction reassignment)
- View category spending summaries

**Reporting & Analytics**:

- Monthly summary dashboard (income, expenses, balance)
- Category breakdown (pie chart)
- Spending trends over time (line graph)
- Month-over-month comparisons
- Budget vs actual visualizations
- Export data (CSV)

**Savings Goals** (Phase 2):

- Create savings goals with target amount and deadline
- Track progress toward goals
- Visualize goal completion percentage
- Mark goals as complete or cancelled

**Settings & Preferences**:

- Update user profile information
- Manage default categories
- Set currency preferences
- Export all data
- Delete account and all data

**Help & Education** (Phase 3, Low Priority):

- Financial tips and best practices
- Budget creation guidance
- Educational content library

---

### 3.2 Out of Scope ❌

**Explicitly NOT included**:

- Multi-user accounts or family sharing
- Bank account integration or automatic transaction import
- Bill payment functionality
- Investment tracking
- Loan or debt management tools
- Tax preparation features
- Multi-currency support (single currency per user)
- Collaborative budgets (shared with others)
- Receipt scanning or OCR
- Recurring transaction templates (future consideration)
- Budget recommendations or AI suggestions
- Social features (sharing, comparing with others)

---

### 3.3 Assumptions

1. **User Environment**:
   - Users have modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
   - Users have stable internet connection for initial auth
   - Users primarily access from mobile devices

2. **Technical**:
   - IndexedDB is supported in user browsers
   - Supabase service is available and stable
   - Users understand basic budgeting concepts
   - Users will manually enter all transactions

3. **Business**:
   - Single user per account (no sharing)
   - Users manage personal finances (not business)
   - Monthly budget cycles are standard
   - Users prefer privacy (local data) over cloud sync

4. **Data**:
   - Users accept responsibility for data backups
   - Transaction history starts from app adoption (no historical import initially)

---

### 3.4 Dependencies

**External Services**:

- Supabase authentication service
- Browser IndexedDB API
- Browser Chart.js library (or similar for visualizations)

**Technical Dependencies**:

- Next.js 15 framework
- React 19 library
- TypeScript compiler
- Tailwind CSS v4
- shadcn/ui component library
- React Query (TanStack Query)
- Zustand state management

---

## 4. User Stories and Features

### Epic 1: Authentication & Onboarding

**Priority**: P0 (MVP - Critical)

---

#### US-1.1: User Registration

**As a** new user  
**I want to** register for an account with email and password  
**So that** I can securely access my financial data

**Acceptance Criteria**:

- [ ] User can access registration page from landing page
- [ ] Email validation ensures valid format
- [ ] Password must be at least 8 characters
- [ ] Password must contain at least one uppercase, one lowercase, one number
- [ ] User receives confirmation email (via Supabase)
- [ ] User is redirected to onboarding/home after successful registration
- [ ] Duplicate email shows clear error message
- [ ] Form shows inline validation errors

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-1.2: User Login

**As a** registered user  
**I want to** log in with my email and password  
**So that** I can access my budgets and transactions

**Acceptance Criteria**:

- [ ] User can access login page
- [ ] User can enter email and password
- [ ] Successful login redirects to home dashboard
- [ ] Failed login shows clear error message
- [ ] Session persists across browser refreshes
- [ ] Session expires after 7 days of inactivity
- [ ] "Remember me" option extends session to 30 days

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-1.3: User Logout

**As a** logged-in user  
**I want to** log out of my account  
**So that** my financial data is secure when I'm done

**Acceptance Criteria**:

- [ ] Logout button is accessible from all pages
- [ ] Clicking logout clears session
- [ ] User is redirected to login page
- [ ] Attempting to access protected pages after logout redirects to login

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-1.4: Password Reset

**As a** user who forgot my password  
**I want to** reset my password via email  
**So that** I can regain access to my account

**Acceptance Criteria**:

- [ ] "Forgot password" link is visible on login page
- [ ] User can enter email to receive reset link
- [ ] Reset email is sent via Supabase
- [ ] Reset link expires after 24 hours
- [ ] User can set new password via reset link
- [ ] New password meets validation requirements
- [ ] User can log in with new password

**Priority**: P1  
**Estimated Effort**: Small

---

### Epic 2: Budget Management

**Priority**: P0 (MVP - Critical)

---

#### US-2.1: Create Monthly Budget

**As a** user  
**I want to** create a monthly budget with a total amount  
**So that** I can plan my spending for the month

**Acceptance Criteria**:

- [ ] User can access "Create Budget" from Presupuesto page
- [ ] User can enter budget name (e.g., "January 2025")
- [ ] User can select month and year
- [ ] User can enter total budget amount
- [ ] Total amount must be a positive number
- [ ] User can save budget as draft or active
- [ ] Budget is stored in IndexedDB
- [ ] User is redirected to category allocation after creation
- [ ] Cannot create duplicate budget for same month/year

**Priority**: P0  
**Estimated Effort**: Medium

---

#### US-2.2: Allocate Budget to Categories

**As a** user  
**I want to** distribute my total budget across spending categories  
**So that** I can track spending by category

**Acceptance Criteria**:

- [ ] User sees list of default categories
- [ ] User can allocate amount or percentage to each category
- [ ] Real-time calculation shows remaining unallocated budget
- [ ] Sum of allocations cannot exceed total budget
- [ ] Warning shown if allocations exceed total
- [ ] User can skip categories (leave at $0)
- [ ] User can save allocations
- [ ] Allocations are linked to parent budget

**Priority**: P0  
**Estimated Effort**: Medium

---

#### US-2.3: Edit Budget

**As a** user  
**I want to** edit an existing budget  
**So that** I can adjust my financial plan as needed

**Acceptance Criteria**:

- [ ] User can access edit mode from budget detail page
- [ ] User can change budget name
- [ ] User can change total amount
- [ ] User can update category allocations
- [ ] Changes are validated (same rules as creation)
- [ ] User sees confirmation before saving
- [ ] Changes are persisted to IndexedDB
- [ ] Timestamp shows last updated time

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-2.4: Delete Budget

**As a** user  
**I want to** delete a budget I no longer need  
**So that** I can keep my budget list clean

**Acceptance Criteria**:

- [ ] User can access delete option from budget detail page
- [ ] Confirmation dialog warns about deletion
- [ ] Dialog shows number of associated transactions
- [ ] User can choose to delete budget only or budget + transactions
- [ ] Deletion is permanent (no undo)
- [ ] User is redirected to budget list after deletion
- [ ] Deleted budget is removed from IndexedDB

**Priority**: P1  
**Estimated Effort**: Small

---

#### US-2.5: Duplicate Budget to New Month

**As a** user  
**I want to** copy a budget to a new month  
**So that** I can quickly create similar budgets without re-entering data

**Acceptance Criteria**:

- [ ] User can select "Duplicate" from budget detail page
- [ ] User selects target month/year
- [ ] Budget name, total amount, and category allocations are copied
- [ ] Transactions are NOT copied
- [ ] New budget is created with current date as creation date
- [ ] User is redirected to new budget detail page
- [ ] Cannot duplicate to month that already has a budget

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-2.6: View Budget Summary

**As a** user  
**I want to** see a summary of my budget status  
**So that** I know how much I've spent and how much remains

**Acceptance Criteria**:

- [ ] Summary shows: Total Budget, Total Spent, Total Remaining
- [ ] Summary shows: Income, Expenses, Balance
- [ ] Visual progress bar shows spent vs budget ratio
- [ ] Color coding: green (under budget), yellow (near limit), red (over budget)
- [ ] Breakdown by category shows spent amount and percentage
- [ ] Data updates in real-time as transactions are added
- [ ] Summary is visible on Home and Presupuesto pages

**Priority**: P0  
**Estimated Effort**: Medium

---

### Epic 3: Transaction Tracking

**Priority**: P0 (MVP - Critical)

---

#### US-3.1: Add Income Transaction

**As a** user  
**I want to** record income I receive  
**So that** I can track my total earnings

**Acceptance Criteria**:

- [ ] User can access "Add Income" from Movimientos page
- [ ] User can enter amount (required, positive number)
- [ ] User can enter description/notes (optional)
- [ ] User can select date (defaults to today)
- [ ] User can select payment method (cash, card, transfer, etc.)
- [ ] User can link to a budget (optional)
- [ ] Transaction type is set to "income"
- [ ] Transaction is saved to IndexedDB
- [ ] User sees confirmation message
- [ ] Transaction appears immediately in transaction list

**Priority**: P0  
**Estimated Effort**: Medium

---

#### US-3.2: Add Expense Transaction

**As a** user  
**I want to** record expenses I make  
**So that** I can track my spending

**Acceptance Criteria**:

- [ ] User can access "Add Expense" from Movimientos page or Home
- [ ] User can enter amount (required, positive number)
- [ ] User can enter description/notes (optional)
- [ ] User can select date (defaults to today)
- [ ] User can select payment method
- [ ] User can select category (optional)
- [ ] User can link to a budget (defaults to current month)
- [ ] Transaction type is set to "expense"
- [ ] Transaction is saved to IndexedDB
- [ ] Budget totals update immediately
- [ ] User sees confirmation message

**Priority**: P0  
**Estimated Effort**: Medium

---

#### US-3.3: Edit Transaction

**As a** user  
**I want to** edit a transaction I previously entered  
**So that** I can correct mistakes or update details

**Acceptance Criteria**:

- [ ] User can select transaction from list to edit
- [ ] All transaction fields are editable
- [ ] Validation rules apply (same as creation)
- [ ] User sees confirmation before saving
- [ ] Changes are persisted to IndexedDB
- [ ] Budget totals recalculate if amount or category changed
- [ ] Updated timestamp is recorded

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-3.4: Delete Transaction

**As a** user  
**I want to** delete a transaction  
**So that** I can remove incorrect entries

**Acceptance Criteria**:

- [ ] User can select transaction and choose delete
- [ ] Confirmation dialog appears
- [ ] Deletion is permanent (no undo)
- [ ] Transaction is removed from IndexedDB
- [ ] Budget totals recalculate immediately
- [ ] User sees confirmation message

**Priority**: P0  
**Estimated Effort**: Small

---

#### US-3.5: Filter Transactions

**As a** user  
**I want to** filter my transaction list  
**So that** I can find specific transactions or analyze patterns

**Acceptance Criteria**:

- [ ] User can filter by date range (start and end date)
- [ ] User can filter by transaction type (income, expense, all)
- [ ] User can filter by category
- [ ] User can filter by payment method
- [ ] User can filter by budget
- [ ] Multiple filters can be applied simultaneously
- [ ] Filter results update in real-time
- [ ] User can clear all filters
- [ ] Filtered totals are displayed

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-3.6: Search Transactions

**As a** user  
**I want to** search my transactions by description  
**So that** I can quickly find specific entries

**Acceptance Criteria**:

- [ ] Search input is visible on Movimientos page
- [ ] Search queries description/notes fields
- [ ] Search is case-insensitive
- [ ] Results update as user types (debounced)
- [ ] User can search by amount (exact or range)
- [ ] User can combine search with filters
- [ ] User can clear search

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-3.7: View Transaction Details

**As a** user  
**I want to** view full details of a transaction  
**So that** I can see all information at a glance

**Acceptance Criteria**:

- [ ] User can tap/click transaction to see details
- [ ] Detail view shows: amount, type, date, category, budget, payment method, notes
- [ ] Detail view shows creation and update timestamps
- [ ] User can edit or delete from detail view
- [ ] User can close detail view to return to list

**Priority**: P0  
**Estimated Effort**: Small

---

### Epic 4: Reports & Analytics

**Priority**: P0 (MVP - Critical for core reports), P1 (Advanced analytics)

---

#### US-4.1: View Monthly Summary Dashboard

**As a** user  
**I want to** see a summary of my current month's finances  
**So that** I understand my financial situation at a glance

**Acceptance Criteria**:

- [ ] Dashboard shows total income for current month
- [ ] Dashboard shows total expenses for current month
- [ ] Dashboard shows balance (income - expenses)
- [ ] Dashboard shows budget remaining
- [ ] Dashboard shows top spending categories (top 5)
- [ ] Dashboard shows recent transactions (last 10)
- [ ] Dashboard shows progress toward active budget
- [ ] Color coding indicates status (green, yellow, red)
- [ ] Dashboard is the default landing page after login

**Priority**: P0  
**Estimated Effort**: Large

---

#### US-4.2: View Category Breakdown

**As a** user  
**I want to** see my spending broken down by category  
**So that** I understand where my money goes

**Acceptance Criteria**:

- [ ] Pie chart shows expense distribution by category
- [ ] Chart includes percentages for each category
- [ ] Chart uses category colors for segments
- [ ] User can tap segment to see category details
- [ ] List view shows categories with amounts and percentages
- [ ] Only categories with expenses are shown
- [ ] User can select month to analyze

**Priority**: P0  
**Estimated Effort**: Medium

---

#### US-4.3: View Spending Trends

**As a** user  
**I want to** see my spending trends over time  
**So that** I can identify patterns and make adjustments

**Acceptance Criteria**:

- [ ] Line graph shows spending over last 6 months
- [ ] Separate lines for income, expenses, and balance
- [ ] User can select date range
- [ ] User can toggle income/expenses/balance visibility
- [ ] Hover/tap shows exact values for each point
- [ ] Graph is responsive and readable on mobile

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-4.4: Compare Months

**As a** user  
**I want to** compare spending between months  
**So that** I can see if I'm improving

**Acceptance Criteria**:

- [ ] User can select two months to compare
- [ ] Side-by-side comparison shows: total income, total expenses, balance
- [ ] Category-by-category comparison shows differences
- [ ] Visual indicators show increase/decrease
- [ ] Percentage change is calculated and displayed

**Priority**: P2  
**Estimated Effort**: Medium

---

#### US-4.5: Export Data

**As a** user  
**I want to** export my financial data to CSV  
**So that** I can analyze it in other tools or keep backups

**Acceptance Criteria**:

- [ ] User can export all transactions to CSV
- [ ] User can export budgets to CSV
- [ ] User can select date range for export
- [ ] CSV includes all relevant fields
- [ ] File name includes export date
- [ ] Download is triggered automatically

**Priority**: P1  
**Estimated Effort**: Small

---

### Epic 5: Savings Goals

**Priority**: P1 (High - Phase 2)

---

#### US-5.1: Create Savings Goal

**As a** user  
**I want to** create a savings goal with a target amount  
**So that** I can track progress toward my financial objectives

**Acceptance Criteria**:

- [ ] User can access "Create Goal" from settings or dedicated page
- [ ] User can enter goal name (e.g., "Emergency Fund")
- [ ] User can enter target amount (required, positive)
- [ ] User can enter target date/deadline (optional)
- [ ] User can set initial amount (defaults to 0)
- [ ] Goal is saved to IndexedDB
- [ ] Goal appears in goals list

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-5.2: Track Goal Progress

**As a** user  
**I want to** update progress toward my goal  
**So that** I can see how close I am to achieving it

**Acceptance Criteria**:

- [ ] User can add to goal amount
- [ ] User can view progress as percentage
- [ ] Visual progress bar shows completion
- [ ] User can see amount remaining
- [ ] User can see estimated completion date (based on average contributions)

**Priority**: P1  
**Estimated Effort**: Small

---

#### US-5.3: Complete or Cancel Goal

**As a** user  
**I want to** mark a goal as complete or cancel it  
**So that** I can manage my active goals

**Acceptance Criteria**:

- [ ] User can mark goal as "completed"
- [ ] User can cancel goal
- [ ] Completed/cancelled goals are archived (not deleted)
- [ ] User can view archived goals
- [ ] User cannot edit completed/cancelled goals

**Priority**: P1  
**Estimated Effort**: Small

---

### Epic 6: Settings & Preferences

**Priority**: P0 (Basic settings), P1 (Advanced preferences)

---

#### US-6.1: Manage Profile

**As a** user  
**I want to** update my profile information  
**So that** I can keep my account details current

**Acceptance Criteria**:

- [ ] User can update email (requires re-authentication)
- [ ] User can update password
- [ ] User can set display name
- [ ] User can set currency preference
- [ ] Changes are saved to Supabase

**Priority**: P1  
**Estimated Effort**: Small

---

#### US-6.2: Manage Categories

**As a** user  
**I want to** create and manage custom categories  
**So that** I can organize spending in a way that makes sense to me

**Acceptance Criteria**:

- [ ] User can create custom category
- [ ] User can set category name, color, and icon
- [ ] User can edit custom categories
- [ ] User can delete custom categories
- [ ] Deleting category requires reassigning transactions
- [ ] Default categories cannot be deleted (can be hidden)

**Priority**: P1  
**Estimated Effort**: Medium

---

#### US-6.3: Export All Data

**As a** user  
**I want to** export all my financial data  
**So that** I can create backups or move to another system

**Acceptance Criteria**:

- [ ] User can export all data as JSON
- [ ] Export includes: budgets, transactions, categories, goals
- [ ] File is downloadable
- [ ] File name includes user ID and timestamp

**Priority**: P1  
**Estimated Effort**: Small

---

#### US-6.4: Delete Account

**As a** user  
**I want to** delete my account and all associated data  
**So that** I can remove my information from the system

**Acceptance Criteria**:

- [ ] User can access "Delete Account" from settings
- [ ] Strong confirmation required (type "DELETE")
- [ ] All IndexedDB data is deleted
- [ ] Supabase user account is deleted
- [ ] User is logged out and redirected to landing page
- [ ] Deletion is permanent (no recovery)

**Priority**: P2  
**Estimated Effort**: Small

---

### Epic 7: Help & Education

**Priority**: P3 (Low - Phase 3)

---

#### US-7.1: View Financial Tips

**As a** user  
**I want to** access financial tips and best practices  
**So that** I can improve my financial literacy

**Acceptance Criteria**:

- [ ] Tips are accessible from Help section
- [ ] Tips are categorized (budgeting, saving, spending)
- [ ] Tips are concise and actionable
- [ ] User can bookmark favorite tips

**Priority**: P3  
**Estimated Effort**: Small

---

#### US-7.2: Budget Creation Guide

**As a** new user  
**I want to** follow a guided tutorial for creating my first budget  
**So that** I understand how to use the app effectively

**Acceptance Criteria**:

- [ ] Tutorial launches on first login (optional)
- [ ] Step-by-step walkthrough of budget creation
- [ ] Tooltips explain each field
- [ ] User can skip tutorial
- [ ] User can replay tutorial from Help section

**Priority**: P3  
**Estimated Effort**: Medium

---

## 5. Functional Requirements

### FR-1: Authentication and Authorization

**Priority**: P0

**Requirements**:

- **FR-1.1**: System SHALL support user registration via Supabase
  - **AC**: User can create account with email and password (min 8 chars, 1 upper, 1 lower, 1 number)
- **FR-1.2**: System SHALL support user login via Supabase
  - **AC**: User can authenticate and receive session token, session persists 7 days default

- **FR-1.3**: System SHALL support password reset via email
  - **AC**: Reset link sent via Supabase, expires in 24 hours

- **FR-1.4**: System SHALL enforce session expiration
  - **AC**: Sessions expire after 7 days (default) or 30 days (remember me)

- **FR-1.5**: System SHALL protect all routes except login/register
  - **AC**: Unauthenticated users are redirected to login

---

### FR-2: Budget Management

**Priority**: P0

**Requirements**:

- **FR-2.1**: System SHALL allow users to create monthly budgets
  - **AC**: User can set name, month, year, total amount; stored in IndexedDB

- **FR-2.2**: System SHALL allow users to allocate budget to categories
  - **AC**: User can distribute total across categories, sum cannot exceed total

- **FR-2.3**: System SHALL allow users to edit budgets
  - **AC**: All budget fields are editable, changes update IndexedDB

- **FR-2.4**: System SHALL allow users to delete budgets
  - **AC**: Confirmation required, option to delete transactions or reassign

- **FR-2.5**: System SHALL allow users to duplicate budgets
  - **AC**: Copy budget to new month, transactions NOT copied

- **FR-2.6**: System SHALL calculate and display budget summary
  - **AC**: Real-time calculation of spent, remaining, percentage used

- **FR-2.7**: System SHALL prevent duplicate budgets for same month/year
  - **AC**: Error shown if budget exists for selected month

---

### FR-3: Transaction Management

**Priority**: P0

**Requirements**:

- **FR-3.1**: System SHALL allow users to add income transactions
  - **AC**: Required: amount, date; Optional: category, notes, payment method

- **FR-3.2**: System SHALL allow users to add expense transactions
  - **AC**: Required: amount, date; Optional: category, notes, payment method, budget link

- **FR-3.3**: System SHALL allow users to edit transactions
  - **AC**: All fields editable, budget totals recalculate on save

- **FR-3.4**: System SHALL allow users to delete transactions
  - **AC**: Confirmation required, budget totals recalculate

- **FR-3.5**: System SHALL update budget totals in real-time
  - **AC**: Adding/editing/deleting transactions immediately updates budget spent/remaining

- **FR-3.6**: System SHALL filter transactions
  - **AC**: Filter by date, type, category, payment method, budget

- **FR-3.7**: System SHALL search transactions
  - **AC**: Search description/notes, case-insensitive, debounced

---

### FR-4: Category Management

**Priority**: P0 (default categories), P1 (custom categories)

**Requirements**:

- **FR-4.1**: System SHALL provide default categories
  - **AC**: Pre-built categories include: Housing, Food, Transportation, Entertainment, Healthcare, Personal, Utilities, Savings, Other

- **FR-4.2**: System SHALL allow users to create custom categories
  - **AC**: User can set name, color, icon; stored in IndexedDB

- **FR-4.3**: System SHALL allow users to edit custom categories
  - **AC**: Name, color, icon are editable

- **FR-4.4**: System SHALL allow users to delete custom categories
  - **AC**: Requires reassignment of associated transactions, default categories cannot be deleted

---

### FR-5: Reporting and Analytics

**Priority**: P0 (dashboard, category breakdown), P1 (trends, comparisons)

**Requirements**:

- **FR-5.1**: System SHALL display monthly summary dashboard
  - **AC**: Shows income, expenses, balance, budget status, top categories, recent transactions

- **FR-5.2**: System SHALL display category breakdown
  - **AC**: Pie chart with percentages, list view with amounts

- **FR-5.3**: System SHALL display spending trends
  - **AC**: Line graph showing income/expenses/balance over 6 months

- **FR-5.4**: System SHALL allow month-over-month comparison
  - **AC**: Side-by-side comparison with percentage changes

- **FR-5.5**: System SHALL export data to CSV
  - **AC**: Transactions and budgets exportable, date range selectable

---

### FR-6: Savings Goals (Phase 2)

**Priority**: P1

**Requirements**:

- **FR-6.1**: System SHALL allow users to create savings goals
  - **AC**: Required: name, target amount; Optional: deadline, initial amount

- **FR-6.2**: System SHALL track goal progress
  - **AC**: User can add to goal, progress shown as percentage and amount

- **FR-6.3**: System SHALL allow users to complete or cancel goals
  - **AC**: Goals can be marked completed or cancelled, archived for history

---

### FR-7: Settings and Preferences

**Priority**: P1

**Requirements**:

- **FR-7.1**: System SHALL allow users to update profile
  - **AC**: User can change email, password, display name, currency

- **FR-7.2**: System SHALL allow users to export all data
  - **AC**: JSON export includes budgets, transactions, categories, goals

- **FR-7.3**: System SHALL allow users to delete account
  - **AC**: Strong confirmation, deletes all IndexedDB data and Supabase account

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

**Requirements**:

- **NFR-1.1**: Initial page load SHALL be < 2 seconds on 4G connection
  - **Measurement**: Lighthouse performance score > 90

- **NFR-1.2**: Transaction list SHALL render < 500ms for 1000 transactions
  - **Measurement**: React DevTools profiler

- **NFR-1.3**: Budget calculations SHALL update < 100ms
  - **Measurement**: Console timing logs

- **NFR-1.4**: Charts SHALL render < 1 second
  - **Measurement**: Time to interactive for report pages

- **NFR-1.5**: IndexedDB queries SHALL return < 50ms for typical operations
  - **Measurement**: Console timing for read/write operations

---

### NFR-2: Security

**Priority**: P0

**Requirements**:

- **NFR-2.1**: All authentication SHALL be handled by Supabase
  - **AC**: No custom auth logic, use Supabase SDK

- **NFR-2.2**: User data SHALL be isolated per user
  - **AC**: IndexedDB databases are scoped to user session, no cross-user data access

- **NFR-2.3**: All network requests SHALL use HTTPS
  - **AC**: Supabase endpoints use HTTPS

- **NFR-2.4**: Passwords SHALL meet complexity requirements
  - **AC**: Min 8 chars, 1 upper, 1 lower, 1 number enforced by Supabase

- **NFR-2.5**: Sessions SHALL expire automatically
  - **AC**: Default 7 days, extended 30 days with "remember me"

- **NFR-2.6**: Sensitive data SHALL NOT be logged to console in production
  - **AC**: No transaction amounts, user emails in production logs

---

### NFR-3: Accessibility

**Priority**: P0

**Requirements**:

- **NFR-3.1**: Application SHALL meet WCAG 2.1 AA standards
  - **AC**: Lighthouse accessibility score > 90

- **NFR-3.2**: All interactive elements SHALL be keyboard accessible
  - **AC**: Tab navigation works for all buttons, forms, links

- **NFR-3.3**: All images and icons SHALL have alt text
  - **AC**: Screen readers can describe all visual elements

- **NFR-3.4**: Color contrast SHALL meet AA standards (4.5:1 for text)
  - **AC**: No contrast warnings in browser DevTools

- **NFR-3.5**: Focus indicators SHALL be visible
  - **AC**: Keyboard focus shows clear outline/highlight

- **NFR-3.6**: Form errors SHALL be announced to screen readers
  - **AC**: ARIA live regions announce validation errors

---

### NFR-4: Usability

**Priority**: P1

**Requirements**:

- **NFR-4.1**: New users SHALL complete first budget within 5 minutes
  - **Measurement**: User testing task completion time

- **NFR-4.2**: Forms SHALL provide inline validation
  - **AC**: Errors shown immediately next to fields, not just on submit

- **NFR-4.3**: Error messages SHALL be clear and actionable
  - **AC**: Messages explain what's wrong and how to fix it

- **NFR-4.4**: Loading states SHALL be visible for async operations
  - **AC**: Spinners, skeleton screens, or progress indicators shown

- **NFR-4.5**: Empty states SHALL guide users to next action
  - **AC**: Helpful messages and CTAs when no data exists

- **NFR-4.6**: Mobile interactions SHALL be touch-optimized
  - **AC**: Buttons min 44x44px, adequate spacing between tappable elements

---

### NFR-5: Reliability

**Priority**: P0

**Requirements**:

- **NFR-5.1**: Application SHALL work offline for data viewing
  - **AC**: IndexedDB allows read-only access without network

- **NFR-5.2**: Data writes SHALL be persisted immediately to IndexedDB
  - **AC**: No data loss if browser is closed after save confirmation

- **NFR-5.3**: Application SHALL handle IndexedDB errors gracefully
  - **AC**: Error messages shown, app doesn't crash, fallback to re-try

- **NFR-5.4**: Application SHALL handle Supabase auth errors gracefully
  - **AC**: Network errors, session expiry handled with clear messages

- **NFR-5.5**: Application SHALL log errors for debugging
  - **AC**: Errors logged to console (dev) or monitoring service (production)

---

### NFR-6: Maintainability

**Priority**: P1

**Requirements**:

- **NFR-6.1**: Code SHALL follow project TypeScript standards
  - **AC**: No TypeScript errors, ESLint warnings addressed

- **NFR-6.2**: Components SHALL have clear single responsibilities
  - **AC**: Components < 300 lines, extracted if larger

- **NFR-6.3**: Business logic SHALL be in custom hooks
  - **AC**: No business logic in components, hooks for data operations

- **NFR-6.4**: Code SHALL be formatted with Prettier
  - **AC**: Pre-commit hook runs Prettier

- **NFR-6.5**: Commits SHALL follow conventional commit format
  - **AC**: Commit messages validated by commitlint

---

### NFR-7: Browser Compatibility

**Priority**: P0

**Requirements**:

- **NFR-7.1**: Application SHALL work in Chrome (last 2 versions)
- **NFR-7.2**: Application SHALL work in Firefox (last 2 versions)
- **NFR-7.3**: Application SHALL work in Safari (last 2 versions)
- **NFR-7.4**: Application SHALL work in Edge (last 2 versions)
- **NFR-7.5**: Application SHALL work on iOS Safari (iOS 15+)
- **NFR-7.6**: Application SHALL work on Android Chrome (Android 10+)

**AC**: Manual testing on each browser, no critical bugs

---

### NFR-8: Responsive Design

**Priority**: P0

**Requirements**:

- **NFR-8.1**: Application SHALL be mobile-first
  - **AC**: Design starts with mobile (320px) and scales up

- **NFR-8.2**: Application SHALL support screen sizes 320px to 1920px
  - **AC**: No horizontal scroll, all content accessible

- **NFR-8.3**: Application SHALL adapt layout for tablet (768px+)
  - **AC**: Two-column layouts where appropriate

- **NFR-8.4**: Application SHALL adapt layout for desktop (1024px+)
  - **AC**: Sidebar navigation, multi-column grids

---

## 7. Business Rules

### 7.1 Budget Rules

#### BR-1.1: Monthly Budget Scope

**Rule**: Each budget represents a single calendar month  
**Rationale**: Simplifies financial planning and aligns with typical income cycles  
**Validation**: Budget must have month (1-12) and year (4 digits)  
**Error**: "Budget must specify a valid month and year"

#### BR-1.2: Budget Uniqueness

**Rule**: Only one budget per month/year combination per user  
**Rationale**: Prevents confusion and data duplication  
**Validation**: Check existing budgets before creation  
**Error**: "A budget for {month} {year} already exists"

#### BR-1.3: Budget Total Amount

**Rule**: Total budget amount must be a positive number  
**Rationale**: Negative budgets are nonsensical  
**Validation**: amount > 0  
**Error**: "Budget amount must be greater than zero"

#### BR-1.4: Category Allocation Limit

**Rule**: Sum of category allocations cannot exceed total budget  
**Rationale**: Cannot allocate more than you have  
**Validation**: SUM(category_allocations) <= total_budget  
**Error**: "Category allocations exceed total budget by {amount}"

#### BR-1.5: Budget Status

**Rule**: Budgets have status: draft, active, closed  
**Rationale**: Users can plan budgets before activating  
**Validation**: Status must be one of allowed values  
**Transitions**: draft → active → closed

---

### 7.2 Category Rules

#### BR-2.1: Category Name Uniqueness

**Rule**: Category names must be unique per user  
**Rationale**: Prevents confusion in categorization  
**Validation**: Check existing categories before creation  
**Error**: "A category named '{name}' already exists"

#### BR-2.2: Default Categories

**Rule**: System provides pre-built default categories  
**List**: Housing, Food, Transportation, Entertainment, Healthcare, Personal, Utilities, Savings, Other  
**Rationale**: Helps users get started quickly  
**Validation**: Default categories cannot be deleted (can be hidden)

#### BR-2.3: Custom Categories

**Rule**: Users can create unlimited custom categories  
**Rationale**: Flexibility for personal budgeting styles  
**Validation**: Name required (max 50 chars), color and icon optional

#### BR-2.4: Category Deletion

**Rule**: Deleting a category requires reassigning associated transactions  
**Rationale**: Prevents orphaned transactions  
**Validation**: If category has transactions, user must select replacement category  
**Error**: "Cannot delete category with {count} transactions. Reassign transactions first."

#### BR-2.5: Category Color

**Rule**: Category color must be valid hex code or preset color  
**Rationale**: Ensures visual consistency  
**Validation**: Regex match #[0-9A-Fa-f]{6} or preset name  
**Default**: If not provided, assign from preset palette

---

### 7.3 Transaction Rules

#### TR-1.1: Transaction Amount

**Rule**: All transaction amounts must be positive numbers  
**Rationale**: Negative amounts are ambiguous (use type instead)  
**Validation**: amount > 0  
**Error**: "Amount must be greater than zero"

#### TR-1.2: Transaction Type

**Rule**: Transactions must be either "income" or "expense"  
**Rationale**: Clear categorization for calculations  
**Validation**: type in ['income', 'expense']  
**Error**: "Transaction type must be 'income' or 'expense'"

#### TR-1.3: Transaction Date

**Rule**: Transaction date cannot be more than 1 year in the future  
**Rationale**: Prevents accidental data entry errors  
**Validation**: date <= today + 365 days  
**Error**: "Transaction date cannot be more than 1 year in the future"

#### TR-1.4: Transaction Date (Past)

**Rule**: Transaction date can be in the past (no limit)  
**Rationale**: Users may enter historical data  
**Validation**: No lower bound on date

#### TR-1.5: Category Assignment

**Rule**: Expense transactions SHOULD have a category (optional)  
**Rationale**: Allows for general budget expenses  
**Validation**: If no category, link to general budget  
**Behavior**: Uncategorized expenses count toward budget total but not category totals

#### TR-1.6: Income Category

**Rule**: Income transactions MAY have a category for tracking sources  
**Rationale**: Optional income categorization (salary, freelance, etc.)  
**Validation**: Category is optional for income

#### TR-1.7: Budget Linking

**Rule**: Expense transactions SHOULD link to a budget  
**Rationale**: Enables budget tracking  
**Validation**: If no budget specified, attempt to link to budget for transaction date's month  
**Behavior**: If no matching budget, transaction is "unbudgeted"

#### TR-1.8: Transaction Description

**Rule**: Description is optional but recommended  
**Rationale**: Helps with future reference and searching  
**Validation**: Max 255 characters  
**Default**: Empty string if not provided

#### TR-1.9: Payment Method

**Rule**: Payment method is optional  
**Options**: Cash, Debit Card, Credit Card, Bank Transfer, Other  
**Validation**: Must be one of predefined options  
**Default**: Not set if not provided

---

### 7.4 Calculation Rules

#### CR-1.1: Budget Spent Calculation

**Rule**: Budget spent = SUM(expense transactions linked to budget)  
**Formula**: `spent = SUM(transactions WHERE type='expense' AND budgetId=budget.id)`  
**Update Trigger**: Recalculate when transaction is added, edited, or deleted

#### CR-1.2: Budget Remaining Calculation

**Rule**: Budget remaining = Total budget - Spent  
**Formula**: `remaining = total_budget - spent`  
**Behavior**: Can be negative (overspent)

#### CR-1.3: Budget Percentage Used

**Rule**: Percentage used = (Spent / Total) × 100  
**Formula**: `percentage = (spent / total_budget) * 100`  
**Rounding**: Round to 2 decimal places

#### CR-1.4: Category Spent Calculation

**Rule**: Category spent = SUM(expense transactions in category)  
**Formula**: `category_spent = SUM(transactions WHERE type='expense' AND categoryId=category.id)`  
**Update Trigger**: Recalculate when transaction is added, edited, or deleted

#### CR-1.5: Category Remaining Calculation

**Rule**: Category remaining = Allocated - Category spent  
**Formula**: `category_remaining = category.allocated - category_spent`  
**Behavior**: Can be negative (category overspent)

#### CR-1.6: Total Income Calculation

**Rule**: Total income = SUM(income transactions in period)  
**Formula**: `total_income = SUM(transactions WHERE type='income' AND date BETWEEN start AND end)`

#### CR-1.7: Total Expenses Calculation

**Rule**: Total expenses = SUM(expense transactions in period)  
**Formula**: `total_expenses = SUM(transactions WHERE type='expense' AND date BETWEEN start AND end)`

#### CR-1.8: Balance Calculation

**Rule**: Balance = Total income - Total expenses  
**Formula**: `balance = total_income - total_expenses`  
**Behavior**: Can be negative (spent more than earned)

#### CR-1.9: Goal Progress Calculation

**Rule**: Goal progress = (Current amount / Target amount) × 100  
**Formula**: `progress = (current / target) * 100`  
**Rounding**: Round to 2 decimal places  
**Cap**: Display as max 100% even if exceeded

---

### 7.5 Validation Rules

#### VR-1.1: Email Format

**Rule**: Email must match standard email format  
**Validation**: Regex match or Supabase validation  
**Error**: "Please enter a valid email address"

#### VR-1.2: Password Strength

**Rule**: Password must be at least 8 characters with 1 upper, 1 lower, 1 number  
**Validation**: Length >= 8, regex for character types  
**Error**: "Password must be at least 8 characters and include uppercase, lowercase, and number"

#### VR-1.3: Required Fields

**Rule**: Required fields cannot be empty or null  
**Validation**: Check for null, undefined, empty string  
**Error**: "{Field name} is required"

#### VR-1.4: Numeric Fields

**Rule**: Numeric fields must be valid numbers  
**Validation**: !isNaN(value) && isFinite(value)  
**Error**: "{Field name} must be a valid number"

#### VR-1.5: Date Fields

**Rule**: Date fields must be valid dates  
**Validation**: Date.parse() returns valid timestamp  
**Error**: "{Field name} must be a valid date"

---

### 7.6 Data Visibility Rules

#### DV-1.1: User Data Isolation

**Rule**: Users can ONLY see their own data  
**Validation**: All IndexedDB queries filter by userId  
**Enforcement**: Client-side filtering, no shared data

#### DV-1.2: Deleted Data

**Rule**: Deleted data is permanently removed  
**Behavior**: No soft deletes, no recovery  
**Warning**: Users must confirm destructive actions

---

### 7.7 Budget Status Workflow

#### BW-1.1: Status Transitions

**Rule**: Budget status follows defined workflow  
**Flow**: draft → active → closed  
**Allowed**:

- draft → active (user activates budget)
- active → closed (month ends or user closes)
- draft → deleted (user deletes before activating)

**Not Allowed**:

- closed → active (cannot reopen closed budget)
- active → draft (cannot downgrade active budget)

---

## 8. Data Requirements

### 8.1 Entities

#### Entity: User

**Description**: Represents an authenticated user of the application

**Storage**: Supabase Auth

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier (from Supabase) |
| email | String | Yes | User's email address |
| password_hash | String | Yes | Hashed password (managed by Supabase) |
| display_name | String | No | User's display name |
| currency | String | No | Preferred currency (default: USD) |
| created_at | Timestamp | Yes | Account creation date |
| last_login | Timestamp | Yes | Last login timestamp |

**Relationships**:

- Has many: Budgets, Transactions, Categories (custom), Goals

**Validation Rules**:

- Email must be unique
- Email must match valid email format
- Password must meet complexity requirements

---

#### Entity: Budget

**Description**: Represents a monthly budget with total amount and category allocations

**Storage**: IndexedDB (budgets object store)

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| userId | UUID | Yes | Owner user ID |
| name | String | Yes | Budget name (e.g., "January 2025") |
| totalAmount | Number | Yes | Total budget amount |
| month | Number | Yes | Month (1-12) |
| year | Number | Yes | Year (4 digits) |
| status | Enum | Yes | draft, active, closed |
| categories | Array | No | Array of category allocations |
| createdAt | Timestamp | Yes | Creation timestamp |
| updatedAt | Timestamp | Yes | Last update timestamp |

**Relationships**:

- Belongs to: User
- Has many: Transactions
- Has many: CategoryAllocations (embedded)

**Validation Rules**:

- totalAmount must be positive
- month must be 1-12
- year must be valid 4-digit year
- Only one budget per month/year per user
- Sum of category allocations cannot exceed totalAmount

**Indexes**:

- userId (for filtering user budgets)
- [userId, month, year] (for uniqueness check)

---

#### Entity: CategoryAllocation

**Description**: Embedded in Budget, represents allocation to a specific category

**Storage**: Embedded in Budget document

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| categoryId | UUID | Yes | Reference to Category |
| allocatedAmount | Number | Yes | Amount allocated to category |
| allocatedPercentage | Number | No | Percentage of total budget |

**Validation Rules**:

- allocatedAmount must be >= 0
- allocatedPercentage (if provided) must be 0-100

---

#### Entity: Category

**Description**: Represents a spending category (default or custom)

**Storage**: IndexedDB (categories object store)

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| userId | UUID | No | Owner user ID (null for default categories) |
| name | String | Yes | Category name |
| color | String | Yes | Hex color code |
| icon | String | Yes | Icon identifier |
| isDefault | Boolean | Yes | True for system categories |
| isCustom | Boolean | Yes | True for user-created categories |
| createdAt | Timestamp | Yes | Creation timestamp |

**Relationships**:

- Belongs to: User (if custom)
- Has many: Transactions

**Validation Rules**:

- name must be unique per user
- color must be valid hex code
- Default categories cannot be deleted

**Default Categories**:

1. Housing (color: #3B82F6, icon: home)
2. Food (color: #EF4444, icon: utensils)
3. Transportation (color: #F59E0B, icon: car)
4. Entertainment (color: #8B5CF6, icon: film)
5. Healthcare (color: #10B981, icon: heart)
6. Personal (color: #EC4899, icon: user)
7. Utilities (color: #6366F1, icon: bolt)
8. Savings (color: #14B8A6, icon: piggy-bank)
9. Other (color: #6B7280, icon: dots)

---

#### Entity: Transaction

**Description**: Represents a single income or expense transaction

**Storage**: IndexedDB (transactions object store)

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| userId | UUID | Yes | Owner user ID |
| type | Enum | Yes | income or expense |
| amount | Number | Yes | Transaction amount (always positive) |
| description | String | No | Transaction description/notes |
| categoryId | UUID | No | Reference to Category |
| budgetId | UUID | No | Reference to Budget |
| date | Date | Yes | Transaction date |
| paymentMethod | Enum | No | Cash, Debit Card, Credit Card, Bank Transfer, Other |
| createdAt | Timestamp | Yes | Creation timestamp |
| updatedAt | Timestamp | Yes | Last update timestamp |

**Relationships**:

- Belongs to: User
- Belongs to: Category (optional)
- Belongs to: Budget (optional)

**Validation Rules**:

- amount must be positive
- type must be 'income' or 'expense'
- date cannot be more than 1 year in future
- If budgetId is null, transaction is "unbudgeted"

**Indexes**:

- userId (for filtering user transactions)
- [userId, date] (for date range queries)
- [userId, categoryId] (for category filtering)
- [userId, budgetId] (for budget linking)

---

#### Entity: Goal

**Description**: Represents a savings goal

**Storage**: IndexedDB (goals object store)

**Key Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| userId | UUID | Yes | Owner user ID |
| name | String | Yes | Goal name |
| targetAmount | Number | Yes | Target savings amount |
| currentAmount | Number | Yes | Current progress amount |
| deadline | Date | No | Target completion date |
| status | Enum | Yes | active, completed, cancelled |
| createdAt | Timestamp | Yes | Creation timestamp |
| updatedAt | Timestamp | Yes | Last update timestamp |

**Relationships**:

- Belongs to: User

**Validation Rules**:

- targetAmount must be positive
- currentAmount must be >= 0
- deadline (if provided) must be in future

**Indexes**:

- userId (for filtering user goals)
- [userId, status] (for filtering active goals)

---

### 8.2 Data Relationships

```
User (Supabase Auth)
  ├── Budgets (IndexedDB)
  │     ├── CategoryAllocations (embedded)
  │     └── Transactions (IndexedDB, foreign key)
  ├── Categories (IndexedDB, custom only)
  ├── Transactions (IndexedDB)
  │     ├── Category (foreign key)
  │     └── Budget (foreign key)
  └── Goals (IndexedDB)
```

---

### 8.3 IndexedDB Structure

**Database Name**: `misfinanzas_{userId}`

**Object Stores**:

1. **budgets**: Stores budget documents
   - Key: id (UUID)
   - Indexes: userId, [month, year]

2. **categories**: Stores custom categories (default categories in app constants)
   - Key: id (UUID)
   - Indexes: userId, name

3. **transactions**: Stores transaction records
   - Key: id (UUID)
   - Indexes: userId, date, categoryId, budgetId

4. **goals**: Stores savings goals
   - Key: id (UUID)
   - Indexes: userId, status

**Version**: 1 (initial schema)

---

## 9. User Interface Requirements

### 9.1 Design System

#### Color Palette

**Primary Colors**:

- Primary Blue: #3B82F6 (links, buttons)
- Success Green: #10B981 (income, positive balance, under budget)
- Warning Yellow: #F59E0B (near budget limit)
- Danger Red: #EF4444 (expenses, over budget, errors)

**Neutral Colors**:

- Background: #F9FAFB (light gray)
- Card Background: #FFFFFF (white)
- Text Primary: #111827 (dark gray)
- Text Secondary: #6B7280 (medium gray)
- Border: #E5E7EB (light gray)

**Category Colors**: See Entity: Category (section 8.1)

**Semantic Usage**:

- Green: Income, positive outcomes, under budget
- Red: Expenses, negative outcomes, over budget
- Blue: Neutral actions, balance, information
- Yellow: Warnings, approaching limits

---

#### Typography

**Font Family**: Inter, system-ui, sans-serif (modern, readable)

**Font Sizes**:

- Display (financial numbers): 32px, font-weight: 700
- Heading 1: 24px, font-weight: 600
- Heading 2: 20px, font-weight: 600
- Heading 3: 18px, font-weight: 600
- Body: 16px, font-weight: 400
- Small: 14px, font-weight: 400
- Caption: 12px, font-weight: 400

**Line Heights**:

- Display: 1.2
- Headings: 1.3
- Body: 1.5

---

#### Spacing

**Base Unit**: 4px

**Scale**:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

**Generous Spacing**: Minimum 16px between sections, 24px between major blocks

---

#### Components

**Cards**:

- Background: White
- Border Radius: 12px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Padding: 16px (mobile), 24px (desktop)

**Buttons**:

- Border Radius: 8px
- Padding: 12px 24px
- Font Weight: 600
- Min Height: 44px (touch-friendly)
- Primary: Blue background, white text
- Secondary: White background, blue border
- Danger: Red background, white text

**Input Fields**:

- Border Radius: 8px
- Border: 1px solid #E5E7EB
- Padding: 12px
- Min Height: 44px
- Focus: Blue border, subtle shadow

**Icons**:

- Size: 20px (inline), 24px (standalone)
- Stroke Width: 2px
- Style: Outlined (not filled)

---

### 9.2 Page Layouts

#### UI-1: Home (Dashboard)

**Purpose**: Show monthly financial summary at a glance

**Layout** (Mobile):

- Header: "Mis Finanzas" + user menu
- Monthly Summary Card:
  - Month selector (e.g., "January 2025")
  - Total Income (large, green)
  - Total Expenses (large, red)
  - Balance (large, blue/green/red based on value)
- Budget Status Card:
  - Progress bar (spent vs total)
  - Budget remaining (large)
  - Percentage used
- Quick Actions:
  - Add Income button (green)
  - Add Expense button (red)
- Top Categories Card:
  - List of top 5 spending categories with amounts
- Recent Transactions Card:
  - Last 10 transactions with quick view

**Layout** (Desktop):

- Two-column grid
- Left: Monthly Summary + Quick Actions
- Right: Budget Status + Top Categories + Recent Transactions

**User Flow**:

1. User logs in → Dashboard loads
2. User sees current month summary
3. User can change month to view historical data
4. User can tap quick actions to add transactions
5. User can tap categories/transactions for details

**Responsive Behavior**:

- Mobile: Single column, stacked cards
- Tablet: Two columns for summary cards
- Desktop: Multi-column grid with sidebar navigation

---

#### UI-2: Movimientos (Transactions)

**Purpose**: View, add, edit, filter, and search transactions

**Layout** (Mobile):

- Header: "Movimientos" + filter icon + search icon
- Action Buttons:
  - Add Income button (green)
  - Add Expense button (red)
- Summary Bar:
  - Period income, expenses, balance
- Transaction List:
  - Grouped by date (today, yesterday, this week, earlier)
  - Each transaction shows: icon, description, category, amount, date
  - Swipe actions: edit, delete

**Layout** (Desktop):

- Left Sidebar: Filters (date, type, category, payment method)
- Main: Transaction list with search bar
- Right: Transaction detail panel (when selected)

**User Flow**:

1. User accesses Movimientos page
2. User sees all transactions (default: current month)
3. User can add new transaction via floating button
4. User can filter/search to find specific transactions
5. User can tap transaction to view/edit/delete

**Responsive Behavior**:

- Mobile: Full-width list, bottom sheet for filters
- Tablet: Two columns (list + filters)
- Desktop: Three columns (filters + list + details)

---

#### UI-3: Presupuesto (Budget)

**Purpose**: Create, view, and manage monthly budgets

**Layout** (Mobile):

- Header: "Presupuesto" + month selector + add button
- Budget Summary Card:
  - Total Budget (large)
  - Total Spent (large)
  - Total Remaining (large)
  - Progress bar
- Category Breakdown:
  - List of categories with allocated vs spent
  - Progress bar for each category
  - Color coding: green (under), yellow (near), red (over)
- Action: Edit Budget button

**Layout** (Desktop):

- Left: Budget list (by month)
- Center: Selected budget summary + category breakdown
- Right: Edit panel (when in edit mode)

**User Flow**:

1. User accesses Presupuesto page
2. If no budget exists, prompt to create first budget
3. User sees current month budget (or most recent)
4. User can create new budget for upcoming months
5. User can edit allocations and see real-time calculations
6. User can duplicate previous month's budget

**Responsive Behavior**:

- Mobile: Single column, full-screen edit mode
- Tablet: Two columns (list + details)
- Desktop: Three columns (list + summary + edit)

---

#### UI-4: Reportes (Reports)

**Purpose**: Visualize spending patterns and trends

**Layout** (Mobile):

- Header: "Reportes" + period selector
- Report Type Tabs:
  - Overview
  - Categories
  - Trends
  - Comparisons
- Overview Tab:
  - Income/Expenses/Balance summary
  - Monthly trend line chart
- Categories Tab:
  - Pie chart (expense distribution)
  - Category list with amounts and percentages
- Trends Tab:
  - Line chart (6-month income/expense/balance)
  - Toggle to show/hide lines
- Comparisons Tab:
  - Month selector (compare two months)
  - Side-by-side comparison table

**Layout** (Desktop):

- Top: Period selector + report type tabs
- Main: Large charts with interactive tooltips
- Bottom: Data tables for detailed analysis

**User Flow**:

1. User accesses Reportes page
2. User sees overview for current month
3. User can switch tabs to view different reports
4. User can change date range for analysis
5. User can export data to CSV

**Responsive Behavior**:

- Mobile: Stacked charts, scrollable tables
- Tablet: Larger charts, side-by-side tables
- Desktop: Full-width charts, multi-column tables

---

#### UI-5: Settings

**Purpose**: Manage profile, preferences, and data

**Layout** (Mobile):

- Header: "Settings"
- Sections:
  - Profile (email, display name, currency)
  - Categories (manage custom categories)
  - Data (export, delete account)
  - Help (guides, tips, about)
- Each section expands on tap

**Layout** (Desktop):

- Left Sidebar: Settings navigation
- Main: Selected settings section

**User Flow**:

1. User accesses Settings from menu
2. User navigates to desired section
3. User makes changes and saves
4. Confirmation shown for destructive actions

---

### 9.3 Interaction Patterns

**Empty States**:

- Friendly message explaining why empty
- Clear call-to-action button
- Optional illustration or icon

**Loading States**:

- Skeleton screens for page loads
- Spinners for button actions
- Progress indicators for long operations

**Error States**:

- Inline errors next to form fields
- Toast notifications for async errors
- Error icons with red color
- Clear, actionable error messages

**Success States**:

- Toast notifications for successful actions
- Green checkmark icons
- Brief confirmation messages (auto-dismiss)

**Confirmation Dialogs**:

- Used for destructive actions (delete, clear data)
- Clear warning message
- Two buttons: Cancel (secondary) + Confirm (danger)

---

### 9.4 Accessibility Requirements

**Keyboard Navigation**:

- Tab order follows visual flow
- All interactive elements are focusable
- Enter/Space activates buttons
- Escape closes modals/dialogs

**Screen Reader Support**:

- All images have alt text
- Form labels are properly associated
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Semantic HTML (nav, main, section, etc.)

**Color Contrast**:

- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

**Focus Indicators**:

- Visible focus outline (2px solid blue)
- Not removed via CSS

---

## 10. Risk Assessment

### Risk 1: IndexedDB Browser Support

**Category**: Technical

**Severity**: High

**Likelihood**: Low

**Impact**: Users on unsupported browsers cannot use the app, all features depend on IndexedDB

**Mitigation Strategy**:

- Check IndexedDB availability on app load
- Show clear error message if unsupported
- Provide fallback instructions (update browser)
- Target modern browsers (last 2 versions) explicitly
- Test on all target browsers before launch

**Contingency Plan**: If IndexedDB fails, offer temporary in-memory storage with warning (data lost on refresh)

**Owner**: Technical Lead

---

### Risk 2: Data Loss from Browser Clearing

**Category**: Technical / User Behavior

**Severity**: High

**Likelihood**: Medium

**Impact**: Users may lose all financial data if browser storage is cleared

**Mitigation Strategy**:

- Provide data export feature (CSV and JSON)
- Remind users to backup data regularly
- Implement auto-export on major milestones
- Consider optional cloud backup (future enhancement)
- Show warning when user navigates to browser settings

**Contingency Plan**: Provide clear instructions for data recovery (if export exists)

**Owner**: Product Owner

---

### Risk 3: Supabase Service Downtime

**Category**: Technical / External Dependency

**Severity**: Medium

**Likelihood**: Low

**Impact**: Users cannot log in or register during downtime, existing users can still use app offline

**Mitigation Strategy**:

- Choose reliable Supabase plan
- Monitor Supabase status page
- Implement graceful error handling for auth failures
- Allow offline access for logged-in users
- Cache user session locally

**Contingency Plan**: Show "Auth service temporarily unavailable" message, allow retry

**Owner**: Technical Lead

---

### Risk 4: User Adoption / Retention

**Category**: Business

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Low user adoption or high churn reduces product value

**Mitigation Strategy**:

- Focus on extreme simplicity and ease of use
- Provide helpful onboarding and empty states
- Gather user feedback early and iterate
- Implement analytics to track drop-off points
- Offer financial tips and education to add value

**Contingency Plan**: Pivot features based on user feedback, consider partnerships with financial bloggers

**Owner**: Product Owner

---

### Risk 5: Mobile Performance

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Slow performance on mobile devices frustrates users, increases bounce rate

**Mitigation Strategy**:

- Mobile-first development approach
- Optimize bundle size (code splitting, lazy loading)
- Test on low-end devices
- Use React Query for efficient data fetching
- Implement virtual scrolling for long lists
- Monitor performance metrics with Lighthouse

**Contingency Plan**: Reduce chart complexity, defer non-critical features, implement progressive enhancement

**Owner**: Technical Lead

---

### Risk 6: Accessibility Compliance

**Category**: Technical / Legal

**Severity**: Medium

**Likelihood**: Low

**Impact**: Failure to meet WCAG standards excludes users with disabilities, potential legal issues

**Mitigation Strategy**:

- Use shadcn/ui components (built with accessibility)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Run automated accessibility audits (Lighthouse, axe)
- Conduct manual keyboard navigation testing
- Involve users with disabilities in testing

**Contingency Plan**: Address accessibility issues in sprint dedicated to compliance

**Owner**: UX/UI Designer

---

### Risk 7: Feature Creep

**Category**: Business / Process

**Severity**: Low

**Likelihood**: High

**Impact**: Delayed MVP, increased complexity contradicts simplicity goal

**Mitigation Strategy**:

- Strict prioritization framework (P0/P1/P2/P3)
- Focus on MVP features only for initial release
- Defer P2/P3 features to Phase 2/3
- Regular scope reviews with stakeholders
- "No" is default answer for new features

**Contingency Plan**: Cut P1 features if timeline slips, maintain MVP integrity

**Owner**: Product Owner

---

### Risk 8: Currency and Localization

**Category**: Technical / Business

**Severity**: Low

**Likelihood**: Medium

**Impact**: Users in non-USD regions may have confusion with currency display

**Mitigation Strategy**:

- Allow user to select currency in settings
- Store currency preference per user
- Format amounts with currency symbol/code
- Future: Consider multi-currency support

**Contingency Plan**: Default to USD, allow manual currency selection, provide clear documentation

**Owner**: Product Owner

---

## 11. Success Metrics (KPIs)

### 11.1 User Adoption

**Metric**: Number of registered users

**Target**: 100 users within 3 months of launch

**Measurement**: Count of user records in Supabase

**Success Criteria**: Steady growth week-over-week

---

**Metric**: User activation rate (% who create first budget)

**Target**: 70% of registered users

**Measurement**: Count of users with at least 1 budget / total users

**Success Criteria**: High activation indicates good onboarding

---

### 11.2 User Engagement

**Metric**: Daily Active Users (DAU)

**Target**: 40% of registered users

**Measurement**: Count of unique users who log in each day

**Success Criteria**: Consistent daily usage indicates habit formation

---

**Metric**: Transactions per user per month

**Target**: 15 transactions/user/month (average)

**Measurement**: Sum of transactions / active users / month

**Success Criteria**: Regular transaction logging indicates active budgeting

---

**Metric**: User retention (30-day return rate)

**Target**: 50% of users return after 30 days

**Measurement**: Count of users who log in 30+ days after registration / total users

**Success Criteria**: High retention indicates value delivery

---

### 11.3 Performance

**Metric**: Average page load time

**Target**: < 2 seconds

**Measurement**: Lighthouse performance score, Real User Monitoring (RUM)

**Success Criteria**: Fast load times reduce bounce rate

---

**Metric**: IndexedDB query performance

**Target**: < 50ms for typical queries

**Measurement**: Console timing logs in development

**Success Criteria**: Fast data access ensures smooth UX

---

### 11.4 Usability

**Metric**: Time to create first budget

**Target**: < 5 minutes (average)

**Measurement**: Timestamp between first login and first budget creation

**Success Criteria**: Quick setup indicates intuitive UX

---

**Metric**: Task completion rate (create budget)

**Target**: 80% of users complete budget creation flow

**Measurement**: Count of users who reach final step / users who start

**Success Criteria**: High completion indicates clear flow

---

### 11.5 Business Value

**Metric**: User satisfaction score

**Target**: 4.5/5 average rating

**Measurement**: In-app survey, app store reviews

**Success Criteria**: High satisfaction indicates product-market fit

---

**Metric**: Feature usage (by feature)

**Target**: Budget (100%), Transactions (90%), Reports (60%), Goals (40%)

**Measurement**: Count of users who use each feature / total users

**Success Criteria**: High usage of core features, moderate usage of advanced features

---

### 11.6 Technical Health

**Metric**: Error rate

**Target**: < 1% of user sessions

**Measurement**: Error tracking service (Sentry or similar)

**Success Criteria**: Low error rate indicates stable app

---

**Metric**: Browser compatibility

**Target**: Works on 95% of user browsers

**Measurement**: Browser analytics, error reports by browser

**Success Criteria**: Wide compatibility reduces support burden

---

## 12. Implementation Phases

### Phase 1: MVP (Minimum Viable Product)

**Timeline**: 8-10 weeks

**Goal**: Deliver core budgeting and transaction tracking functionality

**Includes** (P0 Features):

**Epic 1: Authentication**

- ✅ User registration (US-1.1)
- ✅ User login (US-1.2)
- ✅ User logout (US-1.3)

**Epic 2: Budget Management**

- ✅ Create monthly budget (US-2.1)
- ✅ Allocate budget to categories (US-2.2)
- ✅ Edit budget (US-2.3)
- ✅ View budget summary (US-2.6)

**Epic 3: Transaction Tracking**

- ✅ Add income transaction (US-3.1)
- ✅ Add expense transaction (US-3.2)
- ✅ Edit transaction (US-3.3)
- ✅ Delete transaction (US-3.4)
- ✅ View transaction details (US-3.7)

**Epic 4: Reports & Analytics** (Basic)

- ✅ View monthly summary dashboard (US-4.1)
- ✅ View category breakdown (US-4.2)

**Infrastructure**:

- ✅ Next.js 15 App Router setup
- ✅ Supabase authentication integration
- ✅ IndexedDB service layer
- ✅ shadcn/ui component library
- ✅ Responsive layout (mobile-first)

**Success Criteria**:

- User can register, login, and create a budget
- User can add transactions and see budget update
- User can view monthly summary on dashboard
- App loads in < 2 seconds
- No critical accessibility issues
- Works on Chrome, Safari, Firefox (mobile and desktop)

**Out of Scope for MVP**:

- Password reset (P1)
- Budget duplication (P1)
- Transaction filtering/search (P1)
- Spending trends (P1)
- Goals (P1)
- Custom categories (P1)

---

### Phase 2: Enhancement

**Timeline**: 4-6 weeks (after MVP launch)

**Goal**: Add advanced features for power users and improve retention

**Includes** (P1 Features):

**Epic 1: Authentication**

- Password reset (US-1.4)

**Epic 2: Budget Management**

- Delete budget (US-2.4)
- Duplicate budget to new month (US-2.5)

**Epic 3: Transaction Tracking**

- Filter transactions (US-3.5)
- Search transactions (US-3.6)

**Epic 4: Reports & Analytics**

- View spending trends (US-4.3)
- Compare months (US-4.4)
- Export data (US-4.5)

**Epic 5: Savings Goals**

- Create savings goal (US-5.1)
- Track goal progress (US-5.2)
- Complete or cancel goal (US-5.3)

**Epic 6: Settings**

- Manage profile (US-6.1)
- Manage custom categories (US-6.2)
- Export all data (US-6.3)

**Success Criteria**:

- Users can filter and search transactions efficiently
- Users can track multiple savings goals
- Users can export data for backups
- User retention improves (50% 30-day return rate)

---

### Phase 3: Optimization & Education

**Timeline**: 4-6 weeks (after Phase 2)

**Goal**: Improve performance, add educational content, polish UX

**Includes** (P2 and P3 Features):

**Epic 4: Reports & Analytics**

- Advanced analytics (custom date ranges, category comparisons)

**Epic 6: Settings**

- Delete account (US-6.4)
- Currency preferences
- Dark mode (P2 feature)

**Epic 7: Help & Education**

- View financial tips (US-7.1)
- Budget creation guide (US-7.2)
- Educational content library

**Performance Optimizations**:

- Code splitting and lazy loading
- Image optimization
- IndexedDB query optimization
- Virtual scrolling for long lists
- Service worker for offline support

**UX Improvements**:

- Onboarding flow for new users
- Interactive tutorials
- Improved empty states
- Micro-interactions and animations

**Success Criteria**:

- Page load time < 1.5 seconds
- Lighthouse score > 95
- User satisfaction score > 4.5/5
- Educational content engagement (30% of users view tips)

---

### Future Considerations (Post-Phase 3)

**Not Committed, but Potential Enhancements**:

- Recurring transaction templates
- Budget recommendations based on spending history
- Bill reminders and notifications
- Receipt scanning (OCR)
- Multi-currency support
- Collaborative budgets (family sharing)
- Bank account integration (read-only)
- Investment tracking
- Debt payoff planning
- Mobile app (React Native)

**Evaluation Criteria**: User demand, technical feasibility, alignment with simplicity goal

---

## 13. Open Questions

- [ ] **Q1**: Should we support recurring transactions (e.g., monthly rent)?
  - **Owner**: Product Owner
  - **Due**: Before Phase 2
  - **Rationale**: Common user request, adds complexity to MVP

- [ ] **Q2**: How do we handle users in different time zones?
  - **Owner**: Technical Lead
  - **Due**: Before MVP
  - **Rationale**: Transaction dates may be ambiguous

- [ ] **Q3**: Should we implement cloud backup (optional)?
  - **Owner**: Product Owner
  - **Due**: Before Phase 2
  - **Rationale**: Mitigates data loss risk but adds backend complexity

- [ ] **Q4**: Do we need budget approval workflow (draft → active)?
  - **Owner**: Product Owner
  - **Due**: Before MVP
  - **Rationale**: Adds flexibility but may complicate UX

- [ ] **Q5**: Should income have categories (salary, freelance, etc.)?
  - **Owner**: Product Owner
  - **Due**: Before MVP
  - **Rationale**: Useful for income tracking but not core to MVP

---

## 14. Assumptions Validation

| Assumption                                        | Status       | Validation Method                                 | Result    |
| ------------------------------------------------- | ------------ | ------------------------------------------------- | --------- |
| Users prefer local data (privacy) over cloud sync | ⏳ Pending   | User interviews, surveys                          | TBD       |
| Users will manually enter transactions daily      | ⏳ Pending   | User testing, engagement metrics                  | TBD       |
| Monthly budget cycles are standard                | ✅ Validated | Market research (most budgeting apps use monthly) | Confirmed |
| Users have modern browsers with IndexedDB         | ⏳ Pending   | Browser analytics after launch                    | TBD       |
| Simplicity is more important than features        | ⏳ Pending   | User feedback, retention metrics                  | TBD       |
| Users will create backups proactively             | ⏳ Pending   | Feature usage metrics                             | TBD       |

---

## 15. Glossary

**Budget**: A financial plan for a specific month with total amount and category allocations

**Category**: A classification for expenses (e.g., Food, Housing) used to organize spending

**Transaction**: A single income or expense entry with amount, date, and optional category

**Goal**: A savings target with target amount and deadline

**Allocated Amount**: The portion of total budget assigned to a specific category

**Spent**: The sum of expense transactions in a category or budget

**Remaining**: The difference between allocated and spent (can be negative if overspent)

**Balance**: The difference between total income and total expenses in a period

**IndexedDB**: Browser-based client-side database for storing data locally

**Supabase**: Backend-as-a-Service platform providing authentication

**MVP**: Minimum Viable Product - the smallest feature set that delivers value

**P0/P1/P2/P3**: Priority levels (P0 = Critical, P1 = High, P2 = Medium, P3 = Low)

**WCAG**: Web Content Accessibility Guidelines - standards for accessible web applications

---

## 16. References

**Related Documents**:

- `.claude/knowledge/architecture-patterns.md` - Technical architecture rules
- `.claude/knowledge/tech-stack.md` - Technology stack details
- `.claude/knowledge/file-structure.md` - Project file organization
- `.claude/tasks/context_session_1767147315.md` - Session context

**Technical Specifications**:

- Next.js 15 Documentation: https://nextjs.org/docs
- React 19 Documentation: https://react.dev
- Supabase Documentation: https://supabase.com/docs
- IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- shadcn/ui: https://ui.shadcn.com

**Design References**:

- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Tailwind CSS v4: https://tailwindcss.com

---

## 17. Approval

| Role           | Name    | Date | Signature |
| -------------- | ------- | ---- | --------- |
| Product Owner  | Pending |      |           |
| Technical Lead | Pending |      |           |
| UX/UI Designer | Pending |      |           |

---

## 18. Change Log

| Version | Date       | Author                 | Changes                           |
| ------- | ---------- | ---------------------- | --------------------------------- |
| 1.0     | 2025-12-30 | Business Analyst Agent | Initial comprehensive PRD created |

---

**END OF DOCUMENT**

**Total User Stories**: 31  
**Total Business Rules**: 36  
**Total Entities**: 6  
**Total Pages**: 5  
**Total Epics**: 7
