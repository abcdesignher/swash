# Database Failure & False-Success Analysis

This document explains what happens when the PostgreSQL database connection is unavailable during a `ServiceEnquiry` submission on the Swash home screen, contrasting genuine server-verified persistence against the common "false-success" anti-pattern.

---

## 1. What the User Saw

When the PostgreSQL connection in `.env` (`DATABASE_URL`) was deliberately broken (pointing to an unreachable port) and the user submitted the **Request Service Information** form:

- In a **naive "false-success" frontend** (where the submit handler only clears the form or transitions to a thank-you state after `fetch()` resolves without checking `response.status === 201`, or catches errors silently on the server and returns `200 OK`), the user sees a green confirmation banner claiming their laundry enquiry was saved, and their typed input is wiped.
- In **Swash's verified implementation** (`src/components/EnquiryForm.tsx` paired with `src/app/api/enquiries/route.ts`), the user sees an accessible error alert (`role="alert"`, styled with `--colour-inverse-error-role` and `--colour-on-inverse-error-role`):
  > **Enquiry not saved**
  > We could not save your enquiry right now. Please check your connection and try again.
- Crucially, the form **preserves all of the customer's typed input** (`fullName`, `email`, `serviceType`, `notes`) so a customer on an unstable Nigerian connection does not have to re-type their enquiry.

---

## 2. What the Server Actually Did

1. The Route Handler (`POST /api/enquiries` in `src/app/api/enquiries/route.ts`) parsed the incoming JSON body and validated that `fullName`, `email`, and `serviceType` were non-empty.
2. It invoked `await prisma.serviceEnquiry.create(...)` at `src/app/api/enquiries/route.ts:40`.
3. Because the PostgreSQL database in `.env` was deliberately pointed to unreachable `localhost:59999`, Prisma threw a `PrismaClientInitializationError` (`Can't reach database server at localhost:59999`).
4. The `catch` block logged the complete error to the server console (`[POST /api/enquiries] 500 Database Write Failed:` — captured in `evidence/13-write-failed-logs.txt`, returning `POST /api/enquiries 500 in 6276ms` and `4437ms`) and returned HTTP **`500 Internal Server Error`** with a safe, non-leaking JSON error message (never exposing internal database credentials, connection strings, or stack traces to the browser).

---

## 3. What Happened in the Database

- **Zero rows were created.**
- Inspecting the `ServiceEnquiry` table in Prisma Studio (`http://localhost:5555`) confirmed that the row count remained at `2` (only the two previously verified records `cmw00coua0001kzy4dcyzcibb` and `cmw00ftvp0002kzy4cf96afr5` from `evidence/11-write-succeeded-logs.txt` and `evidence/12-database-rows.png` existed; no new record was inserted during the outage).

---

## 4. How a Reviewer Could Have Been Misled by a False-Success Interface

A reviewer who only tests an application through the browser UI—by filling in a form, clicking submit, and seeing a "Success!" message or a redirect to a confirmation screen—cannot tell whether data actually reached PostgreSQL:

1. **HTTP `fetch()` Does Not Reject on `4xx` or `5xx`:** In browser JavaScript, `await fetch('/api/enquiries', ...)` resolves normally even when the server returns `500 Internal Server Error`. If the client component simply runs `await fetch(...)` and immediately sets `setSubmitted(true)` without checking `response.status === 201` and verifying the returned database record ID, every failed database write appears successful in the UI.
2. **Swallowed Server Exceptions:** If an API route catches a Prisma exception, logs it, and still returns `NextResponse.json({ ok: true })` (HTTP `200`), even `response.ok` passes while the database remains empty.
3. **Operational Impact for Swash:** If a customer submits a laundry pickup or quotation request and sees a false confirmation when the database write actually failed, the customer waits at home expecting a Swash rider who was never scheduled—destroying customer trust immediately.

