# workflow_admin-upgraded

⚙️ {{ProjectName}} — Admin Workflow & CMS Configuration (Upgraded, General Template)

---

**Filename:** `workflow_admin-upgraded.md`

**Date:** {{YYYY-MM-DD}}

**Applies to:** Next.js {{NextVersion}} (App Router) + {{Database}} (Postgres/Supabase) + {{AuthProvider}}

**Owner:** {{AdminLead}} (PM/OPS), {{TechLead}} (Engineering)

**Status:** Draft / Adopted / In-Production

> Dokumen “upgraded” ini memvalidasi arsitektur Admin CMS & Booking/Content Management, plus rekomendasi peningkatan untuk keamanan, performa, dan maintainability di environment production.
> 

---

## 0) Executive Summary

- **Goal:** Admin Panel yang aman, cepat, dan mudah dirawat untuk {{ProjectName}} (ekosistem {{OrganizationName}}).
- **Pendekatan:** Hybrid **Server Actions (CRUD)** + **Route Handlers (external/analytics)**, **RLS** menyeluruh, **rate-limit tiered**, **audit log**, **secure file upload**, **realtime authorized**, **tiered caching**, dan **CI/CD** yang ketat.
- **Prioritas Upgrade:**
    1. **P0:** Security foundation (RLS, audit, rate-limit, secure upload)
    2. **P1:** CRUD via Server Actions + cache revalidation
    3. **P2:** Analytics via Route Handlers + dashboard
    4. **P3:** UX & ops enhancements (bulk ops, autosave, mobile)

---

## 1) Admin Access Architecture

### 1.1 Secret Path & Middleware Guard

- Admin login path rahasia: `{{ADMIN_LOGIN_PATH}}` (default: `/xadmin`)
- Semua route admin dilindungi middleware + RBAC + rate-limit.

**Checklist**

- [ ]  `middleware.ts` memeriksa path admin, token, role, dan origin
- [ ]  Rate-limit login: max 5 attempts / 15m / IP (1h block)
- [ ]  Header keamanan: `X-Frame-Options=DENY`, `X-Content-Type-Options=nosniff`, `Referrer-Policy=strict-origin-when-cross-origin`

### 1.2 Role & Session

- Role minimal: `user`, `staff`, `admin`, `superadmin`
- Session pakai **HttpOnly secure cookies**, rotasi token saat login baru
- Enforce RLS untuk semua query, sinkron dengan claim role

---

## 2) CRUD Strategy — Server Actions vs Route Handlers (Hybrid)

| Use Case | Pilihan | Alasan |
| --- | --- | --- |
| CRUD internal admin (form) | **Server Actions** | CSRF-safe, no HTTP overhead, type-safe end-to-end, revalidate otomatis |
| Public/external API & analytics | **Route Handlers** | Kontrol caching lebih kaya, akses eksternal, dukung berbagai method |

**Guideline**

- Server Actions: `app/(admin)/…/actions.ts`
- Route Handlers: `app/api/admin/*` (auth API-level, cache/tag)

---

## 3) Navigation & Modules (IA)

| Modul | Fungsi | Role |
| --- | --- | --- |
| **Dashboard** | KPI, log terbaru, health | Admin, Superadmin |
| **Users** | CRUD, verifikasi, role mgmt | Staff, Admin |
| **Content/Posts** | Draft/Review/Publish, moderation | Moderator, Admin |
| **Projects/Events** | Detail, kuota, status | Admin, Superadmin |
| **Bookings/Orders** | Approve/Reject, refund | Admin, Superadmin |
| **Finance** | Invoice, rekonsiliasi, export | Finance, Superadmin |
| **Settings** | Brand, CMS, email, system flags | Admin, Superadmin |
| **Logs/Reports** | Audit, export CSV | Superadmin |

---

## 4) State Machine (Booking/Approval)

