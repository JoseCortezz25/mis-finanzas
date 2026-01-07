-- ============================================
-- Mis Finanzas - Initial Database Schema
-- ============================================
-- Created: 2025-12-30
-- Version: 1.0.0
-- Description: Complete schema for personal finance management
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories table (default + custom)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL for default categories
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- BR-2.1: Category names must be unique per user (or globally for defaults)
    CONSTRAINT unique_category_name UNIQUE NULLS NOT DISTINCT (user_id, name)
);

-- Budgets table
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- BR-1.1: Amount must be positive
    CONSTRAINT positive_total_amount CHECK (total_amount > 0),
    
    -- BR-1.3: Valid month range
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12),
    
    -- BR-1.2: One budget per month/year per user
    CONSTRAINT unique_budget_per_month UNIQUE (user_id, month, year),
    
    -- BW-1.1: Valid status values
    CONSTRAINT valid_budget_status CHECK (status IN ('draft', 'active', 'closed'))
);

-- Category Allocations table (budget breakdown by category)
CREATE TABLE public.category_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    allocated_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- BR-1.4: Allocated amount must be positive
    CONSTRAINT positive_allocated_amount CHECK (allocated_amount > 0),
    
    -- One allocation per category per budget
    CONSTRAINT unique_category_per_budget UNIQUE (budget_id, category_id)
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    type TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    payment_method TEXT,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- TR-1.1: Amount must be positive
    CONSTRAINT positive_transaction_amount CHECK (amount > 0),
    
    -- TR-1.2: Valid transaction type
    CONSTRAINT valid_transaction_type CHECK (type IN ('income', 'expense')),
    
    -- TR-1.3: Date cannot be in the future
    CONSTRAINT valid_transaction_date CHECK (date <= CURRENT_DATE)
);

-- Goals table (Phase 2)
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    deadline DATE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Target amount must be positive
    CONSTRAINT positive_target_amount CHECK (target_amount > 0),
    
    -- Current amount cannot be negative
    CONSTRAINT non_negative_current_amount CHECK (current_amount >= 0),
    
    -- Current amount cannot exceed target
    CONSTRAINT current_not_exceeds_target CHECK (current_amount <= target_amount),
    
    -- Valid status values
    CONSTRAINT valid_goal_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- User Settings table (Phase 2)
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'MXN',
    locale TEXT NOT NULL DEFAULT 'es-MX',
    theme TEXT NOT NULL DEFAULT 'light',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Valid theme values
    CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'system'))
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);

-- Categories indexes
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_is_custom ON public.categories(is_custom);

-- Budgets indexes
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_month_year ON public.budgets(month, year);
CREATE INDEX idx_budgets_status ON public.budgets(status);
CREATE INDEX idx_budgets_user_month_year ON public.budgets(user_id, month, year);

-- Category Allocations indexes
CREATE INDEX idx_category_allocations_budget_id ON public.category_allocations(budget_id);
CREATE INDEX idx_category_allocations_category_id ON public.category_allocations(category_id);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_budget_id ON public.transactions(budget_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date);

-- Goals indexes
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);

-- User Settings indexes (already unique on user_id)

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can view all categories (default + own custom)"
    ON public.categories FOR SELECT
    USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can create custom categories"
    ON public.categories FOR INSERT
    WITH CHECK (user_id = auth.uid() AND is_custom = true);

CREATE POLICY "Users can update own custom categories"
    ON public.categories FOR UPDATE
    USING (user_id = auth.uid() AND is_custom = true);

CREATE POLICY "Users can delete own custom categories"
    ON public.categories FOR DELETE
    USING (user_id = auth.uid() AND is_custom = true);

-- Budgets policies
CREATE POLICY "Users can view own budgets"
    ON public.budgets FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own budgets"
    ON public.budgets FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budgets"
    ON public.budgets FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own budgets"
    ON public.budgets FOR DELETE
    USING (user_id = auth.uid());

-- Category Allocations policies (inherit from budget)
CREATE POLICY "Users can view allocations of own budgets"
    ON public.category_allocations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = category_allocations.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create allocations for own budgets"
    ON public.category_allocations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update allocations of own budgets"
    ON public.category_allocations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = category_allocations.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete allocations of own budgets"
    ON public.category_allocations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = category_allocations.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (user_id = auth.uid());

-- Goals policies
CREATE POLICY "Users can view own goals"
    ON public.goals FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own goals"
    ON public.goals FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
    ON public.goals FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
    ON public.goals FOR DELETE
    USING (user_id = auth.uid());

-- User Settings policies
CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_allocations_updated_at BEFORE UPDATE ON public.category_allocations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA: DEFAULT CATEGORIES
-- ============================================

INSERT INTO public.categories (id, user_id, name, color, icon, is_custom) VALUES
    ('11111111-1111-1111-1111-111111111111', NULL, 'Vivienda', '#3b82f6', 'home', false),
    ('22222222-2222-2222-2222-222222222222', NULL, 'Alimentación', '#10b981', 'utensils', false),
    ('33333333-3333-3333-3333-333333333333', NULL, 'Transporte', '#f59e0b', 'car', false),
    ('44444444-4444-4444-4444-444444444444', NULL, 'Entretenimiento', '#8b5cf6', 'film', false),
    ('55555555-5555-5555-5555-555555555555', NULL, 'Salud', '#ef4444', 'heart', false),
    ('66666666-6666-6666-6666-666666666666', NULL, 'Personal', '#ec4899', 'user', false),
    ('77777777-7777-7777-7777-777777777777', NULL, 'Servicios', '#06b6d4', 'zap', false),
    ('88888888-8888-8888-8888-888888888888', NULL, 'Ahorro', '#10b981', 'piggy-bank', false),
    ('99999999-9999-9999-9999-999999999999', NULL, 'Otros', '#6b7280', 'more-horizontal', false);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.users IS 'User profiles extending auth.users';
COMMENT ON TABLE public.categories IS 'Transaction categories (9 defaults + custom per user)';
COMMENT ON TABLE public.budgets IS 'Monthly budgets with total amount and category allocations';
COMMENT ON TABLE public.category_allocations IS 'Budget breakdown by category';
COMMENT ON TABLE public.transactions IS 'Income and expense transactions';
COMMENT ON TABLE public.goals IS 'Savings goals with progress tracking';
COMMENT ON TABLE public.user_settings IS 'User preferences and settings';

COMMENT ON CONSTRAINT unique_budget_per_month ON public.budgets IS 'BR-1.2: One budget per month/year per user';
COMMENT ON CONSTRAINT unique_category_name ON public.categories IS 'BR-2.1: Category names must be unique per user';
COMMENT ON CONSTRAINT positive_total_amount ON public.budgets IS 'BR-1.1: Budget amount must be positive';
COMMENT ON CONSTRAINT positive_transaction_amount ON public.transactions IS 'TR-1.1: Transaction amount must be positive';
COMMENT ON CONSTRAINT valid_transaction_date ON public.transactions IS 'TR-1.3: Transaction date cannot be in the future';
