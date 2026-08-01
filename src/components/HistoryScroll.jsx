export default function HistoryScroll({ items, activeId, onSelect }) {
  return (
    <section className="history-scroll" aria-label="潮州嵌瓷历史长卷">
      <div className="history-scroll__heading">
        <div>
          <p>DEVELOPMENT HISTORY</p>
          <h2>循迹千年</h2>
        </div>
        <span>横向浏览 · 点击印章查看历史</span>
      </div>

      <div className="history-scroll__viewport">
        <div className="history-scroll__track">
          {items.map((item, index) => {
            const isActive = item.id === activeId
            const sealClassName = [
              'history-seal',
              isActive ? 'is-active' : '',
              item.period.length > 5 ? 'is-long' : '',
            ].filter(Boolean).join(' ')

            return (
              <article
                className={index % 2 === 0 ? 'history-scroll__stop' : 'history-scroll__stop is-lower'}
                key={item.id}
              >
                <figure className="history-scroll__preview">
                  <img src={item.image} alt="" />
                </figure>
                <button
                  type="button"
                  className={sealClassName}
                  aria-label={item.period}
                  aria-pressed={isActive}
                  onClick={() => onSelect(item.id)}
                >
                  <span>{item.period}</span>
                  <small>{item.year}</small>
                </button>
                <p className="history-scroll__caption">{item.title}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
