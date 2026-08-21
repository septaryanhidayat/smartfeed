/**
 * Smart Feed — Magic Prompt Presentasi PPT (Beta) Engine
 * Menghasilkan output prompt presentasi PowerPoint & Canva berbasis 10 prinsip desain terbaik:
 * 1. Satu Slide, Satu Pesan Utama
 * 2. Prinsip 5-5-5
 * 3. Bullet Points Efektif
 * 4. Berbasis Data dan Bukti
 * 5. Struktur Logis: Pendahuluan -> Isi -> Penutup
 * 6. Desain Simpel dan Konsisten
 * 7. Kontras Tinggi (WCAG AA)
 * 8. Font Mudah Dibaca
 * 9. Visual Berkualitas Tinggi
 * 10. Manfaatkan White Space
 */

export const INITIAL_PRESENTATION = {
  topic: '',
  type: 'Edukasi / Workshop',
  audience: '',
  slideCount: 6,
  duration: '5-10 menit',
  language: 'Indonesia',
  keyPoints: '',
  dataEvidence: '',
  mainCta: '',
  designStyle: 'Startup Inovatif',
  colorScheme: '',
  visualElements: ['Infografis & Diagram', 'Timeline', 'Ikon Vektor', 'Comparison Table', 'Foto HD'],
  tone: 'Inspiratif',
  extraNotes: '',
};

