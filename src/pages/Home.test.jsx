import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import Home from './Home'

afterEach(cleanup)

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home poster reading hotspots', () => {
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
