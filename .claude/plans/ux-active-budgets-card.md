# Active Budgets Card - UX/UI Design Plan

**Created**: 2026-01-02
**Session**: active-budgets-dashboard-enhancement
**Complexity**: Medium
**User Impact**: High

## 1. User Context

### User Goals
- **Primary Goal**: Quickly understand the health and progress of all active budgets at a glance
- **Secondary Goals**:
  - Navigate to budget details for deeper analysis
  - Identify which budgets need attention (overspending, near limit)
  - Monitor spending patterns across multiple budgets
- **Success Criteria**: User can assess budget health in < 5 seconds and navigate to details in 1 click

### User Personas
- **Primary**: Budget-conscious user managing multiple monthly budgets (personal, family, business)
- **Context**: Checking dashboard 2-3 times per week to monitor financial health, often on mobile during commute or breaks
- **Pain Points**:
  - Current view is too simple - just name and amount, no context
  - No visual indication of budget health or progress
  - Not interactive - can't click to see details
  - Looks like a boring list, not engaging

### User Journey
1. User lands on dashboard → Scans for budget health indicators → Identifies budgets needing attention
2. User spots a budget with warning status → Clicks on budget card → Navigates to budget detail page
3. User reviews budget details → Takes corrective action (reduce spending, adjust budget) → Returns to dashboard with peace of mind

## 2. Interface Architecture

### Information Hierarchy
1. **Primary**: Budget health status (visual indicator) + Progress bar
2. **Secondary**: Budget name + Amount spent vs total
3. **Tertiary**: Date/period (month/year) + Category (if available)

### Layout Strategy
- **Structure**: Card-based grid layout, each budget is a clickable card
- **Grid**:
  - Mobile: 1 column (full width)
  - Tablet: 2 columns
  - Desktop: 3 columns (max)
- **Spacing**: Comfortable (16px between cards, 20px padding inside)
- **Breakpoints**:
  - Mobile (< 640px): Stack vertically, full-width cards
  - Tablet (640px - 1024px): 2-column grid
  - Desktop (> 1024px): 3-column grid, max-width container

### Visual Hierarchy
- **Focal Point**: Health status indicator (color-coded badge/pill) + Progress bar
- **Visual Flow**: Top-left badge → Progress bar (horizontal) → Budget name → Amount details → Date
- **Grouping**: Each budget is a distinct card with subtle elevation
- **Contrast**: Health status uses bold color, rest uses neutral slate palette

## 3. Interaction Design

### Primary Actions
- **Action**: Click entire budget card
  - **Type**: Primary interactive surface
  - **Location**: Entire card is clickable (not just a button)
  - **State**:
    - Default: Subtle border, flat background
    - Hover: Elevated shadow, border accent color, subtle scale (1.02)
    - Active: Pressed state with reduced scale (0.98)
    - Disabled: N/A (budgets are always clickable)
  - **Feedback**: On click → Navigate to `/budgets/[id]` with smooth page transition

### Secondary Actions
- **Action**: Quick Actions Menu (3-dot menu)
  - **Type**: Tertiary
  - **Location**: Top-right corner of card
  - **Actions**: Edit Budget, Close Budget, Delete Budget
  - **Note**: For MVP, this can be deferred - primary action is navigation

### Micro-interactions
- **Hover Effects**:
  - Card: `shadow-md` elevation, border changes to health status color, transform scale(1.02)
  - Transition: `transition-all duration-200 ease-in-out`
- **Focus States**:
  - Keyboard focus: `ring-2 ring-primary ring-offset-2`
  - Focus indicator matches health status color
- **Loading States**:
  - Skeleton cards with pulsing animation
  - Progress bar skeleton with shimmer effect
- **Transitions**:
  - Page navigation: `fadeIn` animation (150ms)
  - Card hover: `transform + shadow` (200ms ease-in-out)
- **Success/Error**:
  - If budget data fails to load, show empty state with retry button
  - Toast notification on navigation error

### User Input
- **Input Type**: Click/Touch interaction (no form inputs in this component)
- **Validation**: N/A
- **Error Messages**: N/A (handled by parent component)
- **Placeholder/Helper**: Empty state when no active budgets exist

## 4. Component Selection

### shadcn/ui Components Needed
- **Card**: Base card container (`<Card>`, `<CardHeader>`, `<CardContent>`)
- **Badge**: Health status indicator (custom variant for each status)
- **Progress**: Progress bar component for budget consumption
- **Skeleton**: Loading state placeholder

