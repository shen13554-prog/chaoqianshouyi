import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const BUILDING_GUIDE_STORAGE_KEY = 'chaoqianshouyi-building-guide-seen'

export default function BuildingResearchGallery({ images, activeId, onToggle }) {
  const gridRef = useRef(null)
  const [showGuide, setShowGuide] = useState(
    () => window.localStorage.getItem(BUILDING_GUIDE_STORAGE_KEY) !== 'true',
  )
  const [guideTarget, setGuideTarget] = useState(null)
  const activeBuilding = images.find((image) => image.id === activeId) ?? null

  useEffect(() => {
    if (!showGuide || !gridRef.current) return undefined

    const updateGuideTarget = () => {
      const rect = gridRef.current.getBoundingClientRect()

      setGuideTarget({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }

    gridRef.current.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    updateGuideTarget()
    window.addEventListener('resize', updateGuideTarget)
    window.addEventListener('scroll', updateGuideTarget, { passive: true })

    return () => {
      window.removeEventListener('resize', updateGuideTarget)
      window.removeEventListener('scroll', updateGuideTarget)
    }
  }, [showGuide])

  const dismissGuide = () => {
    window.localStorage.setItem(BUILDING_GUIDE_STORAGE_KEY, 'true')
    setShowGuide(false)
  }

  const handleBuildingClick = (imageId) => {
    if (showGuide) dismissGuide()
    onToggle(imageId)
  }

  const guideSpotlightStyle = guideTarget ? {
    top: guideTarget.top - 8,
    left: guideTarget.left - 8,
    width: guideTarget.width + 16,
    height: guideTarget.height + 16,
  } : undefined

  const placeGuideBeside = guideTarget?.left >= 480
  const guideCardStyle = guideTarget ? (placeGuideBeside ? {
    top: Math.max(24, Math.min(guideTarget.top + 24, window.innerHeight - 190)),
    left: Math.max(220, guideTarget.left - 238),
  } : {
    top: Math.max(24, Math.min(guideTarget.top - 164, window.innerHeight - 190)),
    left: Math.min(
      Math.max(220, guideTarget.left + guideTarget.width / 2),
      window.innerWidth - 220,
    ),
  }) : undefined

  return (
    <section className="building-research" aria-labelledby="building-cases-title">
      <div className="building-research__heading">
        <p>ARCHITECTURE CASES</p>
        <h4 id="building-cases-title">建筑案例</h4>
      </div>

      <div
        ref={gridRef}
        className={`modern-source-gallery building-research__grid${showGuide ? ' is-guided' : ''}`}
      >
        {images.map((image) => {
          const isActive = image.id === activeId

          return (
            <button
              type="button"
              className={isActive ? 'building-research-card is-active' : 'building-research-card'}
              aria-label={`${isActive ? '关闭' : '查看'}${image.name}研究详情`}
              aria-pressed={isActive}
              aria-expanded={isActive}
              aria-controls="building-research-detail"
              key={image.id}
              onClick={() => handleBuildingClick(image.id)}
            >
              <figure>
                <img src={image.src} alt={image.name} />
                <figcaption>{image.name}</figcaption>
              </figure>
            </button>
          )
        })}
      </div>

      {showGuide ? createPortal((
        <aside
          className="building-guide"
          role="region"
          aria-label="建筑案例使用引导"
        >
          <div
            className="building-guide__spotlight"
            style={guideSpotlightStyle}
            aria-hidden="true"
          />
          <div
            className={`building-guide__card${placeGuideBeside ? ' building-guide__card--side' : ''}`}
            style={guideCardStyle}
          >
            <span className="building-guide__arrow" aria-hidden="true" />
            <p>点击建筑图片，探索建筑背后的嵌瓷文化与详细资料</p>
            <button type="button" onClick={dismissGuide}>知道了</button>
          </div>
        </aside>
      ), document.body) : null}

      {activeBuilding ? createPortal((
        <div
          className="building-research-modal"
          data-testid="building-modal-backdrop"
          onClick={() => onToggle(activeBuilding.id)}
        >
          <section
            className="building-research-detail building-research-modal__dialog"
            id="building-research-detail"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeBuilding.name}研究详情`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="building-research-modal__close"
              aria-label={`关闭${activeBuilding.name}研究详情`}
              onClick={() => onToggle(activeBuilding.id)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="building-research-detail__image">
              <img src={activeBuilding.src} alt={`${activeBuilding.name}建筑放大展示`} />
            </div>
            <div className="building-research-detail__copy">
              <p>ARCHITECTURE RESEARCH</p>
              <h4 className={activeBuilding.id === 'guangji-tianhou' ? 'building-research-detail__title--long' : undefined}>
                {activeBuilding.name}
              </h4>
              <dl>
                <div>
                  <dt>建筑类型</dt>
                  <dd>{activeBuilding.type}</dd>
                </div>
                <div>
                  <dt>嵌瓷应用位置</dt>
                  <dd>{activeBuilding.location}</dd>
                </div>
                <div>
                  <dt>文化寓意</dt>
                  <dd>{activeBuilding.meaning}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      ), document.body) : null}
    </section>
  )
}
