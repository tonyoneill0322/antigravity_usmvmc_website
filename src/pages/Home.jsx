import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger plugin with GSAP for managing scroll-driven animations
gsap.registerPlugin(ScrollTrigger)

/**
 * Home Component
 * 
 * Renders the homepage layout of the USMVMC website. 
 * Features:
 * - Full-screen Hero banner with ken-burns parallax scaling effect.
 * - Mission statement section.
 * - Strive cards section (Brotherhood, Pride, Image).
 * - Philosophy column & Earning Your Patch block.
 * - "Official Club Communication" block containing the Memo from the National President at the bottom.
 * 
 * Uses GSAP scroll-triggers for dynamic staggering and card pop-ins as they enter the viewport.
 */
function Home() {
  // DOM references for scoping GSAP animations within the container
  const containerRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroTaglineRef = useRef(null)
  const heroButtonsRef = useRef(null)
  const heroBgRef = useRef(null)
  const striveRef = useRef(null)
  const memoRef = useRef(null)
  const philosophySectionRef = useRef(null)

  // useGSAP hook ensures clean animation registers and automatic trigger cleanups on unmount
  useGSAP(() => {
    // 1. Hero Load Animations: scaling down background and sliding in titles
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

    // 2. Scroll Trigger for "What We Strive For" cards stagger-up animation
    if (striveRef.current) {
      const striveCards = striveRef.current.querySelectorAll('.strive-card')
      gsap.fromTo(striveCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: striveRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      )
    }

    // 3. Scroll Trigger for the "Memo from the National President" section fade-in
    if (memoRef.current) {
      gsap.fromTo(memoRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: memoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )
    }

    // 4. Scroll Trigger for Philosophy & Earning Your Patch grid columns
    if (philosophySectionRef.current) {
      gsap.fromTo(philosophySectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: philosophySectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      )
    }
  }, { scope: containerRef }) // Scope triggers limits selectors within containerRef to avoid memory leaks

  return (
    <div ref={containerRef}>
      {/* Hero Banner with motorcycle background */}
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

      {/* Mission Statement Row */}
      <section className="section">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 id="mission-heading">Fostering Brotherhood & Service</h2>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-primary)', marginTop: '2rem' }}>
            The U.S. Military Veterans Motorcycle Club is a traditional motorcycle club established for military veterans,
            active-duty personnel, and those who share our commitment to supporting our brothers in arms. We
            ride to keep the flame of veteran support burning, honoring our fallen, and protecting the values of freedom and
            honor.
          </p>
        </div>
      </section>

      {/* What We Strive For Section */}
      <section ref={striveRef} className="section section-alt">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 id="strive-heading">What We Strive For</h2>
          </div>
          <div className="feature-grid">
            {/* Strive Card 1: Brotherhood details */}
            <div className="strive-card feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Brotherhood</h3>
              <p>
                To provide a club for qualified male military veterans which offers brotherhood and an opportunity to establish
                relationships with other military veterans who have served in the defense of the United States of America.
              </p>
            </div>
            {/* Strive Card 2: Pride details */}
            <div className="strive-card feature-card">
              <div className="feature-icon">🎖️</div>
              <h3>Pride & Honor</h3>
              <p>
                To establish and support a strong sense of pride in having served in the active military service of the
                United States of America.
              </p>
            </div>
            {/* Strive Card 3: Image details */}
            <div className="strive-card feature-card">
              <div className="feature-icon">🏍️</div>
              <h3>Public Image</h3>
              <p>
                To improve the image of military veterans and bikers to the general public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy of the Traditional MC & Earning Your Patch split-column */}
      <section className="section section-alt">
        <div className="section-container">
          <div 
            ref={philosophySectionRef} 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '4rem' 
            }}
          >
            {/* Column 1: Philosophy (Includes requested bold and gold formatted titles) */}
            <div>
              <h2 id="philosophy-heading" style={{ borderBottom: '2px solid var(--accent-gold)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Philosophy of the Traditional MC
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '1.5rem' }}>
                  <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Motorcycle Community Stature:</strong> Regardless of the philosophy of our club, it is important that you understand the perspectives of other clubs that you may be associating with from time to time. If motorcycles influence your lifestyle, then you are part of the motorcycle community. Of all the types of organizations found within that community, the traditional MC stands apart and ranks highest in stature.
                  </p>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '1.5rem' }}>
                  <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Adhering to Protocol:</strong> As in all organizations and clubs, there is a protocol, which is to be learned, memorized, and adhered to from the time of becoming a Probate and Patch Holder. This protocol is to be followed closely, or one's membership may be jeopardized. Lack of knowledge could compromise the chapter and club itself.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Earning Your Patch detail block */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <h2 id="patch-heading" style={{ borderBottom: '2px solid var(--accent-gold)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                Earning Your Patch
              </h2>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '1.25rem', marginTop: '1.5rem' }}>
                You will see what Patch Holders must go through to "Earn" their Patch. This is why we show them the respect they've earned. It's also the reason you will be shown respect by other Patch Holders.
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Being a Patch Holder in an MC is an honor not to be taken lightly. You will be looked up to by independent bikers; you will be looked at as an equal by other Patch Holders; and you will be looked at with curiosity, and in some cases, disdain by the casual motorcyclists that are out there.
              </p>
              <p style={{ color: 'var(--accent-amber)', fontWeight: 'bold', marginBottom: 0 }}>
                These are the reasons why we expect and demand that you behave in a way that brings no dishonor or disrespect to the Club whatsoever! You will be watched, and everyone you see will remember how you carry your Colors!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Memo from the National President (Positioned at the absolute end of the page) */}
      <section className="section">
        <div 
          ref={memoRef} 
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--accent-gold)', 
            borderRadius: '6px', 
            padding: '3rem', 
            position: 'relative', 
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' 
          }}
        >
          {/* Official badge header override */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '-15px', 
              left: '30px', 
              backgroundColor: 'var(--accent-gold)', 
              color: 'var(--text-dark)', 
              padding: '0.25rem 1rem', 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              fontSize: '0.85rem', 
              borderRadius: '4px', 
              letterSpacing: '1px' 
            }}
          >
            Official Club Communication
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Memo from the National President
          </h3>
          <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              "If you are ready, you are about to enter the Motorcycle Club world. It is a lot of fun if you maintain the right state of mind. If you are looking to ride and have the camaraderie with other Brothers who have also served our Country, then you have come to the right place."
            </p>
            <p style={{ marginBottom: '1.25rem' }}>
              "We do a lot of things in a military way, but we are an MC first and a Veteran club second. The training you will receive is very important to you as a new Probate. Do not take it lightly."
            </p>
            <p style={{ marginBottom: '1.25rem' }}>
              "To survive in the MC world, you will have to learn it. Your Eagle (Full Patch status) will not be given until this information is learned."
            </p>
            <p style={{ marginBottom: 0, fontWeight: 'bold', color: 'var(--accent-amber)' }}>
              "Good luck. If you are the right man, you have chosen the right club. We only accept the best."
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
