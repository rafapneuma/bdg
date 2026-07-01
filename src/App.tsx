import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Incidencias from './pages/Incidencias'
import IncidenciaDetalle from './pages/IncidenciaDetalle'
import Sondeos from './pages/Sondeos'
import Avisos from './pages/Avisos'
import Documentos from './pages/Documentos'
import Economico from './pages/Economico'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-dvh">
      <Header />
      <ScrollToTop />
      <main className="mx-auto max-w-lg px-4 pb-28 pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incidencias" element={<Incidencias />} />
          <Route path="/incidencias/:id" element={<IncidenciaDetalle />} />
          <Route path="/sondeos" element={<Sondeos />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/economico" element={<Economico />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
