import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Gallery from './Gallery'

afterEach(cleanup)

describe('works gallery', () => {
  it('shows the three technique categories and the half-inlay works by default', () => {
    render(<Gallery />)

    ;['半浮嵌', '立体嵌', '平嵌'].forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: '半浮嵌' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })).toHaveLength(4)
  })

  it('switches categories and displays every flat-inlay image', () => {
    render(<Gallery />)

    fireEvent.click(screen.getByRole('button', { name: '平嵌' }))

    expect(screen.getByRole('button', { name: '平嵌' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getAllByRole('button', { name: /查看平嵌作品/ })).toHaveLength(6)
  })

  it('places the making experience before the works exhibition', () => {
    render(<Gallery />)

    const experience = screen.getByRole('region', { name: '半浮嵌制作体验' })
    const exhibition = screen.getByRole('region', { name: '半浮嵌作品展示' })

    expect(
      experience.compareDocumentPosition(exhibition) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('uses the approved half-inlay sequence and leaves the unmapped pattern step text-only', () => {
    render(<Gallery />)

    ;['选择瓷片', '拼接纹样', '嵌贴装饰', '完成作品'].forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    })
    expect(screen.getByAltText('半浮嵌制作体验：选择瓷片')).toHaveAttribute(
      'src',
      '/images/process/sorting.webp',
    )

    fireEvent.click(screen.getByRole('button', { name: '拼接纹样' }))
    expect(screen.getByRole('heading', { name: '拼接纹样' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '拼接纹样' }).closest('.making-experience__display'),
    ).toHaveClass('is-text-only')
    expect(screen.queryByRole('img', { name: /半浮嵌制作体验/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '嵌贴装饰' }))
    expect(screen.getByAltText('半浮嵌制作体验：嵌贴装饰')).toHaveAttribute(
      'src',
      '/images/process/inlay.webp',
    )

    fireEvent.click(screen.getByRole('button', { name: '完成作品' }))
    expect(screen.getByAltText('半浮嵌制作体验：完成作品')).toHaveAttribute(
      'src',
      expect.stringContaining('/images/works/half/'),
    )
  })

  it('loads the matching experience and resets to step one after category switching', () => {
    render(<Gallery />)
    fireEvent.click(screen.getByRole('button', { name: '拼接纹样' }))

    fireEvent.click(screen.getByRole('button', { name: '立体嵌' }))

    expect(screen.getByRole('region', { name: '立体嵌制作体验' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '绘制草图' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '扎骨定形' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '灰浆塑形' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '嵌入瓷片' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '完成造型' })).toBeInTheDocument()
  })

  it('uses only process images before the final stereo-inlay step', () => {
    render(<Gallery />)
    fireEvent.click(screen.getByRole('button', { name: '立体嵌' }))

    const expected = [
      ['绘制草图', '/images/process/sketch.webp'],
      ['扎骨定形', '/images/process/frame.webp'],
      ['灰浆塑形', '/images/process/plaster.webp'],
      ['嵌入瓷片', '/images/process/inlay.webp'],
    ]
    expected.forEach(([title, path]) => {
      fireEvent.click(screen.getByRole('button', { name: title }))
      expect(screen.getByAltText(`立体嵌制作体验：${title}`)).toHaveAttribute('src', path)
    })

    fireEvent.click(screen.getByRole('button', { name: '完成造型' }))
    expect(screen.getByAltText('立体嵌制作体验：完成造型')).toHaveAttribute(
      'src',
      expect.stringContaining('/images/works/stereo/'),
    )
  })

  it('uses the approved flat-inlay sequence and leaves arrangement text-only', () => {
    render(<Gallery />)
    fireEvent.click(screen.getByRole('button', { name: '平嵌' }))

    fireEvent.click(screen.getByRole('button', { name: '分色选片' }))
    expect(screen.getByAltText('平嵌制作体验：分色选片')).toHaveAttribute(
      'src',
      '/images/process/sorting.webp',
    )
    fireEvent.click(screen.getByRole('button', { name: '剪修瓷片' }))
    expect(screen.getByAltText('平嵌制作体验：剪修瓷片')).toHaveAttribute(
      'src',
      '/images/process/trimming.webp',
    )
    fireEvent.click(screen.getByRole('button', { name: '排列纹样' }))
    expect(screen.queryByRole('img', { name: /平嵌制作体验/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '完成装饰' }))
    expect(screen.getByAltText('平嵌制作体验：完成装饰')).toHaveAttribute(
      'src',
      expect.stringContaining('/images/works/flat/'),
    )
  })

  it('opens the selected work details when an image is clicked', () => {
    render(<Gallery />)

    fireEvent.click(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })[0])

    const detail = screen.getByRole('region', { name: '半浮嵌作品 01详情' })
    expect(within(detail).getByRole('heading', { name: '半浮嵌作品 01' })).toBeInTheDocument()
    ;['技法分类', '工艺特点', '应用场景'].forEach((label) => {
      expect(within(detail).getByText(label)).toBeInTheDocument()
    })
  })

  it('opens a large preview with work information when an image is clicked', () => {
    render(<Gallery />)

    fireEvent.click(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })[0])

    const preview = screen.getByRole('dialog', {
      name: '半浮嵌作品 01图片预览',
    })
    expect(within(preview).getByAltText('半浮嵌作品 01大图')).toBeInTheDocument()
    ;['作品名称', '所属技法分类', '工艺特点'].forEach((label) => {
      expect(within(preview).getByText(label)).toBeInTheDocument()
    })
  })

  it('closes the preview from the close button', () => {
    render(<Gallery />)
    fireEvent.click(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })[0])

    fireEvent.click(screen.getByRole('button', { name: '关闭图片预览' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the preview when the empty backdrop is clicked', () => {
    render(<Gallery />)
    fireEvent.click(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })[0])

    fireEvent.click(screen.getByTestId('work-preview-backdrop'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the preview when Escape is pressed', () => {
    render(<Gallery />)
    fireEvent.click(screen.getAllByRole('button', { name: /查看半浮嵌作品/ })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
