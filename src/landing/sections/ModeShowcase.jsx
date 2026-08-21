import { useState } from 'react';
import {
  LayoutPanelTop, Grid3x3, GalleryHorizontalEnd, Scissors, Youtube, Megaphone,
  PencilLine, ScanFace, UtensilsCrossed, BookOpenText, Newspaper, MessageSquareQuote,
  ShieldAlert, Clapperboard, Film, Star, Shirt, Sparkles, Wand2, ArrowUpRight, Check
} from 'lucide-react';
import SampleAdCard from '../primitives/SampleAdCard.jsx';
import SafeImage from '../primitives/SafeImage.jsx';
import { MODE_PREVIEWS, FACE_CARD_PREVIEWS, MENU_FB_PREVIEWS, JOURNALISM_PREVIEWS } from '../data/galleryManifest.js';

const CATEGORIES = [
  { id: 'all', label: 'Semua Engine (19)' },
  { id: 'visual', label: '🎨 Desain & Visual (8)' },
  { id: 'media', label: '📰 Jurnalisme & Berita (4)' },
  { id: 'affiliate', label: '🎬 Affiliate & Video (6)' },
  { id: 'culinary', label: '🍜 Menu F&B (1)' },
];

const ALL_MODES = [
  // ── DESAIN & VISUAL (8) ──────────────────────────────────
  {
    category: 'visual',
    code: 'M1',
    name: 'Design Feeds / Banner',
    badge: 'Popular',
    desc: 'Brief produk instan jadi banner iklan komersial siap pakai untuk feed Instagram, marketplace, dan landing page hero.',
    ratio: '1:1 · 4:5 · 16:9',
    icon: LayoutPanelTop,
    variant: 5,
    img: MODE_PREVIEWS.banner,
    bullets: ['Komposisi commercial-grade', 'Aspect 1:1, 4:5, 16:9', 'Auto matching warna brand'],
  },
  {
    category: 'visual',
    code: 'M2',
    name: '9 Feed Konsisten Instagram',
    badge: 'Hot',
    desc: 'Satu campaign, 9 feed konsisten sinkron. Tiap feed beda peran (Hero, Fitur, Problem, Testimoni, CTA) dengan estetika dan font senada.',
    ratio: '9x Grid 1:1',
    icon: Grid3x3,
    variant: 7,
    img: '/landing/gridfeed/1.jpg',
    bullets: ['9 feed satu alur campaign', 'Tiap feed beda peran konversi', 'Palet warna & font selaras'],
  },
  {
    category: 'visual',
    code: 'M3',
    name: 'Carousel Multi-Slide Feeds',
    badge: 'Hot',
    desc: 'Alur cerita multi-slide bersambung untuk konten edukasi, storytelling, dan micro-blogging 3–7 slide otomatis nyambung.',
    ratio: '4:5 Portrait',
    icon: GalleryHorizontalEnd,
    variant: 2,
    img: '/landing/carousel/1.jpg',
    stack: ['/landing/carousel/1.jpg', '/landing/carousel/2.jpg', '/landing/carousel/3.jpg'],
    bullets: ['12+ tipe template & News layout', '3–7 slide otomatis nyambung', 'Seamless swipe effect'],
  },
  {
    category: 'visual',
    code: 'M4',
    name: 'Grid & Image Slicer Tool',
    badge: 'New',
    desc: 'Potong otomatis gambar 9-Grid Instagram atau Carousel multi-slide dengan garis panduan presisi, lalu unduh semua potongan dalam 1 file ZIP.',
    ratio: 'Slicer ZIP',
    icon: Scissors,
    variant: 10,
    img: '/landing/modes/banner-preview.jpg',
    bullets: ['Potong otomatis 9 Grid & Carousel', 'Preview garis potong interaktif', 'Download batch ZIP instan'],
  },
  {
    category: 'visual',
    code: 'M5',
    name: 'YouTube & Video Thumbnail',
    badge: '',
    desc: 'Cetak thumbnail video dengan CTR tinggi: ekspresi subjek, teks kontras, dan komposisi visual dramatis yang memancing klik.',
    ratio: '16:9 Widescreen',
    icon: Youtube,
    variant: 17,
    img: MODE_PREVIEWS.thumbnail,
    bullets: ['CTR-oriented high contrast layout', 'Smart overlay text typography', 'Pose subjek & emosi dramatis'],
  },
  {
    category: 'visual',
    code: 'M6',
    name: 'Ads Typography & Poster',
    badge: '',
    desc: 'Creative Director untuk typography ads premium dengan 8 layer arsitektur: title hook, visual direction, palette, dan conversion triggers.',
    ratio: '4:5 · 1:1',
    icon: Megaphone,
    variant: 22,
    img: MODE_PREVIEWS.typography,
    bullets: ['8 layer komposisi kreatif', 'Tipografi komersial premium', 'Copy per-section terpisah'],
  },
  {
    category: 'visual',
    code: 'M7',
    name: 'AI Copy Writing Engine',
    badge: '',
    desc: 'Generator naskah copywriting iklan formula AIDA, PAS, dan FAB lengkap dengan hook memikat, body persuasi, dan Call to Action.',
    ratio: 'Copy / Text',
    icon: PencilLine,
    variant: 13,
    img: MODE_PREVIEWS.copy,
    bullets: ['Formula Hook · Body · CTA', 'Pilihan tone & target audiens', 'Kesesuaian konteks iklan'],
  },
  {
    category: 'visual',
    code: 'M8',
    name: 'Face Card Analysis',
    badge: 'Pro',
    desc: 'Upload 1 foto wajah → hasilkan 5 board analisa editorial premium: face features, style styling, color season, makeup, dan spectacles.',
    ratio: '4:5 Editorial',
    icon: ScanFace,
    variant: 30,
    img: FACE_CARD_PREVIEWS.style,
    bullets: ['5 sub-type board editorial', 'Standar majalah fashion dunia', 'Cocok untuk pria & wanita'],
  },

  // ── MENU F&B (1) ──────────────────────────────────────────
  {
    category: 'culinary',
    code: 'M9',
    name: 'Menu F&B & Resto Poster',
    badge: 'Hot',
    desc: '9 template menu visual dinamis untuk restoran, cafe, bakery, dan patisserie: dari Parisian luxury, Japanese cuisine, hingga Indonesian street food.',
    ratio: '4:5 · A4 Poster',
    icon: UtensilsCrossed,
    variant: 33,
    img: MENU_FB_PREVIEWS.cherryelle,
    bullets: ['9 template kuliner siap pakai', '5 gaya tata letak menu modern', 'Live dynamic menu builder'],
  },

  // ── JURNALISME & REDAKSI MEDIA (4) ────────────────────────
  {
    category: 'media',
    code: 'M10',
    name: 'Artikel & Berita Media',
    badge: 'New',
    desc: 'Generator naskah berita straight news, liputan mendalam (feature), editorial opini, dan siaran pers (press release) standar kaidah jurnalistik 5W+1H.',
    ratio: 'Doc 5W+1H',
    icon: BookOpenText,
    variant: 42,
    img: JOURNALISM_PREVIEWS.articleNews,
    bullets: ['Struktur piramida terbalik 5W+1H', 'Opsi Straight News, Feature & Opini', 'Format press release siap rilis'],
  },
  {
    category: 'media',
    code: 'M11',
    name: 'Breaking News Card',
    badge: 'Hot',
    desc: 'Kartu visual berita kilat / flash news dengan format media massa terkemuka, foto jurnalistik berbobot, headline lugas, dan kutipan inti.',
    ratio: '1:1 · 4:5 Media',
    icon: Newspaper,
    variant: 45,
    img: JOURNALISM_PREVIEWS.breakingNews,
    bullets: ['Format media berita kredibel', 'Badge rubrik & tanggal peristiwa', 'Tipografi headline tegas & padat'],
  },
  {
    category: 'media',
    code: 'M12',
    name: 'Quote Card Tokoh',
    badge: 'New',
    desc: 'Kartu kutipan narasumber, pejabat publik, analis, dan public figure dengan tata letak elegan dan wibawa visual redaksi pers.',
    ratio: '1:1 · 4:5 Quote',
    icon: MessageSquareQuote,
    variant: 48,
    img: JOURNALISM_PREVIEWS.quoteTokoh,
    bullets: ['Kutipan narasumber berwibawa', 'Gelar, jabatan & afiliasi resmi', 'Desain aesthetic & viral di Twitter/IG'],
  },
  {
    category: 'media',
    code: 'M13',
    name: 'Cek Fakta / Fact Check',
    badge: 'New',
    desc: 'Verifikasi klaim hoaks viral dengan stempel putusan resmi (BENAR, HOAKS, KELIRU/DISINFORMASI), klarifikasi fakta, dan rujukan data.',
    ratio: '1:1 Fact Card',
    icon: ShieldAlert,
    variant: 51,
    img: JOURNALISM_PREVIEWS.factCheck,
    bullets: ['Stempel putusan verifikasi fakta', 'Poin klarifikasi & kronologi', 'Sumber rujukan resmi & anti-hoaks'],
  },

  // ── AFFILIATE & VIDEO CREATOR (6) ─────────────────────────
  {
    category: 'affiliate',
    code: 'M14',
    name: 'Naskah Video & Teleprompter',
    badge: 'New',
    desc: 'Penyusunan naskah video teleprompter-ready, skrip wawancara, scene-by-scene breakdown, dan narasi Voice-Over (VO) untuk YouTube/TikTok.',
    ratio: 'Script / VO',
    icon: Clapperboard,
    variant: 55,
    img: '/landing/ads-16x9/yt-01.jpg',
    bullets: ['Teleprompter pacing timing', 'Scene visual & audio narration', 'Hook 3 detik pertama viral'],
  },
  {
    category: 'affiliate',
    code: 'M15',
    name: 'Storyboard Video Affiliate',
    badge: 'Hot',
    desc: 'Storyboard visual scene-by-scene otomatis sesuai durasi 15s/30s/60s dengan arahan shot list, caption, dan visual prompt promosi.',
    ratio: '16:9 Storyboard',
    icon: Film,
    variant: 19,
    img: '/landing/affiliate-demos/storyboardaffiliate/sb-saas-30s.jpg?v=3',
    bullets: ['Board 16:9 landscape scene', 'Auto timeline sesuai durasi video', 'VO, visual shot list & overlay'],
  },
  {
    category: 'affiliate',
    code: 'M16',
    name: 'Review Produk Affiliate',
    badge: '',
    desc: 'Banner review perbandingan & unboxing produk konversi tinggi dengan 10 review framework, rating badge, dan wireframe preview live.',
    ratio: '1:1 · 4:5 Review',
    icon: Star,
    variant: 14,
    img: '/landing/affiliate-demos/reviewaffiliate/review-fashion-bag.jpg?v=3',
    bullets: ['10 review framework konversi', 'Custom badge rating & star review', 'Wireframe live update'],
  },
  {
    category: 'affiliate',
    code: 'M17',
    name: 'Try-On / Wear-Test Produk',
    badge: 'Pro',
    desc: 'Upload foto produk asli → model virtual mengenakan produk tersebut secara natural. Visual wear-test memukau untuk fashion & skincare.',
    ratio: '4:5 Wear Test',
    icon: Shirt,
    variant: 11,
    img: '/landing/affiliate-demos/tryonaffiliate/tryon-skincare-apply.jpg?v=3',
    bullets: ['Foto produk asli → pasang ke model', '15 mode try-on berbagai situasi', 'Optimasi konversi Shopee/TikTok'],
  },
  {
    category: 'affiliate',
    code: 'M18',
    name: 'Logo Brand & Merchandise Mockup',
    badge: '',
    desc: 'Buat identitas logo brand affiliate-ready lengkap dengan arahan visual, palet warna, dan tempel otomatis ke 21 media merchandise mockup.',
    ratio: '1:1 Logo & Mockup',
    icon: Sparkles,
    variant: 8,
    img: '/landing/brand/logo.png',
    bullets: ['Desain logo brand instan', 'Custom HEX palette & typography', '21 mockup media merchandise'],
  },
  {
    category: 'affiliate',
    code: 'M19',
    name: 'UGC Creator Concept & Hooks',
    badge: 'Hot',
    desc: 'Konsep video User Generated Content (UGC) dengan formula angle testimonial dan problem-solving yang terasa otentik dan memicu transaksi.',
    ratio: '9:16 UGC Script',
    icon: Wand2,
    variant: 62,
    img: '/landing/ads-9x16/vert-01.jpg',
    bullets: ['Angle naskah UGC otentik', 'Hook emosional penahan scroll', 'Direct call to action ke checkout'],
  },
];

