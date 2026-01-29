# Budget Allocation - UX/UI Design Plan

**Created**: 2026-01-28
**Session**: budget-allocation-20260128
**Complexity**: Medium
**User Impact**: High

## 1. User Context

### User Goals

- **Primary Goal**: Visually track how available funds (general fund) are mentally allocated across different budget categories
- **Secondary Goals**:
  - Understand fund distribution at a glance via pie chart
  - Quickly allocate money to a budget with minimal clicks
  - Maintain overview of where money is "earmarked"
- **Success Criteria**:
  - User can create allocation in < 3 clicks
  - Pie chart is immediately understandable
  - User feels in control of fund distribution

### User Personas

- **Primary**: Personal finance tracker (individual managing personal budget)
- **Context**: Reviewing finances on home dashboard or managing specific budget
- **Pain Points**:
  - Hard to visualize how available money should be distributed
  - Too many clicks to organize funds mentally
  - Unclear what portion of general fund is "spoken for"

### User Journey

#### Journey 1: View Fund Distribution (Home Page)
1. User lands on home page → Sees pie chart card → Understands allocation distribution
2. User hovers over pie segment → Sees budget name and amount → Gains insight
3. User clicks segment (optional) → Navigates to budget detail → Can manage allocations

#### Journey 2: Create Allocation (Budget Detail Page)
1. User views budget detail → Sees "Add from General Fund" button → Clicks
2. Inline form appears / Modal opens → Enters amount → Confirms
3. Allocation created → Visual feedback (toast) → Chart updates

#### Journey 3: Remove Allocation (Budget Detail Page)
1. User sees allocation in transaction list → Identifies allocation → Clicks delete icon
2. Confirmation prompt → Confirms deletion → Allocation removed
3. Visual feedback → Chart updates

## 2. Interface Architecture

### Component 1: Allocation Distribution Pie Chart (Home Page)

**Location**: Home page, below or alongside balance gauge

**Information Hierarchy**:
1. **Primary**: Pie chart visual (large, prominent)
2. **Secondary**: Legend with budget names and amounts
3. **Tertiary**: Total allocated amount, unallocated portion

**Layout Strategy**:
- **Structure**: Card component with chart and legend
- **Grid**: Full-width on mobile, 50% width on desktop (alongside other cards)
- **Spacing**: Comfortable padding (p-6)
- **Breakpoints**:
  - Mobile (< 640px): Chart above legend, stacked layout
  - Tablet (640px - 1024px): Chart and legend side-by-side
  - Desktop (> 1024px): Same as tablet, larger chart size

**Visual Hierarchy**:
- **Focal Point**: Pie chart center with total amount
- **Visual Flow**: Chart → Legend → Unallocated indicator
- **Grouping**: Chart + legend as cohesive unit
- **Contrast**: Color-coded segments, clear labels

### Component 2: Add Allocation Interface (Budget Detail Page)

**Location**: Budget detail page, in header or action area

**Layout Options (Choose One)**:

**Option A: Inline Form (Recommended - Fewer Clicks)**
- Button reveals inline form below header
- Form stays on same page (no modal)
- Minimal: Amount input + Category selector + Confirm button
- Cancels easily with ESC or Cancel button

**Option B: Modal Dialog**
- Button opens modal overlay
- Form in centered dialog
- Same fields as Option A
- Closes on submit or cancel

**Recommendation**: Option A (inline) for fewer clicks and better flow

**Information Hierarchy**:
1. **Primary**: Amount input (most important)
2. **Secondary**: Category selector (context for allocation)
3. **Tertiary**: Date (defaults to today), optional description

**Visual Hierarchy**:
- **Focal Point**: Amount input (large, prominent)
- **Visual Flow**: Amount → Category → Confirm
- **Grouping**: All form fields together
- **Contrast**: Primary button (confirm) vs. secondary (cancel)

### Component 3: Allocation Display in Transaction List

**Location**: Budget detail page, transaction list

