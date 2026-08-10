# Jemputan Digital — Majlis Aqiqah & Sambutan Hari Lahir

Laman jemputan digital untuk **Puteri Nafeesa** & **Puteri Nadeera**.
Dibina dengan React + Vite. Tiada pangkalan data, tiada log masuk — mudah diselenggara.

## Cara jalankan di komputer

```bash
npm install
npm run dev
```

Kemudian buka pautan yang tertera (biasanya `http://localhost:5173`).

## Apa yang perlu anda kemas kini

Semua maklumat boleh diubah dalam **satu fail sahaja**: [`src/config.js`](src/config.js)

> Aturcara majlis berada dalam pemalar `PROGRAMME` — tambah atau buang slot waktu di situ.

| Perkara | Pemalar | Status |
| --- | --- | --- |
| Pautan Google Maps | `GOOGLE_MAPS_URL` | Sudah diisi (semak ketepatan) |
| Pautan Waze | `WAZE_URL` | Sudah diisi (semak ketepatan) |
| Nombor WhatsApp tuan rumah | `WHATSAPP_URL` | **Perlu ganti** (`https://wa.me/60XXXXXXXXX`) |
| Pautan Google Calendar | `GOOGLE_CALENDAR_URL` | Sudah diisi |
| API Ucapan Tetamu | `GOOGLE_SCRIPT_URL` | **Perlu isi** |

> Tetamu boleh menghubungi tuan rumah terus melalui butang **Hubungi**
> (WhatsApp) jika ada sebarang pertanyaan.

### Ucapan Tetamu — Google Sheets + Apps Script

Tetamu boleh meninggalkan nama dan ucapan/doa terus di dalam laman.
Data disimpan ke Google Sheets melalui Google Apps Script.
Tiada soalan kehadiran — ruangan ini hanya untuk ucapan dan doa.

Panduan lengkap: **[google-apps-script/PANDUAN.md](google-apps-script/PANDUAN.md)**

Ringkasnya:

1. Cipta Google Sheet baharu, namakan tab pertama **Ucapan**.
2. **Extensions → Apps Script**, tampal isi [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. **Deploy → New deployment → Web app** — *Execute as: Me*, *Who has access: **Anyone***.
4. Salin URL `.../exec` dan tampal ke `GOOGLE_SCRIPT_URL` dalam `src/config.js`.

**Moderasi:** setiap ucapan disimpan dengan `Status = SHOW` dan terus dipaparkan.
Untuk menyembunyikan ucapan, tukar lajur **Status** kepada `HIDE` dalam Google
Sheets (atau padam baris itu). Untuk memaparkan semula, tukar kembali ke `SHOW`.

### Open Graph (paparan cantik bila kongsi di WhatsApp)

Selepas deploy, buka [`index.html`](index.html) dan gantikan
`https://GANTIKAN-DOMAIN-ANDA.vercel.app/` dengan domain sebenar anda (2 tempat).

## Gambar

Semua gambar berada dalam folder [`public/`](public). Untuk menukar gambar,
gantikan fail dengan nama yang sama, atau kemas kini laluan dalam `src/config.js`.

> Tip: kecilkan saiz gambar (contoh: lebar 1200px) supaya laman lebih laju.

## Deploy ke Vercel

1. Muat naik projek ini ke GitHub (atau gunakan `vercel` CLI).
2. Di [vercel.com](https://vercel.com), pilih **New Project** dan import repo ini.
3. Vercel akan mengesan Vite secara automatik — terus tekan **Deploy**.

Untuk menguji binaan sebelum deploy:

```bash
npm run build
npm run preview
```

## Struktur projek

```
public/                  Gambar, sticker & favicon
google-apps-script/
  Code.gs                Kod backend ucapan (tampal ke Apps Script)
  PANDUAN.md             Panduan pemasangan langkah demi langkah
src/
  config.js              ← SEMUA maklumat & pautan (edit di sini)
  index.css              Warna, fon & gaya asas
  App.css                Gaya setiap seksyen
  App.jsx                Susunan seksyen laman
  components/            Komponen setiap seksyen
  lib/                   Fungsi pembantu (skrol, susunan sticker)
```
