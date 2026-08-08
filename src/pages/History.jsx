import { useState } from 'react'
import HistoryDetailCard from '../components/HistoryDetailCard'
import HistoryScroll from '../components/HistoryScroll'
import { historyTimeline } from '../data/historyTimeline'

export default function History() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = historyTimeline[activeIndex]

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
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <HistoryDetailCard item={activeItem} />
    </div>
  )
}
