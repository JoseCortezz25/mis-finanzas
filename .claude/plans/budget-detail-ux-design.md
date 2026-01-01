# Budget Detail View - UX/UI Design Plan

**Created**: 2025-12-31
**Session**: budget_detail_view
**Complexity**: Medium
**User Impact**: High
**Design Priority**: MOBILE-FIRST (mobile is primary, desktop is secondary)

---

## 1. User Context

### User Goals
- **Primary Goal**: View complete budget details including available amount, spent amount, and remaining balance at a glance
- **Secondary Goals**:
  - Track all transactions (movimientos) linked to this budget
  - Understand budget consumption patterns and traceability
  - Access detailed breakdown of spending by category/transaction type
  - Take quick actions (edit budget, create transaction)
- **Success Criteria**:
  - User can immediately see budget health (remaining vs spent)
  - User can trace every transaction affecting the budget
  - User can identify spending patterns
  - Navigation is clear and intuitive

### User Personas
- **Primary**: Budget-conscious individual managing monthly finances on mobile device
- **Context**: Checking budget status on-the-go, reviewing spending after purchases, planning expenses
- **Pain Points**:
  - Cannot see budget overview and transactions together
  - Difficult to trace why budget is consumed
  - No visual feedback on budget health
  - Desktop tables are hard to navigate on mobile

### User Journey
1. **Entry Point** → Tap budget row in budget list → **Expected**: Navigate to detail view
2. **Overview Check** → View budget card at top → **Expected**: See remaining/spent/total amounts clearly
3. **Transaction Review** → Scroll to transactions list → **Expected**: See all related transactions with type, date, amount
4. **Detail Analysis** → Review individual transaction → **Expected**: Understand category, payment method, notes
5. **Action Taking** → Tap FAB or action buttons → **Expected**: Create new transaction or edit budget

---

## 2. Mobile Wireframes (PRIMARY DESIGN)

### 2.1 Mobile Layout - Budget Detail Page (320px - 640px)

```
┌─────────────────────────────────────┐
│ ← Presupuesto de Enero       ⋮ │ ← Header with back nav + menu
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💰 Presupuesto de Enero      │  │ ← Budget Overview Card
│  │ Alimentación • Ene 2025      │  │   Category icon + period
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │    $450,000 / $1,000,000     │  │ ← Large spent/total
│  │    ████████░░░░░░ 45%        │  │ ← Visual progress bar
│  │                               │  │
│  │  ┌─────────┬─────────────┐   │  │
│  │  │ Gastado │  Disponible │   │  │ ← Split metrics
│  │  │         │             │   │  │
│  │  │$450,000 │   $550,000  │   │  │ ← Color coded
│  │  │  45%    │     55%     │   │  │   (red/green)
│  │  └─────────┴─────────────┘   │  │
│  │                               │  │
│  │  🟢 Activo                    │  │ ← Status badge
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Movimientos (12)         ⚙️  │  │ ← Transactions header
│  └───────────────────────────────┘  │   with count + filter
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🔴 Gasto                      │  │ ← Transaction card
│  │ Supermercado                  │  │   (stacked on mobile)
│  │                               │  │
│  │ 15 Ene 2025                   │  │
│  │ Compras semanales             │  │
│  │                               │  │
│  │ -$85,000                ⋮    │  │ ← Amount + actions
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🔴 Gasto                      │  │ ← Another transaction
│  │ Restaurantes                  │  │
│  │                               │  │
│  │ 12 Ene 2025                   │  │
│  │ Cena familiar                 │  │
│  │                               │  │
│  │ -$120,000               ⋮    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🟢 Ingreso                    │  │
│  │ Reembolso                     │  │
│  │                               │  │
│  │ 10 Ene 2025                   │  │
│  │ Devolución compra             │  │
│  │                               │  │
│  │ +$45,000                ⋮    │  │
│  └───────────────────────────────┘  │
│                                     │
│             [más resultados]        │
│                                     │
│                                     │
│                            ┌─────┐  │
│                            │  +  │  │ ← Floating Action Button
│                            └─────┘  │   (Create transaction)
└─────────────────────────────────────┘
```

### 2.2 Mobile - Empty State (No Transactions)

