import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Building from './Building'

afterEach(cleanup)

describe('architecture regeneration detail', () => {
  it('renders the architecture source gallery and three extraction exhibits', () => {
    render(<Building />)

    expect(
      screen.getByRole('heading', { name: '建筑再生', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。'),
    ).toBeInTheDocument()

    const images = [
      ['安济王庙', '/images/building/building_01.webp'],
      ['广济楼天后宫', '/images/building/building_02.png'],
      ['观音庙', '/images/building/building_03.png'],
      ['从熙公祠', '/images/building/building_04.png'],
    ]

    images.forEach(([name, src]) => {
      expect(screen.getByRole('img', { name })).toHaveAttribute('src', src)
    })

    expect(
      screen.getByRole('heading', { name: '色彩提取', level: 4 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '纹样提取', level: 4 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '拼接结构提取', level: 4 }),
    ).toBeInTheDocument()
  })

  it('opens a building research detail from the source gallery', () => {
    render(<Building />)

    expect(
      screen.queryByRole('region', { name: '安济王庙研究详情' }),
    ).not.toBeInTheDocument()

    const anjiCard = screen.getByRole('button', { name: '查看安济王庙研究详情' })
    fireEvent.click(anjiCard)

    expect(anjiCard).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('region', { name: '安济王庙研究详情' }),
    ).toBeInTheDocument()
    expect(screen.getByText('潮汕传统庙宇建筑')).toBeInTheDocument()
    expect(screen.getByText('屋脊、檐部与正立面装饰区域')).toBeInTheDocument()
    expect(
      screen.getByText('通过瑞兽、花鸟等装饰语言表达守护、祈福与地方文化认同'),
    ).toBeInTheDocument()
  })

  it('switches building details and closes the active building on a second click', () => {
    render(<Building />)

    fireEvent.click(screen.getByRole('button', { name: '查看安济王庙研究详情' }))
    fireEvent.click(screen.getByRole('button', { name: '查看观音庙研究详情' }))

    expect(
      screen.queryByRole('region', { name: '安济王庙研究详情' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '观音庙研究详情' }),
    ).toBeInTheDocument()
    expect(screen.getByText('潮汕传统信仰建筑')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '关闭观音庙研究详情' }))
    expect(
      screen.queryByRole('region', { name: '观音庙研究详情' }),
    ).not.toBeInTheDocument()
  })

  it('presents the color, motif, and joining research items', () => {
    render(<Building />)

    ;[
      '朱红', '釉绿', '金色',
      '龙凤', '花鸟', '卷草纹',
      '瓷片排列方式', '层叠关系', '高低起伏结构',
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })

    expect(screen.getByText('关联礼制、喜庆与建筑视觉焦点。')).toBeInTheDocument()
    expect(
      screen.getByText('依据轮廓方向组织碎片，形成连续边界和视觉走势。'),
    ).toBeInTheDocument()
  })

  it('omits modern translation sections from the building page', () => {
    render(<Building />)

    expect(
      screen.queryByRole('heading', { name: '现代设计应用' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '设计说明' }),
    ).not.toBeInTheDocument()
  })
})
