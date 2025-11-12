# workflow_client

👥 {{ProjectName}} — Workflow Client / User Flow (General Template)

---

> Dokumen ini menjelaskan alur UX, validasi, dan kontrak API untuk sisi pengguna (client) pada proyek {{ProjectName}} di bawah {{OrganizationName}}.
> 
> 
> Fokus: modular, DB-agnostic, scalable, dan siap diintegrasikan ke berbagai sistem pembayaran, autentikasi, atau layanan eksternal.
> 

---

## 0️⃣ Terminologi & Status Dasar

| Status | Deskripsi |
| --- | --- |
| **HOLD** | Proses awal, data pengguna terkunci sementara (timer aktif). |
| **REVIEW** | Pengguna telah mengirim bukti atau menyelesaikan aksi, menunggu verifikasi. |
| **APPROVED / PAID** | Status final sukses; pengguna menerima output (tiket, akses, sertifikat, dll). |
| **REJECTED** | Data tidak valid; pengguna perlu mengulang proses. |
| **EXPIRED** | Waktu HOLD habis sebelum pengguna menyelesaikan langkah berikut. |

> Aturan utama: Semua aksi sensitif hanya valid selama status HOLD masih aktif.
> 

---

## 1️⃣ Alur UX (Client Journey)

### 1. Landing / List View

- Tampilkan daftar item/kegiatan dengan ringkasan: judul, tanggal, lokasi, harga/status.
- Gunakan infinite scroll atau pagination.
- CTA: **Lihat Detail / Apply / Join Now**.

### 2. Detail View

- Deskripsi lengkap + badge status.
- Indikator ketersediaan (slot, waktu, kuota).
- Tombol CTA aktif hanya jika status **OPEN** dan masih tersedia kapasitas.
- Shareable URL: `https://{{domain}}/x/{slug}-{shortId}` (gunakan shortId unik untuk resolve cepat).

### 3. Formulir / Booking Sheet

- Field dasar: Nama (≥3 karakter), Kontak (WA/email, optional), Catatan (max 120 karakter).
- Validasi realtime di UI (counter, mask, error message).
- Saat “Lanjut”, sistem membuat **HOLD (TTL = 10–15 menit)** dan redirect ke langkah berikut.

### 4. Pembayaran / Submission Step

- Jika manual: tampilkan instruksi (QRIS / Bank / Upload File).
- Jika otomatis: redirect ke gateway (Midtrans/Xendit/Stripe).
- Countdown HOLD realtime (sinkron dengan server offset).
- Setelah aksi selesai → ubah status jadi **REVIEW**.

### 5. Status Page / Confirmation

- Badge besar menampilkan status (`REVIEW / PAID / REJECTED / EXPIRED`).
- Untuk **PAID/APPROVED**: tampilkan **QR / Ticket / Certificate**.
- Sediakan **Add to Calendar** & **Download PDF Summary**.
- URL shareable, status real-time via polling atau SSE.

---

## 2️⃣ Validasi Input

| Field | Aturan | Catatan |
| --- | --- | --- |
| **Nama** | Minimal 3 karakter, huruf & spasi | Masking untuk publik: `a***r` |
| **Kontak (WA/Email)** | Opsional, tetapi wajib format valid | WA prefix tetap `+62`, hapus `0` awal |
| **Catatan** | Maks 120 karakter | Ditampilkan ringkas (ellipsis) |
| **Upload File (opsional)** | JPG/PNG/PDF ≤10 MB | Validasi server-side mimetype & ukuran |

---

## 3️⃣ Kebijakan Kapasitas / Kuota

- Hitungan kapasitas = jumlah pengguna dengan status **REVIEW** + **PAID/APPROVED**.
- HOLD memiliki pool sendiri (maks 30% dari total kapasitas).
- Jika pool penuh → tampilkan pesan *“Antrean penuh, coba beberapa saat lagi.”*
- Detail tetap bisa dibuka meski **CLOSED**, tapi tombol aksi nonaktif dengan alasan jelas.

---

## 4️⃣ Data Model (General ERD)

| Entity | Kolom Penting | Catatan |
| --- | --- | --- |
| **Item/Event** | id, slug, title, date, capacity, price, status | Bisa berupa event, kelas, produk, dll |
| **Booking** | id, itemId, name, contact, amount, state, proofUrl, holdExpiresAt | State machine utama |
| **PaymentMethod** | id, type, accountNo, displayName, qrisUrl | Konfigurasi admin |
| **ProofMeta** | mime, size, hash, uploadedAt | Untuk validasi & audit |

> Semua waktu disimpan dalam UTC, UI konversi ke zona lokal (misal WIB).
> 

---

## 5️⃣ Kontrak API (App Router)

