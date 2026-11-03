import nodemailer, { type TransportOptions, type Transporter } from "nodemailer";
import { prisma } from "@/lib/prisma";

export interface EmailRenderOptions {
  fullName: string;
  code: string;
  expiryMinutes?: number;
}

/**
 * Render Swash verification email using approved design tokens:
 * - Primary Brand Deep Violet: #1d064a / #350078
 * - Secondary Gold: #cc9842
 * - Neutral Background: #faf8fd
 * - Surface Card: #ffffff
 * - Font: Open Sans, system fallback
 */
export function renderVerificationEmailHtml(options: EmailRenderOptions): string {
  const { fullName, code, expiryMinutes = 15 } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Swash email address</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #faf8fd;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1d064a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #faf8fd;
      padding: 32px 16px;
    }
    .card {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      border: 1px solid #e9ddff;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(29, 6, 74, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #1d064a 0%, #350078 100%);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 6px 0 0 0;
      color: #e9ddff;
      font-size: 14px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 20px;
      color: #1d064a;
    }
    .code-box {
      margin: 28px 0;
      padding: 20px;
      background-color: #f5eeff;
      border: 2px dashed #7044c0;
      border-radius: 8px;
      text-align: center;
    }
    .code-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: #4517a7;
      margin-bottom: 8px;
    }
    .code-digits {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #1d064a;
      user-select: all;
    }
    .info-list {
      margin: 24px 0;
      padding-left: 20px;
      font-size: 14px;
      line-height: 22px;
      color: #452717;
    }
    .info-list li {
      margin-bottom: 8px;
    }
    .footer {
      border-top: 1px solid #e9ddff;
      padding: 24px 32px;
      font-size: 12px;
      line-height: 18px;
      color: #7b4926;
      background-color: #faf8fd;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Swash</h1>
        <p>Premium Laundry & Dry Cleaning Across Lagos</p>
      </div>
      <div class="content">
        <div class="greeting">
          Hello <strong>${fullName}</strong>,
        </div>
        <p style="font-size: 15px; line-height: 22px; margin: 0 0 16px 0;">
          Thank you for joining Swash. Please enter the unique verification code below to verify your email address and activate your laundry subscription account:
        </p>

        <div class="code-box">
          <div class="code-label">Your Unique Verification Code</div>
          <div class="code-digits">${code}</div>
        </div>

        <ul class="info-list">
          <li>This code is valid for <strong>${expiryMinutes} minutes</strong>.</li>
          <li>For your security, you have up to 5 attempts to enter the correct code.</li>
          <li>Never share this code. Swash dispatch riders and staff will never ask for your verification code.</li>
        </ul>

        <p style="font-size: 13px; line-height: 20px; color: #603a23; margin-top: 24px;">
          If you did not sign up for a Swash account, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Swash Laundry Technologies Ltd. Lagos, Nigeria.<br>
        This is an automated transactional security notification.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Configure Nodemailer transport.
 * Reads environment variables if configured, or falls back to test configuration.
 */
export function getMailTransport(customConfig?: TransportOptions) {
  if (customConfig) {
    return nodemailer.createTransport(customConfig);
  }

  // Fallback to configured SMTP environment or ethereal/test
  const host = process.env.SMTP_HOST || "localhost";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user ? { user, pass } : undefined,
  });
}

/**
 * Synchronous direct email delivery (used for Step 10 performance comparison).
 */
export async function sendEmailDirect(
  transporter: Transporter,
  to: string,
  subject: string,
  html: string,
) {
  return await transporter.sendMail({
    from: '"Swash Security" <no-reply@swash.com.ng>',
    to,
    subject,
    html,
  });
}

/**
 * Background Email Queue: Inserts job record into PostgreSQL `EmailJob` table.
 * Takes < 2ms without delaying HTTP request response!
 */
export async function queueEmailJob(params: {
  userId?: string;
  toEmail: string;
  subject: string;
  templateType: string;
  payloadJson: string;
}) {
  return await prisma.emailJob.create({
    data: {
      userId: params.userId,
      toEmail: params.toEmail,
      subject: params.subject,
      templateType: params.templateType,
      payloadJson: params.payloadJson,
      status: "PENDING",
    },
  });
}

/**
 * Worker process to deliver pending jobs from EmailJob table.
 */
export async function processPendingEmailJobs(transporter: Transporter) {
  const pending = await prisma.emailJob.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const results = [];
  for (const job of pending) {
    try {
      const payload = JSON.parse(job.payloadJson);
      const html = renderVerificationEmailHtml({
        fullName: payload.fullName || "Customer",
        code: payload.code,
      });

      const info = await sendEmailDirect(transporter, job.toEmail, job.subject, html);

      await prisma.emailJob.update({
        where: { id: job.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          attempts: { increment: 1 },
        },
      });

      results.push({ id: job.id, status: "SENT", messageId: info.messageId });
    } catch (err: any) {
      await prisma.emailJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          lastError: err?.message || String(err),
          attempts: { increment: 1 },
        },
      });
      results.push({ id: job.id, status: "FAILED", error: err?.message });
    }
  }

  return results;
}

