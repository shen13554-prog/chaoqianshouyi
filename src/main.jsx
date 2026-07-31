import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
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
import './styles.css'

const router = createBrowserRouter(
  [
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
  ],
  {
    future: {
      v7_startTransition: true,
    },
  },
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
  </React.StrictMode>,
)
