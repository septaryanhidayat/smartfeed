import { useState, useMemo } from 'react';
import { X, Search, Newspaper, MessageSquareQuote, ShieldAlert, Sparkles, Gavel, CloudRain, TrendingUp, Trophy, Scale, Building2, Shield, CheckCircle, AlertTriangle, BookOpenText } from 'lucide-react';
import { JOURNALISM_DEMO_PRESETS } from '../data/journalismDemoOptions.js';

const ICONS = {
  Gavel, CloudRain, TrendingUp, Trophy, Scale, Building2, Shield, ShieldAlert, CheckCircle, AlertTriangle, BookOpenText
};

const MODE_TABS = [
  { id: 'article',   label: 'Artikel & Berita', icon: BookOpenText },
  { id: 'newscard',  label: 'Breaking News',    icon: Newspaper },
  { id: 'quotecard', label: 'Quote Tokoh',      icon: MessageSquareQuote },
  { id: 'factcheck', label: 'Cek Fakta',        icon: ShieldAlert },
];

export default function JournalismDemoModal({ open, onClose, mode, onPick }) {
  const [activeTab, setActiveTab] = useState(mode || 'article');
  const [q, setQ] = useState('');

  // Sync tab with mode on open
  const currentTab = ['article', 'newscard', 'quotecard', 'factcheck'].includes(mode) && !activeTab ? mode : (activeTab || 'article');

  const items = JOURNALISM_DEMO_PRESETS[currentTab] || [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (d) =>
        d.label.toLowerCase().includes(s) ||
        (d.badge || '').toLowerCase().includes(s) ||
        (d.rubric || '').toLowerCase().includes(s) ||
        (d.preset.headline || d.preset.sourceName || d.preset.claim || '').toLowerCase().includes(s)
    );
  }, [items, q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface shadow-panel w-full max-w-4xl max-h-[88vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Pilih Inspirasi Demo Jurnalisme</h2>
              <p className="text-xs text-text-mut mt-0.5">
                Pilih topik berita, wawancara tokoh, atau verifikasi cek fakta siap pakai.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-border bg-bg-elev/40">
          {MODE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            const count = (JOURNALISM_DEMO_PRESETS[tab.id] || []).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setQ(''); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  active
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-mut hover:text-text hover:bg-bg-elev'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-bg-deep text-text-dim'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none z-10" />
            <input
              type="text"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari topik demo (misal: OTT, Cuaca, Tokoh, Hoaks)..."
              className="input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        {/* Grid Presets */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-text-mut py-10">Tidak ada contoh yang cocok.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map((item) => {
                const IconComponent = ICONS[item.icon] || Sparkles;
                const p = item.preset;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onPick(item, currentTab); onClose(); }}
                    className="surface-elev p-4 text-left rounded-xl border border-border hover:border-accent hover:bg-accent-sm transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold mono uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                          {item.badge || item.status || p.rubric || 'DEMO'}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-bg-deep border border-border flex items-center justify-center text-text-mut group-hover:text-accent group-hover:border-accent">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="text-sm font-bold text-text group-hover:text-accent transition">
                        {item.label}
                      </div>

                      <p className="text-xs text-text-mut mt-1.5 line-clamp-2 leading-relaxed">
                        {p.headline || p.quote || p.claim || ''}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-text-dim">
                      <span>{p.dateline} · {p.mediaName}</span>
                      <span className="font-semibold text-accent group-hover:underline">Pilih Template →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border text-[10px] text-text-dim mono uppercase tracking-widest flex items-center justify-between">
          <span>{items.length} demo siap pakai</span>
          <span>Klik untuk auto-fill data</span>
        </div>
      </div>
    </div>
  );
}
