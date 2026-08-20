import { ShieldAlert, CheckCircle, FileWarning, Palette, LayoutGrid } from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectField from '../components/SelectField.jsx';
import { VERDICT_STATUSES, FACT_CHECK_THEMES } from '../prompts/buildFactCheck.js';
import { NEWS_RATIOS } from '../prompts/buildNewsCard.js';

export default function FactCheckMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  const statusOptions = VERDICT_STATUSES.map((s) => s.label);

  return (
    <div className="space-y-3">
      <Section num="A" title="Status Verifikasi & Identitas" icon={ShieldAlert}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Putusan / Status Fakta"
            value={state.status}
            onChange={(val) => {
              // Extract raw status value from label
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
            placeholder="20 Agustus 2026"
          />
        </div>
      </Section>

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

      <Section num="C" title="Gaya Tampilan Verifikasi" icon={Palette}>
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
