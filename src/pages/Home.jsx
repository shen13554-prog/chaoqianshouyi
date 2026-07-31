import { Link } from 'react-router-dom'
import ExploreCard from '../components/ExploreCard'
import ImageCard from '../components/ImageCard'
import SectionTitle from '../components/SectionTitle'

const explorations = [
  {
    image: '/images/history/roof-background.webp',
    title: '历史溯源',
    description: '追溯潮汕嵌瓷的发展历程。',
    to: '/history',
  },
  {
    image: '/images/process/inlay.webp',
    title: '制作工艺',
    description: '探索嵌瓷从材料到成型的完整技法。',
    to: '/process',
  },
  {
    image: '/images/building/anji-wangmiao.webp',
    title: '建筑艺术',
    description: '了解嵌瓷在传统建筑中的艺术应用。',
    to: '/building',
  },
  {
    image: '/images/inheritors/chen-weiqin.png',
    title: '传承人物',
    description: '记录非遗技艺传承者的故事。',
    to: '/inheritors',
  },
  {
    image: '/images/modern/category-showcase.webp',
    title: '潮艺新生',
    description: '探索传统技艺与当代设计融合。',
    to: '/modern',
  },
]

const selectedWorks = [
  {
    image: '/images/works/flat-inlay.png',
    title: '平嵌作品',
    description: '以细密瓷片铺陈图案，呈现平整而丰富的色彩层次。',
  },
  {
    image: '/images/works/semi-relief-inlay.png',
    title: '半浮雕嵌作品',
    description: '借由层叠与塑形，让纹样从建筑表面徐徐生长。',
  },
  {
    image: '/images/works/three-dimensional-inlay.png',
    title: '立体嵌作品',
    description: '以立体骨架承托瓷片，塑造鲜明而生动的形态。',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero section-container">
        <img
          className="hero__image"
          src="/images/building/anji-wangmiao.webp"
          alt="安济王庙嵌瓷建筑"
        />
        <div className="hero__copy">
          <span className="hero__rule" aria-hidden="true" />
          <h1>潮嵌守艺</h1>
          <p className="hero__subtitle">潮汕嵌瓷非遗文化数字展示</p>
          <p className="hero__note">一片瓷片，承载百年潮韵。</p>
        </div>
      </section>

      <section className="culture-intro section-container">
        <SectionTitle
          title="一瓷一嵌，守艺潮声"
          subtitle="从建筑屋脊之上，读见潮汕民间工艺的绚丽篇章"
        />
        <div className="culture-intro__poster">
          <img
            src="/images/intro/intro-scroll-poster.webp"
            alt="潮汕嵌瓷文化介绍长图"
          />
        </div>
        <p className="culture-intro__text">
          潮汕嵌瓷以废旧瓷片为材料，
          <br />
          通过剪裁、拼贴与塑形，
          <br />
          形成独特的建筑装饰艺术。
        </p>
      </section>

      <section className="explore-section section-container">
        <SectionTitle
          title="五境寻艺"
          subtitle="循历史、工艺、建筑与人物，走近潮汕嵌瓷"
        />
        <div className="explore-grid">
          {explorations.map((item) => (
            <ExploreCard key={item.to} {...item} />
          ))}
        </div>
      </section>

      <section className="works-section section-container">
        <SectionTitle
          title="精选作品"
          subtitle="瓷片成画，方寸之间见万象"
        />
        <div className="works-grid">
          {selectedWorks.map((work) => (
            <ImageCard key={work.image} {...work} />
          ))}
        </div>
        <div className="works-section__more">
          <Link className="outline-link" to="/gallery">
            探索更多
          </Link>
        </div>
      </section>
    </>
  )
}
