# Guía de Configuración de Supabase

## Error 400 en Autenticación - Soluciones

### 1. Verificar Variables de Entorno

Verifica que tu archivo `.env.local` tenga el formato correcto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANTE:**
- ✅ NO uses comillas en los valores
- ✅ NO incluyas espacios alrededor del `=`
- ✅ La URL debe terminar en `.supabase.co` (sin `/` al final)
- ✅ Reinicia el servidor después de modificar `.env.local`

### 2. Verificar Configuración en Supabase Dashboard

#### A. Confirmar que el Email está habilitado

1. Ve a tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Ve a **Authentication** > **Providers**
3. Asegúrate de que **Email** esté activado (toggle en verde)

#### B. Desactivar confirmación de email (para desarrollo)

Para testing local, es recomendable desactivar la confirmación de email:

1. Ve a **Authentication** > **Settings** > **Email Auth**
2. Desmarca **"Enable email confirmations"**
3. Guarda los cambios

Esto permitirá que los usuarios se registren sin tener que confirmar su email.

### 3. Reiniciar el Servidor

```bash
# Detener el servidor (Ctrl+C)
# Reiniciar
pnpm dev
```

### 4. Verificar Credenciales Correctas

Asegúrate de usar las credenciales correctas de Supabase:

1. Ve a **Settings** > **API**
2. Copia **EXACTAMENTE**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** > **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**NO uses:**
- ❌ service_role key (es secreta)
- ❌ La URL de Postgres (empieza con `postgresql://`)

### 5. Probar Conexión

Crea un archivo de prueba para verificar la conexión:

```typescript
// test-supabase.ts
import { createBrowserClient } from '@/lib/supabase/client';

async function testConnection() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'password123'
  });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testConnection();
```

### 6. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 400 Bad Request | Credenciales incorrectas | Verificar `.env.local` |
| Invalid API key | API key incorrecta | Copiar de nuevo desde Supabase |
| Email not confirmed | Email sin confirmar | Desactivar confirmación o confirmar email |
| Invalid login credentials | Usuario/contraseña incorrectos | Verificar que el usuario existe |

### 7. Crear Usuario de Prueba

Si aún tienes problemas, crea un usuario directamente en Supabase:

1. Ve a **Authentication** > **Users**
2. Haz clic en **"Add user"** > **"Create new user"**
3. Ingresa:
   - Email: `test@example.com`
   - Password: `password123`
   - Auto confirm user: ✅ (activado)
4. Haz clic en **"Create user"**

Ahora intenta iniciar sesión con ese usuario.

### 8. Verificar que la BD Está Creada

Ejecuta este SQL en Supabase para verificar que las tablas existen:

```sql
-- Ver todas las tablas
SELECT tablename FROM pg_tables
WHERE schemaname = 'public';
```

Deberías ver: `budgets`, `categories`, `transactions`, `goals`, `category_allocations`

Si no existen, ejecuta el SQL del archivo de configuración inicial.

## Comandos Útiles

```bash
# Ver variables de entorno
cat .env.local

# Reiniciar servidor Next.js
pnpm dev

# Limpiar caché de Next.js
rm -rf .next
pnpm dev
```

## Recursos

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Troubleshooting Guide](https://supabase.com/docs/guides/platform/troubleshooting)
