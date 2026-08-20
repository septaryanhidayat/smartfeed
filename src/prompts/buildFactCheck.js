export const INITIAL_FACT_CHECK = {
  mediaName: 'Cek Fakta Media Indonesia',
  status: 'HOAKS / PALSU',
  claim: '',
  fact: '',
  officialSource: '',
  dateline: 'JAKARTA',
  date: '',
  visualTheme: 'Stempel Merah Tegas & Perbandingan Visual Split',
  aspectRatio: '1:1 (Instagram Feed)',
  supportingPhoto: '',
};

export const VERDICT_STATUSES = [
  { label: '🔴 HOAKS / PALSU', value: 'HOAKS / PALSU', color: '#ef4444', desc: 'Informasi sepenuhnya rekayasa atau tidak berdasar fakta.' },
  { label: '🟡 DISINFORMASI / KONTEKS SALAH', value: 'DISINFORMASI / KONTEKS SALAH', color: '#f59e0b', desc: 'Foto/video asli tetapi diberi narasi atau tahun yang keliru.' },
  { label: '🔵 FAKTA / BENAR', value: 'FAKTA / BENAR', color: '#3b82f6', desc: 'Informasi telah terbukti akurat berdasarkan konfirmasi otoritas resmi.' },
  { label: '🟣 SATIR / PARODI', value: 'SATIR / PARODI', color: '#a855f7', desc: 'Konten humor/parodi yang disalahartikan sebagai berita sungguhan.' },
  { label: '⚪ BELUM TERVERIFIKASI', value: 'BELUM TERVERIFIKASI', color: '#64748b', desc: 'Informasi masih dalam tahap penelusuran dan verifikasi di lapangan.' },
];

export const FACT_CHECK_THEMES = [
  'Stempel Merah Tegas & Perbandingan Visual Split',
  'Clean Editorial Fact-Check Box (Modern Media Style)',
  'Investigative Evidence Board (Forensic Verification)',
  'High-Contrast Bold Alert (Maximum Warning Visibility)',
];

export function buildFactCheck(state) {
  const media = state.mediaName?.trim() || 'Cek Fakta Media Indonesia';
  const status = state.status || 'HOAKS / PALSU';
  const claim = state.claim?.trim() || 'Klaim yang beredar di media sosial...';
  const fact = state.fact?.trim() || 'Fakta sebenarnya berdasarkan verifikasi...';
  const source = state.officialSource?.trim() || 'Sumber Resmi Otoritas';
  const dateline = state.dateline?.trim() || 'JAKARTA';
  const date = state.date?.trim() || '';
  const theme = state.visualTheme || 'Stempel Merah Tegas & Perbandingan Visual Split';
  const ratio = state.aspectRatio?.split(' ')[0] || '1:1';
  const supporting = state.supportingPhoto?.trim() || '';

  const promptText = `PERINTAH: Buatkan dan hasilkan langsung SATU gambar visual Cek Fakta / Fact Check Card ${media} berukuran rasio ${ratio} berikut ini sekarang juga. Jangan bertanya instruksi lanjutan, langsung ciptakan gambarnya:

1. PUTUSAN FAKTA & FOTO PELENGKAP BUKTI:
- Status Putusan: [${status.toUpperCase()}]
- Tema Desain: ${theme}
${supporting ? `- Foto Pelengkap / Tangkapan Bukti: ${supporting}` : ''}
- Aspek Rasio: --ar ${ratio.replace(':', '/')}

2. ELEMEN GRAFIS & TEKS VERIFIKASI PADA GAMBAR:
- Header: ${media.toUpperCase()} · UNIT VERIFIKASI FAKTA
- Stempel Utama: [${status.toUpperCase()}] (Badge tebal di sudut/tengah visual)
- Kolom Klaim: "KLAIM: ${claim}" (Tanda silang merah / highlight kontras)
- Kolom Fakta: "FAKTA: ${fact}" (Highlight verifikasi terpercaya)
- Sumber Rujukan Resmi: "Sumber: ${source}" (${dateline}${date ? ` · ${date}` : ''})

3. DIRECT PROMPT IMAGE GENERATION:
A complete photorealistic fact-check verification card for ${media}, verdict badge [${status}], featuring ${theme}${supporting ? `, with supporting evidence element: ${supporting}` : ''}, clear comparison layout between claim "${claim}" and verified fact "${fact}", official press stamp, 8k resolution --ar ${ratio.replace(':', '/')} --style raw`;

  return {
    raw: promptText,
    status: status,
    claim: claim,
    fact: fact,
    source: source,
    dateline: `${dateline}${date ? `, ${date}` : ''}`,
  };
}