**Note**: Work with shadcn-builder agent to ensure Progress and Badge components are available and styled

### Custom Components Needed
- **BudgetHealthBadge**: Custom badge with health-specific colors and icons
  - **Why**: Need specific color mapping and icon logic for health statuses
- **BudgetProgressBar**: Enhanced progress bar with color-coded segments
  - **Why**: Need dynamic coloring based on health status, percentage labels

## 5. Content Strategy

### Text Requirements
**Text Map**: `src/domains/dashboard/dashboard.text-map.ts` (new file)

**Keys to Define**:
- **Headings**:
  - `ACTIVE_BUDGETS.TITLE`: "Presupuestos Activos"
  - `ACTIVE_BUDGETS.SUBTITLE`: "Monitorea el progreso de tus presupuestos"
- **Body**:
  - `ACTIVE_BUDGETS.SPENT_LABEL`: "Gastado"
  - `ACTIVE_BUDGETS.OF_LABEL`: "de"
  - `ACTIVE_BUDGETS.REMAINING_LABEL`: "Disponible"
  - `ACTIVE_BUDGETS.PROGRESS_LABEL`: "Progreso"
- **Actions**:
  - `ACTIVE_BUDGETS.VIEW_DETAILS`: "Ver detalles"
  - `ACTIVE_BUDGETS.VIEW_ALL`: "Ver todos los presupuestos"
- **Feedback**:
  - `ACTIVE_BUDGETS.HEALTH.HEALTHY`: "Saludable"
  - `ACTIVE_BUDGETS.HEALTH.WARNING`: "Precaución"
  - `ACTIVE_BUDGETS.HEALTH.ALERT`: "Alerta"
  - `ACTIVE_BUDGETS.HEALTH.DANGER`: "Excedido"
- **Placeholders**: N/A
- **Help Text**:
  - `ACTIVE_BUDGETS.TOOLTIP.PROGRESS`: "Porcentaje de presupuesto consumido"
  - `ACTIVE_BUDGETS.TOOLTIP.HEALTH`: "Estado de salud del presupuesto"

**Tone**: Friendly but professional, encouraging but realistic
**Voice**: 2nd person ("Tu presupuesto"), active voice

### Microcopy
- **Empty States**:
  - Title: "No hay presupuestos activos"
  - Description: "Crea tu primer presupuesto para comenzar a monitorear tus finanzas"
  - CTA: "Crear presupuesto"
- **Error States**:
  - Title: "Error al cargar presupuestos"
  - Description: "No pudimos cargar tus presupuestos. Por favor, intenta de nuevo."
  - CTA: "Reintentar"
- **Success States**: N/A (component displays data)
- **Loading States**: "Cargando presupuestos..." (accessible via screen reader)

## 6. Accessibility Design

### Semantic Structure
- **Landmarks**:
  - Section with `<section aria-labelledby="active-budgets-title">`
  - Each budget card as `<article>` or clickable `<Card>` with proper ARIA
- **Headings**:
  - h2: "Presupuestos Activos" (section title)
  - h3: Budget name (card title)
- **Lists**: Grid of cards as implicit list (CSS Grid)

### Keyboard Navigation
- **Tab Order**: Section title → Each budget card (left-to-right, top-to-bottom) → "View all" link
- **Shortcuts**: N/A (standard tab navigation)
- **Focus Management**: Focus remains on clicked card during navigation (browser default)
- **Escape Hatch**: User can tab through all cards or skip to next section

### Screen Reader Experience
- **ARIA Labels**:
  - Budget card: `aria-label="Presupuesto {name}, {spent} de {total} gastado, estado {health}"`
  - Progress bar: `aria-label="Progreso: {percentage}% del presupuesto consumido"`
  - Health badge: `aria-label="Estado: {health status}"`
- **ARIA Descriptions**:
  - Card: `aria-describedby` pointing to period (month/year) text
- **Live Regions**:
  - If data updates dynamically: `aria-live="polite"` on card container
- **Hidden Content**:
  - Decorative icons: `aria-hidden="true"`
  - Visual-only spacers: `aria-hidden="true"`

### Visual Accessibility
- **Color Contrast**:
  - Health badge text on background: Minimum 4.5:1 (AAA)
  - Progress bar segments: Minimum 3:1 against background
  - Card text on card background: 7:1 (AAA for body text)
