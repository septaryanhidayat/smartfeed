import { useState } from 'react';
import {
  ShieldCheck, Lock, CheckCircle2, CreditCard, QrCode, Building2,
  Sparkles, ArrowRight, ArrowLeft, Store, HelpCircle, Mail, Phone, MapPin, Zap
} from 'lucide-react';
import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'qris',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const priceNum = CONFIG.price || '249.000';
  const priceStrikeNum = CONFIG.priceStrike || '499.000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Silakan lengkapi nama, email, dan nomor WhatsApp Anda.');
      return;
    }

    setIsLoading(true);
    const newOrderId = `INV-SF-${Date.now().toString().slice(-6)}`;
    
    setTimeout(() => {
      setOrderId(newOrderId);
      setIsLoading(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <LegalLayout
      title="Checkout & Pembayaran Resmi"
      subtitle="Selesaikan pemesanan Anda untuk mendapatkan akses seumur hidup ke SmartFeed Studio."
    >
      <div className="max-w-5xl mx-auto">
        {isSubmitted ? (
          /* Order Confirmation / Success View */
          <div className="surface p-6 sm:p-10 rounded-2xl border border-border shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] mono uppercase tracking-widest px-3 py-1 rounded-full bg-accent/20 text-accent font-bold">
                Pesanan Berhasil Dibuat
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mt-3">
                Terima Kasih, {formData.name}!
              </h2>
              <p className="text-sm text-text-mut mt-2">
                Nomor Invoice: <span className="mono font-bold text-accent">{orderId}</span>
              </p>
            </div>

            <div className="surface bg-bg-deep p-5 rounded-xl border border-border text-left space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-text-mut">Produk</span>
                <span className="font-bold text-text">SmartFeed AI Studio (Lifetime Access)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-text-mut">Email Penerima Akses</span>
                <span className="font-semibold text-text">{formData.email}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-text-mut">Nomor WhatsApp</span>
                <span className="font-semibold text-text">{formData.phone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border">
                <span className="text-text-mut">Metode Pembayaran</span>
                <span className="font-bold uppercase text-accent">{formData.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-text">Total Pembayaran</span>
                <span className="text-accent">Rp {priceNum}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-accent-sm border border-accent/30 text-xs text-left text-text-mut space-y-1.5">
              <div className="font-bold text-text flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent" />
                Instruksi Aktivasi Instan:
              </div>
              <p>
                1. Rincian tagihan dan tautan pembayaran telah dikirimkan ke email <strong className="text-text">{formData.email}</strong>.
              </p>
              <p>
                2. Setelah pembayaran diverifikasi otomatis oleh Payment Gateway (TriPay), akun studio Anda akan langsung aktif tanpa perlu konfirmasi manual.
              </p>
              <p>
                3. Butuh bantuan cepat? Hubungi tim support kami via WhatsApp di <strong className="text-text">{CONFIG.contactPhoneDisplay}</strong> atau email <strong className="text-text">{CONFIG.contactEmail}</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-bg-panel hover:bg-bg-elev border border-border text-text transition text-center"
              >
                Kembali ke Beranda
              </a>
              <a
                href={`https://wa.me/6289695249089?text=Halo%20Admin%20SmartFeed%2C%20saya%20sudah%20melakukan%20checkout%20dengan%20nomor%20invoice%20${orderId}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto btn-cta text-xs !py-3 !px-6 text-center"
              >
                Konfirmasi via WhatsApp
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
                  Informasi login dan akses studio akan dikirimkan ke email yang Anda daftarkan di bawah ini.
                </p>
              </div>

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
                    Pastikan email valid untuk menerima link login studio.
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
                  Pilih Metode Pembayaran
                </h3>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'qris'
                        ? 'border-accent bg-accent-sm'
                        : 'border-border bg-bg-deep hover:bg-bg-elev'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="qris"
                        checked={formData.paymentMethod === 'qris'}
                        onChange={handleChange}
                        className="text-accent focus:ring-accent"
                      />
                      <div>
                        <div className="text-xs font-bold text-text flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-accent" />
                          <span>QRIS (Instant Settlement)</span>
                          <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">Otomatis</span>
                        </div>
                        <div className="text-[10px] text-text-mut mt-0.5">
                          BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'va'
                        ? 'border-accent bg-accent-sm'
                        : 'border-border bg-bg-deep hover:bg-bg-elev'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="va"
                        checked={formData.paymentMethod === 'va'}
                        onChange={handleChange}
                        className="text-accent focus:ring-accent"
                      />
                      <div>
                        <div className="text-xs font-bold text-text flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-accent" />
                          <span>Virtual Account Bank (VA)</span>
                        </div>
                        <div className="text-[10px] text-text-mut mt-0.5">
                          BCA VA, Mandiri VA, BNI VA, BRI VA, Permata VA, CIMB Niaga, BSI
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'retail'
                        ? 'border-accent bg-accent-sm'
                        : 'border-border bg-bg-deep hover:bg-bg-elev'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="retail"
                        checked={formData.paymentMethod === 'retail'}
                        onChange={handleChange}
                        className="text-accent focus:ring-accent"
                      />
                      <div>
                        <div className="text-xs font-bold text-text flex items-center gap-2">
                          <Store className="w-4 h-4 text-accent" />
                          <span>Gerai Retail Minimarket</span>
                        </div>
                        <div className="text-[10px] text-text-mut mt-0.5">
                          Indomaret / Alfamart / Alfamidi se-Indonesia
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-cta text-sm !py-3.5 justify-center shadow-[0_10px_35px_rgba(var(--accent-rgb),0.35)]"
              >
                {isLoading ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Lanjutkan Pembayaran — Rp {priceNum}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] mono text-text-dim text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transaksi Terenkripsi SSL 256-bit & Berlisensi Bank Indonesia via TriPay</span>
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
                    <span>SmartFeed AI Studio (Akses Penuh 20 Engine)</span>
                    <span>Rp {priceStrikeNum}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Diskon Promo Early Access</span>
                    <span>- Rp 250.000</span>
                  </div>
                  <div className="flex justify-between text-text-mut text-[11px]">
                    <span>Biaya Layanan & PPN</span>
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
                  <div className="text-[11px] font-bold text-text">Apa saja yang Anda dapatkan:</div>
                  <ul className="space-y-1.5 text-xs text-text-mut">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Akses penuh 20 engine kreatif AI seumur hidup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Modul baru Slide & PPT Deck Generator (M20)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Suite Jurnalisme & Redaksi Media (5W+1H, Breaking News, Cek Fakta)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Suite Affiliate Video, Virtual Try-On, Review & Storyboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Update fitur dan engine baru gratis selamanya</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Merchant Credentials & Support Box */}
              <div className="surface bg-bg-panel/60 p-5 rounded-xl border border-border text-xs space-y-3">
                <div className="font-bold text-text flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-accent" />
                  Identitas Merchant Resmi:
                </div>
                <div className="text-text-mut space-y-1.5 text-[11px]">
                  <div><strong className="text-text">{CONFIG.companyName}</strong></div>
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
