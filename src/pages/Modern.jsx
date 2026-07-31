import { useRef, useState } from 'react'
import ModernCaseDetail from '../components/ModernCaseDetail'
import ModernCaseSelector from '../components/ModernCaseSelector'
import { modernCases } from '../data/modernCases'

export default function Modern() {
  const [activeCase, setActiveCase] = useState(modernCases[0])
  const detailRef = useRef(null)

  function selectCase(item) {
    setActiveCase(item)
    detailRef.current?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="modern-experience">
      <section className="modern-intro section-container">
        <p className="modern-intro__label">TRADITION IN TRANSLATION</p>
        <h1>潮艺新生</h1>
        <span aria-hidden="true" />
        <p>
          从屋脊上的传统工艺出发，
          <br />
          探索嵌瓷进入当代空间、日常器物与艺术表达的新路径。
        </p>
      </section>

      <ModernCaseSelector
        cases={modernCases}
        activeId={activeCase.id}
        onSelect={selectCase}
      />

      <ModernCaseDetail item={activeCase} detailRef={detailRef} />
    </div>
  )
}
