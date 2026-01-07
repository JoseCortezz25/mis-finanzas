-- Refactor budgets table to support flexible budget grouping
-- Budgets are now independent groups for organizing transactions
-- Multiple budgets can exist simultaneously without month/year restrictions

-- 1. Drop the unique constraint that limits one budget per month/year
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS unique_budget_per_month;

-- 2. Make month and year optional (nullable)
-- Users can optionally specify a month/year for organization, but it's not required
ALTER TABLE budgets
ALTER COLUMN month DROP NOT NULL,
ALTER COLUMN year DROP NOT NULL;

-- 3. Update comments to reflect new design
COMMENT ON TABLE budgets IS 'Budget groups for organizing transactions (e.g., "Main Budget", "Trip to Cartagena", "Utilities")';
COMMENT ON COLUMN budgets.month IS 'Optional month for organization (1-12)';
COMMENT ON COLUMN budgets.year IS 'Optional year for organization';

-- 4. Add new index for better query performance with optional month/year
DROP INDEX IF EXISTS idx_budgets_user_month_year;
CREATE INDEX idx_budgets_user_id_status ON budgets(user_id, status);
CREATE INDEX idx_budgets_name ON budgets(name);
