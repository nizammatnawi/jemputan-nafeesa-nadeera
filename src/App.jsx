import { useLayoutEffect, useRef, useState } from 'react'
import OpeningOverlay from './components/OpeningOverlay.jsx'
import Hero from './components/Hero.jsx'
import InvitationMessage from './components/InvitationMessage.jsx'
import CelebrationCards from './components/CelebrationCards.jsx'
import EventDetails from './components/EventDetails.jsx'
import Programme from './components/Programme.jsx'
import LocationCard from './components/LocationCard.jsx'
import Gallery from './components/Gallery.jsx'
import GuestWishes from './components/GuestWishes.jsx'
import Doa from './components/Doa.jsx'
import Closing from './components/Closing.jsx'
import BottomNav from './components/BottomNav.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import { jumpToTop } from './lib/scroll.js'
import { useAutoScroll, JEDA_SELEPAS_NAV } from './lib/useAutoScroll.js'
import './App.css'

export default function App() {
  const musicRef = useRef(null)

  // Auto-skrol hanya dibenarkan selepas gerbang pembuka selesai sepenuhnya
  const [jemputanDibuka, setJemputanDibuka] = useState(false)
  const { pauseFor } = useAutoScroll(jemputanDibuka)

  /**
   * Pastikan laman SENTIASA bermula di bahagian paling atas.
   *
   * Tiga lapisan diperlukan kerana setiap pelayar berkelakuan berbeza:
   *  1. useLayoutEffect — berjalan sebelum lukisan pertama, jadi tetamu
   *     tidak nampak laman "melompat".
   *  2. 'load' — sesetengah pelayar memulihkan skrol selepas gambar & fon
   *     selesai dimuatkan (ketinggian laman berubah).
   *  3. 'pageshow' — menangkap pemulihan daripada cache "back/forward"
   *     (bfcache). Inilah yang berlaku apabila pautan dibuka semula dari
   *     WhatsApp/Telegram atau butang 'back' pada telefon.
   */
  useLayoutEffect(() => {
    jumpToTop()

    window.addEventListener('load', jumpToTop)
    window.addEventListener('pageshow', jumpToTop)

    return () => {
      window.removeEventListener('load', jumpToTop)
      window.removeEventListener('pageshow', jumpToTop)
    }
  }, [])

  const handleOpen = () => {
    // Peralihan mesti sentiasa bermula dari bahagian paling atas —
    // bukan dari kedudukan skrol lama yang dipulihkan pelayar
    jumpToTop()

    // Muzik bermula serentak dengan peralihan pembukaan.
    // Dipanggil terus dalam gerak-geri pengguna supaya iOS Safari membenarkannya.
    musicRef.current?.start()
  }

  return (
    <>
      <OpeningOverlay onOpen={handleOpen} onFinished={() => setJemputanDibuka(true)} />

      <main className="page">
        <Hero />
        <InvitationMessage />
        <CelebrationCards />
        <EventDetails />
        <Programme />
        <LocationCard />
        <Gallery />
        <GuestWishes />
        <Doa />
        <Closing />
      </main>

      {/* Tekan navigasi → auto-skrol berhenti, seksyen dipaparkan,
          kemudian auto-skrol menyambung semula dari situ */}
      <BottomNav onNavigate={() => pauseFor(JEDA_SELEPAS_NAV)} />
      <MusicPlayer ref={musicRef} />
    </>
  )
}
