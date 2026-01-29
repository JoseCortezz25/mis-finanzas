# Budget Allocation - shadcn/ui Component Selection Plan

**Created**: 2026-01-28
**Session**: budget-allocation-20260128
**Type**: shadcn Component Selection

## 1. shadcn/ui Components Required

### New Components to Install

**Installation Commands**:
```bash
# Chart components (includes recharts integration)
pnpm dlx shadcn@latest add chart

# May already be installed, but verify:
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add separator
```

**Components**:

#### `chart`
- **Purpose**: Pie chart for allocation distribution visualization
- **Underlying Library**: recharts (Recharts library with shadcn theming)
- **Key Props**:
  - `config`: Chart configuration for theming
  - `ChartContainer`: Responsive wrapper
  - `ChartTooltip`: Hover tooltips
  - `ChartLegend`: Legend display
- **Accessibility**:
  - Automatic ARIA labels
  - Keyboard navigation support
  - Screen reader descriptions

#### `card`
- **Purpose**: Container for pie chart and allocation distribution display
- **Radix Primitive**: None (pure CSS component)
- **Key Sub-components**:
  - `Card`: Main container
  - `CardHeader`: Title and description area
  - `CardTitle`: Heading
  - `CardDescription`: Subtitle
  - `CardContent`: Main content area
  - `CardFooter`: Optional footer
- **Accessibility**: Semantic HTML structure

#### `button`
- **Purpose**: "Añadir del Fondo General" action button, form submit, cancel
- **Variants**:
  - `default`: Primary actions (submit)
  - `secondary`: Secondary actions (trigger inline form)
  - `outline`: Alternative style
  - `ghost`: Subtle actions
  - `destructive`: Delete actions
  - `link`: Link-styled button
- **Sizes**: `sm`, `default`, `lg`, `icon`
- **Accessibility**: Proper focus states, keyboard support

#### `input`
- **Purpose**: Amount input, description input in allocation form
- **Type**: text, number
- **Key Props**: `type`, `placeholder`, `disabled`, `aria-*`
- **Accessibility**: Built-in label association, error states

#### `label`
- **Purpose**: Form field labels
- **Accessibility**: Automatic `htmlFor` association with inputs

#### `select`
- **Purpose**: Category dropdown in allocation form
- **Radix Primitive**: Radix UI Select
- **Sub-components**:
  - `Select`: Root
  - `SelectTrigger`: Clickable trigger
  - `SelectValue`: Selected value display
  - `SelectContent`: Dropdown content
  - `SelectItem`: Individual options
- **Accessibility**: Keyboard navigation, ARIA attributes

#### `badge`
- **Purpose**: Visual indicator for allocation type in transaction list
- **Variants**: `default`, `secondary`, `outline`, `destructive`
- **Use Case**: Show "Asignación" badge on allocation items

#### `alert-dialog`
- **Purpose**: Confirmation dialog for deleting allocations
- **Radix Primitive**: Radix UI AlertDialog
- **Sub-components**:
  - `AlertDialog`: Root
  - `AlertDialogTrigger`: Opens dialog
  - `AlertDialogContent`: Dialog content
  - `AlertDialogHeader`: Title area
  - `AlertDialogTitle`: Heading
  - `AlertDialogDescription`: Message
  - `AlertDialogFooter`: Action buttons
  - `AlertDialogAction`: Confirm button
  - `AlertDialogCancel`: Cancel button
- **Accessibility**: Focus trapping, ESC to close, ARIA roles

#### `toast`
- **Purpose**: Success/error notifications after create/delete operations
- **Library**: Sonner (via shadcn)
- **Usage**: `toast.success()`, `toast.error()`
- **Accessibility**: ARIA live regions, auto-dismiss

#### `separator`
- **Purpose**: Visual dividers between sections (optional)
- **Variants**: Horizontal, vertical
- **Accessibility**: Decorative role

### Existing Components to Reuse

Verify these components already exist in `@/components/ui/`:

- `card` - Likely exists (used throughout app)
- `button` - Likely exists
- `input` - Likely exists
- `label` - Likely exists
- `select` - Verify if exists
- `badge` - Verify if exists
- `toast` - Verify if exists (or using sonner)

