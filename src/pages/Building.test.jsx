import {
  cleanup,
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
      ['安济王庙', '/images/building/building-01.webp'],
      ['广济楼天后宫', '/images/building/building-02.png'],
      ['观音庙', '/images/building/building-03.png'],
      ['从熙公祠', '/images/building/building-04.png'],
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
