/**
 * Engine Prompt Formatters
 * Formats prompts specifically tailored to each image-generation AI engine across ALL modules:
 * 1. chatgpt    : ChatGPT (DALL-E 3) - Action-driven direct command + UI container hierarchy
 * 2. gemini     : Google Gemini (Imagen 3) - Anti-quote, anti-typo, solid card container layout
 * 3. grok       : Grok 2 (Flux.1) - Natural language photorealism + authentic context
 * 4. leonardo   : Leonardo.ai - Alchemy prompt structure + Negative Prompt block
 */

export const AI_ENGINES = [
  { id: 'chatgpt',    label: 'ChatGPT (DALL-E 3)', icon: 'Sparkles', color: '#10a37f' },
  { id: 'gemini',     label: 'Google Gemini',       icon: 'Cpu',      color: '#3b82f6' },
  { id: 'grok',       label: 'Grok 2 (Flux)',       icon: 'Zap',      color: '#f59e0b' },
  { id: 'leonardo',   label: 'Leonardo.ai',         icon: 'Wand2',    color: '#8b5cf6' },
];

export function formatPromptForEngine(rawText, engine = 'chatgpt', mode = '', state = {}) {
  if (!rawText) return '';

  const isJournalism = ['newscard', 'quotecard', 'factcheck'].includes(mode);
  const media = state.mediaName || 'Media Indonesia';
  const headline = state.headline || state.sourceName || state.claim || state.title || state.productName || state.brandName || '';
  const ratio = (state.aspectRatio || state.ratio || '1:1').split(' ')[0] || '1:1';
  const arParam = ratio.replace(':', '/');

  // ─── 1. JOURNALISM & MEDIA CARDS ───
  if (isJournalism) {
    switch (engine) {
      case 'gemini': {
        return `[PANDUAN KHUSUS GOOGLE GEMINI / IMAGEN 3]:
Buatkan satu gambar poster visual utuh News Card Editorial untuk ${media} dengan spesifikasi tata letak grafis berikut:

1. TATA LETAK POSTER & KARTU GRAFIS (CARD CONTAINER):
- Bagian atas dan tengah: Foto jurnalistik latar kejadian yang otentik dan tajam.
- Bagian bawah 45% frame: WAJIB memiliki KARTU KONTAINER GRAFIS warna gelap solid (dark slate navy #0a0f1d) dengan sudut membulat dan margin rapi untuk menampung seluruh teks agar TIDAK melayang di atas foto.
- Header paling atas: Pita banner merah solid memanjang bertuliskan teks putih: [${state.badge || 'BREAKING NEWS'}] · ${media.toUpperCase()}.
- Label Rubrik: Badge persegi panjang kecil warna kuning dengan teks hitam tebal: ${state.rubric || 'Berita Utama'}.
- Kotak Fakta Tambahan: Di bagian paling bawah, buatkan kotak kartu kecil warna biru gelap terpisah dengan ikon info/cuaca dan teks: FAKTA KUNCI: ${state.keyPoint || state.fact || state.quote || ''}.

2. ATURAN TIPOGRAFI & ANTI-TYPO (SANGAT PENTING):
- Cetak teks judul dengan font sans-serif tebal putih: ${headline}
- JANGAN PERNAH menambahkan tanda petik atau kutipan ("" atau “”) pada judul atau paragraf.
- Pastikan ejaan huruf akurat 100% tanpa ada huruf yang tertukar.

3. DESKRIPSI VISUAL & FOTO JURNALISTIK:
${state.sceneDescription || state.context || rawText}
${state.supportingPhoto ? `- Elemen Visual Pelengkap: ${state.supportingPhoto} (Terintegrasi rapi dalam layar monitor atau inset grafis).` : ''}

4. KUALITAS & PARAMETER:
Fotografi jurnalistik 8k, pencahayaan alami pers, tajam, profesional, aspect ratio ${ratio}.`;
      }

      case 'grok': {
        return `[GROK 2 / FLUX.1 PROMPT]:
Generate an ultra-realistic, authentic journalistic social media news card for ${media} in ${ratio} aspect ratio.

The image consists of a professional split layout:
The background features authentic raw documentary photography of ${state.sceneDescription || state.context || 'the news event'}, captured on 35mm camera with neutral natural press lighting and crisp details. ${state.supportingPhoto ? `Incorporated into the scene is ${state.supportingPhoto}.` : ''}

Overlaid seamlessly is an editorial news design:
- A prominent top red banner with text "[${state.badge || 'BREAKING NEWS'}] · ${media.toUpperCase()}"
- A clean yellow tag for "${state.rubric || 'Berita Utama'}"
- Dateline: "${state.dateline || 'JAKARTA'}${state.date ? ` · ${state.date}` : ''}"
- Big, crisp bold headline text: "${headline}"
- Lead text: "${state.lead || state.quote || state.fact || ''}"
${state.keyPoint ? `- A distinct lower container card with a weather/info icon highlighting: "FAKTA KUNCI: ${state.keyPoint}"` : ''}

Style: Authentic, credible newsroom design, razor-sharp typography, no cartoon/CGI artifacts, masterpiece photojournalism.`;
      }

      case 'leonardo': {
        return `[LEONARDO.AI PROMPT]:
PROMPT:
Masterpiece editorial news card for ${media}, ${state.sceneDescription || state.context || headline}, ${state.supportingPhoto ? `with ${state.supportingPhoto}, ` : ''}authentic photojournalism, crisp 35mm photography, bold headline text "${headline}", red top ribbon badge, yellow category chip, clean dark card container at bottom with legible typography, highly detailed, 8k resolution, cinematic newsroom lighting, photorealism.

NEGATIVE PROMPT:
blurry text, typo, deformed letters, floating words without container, quotation marks on text, cartoon, 3d render, plastic skin, distorted fingers, low resolution, overexposed, oversaturated.`;
      }

      case 'chatgpt':
      default: {
        return `PERINTAH UNTUK CHATGPT (DALL-E 3):
Buatkan dan hasilkan langsung SATU gambar visual News Card Editorial ${media} berukuran rasio ${ratio} berikut ini sekarang juga. Jangan bertanya instruksi tambahan, langsung generate gambarnya:

1. TATA LETAK VISUAL & FOTO PELENGKAP:
- Adegan Utama: ${state.sceneDescription || state.context || 'Adegan berita liputan pers'}
${state.supportingPhoto ? `- Foto Pelengkap / Bukti Tambahan: ${state.supportingPhoto} (Tampilkan sebagai elemen inset atau di layar monitor terpadu)` : ''}
- Gaya: Fotorealistik jurnalistik pers, tajam, natural, candid, tanpa filter kartun/fantasi.
- Rasio: --ar ${arParam}

2. ELEMEN GRAFIS & TIPOGRAFI BERITA (Tercetak Jelas & Terstruktur):
- Header Atas: Pita merah solid bertuliskan [${(state.badge || 'BREAKING NEWS').toUpperCase()}] · ${media.toUpperCase()}
- Rubrik: Badge kecil kuning bertuliskan ${state.rubric || 'Berita Utama'}
- Dateline: ${state.dateline || 'JAKARTA'}${state.date ? ` · ${state.date}` : ''}
- Judul Headline: "${headline}" (Teks tebal, font editorial tegas, mudah dibaca)
${state.lead ? `- Lead Paragraf: "${state.lead}"` : ''}
${state.quote ? `- Kutipan: "${state.quote}"` : ''}
${state.keyPoint ? `- Kotak Fakta Kunci (Container Biru di Bawah): "FAKTA KUNCI: ${state.keyPoint}" dengan ikon relevan.` : ''}

3. DIRECT GENERATION CODE:
A complete photorealistic journalistic news card for ${media}, ${state.sceneDescription || state.context || ''}, ${state.supportingPhoto ? `with ${state.supportingPhoto}, ` : ''}editorial layout, bold typography reading "${headline}", badge [${state.badge || 'BREAKING NEWS'}], dateline ${state.dateline || 'JAKARTA'}, 8k ultra detailed photography --ar ${arParam} --style raw`;
      }
    }
  }

  // ─── 2. ARTICLE & JOURNALISM WRITING (NEWS / OPINION / FEATURE / PRESS RELEASE) ───
  if (mode === 'article') {
    switch (engine) {
      case 'gemini': {
        return `[PANDUAN KHUSUS GOOGLE GEMINI - PENULISAN JURNALISTIK MANUSIAWI]:
Bertindaklah sebagai Redaktur Pelaksana & Jurnalis Senior. 
Tuliskan naskah berita/artikel yang bernas, faktual, dan mendalam. 
WAJIB: DILARANG KERAS MENGGUNAKAN SIMBOL EM DASH (—) ATAU EN DASH (–) KARENA CIRI ROBOT AI. Hindari emoji/simbol AI (✨, 🚀, 💡, 📌), hindari kalimat klise robotik, dan gunakan tanda baca manusia standar (koma, kurung, titik dua, tanda hubung minus biasa) sesuai kaidah PUEBI berdasarkan brief berikut:

${rawText}`;
      }

      case 'grok': {
        return `[GROK 2 JOURNALISM & NEWS WRITING PROMPT]:
Act as a seasoned investigative journalist and news editor. 
Write a razor-sharp, well-researched, organic journalistic article with zero em-dashes (—), zero AI clichés, no generic fluff, and no emoji spam based on this brief:

${rawText}`;
      }

      case 'leonardo': {
        return `[LEONARDO.AI - EDITORIAL PRESS PHOTO COVER PROMPT]:
PROMPT:
Masterpiece editorial photojournalism cover for news article about "${headline}", ${state.facts || 'press event'}, authentic 35mm documentary photography, natural press lighting, highly detailed, 8k resolution, cinematic color tone, award-winning newsroom photography.

NEGATIVE PROMPT:
cartoon, 3d render, CGI, fake, plastic look, blurry, watermark, duplicate, distorted faces.`;
      }

      case 'chatgpt':
      default: {
        return `[PERINTAH KHUSUS CHATGPT (REDAKTUR PELAKSANA SENIOR)]:
Kamu adalah Redaktur Pelaksana Senior di ${media}. 
Tuliskan naskah artikel / berita jurnalistik utuh siap terbit dengan gaya bahasa manusiawi yang mengalir alami, kaya data, tanpa basa-basi robotik, DILARANG MENGGUNAKAN TANDA EM DASH (—) MAUPUN EN DASH (–), dan tanpa simbol/emoji AI (✨, 🚀, 💡, 📌) berdasarkan detail liputan berikut:

${rawText}`;
      }
    }
  }

  // ─── 3. VIDEO SCRIPT, INTERVIEW & STORYBOARD WRITING ───
  if (mode === 'videoscript') {
    switch (engine) {
      case 'gemini': {
        return `[PANDUAN KHUSUS GOOGLE GEMINI - SCRIPTWRITING & VIDEO STORYBOARD]:
Bertindaklah sebagai Creative Video Director dan Head of Scriptwriting.
Tuliskan naskah video / script wawancara / storyboard scene-by-scene yang mengalir alami, teleprompter-ready, DILARANG MEMAKAI TANDA EM DASH (—), dan tanpa emoji robotik berdasarkan brief berikut:

${rawText}`;
      }

      case 'grok': {
        return `[GROK 2 VIDEO SCRIPT & STORYBOARD PROMPT]:
Act as an elite video creative director and visual storyteller.
Write a fast-paced, high-retention video script, shot list, and scene-by-scene storyboard breakdown with zero em-dashes (—) and no AI fluff based on this brief:

${rawText}`;
      }

      case 'leonardo': {
        return `[LEONARDO.AI - CINEMATIC KEYFRAME STORYBOARD PROMPT]:
PROMPT:
Cinematic 4K keyframe storyboard visual for video titled "${state.title || 'cinematic video production'}", ${state.visualStyle || 'cinematic lighting'}, professional movie cinematography, 24fps film still, dramatic composition, highly detailed, 8k resolution, photorealism.

NEGATIVE PROMPT:
cartoon, CGI, low quality, distorted anatomy, blurry, watermark, bad lighting.`;
      }

      case 'chatgpt':
      default: {
        return `[PERINTAH KHUSUS CHATGPT (CREATIVE VIDEO DIRECTOR & SCRIPTWRITER)]:
Kamu adalah Creative Video Director dan Senior Scriptwriter profesional.
Tuliskan naskah video lengkap dengan rincian Scene-by-Scene, Timecode, arahan visual, Voice Over teleprompter-ready (DILARANG MENGGUNAKAN SIMBOL EM DASH —), on-screen text, dan prompt storyboard gambar AI berdasarkan brief berikut:

${rawText}`;
      }
    }
  }

  // ─── 4. COPYWRITING MODE (PURE MARKETING COPY TEXT) ───
  if (mode === 'copywriting') {
    switch (engine) {
      case 'gemini': {
        return `[PANDUAN KHUSUS GOOGLE GEMINI - PERFORMANCE COPYWRITING]:
Bertindaklah sebagai Senior Direct Response Copywriter. 
Tuliskan naskah iklan persuasif berkonversi tinggi dengan bahasa manusia yang relate, tanpa em-dash (—), tanpa buzzword klise AI, dan tanpa emoji berlebihan dalam format teks terpisah:

${rawText}`;
      }

      case 'grok': {
        return `[GROK 2 PERFORMANCE COPYWRITING PROMPT]:
Act as an elite conversion copywriter.
Write authentic, high-converting Indonesian sales copy with zero em-dashes (—), zero robotic AI filler, sharp emotional hooks, and clear CTAs based on this brief:

${rawText}`;
      }

      case 'leonardo': {
        return `[LEONARDO.AI - VISUAL AD MOCKUP PROMPT]:
PROMPT:
Masterpiece commercial ad creative visual for social media campaign, ${state.summary || 'e-commerce product promotion'}, bold promotional banner style, stunning studio lighting, sharp focus, 8k resolution, photorealistic marketing visual.

NEGATIVE PROMPT:
blurry, low quality, distorted text, ugly composition, artifacts.`;
      }

      case 'chatgpt':
      default: {
        return `[PERINTAH KHUSUS CHATGPT (DIRECT RESPONSE COPYWRITER)]:
Kamu adalah Senior Direct Response Copywriter kelas dunia.
Tuliskan rangkaian naskah copywriting iklan berkonversi tinggi dengan psikologi penjualan yang kuat, gaya bertutur manusiawi, DILARANG PAKAI SIMBOL EM DASH (—), tanpa template robotik, dan tanpa spam emoji:

${rawText}`;
      }
    }
  }

  // ─── 3. ALL VISUAL & IMAGE MODULES (BANNER, THUMBNAIL, FACE CARD, MENU F&B, AFFILIATE, ETC) ───
  switch (engine) {
    case 'gemini': {
      return `[PANDUAN EKSEKUSI GOOGLE GEMINI / IMAGEN 3]:
Buatkan satu gambar visual utuh berkualitas studio tinggi berukuran rasio ${ratio} berdasarkan spesifikasi berikut:

1. KOMPOSISI VISUAL & TATA LETAK:
- Subjek & Latar: ${rawText}
- Penataan Elemen Grafis: Tempatkan teks dan label pendukung di dalam panel kontainer grafis atau badge yang kontras dan menyatu rapi agar tidak melayang di atas foto.
- Tipografi: Cetak teks dengan tipografi tegas, bersih, proporsional, dan BEBAS DARI TANDA PETIK ("" atau “”). Pastikan ejaan kata tepat.

2. KUALITAS PRODUKSI:
- Detail ultra-tajam, pencahayaan fotorealistik alami, tekstur otentik, aspect ratio ${ratio}.`;
    }

    case 'grok': {
      return `[GROK 2 / FLUX.1 PROMPT]:
High-resolution, ultra-photorealistic commercial graphic rendering for ${headline || 'visual creative'} in ${ratio} aspect ratio.

Visual Details:
${rawText}

Execution Style:
Captured on prime 50mm lens, natural studio/candid lighting, authentic physical textures, razor-sharp edge contrast, seamless graphical integration, 8k resolution, cinematic color grading, photorealism.`;
    }

    case 'leonardo': {
      return `[LEONARDO.AI PROMPT]:
PROMPT:
Masterpiece commercial creative rendering, ${headline ? `${headline}, ` : ''}${rawText}, highly detailed, 8k resolution, commercial advertising photography, studio lighting, hyper-realistic, vibrant colors, tack sharp focus.

NEGATIVE PROMPT:
blurry, distorted, typo, bad anatomy, deformed limbs, floating artifacts, oversaturated, low quality, duplicate, cartoon CGI plastic look.`;
    }

    case 'chatgpt':
    default: {
      // Check if rawText already starts with direct command
      if (rawText.startsWith('PERINTAH')) {
        return rawText;
      }
      return `PERINTAH UNTUK CHATGPT (DALL-E 3):
Buatkan dan hasilkan langsung SATU gambar visual berkualitas tinggi berukuran rasio ${ratio} berdasarkan brief berikut. Jangan bertanya instruksi tambahan, langsung generate gambarnya:

${rawText}`;
    }
  }
}
