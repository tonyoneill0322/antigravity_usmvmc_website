import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

/**
 * Header Component
 * 
 * Renders the global club header containing:
 * - Brand logo link: attempts to load transparent logo image from `/images`.
 *   If the image fails (e.g. 404), falls back to typographical logo using standard text.
 * - Hamburger Toggle: responsive button visible on mobile screens.
 * - Navigation links: uses React Router `NavLink` elements.
 *   These elements automatically receive active styles matching the URL path.
 */
function Header() {
  // mobileMenuOpen: Tracks whether the slide-out navigation menu is open on mobile screens.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // logoError: Tracks if the logo image fails to load, triggering typographical fallback.
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
        {/* Brand Logo - returns to home page and closes mobile menu if open */}
        <Link to="/" className="logo-link" id="nav-logo" onClick={closeMobileMenu}>
          {!logoError ? (
            <img
              src="/images/usmvmc_logo_transparent.png"
              alt="USMVMC Logo"
              className="logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            // Fallback typographic branding if file is missing
            <div id="logo-text" className="logo-fallback">
              USMV<span>MC</span>
            </div>
          )}
        </Link>

        {/* Mobile Hamburger Menu Toggle Button */}
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

        {/* Main Navigation Links */}
        <nav id="nav-menu" className={mobileMenuOpen ? 'active' : ''}>
          <ul>
            <li>
              {/* end property prevents "/" from matching sub-routes like "/about" */}
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
