# User Profile Management - Next.js Implementation Plan

**Created**: 2026-01-01
**Session**: user_profile_management
**Type**: Next.js Architecture
**Complexity**: High

## 1. Feature Overview

**Feature**: User Profile Management
**User Flow**:
1. User navigates to profile/settings from app header
2. Views profile overview (email, display name)
3. Can update display name
4. Can change password (requires current password)
5. Can delete account (with confirmation dialog and warnings)

**Route**: `/perfil` (Spanish for profile, matching app language)

## 2. Routing Structure

### New Routes to Create

#### Route: `/perfil`

**File**: `app/(app)/perfil/page.tsx`
**Type**: Client Component (requires interactivity for forms, tabs, modals)
**Purpose**: User profile management dashboard with tabs for different settings sections
**Dynamic**: No

**Layout Needed**: No (uses existing `(app)` layout)
- Uses existing layout at `app/(app)/layout.tsx` (AppHeader + MobileBottomNav)

**Route Group**: `(app)` (existing protected route group)
**Why**: Profile is a protected route requiring authentication, shares layout with dashboard/movimientos/presupuesto

### Existing Routes to Modify

#### Route: `/`
**File**: `app/(app)/layout.tsx`
**Change**: AppHeader already exists with user email and sign out. May need to add profile link to header navigation.

## 3. Server Component Architecture

### Page Component (Client Component - Exception)

**File**: `app/(app)/perfil/page.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileOverview } from '@/domains/user/components/organisms/profile-overview';
import { UpdateNameForm } from '@/domains/user/components/organisms/update-name-form';
import { ChangePasswordForm } from '@/domains/user/components/organisms/change-password-form';
import { DeleteAccountSection } from '@/domains/user/components/organisms/delete-account-section';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1>Mi Perfil</h1>
        <p>Administra tu información personal y configuración de seguridad</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Suspense fallback={<Skeleton />}>
            <ProfileOverview />
            <UpdateNameForm />
          </Suspense>
        </TabsContent>

        <TabsContent value="seguridad">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="cuenta">
          <DeleteAccountSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Data Fetching**: Client-side with React Query (user profile data)
**Why Client Component**:
- [x] Uses useState for tab management
- [x] Event handlers (tab changes, form submissions)
- [x] Third-party UI libraries (Tabs component with state)

### Client Components (domain-specific)

#### 1. ProfileOverview Component

**File**: `src/domains/user/components/organisms/profile-overview.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { useUserProfile } from '@/domains/user/hooks/use-user-profile';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileOverview() {
  const { data: profile, isLoading, error } = useUserProfile();

  if (isLoading) return <Skeleton className="h-32" />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <Avatar>
          {profile.display_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
        </Avatar>
        <div>
          <h3>{profile.display_name || 'Sin nombre'}</h3>
          <p className="text-muted">{profile.email}</p>
          <p className="text-xs text-muted">
            Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </Card>
  );
}
```

**Why Client Component**:
- [x] Uses React Query hook for data fetching
- [x] Interactive display

#### 2. UpdateNameForm Component

**File**: `src/domains/user/components/organisms/update-name-form.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateDisplayName } from '@/domains/user/actions';
import { useUserProfile } from '@/domains/user/hooks/use-user-profile';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar cambios'}
    </Button>
  );
}

