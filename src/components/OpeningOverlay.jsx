import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TEXT, EVENT } from '../config.js'
import { Sparkle } from './decor/Decor.jsx'
import FloralSpray from './decor/FloralSpray.jsx'
import JawiTitle from './JawiTitle.jsx'

/* Peringkat animasi mengikut urutan */
const PHASE = {
  closed: 'tertutup',
  textOut: 'teks-lenyap',
  unlocking: 'membuka-kunci',
  opening: 'terbuka',
}

/* Tempoh setiap langkah (milisaat) — jumlah ~1.4s */
const TEXT_MS = 250 //  1. teks pembuka lenyap
const UNLOCK_MS = 350 //  2. kunci terbuka
const DOORS_MS = 800 //  3. panel terbuka
const REVEAL_LEAD = 250 //  5. hero mula muncul sebelum gerbang ditanggalkan

/** Mangga tertutup. */
function IconLocked() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="5.5" y="10" width="13" height="9.5" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="14.6" r="1.5" fill="currentColor" />
    </svg>
  )
}

/** Mangga terbuka — lengkungan terangkat ke sisi. */
function IconUnlocked() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 10V7.5a4 4 0 0 1 7.6-1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="5.5" y="10" width="13" height="9.5" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="14.6" r="1.5" fill="currentColor" />
    </svg>
  )
}

/**
 * Gerbang jemputan — dua panel berhias yang bertemu di tengah.
 *
 * Urutan apabila "Buka Jemputan" ditekan:
 *   1. Teks pembuka lenyap dahulu   (250ms)  ← elak dua lapisan teks bertindih
 *   2. Kunci terbuka                (350ms)
 *   3. Panel terbuka ke tepi        (800ms)
 *   4. Gerbang ditanggalkan
 *   5. Hero & navigasi muncul       (500ms, bermula sebelum langkah 4 tamat)
 *
 * Sepanjang gerbang masih ada, hero + navigasi + butang muzik disembunyikan
 * melalui kelas `gerbang-aktif` pada <body>. Ini yang memastikan hanya SATU
 * lapisan teks boleh dibaca pada satu-satu masa.
 */
export default function OpeningOverlay({ onOpen, onFinished }) {
  const [phase, setPhase] = useState(PHASE.closed)
  const [gone, setGone] = useState(false)
  const timersRef = useRef([])

  /**
   * Sembunyikan hero & navigasi SEBELUM lukisan pertama.
   * useLayoutEffect (bukan useEffect) supaya tiada kelipan kandungan hero.
   */
  useLayoutEffect(() => {
    if (gone) return
    document.body.classList.add('gerbang-aktif')
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.classList.remove('gerbang-aktif')
      document.body.style.overflow = ''
    }
  }, [gone])

  // Bersihkan pemasa jika komponen ditanggalkan di tengah animasi
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  /** Langkah 5 — tunjukkan hero, navigasi & butang muzik. */
  const revealPage = () => {
    document.body.classList.remove('gerbang-aktif')
    document.body.classList.add('gerbang-dedah')
    // Kelas dedah hanya diperlukan sepanjang animasi masuk
    timersRef.current.push(setTimeout(() => document.body.classList.remove('gerbang-dedah'), 900))
  }

  const handleOpen = () => {
    if (phase !== PHASE.closed) return

    // Muzik dimulakan SERTA-MERTA dalam gerak-geri pengguna.
    // Wajib untuk iOS Safari — jika ditangguhkan, audio akan disekat.
    onOpen?.()

    const kurangGerakan = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (kurangGerakan) {
      setPhase(PHASE.opening)
      timersRef.current.push(
        setTimeout(revealPage, 120),
        setTimeout(() => {
          setGone(true)
          onFinished?.()
        }, 320),
      )
      return
    }

    // 1. Teks lenyap dahulu
    setPhase(PHASE.textOut)

    timersRef.current.push(
      // 2. Kunci terbuka
      setTimeout(() => setPhase(PHASE.unlocking), TEXT_MS),
      // 3. Panel terbuka
      setTimeout(() => setPhase(PHASE.opening), TEXT_MS + UNLOCK_MS),
      // 5. Hero muncul ketika panel hampir habis bergerak
      setTimeout(revealPage, TEXT_MS + UNLOCK_MS + DOORS_MS - REVEAL_LEAD),
      // 4. Gerbang ditanggalkan sepenuhnya — barulah auto-skrol dibenarkan
      setTimeout(() => {
        setGone(true)
        onFinished?.()
      }, TEXT_MS + UNLOCK_MS + DOORS_MS),
    )
  }

  if (gone) return null

  const unlocked = phase === PHASE.unlocking || phase === PHASE.opening

  return (
    <div className="gate" data-phase={phase} role="dialog" aria-modal="true" aria-label="Jemputan">
      {/* ---- Panel kiri ---- */}
      <div className="gate__panel gate__panel--left" aria-hidden="true">
        <FloralSpray id="gate-tl" variant="penuh" className="gate__floral gate__floral--tl" />
        <FloralSpray id="gate-bl" variant="sederhana" className="gate__floral gate__floral--bl" />
        <span className="gate__seam" />
      </div>

      {/* ---- Panel kanan ---- */}
      <div className="gate__panel gate__panel--right" aria-hidden="true">
        <FloralSpray id="gate-tr" variant="penuh" className="gate__floral gate__floral--tr" />
        <FloralSpray id="gate-br" variant="sederhana" className="gate__floral gate__floral--br" />
        <span className="gate__seam" />
      </div>

      {/* ---- Kandungan tengah, di atas kedua-dua panel ---- */}
      <div className="gate__center">
        {/* Blok teks — lenyap pada langkah 1 */}
        <div className="gate__text">
          <p className="opening__bismillah-arabic" lang="ar" dir="rtl">
            {TEXT.bismillah}
          </p>
          <p className="opening__bismillah">{TEXT.bismillahLatin}</p>

          <div className="opening__divider" aria-hidden="true">
            <span />
            <Sparkle className="opening__sparkle" />
            <span />
          </div>

          <JawiTitle className="opening__jawi" />

          <h1 className="opening__title">{EVENT.title}</h1>
          <p className="opening__names">Puteri Nafeesa &amp; Puteri Nadeera</p>
        </div>

        {/* Mohor kekal kelihatan untuk animasi kunci pada langkah 2 */}
        <div className={`seal ${unlocked ? 'seal--unlocked' : ''}`}>
          <span className="seal__glow" aria-hidden="true" />
          <span className="seal__ring" aria-hidden="true" />
          <span className="seal__icon" aria-hidden="true">
            {unlocked ? <IconUnlocked /> : <IconLocked />}
          </span>
        </div>

        <div className="gate__text gate__text--butang">
          <span className="seal__thread" aria-hidden="true" />
          <button type="button" className="opening__button" onClick={handleOpen}>
            {TEXT.openButton}
          </button>
        </div>
      </div>
    </div>
  )
}
