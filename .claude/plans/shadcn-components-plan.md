# Mis Finanzas - shadcn/ui Component Selection Plan

**Created**: 2025-12-30  
**Type**: shadcn Component Selection  
**Project**: Mis Finanzas - Minimalist Finance App

---

## 1. shadcn/ui Components Required

### Existing Components (Already Installed - Reuse)

#### `button`

- **Location**: `@/components/ui/button.tsx`
- **Purpose**: Primary actions, secondary actions, icon buttons
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Usage**: Save buttons, delete actions, add transaction, filters

#### `input`

- **Location**: `@/components/ui/input.tsx`
- **Purpose**: Text inputs for amounts, descriptions
- **Usage**: Transaction amounts, budget limits, search fields
- **Customization Needed**: Currency prefix support (`$`), number formatting

#### `select`

- **Location**: `@/components/ui/select.tsx`
- **Radix Primitive**: `@radix-ui/react-select`
- **Purpose**: Category dropdown, payment method dropdown
- **Usage**: Category selection, filter dropdowns, month selectors

---

### New Components to Install

**Installation Commands**:

```bash
# Forms & Input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add calendar
pnpm dlx shadcn@latest add checkbox
pnpm dlx shadcn@latest add radio-group

# Data Display
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add progress
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add separator
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add skeleton

# Feedback & Overlays
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add alert
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add sheet

# Navigation
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add dropdown-menu

# Utilities
pnpm dlx shadcn@latest add popover
pnpm dlx shadcn@latest add hover-card
pnpm dlx shadcn@latest add scroll-area
```

**Component Details**:

#### `label`

- **Purpose**: Form field labels for accessibility
- **Radix Primitive**: `@radix-ui/react-label`
- **Key Props**: `htmlFor` (associates with input)
- **Accessibility**: Automatic click-to-focus association
- **Usage**: All form inputs (budget forms, transaction forms)

#### `textarea`

- **Purpose**: Multi-line text for transaction notes/descriptions
- **Usage**: Transaction notes, budget descriptions
- **Accessibility**: Automatic resize, char count support

#### `form`

- **Purpose**: Form wrapper with React Hook Form integration
- **Radix Primitive**: Context-based validation
- **Key Props**: `control`, `name`, `render`
- **Accessibility**: Automatic error announcements
- **Integration**: Works with `zod` + `react-hook-form`
- **Usage**: All complex forms (budget creation, transaction entry)

#### `calendar`

- **Purpose**: Date selection for transactions and reports
- **Radix Primitive**: Custom calendar component
- **Key Props**: `mode`, `selected`, `onSelect`
- **Accessibility**: Keyboard navigation, ARIA grid
- **Usage**: Transaction date picker, report date range

#### `checkbox`

- **Purpose**: Settings preferences, multi-select filters
- **Radix Primitive**: `@radix-ui/react-checkbox`
- **Key Props**: `checked`, `onCheckedChange`
- **Accessibility**: Keyboard toggle, screen reader support
- **Usage**: Settings page, filter selections

#### `radio-group`

- **Purpose**: Alternative to Select for payment method selection
- **Radix Primitive**: `@radix-ui/react-radio-group`
- **Key Props**: `value`, `onValueChange`
- **Accessibility**: Arrow key navigation
- **Usage**: Payment method selection, expense/income toggle

#### `card`

- **Purpose**: Container for summary cards, budget cards, transaction items
- **Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Usage**: Dashboard summary cards, budget category cards, goal cards
- **Customization**: Soft shadows (`shadow-sm`), rounded corners (`rounded-xl`)

#### `badge`

- **Purpose**: Category tags, status indicators
- **Variants**: default, secondary, destructive, outline
- **Usage**: Category labels, budget status (on track/warning/exceeded)
- **Customization**: Color variants per category

#### `progress`

