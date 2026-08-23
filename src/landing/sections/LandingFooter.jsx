import { Zap, Facebook, Instagram, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import SafeImage from '../primitives/SafeImage.jsx';
import { CONFIG, brandParts } from '../../config.js';

export default function LandingFooter() {
  const waNumber = CONFIG.contactPhone ? CONFIG.contactPhone.replace(/^0/, '62') : '6289695249089';

  return (
    <footer className="relative border-t border-border bg-bg-deep/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Kolom 1: Brand & Profil Perusahaan */}
          <div className="space-y-3 lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex w-10 h-10 items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] rounded-xl">
                <SafeImage
                  src={CONFIG.logoUrl}
                  alt={CONFIG.brandName}
                  className="w-full h-full object-contain"
                  fallback={
                    <span className="w-full h-full bg-accent flex items-center justify-center text-white font-black rounded-xl">
                      <Zap className="w-4.5 h-4.5" strokeWidth={2.5} />
                    </span>
                  }
                />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold">
                  {brandParts().lead && <>{brandParts().lead} </>}
                  <span className="text-accent">{brandParts().accent}</span>
                </span>
                <span className="text-[9px] mono uppercase text-text-dim">
                  by {CONFIG.companyName}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-mut leading-relaxed">
              Studio visual instan berbasis AI untuk banner promosi, carousel multi-slide, copywriting iklan, dan konten kreatif.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-text-dim">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Pembayaran Aman via Mitra Resmi</span>
            </div>
          </div>

          {/* Kolom 2: Ekosistem Produk Digital */}
          <div>
            <div className="text-[10px] mono uppercase tracking-widest text-text-dim mb-3 font-semibold">
              Produk Digital AI
            </div>
            <ul className="space-y-2 text-xs">
              {(CONFIG.ecosystemProducts || []).map((prod) => (
                <li key={prod.id}>
                  <a
                    href={prod.url}
                    target={prod.id === 'smartfeed' ? '_self' : '_blank'}
                    rel={prod.id === 'smartfeed' ? '' : 'noreferrer'}
                    className="text-text-mut hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{prod.name}</span>
                    {prod.id !== 'smartfeed' && (
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Navigasi Studio */}
          <div>
            <div className="text-[10px] mono uppercase tracking-widest text-text-dim mb-3 font-semibold">
              Fitur Studio
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#fitur" className="text-text-mut hover:text-accent transition-colors">Fitur Generator</a></li>
              <li><a href="#cara" className="text-text-mut hover:text-accent transition-colors">Cara Kerja</a></li>
              <li><a href="#contoh" className="text-text-mut hover:text-accent transition-colors">Galeri Showcase</a></li>
              <li><a href="#ekosistem" className="text-text-mut hover:text-accent transition-colors">Ekosistem Produk</a></li>
              <li><a href="#harga" className="text-text-mut hover:text-accent transition-colors">Paket & Harga</a></li>
              <li><a href="/checkout" className="text-text-mut hover:text-accent transition-colors">Halaman Checkout</a></li>
              <li><a href="/app" className="text-accent font-semibold hover:underline">Masuk ke Studio</a></li>
            </ul>
          </div>

          {/* Kolom 3: Legalitas & Kebijakan (Wajib Merchant) */}
          <div>
            <div className="text-[10px] mono uppercase tracking-widest text-text-dim mb-3 font-semibold">
              Legal & Ketentuan
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="/tentang-kami" className="text-text-mut hover:text-accent transition-colors">Tentang Kami</a></li>
              <li><a href="/kebijakan-privasi" className="text-text-mut hover:text-accent transition-colors">Kebijakan Privasi</a></li>
              <li><a href="/syarat-ketentuan" className="text-text-mut hover:text-accent transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="/kontak" className="text-text-mut hover:text-accent transition-colors">Hubungi Kami & CS</a></li>
              <li>
                <a
                  href={CONFIG.companyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-dim hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  berandadigital.net <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Informasi Kontak Resmi */}
          <div className="space-y-3">
            <div className="text-[10px] mono uppercase tracking-widest text-text-dim mb-3 font-semibold">
              Kontak Resmi
            </div>
            <div className="text-xs text-text-mut space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{CONFIG.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href={`mailto:${CONFIG.contactEmail}`} className="text-[11px] hover:text-accent transition-colors">
                  {CONFIG.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="text-[11px] hover:text-accent transition-colors font-mono">
                  {CONFIG.contactPhoneDisplay}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {CONFIG.instagramUrl && (
                <a
                  href={CONFIG.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Instagram ${CONFIG.instagramHandle || ''}`}
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-bg-panel border border-border flex items-center justify-center text-text-mut hover:text-accent hover:border-accent/50 hover:bg-accent-sm transition-all group"
                >
                  <Instagram className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {CONFIG.facebookUrl && (
                <a
                  href={CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Facebook ${CONFIG.facebookHandle || ''}`}
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-bg-panel border border-border flex items-center justify-center text-text-mut hover:text-accent hover:border-accent/50 hover:bg-accent-sm transition-all group"
                >
                  <Facebook className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Baris Copyright Bawah */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-[11px] text-text-dim">
            © {new Date().getFullYear()} <strong className="text-text">{CONFIG.brandName}</strong>. Sebuah Layanan Resmi dari <strong className="text-text">{CONFIG.companyName}</strong>. Hak Cipta Dilindungi.
          </div>
          <div className="text-[10px] mono uppercase tracking-widest text-text-dim">
            v2.1 · SmartFeed Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
