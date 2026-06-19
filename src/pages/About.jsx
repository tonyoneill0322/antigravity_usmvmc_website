import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

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

function About() {
  const containerRef = useRef(null)
  const historyTextRef = useRef(null)
  const historyImgRef = useRef(null)
  const patchCardsRef = useRef([])
  const officerCardsRef = useRef([])

  const [isAnimating, setIsAnimating] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(() => {
    const saved = sessionStorage.getItem('aboutQuoteIndex')
    return saved ? parseInt(saved, 10) : 0
  })
  const motorcycleRef = useRef(null)
  const quoteRef = useRef(null)
  const audioRef = useRef(null)
  const rumbleRef = useRef(null)

  // Clean helper to start/restart the subtle idle engine rumble
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

  // Initialize audio asset and cleanup rumble on mount/unmount
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

  // Hook context safe helper for event handling
  const { contextSafe } = useGSAP(() => {
    // Subtle idle engine rumble (shakes immediately on mount)
    startRumble()

    // 1. History Section Fade-In
    gsap.fromTo(historyTextRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
    gsap.fromTo(historyImgRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    )

    // 2. Colors cards scroll trigger
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
            trigger: '.values-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    }

    // 3. Officers scroll trigger
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
  }, { scope: containerRef })

  const handleMouseEnter = contextSafe(() => {
    if (isAnimating) return
    // Scale up and light up using GSAP
    gsap.to(motorcycleRef.current, {
      scale: 1.03,
      filter: 'sepia(0) contrast(1.15) brightness(0.95)',
      duration: 0.3,
      overwrite: 'auto'
    })
  })

  const handleMouseLeave = contextSafe(() => {
    if (isAnimating) return
    // Scale down and return to sepia using GSAP
    gsap.to(motorcycleRef.current, {
      scale: 1,
      filter: 'sepia(0.2) contrast(1.1) brightness(0.8)',
      duration: 0.3,
      overwrite: 'auto',
      onComplete: () => {
        // Reset rotation and translation so rumble works centered
        gsap.set(motorcycleRef.current, { x: 0, y: 0, rotation: 0 })
      }
    })
  })

  const handleMotorcycleClick = contextSafe(() => {
    if (isAnimating || !audioRef.current) return
    setIsAnimating(true)

    // Stop and kill idle rumble
    rumbleRef.current?.kill()
    gsap.killTweensOf(motorcycleRef.current)
    
    // Reset position and set starting scale/filter state for clean takeoff
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

    // Reset quote container position and opacity
    gsap.set(quoteRef.current, {
      y: '100%',
      opacity: 0
    })

    const audio = audioRef.current
    audio.volume = 1.0
    audio.currentTime = 0

    // Play synchronized sound
    audio.play().catch((err) => {
      console.log("Audio playback blocked:", err)
    })

    // Compute reading duration:
    // For <= 6 words: 0.5 seconds per word (min 1.8 seconds)
    // For > 6 words: a base of 3 seconds, plus 0.8 seconds per additional word to ensure readability
    const currentQuote = quotes[quoteIndex]
    const wordCount = currentQuote.split(/\s+/).filter(Boolean).length
    const readingDuration = wordCount <= 6 
      ? Math.max(1.8, wordCount * 0.5) 
      : 3.0 + (wordCount - 6) * 0.8

    // Advance quote index for the next click (rotates 0-14) and persist in sessionStorage
    setQuoteIndex((prev) => {
      const next = (prev + 1) % quotes.length
      sessionStorage.setItem('aboutQuoteIndex', next.toString())
      return next
    })

    // Takeoff & Quote Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        // Resume idle rumble fresh
        startRumble()
      }
    })

    // Phase 1: Startup Vibration (0s - 1.5s)
    tl.to(motorcycleRef.current, {
      x: 'random(-2.5, 2.5)',
      y: 'random(-2.5, 2.5)',
      rotation: 'random(-1.2, 1.2)',
      duration: 0.05,
      repeat: 30, // 30 * 0.05 = 1.5s
      yoyo: true,
      ease: 'none'
    })

    // Phase 2: Bike pivots left (1.5s - 2.2s)
    tl.to(motorcycleRef.current, {
      x: 0,
      y: 0,
      rotation: -3,
      rotationY: -25,
      skewY: -1,
      duration: 0.7,
      ease: 'power1.inOut'
    })

    // Phase 3: Accelerate away (2.2s - 5.0s)
    tl.to(motorcycleRef.current, {
      x: '120vw',
      y: '120px',
      scale: 0.05,
      opacity: 0,
      duration: 2.8,
      ease: 'power2.in',
      onStart: () => {
        // Sync volume fadeout
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

    // Pop the wheelie: rotate from the right about 35 degrees at the start of Phase 3
    tl.to(motorcycleRef.current, {
      rotation: -35,
      transformOrigin: '25% 85%',
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, '<')

    // Quote scrolls onto the page as the bike scrolls off
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

    // Wait readingDuration, then quote scrolls off/up
    tl.to(quoteRef.current, {
      y: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      delay: readingDuration
    })

    // Bike comes back in from the left
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
            <p>
              Founded in 1975 by a group of Vietnam combat veterans returning to the East Coast, the{' '}
              <strong>U.S. Military Veterans Motorcycle Club</strong> was born out of a simple need: to recreate the
              intense brotherhood, trust, and shared values that can only be found in military service.
            </p>
            <p>
              Struggling to find their place in a divided civilian society, these veterans found solace on two wheels.
              The roar of the engines and the open road became their therapy, and the club became their sanctuary. Over the
              decades, USMV MC has grown into a national organization, opening chapters in multiple states while keeping
              our core principles intact.
            </p>
            <p>
              We do not care about the branch of service, the war, or the rank you held. If you served honorably under
              the American flag and ride a cruiser, you are our brother.
            </p>
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
      </section>

      {/* The Patch Meaning */}
      <section className="section section-alt">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 id="patch-heading">The USMV MC Colors</h2>
            <p style={{ marginTop: '1rem' }}>
              Our patch is not a decoration; it is a sacred symbol of our service, our sacrifice, and our commitment to each
              other. Here is what our colors represent:
            </p>
          </div>

          <div className="values-grid">
            {/* Top Rocker */}
            <div ref={(el) => (patchCardsRef.current[0] = el)} className="value-card">
              <h3 id="patch-top">Top Rocker</h3>
              <p>Identifies our name: "U.S. Military Vets". It represents our collective military heritage and pride in serving our country.</p>
            </div>
            {/* Center Emblem */}
            <div ref={(el) => (patchCardsRef.current[1] = el)} className="value-card">
              <h3 id="patch-center">Center Emblem</h3>
              <p>The Eagle shield emblem, symbolizing freedom, vigilance, and military courage, combined with a skull representing eternal brotherhood.</p>
            </div>
            {/* Bottom Rocker */}
            <div ref={(el) => (patchCardsRef.current[2] = el)} className="value-card">
              <h3 id="patch-bottom">Bottom Rocker</h3>
              <p>Designates the local state chapter, showing our grounding in local communities and local veteran care.</p>
            </div>
            {/* Gold & Black */}
            <div ref={(el) => (patchCardsRef.current[3] = el)} className="value-card">
              <h3 id="patch-colors">Gold & Black</h3>
              <p>Gold represents the value of honor and service; Black represents our mourning for fallen brothers and prisoners of war (POW/MIA).</p>
            </div>
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
            <h3 id="officer-pres">Gunny</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Marine Corps (Ret.)
              <br />
              Vietnam Vet
            </p>
          </div>
          {/* Officer 2 */}
          <div ref={(el) => (officerCardsRef.current[1] = el)} className="officer-card">
            <div className="officer-avatar">VP</div>
            <div className="officer-role">Vice President</div>
            <h3 id="officer-vp">Doc</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Navy Veteran
              <br />
              Desert Storm Vet
            </p>
          </div>
          {/* Officer 3 */}
          <div ref={(el) => (officerCardsRef.current[2] = el)} className="officer-card">
            <div className="officer-avatar">SA</div>
            <div className="officer-role">Sgt at Arms</div>
            <h3 id="officer-saa">Spike</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Army Veteran
              <br />
              Operation Iraqi Freedom
            </p>
          </div>
          {/* Officer 4 */}
          <div ref={(el) => (officerCardsRef.current[3] = el)} className="officer-card">
            <div className="officer-avatar">RC</div>
            <div className="officer-role">Road Captain</div>
            <h3 id="officer-rc">Cruiser</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              U.S. Air Force Veteran
              <br />
              Avid Road Master
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
