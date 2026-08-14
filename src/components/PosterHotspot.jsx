export default function PosterHotspot({ hotspot, isActive, onActivate }) {
  const { id, title, side, area } = hotspot

  return (
    <div
      aria-label={`查看${title}`}
      className={`poster-hotspot poster-hotspot--${side}${isActive ? ' is-active' : ''}`}
      data-testid="poster-hotspot"
      role="button"
      style={area}
      onMouseEnter={() => onActivate(id)}
      onMouseLeave={() => onActivate(null)}
    />
  )
}
