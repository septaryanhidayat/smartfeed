import { useState, useMemo } from 'react';
import { X, Search, Clapperboard, Video, Mic, Film, Sparkles, Play } from 'lucide-react';
import { VIDEOSCRIPT_DEMO_PRESETS } from '../data/videoScriptOptions.js';

const ICONS = {
  Clapperboard, Video, Mic, Film, Sparkles
};

export default function VideoScriptDemoModal({ open, onClose, onPick }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return VIDEOSCRIPT_DEMO_PRESETS;
    return VIDEOSCRIPT_DEMO_PRESETS.filter(
      (d) =>
        d.label.toLowerCase().includes(s) ||
        (d.badge || '').toLowerCase().includes(s) ||
        (d.preset.title || d.preset.coreMessage || '').toLowerCase().includes(s)
    );
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface shadow-panel w-full max-w-3xl max-h-[88vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Pilih Inspirasi Demo Naskah Video</h2>
              <p className="text-xs text-text-mut mt-0.5">
                Pilih konsep video pendek, wawancara podcast, atau storyboard visual iklan siap pakai.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border bg-bg-elev/30">
          <div className="relative">
            <Search className="w-4 h-4 text-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari konsep video, podcast, iklan, topik..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-bg-elev border border-border text-text placeholder-text-dim focus:border-accent outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map((item) => {
            const Icon = ICONS[item.icon] || Clapperboard;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onPick(item);
                  onClose();
                }}
                className="group border border-border hover:border-accent/60 bg-bg-elev/40 hover:bg-accent-sm/20 rounded-xl p-4 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-bg-elev border border-border flex items-center justify-center text-accent shrink-0 group-hover:border-accent/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text group-hover:text-accent transition">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-mut mt-1 line-clamp-2">
                      {item.preset.coreMessage || item.preset.keyPoints}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-text-dim mono mt-2 flex-wrap">
                      <span>⏱️ {item.preset.duration}</span>
                      <span>📺 {item.preset.platform}</span>
                      <span>🎙️ {item.preset.speaker}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary !py-1.5 !px-3 text-xs whitespace-nowrap self-end sm:self-center shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Gunakan Demo</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
