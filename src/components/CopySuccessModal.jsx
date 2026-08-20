import { useState } from 'react';
import { Check, ExternalLink, ImagePlus, Upload, Send, Sparkles, Clipboard, X, Layers, Cpu, Palette, Zap, Wand2, Code2 } from 'lucide-react';
import { CONFIG } from '../config.js';

export const AI_DESTINATIONS = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: CONFIG.chatgptUrl || 'https://chatgpt.com/',
    openLabel: 'Buka ChatGPT',
    color: '#10a37f',
    icon: Sparkles,
    actionDesc: 'Aktifkan mode <strong class="text-text">image generation</strong> di ChatGPT (icon gambar).',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    url: 'https://gemini.google.com/',
    openLabel: 'Buka Gemini',
    color: '#3b82f6',
    icon: Cpu,
    actionDesc: 'Paste prompt ke <strong class="text-text">Google Gemini</strong> untuk render visual dengan Imagen 3.',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    openLabel: 'Buka DeepSeek',
    color: '#6366f1',
    icon: Code2,
    actionDesc: 'Paste prompt ke <strong class="text-text">DeepSeek</strong> untuk analisis & eksekusi prompt visual.',
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com/imagine',
    openLabel: 'Buka Midjourney',
    color: '#ec4899',
    icon: Palette,
    actionDesc: 'Ketik <strong class="text-text">/imagine</strong> lalu paste prompt di Discord atau Web Midjourney.',
  },
  grok: {
    id: 'grok',
    name: 'Grok 2',
    url: 'https://grok.com/',
    openLabel: 'Buka Grok 2',
    color: '#f59e0b',
    icon: Zap,
    actionDesc: 'Paste prompt ke <strong class="text-text">Grok 2</strong> untuk generate gambar dengan Flux.1.',
  },
  leonardo: {
    id: 'leonardo',
    name: 'Leonardo.ai',
    url: 'https://app.leonardo.ai/',
    openLabel: 'Buka Leonardo.ai',
    color: '#8b5cf6',
    icon: Wand2,
    actionDesc: 'Paste prompt ke kolom <strong class="text-text">Prompt Generation</strong> di Leonardo.ai.',
  },
};

