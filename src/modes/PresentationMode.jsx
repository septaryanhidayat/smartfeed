import { useState, useMemo } from 'react';
import {
  Presentation, Sparkles, LayoutTemplate, Layers, Palette, Users, BookOpen,
  ChevronLeft, ChevronRight, Copy, Check, Download, Wand2, Mic, Eye, FileText, MonitorPlay,
  CheckCircle2, Target, Award, ArrowRight, TrendingUp, ShieldCheck, Flame, Compass, School
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
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  const {
    topic = 'Konsep Pendirian SMA IT Plus Robbani Boarding School',
    presenter = 'Tim Perumus Yayasan',
    audience = 'Dewan Pembina Yayasan & Calon Stakeholder',
    useCase = 'executive_concept',
    style = 'executive_navy_gold',
    slideCount = 10,
    keyPoints = 'Integrasi Tahfizh 15 Juz + Kesiapan Masuk PTN + Software Skill IT (Desain, Coding, AI), Boarding school membuka pasar luar daerah, simulasi anggaran 25 siswa, roadmap implementasi 4 tahap.',
    includeSpeakerNotes = true,
    includeVisualPrompts = true,
  } = state || {};

  const result = useMemo(() => {
    return buildPresentation(state);
  }, [state]);

  const { slides, styleObj, useCaseObj, markdownPrompt } = result;

  const currentSlide = slides[activeSlideIndex] || slides[0] || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyVisual = () => {
    if (currentSlide.visualPrompt) {
      navigator.clipboard.writeText(currentSlide.visualPrompt);
      setCopiedVisual(true);
      setTimeout(() => setCopiedVisual(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownPrompt], { type: 'text/markdown;charset=utf-8;' });
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
      
      {/* Top Quick Demo Selector */}
      <div className="surface p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-border">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold shadow-xs">
            <Presentation className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs font-bold text-text flex items-center gap-1.5">
              <span>Preset Presentasi Eksekutif (Robbani Masterclass)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent/20 text-accent font-bold mono">M20</span>
            </div>
            <div className="text-[10px] text-text-dim">Template kualitas proposal pendirian, pitch deck bisnis & kurikulum digital</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {PRESENTATION_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadDemo(demo)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-bg-panel hover:bg-bg-elev border border-border text-text-mut hover:text-text transition flex items-center gap-1.5 cursor-pointer"
            >
              <Wand2 className="w-3 h-3 text-accent" />
              <span>{demo.topic.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Layout: Controls (Left) + 16:9 Masterclass Live Deck (Right) */}
      <div className="grid lg:grid-cols-[1fr_1.35fr] gap-6 items-start">
        
        {/* LEFT COLUMN: Input Configuration */}
        <div className="space-y-4">
          <div className="surface p-5 rounded-2xl border border-border space-y-4">
            <div className="text-xs font-bold text-text flex items-center gap-2 border-b border-border pb-2.5">
              <LayoutTemplate className="w-4 h-4 text-accent" />
              <span>Parameter Presentasi</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Topik / Judul Presentasi *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => onChangeField('topic', e.target.value)}
                  placeholder="Contoh: Konsep Pendirian SMA IT Plus Robbani Boarding School"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Presenter / Inisiator
                  </label>
                  <input
                    type="text"
                    value={presenter}
                    onChange={(e) => onChangeField('presenter', e.target.value)}
                    placeholder="Tim Perumus Yayasan"
                    className="w-full px-3 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Target Audiens
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => onChangeField('audience', e.target.value)}
                    placeholder="Dewan Pembina & Stakeholder"
                    className="w-full px-3 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Tipe Struktur Dokumen
                  </label>
                  <select
                    value={useCase}
                    onChange={(e) => onChangeField('useCase', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  >
                    {PRESENTATION_USE_CASES.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Gaya Visual & Palet Warna
                  </label>
                  <select
                    value={style}
                    onChange={(e) => onChangeField('style', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                  >
                    {PRESENTATION_STYLES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Poin Kunci & Diferensiasi Khusus
                </label>
                <textarea
                  rows={3}
                  value={keyPoints}
                  onChange={(e) => onChangeField('keyPoints', e.target.value)}
                  placeholder="Poin penting yang wajib ada di slide (Tahfizh 15 juz, software skill IT terapan, skema beasiswa, dll)..."
                  className="w-full px-3 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-text mb-1">
                  <span>Jumlah Slide</span>
                  <span className="mono text-accent font-bold">{slideCount} Slide</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={slideCount}
                  onChange={(e) => onChangeField('slideCount', Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            </div>
          </div>

          {/* Master Actions */}
          <div className="surface p-4 rounded-2xl border border-border space-y-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full btn-cta text-xs !py-3 justify-center shadow-md cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Prompt Master Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Prompt Master Presentasi (AI Deck)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-deep hover:bg-bg-elev text-xs font-bold text-text flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Download Struktur Slide (.MD)</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 16:9 Live Masterclass Slide Deck Canvas */}
        <div className="space-y-4">
          
          {/* Slide Deck Canvas Header Bar */}
          <div className="flex items-center justify-between bg-bg-panel border border-border px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                Slide {activeSlideIndex + 1} dari {slides.length}
              </span>
              <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                16:9 Widescreen
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeSlideIndex === slides.length - 1}
                onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 16:9 Canvas Container (Aspect Ratio 16:9) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-[#001D42] text-white flex flex-col justify-between p-6 sm:p-8 font-sans select-none">
            
            {/* Top Bar on Slide */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#EAAA00]">
                  {currentSlide.eyebrow || 'SMA IT PLUS ROBBANI'}
                </div>
                <h3 className="text-base sm:text-xl font-black text-white leading-tight mt-0.5">
                  {currentSlide.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* School Emblem Badge on Top Right */}
              <div className="shrink-0 flex items-center gap-2 bg-[#002D62] px-3 py-1 rounded-lg border border-amber-500/30">
                <School className="w-4 h-4 text-[#EAAA00]" />
                <span className="text-[9px] font-black text-white tracking-widest uppercase">ROBBANI</span>
              </div>
            </div>

            {/* Slide Body Content (Adaptive Layout by Slide Archetype) */}
            <div className="flex-1 py-4 flex flex-col justify-center">
              
              {/* Archetype 1: Cover Hero (Split layout preview) */}
              {currentSlide.slideNo === 1 && (
                <div className="grid grid-cols-[1.2fr_1fr] gap-4 items-center h-full">
                  <div className="space-y-3">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAAA00] text-[#002D62] text-[9px] font-black uppercase tracking-widest">
                      KONSEP PENDIRIAN
                    </div>
                    <div className="text-lg sm:text-2xl font-black leading-tight text-white">
                      {topic || 'SMA IT PLUS ROBBANI'}
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/80 leading-relaxed">
                      Membangun Generasi Berilmu, Beriman, Berkarya, dan Bermanfaat untuk Umat
                    </p>
                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['QUR\'AN', 'PTN', 'DESAIN', 'PEMROGRAMAN', 'AI'].map((chip, cIdx) => (
                        <span key={cIdx} className="text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded bg-[#002D62] border border-amber-500/40 text-[#EAAA00]">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="h-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#002D62] to-[#0d47a1] border border-white/15 p-3 flex flex-col items-center justify-center text-center">
                    <School className="w-10 h-10 text-[#EAAA00] mb-2 animate-pulse" />
                    <div className="text-[10px] font-bold text-white">Render Gedung 3D</div>
                    <div className="text-[8px] text-white/60 mt-0.5">Boarding School Modern & Digital</div>
                  </div>
                </div>
              )}

              {/* Archetype 2: 4-Cards + Core Box */}
              {currentSlide.slideNo === 2 && (
                <div className="grid grid-cols-[1.3fr_0.9fr] gap-3 items-stretch">
                  <div className="grid grid-cols-1 gap-1.5">
                    {currentSlide.bullets.slice(0, 4).map((b, bIdx) => (
                      <div key={bIdx} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#EAAA00] text-[#002D62] flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                          0{bIdx + 1}
                        </span>
                        <div className="text-[10px] text-white leading-tight">
                          {b.replace(/^\d+\.\s*/, '')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-[#002D62] border-2 border-[#EAAA00] p-3 flex flex-col justify-between text-center">
                    <div className="text-xs font-black text-[#EAAA00] tracking-widest uppercase">CORE</div>
                    <p className="text-[9px] sm:text-[10px] text-white leading-relaxed font-semibold">
                      {currentSlide.coreHighlight?.body || 'Menyiapkan jenjang strategis kader berilmu, beriman & berkarya.'}
                    </p>
                    <div className="bg-[#EAAA00] text-[#002D62] text-[8px] sm:text-[9px] font-black py-1 px-2 rounded">
                      {currentSlide.coreHighlight?.output || 'Output: Qur\'an + PTN + IT'}
                    </div>
                  </div>
                </div>
              )}

              {/* Archetype 3: 2x2 Problem Grid + Solution Banner */}
              {currentSlide.slideNo === 3 && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {currentSlide.bullets.slice(0, 4).map((b, bIdx) => (
                      <div key={bIdx} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[8px] font-black shrink-0">
                          0{bIdx + 1}
                        </span>
                        <span className="text-[9px] text-white leading-tight">{b.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#002D62] border border-[#EAAA00]/40 flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-[#EAAA00]">
                      {currentSlide.solutionBanner?.badge || 'Solusi Diferensiasi'}
                    </span>
                    <p className="text-[9px] text-white/90 leading-tight">
                      {currentSlide.solutionBanner?.text || 'Penguatan PTN + Tahfizh + Skill IT terapan menghasilkan portofolio nyata.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Other Archetypes: Standard List with Visual Icons */}
              {currentSlide.slideNo > 3 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentSlide.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EAAA00] shrink-0 mt-0.5" />
                        <span className="text-[10px] text-white leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                  {currentSlide.goldenTakeaway && (
                    <div className="p-2 rounded-lg bg-[#EAAA00]/15 border border-[#EAAA00]/40 text-center text-[10px] font-bold text-[#EAAA00]">
                      ★ {currentSlide.goldenTakeaway}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Navy & Gold Ribbon Branding Bar */}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] text-white/60 font-mono">
              <span className="truncate">SMA IT Plus Robbani Boarding School | Konsep Digital School</span>
              <span className="text-[#EAAA00] font-bold shrink-0">Berilmu, Beriman, Berkarya</span>
            </div>

          </div>

          {/* Slide Navigation Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 border cursor-pointer ${
                  activeSlideIndex === idx
                    ? 'bg-[#002D62] text-[#EAAA00] border-[#EAAA00] shadow-sm'
                    : 'bg-bg-panel text-text-mut border-border hover:bg-bg-elev'
                }`}
              >
                <span>Slide {s.slideNo}</span>
              </button>
            ))}
          </div>

          {/* AI Image Prompt Drawer for the Active Slide */}
          {currentSlide.visualPrompt && (
            <div className="surface p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Prompt Visual AI Slide Ini (16:9 Photorealistic)
                </span>
                <button
                  type="button"
                  onClick={handleCopyVisual}
                  className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedVisual ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedVisual ? 'Tersalin' : 'Salin Prompt Visual'}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-bg-deep border border-border/80 text-[11px] mono text-text-mut leading-relaxed select-all">
                {currentSlide.visualPrompt}
              </div>
            </div>
          )}

          {/* Speaker Notes */}
          {currentSlide.speakerNotes && (
            <div className="surface p-3.5 rounded-xl border border-border text-xs space-y-1">
              <div className="font-bold text-text flex items-center gap-1.5 text-[11px]">
                <Mic className="w-3.5 h-3.5 text-accent" />
                Catatan Presenter (Speaker Notes):
              </div>
              <p className="text-text-mut text-[11px] leading-relaxed italic">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
