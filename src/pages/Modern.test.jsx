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
  it('shows only the two modern translation cases', () => {
    render(<Modern />)

    expect(
      screen.queryByRole('button', { name: '01 建筑再生' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '01 日常新生' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '02 艺术跨界' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '两种转译路径' }),
    ).toBeInTheDocument()
  })

  it('shows the daily case by default with its complete translation detail', () => {
    render(<Modern />)

    expect(
      screen.getByRole('heading', { name: '日常新生', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText('花瓣曲线')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '纹样提取预览占位区域' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '现代设计应用' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '设计说明' })).toBeInTheDocument()
  })

  it('switches the case, reveals its four-part detail, and scrolls to it', () => {
    render(<Modern />)

    const artCase = screen.getByRole('button', { name: '02 艺术跨界' })
    fireEvent.click(artCase)

    expect(artCase).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('heading', { name: '艺术跨界', level: 2 }),
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
      screen.getByText('不复制传统题材，而是延续手工拼合、材料再生与集体叙事的文化内核。'),
    ).toBeInTheDocument()
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce()
  })
})
