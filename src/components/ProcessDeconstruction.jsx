export default function ProcessDeconstruction({
  layers,
  activeLayer,
  onSelect,
  onExpand,
}) {
  return (
    <section className="process-deconstruction" aria-labelledby="deconstruction-title">
      <div className="process-section-heading">
        <p>DECONSTRUCT THE CRAFT</p>
        <h2 id="deconstruction-title">材料拆解</h2>
        <span aria-hidden="true" />
        <p>从完整作品逐层深入，理解瓷片、灰浆、骨架与工具如何共同成艺。</p>
      </div>

      <div className="deconstruction-stage">
        <div className="deconstruction-stage__visual">
          <p className="deconstruction-stage__index">
            {String(layers.findIndex((layer) => layer.id === activeLayer.id) + 1).padStart(2, '0')}
            <span>/ {String(layers.length).padStart(2, '0')}</span>
          </p>
          <button
            type="button"
            className="deconstruction-stage__image-button"
            onClick={() => onExpand(activeLayer.image, activeLayer.name)}
            aria-label={`放大查看${activeLayer.name}`}
          >
            <img
              key={activeLayer.id}
              src={activeLayer.image}
              alt={activeLayer.name}
            />
            <span>点击放大</span>
          </button>
        </div>

        <div className="deconstruction-stage__content">
          <div className="deconstruction-tabs" aria-label="材料拆解层级">
            {layers.map((layer) => (
              <button
                type="button"
                key={layer.id}
                className={layer.id === activeLayer.id ? 'is-active' : ''}
                onClick={() => onSelect(layer)}
                aria-pressed={layer.id === activeLayer.id}
              >
                {layer.name}
              </button>
            ))}
          </div>

          <div className="layer-detail" key={activeLayer.id} aria-live="polite">
            <p className="layer-detail__label">当前拆解</p>
            <h3>{activeLayer.name}</h3>
            <dl>
              <div>
                <dt>名称</dt>
                <dd>{activeLayer.detailName}</dd>
              </div>
              <div>
                <dt>作用</dt>
                <dd>{activeLayer.role}</dd>
              </div>
              <div>
                <dt>制作方式</dt>
                <dd>{activeLayer.method}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
