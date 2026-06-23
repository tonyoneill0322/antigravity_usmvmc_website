import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * BikerAnimation Component
 * 
 * Renders an interactive Harley-Davidson motorcycle overlay that drives across
 * the screen with synchronous engine audio. To satisfy browser autoplay policy
 * (which blocks audio playback before user interaction), this component listens 
 * for the user's first click, scroll, or touch before triggering.
 * 
 * Subscribes to react-router path changes to reset and trigger on home page returns.
 */
function BikerAnimation() {
  // location: React Router path state hook
  const location = useLocation()

  // shouldRender: Controls whether the animation container is present in the DOM.
  const [shouldRender, setShouldRender] = useState(false)
  // visualActive: Controls when the GSAP visual animation (biker riding across screen) starts.
  const [visualActive, setVisualActive] = useState(false)
  
  // Refs for tracking DOM elements and audio instances across renders
  const bikerRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // 1. Gating - Only run the intro animation on the root home page paths
    const isHomePage = location.pathname === '/' || 
                       location.pathname.endsWith('index.html') || 
                       location.pathname === '';
    if (!isHomePage) return

    // 2. Setup Audio - Preload the engine rev sound effect
    const audio = new Audio('/images/harleysound.mp3')
    audio.preload = 'auto'
    audio.volume = 1.0
    audioRef.current = audio

    // Enable rendering of the biker container image in the DOM
    setShouldRender(true)

    let eventTriggered = false

    /**
     * Triggers the sequence of playing the audio and firing the visual animation.
     * @param {string} source - Indicates what event triggered the animation ('click', 'scroll', 'touchstart')
     */
    const triggerAnimation = (source) => {
      if (eventTriggered) return

      /**
       * Sub-routine to manage audio playback, start the visual transition, and fade out the volume.
       */
      const playAudio = () => {
        audio.play()
          .then(() => {
            // Wait 1 second (rev peak) before driving the visual biker across screen
            setTimeout(() => {
              setVisualActive(true)
            }, 1000)

            // After 3.5 seconds, start fading out the engine sound gradually
            setTimeout(() => {
              let fadeInterval = setInterval(() => {
                if (audio.volume > 0.1) {
                  audio.volume -= 0.15
                } else {
                  // Audio has fully faded out - clear interval, pause, and clean DOM container
                  clearInterval(fadeInterval)
                  audio.pause()
                  setShouldRender(false)
                }
              }, 80)
            }, 3500)
          })
          .catch((err) => {
            // Autoplay policy fallback: if play() gets blocked, skip audio and just run the visual animation
            console.log("Audio play blocked or failed:", err)
            setVisualActive(true)
            setTimeout(() => {
              setShouldRender(false)
            }, 3500)
          })
      }

      // Handling user scroll as an autoplay trigger requires checking if the browser permits immediate audio play
      if (source === 'scroll') {
        audio.play().then(() => {
          eventTriggered = true
          cleanupListeners()
          audio.pause()
          audio.currentTime = 0
          playAudio()
        }).catch(() => {
          // Scroll autoplay blocked - wait for explicit click/touchstart instead
          console.log("Scroll autoplay blocked, waiting for user interaction.")
        })
      } else {
        eventTriggered = true
        cleanupListeners()
        playAudio()
      }
    }

    // Event listeners to detect interaction and bypass browser media restrictions
    // Ignore events that occur on links, buttons, or navigation menu elements
    const handleWindowClick = (e) => {
      if (e.target && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.hamburger'))) {
        return
      }
      triggerAnimation('click')
    }

    const handleWindowTouch = (e) => {
      if (e.target && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.hamburger'))) {
        return
      }
      triggerAnimation('touchstart')
    }

    const handleWindowScroll = () => {
      triggerAnimation('scroll')
    }

    const cleanupListeners = () => {
      window.removeEventListener('click', handleWindowClick)
      window.removeEventListener('scroll', handleWindowScroll)
      window.removeEventListener('touchstart', handleWindowTouch)
    }

    window.addEventListener('click', handleWindowClick)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    window.addEventListener('touchstart', handleWindowTouch, { passive: true })

    // React cleanup: stop audio, remove all listeners, and reset render states if path/mount changes
    return () => {
      cleanupListeners()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setShouldRender(false)
      setVisualActive(false)
    }
  }, [location.pathname]) // Triggers reload whenever path shifts

  // GSAP animation: Translates the biker container across the screen from left (-400px) to right (100vw)
  useGSAP(() => {
    if (visualActive && bikerRef.current) {
      gsap.fromTo(bikerRef.current,
        { x: '-400px' },
        { 
          x: '100vw', 
          duration: 3.5, 
          ease: 'power1.inOut',
          onComplete: () => {
            setShouldRender(false)
          }
        }
      )
    }
  }, [visualActive])

  if (!shouldRender) return null

  return (
    <div
      ref={bikerRef}
      className="biker-animation-container"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        transform: 'translate3d(-400px, 0, 0)',
        willChange: 'transform'
      }}
    >
      <img
        src="/images/HarleyWheelie.png"
        alt="Harley Wheelie"
        style={{
          height: window.innerWidth < 768 ? '100px' : '160px',
          width: 'auto',
          display: 'block'
        }}
      />
    </div>
  )
}

export default BikerAnimation
