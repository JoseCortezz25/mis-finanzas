-- Migration: Seed Default Categories
-- Creates default categories for new users via trigger

-- Create function to seed categories for new users
CREATE OR REPLACE FUNCTION public.seed_user_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default categories for the new user
  INSERT INTO public.categories (user_id, name, icon, type)
  VALUES
    -- Main expense categories (as shown in UI)
    (NEW.id, 'Comida', 'utensils', 'expense'),
    (NEW.id, 'Transporte', 'car', 'expense'),
    (NEW.id, 'Entretenimiento', 'gamepad-2', 'expense'),
    (NEW.id, 'Salud', 'heart', 'expense'),
    (NEW.id, 'Compras', 'shopping-bag', 'expense'),
    (NEW.id, 'Servicios', 'dollar-sign', 'expense'),
    (NEW.id, 'Educación', 'book-open', 'expense'),
    (NEW.id, 'Otros gastos', 'more-horizontal', 'expense'),

    -- Additional expense categories
    (NEW.id, 'Vivienda', 'home', 'expense'),
    (NEW.id, 'Tecnología', 'smartphone', 'expense'),
    (NEW.id, 'Regalos', 'gift', 'expense'),

    -- Income categories
    (NEW.id, 'Salario', 'wallet', 'income'),
    (NEW.id, 'Freelance', 'laptop', 'income'),
    (NEW.id, 'Inversiones', 'trending-up', 'income'),
    (NEW.id, 'Otros ingresos', 'coins', 'income');

  RETURN NEW;
END;
$$;

-- Create trigger to automatically seed categories for new users
DROP TRIGGER IF EXISTS on_auth_user_created_seed_categories ON auth.users;
CREATE TRIGGER on_auth_user_created_seed_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_user_categories();

-- Seed categories for existing users (one-time operation)
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- First, ensure all auth users have a profile in public.users
  INSERT INTO public.users (id, email)
  SELECT id, email
  FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.users)
  ON CONFLICT (id) DO NOTHING;

  -- Then, seed categories for users who don't have any
  FOR user_record IN SELECT id FROM public.users LOOP
    -- Only insert if user doesn't have categories yet
    IF NOT EXISTS (SELECT 1 FROM public.categories WHERE user_id = user_record.id) THEN
      INSERT INTO public.categories (user_id, name, icon, type)
      VALUES
        (user_record.id, 'Comida', 'utensils', 'expense'),
        (user_record.id, 'Transporte', 'car', 'expense'),
        (user_record.id, 'Entretenimiento', 'gamepad-2', 'expense'),
        (user_record.id, 'Salud', 'heart', 'expense'),
        (user_record.id, 'Compras', 'shopping-bag', 'expense'),
        (user_record.id, 'Servicios', 'dollar-sign', 'expense'),
        (user_record.id, 'Educación', 'book-open', 'expense'),
        (user_record.id, 'Otros gastos', 'more-horizontal', 'expense'),
        (user_record.id, 'Vivienda', 'home', 'expense'),
        (user_record.id, 'Tecnología', 'smartphone', 'expense'),
        (user_record.id, 'Regalos', 'gift', 'expense'),
        (user_record.id, 'Salario', 'wallet', 'income'),
        (user_record.id, 'Freelance', 'laptop', 'income'),
        (user_record.id, 'Inversiones', 'trending-up', 'income'),
        (user_record.id, 'Otros ingresos', 'coins', 'income')
      ON CONFLICT (user_id, name) DO NOTHING;
    END IF;
  END LOOP;

  RAISE NOTICE 'Categories seeded successfully for all users';
END $$;
