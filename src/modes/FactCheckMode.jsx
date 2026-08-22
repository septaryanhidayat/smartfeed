import { useState, useEffect } from 'react';
import {
  ShieldAlert, CheckCircle, FileWarning, Palette, LayoutGrid, Search,
  ExternalLink, Sparkles, RefreshCw, Globe, Check, AlertTriangle, HelpCircle,
  Flame, BookOpen, Layers, Newspaper, Radio, CheckCircle2
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import { VERDICT_STATUSES, FACT_CHECK_THEMES } from '../prompts/buildFactCheck.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';
import { searchFactChecks, fetchLiveFactChecks, REAL_ARCHIVE_FALLBACK } from '../services/factCheckService.js';
import { showAlert } from '../utils/alerts.js';

export default function FactCheckMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(REAL_ARCHIVE_FALLBACK);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);

  const statusOptions = VERDICT_STATUSES.map((s) => s.label);

  // Auto-fetch 100% REAL LIVE Articles on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveFeed() {
      setIsSearching(true);
      try {
        const liveData = await fetchLiveFactChecks(false);
        if (isMounted && liveData.length > 0) {
          setSearchResults(liveData);
          setIsLiveLoaded(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }
    loadLiveFeed();
    return () => { isMounted = false; };
  }, []);

  // Search CekFakta & TurnBackHoax Live Database
  const handleSearch = async (query = searchQuery, force = false) => {
    setIsSearching(true);
    try {
      const results = await searchFactChecks(query, force);
      setSearchResults(results);
      setIsLiveLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Filter by Keyword
  const handleQuickTopic = (topic) => {
    setSearchQuery(topic);
    handleSearch(topic);
  };

  // Auto-Fill Form from Fact Check Result
  const handleApplyFactCheck = (item) => {
    setSelectedResultId(item.id);
    dispatch({
      type: 'RESET_TO',
      state: {
        ...state,
        status: item.rating,
        mediaName: item.publisher || 'TurnBackHoax.id / CekFakta',
        claim: item.claim,
        fact: item.fact,
        officialSource: `${item.publisher} (${item.sourceUrl})`,
        dateline: item.dateline || 'JAKARTA',
        date: item.reviewDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      },
    });

    showAlert({
      title: 'Data Berita Real Berhasil Dimuat!',
      text: `Klarifikasi hoaks dari "${item.publisher}" otomatis diterapkan ke formulir desain visual.`,
      icon: 'success',
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP SECTION: LIVE CRAWLER & SEARCH ENGINE FROM TURNBACKHOAX.ID & CEKFAKTA.COM */}
      <div className="surface p-4 sm:p-5 rounded-2xl border border-border shadow-sm space-y-3.5 bg-gradient-to-br from-bg-elev via-bg to-bg-elev/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text">Live Feed CekFakta.com & TurnBackHoax.id</h3>
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-black px-2 py-0.2 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  REAL-TIME RSS
                </span>
              </div>
              <p className="text-[11px] text-text-mut mt-0.5">
                Menarik langsung berita klarifikasi hoaks asli dari Mafindo, CekFakta, Kompas, dan Tempo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSearch(searchQuery, true)}
              disabled={isSearching}
              className="px-3 py-1.5 rounded-xl bg-bg-elev border border-border hover:border-rose-500 text-text-mut hover:text-text font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Refresh stream artikel hoaks terbaru"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
            <a
              href="https://turnbackhoax.id"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs flex items-center gap-1 transition"
            >
              <span>Portal Asli</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita hoaks asli: Israel, Khofifah, Bangkalan, Dana Bantuan, Gempa, Pil..."
              className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-rose-500 transition shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isSearching ? 'Menarik...' : 'Cari Berita'}</span>
          </button>
        </form>

        {/* Quick Keyword Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-text-dim font-medium text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Kata Kunci:
          </span>
          {['Semua', 'Dana Bantuan', 'Israel', 'KPK', 'Bupati', 'Kemenkeu', 'Desil', 'Bansos'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleQuickTopic(k === 'Semua' ? '' : k)}
              className={`px-2.5 py-0.5 rounded-lg border transition cursor-pointer text-[10px] font-medium shrink-0 ${
                (k === 'Semua' && !searchQuery) || searchQuery === k
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-bg-elev border-border hover:border-rose-500/50 text-text-mut hover:text-text'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Real Live Articles Feed List */}
        <div className="space-y-2 pt-1 max-h-[360px] overflow-y-auto pr-1">
          {searchResults.map((item) => {
            const isSelected = selectedResultId === item.id;
            const isPenipuan = item.rating.includes('PENIPUAN');
            const isHoax = item.rating.includes('HOAKS') || item.rating.includes('SALAH');
            const isMisleading = item.rating.includes('DISINFORMASI') || item.rating.includes('KONTEKS');

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500 shadow-sm'
                    : 'border-border bg-bg/80 hover:border-border-hover'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          isPenipuan
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : isHoax
                            ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                            : isMisleading
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {item.rating}
                      </span>
                      <span className="text-[10px] font-semibold text-text-dim flex items-center gap-1">
                        <Newspaper className="w-3 h-3 text-accent" /> {item.publisher}
                      </span>
                      <span className="text-[9px] text-text-mut">({item.reviewDate})</span>
                    </div>

                    <div className="text-xs font-bold text-text line-clamp-2 mt-1">
                      {item.rawTitle || item.claim}
                    </div>

                    <div className="text-[11px] text-text-mut leading-relaxed line-clamp-2">
                      <strong>Ringkasan Fakta:</strong> {item.fact}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleApplyFactCheck(item)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gunakan ke Desain</span>
                    </button>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-accent hover:underline flex items-center gap-0.5 px-2 py-1"
                      >
                        <span>Baca Artikel Asli</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {searchResults.length === 0 && !isSearching && (
            <div className="text-center py-6 text-text-dim text-xs">
              Tidak ditemukan artikel berita untuk pencarian "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* 2. FORM SECTION A: STATUS VERIFIKASI & IDENTITAS REDAKSI */}
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

      {/* 3. FORM SECTION B: KLAIM VIRAL VS FAKTA SEBENARNYA */}
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
            placeholder="Contoh: Tangkapan layar postingan medsos dengan cap silang merah HOAKS"
          />
        </div>
      </Section>

      {/* 4. FORM SECTION C: GAYA TAMPILAN VERIFIKASI */}
      <Section num="C" title="Gaya Tampilan Verifikasi Visual" icon={Palette}>
        <SelectField
          label="Tema Visual Cek Fakta"
          value={state.visualTheme}
          onChange={set('visualTheme')}
          options={FACT_CHECK_THEMES}
        />
      </Section>

      {/* 5. FORM SECTION D: FORMAT & ASPEK RASIO */}
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