- **Purpose**: Budget tracking, goal progress
- **Radix Primitive**: `@radix-ui/react-progress`
- **Key Props**: `value`, `max`, `className`
- **Usage**: Budget spending bars, goal achievement
- **Customization**:
  - Green: Budget on track (0-80%)
  - Yellow: Warning (80-100%)
  - Red: Over budget (>100%)
  - Height variants: `h-2`, `h-4`

#### `table`

- **Purpose**: Alternative layout for transaction history (desktop)
- **Components**: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- **Usage**: Desktop transaction list, report tables
- **Accessibility**: Semantic table markup, sortable headers

#### `separator`

- **Purpose**: Visual dividers between sections
- **Radix Primitive**: `@radix-ui/react-separator`
- **Usage**: Section dividers in dashboard, settings

#### `avatar`

- **Purpose**: User profile display
- **Radix Primitive**: `@radix-ui/react-avatar`
- **Components**: `Avatar`, `AvatarImage`, `AvatarFallback`
- **Usage**: User menu, profile settings

#### `skeleton`

- **Purpose**: Loading states for data
- **Usage**: Dashboard loading, transaction list loading, chart loading
- **Pattern**: Match shape of content (card skeletons, list skeletons)

#### `toast`

- **Purpose**: Success/error notifications
- **Radix Primitive**: `@radix-ui/react-toast`
- **Variants**: default, destructive
- **Messages**:
  - Success: "Presupuesto creado", "Transacción guardada"
  - Error: "Error al guardar", "Validación fallida"
- **Position**: bottom-right (desktop), top (mobile)
- **Auto-dismiss**: 3-5 seconds

#### `alert`

- **Purpose**: Warning messages, validation errors
- **Variants**: default, destructive
- **Components**: `Alert`, `AlertTitle`, `AlertDescription`
- **Usage**: Budget exceeded warnings, form validation errors

#### `dialog`

- **Purpose**: Delete confirmations, important actions (desktop)
- **Radix Primitive**: `@radix-ui/react-dialog`
- **Components**: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **Accessibility**: Focus trap, ESC to close, backdrop click
- **Usage**: Delete transaction confirmation, logout confirmation

#### `sheet`

- **Purpose**: Mobile menu, filters panel, add/edit forms
- **Radix Primitive**: `@radix-ui/react-dialog` (styled as slide-over)
- **Components**: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`
- **Side**: bottom (mobile forms), left (mobile navigation)
- **Usage**: Mobile add transaction form, mobile filters, mobile menu

#### `tabs`

- **Purpose**: Income/Expense toggle in Movimientos
- **Radix Primitive**: `@radix-ui/react-tabs`
- **Components**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Accessibility**: Arrow key navigation, automatic ARIA
- **Usage**: Income vs Expense views, report type switches

#### `dropdown-menu`

- **Purpose**: User menu, transaction actions (edit/delete)
- **Radix Primitive**: `@radix-ui/react-dropdown-menu`
- **Components**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`
- **Accessibility**: Keyboard navigation, automatic positioning
- **Usage**: Transaction row actions, user profile menu

#### `popover`

- **Purpose**: Tooltips, help text, info popovers
- **Radix Primitive**: `@radix-ui/react-popover`
- **Components**: `Popover`, `PopoverTrigger`, `PopoverContent`
- **Usage**: Budget category explanations, icon tooltips

#### `hover-card`

- **Purpose**: Category details on hover
- **Radix Primitive**: `@radix-ui/react-hover-card`
- **Usage**: Show full category info on hover in dashboard

#### `scroll-area`

- **Purpose**: Smooth scrolling for transaction lists
- **Radix Primitive**: `@radix-ui/react-scroll-area`
- **Usage**: Transaction list scrolling, long settings pages

---

## 2. Component Composition Strategy

### Primary Compositions

#### **Transaction Form (Mobile)**

**Pattern**: Sheet + Form + Input/Select/Calendar + Button  
**Components**: `sheet`, `form`, `input`, `select`, `textarea`, `calendar`, `button`, `label`

