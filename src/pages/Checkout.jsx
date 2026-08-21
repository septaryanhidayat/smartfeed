import { useState } from 'react';
import {
  ShieldCheck, Lock, CheckCircle2, ArrowRight, ArrowLeft,
  Zap, RefreshCw, AlertCircle, Sparkles, Building2, Wallet, QrCode
} from 'lucide-react';
import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';

// Official SVG Brand Logos for high sharpness & zero dependencies
function ChannelLogo({ id, className = "h-5 w-auto" }) {
  switch (id) {
    case 'QRIS':
      return (
        <svg viewBox="0 0 120 45" className={className} fill="currentColor">
          <rect width="120" height="45" rx="6" fill="#EA1D2C" />
          <text x="60" y="30" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" textAnchor="middle" letterSpacing="1">QRIS</text>
        </svg>
      );
    case 'BCAVA':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#0060AF" />
          <text x="50" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" textAnchor="middle" fontStyle="italic">BCA</text>
        </svg>
      );
    case 'BNIVA':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#005E6A" />
          <text x="42" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" textAnchor="middle">BNI</text>
          <text x="75" y="27" fill="#F15A24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" textAnchor="middle">46</text>
        </svg>
      );
    case 'BRIVA':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#00529C" />
          <text x="50" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" textAnchor="middle">BRI</text>
        </svg>
      );
    case 'MANDIRIVA':
      return (
        <svg viewBox="0 0 110 40" className={className}>
          <rect width="110" height="40" rx="6" fill="#002D62" />
          <text x="48" y="26" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="17" textAnchor="middle">mandiri</text>
          <path d="M88 12 Q96 18 102 12 Q98 24 88 12" fill="#F8B133" />
        </svg>
      );
    case 'BSIVA':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#00A39D" />
          <text x="50" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" textAnchor="middle">BSI</text>
        </svg>
      );
    case 'OVO':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#4C2A86" />
          <text x="50" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" textAnchor="middle" letterSpacing="1">OVO</text>
        </svg>
      );
    case 'DANA':
      return (
        <svg viewBox="0 0 100 40" className={className}>
          <rect width="100" height="40" rx="6" fill="#118EEA" />
          <text x="50" y="27" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" textAnchor="middle" letterSpacing="1">DANA</text>
        </svg>
      );
    case 'SHOPEEPAY':
      return (
        <svg viewBox="0 0 120 40" className={className}>
          <rect width="120" height="40" rx="6" fill="#EE4D2D" />
          <text x="60" y="26" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="16" textAnchor="middle">ShopeePay</text>
        </svg>
      );
    default:
      return null;
  }
}

