import { useState, useEffect } from 'react';
import {
  ShieldAlert, FileWarning, Palette, LayoutGrid, Search,
  ExternalLink, Sparkles, RefreshCw, AlertTriangle,
  Flame, Newspaper, Radio, Link2, Globe, X, Maximize2, Minimize2
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import { VERDICT_STATUSES, FACT_CHECK_THEMES } from '../prompts/buildFactCheck.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';
import { showAlert } from '../utils/alerts.js';

// ===================== SUMBER BERITA RESMI =====================
const FACT_CHECK_SOURCES = [
  {
    id: 'turnbackhoax',
    name: 'TurnBackHoax.id',
    desc: 'Database Hoaks Terbesar Indonesia (Mafindo)',
    url: 'https://turnbackhoax.id',
    searchUrl: (q) => `https://turnbackhoax.id/?s=${encodeURIComponent(q)}`,
    color: '#ef4444',
  },
  {
    id: 'cekfakta',
    name: 'CekFakta.com',
    desc: 'Koalisi 24+ Media Nasional Cek Fakta',
    url: 'https://cekfakta.com',
    searchUrl: (q) => `https://cekfakta.com/?s=${encodeURIComponent(q)}`,
    color: '#3b82f6',
  },
];

export default function FactCheckMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState(FACT_CHECK_SOURCES[0]);
  const [iframeUrl, setIframeUrl] = useState(FACT_CHECK_SOURCES[0].url);
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const statusOptions = VERDICT_STATUSES.map((s) => s.label);

  // Search handler — opens search results directly on the selected source website
  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setIframeUrl(activeSource.url);
    } else {
      setIframeUrl(activeSource.searchUrl(q));
    }
    setIframeLoading(true);
  };

  // Switch source website
  const handleSwitchSource = (source) => {
    setActiveSource(source);
    const q = searchQuery.trim();
    if (q) {
      setIframeUrl(source.searchUrl(q));
    } else {
      setIframeUrl(source.url);
    }
    setIframeLoading(true);
  };

  return (
    <div className="space-y-4">
      {/* ===================== SECTION 1: LIVE WEBSITE BROWSER ===================== */}
      <div className="surface rounded-2xl border border-border shadow-sm overflow-hidden bg-gradient-to-br from-bg-elev via-bg to-bg-elev/40">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-sm shrink-0 mt-0.5"
                style={{ backgroundColor: activeSource.color }}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-text leading-tight">
                    Cek Fakta Langsung dari Website Sumber
                  </h3>
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE WEBSITE
                  </span>
                </div>
                <p className="text-xs text-text-mut mt-0.5">
                  Jelajahi ribuan artikel klarifikasi hoaks langsung dari website resmi. Cari berita apa saja, kapan saja.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-2 rounded-xl bg-bg-elev border border-border hover:border-accent text-text-mut hover:text-text font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                title={isExpanded ? 'Perkecil Browser' : 'Perbesar Browser'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isExpanded ? 'Perkecil' : 'Perbesar'}</span>
              </button>
              <a
                href={iframeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-bg-elev border border-border hover:border-accent text-text-mut hover:text-text font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>

          {/* Source Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {FACT_CHECK_SOURCES.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => handleSwitchSource(src)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  activeSource.id === src.id
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-bg-elev border-border text-text-mut hover:text-text hover:border-border-hover'
                }`}
                style={activeSource.id === src.id ? { backgroundColor: src.color } : {}}
                title={src.desc}
              >
                <Globe className="w-3 h-3" />
                {src.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari di ${activeSource.name}: vaksin, gempa, bansos, presiden, subsidi, bpjs, pilkada...`}
                className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-accent transition shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer hover:opacity-90"
              style={{ backgroundColor: activeSource.color }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari di {activeSource.name}</span>
            </button>
          </form>
        </div>

        {/* Embedded Website iframe */}
        <div className="relative" style={{ height: isExpanded ? '80vh' : '460px' }}>
          {iframeLoading && (
            <div className="absolute inset-0 z-10 bg-bg/90 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-accent animate-spin" />
              <p className="text-sm font-semibold text-text-mut">
                Memuat website {activeSource.name}...
              </p>
            </div>
          )}
          <iframe
            src={iframeUrl}
            title={`Live Website ${activeSource.name}`}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            onLoad={() => setIframeLoading(false)}
            style={{ backgroundColor: '#fff' }}
          />
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2.5 border-t border-border bg-bg-elev/50 flex items-center justify-between text-[10px] text-text-dim">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3 h-3" />
            {iframeUrl}
          </span>
          <span className="font-semibold">
            Sumber: {activeSource.name} · {activeSource.desc}
          </span>
        </div>
      </div>

      {/* ===================== SECTION 2: FORM DESAIN CEK FAKTA ===================== */}
      <Section num="A" title="Status Verifikasi & Identitas Redaksi" icon={ShieldAlert}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Putusan / Status Fakta"
            value={state.status}
            onChange={(val) => {
              const matched = VERDICT_STATUSES.find((s) => s.label === val || s.value === val);
              set('status')(matched ? matched.value : val);
            }}
            options={statusOptions}
          />
          <TextField
            label="Nama Unit Cek Fakta / Media"
            value={state.mediaName}
            onChange={set('mediaName')}
            placeholder="TurnBackHoax.id / Cek Fakta Media"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextField
            label="Lokasi / Dateline"
            value={state.dateline}
            onChange={set('dateline')}
            placeholder="JAKARTA"
          />
          <TextField
            label="Tanggal Verifikasi"
            value={state.date}
            onChange={set('date')}
            placeholder="22 Agustus 2026"
          />
        </div>
      </Section>

      <Section num="B" title="Klaim Viral vs Fakta Sebenarnya" icon={FileWarning}>
        <TextareaField
          label="Klaim yang Beredar di Media Sosial (Isu Hoaks/Viral)"
          value={state.claim}
          onChange={set('claim')}
          required
          placeholder="Beredar narasi bahwa..."
          rows={2}
        />
        <div className="mt-3">
          <TextareaField
            label="Fakta Sebenarnya (Hasil Penelusuran Redaksi)"
            value={state.fact}
            onChange={set('fact')}
            required
            placeholder="Hasil penelusuran tim cek fakta membuktikan..."
            rows={3}
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Rujukan / Link Artikel Resmi"
            value={state.officialSource}
            onChange={set('officialSource')}
            placeholder="https://turnbackhoax.id/articles/..."
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Foto Pelengkap / Tangkapan Bukti (Opsional)"
            value={state.supportingPhoto}
            onChange={set('supportingPhoto')}
            placeholder="Contoh: Tangkapan layar postingan medsos"
          />
        </div>
      </Section>

      <Section num="C" title="Gaya Tampilan Verifikasi Visual" icon={Palette}>
        <SelectField
          label="Tema Visual Cek Fakta"
          value={state.visualTheme}
          onChange={set('visualTheme')}
          options={FACT_CHECK_THEMES}
        />
      </Section>

      <Section num="D" title="Format & Aspek Rasio" icon={LayoutGrid}>
        <SelectField
          label="Ukuran / Rasio Feed"
          value={state.aspectRatio}
          onChange={set('aspectRatio')}
          options={NEWS_RATIOS}
        />
      </Section>
    </div>
  );
}
