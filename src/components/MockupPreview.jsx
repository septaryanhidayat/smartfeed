import { LayoutGrid } from 'lucide-react';

function parseRatio(label, mode, state = {}) {
  if (mode === 'presentation' || mode === 'article') return [16, 9];
  if (mode === 'gridfeed') return [1, 1];
  if (mode === 'videoscript') {
    if (state?.platform && (state.platform.includes('YouTube Long') || state.platform.includes('TV'))) return [16, 9];
    return [9, 16];
  }
  if (mode === 'copywriting') return [4, 5];
  if (mode === 'menufb') return [4, 5];
  if (mode === 'flyerbanner') {
    const sz = state?.sizeVariant || '';
    if (sz.includes('3x1') || sz.includes('mega')) return [3, 1];
    if (sz.includes('4x1') || sz.includes('panoramic')) return [4, 1];
    if (sz.includes('5x1')) return [5, 1];
    if (sz.includes('16x9') || sz.includes('web_cover')) return [16, 9];
    if (sz.includes('16x6')) return [16, 6];
    if (sz.includes('2x1') || sz.includes('baliho_4x2') || sz.includes('baliho_6x3')) return [2, 1];
    if (sz.includes('3x2') || sz.includes('baliho_6x4')) return [3, 2];
    if (sz.includes('a4') || sz.includes('a5') || sz.includes('mini_table')) return [1, 1.414];
    if (sz.includes('60x160')) return [1, 2.67];
    if (sz.includes('80x200')) return [1, 2.5];
    if (sz.includes('ig_feed')) return [4, 5];
    if (sz.includes('wa_story')) return [9, 16];
    return [3, 1];
  }
  if (!label) return [1, 1];
  const m = String(label).match(/(\d+(?:\.\d+)?)\s*[:x]\s*(\d+(?:\.\d+)?)/i);
  if (!m) return [4, 5]; // carousel slide → 4:5
  return [parseFloat(m[1]), parseFloat(m[2])];
}

// Label ringkas cover slide 1 untuk metadata mockup.
const COVER_LABELS = {
  'auto': 'Hero (Auto)',
  'image-top': 'Img Atas',
  'image-bottom': 'Img Bawah',
  'image-right': 'Img Kanan',
  'image-left': 'Img Kiri',
  'image-full': 'Full Bleed',
  'text-focus': 'Teks Hero',
};

/**
 * Live SVG mockup wireframe. Adapts to:
 * - aspect ratio
 * - color theme (primary + secondary)
 * - mode-specific layout (banner position + image count, thumbnail, typography, news, dakwah, etc.)
 */
