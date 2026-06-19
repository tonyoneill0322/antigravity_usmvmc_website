import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function BikerAnimation() {
  const [shouldRender, setShouldRender] = useState(false)
  const [visualActive, setVisualActive] = useState(false)
  const bikerRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '';
    if (!isHomePage) return

    if (sessionStorage.getItem('bikerAnimationPlayed') === 'true') {
      return
    }

    const audio = new Audio('/images/harleysound.mp3')
    audio.preload = 'auto'
    audio.volume = 1.0
    audioRef.current = audio

    setShouldRender(true)

    let eventTriggered = false

    const triggerAnimation = (source) => {
      if (eventTriggered) return

      const playAudio = () => {
        audio.play()
          .then(() => {
            setTimeout(() => {
              setVisualActive(true)
            }, 1000)

            setTimeout(() => {
              let fadeInterval = setInterval(() => {
                if (audio.volume > 0.1) {
                  audio.volume -= 0.15
                } else {
                  clearInterval(fadeInterval)
                  audio.pause()
                  setShouldRender(false)
                }
              }, 80)
            }, 3500)
          })
          .catch((err) => {
            console.log("Audio play blocked or failed:", err)
            setVisualActive(true)
            setTimeout(() => {
              setShouldRender(false)
            }, 3500)
          })
      }

      if (source === 'scroll') {
        audio.play().then(() => {
          eventTriggered = true
          cleanupListeners()
          sessionStorage.setItem('bikerAnimationPlayed', 'true')
          audio.pause()
          audio.currentTime = 0
          playAudio()
        }).catch(() => {
          console.log("Scroll autoplay blocked, waiting for user interaction.")
        })
      } else {
        eventTriggered = true
        cleanupListeners()
        sessionStorage.setItem('bikerAnimationPlayed', 'true')
        playAudio()
      }
    }

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

    return () => {
      cleanupListeners()
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

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
