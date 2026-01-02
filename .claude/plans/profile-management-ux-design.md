# User Profile Management - UX/UI Design Plan

**Created**: 2026-01-01
**Session**: user_profile_management
**Complexity**: Medium
**User Impact**: High - Security-sensitive operations
**Design Priority**: Security clarity, mobile-first, progressive disclosure

---

## 1. User Context

### User Goals

**Primary Goal**: Safely update personal account information and settings

**Secondary Goals**:
- Change display name/username when needed
- Update password for security reasons
- Delete account if no longer needed
- Review account information

**Success Criteria**:
- User completes profile update without confusion
- User understands security implications before dangerous actions
- Clear confirmation of successful changes
- No accidental data loss from unclear UI

### User Personas

**Primary**: Registered app users managing their financial data

**Context**:
- Accessing profile from settings or account menu
- Periodic security maintenance (password updates)
- Rare but critical (account deletion)

**Pain Points**:
- Fear of accidentally deleting account
- Uncertainty about password requirements
- Unclear consequences of actions
- Complex security confirmations that feel alarming

### User Journey

1. **Entry** → User taps profile/settings icon → Profile overview appears
2. **Browse** → User scans available options → Finds desired action
3. **Edit Name** → Taps edit name → Inline edit appears → Confirms → Success feedback
4. **Change Password** → Taps change password → Form appears → Enters current + new → Confirms → Success feedback
5. **Delete Account** → Scrolls to danger zone → Taps delete → Warning dialog → Confirmation input → Final warning → Deletion → Redirect to goodbye page

---

## 2. Interface Architecture

### Information Hierarchy

1. **Primary**: User profile overview (name, email, avatar)
2. **Secondary**: Account actions (edit name, change password)
3. **Tertiary**: Danger zone (account deletion) - visually separated

### Layout Strategy

**Structure**: Full page with card-based sections

**Grid**: Single column mobile, centered max-width container desktop

**Spacing**: Comfortable (not cramped, security requires breathing room)

**Breakpoints**:
- **Mobile (< 640px)**: Full-width cards, stacked sections, bottom sheet modals
- **Tablet (640px - 1024px)**: Centered 640px max-width, card-based, centered dialogs
- **Desktop (> 1024px)**: Centered 720px max-width, card-based, centered dialogs

### Visual Hierarchy

**Focal Point**: User avatar and name at top
**Visual Flow**: Top (profile) → Middle (actions) → Bottom (danger zone)
**Grouping**: Related actions in cards with subtle borders
**Contrast**: Danger zone uses red accent, separated by space and visual weight

---

## 3. Mobile Wireframes (Primary Focus)

### Mobile: Profile Overview Page

```
┌─────────────────────────────────────┐
│  ← Configuración                    │  Header (sticky)
├─────────────────────────────────────┤
│                                     │
│  ┌────────────────────────────────┐│
│  │         Profile Card           ││
│  │                                ││
│  │       ┌──────────┐             ││
│  │       │          │             ││  Avatar (80px circle)
│  │       │   [AJ]   │             ││
│  │       │          │             ││
│  │       └──────────┘             ││
│  │                                ││
│  │    Alejandro José Cortez       ││  Display name (large)
│  │    ajosecortes@email.com       ││  Email (small, muted)
│  │    Miembro desde Dic 2025      ││  Join date (extra small)
│  │                                ││
│  └────────────────────────────────┘│
│                                     │
│  ┌────────────────────────────────┐│
│  │    Información de Cuenta       ││  Card title
│  ├────────────────────────────────┤│
│  │                                ││
│  │  👤 Nombre de usuario       > ││  Tap to edit
│  │  Alejandro José                ││  Current value (muted)
│  │                                ││
│  ├────────────────────────────────┤│
│  │                                ││
│  │  🔒 Contraseña              > ││  Tap to change
│  │  ••••••••                      ││  Hidden (dots)
│  │                                ││
│  └────────────────────────────────┘│
│                                     │
│                                     │  Spacer (2x normal)
│                                     │
│  ┌────────────────────────────────┐│
│  │       ⚠️  Zona Peligrosa       ││  Warning card (red border)
│  ├────────────────────────────────┤│
│  │                                ││
│  │  Eliminar cuenta               ││
│  │  Esta acción es permanente y  ││  Description (small)
│  │  eliminará todos tus datos.    ││
│  │                                ││
│  │  ┌──────────────────────────┐ ││
│  │  │   Eliminar mi cuenta     │ ││  Danger button (outline)
│  │  └──────────────────────────┘ ││
│  │                                ││
│  └────────────────────────────────┘│
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Mobile: Edit Display Name (Bottom Sheet)

```
┌─────────────────────────────────────┐
│ ┌───────────────────────────────┐   │  Background overlay (dim)
│ │                               │   │
│ │  [Swipe down to dismiss]      │   │
│ │                               │   │
│ ╞═══════════════════════════════╡   │  Bottom sheet
│ │                               │   │
│ │  Editar nombre de usuario     │   │  Title
│ │                               │   │
│ │  ┌─────────────────────────┐ │   │
│ │  │ Nombre                  │ │   │  Label
│ │  │ ┌─────────────────────┐ │ │   │
│ │  │ │ Alejandro José   ✓  │ │ │   │  Input with validation
│ │  │ └─────────────────────┘ │ │   │
│ │  └─────────────────────────┘ │   │
│ │                               │   │
│ │  Tu nombre será visible en    │   │  Helper text
│ │  reportes y documentos.       │   │
│ │                               │   │
│ │  ┌──────────────────────────┐│   │
│ │  │   Guardar cambios        ││   │  Primary button
│ │  └──────────────────────────┘│   │
│ │                               │   │
│ │  ┌──────────────────────────┐│   │
│ │  │      Cancelar            ││   │  Ghost button
│ │  └──────────────────────────┘│   │
│ │                               │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Mobile: Change Password (Bottom Sheet)

