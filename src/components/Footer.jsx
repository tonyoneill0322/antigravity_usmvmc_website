import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-about">
          <h3>USMV MC</h3>
          <p>
            The U.S. Military Veterans Motorcycle Club (USMVMC) is a motorcycle club first, founded on the brotherhood,
            loyalty, and shared values of military veterans while supporting local veteran communities through
            charitable work and motorcycle advocacy.
          </p>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About & History</Link>
            </li>
            <li>
              <Link to="/events">Rides & Events</Link>
            </li>
            <li>
              <Link to="/gallery">Photo Gallery</Link>
            </li>
            <li>
              <Link to="/contact">Join / Contact</Link>
            </li>
            <li>
              <Link to="/members">Members Area</Link>
            </li>
          </ul>
        </div>
        <div className="footer-contact">
          <h3>Contact Info</h3>
          <p>📍 National Headquarters</p>
          <p>✉️ info@usmvmc.org</p>
          <p>🏍️ Ride Safe. Ride Honorably.</p>
        </div>
      </div>
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
