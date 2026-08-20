import { INITIAL_VIDEOSCRIPT_STATE } from '../data/videoScriptOptions.js';
export { INITIAL_VIDEOSCRIPT_STATE };

/**
 * Builds the comprehensive prompt for Video Script, Interview & Storyboard Studio.
 * Formats structured output with Timecodes, Visual Cues, VO, On-Screen Text, and AI Image Prompts.
 * Enforces Zero AI Clichés, No Emojis, and Zero Em-Dashes.
 * @param {object} s — video script mode state
 * @returns {string}
 */
export function buildVideoScript(s = {}) {
  const title = s.title || 'Judul Video / Proyek Kreatif';
  const scriptType = s.scriptType || 'short_video';
  const duration = s.duration || '60s';
  const platform = s.platform || 'TikTok & IG Reels';
  const tone = s.tone || 'Enerjik, Cepat & Menghibur';
  const visualStyle = s.visualStyle || 'Cinematic 4K';
  const speaker = s.speaker || 'Host / Creator';

  return `ROLE & PERSONA:
Bertindaklah sebagai Creative Video Director, Head of Scriptwriting, dan Executive Producer dengan pengalaman memproduksi video viral berkonversi tinggi dan program siaran profesional.

OBJECTIVE:
Tuliskan naskah video / script wawancara / storyboard visual lengkap siap produksi yang memikat penonton dari detik pertama hingga akhir.

SPESIFIKASI PRODUKSI:
- Judul / Topik Proyek: "${title}"
- Format Naskah: ${scriptType.toUpperCase()}
- Target Durasi: ${duration}
- Platform Distribusi: ${platform}
- Tone & Suasana: ${tone}
- Gaya Sinematografi & Visual: ${visualStyle}
- Karakter / Pengisi Suara (Talent): ${speaker}

PESAN UTAMA & DETAIL MATERI:
- Pesan Kunci / Core Message: ${s.coreMessage || 'Pesan utama video'}
- Poin-Poin Pembahasan: ${s.keyPoints || 'Poin penting yang wajib masuk dalam video'}
- Call to Action (CTA): ${s.callToAction || 'Aksi yang diinginkan dari penonton'}
${s.additionalNotes ? `- Catatan Khusus Sutradara: ${s.additionalNotes}` : ''}

⛔ ATURAN ANTI-AI & PANDUAN BAHASA ALAMI MANUSIA (SANGAT KETAT):
1. DILARANG KERAS MENGGUNAKAN SIMBOL EM DASH (—) ATAU EN DASH (–):
   - Jangan pernah menyisipkan tanda garis panjang em-dash (—) di dalam naskah dialog atau teks layar. Gunakan tanda koma (,), tanda kurung (), titik dua (:), atau tanda minus biasa (-) standar keyboard.
2. DILARANG MENGGUNAKAN EMOJI / SIMBOL AI:
   - Hindari polusi simbol robotik (✨, 🚀, 💡, 📌, 👉, 🔥, ✅, 👇). Naskah harus bersih dan teleprompter-ready.
3. ALUR PERCAKAPAN MANUSIAWI ASLI (NATURAL CONVERSATION):
   - Tulis naskah dialog dan Voice Over seperti cara manusia Indonesia berbicara sungguhan: luwes, tidak kaku, ritme variatif, dan mudah diucapkan tanpa belitan lidah.
4. HOOK AWAL KUAT (NO BASA-BASI):
   - Dilarang membuka dengan sapaan klise robotik. Buka langsung dengan visual arresting, pertanyaan provokatif, atau pernyataan mengejutkan.

STRUKTUR OUTPUT NASKAH (LENGKAP & RUNTUT):

1. RINGKASAN PRODUKSI & HOOK CONCEPT:
   - Konsep 3 Detik Pertama (Visual Hook + Verbal Hook)
   - Karakteristik Audio / Backsound BGM & Mood Lighting

2. NASKAH SCENE-BY-SCENE / TABLEAU PRODUKSI:
   Untuk setiap scene (Scene 1, Scene 2, dst.), sajikan dalam format terstruktur:
   \`\`\`text
   [TIMECODE: 00:00 - 00:05] · SCENE 1
   - TIPE SHOT & KAMERA : (Contoh: Close-up, Slow Dolly In, Eye-level)
   - VISUAL LAPANGAN    : (Deskripsi aksi talent, latar, properti, dan ekspresi)
   - AUDIO / VOICE OVER : (Naskah dialog yang dibacakan, natural tanpa em-dash)
   - ON-SCREEN TEXT     : (Teks grafis / subtitle dinamis yang muncul di layar)
   - SOUND EFFECT (SFX) : (Efek suara pemanis, misal: Whoosh, Click, Ambient)
   - PROMPT GAMBAR AI   : (Prompt visual bahasa Inggris sinematik untuk generate papan storyboard)
   \`\`\`

3. REKOMENDASI SHOT LIST & B-ROLL TAMBAHAN:
   - Daftar 3-5 cutaway / footage pelengkap untuk memperkaya proses editing.

4. KETERANGAN CALL TO ACTION & TEKS CAPTION POSTING:
   - Panduan aksi akhir video + 1 paket caption siap upload beserta tagar yang relevan.`;
}