export function UpdateNameForm() {
  const { data: profile } = useUserProfile();
  const [state, formAction] = useActionState(updateDisplayName, null);

  return (
    <Card>
      <h3>Nombre para mostrar</h3>
      <form action={formAction}>
        <div>
          <Label htmlFor="display_name">Nombre</Label>
          <Input
            id="display_name"
            name="display_name"
            type="text"
            defaultValue={profile?.display_name || ''}
            placeholder="Tu nombre"
            maxLength={50}
          />
        </div>

        {state?.error && (
          <div className="error-message">{state.error}</div>
        )}

        {state?.success && (
          <div className="success-message">Nombre actualizado correctamente</div>
        )}

        <SubmitButton />
      </form>
    </Card>
  );
}
```

**Why Client Component**:
- [x] Uses useActionState for form state
- [x] Uses useFormStatus for submit button state
- [x] Event handlers (form submission)

#### 3. ChangePasswordForm Component

**File**: `src/domains/user/components/organisms/change-password-form.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@/domains/user/schemas';
import { changePassword } from '@/domains/user/actions';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ChangePasswordForm() {
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const result = await changePassword(data);

    if (result.success) {
      reset();
      // Show success message
      // Session invalidated, redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  };

  return (
    <Card>
      <h3>Cambiar contraseña</h3>
      <p className="text-sm text-muted">
        Después de cambiar tu contraseña, tendrás que iniciar sesión nuevamente.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <div className="relative">
            <Input
              {...register('currentPassword')}
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
              }
              className="absolute right-2 top-2"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="error">{errors.currentPassword.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <div className="relative">
            <Input
              {...register('newPassword')}
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-2 top-2"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="error">{errors.newPassword.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirmPassword"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-2 top-2"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} variant="default">
          {isSubmitting ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
        </Button>
      </form>
    </Card>
  );
}
```

**Why Client Component**:
- [x] Uses React Hook Form for complex validation
- [x] useState for password visibility toggle
- [x] Event handlers (form submission, button clicks)
- [x] useRouter for redirect after password change

#### 4. DeleteAccountSection Component

**File**: `src/domains/user/components/organisms/delete-account-section.tsx`
**Component Type**: Client Component (needs "use client")

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccount } from '@/domains/user/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

export function DeleteAccountSection() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'ELIMINAR') {
      setError('Por favor escribe "ELIMINAR" para confirmar');
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteAccount();

    if (result.success) {
      // Account deleted, redirect to login
      router.push('/auth/login');
    } else {
      setError(result.error || 'Error al eliminar la cuenta');
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive" size={24} />
        <div className="flex-1">
          <h3 className="text-destructive">Zona peligrosa</h3>
          <p className="text-sm text-muted">
            Eliminar tu cuenta es una acción permanente e irreversible.
          </p>
        </div>
      </div>

      <div className="warning-box">
        <h4>¿Qué sucederá?</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Se eliminarán todos tus presupuestos</li>
          <li>Se eliminarán todos tus movimientos</li>
          <li>Se eliminarán todos tus reportes</li>
          <li>Esta acción NO se puede deshacer</li>
        </ul>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Eliminar mi cuenta</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu
              cuenta y todos tus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <Label htmlFor="confirm">
              Por favor escribe <strong>ELIMINAR</strong> para confirmar
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="mt-2"
            />
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmText !== 'ELIMINAR'}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
```

**Why Client Component**:
- [x] useState for confirmation text and error state
- [x] Event handlers (dialog open/close, input changes)
- [x] Interactive AlertDialog component
- [x] useRouter for redirect after deletion

## 4. Layouts and Templates

### Root Layout (no modifications needed)

**File**: `app/layout.tsx`
**Changes**: None required

### App Layout (minor modifications)

**File**: `app/(app)/layout.tsx`
**Changes**: Add profile link to AppHeader navigation (if not already present)

**Current**: AppHeader shows user email and sign out button
**Needed**: Add profile link/button to header for easy access

```typescript
// Modification to AppHeader component
<AppHeader
  userEmail={user?.email}
  onSignOut={handleSignOut}
  profileLink="/perfil"  // Add this prop
/>
```

## 5. Loading and Error States

### Loading UI

**File**: `app/(app)/perfil/loading.tsx`
**Purpose**: Streaming loading state while profile page loads

```typescript
// Server Component
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="profile-loading">
      <Skeleton className="h-12 w-64 mb-4" /> {/* Title */}
      <Skeleton className="h-6 w-96 mb-8" /> {/* Subtitle */}

      {/* Tabs skeleton */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Content skeleton */}
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

**When shown**: While page.tsx is loading (automatic with Suspense)

### Error Boundary

**File**: `app/(app)/perfil/error.tsx`
**Purpose**: Catch and handle errors in profile page

```typescript
'use client'; // Must be Client Component

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-content">
        <AlertCircle className="text-destructive" size={48} />
        <h2>Algo salió mal</h2>
        <p className="text-muted">
          No pudimos cargar tu perfil. Por favor intenta de nuevo.
        </p>
        <Button onClick={reset}>Intentar de nuevo</Button>
      </div>
    </div>
  );
}
```

## 6. Data Fetching Strategy

### Client Component Fetch (React Query)

**File**: `src/domains/user/hooks/use-user-profile.ts`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/domains/user/queries';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**File**: `src/domains/user/queries.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function getUserProfile() {
  const supabase = await createServerClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No autenticado');
  }

  // Get user profile from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error('Error al cargar el perfil');
  }

  return {
    id: user.id,
    email: user.email!,
    display_name: profile.display_name,
    created_at: profile.created_at,
  };
}
```

**Cache Strategy**:
- `staleTime: 5 minutes` - Profile data doesn't change frequently
- Refetch on window focus disabled for profile (unless changed)

## 7. Server Actions Integration

### 1. Update Display Name Action

**File**: `src/domains/user/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateNameSchema = z.object({
  display_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
});

