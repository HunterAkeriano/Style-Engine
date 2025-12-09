-- Drop legacy admin flag column now that role is the source of truth
ALTER TABLE users DROP COLUMN IF EXISTS is_admin;