```
┌─────────────────────────────────────┐
│ ┌───────────────────────────────┐   │  Background overlay
│ │  [Swipe to dismiss]           │   │
│ ╞═══════════════════════════════╡   │
│ │                               │   │
│ │  Cambiar contraseña           │   │  Title
│ │                               │   │
│ │  ┌─────────────────────────┐ │   │
│ │  │ Contraseña actual       │ │   │  Label
│ │  │ ┌─────────────────────┐ │ │   │
│ │  │ │ •••••••••••    👁   │ │ │   │  Password input + toggle
│ │  │ └─────────────────────┘ │ │   │
│ │  └─────────────────────────┘ │   │
│ │                               │   │
│ │  ┌─────────────────────────┐ │   │
│ │  │ Nueva contraseña        │ │   │
│ │  │ ┌─────────────────────┐ │ │   │
│ │  │ │ •••••••••••    👁   │ │ │   │
│ │  │ └─────────────────────┘ │ │   │
│ │  │ [▓▓▓░░░░░] Débil        │ │   │  Strength indicator
│ │  └─────────────────────────┘ │   │
│ │                               │   │
│ │  ┌─────────────────────────┐ │   │
│ │  │ Confirmar contraseña    │ │   │
│ │  │ ┌─────────────────────┐ │ │   │
│ │  │ │ •••••••••••    👁   │ │ │   │
│ │  │ └─────────────────────┘ │ │   │
│ │  │ ✓ Las contraseñas       │ │   │  Validation feedback
│ │  │   coinciden             │ │   │
│ │  └─────────────────────────┘ │   │
│ │                               │   │
│ │  ℹ️ La contraseña debe tener  │   │  Requirements
│ │  al menos 8 caracteres.       │   │
│ │                               │   │
│ │  ┌──────────────────────────┐│   │
│ │  │  Cambiar contraseña      ││   │  Primary button (disabled)
│ │  └──────────────────────────┘│   │
│ │                               │   │
│ │  ┌──────────────────────────┐│   │
│ │  │      Cancelar            ││   │  Ghost button
│ │  └──────────────────────────┘│   │
│ │                               │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Mobile: Delete Account Warning (Dialog)

```
┌─────────────────────────────────────┐
│                                     │  Background overlay (dark)
│                                     │
│  ┌─────────────────────────────┐   │
│  │          ⚠️                  │   │  Large warning icon
│  │                             │   │
│  │  ¿Eliminar tu cuenta?       │   │  Clear, direct question
│  │                             │   │
│  │  Esta acción es permanente  │   │  Plain language
│  │  y eliminará:               │   │
│  │                             │   │
│  │  • Todos tus presupuestos   │   │  Bulleted consequences
│  │  • Historial de movimientos │   │
│  │  • Reportes y análisis      │   │
│  │  • Configuración de cuenta  │   │
│  │                             │   │
│  │  Esta acción no se puede    │   │  Emphasis on permanence
│  │  deshacer.                  │   │
│  │                             │   │
│  │  ┌───────────────────────┐ │   │
│  │  │ Escribe ELIMINAR para │ │   │  Confirmation input
│  │  │ continuar:            │ │   │
│  │  │ ┌───────────────────┐ │ │   │
│  │  │ │                   │ │ │   │  Text input (empty)
│  │  │ └───────────────────┘ │ │   │
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  │  ┌─────────────────────────┐   │
│  │  │  Sí, eliminar cuenta    │   │  Danger button (disabled)
│  │  └─────────────────────────┘   │
│  │                             │   │
│  │  ┌─────────────────────────┐   │
│  │  │    Cancelar             │   │  Primary button (safer)
│  │  └─────────────────────────┘   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Mobile: Final Deletion Confirmation (Dialog)

```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐   │
│  │          🛑                  │   │  Stop sign (critical)
│  │                             │   │
│  │  Última confirmación        │   │  Clear header
│  │                             │   │
│  │  Estás a punto de eliminar  │   │
│  │  permanentemente tu cuenta: │   │
│  │                             │   │
│  │  📧 ajosecortes@email.com   │   │  User's email (confirm)
│  │                             │   │
│  │  ¿Estás completamente       │   │
│  │  seguro de continuar?       │   │
│  │                             │   │
│  │  ┌─────────────────────────┐   │
│  │  │  Eliminar cuenta        │   │  Danger button
│  │  └─────────────────────────┘   │
│  │                             │   │
│  │  ┌─────────────────────────┐   │
│  │  │    No, mantener cuenta  │   │  Safe option (primary)
│  │  └─────────────────────────┘   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Mobile: Success States

```
┌─────────────────────────────────────┐  Display Name Updated
│                                     │
│  ┌─────────────────────────────┐   │
│  │           ✅                 │   │  Success checkmark
│  │                             │   │
│  │  Nombre actualizado         │   │  Clear success message
│  │                             │   │
│  │  Tu nombre se ha cambiado   │   │
│  │  exitosamente.              │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
     Auto-dismiss after 3s + haptic


┌─────────────────────────────────────┐  Password Updated
│                                     │
│  ┌─────────────────────────────┐   │
│  │           🔒                 │   │  Lock icon
│  │                             │   │
│  │  Contraseña actualizada     │   │
│  │                             │   │
│  │  Tu contraseña se ha        │   │
│  │  cambiado exitosamente.     │   │
│  │                             │   │
│  │  Por seguridad, hemos       │   │  Additional security info
│  │  cerrado otras sesiones.    │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Desktop Wireframes

### Desktop: Profile Overview Page