export async function updateDisplayName(prevState: any, formData: FormData) {
  // Session validation
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'No autenticado' };
  }

  // Validate input
  const displayName = formData.get('display_name') as string;
  const validation = updateNameSchema.safeParse({ display_name: displayName });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: validation.data.display_name })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: 'Error al actualizar el nombre' };
  }

  // Revalidate profile page
  revalidatePath('/perfil');

  return { success: true, message: 'Nombre actualizado correctamente' };
}
```

### 2. Change Password Action

**File**: `src/domains/user/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  // Session validation
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'No autenticado' };
  }

  // Verify passwords match
  if (data.newPassword !== data.confirmPassword) {
    return { success: false, error: 'Las contraseñas no coinciden' };
  }

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: data.currentPassword,
  });

  if (verifyError) {
    return { success: false, error: 'Contraseña actual incorrecta' };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (updateError) {
    return { success: false, error: 'Error al cambiar la contraseña' };
  }

  // Sign out user (session invalidation)
  await supabase.auth.signOut();

  return {
    success: true,
    message: 'Contraseña cambiada. Redirigiendo al inicio de sesión...',
  };
}
```

### 3. Delete Account Action

**File**: `src/domains/user/actions.ts`

```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function deleteAccount() {
  // Session validation
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'No autenticado' };
  }

  try {
    // Delete related data first (cascade or manual)
    // Note: Assuming RLS policies and foreign key constraints handle cascade

    // 1. Delete budgets (with CASCADE to budget_transactions)
    const { error: budgetsError } = await supabase
      .from('budgets')
      .delete()
      .eq('user_id', user.id);

    if (budgetsError) {
      console.error('Error deleting budgets:', budgetsError);
    }

    // 2. Delete transactions
    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', user.id);

    if (transactionsError) {
      console.error('Error deleting transactions:', transactionsError);
    }

    // 3. Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
    }

    // 4. Delete auth user (Supabase Admin API required)
    // Note: This requires Supabase service role key
    // Alternative: Soft delete by marking profile as deleted
    // For now, we'll soft delete by updating profile

    await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', user.id);

    // Sign out user
    await supabase.auth.signOut();

    return { success: true, message: 'Cuenta eliminada correctamente' };
  } catch (error) {
    console.error('Error deleting account:', error);
    return { success: false, error: 'Error al eliminar la cuenta' };
  }
}
```

**Note on Account Deletion**:
- Soft delete approach: Mark profile as deleted instead of hard delete
- Hard delete requires Supabase service role key (admin API)
- RLS policies should prevent soft-deleted users from accessing data
- Consider background job for actual data purge after 30 days

## 8. Middleware for Route Protection

**File**: `src/middleware.ts`

**Current implementation**: Already protects `/perfil` route (falls under protected routes)

**No changes needed**: Existing middleware redirects unauthenticated users to `/auth/login`

```typescript
// Current middleware already handles /perfil
const isProtectedRoute = !isAuthRoute && !request.nextUrl.pathname.startsWith('/api');

if (!user && isProtectedRoute && request.nextUrl.pathname !== '/') {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/auth/login';
  return NextResponse.redirect(redirectUrl);
}
```

## 9. Metadata and SEO

### Static Metadata

**File**: `app/(app)/perfil/page.tsx`

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil - Mis Finanzas',
  description: 'Administra tu información personal y configuración de cuenta',
  robots: 'noindex, nofollow', // Private page, don't index
};
```

## 10. Route Groups and Organization

**Route Group**: `(app)` (existing)

**Purpose**: Protected routes with shared AppHeader layout

**Structure**:
```
app/
└── (app)/
    ├── layout.tsx              # Shared layout (AppHeader + MobileBottomNav)
    ├── dashboard/
    ├── movimientos/
    ├── presupuesto/
    ├── reportes/
    └── perfil/                 # NEW: Profile management
        ├── page.tsx            # Profile page (Client Component)
        ├── loading.tsx         # Loading state
        └── error.tsx           # Error boundary
```

