import { NavLink } from 'react-router-dom'

const navigation = [
  { label: '首页', to: '/' },
  { label: '历史溯源', to: '/history' },
  { label: '材料探索', to: '/materials' },
  { label: '制作工艺', to: '/process' },
  { label: '建筑案例', to: '/building' },
  { label: '传承人物', to: '/inheritors' },
  { label: '作品展示', to: '/gallery' },
  { label: '潮艺新生', to: '/modern' },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="brand" to="/" aria-label="潮嵌守艺首页">
          <span className="brand__name">潮嵌守艺</span>
          <span className="brand__seal" aria-hidden="true">嵌</span>
        </NavLink>

        <nav className="main-nav" aria-label="主导航">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => (
                isActive ? 'main-nav__link is-active' : 'main-nav__link'
              )}
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
