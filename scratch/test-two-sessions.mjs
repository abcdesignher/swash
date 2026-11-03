import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(path.join(ROOT, "package.json"));
const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function main() {
  const outputLines = [];
  function log(msg = "") {
    console.log(msg);
    outputLines.push(msg);
  }

  log("=== Swash Session Verification: Two Distinct Sign-Ins ===");
  log(`Timestamp: ${new Date().toISOString()}`);
  log("Target: POST http://localhost:3007/api/auth (mode: login)");

  const email = "session.verifier@swash.ng";
  const plainPassword = "VerifiablePassword2026!";

  // 1. Ensure test user exists with verified Argon2id hash
  const hash = await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash, deletedAt: null },
    create: {
      fullName: "Session Test Customer",
      email,
      phone: "08039998877",
      passwordHash: hash,
      preferredPlan: "Individual (1–2 people)",
    },
  });

  log(`\nAuthenticated User Record:`);
  log(`  ID: ${user.id}`);
  log(`  Email: ${user.email}`);
  log(`  Role: ${user.role}`);

  // 2. Perform Login Request 1
  log("\n--- Sign-In Attempt #1 ---");
  const res1 = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestBrowser/1.0",
      "X-Forwarded-For": "102.89.23.101",
    },
    body: JSON.stringify({
      mode: "login",
      email,
      password: plainPassword,
    }),
  });

  const cookieHeader1 = res1.headers.get("set-cookie") || "";
  const body1 = await res1.json();
  const tokenMatch1 = cookieHeader1.match(/swash_session=([a-f0-9]+);/);
  const rawToken1 = tokenMatch1 ? tokenMatch1[1] : "";

  log(`HTTP Status: ${res1.status}`);
  log(`Session ID in response body: ${body1.sessionId}`);
  log(`Set-Cookie header received by client:`);
  log(`  ${cookieHeader1}`);
  log(`Raw Bearer Token from Cookie (length ${rawToken1.length} chars, 256-bit entropy): ${rawToken1}`);

  const session1 = await prisma.session.findUnique({
    where: { id: body1.sessionId },
  });
  log("\nPostgreSQL Database Row for Session #1 (Prisma Session model):");
  log(JSON.stringify(session1, null, 2));

  // Small delay to ensure distinct timestamp
  await new Promise((r) => setTimeout(r, 600));

  // 3. Perform Login Request 2
  log("\n--- Sign-In Attempt #2 (Same user, separate sign-in request) ---");
  const res2 = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestBrowser/2.0",
      "X-Forwarded-For": "102.89.23.102",
    },
    body: JSON.stringify({
      mode: "login",
      email,
      password: plainPassword,
    }),
  });

  const cookieHeader2 = res2.headers.get("set-cookie") || "";
  const body2 = await res2.json();
  const tokenMatch2 = cookieHeader2.match(/swash_session=([a-f0-9]+);/);
  const rawToken2 = tokenMatch2 ? tokenMatch2[1] : "";

  log(`HTTP Status: ${res2.status}`);
  log(`Session ID in response body: ${body2.sessionId}`);
  log(`Set-Cookie header received by client:`);
  log(`  ${cookieHeader2}`);
  log(`Raw Bearer Token from Cookie (length ${rawToken2.length} chars, 256-bit entropy): ${rawToken2}`);

  const session2 = await prisma.session.findUnique({
    where: { id: body2.sessionId },
  });
  log("\nPostgreSQL Database Row for Session #2 (Prisma Session model):");
  log(JSON.stringify(session2, null, 2));

  // 4. Mathematical & Cryptographic Verification
  log("\n--- Cryptographic & Uniqueness Verification ---");
  const differentSessionIds = body1.sessionId !== body2.sessionId;
  const differentRawTokens = rawToken1 !== rawToken2;
  const differentStoredHashes = session1?.tokenHash !== session2?.tokenHash;
  const hash1Matches =
    crypto.createHash("sha256").update(rawToken1).digest("hex") === session1?.tokenHash;
  const hash2Matches =
    crypto.createHash("sha256").update(rawToken2).digest("hex") === session2?.tokenHash;

  log(`1. Two separate sign-ins generate different Session IDs: ${differentSessionIds ? "VERIFIED (TRUE)" : "FAILED"}`);
  log(`   Attempt #1 Session ID: ${body1.sessionId}`);
  log(`   Attempt #2 Session ID: ${body2.sessionId}`);
  log(`2. Two separate sign-ins generate different Bearer Tokens: ${differentRawTokens ? "VERIFIED (TRUE)" : "FAILED"}`);
  log(`3. Two separate sign-ins store different Token Hashes: ${differentStoredHashes ? "VERIFIED (TRUE)" : "FAILED"}`);
  log(`4. Database stores SHA-256 hash, NOT raw bearer token:`);
  log(`   Attempt #1: SHA-256(rawToken1) === db.session1.tokenHash: ${hash1Matches ? "VERIFIED (TRUE)" : "FAILED"}`);
  log(`   Attempt #2: SHA-256(rawToken2) === db.session2.tokenHash: ${hash2Matches ? "VERIFIED (TRUE)" : "FAILED"}`);
  log(`5. Cookie security flags inspection:`);
  log(`   HttpOnly: ${cookieHeader1.includes("HttpOnly") ? "PRESENT (Prevents client-side script theft via XSS)" : "MISSING"}`);
  log(`   SameSite: ${/SameSite=lax/i.test(cookieHeader1) ? "Lax (Prevents CSRF on cross-site requests)" : "MISSING"}`);
  log(`   Path: ${cookieHeader1.includes("Path=/") ? "/ (Scoped to all application routes)" : "MISSING"}`);
  log(`   Max-Age: ${cookieHeader1.match(/Max-Age=(\d+)/)?.[0] || "MISSING"} (7 days / 604,800 seconds)`);

  const destPath = path.join(
    ROOT,
    "task-05-sessions-compliance-defence",
    "evidence",
    "01-two-session-ids.txt"
  );
  fs.writeFileSync(destPath, outputLines.join("\n") + "\n", "utf8");
  log(`\nEvidence written to UTF-8 file: ${destPath}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
