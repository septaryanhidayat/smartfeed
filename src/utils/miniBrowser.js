import { CONFIG } from '../config.js';

export const AI_URLS = {
  chatgpt: 'https://chatgpt.com/',
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
 * with clean browser flags to avoid Cloudflare/Envoy resets on ChatGPT.
 */
export function openMiniAiBrowser(engineId = 'chatgpt') {
  const url = AI_URLS[engineId] || AI_URLS.chatgpt;
  const width = 560;
  const height = 820;
  
  // Dock popup window neatly to the right side of the screen
  const screenW = window.screen.availWidth || window.innerWidth;
  const left = Math.max(0, screenW - width - 15);
  const top = 30;

  // Window popup features
  const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=yes`;

  try {
    // Using '_blank' ensures standard clean browsing context without cross-origin name conflicts
    const popup = window.open(url, '_blank', windowFeatures);
    if (popup && !popup.closed) {
      popup.focus();
      return popup;
    }
  } catch (e) {
    console.warn('Popup blocked or failed, opening standard tab:', e);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return null;
}
