/**
 * ============================================================
 *  FAIL KONFIGURASI UTAMA
 *  Semua maklumat majlis & pautan boleh diubah di sini sahaja.
 *  Tidak perlu menyentuh fail-fail lain.
 * ============================================================
 */

/* ---------- PAUTAN (GANTIKAN DENGAN PAUTAN SEBENAR ANDA) ---------- */

// Pautan Google Maps ke lokasi majlis
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=169%2C+Jalan+Anggerik+3%2F1%2C+Saujana+Utama'

// Pautan Waze ke lokasi majlis
export const WAZE_URL =
  'https://waze.com/ul?q=169%20Jalan%20Anggerik%203%2F1%20Saujana%20Utama&navigate=yes'

// Nombor WhatsApp tuan rumah (format: https://wa.me/60XXXXXXXXX)
export const WHATSAPP_URL = 'https://wa.me/60132824979'

/**
 * Mesej sedia tulis untuk butang "Hubungi Tuan Rumah".
 * Tetamu memilih satu, dan WhatsApp dibuka dengan mesej sudah terisi.
 * Tiada data kehadiran disimpan di laman ini — ia hanya jalan pintas WhatsApp.
 */
export const CONTACT_REPLIES = [
  {
    id: 'hadir',
    label: 'Insya-Allah, saya akan hadir',
    icon: '🌸',
    message:
      'Assalamualaikum. Terima kasih atas jemputan. Insya-Allah saya akan hadir ke ' +
      'Majlis Aqiqah & Sambutan Hari Lahir Puteri Nafeesa dan Puteri Nadeera.',
  },
  {
    id: 'tidak_hadir',
    label: 'Maaf, saya tidak dapat hadir',
    icon: '🤍',
    message:
      'Assalamualaikum. Terima kasih atas jemputan. Maaf, saya tidak dapat hadir ke ' +
      'Majlis Aqiqah & Sambutan Hari Lahir Puteri Nafeesa dan Puteri Nadeera.',
  },
]

// Pautan "Simpan Tarikh" (Google Calendar) — sudah diisi dengan tarikh majlis
export const GOOGLE_CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Majlis+Aqiqah+%26+Sambutan+Hari+Lahir+Puteri+Nafeesa+%26+Puteri+Nadeera' +
  '&dates=20260829T030000Z/20260829T083000Z' +
  '&details=Kehadiran+dan+doa+anda+sekeluarga+amat+kami+hargai.' +
  '&location=169%2C+Jalan+Anggerik+3%2F1%2C+Saujana+Utama'

// URL Google Apps Script Web App (tempat ucapan tetamu disimpan).
// Cara dapatkan: lihat google-apps-script/PANDUAN.md — langkah "Deploy > Web app".
// Bentuknya: https://script.google.com/macros/s/AKfycbXXXXXXXXXXXX/exec
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwIB-zNWTNDWo0VS2anFf0RjL6GOhHpY9eoj2NnwPN8ZLFENrTFX00zRRxZAjEP4Jn8hw/exec'

/* ---------- TARIKH & MASA MAJLIS (waktu Malaysia, UTC+8) ---------- */

export const EVENT_START = '2026-08-29T11:00:00+08:00'
export const EVENT_END = '2026-08-29T16:30:00+08:00'

/* ---------- MAKLUMAT MAJLIS ---------- */

export const EVENT = {
  title: 'Majlis Aqiqah & Sambutan Hari Lahir',
  dayLabel: 'Sabtu',
  dateLabel: '29 Ogos 2026',
  timeLabel: '11.00 Pagi – 4.30 Petang',
  addressLine1: '169, Jalan Anggerik 3/1',
  addressLine2: 'Saujana Utama',
  host: 'Daripada kami sekeluarga',
}

/* ---------- TUAN RUMAH (dipaparkan di bawah kata-kata jemputan) ---------- */

export const HOSTS = {
  intro: 'Daripada Kami,',
  names: ['Mohd Khairul Nizam Mat Nawi', 'Erfa Shahira Ab Malek'],
  suffix: 'sekeluarga.',
}

export const CHILDREN = [
  {
    name: 'Puteri Nafeesa',
    shortName: 'Nafeesa',
    birthLabel: '7 Ogos 2023',
    celebration: 'Menyambut Ulang Tahun Ke-3',
    heroLabel: 'Puteri Nafeesa — 3 Tahun',
    heroImage: '/nafeesa bertudung.JPG',
    cardImage: '/nafeesa 2nd.JPG',
  },
  {
    name: 'Puteri Nadeera',
    shortName: 'Nadeera',
    birthLabel: '23 Ogos 2025',
    celebration: 'Majlis Aqiqah & Ulang Tahun Ke-1',
    heroLabel: 'Puteri Nadeera — 1 Tahun',
    heroImage: '/nadeera bertudung.JPG',
    cardImage: '/nadeera 2nd.jpeg',
  },
]

/* ---------- ATURCARA MAJLIS ---------- */
/* Tambah, buang atau ubah slot di bawah mengikut keperluan. */

export const PROGRAMME = [
  {
    time: '11.00 pagi – 1.00 petang',
    items: ['Berzanji', 'Majlis Berselawat', 'Bacaan Yasin', 'Tahlil', 'Doa Selamat'],
  },
  {
    time: '1.00 petang – 4.30 petang',
    items: ['Sambutan Hari Lahir Anak-Anak', 'Potong Kek', 'Sesi Bergambar', 'Jamuan Makan'],
  },
  { time: '4.30 petang', items: ['Majlis Bersurai'] },
]

/* ---------- GALERI ---------- */

export const GALLERY_IMAGES = ['/bersamanadeeranafeesa.jpg']

/* ---------- TEKS ---------- */

export const TEXT = {
  bismillah: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
  bismillahLatin: 'Bismillahirrahmanirrahim',
  openButton: 'Buka Jemputan',
  invitation:
    'Dengan penuh kesyukuran ke hadrat Allah SWT, kami sekeluarga dengan sukacitanya menjemput ' +
    'Dato’/Datin/Tuan/Puan/Encik/Cik sekeluarga ke Majlis Aqiqah Puteri Nadeera serta Sambutan ' +
    'Hari Lahir Puteri Nafeesa dan Puteri Nadeera.',
  invitationNote: 'Kehadiran dan doa daripada anda sekeluarga amat kami hargai.',
  countdownOngoing: 'Majlis sedang berlangsung. Kami menanti kehadiran anda!',
  countdownEnded: 'Terima kasih atas kehadiran dan doa anda.',
  doa:
    'Ya Allah, jadikanlah anak-anak kami anak yang solehah, dikurniakan kesihatan, ' +
    'dipanjangkan usia dalam kebaikan dan sentiasa berada dalam rahmat serta perlindungan-Mu.',
  closing: 'Terima kasih atas doa, kehadiran dan ingatan daripada anda sekeluarga.',
}
