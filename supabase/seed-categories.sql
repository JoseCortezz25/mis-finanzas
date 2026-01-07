-- Seed Categories
-- This script creates the initial categories for the application
-- Execute this in Supabase SQL Editor

-- Note: Replace 'your-user-id' with your actual user ID from auth.users table
-- You can get your user ID by running: SELECT id FROM auth.users LIMIT 1;

-- First, let's create a function to insert categories for a user
CREATE OR REPLACE FUNCTION seed_categories_for_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert categories if they don't exist for this user
  INSERT INTO public.categories (user_id, name, icon, type)
  VALUES
    -- Expense categories
    (user_id, 'Comida', 'utensils', 'expense'),
    (user_id, 'Transporte', 'car', 'expense'),
    (user_id, 'Entretenimiento', 'gamepad-2', 'expense'),
    (user_id, 'Salud', 'heart', 'expense'),
    (user_id, 'Compras', 'shopping-bag', 'expense'),
    (user_id, 'Servicios', 'dollar-sign', 'expense'),
    (user_id, 'Educación', 'book-open', 'expense'),
    (user_id, 'Otros gastos', 'more-horizontal', 'expense'),

    -- Additional useful categories
    (user_id, 'Vivienda', 'home', 'expense'),
    (user_id, 'Tecnología', 'smartphone', 'expense'),
    (user_id, 'Regalos', 'gift', 'expense'),

    -- Income categories
    (user_id, 'Salario', 'wallet', 'income'),
    (user_id, 'Freelance', 'laptop', 'income'),
    (user_id, 'Inversiones', 'trending-up', 'income'),
    (user_id, 'Otros ingresos', 'coins', 'income')
  ON CONFLICT (user_id, name) DO NOTHING;

  RAISE NOTICE 'Categories seeded successfully for user %', user_id;
END;
$$;

-- Example: Seed categories for current user
-- Uncomment and replace with your user ID:
-- SELECT seed_categories_for_user('your-user-id-here');

-- To seed for all existing users:
-- DO $$
-- DECLARE
--   user_record RECORD;
-- BEGIN
--   FOR user_record IN SELECT id FROM auth.users LOOP
--     PERFORM seed_categories_for_user(user_record.id);
--   END LOOP;
-- END $$;
