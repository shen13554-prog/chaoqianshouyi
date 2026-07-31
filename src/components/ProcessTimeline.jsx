export default function ProcessTimeline({
  steps,
  activeStep,
  onSelect,
  onExpand,
}) {
  return (
    <section className="process-timeline" aria-labelledby="timeline-title">
      <div className="process-section-heading">
        <p>NINE CRAFT STAGES</p>
        <h2 id="timeline-title">九道工序</h2>
        <span aria-hidden="true" />
        <p>点击工序节点，查看工具、技法与作品在当下阶段的变化。</p>
      </div>

      <div className="timeline-rail" aria-label="九道制作工序">
        {steps.map((step) => (
          <button
            type="button"
            key={step.number}
            className={step.number === activeStep.number ? 'is-active' : ''}
            onClick={() => onSelect(step)}
            aria-pressed={step.number === activeStep.number}
          >
            <span>{step.number}</span>
            {step.title}
          </button>
        ))}
      </div>

      <article className="timeline-detail" key={activeStep.number}>
        <button
          type="button"
          className="timeline-detail__image-button"
          onClick={() => onExpand(activeStep.image, activeStep.title)}
          aria-label={`放大查看${activeStep.title}`}
        >
          <img src={activeStep.image} alt={`${activeStep.title}工艺场景`} />
          <span>查看工艺大图</span>
        </button>

        <div className="timeline-detail__content">
          <p className="timeline-detail__number">{activeStep.number}</p>
          <h3>{activeStep.title}</h3>
          <div className="timeline-detail__tools">
            <span>使用工具</span>
            <strong>{activeStep.tools}</strong>
          </div>
          <div className="timeline-detail__description">
            <div>
              <p>技法说明</p>
              <span>{activeStep.technique}</span>
            </div>
            <div>
              <p>阶段效果</p>
              <span>{activeStep.result}</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
