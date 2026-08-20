/**
 * Options for Article & Journalism Mode
 */

export const ARTICLE_FORMATS = [
  { value: 'straight_news', label: 'Straight News (Berita Lempang / 5W+1H)', desc: 'Piramida terbalik, ringkas, cepat, dan faktual' },
  { value: 'feature', label: 'Feature Article (Kisah Human Interest)', desc: 'Gaya naratif bercerita, menggugah emosi, deskriptif' },
  { value: 'opinion', label: 'Opini / Kolom / Tajuk Rencana', desc: 'Analisis kritis, argumentasi logis, sudut pandang pakar' },
  { value: 'investigation', label: 'Investigasi / In-Depth Reporting', desc: 'Laporan mendalam, kronologi detail, silang fakta data' },
  { value: 'press_release', label: 'Siaran Pers (Press Release Humas/PR)', desc: 'Format resmi korporat/instansi siap rilis ke media' },
  { value: 'social_thread', label: 'Thread & Caption Berita Medsos (IG/X/Threads)', desc: 'Hook tajam, bullet points ringkas, caption siap posting' },
  { value: 'interview', label: 'Wawancara Khusus (Q&A Format)', desc: 'Transkrip tanya-jawab interaktif dan poin insight' },
  { value: 'news_explainer', label: 'News Explainer (Kilas Analisis Isu)', desc: 'Menjelaskan isu rumit menjadi poin-poin sederhana' },
];

export const ARTICLE_RUBRICS = [
  { value: 'Nasional & Politik', label: 'Nasional & Politik' },
  { value: 'Ekonomi, Bisnis & Finansial', label: 'Ekonomi, Bisnis & Finansial' },
  { value: 'Hukum & Kriminalitas', label: 'Hukum & Kriminalitas' },
  { value: 'Teknologi, AI & Sains', label: 'Teknologi, AI & Sains' },
  { value: 'Pendidikan & Humaniora', label: 'Pendidikan & Humaniora' },
  { value: 'Kesehatan & Lingkungan Hidup', label: 'Kesehatan & Lingkungan Hidup' },
  { value: 'Internasional & Global News', label: 'Internasional & Global News' },
  { value: 'Olahraga & Sports', label: 'Olahraga & Sports' },
  { value: 'Gaya Hidup, Budaya & Hiburan', label: 'Gaya Hidup, Budaya & Hiburan' },
  { value: 'Otomotif & Transportasi', label: 'Otomotif & Transportasi' },
];

export const TARGET_MEDIA = [
  { value: 'online_seo', label: '🌐 Portal Berita Online (SEO Optimized)', desc: 'Lengkap dengan H2/H3, meta deskripsi, dan tagar' },
  { value: 'print_press', label: '📰 Media Cetak (Koran / Majalah / Tabloid)', desc: 'Bahasa baku PUEBI/KBBI, piramida terbalik efisien ruang' },
  { value: 'social_media', label: '📱 Media Sosial (Instagram, X/Twitter, Threads)', desc: 'Hook scroll-stopping, ringkasan bullet points, caption' },
  { value: 'newsletter', label: '📧 Newsletter & Editorial Brief', desc: 'Gaya kurasi eksklusif, personal, dan to the point' },
];

export const ARTICLE_TONES = [
  { value: 'Netral & Objektif (Standar Jurnalistik Dewan Pers)', label: 'Netral & Objektif (Standar Jurnalistik)' },
  { value: 'Kritis, Tajam & Analitis', label: 'Kritis, Tajam & Analitis' },
  { value: 'Humanis, Empatis & Menggugah Emosi', label: 'Humanis, Empatis & Menggugah' },
  { value: 'Formal & Berwibawa (Gaya Humas / Press Release)', label: 'Formal & Berwibawa (Gaya Humas)' },
  { value: 'Edukatif, Segar & Mudah Dipahami (Populer)', label: 'Edukatif, Segar & Populer' },
];

export const ARTICLE_LENGTHS = [
  { value: 'short', label: 'Ringkas (300 – 500 kata)', desc: 'Cocok untuk breaking news kilat dan update cepat' },
  { value: 'medium', label: 'Standar Editorial (600 – 900 kata)', desc: 'Format ideal untuk portal berita online dan koran harian' },
  { value: 'long', label: 'Panjang / Mendalam (1.000 – 1.500 kata)', desc: 'Cocok untuk liputan investigasi, opini pakar, dan feature' },
];

export const INITIAL_ARTICLE_STATE = {
  headline: '',
  rubric: 'Nasional & Politik',
  mediaName: 'Media Indonesia',
  dateline: 'JAKARTA',
  format: 'straight_news',
  targetMedia: 'online_seo',
  tone: 'Netral & Objektif (Standar Jurnalistik Dewan Pers)',
  length: 'medium',
  facts: '',
  quotes: '',
  sourceDetails: '',
  keywords: '',
  additionalNotes: '',
};
