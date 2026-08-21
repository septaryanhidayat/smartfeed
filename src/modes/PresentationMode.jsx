import { useState, useMemo, useRef } from 'react';
import {
  Presentation, Sparkles, LayoutTemplate, Layers, Palette, Users, BookOpen,
  ChevronLeft, ChevronRight, Copy, Check, Download, Wand2, Mic, Eye, FileText, MonitorPlay,
  CheckCircle2, Target, Award, ArrowRight, TrendingUp, ShieldCheck, Flame, Compass, Shuffle, Briefcase,
  Code2, ExternalLink, Library, Rocket, Clock, Globe, BarChart3, HelpCircle, ChevronDown, CheckSquare, Square, RotateCcw,
  BookMarked, Paintbrush
} from 'lucide-react';
import {
  PRESENTATION_TYPES,
  PRESENTATION_SLIDE_OPTIONS,
  PRESENTATION_DURATIONS,
  PRESENTATION_LANGUAGES,
  PRESENTATION_DESIGN_STYLES,
  PRESENTATION_VISUAL_ELEMENTS,
  PRESENTATION_TONES,
  PRESENTATION_DEMOS,
} from '../data/presentationOptions.js';
import { buildPresentation, INITIAL_PRESENTATION } from '../prompts/buildPresentation.js';
import PresentationDemoModal from '../components/PresentationDemoModal.jsx';

