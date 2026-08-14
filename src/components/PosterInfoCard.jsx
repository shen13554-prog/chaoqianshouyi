export function resolvePosterCardSide({ side, area }) {
  if (side === 'left' || side === 'right') return side

  const centerX = parseFloat(area.left) + parseFloat(area.width) / 2
  return centerX <= 50 ? 'right' : 'left'
}

export default function PosterInfoCard({ hotspot, isActive }) {
  const { title, summary, points, area } = hotspot
  const cardSide = resolvePosterCardSide(hotspot)
  const centerX = parseFloat(area.left) + parseFloat(area.width) / 2
  const centerY = parseFloat(area.top) + parseFloat(area.height) / 2

  return (
    <div
      aria-hidden={!isActive}
      className={`poster-info poster-info--${cardSide}${isActive ? ' is-active' : ''}`}
      data-testid="poster-info-card"
      style={{
        '--hotspot-x': `${centerX}%`,
        '--hotspot-y': `${centerY}%`,
      }}
    >
      <span className="poster-info__connector" aria-hidden="true" />
      <article className="poster-info__card" role={isActive ? 'status' : undefined}>
        <span>POSTER ARCHIVE</span>
        <h3>{title}</h3>
        <p>{summary}</p>
        <ul>
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </article>
    </div>
  )
}
