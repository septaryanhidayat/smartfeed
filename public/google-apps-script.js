/**
 * ==============================================================================
 * SMARTFEED — GOOGLE APPS SCRIPT WEBHOOK, AUTO-EMAIL & DATABASE HANDLER (V3.0)
 * ==============================================================================
 * 
 * CARA MEMASANG / UPDATE DI GOOGLE SPREADSHEET:
 * 1. Buka Google Spreadsheet Anda.
 * 2. Klik menu: Extensions (Ekstensi) > Apps Script.
 * 3. Hapus semua isi kode lama, lalu PASTE SEMUA kode di bawah ini.
 * 4. Klik icon Save (Simpan).
 * 5. Klik tombol: Deploy (Terapkan) > Manage Deployments (Kelola Penerapan).
 * 6. Klik icon Pensil (Edit) pada deployment aktif:
 *    - Version: New Version (Versi baru).
 *    - Execute as: Me.
 *    - Who has access: Anyone (Siapa saja).
 * 7. Klik Deploy.
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
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
    var amount = data.amount || data.total_amount || 0;
    var paymentMethod = data.payment_method || data.payment_name || 'TriPay';
    var merchantRef = data.merchant_ref || data.reference || ('TRX-' + new Date().getTime());
    var now = new Date();

    // ─────────────────────────────────────────────────────────────
    // 1. EVENT TRIPAY PAYMENT SUCCESS
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'tripay_payment_success' || data.status === 'PAID') {
      
      // A. Simpan ke Tab "Users"
      var userSheet = getOrCreateSheet(ss, 'Users', ['Email', 'Nama', 'No HP', 'Status', 'Metode Bayar', 'Tanggal Daftar', 'Terakhir Aktif']);
      if (email) {
        saveOrUpdateUser(userSheet, {
          email: email,
          name: name,
          phone: phone,
          status: 'Active',
          source: paymentMethod,
          created_at: now,
          last_active: now
        });
      }

      // B. Sinkronkan juga ke Tab Pertama (Sheet1 / gid=0) agar CSV Publish selalu update
      var firstSheet = ss.getSheets()[0];
      if (firstSheet && firstSheet.getName() !== 'Transactions' && firstSheet.getName() !== 'Activity_Logs') {
        saveOrUpdateUser(firstSheet, {
          email: email,
          name: name,
          phone: phone,
          status: 'Active',
          source: paymentMethod,
          created_at: now,
          last_active: now
        });
      }

      // C. Simpan ke Tab "Transactions"
      var trxSheet = getOrCreateSheet(ss, 'Transactions', ['Merchant Ref', 'Reference', 'Email', 'Nama', 'No HP', 'Nominal', 'Metode Bayar', 'Waktu Bayar', 'Status']);
      if (!isTransactionExists(trxSheet, merchantRef)) {
        trxSheet.appendRow([
          data.merchant_ref || '-',
          data.reference || '-',
          email,
          name,
          phone,
          amount,
          paymentMethod,
          now,
          'PAID'
        ]);
      }

      // D. Kirim Email Notifikasi Akses Otomatis ke Pembeli
      if (email && email.includes('@')) {
        sendBuyerWelcomeEmail(email, name, amount, paymentMethod, merchantRef);
      }

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'TriPay payment recorded, user activated, and welcome email sent.'
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

      // Sinkron ke tab pertama
      var firstSheet = ss.getSheets()[0];
      if (firstSheet && firstSheet.getName() !== 'Transactions' && firstSheet.getName() !== 'Activity_Logs') {
        saveOrUpdateUser(firstSheet, {
          email: email,
          name: name,
          phone: phone,
          status: 'Active',
          source: data.source || 'Registrasi',
          created_at: now,
          last_active: now
        });
      }

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        is_new: isNew,
        message: isNew ? 'Akun baru berhasil didaftarkan.' : 'Akun sudah terdaftar (data diperbarui).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. EVENT ACTIVITY LOGS
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

      if (email && email !== 'anonim') {
        var userSheet = ss.getSheetByName('Users') || ss.getSheets()[0];
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

    // Default fallback jika ada email
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
// KIRIM EMAIL OTOMATIS KE PEMBELI (WELCOME EMAIL)
// ─────────────────────────────────────────────────────────────
function sendBuyerWelcomeEmail(email, name, amount, method, ref) {
  try {
    var subject = '🎉 Pembayaran Berhasil! Akses SmartFeed AI Studio Anda Sudah Aktif';
    var displayName = name ? name : 'Sahabat SmartFeed';
    var formattedAmount = Number(amount).toLocaleString('id-ID');

    var htmlBody = ''
      + '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0d12; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">'
      + '  <div style="background: linear-gradient(135deg, #ef4444, #991b1b); padding: 30px 24px; text-align: center;">'
      + '    <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">SmartFeed AI Studio</h1>'
      + '    <p style="margin: 6px 0 0; font-size: 14px; color: #fecaca;">Akses Seumur Hidup (Lifetime) · 20 Engine Kreatif</p>'
      + '  </div>'
      + '  <div style="padding: 28px 24px; background-color: #12131a;">'
      + '    <p style="font-size: 16px; color: #f4f4f5; margin-top: 0;">Halo <strong>' + displayName + '</strong>,</p>'
      + '    <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">Terima kasih atas pembelian Anda! Pembayaran sebesar <strong>Rp ' + formattedAmount + '</strong> via <strong>' + method + '</strong> (Ref: ' + ref + ') telah kami terima dan diverifikasi secara otomatis.</p>'
      + '    <div style="background-color: #1a1b26; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0;">'
      + '      <h3 style="margin: 0 0 12px; font-size: 15px; color: #60a5fa;">🔑 Detail Akses Login Anda:</h3>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Email:</strong> <span style="color: #fbbf24;">' + email + '</span></p>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Password Default:</strong> <span style="font-family: monospace; background: #27272a; padding: 2px 6px; border-radius: 4px; color: #4ade80;">SmartFeedOKE</span></p>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Status:</strong> <span style="color: #4ade80; font-weight: bold;">Aktif Permanen</span></p>'
      + '    </div>'
      + '    <div style="text-align: center; margin: 30px 0;">'
      + '      <a href="https://smartfeed.berandadigital.net/app" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block;">🚀 Masuk ke Studio SmartFeed Sekarang</a>'
      + '    </div>'
      + '    <p style="font-size: 12px; color: #71717a; line-height: 1.5; border-top: 1px solid #27272a; padding-top: 16px;">Jika ada kendala login atau pertanyaan teknis, silakan hubungi tim support kami via WhatsApp di <strong>0896-9524-9089</strong> atau email <strong>info@berandadigital.net</strong>.</p>'
      + '  </div>'
      + '</div>';

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (emailErr) {
    Logger.log('Gagal kirim email: ' + emailErr.toString());
  }
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function saveOrUpdateUser(sheet, user) {
  var lastRow = sheet.getLastRow();
  var email = user.email.toLowerCase().trim();

  if (lastRow > 1) {
    var emailsRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < emailsRange.length; i++) {
      var rowEmail = (emailsRange[i][0] || '').toString().toLowerCase().trim();
      if (rowEmail === email) {
        var rowNumber = i + 2;
        if (user.name) sheet.getRange(rowNumber, 2).setValue(user.name);
        if (user.phone) sheet.getRange(rowNumber, 3).setValue(user.phone);
        sheet.getRange(rowNumber, 4).setValue('Active');
        if (user.source) sheet.getRange(rowNumber, 5).setValue(user.source);
        sheet.getRange(rowNumber, 7).setValue(user.last_active);
        return false;
      }
    }
  }

  sheet.appendRow([
    email,
    user.name || '',
    user.phone || '',
    user.status || 'Active',
    user.source || 'SmartFeed',
    user.created_at,
    user.last_active
  ]);
  return true;
}

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
