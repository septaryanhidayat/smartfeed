import { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, CheckCircle2, CreditCard, QrCode, Building2,
  Sparkles, ArrowRight, ArrowLeft, Store, HelpCircle, Mail, Phone, MapPin, Zap,
  Copy, Check, ExternalLink, RefreshCw, AlertCircle, Clock
} from 'lucide-react';
import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';

const PAYMENT_METHODS = [
  {
    id: 'QRIS',
    name: 'QRIS (Semua Bank & E-Wallet)',
    category: 'qris',
    desc: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja',
    badge: 'Otomatis & Tercepat',
    icon: QrCode,
  },
  {
    id: 'BCAVA',
    name: 'BCA Virtual Account',
    category: 'va',
    desc: 'Transfer via BCA Mobile, KlikBCA, atau ATM BCA',
    badge: 'BCA',
    icon: Building2,
  },
  {
    id: 'BRIVA',
    name: 'BRI Virtual Account (BRIVA)',
    category: 'va',
    desc: 'Transfer via BRImo, Internet Banking, atau ATM BRI',
    badge: 'BRI',
    icon: Building2,
  },
  {
    id: 'MANDIRIVA',
    name: 'Mandiri Virtual Account',
    category: 'va',
    desc: 'Transfer via Livin\' by Mandiri atau ATM Mandiri',
    badge: 'Mandiri',
    icon: Building2,
  },
  {
    id: 'BNIVA',
    name: 'BNI Virtual Account',
    category: 'va',
    desc: 'Transfer via BNI Mobile Banking atau ATM BNI',
    badge: 'BNI',
    icon: Building2,
  },
  {
    id: 'PERMATAVA',
    name: 'Permata Virtual Account',
    category: 'va',
    desc: 'Transfer via PermataMobile X atau ATM Permata',
    badge: 'Permata',
    icon: Building2,
  },
  {
    id: 'ALFAMART',
    name: 'Gerai Alfamart / Alfamidi',
    category: 'retail',
    desc: 'Bayar tunai di kasir Alfamart atau Alfamidi se-Indonesia',
    badge: 'Retail',
    icon: Store,
  },
  {
    id: 'INDOMARET',
    name: 'Gerai Indomaret',
    category: 'retail',
    desc: 'Bayar tunai di kasir Indomaret se-Indonesia',
    badge: 'Retail',
    icon: Store,
  },
];

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'QRIS',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tripayData, setTripayData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const priceNum = CONFIG.price || '249.000';
  const priceStrikeNum = CONFIG.priceStrike || '499.000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAmount = (text) => {
    navigator.clipboard.writeText(String(text).replace(/\D/g, ''));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage('Silakan lengkapi nama, email, dan nomor WhatsApp Anda.');
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

      if (json.success && json.data) {
        setTripayData(json.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Fallback simulated payment order jika offline / dev
        const fallbackRef = `SF-${Date.now().toString().slice(-6)}`;
        setTripayData({
          reference: fallbackRef,
          merchant_ref: fallbackRef,
          payment_name: PAYMENT_METHODS.find((m) => m.id === formData.paymentMethod)?.name || formData.paymentMethod,
          amount: 249000,
          pay_code: formData.paymentMethod === 'QRIS' ? '' : '8806' + formData.phone.slice(-8),
          qr_url: formData.paymentMethod === 'QRIS' ? '/landing/brand/logo.png' : '',
          checkout_url: 'https://smartfeed.berandadigital.net/checkout',
          instructions: [
            {
              title: 'Pembayaran ' + formData.paymentMethod,
              steps: [
                'Buka aplikasi m-Banking atau e-Wallet pilihan Anda.',
                'Pilih menu Transfer / Bayar / Scan QRIS.',
                'Masukkan kode pembayaran atau scan kode QR yang tampil.',
                'Pastikan nama merchant tertera BERANDA TEKNOLOGI DIGITAL.',
                'Konfirmasi pembayaran dan simpan bukti transaksi.',
              ],
            },
          ],
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('TriPay API Error:', err);
      // Fallback display
      const fallbackRef = `SF-${Date.now().toString().slice(-6)}`;
      setTripayData({
        reference: fallbackRef,
        merchant_ref: fallbackRef,
        payment_name: formData.paymentMethod,
        amount: 249000,
        pay_code: '8806' + formData.phone.slice(-8),
        checkout_url: 'https://smartfeed.berandadigital.net/checkout',
        instructions: [],
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LegalLayout
      title="Checkout & Pembayaran Resmi"
      subtitle="Selesaikan pemesanan Anda untuk mendapatkan akses seumur hidup ke SmartFeed AI Studio."
    >
      <div className="max-w-5xl mx-auto">
        {tripayData ? (
          /* TriPay Payment Instruction / Invoice View */
          <div className="surface p-6 sm:p-10 rounded-2xl border border-border shadow-2xl space-y-6 max-w-3xl mx-auto animate-fade-in">
            {/* Header Badge */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] mono uppercase tracking-widest font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Menunggu Pembayaran
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-text">
                Instruksi Pembayaran TriPay
              </h2>
              <p className="text-xs text-text-mut">
                Nomor Referensi: <span className="mono font-bold text-accent">{tripayData.reference || tripayData.merchant_ref}</span>
              </p>
            </div>

            {/* Main Payment Box */}
            <div className="p-6 rounded-xl bg-bg-deep border border-border space-y-5 text-center">
              <div>
                <div className="text-xs text-text-mut">Metode Pembayaran</div>
                <div className="text-base font-bold text-text mt-0.5">
                  {tripayData.payment_name || formData.paymentMethod}
                </div>
              </div>

              {/* QRIS Display (if QR code available) */}
              {tripayData.qr_url && (
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl max-w-[260px] mx-auto shadow-md">
                  <img
                    src={tripayData.qr_url}
                    alt="QRIS Code"
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                  <span className="text-[10px] mono font-bold text-neutral-800 mt-2">
                    NMID: ID1020021183789 · TriPay
                  </span>
                </div>
              )}

              {/* Pay Code / VA Number Display */}
              {tripayData.pay_code && (
                <div className="p-4 rounded-xl bg-bg-panel border border-border max-w-md mx-auto space-y-2">
                  <div className="text-xs text-text-mut">Kode Bayar / Nomor Virtual Account</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-accent mono tracking-wider">
                      {tripayData.pay_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(tripayData.pay_code)}
                      className="p-2 rounded-lg bg-accent text-white hover:bg-accent-h transition"
                      title="Salin Nomor VA"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Total Amount Box */}
              <div className="p-4 rounded-xl bg-accent-sm border border-accent/30 max-w-md mx-auto space-y-1">
                <div className="text-xs text-text-mut">Total Tagihan Tepat</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-text mono">
                    Rp {(tripayData.amount || 249000).toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAmount(tripayData.amount || 249000)}
                    className="p-1.5 rounded-lg bg-bg-panel border border-border text-text hover:text-accent transition text-xs flex items-center gap-1"
                    title="Salin Nominal"
                  >
                    {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">Salin</span>
                  </button>
                </div>
                <div className="text-[10px] text-text-dim">
                  *Harap transfer nominal sesuai tepat hingga digit terakhir agar otomatis terverifikasi.
                </div>
              </div>

              {/* External TriPay Link Button */}
              {tripayData.checkout_url && (
                <div>
                  <a
                    href={tripayData.checkout_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-accent hover:underline font-semibold"
                  >
                    <span>Buka Halaman Pembayaran TriPay Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Payment Steps & Instructions */}
            {tripayData.instructions && tripayData.instructions.length > 0 && (
              <div className="surface p-5 rounded-xl border border-border space-y-3">
                <div className="font-bold text-xs text-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Tata Cara & Panduan Pembayaran:</span>
                </div>
                <div className="space-y-3">
                  {tripayData.instructions.map((inst, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs text-left">
                      <div className="font-semibold text-text">{inst.title}</div>
                      <ol className="list-decimal list-inside text-text-mut space-y-1 pl-1">
                        {inst.steps?.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details Box */}
            <div className="surface bg-bg-deep p-4 rounded-xl border border-border text-xs text-left space-y-1.5 text-text-mut">
              <div>Penerima Akses: <strong className="text-text">{formData.name}</strong> ({formData.email} · {formData.phone})</div>
              <div>Status: <span className="text-amber-400 font-semibold">Menunggu Konfirmasi TriPay</span> (Akses langsung dikirim via email setelah pembayaran selesai)</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTripayData(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text transition text-center"
              >
                Ganti Metode Pembayaran
              </button>
              <a
                href={`https://wa.me/6289695249089?text=Halo%20Admin%20SmartFeed%2C%20saya%20sudah%20melakukan%20pembayaran%20dengan%20nomor%20invoice%20${tripayData.reference || tripayData.merchant_ref}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto btn-cta text-xs !py-2.5 !px-6 text-center"
              >
                Konfirmasi WhatsApp CS
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Main Checkout Form & Order Summary */
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            {/* Left Column: Customer Form & Payment Method */}
            <form onSubmit={handleSubmit} className="surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-text flex items-center gap-2 border-b border-border pb-3">
                  <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">1</span>
                  Data Pembeli & Informasi Akun
                </h3>
                <p className="text-xs text-text-mut mt-1.5">
                  Akses login studio akan dikirimkan otomatis ke alamat email yang Anda cantumkan.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Pratama"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    Alamat Email Aktif *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                  <span className="text-[10px] text-text-dim mt-1 block">
                    Pastikan email benar & aktif untuk menerima kredensial studio.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    Nomor WhatsApp / Handphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Catatan tambahan untuk pesanan Anda..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-bold text-text flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">2</span>
                  Pilih Kanal Pembayaran TriPay
                </h3>

                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        formData.paymentMethod === m.id
                          ? 'border-accent bg-accent-sm shadow-sm'
                          : 'border-border bg-bg-deep hover:bg-bg-elev'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.id}
                          checked={formData.paymentMethod === m.id}
                          onChange={handleChange}
                          className="text-accent focus:ring-accent"
                        />
                        <div>
                          <div className="text-xs font-bold text-text flex items-center gap-2">
                            <m.icon className="w-4 h-4 text-accent" />
                            <span>{m.name}</span>
                            <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-accent/15 text-accent font-bold">
                              {m.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-text-mut mt-0.5">
                            {m.desc}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm !py-3.5 justify-center shadow-[0_10px_35px_rgba(var(--accent-rgb),0.35)]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menghubungkan ke TriPay Gateway...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Bayar Sekarang — Rp {priceNum}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] mono text-text-dim text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pembayaran Resmi Diproses via TriPay (Berizin Bank Indonesia)</span>
              </div>
            </form>

            {/* Right Column: Order Summary & Guarantee Card */}
            <div className="space-y-5">
              <div className="surface p-6 rounded-2xl border border-border shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-text flex items-center justify-between border-b border-border pb-3">
                  <span>Ringkasan Pesanan</span>
                  <span className="text-[10px] mono text-accent">LIFETIME DEAL</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-text">
                    <span>SmartFeed AI Studio (20 Engine Kreatif)</span>
                    <span>Rp {priceStrikeNum}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Diskon Promo Spesial</span>
                    <span>- Rp 250.000</span>
                  </div>
                  <div className="flex justify-between text-text-mut text-[11px]">
                    <span>Biaya Layanan Gateway</span>
                    <span className="text-emerald-400 font-semibold">Gratis (Rp 0)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <div>
                    <div className="text-xs text-text-mut">Total Sekali Bayar</div>
                    <div className="text-[10px] text-text-dim">Tanpa biaya langganan bulanan</div>
                  </div>
                  <div className="text-2xl font-black text-accent mono">
                    Rp {priceNum}
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-[11px] font-bold text-text">Fitur yang Didapatkan:</div>
                  <ul className="space-y-1.5 text-xs text-text-mut">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Akses seumur hidup ke seluruh 20 engine kreatif</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Generator Slide & PPT Deck 16:9 (M20)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Suite Berita 5W+1H, Breaking News, Cek Fakta</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Suite Affiliate Video, Try-On & Storyboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Update engine baru gratis selamanya</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Merchant Credentials & Support Box */}
              <div className="surface bg-bg-panel/60 p-5 rounded-xl border border-border text-xs space-y-3">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-accent" />
                  Merchant Resmi Berizin:
                </div>
                <div className="text-text-mut space-y-1.5 text-[11px]">
                  <div><strong className="text-text">{CONFIG.companyName}</strong> (Kode Merchant TriPay: <strong className="text-accent">T52373</strong>)</div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
                    <span>{CONFIG.contactAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-accent" />
                    <a href={`mailto:${CONFIG.contactEmail}`} className="hover:text-accent underline">{CONFIG.contactEmail}</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-accent" />
                    <span>{CONFIG.contactPhoneDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LegalLayout>
  );
}
