import rawStickers from 'virtual:stickers'
import { buildAlternatingStickers } from '../lib/stickerOrder.js'

/**
 * Sticker disusun berselang-seli antara kedua-dua puteri
 * (eica → eira → eica → eira …), bukan berkumpul mengikut puteri.
 */
const stickers = buildAlternatingStickers(rawStickers)

/**
 * Jalur sticker bergerak berterusan dari kanan ke kiri.
 *
 * Cara ia berulang tanpa "lompat":
 * satu jujukan sticker didua-kalikan dalam DOM, kemudian keseluruhan
 * landasan digerakkan sejauh -50% sahaja. Pada penghujung animasi,
 * salinan kedua berada tepat di kedudukan asal salinan pertama —
 * jadi ulangan tidak kelihatan.
 *
 * Setiap sticker mempunyai margin-right (bukan `gap` pada landasan) supaya
 * separuh landasan termasuk jarak di hujungnya — ini yang membuatkan
 * peralihan benar-benar mulus.
 */
export default function StickerMarquee() {
  if (!stickers.length) return null

  const group = (cloned) => (
    <div className={`marquee__group ${cloned ? 'marquee__group--clone' : ''}`}>
      {stickers.map((src) => (
        <img
          key={`${cloned ? 'clone' : 'asal'}-${src}`}
          className="marquee__sticker"
          src={src}
          alt=""
          decoding="async"
          draggable="false"
        />
      ))}
    </div>
  )

  return (
    // Hiasan sahaja — nama & label sebenar sudah ada pada gambar utama di atas
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}
