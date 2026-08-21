import { PRESENTATION_USE_CASES, PRESENTATION_STYLES } from '../data/presentationOptions.js';

export const INITIAL_PRESENTATION = {
  topic: 'Proposal Pendirian Akademi Teknologi & Vokasi Digital Modern',
  presenter: 'Tim Inisiator & Perumus Visi',
  audience: 'Dewan Pembina, Pengurus Yayasan & Mitra Strategis',
  useCase: 'executive_concept',
  style: 'executive_navy_gold',
  slideCount: 10,
  keyPoints: 'Integrasi Kurikulum Industri + Pembinaan Karakter Unggul + Software Skill Terapan (UI/UX, Full-Stack, AI), model boarding school memperluas jangkauan pasar, simulasi pembiayaan 50 siswa awal, roadmap implementasi 4 tahap menuju akreditasi unggul.',
  includeSpeakerNotes: true,
  includeVisualPrompts: true,
};

export function buildPresentation(state) {
  const {
    topic = 'Proposal Strategis Pengembangan & Inovasi',
    presenter = 'Tim Penyusun Proposal',
    audience = 'Dewan Direksi & Pemangku Kepentingan',
    useCase = 'executive_concept',
    style = 'executive_navy_gold',
    slideCount = 10,
    keyPoints = '',
    includeSpeakerNotes = true,
    includeVisualPrompts = true,
  } = state || {};

  const useCaseObj = PRESENTATION_USE_CASES.find((u) => u.id === useCase) || PRESENTATION_USE_CASES[0];
  const styleObj = PRESENTATION_STYLES.find((s) => s.id === style) || PRESENTATION_STYLES[0];

  const count = Math.max(4, Math.min(Number(slideCount) || 10, 14));
  const slides = [];

  // SLIDE 1: Cover Hero Slide (Split Layout 50:50)
  slides.push({
    slideNo: 1,
    type: 'Cover Hero (Executive Split)',
    eyebrow: 'EXECUTIVE PROPOSAL',
    title: topic,
    subtitle: 'Membangun Ekosistem Berkelanjutan, Berdaya Saing Tinggi, dan Memberikan Dampak Nyata',
    layout: 'Split 50:50 — Sisi Kiri: Judul Utama Tebal, Eyebrow Tag Emas, Visi Misi, dan 5 Badge Kategori; Sisi Kanan: Visual Fotorealistik 3D Rendering / Konsep Modern; Sisi Bawah: Pita Branding Elegan',
    categoryChips: ['STRATEGI', 'INOVASI', 'OPERASIONAL', 'TEKNOLOGI', 'EKSEKUSI'],
    bullets: [
      `Topik Utama: ${topic}`,
      `Disusun Oleh: ${presenter || 'Tim Inisiator'}`,
      `Target Audiens: ${audience || 'Pemangku Kepentingan'}`,
      'Rasio Standar: 16:9 Widescreen High Definition',
    ],
    speakerNotes: `Selamat datang Bapak/Ibu sekalian. Pada sesi ini, kami memaparkan secara komprehensif mengenai ${topic}, mencakup landasan strategis, formulasi pemecahan masalah, alur implementasi terukur, hingga simulasi pembiayaan dan roadmap eksekusi.`,
    visualPrompt: `16:9 widescreen presentation title slide, left side clean white/navy with bold modern typography "${topic}" and gold pill badges, right side realistic 3D architectural rendering of modern futuristic institution building under bright blue sky with professional people walking toward entrance, elegant dark navy and golden ribbon footer bar, studio quality lighting.`,
  });

  // SLIDE 2: Dasar & Latar Belakang (4 Numbered Cards + Right Column "CORE" Highlight Box)
  slides.push({
    slideNo: 2,
    type: 'Dasar Pemikiran & Core Pillar',
    eyebrow: 'LANDASAN STRATEGIS & MODALITAS',
    title: 'Dasar Pemikiran & Modal Strategis',
    subtitle: 'Mengoptimalkan momentum pertumbuhan dan merespon kebutuhan pasar secara terukur',
    layout: 'Grid 2-Kolom: Sisi Kiri 4 Kartu Bernomor (01-04); Sisi Kanan Kartu Sorot "CORE" Berkontras Tinggi dengan Badge Kuning',
    bullets: [
      '01. Kesinambungan Program: Integrasi berjenjang agar pembinaan dan pengembangan kompetensi berjalan berkelanjutan.',
      '02. Modal Kepercayaan Lembaga: Rekam jejak unggul dan reputasi positif yang telah terbangun kuat di mata stakeholder.',
      '03. Blueprint Jangka Panjang: Bagian terencana dari visi besar mencetak entitas percontohan yang adaptif terhadap masa depan.',
      '04. Skalabilitas & Jangkauan Pasar: Model yang teruji membuka potensi audiens dan target peserta lintas wilayah.',
    ],
    coreHighlight: {
      tag: 'CORE PRINCIPLE',
      body: 'Bukan sekadar menambah aktivitas baru, melainkan membangun ekosistem terpadu yang menghasilkan lulusan/output unggul, berkarakter, dan berdaya saing global.',
      output: 'Output Akhir: Kompetensi Teruji + Karakter Kokoh + Portofolio Nyata',
    },
    speakerNotes: 'Dasar pemikiran ini bertumpu pada 4 modal strategis utama. Di kotak CORE sebelah kanan terlihat intinya: fokus kita adalah menciptakan nilai tambah yang konkret dan terukur bagi semua pihak.',
    visualPrompt: `16:9 presentation slide, top header with gold tag "LANDASAN STRATEGIS", left side 4 clean horizontal cards with yellow/gold circular number badges (01, 02, 03, 04) with bold titles, right side a prominent tall dark navy blue card labeled CORE with golden badge and yellow output chip, crisp typography, clean background.`,
  });

  // SLIDE 3: Tantangan & Solusi (2x2 Grid + Bottom Full-Width Resolution Banner)
  slides.push({
    slideNo: 3,
    type: 'Tantangan Lapangan & Solusi Terarah (2x2 Grid)',
    eyebrow: 'ANALISIS TANTANGAN & FORMULASI',
    title: 'Tantangan Lapangan & Solusi Terarah',
    subtitle: 'Kunci keberhasilan eksekusi: diferensiasi nyata, indikator terukur, dan pembiayaan realistis',
    layout: '2x2 Problem Grid Cards (01-04) + Full-Width Dark Navy Solution Banner di Bagian Bawah dengan Badge Emas',
    bullets: [
      '01. Kesiapan Pasar & Edukasi: Membangun pemahaman audiens terhadap nilai tambah unik di fase awal.',
      '02. Standarisasi Kualitas Output: Menjamin konsistensi pencapaian target kompetensi di setiap tahapan.',
      '03. Efisiensi Biaya Operasional: Mengelola alokasi anggaran dan sumber daya secara ramping (lean model).',
      '04. Optimalisasi Waktu & Kurikulum: Menyeimbangkan teori formal dengan projek praktis dan studi kasus nyata.',
    ],
    solutionBanner: {
      badge: 'Diferensiasi = Terlihat, Terukur, dan Realistis',
      text: 'Menghadirkan ekosistem pembelajaran dan eksekusi yang menghasilkan bukti nyata (portofolio konkret), didukung mentor berpengalaman dan kemitraan industri.',
    },
    speakerNotes: 'Setiap tantangan lapangan telah kami petakan dengan mitigasi yang jelas. Kuncinya ada pada banner solusi di bawah: menghadirkan diferensiasi yang terlihat hasilnya secara nyata.',
    visualPrompt: `16:9 infographic slide, top gold title "Tantangan Lapangan", 2x2 grid of modern rounded cards with red/navy numbered circles, bottom full-width deep navy banner with gold pill badge "Diferensiasi = Terlihat, Terukur" and white solution summary text.`,
  });

  // SLIDE 4: 3-Pilar Positioning (3 Vertical Numbered Columns + Value Positioning Box)
  slides.push({
    slideNo: 4,
    type: '3 Pilar Positioning & Value Proposition',
    eyebrow: 'VALUE POSITIONING',
    title: '3 Pilar Utama Positioning',
    subtitle: 'Kombinasi seimbang antara fondasi karakter, keunggulan keilmuan, dan keahlian terapan',
    layout: '3 Kolom Kartu Vertikal Bernomor (1, 2, 3) dengan Kartu Tengah Disorot Navy Gelap + Kotak Value Positioning di Bawah',
    bullets: [
      'Pilar 1 (KARAKTER & INTEGRITAS): Pembentukan disiplin, kepemimpinan etis, etika profesional, dan tanggung jawab sosial.',
      'Pilar 2 (KOMPETENSI AKADEMIK / INTI): Penguasaan kurikulum standar tinggi, pemecahan masalah kritis, dan kesiapan kompetisi global.',
      'Pilar 3 (KETERAMPILAN DIGITAL & PRAKTIS): Penguasaan software tools, otomasi alur kerja, dan kemampuan memproduksi karya nyata.',
    ],
    valueStatement: 'Mencetak generasi dan talenta masa depan yang berintegritas tinggi, unggul secara keilmuan, dan memiliki keahlian teknis bernilai jual.',
    speakerNotes: 'Positioning kita berdiri di atas 3 pilar yang saling melengkapi. Pilar karakter sebagai pondasi, pilar kompetensi sebagai tiang, dan pilar keahlian praktis sebagai nilai jual langsung.',
    visualPrompt: `16:9 presentation slide showing 3 tall elegant vertical cards: Left card white with circle '1', Center card highlighted dark navy blue with circle '2' in gold, Right card white with circle '3', bottom wide card with golden label "Value Positioning", modern minimalist corporate style.`,
  });

  // SLIDE 5: Kerangka Alur Bertahap (3-Stage Timeline Columns)
  slides.push({
    slideNo: 5,
    type: 'Kerangka Alur & Roadmap Bertahap',
    eyebrow: 'FRAMEWORK IMPLEMENTASI',
    title: 'Alur Pembelajaran & Eksekusi 3 Tahap',
    subtitle: 'Pendekatan berjenjang: Fondasi Dasar, Spesialisasi Terarah, lalu Akselerasi Output',
    layout: '3 Kolom Timeline Vertikal (Tahap 1, Tahap 2, Tahap 3) dengan Badge OUTPUT Spesifik di Dasar Kolom',
    bullets: [
      'Tahap 1 (Fondasi & Literasi Dasar): Pemahaman prinsip inti, logika berpikir, pengenalan tools standar, dan etika kerja. [OUTPUT: 3 Karya Fondasi Awal]',
      'Tahap 2 (Spesialisasi & Projek Nyata): Penjurusan minat mendalam, simulasi studi kasus industri, dan pengerjaan projek mitra. [OUTPUT: 1 Produk/Solusi Siap Pakai]',
      'Tahap 3 (Finalisasi & Mentoring): Portofolio showcase, sertifikasi kompetensi, persiapan jenjang karir/lanjutan, dan mentoring adik tingkat. [OUTPUT: Portofolio Lengkap + Siap Terjun]',
    ],
    footnote: 'Catatan Strategis: Beban kerja dirancang proporsional agar target capaian utama di setiap fase tercapai 100% tanpa risiko kejenuhan.',
    speakerNotes: 'Framework ini menjamin setiap peserta melewati proses pematangan bertahap. Di tahap akhir, mereka tidak hanya memiliki sertifikat tetapi portofolio riil.',
    visualPrompt: `16:9 presentation slide showing 3 vertical curriculum roadmap columns with dark navy pill headers (Fase 1, Fase 2, Fase 3), bullet points, and highlighted bottom rectangular OUTPUT boxes, bottom note banner in soft grey.`,
  });

  // SLIDE 6: Jalur Peminatan / Track Spesialisasi
  slides.push({
    slideNo: 6,
    type: 'Jalur Peminatan Keahlian (A, B, C)',
    eyebrow: 'PILIHAN SPESIALISASI TERAPAN',
    title: 'Jalur Keahlian Terapan Sesuai Potensi',
    subtitle: 'Memberikan ruang fokus bagi setiap individu untuk mengasah keahlian unggulan spesifik',
    layout: '3 Kartu Jalur dengan Badge Huruf Besar Berlingkar (A, B, C) + Sub-Skill Chips & Target Luaran',
    bullets: [
      'Jalur A (CREATIVE & DESIGN): Identitas visual, media promosi, konten digital, dan user interface design. (Sub-skill: Brand Visuals, Social Media Feed, UI Wireframe)',
      'Jalur B (TECH & DEVELOPMENT): Pembuatan aplikasi web, landing page interaktif, basis data ringan, dan integrasi sistem. (Sub-skill: Web App, Landing Page, Automations)',
      'Jalur C (AI & PRODUCTIVITY): AI workflow optimization, chatbot interaktif, data analysis, dan riset berbasis generative AI. (Sub-skill: Chatbot AI, Workflow Prompts, Data Insights)',
    ],
    speakerNotes: 'Setiap peserta diarahkan memilih 1 jalur spesialisasi utama agar fokus belajarnya tajam dan menghasilkan karya yang mendalam.',
    visualPrompt: `16:9 infographic slide, 3 vertical cards featuring large circular badge letters (A in gold, B in navy blue, C in green), descriptive text, and pill badges for each sub-topic, clean minimalist aesthetic.`,
  });

  // SLIDE 7: Projek Portofolio 4 Kuadran
  slides.push({
    slideNo: 7,
    type: 'Portofolio Karya Nyata (4 Kuadran)',
    eyebrow: 'PORTOFOLIO BERNILAI JUAL',
    title: 'Penerapan Karya Nyata & Dampak Langsung',
    subtitle: 'Keahlian dibuktikan melalui hasil karya konkret yang dapat diuji dan bermanfaat bagi publik',
    layout: '4 Kuadran Kartu Modern (Internal, Kemitraan UMKM, Sosial & Komunitas, Portofolio Mandiri) + Bar Target Capaian di Bawah',
    bullets: [
      '1. Kebutuhan Internal & Organisasi: Sistem informasi terpadu, media promosi resmi, template operasional, dan materi publikasi.',
      '2. Kemitraan UMKM & Usaha Lokal: Pembuatan katalog digital, branding kemasan produk, dan landing page penjualan.',
      '3. Sosial & Komunitas Publik: Media dakwah/edukasi, website informasi kegiatan sosial, dan publikasi komunitas.',
      '4. Portofolio & Personal Branding: Website portofolio mandiri, showcase hasil karya digital, dan sertifikat kompetensi terverifikasi.',
    ],
    targetBar: 'Standar Target Capaian: Fase 1 = 3 Karya Fondasi | Fase 2 = 1 Produk Teruji | Fase 3 = Portofolio Lengkap Siap Industri.',
    speakerNotes: 'Karya nyata ini yang membedakan program kita dengan yang lain. Hasil kerja peserta langsung digunakan oleh organisasi, UMKM, dan masyarakat.',
    visualPrompt: `16:9 presentation slide, 4 quadrant modern white cards with gold/navy icons, bottom dark navy target banner with golden text summarizing student output milestones.`,
  });

  // SLIDE 8: Simulasi Anggaran & SDM Ramping (Corporate Table)
  slides.push({
    slideNo: 8,
    type: 'Simulasi Pembiayaan & SDM Operasional',
    eyebrow: 'STRUKTUR ANGGARAN & EFISIENSI',
    title: 'Simulasi Pembiayaan & SDM Tahun Pertama',
    subtitle: 'Pola operasional ramping (lean model): maksimalkan tim internal, libatkan mentor praktisi',
    layout: 'Tabel Finansial Data Bersih di Sisi Kiri + Kartu Prinsip Efisiensi di Sisi Kanan + Baris Total Emas',
    bullets: [
      'Koordinator Program & Manajerial (Internal Organisasi) = Alokasi Terpadu / Included',
      'Instruktur / Tenaga Ahli Utama (Tim Internal Inti) = Estimasi Rp18.000.000 / th',
      'Mentor Praktisi Spesialisasi (Freelance / Kemitraan) = Estimasi Rp36.000.000 / th (3 Mentor)',
      'Narasumber Tamu & Workshop Khusus (4 Sesi Per Tahun) = Rp2.000.000 / th',
      'TOTAL ALOKASI SDM MINIMAL TAHUN PERTAMA = Rp56.000.000 / tahun',
    ],
    principles: [
      '1. Jangan semua dijadikan beban tetap; optimalkan skema kemitraan praktisi.',
      '2. Mentor fokus hadir pada sesi klinik projek, bootcamp intensif, dan evaluasi.',
      '3. Transfer knowledge ke tim internal agar institusi memiliki kemandirian jangka panjang.',
    ],
    speakerNotes: 'Dari aspek finansial, kita mengusung prinsip lean execution. Alokasi SDM dibuat sangat efisien dengan menggandeng praktisi industri secara fleksibel.',
    visualPrompt: `16:9 corporate financial slide, clean data table on left with blue header and gold total row, right side dark navy callout card with yellow title "Prinsip Efisiensi Biaya" and numbered checklist.`,
  });

  // SLIDE 9: Proyeksi Pendanaan & Skema Keberlanjutan
  slides.push({
    slideNo: 9,
    type: 'Proyeksi Pendanaan & Target Alokasi',
    eyebrow: 'PROYEKSI KEUANGAN & SPONSORSHIP',
    title: 'Proyeksi Kebutuhan & Target Pendanaan Awal',
    subtitle: 'Perhitungan kebutuhan investasi awal, operasional tahun pertama, dan skema kemitraan pendanaan',
    layout: 'Dual-Table Layout: Komponen Alokasi Utama vs Sumber Pendanaan + 4 Kartu Metrik Finansial di Bawah',
    bullets: [
      'Total Kebutuhan Biaya Operasional Penuh (Batch Awal) = Rp950.000.000',
      'Estimasi Penerimaan Mandiri & Registrasi = Rp171.000.000',
      'Alokasi Skema Beasiswa / Subsidi Kemitraan = Rp779.000.000',
      'Investasi Infrastruktur & Perangkat Awal = Rp49.100.000',
      'TOTAL TARGET KEBUTUHAN PENDANAAN AWAL = Rp828.100.000 (Target Sponsor: Rp800 - 900 Juta)',
    ],
    speakerNotes: 'Berikut proyeksi kebutuhan dana tahun pertama. Target kemitraan dan sponsorship dipatok pada angka Rp800-900 juta untuk mengamankan operasional penuh.',
    visualPrompt: `16:9 financial projection presentation slide with clean tables, 4 colorful bottom metric cards (Dark Blue, Emerald Green, Coral Red, Gold) showing key financial totals, professional BCG style.`,
  });

  // SLIDE 10: Roadmap Eksekusi 4 Tahap & Agenda Keputusan
  slides.push({
    slideNo: 10,
    type: 'Roadmap Eksekusi & Agenda Keputusan',
    eyebrow: 'ROADMAP IMPLEMENTASI & KEPUTUSAN',
    title: 'Roadmap Eksekusi & Agenda Keputusan Rapat',
    subtitle: 'Agar proposal tidak berhenti sebagai wacana, dibutuhkan kesepakatan langkah awal yang terukur',
    layout: '4 Kartu Milestone Horizontal di Atas + Kotak Checklist Gelap "Yang Harus Segera Disepakati" di Tengah + Pita Emas Penutup',
    bullets: [
      'Fase 1 (Bulan 0 - 3): Finalisasi konsep kurikulum, target luaran, skema pendanaan, dan materi sosialisasi.',
      'Fase 2 (Bulan 3 - 6): Persiapan modul teknis, setup infrastruktur/LMS, MoU mentor mitra, dan rekrutmen peserta.',
      'Fase 3 (Bulan 6 - 12): Program berjalan, pendampingan projek, pembuatan portofolio awal, dan evaluasi berkala.',
      'Fase 4 (Tahun Kedua): Akselerasi kompetensi lanjutan, uji sertifikasi, pameran karya publik (showcase), dan ekspansi skala.',
    ],
    actionChecklist: [
      '1. Menyetujui positioning program berbasis integritas, keunggulan inti, dan portofolio keahlian terapan.',
      '2. Menyetujui pembukaan 3 jalur peminatan spesialisasi awal.',
      '3. Menyetujui target penggalangan kemitraan dan sponsor tahap awal.',
      '4. Membentuk tim taskforce kecil untuk penyiapan kurikulum, operasional, dan kemitraan strategis.',
    ],
    goldenTakeaway: 'Mulai dari yang terencana dan sederhana, jalankan secara konsisten, lalu bertumbuh secara bertahap.',
    speakerNotes: 'Sebagai penutup, ada 4 poin keputusan yang kami ajukan hari ini. Prinsip kita: mulai terencana, jalankan konsisten, lalu naik kelas secara bertahap.',
    visualPrompt: `16:9 presentation slide showing 4 horizontal roadmap milestones at top with dark blue badge headers, a large dark navy container at middle labeled "Yang Harus Segera Disepakati" with 4 golden check items, bottom warm gold ribbon with inspirational quote, executive finish.`,
  });

  // 1. FORMAT NOTEBOOKLM (DEEP EXECUTIVE BRIEFING DOCUMENT)
  const notebookLmDoc = `# DOKUMEN SUMBER EKSEKUTIF (NOTEBOOKLM BRIEFING DOC)
**Judul Dokumen**: ${topic}
**Inisiator / Presenter**: ${presenter || 'Tim Penyusun'}
**Target Stakeholder**: ${audience || 'Pemangku Kepentingan'}
**Kategori**: ${useCaseObj.name}
**Tanggal Formulasi**: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
Inisiatif **"${topic}"** dirancang sebagai respons strategis terhadap dinamika kebutuhan masa depan. Dokumen ini merangkum formulasi komprehensif mulai dari pemetaan tantangan lapangan, 3 pilar positioning diferensiasi, kerangka kurikulum/alur bertahap, simulasi pembiayaan ramping (lean operational model), proyeksi kebutuhan pendanaan, hingga roadmap implementasi 4 tahap dan agenda persetujuan rapat.

**Poin-Poin Kunci & Penekanan**:
${keyPoints ? keyPoints.split(',').map(p => `- ${p.trim()}`).join('\n') : '- Pendekatan terencana, eksekusi lean, berorientasi output nyata dan portofolio terukur.'}

---

## 2. LANDASAN STRATEGIS & ANALISIS TANTANGAN
### Modalitas & Dasar Pemikiran:
1. **Kesinambungan Ekosistem**: Membangun kesinambungan pembinaan berjenjang agar pengembangan kompetensi berjalan berkelanjutan.
2. **Modal Kepercayaan & Reputasi**: Memanfaatkan reputasi positif yang telah terbangun kuat sebagai fondasi penerimaan pasar.
3. **Blueprint Jangka Panjang**: Bagian terencana dari visi besar mencetak entitas percontohan yang adaptif terhadap masa depan.
4. **Skalabilitas Model**: Menjangkau audiens potensial yang lebih luas dengan model operasional yang teruji.

### Matriks Tantangan & Solusi Diferensiasi:
* **Tantangan 1 (Edukasi Pasar)**: Perlunya sosialisasi yang masif mengenai nilai tambah unik sejak fase awal.
* **Tantangan 2 (Konsistensi Kualitas Output)**: Menjaga standar capaian di setiap modul agar setiap individu menghasilkan portofolio riil.
* **Tantangan 3 (Efisiensi Biaya Operasional)**: Menjaga rasio biaya operasional tetap ramping tanpa menurunkan mutu layanan.
* **Solusi Terarah**: Diferensiasi yang terlihat hasilnya, terukur indikatornya, dan realistis alokasi pembiayaannya.

---

## 3. FORMULASI 3 PILAR UTAMA POSITIONING
Program ini mengintegrasikan 3 dimensi keunggulan:
1. **Pilar 1: Karakter & Integritas**: Pembentukan disiplin, kepemimpinan etis, etika profesional, dan komitmen moral.
2. **Pilar 2: Keunggulan Kompetensi Inti**: Penguasaan kurikulum standar tinggi, pemecahan masalah kritis, dan kesiapan kompetisi.
3. **Pilar 3: Keahlian Digital & Terapan**: Penguasaan software tools modern, otomasi kerja, dan kemampuan memproduksi karya nyata bernilai jual.

---

## 4. KERANGKA ALUR IMPLEMENTASI & JALUR PEMINATAN
### Alur 3 Tahap:
* **Tahap 1 (Fondasi & Literasi Dasar)**: Penguasaan konsep dasar, logika berpikir, dan tools standar. (*Target Luaran: 3 Karya Fondasi*).
* **Tahap 2 (Spesialisasi & Projek Nyata)**: Pengerjaan studi kasus industri dan projek mitra nyata. (*Target Luaran: 1 Produk Siap Pakai*).
* **Tahap 3 (Finalisasi & Mentoring)**: Portofolio showcase, uji sertifikasi, dan persiapan jenjang profesional. (*Target Luaran: Portofolio Lengkap*).

### 3 Jalur Spesialisasi:
* **Jalur A (Creative & Visual Design)**: Brand identity, UI/UX wireframe, media promosi, dan digital asset.
* **Jalur B (Tech & Web Development)**: Modern web apps, landing page interaktif, database, dan integrasi workflow.
* **Jalur C (AI & Workflow Productivity)**: AI automation prompts, custom chatbot, data analysis, dan riset terapan.

---

## 5. SIMULASI FINANSIAL & ANGGARAN RAMPING
### Prinsip Efisiensi Alokasi SDM:
* Tim Manajerial & Koordinator dioptimalkan dari internal organisasi.
* Instruktur Inti dialokasikan secara terfokus (Estimasi ~Rp18 Juta/th).
* Mentor Praktisi Spesialisasi dilibatkan secara kemitraan/freelance (Estimasi 3 Mentor ~Rp36 Juta/th).
* Narasumber Tamu & Workshop Khusus 4 sesi per tahun (~Rp2 Juta/th).
* **Total Alokasi SDM Minimal Tahun Pertama**: Rp56.000.000 / tahun.

### Proyeksi Kebutuhan & Target Pendanaan:
* Total Kebutuhan Biaya Operasional Penuh Batch Awal: ~Rp950.000.000.
* Estimasi Penerimaan Mandiri Peserta: ~Rp171.000.000.
* Alokasi Subsidi / Beasiswa Kemitraan: ~Rp779.000.000.
* Investasi Awal Infrastruktur & Perangkat: ~Rp49.100.000.
* **Target Kebutuhan Penggalangan Dana & Sponsor**: Rp800.000.000 - Rp900.000.000.

---

## 6. ROADMAP EKSEKUSI & AGENDA KEPUTUSAN
* **Fase 1 (Bulan 0 - 3)**: Finalisasi konsep kurikulum, target luaran, skema pendanaan, dan materi sosialisasi.
* **Fase 2 (Bulan 3 - 6)**: Penyiapan modul teknis, setup infrastruktur, MoU mitra mentor, dan rekrutmen awal.
* **Fase 3 (Bulan 6 - 12)**: Pelaksanaan program, pendampingan projek, pembuatan portofolio awal, dan evaluasi.
* **Fase 4 (Tahun Kedua)**: Akselerasi kompetensi lanjutan, uji sertifikasi, pameran karya (showcase), dan ekspansi skala.

### Butir Kesepakatan Rapat (Action Items):
1. Menyetujui positioning program berbasis integritas, keunggulan inti, dan portofolio keahlian terapan.
2. Menyetujui pembukaan 3 jalur peminatan spesialisasi awal.
3. Menyetujui target penggalangan kemitraan dan sponsor tahap awal.
4. Membentuk tim taskforce kecil untuk penyiapan kurikulum, operasional, dan kemitraan strategis.`;

  // 2. FORMAT GAMMA.APP / SLIDES AI OUTLINE
  const gammaOutline = `# ${topic}
## ${currentSlide.subtitle || 'Executive Strategic Presentation Deck'}

${slides.map((s) => `
---

### Slide ${s.slideNo}: ${s.title}
*${s.subtitle}*

${s.bullets.map((b) => `- ${b}`).join('\n')}
${s.coreHighlight ? `\n> **${s.coreHighlight.tag}**: ${s.coreHighlight.body}\n> *${s.coreHighlight.output}*` : ''}
${s.solutionBanner ? `\n> **${s.solutionBanner.badge}**: ${s.solutionBanner.text}` : ''}
${s.actionChecklist ? `\n**Action Items Kesepakatan:**\n${s.actionChecklist.map(a => `- [x] ${a}`).join('\n')}` : ''}
${s.goldenTakeaway ? `\n**Key Takeaway**: ${s.goldenTakeaway}` : ''}

*Visual Layout Idea: ${s.layout}*
`).join('\n')}
`;

  // 3. FORMAT VBA POWERPOINT MACRO (NATIVE 1-CLICK GENERATOR, ZERO CORRUPTION)
  const vbaMacro = `' ==============================================================================
' SMARTFEED AI - POWERPOINT 16:9 SLIDE DECK BUILDER (VBA MACRO)
' ==============================================================================
' CARA MENGGUNAKAN DI POWERPOINT:
' 1. Buka Microsoft PowerPoint baru.
' 2. Tekan tombol [Alt + F11] pada keyboard untuk membuka VBA Editor.
' 3. Klik menu: Insert > Module.
' 4. Paste SELURUH kode VBA ini ke dalam layar editor.
' 5. Tekan tombol [F5] atau klik tombol Run (Play hijau).
' 6. Presentasi 16:9 eksekutif dengan warna tema & layout langsung terbuat rapi!
' ==============================================================================

Sub BuildExecutivePresentation()
    Dim pptPres As Presentation
    Dim sld As Slide
    Dim shpTitle As Shape, shpSub As Shape, shpBox As Shape, shpFoot As Shape
    Dim sldWidth As Single, sldHeight As Single
    
    Set pptPres = ActivePresentation
    
    ' Atur Ukuran 16:9 Widescreen (13.33 x 7.5 inches)
    sldWidth = 960
    sldHeight = 540
    pptPres.PageSetup.SlideWidth = sldWidth
    pptPres.PageSetup.SlideHeight = sldHeight
    
    ' Hapus slide kosong jika ada
    Do While pptPres.Slides.Count > 0
        pptPres.Slides(1).Delete
    Loop

    ' -------------------------------------------------------------
    ' SLIDE 1: COVER HERO
    ' -------------------------------------------------------------
    Set sld = pptPres.Slides.Add(1, ppLayoutBlank)
    sld.Background.Fill.Solid
    sld.Background.Fill.ForeColor.RGB = RGB(0, 45, 98) ' Dark Navy
    
    ' Eyebrow Tag
    Set shpBox = sld.Shapes.AddShape(msoShapeRoundedRectangle, 50, 60, 180, 28)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(234, 170, 0)
    shpBox.Line.Visible = msoFalse
    shpBox.TextFrame.TextRange.Text = "EXECUTIVE PROPOSAL"
    shpBox.TextFrame.TextRange.Font.Bold = msoTrue
    shpBox.TextFrame.TextRange.Font.Size = 10
    shpBox.TextFrame.TextRange.Font.Color.RGB = RGB(0, 45, 98)
    
    ' Title
    Set shpTitle = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 100, 520, 160)
    shpTitle.TextFrame.TextRange.Text = "${topic.replace(/"/g, '""')}"
    shpTitle.TextFrame.TextRange.Font.Bold = msoTrue
    shpTitle.TextFrame.TextRange.Font.Size = 28
    shpTitle.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Subtitle
    Set shpSub = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 270, 520, 60)
    shpSub.TextFrame.TextRange.Text = "Membangun Ekosistem Berkelanjutan, Berdaya Saing Tinggi & Berdampak Nyata"
    shpSub.TextFrame.TextRange.Font.Size = 14
    shpSub.TextFrame.TextRange.Font.Color.RGB = RGB(220, 230, 242)
    
    ' Presenter & Audience Card
    Set shpBox = sld.Shapes.AddShape(msoShapeRoundedRectangle, 50, 360, 520, 65)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(10, 60, 120)
    shpBox.Line.Color.RGB = RGB(234, 170, 0)
    shpBox.TextFrame.TextRange.Text = "Disusun Oleh: ${presenter.replace(/"/g, '""')}  |  Audiens: ${audience.replace(/"/g, '""')}"
    shpBox.TextFrame.TextRange.Font.Size = 11
    shpBox.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Right Visual Container Box
    Set shpBox = sld.Shapes.AddShape(msoShapeRoundedRectangle, 610, 60, 300, 365)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(15, 23, 42)
    shpBox.Line.Color.RGB = RGB(234, 170, 0)
    shpBox.TextFrame.TextRange.Text = "VISUAL 3D CONCEPT" & vbCrLf & vbCrLf & "[High-Impact Architectural / Product Render]"
    shpBox.TextFrame.TextRange.Font.Bold = msoTrue
    shpBox.TextFrame.TextRange.Font.Size = 14
    shpBox.TextFrame.TextRange.Font.Color.RGB = RGB(234, 170, 0)

${slides.slice(1).map((s, idx) => `
    ' -------------------------------------------------------------
    ' SLIDE ${s.slideNo}: ${s.title.replace(/"/g, '""')}
    ' -------------------------------------------------------------
    Set sld = pptPres.Slides.Add(${s.slideNo}, ppLayoutBlank)
    sld.Background.Fill.Solid
    sld.Background.Fill.ForeColor.RGB = RGB(244, 247, 250) ' Clean Ice White
    
    ' Header Bar Navy
    Set shpBox = sld.Shapes.AddShape(msoShapeRectangle, 0, 0, sldWidth, 80)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(0, 45, 98)
    shpBox.Line.Visible = msoFalse
    
    ' Eyebrow
    Set shpSub = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 40, 10, 600, 20)
    shpSub.TextFrame.TextRange.Text = "${(s.eyebrow || 'EXECUTIVE PRESENTATION').replace(/"/g, '""')}"
    shpSub.TextFrame.TextRange.Font.Bold = msoTrue
    shpSub.TextFrame.TextRange.Font.Size = 9
    shpSub.TextFrame.TextRange.Font.Color.RGB = RGB(234, 170, 0)
    
    ' Title
    Set shpTitle = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 40, 28, 800, 45)
    shpTitle.TextFrame.TextRange.Text = "${s.title.replace(/"/g, '""')}"
    shpTitle.TextFrame.TextRange.Font.Bold = msoTrue
    shpTitle.TextFrame.TextRange.Font.Size = 18
    shpTitle.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Content Card 1
    Set shpBox = sld.Shapes.AddShape(msoShapeRoundedRectangle, 40, 105, 550, 360)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(255, 255, 255)
    shpBox.Line.Color.RGB = RGB(210, 220, 230)
    shpBox.TextFrame.TextRange.Text = "${s.bullets.slice(0, 4).join('\n\n').replace(/"/g, '""').replace(/\n/g, '" & vbCrLf & "')}"
    shpBox.TextFrame.TextRange.Font.Size = 11
    shpBox.TextFrame.TextRange.Font.Color.RGB = RGB(15, 23, 42)
    
    ' Right Highlight Container
    Set shpBox = sld.Shapes.AddShape(msoShapeRoundedRectangle, 610, 105, 310, 360)
    shpBox.Fill.Solid: shpBox.Fill.ForeColor.RGB = RGB(0, 45, 98)
    shpBox.Line.Color.RGB = RGB(234, 170, 0)
    shpBox.TextFrame.TextRange.Text = "KEY TAKEAWAY & FORMULA" & vbCrLf & vbCrLf & "${(s.coreHighlight?.body || s.solutionBanner?.text || s.valueStatement || s.goldenTakeaway || s.subtitle).replace(/"/g, '""')}"
    shpBox.TextFrame.TextRange.Font.Bold = msoTrue
    shpBox.TextFrame.TextRange.Font.Size = 12
    shpBox.TextFrame.TextRange.Font.Color.RGB = RGB(255, 255, 255)
    
    ' Footer Bar
    Set shpFoot = sld.Shapes.AddShape(msoShapeRectangle, 0, 515, sldWidth, 25)
    shpFoot.Fill.Solid: shpFoot.Fill.ForeColor.RGB = RGB(0, 45, 98)
    shpFoot.Line.Visible = msoFalse
    shpFoot.TextFrame.TextRange.Text = "${topic.replace(/"/g, '""')}  |  Slide ${s.slideNo}"
    shpFoot.TextFrame.TextRange.Font.Size = 9
    shpFoot.TextFrame.TextRange.Font.Color.RGB = RGB(234, 170, 0)
