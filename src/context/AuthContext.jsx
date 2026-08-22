import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { validateLogin, verifyEmailAllowed, SESSION_TTL_MS, clearAuthCache } from '../auth/auth.js';
import { CONFIG } from '../config.js';
import { showAccountDisabledAlert } from '../utils/alerts.js';

const AuthContext = createContext(null);
const KEY = 'af_session_v1';

function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.email || !s.expiresAt) return null;
    if (Date.now() > s.expiresAt) {
      // expired — clear
      localStorage.removeItem(KEY);
      return null;
    }
    return s;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
      clearAuthCache();
    } catch {}
    setSession(null);
  }, []);

  // Cek apakah email user masih aktif di Spreadsheet
  const checkSessionLive = useCallback(async () => {
    if (!session || !session.email) return { ok: true };
    const check = await verifyEmailAllowed(session.email, session);
    if (!check.allowed) {
      logout();
      showAccountDisabledAlert();
      return { ok: false, error: check.reason };
    }
    // Sinkronisasi Nama Asli dari Google Sheet jika tersedia
    if (check.name && check.name !== session.name) {
      setSession((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, name: check.name };
        try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
    return { ok: true };
  }, [session, logout]);

  // Re-check expiry on mount + check spreadsheet setiap 10 detik & saat tab aktif
  useEffect(() => {
    try {
      localStorage.removeItem('af_recent_registered_emails_v1');
    } catch {}

    if (!session) return;
    
    // Cek langsung saat mount / refresh
    checkSessionLive();

    const id = setInterval(() => {
      if (Date.now() > session.expiresAt) {
        logout();
        return;
      }
      checkSessionLive();
    }, 10_000);

    const onFocus = () => checkSessionLive();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [session, logout, checkSessionLive]);

  const login = useCallback(async (email, password) => {
    const result = await validateLogin(email, password);
    if (!result.ok) return result;

    const cleanEmail = (email || '').toLowerCase().trim();
    let userName = result.name || '';
    if (!userName && CONFIG.sheetWebhookUrl) {
      try {
        const check = await verifyEmailAllowed(cleanEmail);
        if (check?.name) userName = check.name;
      } catch {}
    }

    const now = Date.now();
    const newSession = {
      email: result.email,
      name: userName || '',
      loggedInAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    try { localStorage.setItem(KEY, JSON.stringify(newSession)); } catch {}
    setSession(newSession);
    return { ok: true };
  }, []);

  const loginFree = useCallback((email, name) => {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, error: 'Format email tidak valid' };
    }
    const now = Date.now();
    const newSession = {
      email: cleanEmail,
      name: name || '',
      loggedInAt: now,
      expiresAt: now + SESSION_TTL_MS,
    };
    try { localStorage.setItem(KEY, JSON.stringify(newSession)); } catch {}
    setSession(newSession);
    return { ok: true, email: cleanEmail };
  }, []);

  const isAuthenticated = !!session;
  const expiresInDays = session ? Math.max(0, Math.ceil((session.expiresAt - Date.now()) / (24 * 60 * 60 * 1000))) : 0;

  return (
    <AuthContext.Provider value={{ session, isAuthenticated, login, loginFree, logout, checkSessionLive, expiresInDays }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
