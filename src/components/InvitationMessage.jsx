import { TEXT, HOSTS } from '../config.js'
import SectionTitle from './SectionTitle.jsx'

/** Kata-kata jemputan rasmi daripada tuan rumah. */
export default function InvitationMessage() {
  return (
    <section className="section invitation" id="jemputan">
      <SectionTitle script="Dengan Sukacitanya" title="Kami Menjemput Anda" />
      <div className="card invitation__card">
        <p className="invitation__text">{TEXT.invitation}</p>
        <p className="invitation__note">{TEXT.invitationNote}</p>

        <div className="hosts">
          <p className="hosts__intro">{HOSTS.intro}</p>
          <p className="hosts__name">{HOSTS.names[0]}</p>
          <p className="hosts__amp" aria-hidden="true">
            &amp;
          </p>
          <p className="hosts__name">{HOSTS.names[1]}</p>
          <p className="hosts__suffix">{HOSTS.suffix}</p>
        </div>
      </div>
    </section>
  )
}
