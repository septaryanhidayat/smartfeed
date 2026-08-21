export const PRESENTATION_USE_CASES = [
  {
    id: 'pitch_deck',
    name: '🚀 Pitch Deck Startup & Bisnis',
    desc: 'Struktur standar VC/Investor: Problem, Solusi, Market Size, Traction, Business Model, dan Funding Ask.',
    defaultSlides: 8,
  },
  {
    id: 'company_profile',
    name: '🏢 Company Profile & B2B Proposal',
    desc: 'Profil perusahaan, portofolio layanan, metodologi kerja, testimoni klien, dan skema kerjasama.',
    defaultSlides: 7,
  },
  {
    id: 'education_webinar',
    name: '🎓 Materi Edukasi, Webinar & Kuliah',
    desc: 'Struktur pengajaran runtut: Agenda, konsep dasar, visual breakdown, studi kasus nyata, dan kesimpulan.',
    defaultSlides: 10,
  },
  {
    id: 'kpi_report',
    name: '📊 Laporan Kinerja & Quarterly Review (QBR)',
    desc: 'Executive summary, performa metrik KPI, analisis data, tantangan, dan roadmap perbaikan kuartal depan.',
    defaultSlides: 6,
  },
  {
    id: 'sales_launch',
    name: '🎯 Sales Pitch & Launching Produk',
    desc: 'Hook emosional, perbandingan benefit, fitur unggulan, bukti sosial, penawaran harga spesial, dan CTA penutup.',
    defaultSlides: 7,
  },
  {
    id: 'workshop_sop',
    name: '🛠️ Workshop, Training & SOP Internal',
    desc: 'Pedoman alur kerja step-by-step, panduan Do & Don\'ts, best practices, dan evaluasi pemahaman tim.',
    defaultSlides: 8,
  },
];

export const PRESENTATION_STYLES = [
  {
    id: 'minimal_clean',
    name: 'Minimalist Clean (Apple / Notion Style)',
    desc: 'Dominan putih/abu bersih, tipografi sans-serif tegas, spasi lega, visual elegan dan modern.',
    bg: '#ffffff',
    text: '#0f172a',
    accent: '#2563eb',
  },
  {
    id: 'dark_tech',
    name: 'Dark Futuristic (Tech SaaS & AI)',
    desc: 'Background gelap pekat, aksen neon cyan/violet, kartu glassmorphism, dan nuansa high-tech.',
    bg: '#090d16',
    text: '#f8fafc',
    accent: '#06b6d4',
  },
  {
    id: 'corporate_navy',
    name: 'Corporate Navy (McKinsey / BCG Style)',
    desc: 'Palet biru navy profesional, aksen emas/slate, layout berbobot eksekutif terpercaya.',
    bg: '#0f172a',
    text: '#ffffff',
    accent: '#38bdf8',
  },
  {
    id: 'creative_agency',
    name: 'Creative & Vibrant (Marketing / Agency)',
    desc: 'Gradien warna cerah, tata letak dinamis, tipografi ekspresif, dan visual penuh energi.',
    bg: '#18181b',
    text: '#ffffff',
    accent: '#ec4899',
  },
  {
    id: 'academic_structured',
    name: 'Academic & Structured (Pendidikan / Kampus)',
    desc: 'Hierarki informasi rapi, blok warna lembut, navigasi materi jelas, nyaman dibaca lama.',
    bg: '#f8fafc',
    text: '#1e293b',
    accent: '#0d9488',
  },
  {
    id: 'luxury_gold',
    name: 'Luxury Executive (Monochrome & Warm Gold)',
    desc: 'Kombinasi hitam arang elegan dengan sentuhan emas hangat, ideal untuk brand eksklusif.',
    bg: '#121212',
    text: '#fafafa',
    accent: '#eab308',
  },
];

export const PRESENTATION_DEMOS = [
  {
    topic: 'SmartFeed AI: Revolusi Produksi Konten Visual Multi-Engine',
    presenter: 'Beranda Teknologi Digital',
    audience: 'Investor & Strategic Partners',
    useCase: 'pitch_deck',
    style: 'dark_tech',
    slideCount: 8,
    keyPoints: 'Efisiensi waktu 10x lipat, integrasi 4 engine AI (ChatGPT, Gemini, Grok, Leonardo), traction 5.000+ pengguna aktif, model sekali bayar lifetime.',
  },
  {
    topic: 'Strategi Omnichannel Marketing 2026 untuk Brand Retail',
    presenter: 'Digital Growth Agency',
    audience: 'Klien Korporat & Brand Director',
    useCase: 'company_profile',
    style: 'corporate_navy',
    slideCount: 7,
    keyPoints: 'Integrasi TikTok Shop & Meta Ads, otomatisasi konten katalog, studi kasus kenaikan ROAS 320%, roadmap implementasi 90 hari.',
  },
  {
    topic: 'Pengantar Jurnalisme Data & Verifikasi Fakta Digital',
    presenter: 'Fakultas Ilmu Komunikasi',
    audience: 'Mahasiswa & Jurnalis Muda',
    useCase: 'education_webinar',
    style: 'academic_structured',
    slideCount: 8,
    keyPoints: 'Metodologi 5W+1H modern, teknik investigasi open-source intelligence (OSINT), studi kasus verifikasi hoaks viral, etika pemberitaan.',
  },
];
