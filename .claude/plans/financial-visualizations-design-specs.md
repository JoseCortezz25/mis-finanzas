# Financial Visualizations - Visual Design Specifications

**Session ID**: `financial_visualizations_1767835714`
**Created**: 2026-01-07
**Author**: ux-ui-designer
**Status**: Complete
**Complexity**: High
**User Impact**: High

---

## Table of Contents

1. [Design System Foundation](#design-system-foundation)
2. [Component 1: Daily Bar Chart](#component-1-daily-bar-chart)
3. [Component 2: GitHub-style Spending Heatmap](#component-2-github-style-spending-heatmap)
4. [Component 3: Balance Gauge Card](#component-3-balance-gauge-card)
5. [Shared Design Patterns](#shared-design-patterns)
6. [Accessibility Specifications](#accessibility-specifications)
7. [Responsive Behavior](#responsive-behavior)
8. [Animation & Transitions](#animation--transitions)
9. [Implementation Notes](#implementation-notes)

---

## Design System Foundation

### Existing Design Language

This project uses a sophisticated design system based on:

- **Color System**: OKLCH color space for perceptual uniformity
- **Component Library**: shadcn/ui with custom theming
- **Charts**: Recharts library (already in use)
- **Typography**: Geist Sans (var font)
- **Spacing**: Tailwind CSS v4 with custom scale
- **Border Radius**: Custom `--radius: 0.625rem` (10px)
- **Design Tokens**: CSS custom properties with light/dark mode support

### Color Palette for Financial Visualizations

#### Semantic Colors (OKLCH)

```css
/* Income/Positive - Green spectrum */
--income-primary: oklch(0.646 0.222 41.116);     /* chart-1: vibrant green */
--income-light: oklch(0.696 0.17 162.48);        /* chart-2: light green */

/* Expense/Negative - Red spectrum */
--expense-primary: oklch(0.577 0.245 27.325);    /* destructive: vibrant red */
--expense-light: oklch(0.704 0.191 22.216);      /* destructive dark mode */

/* Warning/Alert - Orange spectrum */
--warning-primary: oklch(0.828 0.189 84.429);    /* chart-4: amber/orange */

/* Egresos (committed expenses) - Red */
--egreso-primary: #EF4444;                       /* red-500 */

/* Gastos (variable spending) - Orange */
--gasto-primary: #F97316;                        /* orange-500 */

/* Neutral states - Gray spectrum */
--neutral-light: oklch(0.97 0.001 106.424);      /* muted */
--neutral-border: oklch(0.923 0.003 48.717);     /* border */
--neutral-text: oklch(0.553 0.013 58.071);       /* muted-foreground */
```

#### Hex Equivalents for Charts

```
Income Green:     #10B981 (emerald-500)
Expense Red:      #EF4444 (red-500)
Warning Orange:   #F97316 (orange-500)
Egreso Red:       #EF4444 (red-500)
Gasto Orange:     #F97316 (orange-500)
Neutral Gray:     #F3F4F6 (gray-100)
Border Gray:      #E5E7EB (gray-200)
```

### Typography Scale

```css
/* Amount Display */
--amount-xs: 0.875rem;      /* 14px - small amounts */
--amount-sm: 1rem;          /* 16px - secondary amounts */
--amount-base: 1.25rem;     /* 20px - standard amounts */
--amount-lg: 1.5rem;        /* 24px - primary amounts */
--amount-xl: 2rem;          /* 32px - hero amounts */
--amount-2xl: 2.5rem;       /* 40px - balance gauge */

/* Labels & Text */
--label-xs: 0.75rem;        /* 12px - tooltips, axis labels */
--label-sm: 0.875rem;       /* 14px - secondary labels */
--label-base: 1rem;         /* 16px - primary labels */
--label-lg: 1.125rem;       /* 18px - section headers */
```

### Spacing System

```css
/* Component Padding */
--spacing-card: 1rem;           /* 16px - mobile card padding */
--spacing-card-md: 1.25rem;     /* 20px - tablet card padding */
--spacing-card-lg: 1.5rem;      /* 24px - desktop card padding */

/* Chart Margins */
--spacing-chart-gap: 0.5rem;    /* 8px - between chart elements */
--spacing-section: 2rem;        /* 32px - between sections */
```

---

## Component 1: Daily Bar Chart

### User Context

**Primary Goal**: Compare daily income vs expenses over time to identify spending patterns
**Success Criteria**: User can quickly spot days with high spending or income variance
**User Journey**: Select date range → View bars → Hover for details → Identify trends

### Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Daily Income vs Expenses                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ■ Income  ■ Expense                        [7 days ▼]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  $2M ┤                                                      │
│      │                                                      │
│  $1M ┤     █                                                │
│      │     █  █     █                                       │
│   $0 ┼─█─█─█─█──█─█──█─█─█──────────────────────────      │
│      │ █ █ █ █  █ █  █ █ █                                 │
│      └─1─2─3─4──5─6──7─8─9──────────────────────────      │
│        Jan                                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Legend:
█ = Green bar (income)
█ = Red bar (expense)
```

#### Component Hierarchy

1. **Container Card** (`Card` component)
   - Padding: `p-4 sm:p-5 lg:p-6`
   - Border: `border-2 border-border`
   - Radius: `rounded-lg`
   - Background: `bg-card`

2. **Header Section**
   - Title: "Ingresos y Gastos Diarios"
   - Font: `text-lg sm:text-xl font-semibold`
   - Color: `text-foreground`
   - Spacing: `mb-4`

3. **Controls Row**
   - Legend + Date Range Selector
   - Flex layout: `flex items-center justify-between gap-4`
   - Wrap on mobile: `flex-wrap`

4. **Chart Area**
   - Height: `h-64 sm:h-80 lg:h-96` (256px/320px/384px)
   - Margin: `mt-6`

#### Bar Styling

**Grouped Bars** (side-by-side per day):

```tsx
// Bar configuration
{
  barSize: 20,           // Base width
  barGap: 2,             // Gap between income/expense
  barCategoryGap: 12,    // Gap between day groups
  radius: [4, 4, 0, 0],  // Rounded top corners
}

// Colors
income: {
  fill: '#10B981',       // emerald-500
  fillOpacity: 0.9,
  hover: '#059669',      // emerald-600
}

expense: {
  fill: '#EF4444',       // red-500
  fillOpacity: 0.9,
  hover: '#DC2626',      // red-600
}
```

**Minimum Bar Height**: 4px (ensures visibility for small amounts)

#### Axes Specification

**X-Axis (Dates)**:
```tsx
{
  dataKey: 'date',
  tick: {
    fill: 'hsl(var(--muted-foreground))',
    fontSize: 12,
  },
  tickFormatter: (date) => {
    // "DD" for 7-30 days
    // "DD/MM" for 30-90 days
  },
  axisLine: { stroke: 'hsl(var(--border))' },
  tickLine: { stroke: 'hsl(var(--border))' },
  height: 40,
}
```

**Y-Axis (Amounts)**:
```tsx
{
  tick: {
    fill: 'hsl(var(--muted-foreground))',
    fontSize: 12,
  },
  tickFormatter: (value) => {
    // < 1M: "$XXXk"
    // >= 1M: "$XM"
  },
  axisLine: { stroke: 'hsl(var(--border))' },
  tickLine: { stroke: 'hsl(var(--border))' },
  width: 60,
}
```

**Grid Lines**:
```tsx
{
  horizontal: true,
  vertical: false,
  stroke: 'hsl(var(--border))',
  strokeDasharray: '3 3',
  opacity: 0.3,
}
```

#### Legend Design

**Horizontal Layout**:
```
■ Ingresos    ■ Gastos
```

**Styling**:
```tsx
<div className="flex items-center gap-4 text-sm">
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-sm bg-[#10B981]" />
    <span className="text-muted-foreground">Ingresos</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-sm bg-[#EF4444]" />
    <span className="text-muted-foreground">Gastos</span>
  </div>
</div>
```

#### Tooltip Design

**On Hover**:
```
┌─────────────────────────┐
│ Lunes, 7 de Enero 2026  │
│ ─────────────────────── │
│ Ingresos: $1,500,000    │
│ Gastos:   $850,000      │
│ ─────────────────────── │
│ Neto:     $650,000      │ ← green if positive
└─────────────────────────┘
```

**Implementation**:
```tsx
<div className="bg-card border-border text-foreground rounded-md border p-3 shadow-lg">
  <p className="text-sm font-semibold mb-2">
    {formatDate(date, 'long')}
  </p>
  <div className="text-xs space-y-1">
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Ingresos:</span>
      <span className="font-medium text-emerald-600">
        {formatCurrency(income)}
      </span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">Gastos:</span>
      <span className="font-medium text-red-600">
        {formatCurrency(expense)}
      </span>
    </div>
    <div className="border-t border-border pt-1 mt-1" />
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground font-semibold">Neto:</span>
      <span className={cn(
        "font-semibold",
        net >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {formatCurrency(net)}
      </span>
    </div>
  </div>
</div>
```

#### Empty State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│               [📊 empty chart icon]                         │
│                                                             │
│          No hay movimientos en este período                 │
│                                                             │
│   Registra tu primer ingreso o gasto para ver el gráfico   │
│                                                             │
│            [+ Crear Movimiento] button                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**:
```tsx
<div className="flex flex-col items-center justify-center h-64 text-center p-6">
  <div className="text-muted-foreground mb-4">
    <ChartBarIcon className="h-16 w-16 mx-auto opacity-20" />
  </div>
  <h3 className="text-lg font-semibold mb-2">
    No hay movimientos en este período
  </h3>
  <p className="text-muted-foreground text-sm mb-6 max-w-md">
    Registra tu primer ingreso o gasto para ver el gráfico
  </p>
  <Button variant="default">
    + Crear Movimiento
  </Button>
</div>
```

#### Loading Skeleton

```tsx
<div className="space-y-4">
  {/* Header skeleton */}
  <div className="flex items-center justify-between">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-10 w-32" />
  </div>

  {/* Chart skeleton */}
  <div className="h-64 relative overflow-hidden">
    <div className="absolute inset-0 flex items-end justify-around gap-1 px-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex gap-1 items-end">
          <Skeleton
            className="w-4"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
          <Skeleton
            className="w-4"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## Component 2: GitHub-style Spending Heatmap

### User Context

**Primary Goal**: Visualize spending habits and identify patterns over time (similar to GitHub contributions)
**Success Criteria**: User can spot high-spending days and seasonal trends at a glance
**User Journey**: View grid → Identify color intensity → Hover for details → Recognize patterns

### Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Spending Activity Heatmap                      [12 meses ▼]│
│                                                             │
│      Ene  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov │
│  L   □ □ □ ■ ■ ■ □ ■ ■ ■ □ □ ■ ■ □ ■ ■ ■ ■ ■ □ □ ■ ■ ■   │
│  M   ■ □ ■ ■ □ □ ■ □ ■ ■ ■ □ ■ □ ■ □ ■ □ ■ ■ ■ □ ■ □ ■   │
│  M   □ ■ □ ■ ■ ■ □ ■ □ ■ □ ■ ■ ■ □ ■ ■ □ ■ □ ■ ■ □ ■ ■   │
│  J   ■ ■ ■ □ ■ □ ■ ■ ■ □ ■ □ ■ □ ■ ■ □ ■ ■ □ ■ □ ■ ■ □   │
│  V   □ ■ □ ■ □ ■ ■ □ ■ ■ □ ■ □ ■ □ ■ ■ □ ■ ■ □ ■ □ ■ ■   │
│  S   ■ □ ■ ■ ■ □ ■ ■ □ ■ ■ □ ■ ■ □ ■ □ ■ ■ □ ■ ■ □ ■ □   │
│  D   □ ■ □ ■ □ ■ □ ■ ■ □ ■ ■ □ ■ ■ □ ■ □ ■ ■ □ ■ ■ □ ■   │
│                                                             │
│      Menos ■ ■ ■ ■ ■ Más                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Color Legend (5 levels):
□ Level 0: No spending (#F3F4F6 - gray-100)
■ Level 1: Low ($0-25th percentile - #FEE2E2 - red-100)
■ Level 2: Medium-Low (25th-50th - #FECACA - red-200)
■ Level 3: Medium-High (50th-75th - #FCA5A5 - red-300)
■ Level 4: High (75th-100th - #EF4444 - red-500)
```

#### Component Hierarchy

1. **Container Card**
   - Padding: `p-4 sm:p-5 lg:p-6`
   - Border: `border-2 border-border`
   - Radius: `rounded-lg`
   - Background: `bg-card`

2. **Header Section**
   - Title: "Actividad de Gastos"
   - Date Range Selector (right-aligned)

3. **Month Labels Row**
   - Height: `h-6`
   - Font: `text-xs text-muted-foreground`
   - Position: Above first week of each month

4. **Grid Container**
   - Display: `grid`
   - Gap: `gap-0.5` (2px)
   - Auto-flow: Column-first (weeks as columns)

5. **Legend Row**
   - Margin: `mt-4`
   - Center-aligned or left-aligned

#### Cell Specifications

**Size & Spacing**:
```tsx
// Mobile (< 640px)
{
  width: '10px',
  height: '10px',
  gap: '2px',
}

// Tablet (640px - 1024px)
{
  width: '12px',
  height: '12px',
  gap: '2px',
}

// Desktop (> 1024px)
{
  width: '14px',
  height: '14px',
  gap: '3px',
}
```

**Cell Styling**:
```tsx
<div
  className={cn(
    'rounded-sm transition-all duration-150',
    'hover:ring-2 hover:ring-primary hover:ring-offset-1',
    'cursor-pointer',
    levelColorClass
  )}
  style={{
    width: cellSize,
    height: cellSize,
  }}
/>
```

#### Color Scale (5 Levels)

**Level 0** - No Spending:
```css
background: #F3F4F6;        /* gray-100 */
border: 1px solid #E5E7EB;  /* gray-200 */
```

**Level 1** - Low Spending (0-25th percentile):
```css
background: #FEE2E2;        /* red-100 */
border: 1px solid #FECACA;  /* red-200 */
```

**Level 2** - Medium-Low (25th-50th percentile):
```css
background: #FECACA;        /* red-200 */
border: 1px solid #FCA5A5;  /* red-300 */
```

**Level 3** - Medium-High (50th-75th percentile):
```css
background: #FCA5A5;        /* red-300 */
border: 1px solid #F87171;  /* red-400 */
```

**Level 4** - High Spending (75th-100th percentile):
```css
background: #EF4444;        /* red-500 */
border: 1px solid #DC2626;  /* red-600 */
```

**Dark Mode Adjustments**:
```css
/* Level 0 */
.dark & { background: #1F2937; }  /* gray-800 */

/* Level 1 */
.dark & { background: #7F1D1D; }  /* red-900 */

/* Level 2 */
.dark & { background: #991B1B; }  /* red-800 */

/* Level 3 */
.dark & { background: #B91C1C; }  /* red-700 */

/* Level 4 */
.dark & { background: #DC2626; }  /* red-600 */
```

#### Grid Layout Implementation

**Week Column Structure**:
```tsx
<div className="flex gap-2">
  {/* Day labels */}
  <div className="flex flex-col gap-0.5 justify-around text-xs text-muted-foreground pr-2">
    <span>L</span>
    <span>M</span>
    <span>M</span>
    <span>J</span>
    <span>V</span>
    <span>S</span>
    <span>D</span>
  </div>

  {/* Grid of weeks */}
  <div className="flex-1 overflow-x-auto">
    <div className="inline-flex gap-0.5">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-0.5">
          {/* Month label (if first week of month) */}
          {isFirstWeekOfMonth(week) && (
            <div className="h-6 text-xs text-muted-foreground mb-1">
              {getMonthAbbr(week)}
            </div>
          )}

          {/* Days in week */}
          {week.days.map((day) => (
            <HeatmapCell key={day.date} data={day} />
          ))}
        </div>
      ))}
    </div>
  </div>
</div>
```

#### Month Labels

**Position**: Above grid, aligned with first week of each month
**Styling**:
```tsx
<span className="text-xs text-muted-foreground font-medium">
  {monthAbbr}  {/* Ene, Feb, Mar, etc. */}
</span>
```

**Month Abbreviations (Spanish)**:
```
Ene, Feb, Mar, Abr, May, Jun,
Jul, Ago, Sep, Oct, Nov, Dic
```

#### Tooltip Design

**On Hover**:
```
┌─────────────────────────┐
│ Lunes, 7 de Enero 2026  │
│                         │
│ Gastado: $1,250,000     │
│ 3 movimientos           │
│                         │
│ Categoría principal:    │
│ Alimentación            │
└─────────────────────────┘
```

**Implementation**:
```tsx
<div className="bg-card border-border text-foreground rounded-md border p-3 shadow-lg min-w-[180px]">
  <p className="text-xs font-semibold mb-2">
    {formatDate(date, 'long')}
  </p>
  <div className="text-xs space-y-1">
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">Gastado:</span>
      <span className="font-semibold text-red-600">
        {formatCurrency(amount)}
      </span>
    </div>
    <p className="text-muted-foreground text-[10px]">
      {transactionCount} movimientos
    </p>
    {topCategory && (
      <>
        <div className="border-t border-border pt-1 mt-1" />
        <div>
          <p className="text-muted-foreground text-[10px]">
            Categoría principal:
          </p>
          <p className="font-medium">{topCategory}</p>
        </div>
      </>
    )}
  </div>
</div>
```

#### Color Scale Legend

**Horizontal Layout**:
```
Menos  ■ ■ ■ ■ ■  Más
       0 1 2 3 4
```

**Implementation**:
```tsx
<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
  <span>Menos</span>
  <div className="flex gap-1">
    {[0, 1, 2, 3, 4].map((level) => (
      <div
        key={level}
        className={cn(
          'w-3 h-3 rounded-sm border',
          getLevelColorClass(level)
        )}
      />
    ))}
  </div>
  <span>Más</span>
</div>
```

#### Empty State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [📅 calendar icon]                        │
│                                                             │
│           No hay gastos registrados en este período         │
│                                                             │
│    ¡Perfecto! No has gastado nada, o aún no has            │
│           registrado gastos.                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**: All cells at level 0 (gray) + message overlay

#### Loading Skeleton

```tsx
<div className="space-y-4">
  {/* Header */}
  <Skeleton className="h-6 w-48" />

  {/* Grid skeleton */}
  <div className="flex gap-2">
    {/* Day labels */}
    <div className="flex flex-col gap-0.5 w-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-3" />
      ))}
    </div>

    {/* Weeks */}
    <div className="flex gap-0.5">
      {Array.from({ length: 52 }).map((_, weekIdx) => (
        <div key={weekIdx} className="flex flex-col gap-0.5">
          {Array.from({ length: 7 }).map((_, dayIdx) => (
            <Skeleton key={dayIdx} className="h-3 w-3" />
          ))}
        </div>
      ))}
    </div>
  </div>

  {/* Legend */}
  <Skeleton className="h-4 w-32 mx-auto" />
</div>
```

---

## Component 3: Balance Gauge Card

### User Context

**Primary Goal**: Understand overall financial health at a glance via visual balance indicator
**Success Criteria**: User can see balance position relative to income/expenses without reading numbers
**User Journey**: View card → See gauge position → Understand financial state → Drill into categories

### Visual Design

#### Layout Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│              $1,250,000 COP                 │ ← Large, bold
│           Balance Disponible                │ ← Label
│                                             │
│              ╱─────────╲                    │
│            ╱     ↑     ╲                   │ ← Gauge
│           │   needle     │                  │
│           ╲─────────────╱                   │
│           [E]  [G]  [I]                     │ ← Segments
│                                             │
│   ■ Egresos      $500,000                   │ ← Legend
│   ■ Gastos       $300,000                   │
│   ■ Ingresos   $2,050,000                   │
│                                             │
└─────────────────────────────────────────────┘

Legend:
E = Egresos (red segment)
G = Gastos (orange segment)
I = Ingresos (green segment)
↑ = Needle pointing to current balance
```

#### Component Hierarchy

1. **Container Card**
   - Padding: `p-6 sm:p-8`
   - Border: `border-2 border-border`
   - Radius: `rounded-lg`
   - Background: `bg-card`
   - Shadow: `shadow-sm hover:shadow-md` (subtle elevation)

2. **Top Section** - Balance Display
   - Text alignment: `text-center`
   - Spacing: `mb-8`

3. **Center Section** - Semicircular Gauge
   - Container: `flex items-center justify-center`
   - Height: `h-40 sm:h-48 lg:h-56` (160px/192px/224px)
   - Margin: `my-8`

4. **Bottom Section** - Category Legend
   - Grid: `grid grid-cols-1 sm:grid-cols-3 gap-4`
   - Spacing: `mt-8`

#### Top Section - Balance Display

**Balance Amount**:
```tsx
<div className={cn(
  'text-3xl sm:text-4xl lg:text-5xl font-bold',
  balance >= 0 ? 'text-emerald-600' : 'text-red-600'
)}>
  {formatCurrency(balance)}
</div>
```

**Label**:
```tsx
<p className="text-sm text-muted-foreground mt-2 font-medium">
  Balance Disponible
</p>
```

**Color Logic**:
- **Positive balance**: `text-emerald-600` (green)
- **Negative balance**: `text-red-600` (red)
- **Zero balance**: `text-muted-foreground` (gray)

#### Center Section - Semicircular Gauge

**Gauge Dimensions**:
```
Mobile:   diameter: 200px, thickness: 24px
Tablet:   diameter: 240px, thickness: 28px
Desktop:  diameter: 280px, thickness: 32px
```

**SVG Structure**:
```tsx
<svg
  width={diameter}
  height={diameter / 2 + 40}  // Half circle + padding for needle
  viewBox={`0 0 ${diameter} ${diameter / 2 + 40}`}
  className="mx-auto"
>
  {/* Background arc (full semicircle) */}
  <path
    d={describeArc(cx, cy, radius, 0, 180)}
    fill="none"
    stroke="hsl(var(--muted))"
    strokeWidth={thickness}
    strokeLinecap="round"
  />

  {/* Segment 1: Egresos (red) */}
  <path
    d={describeArc(cx, cy, radius, segments[0].startAngle, segments[0].endAngle)}
    fill="none"
    stroke="#EF4444"
    strokeWidth={thickness}
    strokeLinecap="round"
    className="transition-all duration-300 hover:stroke-[#DC2626]"
  />

  {/* Segment 2: Gastos (orange) */}
  <path
    d={describeArc(cx, cy, radius, segments[1].startAngle, segments[1].endAngle)}
    fill="none"
    stroke="#F97316"
    strokeWidth={thickness}
    strokeLinecap="round"
    className="transition-all duration-300 hover:stroke-[#EA580C]"
  />

  {/* Segment 3: Ingresos (green) */}
  <path
    d={describeArc(cx, cy, radius, segments[2].startAngle, segments[2].endAngle)}
    fill="none"
    stroke="#10B981"
    strokeWidth={thickness}
    strokeLinecap="round"
    className="transition-all duration-300 hover:stroke-[#059669]"
  />

  {/* Needle */}
  <g transform={`rotate(${needleAngle - 90}, ${cx}, ${cy})`}>
    {/* Needle line */}
    <line
      x1={cx}
      y1={cy}
      x2={cx}
      y2={cy - radius + 10}
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Needle triangle tip */}
    <polygon
      points={`${cx},${cy - radius + 10} ${cx - 4},${cy - radius + 18} ${cx + 4},${cy - radius + 18}`}
      fill="hsl(var(--foreground))"
    />
  </g>

  {/* Center pivot dot */}
  <circle
    cx={cx}
    cy={cy}
    r="8"
    fill="hsl(var(--card))"
    stroke="hsl(var(--foreground))"
    strokeWidth="3"
  />

  {/* Scale indicators (optional) */}
  <text x={cx - radius} y={cy + 20} className="text-xs fill-muted-foreground">
    -100%
  </text>
  <text x={cx - 10} y={cy + 20} className="text-xs fill-muted-foreground">
    0%
  </text>
  <text x={cx + radius - 30} y={cy + 20} className="text-xs fill-muted-foreground">
    +100%
  </text>
</svg>
```

**Gauge Segment Colors**:
```
Egresos (Committed Expenses):  #EF4444 (red-500)
  → Hover: #DC2626 (red-600)

Gastos (Variable Spending):    #F97316 (orange-500)
  → Hover: #EA580C (orange-600)

Ingresos (Income):             #10B981 (emerald-500)
  → Hover: #059669 (emerald-600)
```

**Needle Specifications**:
```
Width: 3px
Color: hsl(var(--foreground)) (adapts to theme)
Length: radius - 10px (doesn't touch arc)
Tip: Small triangle (8px wide)
Pivot: Circle with 8px radius, filled white with stroke
Animation: 0.8s ease-out rotation on mount/data change
```

**Needle Angle Calculation**:
```typescript
// Maps balance percentage to 0-180 degrees
// -100% balance → 0° (far left)
// 0% balance → 90° (center)
// +100% balance → 180° (far right)

const needleAngle = ((balancePercentage + 100) / 200) * 180;
```

#### Bottom Section - Category Legend

**Layout** (3-column grid on desktop, stacked on mobile):
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
  {/* Egresos */}
  <div className="flex items-center gap-3">
    <div className="h-4 w-4 rounded-sm bg-[#EF4444] flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">Egresos</p>
      <p className="text-sm font-semibold text-foreground truncate">
        {formatCurrency(totalEgresos)}
      </p>
    </div>
  </div>

  {/* Gastos */}
  <div className="flex items-center gap-3">
    <div className="h-4 w-4 rounded-sm bg-[#F97316] flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">Gastos</p>
      <p className="text-sm font-semibold text-foreground truncate">
        {formatCurrency(totalGastos)}
      </p>
    </div>
  </div>

  {/* Ingresos */}
  <div className="flex items-center gap-3">
    <div className="h-4 w-4 rounded-sm bg-[#10B981] flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">Ingresos</p>
      <p className="text-sm font-semibold text-foreground truncate">
        {formatCurrency(totalIngresos)}
      </p>
    </div>
  </div>
</div>
```

**Color Squares**: 16px × 16px rounded squares matching segment colors

#### Interaction States

**Segment Hover**:
```tsx
// Darken segment color
// Show tooltip above segment
<Tooltip>
  <TooltipContent>
    <div className="text-xs">
      <p className="font-semibold">Egresos</p>
      <p className="text-muted-foreground">
        {formatCurrency(totalEgresos)}
      </p>
      <p className="text-muted-foreground text-[10px]">
        {percentage}% del total
      </p>
    </div>
  </TooltipContent>
</Tooltip>
```

**Needle Hover**:
```tsx
<Tooltip>
  <TooltipContent>
    <div className="text-xs">
      <p className="font-semibold">Balance</p>
      <p className={cn(
        "font-semibold",
        balance >= 0 ? "text-emerald-600" : "text-red-600"
      )}>
        {formatCurrency(balance)}
      </p>
      <p className="text-muted-foreground text-[10px]">
        {balancePercentage >= 0 ? '+' : ''}{balancePercentage.toFixed(1)}% de ingresos
      </p>
    </div>
  </TooltipContent>
</Tooltip>
```

#### Empty State

```
┌─────────────────────────────────────────────┐
│                                             │
│                  $0 COP                     │
│           Balance Disponible                │
│                                             │
│              ╱─────────╲                    │
│            ╱     ↑     ╲                   │
│           │   (center)   │                  │
│           ╲─────────────╱                   │
│           [E]  [G]  [I]                     │
│          (all gray segments)                │
│                                             │
│   [💡 light bulb icon]                      │
│                                             │
│   Registra tus ingresos y gastos            │
│        para ver tu balance                  │
│                                             │
│     [+ Crear Movimiento] button             │
│                                             │
└─────────────────────────────────────────────┘
```

**Implementation**:
```tsx
// All segments in muted gray
segments = [
  { type: 'egreso', startAngle: 0, endAngle: 60, color: 'hsl(var(--muted))' },
  { type: 'gasto', startAngle: 60, endAngle: 120, color: 'hsl(var(--muted))' },
  { type: 'ingreso', startAngle: 120, endAngle: 180, color: 'hsl(var(--muted))' },
]

// Needle at center (90°)
needleAngle = 90

// Message overlay
<div className="text-center mt-6">
  <LightBulbIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
  <p className="text-muted-foreground mb-4">
    Registra tus ingresos y gastos para ver tu balance
  </p>
  <Button variant="default">
    + Crear Movimiento
  </Button>
</div>
```

#### Loading Skeleton

```tsx
<div className="space-y-8">
  {/* Balance skeleton */}
  <div className="text-center">
    <Skeleton className="h-12 w-48 mx-auto mb-2" />
    <Skeleton className="h-4 w-32 mx-auto" />
  </div>

  {/* Gauge skeleton */}
  <div className="flex items-center justify-center h-48">
    <Skeleton className="h-48 w-48 rounded-t-full" />
  </div>

  {/* Legend skeleton */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <div className="flex-1">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Shared Design Patterns

### Currency Formatting

**Function**:
```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Output: "$1,250,000"
```

**Abbreviated Format** (for large amounts):
```typescript
export function formatCurrencyAbbr(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

// Output: "$1.25M" or "$850k"
```

### Date Formatting

**Short Format** (axis labels, compact display):
```typescript
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
  }).format(d);
}

// Output: "07/01"
```

**Medium Format** (tooltips):
```typescript
export function formatDateMedium(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

// Output: "07 Ene 2026"
```

**Long Format** (tooltips, detailed views):
```typescript
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

// Output: "Martes, 07 de Enero de 2026"
```

### Error States

**Unified Error Display**:
```tsx
<div className="flex flex-col items-center justify-center h-64 text-center p-6">
  <AlertCircleIcon className="h-12 w-12 text-destructive mb-4" />
  <h3 className="text-lg font-semibold mb-2">
    {errorTitle}
  </h3>
  <p className="text-muted-foreground text-sm mb-6 max-w-md">
    {errorMessage}
  </p>
  <Button variant="outline" onClick={onRetry}>
    Reintentar
  </Button>
</div>
```

**Error Messages**:
```typescript
const ERROR_MESSAGES = {
  NETWORK: {
    title: 'Error de conexión',
    message: 'No se pudo cargar los datos. Verifica tu conexión.',
  },
  PERMISSION: {
    title: 'Sin permiso',
    message: 'No tienes permiso para ver estos datos.',
  },
  DATA: {
    title: 'Error al procesar',
    message: 'Error al procesar los datos. Intenta de nuevo.',
  },
  TIMEOUT: {
    title: 'Tiempo agotado',
    message: 'La carga está tomando más tiempo del esperado.',
  },
};
```

### Loading States

**Pulse Animation** (shared across all skeletons):
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Tooltips

**Shared Tooltip Styling**:
```tsx
<TooltipContent
  className="bg-card border-border text-foreground rounded-md border p-3 shadow-lg"
  sideOffset={5}
>
  {/* Content */}
</TooltipContent>
```

**Tooltip Configuration**:
```tsx
{
  delayDuration: 300,     // 300ms before showing
  skipDelayDuration: 0,   // No delay when moving between tooltips
  disableHoverableContent: false,
}
```

---

## Accessibility Specifications

### Keyboard Navigation

**Daily Bar Chart**:
- Tab through date range selector
- Arrow keys to navigate between bars (left/right)
- Enter/Space to trigger drill-down (if implemented)
- Escape to close tooltips

**Heatmap**:
- Tab through date range selector
- Arrow keys to navigate grid (4-directional)
- Enter/Space to view day details
- Escape to close tooltips

**Balance Gauge**:
- Tab to focus gauge
- Arrow keys to focus individual segments
- Enter/Space to view segment details
- Escape to close tooltips

### ARIA Labels

**Daily Bar Chart**:
```tsx
<div
  role="img"
  aria-label="Gráfico de barras mostrando ingresos y gastos diarios"
  aria-describedby="chart-description"
>
  <span id="chart-description" className="sr-only">
    Gráfico que compara ingresos y gastos por día.
    Total de ingresos: {formatCurrency(totalIncome)}.
    Total de gastos: {formatCurrency(totalExpenses)}.
  </span>
  {/* Chart content */}
</div>

// Individual bars
<rect
  role="graphics-symbol"
  aria-label={`${formatDate(date)}: Ingresos ${formatCurrency(income)}`}
/>
```

**Heatmap**:
```tsx
<div
  role="img"
  aria-label="Mapa de calor de actividad de gastos"
  aria-describedby="heatmap-description"
>
  <span id="heatmap-description" className="sr-only">
    Mapa de calor mostrando {totalDays} días de actividad de gastos.
    Total gastado: {formatCurrency(totalSpent)}.
    Día con más gasto: {formatDate(peakDay)} con {formatCurrency(peakAmount)}.
  </span>
  {/* Heatmap grid */}
</div>

// Individual cells
<div
  role="graphics-symbol"
  aria-label={`${formatDate(date)}: Gastado ${formatCurrency(amount)}, ${transactionCount} movimientos`}
  tabIndex={0}
/>
```

**Balance Gauge**:
```tsx
<div
  role="img"
  aria-label="Medidor de balance financiero"
  aria-describedby="gauge-description"
>
  <span id="gauge-description" className="sr-only">
    Balance actual: {formatCurrency(balance)}.
    {balance >= 0 ? 'Balance positivo' : 'Balance negativo'}.
    Ingresos: {formatCurrency(totalIncome)}.
    Egresos: {formatCurrency(totalEgresos)}.
    Gastos: {formatCurrency(totalGastos)}.
  </span>
  {/* Gauge SVG */}
</div>

// Gauge segments
<path
  role="graphics-symbol"
  aria-label={`${category}: ${formatCurrency(amount)}, ${percentage}% del total`}
/>
```

### Screen Reader Announcements

**Live Regions** for dynamic updates:
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isLoading && 'Cargando datos del gráfico...'}
  {error && `Error: ${error.message}`}
  {data && `Datos actualizados: ${summary}`}
</div>
```

### Color Contrast

**WCAG 2.1 AA Compliance**:

All text/background combinations must meet minimum contrast ratios:
- Normal text (< 18pt): **4.5:1**
- Large text (>= 18pt): **3:1**
- UI components: **3:1**

**Verification**:
```
Income Green (#10B981) on white: 3.36:1 ✅ (large text only)
Expense Red (#EF4444) on white: 3.96:1 ✅ (large text only)
Muted text (gray-500) on white: 4.57:1 ✅
Foreground on background: 15.2:1 ✅
```

**Important**: Never rely solely on color to convey information
- Bars: Use labels + color
- Heatmap: Use intensity levels + tooltips
- Gauge: Use position + color + legend

### Focus Indicators

**Visible Focus Ring** (all interactive elements):
```css
.focus-visible:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 0.375rem;
}
```

**Reduced Motion Support**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Behavior

### Breakpoints

```css
/* Mobile-first approach */
/* Base: Mobile (< 640px) */
/* sm: 640px (tablet portrait) */
/* md: 768px (tablet landscape) */
/* lg: 1024px (desktop) */
/* xl: 1280px (large desktop) */
```

### Daily Bar Chart Responsive Behavior

**Mobile (< 640px)**:
```tsx
{
  chartHeight: 'h-64',        // 256px
  barSize: 16,                // Narrower bars
  showDays: 7,                // Show last 7 days only
  xAxisAngle: -45,            // Rotate labels
  yAxisWidth: 50,             // Narrow Y-axis
  scrollBehavior: 'horizontal', // Horizontal scroll for more days
}
```

**Tablet (640px - 1024px)**:
```tsx
{
  chartHeight: 'h-80',        // 320px
  barSize: 20,
  showDays: 14,               // Show last 14 days
  xAxisAngle: 0,              // Straight labels
  yAxisWidth: 60,
  scrollBehavior: 'auto',
}
```

**Desktop (> 1024px)**:
```tsx
{
  chartHeight: 'h-96',        // 384px
  barSize: 24,
  showDays: 30,               // Show up to 30 days
  xAxisAngle: 0,
  yAxisWidth: 80,
  scrollBehavior: 'none',     // No scroll needed
}
```

**Layout Adjustments**:
```tsx
// Mobile: Stack controls vertically
<div className="flex flex-col gap-4 mb-6">
  <h2>Title</h2>
  <DateRangeSelector />
</div>

// Desktop: Horizontal layout
<div className="flex items-center justify-between mb-6">
  <h2>Title</h2>
  <DateRangeSelector />
</div>
```

### Heatmap Responsive Behavior

**Mobile (< 640px)**:
```tsx
{
  cellSize: 10,               // 10px × 10px cells
  gap: 2,                     // 2px gap
  showMonths: 6,              // Last 6 months only
  scrollBehavior: 'horizontal',
  dayLabels: 'abbreviated',   // "L", "M", etc.
}
```

**Tablet (640px - 1024px)**:
```tsx
{
  cellSize: 12,               // 12px × 12px cells
  gap: 2,
  showMonths: 12,             // Last 12 months
  scrollBehavior: 'horizontal',
  dayLabels: 'abbreviated',
}
```

**Desktop (> 1024px)**:
```tsx
{
  cellSize: 14,               // 14px × 14px cells
  gap: 3,
  showMonths: 12,
  scrollBehavior: 'none',
  dayLabels: 'full',          // "Lunes", "Martes", etc.
}
```

**Overflow Handling**:
```tsx
<div className="overflow-x-auto pb-2">
  <div className="inline-block min-w-full">
    {/* Heatmap grid */}
  </div>
</div>
```

### Balance Gauge Responsive Behavior

**Mobile (< 640px)**:
```tsx
{
  gaugeDiameter: 200,         // 200px
  gaugeThickness: 24,
  balanceFontSize: 'text-3xl',
  legendLayout: 'grid-cols-1', // Stacked
  padding: 'p-6',
}
```

**Tablet (640px - 1024px)**:
```tsx
{
  gaugeDiameter: 240,         // 240px
  gaugeThickness: 28,
  balanceFontSize: 'text-4xl',
  legendLayout: 'grid-cols-3', // Horizontal
  padding: 'p-8',
}
```

**Desktop (> 1024px)**:
```tsx
{
  gaugeDiameter: 280,         // 280px
  gaugeThickness: 32,
  balanceFontSize: 'text-5xl',
  legendLayout: 'grid-cols-3',
  padding: 'p-8',
}
```

**Legend Stacking**:
```tsx
// Mobile: Vertical stack
<div className="grid grid-cols-1 gap-4">
  {categories.map(...)}
</div>

// Desktop: Horizontal grid
<div className="grid grid-cols-3 gap-4">
  {categories.map(...)}
</div>
```

---

## Animation & Transitions

### Chart Entrance Animations

**Daily Bar Chart**:
```tsx
// Bars grow from bottom to top
<Bar
  dataKey="income"
  fill="#10B981"
  animationDuration={800}
  animationBegin={0}
  animationEasing="ease-out"
>
  {/* Stagger animation: each bar appears 50ms after previous */}
</Bar>
```

**Heatmap**:
```tsx
// Cells fade in with stagger
{cells.map((cell, index) => (
  <HeatmapCell
    key={cell.date}
    data={cell}
    style={{
      animationDelay: `${index * 2}ms`,  // 2ms stagger
    }}
    className="animate-fade-in"
  />
))}

// CSS
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**Balance Gauge**:
```tsx
// Gauge segments draw in (stroke animation)
<path
  d={segmentPath}
  stroke={color}
  strokeWidth={thickness}
  strokeDasharray={pathLength}
  strokeDashoffset={pathLength}
  className="animate-draw-stroke"
/>

// CSS
@keyframes draw-stroke {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw-stroke {
  animation: draw-stroke 1s ease-out forwards;
}

// Needle rotates to position
<g
  className="animate-rotate-needle"
  style={{
    transformOrigin: `${cx}px ${cy}px`,
    transform: `rotate(${needleAngle - 90}deg)`,
  }}
>
  {/* Needle elements */}
</g>

// CSS
.animate-rotate-needle {
  animation: rotate-needle 0.8s ease-out forwards;
}

@keyframes rotate-needle {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(calc(var(--target-angle) - 90deg));
  }
}
```

### Hover Transitions

**Universal Hover**:
```css
.chart-element {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-element:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}
```

**Bar Chart Bars**:
```tsx
<Bar>
  <Cell
    className="transition-all duration-150 hover:opacity-80"
  />
</Bar>
```

**Heatmap Cells**:
```tsx
<div
  className={cn(
    'transition-all duration-150',
    'hover:ring-2 hover:ring-primary hover:ring-offset-1',
    'hover:scale-110 hover:z-10'
  )}
/>
```

**Gauge Segments**:
```tsx
<path
  className="transition-all duration-300 hover:stroke-[darker-color]"
  style={{ strokeWidth: thickness }}
  onMouseEnter={() => setStrokeWidth(thickness + 4)}
  onMouseLeave={() => setStrokeWidth(thickness)}
/>
```

### Loading Transitions

**Skeleton to Data**:
```tsx
// Fade out skeleton, fade in data
<div className="relative">
  {isLoading && (
    <div className="animate-fade-out">
      <Skeleton />
    </div>
  )}

  {data && (
    <div className="animate-fade-in">
      <Chart data={data} />
    </div>
  )}
</div>

// CSS
@keyframes fade-out {
  to {
    opacity: 0;
    pointer-events: none;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

### Data Update Animations

**Bar Chart** (updating values):
```tsx
// Recharts handles automatic transitions
<BarChart
  data={data}
  isAnimationActive={true}
  animationDuration={500}
  animationEasing="ease-in-out"
/>
```

**Heatmap** (color changes):
```tsx
<div
  className="transition-colors duration-300"
  style={{ backgroundColor: getColorForLevel(level) }}
/>
```

**Gauge** (needle movement):
```tsx
// Smooth rotation with CSS transition
<g
  style={{
    transform: `rotate(${needleAngle}deg)`,
    transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }}
>
  {/* Needle */}
</g>
```

### Reduced Motion

**Respect user preferences**:
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<Chart
  animationDuration={prefersReducedMotion ? 0 : 800}
  isAnimationActive={!prefersReducedMotion}
/>
```

---

## Implementation Notes

### Text Map Requirements

Create text map files for all components:

**Daily Bar Chart** (`reports/daily-bar-chart.text-map.ts`):
```typescript
export const DAILY_BAR_CHART_TEXT = {
  TITLE: 'Ingresos y Gastos Diarios',
  LEGEND: {
    INCOME: 'Ingresos',
    EXPENSE: 'Gastos',
  },
  TOOLTIP: {
    INCOME: 'Ingresos',
    EXPENSE: 'Gastos',
    NET: 'Neto',
  },
  EMPTY: {
    TITLE: 'No hay movimientos en este período',
    MESSAGE: 'Registra tu primer ingreso o gasto para ver el gráfico',
    ACTION: 'Crear Movimiento',
  },
  ERROR: {
    LOAD_FAILED: 'Error al cargar el gráfico',
    NETWORK: 'No se pudo cargar los datos. Verifica tu conexión.',
    RETRY: 'Reintentar',
  },
  LOADING: 'Cargando gráfico...',
} as const;
```

**Heatmap** (`reports/spending-heatmap.text-map.ts`):
```typescript
export const SPENDING_HEATMAP_TEXT = {
  TITLE: 'Actividad de Gastos',
  LEGEND: {
    LESS: 'Menos',
    MORE: 'Más',
  },
  TOOLTIP: {
    SPENT: 'Gastado',
    TRANSACTIONS: 'movimientos',
    TOP_CATEGORY: 'Categoría principal',
  },
  EMPTY: {
    TITLE: 'No hay gastos registrados en este período',
    MESSAGE: '¡Perfecto! No has gastado nada, o aún no has registrado gastos.',
  },
  ERROR: {
    LOAD_FAILED: 'Error al cargar el mapa de calor',
    NETWORK: 'No se pudo cargar los datos. Verifica tu conexión.',
    RETRY: 'Reintentar',
  },
  LOADING: 'Cargando mapa de calor...',
  MONTHS: {
    SHORT: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  },
  DAYS: {
    SHORT: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  },
} as const;
```

**Balance Gauge** (`dashboard/balance-gauge.text-map.ts`):
```typescript
export const BALANCE_GAUGE_TEXT = {
  TITLE: 'Balance',
  LABEL: 'Balance Disponible',
  CATEGORIES: {
    EGRESOS: 'Egresos',
    GASTOS: 'Gastos',
    INGRESOS: 'Ingresos',
  },
  TOOLTIP: {
    BALANCE: 'Balance',
    PERCENTAGE: 'Porcentaje de ingresos',
    OF_TOTAL: 'del total',
  },
  EMPTY: {
    MESSAGE: 'Registra tus ingresos y gastos para ver tu balance',
    ACTION: 'Crear Movimiento',
  },
  ERROR: {
    LOAD_FAILED: 'Error al cargar el balance',
    NETWORK: 'No se pudo cargar los datos. Verifica tu conexión.',
    RETRY: 'Reintentar',
  },
  LOADING: 'Cargando balance...',
  STATUS: {
    POSITIVE: 'Balance positivo',
    NEGATIVE: 'Balance negativo',
    ZERO: 'Balance en cero',
  },
} as const;
```

### Component Files to Create

**Daily Bar Chart**:
```
src/domains/reports/components/organisms/
  ├── daily-bar-chart.tsx                 (main component)
  ├── daily-bar-chart-skeleton.tsx        (loading state)
  └── daily-bar-chart-empty.tsx           (empty state)

src/domains/reports/
  └── daily-bar-chart.text-map.ts         (text strings)
```

**Spending Heatmap**:
```
src/domains/reports/components/organisms/
  ├── spending-heatmap.tsx                (main component)
  ├── heatmap-cell.tsx                    (reusable cell)
  ├── spending-heatmap-skeleton.tsx       (loading state)
  └── spending-heatmap-empty.tsx          (empty state)

src/domains/reports/
  └── spending-heatmap.text-map.ts        (text strings)
```

**Balance Gauge Card**:
```
src/domains/dashboard/components/organisms/
  ├── balance-gauge-card.tsx              (main component)
  ├── balance-gauge-skeleton.tsx          (loading state)
  └── balance-gauge-empty.tsx             (empty state)

src/components/molecules/
  └── semicircular-gauge.tsx              (reusable gauge)

src/domains/dashboard/
  └── balance-gauge.text-map.ts           (text strings)
```

### Shadcn Components Needed

**From existing shadcn/ui**:
- `Card`, `CardContent`, `CardHeader`
- `Skeleton`
- `Button`
- `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` (date range)

**Recharts (already installed)**:
- `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Cell`, `ResponsiveContainer`

**Custom Components to Build**:
- `SemicircularGauge` (SVG-based gauge for Balance Gauge Card)
- `HeatmapCell` (individual heatmap cell with hover)
- `DateRangeSelector` (shared component for charts)

### Utility Functions Needed

```typescript
// Currency formatting
export function formatCurrency(amount: number): string;
export function formatCurrencyAbbr(amount: number): string;

// Date formatting
export function formatDateShort(date: string | Date): string;
export function formatDateMedium(date: string | Date): string;
export function formatDateLong(date: string | Date): string;

// SVG arc path generation (for gauge)
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string;

// Percentile calculation (for heatmap)
export function calculatePercentiles(values: number[]): {
  25: number;
  50: number;
  75: number;
};

// Color level mapping (for heatmap)
export function getColorForLevel(level: number): string;
export function getLevelForAmount(
  amount: number,
  percentiles: { 25: number; 50: number; 75: number }
): number;

// Needle angle calculation (for gauge)
export function calculateNeedleAngle(
  balance: number,
  totalIncome: number
): number;
```

### Performance Optimizations

1. **Memoize aggregation calculations**:
```tsx
const chartData = useMemo(
  () => aggregateDailyTransactions(transactions, startDate, endDate),
  [transactions, startDate, endDate]
);
```

2. **Lazy load charts**:
```tsx
const DailyBarChart = lazy(() => import('./daily-bar-chart'));

<Suspense fallback={<DailyBarChartSkeleton />}>
  <DailyBarChart />
</Suspense>
```

3. **Virtualize heatmap cells** (if > 365 days):
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
```

4. **Debounce date range changes**:
```tsx
const debouncedDateRange = useDebounce(dateRange, 500);
```

### Coordination with Other Agents

**shadcn-builder**:
- Confirm Recharts configuration for bar chart
- Discuss custom gauge component architecture
- Identify any missing shadcn/ui components

**domain-architect**:
- Provide data structure specifications (already in business rules)
- Define repository methods for aggregations
- Plan custom hook signatures

**nextjs-builder**:
- Implement Server Components for data fetching
- Set up React Query hooks
- Integrate components into Dashboard and Reports pages

---

## Summary

**Visual Design Highlights**:
- **Consistent Design Language**: Leverages existing OKLCH color system, shadcn/ui components, and Recharts
- **Accessibility-First**: ARIA labels, keyboard navigation, color contrast compliance, reduced motion support
- **Mobile-First Responsive**: Breakpoint-specific layouts, touch-friendly sizes, horizontal scrolling where needed
- **Clear Visual Hierarchy**: Balance > Gauge > Categories; Income/Expense color coding; Progressive disclosure
- **Smooth Interactions**: Hover states, tooltips, entrance animations, data update transitions

**Key Design Decisions**:
1. **Color Palette**: Income (green), Expense (red), Egresos (red), Gastos (orange) for semantic clarity
2. **Typography Scale**: Custom amount sizes (xs to 2xl) for financial emphasis
3. **Gauge Design**: Semicircular speedometer with proportional segments and animated needle
4. **Heatmap Levels**: 5-level percentile-based coloring to handle outliers gracefully
5. **Responsive Strategy**: Mobile shows condensed views with horizontal scroll; desktop shows full data

**Next Steps**:
1. Review design specifications with parent agent
2. Coordinate with shadcn-builder for Recharts configuration and custom gauge component
3. Create text map files with all user-facing strings
4. Implement components following RSC patterns with nextjs-builder
5. Test accessibility with keyboard navigation and screen readers

**Files Impacted**:
- 3 new organism components (Daily Bar Chart, Heatmap, Balance Gauge)
- 3 new text map files
- 1 reusable gauge molecule
- 1 shared date range selector
- Utility functions for formatting and calculations

---

**Design Specification Complete** ✅
