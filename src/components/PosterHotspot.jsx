export default function PosterHotspot({ hotspot, isActive, onActivate }) {
  const { id, title, summary, points, side, area } = hotspot

  return (
    <div
      aria-label={`查看${title}`}
      className={`poster-hotspot poster-hotspot--${side}${isActive ? ' is-active' : ''}`}
      data-testid="poster-hotspot"
      role="button"
      style={area}
      onMouseEnter={() => onActivate(id)}
      onMouseLeave={() => onActivate(null)}
    >
      {isActive && (
        <>
          <span className="poster-hotspot__connector" aria-hidden="true" />
          <article className="poster-hotspot__card" role="status">
            <span>POSTER ARCHIVE</span>
            <h3>{title}</h3>
            <p>{summary}</p>
            <ul>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </>
      )}
    </div>
  )
}
