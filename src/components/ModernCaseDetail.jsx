function ExhibitPlaceholder({ label }) {
  return (
    <div className="modern-placeholder" role="img" aria-label={`${label}占位区域`}>
      <span aria-hidden="true" />
      <p>{label}</p>
      <small>IMAGE PLACEHOLDER</small>
    </div>
  )
}

function SourceGallery({ images }) {
  return (
    <div className="modern-source-gallery" aria-label="传统建筑来源">
      {images.map((image) => (
        <figure key={image.src}>
          <img src={image.src} alt={image.name} />
          <figcaption>{image.name}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function ExtractionGallery({ extractions }) {
  return (
    <div className="modern-extraction-grid">
      {extractions.map((extraction) => (
        <section className="modern-extraction-item" key={extraction.id}>
          <div className="modern-extraction-item__copy">
            <p>{extraction.number}</p>
            <h4>{extraction.title}</h4>
            <span>{extraction.description}</span>
          </div>
          <ExhibitPlaceholder label={extraction.title} />
        </section>
      ))}
    </div>
  )
}

export default function ModernCaseDetail({
  item,
  detailRef,
  showHeader = true,
  showModernTranslation = true,
}) {
  return (
    <section
      className="modern-detail"
      ref={detailRef}
      aria-label={showHeader ? undefined : item.title}
      aria-labelledby={showHeader ? 'modern-detail-title' : undefined}
    >
      {showHeader && (
        <header className="modern-detail__header section-container">
          <p>{item.number} · DESIGN CASE</p>
          <h2 id="modern-detail-title">{item.title}</h2>
          <span aria-hidden="true" />
          <p>{item.summary}</p>
        </header>
      )}

      <div className="modern-detail__flow section-container" key={item.id}>
        <article className="modern-detail-block">
          <div className="modern-detail-block__copy">
            <p>01 / ORIGIN</p>
            <h3>传统来源</h3>
            <span>{item.source}</span>
          </div>
          {item.sourceImages?.length
            ? <SourceGallery images={item.sourceImages} />
            : <ExhibitPlaceholder label="传统作品展示" />}
        </article>

        <article className={`modern-detail-block ${item.extractions?.length ? 'modern-detail-block--extraction' : 'modern-detail-block--reverse'}`}>
          <div className="modern-detail-block__copy">
            <p>02 / EXTRACT</p>
            <h3>嵌瓷元素提取</h3>
            {!item.extractions?.length && (
              <ul>
                {item.elements.map((element) => <li key={element}>{element}</li>)}
              </ul>
            )}
          </div>
          {item.extractions?.length
            ? <ExtractionGallery extractions={item.extractions} />
            : <ExhibitPlaceholder label="纹样提取预览" />}
        </article>

        {showModernTranslation && (
          <>
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
          </>
        )}
      </div>
    </section>
  )
}