- **Color Independence**:
  - Health status uses icon + color + text label (not just color)
  - Progress bar shows percentage number in addition to visual bar
- **Text Size**:
  - Budget name: 18px (1.125rem) - medium
  - Amount: 24px (1.5rem) - large, bold
  - Helper text: 14px (0.875rem) - small, muted
- **Touch Targets**:
  - Entire card: Minimum 56x56px (exceeds 44x44px requirement)
  - Interactive elements: Minimum 44x44px padding
- **Motion**:
  - Respect `prefers-reduced-motion` for hover/scale animations
  - Fallback: Only opacity/color changes, no transform

## 7. Responsive Design

### Mobile (< 640px)
- **Layout**: Single column, full-width cards stacked vertically
- **Navigation**: N/A (no hamburger, this is dashboard content)
- **Actions**: Full-width card, tap anywhere to navigate
- **Content**:
  - Budget name: 16px (smaller)
  - Amount: 20px (slightly smaller)
  - Progress bar: Full width, 12px height
  - Health badge: Top-left, smaller (12px text)

### Tablet (640px - 1024px)
- **Layout**: 2-column grid, equal width columns
- **Navigation**: N/A
- **Actions**: Card hover effects enabled (if touch device supports hover)
- **Content**:
  - Budget name: 18px
  - Amount: 24px
  - Progress bar: Full width, 14px height
  - Health badge: 14px text

### Desktop (> 1024px)
- **Layout**: 3-column grid (max), centered container
- **Navigation**: N/A
- **Actions**: Full hover effects (shadow, scale, border)
- **Additional**:
  - More spacing between cards (20px gap)
  - Subtle hover cursor change (pointer)

## 8. States & Feedback

### Loading States
- **Initial Load**:
  - Skeleton cards (3 cards shown on desktop, 2 on tablet, 1 on mobile)
  - Skeleton components: Card outline, Badge placeholder, Progress bar shimmer
- **Action Feedback**: N/A (navigation is handled by Next.js)
- **Optimistic Updates**: N/A (read-only component)

### Error States
- **Validation Errors**: N/A (no validation)
- **System Errors**:
  - Alert component inside card container: "Error al cargar presupuestos"
  - Retry button: "Reintentar"
  - Icon: AlertCircle (lucide-react)
- **Recovery**: User clicks "Reintentar" → Component re-fetches data

### Empty States
- **No Data**:
  - Empty state card (centered, single column)
  - Icon: PiggyBank or Wallet (lucide-react)
  - Title: "No hay presupuestos activos"
  - Description: "Crea tu primer presupuesto para comenzar a monitorear tus finanzas"
  - CTA: "Crear presupuesto" → Navigate to budget creation
