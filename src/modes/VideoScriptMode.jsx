import {
  Clapperboard, Video, Mic, Film, Sparkles, MessageSquare,
  Clock, Monitor, Sliders, Palette, Tag, Eye
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import {
  SCRIPT_TYPES, VIDEO_DURATIONS, VIDEO_PLATFORMS,
  SCRIPT_TONES, VISUAL_STYLES
} from '../data/videoScriptOptions.js';

export default function VideoScriptMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Format & Platform Video */}
      <Section num="1" title="Format, Konsep Video & Foto Referensi" icon={Clapperboard}>
        <div className="mb-3">
          <ImageUploadField
            label="Pilih File Foto Subjek / Produk / Storyboard Referensi (Opsional)"
            value={state.imagePreview || state.videoPhoto}
            fileName={state.imageName}
            onChange={(preview, file, name) => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: preview });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: name });
            }}
            onRemove={() => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: '' });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: '' });
            }}
            hint="Upload foto produk, talent pembicara, atau moodboard visual untuk panduan naskah & storyboard."
          />
        </div>
        <TextField
          label="Judul Proyek / Topik Utama Video"
          value={state.title}
          onChange={set('title')}
          placeholder="Contoh: 3 Tren AI yang Diam-diam Mengubah Cara Kerja di 2026"
        />

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Tipe & Format Naskah:
            </label>
            <select
              value={state.scriptType}
              onChange={(e) => set('scriptType')(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-elev border border-border text-xs text-text focus:border-accent outline-none font-medium"
            >
              {SCRIPT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-text-dim mt-1">
              {SCRIPT_TYPES.find((t) => t.value === state.scriptType)?.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Target Durasi"
              value={state.duration}
              onChange={set('duration')}
              options={VIDEO_DURATIONS}
            />
            <SelectField
              label="Platform Utama"
              value={state.platform}
              onChange={set('platform')}
              options={VIDEO_PLATFORMS}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <SelectField
            label="Tone & Gaya Pembawaan"
            value={state.tone}
            onChange={set('tone')}
            options={SCRIPT_TONES}
          />
          <SelectField
            label="Gaya Sinematografi & Visual"
            value={state.visualStyle}
            onChange={set('visualStyle')}
            options={VISUAL_STYLES}
          />
        </div>
      </Section>

      {/* 2. Subjek, Narasumber & Poin Pembahasan */}
      <Section num="2" title="Materi, Pembicara & Poin Utama" icon={Mic}>
        <TextField
          label="Profil Pembicara / Host / Talent / Narasumber"
          value={state.speaker}
          onChange={set('speaker')}
          placeholder="Contoh: Host tech enthusiast muda, gaya bicara santai tapi to the point"
        />

        <div className="mt-3">
          <TextareaField
            label="Pesan Utama (Core Message / Angle Cerita)"
            value={state.coreMessage}
            onChange={set('coreMessage')}
            placeholder="Tuliskan 1 pesan terpenting yang ingin diingat penonton setelah video selesai..."
            rows={2}
          />
        </div>

        <div className="mt-3">
          <TextareaField
            label="Poin-Poin Pembahasan / Urutan Cerita (Key Points)"
            value={state.keyPoints}
            onChange={set('keyPoints')}
            placeholder="Tuliskan poin yang wajib ada: 1. Fakta awal, 2. Pembahasan studi kasus, 3. Dampak praktis..."
            rows={3}
          />
        </div>
      </Section>

      {/* 3. Call to Action & Arahan Sutradara */}
      <Section num="3" title="Call to Action & Arahan Produksi" icon={Film}>
        <TextField
          label="Call to Action (Aksi Akhir Penonton)"
          value={state.callToAction}
          onChange={set('callToAction')}
          placeholder="Contoh: Tulis komentarmu di bawah, like & share video ini ke teman kerjamu!"
        />

        <div className="mt-3">
          <TextareaField
            label="Catatan Khusus / Permintaan B-Roll & Visual Efek (Opsional)"
            value={state.additionalNotes}
            onChange={set('additionalNotes')}
            placeholder="Contoh: Sertakan teks layar dinamis, transisi suara whoosh cepat, dan prompt storyboard sinematik"
            rows={2}
          />
        </div>
      </Section>
    </div>
  );
}
