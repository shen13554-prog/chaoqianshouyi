import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/modern/building-decoration.webp', alt: '当代建筑装饰' },
  { src: '/images/modern/category-showcase.webp', alt: '嵌瓷品类展示' },
  { src: '/images/modern/lifestyle-product.webp', alt: '嵌瓷生活产品' },
  { src: '/images/modern/stamp-design.webp', alt: '嵌瓷主题邮票设计' },
]

export default function Modern() {
  return (
    <BasicPage
      title="潮艺新生"
      intro="探索潮汕嵌瓷与当代设计、生活美学及文化传播相遇后的新表达。"
      images={images}
    />
  )
}
