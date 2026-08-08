import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
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

  it('opens each building image in a modal with matching research data', () => {
    render(<Building />)

    const buildings = [
      ['安济王庙', '/images/building/building_01.webp', '潮汕传统庙宇建筑'],
      ['广济楼天后宫', '/images/building/building_02.png', '宫庙式公共文化建筑'],
      ['观音庙', '/images/building/building_03.png', '潮汕传统信仰建筑'],
      ['从熙公祠', '/images/building/building_04.png', '潮汕传统祠堂建筑'],
    ]

    buildings.forEach(([name, src, type]) => {
      const card = screen.getByRole('button', { name: `查看${name}研究详情` })
      fireEvent.click(card)

      const dialog = screen.getByRole('dialog', { name: `${name}研究详情` })
      expect(card).toHaveAttribute('aria-pressed', 'true')
      expect(
        within(dialog).getByRole('img', { name: `${name}建筑放大展示` }),
      ).toHaveAttribute('src', src)
      expect(within(dialog).getByText(type)).toBeInTheDocument()

      fireEvent.click(
        within(dialog).getByRole('button', { name: `关闭${name}研究详情` }),
      )
      expect(
        screen.queryByRole('dialog', { name: `${name}研究详情` }),
      ).not.toBeInTheDocument()
    })
  })

  it('closes the building modal when the backdrop is clicked', () => {
    render(<Building />)

    fireEvent.click(screen.getByRole('button', { name: '查看安济王庙研究详情' }))
    const dialog = screen.getByRole('dialog', { name: '安济王庙研究详情' })
    const backdrop = screen.getByTestId('building-modal-backdrop')

    expect(backdrop.parentElement).toBe(document.body)

    fireEvent.click(dialog)
    expect(dialog).toBeInTheDocument()

    fireEvent.click(backdrop)
    expect(
      screen.queryByRole('dialog', { name: '安济王庙研究详情' }),
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
