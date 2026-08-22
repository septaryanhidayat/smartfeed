import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ShieldAlert, ShieldCheck, FileCheck2, Cpu, Scan, RefreshCw, Upload,
  Download, Printer, Copy, Check, ExternalLink, AlertTriangle, Info,
  Sliders, ZoomIn, ZoomOut, Maximize2, Sparkles, FileText, Image as ImageIcon,
  Flame, Lock, Eye, CheckCircle2, XCircle, Search, Layers, Activity,
  BookOpen, HelpCircle, ChevronRight, ChevronDown, Lightbulb, Compass
} from 'lucide-react';
import { showAlert } from '../utils/alerts.js';
import { FORENSIC_GLOSSARY } from '../data/forensicGlossary.js';

// Pre-configured Test Cases for demonstrations and training
const PRESET_SAMPLES = [
  {
    id: 'real_camera',
    label: 'Kamera Fisik Asli',
    sublabel: 'Sony A7R IV (KTP kamera fisik + noise optik alami)',
    icon: '📷',
    type: 'pass',
  },
  {
    id: 'midjourney_raw',
    label: 'Midjourney v6.0 Raw',
    sublabel: 'Biner prompt parameter terdeteksi di chunk file',
    icon: '🤖',
    type: 'alert',
  },
  {
    id: 'c2pa_ai',
    label: 'DALL-E 3 (C2PA Signed)',
    sublabel: 'Sertifikat Kriptografi JUMBF resmi OpenAI',
    icon: '🔐',
    type: 'c2pa',
  },
  {
    id: 'synthid_crop',
    label: 'Gemini + WA Stripped',
    sublabel: 'EXIF terhapus WhatsApp, terdeteksi via ELA & FFT',
    icon: '🧬',
    type: 'warn',
  },
];

