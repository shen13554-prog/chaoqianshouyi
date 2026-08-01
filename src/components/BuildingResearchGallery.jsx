export default function BuildingResearchGallery({ images, activeId, onToggle }) {
  const activeBuilding = images.find((image) => image.id === activeId) ?? null

  return (
    <section className="building-research" aria-labelledby="building-cases-title">
      <div className="building-research__heading">
        <p>ARCHITECTURE CASES</p>
        <h4 id="building-cases-title">建筑案例</h4>
      </div>

      <div className="modern-source-gallery building-research__grid">
        {images.map((image) => {
          const isActive = image.id === activeId

          return (
            <button
              type="button"
              className={isActive ? 'building-research-card is-active' : 'building-research-card'}
              aria-label={`${isActive ? '关闭' : '查看'}${image.name}研究详情`}
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls="building-research-detail"
              key={image.id}
              onClick={() => onToggle(image.id)}
            >
              <figure>
                <img src={image.src} alt={image.name} />
                <figcaption>{image.name}</figcaption>
              </figure>
            </button>
          )
        })}
      </div>

      {activeBuilding ? (
        <section
          className="building-research-detail"
          id="building-research-detail"
          aria-label={`${activeBuilding.name}研究详情`}
        >
          <div className="building-research-detail__image">
            <img src={activeBuilding.src} alt={`${activeBuilding.name}建筑放大展示`} />
          </div>
          <div className="building-research-detail__copy">
            <p>ARCHITECTURE RESEARCH</p>
            <h4 className={activeBuilding.id === 'guangji-tianhou' ? 'building-research-detail__title--long' : undefined}>
              {activeBuilding.name}
            </h4>
            <dl>
              <div>
                <dt>建筑类型</dt>
                <dd>{activeBuilding.type}</dd>
              </div>
              <div>
                <dt>嵌瓷应用位置</dt>
                <dd>{activeBuilding.location}</dd>
              </div>
              <div>
                <dt>文化寓意</dt>
                <dd>{activeBuilding.meaning}</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}
    </section>
  )
}
