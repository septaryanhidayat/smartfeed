# Integrasi Modul Lab Forensik Konten AI ke SmartFeed

Pengguna meminta untuk menambahkan fitur dari folder `forensic` (Lab Forensik Konten AI & Jurnalisme Investigasi Visual) ke dalam modul aplikasi SmartFeed.

## Ringkasan Fitur yang Diintegrasikan

Fitur dalam `forensic/index.html` dan `forensic/panduan_instruktur_forensik.md` mencakup:
1. **Multi-layer Forensic Verification Pipeline**:
   - **Lapis 1: Binary Header & EXIF Scanner**: Membaca langsung byte biner file foto (ArrayBuffer) untuk mendeteksi software AI (Midjourney, DALL-E, Stable Diffusion, ComfyUI, Flux, Imagen, dll.), hardware kamera fisik (Sony, Canon, iPhone, Nikon, dll.), parameter prompt, dan tanda-tanda EXIF dilucuti (WhatsApp / kompresi medsos).
   - **Lapis 2: C2PA Cryptographic Manifest**: Memindai biner box JUMBF (`jumb`, `c2pa`, `c2ma`) untuk validasi sertifikat tanda tangan digital penerbit (OpenAI, Adobe, dll.).
   - **Lapis 3: Real In-Browser Pixel Forensics**:
     - **Real Error Level Analysis (ELA)**: Kompresi ulang JPEG 80% dan komputasi matematis selisih kompresi piksel untuk mendeteksi area editan/sintetis.
     - **Real 2D Fast Fourier Transform (FFT Spectrogram)**: Komputasi 2D FFT Radix-2 pada grayscale luminance dengan FFT shift & heatmap frekuensi untuk mendeteksi artefak kisi periodik (*deconvolution checkerboard artifacts*).
     - **Laplacian Noise Residual Filter**: Filter spasial konvolusi 3x3 untuk mengisolasi noise sensor optik kamera vs noise difusi laten.
     - **Indikator SynthID & Skor Probabilitas AI Terintegrasi**.
2. **Interactive Multi-mode Canvas Viewport**:
   - Mode Gambar Asli, ELA, 2D FFT Spektrogram, dan Laplacian Noise.
3. **Stress Testing & Preset Simulasi Kelas**:
   - Preset sampel siap uji (Foto Kamera Fisik Sony A7R IV, Midjourney Raw, DALL-E 3 C2PA Signed, Gemini + WA Recompressed).
   - Alat uji siksa in-browser (Simulasi Kompresi WhatsApp, Simulasi Crop 50%).
4. **Berita Acara SOP Redaksi Resmi**:
   - Generator Berita Acara Uji Forensik Multimedia Redaksi dengan ID berkas unik, tanggal, matriks pengujian 3 lapis, putusan redaksi (*Layak Terbit / Investigasi Lanjutan / Tolak Konten AI*), tombol Salin Teks dan Cetak / Simpan PDF.

---

## Proposed Changes

### 1. Modul Baru: `ForensicMode.jsx`
#### [NEW] [ForensicMode.jsx](file:///d:/SIM/SMARTFEED/SmartFeed/src/modes/ForensicMode.jsx)
- Komponen React lengkap yang mengimplementasikan pipeline forensik real-time di atas kanvas HTML5.
- Kompatibel dengan sistem tema SmartFeed (Dark & Light mode, Tailwind CSS).
- Terdiri atas 3 panel responsif:
  - Panel Kiri: Upload dropzone, file metadata info, sample test cases, stress test buttons (Kompres WA & Crop 50%).
  - Panel Tengah: Live interactive canvas inspector dengan switch tab (Visual Asli, ELA, 2D FFT, Laplacian Noise) serta controls zoom/reset.
  - Panel Kanan: Kartu Lapis 1 (EXIF & Metadata), Lapis 2 (C2PA Manifest), Lapis 3 (SynthID & FFT Piksel), dan Top Verdict Gauge.
- Modal Berita Acara SOP Redaksi dengan ekspor PDF/Cetak & Salin Teks.

---

### 2. Integrasi ke Navigasi & Sidebar
#### [MODIFY] [Sidebar.jsx](file:///d:/SIM/SMARTFEED/SmartFeed/src/components/Sidebar.jsx)
- Menambahkan menu `forensic` pada kelompok **Jurnalisme & Redaksi** (dengan badge `Pro`/`New` dan ikon `Microscope` / `ScanSearch`).
- Memastikan navigasi desktop & mobile drawer mengenali mode `forensic`.

---

### 3. Integrasi ke StudioApp
#### [MODIFY] [StudioApp.jsx](file:///d:/SIM/SMARTFEED/SmartFeed/src/StudioApp.jsx)
- Mendaftarkan mode `forensic` ke daftar judul `TITLES` (`Lab Forensik Konten AI`).
- Mengatur rendering full-width workspace untuk mode `forensic` (mirip seperti `imageslicer` dan `presentation`).
- Menghubungkan state dan handler reset.

---

### 4. Integrasi Demo & Inspirasi
#### [MODIFY] [JournalismDemoModal.jsx](file:///d:/SIM/SMARTFEED/SmartFeed/src/components/JournalismDemoModal.jsx) & [journalismDemoOptions.js](file:///d:/SIM/SMARTFEED/SmartFeed/src/data/journalismDemoOptions.js)
- Menambahkan tab "Lab Forensik AI" pada `JournalismDemoModal` sehingga pengguna dapat langsung memuat studi kasus forensik (misal: Foto Asli Kamera, Deepfake Midjourney, C2PA DALL-E 3, Hoaks Sosmed Terkompresi).

---

## Verification Plan

### Automated / Build Verification
- Menjalankan `npm run build` menggunakan `run_command` untuk memastikan tidak ada kesalahan sintaks, tipe, atau masalah bundling Vite.

### Manual Verification
1. Masuk ke halaman Studio SmartFeed (`/app` atau klik masuk ke studio).
2. Klik menu **Forensik Konten AI** di sidebar bagian **Jurnalisme & Redaksi**.
3. Uji Drag-and-Drop file gambar atau klik salah satu preset (Foto Kamera Fisik, Midjourney, DALL-E 3 C2PA, Gemini WA).
4. Verifikasi bahwa:
   - Metadata biner (EXIF) terbaca dengan benar.
   - C2PA manifest terdeteksi dan menampilkan status sertifikat kriptografi.
   - ELA (Error Level Analysis) menghasilkan heatmap kompresi 80% JPEG.
   - 2D FFT menghasilkan spektrogram frekuensi 2D dengan titik resonansi.
   - Laplacian filter menampilkan noise isolasi sensor.
   - Skor Probabilitas AI dan putusan redaksi terkalkulasi otomatis.
   - Tombol **"Buat Berita Acara SOP Redaksi"** memunculkan modal Berita Acara lengkap dan tombol cetak/salin berfungsi.