```
┌─────────────────────────────────────┐
│ ← Presupuesto de Enero       ⋮ │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 💰 Presupuesto de Enero      │  │
│  │ Alimentación • Ene 2025      │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │    $0 / $1,000,000           │  │
│  │    ░░░░░░░░░░░░░░ 0%         │  │
│  │                               │  │
│  │  ┌─────────┬─────────────┐   │  │
│  │  │ Gastado │  Disponible │   │  │
│  │  │    $0   │$1,000,000   │   │  │
│  │  │   0%    │    100%     │   │  │
│  │  └─────────┴─────────────┘   │  │
│  │                               │  │
│  │  🟢 Activo                    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │         📋                    │  │ ← Empty state icon
│  │                               │  │
│  │  No hay movimientos           │  │ ← Empty title
│  │                               │  │
│  │  Este presupuesto aún no      │  │ ← Empty description
│  │  tiene transacciones          │  │
│  │  asociadas                    │  │
│  │                               │  │
│  │  [ Crear movimiento ]         │  │ ← CTA button
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│                            ┌─────┐  │
│                            │  +  │  │
│                            └─────┘  │
└─────────────────────────────────────┘
```

### 2.3 Mobile - Transaction Detail Expanded (Tap on card)

```
┌─────────────────────────────────────┐
│ ← Detalle de Movimiento         │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🔴 Gasto                      │  │
│  │                               │  │
│  │ Supermercado                  │  │ ← Category with icon
│  │                               │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │ Monto                         │  │
│  │ -$85,000                      │  │ ← Large amount
│  │                               │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │ Fecha                         │  │
│  │ 15 Enero 2025                 │  │
│  │                               │  │
│  │ Descripción                   │  │
│  │ Compras semanales             │  │
│  │                               │  │
│  │ Método de pago                │  │
│  │ Tarjeta de débito             │  │
│  │                               │  │
│  │ Notas                         │  │
│  │ Productos de despensa básicos │  │
│  │                               │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │ Presupuesto relacionado       │  │
│  │ Presupuesto de Enero          │  │ ← Budget link
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  [ Editar ]    [ Eliminar ]         │ ← Actions
│                                     │
└─────────────────────────────────────┘
```

### 2.4 Mobile - Filter/Sort Menu (Tap ⚙️ icon)

