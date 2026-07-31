import {
  cleanup,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App'
import Building from './pages/Building'
import Gallery from './pages/Gallery'
import History from './pages/History'
import Home from './pages/Home'
import Inheritors from './pages/Inheritors'
import Materials from './pages/Materials'
import Modern from './pages/Modern'
import Process from './pages/Process'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'history', element: <History /> },
      { path: 'materials', element: <Materials /> },
      { path: 'process', element: <Process /> },
      { path: 'building', element: <Building /> },
      { path: 'inheritors', element: <Inheritors /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'modern', element: <Modern /> },
    ],
  },
]

function renderRoute(pathname) {
  const router = createMemoryRouter(routes, {
    initialEntries: [pathname],
    future: {
      v7_startTransition: true,
    },
  })

  return render(
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />,
  )
}

afterEach(cleanup)

describe('site routes', () => {
  const routeCases = [
    ['/history', '潮嵌源流'],
    ['/materials', '嵌瓷之材'],
    ['/process', '匠心成艺'],
    ['/building', '筑上华章'],
    ['/inheritors', '守艺传人'],
    ['/gallery', '嵌瓷作品'],
    ['/modern', '潮艺新生'],
  ]

  it.each(routeCases)('renders %s with its page heading', (path, heading) => {
    renderRoute(path)

    expect(
      screen.getByRole('heading', { level: 1, name: heading }),
    ).toBeInTheDocument()
  })

  it('keeps all eight destinations in the desktop navigation', () => {
    renderRoute('/')

    const header = screen.getByRole('banner')
    expect(header.querySelectorAll('nav a')).toHaveLength(8)
  })
})

describe('home page', () => {
  it('renders the required hero and culture introduction', () => {
    renderRoute('/')
    const hero = within(document.querySelector('.hero'))

    expect(
      screen.getByRole('heading', { level: 1, name: '潮嵌守艺' }),
    ).toBeInTheDocument()
    expect(
      hero.getByText('潮汕嵌瓷非遗文化数字展示'),
    ).toBeInTheDocument()
    expect(hero.getByText('一片瓷片，承载百年潮韵。')).toBeInTheDocument()
    expect(screen.getByAltText('安济王庙嵌瓷建筑')).toHaveAttribute(
      'src',
      '/images/building/anji-wangmiao.webp',
    )
    expect(screen.getByAltText('潮汕嵌瓷文化介绍长图')).toHaveAttribute(
      'src',
      '/images/intro/intro-scroll-poster.webp',
    )
  })

  it('renders five cultural exploration links', () => {
    renderRoute('/')
    const exploration = within(document.querySelector('.explore-grid'))

    const destinations = [
      ['历史溯源', '/history'],
      ['制作工艺', '/process'],
      ['建筑艺术', '/building'],
      ['传承人物', '/inheritors'],
      ['潮艺新生', '/modern'],
    ]

    destinations.forEach(([name, href]) => {
      expect(exploration.getByRole('link', { name })).toHaveAttribute(
        'href',
        href,
      )
    })
  })

  it('renders all three selected works and the gallery link', () => {
    renderRoute('/')

    const workImages = [
      '平嵌作品',
      '半浮雕嵌作品',
      '立体嵌作品',
    ]

    workImages.forEach((alt) => {
      expect(screen.getByAltText(alt)).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: '探索更多' })).toHaveAttribute(
      'href',
      '/gallery',
    )
  })
})
