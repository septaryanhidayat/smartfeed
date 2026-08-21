import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';
import { Mail, Phone, MapPin, Building2, Clock, MessageSquare, ExternalLink, Globe } from 'lucide-react';

export default function ContactUs() {
  const waNumber = CONFIG.contactPhone.replace(/^0/, '62');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Tim Beranda Teknologi Digital / SmartFeed, saya ingin bertanya seputar layanan SmartFeed Studio.')}`;

  return (
    <LegalLayout
      title="Hubungi Kami"
      subtitle={`Pusat Layanan Pelanggan & Informasi Resmi ${CONFIG.companyName}`}
      activeTab="contact"
    >
      <div className="space-y-8">
        {/* Intro */}
        <section className="space-y-3">
          <p className="text-text-mut leading-relaxed">
            Apakah Anda memiliki pertanyaan mengenai aktivasi akun, panduan penggunaan platform SmartFeed, konfirmasi pembayaran, atau kerjasama bisnis dengan <strong className="text-text">{CONFIG.companyName}</strong>? Tim layanan pelanggan kami siap membantu Anda dengan senang hati.
          </p>
        </section>

        {/* Contact Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* WhatsApp Card */}
          <div className="p-5 rounded-2xl bg-bg border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text">WhatsApp Hotline & CS</h3>
              <p className="text-xs text-text-mut leading-relaxed">
                Respon cepat untuk pertanyaan teknis, kendala akses, dan panduan aktivasi lisensi.
              </p>
              <div className="font-mono text-sm font-bold text-text pt-1">
                {CONFIG.contactPhoneDisplay}
              </div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              Chat CS via WhatsApp
            </a>
          </div>

          {/* Email Card */}
          <div className="p-5 rounded-2xl bg-bg border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-accent-sm text-accent border border-accent/20 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-text">Email Resmi Usaha</h3>
              <p className="text-xs text-text-mut leading-relaxed">
                Untuk pertanyaan kerjasama, penagihan resmi, invoice, dan administrasi merchant.
              </p>
              <div className="font-mono text-sm font-bold text-text pt-1">
                {CONFIG.contactEmail}
              </div>
            </div>
            <a
              href={`mailto:${CONFIG.contactEmail}`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-accent hover:brightness-110 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              Kirim Email Resmi
            </a>
          </div>
        </div>

        {/* Office & Operational Hours */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          {/* Address */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Alamat Kantor Operasional
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-text">{CONFIG.companyName}</p>
              <p className="text-text-mut leading-relaxed flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{CONFIG.contactAddress}</span>
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Jam Operasional Layanan
            </div>
            <div className="text-xs space-y-2 text-text-mut">
              <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                <span>Senin – Jumat:</span>
                <span className="font-semibold text-text">08.00 – 21.00 WIB</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                <span>Sabtu & Tanggal Tertentu:</span>
                <span className="font-semibold text-text">09.00 – 17.00 WIB</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Minggu & Hari Libur Nasional:</span>
                <span className="text-text-dim">Layanan Tiket / Chat Terbatas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Web domain info */}
        <div className="p-4 rounded-xl bg-bg-panel border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-text-mut">
            <Globe className="w-4 h-4 text-accent" />
            <span>Situs Utama: <strong className="text-text">{CONFIG.companyUrl}</strong> · Subdomain Platform: <strong className="text-text">smartfeed.berandadigital.net</strong></span>
          </div>
          <a
            href={CONFIG.companyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
          >
            Kunjungi Website Induk <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </LegalLayout>
  );
}
