import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

/** Fail audio dirujuk terus dari public/ — tidak dibundel ke dalam JavaScript. */
const AUDIO_SRC = '/audio/selawat.mp3'

/** Kelantangan akhir yang lembut (25%). */
const TARGET_VOLUME = 0.25

/** Tempoh naik perlahan-lahan dari senyap ke kelantangan penuh. */
const FADE_MS = 3000

/** Kunci ingatan sesi — jika tetamu sendiri menghentikan muzik. */
const PAUSED_KEY = 'muzik-dihentikan'

/* Ikon SVG kecil — mengikut gaya hiasan SVG sedia ada dalam projek */

function IconMusicOn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 17V6l10-2v11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="15.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function IconMusicOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 17V6l10-2v11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="6.5" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <circle cx="16.5" cy="15.5" r="2.6" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      {/* Garis serong menandakan muzik dihentikan */}
      <path d="M4 20 L20 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Muzik latar jemputan.
 *
 * Tidak bermain automatik semasa laman dibuka — pelayar moden menyekatnya.
 * Muzik hanya bermula apabila tetamu menekan "Buka Jemputan", iaitu melalui
 * kaedah `start()` yang didedahkan kepada App.
 */
const MusicPlayer = forwardRef(function MusicPlayer(_props, ref) {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const cancelFade = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }

  /**
   * Naikkan/turunkan kelantangan secara lembut.
   *
   * Menggunakan setInterval, bukan requestAnimationFrame: rAF berhenti
   * SEPENUHNYA apabila halaman tidak kelihatan. Jika tetamu menekan
   * "Buka Jemputan" lalu terus bertukar ke aplikasi lain, peralihan rAF
   * akan tersekat dan muzik kekal senyap. setInterval tetap berdetik
   * (walaupun diperlahankan), dan kerana kelantangan dikira daripada
   * masa sebenar yang berlalu, peralihan tetap sampai ke nilai akhir.
   */
  const fadeTo = useCallback((target, duration) => {
    cancelFade()
    const audio = audioRef.current
    if (!audio) return

    const from = audio.volume
    const started = performance.now()

    fadeRef.current = window.setInterval(() => {
      const current = audioRef.current
      if (!current) return cancelFade()

      const progress = Math.min((performance.now() - started) / duration, 1)
      const value = from + (target - from) * progress
      // Jaga-jaga: kelantangan mesti antara 0 dan 1
      current.volume = Math.min(Math.max(value, 0), 1)

      if (progress >= 1) cancelFade()
    }, 50)
  }, [])

  /** Dipanggil oleh butang "Buka Jemputan". */
  const start = useCallback(async () => {
    // Hormati pilihan tetamu — jangan mula semula jika mereka sudah menghentikannya
    try {
      if (window.sessionStorage.getItem(PAUSED_KEY) === '1') return
    } catch {
      // sessionStorage disekat — teruskan sahaja
    }

    const audio = audioRef.current
    if (!audio) return

    try {
      audio.volume = 0
      // play() mesti dipanggil dalam gerak-geri pengguna (penting untuk iOS Safari)
      await audio.play()
      setPlaying(true)
      fadeTo(TARGET_VOLUME, FADE_MS)
    } catch {
      // Pelayar menyekat main automatik — jangan papar sebarang ralat.
      // Tetamu masih boleh menekan butang muzik untuk memulakannya.
      setPlaying(false)
    }
  }, [fadeTo])

  useImperativeHandle(ref, () => ({ start }), [start])

  /** Butang muzik: hentikan / sambung semula dari kedudukan yang sama. */
  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      cancelFade()
      // pause() mengekalkan currentTime — sambungan nanti bermula di tempat sama
      audio.pause()
      setPlaying(false)
      try {
        window.sessionStorage.setItem(PAUSED_KEY, '1')
      } catch {
        /* abaikan */
      }
      return
    }

    try {
      await audio.play()
      setPlaying(true)
      try {
        window.sessionStorage.removeItem(PAUSED_KEY)
      } catch {
        /* abaikan */
      }
      // Jika muzik belum pernah dinaikkan (contoh: main automatik disekat), naikkan lembut
      if (audio.volume < TARGET_VOLUME) fadeTo(TARGET_VOLUME, 800)
    } catch {
      setPlaying(false)
    }
  }

  /**
   * Tetapkan kelantangan asal kepada tahap akhir (25%) sebaik sahaja dipasang.
   *
   * Penting: nilai lalai elemen audio ialah 1.0 (100%). Jika tetamu memulakan
   * muzik melalui butang muzik tanpa melalui peralihan "Buka Jemputan"
   * (contohnya selepas mereka pernah menghentikannya), tanpa baris ini muzik
   * akan berbunyi pada kelantangan penuh — terlalu kuat.
   */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = TARGET_VOLUME
  }, [])

  // Bersihkan animasi kelantangan apabila komponen ditanggalkan
  useEffect(() => cancelFade, [])

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="metadata"
        // Selaraskan keadaan butang jika muzik diubah dari luar (contoh: kawalan media telefon)
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        type="button"
        className={`music-btn ${playing ? 'music-btn--playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Hentikan muzik' : 'Mainkan muzik'}
        aria-pressed={playing}
      >
        <span className="music-btn__ring" aria-hidden="true" />
        <span className="music-btn__icon">{playing ? <IconMusicOn /> : <IconMusicOff />}</span>
      </button>
    </>
  )
})

export default MusicPlayer
