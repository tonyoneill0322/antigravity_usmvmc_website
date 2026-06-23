import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Members Component
 * 
 * Renders the restricted Members Only portal.
 * Features:
 * - A secure passcode gate screen verifying input against the correct passcode ('USMV1975').
 * - Session state persistence (checks sessionStorage on mount to keep users logged in).
 * - A dashboard display showing internal announcements and downloadable resources (PDFs, GPX files).
 * - GSAP visual transitions:
 *   - Fades & scales the lock gate card on mount.
 *   - Staggers the announcement cards and download rows when the dashboard unlocks.
 */
function Members() {
  // isLoggedIn: Tracks user authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // passcode: Controlled text input for the authentication gate form
  const [passcode, setPasscode] = useState('')
  // feedback: Controls visual success or passcode error banner messages
  const [feedback, setFeedback] = useState({ text: '', type: '' })
  
  // Refs for tracking DOM targets
  const containerRef = useRef(null)
  const gateRef = useRef(null)
  const dashboardRef = useRef(null)

  // Secret passcode key value
  const correctPasscode = 'USMV1975'

  // Persists logged-in status by querying storage on initial render
  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('usmvmc_logged_in') === 'true'
    setIsLoggedIn(loggedInStatus)
  }, [])

  // GSAP entrance animations for Gate (Runs only if logged out)
  useGSAP(() => {
    if (!isLoggedIn && gateRef.current) {
      gsap.fromTo(gateRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [isLoggedIn])

  // GSAP entrance animations for Dashboard (Runs after login state updates to true)
  useGSAP(() => {
    if (isLoggedIn && dashboardRef.current) {
      const logoutBar = dashboardRef.current.querySelector('.logout-bar')
      const title = dashboardRef.current.querySelector('h2')
      const columns = dashboardRef.current.querySelectorAll('.members-grid > div')

      // Slide down the header toolbar and page heading
      gsap.fromTo([logoutBar, title],
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
      )

      // Stagger slide up the content columns (announcements and downloads)
      gsap.fromTo(columns,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.2 }
      )
    }
  }, [isLoggedIn])

  // Processes passcode check, logs in user on correct match, or displays access error banner
  const handleLoginSubmit = (e) => {
    e.preventDefault()

    if (passcode === correctPasscode) {
      sessionStorage.setItem('usmvmc_logged_in', 'true')
      setIsLoggedIn(true)
      setFeedback({ text: '', type: '' })
    } else {
      setFeedback({
        text: 'ACCESS DENIED: Invalid club passcode.',
        type: 'error'
      })
    }
  }

  // Logs out user, clears session storage state, and resets gate input fields
  const handleLogout = () => {
    sessionStorage.removeItem('usmvmc_logged_in')
    setIsLoggedIn(false)
    setPasscode('')
    setFeedback({ text: '', type: '' })
  }

  return (
    <div ref={containerRef}>
      <section className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Passcode Gate Screen: Renders if logged out */}
        {!isLoggedIn ? (
          <div ref={gateRef} className="gate-wrapper">
            <div className="gate-card">
              <div className="gate-icon">🔒</div>
              <h2>SECURE PORTAL</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                This area is restricted to patched members of the U.S. Military Veterans MC. Enter the season passcode below to access announcements and downloads.
              </p>

              <form onSubmit={handleLoginSubmit} id="gate-form">
                <div className="form-group">
                  <label htmlFor="member-passcode">Club Passcode</label>
                  <input
                    type="password"
                    id="member-passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="form-control"
                    placeholder="••••••••"
                    required
                    style={{ textAlign: 'center', letterSpacing: '2px' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  id="submit-passcode"
                >
                  Unlock Dashboard
                </button>
                
                {/* Custom error/invalid passcode banner */}
                {feedback.text && (
                  <div 
                    id="passcode-feedback" 
                    className={`form-feedback ${feedback.type}`}
                    style={{ marginTop: '1.5rem', display: 'block' }}
                  >
                    {feedback.text}
                  </div>
                )}
              </form>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem', marginBottom: 0 }}>
                Forgot the code? Contact your local chapter Secretary.
              </p>
            </div>
          </div>
        ) : (
          /* Patched Members Dashboard: Renders if logged in */
          <div ref={dashboardRef} className="members-dashboard" style={{ width: '100%' }}>
            
            {/* Logout / Welcomer Bar */}
            <div className="logout-bar">
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', fontSize: '1.1rem', letterSpacing: '1px' }}>
                  WELCOME, PATCHED BROTHER
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                  | USMVMC Internal Portal
                </span>
              </div>
              <button
                id="logout-btn"
                className="btn"
                onClick={handleLogout}
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: 'var(--text-muted)', color: 'var(--text-secondary)' }}
              >
                Logout
              </button>
            </div>

            <h2>Internal Dashboard</h2>
            
            <div className="members-grid">
              
              {/* Announcements Column */}
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Club Announcements
                </h3>
                
                {/* Announcement 1 */}
                <div className="announcement-card">
                  <div className="announcement-meta">
                    <span>Mother Chapter Vote</span>
                    <span>June 24, 2026</span>
                  </div>
                  <h4>Bylaws Amendment Vote (Section IV)</h4>
                  <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: 0 }}>
                    All patched members are required to attend the upcoming monthly meeting on July 5th. We will be voting on a proposed amendment to Section IV regarding prospect duration standards. Absentee ballots must be submitted to the Secretary by July 2nd.
                  </p>
                </div>

                {/* Announcement 2 */}
                <div className="announcement-card">
                  <div className="announcement-meta">
                    <span>National Safety Officer</span>
                    <span>June 15, 2026</span>
                  </div>
                  <h4>Group Ride Signal Review</h4>
                  <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: 0 }}>
                    Before the upcoming Veterans Memorial Ride, please review the standard hand signals for road hazards, single file, double file, and fuel stops. Road Captains will conduct a safety brief 30 minutes before kickstands up. Safety first, brothers.
                  </p>
                </div>

                {/* Announcement 3 */}
                <div className="announcement-card">
                  <div className="announcement-meta">
                    <span>Treasury Report</span>
                    <span>June 01, 2026</span>
                  </div>
                  <h4>Spring Poker Run Charity Totals</h4>
                  <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: 0 }}>
                    Thanks to the outstanding turnout and local sponsorships, our Spring Charity Run raised a total of $14,250 for the Veteran Crisis Assistance Fund. Excellent work from all volunteers and road captains.
                  </p>
                </div>
              </div>

              {/* Downloads Column */}
              <div>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Resources & Files
                </h3>
                
                <div className="member-doc">
                  <div className="member-doc-info">
                    <h4>National Constitution</h4>
                    <span>Updated Jan 2026 | PDF</span>
                  </div>
                  <a href="#" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={(e) => e.preventDefault()}>
                    Download
                  </a>
                </div>

                <div className="member-doc">
                  <div className="member-doc-info">
                    <h4>Memorial Ride Route MAP</h4>
                    <span>GPX Navigation File | ZIP</span>
                  </div>
                  <a href="#" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={(e) => e.preventDefault()}>
                    Download
                  </a>
                </div>

                <div className="member-doc">
                  <div className="member-doc-info">
                    <h4>Meeting Minutes - May</h4>
                    <span>Published June 2, 2026 | PDF</span>
                  </div>
                  <a href="#" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={(e) => e.preventDefault()}>
                    Download
                  </a>
                </div>

                <div className="member-doc">
                  <div className="member-doc-info">
                    <h4>Prospect Handbook</h4>
                    <span>Bylaws & Etiquette | PDF</span>
                  </div>
                  <a href="#" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={(e) => e.preventDefault()}>
                    Download
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}
      </section>
    </div>
  )
}

export default Members
