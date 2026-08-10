import { EVENT, CHILDREN } from '../config.js'
import { WaveDivider, Cloud, Sparkle } from './decor/Decor.jsx'
import FloralSpray from './decor/FloralSpray.jsx'
import JawiTitle from './JawiTitle.jsx'
import StickerMarquee from './StickerMarquee.jsx'

/**
 * Bahagian hero — paparan utama jemputan dengan
 * nama, tarikh, masa dan gambar kedua-dua puteri.
 */
export default function Hero() {
  return (
    <header className="hero" id="utama">
      {/* Hiasan latar */}
      {/* Kiri atas lembut & pudar, kanan atas rangkaian penuh */}
      <FloralSpray id="hero-tl" variant="pudar" className="hero__corner hero__corner--tl" />
      <FloralSpray id="hero-tr" variant="penuh" className="hero__corner hero__corner--tr" />
      <Cloud className="hero__cloud hero__cloud--left" />
      <Cloud className="hero__cloud hero__cloud--right" />
      <Sparkle className="hero__sparkle hero__sparkle--1" />
      <Sparkle className="hero__sparkle hero__sparkle--2" />
      <Sparkle className="hero__sparkle hero__sparkle--3" />

      <div className="hero__content">
        <JawiTitle className="hero__jawi" />
        <p className="hero__eyebrow">{EVENT.title}</p>
        <h1 className="hero__names">
          <span className="hero__name-script">Puteri Nafeesa</span>
          <span className="hero__amp" aria-hidden="true">
            &amp;
          </span>
          <span className="hero__name-script">Puteri Nadeera</span>
        </h1>

        <div className="hero__meta">
          <p className="hero__date">
            {EVENT.dayLabel}, {EVENT.dateLabel}
          </p>
          <p className="hero__time">{EVENT.timeLabel}</p>
        </div>

        {/* Gambar kedua-dua puteri (gaya pelekat/polaroid) */}
        <div className="hero__photos">
          {CHILDREN.map((child, i) => (
            <figure
              key={child.name}
              className={`hero__photo ${i === 0 ? 'hero__photo--left' : 'hero__photo--right'}`}
            >
              <div className="hero__photo-frame">
                <img src={child.heroImage} alt={child.name} />
              </div>
              <figcaption>{child.heroLabel}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Penunjuk skrol */}
      <a href="#jemputan" className="hero__scroll" aria-label="Skrol ke bawah">
        <span className="hero__scroll-text">Skrol</span>
        <span className="hero__scroll-chevron" aria-hidden="true" />
      </a>

      {/* Jalur sticker bergerak */}
      <StickerMarquee />

      {/* Ombak lembut */}
      <WaveDivider className="hero__wave" />
    </header>
  )
}
