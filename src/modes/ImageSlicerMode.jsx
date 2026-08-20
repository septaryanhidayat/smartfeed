import { useState, useRef, useEffect } from 'react';
import {
  Scissors, Upload, Download, Grid3x3, Layers, Sparkles, Check, RefreshCw,
  Eye, FileArchive, ArrowDownRight, Sliders, Image as ImageIcon, Copy, AlertCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { showAlert } from '../utils/alerts.js';

const PRESETS = [
  { id: '3x3', label: '3x3 (9-Grid Instagram)', cols: 3, rows: 3, icon: Grid3x3, desc: '9 Kotak feed rapi untuk profil IG' },
  { id: '1x3', label: '1x3 (3 Slide Carousel)', cols: 3, rows: 1, icon: Layers, desc: '3 Slide panorama horizontal' },
  { id: '1x4', label: '1x4 (4 Slide Carousel)', cols: 4, rows: 1, icon: Layers, desc: '4 Slide panorama horizontal' },
  { id: '1x5', label: '1x5 (5 Slide Carousel)', cols: 5, rows: 1, icon: Layers, desc: '5 Slide panorama horizontal' },
  { id: '2x3', label: '3x2 (6-Grid Feed)', cols: 3, rows: 2, icon: Grid3x3, desc: '6 Kotak feed profil' },
  { id: 'custom', label: 'Custom (Atur Bebas)', cols: 3, rows: 3, icon: Sliders, desc: 'Tentukan jumlah baris & kolom sendiri' },
];

export default function ImageSlicerMode() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, name: '' });

  const [selectedPreset, setSelectedPreset] = useState('3x3');
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [outputFormat, setOutputFormat] = useState('image/jpeg'); // 'image/jpeg' or 'image/png'
  const [numberingOrder, setNumberingOrder] = useState('normal'); // 'normal' (1..N) or 'instagram' (N..1)
  const [targetSize, setTargetSize] = useState('original'); // 'original', '1080x1080', '1080x1350'

  const [slices, setSlices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Preset Change
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    if (preset.id !== 'custom') {
      setCols(preset.cols);
      setRows(preset.rows);
      if (preset.id === '3x3') {
        setNumberingOrder('instagram');
      } else {
        setNumberingOrder('normal');
      }
    }
  };

  // Load Image File
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImageFile(file);
  };

  const loadImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showAlert({ title: 'Format Tidak Didukung', text: 'Silakan pilih file gambar (JPG, PNG, WebP).', icon: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
        setImageSrc(src);
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Paste image from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) loadImageFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Compute Slices whenever image or grid params change
  useEffect(() => {
    if (!imageObj || cols < 1 || rows < 1) {
      setSlices([]);
      return;
    }

    setIsProcessing(true);
    const timeout = setTimeout(() => {
      const totalWidth = imageObj.naturalWidth;
      const totalHeight = imageObj.naturalHeight;
      const sliceWidth = totalWidth / cols;
      const sliceHeight = totalHeight / rows;
      const totalSlices = cols * rows;

      const generated = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c; // 0-based
          const orderNormal = index + 1; // 1, 2, 3...
          const orderInstagram = totalSlices - index; // 9, 8, 7... 1
          const finalNumber = numberingOrder === 'instagram' ? orderInstagram : orderNormal;

          // Create canvas for this slice
          const canvas = document.createElement('canvas');
          let outW = Math.round(sliceWidth);
          let outH = Math.round(sliceHeight);

          if (targetSize === '1080x1080') {
            outW = 1080;
            outH = 1080;
          } else if (targetSize === '1080x1350') {
            outW = 1080;
            outH = 1350;
          }

          canvas.width = outW;
          canvas.height = outH;
          const ctx = canvas.getContext('2d');

          // Draw cropped slice
          ctx.drawImage(
            imageObj,
            c * sliceWidth,
            r * sliceHeight,
            sliceWidth,
            sliceHeight,
            0,
            0,
            outW,
            outH
          );

          const dataUrl = canvas.toDataURL(outputFormat, 0.92);

          generated.push({
            id: `slice-${r}-${c}`,
            row: r + 1,
            col: c + 1,
            index: index + 1,
            displayOrder: finalNumber,
            dataUrl,
            width: outW,
            height: outH,
            filename: `${imageMeta.name || 'slice'}_part_${String(finalNumber).padStart(2, '0')}.${outputFormat === 'image/png' ? 'png' : 'jpg'}`,
          });
        }
      }

      // Sort slices for display
      setSlices(generated);
      setIsProcessing(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [imageObj, cols, rows, outputFormat, targetSize, numberingOrder, imageMeta.name]);

  // Download single slice
  const downloadSingle = (slice) => {
    const link = document.createElement('a');
    link.download = slice.filename;
    link.href = slice.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download All as ZIP
  const downloadAllZip = async () => {
    if (!slices.length) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folderName = `${imageMeta.name || 'smartfeed'}_slices`;
      const folder = zip.folder(folderName);

      // Sort slices based on display order for clarity
      const sorted = [...slices].sort((a, b) => a.displayOrder - b.displayOrder);

      sorted.forEach((s) => {
        // Remove header dataurl
        const base64Data = s.dataUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        folder.file(s.filename, base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showAlert({
        title: 'ZIP Berhasil Diunduh!',
        text: `${slices.length} potongan gambar berhasil dipaketkan dalam format .zip.`,
        icon: 'success',
      });
    } catch (err) {
      console.error(err);
      showAlert({ title: 'Gagal Membuat ZIP', text: 'Terjadi kesalahan saat memaketkan file.', icon: 'error' });
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Info */}
      <div className="surface p-5 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent-sm border border-accent/30 flex items-center justify-center shrink-0">
            <Scissors className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              Image & Carousel Slicer
              <span className="badge-new !text-[10px]">Auto ZIP</span>
            </h2>
            <p className="text-xs text-text-mut mt-0.5">
              Potong otomatis gambar 9-Grid Instagram atau Carousel Horizontal, lihat preview live, dan download semua dalam satu file ZIP.
            </p>
          </div>
        </div>

        {slices.length > 0 && (
          <button
            onClick={downloadAllZip}
            disabled={isZipping}
            className="btn-primary !py-2.5 !px-4 text-xs shrink-0 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
          >
            {isZipping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
            <span>{isZipping ? 'Membuat ZIP...' : `Download Semua (${slices.length} File ZIP)`}</span>
          </button>
        )}
      </div>

      {/* Grid Setting & Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Upload & Setting */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Card */}
          <div className="surface p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-text uppercase tracking-wider mono flex items-center justify-between">
              <span>1. Upload Gambar</span>
              {imageSrc && (
                <span className="text-[10px] text-accent lowercase">
                  {imageMeta.width} x {imageMeta.height} px
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-accent/60 rounded-xl p-8 text-center cursor-pointer transition bg-bg-elev/30 hover:bg-bg-elev/60 flex flex-col items-center justify-center group"
              >
                <div className="w-12 h-12 rounded-full bg-accent-sm border border-accent/20 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6 text-accent" />
                </div>
                <div className="text-sm font-semibold text-text">Pilih atau Drag & Drop Gambar</div>
                <div className="text-xs text-text-mut mt-1">Bisa juga langsung tekan <kbd className="px-1.5 py-0.5 rounded bg-bg-deep border border-border mono text-[10px]">Ctrl+V</kbd></div>
                <div className="text-[10px] text-text-dim mt-3 uppercase tracking-wider mono">Mendukung JPG, PNG, WEBP</div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elev border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-black/40 border border-border shrink-0">
                    <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-text">{imageMeta.name || 'Gambar Terpilih'}</div>
                    <div className="text-[10px] text-text-dim mono">{imageMeta.width} × {imageMeta.height} px</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost !py-1.5 !px-2.5 text-xs text-accent hover:bg-accent-sm shrink-0"
                >
                  Ganti
                </button>
              </div>
            )}
          </div>

          {/* Grid Preset Picker */}
          <div className="surface p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-text uppercase tracking-wider mono">
              2. Pilih Model Potongan (Preset)
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => {
                const Icon = p.icon;
                const active = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                      active
                        ? 'border-accent bg-accent-sm text-text font-semibold shadow-sm'
                        : 'border-border/60 hover:border-border text-text-mut hover:text-text hover:bg-bg-elev'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-4 h-4 ${active ? 'text-accent' : 'text-text-dim'}`} />
                      {active && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                    <div className="text-xs font-bold text-text">{p.label}</div>
                    <div className="text-[10px] text-text-dim mt-0.5 line-clamp-1">{p.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Grid Sliders (if selected) */}
            {selectedPreset === 'custom' && (
              <div className="p-3 rounded-lg bg-bg-elev border border-border space-y-3 mt-2 animate-fade-in">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Jumlah Kolom (Horizontal)</span>
                    <span className="mono text-accent">{cols} Kolom</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Jumlah Baris (Vertikal)</span>
                    <span className="mono text-accent">{rows} Baris</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Output Options */}
          <div className="surface p-4 border border-border space-y-3">
            <div className="text-xs font-bold text-text uppercase tracking-wider mono">
              3. Pengaturan Output
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-text-mut mb-1 font-semibold">Urutan Penomoran File:</label>
                <select
                  value={numberingOrder}
                  onChange={(e) => setNumberingOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-elev border border-border text-text focus:border-accent outline-none"
                >
                  <option value="normal">Normal (01, 02, 03... Kiri ke Kanan) — Cocok untuk Carousel</option>
                  <option value="instagram">Instagram 9-Grid (09, 08, 07... 01) — Siap Upload Berurutan ke Feed IG</option>
                </select>
                {numberingOrder === 'instagram' && (
                  <p className="text-[10px] text-amber-400 mt-1">
                    * Urutan terbalik (9 ke 1) memudahkan saat upload ke Instagram agar foto pertama jatuh di grid bawah dan foto terakhir di grid kiri atas.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-text-mut mb-1 font-semibold">Ukuran Per Potongan:</label>
                  <select
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-bg-elev border border-border text-text focus:border-accent outline-none text-xs"
                  >
                    <option value="original">Sesuai Rasio Asli</option>
                    <option value="1080x1080">1080 × 1080 (1:1 Persegi)</option>
                    <option value="1080x1350">1080 × 1350 (4:5 Portrait)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-mut mb-1 font-semibold">Format Gambar:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-bg-elev border border-border text-text focus:border-accent outline-none text-xs"
                  >
                    <option value="image/jpeg">JPG (Kualitas Tinggi)</option>
                    <option value="image/png">PNG (Lossless)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview & Slice Output */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Slice Overlay Preview */}
          <div className="surface p-4 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-text uppercase tracking-wider mono flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-accent" />
                <span>Preview Garis Potong ({cols} × {rows} = {cols * rows} Bagian)</span>
              </div>
              {slices.length > 0 && (
                <span className="text-[10px] mono text-text-dim">
                  {cols} kolom · {rows} baris
                </span>
              )}
            </div>

            {imageSrc ? (
              <div className="relative rounded-xl overflow-hidden border border-border bg-black/50 shadow-inner flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Original Slice Preview"
                  className="w-full h-auto max-h-[420px] object-contain block"
                />

                {/* Grid Overlay Guide */}
                <div
                  className="absolute inset-0 pointer-events-none grid"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                  }}
                >
                  {Array.from({ length: cols * rows }).map((_, idx) => {
                    const r = Math.floor(idx / cols);
                    const c = idx % cols;
                    const orderNormal = idx + 1;
                    const orderInstagram = (cols * rows) - idx;
                    const displayNum = numberingOrder === 'instagram' ? orderInstagram : orderNormal;

                    return (
                      <div
                        key={idx}
                        className="border border-red-500/60 bg-red-500/5 relative flex items-center justify-center group"
                      >
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono font-bold text-[10px] border border-white/20 shadow-md">
                          #{displayNum}
                        </span>
                        <span className="text-[10px] mono text-white/50 bg-black/60 px-1 rounded opacity-0 sm:opacity-75">
                          R{r + 1} C{c + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-12 text-center text-text-dim flex flex-col items-center justify-center">
                <ImageIcon className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-xs">Upload gambar terlebih dahulu untuk melihat garis potongan visual.</p>
              </div>
            )}
          </div>

          {/* Slices Grid Results Cards */}
          {slices.length > 0 && (
            <div className="surface p-4 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-text uppercase tracking-wider mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hasil Potongan Siap Unduh ({slices.length} File)</span>
                </div>
                <button
                  onClick={downloadAllZip}
                  disabled={isZipping}
                  className="btn-primary !py-1.5 !px-3 text-[11px] flex items-center gap-1.5"
                >
                  <FileArchive className="w-3 h-3" />
                  <span>{isZipping ? 'Downloading...' : 'Download ZIP'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {slices.map((slice) => (
                  <div
                    key={slice.id}
                    className="rounded-lg border border-border bg-bg-elev/40 p-2 flex flex-col justify-between group hover:border-accent/50 transition"
                  >
                    <div className="relative aspect-square rounded-md overflow-hidden bg-black/40 border border-border mb-2">
                      <img
                        src={slice.dataUrl}
                        alt={`Part ${slice.displayOrder}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-accent text-white font-mono font-bold text-[9px] shadow-sm">
                        Part {slice.displayOrder}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] mono text-text-mut truncate" title={slice.filename}>
                        {slice.filename}
                      </div>
                      <div className="text-[9px] mono text-text-dim">
                        {slice.width} × {slice.height} px
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadSingle(slice)}
                        className="btn-ghost !w-full !py-1 !px-1.5 text-[10px] flex items-center justify-center gap-1 mt-1 border border-border/60 hover:border-accent hover:text-accent"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
