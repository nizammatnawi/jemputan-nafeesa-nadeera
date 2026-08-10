import { useCallback, useEffect, useRef } from 'react'

/**
 * ► Kelajuan auto-skrol dalam piksel sesaat.
 *   Naikkan nilai untuk lebih laju, turunkan untuk lebih perlahan.
 */
export const AUTO_SCROLL_SPEED = 26

/** Tempoh berhenti selepas tetamu menekan butang navigasi. */
export const JEDA_SELEPAS_NAV = 4000

/** Tempoh berhenti selepas tetamu menyentuh/menskrol sendiri. */
export const JEDA_SELEPAS_MANUAL = 5000

/** Kekunci yang menggerakkan skrol — dikira sebagai gerak-geri manual. */
const KEKUNCI_SKROL = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
])

/**
 * Satu pengawal auto-skrol berpusat.
 *
 * Bermula hanya apabila `enabled` menjadi true (iaitu selepas gerbang
 * pembuka selesai sepenuhnya). Berhenti terus apabila sampai ke bahagian
 * paling bawah — tidak berulang semula ke atas.
 *
 * Tetamu sentiasa berkuasa: sebarang sentuhan, tatal tetikus atau kekunci
 * skrol akan menghentikannya seketika, kemudian ia menyambung semula
 * dari kedudukan semasa tetamu.
 */
export function useAutoScroll(enabled) {
  const rafRef = useRef(null)
  const resumeRef = useRef(null)
  const pausedRef = useRef(false)
  const lastTimeRef = useRef(0)
  // Baki pecahan piksel — supaya kelajuan tepat walaupun skrol hanya
  // menerima nombor bulat setiap bingkai
  const carryRef = useRef(0)

  const clearResume = () => {
    if (resumeRef.current) {
      clearTimeout(resumeRef.current)
      resumeRef.current = null
    }
  }

  /** Hentikan auto-skrol seketika, kemudian sambung semula. */
  const pauseFor = useCallback((ms) => {
    pausedRef.current = true
    clearResume()
    resumeRef.current = setTimeout(() => {
      pausedRef.current = false
      // Set semula supaya tiada lonjakan besar selepas jeda
      lastTimeRef.current = 0
      carryRef.current = 0
      resumeRef.current = null
    }, ms)
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Kebolehcapaian: pengguna yang memilih kurangkan pergerakan
    // tidak mendapat auto-skrol langsung
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let stopped = false

    const diBawahSekali = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

    const step = (now) => {
      if (stopped) return

      if (!lastTimeRef.current) lastTimeRef.current = now
      // Hadkan lompatan masa (contoh: selepas tab kembali aktif)
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      if (!pausedRef.current) {
        if (diBawahSekali()) {
          // Sampai ke penghujung — berhenti bergerak, tiada ulangan ke atas.
          //
          // Gelung SENGAJA dibiarkan hidup (bukan `return` terus). Jika tetamu
          // menekan butang navigasi selepas ini, mereka kembali ke seksyen
          // pilihan dan auto-skrol perlu menyambung turun semula dari situ.
          carryRef.current = 0
        } else {
          carryRef.current += AUTO_SCROLL_SPEED * dt
          const piksel = Math.floor(carryRef.current)

          if (piksel >= 1) {
            carryRef.current -= piksel
            // 'instant' penting: laman menetapkan scroll-behavior: smooth,
            // dan tanpa ini setiap bingkai akan cuba beranimasi sendiri
            window.scrollTo({ top: window.scrollY + piksel, left: 0, behavior: 'instant' })
          }
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    // ---- Gerak-geri manual: jangan sekali-kali melawan tetamu ----
    const onManual = () => pauseFor(JEDA_SELEPAS_MANUAL)
    const onKey = (event) => {
      if (KEKUNCI_SKROL.has(event.key)) onManual()
    }

    window.addEventListener('wheel', onManual, { passive: true })
    window.addEventListener('touchstart', onManual, { passive: true })
    window.addEventListener('touchmove', onManual, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      stopped = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearResume()
      window.removeEventListener('wheel', onManual)
      window.removeEventListener('touchstart', onManual)
      window.removeEventListener('touchmove', onManual)
      window.removeEventListener('keydown', onKey)
    }
  }, [enabled, pauseFor])

  return { pauseFor }
}