export default function MockupPreview({ mode, state }) {
  const isReview = mode === 'reviewaffiliate';
  const isCarousel = mode === 'carousel'; // semua template carousel → cover wireframe slide 1
  const [w, h] = parseRatio(state.ratio || state.image_ratio || state.aspectRatio, mode, state);
  // Normalize to a sensible viewBox (preserve ratio, scale to ~400 width)
  const targetW = 400;
  const targetH = Math.round((targetW * h) / w);

  let primary, secondary;
  if (isReview) {
    [primary, secondary] = reviewColors(state);
  } else if (isCarousel) {
    if (state.templateType === 'news') {
      // News: pakai warna suasana + background teks pilihan user
      primary = state.newsMoodColor || '#dc2626';
      secondary = state.newsTextBgAuto ? '#0f172a' : (state.newsTextBg || '#0f172a');
    } else if (state.colorMoodCustom) {
      // Override: pakai warna custom user (Tema Warna)
      primary = state.colorPrimary || '#ef4444';
      secondary = state.colorSecondary || '#0f172a';
    } else {
      primary = '#ef4444';   // aksen brand
      secondary = '#0f172a'; // dark
    }
  } else if (mode === 'gridfeed') {
    primary = state.colorPrimary || '#059669';
    secondary = state.colorSecondary || '#064e3b';
  } else if (mode === 'newscard') {
    primary = (state.badge || '').includes('BREAKING') ? '#dc2626' : '#1e3a8a';
    secondary = '#0f172a';
  } else if (mode === 'quotecard') {
    primary = '#0d9488';
    secondary = '#061c1e';
  } else if (mode === 'factcheck') {
    const st = (state.status || '').toUpperCase();
    primary = st.includes('FAKTA') || st.includes('BENAR') ? '#059669' : st.includes('HOAKS') || st.includes('PALSU') ? '#dc2626' : '#d97706';
    secondary = '#0b1329';
  } else if (mode === 'copywriting') {
    primary = '#2563eb';
    secondary = '#0f172a';
  } else if (mode === 'videoscript') {
    primary = '#7c3aed';
    secondary = '#130924';
  } else if (mode === 'presentation') {
    primary = '#0284c7';
    secondary = '#071b2d';
  } else if (mode === 'article') {
    primary = '#334155';
    secondary = '#0f172a';
  } else if (mode === 'flyerbanner') {
    primary = state.customPrimary || '#065f46';
    secondary = state.customSecondary || '#022c22';
  } else {
    primary = state.primaryColor || '#2dd4bf';
    secondary = state.secondaryColor || '#ffffff';
  }

  // Universal max-height — width fills parent, height stays <= 240 (auto for tall ratios)
  const CONTAINER_MAX_H = 240;
  const wouldExceedHeight = (CONTAINER_MAX_H * w) / h;
  const computedMaxWidth  = h >= w ? `${wouldExceedHeight}px` : '100%';

  return (
    <div className="surface p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-mut">
          <LayoutGrid className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] uppercase tracking-widest mono font-semibold">Live Visual Output Preview</span>
        </div>
        <span className="text-[10px] mono text-text-dim uppercase tracking-widest">{w}:{h}</span>
      </div>
      {/* Container uses aspect-ratio so the SVG fills exactly the visual ratio (no empty gaps) */}
      <div
        className="rounded-lg flex items-center justify-center mx-auto w-full overflow-hidden border border-border"
        style={{
          aspectRatio: `${w} / ${h}`,
          maxHeight: CONTAINER_MAX_H,
          maxWidth: computedMaxWidth,
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <svg viewBox={`0 0 ${targetW} ${targetH}`} className="w-full h-full block"
             preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="softShadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18"/></filter>
          </defs>
          {mode === 'banner' && renderBanner(targetW, targetH, state)}
          {mode === 'thumbnail' && renderThumbnail(targetW, targetH, state)}
          {mode === 'typography' && renderTypography(targetW, targetH, state)}
          {isReview && renderReviewBanner(targetW, targetH, state)}
          {isCarousel && renderCarouselCover(targetW, targetH, state)}
          {mode === 'gridfeed' && renderGridFeed(targetW, targetH, state)}
          {mode === 'newscard' && renderNewsCard(targetW, targetH, state)}
          {mode === 'quotecard' && renderQuoteCard(targetW, targetH, state)}
          {mode === 'factcheck' && renderFactCheck(targetW, targetH, state)}
          {mode === 'copywriting' && renderCopywriting(targetW, targetH, state)}
          {mode === 'videoscript' && renderVideoScript(targetW, targetH, state)}
          {mode === 'presentation' && renderPresentation(targetW, targetH, state)}
          {mode === 'article' && renderArticle(targetW, targetH, state)}
          {mode === 'flyerbanner' && renderFlyerBanner(targetW, targetH, state)}
        </svg>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-3 gap-1.5 text-[10px] mt-1">
        {isCarousel ? (
          <>
            <Meta label="Cover" value={(COVER_LABELS[state.coverLayout] || '—')} />
            <Meta label="Slides" value={state.totalSlides || '—'} />
            <Meta label="Ratio" value={`${w}:${h}`} />
          </>
        ) : isReview ? (
          <>
            <Meta label="Framework" value={(state.review_framework || '—').replace(/_review$/, '').replace(/_/g, ' ')} />
            <Meta label="Layout"   value={(state.layout_type || '—').replace(/ Layout$/, '')} />
            <Meta label="Product"  value={state.product_position || '—'} />
          </>
        ) : mode === 'gridfeed' ? (
          <>
            <Meta label="Grid" value="3x3 (9 Feeds)" />
            <Meta label="Style" value={state.visualStyle || 'Islamic modern'} />
            <Meta label="Audience" value={(state.targetAudience || 'Wali Santri').slice(0, 16)} />
          </>
        ) : mode === 'newscard' ? (
          <>
            <Meta label="Badge" value={state.badge || 'News'} />
            <Meta label="Rubrik" value={(state.rubric || 'Pendidikan').slice(0, 16)} />
            <Meta label="Media" value={(state.mediaName || 'Warta BKPRMI').slice(0, 16)} />
          </>
        ) : mode === 'quotecard' ? (
          <>
            <Meta label="Tokoh" value={(state.sourceName || 'Narasumber').slice(0, 16)} />
            <Meta label="Media" value={(state.mediaName || 'BKPRMI').slice(0, 16)} />
            <Meta label="Date" value={state.date || '14 Okt 2026'} />
          </>
        ) : mode === 'factcheck' ? (
          <>
            <Meta label="Status" value={(state.status || 'Verifikasi').slice(0, 16)} />
            <Meta label="Media" value="Cek Fakta" />
            <Meta label="Sumber" value="Rilis Resmi" />
          </>
        ) : mode === 'copywriting' ? (
          <>
            <Meta label="Platform" value={(state.platform || 'WhatsApp').slice(0, 16)} />
            <Meta label="Formula" value="K-C-A" />
            <Meta label="Audience" value={(state.audience || 'Wali Santri').slice(0, 16)} />
          </>
        ) : mode === 'videoscript' ? (
          <>
            <Meta label="Durasi" value={state.duration || '30s'} />
            <Meta label="Platform" value={(state.platform || 'Reels/TikTok').slice(0, 16)} />
            <Meta label="Style" value="Sinematik" />
          </>
        ) : mode === 'presentation' ? (
          <>
            <Meta label="Slide" value={`${state.slideCount || 10} Slide`} />
            <Meta label="Durasi" value={state.duration || '45-60m'} />
            <Meta label="Style" value={(state.designStyle || 'Clean Edukatif').slice(0, 16)} />
          </>
        ) : mode === 'article' ? (
          <>
            <Meta label="Format" value={state.format || 'Straight News'} />
            <Meta label="Rubrik" value={(state.rubric || 'Pendidikan').slice(0, 16)} />
            <Meta label="Dateline" value={(state.dateline || 'Sakatiga').slice(0, 16)} />
          </>
        ) : mode === 'flyerbanner' ? (
          <>
            <Meta label="Format" value={(state.formatType || 'Spanduk').toUpperCase()} />
            <Meta label="Ukuran" value={(state.sizeVariant || '3x1').replace(/^[a-z]+_/, '').toUpperCase()} />
            <Meta label="Bahan" value={(state.printingSpec || 'Outdoor Flexi').slice(0, 16)} />
          </>
        ) : (
          <>
            <Meta label="Style"  value={state.style || state.designStyle || state.dna || '—'} />
            <Meta label="Images"  value={state.imageCount || 1} />
            <Meta label="Position" value={state.position || (mode === 'typography' ? 'center' : 'right')} />
            {mode === 'thumbnail' && <Meta label="Mood" value={state.mood || '—'} />}
            {mode === 'thumbnail' && <Meta label="Lighting" value={state.lighting || '—'} />}
            {mode === 'typography' && <Meta label="Layout" value={state.layout || '—'} />}
            {mode === 'typography' && <Meta label="Energy" value={state.energy || '—'} />}
          </>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="surface-elev px-2.5 py-1.5">
      <div className="uppercase tracking-widest text-text-dim mono text-[9px]">{label}</div>
      <div className="text-text font-medium mono text-[11px] truncate">{value}</div>
    </div>
  );
}

// ═══ POSITION → ZONE HELPERS (konsisten utk semua mode) ═══
// Subject zone = area dimana product/character placeholder taruh
function subjectZone(W, H, pos) {
  switch (pos) {
    case 'right':     return { x: W*0.55, y: H*0.15, w: W*0.38, h: H*0.7  };
    case 'left':      return { x: W*0.07, y: H*0.15, w: W*0.38, h: H*0.7  };
    case 'center':    return { x: W*0.25, y: H*0.42, w: W*0.5,  h: H*0.5  };
    case 'isometric': return { x: W*0.42, y: H*0.12, w: W*0.5,  h: H*0.55 };
    case 'dynamic':   return { x: W*0.05, y: H*0.45, w: W*0.9,  h: H*0.48 };
    default:          return { x: W*0.55, y: H*0.15, w: W*0.38, h: H*0.7  };
  }
}

// Text zone = area dimana headline + supporting text taruh (OPPOSITE side dari subject)
function textZone(W, H, pos) {
  switch (pos) {
    case 'right':     return { x: 22,      y: H*0.3,  w: W*0.46 }; // text left, subject right
    case 'left':      return { x: W*0.52,  y: H*0.3,  w: W*0.46 }; // text right, subject left
    case 'center':    return { x: 22,      y: H*0.08, w: W*0.96 }; // text top, subject bottom-center
    case 'isometric': return { x: 22,      y: H*0.7,  w: W*0.5  }; // text bottom-left, subject top-right floating
    case 'dynamic':   return { x: 22,      y: H*0.08, w: W*0.55 }; // text top-left, subject big bottom
    default:          return { x: 22,      y: H*0.3,  w: W*0.46 };
  }
}

function renderBanner(W, H, s) {
  const pos   = s.position || 'center';
  const count = Math.max(1, Math.min(5, s.imageCount || 1));
  const t     = textZone(W, H, pos);

  return (
    <g>
      {/* Image placeholders react to position + count */}
      {renderImagePlaceholders(W, H, count, pos)}
      {/* Text lines (headline · sub · description) */}
      <rect x={t.x} y={t.y}        width={Math.min(t.w, 140)} height={10} rx={3} fill="white" fillOpacity="0.95" filter="url(#softShadow)" />
      <rect x={t.x} y={t.y + 18}   width={Math.min(t.w * 0.7, 90)} height={6}  rx={2} fill="white" fillOpacity="0.7" />
      <rect x={t.x} y={t.y + 30}   width={Math.min(t.w * 0.5, 70)} height={6}  rx={2} fill="white" fillOpacity="0.55" />
      {s.cta && (
        <rect x={t.x} y={t.y + 50} width={70} height={18} rx={9} fill="white" fillOpacity="0.95" filter="url(#softShadow)" />
      )}
    </g>
  );
}

function renderImagePlaceholders(W, H, count, pos) {
  const boxFill = 'rgba(255,255,255,0.35)';
  const boxStroke = 'rgba(0,0,0,0.15)';
  const boxBase = { rx: 6, fill: boxFill, stroke: boxStroke, strokeWidth: 1 };
  const items = [];
  const z = subjectZone(W, H, pos);
  const { x: zoneX, y: zoneY, w: zoneW, h: zoneH } = z;

  if (count === 1) {
    items.push(<rect key="i0" x={zoneX} y={zoneY} width={zoneW} height={zoneH} {...boxBase} />);
  } else if (count === 2) {
    // Stack arah: dynamic/horizontal → side by side; vertical position → stack
    if (pos === 'dynamic' || pos === 'center') {
      const w2 = (zoneW - 8) / 2;
      items.push(<rect key="i0" x={zoneX}        y={zoneY} width={w2} height={zoneH} {...boxBase} />);
      items.push(<rect key="i1" x={zoneX + w2 + 8} y={zoneY} width={w2} height={zoneH} {...boxBase} />);
    } else {
      const w2 = (zoneW - 8) / 2;
      items.push(<rect key="i0" x={zoneX}        y={zoneY} width={w2} height={zoneH} {...boxBase} />);
      items.push(<rect key="i1" x={zoneX + w2 + 8} y={zoneY} width={w2} height={zoneH} {...boxBase} />);
    }
  } else if (count === 3) {
    const main = zoneW * 0.6;
    const stack = zoneW - main - 8;
    items.push(<rect key="i0" x={zoneX} y={zoneY} width={main} height={zoneH} {...boxBase} />);
    const h2 = (zoneH - 8) / 2;
    items.push(<rect key="i1" x={zoneX + main + 8} y={zoneY} width={stack} height={h2} {...boxBase} />);
    items.push(<rect key="i2" x={zoneX + main + 8} y={zoneY + h2 + 8} width={stack} height={h2} {...boxBase} />);
  } else if (count === 4) {
    const w2 = (zoneW - 8) / 2;
    const h2 = (zoneH - 8) / 2;
    for (let i = 0; i < 4; i++) {
      items.push(<rect key={'i'+i} x={zoneX + (i%2)*(w2+8)} y={zoneY + Math.floor(i/2)*(h2+8)} width={w2} height={h2} {...boxBase} />);
    }
  } else if (count === 5) {
    const w2 = (zoneW - 8) / 2;
    const h2 = (zoneH - 8) / 2;
    items.push(<rect key="i0" x={zoneX} y={zoneY} width={w2} height={h2} {...boxBase} />);
    items.push(<rect key="i1" x={zoneX + w2 + 8} y={zoneY} width={w2} height={h2} {...boxBase} />);
    items.push(<rect key="i2" x={zoneX} y={zoneY + h2 + 8} width={w2} height={h2} {...boxBase} />);
    items.push(<rect key="i3" x={zoneX + w2 + 8} y={zoneY + h2 + 8} width={w2} height={h2} {...boxBase} />);
    items.push(<rect key="i4" x={zoneX + zoneW/4} y={zoneY + zoneH/3} width={zoneW/2} height={zoneH/3} {...boxBase} fill="rgba(255,255,255,0.55)" />);
  }
  return items;
}

function renderThumbnail(W, H, s) {
  const pos   = s.position   || 'right';
  const count = Math.max(1, Math.min(5, s.imageCount || 1));
  const t     = textZone(W, H, pos);

  return (
    <g>
      {/* Image/subject placeholders react to position + count */}
      {renderImagePlaceholders(W, H, count, pos)}
      {/* Big title block — uses textZone (selalu opposite dari subject) */}
      <rect x={t.x} y={t.y}        width={Math.min(t.w, W*0.5)} height={16} rx={3} fill="white" filter="url(#softShadow)" />
      <rect x={t.x} y={t.y + 22}   width={Math.min(t.w * 0.78, W*0.4)} height={10} rx={2} fill="white" fillOpacity="0.85" />
      <rect x={t.x} y={t.y + 38}   width={Math.min(t.w * 0.6, W*0.3)}  height={8}  rx={2} fill="white" fillOpacity="0.65" />
    </g>
  );
}

// ═══ REVIEW BANNER WIREFRAME (layout-aware, ink-adaptive) ═══
// Palette name → [primary, secondary] hex untuk background mock.
const RV_PALETTE_HEX = {
  'Luxury Black Gold':            ['#1a1408', '#d4af37'],
  'Clean White Beige':           ['#efe7d8', '#cdbfa6'],
  'Soft Pastel':                 ['#f6cfe0', '#cfe5f7'],
  'Premium Neutral':             ['#b9b1a3', '#3a3c40'],
  'Bright Ecommerce':            ['#e23b3b', '#f4d03f'],
  'Rose Gold Elegant':           ['#e3b7a8', '#f3d3d0'],
  'Fresh Green Natural':         ['#b7c9a8', '#eef2e6'],
  'Ocean Blue Modern':           ['#2f6fb0', '#1f2a44'],
  'Earthy Warm':                 ['#c1663f', '#e8d6bf'],
  'Bold Red White':              ['#e23b3b', '#f5f5f5'],
  'Monochrome':                  ['#2b2b2b', '#cfcfcf'],
  'Vibrant Gradient':            ['#8b5cf6', '#f97316'],
  'Brand Color Matching Product':['#9aa0a6', '#e5e7eb'],
};
function reviewColors(s) {
  const p = s.primary_color, sec = s.secondary_color;
  if (p || sec) return [p || '#cccccc', sec || '#f1f1f1'];
  return RV_PALETTE_HEX[s.color_palette] || ['#e5e7eb', '#cbd5e1'];
}
function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 0.6;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299*r + 0.587*g + 0.114*b) / 255;
}

function renderReviewBanner(W, H, s) {
  const [bg] = reviewColors(s);
  const ink = luminance(bg) > 0.55 ? '#1f2937' : '#ffffff'; // dark ink on light bg, light on dark
  const ACC = '#ef4444';
  const rvProduct = (k, x, y, w, h) => ([
    <rect key={k} x={x} y={y} width={w} height={h} rx={8} fill={ink} fillOpacity={0.08} stroke={ink} strokeOpacity={0.32} strokeWidth={1} filter="url(#softShadow)" />,
    <circle key={k + 'c'} cx={x + w/2} cy={y + h/2} r={Math.min(w, h)*0.16} fill={ink} fillOpacity={0.16} />,
  ]);
  const rvHeadline = (k, x, y, w, big) => ([
    <rect key={k} x={x} y={y} width={w} height={big ? 20 : 12} rx={4} fill={ink} fillOpacity={0.9} />,
    <rect key={k + '2'} x={x} y={y + (big ? 26 : 17)} width={w*0.62} height={big ? 11 : 7} rx={3} fill={ink} fillOpacity={0.5} />,
  ]);
  const rvReview = (k, x, y, barW, rows = 3) => {
    const a = [];
    for (let i = 0; i < rows; i++) {
      a.push(<rect key={k + 'c' + i} x={x} y={y + i*13} width={7} height={7} rx={2} fill={ACC} fillOpacity={0.85} />);
      a.push(<rect key={k + 'b' + i} x={x + 12} y={y + i*13 + 1} width={barW} height={5} rx={2} fill={ink} fillOpacity={0.45} />);
    }
    return a;
  };
  const rvCTA = (k, x, y, w) => <rect key={k} x={x} y={y} width={w} height={17} rx={8.5} fill={ACC} filter="url(#softShadow)" />;
  const rvTrust = (k, x, y, w = 56) => <rect key={k} x={x} y={y} width={w} height={12} rx={6} fill={ink} fillOpacity={0.14} stroke={ink} strokeOpacity={0.3} />;
  const rvHuman = (k, x, y, w, h) => <rect key={k} x={x} y={y} width={w} height={h} rx={10} fill={ink} fillOpacity={0.12} stroke={ink} strokeOpacity={0.28} />;
  const rvBadges = (list, cx, cy) => (list || []).slice(0, 2).map((b, i) =>
    <circle key={'bg' + b + i} cx={cx} cy={cy + i*22} r={9} fill={ACC} fillOpacity={0.9} filter="url(#softShadow)" />);

  const L = s.layout_type || '';
  const human = !!s.human_enable;
  const trust = !!s.trust_enable;
  const big = s.headline_placement === 'large center headline';
  const ctaRight = /bottom right/.test(s.cta_placement || '');
  const ctaW = W*0.36, ctaY = H*0.87;
  const ctaX = ctaRight ? W*0.56 : W*0.5 - ctaW/2;
  const e = [];

  // Archetype digerakkan layout_type ATAU review_framework (dua-duanya bikin wireframe berubah)
  const key = `${L} ${s.review_framework || ''}`;
  const arch =
    /Comparison|Split|before_after|expectation|problem_solution|premium_vs_cheap|pros_cons/.test(key) ? 'comparison' :
    /Creator|creator_quote|first_impression/.test(key) ? 'creator' :
    /Marketplace|rating_breakdown|social_proof/.test(key)  ? 'marketplace' :
    /Feature|feature_breakdown/.test(key) ? 'feature' :
    /Grid/.test(key) ? 'grid' :
    'hero';

  // Headline koordinat ← headline_placement
  const hpl = s.headline_placement || 'top center';
  const hW = big ? W*0.84 : W*0.58;
  const headP =
    hpl === 'top left' || hpl === 'diagonal accent' ? { x: W*0.06, y: H*0.06, w: hW } :
    hpl === 'top right'                             ? { x: W*0.94 - hW, y: H*0.06, w: hW } :
    hpl === 'beside product'                        ? { x: W*0.06, y: H*0.36, w: W*0.42 } :
    hpl === 'bottom center'                         ? { x: W*0.5 - hW/2, y: H*0.76, w: hW } :
    hpl === 'center overlay'                        ? { x: W*0.12, y: H*0.44, w: W*0.76 } :
    hpl === 'large center headline'                 ? { x: W*0.08, y: H*0.34, w: W*0.84 } :
                                                      { x: W*0.5 - hW/2, y: H*0.06, w: hW }; // top center
  const head = () => rvHeadline('h', headP.x, headP.y, headP.w, big);

  // Human position
  const hpos = s.human_position || 'right side';
  const humanLeft = /left/.test(hpos);
  const humanCenter = /center|behind/.test(hpos);

  if (arch === 'comparison') {
    e.push(...head());
    const py = H*0.28, ph = H*0.38;
    e.push(<rect key="lblA" x={W*0.1}  y={py - 12} width={42} height={9} rx={3} fill={ink} fillOpacity={0.7} />);
    e.push(<rect key="lblB" x={W*0.56} y={py - 12} width={42} height={9} rx={3} fill={ink} fillOpacity={0.7} />);
    e.push(...rvProduct('pa', W*0.08, py, W*0.38, ph));
    e.push(...rvProduct('pb', W*0.54, py, W*0.38, ph));
    e.push(<line key="div" x1={W*0.5} y1={py - 4} x2={W*0.5} y2={py + ph + 4} stroke={ink} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4 4" />);
    if (trust) e.push(rvTrust('t', W*0.5 - 28, H*0.7, 56));
    e.push(rvCTA('cta', ctaX, ctaY, ctaW));
  } else if (arch === 'creator') {
    const hux = humanLeft || !(/right|beside/.test(hpos)) ? W*0.06 : W*0.54;
    const pux = hux < W*0.3 ? W*0.58 : W*0.1;
    e.push(...head());
    e.push(rvHuman('hu', hux, H*0.26, W*0.4, H*0.64));
    e.push(...rvProduct('p', pux, H*0.52, W*0.32, H*0.3));
    e.push(<rect key="q" x={pux - W*0.04} y={H*0.26} width={W*0.4} height={H*0.18} rx={10} fill={ink} fillOpacity={0.12} stroke={ink} strokeOpacity={0.3} filter="url(#softShadow)" />);
    e.push(...rvReview('r', pux, H*0.3, W*0.3, 2));
    if (trust) e.push(rvTrust('t', pux, H*0.47, 50));
    e.push(...rvBadges(s.badges, pux + W*0.28, H*0.55));
    e.push(rvCTA('cta', ctaRight ? W*0.56 : W*0.54, ctaY, ctaW));
  } else if (arch === 'marketplace') {
    e.push(...head());
    e.push(...rvProduct('p', W*0.06, H*0.26, W*0.4, H*0.46));
    e.push(...rvBadges(s.badges, W*0.12, H*0.32));
    const rx = W*0.52;
    for (let i = 0; i < 5; i++) e.push(<circle key={'st' + i} cx={rx + 6 + i*14} cy={H*0.3} r={4} fill={ACC} fillOpacity={0.9} />);
    for (let i = 0; i < 3; i++) {
      e.push(<rect key={'sb0' + i} x={rx} y={H*0.4 + i*15} width={W*0.4} height={6} rx={3} fill={ink} fillOpacity={0.14} />);
      e.push(<rect key={'sb1' + i} x={rx} y={H*0.4 + i*15} width={W*0.4*(0.6 + 0.13*i)} height={6} rx={3} fill={ink} fillOpacity={0.55} />);
    }
    if (trust) e.push(rvTrust('t', rx, H*0.62, 72));
    e.push(rvCTA('cta', W*0.52, ctaY, W*0.4));
  } else if (arch === 'feature') {
    e.push(...head());
    const cx = W*0.5, cy = H*0.5, pw = W*0.28, ph = H*0.3;
    e.push(...rvProduct('p', cx - pw/2, cy - ph/2, pw, ph));
    const calls = [[W*0.1, H*0.3], [W*0.76, H*0.32], [W*0.1, H*0.64], [W*0.76, H*0.66]];
    calls.forEach(([bx, by], i) => {
      e.push(<line key={'fl' + i} x1={cx} y1={cy} x2={bx + W*0.06} y2={by + 7} stroke={ink} strokeOpacity={0.4} strokeWidth={1} />);
      e.push(<rect key={'fb' + i} x={bx} y={by} width={W*0.14} height={14} rx={7} fill={ink} fillOpacity={0.14} stroke={ink} strokeOpacity={0.3} filter="url(#softShadow)" />);
    });
    e.push(rvCTA('cta', ctaX, ctaY, ctaW));
  } else if (arch === 'grid') {
    e.push(...head());
    const gx = W*0.19, gy = H*0.24, gw = W*0.29, gh = H*0.26, gap = 10;
    for (let i = 0; i < 4; i++) {
      e.push(...rvProduct('g' + i, gx + (i%2)*(gw + gap), gy + Math.floor(i/2)*(gh + gap), gw, gh));
    }
    if (trust) e.push(rvTrust('t', W*0.5 - 28, H*0.78, 56));
    e.push(rvCTA('cta', ctaX, ctaY, ctaW));
  } else {
    // HERO / MAGAZINE / SPOTLIGHT — produk ← product_position, human ← human_position (anti-tabrakan)
    const pzy = H*0.25, pzh = H*0.32;
    const pp = s.product_position || '';
    let prodSide = /left/.test(pp) ? 'L' : /right/.test(pp) ? 'R' : 'C';
    let humSide = !human ? null : humanLeft ? 'L' : (/right|beside/.test(hpos) ? 'R' : (humanCenter ? 'C' : 'R'));
    // hindari produk & human di sisi sama (non-center)
    if (humSide && humSide === prodSide && prodSide !== 'C') humSide = prodSide === 'L' ? 'R' : 'L';
    // produk center + human di sisi → dorong produk ke sisi berlawanan
    if (prodSide === 'C' && humSide === 'L') prodSide = 'R';
    else if (prodSide === 'C' && humSide === 'R') prodSide = 'L';
    let pzx = prodSide === 'L' ? W*0.07 : prodSide === 'R' ? W*0.51 : W*0.30;
    let pzw = (humSide && humSide !== 'C') ? W*0.42 : W*0.40;
    if (humSide === 'C') { pzx = W*0.34; pzw = W*0.32; } // human di belakang produk
    if (human) {
      const hx = humSide === 'L' ? W*0.05 : humSide === 'C' ? W*0.34 : W*0.63;
      const hw = humSide === 'C' ? W*0.32 : W*0.3;
      e.push(rvHuman('hu', hx, H*0.22, hw, H*0.62)); // di-push duluan → di belakang produk
    }
    e.push(...head());
    e.push(...rvProduct('p', pzx, pzy, pzw, pzh));
    if (trust) e.push(rvTrust('t', pzx, pzy - 15, 56));
    e.push(...rvBadges(s.badges, pzx + pzw - 6, pzy + 12));
    e.push(...rvReview('r', W*0.08, H*0.66, W*0.34));
    e.push(rvCTA('cta', ctaX, ctaY, ctaW));
  }

  // Human element selalu muncul/hilang di SEMUA layout (hero & creator sudah handle)
  if (human && arch !== 'hero' && arch !== 'creator') {
    e.push(rvHuman('huX', humanLeft ? W*0.03 : W*0.79, H*0.48, W*0.18, H*0.42));
  }

  return <g>{e}</g>;
}

// ═══ CAROUSEL COVER WIREFRAME (slide 1) — letak gambar & teks dari dropdown ═══
function newsImageBox(x, y, w, h, key) {
  const r = [];
  r.push(<rect key={key} x={x} y={y} width={w} height={h} rx={6} fill="rgba(255,255,255,0.30)" stroke="rgba(0,0,0,0.18)" strokeWidth={1} filter="url(#softShadow)" />);
  const cx = x + w * 0.3, cy = y + h * 0.34, rad = Math.min(w, h) * 0.09;
  r.push(<circle key={key + 's'} cx={cx} cy={cy} r={rad} fill="rgba(255,255,255,0.6)" />);
  r.push(<path key={key + 'm'} d={`M${x + 5} ${y + h - 5} L${x + w * 0.4} ${y + h * 0.52} L${x + w * 0.62} ${y + h - 5} Z`} fill="rgba(255,255,255,0.45)" />);
  r.push(<path key={key + 'm2'} d={`M${x + w * 0.46} ${y + h - 5} L${x + w * 0.72} ${y + h * 0.46} L${x + w - 5} ${y + h - 5} Z`} fill="rgba(255,255,255,0.32)" />);
  return r;
}
function newsHeadline(x, y, w, key, big, ink = 'white') {
  const hh = big ? 16 : 11, gap = 6;
  return [
    <rect key={key}        x={x} y={y}                width={w}       height={hh}        rx={3} fill={ink} filter="url(#softShadow)" />,
    <rect key={key + '2'}  x={x} y={y + hh + gap}     width={w * 0.82} height={hh}        rx={3} fill={ink} fillOpacity="0.9" />,
    <rect key={key + '3'}  x={x} y={y + (hh + gap) * 2} width={w * 0.5} height={big ? 9 : 7} rx={2} fill={ink} fillOpacity="0.6" />,
  ];
}
function renderCarouselCover(W, H, s) {
  const layout = s.coverLayout || 'auto';
  const ink = (s.templateType === 'news' && s.newsTextColor) ? s.newsTextColor : 'white';
  const e = [];
  // Category tag (kiri atas) + slide indicator (kanan atas) + source bar (bawah)
  e.push(<rect key="cat" x={14} y={12} width={54} height={15} rx={4} fill="#ef4444" filter="url(#softShadow)" />);
  e.push(<rect key="cat2" x={20} y={17} width={32} height={5} rx={2} fill="white" fillOpacity={0.95} />);
  e.push(<rect key="ind" x={W - 44} y={12} width={30} height={14} rx={7} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />);
  e.push(<rect key="src" x={14} y={H - 22} width={W - 28} height={10} rx={5} fill="rgba(255,255,255,0.16)" />);
  e.push(<circle key="srcd" cx={23} cy={H - 17} r={3} fill="#ef4444" />);

  const top = 40, bottom = H - 32, ch = bottom - top;
  if (layout === 'image-top') {
    e.push(...newsImageBox(W * 0.06, top, W * 0.88, ch * 0.52, 'img'));
    e.push(...newsHeadline(W * 0.06, top + ch * 0.6, W * 0.74, 'h', true, ink));
  } else if (layout === 'image-bottom') {
    e.push(...newsHeadline(W * 0.06, top, W * 0.74, 'h', true, ink));
    e.push(...newsImageBox(W * 0.06, top + ch * 0.46, W * 0.88, ch * 0.54, 'img'));
  } else if (layout === 'image-right') {
    e.push(...newsImageBox(W * 0.52, top, W * 0.42, ch, 'img'));
    e.push(...newsHeadline(W * 0.06, top + ch * 0.22, W * 0.4, 'h', false, ink));
  } else if (layout === 'image-left') {
    e.push(...newsImageBox(W * 0.06, top, W * 0.42, ch, 'img'));
    e.push(...newsHeadline(W * 0.52, top + ch * 0.22, W * 0.4, 'h', false, ink));
  } else if (layout === 'image-full') {
    e.push(...newsImageBox(W * 0.04, top - 4, W * 0.92, ch + 8, 'img'));
    e.push(<rect key="ov" x={W * 0.04} y={top + ch * 0.48} width={W * 0.92} height={ch * 0.52 + 4} rx={6} fill="rgba(0,0,0,0.45)" />);
    e.push(...newsHeadline(W * 0.1, top + ch * 0.62, W * 0.72, 'h', true, ink));
  } else if (layout === 'text-focus') {
    e.push(...newsImageBox(W * 0.06, top, W * 0.34, ch * 0.28, 'img'));
    e.push(...newsHeadline(W * 0.06, top + ch * 0.42, W * 0.86, 'h', true, ink));
  } else { // auto / hero (default) — gambar kanan-tengah, headline kiri-atas
    e.push(...newsImageBox(W * 0.52, top + ch * 0.12, W * 0.42, ch * 0.72, 'img'));
    e.push(...newsHeadline(W * 0.06, top + ch * 0.12, W * 0.4, 'h', true, ink));
  }
  return <g>{e}</g>;
}

function renderTypography(W, H, s) {
  const pos   = s.position || 'center';
  const count = Math.max(1, Math.min(5, s.imageCount || 1));
  const t     = textZone(W, H, pos);

  // Typography mode = headline dominan; subject placeholder optional
  // Aturan: kalau count=1 + position=center, headline mega-besar tanpa subject (typography hero)
  const headlineOnly = count === 1 && pos === 'center';
  const headlineW = headlineOnly ? W*0.85 : t.w;
  const headlineX = headlineOnly ? (W - headlineW) / 2 : t.x;
  const headlineY = headlineOnly ? H*0.32 : t.y;

  return (
    <g>
      {/* Subject placeholders kecuali headlineOnly */}
      {!headlineOnly && renderImagePlaceholders(W, H, count, pos)}

      {/* Headline block */}
      <rect x={headlineX} y={headlineY}        width={headlineW}        height={20} rx={4} fill="white" filter="url(#softShadow)" />
      <rect x={headlineX} y={headlineY + 26}   width={headlineW * 0.75} height={14} rx={3} fill="white" fillOpacity="0.85" />
      <rect x={headlineX} y={headlineY + 50}   width={headlineW * 0.4}  height={10} rx={2} fill="white" fillOpacity="0.7" />

      {/* Character placeholder kalau ada Character pilihan + headlineOnly */}
      {headlineOnly && s.character && s.character !== 'No Human' && s.character !== 'Auto Character' && (
        <rect x={W*0.68} y={H*0.55} width={W*0.25} height={H*0.4} rx={8} fill="rgba(255,255,255,0.25)" stroke="rgba(0,0,0,0.1)" />
      )}
    </g>
  );
}

function renderGridFeed(W, H, s) {
  const pad = 12;
  const gap = 6;
  const gridW = W - pad * 2;
  const gridH = H - pad * 2;
  const cellW = (gridW - gap * 2) / 3;
  const cellH = (gridH - gap * 2) / 3;

  const tiles = [
    { label: s.headline ? (s.headline.length > 18 ? s.headline.slice(0, 16) + '..' : s.headline) : 'Hero Feed', tag: 'Feed 1', bg: 'rgba(255,255,255,0.22)', isHero: true },
    { label: s.mainBenefit ? (s.mainBenefit.length > 16 ? s.mainBenefit.slice(0, 14) + '..' : s.mainBenefit) : 'Program', tag: 'Feed 2', bg: 'rgba(255,255,255,0.12)' },
    { label: 'Kurikulum Adab', tag: 'Feed 3', bg: 'rgba(255,255,255,0.15)' },
    { label: 'Suasana Santri', tag: 'Feed 4', bg: 'rgba(255,255,255,0.14)' },
    { label: s.brandName || s.productName || 'SmartFeed', tag: 'Feed 5 · Brand', bg: 'rgba(255,255,255,0.3)', isCenter: true },
    { label: 'Testimoni Wali', tag: 'Feed 6', bg: 'rgba(255,255,255,0.13)' },
    { label: 'Infaq & Wakaf', tag: 'Feed 7', bg: 'rgba(255,255,255,0.15)' },
    { label: 'Mutiara Hadits', tag: 'Feed 8', bg: 'rgba(255,255,255,0.12)' },
    { label: s.ctaText ? (s.ctaText.length > 14 ? s.ctaText.slice(0, 12) + '..' : s.ctaText) : 'Daftar Sekarang', tag: 'Feed 9 · CTA', bg: 'rgba(255,255,255,0.24)', isCta: true },
  ];

  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="none" />
      {tiles.map((t, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const x = pad + col * (cellW + gap);
        const y = pad + row * (cellH + gap);
        return (
          <g key={idx}>
            <rect x={x} y={y} width={cellW} height={cellH} rx={6} fill={t.bg} stroke="rgba(255,255,255,0.3)" strokeWidth={1} filter="url(#softShadow)" />
            <rect x={x + 4} y={y + 4} width={cellW * 0.52} height={8} rx={2} fill={t.isHero ? '#f59e0b' : t.isCta ? '#10b981' : 'rgba(255,255,255,0.35)'} />
            <text x={x + 6} y={y + 10.5} fontSize={5.5} fontFamily="sans-serif" fontWeight="bold" fill="#ffffff" letterSpacing={0.4}>
              {t.tag}
            </text>
            <text x={x + cellW / 2} y={y + cellH / 2 + 3} fontSize={t.isCenter ? 8 : 7} fontWeight={t.isCenter ? '900' : 'bold'} fontFamily="sans-serif" fill="#ffffff" textAnchor="middle">
              {t.label}
            </text>
            <line x1={x + 8} y1={y + cellH - 7} x2={x + cellW - 8} y2={y + cellH - 7} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
          </g>
        );
      })}
    </g>
  );
}

function renderNewsCard(W, H, s) {
  const pad = 14;
  const cardW = W - pad * 2;
  const headline = s.headline || 'Headline Berita Utama Terkini';
  const badge = s.badge || 'BREAKING NEWS';
  const isBreaking = badge.includes('BREAKING');

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={10} fill="#0b1329" stroke="rgba(255,255,255,0.2)" strokeWidth={1} filter="url(#softShadow)" />
      
      {/* Header Bar */}
      <rect x={pad} y={pad} width={cardW} height={28} rx={10} fill="#070c1b" />
      <text x={pad + 12} y={pad + 18} fontSize={9} fontWeight="900" fill="#ffffff" letterSpacing={0.8} fontFamily="sans-serif">
        {s.mediaName || 'WARTA BKPRMI RESMI'}
      </text>
      <text x={W - pad - 12} y={pad + 18} fontSize={7.5} fontWeight="bold" fill="#94a3b8" textAnchor="end" fontFamily="sans-serif">
        {s.date || '14 Oktober 2026'}
      </text>

      {/* Badge & Rubric */}
      <rect x={pad + 12} y={pad + 36} width={isBreaking ? 85 : 75} height={15} rx={3} fill={isBreaking ? '#dc2626' : '#2563eb'} />
      <text x={pad + 16} y={pad + 47} fontSize={7.5} fontWeight="900" fill="#ffffff" letterSpacing={0.5} fontFamily="sans-serif">
        {badge}
      </text>
      <text x={pad + (isBreaking ? 102 : 92)} y={pad + 47} fontSize={7.5} fontWeight="bold" fill="#38bdf8" fontFamily="sans-serif">
        ● {s.rubric || 'Pendidikan & Dakwah'}
      </text>

      {/* Headline text */}
      <text x={pad + 12} y={pad + 68} fontSize={11.5} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {headline.length > 36 ? headline.slice(0, 34) + '...' : headline}
      </text>
      {headline.length > 34 && (
        <text x={pad + 12} y={pad + 84} fontSize={11.5} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
          {headline.slice(34, 72) + (headline.length > 72 ? '...' : '')}
        </text>
      )}

      {/* Photo Frame Wireframe */}
      <rect x={pad + 12} y={pad + 96} width={cardW - 24} height={H * 0.46} rx={6} fill="#1e293b" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <text x={W / 2} y={pad + 96 + H * 0.23} fontSize={9.5} fontWeight="bold" fill="#64748b" textAnchor="middle" fontFamily="sans-serif">
        📷 {s.photographyStyle ? (s.photographyStyle.slice(0, 28) + '...') : 'Foto Jurnalistik / Dokumentasi'}
      </text>

      {/* Dateline & Lead Box */}
      <rect x={pad + 12} y={H - pad - 42} width={cardW - 24} height={32} rx={5} fill="rgba(15,23,42,0.92)" />
      <text x={pad + 18} y={H - pad - 28} fontSize={8} fontWeight="900" fill="#f59e0b" fontFamily="sans-serif">
        {s.dateline ? `${s.dateline} — ` : 'SAKATIGA — '}
      </text>
      <text x={pad + 18} y={H - pad - 16} fontSize={7} fill="#cbd5e1" fontFamily="sans-serif">
        {(s.lead || 'Fakta utama berita dan substansi penting liputan.').slice(0, 52)}
      </text>
    </g>
  );
}

