# Panduan Ucapan Tetamu — Google Sheets + Apps Script

Ikut langkah ini sekali sahaja. Anggaran masa: 10 minit.

---

## Langkah 1 — Cipta Google Sheet

1. Buka [sheets.new](https://sheets.new) untuk cipta spreadsheet baharu.
2. Namakan spreadsheet, contoh: **Ucapan Nafeesa & Nadeera**.
3. Tukar nama tab di bawah (Sheet1) kepada **Ucapan** — huruf besar pada 'U'.

Anda **tidak perlu** menaip tajuk lajur. Skrip akan menciptanya secara
automatik pada ucapan pertama diterima:

| Lajur | Tajuk | Keterangan |
| --- | --- | --- |
| A | Timestamp | Tarikh & masa ucapan diterima |
| B | Name | Nama tetamu |
| C | Message | Ucapan atau doa |
| D | **Status** | `SHOW` atau `HIDE` — **inilah panel moderasi anda** |
| E | ID | ID unik — mengelakkan rekod berganda |

---

## Langkah 2 — Tampal kod Apps Script

1. Dalam Google Sheet, klik menu **Extensions → Apps Script**.
2. Padam semua kod contoh (`function myFunction() {}`).
3. Buka fail [`Code.gs`](Code.gs) dalam projek ini, salin **keseluruhan** isinya,
   dan tampal ke dalam editor Apps Script.
4. Klik ikon 💾 **Save**.

---

## Langkah 3 — Deploy sebagai Web App

1. Klik butang biru **Deploy → New deployment**.
2. Klik ikon roda ⚙️ di sebelah "Select type" → pilih **Web app**.
3. Isi tetapan berikut:

   | Tetapan | Pilihan |
   | --- | --- |
   | Description | `Ucapan Tetamu` (bebas) |
   | Execute as | **Me** (akaun anda) |
   | Who has access | **Anyone** |

   > **"Anyone" adalah wajib.** Jika dipilih "Anyone with Google account",
   > tetamu tanpa akaun Google tidak dapat menghantar ucapan.

4. Klik **Deploy**.
5. Google akan minta kebenaran: **Authorize access** → pilih akaun anda →
   skrin "Google hasn't verified this app" muncul → klik **Advanced** →
   **Go to (nama projek) (unsafe)** → **Allow**.

   > Amaran ini normal untuk skrip peribadi anda sendiri.

6. Salin **Web app URL**. Bentuknya:

   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec
   ```

---

## Langkah 4 — Masukkan URL ke laman web

Buka [`src/config.js`](../src/config.js) dan tampal URL tadi:

```js
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb..../exec'
```

Simpan fail. Selesai — ruangan ucapan terus berfungsi.

---

## Moderasi — Google Sheets ialah panel anda

Setiap ucapan baharu disimpan dengan **Status = SHOW** secara automatik
dan terus dipaparkan. Tiada kelulusan manual diperlukan.

Untuk menyembunyikan ucapan yang tidak sesuai:

| Tindakan dalam Google Sheets | Kesan pada laman |
| --- | --- |
| Tukar Status `SHOW` → `HIDE` | Ucapan **hilang** apabila senarai dimuat semula |
| Tukar Status `HIDE` → `SHOW` | Ucapan **muncul semula** |
| Padam baris terus | Ucapan **hilang terus** |

Huruf besar/kecil tidak penting — `hide`, `HIDE` dan ` Hide ` semuanya berfungsi.
Sebarang nilai selain `SHOW` (termasuk kosong) akan disembunyikan.

> Perubahan berkuat kuasa apabila tetamu memuat semula laman atau menekan
> **Lihat Lagi**. Tiada deploy semula diperlukan.

---

## CORS — apa yang perlu anda tahu

Tiada tetapan CORS perlu dibuat. Ia sudah diuruskan:

- **Menghantar ucapan (POST)** — data dihantar sebagai `text/plain`, bukan
  `application/json`. Ini dikira "simple request" oleh pelayar, jadi tiada
  permintaan *preflight* (`OPTIONS`) berlaku. Ini penting kerana Apps Script
  **tidak** menjawab permintaan `OPTIONS`.
- **Membaca ucapan (GET)** — Apps Script memulangkan header CORS secara
  automatik untuk web app yang dibuka kepada "Anyone".

Jika anda mengubah kod supaya menghantar `Content-Type: application/json`,
penghantaran **akan gagal** dengan ralat CORS. Kekalkan `text/plain`.

---

## Had & perlindungan

Disemak di laman web **dan** sekali lagi di Apps Script:

| Medan | Had |
| --- | --- |
| Nama | Wajib, maksimum 100 aksara |
| Ucapan | Wajib, maksimum **50 patah perkataan**, maksimum ~300 aksara |

- Ucapan yang hanya mengandungi ruang kosong ditolak.
- Butang dikunci semasa menghantar (elak klik berulang).
- ID unik setiap penghantaran — permintaan yang sama tidak menghasilkan dua baris.
- Nama + ucapan yang serupa dalam 5 minit dianggap pendua dan diabaikan.

> Ucapan yang melebihi had **ditolak dengan mesej jelas**, bukan dipotong
> separuh jalan — supaya tiada bahagian ucapan tetamu hilang tanpa disedari.

---

## Jika anda mengemas kini `Code.gs` kemudian

Selepas menyunting kod, anda **mesti deploy semula**:

**Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy**

URL kekal sama, jadi tiada perubahan diperlukan pada laman web.

> Jangan guna "New deployment" untuk kemas kini — ia menghasilkan URL baharu.

---

## Menguji

Buka URL ini dalam pelayar untuk melihat data JSON ucapan:

```
https://script.google.com/macros/s/AKfycb..../exec?action=wishes&limit=6
```

Ia hanya memulangkan `name`, `message` dan `timestamp` bagi baris berstatus SHOW.
