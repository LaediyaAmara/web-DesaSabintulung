# Untitled

{{ProjectName}} — Thema & Visual System

---

> Panduan identitas visual, komponen UI, dan perilaku responsif untuk seluruh aset digital {{ProjectName}} di bawah {{OrganizationName}}.
> 
> 
> Tujuan: konsistensi brand, kemudahan implementasi, dan aksesibilitas.
> 

---

## 1) Identitas & Karakter

- **Konsep inti:** {{Concept}} ← (mis. “modern-minimal, cinematic scroll, campus-friendly”)
- **Moodboard kata kunci:** {{Mood1}}, {{Mood2}}, {{Mood3}}
- **Gaya:** {{Style}} ← (mis. clean, kinetic, high-contrast)
- **Tone komunikasi:** {{BrandTone}} ← (formal santai / gen-z profesional)

---

## 2) Skema Warna (Light & Dark)

| Mode | Primary | Secondary | Accent | Background | Surface | Success | Warning | Danger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Light** | {{#PrimaryLight}} | {{#SecondaryLight}} | {{#AccentLight}} | {{#BgLight}} | {{#SurfaceLight}} | {{#SuccessLight}} | {{#WarnLight}} | {{#DangerLight}} |
| **Dark** | {{#PrimaryDark}} | {{#SecondaryDark}} | {{#AccentDark}} | {{#BgDark}} | {{#SurfaceDark}} | {{#SuccessDark}} | {{#WarnDark}} | {{#DangerDark}} |
- **Gradasi utama:** {{GradientSpec}} (contoh: 90deg primary → accent).
- **State warna:**
    - Hover: +4% brightness
    - Active: −6% brightness
    - Disabled: opacity 0.4

---

## 3) Tipografi

| Elemen | Font | Berat | Desktop | Mobile | Catatan |
| --- | --- | --- | --- | --- | --- |
| Heading H1 | {{HeadingFont}} | 600–700 | 48–64px | clamp(28px, 6vw, 36px) | Tight leading |
| Heading H2 | {{HeadingFont}} | 600 | 32–40px | 22–26px | — |
| Body | {{BodyFont}} | 400–500 | 16–18px | 15–16px | line-height 1.6 |
| Caption/Meta | {{BodyFont}} | 400 | 12–14px | 12–14px | letter-spacing +0.2px |
- **Font loading:** `font-display: swap`
- **Bahasa:** dukung Latin & Indonesian ligatures

---

## 4) Layout & Grid Responsif

**Desktop**

- Max width: **1440px** (content: 1200px)
- Grid: **12 kolom**, gutter 24px
- Section padding: `px-12` (desktop), `px-6` (tablet)

**Mobile**

- Grid: **1 kolom penuh**
- Safe area padding: `px-4`
- Komponen **carousel** → 1 item/slide (swipe)

---

## 5) Spacing, Radius, Elevation

- **Spacing scale (rem):** `2 4 6 8 12 16 24 32 48 64`
- **Radius:** `sm 8px · md 12px · lg 16px · xl 24px · 2xl 32px (card)`
- **Shadow/Elevation:**
    - *low:* `0 1px 2px rgba(0,0,0,.06)`
    - *mid:* `0 6px 20px rgba(0,0,0,.10)`
    - *high:* `0 12px 40px rgba(0,0,0,.14)`

---

## 6) Komponen (Tailwind + shadcn/ui)

**Button**

- Variants: `primary | secondary | ghost | link`
- Shape: `rounded-2xl`, padding `px-5 py-3`
- Hover: subtle glow; Active: pressed −2px; Focus: ring 2px accent

**Card**

- Radius `rounded-card`, padding `p-6 lg:p-8`, shadow `mid`, surface memakai token `-surface`

**Input / Field**

- Border `1px` neutral/20; Focus ring `accent`; Error ring `danger`

**Modal/Dialog**

- Backdrop blur `backdrop-blur-xl`, border subtle, close area 44–48px (tap target)

**Navigation**

- Desktop: top bar sticky (shadow low)
- Mobile: bottom nav optional (5 ikon max)

Tambahkan komponen lain: Tabs, Tooltip, Dropdown, Breadcrumb, Toast (konsisten token).

---

## 7) State, Interaksi, & Motion

- **Easing standar:** `cubic-bezier(0.16,1,0.3,1)`
- **Durasi:** 150–300ms (UI), 400–700ms (transisi scene)
- **Scroll motion:** aktif untuk desktop; **reduced** 50% di mobile
- **Prefers-reduced-motion:** nonaktifkan animasi berat otomatis
- **Micro-interaction:** hover lift (1–2px), shadow shift kecil

---

## 8) Aksesibilitas (WCAG 2.1 AA)

- Kontras teks ≥ 4.5:1
- Fokus ring visible di semua kontrol
- Tap area min. 44×44px
- Alt text deskriptif pada media
- Avoid “motion-only” cues; sediakan fallback

---

## 9) Token Design (CSS Variables)

:root {
  --color-primary: {{#PrimaryLight}};
  --color-secondary: {{#SecondaryLight}};
  --color-accent: {{#AccentLight}};
  --color-bg: {{#BgLight}};
  --color-surface: {{#SurfaceLight}};
  --radius-card: 1.25rem;
  --easing: cubic-bezier(0.16,1,0.3,1);
  --shadow-mid: 0 6px 20px rgba(0,0,0,.10);
}

[data-theme="dark"]{
  --color-primary: {{#PrimaryDark}};
  --color-secondary: {{#SecondaryDark}};
  --color-accent: {{#AccentDark}};
  --color-bg: {{#BgDark}};
  --color-surface: {{#SurfaceDark}};
}

---

10) Tailwind Config (extend)

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
      boxShadow: {
        mid: 'var(--shadow-mid)',
      },
      transitionTimingFunction: {
        brand: 'var(--easing)',
      },
    }
  }
}

---

11) Ikon, Ilustrasi, & Gambar

Ikon: {{IconSet}} (mis. lucide) — ukuran 18/20/24, stroke 1.5–2

Ilustrasi: gaya {{IllustrationStyle}} (flat/3D)

Foto: tone {{PhotoTone}}; gunakan kompresi modern (WebP/AVIF)

---

12) Aset Brand & Loading

Favicon: {{FaviconSpec}}

Loading screen: {{LoadingSpec}} (mis. progress bar / scene line)

Scroll indicator: progress ring/line opsional di kanan viewport

---

13) Halaman Kunci & Pattern

Hero: full-bleed, headline 6–10 kata, CTA ganda (primary/secondary)

List/Grid: 3–4 kolom desktop, 1–2 kolom mobile

Detail Page: header visual + metadata + body readable

Form: label di atas, help text kecil, error jelas

Empty State: ilustrasi kecil + CTA

---

14) Contoh Implementasi (Snippet)

// Button (shadcn) – variant primary
<Button className="rounded-2xl bg-primary text-white hover:brightness-105 focus:ring-2 focus:ring-accent transition-[transform,filter] duration-200 ease-brand">
  {{PrimaryCTA}}
</Button>

---

15) Pengujian Visual

Checklist sebelum rilis:

[ ] Kontras teks lolos AA

[ ] Responsive desktop → mobile

[ ] Motion aman untuk prefers-reduced-motion

[ ] Komponen utama konsisten (Button, Card, Input, Modal)

[ ] Dark mode tidak “pecah” tokennya

---

16) Catatan Implementasi

UI Kit: shadcn/ui (Radix)

Motion: Framer Motion / GSAP (pilih salah satu dominan)

Font import: @next/font/google / self-hosted

Theme Provider: gunakan context untuk toggle light/dark

---

17) Revisi & Versi

Versi saat ini: {{Version}}

Tanggal: {{YYYY-MM-DD}}

Penanggung jawab: {{DesignOwner}} / {{FrontendOwner}}

Semua perubahan tema dicatat di /docs/v1/dokumentasi/revision/