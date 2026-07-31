export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <span className="section-title__line" aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <span className="section-title__line" aria-hidden="true" />
    </div>
  )
}
