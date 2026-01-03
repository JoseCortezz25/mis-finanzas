# Active Budgets Card - Visual Wireframes & Design Specs

**Companion document to**: `ux-active-budgets-card.md`
**Created**: 2026-01-02

---

## Desktop Wireframe (3-column grid, 1024px+)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Presupuestos Activos                                                                  │
│  Monitorea el progreso de tus presupuestos                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│ ●●● Saludable            │  │ ▲▲▲ Precaución          │  │ ●●● Saludable            │
│                          │  │                          │  │                          │
│ ████████████░░░░░░  65%  │  │ ███████████████░░  78%   │  │ ████████░░░░░░░░  45%    │
│                          │  │                          │  │                          │
│ Presupuesto de Enero     │  │ Gastos de Hogar          │  │ Presupuesto Personal     │
│                          │  │                          │  │                          │
│ $6,500 de $10,000        │  │ $7,800 de $10,000        │  │ $4,500 de $10,000        │
│ Disponible: $3,500       │  │ Disponible: $2,200       │  │ Disponible: $5,500       │
│                          │  │                          │  │                          │
│ Enero 2026               │  │ Enero 2026               │  │ Enero 2026               │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
   ↑ Emerald border              ↑ Amber border                ↑ Emerald border
   Hover: shadow-md + scale      Hover: shadow-md + scale     Hover: shadow-md + scale

┌──────────────────────────┐  ┌──────────────────────────┐
│ ◆◆◆ Alerta               │  │ ✖✖✖ Excedido             │
│                          │  │                          │
│ ██████████████████░  92%  │  │ ███████████████████ 105% │
│                          │  │                          │
│ Gastos Variables         │  │ Entretenimiento          │
│                          │  │                          │
│ $9,200 de $10,000        │  │ $5,250 de $5,000         │
│ Disponible: $800         │  │ Disponible: -$250        │
│                          │  │                          │
│ Enero 2026               │  │ Enero 2026               │
└──────────────────────────┘  └──────────────────────────┘
   ↑ Orange border              ↑ Red border
   Hover: shadow-md + scale     Hover: shadow-md + scale
```

**Grid specs**:
- Columns: 3 equal-width columns
- Gap: `gap-4` (16px)
- Card width: `calc((100% - 32px) / 3)`
- Card min-height: 240px

---

## Tablet Wireframe (2-column grid, 640px - 1023px)

```
┌─────────────────────────────────────────────────────────────────┐
│  Presupuestos Activos                                           │
│  Monitorea el progreso de tus presupuestos                     │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐  ┌────────────────────────────────┐
│ ●●● Saludable                  │  │ ▲▲▲ Precaución                │
│                                │  │                                │
│ ████████████░░░░░░░░  65%      │  │ ███████████████░░░  78%        │
│                                │  │                                │
│ Presupuesto de Enero           │  │ Gastos de Hogar                │
│                                │  │                                │
│ $6,500 de $10,000              │  │ $7,800 de $10,000              │
│ Disponible: $3,500             │  │ Disponible: $2,200             │
│                                │  │                                │
│ Enero 2026                     │  │ Enero 2026                     │
└────────────────────────────────┘  └────────────────────────────────┘

┌────────────────────────────────┐  ┌────────────────────────────────┐
│ ◆◆◆ Alerta                     │  │ ✖✖✖ Excedido                   │
│                                │  │                                │
│ ██████████████████░░  92%      │  │ ███████████████████  105%      │
│                                │  │                                │
│ Gastos Variables               │  │ Entretenimiento                │
│                                │  │                                │
│ $9,200 de $10,000              │  │ $5,250 de $5,000               │
│ Disponible: $800               │  │ Disponible: -$250              │
│                                │  │                                │
│ Enero 2026                     │  │ Enero 2026                     │
└────────────────────────────────┘  └────────────────────────────────┘
```

**Grid specs**:
- Columns: 2 equal-width columns
- Gap: `gap-4` (16px)
- Card width: `calc((100% - 16px) / 2)`
- Card min-height: 220px

---

## Mobile Wireframe (1-column stack, < 640px)

```
┌───────────────────────────────────────┐
│  Presupuestos Activos                 │
│  Monitorea el progreso de tus         │
│  presupuestos                         │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ ●●● Saludable                         │
│                                       │
│ ████████████░░░░░░░░░░░░░░  65%       │
│                                       │
│ Presupuesto de Enero                  │
│                                       │
│ $6,500 de $10,000                     │
│ Disponible: $3,500                    │
│                                       │
│ Enero 2026                            │
└───────────────────────────────────────┘
         ↓ Tap anywhere to open

