/**
 * ==============================================================================
 * SMARTFEED — GOOGLE APPS SCRIPT WEBHOOK & ANTI-DUPLICATE DATABASE HANDLER
 * ==============================================================================
 * 
 * CARA PAKAI DI GOOGLE SPREADSHEET:
 * 1. Buka Google Spreadsheet Anda (tempat menyimpan email login SmartFeed).
 * 2. Klik menu: Extensions (Ekstensi) > Apps Script.
 * 3. Hapus semua kode lama, lalu Paste SEMUA kode di bawah ini.
 * 4. Klik icon Save (Simpan).
 * 5. Klik tombol: Deploy (Terapkan) > New Deployment (Terapkan Baru).
 * 6. Pilih tipe: Web App.
 *    - Description: SmartFeed Webhook v2 (Anti Duplicate)
 *    - Execute as: Me (email akun Anda)
 *    - Who has access: Anyone (Siapa saja)
 * 7. Klik Deploy dan salin URL Web App yang dihasilkan.
 * 
 * FITUR UTAMA:
 * - Anti-Double Record: Email yang sama TIDAK AKAN PERNAH dicatat dobel.
 * - Auto-Deduplication: Jika sudah terdaftar, data hanya diperbarui (update).
 * - Multi-Tab Otomatis:
 *     * Tab "Users" : Menyimpan daftar akun aktif (untuk login & CSV).
 *     * Tab "Transactions" : Menyimpan riwayat pembayaran TriPay resmi.
 *     * Tab "Activity_Logs" : Menyimpan log aktivitas studio tanpa mengotori tab Users.
 * - Fungsi Pembersihan: Tersedia tombol run "cleanupDuplicates()" untuk menghapus data duplikat lama.
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci proses selama max 15 detik untuk mencegah tabrakan data serentak (race condition)
    lock.waitLock(15000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Server sedang sibuk, silakan coba lagi.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawData = e.postData ? e.postData.contents : '';
    var data = {};

    try {
      data = JSON.parse(rawData);
    } catch (parseErr) {
      data = e.parameter || {};
    }

    var eventType = data.type || data.event || 'register';
    var email = (data.email || data.customer_email || '').toString().toLowerCase().trim();
    var name = (data.name || data.customer_name || '').toString().trim();
    var phone = (data.phone || data.customer_phone || '').toString().trim();
    var now = new Date();

    // ─────────────────────────────────────────────────────────────
    // 1. EVENT TRIPAY PAYMENT SUCCESS
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'tripay_payment_success' || data.status === 'PAID') {
      // Simpan / Update di Sheet "Users"
      var userSheet = getOrCreateSheet(ss, 'Users', ['Email', 'Nama', 'No HP', 'Status', 'Metode Bayar', 'Tanggal Daftar', 'Terakhir Aktif']);
      if (email) {
        saveOrUpdateUser(userSheet, {
          email: email,
          name: name,
          phone: phone,
          status: 'Active',
          source: data.payment_method || data.payment_name || 'TriPay',
          created_at: now,
          last_active: now
        });
      }

      // Catat di Sheet "Transactions"
      var trxSheet = getOrCreateSheet(ss, 'Transactions', ['Merchant Ref', 'Reference', 'Email', 'Nama', 'No HP', 'Nominal', 'Metode Bayar', 'Waktu Bayar', 'Status']);
      var ref = data.merchant_ref || data.reference || ('TRX-' + now.getTime());
      
      // Cek apakah transaksi sudah pernah dicatat (anti-double trx)
      if (!isTransactionExists(trxSheet, ref)) {
        trxSheet.appendRow([
          data.merchant_ref || '-',
          data.reference || '-',
          email,
          name,
          phone,
          data.amount || data.total_amount || 0,
          data.payment_method || data.payment_name || '-',
          now,
          'PAID'
        ]);
      }

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'TriPay payment recorded and user activated without duplicates.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────
    // 2. EVENT REGISTER / KLAIM AKSES
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'register') {
      if (!email) {
        lock.releaseLock();
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Email wajib disertakan.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var userSheet = getOrCreateSheet(ss, 'Users', ['Email', 'Nama', 'No HP', 'Status', 'Sumber', 'Tanggal Daftar', 'Terakhir Aktif']);
      var isNew = saveOrUpdateUser(userSheet, {
        email: email,
        name: name,
        phone: phone,
        status: 'Active',
        source: data.source || 'Registrasi',
        created_at: now,
        last_active: now
      });

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        is_new: isNew,
        message: isNew ? 'Akun baru berhasil didaftarkan.' : 'Akun sudah terdaftar (data diperbarui).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. EVENT ACTIVITY LOGS (TIDAK MENGOTORI SHEET USERS)
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'activity') {
      var logSheet = getOrCreateSheet(ss, 'Activity_Logs', ['Waktu', 'Email', 'Nama', 'Aksi', 'Tool / Mode', 'Detail']);
      logSheet.appendRow([
        now,
        email || 'anonim',
        name || '-',
        data.action || '-',
        data.tool || '-',
        data.details || '-'
      ]);

      // Update kolom Terakhir Aktif di sheet Users jika user terdaftar
      if (email && email !== 'anonim') {
        var userSheet = ss.getSheetByName('Users');
        if (userSheet) {
          updateUserLastActive(userSheet, email, now);
        }
      }

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Activity log saved.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default Fallback: catat user jika ada email
    if (email) {
      var userSheet = getOrCreateSheet(ss, 'Users', ['Email', 'Nama', 'No HP', 'Status', 'Sumber', 'Tanggal Daftar', 'Terakhir Aktif']);
      saveOrUpdateUser(userSheet, {
        email: email,
        name: name,
        phone: phone,
        status: 'Active',
        source: data.source || 'Webhook',
        created_at: now,
        last_active: now
      });
    }

    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Request processed.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    if (lock) lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var userSheet = ss.getSheetByName('Users') || ss.getSheets()[0];
  var count = userSheet ? Math.max(0, userSheet.getLastRow() - 1) : 0;
  return ContentService.createTextOutput(JSON.stringify({
    status: 'SmartFeed Database Webhook is Online',
    total_active_users: count,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS (ANTI-DUPLICATE CORE)
// ─────────────────────────────────────────────────────────────

/**
 * Menyimpan user baru atau mengupdate user jika email sudah ada.
 * Mengembalikan true jika user baru, false jika user lama diupdate.
 */
