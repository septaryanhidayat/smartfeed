# PANDUAN INSTRUKTUR & MODUL PRAKTIK FORENSIK KONTEN AI
**Pelatihan Jurnalisme Investigasi & Cek Fakta Visual (Pro Edition)**

---

## 🎯 Tujuan Pelatihan
1. Memberikan alat uji nyata (*functional working tool*) yang dapat langsung digunakan oleh jurnalis untuk mengunggah foto apa pun dari lapangan atau media sosial dan menganalisisnya secara ilmiah.
2. Membekali peserta dengan metodologi pembuktian bertingkat (*multi-layer verification*): **EXIF Biner ➔ Kriptografi C2PA ➔ Piksel ELA & 2D FFT**.
3. Melatih peserta mengenali trik manipulasi visual (penghapusan EXIF lewat WhatsApp, screenshot, crop) dan cara mematahkan hoaks tersebut.
4. Menghasilkan **Berita Acara Forensik Standar Redaksi** yang siap dipertanggungjawabkan dalam rapat redaksi.

---

## 🖥️ Alat Utama: Lab Forensik Konten AI (Alat Kerja Nyata)
Buka file **[index.html](file:///d:/DOKUMEN/BTD/split_images/index.html)** di browser laptop / proyektor kelas.

### 🔬 Cara Kerja Mesin Analisis Nyata di Dalam Aplikasi:
1. **Binary Header Scanner**: Membaca langsung byte biner foto (*ArrayBuffer*) untuk menemukan tag EXIF, TIFF header, segmen XMP, dan PNG Text Chunks (`parameters`, `Software: Midjourney/DALL-E/Stable Diffusion/ComfyUI`).
2. **C2PA Manifest Detector**: Memindai kotak biner JUMBF (`jumb` dan `c2pa`) untuk mendeteksi sertifikat tanda tangan digital penerbit (*OpenAI, Adobe, dll.*).
3. **Real Error Level Analysis (ELA)**: Mengompresi ulang kanvas gambar secara matematis pada kualitas 80% JPEG, menghitung selisih piksel `|original - compressed| * scale`, dan menampilkan anomali tingkat kompresi pada area editan/sintetis.
4. **Real 2D Fast Fourier Transform (FFT)**: Menghitung spektrum frekuensi 2 dimensi untuk mendeteksi pola kisi periodik (*deconvolution checkerboard artifacts*) yang selalu ditinggalkan oleh generator AI difusi/GAN.
5. **Laplacian Noise Residual Filter**: Mengisolasi residu noise sensor mikroskopis optik kamera vs noise halus difusi laten.

---

## ⏱️ Alur Skenario Praktik Kelas (Durasi: 60 - 90 Menit)

```
[00:00 - 00:10] Pengantar: Mengapa AI Mengancam Ruang Redaksi?
[00:10 - 00:30] PRAKTIK 1: Uji Nyata EXIF & Metadata Biner (Upload Foto Asli & Foto AI)
[00:30 - 00:50] PRAKTIK 2: Kriptografi C2PA & Pemeriksaan JUMBF Manifest
[00:50 - 01:10] PRAKTIK 3: Forensik Piksel Nyata (ELA, 2D FFT & SynthID)
[01:10 - 01:25] Simulasi Meja Redaksi: Uji Manipulasi Lapangan & Ekspor Berita Acara SOP
[01:25 - 01:30] Tanya Jawab Kritis & Penutupan
```

---

## 📌 SKENARIO PRAKTIK 1: Analisis Metadata & EXIF Biner

### Langkah Demonstrasi di Depan Kelas:
1. Minta 2 peserta maju atau mengirimkan file:
   * **Foto A**: Foto asli jepretan kamera HP peserta yang dikirim sebagai dokumen (tanpa kompresi).
   * **Foto B**: Foto hasil generate Midjourney / DALL-E / Bing Image Creator yang diunduh langsung.
2. Drag & drop **Foto A** ke dalam kotak dropzone aplikasi `index.html`.
   * Tunjukkan bahwa aplikasi membaca biner kamera asli (misal: *iPhone, Samsung, Sony*) dan memberikan skor AI Probability rendah (0-15%).
3. Drag & drop **Foto B** (Foto AI) ke dalam aplikasi.
   * Tunjukkan **Lapis 1 langsung menyala MERAH (AI DETECTED)** karena biner membaca tag software atau prompt parameters.

---

## 📌 SKENARIO PRAKTIK 2: Mengecek C2PA (Content Credentials 2.4)

### Langkah Demonstrasi di Depan Kelas:
1. Unggah gambar yang dibuat menggunakan ChatGPT DALL-E 3 atau Adobe Firefly.
2. Aplikasi akan mendeteksi kotak JUMBF C2PA biner dan memunculkan badge **CR (Content Credentials Valid)**.
3. Tunjukkan rincian:
   * **Penerbit**: *OpenAI Trust Authority / Adobe Systems Inc.*
   * **Aksi**: `c2pa.created (Text-to-Image Generation)`
4. Jelaskan bahwa C2PA adalah standar masa depan di mana gambar AI membawa "KTP Digital" yang sah secara hukum.

---

## 📌 SKENARIO PRAKTIK 3: Forensik Piksel Nyata (ELA, 2D FFT & SynthID)

### Langkah Demonstrasi (*The Forensic Deep-Dive*):
1. Unggah foto AI yang metadatanya sudah bersih (misal setelah dikirim lewat WhatsApp).
2. Tunjukkan bahwa **Lapis 1 bertuliskan STRIPPED** (karena EXIF hilang).
3. Klik tab **"🔬 Error Level Analysis (Real ELA)"** di atas kanvas:
   * Perlihatkan kepada peserta perbedaan pendaran warna error pada bagian wajah/tubuh sintetis dibanding background.
4. Klik tab **"🌐 2D FFT Frequency Spectrogram"**:
   * Perlihatkan titik-titik pendaran energi tinggi di luar titik pusat (DC) yang membentuk pola kisi simetris (*checkerboard artifact*). Ini adalah sidik jari matematis arsitektur *convolutional neural network*.
5. Klik tombol **"💬 Kompres WhatsApp"** dan **"✂️ Crop 50%"** di panel kiri untuk membuktikan bahwa meskipun file disiksa, spektrum frekuensi Lapis 3 tetap dapat dianalisis!

---

## 📋 Ekspor Berita Acara SOP Redaksi

1. Setelah analisis selesai, klik tombol **"📄 Buat Berita Acara SOP Redaksi"** di pojok kanan atas.
2. Dokumen formal akan langsung dibuat secara otomatis memuat:
   * Nomor Registrasi Berkas
   * Tanggal & Pemeriksa
   * Matriks Hasil Pengujian 3 Lapis
   * Skor Probabilitas AI
   * Rekomendasi Keputusan Redaksi (*Layak Terbit / Tolak / Investigasi Lanjutan*).
3. Dokumen dapat langsung dicetak (*Print to PDF*) atau disalin teksnya ke meja redaksi.
