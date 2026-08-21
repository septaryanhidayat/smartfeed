import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Image, Youtube, Megaphone, PencilLine, ScanFace, UtensilsCrossed,
  Wand2, Settings, PlayCircle, Sparkles, DollarSign, GalleryHorizontalEnd, HandCoins,
  Sparkles as LogoIcon, Shirt, Star, Film, ChevronRight, ChevronDown, Store, Grid3x3, LogOut,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, Layers, Newspaper, MessageSquareQuote, ShieldAlert,
  Scissors, BookOpenText, Clapperboard, Presentation, X, Menu
} from 'lucide-react';
import { CONFIG, brandParts } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { showConfirmLogout } from '../utils/alerts.js';

const MODES = [
  { id: 'banner',       icon: Image,                label: 'Design Feeds',       badge: '' },
  { id: 'carousel',     icon: GalleryHorizontalEnd, label: 'Carousel Feeds',     badge: '' },
  { id: 'gridfeed',     icon: Grid3x3,              label: '9 Feed Konsisten',   badge: 'Hot' },
  { id: 'imageslicer',  icon: Scissors,             label: 'Grid & Image Slicer', badge: 'New' },
  { id: 'videoscript',  icon: Clapperboard,         label: 'Naskah Video & Storyboard', badge: 'New' },
  { id: 'presentation', icon: Presentation,         label: 'Slide & PPT Deck',   badge: 'Beta' },
  { id: 'thumbnail',    icon: Youtube,              label: 'YouTube Thumbnail',  badge: '' },
  { id: 'typography',   icon: Megaphone,            label: 'Ads Design',         badge: '' },
  { id: 'copywriting',  icon: PencilLine,           label: 'Copy Writing',       badge: '' },
  { id: 'facecard',     icon: ScanFace,             label: 'Face Card',          badge: '' },
  { id: 'menufb',       icon: UtensilsCrossed,      label: 'Menu F&B',           badge: 'New' },
];

const JOURNALISM_MODES = [
  { id: 'article',   icon: BookOpenText,       label: 'Artikel & Berita', badge: 'New', desc: 'Straight news, feature & rilis pers' },
  { id: 'newscard',  icon: Newspaper,          label: 'Breaking News',    badge: 'Hot', desc: 'Kartu berita kilat & editorial' },
  { id: 'quotecard', icon: MessageSquareQuote, label: 'Quote Tokoh',      badge: '',    desc: 'Kutipan narasumber & tokoh' },
  { id: 'factcheck', icon: ShieldAlert,        label: 'Cek Fakta',        badge: 'New', desc: 'Verifikasi hoaks & klarifikasi' },
];

const JOURNALISM_IDS = JOURNALISM_MODES.map((m) => m.id);

const AFFILIATE_MODES = [
  { id: 'logoaffiliate',       icon: LogoIcon, label: 'Logo & Mockup',       desc: 'Logo brand + brand mockup' },
  { id: 'tryonaffiliate',      icon: Shirt,    label: 'Try-On Produk',       desc: 'Try-on / wear-test image' },
  { id: 'reviewaffiliate',     icon: Star,     label: 'Review Banner',       desc: 'Banner review high-converting' },
  { id: 'storyboardaffiliate', icon: Film,     label: 'Storyboard Affiliate', desc: 'Storyboard scene-by-scene' },
];

const AFFILIATE_IDS = AFFILIATE_MODES.map((m) => m.id);

