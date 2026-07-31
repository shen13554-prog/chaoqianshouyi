import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/history/roof-background.webp', alt: '传统嵌瓷屋脊' },
  { src: '/images/history/broken-bowl.png', alt: '旧瓷片原料' },
  { src: '/images/history/pottery.png', alt: '传统陶瓷器物' },
  { src: '/images/history/trimming-shards.png', alt: '瓷片剪裁' },
  { src: '/images/history/dragon-shape.png', alt: '嵌瓷龙形构件' },
]

export default function History() {
  return (
    <BasicPage
      title="潮嵌源流"
      intro="探索潮汕嵌瓷从传统建筑装饰到现代文化传播的发展过程。"
      images={images}
    />
  )
}
