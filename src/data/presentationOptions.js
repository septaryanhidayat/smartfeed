/**
 * Magic Prompt Presentasi PPT (Beta) Options & Presets
 * Berdasarkan prinsip-prinsip desain presentasi terbaik:
 * 1. Satu Slide Satu Pesan
 * 2. Prinsip 5-5-5 (Maksimal 5 baris, 5 kata/baris)
 * 3. Struktur Logis (Opening, Problem, Solution, Evidence, CTA)
 * 4. Data & Bukti Terukur
 * 5. Visual Berkualitas & High Contrast
 */

export const PRESENTATION_TYPES = [
  'Pitching ke Investor',
  'Presentasi ke Klien',
  'Edukasi / Workshop',
  'Training Internal',
  'Seminar / Konferensi',
  'Laporan Performa Bisnis',
  'Proposal Proyek',
  'Webinar Online',
];

export const PRESENTATION_SLIDE_OPTIONS = [
  { value: 6, label: '5-7 slide (ringkas)' },
  { value: 10, label: '10-12 slide (standar)' },
  { value: 16, label: '15-20 slide (detail)' },
  { value: 24, label: '20-30 slide (komprehensif)' },
];

export const PRESENTATION_DURATIONS = [
  '5-10 menit',
  '10-15 menit',
  '20-30 menit',
  '45-60 menit',
  '90 menit+',
];

export const PRESENTATION_LANGUAGES = [
  'Indonesia',
  'Inggris',
  'Bilingual',
];

export const PRESENTATION_DESIGN_STYLES = [
  { id: 'profesional_minimalis', label: 'Profesional & Minimalis', color: 'Navy + Gold' },
  { id: 'modern_bold', label: 'Modern & Bold', color: 'Sapphire + Coral' },
  { id: 'startup_inovatif', label: 'Startup Inovatif', color: 'Dark Tech + Emerald Neon' },
  { id: 'korporat_formal', label: 'Korporat Formal', color: 'Slate Grey + Deep Blue' },
  { id: 'kreatif_playful', label: 'Kreatif & Playful', color: 'Pastel + Vibrant Purple' },
  { id: 'dark_elegan', label: 'Dark & Elegan', color: 'Obsidian + Warm Amber' },
  { id: 'clean_edukatif', label: 'Clean & Edukatif', color: 'Teal + White Minimal' },
];

export const PRESENTATION_VISUAL_ELEMENTS = [
  'Infografis & Diagram',
  'Ikon Vektor',
  'Grafik & Chart',
  'Foto HD',
  'Timeline',
  'Mockup Produk',
  'Testimonial',
  'Comparison Table',
];

export const PRESENTATION_TONES = [
  'Percaya Diri',
  'Data-driven',
  'Storytelling',
  'Simple & Clear',
  'Inspiratif',
  'Teknis & Detail',
];

export const PRESENTATION_PRINCIPLES = [
  'Satu Slide Satu Pesan',
  'Prinsip 5-5-5',
  'Struktur Logis',
  'Data & Bukti',
  'Visual Berkualitas',
];