function renderQuoteCard(W, H, s) {
  const pad = 14;
  const cardW = W - pad * 2;
  const quoteText = s.quote || 'Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya.';
  const speaker = s.sourceName || 'Nama Narasumber / Tokoh';
  const role = s.sourceRole || 'Pendidik Al-Qur\'an & Dai';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={12} fill="#061c1e" stroke="rgba(20,184,166,0.3)" strokeWidth={1} filter="url(#softShadow)" />

      {/* Quote Mark Icon */}
      <text x={pad + 14} y={pad + 38} fontSize={40} fontWeight="900" fill="#14b8a6" fillOpacity={0.4} fontFamily="serif">
        “
      </text>

      {/* Header */}
      <text x={W - pad - 14} y={pad + 22} fontSize={8} fontWeight="bold" fill="#5eead4" textAnchor="end" letterSpacing={0.5} fontFamily="sans-serif">
        {s.mediaName || 'MUTIARA DAKWAH'}
      </text>

      {/* Quote Body */}
      <text x={pad + 18} y={pad + 58} fontSize={10.5} fontStyle="italic" fontWeight="600" fill="#f0fdfa" fontFamily="sans-serif">
        {quoteText.length > 38 ? quoteText.slice(0, 36) + '...' : quoteText}
      </text>
      {quoteText.length > 36 && (
        <text x={pad + 18} y={pad + 74} fontSize={10.5} fontStyle="italic" fontWeight="600" fill="#f0fdfa" fontFamily="sans-serif">
          {quoteText.slice(36, 75) + (quoteText.length > 75 ? '...' : '')}
        </text>
      )}
      {quoteText.length > 75 && (
        <text x={pad + 18} y={pad + 90} fontSize={10.5} fontStyle="italic" fontWeight="600" fill="#f0fdfa" fontFamily="sans-serif">
          {quoteText.slice(75, 115) + (quoteText.length > 115 ? '...' : '')}
        </text>
      )}

      {/* Divider */}
      <line x1={pad + 16} y1={H - pad - 62} x2={W - pad - 16} y2={H - pad - 62} stroke="rgba(20,184,166,0.3)" strokeWidth={1} />

      {/* Speaker Avatar & Name */}
      <circle cx={pad + 32} cy={H - pad - 32} r={16} fill="#0d9488" stroke="#5eead4" strokeWidth={1.5} />
      <text x={pad + 32} y={H - pad - 28} fontSize={12} fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        👤
      </text>

      <text x={pad + 56} y={H - pad - 38} fontSize={9.5} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {speaker.length > 28 ? speaker.slice(0, 26) + '...' : speaker}
      </text>
      <text x={pad + 56} y={H - pad - 25} fontSize={7.5} fill="#99f6e4" fontFamily="sans-serif">
        {role.length > 34 ? role.slice(0, 32) + '...' : role}
      </text>
      <text x={pad + 56} y={H - pad - 14} fontSize={6.5} fill="#64748b" fontFamily="sans-serif">
        {s.dateline || 'SAKATIGA'} · {s.date || '14 Oktober 2026'}
      </text>
    </g>
  );
}

