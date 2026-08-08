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
  it('uses the complete roof work in the hero and image viewer', () => {
    renderProcess()

    const completeWork = screen.getByAltText('龙形立体嵌瓷完整作品')
    expect(completeWork.getAttribute('src')).toContain('complete-work.jpg')

    fireEvent.click(
      screen.getByRole('button', { name: '放大查看完整嵌瓷作品' }),
    )

    const viewer = screen.getByRole('dialog', { name: '完整嵌瓷作品' })
    expect(viewer.querySelector('img').getAttribute('src')).toContain(
      'complete-work.jpg',
    )
  })

  it('starts the decomposition experience from the complete work', () => {
    renderProcess()

    const startButton = screen.getByRole('button', {
      name: '探索制作过程',
    })

    fireEvent.click(startButton)

    expect(startButton).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('heading', { name: '材料拆解' }),
    ).toBeInTheDocument()
  })

  it('reveals the selected material name, role, and making method', () => {
    renderProcess()

    expect(screen.getByRole('button', { name: '作品' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '瓷片' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '灰浆' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '骨架' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '工具' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '灰浆' }))

    expect(screen.getByText('名称')).toBeInTheDocument()
    expect(screen.getByText('石灰灰浆')).toBeInTheDocument()
    expect(screen.getByText('形成塑形与粘合基础')).toBeInTheDocument()
    expect(
      screen.getByText('将石灰、砂与水调和，分层敷抹并控制干湿程度。'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '骨架' }))

    expect(screen.getByText('金属线骨架')).toBeInTheDocument()
    expect(screen.getByText('支撑作品轮廓与受力结构')).toBeInTheDocument()
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
