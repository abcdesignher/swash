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
  console.log("=== Swash Step 10: Role-Based Access Control (RBAC) Verification ===");

  const plainPassword = "StaffPassword2026!";
  const hash = await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  // 1. Provision Ordinary Customer (Role: CUSTOMER)
  const customer = await prisma.user.upsert({
    where: { email: "ordinary.customer@swash.ng" },
    update: { passwordHash: hash, role: "CUSTOMER", deletedAt: null },
    create: {
      fullName: "Ordinary Customer User",
      email: "ordinary.customer@swash.ng",
      phone: "08031118899",
      passwordHash: hash,
      role: "CUSTOMER",
      preferredPlan: "Individual (1–2 people)",
    },
  });

  // 2. Provision Staff Administrator (Role: ADMIN)
  const admin = await prisma.user.upsert({
    where: { email: "admin.operations@swash.ng" },
    update: { passwordHash: hash, role: "ADMIN", deletedAt: null },
    create: {
      fullName: "Chinedu Admin",
      email: "admin.operations@swash.ng",
      phone: "08039990011",
      passwordHash: hash,
      role: "ADMIN",
      preferredPlan: "Enterprise",
    },
  });

  console.log(`Customer: ID=${customer.id}, Role=${customer.role}`);
  console.log(`Admin: ID=${admin.id}, Role=${admin.role}`);

  // 3. Log in Customer to get Customer Session Token
  const resCust = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "login", email: customer.email, password: plainPassword }),
  });
  const cookieCust = resCust.headers.get("set-cookie")?.match(/swash_session=([a-f0-9]+);/)?.[1] || "";

  // 4. Log in Admin to get Admin Session Token
  const resAdmin = await fetch("http://localhost:3007/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "login", email: admin.email, password: plainPassword }),
  });
  const cookieAdmin = resAdmin.headers.get("set-cookie")?.match(/swash_session=([a-f0-9]+);/)?.[1] || "";

  // 5. TEST 1: Ordinary Customer attempts to invoke Admin Action (POST /api/admin/run-deletion-job)
  console.log("\n--- Test 1: Customer Direct Request to Admin Action (POST /api/admin/run-deletion-job) ---");
  const custActionRes = await fetch("http://localhost:3007/api/admin/run-deletion-job", {
    method: "POST",
    headers: { Cookie: `swash_session=${cookieCust}` },
  });
  console.log(`HTTP Status: ${custActionRes.status}`);
  const custActionBody = await custActionRes.json();
  console.log(`Response Body: ${JSON.stringify(custActionBody)}`);
  console.log(`Was Customer Refused with HTTP 403? ${custActionRes.status === 403 ? "VERIFIED (TRUE)" : "FAILED"}`);

  // 6. TEST 2: Ordinary Customer attempts to access /admin page
  console.log("\n--- Test 2: Customer Navigates to /admin Page (Copied Link Test) ---");
  const custPageRes = await fetch("http://localhost:3007/admin", {
    headers: { Cookie: `swash_session=${cookieCust}` },
  });
  console.log(`HTTP Status: ${custPageRes.status}`);
  const custPageHtml = await custPageRes.text();
  const containsAccessRefused = custPageHtml.includes("Access Refused") || custPageHtml.includes("403 Forbidden");
  console.log(`Does Page Content Display 403 Access Refused? ${containsAccessRefused ? "VERIFIED (TRUE)" : "FAILED"}`);

  // 7. TEST 3: Authorized Admin accesses /admin page and action
  console.log("\n--- Test 3: Authorized Admin executes Admin Action ---");
  const adminActionRes = await fetch("http://localhost:3007/api/admin/run-deletion-job", {
    method: "POST",
    headers: { Cookie: `swash_session=${cookieAdmin}` },
  });
  console.log(`HTTP Status: ${adminActionRes.status}`);
  const adminActionBody = await adminActionRes.json();
  console.log(`Admin Response Body: ${JSON.stringify(adminActionBody)}`);
  console.log(`Was Admin Authorized (HTTP 200)? ${adminActionRes.status === 200 ? "VERIFIED (TRUE)" : "FAILED"}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

