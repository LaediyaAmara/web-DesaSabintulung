# brand-style

🎨 {{ProjectName}} — Brand & Visual Identity System (General Template)

---

> Dokumen ini menjabarkan panduan identitas visual, tone komunikasi, dan prinsip desain {{ProjectName}} di bawah {{OrganizationName}}.
> 
> 
> Tujuan: menciptakan **konsistensi brand**, **aksesibilitas visual**, dan **kekuatan emosional** lintas platform.
> 

---

## 1️⃣ Brand Foundation

| Elemen | Deskripsi |
| --- | --- |
| **Brand Personality** | {{Personality}} (misal: modern, humanis, berjiwa muda, profesional) |
| **Target Audience** | {{Audience}} (misal: pelajar, kreator digital, profesional muda) |
| **Core Values** | {{Values}} (simplicity, collaboration, empowerment, growth) |
| **Tone of Voice** | Friendly, jelas, inspiratif, dengan keseimbangan formal-casual |
| **Brand Promise** | "{{Promise}}" (contoh: “Menghubungkan potensi, membangun masa depan.”) |

---

## 2️⃣ Color System

### a. Primary Palette

:root {
  --primary-50: {{#Primary50}};
  --primary-100: {{#Primary100}};
  --primary-200: {{#Primary200}};
  --primary-300: {{#Primary300}};
  --primary-400: {{#Primary400}};
  --primary-500: {{#Primary500}}; /* main brand color */
  --primary-600: {{#Primary600}};
  --primary-700: {{#Primary700}};
  --primary-800: {{#Primary800}};
  --primary-900: {{#Primary900}};
}

b. Secondary & Accent Colors

:root {
  --secondary-500: {{#Secondary}};
  --accent-500: {{#Accent}};
  --neutral-50: #fafafa;
  --neutral-900: #171717;
}

c. Semantic Colors

:root {
  --success-500: #22c55e;
  --warning-500: #eab308;
  --error-500: #ef4444;
  --info-500: #3b82f6;
}

> 🎯 Prinsip warna: kontras tinggi, emosional kuat, tapi tetap ramah mata.

---

3️⃣ Typography System

a. Font Family

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Cal Sans', 'Poppins', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

b. Font Hierarchy

Level	Font	Weight	Ukuran	Line Height	Penggunaan

Hero Display	Display	800	64px	72px	Headline utama
H1	Display	600	48px	56px	Judul halaman
H2	Sans	600	32px	40px	Subjudul
Body Large	Sans	400	18px	28px	Deskripsi penting
Body Regular	Sans	400	16px	24px	Konten umum
Small / Caption	Sans	400	14px	20px	Meta text, label kecil

---

4️⃣ Spacing & Layout

a. Base Unit

:root {
  --spacing-unit: 0.25rem; /* 4px */
}

b. Scale

Label	px	Rem	Fungsi

xxs	2px	0.125	Fine details
xs	4px	0.25	Compact spacing
sm	8px	0.5	Elemen kecil
md	12px	0.75	Default padding
lg	16px	1	Standar antar-komponen
xl	24px	1.5	Section
2xl	32px	2	Hero & block spacing

---

5️⃣ Component Patterns

a. Button

<Button variant="primary" size="lg">
  Mulai Sekarang
</Button>

Variant	Warna	Tujuan

primary	Warna utama brand	CTA utama
secondary	Warna netral/outline	Aksi sekunder
ghost	Transparan	Link interaktif
danger	Merah	Aksi destruktif

b. Card

<Card>
  <CardHeader title="Artikel Unggulan" />
  <CardContent>
    <p>Insight terbaru dari komunitas kami.</p>
  </CardContent>
</Card>

> Semua komponen wajib menggunakan radius & shadow sesuai token tema.

---

6️⃣ Animation & Motion

a. Timing & Curve

:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

Jenis	Durasi	Contoh

Micro	100ms	Hover button
Quick	200ms	Dropdown
Smooth	300ms	Modal fade
Hero	600ms	Page transition

> ✨ Gunakan motion untuk feel alive, bukan distraksi.

---

7️⃣ Mobile-First & Responsive Rules

Breakpoint	Range	Target Device

xs	0–640px	Phones
sm	640–768px	Phablet / Small tablet
md	768–1024px	Tablet
lg	1024–1280px	Desktop
xl	1280px+	Large screen

Prinsip:

Prioritaskan konten utama di atas fold.

Tap target minimal 44×44px.

Gunakan padding fleksibel (clamp(16px, 4vw, 48px)).

---

8️⃣ Accessibility & Inclusivity

Kriteria	Standar

Kontras Teks	Minimal 4.5:1 (WCAG AA)
Font Size	16px minimum untuk body
Navigasi Keyboard	Fokus jelas, logical order
Bahasa	Bahasa Indonesia & English
Alt Text	Wajib untuk semua gambar
Reduced Motion	Hormati prefers-reduced-motion

> ♿ Brand ramah semua pengguna, bukan hanya yang melihat.

---

9️⃣ Cultural Localization (Indonesia)

Warna dan tone mencerminkan kehangatan & optimisme Asia Tenggara.

Hindari imagery politik, agama, atau stereotip budaya.

Dukung UI bilingual (Bahasa Indonesia & English).

Gunakan ilustrasi dengan karakter inklusif (gender-neutral & diverse).

---

🔟 Theme System Example

export const themes = {
  default: {
    name: 'Default Light',
    primary: '#1C7ED6',
    background: '#FFFFFF',
    buttonStyle: 'rounded',
    fontFamily: 'Inter',
  },
  dark: {
    name: 'Midnight Mode',
    primary: '#3BC47F',
    background: '#0B132B',
    buttonStyle: 'pill',
    fontFamily: 'Inter',
  },
  creative: {
    name: 'Creative Pop',
    primary: '#8B5CF6',
    background: 'linear-gradient(135deg, #F0E9FF 0%, #E9D5FF 100%)',
    buttonStyle: 'neon',
    fontFamily: 'Poppins',
  }
}

---

11️⃣ Asset & Delivery

Format: SVG preferred, PNG fallback.

Logo minimal 2 varian (horizontal + stacked).

Favicon versi light/dark.

Semua file vector disimpan di /assets/brand/.

Ukuran minimum logo: 64×64px (favicon), 320×80px (header).

---

12️⃣ Governance

Area	Tanggung Jawab	Frekuensi Review

Warna & Typography	Design Lead	6 bulan
Komponen UI	Frontend Lead	3 bulan
Brand Messaging	Marketing / Content	6 bulan
Aksesibilitas	QA / Designer	3 bulan

---

13️⃣ Brand Integrity Rules

✅ Selalu gunakan warna & font sesuai panduan.
✅ Pastikan kontras warna sesuai WCAG.
❌ Jangan ubah proporsi logo.
❌ Jangan campur dua tema dalam satu layout.
❌ Hindari tone komunikasi yang sarkastik atau tidak inklusif.

---

🪶 Closing Statement

> “Consistency isn’t limitation — it’s how identity stays remembered.”
— {{OrganizationName}} Design System Playbook 🎨

📅 Last Updated: {{LastUpdatedDate}}
👩‍🎨 Designer / Owner: {{DesignLead}}
🧠 Version: {{Version}}