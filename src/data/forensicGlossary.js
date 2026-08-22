export const FORENSIC_GLOSSARY = [
  {
    id: 'exif',
    term: 'EXIF & Metadata Biner',
    shortLabel: 'KTP Digital Foto',
    badge: 'Lapis 1',
    category: 'Identitas Perangkat',
    icon: 'FileText',
    simpleAnalogy: 'Seperti KTP atau akta lahir yang mencatat asal-usul foto secara otomatis saat dijepret.',
    plainDescription:
      'Setiap kamera HP atau kamera profesional selalu menempelkan catatan rahasia di dalam file foto. Catatan ini berisi merek HP (misal: iPhone, Samsung, Sony), tanggal jepret, dan lensa. Jika foto dibuat oleh AI, pembuat gambar sering meninggalkan tanda berupa nama software (seperti Midjourney, DALL-E, atau Stable Diffusion).',
    howToRead:
      'Jika di Lapis 1 muncul nama software AI berwarna MERAH, foto tersebut 100% buatan komputer. Jika muncul merek HP/Kamera asli berwarna HIJAU, foto diambil dari perangkat optik nyata.',
  },
  {
    id: 'c2pa',
    term: 'C2PA & Content Credentials',
    shortLabel: 'Segel Stempel Digital Resmi',
    badge: 'Lapis 2',
    category: 'Kriptografi & Sertifikat',
    icon: 'Lock',
    simpleAnalogy: 'Seperti segel pita cukai atau stempel hologram bertanda tangan resmi dari pembuat foto.',
    plainDescription:
      'C2PA adalah standar sertifikat digital internasional yang didukung oleh Adobe, OpenAI, Google, Microsoft, dan kantor berita dunia. Saat Anda membuat gambar di ChatGPT DALL-E 3 atau Adobe Firefly, sistem secara otomatis memasang tanda tangan digital kriptografi yang tidak bisa dipalsukan.',
    howToRead:
      'Jika muncul status "C2PA SIGNED", berarti sistem menemukan sertifikat resmi yang menyatakan foto ini dibuat oleh kecerdasan buatan (Text-to-Image). Ini bukti terkuat di mata hukum.',
  },
  {
    id: 'ela',
    term: 'Error Level Analysis (ELA)',
    shortLabel: 'Detektor Bekas Tempelan & Kompresi',
    badge: 'Lapis 3',
    category: 'Analisis Piksel',
    icon: 'Activity',
    simpleAnalogy: 'Seperti mengecat ulang dinding: bagian tembok yang baru ditambal akan memantulkan cahaya berbeda dibanding tembok lama.',
    plainDescription:
      'Foto yang disimpan dalam format JPEG memiliki tingkat kerapatan kompresi tertentu. Jika seseorang menempelkan wajah orang lain (deepfake) atau mengedit bagian tertentu, area yang diedit tersebut akan memiliki tingkat kompresi yang tidak seragam dengan latar belakang aslinya.',
    howToRead:
      'Pada tampilan ELA, foto asli akan berpendar rata dan seragam. Namun jika ada bagian wajah atau objek yang menyala sangat terang atau sangat gelap sendirian, area tersebut kemungkinan besar adalah hasil editan/tempelan.',
  },
  {
    id: 'fft',
    term: '2D Fast Fourier Transform (FFT)',
    shortLabel: 'Rontgen Sidik Jari Kisi AI',
    badge: 'Lapis 3',
    category: 'Spektrogram Frekuensi',
    icon: 'Scan',
    simpleAnalogy: 'Seperti foto Rontgen sinar-X yang bisa melihat susunan tulang di balik daging.',
    plainDescription:
      'Mata manusia melihat foto sebagai warna dan bentuk. Namun mesin generator AI (difusi & GAN) menyusun gambar menggunakan lapisan jaringan saraf matematika bertingkat. Proses ini selalu meninggalkan "pola kisi catur tak kasat mata" (checkerboard pattern) di frekuensi tinggi yang tidak bisa dihapus.',
    howToRead:
      'Foto kamera alami menghasilkan sebaran cahaya melingkar halus di pusat spektrogram. Jika muncul titik-titik pendaran simetris atau pola kisi kotak-kotak di luar titik pusat, itu adalah sidik jari matematis algoritma AI.',
  },
  {
    id: 'laplacian',
    term: 'Laplacian Noise Residual',
    shortLabel: 'Pemeriksa Pori-Pori & Sensor Debu',
    badge: 'Lapis 3',
    category: 'Tekstur & Noise',
    icon: 'Layers',
    simpleAnalogy: 'Seperti melihat kulit manusia di bawah kaca pembesar: kulit asli punya pori-pori dan kerutan alami, sedangkan patung lilin tampak terlalu mulus tanpa pori.',
    plainDescription:
      'Kamera fisik nyata memiliki sensor optik yang selalu menangkap butiran pasir halus (noise optik). Sebaliknya, gambar buatan AI difusi sering kali memiliki transisi warna yang terlalu halus secara sintetis atau noise yang tidak seragam di tepian objek.',
    howToRead:
      'Tampilan Laplacian memperlihatkan butiran noise mikroskopis. Foto asli akan memperlihatkan debu sensor merata di seluruh gambar, sedangkan foto AI tampak tidak wajar di area kulit atau tepian rambut.',
  },
  {
    id: 'synthid',
    term: 'SynthID & AI Watermark',
    shortLabel: 'Tanda Air Digital Tak Kasat Mata',
    badge: 'Watermark',
    category: 'Deteksi Watermark',
    icon: 'Sparkles',
    simpleAnalogy: 'Seperti cap air rahasia pada uang kertas rupiah yang hanya terlihat saat diterawang sinar ultraviolet.',
    plainDescription:
      'SynthID adalah teknologi watermark digital modern (dikembangkan oleh Google DeepMind) yang disisipkan langsung ke dalam struktur piksel gambar AI saat dibuat. Watermark ini tidak terlihat oleh mata manusia dan tetap bertahan meski gambar di-screenshot atau dikompresi.',
    howToRead:
      'Skor persentase SynthID menunjukkan seberapa kuat energi sinyal watermark AI terdeteksi di dalam foto.',
  },
  {
    id: 'stripped',
    term: 'EXIF Terhapus / Stripped (Kompresi Medsos)',
    shortLabel: 'Kondisi File Tanpa Identitas',
    badge: 'Peringatan',
    category: 'Manipulasi File',
    icon: 'AlertTriangle',
    simpleAnalogy: 'Seperti surat kaleng tanpa cap pos pengirim karena amplop luarnya sudah dibuang.',
    plainDescription:
      'Saat seseorang mengirimkan foto lewat WhatsApp, Facebook, atau Twitter tanpa mencentang "kirim sebagai dokumen", aplikasi tersebut secara otomatis membuang data EXIF untuk menghemat kuota. Pelaku hoaks sering memanfaatkan trik ini untuk menyembunyikan asal-usul foto AI.',
    howToRead:
      'Jika status menunjukkan "STRIPPED", jangan langsung percaya atau menolak foto tersebut. Beralihlah ke tab ELA dan 2D FFT di layar tengah untuk memeriksa susunan pikselnya secara ilmiah.',
  },
  {
    id: 'verdict',
    term: 'Putusan Standar Redaksi (SOP)',
    shortLabel: 'Kesimpulan Akhir Verifikasi',
    badge: 'Keputusan',
    category: 'Rekomendasi Tindakan',
    icon: 'CheckCircle2',
    simpleAnalogy: 'Vonis hakim di meja redaksi apakah sebuah foto aman disebarkan ke publik atau palsu.',
    plainDescription:
      'Sistem menggabungkan seluruh pembuktian dari 3 lapis pengujian menjadi 3 kategori keputusan resmi:',
    howToRead:
      '• 🟢 LAYAK TERBIT (VERIFIED): Foto terbukti alami dari kamera asli.\n• 🟡 INVESTIGASI LANJUTAN: Foto dicurigai karena data EXIF hilang, butuh penelusuran sumber asli.\n• 🔴 TOLAK / KONTEN AI: Terbukti kuat buatan komputer / manipulasi.',
  },
];
