import { useState, useEffect } from 'react';
import { X, Mail, User, Sparkles, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { notifyLoginSuccess } from '../utils/alerts.js';

/**
 * Modal Formulir Akses Gratis Peserta Pelatihan.
 * Menyimpan data peserta ke Google Spreadsheet via Google Apps Script Webhook
 * dan langsung mengarahkan peserta masuk ke Studio (/app).
 */
export default function AccessModal({ open, onClose }) {
  const { loginFree } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanName) {
      setError('Nama Lengkap wajib diisi.');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    setLoading(true);

    // 1. Simpan data peserta ke Google Spreadsheet Webhook
    const webhookUrl = CONFIG.sheetWebhookUrl;
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            type: 'register',
            email: cleanEmail,
            name: cleanName,
            source: 'Pelatihan',
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      } catch {}
    }

    // 2. Buat sesi login lokal
    const res = loginFree(cleanEmail, cleanName);
    if (!res.ok) {
      setError(res.error || 'Gagal mengaktifkan sesi.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    notifyLoginSuccess(cleanName || cleanEmail);

    // 3. Masuk ke halaman studio
    setTimeout(() => {
      onClose();
      // Arahkan rute ke /app atau #/app
      if (window.location.pathname !== '/app') {
        try {
          window.history.pushState({}, '', '/app');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch {
          window.location.hash = '#/app';
        }
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center px-3 sm:px-6 py-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-md max-h-[92vh] overflow-y-auto animate-slide-up rounded-t-2xl sm:rounded-2xl shadow-panel border border-accent/40"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 24px 80px -20px rgba(var(--accent-rgb),0.5), 0 0 0 1px rgba(var(--accent-rgb),0.35)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-bg-elev/40 flex items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(var(--accent-rgb),0.4)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] mono uppercase tracking-widest text-accent font-semibold">
                Khusus Peserta Pelatihan
              </div>
              <h3 className="text-sm font-bold text-text leading-tight">
                Akses Gratis {CONFIG.brandName}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-bg-deep flex items-center justify-center text-text-mut hover:text-text transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center mx-auto text-accent">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-text">Akses Berhasil Diaktifkan!</h4>
              <p className="text-xs text-text-mut">Sedang mengalihkan kamu ke studio...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-text-mut leading-relaxed">
                Masukkan nama dan email kamu di bawah untuk langsung mengaktifkan dan menggunakan seluruh fitur <b>{CONFIG.brandName} AI Studio</b> secara gratis.
              </p>

              {/* Nama */}
              <div>
                <label className="text-xs font-medium text-text mb-1.5 block">
                  Nama Lengkap <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none z-10" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="input w-full"
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-text mb-1.5 block">
                  Email Peserta <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none z-10" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="emailkamu@gmail.com"
                    className="input w-full"
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-cta w-full !py-3 !text-sm mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--accent-rgb),0.35)] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan &amp; Membuka Studio...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Aktifkan &amp; Masuk Studio
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-dim pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>100% Gratis · Akses Instan ke Semua Mode</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
