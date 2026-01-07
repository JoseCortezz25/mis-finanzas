-- Update categories table to support expense/income types
-- and remove color column (colors are handled in frontend)

-- Add type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'type'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';
  END IF;
END $$;

-- Add constraint for valid types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'valid_category_type'
  ) THEN
    ALTER TABLE public.categories
    ADD CONSTRAINT valid_category_type CHECK (type IN ('income', 'expense'));
  END IF;
END $$;

-- Drop color column if it exists (colors are now managed in frontend)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'color'
  ) THEN
    ALTER TABLE public.categories DROP COLUMN color;
  END IF;
END $$;

-- Clear existing default categories (they will be replaced)
DELETE FROM public.categories WHERE user_id IS NULL;

-- Comment
COMMENT ON COLUMN public.categories.type IS 'Category type: income or expense';
