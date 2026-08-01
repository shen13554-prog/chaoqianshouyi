import { useState } from 'react'
import { inheritors } from '../data/inheritors'

const detailFields = [
  ['身份', 'identity'],
  ['传承年代', 'era'],
  ['主要技艺', 'skills'],
  ['代表作品', 'works'],
  ['传承贡献', 'contribution'],
]

export default function InheritorLineage() {
  const [activeId, setActiveId] = useState(inheritors[0].id)
  const activeInheritor =
    inheritors.find((inheritor) => inheritor.id === activeId) ?? inheritors[0]

  return (
    <section className="inheritor-lineage" aria-label="嵌瓷技艺传承谱系">
      <div className="inheritor-lineage__stage">
        <div className="inheritor-lineage__pattern" aria-hidden="true" />

        <svg
          className="inheritor-lineage__ridge"
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M 18 88 C 142 110 156 226 304 244 C 430 259 500 216 600 205 C 700 216 770 259 896 244 C 1044 226 1058 110 1182 88" />
          <path
            className="inheritor-lineage__ridge-shadow"
            d="M 18 103 C 142 125 156 241 304 259 C 430 274 500 231 600 220 C 700 231 770 274 896 259 C 1044 241 1058 125 1182 103"
          />
        </svg>

        <div className="inheritor-lineage__shards" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        {inheritors.map((inheritor) => {
          const isActive = inheritor.id === activeId

          return (
            <div
              className="inheritor-node"
              key={inheritor.id}
              style={inheritor.position}
            >
              <span className="inheritor-node__marker" aria-hidden="true">
                {inheritor.marker}
              </span>
              <button
                className={`inheritor-node__button${isActive ? ' is-active' : ''}`}
                type="button"
                aria-label={inheritor.name}
                aria-pressed={isActive}
                onClick={() => setActiveId(inheritor.id)}
              >
                <span className="inheritor-node__portrait">
                  <span
                    className="inheritor-node__media"
                    style={{
                      '--portrait-size': inheritor.portrait.size,
                      '--portrait-x': inheritor.portrait.x,
                      '--portrait-y': inheritor.portrait.y,
                    }}
                  >
                    <img
                      src={inheritor.image}
                      alt={inheritor.name}
                      style={{
                        objectPosition: inheritor.portrait.objectPosition,
                      }}
                    />
                  </span>
                </span>
                <strong>{inheritor.name}</strong>
              </button>
            </div>
          )
        })}
      </div>

      <article
        className="inheritor-detail"
        key={activeInheritor.id}
        role="region"
        aria-label={`${activeInheritor.name}人物档案`}
        aria-live="polite"
      >
        <div className="inheritor-detail__visual">
          <span className="inheritor-detail__seal" aria-hidden="true">
            守艺
          </span>
          <img src={activeInheritor.image} alt={activeInheritor.name} />
        </div>

        <div className="inheritor-detail__content">
          <p className="inheritor-detail__eyebrow">非遗人物数字档案</p>
          <h2>{activeInheritor.name}</h2>
          <span className="inheritor-detail__rule" aria-hidden="true" />

          <dl>
            {detailFields.map(([label, key]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{activeInheritor.details[key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </section>
  )
}
