import { Briefcase, Target, Mic } from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import {
  OBJECTIVES, PLATFORMS, WRITING_STYLES, GREETINGS,
} from '../data/copywritingOptions.js';

export default function CopywritingMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-3">
      <Section num="1" title="Konteks Bisnis & Foto Produk" icon={Briefcase}>
        <div className="mb-3">
          <ImageUploadField
            label="Pilih File Foto Produk / Materi Iklan (Opsional)"
            value={state.imagePreview || state.product_image}
            fileName={state.imageName}
            onChange={(preview, file, name) => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: preview });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: name });
            }}
            onRemove={() => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: '' });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: '' });
            }}
            hint="Upload foto produk untuk membantu acuan penulisan angle copywriting yang spesifik."
          />
        </div>
        <TextareaField
          label="Ringkasan Produk / Penawaran"
          value={state.summary}
          onChange={set('summary')}
          placeholder="Contoh: Sepatu lari ultra ringan dengan teknologi sol empuk, diskon 50% khusus hari ini..."
          rows={3}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextField
            label="Target Audiens"
            value={state.audience}
            onChange={set('audience')}
            placeholder="Contoh: Pekerja kantoran usia 25–35 tahun"
          />
          <TextField
            label="Marketing Angle"
            value={state.angle}
            onChange={set('angle')}
            placeholder="Contoh: Hemat waktu, lebih sehat, tampil percaya diri"
          />
        </div>
      </Section>

      <Section num="2" title="Strategi Iklan" icon={Target}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Tujuan Iklan (Objective)"
            value={state.objective}
            onChange={set('objective')}
            options={OBJECTIVES}
          />
          <SelectField
            label="Platform Penempatan"
            value={state.platform}
            onChange={set('platform')}
            options={PLATFORMS}
          />
        </div>
      </Section>

      <Section num="3" title="Voice & Persona" icon={Mic}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Style Penulisan"
            value={state.style}
            onChange={set('style')}
            options={WRITING_STYLES}
          />
          <SelectField
            label="Sapaan ke Audiens"
            value={state.greeting}
            onChange={set('greeting')}
            options={GREETINGS}
          />
        </div>
      </Section>
    </div>
  );
}