┌───────────────────────────────────────┐
│ ▲▲▲ Precaución                        │
│                                       │
│ ███████████████░░░░░░░  78%           │
│                                       │
│ Gastos de Hogar                       │
│                                       │
│ $7,800 de $10,000                     │
│ Disponible: $2,200                    │
│                                       │
│ Enero 2026                            │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ ◆◆◆ Alerta                            │
│                                       │
│ ██████████████████░░░  92%            │
│                                       │
│ Gastos Variables                      │
│                                       │
│ $9,200 de $10,000                     │
│ Disponible: $800                      │
│                                       │
│ Enero 2026                            │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│ ✖✖✖ Excedido                          │
│                                       │
│ ███████████████████  105%             │
│                                       │
│ Entretenimiento                       │
│                                       │
│ $5,250 de $5,000                      │
│ Disponible: -$250 ← Red text          │
│                                       │
│ Enero 2026                            │
└───────────────────────────────────────┘
```

**Stack specs**:
- Layout: Single column, full width
- Padding: `px-4` (16px left/right)
- Card width: `100%`
- Gap between cards: `space-y-4` (16px)
- Card min-height: 200px (smaller on mobile)

---

## Detailed Card Anatomy (Annotated)

```
┌─────────────────────────────────────────────────────┐
│  [Health Badge: 12px text, icon + label]            │ ← 16px padding-top
│  ●●● Saludable                                      │ ← bg-emerald-50, text-emerald-700
│                                                     │    px-2.5 py-1, rounded-full
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (8px gap) ─ ─ ─ ─ ─ ─ ─ │
│                                                     │
│  [Progress Bar Container: h-3, rounded-full]        │ ← Relative container
│  ████████████░░░░░░░░░░░░  65%                      │ ← Fill: bg-emerald-500
│  ↑                         ↑                        │    Background: bg-slate-200
│  Active fill               Percentage label         │    Label: absolute right, text-sm
│  (width: 65%)              (font-medium)            │
│                                                     │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (12px gap) ─ ─ ─ ─ ─ ─ ─ │
│                                                     │
│  Presupuesto de Enero                               │ ← text-lg font-semibold
│  ↑ Budget name (h3)                                 │    text-foreground
│                                                     │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (8px gap) ─ ─ ─ ─ ─ ─ ─  │
│                                                     │
│  $6,500 de $10,000                                  │ ← text-2xl font-bold
│  ↑ Spent     ↑ Total                                │    text-foreground
│                                                     │
│  Disponible: $3,500                                 │ ← text-sm text-muted-foreground
│  ↑ Available amount                                 │    mt-1 (4px gap)
│                                                     │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (12px gap) ─ ─ ─ ─ ─ ─ ─ │
│                                                     │
│  Enero 2026                                         │ ← text-sm text-muted-foreground
│  ↑ Period (month/year)                              │
│                                                     │ ← 16px padding-bottom
└─────────────────────────────────────────────────────┘
 ↑                                                   ↑
 16px padding-left                   16px padding-right

Border: 1px solid border (default)
       → Changes to health color on hover
