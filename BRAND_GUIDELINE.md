# Brand Guideline - Mis Finanzas

## Filosofía de Diseño

Mis Finanzas es una aplicación **minimalista, clara y funcional** que prioriza la simplicidad sobre la complejidad. El diseño debe ser:

- **Limpio**: Sin elementos decorativos innecesarios
- **Directo**: Información clara y accesible
- **Profesional**: Confiable para gestionar finanzas personales
- **Accesible**: Funcional en cualquier dispositivo

---

## Paleta de Colores

### Colores Primarios

```css
/* Primary - Indigo (Finanzas, Confianza) */
--primary: 263 70% 50%;          /* #4F46E5 */
--primary-foreground: 0 0% 100%; /* #FFFFFF */

/* Background */
--background: 0 0% 100%;         /* #FFFFFF */
--foreground: 222 47% 11%;       /* #0F172A */
```

### Colores Secundarios

```css
/* Secondary - Stone (Neutral, Equilibrio) */
--secondary: 30 3% 88%;          /* #E7E5E4 */
--secondary-foreground: 222 47% 11%; /* #0F172A */

/* Muted (Texto secundario, backgrounds sutiles) */
--muted: 30 3% 96%;              /* #F5F5F4 */
--muted-foreground: 222 13% 46%; /* #64748B */
```

### Colores Funcionales

```css
/* Success - Verde (Ingresos, Acciones positivas) */
--success: 142 76% 36%;          /* #16A34A */
--success-light: 142 76% 96%;    /* Light green bg */

/* Destructive - Rojo (Gastos, Eliminaciones) */
--destructive: 0 84% 60%;        /* #EF4444 */
--destructive-light: 0 84% 96%;  /* Light red bg */

/* Warning - Amarillo (Alertas, Atención) */
--warning: 38 92% 50%;           /* #F59E0B */
--warning-light: 38 92% 95%;     /* Light yellow bg */

/* Info - Azul (Información, Tooltips) */
--info: 217 91% 60%;             /* #3B82F6 */
--info-light: 217 91% 95%;       /* Light blue bg */
```

### Uso de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Ingresos | Green | Badges, montos positivos, íconos |
| Gastos | Red | Badges, montos negativos, íconos |
| Primary Actions | Indigo | Botones principales, enlaces |
| Backgrounds | Stone/Muted | Cards, containers |
| Text | Foreground/Muted | Títulos y texto secundario |

---

## Tipografía

### Fuentes

```css
/* Sans-serif - Geist (UI General) */
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;

/* Monospace - Geist Mono (Números, Códigos) */
--font-mono: 'Geist Mono', 'Courier New', monospace;
```

### Escala Tipográfica

| Elemento | Size | Weight | Line Height | Uso |
|----------|------|--------|-------------|-----|
| h1 | 2.25rem (36px) | 700 (Bold) | 2.5rem | Títulos de página |
| h2 | 1.875rem (30px) | 600 (Semibold) | 2.25rem | Secciones principales |
| h3 | 1.5rem (24px) | 600 (Semibold) | 2rem | Subsecciones |
| h4 | 1.25rem (20px) | 600 (Semibold) | 1.75rem | Cards, módulos |
| Body | 1rem (16px) | 400 (Regular) | 1.5rem | Texto general |
| Small | 0.875rem (14px) | 400 (Regular) | 1.25rem | Etiquetas, hints |
| Tiny | 0.75rem (12px) | 500 (Medium) | 1rem | Badges, timestamps |

### Uso de Monospace

- **Cantidades monetarias**: `$1,234.56`
- **Números de referencia**: `#ABC123`
- **Fechas**: `2024-01-15`

---

## Espaciado

### Sistema de Espaciado (8px base)

| Token | Value | Uso |
|-------|-------|-----|
| `space-1` | 0.25rem (4px) | Espacios mínimos, separación inline |
| `space-2` | 0.5rem (8px) | Padding interno pequeño |
| `space-3` | 0.75rem (12px) | Espaciado interno de botones |
| `space-4` | 1rem (16px) | **Base** - Padding estándar |
| `space-6` | 1.5rem (24px) | Separación entre elementos |
| `space-8` | 2rem (32px) | Separación entre secciones |
| `space-12` | 3rem (48px) | Márgenes de página grandes |
| `space-16` | 4rem (64px) | Separación de bloques mayores |

### Márgenes Responsivos

```css
/* Mobile */
.container {
  padding: 1rem;  /* 16px */
}

/* Tablet (md: 768px) */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;  /* 24px */
  }
}

/* Desktop (lg: 1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;  /* 32px */
  }
}
```

---

## Componentes UI

### Botones

#### Primarios
- **Uso**: Acciones principales (Guardar, Crear, Continuar)
- **Estilo**: `bg-primary text-primary-foreground`
- **Tamaño**: `h-10 px-4` (40px height)

#### Secundarios
- **Uso**: Acciones secundarias (Cancelar, Volver)
- **Estilo**: `bg-secondary text-secondary-foreground`
- **Tamaño**: `h-10 px-4`

#### Ghost
- **Uso**: Acciones terciarias, íconos de acción
- **Estilo**: `hover:bg-accent hover:text-accent-foreground`

#### Destructivos
- **Uso**: Eliminar, acciones peligrosas
- **Estilo**: `bg-destructive text-destructive-foreground`

