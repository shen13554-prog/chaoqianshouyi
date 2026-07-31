import { Link } from 'react-router-dom'

export default function ExploreCard({
  image,
  title,
  description,
  to,
}) {
  return (
    <article className="explore-card">
      <Link className="explore-card__link" to={to} aria-label={title}>
        <span className="explore-card__image-frame">
          <img src={image} alt="" />
        </span>
        <h3>{title}</h3>
      </Link>
      <p>{description}</p>
      <Link className="text-link" to={to}>
        进入展览
      </Link>
    </article>
  )
}
