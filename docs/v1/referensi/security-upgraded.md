# security-upgraded

🛡️ {{ProjectName}} — Security & Validation Framework (General Template)

---

**File:** `security-upgraded.md`

**Maintainer:** {{SecurityLead}}

**Last Updated:** {{LastUpdatedDate}}

**Applies To:** {{Framework}} + {{Database}} + {{AuthProvider}}

**Aligned With:** OWASP Top 10 (2025), NIST CSF, ISO 27001 Principles

---

## 📘 Executive Summary

Dokumen ini menyajikan **framework keamanan universal** untuk semua produk di bawah {{OrganizationName}}.

Fokusnya pada **defense-in-depth**, **data integrity**, dan **compliance readiness** untuk semua environment (staging → production).

---

## 🔍 Security Stack Overview

| Komponen | Rekomendasi Minimum | Catatan Keamanan |
| --- | --- | --- |
| **Framework** | {{Framework}} v{{FrameworkVersion}}+ | Server Actions aktif, XSS-safe rendering |
| **Database** | {{Database}} v{{DatabaseVersion}}+ | Row-Level Security (RLS) aktif |
| **Auth** | {{AuthProvider}} | JWT secure rotation, RLS sync |
| **Validation** | Dual-layer Zod | Client + Server validation |
| **Rate Limiting** | Edge-compatible (Upstash) | Prevent DDoS |
| **Upload** | Server-side only | Metadata stripping, file content validation |
| **Session** | Secure cookie + rotation | CSRF-safe, replay-protected |

---

## 1️⃣ Dual Validation Framework

> Tujuan: mencegah manipulasi input di client dengan server-side enforcement.
> 

**Client Side:**

```
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '@/shared/schema'

export function FormHandler() {
  const form = useForm({ resolver: zodResolver(formSchema) })
  async function onSubmit(data) {
    await serverAction(data)
  }
}

Server Side:

'use server'
import { formSchema } from '@/shared/schema'

export async function serverAction(raw) {
  const parsed = formSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error }
  // validated → proceed
}

> ✅ Semua aksi penting wajib re-validasi di server.

---

2️⃣ Input Sanitization & Schema Rules

Sanitization Pipeline:

import DOMPurify from 'isomorphic-dompurify'
export function sanitize(str: string) {
  return DOMPurify.sanitize(str.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

Schema Enforcement:

import { z } from 'zod'
export const userSchema = z.object({
  name: z.string().min(3).max(50).transform(sanitize),
  notes: z.string().max(120).optional()
})

File Upload Rule:

Validasi MIME type di server.

Hilangkan metadata (EXIF, ICC, GPS).

Simpan hasil dalam format JPEG normalisasi.

---

3️⃣ XSS / CSRF / SSRF Defense

Middleware Protection:

export async function middleware(request) {
  if (request.method === 'POST') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    if (origin && !origin.includes(host)) return new Response('Forbidden', { status: 403 })
  }
  return NextResponse.next()
}

Security Headers:

response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
response.headers.set('Content-Security-Policy', "default-src 'self'")

> 💡 Pastikan semua endpoint API & Server Actions punya origin whitelist.

---

4️⃣ File Upload Hardening

Server-Only Upload Endpoint

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const buffer = Buffer.from(await file.arrayBuffer())
  const validated = await validateFile(buffer)
  const { processedBuffer, metadata } = await secureProcess(validated)
}

Storage Policy Example (Supabase RLS):

CREATE POLICY "Admin only upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (auth.role() IN ('admin','superadmin'));

> ✅ Semua upload hanya boleh lewat Server Action / Route API.

---

5️⃣ Authentication & Session Security

Secure Session Management

cookieStore.set('secure-session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 604800,
})

Session Rotation Policy

Rotasi token setiap login baru.

Invalidate session lama di logout.

Audit all session creation events.

RLS Enhancements:

CREATE POLICY "Users own data" ON profiles
  USING (id = auth.uid() OR auth.role() IN ('admin','superadmin'));

---

6️⃣ Rate Limiting & Abuse Prevention

Edge-Compatible Implementation:

import { Redis } from '@upstash/redis'
export const rateLimit = async (key, max = 100, window = 60_000) => {
  const redis = new Redis({ url: process.env.UPSTASH_URL!, token: process.env.UPSTASH_TOKEN! })
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, window / 1000)
  return count <= max
}

Per-endpoint config (e.g. /api/login, /api/upload).

Return 429 on exceed.

Include X-RateLimit-* headers for transparency.

---

7️⃣ Audit Log & Monitoring

Audit Schema:

CREATE TABLE audit_logs (
  id bigserial,
  actor uuid,
  action text,
  target text,
  risk_score int,
  created_at timestamptz DEFAULT now()
);

App Integration:

await auditLog({
  actor: user.id,
  action: 'CREATE_PROJECT',
  target: project.id,
  risk_score: 20
})

Alert Rule:

Notify on risk_score ≥ 80.

Daily anomaly report (via email/Discord webhook).

---

8️⃣ Database & RLS Policy Patterns

CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'));
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admin full access" ON public.data
  USING (auth.is_admin());

> ✅ Pastikan setiap tabel aktif RLS dan punya minimal 1 kebijakan akses publik + 1 admin.

---

9️⃣ Penetration & Compliance Checklist

Area	Status	Keterangan

SQL Injection	✅ Mitigated via prepared queries
XSS	🟡 Partial — CSP needs enforcement
CSRF	🟡 Partial — origin validation pending
File Upload	🔒 Hardened server-side only
Auth	🟢 Role & RLS verified
Rate Limit	🔒 Implemented (Edge-ready)
Session	🟢 Secure cookies active

---

🔟 Priority Upgrade Plan

Tahap	Fokus	Target

P0	Dual validation, secure upload, rate limit	2 minggu
P1	CSRF + Session hardening	1 bulan
P2	Audit + Monitoring automation	2 bulan

---

🧠 Security Philosophy

> “Prevention is cheaper than incident response.”
Gunakan 3 prinsip utama:

1. Validate everything, twice.

2. Trust no client.

3. Log every action.

---

Security Lead: {{SecurityLead}}
Next Review: {{NextAuditDate}}
Version: {{SecurityVersion}}

---

{{OrganizationName}} Internal Cybersecurity Playbook ⚙️

---

🔥 Dokumen ini jadi **security master template** — bisa langsung dipakai untuk tiap produk dengan tinggal ganti `{{placeholder}}`.
Mau gue buatin companion `security-checklist.md` (versi mini buat intern / QA, berisi checklist harian implementasi tiap modul)?
```