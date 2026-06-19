import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function Events() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const calendarRef = useRef(null)
  const supportRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )

    gsap.fromTo(calendarRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    )

    if (supportRef.current) {
      const cards = supportRef.current.querySelectorAll('.support-card')
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: supportRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      )
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <section className="section">
        <div ref={headerRef} className="events-intro">
          <h2>Calendar & Club Runs</h2>
          <p>
            Check the public events calendar below for upcoming runs, charity poker rides, community outreach events, and open meetings. If you are a visiting veteran or cruiser enthusiast looking to join a run, you are always welcome. Please arrive with a full tank of gas and an attitude of respect.
          </p>
        </div>

        {/* Responsive Teamup Calendar Wrapper */}
        <div ref={calendarRef} className="calendar-wrapper">
          <div className="calendar-iframe-container">
            <iframe
              src="https://teamup.com/ksiiivqj38j83wuya1?title=US%20Military%20Vets%20Motorcycle%20Club%20-%20Public%20Events&tz=Calendar%20default&showHeader=1&showLogo=0&showProfileAndInfo=0&showSidepanel=1&showTitle=1&showViewSelector=1&showMenu=1&showViewHeader=1&showAgendaDetails=1&showDateControls=1&showDateRange=1"
              title="USMVMC Public Events Calendar"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Supported Events & Organizations */}
      <section ref={supportRef} className="section section-alt">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 id="support-heading">Supported Events & Organizations</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              We are dedicated to serving our community and honoring those who serve. Here are some of the events and organizations that we proudly support:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🇺🇸</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Provide funeral escort services for fallen veterans</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🎄</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Wreaths Across America</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🏠</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Local Homeless Shelters (Jackson Street Commons)</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🎗️</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Escort Services for the Traveling Wall</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🎖️</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Indiana Fallen Heroes</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🏍️</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Support the Troops Rides</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🇺🇸</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Veterans of Foreign Wars</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🎖️</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>American Legion</span>
            </div>
            <div className="support-card value-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 2rem' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>🏝️</span>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>Sandbox Reunion (Howard County Vietnam Veterans Org)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events