```
┌───────────────────────────────────────────────────────────────────────┐
│  ← Volver a Dashboard                                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         Configuración de Perfil                         │  Page header
│                                                                         │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────┐        │
│    │                   Profile Card                          │        │
│    │                                                          │        │
│    │   ┌────────┐                                            │        │
│    │   │        │    Alejandro José Cortez                   │        │
│    │   │  [AJ]  │    ajosecortes@email.com                   │        │
│    │   │        │    Miembro desde Dic 2025                  │        │
│    │   └────────┘                                            │        │
│    │                                                          │        │
│    └─────────────────────────────────────────────────────────┘        │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────┐        │
│    │           Información de Cuenta                         │        │
│    ├─────────────────────────────────────────────────────────┤        │
│    │                                                          │        │
│    │  Nombre de usuario                             [Editar] │        │  Inline edit
│    │  Alejandro José                                         │        │
│    │  ───────────────────────────────────────────────────   │        │
│    │                                                          │        │
│    │  Contraseña                                    [Cambiar]│        │  Opens modal
│    │  ••••••••••••                                           │        │
│    │  Última actualización: 15 Nov 2025                      │        │
│    │  ───────────────────────────────────────────────────   │        │
│    │                                                          │        │
│    └─────────────────────────────────────────────────────────┘        │
│                                                                         │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────┐        │
│    │  ⚠️  Zona Peligrosa                                     │        │  Red accent
│    ├─────────────────────────────────────────────────────────┤        │
│    │                                                          │        │
│    │  Eliminar cuenta permanentemente                        │        │
│    │                                                          │        │
│    │  Esta acción eliminará todos tus datos y no se puede    │        │
│    │  deshacer. Procede con precaución.                      │        │
│    │                                                          │        │
│    │                            ┌──────────────────────────┐ │        │
│    │                            │  Eliminar mi cuenta      │ │        │  Danger button
│    │                            └──────────────────────────┘ │        │
│    │                                                          │        │
│    └─────────────────────────────────────────────────────────┘        │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

### Desktop: Change Password Modal

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│         ┌───────────────────────────────────────────┐                 │
│         │  Cambiar contraseña                   ✕  │                 │  Modal header
│         ├───────────────────────────────────────────┤                 │
│         │                                           │                 │
│         │  Contraseña actual                        │                 │
│         │  ┌─────────────────────────────────────┐ │                 │
│         │  │ ••••••••••••••              👁      │ │                 │
│         │  └─────────────────────────────────────┘ │                 │
│         │                                           │                 │
│         │  Nueva contraseña                         │                 │
│         │  ┌─────────────────────────────────────┐ │                 │
│         │  │ ••••••••••••••              👁      │ │                 │
│         │  └─────────────────────────────────────┘ │                 │
│         │  [▓▓▓▓▓▓░░░] Media                       │                 │  Strength bar
│         │                                           │                 │
│         │  Confirmar contraseña                     │                 │
│         │  ┌─────────────────────────────────────┐ │                 │
│         │  │ ••••••••••••••              👁      │ │                 │
│         │  └─────────────────────────────────────┘ │                 │
│         │  ✓ Las contraseñas coinciden              │                 │
│         │                                           │                 │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │                 │
│         │                                           │                 │
│         │  Requisitos de contraseña:                │                 │  Inline help
│         │  ✓ Mínimo 8 caracteres                    │                 │
│         │  ✓ Al menos una mayúscula                 │                 │
│         │  ✓ Al menos un número                     │                 │
│         │  ⚠ Al menos un carácter especial          │                 │
│         │                                           │                 │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │                 │
│         │                                           │                 │
│         │                ┌──────────┐ ┌──────────┐ │                 │
│         │                │ Cancelar │ │ Guardar  │ │                 │
│         │                └──────────┘ └──────────┘ │                 │
│         │                                           │                 │
│         └───────────────────────────────────────────┘                 │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

### Desktop: Delete Account Confirmation

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│         ┌───────────────────────────────────────────┐                 │
│         │       ⚠️  ¿Eliminar tu cuenta?        ✕  │                 │
│         ├───────────────────────────────────────────┤                 │
│         │                                           │                 │
│         │  Esta acción es permanente y eliminará:   │                 │
│         │                                           │                 │
│         │  • Todos tus presupuestos                 │                 │
│         │  • Historial de movimientos               │                 │
│         │  • Reportes y análisis                    │                 │
│         │  • Configuración de cuenta                │                 │
│         │                                           │                 │
│         │  Esta acción no se puede deshacer.        │                 │
│         │                                           │                 │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │                 │
│         │                                           │                 │
│         │  Escribe ELIMINAR para confirmar:         │                 │
│         │  ┌─────────────────────────────────────┐ │                 │
│         │  │                                     │ │                 │
│         │  └─────────────────────────────────────┘ │                 │
│         │                                           │                 │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │                 │
│         │                                           │                 │
│         │          ┌──────────┐ ┌──────────────┐   │                 │
│         │          │ Cancelar │ │ Eliminar     │   │                 │
│         │          └──────────┘ └──────────────┘   │                 │
│         │           (Primary)    (Danger-disabled) │                 │
│         │                                           │                 │
│         └───────────────────────────────────────────┘                 │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 5. Interaction Design

### Primary Actions

**Action**: Editar nombre de usuario
- **Type**: Secondary
- **Location**: Inline on desktop, bottom sheet on mobile
- **State**: Default → Hover (desktop) → Active (editing) → Success
- **Feedback**: Inline validation, success toast

**Action**: Cambiar contraseña
- **Type**: Secondary
- **Location**: Modal on desktop, bottom sheet on mobile
- **State**: Default → Hover → Modal open → Submitting → Success
- **Feedback**: Password strength indicator, validation messages, success toast

**Action**: Eliminar cuenta
- **Type**: Tertiary (danger)
- **Location**: Separated danger zone, bottom of page
- **State**: Default → Warning dialog → Confirmation input → Final confirmation → Processing → Redirect
- **Feedback**: Multi-step confirmation, explicit consequences, final chance to cancel

### Secondary Actions

**Action**: Cancelar (in modals/sheets)
- **Type**: Ghost/Tertiary
- **Location**: Left side of action buttons (mobile: stacked below primary)

**Action**: Ver detalles de cuenta
- **Type**: Link
- **Location**: Could be added to profile card for additional info

### Micro-interactions

**Hover Effects**:
- Edit buttons: Subtle background color shift, icon rotation 15deg
- Danger button: Red glow (subtle, not alarming)
- Input fields: Border color shift to primary

**Focus States**:
- 2px outline with brand color
- Clear skip links for keyboard users
- Tab order: Top to bottom, safe to dangerous

**Loading States**:
- Button spinners during async operations
- Skeleton for profile data on initial load
- Progress indicator for account deletion (rare)

**Transitions**:
- Bottom sheets: Slide up 300ms ease-out
- Modals: Fade in 200ms + scale from 0.95 to 1
- Success toasts: Slide down from top 250ms

**Success/Error**:
- Success: Green checkmark icon, haptic feedback (mobile), 3s auto-dismiss
- Error: Red alert icon, persistent until dismissed, clear recovery action

### User Input

**Display Name Input**:
- Type: Text
- Validation: Real-time (min 2 chars, max 50 chars)
- Error Messages: "El nombre debe tener al menos 2 caracteres"
- Placeholder: Current name pre-filled

**Current Password Input**:
- Type: Password (toggleable visibility)
- Validation: On blur
- Error Messages: "Contraseña incorrecta"
- Helper: "Ingresa tu contraseña actual para verificar tu identidad"

**New Password Input**:
- Type: Password (toggleable visibility)
- Validation: Real-time strength meter
- Error Messages: "La contraseña debe tener al menos 8 caracteres"
- Helper: Password requirements checklist

**Confirm Password Input**:
- Type: Password (toggleable visibility)
- Validation: Real-time match check
- Error Messages: "Las contraseñas no coinciden"
- Helper: Visual checkmark when matches

**Delete Confirmation Input**:
- Type: Text
- Validation: Real-time (must exactly match "ELIMINAR")
- Error Messages: Danger button disabled until correct
- Placeholder: "Escribe ELIMINAR"

---

## 6. Component Selection

### shadcn/ui Components Needed

**Card**: Profile overview, account actions, danger zone containers
**Dialog**: Desktop modals for password change, delete confirmation
**Sheet**: Mobile bottom sheets for edit name, change password
**Input**: All text inputs with label and error states
**Button**: Primary, secondary, danger variants
**Label**: Form field labels
**Separator**: Visual separation between sections
**Alert**: Warning messages in danger zone, error states
**Toast/Sonner**: Success and error notifications
**Progress**: Password strength indicator
**Badge**: Account status indicators (if needed)

**Coordination with shadcn-builder**:
- Password strength component may need custom implementation
- Bottom sheet behavior for mobile (or use Sheet from shadcn)
- Confirmation dialog variant with danger styling

### Custom Components Needed

**PasswordStrengthBar**: Real-time password strength visualization
- Why custom: Specific business logic for strength calculation
- Visual: Segmented progress bar with color coding (red → yellow → green)

**DangerZoneCard**: Visually distinct warning container
- Why custom: Specific styling for dangerous actions
- Visual: Red accent border, warning icon, muted background

**ConfirmationInput**: Text input that enables action when match
- Why custom: Specific validation logic for deletion confirmation
- Visual: Standard input with real-time match validation

---

## 7. Content Strategy

### Text Requirements

**Text Map**: `src/domains/user/profile.text-map.ts`

**Keys to Define**:

**Headings**:
- `PAGE.TITLE`: "Configuración de Perfil"
- `PROFILE.HEADER`: "Tu Perfil"
- `ACCOUNT.HEADER`: "Información de Cuenta"
- `DANGER_ZONE.HEADER`: "Zona Peligrosa"

**Body**:
- `PROFILE.MEMBER_SINCE`: "Miembro desde"
- `ACCOUNT.LAST_PASSWORD_UPDATE`: "Última actualización"
- `DANGER_ZONE.DELETE_DESCRIPTION`: "Esta acción eliminará todos tus datos y no se puede deshacer. Procede con precaución."

**Actions**:
- `ACTIONS.EDIT_NAME`: "Editar"
- `ACTIONS.CHANGE_PASSWORD`: "Cambiar"
- `ACTIONS.DELETE_ACCOUNT`: "Eliminar mi cuenta"
- `ACTIONS.SAVE_CHANGES`: "Guardar cambios"
- `ACTIONS.CANCEL`: "Cancelar"
- `ACTIONS.CONFIRM_DELETE`: "Sí, eliminar cuenta"
- `ACTIONS.KEEP_ACCOUNT`: "No, mantener cuenta"

**Feedback - Success**:
- `SUCCESS.NAME_UPDATED`: "Nombre actualizado"
- `SUCCESS.NAME_UPDATED_DESC`: "Tu nombre se ha cambiado exitosamente."
- `SUCCESS.PASSWORD_UPDATED`: "Contraseña actualizada"
- `SUCCESS.PASSWORD_UPDATED_DESC`: "Tu contraseña se ha cambiado exitosamente. Por seguridad, hemos cerrado otras sesiones."

**Feedback - Error**:
- `ERROR.NAME_UPDATE_FAILED`: "Error al actualizar el nombre"
- `ERROR.PASSWORD_INCORRECT`: "Contraseña incorrecta"
- `ERROR.PASSWORD_UPDATE_FAILED`: "Error al cambiar la contraseña"
- `ERROR.ACCOUNT_DELETE_FAILED`: "Error al eliminar la cuenta"
- `ERROR.NETWORK`: "Error de conexión. Intenta de nuevo."

**Feedback - Warnings**:
- `WARNING.DELETE_TITLE`: "¿Eliminar tu cuenta?"
- `WARNING.DELETE_DESCRIPTION`: "Esta acción es permanente y eliminará:"
- `WARNING.DELETE_CONSEQUENCES`: ["Todos tus presupuestos", "Historial de movimientos", "Reportes y análisis", "Configuración de cuenta"]
- `WARNING.DELETE_IRREVERSIBLE`: "Esta acción no se puede deshacer."
- `WARNING.FINAL_CONFIRMATION`: "Última confirmación"
- `WARNING.FINAL_DESCRIPTION`: "Estás a punto de eliminar permanentemente tu cuenta:"

**Placeholders**:
- `PLACEHOLDERS.NAME`: Current user name (pre-filled)
- `PLACEHOLDERS.CURRENT_PASSWORD`: "Contraseña actual"
- `PLACEHOLDERS.NEW_PASSWORD`: "Nueva contraseña"
- `PLACEHOLDERS.CONFIRM_PASSWORD`: "Confirmar contraseña"
- `PLACEHOLDERS.DELETE_CONFIRMATION`: "Escribe ELIMINAR"

**Help Text**:
- `HELP.NAME`: "Tu nombre será visible en reportes y documentos."
- `HELP.CURRENT_PASSWORD`: "Ingresa tu contraseña actual para verificar tu identidad"
- `HELP.PASSWORD_REQUIREMENTS`: "La contraseña debe tener al menos 8 caracteres."
- `HELP.DELETE_CONFIRMATION`: "Escribe ELIMINAR para continuar:"

**Tooltips**:
- `TOOLTIPS.EDIT_NAME`: "Cambiar tu nombre de usuario"
- `TOOLTIPS.CHANGE_PASSWORD`: "Actualizar tu contraseña"
- `TOOLTIPS.DELETE_ACCOUNT`: "Eliminar permanentemente tu cuenta"

**Validation**:
- `VALIDATION.NAME_TOO_SHORT`: "El nombre debe tener al menos 2 caracteres"
- `VALIDATION.NAME_TOO_LONG`: "El nombre no puede tener más de 50 caracteres"
- `VALIDATION.PASSWORD_MIN_LENGTH`: "La contraseña debe tener al menos 8 caracteres"
- `VALIDATION.PASSWORD_MISMATCH`: "Las contraseñas no coinciden"
- `VALIDATION.PASSWORD_MATCH`: "Las contraseñas coinciden"
- `VALIDATION.DELETE_MISMATCH`: "Debes escribir ELIMINAR para continuar"

**Password Strength**:
- `PASSWORD_STRENGTH.WEAK`: "Débil"
- `PASSWORD_STRENGTH.MEDIUM`: "Media"
- `PASSWORD_STRENGTH.STRONG`: "Fuerte"

**Password Requirements**:
- `PASSWORD_REQUIREMENTS.MIN_LENGTH`: "Mínimo 8 caracteres"
- `PASSWORD_REQUIREMENTS.UPPERCASE`: "Al menos una mayúscula"
- `PASSWORD_REQUIREMENTS.NUMBER`: "Al menos un número"
- `PASSWORD_REQUIREMENTS.SPECIAL`: "Al menos un carácter especial"

**Tone**: Professional, empathetic for warnings, clear and direct

**Voice**: 2nd person (tú), active voice

### Microcopy

**Empty States**: Not applicable (always has user data)

**Error States**:
- Empathetic: "No pudimos actualizar tu nombre. Intenta de nuevo en unos momentos."
- Solution-oriented: "Verifica tu conexión e intenta nuevamente"

**Success States**:
- Congratulatory: "¡Listo! Tu nombre ha sido actualizado."
- Next-steps: "Los cambios se reflejarán en toda la aplicación."

**Loading States**:
- Informative: "Actualizando tu información..."
- Patient: "Eliminando cuenta... Esto puede tomar unos momentos."

---

## 8. Accessibility Design

### Semantic Structure

**Landmarks**:
- `<header>`: Page header with back navigation
- `<main>`: Main content area with profile sections
- `<section>`: Each card (profile, account, danger zone)
- `<form>`: Password change form, edit name form
- `<dialog>`: Modal/bottom sheet containers with role="dialog"

**Headings**:
- h1: "Configuración de Perfil" (page title)
- h2: "Tu Perfil", "Información de Cuenta", "Zona Peligrosa"
- h3: Dialog titles ("Cambiar contraseña", "¿Eliminar tu cuenta?")

**Lists**:
- `<ul>`: Delete consequences list
- `<dl>`: Profile information (name, email, join date)

### Keyboard Navigation

**Tab Order**:
1. Back navigation
2. Edit name button
3. Change password button
4. Delete account button (in danger zone)
5. Within modals: inputs → cancel → confirm

**Shortcuts**:
- Escape: Close modal/bottom sheet
- Enter: Submit form when valid

**Focus Management**:
- On modal open: Focus first input
- On modal close: Return focus to trigger button
- On delete: Focus cancel button (safer default)

**Escape Hatch**:
- Escape key closes all modals
- Cancel button always visible and accessible
- Clicking overlay closes modal (with confirmation if form dirty)

### Screen Reader Experience

**ARIA Labels**:
- Edit name button: "Editar nombre de usuario"
- Change password button: "Cambiar contraseña"
- Delete account button: "Eliminar cuenta permanentemente"
- Password visibility toggle: "Mostrar contraseña" / "Ocultar contraseña"

**ARIA Descriptions**:
- Danger zone: "Esta sección contiene acciones peligrosas que afectarán permanentemente tu cuenta"
- Delete button: "Esta acción eliminará todos tus datos de forma permanente"

**Live Regions**:
- `aria-live="polite"`: Success toasts, validation feedback
- `aria-live="assertive"`: Error messages, critical warnings
- Password strength: `aria-live="polite"` announces strength changes

**Hidden Content**:
- Password dots: `aria-label="Contraseña oculta"`
- Decorative icons: `aria-hidden="true"`
- Loading spinners: `aria-label="Cargando"`

### Visual Accessibility

**Color Contrast**:
- Text on background: 4.5:1 minimum (WCAG AA)
- Large text (headings): 3:1 minimum
- Danger button: Ensure red has sufficient contrast
- Input borders: 3:1 against background

**Color Independence**:
- Password strength: Text + color + icon
- Success/error: Icon + text, not just color
- Danger zone: Border + icon + text positioning

**Text Size**:
- Body text: 16px minimum (1rem)
- Small text (helper): 14px minimum (0.875rem)
- Input text: 16px to prevent zoom on mobile

**Touch Targets**:
- Mobile buttons: 48x48px minimum (44x44px content + 4px padding)
- Desktop buttons: 40x40px minimum
- Input fields: 44px height minimum on mobile

**Motion**:
- Respect `prefers-reduced-motion`: Remove slide/scale animations
- Fallback: Instant transitions, fade only

---

## 9. Responsive Design

### Mobile (< 640px)

**Layout**: Single column, full-width cards with 16px horizontal padding

**Navigation**: Back arrow top-left, sticky header

**Actions**:
- Edit/Change buttons: Full-width on tap
- Bottom sheets for all modals
- Stacked buttons (primary above cancel)

**Content**:
- Avatar: 80px circle, centered
- Name: Large (24px), centered
- Email: Small (14px), centered, muted
- Danger zone: Full-width at bottom with extra top margin

**Interactions**:
- Tap targets: 48px minimum
- Swipe to dismiss bottom sheets
- Native input behaviors (auto-zoom prevention)

### Tablet (640px - 1024px)

**Layout**: Centered 640px max-width container, card-based

**Navigation**: Back arrow top-left

**Actions**:
- Edit/Change buttons: Inline on right (desktop-like)
- Centered dialogs (not full-screen)
- Side-by-side buttons (cancel left, confirm right)

**Content**:
- Avatar: 96px circle, left-aligned
- Name/email: Left-aligned next to avatar
- Danger zone: Centered with max 600px width

**Interactions**:
- Mix of touch and mouse/keyboard
- Hover states enabled

### Desktop (> 1024px)

**Layout**: Centered 720px max-width container

**Navigation**: Back link with icon, top-left

**Actions**:
- Edit buttons: Inline, right-aligned
- Centered modals with backdrop blur
- Side-by-side buttons with clear spacing

**Content**:
- Avatar: 96px circle, left-aligned
- Profile info: Horizontal layout
- Danger zone: Full-width within container, bottom margin

**Additional Features**:
- Inline name editing (expand input on click)
- Hover tooltips on buttons
- Rich validation feedback inline

---

## 10. States & Feedback

### Loading States

**Initial Load**:
- Skeleton: Card outlines with shimmer
- Avatar: Circle skeleton
- Text: Line skeletons matching content

**Action Feedback**:
- Button: Spinner replaces text, button disabled
- "Guardando..." / "Actualizando..." text

**Optimistic Updates**:
- Name change: Update UI immediately, rollback on error
- Password: No optimistic update (security-sensitive)

### Error States

**Validation Errors**:
- Inline: Below input, red text, small size
- Icon: Red alert circle
- Specific: "El nombre debe tener al menos 2 caracteres"

**System Errors**:
- Toast: Red background, white text, alert icon
- Persistent: Stays until dismissed
- Actionable: "Reintentar" button if applicable

**Recovery**:
- Clear error message
- Suggest action: "Verifica tu conexión"
- Preserve user input (don't clear form)

### Empty States

Not applicable - profile always has user data

### Success States

**Confirmation**:
- Toast: Green background, white text, checkmark icon
- Auto-dismiss: 3 seconds
- Haptic: Success pattern on mobile

**Next Steps**:
- Password: "Por seguridad, hemos cerrado otras sesiones"
- Name: "Los cambios se reflejarán en toda la aplicación"

---

## 11. User Flow Diagram

```
[Profile Page]
    │
    ├── [Edit Name] → [Bottom Sheet/Inline Edit]
    │       │
    │       ├── [Type Name] → [Validate Real-time]
    │       │       │
    │       │       ├── [Valid] → [Save Button Enabled]
    │       │       │       │
    │       │       │       └── [Save] → [Success Toast] → [Update UI]
    │       │       │
    │       │       └── [Invalid] → [Show Error] → [Fix Input]
    │       │
    │       └── [Cancel] → [Close Sheet] → [Profile Page]
    │
    ├── [Change Password] → [Bottom Sheet/Modal]
    │       │
    │       ├── [Enter Current Password]
    │       │       │
    │       │       └── [Validate on Blur]
    │       │
    │       ├── [Enter New Password] → [Show Strength Meter]
    │       │       │
    │       │       └── [Validate Requirements]
    │       │
    │       ├── [Confirm Password] → [Check Match Real-time]
    │       │       │
    │       │       ├── [Match] → [Save Button Enabled]
    │       │       │       │
    │       │       │       └── [Save] → [Success Toast] → [Close Other Sessions]
    │       │       │
    │       │       └── [Mismatch] → [Show Error]
    │       │
    │       └── [Cancel] → [Close Modal] → [Profile Page]
    │
    └── [Delete Account] → [Warning Dialog]
            │
            ├── [Read Consequences]
            │       │
            │       ├── [Type "ELIMINAR"]
            │       │       │
            │       │       ├── [Matches] → [Delete Button Enabled]
            │       │       │       │
            │       │       │       └── [Click Delete] → [Final Confirmation]
            │       │       │               │
            │       │       │               ├── [Confirm] → [Processing]
            │       │       │               │       │
            │       │       │               │       └── [Success] → [Goodbye Page]
            │       │       │               │
            │       │       │               └── [Cancel] → [Close] → [Profile Page]
            │       │       │
            │       │       └── [Doesn't Match] → [Delete Button Disabled]
            │       │
            │       └── [Cancel] → [Close] → [Profile Page]
            │
            └── [Close (X)] → [Profile Page]
```

---

## 12. Design Specifications

### Spacing Scale

**Tight** (8px / 0.5rem): Between label and input, icon and text

**Normal** (16px / 1rem): Between form fields, card padding

**Relaxed** (24px / 1.5rem): Between card sections

**Extra** (32px / 2rem): Before danger zone (visual separation)

### Typography

**Headings**:
- h1 (Page title): 32px / 2rem, Bold, --font-display
- h2 (Section titles): 24px / 1.5rem, Semibold, --font-display
- h3 (Dialog titles): 20px / 1.25rem, Semibold, --font-display

**Body**:
- Regular: 16px / 1rem, line-height 1.5
- Small: 14px / 0.875rem, line-height 1.4

**Labels**:
- Form labels: 14px / 0.875rem, Medium weight

**Inputs**:
- Input text: 16px / 1rem (prevent zoom on iOS)

### Color Usage

**Primary** (--zen-moss): Change password, Save buttons

**Secondary** (--zen-stone): Edit name, neutral actions

**Accent**: Profile avatar background

**Semantic**:
- Success: Green (#10b981) - checkmarks, success toasts
- Warning: Yellow (#f59e0b) - medium password strength
- Error: Red (#ef4444) - validation errors
- Info: Blue (#3b82f6) - helper text, tooltips
- Danger: Red (#dc2626) - delete button, danger zone border

### Color Contrast Verification

- Text on white: #1a1a1a (>12:1)
- Helper text: #6b7280 (4.5:1)
- Danger button text on red: White (#ffffff on #dc2626 = 4.5:1)
- Disabled button: #9ca3af on #f3f4f6 (3:1)

---

## 13. Performance Considerations

**Critical Path**:
1. Load profile data (avatar, name, email, join date)
2. Render profile card
3. Lazy load modals/bottom sheets (only when triggered)

**Lazy Loading**:
- Password strength calculator: Load only when password modal opens
- Delete confirmation dialog: Load only when danger zone action triggered

**Image Optimization**:
- Avatar: 96px max (desktop), 80px (mobile), serve at 2x for retina
- Placeholder: User initials in colored circle (no network request)

**Animation Budget**:
- Limit to 2-3 concurrent animations
- Use CSS transforms (GPU-accelerated)
- Disable animations on `prefers-reduced-motion`

**Bundle Size**:
- Code-split modals
- Tree-shake unused shadcn components
- Inline critical CSS for profile card

---

## 14. Implementation Coordination

### Agent Collaboration

**shadcn-builder**:
- Provide component requirements: Dialog, Sheet, Input, Button, Alert, Toast, Progress
- Request custom variants: Danger button, Password strength bar
- Confirm accessibility features in components

**domain-architect**:
- User profile data structure
- Password validation rules
- Account deletion logic and cascade behavior
- Session management for password change

**nextjs-builder**:
- Server actions for profile updates
- Authentication verification for sensitive operations
- Redirect logic after account deletion
- Session invalidation after password change

**Parent**:
- Implementation sequence: Profile display → Edit name → Change password → Delete account
- Testing sequence: Visual testing → Interaction testing → Security testing
- Review security warnings clarity with stakeholders

### Files Impacted

**Components**:
- `src/domains/user/components/organisms/profile-overview.tsx`
- `src/domains/user/components/organisms/account-settings.tsx`
- `src/domains/user/components/organisms/danger-zone.tsx`
- `src/domains/user/components/molecules/edit-name-sheet.tsx`
- `src/domains/user/components/molecules/change-password-modal.tsx`
- `src/domains/user/components/molecules/delete-confirmation-dialog.tsx`
- `src/domains/user/components/atoms/password-strength-bar.tsx`
- `src/domains/user/components/atoms/profile-avatar.tsx`

**Text Maps**:
- `src/domains/user/profile.text-map.ts` (create new)

**Styles**:
- `src/styles/domains/user/profile.css` (if needed for custom components)
- Leverage existing auth design tokens (--zen-moss, --zen-stone, etc.)

**Actions** (domain-architect will define):
- `src/domains/user/actions/update-profile.ts`
- `src/domains/user/actions/change-password.ts`
- `src/domains/user/actions/delete-account.ts`

**Page**:
- `src/app/(app)/profile/page.tsx` or `src/app/(app)/settings/profile/page.tsx`

---

## 15. Important Notes

**User testing recommended**: High-impact feature with security implications. Test delete flow with real users to ensure clarity.

**Accessibility is mandatory**: All keyboard navigation, screen reader support, and color contrast must be verified.

**Mobile-first**: Design and implement mobile experience first, then scale up.

**Content before chrome**: Focus on clear messaging in warnings, not decorative elements.

**Iterate**: Design is never truly done. Expect feedback on warning clarity.

**Security considerations**:
- Password change must verify current password
- Account deletion must require multiple confirmations
- Session invalidation after password change
- Consider email confirmation for critical actions (future enhancement)

**Legal considerations**:
- Account deletion must comply with data privacy laws (GDPR, CCPA)
- Provide data export option before deletion (future enhancement)

---

## 16. Success Metrics

**Usability**:
- Task completion rate: >95% for name change
- Task completion rate: >90% for password change
- Task completion rate: 100% for account deletion (no accidental deletions)
- User error rate: <5% (incorrect confirmations, validation errors)

**Efficiency**:
- Time to complete name change: <30 seconds
- Time to complete password change: <2 minutes
- Time to complete account deletion: >2 minutes (intentional friction)

**Satisfaction**:
- User feedback: Clear understanding of consequences
- User feedback: Not feeling "tricked" or "dark patterned"
- User feedback: Feeling secure and in control

**Accessibility**:
- Screen reader navigation: 100% without mouse/touch
- Keyboard-only navigation: 100% completion rate
- Color contrast: 100% WCAG AA compliance
- Motion sensitivity: Works perfectly with reduced motion

**Performance**:
- Initial profile load: <500ms
- Modal open: <100ms
- Form submission: <1s
- No layout shift on load (CLS < 0.1)

---

## 17. Design Rationale (Why Behind Decisions)

**Why progressive disclosure for delete?**
Multiple confirmation steps prevent accidental account deletion, which is the most catastrophic user error possible.

**Why bottom sheets on mobile vs modals?**
Bottom sheets are more ergonomic on mobile - easier to reach dismiss area, natural swipe gesture, less jarring than full-screen modal.

**Why inline editing for name on desktop?**
Reduces friction for a low-risk action. Name change doesn't require the ceremony of a full modal.

**Why modal for password on all sizes?**
Password change is security-sensitive and benefits from focused, distraction-free experience. Modal creates proper context and seriousness.

**Why "ELIMINAR" confirmation text?**
Typing a specific word creates intentional friction and forces user to actively engage with the decision, not just tap through warnings.

**Why danger zone at bottom?**
Dangerous actions should be less prominent and require deliberate scrolling to access. Users don't stumble into them accidentally.

**Why non-alarming language?**
Security warnings should be clear and direct, but not use fear tactics. We want informed consent, not scared users.

**Why success indicators on password strength?**
Positive reinforcement encourages good password practices. Visual feedback makes abstract requirements concrete.

**Why preserve input on error?**
Don't punish users for mistakes. Preserve their work and let them fix the specific problem.

**Why auto-dismiss success toasts?**
Success is transient - acknowledge it, then get out of the way. Persistent success messages become noise.

---

## 18. Future Enhancements (Out of Scope for V1)

- Two-factor authentication setup
- Data export before account deletion (GDPR compliance)
- Email confirmation for critical actions (password change, deletion)
- Avatar upload and customization
- Password history (prevent reuse)
- Account recovery email change
- Login activity log (see all sessions)
- Account pause/deactivate (alternative to deletion)
- Biometric authentication settings (mobile)

---

## 19. Appendix: Password Strength Algorithm

**Criteria for strength calculation**:

**Weak** (0-2 criteria met):
- Less than 8 characters
- No uppercase or no lowercase
- No numbers
- No special characters

**Medium** (3 criteria met):
- 8+ characters
- Mix of upper and lowercase
- Contains numbers
- Missing special characters OR short length

**Strong** (4+ criteria met):
- 10+ characters
- Mix of upper and lowercase
- Contains numbers
- Contains special characters

**Visual representation**:
- Weak: Red bar (25% width), 2 segments filled
- Medium: Yellow bar (60% width), 5 segments filled
- Strong: Green bar (100% width), 8 segments filled

---

## 20. Appendix: Example Text Map Structure

```typescript
// src/domains/user/profile.text-map.ts

export const PROFILE_MESSAGES = {
  PAGE: {
    TITLE: 'Configuración de Perfil',
    BACK: 'Volver a Dashboard'
  },

  PROFILE: {
    HEADER: 'Tu Perfil',
    MEMBER_SINCE: 'Miembro desde'
  },

  ACCOUNT: {
    HEADER: 'Información de Cuenta',
    NAME_LABEL: 'Nombre de usuario',
    PASSWORD_LABEL: 'Contraseña',
    LAST_PASSWORD_UPDATE: 'Última actualización'
  },

  DANGER_ZONE: {
    HEADER: 'Zona Peligrosa',
    DELETE_TITLE: 'Eliminar cuenta permanentemente',
    DELETE_DESCRIPTION: 'Esta acción eliminará todos tus datos y no se puede deshacer. Procede con precaución.'
  },

  ACTIONS: {
    EDIT_NAME: 'Editar',
    CHANGE_PASSWORD: 'Cambiar',
    DELETE_ACCOUNT: 'Eliminar mi cuenta',
    SAVE_CHANGES: 'Guardar cambios',
    CANCEL: 'Cancelar',
    CONFIRM_DELETE: 'Sí, eliminar cuenta',
    KEEP_ACCOUNT: 'No, mantener cuenta'
  },

  // ... (continue with all keys from section 7)

} as const;
```

---

## End of UX/UI Design Plan

**Next Steps for Parent Agent**:

1. Review this UX design plan
2. Coordinate with shadcn-builder for component specifications
3. Coordinate with domain-architect for data structures and actions
4. Coordinate with nextjs-builder for page and routing implementation
5. Implement components step-by-step following wireframes
6. Test security flows extensively
7. Conduct accessibility audit
8. User testing for warning clarity

**Questions for Stakeholders**:
- Do we need email confirmation for account deletion?
- What data retention policy applies after deletion?
- Should we offer account deactivation as alternative to deletion?
- Do we need audit logging for security actions?
