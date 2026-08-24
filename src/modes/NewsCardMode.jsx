import { Newspaper, Camera, LayoutGrid, FileText, Tag, MapPin } from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import { NEWS_BADGES, NEWS_RUBRICS, PHOTO_STYLES, PHOTO_LIGHTINGS, NEWS_RATIOS } from '../prompts/buildNewsCard.js';

export default function NewsCardMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-3">
      <Section num="A" title="Identitas Berita & Rubrik" icon={Newspaper}>
        <div className="grid sm:grid-cols-3 gap-3">
          <TextField
            label="Nama Media / Redaksi"
            value={state.mediaName}
            onChange={set('mediaName')}
            placeholder="Media Indonesia"
          />
          <SelectField
            label="Badge Berita"
            value={state.badge}
            onChange={set('badge')}
            options={NEWS_BADGES}
          />
          <SelectField
            label="Rubrik / Kategori"
            value={state.rubric}
            onChange={set('rubric')}
            options={NEWS_RUBRICS}
          />
        </div>

        <div className="mt-3">
          <TextField
            label="Headline Utama (Judul Berita)"
            value={state.headline}
            onChange={set('headline')}
            required
            placeholder="KPK OTT Pejabat Daerah Terkait Dugaan Korupsi Proyek..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextField
            label="Lokasi Peliputan (Dateline)"
            value={state.dateline}
            onChange={set('dateline')}
            placeholder="JAKARTA / SURABAYA"
          />
          <TextField
            label="Tanggal Rilis Berita"
            value={state.date}
            onChange={set('date')}
            placeholder="20 Agustus 2026"
          />
        </div>
      </Section>

      <Section num="B" title="Isi Berita & Fakta Kunci" icon={FileText}>
        <TextareaField
          label="Lead Berita (1–2 Kalimat Fakta Utama)"
          value={state.lead}
          onChange={set('lead')}
          placeholder="Penyidik menyita sejumlah barang bukti dokumen penting dan uang tunai bernilai miliaran rupiah..."
          rows={2}
        />
        <div className="mt-3">
          <TextField
            label="Poin Kunci / Fakta Tambahan (Opsional)"
            value={state.keyPoint}
            onChange={set('keyPoint')}
            placeholder="6 orang saksi kunci telah diamankan untuk pemeriksaan maraton..."
          />
        </div>
      </Section>

      <Section num="C" title="Arahan Foto Jurnalistik (Visual Scene)" icon={Camera}>
        <div className="mb-3">
          <ImageUploadField
            label="Pilih File Foto Bukti / Adegan Berita (Opsional)"
            value={state.imagePreview || state.newsPhoto}
            fileName={state.imageName}
            onChange={(preview, file, name) => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: preview });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: name });
            }}
            onRemove={() => {
              dispatch({ type: 'SET_FIELD', field: 'imagePreview', value: '' });
              dispatch({ type: 'SET_FIELD', field: 'imageName', value: '' });
            }}
            hint="Upload foto bukti, narasumber, atau tempat kejadian untuk dijadikan acuan visual kartu berita."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Gaya Fotografi Jurnalistik"
            value={state.photographyStyle}
            onChange={set('photographyStyle')}
            options={PHOTO_STYLES}
          />
          <SelectField
            label="Pencahayaan Lapangan"
            value={state.lighting}
            onChange={set('lighting')}
            options={PHOTO_LIGHTINGS}
          />
        </div>

        <div className="mt-3">
          <TextareaField
            label="Deskripsi Adegan / Foto Kejadian Utama"
            value={state.sceneDescription}
            onChange={set('sceneDescription')}
            placeholder="Contoh: Barisan jurnalis membawa kamera dan mikrofon meliput mobil tahanan yang baru tiba di depan gedung pengadilan..."
            rows={2}
          />
        </div>

        <div className="mt-3">
          <TextField
            label="Foto Pelengkap / Keterangan Tambahan (Opsional)"
            value={state.supportingPhoto}
            onChange={set('supportingPhoto')}
            placeholder="Contoh: Inset tumpukan berkas dokumen bukti sitaan dan map berkas perkara bermaterai"
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
