import { useState, useMemo } from 'react';
import {
  Presentation, Sparkles, LayoutTemplate, Layers, Palette, Users, BookOpen,
  ChevronLeft, ChevronRight, Copy, Check, Download, Wand2, Mic, Eye, FileText, MonitorPlay
} from 'lucide-react';
import {
  PRESENTATION_USE_CASES,
  PRESENTATION_STYLES,
  PRESENTATION_DEMOS
} from '../data/presentationOptions.js';
import { buildPresentation } from '../prompts/buildPresentation.js';

export default function PresentationMode({ state, onChangeField, onSetState }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  const {
    topic = '',
    presenter = '',
    audience = '',
    useCase = 'pitch_deck',
    style = 'dark_tech',
    slideCount = 8,
    keyPoints = '',
    includeSpeakerNotes = true,
    includeVisualPrompts = true,
  } = state || {};

  const result = useMemo(() => {
    return buildPresentation(state);
  }, [state]);

  const { slides, styleObj, useCaseObj, masterPrompt } = result;

  const currentSlide = slides[activeSlideIndex] || slides[0] || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([masterPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Slide-Deck-${(topic || 'presentation').replace(/\s+/g, '-').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadDemo = (demo) => {
    if (onSetState) {
      onSetState(demo);
      setActiveSlideIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Demo Selector Bar */}
      <div className="surface p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-border">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold">
            <Presentation className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs font-bold text-text flex items-center gap-1.5">
              <span>Preset Presentasi Siap Pakai</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/20 text-accent font-bold mono">M20</span>
            </div>
            <div className="text-[10px] text-text-dim">Pilih template topik untuk memulai instan</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESENTATION_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadDemo(demo)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text-mut hover:text-text transition flex items-center gap-1.5"
            >
              <Wand2 className="w-3 h-3 text-accent" />
              <span>{demo.topic.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Form (Left) + Slide Deck Live Canvas (Right) */}
      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="space-y-4">
          <div className="surface p-5 rounded-xl border border-border space-y-4">
            <div className="text-xs font-bold text-text flex items-center gap-2 border-b border-border pb-2.5">
              <LayoutTemplate className="w-4 h-4 text-accent" />
              <span>Parameter & Konten Slide</span>
            </div>

            {/* Topik / Judul */}
            <div>
              <label className="block text-xs font-bold text-text mb-1">
                Topik / Judul Presentasi *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => onChangeField('topic', e.target.value)}
                placeholder="Contoh: Pitch Deck SmartFeed AI 2026..."
                className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
              />
            </div>

            {/* Kategori Presentasi */}
            <div>
              <label className="block text-xs font-bold text-text mb-1">
                Kategori Kebutuhan Presentasi
              </label>
              <select
                value={useCase}
                onChange={(e) => onChangeField('useCase', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
              >
                {PRESENTATION_USE_CASES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Presenter & Audiens */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Nama Presenter / Brand
                </label>
                <input
                  type="text"
                  value={presenter}
                  onChange={(e) => onChangeField('presenter', e.target.value)}
                  placeholder="Contoh: Beranda Digital"
                  className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  Target Audiens
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => onChangeField('audience', e.target.value)}
                  placeholder="Contoh: Investor / Klien / Mahasiswa"
                  className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Tema Visual & Jumlah Slide */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text mb-1 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-accent" />
                  Tema & Gaya Desain
                </label>
                <select
                  value={style}
                  onChange={(e) => onChangeField('style', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                >
                  {PRESENTATION_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  Jumlah Slide
                </label>
                <select
                  value={slideCount}
                  onChange={(e) => onChangeField('slideCount', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                >
                  <option value={5}>5 Slide (Quick Pitch)</option>
                  <option value={7}>7 Slide (Standard Deck)</option>
                  <option value={8}>8 Slide (Comprehensive)</option>
                  <option value={10}>10 Slide (Webinar / Report)</option>
                  <option value={12}>12 Slide (Master Proposal)</option>
                </select>
              </div>
            </div>

            {/* Poin Kunci / Outline Materi */}
            <div>
              <label className="block text-xs font-bold text-text mb-1">
                Poin Kunci / Pesan Utama yang Mau Disampaikan
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => onChangeField('keyPoints', e.target.value)}
                rows={3}
                placeholder="Tuliskan data penting, target pertumbuhan, kendala, solusi khusus, atau poin wajib..."
                className="w-full px-3 py-2 rounded-lg bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none resize-y"
              />
            </div>

            {/* Checkbox Options */}
            <div className="pt-2 border-t border-border flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-text-mut hover:text-text">
                <input
                  type="checkbox"
                  checked={includeSpeakerNotes}
                  onChange={(e) => onChangeField('includeSpeakerNotes', e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Sertakan Speaker Notes (Catatan Presenter)</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-text-mut hover:text-text">
                <input
                  type="checkbox"
                  checked={includeVisualPrompts}
                  onChange={(e) => onChangeField('includeVisualPrompts', e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span>Sertakan AI Visual Prompts per slide</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live 16:9 Slide Canvas & Navigator */}
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="surface p-3 rounded-xl border border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-text">Slide Canvas 16:9</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                {activeSlideIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent-h transition flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Copy Master Prompt'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text-mut hover:text-text transition flex items-center gap-1.5"
                title="Download Slide Deck Outline (.md)"
              >
                <Download className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Download Outline</span>
              </button>
            </div>
          </div>

          {/* Interactive Slide Thumbnail Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  activeSlideIndex === idx
                    ? 'bg-accent text-white border-accent shadow-sm'
                    : 'bg-bg-panel text-text-mut hover:text-text border-border hover:bg-bg-elev'
                }`}
              >
                Slide {s.slideNo}
              </button>
            ))}
          </div>

          {/* 16:9 Widescreen Slide Mockup Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/80 flex flex-col justify-between p-6 sm:p-8 transition-all duration-300"
            style={{
              backgroundColor: styleObj.bg,
              color: styleObj.text,
            }}
          >
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span
                  className="text-[9px] sm:text-[10px] mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: `${styleObj.accent}20`,
                    color: styleObj.accent,
                    border: `1px solid ${styleObj.accent}40`,
                  }}
                >
                  {currentSlide.type}
                </span>
                <span className="text-[10px] mono opacity-60">
                  {presenter || 'SmartFeed Deck'} · 16:9 HD
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black leading-tight tracking-tight mt-2">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1 font-medium">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Slide Body Bullets / Cards */}
            <div className="my-auto py-2 space-y-2 sm:space-y-2.5">
              {currentSlide.bullets?.map((bullet, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-start gap-2.5 p-2 sm:p-2.5 rounded-lg backdrop-blur-sm"
                  style={{
                    backgroundColor: styleObj.bg === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${styleObj.bg === '#ffffff' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: styleObj.accent }}
                  />
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between pt-3 border-t text-[10px] opacity-60"
              style={{
                borderColor: styleObj.bg === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                <span className="font-semibold">{currentSlide.layout}</span>
              </div>
              <span className="mono font-bold">
                {currentSlide.slideNo} / {slides.length}
              </span>
            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeSlideIndex === 0}
              onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Slide Sebelumnya</span>
            </button>

            <button
              type="button"
              disabled={activeSlideIndex === slides.length - 1}
              onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
            >
              <span>Slide Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speaker Notes & AI Visual Prompt Drawer */}
          <div className="surface p-4 rounded-xl border border-border space-y-3">
            {includeSpeakerNotes && (
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-text mb-1">
                  <span className="flex items-center gap-1.5 text-accent">
                    <Mic className="w-3.5 h-3.5" />
                    Speaker Notes (Catatan Pembicara Slide {currentSlide.slideNo}):
                  </span>
                </div>
                <p className="text-xs text-text-mut leading-relaxed italic bg-bg-deep p-3 rounded-lg border border-border">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>
            )}

            {includeVisualPrompts && (
              <div>
                <div className="text-xs font-bold text-text flex items-center gap-1.5 mb-1 text-emerald-400">
                  <Eye className="w-3.5 h-3.5" />
                  AI Image / Visual Prompt (Slide {currentSlide.slideNo}):
                </div>
                <p className="text-[11px] mono text-text-dim bg-bg-deep p-2.5 rounded-lg border border-border break-words">
                  {currentSlide.visualPrompt}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
