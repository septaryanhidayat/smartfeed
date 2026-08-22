/**
 * ==============================================================================
 * SMARTFEED — GOOGLE APPS SCRIPT WEBHOOK, REALTIME AUTH & DATABASE (V3.3)
 * ==============================================================================
 * 
 * CARA UPDATE DI GOOGLE SPREADSHEET:
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
  return handleIncomingWebhook(e, true);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. CEK OTENTIKASI REALTIME (UNTUK LOGIN STUDIO INSTAN TANPA DELAY)
  if (e && e.parameter && (e.parameter.action === 'list' || e.parameter.action === 'check' || e.parameter.get_users === '1')) {
    var userSheet = ss.getSheetByName('Users') || ss.getSheets()[0];
    var lastRow = userSheet ? userSheet.getLastRow() : 0;
    var emails = [];

    if (lastRow > 1) {
      var data = userSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < data.length; i++) {
        var em = (data[i][0] || '').toString().toLowerCase().trim();
        if (em && em.includes('@') && !emails.includes(em)) {
          emails.push(em);
        }
      }
    }

    if (e.parameter.action === 'check') {
      var targetEmail = (e.parameter.email || '').toString().toLowerCase().trim();
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        allowed: emails.includes(targetEmail),
        email: targetEmail
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      emails: emails,
      total: emails.length
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. JIKA ADA PARAMETER REGISTRASI / BAYAR VIA GET
  if (e && e.parameter && (e.parameter.email || e.parameter.customer_email)) {
    return handleIncomingWebhook(e, false);
  }

  // 3. STATUS DEFAULT WEBHOOK
  var userSheet = ss.getSheetByName('Users') || ss.getSheets()[0];
  var count = userSheet ? Math.max(0, userSheet.getLastRow() - 1) : 0;
  return ContentService.createTextOutput(JSON.stringify({
    status: 'SmartFeed Database Webhook is Online',
    total_active_users: count,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleIncomingWebhook(e, isPost) {
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
    var rawData = (e && e.postData) ? e.postData.contents : '';
    var data = {};

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (parseErr) {
        data = {};
      }
    }

    // Merge parameter GET jika ada
    if (e && e.parameter) {
      for (var k in e.parameter) {
        if (!data[k]) data[k] = e.parameter[k];
      }
    }

    var eventType = data.type || data.event || 'register';
    var email = (data.email || data.customer_email || '').toString().toLowerCase().trim();
    var name = (data.name || data.customer_name || '').toString().trim();
    var phone = (data.phone || data.customer_phone || '').toString().trim();
    var amount = data.amount || data.total_amount || 0;
    var paymentMethod = data.payment_method || data.payment_name || data.source || ((eventType === 'register' || eventType === 'free_training') ? 'Peserta Pelatihan (Gratis)' : 'TriPay');
    var merchantRef = data.merchant_ref || data.reference || ('TRX-' + new Date().getTime());
    var now = new Date();

    // ─────────────────────────────────────────────────────────────
    // 0. JIKA EVENT TYPE = 'activity' (CATAT KE TAB "Riwayat Aktivitas")
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'activity') {
      var actSheet = getOrCreateSheet(ss, 'Riwayat Aktivitas', ['Waktu', 'Email Peserta', 'Nama Peserta', 'Tool / Mode', 'Aksi', 'Keterangan']);
      actSheet.appendRow([
        now,
        email || 'anonim',
        name || '-',
        data.tool || data.mode || '-',
        data.action || '-',
        data.details || data.label || '-'
      ]);

      // Update kolom 'Terakhir Aktif' di tab Users jika email ditemukan
      if (email && email.includes('@')) {
        var uSheet = ss.getSheetByName('Users');
        if (uSheet) {
          var uLastRow = uSheet.getLastRow();
          if (uLastRow > 1) {
            var uEmails = uSheet.getRange(2, 1, uLastRow - 1, 1).getValues();
            for (var u = 0; u < uEmails.length; u++) {
              if ((uEmails[u][0] || '').toString().toLowerCase().trim() === email) {
                uSheet.getRange(u + 2, 7).setValue(now);
                break;
              }
            }
          }
        }
      }

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        type: 'activity',
        message: 'Aktivitas berhasil dicatat ke Riwayat Aktivitas.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!email || !email.includes('@')) {
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Email tidak valid atau kosong.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. SIMPAN KE TAB "Users" (UNTUK MANAJEMEN USER)
    // ─────────────────────────────────────────────────────────────
    var userSheet = getOrCreateSheet(ss, 'Users', ['Email', 'Nama', 'No HP', 'Status', 'Metode Bayar', 'Tanggal Daftar', 'Terakhir Aktif']);
    saveOrUpdateUser(userSheet, {
      email: email,
      name: name,
      phone: phone,
      status: 'Active',
      source: paymentMethod,
      created_at: now,
      last_active: now
    });

    // ─────────────────────────────────────────────────────────────
    // 2. SIMPAN JUGA KE TAB PERTAMA AGAR CSV PUBLISH SELALU AKTIF
    // ─────────────────────────────────────────────────────────────
    var firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getName() !== 'Transactions' && firstSheet.getName() !== 'Riwayat Aktivitas') {
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

    // ─────────────────────────────────────────────────────────────
    // 3. CATAT TRANSAKSI JIKA EVENT TRIPAY / STATUS PAID
    // ─────────────────────────────────────────────────────────────
    if (eventType === 'tripay_payment_success' || data.status === 'PAID' || eventType === 'paid') {
      var trxSheet = getOrCreateSheet(ss, 'Transactions', ['Merchant Ref', 'Reference', 'Email', 'Nama', 'No HP', 'Nominal', 'Metode Bayar', 'Waktu Bayar', 'Status']);
      if (!isTransactionExists(trxSheet, merchantRef)) {
        trxSheet.appendRow([
          data.merchant_ref || merchantRef,
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

      // ─────────────────────────────────────────────────────────────
      // 4. KIRIM EMAIL NOTIFIKASI AKSES OTOMATIS KE INBOX PEMBELI
      // ─────────────────────────────────────────────────────────────
      sendBuyerWelcomeEmail(email, name, amount, paymentMethod, merchantRef);
    }

    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      email: email,
      message: 'Data berhasil disimpan ke Spreadsheet dan notifikasi email telah diproses.'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    if (lock) lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────
// PENGIRIMAN EMAIL OTOMATIS KE PEMBELI (WELCOME EMAIL)
// ─────────────────────────────────────────────────────────────
function sendBuyerWelcomeEmail(email, name, amount, method, ref) {
  try {
    var subject = '🎉 Akses SmartFeed AI Studio Anda Sudah Aktif!';
    var displayName = name ? name : 'Sahabat SmartFeed';
    var formattedAmount = (amount && Number(amount) > 0) ? Number(amount).toLocaleString('id-ID') : '1.000';

    var htmlBody = ''
      + '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0d12; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">'
      + '  <div style="background: linear-gradient(135deg, #ef4444, #991b1b); padding: 30px 24px; text-align: center;">'
      + '    <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">SmartFeed AI Studio</h1>'
      + '    <p style="margin: 6px 0 0; font-size: 14px; color: #fecaca;">Akses Seumur Hidup (Lifetime) · 20 Engine Kreatif</p>'
      + '  </div>'
      + '  <div style="padding: 28px 24px; background-color: #12131a;">'
      + '    <p style="font-size: 16px; color: #f4f4f5; margin-top: 0;">Halo <strong>' + displayName + '</strong>,</p>'
      + '    <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">Terima kasih! Pembayaran Anda sebesar <strong>Rp ' + formattedAmount + '</strong> via <strong>' + (method || 'TriPay') + '</strong> telah berhasil diverifikasi.</p>'
      + '    <div style="background-color: #1a1b26; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0;">'
      + '      <h3 style="margin: 0 0 12px; font-size: 15px; color: #60a5fa;">🔑 Detail Akses Login Anda:</h3>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Email:</strong> <span style="color: #fbbf24; font-weight: bold;">' + email + '</span></p>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Password Default:</strong> <span style="font-family: monospace; background: #27272a; padding: 3px 8px; border-radius: 4px; color: #4ade80; font-weight: bold;">SmartFeedOKE</span></p>'
      + '      <p style="margin: 6px 0; font-size: 14px; color: #ffffff;"><strong>Status Akun:</strong> <span style="color: #4ade80; font-weight: bold;">Aktif Permanen (Lifetime)</span></p>'
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
// HELPER FUNCTIONS (ANTI-DUPLICATE)
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
