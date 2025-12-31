# Mis Finanzas - UX/UI Design Plan

**Created**: 2025-12-30  
**Session**: 1767147315  
**Complexity**: High  
**User Impact**: Critical

---

## 1. User Context

### User Goals

**Primary Goal**: Understand financial situation in under 5 seconds and make informed spending decisions

**Secondary Goals**:

- Add transactions in under 30 seconds (mobile-optimized)
- Track budget progress without manual calculations
- Identify spending patterns through visual insights
- Plan monthly budgets with confidence
- Achieve savings goals through structured tracking

**Success Criteria**:

- User can see income, expenses, and balance immediately upon login
- User can add a transaction with max 3 taps (mobile)
- User understands budget status through color-coded visual feedback
- User can navigate to any page within 2 taps/clicks
- All interactions provide immediate visual feedback

### User Personas

**Primary Persona**: "Financial Beginner Maria"

- **Age**: 25-40
- **Context**: Mobile-first user, checks finances daily during commute or lunch break
- **Technical Level**: Basic (comfortable with mobile apps, not financial software)
- **Pain Points**:
  - Existing apps are overwhelming with features she doesn't use
  - Forgets to track expenses, leading to surprise overspending
  - Doesn't understand complex financial reports
  - Limited time for financial management
- **Needs**:
  - Fast transaction entry (one-handed mobile use)
  - Clear visual indication of "safe to spend" vs "slow down"
  - Encouraging feedback, not judgmental
  - Offline access to view data

**Secondary Persona**: "Desktop Planner Carlos"

- **Age**: 30-50
- **Context**: Plans budget on desktop during monthly review, tracks expenses on mobile
- **Technical Level**: Intermediate
- **Pain Points**:
  - Needs more screen real estate for detailed budget planning
  - Wants historical data analysis for trend identification
- **Needs**:
  - Multi-column layouts for side-by-side comparisons
  - Detailed charts and reports
  - Keyboard navigation for efficiency

### User Journey

**First-Time User Journey**:

1. **Registration** → Enter email & password → Receive confirmation → Auto-redirect to onboarding
2. **Onboarding** → See empty state dashboard with "Create your first budget" CTA
3. **Budget Creation** → Enter total amount → Allocate categories (guided) → Save
4. **First Transaction** → Tap "Add Expense" FAB → Enter amount & category → See budget update immediately
5. **Discover Features** → Explore dashboard cards → View reports → Set goals

**Daily Active User Journey**:

1. **Login** → Dashboard loads instantly with current month
2. **Quick Scan** → Glance at balance (color-coded) → Check budget progress bars
3. **Add Transaction** → FAB → Enter details → Submit → See confirmation
4. **Weekly Review** → Change month selector → Review trends → Adjust behavior

**Monthly Planning Journey**:

1. **Month End** → Review current month report → Identify overspending categories
2. **New Budget** → Duplicate previous budget → Adjust allocations → Activate
3. **Goal Setting** → Create/update savings goals based on available surplus

---

## 2. Interface Architecture

### Information Hierarchy

**Level 1 - Primary (Must see in 5 seconds)**:

- Current balance (income - expenses)
- Budget status (remaining amount, percentage used)
- Visual indicators (color-coded status: green/yellow/red)

**Level 2 - Secondary (Scannable context)**:

- Top spending categories (top 5)
- Recent transactions (last 5-10)
- Active savings goals progress

**Level 3 - Tertiary (Accessible on demand)**:

- Detailed transaction history
- Historical trends and comparisons
- Full budget breakdown by category
- Settings and preferences

### Layout Strategy

**Structure**: Single-page app with bottom navigation (mobile) and sidebar navigation (desktop)

**Grid System**:

- Mobile: Single column, max-width: 100%
- Tablet: 2-column grid for summary cards, max-width: 768px
- Desktop: Sidebar + main content area, max-width: 1200px centered

**Spacing Density**: Comfortable (not compact, not spacious)

- Section spacing: 24px (mobile), 32px (desktop)
- Card padding: 16px (mobile), 24px (desktop)
- Form field spacing: 16px vertical
- Inline spacing: 12px between related elements

**Breakpoints**:

- **Mobile (< 640px)**:
  - Single column layout
  - Bottom navigation (fixed)
  - Full-width cards with 16px padding
  - Stack all elements vertically
  - Large touch targets (min 44x44px)
  - Floating Action Button for primary action
- **Tablet (640px - 1024px)**:
  - 2-column grid for summary cards
  - Bottom navigation or top horizontal nav
  - Cards with 20px padding
  - Side-by-side forms where appropriate
- **Desktop (> 1024px)**:
  - Left sidebar navigation (240px width, collapsible)
  - Multi-column grid (up to 3 columns)
  - Cards with 24px padding
  - Hover states for all interactive elements
  - Inline actions (no FAB)

### Visual Hierarchy

**Focal Point**: Large financial numbers (income, expenses, balance) with semantic color coding

**Visual Flow** (F-pattern for LTR):

1. Top: Page title + month selector
2. Left to right: Summary cards (Income → Expenses → Balance)
3. Down: Budget progress section
4. Down: Content sections (transactions, categories, goals)

**Grouping**:

- Related financial metrics in cards
- Transactions grouped by date (Today, Yesterday, This Week, Earlier)
- Categories grouped by spending amount (highest to lowest)

**Contrast**:

- Financial numbers: text-3xl to text-5xl, font-bold, tabular-nums
- Section titles: text-2xl, font-semibold
- Body text: text-base, font-normal
- Secondary text: text-sm, text-muted-foreground

---

## 3. Interaction Design

### Primary Actions

**Action: Add Expense (Most Common)**

- **Type**: Primary
- **Location**:
  - Mobile: Floating Action Button (bottom-right, red background)
  - Desktop: Primary button in header or content area
