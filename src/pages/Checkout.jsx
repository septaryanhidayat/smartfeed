import { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, ArrowLeft,
  RefreshCw, AlertCircle, Sparkles, Building2, Wallet, QrCode, Check, CheckCircle2, Copy, LogIn
} from 'lucide-react';
import { CONFIG, brandParts } from '../config.js';
import SafeImage from '../landing/primitives/SafeImage.jsx';

// Active payment channels matching user's TriPay dashboard & File 1
const PAYMENT_OPTIONS = [
  {
    category: 'QRIS (Semua Bank & E-Wallet)',
    icon: QrCode,
    items: [
      {
        id: 'QRIS',
        name: 'QRIS',
        desc: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay',
        logo: '/payment-icons/qris.png',
        popular: true,
      },
    ],
  },
  {
    category: 'Transfer Bank (Virtual Account)',
    icon: Building2,
    items: [
      {
        id: 'MANDIRIVA',
        name: 'Bank Mandiri',
        desc: 'Virtual Account Mandiri (Livin\' / ATM)',
        logo: '/payment-icons/mandiri.png',
      },
      {
        id: 'BNIVA',
        name: 'Bank BNI',
        desc: 'Virtual Account BNI (Mobile Banking / ATM)',
        logo: '/payment-icons/bni.png',
      },
      {
        id: 'BRIVA',
        name: 'Bank BRI',
        desc: 'Virtual Account BRI (BRImo / ATM)',
        logo: '/payment-icons/bri.png',
      },
      {
        id: 'BSIVA',
        name: 'Bank BSI',
        desc: 'Virtual Account BSI (BSI Mobile / ATM)',
        logo: '/payment-icons/bsi.png',
      },
      {
        id: 'BCAVA',
        name: 'Bank BCA',
        desc: 'Virtual Account BCA (BCA Mobile / KlikBCA)',
        logo: '/payment-icons/bca.png',
      },
    ],
  },
  {
    category: 'E-Wallet (Aplikasi Dompet Digital)',
    icon: Wallet,
    items: [
      {
        id: 'SHOPEEPAY',
        name: 'ShopeePay',
        desc: 'Aplikasi Shopee / ShopeePay',
        logo: '/payment-icons/shopeepay.png',
      },
      {
        id: 'DANA',
        name: 'DANA',
        desc: 'Aplikasi Dompet Digital DANA',
        logo: '/payment-icons/dana.png',
      },
      {
        id: 'OVO',
        name: 'OVO',
        desc: 'Aplikasi Dompet Digital OVO',
        logo: '/payment-icons/ovo.png',
      },
    ],
  },
];

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'QRIS',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  // Check if returning from a successful TriPay payment
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isPaidReturn = searchParams && (searchParams.get('status') === 'paid' || searchParams.get('status') === 'success');
  const returnRef = searchParams ? (searchParams.get('ref') || searchParams.get('reference') || '') : '';
  const returnEmail = searchParams ? (searchParams.get('email') || '') : '';
  const returnName = searchParams ? (searchParams.get('name') || '') : '';

  const parseNum = (val) => parseInt(String(val).replace(/\D/g, ''), 10) || 0;
  const priceInt = parseNum(CONFIG.price);
  const strikeInt = parseNum(CONFIG.priceStrike);
  const discountInt = Math.max(strikeInt - priceInt, 0);

  const priceNum = CONFIG.price !== undefined && CONFIG.price !== '' ? CONFIG.price : '0';
  const priceStrikeNum = CONFIG.priceStrike || '499.000';
  const discountFormatted = discountInt > 0 ? discountInt.toLocaleString('id-ID') : '0';

  // Double Safety Net: Sinkronkan otomatis ke Google Sheet saat mendarat di halaman sukses
  useEffect(() => {
    if (isPaidReturn && returnEmail && CONFIG.sheetWebhookUrl) {
      try {
        const payload = JSON.stringify({
          event: 'tripay_payment_success',
          status: 'PAID',
          merchant_ref: returnRef || ('SF-RET-' + Date.now()),
          email: returnEmail,
          name: returnName || '',
          amount: priceInt,
          source: 'TriPay Checkout Return'
        });

        fetch(CONFIG.sheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).catch(() => {});
      } catch (err) {
        console.warn('[checkout] sync err', err);
      }
    }
  }, [isPaidReturn, returnEmail, returnRef, returnName, priceInt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMethod = (id) => {
    setFormData((prev) => ({ ...prev, paymentMethod: id }));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText('SmartFeedOKE');
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Lengkapi Nama Lengkap, Email, dan No WhatsApp Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/tripay-create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          method: formData.paymentMethod,
          plan: 'lifetime',
        }),
      });

      const json = await res.json();

      if (json.success && json.data && json.data.checkout_url) {
        window.location.href = json.data.checkout_url;
      } else {
        setErrorMessage(json.message || 'Gagal memproses ke TriPay. Silakan coba kembali.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('TriPay API Error:', err);
      setErrorMessage('Terjadi kendala koneksi ke server. Silakan coba sesaat lagi.');
      setIsLoading(false);
    }
  };

  // SUCCESS SCREEN (Setelah Selesai Bayar di TriPay)
  if (isPaidReturn) {
    return (
      <div className="min-h-screen bg-bg text-text flex flex-col justify-between selection:bg-accent/20">
        <header className="border-b border-border/80 bg-bg-panel/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
          <div className="max-w-xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shadow-sm shrink-0">
                <SafeImage
                  src={CONFIG.logoUrl}
                  alt={CONFIG.brandName}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-black text-text tracking-tight">
                  {brandParts().lead && <>{brandParts().lead} </>}
                  <span className="text-accent">{brandParts().accent}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] mono text-emerald-400 uppercase tracking-wider font-semibold">
                  ● Pembayaran Sukses
                </span>
              </div>
            </a>
          </div>
        </header>

        <main className="flex-1 py-8 sm:py-12 px-4 flex items-center justify-center">
          <div className="max-w-lg w-full surface p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] text-center space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold mono uppercase tracking-wider">
                Transaksi Berhasil Diverifikasi
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-text">
                Selamat Datang di SmartFeed Studio! 🎉
              </h1>
              <p className="text-xs sm:text-sm text-text-mut max-w-sm mx-auto">
                {returnName ? `Hai ${returnName}, ` : ''}Akses seumur hidup (lifetime) ke 20 Engine Kreatif AI Anda telah aktif permanen.
              </p>
            </div>

            {/* Login Credentials Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-bg-deep border border-border text-left space-y-3">
              <div className="text-xs font-bold text-text flex items-center gap-1.5 border-b border-border/60 pb-2">
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>Detail Akun Login Anda</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-dim">Email Terdaftar:</span>
                  <span className="font-bold text-accent mono">{returnEmail || 'Email Anda'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-dim">Password Login:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-bg-panel px-2 py-0.5 rounded text-emerald-400 font-bold border border-border">
                      SmartFeedOKE
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="p-1 rounded hover:bg-bg-elev text-text-mut hover:text-text cursor-pointer"
                      title="Salin password"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                {returnRef && (
                  <div className="flex justify-between items-center text-[11px] text-text-dim pt-1 border-t border-border/40">
                    <span>ID Transaksi:</span>
                    <span className="mono">{returnRef}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Login CTA Button */}
            <a
              href="/app"
              className="w-full btn-cta text-sm sm:text-base !py-4 justify-center shadow-[0_10px_30px_rgba(var(--accent-rgb),0.4)] cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              <span>Buka Studio SmartFeed Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-[11px] text-text-dim leading-relaxed">
              Detail akun &amp; instruksi juga telah dikirimkan ke email <strong>{returnEmail || 'Anda'}</strong>. Jika butuh bantuan, hubungi WhatsApp <strong>0896-9524-9089</strong>.
            </p>
          </div>
        </main>

        <footer className="border-t border-border/60 py-4 text-center text-xs text-text-dim">
          © {new Date().getFullYear()} {CONFIG.companyName}. Hak cipta dilindungi.
        </footer>
      </div>
    );
  }

  // STANDARD CHECKOUT FORM
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between selection:bg-accent/20">
      
      {/* Header Elegan & Proporsional */}
      <header className="border-b border-border/80 bg-bg-panel/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shadow-sm shrink-0">
              <SafeImage
                src={CONFIG.logoUrl}
                alt={CONFIG.brandName}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg font-black text-text tracking-tight">
                {brandParts().lead && <>{brandParts().lead} </>}
                <span className="text-accent">{brandParts().accent}</span>
              </span>
              <span className="text-[10px] sm:text-[11px] mono text-text-dim uppercase tracking-wider font-semibold">
                Checkout Pembayaran Resmi
              </span>
            </div>
          </a>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-mut hover:text-accent transition px-3.5 py-2 rounded-xl border border-border/80 hover:bg-bg-elev shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </a>
        </div>
      </header>

      {/* Main Content Area (Focused Mobile-First Container) */}
      <main className="flex-1 py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-lg mx-auto w-full space-y-4 sm:space-y-5">
          
          {/* Header Title */}
          <div className="text-center space-y-1.5 py-1">
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Selesaikan Pembayaran
            </h1>
            <p className="text-xs sm:text-sm text-text-mut max-w-sm mx-auto">
              Akses seumur hidup ke <strong>SmartFeed AI Studio (20 Engine)</strong>.
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Card 1: Data Pembeli */}
            <div className="surface p-4 sm:p-5 rounded-2xl border border-border space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  1. Informasi Pembeli
                </span>
                <span className="text-[10px] mono text-text-dim">Wajib Diisi</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Ryan Hidayat"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs sm:text-sm text-text focus:border-accent focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Alamat Email (Untuk Login Studio) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Contoh: ryan@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs sm:text-sm text-text focus:border-accent focus:outline-none transition"
                  />
                  <span className="text-[10px] text-text-dim mt-1 block">
                    Email ini otomatis didaftarkan sebagai akun login Anda.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs sm:text-sm text-text focus:border-accent focus:outline-none transition"
                  />
                  <span className="text-[10px] text-text-dim mt-1 block">
                    Untuk notifikasi invoice dan bantuan support.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Pilihan Metode Pembayaran */}
            <div className="surface p-4 sm:p-5 rounded-2xl border border-border space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  2. Pilih Metode Pembayaran
                </span>
                <span className="text-[10px] mono text-emerald-400 font-bold">Otomatis Terverifikasi</span>
              </div>

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-text-mut flex items-center gap-1.5 pt-1">
                      <cat.icon className="w-3.5 h-3.5 text-accent" />
                      <span>{cat.category}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {cat.items.map((method) => {
                        const isSelected = formData.paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handleSelectMethod(method.id)}
                            className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                              isSelected
                                ? 'bg-accent/10 border-accent shadow-xs ring-1 ring-accent/30'
                                : 'bg-bg-deep border-border/80 hover:bg-bg-elev hover:border-border'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Logo Container Rata & Proporsional */}
                              <div className="h-10 w-[96px] sm:w-[104px] rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 border border-neutral-200/80 shadow-2xs">
                                <img
                                  src={method.logo}
                                  alt={method.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-text truncate flex items-center gap-1.5">
                                  <span>{method.name}</span>
                                  {method.popular && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold mono">
                                      Tercepat
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-text-dim truncate">
                                  {method.desc}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 pl-1">
                              <span
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-accent border-accent text-white'
                                    : 'border-border bg-bg-panel'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Ringkasan & Total Biaya */}
            <div className="surface p-4 sm:p-5 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  3. Ringkasan Pesanan
                </span>
                <span className="text-[10px] mono text-accent font-bold">Lifetime Deal</span>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-text">
                  <span>SmartFeed AI Studio (20 Engine)</span>
                  <span className="mono font-semibold whitespace-nowrap">Rp {priceStrikeNum}</span>
                </div>
                {discountInt > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Diskon Promo Akses</span>
                    <span className="mono whitespace-nowrap">- Rp {discountFormatted}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-mut text-[11px] sm:text-xs">
                  <span>Biaya Transaksi Payment Gateway</span>
                  <span className="text-emerald-400 font-semibold whitespace-nowrap">Gratis (Rp 0)</span>
                </div>
              </div>

              {/* Total Nominal Bersih Tanpa Terpotong */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-text">Total Pembayaran</div>
                  <div className="text-[10px] text-text-dim">Akses seumur hidup tanpa langganan</div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-accent mono whitespace-nowrap shrink-0">
                  Rp {priceNum}
                </div>
              </div>

              {/* Tombol Bayar Sekarang */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm sm:text-base !py-3.5 sm:!py-4 justify-center shadow-[0_8px_25px_rgba(var(--accent-rgb),0.35)] mt-1 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menghubungkan ke TriPay...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span className="whitespace-nowrap">Bayar Sekarang — Rp {priceNum}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-text-dim mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Jalur Enkripsi 256-Bit Aman via TriPay Resmi</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

          </form>

        </div>
      </main>

      {/* Footer Ringkas */}
      <footer className="border-t border-border/60 py-4 text-center text-xs text-text-dim">
        © {new Date().getFullYear()} {CONFIG.companyName}. Hak cipta dilindungi.
      </footer>

    </div>
  );
}
