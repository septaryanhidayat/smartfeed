import { useState, useEffect } from 'react';
import {
  Key, ShieldCheck, Check, ExternalLink, X, Cpu, Sparkles, Zap, Wand2,
  Trash2, Eye, EyeOff, AlertCircle, RefreshCw
} from 'lucide-react';
import { getSyncedAiKeys, saveSyncedAiKey } from '../utils/directAiGenerators.js';
import { showAlert } from '../utils/alerts.js';

const AI_LIST = [
  {
    id: 'chatgpt',
    name: 'OpenAI (ChatGPT / DALL-E 3)',
    desc: 'Untuk generate langsung dengan model DALL-E 3',
    icon: Sparkles,
    color: '#10a37f',
    placeholder: 'sk-proj-...',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    getKeyLabel: 'Dapatkan OpenAI API Key',
  },
  {
    id: 'gemini',
    name: 'Google Gemini (Imagen 3)',
    desc: 'Untuk generate langsung dengan model Imagen 3 (Gratis & Cepat)',
    icon: Cpu,
    color: '#3b82f6',
    placeholder: 'AIzaSy...',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    getKeyLabel: 'Dapatkan Gemini API Key (Google AI Studio)',
  },
  {
    id: 'grok',
    name: 'Grok 2 (xAI)',
    desc: 'Untuk integrasi langsung dengan model visual xAI Grok',
    icon: Zap,
    color: '#f59e0b',
    placeholder: 'xai-...',
    getKeyUrl: 'https://console.x.ai/',
    getKeyLabel: 'Dapatkan xAI API Key',
  },
  {
    id: 'leonardo',
    name: 'Leonardo.ai',
    desc: 'Untuk generate langsung ke render pipeline Leonardo.ai',
    icon: Wand2,
    color: '#8b5cf6',
    placeholder: 'leo_...',
    getKeyUrl: 'https://app.leonardo.ai/api-access',
    getKeyLabel: 'Dapatkan Leonardo API Key',
  },
];

export default function AiIntegrationModal({ open, onClose, onKeysUpdated }) {
  const [keys, setKeys] = useState({});
  const [showKey, setShowKey] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [savedStatus, setSavedStatus] = useState({});

  useEffect(() => {
    if (open) {
      setKeys(getSyncedAiKeys());
    }
  }, [open]);

  if (!open) return null;

  const handleKeyChange = (engineId, val) => {
    setKeys((prev) => ({ ...prev, [engineId]: val }));
  };

  const handleSaveKey = (engineId) => {
    const val = keys[engineId] || '';
    saveSyncedAiKey(engineId, val);
    setSavedStatus((prev) => ({ ...prev, [engineId]: true }));
    setTimeout(() => {
      setSavedStatus((prev) => ({ ...prev, [engineId]: false }));
    }, 2000);

    if (typeof onKeysUpdated === 'function') onKeysUpdated();
  };

  const handleClearKey = (engineId) => {
    saveSyncedAiKey(engineId, '');
    setKeys((prev) => ({ ...prev, [engineId]: '' }));
    if (typeof onKeysUpdated === 'function') onKeysUpdated();
  };

  const connectedCount = Object.values(keys).filter((k) => k && k.trim().length > 5).length;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4 py-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface shadow-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up rounded-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-bg-panel/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-sm border border-accent/30 flex items-center justify-center">
              <Key className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                Sinkronisasi Akun Agent AI
                <span className="badge-new !text-[10px]">
                  {connectedCount} / {AI_LIST.length} Terhubung
                </span>
              </h2>
              <p className="text-xs text-text-mut mt-0.5">
                Masukkan API Key akunmu agar bisa generate gambar langsung di dalam Smart Feed tanpa perlu keluar aplikasi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-bg-elev flex items-center justify-center text-text-mut hover:text-text transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Banner */}
        <div className="p-4 mx-6 mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-300 leading-relaxed">
            <strong>Keamanan Terjamin 100%:</strong> Seluruh API Key disimpan secara lokal di browser kamu (<code className="bg-black/30 px-1 py-0.5 rounded text-[10px] text-emerald-200">localStorage</code>). Kunci tidak pernah dikirim ke server Smart Feed ataupun pihak ketiga lainnya.
          </div>
        </div>

        {/* AI Agent List */}
        <div className="p-6 space-y-4">
          {AI_LIST.map((ai) => {
            const Icon = ai.icon;
            const currentVal = keys[ai.id] || '';
            const isConnected = currentVal.trim().length > 5;
            const isVisible = showKey[ai.id] || false;
            const isSaved = savedStatus[ai.id];

            return (
              <div
                key={ai.id}
                className={`p-4 rounded-xl border transition ${
                  isConnected
                    ? 'border-accent/40 bg-bg-elev/40 shadow-sm'
                    : 'border-border/70 bg-bg-elev/10 hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: `${ai.color}20`, border: `1px solid ${ai.color}40` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: ai.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text flex items-center gap-2">
                        <span>{ai.name}</span>
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Terhubung
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-bg-deep text-text-dim border border-border/60">
                            Belum Terhubung
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-mut mt-0.5">{ai.desc}</div>
                    </div>
                  </div>

                  <a
                    href={ai.getKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-accent hover:underline flex items-center gap-1 font-semibold shrink-0"
                  >
                    <span>{ai.getKeyLabel}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Key Input Field */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="relative flex-1">
                    <input
                      type={isVisible ? 'text' : 'password'}
                      value={currentVal}
                      onChange={(e) => handleKeyChange(ai.id, e.target.value)}
                      placeholder={ai.placeholder}
                      className="w-full px-3 py-2 pr-9 rounded-lg bg-bg-panel border border-border text-xs font-mono text-text placeholder:text-text-dim/40 focus:border-accent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((p) => ({ ...p, [ai.id]: !p[ai.id] }))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
                    >
                      {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveKey(ai.id)}
                    className={`btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shrink-0 ${
                      isSaved ? '!bg-emerald-600' : ''
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersimpan</span>
                      </>
                    ) : (
                      <span>Simpan</span>
                    )}
                  </button>

                  {isConnected && (
                    <button
                      type="button"
                      onClick={() => handleClearKey(ai.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 text-text-dim hover:text-red-400 flex items-center justify-center transition shrink-0"
                      title="Hapus Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-bg-deep/40 flex items-center justify-between">
          <div className="text-[11px] text-text-mut">
            Opsi <strong className="text-text">Copy Prompt Manual</strong> tetap aktif kapan saja.
          </div>
          <button onClick={onClose} className="btn-ghost text-xs">
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
