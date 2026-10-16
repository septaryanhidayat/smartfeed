import { useState, useMemo } from 'react';
import { X, Search, Flag, Layout, Presentation, FileText, Columns, Maximize2, Sparkles, Shuffle } from 'lucide-react';
import { FLYER_BANNER_PRESETS } from '../data/flyerBannerOptions.js';

const FORMAT_ICONS = {
  spanduk: Flag,
  backdrop: Presentation,
  flyer: FileText,
  xbanner: Columns,
  baliho: Maximize2,
  webbanner: Layout,
};

export default function FlyerBannerDemoModal({ open, onClose, onPick }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FLYER_BANNER_PRESETS;
    return FLYER_BANNER_PRESETS.filter(
      (d) =>
        d.label.toLowerCase().includes(s) ||
        d.formatType.toLowerCase().includes(s) ||
        d.sizeVariant.toLowerCase().includes(s) ||
        (d.preset.title || '').toLowerCase().includes(s) ||
        (d.preset.institution || '').toLowerCase().includes(s) ||
        (d.preset.speaker || '').toLowerCase().includes(s)
    );
  }, [q]);

  const handleRandomPick = () => {
    if (!FLYER_BANNER_PRESETS || FLYER_BANNER_PRESETS.length === 0) return;
    const randomIndex = Math.floor(Math.random() * FLYER_BANNER_PRESETS.length);
    const picked = FLYER_BANNER_PRESETS[randomIndex];
    onPick(picked);
    onClose();
  };

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
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Pilih Inspirasi Spanduk, Flyer & Banner</h2>
              <p className="text-xs text-text-mut mt-0.5">
                Pilih template siap pakai untuk panggung, flyer kegiatan, roll-up banner atau klik acak.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomPick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent/90 transition shadow-sm cursor-pointer"
              title="Pilih satu template secara acak"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Template</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border bg-bg-elev/30">
          <div className="relative">
            <Search className="w-4 h-4 text-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari template (misal: Vibe Coding, Robbani, Pelatihan, Wisuda, PSB, Wakaf)..."
              className="input pl-9 text-xs"
            />
          </div>
        </div>

        {/* List Presets */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-text-mut">
              Tidak ada template yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map((item) => {
                const IconComponent = FORMAT_ICONS[item.formatType] || Flag;
                const p = item.preset;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onPick(item);
                      onClose();
                    }}
                    className="p-4 rounded-xl border border-border bg-bg-elev/60 hover:bg-accent-sm/25 hover:border-accent/40 transition text-left flex flex-col justify-between gap-3 group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-bold mono">
                          <IconComponent className="w-3 h-3" />
                          {item.formatType.toUpperCase()} · {item.sizeVariant.toUpperCase()}
                        </span>
                        {p.badgeText && (
                          <span className="text-[9px] mono px-1.5 py-0.5 rounded bg-bg-panel border border-border text-text-dim truncate max-w-[150px]">
                            {p.badgeText}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-text group-hover:text-accent transition line-clamp-2 leading-snug">
                        {item.label}
                      </h3>
                      <p className="text-[11px] text-text-dim line-clamp-2 mt-1 leading-relaxed">
                        {p.subTitle || p.title}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] mono text-text-dim">
                      <span className="truncate max-w-[180px]">📍 {p.eventLocation || 'Lokasi Kegiatan'}</span>
                      <span className="text-accent font-semibold group-hover:translate-x-0.5 transition shrink-0">
                        Pilih Template →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg-elev/40 flex items-center justify-between text-[11px] text-text-dim">
          <span>{FLYER_BANNER_PRESETS.length} template siap pakai</span>
          <span className="mono">Klik kartu untuk mengisi seluruh form &amp; mockup</span>
        </div>
      </div>
    </div>
  );
}
