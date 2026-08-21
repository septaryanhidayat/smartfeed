import { useEffect, useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import SafeImage from '../primitives/SafeImage.jsx';
import { CONFIG, brandParts } from '../../config.js';

const NAV_LINKS = [
  { href: '#fitur',   label: 'Fitur'     },
  { href: '#cara',    label: 'Cara Kerja'},
  { href: '#contoh',  label: 'Showcase'  },
  { href: '#harga',   label: 'Harga'     },
  { href: '#faq',     label: 'FAQ'       },
];

export default function LandingNav({ onOpenAccess }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-bg/90 border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <a href="#top" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
          <span className="relative inline-flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] rounded-xl shrink-0">
            <SafeImage
              src={CONFIG.logoUrl}
              alt={CONFIG.brandName}
              className="w-full h-full object-contain"
              fallback={
                <span className="w-full h-full bg-accent flex items-center justify-center text-white font-black rounded-xl">
                  <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
                </span>
              }
            />
            <span className="ping-ring rounded-xl" />
          </span>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm sm:text-base font-bold whitespace-nowrap">
              {brandParts().lead && <>{brandParts().lead} </>}
              <span className="text-accent">{brandParts().accent}</span>
            </span>
            <span className="text-[8px] sm:text-[9px] mono uppercase text-text-dim whitespace-nowrap truncate max-w-[130px] xs:max-w-[170px] sm:max-w-none">
              by {CONFIG.companyName}
            </span>
          </div>
        </a>

        {/* Center Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-text-mut hover:text-accent transition-colors rounded-md whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <a
            href="/app"
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-text-mut hover:text-accent hover:bg-bg-panel/70 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Login Studio
          </a>
          <a
            href="#harga"
            className="btn-cta !py-1.5 sm:!py-2 !px-3 sm:!px-4 !text-xs sm:!text-sm cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1 sm:gap-1.5 shadow-sm"
          >
            <span>Dapatkan Akses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
