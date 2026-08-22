import { CONFIG } from '../config.js';

const KEY = 'af_session_v1';

function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Kirim log aktivitas pengguna secara background ke Google Spreadsheet Webhook.
 * @param {string} action - 'GENERATE' | 'DEMO' | 'OPEN_TOOL' | 'COPY_PROMPT' | 'LOGIN'
 * @param {object} metadata - { tool: string, details?: string }
 */
export function logActivity(action, metadata = {}) {
  const webhookUrl = CONFIG.sheetWebhookUrl;
  if (!webhookUrl) return;

  const session = getSession();
  const email = session?.email || metadata.email || 'anonim';
  let name = session?.name || metadata.name || '';
  if (!name && email && email.includes('@')) {
    const userPart = email.split('@')[0];
    name = userPart.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const payload = JSON.stringify({
    type: 'activity',
    action: action,
    email: email,
    name: name,
    tool: metadata.tool || metadata.mode || '-',
    details: metadata.details || metadata.label || '-',
    timestamp: new Date().toISOString(),
  });

  try {
    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
    }).catch(() => {});
  } catch (err) {
    if (typeof console !== 'undefined') console.warn('[activityLogger]', err);
  }
}

