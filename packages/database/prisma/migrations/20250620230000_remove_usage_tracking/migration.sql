-- Drop usage tracking tables
DROP TABLE IF EXISTS "UsageAnalytics";
DROP TABLE IF EXISTS "UsageMetrics";
DROP TABLE IF EXISTS "ExtensionSession";

-- Remove any usage tracking columns from User table if they exist
-- (These might not exist if already cleaned up)
ALTER TABLE "User" DROP COLUMN IF EXISTS "sessionToken";
ALTER TABLE "User" DROP COLUMN IF EXISTS "cubentUnits";
