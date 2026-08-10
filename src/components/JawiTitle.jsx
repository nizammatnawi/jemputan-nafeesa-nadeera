/**
 * Tajuk kaligrafi Jawi "عقيقة" (Aqiqah) — fokus visual jemputan.
 * Gaya kufi moden dengan gradien rose serta aksen kelopak,
 * dedaun halus dan bintang kecil mengikut tema blush pink.
 */
export default function JawiTitle({ className = '' }) {
  return (
    <span className={`jawi-title ${className}`}>
      {/* Kelopak & dedaun di hujung huruf */}
      <svg className="jawi-title__petal jawi-title__petal--left" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22 C 4 14, 6 5, 12 2 C 18 5, 20 14, 12 22Z" fill="#D98CA4" opacity="0.85" />
        <path d="M12 20 L12 5" stroke="#FCEEF3" strokeWidth="1" opacity="0.8" />
      </svg>
      <svg className="jawi-title__petal jawi-title__petal--right" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22 C 4 14, 6 5, 12 2 C 18 5, 20 14, 12 22Z" fill="#C89B7B" opacity="0.8" />
        <path d="M12 20 L12 5" stroke="#FFF8F3" strokeWidth="1" opacity="0.8" />
      </svg>
      <svg className="jawi-title__sparkle jawi-title__sparkle--a" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 l2.4 7.6 L22 12 l-7.6 2.4 L12 22 l-2.4-7.6 L2 12 l7.6-2.4Z" fill="currentColor" />
      </svg>
      <svg className="jawi-title__sparkle jawi-title__sparkle--b" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 l2.4 7.6 L22 12 l-7.6 2.4 L12 22 l-2.4-7.6 L2 12 l7.6-2.4Z" fill="currentColor" />
      </svg>

      {/* Perkataan Aqiqah dalam tulisan Jawi/Arab */}
      <span className="jawi-title__word" lang="ar" dir="rtl">
        عقيقة
      </span>

      {/* Garis hias emas halus */}
      <svg className="jawi-title__flourish" viewBox="0 0 220 14" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <path
          d="M6 7 C 50 1, 90 13, 110 7 C 130 1, 170 13, 214 7"
          stroke="#C89B7B"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        <circle cx="110" cy="7" r="2.2" fill="#D98CA4" />
      </svg>
    </span>
  )
}
