import LegalLayout from './LegalLayout.jsx';
import { CONFIG } from '../config.js';
import { Sparkles, Building2, ShieldCheck, Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <LegalLayout
      title="Tentang Kami"
      subtitle={`Mengenal Beranda Teknologi Digital dan Platform SmartFeed`}
      activeTab="about"
    >
      <div className="space-y-8">
        {/* Section 1: Profil Perusahaan */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Building2 className="w-5 h-5" />
            <h2>Profil Perusahaan (Merchant)</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            <strong className="text-text">{CONFIG.companyName}</strong> adalah entitas usaha pengembang teknologi digital dan perangkat lunak yang berfokus pada penyediaan solusi digital praktis, otomatisasi pemasaran, dan platform produktivitas berbasis web (SaaS) untuk membantu pelaku UMKM, digital marketer, kreator konten, dan instansi di seluruh Indonesia.
          </p>
          <p className="text-text-mut leading-relaxed">
            Melalui domain induk kami <a href={CONFIG.companyUrl} target="_blank" rel="noreferrer" className="text-accent underline font-medium">{CONFIG.companyUrl}</a>, kami menghadirkan berbagai inovasi perangkat digital mandiri, salah satunya adalah <strong className="text-text">{CONFIG.brandName}</strong> yang beralamat di <span className="font-semibold text-text">https://smartfeed.berandadigital.net</span>.
          </p>
        </section>

        {/* Section 2: Tentang SmartFeed */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <h2>Mengenal Platform SmartFeed</h2>
          </div>
          <p className="text-text-mut leading-relaxed">
            <strong className="text-text">{CONFIG.brandName}</strong> adalah aplikasi web studio desain visual dan generator konten promosi instan berbasis kecerdasan buatan (Artificial Intelligence). Platform ini dirancang khusus untuk memangkas waktu produksi materi visual promosi dari hitungan jam menjadi hitungan detik tanpa memerlukan keahlian desain grafis rumit seperti Photoshop atau kerumitan template manual.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              { title: 'Grid Feed & Banner Generator', desc: 'Pembuatan visual promosi media sosial berestetika tinggi dalam 1 kali klik.' },
              { title: 'Storyboard & Affiliate Video', desc: 'Penyusunan naskah video pendek (TikTok/Reels/Shorts) dengan hook konversi tinggi.' },
              { title: 'Carousel Multi-Slide Builder', desc: 'Pembuat konten edukasi & micro-blogging multi slide berdesain konsisten.' },
              { title: 'Typography Ads & F&B Menu', desc: 'Generator visual menu kuliner dan iklan tipografi siap cetak / tayang.' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-bg border border-border/70 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs text-text">{item.title}</div>
                  <div className="text-[11px] text-text-mut mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Model Bisnis & Penyerahan Produk */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <h2>Model Bisnis & Mekanisme Layanan Digital</h2>
          </div>
          <ul className="list-disc list-inside text-text-mut space-y-1.5 pl-1">
            <li><strong>Produk 100% Digital:</strong> Layanan yang kami sediakan adalah lisensi akses ke web application (SaaS). Tidak ada barang fisik yang dikirimkan melalui kurir.</li>
            <li><strong>Aktivasi Instan:</strong> Setelah pembeli menyelesaikan pembayaran melalui Payment Gateway resmi, sistem kami segera memvalidasi dan mengaktifkan akses pengguna secara langsung ke aplikasi web studio.</li>
            <li><strong>Mitra Pembayaran Terverifikasi:</strong> Kami bekerja sama dengan penyedia gerbang pembayaran (Payment Gateway) resmi berizin Bank Indonesia seperti <strong>TriPay</strong> untuk memastikan seluruh transaksi diproses secara aman, transparan, dan otomatis.</li>
          </ul>
        </section>

        {/* Section 4: Identitas & Kontak Resmi */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="font-bold text-sm text-text">Informasi Kontak & Domisili Resmi</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
              <div className="font-semibold text-text flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                {CONFIG.companyName}
              </div>
              <div className="flex items-start gap-2 text-text-mut">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{CONFIG.contactAddress}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
              <div className="font-semibold text-text flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                Layanan Pelanggan
              </div>
              <div className="flex items-center gap-2 text-text-mut">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>Email: <a href={`mailto:${CONFIG.contactEmail}`} className="text-accent underline">{CONFIG.contactEmail}</a></span>
              </div>
              <div className="flex items-center gap-2 text-text-mut">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>WhatsApp / Telp: <a href={`https://wa.me/62${CONFIG.contactPhone.replace(/^0/, '')}`} className="text-accent underline">{CONFIG.contactPhoneDisplay}</a></span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
