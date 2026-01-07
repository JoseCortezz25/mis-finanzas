# Instrucciones para Aplicar la Migración: Eliminar total_amount

## Paso 1: Aplicar la Migración en Supabase

### Opción A: Usando Supabase Dashboard (Recomendado si no tienes CLI)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query y copia el contenido del archivo:
   ```
   supabase/migrations/20260106000001_remove_budget_total_amount.sql
   ```
4. Ejecuta la query
5. Verifica que se ejecutó correctamente (debe decir "Success")

### Opción B: Usando Supabase CLI (Si lo tienes instalado)

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Aplicar la migración
supabase db push

# O aplicar migración específica
supabase migration up
```

## Paso 2: Verificar la Migración

Ejecuta esta query en el SQL Editor para verificar que la columna fue eliminada:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'budgets'
AND table_schema = 'public';
```

**Resultado esperado:** La columna `total_amount` NO debe aparecer en la lista.

## Paso 3: Regenerar Tipos de TypeScript

### Opción A: Usando Supabase CLI

```bash
# Regenerar tipos
supabase gen types typescript --project-id <tu-project-id> > src/types/supabase.ts

# Tu project ID lo encuentras en: Settings > API > Project ID
```

### Opción B: Manualmente desde Dashboard

1. Ve a **Settings** > **API**
2. Copia tu **Project URL** y **anon key**
3. Usa la herramienta de generación de tipos de Supabase

## Paso 4: Remover Ajustes Temporales

Después de aplicar la migración y regenerar tipos, ejecuta:

```bash
# Este script removerá los ajustes temporales del código
node scripts/remove-temp-fixes.js
```

O manualmente:
- Archivo: `src/app/(app)/presupuesto/crear/page.tsx`
- Cambiar:
  ```typescript
  const result = await createBudget.mutateAsync({
    ...data,
    total_amount: 0
  } as any);
  ```
- Por:
  ```typescript
  const result = await createBudget.mutateAsync(data);
  ```

## Paso 5: Verificar Funcionamiento

1. Reinicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

2. Prueba las siguientes funcionalidades:
   - ✅ Crear un nuevo presupuesto (sin campo de monto)
   - ✅ Ver lista de presupuestos (deben mostrar monto = 0 inicialmente)
   - ✅ Crear movimientos de ingreso asignados al presupuesto
   - ✅ Verificar que el monto del presupuesto se actualiza automáticamente
   - ✅ Ver dashboard con presupuestos activos

## Rollback (Si algo sale mal)

Si necesitas revertir la migración, ejecuta:

```sql
BEGIN;
ALTER TABLE public.budgets ADD COLUMN total_amount NUMERIC(12, 2);
UPDATE public.budgets SET total_amount = 0;
ALTER TABLE public.budgets ALTER COLUMN total_amount SET NOT NULL;
ALTER TABLE public.budgets ADD CONSTRAINT positive_total_amount CHECK (total_amount > 0);
COMMIT;
```

## Notas Importantes

- ⚠️ **Backup**: Antes de aplicar, asegúrate de tener un backup de tu base de datos
- ⏱️ **Downtime**: La migración debería ser instantánea (< 1 segundo)
- 🔄 **Cache**: Después de regenerar tipos, limpia el cache de Next.js:
  ```bash
  rm -rf .next
  pnpm dev
  ```

## Soporte

Si encuentras problemas, revisa:
1. Los logs de Supabase en el Dashboard
2. Los logs de la consola del navegador
3. Los logs del servidor de desarrollo

---

**Fecha de creación**: 2026-01-06
**Sesión**: budget_amount_removal_1767754905