| Event | Guard | Transition |
| --- | --- | --- |
| Create HOLD | poolLeft>0 & capacityLeft>0 | → `HOLD` |
| Submit Proof/Form | state=`HOLD` & TTL aktif | → `REVIEW` |
| Approve (Admin) | state=`REVIEW` | → `PAID` |
| Reject (Admin) | state=`REVIEW` | → `REJECTED` |
| TTL Expire | state=`HOLD` & expired | → `EXPIRED` |

> TTL HOLD default 10–15 menit. Kapasitas menghitung REVIEW + PAID.
> 

---

## 5) Database & RLS (Production Patterns)

**Rekomendasi**

- Aktifkan **RLS** pada semua tabel sensitif
- Tipe enum `user_role` (`user`, `staff`, `admin`, `superadmin`)
- Index untuk query kritikal (state/created_at, status/starts_at, admin_id/created_at)
- **Audit log** tabel terpisah + indeks waktu

**Policies (contoh)**

- `profiles`: user hanya baca miliknya; admin bisa baca semua
- `audit_logs`: hanya admin/superadmin yang bisa select
- `settings`: admin only (ALL)

---

## 6) Settings Architecture (Hybrid)

**Prinsip**

- **Key-Value (category)** untuk setting granular & performa query
- **JSON structured** untuk konfigurasi kompleks (brand/cms blocks)
- **Cache** per kategori (1–5 menit) + tag revalidation (`revalidateTag('settings')`)
- **Snapshot** saat perubahan penting (brand/cms)

**Kategori umum:** `brand`, `contact`, `cms`, `email`, `system`

---

## 7) Secure File Upload (Server-Side Only)

**Aturan**

- Endpoint **server-only** (`app/api/admin/upload/route.ts`)
- Validasi **content-type dari buffer** (bukan hanya file extension)
- Batas ukuran: `image ≤5MB`, `document ≤10MB`, `logo ≤2MB`
- **EXIF stripping** & resize (Sharp) → output JPEG/WebP
- **Supabase Storage** dengan **RLS**: insert hanya admin; public read opsional via bucket terpisah

---

## 8) Realtime (Authorized Channels)

- Gunakan private channel per admin: `admin-{adminId}`
- Set auth token untuk **RLS di Realtime**
- Throttle events: `eventsPerSecond`
- Use-case: notifikasi `booking:REVIEW`, moderation queue, live ops

---

## 9) Rate Limiting & Anti-Abuse (Tiered)

| Target | Limit | Window | Block |
| --- | --- | --- | --- |
| Admin Login | 5 req | 15m | 1h |
| Admin API | 100 req | 1m | — |
| Bulk Ops | 10 req | 5m | — |
- Identifikasi via IP (`x-forwarded-for`) + optional userId
- Return `429` + `Retry-After` header
- Log percobaan brute-force ke audit/security log

---

## 10) Caching & Revalidation

- **Tag-based**: `events`, `bookings`, `settings`, `analytics`
- **Tiering**:
    - Settings: 1h
    - Events: 5m
    - Bookings: 30s
    - Analytics: 15m
- `revalidateTag()` / `revalidatePath()` di Server Actions setelah mutasi

---

## 11) Observability & Audit

- **Sentry** (frontend+backend), **PostHog** (journey), **UptimeRobot/Cronitor** (health)
- **Audit logs**: `admin_id`, `action`, `target_type/id`, `details`, `ip`, `user_agent`, `created_at`
- Alert rules: error rate > 1% (10 menit), abnormal login fail, lonjakan `EXPIRED/HOLD`

> Lihat observability.md untuk taxonomy metrics & incident flow.
> 

---

## 12) Security Hardening (Ringkasan)

- Dual validation (Zod) — client & server
- CSRF/Origin check untuk POST; cookie `SameSite=Lax`
- CSP minimal: `default-src 'self'` (+ allowlist)
- Session rotation & logout invalidation
- `.env` validation (`envSchema.parse(process.env)`)
- **No client-side upload to storage**
- **No direct DB query tanpa prepared/ORM**
- Pentest berkala (OWASP ZAP / Burp), backup & restore drill bulanan