## 11. Files to Create

### `app/(app)/perfil/page.tsx`
**Purpose**: Main profile page with tabs
**Type**: Client Component (requires "use client")
**Exports**: `default export function ProfilePage()`

### `app/(app)/perfil/loading.tsx`
**Purpose**: Loading state for profile page
**Type**: Server Component
**Exports**: `default export function Loading()`

### `app/(app)/perfil/error.tsx`
**Purpose**: Error boundary for profile page
**Type**: Client Component (must be)
**Exports**: `default export function Error()`

### `src/domains/user/components/organisms/profile-overview.tsx`
**Purpose**: Display user profile information
**Type**: Client Component
**Exports**: `export function ProfileOverview()`

### `src/domains/user/components/organisms/update-name-form.tsx`
**Purpose**: Form to update display name
**Type**: Client Component
**Exports**: `export function UpdateNameForm()`

### `src/domains/user/components/organisms/change-password-form.tsx`
**Purpose**: Form to change password with validation
**Type**: Client Component
**Exports**: `export function ChangePasswordForm()`

### `src/domains/user/components/organisms/delete-account-section.tsx`
**Purpose**: Account deletion with confirmation dialog
**Type**: Client Component
**Exports**: `export function DeleteAccountSection()`

### `src/domains/user/actions.ts`
**Purpose**: Server Actions for profile mutations
**Type**: Server file ("use server")
**Exports**:
- `export async function updateDisplayName()`
- `export async function changePassword()`
- `export async function deleteAccount()`

### `src/domains/user/queries.ts`
**Purpose**: Server-side data fetching queries
**Type**: Server file ("use server")
**Exports**: `export async function getUserProfile()`

### `src/domains/user/hooks/use-user-profile.ts`
**Purpose**: React Query hook for profile data
**Type**: Client file ("use client")
**Exports**: `export function useUserProfile()`

### `src/domains/user/schemas.ts`
**Purpose**: Zod schemas for validation
**Type**: Shared file (no directive)
**Exports**:
- `export const updateNameSchema`
- `export const changePasswordSchema`

### `src/domains/user/user.text-map.ts`
**Purpose**: Externalized text/messages for user domain
**Type**: Shared file (no directive)
**Exports**: `export const userTextMap`

## 12. Files to Modify

### `src/app/(app)/layout.tsx`
**Change**: Add profile link to AppHeader (if not already present)

**Current**: AppHeader with user email and sign out
**Add**: Profile link/button for navigation

```typescript
// Add profileLink prop to AppHeader
<AppHeader
  userEmail={user?.email}
  onSignOut={handleSignOut}
  profileLink="/perfil"
/>
```

### `src/components/organisms/app-header.tsx`
**Change**: Add profile link button/navigation

**Example addition**:
```typescript
export function AppHeader({ userEmail, onSignOut, profileLink }) {
  return (
    <header>
      {/* Existing header content */}
      <nav>
        <Link href={profileLink}>
          <User size={20} />
          <span>Mi Perfil</span>
        </Link>
        <button onClick={onSignOut}>Cerrar sesión</button>
      </nav>
    </header>
  );
}
```

## 13. Implementation Steps

1. Create user domain directory structure: `src/domains/user/`
2. Create text map: `src/domains/user/user.text-map.ts`
3. Create schemas: `src/domains/user/schemas.ts`
4. Create queries file: `src/domains/user/queries.ts` (Server-side data fetching)
5. Create actions file: `src/domains/user/actions.ts` (Server Actions)
6. Create React Query hook: `src/domains/user/hooks/use-user-profile.ts`
7. Create organism components:
   - `profile-overview.tsx`
   - `update-name-form.tsx`
   - `change-password-form.tsx`
   - `delete-account-section.tsx`
8. Create route directory: `app/(app)/perfil/`
9. Create page.tsx (Client Component with tabs)
10. Create loading.tsx (loading state)
11. Create error.tsx (error boundary)
12. Add metadata to page.tsx
13. Modify AppHeader to include profile link
14. Test profile data fetching
15. Test update name functionality
16. Test change password flow (including session invalidation)
17. Test delete account flow (with confirmation)
18. Test loading and error states
19. Test responsive layout

## 14. Component Placement Strategy

### Server Components (none in this feature)
- All components require client interactivity

