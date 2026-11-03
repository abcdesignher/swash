export const DEFAULT_GRACE_PERIOD_DAYS = 14;
export const DEFAULT_GRACE_PERIOD_MS = DEFAULT_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

export interface DeletionJobResult {
  startedAt: string;
  finishedAt: string;
  eligibleCount: number;
  processedCount: number;
  sessionsPurged: number;
  verificationCodesPurged: number;
  emailJobsPurged: number;
  anonymizedUsersCount: number;
  hardDeletedUsersCount: number;
  errors: Array<{ userId: string; error: string }>;
}

let _cachedPrisma: any;
async function resolvePrisma(custom?: any) {
  if (custom) return custom;
  if (_cachedPrisma) return _cachedPrisma;

  try {
    // Under Next.js bundler
    const mod = await import("@/lib/prisma");
    _cachedPrisma = mod.prisma;
    return _cachedPrisma;
  } catch {
    // Under standalone Node ESM runtime
    const { PrismaClient } = await import("@prisma/client");
    _cachedPrisma = new PrismaClient();
    return _cachedPrisma;
  }
}

/**
 * Executes the scheduled account deletion job.
 * Idempotent: Can be run multiple times safely. Running against already-processed
 * accounts produces zero additional destructive operations and zero errors.
 */
export async function runAccountDeletionJob(options?: {
  prismaClient?: any;
  gracePeriodDays?: number;
  targetUserIds?: string[];
}): Promise<DeletionJobResult> {
  const db = await resolvePrisma(options?.prismaClient);
  const startedAt = new Date().toISOString();
  const gracePeriodDays = options?.gracePeriodDays ?? DEFAULT_GRACE_PERIOD_DAYS;
  const cutoffDate = new Date(Date.now() - gracePeriodDays * 24 * 60 * 60 * 1000);

  console.info(`[DELETION-JOB] Starting execution at ${startedAt}`);
  console.info(`[DELETION-JOB] Cutoff threshold: ${cutoffDate.toISOString()} (${gracePeriodDays} days grace period)`);

  // Query eligible users: marked for deletion before the cutoff date
  // or explicitly targeted in testing options
  const eligibleUsers = await db.user.findMany({
    where: {
      deletedAt: options?.targetUserIds
        ? { not: null }
        : { not: null, lte: cutoffDate },
      ...(options?.targetUserIds ? { id: { in: options.targetUserIds } } : {}),
      // Exclude already-anonymized records to guarantee idempotence
      email: {
        not: {
          endsWith: "@deleted.swash.ng",
        },
      },
    },
    include: {
      orders: { select: { id: true } },
      payments: { select: { id: true } },
    },
  });

  const result: DeletionJobResult = {
    startedAt,
    finishedAt: "",
    eligibleCount: eligibleUsers.length,
    processedCount: 0,
    sessionsPurged: 0,
    verificationCodesPurged: 0,
    emailJobsPurged: 0,
    anonymizedUsersCount: 0,
    hardDeletedUsersCount: 0,
    errors: [],
  };

  console.info(`[DELETION-JOB] Found ${eligibleUsers.length} eligible account(s) pending purge.`);

  for (const user of eligibleUsers) {
    try {
      await db.$transaction(async (tx: any) => {
        // 1. Purge transient authentication records
        const sessions = await tx.session.deleteMany({
          where: { userId: user.id },
        });
        result.sessionsPurged += sessions.count;

        const codes = await tx.verificationCode.deleteMany({
          where: { userId: user.id },
        });
        result.verificationCodesPurged += codes.count;

        const emailJobs = await tx.emailJob.deleteMany({
          where: { userId: user.id },
        });
        result.emailJobsPurged += emailJobs.count;

        // 2. Anonymize or Hard Delete based on financial & order retention needs
        // If user has historical financial payments or completed laundry orders,
        // NDPA 2023 & Nigerian financial record-keeping laws require retaining
        // financial accounting ledger entries while stripping all Personally Identifiable Information (PII).
        const hasFinancialHistory = user.orders.length > 0 || user.payments.length > 0;

        if (hasFinancialHistory) {
          // Retain order ledger row for tax audit, but strip PII
          await tx.user.update({
            where: { id: user.id },
            data: {
              fullName: `Deleted Customer ${user.id.substring(0, 8)}`,
              email: `deleted_${user.id}@deleted.swash.ng`,
              phone: "00000000000",
              passwordHash: "DELETED_ACCOUNT_DISABLED_HASH",
              defaultPickupZone: "Anonymized Zone",
            },
          });
          result.anonymizedUsersCount += 1;
        } else {
          // If no financial or operational dependencies exist, hard delete user row completely
          await tx.user.delete({
            where: { id: user.id },
          });
          result.hardDeletedUsersCount += 1;
        }

        result.processedCount += 1;
      });

      console.info(`[DELETION-JOB] Successfully purged user ${user.id}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[DELETION-JOB] Failed to purge user ${user.id}:`, errorMsg);
      result.errors.push({ userId: user.id, error: errorMsg });
    }
  }

  result.finishedAt = new Date().toISOString();
  console.info(`[DELETION-JOB] Finished at ${result.finishedAt}. Processed: ${result.processedCount}, Errors: ${result.errors.length}`);

  return result;
}
