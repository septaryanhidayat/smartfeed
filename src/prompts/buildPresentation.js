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
  topic: '',
  type: 'Pitching ke Investor',
  audience: '',
  slideCount: 6,
  duration: '5-10 menit',
  language: 'Indonesia',
  keyPoints: '',
  dataEvidence: '',
  mainCta: '',
  designStyle: 'Profesional & Minimalis',
  colorScheme: '',
  visualElements: ['Infografis & Diagram', 'Ikon Vektor', 'Grafik & Chart'],
  tone: 'Percaya Diri',
  extraNotes: '',
};

export function buildPresentation(state) {
  const {
    topic = '',
    type = 'Pitching ke Investor',
    audience = '',
    slideCount = 6,
    duration = '5-10 menit',
    language = 'Indonesia',
    keyPoints = '',
    dataEvidence = '',
    mainCta = '',
    designStyle = 'Profesional & Minimalis',
    colorScheme = '',
    visualElements = ['Infografis & Diagram', 'Ikon Vektor', 'Grafik & Chart'],
    tone = 'Percaya Diri',
    extraNotes = '',
  } = state || {};

  const displayTopic = topic?.trim() || 'Judul / Topik Presentasi';
  const displayAudience = audience?.trim() || 'Target Audiens Utama';
  const displayCta = mainCta?.trim() || 'Langkah Aksi Nyata & Kesepakatan Bersama';
  const displayColorScheme = colorScheme?.trim() || 'Sesuai Tema Desain (' + designStyle + ')';

  const safeCount = Math.max(4, Math.min(Number(slideCount) || 6, 24));
  const slideCountLabel = safeCount <= 7 ? '5–7 slide' : safeCount <= 12 ? '10–12 slide' : safeCount <= 20 ? '15–20 slide' : '20–30 slide';

  const visualElementsList = Array.isArray(visualElements) && visualElements.length > 0
    ? visualElements.map((v) => v.toLowerCase()).join(', ')
    : 'infografis dan diagram, ikon vektor, foto berkualitas tinggi, timeline visual, comparison table';

  // Parse key points into lines
  const rawLines = keyPoints
    ? keyPoints.split('\n').map((l) => l.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
    : [];

  const pointsList = rawLines.length > 0
    ? rawLines
    : [
        'Latar belakang masalah & urgensi solusi',
        'Pilar strategi utama dan langkah implementasi',
        'Bukti traksi, data validasi & hasil terukur',
        'Rencana aksi dan call to action penutup',
      ];

  const slides = [];

  // SLIDE 1: Cover Hero
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

  // SLIDE 2: Problem / Hook
  slides.push({
    slideNo: 2,
    type: 'Hook & Masalah Utama',
    eyebrow: 'TANTANGAN & URGENSI',
    title: `Urgensi & Masalah yang Dihadapi ${displayAudience}`,
    subtitle: 'Faktor pemicu utama yang memerlukan penanganan terstruktur',
    layout: 'Grid 2-Kolom: 4 Kartu Masalah Bernomor (01-04) di sisi kiri, Box Sorot CORE di sisi kanan',
    bullets: [
      `01. ${pointsList[0] || 'Tantangan operasional dan efisiensi yang belum optimal.'}`,
      `02. ${pointsList[1] || 'Kebutuhan framework kerja yang teruji dan terukur.'}`,
      '03. Keterbatasan waktu dan sumber daya yang perlu diakselerasi.',
      '04. Peluang besar yang belum dimaksimalkan secara konsisten.',
    ],
    coreHighlight: {
      tag: 'KUNCI UTAMA',
      body: 'Solusi yang efektif harus sederhana, terukur, dan mampu memberikan dampak positif secara berkesinambungan.',
      output: 'Fokus + Solusi Teruji + Aksi Cepat',
    },
    speakerNotes: `Mari kita lihat tantangan terbesar saat ini. Sebagian besar hambatan berakar dari belum adanya metodologi yang tepat dan terarah.`,
    visualPrompt: `16:9 presentation slide showing 4 numbered challenge cards with warm accent borders, right tall highlight box, color palette ${displayColorScheme}, clean typography.`,
  });

  // SLIDE 3: Pilar Solusi
  slides.push({
    slideNo: 3,
    type: 'Pilar Solusi & Framework',
    eyebrow: 'STRATEGI & METODOLOGI',
    title: 'Framework & Pilar Solusi Terpadu',
    subtitle: 'Langkah strategis menjawab tantangan yang dihadapi',
    layout: '3-4 Pilar Kartu Vertikal dengan Banner Solusi Utama di bagian bawah',
    bullets: pointsList.slice(0, 3).map((p, idx) => `Pilar 0${idx + 1}: ${p}`),
    solutionBanner: {
      badge: 'METODOLOGI KUNCI',
      text: 'Integrasi konsistensi, pemanfaatan teknologi cerdas, dan evaluasi berkala.',
    },
    speakerNotes: 'Framework ini dirancang untuk dapat dieksekusi dengan cepat dan memberikan hasil nyata dalam jangka pendek maupun panjang.',
    visualPrompt: `16:9 presentation slide showing 3 modern vertical pillar cards with glowing icon headers, bottom wide banner with ${displayColorScheme}, elegant aesthetic.`,
  });

  // SLIDE 4: Data & Bukti (Jika ada)
  slides.push({
    slideNo: 4,
    type: 'Data & Bukti Validasi',
    eyebrow: 'BUKTI & TRAKSI',
    title: 'Validasi Data & Hasil yang Dicapai',
    subtitle: 'Fakta dan metrik kuantitatif pendukung',
    layout: '4 Metrik Angka Tebal (KPI Cards) + Ringkasan Insight Analitik',
    bullets: [
      dataEvidence ? `Metrik Utama: ${dataEvidence}` : 'Pertumbuhan performa positif hingga 35% setelah penerapan framework.',
      'Tingkat retensi dan kepuasan pengguna mencapai standar industri tertinggi.',
      'Efisiensi alur kerja meningkat secara signifikan dan terukur.',
      'Dukungan ekosistem yang solid mempercepat pencapaian target.',
    ],
    goldenTakeaway: dataEvidence ? `Validasi nyata: ${dataEvidence}` : 'Data membuktikan bahwa strategi ini memberikan dampak terukur.',
    speakerNotes: `Mari kita lihat pembuktian berdasarkan data riil. Angka-angka ini menegaskan efektivitas dari langkah yang kita jalankan.`,
    visualPrompt: `16:9 data dashboard presentation slide with clean metric stat boxes, modern line chart, color scheme ${displayColorScheme}, high contrast readability.`,
  });

  // SLIDE 5: Call to Action & Penutup
  slides.push({
    slideNo: 5,
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

  // 1. MASTER MAGIC PROMPT (FORMAT BLUEPRINT PERSIS REFERENSI)
  const magicPrompt = `Buatkan slide presentasi PowerPoint tentang "${displayTopic}"

Buatkan outline lengkap slide presentasi PowerPoint dengan detail berikut:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI DASAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Judul / Topik     : ${displayTopic}
• Jenis Presentasi  : ${type}
• Target Audiens    : ${displayAudience}
• Jumlah Slide      : ${slideCountLabel}
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
PRINSIP DESAIN YANG HARUS DITERAPKAN
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

  // 2. GAMMA & CANVA OUTLINE
  const gammaOutline = `# ${displayTopic}
## ${displayAudience} | ${duration} | ${type}

${slides.map((s) => `### Slide ${s.slideNo}: ${s.title}
* ${s.eyebrow}
${s.bullets.map((b) => `* ${b}`).join('\n')}
${s.goldenTakeaway ? `* ⭐ **Takeaway:** ${s.goldenTakeaway}` : ''}
* 💡 **Visual:** ${s.visualPrompt}
* 🎙️ **Notes:** ${s.speakerNotes}
`).join('\n---\n\n')}`;

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
    Dim sldIndex As Integer

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

    MsgBox "Presentasi '${displayTopic.replace(/"/g, '""')}' berhasil dibuat oleh Smart Feed!", vbInformation, "Smart Feed Success"
End Sub`;

  // 4. NOTEBOOKLM SOURCE DOCUMENT
  const notebookLmDoc = `# DOKUMEN SUMBER PRESENTASI EKSEKUTIF: ${displayTopic.toUpperCase()}
**Tujuan Presentasi:** ${type}
**Target Audiens:** ${displayAudience}
**Durasi Sesi:** ${duration}
**Gaya Komunikasi:** ${tone}

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
