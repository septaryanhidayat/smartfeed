import { Sparkles, Brain, Cpu, Zap, Layers, Wand2 } from 'lucide-react';
import ScanlineGrid from '../primitives/ScanlineGrid.jsx';

const AI_ENGINES = [
  {
    name: 'ChatGPT',
    provider: 'OpenAI',
    role: 'Copywriting & Journalism Engine',
    desc: 'Memformulasikan headline iklan persuasi tinggi, naskah jurnalistik 5W+1H, storytelling konten, dan call-to-action konversi tajam.',
    tag: 'Text & Logic',
    badgeColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  {
    name: 'Google Gemini',
    provider: 'Google AI',
    role: 'Multimodal & Context Analysis',
    desc: 'Membedah komposisi visual produk, analisis tone brand, pemetaan target audiens, dan optimasi instruksi desain berbasis konteks nyata.',
    tag: 'Multimodal Vision',
    badgeColor: 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30',
    dotColor: 'bg-blue-400',
  },
  {
    name: 'Grok',
    provider: 'xAI',
    role: 'Real-Time Trend & Hook Ideation',
    desc: 'Menangkap sudut pandang segar, angle promosi viral, tren percakapan terkini, dan gaya bahasa lugas yang relevan dengan netizen.',
    tag: 'Trend & Angle',
    badgeColor: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
    dotColor: 'bg-purple-400',
  },
  {
    name: 'Leonardo.ai',
    provider: 'Leonardo Visual AI',
    role: 'Commercial Visual & Render Engine',
    desc: 'Menghasilkan estetika visual komersial, pencahayaan sinematik, kedalaman tekstur produk, dan komposisi poster berstandar studio.',
    tag: 'Generative Visual',
    badgeColor: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-400',
  },
];

export default function AiEnginesStrip() {
  return (
    <section className="relative py-20 border-y border-border bg-bg-deep/40 overflow-hidden">
      <ScanlineGrid />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto reveal">
          <span className="eyebrow">
            <span className="dot" /> multi-model architecture
          </span>
          <h2 className="h-section mt-4">
            Dioptimalisasi dengan Kolaborasi <span className="text-grad-red">4 AI Engine Mutakhir</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-mut leading-relaxed">
            SmartFeed mengkombinasikan keunggulan pemrosesan bahasa, kecerdasan multimodal, tren terkini, dan rendering visual terbaik dunia ke dalam satu alur kerja instan.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AI_ENGINES.map((engine, idx) => (
            <div
              key={engine.name}
              className="soft-border card-lift p-5 sm:p-6 flex flex-col justify-between relative reveal bg-bg-panel/70 backdrop-blur"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] mono uppercase font-bold border bg-gradient-to-r ${engine.badgeColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${engine.dotColor}`} />
                    {engine.provider}
                  </span>
                  <span className="text-[10px] mono text-text-dim">{engine.tag}</span>
                </div>

                <h3 className="text-lg font-bold text-text mt-1">{engine.name}</h3>
                <div className="text-xs font-semibold text-accent mt-0.5 mb-2.5">
                  {engine.role}
                </div>
                <p className="text-xs text-text-mut leading-relaxed">
                  {engine.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[10px] mono text-text-dim">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>Integrated to Studio Pipeline</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
