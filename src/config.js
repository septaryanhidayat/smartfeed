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
  paymentUrl:   pick(cfg.paymentUrl, 'https://aiautomation.myr.id/pl/smart-feed/'),
  affiliateUrl: pick(cfg.affiliateUrl, 'https://web.mayar.id/sign-in/referral/fUAlH05'),

  // Tombol setelah Copy: link ChatGPT biasa + Custom GPT (kosong = sembunyikan tombol GPT).
  chatgptUrl: pick(cfg.chatgptUrl, 'https://chatgpt.com/'),
  gptUrl:     pick(cfg.gptUrl, ''),

  // ── Social (footer) ───────────────────────────────────────
  instagramUrl:    pick(cfg.instagramUrl, 'https://instagram.com/smartfeed'),
  instagramHandle: pick(cfg.instagramHandle, '@smartfeed'),
  facebookUrl:     pick(cfg.facebookUrl, 'https://www.facebook.com/smartfeed'),
  facebookHandle:  pick(cfg.facebookHandle, 'smartfeed'),

  // ── Harga (tampilan) ──────────────────────────────────────
  price:        pick(cfg.price, '90.000'),
  priceStrike:  pick(cfg.priceStrike, '700.000'),
  affiliatePerSignup: Number(pick(cfg.affiliatePerSignup, 63000)),

  // ── Tier 2: Lisensi Reseller (hak jual kembali, profit 100%) ──
  showResellerTier:   cfg.showResellerTier !== false,        // true = tampilkan kartu reseller
  resellerPrice:      pick(cfg.resellerPrice, '290.000'),
  // ── PENDAFTARAN & LOGIN VIA GOOGLE SPREADSHEET ──────────
  sheetWebhookUrl: pick(cfg.sheetWebhookUrl, ''),
  sheetCsvUrl: pick(cfg.sheetCsvUrl, ''),
  authEndpoint: pick(cfg.authEndpoint, ''),
  loginPasswordHash: pick(cfg.loginPasswordHash, '21e37e7c35bf7735516fb55cffd36b025e124647430849feac0b61fff45decd3'),

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