```typescript
<Sheet>
  <SheetTrigger asChild>
    <Button size="icon"><Plus /></Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Nueva Transacción</SheetTitle>
    </SheetHeader>
    <Form {...form}>
      <FormField name="amount">
        <Label>Monto</Label>
        <Input type="number" />
      </FormField>
      <FormField name="category">
        <Label>Categoría</Label>
        <Select>...</Select>
      </FormField>
      <FormField name="date">
        <Label>Fecha</Label>
        <Calendar />
      </FormField>
      <Button type="submit">Guardar</Button>
    </Form>
  </SheetContent>
</Sheet>
```

#### **Transaction Form (Desktop)**

**Pattern**: Dialog + Form + Input/Select/Calendar + Button

```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button><Plus /> Nueva Transacción</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nueva Transacción</DialogTitle>
    </DialogHeader>
    <Form {...form}>
      {/* Same fields as mobile */}
    </Form>
  </DialogContent>
</Dialog>
```

#### **Budget Progress Card**

**Pattern**: Card + Progress + Badge

```typescript
<Card>
  <CardHeader>
    <CardTitle>Comida</CardTitle>
    <CardDescription>$350 / $500</CardDescription>
  </CardHeader>
  <CardContent>
    <Progress value={70} className="h-2 bg-green-500" />
  </CardContent>
  <CardFooter>
    <Badge variant="outline">En camino</Badge>
  </CardFooter>
</Card>
```

#### **Transaction List Item**

**Pattern**: Card + DropdownMenu + Badge

```typescript
<Card>
  <CardContent className="flex items-center justify-between">
    <div>
      <p className="font-medium">Supermercado</p>
      <Badge>Comida</Badge>
    </div>
    <div className="text-right">
      <p className="font-bold text-red-600">-$45.00</p>
      <p className="text-sm text-gray-500">Hoy</p>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">⋮</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </CardContent>
</Card>
```

#### **Delete Confirmation**

**Pattern**: Dialog + Alert + Button

```typescript
<Dialog>
  <DialogContent>
    <Alert variant="destructive">
      <AlertTitle>¿Estás seguro?</AlertTitle>
      <AlertDescription>
        Esta acción no se puede deshacer.
      </AlertDescription>
    </Alert>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button variant="destructive">Eliminar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. Component Variants and Customization

### Using Built-in Variants

#### **Button**

- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: default, sm, lg, icon
- **Usage**:
  - Primary actions: `variant="default"` (blue background)
  - Delete actions: `variant="destructive"` (red)
  - Icon-only: `size="icon"` with `<Plus />` icon

```typescript
<Button variant="default" size="lg">Guardar Presupuesto</Button>
<Button variant="destructive" size="sm">Eliminar</Button>
<Button variant="ghost" size="icon"><Plus /></Button>
```

#### **Badge**

- `variant`: default, secondary, destructive, outline
- **Custom Colors** (via className):
  - Category tags: `className="bg-blue-100 text-blue-800"`
  - Status: Green (on track), Yellow (warning), Red (exceeded)

```typescript
<Badge variant="outline" className="bg-green-100 text-green-800">En camino</Badge>
<Badge variant="outline" className="bg-yellow-100 text-yellow-800">Alerta</Badge>
<Badge variant="destructive">Excedido</Badge>
```

#### **Progress**

- **Color Customization**:
  - Green: `className="[&>div]:bg-green-500"` (0-80% spent)
  - Yellow: `className="[&>div]:bg-yellow-500"` (80-100% spent)
  - Red: `className="[&>div]:bg-red-500"` (>100% spent)
- **Height**: `className="h-2"` or `className="h-4"`

```typescript
<Progress value={70} className="h-2 [&>div]:bg-green-500" />
<Progress value={85} className="h-2 [&>div]:bg-yellow-500" />
<Progress value={105} className="h-2 [&>div]:bg-red-500" />
```

#### **Alert**

- `variant`: default, destructive
- **Usage**:
  - Warnings: `variant="default"` with warning icon
  - Errors: `variant="destructive"`

```typescript
<Alert variant="default">
  <AlertTitle>Presupuesto alcanzado</AlertTitle>
  <AlertDescription>Has gastado el 80% de tu presupuesto mensual.</AlertDescription>