Border radius: rounded-lg (8px)
Shadow: none (default) → shadow-md (hover)
Transform: scale(1) (default) → scale(1.02) (hover)
Transition: all 200ms ease-in-out
```

**Spacing breakdown**:
- Padding: `p-4` (16px all sides)
- Badge to progress: `space-y-2` (8px)
- Progress to name: `space-y-3` (12px)
- Name to amounts: `space-y-2` (8px)
- Amounts to period: `space-y-3` (12px)

---

## Health Status Color Specs (Flat Colors)

### 1. Healthy (0-69% spent)
```
Icon: CheckCircle2 (lucide-react)
Badge:
  - Background: bg-emerald-50 (#ecfdf5)
  - Text: text-emerald-700 (#047857)
  - Border: border-emerald-500 (#10b981)
Progress Bar:
  - Fill: bg-emerald-500 (#10b981)
  - Background: bg-slate-200 (#e2e8f0)
Card Hover:
  - Border: border-emerald-500 (#10b981)
```

### 2. Warning (70-89% spent)
```
Icon: AlertTriangle (lucide-react)
Badge:
  - Background: bg-amber-50 (#fffbeb)
  - Text: text-amber-700 (#b45309)
  - Border: border-amber-500 (#f59e0b)
Progress Bar:
  - Fill: bg-amber-500 (#f59e0b)
  - Background: bg-slate-200 (#e2e8f0)
Card Hover:
  - Border: border-amber-500 (#f59e0b)
```

### 3. Alert (90-99% spent)
```
Icon: AlertCircle (lucide-react)
Badge:
  - Background: bg-orange-50 (#fff7ed)
  - Text: text-orange-700 (#c2410c)
  - Border: border-orange-500 (#f97316)
Progress Bar:
  - Fill: bg-orange-500 (#f97316)
  - Background: bg-slate-200 (#e2e8f0)
Card Hover:
  - Border: border-orange-500 (#f97316)
```

### 4. Danger (100%+ spent)
```
Icon: XCircle (lucide-react)
Badge:
  - Background: bg-red-50 (#fef2f2)
  - Text: text-red-700 (#b91c1c)
  - Border: border-red-500 (#ef4444)
Progress Bar:
  - Fill: bg-red-500 (#ef4444)
  - Background: bg-slate-200 (#e2e8f0)
Card Hover:
  - Border: border-red-500 (#ef4444)
Available amount: text-red-600 (if negative)
```

---

## Interaction States (Visual Guide)

### Default State
```
┌─────────────────────────────────┐
│ ●●● Saludable                   │  ← Badge visible
│                                 │
│ ████████████░░░░░░░░  65%       │  ← Progress bar static
│                                 │
│ Presupuesto de Enero            │
│                                 │
│ $6,500 de $10,000               │
│ Disponible: $3,500              │
│                                 │
│ Enero 2026                      │
└─────────────────────────────────┘

Border: 1px solid border (slate-200)
Shadow: none
Transform: scale(1)
Cursor: default
```

### Hover State (Desktop/Tablet)
```
┌═════════════════════════════════┐  ← Border thicker visually
║ ●●● Saludable                   ║  ← (emerald-500 border)
║                                 ║
║ ████████████░░░░░░░░  65%       ║  ← Slightly elevated
║                                 ║
║ Presupuesto de Enero            ║
║                                 ║
║ $6,500 de $10,000               ║
║ Disponible: $3,500              ║
║                                 ║
║ Enero 2026                      ║
╚═════════════════════════════════╝
      ↑ shadow-md underneath

Border: 2px solid emerald-500 (health color)
Shadow: shadow-md (0 4px 6px -1px rgba(0,0,0,0.1))
Transform: scale(1.02) - subtle zoom
Cursor: pointer
Transition: all 200ms ease-in-out
```

### Focus State (Keyboard Navigation)
```
┌─────────────────────────────────┐
║ ●●● Saludable                   ║  ← Focus ring outside border
║                                 ║
║ ████████████░░░░░░░░  65%       ║
║                                 ║
║ Presupuesto de Enero            ║
║                                 ║
║ $6,500 de $10,000               ║
║ Disponible: $3,500              ║
║                                 ║
║ Enero 2026                      ║
└─────────────────────────────────┘
  ╚═══════════════════════════════╝ ← Focus ring (2px offset)

Ring: ring-2 ring-primary ring-offset-2
Border: Same as hover (health color)
Shadow: shadow-md
Transform: scale(1.02)
```

### Active/Pressed State (Click/Tap)
```
┌─────────────────────────────────┐
│ ●●● Saludable                   │  ← Slightly pressed down
│                                 │
│ ████████████░░░░░░░░  65%       │
│                                 │
│ Presupuesto de Enero            │
│                                 │
│ $6,500 de $10,000               │
│ Disponible: $3,500              │
│                                 │
│ Enero 2026                      │
└─────────────────────────────────┘

Border: Same as hover
Shadow: shadow-sm (reduced)
Transform: scale(0.98) - pressed inward
Duration: 100ms (quick feedback)
```

### Loading State (Skeleton)
```
┌─────────────────────────────────┐
│ ░░░░░░░░░░░                     │  ← Badge skeleton (shimmer)
│                                 │
│ ░░░░░░░░░░░░░░░░░░░░░           │  ← Progress skeleton
│                                 │
│ ░░░░░░░░░░░░░░░                 │  ← Name skeleton
│                                 │
│ ░░░░░░░░░░░░░░░░░░              │  ← Amount skeleton
│ ░░░░░░░░░░░                     │  ← Available skeleton
│                                 │
│ ░░░░░░░░                        │  ← Period skeleton
└─────────────────────────────────┘

Animation: animate-pulse (Tailwind default)
Background: bg-slate-200 (light mode)
Duration: 2s infinite
```

---

## Empty State Design

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                    [Wallet Icon]                │  ← Lucide Wallet icon
│                      (48px)                     │    text-muted-foreground
│                                                 │
│           No hay presupuestos activos           │  ← text-xl font-semibold
│                                                 │
│    Crea tu primer presupuesto para comenzar     │  ← text-sm text-muted-foreground
│       a monitorear tus finanzas                 │    max-w-sm mx-auto
│                                                 │
│          [Crear presupuesto] ───→               │  ← Primary button
│                                                 │    bg-primary text-primary-foreground
│                                                 │
└─────────────────────────────────────────────────┘

Centered vertically and horizontally
Min height: 300px
Padding: p-8
Text alignment: center
```

---

## Error State Design

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [AlertCircle Icon]                 │  ← Lucide AlertCircle
│                    (48px)                       │    text-destructive
│                                                 │
│          Error al cargar presupuestos           │  ← text-xl font-semibold
│                                                 │
│       No pudimos cargar tus presupuestos.       │  ← text-sm text-muted-foreground
│          Por favor, intenta de nuevo.           │
│                                                 │
│              [Reintentar] ───→                  │  ← Secondary button
│                                                 │    border border-input bg-background
│                                                 │
└─────────────────────────────────────────────────┘

Centered vertically and horizontally
Min height: 300px
Padding: p-8
Text alignment: center
```

---

## Accessibility Annotations

### Screen Reader Flow (Example Card)
```
1. [NAVIGATION LANDMARK] "Main content"
2. [SECTION] "Presupuestos Activos"
3. [HEADING LEVEL 2] "Presupuestos Activos"
4. [TEXT] "Monitorea el progreso de tus presupuestos"
5. [ARTICLE] "Presupuesto Presupuesto de Enero, 6,500 pesos de 10,000 pesos gastado, estado Saludable"
   ↓
   6. [BUTTON/LINK] "Ver detalles del presupuesto de Enero"
   7. [STATUS] "Estado: Saludable" (from badge)
   8. [PROGRESSBAR] "Progreso: 65% del presupuesto consumido"
   9. [TEXT] "Gastado 6,500 de 10,000 pesos"
   10. [TEXT] "Disponible: 3,500 pesos"
   11. [TEXT] "Enero 2026"
7. [ARTICLE] "Presupuesto Gastos de Hogar, 7,800 pesos de 10,000 pesos gastado, estado Precaución"
   ...
```

### Keyboard Navigation Flow
```
[Tab 1] → Section heading ("Presupuestos Activos") - Not focusable, just landmark
[Tab 2] → First budget card → [Enter] to navigate
[Tab 3] → Second budget card → [Enter] to navigate
[Tab 4] → Third budget card → [Enter] to navigate
[Tab 5] → "Ver todos los presupuestos" link (if present)
[Tab 6] → Next section/component

[Shift+Tab] → Reverse order
```

---

## Responsive Breakpoint Behavior

### Mobile Portrait (375px - iPhone SE)
- 1 column layout
- Card padding: `p-4` (16px)
- Budget name: `text-base` (16px) - smaller
- Amount: `text-xl` (20px) - smaller
- Progress bar height: `h-2.5` (10px) - thinner
- Badge text: `text-xs` (12px)

### Mobile Landscape (640px - 767px)
- 2 column layout (if space allows, else 1 column)
- Card padding: `p-4` (16px)
- Budget name: `text-lg` (18px)
- Amount: `text-2xl` (24px)
- Progress bar height: `h-3` (12px)

### Tablet Portrait (768px - 1023px)
- 2 column layout (always)
- Card padding: `p-5` (20px) - more spacious
- Budget name: `text-lg` (18px)
- Amount: `text-2xl` (24px)
- Progress bar height: `h-3.5` (14px)

### Desktop (1024px+)
- 3 column layout (max)
- Card padding: `p-6` (24px) - most spacious
- Budget name: `text-xl` (20px) - larger
- Amount: `text-2xl` (24px)
- Progress bar height: `h-4` (16px) - thicker

---

## Motion & Animation Specs

### Reduced Motion Alternative
```css
/* For users with prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .budget-card {
    transition: opacity 200ms ease-in-out;
    /* No scale, no transform */
  }

  .budget-card:hover {
    opacity: 0.9; /* Subtle feedback */
    /* No shadow, no scale */
  }
}
```

### Default Motion
```css
.budget-card {
  transition: all 200ms ease-in-out;
}

.budget-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.budget-card:active {
  transform: scale(0.98);
  transition: all 100ms ease-in-out;
}
```

---

## Component Hierarchy (File Structure)

```
src/domains/dashboard/components/
├── active-budgets-section.tsx         (Main container, data fetching)
│   └── Uses: useBudgets() hook, Suspense boundary
│
├── budget-card.tsx                     (Individual budget card)
│   ├── Props: budget, onClick
│   └── Uses: BudgetHealthBadge, BudgetProgressBar
│
├── budget-health-badge.tsx             (Custom badge component)
│   ├── Props: healthStatus
│   └── Returns: Badge with icon + label
│
├── budget-progress-bar.tsx             (Custom progress bar)
│   ├── Props: percentageUsed, healthStatus
│   └── Returns: Progress bar with color + percentage
│
├── budget-card-skeleton.tsx            (Loading skeleton)
│   └── Returns: Skeleton version of budget-card
│
├── empty-budgets-state.tsx             (Empty state)
│   └── Returns: Empty state UI with CTA
│
└── error-budgets-state.tsx             (Error state)
    └── Returns: Error UI with retry button
```

---

## Implementation Checklist

**Pre-implementation**:
- [ ] Confirm `useBudgets()` hook exists and returns correct data shape
- [ ] Confirm `useBudgetCalculations()` hook exists and works
- [ ] Confirm shadcn `Badge` component is installed
- [ ] Confirm shadcn `Progress` component is installed
- [ ] Confirm shadcn `Skeleton` component is installed
- [ ] Text map has been updated with all required keys

**Component Development**:
- [ ] Create `BudgetHealthBadge` with icon + color mapping
- [ ] Create `BudgetProgressBar` with dynamic coloring
- [ ] Create `BudgetCard` with all states (default, hover, focus)
- [ ] Create `BudgetCardSkeleton` for loading state
- [ ] Create `EmptyBudgetsState` with CTA
- [ ] Create `ErrorBudgetsState` with retry handler
- [ ] Create `ActiveBudgetsSection` container component

**Testing**:
- [ ] Test keyboard navigation (tab order, enter to click)
- [ ] Test screen reader (VoiceOver/NVDA)
- [ ] Test mobile responsiveness (375px, 640px, 1024px)
- [ ] Test hover states on desktop
- [ ] Test touch states on mobile
- [ ] Test loading skeleton display
- [ ] Test empty state display
- [ ] Test error state with retry
- [ ] Test color contrast (WCAG AA minimum)
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Test with different health statuses (healthy, warning, alert, danger)

**Integration**:
- [ ] Replace current budget list in dashboard page
- [ ] Wire up navigation to budget detail page
- [ ] Test with real budget data
- [ ] Verify calculations match expected values
- [ ] Performance check (no unnecessary re-renders)

---

## Design Inspiration Sources

**What to avoid** (Generic AI design):
- Complex gradients (linear-gradient with 5+ colors)
- Drop shadows everywhere (shadow-xl on everything)
- Overly rounded corners (rounded-3xl)
- Pastel color overload
- Generic illustrations

**What we're doing instead** (Distinctive, professional):
- Flat, solid colors with clear semantic meaning
- Selective elevation (hover only)
- Consistent border radius (rounded-lg)
- Bold, saturated health status colors
- Functional iconography (lucide-react)

**Inspired by** (but not copying):
- **YNAB**: Clear health indicators, progress-focused design
- **Mint**: Category-based color coding, clean cards
- **Copilot Money**: Bold colors, modern flat design
- **Linear**: Subtle hover states, excellent keyboard nav
- **Stripe Dashboard**: Professional, accessible, no-nonsense

---

**End of Wireframes Document**

This document provides visual reference for implementing the Active Budgets Card component. All measurements, colors, and interactions are specified to eliminate guesswork during development.
