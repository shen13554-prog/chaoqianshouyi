import { Link } from 'react-router-dom'

export default function HistoryDetailCard({ item }) {
  return (
    <section
      className="history-detail"
      aria-label={`${item.period}历史详情`}
      key={item.id}
    >
      <div className="history-detail__visual">
        <img src={item.image} alt={item.imageAlt} />
        <span>{item.period}</span>
      </div>

      <div className="history-detail__content">
        <p className="history-detail__eyebrow">{item.year} · CHAOZHOU INLAY</p>
        <h2>{item.title}</h2>
        <strong>{item.summary}</strong>
        <p>{item.detail}</p>

        {item.caseStudy ? (
          <Link
            className="history-case"
            to={item.caseStudy.to}
            aria-label={`查看${item.caseStudy.name}建筑案例`}
          >
            <img src={item.caseStudy.image} alt={item.caseStudy.name} />
            <span>
              <small>关联建筑案例</small>
              <b>{item.caseStudy.name}</b>
              <em>{item.caseStudy.description}</em>
              <i>查看{item.caseStudy.name}建筑案例</i>
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  )
}