export default function Sidebar({
  mode,
  onChangeMode,
  onOpenDemo,
  onOpenTutorial,
  onOpenSettings,
  onOpenAffiliateProgram,
  onOpenReseller,
  mobileOpen = false,
  onCloseMobile,
}) {
  const { logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [logoError, setLogoError] = useState(false);

  // Desktop expand / collapse state
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('af_sidebar_expanded');
      if (saved !== null) return saved === 'true';
      return true;
    } catch {
      return true;
    }
  });

  const [journalismAccordionOpen, setJournalismAccordionOpen] = useState(true);
  const [affiliateAccordionOpen, setAffiliateAccordionOpen] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try { localStorage.setItem('af_sidebar_expanded', String(next)); } catch {}
      return next;
    });
  };

  const handleSelectMode = (newMode) => {
    onChangeMode(newMode);
    if (onCloseMobile) onCloseMobile();
  };

  // Content of navigation
  const renderNavContent = (isDrawer = false) => {
    const expanded = isExpanded || isDrawer;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`px-3 py-3.5 border-b border-border flex items-center shrink-0 ${expanded ? 'justify-between' : 'justify-center'}`}>
          {expanded ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center shrink-0 bg-accent text-white font-black text-sm overflow-hidden">
                {!logoError && CONFIG.logoUrl ? (
                  <img
                    src={CONFIG.logoUrl}
                    alt={CONFIG.brandName}
                    className="w-full h-full object-contain rounded-lg"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="w-full h-full bg-accent flex items-center justify-center text-white font-black text-xs">
                    SF
                  </span>
                )}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-sm font-extrabold truncate text-text">
                  {brandParts().lead && <span className="font-bold">{brandParts().lead} </span>}
                  <span className="text-accent">{brandParts().accent}</span>
                </div>
                <div className="text-[10px] mono uppercase tracking-widest text-text-dim truncate font-semibold">
                  AI Studio
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center shrink-0 bg-accent text-white font-black text-sm overflow-hidden">
              {!logoError && CONFIG.logoUrl ? (
                <img
                  src={CONFIG.logoUrl}
                  alt={CONFIG.brandName}
                  className="w-full h-full object-contain rounded-lg"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="w-full h-full bg-accent flex items-center justify-center text-white font-black text-xs">
                  SF
                </span>
              )}
            </div>
          )}

          {isDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-text transition cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : isExpanded ? (
            <button
              type="button"
              onClick={toggleExpand}
              className="w-7 h-7 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-accent transition shrink-0 cursor-pointer"
              title="Sembunyikan Menu"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Collapsed Toggle Expand Button */}
        {!expanded && (
          <div className="flex justify-center pt-2 pb-1 border-b border-border/50">
            <button
              type="button"
              onClick={toggleExpand}
              className="w-7 h-7 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-accent transition cursor-pointer"
              title="Tampilkan Nama Menu"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 hide-scrollbar">
          {expanded && (
            <div className="px-2 pb-1.5 text-[9px] mono uppercase tracking-widest text-text-dim font-bold flex items-center justify-between">
              <span>Mode Studio</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-bg-deep border border-border text-text-dim font-mono">{MODES.length}</span>
            </div>
          )}

          {/* Main Modes */}
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;

            if (expanded) {
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMode(m.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    active
                      ? 'bg-accent text-white shadow-sm ring-1 ring-accent/40 font-extrabold'
                      : 'text-text hover:text-accent hover:bg-bg-elev'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-accent'}`} />
                  <span className="flex-1 truncate">{m.label}</span>
                  {m.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold mono uppercase ${
                      active ? 'bg-white/25 text-white' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            }

            // Desktop Collapsed Icon View
            return (
              <div key={m.id} className="relative flex justify-center py-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectMode(m.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition group relative cursor-pointer ${
                    active
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-text-mut hover:text-accent hover:bg-bg-elev'
                  }`}
                  title={m.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="absolute left-[48px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-bold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-lg z-50">
                    {m.label}
                  </span>
                </button>
              </div>
            );
          })}

          {/* Divider */}
          <div className="my-3 border-t border-border" />

          {/* Journalism Accordion */}
          <div className="space-y-1">
            {expanded ? (
              <>
                <button
                  type="button"
                  onClick={() => setJournalismAccordionOpen((v) => !v)}
                  className="w-full px-2 py-1.5 text-[10px] mono uppercase tracking-widest text-accent font-extrabold flex items-center justify-between hover:text-accent-h transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5 text-accent" />
                    Jurnalisme &amp; Media
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${journalismAccordionOpen ? 'rotate-180' : ''}`} />
                </button>

                {journalismAccordionOpen && (
                  <div className="space-y-1 pl-1.5 border-l-2 border-accent/20 ml-2 my-1">
                    {JOURNALISM_MODES.map((j) => {
                      const Icon = j.icon;
                      const active = mode === j.id;
                      return (
                        <button
                          key={j.id}
                          type="button"
                          onClick={() => handleSelectMode(j.id)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left cursor-pointer ${
                            active
                              ? 'bg-accent text-white font-bold shadow-sm'
                              : 'text-text hover:text-accent hover:bg-bg-elev'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-accent'}`} />
                          <span className="truncate flex-1 text-[11px] font-semibold">{j.label}</span>
                          {j.badge && (
                            <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold mono uppercase ${
                              active ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent border border-accent/30'
                            }`}>
                              {j.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="relative flex justify-center py-0.5">
                <button
                  type="button"
                  onClick={() => setJournalismAccordionOpen((v) => !v)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-text-mut hover:text-accent hover:bg-bg-elev transition group cursor-pointer"
                  title="Jurnalisme & Media"
                >
                  <Newspaper className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Affiliate Accordion */}
          <div className="space-y-1 pt-1">
            {expanded ? (
              <>
                <button
                  type="button"
                  onClick={() => setAffiliateAccordionOpen((v) => !v)}
                  className="w-full px-2 py-1.5 text-[10px] mono uppercase tracking-widest text-emerald-500 font-extrabold flex items-center justify-between hover:text-emerald-400 transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-emerald-500" />
                    Affiliate Tools
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${affiliateAccordionOpen ? 'rotate-180' : ''}`} />
                </button>

                {affiliateAccordionOpen && (
                  <div className="space-y-1 pl-1.5 border-l-2 border-emerald-500/20 ml-2 my-1">
                    {AFFILIATE_MODES.map((a) => {
                      const Icon = a.icon;
                      const active = mode === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => handleSelectMode(a.id)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white font-bold shadow-sm'
                              : 'text-text hover:text-emerald-500 hover:bg-bg-elev'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-emerald-500'}`} />
                          <span className="truncate flex-1 text-[11px] font-semibold">{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="relative flex justify-center py-0.5">
                <button
                  type="button"
                  onClick={() => setAffiliateAccordionOpen((v) => !v)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-text-mut hover:text-emerald-500 hover:bg-bg-elev transition group cursor-pointer"
                  title="Affiliate Tools"
                >
                  <Shirt className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Utilities */}
        <div className="p-3 border-t border-border space-y-1.5 shrink-0 bg-bg-panel">
          {expanded ? (
            <>
              <button
                type="button"
                onClick={() => { onOpenDemo(); if (onCloseMobile) onCloseMobile(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-text hover:text-accent hover:bg-bg-elev transition cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">Randomize Demo</span>
              </button>

              <button
                type="button"
                onClick={() => { onOpenSettings(); if (onCloseMobile) onCloseMobile(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-text hover:text-accent hover:bg-bg-elev transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-text-mut shrink-0" />
                <span className="truncate">Pengaturan</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-text hover:text-accent hover:bg-bg-elev transition cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-indigo-500 shrink-0" />}
                <span className="truncate">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
              </button>

              <button
                type="button"
                onClick={() => showConfirmLogout(logout)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">Logout Akun</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button onClick={onOpenDemo} className="w-9 h-9 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-accent transition cursor-pointer" title="Randomize Demo">
                <Wand2 className="w-4 h-4 text-accent" />
              </button>
              <button onClick={onOpenSettings} className="w-9 h-9 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-accent transition cursor-pointer" title="Pengaturan">
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={toggleTheme} className="w-9 h-9 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-amber-400 transition cursor-pointer" title="Ganti Tema">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </button>
              <button onClick={() => showConfirmLogout(logout)} className="w-9 h-9 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-red-400 transition cursor-pointer" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible only on lg and above) */}
      <aside
        className={`hidden lg:flex surface rounded-none border-y-0 border-l-0 shrink-0 flex-col sticky top-14 self-start z-20 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-[230px] xl:w-[250px]' : 'w-[64px]'
        }`}
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        {renderNavContent(false)}
      </aside>

      {/* 2. MOBILE DRAWER (Fixed Overlay on Mobile screens) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex animate-fade-in">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[280px] max-w-[85vw] h-full bg-bg-panel border-r border-border flex flex-col z-10 shadow-2xl animate-slide-right">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
