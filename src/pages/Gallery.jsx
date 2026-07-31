import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/works/flat-inlay.png', alt: '平嵌作品' },
  { src: '/images/works/semi-relief-inlay.png', alt: '半浮雕嵌作品' },
  { src: '/images/works/three-dimensional-inlay.png', alt: '立体嵌作品' },
]

export default function Gallery() {
  return (
    <BasicPage
      title="嵌瓷作品"
      intro="从平嵌到立体嵌，观赏瓷片在不同塑形方式中呈现的色彩、层次与神韵。"
      images={images}
    />
  )
}