- **States**:
  - Default: Red background (#EF4444), white icon/text, shadow-md
  - Hover: Red background darken 10%, shadow-lg (desktop only)
  - Active: Scale 95%, shadow-sm
  - Disabled: N/A (always enabled)
- **Feedback**:
  - Tap → Sheet/Modal opens with slide-up animation (mobile) or fade-in (desktop)
  - After submit → Success toast + budget updates with animated counter
  - Error → Inline validation errors with shake animation

**Action: Add Income**

- **Type**: Primary
- **Location**:
  - Mobile: Secondary FAB or button on dashboard
  - Desktop: Button next to "Add Expense"
- **States**: Same as Add Expense, but green (#10B981)
- **Feedback**: Same as Add Expense

**Action: Create Budget**

- **Type**: Primary (if no active budget)
- **Location**: Large CTA card on empty dashboard, or button in Presupuesto page
- **States**: Blue background (#3B82F6), white text
- **Feedback**: Navigate to budget creation form with page transition

### Secondary Actions

**Action: Edit Transaction**

- **Type**: Secondary
- **Location**: Transaction detail view (click transaction card)
- **Visual**: Ghost or outline button

**Action: Delete Transaction**

- **Type**: Tertiary (destructive)
- **Location**: Transaction detail view
- **Visual**: Red text link or ghost button
- **Feedback**: Confirmation dialog → Success toast

**Action: Filter/Search**

- **Type**: Secondary
- **Location**: Top-right of transaction list page
- **Visual**: Icon button (funnel icon, search icon)
- **Feedback**: Sheet/Drawer opens with filter options

**Action: Change Month**

- **Type**: Secondary
- **Location**: Below page title on dashboard and reports
- **Visual**: Button group with arrows (← November 2025 →)
- **Feedback**: Data updates with fade transition (skeleton loading)

### Micro-interactions

**Hover Effects** (Desktop only):

- Cards: Subtle shadow increase (shadow-sm → shadow-md), 200ms ease
- Buttons: Background darken 10%, 150ms ease
- Transaction rows: Background change to accent color, show action icons
- Category badges: Scale 105%, 150ms ease

**Focus States** (Keyboard navigation):

- All interactive elements: 3px ring in primary color, outline-offset: 2px
- Visible focus indicator always present
- Tab order: logical top-to-bottom, left-to-right flow

**Loading States**:

- **Skeleton screens**: For dashboard cards, transaction lists (no spinners)
- **Progress bars**: For budget calculations (indeterminate linear)
- **Button spinners**: For form submissions (spinner replaces icon/text)
- **Optimistic updates**: Transaction appears immediately, then confirms/rolls back

**Transitions**:

- **Page navigation**: Fade (200ms ease-in-out)
- **Modal/Sheet open**: Slide-up from bottom (mobile, 300ms ease-out), Fade + scale (desktop, 200ms ease-out)
- **Card animations**: Stagger children by 50ms for list reveals
- **Number counters**: Count-up animation for financial totals (500ms)

**Success/Error Feedback**:

- **Success**:
  - Toast notification (green background, checkmark icon, 3s auto-dismiss)
  - Subtle confetti animation for milestones (budget created, goal achieved)
- **Error**:
  - Inline field errors (red border, red text below field, error icon)
  - Toast for system errors (red background, X icon, 5s auto-dismiss or manual close)
  - Shake animation (3 cycles, 200ms) for invalid form submission

### User Input

**Amount Input** (Critical - most frequent input):

- **Type**: Number input with currency prefix ($)
- **Validation**: Real-time
  - Must be positive number
  - Max 2 decimal places
  - Format with thousands separators on blur
- **Error Messages**: "Amount must be greater than 0"
- **Placeholder**: "$0.00"
- **Helper**: Auto-focus on modal open, numeric keyboard on mobile
- **Accessibility**: aria-label="Transaction amount in dollars"

**Category Select**:

- **Type**: Custom select dropdown (shadcn Select)
- **Validation**: On submit (optional for income)
- **Error Messages**: N/A (optional)
- **Placeholder**: "Select category"
- **Helper**: Show category icon and color in dropdown
- **Accessibility**: Searchable with keyboard navigation

**Date Picker**:

- **Type**: Date input with calendar picker (shadcn DatePicker)
- **Validation**: On blur
  - Cannot be > 1 year in future
- **Error Messages**: "Date cannot be more than 1 year in the future"
- **Placeholder**: "Select date"
- **Helper**: Defaults to today
- **Accessibility**: Keyboard navigable calendar

**Description/Notes Textarea**:

- **Type**: Textarea (auto-resize)
- **Validation**: Optional, max 255 characters
- **Error Messages**: "Maximum 255 characters"
- **Placeholder**: "Add a note (optional)"
- **Helper**: Character counter shown when > 200 characters
- **Accessibility**: aria-label="Transaction notes"

**Budget Allocation Inputs**:

- **Type**: Number inputs in list with real-time calculation
- **Validation**: Real-time
  - Sum cannot exceed total budget
  - Each allocation >= 0
- **Error Messages**: "Category allocations exceed total budget by ${amount}"
- **Placeholder**: "$0.00"
- **Helper**: Show percentage calculation next to amount, highlight total remaining
- **Accessibility**: Live region announces total remaining

---

## 4. Component Selection

### shadcn/ui Components Needed

**Forms & Inputs**:

- **Button**: Primary actions, secondary actions, ghost buttons
- **Input**: Text inputs, number inputs with currency formatting
- **Select**: Category selection, payment method, month/year selectors
- **Textarea**: Transaction notes
- **DatePicker**: Transaction date selection (from `@shadcn/ui`)
- **Form**: Form wrapper with validation (React Hook Form integration)
- **Label**: Form field labels
- **Checkbox**: Settings preferences

**Feedback & Overlays**:

- **Toast**: Success/error notifications (Sonner)
- **Dialog**: Confirmation dialogs (delete budget/transaction)
- **Sheet**: Mobile slide-up forms (add transaction, filters)
- **AlertDialog**: Destructive action confirmations

**Data Display**:

- **Card**: Container for dashboard sections, transaction items
- **Badge**: Category labels, status indicators (draft/active/closed)
- **Progress**: Budget usage progress bars
- **Separator**: Section dividers
- **Skeleton**: Loading placeholders
- **Table**: Transaction history (desktop view)

**Navigation**:

- **Tabs**: Income vs Expense toggle on Movimientos page
- **Command**: Quick search/filter (Cmd+K)
- **DropdownMenu**: User menu, action menus

**Charts & Visualizations** (via recharts):

- **PieChart**: Category breakdown (Reportes page)
- **LineChart**: Spending trends over time
- **BarChart**: Month-over-month comparisons
- **ResponsiveContainer**: Chart wrapper for responsiveness

### Custom Components Needed

**MonthSelector**:

- **Why**: Specific interaction pattern (← Month Year →) with date constraints
- **Location**: `src/components/molecules/month-selector.tsx`
- **Props**: currentMonth, onMonthChange, minDate?, maxDate?
- **Behavior**: Arrow buttons cycle through months, display format "January 2025"

**SummaryCard**:

- **Why**: Repeated pattern across dashboard (Income, Expenses, Balance cards)
- **Location**: `src/components/molecules/summary-card.tsx`
- **Props**: title, amount, type (income|expense|balance), trend?, subtitle?
- **Styling**: Large number display with semantic color, optional trend indicator

**TransactionListItem**:

- **Why**: Complex layout with swipe actions (mobile), hover actions (desktop)
- **Location**: `src/components/molecules/transaction-list-item.tsx`
- **Props**: transaction, onEdit, onDelete
- **Behavior**: Swipeable on mobile, shows actions on hover (desktop)

**CategoryIcon**:

- **Why**: Consistent category visualization with icon + color
- **Location**: `src/components/atoms/category-icon.tsx`
- **Props**: category, size (sm|md|lg)
- **Styling**: Circular icon container with category background color

**EmptyState**:

- **Why**: Consistent pattern for no-data states with encouraging messages
- **Location**: `src/components/molecules/empty-state.tsx`
- **Props**: icon, title, description, action?, actionLabel?
- **Styling**: Centered content with illustration, CTA button

**BudgetProgressBar**:

- **Why**: Custom visualization showing spent/allocated with color coding
- **Location**: `src/components/molecules/budget-progress-bar.tsx`
- **Props**: category, allocated, spent, percentage
- **Styling**: Stacked bar with segments, color-coded based on percentage used

**CurrencyInput**:

- **Why**: Specialized input with currency formatting, decimal handling
- **Location**: `src/components/atoms/currency-input.tsx`
- **Props**: value, onChange, prefix ("$"), locale?
- **Behavior**: Auto-formats with thousands separators, handles decimal input

**FloatingActionButton (FAB)**:

- **Why**: Mobile-specific component for primary actions
- **Location**: `src/components/atoms/floating-action-button.tsx`
- **Props**: icon, onClick, variant (default|destructive|success), label (accessibility)
- **Styling**: Fixed bottom-right, shadow-lg, circular (56x56px)

---

## 5. Content Strategy

### Text Requirements

#### Text Map: `src/domains/budgets/budget.text-map.ts`

**Keys to Define**:

```typescript
export const budgetTextMap = {
  // Headings
  page_title: 'Presupuesto',
  section_create: 'Crear Presupuesto',
  section_edit: 'Editar Presupuesto',
  section_allocations: 'Distribución por Categorías',

  // Labels
  label_name: 'Nombre del presupuesto',
  label_month: 'Mes',
  label_year: 'Año',
  label_total_amount: 'Monto total',
  label_status: 'Estado',
  label_allocated: 'Asignado',
  label_spent: 'Gastado',
  label_remaining: 'Restante',

  // Actions
  action_create: 'Crear presupuesto',
  action_save: 'Guardar cambios',
  action_cancel: 'Cancelar',
  action_delete: 'Eliminar presupuesto',
  action_duplicate: 'Duplicar presupuesto',
  action_activate: 'Activar presupuesto',
  action_close: 'Cerrar presupuesto',

  // Placeholders
  placeholder_name: 'Ej: Presupuesto Enero 2025',
  placeholder_amount: '$0.00',

  // Validation Errors
  error_required_name: 'El nombre del presupuesto es obligatorio',
  error_required_amount: 'El monto total es obligatorio',
  error_amount_positive: 'El monto debe ser mayor a cero',
  error_duplicate_month: 'Ya existe un presupuesto para {month} {year}',
  error_allocations_exceed: 'Las asignaciones exceden el total por ${amount}',

  // Success Messages
  success_created: 'Presupuesto creado exitosamente',
  success_updated: 'Presupuesto actualizado exitosamente',
  success_deleted: 'Presupuesto eliminado exitosamente',
  success_duplicated: 'Presupuesto duplicado a {month} {year}',

  // Confirmations
  confirm_delete_title: '¿Eliminar presupuesto?',
  confirm_delete_message:
    'Esta acción no se puede deshacer. Se eliminarán {count} transacciones asociadas.',
  confirm_delete_confirm: 'Sí, eliminar',
  confirm_delete_cancel: 'Cancelar',

  // Empty States
  empty_no_budgets_title: 'No tienes presupuestos',
  empty_no_budgets_description:
    'Crea tu primer presupuesto para empezar a controlar tus gastos',
  empty_no_budgets_action: 'Crear mi primer presupuesto',

  // Status Labels
  status_draft: 'Borrador',
  status_active: 'Activo',
  status_closed: 'Cerrado',

  // Helper Text
  help_total_amount: 'Ingresa el monto total disponible para este mes',
  help_allocations:
    'Distribuye tu presupuesto entre categorías. La suma no puede exceder el total.',
  help_remaining: 'Monto no asignado: ${amount}',

  // Progress Indicators
  progress_under_budget: 'Dentro del presupuesto',
  progress_near_limit: 'Cerca del límite',
  progress_over_budget: 'Presupuesto excedido',

  // Percentages
  percent_used: '{percent}% usado',
  percent_remaining: '{percent}% restante',
  percent_of_total: '{percent}% del total'
} as const;
```

#### Text Map: `src/domains/transactions/transaction.text-map.ts`

**Keys to Define**:

```typescript
export const transactionTextMap = {
  // Headings
  page_title: 'Movimientos',
  section_income: 'Ingresos',
  section_expenses: 'Gastos',
  section_add_income: 'Nuevo Ingreso',
  section_add_expense: 'Nuevo Gasto',
  section_edit: 'Editar Movimiento',
  section_details: 'Detalles del Movimiento',

  // Labels
  label_amount: 'Monto',
  label_category: 'Categoría',
  label_date: 'Fecha',
  label_payment_method: 'Método de pago',
  label_notes: 'Notas',
  label_type: 'Tipo',

  // Actions
  action_add_income: 'Agregar ingreso',
  action_add_expense: 'Agregar gasto',
  action_save: 'Guardar',
  action_cancel: 'Cancelar',
  action_delete: 'Eliminar',
  action_edit: 'Editar',
  action_filter: 'Filtrar',
  action_search: 'Buscar',
  action_clear_filters: 'Limpiar filtros',

  // Placeholders
  placeholder_amount: '$0.00',
  placeholder_category: 'Selecciona categoría',
  placeholder_date: 'Selecciona fecha',
  placeholder_payment_method: 'Selecciona método',
  placeholder_notes: 'Agrega una nota (opcional)',
  placeholder_search: 'Buscar por descripción...',

  // Payment Methods
  payment_cash: 'Efectivo',
  payment_debit: 'Tarjeta de débito',
  payment_credit: 'Tarjeta de crédito',
  payment_transfer: 'Transferencia bancaria',
  payment_other: 'Otro',

  // Validation Errors
  error_required_amount: 'El monto es obligatorio',
  error_amount_positive: 'El monto debe ser mayor a cero',
  error_required_date: 'La fecha es obligatoria',
  error_future_date: 'La fecha no puede ser más de 1 año en el futuro',
  error_max_notes: 'Máximo 255 caracteres',

  // Success Messages
  success_created: 'Movimiento registrado exitosamente',
  success_updated: 'Movimiento actualizado exitosamente',
  success_deleted: 'Movimiento eliminado exitosamente',

  // Confirmations
  confirm_delete_title: '¿Eliminar movimiento?',
  confirm_delete_message: 'Esta acción no se puede deshacer.',
  confirm_delete_confirm: 'Sí, eliminar',
  confirm_delete_cancel: 'Cancelar',

  // Empty States
  empty_no_transactions_title: 'No hay movimientos',
  empty_no_transactions_description:
    'Empieza a registrar tus ingresos y gastos para ver tu actividad financiera',
  empty_no_transactions_action: 'Agregar primer movimiento',
  empty_no_results_title: 'No se encontraron resultados',
  empty_no_results_description: 'Intenta ajustar los filtros o la búsqueda',

  // List Sections
  section_today: 'Hoy',
  section_yesterday: 'Ayer',
  section_this_week: 'Esta semana',
  section_earlier: 'Anteriores',

  // Summary
  summary_total_income: 'Ingresos totales',
  summary_total_expenses: 'Gastos totales',
  summary_balance: 'Balance',
  summary_count: '{count} movimientos',

  // Helper Text
  help_amount: 'Ingresa el monto de la transacción',
  help_category: 'Selecciona la categoría que mejor describa este movimiento',
  help_notes: 'Agrega detalles adicionales para recordar este movimiento'
} as const;
```

#### Text Map: `src/domains/reports/report.text-map.ts`

**Keys to Define**:

```typescript
export const reportTextMap = {
  // Headings
  page_title: 'Reportes',
  section_summary: 'Resumen del Período',
  section_category_breakdown: 'Distribución por Categoría',
  section_trends: 'Tendencias',
  section_comparison: 'Comparativa Mensual',

  // Labels
  label_date_range: 'Rango de fechas',
  label_from: 'Desde',
  label_to: 'Hasta',

  // Actions
  action_export_csv: 'Exportar a CSV',
  action_change_period: 'Cambiar período',
  action_apply_filters: 'Aplicar filtros',

  // Chart Labels
  chart_income_label: 'Ingresos',
  chart_expenses_label: 'Gastos',
  chart_balance_label: 'Balance',
  chart_no_data: 'No hay datos para mostrar',

  // Summary Stats
  stat_total_income: 'Ingresos totales',
  stat_total_expenses: 'Gastos totales',
  stat_net_balance: 'Balance neto',
  stat_avg_daily_expense: 'Gasto diario promedio',
  stat_top_category: 'Categoría principal',
  stat_transaction_count: 'Total de movimientos',

  // Comparison
  compare_vs_previous: 'vs mes anterior',
  compare_increase: 'Incremento de {percent}%',
  compare_decrease: 'Reducción de {percent}%',
  compare_no_change: 'Sin cambios',

  // Empty States
  empty_no_data_title: 'No hay datos para el período seleccionado',
  empty_no_data_description:
    'Selecciona un rango de fechas diferente o agrega transacciones',

  // Export
  export_filename: 'mis-finanzas-reporte-{date}.csv',
  export_success: 'Reporte exportado exitosamente',
  export_error: 'Error al exportar reporte'
} as const;
```

#### Text Map: `src/domains/goals/goal.text-map.ts`

**Keys to Define**:

```typescript
export const goalTextMap = {
  // Headings
  page_title: 'Metas de Ahorro',
  section_create: 'Nueva Meta',
  section_edit: 'Editar Meta',
  section_active: 'Metas Activas',
  section_archived: 'Metas Archivadas',

  // Labels
  label_name: 'Nombre de la meta',
  label_target_amount: 'Monto objetivo',
  label_current_amount: 'Monto actual',
  label_deadline: 'Fecha límite',
  label_status: 'Estado',

  // Actions
  action_create: 'Crear meta',
  action_save: 'Guardar cambios',
  action_cancel: 'Cancelar',
  action_delete: 'Eliminar meta',
  action_complete: 'Marcar como completada',
  action_add_funds: 'Agregar fondos',

  // Placeholders
  placeholder_name: 'Ej: Fondo de emergencia',
  placeholder_amount: '$0.00',
  placeholder_deadline: 'Opcional',

  // Validation Errors
  error_required_name: 'El nombre de la meta es obligatorio',
  error_required_target: 'El monto objetivo es obligatorio',
  error_target_positive: 'El monto objetivo debe ser mayor a cero',
  error_current_negative: 'El monto actual no puede ser negativo',

  // Success Messages
  success_created: 'Meta creada exitosamente',
  success_updated: 'Meta actualizada exitosamente',
  success_deleted: 'Meta eliminada exitosamente',
  success_completed: '¡Felicitaciones! Meta completada',
  success_funds_added: 'Fondos agregados a la meta',

  // Status Labels
  status_active: 'Activa',
  status_completed: 'Completada',
  status_cancelled: 'Cancelada',

  // Progress
  progress_percent: '{percent}% completado',
  progress_remaining: 'Faltan ${amount}',
  progress_achieved: '¡Meta alcanzada!',
  progress_exceeded: 'Meta superada por ${amount}',

  // Empty States
  empty_no_goals_title: 'No tienes metas de ahorro',
  empty_no_goals_description:
    'Define tus objetivos financieros y rastrea tu progreso',
  empty_no_goals_action: 'Crear mi primera meta',

  // Helper Text
  help_target_amount: '¿Cuánto necesitas ahorrar?',
  help_deadline: 'Fecha en la que quieres alcanzar esta meta (opcional)',
  help_estimated_completion:
    'A tu ritmo actual, alcanzarás esta meta en {months} meses'
} as const;
```

#### Text Map: `src/domains/settings/setting.text-map.ts`

**Keys to Define**:

```typescript
export const settingTextMap = {
  // Headings
  page_title: 'Configuración',
  section_profile: 'Perfil',
  section_preferences: 'Preferencias',
  section_categories: 'Categorías',
  section_data: 'Datos',
  section_account: 'Cuenta',

  // Labels
  label_email: 'Correo electrónico',
  label_display_name: 'Nombre para mostrar',
  label_currency: 'Moneda',
  label_theme: 'Tema',

  // Actions
  action_save: 'Guardar cambios',
  action_cancel: 'Cancelar',
  action_export_data: 'Exportar todos los datos',
  action_delete_account: 'Eliminar cuenta',
  action_change_password: 'Cambiar contraseña',
  action_add_category: 'Agregar categoría',

  // Success Messages
  success_profile_updated: 'Perfil actualizado exitosamente',
  success_password_changed: 'Contraseña cambiada exitosamente',
  success_data_exported: 'Datos exportados exitosamente',

  // Confirmations
  confirm_delete_account_title: '¿Eliminar cuenta?',
  confirm_delete_account_message:
    'Esta acción es permanente. Se eliminarán todos tus datos.',
  confirm_delete_account_input: 'Escribe DELETE para confirmar',
  confirm_delete_account_confirm: 'Eliminar mi cuenta',
  confirm_delete_account_cancel: 'Cancelar',

  // Category Management
  category_default_label: 'Predeterminada',
  category_custom_label: 'Personalizada',
  category_cannot_delete:
    'Las categorías predeterminadas no se pueden eliminar',

  // Theme Options
  theme_light: 'Claro',
  theme_dark: 'Oscuro',
  theme_system: 'Sistema'
} as const;
```

#### Text Map: `src/components/common.text-map.ts` (Shared UI Text)

**Keys to Define**:

```typescript
export const commonTextMap = {
  // App Title
  app_name: 'Mis Finanzas',

  // Navigation
  nav_home: 'Inicio',
  nav_budget: 'Presupuesto',
  nav_transactions: 'Movimientos',
  nav_reports: 'Reportes',
  nav_goals: 'Metas',
  nav_settings: 'Configuración',

  // Common Actions
  action_save: 'Guardar',
  action_cancel: 'Cancelar',
  action_delete: 'Eliminar',
  action_edit: 'Editar',
  action_close: 'Cerrar',
  action_confirm: 'Confirmar',
  action_back: 'Volver',
  action_next: 'Siguiente',
  action_previous: 'Anterior',
  action_view_all: 'Ver todos',

  // Common Labels
  label_loading: 'Cargando...',
  label_error: 'Error',
  label_success: 'Éxito',
  label_warning: 'Advertencia',
  label_info: 'Información',

  // Time
  time_today: 'Hoy',
  time_yesterday: 'Ayer',
  time_this_week: 'Esta semana',
  time_this_month: 'Este mes',
  time_last_month: 'Mes pasado',

  // Months
  month_january: 'Enero',
  month_february: 'Febrero',
  month_march: 'Marzo',
  month_april: 'Abril',
  month_may: 'Mayo',
  month_june: 'Junio',
  month_july: 'Julio',
  month_august: 'Agosto',
  month_september: 'Septiembre',
  month_october: 'Octubre',
  month_november: 'Noviembre',
  month_december: 'Diciembre',

  // Error Messages (Generic)
  error_network: 'Error de conexión. Verifica tu internet.',
  error_unknown: 'Ocurrió un error inesperado. Intenta nuevamente.',
  error_required_field: 'Este campo es obligatorio',

  // Loading States
  loading_data: 'Cargando datos...',
  loading_saving: 'Guardando...',
  loading_deleting: 'Eliminando...',

  // Empty States (Generic)
  empty_generic_title: 'No hay datos para mostrar',
  empty_generic_description: 'Cuando agregues información, aparecerá aquí',

  // Accessibility
  a11y_skip_to_content: 'Saltar al contenido principal',
  a11y_close_modal: 'Cerrar modal',
  a11y_menu_toggle: 'Abrir/cerrar menú',
  a11y_user_menu: 'Menú de usuario'
} as const;
```

### Tone and Voice

**Tone**: Friendly, encouraging, non-judgmental  
**Voice**: Second person (tú), active voice, conversational

**Examples**:

- ✅ "Crea tu primer presupuesto" (friendly, active)
- ❌ "El presupuesto debe ser creado" (passive, formal)

**Financial Context**:

- Positive reinforcement: "¡Vas muy bien!" when under budget
- Encouraging guidance: "Intenta reducir gastos en {category}" instead of "Estás gastando demasiado"
- Empathetic errors: "No pudimos guardar los cambios" instead of "Error: Save failed"

### Microcopy

**Empty States** (Encouraging, Actionable):

- No budgets: "No tienes presupuestos" + "Crea tu primer presupuesto para empezar a controlar tus gastos" + [CTA: "Crear mi primer presupuesto"]
- No transactions: "No hay movimientos" + "Empieza a registrar tus ingresos y gastos para ver tu actividad financiera" + [CTA: "Agregar primer movimiento"]
- No goals: "No tienes metas de ahorro" + "Define tus objetivos financieros y rastrea tu progreso" + [CTA: "Crear mi primera meta"]
- No search results: "No se encontraron resultados" + "Intenta ajustar los filtros o la búsqueda"

**Error States** (Empathetic, Solution-Oriented):

- Network error: "No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente."
- Validation error: "El monto debe ser mayor a cero" (specific, actionable)
- Duplicate budget: "Ya existe un presupuesto para Enero 2025. Puedes editarlo o crear uno para otro mes."
- Over budget: "Las asignaciones exceden el total por $150.00. Ajusta las cantidades para continuar."

**Success States** (Congratulatory, Next-Steps):

- Budget created: "¡Presupuesto creado exitosamente!" + "Ahora puedes empezar a registrar tus gastos"
- Goal achieved: "¡Felicitaciones! Alcanzaste tu meta de ahorro" + confetti animation
- Transaction added: "Movimiento registrado" + silent toast (3s)

**Loading States** (Informative, Patient):

- Initial load: Skeleton screens (no text)
- Saving: "Guardando..." (button text replacement)
- Deleting: "Eliminando..." (button text replacement)
- Calculating: "Calculando presupuesto..." (indeterminate progress)

---

## 6. Accessibility Design

### Semantic Structure

**Landmarks**:

```html
<header>
  - App header with navigation
  <nav>
    - Primary navigation (sidebar or bottom nav)
    <main>
      - Page content area
      <aside>
        - Secondary content (upcoming: tips, insights)
        <footer>- Copyright, links (if applicable)</footer>
      </aside>
    </main>
  </nav>
</header>
```

**Headings** (Logical hierarchy):

```
h1 - Page title (one per page: "Presupuesto", "Movimientos", etc.)
  h2 - Major sections ("Resumen del Mes", "Últimos Movimientos")
    h3 - Subsections ("Distribución por Categorías", "Metas Activas")
```

**Lists**:

- `<ul>` for transactions, categories (unordered)
- `<ol>` for step-by-step processes (budget creation wizard, if implemented)
- `<dl>` for key-value pairs (transaction details)

### Keyboard Navigation

**Tab Order** (Logical flow):

1. Skip to content link (visually hidden, visible on focus)
2. Primary navigation (sidebar links or bottom nav)
3. Page header actions (month selector, add buttons)
4. Main content (cards, forms, lists)
5. Secondary actions (edit, delete)

**Shortcuts** (Optional, Phase 2):

- `Cmd/Ctrl + K`: Open command palette (quick search)
- `Cmd/Ctrl + N`: Add new transaction
- `Escape`: Close modal/sheet
- `Arrow keys`: Navigate month selector, list items

**Focus Management**:

- Modal/Sheet open → Focus moves to first interactive element (close button or first input)
- Modal/Sheet close → Focus returns to trigger element
- Form submit → Focus moves to first error field (if errors) or success message
- Delete action → Focus moves to next item in list or "Add" button

**Escape Hatch**:

- `Escape` closes all modals, sheets, dialogs, dropdowns
- Close button (`X`) always visible in top-right of overlays
- "Cancel" button in all forms

### Screen Reader Experience

**ARIA Labels** (Descriptive):

- Navigation icons: `aria-label="Ir a Inicio"`, `aria-label="Ir a Movimientos"`
- Action buttons: `aria-label="Agregar nuevo gasto"`, `aria-label="Editar presupuesto"`
- Month selector: `aria-label="Mes anterior"`, `aria-label="Mes siguiente"`
- Category icons: `aria-label="Categoría: Alimentación"`
- FAB: `aria-label="Agregar gasto rápido"`

**ARIA Descriptions** (Additional context):

- Transaction items: `aria-describedby="transaction-amount-{id}"` linking to amount element
- Progress bars: `aria-valuenow="65"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Presupuesto usado: 65%"`
- Budget cards: `aria-describedby="budget-status-{id}"` linking to status message

**Live Regions** (Dynamic announcements):

```html
<!-- Budget calculation updates -->
<div role="status" aria-live="polite" aria-atomic="true">
  Monto restante: $350.00
</div>

<!-- Form validation errors -->
<div role="alert" aria-live="assertive">El monto debe ser mayor a cero</div>

<!-- Success messages -->
<div role="status" aria-live="polite">Presupuesto creado exitosamente</div>
```

**Hidden Content** (Visually hidden but accessible):

```html
<!-- Skip to content link -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Saltar al contenido principal
</a>

<!-- Icon labels -->
<span class="sr-only">Eliminar movimiento</span>
<TrashIcon aria-hidden="true" />
```

### Visual Accessibility

**Color Contrast** (WCAG AA 4.5:1 for text, AAA 7:1 goal):

- Primary text on white background: #111827 (contrast ratio 16:1) ✅
- Secondary text on white: #6B7280 (contrast ratio 5.14:1) ✅
- Green (income) on white: #10B981 → darken to #059669 for text (4.5:1) ✅
- Red (expenses) on white: #EF4444 → darken to #DC2626 for text (4.5:1) ✅
- Blue (balance) on white: #3B82F6 (contrast ratio 4.54:1) ✅
- White text on green button: #FFFFFF on #10B981 (contrast ratio 2.89:1) ❌ → Use darker green #059669 (4.52:1) ✅

**Color Independence** (Don't rely solely on color):

- Budget status: Color + icon + text label
  - Green + Checkmark icon + "Dentro del presupuesto"
  - Yellow + Warning icon + "Cerca del límite"
  - Red + Alert icon + "Presupuesto excedido"
- Transaction type: Color + icon + label
  - Green + ArrowUp icon + "Ingreso"
  - Red + ArrowDown icon + "Gasto"
- Charts: Color + patterns/textures for colorblind users

**Text Size**:

- Minimum body text: 16px (1rem)
- Mobile buttons: 16px text, 44x44px minimum touch target
- Desktop: 14px acceptable for secondary text with good contrast

**Touch Targets** (Minimum 44x44px):

- All buttons: min-h-11 (44px)
- FAB: 56x56px (larger for primary action)
- List items: min-h-16 (64px) with adequate spacing
- Icon buttons: 44x44px with visible hit area

**Motion** (Respect prefers-reduced-motion):

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Disable: Page transitions, slide animations, count-up animations, confetti
- Keep: Color changes, opacity fades (essential for feedback)

---

## 7. Responsive Design

### Mobile (< 640px)

**Layout**:

- Single column, full width with 16px horizontal padding
- Stacked cards with 12px vertical spacing
- No sidebar, bottom navigation (fixed)
- Maximum content width: 100%

**Navigation**:

- Bottom navigation bar (fixed, z-index 50)
- 5 nav items: Home, Presupuesto, Movimientos, Metas, Configuración
- Active state: Color change + icon fill + label bold
- Height: 64px with safe-area-inset-bottom

**Actions**:

- Floating Action Button (FAB) for primary action (Add Expense)
- Position: fixed, bottom-right (16px from bottom nav, 16px from right)
- Forms open in Sheet (slide-up from bottom)
- Full-width buttons in forms

**Content**:

- Summary cards: Full width, large numbers (text-4xl)
- Transaction list: Card-based, 1 per row
- Charts: Full width, aspect-ratio 16:9, scrollable legends
- Forms: Single column, full-width inputs

**Typography**:

- Page title: text-3xl (28px)
- Section titles: text-xl (20px)
- Financial numbers: text-4xl (36px)
- Body text: text-base (16px)

**Specific Adjustments**:

- Month selector: Full width, arrows on sides, month text centered
- Budget progress bars: Vertical labels, horizontal bars
- Category breakdown: List view (no pie chart initially), tap to see chart
- Transaction filters: Sheet (not dropdown)

### Tablet (640px - 1024px)

**Layout**:

- 2-column grid for summary cards (max-w-3xl centered)
- Cards with 20px padding
- Bottom navigation or top horizontal nav (user preference)
- Maximum content width: 768px centered

**Navigation**:

- Option 1: Bottom nav (same as mobile)
- Option 2: Top horizontal nav with full labels

**Actions**:

- FAB or inline buttons (context-dependent)
- Forms can open in Dialog (centered modal) or Sheet

**Content**:

- Summary cards: 2 columns, medium numbers (text-3xl)
- Transaction list: 2 columns or table view with icons
- Charts: Side-by-side (2 charts per row)
- Forms: 2-column layout for related fields (e.g., month + year)

**Typography**:

- Same as mobile, better readability with wider line-length (max 65ch)

### Desktop (> 1024px)

**Layout**:

- Left sidebar navigation (240px width, collapsible to icons-only 64px)
- Multi-column grid (up to 3 columns for summary cards)
- Cards with 24px padding
- Maximum content width: 1200px centered with 32px side padding

**Navigation**:

- Left sidebar: Always visible, collapsible
- Logo at top, nav links with icons + labels
- User menu at bottom
- Hover states: Background color change + subtle scale

**Actions**:

- No FAB, use primary buttons in header or content area
- Forms open in centered Dialog (max-w-2xl)
- Inline action buttons in table rows (show on hover)

**Content**:

- Summary cards: 3 columns, large numbers (text-5xl)
- Transaction list: Table view with sortable columns
  - Columns: Date, Description, Category, Payment Method, Amount, Actions
  - Hover row: Background change, show edit/delete icons
- Charts: Side-by-side, larger with detailed legends
- Forms: Multi-column layouts, inline labels

**Typography**:

- Page title: text-4xl (36px)
- Section titles: text-2xl (24px)
- Financial numbers: text-5xl (48px)
- Body text: text-base (16px)

**Specific Adjustments**:

- Month selector: Inline with page title
- Budget allocations: Table view with inline editing
- Keyboard shortcuts: Visible tooltips on hover
- Hover effects: All interactive elements

**Additional Features** (Desktop-only):

- Command palette (Cmd+K)
- Breadcrumb navigation
- Multi-select actions (select multiple transactions)
- Drag-and-drop for category ordering

---

## 8. States & Feedback

### Loading States

**Initial Page Load**:

- Approach: Skeleton screens (no spinners)
- Components:
  - Summary cards: Skeleton rectangles with shimmer animation
  - Transaction list: 5-10 skeleton rows with shimmer
  - Charts: Skeleton chart outline with shimmer
- Duration: Typically < 500ms (IndexedDB fast)
- Transition: Fade-in content as data arrives (staggered for lists)

**Action Feedback** (Button loading):

- Add/Edit/Delete transaction:
  - Button text changes to "Guardando..." with spinner icon
  - Button disabled, opacity 70%
  - Form fields disabled during submission
  - Duration: 100-500ms
- Success: Button returns to normal, toast appears, modal closes

**Optimistic Updates**:

- Transaction creation:
  - Transaction appears in list immediately (optimistic)
  - If server/IndexedDB fails, remove transaction + show error toast
  - Budget totals update optimistically, roll back on error
- Budget allocation changes:
  - Update UI immediately as user types
  - Debounce save (500ms)

### Error States

**Validation Errors** (Inline, specific):

- Display: Red border on input, red text below field, error icon
- Timing: On blur (lose focus) or on submit
- Examples:
  ```
  [Input field with red border]
  ⚠️ El monto debe ser mayor a cero
  ```
- Behavior: Error clears when user corrects input (on change)
- Animation: Shake input field (3 cycles, 200ms total)

**System Errors** (Toast/Alert):

- Network error:
  - Toast: Red background, white text, X icon
  - Message: "No pudimos conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente."
  - Duration: 5s auto-dismiss or manual close
  - Position: Top-right (desktop), top-center (mobile)
- IndexedDB error:
  - Dialog: Critical error, cannot be dismissed with Escape
  - Message: "Error al acceder a la base de datos local. Intenta recargar la página."
  - Actions: [Recargar página] [Reportar problema]

**Recovery** (How user fixes):

- Validation errors: Inline guidance (e.g., "Ingresa un valor entre 0 y 1,000,000")
- Network errors: Retry button in toast
- Data conflicts: Reload page, show diff if possible

### Empty States

**No Budget** (Dashboard):

- Icon: Illustration of empty piggy bank or budget icon
- Title: "No tienes presupuestos"
- Description: "Crea tu primer presupuesto para empezar a controlar tus gastos"
- CTA: Large primary button "Crear mi primer presupuesto"
- Style: Centered content, max-w-md, generous padding

**No Transactions** (Movimientos page):

- Icon: Illustration of empty list or receipt
- Title: "No hay movimientos"
- Description: "Empieza a registrar tus ingresos y gastos para ver tu actividad financiera"
- CTA: "Agregar primer movimiento"

**No Results** (Search/Filter):

- Icon: Magnifying glass with X
- Title: "No se encontraron resultados"
- Description: "Intenta ajustar los filtros o la búsqueda"
- Action: "Limpiar filtros" button

**First Use** (Onboarding - Future):

- Guided tour: Tooltip-based walkthrough of key features
- Skippable: "Saltar" link always visible
- Progress: Step indicator (1 of 4)

### Success States

**Confirmation** (Toast):

- Style: Green background, white text, checkmark icon
- Position: Top-right (desktop), top-center (mobile)
- Duration: 3s auto-dismiss (can be manually closed)
- Examples:
  - "Presupuesto creado exitosamente"
  - "Movimiento registrado"
  - "Cambios guardados"

**Next Steps** (Contextual):

- After creating budget: Show "Agregar tu primer gasto" button in toast or dashboard
- After adding transaction: Budget progress bar animates to new value
- After achieving goal: Confetti animation + congratulations modal

**Milestone Celebrations** (Special):

- First budget created: Confetti + encouraging message
- Goal achieved: Confetti + congratulations modal + share option
- 100 transactions logged: Badge notification

---

## 9. User Flow Diagram

### Flow 1: First-Time User - Budget Creation

```
[Register/Login]
    ↓
[Dashboard - Empty State]
    ↓
[See "No tienes presupuestos" message]
    ↓
[Click "Crear mi primer presupuesto"]
    ↓
[Budget Creation Form]
    ├─ Enter: Name, Month, Year, Total Amount
    ↓
[Click "Continuar" or auto-advance to allocations]
    ↓
[Category Allocation Screen]
    ├─ See default categories
    ├─ Enter amount or percentage per category
    ├─ Real-time: See remaining unallocated amount
    ├─ Validation: Sum cannot exceed total
    ↓
[Click "Guardar presupuesto"]
    ↓
[Success Feedback]
    ├─ Toast: "Presupuesto creado exitosamente"
    ├─ Confetti animation (first budget)
    ↓
[Redirect to Dashboard]
    ├─ See budget summary cards
    ├─ See "Agregar primer movimiento" CTA
```

### Flow 2: Daily User - Add Expense Transaction (Mobile)

```
[Open App - Dashboard Visible]
    ↓
[See current balance and budget status]
    ↓
[Tap FAB "Add Expense" (bottom-right)]
    ↓
[Sheet Slides Up - Add Expense Form]
    ↓
[Enter Amount]
    ├─ Numeric keyboard appears
    ├─ Auto-focus on amount field
    ↓
[Select Category] (Optional)
    ├─ Tap category dropdown
    ├─ See category icons + names
    ├─ Select category → Dropdown closes
    ↓
[Select Date] (Defaults to today)
    ├─ Tap date field (optional)
    ├─ Calendar picker opens
    ├─ Select date → Picker closes
    ↓
[Select Payment Method] (Optional)
    ├─ Tap dropdown
    ├─ Select method
    ↓
[Add Notes] (Optional)
    ├─ Tap notes field
    ├─ Type description
    ↓
[Tap "Guardar"]
    ↓
[Validation Check]
    ├─ If errors → Show inline errors, shake input
    ├─ If valid → Continue
    ↓
[Optimistic Update]
    ├─ Transaction appears in list immediately
    ├─ Budget totals update
    ├─ Sheet closes
    ├─ Toast: "Movimiento registrado"
    ↓
[Back to Dashboard]
    ├─ See updated balance
    ├─ See updated budget progress
```

### Flow 3: Desktop User - Review Monthly Report

```
[Dashboard Page]
    ↓
[Click "Reportes" in Sidebar Nav]
    ↓
[Reports Page Loads]
    ├─ Default: Current month data
    ├─ See: Summary cards, Category pie chart, Trends line chart
    ↓
[Change Date Range]
    ├─ Click date range selector
    ├─ Select "Últimos 3 meses"
    ├─ Data reloads with skeleton placeholders
    ↓
[Analyze Charts]
    ├─ Hover over pie chart → Tooltip shows category breakdown
    ├─ Hover over line chart → Tooltip shows exact amounts
    ├─ Click legend item → Toggle category visibility
    ↓
[Export Data] (Optional)
    ├─ Click "Exportar a CSV"
    ├─ File downloads: mis-finanzas-reporte-2025-01-30.csv
    ├─ Toast: "Reporte exportado exitosamente"
    ↓
[Identify Spending Pattern]
    ├─ See "Alimentación" is highest category
    ↓
[Make Decision]
    ├─ Navigate to "Presupuesto"
    ├─ Adjust category allocation for next month
```

### Flow 4: Error Recovery - Validation Error

```
[Add Transaction Form]
    ↓
[Enter Amount: -50] (Negative value)
    ↓
[Blur from amount field]
    ↓
[Validation Error Triggered]
    ├─ Input border turns red
    ├─ Error icon appears
    ├─ Error message: "El monto debe ser mayor a cero"
    ├─ Input shakes briefly
    ↓
[User Corrects Input: 50]
    ↓
[On Change Event]
    ├─ Error clears immediately
    ├─ Border returns to normal
    ├─ Error message removed
    ↓
[Submit Form]
    ↓
[Success]
```

### Flow 5: Delete Confirmation - Budget

```
[Budget Detail Page]
    ↓
[Click "Eliminar presupuesto"]
    ↓
[Confirmation Dialog Opens]
    ├─ Title: "¿Eliminar presupuesto?"
    ├─ Message: "Esta acción no se puede deshacer. Se eliminarán 47 transacciones asociadas."
    ├─ Actions: [Cancelar] [Sí, eliminar]
    ↓
[Decision Point]
    ├─ Click "Cancelar" → Dialog closes, no changes
    ├─ Click "Sí, eliminar" → Continue
    ↓
[Delete Action]
    ├─ Button shows "Eliminando..." with spinner
    ├─ Dialog stays open
    ↓
[Success]
    ├─ Dialog closes
    ├─ Redirect to Presupuesto list page
    ├─ Toast: "Presupuesto eliminado exitosamente"
    ├─ Budget removed from IndexedDB
```

---

## 10. Design Specifications

### Spacing Scale

**Tight** (Use for inline elements, compact lists):

- Gap: 4px (space-x-1, space-y-1)
- Example: Icon + text in button, category badge + label

**Normal** (Default for most content):

- Gap: 12-16px (space-x-3, space-y-4)
- Example: Form fields, card content, list items

**Relaxed** (Use for major sections, page structure):

- Gap: 24-32px (space-y-6, space-y-8)
- Example: Dashboard sections, page margins, card spacing

**Specific Values**:

- Page padding (mobile): 16px (px-4)
- Page padding (desktop): 32px (px-8)
- Card padding (mobile): 16px (p-4)
- Card padding (desktop): 24px (p-6)
- Section spacing: 24px (space-y-6)
- Form field spacing: 16px (space-y-4)

### Typography

**Headings**:

- **H1 (Page Title)**:
  - Mobile: text-3xl (28px), font-bold, tracking-tight
  - Desktop: text-4xl (36px), font-bold, tracking-tight
  - Line-height: 1.2
  - Color: text-foreground
- **H2 (Section Title)**:
  - text-2xl (24px), font-semibold
  - Line-height: 1.3
  - Color: text-foreground
- **H3 (Card Title)**:
  - text-xl (20px), font-semibold
  - Line-height: 1.4
  - Color: text-foreground

**Body**:

- **Primary Body**:
  - text-base (16px), font-normal
  - Line-height: 1.5
  - Color: text-foreground
- **Secondary Body**:
  - text-sm (14px), font-normal
  - Line-height: 1.5
  - Color: text-muted-foreground
- **Caption**:
  - text-xs (12px), font-normal
  - Line-height: 1.4
  - Color: text-muted-foreground

**Labels**:

- **Form Labels**:
  - text-sm (14px), font-medium
  - Color: text-foreground
- **Badge Labels**:
  - text-xs (12px), font-semibold, uppercase
  - Color: context-dependent

**Financial Numbers** (Special):

- **Display (Large)**:
  - text-4xl to text-5xl (36-48px), font-bold
  - Font-variant-numeric: tabular-nums (monospace numbers)
  - Color: Semantic (green/red/blue based on context)
- **Medium**:
  - text-2xl to text-3xl (24-30px), font-bold
  - Font-variant-numeric: tabular-nums
- **Small**:
  - text-xl (20px), font-semibold
  - Font-variant-numeric: tabular-nums

**Font Family**:

- Primary: var(--font-geist-sans) (from globals.css)
- Fallback: system-ui, -apple-system, sans-serif

### Color Usage

**Primary** (Blue - #3B82F6):

- **When to use**:
  - Neutral actions (create budget, view details)
  - Links and interactive text
  - Focus states
  - Balance display when neutral (neither income nor expense)
- **Components**: Primary buttons, links, active nav items

**Success** (Green - #10B981):

- **When to use**:
  - Income amounts and labels
  - Positive balance
  - Under budget status
  - Success messages and confirmations
  - Goal progress (on track)
- **Components**: Income cards, success toasts, progress bars (under budget)

**Destructive** (Red - #EF4444):

- **When to use**:
  - Expense amounts and labels
  - Negative balance
  - Over budget status
  - Error messages
  - Delete actions
- **Components**: Expense cards, error toasts, progress bars (over budget), delete buttons

**Warning** (Yellow - #F59E0B):

- **When to use**:
  - Near budget limit (80-99% used)
  - Warning messages
  - Caution states
- **Components**: Warning toasts, progress bars (near limit)

**Semantic Guidelines**:

- **Don't mix**: Avoid using green for destructive actions or red for success
- **Provide alternatives**: Always supplement color with icon + text (accessibility)
- **Test contrast**: Ensure all color combinations meet WCAG AA standards

**Neutral Colors** (From globals.css):

- Background: oklch(1 0 0) - Pure white
- Foreground: oklch(0.147 0.004 49.25) - Near black
- Muted: oklch(0.97 0.001 106.424) - Light gray
- Muted-foreground: oklch(0.553 0.013 58.071) - Medium gray
- Border: oklch(0.923 0.003 48.717) - Subtle border gray
- Card: oklch(1 0 0) - White (same as background)

**Category Colors** (From PROJECT.md):

1. Housing: #3B82F6 (blue)
2. Food: #EF4444 (red)
3. Transportation: #F59E0B (amber)
4. Entertainment: #8B5CF6 (violet)
5. Healthcare: #10B981 (green)
6. Personal: #EC4899 (pink)
7. Utilities: #6366F1 (indigo)
8. Savings: #14B8A6 (teal)
9. Other: #6B7280 (gray)

---

## 11. Performance Considerations

**Critical Path** (What loads first):

1. App shell (header, navigation skeleton)
2. Dashboard summary cards data (income, expenses, balance)
3. Budget status data
4. Recent transactions (first 10)
5. Below-fold content (lazy loaded)

**Lazy Loading**:

- Charts: Load on scroll or tab activation (Reports page)
- Historical data: Virtualized lists for 1000+ transactions
- Images/Icons: Use icon library with tree-shaking (lucide-react)
- Heavy components: Dynamic imports for modals, sheets

**Image Optimization**:

- Icons: SVG icons only (lucide-react), inline when small
- Illustrations (empty states): SVG, lazy loaded
- No raster images expected in MVP

**Animation Budget**:

- Max simultaneous animations: 3
- Prefer `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (triggers layout)
- Use `will-change` sparingly (only when animating)
- Respect `prefers-reduced-motion`

**IndexedDB Performance**:

- Index frequently queried fields (userId, date, categoryId)
- Batch operations when possible
- Use cursor for large datasets (>1000 records)
- Cache frequently accessed data in memory (React Query)

**Bundle Size**:

- Code splitting: Each domain in separate chunk
- Tree-shaking: Import only used shadcn components
- Remove unused dependencies
- Target: < 200KB initial bundle (gzipped)

---

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:

- **Provide**:
  - List of shadcn components needed (see section 4)
  - Customization requirements (e.g., Button variants for income/expense)
  - Additional libraries (recharts for charts, sonner for toasts)
- **Receive**:
  - Installation commands
  - Component usage examples
  - Prop interfaces

**domain-architect**:

- **Provide**:
  - Data structure needs for UI components (Transaction, Budget, Category types)
  - Calculation requirements (budget totals, percentages, balances)
  - Validation rules for forms
- **Receive**:
  - Entity interfaces
  - Repository patterns
  - Business logic hooks

**nextjs-builder**:

- **Provide**:
  - Page structure requirements
  - Routing needs (dynamic routes for budget/transaction details)
  - Server vs Client Component strategy
  - Loading and error boundaries
- **Receive**:
  - App Router structure
  - Layout implementations
  - Metadata for SEO

**Parent**:

- **Receive from**: This UX plan
- **Implementation sequence**:
  1. Set up design tokens (CSS variables) based on color system
  2. Create atomic components (Button, Input, CurrencyInput)
  3. Create molecule components (SummaryCard, TransactionListItem)
  4. Build page layouts (mobile-first)
  5. Implement responsive breakpoints
  6. Add interactions and animations
  7. Test accessibility with screen reader
  8. Performance optimization

### Files Impacted

**Components** (Expected files):

Atoms:

- `src/components/atoms/currency-input.tsx`
- `src/components/atoms/category-icon.tsx`
- `src/components/atoms/floating-action-button.tsx`

Molecules:

- `src/components/molecules/summary-card.tsx`
- `src/components/molecules/transaction-list-item.tsx`
- `src/components/molecules/month-selector.tsx`
- `src/components/molecules/budget-progress-bar.tsx`
- `src/components/molecules/empty-state.tsx`

Organisms (Domain-specific):

- `src/domains/budgets/components/budget-form.tsx`
- `src/domains/budgets/components/budget-card.tsx`
- `src/domains/budgets/components/category-allocation-form.tsx`
- `src/domains/transactions/components/transaction-form.tsx`
- `src/domains/transactions/components/transaction-list.tsx`
- `src/domains/transactions/components/transaction-filters.tsx`
- `src/domains/reports/components/category-pie-chart.tsx`
- `src/domains/reports/components/trends-line-chart.tsx`
- `src/domains/goals/components/goal-card.tsx`
- `src/domains/goals/components/goal-progress.tsx`

Layouts:

- `src/components/layouts/mobile-bottom-nav.tsx`
- `src/components/layouts/desktop-sidebar-nav.tsx`
- `src/components/layouts/app-header.tsx`

**Text Maps** (See section 5):

- `src/domains/budgets/budget.text-map.ts`
- `src/domains/transactions/transaction.text-map.ts`
- `src/domains/reports/report.text-map.ts`
- `src/domains/goals/goal.text-map.ts`
- `src/domains/settings/setting.text-map.ts`
- `src/components/common.text-map.ts`

**Styles** (Custom styles if needed):

- `src/styles/components/atoms/currency-input.css` (if complex styling needed)
- `src/styles/components/molecules/summary-card.css` (if @apply patterns emerge)
- `src/app/globals.css` (update with new CSS variables if needed)

**Pages** (App Router):

- `src/app/(authenticated)/dashboard/page.tsx`
- `src/app/(authenticated)/presupuesto/page.tsx`
- `src/app/(authenticated)/movimientos/page.tsx`
- `src/app/(authenticated)/reportes/page.tsx`
- `src/app/(authenticated)/metas/page.tsx`
- `src/app/(authenticated)/configuracion/page.tsx`

---

## 13. Important Notes

⚠️ **User testing recommended**: After implementing MVP dashboard and transaction flows, conduct usability testing with 5 users to validate:

- Time to add first transaction (target: < 30 seconds)
- Comprehension of budget status (target: < 5 seconds)
- Navigation intuitiveness (success rate: > 90%)

⚠️ **Accessibility is mandatory**:

- All interactive elements must be keyboard accessible
- Screen reader testing required before production
- Color contrast must meet WCAG AA minimum
- Focus indicators always visible
- ARIA labels for all icons and dynamic content

💡 **Mobile-first**:

- Design and implement mobile layouts first
- Test on real devices (iOS Safari, Android Chrome)
- Ensure touch targets are 44x44px minimum
- Optimize for one-handed use (FAB in reach zone)

💡 **Content before chrome**:

- Financial data is the priority, not decorative elements
- Remove any visual element that doesn't serve user goals
- Every color has semantic meaning
- White space is a feature, not wasted space

📝 **Iterate**:

- This design will evolve based on user feedback
- Track analytics: most-used features, drop-off points
- A/B test critical flows (e.g., transaction entry)
- Version 2 should address pain points from v1

🎨 **Consistency**:

- Before creating new patterns, check if existing ones can be reused
- Maintain design system discipline (don't deviate from spacing/color scales)
- Document any new patterns added
- Ensure all domains follow same interaction patterns

---

## 14. Success Metrics

### Usability

**Measurement**:

- Task completion rate: Can 9/10 users create a budget without help?
- Time on task: How long to add a transaction? (target: < 30s)
- Error rate: How many form validation errors per submission? (target: < 0.5)
- Navigation success: Can users find Reports page without instruction? (target: > 90%)

**Testing Methods**:

- Moderated usability testing (5 users)
- Unmoderated remote testing (UserTesting.com)
- Heatmaps and session recordings (Hotjar or PostHog)

### Efficiency

**Measurement**:

- Average transaction entry time (from FAB tap to confirmation)
- Number of clicks/taps to complete key tasks
- Time to insight: How long to understand current budget status? (target: < 5s)

**Tracking**:

- Custom analytics events (e.g., "transaction_form_opened", "transaction_created")
- Measure time between events
- Funnel analysis: Where do users drop off?

### Satisfaction

**Measurement**:

- NPS (Net Promoter Score): After 1 week of use
- CSAT (Customer Satisfaction): After completing key tasks
- Qualitative feedback: User interviews, in-app feedback form

**Questions**:

- "How likely are you to recommend Mis Finanzas to a friend?" (NPS)
- "How satisfied are you with the budget creation process?" (CSAT)
- "What's the most frustrating part of using Mis Finanzas?" (Open-ended)

### Accessibility

**Measurement**:

- Lighthouse accessibility score: > 95
- Screen reader testing: 100% of features usable with NVDA/VoiceOver
- Keyboard-only navigation: 100% of features accessible
- Color contrast violations: 0

**Testing Methods**:

- Automated: Lighthouse, axe DevTools, WAVE
- Manual: Screen reader testing (NVDA on Windows, VoiceOver on macOS/iOS)
- User testing: Recruit 2-3 users with disabilities

### Performance

**Measurement**:

- Lighthouse performance score: > 90
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Tools**:

- Lighthouse CI (automated testing)
- Chrome DevTools Performance tab
- Real User Monitoring (Vercel Analytics or similar)

---

## Summary

**Design Highlights**:

✅ **Pages Designed**: 6 main pages (Dashboard, Presupuesto, Movimientos, Reportes, Metas, Configuración)

✅ **Component Count**:

- 8 shadcn/ui components (Button, Input, Select, Card, Toast, Dialog, Sheet, Progress)
- 8 recharts components (PieChart, LineChart, BarChart, ResponsiveContainer, etc.)
- 8 custom components (CurrencyInput, CategoryIcon, FAB, SummaryCard, TransactionListItem, MonthSelector, BudgetProgressBar, EmptyState)
- **Total: 24 component types**

✅ **Text Map Entries**:

- Budgets: ~50 keys
- Transactions: ~60 keys
- Reports: ~30 keys
- Goals: ~40 keys
- Settings: ~25 keys
- Common: ~60 keys
- **Total: ~265 text keys**

✅ **User Flows**: 5 complete flows documented (first-time user, daily user, desktop review, error recovery, delete confirmation)

✅ **Accessibility Features**:

- WCAG 2.1 AA compliance
- Keyboard navigation with logical tab order
- Screen reader support with ARIA labels and live regions
- Color contrast ratios > 4.5:1
- Touch targets 44x44px minimum
- Motion preferences respected

✅ **Responsive Strategy**:

- Mobile-first design
- 3 breakpoints (mobile < 640px, tablet 640-1024px, desktop > 1024px)
- Bottom nav (mobile) → Sidebar nav (desktop)
- Single column → Multi-column layouts
- FAB (mobile) → Inline buttons (desktop)

✅ **Key Interactions**:

- Add transaction: < 30 seconds (3 taps on mobile)
- Budget status visibility: < 5 seconds
- Real-time budget calculations
- Optimistic updates for instant feedback
- Comprehensive error handling with recovery paths

✅ **Design Principles Applied**:

- Minimalism: Generous white space, clean layouts
- Clarity: Large financial numbers, color-coded status
- Efficiency: Fast data entry, minimal clicks
- Feedback: Immediate visual response to all actions
- Consistency: Repeated patterns across all pages
- Accessibility: Not an afterthought, built-in from start

**Recommendations**:

1. **shadcn-builder**: Install 16 shadcn components + recharts library + sonner for toasts
2. **domain-architect**: Design data structures that support real-time calculations (budget spent, remaining, percentage)
3. **nextjs-builder**: Implement (authenticated) layout with conditional nav (mobile vs desktop)
4. **Parent**:
   - Implement in phases: Dashboard → Transactions → Budget → Reports → Goals → Settings
   - Start with mobile layouts, then add desktop enhancements
   - Create text maps before implementing pages
   - Test accessibility continuously (don't defer to end)

**Next Steps**:

1. Parent reviews UX plan and approves approach
2. Coordinate with shadcn-builder to install required components
3. Coordinate with domain-architect to confirm data structures support UI needs
4. Parent implements design step-by-step (mobile-first)
5. Conduct usability testing after Dashboard + Transactions are complete
6. Iterate based on feedback before proceeding to remaining pages

**Critical Path for Implementation**:

1. Design tokens setup (CSS variables for colors, spacing)
2. Create text maps (all 6 files)
3. Install shadcn components (shadcn-builder)
4. Build atomic components (CurrencyInput, CategoryIcon, FAB)
5. Build molecule components (SummaryCard, TransactionListItem, etc.)
6. Implement Dashboard page (highest priority)
7. Implement Movimientos page (add/edit transaction flows)
8. Implement Presupuesto page (budget creation/editing)
9. Implement Reportes page (charts)
10. Implement Metas and Configuración pages (lower priority)
11. Accessibility audit and fixes
12. Performance optimization
13. User testing and iteration

---

**Plan Status**: ✅ Complete and ready for implementation

**Estimated Implementation Time**:

- Phase 1 (Dashboard + Transactions): 3-4 weeks
- Phase 2 (Budget + Reports): 2-3 weeks
- Phase 3 (Goals + Settings + Polish): 2-3 weeks
- **Total: 7-10 weeks** for full UI implementation

**Dependencies**:

- Domain data structures from domain-architect
- App Router structure from nextjs-builder
- shadcn component installation from shadcn-builder

**Risks**:

- Mobile chart legibility (mitigation: test on real devices early)
- Form complexity on small screens (mitigation: progressive disclosure, multi-step if needed)
- Performance with 1000+ transactions (mitigation: virtualized lists, pagination)

**Go/No-Go Decision Points**:

- After Dashboard implementation: Test with 5 users, validate "5-second clarity" goal
- After transaction flows: Validate "30-second entry" goal
- Before launch: Accessibility audit must pass (score > 95, no critical issues)
