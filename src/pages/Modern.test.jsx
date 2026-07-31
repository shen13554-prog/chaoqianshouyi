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
      screen.getByText('色彩｜低饱和朱红、釉绿与金色关系'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('纹样｜龙凤、花鸟及卷草轮廓'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('瓷片拼接结构｜碎片层叠、方向排列与高低起伏'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('将传统色彩、纹样和瓷片拼接秩序转化为空间界面、导视系统与公共艺术语言。'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('通过数字化提取与重组传统文化结构，使嵌瓷非遗元素进入现代设计语境，在延续文化识别的同时形成新的应用方式。'),
    ).toBeInTheDocument()
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
