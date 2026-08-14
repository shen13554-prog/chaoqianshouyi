import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ExploreCard from '../components/ExploreCard'
import ImageCard from '../components/ImageCard'
import IntroVideoBanner from '../components/IntroVideoBanner'
import PosterHotspot from '../components/PosterHotspot'
import PosterInfoCard from '../components/PosterInfoCard'
import SectionTitle from '../components/SectionTitle'

const posterHotspots = [
  {
    id: 'introduction',
    title: '嵌瓷介绍',
    summary: '以彩釉瓷片剪裁、组合并嵌贴成建筑装饰图像。',
    points: ['又称聚饶、粘瓷、扣饶', '常见人物、花卉与飞禽走兽题材', '多用于屋顶、墙壁等区域'],
    side: 'left',
    area: { left: '1.8%', top: '10.5%', width: '32%', height: '8.5%' },
  },
  {
    id: 'process-introduction',
    title: '工艺介绍',
    summary: '从造型基础到瓷片嵌贴，以多道手工环节形成完整画面。',
    points: ['塑胚胎', '剪取瓷片', '镶嵌瓷片', '综合调整'],
    side: 'left',
    area: { left: '1.8%', top: '25.8%', width: '23%', height: '14.8%' },
  },
  {
    id: 'core-features',
    title: '核心特点',
    summary: '瓷片釉色与立体结构共同构成嵌瓷鲜明的视觉辨识度。',
    points: ['色彩绚丽', '质地坚固', '立体感强', '变废为宝'],
    side: 'left',
    area: { left: '1.8%', top: '42.2%', width: '23%', height: '12.5%' },
  },
  {
    id: 'regional-distribution',
    title: '地区分布',
    summary: '嵌瓷随地域文化形成不同的色彩、题材与装饰风格。',
    points: ['广东省', '福建省', '海南省', '台湾省'],
    side: 'left',
    area: { left: '1.8%', top: '71%', width: '35%', height: '24%' },
  },
  {
    id: 'landmarks',
    title: '标志建筑',
    summary: '传统庙宇与祠堂屋脊集中呈现嵌瓷的建筑装饰语言。',
    points: ['安济王庙', '广济楼天后宫', '观音庙', '从熙公祠'],
    side: 'right',
    area: { left: '72.8%', top: '4.8%', width: '14.7%', height: '13%' },
  },
  {
    id: 'material-process',
    title: '材料制作流程',
    summary: '多种基础材料经过处理、配比与熟化，形成嵌贴所需灰浆。',
    points: ['贝壳灰与石灰', '细沙与浸泡稻草', '红糖浆', '草根粗灰'],
    side: 'right',
    area: { left: '77.5%', top: '20%', width: '11%', height: '41%' },
  },
  {
    id: 'craft-steps',
    title: '工艺步骤',
    summary: '海报以纵向图示呈现材料由处理到灰浆调和的连续步骤。',
    points: ['烧制与浸泡', '分次加入', '过滤与搅拌', '配比调和'],
    side: 'right',
    area: { left: '89%', top: '20%', width: '9.5%', height: '74%' },
  },
]

const explorations = [
  {
    image: '/images/history/roof_background.webp',
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
    image: '/images/building/anji_wangmiao.webp',
    title: '建筑艺术',
    description: '了解嵌瓷在传统建筑中的艺术应用。',
    to: '/building',
  },
  {
    image: '/images/inheritors/chen_weiqin.png',
    title: '传承人物',
    description: '记录非遗技艺传承者的故事。',
    to: '/inheritors',
  },
  {
    image: '/images/modern/category_showcase.webp',
    title: '潮艺新生',
    description: '探索传统技艺与当代设计融合。',
    to: '/modern',
  },
]

const selectedWorks = [
  {
    image: '/images/works/flat_inlay.png',
    title: '平嵌作品',
    description: '以细密瓷片铺陈图案，呈现平整而丰富的色彩层次。',
  },
  {
    image: '/images/works/semi_relief_inlay.png',
    title: '半浮雕嵌作品',
    description: '借由层叠与塑形，让纹样从建筑表面徐徐生长。',
  },
  {
    image: '/images/works/three_dimensional_inlay.png',
    title: '立体嵌作品',
    description: '以立体骨架承托瓷片，塑造鲜明而生动的形态。',
  },
]

export default function Home() {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [isContentRevealed, setIsContentRevealed] = useState(false)
  const heroRef = useRef(null)

  return (
    <>
      <IntroVideoBanner
        targetRef={heroRef}
        onReveal={() => setIsContentRevealed(true)}
      />
      <div className={isContentRevealed ? 'home-content is-revealed' : 'home-content'}>
      <section ref={heroRef} className="hero section-container">
        <img
          className="hero__image"
          src="/images/building/anji_wangmiao.webp"
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
            src="/images/intro/intro_scroll_poster.webp"
            alt="潮汕嵌瓷文化介绍长图"
          />
          {posterHotspots.map((hotspot) => (
            <PosterHotspot
              key={hotspot.id}
              hotspot={hotspot}
              isActive={activeHotspot === hotspot.id}
              onActivate={setActiveHotspot}
            />
          ))}
          {posterHotspots.map((hotspot) => (
            <PosterInfoCard
              key={`${hotspot.id}-card`}
              hotspot={hotspot}
              isActive={activeHotspot === hotspot.id}
            />
          ))}
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
      </div>
    </>
  )
}
