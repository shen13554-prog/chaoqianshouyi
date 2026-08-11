import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Home from './Home'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home poster reading hotspots', () => {
  it('renders a non-looping autoplay video banner before the hero', () => {
    const { container } = renderHome()
    const video = screen.getByLabelText('潮嵌守艺视频序章')
    const banner = video.closest('section')
    const hero = container.querySelector('.hero')

    expect(
      banner.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(video.autoplay).toBe(true)
    expect(video.muted).toBe(true)
    expect(video).toHaveAttribute('playsinline')
    expect(video.getAttribute('poster')).toContain('chaoqian-intro-poster')
    expect(video).not.toHaveAttribute('loop')
    expect(screen.getByRole('button', { name: '跳过序章' })).toBeInTheDocument()
  })

  it('waits on the final frame then scrolls to the hero over two seconds', () => {
    vi.useFakeTimers()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame')
    let frame
    requestAnimationFrame.mockImplementation((callback) => {
      frame = callback
      return 1
    })
    const { container } = renderHome()
    const hero = container.querySelector('.hero')
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue({ top: 720 })

    fireEvent.ended(screen.getByLabelText('潮嵌守艺视频序章'))
    act(() => vi.advanceTimersByTime(1499))
    expect(requestAnimationFrame).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.home-content')).toHaveClass('is-revealed')

    act(() => frame(0))
    act(() => frame(2000))
    expect(scrollTo).toHaveBeenLastCalledWith(0, 720)
  })

  it('skips immediately, pauses the video, and starts entry only once', () => {
    vi.useFakeTimers()
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1)
    const { container } = renderHome()
    const video = screen.getByLabelText('潮嵌守艺视频序章')
    const pause = vi.spyOn(video, 'pause').mockImplementation(() => {})

    fireEvent.click(screen.getByRole('button', { name: '跳过序章' }))

    expect(pause).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.home-content')).toHaveClass('is-revealed')
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

    fireEvent.ended(video)
    act(() => vi.advanceTimersByTime(1500))
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it('keeps the existing complete poster and exposes seven reading hotspots', () => {
    renderHome()

    expect(screen.getByAltText('潮汕嵌瓷文化介绍长图')).toHaveAttribute(
      'src',
      '/images/intro/intro_scroll_poster.webp',
    )
    expect(screen.getAllByTestId('poster-hotspot')).toHaveLength(7)
  })

  it('shows the matching information card on hover and hides it on leave', () => {
    renderHome()
    const hotspot = screen.getByLabelText('查看嵌瓷介绍')

    fireEvent.mouseEnter(hotspot)
    expect(screen.getByRole('status')).toHaveTextContent('嵌瓷介绍')
    expect(screen.getByRole('status')).toHaveTextContent('彩釉瓷片')

    fireEvent.mouseLeave(hotspot)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('lists the four provinces in the regional distribution card', () => {
    renderHome()
    fireEvent.mouseEnter(screen.getByLabelText('查看地区分布'))

    const card = screen.getByRole('status')
    expect(within(card).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '广东省',
      '福建省',
      '海南省',
      '台湾省',
    ])
  })
})
