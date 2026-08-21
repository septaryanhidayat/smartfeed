/**
 * Smart Feed — Email-allowlist authentication (Realtime Webhook + CSV Sync).
 */

import { CONFIG } from '../config.js';

export const SESSION_TTL_MS = 3 * 24 * 60 * 60 * 1000;  // 3 days

/* ───── Password check: salted SHA-256 ───── */
const PWD_SALT = 'af-studio-2026::';
const PWD_HASH = CONFIG.loginPasswordHash;

async function sha256Hex(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  return sha256Fallback(str);
}

function sha256Fallback(ascii) {
  const rightRotate = (v, c) => (v >>> c) | (v << (32 - c));
  const mathPow = Math.pow; const maxWord = mathPow(2, 32);
  let result = '';
  const words = []; const asciiBitLength = ascii.length * 8;
  let hash = sha256Fallback.h = sha256Fallback.h || [];
  const k = sha256Fallback.k = sha256Fallback.k || [];
  let primeCounter = k.length;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;
  for (let j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ (~e & hash[6])) + k[i]
        + (w[i] = i < 16 ? w[i] : (w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

function toAscii(str) {
  try { return unescape(encodeURIComponent(str)); } catch { return str; }
}

const AUTH_ENDPOINT = import.meta.env?.VITE_AUTH_ENDPOINT || '';

const ERR = {
  emptyEmail: 'Email tidak boleh kosong',
  emptyPwd:   'Password tidak boleh kosong',
  badFormat:  'Format email tidak valid',
  wrongPwd:   'Password salah',
  notAllowed: 'Email Anda belum terdaftar di database',
  network:    'Tidak bisa terhubung ke server database.',
  systemDown: 'Sistem sedang memverifikasi data. Coba beberapa saat lagi.',
};

/* ───── Cek email via Google Webhook (Bebas CORS Preflight) ───── */
async function fetchAllowedFromWebhook(webhookUrl) {
  try {
    const sep = webhookUrl.includes('?') ? '&' : '?';
    const checkUrl = `${webhookUrl}${sep}action=list&_t=${Date.now()}`;
    const res = await fetch(checkUrl, {
      method: 'GET',
      redirect: 'follow'
    });
    if (!res.ok) return { ok: false, err: ERR.systemDown };
    const j = await res.json();
    if (j && j.ok && Array.isArray(j.emails)) {
      return { ok: true, emails: j.emails.map(e => e.toLowerCase().trim()) };
    }
    return { ok: false, err: ERR.systemDown };
  } catch (e) {
    if (typeof console !== 'undefined') console.warn('[auth] webhook', e?.message);
    return { ok: false, err: ERR.network };
  }
}

/* ───── Cek email via Published CSV (Fallback) ───── */
async function fetchAllowedFromSheet(csvUrl) {
  try {
    const sep = csvUrl.includes('?') ? '&' : '?';
    const freshUrl = `${csvUrl}${sep}_t=${Date.now()}`;
    const res = await fetch(freshUrl, {
      method: 'GET',
      redirect: 'follow'
    });
    if (!res.ok) return { ok: false, err: ERR.systemDown };
    const text = await res.text();
    if (/^\s*<(!doctype|html)/i.test(text)) return { ok: false, err: ERR.systemDown };
    const emails = [];
    const matches = text.toLowerCase().match(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/g) || [];
    matches.forEach((m) => { if (!emails.includes(m)) emails.push(m); });
    return { ok: true, emails };
  } catch (e) {
    if (typeof console !== 'undefined') console.warn('[auth] sheet', e?.message);
    return { ok: false, err: ERR.network };
  }
}

let _failCount = 0;
let _lockUntil = 0;

/* ───── Public API: Login Validation ───── */
export async function validateLogin(rawEmail, rawPassword) {
  const email    = (rawEmail || '').toLowerCase().trim();
  const password = rawPassword || '';

  if (Date.now() < _lockUntil) {
    return { ok: false, error: 'Terlalu banyak percobaan. Tunggu sebentar.' };
  }

  if (!email)    return { ok: false, error: ERR.emptyEmail };
  if (!password) return { ok: false, error: ERR.emptyPwd };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: ERR.badFormat };
  }

  const hashed = await sha256Hex(toAscii(PWD_SALT + password));
  if (hashed !== PWD_HASH) {
    _failCount += 1;
    if (_failCount >= 5) {
      _lockUntil = Date.now() + 30_000;
      _failCount = 0;
    }
    return { ok: false, error: ERR.wrongPwd };
  }
  _failCount = 0;

  // 1. Prioritas Utama: Google Apps Script Webhook (Live check)
  if (CONFIG.sheetWebhookUrl) {
    const w = await fetchAllowedFromWebhook(CONFIG.sheetWebhookUrl);
    if (w.ok) {
      if (!w.emails.includes(email)) {
        return { ok: false, error: ERR.notAllowed };
      }
      return { ok: true, email };
    }
  }

  // 2. Prioritas Kedua: Published CSV Fallback
  if (CONFIG.sheetCsvUrl) {
    const s = await fetchAllowedFromSheet(CONFIG.sheetCsvUrl);
    if (s.ok) {
      if (!s.emails.includes(email)) {
        return { ok: false, error: ERR.notAllowed };
      }
      return { ok: true, email };
    }
  }

  // Jika database tersambung tapi email tidak ada
  if (CONFIG.sheetWebhookUrl || CONFIG.sheetCsvUrl) {
    return { ok: false, error: ERR.notAllowed };
  }

  return { ok: false, error: 'Login belum dikonfigurasi — isi "sheetWebhookUrl" di config.js.' };
}

export async function verifyEmailAllowed(rawEmail, sessionObj = null) {
  if (!rawEmail) return { allowed: false, reason: 'Sesi tidak valid' };
  const email = rawEmail.toLowerCase().trim();

  if (CONFIG.sheetWebhookUrl) {
    try {
      const sep = CONFIG.sheetWebhookUrl.includes('?') ? '&' : '?';
      const checkUrl = `${CONFIG.sheetWebhookUrl}${sep}action=check&email=${encodeURIComponent(email)}&_t=${Date.now()}`;
      const res = await fetch(checkUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      if (res.ok) {
        const j = await res.json();
        if (j && j.ok) {
          if (!j.allowed) {
            if (sessionObj?.loggedInAt && (Date.now() - sessionObj.loggedInAt < 3 * 60 * 1000)) {
              return { allowed: true };
            }
            clearAuthCache();
            return { allowed: false, reason: 'Email Anda tidak terdaftar di database.' };
          }
          return { allowed: true };
        }
      }
    } catch {
      return { allowed: true };
    }
  }

  return { allowed: true };
}

export function clearAuthCache() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.indexOf('af_user_list_v3_') === 0 || k.indexOf('af_session_') === 0)) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
}