function saveOrUpdateUser(sheet, user) {
  var lastRow = sheet.getLastRow();
  var email = user.email.toLowerCase().trim();

  if (lastRow > 1) {
    var emailsRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < emailsRange.length; i++) {
      var rowEmail = (emailsRange[i][0] || '').toString().toLowerCase().trim();
      if (rowEmail === email) {
        // User SUDAH ADA -> UPDATE baris (Jangan buat baris baru!)
        var rowNumber = i + 2;
        if (user.name) sheet.getRange(rowNumber, 2).setValue(user.name);
        if (user.phone) sheet.getRange(rowNumber, 3).setValue(user.phone);
        sheet.getRange(rowNumber, 4).setValue('Active');
        if (user.source) sheet.getRange(rowNumber, 5).setValue(user.source);
        sheet.getRange(rowNumber, 7).setValue(user.last_active);
        return false; // Bukan user baru
      }
    }
  }

  // User BELUM ADA -> Tambahkan baris baru
  sheet.appendRow([
    email,
    user.name || '',
    user.phone || '',
    user.status || 'Active',
    user.source || 'SmartFeed',
    user.created_at,
    user.last_active
  ]);
  return true; // User baru
}

/**
 * Update waktu terakhir aktif user tanpa membuat baris baru.
 */
function updateUserLastActive(sheet, email, time) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;
  var emailsRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < emailsRange.length; i++) {
    if ((emailsRange[i][0] || '').toString().toLowerCase().trim() === email) {
      sheet.getRange(i + 2, 7).setValue(time);
      break;
    }
  }
}

/**
 * Cek apakah referensi transaksi sudah pernah dicatat.
 */
function isTransactionExists(sheet, ref) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var refRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < refRange.length; i++) {
    if ((refRange[i][0] || '').toString() === ref) {
      return true;
    }
  }
  return false;
}

/**
 * Mengambil sheet yang ada atau membuat baru dengan header otomatis.
 */
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f4f6');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * ==============================================================================
 * FUNGSI PEMBERSIH DUPLIKAT SEKALI KLIK (RUN FUNCTION)
 * ==============================================================================
 * Jalankan fungsi ini dari Google Apps Script Editor untuk membersihkan
 * semua data email ganda/dobel yang sudah terlanjur ada di sheet Anda!
 */
function cleanupDuplicates() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Users') || ss.getSheets()[0];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 2) {
    Logger.log('Data terlalu sedikit untuk dibersihkan.');
    return;
  }

  var data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  var seenEmails = {};
  var cleanRows = [];
  var duplicatesCount = 0;

  for (var i = 0; i < data.length; i++) {
    var email = (data[i][0] || '').toString().toLowerCase().trim();
    if (!email || !email.includes('@')) continue;

    if (!seenEmails[email]) {
      seenEmails[email] = true;
      cleanRows.push(data[i]);
    } else {
      duplicatesCount++;
    }
  }

  if (duplicatesCount > 0) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    sheet.getRange(2, 1, cleanRows.length, cleanRows[0].length).setValues(cleanRows);
    Logger.log('BERHASIL! ' + duplicatesCount + ' data duplikat telah dibersihkan. Tersisa ' + cleanRows.length + ' akun unik.');
  } else {
    Logger.log('Tidak ditemukan data duplikat. Database sudah bersih!');
  }
}
