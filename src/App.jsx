import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import './App.css'
import { Home } from './pages/Home'
import { Solicitud } from './pages/Solicitud'
import { Simulador } from './pages/Simulador'

function App() {


  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<Simulador />} />
        <Route path="/solicitud" element={<Solicitud />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
