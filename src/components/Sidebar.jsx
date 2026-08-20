import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Image, Youtube, Megaphone, PencilLine, ScanFace, UtensilsCrossed,
  Wand2, Settings, PlayCircle, Sparkles, DollarSign, GalleryHorizontalEnd, HandCoins,
  Sparkles as LogoIcon, Shirt, Star, Film, ChevronRight, ChevronDown, Store, Grid3x3, LogOut,
  PanelLeftClose, PanelLeftOpen, Sun, Moon, Layers, Newspaper, MessageSquareQuote, ShieldAlert
} from 'lucide-react';
import { CONFIG, brandParts } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { showConfirmLogout } from '../utils/alerts.js';

const MODES = [
  { id: 'banner',      icon: Image,                label: 'Design Feeds',       badge: '' },
  { id: 'carousel',    icon: GalleryHorizontalEnd, label: 'Carousel Feeds',     badge: '' },
  { id: 'gridfeed',    icon: Grid3x3,              label: '9 Feed Konsisten',   badge: 'Hot' },
  { id: 'thumbnail',   icon: Youtube,              label: 'YouTube Thumbnail',  badge: '' },
  { id: 'typography',  icon: Megaphone,            label: 'Ads Design',         badge: '' },
  { id: 'copywriting', icon: PencilLine,           label: 'Copy Writing',       badge: '' },
  { id: 'facecard',    icon: ScanFace,             label: 'Face Card',          badge: '' },
  { id: 'menufb',      icon: UtensilsCrossed,      label: 'Menu F&B',           badge: 'New' },
];