**Visual Distinction**:
- Different icon from income/expense (e.g., tag icon, transfer icon)
- Subtle background color (e.g., blue-50)
- Label: "Asignación del fondo general"
- Amount displays in different style (not green/red like income/expense)

**Actions**:
- Delete icon (trash) on hover/focus
- No edit action (per requirements)

## 3. Interaction Design

### Primary Actions

#### Action: "Añadir del Fondo General" (Budget Detail Page)

- **Type**: Secondary button (not primary to avoid overwhelming)
- **Location**: Budget header, near other actions
- **Icon**: Plus icon + "Añadir del Fondo General"
- **State**:
  - Default: Secondary button style
  - Hover: Slight background change
  - Active: Form reveals (inline) or modal opens
  - Disabled: N/A (always available)
- **Feedback**:
  - Click → Form appears with smooth transition
  - Focus on amount input automatically

#### Action: "Confirmar Asignación" (Form Submit)

- **Type**: Primary button
- **Location**: Bottom of form (inline or modal)
- **Text**: "Confirmar" or "Asignar"
- **State**:
  - Default: Enabled if amount > 0 and category selected
  - Hover: Background darkens
  - Active: Loading state (spinner)
  - Disabled: Greyed out if invalid
- **Feedback**:
  - Submit → Loading (500ms) → Success toast → Form closes → Chart updates

#### Action: "Eliminar Asignación" (Delete)

- **Type**: Destructive icon button
- **Location**: Transaction list item, right side
- **Icon**: Trash icon
- **State**:
  - Default: Subtle, appears on hover
  - Hover: Red color hint
  - Active: Confirmation dialog
- **Feedback**:
  - Click → Confirmation dialog → Confirm → Success toast → Item removed

### Secondary Actions

#### Action: "Cancelar" (Form Cancel)

- **Type**: Secondary button or link
- **Location**: Next to primary button in form
- **Text**: "Cancelar"
- **Feedback**: Click → Form closes, no changes saved

#### Action: Pie Chart Segment Click (Optional)

- **Type**: Interactive chart segment
- **Feedback**: Click → Navigate to budget detail page

### Micro-interactions

- **Hover Effects**:
  - Pie chart segments: Slight scale up, show tooltip
  - Buttons: Background color change
  - Transaction list items: Background highlight
- **Focus States**:
  - Clear focus ring on all interactive elements
  - Form inputs have visible focus state
- **Loading States**:
  - Allocation form submit: Button with spinner
  - Chart data: Skeleton loader on initial load
- **Transitions**:
  - Form reveal: 200ms ease-out slide down
  - Toast notifications: 300ms fade in/out
  - Chart updates: Smooth animation (300ms)
- **Success/Error**:
  - Success: Green toast with checkmark icon
  - Error: Red toast with error icon, actionable message

### User Input

#### Amount Input

- **Type**: Number input (currency)
- **Validation**: Real-time (on change)
- **Rules**:
  - Must be > 0
  - Max 999,999,999
  - Decimals allowed (2 max)
- **Error Messages**:
  - "El monto debe ser mayor a 0"
  - "El monto es demasiado grande"
- **Placeholder**: "0.00"
- **Helper**: "Monto a asignar del fondo general"

#### Category Selector

- **Type**: Select dropdown
- **Validation**: On submit
- **Rules**: Must select a category
- **Error Messages**: "Debe seleccionar una categoría"
- **Placeholder**: "Seleccionar categoría"
- **Helper**: "Categoría para rastrear esta asignación"

#### Date Input (Optional/Hidden by default)

- **Type**: Date picker
- **Default**: Today's date
- **Validation**: Valid date
- **Helper**: "Fecha de la asignación"

#### Description Input (Optional)

- **Type**: Text input (optional)
- **Validation**: Max 200 characters
- **Placeholder**: "Descripción opcional"
- **Helper**: "Añade una nota si deseas"

## 4. Component Selection

