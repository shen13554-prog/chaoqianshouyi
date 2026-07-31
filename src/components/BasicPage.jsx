export default function BasicPage({ title, intro, images }) {
  return (
    <div className="basic-page">
      <section className="basic-page__heading">
        <p className="basic-page__label">潮汕嵌瓷 · 数字展陈</p>
        <h1>{title}</h1>
        <span aria-hidden="true" />
        <p>{intro}</p>
      </section>

      <section className="basic-gallery" aria-label={`${title}图片展示`}>
        {images.map((image) => (
          <figure className="basic-gallery__item" key={image.src}>
            <img src={image.src} alt={image.alt} />
            <figcaption>{image.alt}</figcaption>
          </figure>
        ))}
      </section>
    </div>
  )
}
