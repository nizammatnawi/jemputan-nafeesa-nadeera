import { PROGRAMME } from '../config.js'
import SectionTitle from './SectionTitle.jsx'

/** Aturcara majlis dalam bentuk garis masa menegak. */
export default function Programme() {
  return (
    <section className="section programme" id="aturcara">
      <SectionTitle script="Susunan Acara" title="Aturcara Majlis" />

      <ol className="programme__list">
        {PROGRAMME.map((slot) => (
          <li key={slot.time} className="programme__slot">
            <span className="programme__dot" aria-hidden="true" />
            <p className="programme__time">{slot.time}</p>
            <ul className="programme__items">
              {slot.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
