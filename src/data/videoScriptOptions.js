/**
 * Options and presets for Video Script, Interview & Storyboard Studio
 */

export const SCRIPT_TYPES = [
  { value: 'short_video', label: '📱 Video Pendek (TikTok / Reels / Shorts)', desc: 'Formula 3 detik hook, alur retensi cepat, dan direct CTA' },
  { value: 'youtube_long', label: '🎬 Video Panjang YouTube / Dokumenter', desc: 'Struktur 3 babak, pembahasan mendalam, studi kasus & transisi' },
  { value: 'interview_podcast', label: '🎙️ Script Wawancara & Podcast', desc: 'Monolog opening, 3 lapis pertanyaan, probing, dan closing' },
  { value: 'storyboard_visual', label: '🎨 Storyboard Visual Scene-by-Scene', desc: 'Shot list, pergerakan kamera, dialog, SFX, dan prompt gambar AI' },
  { value: 'news_reportage', label: '📰 Liputan Berita & Reportase VO', desc: 'Format Voice Over (VO), B-Roll, Soundbite narasumber standar penyiaran' },
  { value: 'commercial_ad', label: '🛍️ Video Iklan Komersial (Sales/UGC)', desc: 'Problem-Agitation-Solution, hook produk, social proof, dan CTA promo' },
];

export const VIDEO_DURATIONS = [
  { value: '15s', label: '15 Detik (Ultra Fast Hook)' },
  { value: '30s', label: '30 Detik (Standard Social Video)' },
  { value: '60s', label: '60 Detik (Full Short-Form / Reel)' },
  { value: '3-5min', label: '3 - 5 Menit (Explainer Video / Berita)' },
  { value: '8-12min', label: '8 - 12 Menit (YouTube Video Lengkap)' },
  { value: '30-45min', label: '30 - 45 Menit (Podcast / Talkshow)' },
];

export const VIDEO_PLATFORMS = [
  { value: 'TikTok & IG Reels', label: 'TikTok & Instagram Reels' },
  { value: 'YouTube Shorts', label: 'YouTube Shorts' },
  { value: 'YouTube Long-Form (16:9)', label: 'YouTube Long-Form (16:9)' },
  { value: 'Podcast Video (Spotify / YouTube)', label: 'Podcast Video (Spotify / YouTube)' },
  { value: 'TV / Media Broadcasting', label: 'TV / Media Broadcasting' },
  { value: 'Website & Landing Page Video', label: 'Website & Landing Page Video' },
];

export const SCRIPT_TONES = [
  { value: 'Enerjik, Cepat & Menghibur (Gen Z / Medsos)', label: 'Enerjik, Cepat & Menghibur' },
  { value: 'Edukatif, Bernas & Mudah Dipahami', label: 'Edukatif, Bernas & Populer' },
  { value: 'Sinematik, Emosional & Menggugah', label: 'Sinematik, Emosional & Menggugah' },
  { value: 'Investigatif, Kritis & Serius (Gaya Jurnalis)', label: 'Investigatif, Kritis & Serius' },
  { value: 'Santai, Intim & Mengobrol (Podcast)', label: 'Santai, Intim & Mengobrol' },
  { value: 'Persuasif & Menjual (Direct Response Ads)', label: 'Persuasif & Menjual (Ads)' },
];

export const VISUAL_STYLES = [
  { value: 'Cinematic 4K Film Look (24fps, Color Graded)', label: 'Cinematic 4K Film Look (24fps)' },
  { value: 'UGC Raw Smartphone Style (Authentic & Relatable)', label: 'UGC Raw Smartphone Style' },
  { value: 'Studio Podcast Multi-Camera Setup', label: 'Studio Podcast Multi-Camera Setup' },
  { value: 'Documentary Realism (On-Location B-Roll)', label: 'Documentary Realism (On-Location)' },
  { value: 'Motion Graphics & Dynamic Kinetic Typography', label: 'Motion Graphics & Kinetic Text' },
];

export const INITIAL_VIDEOSCRIPT_STATE = {
  title: '',
  scriptType: 'short_video',
  duration: '60s',
  platform: 'TikTok & IG Reels',
  tone: 'Enerjik, Cepat & Menghibur (Gen Z / Medsos)',
  visualStyle: 'Cinematic 4K Film Look (24fps, Color Graded)',
  speaker: '',
  coreMessage: '',
  keyPoints: '',
  callToAction: '',
  additionalNotes: '',
};