export default function PresentationMode({ state, onChangeField, onSetState }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [outputTab, setOutputTab] = useState('canva'); // 'canva' | 'prompt' | 'gamma' | 'vba' | 'notebooklm'
  const [copied, setCopied] = useState(false);
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [generatedToast, setGeneratedToast] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const outputRef = useRef(null);

  const {
    topic = '',
    type = 'Pitching ke Investor',
    audience = '',
    slideCount = 6,
    duration = '5-10 menit',
    language = 'Indonesia',
    keyPoints = '',
    dataEvidence = '',
    mainCta = '',
    designStyle = 'Startup Inovatif',
    colorScheme = '',
    visualElements = ['Infografis & Diagram', 'Timeline', 'Ikon Vektor', 'Comparison Table', 'Foto HD'],
    tone = 'Inspiratif',
    extraNotes = '',
  } = state || {};

  const result = useMemo(() => {
    try {
      return buildPresentation(state);
    } catch (e) {
      console.warn('[PresentationMode] build error', e);
      return { slides: [], notebookLmDoc: '', gammaOutline: '', vbaMacro: '', markdownPrompt: '', magicPrompt: '', canvaMagicPrompt: '' };
    }
  }, [state]);

  const { slides = [], notebookLmDoc = '', gammaOutline = '', vbaMacro = '', markdownPrompt = '', magicPrompt = '', canvaMagicPrompt = '' } = result || {};

  const safeIndex = Math.min(Math.max(activeSlideIndex, 0), Math.max((slides?.length || 1) - 1, 0));
  const currentSlide = (slides && slides[safeIndex]) || {
    slideNo: 1,
    bullets: [],
    eyebrow: (type || 'PRESENTASI EKSEKUTIF').toUpperCase(),
    title: topic || 'Slide Title',
    subtitle: `Disusun untuk: ${audience || 'Target Audiens'}`,
    categoryChips: ['STRATEGI', 'EKSEKUTIF', 'AKSI']
  };

  const bullets = Array.isArray(currentSlide?.bullets) ? currentSlide.bullets : [];

  const getCurrentOutputContent = () => {
    switch (outputTab) {
      case 'canva':
        return canvaMagicPrompt || '';
      case 'gamma':
        return gammaOutline || '';
      case 'vba':
        return vbaMacro || '';
      case 'notebooklm':
        return notebookLmDoc || '';
      case 'prompt':
      default:
        return magicPrompt || markdownPrompt || '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentOutputContent());
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
    const content = getCurrentOutputContent();
    const ext = outputTab === 'vba' ? 'vba.txt' : 'md';
    const prefix = outputTab === 'vba' ? 'PowerPoint-Macro' : outputTab === 'canva' ? 'Canva-Magic-Design-Prompt' : outputTab === 'gamma' ? 'Gamma-Canva-Outline' : outputTab === 'notebooklm' ? 'NotebookLM-Source' : 'Magic-Prompt-Deck';

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}-${(topic || 'presentation').replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadDemo = (demo) => {
    if (onSetState && demo) {
      onSetState(demo);
      setActiveSlideIndex(0);
    }
  };

  const handleRandomizeDemo = () => {
    if (!onSetState || PRESENTATION_DEMOS.length === 0) return;
    const randomIndex = Math.floor(Math.random() * PRESENTATION_DEMOS.length);
    const picked = PRESENTATION_DEMOS[randomIndex];
    if (picked) {
      onSetState(picked);
      setActiveSlideIndex(0);
    }
  };

  const handleClear = () => {
    if (onSetState) {
      onSetState({ ...INITIAL_PRESENTATION });
      setActiveSlideIndex(0);
    }
  };

  const toggleVisualElement = (elem) => {
    if (!onChangeField) return;
    const current = Array.isArray(visualElements) ? [...visualElements] : [];
    const idx = current.indexOf(elem);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(elem);
    }
    onChangeField('visualElements', current);
  };

  const handleGenerateClick = () => {
    navigator.clipboard.writeText(getCurrentOutputContent());
    setCopied(true);
    setGeneratedToast(true);
    setTimeout(() => {
      setCopied(false);
      setGeneratedToast(false);
    }, 3000);

    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">

      {/* ── TOP ACTION BAR (KATALOG DEMO + ACAK + KOSONGKAN) ── */}
      <div className="surface p-4 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-sm">
        
        {/* Left: Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-accent text-white shadow-sm hover:opacity-95 transition flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <BookMarked className="w-4 h-4" />
            <span>Katalog Demo (9 Template)</span>
          </button>

          <button
            type="button"
            onClick={handleRandomizeDemo}
            className="px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 transition flex items-center gap-1.5 cursor-pointer active:scale-98"
            title="Acak contoh presentasi"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Demo</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition flex items-center gap-1.5 cursor-pointer active:scale-98"
            title="Kosongkan seluruh isian form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan</span>
          </button>
        </div>

        {/* Right: Touch-scrollable quick chips */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scroll-smooth pb-1 pt-0.5 max-w-full">
          {PRESENTATION_DEMOS.map((demo, idx) => {
            const isSelected = topic === demo.topic;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadDemo(demo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-accent/20 text-accent border-accent font-black shadow-xs'
                    : 'bg-bg-panel hover:bg-bg-elev border-border text-text-mut hover:text-text'
                }`}
              >
                <span>{demo.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2-COLUMN MAIN STUDIO LAYOUT: FORM IS PRIORITY & WIDE (FLEX-1), OUTPUT IS FIXED/COMPACT (440px) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_440px] 2xl:grid-cols-[1fr_480px] gap-6 items-start w-full">
        
        {/* LEFT / CENTER MAIN COLUMN: EXPANSIVE FULL-WIDTH INPUT FORM */}
        <div className="space-y-5 w-full min-w-0">

          {/* BAGIAN 1 — IDENTITAS PRESENTASI */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-sky-400 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-extrabold text-[11px]">1</span>
                <span className="font-extrabold">BAGIAN 1 — IDENTITAS PRESENTASI</span>
              </div>
              {topic && (
                <button
                  type="button"
                  onClick={() => onChangeField && onChangeField('topic', '')}
                  className="text-xs text-text-dim hover:text-red-400 font-normal cursor-pointer whitespace-nowrap"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* 1. Judul / Topik */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  1. Judul / Topik Presentasi *
                </label>
                <input
                  type="text"
                  value={topic || ''}
                  onChange={(e) => onChangeField && onChangeField('topic', e.target.value)}
                  placeholder="Ketik topik presentasi (contoh: Roadmap AI 2026: Panduan Bertahan di Tengah Tsunami Digital)..."
                  className="w-full px-4 py-3 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none font-semibold"
                />
              </div>

              {/* 2. Jenis / Tujuan Presentasi */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  2. Jenis / Tujuan Presentasi
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESENTATION_TYPES.map((tItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('type', tItem)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        type === tItem
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 shadow-xs font-extrabold'
                          : 'bg-bg-deep text-text-mut border-border hover:border-text-mut hover:text-text'
                      }`}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target Audiens */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  3. Target Audiens
                </label>
                <input
                  type="text"
                  value={audience || ''}
                  onChange={(e) => onChangeField && onChangeField('audience', e.target.value)}
                  placeholder="contoh: Profesional, Kreator Konten, Freelancer & Pebisnis..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 4. Jumlah Slide */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  4. Jumlah Slide
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESENTATION_SLIDE_OPTIONS.map((sOpt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('slideCount', sOpt.value)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        Number(slideCount) === sOpt.value
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 shadow-xs font-black'
                          : 'bg-bg-deep text-text-mut border-border hover:text-text'
                      }`}
                    >
                      {sOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Durasi & 6. Bahasa */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    5. Durasi Presentasi
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESENTATION_DURATIONS.map((dItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChangeField && onChangeField('duration', dItem)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          duration === dItem
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 font-black'
                            : 'bg-bg-deep text-text-mut border-border hover:text-text'
                        }`}
                      >
                        {dItem}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    6. Bahasa Pengantar
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESENTATION_LANGUAGES.map((lItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChangeField && onChangeField('language', lItem)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                          language === lItem
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 font-black'
                            : 'bg-bg-deep text-text-mut border-border hover:text-text'
                        }`}
                      >
                        {lItem}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2 — KONTEN & PESAN */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-emerald-400 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[11px]">2</span>
                <span className="font-extrabold">BAGIAN 2 — KONTEN &amp; PESAN</span>
              </div>
              {keyPoints && (
                <button
                  type="button"
                  onClick={() => onChangeField && onChangeField('keyPoints', '')}
                  className="text-xs text-text-dim hover:text-red-400 font-normal cursor-pointer whitespace-nowrap"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* 7. Poin Utama */}
              <div>
                <label className="block text-xs font-bold text-text mb-0.5">
                  7. Poin Utama yang Harus Disampaikan
                </label>
                <div className="text-xs text-text-dim mb-1.5">Tuliskan poin kunci yang wajib ada dalam presentasi</div>
                <textarea
                  rows={4}
                  value={keyPoints || ''}
                  onChange={(e) => onChangeField && onChangeField('keyPoints', e.target.value)}
                  placeholder="- Masalah utama / latar belakang&#10;- Solusi atau inovasi yang ditawarkan&#10;- Langkah implementasi&#10;- Manfaat bagi audiens..."
                  className="w-full px-4 py-3 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none leading-relaxed font-mono"
                />
              </div>

              {/* 8. Data / Bukti / Statistik */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  8. Data / Bukti / Statistik (Opsional)
                </label>
                <input
                  type="text"
                  value={dataEvidence || ''}
                  onChange={(e) => onChangeField && onChangeField('dataEvidence', e.target.value)}
                  placeholder="Contoh: 91% kegagalan AI karena prompt amatir, hemat waktu 70%..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 9. Pesan Utama / CTA */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  9. Pesan Utama / Call to Action
                </label>
                <input
                  type="text"
                  value={mainCta || ''}
                  onChange={(e) => onChangeField && onChangeField('mainCta', e.target.value)}
                  placeholder="contoh: Terapkan kerangka T-C-E-I hari ini dan jadilah arsitek alur kerja Anda..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3 — GAYA DESAIN VISUAL */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-2 border-b border-border pb-3 whitespace-nowrap">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-[11px]">3</span>
              <span className="font-extrabold">BAGIAN 3 — GAYA DESAIN VISUAL</span>
            </div>

            <div className="space-y-4">
              {/* 10. Gaya / Tone Desain */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  10. Gaya / Tone Desain
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESENTATION_DESIGN_STYLES.map((dStyle, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('designStyle', dStyle.label)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        designStyle === dStyle.label
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-xs font-black'
                          : 'bg-bg-deep text-text-mut border-border hover:text-text'
                      }`}
                    >
                      {dStyle.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 11. Skema Warna */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  11. Skema Warna Utama (Opsional)
                </label>
                <input
                  type="text"
                  value={colorScheme || ''}
                  onChange={(e) => onChangeField && onChangeField('colorScheme', e.target.value)}
                  placeholder="contoh: Deep Tech Navy (#060B17) + Electric Purple + Cyan + Clean White"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 12. Elemen Visual yang Diinginkan */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  12. Elemen Visual yang Diinginkan
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESENTATION_VISUAL_ELEMENTS.map((elem, idx) => {
                    const isSelected = Array.isArray(visualElements) && visualElements.includes(elem);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleVisualElement(elem)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-accent/20 text-accent border-accent shadow-xs font-black'
                            : 'bg-bg-deep text-text-mut border-border hover:text-text'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-accent shrink-0" /> : <Square className="w-4 h-4 text-text-dim shrink-0" />}
                        <span>{elem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 4 — INSTRUKSI TAMBAHAN */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-purple-400 flex items-center gap-2 border-b border-border pb-3 whitespace-nowrap">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold text-[11px]">4</span>
              <span className="font-extrabold">BAGIAN 4 — GAYA BAHASA &amp; CATATAN</span>
            </div>

            <div className="space-y-4">
              {/* 13. Tone / Gaya Bahasa */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  13. Tone / Gaya Bahasa
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESENTATION_TONES.map((tItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('tone', tItem)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border text-center transition cursor-pointer ${
                        tone === tItem
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/60 shadow-xs font-black'
                          : 'bg-bg-deep text-text-mut border-border hover:text-text'
                      }`}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>

              {/* 14. Informasi Tambahan */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  14. Catatan Tambahan Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={extraNotes || ''}
                  onChange={(e) => onChangeField && onChangeField('extraNotes', e.target.value)}
                  placeholder="contoh: Diformat khusus agar estetik dan konsisten saat di-import ke Canva..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-sm text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MAIN GENERATE MAGIC PROMPT CTA BUTTON */}
          <button
            type="button"
            onClick={handleGenerateClick}
            className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer bg-gradient-to-r from-sky-500 via-accent to-emerald-500 hover:opacity-95"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>✦ Generate Magic Prompt Presentasi (Salin Otomatis)</span>
          </button>

        </div>

        {/* RIGHT COLUMN: OUTPUT PROMPT PANEL + SLIDE PREVIEW (OPTIMAL FIXED WIDTH, NEVER EATING FORM SPACE) */}
        <div ref={outputRef} className="space-y-6 w-full min-w-0">

          {/* FORMAT TABS EXPORTER */}
          <div className="surface p-5 rounded-2xl border border-border space-y-4 shadow-sm">
            
            {/* Header Result */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-text uppercase tracking-wider">
                  Hasil Output Prompt:
                </span>
              </div>
              <span className="text-[11px] mono px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-bold">16:9 Widescreen</span>
            </div>

            {/* Toast Banner When Clicked Generate */}
            {generatedToast && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Magic Prompt Berhasil Dibuat &amp; Tersalin ke Clipboard!</span>
              </div>
            )}

            {/* 5 Engine Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutputTab('canva')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'canva'
                    ? 'bg-sky-500/20 border-sky-400 text-text font-bold shadow-xs ring-1 ring-sky-500/40'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-400">
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Canva Magic AI</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Template Search Box</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('prompt')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'prompt'
                    ? 'bg-purple-500/20 border-purple-400 text-text font-bold shadow-xs ring-1 ring-purple-500/40'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Mega Prompt AI</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">ChatGPT, Claude, Gemini</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('gamma')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'gamma'
                    ? 'bg-emerald-500/20 border-emerald-400 text-text font-bold shadow-xs ring-1 ring-emerald-500/40'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Gamma / Outline</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">1-click outline slide</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('vba')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'vba'
                    ? 'bg-amber-500/20 border-amber-400 text-text font-bold shadow-xs ring-1 ring-amber-500/40'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>PowerPoint VBA</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Script Alt+F11 otomatis</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('notebooklm')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer col-span-2 ${
                  outputTab === 'notebooklm'
                    ? 'bg-rose-500/20 border-rose-400 text-text font-bold shadow-xs ring-1 ring-rose-500/40'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-400">
                  <Library className="w-3.5 h-3.5" />
                  <span>NotebookLM Source Document</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Dokumen podcast &amp; tanya-jawab AI</div>
              </button>
            </div>

            {/* Special Instruction Tip Banner for Canva Magic Design */}
            {outputTab === 'canva' && (
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300 space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-sky-200">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Cara Pakai di Canva Magic Design:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs text-sky-300/90 leading-relaxed">
                  <li>Salin prompt ringkas di bawah.</li>
                  <li>Buka Canva &gt; Buat <strong>Presentasi (16:9)</strong>.</li>
                  <li>Di tab <strong>Desain</strong> &gt; paste prompt ke kolom pencarian template.</li>
                  <li>Canva akan langsung menghasilkan set template slide gratis!</li>
                </ol>
              </div>
            )}

            {/* Action Bar (Copy + Download) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 btn-cta text-xs !py-3 justify-center shadow-md cursor-pointer font-extrabold truncate"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Konten {outputTab.toUpperCase()} Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 shrink-0" />
                    <span>Salin Format {outputTab === 'canva' ? 'Canva Magic AI' : outputTab === 'prompt' ? 'Mega Prompt AI' : outputTab === 'gamma' ? 'Outline Gamma' : outputTab === 'vba' ? 'Script VBA' : 'Dokumen'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-3 rounded-xl border border-border bg-bg-deep hover:bg-bg-elev text-xs font-bold text-text flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                title="Download file"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Unduh</span>
              </button>
            </div>

            {/* REALTIME VISIBLE PROMPT TEXT AREA (ULTRA HIGH CONTRAST) */}
            <div className="relative">
              <textarea
                readOnly
                rows={outputTab === 'canva' ? 5 : 12}
                value={getCurrentOutputContent()}
                className="w-full p-3.5 rounded-xl bg-[#080D1A] border border-border/80 font-mono text-xs text-[#F8FAFC] leading-relaxed resize-y focus:outline-none focus:border-accent selection:bg-accent selection:text-white shadow-inner"
              />
            </div>
          </div>

          {/* 16:9 LIVE SLIDE PREVIEW (CLEAN & PROPORTIONATE) */}
          <div className="surface p-5 rounded-2xl border border-border space-y-3.5 shadow-sm">
            
            {/* Header Canvas Control */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-text">
                  Pratinjau Slide ({safeIndex + 1}/{Math.max(slides.length, 1)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                  className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeIndex >= slides.length - 1}
                  onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, Math.max(slides.length - 1, 0)))}
                  className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 16:9 Slide Canvas (High Contrast Keynote) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-[#060B17] text-white flex flex-col justify-between p-4 sm:p-5 select-none font-sans">
              
              {/* Top Bar on Slide */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                    {currentSlide?.eyebrow || 'MAGIC PRESENTATION'}
                  </span>
                  <span className="text-[10px] text-white/60 font-mono">
                    Slide {safeIndex + 1}/{slides.length || 1}
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-1 bg-[#002D62] px-2 py-0.5 rounded border border-sky-400/40">
                  <span className="text-[8px] font-black text-white tracking-wider uppercase">
                    {type || 'EXECUTIVE'}
                  </span>
                </div>
              </div>

              {/* Slide Body (Clean & Readable) */}
              <div className="flex-1 py-2 flex flex-col justify-center min-h-0">
                {safeIndex === 0 ? (
                  // COVER SLIDE
                  <div className="grid grid-cols-[1.3fr_0.8fr] gap-3 items-center h-full">
                    <div className="space-y-1.5">
                      <h2 className="text-sm sm:text-base font-black leading-snug text-white tracking-tight line-clamp-2">
                        {topic || 'Judul / Topik Presentasi'}
                      </h2>
                      <p className="text-[10px] text-white/85 line-clamp-2 leading-relaxed">
                        {currentSlide?.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(currentSlide?.categoryChips || ['STRATEGI', 'EKSEKUTIF', 'AKSI']).map((chip, cIdx) => (
                          <span key={cIdx} className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399]">
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="h-full max-h-28 rounded-xl bg-gradient-to-tr from-[#0B1A3A] via-[#0D2847] to-[#047857]/50 border border-white/20 p-2.5 flex flex-col items-center justify-center text-center shadow-inner">
                      <Sparkles className="w-5 h-5 text-[#34D399] mb-1 animate-pulse" />
                      <div className="text-[10px] font-extrabold text-white">Visual 3D Keynote</div>
                    </div>
                  </div>
                ) : (
                  // CONTENT SLIDES
                  <div className="space-y-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-tight line-clamp-1">
                      {currentSlide?.title}
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5">
                      {bullets.slice(0, 3).map((b, bIdx) => (
                        <div key={bIdx} className="p-1.5 rounded-lg bg-white/[0.08] border border-white/15 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#34D399] shrink-0 mt-0.5" />
                          <span className="text-[10px] text-white font-medium leading-tight line-clamp-2">{b}</span>
                        </div>
                      ))}
                    </div>
                    {currentSlide?.goldenTakeaway && (
                      <div className="p-1.5 rounded-lg bg-[#10B981]/20 border border-[#10B981]/50 text-center text-[10px] font-bold text-[#34D399] truncate">
                        ★ {currentSlide.goldenTakeaway}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Ribbon */}
              <div className="border-t border-white/10 pt-1.5 flex items-center justify-between text-[8px] text-white/75 font-mono shrink-0">
                <span className="truncate max-w-[65%]">{audience || 'Smart Feed'}</span>
                <span className="text-[#34D399] font-bold shrink-0">1 Slide 1 Pesan</span>
              </div>
            </div>

            {/* Slide Navigation Thumbnails */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
              {(slides || []).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition flex items-center gap-1 border cursor-pointer ${
                    safeIndex === idx
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm font-black'
                      : 'bg-bg-panel text-text-mut border-border hover:bg-bg-elev'
                  }`}
                >
                  <span>Slide {s?.slideNo || idx + 1}</span>
                </button>
              ))}
            </div>

            {/* AI Image Prompt Drawer */}
            {currentSlide?.visualPrompt && (
              <div className="surface p-3 rounded-xl border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    AI Image Prompt (16:9 Midjourney/Flux)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVisual}
                    className="px-2 py-0.5 rounded bg-accent/15 text-accent hover:bg-accent/25 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedVisual ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVisual ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-bg-deep border border-border/80 text-[10px] mono text-text-mut leading-relaxed select-all line-clamp-3">
                  {currentSlide.visualPrompt}
                </div>
              </div>
            )}

            {/* Speaker Notes */}
            {currentSlide?.speakerNotes && (
              <div className="surface p-3 rounded-xl border border-border text-[11px] space-y-1">
                <div className="font-bold text-text flex items-center gap-1 text-[10px]">
                  <Mic className="w-3 h-3 text-accent" />
                  Catatan Pembicara (Speaker Notes):
                </div>
                <p className="text-text-mut text-[10px] leading-relaxed italic line-clamp-2">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL PILIH KATALOG DEMO PRESENTASI */}
      <PresentationDemoModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onPick={handleLoadDemo}
        currentTopic={topic}
      />

    </div>
  );
}
