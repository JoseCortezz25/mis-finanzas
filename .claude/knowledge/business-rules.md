# Business Rules - Mis Finanzas

**Version**: 1.0  
**Last Updated**: 2025-12-30  
**Source**: PROJECT.md (section 7)

This document contains all business rules for the Mis Finanzas personal finance application, optimized for AI agent consumption during implementation.

---

## Table of Contents

1. [Budget Rules](#budget-rules)
2. [Category Rules](#category-rules)
3. [Transaction Rules](#transaction-rules)
4. [Calculation Rules](#calculation-rules)
5. [Validation Rules](#validation-rules)
6. [Data Visibility Rules](#data-visibility-rules)
7. [Budget Status Workflow](#budget-status-workflow)

---

## Budget Rules

### BR-1.1: Monthly Budget Scope

**Rule**: Each budget represents a single calendar month  
**Rationale**: Simplifies financial planning and aligns with typical income cycles  
**Validation**: Budget must have month (1-12) and year (4 digits)  
**Implementation**: Enforce month/year fields as required on Budget entity  
**Error Message**: "Budget must specify a valid month and year"

```typescript
// Validation example
function validateBudgetPeriod(month: number, year: number): boolean {
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}
```

---

### BR-1.2: Budget Uniqueness

**Rule**: Only one budget per month/year combination per user  
**Rationale**: Prevents confusion and data duplication  
**Validation**: Check existing budgets before creation  
**Implementation**: Query IndexedDB for existing budget with same userId + month + year  
**Error Message**: "A budget for {month} {year} already exists"

```typescript
// Check uniqueness before creating budget
async function budgetExists(
  userId: string,
  month: number,
  year: number
): Promise<boolean> {
  const existing = await getBudgetByMonthYear(userId, month, year);
  return existing !== null;
}
```

---

### BR-1.3: Budget Total Amount

**Rule**: Total budget amount must be a positive number  
**Rationale**: Negative budgets are nonsensical  
**Validation**: `amount > 0`  
**Implementation**: Client-side and service-layer validation  
**Error Message**: "Budget amount must be greater than zero"

```typescript
// Validation
function validateBudgetAmount(amount: number): boolean {
  return amount > 0 && isFinite(amount) && !isNaN(amount);
}
```

---

### BR-1.4: Category Allocation Limit

**Rule**: Sum of category allocations cannot exceed total budget  
**Rationale**: Cannot allocate more than you have  
**Validation**: `SUM(category_allocations) <= total_budget`  
**Implementation**: Real-time validation during allocation, warning if exceeded  
**Error Message**: "Category allocations exceed total budget by ${difference}"

```typescript
// Validation during category allocation
function validateCategoryAllocations(
  totalBudget: number,
  allocations: Array<{ categoryId: string; amount: number }>
): { valid: boolean; difference?: number } {
  const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
  if (sum > totalBudget) {
    return { valid: false, difference: sum - totalBudget };
  }
  return { valid: true };
}
```

---

### BR-1.5: Budget Status

**Rule**: Budgets have status: draft, active, closed  
**Rationale**: Users can plan budgets before activating  
**Validation**: Status must be one of allowed values  
**Allowed Transitions**:

- `draft → active` (user activates budget)
- `active → closed` (month ends or user closes)
- `draft → deleted` (user deletes before activating)
- NOT allowed: `closed → active`, `active → draft`

**Implementation**: Enforce status transitions in update logic  
**Error Message**: "Cannot change budget status from {current} to {new}"

```typescript
type BudgetStatus = 'draft' | 'active' | 'closed';

function canTransitionStatus(
  current: BudgetStatus,
  next: BudgetStatus
): boolean {
  const allowed = {
    draft: ['active', 'deleted'],
    active: ['closed'],
    closed: []
  };
  return allowed[current]?.includes(next) ?? false;
}
```

---

## Category Rules

### BR-2.1: Category Name Uniqueness

**Rule**: Category names must be unique per user (case-insensitive)  
**Rationale**: Prevents confusion in categorization  
**Validation**: Check existing categories before creation  
**Implementation**: Query IndexedDB for existing category with same userId + name (lowercase)  
**Error Message**: "A category named '{name}' already exists"

```typescript
async function categoryNameExists(
  userId: string,
  name: string
): Promise<boolean> {
  const categories = await getCategoriesByUser(userId);
  return categories.some(c => c.name.toLowerCase() === name.toLowerCase());
}
```

---

### BR-2.2: Default Categories

**Rule**: System provides pre-built default categories  
**List**:

1. Housing (color: #3B82F6, icon: home)
2. Food (color: #EF4444, icon: utensils)
3. Transportation (color: #F59E0B, icon: car)
4. Entertainment (color: #8B5CF6, icon: film)
5. Healthcare (color: #10B981, icon: heart)
6. Personal (color: #EC4899, icon: user)
7. Utilities (color: #6366F1, icon: bolt)
8. Savings (color: #14B8A6, icon: piggy-bank)
9. Other (color: #6B7280, icon: dots)

**Rationale**: Helps users get started quickly  
**Implementation**: Default categories are constants in app code, not stored in IndexedDB  
**Validation**: Default categories cannot be deleted (can be hidden in future)

```typescript
const DEFAULT_CATEGORIES = [
  {
    id: 'default-housing',
    name: 'Housing',
    color: '#3B82F6',
    icon: 'home',
    isDefault: true
  },
  {
    id: 'default-food',
    name: 'Food',
    color: '#EF4444',
    icon: 'utensils',
    isDefault: true
  }
  // ... etc
];
```

---

### BR-2.3: Custom Categories

**Rule**: Users can create unlimited custom categories  
**Rationale**: Flexibility for personal budgeting styles  
**Validation**: Name required (max 50 chars), color and icon optional  
**Implementation**: Store custom categories in IndexedDB with userId  
**Defaults**: If color not provided, assign from preset palette; if icon not provided, use 'tag' icon

```typescript
interface CustomCategory {
  id: string;
  userId: string;
  name: string; // max 50 chars
  color: string; // hex code or preset
  icon: string; // icon identifier
  isCustom: true;
}
```

---

### BR-2.4: Category Deletion

**Rule**: Deleting a category requires reassigning associated transactions  
**Rationale**: Prevents orphaned transactions  
**Validation**: If category has transactions, user must select replacement category  
**Implementation**: Show transaction count in delete confirmation, require category picker if count > 0  
**Error Message**: "Cannot delete category with {count} transactions. Reassign transactions first."

```typescript
async function deleteCategory(
  categoryId: string,
  replacementCategoryId?: string
): Promise<void> {
  const transactionCount = await getTransactionCountByCategory(categoryId);

  if (transactionCount > 0 && !replacementCategoryId) {
    throw new Error(
      `Cannot delete category with ${transactionCount} transactions`
    );
  }

  if (transactionCount > 0) {
    await reassignTransactions(categoryId, replacementCategoryId);
  }

  await deleteCategoryById(categoryId);
}
```

---

### BR-2.5: Category Color

**Rule**: Category color must be valid hex code or preset color name  
**Rationale**: Ensures visual consistency  
**Validation**: Regex match `#[0-9A-Fa-f]{6}` or preset name  
**Preset Colors**: blue, red, green, yellow, purple, pink, indigo, teal, gray, orange  
**Default**: If not provided, assign next color from preset palette (round-robin)  
**Error Message**: "Invalid color format. Use hex code (e.g., #3B82F6) or preset name"

```typescript
const PRESET_COLORS = {
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
  gray: '#6B7280',
  orange: '#F97316'
};

function validateColor(color: string): boolean {
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexPattern.test(color) || color in PRESET_COLORS;
}
```

---

## Transaction Rules

### TR-1.1: Transaction Amount

**Rule**: All transaction amounts must be positive numbers  
**Rationale**: Negative amounts are ambiguous; use transaction type (income/expense) instead  
**Validation**: `amount > 0 && isFinite(amount) && !isNaN(amount)`  
**Implementation**: Client-side validation on form, service-layer validation  
**Error Message**: "Amount must be greater than zero"

```typescript
function validateTransactionAmount(amount: number): boolean {
  return amount > 0 && isFinite(amount) && !isNaN(amount);
}
```

---

### TR-1.2: Transaction Type

**Rule**: Transactions must be either "income" or "expense"  
**Rationale**: Clear categorization for calculations  
**Validation**: `type in ['income', 'expense']`  
**Implementation**: Use TypeScript enum for type safety  
**Error Message**: "Transaction type must be 'income' or 'expense'"

```typescript
enum TransactionType {
  Income = 'income',
  Expense = 'expense'
}

function validateTransactionType(type: string): type is TransactionType {
  return type === TransactionType.Income || type === TransactionType.Expense;
}
```

---

### TR-1.3: Transaction Date (Future Limit)

**Rule**: Transaction date cannot be more than 1 year in the future  
**Rationale**: Prevents accidental data entry errors  
**Validation**: `date <= today + 365 days`  
**Implementation**: Date picker should warn for future dates, hard limit at 1 year  
**Error Message**: "Transaction date cannot be more than 1 year in the future"

```typescript
function validateTransactionDate(date: Date): boolean {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  return date <= oneYearFromNow;
}
```

---

### TR-1.4: Transaction Date (Past)

**Rule**: Transaction date can be in the past (no limit)  
**Rationale**: Users may enter historical data  
**Validation**: No lower bound on date  
**Implementation**: Allow any past date, date picker can suggest recent dates

---

### TR-1.5: Category Assignment (Expenses)

**Rule**: Expense transactions SHOULD have a category (optional)  
**Rationale**: Allows for general budget expenses without specific category  
**Validation**: Category is optional for expenses  
**Implementation**: If no category, link to general budget; uncategorized expenses count toward budget total but not category totals  
**Behavior**: Show "Uncategorized" in transaction list if categoryId is null

```typescript
// Creating expense without category
const expense: Transaction = {
  // ... other fields
  type: TransactionType.Expense,
  categoryId: null, // Allowed - uncategorized expense
  budgetId: 'current-month-budget-id' // Still linked to budget
};
```

---

### TR-1.6: Category Assignment (Income)

**Rule**: Income transactions MAY have a category for tracking sources  
**Rationale**: Optional income categorization (salary, freelance, gifts, etc.)  
**Validation**: Category is optional for income  
**Implementation**: If provided, use for income reporting; if not, show as "General Income"

---

### TR-1.7: Budget Linking

**Rule**: Expense transactions SHOULD link to a budget  
**Rationale**: Enables budget tracking  
**Validation**: If no budget specified, attempt to auto-link to budget for transaction date's month  
**Implementation**: On transaction creation, find budget matching transaction month/year  
**Behavior**: If no matching budget, transaction is "unbudgeted" (budgetId = null)

```typescript
async function linkTransactionToBudget(
  transaction: Transaction,
  userId: string
): Promise<string | null> {
  if (transaction.budgetId) return transaction.budgetId; // Already linked

  const date = new Date(transaction.date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const budget = await getBudgetByMonthYear(userId, month, year);
  return budget?.id ?? null; // Null if no budget for this month
}
```

---

### TR-1.8: Transaction Description

**Rule**: Description is optional but recommended  
**Rationale**: Helps with future reference and searching  
**Validation**: Max 255 characters  
**Default**: Empty string if not provided  
**Implementation**: Text input with character counter

```typescript
function validateTransactionDescription(description: string | null): boolean {
  if (!description) return true; // Optional
  return description.length <= 255;
}
```

---

### TR-1.9: Payment Method

**Rule**: Payment method is optional  
**Options**: Cash, Debit Card, Credit Card, Bank Transfer, Other  
**Validation**: Must be one of predefined options  
**Default**: Not set (null) if not provided  
**Implementation**: Dropdown select with null option

```typescript
enum PaymentMethod {
  Cash = 'cash',
  DebitCard = 'debit_card',
  CreditCard = 'credit_card',
  BankTransfer = 'bank_transfer',
  Other = 'other'
}
```

---

## Calculation Rules

### CR-1.1: Budget Spent Calculation

**Rule**: Budget spent = SUM(expense transactions linked to budget)  
**Formula**: `spent = SUM(transactions WHERE type='expense' AND budgetId=budget.id)`  
**Update Trigger**: Recalculate when transaction is added, edited, or deleted  
**Implementation**: Reactive calculation using React Query or Zustand  
**Performance**: For large datasets, consider caching with invalidation

```typescript
function calculateBudgetSpent(
  transactions: Transaction[],
  budgetId: string
): number {
  return transactions
    .filter(t => t.type === TransactionType.Expense && t.budgetId === budgetId)
    .reduce((sum, t) => sum + t.amount, 0);
}
```

---

### CR-1.2: Budget Remaining Calculation

**Rule**: Budget remaining = Total budget - Spent  
**Formula**: `remaining = total_budget - spent`  
**Behavior**: Can be negative (overspent)  
**Implementation**: Calculate after spent is determined  
**Display**: Show negative in red with "Overspent" label

```typescript
function calculateBudgetRemaining(totalBudget: number, spent: number): number {
  return totalBudget - spent;
}
```

---

### CR-1.3: Budget Percentage Used

**Rule**: Percentage used = (Spent / Total) × 100  
**Formula**: `percentage = (spent / total_budget) * 100`  
**Rounding**: Round to 2 decimal places  
**Edge Cases**: If total = 0, percentage = 0; if spent > total, can exceed 100%  
**Implementation**: Use for progress bar and status indicators

```typescript
function calculateBudgetPercentage(spent: number, totalBudget: number): number {
  if (totalBudget === 0) return 0;
  const percentage = (spent / totalBudget) * 100;
  return Math.round(percentage * 100) / 100; // 2 decimal places
}
```

---

### CR-1.4: Category Spent Calculation

**Rule**: Category spent = SUM(expense transactions in category)  
**Formula**: `category_spent = SUM(transactions WHERE type='expense' AND categoryId=category.id)`  
**Update Trigger**: Recalculate when transaction is added, edited, or deleted  
**Implementation**: Can filter by budget for budget-specific category totals

```typescript
function calculateCategorySpent(
  transactions: Transaction[],
  categoryId: string,
  budgetId?: string
): number {
  return transactions
    .filter(
      t =>
        t.type === TransactionType.Expense &&
        t.categoryId === categoryId &&
        (!budgetId || t.budgetId === budgetId)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}
```

---

### CR-1.5: Category Remaining Calculation

**Rule**: Category remaining = Allocated - Category spent  
**Formula**: `category_remaining = category.allocated - category_spent`  
**Behavior**: Can be negative (category overspent)  
**Implementation**: Use for category progress bars

```typescript
function calculateCategoryRemaining(allocated: number, spent: number): number {
  return allocated - spent;
}
```

---

### CR-1.6: Total Income Calculation

**Rule**: Total income = SUM(income transactions in period)  
**Formula**: `total_income = SUM(transactions WHERE type='income' AND date BETWEEN start AND end)`  
**Implementation**: Filter transactions by date range and type  
**Period**: Typically current month for dashboard, customizable for reports

```typescript
function calculateTotalIncome(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter(
      t =>
        t.type === TransactionType.Income &&
        t.date >= startDate &&
        t.date <= endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
}
```

---

### CR-1.7: Total Expenses Calculation

**Rule**: Total expenses = SUM(expense transactions in period)  
**Formula**: `total_expenses = SUM(transactions WHERE type='expense' AND date BETWEEN start AND end)`  
**Implementation**: Filter transactions by date range and type

```typescript
function calculateTotalExpenses(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter(
      t =>
        t.type === TransactionType.Expense &&
        t.date >= startDate &&
        t.date <= endDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
}
```

---

### CR-1.8: Balance Calculation

**Rule**: Balance = Total income - Total expenses  
**Formula**: `balance = total_income - total_expenses`  
**Behavior**: Can be negative (spent more than earned)  
**Display**: Green if positive, red if negative, yellow if close to zero

```typescript
function calculateBalance(totalIncome: number, totalExpenses: number): number {
  return totalIncome - totalExpenses;
}
```

---

### CR-1.9: Goal Progress Calculation

**Rule**: Goal progress = (Current amount / Target amount) × 100  
**Formula**: `progress = (current / target) * 100`  
**Rounding**: Round to 2 decimal places  
**Cap**: Display as max 100% even if exceeded (show "Goal exceeded!" message)  
**Implementation**: Use for goal progress bars

```typescript
function calculateGoalProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress * 100) / 100, 100); // Cap at 100%
}
```

---

## Validation Rules

### VR-1.1: Email Format

**Rule**: Email must match standard email format  
**Validation**: Use Supabase built-in validation or regex  
**Pattern**: `^[^\s@]+@[^\s@]+\.[^\s@]+$` (basic check)  
**Error Message**: "Please enter a valid email address"

```typescript
function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
```

---

### VR-1.2: Password Strength

**Rule**: Password must be at least 8 characters with 1 upper, 1 lower, 1 number  
**Validation**: Length >= 8, regex for character types  
**Pattern**: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`  
**Error Message**: "Password must be at least 8 characters and include uppercase, lowercase, and number"

```typescript
function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasUpper && hasLower && hasNumber;
}
```

---

### VR-1.3: Required Fields

**Rule**: Required fields cannot be empty, null, or undefined  
**Validation**: Check for null, undefined, empty string, whitespace-only string  
**Error Message**: "{Field name} is required"

```typescript
function validateRequired(
  value: any,
  fieldName: string
): { valid: boolean; error?: string } {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}
```

---

### VR-1.4: Numeric Fields

**Rule**: Numeric fields must be valid numbers  
**Validation**: `!isNaN(value) && isFinite(value)`  
**Error Message**: "{Field name} must be a valid number"

```typescript
function validateNumeric(
  value: any,
  fieldName: string
): { valid: boolean; error?: string } {
  if (isNaN(value) || !isFinite(value)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  return { valid: true };
}
```

---

### VR-1.5: Date Fields

**Rule**: Date fields must be valid dates  
**Validation**: `Date.parse(value)` returns valid timestamp  
**Error Message**: "{Field name} must be a valid date"

```typescript
function validateDate(
  value: any,
  fieldName: string
): { valid: boolean; error?: string } {
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    return { valid: false, error: `${fieldName} must be a valid date` };
  }
  return { valid: true };
}
```

---

## Data Visibility Rules

### DV-1.1: User Data Isolation

**Rule**: Users can ONLY see their own data  
**Validation**: All IndexedDB queries filter by userId  
**Enforcement**: Client-side filtering (IndexedDB scoped to session)  
**Implementation**: Every entity has userId field, all queries include userId filter

```typescript
// Always filter by userId
async function getUserBudgets(userId: string): Promise<Budget[]> {
  const db = await openDB();
  const transaction = db.transaction('budgets', 'readonly');
  const store = transaction.objectStore('budgets');
  const index = store.index('userId');
  return index.getAll(userId);
}
```

---

### DV-1.2: Deleted Data

**Rule**: Deleted data is permanently removed (hard delete)  
**Behavior**: No soft deletes, no recovery mechanism  
**Warning**: Users must confirm destructive actions with strong confirmation  
**Implementation**: Show warning dialog, require confirmation before delete

```typescript
// Hard delete with confirmation
async function deleteTransaction(
  transactionId: string,
  confirmed: boolean
): Promise<void> {
  if (!confirmed) {
    throw new Error('Deletion must be confirmed');
  }

  const db = await openDB();
  const transaction = db.transaction('transactions', 'readwrite');
  const store = transaction.objectStore('transactions');
  await store.delete(transactionId);
}
```

---

## Budget Status Workflow

### BW-1.1: Status Transitions

**Rule**: Budget status follows defined workflow  
**Flow**: `draft → active → closed`

**Allowed Transitions**:

- `draft → active` (user activates budget)
- `active → closed` (month ends or user manually closes)
- `draft → deleted` (user deletes before activating)

**Not Allowed**:

- `closed → active` (cannot reopen closed budget)
- `active → draft` (cannot downgrade active budget)
- `closed → draft` (cannot downgrade closed budget)

**Implementation**: Validate transition before update  
**Error Message**: "Cannot change budget status from {current} to {new}"

```typescript
type BudgetStatus = 'draft' | 'active' | 'closed';

function validateStatusTransition(
  currentStatus: BudgetStatus,
  newStatus: BudgetStatus
): { valid: boolean; error?: string } {
  const allowedTransitions: Record<BudgetStatus, BudgetStatus[]> = {
    draft: ['active'],
    active: ['closed'],
    closed: []
  };

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    return {
      valid: false,
      error: `Cannot change budget status from ${currentStatus} to ${newStatus}`
    };
  }

  return { valid: true };
}
```

---

### BW-1.2: Auto-Close Budgets

**Rule**: Budgets MAY auto-close at end of month (optional feature)  
**Rationale**: Prevents accidental edits to past budgets  
**Implementation**: Cron job or client-side check on app load  
**Behavior**: Only budgets in "active" status are auto-closed

```typescript
// Optional: Auto-close active budgets for past months
async function autoClosePastBudgets(userId: string): Promise<void> {
  const budgets = await getUserBudgets(userId);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  for (const budget of budgets) {
    if (budget.status === 'active') {
      const isPast =
        budget.year < currentYear ||
        (budget.year === currentYear && budget.month < currentMonth);

      if (isPast) {
        await updateBudgetStatus(budget.id, 'closed');
      }
    }
  }
}
```

---

## Summary for Agents

**Total Business Rules**: 36

**By Category**:

- Budget Rules: 5
- Category Rules: 5
- Transaction Rules: 9
- Calculation Rules: 9
- Validation Rules: 5
- Data Visibility Rules: 2
- Budget Status Workflow: 2

**Key Implementation Notes**:

1. All validation should happen client-side for immediate feedback
2. All calculations should be reactive (update when data changes)
3. All data operations should filter by userId for data isolation
4. All errors should have clear, actionable messages
5. All destructive actions should require confirmation

**Reference**: For full context, see PROJECT.md section 7

---

**END OF BUSINESS RULES DOCUMENT**
