/**
 * Direct In-App AI Image Generators
 * Supports executing prompts directly inside Smart Feed using user-synced credentials:
 * - OpenAI (ChatGPT / DALL-E 3 & DALL-E 2 Fallback)
 * - Google Gemini (Imagen 3 / Gemini REST Multi-Endpoint)
 * - Leonardo.ai
 * - Grok 2 (xAI)
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
 * Execute Direct Generation via Client-Side API with Auto-Fallbacks
 */
export async function executeDirectAiGeneration(engineId, prompt, options = {}) {
  const keys = getSyncedAiKeys();
  let apiKey = keys[engineId];

  if (!apiKey || apiKey.trim().length < 5) {
    return {
      ok: false,
      error: `API Key untuk ${engineId.toUpperCase()} belum disinkronkan. Silakan buka menu "Koneksi AI" dan masukkan API Key akunmu.`,
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
    // ── 1. OPENAI DALL-E 3 (WITH DALL-E 2 FALLBACK) ──
    if (engineId === 'chatgpt') {
      let res = await fetch('https://api.openai.com/v1/images/generations', {
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

      let data = await res.json();

      // If project key doesn't have DALL-E 3 enabled, try DALL-E 2 fallback
      if (!res.ok && data.error?.message?.toLowerCase().includes('dall-e-3')) {
        res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'dall-e-2',
            prompt: cleanPrompt.slice(0, 1000),
            n: 1,
            size: '1024x1024',
          }),
        });
        data = await res.json();
      }

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `HTTP ${res.status}: Gagal memproses gambar di OpenAI. Pastikan saldo kredit OpenAI mencukupi.`);
      }

      const imageUrl = data.data?.[0]?.url;
      const revisedPrompt = data.data?.[0]?.revised_prompt || cleanPrompt;
      return { ok: true, imageUrl, revisedPrompt, engine: 'ChatGPT (OpenAI DALL-E)' };
    }

    // ── 2. GOOGLE GEMINI (IMAGEN 3 & AI STUDIO REST) ──
    if (engineId === 'gemini') {
      // Primary Endpoint A: Imagen 3 Generate
      const urlA = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      let res = await fetch(urlA, {
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

      let data = await res.json();

      // If Imagen 3 model is not enabled on this specific Google AI Studio project, try Vertex imagegeneration endpoint
      if (!res.ok || !data.predictions) {
        const urlB = `https://generativelanguage.googleapis.com/v1beta/models/imagegeneration@006:predict?key=${apiKey}`;
        const resB = await fetch(urlB, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: cleanPrompt }],
            parameters: { sampleCount: 1, aspectRatio: '1:1', outputMimeType: 'image/jpeg' },
          }),
        });
        const dataB = await resB.json();
        if (resB.ok && dataB.predictions) {
          res = resB;
          data = dataB;
        }
      }

      if (!res.ok || data.error) {
        const errMsg = data.error?.message || `HTTP ${res.status}: Akun Google Gemini ini belum mengaktifkan kuota Imagen 3 API.`;
        throw new Error(`${errMsg} Silakan aktifkan Imagen API di console Google AI Studio atau gunakan opsi Copy Prompt.`);
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
        throw new Error(data.error || `HTTP ${res.status}: Gagal membuat job gambar di Leonardo.ai. Pastikan API key valid.`);
      }

      const genId = data.sdGenerationJob.generationId;

      // Poll generation status
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
          model: 'grok-2-latest',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI image generation assistant. Analyze and refine visual feed designs.',
            },
            { role: 'user', content: cleanPrompt },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || `HTTP ${res.status}: Gagal memproses di Grok (xAI). Pastikan saldo xAI API mencukupi.`);
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
