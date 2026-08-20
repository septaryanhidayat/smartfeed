import { INITIAL_ARTICLE_STATE } from '../data/articleOptions.js';
export { INITIAL_ARTICLE_STATE };

/**
 * Builds the comprehensive prompt for Article & Journalism Mode
 * Strictly enforces Natural Human Writing, Zero AI Clichés, and Anti-Robot Syntax.
 * @param {object} s — article mode state
 * @returns {string}
 */
export function buildArticle(s = {}) {
  const media = s.mediaName || 'Media Indonesia';
  const headline = s.headline || 'Judul Berita / Topik Liputan';
  const rubric = s.rubric || 'Nasional & Politik';
  const dateline = s.dateline || 'JAKARTA';
  const format = s.format || 'straight_news';
  const targetMedia = s.targetMedia || 'online_seo';
  const tone = s.tone || 'Netral & Objektif';
  const length = s.length || 'medium';

  return `ROLE & PERSONA:
Bertindaklah sebagai Redaktur Pelaksana Senior dan Jurnalis Investigatif terkemuka di ${media}. Tuliskan naskah dengan gaya bertutur manusia asli: tajam, bernas, berwibawa, dan kaya wawasan lapangan.

OBJECTIVE:
Tuliskan satu naskah artikel / berita jurnalistik utuh siap terbit yang berbobot, akurat, dan mengalir secara alami.

SPESIFIKASI PENULISAN:
- Media / Penerbit: ${media}
- Rubrik / Kategori: ${rubric}
- Topik Utama / Judul Liputan: "${headline}"
- Lokasi & Tanggal (Dateline): ${dateline}
- Format Naskah: ${format.toUpperCase()}
- Target Media Publikasi: ${targetMedia.toUpperCase()}
- Tone / Sudut Pandang: ${tone}
- Target Panjang Tulisan: ${length === 'short' ? '300 – 500 kata' : length === 'long' ? '1.000 – 1.500 kata' : '600 – 900 kata'}

FAKTA UTAMA & INFORMASI LAPANGAN:
- Fakta 5W + 1H: ${s.facts || 'Fakta kejadian utama'}
- Narasumber & Pernyataan Resmi (Quotes): ${s.quotes || 'Kutipan pernyataan narasumber'}
- Detail Sumber / Kronologi: ${s.sourceDetails || 'Rilis pers / liputan lapangan'}
${s.keywords ? `- Kata Kunci / Fokus SEO: ${s.keywords}` : ''}
${s.additionalNotes ? `- Catatan Tambahan Redaksi: ${s.additionalNotes}` : ''}

⛔ ATURAN ANTI-AI & PANDUAN GAYA BAHASA MANUSIA (SANGAT KETAT):
1. DILARANG KERAS MENGGUNAKAN SIMBOL & EMOJI AI:
   - Jangan pernah gunakan emoji template AI seperti: ✨, 🚀, 💡, 📌, 👉, 🔥, ✅, 👇, 🎯, 🌟 di dalam artikel atau judul. Naskah jurnalistik harus bersih, formal, dan berwibawa.
2. HINDARI BASA-BASI & FRASA KLIPING ROBOTIK:
   - Dilarang membuka artikel dengan klise AI seperti: "Di era digital yang serba cepat ini...", "Dalam lanskap modern...", "Tidak dapat dipungkiri bahwa...", "Mari kita telusuri lebih dalam...".
   - Dilarang menggunakan penutup template seperti: "Hal ini menjadi angin segar...", "Patut dinantikan langkah selanjutnya...". Langsung masuk ke inti fakta dan analisis substansial!
3. IRAMA & ALUR PENULISAN ORGANIK (BURSTINESS ALAMI):
   - Gunakan variasi panjang kalimat (gabungan kalimat pendek yang tegas dan kalimat panjang yang kaya konteks). Hindari ritme seragam yang kaku.
   - Hindari pengulangan kata transisi template di awal setiap paragraf ("Selain itu", "Di samping itu", "Oleh karena itu").
4. KONTEN BERISI & KAYA DETAIL (NO FLUFF):
   - Jangan menulis kalimat hampa yang berputar-putar. Berikan data spesifik, konteks sebab-akibat yang logis, dampak nyata bagi publik, dan kutipan narasumber yang menyatu mengalir.

STRUKTUR OUTPUT (TAMPILKAN LENGKAP & RUNTUT):

1. PILIHAN JUDUL (HEADLINES):
   - Judul Utama (Bernas, Tajam & Faktual)
   - 3 Variasi Judul Alternatif (Gaya SEO Portal Berita, Gaya Koran Cetak, dan Gaya Medsos tanpa clickbait murahan)

2. LEAD BERITA (PARAGRAF PEMBUKA):
   - Paragraf pembuka memikat bergaya piramida terbalik / hook naratif manusiawi yang langsung menjawab esensi What, Who, Where, When.

3. TUBUH BERITA & ANALISIS (BODY PARAGRAPHS):
   - 3-5 sub-heading (H2 / H3) yang informatif dan mengalir logis.
   - Integrasi kutipan narasumber dengan atribusi yang natural dan kontekstual.
   - Analisis latar belakang (Why & How) serta dinamika fakta lapangan.

4. KESIMPULAN / PROSPEK KE DEPAN:
   - Paragraf penutup yang merangkum poin kritis dan implikasi jangka panjang secara berimbang.

5. METADATA PUBLIKASI:
   - Meta Description SEO (150-160 karakter untuk Google Search)
   - 5 Tagar (Hashtags) relevan
   - 1 Paket Caption Medsos Ringkas & Padat`;
}
