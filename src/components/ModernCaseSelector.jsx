export default function ModernCaseSelector({ cases, activeId, onSelect }) {
  return (
    <section className="modern-cases section-container" aria-labelledby="modern-cases-title">
      <div className="modern-section-heading">
        <p>TWO DESIGN PATHS</p>
        <h2 id="modern-cases-title">两种转译路径</h2>
        <span aria-hidden="true" />
      </div>

      <div className="modern-case-grid">
        {cases.map((item) => (
          <button
            type="button"
            className={item.id === activeId ? 'modern-case-card is-active' : 'modern-case-card'}
            key={item.id}
            onClick={() => onSelect(item)}
            aria-pressed={item.id === activeId}
            aria-label={`${item.number} ${item.title}`}
          >
            <span className="modern-case-card__number">{item.number}</span>
            <span className="modern-case-card__placeholder" aria-hidden="true">
              <i />
            </span>
            <strong>{item.title}</strong>
            <span className="modern-case-card__summary">{item.summary}</span>
            <span className="modern-case-card__action">进入案例</span>
          </button>
        ))}
      </div>
    </section>
  )
}