</Alert>
```

#### **Card**

- **Custom Styling**:
  - Soft shadows: `className="shadow-sm"`
  - Rounded corners: `className="rounded-xl"`
  - Padding: `className="p-4"` or `className="p-6"`

```typescript
<Card className="rounded-xl shadow-sm">
  <CardContent className="p-6">...</CardContent>
</Card>
```

---

## 4. shadcn/ui Accessibility Features

### Built-in Accessibility (from Radix UI)

- **Keyboard Navigation**: All interactive components support Tab, Enter, Escape, Arrow keys
- **ARIA Attributes**: Automatic `aria-label`, `aria-describedby`, `aria-expanded`, etc.
- **Focus Management**: Focus trap in Dialogs/Sheets, focus restoration on close
- **Screen Reader**: Automatic announcements for state changes (toast, alerts)

### Component-Specific A11y

#### `form` + `label`

- Automatic `for` and `id` association
- Error announcements via `aria-invalid` and `aria-describedby`

#### `dialog` / `sheet`

- Focus trap when open
- ESC key closes
- Backdrop click closes (optional)
- Focus returns to trigger on close

#### `toast`

- Automatic screen reader announcements
- Dismissible with keyboard (ESC or focus + Enter)

#### `dropdown-menu`

- Arrow key navigation
- Enter/Space to select
- ESC to close

#### `calendar`

- Grid navigation (arrow keys)
- Page Up/Down for month navigation
- Home/End for week navigation

---

## 5. Installation Verification

After installation, verify:

1. **Components exist**: Check `@/components/ui/` directory for all new files
2. **Dependencies installed**: Verify `package.json` includes all `@radix-ui` packages
3. **Types available**: TypeScript recognizes component imports
4. **Imports work**: Test `import { Button } from "@/components/ui/button"`

---

## 6. Additional Libraries Required

### 1. recharts (Charts for Reports)

**Installation**:

```bash
pnpm install recharts
```

**Purpose**: Data visualization for Reports page  
**Components Needed**:

- `PieChart` - Category distribution
- `LineChart` - Income vs expenses over time
- `BarChart` - Month-over-month comparison

**Reason**: React-based, customizable, works seamlessly with Tailwind CSS

**Usage Example**:

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={categoryData} dataKey="value" nameKey="name">
      {categoryData.map((entry, index) => (
        <Cell key={index} fill={entry.color} />
      ))}
    </Pie>
  </PieChart>
</ResponsiveContainer>
```

---

### 2. react-hook-form (Form State Management)

**Installation**:

```bash
pnpm install react-hook-form @hookform/resolvers
```

**Purpose**: Form state management with validation  
**Reason**: Already in tech stack, integrates with shadcn `form` component

**Usage**: Budget forms, transaction forms, settings forms

**Integration with shadcn**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

const form = useForm({
  resolver: zodResolver(transactionSchema),
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField name="amount" control={form.control} render={({ field }) => (
      <FormItem>
        <FormLabel>Monto</FormLabel>
        <FormControl>
          <Input type="number" {...field} />
        </FormControl>
      </FormItem>
    )} />
  </form>
</Form>
```

---

### 3. zod (Validation Schemas)

**Installation**:

```bash
pnpm install zod
```

**Purpose**: Type-safe validation schemas  
**Reason**: Already in tech stack, integrates with react-hook-form

**Usage**: Define validation rules for all forms

**Example Schema**:

```typescript
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().optional(),
  date: z.date(),
  type: z.enum(['income', 'expense'])
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
```

---

### 4. date-fns (Date Formatting)

**Installation**:

```bash
pnpm install date-fns
```

**Purpose**: Lightweight date manipulation and formatting  
**Reason**: Works with shadcn Calendar/DatePicker, no heavy dependencies

**Usage**: Format dates for display, calculate date ranges

**Example**:

```typescript
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const formattedDate = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });
// "30 de diciembre, 2025"