### shadcn/ui Components Needed

- **Card**: Container for pie chart component
- **Button**: Primary, secondary, and icon buttons
- **Dialog** (if using modal approach): Allocation form modal
- **Input**: Amount and description fields
- **Select**: Category dropdown
- **Label**: Form field labels
- **Separator**: Visual dividers
- **Tooltip**: Hover information on chart segments
- **Toast**: Success/error notifications
- **Badge**: Visual indicator for allocation type in list
- **Alert**: Optional warning if exceeding general fund (if implemented)

### Chart Components

- **Recharts** (via shadcn chart components):
  - **PieChart**: Main visualization
  - **Pie**: Data representation
  - **Cell**: Individual segments with colors
  - **Tooltip**: Hover details
  - **Legend**: Budget labels and amounts
  - **ResponsiveContainer**: Responsive sizing

### Custom Components Needed

- **AllocationForm**: Inline form component (if not using Dialog)
- **AllocationListItem**: Transaction list item with special styling for allocations
- **AllocationDistributionCard**: Wrapper for pie chart + legend + totals

## 5. Content Strategy

### Text Requirements

**Text Map**: `src/domains/budget/allocation.text-map.ts`

**Keys to Define**:

```typescript
export const allocationTextMap = {
  // Headings
  chartTitle: "Distribución de Asignaciones",
  chartSubtitle: "Cómo está distribuido tu fondo general",
  formTitle: "Asignar del Fondo General",

  // Actions
  addAllocationButton: "Añadir del Fondo General",
  confirmButton: "Asignar",
  cancelButton: "Cancelar",
  deleteButton: "Eliminar",

  // Form Labels
  amountLabel: "Monto",
  categoryLabel: "Categoría",
  dateLabel: "Fecha",
  descriptionLabel: "Descripción (opcional)",

  // Placeholders
  amountPlaceholder: "0.00",
  categoryPlaceholder: "Seleccionar categoría",
  descriptionPlaceholder: "Añade una nota si deseas",

  // Helper Text
  amountHelper: "Monto a asignar del fondo general",
  categoryHelper: "Categoría para rastrear esta asignación",

  // Feedback Messages
  successCreate: "Asignación creada exitosamente",
  successDelete: "Asignación eliminada",
  errorCreate: "Error al crear asignación",
  errorDelete: "Error al eliminar asignación",

  // Validation Errors
  amountRequired: "El monto es requerido",
  amountPositive: "El monto debe ser mayor a 0",
  amountTooLarge: "El monto es demasiado grande",
  categoryRequired: "Debe seleccionar una categoría",
  dateInvalid: "Fecha inválida",
  descriptionTooLong: "La descripción no puede exceder 200 caracteres",

  // Empty States
  noAllocationsYet: "Aún no has hecho asignaciones",
  noAllocationsDescription: "Comienza asignando dinero del fondo general a tus presupuestos",

  // Chart Legend
  unallocated: "Sin asignar",
  totalAllocated: "Total asignado",

  // Transaction List
  allocationLabel: "Asignación del fondo general",
  allocationDescription: "Asignado desde el fondo general",

  // Confirmation
  deleteConfirmTitle: "¿Eliminar asignación?",
  deleteConfirmMessage: "Esta acción no se puede deshacer",
  deleteConfirmButton: "Sí, eliminar",
  deleteCancelButton: "Cancelar",
} as const;
```

**Tone**: Friendly, encouraging, clear
**Voice**: Second person (tú), active voice

### Microcopy

- **Empty States**:
  - Encouraging: "Aún no has hecho asignaciones. ¡Comienza organizando tu fondo general!"
  - Actionable: Clear button to create first allocation
- **Error States**:
  - Empathetic: "Lo sentimos, algo salió mal"
  - Solution-oriented: "Por favor intenta de nuevo o contacta soporte"
- **Success States**:
  - Congratulatory: "¡Perfecto!"
  - Next-steps: "Tu asignación se ha creado exitosamente"
