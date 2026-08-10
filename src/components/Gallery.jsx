import { useState } from 'react'
import { GALLERY_IMAGES } from '../config.js'
import SectionTitle from './SectionTitle.jsx'

/**
 * Galeri responsif. Imej yang gagal dimuatkan
 * disembunyikan tanpa ikon imej rosak.
 */
export default function Gallery() {
  const [failed, setFailed] = useState([])
  const images = GALLERY_IMAGES.filter((src) => !failed.includes(src))

  if (images.length === 0) return null

  return (
    <section className="section gallery" id="galeri">
      <SectionTitle script="Detik Manis" title="Galeri" />
      <div className="gallery__grid">
        {images.map((src) => (
          <div key={src} className="gallery__item">
            <img
              src={src}
              alt="Kenangan bersama Puteri Nafeesa dan Puteri Nadeera"
              loading="lazy"
              decoding="async"
              onError={() => setFailed((prev) => [...prev, src])}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
