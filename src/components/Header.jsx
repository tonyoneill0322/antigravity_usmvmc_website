import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo-link" id="nav-logo" onClick={closeMobileMenu}>
          {!logoError ? (
            <img
              src="/images/usmvmc_logo_transparent.png"
              alt="USMVMC Logo"
              className="logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div id="logo-text" className="logo-fallback">
              USMV<span>MC</span>
            </div>
          )}
        </Link>

        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle Menu"
          id="hamburger-menu"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="nav-menu" className={mobileMenuOpen ? 'active' : ''}>
          <ul>
            <li>
              <NavLink to="/" end onClick={closeMobileMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMobileMenu}>
                About & History
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" onClick={closeMobileMenu}>
                Rides & Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" onClick={closeMobileMenu}>
                Photo Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={closeMobileMenu}>
                Join / Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/members" onClick={closeMobileMenu}>
                Members Only
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