### Public

- `GET /api/items` — daftar item.
- `GET /api/items/:id` — detail + kapasitas terkini.

### Booking

- `POST /api/bookings/hold` → buat HOLD (cek kuota & kapasitas).
- `POST /api/bookings/:id/select-method` → pilih metode pembayaran/submission.
- `POST /api/bookings/:id/proof` → upload bukti atau form tambahan.
- `GET /api/bookings/:code` → ambil status (Status Page).

> Gunakan Idempotency-Key di setiap POST sensitif dan rate-limit request per IP.
> 

---

## 6️⃣ Perhitungan Kapasitas (tanpa cache wajib)

paid = count(state=PAID) review = count(state=REVIEW) holdActive = count(state=HOLD and now<holdExpiresAt)

capacityUsed = paid + review capacityLeft = capacity - capacityUsed holdPoolLeft = floor(capacity*0.3) - holdActive

> Cache opsional (TTL 15–30s). Prioritaskan correctness over speed.
> 

---

## 7️⃣ State Machine (Umum)

| Event | Guard | Transition |
| --- | --- | --- |
| Create HOLD | holdPoolLeft>0 & capacityLeft>0 | → HOLD |
| Submit Proof / Form | state=HOLD & now<holdExpiresAt | → REVIEW |
| Approve (admin) | state=REVIEW | → PAID |
| Reject (admin) | state=REVIEW | → REJECTED |
| Expire TTL | state=HOLD & now≥holdExpiresAt | → EXPIRED |

---

## 8️⃣ UI Components (Client)

| Komponen | Deskripsi |
| --- | --- |
| **Card/List** | Daftar item dengan CTA |
| **Detail View** | Info lengkap + tombol aksi |
| **Form Sheet** | Input nama, kontak, catatan |
| **Payment Panel** | Countdown, metode, instruksi |
| **Uploader** | Preview + progress + submit |
| **Status View** | Badge status + QR/ICS |

> Gunakan shadcn/ui + Framer Motion untuk interaksi halus dan responsif.
> 

---

## 9️⃣ Observability & Metrics

- **Log** setiap perubahan status (bookingCode, itemId, ipHash).
- **Metrics utama:**
    - `holds_created`, `holds_expired`, `proofs_uploaded`, `approval_rate`.
- **Alert:** lonjakan reject/expired, kapasitas tidak sinkron, error upload.
- Gunakan Sentry / LogRocket / PostHog.

---

## 🔟 Integrasi & Future Upgrade

| Fitur | Tujuan | Catatan |
| --- | --- | --- |
| **Login (optional)** | Identifikasi user | `FEATURE_REQUIRE_LOGIN` toggle |
| **Payment Gateway** | Otomatisasi transaksi | Gantikan upload manual |
| **Multi-ticket** | Izinkan qty > 1 | Perlu tabel child detail |
| **Notif Gateway** | Email/WA webhook | Integrasi Twilio/Meta |
| **Auto Approve** | Webhook success | State: PENDING → PAID |

---

## 11️⃣ Validasi, Security, & Aksesibilitas

- Semua payload diverifikasi via **Zod / Joi**.
- CSRF token di semua form non-idempotent.
- Upload disanitasi dan di-hash.
- Jalankan cron expiry tiap 1–2 menit untuk membersihkan HOLD.
- Fokus ring aktif, reduced-motion fallback di UI.

---

## 12️⃣ Checklist Implementasi

1. Halaman list & detail item.
2. Form → `POST /hold` → redirect.
3. Panel pembayaran/submission + countdown.
4. Upload bukti / form data → status “REVIEW”.
5. Status view dinamis dengan polling / SSE.
6. Scheduler expiry & notifikasi otomatis.
7. Logging & metrics terintegrasi.

---

## 13️⃣ ENV & Konfigurasi

- `NEXT_PUBLIC_TZ={{DefaultTimeZone}}`
- `DATABASE_URL=...`
- `STORAGE_PROVIDER={{StorageService}}`
- `PAYMENT_MODE=manual|gateway`
- `FEATURE_REQUIRE_LOGIN=true|false`

---

## 14️⃣ Catatan Akhir

Sistem user-flow {{ProjectName}} harus menjaga keseimbangan antara **UX cepat** dan **integritas data tinggi**.

Semua status harus tercatat, setiap aksi harus idempotent, dan setiap interaksi harus bisa diaudit.

📅 **Terakhir Diperbarui:** {{LastUpdatedDate}}

📍 **Penanggung Jawab UX:** {{ClientLead}}

> “Experience isn’t just what users see — it’s how seamlessly the system holds its promise.”
> 
> 
> *— {{OrganizationName}} UX Playbook* ✨
> 

---