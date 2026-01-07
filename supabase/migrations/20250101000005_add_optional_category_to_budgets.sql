-- Add optional category column to budgets
-- Category is a visual label to quickly identify what the budget is about
-- Categories are shared between transactions and budgets but are independent

ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add comment
COMMENT ON COLUMN budgets.category IS 'Optional visual category label (e.g., entretenimiento, vivienda, etc.)';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