### Cards

```css
.card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.5rem;  /* 8px */
  padding: 1.5rem;        /* 24px */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

### Tables

- **Header**: Background `muted`, font-weight `600`
- **Rows**: Border bottom `1px solid border`
- **Hover**: Background `muted/50`
- **Padding**: `12px 16px` (vertical, horizontal)

### Forms

```css
/* Input fields */
.input {
  height: 2.5rem;        /* 40px */
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;  /* 6px */
  font-size: 0.875rem;
}

/* Focus state */
.input:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## Layout Responsive

### Breakpoints

```css
/* Mobile-first approach */
sm: 640px   /* Móvil landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop muy grande */
```

### Grid System

```css
/* 12-column grid */
.grid {
  display: grid;
  gap: 1rem;
}

/* Mobile: 1 column */
.grid-cols-1

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .md:grid-cols-2
}

/* Desktop: 3-4 columns */
@media (min-width: 1024px) {
  .lg:grid-cols-4
}
```

### Container

```css
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

---

## Mobile Navigation

### Desktop (≥768px)
- Header horizontal fijo en la parte superior
- Links en fila con íconos y texto

### Mobile (<768px)
- Header mínimo superior (solo logo)
- **Bottom Navigation Bar**:
  - Fijo en la parte inferior
  - 4 items principales
  - Solo íconos (sin texto)
  - Background blur
  - Shadow superior

```css
/* Mobile nav */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;  /* 64px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
```

---

## Iconografía

### Biblioteca: Lucide React

### Tamaños Estándar

| Contexto | Size | Uso |
|----------|------|-----|
| Tiny | 12px | Inline con texto pequeño |
| Small | 16px | Botones, badges |
| **Base** | 20px | Navegación, acciones |
| Large | 24px | Headers, empty states |
| XL | 32px | Iconos destacados |
| 2XL | 48px | Empty states, onboarding |

### Íconos por Categoría

| Categoría | Icono | Uso |
|-----------|-------|-----|
| Dashboard | `LayoutDashboard` | Vista principal |
| Presupuesto | `Wallet` | Gestión de presupuestos |
| Movimientos | `Receipt` | Transacciones |
| Reportes | `BarChart3` | Análisis y gráficas |
| Ingresos | `TrendingUp` | Dinero entrante |
| Gastos | `TrendingDown` | Dinero saliente |
| Categorías | `FolderKanban` | Organización |
| Crear | `Plus` | Añadir nuevo |
| Editar | `Pencil` | Modificar |
| Eliminar | `Trash2` | Borrar |
| Calendario | `Calendar` | Fechas y períodos |

---

## Animaciones y Transiciones

### Principios

- **Sutiles**: No distraer de la funcionalidad
- **Rápidas**: 150-300ms máximo
- **Consistentes**: Misma curva de aceleración

### Transiciones Estándar

```css
/* Hover/Focus states */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Modales/Dialogs */
transition: opacity 200ms ease-in-out,
            transform 200ms ease-in-out;

/* Loading states */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

---

## Accesibilidad

### Contraste

- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos UI**: Mínimo 3:1

### Focus States

- **Outline**: 2px solid primary
- **Offset**: 2px
- **Visible** en todos los elementos interactivos

### Touch Targets (Mobile)

- **Mínimo**: 44x44px
- **Recomendado**: 48x48px
- **Espaciado**: 8px entre targets

---

## Estados de Datos

### Empty States

```
┌─────────────────────────────────┐
│                                 │
│         [Large Icon]            │
│                                 │
│       Título Descriptivo        │
│    Texto explicativo breve      │
│                                 │
│      [Botón de Acción]          │
│                                 │
└─────────────────────────────────┘
```

### Loading States

- **Skeleton screens** para contenido
- **Spinner** para acciones (botones)
- **Progress bars** para procesos largos

### Error States

- **Inline errors**: Debajo del campo
- **Toast notifications**: Esquina superior derecha
- **Alert banners**: Parte superior de la sección

---

## Formato de Datos

### Números y Monedas

```javascript
// Cantidades
$1,234.56

// Grandes cantidades
$1.2M (millones)
$1.2K (miles)

// Porcentajes
45%
45.5%
```

### Fechas

```javascript
// Corta
15 Ene 2024

// Completa
15 de enero de 2024

// Relativa
Hace 2 horas
Ayer
```

---

## Reglas de Oro

1. **Mobile First**: Diseñar primero para móvil
2. **Espaciado Consistente**: Usar sistema de 8px
3. **Contraste Suficiente**: Legibilidad ante todo
4. **Componentes Reutilizables**: No repetir código
5. **Feedback Visual**: Toda acción debe tener respuesta
6. **Loading States**: Nunca dejar al usuario esperando sin feedback
7. **Error Handling**: Mensajes claros y accionables
8. **Touch-Friendly**: Botones grandes en móvil
9. **Progressive Enhancement**: Funcional sin JavaScript
10. **Accesibilidad**: WCAG 2.1 AA mínimo

---

## Referencias

- **Design System**: shadcn/ui
- **Icons**: Lucide React
- **Colors**: Tailwind CSS v4
- **Typography**: Geist Font Family
- **Accessibility**: WCAG 2.1

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
