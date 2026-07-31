import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/materials/ceramic-shards.png', alt: '陶瓷碎片' },
  { src: '/images/materials/colored-shards.png', alt: '彩色瓷片' },
  { src: '/images/materials/glass-shards.png', alt: '玻璃片材' },
  { src: '/images/materials/lime.png', alt: '石灰材料' },
  { src: '/images/materials/metal-wire.png', alt: '金属骨架线材' },
]

export default function Materials() {
  return (
    <BasicPage
      title="嵌瓷之材"
      intro="认识瓷片、灰浆与金属骨架，理解嵌瓷作品绚丽外表之下的材料智慧。"
      images={images}
    />
  )
}
