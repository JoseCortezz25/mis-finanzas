# Financial Visualizations - shadcn/ui Component Selection & Recharts Configuration

**Session ID**: `financial_visualizations_1767835714`
**Created**: 2026-01-07
**Author**: shadcn-builder
**Status**: Complete
**Type**: Component Selection & Technical Architecture

---

## Executive Summary

This document identifies all shadcn/ui components, Recharts configurations, and custom component requirements for the three financial visualization components:

1. **Daily Bar Chart** - Uses Recharts (already installed) + shadcn Card/Skeleton/Tooltip
2. **GitHub-style Spending Heatmap** - Custom SVG grid + shadcn Card/Skeleton/Tooltip
3. **Balance Gauge Card** - Custom semicircular SVG gauge + shadcn Card/Skeleton/Tooltip

**Key Findings**:
- ✅ **Recharts already installed** (`recharts@3.6.0`)
- ✅ **Most shadcn components already exist** (Card, Skeleton, Button)
- ⚠️ **Need to install**: Tooltip component
- 🔨 **Custom components needed**: Semicircular Gauge (SVG), Heatmap Cell, Date Range Selector

---

## Table of Contents

1. [Existing shadcn/ui Components (Reuse)](#existing-shadcnui-components-reuse)
2. [shadcn/ui Components to Install](#shadcnui-components-to-install)
3. [Recharts Configuration](#recharts-configuration)
4. [Custom Components Architecture](#custom-components-architecture)
5. [Component Composition Strategy](#component-composition-strategy)
6. [Installation Plan](#installation-plan)
7. [Props Interfaces & Type Definitions](#props-interfaces--type-definitions)

---

## Existing shadcn/ui Components (Reuse)

### Already Installed Components

Based on `/src/components/ui/` analysis:

#### ✅ `Card` (`card.tsx`)
**Location**: `@/components/ui/card`
**Radix Primitive**: None (pure Tailwind component)
**Usage**: Wrapper for all three visualization components
**Variants Available**: Default card styling with border, radius, shadow
**Imports**:
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
```

**How we'll use it**:
- Daily Bar Chart: `<Card>` wrapper with `<CardHeader>` for title + controls, `<CardContent>` for chart
- Heatmap: `<Card>` wrapper with `<CardHeader>` for title + date selector, `<CardContent>` for grid
- Balance Gauge: `<Card>` wrapper with `<CardContent>` for balance + gauge + legend

---

#### ✅ `Skeleton` (`skeleton.tsx`)
**Location**: `@/components/ui/skeleton`
**Radix Primitive**: None (pure Tailwind with pulse animation)
**Usage**: Loading states for all components
**Built-in Features**: Pulse animation (2s infinite)
**Imports**:
```tsx
import { Skeleton } from '@/components/ui/skeleton';
```

**How we'll use it**:
- Daily Bar Chart: Skeleton bars with random heights
- Heatmap: Skeleton grid (52 weeks × 7 days)
- Balance Gauge: Skeleton circle + text placeholders

---

#### ✅ `Button` (`button.tsx`)
**Location**: `@/components/ui/button`
**Radix Primitive**: `@radix-ui/react-slot`
**Usage**: Empty state CTAs, error retry buttons
**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`
**Imports**:
```tsx
import { Button } from '@/components/ui/button';
```

**How we'll use it**:
- Empty states: `<Button variant="default">+ Crear Movimiento</Button>`
- Error states: `<Button variant="outline">Reintentar</Button>`

---

#### ✅ `Select` (`select.tsx`)
**Location**: `@/components/ui/select`
**Radix Primitive**: `@radix-ui/react-select`
**Usage**: Date range selector dropdown (7 days, 30 days, 90 days, custom)
**Built-in Features**: Keyboard navigation, ARIA labels, portal rendering
**Imports**:
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

**How we'll use it**:
```tsx
<Select value={dateRange} onValueChange={setDateRange}>
  <SelectTrigger>
    <SelectValue placeholder="Seleccionar rango" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="7d">Últimos 7 días</SelectItem>
    <SelectItem value="30d">Últimos 30 días</SelectItem>
    <SelectItem value="90d">Últimos 90 días</SelectItem>
    <SelectItem value="custom">Personalizado</SelectItem>
  </SelectContent>
</Select>
```

---

#### ✅ `Badge` (`badge.tsx`)
**Location**: `@/components/ui/badge`
**Radix Primitive**: None (pure Tailwind with CVA variants)
**Usage**: Optional labels for transaction counts, category indicators
**Variants**: `default`, `secondary`, `destructive`, `outline`
**Imports**:
```tsx
import { Badge } from '@/components/ui/badge';
```

**Potential use**: Heatmap tooltips to highlight top categories
```tsx
<Badge variant="secondary">{categoryName}</Badge>
```

---

#### ✅ `Alert` (`alert.tsx`)
**Location**: `@/components/ui/alert`
**Radix Primitive**: None (pure Tailwind)
**Usage**: Error messages, warnings for large date ranges
**Variants**: `default`, `destructive`
**Imports**:
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
```

**How we'll use it**:
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    No se pudo cargar los datos. Verifica tu conexión.
  </AlertDescription>
</Alert>
```

---

#### ✅ `Separator` (`separator.tsx`)
**Location**: `@/components/ui/separator`
**Radix Primitive**: `@radix-ui/react-separator`
**Usage**: Visual dividers in tooltips, gauge legend sections
**Imports**:
```tsx
import { Separator } from '@/components/ui/separator';
```

**How we'll use it**:
```tsx
{/* In tooltip */}
<div>
  <p>Ingresos: $1,500,000</p>
  <p>Gastos: $850,000</p>
  <Separator className="my-2" />
  <p>Neto: $650,000</p>
</div>
```

---

## shadcn/ui Components to Install

### ⚠️ Missing Component: `Tooltip`

**Component**: `tooltip`
**Radix Primitive**: `@radix-ui/react-tooltip`
**Purpose**: Interactive hover/tap tooltips for chart elements
**Installation Required**: ✅ **YES**

**Installation Command**:
```bash
pnpm dlx shadcn@latest add tooltip
```

**What it provides**:
- Accessible tooltips with ARIA labels
- Keyboard navigation support (Escape to close)
- Customizable positioning (top, bottom, left, right)
- Delay controls (delayDuration, skipDelayDuration)
- Portal rendering (avoids z-index issues)

**Why we need it**:
- Daily Bar Chart: Show date + income/expense/net on bar hover
- Heatmap: Show date + amount + transaction count on cell hover
- Balance Gauge: Show category details on segment hover

**Expected imports after installation**:
```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
```

**Usage pattern**:
```tsx
<TooltipProvider>
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <div>{/* Chart element */}</div>
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={5}>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Accessibility features** (built into Radix):
- ARIA role="tooltip"
- ARIA-labelledby/describedby relationships
- Focus management
- ESC key to dismiss

---

## Recharts Configuration

### ✅ Already Installed: `recharts@3.6.0`

**Package**: `recharts` (already in `package.json`)
**Version**: `3.6.0`
**Documentation**: https://recharts.org/

**Components we'll use**:

#### For Daily Bar Chart:

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
```

**Component purposes**:
- `BarChart`: Main container for bar chart
- `Bar`: Income and expense bars (2 per day)
- `XAxis`: Date labels (bottom)
- `YAxis`: Amount labels (left)
- `CartesianGrid`: Horizontal grid lines
- `Tooltip`: Hover tooltip (Recharts built-in, custom content)
- `Legend`: Color legend (Income/Expense)
- `ResponsiveContainer`: Responsive width/height
- `Cell`: Individual bar styling (optional for highlighting)

---

### Recharts Configuration for Daily Bar Chart

**Bar Chart Configuration**:
```tsx
<ResponsiveContainer width="100%" height={320}>
  <BarChart
    data={chartData}
    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
  >
    {/* Grid */}
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="hsl(var(--border))"
      opacity={0.3}
      vertical={false}
      horizontal={true}
    />

    {/* X-Axis (Dates) */}
    <XAxis
      dataKey="date"
      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
      tickFormatter={(date) => formatDateShort(date)}
      axisLine={{ stroke: 'hsl(var(--border))' }}
      tickLine={{ stroke: 'hsl(var(--border))' }}
      height={40}
      angle={-45} // Rotate on mobile
    />

    {/* Y-Axis (Amounts) */}
    <YAxis
      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
      tickFormatter={(value) => formatCurrencyAbbr(value)}
      axisLine={{ stroke: 'hsl(var(--border))' }}
      tickLine={{ stroke: 'hsl(var(--border))' }}
      width={60}
    />

    {/* Custom Tooltip */}
    <RechartsTooltip
      content={<CustomBarChartTooltip />}
      cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
    />

    {/* Legend */}
    <Legend
      verticalAlign="top"
      height={36}
      iconType="square"
      formatter={(value) => DAILY_BAR_CHART_TEXT.LEGEND[value.toUpperCase()]}
    />

    {/* Income Bars */}
    <Bar
      dataKey="income"
      fill="#10B981"
      radius={[4, 4, 0, 0]} // Rounded top corners
      animationDuration={800}
      animationBegin={0}
      barSize={20}
    />

    {/* Expense Bars */}
    <Bar
      dataKey="expense"
      fill="#EF4444"
      radius={[4, 4, 0, 0]}
      animationDuration={800}
      animationBegin={0}
      barSize={20}
    />
  </BarChart>
</ResponsiveContainer>
```

**Custom Tooltip Component**:
```tsx
interface CustomBarChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: DailyBarChartDataPoint;
  }>;
}

function CustomBarChartTooltip({ active, payload }: CustomBarChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-card border-border text-foreground rounded-md border p-3 shadow-lg">
      <p className="text-sm font-semibold mb-2">
        {formatDateLong(data.date)}
      </p>
      <div className="text-xs space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ingresos:</span>
          <span className="font-medium text-emerald-600">
            {formatCurrency(data.income)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Gastos:</span>
          <span className="font-medium text-red-600">
            {formatCurrency(data.expense)}
          </span>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground font-semibold">Neto:</span>
          <span className={cn(
            "font-semibold",
            data.net >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {formatCurrency(data.net)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

**Responsive Configuration**:
```tsx
// Mobile (< 640px)
{
  height: 256,
  barSize: 16,
  margin: { top: 10, right: 10, left: 10, bottom: 10 },
  xAxisAngle: -45,
}

// Tablet (640px - 1024px)
{
  height: 320,
  barSize: 20,
  margin: { top: 20, right: 20, left: 20, bottom: 20 },
  xAxisAngle: 0,
}

// Desktop (> 1024px)
{
  height: 384,
  barSize: 24,
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  xAxisAngle: 0,
}
```

---

## Custom Components Architecture

### 1. Semicircular Gauge (Balance Gauge Card)

**Component**: `SemicircularGauge`
**Type**: Reusable Molecule
**Location**: `@/components/molecules/semicircular-gauge.tsx`
**Technology**: SVG (no shadcn equivalent)
**Radix Primitives**: None (pure SVG)

**Why custom?**: No shadcn/ui component for semicircular gauges. Must build from scratch.

**Props Interface**:
```tsx
interface SemicircularGaugeProps {
  /** Current balance amount */
  balance: number;

  /** Needle angle in degrees (0-180) */
  needleAngle: number;

  /** Gauge segments with start/end angles and colors */
  segments: Array<{
    type: 'egreso' | 'gasto' | 'ingreso';
    label: string;
    startAngle: number;
    endAngle: number;
    color: string;
    amount: number;
    percentage: number;
  }>;

  /** Gauge dimensions */
  diameter?: number; // Default: 280px (desktop)
  thickness?: number; // Default: 32px

  /** Callbacks */
  onSegmentHover?: (segment: GaugeSegment) => void;
  onNeedleHover?: () => void;

  /** Accessibility */
  ariaLabel?: string;
}
```

**SVG Structure**:
```tsx
export function SemicircularGauge({
  balance,
  needleAngle,
  segments,
  diameter = 280,
  thickness = 32,
  onSegmentHover,
  onNeedleHover,
  ariaLabel = 'Medidor de balance financiero',
}: SemicircularGaugeProps) {
  const radius = (diameter / 2) - (thickness / 2);
  const cx = diameter / 2;
  const cy = diameter / 2;

  return (
    <svg
      width={diameter}
      height={(diameter / 2) + 40}
      viewBox={`0 0 ${diameter} ${(diameter / 2) + 40}`}
      className="mx-auto"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Background arc */}
      <path
        d={describeArc(cx, cy, radius, 0, 180)}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={thickness}
        strokeLinecap="round"
      />

      {/* Segments */}
      {segments.map((segment) => (
        <Tooltip key={segment.type}>
          <TooltipTrigger asChild>
            <path
              d={describeArc(cx, cy, radius, segment.startAngle, segment.endAngle)}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => onSegmentHover?.(segment)}
              role="graphics-symbol"
              aria-label={`${segment.label}: ${formatCurrency(segment.amount)}, ${segment.percentage.toFixed(1)}% del total`}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-semibold">{segment.label}</p>
              <p className="text-muted-foreground">
                {formatCurrency(segment.amount)}
              </p>
              <p className="text-muted-foreground text-[10px]">
                {segment.percentage.toFixed(1)}% del total
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Needle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <g
            transform={`rotate(${needleAngle - 90}, ${cx}, ${cy})`}
            className="transition-transform duration-800 ease-out cursor-pointer"
            onMouseEnter={onNeedleHover}
          >
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
            {/* Needle tip */}
            <polygon
              points={`${cx},${cy - radius + 10} ${cx - 4},${cy - radius + 18} ${cx + 4},${cy - radius + 18}`}
              fill="hsl(var(--foreground))"
            />
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-semibold">Balance</p>
            <p className={cn(
              "font-semibold",
              balance >= 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {formatCurrency(balance)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Center pivot */}
      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill="hsl(var(--card))"
        stroke="hsl(var(--foreground))"
        strokeWidth="3"
      />

      {/* Scale labels (optional) */}
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
  );
}
```

**Utility Function** (SVG arc path):
```tsx
// lib/utils/svg.ts
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}
```

**Accessibility**:
- SVG `role="img"`
- ARIA label on main SVG
- ARIA labels on each segment path
- Tooltips with keyboard accessibility (via Radix)
- Focus ring on keyboard navigation

---

### 2. Heatmap Cell (Spending Heatmap)

**Component**: `HeatmapCell`
**Type**: Reusable Molecule
**Location**: `@/components/molecules/heatmap-cell.tsx`
**Technology**: HTML div with Tailwind (no SVG needed for simple squares)
**Radix Primitives**: Uses shadcn Tooltip

**Props Interface**:
```tsx
interface HeatmapCellProps {
  /** Cell data */
  data: {
    date: string;
    amount: number;
    level: number; // 0-4
    transactionCount: number;
    topCategory?: string;
  };

  /** Cell size in pixels */
  size?: number; // Default: 14px (desktop)

  /** Callback on click */
  onClick?: (data: HeatmapDataPoint) => void;

  /** Animation delay for stagger effect */
  animationDelay?: number; // In milliseconds
}
```

**Component**:
```tsx
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency, formatDateLong } from '@/lib/utils/format';

const LEVEL_COLORS = {
  0: 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  1: 'bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-800',
  2: 'bg-red-200 border-red-300 dark:bg-red-800 dark:border-red-700',
  3: 'bg-red-300 border-red-400 dark:bg-red-700 dark:border-red-600',
  4: 'bg-red-500 border-red-600 dark:bg-red-600 dark:border-red-500',
} as const;

export function HeatmapCell({
  data,
  size = 14,
  onClick,
  animationDelay = 0,
}: HeatmapCellProps) {
  const colorClass = LEVEL_COLORS[data.level as keyof typeof LEVEL_COLORS];

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'rounded-sm border transition-all duration-150',
            'hover:ring-2 hover:ring-primary hover:ring-offset-1',
            'hover:scale-110 hover:z-10',
            'cursor-pointer',
            'animate-fade-in',
            colorClass
          )}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${animationDelay}ms`,
          }}
          onClick={() => onClick?.(data)}
          role="graphics-symbol"
          aria-label={`${formatDateLong(data.date)}: Gastado ${formatCurrency(data.amount)}, ${data.transactionCount} movimientos`}
          tabIndex={0}
        />
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5}>
        <div className="text-xs min-w-[180px]">
          <p className="font-semibold mb-2">
            {formatDateLong(data.date)}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Gastado:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(data.amount)}
              </span>
            </div>
            <p className="text-muted-foreground text-[10px]">
              {data.transactionCount} movimientos
            </p>
            {data.topCategory && (
              <>
                <Separator className="my-1" />
                <div>
                  <p className="text-muted-foreground text-[10px]">
                    Categoría principal:
                  </p>
                  <p className="font-medium">{data.topCategory}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
```

**CSS Animation** (add to globals.css):
```css
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

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
```

---

### 3. Date Range Selector (Shared)

**Component**: `DateRangeSelector`
**Type**: Reusable Molecule
**Location**: `@/components/molecules/date-range-selector.tsx`
**Technology**: shadcn Select component
**Radix Primitives**: `@radix-ui/react-select` (via shadcn)

**Props Interface**:
```tsx
interface DateRangeSelectorProps {
  /** Current selected range */
  value: string; // '7d', '30d', '90d', 'custom', '6m', '12m'

  /** Callback when range changes */
  onChange: (range: string) => void;

  /** Available range options */
  options?: Array<{
    value: string;
    label: string;
  }>;

  /** Custom date range (if value === 'custom') */
  customRange?: {
    start: Date;
    end: Date;
  };

  /** Callback when custom range changes */
  onCustomRangeChange?: (range: { start: Date; end: Date }) => void;
}
```

**Component**:
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEFAULT_OPTIONS = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '12m', label: 'Últimos 12 meses' },
  { value: 'custom', label: 'Personalizado' },
];

export function DateRangeSelector({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: DateRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar rango" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Usage**:
```tsx
const [dateRange, setDateRange] = useState('30d');

<DateRangeSelector
  value={dateRange}
  onChange={setDateRange}
/>
```

**Future Enhancement**: Custom date picker dialog (if `value === 'custom'`) using `@radix-ui/react-dialog` + date inputs.

---

## Component Composition Strategy

### Daily Bar Chart Composition

**Primary Component**: `DailyBarChart`
**Organism Location**: `@/domains/reports/components/organisms/daily-bar-chart.tsx`

**Composition Pattern**:
```tsx
<TooltipProvider>
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{DAILY_BAR_CHART_TEXT.TITLE}</CardTitle>
        <DateRangeSelector value={range} onChange={setRange} />
      </div>
    </CardHeader>

    <CardContent>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <LegendItem color="#10B981" label="Ingresos" />
        <LegendItem color="#EF4444" label="Gastos" />
      </div>

      {/* Recharts Bar Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid />
          <XAxis />
          <YAxis />
          <RechartsTooltip content={<CustomBarChartTooltip />} />
          <Bar dataKey="income" fill="#10B981" />
          <Bar dataKey="expense" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</TooltipProvider>
```

**shadcn components used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `DateRangeSelector` (custom, uses shadcn `Select`)
- Recharts components (BarChart, Bar, etc.)
- Custom `CustomBarChartTooltip` (uses shadcn Tailwind classes)

**Loading state**:
```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
  </CardHeader>
  <CardContent>
    <div className="h-64 relative">
      <div className="absolute inset-0 flex items-end justify-around gap-1 px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex gap-1 items-end">
            <Skeleton className="w-4" style={{ height: `${Math.random() * 60 + 20}%` }} />
            <Skeleton className="w-4" style={{ height: `${Math.random() * 60 + 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  </CardContent>
</Card>
```

**Empty state**:
```tsx
<Card>
  <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
    <ChartBarIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
    <h3 className="text-lg font-semibold mb-2">
      {DAILY_BAR_CHART_TEXT.EMPTY.TITLE}
    </h3>
    <p className="text-muted-foreground text-sm mb-6">
      {DAILY_BAR_CHART_TEXT.EMPTY.MESSAGE}
    </p>
    <Button variant="default">
      {DAILY_BAR_CHART_TEXT.EMPTY.ACTION}
    </Button>
  </CardContent>
</Card>
```

---

### Heatmap Composition

**Primary Component**: `SpendingHeatmap`
**Organism Location**: `@/domains/reports/components/organisms/spending-heatmap.tsx`

**Composition Pattern**:
```tsx
<TooltipProvider>
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{SPENDING_HEATMAP_TEXT.TITLE}</CardTitle>
        <DateRangeSelector
          value={range}
          onChange={setRange}
          options={[
            { value: '6m', label: 'Últimos 6 meses' },
            { value: '12m', label: 'Últimos 12 meses' },
          ]}
        />
      </div>
    </CardHeader>

    <CardContent>
      {/* Month labels */}
      <div className="mb-2 flex gap-0.5">
        {/* Month label row */}
      </div>

      {/* Grid */}
      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5">
          {SPENDING_HEATMAP_TEXT.DAYS.SHORT.map((day) => (
            <span key={day} className="text-xs text-muted-foreground">
              {day}
            </span>
          ))}
        </div>

        {/* Heatmap cells */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex gap-0.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-0.5">
                {week.days.map((day, dayIdx) => (
                  <HeatmapCell
                    key={day.date}
                    data={day}
                    size={14}
                    animationDelay={weekIdx * 7 + dayIdx * 2}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
        <span>{SPENDING_HEATMAP_TEXT.LEGEND.LESS}</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                'w-3 h-3 rounded-sm border',
                LEVEL_COLORS[level as keyof typeof LEVEL_COLORS]
              )}
            />
          ))}
        </div>
        <span>{SPENDING_HEATMAP_TEXT.LEGEND.MORE}</span>
      </div>
    </CardContent>
  </Card>
</TooltipProvider>
```

**shadcn components used**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `DateRangeSelector` (custom, uses shadcn `Select`)
- `HeatmapCell` (custom molecule, uses shadcn `Tooltip`)

**Loading state**:
```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
  </CardHeader>
  <CardContent>
    <div className="flex gap-2">
      <div className="flex flex-col gap-0.5 w-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3" />
        ))}
      </div>
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
  </CardContent>
</Card>
```

---

### Balance Gauge Composition

**Primary Component**: `BalanceGaugeCard`
**Organism Location**: `@/domains/dashboard/components/organisms/balance-gauge-card.tsx`

**Composition Pattern**:
```tsx
<TooltipProvider>
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6 sm:p-8">
      {/* Top: Balance Display */}
      <div className="text-center mb-8">
        <div className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold',
          balance >= 0 ? 'text-emerald-600' : 'text-red-600'
        )}>
          {formatCurrency(balance)}
        </div>
        <p className="text-sm text-muted-foreground mt-2 font-medium">
          {BALANCE_GAUGE_TEXT.LABEL}
        </p>
      </div>

      {/* Center: Semicircular Gauge */}
      <div className="flex items-center justify-center my-8">
        <SemicircularGauge
          balance={balance}
          needleAngle={needleAngle}
          segments={segments}
          diameter={280}
          thickness={32}
        />
      </div>

      {/* Bottom: Category Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {segments.map((segment) => (
          <div key={segment.type} className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {segment.label}
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {formatCurrency(segment.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TooltipProvider>
```

**shadcn components used**:
- `Card`, `CardContent`
- `SemicircularGauge` (custom molecule, uses shadcn `Tooltip` internally)

**Loading state**:
```tsx
<Card>
  <CardContent className="p-6 sm:p-8 space-y-8">
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
  </CardContent>
</Card>
```

---

## Installation Plan

### Step 1: Install Missing shadcn Component

```bash
# Install Tooltip component
pnpm dlx shadcn@latest add tooltip
```

**Expected outcome**:
- Creates `@/components/ui/tooltip.tsx`
- Installs `@radix-ui/react-tooltip` dependency
- Provides accessible tooltip primitives

**Verification**:
```bash
# Check if file exists
ls src/components/ui/tooltip.tsx

# Check package.json for dependency
grep "@radix-ui/react-tooltip" package.json
```

---

### Step 2: Verify Recharts Installation

```bash
# Already installed, verify version
grep "recharts" package.json
# Expected: "recharts": "^3.6.0"
```

**No action needed**: Recharts is already installed.

---

### Step 3: Create Custom Components

**Create directory structure**:
```bash
mkdir -p src/components/molecules
```

**Files to create**:
1. `src/components/molecules/semicircular-gauge.tsx` (SVG gauge)
2. `src/components/molecules/heatmap-cell.tsx` (Heatmap square)
3. `src/components/molecules/date-range-selector.tsx` (Date selector)

---

### Step 4: Create Utility Functions

**Files to create**:
1. `src/lib/utils/svg.ts` - SVG arc path generation
2. `src/lib/utils/format.ts` - Currency and date formatting (may already exist)
3. `src/lib/utils/percentile.ts` - Percentile calculations for heatmap

---

### Step 5: Create Organism Components

**Files to create**:
1. `src/domains/reports/components/organisms/daily-bar-chart.tsx`
2. `src/domains/reports/components/organisms/daily-bar-chart-skeleton.tsx`
3. `src/domains/reports/components/organisms/daily-bar-chart-empty.tsx`
4. `src/domains/reports/components/organisms/spending-heatmap.tsx`
5. `src/domains/reports/components/organisms/spending-heatmap-skeleton.tsx`
6. `src/domains/reports/components/organisms/spending-heatmap-empty.tsx`
7. `src/domains/dashboard/components/organisms/balance-gauge-card.tsx`
8. `src/domains/dashboard/components/organisms/balance-gauge-skeleton.tsx`
9. `src/domains/dashboard/components/organisms/balance-gauge-empty.tsx`

---

### Step 6: Create Text Maps

**Files to create**:
1. `src/domains/reports/daily-bar-chart.text-map.ts`
2. `src/domains/reports/spending-heatmap.text-map.ts`
3. `src/domains/dashboard/balance-gauge.text-map.ts`

---

## Props Interfaces & Type Definitions

### Daily Bar Chart Props

```tsx
// domains/reports/components/organisms/daily-bar-chart.tsx
interface DailyBarChartProps {
  /** Date range start */
  startDate: Date;

  /** Date range end */
  endDate: Date;

  /** Optional user ID (if not in context) */
  userId?: string;

  /** Height in pixels */
  height?: number; // Default: 320

  /** Show legend */
  showLegend?: boolean; // Default: true

  /** Callback when bar is clicked */
  onBarClick?: (data: DailyBarChartDataPoint) => void;
}

interface DailyBarChartDataPoint {
  date: string; // ISO date (YYYY-MM-DD)
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

interface DailyBarChartData {
  dateRange: {
    start: string;
    end: string;
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
```

---

### Heatmap Props

```tsx
// domains/reports/components/organisms/spending-heatmap.tsx
interface SpendingHeatmapProps {
  /** Date range start */
  startDate: Date;

  /** Date range end */
  endDate: Date;

  /** Optional user ID */
  userId?: string;

  /** Cell size in pixels */
  cellSize?: number; // Default: 14 (desktop)

  /** Callback when cell is clicked */
  onCellClick?: (data: HeatmapDataPoint) => void;
}

interface HeatmapDataPoint {
  date: string; // ISO date
  amount: number; // Total spent
  level: number; // 0-4 color intensity
  transactionCount: number;
  topCategory?: string;
}

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
    levels: [number, number, number, number, number];
    percentiles: { 25: number; 50: number; 75: number };
  };
}

interface HeatmapWeek {
  weekNumber: number;
  days: HeatmapDataPoint[];
}
```

---

### Balance Gauge Props

```tsx
// domains/dashboard/components/organisms/balance-gauge-card.tsx
interface BalanceGaugeCardProps {
  /** Optional user ID */
  userId?: string;

  /** Gauge diameter */
  diameter?: number; // Default: 280 (desktop), 200 (mobile)

  /** Gauge thickness */
  thickness?: number; // Default: 32 (desktop), 24 (mobile)

  /** Show scale labels */
  showScaleLabels?: boolean; // Default: true
}

interface BalanceGaugeData {
  balance: number;
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
  label: string;
  amount: number;
  percentage: number; // Of total
  startAngle: number; // 0-180
  endAngle: number; // 0-180
  color: string;
}
```

---

## Summary

**shadcn/ui Components**:
- ✅ **Existing (Reuse)**: Card, Skeleton, Button, Select, Badge, Alert, Separator
- ⚠️ **To Install**: Tooltip (via `pnpm dlx shadcn@latest add tooltip`)

**Recharts**:
- ✅ **Already Installed**: `recharts@3.6.0`
- **Components Used**: BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell

**Custom Components**:
- 🔨 `SemicircularGauge` - SVG gauge for Balance Gauge Card (molecule)
- 🔨 `HeatmapCell` - Individual heatmap cell with tooltip (molecule)
- 🔨 `DateRangeSelector` - Date range dropdown (molecule, uses shadcn Select)

**Installation Steps**:
1. Install shadcn Tooltip: `pnpm dlx shadcn@latest add tooltip`
2. Verify Recharts (already installed)
3. Create custom molecule components (SemicircularGauge, HeatmapCell, DateRangeSelector)
4. Create utility functions (SVG arc paths, percentile calculations)
5. Create organism components (DailyBarChart, SpendingHeatmap, BalanceGaugeCard)
6. Create text map files

**Ready for Implementation**: All component architecture, compositions, and props defined. Coordinate with **nextjs-builder** for implementation.

---

**Component Selection Complete** ✅
