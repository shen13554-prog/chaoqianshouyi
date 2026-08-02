import { useRef, useState } from 'react'
import ImageLightbox from '../components/ImageLightbox'
import ProcessDeconstruction from '../components/ProcessDeconstruction'
import ProcessTimeline from '../components/ProcessTimeline'
import { processLayers, processSteps } from '../data/processExperience'

export default function Process() {
  const [experienceStarted, setExperienceStarted] = useState(false)
  const [activeLayer, setActiveLayer] = useState(processLayers[0])
  const [activeStep, setActiveStep] = useState(processSteps[0])
  const [lightbox, setLightbox] = useState({ image: '', title: '' })
  const deconstructionRef = useRef(null)

  function startExperience() {
    setExperienceStarted(true)
    deconstructionRef.current?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function openLightbox(image, title) {
    setLightbox({ image, title })
  }

  return (
    <div className="process-experience">
      <section className="process-hero section-container">
        <div className="process-hero__copy">
          <p className="process-hero__label">嵌瓷制作数字体验</p>
          <h1>匠心成艺</h1>
          <span aria-hidden="true" />
          <p>
            一件作品并非一瞬成形。
            <br />
            从线稿、灰塑到每一枚瓷片，
            <br />
            九道工序共同托起屋脊上的潮汕华章。
          </p>
          <button
            type="button"
            onClick={startExperience}
            aria-pressed={experienceStarted}
          >
            探索制作过程
          </button>
        </div>

        <button
          type="button"
          className="process-hero__artwork"
          onClick={() => openLightbox(
            '/images/works/three_dimensional_inlay.png',
            '完整嵌瓷作品',
          )}
          aria-label="放大查看完整嵌瓷作品"
        >
          <img
            src="/images/works/three_dimensional_inlay.png"
            alt="龙形立体嵌瓷完整作品"
          />
          <span>完整作品 · 点击查看</span>
        </button>
      </section>

      <div ref={deconstructionRef} className={experienceStarted ? 'experience-focus is-active' : 'experience-focus'}>
        <div className="section-container">
          <ProcessDeconstruction
            layers={processLayers}
            activeLayer={activeLayer}
            onSelect={setActiveLayer}
            onExpand={openLightbox}
          />
        </div>
      </div>

      <div className="process-tools-band">
        <div className="section-container">
          <div className="process-tools-band__copy">
            <p>CRAFT TOOLS</p>
            <h2>一刀一钳，皆为手上尺度</h2>
            <p>剪、夹、敲、抹，工具延伸手的判断，让坚硬瓷片顺应柔软纹样。</p>
          </div>
          <div className="process-tools-band__items">
            {[
              { image: '/images/tools/knife.png', name: '瓷片刀', use: '敲裂与修边' },
              { image: '/images/tools/pliers.png', name: '老虎钳', use: '夹剪与塑形' },
              { image: '/images/tools/shovel.png', name: '灰匙', use: '敷灰与嵌贴' },
            ].map((tool) => (
              <article key={tool.name}>
                <img src={tool.image} alt={tool.name} />
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.use}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container">
        <ProcessTimeline
          steps={processSteps}
          activeStep={activeStep}
          onSelect={setActiveStep}
          onExpand={openLightbox}
        />
      </div>

      <ImageLightbox
        image={lightbox.image}
        title={lightbox.title}
        onClose={() => setLightbox({ image: '', title: '' })}
      />
    </div>
  )
}
