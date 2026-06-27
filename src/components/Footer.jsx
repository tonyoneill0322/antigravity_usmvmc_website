import React from 'react'
import { Link, NavLink } from 'react-router-dom'

/**
 * Footer Component
 * 
 * Displays the global club footer which is divided into three layout columns:
 * 1. Club description and core mission.
 * 2. Quick Links matching the header navigation layout vertically.
 *    Uses NavLink elements which receive active styling dynamically based on the current route.
 *    Also hooks into the global ScrollToTop listener to reset position.
 * 3. Club contact and location meta information.
 * 
 * Incorporates statutory corporate trademarks and copy disclaimers at the bottom.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-container">
        {/* Column 1: About text */}
        <div className="footer-about">
          <h3>USMVMC</h3>
          <p>
            The U.S. Military Veterans Motorcycle Club (USMVMC) is a motorcycle club first, founded on the brotherhood,
            loyalty, and shared values of military veterans while supporting local veteran communities through
            charitable work and motorcycle advocacy.
          </p>
        </div>

        {/* Column 2: Quick Links (vertical stack mirror of header navigation) */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              {/* end attribute ensures it only matches the exact "/" root path */}
              <NavLink to="/" end>Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About & History</NavLink>
            </li>
            <li>
              <NavLink to="/events">Rides & Events</NavLink>
            </li>
            <li>
              <NavLink to="/gallery">Photo Gallery</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Join / Contact</NavLink>
            </li>
            <li>
              <NavLink to="/members">Members Area</NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className="footer-contact">
          <h3>Contact Info</h3>
          <p>
            📍 <a href="https://usmvmc.org/" target="_blank" rel="noopener noreferrer">National Headquarters</a>
          </p>
          <p>
            ✉️ <a href="mailto:pawsin9@gmail.com">info@usmvmc.org</a>
          </p>
          <p>
            🏍️ <a href="https://www.in.gov/rsi/about-us/" target="_blank" rel="noopener noreferrer">Ride Safe, Ride Honorably</a>
          </p>
        </div>
      </div>

      {/* Bottom bar: Copyright, trademark, and non-profit disclaimer */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} U.S. Military Veterans Motorcycle Club. All Rights Reserved.</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          The name U.S. Military Vets MC and Eagle with the U.S. Flag logo are property of the U.S. Military Vets MC Inc.,
          a Florida Not-For-Profit 501(c)(3) Corporation and cannot and will not be used or reproduced without written
          permission from U.S. Military Vets MC Inc.
        </p>
      </div>
    </footer>
  )
}

export default Footer
