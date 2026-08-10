import { TEXT, EVENT } from '../config.js'
import FloralSpray from './decor/FloralSpray.jsx'
import ContactButton from './ContactButton.jsx'

/** Penutup jemputan serta butang hubungi tuan rumah. */
export default function Closing() {
  return (
    <section className="section closing" id="hubungi">
      {/* Sepasang rangkaian bunga di penjuru bawah — melengkapkan bingkai */}
      <FloralSpray id="closing-bl" variant="sederhana" className="closing__corner closing__corner--l" />
      <FloralSpray id="closing-br" variant="sederhana" className="closing__corner closing__corner--r" />

      <p className="closing__thanks">{TEXT.closing}</p>
      <p className="closing__host">{EVENT.host}</p>

      <ContactButton className="btn btn--solid closing__contact">
        <span aria-hidden="true">💬</span> Hubungi Tuan Rumah
      </ContactButton>

      <p className="closing__names">Puteri Nafeesa &amp; Puteri Nadeera</p>
      <p className="closing__date">Sabtu · 29 Ogos 2026</p>
    </section>
  )
}