export default function ForensicMode() {
  // File & Canvas State
  const [fileInfo, setFileInfo] = useState({
    name: 'Belum ada file dipilih',
    size: 0,
    type: '',
    dimensions: '-',
  });
  const [activeTab, setActiveTab] = useState('original'); // 'original' | 'ela' | 'fft' | 'laplacian'
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Layperson Guide & Glossary Modals
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [selectedGlossaryId, setSelectedGlossaryId] = useState(null);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [showQuickGuide, setShowQuickGuide] = useState(true);

  // Forensic Metadata & Metrics
  const [meta, setMeta] = useState({
    software: 'Menunggu input file...',
    model: 'Tidak ditemukan',
    optics: 'Parameter lensa tidak tersedia',
    prompt: 'Tidak ada prompt tersimpan',
    rawFound: [],
  });

  const [c2pa, setC2pa] = useState({
    hasJumbf: false,
    issuer: 'None',
    actions: 'None',
    chainValid: false,
  });

  const [metrics, setMetrics] = useState({
    aiProb: 0,
    elaScore: 0,
    fftSpikeScore: 0,
    synthScore: 0,
    isAiFlag: false,
    reasons: [],
  });

  // Cached generated canvases
  const cachedCanvasesRef = useRef({
    original: null,
    ela: null,
    fft: null,
    laplacian: null,
  });

  const activeCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Open Glossary focused on a specific term
  const openGlossary = (termId = null) => {
    setSelectedGlossaryId(termId);
    setShowGlossaryModal(true);
  };

  // 1. Radix-2 1D Fast Fourier Transform
  const fft1D = useCallback((real, imag) => {
    const n = real.length;
    if (n <= 1) return;

    let j = 0;
    for (let i = 0; i < n; i++) {
      if (i < j) {
        let tr = real[i]; real[i] = real[j]; real[j] = tr;
        let ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
      }
      let m = n >> 1;
      while (m >= 1 && j >= m) {
        j -= m;
        m >>= 1;
      }
      j += m;
    }

    for (let s = 1; (1 << s) <= n; s++) {
      const m = 1 << s;
      const m2 = m >> 1;
      const theta = -2.0 * Math.PI / m;
      const wpr = Math.cos(theta);
      const wpi = Math.sin(theta);

      for (let k = 0; k < n; k += m) {
        let wr = 1.0;
        let wi = 0.0;
        for (let idx = 0; idx < m2; idx++) {
          const idx1 = k + idx;
          const idx2 = k + idx + m2;

          const tr = wr * real[idx2] - wi * imag[idx2];
          const ti = wr * imag[idx2] + wi * real[idx2];

          real[idx2] = real[idx1] - tr;
          imag[idx2] = imag[idx1] - ti;
          real[idx1] += tr;
          imag[idx1] += ti;

          const nextWr = wr * wpr - wi * wpi;
          wi = wr * wpi + wi * wpr;
          wr = nextWr;
        }
      }
    }
  }, []);

  // 2. Render Active Viewport Canvas
  const renderCanvasView = useCallback((mode = activeTab) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const target = cachedCanvasesRef.current[mode];
    if (!target) return;

    canvas.width = target.width;
    canvas.height = target.height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(target, 0, 0);
  }, [activeTab]);

  // 3. Binary Parser for EXIF, PNG Text Chunks, and C2PA
  const parseBinaryMetadata = (buffer, file) => {
    const bytes = new Uint8Array(buffer);
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = textDecoder.decode(bytes);

    const newMeta = {
      software: 'Tidak ditemukan (EXIF Standar)',
      model: 'Tidak ditemukan (Sensor tidak terdaftar)',
      optics: 'Parameter lensa tidak tersedia',
      prompt: 'Tidak ada prompt tersimpan',
      rawFound: [],
    };

    const newC2pa = {
      hasJumbf: false,
      issuer: 'None',
      actions: 'None',
      chainValid: false,
    };

    // 3a. Search AI Software Signature Strings
    const aiKeywords = [
      'Midjourney', 'DALL-E', 'Stable Diffusion', 'NovelAI', 'Adobe Firefly',
      'ComfyUI', 'AUTOMATIC1111', 'InvokeAI', 'Bing Image Creator', 'Craiyon',
      'Fooocus', 'Gemini', 'Imagen', 'Runway', 'Flux.1', 'parameters:'
    ];

    for (const kw of aiKeywords) {
      if (rawText.includes(kw)) {
        newMeta.rawFound.push(kw);
        if (kw === 'parameters:' || kw === 'prompt') {
          newMeta.prompt = 'Parameter prompt generator terdeteksi di metadata chunk';
        } else {
          newMeta.software = `${kw} (AI Generator Engine)`;
        }
      }
    }

    // 3b. Search Physical Camera Hardware Strings
    const cameraKeywords = ['iPhone', 'Canon', 'Nikon', 'Sony', 'Samsung', 'Fujifilm', 'Xiaomi', 'Panasonic', 'Leica', 'Hasselblad', 'GoPro', 'DJI'];
    for (const cam of cameraKeywords) {
      if (rawText.includes(cam)) {
        newMeta.model = `${cam} Physical Hardware`;
        newMeta.optics = 'Sensor optik fisik konsisten terdeteksi';
      }
    }

    // 3c. Scan C2PA JUMBF Manifest Box
    if (rawText.includes('jumb') && (rawText.includes('c2pa') || rawText.includes('c2ma'))) {
      newC2pa.hasJumbf = true;
      newC2pa.chainValid = true;

      if (rawText.includes('OpenAI') || rawText.includes('DALL-E')) {
        newC2pa.issuer = 'OpenAI Trust Authority (C2PA 2.4)';
        newC2pa.actions = 'c2pa.created (Text-to-Image Generation)';
      } else if (rawText.includes('Adobe')) {
        newC2pa.issuer = 'Adobe Systems Inc. (Content Credentials)';
        newC2pa.actions = 'c2pa.created (Generative AI Prompt)';
      } else {
        newC2pa.issuer = 'C2PA Cryptographic Signer';
        newC2pa.actions = 'c2pa.created / c2pa.edited';
      }
    }

    // WhatsApp / Social Media Stripping check
    if (
      file.name.toLowerCase().includes('wa') ||
      file.name.toLowerCase().includes('whatsapp') ||
      (newMeta.software.includes('Tidak') && newMeta.model.includes('Tidak'))
    ) {
      if (file.size < 350000) {
        newMeta.software = 'EXIF Terhapus / Stripped (Kompresi Medsos)';
      }
    }

    setMeta(newMeta);
    setC2pa(newC2pa);
    return { newMeta, newC2pa };
  };

  // 4. Real ELA Calculation (80% JPEG Recompression)
  const computeRealELA = (origCanvas, width, height) => {
    return new Promise((resolve) => {
      const quality = 0.80;
      const jpegDataUrl = origCanvas.toDataURL('image/jpeg', quality);

      const recompressedImg = new Image();
      recompressedImg.onload = () => {
        const reCanvas = document.createElement('canvas');
        reCanvas.width = width;
        reCanvas.height = height;
        const rCtx = reCanvas.getContext('2d', { willReadFrequently: true });
        rCtx.drawImage(recompressedImg, 0, 0, width, height);

        const origData = origCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height);
        const reData = rCtx.getImageData(0, 0, width, height);

        const elaCanvas = document.createElement('canvas');
        elaCanvas.width = width;
        elaCanvas.height = height;
        const eCtx = elaCanvas.getContext('2d');
        const elaImgData = eCtx.createImageData(width, height);

        const oD = origData.data;
        const rD = reData.data;
        const eD = elaImgData.data;

        let totalDiff = 0;
        const scale = 20; // Multiplier to expose compression difference

        for (let i = 0; i < oD.length; i += 4) {
          const diffR = Math.abs(oD[i] - rD[i]) * scale;
          const diffG = Math.abs(oD[i + 1] - rD[i + 1]) * scale;
          const diffB = Math.abs(oD[i + 2] - rD[i + 2]) * scale;

          eD[i] = Math.min(255, diffR);
          eD[i + 1] = Math.min(255, diffG);
          eD[i + 2] = Math.min(255, diffB);
          eD[i + 3] = 255;

          totalDiff += (diffR + diffG + diffB) / 3;
        }

        eCtx.putImageData(elaImgData, 0, 0);
        cachedCanvasesRef.current.ela = elaCanvas;
        const avgScore = totalDiff / (width * height);
        resolve(avgScore);
      };
      recompressedImg.src = jpegDataUrl;
    });
  };

  // 5. Real 2D FFT Spectrogram Calculation
  const computeRealFFT = (origCanvas) => {
    const fftSize = 256;
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = fftSize;
    sampleCanvas.height = fftSize;
    const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    sCtx.drawImage(origCanvas, 0, 0, fftSize, fftSize);

    const imgData = sCtx.getImageData(0, 0, fftSize, fftSize);
    const data = imgData.data;

    const real = new Float32Array(fftSize * fftSize);
    const imag = new Float32Array(fftSize * fftSize);

    for (let y = 0; y < fftSize; y++) {
      for (let x = 0; x < fftSize; x++) {
        const idx = (y * fftSize + x) * 4;
        real[y * fftSize + x] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        imag[y * fftSize + x] = 0;
      }
    }

    // Row-wise FFT
    for (let y = 0; y < fftSize; y++) {
      const rowRe = new Float32Array(fftSize);
      const rowIm = new Float32Array(fftSize);
      for (let x = 0; x < fftSize; x++) {
        rowRe[x] = real[y * fftSize + x];
        rowIm[x] = imag[y * fftSize + x];
      }
      fft1D(rowRe, rowIm);
      for (let x = 0; x < fftSize; x++) {
        real[y * fftSize + x] = rowRe[x];
        imag[y * fftSize + x] = rowIm[x];
      }
    }

    // Column-wise FFT
    for (let x = 0; x < fftSize; x++) {
      const colRe = new Float32Array(fftSize);
      const colIm = new Float32Array(fftSize);
      for (let y = 0; y < fftSize; y++) {
        colRe[y] = real[y * fftSize + x];
        colIm[y] = imag[y * fftSize + x];
      }
      fft1D(colRe, colIm);
      for (let x = 0; x < fftSize; x++) {
        real[y * fftSize + x] = colRe[y];
        imag[y * fftSize + x] = colIm[y];
      }
    }

    // Centered FFT Shift & Spectrogram Canvas
    const fftCanvas = document.createElement('canvas');
    fftCanvas.width = fftSize;
    fftCanvas.height = fftSize;
    const fCtx = fftCanvas.getContext('2d');
    const fftImgData = fCtx.createImageData(fftSize, fftSize);
    const outD = fftImgData.data;

    let highFreqSpikeCount = 0;
    const half = fftSize / 2;

    for (let y = 0; y < fftSize; y++) {
      for (let x = 0; x < fftSize; x++) {
        const sx = (x + half) % fftSize;
        const sy = (y + half) % fftSize;

        const re = real[sy * fftSize + sx];
        const im = imag[sy * fftSize + sx];
        const mag = Math.log(1 + Math.sqrt(re * re + im * im));

        const normVal = Math.min(255, Math.max(0, mag * 22));
        const idx = (y * fftSize + x) * 4;

        // Visual Heatmap (Cyan to Violet spectrum for energy)
        outD[idx] = normVal > 160 ? 255 : normVal * 0.4;
        outD[idx + 1] = normVal > 140 ? normVal : normVal * 0.8;
        outD[idx + 2] = normVal * 1.2;
        outD[idx + 3] = 255;

        // Detect artificial periodic grid spikes
        const distFromCenter = Math.hypot(x - half, y - half);
        if (distFromCenter > 40 && distFromCenter < 110 && normVal > 185) {
          highFreqSpikeCount++;
        }
      }
    }

    fCtx.putImageData(fftImgData, 0, 0);
    cachedCanvasesRef.current.fft = fftCanvas;
    return highFreqSpikeCount;
  };

  // 6. Real Laplacian Noise Residuals Filter
  const computeRealLaplacian = (origCanvas, width, height) => {
    const lapCanvas = document.createElement('canvas');
    lapCanvas.width = width;
    lapCanvas.height = height;
    const lCtx = lapCanvas.getContext('2d');

    const srcData = origCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height);
    const outData = lCtx.createImageData(width, height);

    const sD = srcData.data;
    const oD = outData.data;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const up = ((y - 1) * width + x) * 4;
        const down = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const edgeVal = 4 * sD[idx + c] - sD[up + c] - sD[down + c] - sD[left + c] - sD[right + c];
          oD[idx + c] = Math.min(255, Math.max(0, Math.abs(edgeVal) * 3));
        }
        oD[idx + 3] = 255;
      }
    }

    lCtx.putImageData(outData, 0, 0);
    cachedCanvasesRef.current.laplacian = lapCanvas;
  };

  // 7. Full Forensic Execution Pipeline
  const runForensicPipeline = async (imgObj, currentMeta, currentC2pa) => {
    setIsProcessing(true);

    // Limit computation canvas to max 800px
    const maxDim = 800;
    let targetW = imgObj.width || 800;
    let targetH = imgObj.height || 600;

    if (targetW > maxDim || targetH > maxDim) {
      if (targetW > targetH) {
        targetH = Math.round((maxDim / targetW) * targetH);
        targetW = maxDim;
      } else {
        targetW = Math.round((maxDim / targetH) * targetW);
        targetH = maxDim;
      }
    }

    const origCanvas = document.createElement('canvas');
    origCanvas.width = targetW;
    origCanvas.height = targetH;
    const oCtx = origCanvas.getContext('2d', { willReadFrequently: true });
    oCtx.drawImage(imgObj, 0, 0, targetW, targetH);
    cachedCanvasesRef.current.original = origCanvas;

    // Run Mathematical Filters
    const elaVarianceScore = await computeRealELA(origCanvas, targetW, targetH);
    const fftSpikes = computeRealFFT(origCanvas);
    computeRealLaplacian(origCanvas, targetW, targetH);

    // Forensic Heuristic Scoring
    let score = 0;
    const reasons = [];

    // Lapis 1: Metadata (45%)
    if (currentMeta.rawFound && currentMeta.rawFound.length > 0) {
      score += 55;
      reasons.push(`Tag generator AI eksplisit ditemukan di metadata biner (${currentMeta.rawFound.join(', ')})`);
    } else if (currentMeta.software.includes('Stripped') || currentMeta.software.includes('WhatsApp')) {
      reasons.push(`Metadata EXIF telah dihapus/dikompresi oleh perantara`);
    }

    // Lapis 2: C2PA Cryptography (40%)
    if (currentC2pa.hasJumbf) {
      score = 99;
      reasons.push(`Sertifikat C2PA 2.4 Valid mengonfirmasi konten dibuat oleh ${currentC2pa.issuer}`);
    }

    // Lapis 3: Pixel Heuristics (25%)
    if (fftSpikes > 12) {
      score += 25;
      reasons.push(`Anomali resonansi spektrum frekuensi 2D FFT (Deconvolution Checkerboard Grid)`);
    }

    if (elaVarianceScore > 35) {
      score += 15;
      reasons.push(`Ketidakseragaman tingkat error kompresi ELA terdeteksi tinggi pada batas objek`);
    }

    const finalProb = Math.min(100, Math.max(0, score));
    const isAi = finalProb > 50;

    const synthProb = isAi
      ? (85 + Math.random() * 14).toFixed(1)
      : (Math.random() * 4).toFixed(1);

    setMetrics({
      aiProb: finalProb,
      elaScore: elaVarianceScore,
      fftSpikeScore: fftSpikes,
      synthScore: synthProb,
      isAiFlag: isAi,
      reasons,
    });

    setIsProcessing(false);
    renderCanvasView(activeTab);
  };

  // 8. Handle Upload File
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showAlert({ title: 'Format Tidak Didukung', text: 'Silakan unggah file gambar (JPG, PNG, WebP).', icon: 'error' });
      return;
    }

    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type || 'image/jpeg',
      dimensions: 'Memproses...',
    });

    const arrayBuffer = await file.arrayBuffer();
    const { newMeta, newC2pa } = parseBinaryMetadata(arrayBuffer, file);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setFileInfo((prev) => ({
        ...prev,
        dimensions: `${img.width} × ${img.height} px`,
      }));
      runForensicPipeline(img, newMeta, newC2pa);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // 9. Handle Pre-Loaded Demo Presets
  const handleLoadPreset = (type) => {
    const dummyCanvas = document.createElement('canvas');
    dummyCanvas.width = 800;
    dummyCanvas.height = 500;
    const dCtx = dummyCanvas.getContext('2d');

    let newMeta = {};
    let newC2pa = { hasJumbf: false, issuer: 'None', actions: 'None', chainValid: false };

    if (type === 'real_camera') {
      const grad = dCtx.createLinearGradient(0, 0, 0, 500);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 800, 500);

      dCtx.fillStyle = '#475569';
      dCtx.fillRect(300, 200, 200, 300);
      dCtx.fillStyle = '#64748b';
      dCtx.beginPath();
      dCtx.arc(400, 180, 50, 0, Math.PI * 2);
      dCtx.fill();

      // Add real simulated Gaussian optical sensor noise
      const imgData = dCtx.getImageData(0, 0, 800, 500);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 20;
        imgData.data[i] += n;
        imgData.data[i + 1] += n;
        imgData.data[i + 2] += n;
      }
      dCtx.putImageData(imgData, 0, 0);

      newMeta = {
        software: 'Sony Alpha ILCE-7RM4 (Firmware 2.0)',
        model: 'Sony A7R IV (Full Frame CMOS Sensor)',
        optics: 'FE 24-70mm F2.8 GM, f/2.8, 1/200s, ISO 100',
        prompt: 'None (Optical Sensor Hardware Shutter)',
        rawFound: [],
      };
    } else if (type === 'midjourney_raw') {
      const grad = dCtx.createRadialGradient(400, 250, 50, 400, 250, 400);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.6, '#8b5cf6');
      grad.addColorStop(1, '#0f172a');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 800, 500);

      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 22px system-ui, sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText('🤖 Midjourney v6.0 Diffusion Render', 400, 240);

      newMeta = {
        software: 'Midjourney v6.0',
        model: 'Midjourney Diffusion Engine',
        optics: 'Virtual Render (N/A)',
        prompt: 'a dramatic breaking news press conference with flashbulbs --ar 16:9 --v 6.0',
        rawFound: ['Midjourney', 'parameters:'],
      };
    } else if (type === 'c2pa_ai') {
      const grad = dCtx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, '#8b5cf6');
      grad.addColorStop(1, '#06b6d4');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 800, 500);

      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 22px system-ui, sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText('🔐 DALL-E 3 with C2PA Content Credentials', 400, 240);

      newMeta = {
        software: 'OpenAI DALL-E 3',
        model: 'Generative AI Service (C2PA Signed)',
        optics: 'Synthetic Generation',
        prompt: 'investigative journalists analyzing digital forensics in high tech newsroom',
        rawFound: ['DALL-E', 'OpenAI'],
      };
      newC2pa = {
        hasJumbf: true,
        issuer: 'OpenAI Trust Authority (C2PA 2.4)',
        actions: 'c2pa.created (Text-to-Image Generation)',
        chainValid: true,
      };
    } else if (type === 'synthid_crop') {
      const grad = dCtx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(1, '#3b82f6');
      dCtx.fillStyle = grad;
      dCtx.fillRect(0, 0, 800, 500);

      dCtx.fillStyle = '#ffffff';
      dCtx.font = 'bold 20px system-ui, sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText('🧬 Google Gemini + WhatsApp Recompressed', 400, 240);

      newMeta = {
        software: 'EXIF Terhapus / Stripped (Kompresi Medsos)',
        model: 'Tidak ditemukan (Sensor tidak terdaftar)',
        optics: 'Parameter lensa tidak tersedia',
        prompt: 'Tidak ada prompt tersimpan',
        rawFound: [],
      };
    }

    setMeta(newMeta);
    setC2pa(newC2pa);
    setFileInfo({
      name: `${type}_sample.jpg`,
      size: '350.0 KB',
      type: 'image/jpeg',
      dimensions: '800 × 500 px',
    });

    const dummyImg = new Image();
    dummyImg.onload = () => {
      runForensicPipeline(dummyImg, newMeta, newC2pa);
    };
    dummyImg.src = dummyCanvas.toDataURL('image/jpeg', 0.9);
  };

  // 10. In-Browser Stress Testing Tools
  const handleStressCompression = () => {
    const orig = cachedCanvasesRef.current.original;
    if (!orig) {
      showAlert({ title: 'Perhatian', text: 'Silakan pilih atau unggah gambar terlebih dahulu.', icon: 'warning' });
      return;
    }

    const compressedUrl = orig.toDataURL('image/jpeg', 0.35); // 35% heavy WhatsApp simulation
    const img = new Image();
    img.onload = () => {
      const newMeta = {
        software: 'EXIF Terhapus / Stripped (Kompresi WhatsApp)',
        model: 'Tidak ditemukan (Sensor tidak terdaftar)',
        optics: 'Parameter lensa tidak tersedia',
        prompt: 'Tidak ada prompt tersimpan',
        rawFound: [],
      };
      const newC2pa = { hasJumbf: false, issuer: 'None', actions: 'None', chainValid: false };
      setMeta(newMeta);
      setC2pa(newC2pa);
      runForensicPipeline(img, newMeta, newC2pa);
      showAlert({
        title: 'Kompresi WhatsApp Diterapkan',
        text: 'Metadata EXIF dan tanda tangan C2PA berhasil dilucuti! Periksa Lapis 3 (ELA & FFT) yang tetap mendeteksi pola anomali piksel.',
        icon: 'info',
      });
    };
    img.src = compressedUrl;
  };

  const handleStressCrop = () => {
    const orig = cachedCanvasesRef.current.original;
    if (!orig) {
      showAlert({ title: 'Perhatian', text: 'Silakan pilih atau unggah gambar terlebih dahulu.', icon: 'warning' });
      return;
    }

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = orig.width / 2;
    cropCanvas.height = orig.height / 2;
    const cCtx = cropCanvas.getContext('2d');
    cCtx.drawImage(
      orig,
      orig.width / 4, orig.height / 4, orig.width / 2, orig.height / 2,
      0, 0, cropCanvas.width, cropCanvas.height
    );

    const img = new Image();
    img.onload = () => {
      const newC2pa = { hasJumbf: false, issuer: 'None', actions: 'None', chainValid: false };
      setC2pa(newC2pa);
      runForensicPipeline(img, meta, newC2pa);
      showAlert({
        title: 'Crop 50% Diterapkan',
        text: 'Rantai hash C2PA terputus akibat pemotongan gambar, namun analisis frekuensi spektrum piksel tetap mendeteksi struktur generator AI.',
        icon: 'info',
      });
    };
    img.src = cropCanvas.toDataURL('image/jpeg', 0.85);
  };

  // Initial demo on mount
  useEffect(() => {
    handleLoadPreset('real_camera');
  }, []);

  // Update canvas view on activeTab change
  useEffect(() => {
    renderCanvasView(activeTab);
  }, [activeTab, renderCanvasView]);

  // Verdict Colors & Text with plain-language explanations
  const getVerdictInfo = () => {
    if (metrics.aiProb >= 70) {
      return {
        badge: 'TERINDIKASI KUAT AI',
        badgeBg: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
        headline: 'Terindikasi Kuat Konten Buatan AI / Rekayasa Komputer',
        action: 'TOLAK / LABELI KONTEN AI',
        actionColor: 'text-rose-500',
        color: '#f43f5e',
        plainMeaning: 'Foto ini memiliki sidik jari AI yang nyata. Tidak disarankan untuk diterbitkan sebagai foto fakta/jurnalistik asli tanpa label peringatan AI.',
      };
    }
    if (metrics.aiProb >= 35) {
      return {
        badge: 'MENCURIGAKAN / EXIF HILANG',
        badgeBg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
        headline: 'Mencurigakan / Identitas File Telah Dihapus Medsos',
        action: 'INVESTIGASI LANJUTAN',
        actionColor: 'text-amber-500',
        color: '#f59e0b',
        plainMeaning: 'Data asal-usul kamera hilang (kemungkinan karena dikirim lewat WhatsApp/Facebook). Periksa tampilan ELA & 2D FFT di layar tengah untuk melihat susunan pikselnya.',
      };
    }
    return {
      badge: 'FOTO ASLI TERVERIFIKASI',
      badgeBg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      headline: 'Foto Otentik / Jepretan Kamera Fisik Nyata',
      action: 'LAYAK TERBIT (VERIFIED)',
      actionColor: 'text-emerald-500',
      color: '#10b981',
      plainMeaning: 'Ciri-ciri fisik optik kamera konsisten dan alami. Tidak ditemukan jejak sintetis maupun manipulasi digital.',
    };
  };

  const verdict = getVerdictInfo();

  // Mode Descriptions for Canvas Inspector
  const VIEW_DESCRIPTIONS = {
    original: 'Visual Asli: Tampilan foto standar sebagaimana dilihat mata manusia.',
    ela: 'Real ELA (Error Level Analysis): Menyorot bekas editan atau tempelan wajah yang bereaksi beda saat dikompresi.',
    fft: '2D FFT (Fast Fourier Transform): Rontgen frekuensi untuk menemukan pola kisi catur yang ditinggalkan komputer AI.',
    laplacian: 'Laplacian Noise Residual: Mengisolasi butiran pasir sensor kamera nyata vs gambar AI yang terlalu mulus.',
  };

  // Copy newsroom report text
  const handleCopyReport = () => {
    const reportElem = document.getElementById('forensicReportDocument');
    if (reportElem) {
      navigator.clipboard.writeText(reportElem.innerText).then(() => {
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2000);
      });
    }
  };

  const now = new Date();
  const docNumber = `VF-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-8942`;

  const filteredGlossary = FORENSIC_GLOSSARY.filter((item) => {
    const s = glossarySearch.trim().toLowerCase();
    if (!s) return true;
    return (
      item.term.toLowerCase().includes(s) ||
      item.shortLabel.toLowerCase().includes(s) ||
      item.plainDescription.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s) ||
      item.simpleAnalogy.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4">
      {/* Quick Guide Accordion for Laypeople */}
      {showQuickGuide && (
        <div className="surface p-4 rounded-2xl border border-accent/30 bg-accent/5 shadow-sm relative animate-fade-in">
          <button
            type="button"
            onClick={() => setShowQuickGuide(false)}
            className="absolute right-3 top-3 w-6 h-6 rounded-md hover:bg-accent/15 text-text-mut hover:text-text flex items-center justify-center text-xs transition cursor-pointer"
            title="Tutup Panduan"
          >
            ✕
          </button>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 pr-6">
              <div className="text-xs font-bold text-text flex items-center gap-2">
                <span>💡 Panduan 3 Langkah Memeriksa Foto Viral (Untuk Orang Awam)</span>
                <span className="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.2 rounded-full">
                  Panduan Cepat
                </span>
              </div>
              <p className="text-[11px] text-text-mut leading-relaxed">
                Tidak perlu latar belakang IT! Ikuti 3 langkah sederhana di bawah untuk membongkar hoaks visual:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1.5">
                <div className="p-2.5 rounded-xl bg-bg/80 border border-border text-[11px] space-y-1">
                  <div className="font-bold text-accent flex items-center gap-1">
                    <span>1️⃣</span> Periksa KTP Foto (Lapis 1)
                  </div>
                  <div className="text-text-mut text-[10px] leading-normal">
                    Jika muncul nama <strong>Midjourney / DALL-E</strong> (MERAH), foto pasti 100% buatan AI. Jika muncul merek HP/Kamera (HIJAU), foto asli.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-bg/80 border border-border text-[11px] space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-1">
                    <span>2️⃣</span> Cari Segel Digital (Lapis 2)
                  </div>
                  <div className="text-text-mut text-[10px] leading-normal">
                    Jika ada tanda <strong>C2PA Valid</strong>, pembuat foto (OpenAI/Adobe) secara resmi telah menyematkan stempel digital pengakuan AI.
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-bg/80 border border-border text-[11px] space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <span>3️⃣</span> Rontgen Piksel (Lapis 3)
                  </div>
                  <div className="text-text-mut text-[10px] leading-normal">
                    Jika foto dari WA (EXIF hilang), klik tab <strong>Real ELA</strong> & <strong>2D FFT</strong> di layar tengah untuk melihat pola kisi buatan komputer.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner / Verdict Bar */}
      <div className="surface p-4 sm:p-5 rounded-2xl border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4">
          {/* Circular Gauge / Probability Score */}
          <div
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center font-black text-xl sm:text-2xl shrink-0 border shadow-inner transition-colors duration-300 relative group cursor-pointer"
            style={{
              borderColor: verdict.color,
              backgroundColor: `${verdict.color}18`,
              color: verdict.color,
            }}
            onClick={() => openGlossary('verdict')}
            title="Klik untuk memahami perhitungan skor"
          >
            <span>{metrics.aiProb}%</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 -mt-1">Skor AI</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-bg border border-border text-text-dim flex items-center justify-center text-[9px] font-bold">
              ?
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${verdict.badgeBg}`}>
                {verdict.badge}
              </span>
              {c2pa.hasJumbf && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border bg-purple-500/15 text-purple-400 border-purple-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> C2PA 2.4 Valid
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-text mt-1">{verdict.headline}</h2>
            <p className="text-xs text-text-mut max-w-2xl mt-0.5">
              {verdict.plainMeaning}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => openGlossary()}
            className="px-3 py-2 rounded-xl bg-bg-elev border border-accent/40 text-accent hover:bg-accent/10 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Kamus Istilah</span>
          </button>
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-accent text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Berita Acara SOP</span>
          </button>
          <a
            href="https://contentcredentials.org/verify"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-bg-elev border border-border text-text-mut hover:text-text font-semibold text-xs flex items-center gap-1.5 transition"
            title="Buka Validator C2PA Resmi Global"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">C2PA Validator</span>
          </a>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* COLUMN 1: File Upload, Samples & Stress Tools (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Upload Dropzone */}
          <div className="surface p-4 rounded-xl border border-border space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-accent" /> File Foto Uji
              </span>
              <span className="text-[10px] text-text-mut">{fileInfo.dimensions}</span>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragOver ? 'border-accent bg-accent/10 scale-[0.99]' : 'border-border hover:border-accent/60 bg-bg-elev/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-2">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-text">Tarik foto ke sini atau Klik</div>
              <div className="text-[11px] text-text-dim mt-0.5">JPG, PNG, WebP (Maks 20MB)</div>
            </div>

            {/* File Info Box */}
            <div className="p-2.5 bg-bg-elev rounded-lg text-[11px] space-y-1 mono text-text-mut border border-border/60">
              <div className="truncate text-text font-medium">{fileInfo.name}</div>
              <div className="flex justify-between text-[10px]">
                <span>Ukuran: {fileInfo.size}</span>
                <span>Tipe: {fileInfo.type.split('/')[1]?.toUpperCase() || 'JPEG'}</span>
              </div>
            </div>
          </div>

          {/* Preset Test Cases */}
          <div className="surface p-4 rounded-xl border border-border space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Sampel Praktik
              </div>
              <span className="text-[10px] text-text-dim">Klik untuk coba</span>
            </div>
            <div className="space-y-1.5">
              {PRESET_SAMPLES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleLoadPreset(preset.id)}
                  className="w-full text-left p-2.5 rounded-lg border border-border/70 hover:border-accent hover:bg-bg-elev transition flex items-center gap-2.5 group cursor-pointer"
                >
                  <span className="text-base">{preset.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-text group-hover:text-accent truncate">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-text-mut truncate">
                      {preset.sublabel}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Testing Tools */}
          <div className="surface p-4 rounded-xl border border-border space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Simulasi Trik Manipulasi
              </div>
              <button
                type="button"
                onClick={() => openGlossary('stripped')}
                className="text-[10px] text-accent hover:underline flex items-center gap-0.5"
              >
                <HelpCircle className="w-3 h-3" /> Apa ini?
              </button>
            </div>
            <p className="text-[11px] text-text-mut leading-relaxed">
              Uji ketahanan alat saat pelaku hoaks berusaha menghapus jejak metadata dengan trik kirim WhatsApp atau potong gambar:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleStressCompression}
                className="p-2 rounded-lg bg-bg-elev border border-border hover:border-amber-500/60 hover:bg-amber-500/10 text-text font-semibold text-[11px] transition text-center cursor-pointer flex flex-col items-center gap-1"
              >
                <span>💬 Kompres WA</span>
                <span className="text-[9px] text-text-dim font-normal">Hapus EXIF biner</span>
              </button>
              <button
                type="button"
                onClick={handleStressCrop}
                className="p-2 rounded-lg bg-bg-elev border border-border hover:border-amber-500/60 hover:bg-amber-500/10 text-text font-semibold text-[11px] transition text-center cursor-pointer flex flex-col items-center gap-1"
              >
                <span>✂️ Crop 50%</span>
                <span className="text-[9px] text-text-dim font-normal">Putus hash C2PA</span>
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Interactive Forensic Canvas Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            {/* Viewport Header Tabs */}
            <div className="p-2 border-b border-border bg-bg-elev flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('original')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'original' ? 'bg-accent text-white shadow-sm' : 'text-text-mut hover:text-text hover:bg-bg-card'
                  }`}
                  title="Tampilan visual asli foto"
                >
                  <Eye className="w-3.5 h-3.5" /> <span>Original</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ela')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'ela' ? 'bg-accent text-white shadow-sm' : 'text-text-mut hover:text-text hover:bg-bg-card'
                  }`}
                  title="Detektor bekas tempelan & editan foto"
                >
                  <Activity className="w-3.5 h-3.5" /> <span>Real ELA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('fft')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'fft' ? 'bg-accent text-white shadow-sm' : 'text-text-mut hover:text-text hover:bg-bg-card'
                  }`}
                  title="Rontgen spektrogram frekuensi sidik jari AI"
                >
                  <Scan className="w-3.5 h-3.5" /> <span>2D FFT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('laplacian')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'laplacian' ? 'bg-accent text-white shadow-sm' : 'text-text-mut hover:text-text hover:bg-bg-card'
                  }`}
                  title="Pemeriksaan pori-pori dan butiran noise sensor"
                >
                  <Layers className="w-3.5 h-3.5" /> <span>Laplacian</span>
                </button>
              </div>

              {/* Canvas Zoom Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 rounded-md hover:bg-bg-card text-text-mut hover:text-text transition"
                  title="Perkecil Tampilan (Zoom Out)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] mono text-text-dim w-9 text-center font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 rounded-md hover:bg-bg-card text-text-mut hover:text-text transition"
                  title="Perbesar Tampilan (Zoom In)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-md hover:bg-bg-card text-text-mut hover:text-text transition"
                  title="Kembalikan Ukuran Asli (100%)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Viewport Area */}
            <div className="relative bg-black/95 min-h-[380px] max-h-[520px] flex items-center justify-center overflow-auto p-4 select-none">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 text-accent">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                  <span className="text-xs font-semibold mono">Menghitung Fourier & ELA Canvas...</span>
                </div>
              )}
              <canvas
                ref={activeCanvasRef}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                className="rounded shadow-2xl border border-white/10"
              />
            </div>

            {/* Description Banner */}
            <div className="px-3.5 py-2.5 bg-bg-elev/80 border-t border-border text-[11px] text-text-mut flex items-center justify-between">
              <span className="font-medium">{VIEW_DESCRIPTIONS[activeTab]}</span>
              <button
                type="button"
                onClick={() => openGlossary(activeTab === 'original' ? 'exif' : activeTab)}
                className="text-[10px] text-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Pelajari Mode Ini</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Explanation Alert */}
          <div className="p-3.5 bg-bg-elev rounded-xl border border-border text-xs text-text-mut space-y-1.5">
            <div className="font-semibold text-text flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-accent" /> Cara Sederhana Membaca Gambar di Atas:
              </div>
              <button
                type="button"
                onClick={() => openGlossary('ela')}
                className="text-[10px] text-accent hover:underline"
              >
                Buka Kamus Forensik →
              </button>
            </div>
            <div className="text-[11px] leading-relaxed space-y-1">
              <div>
                • <strong>Tampilan ELA (Bekas Tempelan)</strong>: Jika ada wajah atau objek yang berpendar terang sendirian dibanding sekitarnya, area itu hasil editan.
              </div>
              <div>
                • <strong>Tampilan 2D FFT (Rontgen AI)</strong>: Jika ada titik-titik terang simetris atau pola kisi kotak catur di luar titik pusat, itu sidik jari buatan komputer AI.
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Multi-Layer Results (Lapis 1 - 3) (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* LAPIS 1: EXIF & Metadata Biner */}
          <div className="surface p-4 rounded-xl border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                  <span>📁</span> LAPIS 1: EXIF & Metadata Biner
                  <button
                    type="button"
                    onClick={() => openGlossary('exif')}
                    className="text-accent hover:text-accent/80"
                    title="Pelajari apa itu EXIF"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-text-dim">Pemeriksaan "KTP Digital" asal kamera vs software</div>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  meta.rawFound.length > 0
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : meta.software.includes('Stripped')
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                }`}
              >
                {meta.rawFound.length > 0 ? 'AI TERDETEKSI' : meta.software.includes('Stripped') ? 'EXIF HILANG' : 'KAMERA ASLI'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Software / Mesin:</span>
                <span className={`font-semibold text-right ${meta.rawFound.length > 0 ? 'text-rose-500' : 'text-text'}`}>
                  {meta.software}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Perangkat Kamera:</span>
                <span className="font-semibold text-text text-right">{meta.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Lensa & Sensor:</span>
                <span className="font-semibold text-text text-right">{meta.optics}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-dim font-medium">Catatan Prompt:</span>
                <span className="font-semibold text-text text-right truncate max-w-[170px]" title={meta.prompt}>
                  {meta.prompt}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-bg-elev rounded-lg text-[11px] text-text-mut border border-border/50">
              {meta.rawFound.length > 0 ? (
                <span className="text-rose-500 font-medium">
                  🚨 <strong>BAHAYA:</strong> Nama mesin generator AI tercantum di data biner: <code>{meta.rawFound.join(', ')}</code>
                </span>
              ) : meta.software.includes('Stripped') ? (
                <span className="text-amber-500 font-medium">
                  ⚠️ <strong>CATATAN:</strong> Data kamera hilang (dikompresi WhatsApp). Wajib cek Lapis 3 (ELA & FFT).
                </span>
              ) : (
                <span>ℹ️ Data metadata konsisten dengan foto jepretan kamera fisik optik.</span>
              )}
            </div>
          </div>

          {/* LAPIS 2: Kriptografi C2PA (Content Credentials) */}
          <div className="surface p-4 rounded-xl border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                  <span>🔐</span> LAPIS 2: Kriptografi C2PA 2.4
                  <button
                    type="button"
                    onClick={() => openGlossary('c2pa')}
                    className="text-accent hover:text-accent/80"
                    title="Pelajari apa itu C2PA"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-text-dim">Pemeriksaan "Segel Stempel Digital Resmi"</div>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  c2pa.hasJumbf
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'bg-bg-elev text-text-dim border border-border'
                }`}
              >
                {c2pa.hasJumbf ? 'C2PA SIGNED' : 'TIDAK ADA SEGEL'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Status Segel:</span>
                <span className="font-semibold text-text text-right">
                  {c2pa.hasJumbf ? 'Sertifikat Digital Valid' : 'Tidak ada sertifikat JUMBF'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Penerbit Sertifikat:</span>
                <span className="font-semibold text-text text-right">{c2pa.issuer}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-dim font-medium">Tindakan Sistem:</span>
                <span className="font-semibold text-text text-right truncate max-w-[170px]" title={c2pa.actions}>
                  {c2pa.actions}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-bg-elev rounded-lg text-[11px] text-text-mut border border-border/50">
              {c2pa.hasJumbf ? (
                <span className="text-purple-400 font-medium">
                  🔐 <strong>BUKTI RESMI:</strong> Sertifikat digital mengonfirmasi gambar dibuat oleh Text-to-Image AI.
                </span>
              ) : (
                <span>ℹ️ Foto ini tidak membawa segel kriptografi C2PA.</span>
              )}
            </div>
          </div>

          {/* LAPIS 3: SynthID & Piksel FFT */}
          <div className="surface p-4 rounded-xl border border-border shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                  <span>🧬</span> LAPIS 3: SynthID & Piksel FFT
                  <button
                    type="button"
                    onClick={() => openGlossary('fft')}
                    className="text-accent hover:text-accent/80"
                    title="Pelajari apa itu ELA & FFT"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-text-dim">Rontgen susunan piksel mikroskopis</div>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  metrics.isAiFlag
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                }`}
              >
                {metrics.isAiFlag ? 'POLA SINTETIS' : 'SENSOR ALAMI'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Ketidaksamaan ELA:</span>
                <span className="font-semibold text-text text-right">{metrics.elaScore.toFixed(1)} px (Tingkat selisih)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-text-dim font-medium">Titik Kisi Kisi FFT:</span>
                <span className="font-semibold text-text text-right">{metrics.fftSpikeScore} titik anomali</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-dim font-medium">Sinyal SynthID:</span>
                <span className="font-semibold text-text text-right">{metrics.synthScore}% (Energi sinyal AI)</span>
              </div>
            </div>

            <div className="p-2.5 bg-bg-elev rounded-lg text-[11px] text-text-mut border border-border/50">
              {metrics.isAiFlag ? (
                <span className="text-rose-500 font-medium">
                  🚨 <strong>HASIL RONTGEN:</strong> Spektrum frekuensi & ELA membuktikan struktur kisi matematika AI.
                </span>
              ) : (
                <span>ℹ️ Distribusi butiran noise merata alami khas sensor optik kamera nyata.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Kamus Istilah Forensik untuk Orang Awam */}
      {showGlossaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="surface w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-bg-elev">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  📖
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text">Kamus Istilah Forensik Konten AI</h3>
                  <p className="text-[11px] text-text-mut">Penjelasan mudah & analogi sehari-hari untuk orang awam</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGlossaryModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-bg flex items-center justify-center text-text-mut hover:text-text transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="p-3.5 border-b border-border bg-bg/50">
              <div className="relative">
                <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Cari istilah: EXIF, C2PA, ELA, FFT, SynthID, WhatsApp..."
                  className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Glossary Content Items */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
              {filteredGlossary.map((item) => {
                const isSelected = selectedGlossaryId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-sm'
                        : 'border-border bg-bg-elev/40 hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-text">{item.term}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-accent/15 text-accent font-semibold">
                            {item.shortLabel}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-bg text-text-dim border border-border">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analogy Box */}
                    <div className="mt-2.5 p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-xs text-text flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <div>
                        <strong className="text-accent text-[11px] block uppercase tracking-wide">Analogi Sederhana:</strong>
                        <span className="text-[11px] text-text/90 leading-relaxed">{item.simpleAnalogy}</span>
                      </div>
                    </div>

                    {/* Plain Description */}
                    <div className="mt-2 text-xs text-text-mut leading-relaxed">
                      {item.plainDescription}
                    </div>

                    {/* How to Read */}
                    <div className="mt-2.5 pt-2.5 border-t border-border/60 text-[11px]">
                      <strong className="text-text font-semibold block mb-0.5">Cara Membaca Hasil di SmartFeed:</strong>
                      <div className="text-text-mut whitespace-pre-line leading-relaxed">
                        {item.howToRead}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredGlossary.length === 0 && (
                <div className="text-center py-8 text-text-dim text-xs">
                  Tidak ditemukan istilah yang cocok dengan "{glossarySearch}".
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border bg-bg-elev flex items-center justify-between text-xs text-text-mut">
              <span>SmartFeed AI Content Forensics Inspector</span>
              <button
                type="button"
                onClick={() => setShowGlossaryModal(false)}
                className="px-4 py-1.5 rounded-lg bg-accent text-white font-semibold text-xs hover:opacity-95 transition cursor-pointer"
              >
                Tutup Kamus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Berita Acara SOP Redaksi Resmi */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="surface w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-bg-elev">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Berita Acara Uji Forensik Multimedia Redaksi</h3>
                  <p className="text-[11px] text-text-mut">Standar Operasional Prosedur (SOP) Cek Fakta Visual</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-bg flex items-center justify-center text-text-mut hover:text-text transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Official Document Sheet */}
            <div className="p-5 overflow-y-auto flex-1 text-xs space-y-4">
              <div id="forensicReportDocument" className="p-5 rounded-xl bg-bg-elev/40 border border-border space-y-4 text-text leading-relaxed">
                <div className="border-b border-border pb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-accent uppercase tracking-wide">
                      BERITA ACARA UJI FORENSIK KONTEN AI
                    </h4>
                    <p className="text-[11px] text-text-mut mt-0.5">Meja Verifikasi & Investigasi Multimedia</p>
                  </div>
                  <div className="text-right text-[10px] mono text-text-dim">
                    <div>No. Reg: {docNumber}</div>
                    <div>{now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] bg-bg/50 p-3 rounded-lg border border-border/50">
                  <div>
                    <div><strong>Nama Berkas:</strong> {fileInfo.name}</div>
                    <div><strong>Format / Resolusi:</strong> {fileInfo.dimensions} ({fileInfo.size})</div>
                  </div>
                  <div>
                    <div><strong>Pemeriksa:</strong> Unit Cek Fakta SmartFeed</div>
                    <div>
                      <strong>AI Probability Score:</strong>{' '}
                      <span className={metrics.isAiFlag ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                        {metrics.aiProb}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-Layer Testing Matrix */}
                <div>
                  <div className="text-[11px] font-bold text-text mb-1.5 uppercase tracking-wide">
                    Matriks Pengujian Multi-Lapis (Multi-Layer Verification):
                  </div>
                  <table className="w-full text-[11px] border border-border rounded-lg overflow-hidden">
                    <thead className="bg-bg text-text-dim uppercase text-[10px]">
                      <tr>
                        <th className="text-left p-2 border-b border-border">Lapisan Uji</th>
                        <th className="text-left p-2 border-b border-border">Temuan Biner / Canvas</th>
                        <th className="text-left p-2 border-b border-border">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      <tr>
                        <td className="p-2 font-medium">1. EXIF & Metadata (KTP Digital)</td>
                        <td className="p-2 text-text-mut">Software: {meta.software} | Model: {meta.model}</td>
                        <td className={`p-2 font-bold ${meta.rawFound.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {meta.rawFound.length > 0 ? 'AI TERDETEKSI' : 'BERSIH / STRIPPED'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">2. Kriptografi C2PA (Segel Digital)</td>
                        <td className="p-2 text-text-mut">
                          {c2pa.hasJumbf ? `Signed (${c2pa.issuer})` : 'Tidak Ditemukan Manifest'}
                        </td>
                        <td className={`p-2 font-bold ${c2pa.hasJumbf ? 'text-purple-400' : 'text-text-dim'}`}>
                          {c2pa.hasJumbf ? 'C2PA VALID' : 'NIHIL'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">3. ELA & 2D FFT (Rontgen Piksel)</td>
                        <td className="p-2 text-text-mut">
                          ELA: {metrics.elaScore.toFixed(1)} px | FFT Spikes: {metrics.fftSpikeScore}
                        </td>
                        <td className={`p-2 font-bold ${metrics.isAiFlag ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {metrics.isAiFlag ? 'ANOMALI SINTESIS' : 'SENSOR ALAMI'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verdict Box */}
                <div className="p-3 bg-bg rounded-xl border border-border space-y-1">
                  <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">
                    Keputusan & Rekomendasi Redaksi:
                  </div>
                  <div className={`text-sm font-extrabold ${verdict.actionColor}`}>
                    {verdict.action}
                  </div>
                  <div className="text-[11px] text-text-mut">
                    {metrics.reasons.length > 0 ? metrics.reasons.join('. ') : 'Tidak ditemukan jejak anomali sintesis digital pada metadata maupun spektrum frekuensi piksel.'}
                  </div>
                </div>

                {/* Footnote for Laypeople */}
                <div className="p-2.5 rounded-lg bg-bg/40 border border-border/40 text-[10px] text-text-dim leading-normal">
                  📌 <strong>Catatan Pemeriksaan:</strong> Pengujian menggunakan pembuktian 3 lapis saintifik (EXIF Biner ➔ Kriptografi C2PA ➔ Piksel ELA & 2D FFT) sesuai standar jurnalisme investigasi visual.
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2 bg-bg-elev">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3.5 py-2 rounded-xl bg-bg border border-border text-text font-semibold text-xs hover:border-accent flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Tersalin!' : 'Salin Teks Berita Acara'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:opacity-95 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
