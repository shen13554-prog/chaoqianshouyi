import { useRef, useState } from 'react'
import HistoryDetailCard from '../components/HistoryDetailCard'
import HistoryScroll from '../components/HistoryScroll'
import { historyTimeline } from '../data/historyTimeline'

export default function History() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const activeCardRef = useRef(null)
  const currentItem = historyTimeline[currentIndex]

  const handleNodeClick = (index) => {
    setCurrentIndex(index)
    requestAnimationFrame(() => {
      activeCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  const handlePageChange = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="basic-page history-page">
      <section className="basic-page__heading">
        <p className="basic-page__label">潮汕嵌瓷 · 数字展陈</p>
        <h1>潮嵌源流</h1>
        <span aria-hidden="true" />
        <p>从材料嵌饰的文化远源，到潮州建筑上的成熟技艺，再到当代非遗保护，循着时间长卷认识嵌瓷的发展轨迹。</p>
      </section>

      <HistoryScroll
        items={historyTimeline}
        activeIndex={currentIndex}
        onSelect={handleNodeClick}
      />
      <div ref={activeCardRef}>
        <HistoryDetailCard item={currentItem} key={currentIndex} />
        <nav className="history-detail-pagination" aria-label="历史资料卡分页">
          <span>
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={() => handlePageChange(currentIndex - 1)}
              >
                上一页
              </button>
            ) : null}
          </span>
          <span>
            {currentIndex < historyTimeline.length - 1 ? (
              <button
                type="button"
                onClick={() => handlePageChange(currentIndex + 1)}
              >
                下一页
              </button>
            ) : null}
          </span>
        </nav>
      </div>
    </div>
  )
}
