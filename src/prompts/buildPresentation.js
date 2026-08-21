/**
 * Smart Feed — Magic Prompt Presentasi PPT (Beta) Engine
 * Menghasilkan output presentasi berbasis 5 prinsip desain terbaik:
 * 1. Satu Slide Satu Pesan
 * 2. Prinsip 5-5-5 (Maksimal 5 baris, 5 kata per baris)
 * 3. Struktur Logis (Opening, Problem, Solution, Evidence, CTA)
 * 4. Data & Bukti Terukur
 * 5. Visual Berkualitas Tinggi
 */

export const INITIAL_PRESENTATION = {
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
  colorScheme: 'Obsidian Black (#0A0F1D) + Emerald Neon (#10B981) + Pure White',
  visualElements: ['Infografis & Diagram', 'Grafik & Chart', 'Mockup Produk', 'Comparison Table'],
  tone: 'Data-driven',
  extraNotes: 'Tekankan unit economics yang sehat dan traction riil pengguna.',
};

export function buildPresentation(state) {
  const {
    topic = 'Proposal Strategis & Inovasi Presentasi',
    type = 'Pitching ke Investor',
    audience = 'Investor, Manajemen & Pemangku Kepentingan',
    slideCount = 10,
    duration = '10-15 menit',
    language = 'Indonesia',
    keyPoints = '',
    dataEvidence = '',
    mainCta = '',
    designStyle = 'Profesional & Minimalis',
    colorScheme = 'Navy Blue (#002D62) + Warm Gold (#EAAA00) + Clean White',
    visualElements = ['Infografis & Diagram', 'Ikon Vektor', 'Grafik & Chart', 'Timeline'],
    tone = 'Percaya Diri',
    extraNotes = '',
  } = state || {};

  const safeCount = Math.max(4, Math.min(Number(slideCount) || 10, 24));
  const slides = [];

  // SLIDE 1: Cover Hero
  slides.push({
    slideNo: 1,
    type: 'Cover Hero & Title Slide',
    eyebrow: (type || 'PRESENTASI EKSEKUTIF').toUpperCase(),
    title: topic,
    subtitle: `Disusun untuk: ${audience} | Durasi: ${duration}`,
    layout: 'Split Layout 50:50 — Headline tebal beraksen kontras tinggi di kiri, Visual 3D Photorealistic di kanan, Ribbon footer elegan',
    categoryChips: Array.isArray(visualElements) && visualElements.length > 0 ? visualElements.slice(0, 5) : ['STRATEGI', 'DATA', 'INOVASI', 'EKSEKUSI'],
    bullets: [
      `Tujuan Presentasi: ${type}`,
      `Target Audiens: ${audience}`,
      `Durasi Paparan: ${duration}`,
      `Bahasa Pengantar: ${language}`,
    ],
    speakerNotes: `Selamat datang Bapak/Ibu. Hari ini kami memaparkan rencana komprehensif mengenai "${topic}". Kita akan melihat tantangan pasar, solusi terukur, data pendukung, serta langkah eksekusi konkret yang siap dijalankan.`,
    visualPrompt: `16:9 widescreen presentation title slide, minimalist luxury style, color scheme ${colorScheme}, bold typography "${topic}", high-end clean 3D isometric graphic on the right, pristine lighting, 8k resolution.`,
  });

  // SLIDE 2: Problem & Market Context
  slides.push({
    slideNo: 2,
    type: 'Latar Belakang & Urgensi Masalah',
    eyebrow: 'URGENSI & TANTANGAN UTAMA',
    title: 'Latar Belakang & Akar Permasalahan',
    subtitle: 'Faktor pemicu yang menuntut tindakan strategis segera',
    layout: 'Grid 2-Kolom: 4 Kartu Masalah Bernomor (01-04) di sisi kiri, Box Sorot CORE di sisi kanan',
    bullets: [
      '01. Efisiensi Biaya: Peningkatan biaya operasional/akuisisi yang menekan margin profitabilitas.',
      '02. Perubahan Tren: Pergeseran cepat ekspektasi pasar dan kebutuhan adopsi teknologi digital.',
      '03. Kesenjangan Solusi: Solusi konvensional yang beredar saat ini lambat dan tidak fleksibel.',
      '04. Potensi Pasar Terbuka: Kebutuhan solusi modern yang terjangkau dan scalable.',
    ],
    coreHighlight: {
      tag: 'MASALAH UTAMA',
      body: 'Tanpa inovasi dan strategi yang tepat sasaran, peluang pasar bernilai tinggi akan terlewatkan oleh kompetitor.',
      output: 'Dibutuhkan Solusi Cepat, Terukur & Teruji',
    },
    speakerNotes: 'Slide ini menyoroti akar masalah yang kita temukan di lapangan, mengapa situasi saat ini menuntut perubahan segera, dan potensi risiko jika tidak segera diatasi.',
    visualPrompt: `16:9 presentation slide showing 4 numbered problem cards on the left with subtle red accents, a prominent tall dark card on the right labeled CORE with ${colorScheme}, crisp typography.`,
  });

  // SLIDE 3: Solusi & Keunggulan
  slides.push({
    slideNo: 3,
    type: 'Solusi Utama & Value Proposition',
    eyebrow: 'SOLUSI STRATEGIS',
    title: 'Solusi Terpadu & Nilai Tambah',
    subtitle: 'Menghadirkan diferensiasi nyata dengan dampak terukur',
    layout: '3 Pilar Kartu Vertikal dengan Banner Solusi Utama di bagian bawah',
    bullets: [
      'Pilar 1 (Efisiensi): Otomasi proses yang memangkas waktu kerja hingga 70%.',
      'Pilar 2 (Skalabilitas): Infrastruktur siap berkembang seiring pertumbuhan volume bisnis.',
      'Pilar 3 (Keandalan): Standar kualitas teruji dengan bukti kepuasan pengguna nyata.',
    ],
    solutionBanner: {
      badge: 'DIFERENSIASI UTAMA',
      text: 'Solusi holistik yang memadukan kecepatan eksekusi, akurasi data, dan kemudahan penggunaan.',
    },
    speakerNotes: 'Berikut adalah jawaban konkret kami terhadap permasalahan tadi. Kami merancang 3 pilar solusi yang langsung menjawab kebutuhan pengguna.',
    visualPrompt: `16:9 presentation slide showing 3 modern vertical pillar cards with glowing icon headers, bottom wide highlight banner with ${colorScheme}, professional corporate aesthetic.`,
  });

  // SLIDE 4: Data, Bukti & Statistik
  slides.push({
    slideNo: 4,
    type: 'Data & Bukti Terukur',
    eyebrow: 'BUKTI DATA & VALIDASI',
    title: 'Validasi Pasar & Metrik Kunci',
    subtitle: 'Didukung angka riil dan riset pasar mendalam',
    layout: '4 Metrik Angka Tebal (KPI Cards) + Ringkasan Insight Analitik',
    bullets: [
      `Data Validasi: ${dataEvidence || 'Pertumbuhan eksponensial dengan retensi pengguna tinggi.'}`,
      'Metrik Efisiensi: Waktu implementasi 3x lebih cepat dibandingkan standar industri.',
      'Kepuasan Pengguna: Feedback positif konsisten dan tingkat adopsi melampaui target.',
      'Proyeksi Pertumbuhan: Peluang ekspansi pasar yang terus membesar setiap kuartal.',
    ],
    goldenTakeaway: dataEvidence || 'Data membuktikan penerimaan pasar yang sangat kuat dan potensi skalabilitas tinggi.',
    speakerNotes: `Angka tidak pernah bohong. Seperti yang terlihat pada metrik di slide ini: ${dataEvidence || 'semua indikator menunjukkan performa positif dan momentum yang sangat tepat.'}`,
    visualPrompt: `16:9 data dashboard presentation slide with 4 clean metric stat boxes, modern line chart graph, clean typography, ${colorScheme}, high contrast readability.`,
  });

  // SLIDE 5: Rencana Eksekusi & Roadmap
  slides.push({
    slideNo: 5,
    type: 'Roadmap & Rencana Implementasi',
    eyebrow: 'ROADMAP STRATEGIS',
    title: 'Tahapan Eksekusi & Timeline',
    subtitle: 'Langkah terstruktur menuju pencapaian target',
    layout: 'Timeline Horizontal 4 Fase dengan Milestone Output Jelas',
    bullets: [
      'Fase 1 (Fondasi & Setup): Penyiapan infrastruktur, riset mendalam, dan perakitan tim inti.',
      'Fase 2 (Peluncuran & Pilot): Pengujian langsung ke pengguna awal dan iterasi cepat.',
      'Fase 3 (Skalasi & Optimasi): Peningkatan kapasitas dan penetrasi pasar yang lebih luas.',
      'Fase 4 (Ekspansi & Keberlanjutan): Penguatan kemitraan strategis dan diversifikasi nilai tambah.',
    ],
    targetBar: 'Target: Pencapaian milestone utama dalam 6-12 bulan ke depan secara tepat waktu dan sesuai anggaran.',
    speakerNotes: 'Kami telah menyusun roadmap eksekusi 4 fase yang terukur. Setiap fase memiliki key deliverables yang jelas untuk memastikan akuntabilitas.',
    visualPrompt: `16:9 presentation slide showing modern 4-phase horizontal roadmap timeline with connected nodes, progress indicators, elegant ${colorScheme}, clean professional style.`,
  });

  // SLIDE 6: Call to Action & Next Steps
  slides.push({
    slideNo: 6,
    type: 'Call to Action & Kesimpulan',
    eyebrow: 'LANGKAH SELANJUTNYA',
    title: 'Kesimpulan & Call to Action',
    subtitle: 'Mari melangkah bersama menciptakan dampak nyata',
    layout: 'Center CTA Hero Card + 3 Action Items yang Disepakati',
    bullets: [
      `Pesan Kunci: ${mainCta || 'Kolaborasi strategis untuk meraih peluang pertumbuhan pasar.'}`,
      'Persetujuan: Menyetujui rencana implementasi dan alokasi sumber daya tahap awal.',
      'Timeline Mulai: Pembentukan tim kerja dan kickoff project dalam 14 hari kerja.',
    ],
    actionChecklist: [
      'Menyetujui proposal dan target output strategis',
      'Menetapkan timeline kickoff dan person in charge (PIC)',
      'Memulai fase eksekusi pertama sesuai roadmap',
    ],
    goldenTakeaway: mainCta || 'Saatnya bertindak bersama mengamankan momentum pertumbuhan terbaik.',
    speakerNotes: `Sebagai penutup, kami mengajak Bapak/Ibu untuk melangkah bersama: ${mainCta || 'Mari kita sepakati langkah awal ini dan mulai eksekusi.'} Terima kasih.`,
    visualPrompt: `16:9 closing presentation slide, bold central CTA card with gold glow, checkmark icons, contact details placeholder, ${colorScheme}, inspiring finish.`,
  });

  // 1. MASTER MAGIC PROMPT (Untuk ChatGPT 4o, Claude 3.5 Sonnet, Gemini Pro, & NotebookLM)
  const magicPrompt = `# MAGIC PROMPT PRESENTASI PPT (BETA)
# TOPIC: ${topic}
# TIPE: ${type} | AUDIENS: ${audience} | DURASI: ${duration} | BAHASA: ${language}

Anda adalah seorang Konsultan Desain Presentasi Eksekutif & Ahli Komunikasi Bisnis Kelas Dunia (McKinsey / BCG / TED Speaker Level).
Tugas Anda adalah menyusun Naskah Lengkap, Struktur Slide 16:9 Widescreen, Visual Direction, dan Speaker Notes profesional berdasarkan input berikut:

---

## 1. IDENTITAS PRESENTASI
- **Judul / Topik**: ${topic}
- **Tujuan / Jenis**: ${type}
- **Target Audiens**: ${audience}
- **Target Slide**: ${safeCount} Slide (Widescreen 16:9)
- **Durasi Paparan**: ${duration}
- **Bahasa Pengantar**: ${language}

## 2. KONTEN & PESAN KUNCI
- **Poin-Poin Utama**:
${keyPoints || '- Diskusikan latar belakang masalah, solusi unggulan, data traksi, dan roadmap implementasi.'}
- **Data / Bukti / Statistik**: ${dataEvidence || 'Data pertumbuhan pasar, metrik efisiensi, dan validasi pengguna nyata.'}
- **Pesan Utama / Call to Action**: ${mainCta || 'Dapatkan persetujuan stakeholder dan komitmen eksekusi bersama.'}

## 3. GAYA DESAIN & VISUAL (5 PRINSIP PRESENTASI TERBAIK)
- **Gaya Desain**: ${designStyle}
- **Skema Warna**: ${colorScheme}
- **Elemen Visual yang Wajib**: ${Array.isArray(visualElements) ? visualElements.join(', ') : 'Infografis, Chart, Diagram, Ikon'}
- **Tone / Gaya Bahasa**: ${tone}
${extraNotes ? `- **Konteks Khusus**: ${extraNotes}\n` : ''}
---

## FORMAT OUTPUT YANG HARUS ANDA HASILKAN:
Untuk SETIAP slide (Slide 1 s.d. ${safeCount}), sajikan dalam format terstruktur berikut:

### Slide [Nomor]: [Judul Slide yang Kuat & Menarik]
- **Tipe Slide**: (Cover / Problem / Solution / Data / Roadmap / CTA)
- **Kategori / Eyebrow Tag**: (Tag kecil huruf kapital di atas judul)
- **Sub-Judul**: (1 kalimat penjelas pesan utama)
- **Layout & Visual Composition**: (Deskripsi tata letak kartu, grid, split, infografis)
- **Konten Poin (Prinsip 5-5-5)**:
  * (Maksimal 3-5 poin, ringkas, padat, tanpa paragraf panjang)
- **Data / Highlight Box**: (Angka metrik / quote penegas)
- **Speaker Notes**: "(Naskah apa yang harus diucapkan presenter selama 1-2 menit dengan gaya ${tone})"
- **AI Image Prompt (16:9 Photorealistic)**: \`\`\`(Prompt gambar AI dalam bahasa Inggris untuk Midjourney/Flux/Ideogram agar menghasilkan visual slide beresolusi tinggi)\`\`\`

---
*Patuhi prinsip "Satu Slide Satu Pesan" dan pastikan seluruh narasi mengalir logis menuju Call to Action.*`;

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
${s.targetBar ? `\n> **Milestone**: ${s.targetBar}` : ''}
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
    Dim shpSub As Shape
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
        .TextRange.Text = "${s.bullets.map(b => b.replace(/"/g, '""')).join('" & vbCrLf & "')}"
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
Roadmap 4 fase terstruktur yang menjamin pencapaian target tepat waktu dan sesuai anggaran.

### 5. Call to Action & Rekomendasi Keputusan
${mainCta || 'Menyetujui proposal dan memulai langkah kickoff implementasi.'}

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