function renderFactCheck(W, H, s) {
  const pad = 14;
  const cardW = W - pad * 2;
  const status = s.status || 'CEK FAKTA';
  const isHoax = status.includes('HOAKS') || status.includes('PALSU');
  const isTrue = status.includes('FAKTA') || status.includes('BENAR');
  const stampColor = isTrue ? '#10b981' : isHoax ? '#ef4444' : '#f59e0b';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={12} fill="#0c1322" stroke="rgba(255,255,255,0.18)" strokeWidth={1} filter="url(#softShadow)" />

      {/* Header */}
      <rect x={pad} y={pad} width={cardW} height={26} rx={12} fill="#060b14" />
      <text x={pad + 12} y={pad + 17} fontSize={8.5} fontWeight="900" fill="#94a3b8" letterSpacing={0.8} fontFamily="sans-serif">
        🔍 {s.mediaName || 'CEK FAKTA & TABAYYUN'}
      </text>

      {/* Stamp Status Banner */}
      <rect x={pad + 10} y={pad + 33} width={cardW - 20} height={24} rx={5} fill={stampColor} fillOpacity={0.18} stroke={stampColor} strokeWidth={1.5} />
      <text x={W / 2} y={pad + 49} fontSize={10} fontWeight="900" fill={stampColor} textAnchor="middle" letterSpacing={0.8} fontFamily="sans-serif">
        STATUS: {status}
      </text>

      {/* Claim Box */}
      <rect x={pad + 10} y={pad + 64} width={cardW - 20} height={46} rx={5} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth={1} />
      <text x={pad + 16} y={pad + 77} fontSize={7.5} fontWeight="900" fill="#f87171" fontFamily="sans-serif">
        ⚠️ KLAIM BEREDAR:
      </text>
      <text x={pad + 16} y={pad + 90} fontSize={7} fill="#fca5a5" fontFamily="sans-serif">
        {(s.claim || 'Informasi viral yang beredar di masyarakat...').slice(0, 50)}
      </text>
      <text x={pad + 16} y={pad + 102} fontSize={7} fill="#fca5a5" fontFamily="sans-serif">
        {(s.claim || '').slice(50, 100)}
      </text>

      {/* Fact Clarification Box */}
      <rect x={pad + 10} y={pad + 118} width={cardW - 20} height={H * 0.48} rx={5} fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth={1} />
      <text x={pad + 16} y={pad + 133} fontSize={8} fontWeight="900" fill="#34d399" fontFamily="sans-serif">
        ✅ PUTUSAN FAKTA &amp; KLARIFIKASI RESMI:
      </text>
      <text x={pad + 16} y={pad + 148} fontSize={7.5} fill="#a7f3d0" fontFamily="sans-serif">
        {(s.fact || 'Klarifikasi objektif berdasarkan data terverifikasi...').slice(0, 52)}
      </text>
      <text x={pad + 16} y={pad + 161} fontSize={7.5} fill="#a7f3d0" fontFamily="sans-serif">
        {(s.fact || '').slice(52, 106)}
      </text>
      <text x={pad + 16} y={pad + 174} fontSize={7.5} fill="#a7f3d0" fontFamily="sans-serif">
        {(s.fact || '').slice(106, 160)}
      </text>

      {/* Official Source */}
      <text x={pad + 16} y={H - pad - 10} fontSize={6.5} fill="#94a3b8" fontFamily="sans-serif">
        Rujukan: {(s.officialSource || 'Rilis Resmi Instansi Terkait').slice(0, 46)}
      </text>
    </g>
  );
}

