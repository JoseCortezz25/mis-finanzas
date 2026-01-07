-- Migration: Remove total_amount from budgets table
-- Description: Budget amount will be calculated dynamically from income transactions
-- Date: 2026-01-06
-- Session: budget_amount_removal_1767754905

BEGIN;

-- Step 1: Remove the positive_total_amount constraint
ALTER TABLE public.budgets
    DROP CONSTRAINT IF EXISTS positive_total_amount;

-- Step 2: Remove the total_amount column
ALTER TABLE public.budgets
    DROP COLUMN IF EXISTS total_amount;

-- Step 3: Add comment explaining the change
COMMENT ON TABLE public.budgets IS 'Budget groups for organizing transactions. Amount is computed from assigned income transactions.';

COMMIT;

-- Rollback instructions (if needed):
-- BEGIN;
-- ALTER TABLE public.budgets ADD COLUMN total_amount NUMERIC(12, 2);
-- UPDATE public.budgets SET total_amount = 0;
-- ALTER TABLE public.budgets ALTER COLUMN total_amount SET NOT NULL;
-- ALTER TABLE public.budgets ADD CONSTRAINT positive_total_amount CHECK (total_amount > 0);
-- COMMIT;
