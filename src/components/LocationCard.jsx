import { EVENT, GOOGLE_MAPS_URL, WAZE_URL } from '../config.js'
import SectionTitle from './SectionTitle.jsx'

/** Kad lokasi dengan alamat dan pautan navigasi. */
export default function LocationCard() {
  return (
    <section className="section location" id="lokasi">
      <SectionTitle script="Menanti Kehadiran Anda" title="Lokasi Majlis" />

      <div className="card location__card">
        <div className="location__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4 C 15 4, 8 11, 8 20 C 8 32, 24 44, 24 44 C 24 44, 40 32, 40 20 C 40 11, 33 4, 24 4Z"
              fill="#F6D6E0"
              stroke="#8B4C70"
              strokeWidth="2"
            />
            <circle cx="24" cy="20" r="6" fill="#FFFFFF" stroke="#8B4C70" strokeWidth="2" />
          </svg>
        </div>

        <address className="location__address">
          {EVENT.addressLine1}
          <br />
          {EVENT.addressLine2}
        </address>

        <div className="location__actions">
          <a className="btn btn--solid" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            Google Maps
          </a>
          <a className="btn btn--outline" href={WAZE_URL} target="_blank" rel="noopener noreferrer">
            Waze
          </a>
        </div>
      </div>
    </section>
  )
}
