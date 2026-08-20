import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { inheritors } from '../data/inheritors'
import Inheritors from './Inheritors'

const scrollIntoView = vi.fn()

beforeEach(() => {
  scrollIntoView.mockClear()
  Element.prototype.scrollIntoView = scrollIntoView
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('inheritor lineage exhibition', () => {
  it('renders the lineage heading and four accessible portrait nodes', () => {
    render(<Inheritors />)

    expect(
      screen.getByRole('heading', { level: 1, name: '守艺传承' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('一条屋脊，连接数代匠人的坚守与创新'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '嵌瓷技艺传承谱系' }),
    ).toBeInTheDocument()

    const names = ['陈伟钦', '卢芝高', '许少鹏', '许少雄']
    names.forEach((name) => {
      const button = screen.getByRole('button', { name })
      expect(button.tagName).toBe('BUTTON')
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  it('selects Chen Weiqin by default and shows all archive fields', () => {
    render(<Inheritors />)

    expect(screen.getByRole('button', { name: '陈伟钦' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    const detail = screen.getByRole('region', { name: '陈伟钦人物档案' })
    expect(within(detail).getByRole('heading', { name: '陈伟钦' })).toBeInTheDocument()

    ;['身份', '传承年代', '主要技艺', '代表作品', '传承贡献'].forEach(
      (label) => {
        expect(within(detail).getByText(label)).toBeInTheDocument()
      },
    )
    expect(within(detail).getAllByRole('definition')).toHaveLength(5)
  })

  it('switches the active node and detail when a portrait is clicked', () => {
    render(<Inheritors />)

    fireEvent.click(screen.getByRole('button', { name: '许少雄' }))

    expect(screen.getByRole('button', { name: '陈伟钦' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: '许少雄' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('region', { name: '许少雄人物档案' }),
    ).toBeInTheDocument()
    expect(screen.getAllByAltText('许少雄').at(-1)).toHaveAttribute(
      'src',
      '/images/inheritors/xu_shaoxiong.png',
    )
  })

  it('centers and briefly highlights each id-linked archive when clicked', () => {
    vi.useFakeTimers()
    render(<Inheritors />)

    ;[
      ['陈伟钦', 'chen-weiqin'],
      ['卢芝高', 'lu-zhigao'],
      ['许少鹏', 'xu-shaopeng'],
      ['许少雄', 'xu-shaoxiong'],
    ].forEach(([name, id]) => {
      const button = screen.getByRole('button', { name })
      fireEvent.click(button)

      const detail = screen.getByRole('region', { name: `${name}人物档案` })
      expect(button).toHaveAttribute('aria-controls', `inheritor-detail-${id}`)
      expect(detail).toHaveAttribute('id', `inheritor-detail-${id}`)
      expect(detail).toHaveClass('is-highlighted')
      expect(scrollIntoView).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        block: 'center',
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(detail).not.toHaveClass('is-highlighted')
    })

    expect(scrollIntoView).toHaveBeenCalledTimes(4)
  })

  it('applies individual framing settings to each circular portrait', () => {
    render(<Inheritors />)

    const chenMedia = screen
      .getByRole('button', { name: '陈伟钦' })
      .querySelector('.inheritor-node__media')
    const xuShaopengMedia = screen
      .getByRole('button', { name: '许少鹏' })
      .querySelector('.inheritor-node__media')

    expect(chenMedia).toBeInTheDocument()
    expect(chenMedia.style.getPropertyValue('--portrait-size')).toBe('76%')
    expect(chenMedia.style.getPropertyValue('--portrait-x')).toBe('3px')
    expect(xuShaopengMedia).toBeInTheDocument()
    expect(xuShaopengMedia.style.getPropertyValue('--portrait-size')).toBe('80%')
    expect(xuShaopengMedia.style.getPropertyValue('--portrait-y')).toBe('2px')
  })

  it('pages through archive details and hides controls at the boundaries', () => {
    render(<Inheritors />)

    expect(
      screen.queryByRole('button', { name: `← ${inheritors[0].name}` }),
    ).not.toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: `${inheritors[1].name} →` }),
    )

    expect(
      screen.getByRole('button', { name: inheritors[1].name }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('region', {
        name: `${inheritors[1].name}人物档案`,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `← ${inheritors[0].name}` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `${inheritors[2].name} →` }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: `${inheritors[2].name} →` }),
    )
    expect(
      screen.getByRole('button', { name: `← ${inheritors[1].name}` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: `${inheritors[3].name} →` }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: `${inheritors[3].name} →` }),
    )

    expect(
      screen.getByRole('button', { name: inheritors[3].name }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: `← ${inheritors[2].name}` }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: `${inheritors[3].name} →` }),
    ).not.toBeInTheDocument()
  })

  it('cross-slides archive details in the pagination direction for 400ms', () => {
    vi.useFakeTimers()
    render(<Inheritors />)

    fireEvent.click(
      screen.getByRole('button', { name: `${inheritors[1].name} →` }),
    )

    const firstOutgoing = document.querySelector(
      `[aria-label="${inheritors[0].name}人物档案"]`,
    )
    const secondIncoming = screen.getByRole('region', {
      name: `${inheritors[1].name}人物档案`,
    })
    expect(firstOutgoing).toHaveClass('is-exiting-to-left')
    expect(firstOutgoing).toHaveAttribute('aria-hidden', 'true')
    expect(secondIncoming).toHaveClass('is-entering-from-right')

    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(
      document.querySelector(
        `[aria-label="${inheritors[0].name}人物档案"]`,
      ),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: `← ${inheritors[0].name}` }),
    )

    expect(
      document.querySelector(
        `[aria-label="${inheritors[1].name}人物档案"]`,
      ),
    ).toHaveClass('is-exiting-to-right')
    expect(
      screen.getByRole('region', {
        name: `${inheritors[0].name}人物档案`,
      }),
    ).toHaveClass('is-entering-from-left')
  })
})
