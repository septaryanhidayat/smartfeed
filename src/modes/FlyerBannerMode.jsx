import { useState } from 'react';
import {
  Flag, FileText, Presentation, Columns, Maximize2, Laptop,
  Sparkles, Calendar, MapPin, User, Phone, CheckCircle2,
  Printer, Palette, Layout, Bookmark, RefreshCw
} from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import ColorSwatch from '../components/ColorSwatch.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import {
  FORMAT_TYPES,
  SIZE_VARIANTS,
  THEMES_AND_STYLES,
  PRINTING_SPECS,
  FINISHING_OPTIONS,
  FLYER_BANNER_PRESETS
} from '../data/flyerBannerOptions.js';

export default function FlyerBannerMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const activeFormat = state.formatType || 'spanduk';
  const filteredSizes = SIZE_VARIANTS.filter((s) => s.category === activeFormat);

  const handleApplyPreset = (presetObj) => {
    dispatch({ type: 'LOAD_DEMO', preset: presetObj.preset });
  };

  const handleSelectFormat = (fmt) => {
    set('formatType')(fmt);
    const firstSize = SIZE_VARIANTS.find((s) => s.category === fmt);
    if (firstSize) {
      set('sizeVariant')(firstSize.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* PRESETS QUICK SELECTOR */}
      <div className="surface p-3.5 sm:p-4 rounded-2xl border border-accent/30 bg-accent-sm/15 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Preset Template Siap Pakai (Dakwah, Lembaga &amp; Acara)</span>
          </div>
          <span className="text-[10px] mono text-text-dim">1-Klik Terapkan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {FLYER_BANNER_PRESETS.map((p) => {
            const isCurrent = state.title === p.preset.title && state.sizeVariant === p.preset.sizeVariant;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 text-xs ${
                  isCurrent
                    ? 'bg-accent text-white border-accent shadow-xs font-bold'
                    : 'bg-bg-panel hover:bg-bg-elev border-border text-text hover:border-accent/40'
                }`}
              >
                <div className="font-semibold line-clamp-1">{p.label}</div>
                <div className={`text-[10px] mono ${isCurrent ? 'text-white/80' : 'text-text-dim'}`}>
                  {p.preset.sizeVariant.toUpperCase()} · {p.formatType.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION A: JENIS & VARIAN UKURAN */}
      <Section num="A" title="Pilih Format & Varian Ukuran Cetak" icon={Layout}>
        <div className="space-y-3">
          {/* Format Type Tabs */}
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">Kategori Desain</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FORMAT_TYPES.map((fmt) => {
                const isSelected = activeFormat === fmt.value;
                return (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => handleSelectFormat(fmt.value)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-text ring-1 ring-accent/30 font-bold'
                        : 'bg-bg-deep border-border hover:bg-bg-elev text-text-mut'
                    }`}
                  >
                    <span className="text-xs">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Variant Cards */}
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">
              Varian Ukuran ({activeFormat.toUpperCase()})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredSizes.map((sz) => {
                const isSelected = state.sizeVariant === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => set('sizeVariant')(sz.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent shadow-xs ring-1 ring-accent/40'
                        : 'bg-bg-deep border-border/80 hover:bg-bg-elev hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-text truncate">{sz.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent/20 text-accent font-mono font-bold shrink-0">
                        {sz.ratio}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-text-dim mono">{sz.dims}</div>
                    <div className="text-[10px] text-text-dim line-clamp-2 leading-relaxed">{sz.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION B: KONTEN TEKS & LEMBAGA */}
      <Section num="B" title="Informasi Acara, Lembaga & Konten" icon={FileText}>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField
              label="Nama Lembaga / Penyelenggara"
              value={state.institution}
              onChange={set('institution')}
              required
              placeholder="Contoh: DPD BKPRMI KABUPATEN OGAN ILIR"
            />
            <TextField
              label="Badge / Status Khusus (Opsional)"
              value={state.badgeText}
              onChange={set('badgeText')}
              placeholder="Contoh: BEASISWA PENUH — 100% GRATIS"
            />
          </div>

          <div>
            <TextField
              label="Judul Utama Spanduk / Flyer"
              value={state.title}
              onChange={set('title')}
              required
              placeholder="Contoh: PELATIHAN KEPEMIMPINAN GURU NGAJI TK/TPA"
            />
          </div>

          <div>
            <TextareaField
              label="Sub-Judul / Tema / Tagline Acara"
              value={state.subTitle}
              onChange={set('subTitle')}
              rows={2}
              placeholder="Contoh: Urutan Membangun Peradaban: Manusia, Sistem, dan Sumber Daya Menuju Ogan Ilir SMART"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <TextField
              label="Narasumber / Tokoh / Pemateri"
              value={state.speaker}
              onChange={set('speaker')}
              placeholder="Contoh: Ustadz H. Ahmad Fauzi, S.Pd.I"
            />
            <TextField
              label="Call to Action (CTA / Ajakan)"
              value={state.callToAction}
              onChange={set('callToAction')}
              placeholder="Contoh: Daftarkan Unit TK/TPA Anda Sekarang!"
            />
          </div>
        </div>
      </Section>

      {/* SECTION C: WAKTU, TEMPAT & KONTAK */}
      <Section num="C" title="Jadwal, Lokasi & Kontak Pendaftaran" icon={Calendar}>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField
              label="Hari & Tanggal"
              value={state.eventDate}
              onChange={set('eventDate')}
              placeholder="Contoh: Rabu, 14 Oktober 2026"
            />
            <TextField
              label="Waktu / Pukul"
              value={state.eventTime}
              onChange={set('eventTime')}
              placeholder="Contoh: 08.00 WIB s.d. Selesai"
            />
          </div>

          <div>
            <TextField
              label="Lokasi / Tempat Acara"
              value={state.eventLocation}
              onChange={set('eventLocation')}
              placeholder="Contoh: Aula SMA IT Raudhatul Ulum Sakatiga, Ogan Ilir"
            />
          </div>

          <div>
            <TextField
              label="Kontak Panitia / Pendaftaran / Info WA"
              value={state.contactPerson}
              onChange={set('contactPerson')}
              placeholder="Contoh: Hubungi Panitia: 0896-9524-9089 / 0812-xxxx-xxxx"
            />
          </div>

          {/* Upload foto / logo opsional */}
          <div>
            <ImageUploadField
              label="Upload Foto Tokoh / Logo Lembaga (Opsional)"
              value={state.imagePreview}
              fileName={state.imageName}
              onChange={(preview, file, name) => {
                dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: preview });
                dispatch({ type: 'SET_FIELD', field: 'imageName', value: name });
              }}
              onRemove={() => {
                dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: '' });
                dispatch({ type: 'SET_FIELD', field: 'imageName', value: '' });
              }}
              hint="Foto akan diposisikan pada sudut foto narasumber atau kotak logo lembaga."
            />
          </div>
        </div>
      </Section>

      {/* SECTION D: TEMA VISUAL & SPESIFIKASI CETAK */}
      <Section num="D" title="Gaya Visual, Warna & Produksi Cetak" icon={Printer}>
        <div className="space-y-3">
          {/* Pilihan Tema */}
          <div>
            <label className="text-xs font-semibold text-text mb-1.5 block">Tema Visual &amp; Nuansa</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {THEMES_AND_STYLES.map((th) => {
                const isSelected = state.themeStyle === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      set('themeStyle')(th.id);
                      set('customPrimary')(th.primary);
                      set('customSecondary')(th.secondary);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent ring-1 ring-accent/30 font-bold'
                        : 'bg-bg-deep border-border hover:bg-bg-elev'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text truncate">{th.name}</div>
                      <div className="text-[10px] text-text-dim truncate">{th.desc}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: th.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: th.secondary }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color swatch */}
          <div className="grid sm:grid-cols-2 gap-3">
            <ColorSwatch
              label="Kustomisasi Warna"
              primary={state.customPrimary}
              secondary={state.customSecondary}
              onPrimary={set('customPrimary')}
              onSecondary={set('customSecondary')}
            />
            <SelectField
              label="Spesifikasi Bahan Cetak"
              value={state.printingSpec}
              onChange={set('printingSpec')}
              options={PRINTING_SPECS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <SelectField
              label="Finishing Percetakan"
              value={state.finishing}
              onChange={set('finishing')}
              options={FINISHING_OPTIONS}
            />
            <div className="p-3 rounded-xl bg-bg-deep border border-border flex flex-col justify-center text-xs space-y-1">
              <span className="text-text-dim font-medium">Panduan Percetakan:</span>
              <span className="text-text font-semibold">
                {activeFormat === 'spanduk' || activeFormat === 'baliho'
                  ? 'Format CMYK · Resolusi 100-150 DPI siap cetak outdoor'
                  : 'Format CMYK/RGB · Resolusi 300 DPI tajam berkualitas tinggi'}
              </span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
