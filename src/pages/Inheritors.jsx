import BasicPage from '../components/BasicPage'

const images = [
  { src: '/images/inheritors/chen-weiqin.png', alt: '传承人陈伟钦' },
  { src: '/images/inheritors/lu-yigao.png', alt: '传承人卢艺高' },
  { src: '/images/inheritors/xu-shaopeng.png', alt: '传承人许少鹏' },
  { src: '/images/inheritors/xu-shaoxiong.png', alt: '传承人许少雄' },
]

export default function Inheritors() {
  return (
    <BasicPage
      title="守艺传人"
      intro="记录一代代嵌瓷艺人的实践与坚守，看见传统技艺延续至今的温度。"
      images={images}
    />
  )
}
