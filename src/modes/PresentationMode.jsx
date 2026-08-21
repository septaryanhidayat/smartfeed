import { useState, useMemo, useRef } from 'react';
import {
  Presentation, Sparkles, LayoutTemplate, Layers, Palette, Users, BookOpen,
  ChevronLeft, ChevronRight, Copy, Check, Download, Wand2, Mic, Eye, FileText, MonitorPlay,
  CheckCircle2, Target, Award, ArrowRight, TrendingUp, ShieldCheck, Flame, Compass, Shuffle, Briefcase,
  Code2, ExternalLink, Library, Rocket, Clock, Globe, BarChart3, HelpCircle, ChevronDown, CheckSquare, Square, RotateCcw
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

export default function PresentationMode({ state, onChangeField, onSetState }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [outputTab, setOutputTab] = useState('prompt'); // 'prompt' | 'gamma' | 'vba' | 'notebooklm'
  const [copied, setCopied] = useState(false);
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [generatedToast, setGeneratedToast] = useState(false);

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
    designStyle = 'Profesional & Minimalis',
    colorScheme = '',
    visualElements = ['Infografis & Diagram', 'Ikon Vektor', 'Grafik & Chart'],
    tone = 'Percaya Diri',
    extraNotes = '',
  } = state || {};

  const result = useMemo(() => {
    try {
      return buildPresentation(state);
    } catch (e) {
      console.warn('[PresentationMode] build error', e);
      return { slides: [], notebookLmDoc: '', gammaOutline: '', vbaMacro: '', markdownPrompt: '', magicPrompt: '' };
    }
  }, [state]);

  const { slides = [], notebookLmDoc = '', gammaOutline = '', vbaMacro = '', markdownPrompt = '', magicPrompt = '' } = result || {};

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
    const prefix = outputTab === 'vba' ? 'PowerPoint-Macro' : outputTab === 'gamma' ? 'Gamma-Outline' : outputTab === 'notebooklm' ? 'NotebookLM-Source' : 'Magic-Prompt-Deck';

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
    <div className="space-y-5 w-full">

      {/* ── TOP PRESETS & ACTION TOOLBAR (CLEAN HORIZONTAL SCROLL ON MOBILE) ── */}
      <div className="surface p-3 sm:p-3.5 rounded-xl border border-border flex items-center justify-between gap-2 overflow-hidden shadow-xs">
        <div className="flex items-center gap-1.5 shrink-0 text-text font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="hidden sm:inline">Pilihan Demo:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5 min-w-0 flex-1 justify-end">
          {/* Tombol Clear / Kosongkan Form */}
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 shrink-0 transition flex items-center gap-1.5 cursor-pointer"
            title="Kosongkan seluruh isian form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan</span>
          </button>

          {/* Tombol Acak Demo */}
          <button
            type="button"
            onClick={handleRandomizeDemo}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 shrink-0 transition flex items-center gap-1.5 cursor-pointer"
            title="Acak contoh presentasi"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Demo</span>
          </button>

          {/* Chips Demo Presets */}
          {PRESENTATION_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadDemo(demo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 transition flex items-center gap-1 cursor-pointer ${
                topic === demo.topic
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-bg-panel hover:bg-bg-elev border-border text-text-mut hover:text-text'
              }`}
            >
              <span>{demo.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2-COLUMN MAIN STUDIO LAYOUT: FORM INPUT (LEFT) + OUTPUT PROMPT PANEL (RIGHT) ── */}
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5 items-start w-full">
        
        {/* LEFT COLUMN: 4 SECTION STRUCTURED MAGIC FORM */}
        <div className="space-y-4 w-full">

          {/* BAGIAN 1 — IDENTITAS PRESENTASI */}
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-sky-400 flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-extrabold text-[10px]">1</span>
                <span>BAGIAN 1 — IDENTITAS PRESENTASI</span>
              </div>
              {topic && (
                <button
                  type="button"
                  onClick={() => onChangeField && onChangeField('topic', '')}
                  className="text-[10px] text-text-dim hover:text-red-400 font-normal cursor-pointer"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* 1. Judul / Topik */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  1. Judul / Topik Presentasi *
                </label>
                <input
                  type="text"
                  value={topic || ''}
                  onChange={(e) => onChangeField && onChangeField('topic', e.target.value)}
                  placeholder="Ketik topik presentasi (atau klik tombol Demo di atas)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 2. Jenis / Tujuan Presentasi */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  2. Jenis / Tujuan Presentasi
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESENTATION_TYPES.map((tItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('type', tItem)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        type === tItem
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 shadow-xs'
                          : 'bg-bg-deep text-text-mut border-border/80 hover:border-border hover:text-text'
                      }`}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target Audiens */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  3. Target Audiens
                </label>
                <input
                  type="text"
                  value={audience || ''}
                  onChange={(e) => onChangeField && onChangeField('audience', e.target.value)}
                  placeholder="contoh: Investor, Calon Klien, Tim Internal, Pelajar..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 4. Jumlah Slide */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  4. Jumlah Slide
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {PRESENTATION_SLIDE_OPTIONS.map((sOpt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('slideCount', sOpt.value)}
                      className={`py-2 px-1 rounded-lg text-[11px] font-bold border text-center transition cursor-pointer ${
                        Number(slideCount) === sOpt.value
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 shadow-xs'
                          : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                      }`}
                    >
                      {sOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Durasi & 6. Bahasa */}
              <div className="grid sm:grid-cols-2 gap-3 pt-0.5">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    5. Durasi Presentasi
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {PRESENTATION_DURATIONS.map((dItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChangeField && onChangeField('duration', dItem)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          duration === dItem
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/60'
                            : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
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
                  <div className="grid grid-cols-3 gap-1">
                    {PRESENTATION_LANGUAGES.map((lItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChangeField && onChangeField('language', lItem)}
                        className={`py-1 rounded-lg text-[10px] font-bold border text-center transition cursor-pointer ${
                          language === lItem
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/60'
                            : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
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
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-emerald-400 flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[10px]">2</span>
                <span>BAGIAN 2 — KONTEN &amp; PESAN</span>
              </div>
              {keyPoints && (
                <button
                  type="button"
                  onClick={() => onChangeField && onChangeField('keyPoints', '')}
                  className="text-[10px] text-text-dim hover:text-red-400 font-normal cursor-pointer"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* 7. Poin Utama */}
              <div>
                <label className="block text-xs font-bold text-text mb-0.5">
                  7. Poin Utama yang Harus Disampaikan
                </label>
                <div className="text-[10px] text-text-dim mb-1">Tuliskan 3-5 poin kunci yang wajib ada dalam presentasi</div>
                <textarea
                  rows={4}
                  value={keyPoints || ''}
                  onChange={(e) => onChangeField && onChangeField('keyPoints', e.target.value)}
                  placeholder="- Masalah utama / latar belakang&#10;- Solusi atau inovasi yang ditawarkan&#10;- Langkah implementasi&#10;- Manfaat bagi audiens..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              {/* 8. Data / Bukti / Statistik */}
              <div>
                <label className="block text-xs font-bold text-text mb-0.5">
                  8. Data / Bukti / Statistik (Opsional)
                </label>
                <input
                  type="text"
                  value={dataEvidence || ''}
                  onChange={(e) => onChangeField && onChangeField('dataEvidence', e.target.value)}
                  placeholder="Contoh: Pertumbuhan 35% YoY, 1.200 klien aktif, survei kepuasan 90%..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 9. Pesan Utama / CTA */}
              <div>
                <label className="block text-xs font-bold text-text mb-0.5">
                  9. Pesan Utama / Call to Action
                </label>
                <input
                  type="text"
                  value={mainCta || ''}
                  onChange={(e) => onChangeField && onChangeField('mainCta', e.target.value)}
                  placeholder="contoh: Menyetujui alokasi dana, bergabung ke program, jadwalkan meeting lanjutan..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3 — GAYA DESAIN VISUAL */}
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-2 border-b border-border pb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-[10px]">3</span>
              <span>BAGIAN 3 — GAYA DESAIN VISUAL</span>
            </div>

            <div className="space-y-3">
              {/* 10. Gaya / Tone Desain */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  10. Gaya / Tone Desain
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESENTATION_DESIGN_STYLES.map((dStyle, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('designStyle', dStyle.label)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        designStyle === dStyle.label
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-xs'
                          : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                      }`}
                    >
                      {dStyle.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 11. Skema Warna */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  11. Skema Warna Utama (Opsional)
                </label>
                <input
                  type="text"
                  value={colorScheme || ''}
                  onChange={(e) => onChangeField && onChangeField('colorScheme', e.target.value)}
                  placeholder="contoh: Navy, Gold, Putih (atau kosongkan untuk mengikuti gaya desain)"
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 12. Elemen Visual yang Diinginkan */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  12. Elemen Visual yang Diinginkan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {PRESENTATION_VISUAL_ELEMENTS.map((elem, idx) => {
                    const isSelected = Array.isArray(visualElements) && visualElements.includes(elem);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleVisualElement(elem)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-accent/20 text-accent border-accent shadow-xs'
                            : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3 h-3 text-accent shrink-0" /> : <Square className="w-3 h-3 text-text-dim shrink-0" />}
                        <span className="truncate">{elem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 4 — INSTRUKSI TAMBAHAN */}
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-purple-400 flex items-center gap-2 border-b border-border pb-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold text-[10px]">4</span>
              <span>BAGIAN 4 — GAYA BAHASA &amp; CATATAN</span>
            </div>

            <div className="space-y-3">
              {/* 13. Tone / Gaya Bahasa */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  13. Tone / Gaya Bahasa
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PRESENTATION_TONES.map((tItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('tone', tItem)}
                      className={`p-1.5 rounded-lg text-[11px] font-bold border text-center transition cursor-pointer ${
                        tone === tItem
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/60 shadow-xs'
                          : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                      }`}
                    >
                      {tItem}
                    </button>
                  ))}
                </div>
              </div>

              {/* 14. Informasi Tambahan */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  14. Catatan Tambahan Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={extraNotes || ''}
                  onChange={(e) => onChangeField && onChangeField('extraNotes', e.target.value)}
                  placeholder="contoh: Tekankan ROI cepat dan kemudahan adopsi bagi pemula..."
                  className="w-full px-3.5 py-2 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* MAIN GENERATE MAGIC PROMPT CTA BUTTON */}
          <button
            type="button"
            onClick={handleGenerateClick}
            className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm text-white shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-sky-500 via-accent to-emerald-500 hover:opacity-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>✦ Generate Magic Prompt Presentasi (Salin Otomatis)</span>
          </button>

        </div>

        {/* RIGHT COLUMN: REALTIME PROMPT OUTPUT PANEL + TABS + SLIDE PREVIEW */}
        <div ref={outputRef} className="space-y-4 w-full">

          {/* FORMAT TABS EXPORTER */}
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3.5 shadow-sm">
            
            {/* Header Result */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-text uppercase tracking-wider">
                  Hasil Output Prompt &amp; Ekspor:
                </span>
              </div>
              <span className="text-[10px] mono px-2 py-0.5 rounded bg-accent/15 text-accent font-bold">16:9 Widescreen</span>
            </div>

            {/* Toast Banner When Clicked Generate */}
            {generatedToast && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Magic Prompt Berhasil Dibuat &amp; Tersalin ke Clipboard!</span>
              </div>
            )}

            {/* 4 Engine Tabs */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setOutputTab('prompt')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'prompt'
                    ? 'bg-sky-500/15 border-sky-500 text-text font-bold shadow-xs'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Magic Prompt AI</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">ChatGPT, Claude, Gemini</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('gamma')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'gamma'
                    ? 'bg-purple-500/15 border-purple-500 text-text font-bold shadow-xs'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Gamma / Canva</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">1-click outline slide</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('vba')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'vba'
                    ? 'bg-emerald-500/15 border-emerald-500 text-text font-bold shadow-xs'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>PowerPoint VBA</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Script Alt+F11 bebas corrupt</div>
              </button>

              <button
                type="button"
                onClick={() => setOutputTab('notebooklm')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'notebooklm'
                    ? 'bg-amber-500/15 border-amber-500 text-text font-bold shadow-xs'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                  <Library className="w-3.5 h-3.5" />
                  <span>NotebookLM Doc</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Source doc audio podcast</div>
              </button>
            </div>

            {/* Action Bar (Copy + Download) */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 btn-cta text-xs !py-2.5 justify-center shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Konten {outputTab.toUpperCase()} Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Format {outputTab === 'prompt' ? 'Magic Prompt AI' : outputTab === 'gamma' ? 'Outline Gamma' : outputTab === 'vba' ? 'Script VBA PowerPoint' : 'Dokumen NotebookLM'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-bg-deep hover:bg-bg-elev text-xs font-bold text-text flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Download file"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Unduh</span>
              </button>
            </div>

            {/* REALTIME VISIBLE PROMPT TEXT AREA */}
            <div className="relative">
              <textarea
                readOnly
                rows={13}
                value={getCurrentOutputContent()}
                className="w-full p-3.5 rounded-xl bg-bg-deep border border-border font-mono text-[11px] text-text leading-relaxed resize-y focus:outline-none focus:border-accent selection:bg-accent selection:text-white"
              />
            </div>
          </div>

          {/* 16:9 LIVE SLIDE PREVIEW */}
          <div className="surface p-4 sm:p-5 rounded-xl border border-border space-y-3 shadow-sm">
            
            {/* Header Canvas Control */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-text">
                  Pratinjau Layout Slide ({safeIndex + 1} dari {Math.max(slides.length, 1)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                  className="p-1 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={safeIndex >= slides.length - 1}
                  onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, Math.max(slides.length - 1, 0)))}
                  className="p-1 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 16:9 Slide Canvas */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-neutral-800 bg-[#0A0F1D] text-white flex flex-col justify-between p-4 sm:p-6 font-sans select-none">
              
              {/* Top Bar on Slide */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] truncate">
                    {currentSlide?.eyebrow || 'MAGIC PRESENTATION'}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5 truncate">
                    {currentSlide?.title || topic || 'Judul Slide Presentasi'}
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-1 bg-[#002D62] px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="text-[8px] font-black text-white tracking-wider uppercase">
                    {type || 'EXECUTIVE'}
                  </span>
                </div>
              </div>

              {/* Slide Body */}
              <div className="flex-1 py-2 flex flex-col justify-center">
                {safeIndex === 0 ? (
                  <div className="grid grid-cols-[1.2fr_0.9fr] gap-3 items-center h-full">
                    <div className="space-y-1.5">
                      <div className="text-sm sm:text-base font-black leading-tight text-white line-clamp-2">
                        {topic || 'Judul / Topik Presentasi'}
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-white/80 line-clamp-2 leading-relaxed">
                        {currentSlide?.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(currentSlide?.categoryChips || ['STRATEGI', 'EKSEKUTIF', 'AKSI']).map((chip, cIdx) => (
                          <span key={cIdx} className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-full rounded-lg bg-gradient-to-tr from-[#002D62] to-[#047857] border border-white/15 p-2 flex flex-col items-center justify-center text-center">
                      <Sparkles className="w-5 h-5 text-[#10B981] mb-1 animate-pulse" />
                      <div className="text-[9px] font-bold text-white">Visual 3D Photorealistic</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {bullets.map((b, bIdx) => (
                        <div key={bIdx} className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                          <span className="text-[9px] text-white leading-relaxed line-clamp-2">{b}</span>
                        </div>
                      ))}
                    </div>
                    {currentSlide?.goldenTakeaway && (
                      <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-center text-[9px] font-bold text-emerald-300">
                        ★ {currentSlide.goldenTakeaway}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Ribbon */}
              <div className="border-t border-white/10 pt-1.5 flex items-center justify-between text-[8px] text-white/60 font-mono">
                <span className="truncate">{topic || 'Smart Feed'} | {audience || 'Eksekutif'}</span>
                <span className="text-[#10B981] font-bold shrink-0">1 Slide 1 Pesan</span>
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
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
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
                  <span className="text-[11px] font-bold text-text flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-accent" />
                    AI Image Prompt Slide Ini (16:9 Midjourney/Flux)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVisual}
                    className="px-2 py-0.5 rounded bg-accent/15 text-accent hover:bg-accent/25 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedVisual ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVisual ? 'Tersalin' : 'Salin Prompt'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-bg-deep border border-border/80 text-[10px] mono text-text-mut leading-relaxed select-all">
                  {currentSlide.visualPrompt}
                </div>
              </div>
            )}

            {/* Speaker Notes */}
            {currentSlide?.speakerNotes && (
              <div className="surface p-3 rounded-xl border border-border text-xs space-y-0.5">
                <div className="font-bold text-text flex items-center gap-1.5 text-[10px]">
                  <Mic className="w-3 h-3 text-accent" />
                  Catatan Pembicara (Speaker Notes):
                </div>
                <p className="text-text-mut text-[10px] leading-relaxed italic">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
