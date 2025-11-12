# workflow_client-upgraded

🧩 {{ProjectName}} — Client Workflow (Upgraded, General Template)

---

**Filename:** `workflow_client-upgraded.md`

**Version:** {{Version}}

**Date:** {{YYYY-MM-DD}}

**Applies to:** Next.js {{NextVersion}} (App Router) + {{DatabaseProvider}} (e.g. Supabase)

**Owner:** {{TechLead}} / {{PM}}

**Status:** In-Production / Review

---

## ⚙️ 0. Executive Summary

Client workflow mendefinisikan seluruh alur pengguna (guest-first flow) dari **event selection → booking → proof upload → confirmation**, dengan fokus pada:

- **Reliabilitas sistem (secure by default)**
- **UX ringkas dan modern**
- **Edge compatibility**
- **Scalable architecture untuk multi-brand**

---

## 1️⃣ System Overview

| Layer | Stack / Tools | Keterangan |
| --- | --- | --- |
| **Frontend** | Next.js App Router + React 19 | SPA + Hybrid SSR/ISR |
| **Backend API** | Server Actions + Route Handlers | Authenticated & Stateless |
| **Database** | Supabase / PostgreSQL | Managed, RLS-enabled |
| **Storage** | Supabase Storage / Cloudinary | Secure uploads via server |
| **Validation** | Zod + React Hook Form | Client–server parity |
| **Rate Limiting** | Local memory / Upstash Redis | Per-IP / Endpoint |
| **Monitoring** | Sentry + PostHog + Cronitor | Error, UX & uptime visibility |

---

## 2️⃣ Core Booking Flow

graph TD
A[Event Page] --> B[Hold Booking]
B --> C[Upload Payment Proof]
C --> D[Review Queue]
D --> E[Admin Approval]
E --> F[QR Ticket Issued]

State	Transition Trigger	Next State

HOLD	User initiates booking	REVIEW
REVIEW	Proof validated	PAID
PAID	Ticket issued	COMPLETED
HOLD Expired	TTL 15m	EXPIRED

---

3️⃣ API Architecture

Endpoint	Method	Description

/api/bookings/hold	POST	Buat booking sementara (HOLD)
/api/bookings/:id/proof	POST	Upload bukti pembayaran
/api/bookings/:code/status	GET	Ambil status & waktu kedaluwarsa
/api/verify/qr	POST	Verifikasi QR tiket
/api/capacity/:eventId	GET	Ambil kapasitas & snapshot terkini

> Semua endpoint wajib stateless, validasi pakai Zod, dan respon JSON standar.

---

4️⃣ Server-Side File Upload

Implementasi di App Router (route handler)

Validasi mime, size, dan buffer → Sharp + file-type

Upload ke Supabase Storage: folder proof/

Setelah sukses → update booking state REVIEW

Rollback upload jika DB update gagal

if (uploadError) rollbackUpload()
if (updateError) rollbackUpload()

Bucket Policy

Server-only insert (via service role)

Public read optional (untuk admin-only bucket)

Prevent public write access

---

5️⃣ Rate Limiting

Endpoint	Limit	Window	Error

/bookings/hold	5 req / 15m	per IP	429
/bookings/proof	3 req / 15m	per IP	429
/api/*	100 req / min	general	429

Implementation

rateLimit(request, { maxRequests: 5, windowMs: 900000 })

> In-memory untuk dev, gunakan Upstash/Redis di production.

---

6️⃣ Validation Schema (Zod + RHF)

Client Form

const bookingSchema = z.object({
  name: z.string().min(3).regex(/^[a-zA-Z\\s.']+$/),
  wa: z.string().optional(),
  notes: z.string().max(120).optional()
})

Server Validation

const holdSchema = z.object({
  eventId: z.string(),
  name: z.string().min(3),
  qty: z.number().min(1).max(1)
})

> Gunakan shared validation schema antara client & server untuk consistency.

---

7️⃣ Client UX Enhancements

Progress ring sinkron dengan server time offset

Debounced autosave form (500ms)

X-Server-Time header untuk sync countdown

Placeholder + skeleton loading

WhatsApp auto-normalizer (+62 format)

Reduced motion support untuk aksesibilitas

---

8️⃣ Security & Data Protection

Area	Implementasi	Detail

Upload	Server-only	EXIF stripping, hash deduplication
QR Ticket	HMAC SHA256	Payload signature verifikasi
Session	HttpOnly cookies	Non-persistent, rotated
Rate Limit	Per IP	Prevent abuse & spam
RLS	Database-level	Booking ownership enforced
Audit	Table audit_logs	Insert on critical events

QR Example

const sig = crypto.createHmac('sha256', QR_SECRET)
  .update(payload)
  .digest('base64')

---

9️⃣ Database Functions (Core RPC)

a. Capacity Snapshot

SELECT capacity_left, hold_pool_left FROM get_capacity_snapshot(:event_id)

b. Expire Holds

UPDATE bookings SET state='EXPIRED'
WHERE state='HOLD' AND hold_expires_at <= NOW()

> Jalankan otomatis via cron setiap 10 menit.

---

🔟 Monitoring & Observability

Sentry → Error tracking (frontend/backend)

PostHog → Funnel, retention, rage click analysis

UptimeRobot / Cronitor → Endpoint health /healthz

Log retention: 14 hari

Metric sample rate: 1.0

---

11️⃣ Accessibility Checklist

Item	Status

ARIA labels on all inputs	✅
Focus trap in modals	✅
Reduced motion compliance	✅
Keyboard navigation (Tab/Enter)	✅
High contrast mode	✅

---

12️⃣ Performance Optimization

Edge caching (pages: 5m, assets: 1y)

Use noStore() on dynamic data routes

Image optimization for upload previews

Hydration performance < 3s

Lighthouse ≥ 90 semua kategori

---

13️⃣ Migration Guidelines

Phase	Fokus	Deliverables

P0	Security Foundation	RLS, rate-limit, file validation
P1	UX & Server Time Sync	Modern form + countdown
P2	Monitoring & A11y	Metrics, reduced motion
P3	Optimization	Edge runtime, caching, async ops

---

14️⃣ Testing Scope

Test Type	Fokus

Unit	Zod validation, name masking, QR HMAC
Integration	Proof upload, HOLD → REVIEW flow
E2E	Event booking → payment → QR issuance
Performance	Load test (100 concurrent bookings)

---

15️⃣ Environment Variables

NEXT_PUBLIC_APP_ENV=development
SUPABASE_URL=https://{{project-id}}.supabase.co
SUPABASE_SERVICE_ROLE_KEY={{secret}}
QR_SECRET={{hmac-key}}

> Semua variabel tervalidasi lewat envSchema.parse(process.env).

---

16️⃣ Governance

Area	Owner	Review Cadence

Security (RLS, Upload, Rate-Limit)	{{SecurityLead}}	Monthly
UX & Accessibility	{{DesignLead}}	Bi-Monthly
Database & Capacity	{{DevOpsLead}}	Weekly
Docs & Testing	{{QA/DocsOwner}}	Quarterly

---

🪶 Closing Statement

> “A good user flow feels invisible — frictionless, secure, and reliable.”
— {{OrganizationName}} Product Engineering Team

📅 Last Updated: {{LastUpdatedDate}}
👨‍💻 Maintainer: {{TechLead}}
🧠 Version: {{Version}}