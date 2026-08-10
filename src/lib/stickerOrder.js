/**
 * Menyusun sticker supaya berselang-seli antara kedua-dua puteri.
 *
 * Corak nama fail dalam public/stickers/:
 *   1eica.png, 3eica.png, 5eica.png …  → Puteri Nafeesa
 *   2eira.png, 4eira.png, 6eira.png …  → Puteri Nadeera
 *
 * Hasil yang dikehendaki: eica → eira → eica → eira → …
 * (bukan semua eica dahulu, kemudian semua eira)
 */

/** Penanda dalam nama fail bagi setiap puteri. */
const MARKERS = { eica: 'eica', eira: 'eira' }

/** Kenal pasti pemilik sticker daripada nama failnya. */
export function stickerOwner(url) {
  // Nyahkod dahulu kerana nama fail dikodkan untuk URL
  let name = url
  try {
    name = decodeURIComponent(url)
  } catch {
    // biarkan nama asal jika gagal dinyahkod
  }

  const base = name.split('/').pop().toLowerCase()

  if (base.includes(MARKERS.eica)) return 'eica'
  if (base.includes(MARKERS.eira)) return 'eira'
  return 'lain'
}

/**
 * Bina senarai sticker berselang-seli.
 *
 * Peraturan:
 * - Berselang-seli selagi kedua-dua puteri masih ada sticker.
 * - Baki sticker (jika seorang lebih banyak) diletak di hujung mengikut turutan asal.
 * - Tiada sticker digandakan semata-mata untuk menyamakan bilangan.
 * - Fail yang tidak mengikut corak nama diletak di hujung sekali.
 *
 * Sengaja bermula dengan puteri yang mempunyai sticker LEBIH SEDIKIT.
 * Sebabnya: baki sticker berada di hujung senarai, jadi jika kita bermula
 * dengan puteri yang lebih banyak, sambungan gelung akan menghasilkan
 * dua sticker puteri yang sama bersebelahan. Bermula dengan yang lebih
 * sedikit memastikan sticker terakhir dan sticker pertama sentiasa
 * daripada puteri yang berbeza.
 */
export function buildAlternatingStickers(urls) {
  const eica = []
  const eira = []
  const lain = []

  for (const url of urls) {
    const owner = stickerOwner(url)
    if (owner === 'eica') eica.push(url)
    else if (owner === 'eira') eira.push(url)
    else lain.push(url)
  }

  // Mulakan dengan kumpulan yang lebih sedikit (lihat nota di atas).
  // Jika sama banyak, mulakan dengan eica supaya turutan menjadi
  // 1eica → 2eira → 3eica → 4eira …
  const startWithEica = eica.length <= eira.length
  const first = startWithEica ? eica : eira
  const second = startWithEica ? eira : eica

  const ordered = []
  const pairs = Math.min(first.length, second.length)

  for (let i = 0; i < pairs; i++) {
    ordered.push(first[i], second[i])
  }

  // Baki daripada kumpulan yang lebih panjang, mengikut turutan asal
  ordered.push(...first.slice(pairs), ...second.slice(pairs), ...lain)

  return ordered
}
