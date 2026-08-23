/**
 * KONFIGURASI RUNTIME (white-label / reseller).
 *
 * Nilai dibaca dari window.__AF_CONFIG yang di-set oleh /config.js
 * (file teks biasa di root, dimuat SEBELUM bundle). Artinya buyer bisa
 * mengubah brand, link bayar, password, & sumber login HANYA dengan
 * mengedit /config.js — TANPA build ulang.
 *
 * Kalau window.__AF_CONFIG tidak ada (mis. dev), pakai default di bawah —
 * yaitu setup ASLI milik kamu (Airtable). Jadi situsmu sendiri tidak berubah.
 */

const cfg = (typeof window !== 'undefined' && window.__AF_CONFIG) || {};
const pick = (v, d) => (v === undefined || v === null || v === '' ? d : v);

const isTruthy = (val, defaultVal = true) => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'false' || s === 'off' || s === '0' || s === 'no' || s === 'disable' || s === 'disabled' || s === 'tutup') return false;
    if (s === 'true' || s === 'on' || s === '1' || s === 'yes' || s === 'enable' || s === 'enabled' || s === 'buka') return true;
  }
  return Boolean(val);
};

export const CONFIG = {
  // ── Branding ──────────────────────────────────────────────
  brandName: pick(cfg.brandName, 'Smart Feed'),
  tagline:   pick(cfg.tagline, 'AI Design Studio · v2.1'),
  logoUrl:   pick(cfg.logoUrl, '/landing/brand/logo.png'),

  // ── Warna (opsional; kosong = pakai default merah/gelap) ──
  // accentColor : warna utama brand (tombol, link, glow). Hex, mis "#7c3aed".
  // bgColor     : warna dasar background (gelap). Hex, mis "#0a0a14".
  accentColor: pick(cfg.accentColor, ''),
  bgColor:     pick(cfg.bgColor, ''),

  // ── Link ──────────────────────────────────────────────────
  paymentUrl:   pick(cfg.paymentUrl, '/checkout'),
  affiliateUrl: pick(cfg.affiliateUrl, ''),

  // Tombol setelah Copy: link ChatGPT biasa + Custom GPT (kosong = sembunyikan tombol GPT).
  chatgptUrl: pick(cfg.chatgptUrl, 'https://chatgpt.com/'),
  gptUrl:     pick(cfg.gptUrl, ''),

  // ── Social & Company Info (footer & legal) ────────────────
  companyName:     pick(cfg.companyName, 'Beranda Teknologi Digital'),
  companyUrl:      pick(cfg.companyUrl, 'https://berandadigital.net'),
  contactEmail:    pick(cfg.contactEmail, 'info@berandadigital.net'),
  contactPhone:    pick(cfg.contactPhone, '089695249089'),
  contactPhoneDisplay: pick(cfg.contactPhoneDisplay, '0896-9524-9089'),
  contactAddress:  pick(cfg.contactAddress, 'Jalan Sarjana Blok A, Kelurahan Timbangan, Kecamatan Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan, 30862'),

  instagramUrl:    pick(cfg.instagramUrl, 'https://www.instagram.com/berandadigital_net/'),
  instagramHandle: pick(cfg.instagramHandle, '@berandadigital_net'),
  facebookUrl:     pick(cfg.facebookUrl, 'https://www.facebook.com/berandateknologidigital'),
  facebookHandle:  pick(cfg.facebookHandle, 'Beranda Teknologi Digital'),

  // ── Harga (tampilan) ──────────────────────────────────────
  price:        pick(cfg.price, '0'),
  priceStrike:  pick(cfg.priceStrike, '499.000'),
  affiliatePerSignup: Number(pick(cfg.affiliatePerSignup, 25000)),
  enableFreeTrainingClaim: isTruthy(cfg.enableFreeTrainingClaim, true),

  // ── Tier 2: Lisensi Reseller (hak jual kembali, profit 100%) ──
  showResellerTier:   isTruthy(cfg.showResellerTier, false),        // true = tampilkan kartu reseller
  resellerPrice:      pick(cfg.resellerPrice, '290.000'),
  resellerStrike:     pick(cfg.resellerStrike, '1.500.000'),
  resellerPaymentUrl: pick(cfg.resellerPaymentUrl, '/checkout?plan=reseller'),

  // ── PENDAFTARAN & LOGIN VIA GOOGLE SPREADSHEET ──────────
  sheetWebhookUrl: pick(cfg.sheetWebhookUrl, ''),
  sheetCsvUrl: pick(cfg.sheetCsvUrl, ''),
  authEndpoint: pick(cfg.authEndpoint, ''),
  loginPasswordHash: pick(cfg.loginPasswordHash, '21e37e7c35bf7735516fb55cffd36b025e124647430849feac0b61fff45decd3'),

  // ── Ekosistem Produk Digital ──────────────────────────────
  ecosystemProducts: cfg.ecosystemProducts || [
    {
      id: 'smartfeed',
      name: 'SmartFeed',
      category: 'AI Design Studio',
      desc: 'Studio visual AI untuk banner promosi, 9-feed IG, carousel, dan iklan komersial instan.',
      logo: '/landing/ecosystem/smartfeed.jpg',
      url: 'https://smartfeed.berandadigital.net',
      badge: 'Active Studio'
    },
    {
      id: 'smartedu',
      name: 'SmartEdu',
      category: 'Portal Edukasi & Big Data',
      desc: 'Platform big data pendidikan, manajemen kurikulum, modul ajar, dan sistem materi terpadu.',
      logo: '/landing/ecosystem/smartedu.jpg',
      url: 'https://bigdata.sitrobbani.sch.id/',
      badge: 'Edukasi & Data'
    },
    {
      id: 'smartnews',
      name: 'SmartNews',
      category: 'Portal Berita Online',
      desc: 'Portal media berita online modern, menyajikan ragam informasi terkini, aktual, dan terpercaya.',
      logo: '/landing/ecosystem/smartnews.jpg',
      url: 'https://smartnews.berandadigital.net',
      badge: 'Portal Berita'
    },
    {
      id: 'smartsdm',
      name: 'SmartSDM',
      category: 'Manajemen SDM & Talenta',
      desc: 'Sistem manajemen talenta cerdas, penilaian KPI, SOP perusahaan, & otomasi pengelolaan SDM.',
      logo: '/landing/ecosystem/smartsdm.jpg',
      url: '',
      badge: 'Segera Hadir'
    },
    {
      id: 'smartsynth',
      name: 'SmartSynth',
      category: 'Fact Check & Metadata AI',
      desc: 'Platform verifikasi keaslian konten digital, deteksi hoaks, audit metadata foto/video, dan analisis rekayasa AI.',
      logo: '/landing/ecosystem/smartsynth.png',
      url: '',
      badge: 'Segera Hadir'
    },
  ],

  // Kredensial Airtable (terobfuscate) HANYA ada di config milik pemilik asli.
  // Paket reseller TIDAK menyertakan ini → token kamu tidak ikut terjual.
  // Bentuk: { t, b, f:[...], k }
  airtable: cfg.airtable || null,
};

// Wordmark: kata terakhir di-accent (mis. "Smart Feed" → Smart + <Feed>).
export function brandParts() {
  const words = CONFIG.brandName.trim().split(/\s+/);
  if (words.length === 1) return { lead: '', accent: words[0] };
  return { lead: words.slice(0, -1).join(' '), accent: words[words.length - 1] };
}
