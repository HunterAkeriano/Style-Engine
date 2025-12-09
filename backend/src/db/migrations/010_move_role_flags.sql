-- Add role column with default user if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Backfill from legacy admin flags
UPDATE users
SET role = 'super_admin'
WHERE COALESCE(is_super_admin, false) = true;

UPDATE users
SET role = 'moderator'
WHERE COALESCE(is_admin, false) = true
  AND role = 'user';

-- Drop legacy super admin flag (admin flag kept for now for compatibility)
ALTER TABLE users DROP COLUMN IF EXISTS is_super_admin;