export const PRESENTATION_DEMOS = [
  {
    id: 'demo_growth_startup',
    tag: '🚀 Startup Growth',
    topic: 'Strategi Growth Hacking untuk Startup SaaS B2B',
    type: 'Pitching ke Investor',
    audience: 'Investor Series A, Tim Marketing, CEO Startup',
    slideCount: 10,
    duration: '10-15 menit',
    language: 'Indonesia',
    keyPoints: '- Masalah utama: Customer Acquisition Cost (CAC) industri SaaS naik 60%\n- Solusi: Framework Growth Flywheel berbasis Product-Led Growth (PLG)\n- Ukuran pasar & peluang di Asia Tenggara (TAM $12B)\n- Model monetisasi & proyeksi recurring revenue (ARR)\n- Traction saat ini: 1.200 pengguna aktif berbayar, NPS 72\n- Dana yang dibutuhkan $500K untuk ekspansi tim engineer dan akuisisi',
    dataEvidence: 'Market size $12B, growth rate 35% YoY, 1.200 pengguna aktif, CAC payback period 4 bulan, NPS score 72.',
    mainCta: 'Investor commit funding $500K untuk ekspansi regional 12 bulan ke depan.',
    designStyle: 'Startup Inovatif',
    colorScheme: 'Obsidian Black + Emerald Neon + Pure White',
    visualElements: ['Infografis & Diagram', 'Grafik & Chart', 'Mockup Produk', 'Comparison Table'],
    tone: 'Data-driven',
    extraNotes: 'Nama startup: CloudPulse.ai. Deck sebelumnya terlalu teknis, ingin dibuat lebih fokus pada traction dan unit economics.',
  },
  {
    id: 'demo_bi_sultra',
    tag: '🏛️ BI Sultra: Inflasi & QRIS',
    topic: 'Sinergi BI Sultra: Mengawal Inflasi & Memperkuat Digitalisasi',
    type: 'Laporan Performa Bisnis',
    audience: 'TPID, Pemerintah Daerah, Perbankan & Mitra Strategis',
    slideCount: 10,
    duration: '20-30 menit',
    language: 'Indonesia',
    keyPoints: '- Evaluasi inflasi daerah terjaga di angka 2,45% (yoy)\n- Efektivitas kampanye Belanja Bijak dan substitusi pangan lokal (Ikan Layang)\n- Prestasi Juara 2 Lomba Akuisisi QRIS Nasional 2025 dengan merchant tembus 120% target\n- Pertumbuhan pembiayaan kredit UMKM positif di level 12,7%\n- 4 langkah strategis akselerasi ekonomi digital Sulawesi Tenggara',
    dataEvidence: 'Inflasi 2,45% yoy, merchant QRIS 120% dari target, volume transaksi naik 38,6%, pertumbuhan kredit UMKM 12,7%, deflasi ikan layang -1,28%.',
    mainCta: 'Persetujuan roadmap bersama TPID & Pemda untuk integrasi transaksi nontunai di seluruh pasar tradisional.',
    designStyle: 'Profesional & Minimalis',
    colorScheme: 'Navy Blue (#002D62) + Warm Gold (#EAAA00) + Clean White',
    visualElements: ['Infografis & Diagram', 'Grafik & Chart', 'Timeline', 'Ikon Vektor'],
    tone: 'Percaya Diri',
    extraNotes: 'Tekankan sinergi multipihak dan apresiasi bagi UMKM lokal binaan.',
  },
  {
    id: 'demo_institution',
    tag: '🏛️ Proposal Lembaga',
    topic: 'Proposal Pendirian Akademi Teknologi & Vokasi Digital Modern',
    type: 'Proposal Proyek',
    audience: 'Dewan Pembina, Pengurus Yayasan & Mitra Industri',
    slideCount: 10,
    duration: '20-30 menit',
    language: 'Indonesia',
    keyPoints: '- Kesenjangan skill digital lulusan dengan kebutuhan industri software global\n- 3 jalur spesialisasi: Fullstack AI, UI/UX Engineering, Cloud Data\n- Model kurikulum berbasis portofolio nyata dan magang terpadu\n- Simulasi kelayakan anggaran 50 siswa angkatan pertama\n- Roadmap 4 tahap menuju akreditasi unggul',
    dataEvidence: 'Kebutuhan talenta digital nasional 600.000/tahun, target penyerapan kerja 90% dalam 6 bulan pascakelulusan.',
    mainCta: 'Dewan Pembina menyetujui alokasi dana pendirian fasilitas laboratorium dan pembukaan pendaftaran awal.',
    designStyle: 'Korporat Formal',
    colorScheme: 'Executive Navy (#002D62) + Royal Gold (#EAAA00)',
    visualElements: ['Infografis & Diagram', 'Timeline', 'Foto HD', 'Comparison Table'],
    tone: 'Inspiratif',
    extraNotes: 'Fokus pada pembangunan karakter berintegritas dan keunggulan kompetensi terapan.',
  },
];