export default function ModeShowcase() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredModes = activeTab === 'all'
    ? ALL_MODES
    : ALL_MODES.filter((m) => m.category === activeTab);

  return (
    <section id="fitur" className="relative py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl reveal">
          <span className="eyebrow"><span className="dot" /> 19 engine ai · 1 studio visual</span>
          <h2 className="h-section mt-4">
            Sembilan Belas <span className="text-grad-red">Engine AI Kreatif</span> untuk Segala Kebutuhan Konten Anda.
          </h2>
          <p className="mt-4 text-text-mut leading-relaxed">
            Bukan satu template generator generik. Setiap modul memiliki logic, arsitektur prompt, dan pipeline visual khusus agar output yang dihasilkan presisi, estetik, dan siap tayang tanpa editing manual.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-accent text-white shadow-md shadow-accent/25'
                  : 'bg-bg-panel text-text-mut hover:text-text border border-border hover:border-accent/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of 19 Modules */}
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {filteredModes.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.code}
                className="soft-border card-lift p-5 sm:p-6 grid grid-cols-[1fr_120px] sm:grid-cols-[1fr_150px] gap-4 sm:gap-5 reveal relative overflow-hidden bg-bg-panel/70"
                style={{ animationDelay: `${(i % 6) * 80}ms` }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex w-8 h-8 rounded-lg items-center justify-center bg-accent-sm border border-border">
                      <Icon className="w-4 h-4 text-accent" />
                    </span>
                    <span className="text-[9px] mono uppercase tracking-widest text-text-dim">
                      /ENGINE · {m.code}
                    </span>
                    {m.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        m.badge === 'Hot'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : m.badge === 'New'
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-accent-sm text-accent border border-accent/30'
                      }`}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-text">{m.name}</h3>
                  <p className="mt-1.5 text-xs text-text-mut leading-relaxed">{m.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {m.bullets.map((b) => (
                      <li key={b} className="text-[11px] text-text-mut flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preview Thumbnail */}
                <div className="relative rounded-xl overflow-hidden border border-border bg-bg-deep self-center aspect-square flex items-center justify-center">
                  {m.stack ? (
                    <MiniStack imgs={m.stack} />
                  ) : (
                    <SafeImage
                      src={m.img}
                      alt={`${m.name} preview`}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      fallback={<SampleAdCard ratio={m.ratio.split(' ')[0]} variant={m.variant} />}
                    />
                  )}
                  <div className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] mono uppercase tracking-widest bg-bg/85 backdrop-blur text-accent z-10 border border-border/50">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    {m.ratio}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniStack({ imgs }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-[48%] aspect-[4/5] rounded-md overflow-hidden border border-border shadow-lg rotate-[10deg] translate-x-3 translate-y-1 bg-bg-deep">
        <SafeImage src={imgs[2]} alt="" className="w-full h-full object-cover opacity-90" fallback={<SampleAdCard ratio="4/5" variant={3} />} />
      </div>
      <div className="absolute w-[48%] aspect-[4/5] rounded-md overflow-hidden border border-border shadow-lg -rotate-[8deg] -translate-x-3 bg-bg-deep">
        <SafeImage src={imgs[1]} alt="" className="w-full h-full object-cover opacity-90" fallback={<SampleAdCard ratio="4/5" variant={2} />} />
      </div>
      <div className="absolute w-[50%] aspect-[4/5] rounded-md overflow-hidden border-2 border-bg-panel shadow-xl bg-bg-deep">
        <SafeImage src={imgs[0]} alt="Carousel Feeds preview" className="w-full h-full object-cover" fallback={<SampleAdCard ratio="4/5" variant={1} />} />
      </div>
    </div>
  );
}
