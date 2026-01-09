# Financial Visualizations - Business Rules & Requirements Analysis

**Session ID**: `financial_visualizations_1767835714`
**Created**: 2026-01-07
**Author**: business-analyst
**Status**: Complete

---

## Executive Summary

This document defines comprehensive business rules, data requirements, and integration specifications for three new financial visualization components:

1. **Daily Bar Chart** (Reports Page) - Daily expenses vs income comparison
2. **GitHub-style Spending Heatmap** (Reports Page) - Activity-style spending visualization
3. **Balance Gauge Card** (Dashboard) - Semicircular balance meter with category breakdown

**Key Insights**:
- All visualizations leverage existing transaction and budget data
- Calculations follow established business rules from `business-rules.md`
- Components require aggregation strategies for performance
- Mobile-first responsive design is critical
- Real-time updates via React Query invalidation

---

## Table of Contents

1. [Component 1: Daily Bar Chart](#component-1-daily-bar-chart)
2. [Component 2: GitHub-style Spending Heatmap](#component-2-github-style-spending-heatmap)
3. [Component 3: Balance Gauge Card](#component-3-balance-gauge-card)
4. [Cross-Component Business Rules](#cross-component-business-rules)
5. [Data Aggregation Strategy](#data-aggregation-strategy)
6. [Integration Points](#integration-points)
7. [Performance Considerations](#performance-considerations)
8. [Edge Cases & Error Handling](#edge-cases--error-handling)

---

## Component 1: Daily Bar Chart

### Purpose

Display daily financial activity showing income and expenses side-by-side for easy comparison over a selected time period.

---

### Business Rules

#### BR-DBC-1.1: Data Source

**Rule**: Chart data comes from `transactions` table
**Query**: Filter by `user_id`, `type` ('income' or 'expense'), and date range
**Aggregation**: Group by `date` (day granularity), SUM `amount` per type
**Time Period**: Default to current month, allow user to select range (last 7 days, 30 days, 90 days, custom range)

```typescript
// Pseudo-query
SELECT
  DATE(date) as day,
  type,
  SUM(amount) as total
FROM transactions
WHERE user_id = ?
  AND date >= ?
  AND date <= ?
GROUP BY DATE(date), type
ORDER BY day ASC
```

---

#### BR-DBC-1.2: Daily Aggregation Logic

**Rule**: Each day has exactly two data points: income total and expense total
**Rationale**: Enables visual comparison within the same day
**Default Values**: If no transactions exist for a day, use 0 for both income and expense
**Calculation**:
- `daily_income = SUM(transactions WHERE type='income' AND DATE(date)=day)`
- `daily_expense = SUM(transactions WHERE type='expense' AND DATE(date)=day)`

**Edge Case**: If a day has only income or only expense, other value is 0

```typescript
interface DailyBarChartDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  income: number; // Total income for day
  expense: number; // Total expense for day
  net: number; // income - expense (for tooltip/summary)
}
```

---

#### BR-DBC-1.3: Date Range Handling

**Rule**: Date range must have start and end date
**Validation**:
- `startDate <= endDate`
- Maximum range: 365 days (prevent performance issues)
- Minimum range: 1 day

**Default Ranges**:
- Current month: First day to last day of current month
- Last 7 days: Today - 6 days to today
- Last 30 days: Today - 29 days to today
- Last 90 days: Today - 89 days to today
- Custom: User selects start and end

**Error Messages**:
- "Start date must be before end date"
- "Date range cannot exceed 365 days"

---

#### BR-DBC-1.4: Visual Representation

**Rule**: Each day is represented by two vertical bars (side-by-side)
**Color Coding**:
- Income bars: Green (`#10B981` - Tailwind green-500)
- Expense bars: Red (`#EF4444` - Tailwind red-500)

**Bar Styling**:
- Bars should have rounded corners (`rounded-t-md`)
- Minimum bar height for visibility (even for $0 days)
- Bars grouped by day with small gap between groups

**Axes**:
- X-axis: Dates (formatted as "MMM DD" or "DD" depending on range)
- Y-axis: Amount in COP (formatted with thousand separators)
- Grid lines: Horizontal lines for amount reference

**Responsive Behavior**:
- **Mobile** (<640px): Show last 7 days max, horizontal scroll for more
- **Tablet** (640px-1024px): Show last 30 days, horizontal scroll if needed
- **Desktop** (>1024px): Show full selected range, responsive width

---

#### BR-DBC-1.5: Interactivity

**Rule**: Users can interact with chart for detailed information
**Hover/Tap**: Show tooltip with:
- Date (formatted: "Monday, January 7, 2026")
- Income: "$X,XXX,XXX COP"
- Expense: "$X,XXX,XXX COP"
- Net: "$X,XXX,XXX COP" (green if positive, red if negative)

**Click**: No action (hover-only for this chart)

**Legend**: Display legend above chart:
- Income (green square icon + label)
- Expense (red square icon + label)

---

#### BR-DBC-1.6: Empty State

**Rule**: If no transactions exist in date range, show empty state
**Display**:
- Empty chart with axes (no bars)
- Message: "No hay movimientos en este período"
- Suggestion: "Registra tu primer ingreso o gasto para ver el gráfico"
- Action: Button to create transaction

---

#### BR-DBC-1.7: Data Update Trigger

**Rule**: Chart updates when transaction data changes
**React Query Invalidation**: Invalidate `['transactions', userId, startDate, endDate]` when:
- New transaction created
- Transaction updated (amount, date, type)
- Transaction deleted

**Loading State**: Show skeleton loader while fetching data

---

### Data Structure

```typescript
// Input: Raw transactions from repository
interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string; // ISO timestamp
  category_id: string;
  budget_id: string | null;
  // ... other fields
}

// Output: Aggregated data for chart
interface DailyBarChartData {
  dateRange: {
    start: string; // ISO date
    end: string; // ISO date
    totalDays: number;
  };
  dataPoints: DailyBarChartDataPoint[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    daysWithActivity: number;
    daysWithoutActivity: number;
  };
}

interface DailyBarChartDataPoint {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
  net: number;
  transactionCount: number; // Optional: for tooltip
}
```

---

### Calculation Functions

```typescript
// Aggregation logic
function aggregateDailyTransactions(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): DailyBarChartData {
  // 1. Create map of all days in range
  const dayMap = new Map<string, { income: number; expense: number }>();

  let currentDay = new Date(startDate);
  while (currentDay <= endDate) {
    const dateKey = currentDay.toISOString().split('T')[0]; // YYYY-MM-DD
    dayMap.set(dateKey, { income: 0, expense: 0 });
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // 2. Aggregate transactions by day
  transactions.forEach(t => {
    const dateKey = new Date(t.date).toISOString().split('T')[0];
    const dayData = dayMap.get(dateKey);

    if (dayData) {
      if (t.type === 'income') {
        dayData.income += t.amount;
      } else {
        dayData.expense += t.amount;
      }
    }
  });

  // 3. Convert to data points
  const dataPoints: DailyBarChartDataPoint[] = [];
  let totalIncome = 0;
  let totalExpense = 0;
  let daysWithActivity = 0;

  dayMap.forEach((values, date) => {
    const net = values.income - values.expense;
    const hasActivity = values.income > 0 || values.expense > 0;

    dataPoints.push({
      date,
      income: values.income,
      expense: values.expense,
      net,
      transactionCount: hasActivity ? 1 : 0 // Simplified
    });

    totalIncome += values.income;
    totalExpense += values.expense;
    if (hasActivity) daysWithActivity++;
  });

  return {
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      totalDays: dayMap.size
    },
    dataPoints,
    summary: {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      daysWithActivity,
      daysWithoutActivity: dayMap.size - daysWithActivity
    }
  };
}
```

---

## Component 2: GitHub-style Spending Heatmap

### Purpose

Visualize spending patterns over time using a heatmap grid (like GitHub contributions), where each day is a square and color intensity represents spending amount.

---

### Business Rules

#### BR-HEAT-2.1: Data Source

**Rule**: Heatmap data comes from `transactions` table, **expense type only**
**Query**: Filter by `user_id`, `type='expense'`, and date range
**Aggregation**: Group by `date` (day granularity), SUM `amount`
**Time Period**: Default to last 12 months (365 days), configurable

```typescript
// Pseudo-query
SELECT
  DATE(date) as day,
  SUM(amount) as total_spent
FROM transactions
WHERE user_id = ?
  AND type = 'expense'
  AND date >= ?
  AND date <= ?
GROUP BY DATE(date)
ORDER BY day ASC
```

---

#### BR-HEAT-2.2: Daily Spending Aggregation

**Rule**: Each day shows total expenses only (income ignored)
**Calculation**: `daily_spending = SUM(transactions WHERE type='expense' AND DATE(date)=day)`
**Default**: Days with no expenses show as $0 (lightest color)

**Edge Case**: Days with extremely high spending (outliers) should not skew color scale
**Solution**: Use percentile-based color scale (e.g., 90th percentile as max)

```typescript
interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  amount: number; // Total expenses for day
  level: number; // Color intensity level (0-4)
  transactionCount: number; // Number of transactions this day
}
```

---

#### BR-HEAT-2.3: Color Intensity Levels

**Rule**: Color saturation represents spending amount in 5 levels
**Levels**:
- **Level 0**: $0 spent - Very light gray (`#F3F4F6` - gray-100)
- **Level 1**: Low spending (0-25th percentile) - Light red (`#FEE2E2` - red-100)
- **Level 2**: Medium-low (25th-50th percentile) - Medium-light red (`#FECACA` - red-200)
- **Level 3**: Medium-high (50th-75th percentile) - Medium red (`#FCA5A5` - red-300)
- **Level 4**: High spending (75th-100th percentile) - Dark red (`#EF4444` - red-500)

**Calculation**:
```typescript
function calculateLevel(amount: number, percentiles: number[]): number {
  if (amount === 0) return 0;
  if (amount <= percentiles[25]) return 1;
  if (amount <= percentiles[50]) return 2;
  if (amount <= percentiles[75]) return 3;
  return 4;
}

// Calculate percentiles from all non-zero amounts
function calculatePercentiles(amounts: number[]): { 25: number; 50: number; 75: number } {
  const nonZero = amounts.filter(a => a > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) return { 25: 0, 50: 0, 75: 0 };

  return {
    25: nonZero[Math.floor(nonZero.length * 0.25)],
    50: nonZero[Math.floor(nonZero.length * 0.50)],
    75: nonZero[Math.floor(nonZero.length * 0.75)]
  };
}
```

---

#### BR-HEAT-2.4: Grid Layout

**Rule**: Grid displays days in calendar-style layout (weeks as columns)
**Layout**:
- **Rows**: Days of week (Sun-Sat or Mon-Sun, configurable)
- **Columns**: Weeks (left to right, chronological)
- **Total cells**: 365 days (52-53 weeks × 7 days)

**Visual Structure**:
```
        Week 1  Week 2  Week 3  ...  Week 52
Mon     [■]     [■]     [□]          [■]
Tue     [■]     [□]     [■]          [□]
Wed     [□]     [■]     [■]          [■]
Thu     [■]     [■]     [□]          [■]
Fri     [■]     [□]     [■]          [□]
Sat     [□]     [■]     [■]          [■]
Sun     [■]     [□]     [□]          [□]
```

**Cell Styling**:
- Size: 12px × 12px (mobile), 14px × 14px (desktop)
- Gap: 2px between cells
- Border radius: 2px (`rounded-sm`)
- Border: 1px solid transparent (solid color fill)

---

#### BR-HEAT-2.5: Date Range Handling

**Rule**: Default shows last 365 days from today
**Options**:
- Last 6 months (180 days)
- Last 12 months (365 days)
- Current year (Jan 1 - today)
- Custom range (max 365 days)

**Alignment**: Grid starts from first day of first complete week in range
**Example**: If range starts on Wednesday, grid includes previous Mon-Tue as empty cells

---

#### BR-HEAT-2.6: Interactivity

**Rule**: Users can interact with cells for detailed information
**Hover/Tap**: Show tooltip with:
- Date: "Monday, January 7, 2026"
- Amount spent: "$X,XXX,XXX COP"
- Transaction count: "X movimientos"
- Top category (optional): "Categoría principal: Alimentación"

**Click**: Navigate to transaction list filtered by that date (optional enhancement)

**Legend**: Display color scale legend:
```
Menos ■ ■ ■ ■ ■ Más
      0  1  2  3  4
```

---

#### BR-HEAT-2.7: Month Labels

**Rule**: Display month labels above grid for orientation
**Position**: Above first week of each month
**Format**: Abbreviated month name ("Ene", "Feb", "Mar", ...)
**Spacing**: Aligned with corresponding week column

---

#### BR-HEAT-2.8: Empty State

**Rule**: If no expenses in date range, show empty heatmap
**Display**:
- All cells at level 0 (gray)
- Message: "No hay gastos registrados en este período"
- Suggestion: "¡Perfecto! No has gastado nada, o aún no has registrado gastos."

---

#### BR-HEAT-2.9: Data Update Trigger

**Rule**: Heatmap updates when expense transactions change
**React Query Invalidation**: Invalidate `['expenses-heatmap', userId, startDate, endDate]` when:
- New expense transaction created
- Expense transaction updated (amount, date)
- Expense transaction deleted
- Transaction type changed (income ↔ expense)

**Loading State**: Show skeleton grid while fetching

---

### Data Structure

```typescript
// Input: Raw expense transactions
interface Transaction {
  id: string;
  type: 'expense';
  amount: number;
  date: string;
  category_id: string;
  // ... other fields
}

// Output: Aggregated heatmap data
interface HeatmapData {
  dateRange: {
    start: string;
    end: string;
    totalDays: number;
  };
  grid: HeatmapWeek[];
  summary: {
    totalSpent: number;
    daysWithActivity: number;
    averageDailySpending: number;
    peakDay: { date: string; amount: number };
  };
  colorScale: {
    levels: [number, number, number, number, number]; // Thresholds for levels 0-4
    percentiles: { 25: number; 50: number; 75: number };
  };
}

interface HeatmapWeek {
  weekNumber: number; // 1-52
  days: HeatmapDataPoint[]; // 7 days (Sun-Sat or Mon-Sun)
}

interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  amount: number; // Total spent
  level: number; // 0-4 color intensity
  transactionCount: number;
  topCategory?: string; // Optional: most spent category
}
```

---

### Calculation Functions

```typescript
function aggregateHeatmapData(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): HeatmapData {
  // 1. Aggregate by day
  const dayMap = new Map<string, { amount: number; count: number }>();

  transactions.forEach(t => {
    if (t.type !== 'expense') return;
    const dateKey = new Date(t.date).toISOString().split('T')[0];
    const current = dayMap.get(dateKey) || { amount: 0, count: 0 };
    current.amount += t.amount;
    current.count++;
    dayMap.set(dateKey, current);
  });

  // 2. Calculate percentiles
  const amounts = Array.from(dayMap.values()).map(v => v.amount);
  const percentiles = calculatePercentiles(amounts);

  // 3. Create grid (52 weeks × 7 days)
  const grid: HeatmapWeek[] = [];
  let currentWeek: HeatmapDataPoint[] = [];
  let weekNumber = 1;

  let currentDay = new Date(startDate);
  while (currentDay <= endDate) {
    const dateKey = currentDay.toISOString().split('T')[0];
    const dayData = dayMap.get(dateKey) || { amount: 0, count: 0 };

    const dataPoint: HeatmapDataPoint = {
      date: dateKey,
      amount: dayData.amount,
      level: calculateLevel(dayData.amount, percentiles),
      transactionCount: dayData.count
    };

    currentWeek.push(dataPoint);

    // Week ends on Sunday (or Saturday depending on locale)
    if (currentDay.getDay() === 6) { // Saturday
      grid.push({ weekNumber, days: currentWeek });
      currentWeek = [];
      weekNumber++;
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  // Push remaining days
  if (currentWeek.length > 0) {
    grid.push({ weekNumber, days: currentWeek });
  }

  // 4. Calculate summary
  const totalSpent = amounts.reduce((sum, a) => sum + a, 0);
  const daysWithActivity = dayMap.size;
  const peakDay = Array.from(dayMap.entries()).reduce(
    (max, [date, data]) => (data.amount > max.amount ? { date, amount: data.amount } : max),
    { date: '', amount: 0 }
  );

  return {
    dateRange: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      totalDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    },
    grid,
    summary: {
      totalSpent,
      daysWithActivity,
      averageDailySpending: daysWithActivity > 0 ? totalSpent / daysWithActivity : 0,
      peakDay
    },
    colorScale: {
      levels: [0, percentiles[25], percentiles[50], percentiles[75], Infinity],
      percentiles
    }
  };
}
```

---

## Component 3: Balance Gauge Card

### Purpose

Display current financial balance using a semicircular gauge (speedometer-style) with visual segments representing financial categories (egresos, gastos, ingresos).

---

### Business Rules

#### BR-GAUGE-3.1: Data Source

**Rule**: Balance calculated from all transactions (income and expenses)
**Query**: Aggregate all user transactions across all budgets
**Calculation**: `balance = SUM(income) - SUM(expense)`
**Time Scope**: All-time balance (not filtered by date)

```typescript
// Pseudo-queries
const totalIncome = await transactionRepository.getTotalIncome(userId);
const totalExpenses = await transactionRepository.getTotalExpenses(userId);
const balance = totalIncome - totalExpenses;
```

---

#### BR-GAUGE-3.2: Balance Calculation

**Rule**: Balance = Total Income - Total Expenses
**Formula**: `balance = SUM(transactions WHERE type='income') - SUM(transactions WHERE type='expense')`
**Precision**: Round to nearest integer (no decimals in COP)
**Range**: Can be negative (debt) or positive (surplus)

**Edge Cases**:
- **No transactions**: Balance = $0
- **Negative balance**: Display with red styling, needle points to left side
- **Large balance**: Format with thousand/million separators ("$X.XXX.XXX")

---

#### BR-GAUGE-3.3: Category Definitions

**Rule**: Gauge segments represent three financial categories
**Categories** (as described by user):

1. **Egresos** (Outflows/Committed Expenses)
   - Definition: Recurring, committed expenses (rent, utilities, subscriptions)
   - Color: Red (`#EF4444`)
   - Calculation: SUM of expense transactions in "egresos" categories
   - Position on gauge: Left segment (0-33%)

2. **Gastos** (Variable Spending)
   - Definition: Variable, discretionary spending (food, entertainment, shopping)
   - Color: Orange (`#F97316`)
   - Calculation: SUM of expense transactions in "gastos" categories
   - Position on gauge: Middle segment (33-66%)

3. **Ingresos** (Income)
   - Definition: All income sources (salary, freelance, gifts)
   - Color: Green (`#10B981`)
   - Calculation: SUM of all income transactions
   - Position on gauge: Right segment (66-100%)

**Category Mapping**:
```typescript
// Categories must be tagged with type
const CATEGORY_TYPES = {
  egreso: ['Vivienda', 'Servicios', 'Suscripciones', 'Seguros'],
  gasto: ['Alimentación', 'Transporte', 'Entretenimiento', 'Compras'],
  ingreso: ['Salario', 'Freelance', 'Inversiones', 'Regalos']
};
```

**Note**: This requires extending category schema to include `category_type` field:
```typescript
enum CategoryType {
  Egreso = 'egreso',
  Gasto = 'gasto',
  Ingreso = 'ingreso'
}
```

---

#### BR-GAUGE-3.4: Gauge Scale

**Rule**: Gauge displays balance relative to total income
**Scale**: Semicircular (180 degrees), divided into segments
**Range**:
- Minimum: -100% (spent twice your income)
- Maximum: +100% (saved all income)
- Center (90°): 0 (broke even)

**Needle Position**:
```typescript
function calculateNeedleAngle(balance: number, totalIncome: number): number {
  if (totalIncome === 0) return 90; // Default to center if no income

  // Calculate percentage: -100% to +100%
  const percentage = (balance / totalIncome) * 100;

  // Clamp to -100% to +100%
  const clampedPercentage = Math.max(-100, Math.min(100, percentage));

  // Map to angle: -100% → 0°, 0% → 90°, +100% → 180°
  const angle = ((clampedPercentage + 100) / 200) * 180;

  return angle;
}
```

**Example**:
- Income: $2,000,000, Expenses: $1,000,000 → Balance: $1,000,000 → 50% → 135°
- Income: $2,000,000, Expenses: $2,000,000 → Balance: $0 → 0% → 90°
- Income: $2,000,000, Expenses: $3,000,000 → Balance: -$1,000,000 → -50% → 45°

---

#### BR-GAUGE-3.5: Segment Width

**Rule**: Each segment's width proportional to its amount relative to total income
**Calculation**:
```typescript
interface GaugeSegment {
  type: 'egreso' | 'gasto' | 'ingreso';
  amount: number;
  percentage: number; // Percentage of total income
  startAngle: number; // 0-180
  endAngle: number; // 0-180
  color: string;
}

function calculateSegments(
  totalEgresos: number,
  totalGastos: number,
  totalIngresos: number
): GaugeSegment[] {
  const total = totalEgresos + totalGastos + totalIngresos;

  if (total === 0) {
    // Default equal segments if no data
    return [
      { type: 'egreso', amount: 0, percentage: 33.33, startAngle: 0, endAngle: 60, color: '#EF4444' },
      { type: 'gasto', amount: 0, percentage: 33.33, startAngle: 60, endAngle: 120, color: '#F97316' },
      { type: 'ingreso', amount: 0, percentage: 33.33, startAngle: 120, endAngle: 180, color: '#10B981' }
    ];
  }

  const egresosPercent = (totalEgresos / total) * 100;
  const gastosPercent = (totalGastos / total) * 100;
  const ingresosPercent = (totalIngresos / total) * 100;

  const egresosAngle = (egresosPercent / 100) * 180;
  const gastosAngle = (gastosPercent / 100) * 180;

  return [
    {
      type: 'egreso',
      amount: totalEgresos,
      percentage: egresosPercent,
      startAngle: 0,
      endAngle: egresosAngle,
      color: '#EF4444'
    },
    {
      type: 'gasto',
      amount: totalGastos,
      percentage: gastosPercent,
      startAngle: egresosAngle,
      endAngle: egresosAngle + gastosAngle,
      color: '#F97316'
    },
    {
      type: 'ingreso',
      amount: totalIngresos,
      percentage: ingresosPercent,
      startAngle: egresosAngle + gastosAngle,
      endAngle: 180,
      color: '#10B981'
    }
  ];
}
```

---

#### BR-GAUGE-3.6: Visual Layout

**Rule**: Card displays three main sections (top, center, bottom)

**Top Section**:
- Large balance amount: "$X,XXX,XXX COP"
  - Font: Bold, 2xl-3xl size
  - Color: Green if positive, red if negative, gray if zero
- Label: "Balance Disponible"
  - Font: Regular, sm size, muted color

**Center Section**:
- Semicircular gauge (speedometer-style)
  - Outer ring: Colored segments (egresos, gastos, ingresos)
  - Inner area: White/transparent
  - Needle: Dark arrow pointing to current balance position
  - Center dot: Circle at needle pivot point

**Bottom Section**:
- Category legend (3 items)
  - Each item: Color square + Label + Amount
  - Layout: Horizontal row on desktop, vertical stack on mobile

**Dimensions**:
- Card width: Full container width
- Gauge diameter: 200px (mobile), 280px (desktop)
- Padding: Standard card padding (p-4 to p-6)

---

#### BR-GAUGE-3.7: Interactivity

**Rule**: Users can interact with segments and needle
**Hover on segment**: Highlight segment, show tooltip:
- Category name: "Egresos" / "Gastos" / "Ingresos"
- Total amount: "$X,XXX,XXX COP"
- Percentage: "X% del total"

**Hover on needle**: Show tooltip with balance details:
- "Balance: $X,XXX,XXX COP"
- "Porcentaje de ingresos: X%"

**Click**: No action (informational only)

---

#### BR-GAUGE-3.8: Empty State

**Rule**: If no transactions exist, show default gauge
**Display**:
- Balance: "$0 COP"
- Gauge: Equal segments (all gray or default colors at low opacity)
- Message: "Registra tus ingresos y gastos para ver tu balance"
- Action: Button to create transaction

---

#### BR-GAUGE-3.9: Data Update Trigger

**Rule**: Gauge updates when any transaction changes
**React Query Invalidation**: Invalidate `['balance', userId]` when:
- New transaction created (any type)
- Transaction updated (amount, type)
- Transaction deleted

**Loading State**: Show skeleton gauge while fetching

---

### Data Structure

```typescript
// Input: Aggregated transaction totals
interface BalanceGaugeInput {
  totalIncome: number;
  totalExpenses: number;
  totalEgresos: number; // Expenses in "egreso" categories
  totalGastos: number; // Expenses in "gasto" categories
}

// Output: Gauge data for rendering
interface BalanceGaugeData {
  balance: number; // totalIncome - totalExpenses
  balancePercentage: number; // balance / totalIncome * 100
  needleAngle: number; // 0-180 degrees
  segments: GaugeSegment[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    totalEgresos: number;
    totalGastos: number;
  };
}

interface GaugeSegment {
  type: 'egreso' | 'gasto' | 'ingreso';
  label: string; // Display name
  amount: number;
  percentage: number; // Of total
  startAngle: number;
  endAngle: number;
  color: string;
}
```

---

### Calculation Functions

```typescript
async function calculateBalanceGaugeData(userId: string): Promise<BalanceGaugeData> {
  // 1. Fetch all transactions
  const [totalIncome, totalExpenses, transactions] = await Promise.all([
    transactionRepository.getTotalIncome(userId),
    transactionRepository.getTotalExpenses(userId),
    transactionRepository.findAll(userId)
  ]);

  // 2. Categorize expenses by type
  const categories = await categoryRepository.findAll(userId);
  const categoryTypeMap = new Map<string, CategoryType>();
  categories.forEach(c => {
    categoryTypeMap.set(c.id, c.category_type); // Assumes category_type field exists
  });

  let totalEgresos = 0;
  let totalGastos = 0;

  transactions.forEach(t => {
    if (t.type === 'expense') {
      const categoryType = categoryTypeMap.get(t.category_id);
      if (categoryType === 'egreso') {
        totalEgresos += t.amount;
      } else if (categoryType === 'gasto') {
        totalGastos += t.amount;
      }
      // If category_type undefined, ignore or count as "gasto" by default
    }
  });

  // 3. Calculate balance
  const balance = totalIncome - totalExpenses;
  const balancePercentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const needleAngle = calculateNeedleAngle(balance, totalIncome);

  // 4. Calculate segments
  const segments = calculateSegments(totalEgresos, totalGastos, totalIncome);

  return {
    balance,
    balancePercentage,
    needleAngle,
    segments,
    summary: {
      totalIncome,
      totalExpenses,
      totalEgresos,
      totalGastos
    }
  };
}
```

---

## Cross-Component Business Rules

### BR-CROSS-1: User Data Isolation

**Rule**: All components filter data by `user_id`
**Enforcement**: Repository methods enforce user_id filtering
**Validation**: No cross-user data leakage

---

### BR-CROSS-2: Real-time Updates

**Rule**: All visualizations update in real-time when data changes
**Mechanism**: React Query cache invalidation
**Query Keys**:
- Daily Bar Chart: `['daily-chart', userId, startDate, endDate]`
- Heatmap: `['spending-heatmap', userId, startDate, endDate]`
- Balance Gauge: `['balance-gauge', userId]`

**Invalidation Triggers**:
- Transaction created → Invalidate all three
- Transaction updated → Invalidate all three
- Transaction deleted → Invalidate all three
- Budget updated → Invalidate balance gauge only

---

### BR-CROSS-3: Currency Formatting

**Rule**: All monetary values displayed in Colombian Peso (COP)
**Format**: `$X,XXX,XXX COP` (with thousand separators)
**Function**:
```typescript
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
```

---

### BR-CROSS-4: Date Formatting

**Rule**: Dates formatted according to locale (Spanish)
**Formats**:
- Short: "DD/MM/YYYY" (e.g., "07/01/2026")
- Medium: "DD MMM YYYY" (e.g., "07 Ene 2026")
- Long: "dddd, DD de MMMM de YYYY" (e.g., "Martes, 07 de Enero de 2026")

**Function**:
```typescript
function formatDate(date: string | Date, format: 'short' | 'medium' | 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
  };

  return new Intl.DateTimeFormat('es-CO', options[format]).format(d);
}
```

---

### BR-CROSS-5: Loading States

**Rule**: All components show skeleton loaders during data fetch
**Skeleton Styles**:
- Daily Bar Chart: Skeleton bars with pulse animation
- Heatmap: Skeleton grid with pulse animation
- Balance Gauge: Skeleton circle + text with pulse animation

**Duration**: Loading state visible only during initial fetch and refetch

---

### BR-CROSS-6: Error States

**Rule**: All components handle errors gracefully
**Error Types**:
- **Network error**: "No se pudo cargar los datos. Verifica tu conexión."
- **Permission error**: "No tienes permiso para ver estos datos."
- **Data error**: "Error al procesar los datos. Intenta de nuevo."

**Error Display**:
- Icon: Warning/error icon
- Message: Friendly error message (Spanish)
- Action: "Reintentar" button to refetch data

---

### BR-CROSS-7: Responsive Design

**Rule**: All components must be mobile-first responsive
**Breakpoints**:
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md-lg)
- Desktop: > 1024px (xl)

**Adaptations**:
- **Mobile**: Stack components vertically, reduce chart sizes, horizontal scroll
- **Tablet**: 2-column layout, medium chart sizes
- **Desktop**: Full layout, large chart sizes, no scroll

---

## Data Aggregation Strategy

### Performance Optimization

**Problem**: Fetching and aggregating thousands of transactions can be slow
**Solution**: Multi-level caching and optimization

---

### AGG-1: Repository-Level Aggregation

**Rule**: Perform aggregation in database queries when possible
**Example**: Use Supabase query to SUM amounts grouped by date

```typescript
// Instead of fetching all transactions and aggregating client-side
const transactions = await transactionRepository.findAll(userId);
const total = transactions.reduce((sum, t) => sum + t.amount, 0); // ❌ Slow

// Use repository method that aggregates in database
const total = await transactionRepository.getTotalIncome(userId); // ✅ Fast
```

---

### AGG-2: Cached Aggregations

**Rule**: Cache aggregated results using React Query
**Cache Time**: 5 minutes (stale time), 10 minutes (cache time)
**Invalidation**: Invalidate on transaction mutations

```typescript
const { data } = useQuery({
  queryKey: ['daily-chart', userId, startDate, endDate],
  queryFn: () => fetchDailyChartData(userId, startDate, endDate),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
});
```

---

### AGG-3: Lazy Loading

**Rule**: Load visualizations only when visible
**Mechanism**: Use Intersection Observer or `<Suspense>`
**Benefit**: Dashboard loads faster, charts load on demand

---

### AGG-4: Pagination for Large Datasets

**Rule**: If date range > 90 days, consider pagination or sampling
**Options**:
- Limit to 90 days max
- Show warning: "Rango muy amplio, mostrando últimos 90 días"
- Allow user to paginate through months

---

## Integration Points

### INT-1: Dashboard Integration

**Location**: `/app/dashboard/page.tsx`
**Component**: Balance Gauge Card
**Position**: Top section, prominent placement
**Dependencies**:
- User session (auth)
- Transaction data (React Query)
- Category data (for type mapping)

**Integration Code**:
```typescript
// app/dashboard/page.tsx
import { BalanceGaugeCard } from '@/domains/dashboard/components/organisms/balance-gauge-card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Suspense fallback={<BalanceGaugeSkeleton />}>
        <BalanceGaugeCard />
      </Suspense>
      {/* Other dashboard components */}
    </div>
  );
}
```

---

### INT-2: Reports Page Integration

**Location**: `/app/reports/page.tsx`
**Components**: Daily Bar Chart + Spending Heatmap
**Layout**: Stacked vertically on mobile, side-by-side on desktop
**Dependencies**:
- User session (auth)
- Transaction data (React Query)
- Date range selector (shared state)

**Integration Code**:
```typescript
// app/reports/page.tsx
import { DailyBarChart } from '@/domains/reports/components/organisms/daily-bar-chart';
import { SpendingHeatmap } from '@/domains/reports/components/organisms/spending-heatmap';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });

  return (
    <div className="space-y-8">
      <DateRangeSelector value={dateRange} onChange={setDateRange} />

      <Suspense fallback={<DailyBarChartSkeleton />}>
        <DailyBarChart startDate={dateRange.start} endDate={dateRange.end} />
      </Suspense>

      <Suspense fallback={<HeatmapSkeleton />}>
        <SpendingHeatmap startDate={dateRange.start} endDate={dateRange.end} />
      </Suspense>
    </div>
  );
}
```

---

### INT-3: Existing Data Hooks

**Use Existing Hooks**:
```typescript
// domains/transaction/hooks/use-transactions.ts
export function useTransactions(userId: string) {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findAll(userId)
  });
}

// domains/budget/hooks/use-budget-calculations.ts
export function useBudgetCalculations(budgetId: string, userId: string) {
  // Already calculates spent, remaining, etc.
}
```

**Create New Hooks**:
```typescript
// domains/reports/hooks/use-daily-chart-data.ts
export function useDailyChartData(userId: string, startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['daily-chart', userId, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const transactions = await transactionRepository.findByDateRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      return aggregateDailyTransactions(transactions, startDate, endDate);
    }
  });
}

// domains/reports/hooks/use-heatmap-data.ts
export function useHeatmapData(userId: string, startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ['spending-heatmap', userId, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const transactions = await transactionRepository.findByDateRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      return aggregateHeatmapData(
        transactions.filter(t => t.type === 'expense'),
        startDate,
        endDate
      );
    }
  });
}

// domains/dashboard/hooks/use-balance-gauge-data.ts
export function useBalanceGaugeData(userId: string) {
  return useQuery({
    queryKey: ['balance-gauge', userId],
    queryFn: () => calculateBalanceGaugeData(userId)
  });
}
```

---

### INT-4: Category Type Extension

**Problem**: Current category schema doesn't have `category_type` field
**Solution**: Extend category schema and repository

**Migration Required**:
```sql
-- Add category_type to categories table
ALTER TABLE categories
ADD COLUMN category_type VARCHAR(10) CHECK (category_type IN ('egreso', 'gasto', 'ingreso'));

-- Set default values for existing categories
UPDATE categories SET category_type = 'gasto'; -- Default to 'gasto'

-- Update schema validation
```

**Schema Update**:
```typescript
// lib/validations/category-schema.ts
export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string(),
  icon: z.string(),
  category_type: z.enum(['egreso', 'gasto', 'ingreso']).default('gasto')
});
```

**Alternative (No Migration)**:
If migration is not feasible, map categories by name:
```typescript
const CATEGORY_TYPE_MAP: Record<string, CategoryType> = {
  'Vivienda': 'egreso',
  'Servicios': 'egreso',
  'Alimentación': 'gasto',
  'Transporte': 'gasto',
  // ... etc
};
```

---

## Performance Considerations

### PERF-1: Query Optimization

**Rule**: Minimize database queries using batch operations
**Strategy**:
- Fetch all transactions once, aggregate client-side for multiple charts
- Use React Query to cache and share data across components

---

### PERF-2: Render Optimization

**Rule**: Prevent unnecessary re-renders
**Techniques**:
- Memoize aggregation functions with `useMemo`
- Memoize chart components with `React.memo`
- Use stable query keys to prevent refetch on re-render

```typescript
const chartData = useMemo(
  () => aggregateDailyTransactions(transactions, startDate, endDate),
  [transactions, startDate, endDate]
);
```

---

### PERF-3: Large Dataset Handling

**Rule**: Limit data size for visualizations
**Limits**:
- Daily Bar Chart: Max 365 days
- Heatmap: Max 365 days
- Balance Gauge: No limit (aggregated totals only)

**Warning**: Show user warning if they select large range

---

### PERF-4: Debouncing User Input

**Rule**: Debounce date range changes to prevent rapid refetches
**Implementation**:
```typescript
const debouncedDateRange = useDebounce(dateRange, 500);

const { data } = useDailyChartData(userId, debouncedDateRange.start, debouncedDateRange.end);
```

---

## Edge Cases & Error Handling

### EDGE-1: No Transactions

**Case**: User has no transactions
**Behavior**:
- Daily Bar Chart: Show empty chart with message
- Heatmap: Show gray grid with message
- Balance Gauge: Show $0 balance with default segments

---

### EDGE-2: Only Income or Only Expenses

**Case**: User has only income (no expenses) or vice versa
**Behavior**:
- Daily Bar Chart: Show only one type of bars
- Heatmap: Show all zeros if no expenses
- Balance Gauge: Needle at extreme position (0° or 180°)

---

### EDGE-3: Negative Balance

**Case**: User spent more than earned
**Behavior**:
- Balance Gauge: Needle points left (<90°), red styling
- Display: "-$X,XXX,XXX COP" in red
- Message: "Tu balance es negativo. Considera reducir gastos."

---

### EDGE-4: Extremely Large Balance

**Case**: User has millions in balance
**Behavior**:
- Format with million abbreviations: "$2.5M COP"
- Gauge needle at max position (180°)
- Tooltip shows full amount

---

### EDGE-5: Date Range with No Data

**Case**: User selects date range with zero transactions
**Behavior**:
- Daily Bar Chart: All bars at $0
- Heatmap: All cells gray (level 0)
- Message: "No hay movimientos en este período"

---

### EDGE-6: Invalid Date Range

**Case**: User selects `startDate > endDate`
**Behavior**:
- Validation error: "La fecha de inicio debe ser anterior a la fecha de fin"
- Disable submit/apply button
- Reset to default range on cancel

---

### EDGE-7: Outlier Spending Days

**Case**: One day has 10x normal spending (outlier)
**Behavior**:
- Daily Bar Chart: Show full bar, use logarithmic scale if needed
- Heatmap: Use percentile-based coloring to prevent skewing
- Tooltip highlights: "¡Día de alto gasto!"

---

### EDGE-8: Category Without Type

**Case**: Category doesn't have `category_type` assigned (Balance Gauge)
**Behavior**:
- Default to "gasto" type
- Log warning: "Category {name} has no type, defaulting to 'gasto'"
- Show in UI: Include in "Gastos" segment

---

### EDGE-9: Transaction Without Category

**Case**: Transaction has `category_id = null`
**Behavior**:
- Daily Bar Chart: Include in totals (no category filtering)
- Heatmap: Include in totals
- Balance Gauge: Default to "gasto" type for expenses, "ingreso" for income

---

### EDGE-10: Slow Network

**Case**: Data fetch takes >5 seconds
**Behavior**:
- Show loading skeleton for full duration
- After 10 seconds, show timeout message: "La carga está tomando más tiempo del esperado"
- Provide "Reintentar" button

---

## Summary for Implementation

### Component Priority

**Phase 1** (MVP):
1. Balance Gauge Card (Dashboard) - High impact, clear value
2. Daily Bar Chart (Reports) - Essential for trend analysis

**Phase 2** (Enhancement):
3. Spending Heatmap (Reports) - Nice-to-have, engaging visualization

---

### Schema Changes Required

**If adding `category_type` field**:
1. Add column to `categories` table
2. Update category schema validation
3. Update category repository
4. Migrate existing categories with default type
5. Update category creation form to include type selector

**Alternative (No schema change)**:
- Use hardcoded category name mapping for gauge segments
- Less flexible but no migration needed

---

### New Components to Create

**Organisms**:
1. `/domains/dashboard/components/organisms/balance-gauge-card.tsx`
2. `/domains/reports/components/organisms/daily-bar-chart.tsx`
3. `/domains/reports/components/organisms/spending-heatmap.tsx`

**Molecules**:
1. `/components/molecules/gauge.tsx` (reusable semicircular gauge)
2. `/components/molecules/heatmap-cell.tsx` (reusable heatmap square)

**Atoms**:
1. `/components/atoms/chart-tooltip.tsx` (reusable tooltip)
2. `/components/atoms/date-range-selector.tsx` (reusable date picker)

---

### New Hooks to Create

**Custom Hooks**:
1. `/domains/dashboard/hooks/use-balance-gauge-data.ts`
2. `/domains/reports/hooks/use-daily-chart-data.ts`
3. `/domains/reports/hooks/use-heatmap-data.ts`

**Utility Hooks**:
1. `/lib/hooks/use-debounce.ts` (if not exists)
2. `/lib/hooks/use-intersection-observer.ts` (for lazy loading)

---

### Utility Functions to Create

**Aggregation Functions**:
1. `/domains/reports/utils/aggregate-daily-transactions.ts`
2. `/domains/reports/utils/aggregate-heatmap-data.ts`
3. `/domains/dashboard/utils/calculate-balance-gauge.ts`

**Formatting Functions**:
1. `/lib/utils/format-currency.ts` (if not exists)
2. `/lib/utils/format-date.ts` (if not exists)

---

### Testing Considerations

**Unit Tests**:
- Aggregation functions (with various edge cases)
- Calculation functions (balance, percentages, angles)
- Formatting functions (currency, dates)

**Integration Tests**:
- Components render correctly with data
- Components handle loading/error states
- Components update when data changes

**Edge Case Tests**:
- No data scenarios
- Negative balances
- Large datasets
- Invalid date ranges
- Missing category types

---

### Accessibility (a11y)

**Requirements**:
- All charts must have ARIA labels
- Tooltips must be keyboard accessible
- Color should not be only differentiator (use patterns/icons)
- Screen reader announcements for data updates
- Keyboard navigation for date range selector

---

## Appendix: Data Flow Diagram

```
User Action (Create/Update/Delete Transaction)
    ↓
Server Action (transaction-actions.ts)
    ↓
Repository Update (transaction-repository.ts)
    ↓
React Query Mutation (onSuccess)
    ↓
Cache Invalidation
    ↓
┌─────────────────────────────────────┐
│   Query Refetch (Parallel)         │
├─────────────────┬───────────────────┤
│  Daily Chart    │  Heatmap  │ Gauge │
│  Query          │  Query    │ Query │
└─────────┬───────┴────┬──────┴───┬───┘
          ↓            ↓          ↓
    Aggregation   Aggregation   Calculation
          ↓            ↓          ↓
    Component    Component   Component
      Re-render    Re-render   Re-render
```

---

## Next Steps for Technical Implementation

**For UX/UI Designer**:
1. Create visual mockups for all three components
2. Define exact color palette and styling
3. Design responsive layouts (mobile/tablet/desktop)
4. Create interaction states (hover, active, loading, error)

**For shadcn-builder**:
1. Identify base shadcn/ui components needed (Card, Skeleton, Tooltip)
2. Determine if Recharts is suitable for bar chart
3. Evaluate need for custom gauge component (no shadcn equivalent)
4. Suggest component composition strategy

**For domain-architect**:
1. Define domain structure (dashboard vs reports domains)
2. Create repository methods for aggregated queries
3. Design custom hook signatures
4. Plan aggregation utility functions

**For nextjs-builder**:
1. Create component file structure
2. Implement data fetching with React Server Components
3. Set up React Query hooks
4. Integrate components into pages

**For parent agent**:
1. Coordinate specialized agents
2. Execute implementation plans
3. Ensure adherence to business rules
4. Validate final implementation against requirements

---

**END OF BUSINESS RULES DOCUMENT**
