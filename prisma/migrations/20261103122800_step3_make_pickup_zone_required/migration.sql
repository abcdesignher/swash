-- Step 3 (Contract): Make defaultPickupZone required now that all existing rows are populated
ALTER TABLE "User" ALTER COLUMN "defaultPickupZone" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "defaultPickupZone" SET DEFAULT 'Lagos Mainland';
