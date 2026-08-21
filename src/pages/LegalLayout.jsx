import { useEffect } from 'react';
import { ArrowLeft, Zap, ShieldCheck, FileText, Info, Phone, ExternalLink } from 'lucide-react';
import { CONFIG, brandParts } from '../config.js';
import SafeImage from '../landing/primitives/SafeImage.jsx';

export default function LegalLayout({ title, subtitle, activeTab, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navItems = [
    { key: 'about', label: 'Tentang Kami', href: '/tentang-kami', icon: Info },
    { key: 'privacy', label: 'Kebijakan Privasi', href: '/kebijakan-privasi', icon: ShieldCheck },
    { key: 'terms', label: 'Syarat & Ketentuan', href: '/syarat-ketentuan', icon: FileText },
    { key: 'contact', label: 'Hubungi Kami', href: '/kontak', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col selection:bg-accent selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-bg/90 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex w-9 h-9 items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] rounded-xl">
              <SafeImage
                src={CONFIG.logoUrl}
                alt={CONFIG.brandName}
                className="w-full h-full object-contain"
                fallback={
                  <span className="w-full h-full bg-accent flex items-center justify-center text-white font-black rounded-xl">
                    <Zap className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                }
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">
                {brandParts().lead && <>{brandParts().lead} </>}
                <span className="text-accent">{brandParts().accent}</span>
              </span>
              <span className="text-[9px] mono uppercase text-text-dim">
                by {CONFIG.companyName}
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-mut hover:text-text hover:bg-bg-panel border border-border transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </a>
            <a
              href="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-accent hover:brightness-110 shadow-sm transition-all"
            >
              Buka Studio
            </a>
          </div>
        </div>
      </header>

      {/* Hero Title Section */}
      <div className="bg-bg-panel/40 border-b border-border py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-sm border border-accent/30 text-accent text-xs font-medium mb-3">
            <span>{CONFIG.companyName}</span>
            <span>·</span>
            <span className="mono">smartfeed.berandadigital.net</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-text-mut max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Area with Navigation Tabs */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-6 mb-8 border-b border-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-bg-panel text-text-mut hover:text-text border border-border hover:border-accent/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Main Body */}
        <div className="bg-bg-panel/60 border border-border rounded-2xl p-6 sm:p-10 shadow-sm leading-relaxed text-sm text-text">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-deep py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-text-mut space-y-2">
          <p className="font-semibold text-text">
            {CONFIG.brandName} · Produk Resmi dari {CONFIG.companyName}
          </p>
          <p className="text-text-dim text-[11px]">
            {CONFIG.contactAddress}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] pt-2 text-text-dim">
            <a href="mailto:info@berandadigital.net" className="hover:text-accent transition-colors">
              {CONFIG.contactEmail}
            </a>
            <span>•</span>
            <a href={`https://wa.me/62${CONFIG.contactPhone.replace(/^0/, '')}`} className="hover:text-accent transition-colors">
              WhatsApp: {CONFIG.contactPhoneDisplay}
            </a>
            <span>•</span>
            <a href={CONFIG.companyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent transition-colors">
              berandadigital.net <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <p className="text-[10px] mono text-text-dim pt-3">
            © {new Date().getFullYear()} {CONFIG.companyName}. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
}