---

## 13) Performance & Bundle Strategy

- Dynamic import untuk modul berat (Analytics, Booking Manager)
- Edge deployment (region: `sin1` primer; `hnd1`, `syd1` sekunder)
- CDN caching: pages `ttl=1h, swr=24h`; assets `ttl=1y` (immutable)
- Core Web Vitals ≥ 90 (Lighthouse AA)

---

## 14) CI/CD Notes (ringkas)

- GitHub Actions: `test` → `security-scan` → `lighthouse` → `deploy`
- Branching: `feature/*` → `develop` (staging) → `main` (prod)
- Tag rilis: `v{{Version}}`
- Migration gate: DB push + typegen sebelum deploy
- Slack/Discord notifier on success/failure

---

## 15) Admin UI Patterns (Shadcn + Tailwind)

- Button variants: `primary | secondary | ghost | destructive`
- Table: sortable, filter, export CSV
- Form: `react-hook-form` + `zodResolver` + toasts
- Modal: confirm destructive ops (double confirm)
- Realtime indicator (connected / degraded)
- Mobile support (≤768px): nav compress + essential ops only

---

## 16) Implementation Checklist (by Phase)

### Phase P0 — Security Foundation

- [ ]  Middleware admin + secret path + headers
- [ ]  RLS aktif di semua tabel sensitif
- [ ]  Audit log & security event logging
- [ ]  Rate-limit login & admin API
- [ ]  Server-side upload + EXIF stripping

### Phase P1 — Core CRUD & Cache

- [ ]  CRUD via Server Actions (events/posts/bookings)
- [ ]  Tag revalidation di semua mutasi
- [ ]  Settings hybrid + cache per kategori
- [ ]  Realtime authorized channel (review queue)

### Phase P2 — Analytics & Ops

- [ ]  Route handler analytics + cache 5–15 menit
- [ ]  Export CSV + bulk operation safe-guard
- [ ]  Dashboard: KPI, error panel, health widget

### Phase P3 — UX & Maintainability

- [ ]  Auto-save setting (debounced)
- [ ]  Advanced filtering & saved views
- [ ]  Mobile polish & skeleton loading

---

## 17) Reference Snippets (Template)

### 17.1 Middleware (ringkas)

// middleware.ts (ringkas; isi detail sesuai repo)
export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] }

17.2 Server Action — Create

'use server'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'
const schema = z.object({ title: z.string().min(3), status: z.enum(['DRAFT','PUBLISHED']) })
export async function createItem(fd: FormData) {
  const data = schema.parse({ title: fd.get('title'), status: fd.get('status') })
  await db.items.insert(data) // via service role on server
  revalidateTag('items')
}

17.3 Route Handler — Analytics

export async function GET(req: Request) {
  // requireAdminApi(req) ...
  const data = await getAnalytics({ range: '7d' })
  return Response.json({ success: true, data }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' } })
}

17.4 Upload Guard (server)

// Validate mimetype from buffer, resize with Sharp, upload to Storage (RLS bucket)

---

18) Environment & Config Keys (ringkas)

ADMIN_LOGIN_PATH=/xadmin

NEXT_PUBLIC_APP_ENV=development|staging|production

SUPABASE_SERVICE_ROLE_KEY (server only)

NEXT_PUBLIC_SUPABASE_ANON_KEY (public)

NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_POSTHOG_KEY

UPSTASH_REDIS_* (opsional untuk rate-limit edge)

> Validasi semua var di startup melalui envSchema.

---

19) Governance

Area	PIC	Cadence

Security (RLS/Rate-limit/Audit)	{{SecurityLead}}	Bulanan (P0)
Performance & Caching	{{TechLead}}	Bulanan
UX & Ops	{{PM/OPS}}	6 mingguan
Docs Review	{{DocsOwner}}	Kuartalan

---

20) Final Notes

Principle: “Secure by default, fast by design, observable always.”

Setiap perubahan arsitektur admin wajib disertai update dokumen ini & PR checklist.