### Client Components
- **Route page**: `app/(app)/perfil/page.tsx` (tabs, state management)
- **Domain organisms**: `src/domains/user/components/organisms/` (forms, profile display)
- **UI primitives**: Use existing from `@/components/ui/` (Card, Button, Input, Tabs, AlertDialog)

### Rule of Thumb
- Page is Client Component (tabs require state)
- All organisms are Client Components (forms, interactivity)
- Use Server Actions for all mutations
- Use React Query for data fetching

## 15. Performance Considerations

### Streaming and Suspense
- Wrap ProfileOverview in Suspense for initial data load
- Use loading.tsx for route-level loading state

### Code Splitting
- Client Components are automatically code-split
- Heavy components (AlertDialog) are lazy-loaded by shadcn/ui

### Caching Strategy
- React Query cache: 5 minutes staleTime for profile data
- Revalidate on profile update (revalidatePath)
- Clear cache on password change or account deletion

## 16. Security Considerations

### Password Change Security
1. **Verify current password**: Re-authenticate before allowing password change
2. **Session invalidation**: Sign out user after password change
3. **Redirect to login**: Force re-authentication with new password
4. **Password validation**: Enforce minimum length (6 characters minimum, recommend 8+)
5. **No password in URL**: Use form data, never query params

### Account Deletion Security
1. **Confirmation required**: User must type "ELIMINAR" to confirm
2. **Warning messages**: Clear explanation of consequences
3. **Data cleanup**: Delete/anonymize all user data
4. **RLS policies**: Ensure deleted users can't access data
5. **Soft delete option**: Mark as deleted instead of hard delete
6. **Audit log**: Consider logging deletion events

### Session Management
1. **Middleware protection**: Route already protected
2. **Server Action validation**: Verify session in every action
3. **Token refresh**: Middleware handles session refresh
4. **Sign out on sensitive actions**: Password change, account deletion

## 17. Database Schema Requirements

### New Table: `profiles`

**Note**: Assuming profiles table already exists (common Supabase pattern)

**Required columns**:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id AND deleted_at IS NULL);

-- Users can delete their own profile (soft delete)
CREATE POLICY "Users can delete own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Existing Tables to Consider

**Cascade delete or anonymize**:
- `budgets.user_id` → CASCADE or SET NULL
- `transactions.user_id` → CASCADE or SET NULL
- `budget_transactions.budget_id` → CASCADE (already via budgets)

**RLS Policies**:
- Ensure all tables filter by `deleted_at IS NULL` or equivalent
- Prevent soft-deleted users from accessing data

## 18. Text Map Structure

**File**: `src/domains/user/user.text-map.ts`

```typescript
export const userTextMap = {
  profile: {
    title: 'Mi Perfil',
    subtitle: 'Administra tu información personal y configuración de seguridad',
    tabs: {
      general: 'General',
      security: 'Seguridad',
      account: 'Cuenta',
    },
  },
  profileOverview: {
    noName: 'Sin nombre',
    memberSince: 'Miembro desde',
  },
  updateName: {
    title: 'Nombre para mostrar',
    label: 'Nombre',
    placeholder: 'Tu nombre',
    submitButton: 'Guardar cambios',
    submitting: 'Guardando...',
    success: 'Nombre actualizado correctamente',
    error: 'Error al actualizar el nombre',
  },
  changePassword: {
    title: 'Cambiar contraseña',
    subtitle: 'Después de cambiar tu contraseña, tendrás que iniciar sesión nuevamente.',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    submitButton: 'Cambiar contraseña',
    submitting: 'Cambiando contraseña...',
    success: 'Contraseña cambiada. Redirigiendo al inicio de sesión...',
    error: {
      currentIncorrect: 'Contraseña actual incorrecta',
      mismatch: 'Las contraseñas no coinciden',
      generic: 'Error al cambiar la contraseña',
    },
  },
  deleteAccount: {
    title: 'Zona peligrosa',
    subtitle: 'Eliminar tu cuenta es una acción permanente e irreversible.',
    warningTitle: '¿Qué sucederá?',
    warnings: [
      'Se eliminarán todos tus presupuestos',
      'Se eliminarán todos tus movimientos',
      'Se eliminarán todos tus reportes',
      'Esta acción NO se puede deshacer',
    ],
    deleteButton: 'Eliminar mi cuenta',
    dialog: {
      title: '¿Estás absolutamente seguro?',
      description:
        'Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos tus datos de nuestros servidores.',
      confirmLabel: 'Por favor escribe ELIMINAR para confirmar',
      confirmPlaceholder: 'ELIMINAR',
      confirmKeyword: 'ELIMINAR',
      cancelButton: 'Cancelar',
      confirmButton: 'Sí, eliminar mi cuenta',
      deleting: 'Eliminando...',
      errorConfirm: 'Por favor escribe "ELIMINAR" para confirmar',
    },
    success: 'Cuenta eliminada correctamente',
    error: 'Error al eliminar la cuenta',
  },
  errors: {
    notAuthenticated: 'No autenticado',
    loadProfile: 'Error al cargar el perfil',
  },
};
```