`).join('\n')}

    MsgBox "Berhasil! " & pptPres.Slides.Count & " Slide Presentasi Eksekutif 16:9 Telah Selesai Dibuat!", vbInformation, "SmartFeed AI Studio"
End Sub`;

  // 4. MASTER PROMPT (AI GENERATOR / CLAUDE / CHATGPT / GEMINI)
  const markdownPrompt = `# MASTER PROMPT: EXECUTIVE 16:9 PRESENTATION DECK GENERATOR
**Standar Desain**: Masterclass Executive Layout (McKinsey & BCG Style)
**Topik Presentasi**: ${topic}
**Presenter / Tim**: ${presenter || 'Tim Penyusun'}
**Target Audiens**: ${audience || 'Pemangku Kepentingan'}
**Gaya Visual**: ${styleObj.name}
**Jumlah Slide**: ${slides.length} Slide Lengkap

---

## PANDUAN STRUKTUR SLIDE (SLIDE BY SLIDE BREAKDOWN)

${slides.map((s) => `
### SLIDE ${s.slideNo}: ${s.title.toUpperCase()}
- **Tipe Slide**: ${s.type}
- **Eyebrow Tag**: ${s.eyebrow || '-'}
- **Sub-Judul**: ${s.subtitle}
- **Layout & Visual Composition**: ${s.layout}
- **Poin Kunci & Konten**:
${s.bullets.map((b) => `  * ${b}`).join('\n')}
${s.coreHighlight ? `- **Highlight Box (CORE)**: "${s.coreHighlight.body}" | Tag: ${s.coreHighlight.tag} | Output: ${s.coreHighlight.output}\n` : ''}${s.solutionBanner ? `- **Bottom Solution Banner**: [${s.solutionBanner.badge}] "${s.solutionBanner.text}"\n` : ''}${s.valueStatement ? `- **Value Statement Box**: "${s.valueStatement}"\n` : ''}${s.targetBar ? `- **Target Milestone Bar**: "${s.targetBar}"\n` : ''}${s.principles ? `- **Prinsip Utama**: ${s.principles.join(' | ')}\n` : ''}${s.actionChecklist ? `- **Action Items Keputusan**: \n${s.actionChecklist.map((a) => `    ${a}`).join('\n')}\n` : ''}${s.goldenTakeaway ? `- **Golden Ribbon Takeaway**: "${s.goldenTakeaway}"\n` : ''}
${includeSpeakerNotes ? `- **Speaker Notes**: "${s.speakerNotes}"\n` : ''}
${includeVisualPrompts ? `- **AI Image Prompt (16:9)**: \`\`\`${s.visualPrompt}\`\`\`\n` : ''}
`).join('\n---\n')}

---

## PETUNJUK IMPLEMENTASI DESAIN KE SLIDE BUILDERS (NOTEBOOKLM / GAMMA / CANVA / POWERPOINT)
1. **Google NotebookLM**: Upload file .md ini sebagai "Source Document" untuk membuat podcast ringkasan audio & FAQ eksekutif secara otomatis.
2. **Gamma.app / Canva AI**: Copy outline untuk langsung generate 16:9 presentasi visual otomatis dengan 1-click import.
3. **PowerPoint Native**: Gunakan script VBA resmi di SmartFeed Studio (Alt + F11) untuk membuat slide bebas error korupsi file.`;

  return {
    slides,
    notebookLmDoc,
    gammaOutline,
    vbaMacro,
    markdownPrompt,
    masterPrompt: markdownPrompt,
    totalSlides: slides.length,
    styleObj,
    useCaseObj,
  };
}