**Action**: Check `src/components/ui/` directory for existing components before installing.

## 2. Component Composition Strategy

### Primary Composition 1: Allocation Distribution Chart Card

**Base Components**: `Card`, `ChartContainer`, `PieChart` (recharts)

**Composition Approach**: Nest chart inside Card component with header and content

**Structure**:
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

<Card>
  <CardHeader>
    <CardTitle>Distribución de Asignaciones</CardTitle>
    <CardDescription>Cómo está distribuido tu fondo general</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distributionData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <ChartTooltip />
          <ChartLegend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>

    {/* Optional: Total summary below chart */}
    <div className="mt-4 text-center">
      <p className="text-sm text-muted-foreground">
        Total asignado: <span className="font-semibold">${totalAllocated}</span>
      </p>
    </div>
  </CardContent>
</Card>
```

### Primary Composition 2: Inline Allocation Form

**Base Components**: `Input`, `Label`, `Select`, `Button`

**Composition Approach**: Controlled form with validation, inline display

**Structure**:
```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

<div className="rounded-lg border bg-card p-6 space-y-4">
  <h3 className="text-lg font-semibold">Asignar del Fondo General</h3>

  <div className="space-y-2">
    <Label htmlFor="amount">Monto *</Label>
    <Input
      id="amount"
      type="number"
      placeholder="0.00"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      aria-describedby="amount-helper"
    />
    <p id="amount-helper" className="text-xs text-muted-foreground">
      Monto a asignar del fondo general
    </p>
    {errors.amount && (
      <p className="text-xs text-destructive">{errors.amount}</p>
    )}
  </div>

  <div className="space-y-2">
    <Label htmlFor="category">Categoría *</Label>
    <Select value={categoryId} onValueChange={setCategoryId}>
      <SelectTrigger id="category">
        <SelectValue placeholder="Seleccionar categoría" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {errors.category && (
      <p className="text-xs text-destructive">{errors.category}</p>
    )}
  </div>

  <div className="space-y-2">
    <Label htmlFor="description">Descripción (opcional)</Label>
    <Input
      id="description"
      type="text"
      placeholder="Añade una nota si deseas"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      maxLength={200}
    />
  </div>

  <div className="flex gap-2 justify-end">
    <Button variant="outline" onClick={onCancel}>
      Cancelar
    </Button>
    <Button onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Asignando..." : "Asignar"}
    </Button>
  </div>
</div>
```

### Primary Composition 3: Delete Confirmation Dialog

**Base Components**: `AlertDialog` and sub-components

**Composition Approach**: Trigger on delete icon click

**Structure**:
```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Eliminar asignación">
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>¿Eliminar asignación?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta acción no se puede deshacer.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Sí, eliminar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Primary Composition 4: Allocation Badge in List

**Base Components**: `Badge`

**Composition Approach**: Display allocation type indicator

**Structure**:
```typescript
import { Badge } from "@/components/ui/badge";

<div className="flex items-center gap-2">
  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
    <Tag className="h-3 w-3 mr-1" />
    Asignación
  </Badge>
  <span className="text-sm">del fondo general</span>
</div>
```

## 3. Component Variants and Customization

### Using Built-in Variants

#### Button Variants

**Primary Action** (Submit allocation):
```typescript
<Button variant="default" size="default">Asignar</Button>
```

**Secondary Action** (Trigger form):
```typescript
<Button variant="secondary" size="default">
  <Plus className="h-4 w-4 mr-2" />
  Añadir del Fondo General
</Button>
```

**Cancel Action**:
```typescript
<Button variant="outline" size="default">Cancelar</Button>
```

**Delete Action** (icon button):
```typescript
<Button variant="ghost" size="icon">
  <Trash2 className="h-4 w-4" />
</Button>
```

#### Badge Variants

**Allocation Indicator**:
```typescript
<Badge variant="outline">Asignación</Badge>
```

**With Custom Styling**:
```typescript
<Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
  Asignación
</Badge>
```

### Theming Chart Colors