function renderCopywriting(W, H, s) {
  const pad = 12;
  const cardW = W - pad * 2;
  const greeting = s.greeting || "Assalamu'alaikum Ayah/Bunda";
  const platform = s.platform || 'Status WhatsApp';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={12} fill="#0f172a" stroke="rgba(59,130,246,0.3)" strokeWidth={1} filter="url(#softShadow)" />

      {/* App Header */}
      <rect x={pad} y={pad} width={cardW} height={30} rx={12} fill="#1e293b" />
      <circle cx={pad + 18} cy={pad + 15} r={8} fill="#2563eb" />
      <text x={pad + 32} y={pad + 14} fontSize={8} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {platform}
      </text>
      <text x={pad + 32} y={pad + 23} fontSize={6.5} fill="#94a3b8" fontFamily="sans-serif">
        {greeting} · Baru Saja
      </text>

      {/* K-C-A Framework Pill Tags */}
      <rect x={pad + 10} y={pad + 38} width={45} height={12} rx={3} fill="#ef4444" fillOpacity={0.25} stroke="#ef4444" strokeWidth={0.8} />
      <text x={pad + 32.5} y={pad + 47} fontSize={6} fontWeight="bold" fill="#fca5a5" textAnchor="middle" fontFamily="sans-serif">
        [K] Pemantik
      </text>
      <rect x={pad + 60} y={pad + 38} width={45} height={12} rx={3} fill="#3b82f6" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={0.8} />
      <text x={pad + 82.5} y={pad + 47} fontSize={6} fontWeight="bold" fill="#93c5fd" textAnchor="middle" fontFamily="sans-serif">
        [C] Cerita Inti
      </text>
      <rect x={pad + 110} y={pad + 38} width={45} height={12} rx={3} fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={0.8} />
      <text x={pad + 132.5} y={pad + 47} fontSize={6} fontWeight="bold" fill="#6ee7b7" textAnchor="middle" fontFamily="sans-serif">
        [A] Ajakan CTA
      </text>

      {/* Post Text Body */}
      <rect x={pad + 10} y={pad + 56} width={cardW - 20} height={H * 0.6} rx={6} fill="#090d16" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <text x={pad + 16} y={pad + 72} fontSize={7.5} fontWeight="bold" fill="#fca5a5" fontFamily="sans-serif">
        "{(s.summary || 'K - Banyak Ayah/Bunda khawatir anak betah menatap HP...').slice(0, 46)}"
      </text>
      <text x={pad + 16} y={pad + 88} fontSize={7} fill="#cbd5e1" fontFamily="sans-serif">
        {(s.angle || 'C - Di TK/TPA santri tertib membaca Iqro bersama teman sebayanya...').slice(0, 48)}
      </text>
      <text x={pad + 16} y={pad + 101} fontSize={7} fill="#cbd5e1" fontFamily="sans-serif">
        {(s.angle || '').slice(48, 98)}
      </text>
      <text x={pad + 16} y={pad + 118} fontSize={7} fontWeight="bold" fill="#6ee7b7" fontFamily="sans-serif">
        A - Mari hadirkan masa kecil dekat dengan Al-Qur'an bagi ananda!
      </text>

      {/* Action Button */}
      <rect x={pad + 12} y={H - pad - 32} width={cardW - 24} height={22} rx={5} fill="#2563eb" />
      <text x={W / 2} y={H - pad - 18} fontSize={8} fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        💬 Hubungi Pengurus via WhatsApp
      </text>
    </g>
  );
}

