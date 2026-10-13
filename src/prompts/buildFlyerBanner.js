import { SIZE_VARIANTS, THEMES_AND_STYLES, PRINTING_SPECS, FINISHING_OPTIONS } from '../data/flyerBannerOptions.js';

export function buildFlyerBanner(state) {
  const format = state.formatType || 'spanduk';
  const sizeVariantObj = SIZE_VARIANTS.find((s) => s.id === state.sizeVariant) || SIZE_VARIANTS[0];
  const themeObj = THEMES_AND_STYLES.find((t) => t.id === state.themeStyle) || THEMES_AND_STYLES[0];
  const printSpecObj = PRINTING_SPECS.find((p) => p.value === state.printingSpec) || PRINTING_SPECS[0];
  const finishingObj = FINISHING_OPTIONS.find((f) => f.value === state.finishing) || FINISHING_OPTIONS[0];

  const title = (state.title || 'JUDUL SPANDUK / FLYER ACARA').trim();
  const subTitle = (state.subTitle || '').trim();
  const institution = (state.institution || 'LEMBAGA PENDIDIKAN & DAKWAH').trim();
  const badgeText = (state.badgeText || '').trim();
  const eventDate = (state.eventDate || '').trim();
  const eventTime = (state.eventTime || '').trim();
  const eventLocation = (state.eventLocation || '').trim();
  const speaker = (state.speaker || '').trim();
  const contactPerson = (state.contactPerson || '').trim();
  const callToAction = (state.callToAction || '').trim();
  const primaryColor = state.customPrimary || themeObj.primary;
  const secondaryColor = state.customSecondary || themeObj.secondary;

  const ratio = sizeVariantObj.ratio;
  const dims = sizeVariantObj.dims;
  const arParam = ratio.replace(':', '/');

  const promptText = `PERINTAH: Buatkan dan hasilkan SATU rancangan desain visual ${sizeVariantObj.name} (${dims}, Aspek Rasio ${ratio}) profesional siap cetak/publikasi berikut ini:

1. FORMAT, TIPE & UKURAN MEDIA:
- Jenis Desain: ${format.toUpperCase()} (${sizeVariantObj.name})
- Dimensi Fisik: ${dims} (Rasio ${ratio})
- Standar Output: ${printSpecObj.label}
- Finishing Cetak: ${finishingObj.label}
- Margin Aman Teks: Jaga jarak teks minimal 5-8% dari tepi agar aman saat pelipatan dan pemasangan mata ayam / selongsong.

2. TEMA VISUAL, WARNA & GAYA ESTETIKA:
- Gaya Tema: ${themeObj.name}
- Karakter Visual: ${themeObj.desc}
- Palet Warna Dominan: Primary ${primaryColor}, Accent/Secondary ${secondaryColor}, Background ${themeObj.bg}
- Ornamen & Tekstur: Aksen geometric modern, ornamen islami elegan (arabesque/islamic arches halus), pencahayaan megah, partikel cahaya spiritual halus tanpa membuat teks tenggelam.
- Tipografi: Huruf sans-serif bold tegas mudah dibaca dari kejauhan (high legibility), kontras tajam antara teks dan latar belakang.

3. TATA LETAK & HIRARKI KONTEN PADA DESAIN:
- Header Atas: [LOGO RESMI] ${institution.toUpperCase()}${badgeText ? ` · [BADGE: ${badgeText}]` : ''}
- Judul Utama (Fokus Terbesar): "${title}"
${subTitle ? `- Sub-Judul / Tema: "${subTitle}"` : ''}
${speaker ? `- Narasumber / Tokoh: "${speaker}"` : ''}
- Kotak Informasi Waktu & Tempat (Ikonik & Rapi):
  * Tanggal: ${eventDate || '-'}
  * Waktu: ${eventTime || '-'}
  * Lokasi: ${eventLocation || '-'}
${contactPerson ? `- Kontak & Registrasi: "${contactPerson}"` : ''}
${callToAction ? `- Call to Action (CTA): "${callToAction}"` : ''}

4. SPESIFIKASI PRODUKSI PERCETAKAN DIGITAL (PRINT-READY):
- Resolusi: 150 - 300 DPI
- Profil Warna: CMYK Mode (Siap kirim ke mesin cetak Digital Printing Flexi / Offset Art Paper)
- Pemasangan: ${finishingObj.label}

5. DIRECT AI IMAGE GENERATOR PROMPT (DALL-E 3 / MIDJOURNEY / LEONARDO):
A professional graphic design layout for ${sizeVariantObj.name} (${dims}), ratio --ar ${arParam}. High impact event typography design for "${title}". Subtitle "${subTitle}". Organization header "${institution}". ${themeObj.name} aesthetic with rich colors ${primaryColor} and ${secondaryColor}, elegant modern composition, crisp vector-sharp typography hierarchy, date and venue badges, photorealistic high contrast lighting, clean vector graphic banners, commercial print shop quality --ar ${arParam} --style raw --v 6.0`;

  return promptText;
}
