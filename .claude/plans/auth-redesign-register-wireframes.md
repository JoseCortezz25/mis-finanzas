# 📝 Registro - Wireframes & Detalles Específicos
## "Empieza tu Viaje Financiero"

---

## 🎨 Diferenciación Login vs Registro

### Login (Bienvenida de vuelta)
- Tono: Familiar, cálido, rápido
- Colores dominantes: Verde musgo (acción)
- Mensaje: "Bienvenido de nuevo"
- Visual: Formas orgánicas, suaves

### Registro (Nuevo comienzo)
- Tono: Inspirador, motivante, guía
- Colores dominantes: Arcilla (optimismo) + Verde (crecimiento)
- Mensaje: "Empieza tu viaje financiero"
- Visual: Formas ascendentes, crecimiento

---

## 📐 Wireframes Detallados - Registro

### Desktop (1440px+)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│   │                       │  │                                      │  │
│   │  ATMOSPHERIC          │  │   [Logo Icon + Name]                 │  │
│   │  GRADIENT             │  │   "Mis Finanzas"                     │  │
│   │  (Warmer tones)       │  │                                      │  │
│   │                       │  │   Empieza tu viaje                   │  │
│   │  [Ilustración         │  │   ──────────────────                 │  │
│   │   conceptual:         │  │                                      │  │
│   │   Planta creciendo    │  │   Crea tu cuenta gratuita            │  │
│   │   o gráfico           │  │   y toma control de tus              │  │
│   │   ascendente]         │  │   finanzas hoy                       │  │
│   │                       │  │                                      │  │
│   │                       │  │   ┌──────────────────────────────┐   │  │
│   │  "Cada gran viaje     │  │   │ Correo electrónico           │   │  │
│   │   comienza con        │  │   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁    │   │  │
│   │   un solo paso."      │  │   └──────────────────────────────┘   │  │
│   │                       │  │                                      │  │
│   │                       │  │   ┌──────────────────────────────┐   │  │
│   │  [Pattern sutil]      │  │   │ Contraseña               [👁]│   │  │
│   │                       │  │   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁    │   │  │
│   │                       │  │   │ [████░░░░░░] Débil          │   │  │
│   │                       │  │   └──────────────────────────────┘   │  │
│   │  [Elementos           │  │                                      │  │
│   │   decorativos         │  │   ┌──────────────────────────────┐   │  │
│   │   flotantes]          │  │   │ Confirmar contraseña     [👁]│   │  │
│   │                       │  │   │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁    │   │  │
│   │                       │  │   └──────────────────────────────┘   │  │
│   │                       │  │                                      │  │
│   │                       │  │   ┌──────────────────────────────┐   │  │
│   │                       │  │   │   Crear mi cuenta    →       │   │  │
│   │                       │  │   └──────────────────────────────┘   │  │
│   │                       │  │                                      │  │
│   │                       │  │   Al registrarte, aceptas nuestros   │  │
│   │                       │  │   Términos y Política de Privacidad  │  │
│   │                       │  │                                      │  │
│   │                       │  │   ¿Ya tienes cuenta?                 │  │
│   │                       │  │   Inicia sesión                      │  │
│   │                       │  │                                      │  │
│   └───────────────────────┘  └──────────────────────────────────────┘  │
│         50% width                      50% width                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌────────────────────────┐
│                        │
│  [Mini decoración top] │
│                        │
│  ┌──────────────────┐  │
│  │   [Logo Icon]    │  │
│  └──────────────────┘  │
│                        │
│  Empieza tu            │
│  viaje                 │
│  ──────                │
│                        │
│  Crea tu cuenta        │
│  gratuita              │
│                        │
│  ┌──────────────────┐  │
│  │ Email            │  │
│  │ ▁▁▁▁▁▁▁▁▁▁▁▁▁    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ Contraseña   [👁]│  │
│  │ ▁▁▁▁▁▁▁▁▁▁▁▁▁    │  │
│  │ [████░] Débil    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ Confirmar    [👁]│  │
│  │ ▁▁▁▁▁▁▁▁▁▁▁▁▁    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ Crear cuenta  → │  │
│  └──────────────────┘  │
│                        │
│  Al registrarte,       │
│  aceptas Términos      │
│                        │
│  ¿Ya tienes cuenta?    │
│  Inicia sesión         │
│                        │
│  [Decoración bottom]   │
│                        │
└────────────────────────┘
```

---

## 🎨 Background Atmosférico - Registro

### Concepto Visual: "Crecimiento"

**Elementos visuales**:
1. **Gradiente base**: Más cálido que login
   ```css
   background: linear-gradient(135deg,
     #FFF5E6 0%,   /* Crema cálido */
     #FFE8CC 50%,  /* Durazno suave */
     #FFE0B2 100%  /* Naranja muy pálido */
   );
   ```

2. **Ilustración conceptual**:
   - Opción A: Planta creciendo (minimalista, line art)
   - Opción B: Gráfico de barras ascendente (abstracto)
   - Opción C: Camino con hitos (journey metaphor)

3. **Formas abstractas**:
   - Círculos que se expanden (crecimiento)
   - Líneas ascendentes diagonales
   - Partículas flotando hacia arriba

4. **Frase inspiradora**:
   ```
   "Cada gran viaje
    comienza con
    un solo paso."
   ```
   O alternativas:
   - "Tu futuro financiero empieza aquí"
   - "Control. Claridad. Confianza."
   - "Construye el hábito del éxito"

---

## 🎯 Componentes Únicos del Registro

### 1. Password Strength Indicator

Visual en tiempo real mientras escribes:

```
┌─────────────────────────────┐
│ Contraseña              [👁]│
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │
│                             │
│ Fortaleza: [████░░░░░░]     │
│            Débil            │
└─────────────────────────────┘

