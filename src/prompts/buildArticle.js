import { INITIAL_ARTICLE_STATE } from '../data/articleOptions.js';
export { INITIAL_ARTICLE_STATE };

/**
 * Builds the comprehensive prompt for Article & Journalism Mode
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
Bertindaklah sebagai Redaktur Pelaksana Senior, Jurnalis Investigatif, dan Ahli Penulisan Media Digital dengan pengalaman lebih dari 15 tahun di media nasional terkemuka (${media}).

OBJECTIVE:
Tuliskan satu naskah artikel / berita jurnalistik utuh, berbobot, akurat, dan siap terbit dengan standar kode etik jurnalistik tertinggi dan kaidah PUEBI/KBBI.

SPESIFIKASI PENULISAN:
- Media / Penerbit: ${media}
- Rubrik / Kategori: ${rubric}
- Topik Utama / Judul Kerja: "${headline}"
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

ATURAN STRUKTUR OUTPUT (WAJIB DIIKUTI LENGKAP):
Tampilkan hasil dalam blok terpisah yang rapi:

1. REKOMENDASI JUDUL (HEADLINE VARIATIONS):
   - Judul Utama (Catchy, Faktual & Kredibel)
   - 3 Variasi Judul Alternatif (Gaya SEO Online, Gaya Koran Cetak, dan Gaya Click-Worthy Medsos tanpa clickbait murahan)

2. LEAD BERITA (PARAGRAF PEMBUKA):
   - Menerapkan prinsip piramida terbalik / hook emosional yang memikat pembaca sejak kalimat pertama (menjawab unsur What, Who, Where, When).

3. TUBUH BERITA & ANALISIS (BODY PARAGRAPHS):
   - Terbagi ke dalam 3-5 sub-heading (H2 / H3) yang runtut dan informatif.
   - Integrasi kutipan narasumber secara natural dengan atribusi yang jelas.
   - Penjelasan konteks latar belakang (Why & How) serta data pembanding.

4. KESIMPULAN / PROSPEK KE DEPAN:
   - Paragraf penutup yang merangkum dampak, langkah lanjutan, atau kesimpulan berimbang.

5. METADATA PUBLIKASI & SOSIAL MEDIA:
   - Meta Description SEO (150-160 karakter untuk Google)
   - Tagar (Hashtags) relevan
   - 1 Paket Caption Medsos Siap Posting (Hook + Ringkasan 3 Poin + Call to Action Baca Selengkapnya)`;
}