export default function CopySuccessModal({ open, onClose, kind = 'image', engine = 'chatgpt' }) {
  if (!open) return null;

  // Fallback to saved engine in localStorage if not passed
  const activeEngineKey = engine || (() => {
    try { return localStorage.getItem('af_selected_ai_engine') || 'chatgpt'; } catch { return 'chatgpt'; }
  })();

  const dest = AI_DESTINATIONS[activeEngineKey] || AI_DESTINATIONS.chatgpt;
  const isCopy = kind === 'copy';
  const isCarousel = kind === 'carousel';

  const steps = isCarousel ? STEPS_CAROUSEL : isCopy ? STEPS_COPY : STEPS_IMAGE;
  const title = isCarousel
    ? 'Prompt carousel siap dieksekusi'
    : isCopy
      ? 'Prompt copywriting siap pakai'
      : `Prompt visual siap dieksekusi (${dest.name})`;

  const detailLines = isCarousel
    ? [
        `Klik tombol <strong class="text-text">${dest.openLabel}</strong> di kanan bawah.`,
        dest.actionDesc,
        `<strong class="text-text">Prompt 1:</strong> upload gambar utama / produk asli, lalu <kbd class="px-1 py-0.5 rounded bg-bg-deep border border-border mono text-[10px]">Ctrl+V</kbd> & kirim.`,
        `<strong class="text-text">Prompt 2 dan seterusnya:</strong> upload gambar <strong class="text-text">hasil slide sebelumnya</strong>, lalu paste prompt slide itu & kirim.`,
        `Ulangi tiap slide berurutan sampai carousel lengkap jadi satu kesatuan.`,
      ]
    : isCopy
      ? [
          `Klik tombol <strong class="text-text">${dest.openLabel}</strong> di kanan bawah.`,
          `Tekan <kbd class="px-1 py-0.5 rounded bg-bg-deep border border-border mono text-[10px]">Ctrl+V</kbd>, prompt copywriting sudah otomatis tersalin.`,
          `Kirim, kamu akan dapat puluhan variasi copy siap A/B test.`,
        ]
      : [
          `Klik tombol <strong class="text-text">${dest.openLabel}</strong> di kanan bawah.`,
          dest.actionDesc,
          `Upload foto produk / referensi yang ingin diolah AI (jika ada).`,
          `Tekan <kbd class="px-1 py-0.5 rounded bg-bg-deep border border-border mono text-[10px]">Ctrl+V</kbd>, prompt sudah otomatis tersalin.`,
          `Kirim pesan, biarkan ${dest.name} render desainmu.`,
        ];

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center px-4 sm:px-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 24px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px var(--border)' }}
      >
        {/* Top bar: status + close */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-border bg-bg-elev/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-70" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-text">
                {title}
              </div>
              <div className="text-[10px] uppercase tracking-widest mono text-text-dim">
                copied to clipboard · siap dipaste ke {dest.name}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-bg-elev flex items-center justify-center text-text-mut">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal step strip */}
        <div className="px-5 pt-5 pb-2">
          <div className={`grid gap-2 grid-cols-2 ${steps.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative">
                  <div className="surface-elev p-3 text-center h-full flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-accent-sm border border-accent/30 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-[9px] mono uppercase tracking-widest text-text-dim">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] font-semibold leading-tight mt-0.5">{s.label}</div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-1.5 -translate-y-1/2 z-10">
                      <svg className="w-3 h-3 text-accent/50" viewBox="0 0 12 12" fill="none">
                        <path d="M3 1L9 6L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="px-5 py-4 mx-5 mb-3 mt-2 surface-elev">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-accent text-[10px]">▸</span>
            <span className="text-[10px] mono uppercase tracking-widest text-text">Alur Eksekusi ({dest.name})</span>
          </div>
          <ol className="space-y-1.5 text-xs text-text-mut">
            {detailLines.map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mono text-text-dim shrink-0 w-4">{i + 1}.</span>
                <span dangerouslySetInnerHTML={{ __html: line }} />
              </li>
            ))}
          </ol>
        </div>

        {/* Quick links to other AIs */}
        <div className="px-5 pb-3">
          <div className="text-[9px] mono uppercase tracking-widest text-text-dim mb-1.5 font-semibold">
            Buka di Tool AI Lainnya:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(AI_DESTINATIONS).map((ai) => {
              const isCurrent = ai.id === activeEngineKey;
              return (
                <a
                  key={ai.id}
                  href={ai.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[10px] px-2 py-1 rounded-md border transition flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-accent/15 border-accent text-accent font-bold'
                      : 'border-border/60 text-text-mut hover:text-text hover:bg-bg-elev'
                  }`}
                >
                  <span>{ai.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-border bg-bg-deep/40 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-[10px] mono uppercase tracking-widest text-text-mut hover:text-text transition self-center sm:self-auto"
          >
            Selesai
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={dest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2.5 !px-5 flex-1 sm:flex-none justify-center whitespace-nowrap shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
            >
              {dest.openLabel} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Step definitions ──────────── */

const STEPS_IMAGE = [
  { icon: ExternalLink, label: 'Buka AI' },
  { icon: ImagePlus,    label: 'Mode Visual' },
  { icon: Upload,       label: 'Upload / Input' },
  { icon: Send,         label: 'Eksekusi' },
];

const STEPS_COPY = [
  { icon: ExternalLink, label: 'Buka AI' },
  { icon: Clipboard,    label: 'Paste' },
  { icon: Sparkles,     label: 'Generate' },
];

const STEPS_CAROUSEL = [
  { icon: ExternalLink, label: 'Buka AI' },
  { icon: ImagePlus,    label: 'Mode Visual' },
  { icon: Upload,       label: 'Slide 1: Produk' },
  { icon: Layers,       label: 'Slide 2+: Hasil' },
];
