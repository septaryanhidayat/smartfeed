/* ====================================================================
   KONFIGURASI - edit file ini lalu upload. TIDAK perlu build/coding.
   Baca PANDUAN-SETUP.txt untuk panduan lengkap + aturan tanda kutip.
   ==================================================================== */
window.__AF_CONFIG = {

   /* -- 1. BRANDING --------------------------------------------------- */
   brandName: "Smart Feed",              // nama brandmu (kata terakhir tampil warna aksen)
   tagline: "AI Studio",           // teks kecil di bawah logo
   logoUrl: "/landing/brand/logo.png",    // timpa file logo di folder ini, atau isi URL gambar

   /* -- 1b. WARNA (opsional) - kosongkan "" = pakai bawaan -------------
      accentColor : warna utama (tombol, link, glow). bgColor : background GELAP. */
   accentColor: "#00a8b5",   // warna aksen utama teal dari logo SmartFeed
   bgColor: "#f4f7fa",   // background terang soft light khas logo

   /* -- 2. LINK ------------------------------------------------------- */
   paymentUrl: "/checkout",   // link pembayaran/checkout kamu
   affiliateUrl: "",                            // link daftar affiliate (boleh kosong "")

   // Mode "9 Feed Konsisten" - link ChatGPT untuk tombol setelah Copy & tutorial.
   // chatgptUrl = ChatGPT biasa. gptUrl = Custom GPT kamu sendiri (kosong "" = tombol GPT disembunyikan).
   chatgptUrl: "https://chatgpt.com/",
   gptUrl: "",

   /* -- 2b. INFORMASI PERUSAHAAN & KONTAK ---------------------------- */
   companyName: "Beranda Teknologi Digital",
   companyUrl: "https://berandadigital.net",
   contactEmail: "info@berandadigital.net",
   contactPhone: "089695249089",
   contactPhoneDisplay: "0896-9524-9089",
   contactAddress: "Jalan Sarjana Blok A, Kelurahan Timbangan, Kecamatan Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan, 30862",

   /* -- 2c. SOCIAL (footer) ------------------------------------------- */
   instagramUrl: "https://www.instagram.com/berandadigital_net/",
   instagramHandle: "@berandadigital_net",
   facebookUrl: "https://www.facebook.com/berandateknologidigital",
   facebookHandle: "Beranda Teknologi Digital",

   /* -- 3. HARGA (tampilan teks) -------------------------------------- */
   price: "149.000",            // harga tampil untuk tes
   priceStrike: "499.000",    // harga coret
   affiliatePerSignup: 25000, // komisi affiliate per pendaftaran (angka, tanpa kutip)
   enableFreeTrainingClaim: true, // true = tampilkan link/tombol klaim gratis peserta pelatihan

   /* -- 3b. TIER LISENSI RESELLER ------------------------------------
      false = sembunyikan kartu "Jual Ulang" (untuk situs jualan biasa). */
   showResellerTier: false,

   /* -- 4. PENDAFTARAN & LOGIN via GOOGLE SPREADSHEET ----------------
      a. sheetWebhookUrl: URL Google Apps Script Web App untuk otomatis mencatat
         email & nama peserta pelatihan langsung ke Google Sheet saat mendaftar.
      b. sheetCsvUrl: URL Published CSV spreadsheet daftar email. */
   sheetWebhookUrl: "https://script.google.com/macros/s/AKfycbyU-nWqkiP62eGmmJz6aIIRifLWdQHzCzHEsLHWGkK8_DSOpsHSMXLvpY69uBNuKgfM/exec",
   sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQArR06UvroNZT1AReqN5kPWbyrHvq0VVaLKezPHcFarwDhY0zO69wjtZxajvdzKlqZlm2PVbcx175-/pub?gid=0&single=true&output=csv",

   // Password login (semua pelanggan pakai 1 password ini).
   loginPasswordHash: "21e37e7c35bf7735516fb55cffd36b025e124647430849feac0b61fff45decd3",
   // ^ bawaan = password "SmartFeedOKE".
};