**Chart Configuration** (using shadcn chart utilities):
```typescript
const chartConfig = {
  allocation: {
    label: "Asignaciones",
  },
  budget1: {
    label: "Comida",
    color: "hsl(var(--chart-1))",
  },
  budget2: {
    label: "Renta",
    color: "hsl(var(--chart-2))",
  },
  budget3: {
    label: "Transporte",
    color: "hsl(var(--chart-3))",
  },
  budget4: {
    label: "Entretenimiento",
    color: "hsl(var(--chart-4))",
  },
  budget5: {
    label: "Otros",
    color: "hsl(var(--chart-5))",
  },
  unallocated: {
    label: "Sin asignar",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;
```

**Color Palette** (from Tailwind CSS vars):
```typescript
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];
```

## 4. Accessibility Considerations

### Chart Accessibility

**ARIA Labels**:
```typescript
<ChartContainer
  config={chartConfig}
  className="min-h-[300px]"
  aria-label="Gráfica de distribución de asignaciones de presupuesto"
>
  <PieChart
    aria-describedby="chart-description"
  >
    {/* Chart content */}
  </PieChart>
</ChartContainer>
<p id="chart-description" className="sr-only">
  Gráfica de torta mostrando la distribución de asignaciones entre presupuestos
</p>
```

**Keyboard Navigation**:
- Chart segments should be focusable (recharts handles this)
- Legend items should be accessible via keyboard

### Form Accessibility

**Label Association**:
```typescript
<Label htmlFor="amount">Monto *</Label>
<Input id="amount" aria-describedby="amount-helper amount-error" />
<p id="amount-helper" className="text-xs text-muted-foreground">...</p>
{error && <p id="amount-error" className="text-xs text-destructive">{error}</p>}
```

**Error Announcements**:
```typescript
{errors.amount && (
  <p role="alert" className="text-xs text-destructive">
    {errors.amount}
  </p>
)}
```

### Dialog Accessibility

AlertDialog (shadcn) automatically handles:
- Focus trapping
- ESC key to close
- Focus return to trigger
- ARIA roles (`role="alertdialog"`)

## 5. Responsive Behavior

### Chart Responsiveness

**Mobile**:
```typescript
<ChartContainer className="h-[250px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        outerRadius={80} // Smaller on mobile
        label={false} // Hide labels on small screens
      />
    </PieChart>
  </ResponsiveContainer>
</ChartContainer>
```

**Desktop**:
```typescript
<ChartContainer className="h-[400px] w-full md:h-[350px]">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        outerRadius={120} // Larger on desktop
        label // Show labels
      />
    </PieChart>
  </ResponsiveContainer>
</ChartContainer>
```

### Form Responsiveness

**Mobile**: Full-width inputs
```typescript
<Input className="w-full" />
```

**Desktop**: Max-width for better UX
```typescript
<div className="max-w-md">
  <Input className="w-full" />
</div>
```

## 6. Integration with React Hook Form (Optional)

If using React Hook Form for form validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allocationSchema } from "@/lib/validations/allocation-schema";

const form = useForm({
  resolver: zodResolver(allocationSchema),
  defaultValues: {
    amount: 0,
    category_id: "",
    description: "",
  },
});

// In component:
<form onSubmit={form.handleSubmit(onSubmit)}>
  <div className="space-y-2">
    <Label htmlFor="amount">Monto *</Label>
    <Input
      id="amount"
      type="number"
      {...form.register("amount", { valueAsNumber: true })}
    />
    {form.formState.errors.amount && (
      <p className="text-xs text-destructive">
        {form.formState.errors.amount.message}
      </p>
    )}
  </div>

  {/* Other fields... */}

  <Button type="submit" disabled={form.formState.isSubmitting}>
    {form.formState.isSubmitting ? "Asignando..." : "Asignar"}
  </Button>
</form>
```

## 7. Toast Notifications

### Setup (if not already configured)

```typescript
// In layout or provider
import { Toaster } from "@/components/ui/toast";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
```

### Usage in Components

```typescript
import { toast } from "@/components/ui/use-toast";

// Success
toast({
  title: "✅ Asignación creada",
  description: "Tu asignación se ha creado exitosamente",
});

// Error
toast({
  variant: "destructive",
  title: "❌ Error",
  description: "No se pudo crear la asignación. Por favor intenta de nuevo.",
});
```

**Or using Sonner (recommended for simplicity)**:

```typescript
import { toast } from "sonner";