## 19. Validation Schemas

**File**: `src/domains/user/schemas.ts`

```typescript
import { z } from 'zod';

export const updateNameSchema = z.object({
  display_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
```

## 20. Important Notes

- **Default to Client Components** (this feature requires interactivity throughout)
- **Suspense is mandatory** for ProfileOverview async data
- **Server Actions for mutations** (updateDisplayName, changePassword, deleteAccount)
- **Use route group** `(app)` for protected routes with shared layout
- **Middleware for auth** (already configured, no changes needed)
- **No metadata for SEO** (private page, use noindex)
- **Client Components throughout** (forms, tabs, dialogs, state management)

## 21. Supabase Auth Integration

### Password Change Flow
1. User fills change password form (React Hook Form + Zod validation)
2. Server Action verifies current password via `signInWithPassword`
3. Server Action updates password via `supabase.auth.updateUser()`
4. Server Action signs out user (session invalidation)
5. Client redirects to `/auth/login` after 2 seconds
6. User logs in with new password

### Account Deletion Flow
1. User clicks "Eliminar mi cuenta"
2. AlertDialog shows with warnings
3. User types "ELIMINAR" to confirm
4. Server Action validates session
5. Server Action deletes related data:
   - Budgets (CASCADE to budget_transactions)
   - Transactions
   - Profile (soft delete with `deleted_at`)
6. Server Action signs out user
7. Client redirects to `/auth/login`

### Session Management
- **Middleware**: Refreshes session on every request
- **Server Actions**: Validate session via `supabase.auth.getUser()`
- **Password change**: Invalidates session, forces re-login
- **Account deletion**: Invalidates session, redirects to login

## 22. Coordination with Other Agents

### Business Analyst
- **Receives**: User stories, security requirements, data cleanup strategy
- **Provides**: Route structure, Supabase Auth integration approach

### UX Designer
- **Receives**: Wireframes, component hierarchy, tab structure
- **Provides**: Route organization, component breakdown

### Domain Architect
- **Receives**: Entity definitions, validation schemas
- **Uses**: Server Actions pattern, React Query hooks

### shadcn Builder
- **Uses**: Tabs, Card, Button, Input, Label, AlertDialog components
- **Provides**: Component selection for forms and dialogs

## 23. Testing Strategy

### Unit Tests
- Test Server Actions (updateDisplayName, changePassword, deleteAccount)
- Test validation schemas
- Test hooks (useUserProfile)

### Integration Tests
- Test password change flow (verify + update + sign out)
- Test account deletion flow (data cleanup + sign out)
- Test profile update flow (update + revalidate)

### E2E Tests
- User can view profile
- User can update display name
- User can change password and re-login
- User can delete account (with confirmation)

## 24. Accessibility Considerations

### Forms
- All inputs have labels (Label component)
- Error messages are associated with inputs
- Submit buttons show loading state
- Keyboard navigation works throughout

### Dialogs
- AlertDialog is keyboard accessible
- Focus traps in dialog
- ESC closes dialog
- Focus returns to trigger after close

### Visual Feedback
- Loading states for all async operations
- Success/error messages clearly visible
- Destructive actions use warning colors
- Confirmation required for dangerous actions

---

**Next Steps for Parent Agent**:

1. Create domain structure: `src/domains/user/`
2. Implement Server Actions in `actions.ts`
3. Implement queries in `queries.ts`
4. Create validation schemas in `schemas.ts`
5. Create text map in `user.text-map.ts`
6. Create React Query hook `use-user-profile.ts`
7. Create organism components (profile-overview, update-name-form, change-password-form, delete-account-section)
8. Create route files (`page.tsx`, `loading.tsx`, `error.tsx`)
9. Modify AppHeader to add profile link
10. Test all flows thoroughly
11. Verify security (session validation, password verification, data cleanup)