- **Loading States**:
  - Informative: "Creando asignación..."
  - Patient: "Esto tomará solo un momento"

## 6. Accessibility Design

### Semantic Structure

- **Landmarks**:
  - `<main>`: Home page content with chart
  - `<section>`: Chart card and allocation form sections
  - `<form>`: Allocation creation form
- **Headings**:
  - h2: "Distribución de Asignaciones"
  - h3: Budget names in legend (if using headings)
- **Lists**:
  - `<ul>`: Legend items
  - `<ul>`: Transaction list with allocations

### Keyboard Navigation

- **Tab Order**:
  1. "Añadir del Fondo General" button
  2. Amount input
  3. Category select
  4. Date input (if visible)
  5. Description input (if visible)
  6. Confirm button
  7. Cancel button
- **Shortcuts**:
  - Enter: Submit form (when focused on inputs)
  - Escape: Close form/modal
- **Focus Management**:
  - Form open: Focus moves to amount input
  - Form close: Focus returns to trigger button
  - Delete action: Focus moves to next list item
- **Escape Hatch**:
  - ESC key closes form without saving
  - Cancel button closes form
  - Click outside modal closes (if using modal)

### Screen Reader Experience

- **ARIA Labels**:
  - Chart: `aria-label="Gráfica de distribución de asignaciones"`
  - Amount input: `aria-label="Monto a asignar"`
  - Category select: `aria-label="Categoría de asignación"`
  - Delete button: `aria-label="Eliminar asignación de [BudgetName]"`
- **ARIA Descriptions**:
  - Chart: `aria-describedby` linking to chart subtitle
  - Form: `aria-describedby` linking to form description
- **Live Regions**:
  - Toast notifications: `role="status"` or `role="alert"`
  - Chart updates: Announce when data changes
- **Hidden Content**:
  - Visually hidden text for chart segments (for screen readers)
  - "Nuevo" badge if allocation is recent

### Visual Accessibility

- **Color Contrast**:
  - Text: Minimum 4.5:1 (WCAG AA)
  - Interactive elements: Minimum 3:1
  - Chart segments: Distinguishable by pattern if needed (not just color)
- **Color Independence**:
  - Allocation type indicated by icon + text label (not just color)
  - Chart segments have labels, not relying on color alone
- **Text Size**:
  - Body text: 16px minimum
  - Chart labels: 14px minimum
- **Touch Targets**:
  - All buttons: Minimum 44x44px
  - Chart segments: Large enough to tap on mobile
- **Motion**:
  - Respect `prefers-reduced-motion`
  - Disable chart animations if user prefers
  - Instant transitions instead of animations

## 7. Responsive Design

### Mobile (< 640px)

- **Layout**:
  - Pie chart: Full-width, smaller size (200px diameter)
  - Legend: Below chart, stacked vertically
  - Allocation form: Full-width modal or inline
  - Transaction list: Single column, compact spacing
- **Navigation**:
  - "Add Allocation" button: Fixed at bottom (sticky) or in header
- **Actions**:
  - Full-width buttons in form
  - Large touch targets (min 44px)
- **Content**:
  - Prioritize chart visual over detailed numbers
  - Collapse less important info

### Tablet (640px - 1024px)

- **Layout**:
  - Pie chart: 50% width, legend alongside (300px diameter)
  - Allocation form: Modal centered or inline (600px max-width)
  - Transaction list: Comfortable spacing
- **Navigation**:
  - "Add Allocation" button in budget header
- **Actions**:
  - Standard button sizes
  - Inline actions on hover

### Desktop (> 1024px)

- **Layout**:
  - Pie chart: 50% width, large size (400px diameter)
  - Legend: Right side of chart, aligned
  - Allocation form: Modal centered (600px) or inline form
  - Transaction list: Multi-column if many items
- **Navigation**:
  - Full navigation, chart in grid layout
- **Actions**:
  - Inline buttons, hover states
  - Keyboard shortcuts displayed
