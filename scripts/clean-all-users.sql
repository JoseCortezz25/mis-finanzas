-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los usuarios
-- Solo ejecutar en desarrollo, NUNCA en producción

-- 1. Eliminar todos los datos relacionados con usuarios (solo tablas que existen)
DO $$
BEGIN
    -- Transacciones
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
        DELETE FROM public.transactions;
    END IF;

    -- Budget allocations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budget_allocations') THEN
        DELETE FROM public.budget_allocations;
    END IF;

    -- Budgets
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budgets') THEN
        DELETE FROM public.budgets;
    END IF;

    -- Goals
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'goals') THEN
        DELETE FROM public.goals;
    END IF;

    -- Categorías personalizadas
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        DELETE FROM public.categories WHERE is_custom = true;
    END IF;

    -- User settings
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
        DELETE FROM public.user_settings;
    END IF;

    -- Users (tabla personalizada)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        DELETE FROM public.users;
    END IF;
END $$;

-- 2. CRÍTICO: Eliminar de auth.users (tabla de autenticación de Supabase)
DELETE FROM auth.users;

-- 3. Verificar que todo se eliminó
SELECT 'Limpieza completada' as mensaje;
SELECT COUNT(*) as usuarios_en_auth FROM auth.users;
SELECT COUNT(*) as usuarios_en_public FROM public.users;
