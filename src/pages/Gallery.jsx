import { useEffect, useState } from 'react'
import { works } from '../data/works'

const formatWorkName = (category, index) =>
  `${category}作品 ${String(index + 1).padStart(2, '0')}`

const makingExperiences = {
  半浮嵌: [
    {
      title: '选择瓷片',
      description: '依照纹样色彩和浅浮雕轮廓，挑选釉色协调、厚薄适合的瓷片。',
      image: '/images/process/sorting.webp',
    },
    {
      title: '拼接纹样',
      description: '先按画面轮廓推演瓷片的方向与疏密关系，使纹样在浅层起伏中保持连贯。',
    },
    {
      title: '嵌贴装饰',
      description: '将选好的瓷片顺着灰塑底形逐片嵌贴，以排列方向强化纹样层次。',
      image: '/images/process/inlay.webp',
    },
    {
      title: '完成作品',
      description: '校准轮廓并补齐细节，使平面秩序与浅浮雕体量形成完整画面。',
      useFinishedWork: true,
    },
  ],
  立体嵌: [
    {
      title: '绘制草图',
      description: '根据题材绘制造型草图，确定作品姿态、比例与主要装饰区域。',
      image: '/images/process/sketch.webp',
    },
    {
      title: '扎骨定形',
      description: '依据草图扎制支撑骨架，为立体造型建立轮廓、体量与受力关系。',
      image: '/images/process/frame.webp',
    },
    {
      title: '灰浆塑形',
      description: '在骨架表面分层敷灰塑造形体，使主要结构与细部起伏逐步成形。',
      image: '/images/process/plaster.webp',
    },
    {
      title: '嵌入瓷片',
      description: '顺应立体表面的转折嵌入彩瓷，以色彩和排列强化结构层次。',
      image: '/images/process/inlay.webp',
    },
    {
      title: '完成造型',
      description: '整理连接处与外轮廓，让作品从不同角度都保持完整而清晰的形态。',
      useFinishedWork: true,
    },
  ],
  平嵌: [
    {
      title: '分色选片',
      description: '按照纹样的色彩区域挑选瓷片，兼顾釉色、尺寸与表面质感。',
      image: '/images/process/sorting.webp',
    },
    {
      title: '剪修瓷片',
      description: '依照线条和色块需要剪修瓷片，使边缘适合后续紧密排列。',
      image: '/images/process/trimming.webp',
    },
    {
      title: '排列纹样',
      description: '沿纹样走向安排瓷片的次序、方向与间距，逐步形成连续装饰。',
    },
    {
      title: '完成装饰',
      description: '补齐边缘与细部色块，使平整表面呈现连续、清晰的装饰效果。',
      useFinishedWork: true,
    },
  ],
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeExperienceStep, setActiveExperienceStep] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [previewImageIndex, setPreviewImageIndex] = useState(null)
  const activeCategory = works[activeIndex]
  const activeExperience = makingExperiences[activeCategory.name]
  const currentMakingStep = activeExperience[activeExperienceStep]
  const currentMakingImage = currentMakingStep.useFinishedWork
    ? activeCategory.images[0]
    : currentMakingStep.image ?? null
  const selectedImage =
    selectedImageIndex === null
      ? null
      : activeCategory.images[selectedImageIndex]
  const selectedWorkName =
    selectedImageIndex === null
      ? ''
      : formatWorkName(activeCategory.name, selectedImageIndex)
  const previewImage =
    previewImageIndex === null
      ? null
      : activeCategory.images[previewImageIndex]
  const previewWorkName =
    previewImageIndex === null
      ? ''
      : formatWorkName(activeCategory.name, previewImageIndex)

  const selectCategory = (index) => {
    setActiveIndex(index)
    setActiveExperienceStep(0)
    setSelectedImageIndex(null)
    setPreviewImageIndex(null)
  }

  const openWork = (index) => {
    setSelectedImageIndex(index)
    setPreviewImageIndex(index)
  }

  const closePreview = () => setPreviewImageIndex(null)

  useEffect(() => {
    if (previewImageIndex === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closePreview()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [previewImageIndex])

  return (
    <>
      <div className="basic-page gallery-page">
      <section className="basic-page__heading">
        <p className="basic-page__label">潮汕嵌瓷 · 技法作品档案</p>
        <h1>嵌瓷作品</h1>
        <span aria-hidden="true" />
        <p>从平嵌到立体嵌，观赏瓷片在不同塑形方式中呈现的色彩、层次与神韵。</p>
      </section>

      <nav className="works-tabs" aria-label="作品技法分类">
        {works.map((category, index) => (
          <button
            className={`works-tabs__button${index === activeIndex ? ' is-active' : ''}`}
            key={category.name}
            type="button"
            aria-pressed={index === activeIndex}
            onClick={() => selectCategory(index)}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {category.name}
          </button>
        ))}
      </nav>

      <section
        className="making-experience"
        aria-label={`${activeCategory.name}制作体验`}
      >
        <div className="making-experience__heading">
          <div>
            <p>MAKING EXPERIENCE</p>
            <h2>制作体验</h2>
          </div>
          <p>点击步骤，了解{activeCategory.name}从准备到完成的制作关系。</p>
        </div>

        <div className="making-experience__steps" role="group" aria-label="制作步骤">
          {activeExperience.map((step, index) => (
            <button
              className={`making-experience__step${index === activeExperienceStep ? ' is-active' : ''}`}
              key={step.title}
              type="button"
              aria-pressed={index === activeExperienceStep}
              onClick={() => setActiveExperienceStep(index)}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {step.title}
            </button>
          ))}
        </div>

        <div
          className={`making-experience__display${currentMakingImage ? '' : ' is-text-only'}`}
        >
          {currentMakingImage && (
            <div
              className="making-experience__media"
              key={`${activeCategory.name}-${currentMakingStep.title}`}
            >
              <img
                src={currentMakingImage}
                alt={`${activeCategory.name}制作体验：${currentMakingStep.title}`}
              />
            </div>
          )}
          <div className="making-experience__content">
            <p>
              步骤 {String(activeExperienceStep + 1).padStart(2, '0')} /{' '}
              {String(activeExperience.length).padStart(2, '0')}
            </p>
            <h3>{currentMakingStep.title}</h3>
            <span aria-hidden="true" />
            <p>{currentMakingStep.description}</p>
          </div>
        </div>
      </section>

      <section className="works-exhibition" aria-label={`${activeCategory.name}作品展示`}>
        <div className="works-exhibition__heading">
          <div>
            <p>TECHNIQUE ARCHIVE</p>
            <h2>{activeCategory.name}</h2>
          </div>
          <p>{activeCategory.description}</p>
        </div>

        <div className="works-exhibition__grid">
          {activeCategory.images.map((image, index) => {
            const workName = formatWorkName(activeCategory.name, index)

            return (
              <button
                className={`works-exhibition__item${selectedImageIndex === index ? ' is-active' : ''}`}
                key={image}
                type="button"
                aria-label={`查看${workName}`}
                aria-pressed={selectedImageIndex === index}
                onClick={() => openWork(index)}
              >
                <span className="works-exhibition__media">
                  <img src={image} alt={workName} />
                </span>
                <span className="works-exhibition__caption">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {workName}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {selectedImage && (
        <section
          className="work-detail"
          aria-label={`${selectedWorkName}详情`}
          aria-live="polite"
        >
          <div className="work-detail__media">
            <img src={selectedImage} alt={selectedWorkName} />
          </div>
          <div className="work-detail__content">
            <p className="work-detail__label">作品档案 · WORK ARCHIVE</p>
            <h2>{selectedWorkName}</h2>
            <span className="work-detail__line" aria-hidden="true" />
            <dl>
              <div>
                <dt>技法分类</dt>
                <dd>{activeCategory.name}</dd>
              </div>
              <div>
                <dt>工艺特点</dt>
                <dd>{activeCategory.craft}</dd>
              </div>
              <div>
                <dt>应用场景</dt>
                <dd>{activeCategory.application}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}
      </div>

      {previewImage && (
        <div
          className="work-preview-backdrop"
          data-testid="work-preview-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewWorkName}图片预览`}
          onClick={(event) => {
            if (event.target === event.currentTarget) closePreview()
          }}
        >
          <article className="work-preview">
            <button
              className="work-preview__close"
              type="button"
              aria-label="关闭图片预览"
              onClick={closePreview}
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="work-preview__media">
              <img src={previewImage} alt={`${previewWorkName}大图`} />
            </div>

            <dl className="work-preview__info">
              <div>
                <dt>作品名称</dt>
                <dd>{previewWorkName}</dd>
              </div>
              <div>
                <dt>所属技法分类</dt>
                <dd>{activeCategory.name}</dd>
              </div>
              <div>
                <dt>工艺特点</dt>
                <dd>{activeCategory.craft}</dd>
              </div>
            </dl>
          </article>
        </div>
      )}
    </>
  )
}
