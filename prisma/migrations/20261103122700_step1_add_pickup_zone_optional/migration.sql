-- Step 1 (Expand): Add defaultPickupZone as an optional (nullable) column
ALTER TABLE "User" ADD COLUMN "defaultPickupZone" TEXT;
