import { PRESENTATION_USE_CASES, PRESENTATION_STYLES } from '../data/presentationOptions.js';

export const INITIAL_PRESENTATION = {
  topic: 'Konsep Pendirian SMA IT Plus Robbani Boarding School',
  presenter: 'Tim Perumus Yayasan',
  audience: 'Dewan Pembina Yayasan & Calon Stakeholder',
  useCase: 'executive_concept',
  style: 'executive_navy_gold',
  slideCount: 10,
  keyPoints: 'Integrasi Tahfizh 15 Juz + Kesiapan Masuk PTN + Software Skill IT (Desain, Coding, AI), Boarding school membuka pasar luar daerah, simulasi anggaran 25 siswa, roadmap implementasi 4 tahap.',
  includeSpeakerNotes: true,
  includeVisualPrompts: true,
};

export function buildPresentation(state) {
  const {
    topic = '',
    presenter = '',
    audience = '',
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

  // SLIDE 1: Cover Hero Slide (Split Layout: Big Typography + Architectural 3D Photo)
  slides.push({
    slideNo: 1,
    type: 'Cover Hero (Executive Split)',
    eyebrow: 'KONSEP & PENDIRIAN',
    title: topic || 'Konsep Pendirian Institusi Unggul',
    subtitle: 'Membangun Generasi Berilmu, Beriman, Berkarya, dan Bermanfaat untuk Umat',
    layout: 'Split 50:50 — Left: Large Title, Eyebrow, Vision, Category Badges; Right: Photorealistic 3D Architecture with Walking Students; Bottom: Dark Navy & Gold Ribbon Branding Bar',
    categoryChips: ['QUR\'AN', 'PTN', 'DESAIN', 'PEMROGRAMAN', 'AI'],
    bullets: [
      `Topik Utama: ${topic}`,
      `Disusun Oleh: ${presenter || 'Tim Inisiator'}`,
      `Target Audiens: ${audience || 'Stakeholder & Dewan Pembina'}`,
      'Format Rasio: 16:9 Widescreen High Definition',
    ],
    speakerNotes: `Bismillah. Selamat datang Bapak/Ibu sekalian. Pada presentasi ini, kita akan membahas ${topic} secara komprehensif mulai dari dasar filosofis, diferensiasi pasar, kurikulum implementatif, hingga simulasi anggaran tahun pertama.`,
    visualPrompt: `16:9 widescreen presentation slide, left side clean white with bold navy typography "${topic}" and golden badges, right side realistic 3D architectural render of a modern Islamic boarding school building under bright blue sky with Indonesian students wearing uniform and backpacks walking toward the entrance, elegant corporate navy and golden ribbon footer bar, ultra-high resolution.`,
  });

  // SLIDE 2: Dasar Pendirian (4 Numbered Cards + Right Column "CORE" Highlight Box)
  slides.push({
    slideNo: 2,
    type: 'Dasar Pendirian & Core Pillar',
    eyebrow: 'DASAR & LATAR BELAKANG',
    title: 'Dasar Pendirian & Modal Strategis',
    subtitle: 'Menguatkan kesinambungan dakwah pendidikan dan merespon potensi pertumbuhan',
    layout: 'Grid 2-Column: Left Side 4 Numbered Cards (01-04); Right Side Dark Navy High-Contrast "CORE" Card with Yellow Badge',
    bullets: [
      '01. Kesinambungan Jenjang: Lanjutan strategis dari jenjang dasar/menengah agar pembinaan tidak terputus.',
      '02. Modal Kepercayaan Lembaga: Rekam jejak unggul belasan tahun yang diakui masyarakat.',
      '03. Blueprint Pengembangan Jangka Panjang: Bagian dari visi besar mencetak institusi pendidikan rujukan.',
      '04. Skema Boarding Membuka Pasar: Menjangkau calon siswa potensial lintas daerah tanpa batas lokal.',
    ],
    coreHighlight: {
      tag: 'CORE',
      body: 'Tidak hanya menambah unit baru, tapi menyiapkan jenjang strategis untuk melahirkan kader berilmu, beriman, berkarya, dan siap memimpin masa depan.',
      output: 'Output Akhir: Qur\'an + PTN + Skill Digital',
    },
    speakerNotes: 'Dasar pendirian ini bertumpu pada 4 pilar modal strategis. Kuncinya ada pada kotak CORE di kanan: kita tidak sekadar membangun fisik, tetapi menyiapkan ekosistem kaderisasi yang terintegrasi.',
    visualPrompt: `16:9 presentation slide, top gold header "Dasar Pendirian", left side 4 clean horizontal cards with yellow/gold circular number badges (01, 02, 03, 04) with bold titles, right side a prominent tall dark navy blue card labeled CORE with golden badge and yellow output chip, crisp typography, clean background.`,
  });

  // SLIDE 3: Tantangan & Solusi (2x2 Grid + Bottom Full-Width Resolution Banner)
  slides.push({
    slideNo: 3,
    type: 'Tantangan & Solusi (2x2 Grid)',
    eyebrow: 'ANALISIS TANTANGAN & FORMULASI',
    title: 'Tantangan Lapangan & Solusi Terarah',
    subtitle: 'Kunci bertahan: diferensiasi nyata, terukur, dan pembiayaan yang realistis',
    layout: '2x2 Problem Grid Cards (01-04) + Full-Width Dark Navy Solution Banner at Bottom with Gold Badge',
    bullets: [
      '01. Kepercayaan Orang Tua: Kekhawatiran jaminan tembus PTN favorit.',
      '02. Kematangan Pasar Baru: Edukasi nilai tambah di tahun-tahun awal operasional.',
      '03. Beban Operasional Boarding: Pengelolaan biaya asrama, pembina, dan guru berkualitas.',
      '04. Keterbatasan Jam Formal: Optimalisasi kurikulum non-formal lewat IT Club, bootcamp, dan projek nyata.',
    ],
    solutionBanner: {
      badge: 'Diferensiasi = Terlihat, Terukur, dan Realistis',
      text: 'Institusi diposisikan sebagai sekolah unggul yang tetap kuat di PTN dan Tahfizh, plus memiliki skill digital implementatif yang menghasilkan portofolio nyata siswa.',
    },
    speakerNotes: 'Menghadapi 4 tantangan utama di lapangan, solusi kita bukan bertarung di hal konvensional, melainkan menyajikan diferensiasi yang terlihat hasilnya dan langsung dirasakan orang tua.',
    visualPrompt: `16:9 infographic slide, top gold title "Tantangan Lapangan", 2x2 grid of modern rounded cards with red/navy numbered circles, bottom full-width deep navy banner with gold pill badge "Diferensiasi = Terlihat, Terukur" and white solution summary text.`,
  });

  // SLIDE 4: 3-Pillar Positioning (3 Vertical Numbered Columns + Value Positioning Box)
  slides.push({
    slideNo: 4,
    type: 'Pillar Positioning (3 Columns)',
    eyebrow: 'VALUE POSITIONING',
    title: '3 Pilar Utama Positioning',
    subtitle: 'Integrasi holistik antara karakter spiritual, akademis, dan keahlian digital masa depan',
    layout: '3 Vertical Numbered Cards (1, 2, 3) with Center Card Highlighted in Deep Blue + Bottom Value Statement Box',
    bullets: [
      'Pilar 1 (QUR\'AN & ADAB): Target tahfizh terukur, pembinaan karakter, adab harian, ibadah, dan kepemimpinan islami.',
      'Pilar 2 (AKADEMIK & PTN): Kurikulum nasional integratif, pemetaan jurusan sejak dini, bimbingan intensif try-out masuk PTN.',
      'Pilar 3 (SKILL IT & DIGITAL): Desain, Pemrograman, dan AI melalui Mulok, IT Club, projek portofolio, dan sertifikasi.',
    ],
    valueStatement: 'Membentuk generasi Qur\'ani, unggul akademik, siap tembus PTN, dan memiliki skill digital yang menghasilkan karya nyata.',
    speakerNotes: 'Positioning kita berdiri di atas 3 pilar seimbang: Qur\'an, Akademik PTN, dan Skill IT. Ketiganya tidak saling meniadakan tetapi saling menguatkan nilai jual siswa.',
    visualPrompt: `16:9 presentation slide showing 3 tall elegant vertical cards: Left card white with circle '1', Center card highlighted dark navy blue with circle '2' in gold, Right card white with circle '3', bottom wide card with golden label "Value Positioning", modern minimalist corporate style.`,
  });

  // SLIDE 5: Kerangka Kurikulum Bertahap (3-Year Vertical Pipeline)
  slides.push({
    slideNo: 5,
    type: 'Kurikulum & Alur 3 Tahun',
    eyebrow: 'FRAMEWORK PEMBELAJARAN',
    title: 'Kurikulum Bertahap Kelas X - XII',
    subtitle: 'Alur 3 tahun: Fundamental, Spesialisasi & Portofolio, lalu Fokus PTN dan Mentoring',
    layout: '3 Vertical Timeline Columns (Kelas X, Kelas XI, Kelas XII) with Bottom OUTPUT Badges + Footnote Banner',
    bullets: [
      'Kelas X (Fundamental Digital): Literasi data, etika digital, logika, dasar desain, pemrograman dasar, dasar AI. [OUTPUT: Portofolio awal + 3 karya]',
      'Kelas XI (Spesialisasi & Projek): Masuk IT Club pilihan (Desain/Coding/AI), bootcamp intensif, projek mitra nyata. [OUTPUT: 1 produk digital layak tampil/jual]',
      'Kelas XII (PTN & Finalisasi): Bimbingan intensif PTN, tahfizh target akhir, finalisasi portofolio, dan mentoring adik kelas. [OUTPUT: Siap PTN + Portofolio rapi]',
    ],
    footnote: 'Catatan Strategis: Tahun ketiga tidak dibebani projek IT berat agar prioritas utama kelulusan dan PTN tercapai 100%.',
    speakerNotes: 'Desain kurikulum ini bertahap dan realistis. Di kelas 10 mereka membangun pondasi, kelas 11 memproduksi karya nyata, dan kelas 12 fokus total pada persiapan masuk PTN.',
    visualPrompt: `16:9 presentation slide showing 3 vertical curriculum roadmap columns with dark navy pill headers (Kelas X, Kelas XI, Kelas XII), bullet points, and highlighted bottom rectangular OUTPUT boxes, bottom note banner in soft grey.`,
  });

  // SLIDE 6: Jalur Spesialisasi IT Club (3 Tracks: Desain, Pemrograman, AI)
  slides.push({
    slideNo: 6,
    type: 'Jalur Spesialisasi (D, P, A)',
    eyebrow: 'PILIHAN SPESIALISASI IT CLUB',
    title: '3 Jalur Peminatan IT Terapan',
    subtitle: 'Setiap siswa memilih 1 jalur keahlian digital terapan yang sesuai minat dan potensi',
    layout: '3-Column Track Cards with Circular Letter Icons (D, P, A) + Sub-Skill Badges & Bottom Accomodation Banner',
    bullets: [
      'Jalur D (DESAIN): Materi visual, konten promosi, branding UMKM, poster kegiatan. (Sub-skill: Poster, Feed Promosi, Branding Sederhana)',
      'Jalur P (PEMROGRAMAN): Website sederhana, landing page PPDB, sistem data ringan, form interaktif. (Sub-skill: Web Profil, Landing Page, Database Ringan)',
      'Jalur A (AI & OTOMASI): AI produktivitas, pembuatan konten, chatbot FAQ, otomasi administrasi, riset. (Sub-skill: Chatbot FAQ, Template AI, Asisten Kerja)',
    ],
    speakerNotes: 'Di IT Club, siswa difokuskan pada 1 dari 3 jalur praktis: Desain, Pemrograman, atau AI. Setiap jalur menghasilkan aset digital yang langsung bisa digunakan.',
    visualPrompt: `16:9 infographic slide, 3 vertical cards featuring large circular badge letters (D in gold, P in navy blue, A in green), descriptive text, and pill badges for each sub-topic, clean minimalist aesthetic.`,
  });

  // SLIDE 7: Projek Portofolio 4 Kuadran (Sekolah, UMKM, Masjid, Siswa)
  slides.push({
    slideNo: 7,
    type: 'Projek Portofolio 4 Kuadran',
    eyebrow: 'PORTOFOLIO BERNILAI JUAL',
    title: 'Penerapan Karya Portofolio Nyata',
    subtitle: 'Skill digital harus terlihat dalam karya konkret, bukan sekadar teori di kelas',
    layout: '4-Quadrant Cards (Sekolah, UMKM, Masjid/Dakwah, Siswa Pribadi) + Target Minimal Siswa Bar at Bottom',
    bullets: [
      '1. Sekolah & Yayasan: Website PPDB online, desain brosur pendaftaran, feed media sosial, chatbot informasi.',
      '2. UMKM & Komunitas: Landing page usaha lokal, katalog digital, desain promosi produk, form pemesanan online.',
      '3. Masjid & Dakwah: Poster kajian, website agenda kegiatan masjid, template dakwah digital, laporan kegiatan.',
      '4. Siswa Pribadi: Website portofolio pribadi, showcase karya desain/coding, artikel ilmiah, sertifikat kompetensi.',
    ],
    targetBar: 'Target Minimal Siswa: Kelas X = 3 karya awal | Kelas XI = 1 produk siap jual | Kelas XII = Portofolio final siap kuliah & personal branding.',
    speakerNotes: 'Portofolio ini yang membuktikan kualitas lulusan kepada wali murid dan perguruan tinggi. Karya siswa langsung dipakai oleh yayasan, UMKM sekitar, dan masjid.',
    visualPrompt: `16:9 presentation slide, 4 quadrant modern white cards with gold/navy icons, bottom dark navy target banner with golden text summarizing student output milestones.`,
  });

  // SLIDE 8: Simulasi Anggaran & SDM Minimal (Corporate Financial Table)
  slides.push({
    slideNo: 8,
    type: 'Simulasi Anggaran & SDM',
    eyebrow: 'STRUKTUR ANGGARAN & EFISIENSI',
    title: 'Simulasi Pembiayaan & SDM Tahun Pertama',
    subtitle: 'Pola awal realistis: perkuat tim internal, mentor eksternal secukupnya, optimalkan mitra',
    layout: 'Financial Simulation Table (Komponen, Pola/Siswa, Estimasi) + Right Side Principles Card + Bottom Total Row',
    bullets: [
      'Koordinator Program IT (Internal Yayasan) = Rp0 / included',
      'Guru Muatan Lokal IT (Internal / Guru TIK) = Estimasi Rp18.000.000 / th',
      'Mentor IT Club Desain, Coding, AI (Freelance / Mitra Praktisi) = @Rp12.000.000 / th',
      'Narasumber Tamu & Workshop Khusus (4x setahun) = Rp2.000.000 / th',
      'TOTAL ANGGARAN SDM IT MINIMAL = Rp56.000.000 / tahun',
    ],
    principles: [
      '1. Jangan semua dijadikan pegawai tetap; manfaatkan praktisi freelance & kemitraan.',
      '2. Mentor hadir pada sesi IT Club, bimbingan projek, dan bootcamp.',
      '3. Guru internal dilatih agar program tetap berjalan berkesinambungan.',
    ],
    speakerNotes: 'Dari sisi pembiayaan, kita menggunakan pola ramping (lean model). Kita tidak merekrut banyak pegawai tetap, melainkan menggandeng mentor praktisi freelance.',
    visualPrompt: `16:9 corporate financial slide, clean data table on left with blue header and gold total row, right side dark navy callout card with yellow title "Prinsip SDM Tahun Pertama" and numbered checklist.`,
  });

  // SLIDE 9: Simulasi Biaya Siswa & Target Pendanaan (Financial Projection)
  slides.push({
    slideNo: 9,
    type: 'Simulasi Biaya & Beasiswa',
    eyebrow: 'PROYEKSI KEUANGAN & BEASISWA',
    title: 'Simulasi Biaya & Target Pendanaan Awal',
    subtitle: 'Angka kerja awal untuk 25 siswa (1 kelas) dengan skema subsidi dan beasiswa berjenjang',
    layout: 'Dual-Table Layout: Komponen Biaya Siswa vs Kategori Skema Masuk + 4 Key Financial Badges at Bottom',
    bullets: [
      'Total Kebutuhan Biaya 25 Siswa = Rp950.000.000',
      'Estimasi Dana Masuk Siswa Mandiri (Alumni & Non-Alumni) = Rp171.000.000',
      'Kekurangan Subsidi / Beasiswa = Rp779.000.000',
      'Investasi Infrastruktur IT Awal = Rp49.100.000',
      'TOTAL TARGET KEBUTUHAN PENDANAAN AWAL = Rp828.100.000 (Target Sponsor: Rp800 - 900 Juta)',
    ],
    speakerNotes: 'Berikut simulasi kebutuhan dana untuk 25 siswa awal. Target fundraising dan kemitraan yayasan dipatok di kisaran Rp800 hingga Rp900 juta untuk menjamin operasional penuh 1 tahun.',
    visualPrompt: `16:9 financial projection presentation slide with clean tables, 4 colorful bottom metric cards (Dark Blue, Emerald Green, Coral Red, Gold) showing key financial totals, professional BCG style.`,
  });

  // SLIDE 10: Roadmap Implementasi 4 Tahap & Action Items (Keputusan Rapat)
  slides.push({
    slideNo: 10,
    type: 'Roadmap & Action Items',
    eyebrow: 'ROADMAP IMPLEMENTASI & KEPUTUSAN',
    title: 'Roadmap Eksekusi & Agenda Keputusan',
    subtitle: 'Agar konsep tidak berhenti sebagai wacana, dibutuhkan kesepakatan tahap awal yang terukur',
    layout: '4 Milestone Cards (0-3 Bln, 3-6 Bln, 6-12 Bln, Thn 2) + Dark Action Checklist Card + Bottom Golden Ribbon Takeaway',
    bullets: [
      'Fase 1 (0-3 Bulan): Finalisasi konsep kurikulum, target output, skema beasiswa, dan paket promosi awal.',
      'Fase 2 (3-6 Bulan): Persiapan modul IT dasar, setup LMS/Website PPDB, MoU mentor mitra, seleksi calon siswa.',
      'Fase 3 (6-12 Bulan): Tahun pertama berjalan, Mulok & IT Club aktif, portofolio awal siswa, monitoring wali murid.',
      'Fase 4 (Tahun Kedua): Akselerasi portofolio, bootcamp lanjutan, sertifikasi internasional, dan showcase karya publik.',
    ],
    actionChecklist: [
      '1. Menyetujui positioning institusi berbasis Qur\'an, PTN, dan software skill IT terapan.',
      '2. Menyetujui pembukaan 3 jalur IT Club awal: Desain, Pemrograman, dan AI.',
      '3. Menyetujui skema beasiswa awal serta target fundraising sponsor Rp500jt - Rp800jt.',
      '4. Membentuk tim taskforce kecil untuk kurikulum, kemitraan, promosi, dan SPMB.',
    ],
    goldenTakeaway: 'Mulai dari yang sederhana, berjalan konsisten, lalu naik kelas secara bertahap.',
    speakerNotes: 'Sebagai penutup, ada 4 poin keputusan yang kami ajukan untuk disepakati hari ini. Prinsip kita: mulai sederhana, jalan konsisten, lalu naik kelas bertahap.',
    visualPrompt: `16:9 presentation slide showing 4 horizontal roadmap milestones at top with dark blue badge headers, a large dark navy container at middle labeled "Yang Harus Segera Disepakati" with 4 golden check items, bottom warm gold ribbon with inspirational quote, executive finish.`,
  });

  // Generate Master Markdown Prompt for AI (ChatGPT / Gemini / Grok / Claude)
  const markdownPrompt = `# MASTER PROMPT: EXECUTIVE 16:9 PRESENTATION DECK GENERATOR
**Standar Desain**: Masterclass Robbani & McKinsey Executive Style
**Topik Presentasi**: ${topic}
**Presenter / Tim**: ${presenter || 'Tim Inisiator'}
**Target Audiens**: ${audience || 'Stakeholder & Dewan Pembina'}
**Gaya Visual**: ${styleObj.name} (Navy #002D62, Gold #EAAA00, Clean White #FFFFFF)
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

## PETUNJUK EXPORT & IMPLEMENTASI KE POWERPOINT / CANVA / GAMMA
1. **Rasio**: Wajib gunakan aspect ratio 16:9 Widescreen.
2. **Palet Warna Utama**:
   - Primary Deep: Navy Blue \`#002D62\` (Elemen kartu core, banner solusi, dan footer branding)
   - Secondary Accent: Warm Gold / Amber \`#EAAA00\` (Nomor urut, badge circular, dan border penekanan)
   - Neutral Light: Pure White \`#FFFFFF\` & Soft Ice Grey \`#F4F7FA\` (Dasar kartu dan kanvas bersih)
   - Text Dark: Slate Navy \`#0F172A\` (Teks judul tebal dan konten mudah dibaca)
3. **Tipografi**:
   - Headings: Bold Sans-Serif (Inter / Montserrat / Plus Jakarta Sans) 900 weight.
   - Body: Clean readable Sans-Serif 400-600 weight.
4. **Visual Imagery**: Gunakan gambar fotorealistik berkualitas studio tanpa watermark untuk area split hero.`;

  return {
    slides,
    markdownPrompt,
    totalSlides: slides.length,
    styleObj,
    useCaseObj,
  };
}