// Hanya channel yang AKTIF di TriPay merchant Beranda Teknologi Digital
const CHANNELS_QRIS = [
  { id: 'QRIS', name: 'QRIS (Semua Bank & E-Wallet)', desc: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay', tag: 'Populer' },
];

const CHANNELS_EWALLET = [
  { id: 'SHOPEEPAY', name: 'ShopeePay', desc: 'Bayar langsung via aplikasi Shopee / ShopeePay' },
  { id: 'OVO', name: 'OVO', desc: 'Notifikasi pembayaran push langsung ke aplikasi OVO' },
  { id: 'DANA', name: 'DANA', desc: 'Bayar cepat & aman lewat akun DANA' },
];

const CHANNELS_VA = [
  { id: 'BCAVA', name: 'BCA Virtual Account', desc: 'BCA Mobile, myBCA, KlikBCA, ATM BCA' },
  { id: 'BRIVA', name: 'BRI Virtual Account (BRIVA)', desc: 'BRImo, Internet Banking BRI, ATM BRI' },
  { id: 'MANDIRIVA', name: 'Mandiri Virtual Account', desc: 'Livin\' by Mandiri, ATM Mandiri' },
  { id: 'BNIVA', name: 'BNI Virtual Account', desc: 'BNI Mobile Banking, ATM BNI' },
  { id: 'BSIVA', name: 'BSI Virtual Account', desc: 'BSI Mobile, Net Banking BSI, ATM BSI' },
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

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage('Lengkapi nama, email, dan nomor WhatsApp Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/tripay-create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          method: formData.paymentMethod,
          plan: 'lifetime',
        }),
      });

      const json = await res.json();

      if (json.success && json.data && json.data.checkout_url) {
        // Langsung arahkan pembeli ke halaman resmi pembayaran TriPay!
        window.location.href = json.data.checkout_url;
      } else {
        setErrorMessage(json.message || 'Gagal membuat tagihan TriPay. Silakan coba lagi.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('TriPay API Error:', err);
      setErrorMessage('Kendala koneksi ke gateway pembayaran. Silakan coba sesaat lagi.');
      setIsLoading(false);
    }
  };

  return (
    <LegalLayout
      title="Checkout Sederhana & Aman"
      subtitle="Dapatkan akses seumur hidup ke SmartFeed AI Studio (20 Engine Kreatif)."
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.25fr_1fr] gap-6 sm:gap-8 items-start">
          
          {/* KOLOM KIRI: Data Diri & Pilihan Channel TriPay */}
          <div className="space-y-6">
            
            {/* Step 1: Data Pembeli */}
            <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-sm font-bold text-text">Informasi Penerima Akses</h3>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                  <span className="text-[10px] text-text-dim mt-1 block">
                    Link aktivasi & akun studio otomatis dikirim ke email ini.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Pilih Channel Pembayaran (Hanya yang Aktif) */}
            <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</span>
                <h3 className="text-sm font-bold text-text">Pilih Metode Pembayaran</h3>
              </div>

              {/* Sub-Group 1: QRIS */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-accent" />
                  QRIS (Scan & Bayar Instan)
                </div>
                {CHANNELS_QRIS.map((ch) => {
                  const isSelected = formData.paymentMethod === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleSelectMethod(ch.id)}
                      className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-accent bg-accent-sm shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)] ring-1 ring-accent'
                          : 'border-border bg-bg-deep hover:bg-bg-elev'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={ch.id}
                          checked={isSelected}
                          onChange={() => handleSelectMethod(ch.id)}
                          className="text-accent focus:ring-accent"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-text flex items-center gap-2">
                            <span>{ch.name}</span>
                            {ch.tag && (
                              <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                {ch.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-text-mut truncate mt-0.5">{ch.desc}</div>
                        </div>
                      </div>
                      <div className="shrink-0 pl-2">
                        <ChannelLogo id={ch.id} className="h-6 w-auto" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-Group 2: E-Wallet */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-accent" />
                  E-Wallet Langsung
                </div>
                <div className="grid sm:grid-cols-1 gap-2">
                  {CHANNELS_EWALLET.map((ch) => {
                    const isSelected = formData.paymentMethod === ch.id;
                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleSelectMethod(ch.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-accent bg-accent-sm shadow-sm ring-1 ring-accent'
                            : 'border-border bg-bg-deep hover:bg-bg-elev'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={ch.id}
                            checked={isSelected}
                            onChange={() => handleSelectMethod(ch.id)}
                            className="text-accent focus:ring-accent"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-text">{ch.name}</div>
                            <div className="text-[10px] text-text-mut truncate mt-0.5">{ch.desc}</div>
                          </div>
                        </div>
                        <div className="shrink-0 pl-2">
                          <ChannelLogo id={ch.id} className="h-5 w-auto" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Group 3: Virtual Account Bank */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-accent" />
                  Virtual Account Bank (Transfer Bebas Biaya)
                </div>
                <div className="space-y-2">
                  {CHANNELS_VA.map((ch) => {
                    const isSelected = formData.paymentMethod === ch.id;
                    return (
                      <div
                        key={ch.id}
                        onClick={() => handleSelectMethod(ch.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-accent bg-accent-sm shadow-sm ring-1 ring-accent'
                            : 'border-border bg-bg-deep hover:bg-bg-elev'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={ch.id}
                            checked={isSelected}
                            onChange={() => handleSelectMethod(ch.id)}
                            className="text-accent focus:ring-accent"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-text">{ch.name}</div>
                            <div className="text-[10px] text-text-mut truncate mt-0.5">{ch.desc}</div>
                          </div>
                        </div>
                        <div className="shrink-0 pl-2">
                          <ChannelLogo id={ch.id} className="h-5 w-auto" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* KOLOM KANAN: Ringkasan & Tombol Bayar Langsung */}
          <div className="space-y-5 lg:sticky lg:top-24">
            
            <div className="surface p-6 rounded-2xl border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-text">Ringkasan Pembelian</span>
                <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold">LIFETIME</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-text font-semibold">
                  <span>SmartFeed AI Studio (20 Engine)</span>
                  <span>Rp {priceStrikeNum}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Diskon Promo Akses</span>
                  <span>- Rp 250.000</span>
                </div>
                <div className="flex justify-between text-text-mut text-[11px]">
                  <span>Biaya Transaksi</span>
                  <span className="text-emerald-400 font-semibold">Gratis (Rp 0)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <div>
                  <div className="text-xs font-bold text-text">Total Bayar</div>
                  <div className="text-[10px] text-text-dim">Sekali bayar seumur hidup</div>
                </div>
                <div className="text-2xl font-black text-accent mono">
                  Rp {priceNum}
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm !py-3.5 justify-center shadow-[0_10px_30px_rgba(var(--accent-rgb),0.35)] mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menuju TriPay...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Bayar Sekarang — Rp {priceNum}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-dim mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Diproses Resmi via TriPay (Berizin Bank Indonesia)</span>
                </div>
              </div>
            </div>

            {/* Jaminan & Bantuan */}
            <div className="surface bg-bg-panel/40 p-4 rounded-xl border border-border text-xs space-y-2 text-text-mut">
              <div className="font-bold text-text flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Akses Instan & Bantuan Cepat:
              </div>
              <p className="text-[11px] leading-relaxed">
                Setelah pembayaran selesai di TriPay, akun studio langsung aktif otomatis. Butuh bantuan? WA ke <strong className="text-text">{CONFIG.contactPhoneDisplay}</strong>.
              </p>
            </div>

          </div>

        </form>
      </div>
    </LegalLayout>
  );
}
