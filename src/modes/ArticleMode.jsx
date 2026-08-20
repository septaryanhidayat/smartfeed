import {
  Newspaper, AlignLeft, UserCheck, Settings, Globe, FileText,
  Sliders, Tag, Sparkles, MessageSquare, Quote, BookOpen
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import {
  ARTICLE_FORMATS, ARTICLE_RUBRICS, TARGET_MEDIA,
  ARTICLE_TONES, ARTICLE_LENGTHS
} from '../data/articleOptions.js';

export default function ArticleMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Informasi Dasar & Rubrik */}
      <Section num="1" title="Topik & Rubrik Berita" icon={Newspaper}>
        <TextField
          label="Judul Utama / Topik Berita"
          value={state.headline}
          onChange={set('headline')}
          placeholder="Contoh: Kenaikan Anggaran Pendidikan dan Dampaknya bagi Guru Honorer"
        />

        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <SelectField
            label="Rubrik / Kategori"
            value={state.rubric}
            onChange={set('rubric')}
            options={ARTICLE_RUBRICS}
          />
          <TextField
            label="Nama Media / Redaksi"
            value={state.mediaName}
            onChange={set('mediaName')}
            placeholder="Default: Media Indonesia"
          />
          <TextField
            label="Lokasi & Tanggal (Dateline)"
            value={state.dateline}
            onChange={set('dateline')}
            placeholder="Contoh: JAKARTA, 20 Agustus 2026"
          />
        </div>
      </Section>

      {/* 2. Format Tulisan & Target Media */}
      <Section num="2" title="Format & Saluran Media" icon={Globe}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Format Penulisan Jurnalistik:
            </label>
            <select
              value={state.format}
              onChange={(e) => set('format')(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-elev border border-border text-xs text-text focus:border-accent outline-none font-medium"
            >
              {ARTICLE_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-text-dim mt-1">
              {ARTICLE_FORMATS.find((f) => f.value === state.format)?.desc}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Target Media Publikasi:
            </label>
            <select
              value={state.targetMedia}
              onChange={(e) => set('targetMedia')(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-elev border border-border text-xs text-text focus:border-accent outline-none font-medium"
            >
              {TARGET_MEDIA.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-text-dim mt-1">
              {TARGET_MEDIA.find((m) => m.value === state.targetMedia)?.desc}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <SelectField
            label="Tone & Sudut Pandang"
            value={state.tone}
            onChange={set('tone')}
            options={ARTICLE_TONES}
          />
          <SelectField
            label="Panjang Artikel"
            value={state.length}
            onChange={set('length')}
            options={ARTICLE_LENGTHS}
          />
        </div>
      </Section>

      {/* 3. Fakta 5W+1H & Pernyataan Narasumber */}
      <Section num="3" title="Fakta Lapangan & Kutipan Narasumber" icon={Quote}>
        <TextareaField
          label="Fakta Kunci & Kronologi Kejadian (5W + 1H)"
          value={state.facts}
          onChange={set('facts')}
          placeholder="Tuliskan fakta penting kejadian: Apa yang terjadi, siapa yang terlibat, mengapa, dan kronologinya..."
          rows={3}
        />

        <div className="mt-3">
          <TextareaField
            label="Narasumber & Kutipan Pernyataan (Quotes)"
            value={state.quotes}
            onChange={set('quotes')}
            placeholder='Contoh: Menteri Keuangan: "Alokasi anggaran ini difokuskan pada peningkatan fasilitas di daerah terdepan."'
            rows={2}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextField
            label="Sumber Data / Bukti / Dokumen Acuan"
            value={state.sourceDetails}
            onChange={set('sourceDetails')}
            placeholder="Contoh: Laporan BPS, Rilis Resmi Istana, Riset ICW"
          />
          <TextField
            label="Kata Kunci / Fokus SEO (Opsional)"
            value={state.keywords}
            onChange={set('keywords')}
            placeholder="Contoh: Anggaran Pendidikan 2026, Guru Honorer"
          />
        </div>

        <div className="mt-3">
          <TextField
            label="Catatan Khusus / Angle Tambahan (Opsional)"
            value={state.additionalNotes}
            onChange={set('additionalNotes')}
            placeholder="Contoh: Berikan penekanan pada nasib guru di pelosok daerah"
          />
        </div>
      </Section>
    </div>
  );
}
