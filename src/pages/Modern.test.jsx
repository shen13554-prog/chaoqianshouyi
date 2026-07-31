import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Modern from './Modern'

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('modern design translation experience', () => {
  it('shows the three modern cases', () => {
    render(<Modern />)

    expect(
      screen.getByRole('button', { name: '01 建筑再生' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '02 日常新生' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '03 艺术跨界' }),
    ).toBeInTheDocument()
  })

  it('presents the architectural source, extracted elements, application, and design concept', () => {
    render(<Modern />)

    expect(
      screen.getByText('潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('提炼低饱和朱红、釉绿与金色关系，保留传统建筑装饰的节奏和层次。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('从龙凤、花鸟及卷草中提取轮廓与连续构图，形成可复用的现代图形语言。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('分析瓷片的方向排列、碎片层叠和高低起伏，呈现嵌瓷特有的立体秩序。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('将传统色彩、纹样和瓷片拼接秩序转化为空间界面、导视系统与公共艺术语言。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('通过数字化提取与重组传统文化结构，使嵌瓷非遗元素进入现代设计语境，在延续文化识别的同时形成新的应用方式。'),
    ).toBeInTheDocument()
  })

  it('shows the four named source buildings for the architecture case', () => {
    render(<Modern />)

    const sourceImages = [
      ['安济王庙', '/images/building/building-01.webp'],
      ['广济楼天后宫', '/images/building/building-02.png'],
      ['观音庙', '/images/building/building-03.png'],
      ['从熙公祠', '/images/building/building-04.png'],
    ]

    sourceImages.forEach(([name, src]) => {
      expect(screen.getByRole('img', { name })).toHaveAttribute('src', src)
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  it('shows three extraction exhibits only for the architecture case', () => {
    render(<Modern />)

    expect(
      screen.getByRole('heading', { name: '色彩提取', level: 4 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '纹样提取', level: 4 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '拼接结构提取', level: 4 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '色彩提取占位区域' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '纹样提取占位区域' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '拼接结构提取占位区域' }),
    ).toBeInTheDocument()
  })

  it('keeps the original extraction presentation for other cases', () => {
    render(<Modern />)
    fireEvent.click(screen.getByRole('button', { name: '02 日常新生' }))

    expect(screen.getByText('花瓣曲线')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '纹样提取预览占位区域' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '色彩提取', level: 4 }),
    ).not.toBeInTheDocument()
  })

  it('switches the case, reveals its four-part detail, and scrolls to it', () => {
    render(<Modern />)

    const dailyCase = screen.getByRole('button', { name: '02 日常新生' })
    fireEvent.click(dailyCase)

    expect(dailyCase).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('heading', { name: '日常新生', level: 2 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '传统来源' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '嵌瓷元素提取' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '现代设计应用' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '设计说明' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('将传统花鸟纹样转化为可进入日常的器物语言。'),
    ).toBeInTheDocument()
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce()
  })
})
