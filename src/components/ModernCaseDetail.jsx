function ExhibitPlaceholder({ label }) {
  return (
    <div className="modern-placeholder" role="img" aria-label={`${label}占位区域`}>
      <span aria-hidden="true" />
      <p>{label}</p>
      <small>IMAGE PLACEHOLDER</small>
    </div>
  )
}

export default function ModernCaseDetail({ item, detailRef }) {
  return (
    <section className="modern-detail" ref={detailRef} aria-labelledby="modern-detail-title">
      <header className="modern-detail__header section-container">
        <p>{item.number} · DESIGN CASE</p>
        <h2 id="modern-detail-title">{item.title}</h2>
        <span aria-hidden="true" />
        <p>{item.summary}</p>
      </header>

      <div className="modern-detail__flow section-container" key={item.id}>
        <article className="modern-detail-block">
          <div className="modern-detail-block__copy">
            <p>01 / ORIGIN</p>
            <h3>传统来源</h3>
            <span>{item.source}</span>
          </div>
          <ExhibitPlaceholder label="传统作品展示" />
        </article>

        <article className="modern-detail-block modern-detail-block--reverse">
          <div className="modern-detail-block__copy">
            <p>02 / EXTRACT</p>
            <h3>嵌瓷元素提取</h3>
            <ul>
              {item.elements.map((element) => <li key={element}>{element}</li>)}
            </ul>
          </div>
          <ExhibitPlaceholder label="纹样提取预览" />
        </article>

        <article className="modern-detail-block">
          <div className="modern-detail-block__copy">
            <p>03 / APPLY</p>
            <h3>现代设计应用</h3>
            <span>{item.application}</span>
          </div>
          <ExhibitPlaceholder label="现代应用预览" />
        </article>

        <article className="modern-concept">
          <p>04 / CONCEPT</p>
          <h3>设计说明</h3>
          <blockquote>{item.concept}</blockquote>
        </article>
      </div>
    </section>
  )
}
