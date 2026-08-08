import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import History from './History'

afterEach(cleanup)

const scrollIntoView = vi.fn()

beforeEach(() => {
  scrollIntoView.mockClear()
  Element.prototype.scrollIntoView = scrollIntoView
})

function renderHistory() {
  return render(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <History />
    </MemoryRouter>,
  )
}

describe('digital history scroll', () => {
  it('smoothly centers the first, middle, and last nodes when clicked', () => {
    renderHistory()

    const nodes = screen.getAllByRole('button')
    expect(scrollIntoView).not.toHaveBeenCalled()

    fireEvent.click(nodes[4])
    expect(nodes[4]).toHaveAttribute('aria-pressed', 'true')
    expect(nodes[4]).toHaveClass('is-active')
    expect(scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })

    fireEvent.click(nodes[9])
    expect(nodes[9]).toHaveAttribute('aria-pressed', 'true')
    expect(nodes[4]).not.toHaveClass('is-active')

    fireEvent.click(nodes[0])
    expect(nodes[0]).toHaveAttribute('aria-pressed', 'true')
    expect(nodes[9]).not.toHaveClass('is-active')
    expect(scrollIntoView).toHaveBeenCalledTimes(3)
  })

  it('renders ten historical nodes with the earliest period selected', () => {
    renderHistory()

    expect(
      screen.getByRole('heading', { name: '潮嵌源流', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '潮州嵌瓷历史长卷' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(10)
    expect(screen.getByRole('button', { name: '殷商' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('region', { name: '殷商历史详情' }),
    ).toBeInTheDocument()
  })

  it('shows the Congxi Ancestral Hall case when the Qing node is clicked', () => {
    renderHistory()

    fireEvent.click(screen.getByRole('button', { name: '清代' }))

    expect(screen.getByRole('button', { name: '清代' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('heading', {
        name: '祠堂与民居营建推动嵌瓷成熟',
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '查看从熙公祠建筑案例' }),
    ).toHaveAttribute('href', '/building')
    expect(screen.getByRole('img', { name: '从熙公祠' })).toHaveAttribute(
      'src',
      '/images/building/building_04.png',
    )
  })

  it('updates the detail card when the 2008 node is clicked', () => {
    renderHistory()

    fireEvent.click(screen.getByRole('button', { name: '2008年' }))

    expect(
      screen.getByRole('region', { name: '2008年历史详情' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: '进入国家级非物质文化遗产名录',
        level: 2,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '漳州东山关帝庙太子亭' }),
    ).toHaveAttribute(
      'src',
      '/images/history/zhangzhou_dongshan_guandi_temple_pavilion.png',
    )
  })

  it('uses the exhibition-board architecture images for matching periods', () => {
    renderHistory()

    fireEvent.click(screen.getByRole('button', { name: '宋代' }))
    expect(screen.getByRole('img', { name: '青龙古庙' })).toHaveAttribute(
      'src',
      '/images/history/qinglong_ancient_temple.png',
    )

    fireEvent.click(screen.getByRole('button', { name: '明代' }))
    expect(screen.getByRole('img', { name: '王氏大宗祠' })).toHaveAttribute(
      'src',
      '/images/history/wang_ancestral_hall.png',
    )

    fireEvent.click(screen.getByRole('button', { name: '民国' }))
    expect(screen.getByRole('img', { name: '普宁林氏大宗祠' })).toHaveAttribute(
      'src',
      '/images/history/puning_lin_ancestral_hall.png',
    )
  })
})
