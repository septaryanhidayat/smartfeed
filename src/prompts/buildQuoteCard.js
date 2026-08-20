export const INITIAL_QUOTE_CARD = {
  mediaName: 'Media Indonesia',
  sourceName: '',
  sourceRole: '',
  quote: '',
  context: 'Konferensi Pers Terbuka',
  dateline: 'JAKARTA',
  date: '',
  portraitStyle: 'Candid Press Conference (Speaking at podium with microphones)',
  lighting: 'Editorial Moody Lighting (High-Contrast Dramatic)',
  aspectRatio: '1:1 (Instagram Feed)',
  supportingPhoto: '',
};

export const PORTRAIT_STYLES = [
  'Candid Press Conference (Speaking at podium with microphones)',
  'Formal Press Portrait (Clean background, direct eye contact)',
  'Investigative Silhouette / Dark Room Interview',
  'Monochrome Editorial (High-contrast black and white journalism)',
  'Courthouse / Trial Bench Expression (Solemn, serious mood)',
  'Field Interview / On-Site Reporting (Natural street/office context)',
];

export const QUOTE_CONTEXTS = [
  'Konferensi Pers Terbuka',
  'Wawancara Eksklusif',
  'Sidang Terbuka Pengadilan',
  'Keterangan Saksi Ahli',
  'Pidato Resmi / Rapat Dengar Pendapat',
  'Klarifikasi Resmi Pihak Terkait',
];

export const QUOTE_LIGHTINGS = [
  'Editorial Moody Lighting (High-Contrast Dramatic)',
  'Natural Newsroom Daylight',
  'Stage / Podium Spotlight with Soft Falloff',
  'Dramatic Rim Light (Edge highlights, dark background)',
  'Classic Documentary B&W Tonal Range',
];

export function buildQuoteCard(state) {
  const media = state.mediaName?.trim() || 'Media Indonesia';
  const name = state.sourceName?.trim() || 'Nama Narasumber';
  const role = state.sourceRole?.trim() || 'Jabatan / Peran';
  const quote = state.quote?.trim() || 'Pernyataan narasumber...';
  const context = state.context?.trim() || 'Konteks Pernyataan';
  const dateline = state.dateline?.trim() || 'JAKARTA';
  const date = state.date?.trim() || '';
  const style = state.portraitStyle || 'Candid Press Conference';
  const lighting = state.lighting || 'Editorial Moody Lighting';
  const ratio = state.aspectRatio?.split(' ')[0] || '1:1';
  const supporting = state.supportingPhoto?.trim() || '';

  const promptText = `PERINTAH: Buatkan dan hasilkan langsung SATU gambar visual Quote Card Tokoh ${media} berukuran rasio ${ratio} berikut ini sekarang juga. Jangan bertanya instruksi lanjutan, langsung ciptakan gambarnya:

1. SUBJEK TOKOH & FOTO PELENGKAP:
- Tokoh Utama: Potret editorial ${name} (${role})
- Ekspresi & Gestur: Berwibawa, serius, kredibel dalam suasana ${context}
${supporting ? `- Detail Visual Pelengkap: ${supporting}` : ''}
- Gaya Potret: ${style}, ${lighting}, lensa 85mm f/1.8, tekstur kulit natural dan tajam tanpa efek kartun.
- Aspek Rasio: --ar ${ratio.replace(':', '/')}

2. ELEMEN GRAFIS KUTIPAN PADA GAMBAR:
- Header: ${media.toUpperCase()} · KUTIPAN TOKOH
- Tanda Petik: Ikon kutipan ("") elegan sebagai penanda
- Teks Kutipan: "${quote}" (Font tegas, kontras tinggi, sangat mudah dibaca)
- Atribusi Narasumber:
  • Nama: ${name}
  • Jabatan: ${role}
  • Konteks: ${context} (${dateline}${date ? ` · ${date}` : ''})

3. DIRECT PROMPT IMAGE GENERATION:
A complete photorealistic journalistic quote card for ${media}, featuring editorial portrait of ${name} (${role}), ${style}${supporting ? `, with supporting environment: ${supporting}` : ''}, ${lighting}, sharp 85mm lens, visible quote typography "${quote}", official newsroom layout, 8k resolution --ar ${ratio.replace(':', '/')} --style raw`;

  return {
    raw: promptText,
    sourceName: name,
    sourceRole: role,
    quote: quote,
    context: context,
    dateline: `${dateline}${date ? `, ${date}` : ''}`,
  };
}