const JOURNALISM_MODES = [
  { id: 'newscard',  icon: Newspaper,          label: 'Breaking News',  badge: 'Hot', desc: 'Kartu berita kilat & editorial' },
  { id: 'quotecard', icon: MessageSquareQuote, label: 'Quote Tokoh',    badge: '',    desc: 'Kutipan narasumber & pejabat' },
  { id: 'factcheck', icon: ShieldAlert,        label: 'Cek Fakta',      badge: 'New', desc: 'Verifikasi hoaks & klarifikasi' },
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
}) {
  const { logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // State expand / collapse sidebar (default: expanded on desktop, collapsed on mobile)
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('af_sidebar_expanded');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
    } catch {
      return true;
    }
  });

  // State accordion & flyout
  const [journalismAccordionOpen, setJournalismAccordionOpen] = useState(true);
  const [journalismFlyoutOpen, setJournalismFlyoutOpen] = useState(false);
  const [journalismFlyoutPos, setJournalismFlyoutPos] = useState({ top: 0, left: 0 });
  const journalismBtnRef = useRef(null);
  const journalismFlyoutRef = useRef(null);

  const [affiliateAccordionOpen, setAffiliateAccordionOpen] = useState(false);
  const [affiliateFlyoutOpen, setAffiliateFlyoutOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const affiliateBtnRef = useRef(null);
  const flyoutRef = useRef(null);

  // Save expanded preference
  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try { localStorage.setItem('af_sidebar_expanded', String(next)); } catch {}
      return next;
    });
  };

  // Track layar kecil
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Recompute journalism flyout position
  useEffect(() => {
    if (journalismFlyoutOpen && journalismBtnRef.current && !isExpanded) {
      const rect = journalismBtnRef.current.getBoundingClientRect();
      setJournalismFlyoutPos({
        top: Math.max(8, Math.min(rect.top, window.innerHeight - 300)),
        left: Math.max(8, Math.min(rect.right + 6, window.innerWidth - 288)),
      });
    }
  }, [journalismFlyoutOpen, isExpanded]);

  // Recompute affiliate flyout position saat sidebar collapsed & dibuka
  useEffect(() => {
    if (affiliateFlyoutOpen && affiliateBtnRef.current && !isExpanded) {
      const rect = affiliateBtnRef.current.getBoundingClientRect();
      setFlyoutPos({
        top: Math.max(8, Math.min(rect.top, window.innerHeight - 300)),
        left: Math.max(8, Math.min(rect.right + 6, window.innerWidth - 288)),
      });
    }
  }, [affiliateFlyoutOpen, isExpanded]);

  // Close flyouts saat click outside
  useEffect(() => {
    const onDoc = (e) => {
      if (journalismFlyoutOpen) {
        const inBtn = journalismBtnRef.current && journalismBtnRef.current.contains(e.target);
        const inFly = journalismFlyoutRef.current && journalismFlyoutRef.current.contains(e.target);
        if (!inBtn && !inFly) setJournalismFlyoutOpen(false);
      }
      if (affiliateFlyoutOpen) {
        const inBtn = affiliateBtnRef.current && affiliateBtnRef.current.contains(e.target);
        const inFly = flyoutRef.current && flyoutRef.current.contains(e.target);
        if (!inBtn && !inFly) setAffiliateFlyoutOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [journalismFlyoutOpen, affiliateFlyoutOpen]);

  const isJournalismActive = JOURNALISM_IDS.includes(mode);
  const isAffiliateActive = AFFILIATE_IDS.includes(mode);

  // Konten flyout popup Jurnalisme (mode collapsed)
  const journalismMenuInner = (
    <>
      <div className="px-3.5 py-2.5 border-b border-border bg-bg-elev/70 flex items-center justify-between">
        <div>
          <div className="text-[10px] mono uppercase tracking-widest text-accent flex items-center gap-1.5 font-bold">
            <Newspaper className="w-3.5 h-3.5" />
            Jurnalisme & Redaksi
          </div>
          <div className="text-[10px] text-text-dim mt-0.5">{JOURNALISM_MODES.length} tools visual khusus berita</div>
        </div>
      </div>
      <div className="py-1.5">
        {JOURNALISM_MODES.map((j) => {
          const Icon = j.icon;
          const active = mode === j.id;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => { onChangeMode(j.id); setJournalismFlyoutOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-bg-elev transition text-left ${
                active ? 'bg-accent-sm border-l-2 border-l-accent' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-accent text-white' : 'bg-bg-elev border border-border text-text-mut'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold leading-tight flex items-center gap-1.5 ${active ? 'text-accent' : 'text-text'}`}>
                  {j.label}
                  {j.badge && <span className="text-[9px] px-1 rounded bg-accent/20 text-accent font-bold">{j.badge}</span>}
                </div>
                <div className="text-[10px] text-text-dim mt-0.5 truncate">{j.desc}</div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-accent' : 'text-text-dim'}`} />
            </button>
          );
        })}
      </div>
    </>
  );

  // Konten flyout popup Affiliate (saat mode collapsed)
  const affiliateMenuInner = (
    <>
      <div className="px-3.5 py-2.5 border-b border-border bg-bg-elev/70 flex items-center justify-between">
        <div>
          <div className="text-[10px] mono uppercase tracking-widest text-accent flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Affiliate Tools
          </div>
          <div className="text-[10px] text-text-dim mt-0.5">{AFFILIATE_MODES.length} tools visual khusus affiliate</div>
        </div>
      </div>
      <div className="py-1.5">
        {AFFILIATE_MODES.map((a) => {
          const Icon = a.icon;
          const active = mode === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => { onChangeMode(a.id); setAffiliateFlyoutOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-bg-elev transition text-left ${
                active ? 'bg-accent-sm border-l-2 border-l-accent' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-accent text-white' : 'bg-bg-elev border border-border text-text-mut'}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold leading-tight ${active ? 'text-accent' : 'text-text'}`}>{a.label}</div>
                <div className="text-[10px] text-text-dim mt-0.5 truncate">{a.desc}</div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-accent' : 'text-text-dim'}`} />
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <aside
      className={`surface rounded-none border-y-0 border-l-0 shrink-0 flex flex-col pt-3 pb-4 sticky top-14 self-start z-20 lg:top-0 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[230px] sm:w-[240px]' : 'w-[60px] lg:w-[64px]'
      }`}
      style={{
        height: 'calc(100dvh - 3.5rem)',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Header Sidebar: Brand + Toggle Show/Hide */}
      <div className={`px-2.5 pb-3 mb-2 border-b border-border flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        {isExpanded ? (
          <div className="flex items-center gap-2.5 min-w-0 pl-1">
            <div className="w-8 h-8 rounded-lg shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)] flex items-center justify-center shrink-0">
              <img
                src={CONFIG.logoUrl}
                alt={CONFIG.brandName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.logo-fb')) {
                    const fb = document.createElement('span');
                    fb.className = 'logo-fb w-full h-full bg-accent flex items-center justify-center text-white font-black text-xs rounded-lg';
                    fb.textContent = 'F';
                    parent.appendChild(fb);
                  }
                }}
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-bold truncate text-text">
                {brandParts().lead && <span className="font-semibold">{brandParts().lead} </span>}
                <span className="text-accent">{brandParts().accent}</span>
              </div>
              <div className="text-[9px] mono uppercase tracking-widest text-text-dim truncate">
                AI Studio
              </div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mb-0.5 rounded-lg shadow-[0_0_10px_rgba(var(--accent-rgb),0.4)] flex items-center justify-center shrink-0">
            <img
              src={CONFIG.logoUrl}
              alt={CONFIG.brandName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Toggle Button Show/Hide Sidebar */}
        <button
          type="button"
          onClick={toggleExpand}
          className="w-7 h-7 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-accent transition shrink-0"
          title={isExpanded ? 'Sembunyikan Menu (Collapse)' : 'Tampilkan Nama Menu (Expand)'}
        >
          {isExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-2 space-y-1">
        {/* Section Label: Tools Utama */}
        {isExpanded && (
          <div className="px-2 pt-1 pb-1.5 text-[9px] mono uppercase tracking-widest text-text-dim font-semibold flex items-center justify-between">
            <span>Mode Studio</span>
            <span className="text-[8px] px-1 py-0.5 rounded bg-bg-deep border border-border text-text-dim">{MODES.length}</span>
          </div>
        )}

        {/* Mode Items */}
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;

          if (isExpanded) {
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMode(m.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition text-left relative group ${
                  active
                    ? 'bg-accent text-white shadow-[0_0_14px_rgba(var(--accent-rgb),0.35)]'
                    : 'text-text-mut hover:text-text hover:bg-bg-elev'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-text-mut group-hover:text-accent'}`} />
                <span className="flex-1 truncate">{m.label}</span>
                {m.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold mono uppercase ${
                    active ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent border border-accent/30'
                  }`}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          }

          // Collapsed state
          return (
            <div key={m.id} className="relative flex justify-center">
              <button
                type="button"
                onClick={() => onChangeMode(m.id)}
                data-active={active}
                className="side-btn group"
                title={m.label}
              >
                <Icon className="w-5 h-5" />
                <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
                  {m.label}
                </span>
              </button>
            </div>
          );
        })}

        {/* Divider */}
        <div className={`my-2.5 border-t border-border ${isExpanded ? 'mx-1' : 'mx-2'}`} />

        {/* Jurnalisme & Redaksi Media Section */}
        {isExpanded ? (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setJournalismAccordionOpen((v) => !v)}
              className="w-full px-2 py-1.5 text-[9px] mono uppercase tracking-widest text-accent font-semibold flex items-center justify-between hover:text-accent-h transition"
            >
              <span className="flex items-center gap-1.5">
                <Newspaper className="w-3 h-3 text-accent" />
                Jurnalisme & Media
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${journalismAccordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {journalismAccordionOpen && (
              <div className="space-y-0.5 pl-1.5 border-l border-border ml-2 my-1">
                {JOURNALISM_MODES.map((j) => {
                  const Icon = j.icon;
                  const active = mode === j.id;
                  return (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => onChangeMode(j.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition text-left group ${
                        active
                          ? 'bg-accent text-white font-bold shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]'
                          : 'text-text-mut hover:text-text hover:bg-bg-elev'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-text-mut group-hover:text-accent'}`} />
                      <span className="truncate flex-1 text-[11px]">{j.label}</span>
                      {j.badge && (
                        <span className={`text-[8px] px-1 py-0.2 rounded font-bold mono uppercase ${
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
          </div>
        ) : (
          /* Collapsed Journalism Button with Flyout */
          <div className="relative flex justify-center mb-1" ref={journalismBtnRef}>
            <button
              type="button"
              onClick={() => setJournalismFlyoutOpen((v) => !v)}
              data-active={isJournalismActive || journalismFlyoutOpen}
              className="side-btn group"
              title="Jurnalisme & Media"
            >
              <Newspaper className="w-5 h-5" />
              <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
                Jurnalisme & Media ({JOURNALISM_MODES.length})
              </span>
              {isJournalismActive && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(var(--accent-rgb),0.8)]" />
              )}
            </button>

            {/* Submenu Portal */}
            {journalismFlyoutOpen && createPortal(
              isMobile ? (
                <>
                  <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm animate-fade-in" onClick={() => setJournalismFlyoutOpen(false)} />
                  <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-16 pointer-events-none">
                    <div
                      ref={journalismFlyoutRef}
                      className="w-full max-w-[320px] max-h-[80vh] overflow-y-auto surface shadow-panel rounded-xl animate-slide-up pointer-events-auto"
                    >
                      {journalismMenuInner}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  ref={journalismFlyoutRef}
                  className="fixed z-[9999] w-[270px] surface shadow-panel rounded-xl overflow-hidden border border-border animate-fade-in"
                  style={{ top: journalismFlyoutPos.top, left: journalismFlyoutPos.left }}
                >
                  {journalismMenuInner}
                </div>
              ),
              document.body
            )}
          </div>
        )}

        {/* Affiliate Tools Section */}
        {isExpanded ? (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setAffiliateAccordionOpen((v) => !v)}
              className="w-full px-2 py-1.5 text-[9px] mono uppercase tracking-widest text-accent font-semibold flex items-center justify-between hover:text-accent-h transition"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent" />
                Affiliate Tools
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${affiliateAccordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {affiliateAccordionOpen && (
              <div className="space-y-0.5 pl-1.5 border-l border-border ml-2 my-1">
                {AFFILIATE_MODES.map((a) => {
                  const Icon = a.icon;
                  const active = mode === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onChangeMode(a.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition text-left group ${
                        active
                          ? 'bg-accent text-white font-bold shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]'
                          : 'text-text-mut hover:text-text hover:bg-bg-elev'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-text-mut group-hover:text-accent'}`} />
                      <span className="truncate flex-1 text-[11px]">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed Affiliate Button with Flyout */
          <div className="relative flex justify-center" ref={affiliateBtnRef}>
            <button
              type="button"
              onClick={() => setAffiliateFlyoutOpen((v) => !v)}
              data-active={isAffiliateActive || affiliateFlyoutOpen}
              className="side-btn group"
              title="Affiliate Tools"
            >
              <DollarSign className="w-5 h-5" />
              <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
                Affiliate Tools ({AFFILIATE_MODES.length})
              </span>
              {isAffiliateActive && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(var(--accent-rgb),0.8)]" />
              )}
            </button>

            {/* Submenu Portal */}
            {affiliateFlyoutOpen && createPortal(
              isMobile ? (
                <>
                  <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm animate-fade-in" onClick={() => setAffiliateFlyoutOpen(false)} />
                  <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-16 pointer-events-none">
                    <div
                      ref={flyoutRef}
                      className="w-full max-w-[320px] max-h-[80vh] overflow-y-auto surface shadow-panel rounded-xl animate-slide-up pointer-events-auto"
                    >
                      {affiliateMenuInner}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  ref={flyoutRef}
                  className="fixed z-[9999] w-[270px] surface shadow-panel rounded-xl overflow-hidden border border-border animate-fade-in"
                  style={{ top: flyoutPos.top, left: flyoutPos.left }}
                >
                  {affiliateMenuInner}
                </div>
              ),
              document.body
            )}
          </div>
        )}
      </div>

      {/* Bottom Utilities */}
      <div className={`pt-2 border-t border-border px-2 space-y-1 mt-auto ${isExpanded ? '' : 'flex flex-col items-center'}`}>
        {/* Randomize Demo Button */}
        {isExpanded ? (
          <button
            type="button"
            onClick={onOpenDemo}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-text-mut hover:text-text hover:bg-bg-elev transition"
          >
            <Wand2 className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Randomize Demo</span>
          </button>
        ) : (
          <button onClick={onOpenDemo} className="side-btn group" title="Randomize Demo">
            <Wand2 className="w-5 h-5" />
            <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
              Randomize Demo
            </span>
          </button>
        )}

        {/* Reseller License Button (If enabled) */}
        {CONFIG.showResellerTier && CONFIG.resellerPaymentUrl && (
          isExpanded ? (
            <button
              type="button"
              onClick={onOpenReseller}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition"
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="truncate font-bold">Hak Jual Kembali</span>
            </button>
          ) : (
            <button onClick={onOpenReseller} className="side-btn group relative ring-1 ring-amber-400/50" title="Hak Jual Kembali">
              <Store className="w-5 h-5 text-amber-400" />
              <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
                Hak Jual Kembali
              </span>
            </button>
          )
        )}

        {/* Settings Button */}
        {isExpanded ? (
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-text-mut hover:text-text hover:bg-bg-elev transition"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Pengaturan</span>
          </button>
        ) : (
          <button onClick={onOpenSettings} className="side-btn group" title="Pengaturan">
            <Settings className="w-5 h-5" />
            <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
              Pengaturan
            </span>
          </button>
        )}

        {/* Theme Toggle Button */}
        {isExpanded ? (
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-text-mut hover:text-text hover:bg-bg-elev transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span className="truncate">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>
        ) : (
          <button onClick={toggleTheme} className="side-btn" title={isDark ? 'Switch to light' : 'Switch to dark'}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Logout Button */}
        {isExpanded ? (
          <button
            type="button"
            onClick={() => showConfirmLogout(logout)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-text-mut hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="truncate">Logout Akun</span>
          </button>
        ) : (
          <button
            onClick={() => showConfirmLogout(logout)}
            className="side-btn group hover:!text-red-400"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-bg-panel border border-border text-text opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition shadow-panel z-50">
              Logout
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
