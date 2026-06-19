import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BikerAnimation from './components/BikerAnimation'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Members from './pages/Members'

function App() {
  return (
    <Router>
      <BikerAnimation />
      <Header />
      <main style={{ flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/members" element={<Members />} />
          {/* Legacy path mappings */}
          <Route path="/index.html" element={<Home />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/events.html" element={<Events />} />
          <Route path="/gallery.html" element={<Gallery />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/members.html" element={<Members />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
