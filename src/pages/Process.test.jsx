import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import Process from './Process'

function renderProcess() {
  return render(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Process />
    </MemoryRouter>,
  )
}

afterEach(cleanup)

describe('process digital experience', () => {
  it('starts the decomposition experience from the complete work', () => {
    renderProcess()

    const startButton = screen.getByRole('button', {
      name: '探索制作过程',
    })

    fireEvent.click(startButton)

    expect(startButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('heading', { name: '作品拆解' }),
    ).toBeInTheDocument()
  })

  it('reveals the selected layer information', () => {
    renderProcess()

    fireEvent.click(screen.getByRole('button', { name: '瓷片' }))

    expect(screen.getByText('废旧彩瓷')).toBeInTheDocument()
    expect(screen.getByText('构成色彩和纹理')).toBeInTheDocument()
    expect(
      screen.getByText('按纹样与色彩需求剪修，再逐片嵌贴。'),
    ).toBeInTheDocument()
  })

  it('switches the active craft step and opens its image viewer', () => {
    renderProcess()

    fireEvent.click(
      screen.getByRole('button', { name: '05 剪修瓷片' }),
    )

    expect(
      screen.getByRole('heading', { name: '剪修瓷片' }),
    ).toBeInTheDocument()
    expect(screen.getByText('老虎钳 · 瓷片刀')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: '放大查看剪修瓷片' }),
    )

    expect(
      screen.getByRole('dialog', { name: '剪修瓷片' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '关闭图片' }))

    expect(
      screen.queryByRole('dialog', { name: '剪修瓷片' }),
    ).not.toBeInTheDocument()
  })
})
