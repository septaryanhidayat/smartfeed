import { useState } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, ArrowLeft,
  RefreshCw, AlertCircle, Sparkles, Building2, Wallet, QrCode, Check
} from 'lucide-react';
import { CONFIG, brandParts } from '../config.js';
import SafeImage from '../landing/primitives/SafeImage.jsx';

// Active payment channels strictly matching user's TriPay dashboard & File 1
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
    category: 'E-Wallet Langsung',
    icon: Wallet,
    items: [
      {
        id: 'SHOPEEPAY',
        name: 'ShopeePay',
        desc: 'Bayar langsung via aplikasi Shopee',
        logo: '/payment-icons/shopeepay.png',
      },
      {
        id: 'DANA',
        name: 'DANA',
        desc: 'Bayar via saldo akun DANA',
        logo: '/payment-icons/dana.png',
      },
      {
        id: 'OVO',
        name: 'OVO',
        desc: 'Push notifikasi pembayaran ke OVO',
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

  const priceNum = CONFIG.price || '249.000';
  const priceStrikeNum = CONFIG.priceStrike || '499.000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMethod = (id) => {
    setFormData((prev) => ({ ...prev, paymentMethod: id }));
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

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between selection:bg-accent/20">
      
      {/* Header Bersih & Ringkas */}
      <header className="border-b border-border/80 bg-bg-panel/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-15 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-sm">
              <SafeImage
                src={CONFIG.logoUrl}
                alt={CONFIG.brandName}
                className="w-6 h-6 object-contain"
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-text">
                {brandParts().lead && <>{brandParts().lead} </>}
                <span className="text-accent">{brandParts().accent}</span>
              </span>
              <span className="text-[9px] mono text-text-dim uppercase tracking-wider">
                Checkout Pembayaran
              </span>
            </div>
          </a>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-mut hover:text-accent transition px-3 py-1.5 rounded-lg border border-border/60 hover:bg-bg-elev"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </a>
        </div>
      </header>

      {/* Main Content Area (Focused Mobile-First Container) */}
      <main className="flex-1 py-5 px-3 sm:px-4">
        <div className="max-w-lg mx-auto w-full space-y-4">
          
          {/* Header Title */}
          <div className="text-center space-y-1 py-1">
            <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              Selesaikan Pembayaran
            </h1>
            <p className="text-xs text-text-mut">
              Akses seumur hidup ke <strong>SmartFeed AI Studio (20 Engine)</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Box 1: Data Penerima Akses */}
            <div className="bg-bg-panel border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-text">
                  Data Penerima Akses
                </h2>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text placeholder:text-text-dim focus:border-accent focus:bg-bg-panel focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Alamat Email Aktif <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text placeholder:text-text-dim focus:border-accent focus:bg-bg-panel focus:outline-none transition"
                  />
                  <span className="text-[10px] text-text-dim mt-1 block">
                    Link aktivasi & akun login studio otomatis dikirim ke email ini.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nomor WhatsApp / HP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text placeholder:text-text-dim focus:border-accent focus:bg-bg-panel focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Metode Pembayaran (Clean Radio List dengan Logo Setara & Rapi) */}
            <div className="bg-bg-panel border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-text">
                  Pilih Metode Pembayaran
                </h2>
              </div>

              {PAYMENT_OPTIONS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-bold text-text-mut uppercase tracking-wider flex items-center gap-1.5">
                    <group.icon className="w-3.5 h-3.5 text-accent" />
                    <span>{group.category}</span>
                  </div>

                  <div className="space-y-1.5">
                    {group.items.map((item) => {
                      const isSelected = formData.paymentMethod === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectMethod(item.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-accent bg-accent-sm/80 shadow-xs ring-1 ring-accent'
                              : 'border-border/70 bg-bg-deep/60 hover:bg-bg-elev'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-accent bg-accent text-white' : 'border-border bg-bg-panel'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-bold text-text flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.popular && (
                                  <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                    Otomatis
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-text-mut truncate mt-0.5">{item.desc}</div>
                            </div>
                          </div>

                          {/* Logo Channel Standar & Setara (Ukuran Sama Rata) */}
                          <div className="shrink-0 pl-1.5 flex items-center justify-end">
                            <div className="h-9 w-[86px] sm:w-[96px] px-2 py-1 rounded-lg bg-white border border-neutral-200 shadow-2xs flex items-center justify-center overflow-hidden">
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="max-h-6 max-w-full w-auto object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Box 3: Ringkasan Tagihan & Tombol Bayar */}
            <div className="bg-bg-panel border border-border rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="text-xs font-bold text-text">Ringkasan Tagihan</span>
                <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                  SEKALI BAYAR
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-text">
                  <span>SmartFeed AI Studio (20 Engine)</span>
                  <span className="mono font-semibold whitespace-nowrap">Rp {priceStrikeNum}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Diskon Promo Early Access</span>
                  <span className="mono whitespace-nowrap">- Rp 250.000</span>
                </div>
                <div className="flex justify-between text-text-mut text-[11px]">
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
                <div className="text-xl sm:text-2xl font-black text-accent mono whitespace-nowrap shrink-0">
                  Rp {priceNum}
                </div>
              </div>

              {/* Tombol Bayar Sekarang */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm !py-3.5 justify-center shadow-[0_8px_25px_rgba(var(--accent-rgb),0.35)] mt-1 cursor-pointer"
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
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-dim mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Transaksi Resmi Berizin Bank Indonesia via TriPay</span>
                </div>
              </div>
            </div>

          </form>

        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="border-t border-border/80 bg-bg-deep/60 py-6 text-center text-xs text-text-dim space-y-2 px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-text-mut">
          <a href="/tentang-kami" className="hover:text-accent transition">Tentang Kami</a>
          <span>·</span>
          <a href="/kebijakan-privasi" className="hover:text-accent transition">Kebijakan Privasi</a>
          <span>·</span>
          <a href="/syarat-ketentuan" className="hover:text-accent transition">Syarat & Ketentuan</a>
          <span>·</span>
          <a href="/kontak" className="hover:text-accent transition">Hubungi Kami</a>
        </div>
        <p className="text-[10px]">
          © {new Date().getFullYear()} {CONFIG.brandName} by {CONFIG.companyName}. Bantuan CS WA: <strong className="text-text">{CONFIG.contactPhoneDisplay}</strong>
        </p>
      </footer>

    </div>
  );
}