function renderVideoScript(W, H, s) {
  const pad = 12;
  const cardW = W - pad * 2;
  const title = s.title || 'Naskah Video Reels / TikTok 30s';
  const duration = s.duration || '30s';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={12} fill="#130924" stroke="rgba(168,85,247,0.3)" strokeWidth={1} filter="url(#softShadow)" />

      {/* Clapperboard Header */}
      <rect x={pad} y={pad} width={cardW} height={24} rx={12} fill="#2e1065" />
      <text x={pad + 12} y={pad + 16} fontSize={8.5} fontWeight="900" fill="#f3e8ff" fontFamily="sans-serif">
        🎬 TELEPROMPTER &amp; STORYBOARD
      </text>
      <rect x={W - pad - 40} y={pad + 5} width={32} height={14} rx={3} fill="#a855f7" />
      <text x={W - pad - 24} y={pad + 15} fontSize={7} fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        {duration}
      </text>

      {/* Title */}
      <text x={pad + 12} y={pad + 38} fontSize={9.5} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {title.length > 30 ? title.slice(0, 28) + '...' : title}
      </text>
      <text x={pad + 12} y={pad + 49} fontSize={7} fill="#c084fc" fontFamily="sans-serif">
        VO: {(s.speaker || 'Ustadzah / Guru Ngaji').slice(0, 32)}
      </text>

      {/* Scene 1: Hook */}
      <rect x={pad + 10} y={pad + 58} width={cardW - 20} height={38} rx={5} fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.3)" strokeWidth={0.8} />
      <text x={pad + 16} y={pad + 71} fontSize={7} fontWeight="900" fill="#e9d5ff" fontFamily="sans-serif">
        ⏱️ SCENE 1 (00:00 - 00:03) · HOOK STOPPER:
      </text>
      <text x={pad + 16} y={pad + 84} fontSize={6.5} fill="#ffffff" fontFamily="sans-serif">
        {(s.coreMessage || 'Visual santri tersenyum memegang Iqro, hook emosional orang tua.').slice(0, 48)}
      </text>

      {/* Scene 2: Story B-Roll */}
      <rect x={pad + 10} y={pad + 102} width={cardW - 20} height={48} rx={5} fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.3)" strokeWidth={0.8} />
      <text x={pad + 16} y={pad + 115} fontSize={7} fontWeight="900" fill="#93c5fd" fontFamily="sans-serif">
        🎥 SCENE 2 (00:04 - 00:20) · B-ROLL &amp; STORYTELLING:
      </text>
      <text x={pad + 16} y={pad + 128} fontSize={6.5} fill="#ffffff" fontFamily="sans-serif">
        {(s.keyPoints || 'Santri berbaris wudhu rapi, menyimak tajwid dengan guru sabar.').slice(0, 48)}
      </text>
      <text x={pad + 16} y={pad + 141} fontSize={6.5} fill="#94a3b8" fontFamily="sans-serif">
        Audio VO: "Setiap huruf yang terbaca adalah lentera masa depan..."
      </text>

      {/* Scene 3: CTA */}
      <rect x={pad + 10} y={H - pad - 42} width={cardW - 20} height={32} rx={5} fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth={0.8} />
      <text x={pad + 16} y={H - pad - 30} fontSize={7} fontWeight="900" fill="#6ee7b7" fontFamily="sans-serif">
        🎯 SCENE 3 (00:21 - 00:30) · CALL TO ACTION:
      </text>
      <text x={pad + 16} y={H - pad - 18} fontSize={6.5} fill="#ffffff" fontFamily="sans-serif">
        {(s.callToAction || 'Pendaftaran santri baru masih dibuka, hubungi WhatsApp pengurus!').slice(0, 48)}
      </text>
    </g>
  );
}

