/**
 * Direct In-App AI Image Generators
 * Supports executing prompts directly inside Smart Feed using user-synced credentials:
 * - OpenAI (ChatGPT / DALL-E 3)
 * - Google Gemini (Imagen 3 / Gemini AI Studio)
 * - Leonardo.ai
 * - Grok (xAI)
 */

export const AI_KEYS_STORAGE = 'af_synced_ai_keys_v1';

export function getSyncedAiKeys() {
  try {
    const raw = localStorage.getItem(AI_KEYS_STORAGE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSyncedAiKey(engineId, key) {
  try {
    const current = getSyncedAiKeys();
    current[engineId] = key ? key.trim().replace(/^["']|["']$/g, '') : '';
    localStorage.setItem(AI_KEYS_STORAGE, JSON.stringify(current));
    return true;
  } catch {
    return false;
  }
}

export function isEngineSynced(engineId) {
  const keys = getSyncedAiKeys();
  return Boolean(keys[engineId] && keys[engineId].trim().length > 5);
}

export function getSyncedEnginesCount() {
  const keys = getSyncedAiKeys();
  let count = 0;
  if (keys.chatgpt && keys.chatgpt.length > 5) count++;
  if (keys.gemini && keys.gemini.length > 5) count++;
  if (keys.grok && keys.grok.length > 5) count++;
  if (keys.leonardo && keys.leonardo.length > 5) count++;
  return count;
}

/**
 * Execute Direct Generation via Client-Side API
 */
export async function executeDirectAiGeneration(engineId, prompt, options = {}) {
  const keys = getSyncedAiKeys();
  let apiKey = keys[engineId];

  if (!apiKey || apiKey.trim().length < 5) {
    return {
      ok: false,
      error: `API Key untuk ${engineId.toUpperCase()} belum disinkronkan. Silakan hubungkan akunmu terlebih dahulu di menu Koneksi AI.`,
    };
  }

  apiKey = apiKey.trim().replace(/^["']|["']$/g, '');

  const ratio = options.ratio || '1:1';
  let size = '1024x1024';
  if (ratio.includes('16:9') || ratio.includes('Landscape')) size = '1792x1024';
  else if (ratio.includes('9:16') || ratio.includes('Portrait')) size = '1024x1792';

  // Clean prompt text for API
  const cleanPrompt = prompt.replace(/^\[.*?\]:\n*/g, '').slice(0, 3900);

  try {
    // ── 1. OPENAI DALL-E 3 ──
    if (engineId === 'chatgpt') {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: cleanPrompt,
          n: 1,
          size,
          quality: 'standard',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `HTTP ${res.status}: Gagal memproses gambar di OpenAI.`);
      }

      const imageUrl = data.data?.[0]?.url;
      const revisedPrompt = data.data?.[0]?.revised_prompt || cleanPrompt;
      return { ok: true, imageUrl, revisedPrompt, engine: 'ChatGPT (DALL-E 3)' };
    }

    // ── 2. GOOGLE GEMINI (IMAGEN 3) ──
    if (engineId === 'gemini') {
      // Primary Endpoint: Google Gemini Imagen 3
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: cleanPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: ratio.includes('16:9') ? '16:9' : ratio.includes('9:16') ? '9:16' : '1:1',
            outputMimeType: 'image/jpeg',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `HTTP ${res.status}: Gagal memproses di Google Gemini Imagen. Periksa apakah Gemini API Key valid.`);
      }

      const b64 = data.predictions?.[0]?.bytesBase64Encoded;
      if (!b64) throw new Error('Tidak ada data gambar yang dikembalikan oleh Gemini.');

      return {
        ok: true,
        imageUrl: `data:image/jpeg;base64,${b64}`,
        revisedPrompt: cleanPrompt,
        engine: 'Google Gemini (Imagen 3)',
      };
    }

    // ── 3. LEONARDO.AI ──
    if (engineId === 'leonardo') {
      // Step 1: Create generation job
      const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: cleanPrompt.slice(0, 1000),
          num_images: 1,
          width: 1024,
          height: 1024,
          photoReal: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.sdGenerationJob?.generationId) {
        throw new Error(data.error || `HTTP ${res.status}: Gagal membuat job gambar di Leonardo.ai`);
      }

      const genId = data.sdGenerationJob.generationId;

      // Step 2: Poll generation status
      let imageUrl = null;
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const checkRes = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${genId}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const checkData = await checkRes.json();
        const genImages = checkData.generations_by_pk?.generated_images;
        if (genImages && genImages.length > 0 && genImages[0].url) {
          imageUrl = genImages[0].url;
          break;
        }
      }

      if (!imageUrl) throw new Error('Waktu tunggu Leonardo.ai habis. Coba klik generate lagi.');

      return { ok: true, imageUrl, revisedPrompt: cleanPrompt, engine: 'Leonardo.ai' };
    }

    // ── 4. GROK 2 (xAI) ──
    if (engineId === 'grok') {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-2-vision-1212',
          messages: [{ role: 'user', content: cleanPrompt }],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `HTTP ${res.status}: Gagal memproses di Grok 2.`);
      }

      return {
        ok: true,
        textResponse: data.choices?.[0]?.message?.content,
        engine: 'Grok 2 (xAI)',
      };
    }

    throw new Error(`Engine ${engineId} belum mendukung direct generation.`);
  } catch (err) {
    return { ok: false, error: err.message || 'Terjadi kesalahan koneksi API AI.' };
  }
}
