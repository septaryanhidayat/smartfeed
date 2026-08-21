import { X, Sparkles, Presentation, Check, Layers, ArrowRight, Play, Compass } from 'lucide-react';
import { PRESENTATION_DEMOS } from '../data/presentationOptions.js';

export default function PresentationDemoModal({ open, onClose, onPick, currentTopic }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/85 sm:bg-black/75 backdrop-blur-md flex items-stretch sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface shadow-2xl w-full max-w-3xl h-full sm:h-auto sm:max-h-[88vh] flex flex-col sm:rounded-2xl rounded-none border border-border animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border flex items-center justify-between shrink-0 bg-bg-panel/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-accent text-white flex items-center justify-center shadow-sm font-bold">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-text flex items-center gap-2">
                <span>Pilih Template Demo Presentasi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono font-bold">
                  {PRESENTATION_DEMOS.length} Kasus Siap Pakai
                </span>
              </h2>
              <p className="text-[11px] text-text-dim">Klik template untuk auto-generate prompt Canva, Gamma, AI &amp; VBA Macro.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-text transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Cards Grid */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESENTATION_DEMOS.map((demo, idx) => {
              const isSelected = currentTopic === demo.topic;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onPick(demo);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-accent/15 border-accent shadow-sm ring-1 ring-accent/40'
                      : 'bg-bg-panel hover:bg-bg-elev border-border hover:border-accent/50'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Tag & Slide Count */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-accent bg-accent/15 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <span>{demo.tag}</span>
                      </span>
                      <span className="text-[10px] mono text-text-dim font-bold bg-bg-deep px-2 py-0.5 rounded border border-border">
                        {demo.slideCount} Slide • {demo.duration}
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-sm font-black text-text group-hover:text-accent transition leading-snug">
                      {demo.topic}
                    </h3>

                    {/* Audience & Key Focus */}
                    <p className="text-[11px] text-text-mut line-clamp-2 leading-relaxed">
                      Target: <span className="text-text font-semibold">{demo.audience}</span>
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] mono text-text-dim">{demo.type}</span>
                    <span className="font-extrabold text-accent flex items-center gap-1 group-hover:translate-x-1 transition text-[11px]">
                      <span>{isSelected ? 'Sedang Digunakan' : 'Pakai Template Ini'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer info */}
        <div className="px-4 sm:px-6 py-3 border-t border-border bg-bg-panel text-[11px] text-text-dim flex items-center justify-between">
          <span>Prinsip: 1 Slide 1 Pesan • Desain 5-5-5 • Canva &amp; Gamma Ready</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-bg-elev hover:bg-bg-deep text-text text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
