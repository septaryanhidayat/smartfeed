/**
 * Smart Feed — Magic Prompt Presentasi PPT (Beta) Engine
 * Menghasilkan output prompt presentasi PowerPoint berbasis 10 prinsip desain terbaik:
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
  topic: 'Strategi buat konten mudah dan menarik',
  type: 'Edukasi / Workshop',
  audience: 'Kreator pemula atau yang mau mulai ngonten',
  slideCount: 6,
  duration: '5-10 menit',
  language: 'Indonesia',
  keyPoints: '- tipe-tipe konten\n- contoh kreator yang mudah ditiru\n- trend terkini\n- konten yang bermanfaat',
  dataEvidence: '',
  mainCta: 'Ikut komunitas yang siap mendukung pertumbuhan mu',
  designStyle: 'Kreatif & Playful',
  colorScheme: 'Putih, Orange, Kuning, Hijau',
  visualElements: ['Infografis & Diagram', 'Ikon Vektor', 'Foto HD', 'Timeline', 'Comparison Table'],
  tone: 'Percaya Diri',
  extraNotes: '',
};

export function buildPresentation(state) {
  const {
    topic = 'Strategi buat konten mudah dan menarik',
    type = 'Edukasi / Workshop',
    audience = 'Kreator pemula atau yang mau mulai ngonten',
    slideCount = 6,
    duration = '5-10 menit',
    language = 'Indonesia',
    keyPoints = '- tipe-tipe konten\n- contoh kreator yang mudah ditiru\n- trend\n- konten yang bermanfaat',
    dataEvidence = '',
    mainCta = 'Ikut komunitas yang siap mendukung pertumbuhan mu',
    designStyle = 'Kreatif & Playful',
    colorScheme = 'Putih, Orange, Kuning, Hijau',
    visualElements = ['Infografis & Diagram', 'Ikon Vektor', 'Foto HD', 'Timeline', 'Comparison Table'],
    tone = 'Percaya Diri',
    extraNotes = '',
  } = state || {};

  const safeCount = Math.max(4, Math.min(Number(slideCount) || 6, 24));
  const slideCountLabel = safeCount <= 7 ? '5–7 slide' : safeCount <= 12 ? '10–12 slide' : safeCount <= 20 ? '15–20 slide' : '20–30 slide';

  const visualElementsList = Array.isArray(visualElements) && visualElements.length > 0
    ? visualElements.map((v) => v.toLowerCase()).join(', ')
    : 'infografis dan diagram, ikon vektor, foto berkualitas tinggi, timeline visual, comparison table';

  const slides = [];

  // SLIDE 1: Cover Hero
  slides.push({
    slideNo: 1,
    type: 'Cover Hero & Title Slide',
    eyebrow: (type || 'PRESENTASI EKSEKUTIF').toUpperCase(),
    title: topic,
    subtitle: `Disusun untuk: ${audience} | Durasi: ${duration}`,
    layout: 'Split Layout 50:50 — Headline tebal beraksen kontras tinggi di kiri, Visual 3D Photorealistic di kanan, Ribbon footer elegan',
    categoryChips: Array.isArray(visualElements) && visualElements.length > 0 ? visualElements.slice(0, 5) : ['STRATEGI', 'KREATIF', 'KONTEN', 'KOMUNITAS'],
    bullets: [
      `Topik: ${topic}`,
      `Tujuan: ${type}`,
      `Audiens: ${audience}`,
      `Target: ${slideCountLabel}`,
    ],
    speakerNotes: `Halo semuanya, selamat datang! Pada sesi ini kita akan membedah "${topic}" secara praktis dan langsung bisa dipraktikkan hari ini juga.`,
    visualPrompt: `16:9 widescreen presentation title slide, creative and playful style, color scheme ${colorScheme}, bold typography "${topic}", crisp lighting, 8k resolution.`,
  });

  // SLIDE 2: Problem & Hook
  slides.push({
    slideNo: 2,
    type: 'Hook & Masalah Utama',
    eyebrow: 'TANTANGAN KREATOR PEMULA',
    title: 'Kenapa Banyak yang Gagal Mulai Ngonten?',
    subtitle: 'Hambatan psikologis & teknis yang sering menjebak pemula',
    layout: 'Grid 2-Kolom: 4 Kartu Masalah Bernomor (01-04) di sisi kiri, Box Sorot CORE di sisi kanan',
    bullets: [
      '01. Terlalu Perfeksionis: Menunggu alat mahal baru berani posting.',
      '02. Bingung Ide: Tidak tahu formula tipe-tipe konten teruji.',
      '03. Takut Gak Ditonton: Ekspektasi viral instan tanpa konsistensi.',
      '04. Kurang Bimbingan: Jalan sendirian tanpa komunitas pendukung.',
    ],
    coreHighlight: {
      tag: 'KUNCI SUKSES',
      body: 'Konten yang bagus bukan yang paling canggih editnya, tapi yang paling konsisten dan memberikan manfaat nyata bagi audiens.',
      output: 'Sederhana + Bermanfaat + Konsisten',
    },
    speakerNotes: 'Banyak orang gagal ngonten bukan karena tidak punya bakat, tapi karena terjebak rasa takut dan tidak tahu pola konten yang mudah ditiru.',
    visualPrompt: `16:9 presentation slide showing 4 numbered problem cards with warm accent borders, right tall highlight box, color palette ${colorScheme}, clean typography.`,
  });

  // SLIDE 3: Tipe-Tipe Konten & Solusi
  slides.push({
    slideNo: 3,
    type: 'Pilar Solusi & Tipe Konten',
    eyebrow: 'FORMULA PRAKTIS',
    title: '4 Pilar Tipe Konten Berdampak',
    subtitle: 'Pilih satu yang paling cocok dengan karakter Anda',
    layout: '3-4 Pilar Kartu Vertikal dengan Banner Solusi Utama di bagian bawah',
    bullets: [
      'Pilar 1 (Edukasi): Tips singkat & panduan langkah-demi-langkah.',
      'Pilar 2 (Inspirasi): Cerita perjalanan & studi kasus nyata.',
      'Pilar 3 (Entertain): Tren terkini yang dikemas santai & relevan.',
    ],
    solutionBanner: {
      badge: 'STRATEGI UTAMA',
      text: 'Gunakan formula ATM (Amati, Tiru, Modifikasi) dari kreator yang sudah terbukti berhasil.',
    },
    speakerNotes: 'Jangan buat konten dari nol jika bingung. Amati kreator panutan, pelajari polanya, lalu berikan sentuhan autentik versi Anda sendiri.',
    visualPrompt: `16:9 presentation slide showing 3 modern vertical pillar cards with glowing icon headers, bottom wide banner with ${colorScheme}, playful corporate aesthetic.`,
  });

  // SLIDE 4: Trend & Bukti
  slides.push({
    slideNo: 4,
    type: 'Trend & Bukti Data',
    eyebrow: 'MOMENTUM & PELUANG',
    title: 'Memanfaatkan Trend Tanpa Kehilangan Identitas',
    subtitle: 'Data & pola viral yang bisa dimanfaatkan secara cerdas',
    layout: '4 Metrik Angka Tebal (KPI Cards) + Ringkasan Insight Analitik',
    bullets: [
      'Trend Hook 3 Detik: 80% audiens memutuskan menonton di 3 detik pertama.',
      'Audio Populer: Meningkatkan jangkauan distribusi algoritma hingga 2.5x.',
      'Format Micro-learning: Konten 30-60 detik memiliki tingkat penyelesaian tertinggi.',
      'Nilai Manfaat: Konten yang memecahkan masalah 4x lebih sering disimpan (Save).',
    ],
    goldenTakeaway: 'Trend adalah kendaraan, tapi isi dan manfaat adalah bahan bakarnya.',
    speakerNotes: 'Ikuti trend audio atau format visual, tapi selalu selipkan nilai edukasi atau solusi agar audiens loyal dan menekan tombol Follow.',
    visualPrompt: `16:9 data dashboard presentation slide with clean metric stat boxes, modern line chart, color scheme ${colorScheme}, high contrast readability.`,
  });

  // SLIDE 5: Call to Action & Komunitas
  slides.push({
    slideNo: 5,
    type: 'Call to Action & Penutup',
    eyebrow: 'LANGKAH NYATA',
    title: 'Mulai Sekarang, Bertumbuh Bersama',
    subtitle: 'Jangan berjalan sendirian di industri kreatif',
    layout: 'Center CTA Hero Card + 3 Action Items yang Disepakati',
    bullets: [
      `Aksi Utama: ${mainCta || 'Ikut komunitas yang siap mendukung pertumbuhan mu.'}`,
      'Langkah 1: Tentukan 1 pilar konten utama Anda hari ini.',
      'Langkah 2: Buat 1 video pertama tanpa memikirkan kesempurnaan.',
    ],
    actionChecklist: [
      'Gabung ke grup komunitas kreator',
      'Praktikkan 1 template konten per hari',
      'Saling dukung & review antar sesama kreator',
    ],
    goldenTakeaway: mainCta || 'Ikut komunitas yang siap mendukung pertumbuhan mu!',
    speakerNotes: `Sebagai penutup, perjalanan seribu langkah dimulai dari konten pertama. ${mainCta} Sampai jumpa di dalam komunitas!`,
    visualPrompt: `16:9 closing presentation slide, bold central CTA card with warm glowing button, checkmark icons, color scheme ${colorScheme}, inspiring finish.`,
  });

  // 1. MASTER MAGIC PROMPT (FORMAT BLUEPRINT PERSIS REFERENSI)
  const magicPrompt = `Buatkan slide presentasi PowerPoint tentang "${topic}"

Buatkan outline lengkap slide presentasi PowerPoint dengan detail berikut:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI DASAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Judul / Topik     : ${topic}
• Jenis Presentasi  : ${type}
• Target Audiens    : ${audience}
• Jumlah Slide      : ${slideCountLabel}
• Durasi            : ${duration}
• Bahasa            : ${language === 'Indonesia' ? 'Bahasa Indonesia' : language === 'Inggris' ? 'Bahasa Inggris' : 'Bilingual (Indonesia / Inggris)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONTEN & PESAN UTAMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Poin-poin kunci yang harus disampaikan:
${keyPoints ? keyPoints.split('\n').map((l) => (l.trim().startsWith('-') ? l : `- ${l}`)).join('\n') : '- Masalah utama di industri\n- Solusi inovatif yang ditawarkan\n- Data traksi dan validasi pasar\n- Rencana implementasi & roadmap'}

${dataEvidence ? `Data / Bukti / Statistik yang akan digunakan:\n${dataEvidence}\n\n` : ''}Call to Action akhir presentasi:
→ ${mainCta || 'Ikut komunitas yang siap mendukung pertumbuhan mu'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINSIP DESAIN YANG HARUS DITERAPKAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terapkan prinsip-prinsip berikut secara ketat pada setiap slide:

1. SATU SLIDE, SATU PESAN UTAMA
   Setiap slide hanya mengkomunikasikan satu ide pokok. Tidak ada dua gagasan 
   utama dalam satu slide. Buat judul slide mencerminkan pesan tersebut.

2. PRINSIP 5-5-5
   Maksimum 5 bullet points per slide, maksimum 5 kata per bullet point, 
   dan tidak lebih dari 5 slide berturut-turut dengan format teks penuh.

3. BULLET POINTS YANG EFEKTIF
   Gunakan bullet points singkat dan padat. Hindari kalimat panjang.
   Setiap poin adalah pemicu bicara, bukan skrip lengkap.

4. BERBASIS DATA DAN BUKTI
   Tampilkan angka, statistik, hasil riset, atau studi kasus konkret.
   Visualisasikan data dalam bentuk chart/grafik bila memungkinkan.

5. STRUKTUR LOGIS: PENDAHULUAN → ISI → PENUTUP
   - PEMBUKA  : Hook/pernyataan masalah + agenda slide
   - ISI      : Solusi, argumen, data, dan penjelasan detail
   - PENUTUP  : Ringkasan, kesimpulan, dan Call to Action yang jelas

6. DESAIN SIMPEL DAN KONSISTEN
   Gunakan maksimum 2–3 warna utama (${colorScheme}). 
   Satu atau dua jenis font saja. Layout yang konsisten antar slide.

7. KONTRAS TINGGI
   Teks harus mudah terbaca dari jarak jauh. Pastikan kontras warna antara 
   teks dan background minimal 4.5:1 (WCAG AA). Hindari teks abu-abu di atas putih.

8. FONT MUDAH DIBACA
   Gunakan font sans-serif yang bersih. Heading minimal 28–36pt, 
   body text minimal 18–24pt, caption minimal 14pt. Tidak ada teks kecil yang sulit dibaca.

9. VISUAL BERKUALITAS TINGGI
   Rekomendasikan penggunaan: ${visualElementsList}.
   Setiap visual harus relevan dan memperkuat pesan, bukan sekadar dekorasi.

10. MANFAATKAN WHITE SPACE
    Jangan penuhi seluruh slide dengan konten. Biarkan ruang kosong bernafas.
    Padding antar elemen minimal 20–30px. Satu titik fokus utama per slide.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GAYA & TONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Gaya Desain Visual : ${designStyle.toLowerCase()}
• Tone Bahasa        : ${tone.toLowerCase()}
• Skema Warna        : ${colorScheme}
${extraNotes ? `• Catatan Khusus      : ${extraNotes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT OUTPUT YANG DIINGINKAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Untuk setiap slide, berikan:
1. Nomor & Judul Slide
2. Pesan Utama Slide (1 kalimat)
3. Konten / Bullet Points (maks. 5 poin, maks. 5 kata per poin)
4. Rekomendasi Visual (jenis grafik, ikon, foto, atau ilustrasi)
5. Catatan Presenter (poin tambahan yang diucapkan, tidak ditampilkan di slide)
6. Layout yang disarankan (full image, two-column, data-heavy, quote, dll.)
7. Prompt Gambar AI (Midjourney / Flux / Ideogram) 16:9 photorealistic

Susun outline ${slideCountLabel} berdasarkan struktur:
[PEMBUKA] → [HOOK/MASALAH] → [ISI UTAMA] → [DATA & BUKTI] → [SOLUSI/PROPOSISI] → [CTA/PENUTUP]`;

  // 2. GAMMA.APP / CANVA OUTLINE (1-Click Copy Import)
  const gammaOutline = `# ${topic}
## ${slides[0]?.subtitle || 'Executive Strategic Presentation Deck'}

${slides.map((s) => `
---

### Slide ${s.slideNo}: ${s.title}
*${s.subtitle}*

${s.bullets.map((b) => `- ${b}`).join('\n')}
${s.coreHighlight ? `\n> **${s.coreHighlight.tag}**: ${s.coreHighlight.body}\n> *${s.coreHighlight.output}*` : ''}
${s.solutionBanner ? `\n> **${s.solutionBanner.badge}**: ${s.solutionBanner.text}` : ''}
${s.goldenTakeaway ? `\n**Key Takeaway**: ${s.goldenTakeaway}` : ''}
`).join('\n')}`;

  // 3. NATIVE POWERPOINT VBA MACRO (Alt + F11 anti-corrupt file)
  const vbaMacro = `' ======================================================================
' MACRO POWERPOINT NATIVE: ${topic.replace(/[\r\n]+/g, ' ')}
' Cara Pakai:
' 1. Buka PowerPoint baru (Kosong).
' 2. Tekan ALT + F11 untuk membuka VBA Editor.
' 3. Klik menu: Insert > Module.
' 4. Paste seluruh kode di bawah ini lalu tekan F5 (Run).
' ======================================================================

Option Explicit

Sub BuildMagicPresentation()
    Dim pptPres As Presentation
    Dim sld As Slide
    Dim shpTitle As Shape
    Dim shpBody As Shape
    
    Set pptPres = ActivePresentation
    pptPres.PageSetup.SlideWidth = 16 * 72
    pptPres.PageSetup.SlideHeight = 9 * 72
    
${slides.map((s, idx) => `
    ' --- SLIDE ${s.slideNo}: ${s.title.replace(/"/g, '""')} ---
    Set sld = pptPres.Slides.Add(${idx + 1}, ppLayoutBlank)
    sld.Background.Fill.Solid
    sld.Background.Fill.ForeColor.RGB = RGB(10, 15, 29)
    
    ' Title Text Box
    Set shpTitle = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 40, 1050, 60)
    With shpTitle.TextFrame
        .WordWrap = msoTrue
        .TextRange.Text = "${s.title.replace(/"/g, '""')}"
        .TextRange.Font.Name = "Arial"
        .TextRange.Font.Size = 26
        .TextRange.Font.Bold = msoTrue
        .TextRange.Font.Color.RGB = RGB(255, 255, 255)
    End With
    
    ' Body Content Box
    Set shpBody = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 50, 120, 1050, 450)
    With shpBody.TextFrame
        .WordWrap = msoTrue
        .TextRange.Text = "${s.bullets.map((b) => b.replace(/"/g, '""')).join('" & vbCrLf & "')}"
        .TextRange.Font.Name = "Calibri"
        .TextRange.Font.Size = 16
        .TextRange.Font.Color.RGB = RGB(220, 230, 245)
    End With
`).join('\n')}

    MsgBox "Berhasil membuat ${slides.length} Slide 16:9 Presentasi Magic Prompt!", vbInformation, "SmartFeed Studio"
End Sub`;

  // 4. GOOGLE NOTEBOOKLM BRIEFING DOC
  const notebookLmDoc = `# DOKUMEN SUMBER NOTEBOOKLM: ${topic.toUpperCase()}
**Tipe Dokumen**: Executive Briefing & Strategic Source Document
**Target Audiens**: ${audience} | **Durasi**: ${duration} | **Bahasa**: ${language}

---

## RINGKASAN EKSEKUTIF
Dokumen ini disusun sebagai panduan menyeluruh dan bahan riset untuk topik **"${topic}"**.
Mencakup latar belakang masalah, perumusan pilar solusi, validasi data, serta rencana eksekusi dan call to action.

### 1. Landasan & Latar Belakang Masalah
${keyPoints || 'Pembahasan mendalam tentang tantangan industri saat ini dan urgensi penerapan strategi baru.'}

### 2. Formulasi Solusi & Value Proposition
- Efisiensi dan otomatisasi proses kerja
- Skalabilitas sistem dan kemudahan adopsi
- Diferensiasi kompetitif yang sulit ditiru

### 3. Bukti & Validasi Terukur
${dataEvidence || 'Data metrik pendukung dan validasi pasar nyata.'}

### 4. Rencana Implementasi & Roadmap
Roadmap terstruktur yang menjamin pencapaian target tepat waktu dan terukur.

### 5. Call to Action & Rekomendasi Keputusan
${mainCta || 'Ikut komunitas yang siap mendukung pertumbuhan mu'}

---
*Dokumen ini dioptimalkan untuk diunggah ke Google NotebookLM sebagai Source Document guna menghasilkan Ringkasan Audio Podcast dan FAQ Interaktif.*`;

  return {
    slides,
    notebookLmDoc,
    gammaOutline,
    vbaMacro,
    markdownPrompt: magicPrompt,
    masterPrompt: magicPrompt,
    magicPrompt,
    totalSlides: slides.length,
  };
}
