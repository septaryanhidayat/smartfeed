import { Film, Layers, Camera, Mic } from 'lucide-react';
import Section from '../components/Section.jsx';
import TextField from '../components/TextField.jsx';
import TextareaField from '../components/TextareaField.jsx';
import SelectOrCustom from '../components/SelectOrCustom.jsx';
import ImageUploadField from '../components/ImageUploadField.jsx';
import {
  SB_CATEGORIES, SB_TARGET_AUDIENCES, SB_PLATFORMS, SB_DURATIONS, SB_TYPES,
  SB_HOOK_STYLES, SB_SELLING_INTENSITY, SB_VISUAL_STYLES, SB_CREATOR_PERSONAS,
  SB_LANGUAGE_STYLES, SB_CTAS,
} from '../data/affiliateOptions.js';

export default function StoryboardAffiliateMode({ state, dispatch }) {
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-3">
      <Section num="1" title="Produk & Foto Referensi" icon={Film}>
        <div className="mb-3">
          <ImageUploadField
            label="Pilih File Foto Produk (Referensi Storyboard)"
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
            hint="Upload foto produk untuk dijadikan acuan visual shot list scene-by-scene video."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <TextField label="Product Name (opsional)" value={state.product_name} onChange={set('product_name')} placeholder="Mini Leather Tote" />
          <SelectOrCustom label="Product Category" value={state.product_category} onChange={set('product_category')} options={SB_CATEGORIES} />
        </div>
        <div className="mt-3">
          <TextareaField label="Product Description (opsional)" value={state.product_description} onChange={set('product_description')} placeholder="Mini tote bag premium untuk daily use." rows={2} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <TextField label="Main Benefit (opsional)" value={state.main_benefit} onChange={set('main_benefit')} placeholder="bikin outfit terlihat lebih premium" />
          <TextField label="Problem Solved (opsional)" value={state.problem_solved} onChange={set('problem_solved')} placeholder="tas murah cepat rusak & terlihat biasa" />
        </div>
        <div className="mt-3">
          <SelectOrCustom label="Target Audience" value={state.target_audience} onChange={set('target_audience')} options={SB_TARGET_AUDIENCES} />
        </div>
      </Section>

      <Section num="2" title="Platform & Durasi" icon={Layers}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectOrCustom label="Platform" value={state.platform} onChange={set('platform')} options={SB_PLATFORMS} />
          <SelectOrCustom label="Video Duration" value={state.video_duration_seconds} onChange={set('video_duration_seconds')} options={SB_DURATIONS} />
        </div>
      </Section>

      <Section num="3" title="Konsep Storyboard" icon={Camera}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectOrCustom label="Storyboard Type" value={state.storyboard_type} onChange={set('storyboard_type')} options={SB_TYPES} />
          <SelectOrCustom label="Hook Style" value={state.hook_style} onChange={set('hook_style')} options={SB_HOOK_STYLES} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <SelectOrCustom label="Selling Intensity" value={state.selling_intensity} onChange={set('selling_intensity')} options={SB_SELLING_INTENSITY} />
          <SelectOrCustom label="Visual Style" value={state.visual_style} onChange={set('visual_style')} options={SB_VISUAL_STYLES} />
        </div>
      </Section>

      <Section num="4" title="Creator & CTA" icon={Mic}>
        <div className="grid sm:grid-cols-2 gap-3">
          <SelectOrCustom label="Creator Persona" value={state.creator_persona} onChange={set('creator_persona')} options={SB_CREATOR_PERSONAS} />
          <SelectOrCustom label="Language Style" value={state.language_style} onChange={set('language_style')} options={SB_LANGUAGE_STYLES} />
        </div>
        <div className="mt-3">
          <SelectOrCustom label="CTA" value={state.cta} onChange={set('cta')} options={SB_CTAS} />
        </div>
      </Section>
    </div>
  );
}