export function buildPresentation(state) {
  const {
    topic = '',
    type = 'Edukasi / Workshop',
    audience = '',
    slideCount = 6,
    duration = '20-30 menit',
    language = 'Indonesia',
    keyPoints = '',
    dataEvidence = '',
    mainCta = '',
    designStyle = 'Startup Inovatif',
    colorScheme = '',
    visualElements = ['Infografis & Diagram', 'Timeline', 'Ikon Vektor', 'Comparison Table', 'Foto HD'],
    tone = 'Inspiratif',
    extraNotes = '',
  } = state || {};

  const displayTopic = topic?.trim() || 'Judul / Topik Presentasi';
  const displayAudience = audience?.trim() || 'Target Audiens Utama';
  const displayCta = mainCta?.trim() || 'Langkah Aksi Nyata & Kesepakatan Bersama';
  const displayColorScheme = colorScheme?.trim() || 'Deep Tech Navy (#060B17) + Electric Purple + Cyan + Clean White';

  const safeCount = Math.max(4, Math.min(Number(slideCount) || 6, 24));
  const slideCountLabel = safeCount <= 7 ? '5–7 slide' : safeCount <= 12 ? '10–12 slide' : safeCount <= 16 ? '15–16 slide' : '20–30 slide';

  const visualElementsList = Array.isArray(visualElements) && visualElements.length > 0
    ? visualElements.map((v) => v.toLowerCase()).join(', ')
    : 'infografis dan diagram, timeline visual, ikon vektor, comparison table, foto berkualitas tinggi';

  // Parse key points into lines
  const rawLines = keyPoints
    ? keyPoints.split('\n').map((l) => l.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
    : [];

  const isRoadmapAi = topic?.toLowerCase().includes('roadmap ai');

  const slides = [];

  if (isRoadmapAi) {
    // 15 SLIDES LENGKAP SPESIAL ROADMAP AI 2026 (SESUAI MATERI PDF)
    slides.push({
      slideNo: 1,
      type: 'Cover Hero & Title Slide',
      eyebrow: 'ROADMAP AI 2026',
      title: 'Roadmap AI 2026: Panduan Bertahan di Tengah Tsunami Digital',
      subtitle: 'Dari Pemula Hingga Praktisi dalam 15 Langkah. Rangkuman Padat Ekosistem AI, Prompting (T-C-E-I), dan Era AI Agent.',
      layout: 'Split Layout 50:50 — Headline Bold Neon di kiri, Visual Gelombang Tsunami Digital 3D & Panah Pertumbuhan Emas di kanan',
      categoryChips: ['ROADMAP', 'AI AGENT', 'PROMPTING', 'EKSEKUSI'],
      bullets: [
        'Sebuah cetak biru operasional untuk profesional, kreator, dan pebisnis.',
        'Menguasai ekosistem AI bukan lagi opsi, tapi keharusan operasional.',
        'Fokus pada workflow nyata, bukan sekadar mencoba tools baru.',
      ],
      speakerNotes: 'Selamat datang! Di sesi ini kita akan membedah Roadmap AI 2026 secara komprehensif, dari penguasaan prompting T-C-E-I hingga pendelegasian tugas ke AI Agent.',
      visualPrompt: '16:9 widescreen presentation cover, title "Roadmap AI 2026", glowing digital tsunami wave on left blending into golden upward growth arrow, deep tech navy background, modern 3D glassmorphism, 8k.',
    });

    slides.push({
      slideNo: 2,
      type: 'Masalah & Realita',
      eyebrow: 'REALITA 2026',
      title: 'Mengapa Mayoritas Orang Tertinggal di Era AI?',
      subtitle: 'Tsunami Digital ratusan tools vs Kebutuhan Fokus & Eksekusi',
      layout: 'Komparasi 2 Kolom Kontras: Sisi Kiri (Tsunami Hype/Bingung) vs Sisi Kanan (Fokus & Eksekusi Sukses)',
      bullets: [
        'Realita 2026: Setiap hari muncul ratusan tools AI baru. Mayoritas hanya jadi pengamat bingung.',
        'Fakta Kunci: Menguasai AI adalah keharusan operasional untuk membuat Anda lebih strategis dari 99% orang.',
        'Jebakan FOMO: Mencoba semua tools tanpa tahu cara integrasinya ke bisnis berujung stagnasi.',
      ],
      goldenTakeaway: 'Kemenangan di era AI bukan ditentukan oleh berapa banyak tools yang Anda tahu, tapi seberapa cepat alur kerja Anda terautomasi.',
      speakerNotes: 'Banyak orang terjebak FOMO mencoba semua AI baru setiap hari. Akibatnya lelah tapi tidak menghasilkan konversi nyata.',
      visualPrompt: '16:9 slide split comparison, left side distressed person facing overwhelming tsunami of app icons, right side confident professional standing on golden rising podium, high contrast, clean tech lighting.',
    });

    slides.push({
      slideNo: 3,
      type: 'Evolusi & Konteks',
      eyebrow: 'EVOLUSI TEKNOLOGI',
      title: 'Evolusi AI: Dari Pencarian Menjadi Penciptaan',
      subtitle: 'Memahami lompatan paradigma dari Machine Learning hingga Multimodal AI',
      layout: '3 Kartu Horizontal Berurutan: Masa Lalu -> Masa Kini -> Standar Baru',
      bullets: [
        '01. Machine Learning (Masa Lalu): Fungsi pencarian & rekomendasi (Google Search, Algoritma YouTube).',
        '02. Generative AI / LLM (Masa Kini): Pencipta konten teks, gambar, suara (ChatGPT, Claude, Midjourney).',
        '03. Multimodal AI (Standar Baru): Satu AI untuk berbagai format input gambar/audio/teks sekaligus (Gemini 2.5, GPT-4o).',
      ],
      goldenTakeaway: 'Standar baru AI adalah Multimodal — mampu melihat, mendengar, dan menganalisis berbagai data secara simultan.',
      speakerNotes: 'Kita sudah melewati era AI sekadar alat pencari. Kini AI adalah mitra pencipta multimodal yang memahami konteks visual dan audio secara instan.',
      visualPrompt: '16:9 infographic slide showing 3 modern glowing cards illustrating AI evolution: magnifying glass brain (Past), pencil and canvas (Present), connected smartphone & camera multimodal hub (Future), 8k.',
    });

    slides.push({
      slideNo: 4,
      type: 'Prinsip Strategis',
      eyebrow: 'ATURAN EMAS 2026',
      title: 'Fokus pada Workflow, Bukan Hype',
      subtitle: 'Memilah antara jalur distraksi yang melelahkan vs jalur fokus yang menghasilkan ROI',
      layout: 'Diagram Alur 2 Jalur: Jalur Distraksi (Benang Kusut & Zonf) vs Jalur Fokus (Corong Kebutuhan & Koin Emas)',
      bullets: [
        'Jalur Distraksi: Mencoba semua AI baru → FOMO & Kelelahan → Zonk (tanpa konversi uang).',
        'Jalur Fokus: Eksplorasi terarah → Filter Kebutuhan Workflow → Integrasi Bisnis → Efisiensi & ROI Maksimal.',
        'Prinsip Utama: Jangan coba pelajari segalanya. Pelajari apa yang langsung menyelesaikan masalah Anda hari ini.',
      ],
      goldenTakeaway: 'Pelajari apa yang langsung menyelesaikan masalah operasional Anda hari ini.',
      speakerNotes: 'Hentikan mengejar setiap tools viral di media sosial. Masukkan kebutuhan Anda ke dalam corong workflow untuk mengamankan ROI bisnis.',
      visualPrompt: '16:9 conceptual diagram, tangled colorful wires representing hype distraction leading to zero ROI vs streamlined golden pipeline passing through a workflow funnel into stacked gold coins, dark background.',
    });

    slides.push({
      slideNo: 5,
      type: 'Tech-Stack & Studi Kasus',
      eyebrow: 'STUDI KASUS PRAKTISI',
      title: 'Anatomi Tech-Stack Praktisi: Kasus Jurnalis & Kreator',
      subtitle: 'Merangkai tools spesifik untuk menyelesaikan siklus kerja dari hulu ke hilir',
      layout: 'Diagram Hub-and-Spoke: Sosok Profesional di kiri dengan 4 Jalur Output Terintegrasi di kanan',
      bullets: [
        'Teks & Script Berita/Iklan: Didukung oleh LLM Utama (ChatGPT / Claude).',
        'Voice-over (Text-to-Speech): Suara natural multibahasa via ElevenLabs.',
        'Visual & Gambar (Text-to-Image): Ilustrasi & foto realistis via Gemini / Midjourney / Flux.',
        'Video Animasi (Image-to-Video): Motion & scene dinamis via Veo 3 / Runway.',
      ],
      goldenTakeaway: 'Anda tidak perlu menguasai seluruh ekosistem. Cukup rangkai tools yang menyelesaikan tugas spesifik peran Anda.',
      speakerNotes: 'Inilah contoh praktis tech-stack terintegrasi: satu jurnalis atau kreator dapat memproduksi naskah, audio, gambar, dan video hanya dengan merangkai 4 tools inti.',
      visualPrompt: '16:9 workflow schematic, professional character connected via glowing cyan lines to 4 app cards (Text, Voice, Visual, Video) with crisp icons and sleek labels, dark clean interface.',
    });

    slides.push({
      slideNo: 6,
      type: 'Skill Inti',
      eyebrow: 'SKILL MASA DEPAN',
      title: 'Prompting: Bahasa Pemrograman Masa Depan',
      subtitle: 'Menerjemahkan strategi bisnis ke dalam bahasa komando mesin',
      layout: 'Split Card: Ilustrasi Editor Kode Terminal di kiri, 3 Kartu Nilai Strategis di kanan',
      bullets: [
        'Secanggih apapun AI, tanpa instruksi presisi hasilnya tidak akan dapat digunakan.',
        'Prompting adalah proses menerjemahkan strategi bisnis ke dalam parameter kerja AI.',
        'Ini adalah skill dengan Return on Investment (ROI) dan permintaan tertinggi di pasar kerja saat ini.',
      ],
      goldenTakeaway: 'Kecerdasan output AI Anda dibatasi oleh ketepatan bahasa komando bisnis yang Anda berikan.',
      speakerNotes: 'Prompting bukan sekadar mengetik pertanyaan santai, melainkan skill rekayasa instruksi untuk mengeksekusi visi bisnis dengan tingkat presisi tinggi.',
      visualPrompt: '16:9 presentation slide, isometric laptop screen running glowing purple prompt code on left, 3 stacked benefit cards on right with brain, gear, and golden ROI badge icons, dark theme.',
    });

    slides.push({
      slideNo: 7,
      type: 'Framework Unggulan',
      eyebrow: 'FRAMEWORK KOMUNIKASI AI',
      title: 'Metode T-C-E-I: Berhenti Sekadar Mengobrol',
      subtitle: '4 Siklus Komando Terstruktur untuk Hasil AI yang Konsisten & Profesional',
      layout: 'Diagram Sirkular 4 Kuadran Berputar (Task -> Context -> Evaluate -> Iterate)',
      bullets: [
        'T - Task: Tentukan tugas spesifik, persona/role yang diinginkan, dan format akhir yang diminta.',
        'C - Context: Berikan latar belakang, data spesifik, batasan, dan referensi presisi.',
        'E - Evaluate: Verifikasi hasil dan akurasi (Human-in-the-Loop). Jangan pernah percaya buta.',
        'I - Iterate: Revisi instruksi dan berkolaborasi terus-menerus hingga mencapai hasil sempurna.',
      ],
      goldenTakeaway: 'Metode T-C-E-I mengubah interaksi acak menjadi protokol produksi konten yang terstandarisasi.',
      speakerNotes: 'Framework T-C-E-I adalah fondasi utama: definisikan Task dan Context di awal, lalu lakukan Evaluate dan Iterate bersama AI Anda.',
      visualPrompt: '16:9 circular infographic diagram showing 4 colored quadrants (Blue Task, Orange Context, Purple Evaluate, Green Iterate) rotating around central AI brain hub, sleek tech look.',
    });

    slides.push({
      slideNo: 8,
      type: 'Komparasi Praktis',
      eyebrow: 'FONDASI KOMANDO',
      title: 'Membangun Fondasi Komando: Task & Context',
      subtitle: 'Membandingkan secara nyata output prompt amatir vs prompt eksekutif',
      layout: 'Side-by-Side Comparison: Kotak Abu-abu (Prompt Amatir) vs Kotak Biru Menyala (Prompt T-C Eksekutif)',
      bullets: [
        'Prompt Amatir: "Tolong kasih ide bisnis yang bagus." -> Hasil: Terlalu umum, tidak relevan, dan tidak bisa dieksekusi.',
        'Prompt T-C Eksekutif: Task (Konsultan bisnis 10 tahun, output tabel) + Context (Ide tren 2026, Business Model Canvas, Net Profit, Data Lokal).',
        'Insight Kunci: AI membutuhkan parameter bisnis yang jelas. Pemahaman fundamental bisnis Anda adalah batas kecerdasan AI Anda.',
      ],
      goldenTakeaway: 'Pemahaman fundamental bisnis Anda adalah batas kecerdasan AI Anda.',
      speakerNotes: 'Perhatikan perbedaannya: prompt tanpa konteks menghasilkan saran klise, sementara prompt berbasis T-C menghasilkan analisis siap eksekusi.',
      visualPrompt: '16:9 side-by-side comparison slide, left muted card showing amateur prompt with red question mark, right vibrant glowing blue card showing executive structured prompt with gear and lightbulb, 8k.',
    });

    slides.push({
      slideNo: 9,
      type: 'Quality Control',
      eyebrow: 'KALIBRASI EKSEKUSI',
      title: 'Kalibrasi Eksekusi: Evaluate & Iterate',
      subtitle: 'Peran Human-in-the-Loop untuk validasi fakta, eliminasi halusinasi, dan penyempurnaan',
      layout: 'Diagram Siklus Tertutup: LLM Generasi Pertama -> Fase Evaluasi (Human Oversight) -> Fase Iterasi (Refinement)',
      bullets: [
        'LLM dilatih dengan data internet publik: Selalu validasi kebenaran fakta dan cegah halusinasi.',
        'Human-in-the-Loop: Manusia berperan sebagai kurator kualitas dan pengambil keputusan akhir.',
        'Fase Iterasi: Jangan mengulang dari nol. Perbaiki prompt, tambahkan batasan baru, dan "latih" sesi AI tersebut.',
      ],
      goldenTakeaway: 'AI menghasilkan draf pertama dalam hitungan detik; sentuhan manusia menjadikannya berkelas dunia.',
      speakerNotes: 'Jangan pernah menyerahkan validasi 100% pada AI tanpa pengawasan. Evaluasi fakta dan lakukan iterasi untuk mengunci kualitas.',
      visualPrompt: '16:9 cyclic workflow diagram, LLM server box looping through magnifying glass human oversight stage to refinement gears stage, clean cyan arrows on dark navy background.',
    });

    slides.push({
      slideNo: 10,
      type: 'Paradigma Baru',
      eyebrow: 'ERA BARU 2026',
      title: 'Era AI Agent: Dari Asisten Menjadi Eksekutor',
      subtitle: 'Pergeseran fundamental dari sekadar chatbot penjawab teks menuju agen otonom 24/7',
      layout: 'Panah Transformasi Horizontal Besar: Kiri (Chatbot Asisten Pasif 2025) -> Kanan (AI Agent Otonom 2026)',
      bullets: [
        '2025 (Chatbot Asisten): Membutuhkan dorongan konstan, pasif merespons prompt, terbatas di jendela chat.',
        '2026 (AI Agent Otonom): Software cerdas yang mengejar tujuan mandiri, proaktif mengeksekusi tugas 24/7 tanpa henti.',
        'Skalabilitas: AI Agent adalah tenaga kerja digital yang dapat diukur kapasitasnya tanpa menambah biaya rekrutmen.',
      ],
      goldenTakeaway: 'AI Agent adalah tenaga kerja digital yang dapat di-scale tanpa menambah biaya rekrutmen.',
      speakerNotes: 'Tahun 2026 adalah era AI Agent. Kita tidak lagi sekadar mengetik prompt bolak-balik di chat, melainkan memberi gol dan membiarkan agen mengeksekusinya di latar belakang.',
      visualPrompt: '16:9 transformative infographic, left side basic chat bubble window fading into right side glowing robotic neural network brain connected to cloud apps and databases, vibrant purple & cyan.',
    });

    slides.push({
      slideNo: 11,
      type: 'Arsitektur Sistem',
      eyebrow: 'ARSITEKTUR TEKNOLOGI',
      title: 'Anatomi Pembentuk AI Agent',
      subtitle: 'Komponen inti yang menyusun agen cerdas berkinerja tinggi',
      layout: 'Diagram Pusat 4 Kuadran: Otak LLM di Tengah dikelilingi Memory, Tools, dan Protokol Interaksi',
      bullets: [
        'Otak (Model LLM): Pusat logika penalaran dan pengambilan keputusan strategis.',
        'Memory Base: Mengingat interaksi masa lalu, database produk, dan konteks bisnis jangka panjang.',
        'Tools & Integrasi: Mengoperasikan Email, CRM, E-commerce, dan API aplikasi eksternal.',
        'Protokol Interaksi: Memproses Audio, Speech, dan Teks secara real-time.',
        'Platform Infrastruktur: n8n, Make.com, LangChain, Flowise.',
      ],
      goldenTakeaway: 'AI Agent = Otak LLM + Memori Bisnis + Akses Tools & API Nyata.',
      speakerNotes: 'Untuk membangun AI Agent, Anda menghubungkan LLM dengan memori data bisnis dan tools eksternal melalui platform otomasi seperti n8n atau Make.',
      visualPrompt: '16:9 architecture blueprint slide, central glowing isometric microprocessor brain linked via clean cyan circuit lines to 4 modules (Email/CRM, Memory, Speech/Audio, Tools), dark tech style.',
    });

    slides.push({
      slideNo: 12,
      type: 'Komparasi Teknis',
      eyebrow: 'ANALISIS DIAGNOSTIK',
      title: 'Analisis Diagnostik: LLM Tradisional vs. AI Agent',
      subtitle: 'Tabel komparasi komprehensif kapabilitas operasional',
      layout: 'Tabel Komparasi 2 Kolom Kontras dengan Ikon Metrik Presisi',
      bullets: [
        'Inisiatif Tindakan: LLM menunggu prompt manusia vs AI Agent mengambil tindakan mandiri berbasis tujuan.',
        'Kapasitas Eksekusi: LLM terisolasi di jendela chat vs AI Agent membuka dan mengoperasikan aplikasi pihak ketiga.',
        'Durasi Kerja: LLM aktif saat pengguna mengetik vs AI Agent berjalan di latar belakang 24/7.',
        'Kasus Penggunaan: LLM untuk drafting & ideasi vs AI Agent untuk otomasi operasional penuh & riset mandiri.',
      ],
      goldenTakeaway: 'AI Agent membebaskan Anda dari pekerjaan administratif rutin sepanjang hari.',
      speakerNotes: 'Tabel ini memperlihatkan perbedaan kunci: LLM biasa hanya berpikir saat ditanya, sementara AI Agent bertindak mandiri menyelesaikan pekerjaan Anda.',
      visualPrompt: '16:9 comparison table slide, 4 distinct rows comparing Traditional LLM (left column with user typing) vs Autonomous AI Agent (right column with gears and 24/7 clock), high contrast.',
    });

    slides.push({
      slideNo: 13,
      type: 'Visi Integrasi',
      eyebrow: 'EKOSISTEM KERJA 2026',
      title: 'Ekosistem Kerja 2026: Integrasi Penuh',
      subtitle: 'Sinergi harmonis antara kepemimpinan manusia, metode komando, dan armada AI Agent',
      layout: 'Diagram Pipeline End-to-End: Manusia (Visi) -> Metode T-C-E-I -> LLM & Multimodal -> ROI Skala',
      bullets: [
        'Manusia (Strategi & Visi): Menentukan arah bisnis, nilai etika, dan target pertumbuhan.',
        'Metode T-C-E-I (Bahasa Komando): Menghubungkan strategi manusia ke parameter kerja mesin.',
        'AI Agent & Multimodal (Eksekutor 24/7): Mengoperasikan teks, audio, gambar, dan video otomatis.',
        'ROI & Efisiensi Skala: Melipatgandakan output dan omset tanpa menambah beban waktu kerja.',
      ],
      goldenTakeaway: 'Anda tidak digantikan oleh AI. Anda digantikan oleh orang yang membangun ekosistem ini.',
      speakerNotes: 'Kunci keberhasilan bukan bersaing dengan AI, melainkan memposisikan diri Anda sebagai komandan yang memimpin ekosistem otomatis ini.',
      visualPrompt: '16:9 panoramic ecosystem pipeline, human director on left pointing towards glowing T-C-E-I bridge, central AI agent engine processing multimodal streams, finishing at rocket ROI on right.',
    });

    slides.push({
      slideNo: 14,
      type: 'Mindset & Kecepatan',
      eyebrow: 'KECEPATAN ADAPTASI',
      title: 'Kecepatan Adaptasi: Waktu Diukur dalam Minggu',
      subtitle: 'Menavigasi percepatan teknologi eksponensial dengan mentalitas eksekusi cepat',
      layout: '3 Pilar Kartu Vertikal dengan Timeline Transformasi (Years -> Weeks)',
      bullets: [
        'Percepatan Eksponensial: Inovasi AI bergerak terlalu cepat. Apa yang canggih hari ini bisa menjadi usang bulan depan.',
        'Fokus Strategis: Abaikan kebisingan update harian. Pertahankan AI yang terintegrasi mulus ke alur kerja produk Anda.',
        'Mentalitas 2026: Kecepatan implementasi mengalahkan kesempurnaan teori.',
      ],
      goldenTakeaway: 'Kecepatan implementasi nyata selalu mengalahkan kesempurnaan teori.',
      speakerNotes: 'Dulu inovasi diukur dalam tahunan, kini perubahannya terjadi mingguan. Praktikkan langsung sekarang daripada menunggu teori sempurna.',
      visualPrompt: '16:9 timeline slide transitioning from slow clock (Years) to rocket speed (Weeks), featuring 3 high-tech pillars with glowing neon frames, dark navy theme.',
    });

    slides.push({
      slideNo: 15,
      type: 'Call to Action & Roadmap',
      eyebrow: 'CETAK BIRU AKSI',
      title: 'Cetak Biru Aksi: Mulai Perjalanan AI Anda',
      subtitle: '4 Langkah praktis yang harus Anda mulai eksekusi hari ini',
      layout: '4 Kartu Langkah Bernomor Besar (01 - 04) + Banner Komitmen Emas di Bawah',
      bullets: [
        '01. Kuasai Satu Fondasi: Pilih satu LLM utama (ChatGPT, Gemini, atau Claude) sebagai titik awal.',
        '02. Implementasi T-C-E-I: Tinggalkan prompt amatir. Biasakan komunikasi terstruktur berbasis Task & Context.',
        '03. Audisi Ekosistem: Identifikasi 2-3 tools spesifik yang langsung menghemat waktu dalam profesi Anda.',
        '04. Eksplorasi Automasi: Pelajari dasar pembangunan AI Agent (seperti Make.com / n8n) untuk delegasi rutinitas.',
      ],
      goldenTakeaway: 'Amankan posisi Anda di era baru. Terapkan kerangka ini hari ini dan jadilah arsitek alur kerja Anda sendiri.',
      speakerNotes: 'Inilah 4 langkah aksi Anda. Mulai dari satu tools, terapkan metode T-C-E-I, rangkai ekosistem Anda, dan jadilah arsitek masa depan Anda sendiri. Terima kasih!',
      visualPrompt: '16:9 closing presentation slide, 4 glowing numbered step cards (01 to 04) with icons, bottom wide golden glowing action ribbon with high contrast inspiring typography, 8k.',
    });
  } else {
    // GENERASI DINAMIS UNTUK TOPIK UMUM LAINNYA (MENGIKUTI JUMLAH SLIDE USER)
    slides.push({
      slideNo: 1,
      type: 'Cover Hero & Title Slide',
      eyebrow: (type || 'PRESENTASI EKSEKUTIF').toUpperCase(),
      title: displayTopic,
      subtitle: `Disusun untuk: ${displayAudience} | Durasi: ${duration}`,
      layout: 'Split Layout 50:50 — Headline tebal beraksen kontras tinggi di kiri, Visual 3D Photorealistic di kanan, Ribbon footer elegan',
      categoryChips: Array.isArray(visualElements) && visualElements.length > 0 ? visualElements.slice(0, 4) : ['STRATEGI', 'EKSEKUTIF', 'AKSI'],
      bullets: [
        `Topik: ${displayTopic}`,
        `Tujuan: ${type}`,
        `Audiens: ${displayAudience}`,
        `Target: ${slideCountLabel}`,
      ],
      speakerNotes: `Selamat datang! Pada sesi ini kita akan membedah "${displayTopic}" secara terstruktur, berbasis data, dan langsung aplikatif.`,
      visualPrompt: `16:9 widescreen presentation title slide, ${designStyle.toLowerCase()} style, color scheme ${displayColorScheme}, bold typography "${displayTopic}", crisp lighting, 8k resolution.`,
    });

    // Dynamic body slides
    const numBodySlides = Math.max(safeCount - 2, 2);
    for (let i = 0; i < numBodySlides; i++) {
      const pIndex = i % (pointsList.length || 1);
      const point = pointsList[pIndex] || `Pilar Strategis ${i + 1}`;
      slides.push({
        slideNo: i + 2,
        type: i === 0 ? 'Tantangan & Urgensi' : i === numBodySlides - 1 ? 'Validasi Data & Hasil' : 'Pilar Solusi & Framework',
        eyebrow: `BAGIAN 0${i + 1}`,
        title: point,
        subtitle: `Penjabaran mendalam strategi untuk ${displayAudience}`,
        layout: 'Grid 2-Kolom: 3 Poin Kartu Bernomor + Box Sorot Utama di Kanan',
        bullets: [
          `Fokus 01: ${point}`,
          'Fokus 02: Implementasi teknis dan alokasi sumber daya kunci.',
          'Fokus 03: Tolok ukur keberhasilan dan mitigasi risiko.',
        ],
        goldenTakeaway: `Prinsip Kunci: ${point}`,
        speakerNotes: `Pada slide ini, kita menyoroti ${point} sebagai pilar penting dalam mencapai sasaran utama.`,
        visualPrompt: `16:9 presentation slide showing modern 3D icon and clean cards, color scheme ${displayColorScheme}, high contrast readability.`,
      });
    }

    // Closing CTA slide
    slides.push({
      slideNo: slides.length + 1,
      type: 'Call to Action & Penutup',
      eyebrow: 'LANGKAH EKSEKUSI',
      title: 'Kesimpulan & Langkah Aksi Selanjutnya',
      subtitle: 'Komitmen bersama untuk mencapai hasil maksimal',
      layout: 'Center CTA Hero Card + 3 Action Items yang Disepakati',
      bullets: [
        `Aksi Utama: ${displayCta}`,
        'Langkah 1: Menyelaraskan roadmap dan timeline implementasi.',
        'Langkah 2: Menetapkan penanggung jawab dan tolok ukur evaluasi.',
      ],
      goldenTakeaway: displayCta,
      speakerNotes: `Sebagai penutup, keberhasilan strategi ini bergantung pada aksi nyata hari ini. ${displayCta}. Terima kasih!`,
      visualPrompt: `16:9 closing presentation slide, bold central CTA card with warm glowing button, checkmark icons, color scheme ${displayColorScheme}, inspiring finish.`,
    });
  }

  // 1. MASTER MAGIC PROMPT (FORMAT BLUEPRINT PERSIS REFERENSI)
  const magicPrompt = `Buatkan slide presentasi PowerPoint tentang "${displayTopic}"

Buatkan outline lengkap slide presentasi PowerPoint dengan detail berikut:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI DASAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Judul / Topik     : ${displayTopic}
• Jenis Presentasi  : ${type}
• Target Audiens    : ${displayAudience}
• Jumlah Slide      : ${slides.length} slide (${slideCountLabel})
• Durasi            : ${duration}
• Bahasa            : ${language === 'Indonesia' ? 'Bahasa Indonesia' : language === 'Inggris' ? 'Bahasa Inggris' : 'Bilingual (Indonesia / Inggris)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONTEN & PESAN UTAMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poin-poin kunci yang harus disampaikan:
${pointsList.map((l) => (l.startsWith('-') ? l : `- ${l}`)).join('\n')}

${dataEvidence ? `Data / Bukti / Statistik yang akan digunakan:\n${dataEvidence}\n\n` : ''}Call to Action akhir presentasi:
→ ${displayCta}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINSIP DESAIN YANG HARUS DITERAPKAN (CANVA & POWERPOINT READY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terapkan prinsip-prinsip berikut secara ketat pada setiap slide:

1. SATU SLIDE, SATU PESAN UTAMA
   Setiap slide hanya mengkomunikasikan satu ide pokok. Tidak ada dua gagasan 
   utama dalam satu slide. Buat judul slide mencerminkan pesan tersebut.

2. PRINSIP 5-5-5
   Maksimum 5 bullet points per slide, maksimum 5 kata per bullet point, 
   dan tidak lebih dari 5 slide berturut-turut dengan format teks penuh.

3. BULLET POINTS EFEKTIF
   Gunakan bullet points hanya untuk daftar atau rincian penting. Buat setiap 
   poin ringkas, padat, dan diawali kata kerja aksi jika memungkinkan.

4. BERBASIS DATA DAN BUKTI
   Sertakan data, fakta, atau studi kasus yang relevan pada slide yang 
   membutuhkan penguatan argumen. Tampilkan angka kunci secara menonjol.

5. STRUKTUR LOGIS
   Alur presentasi harus runtut dan mengalir:
   - Pembuka (Hook & Konteks)
   - Isi (Masalah → Solusi → Bukti/Data → Manfaat)
   - Penutup (Ringkasan & Call to Action yang jelas)

6. DESAIN SIMPEL DAN KONSISTEN
   Gunakan tata letak yang bersih, tidak berantakan. Pertahankan konsistensi 
   warna, font, dan gaya visual dari slide pertama hingga terakhir.

7. KONTRAS TINGGI
   Pastikan teks mudah dibaca dengan kontras yang kuat antara warna teks 
   dan latar belakang (minimal rasio kontras 4.5:1 / standar WCAG AA).

8. FONT MUDAH DIBACA
   Gunakan maksimal 2 jenis font (satu untuk judul, satu untuk isi). 
   Ukuran font: Judul 36–44 pt, Subjudul 24–28 pt, Isi/Bullet 18–24 pt.

9. VISUAL BERKUALITAS TINGGI
   Sertakan saran penempatan elemen visual yang relevan untuk setiap slide:
   (${visualElementsList}).

10. MANFAATKAN WHITE SPACE
    Berikan ruang kosong yang cukup di sekitar teks dan elemen visual. 
    Jangan penuhi seluruh area slide. White space membuat slide terlihat 
    profesional dan tidak melelahkan mata.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT OUTPUT YANG DIMINTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Untuk SETIAP slide, berikan rincian dengan format berikut:

[Slide X: Judul Slide yang Menarik]
• Pesan Utama   : [1 kalimat pesan inti slide ini]
• Konten Teks   :
  - [Poin 1 - ringkas & padat]
  - [Poin 2 - ringkas & padat]
  - [Poin 3 - ringkas & padat]
• Elemen Visual : [Saran visual spesifik: jenis chart / ikon / foto / diagram]
• AI Image Prompt: [Prompt lengkap format 16:9 untuk generate gambar AI di Midjourney/Flux/DALL-E]
• Catatan Presenter: [Poin bicara 2-3 kalimat untuk presenter saat menampilkan slide ini]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PANDUAN TAMBAHAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Gaya / Tone Desain : ${designStyle}
• Skema Warna Utama  : ${displayColorScheme}
• Elemen Visual Kunci: ${visualElementsList}
• Tone / Gaya Bahasa : ${tone}${extraNotes ? `\n• Catatan Khusus      : ${extraNotes}` : ''}

Buatkan outline slide ini dengan lengkap, terstruktur, dan siap pakai!`;

  // 2. GAMMA & CANVA (DOCS TO DECK) OPTIMIZED OUTLINE
  const gammaOutline = `# ${displayTopic}
## ${displayAudience} | ${duration} | ${type}

${slides.map((s) => `### Slide ${s.slideNo}: ${s.title}
* **Kategori:** ${s.eyebrow}
${s.bullets.map((b) => `* ${b}`).join('\n')}
${s.goldenTakeaway ? `* ⭐ **Golden Takeaway:** ${s.goldenTakeaway}` : ''}
* 📸 **Saran Visual (Canva / Midjourney):** ${s.visualPrompt}
* 🎙️ **Catatan Presenter:** ${s.speakerNotes}
`).join('\n---\n\n')}

*Catatan untuk Canva: Salin teks di atas, buka Canva -> 'Docs to Deck' (Konversi Dokumen ke Presentasi), lalu pilih template tema '${designStyle}'.*`;

  // 3. VBA MACRO SCRIPT FOR POWERPOINT
  const vbaMacro = `' ====================================================================
' SMART FEED — MAGIC POWERPOINT VBA MACRO GENERATOR
' Cara Pakai di PowerPoint:
' 1. Buka PowerPoint -> Buat Presentasi Kosong
' 2. Tekan Alt + F11 (buka VBA Editor) -> Insert -> Module
' 3. Paste kode di bawah ini -> Tekan F5 (Run)
' ====================================================================

Sub GenerateMagicPresentation()
    Dim pptApp As Presentation
    Dim sld As Slide
    Dim shp As Shape

    Set pptApp = ActivePresentation

    ' Slide 1: Cover
    Set sld = pptApp.Slides.Add(1, ppLayoutTitle)
    sld.Shapes(1).TextFrame.TextRange.Text = "${displayTopic.replace(/"/g, '""')}"
    sld.Shapes(2).TextFrame.TextRange.Text = "${displayAudience.replace(/"/g, '""')} | ${type.replace(/"/g, '""')}"

${slides.slice(1).map((s, i) => `    ' Slide ${s.slideNo}: ${s.title.replace(/"/g, '""')}
    Set sld = pptApp.Slides.Add(${i + 2}, ppLayoutText)
    sld.Shapes(1).TextFrame.TextRange.Text = "${s.title.replace(/"/g, '""')}"
    sld.Shapes(2).TextFrame.TextRange.Text = "${s.bullets.map((b) => b.replace(/"/g, '""')).join('" & vbCrLf & "')}"
