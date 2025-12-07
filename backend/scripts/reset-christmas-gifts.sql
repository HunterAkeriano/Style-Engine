-- Reset all users who have premium/pro subscription to free tier
-- This script resets the Christmas gift for all users

UPDATE users
SET
  subscription_tier = 'free',
  subscription_expires_at = NULL
WHERE
  subscription_tier IN ('premium', 'pro')
  AND is_payment = false;

-- Optionally, only reset users who got subscription recently (last 7 days)
-- Uncomment this version if you want to be more selective:
-- UPDATE users
-- SET
--   subscription_tier = 'free',
--   subscription_expires_at = NULL
-- WHERE
--   subscription_tier IN ('premium', 'pro')
--   AND is_payment = false
--   AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW() - INTERVAL '7 days');
