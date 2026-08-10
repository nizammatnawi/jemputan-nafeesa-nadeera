/**
 * ============================================================
 *  UCAPAN TETAMU — Majlis Aqiqah & Sambutan Hari Lahir
 *  Puteri Nafeesa & Puteri Nadeera
 *
 *  Backend ringkas: Google Apps Script + Google Sheets.
 *  Salin keseluruhan fail ini ke editor Apps Script.
 *  Panduan penuh: PANDUAN.md
 * ============================================================
 */

/** Nama helaian (tab) dalam Google Sheet anda. */
var SHEET_NAME = 'Ucapan';

/** Bilangan maksimum ucapan yang boleh diminta dalam satu permintaan. */
var MAX_WISHES = 200;

/** Had input (sama seperti di laman web). */
var MAX_NAME = 100;
var MAX_MESSAGE = 300;
var MAX_WORDS = 50;

/** Tempoh (minit) untuk menganggap penghantaran serupa sebagai pendua. */
var DUPLICATE_WINDOW_MINUTES = 5;

/** Susunan lajur (jangan ubah tanpa mengubah kod di bawah). */
var HEADERS = [
  'Timestamp',  // A — tarikh & masa
  'Name',       // B — nama tetamu
  'Message',    // C — ucapan
  'Status',     // D — SHOW atau HIDE
  'ID',         // E — ID penghantaran (elak rekod berganda)
];

var STATUS_SHOW = 'SHOW';
var STATUS_HIDE = 'HIDE';

/* ------------------------------------------------------------------ */
/*  API                                                                */
/* ------------------------------------------------------------------ */

/**
 * GET — memulangkan senarai ucapan awam.
 * Contoh: .../exec?action=wishes&limit=7
 *
 * PENTING: hanya baris berstatus SHOW dipulangkan,
 * dan hanya medan name, message serta timestamp.
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};

    if (params.action === 'wishes') {
      var limit = Math.min(parseInt(params.limit, 10) || 6, MAX_WISHES);
      return jsonResponse({ ok: true, wishes: getPublicWishes(limit) });
    }

    return jsonResponse({ ok: true, message: 'API Ucapan Tetamu sedia berfungsi.' });
  } catch (error) {
    return jsonResponse({ ok: false, error: 'SERVER_ERROR' });
  }
}

/**
 * POST — menyimpan satu ucapan baharu.
 * Badan permintaan ialah JSON yang dihantar sebagai text/plain
 * (supaya tiada "preflight" CORS berlaku).
 *
 * Status ditetapkan SHOW secara automatik — tiada kelulusan manual diperlukan.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    // Elak dua penghantaran serentak menulis pada baris yang sama
    lock.waitLock(20000);

    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Dikemaskan dahulu TANPA dipotong — supaya ucapan yang terlalu panjang
    // ditolak dengan jelas, bukan dipotong separuh jalan tanpa disedari tetamu
    var name = cleanText(body.name);
    var message = cleanText(body.message);
    var submissionId = cleanText(body.submissionId).slice(0, 60);

    // --- Pengesahan input ---
    if (!name) return jsonResponse({ ok: false, error: 'INVALID_NAME' });
    if (!message) return jsonResponse({ ok: false, error: 'INVALID_MESSAGE' });
    if (name.length > MAX_NAME) {
      return jsonResponse({ ok: false, error: 'NAME_TOO_LONG' });
    }
    if (countWords(message) > MAX_WORDS) {
      return jsonResponse({ ok: false, error: 'TOO_MANY_WORDS' });
    }
    if (message.length > MAX_MESSAGE) {
      return jsonResponse({ ok: false, error: 'MESSAGE_TOO_LONG' });
    }

    var sheet = getSheet();

    // --- Perlindungan rekod berganda ---
    // 1) ID penghantaran yang sama (butang ditekan dua kali / rangkaian cuba semula)
    if (submissionId && hasSubmissionId(sheet, submissionId)) {
      return jsonResponse({ ok: true, duplicate: true });
    }
    // 2) Nama + ucapan yang sama dalam tempoh beberapa minit
    if (hasRecentDuplicate(sheet, name, message)) {
      return jsonResponse({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date(), name, message, STATUS_SHOW, submissionId]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: 'SERVER_ERROR' });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

/* ------------------------------------------------------------------ */
/*  Fungsi pembantu                                                    */
/* ------------------------------------------------------------------ */

/** Buka helaian Ucapan; cipta bersama tajuk lajur jika belum wujud. */
function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Ambil ucapan terkini yang berstatus SHOW sahaja, terbaharu dahulu.
 *
 * Inilah tapisan yang menjadikan Google Sheets sebagai panel moderasi anda:
 *  - Tukar Status kepada HIDE  → ucapan hilang daripada laman
 *  - Tukar kembali kepada SHOW → ucapan muncul semula
 *  - Padam baris                → ucapan hilang terus
 */
function getPublicWishes(limit) {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var wishes = [];

  // Baca dari bawah ke atas — rekod terbaharu dahulu
  for (var i = values.length - 1; i >= 0 && wishes.length < limit; i--) {
    var row = values[i];

    var name = String(row[1] || '').trim();
    var message = String(row[2] || '').trim();
    var status = String(row[3] || '').trim().toUpperCase();

    if (!name || !message) continue;
    // Baris yang bukan SHOW (contoh: HIDE) tidak dipaparkan
    if (status !== STATUS_SHOW) continue;

    wishes.push({
      name: name,
      message: message,
      timestamp: row[0] ? new Date(row[0]).toISOString() : null,
    });
  }

  return wishes;
}

/** Adakah ID penghantaran ini sudah direkodkan? */
function hasSubmissionId(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var ids = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === submissionId) return true;
  }
  return false;
}

/** Adakah nama + ucapan yang sama baru sahaja dihantar? */
function hasRecentDuplicate(sheet, name, message) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var cutoff = Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000;
  var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();

  for (var i = values.length - 1; i >= 0; i--) {
    var rowDate = values[i][0] ? new Date(values[i][0]).getTime() : 0;
    if (rowDate < cutoff) break; // baris lebih lama — berhenti mencari

    var sameName = String(values[i][1] || '').trim().toLowerCase() === name.toLowerCase();
    var sameMessage = String(values[i][2] || '').trim().toLowerCase() === message.toLowerCase();

    if (sameName && sameMessage) return true;
  }

  return false;
}

/** Kira bilangan patah perkataan. */
function countWords(text) {
  var trimmed = String(text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Buang aksara kawalan dan kemaskan ruang berlebihan.
 * Baris baharu (\n) dikekalkan supaya ucapan berbilang baris kekal kemas.
 *
 * Nota: fungsi ini TIDAK memotong panjang teks. Pemotongan senyap akan
 * menghilangkan sebahagian ucapan tetamu tanpa mereka sedar — jadi
 * panjang disemak berasingan dan ditolak dengan jelas jika melebihi had.
 */
function cleanText(value) {
  var text = String(value === null || value === undefined ? '' : value);

  text = text.replace(/\r\n?/g, '\n');                  // seragamkan baris baharu
  text = text.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, ''); // aksara kawalan (kekalkan \n)
  text = text.replace(/[ \t]+/g, ' ');                  // ruang berulang
  text = text.replace(/ *\n */g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');               // hadkan baris kosong berturutan

  return text.trim();
}

/** Balasan JSON. Apps Script menambah header CORS secara automatik. */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