`).join('\n')}

    MsgBox "Presentasi '${displayTopic.replace(/"/g, '""')}' (${slides.length} Slide) berhasil dibuat oleh Smart Feed!", vbInformation, "Smart Feed Success"
End Sub`;

  // 4. NOTEBOOKLM SOURCE DOCUMENT
  const notebookLmDoc = `# DOKUMEN SUMBER PRESENTASI EKSEKUTIF: ${displayTopic.toUpperCase()}
**Tujuan Presentasi:** ${type}
**Target Audiens:** ${displayAudience}
**Durasi Sesi:** ${duration}
**Gaya Komunikasi:** ${tone}
**Prinsip Desain:** 1 Slide 1 Pesan, Prinsip 5-5-5, Kontras Tinggi WCAG AA

---

## 1. RINGKASAN EKSEKUTIF & PESAN UTAMA
Presentasi ini disusun untuk memaparkan "${displayTopic}" secara terstruktur dan berdampak tinggi bagi ${displayAudience}.
Pesan penutup dan call to action utama: "${displayCta}".

---

## 2. DETAIL SLIDE-BY-SLIDE & ANALISIS
${slides.map((s) => `### SLIDE ${s.slideNo}: ${s.title.toUpperCase()}
- **Kategori:** ${s.type} (${s.eyebrow})
- **Poin Utama:**
${s.bullets.map((b) => `  * ${b}`).join('\n')}
${s.goldenTakeaway ? `- **Pesan Kunci:** ${s.goldenTakeaway}\n` : ''}- **Naskah Pembicara:** ${s.speakerNotes}
- **Konsep Visual 16:9:** ${s.visualPrompt}
`).join('\n---\n')}

---
*Dokumen ini diformat khusus untuk diunggah sebagai Source Document ke Google NotebookLM untuk menghasilkan Audio Overview / Podcast / Deep Dive Q&A.*`;

  return {
    slides,
    magicPrompt,
    markdownPrompt: magicPrompt,
    gammaOutline,
    vbaMacro,
    notebookLmDoc,
  };
}