Estados:
- Muy débil: [██░░░░░░░░] Rojo (#FF7675)
- Débil:     [████░░░░░░] Naranja (#FDCB6E)
- Aceptable: [██████░░░░] Amarillo (#FFC312)
- Fuerte:    [████████░░] Verde claro (#55EFC4)
- Muy fuerte:[██████████] Verde (#00B894)
```

**Criterios visuales** (checkmarks que aparecen):
```
Requisitos:
✓ Al menos 8 caracteres
✓ Una letra mayúscula
✓ Un número
✓ Un carácter especial
```

### 2. Password Match Indicator

Para "Confirmar contraseña":

```
Cuando coinciden:
┌─────────────────────────────┐
│ Confirmar contraseña    [✓] │  ← Checkmark verde
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │
└─────────────────────────────┘

Cuando NO coinciden:
┌─────────────────────────────┐
│ Confirmar contraseña    [✗] │  ← X roja
│ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │
│ ⚠️ Las contraseñas no        │
│    coinciden                │
└─────────────────────────────┘
```

### 3. Terms & Privacy Link

```
Al registrarte, aceptas nuestros
[Términos de Servicio] y [Política de Privacidad]
      ↑ Enlaces subrayados, color moss
```

**Microinteracción**: Al hacer hover, underline se anima de izquierda a derecha

---

## ✨ Animaciones Específicas del Registro

### 1. Entrada Inicial (Page Load)
```
0ms:   Background fade-in
100ms: Logo drop-in con bounce suave
200ms: Título "Empieza tu viaje" slide-up
300ms: Subtítulo fade-in
400ms: Input Email slide-in desde derecha
500ms: Input Password slide-in desde derecha
600ms: Input Confirm slide-in desde derecha
700ms: Button fade-in con scale
800ms: Footer links fade-in
```

### 2. Al escribir Password
```
- Cada carácter: Barra de fortaleza anima hacia la derecha
- Criterio cumplido: Checkmark aparece con scale bounce
- Color transition suave en la barra
```

### 3. Al hacer match de passwords
```
- Checkmark verde aparece con:
  - Scale: 0 → 1.2 → 1
  - Rotation: -20deg → 0deg
  - Duration: 400ms
```

### 4. Submit Exitoso
```
1. Form elementos fade-out hacia arriba (stagger)
2. Checkmark gigante aparece en centro (scale + rotate)
3. Mensaje "¡Cuenta creada!" fade-in
4. Submensaje "Revisa tu email" fade-in
5. Progress bar (redirección en 3... 2... 1...)
6. Page transition hacia login
```

### 5. Submit con Error
```
1. Form shake (vibración de 5px horizontal)
2. Input con error:
   - Border pulsa rojo 2 veces
   - Background flash rojo suave
3. Error message slide-down desde arriba del input
4. Focus automático en el input con error
```

---

## 🎭 Estados del Formulario

### Estado 1: Inicial (Limpio)
```
- Todos los inputs vacíos
- Button enabled pero sin hover
- Sin mensajes visibles
- Background visible
```

### Estado 2: Escribiendo Email
```
- Label "Email" flotando arriba
- Border verde activa
- Validación en tiempo real:
  - Email válido → checkmark sutil
  - Email inválido → sin indicador (solo al blur)
```

### Estado 3: Escribiendo Password
```
- Barra de fortaleza animándose
- Checkmarks apareciendo según criterios
- Color cambiando según fortaleza
- Ícono de ojo para toggle visibility
```

### Estado 4: Escribiendo Confirm
```
- Match checking en tiempo real
- Checkmark o X según coincidencia
- Mensaje de error/success debajo
```

### Estado 5: Formulario Completo Válido
```
- Todos los inputs con checkmarks verdes
- Button con hover state activo
- Barra de password en verde
- Usuario listo para submit
```

### Estado 6: Loading (Enviando)
```
- Button muestra spinner
- Texto cambia: "Creando tu cuenta..."
- Inputs disabled (opacity 60%)
- Cursor: wait
```

### Estado 7: Success
```
- Form desaparece con animación
- Checkmark gigante en centro
- Mensaje de confirmación
- Timer visual de redirección
```

### Estado 8: Error
```
- Form shake
- Inputs con error highlighted
- Mensaje de error slide-down
- Button vuelve a estado normal
- Focus en primer input con error
```

---

## 📱 Responsive - Cambios Específicos

### Mobile (< 768px)

**Cambios del Desktop**:
1. **Background atmosférico**: Se reduce a un header decorativo de 100px
2. **Ilustración**: Se convierte en un ícono pequeño
3. **Frase inspiradora**: Se oculta o se mueve al footer
4. **Password strength**: Barra más compacta
5. **Spacing**: Reducido entre elementos
6. **Font sizes**:
   - Título: 2xl → xl
   - Body: base → sm
   - Button: base → sm

### Tablet (768px - 1024px)

**Cambios**:
1. **Layout**: Single column, pero espacioso
2. **Background**: Se mantiene como header grande (300px)
3. **Form**: Centrado con max-width 500px
4. **Ilustración**: Versión simplificada visible
5. **Spacing**: Moderado

---

## 🎨 Paleta de Colores - Ajustes para Registro

```css
/* Registro tiene tonos más cálidos */
--zen-clay-light: #FFE8CC;    /* Background suave */
--zen-clay: #FDCB6E;          /* Accents */
--zen-clay-dark: #E17055;     /* Hover states */

/* Password strength colors */
--strength-very-weak: #FF7675;
--strength-weak: #FDCB6E;
--strength-fair: #FFC312;
--strength-good: #55EFC4;
--strength-strong: #00B894;

/* Gradientes específicos */
--gradient-register-bg: linear-gradient(135deg,
  #FFF5E6 0%,
  #FFE8CC 50%,
  #FFE0B2 100%
);

--gradient-register-button: linear-gradient(135deg,
  #00B894 0%,
  #00D2A0 50%,
  #55EFC4 100%
);
```

---

## 🎯 Mockup Conceptual - Estados Clave

### Estado Normal - Desktop
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  [Gradient cálido]       ┌─────────────────────┐      │
│  [Planta creciendo]      │ Mis Finanzas        │      │
│                          │                     │      │
│  "Cada gran viaje        │ Empieza tu viaje    │      │
│   comienza con           │ ────────────────    │      │
│   un solo paso."         │                     │      │
│                          │ Crea tu cuenta      │      │
│  [Formas abstractas]     │                     │      │
│                          │ Email               │      │
│                          │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁     │      │
│                          │                     │      │
│  [Partículas]            │ Contraseña      👁  │      │
│                          │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁     │      │
│                          │ [████░░░░░░] Débil  │      │
│                          │                     │      │
│                          │ Confirmar       👁  │      │
│                          │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁     │      │
│                          │                     │      │
│                          │ [Crear cuenta →]    │      │
│                          │                     │      │
│                          │ Al registrarte...   │      │
│                          │                     │      │
│                          └─────────────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Estado - Password Strength Visible
```
Contraseña                                    👁
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

Fortaleza: [████████░░] Fuerte ✓

Requisitos:
✓ Al menos 8 caracteres
✓ Una letra mayúscula
✓ Un número
○ Un carácter especial
```

### Estado - Success
```
┌────────────────────────┐
│                        │
│         ┌────┐         │
│         │ ✓  │         │  ← Checkmark grande
│         └────┘         │     animado (bounce)
│                        │
│   ¡Cuenta creada!      │
│                        │
│   Revisa tu correo     │
│   para confirmar       │
│                        │
│   Redirigiendo... ●○○  │  ← Dots animados
│                        │
└────────────────────────┘
```

---

## 🚀 Componentes Adicionales Necesarios

### 1. PasswordStrengthBar Component
```tsx
interface PasswordStrengthBarProps {
  password: string;
  showRequirements?: boolean;
}
```

**Features**:
- Cálculo de fortaleza en tiempo real
- Animación smooth en cambios
- Colores graduales
- Opcional: lista de requisitos

### 2. PasswordMatchIndicator Component
```tsx
interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
  showError?: boolean;
}
```

**Features**:
- Checkmark/X animado
- Mensaje de error opcional
- Solo se muestra si confirm tiene contenido

### 3. TermsText Component
```tsx
interface TermsTextProps {
  termsUrl?: string;
  privacyUrl?: string;
}
```

**Features**:
- Links con hover animation
- Texto personalizable
- Styling consistente

---

## 📊 Comparación Login vs Registro

| Aspecto | Login | Registro |
|---------|-------|----------|
| **Color dominante** | Verde musgo | Arcilla/Naranja |
| **Gradiente BG** | Frío (gris-azul) | Cálido (crema-naranja) |
| **Ilustración** | Formas orgánicas | Elementos ascendentes |
| **Frase** | "Control. Claridad..." | "Cada gran viaje..." |
| **Inputs** | 2 (Email, Password) | 3 (Email, Pass, Confirm) |
| **Features únicas** | Forgot password | Password strength |
| **CTA** | "Iniciar sesión" | "Crear mi cuenta" |
| **Tono** | Familiar, rápido | Inspirador, guía |

---

## 💡 Tips de Implementación

### 1. Validación Email
```tsx
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### 2. Password Strength Calculator
```tsx
const calculateStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return {
    score: strength,
    label: ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'][strength]
  };
};
```

### 3. Password Match Check
```tsx
const passwordsMatch = password === confirmPassword && confirmPassword !== '';
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup
- [ ] Importar fuentes (Crimson Pro + DM Sans)
- [ ] CSS variables para colores/spacing
- [ ] Background component con gradiente cálido

### Fase 2: Componentes Base
- [ ] ZenInput (ya existe del login)
- [ ] PasswordStrengthBar (nuevo)
- [ ] PasswordMatchIndicator (nuevo)
- [ ] TermsText (nuevo)

### Fase 3: Form Logic
- [ ] Estado de formulario
- [ ] Validación email
- [ ] Password strength calculation
- [ ] Password match checking
- [ ] Submit handler

### Fase 4: Animaciones
- [ ] Page load stagger
- [ ] Input focus animations
- [ ] Password strength transitions
- [ ] Success state animation
- [ ] Error shake animation

### Fase 5: Responsive
- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout
- [ ] Testing cross-device

### Fase 6: Polish
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Loading states
- [ ] Error messages
- [ ] Success feedback
- [ ] Final testing

---

**¿Listo para ver esto hecho realidad? 🚀**

La propuesta de registro complementa perfectamente el login, manteniendo coherencia visual pero con su propia personalidad inspiradora!
