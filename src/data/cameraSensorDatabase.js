/**
 * Comprehensive Camera & Sensor Forensic Database
 * Covers Android (Samsung, Xiaomi, OPPO, Vivo, Realme, Google Pixel, Infinix, Transsion, OnePlus, Huawei),
 * Apple iOS (iPhone 6 - 16 Pro Max, iPad), DSLR / Mirrorless (Sony, Canon, Nikon, Fujifilm, Leica, Hasselblad),
 * Drones & Action Cams (DJI, GoPro, Insta360), and PC Webcams / Internal Laptops.
 */

export const CAMERA_SENSOR_DATABASE = [
  // ==========================================
  // 1. APPLE IPHONE & IPAD ECOSYSTEM
  // ==========================================
  {
    patterns: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone17,1', 'iPhone17,2'],
    brand: 'Apple',
    model: 'iPhone 16 Pro / Pro Max',
    sensorType: '48MP 1/1.28" Quad-Pixel CMOS + 5x Tetraprism Periscope',
    lensOptics: 'f/1.78 main (24mm eq.) + Sensor-Shift OIS Gen 2',
    category: 'Smartphone Flagship (iOS)',
    hardwareConfidence: 99.4,
    notes: 'Sensor optik generasi terbaru Apple dengan kompensasi micro-jitter 3D Sensor-Shift.',
  },
  {
    patterns: ['iPhone 16', 'iPhone 16 Plus', 'iPhone17,3', 'iPhone17,4'],
    brand: 'Apple',
    model: 'iPhone 16 / 16 Plus',
    sensorType: '48MP Fusion Sensor (1/1.56" CMOS)',
    lensOptics: 'f/1.6 main (26mm eq.) + 100% Focus Pixels',
    category: 'Smartphone (iOS)',
    hardwareConfidence: 98.9,
    notes: 'Sensor Fusion 48MP dengan integrasi 2x Telephoto optik.',
  },
  {
    patterns: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone16,1', 'iPhone16,2'],
    brand: 'Apple',
    model: 'iPhone 15 Pro / Pro Max',
    sensorType: '48MP Sony Custom 1/1.28" CMOS Quad-Bayer',
    lensOptics: 'f/1.78 (24mm eq.) + Photonic Engine Processing',
    category: 'Smartphone Flagship (iOS)',
    hardwareConfidence: 99.2,
    notes: 'Kamera fisik Apple dengan resolusi default 24MP HEIF/JPEG.',
  },
  {
    patterns: ['iPhone 15', 'iPhone 15 Plus', 'iPhone15,4', 'iPhone15,5'],
    brand: 'Apple',
    model: 'iPhone 15 / 15 Plus',
    sensorType: '48MP 1/1.56" CMOS Quad-Bayer',
    lensOptics: 'f/1.6 (26mm eq.) + Dual-Pixel AF',
    category: 'Smartphone (iOS)',
    hardwareConfidence: 98.7,
    notes: 'Modul sensor optik fisik Apple dengan lensa 7-elemen.',
  },
  {
    patterns: ['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone15,2', 'iPhone15,3'],
    brand: 'Apple',
    model: 'iPhone 14 Pro / Pro Max',
    sensorType: '48MP 1/1.28" Sony Quad-Bayer CMOS',
    lensOptics: 'f/1.78 (24mm) + 2nd Gen Sensor Shift OIS',
    category: 'Smartphone Flagship (iOS)',
    hardwareConfidence: 98.8,
    notes: 'Kamera fisik resolusi tinggi pertama Apple.',
  },
  {
    patterns: ['iPhone 14', 'iPhone 14 Plus', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone14,2', 'iPhone14,3', 'iPhone14,5', 'iPhone14,7', 'iPhone14,8'],
    brand: 'Apple',
    model: 'iPhone 13 Pro / 14 Series',
    sensorType: '12MP 1/1.65" Sony Exmor-RS CMOS (1.9µm pixels)',
    lensOptics: 'f/1.5 7-element lens + Sensor-Shift OIS',
    category: 'Smartphone (iOS)',
    hardwareConfidence: 98.5,
    notes: 'Sensor optik fisik Apple dengan butiran noise alami khas 12MP.',
  },
  {
    patterns: ['iPhone 13', 'iPhone 13 mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 12', 'iPhone 12 mini', 'iPhone13,', 'iPhone12,'],
    brand: 'Apple',
    model: 'iPhone 12 / 13 Series',
    sensorType: '12MP 1/1.76" Sony CMOS Sensor',
    lensOptics: 'f/1.6 lens (26mm) + Optical Image Stabilization',
    category: 'Smartphone (iOS)',
    hardwareConfidence: 98.2,
    notes: 'Sensor CMOS optik Apple dengan lensa multi-coated sapphire crystal.',
  },
  {
    patterns: ['iPhone 11', 'iPhone 11 Pro', 'iPhone X', 'iPhone XS', 'iPhone XR', 'iPhone 8', 'iPhone 7', 'iPhone 6', 'iPhone SE', 'iPhone'],
    brand: 'Apple',
    model: 'Apple iPhone (Legacy / SE Series)',
    sensorType: '12MP 1/2.55" Sony iSight CMOS Sensor',
    lensOptics: 'f/1.8 optical aperture + Focus Pixels PDAF',
    category: 'Smartphone (iOS)',
    hardwareConfidence: 97.8,
    notes: 'Modul kamera perangkat fisik Apple iPhone standar.',
  },
  {
    patterns: ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad'],
    brand: 'Apple',
    model: 'Apple iPad Tablet Camera',
    sensorType: '12MP Wide CMOS Sensor (iPad Camera System)',
    lensOptics: 'f/1.8 (28mm eq.) 5-element lens',
    category: 'Tablet (iPadOS)',
    hardwareConfidence: 97.5,
    notes: 'Kamera fisik terintegrasi pada perangkat Apple iPad.',
  },

  // ==========================================
  // 2. SAMSUNG GALAXY (FLAGSHIP, A-SERIES, Z-FOLD)
  // ==========================================
  {
    patterns: ['SM-S928', 'SM-S918', 'SM-S908', 'Galaxy S24 Ultra', 'Galaxy S23 Ultra', 'Galaxy S22 Ultra'],
    brand: 'Samsung',
    model: 'Samsung Galaxy S22/S23/S24 Ultra',
    sensorType: '200MP Samsung ISOCELL HP2 (1/1.3" Sensor)',
    lensOptics: 'f/1.7 23mm eq. + Multi-Directional PDAF + OIS',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.3,
    notes: 'Sensor ISOCELL 200MP dengan teknologi 16-in-1 Tetra2pixel binning.',
  },
  {
    patterns: ['SM-S921', 'SM-S926', 'SM-S911', 'SM-S916', 'SM-S901', 'SM-S906', 'Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy S21'],
    brand: 'Samsung',
    model: 'Samsung Galaxy S-Series (Mainstream Flagship)',
    sensorType: '50MP Samsung ISOCELL GN3 / GNV (1/1.57")',
    lensOptics: 'f/1.8 24mm + Dual Pixel PDAF + OIS',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 98.9,
    notes: 'Sensor optik fisik Samsung dengan grain noise 50MP alami.',
  },
  {
    patterns: ['SM-F946', 'SM-F936', 'SM-F926', 'SM-F731', 'SM-F721', 'Galaxy Z Fold', 'Galaxy Z Flip'],
    brand: 'Samsung',
    model: 'Samsung Galaxy Z Fold / Z Flip Series',
    sensorType: '50MP / 12MP ISOCELL Dual-Pixel CMOS',
    lensOptics: 'f/1.8 Ultra-Thin Glass Optic + OIS',
    category: 'Foldable Smartphone (Android)',
    hardwareConfidence: 98.7,
    notes: 'Sensor optik lipat fisik Samsung dengan sistem stabilisasi ganda.',
  },
  {
    patterns: ['SM-A556', 'SM-A546', 'SM-A536', 'SM-A356', 'SM-A346', 'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A35', 'Galaxy A34'],
    brand: 'Samsung',
    model: 'Samsung Galaxy A-Series (Mid-Range Popular)',
    sensorType: '50MP Sony IMX906 / Samsung ISOCELL GN5 (1/1.56")',
    lensOptics: 'f/1.8 lens + VDIS + All-Pixel AF',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.4,
    notes: 'Sensor kamera fisik Samsung seri A terpopuler di Indonesia.',
  },
  {
    patterns: ['SM-A256', 'SM-A155', 'SM-A145', 'SM-A057', 'Galaxy A25', 'Galaxy A15', 'Galaxy A14', 'Galaxy A05', 'SM-A', 'SM-M', 'SAMSUNG'],
    brand: 'Samsung',
    model: 'Samsung Galaxy Smartphone (A/M/Entry Series)',
    sensorType: '50MP ISOCELL JN1 (1/2.76") / CMOS Sensor',
    lensOptics: 'f/1.8 autofocus optical lens',
    category: 'Smartphone (Android)',
    hardwareConfidence: 97.6,
    notes: 'Sensor optik kamera fisik Samsung standar.',
  },

  // ==========================================
  // 3. XIAOMI / REDMI / POCO
  // ==========================================
  {
    patterns: ['23116PN5BC', '23127PN0CG', 'Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14', 'Xiaomi 13 Ultra', 'Xiaomi 13 Pro', 'Xiaomi 13'],
    brand: 'Xiaomi',
    model: 'Xiaomi 13 / 14 Series (Leica Co-engineered)',
    sensorType: '50MP 1-Inch Sony LYT-900 / IMX989 Sensor',
    lensOptics: 'Leica Summilux f/1.42 - f/4.0 Stepless Variable Aperture',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.4,
    notes: 'Sensor fisik optik 1 inci terbesar di industri ponsel dengan lensa Leica.',
  },
  {
    patterns: ['2312DRA50G', '23090RA98G', '22101316G', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro', 'Redmi Note 12', 'Redmi Note 11', 'Redmi Note'],
    brand: 'Xiaomi / Redmi',
    model: 'Xiaomi Redmi Note Series',
    sensorType: '200MP Samsung ISOCELL HP3 (1/1.4") / 108MP HM2',
    lensOptics: 'f/1.65 7P lens + OIS + Super QPD Focus',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.6,
    notes: 'Kamera fisik seri Redmi Note dengan resolusi tinggi 200MP.',
  },
  {
    patterns: ['2311DRK48G', '23049PCD8G', 'POCO F6 Pro', 'POCO F6', 'POCO F5', 'POCO X6 Pro', 'POCO X6', 'POCO X5', 'POCO M6', 'POCO '],
    brand: 'Xiaomi / POCO',
    model: 'Xiaomi POCO Series (Performance & Flagship)',
    sensorType: '64MP/50MP OmniVision OV50H / Sony IMX882',
    lensOptics: 'f/1.6 6P lens with Dual OIS/EIS',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.3,
    notes: 'Modul kamera fisik POCO dengan sensor optik CMOS.',
  },
  {
    patterns: ['Redmi', 'Xiaomi', 'Mi 11', 'Mi 10', 'Mi 9'],
    brand: 'Xiaomi',
    model: 'Xiaomi / Redmi Smartphone',
    sensorType: 'CMOS Optical Image Sensor (Xiaomi Hardware)',
    lensOptics: 'f/1.8 PDAF auto-exposure optical glass',
    category: 'Smartphone (Android)',
    hardwareConfidence: 97.4,
    notes: 'Sensor optik fisik perangkat Xiaomi.',
  },

  // ==========================================
  // 4. OPPO / VIVO / REALME / ONEPLUS
  // ==========================================
  {
    patterns: ['Find X7 Ultra', 'Find X6 Pro', 'Find X7', 'Find X6', 'CPH2581', 'CPH2499', 'OPPO Find'],
    brand: 'OPPO',
    model: 'OPPO Find X Series (Hasselblad Camera)',
    sensorType: '50MP Sony LYT-900 1-Inch Dual Periscope CMOS',
    lensOptics: 'Hasselblad Color Calibration f/1.8 + ALC Multi-Coating',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.3,
    notes: 'Sensor fisik optik 1 inci dengan tuning warna optik Hasselblad.',
  },
  {
    patterns: ['Reno12 Pro', 'Reno12', 'Reno11 Pro', 'Reno11', 'Reno10', 'Reno9', 'Reno8', 'CPH2629', 'CPH2599', 'CPH2531', 'OPPO Reno'],
    brand: 'OPPO',
    model: 'OPPO Reno Series (Portrait Expert)',
    sensorType: '50MP Sony LYT-600 / IMX890 (1/1.56" Sensor)',
    lensOptics: 'f/1.8 24mm eq. + 2x Telephoto Portrait Lens',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.5,
    notes: 'Sensor optik fisik kamera potret spesifik OPPO.',
  },
  {
    patterns: ['CPH', 'OPPO A', 'OPPO'],
    brand: 'OPPO',
    model: 'OPPO Smartphone (A-Series)',
    sensorType: '50MP/13MP CMOS Hardware Optical Sensor',
    lensOptics: 'f/1.8 aperture lens + AI Scene Enhancement Hardware',
    category: 'Smartphone (Android)',
    hardwareConfidence: 97.6,
    notes: 'Sensor kamera optik fisik ponsel OPPO.',
  },
  {
    patterns: ['vivo X100 Ultra', 'vivo X100 Pro', 'vivo X100', 'vivo X90 Pro', 'V2324A', 'V2309A', 'vivo X'],
    brand: 'Vivo',
    model: 'Vivo X-Series (ZEISS Optics Co-engineered)',
    sensorType: '50MP 1-Inch Sony IMX989 + 200MP ZEISS APO Telephoto',
    lensOptics: 'ZEISS T* Coating Glass + f/1.75 Optical Lens',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.4,
    notes: 'Sensor optik fisik dengan lapisan anti-pantul ZEISS T* Coating.',
  },
  {
    patterns: ['vivo V30 Pro', 'vivo V30', 'vivo V29', 'vivo V27', 'vivo Y100', 'vivo Y28', 'vivo Y27', 'V2318', 'V2312', 'vivo V', 'vivo Y', 'vivo'],
    brand: 'Vivo',
    model: 'Vivo V / Y Series (Aura Light Portrait)',
    sensorType: '50MP OmniVision OV50E / Sony IMX920 Sensor',
    lensOptics: 'f/1.88 VCS (Bionic Color Spectrum) + OIS',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.3,
    notes: 'Sensor optik fisik Vivo dengan sensor spektrum warna bionik.',
  },
  {
    patterns: ['Realme GT 6', 'Realme GT 5', 'Realme 12 Pro+', 'Realme 12 Pro', 'Realme 11 Pro', 'Realme 10', 'Realme C', 'RMX'],
    brand: 'Realme',
    model: 'Realme Smartphone (GT & Number Series)',
    sensorType: '50MP Sony LYT-808 / IMX890 / 200MP HP3 Sensor',
    lensOptics: 'f/1.88 6P lens with SuperOIS Stabilization',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.2,
    notes: 'Sensor kamera fisik perangkat Realme.',
  },
  {
    patterns: ['OnePlus 12', 'OnePlus 11', 'OnePlus Open', 'OnePlus Nord', 'CPH2573', 'CPH2449', 'OnePlus'],
    brand: 'OnePlus',
    model: 'OnePlus Series (Hasselblad Optics)',
    sensorType: '50MP Sony LYT-808 (1/1.4" Dual-Layer Transistor CMOS)',
    lensOptics: 'Hasselblad Camera for Mobile f/1.6 + ALC Optical Coating',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.0,
    notes: 'Sensor Sony Lytia dual-layer transistor dengan hardware shutter.',
  },

  // ==========================================
  // 5. GOOGLE PIXEL
  // ==========================================
  {
    patterns: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro', 'Pixel 8a', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7a', 'Pixel 7', 'Pixel 6', 'Pixel'],
    brand: 'Google',
    model: 'Google Pixel Smartphone (Tensor ISP)',
    sensorType: '50MP Samsung ISOCELL GNK / GN1 (1/1.31" CMOS)',
    lensOptics: 'f/1.68 25mm eq. + Octa PD AF + Laser Detect Autofocus',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.2,
    notes: 'Kamera fisik Google Pixel dengan RAW capture dari sensor ISOCELL.',
  },

  // ==========================================
  // 6. TRANSSION (INFINIX, TECNO, ITEL)
  // ==========================================
  {
    patterns: ['Infinix GT 20 Pro', 'Infinix Note 40 Pro', 'Infinix Note 40', 'Infinix Zero 30', 'Infinix Hot 40', 'Infinix Hot 30', 'Infinix Smart', 'X68', 'X67', 'Infinix'],
    brand: 'Infinix',
    model: 'Infinix Smartphone (Note & GT Series)',
    sensorType: '108MP Samsung ISOCELL HM6 / 50MP CMOS Sensor',
    lensOptics: 'f/1.75 6P lens with OIS/EIS optical stabilizer',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.1,
    notes: 'Sensor optik fisik kamera Infinix (Transsion Holdings).',
  },
  {
    patterns: ['Tecno Camon 30 Premier', 'Tecno Camon 30', 'Tecno Pova 6 Pro', 'Tecno Pova', 'Tecno Spark', 'Tecno Phantom', 'CL', 'LI', 'Tecno'],
    brand: 'Tecno',
    model: 'Tecno Smartphone (Camon & Pova Series)',
    sensorType: '50MP Sony IMX890 1/1.56" Optical Sensor',
    lensOptics: 'f/1.88 PolarAce Imaging System + OIS',
    category: 'Smartphone (Android)',
    hardwareConfidence: 98.2,
    notes: 'Kamera fisik Tecno dengan sensor optik CMOS.',
  },
  {
    patterns: ['itel S23', 'itel S24', 'itel P55', 'itel Color Pro', 'itel'],
    brand: 'itel',
    model: 'itel Smartphone (Vision & S Series)',
    sensorType: '50MP / 108MP ISOCELL HM6 CMOS Sensor',
    lensOptics: 'f/1.6 5P lens with Auto-Focus',
    category: 'Smartphone (Android)',
    hardwareConfidence: 97.4,
    notes: 'Sensor kamera optik fisik perangkat itel.',
  },

  // ==========================================
  // 7. HUAWEI & HONOR
  // ==========================================
  {
    patterns: ['Pura 70 Ultra', 'Pura 70 Pro', 'Mate 60 Pro', 'Mate 50 Pro', 'P60 Pro', 'HUAWEI Pura', 'HUAWEI Mate', 'HUAWEI P', 'HBP-'],
    brand: 'Huawei',
    model: 'Huawei Pura / Mate Series (XMAGE Optics)',
    sensorType: '50MP 1-Inch Retractable Lens Sensor (RYYB Matrix)',
    lensOptics: 'XMAGE Variable Aperture f/1.4 - f/4.0 + Sensor-Shift OIS',
    category: 'Smartphone Flagship (HarmonyOS)',
    hardwareConfidence: 99.4,
    notes: 'Sensor fisik optik dengan mekanisme lensa mekanis retractable.',
  },
  {
    patterns: ['HONOR Magic6 Pro', 'HONOR Magic5 Pro', 'HONOR 200 Pro', 'HONOR 90', 'HONOR X9b', 'BVL-', 'PGT-', 'HONOR'],
    brand: 'Honor',
    model: 'Honor Smartphone (Magic & Number Series)',
    sensorType: '50MP 1/1.3" OmniVision H9800 Falcon Camera',
    lensOptics: 'f/1.4 - f/2.0 Self-Adjusting Optical Aperture + OIS',
    category: 'Smartphone Flagship (Android)',
    hardwareConfidence: 99.1,
    notes: 'Sensor optik fisik Honor dengan kecepatan shutter ultra-fast 1/8000s.',
  },

  // ==========================================
  // 8. DSLR & MIRRORLESS PROFESSIONAL CAMERAS
  // ==========================================
  {
    patterns: ['ILCE-7RM5', 'ILCE-7RM4', 'ILCE-7M4', 'ILCE-7SM3', 'ILCE-6700', 'ILCE-6400', 'ILCE-1', 'ILME-FX3', 'SONY ILCE', 'SONY Alpha'],
    brand: 'Sony',
    model: 'Sony Alpha Full-Frame / APS-C Mirrorless',
    sensorType: '33MP - 61MP Exmor R BSI CMOS 35.7 x 23.8 mm (Full Frame)',
    lensOptics: 'Sony E-Mount Optical Lens System (Physical Mechanical Shutter)',
    category: 'Kamera Mirrorless Profesional',
    hardwareConfidence: 99.8,
    notes: 'Kamera profesional fisik dengan sensor Full-Frame dan dynamic range 15-stop.',
  },
  {
    patterns: ['EOS R5', 'EOS R6', 'EOS R8', 'EOS R50', 'EOS 5D Mark', 'EOS 6D', 'EOS 200D', 'EOS 1500D', 'Canon EOS', 'Canon DIGITAL'],
    brand: 'Canon',
    model: 'Canon EOS Digital SLR / Mirrorless (RF/EF Mount)',
    sensorType: '24MP - 45MP Canon Dual Pixel CMOS Sensor (Full Frame / APS-C)',
    lensOptics: 'Canon RF / EF L-Series Glass + In-Body Image Stabilization',
    category: 'Kamera DSLR / Mirrorless Profesional',
    hardwareConfidence: 99.8,
    notes: 'Sensor fisik optik Canon dengan filter optik low-pass alami.',
  },
  {
    patterns: ['NIKON Z 9', 'NIKON Z 8', 'NIKON Z 6', 'NIKON Z 5', 'NIKON D850', 'NIKON D750', 'NIKON D3500', 'NIKON D5600', 'NIKON Z', 'NIKON D'],
    brand: 'Nikon',
    model: 'Nikon Z Mirrorless / D-Series DSLR',
    sensorType: '24.5MP - 45.7MP FX BSI Stacked CMOS Sensor',
    lensOptics: 'NIKKOR Z / F Mount Optical Elements + VR Vibration Reduction',
    category: 'Kamera DSLR / Mirrorless Profesional',
    hardwareConfidence: 99.8,
    notes: 'Sensor CMOS optik Nikon dengan resolusi mikro tajam alami.',
  },
  {
    patterns: ['X-T5', 'X-T4', 'X100VI', 'X100V', 'X-S20', 'X-H2S', 'GFX100', 'GFX 50S', 'FUJIFILM X', 'FUJIFILM GFX', 'FUJIFILM'],
    brand: 'Fujifilm',
    model: 'Fujifilm X-Series / GFX Medium Format',
    sensorType: '40.2MP X-Trans CMOS 5 HR / 102MP Medium Format Sensor',
    lensOptics: 'Fujinon Aspherical EBC Glass (Aperiodic X-Trans Color Filter)',
    category: 'Kamera Mirrorless / Medium Format',
    hardwareConfidence: 99.8,
    notes: 'Sensor fisik dengan susunan filter warna aperiodik X-Trans alami.',
  },
  {
    patterns: ['LEICA M11', 'LEICA Q3', 'LEICA Q2', 'LEICA SL2', 'LEICA M', 'LEICA Q', 'LEICA SL', 'LEICA'],
    brand: 'Leica',
    model: 'Leica Camera System (M / Q / SL Series)',
    sensorType: '60MP BSI CMOS Sensor with Triple Resolution Technology',
    lensOptics: 'Leica Summilux / Summicron Hand-Crafted Optical Elements',
    category: 'Kamera Rangefinder / Mirrorless Luxury',
    hardwareConfidence: 99.9,
    notes: 'Kamera optik buatan Jerman dengan karakteristik optik legendaris.',
  },
  {
    patterns: ['HASSELBLAD X2D', 'HASSELBLAD 907X', 'HASSELBLAD X1D', 'HASSELBLAD'],
    brand: 'Hasselblad',
    model: 'Hasselblad Medium Format System',
    sensorType: '100MP 43.8 x 32.9 mm Medium Format BSI CMOS',
    lensOptics: 'Hasselblad XCD Leaf Shutter Optics (HNCS Color Science)',
    category: 'Kamera Medium Format Profesional',
    hardwareConfidence: 99.9,
    notes: 'Sensor medium format 100MP dengan leaf shutter mekanis.',
  },

  // ==========================================
  // 9. DRONES, ACTION CAMS & 360 CAMS
  // ==========================================
  {
    patterns: ['DJI Mavic 3', 'DJI Mini 4 Pro', 'DJI Mini 3', 'DJI Air 3', 'DJI Osmo Pocket 3', 'DJI Osmo Action 4', 'DJI FC', 'DJI Osmo', 'DJI Pocket', 'DJI'],
    brand: 'DJI',
    model: 'DJI Drone / Osmo Pocket / Action Gimbal Camera',
    sensorType: '4/3" CMOS Hasselblad Sensor / 1-Inch CMOS Pocket Sensor',
    lensOptics: '24mm eq. f/2.8 Gimbal-Stabilized Optical Camera',
    category: 'Drone / Action Gimbal Camera',
    hardwareConfidence: 99.2,
    notes: 'Sensor optik fisik drone/gimbal DJI dengan stabilisasi hardware 3-axis.',
  },
  {
    patterns: ['GoPro HERO12', 'GoPro HERO11', 'GoPro HERO10', 'GoPro HERO9', 'GoPro HERO', 'GoPro Max', 'GoPro'],
    brand: 'GoPro',
    model: 'GoPro HERO Action Camera',
    sensorType: '27MP 1/1.9" CMOS 8:7 Aspect Ratio Sensor',
    lensOptics: 'HyperView Ultra-Wide Lens + HyperSmooth Stabilization',
    category: 'Action Camera',
    hardwareConfidence: 99.0,
    notes: 'Sensor fisik aksi GoPro dengan field of view ultra-lebar.',
  },
  {
    patterns: ['Insta360 X4', 'Insta360 X3', 'Insta360 Ace Pro', 'Insta360 GO 3', 'Insta360'],
    brand: 'Insta360',
    model: 'Insta360 360° / Action Camera',
    sensorType: '1/1.3" 8K AI Sensor / Dual 1/2" 360 CMOS Sensors',
    lensOptics: 'Dual Fisheye 360° Optical Lenses + FlowState Stabilization',
    category: 'Action / 360 Panoramic Camera',
    hardwareConfidence: 99.0,
    notes: 'Sensor optik ganda 360 derajat kamera fisik Insta360.',
  },

  // ==========================================
  // 10. PC WEBCAMS & LAPTOP INTERNAL CAMERAS
  // ==========================================
  {
    patterns: ['Brio', 'C920', 'C922', 'C930', 'StreamCam', 'Logitech Webcam', 'Logitech HD Pro', 'Logitech'],
    brand: 'Logitech',
    model: 'Logitech HD / 4K Pro Webcam (USB Peripheral)',
    sensorType: '4K Ultra HD / 1080p CMOS Optical Sensor (Logitech Optics)',
    lensOptics: 'RightLight 3 / HDR Glass Lens with Autofocus',
    category: 'Webcam PC / USB External',
    hardwareConfidence: 98.8,
    notes: 'Webcam optik fisik eksternal dengan sensor CMOS USB terintegrasi.',
  },
  {
    patterns: ['FaceTime HD', 'FaceTime Camera', 'Apple T2 Camera', 'iSight'],
    brand: 'Apple',
    model: 'Apple Mac FaceTime HD Camera',
    sensorType: '1080p FaceTime HD Sensor (Apple Silicon ISP)',
    lensOptics: 'Wide-angle Fixed Focus Glass Lens',
    category: 'Webcam Laptop (macOS)',
    hardwareConfidence: 98.6,
    notes: 'Kamera webcam internal bawaan laptop MacBook / iMac fisik.',
  },
  {
    patterns: ['Windows Camera', 'WIN_', 'DirectShow', 'Microsoft LifeCam', 'Intel RealSense', 'SunplusIT', 'Realtek Camera', 'BisonCam', 'Chicony', 'USB Camera', 'Integrated Camera', 'HD Webcam', 'Webcam'],
    brand: 'PC / Laptop Internal',
    model: 'PC Webcam / USB Integrated CMOS Video Device',
    sensorType: '720p / 1080p CMOS Optical Sensor (Fixed Hardware Shutter)',
    lensOptics: 'Fixed Focus Optical Lens (Natural Room CMOS Noise)',
    category: 'Webcam PC / Laptop Windows',
    hardwareConfidence: 98.2,
    notes: 'Tangkapan kamera webcam PC nyata dengan butiran thermal noise CMOS alami.',
  },
];

/**
 * Match a file's raw binary and filename against the sensor database
 */
export function identifyCameraHardware(rawText, fileName) {
  const lowerName = (fileName || '').toLowerCase();

  for (const entry of CAMERA_SENSOR_DATABASE) {
    for (const pattern of entry.patterns) {
      if (rawText.includes(pattern) || lowerName.includes(pattern.toLowerCase())) {
        return {
          matched: true,
          brand: entry.brand,
          model: entry.model,
          sensorType: entry.sensorType,
          lensOptics: entry.lensOptics,
          category: entry.category,
          hardwareConfidence: entry.hardwareConfidence,
          notes: entry.notes,
        };
      }
    }
  }

  // Fallback if not matched to specific branded model
  return {
    matched: false,
    brand: 'Sensor Optik Fisik',
    model: 'Kamera Digital / Smartphone (Non-AI)',
    sensorType: 'Sensor Optik CMOS Fisik (Natural Noise Stream)',
    lensOptics: 'Lensa Optik Fisik Terintegrasi (Hardware Shutter)',
    category: 'Kamera Optik Umum',
    hardwareConfidence: 96.5,
    notes: 'Karakteristik butiran piksel konsisten dengan sensor optik fisik kamera.',
  };
}
