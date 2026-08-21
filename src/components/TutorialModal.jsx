import { X, PlayCircle, Sparkles, Copy, Send, MonitorPlay, Layers, FileText } from 'lucide-react';
import AnimatedTutorial from './AnimatedTutorial.jsx';
import { CONFIG } from '../config.js';

const QUICK_STEPS = [
  {
    icon: Layers,
    title: 'Pilih Engine Kreatif',
    desc: 'Pilih salah satu dari 20 engine studio di menu: Slide & PPT Deck, Carousel Feeds, 9-Feed Konsisten, Naskah Video, Suite Jurnalisme, atau Affiliate Tools.'
  },
  {
    icon: Sparkles,
    title: 'Isi Form / Pakai Preset Demo',
    desc: 'Klik tombol "Randomize Demo" untuk otomatis mengisi dari 50+ kategori template industri siap pakai, atau sesuaikan data presentasi secara mandiri.'
  },
  {
    icon: Copy,
    title: 'Generate & Salin Format Pilihan',
    desc: 'Klik "✦ Generate Magic Prompt" untuk menghasilkan prompt master terstruktur. Anda juga bisa memilih format Gamma/Canva, Script VBA PowerPoint, atau Dokumen NotebookLM.'
  },
  {
    icon: Send,
    title: 'Paste ke AI Pilihan (ChatGPT, Claude, Gamma, PowerPoint)',
    desc: 'Paste prompt ke ChatGPT, Claude, atau Gemini untuk naskah lengkap & AI visual; paste outline ke Gamma.app/Canva untuk generate slide otomatis; atau jalankan script VBA di Microsoft PowerPoint.'
  },
];

export default function TutorialModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/85 sm:bg-black/70 backdrop-blur-sm flex items-stretch sm:items-center justify-center px-0 py-0 sm:px-4 sm:py-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface shadow-panel w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto animate-slide-up sm:rounded-2xl rounded-none border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between sticky top-0 bg-bg-panel/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm">
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-text">Panduan Praktis {CONFIG.brandName}</h2>
              <div className="text-[10px] text-text-dim mono uppercase tracking-wider">Workflow 4 Langkah Cepat</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-text transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Animated visual tutorial */}
          <div className="rounded-xl overflow-hidden border border-border bg-bg-deep shadow-sm">
            <AnimatedTutorial />
          </div>

          {/* Quick steps reference */}
          <div>
            <div className="text-[10px] mono uppercase tracking-widest text-accent font-extrabold mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LANGKAH PENGGUNAAN CEPAT</span>
            </div>
            <ol className="space-y-3.5">
              {QUICK_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={i} className="flex items-start gap-3.5 p-3 rounded-xl bg-bg-panel border border-border shadow-xs">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-text flex items-center gap-2">
                        <span className="mono text-accent text-[11px]">0{i + 1}.</span>
                        <span>{s.title}</span>
                      </div>
                      <p className="text-xs text-text-mut mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
