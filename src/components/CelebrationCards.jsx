import { CHILDREN } from '../config.js'
import SectionTitle from './SectionTitle.jsx'
import { Ribbon } from './decor/Decor.jsx'

/** Kad raikan untuk setiap puteri. */
export default function CelebrationCards() {
  return (
    <section className="section celebration" id="raikan">
      <SectionTitle script="Buah Hati Kami" title="Yang Diraikan" />
      <div className="celebration__grid">
        {CHILDREN.map((child) => (
          <article key={child.name} className="card celebration__card">
            <div className="celebration__photo">
              <img src={child.cardImage} alt={child.name} loading="lazy" />
            </div>
            <Ribbon className="celebration__ribbon" />
            <h3 className="celebration__name">{child.name}</h3>
            <p className="celebration__birth">{child.birthLabel}</p>
            <p className="celebration__what">{child.celebration}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
