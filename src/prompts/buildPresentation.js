import { PRESENTATION_USE_CASES, PRESENTATION_STYLES } from '../data/presentationOptions.js';

export const INITIAL_PRESENTATION = {
  topic: 'Strategi Omnichannel Marketing 2026',
  presenter: 'Brand Strategy Team',
  audience: 'Business Owners & Marketing Directors',
  useCase: 'pitch_deck',
  style: 'dark_tech',
  slideCount: 8,
  keyPoints: 'Automasi konten harian, integrasi multi-channel Meta/TikTok, efisiensi budget produksi 80%, studi kasus peningkatan ROAS.',
  includeSpeakerNotes: true,
  includeVisualPrompts: true,
};

export function buildPresentation(state) {
  const {
    topic = '',
    presenter = '',
    audience = '',
    useCase = 'pitch_deck',
    style = 'dark_tech',
    slideCount = 8,
    keyPoints = '',
    includeSpeakerNotes = true,
    includeVisualPrompts = true,
  } = state || {};

  const useCaseObj = PRESENTATION_USE_CASES.find((u) => u.id === useCase) || PRESENTATION_USE_CASES[0];
  const styleObj = PRESENTATION_STYLES.find((s) => s.id === style) || PRESENTATION_STYLES[1];

  // Generate dynamic sample slides based on inputs
  const count = Math.max(4, Math.min(Number(slideCount) || 8, 14));
  const slides = [];

  // Slide 1: Cover Slide
  slides.push({
    slideNo: 1,
    type: 'Cover / Title Slide',
    title: topic || 'Judul Presentasi Profesional',
    subtitle: `${useCaseObj.name.replace(/^[^\s]+\s/, '')} · Disajikan oleh ${presenter || 'Tim Presenter'}`,
    layout: 'Hero Center / Big Typography with Ambient Glow & Modern Badge',
    bullets: [
      `Topik Utama: ${topic}`,
      `Target Audiens: ${audience || 'Umum & Stakeholder'}`,
      `Format: 16:9 Widescreen High Definition`,
    ],
    speakerNotes: `Selamat datang rekan-rekan. Pada sesi kali ini, kita akan membahas ${topic} dengan fokus pada solusi praktis dan langkah eksekusi yang terukur.`,
    visualPrompt: `16:9 cinematic presentation cover slide, modern ${styleObj.name}, bold typography title "${topic}", clean abstract 3D elements, sleek corporate lighting, ultra HD.`,
  });

  // Slide 2: Problem / Background Context
  slides.push({
    slideNo: 2,
    type: 'Problem & Market Context',
    title: 'Tantangan Kritis & Kondisi Lapangan',
    subtitle: 'Mengapa pendekatan konvensional tidak lagi memadai?',
    layout: '3-Card Metric Comparison / Pain Points Grid',
    bullets: [
      'Biaya produksi & waktu pengerjaan lambat (bottleneck operasional)',
      'Tingginya friksi konsistensi visual di berbagai touchpoint',
      'Kebutuhan respon cepat terhadap dinamika pasar yang terus berubah',
    ],
    speakerNotes: 'Mari kita lihat realitas tantangan yang dihadapi saat ini. Biaya dan waktu sering kali menjadi penghambat utama pertumbuhan jika tidak diotomatisasi.',
    visualPrompt: `16:9 presentation slide showing 3 modern structured dark cards highlighting pain points, sleek red/accent warning icons, minimalist charts, clean UI style.`,
  });

  // Slide 3: Solution & Core Value Proposition
  slides.push({
    slideNo: 3,
    type: 'Solution Overview',
    title: 'Pendekatan Baru: Solusi Terintegrasi',
    subtitle: 'Transformasi proses kerja dengan efisiensi maksimal',
    layout: 'Split 2-Column: Value Highlights (Left) + Visual Mockup (Right)',
    bullets: [
      'Penyederhanaan alur kerja dari hari ke hitungan menit',
      'Standarisasi kualitas output berstandar industri komersial',
      'Integrasi menyeluruh siap pakai tanpa ketergantungan software rumit',
    ],
    speakerNotes: 'Solusi yang kami tawarkan merombak total bottleneck tersebut dengan menghadirkan sistem kerja terpadu dan hasil terukur.',
    visualPrompt: `16:9 presentation slide with split layout, left side showing clean feature checklist, right side showing floating glassmorphic product dashboard mockup.`,
  });

  // Slide 4: Key Pillars / Methodology
  slides.push({
    slideNo: 4,
    type: 'Framework & Methodology',
    title: 'Framework & Pilar Eksekusi',
    subtitle: 'Tahapan sistematis untuk memastikan pencapaian target',
    layout: 'Step-by-step 4 Phase Process Flow (Linear Roadmap)',
    bullets: [
      'Fase 1: Analisis Kebutuhan & Riset Parameter Kunci',
      'Fase 2: Otomatisasi & Formulasi Konten Terarah',
      'Fase 3: Quality Control & Validasi Standard Industri',
      'Fase 4: Distribusi Multi-Channel & Tracking Metrik',
    ],
    speakerNotes: 'Metodologi ini dirancang bertahap agar setiap anggota tim dan stakeholder dapat mengeksekusinya secara konsisten.',
    visualPrompt: `16:9 infographic presentation slide showing a 4-step modern timeline flow with glowing connecting nodes, futuristic minimalist UI, elegant gradient accents.`,
  });

  // Slide 5: Data & Key Highlights (if count >= 5)
  if (count >= 5) {
    slides.push({
      slideNo: 5,
      type: 'Traction & Key Metrics',
      title: 'Dampak & Indikator Keberhasilan',
      subtitle: 'Hasil nyata berdasarkan data dan implementasi lapangan',
      layout: '4 Big Stat Callouts with Trend Badges',
      bullets: [
        '⚡ Efisiensi Waktu: Menghemat hingga 85% jam kerja produksi',
        '📈 Kenaikan Output: Volume aset visual meningkat 10x lipat',
        '💰 Efisiensi Biaya: Pangkas biaya langganan software terpisah',
        '⭐ Kepuasan User: Skor adopsi 98.4% dari berbagai industri',
      ],
      speakerNotes: 'Angka-angka ini membuktikan bahwa efisiensi bukan sekadar wacana, melainkan hasil terukur yang langsung berdampak ke bottom-line.',
      visualPrompt: `16:9 presentation slide with 4 prominent numeric stat cards, glowing numbers with green growth badges, minimalist data charts, modern corporate aesthetics.`,
    });
  }

  // Slide 6: Action Plan / Strategic Roadmap (if count >= 6)
  if (count >= 6) {
    slides.push({
      slideNo: 6,
      type: 'Implementation Roadmap',
      title: 'Roadmap Implementasi & Skala',
      subtitle: 'Rencana aksi terstruktur untuk 30-90 hari ke depan',
      layout: 'Timeline Matrix with Milestone Checkpoints',
      bullets: [
        'Bulan 1: Setup sistem, integrasi aset brand & pelatihan tim inti',
        'Bulan 2: Peluncuran kampanye percontohan & optimasi performa',
        'Bulan 3: Skalasi penuh ke seluruh lini produk dan kanal media',
      ],
      speakerNotes: 'Roadmap 90 hari ini memberikan kejelasan tonggak capaian yang terukur untuk setiap departemen yang terlibat.',
      visualPrompt: `16:9 presentation slide displaying a horizontal Gantt / milestone roadmap with 3 highlighted phases, clean modern badge tags, high-tech dark theme.`,
    });
  }

  // Slide 7: Budget / The Ask / Value Proposition (if count >= 7)
  if (count >= 7) {
    slides.push({
      slideNo: 7,
      type: 'Value Proposition & Next Steps',
      title: 'Skema Kerjasama & Alokasi Nilai',
      subtitle: 'Memaksimalkan ROI dengan struktur investasi yang transparan',
      layout: '3-Tier Value Cards or Partnership Summary Box',
      bullets: [
        'Paket Implementasi Lengkap: Akses penuh tanpa batasan fitur',
        'Dukungan Penuh & Pembaharuan Sistem Berkelanjutan',
        'Jaminan Kepuasan & Pendampingan Implementasi',
      ],
      speakerNotes: 'Kami menyusun skema ini dengan prinsip mutual benefit untuk memastikan keberhasilan jangka panjang.',
      visualPrompt: `16:9 presentation slide with 3 modern pricing/partnership tiers, center card highlighted with glowing accent border, sleek tick icons, elegant typography.`,
    });
  }

  // Slide 8: Closing & Q&A
  slides.push({
    slideNo: count,
    type: 'Conclusion & Call-to-Action',
    title: 'Mulai Langkah Pertama Hari Ini',
    subtitle: 'Terima kasih · Sesi Tanya Jawab (Q&A) & Diskusi Terbuka',
    layout: 'Centered Bold CTA + Contact & Social Proof Footer',
    bullets: [
      `Presenter: ${presenter || 'Tim Presenter'}`,
      'Email / Kontak Resmi: info@berandadigital.net',
      'Website: smartfeed.berandadigital.net',
    ],
    speakerNotes: 'Sekian presentasi dari kami. Kami membuka kesempatan seluas-luasnya untuk sesi tanya jawab dan diskusi mendalam. Terima kasih.',
    visualPrompt: `16:9 presentation closing slide, clean dark minimalist theme, bold "Thank You & Q&A" typography, elegant contact info badges, subtle glowing ambient background.`,
  });

  // Assemble full markdown prompt
  const masterPrompt = `[AI PRESENTATION DECK GENERATOR — SMARTFEED ENGINE M20]

# PROJECT SPECIFICATIONS:
- Topic: "${topic}"
- Presenter / Brand: "${presenter}"
- Target Audience: "${audience}"
- Presentation Category: ${useCaseObj.name}
- Visual Design System: ${styleObj.name} (Background: ${styleObj.bg}, Text: ${styleObj.text}, Accent: ${styleObj.accent})
- Total Slides: ${slides.length} Slides (16:9 Widescreen Format)
- Core Highlights: ${keyPoints || 'Komprehensif, terstruktur, persuasif, dan visual modern'}

# SLIDE DECK BREAKDOWN (SLIDE-BY-SLIDE OUTLINE):
${slides.map((s) => `---
### SLIDE ${s.slideNo}: ${s.title.toUpperCase()}
- **Type**: ${s.type}
- **Subtitle**: ${s.subtitle}
- **Recommended Layout**: ${s.layout}
- **Key Points / Content**:
${s.bullets.map((b) => `  * ${b}`).join('\n')}
${includeSpeakerNotes ? `- **Speaker Notes**: "${s.speakerNotes}"` : ''}
${includeVisualPrompts ? `- **Visual / Image Prompt**: ${s.visualPrompt}` : ''}
`).join('\n')}

# EXPORT DIRECTIVES:
Format siap diekspor langsung ke Microsoft PowerPoint (.pptx), Canva, Google Slides, Gamma App, atau Pitch.com. Tipografi sans-serif modern (Inter / Plus Jakarta Sans / Outfit), layout visual lega (negative space), dan hierarki informasi tingkat eksekutif.`;

  return {
    masterPrompt,
    slides,
    useCaseObj,
    styleObj,
    summary: {
      topic,
      presenter,
      audience,
      slideCount: slides.length,
      useCaseName: useCaseObj.name,
      styleName: styleObj.name,
    },
  };
}
