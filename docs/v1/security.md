# security

🛡️ {{ProjectName}} — Panduan Keamanan & Validasi Sistem

---

> Dokumen ini menjabarkan standar keamanan teknis, validasi data, dan kebijakan akses sistem
> 
> 
> untuk setiap proyek di bawah {{OrganizationName}}.
> 
> Format disusun agar bisa diterapkan pada sistem berbasis {{Framework}} dengan {{AuthSystem}} dan database {{Database}}.
> 

---

## 1️⃣ Prinsip Umum Keamanan

Semua sistem dikembangkan berdasarkan prinsip **“Security by Design”** dan **“Least Privilege Access”**.

**Tujuan utama keamanan proyek:**

1. Menjaga data pengguna dan aset organisasi.
2. Mencegah penyalahgunaan API dan akses ilegal.
3. Menjamin audit trail dan integritas setiap aktivitas.
4. Meningkatkan keandalan sistem tanpa menghambat user experience.

> Keamanan bukan fitur tambahan — tapi fondasi utama.
> 

---

## 2️⃣ Validasi Dua Lapis (Client & Server)

Setiap data harus diverifikasi di **dua sisi**:

| Lapisan | Implementasi | Library / Contoh |
| --- | --- | --- |
| **Client** | Validasi form, sanitasi input | Zod / Yup / custom schema |
| **Server** | Validasi ulang payload & parameter | Zod + Middleware (server-side) |

💡 **Catatan:**

Tidak ada input yang boleh langsung dikirim ke database tanpa melalui validator.

Gunakan pola *“Trust nothing, verify everything.”*

---

## 3️⃣ Sanitasi & Proteksi Input

- Escape semua karakter berisiko (`, <, >, &`) dari input text.
- Gunakan **DOMPurify / sanitize-html** untuk konten rich text.
- Hindari eval() dan dynamic script injection di client.
- Nonaktifkan HTML parsing pada markdown editor jika tidak dibutuhkan.

🧪 **Contoh (Next.js API Route):**

```
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  message: z.string().max(500),
});

export async function POST(req: Request) {
  const data = await req.json();
  const validated = bodySchema.parse(data);
  // lanjutkan ke logic...
}

---

4️⃣ Perlindungan XSS, CSRF, SSRF

Ancaman	Pencegahan	Catatan

XSS	Escape output, gunakan sanitizer, Content Security Policy	Jangan pakai dangerouslySetInnerHTML tanpa alasan kuat
CSRF	Token CSRF di setiap form action	Gunakan cookie SameSite=Strict
SSRF	Validasi URL & whitelist domain API eksternal	Hindari request dari user input langsung

---

5️⃣ Upload & Data Security

Aspek	Aturan	Tools / Contoh

File Upload	Batasi MIME type, rename dengan hash (SHA256)	Supabase Storage / Firebase Storage
Ukuran Maksimum	≤ 5MB kecuali media resmi	Validasi di client + server
Metadata	Hapus EXIF data (foto/video)	exifcleaner / sharp
Akses File	Private bucket, akses melalui signed URL	Role-based token guard

📎 Path rekomendasi: /storage/{{ProjectName}}/uploads/private/

---

6️⃣ Autentikasi & Role Guard

Semua endpoint wajib dilindungi oleh middleware autentikasi.

Gunakan JWT atau session cookie terenkripsi.

Role minimum: guest, user, staff, admin, superadmin.

Contoh Role Logic:

if (user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}

📌 File Referensi:
/docs/v1/referensi/auth-role-guard.md

---

7️⃣ Rate Limiting & Anti-Abuse

Terapkan rate limit untuk endpoint publik:
contoh: 100 requests / 10 minutes / IP.

Gunakan Redis atau Edge Function untuk caching request.

Tambahkan honeypot / invisible reCAPTCHA untuk form publik.

Catat semua event “too many requests” dalam errorlog/.

---

8️⃣ Audit Log & Aktivitas Pengguna

Aktivitas	Dicatat Dalam	Format

Login / Logout	audit_log table	timestamp, user_id, IP
Create / Update / Delete data	activity_log table	user_id, action, target, payload hash
Error sistem & exception	/docs/v1/dokumentasi/errorlog/	file log harian

💡 Gunakan UUID v7 untuk identifikasi event unik.

---

9️⃣ Database & Row-Level Security (RLS)

Jika menggunakan {{Database}} (misal: Supabase / PostgreSQL):

Aktifkan RLS (Row Level Security) untuk semua tabel berisi data sensitif.

Gunakan Policy Condition berbasis auth.uid():

create policy "User can view own data"
on public.profiles
for select
using (auth.uid() = id);

Hindari query langsung tanpa parameter binding (where id = ${input} ❌).

Gunakan ORM atau prepared statement untuk semua query.

---

🔟 Monitoring & Alert

Gunakan tool observasi dan logging seperti:

Sentry untuk error tracking (frontend & backend).

PostHog / LogRocket untuk user session replay.

UptimeRobot / Cronitor untuk healthcheck & cron monitoring.

🔔 Kirim alert otomatis ke Slack / Discord bila ada anomali besar (HTTP 500 spike, login gagal massal, dll).

---

11️⃣ Testing & Security Automation

Jenis Uji	Tools	Frekuensi

Unit Test	Vitest / Jest	Setiap push
Integration Test	Postman / Newman	Weekly
Pentest / Vulnerability Scan	OWASP ZAP / Burp Suite	Per kuartal
Backup & Restore Simulation	Supabase / Firebase CLI	Bulanan

📎 Simpan laporan di /docs/v1/dokumentasi/security_test/.

---

12️⃣ Future Upgrade Checklist

✅ Enkripsi sisi client (AES-256 untuk data sensitif).
✅ Implementasi WebAuthn / Passkey login.
✅ Integrasi IAM (Identity Access Management).
✅ Log audit ke BigQuery / SIEM untuk analisis jangka panjang.
✅ Penambahan “Security Score” otomatis di dashboard admin.

---

13️⃣ Kesimpulan

Keamanan bukan hanya tanggung jawab tim dev — tapi seluruh tim proyek.
Setiap fitur baru harus melewati evaluasi keamanan minimal level 1 (validasi, autentikasi, rate limit).

📍 Penanggung Jawab Keamanan: {{SecurityLead}}
📅 Terakhir Diperbarui: {{LastUpdatedDate}}

> “Build fast, but secure.”
— {{OrganizationName}} Security Playbook 🛡️

---

```