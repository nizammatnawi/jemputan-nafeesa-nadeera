import { GOOGLE_SCRIPT_URL } from '../config.js'

/**
 * Penghubung antara laman jemputan dan Google Apps Script (Google Sheets).
 *
 * NOTA CORS (penting):
 * Google Apps Script tidak menjawab permintaan "preflight" (OPTIONS).
 * Oleh itu POST dihantar sebagai `text/plain` — ini dikira "simple request"
 * oleh pelayar, jadi tiada preflight berlaku. Apps Script membaca badan
 * permintaan melalui e.postData.contents dan memprosesnya sebagai JSON.
 */

export const isWishesConfigured = Boolean(GOOGLE_SCRIPT_URL)

/** Had input — sama seperti yang disemak semula di Apps Script. */
export const LIMITS = {
  name: 100,
  words: 50,
  chars: 300,
}

/** Kira bilangan patah perkataan (ruang berturutan dikira sebagai satu). */
export function countWords(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/** Semak borang sebelum dihantar. Pulangkan objek ralat mengikut medan. */
export function validateWish({ name, message }) {
  const errors = {}

  const cleanName = String(name || '').trim()
  const cleanMessage = String(message || '').trim()

  if (!cleanName) {
    errors.name = 'Sila isi nama anda.'
  } else if (cleanName.length > LIMITS.name) {
    errors.name = `Nama terlalu panjang (maksimum ${LIMITS.name} aksara).`
  }

  // Tolak ucapan kosong atau ruang kosong sahaja
  if (!cleanMessage) {
    errors.message = 'Sila tulis ucapan atau doa anda.'
  } else if (countWords(cleanMessage) > LIMITS.words || cleanMessage.length > LIMITS.chars) {
    // Mesej sama untuk kedua-dua had (perkataan & aksara) supaya lebih mesra
    errors.message =
      'Ucapan anda terlalu panjang. Sila ringkaskan kepada maksimum 50 patah perkataan.'
  }

  return errors
}

/** ID unik bagi setiap penghantaran — mengelakkan rekod berganda. */
function createSubmissionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** Hantar satu ucapan ke Google Sheets. */
export async function submitWish({ name, message }) {
  if (!isWishesConfigured) throw new Error('BELUM_DISEDIAKAN')

  const payload = {
    submissionId: createSubmissionId(),
    name: String(name).trim().slice(0, LIMITS.name),
    message: String(message).trim().slice(0, LIMITS.chars),
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    // text/plain mengelakkan preflight CORS (lihat nota di atas)
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })

  if (!response.ok) throw new Error('GAGAL_HANTAR')

  const result = await response.json()
  if (!result || result.ok !== true) throw new Error('GAGAL_HANTAR')

  return { ok: true }
}

/**
 * Ambil senarai ucapan awam.
 * Apps Script hanya memulangkan baris yang berstatus SHOW,
 * dan hanya medan name, message serta timestamp.
 */
export async function fetchWishes(limit = 7) {
  if (!isWishesConfigured) return []

  const url = `${GOOGLE_SCRIPT_URL}?action=wishes&limit=${encodeURIComponent(limit)}&t=${Date.now()}`
  const response = await fetch(url, { redirect: 'follow' })

  if (!response.ok) throw new Error('GAGAL_MUAT')

  const result = await response.json()
  if (!result || !Array.isArray(result.wishes)) throw new Error('GAGAL_MUAT')

  return result.wishes
}

/** Tarikh mesra: "Baru sahaja", "5 minit lalu", atau tarikh penuh. */
export function relativeDate(isoString) {
  const then = new Date(isoString)
  if (Number.isNaN(then.getTime())) return ''

  const diffSeconds = Math.floor((Date.now() - then.getTime()) / 1000)

  if (diffSeconds < 60) return 'Baru sahaja'
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minit lalu`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} jam lalu`
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} hari lalu`

  return then.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
}
