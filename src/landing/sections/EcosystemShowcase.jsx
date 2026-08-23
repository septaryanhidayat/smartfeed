import { ArrowUpRight, Sparkles, GraduationCap, Newspaper, Users, ShieldCheck, LayoutGrid, Clock } from 'lucide-react';
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
    <section id="ekosistem" className="relative py-12 sm:py-16 border-t border-border bg-gradient-to-b from-bg to-bg-deep/70 overflow-hidden">
      {/* Subtle Glow */}
      <GlowOrb size={400} color="rgba(var(--accent-rgb),0.08)" className="left-1/2 -translate-x-1/2 -top-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="eyebrow !text-[9px] !py-0.5 !px-2.5">
            <span className="dot" />
            EKOSISTEM PRODUK DIGITAL
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2.5 tracking-tight text-text">
            Jelajahi <span className="text-grad-red">5 Produk Digital</span> Kami
          </h2>
          <p className="mt-1.5 text-xs text-text-mut leading-relaxed">
            Rangkaian platform AI dan tools digital terpadu untuk mendukung produktivitas dan bisnis Anda.
          </p>
        </div>

        {/* 5 Compact Horizontal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {products.map((item, idx) => {
            const FallbackIcon = ICON_MAP[item.id] || Sparkles;
            const isFeatured = item.id === 'smartfeed';
            const hasLink = Boolean(item.url && item.url.trim() && item.url !== '#');

            return (
              <div
                key={item.id || idx}
                className={`group relative rounded-xl p-4 flex flex-col justify-between transition-all duration-200 ${
                  isFeatured
                    ? 'bg-bg-panel border-2 border-accent/40 shadow-sm hover:border-accent hover:shadow-md'
                    : 'bg-bg-panel/90 border border-border hover:border-border-strong hover:bg-bg-panel shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Header Card: Logo & Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-1.5 border border-border/80 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <SafeImage
                        src={item.logo}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        fallback={
                          <span className="w-full h-full bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                            <FallbackIcon className="w-5 h-5" />
                          </span>
                        }
                      />
                    </div>

                    {isFeatured ? (
                      <span className="text-[9px] mono uppercase tracking-wider font-bold bg-accent text-white px-2 py-0.5 rounded-full shadow-2xs">
                        Aktif
                      </span>
                    ) : (
                      <span className={`text-[9px] mono uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${
                        hasLink
                          ? 'bg-accent-sm text-accent border-border-strong'
                          : 'bg-bg-deep text-text-dim border-border/60'
                      }`}>
                        {hasLink ? 'Online' : 'Segera'}
                      </span>
                    )}
                  </div>

                  {/* Category & Title */}
                  <div className="text-[10px] mono uppercase tracking-wider text-accent font-semibold truncate">
                    {item.category}
                  </div>
                  <h3 className="text-sm font-bold text-text mt-0.5 group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>

                  {/* Description (Compact 2 lines) */}
                  <p className="mt-1.5 text-[11px] text-text-mut leading-snug line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Action Link / Button */}
                <div className="mt-3.5 pt-2.5 border-t border-border/60">
                  {hasLink ? (
                    <a
                      href={item.url}
                      target={item.id === 'smartfeed' ? '_self' : '_blank'}
                      rel={item.id === 'smartfeed' ? '' : 'noreferrer'}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all ${
                        isFeatured
                          ? 'bg-accent text-white hover:bg-accent-h shadow-2xs'
                          : 'bg-accent-sm text-accent hover:bg-accent hover:text-white border border-border-strong'
                      }`}
                    >
                      <span>{item.id === 'smartfeed' ? 'Buka Studio' : 'Kunjungi Web'}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <div className="w-full py-1.5 px-2 rounded-lg text-[10px] mono font-medium text-text-dim bg-bg-deep/80 border border-border/50 inline-flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-text-dim" />
                      <span>Segera Hadir</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
