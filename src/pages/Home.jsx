import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function Home() {
  const containerRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroTaglineRef = useRef(null)
  const heroButtonsRef = useRef(null)
  const heroBgRef = useRef(null)
  const cardsRef = useRef([])

  useGSAP(() => {
    // 1. Hero Load Animations
    gsap.fromTo(heroBgRef.current,
      { scale: 1.1 },
      { scale: 1, duration: 8, ease: 'power1.out' }
    )

    gsap.fromTo(heroTitleRef.current,
      { opacity: 0, scale: 1.15, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )

    gsap.fromTo(heroTaglineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' }
    )

    gsap.fromTo(heroButtonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.7, ease: 'power3.out' }
    )

    // 2. Scroll Animations for Feature Cards
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.feature-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      )
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      {/* Hero Banner */}
      <section className="hero">
        <div 
          ref={heroBgRef}
          className="hero-bg" 
          style={{ backgroundImage: "url('/images/off_the_rails.png')" }}
        ></div>
        <div className="hero-content">
          <h1 ref={heroTitleRef}>USMVMC</h1>
          <p ref={heroTaglineRef} className="hero-tagline">
            Riding with Honor. Serving Those Who Served.
          </p>
          <div ref={heroButtonsRef} className="hero-buttons">
            <Link to="/about" className="btn btn-primary" id="hero-btn-about">
              Our History
            </Link>
            <Link to="/contact" className="btn" id="hero-btn-join">
              Ride With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 id="mission-heading">Fostering Brotherhood & Service</h2>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-primary)', marginTop: '2rem' }}>
            The U.S. Military Veterans Motorcycle Club is a traditional motorcycle club established for military veterans,
            active duty personnel, and those who share our commitment to supporting our brothers and sisters in arms. We
            ride to keep the flame of veteran support burning, honoring our fallen, and protecting the values of freedom and
            honor.
          </p>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="section section-alt">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 id="features-heading">What We Do</h2>
          </div>
          <div className="feature-grid">
            {/* Card 1 */}
            <div 
              ref={(el) => (cardsRef.current[0] = el)} 
              className="feature-card"
            >
              <div className="feature-icon">🎖️</div>
              <h3 id="feat-brotherhood">Veteran Brotherhood</h3>
              <p>
                Fostering an authentic, strong support structure for veterans adjusting to civilian life, maintaining the
                camaraderie found during service.
              </p>
            </div>
            {/* Card 2 */}
            <div 
              ref={(el) => (cardsRef.current[1] = el)} 
              className="feature-card"
            >
              <div className="feature-icon">
                <svg viewBox="0 0 64 64" fill="currentColor">
                  <path d="M53 32a9.95 9.95 0 0 0-2.487.326l-1.27-2.6A25.58 25.58 0 0 1 59 28a2 2 0 0 0 0-4 28.9 28.9 0 0 0-11.507 2.145c-2.838-5.8-5.387-10.99-5.641-11.416-.532-.885-1.64-2.729-3.8-2.729H31a2 2 0 0 0 0 4h6.887a5.783 5.783 0 0 1 .521.762c.1.178.477.932 1.051 2.09C33.247 23.5 27.978 28 24.045 28H20.9C14.985 23.322 7.007 22 3 22a2 2 0 0 0 0 4c.166 0 13.837.313 19.136 9.389l-2.789 1.117a10.152 10.152 0 1 0 1.485 3.713l2.822-1.129a16.831 16.831 0 0 1 .5 3.053A2 2 0 0 0 26.153 44H37a2 2 0 0 0 1.983-1.752 16.424 16.424 0 0 1 6.737-10.611c.4.809.794 1.627 1.192 2.445A9.981 9.981 0 1 0 53 32zM17 42a6.023 6.023 0 1 1-1.5-3.953l-5.244 2.1a2 2 0 1 0 1.486 3.713l5.244-2.1c.007.08.014.16.014.24zm36 6a5.995 5.995 0 0 1-4.272-10.205c.863 1.77 1.7 3.494 2.474 5.082a2 2 0 0 0 3.6-1.75c-.593-1.221-1.464-3.01-2.476-5.086A6 6 0 1 1 53 48z" />
                </svg>
              </div>
              <h3 id="feat-rides">Club Runs & Events</h3>
              <p>
                Organizing veterans support runs, memorial escorts, and charity motorcycle poker runs to raise awareness
                and support veteran funds.
              </p>
            </div>
            {/* Card 3 */}
            <div 
              ref={(el) => (cardsRef.current[2] = el)} 
              className="feature-card"
            >
              <div className="feature-icon">🇺🇸</div>
              <h3 id="feat-community">Community Support</h3>
              <p>
                Partnering with local veteran organizations, VA clinics, and homeless shelters to provide hands-on
                community service and care packages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