```
┌─────────────────────────────────────┐
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Filtrar y ordenar        ✕   │  │ ← Bottom sheet
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │ Tipo de movimiento            │  │
│  │ ○ Todos                       │  │
│  │ ○ Solo gastos                 │  │
│  │ ○ Solo ingresos               │  │
│  │                               │  │
│  │ Ordenar por                   │  │
│  │ ● Fecha (más reciente)        │  │
│  │ ○ Fecha (más antiguo)         │  │
│  │ ○ Monto (mayor a menor)       │  │
│  │ ○ Monto (menor a mayor)       │  │
│  │                               │  │
│  │ [ Aplicar filtros ]           │  │
│  │                               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 3. Desktop Wireframes (SECONDARY DESIGN)

### 3.1 Desktop Layout - Budget Detail Page (>1024px)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ← Presupuestos                                     Usuario ▼        │ ← Header
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Presupuesto de Enero                                  [ Editar ] [ ⋮ Más ]  │ ← Title + actions
│  Alimentación • Enero 2025                                                    │
│                                                                               │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │                                    │  │                                │  │
│  │  💰 Resumen del Presupuesto       │  │  📊 Estadísticas              │  │ ← Two column
│  │                                    │  │                                │  │   layout
│  │  ┌──────────────────────────────┐ │  │  ┌──────────┬──────────────┐  │  │
│  │  │                              │ │  │  │  Gastado │  Disponible  │  │  │
│  │  │    $450,000 / $1,000,000    │ │  │  │          │              │  │  │
│  │  │    ████████░░░░░░  45%      │ │  │  │ $450,000 │   $550,000   │  │  │
│  │  │                              │ │  │  │   45%    │     55%      │  │  │
│  │  └──────────────────────────────┘ │  │  └──────────┴──────────────┘  │  │
│  │                                    │  │                                │  │
│  │  Estado: 🟢 Activo                │  │  Movimientos: 12               │  │
│  │                                    │  │  Último movimiento: Hace 3 días│  │
│  │                                    │  │                                │  │
│  └────────────────────────────────────┘  └────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Movimientos Relacionados (12)                    ⚙️ Filtrar  [+ Nuevo] │ │
│  ├─────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                         │ │
│  │  Tipo       │ Categoría     │ Fecha       │ Descripción       │ Monto      │ ← Table header
│  │  ───────────┼───────────────┼─────────────┼───────────────────┼────────│ │
│  │  🔴 Gasto   │ Supermercado  │ 15 Ene 2025 │ Compras semanales │ -$85,000   │ ← Row
│  │  🔴 Gasto   │ Restaurantes  │ 12 Ene 2025 │ Cena familiar     │ -$120,000  │
│  │  🟢 Ingreso │ Reembolso     │ 10 Ene 2025 │ Devolución compra │ +$45,000   │
│  │  🔴 Gasto   │ Transporte    │ 08 Ene 2025 │ Taxi al trabajo   │ -$25,000   │
│  │  🔴 Gasto   │ Alimentación  │ 05 Ene 2025 │ Café y snacks     │ -$15,000   │
│  │  🔴 Gasto   │ Supermercado  │ 03 Ene 2025 │ Compra mensual    │ -$250,000  │
│  │                                                                         │ │
│  │                          [Mostrar más]                                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Desktop - With Side Panel Detail View

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ← Presupuestos                                     Usuario ▼        │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Presupuesto de Enero                          [ Editar ] [ ⋮ Más ]          │
│                                                                               │
│  ┌────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│  │  💰 Resumen           │  │  📋 Detalle de Movimiento                  │ │ ← Side panel
│  │                        │  ├─────────────────────────────────────────────┤ │   (when row
│  │  $450,000 / $1,000,000│  │                                             │ │   clicked)
│  │  ████████░░░░  45%    │  │  🔴 Gasto - Supermercado                   │ │
│  │                        │  │                                             │ │
│  │  🟢 Activo            │  │  Monto                                      │ │
│  └────────────────────────┘  │  -$85,000                                   │ │
│                              │                                             │ │
│  ┌────────────────────────┐  │  Fecha                                      │ │
│  │ Movimientos (12) ⚙️   │  │  15 Enero 2025                              │ │
│  ├────────────────────────┤  │                                             │ │
│  │ 🔴 -$85,000     ⋮    │  │  Descripción                                │ │
│  │ Supermercado          │  │  Compras semanales                          │ │
│  │ 15 Ene                │  │                                             │ │
│  ├────────────────────────┤  │  Método de pago                             │ │
│  │ 🔴 -$120,000    ⋮    │  │  Tarjeta de débito                          │ │
│  │ Restaurantes          │  │                                             │ │
│  │ 12 Ene                │  │  Notas                                      │ │
│  ├────────────────────────┤  │  Productos de despensa básicos              │ │
│  │ 🟢 +$45,000     ⋮    │  │                                             │ │
│  │ Reembolso             │  ├─────────────────────────────────────────────┤ │
│  │ 10 Ene                │  │  [ Editar ]              [ Eliminar ]       │ │
│  ├────────────────────────┤  │                                      ✕      │ │
│  │ [más...]              │  └─────────────────────────────────────────────┘ │
│  └────────────────────────┘                                                  │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Information Hierarchy

### Primary Information (Always Visible Above Fold)
1. **Budget Overview Card**:
   - Budget name (large, bold)
   - Category icon + name + period (secondary info)
   - Progress: Spent/Total amount (largest text)
   - Visual progress bar (high contrast)
   - Split metrics: Gastado | Disponible (color-coded)
   - Status badge

### Secondary Information (Scroll or Below Fold)
2. **Transactions List**:
   - Section header with count
   - Individual transaction cards (mobile) or table rows (desktop)
   - Per transaction: Type icon, category, date, description, amount

### Tertiary Information (On Demand)
3. **Transaction Details** (tap/click to view):
   - Full transaction information
   - Related budget link
   - Payment method
   - Notes
   - Actions (edit/delete)

---

## 5. Interface Architecture

### Layout Strategy
- **Structure**: Full page view with scrollable content
- **Mobile Grid**: Single column, stacked cards
- **Desktop Grid**: Two-column layout (summary + stats), then full-width table
- **Spacing**:
  - **Mobile**: Comfortable spacing (16px between cards, 24px sections)
  - **Desktop**: Spacious (24px between cards, 32px sections)
- **Breakpoints**:
  - **Mobile (< 640px)**:
    - Single column layout
    - Stacked cards for transactions
    - Bottom sheet for filters
    - Large touch targets (48px minimum)
    - FAB for primary action
  - **Tablet (640px - 1024px)**:
    - Two-column summary cards
    - List view for transactions (not table)
    - Modal for filters
  - **Desktop (> 1024px)**:
    - Two-column summary + stats
    - Full data table for transactions
    - Side panel for transaction details
    - Inline actions

### Visual Hierarchy
- **Focal Point**: Budget progress bar and spent/total amounts
- **Visual Flow**:
  1. Budget name → Progress indicator → Spent/Available split
  2. Down to transactions header
  3. Scan transaction list (newest first)
- **Grouping**:
  - Budget overview in single Card component
  - Transactions grouped in separate Card
  - Related info clustered (category + icon, date + description)
- **Contrast**:
  - Large font for amounts
  - Color coding (red = expenses, green = income/available)
  - Progress bar high contrast
  - Status badge prominent

---

## 6. Interaction Design

### Primary Actions
- **Action**: "Crear movimiento" (FAB on mobile, button on desktop)
  - **Type**: Primary
  - **Location**: Bottom-right FAB (mobile), top-right header (desktop)
  - **State**:
    - Default: Solid color, + icon
    - Hover: Slight elevation increase, color darken
    - Active: Press animation, scale down
    - Disabled: N/A (always enabled)
  - **Feedback**: Navigate to transaction creation form with budget pre-selected

- **Action**: "Editar presupuesto"
  - **Type**: Secondary
  - **Location**: Header menu (⋮) on mobile, button on desktop
  - **State**: Standard button states
  - **Feedback**: Navigate to budget edit form

### Secondary Actions
- **Action**: "Ver más" / Transaction row tap
  - **Type**: Tertiary / Link-like
  - **Location**: On transaction card (mobile) or table row (desktop)
  - **Feedback**:
    - Mobile: Navigate to transaction detail page
    - Desktop: Open side panel with details

- **Action**: "Filtrar y ordenar"
  - **Type**: Secondary
  - **Location**: Transactions section header (⚙️ icon)
  - **Feedback**:
    - Mobile: Bottom sheet slides up
    - Desktop: Dropdown menu

- **Action**: "Volver" (Back navigation)
  - **Type**: Navigation
  - **Location**: Top-left header
  - **Feedback**: Return to budgets list

### Micro-interactions
- **Hover Effects**:
  - Transaction rows: Subtle background color change
  - Action buttons: Opacity or color shift
- **Focus States**:
  - Visible outline (2px blue) for keyboard navigation
  - Skip to main content option
- **Loading States**:
  - Skeleton screens for budget card and transaction list
  - Shimmer animation on load
  - Spinner on FAB when creating transaction
- **Transitions**:
  - Page transitions: 200ms ease-out
  - Card/modal entry: 300ms ease-out
  - Progress bar fill: 500ms ease-in-out on load
- **Success/Error**:
  - Toast notifications (Sonner)
  - Success: Green with checkmark
  - Error: Red with X icon
  - 4 second auto-dismiss

### User Input
- **Filter/Sort**:
  - **Input Type**: Radio buttons (single choice) + checkboxes (multi)
  - **Validation**: Client-side, instant apply
  - **Error Messages**: N/A (no error states)
  - **Placeholder/Helper**: "Filtrar resultados para encontrar transacciones específicas"

---

## 7. Component Selection

### shadcn/ui Components Needed
- **Card, CardContent, CardHeader, CardTitle, CardDescription**: Budget overview container
- **Badge**: Status display (Activo/Borrador/Cerrado)
- **Button**: All CTAs (create, edit, delete, filter)
- **Table, TableBody, TableCell, TableHead, TableHeader, TableRow**: Desktop transaction list
- **Progress**: Visual progress bar for budget consumption
- **Sheet**: Mobile bottom sheet for filters
- **DropdownMenu**: Desktop filter/sort menu, action menus
- **Separator**: Visual dividers
- **ScrollArea**: Smooth scrolling for long transaction lists
- **Skeleton**: Loading states

**Note**: Coordinate with shadcn-builder agent for technical implementation

### Custom Components Needed
- **BudgetOverviewCard**: Custom organism combining budget info, progress bar, and split metrics (not in shadcn)
- **TransactionCard**: Mobile-optimized card for transaction display (mobile-specific layout)
- **TransactionListItem**: Desktop table row component with hover/click states
- **BudgetProgressBar**: Custom progress visualization with labels and color zones

---

## 8. Content Strategy

### Text Requirements
**Text Map**: `src/domains/budget/budget-detail.text-map.ts` (NEW FILE)

**Keys to Define**:

**Headings**:
- `PAGE.TITLE`: "Detalle de Presupuesto"
- `PAGE.SUBTITLE`: "Gestiona y monitorea tu presupuesto"
- `OVERVIEW.TITLE`: "Resumen del Presupuesto"
- `OVERVIEW.STATS`: "Estadísticas"
- `TRANSACTIONS.TITLE`: "Movimientos Relacionados"

**Body**:
- `OVERVIEW.SPENT_LABEL`: "Gastado"
- `OVERVIEW.AVAILABLE_LABEL`: "Disponible"
- `OVERVIEW.TOTAL_LABEL`: "Total"
- `OVERVIEW.OF_TOTAL`: "de" (for "X de Y")
- `TRANSACTIONS.COUNT`: "{count} movimientos" (interpolate)
- `TRANSACTIONS.LAST_MOVEMENT`: "Último movimiento: {time}" (interpolate)

**Actions**:
- `ACTIONS.CREATE_TRANSACTION`: "Crear movimiento"
- `ACTIONS.EDIT_BUDGET`: "Editar presupuesto"
- `ACTIONS.DELETE_BUDGET`: "Eliminar presupuesto"
- `ACTIONS.FILTER`: "Filtrar y ordenar"
- `ACTIONS.SHOW_MORE`: "Mostrar más"
- `ACTIONS.BACK`: "Volver a presupuestos"

**Feedback**:
- `SUCCESS.TRANSACTION_CREATED`: "Movimiento creado exitosamente"
- `SUCCESS.BUDGET_UPDATED`: "Presupuesto actualizado"
- `ERROR.LOAD_FAILED`: "Error al cargar el presupuesto"
- `ERROR.NO_BUDGET`: "No se encontró el presupuesto"
- `WARNING.BUDGET_EXCEEDED`: "Has superado el presupuesto"

**Placeholders**:
- `FILTER.ALL_TYPES`: "Todos los tipos"
- `FILTER.EXPENSES_ONLY`: "Solo gastos"
- `FILTER.INCOME_ONLY`: "Solo ingresos"
- `FILTER.SORT_DATE_DESC`: "Fecha (más reciente)"
- `FILTER.SORT_DATE_ASC`: "Fecha (más antiguo)"
- `FILTER.SORT_AMOUNT_DESC`: "Monto (mayor a menor)"
- `FILTER.SORT_AMOUNT_ASC`: "Monto (menor a mayor)"

**Help Text**:
- `TOOLTIPS.PROGRESS_BAR`: "Porcentaje de presupuesto consumido"
- `TOOLTIPS.SPENT`: "Total gastado hasta ahora"
- `TOOLTIPS.AVAILABLE`: "Monto disponible restante"

**Tone**: Professional but friendly, encouraging financial responsibility
**Voice**: Active voice, 2nd person (tú), direct and clear

### Microcopy
- **Empty States**:
  - **Title**: "No hay movimientos"
  - **Description**: "Este presupuesto aún no tiene transacciones asociadas. Crea tu primer movimiento para comenzar a rastrear gastos."
  - **CTA**: "Crear movimiento"
- **Error States**:
  - **Title**: "No pudimos cargar el presupuesto"
  - **Description**: "Ocurrió un error al obtener los datos. Por favor, intenta nuevamente."
  - **CTA**: "Reintentar"
- **Success States**:
  - **Message**: "Presupuesto actualizado exitosamente"
  - **Next Steps**: Auto-dismiss, stay on page with updated data
- **Loading States**:
  - **Message**: "Cargando detalles del presupuesto..."

---

## 9. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - `<header>`: Page header with title and actions
  - `<main>`: Main content area with budget overview and transactions
  - `<nav>`: Back navigation breadcrumb
- **Headings**:
  - h1: Budget name (e.g., "Presupuesto de Enero")
  - h2: Section titles ("Resumen", "Movimientos Relacionados")
  - h3: Card titles within sections
- **Lists**:
  - `<ul>` for transaction list on mobile (cards)
  - `<table>` for desktop transaction list (semantic)

### Keyboard Navigation
- **Tab Order**:
  1. Back button
  2. Header actions (Edit, More menu)
  3. Budget overview card (focusable for screen readers)
  4. Filter button
  5. Transaction list items (in order)
  6. FAB (last in tab order)
- **Shortcuts**:
  - `Escape`: Close filter menu/bottom sheet
  - `Enter`: Activate focused button or link
  - `Space`: Toggle checkboxes/radios in filter
- **Focus Management**:
  - On page load: Focus on h1 (budget name) for screen reader announcement
  - After filter apply: Focus returns to filter button
  - After modal close: Focus returns to trigger element
- **Escape Hatch**:
  - Filter menu: Tap outside or Escape key to close
  - Transaction detail: Back button or Escape to close

### Screen Reader Experience
- **ARIA Labels**:
  - Progress bar: `aria-label="Presupuesto consumido: 45%"`
  - FAB: `aria-label="Crear nuevo movimiento"`
  - Filter button: `aria-label="Filtrar y ordenar movimientos"`
  - Transaction rows: `aria-label="Gasto de $85,000 en Supermercado el 15 de enero"`
- **ARIA Descriptions**:
  - Budget overview card: `aria-describedby` linking to summary text
  - Status badge: `aria-description="Estado actual del presupuesto"`
- **Live Regions**:
  - Toast notifications: `role="status"` for success, `role="alert"` for errors
  - Transaction count: `aria-live="polite"` when filtered
- **Hidden Content**:
  - Visual progress bar percentage: Hidden text for screen readers "45 por ciento del presupuesto gastado"

### Visual Accessibility
- **Color Contrast**:
  - Text on background: Minimum 4.5:1 (WCAG AA)
  - Large text (amounts): 3:1 minimum
  - Progress bar: 3:1 contrast between filled and unfilled
- **Color Independence**:
  - Don't rely on red/green alone: Use icons (🔴 Gasto, 🟢 Ingreso) + text labels
  - Status communicated with badge text + icon, not just color
- **Text Size**:
  - Body text: 16px minimum
  - Amounts: 24-32px (large, readable)
  - Labels: 14px (acceptable for secondary info)
- **Touch Targets**:
  - Mobile buttons: 48px × 48px minimum
  - Table rows: 44px height minimum
  - FAB: 56px × 56px
- **Motion**:
  - Respect `prefers-reduced-motion`
  - Disable progress bar animation if user prefers reduced motion
  - Simplify page transitions to instant

---

## 10. Responsive Design

### Mobile (< 640px)
- **Layout**: Single column, vertically stacked
- **Navigation**:
  - Back arrow (←) in header
  - Hamburger menu for secondary actions
  - Bottom sheet for filters
- **Actions**:
  - FAB for primary action (create transaction)
  - Full-width buttons in empty states
  - Icon-only buttons in transaction cards (⋮)
- **Content**:
  - Budget overview: Full width card, stacked metrics
  - Transactions: Card-based list, one card per transaction
  - Hide secondary info (e.g., payment method) until detail view
  - Truncate long descriptions with ellipsis

### Tablet (640px - 1024px)
- **Layout**:
  - Two-column budget summary (spent | available side by side)
  - List view for transactions (not cards, not full table)
- **Navigation**:
  - Persistent back button
  - Action buttons in header (not FAB)
- **Actions**:
  - Button group in header
  - Modal for filters (not bottom sheet)
  - Inline action buttons on transaction rows

### Desktop (> 1024px)
- **Layout**:
  - Two-column summary + stats at top
  - Full-width data table for transactions
  - Side panel for transaction details (optional)
- **Navigation**:
  - Breadcrumb navigation
  - Full action buttons in header
- **Actions**:
  - "Crear movimiento" button in header (no FAB)
  - Dropdown menu for filters
  - Inline edit/delete in table rows
- **Additional**:
  - Hover states on table rows
  - Click to open side panel (no navigation)
  - Bulk selection with checkboxes (future enhancement)
  - Export to CSV option (future enhancement)

---

## 11. States & Feedback

### Loading States
- **Initial Load**:
  - Skeleton for budget overview card (shimmer animation)
  - Skeleton for 3-5 transaction cards/rows
  - Page title and header visible immediately
- **Action Feedback**:
  - FAB: Spinner replaces + icon during creation
  - Filter button: Spinner during apply
  - Delete button: Loading state, disabled during operation
- **Optimistic Updates**:
  - Status change: Update UI immediately, revert on error
  - Transaction creation: Add to list optimistically, show pending state

### Error States
- **Validation Errors**:
  - Inline error messages (not applicable on this page - only on forms)
- **System Errors**:
  - **Budget load failed**:
    - Toast: "Error al cargar el presupuesto. Intenta nuevamente."
    - Card with error icon and retry button
  - **Transaction load failed**:
    - Empty state with error message
    - "Reintentar" button
  - **Delete failed**:
    - Toast: "No se pudo eliminar. Intenta nuevamente."
    - Keep item in list
- **Recovery**:
  - Retry button for failed loads
  - Clear explanation of what went wrong
  - Contact support link for persistent errors

### Empty States
- **No Transactions**:
  - Icon: 📋 (clipboard)
  - Title: "No hay movimientos"
  - Description: "Este presupuesto aún no tiene transacciones asociadas. Crea tu primer movimiento para comenzar a rastrear gastos."
  - CTA: "Crear movimiento" button
- **No Results (Filtered)**:
  - Icon: 🔍 (magnifying glass)
  - Title: "No se encontraron resultados"
  - Description: "Intenta ajustar los filtros para ver más movimientos."
  - CTA: "Limpiar filtros" button
- **Budget Not Found**:
  - Icon: ⚠️ (warning)
  - Title: "Presupuesto no encontrado"
  - Description: "El presupuesto que buscas no existe o fue eliminado."
  - CTA: "Volver a presupuestos" button

### Success States
- **Transaction Created**:
  - Toast: "Movimiento creado exitosamente" (green, checkmark icon)
  - Transaction appears in list
  - Budget metrics update
- **Budget Updated**:
  - Toast: "Presupuesto actualizado exitosamente"
  - Overview card refreshes with new data
- **Transaction Deleted**:
  - Toast: "Movimiento eliminado"
  - Item removes from list with fade-out animation
  - Budget metrics recalculate

### Warning States
- **Budget Exceeded**:
  - Progress bar turns red when >100%
  - Alert banner above transactions: "⚠️ Has superado el presupuesto en $X"
  - Persistent until budget is adjusted or closed
- **Near Budget Limit**:
  - Progress bar turns amber when >80%
  - Subtle notice: "Estás cerca del límite de tu presupuesto"

---

## 12. User Flow Diagram

```
[Budgets List Page]
    ↓ (Tap budget row)
