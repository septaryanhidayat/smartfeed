import { useState, useEffect, useRef } from 'react';
import {
  Code2, Sparkles, Clock, Terminal, Cpu, Zap, Wand2, Key, Check,
  Download, RefreshCw, AlertCircle, ExternalLink, ImageIcon, Layers
} from 'lucide-react';
import CopyButton from './CopyButton.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import { AI_ENGINES, formatPromptForEngine } from '../utils/enginePromptFormatters.js';
import { isEngineSynced, executeDirectAiGeneration } from '../utils/directAiGenerators.js';
import { showAlert } from '../utils/alerts.js';

const ENGINE_ICONS = {
  Sparkles, Cpu, Zap, Wand2
};

/**
 * Always-visible prompt output panel.
 * Features:
 * - Engine Switcher (ChatGPT, Gemini, Grok, Leonardo)
 * - AI Account Sync Status (Connected / Disconnected)
 * - Direct In-App Image Generation (Render inside app without leaving)
 * - Manual Copy Prompt & Open AI Fallback
 */
export default function PromptPanel({
  mode,
  promptText,        // string OR { json, sections } (Typography)
  state = {},        // active mode form state
  onGenerate,        // saves to history (called once when Generate clicked)
  onRestoreHistory,
  onCopied,          // fires when main Copy Prompt button is clicked
  onOpenAiIntegration, // open modal to connect API keys
  restoreSignal = 0,
  autoShow = false,
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEngine, setSelectedEngine] = useState(() => {
    try {
      return localStorage.getItem('af_selected_ai_engine') || 'chatgpt';
    } catch {
      return 'chatgpt';
    }
  });

  const handleSelectEngine = (engineId) => {
    setSelectedEngine(engineId);
    try {
      localStorage.setItem('af_selected_ai_engine', engineId);
    } catch {}
  };

  const [hasGenerated, setHasGenerated] = useState(autoShow);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  
  // Direct Generation State
  const [directGenerating, setDirectGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [directError, setDirectError] = useState(null);

  const streamTimer = useRef(null);
  const prevModeRef = useRef(mode);
  const prevRestoreRef = useRef(restoreSignal);

  const isConnected = isEngineSynced(selectedEngine);

  // Reset only if mode changes WITHOUT a restore signal bump
  useEffect(() => {
    const isRestore = restoreSignal !== prevRestoreRef.current;
    if (mode !== prevModeRef.current && !isRestore) {
      setActiveTab('all');
      setHasGenerated(false);
      setStreaming(false);
      setStreamedText('');
      setGeneratedResult(null);
      setDirectError(null);
      if (streamTimer.current) { clearTimeout(streamTimer.current); streamTimer.current = null; }
    }
    prevModeRef.current = mode;
  }, [mode, restoreSignal]);

  // On history restore: auto-show full prompt
  useEffect(() => {
    if (restoreSignal === 0 || restoreSignal === prevRestoreRef.current) return;
    prevRestoreRef.current = restoreSignal;
    if (streamTimer.current) { clearTimeout(streamTimer.current); streamTimer.current = null; }
    setActiveTab('all');
    setShowHistory(false);
    setStreaming(false);
    setStreamedText('');
    setHasGenerated(true);
  }, [restoreSignal]);

  useEffect(() => () => { if (streamTimer.current) clearTimeout(streamTimer.current); }, []);

  // Normalize prompt
  let fullText = '';
  let sections = null;
  if (mode === 'typography' && promptText && typeof promptText === 'object' && promptText.sections) {
    fullText = JSON.stringify(promptText.json, null, 2);
    sections = promptText.sections;
  } else if (typeof promptText === 'object' && promptText !== null) {
    if (promptText.raw) {
      fullText = formatPromptForEngine(promptText.raw, selectedEngine, mode, state);
    } else {
      fullText = JSON.stringify(promptText, null, 2);
    }
  } else {
    fullText = formatPromptForEngine(String(promptText || ''), selectedEngine, mode, state);
  }

  // What the active tab WOULD display (when not streaming)
  let liveDisplay = fullText;
  if (sections && activeTab !== 'all') {
    const sec = sections.find((s) => s.key === activeTab);
    if (sec) liveDisplay = sec.text;
  }

  // What to actually render right now
  const renderText = !hasGenerated ? '' : streaming ? streamedText : liveDisplay;

  const handleGenerate = () => {
    if (streamTimer.current) { clearTimeout(streamTimer.current); streamTimer.current = null; }
    setHasGenerated(true);
    setStreaming(true);
    setStreamedText('');
    setGeneratedResult(null);
    setDirectError(null);

    const target = liveDisplay;
    const CHUNK = Math.max(32, Math.floor(target.length / 50));
    let pos = 0;
    const step = () => {
      pos = Math.min(target.length, pos + CHUNK);
      setStreamedText(target.slice(0, pos));
      if (pos < target.length) {
        streamTimer.current = setTimeout(step, 16);
      } else {
        setStreaming(false);
        streamTimer.current = null;
      }
    };
    step();
    if (typeof onGenerate === 'function') onGenerate();
  };

  // Direct In-App Generation execution
  const handleDirectExecute = async () => {
    if (!isConnected) {
      if (typeof onOpenAiIntegration === 'function') onOpenAiIntegration();
      return;
    }

    setDirectGenerating(true);
    setDirectError(null);
    setGeneratedResult(null);

    const res = await executeDirectAiGeneration(selectedEngine, liveDisplay, {
      ratio: state.aspectRatio || state.ratio || '1:1',
    });

    setDirectGenerating(false);

    if (res.ok) {
      setGeneratedResult(res);
      showAlert({
        title: 'Gambar Berhasil Dibuat!',
        text: `Gambar berhasil dirender langsung oleh ${res.engine || 'AI'}.`,
        icon: 'success',
      });
    } else {
      setDirectError(res.error);
      showAlert({
        title: 'Gagal Generate Gambar',
        text: res.error || 'Terjadi kesalahan saat memanggil API AI.',
        icon: 'error',
      });
    }
  };

  const charCount = renderText.length;
  const lineCount = renderText ? renderText.split('\n').length : 0;
  const canCopy = hasGenerated && !streaming;

  return (
    <div className="surface overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-bg-elev/40 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-accent-sm flex items-center justify-center shrink-0">
            <Code2 className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold truncate">Output Prompt & AI Studio</div>
            <div className="text-[10px] text-text-dim mono uppercase tracking-widest">
              {mode === 'banner'
                ? 'JSON Banner'
                : mode === 'thumbnail'
                ? 'Text Brief'
                : mode === 'typography'
                ? 'JSON + 8 Sections'
                : mode === 'menufb'
                ? 'JSON Menu F&B'
                : mode === 'facecard'
                ? 'Face Card Brief'
                : mode === 'gridfeed'
                ? 'Brief 9 Feed'
                : 'Copy Brief'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiIntegration && onOpenAiIntegration()}
            className="btn-ghost !py-1.5 !px-2.5 text-xs text-text-mut hover:text-accent flex items-center gap-1.5"
            title="Kelola Akun AI & API Key"
          >
            <Key className="w-3 h-3" />
            <span className="hidden sm:inline">Koneksi AI</span>
          </button>

          <button onClick={() => setShowHistory((s) => !s)} className="btn-ghost !py-1.5 !px-2.5 text-xs" title="Riwayat">
            <Clock className="w-3.5 h-3.5" /> {showHistory ? 'Tutup' : 'Riwayat'}
          </button>
        </div>
      </div>

      {/* AI Engine Selector Bar */}
      {!showHistory && (
        <div className="px-3 py-2 border-b border-border bg-bg-elev/20 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar min-w-max">
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

          {/* Connection Status Sub-bar */}
          <div className="flex items-center justify-between text-[10px] px-1 pt-0.5">
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Akun {selectedEngine.toUpperCase()} terhubung (Bisa Generate Langsung)
                </span>
              ) : (
                <span className="text-text-dim flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-dim/50" />
                  Akun {selectedEngine.toUpperCase()} belum disinkronkan
                </span>
              )}
            </div>

            <button
              onClick={() => onOpenAiIntegration && onOpenAiIntegration()}
              className="text-accent hover:underline font-semibold"
            >
              {isConnected ? 'Kelola Key' : '+ Hubungkan API Key'}
            </button>
          </div>
        </div>
      )}

      {/* Section tabs (Typography only) */}
      {sections && !showHistory && (
        <div className="px-3 py-2 border-b border-border overflow-x-auto hide-scrollbar shrink-0">
          <div className="flex gap-1 min-w-max">
            <SectionTab active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="ALL JSON" />
            {sections.map((s) => (
              <SectionTab
                key={s.key}
                active={activeTab === s.key}
                onClick={() => setActiveTab(s.key)}
                label={s.label}
              />
            ))}
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
          <EmptyTerminal mode={mode} />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col p-3 space-y-3">
            {/* Generated In-App Result Card (if available) */}
            {generatedResult?.imageUrl && (
              <div className="rounded-xl border border-accent/40 bg-accent-sm/30 p-3 animate-fade-in space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Hasil Generate {generatedResult.engine}</span>
                  </div>
                  <a
                    href={generatedResult.imageUrl}
                    download="smartfeed-ai-render.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary !py-1 !px-2.5 text-[10px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Unduh Gambar
                  </a>
                </div>

                <div className="rounded-lg overflow-hidden border border-border bg-black/60 aspect-square max-h-[340px] flex items-center justify-center">
                  <img
                    src={generatedResult.imageUrl}
                    alt="AI Generated"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Direct Generation Error Banner */}
            {directError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Gagal Generate:</strong> {directError}
                </div>
              </div>
            )}

            {/* Prompt Codeblock */}
            <div className="flex-1 flex flex-col min-h-[160px]">
              <div className="flex items-center justify-between text-[10px] text-text-dim mono uppercase tracking-wider mb-1 px-1">
                <span>Prompt Brief ({selectedEngine.toUpperCase()})</span>
                <span>Siap dieksekusi</span>
              </div>
              <pre className="codeblock flex-1 overflow-auto !p-3 text-[11px] whitespace-pre-wrap">
                {renderText}
                {streaming && <span className="text-accent animate-pulse">█</span>}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {!showHistory && (
        <div className="px-3 py-3 border-t border-border bg-bg-elev/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-[10px] mono text-text-dim uppercase tracking-widest self-start sm:self-auto">
            {hasGenerated
              ? `${charCount.toLocaleString()} chars · ${lineCount} lines${streaming ? ' · streaming...' : ''}`
              : 'idle · klik Generate'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleGenerate}
              className="btn-ghost !py-2 !px-3 text-xs"
              disabled={streaming}
            >
              <RefreshCw className={`w-3 h-3 ${streaming ? 'animate-spin' : ''}`} />
              <span>{hasGenerated ? 'Rebuild' : 'Build Prompt'}</span>
            </button>

            {/* In-App Direct Generation Button (If API Connected) */}
            {isConnected ? (
              <button
                onClick={handleDirectExecute}
                disabled={!hasGenerated || streaming || directGenerating}
                className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(var(--accent-rgb),0.35)]"
                title={`Generate langsung dengan API ${selectedEngine}`}
              >
                {directGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate di Sini</span>
                  </>
                )}
              </button>
            ) : null}

            {/* Manual Copy Prompt Button */}
            <CopyButton
              getText={() => renderText}
              label="Copy Prompt"
              primary={!isConnected}
              onCopied={canCopy && onCopied ? () => onCopied(selectedEngine) : undefined}
              className={canCopy ? '' : 'opacity-50 pointer-events-none'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="tab !px-3 !py-1.5 !text-[10px] mono uppercase tracking-widest whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function EmptyTerminal({ mode }) {
  const MODE_LINE = {
    banner:      '$ feeds build --mode=banner',
    thumbnail:   '$ feeds build --mode=youtube',
    typography:  '$ feeds build --mode=ads',
    copywriting: '$ feeds build --mode=copy',
    facecard:    '$ feeds build --mode=facecard',
    menufb:      '$ feeds build --mode=menufb',
    gridfeed:    '$ feeds build --mode=gridfeed',
    logoaffiliate:       '$ feeds build --mode=logo',
    tryonaffiliate:      '$ feeds build --mode=tryon',
    reviewaffiliate:     '$ feeds build --mode=review',
    storyboardaffiliate: '$ feeds build --mode=storyboard',
    newscard:    '$ feeds build --mode=newscard',
    quotecard:   '$ feeds build --mode=quotecard',
    factcheck:   '$ feeds build --mode=factcheck',
  };
  return (
    <div className="codeblock flex-1 m-3 mb-2 !p-4 flex flex-col text-xs font-mono leading-relaxed">
      <div className="text-accent flex items-center gap-2 mb-3">
        <Terminal className="w-3.5 h-3.5" />
        <span className="text-text-dim uppercase tracking-widest text-[10px]">prompt terminal · idle</span>
      </div>
      <div className="text-text-mut">{MODE_LINE[mode] || '$ feeds build'}</div>
      <div className="text-text-dim mt-2">▸ form input  : <span className="text-accent">connected</span></div>
      <div className="text-text-dim">▸ template     : <span className="text-accent">ready</span></div>
      <div className="text-text-dim">▸ ai engine    : <span className="text-accent">connected</span></div>
      <div className="text-text-dim">▸ output       : <span className="text-text-dim">awaiting trigger</span></div>
      <div className="text-text-dim mt-4">
        <span className="text-accent">›</span> klik tombol <span className="text-text font-bold">Build Prompt</span> atau <span className="text-text font-bold">Generate di Sini</span>
      </div>
      <div className="text-text-dim mt-1 flex items-center gap-1">
        <span className="text-accent">›</span> awaiting input
        <span className="ml-1 inline-block w-2 h-3.5 bg-accent animate-pulse" />
      </div>
      <div className="flex-1" />
      <div className="text-[10px] text-text-dim mt-2 opacity-60 mono uppercase tracking-widest">
        prompt & hasil render akan muncul di sini
      </div>
    </div>
  );
}