- **No Results**: N/A (this component doesn't filter)
- **First Use**: Same as "No Data" (onboarding state)

### Success States
- **Confirmation**: N/A (this component displays existing data)
- **Next Steps**: User clicks card → Navigate to budget detail page

## 9. User Flow Diagram

```
[Dashboard Page Load]
    ↓
[Fetch Active Budgets] → [Loading State: Skeleton Cards]
    ↓
[Data Received] → [Render Budget Cards]
    ↓
[User Scans Cards] → [Identifies Budget with Warning Status]
    ↓
[User Hovers Card] → [Card Elevates, Border Highlights]
    ↓
[User Clicks Card] → [Navigate to /budgets/[id]]
    ↓
[Budget Detail Page Loads]


[Alternative: No Data]
[Fetch Active Budgets] → [Empty Array]
    ↓
[Empty State Displayed] → [User Clicks "Crear presupuesto"]
    ↓
[Navigate to Budget Creation]


[Alternative: Error]
[Fetch Active Budgets] → [Error Thrown]
    ↓
[Error State Displayed] → [User Clicks "Reintentar"]
    ↓
[Re-fetch Data] → [Data Received]
```

## 10. Design Specifications

### Color Palette (Flat, Solid Colors)

**Health Status Colors**:
- **Healthy** (0-69%):
  - Background: `bg-emerald-50` (light emerald)
  - Border: `border-emerald-500` (emerald)
  - Text: `text-emerald-700` (dark emerald)
  - Progress: `bg-emerald-500` (solid emerald)
  - Icon: CheckCircle2 (lucide-react)

- **Warning** (70-89%):
  - Background: `bg-amber-50` (light amber)
  - Border: `border-amber-500` (amber)
  - Text: `text-amber-700` (dark amber)
  - Progress: `bg-amber-500` (solid amber)
  - Icon: AlertTriangle (lucide-react)

- **Alert** (90-99%):
  - Background: `bg-orange-50` (light orange)
  - Border: `border-orange-500` (orange)
  - Text: `text-orange-700` (dark orange)
  - Progress: `bg-orange-500` (solid orange)
  - Icon: AlertCircle (lucide-react)

- **Danger** (100%+):
  - Background: `bg-red-50` (light red)
  - Border: `border-red-500` (red)
  - Text: `text-red-700` (dark red)
  - Progress: `bg-red-500` (solid red)
  - Icon: XCircle (lucide-react)

**Neutral Colors** (from existing palette):
- Card background: `bg-card` (white/dark mode aware)
- Card border: `border-border` (slate-200/slate-800)
- Text primary: `text-foreground` (slate-900/slate-50)
- Text secondary: `text-muted-foreground` (slate-500/slate-400)
- Hover shadow: `shadow-md` (subtle elevation)

### Spacing Scale
- **Tight**:
  - Between badge and progress bar: 8px (`space-y-2`)
  - Between progress bar and budget name: 12px (`space-y-3`)
- **Normal**:
  - Card padding: 16px (`p-4`)
  - Between cards in grid: 16px (`gap-4`)
- **Relaxed**:
  - Between section title and cards: 20px (`mt-5`)
  - Between amount details and period: 8px (`mt-2`)

### Typography
- **Headings**:
  - Section title (h2): `text-2xl font-bold` (32px)
  - Budget name (h3): `text-lg font-semibold` (18px)
- **Body**:
  - Amount spent/total: `text-2xl font-bold` (24px)
  - Helper text (period, labels): `text-sm text-muted-foreground` (14px)
- **Labels**:
  - Health badge: `text-xs font-medium` (12px)
  - Progress percentage: `text-sm font-medium` (14px)

### Card Structure (Wireframe)

```
┌─────────────────────────────────────────┐
│  [Health Badge]            [3-dot menu] │  ← Top section (deferred)
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  75%        │  ← Progress bar + %
│                                         │
│  Presupuesto de Enero                   │  ← Budget name (h3)
│                                         │
│  $7,500 de $10,000                      │  ← Amount (spent of total)
│  Disponible: $2,500                     │  ← Available amount
│                                         │
│  Enero 2026                             │  ← Period (muted text)
│                                         │
└─────────────────────────────────────────┘
   ↑ Entire card is clickable
```

**Desktop Layout** (3 columns):
```
┌───────────┐  ┌───────────┐  ┌───────────┐
│  Budget 1 │  │  Budget 2 │  │  Budget 3 │
│  Healthy  │  │  Warning  │  │  Healthy  │
└───────────┘  └───────────┘  └───────────┘

┌───────────┐  ┌───────────┐
│  Budget 4 │  │  Budget 5 │
│  Alert    │  │  Danger   │
└───────────┘  └───────────┘
```

**Mobile Layout** (1 column):
```
┌──────────────────┐
│  Budget 1        │
│  Healthy         │
└──────────────────┘

┌──────────────────┐
│  Budget 2        │
│  Warning         │
└──────────────────┘

┌──────────────────┐
│  Budget 3        │
│  Alert           │
└──────────────────┘
```

## 11. Performance Considerations

- **Critical Path**: Budget data fetch is critical → Use Suspense boundary with skeleton fallback
- **Lazy Loading**: N/A (cards are above fold, always visible)
- **Image Optimization**: N/A (no images, only icons from lucide-react)
- **Animation Budget**:
  - Limit animations to hover/focus states only
  - Use `will-change` sparingly (only on hover)
  - CSS transitions preferred over JS animations
  - Total animation time: < 200ms per interaction

## 12. Implementation Coordination

### Agent Collaboration
- **shadcn-builder**:
  - Confirm `Progress` component exists (or add from shadcn registry)
  - Confirm `Badge` component exists with custom variant support
  - Confirm `Skeleton` component exists
  - Provide component API details (props, variants)
- **domain-architect**:
  - Confirm Budget data structure and available fields
  - Confirm Transaction data is accessible for calculations
  - Confirm `useBudgetCalculations` hook exists and is working
- **Parent**:
  - Create text map file: `src/domains/dashboard/dashboard.text-map.ts`
  - Implement `BudgetHealthBadge` custom component
  - Implement `BudgetProgressBar` custom component
  - Implement `ActiveBudgetsSection` main component
  - Update dashboard page to use new component
  - Test responsive behavior and accessibility

### Files Impacted
- **Components** (new):
  - `src/domains/dashboard/components/active-budgets-section.tsx` (main component)
  - `src/domains/dashboard/components/budget-card.tsx` (individual card)
  - `src/domains/dashboard/components/budget-health-badge.tsx` (custom badge)
  - `src/domains/dashboard/components/budget-progress-bar.tsx` (custom progress)
- **Text Maps** (new):
  - `src/domains/dashboard/dashboard.text-map.ts`
- **Styles** (if needed):
  - Potentially `src/styles/components/organisms/budget-card.css` for complex hover effects (if Tailwind is not enough)
- **Pages** (update):
  - `src/app/(app)/dashboard/page.tsx` - Replace current budget list with new component

## 13. Important Notes

⚠️ **Accessibility is mandatory**:
- Must support keyboard navigation (tab, enter)
- Must have proper ARIA labels for screen readers
- Must respect `prefers-reduced-motion`
- Must have sufficient color contrast (WCAG AA minimum)

💡 **Mobile-first**:
- Design for 375px width first (iPhone SE)
- Test on real devices (iOS Safari, Android Chrome)
- Touch targets must be 44x44px minimum

💡 **Content before chrome**:
- Budget name and amount are most important
- Health status is secondary context
- Period/date is tertiary
- Avoid decorative elements that distract from core info

📝 **Iterate**:
- MVP: Clickable cards with health status, progress bar, basic info
- V2: Quick actions menu (edit, close, delete)
- V3: Inline sparkline chart showing spending trend

🎨 **Consistency**:
- Use existing slate palette for neutrals
- Match existing card style from dashboard stats
- Reuse lucide-react icons (no custom SVGs yet)
- Follow existing text-muted-foreground pattern

⚠️ **Performance**:
- Budget calculations hook already exists (`useBudgetCalculations`)
- Don't recalculate on every render - use memoization
- Skeleton state is critical for perceived performance

🔍 **User Testing**:
- Highly recommended for this feature (high user impact)
- Test with 3-5 users managing multiple budgets
- Validate color blindness accessibility (use Color Oracle)
- Test keyboard-only navigation flow

## 14. Success Metrics

- **Usability**:
  - Time to identify budget health status: < 3 seconds
  - Time to navigate to budget detail: < 2 seconds (1 click)
  - Task success rate: 95%+ (users can identify and click budget)

- **Efficiency**:
  - Budget health scan time: < 5 seconds for 5 budgets
  - Navigation interaction: 1 click (no intermediate steps)

- **Satisfaction**:
  - User feedback: "I can see my budget health at a glance" (qualitative)
  - Repeat usage: Users return to dashboard 3+ times/week

- **Accessibility**:
  - Screen reader navigation: 100% of budget info accessible
  - Keyboard-only navigation: 100% functional (no mouse required)
  - Color contrast: All text passes WCAG AA (4.5:1 minimum)

- **Performance**:
  - Time to interactive (TTI): < 2 seconds on 3G
  - Skeleton display time: < 500ms (perceived performance)
  - Hover interaction latency: < 100ms (feels instant)

---

## Design Philosophy

This design prioritizes **clarity and actionability** over aesthetic flourish. The flat color palette and clear visual hierarchy ensure users can make quick financial decisions without cognitive overload. Health status indicators use both color and iconography to accommodate color-blind users, and the entire card is clickable to reduce interaction friction.

The design draws inspiration from modern financial apps (Mint, YNAB) but avoids their visual complexity by using:
- **Solid colors** instead of gradients
- **Clear typography** instead of decorative fonts
- **Functional icons** instead of illustrations
- **White space** instead of dense information

This approach aligns with the project's "Screaming Architecture" philosophy: the UI clearly communicates its purpose (budget monitoring) without unnecessary decoration.

**Key differentiators from generic design**:
1. **Health-first approach**: Status indicator is the visual anchor, not the amount
2. **Progress bar prominence**: Larger, color-coded, with percentage label
3. **Click-anywhere pattern**: Entire card is interactive (less precise targeting)
4. **Flat color system**: Avoids the "AI gradient trap" with solid, accessible colors
5. **Micro-copy focus**: "Disponible" instead of "Remaining" - more conversational

This design is **opinionated** about what matters most: helping users stay within budget, not just displaying numbers.