[Budget Detail Page Loads]
    ↓
[View Budget Overview]
    ↓
    ├─> [Spent > Total?] → YES → [Show Warning Banner]
    └─> [Spent > Total?] → NO → [Show Normal Progress]
    ↓
[Scroll to Transactions]
    ↓
    ├─> [No transactions?] → YES → [Empty State: "Crear movimiento"]
    │                                   ↓
    │                          [Navigate to Transaction Form]
    │
    └─> [Transactions exist?] → YES → [Display Transaction List]
                                          ↓
                                  ├─> [Tap FAB] → [Create Transaction]
                                  │                      ↓
                                  │              [Transaction Form (budget pre-selected)]
                                  │                      ↓
                                  │              [Save Transaction]
                                  │                      ↓
                                  │              [Return to Budget Detail]
                                  │                      ↓
                                  │              [Toast: Success]
                                  │                      ↓
                                  │              [List Updates]
                                  │
                                  ├─> [Tap Filter ⚙️] → [Open Filter Menu]
                                  │                      ↓
                                  │              [Select Filters]
                                  │                      ↓
                                  │              [Apply]
                                  │                      ↓
                                  │              [List Filters/Updates]
                                  │
                                  ├─> [Tap Transaction Row] → [View Transaction Detail]
                                  │                              ↓
                                  │                      ├─> [Tap Edit] → [Edit Form]
                                  │                      └─> [Tap Delete] → [Confirm] → [Delete]
                                  │
                                  └─> [Tap Edit Budget] → [Edit Budget Form]
                                                              ↓
                                                      [Save Changes]
                                                              ↓
                                                      [Return to Detail]
                                                              ↓
                                                      [Overview Updates]
