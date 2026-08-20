export const INITIAL_NEWS_CARD = {
  mediaName: 'Media Indonesia',
  badge: 'BREAKING NEWS',
  rubric: 'Hukum & Kriminal',
  headline: '',
  dateline: 'JAKARTA',
  date: '',
  lead: '',
  keyPoint: '',
  aspectRatio: '1:1 (Instagram Feed)',
  photographyStyle: 'Documentary Photojournalism (Reuters / AP style, candid realism)',
  lighting: 'Natural Day Press Lighting',
  sceneDescription: '',
  supportingPhoto: '',
};

export const NEWS_BADGES = [
  'BREAKING NEWS',
  'EKSKLUSIF',
  'LAPORAN KHUSUS',
  'UPDATE TERKINI',
  'SOROTAN UTAMA',
  'LIVE REPORT',
];

export const NEWS_RUBRICS = [
  'Politik & Pemerintahan',
  'Hukum & Kriminal',
  'Ekonomi & Bisnis',
  'Investigasi Mendalam',
  'Internasional',
  'Humaniora & Sosial',
  'Bencana & Iklim',
  'Sains & Teknologi',
  'Olahraga',
  'Kesehatan',
];

export const PHOTO_STYLES = [
  'Documentary Photojournalism (Reuters / AP style, candid realism)',
  'Press Conference Realism (Microphones, flashes, intense podium)',
  'On-the-Scene / Ground Zero (Authentic incident location candid)',
  'Investigative Silhouette / Moody Lighting (Dramatic contrast)',
  'Courthouse / Trial Room Action (Formal legal atmosphere)',
  'Field Reporting Action (Reporters with camera gear on location)',
];

export const PHOTO_LIGHTINGS = [
  'Natural Day Press Lighting',
  'Night Flash Photography (Hard flash news style)',
  'Indoor Florescent Newsroom Light',
  'Dramatic Sunset / Golden Hour Incident',
  'Moody High-Contrast Ambient',
];

export const NEWS_RATIOS = [
  '1:1 (Instagram Feed)',
  '4:5 (Instagram Portrait Feeds)',
  '16:9 (Twitter / Web Banner)',
  '9:16 (Story / Reels / TikTok)',
];

export function buildNewsCard(state) {
  const media = state.mediaName?.trim() || 'Media Indonesia';
  const badge = state.badge || 'BREAKING NEWS';
  const rubric = state.rubric || 'Nasional';
  const headline = state.headline?.trim() || 'Headline Berita';
  const dateline = state.dateline?.trim() || 'JAKARTA';
  const date = state.date?.trim() || '';
  const lead = state.lead?.trim() || '';
  const keyPoint = state.keyPoint?.trim() || '';
  const ratio = state.aspectRatio?.split(' ')[0] || '1:1';
  const photoStyle = state.photographyStyle || 'Documentary Photojournalism';
  const lighting = state.lighting || 'Natural Day Press Lighting';
  const scene = state.sceneDescription?.trim() || 'News report scene on location';
  const supporting = state.supportingPhoto?.trim() || '';

  const promptText = `PERINTAH: Buatkan dan hasilkan langsung SATU gambar visual News Card Editorial ${media} berukuran rasio ${ratio} berikut ini sekarang juga. Jangan bertanya instruksi tambahan, langsung generate gambarnya:

1. UTAMA & FOTO PELENGKAP BERITA:
- Adegan Utama: ${scene}
${supporting ? `- Foto Pelengkap / Bukti Tambahan: ${supporting} (Tampilkan sebagai elemen inset foto atau komposisi terpadu di bagian kartu berita)` : ''}
- Gaya Fotografi: ${photoStyle}, fotorealistik jurnalistik standar kantor berita pers, tajam, natural, candid, tanpa filter kartun/fantasi.
- Pencahayaan: ${lighting}, kontras realistis dan tonal warna pers terpercaya.
- Aspek Rasio: --ar ${ratio.replace(':', '/')}

2. ELEMEN GRAFIS & TIPOGRAFI BERITA (Tercetak Jelas pada Gambar):
- Header Atas: [${badge.toUpperCase()}] · ${media.toUpperCase()}
- Rubrik: ${rubric}
- Dateline: ${dateline.toUpperCase()}${date ? ` · ${date}` : ''}
- Judul Headline: "${headline}" (Teks tebal, font editorial tegas, mudah dibaca jelas)
${lead ? `- Lead Berita: "${lead}"` : ''}
${keyPoint ? `- Fakta Kunci: "${keyPoint}"` : ''}

3. DIRECT PROMPT IMAGE GENERATION:
A complete photorealistic journalistic news card for ${media}, featuring ${scene}${supporting ? `, with supporting inset element: ${supporting}` : ''}, ${photoStyle}, ${lighting}, authentic newsroom editorial layout, clean bold headline typography reading "${headline}", badge [${badge}], dateline ${dateline}, 8k ultra detailed photography --ar ${ratio.replace(':', '/')} --style raw`;

  return {
    raw: promptText,
    headline: headline,
    badge: badge,
    rubric: rubric,
    dateline: `${dateline}${date ? `, ${date}` : ''}`,
    lead: lead,
    keyPoint: keyPoint,
  };
}