export const VIDEOSCRIPT_DEMO_PRESETS = [
  {
    id: 'demo-short-ai',
    label: 'Video Pendek: 3 Tren AI Mengubah Cara Kerja 2026',
    badge: 'SHORTS / REELS',
    icon: 'Clapperboard',
    preset: {
      title: '3 Tren AI yang Diam-diam Mengubah Cara Kerja di 2026',
      scriptType: 'short_video',
      duration: '60s',
      platform: 'TikTok & IG Reels',
      tone: 'Enerjik, Cepat & Menghibur (Gen Z / Medsos)',
      visualStyle: 'Cinematic 4K Film Look (24fps, Color Graded)',
      speaker: 'Tech Creator muda, gaya bicara santai tapi berbobot',
      coreMessage: 'Pekerja yang menguasai AI bukan menggantikan manusia, tapi pekerja tanpa AI yang akan tertinggal.',
      keyPoints: '1. AI Agent otomatisasi tugas repetitif kantor. 2. Tools visual real-time tanpa render lama. 3. Cara praktis mulai adaptasi hari ini.',
      callToAction: 'Komen "MAU" untuk daftar panduan AI gratis, dan follow untuk tips masa depan kerja.',
      additionalNotes: 'Gunakan hook awal 3 detik yang menghentikan scroll, teks layar dinamis, dan B-roll setup workspace modern.',
    },
  },
  {
    id: 'demo-podcast-investor',
    label: 'Wawancara Podcast: Rahasia Bangun Bisnis dari Nol',
    badge: 'PODCAST / TALKSHOW',
    icon: 'Mic',
    preset: {
      title: 'Perjalanan 10 Tahun Membangun Brand Lokal hingga Tembus Pasar Global',
      scriptType: 'interview_podcast',
      duration: '30-45min',
      platform: 'Podcast Video (Spotify / YouTube)',
      tone: 'Santai, Intim & Mengobrol (Podcast)',
      visualStyle: 'Studio Podcast Multi-Camera Setup',
      speaker: 'Host: Jurnalis Bisnis. Narasumber: Hendra Wijaya (Founder Brand Sepatu Lokal)',
      coreMessage: 'Fokus pada ketahanan mental saat hampir bangkrut dan inovasi rantai pasok lokal.',
      keyPoints: 'Masa kritis tahun ketiga, strategi pivot ke digital, cara menjaga kualitas produk, dan nasihat bagi pebisnis pemula.',
      callToAction: 'Tuliskan insight paling berharga di kolom komentar, dan subscribe untuk episode tokoh inspiratif berikutnya.',
      additionalNotes: 'Sertakan 3 lapis pertanyaan: pembuka santai, pertanyaan kritis saat krisis keuangan, dan refleksi masa depan industri kreatif.',
    },
  },
  {
    id: 'demo-storyboard-iklan',
    label: 'Storyboard Iklan: Kopi Premium Asli Nusantara',
    badge: 'STORYBOARD SCENE',
    icon: 'Film',
    preset: {
      title: 'Kisah di Balik Setiap Tetes Kopi Petani Gayo',
      scriptType: 'storyboard_visual',
      duration: '30s',
      platform: 'Instagram Feed & Ads',
      tone: 'Sinematik, Emosional & Menggugah',
      visualStyle: 'Cinematic 4K Film Look (24fps, Color Graded)',
      speaker: 'Voice Over pria bersuara berat hangat (Deep warm voice)',
      coreMessage: 'Kopi bukan sekadar minuman pagi, melainkan dedikasi ribuan jam petani dataran tinggi Aceh.',
      keyPoints: 'Scene 1: Kabut pagi di kebun kopi. Scene 2: Tangan petani memetik ceri merah. Scene 3: Proses roasting artisan. Scene 4: Secangkir kopi hangat dinikmati di kafe modern.',
      callToAction: 'Rasakan keaslian cita rasa Nusantara. Pesan sekarang melalui link di bio.',
      additionalNotes: 'Setiap scene wajib dilengkapi deskripsi visual, shot type kamera, dialog VO, SFX alami, dan prompt gambar AI untuk storyboard visual.',
    },
  },
];
