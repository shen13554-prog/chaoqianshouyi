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
