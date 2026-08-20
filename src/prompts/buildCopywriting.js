/**
 * Builds the Copy Writing performance copy prompt (text, matches reference exactly).
 * Enforces natural human psychology, conversion copy, zero robotic AI phrases, and no emoji spam.
 * @param {object} s — copywriting mode state
 * @returns {string}
 */
export function buildCopywriting(s = {}) {
  return `ROLE: Senior Direct-Response Copywriter, Meta Ads Creative Strategist, dan Conversion Psychology Specialist.
OBJECTIVE: Tuliskan rangkaian naskah copy iklan yang bernas, persuasif, mengalir secara manusiawi, dan terbukti menghasilkan penjualan tinggi.

⛔ ATURAN ANTI-AI & PANDUAN GAYA BAHASA MANUSIA (WAJIB DIIKUTI):
1. DILARANG MENGGUNAKAN SIMBOL/EMOJI AI KLASIK:
   - Hindari penggunaan simbol robotik berlebihan seperti: ✨, 🚀, 💡, 📌, 👉, 🔥, ✅, 👇 di setiap baris. Gunakan kata-kata yang kuat dan berdaya pikat alami.
2. HINDARI FRASA KLISE & BUZZWORD KOSONG AI:
   - Dilarang memakai kalimat robotik seperti: "Apakah Anda siap untuk merevolusi...", "Tingkatkan pengalaman Anda ke level berikutnya...", "Solusi terbaik untuk kebutuhan Anda...".
   - Tulis dengan bahasa percakapan manusia Indonesia asli yang relate dengan masalah nyata audiens.
3. ALUR EMOSIONAL & PSIKOLOGI KONVERSI TINGGI:
   - Fokus pada pain point spesifik, keuntungan emosional nyata (bukan sekadar daftar fitur kering), dan urgensi yang masuk akal.

OUTPUT RULES:
1) JANGAN tampilkan JSON / jangan jelaskan proses atau prolog basa-basi.
2) WAJIB output dalam CODE BLOCK TERPISAH untuk setiap section agar tombol COPY muncul.
3) Jangan gabungkan semua output jadi satu block panjang.
4) Jangan pakai tabel.

CONTEXT PENAWARAN:
RINGKASAN PRODUK / PENAWARAN:
${s.summary || ''}

TARGET AUDIENS:
${s.audience || ''}

SUMBER MARKETING ANGLE:
${s.angle || ''}

TUJUAN IKLAN:
${s.objective || ''}

PLATFORM PENEMPATAN:
${s.platform || ''}

STYLE PENULISAN:
${s.style || ''}

SAPAAN KE AUDIENS:
${s.greeting || ''}

DELIVERABLES (TOTAL 10 COPY TERBAIK):
- Awareness: Banner Text (3), Headline Hooks (2), Primary Text Meta Ads (1), CTA Variations (2)
- Consideration: Banner Text (3), Headline Hooks (2), Primary Text Meta Ads (1), CTA Variations (2)
- Conversion: Banner Text (4), Headline Hooks (3), Primary Text Meta Ads (2), CTA Variations (3)

SECTION LIST (WAJIB ADA, MASING-MASING BLOCK SENDIRI):
Awareness — Banner Text
Awareness — Headline Hooks
Awareness — Primary Text Meta Ads
Awareness — CTA Variations
Consideration — Banner Text
Consideration — Headline Hooks
Consideration — Primary Text Meta Ads
Consideration — CTA Variations
Conversion — Banner Text
Conversion — Headline Hooks
Conversion — Primary Text Meta Ads
Conversion — CTA Variations
Scroll Stopper Opening (3)
Short Hook Text (5)
Meta Ad Copy (3 paket: Hook + Primary Text + CTA)

FORMAT OUTPUT:
\`\`\`text
Awareness — Banner Text

1. ...
2. ...
3. ...
\`\`\`

Mulai output sekarang. Tuliskan naskah berkualitas manusiawi dalam code block terpisah.`;
}

export const INITIAL_COPYWRITING = {
  summary: '',
  audience: '',
  angle: '',
  objective: 'Direct Sales / Conversion',
  platform: 'Meta Ads (FB & IG)',
  style: 'Friendly Casual',
  greeting: 'Aku - Kamu (Casual)',
};
