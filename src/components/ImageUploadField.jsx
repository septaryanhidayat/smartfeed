import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2, FileImage } from 'lucide-react';

export default function ImageUploadField({
  label = 'Pilih File Foto',
  value,
  fileName,
  onChange,
  onRemove,
  hint,
  required = false,
  compact = false,
  accept = 'image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/*'
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP, dll).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      if (onChange) {
        onChange(dataUrl, file, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    } else if (onChange) {
      onChange('', null, '');
    }
  };

  const previewSrc = typeof value === 'string' ? value : (value?.preview || value?.url || '');
  const displayName = fileName || (typeof value === 'object' ? value?.name : '') || 'Foto terpilih';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-accent" />
            <span>{label}</span>
            {required && <span className="text-accent ml-0.5">*</span>}
          </label>
          {previewSrc && (
            <span className="text-[10px] mono text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Foto Terpasang
            </span>
          )}
        </div>
      )}

      {previewSrc ? (
        /* Preview State */
        <div className="relative rounded-xl border border-border bg-bg-elev/50 p-2.5 flex items-center gap-3 transition-all hover:border-accent/50 group">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-black/40 border border-border/80 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-bold text-text truncate">
              <FileImage className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="truncate">{displayName}</span>
            </div>
            <p className="text-[11px] text-text-dim mt-0.5">
              File siap digunakan sebagai referensi visual AI
            </p>

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-accent hover:text-accent-h inline-flex items-center gap-1 bg-accent-sm px-2 py-0.5 rounded border border-border-strong transition-colors cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Ganti File
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-semibold text-red-400 hover:text-red-300 inline-flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 transition-colors cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Box State */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-xl border border-dashed transition-all cursor-pointer text-center ${
            compact ? 'p-3' : 'p-4 sm:p-5'
          } ${
            isDragging
              ? 'border-accent bg-accent/10 scale-[0.99]'
              : 'border-border hover:border-accent/60 bg-bg-elev/30 hover:bg-bg-elev/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-accent-sm border border-border flex items-center justify-center text-accent">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-text">
              <span className="text-accent underline font-bold">Klik untuk pilih file foto</span> atau tarik ke sini
            </div>
            <p className="text-[10px] mono text-text-dim">
              Mendukung PNG, JPG, JPEG, WEBP
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {hint && <p className="text-[11px] text-text-dim mt-0.5">{hint}</p>}
    </div>
  );
}