- **Additional**:
  - Tooltip on chart hover shows detailed breakdown
  - Animation effects on chart segments

## 8. User Flow Wireframes

### Flow 1: Home Page - View Distribution

```
┌─────────────────────────────────────┐
│  Home Page                          │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Balance Gauge Card            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Distribución de Asignaciones  │ │
│  │                               │ │
│  │   [Pie Chart]    Legend       │ │
│  │      🥧         □ Comida 30%  │ │
│  │                 □ Renta 40%   │ │
│  │                 □ Otros 20%   │ │
│  │                 ▢ Sin asignar │ │
│  │                                │ │
│  │  Total asignado: $1,200       │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Other Cards...]                  │
└─────────────────────────────────────┘
```

### Flow 2: Budget Detail - Add Allocation (Inline)

```
┌─────────────────────────────────────┐
│  Budget: Comida                     │
├─────────────────────────────────────┤
│                                     │
│  [← Back] Comida    [Añadir del     │
│                      Fondo General] │<-- Click
│                                     │
│  ──────────────────────────────────│
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Asignar del Fondo General     │ │<-- Form appears
│  │                               │ │
│  │  Monto *                      │ │
│  │  [    500.00    ] 💲         │ │<-- Focus here
│  │                               │ │
│  │  Categoría *                  │ │
│  │  [Comida ▼]                   │ │
│  │                               │ │
│  │  Descripción (opcional)       │ │
│  │  [                        ]   │ │
│  │                               │ │
│  │  [Cancelar] [Asignar]         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ──────────────────────────────────│
│                                     │
│  Movimientos                        │
│  ┌───────────────────────────────┐ │
│  │ 📌 Asignación del fondo        │ │
│  │    +$300.00          [🗑️]     │ │
│  │    28 ene 2026                 │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🍕 Comida                       │ │
│  │    -$50.00           [✏️] [🗑️]│ │
│  │    27 ene 2026                 │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Flow 3: Delete Allocation Confirmation

```
┌─────────────────────────────────────┐
│                                     │
│    ┌─────────────────────────┐     │
│    │ ¿Eliminar asignación?   │     │
│    │                         │     │
│    │ Esta acción no se puede │     │
│    │ deshacer.               │     │
│    │                         │     │
│    │ [Cancelar] [Sí,eliminar]│     │
│    └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

## 9. Visual Design Guidelines

### Color Palette for Pie Chart

Use distinct, accessible colors with sufficient contrast:

```typescript
const chartColors = [
  'hsl(var(--chart-1))', // Primary
  'hsl(var(--chart-2))', // Secondary
  'hsl(var(--chart-3))', // Tertiary
  'hsl(var(--chart-4))', // Quaternary
  'hsl(var(--chart-5))', // Quinary
  'hsl(var(--muted))',   // Unallocated (muted color)
];
```

### Typography

- **Chart Title**: text-lg font-semibold
- **Legend Labels**: text-sm font-medium
- **Amounts**: text-sm font-mono (for alignment)
- **Form Labels**: text-sm font-medium
- **Helper Text**: text-xs text-muted-foreground

### Spacing

- **Card Padding**: p-6
- **Form Field Spacing**: space-y-4
- **Button Spacing**: gap-2
- **Chart Margin**: m-4

### Icons

- **Allocation**: Tag icon, transfer-arrow icon, or layers icon
- **Add**: Plus icon
- **Delete**: Trash icon
- **Success**: Check-circle icon
- **Error**: Alert-circle icon

## 10. Edge Cases & Error Handling

### Edge Case 1: No General Fund Available

**Scenario**: User tries to allocate but has no general fund (all income assigned to budgets)

**Solution**:
- Disable "Add Allocation" button
- Tooltip explains: "No hay fondos disponibles en el fondo general"
- Helpful message: "Todos tus ingresos están asignados a presupuestos"

### Edge Case 2: No Allocations Yet

