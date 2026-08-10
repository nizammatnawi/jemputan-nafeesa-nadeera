import { Sparkle } from './decor/Decor.jsx'

/** Tajuk seksyen yang seragam dengan pembahagi emas halus. */
export default function SectionTitle({ script, title }) {
  return (
    <div className="section-title">
      {script && <p className="section-title__script">{script}</p>}
      <h2 className="section-title__heading">{title}</h2>
      <div className="section-title__divider" aria-hidden="true">
        <span />
        <Sparkle className="section-title__sparkle" />
        <span />
      </div>
    </div>
  )
}
