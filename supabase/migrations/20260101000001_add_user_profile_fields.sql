-- Add display_name and deleted_at to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- Add index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Comment the new columns
COMMENT ON COLUMN users.display_name IS 'User display name (2-50 characters)';
COMMENT ON COLUMN users.deleted_at IS 'Timestamp when user account was soft-deleted (NULL = active)';

-- Update RLS policies to prevent deleted users from accessing data
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE
  USING (auth.uid() = id AND deleted_at IS NULL);
