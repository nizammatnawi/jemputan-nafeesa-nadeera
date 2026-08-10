import { EVENT, GOOGLE_MAPS_URL, WAZE_URL, GOOGLE_CALENDAR_URL } from '../config.js'
import SectionTitle from './SectionTitle.jsx'
import Countdown from './Countdown.jsx'
import ContactButton from './ContactButton.jsx'

const ACTIONS = [
  { label: 'Google Maps', href: GOOGLE_MAPS_URL, icon: '📍' },
  { label: 'Waze', href: WAZE_URL, icon: '🚗' },
  { label: 'Simpan Tarikh', href: GOOGLE_CALENDAR_URL, icon: '🗓️' },
]

/** Butiran majlis: hari, tarikh, masa, alamat dan butang tindakan. */
export default function EventDetails() {
  return (
    <section className="section details" id="majlis">
      <SectionTitle script="Butiran Majlis" title="Tarikh & Tempat" />

      <div className="card details__card">
        <p className="details__day">{EVENT.dayLabel}</p>
        <p className="details__date">{EVENT.dateLabel}</p>
        <p className="details__time">{EVENT.timeLabel}</p>

        <div className="details__separator" aria-hidden="true" />

        <address className="details__address">
          {EVENT.addressLine1}
          <br />
          {EVENT.addressLine2}
        </address>

        <div className="details__actions">
          {ACTIONS.map((action) => (
            <a
              key={action.label}
              className="btn btn--outline"
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">{action.icon}</span> {action.label}
            </a>
          ))}

          {/* Butang ini membuka pilihan maklum balas, bukan terus ke WhatsApp */}
          <ContactButton className="btn btn--outline">
            <span aria-hidden="true">💬</span> Hubungi Tuan Rumah
          </ContactButton>
        </div>
      </div>

      <Countdown />
    </section>
  )
}
