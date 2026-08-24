import { Mic, User, MessageSquare, Camera, LayoutGrid } from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import { PORTRAIT_STYLES, QUOTE_CONTEXTS, QUOTE_LIGHTINGS } from '../prompts/buildQuoteCard.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';

export default function QuoteCardMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-3">
      <Section num="A" title="Identitas Tokoh & Narasumber" icon={User}>
        <div className="grid sm:grid-cols-2 gap-3">
          <TextField
            label="Nama Lengkap & Gelar Narasumber"
            value={state.sourceName}
            onChange={set('sourceName')}
            required
            placeholder="Prof. Mahfud Santoso, S.H., M.Hum."
          />
          <TextField
            label="Jabatan / Afiliasi Resmi"
            value={state.sourceRole}
            onChange={set('sourceRole')}
            required
            placeholder="Pakar Hukum Tata Negara & Pengamat Kebijakan Publik"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <TextField
            label="Nama Media / Redaksi"
            value={state.mediaName}
            onChange={set('mediaName')}
            placeholder="Media Indonesia"
          />
          <TextField
            label="Lokasi (Dateline)"
            value={state.dateline}
            onChange={set('dateline')}
            placeholder="JAKARTA"
          />
          <TextField
            label="Tanggal Pernyataan"
            value={state.date}
            onChange={set('date')}
            placeholder="20 Agustus 2026"
          />
        </div>
      </Section>

      <Section num="B" title="Kutipan Pernyataan (Quote)" icon={MessageSquare}>
        <TextareaField
          label="Pernyataan Langsung Narasumber"
          value={state.quote}
          onChange={set('quote')}
          required
          placeholder="Penegakan hukum tidak boleh tebang pilih. Jika bukti formil dan materiil sudah lengkap, pengadilan adalah tempat paling adil untuk membuktikan kebenaran."
          rows={3}
        />
        <div className="mt-3">
          <SelectField
            label="Konteks / Momen Pernyataan"
            value={state.context}
            onChange={set('context')}
            options={QUOTE_CONTEXTS}
          />
        </div>
      </Section>

      <Section num="C" title="Gaya Visual Potret Tokoh & Foto" icon={Camera}>
        <div className="mb-3">
          <ImageUploadField
            label="Pilih File Foto Tokoh / Narasumber (Opsional)"
            value={state.imagePreview || state.sourcePhoto}
            fileName={state.imageName}
            onChange={(preview, file, name) => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: preview });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: name });
            }}
            onRemove={() => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: '' });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: '' });
            }}
            hint="Upload foto portrait narasumber/tokoh untuk dijadikan acuan visual pada kartu kutipan."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Gaya Potret Editorial"
            value={state.portraitStyle}
            onChange={set('portraitStyle')}
            options={PORTRAIT_STYLES}
          />
          <SelectField
            label="Pencahayaan Studio / Ruangan"
            value={state.lighting}
            onChange={set('lighting')}
            options={QUOTE_LIGHTINGS}
          />
        </div>

        <div className="mt-3">
          <TextField
            label="Foto Pelengkap / Latar Suasana (Opsional)"
            value={state.supportingPhoto}
            onChange={set('supportingPhoto')}
            placeholder="Contoh: Latar mimbar konferensi pers dengan mikrofon stasiun TV"
          />
        </div>
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