// Success
toast.success("Asignación creada exitosamente");

// Error
toast.error("Error al crear asignación");
```

## 8. Files to Create

### Component Files

- `src/domains/budget/components/organisms/allocation-distribution-chart.tsx`
  - Uses: `Card`, `ChartContainer`, recharts `PieChart`
  - Displays pie chart with allocation distribution

- `src/domains/budget/components/molecules/allocation-form.tsx`
  - Uses: `Input`, `Label`, `Select`, `Button`
  - Inline form for creating allocations

- `src/domains/budget/components/atoms/allocation-badge.tsx`
  - Uses: `Badge`
  - Visual indicator for allocation type

- `src/domains/budget/components/molecules/delete-allocation-dialog.tsx`
  - Uses: `AlertDialog` and sub-components
  - Confirmation before deletion

### Utility Files (if needed)

- `src/lib/chart-utils.ts`
  - Chart color utilities
  - Data transformation helpers

## 9. Installation Checklist

Before implementing, ensure these components are installed:

```bash
# Check if components exist
ls src/components/ui/card.tsx
ls src/components/ui/button.tsx
ls src/components/ui/input.tsx
ls src/components/ui/label.tsx
ls src/components/ui/select.tsx
ls src/components/ui/badge.tsx
ls src/components/ui/alert-dialog.tsx
ls src/components/ui/chart.tsx
ls src/components/ui/toast.tsx # or sonner

# Install missing components
pnpm dlx shadcn@latest add chart
pnpm dlx shadcn@latest add alert-dialog
pnpm dlx shadcn@latest add badge
# ... etc for any missing components
```

## 10. Recharts Configuration

### Install Recharts (if not included with chart component)

```bash
pnpm add recharts
```

### Types (if using TypeScript)

```bash
pnpm add -D @types/recharts
```

### Basic Pie Chart Example

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Comida", value: 400 },
  { name: "Renta", value: 300 },
  { name: "Transporte", value: 200 },
  { name: "Sin asignar", value: 100 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--muted))",
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      outerRadius={100}
      fill="#8884d8"
      dataKey="value"
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

## 11. Coordination with Other Agents

- **UX Designer**: Components selected align with UX plan
  - Inline form approach: Matches UX decision
  - Pie chart: recharts as recommended
  - Toast notifications: For feedback
  - Badge: For visual distinction

- **Next.js Builder**: Component integration points
  - Home page: AllocationDistributionChart component
  - Budget detail: AllocationForm component
  - Transaction list: AllocationBadge component

- **Domain Architect**: Data types
  - Chart expects `AllocationDistribution` type
  - Form expects `AllocationFormValues` type
  - Uses hooks: `useAllocationDistribution`, `useCreateAllocation`

## 12. Implementation Priority

### Phase 1: Core Components (MVP)

1. ✅ Install `chart` component (recharts)
2. ✅ Install `alert-dialog` for deletion confirmation
3. ✅ Install `badge` for allocation indicator
4. ✅ Verify `card`, `button`, `input`, `label`, `select` exist

### Phase 2: Build Components

1. Create `AllocationDistributionChart` using recharts PieChart
2. Create `AllocationForm` with Input, Label, Select, Button
3. Create `AllocationBadge` with Badge
4. Create `DeleteAllocationDialog` with AlertDialog

### Phase 3: Polish

1. Add toast notifications (Sonner)
2. Refine chart tooltips and legends
3. Add skeleton loaders for chart loading state
4. Responsive optimizations

## 13. Notes

- **shadcn chart component**: Wraps recharts with shadcn theming
- **Don't modify shadcn sources**: Always compose, never edit `@/components/ui/` files
- **Use pnpm**: Project uses pnpm for package management
- **Tailwind classes**: Can extend shadcn components with additional Tailwind classes via `className` prop
- **Dark mode**: shadcn components automatically support dark mode via CSS variables

---

**Next Steps**:
1. Parent verifies existing components in `src/components/ui/`
2. Parent installs missing components via `pnpm dlx shadcn@latest add`
3. Next.js builder plans page integration
4. Parent implements custom components using shadcn building blocks