```

---

## 13. Design Specifications

### Spacing Scale
- **Tight**:
  - Between related labels and values (4px)
  - Icon and text in badges (4px)
- **Normal**:
  - Between form fields (12px)
  - Card padding (16px)
  - Between cards (16px on mobile, 20px on desktop)
- **Relaxed**:
  - Between major sections (24px on mobile, 32px on desktop)
  - Page padding (24px top/bottom, 16px sides on mobile)

### Typography
- **Headings**:
  - h1 (Budget name): 28px, font-weight 700 (mobile), 32px (desktop)
  - h2 (Section titles): 20px, font-weight 600
  - h3 (Card titles): 16px, font-weight 600
- **Body**:
  - Default: 16px, line-height 1.5
  - Small text (labels): 14px, line-height 1.4
  - Tiny text (helper): 12px, line-height 1.3
- **Amounts**:
  - Large (budget total): 32px, font-weight 700
  - Medium (spent/available): 24px, font-weight 600
  - Small (transaction amounts): 16px, font-weight 600
- **Labels**:
  - Uppercase labels: 12px, font-weight 600, letter-spacing 0.5px

### Color Usage
- **Primary**:
  - CTAs (buttons, links)
  - Progress bar fill (when under budget)
  - Active states
- **Secondary**:
  - Secondary buttons
  - Borders
  - Disabled states
- **Accent**:
  - FAB background
  - Hover states on interactive elements
- **Semantic**:
  - **Success** (Green):
    - Income badges
    - Available amount
    - Success toasts
    - Progress bar when <50%
  - **Warning** (Amber):
    - Progress bar when 80-99%
    - Warning banners
  - **Error** (Red):
    - Expense badges
    - Spent amount
    - Progress bar when >100%
    - Error toasts
  - **Info** (Blue):
    - Status badges
    - Informational messages

---

## 14. Performance Considerations

- **Critical Path**:
  1. Load budget overview data first (priority)
  2. Load first 10 transactions
  3. Load remaining transactions on scroll or "Show more"
- **Lazy Loading**:
  - Transactions beyond first page (virtual scrolling on desktop)
  - Transaction details loaded on demand
  - Images/icons lazy loaded
- **Image Optimization**:
  - Category icons: SVG (scalable, small)
  - Use icon libraries (Lucide) for consistency
- **Animation Budget**:
  - Limit animations to 60fps
  - Progress bar animation: 500ms max
  - Page transitions: 200-300ms
  - No parallax or heavy animations on mobile

---

## 15. Implementation Coordination

### Agent Collaboration
- **shadcn-builder**:
  - Need: Card, Badge, Button, Table, Progress, Sheet, DropdownMenu, Skeleton
  - Custom components: BudgetOverviewCard, TransactionCard
- **domain-architect**:
  - Need: Define budget detail repository methods
  - Need: Define transaction filtering/sorting logic
  - Need: Relationship between budgets and transactions
  - Need: Budget status business rules
- **nextjs-builder**:
  - Need: Page routing `/presupuesto/[id]`
  - Need: Server component for data fetching
  - Need: Client components for interactive elements
  - Need: Suspense boundaries
- **Parent**:
  - Sequence:
    1. domain-architect defines data layer
    2. shadcn-builder prepares components
    3. ux-ui-designer (this agent) provides text map
    4. nextjs-builder implements page

### Files Impacted
- **Components**:
  - `src/domains/budget/components/organisms/budget-overview-card.tsx` (NEW)
  - `src/domains/budget/components/organisms/budget-progress-bar.tsx` (NEW)
  - `src/domains/transaction/components/molecules/transaction-card.tsx` (NEW)
  - `src/domains/transaction/components/organisms/transaction-list.tsx` (NEW)
  - `src/domains/transaction/components/organisms/transaction-table.tsx` (NEW - desktop)
- **Text Maps**:
  - `src/domains/budget/budget-detail.text-map.ts` (NEW)
- **Pages**:
  - `src/app/(app)/presupuesto/[id]/page.tsx` (NEW)
- **Styles**:
  - `src/styles/components/organisms/budget-overview-card.css` (NEW - if custom styles needed)
  - `src/styles/components/molecules/transaction-card.css` (NEW)

---

## 16. Important Notes

⚠️ **User testing recommended**: This is a high-impact feature showing critical financial data. Test with real users to validate information hierarchy and readability.

⚠️ **Accessibility is mandatory**: Budget information must be accessible to all users, including those using screen readers. Progress bar must have text alternatives.

💡 **Mobile-first**: This design prioritizes mobile experience. 80% of users will view this on mobile devices. Desktop is secondary.

💡 **Content before chrome**: Focus on displaying budget and transaction data clearly. Avoid decorative elements that don't add value.

📝 **Iterate**: Design will evolve based on:
- User feedback on information density
- Performance metrics (load time, interaction latency)
- Accessibility testing results

🎨 **Consistency**: This page must match existing budget list and transaction list patterns:
- Same Card components
- Same Badge variants
- Same color coding (red/green for expenses/income)
- Same EmptyState component

---

## 17. Success Metrics

- **Usability**:
  - Users can identify budget status (healthy/warning/exceeded) within 3 seconds
  - Users can find a specific transaction within 10 seconds
  - Zero confusion about what "Gastado" vs "Disponible" means
- **Efficiency**:
  - Budget detail page loads in <2 seconds
  - Creating a transaction from this page takes <30 seconds
  - Filtering transactions completes in <500ms
- **Satisfaction**:
  - User surveys: "I can easily understand my budget status" >4.5/5
  - NPS score for this feature >8/10
- **Accessibility**:
  - Screen reader testing: 100% of information accessible
  - Keyboard-only navigation: All actions reachable
  - Color blind testing: Information conveyed without color alone
- **Performance**:
  - First Contentful Paint: <1.5s
  - Time to Interactive: <3s
  - Largest Contentful Paint: <2.5s

---

## 18. Open Questions for Parent/Other Agents

1. **Data Layer**:
   - Q: Should transactions be paginated or infinite scroll?
   - Recommendation: Paginate on mobile (show 10, load more), virtual scroll on desktop

2. **Real-time Updates**:
   - Q: Should budget metrics update in real-time if transactions are added elsewhere?
   - Recommendation: No real-time for MVP, manual refresh acceptable

3. **Filtering**:
   - Q: What filters are most important? Type (income/expense), date range, category, amount range?
   - Recommendation: Start with type and date sorting only, add more based on feedback

4. **Budget Exceeded Behavior**:
   - Q: Should system prevent creating transactions when budget is exceeded?
   - Recommendation: Allow but show prominent warning

5. **Navigation**:
   - Q: Should tapping a transaction navigate to a new page or open a modal/panel?
   - Recommendation: Mobile = new page, Desktop = side panel

---

**END OF UX/UI DESIGN PLAN**
