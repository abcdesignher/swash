import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(path.join(ROOT, "package.json"));
const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function main() {
  console.log("=== Swash Session Security: Password Reset Kills All Existing Sessions ===");

  const email = "reset.session.test@swash.ng";
  const initialPassword = "OldPassword2026!";
  const newPassword = "BrandNewSecurePassword2026!";

  const initialHash = await argon2.hash(initialPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: initialHash, deletedAt: null },
    create: {
      fullName: "Password Reset Test User",
      email,
      phone: "08035554433",
      passwordHash: initialHash,
      preferredPlan: "Individual (1–2 people)",
    },
  });

  // Step 1: Sign in on Device 1 (e.g. Chrome on Windows Laptop)
  console.log("\n1. Customer logs in on Device 1 (Windows Laptop):");
  const res1 = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Laptop-Browser/1.0" },
    body: JSON.stringify({ mode: "login", email, password: initialPassword }),
  });
  const cookie1 = res1.headers.get("set-cookie")?.match(/swash_session=([a-f0-9]+);/)?.[1] || "";
  const body1 = await res1.json();
  console.log(`   Device 1 Session ID: ${body1.sessionId}`);

  // Step 2: Sign in on Device 2 (e.g. Safari on iPhone)
  console.log("\n2. Customer logs in on Device 2 (Mobile Smartphone):");
  const res2 = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mobile-Browser/1.0" },
    body: JSON.stringify({ mode: "login", email, password: initialPassword }),
  });
  const cookie2 = res2.headers.get("set-cookie")?.match(/swash_session=([a-f0-9]+);/)?.[1] || "";
  const body2 = await res2.json();
  console.log(`   Device 2 Session ID: ${body2.sessionId}`);

  // Step 3: Verify BOTH sessions are active before reset
  console.log("\n3. Verifying active state before password reset:");
  const test1Before = await fetch("http://localhost:3007/api/auth/me", {
    headers: { Cookie: `swash_session=${cookie1}` },
  });
  const test2Before = await fetch("http://localhost:3007/api/auth/me", {
    headers: { Cookie: `swash_session=${cookie2}` },
  });
  console.log(`   Device 1 GET /api/auth/me: HTTP ${test1Before.status} (Active: ${(await test1Before.json()).authenticated})`);
  console.log(`   Device 2 GET /api/auth/me: HTTP ${test2Before.status} (Active: ${(await test2Before.json()).authenticated})`);

  // Step 4: Device 1 performs password reset
  console.log("\n4. Device 1 triggers POST /api/account/password-reset:");
  const resetRes = await fetch("http://localhost:3007/api/account/password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `swash_session=${cookie1}`,
    },
    body: JSON.stringify({ newPassword }),
  });
  const resetBody = await resetRes.json();
  console.log(`   Reset Status: HTTP ${resetRes.status}`);
  console.log(`   Message: ${resetBody.message}`);
  console.log(`   Revoked Sessions Count: ${resetBody.revokedSessionsCount}`);

  // Step 5: Test Device 2 (Other session)
  console.log("\n5. Testing Device 2 (Other Session) after reset:");
  const test2After = await fetch("http://localhost:3007/api/auth/me", {
    headers: { Cookie: `swash_session=${cookie2}` },
  });
  const body2After = await test2After.json();
  console.log(`   Device 2 GET /api/auth/me: HTTP ${test2After.status}`);
  console.log(`   Device 2 Response Body: ${JSON.stringify(body2After)}`);
  console.log(`   Was Device 2 successfully rejected? ${test2After.status === 401 && !body2After.authenticated ? "YES (KILLED)" : "NO"}`);

  // Step 6: Verify database revokedAt timestamps
  console.log("\n6. PostgreSQL Session Table State:");
  const dbSessions = await prisma.session.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  for (const s of dbSessions) {
    console.log(`   Session ${s.id}: revokedAt = ${s.revokedAt ? s.revokedAt.toISOString() : "NULL (Active)"}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

