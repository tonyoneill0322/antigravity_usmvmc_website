import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger to manage scroll-driven staggering
gsap.registerPlugin(ScrollTrigger)

// Array of biker quotes displayed during the motorcycle takeoff interactive event
const quotes = [
  "Respect the patch, fear the reaper.",
  "Keep your bike in good repair: motorcycle boots are not comfortable for walking.",
  "Straight roads never made skilled riders.",
  "Ride it like you stole it.",
  "Four wheels move the body. Two wheels move the soul.",
  "Life is short. Grip it and rip it.",
  "Ride hard or stay home.",
  "Born to ride, forced to work.",
  "My other ride is your mom.",
  "If you can read this, my girlfriend fell off.",
  "Loud pipes save lives… and annoy neighbors.",
  "Ride first, adult later.",
  "The only time I feel alive is when I’m riding.",
  "Bikes don’t leak oil, they mark territory.",
  "Don’t fear dying, fear not living."
];

/**
 * About Component
 * 
 * Contains the club history, details about the Indiana 9 (Cannonball) chapter, 
 * an interactive colors guide, and the active mother-chapter officers.
 * Features an interactive "Click to Ride" motorcycle graphic that accelerates 
 * off-screen and returns while sliding out a random biker quote.
 */
function About() {
  // Container & ScrollTrigger DOM refs
  const containerRef = useRef(null)
  const historyTextRef = useRef(null)
  const historyImgRef = useRef(null)
  const localHistoryCardsRef = useRef([])
  const patchCardsRef = useRef([])
  const officerCardsRef = useRef([])

  // isAnimating: Gates clicks while the motorcycle takeoff timeline is running
  const [isAnimating, setIsAnimating] = useState(false)
  // quoteIndex: Tracks current index of the quotes array (persisted in sessionStorage)
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const saved = sessionStorage.getItem('aboutQuoteIndex')
    return saved ? parseInt(saved, 10) : 0
  })
  
  // Interactive motorcycle graphic elements & audio refs
  const motorcycleRef = useRef(null)
  const quoteRef = useRef(null)
  const audioRef = useRef(null)
  const rumbleRef = useRef(null)

  /**
   * Triggers a fast repeating, small coordinate translation tween to simulate 
   * a vibrating engine idle rumble.
   */
  const startRumble = () => {
    rumbleRef.current?.kill()
    rumbleRef.current = gsap.to(motorcycleRef.current, {
      x: 'random(-1.6, 1.6)',
      y: 'random(-1.6, 1.6)',
      rotation: 'random(-0.7, 0.7)',
      duration: 0.08,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })
  }

  // Preload sound and clean up sound/rumble tweens on component unmount
  useEffect(() => {
    const audio = new Audio('/images/harleysound.mp3')
    audio.preload = 'auto'
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      rumbleRef.current?.kill()
    }
  }, [])

  // Hook wrapper containing page entrance and ScrollTrigger stagger animations
  const { contextSafe } = useGSAP(() => {
    // Start idle engine vibration immediately on mount
    startRumble()

    // 1. History Section Fade-In on page load
    gsap.fromTo(historyTextRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
    gsap.fromTo(historyImgRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    )

    // 2. Colors cards: triggers stagger rise when the wrapper meets 85% viewport height
    if (patchCardsRef.current.length > 0) {
      gsap.fromTo(patchCardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.colors-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    // 3. Officers: triggers stagger rise when the list enters the viewport
    if (officerCardsRef.current.length > 0) {
      gsap.fromTo(officerCardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.officer-list',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    // 4. Local history (Cannonball Express) cards: scroll trigger slide-up
    if (localHistoryCardsRef.current.length > 0) {
      gsap.fromTo(localHistoryCardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.local-history-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }
  }, { scope: containerRef })

  // mouseEnter: slightly scale up and remove sepia filter when hover starts
  const handleMouseEnter = contextSafe(() => {
    if (isAnimating) return
    gsap.to(motorcycleRef.current, {
      scale: 1.03,
      filter: 'sepia(0) contrast(1.15) brightness(0.95)',
      duration: 0.3,
      overwrite: 'auto'
    })
  })

  // mouseLeave: restore original layout scale and sepia coloring
  const handleMouseLeave = contextSafe(() => {
    if (isAnimating) return
    gsap.to(motorcycleRef.current, {
      scale: 1,
      filter: 'sepia(0.2) contrast(1.1) brightness(0.8)',
      duration: 0.3,
      overwrite: 'auto',
      onComplete: () => {
        // Reset coordinate modifications to ensure rumble runs centered
        gsap.set(motorcycleRef.current, { x: 0, y: 0, rotation: 0 })
      }
    })
  })

  // motorcycleClick: executes the timeline flight and shows quotes
  const handleMotorcycleClick = contextSafe(() => {
    if (isAnimating || !audioRef.current) return
    setIsAnimating(true)

    // Halt idle vibration and kill other active tweens on the element
    rumbleRef.current?.kill()
    gsap.killTweensOf(motorcycleRef.current)
    
    // Set baseline coordinates and resets transforms for takeoff
    gsap.set(motorcycleRef.current, { 
      x: 0, 
      y: 0, 
      scale: 1.03, 
      opacity: 1,
      rotation: 0,
      rotationY: 0,
      skewY: 0,
      filter: 'sepia(0) contrast(1.15) brightness(0.95)',
      transformOrigin: '50% 50%'
    })

    // Reset quote container position hidden below wrapper clip
    gsap.set(quoteRef.current, {
      y: '100%',
      opacity: 0
    })

    const audio = audioRef.current
    audio.volume = 1.0
    audio.currentTime = 0

    // Play engine acceleration sound effect
    audio.play().catch((err) => {
      console.log("Audio playback blocked:", err)
    })

    // Calculate reading duration:
    // Short quotes (<= 6 words): 0.5s per word (min 1.8s)
    // Long quotes (> 6 words): base of 3.0s, plus 0.8s per word after the 6th
    const currentQuote = quotes[quoteIndex]
    const wordCount = currentQuote.split(/\s+/).filter(Boolean).length
    const readingDuration = wordCount <= 6 
      ? Math.max(1.8, wordCount * 0.5) 
      : 3.0 + (wordCount - 6) * 0.8

    // Update index for next click and persist
    setQuoteIndex((prev) => {
      const next = (prev + 1) % quotes.length
      sessionStorage.setItem('aboutQuoteIndex', next.toString())
      return next
    })

    // Main flight timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        // Resume idle vibration at rest
        startRumble()
      }
    })

    // Phase 1: Engine rev startup vibration (0s - 1.5s)
    tl.to(motorcycleRef.current, {
      x: 'random(-2.5, 2.5)',
      y: 'random(-2.5, 2.5)',
      rotation: 'random(-1.2, 1.2)',
      duration: 0.05,
      repeat: 30, // 30 iterations * 0.05s = 1.5 seconds
      yoyo: true,
      ease: 'none'
    })

    // Phase 2: Bike pivots backward slightly preparing for takeoff (1.5s - 2.2s)
    tl.to(motorcycleRef.current, {
      x: 0,
      y: 0,
      rotation: -3,
      rotationY: -25,
      skewY: -1,
      duration: 0.7,
      ease: 'power1.inOut'
    })

    // Phase 3: Accelerate off-screen and scale down to simulate depth (2.2s - 5.0s)
    tl.to(motorcycleRef.current, {
      x: '120vw',
      y: '120px',
      scale: 0.05,
      opacity: 0,
      duration: 2.8,
      ease: 'power2.in',
      onStart: () => {
        // Fade out volume in synchronization with distance
        let fadeInterval = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume -= 0.05
          } else {
            clearInterval(fadeInterval)
            audio.pause()
          }
        }, 80)
      }
    })

    // Pop the wheelie: pitch front wheel up 35 degrees relative to bottom-left axis
    tl.to(motorcycleRef.current, {
      rotation: -35,
      transformOrigin: '25% 85%',
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, '<')

    // Transition Quote: slide quote container onto the screen as bike takes off
    tl.set(quoteRef.current, {
      y: '100%',
      opacity: 0
    }, '<0.3')

    tl.to(quoteRef.current, {
      y: '0%',
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    })

    // Wait for the readingDuration, then slide quote out
    tl.to(quoteRef.current, {
      y: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      delay: readingDuration
    })

    // Position bike off-screen left to prepare for return
    tl.set(motorcycleRef.current, {
      x: '-100vw',
      y: 0,
      scale: 0.5,
      opacity: 0,
      rotation: 0,
      rotationY: 0,
      skewY: 0,
      transformOrigin: '50% 50%'
    })

    // Cruise back in to default center coordinates
    tl.to(motorcycleRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
  })

  return (
    <div ref={containerRef}>
      {/* About Section */}
      <section className="section">
        <div className="about-grid">
          <div ref={historyTextRef}>
            <h2 id="history-heading">Our History</h2>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              National Motorcycle Club
            </h3>
            <p>
              Established in 1987 in Fort Lauderdale, Florida and is incorporated as a non-profit organization.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              The club as a national organization strives to achieve the following:
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                To provide a club for qualified male military veterans which offers brotherhood and an opportunity to establish relationships with other military veterans who have served in the defense of the United States of America.
              </li>
              <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                To establish and support a strong sense of pride in having served in the active military service of the United States of America.
              </li>
              <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                To improve the image of military veterans and bikers to the public.
              </li>
            </ul>
          </div>
          <div ref={historyImgRef} className="about-img-container">
            <img
              ref={motorcycleRef}
              src="/images/whiteHarley.png?v=2"
              alt="White Harley Motorcycle"
              className="about-img"
              title="Click to Ride!"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleMotorcycleClick}
            />
            {/* Quote Wrapper that clips the sliding text */}
            <div className="about-bike-quote-wrapper">
              <div ref={quoteRef} className="about-bike-quote">
                “{quotes[quoteIndex]}”
              </div>
            </div>
          </div>
        </div>

        {/* Local Chapter Section */}
        <div style={{ marginTop: '5rem' }}>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-gold)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Local Chapter: Indiana 9 (Cannonball)
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            This chapter of the USMVMC is in Peru, Indiana. We call our local chapter "Cannonball" in recognition of the famous Wabash Cannonball. The Wabash Railroad adopted the name in 1949 for its daytime express between Detroit, Michigan, and St. Louis, Missouri.
          </p>
          
          <div className="local-history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Route & Stops */}
            <div ref={(el) => (localHistoryCardsRef.current[0] = el)} className="feature-card" style={{ textAlign: 'left', padding: '2rem' }}>
              <div className="feature-icon" style={{ justifyContent: 'flex-start' }}>🗺️</div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Route & Stops</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                488.8 miles across the Midwest, stopping at Fort Wayne, Huntington, Peru, Logansport, Lafayette, Danville, and Decatur, with arrivals/departures at St. Louis Union Station and Detroit's Fort Street Union Depot.
              </p>
            </div>
            
            {/* Legacy & Myths */}
            <div ref={(el) => (localHistoryCardsRef.current[1] = el)} className="feature-card" style={{ textAlign: 'left', padding: '2rem' }}>
              <div className="feature-icon" style={{ justifyContent: 'flex-start' }}>✍️</div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Legacy & Myths</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                <strong>Legacy:</strong> It describes a fictional train called the Wabash Cannonball Express.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                <strong>Hobo myth:</strong> Some believe it came from a tall tale of a mythical "death coach" train that carried hobos' souls to the afterlife, with the whistle heard at every station.
              </p>
            </div>
            
            {/* Paul Bunyan Legend */}
            <div ref={(el) => (localHistoryCardsRef.current[2] = el)} className="feature-card" style={{ textAlign: 'left', padding: '2rem' }}>
              <div className="feature-icon" style={{ justifyContent: 'flex-start' }}>🪓</div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Paul Bunyan Legend</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                Another story credits Cal S. Bunyan, Paul Bunyan's brother, who supposedly built a railroad so fast it arrived before it left.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Patch Meaning */}
      <section className="section section-alt">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 id="patch-heading">The USMVMC Colors</h2>
          </div>

          <div className="colors-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '4rem' }}>
            {/* Left side: Intro Paragraph & Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', margin: 0, color: 'var(--text-secondary)' }}>
                Our patch is not a decoration; it is a sacred symbol of our service, our sacrifice, and our commitment to each other. 
                USMVMC utilizes Black and 1084 Dark Taupe as our primary colors, in conjunction with our trademarked eagle logo.
              </p>
              <div 
                style={{ 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '6px', 
                  padding: '1.5rem', 
                  backgroundColor: 'var(--bg-secondary)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <img 
                  src="/images/small_eagle.png" 
                  alt="USMVMC Eagle Logo" 
                  style={{ 
                    maxHeight: '180px', 
                    width: 'auto', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' 
                  }} 
                />
              </div>
            </div>

            {/* Right side: Represents (Eagle Card) */}
            <div 
              ref={(el) => (patchCardsRef.current[0] = el)} 
            >
              <div 
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--accent-gold)', 
                  borderRadius: '6px', 
                  padding: '2.5rem', 
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' 
                }}
              >
                <h3 id="patch-eagle" style={{ borderBottom: '1px solid var(--accent-gold)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '1.25rem', marginTop: 0 }}>
                  Eagle
                </h3>
                <p style={{ fontWeight: 'bold', color: 'var(--accent-amber)', fontSize: '1.15rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Represents our ability to protect our values.
                </p>
                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: 0 }}>
                  <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>American Flag:</strong> Symbol of our country and represents purity, valor & vigilance.
                  </li>
                  <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Olive Branch:</strong> Represents our belief in a peaceful resolution to conflict.
                  </li>
                  <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Arrows:</strong> Represents the branches of the military.
                  </li>
                  <li style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Liberty Banner:</strong> Symbolizes our freedom from external forces.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="values-grid">
            {/* Top Rocker */}
            <div ref={(el) => (patchCardsRef.current[1] = el)} className="value-card">
              <h3 id="patch-top">Top Rocker</h3>
              <p>Identifies our club's name.</p>
            </div>

            {/* Bottom Rocker */}
            <div ref={(el) => (patchCardsRef.current[2] = el)} className="value-card">
              <h3 id="patch-bottom">Bottom Rocker</h3>
              <p>Identifies a member's branch of service.</p>
            </div>

            {/* Right Cube */}
            <div ref={(el) => (patchCardsRef.current[3] = el)} className="value-card">
              <h3 id="patch-right-cube">Right Cube</h3>
              <p>Identifies us as a motorcycle club.</p>
            </div>

            {/* Left Cube */}
            <div ref={(el) => (patchCardsRef.current[4] = el)} className="value-card">
              <h3 id="patch-left-cube">Left Cube</h3>
              <p>Identifies the state a member hails from.</p>
            </div>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', padding: '2.5rem', border: '1px solid var(--accent-gold)', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--accent-gold)', fontWeight: 'bold', margin: 0, lineHeight: '1.6' }}>
              "Like when we were on active duty, these colors are our uniform and represent our unyielding dedication to Brotherhood."
            </p>
          </div>
        </div>
      </section>

      {/* Officer Leadership Section */}
      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 id="leadership-heading">Club Officers</h2>
          <p style={{ marginTop: '1rem' }}>
            The leadership of the Mother Chapter responsible for executing the club bylaws and organizing runs.
          </p>
        </div>

        <div className="officer-list">
          {/* Officer 1 */}
          <div ref={(el) => (officerCardsRef.current[0] = el)} className="officer-card">
            <div className="officer-avatar">P</div>
            <div className="officer-role">President</div>
            <h3 id="officer-pres">Paws</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Army Veteran
            </p>
            <a href="mailto:pawsin9@gmail.com" className="officer-email">
              pawsin9@gmail.com
            </a>
          </div>
          {/* Officer 2 */}
          <div ref={(el) => (officerCardsRef.current[1] = el)} className="officer-card">
            <div className="officer-avatar">VP</div>
            <div className="officer-role">Vice President</div>
            <h3 id="officer-vp">Topoff</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Navy Veteran
            </p>
            <a href="mailto:topoffin9@gmail.com" className="officer-email">
              topoffin9@gmail.com
            </a>
          </div>
          {/* Officer 3 */}
          <div ref={(el) => (officerCardsRef.current[2] = el)} className="officer-card">
            <div className="officer-avatar">SA</div>
            <div className="officer-role">Sgt at Arms</div>
            <h3 id="officer-saa">Eeyore</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Army Veteran
            </p>
            <a href="mailto:eeyorein9@gmail.com" className="officer-email">
              eeyorein9@gmail.com
            </a>
          </div>
          {/* Officer 4 */}
          <div ref={(el) => (officerCardsRef.current[3] = el)} className="officer-card">
            <div className="officer-avatar">Sec</div>
            <div className="officer-role">Secretary</div>
            <h3 id="officer-sec">Bluto</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Army Veteran
            </p>
            <a href="mailto:joeoutlaw13@gmail.com" className="officer-email">
              joeoutlaw13@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
