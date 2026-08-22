import { useState, useEffect } from 'react';
import {
  ShieldAlert, CheckCircle, FileWarning, Palette, LayoutGrid, Search,
  ExternalLink, Sparkles, RefreshCw, Globe, Check, AlertTriangle, HelpCircle,
  Flame, BookOpen, Layers, Newspaper, Radio, CheckCircle2, Link2
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import { VERDICT_STATUSES, FACT_CHECK_THEMES } from '../prompts/buildFactCheck.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';
import { searchFactChecks, fetchLiveFactChecks, FALLBACK_REAL_ARTICLES } from '../services/factCheckService.js';
import { showAlert } from '../utils/alerts.js';

export default function FactCheckMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(FALLBACK_REAL_ARTICLES);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [totalCount, setTotalCount] = useState(FALLBACK_REAL_ARTICLES.length);
  const [crawlStatus, setCrawlStatus] = useState('loading');

  const statusOptions = VERDICT_STATUSES.map((s) => s.label);

  // Auto-fetch Real Live Articles on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadLiveFeed() {
      setIsSearching(true);
      setCrawlStatus('loading');
      try {
        const liveData = await fetchLiveFactChecks(false);
        if (isMounted && liveData.length > 0) {
          setSearchResults(liveData);
          setTotalCount(liveData.length);
          setCrawlStatus('live');
        } else {
          setCrawlStatus('fallback');
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setCrawlStatus('error');
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }
    loadLiveFeed();
    return () => { isMounted = false; };
  }, []);

  // Search Live Database & Crawl Real Endpoints
  const handleSearch = async (query = searchQuery, force = false) => {
    setIsSearching(true);
    try {
      const results = await searchFactChecks(query, force);
      setSearchResults(results);
      setTotalCount(results.length);
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
        mediaName: item.publisher || 'TurnBackHoax.id (Mafindo)',
        claim: item.claim,
        fact: item.fact,
        officialSource: `${item.publisher} — ${item.sourceUrl}`,
        dateline: item.dateline || 'JAKARTA',
        date: item.reviewDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      },
    });

    showAlert({
      title: 'Data Berita Real Berhasil Dimuat!',
      text: `Klarifikasi hoaks dari "${item.publisher}" berhasil dimasukkan ke formulir desain.`,
      icon: 'success',
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP SECTION: LIVE STREAM DARI WEBSITE SUMBER CEKFAKTA & TURNBACKHOAX */}
      <div className="surface p-4 sm:p-5 rounded-2xl border border-border shadow-sm space-y-4 bg-gradient-to-br from-bg-elev via-bg to-bg-elev/40">
        {/* Header Bar: Clean & Non-Overlapping */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 mt-0.5">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-text leading-tight">
                  Live Feed TurnBackHoax.id & CekFakta.com
                </h3>
                {crawlStatus === 'loading' && (
                  <span className="text-[9px] bg-amber-500/15 text-amber-500 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    CRAWLING...
                  </span>
                )}
                {crawlStatus === 'live' && (
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE · {totalCount} ARTIKEL
                  </span>
                )}
                {crawlStatus === 'fallback' && (
                  <span className="text-[9px] bg-blue-500/15 text-blue-400 font-extrabold px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1 shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    ARSIP TERVERIFIKASI
                  </span>
                )}
                {crawlStatus === 'error' && (
                  <span className="text-[9px] bg-rose-500/15 text-rose-500 font-extrabold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1 shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    OFFLINE · ARSIP LOKAL
                  </span>
                )}
              </div>
              <p className="text-xs text-text-mut leading-normal">
                Menarik berita klarifikasi hoaks langsung dari server website sumber (Mafindo, CekFakta Koalisi). Klik "<strong className="text-text">Buka Website Asli</strong>" untuk membaca artikel lengkap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => handleSearch('', true)}
              disabled={isSearching}
              className="px-3 py-2 rounded-xl bg-bg-elev border border-border hover:border-rose-500 text-text-mut hover:text-text font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Tarik artikel klarifikasi terbaru dari website"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
              <span>Muat Ulang Live</span>
            </button>
            <a
              href="https://turnbackhoax.id"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs flex items-center gap-1 transition"
            >
              <span>Kunjungi Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari langsung di website TurnBackHoax: Israel, Bansos, KPK, Khofifah, Arab Saudi, Gempa..."
              className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-rose-500 transition shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isSearching ? 'Mencari di Server...' : 'Cari Berita Real'}</span>
          </button>
        </form>

        {/* Quick Keyword Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-text-dim font-bold text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Topik Populer:
          </span>
          {['Semua', 'Bansos', 'Israel', 'KPK', 'Bangkalan', 'Arab Saudi', 'BPJS', 'Desil'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleQuickTopic(k === 'Semua' ? '' : k)}
              className={`px-3 py-1 rounded-lg border transition cursor-pointer text-xs font-medium shrink-0 ${
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
        <div className="space-y-2.5 pt-1 max-h-[380px] overflow-y-auto pr-1">
          {searchResults.map((item) => {
            const isSelected = selectedResultId === item.id;
            const isPenipuan = item.rating.includes('PENIPUAN');
            const isHoax = item.rating.includes('HOAKS') || item.rating.includes('SALAH');
            const isMisleading = item.rating.includes('DISINFORMASI') || item.rating.includes('KONTEKS');

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500 shadow-sm'
                    : 'border-border bg-bg/80 hover:border-border-hover'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
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
                      <span className="text-[11px] font-semibold text-text-dim flex items-center gap-1">
                        <Newspaper className="w-3 h-3 text-accent" /> {item.publisher}
                      </span>
                      <span className="text-[10px] text-text-mut">· {item.reviewDate}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-text line-clamp-2 leading-snug">
                      {item.rawTitle || item.claim}
                    </h4>

                    <p className="text-xs text-text-mut leading-relaxed line-clamp-2">
                      <strong className="text-text-dim">Fakta Sebenarnya:</strong> {item.fact}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleApplyFactCheck(item)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gunakan ke Desain</span>
                    </button>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-accent hover:underline flex items-center gap-1 px-1 py-0.5 font-medium"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Buka Website Asli</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {searchResults.length === 0 && !isSearching && (
            <div className="text-center py-8 text-text-dim text-xs">
              Tidak ditemukan artikel berita untuk kata kunci "{searchQuery}". Silakan coba kata kunci lain atau klik Muat Ulang Live.
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
