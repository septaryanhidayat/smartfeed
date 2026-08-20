import { CONFIG } from '../config.js';

export const AI_URLS = {
  chatgpt: CONFIG.chatgptUrl || 'https://chatgpt.com/',
  gemini: 'https://gemini.google.com/app',
  grok: 'https://grok.com/',
  leonardo: 'https://app.leonardo.ai/',
};

export const AI_NAMES = {
  chatgpt: 'ChatGPT',
  gemini: 'Google Gemini',
  grok: 'Grok 2',
  leonardo: 'Leonardo.ai',
};

/**
 * Open Mini Companion Browser Window
 * Opens a docked popup window on the right edge of user's screen
 * Allows side-by-side workflow without full tab switches and preserves session logins.
 */
export function openMiniAiBrowser(engineId = 'chatgpt') {
  const url = AI_URLS[engineId] || AI_URLS.chatgpt;
  const width = 540;
  const height = 800;
  
  // Dock popup window neatly to the right side of the screen
  const screenW = window.screen.availWidth || window.innerWidth;
  const left = Math.max(0, screenW - width - 15);
  const top = 30;

  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'menubar=no',
    'toolbar=no',
    'location=yes',
    'status=no',
    'resizable=yes',
    'scrollbars=yes',
  ].join(',');

  const popup = window.open(url, 'SmartFeed_MiniCompanion', features);
  if (popup) {
    try {
      popup.focus();
    } catch {}
  }
  return popup;
}
