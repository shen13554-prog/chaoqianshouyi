export default function ImageCard({ image, title, description }) {
  return (
    <article className="image-card">
      <div className="image-card__media">
        <img src={image} alt={title} />
      </div>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </article>
  )
}
