import { useState, useMemo } from 'react';
import {
  Presentation, Sparkles, LayoutTemplate, Layers, Palette, Users, BookOpen,
  ChevronLeft, ChevronRight, Copy, Check, Download, Wand2, Mic, Eye, FileText, MonitorPlay,
  CheckCircle2, Target, Award, ArrowRight, TrendingUp, ShieldCheck, Flame, Compass, Shuffle, Briefcase,
  Code2, ExternalLink, Library, Rocket, Clock, Globe, BarChart3, HelpCircle, ChevronDown, CheckSquare, Square
} from 'lucide-react';
import {
  PRESENTATION_TYPES,
  PRESENTATION_SLIDE_OPTIONS,
  PRESENTATION_DURATIONS,
  PRESENTATION_LANGUAGES,
  PRESENTATION_DESIGN_STYLES,
  PRESENTATION_VISUAL_ELEMENTS,
  PRESENTATION_TONES,
  PRESENTATION_PRINCIPLES,
  PRESENTATION_DEMOS,
} from '../data/presentationOptions.js';
import { buildPresentation } from '../prompts/buildPresentation.js';

export default function PresentationMode({ state, onChangeField, onSetState }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [outputTab, setOutputTab] = useState('prompt'); // 'prompt' | 'gamma' | 'vba' | 'notebooklm'
  const [copied, setCopied] = useState(false);
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [generatedFlash, setGeneratedFlash] = useState(false);

  const {
    topic = 'Strategi Growth Hacking untuk Startup SaaS B2B',
    type = 'Pitching ke Investor',
    audience = 'Investor Series A, Tim Marketing, CEO Startup',
    slideCount = 10,
    duration = '10-15 menit',
    language = 'Indonesia',
    keyPoints = '- Masalah utama: Customer Acquisition Cost (CAC) industri SaaS naik 60%\n- Solusi: Framework Growth Flywheel berbasis Product-Led Growth (PLG)\n- Ukuran pasar & peluang di Asia Tenggara (TAM $12B)\n- Model monetisasi & proyeksi recurring revenue (ARR)\n- Traction saat ini: 1.200 pengguna aktif berbayar, NPS 72\n- Dana yang dibutuhkan $500K untuk ekspansi tim engineer dan akuisisi',
    dataEvidence = 'Market size $12B, growth rate 35% YoY, 1.200 pengguna aktif, CAC payback period 4 bulan, NPS score 72.',
    mainCta = 'Investor commit funding $500K untuk ekspansi regional 12 bulan ke depan.',
    designStyle = 'Startup Inovatif',
    colorScheme = 'Obsidian Black (#0A0F1D) + Emerald Neon (#10B981) + Pure White',
    visualElements = ['Infografis & Diagram', 'Grafik & Chart', 'Mockup Produk', 'Comparison Table'],
    tone = 'Data-driven',
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
    subtitle: `Disusun untuk: ${audience}`,
    categoryChips: ['STRATEGI', 'DATA', 'INOVASI', 'EKSEKUSI']
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

  const handleTriggerGenerate = () => {
    setGeneratedFlash(true);
    setTimeout(() => setGeneratedFlash(false), 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* ── HEADER BADGE & BANNER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>✦ MAGIC PROMPT GENERATOR</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30">BETA</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          <span className="bg-gradient-to-r from-sky-400 via-accent to-emerald-400 bg-clip-text text-transparent">Magic Prompt</span> Presentasi PPT
        </h1>

        <p className="text-xs sm:text-sm text-text-mut leading-relaxed max-w-2xl mx-auto">
          Isi form di bawah, lalu klik <strong className="text-white">Generate</strong> untuk mendapatkan prompt lengkap siap pakai berdasarkan prinsip-prinsip desain presentasi terbaik.
        </p>

        {/* 5 Presentation Principles Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {PRESENTATION_PRINCIPLES.map((pr, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-panel border border-border/80 text-[11px] font-semibold text-text-mut"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{pr}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── TOP PRESET & RANDOMIZE BAR ── */}
      <div className="surface p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-border shadow-xs max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Presentation className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text">Pilih Kasus Demo Siap Pakai:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESENTATION_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadDemo(demo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                topic === demo.topic
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-bg-panel hover:bg-bg-elev border-border text-text-mut hover:text-text'
              }`}
            >
              <span>{demo.tag}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={handleRandomizeDemo}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition flex items-center gap-1.5 cursor-pointer"
            title="Acak template presentasi"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Template</span>
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN MAIN STUDIO LAYOUT: FORM INPUT (LEFT) + OUTPUT EXPORTER (RIGHT) ── */}
      <div className="grid lg:grid-cols-[1.1fr_1.15fr] gap-8 items-start max-w-6xl mx-auto">
        
        {/* LEFT COLUMN: 4 SECTION STRUCTURED MAGIC FORM */}
        <div className="space-y-6">

          {/* BAGIAN 1 — IDENTITAS PRESENTASI */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-sky-400 flex items-center gap-2 border-b border-border pb-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-extrabold text-[11px]">1</span>
              <span>BAGIAN 1 — IDENTITAS PRESENTASI</span>
            </div>

            <div className="space-y-4">
              {/* 1. Judul / Topik */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  1. Judul / Topik Presentasi *
                </label>
                <input
                  type="text"
                  value={topic || ''}
                  onChange={(e) => onChangeField && onChangeField('topic', e.target.value)}
                  placeholder="contoh: Strategi Growth Hacking untuk Startup SaaS B2B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
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
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                        type === tItem
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-xs font-bold'
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
                  placeholder="contoh: Investor Series A, tim marketing, CEO startup"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 4. Jumlah Slide, 5. Durasi, 6. Bahasa */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    4. Jumlah Slide
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESENTATION_SLIDE_OPTIONS.map((sOpt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChangeField && onChangeField('slideCount', sOpt.value)}
                        className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition cursor-pointer ${
                          Number(slideCount) === sOpt.value
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-xs font-bold'
                            : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                        }`}
                      >
                        {sOpt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
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
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                            duration === dItem
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
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
                    <div className="flex flex-wrap gap-1">
                      {PRESENTATION_LANGUAGES.map((lItem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onChangeField && onChangeField('language', lItem)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                            language === lItem
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
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
          </div>

          {/* BAGIAN 2 — KONTEN & PESAN */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-2 border-b border-border pb-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[11px]">2</span>
              <span>BAGIAN 2 — KONTEN &amp; PESAN</span>
            </div>

            <div className="space-y-4">
              {/* 7. Poin Utama */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  7. Poin Utama yang Harus Disampaikan
                </label>
                <div className="text-[10px] text-text-dim mb-1">Tuliskan 4-6 poin kunci yang wajib ada dalam presentasi</div>
                <textarea
                  rows={4}
                  value={keyPoints || ''}
                  onChange={(e) => onChangeField && onChangeField('keyPoints', e.target.value)}
                  placeholder="- Masalah utama di industri&#10;- Solusi inovatif yang ditawarkan&#10;- Model bisnis & traction&#10;- Roadmap implementasi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              {/* 8. Data / Bukti / Statistik */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  8. Data / Bukti / Statistik yang Akan Digunakan
                </label>
                <div className="text-[10px] text-text-dim mb-1">Sebutkan data spesifik, hasil riset, atau angka yang ingin dimasukkan</div>
                <textarea
                  rows={2}
                  value={dataEvidence || ''}
                  onChange={(e) => onChangeField && onChangeField('dataEvidence', e.target.value)}
                  placeholder="Contoh: Market size $5B, growth rate 30% YoY, 1.200 pengguna aktif, NPS score 72..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>

              {/* 9. Pesan Utama / CTA */}
              <div>
                <label className="block text-xs font-bold text-text mb-1">
                  9. Pesan Utama / Call to Action
                </label>
                <div className="text-[10px] text-text-dim mb-1">Apa yang ingin audiens lakukan atau diputuskan setelah melihat presentasi ini?</div>
                <input
                  type="text"
                  value={mainCta || ''}
                  onChange={(e) => onChangeField && onChangeField('mainCta', e.target.value)}
                  placeholder="contoh: Investor commit funding $500K, Klien setuju pilot project 3 bulan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3 — GAYA DESAIN VISUAL */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-2 border-b border-border pb-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-[11px]">3</span>
              <span>BAGIAN 3 — GAYA DESAIN VISUAL</span>
            </div>

            <div className="space-y-4">
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
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                        designStyle === dStyle.label
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs font-bold'
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
                  11. Skema Warna Utama
                </label>
                <input
                  type="text"
                  value={colorScheme || ''}
                  onChange={(e) => onChangeField && onChangeField('colorScheme', e.target.value)}
                  placeholder="contoh: Biru langit + hitam, Navy + kuning neon, Emerald + slate..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none"
                />
              </div>

              {/* 12. Elemen Visual yang Diinginkan */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  12. Elemen Visual yang Diinginkan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESENTATION_VISUAL_ELEMENTS.map((elem, idx) => {
                    const isSelected = Array.isArray(visualElements) && visualElements.includes(elem);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleVisualElement(elem)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-accent/20 text-accent border-accent font-bold shadow-xs'
                            : 'bg-bg-deep text-text-mut border-border/80 hover:text-text'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3 h-3 text-accent" /> : <Square className="w-3 h-3 text-text-dim" />}
                        <span>{elem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 4 — INSTRUKSI TAMBAHAN (OPSIONAL) */}
          <div className="surface p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold tracking-wider uppercase text-purple-400 flex items-center gap-2 border-b border-border pb-2.5">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold text-[11px]">4</span>
              <span>BAGIAN 4 — INSTRUKSI TAMBAHAN (OPSIONAL)</span>
            </div>

            <div className="space-y-4">
              {/* 13. Tone / Gaya Bahasa */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  13. Tone / Gaya Bahasa
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESENTATION_TONES.map((tItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChangeField && onChangeField('tone', tItem)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                        tone === tItem
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-xs font-bold'
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
                  14. Informasi Tambahan / Konteks Khusus
                </label>
                <textarea
                  rows={2}
                  value={extraNotes || ''}
                  onChange={(e) => onChangeField && onChangeField('extraNotes', e.target.value)}
                  placeholder="contoh: Nama perusahaan PT Maju Digital, industri fintech, sudah ada deck sebelumnya yg ingin di-refresh, dll."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-deep border border-border text-xs text-text focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* MAIN GENERATE MAGIC PROMPT CTA BUTTON */}
          <button
            type="button"
            onClick={handleTriggerGenerate}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm text-white shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
              generatedFlash
                ? 'bg-emerald-500 ring-4 ring-emerald-500/30'
                : 'bg-gradient-to-r from-sky-500 via-accent to-emerald-500 hover:opacity-95'
            }`}
          >
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>✦ Generate Magic Prompt Presentasi</span>
          </button>

        </div>

        {/* RIGHT COLUMN: MULTI-ENGINE EXPORT TABS + 16:9 LIVE CANVAS PREVIEW */}
        <div className="space-y-6">

          {/* FORMAT TABS EXPORTER (MAGIC PROMPT, GAMMA, VBA, NOTEBOOKLM) */}
          <div className="surface p-5 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="text-xs font-bold text-text flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Format Output Siap Pakai:</span>
              </div>
              <span className="text-[10px] mono px-2 py-0.5 rounded bg-accent/15 text-accent font-bold">16:9 Widescreen</span>
            </div>

            {/* 4 Engine Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutputTab('prompt')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  outputTab === 'prompt'
                    ? 'bg-sky-500/15 border-sky-500 text-text font-bold shadow-xs'
                    : 'bg-bg-panel border-border text-text-mut hover:text-text'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-sky-400">
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
                <div className="flex items-center gap-1.5 text-xs text-purple-400">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Gamma / Canva</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">1-click import outline slide</div>
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
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
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
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Library className="w-3.5 h-3.5" />
                  <span>NotebookLM Doc</span>
                </div>
                <div className="text-[10px] text-text-dim mt-0.5">Source doc audio podcast</div>
              </button>
            </div>

            {/* Quick guide alert */}
            <div className="p-3 rounded-xl bg-bg-deep border border-border text-[11px] text-text-mut leading-relaxed">
              {outputTab === 'prompt' && (
                <div>
                  🪄 <strong>Cara Pakai</strong>: Salin seluruh Magic Prompt ini, lalu paste ke <strong>ChatGPT 4o, Claude 3.5 Sonnet, atau Gemini Pro</strong> untuk langsung menghasilkan naskah presentasi berstandar McKinsey/BCG lengkap dengan AI Image Prompt &amp; Speaker Notes!
                </div>
              )}
              {outputTab === 'gamma' && (
                <div>
                  🚀 <strong>Cara Pakai di Gamma.app / Canva</strong>: Buka <a href="https://gamma.app" target="_blank" rel="noreferrer" className="text-accent underline">gamma.app</a> &gt; Klik <em>Create New</em> &gt; <em>Paste in Text</em> &gt; Paste outline ini &gt; Pilih tema desain. Gamma akan membuat slide 16:9 beresolusi tinggi otomatis!
                </div>
              )}
              {outputTab === 'vba' && (
                <div>
                  💻 <strong>Cara Pakai di Microsoft PowerPoint</strong>: Buka PowerPoint kosong &gt; Tekan <code>Alt + F11</code> &gt; Klik <code>Insert &gt; Module</code> &gt; Paste kode VBA ini &gt; Tekan <code>F5</code>. PowerPoint akan membuat seluruh slide 16:9 langsung di aplikasi tanpa corrupt!
                </div>
              )}
              {outputTab === 'notebooklm' && (
                <div>
                  🎙️ <strong>Cara Pakai di Google NotebookLM</strong>: Download file .MD ini, lalu buka <a href="https://notebooklm.google.com" target="_blank" rel="noreferrer" className="text-accent underline">notebooklm.google.com</a> dan upload sebagai <em>Source Document</em> untuk membuat <strong>Podcast Diskusi AI (Audio Overview)</strong> dan FAQ cerdas otomatis!
                </div>
              )}
            </div>

            {/* Copy & Download Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full btn-cta text-xs !py-3 justify-center shadow-md cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
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
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-deep hover:bg-bg-elev text-xs font-bold text-text flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Download File ({outputTab === 'vba' ? '.VBA / .TXT' : '.MD'})</span>
              </button>
            </div>
          </div>

          {/* 16:9 LIVE INTERACTIVE MASTERCLASS DECK CANVAS */}
          <div className="space-y-3">
            {/* Header Canvas Control */}
            <div className="flex items-center justify-between bg-bg-panel border border-border px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text">
                  Slide {safeIndex + 1} dari {Math.max(slides.length, 1)}
                </span>
                <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                  16:9 Canvas
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                  className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={safeIndex >= slides.length - 1}
                  onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, Math.max(slides.length - 1, 0)))}
                  className="p-1.5 rounded-lg border border-border hover:bg-bg-elev disabled:opacity-40 disabled:cursor-not-allowed text-text cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 16:9 Slide Canvas */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-[#0A0F1D] text-white flex flex-col justify-between p-6 sm:p-8 font-sans select-none">
              
              {/* Top Bar on Slide */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#10B981]">
                    {currentSlide?.eyebrow || 'MAGIC PRESENTATION'}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5 line-clamp-1">
                    {currentSlide?.title || topic}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 line-clamp-1">
                    {currentSlide?.subtitle || ''}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 bg-[#002D62] px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[9px] font-black text-white tracking-wider uppercase">
                    {type || 'EXECUTIVE'}
                  </span>
                </div>
              </div>

              {/* Slide Body */}
              <div className="flex-1 py-3 flex flex-col justify-center">
                {safeIndex === 0 ? (
                  <div className="grid grid-cols-[1.2fr_0.9fr] gap-3 items-center h-full">
                    <div className="space-y-2">
                      <div className="text-base sm:text-xl font-black leading-tight text-white line-clamp-2">
                        {topic}
                      </div>
                      <p className="text-[10px] text-white/80 line-clamp-2 leading-relaxed">
                        {currentSlide?.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(currentSlide?.categoryChips || ['STRATEGI', 'DATA', 'INOVASI', 'EKSEKUSI']).map((chip, cIdx) => (
                          <span key={cIdx} className="text-[8px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-full rounded-xl bg-gradient-to-tr from-[#002D62] to-[#047857] border border-white/15 p-3 flex flex-col items-center justify-center text-center">
                      <Sparkles className="w-8 h-8 text-[#10B981] mb-1.5 animate-pulse" />
                      <div className="text-[10px] font-bold text-white">Visual 3D Photorealistic</div>
                      <div className="text-[8px] text-white/60">High-Impact 16:9 Presentation</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {bullets.map((b, bIdx) => (
                        <div key={bIdx} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span className="text-[10px] text-white leading-relaxed line-clamp-3">{b}</span>
                        </div>
                      ))}
                    </div>
                    {currentSlide?.goldenTakeaway && (
                      <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-center text-[10px] font-bold text-emerald-300">
                        ★ {currentSlide.goldenTakeaway}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Ribbon */}
              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] text-white/60 font-mono">
                <span className="truncate">{topic} | {audience}</span>
                <span className="text-[#10B981] font-bold shrink-0">1 Slide 1 Pesan · Data &amp; Bukti</span>
              </div>
            </div>

            {/* Slide Navigation Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(slides || []).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 border cursor-pointer ${
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
              <div className="surface p-4 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    AI Image Prompt Slide Ini (16:9 Midjourney/Flux)
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
            {currentSlide?.speakerNotes && (
              <div className="surface p-3.5 rounded-xl border border-border text-xs space-y-1">
                <div className="font-bold text-text flex items-center gap-1.5 text-[11px]">
                  <Mic className="w-3.5 h-3.5 text-accent" />
                  Catatan Pembicara (Speaker Notes):
                </div>
                <p className="text-text-mut text-[11px] leading-relaxed italic">
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
