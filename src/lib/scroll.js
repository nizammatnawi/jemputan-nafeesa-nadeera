/**
 * Skrol ke bahagian paling atas SERTA-MERTA.
 *
 * Nota penting: laman ini menetapkan `scroll-behavior: smooth` pada <html>
 * (untuk navigasi bawah yang lembut). Tanpa langkah di bawah, panggilan
 * window.scrollTo(0, 0) akan *beranimasi* perlahan-lahan ke atas — bukan
 * melompat terus. Oleh itu kita matikan `scroll-behavior` seketika,
 * skrol, kemudian pulihkan semula nilai asalnya.
 */
export function jumpToTop() {
  const html = document.documentElement
  const previous = html.style.scrollBehavior

  html.style.scrollBehavior = 'auto'

  window.scrollTo(0, 0)
  // Sesetengah pelayar (terutamanya Safari iOS) memerlukan kedua-dua ini
  html.scrollTop = 0
  if (document.body) document.body.scrollTop = 0

  html.style.scrollBehavior = previous
}
