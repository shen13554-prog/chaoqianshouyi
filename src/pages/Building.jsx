import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/building/anji-wangmiao.webp', alt: '安济王庙嵌瓷建筑' },
]

export default function Building() {
  return (
    <BasicPage
      title="筑上华章"
      intro="走近潮汕传统祠堂与庙宇，欣赏屋脊之上以瓷成景的建筑艺术。"
      images={images}
    />
  )
}