const lastMonthRange = {
  start: startOfMonth(subMonths(new Date(), 1)),
  end: endOfMonth(subMonths(new Date(), 1))
};
```

---

### 5. lucide-react (Icons)

**Status**: Already installed (comes with shadcn)  
**Version**: `^0.503.0` (from package.json)

**Icons Needed**:

**Navigation**:

- `Home` - Dashboard
- `TrendingUp` / `TrendingDown` - Movimientos
- `DollarSign` - Presupuesto
- `BarChart3` - Reportes
- `Settings` - Configuración

**Actions**:

- `Plus` - Add transaction/budget
- `Filter` - Filter panel
- `Search` - Search transactions
- `Calendar` - Date picker trigger
- `Download` - Export data
- `Upload` - Import data
- `Edit` - Edit action
- `Trash2` - Delete action
- `MoreVertical` - Dropdown menu trigger

**Feedback**:

- `Check` - Success
- `X` - Error/Close
- `AlertCircle` - Warning
- `Info` - Information

**Categories** (examples):

- `ShoppingCart` - Groceries
- `Car` - Transportation
- `Home` - Housing
- `Heart` - Health
- `Utensils` - Food
- `Zap` - Utilities

**Usage**:

```typescript
import { Plus, TrendingDown, DollarSign } from 'lucide-react';

<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>

<Badge>
  <TrendingDown className="mr-1 h-3 w-3" />
  Gasto
</Badge>
```

---

## 7. Component-to-Page Mapping

### Dashboard

**Components**:

- `card` - Summary cards (total income, total expenses, savings)
- `card` - Budget overview cards
- `card` - Goal cards
- `progress` - Budget tracking bars
- `badge` - Category labels, status indicators
- `skeleton` - Loading states for cards
- `separator` - Section dividers

**Layout**:

```
[Summary Cards (Grid)]
[Budget Overview (Card with Progress)]
[Recent Transactions (Card list)]
```

---

### Movimientos (Transactions)

**Components**:

- `tabs` - Income/Expense toggle
- `sheet` - Add/Edit transaction form (mobile)
- `dialog` - Add/Edit transaction form (desktop)
- `card` - Transaction list items
- `input` - Amount, description (in form)
- `select` - Category, payment method (in form)
- `textarea` - Notes (in form)
- `calendar` - Date picker (in form)
- `button` - Add, save, cancel, filter
- `dropdown-menu` - Transaction row actions (edit/delete)
- `toast` - Success/error feedback
- `badge` - Category tags
- `scroll-area` - Transaction list scrolling
- `skeleton` - Loading states

**Layout (Mobile)**:

```
[Tabs: Income | Expense]
[Filter Button] [Add Button (Sheet trigger)]
[Transaction Cards (ScrollArea)]
```

**Layout (Desktop)**:

```
[Tabs: Income | Expense] [Filter] [Add (Dialog trigger)]
[Table with DropdownMenu per row]
```

---

### Presupuesto (Budget)

**Components**:

- `card` - Budget summary card
- `card` - Category allocation cards
- `input` - Budget limit inputs
- `select` - Month/Year selector, category selector
- `progress` - Category spending progress
- `button` - Save, duplicate, reset
- `alert` - Validation warnings (total exceeds income)
- `toast` - Save success/error
- `badge` - Category status
- `skeleton` - Loading state

**Layout**:

```
[Budget Summary Card]
[Category Allocation Cards (Grid)]
  [Category Name]
  [Progress Bar]
  [Amount Input]
