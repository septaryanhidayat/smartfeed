import { useState, useEffect, useRef } from 'react';
import {
  Code2, Sparkles, Clock, Terminal, Cpu, Zap, Wand2, RefreshCw
} from 'lucide-react';
import CopyButton from './CopyButton.jsx';
import HistoryPanel from './HistoryPanel.jsx';
import { AI_ENGINES, formatPromptForEngine } from '../utils/enginePromptFormatters.js';

const ENGINE_ICONS = {
  Sparkles, Cpu, Zap, Wand2
};

/**
 * Always-visible prompt output panel.
 * Features:
 * - Engine Switcher (ChatGPT, Gemini, Grok, Leonardo.ai)
 * - Realtime Streaming Reveal Animation
 * - 1-Click Copy Prompt & Direct Launcher to Web AI
 */
export default function PromptPanel({
  mode,
  promptText,        // string OR { json, sections } (Typography)
  state = {},        // active mode form state
  onGenerate,        // saves to history (called once when Generate clicked)
  onRestoreHistory,
  onCopied,          // fires when main Copy Prompt button is clicked
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

  const streamTimer = useRef(null);
  const prevModeRef = useRef(mode);
  const prevRestoreRef = useRef(restoreSignal);

  // Reset only if mode changes WITHOUT a restore signal bump
  useEffect(() => {
    const isRestore = restoreSignal !== prevRestoreRef.current;
    if (mode !== prevModeRef.current && !isRestore) {
      setActiveTab('all');
      setHasGenerated(false);
      setStreaming(false);
      setStreamedText('');
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
            <div className="text-sm font-semibold truncate">Output Prompt</div>
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

        <button onClick={() => setShowHistory((s) => !s)} className="btn-ghost !py-1.5 !px-2.5 text-xs" title="Riwayat">
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
          <pre className="codeblock flex-1 overflow-auto m-3 mb-2 !p-3 text-[11px] whitespace-pre-wrap">
            {renderText}
            {streaming && <span className="text-accent animate-pulse">█</span>}
          </pre>
        )}
      </div>

      {/* Footer actions */}
      {!showHistory && (
        <div className="px-3 py-3 border-t border-border bg-bg-elev/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-[10px] mono text-text-dim uppercase tracking-widest self-start sm:self-auto">
            {hasGenerated
              ? `${charCount.toLocaleString()} chars · ${lineCount} lines${streaming ? ' · streaming...' : ''}`
              : 'idle · klik Build Prompt'}
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

            {/* Main Copy Prompt & Open AI Button */}
            <CopyButton
              getText={() => renderText}
              label={`Copy Prompt (${selectedEngine.toUpperCase()})`}
              primary={true}
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
        <span className="text-accent">›</span> klik tombol <span className="text-text font-bold">Build Prompt</span> untuk merakit prompt
      </div>
      <div className="text-text-dim mt-1 flex items-center gap-1">
        <span className="text-accent">›</span> awaiting input
        <span className="ml-1 inline-block w-2 h-3.5 bg-accent animate-pulse" />
      </div>
      <div className="flex-1" />
      <div className="text-[10px] text-text-dim mt-2 opacity-60 mono uppercase tracking-widest">
        prompt siap salin akan muncul di sini
      </div>
    </div>
  );
}
