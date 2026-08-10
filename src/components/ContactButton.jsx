import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CONTACT_REPLIES, WHATSAPP_URL } from '../config.js'

/**
 * Butang "Hubungi Tuan Rumah".
 *
 * Klik tidak terus membuka WhatsApp. Sebaliknya satu helaian pilihan
 * (bottom sheet pada telefon, dialog di tengah pada desktop) dipaparkan
 * supaya tetamu boleh memilih maklum balas yang ingin dihantar.
 *
 * Tiada data disimpan di laman ini — ia hanya jalan pintas ke WhatsApp.
 */
export default function ContactButton({ className = '', children }) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)

  // Tutup dengan kekunci Escape, dan kunci skrol latar semasa terbuka
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    // Alihkan fokus ke dalam dialog untuk pengguna papan kekunci
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Kembalikan fokus ke butang selepas dialog ditutup
  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const openWhatsApp = (message) => {
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const sheet = (
    <div
      className="sheet"
      onClick={(event) => {
        // Klik pada latar gelap sahaja yang menutup
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        className="sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <span className="sheet__grip" aria-hidden="true" />

        <button type="button" className="sheet__close" onClick={close} aria-label="Tutup">
          ✕
        </button>

        <h2 className="sheet__title" id="sheet-title">
          Sahkan Kehadiran
        </h2>
        <p className="sheet__text">Pilih maklum balas yang ingin dihantar kepada tuan rumah.</p>

        <div className="sheet__options">
          {CONTACT_REPLIES.map((reply) => (
            <button
              key={reply.id}
              type="button"
              className="sheet__option"
              onClick={() => openWhatsApp(reply.message)}
            >
              <span className="sheet__option-icon" aria-hidden="true">
                {reply.icon}
              </span>
              <span className="sheet__option-label">{reply.label}</span>
              <span className="sheet__option-arrow" aria-hidden="true">
                ›
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="sheet__dismiss" onClick={close}>
          Tutup
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button type="button" ref={triggerRef} className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      {/* Dipaparkan melalui portal ke <body>.
          Sebabnya: kad jemputan menggunakan `backdrop-filter`, dan sifat itu
          menjadikan kad sebagai "containing block" — tanpa portal, helaian
          `position: fixed` akan terperangkap di dalam kad, bukan menutupi skrin. */}
      {open && createPortal(sheet, document.body)}
    </>
  )
}