function renderPresentation(W, H, s) {
  const pad = 12;
  const cardW = W - pad * 2;
  const topic = s.topic || 'Judul Slide Presentasi';
  const tag = s.tag || s.type || 'MATERI WORKSHOP';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={10} fill="#071b2d" stroke="rgba(56,189,248,0.3)" strokeWidth={1} filter="url(#softShadow)" />

      {/* Slide Top Eyebrow */}
      <rect x={pad + 14} y={pad + 12} width={70} height={12} rx={3} fill="#0284c7" />
      <text x={pad + 18} y={pad + 20.5} fontSize={6} fontWeight="900" fill="#ffffff" letterSpacing={0.5} fontFamily="sans-serif">
        {tag.slice(0, 16)}
      </text>
      <text x={W - pad - 14} y={pad + 21} fontSize={7} fill="#7dd3fc" textAnchor="end" fontFamily="sans-serif">
        Slide 1 dari {s.slideCount || 10}
      </text>

      {/* Main Slide Title */}
      <text x={pad + 14} y={pad + 38} fontSize={10} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {topic.length > 36 ? topic.slice(0, 34) + '...' : topic}
      </text>
      {topic.length > 34 && (
        <text x={pad + 14} y={pad + 50} fontSize={10} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
          {topic.slice(34, 70) + (topic.length > 70 ? '...' : '')}
        </text>
      )}

      {/* Left Column: Bullet Points */}
      <rect x={pad + 14} y={pad + 62} width={cardW * 0.52} height={16} rx={3} fill="rgba(255,255,255,0.08)" />
      <text x={pad + 19} y={pad + 73} fontSize={6.5} fill="#e2e8f0" fontFamily="sans-serif">
        ✓ 1. Fondasi Manusia: Self-Leadership &amp; Niat Jariyah
      </text>
      <rect x={pad + 14} y={pad + 83} width={cardW * 0.52} height={16} rx={3} fill="rgba(255,255,255,0.08)" />
      <text x={pad + 19} y={pad + 94} fontSize={6.5} fill="#e2e8f0" fontFamily="sans-serif">
        ✓ 2. Fondasi Sistem: Tata Kelola &amp; Visi Ogan Ilir SMART
      </text>
      <rect x={pad + 14} y={pad + 104} width={cardW * 0.52} height={16} rx={3} fill="rgba(255,255,255,0.08)" />
      <text x={pad + 19} y={pad + 115} fontSize={6.5} fill="#e2e8f0" fontFamily="sans-serif">
        ✓ 3. Sumber Daya: Blue Ocean Crowdfunding &amp; Storytelling
      </text>

      {/* Right Column: Visual Diagram */}
      <rect x={W - pad - cardW * 0.38} y={pad + 62} width={cardW * 0.36} height={H * 0.5} rx={6} fill="#0b2c4d" stroke="#38bdf8" strokeWidth={1} />
      <circle cx={W - pad - cardW * 0.2} cy={pad + 88} r={16} fill="#0284c7" fillOpacity={0.4} stroke="#38bdf8" strokeWidth={1} />
      <text x={W - pad - cardW * 0.2} y={pad + 91} fontSize={7.5} fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        MANUSIA
      </text>
      <text x={W - pad - cardW * 0.2} y={pad + 113} fontSize={6} fill="#7dd3fc" textAnchor="middle" fontFamily="sans-serif">
        ↓ SISTEM ↓
      </text>
      <text x={W - pad - cardW * 0.2} y={pad + 125} fontSize={6.5} fontWeight="bold" fill="#facc15" textAnchor="middle" fontFamily="sans-serif">
        SUMBER DAYA
      </text>

      {/* Footer Bar */}
      <text x={pad + 14} y={H - pad - 8} fontSize={6} fill="#64748b" fontFamily="sans-serif">
        Disusun untuk: {(s.audience || 'Kepala & Guru TK/TPA BKPRMI Ogan Ilir').slice(0, 38)}
      </text>
    </g>
  );
}

function renderArticle(W, H, s) {
  const pad = 12;
  const cardW = W - pad * 2;
  const headline = s.headline || 'Judul Naskah Artikel & Siaran Berita';

  return (
    <g>
      <rect x={pad} y={pad} width={cardW} height={H - pad * 2} rx={10} fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth={1} filter="url(#softShadow)" />

      {/* Masthead */}
      <text x={W / 2} y={pad + 18} fontSize={9.5} fontWeight="900" fill="#ffffff" letterSpacing={1.2} textAnchor="middle" fontFamily="serif">
        {s.mediaName || 'WARTA BERITA DAKWAH'}
      </text>
      <line x1={pad + 14} y1={pad + 24} x2={W - pad - 14} y2={pad + 24} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

      {/* Headline */}
      <text x={pad + 14} y={pad + 40} fontSize={10} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
        {headline.length > 38 ? headline.slice(0, 36) + '...' : headline}
      </text>
      {headline.length > 36 && (
        <text x={pad + 14} y={pad + 52} fontSize={10} fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
          {headline.slice(36, 72) + (headline.length > 72 ? '...' : '')}
        </text>
      )}

      {/* Byline */}
      <text x={pad + 14} y={pad + 65} fontSize={6.5} fill="#94a3b8" fontFamily="sans-serif">
        {s.dateline || 'SAKATIGA, 14 OKTOBER 2026'} · Rubrik: {s.rubric || 'Pendidikan'}
      </text>

      {/* Multi-column text mockups */}
      <rect x={pad + 14} y={pad + 74} width={cardW * 0.46} height={5} rx={1.5} fill="rgba(255,255,255,0.4)" />
      <rect x={pad + 14} y={pad + 83} width={cardW * 0.46} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
      <rect x={pad + 14} y={pad + 92} width={cardW * 0.4} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
      <rect x={pad + 14} y={pad + 101} width={cardW * 0.46} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
      <rect x={pad + 14} y={pad + 110} width={cardW * 0.35} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />

      <rect x={W - pad - cardW * 0.46} y={pad + 74} width={cardW * 0.44} height={5} rx={1.5} fill="rgba(255,255,255,0.4)" />
      <rect x={W - pad - cardW * 0.46} y={pad + 83} width={cardW * 0.44} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
      <rect x={W - pad - cardW * 0.46} y={pad + 92} width={cardW * 0.44} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
      <rect x={W - pad - cardW * 0.46} y={pad + 101} width={cardW * 0.38} height={5} rx={1.5} fill="rgba(255,255,255,0.25)" />
    </g>
  );
}

