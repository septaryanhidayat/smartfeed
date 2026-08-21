import { useState } from 'react';
import {
  ShieldCheck, Lock, CheckCircle2, ArrowRight,
  RefreshCw, AlertCircle, Sparkles, Building2, Wallet, QrCode, Check
} from 'lucide-react';
import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';

// Payment channels mapping directly to /payment-icons/*.svg
const PAYMENT_OPTIONS = [
  {
    group: 'QRIS (Semua Bank & E-Wallet)',
    icon: QrCode,
    items: [
      {
        id: 'QRIS',
        name: 'QRIS (Instant Settlement)',
        desc: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja',
        logo: '/payment-icons/qris.svg',
        popular: true,
      },
    ],
  },
  {
    group: 'E-Wallet',
    icon: Wallet,
    items: [
      {
        id: 'SHOPEEPAY',
        name: 'ShopeePay',
        desc: 'Bayar via aplikasi Shopee',
        logo: '/payment-icons/shopeepay.svg',
      },
      {
        id: 'OVO',
        name: 'OVO',
        desc: 'Push notifikasi ke aplikasi OVO',
        logo: '/payment-icons/ovo.svg',
      },
      {
        id: 'DANA',
        name: 'DANA',
        desc: 'Bayar via saldo DANA',
        logo: '/payment-icons/dana.svg',
      },
    ],
  },
  {
    group: 'Virtual Account Bank',
    icon: Building2,
    items: [
      {
        id: 'BCAVA',
        name: 'BCA Virtual Account',
        desc: 'BCA Mobile, myBCA, KlikBCA, ATM BCA',
        logo: '/payment-icons/bca.svg',
      },
      {
        id: 'BRIVA',
        name: 'BRI Virtual Account',
        desc: 'BRImo, Internet Banking, ATM BRI',
        logo: '/payment-icons/bri.svg',
      },
      {
        id: 'MANDIRIVA',
        name: 'Mandiri Virtual Account',
        desc: 'Livin\' by Mandiri, ATM Mandiri',
        logo: '/payment-icons/mandiri.svg',
      },
      {
        id: 'BNIVA',
        name: 'BNI Virtual Account',
        desc: 'BNI Mobile Banking, ATM BNI',
        logo: '/payment-icons/bni.svg',
      },
      {
        id: 'BSIVA',
        name: 'BSI Virtual Account',
        desc: 'BSI Mobile, ATM BSI',
        logo: '/payment-icons/bsi.svg',
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
      setErrorMessage('Mohon lengkapi Nama, Email, dan Nomor WhatsApp Anda.');
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
        // Langsung redirect ke halaman resmi pembayaran TriPay!
        window.location.href = json.data.checkout_url;
      } else {
        setErrorMessage(json.message || 'Gagal membuat tagihan TriPay. Silakan periksa kembali data Anda.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('TriPay API Error:', err);
      setErrorMessage('Kendala koneksi ke gateway TriPay. Silakan coba kembali.');
      setIsLoading(false);
    }
  };

  return (
    <LegalLayout
      title="Checkout Pembayaran"
      subtitle="Dapatkan akses seumur hidup ke SmartFeed AI Studio (20 Engine Kreatif)."
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 items-start">
          
          {/* KOLOM KIRI: Data Pembeli & Pilihan Channel */}
          <div className="space-y-6">
            
            {/* 1. Data Diri */}
            <div className="bg-bg-panel border border-border/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <h3 className="text-sm font-bold text-text">Data Penerima Akses</h3>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3.5">
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
                    placeholder="Contoh: Budi Pratama"
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
                    Link aktivasi & akun studio otomatis dikirim ke email ini.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nomor WhatsApp / Handphone <span className="text-red-400">*</span>
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

            {/* 2. Metode Pembayaran */}
            <div className="bg-bg-panel border border-border/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <h3 className="text-sm font-bold text-text">Pilih Metode Pembayaran</h3>
              </div>

              {PAYMENT_OPTIONS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                  <div className="text-[11px] font-bold text-text-mut uppercase tracking-wider flex items-center gap-1.5 pt-1">
                    <group.icon className="w-3.5 h-3.5 text-accent" />
                    <span>{group.group}</span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isSelected = formData.paymentMethod === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectMethod(item.id)}
                          className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-accent bg-accent-sm shadow-sm ring-1 ring-accent'
                              : 'border-border/70 bg-bg-deep hover:bg-bg-elev hover:border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-accent bg-accent text-white' : 'border-border bg-bg-panel'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-bold text-text flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.popular && (
                                  <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                    Populer
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-text-mut truncate mt-0.5">{item.desc}</div>
                            </div>
                          </div>

                          {/* Official Logo Container */}
                          <div className="shrink-0 pl-2">
                            <div className="h-8 min-w-[56px] px-2 rounded-lg bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center">
                              <img
                                src={item.logo}
                                alt={item.name}
                                className="h-5 w-auto max-w-[64px] object-contain"
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

          </div>

          {/* KOLOM KANAN: Ringkasan Pesanan & Tombol Submit */}
          <div className="space-y-4 lg:sticky lg:top-24">
            
            <div className="bg-bg-panel border border-border/80 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-bold text-text">Ringkasan Pesanan</span>
                <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">LIFETIME</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-text font-semibold">
                  <span>SmartFeed AI Studio (20 Engine)</span>
                  <span className="mono">Rp {priceStrikeNum}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Diskon Promo Akses</span>
                  <span className="mono">- Rp 250.000</span>
                </div>
                <div className="flex justify-between text-text-mut text-[11px]">
                  <span>Biaya Transaksi</span>
                  <span className="text-emerald-400 font-semibold">Gratis (Rp 0)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex justify-between items-baseline">
                <div>
                  <div className="text-xs font-bold text-text">Total Bayar</div>
                  <div className="text-[10px] text-text-dim">Sekali bayar seumur hidup</div>
                </div>
                <div className="text-2xl font-black text-accent mono">
                  Rp {priceNum}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm !py-3.5 justify-center shadow-[0_8px_25px_rgba(var(--accent-rgb),0.35)] mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menghubungkan ke TriPay...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Lanjut ke Pembayaran TriPay</span>
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

            {/* Merchant Identity & Support */}
            <div className="bg-bg-deep border border-border/70 p-4 rounded-xl text-xs space-y-1.5 text-text-mut">
              <div className="font-bold text-text flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Aktivasi Otomatis & CS:
              </div>
              <p className="text-[11px] leading-relaxed">
                Akun studio langsung aktif setelah pembayaran diverifikasi oleh TriPay. Bantuan cepat WA: <strong className="text-text">{CONFIG.contactPhoneDisplay}</strong>.
              </p>
            </div>

          </div>

        </form>
      </div>
    </LegalLayout>
  );
}
