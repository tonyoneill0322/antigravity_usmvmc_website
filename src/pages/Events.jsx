import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function Events() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const calendarRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )

    gsap.fromTo(calendarRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    )
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
              title="USMV MC Public Events Calendar"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events
