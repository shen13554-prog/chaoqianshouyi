import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
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
    const dailyCase = screen.getByRole('button', { name: '01 日常新生' })
    expect(dailyCase).toBeInTheDocument()
    expect(within(dailyCase).getByAltText('日常新生案例入口')).toHaveAttribute(
      'src',
      '/images/modern/daily/cover/daily_cover.png',
    )
    const artCase = screen.getByRole('button', { name: '02 艺术跨界' })
    expect(artCase).toBeInTheDocument()
    expect(within(artCase).getByAltText('艺术跨界案例入口')).toHaveAttribute(
      'src',
      '/images/modern/art/cover/art_cover.png',
    )
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
    expect(screen.getByAltText('日常新生传统来源')).toHaveAttribute(
      'src',
      '/images/modern/daily/source/daily_source.png',
    )
    expect(screen.getByAltText('日常新生嵌瓷元素提取')).toHaveAttribute(
      'src',
      '/images/modern/daily/extraction/daily_extraction.png',
    )
    expect(screen.getByAltText('日常新生现代设计应用')).toHaveAttribute(
      'src',
      '/images/modern/daily/application/daily_application.png',
    )
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
    expect(screen.getByAltText('艺术跨界传统来源')).toHaveAttribute(
      'src',
      '/images/modern/art/source/art_source.png',
    )
    expect(screen.getByAltText('艺术跨界嵌瓷元素提取')).toHaveAttribute(
      'src',
      '/images/modern/art/extraction/art_extraction.png',
    )
    expect(screen.getByAltText('艺术跨界现代设计应用')).toHaveAttribute(
      'src',
      '/images/modern/art/application/art_application.png',
    )
    expect(
      screen.getByRole('heading', { name: '设计说明' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('不复制传统题材，而是延续手工拼合、材料再生与集体叙事的文化内核。'),
    ).toBeInTheDocument()
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce()
  })
})