**Scenario**: Pie chart has no data to display

**Solution**:
- Empty state illustration or icon
- Message: "Aún no has hecho asignaciones"
- Call-to-action: "Comienza organizando tu fondo general"
- Optional: Link to tutorial or first budget

### Edge Case 3: Many Budgets (> 10)

**Scenario**: Pie chart becomes cluttered with too many segments

**Solution**:
- Group smaller allocations into "Otros" category
- Threshold: < 5% of total → grouped
- Click "Otros" to see detailed breakdown

### Edge Case 4: Allocation Exceeds General Fund

**Scenario**: User allocates more than available in general fund (virtual tracking, no limit)

**Solution**:
- Allow it (per requirements: no limits)
- Optional warning (not blocking): "Has asignado más del fondo disponible"
- Chart shows > 100% if needed (visual cue)

### Error Handling

#### API Errors

**Error**: Server action fails (network, DB error)

**Response**:
- Toast notification: "Error al crear asignación. Por favor intenta de nuevo."
- Form stays open with user's input preserved
- Retry button or auto-retry after 2 seconds

#### Validation Errors

**Error**: Invalid input (amount <= 0, missing category)

**Response**:
- Inline error message below field
- Field border turns red
- Focus returns to invalid field
- Submit button disabled until fixed

#### Permission Errors

**Error**: User tries to allocate to budget they don't own

**Response**:
- Toast notification: "No tienes permisos para este presupuesto"
- Form closes
- Redirect to home or budget list

## 11. Files to Create/Modify

### New Files

- `src/domains/budget/allocation.text-map.ts` - Text content
- `src/domains/budget/components/organisms/allocation-distribution-chart.tsx` - Pie chart component
- `src/domains/budget/components/molecules/allocation-form.tsx` - Allocation creation form
- `src/domains/budget/components/atoms/allocation-badge.tsx` - Badge for allocation type in list
- `src/domains/budget/components/molecules/empty-allocations-state.tsx` - Empty state component

### Modified Files

- `src/app/(app)/home/page.tsx` - Add pie chart card
- `src/app/(app)/budgets/[id]/page.tsx` - Add allocation button and form
- `src/domains/budget/components/organisms/budget-transaction-list.tsx` - Display allocations differently
- `src/domains/budget/components/organisms/budget-detail-header.tsx` - Add "Añadir del Fondo General" button

## 12. Implementation Priority

### Phase 1: Core Functionality (MVP)

1. ✅ Pie chart component with basic data
2. ✅ Allocation form (inline or modal - choose one)
3. ✅ Basic create/delete operations
4. ✅ Toast notifications for feedback

### Phase 2: Enhanced UX

1. Chart interactivity (hover, click)
2. Improved form validation and error messages
3. Loading states and skeletons
4. Empty states with illustrations

### Phase 3: Polish

1. Animations and transitions
2. Accessibility enhancements
3. Responsive optimizations
4. Keyboard shortcuts

## 13. Coordination with Other Agents

- **shadcn-builder**:
  - Select recharts components for pie chart
  - Dialog vs inline form decision
  - Toast notification component
  - Badge component for allocations
- **nextjs-builder**:
  - Home page integration (where to place chart)
  - Budget detail page integration (button placement)
  - Data fetching strategy for chart
- **domain-architect**:
  - Use `AllocationDistribution` type for chart data
  - Use `useAllocationDistribution` hook for data
  - Use `createAllocation` and `deleteAllocation` server actions

## 14. Success Metrics

- **Task Completion**: User can create allocation in < 3 clicks ✅
- **Comprehension**: User understands chart within 5 seconds of viewing
- **Accessibility**: Passes WCAG 2.1 AA automated tests
- **Performance**: Chart renders in < 500ms
- **Usability**: Zero confusion in user testing (if conducted)

---

**Next Steps**:
1. shadcn-builder selects chart components
2. nextjs-builder plans page integration
3. Parent implements components following this design