function renderFlyerBanner(w, h, state) {
  const title = state.title || 'JUDUL SPANDUK / FLYER ACARA';
  const sub = state.subTitle || '';
  const institution = state.institution || 'LEMBAGA PENDIDIKAN AL-QUR\'AN';
  const badge = state.badgeText || '';
  const date = state.eventDate || '';
  const loc = state.eventLocation || '';
  const speaker = state.speaker || '';
  const cta = state.callToAction || state.contactPerson || '';

  const isWide = w / h >= 2.5; // Spanduk horizontal 3:1, 4:1, 5:1
  const isTall = h / w >= 1.8; // X-Banner vertical 1:2.67

  if (state.imagePreview) {
    return (
      <g>
        <image
          href={state.imagePreview}
          x="0"
          y="0"
          width={w}
          height={h}
          preserveAspectRatio={isWide ? 'xMidYMid slice' : 'xMidYMid meet'}
        />
        {/* Ring Mata Ayam di 4 Sudut */}
        <circle cx="16" cy="16" r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.85" />
        <circle cx={w - 16} cy="16" r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.85" />
        <circle cx="16" cy={h - 16} r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.85" />
        <circle cx={w - 16} cy={h - 16} r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.85" />
      </g>
    );
  }

  return (
    <g>
      {/* Background with soft arabesque arches */}
      <rect width={w} height={h} fill="none" />
      <circle cx={w * 0.15} cy={h * 0.5} r={Math.min(w, h) * 0.8} fill="#ffffff" fillOpacity="0.04" />
      <circle cx={w * 0.85} cy={h * 0.5} r={Math.min(w, h) * 0.8} fill="#ffffff" fillOpacity="0.04" />

      {/* Spanduk Ring Mata Ayam di 4 Sudut */}
      <circle cx="16" cy="16" r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />
      <circle cx={w - 16} cy="16" r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />
      <circle cx="16" cy={h - 16} r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />
      <circle cx={w - 16} cy={h - 16} r="5" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />

      {/* Decorative Border Frame */}
      <rect x="10" y="10" width={w - 20} height={h - 20} rx="4" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

      {isWide ? (
        // WIDE HORIZONTAL (SPANDUK 3:1, 4:1)
        <g>
          {/* Header pill */}
          <rect x="28" y="14" width={Math.min(260, w * 0.45)} height="18" rx="4" fill="#000000" fillOpacity="0.35" stroke="#ffffff" strokeOpacity="0.2" />
          <text x="36" y="26" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ✦ {institution.slice(0, 36)}
          </text>
          {badge && (
            <g transform={`translate(${w - 145}, 14)`}>
              <rect width="120" height="18" rx="4" fill="#dc2626" />
              <text x="60" y="12" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                {badge.slice(0, 24)}
              </text>
            </g>
          )}

          {/* Massive Title */}
          <text x={w * 0.08} y={h * 0.48} fill="#ffffff" fontSize={Math.min(20, h * 0.28)} fontWeight="900" fontFamily="sans-serif">
            {title.slice(0, 42)}
          </text>
          {title.length > 42 && (
            <text x={w * 0.08} y={h * 0.68} fill="#ffffff" fontSize={Math.min(16, h * 0.22)} fontWeight="900" fontFamily="sans-serif">
              {title.slice(42, 85)}
            </text>
          )}

          {/* Subtitle */}
          {sub && (
            <text x={w * 0.08} y={h * 0.84} fill="#fde68a" fontSize={Math.min(9.5, h * 0.14)} fontWeight="600" fontFamily="sans-serif">
              {sub.slice(0, 75)}
            </text>
          )}

          {/* Right info column */}
          <g transform={`translate(${w * 0.64}, ${h * 0.36})`}>
            <rect width={w * 0.3} height={h * 0.54} rx="6" fill="#000000" fillOpacity="0.45" stroke="#ffffff" strokeOpacity="0.2" />
            <text x="10" y="18" fill="#38bdf8" fontSize="8" fontWeight="bold">🗓 {date.slice(0, 28)}</text>
            <text x="10" y="32" fill="#ffffff" fontSize="7">📍 {loc.slice(0, 32)}</text>
            {speaker && <text x="10" y="46" fill="#fde047" fontSize="7">👤 {speaker.slice(0, 32)}</text>}
          </g>
        </g>
      ) : isTall ? (
        // TALL VERTICAL (X-BANNER 1:2.67, 1:2.5)
        <g>
          {/* Logo / Header */}
          <rect x={w * 0.08} y="20" width={w * 0.84} height="28" rx="6" fill="#000000" fillOpacity="0.35" />
          <text x={w * 0.5} y="38" fill="#fbbf24" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            {institution.slice(0, 26)}
          </text>

          {/* Badge */}
          {badge && (
            <g transform={`translate(${w * 0.15}, 58)`}>
              <rect width={w * 0.7} height="20" rx="4" fill="#dc2626" />
              <text x={w * 0.35} y="13" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                {badge.slice(0, 24)}
              </text>
            </g>
          )}

          {/* Main Title */}
          <text x={w * 0.5} y={h * 0.26} fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle">
            {title.slice(0, 22)}
          </text>
          {title.length > 22 && (
            <text x={w * 0.5} y={h * 0.31} fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">
              {title.slice(22, 45)}
            </text>
          )}

          {/* Graphic Inset Box / Silhouette */}
          <rect x={w * 0.12} y={h * 0.36} width={w * 0.76} height={h * 0.22} rx="8" fill="#ffffff" fillOpacity="0.1" stroke="#ffffff" strokeOpacity="0.25" />
          <text x={w * 0.5} y={h * 0.48} fill="#fde68a" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {sub ? sub.slice(0, 30) : '✦ PUSAT KEGIATAN DAKWAH ✦'}
          </text>

          {/* Details Card */}
          <rect x={w * 0.08} y={h * 0.63} width={w * 0.84} height={h * 0.22} rx="8" fill="#000000" fillOpacity="0.45" />
          <text x={w * 0.14} y={h * 0.69} fill="#38bdf8" fontSize="8.5" fontWeight="bold">🗓 {date.slice(0, 24)}</text>
          <text x={w * 0.14} y={h * 0.75} fill="#ffffff" fontSize="8">📍 {loc.slice(0, 26)}</text>
          {speaker && <text x={w * 0.14} y={h * 0.81} fill="#fde047" fontSize="8">👤 {speaker.slice(0, 26)}</text>}

          {/* CTA Button */}
          <rect x={w * 0.12} y={h * 0.88} width={w * 0.76} height="28" rx="6" fill="#fbbf24" />
          <text x={w * 0.5} y={h * 0.92} fill="#0f172a" fontSize="9" fontWeight="900" textAnchor="middle">
            {(cta || 'KONTAK PANITIA').slice(0, 26)}
          </text>
        </g>
      ) : (
        // BALANCED / PORTRAIT / 16:9 / A4 FLYER
        <g>
          {/* Header */}
          <rect x="20" y="18" width={w - 40} height="24" rx="6" fill="#000000" fillOpacity="0.35" />
          <text x={w * 0.5} y="34" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
            ✦ {institution.slice(0, 42)} ✦
          </text>

          {/* Title */}
          <text x={w * 0.5} y={h * 0.3} fill="#ffffff" fontSize={Math.min(17, w * 0.055)} fontWeight="900" textAnchor="middle">
            {title.slice(0, 35)}
          </text>
          {title.length > 35 && (
            <text x={w * 0.5} y={h * 0.38} fill="#ffffff" fontSize={Math.min(14, w * 0.045)} fontWeight="900" textAnchor="middle">
              {title.slice(35, 75)}
            </text>
          )}

          {/* Subtitle */}
          {sub && (
            <text x={w * 0.5} y={h * 0.46} fill="#fde68a" fontSize="9" fontWeight="600" textAnchor="middle">
              {sub.slice(0, 52)}
            </text>
          )}

          {/* Inset Schedule / Venue Grid */}
          <rect x={w * 0.08} y={h * 0.54} width={w * 0.84} height={h * 0.28} rx="8" fill="#000000" fillOpacity="0.45" stroke="#ffffff" strokeOpacity="0.2" />
          <text x={w * 0.14} y={h * 0.62} fill="#38bdf8" fontSize="8" fontWeight="bold">🗓 Hari/Tanggal: {date.slice(0, 32)}</text>
          <text x={w * 0.14} y={h * 0.70} fill="#ffffff" fontSize="8">📍 Lokasi: {loc.slice(0, 36)}</text>
          {speaker && <text x={w * 0.14} y={h * 0.78} fill="#fde047" fontSize="8">👤 Narasumber: {speaker.slice(0, 36)}</text>}

          {/* Bottom Bar */}
          <rect x="20" y={h - 38} width={w - 40} height="24" rx="6" fill="#fbbf24" />
          <text x={w * 0.5} y={h - 23} fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
            {(cta || 'DAFTAR / INFORMASI LENGKAP').slice(0, 40)}
          </text>
        </g>
      )}
    </g>
  );
}


