import { TEXT } from '../config.js'
import SectionTitle from './SectionTitle.jsx'

/** Doa untuk anak-anak. */
export default function Doa() {
  return (
    <section className="section doa" id="doa">
      <SectionTitle script="Amin Ya Rabbal Alamin" title="Doa" />
      <div className="card doa__card">
        <span className="doa__quote" aria-hidden="true">
          ❝
        </span>
        <p className="doa__text">{TEXT.doa}</p>
      </div>
    </section>
  )
}
