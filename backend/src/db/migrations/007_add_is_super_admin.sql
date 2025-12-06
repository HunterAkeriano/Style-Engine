-- Migration: Add is_super_admin column to users table
-- Created: 2024-12-06

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_super_admin ON users(is_super_admin);

COMMENT ON COLUMN users.is_super_admin IS 'Flag indicating if user has super admin privileges';
