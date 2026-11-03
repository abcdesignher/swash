# Task 04 — Step 3: Database Migrations & Schema Drift (`docs/migrations.md`)

## 1. Forward-Only Migrations

In Swash, database schema changes follow a **forward-only migration discipline**:
- Every change to `prisma/schema.prisma` is captured as a timestamped, immutable SQL migration directory inside [`prisma/migrations/`](../../prisma/migrations/) (for example, `20261103122500_task04_core_schema`, `20261103122700_step1_add_pickup_zone_optional`, `20261103122800_step3_make_pickup_zone_required`).
- Instead of running destructive `down` scripts or `prisma migrate reset` in shared or production environments (which would destroy customer orders, subscription allowances, and settled payment ledgers), mistakes or schema evolutions are corrected by writing a **new forward migration** (or using the 3-step **Expand → Backfill → Contract** pattern demonstrated in [`evidence/05-required-column-three-steps.txt`](../evidence/05-required-column-three-steps.txt)).

---

## 2. Why an Applied Migration Should Never Be Edited

Once a migration has been applied to a database, Prisma records its directory name and the **SHA-256 checksum** of its `migration.sql` file in the PostgreSQL `_prisma_migrations` table:

1. **Checksum Mismatch & Deployment Failure:**
   - If a developer edits `20261103122500_task04_core_schema/migration.sql` after it has already been executed, the file's SHA-256 checksum no longer matches the checksum stored in `_prisma_migrations`, causing Prisma to halt future migrations.
2. **Environment Divergence (Silent Schema Drift):**
   - Databases that already ran the original version of `migration.sql` will **not** re-run the edited file, whereas newly provisioned environments (such as a new developer machine, staging, or a disaster-recovery replica) will run the modified file. The two databases will now have different schemas while claiming to be at the same migration version.

---

## 3. Generating a Prisma Client (`prisma generate`) vs. Applying a Migration (`prisma migrate`)

| Operation | Command | What It Changes | Does It Touch PostgreSQL? |
|---|---|---|---|
| **Generate Prisma Client** | `npx prisma generate` | Reads `prisma/schema.prisma` and regenerates the TypeScript types and query builder inside `node_modules/.prisma/client`. | **No.** It makes zero changes to the PostgreSQL database tables or columns. |
| **Apply Database Migration** | `npx prisma migrate deploy` (or `migrate dev`) | Executes pending `migration.sql` DDL statements (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`) against PostgreSQL and records them in `_prisma_migrations`. | **Yes.** It alters the actual tables, columns, constraints, and indexes in PostgreSQL. |

As demonstrated in [`evidence/06-drift-error.txt`](../evidence/06-drift-error.txt), running `npx prisma generate` after adding `unmigratedLoyaltyTier` to `prisma/schema.prisma` **without** applying a migration caused the TypeScript code to compile cleanly while throwing `PrismaClientKnownRequestError [P2022]: The column public.User.unmigratedLoyaltyTier does not exist in the current database` at runtime.

---

## 4. Why Migrations Require Controlled Execution

Database migrations execute Data Definition Language (`DDL`) directly against persistent customer and financial state:
1. **Data Loss & Corruption Risk:** Dropping a column, narrowing a data type, or resetting a schema irreversibly destroys data that cannot be recovered by rolling back application code.
2. **Populated-Table Constraints (`23502`):** As proven in [`evidence/04-required-column-failure.txt`](../evidence/04-required-column-failure.txt), adding a `NOT NULL` column without a default (`ALTER TABLE "User" ADD COLUMN "defaultPickupZone" TEXT NOT NULL`) succeeds on an empty table in local testing but fails immediately (`ERROR: column "defaultPickupZone" of relation "User" contains null values`) when run against a populated database.
3. **Table Locking & Zero-Downtime Sequencing:** Multi-step changes must follow **Expand (add nullable column) → Backfill (populate existing rows) → Contract (set `NOT NULL`)** so live requests continue succeeding during deployment.

---

## 5. The Operational Cost of Manual Migration Approval

Requiring human review and explicit manual approval before executing any database migration ([`data-and-security.md`](../../.agent/rules/data-and-security.md)) introduces a deliberate operational trade-off:

- **Costs:**
  - **Slower Iteration Speed:** Automated coding agents and CI/CD pipelines must pause and wait for a human engineer to inspect the generated `migration.sql` before proceeding.
  - **Coordination Overhead:** Multi-step migrations (like the 3-step Expand → Backfill → Contract resolution in Step 3C) require explicit review gates between schema changes and application code deployments.
- **Why the Cost Is Justified for Swash:**
  - A single unapproved `prisma migrate reset` or destructive `ALTER TABLE ... DROP COLUMN` would wipe out Nigerian customers' active laundry subscription allowances, pickup schedules, and confirmed payment receipts—violating Swash's non-negotiable core principle of accurate, connected customer records.

