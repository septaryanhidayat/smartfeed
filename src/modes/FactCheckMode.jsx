import { useState, useEffect } from 'react';
import {
  ShieldAlert, CheckCircle, FileWarning, Palette, LayoutGrid, Search,
  ExternalLink, Sparkles, RefreshCw, Globe, Check, AlertTriangle, HelpCircle,
  Flame, BookOpen, Layers, Newspaper
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import { VERDICT_STATUSES, FACT_CHECK_THEMES } from '../prompts/buildFactCheck.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';
import { searchFactChecks, TRENDING_FACT_CHECKS } from '../services/factCheckService.js';
import { showAlert } from '../utils/alerts.js';

export default function FactCheckMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(TRENDING_FACT_CHECKS);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [autoFilledSuccess, setAutoFilledSuccess] = useState(false);

  const statusOptions = VERDICT_STATUSES.map((s) => s.label);

  // Search CekFakta Database
  const handleSearch = async (query = searchQuery) => {
    setIsSearching(true);
    try {
      const results = await searchFactChecks(query);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Filter by Trending Topic
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
        mediaName: item.publisher || 'Cek Fakta Media Indonesia',
        claim: item.claim,
        fact: item.fact,
        officialSource: `${item.publisher} (${item.sourceUrl})`,
        dateline: item.dateline || 'JAKARTA',
        date: item.reviewDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      },
    });

    setAutoFilledSuccess(true);
    setTimeout(() => setAutoFilledSuccess(false), 2500);

    showAlert({
      title: 'Data Cek Fakta Diterapkan!',
      text: `Klaim dari "${item.publisher}" berhasil dimuat ke formulir desain visual.`,
      icon: 'success',
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP SECTION: LIVE SEARCH & CRAWLER FROM CEKFAKTA.COM & TURNBACKHOAX */}
      <div className="surface p-4 sm:p-5 rounded-2xl border border-border shadow-sm space-y-3.5 bg-gradient-to-br from-bg-elev via-bg to-bg-elev/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <span>Pencarian Database CekFakta.com & TurnBackHoax.id</span>
                <span className="text-[10px] bg-rose-500/15 text-rose-500 font-extrabold px-2 py-0.2 rounded-full border border-rose-500/30">
                  Live Koalisi
                </span>
              </h3>
              <p className="text-[11px] text-text-mut">
                Cari klarifikasi hoaks dari 24+ media nasional terverifikasi (Kompas, Tempo, Liputan6, Mafindo, dll.)
              </p>
            </div>
          </div>
          <a
            href="https://cekfakta.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Buka Portal CekFakta.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
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
              placeholder="Cari isu/kata kunci viral: Bansos, Gempa, Vaksin, Ijazah, Video Deepfake..."
              className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-rose-500 transition shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isSearching ? 'Mencari...' : 'Cari Cek Fakta'}</span>
          </button>
        </form>

        {/* Quick Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-text-dim font-medium text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Trending:
          </span>
          {[
            'Bansos Tunai',
            'Megathrust BMKG',
            'Deepfake Pidato',
            'Kuota Kemenkes',
            'Obat Herbal DBD',
            'Rekrutmen BUMN',
          ].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleQuickTopic(topic)}
              className="px-2.5 py-0.5 rounded-lg bg-bg-elev border border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-text-mut hover:text-text shrink-0 transition cursor-pointer text-[10px] font-medium"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Search Results Grid */}
        <div className="space-y-2 pt-1 max-h-[340px] overflow-y-auto pr-1">
          {searchResults.map((item) => {
            const isSelected = selectedResultId === item.id;
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
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          isHoax
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
                      Klaim: "{item.claim}"
                    </div>

                    <div className="text-[11px] text-text-mut leading-relaxed line-clamp-2">
                      <strong>Fakta:</strong> {item.fact}
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
                        className="text-[10px] text-text-dim hover:text-accent hover:underline flex items-center gap-0.5 px-2 py-1"
                      >
                        <span>Baca Rujukan</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {searchResults.length === 0 && (
            <div className="text-center py-6 text-text-dim text-xs">
              Tidak ditemukan hasil cek fakta untuk "{searchQuery}".
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
            placeholder="Cek Fakta Media Indonesia"
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
          placeholder="Beredar narasi bahwa BMKG mengeluarkan peringatan dini tsunami setinggi 15 meter..."
          rows={2}
        />
        <div className="mt-3">
          <TextareaField
            label="Fakta Sebenarnya (Hasil Penelusuran Redaksi)"
            value={state.fact}
            onChange={set('fact')}
            required
            placeholder="BMKG menegaskan narasi tersebut sepenuhnya PALSU. Pantauan sensor seismik dan buoy laut selatan normal..."
            rows={3}
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Rujukan / Sumber Klarifikasi Resmi"
            value={state.officialSource}
            onChange={set('officialSource')}
            placeholder="Klarifikasi Resmi BMKG Pusat (No. Pers: 08/KLARIF/BMKG/2026)"
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
