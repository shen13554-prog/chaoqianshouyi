import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Inheritors from './Inheritors'

afterEach(cleanup)

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
    expect(within(detail).getAllByText('待补充')).toHaveLength(5)
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
      '/images/inheritors/xu-shaoxiong.png',
    )
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
})
