import { ArrowRight, Sparkles } from 'lucide-react';
import GlowOrb from '../primitives/GlowOrb.jsx';
import ScanlineGrid from '../primitives/ScanlineGrid.jsx';

import { CONFIG } from '../../config.js';
const CTA_HREF = CONFIG.paymentUrl;

export default function FinalCta({ onOpenAccess }) {
  const handleOpenAccess = () => {
    if (onOpenAccess) onOpenAccess();
    else window.dispatchEvent(new CustomEvent('open-access-modal'));
  };

  return (
    <section className="relative py-28 overflow-hidden">
      <GlowOrb size={720} color="rgba(var(--accent-rgb),0.22)" className="left-1/2 -translate-x-1/2 top-0" />
      <ScanlineGrid dots />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
        <span className="eyebrow"><span className="dot" /> siap mulai berkarya</span>
        <h2 className="h-display mt-5">
          Berhenti nungguin designer.
          <br />
          <span className="text-grad-red">Mulai buat konten profesional hari ini.</span>
        </h2>
        <p className="mt-5 text-text-mut max-w-2xl mx-auto text-base">
          Tingkatkan kualitas visual konten dan promosi kamu secara instan dengan {CONFIG.brandName}.
          Ambil penawaran promo seumur hidup sekarang sebelum harga normal kembali.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <a
            href={CTA_HREF}
            target="_blank"
            rel="noreferrer"
            className="btn-cta text-base sm:text-lg !py-3.5 !px-8 shadow-[0_10px_35px_rgba(var(--accent-rgb),0.35)]"
          >
            <Sparkles className="w-5 h-5" />
            Dapatkan Akses Sekarang
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {CONFIG.enableFreeTrainingClaim && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleOpenAccess}
              className="text-xs text-accent underline font-semibold hover:text-accent-h cursor-pointer bg-transparent border-0"
            >
              Peserta Pelatihan? Klik di sini untuk klaim akses gratis →
            </button>
          </div>
        )}

        <div className="mt-4 text-[10px] mono uppercase tracking-widest text-text-dim">
          Akses instan selamanya · Sekali bayar tanpa langganan bulanan
        </div>
      </div>
    </section>
  );
}
