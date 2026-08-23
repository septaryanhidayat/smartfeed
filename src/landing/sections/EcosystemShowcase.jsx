import { ArrowUpRight, Sparkles, ExternalLink, Layers, GraduationCap, Newspaper, Users, ShieldCheck, LayoutGrid, Clock } from 'lucide-react';
import SafeImage from '../primitives/SafeImage.jsx';
import GlowOrb from '../primitives/GlowOrb.jsx';
import { CONFIG } from '../../config.js';

const ICON_MAP = {
  smartfeed: LayoutGrid,
  smartedu: GraduationCap,
  smartnews: Newspaper,
  smartsdm: Users,
  smartsynth: ShieldCheck,
};

export default function EcosystemShowcase() {
  const products = CONFIG.ecosystemProducts || [];

  return (
    <section id="ekosistem" className="relative py-20 sm:py-24 border-t border-border bg-gradient-to-b from-bg to-bg-deep/90 overflow-hidden">
      {/* Decorative Orbs & BG */}
      <GlowOrb size={500} color="rgba(var(--accent-rgb),0.12)" className="left-1/2 -translate-x-1/2 -top-24 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="eyebrow">
            <span className="dot" />
            EKOSISTEM PRODUK DIGITAL
          </span>
          <h2 className="h-section mt-4">
            Jelajahi Suite <span className="text-grad-red">Produk & Tools Digital</span> Kami
          </h2>
          <p className="mt-4 text-sm sm:text-base text-text-mut leading-relaxed">
            Rangkaian solusi terpadu untuk kebutuhan desain grafis instan, portal berita online, big data edukasi, manajemen SDM, hingga verifikasi fakta & cek metadata konten AI.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item, idx) => {
            const FallbackIcon = ICON_MAP[item.id] || Sparkles;
            const isFeatured = item.id === 'smartfeed';
            const hasLink = Boolean(item.url && item.url.trim() && item.url !== '#');

            return (
              <div
                key={item.id || idx}
                className={`group relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-bg-panel/90 to-bg-panel/50 border-2 border-accent/40 shadow-[0_10px_35px_-10px_rgba(var(--accent-rgb),0.25)] hover:border-accent'
                    : 'bg-bg-panel/80 border border-border hover:border-border-strong hover:bg-bg-panel shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Badge & Logo */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 border border-border/80 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <SafeImage
                        src={item.logo}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        fallback={
                          <span className="w-full h-full bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                            <FallbackIcon className="w-7 h-7" />
                          </span>
                        }
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] mono uppercase tracking-wider font-bold bg-accent text-white shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Platform Ini
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] mono uppercase tracking-wider font-semibold border ${
                          hasLink
                            ? 'bg-accent-sm text-accent border-border-strong'
                            : 'bg-bg-deep text-text-dim border-border'
                        }`}>
                          {item.badge || (hasLink ? 'Tersedia' : 'Segera Hadir')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Category */}
                  <div className="space-y-1">
                    <div className="text-[11px] mono uppercase tracking-wider text-accent font-semibold">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors flex items-center gap-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-text-mut leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom CTA Link */}
                <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                  <span className="text-[11px] mono text-text-dim">
                    {item.id === 'smartfeed' ? 'Aplikasi Aktif' : hasLink ? 'Website Tersedia' : 'Dalam Pengembangan'}
                  </span>

                  {hasLink ? (
                    <a
                      href={item.url}
                      target={item.id === 'smartfeed' ? '_self' : '_blank'}
                      rel={item.id === 'smartfeed' ? '' : 'noreferrer'}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                        isFeatured
                          ? 'bg-accent text-white hover:bg-accent-h shadow-xs'
                          : 'text-text hover:text-accent bg-bg-deep border border-border hover:border-accent hover:bg-accent-sm'
                      }`}
                    >
                      <span>{item.id === 'smartfeed' ? 'Masuk Studio' : 'Kunjungi Web'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-bg-deep/80 text-text-dim border border-border/60">
                      <Clock className="w-3 h-3" />
                      <span>Segera Hadir</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Hub Bar */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-bg-panel/70 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-accent-sm border border-border-strong flex items-center justify-center text-accent shrink-0">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs sm:text-sm font-bold text-text">
                Butuh Integrasi Custom atau Informasi Seluruh Ekosistem Produk?
              </div>
              <div className="text-[11px] text-text-mut">
                Hubungi tim {CONFIG.companyName} untuk pertanyaan lisensi, akses portal, dan kemitraan.
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${CONFIG.contactPhone ? CONFIG.contactPhone.replace(/^0/, '62') : '6289695249089'}?text=Halo%20tim%20SmartFeed,%20saya%20tertarik%20dengan%20ekosistem%20produk%20digital%20Anda.`}
            target="_blank"
            rel="noreferrer"
            className="btn-cta-ghost !text-xs !py-2 !px-4 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
          >
            <span>Konsultasi Produk</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
