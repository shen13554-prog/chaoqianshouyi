import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

export default function App() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
