import { useState, useEffect, useRef } from 'react';
import { Code2, Sparkles, Clock, Terminal, Upload, Layers, Cpu, Zap, Wand2 } from 'lucide-react';
import CopyButton from './CopyButton.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import { AI_ENGINES, formatPromptForEngine } from '../utils/enginePromptFormatters.js';

const ENGINE_ICONS = {
  Sparkles, Cpu, Zap, Wand2
};

/**
 * Output panel khusus Carousel Feeds.
 * Menampilkan list prompt per slide + tombol Copy per prompt + Copy All.
 * Mendukung AI Engine Switcher (ChatGPT, Gemini, Grok, Leonardo).
 */
export default function CarouselOutput({
  slides,           // array hasil generateCarouselPrompts()
  onGenerate,       // simpan ke history
  onRestoreHistory, // restore entri history (bisa pindah mode)
  onCopied,
  restoreSignal = 0,
  autoShow = false, // true saat panel di-mount akibat restore lintas-mode
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(autoShow);
  const [selectedEngine, setSelectedEngine] = useState(() => {
    try { return localStorage.getItem('af_selected_ai_engine') || 'chatgpt'; } catch { return 'chatgpt'; }
  });

  const handleSelectEngine = (engineId) => {
    setSelectedEngine(engineId);
    try { localStorage.setItem('af_selected_ai_engine', engineId); } catch {}
  };

  const prevRestoreRef = useRef(restoreSignal);

  // Auto-show saat restore dari history
  useEffect(() => {
    if (restoreSignal === 0 || restoreSignal === prevRestoreRef.current) return;
    prevRestoreRef.current = restoreSignal;
    setShowHistory(false);
    setHasGenerated(true);
  }, [restoreSignal]);

  const list = Array.isArray(slides) ? slides : [];
  const total = list.length;

  const formattedSlides = list.map((s) => ({
    ...s,
    formattedPrompt: formatPromptForEngine(s.prompt, selectedEngine, 'carousel', { ratio: '1:1', title: s.slideTitle }),
  }));

  const allText = formattedSlides
    .map((s) => `=== ${s.slideTitle} | Layout: ${s.layout} ===\n${s.formattedPrompt}`)
    .join('\n\n\n');

  const handleGenerate = () => {
    setHasGenerated(true);
    if (typeof onGenerate === 'function') onGenerate();
  };

  return (
    <div className="surface overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-bg-elev/40 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-accent-sm flex items-center justify-center shrink-0">
            <Code2 className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold truncate">Output Prompt Carousel</div>
            <div className="text-[10px] text-text-dim mono uppercase tracking-widest">
              {total} slide · 1 prompt / slide
            </div>
          </div>
        </div>
        <button onClick={() => setShowHistory((s) => !s)} className="btn-ghost" title="Riwayat">
          <Clock className="w-3.5 h-3.5" /> {showHistory ? 'Tutup' : 'Riwayat'}
        </button>
      </div>

      {/* AI Engine Selector Bar */}
      {!showHistory && (
        <div className="px-3 py-2 border-b border-border bg-bg-elev/20 overflow-x-auto hide-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[9px] mono uppercase tracking-wider text-text-dim mr-1 font-semibold">Engine AI:</span>
            {AI_ENGINES.map((eng) => {
              const Icon = ENGINE_ICONS[eng.icon] || Sparkles;
              const active = selectedEngine === eng.id;
              return (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => handleSelectEngine(eng.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition whitespace-nowrap ${
                    active
                      ? 'bg-accent text-white shadow-sm font-bold'
                      : 'text-text-mut hover:text-text hover:bg-bg-elev border border-border/60'
                  }`}
                >
                  <Icon className="w-3 h-3" style={{ color: active ? '#ffffff' : eng.color }} />
                  <span>{eng.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-3">
            <HistoryPanel onRestore={onRestoreHistory} onClose={() => setShowHistory(false)} />
          </div>
        ) : !hasGenerated ? (
          <EmptyTerminal total={total} />
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Instruksi upload */}
            <div className="rounded-lg border border-accent/30 bg-accent-sm/60 p-3 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-accent font-semibold uppercase tracking-widest text-[10px] mono mb-1.5">
                <Upload className="w-3 h-3" /> Cara Pakai ({selectedEngine.toUpperCase()})
              </div>
              <p className="text-text">
                <strong>Prompt 1:</strong> upload gambar utama / produk asli.
                <br />
                <strong>Prompt 2 dan seterusnya:</strong> upload gambar hasil slide sebelumnya.
              </p>
            </div>

            {/* List prompt per slide */}
            {formattedSlides.map((s) => (
              <div key={s.slideNumber} className="rounded-lg border border-border bg-bg-deep/40 overflow-hidden">
                <div className="px-3 py-2 border-b border-border bg-bg-elev/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-accent text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {s.slideNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{s.slideTitle}</div>
                      <div className="text-[10px] text-text-dim mono uppercase tracking-widest flex items-center gap-1 truncate">
                        <Layers className="w-2.5 h-2.5 shrink-0" /> {s.layout}
                      </div>
                    </div>
                  </div>
                  <CopyButton
                    getText={() => s.formattedPrompt}
                    label="Copy"
                    size="xs"
                    onCopied={onCopied ? () => onCopied(selectedEngine) : undefined}
                  />
                </div>
                <pre className="codeblock !rounded-none !border-0 max-h-64 overflow-auto !p-3 text-[11px] whitespace-pre-wrap">
                  {s.formattedPrompt}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      {!showHistory && (
        <div className="px-3 py-3 border-t border-border bg-bg-elev/40 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[10px] mono text-text-dim uppercase tracking-widest">
            {hasGenerated ? `${total} prompt siap` : 'idle — klik Generate'}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleGenerate} className="btn-primary !py-2 !px-3 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> {hasGenerated ? 'Regenerate' : 'Generate'}
            </button>
            <CopyButton
              getText={() => allText}
              label="Copy All"
              primary={false}
              onCopied={hasGenerated && onCopied ? () => onCopied(selectedEngine) : undefined}
              className={hasGenerated ? '' : 'opacity-50 pointer-events-none'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyTerminal({ total }) {
  return (
    <div className="codeblock flex-1 m-3 mb-2 !p-4 flex flex-col text-xs font-mono leading-relaxed">
      <div className="text-accent flex items-center gap-2 mb-3">
        <Terminal className="w-3.5 h-3.5" />
        <span className="text-text-dim uppercase tracking-widest text-[10px]">carousel terminal · idle</span>
      </div>
      <div className="text-text-mut">$ feeds build --mode=carousel</div>
      <div className="text-text-dim mt-2">▸ template     : <span className="text-accent">connected</span></div>
      <div className="text-text-dim">▸ total slides : <span className="text-accent">{total}</span></div>
      <div className="text-text-dim">▸ story flow   : <span className="text-accent">ready</span></div>
      <div className="text-text-dim">▸ output       : <span className="text-text-dim">awaiting trigger</span></div>
      <div className="text-text-dim mt-4">
        <span className="text-accent">›</span> klik tombol <span className="text-text">Generate</span> untuk build {total} prompt slide
      </div>
      <div className="flex-1" />
      <div className="text-[10px] text-text-dim mt-2 opacity-60 mono uppercase tracking-widest">
        — prompt per slide akan muncul di sini setelah Generate —
      </div>
    </div>
  );
}
