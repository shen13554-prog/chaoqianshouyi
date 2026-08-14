import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolvePosterCardSide } from '../components/PosterInfoCard'
import Home from './Home'

const POSTER_GUIDE_STORAGE_KEY = 'chaoqian-poster-guide-viewed'
let intersectionCallback

beforeEach(() => {
  window.localStorage.clear()
  intersectionCallback = null
  window.IntersectionObserver = vi.fn((callback) => {
    intersectionCallback = callback
    return {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }
  })
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  delete window.IntersectionObserver
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
  it('shows the poster guide once on viewport entry and hides it after 3.5 seconds', () => {
    vi.useFakeTimers()
    renderHome()

    expect(screen.queryByText('移至海报细节 · 探索嵌瓷信息')).not.toBeInTheDocument()

    act(() => intersectionCallback([{ isIntersecting: true }]))
    expect(screen.getByText('移至海报细节 · 探索嵌瓷信息')).toBeInTheDocument()
    expect(window.localStorage.getItem(POSTER_GUIDE_STORAGE_KEY)).toBe('true')

    act(() => vi.advanceTimersByTime(3499))
    expect(screen.getByText('移至海报细节 · 探索嵌瓷信息')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByText('移至海报细节 · 探索嵌瓷信息')).not.toBeInTheDocument()
  })

  it('hides the poster guide immediately when a hotspot is hovered', () => {
    renderHome()
    act(() => intersectionCallback([{ isIntersecting: true }]))

    fireEvent.mouseEnter(screen.getByLabelText('查看嵌瓷介绍'))

    expect(screen.queryByText('移至海报细节 · 探索嵌瓷信息')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('嵌瓷介绍')
  })

  it('does not show the poster guide again after it has been viewed', () => {
    window.localStorage.setItem(POSTER_GUIDE_STORAGE_KEY, 'true')
    renderHome()

    expect(window.IntersectionObserver).not.toHaveBeenCalled()
    expect(screen.queryByText('移至海报细节 · 探索嵌瓷信息')).not.toBeInTheDocument()
  })

  it('places an automatic middle hotspot on the side with more room', () => {
    expect(resolvePosterCardSide({
      side: 'auto',
      area: { left: '40%', width: '10%' },
    })).toBe('right')
    expect(resolvePosterCardSide({
      side: 'auto',
      area: { left: '55%', width: '10%' },
    })).toBe('left')
  })

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
    const { container } = renderHome()
    const leftHotspot = screen.getByLabelText('查看嵌瓷介绍')
    const rightHotspot = screen.getByLabelText('查看标志建筑')

    expect(screen.getAllByTestId('poster-info-card')).toHaveLength(7)

    fireEvent.mouseEnter(leftHotspot)
    const leftCard = screen.getByRole('status').closest('[data-testid="poster-info-card"]')
    expect(leftCard).toHaveClass('poster-info--left', 'is-active')
    expect(leftCard.querySelector('.poster-info__connector')).toBeInTheDocument()
    expect(leftCard.style.getPropertyValue('--hotspot-x')).toMatch(/%$/)
    expect(leftCard.style.getPropertyValue('--hotspot-y')).toMatch(/%$/)
    expect(screen.getByRole('status')).toHaveTextContent('嵌瓷介绍')
    expect(screen.getByRole('status')).toHaveTextContent('彩釉瓷片')

    fireEvent.mouseLeave(leftHotspot)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('poster-info-card')).toHaveLength(7)

    fireEvent.mouseEnter(rightHotspot)
    const rightCard = screen.getByRole('status').closest('[data-testid="poster-info-card"]')
    expect(rightCard).toHaveClass('poster-info--right', 'is-active')

    expect(container.querySelector('.culture-intro__poster')).toContainElement(rightCard)
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
