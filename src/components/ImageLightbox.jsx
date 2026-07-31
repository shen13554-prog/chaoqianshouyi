export default function ImageLightbox({ image, title, onClose }) {
  if (!image) {
    return null
  }

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="image-lightbox__backdrop"
        onClick={onClose}
        aria-label="点击遮罩关闭图片"
      />
      <div className="image-lightbox__content">
        <p>{title}</p>
        <img src={image} alt={title} />
        <button type="button" onClick={onClose} aria-label="关闭图片">
          关闭
        </button>
      </div>
    </div>
  )
}
