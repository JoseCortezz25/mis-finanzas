# Supabase Database Setup

Este directorio contiene las migraciones y scripts SQL para configurar la base de datos.

## 🚀 Setup Rápido

Si tu base de datos de Supabase está completamente vacía, sigue estos pasos:

### Paso 1: Ejecutar Migraciones en Orden

Abre el **SQL Editor** en tu dashboard de Supabase y ejecuta estos archivos **EN ORDEN**:

1. **`migrations/20250101000000_initial_schema.sql`**
   - Crea todas las tablas (users, categories, budgets, transactions, etc.)
   - Configura Row Level Security (RLS)
   - Crea índices y constraints

2. **`migrations/20250101000001_update_categories_table.sql`**
   - Agrega columna `type` a categories (expense/income)
   - Elimina columna `color` (ahora se maneja en frontend)

3. **`migrations/20250101000002_seed_default_categories.sql`**
   - Crea función para seed de categorías
   - Crea trigger para nuevos usuarios
   - Inserta categorías para usuarios existentes

### Paso 2: Verificar

Ejecuta esta query para verificar que todo funcionó:

```sql
SELECT name, icon, type
FROM categories
ORDER BY type, name;
```

Deberías ver 15 categorías (11 de gastos, 4 de ingresos).

---

## Categorías Predefinidas

El sistema incluye categorías predefinidas que se crean automáticamente para cada usuario nuevo:

### Categorías de Gastos

1. **Comida** (`utensils`) - Restaurantes, supermercado, delivery
2. **Transporte** (`car`) - Gasolina, transporte público, Uber
3. **Entretenimiento** (`gamepad-2`) - Cine, streaming, videojuegos
4. **Salud** (`heart`) - Médico, farmacia, gimnasio
5. **Compras** (`shopping-bag`) - Ropa, accesorios, artículos personales
6. **Servicios** (`dollar-sign`) - Suscripciones, servicios profesionales
7. **Educación** (`book-open`) - Cursos, libros, material educativo
8. **Otros gastos** (`more-horizontal`) - Gastos varios no categorizados
9. **Vivienda** (`home`) - Alquiler, servicios del hogar
10. **Tecnología** (`smartphone`) - Dispositivos, software, gadgets
11. **Regalos** (`gift`) - Regalos para otros

### Categorías de Ingresos

1. **Salario** (`wallet`) - Sueldo mensual
2. **Freelance** (`laptop`) - Trabajos independientes
3. **Inversiones** (`trending-up`) - Retornos de inversiones
4. **Otros ingresos** (`coins`) - Ingresos varios

**Nota**: Los valores entre paréntesis son los identificadores de íconos que se guardan en la base de datos. El frontend los convierte automáticamente a íconos de lucide-react con colores pastel.

## Cómo Ejecutar las Migraciones

### Opción 1: Usando Supabase CLI (Recomendado)

```bash
# Asegúrate de tener Supabase CLI instalado
npm install -g supabase

# Inicia sesión en Supabase
supabase login

# Vincula tu proyecto
supabase link --project-ref your-project-ref

# Ejecuta las migraciones
supabase db push
```

### Opción 2: Manualmente en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Copia el contenido de `migrations/20250101000000_seed_default_categories.sql`
4. Pégalo en el editor y ejecuta

### Opción 3: Para Usuarios Existentes

Si ya tienes usuarios y necesitas agregar las categorías, ejecuta:

```sql
-- En Supabase SQL Editor, reemplaza 'your-user-id' con tu ID real
SELECT seed_user_categories();
```

O usa el script `seed-categories.sql` para más control.

## Verificar que las Categorías se Crearon

```sql
-- Ver todas las categorías de un usuario
SELECT name, icon, type
FROM categories
WHERE user_id = 'your-user-id'
ORDER BY type, name;
```

## Notas

- Las categorías se crean automáticamente cuando un usuario se registra (mediante trigger)
- Cada usuario tiene su propio conjunto de categorías
- Los íconos se mapean a componentes de lucide-react en el frontend
- Los colores pastel se asignan en `src/domains/transaction/constants/category-styles.ts`