[Save Button]
```

---

### Reportes (Reports)

**Components**:

- `calendar` - Date range picker
- `card` - Summary cards (total income, expenses, savings for period)
- `badge` - Legend items for charts
- `skeleton` - Chart loading states
- `button` - Export, print
- `tabs` - Chart type selector (pie, line, bar)
- **recharts** - PieChart, LineChart, BarChart

**Layout**:

```
[Date Range Picker (Calendar)]
[Summary Cards]
[Tabs: Category | Trends | Comparison]
[Chart Area (recharts)]
[Export Button]
```

---

### Configuración (Settings)

**Components**:

- `card` - Settings section cards (User, Categories, Preferences, Data)
- `input` - Name, email
- `select` - Currency, language
- `checkbox` - Notification preferences
- `button` - Save, export, import, delete account
- `alert` - Confirmation messages
- `dialog` - Delete account confirmation
- `toast` - Settings saved
- `avatar` - User profile picture
- `separator` - Section dividers

**Layout**:

```
[User Profile Card]
  [Avatar]
  [Input: Name, Email]
[Preferences Card]
  [Select: Currency, Language]
  [Checkbox: Notifications]
[Data Management Card]
  [Button: Export]
  [Button: Import]
  [Button: Delete Account (Dialog trigger)]
```

---

## 8. Installation Script

**Complete Installation (Single Command)**:

```bash
# Install all shadcn components
pnpm dlx shadcn@latest add label textarea form calendar checkbox radio-group card badge progress table separator avatar skeleton toast alert dialog sheet tabs dropdown-menu popover hover-card scroll-area

# Install additional libraries
pnpm install recharts react-hook-form @hookform/resolvers zod date-fns
```

**Note**: `button`, `input`, `select`, and `lucide-react` are already installed.

---

## 9. Important Notes

⚠️ **NEVER modify shadcn source files** in `@/components/ui/`  
⚠️ **Composition over modification**: Wrap shadcn components, don't edit them  
💡 **Check registry first**: Verify component doesn't already exist before installing  
💡 **Use variants**: Don't create new components for style changes - use `variant` or `className`  
📝 **Coordinate with UX designer**: For full component architecture and custom domain components

### shadcn Component Philosophy

- **Primitives**: shadcn components are building blocks, not final UI
- **Composition**: Combine multiple shadcn components to create feature-specific components
- **Customization**: Use `className` and Tailwind for styling, not component modification
- **Accessibility**: Trust Radix UI primitives for a11y - it's built-in

---

## 10. Next Steps for Parent Agent

1. ✅ Run installation script (all components + libraries)
2. ✅ Verify components exist in `@/components/ui/`
3. ✅ Verify dependencies in `package.json` (`@radix-ui/*`, `recharts`, etc.)
4. ✅ Test imports: `import { Button } from "@/components/ui/button"`
5. 🔄 Coordinate with UX designer for full component architecture
6. 🔄 Implement composition patterns as specified above
7. 🔄 Test accessibility features (keyboard nav, screen reader)
8. 🔄 Create Storybook stories for key compositions

---

## Summary

**Total Components**:

- **Existing**: 3 (button, input, select)
- **New**: 21 (label, textarea, form, calendar, checkbox, radio-group, card, badge, progress, table, separator, avatar, skeleton, toast, alert, dialog, sheet, tabs, dropdown-menu, popover, hover-card, scroll-area)
- **Total**: 24 shadcn components

**Additional Libraries**: 4

- recharts (charts)
- react-hook-form (forms)
- zod (validation)
- date-fns (dates)

**Icons**: lucide-react (already installed) - ~20 icons needed

**Radix Primitives Used**: 15+

- Dialog, Select, Tabs, Checkbox, RadioGroup, Progress, Label, Toast, DropdownMenu, Popover, HoverCard, ScrollArea, Avatar, Separator, Checkbox

**Accessibility**: All components have built-in keyboard navigation, ARIA attributes, focus management, and screen reader support via Radix UI.

**Installation Time**: ~2-3 minutes for all components + libraries

---

**Plan Complete** ✅  
Ready for parent agent to execute installation and coordinate with UX designer.
