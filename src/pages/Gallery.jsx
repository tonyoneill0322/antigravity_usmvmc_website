import React, { useState, useEffect, useRef } from 'react'
import { galleryData } from '../gallery-data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger plugin with GSAP for managing scroll-driven animations
gsap.registerPlugin(ScrollTrigger)

/**
 * Gallery Component
 * 
 * Renders the photo gallery divided into folders parsed from `gallery-data.js`.
 * Features:
 * - Dynamic pagination (6 images per page) with custom GSAP transitions.
 * - Flat lightbox index mapping allowing users to navigate through all images
 *   sequentially across folders.
 * - Keyboard listeners (Escape, Left/Right arrows) and scroll lock.
 * - Special side-by-side layout for folders containing only one placeholder image,
 *   displaying a customized "Pictures Coming Soon" label.
 */
function Gallery() {
  // lightboxIndex: Absolute index of the currently open photo in the flat allImages list (null if closed)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  // folderPageMap: Local state tracking the current pagination page index for each folder
  const [folderPageMap, setFolderPageMap] = useState({})
  // prevPageMapRef: Tracks prior page map states to prevent unwanted fade-in triggers on initial load
  const prevPageMapRef = useRef({})
  
  // DOM references for GSAP selectors scoping
  const containerRef = useRef(null)
  const introRef = useRef(null)
  const sectionsRef = useRef([])

  // 1. Flatten all images across folders for seamless lightbox navigation
  const allImages = []
  galleryData.forEach(folder => {
    folder.images.forEach(imgUrl => {
      allImages.push({
        url: imgUrl,
        caption: folder.folderName
      })
    })
  })

  // GSAP animation for gallery page entry and section scroll triggers
  useGSAP(() => {
    // Fade page intro down on mount
    gsap.fromTo(introRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )

    // Register ScrollTriggers for each folder section
    sectionsRef.current.forEach((section, i) => {
      if (section) {
        const title = section.querySelector('.gallery-section-title')
        const items = section.querySelectorAll('.gallery-item')

        // Slide heading text in from the left
        gsap.fromTo(title,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        )

        // Stagger grid images scale-up
        if (items.length > 0) {
          gsap.fromTo(items,
            { opacity: 0, scale: 0.9, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section.querySelector('.gallery-grid'),
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          )
        }
      }
    })
  }, { scope: containerRef })

  // Lightbox keyboard navigation & body overflow scroll-lock toggler
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden' // Prevent page background scrolling
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null)
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'ArrowLeft') handlePrev()
      }
      
      window.addEventListener('keydown', handleKeyDown)
      
      return () => {
        document.body.style.overflow = '' // Restore scroll
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [lightboxIndex])

  // Move back in lightbox index (loops around to end if at 0)
  const handlePrev = (e) => {
    if (e) e.stopPropagation()
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  // Move forward in lightbox index (loops around to 0 if at end)
  const handleNext = (e) => {
    if (e) e.stopPropagation()
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  // Retrieve absolute index of an image in the flat allImages list
  const getAbsoluteIndex = (url) => {
    return allImages.findIndex(img => img.url === url)
  }

  /**
   * Animates current page items fading out, updates index states,
   * then triggers the react pagination update.
   */
  const handlePageChange = (folderName, direction, totalPages, sIdx) => {
    const sectionEl = sectionsRef.current[sIdx]
    if (!sectionEl) return

    const items = sectionEl.querySelectorAll('.gallery-item')
    
    // Fade out current elements
    gsap.to(items, {
      opacity: 0,
      scale: 0.95,
      y: 15,
      duration: 0.25,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        // Update page map index
        setFolderPageMap((prev) => {
          const currentPage = prev[folderName] || 0
          let nextPage = currentPage + direction
          if (nextPage < 0) nextPage = 0
          if (nextPage >= totalPages) nextPage = totalPages - 1
          return {
            ...prev,
            [folderName]: nextPage
          }
        })
      }
    })
  }

  // Stagger-fade-in animation trigger for new items after page state completes update
  useGSAP(() => {
    sectionsRef.current.forEach((section, sIdx) => {
      if (section) {
        const folder = galleryData[sIdx]
        if (!folder) return

        const prevPage = prevPageMapRef.current[folder.folderName] || 0
        const currentPage = folderPageMap[folder.folderName] || 0

        // If page changed, trigger the stagger entry animation on the new page's images
        if (currentPage !== prevPage) {
          const items = section.querySelectorAll('.gallery-item')
          gsap.fromTo(items,
            { opacity: 0, scale: 0.95, y: 15 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.04,
              ease: 'power2.out',
              overwrite: 'auto'
            }
          )
        }
      }
    })

    // Store current state for future frame differentials
    prevPageMapRef.current = { ...folderPageMap }
  }, [folderPageMap])

  return (
    <div ref={containerRef}>
      <section className="section">
        {/* Intro */}
        <div ref={introRef} className="gallery-intro">
          <h2>Club Photo Gallery</h2>
          <p>
            Images from our runs, charity events, and times together. We truly enjoy the ride, the destination is where the road leads.
          </p>
        </div>

        {/* Gallery Folder Sections */}
        <div id="gallery-sections">
          {galleryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
              <p>No gallery folders found. Run <code>update_gallery.bat</code> to create directories and scan files.</p>
            </div>
          ) : (
            galleryData.map((folder, sIdx) => {
              const currentPage = folderPageMap[folder.folderName] || 0
              const totalPages = Math.ceil(folder.images.length / 6)
              const visibleImages = folder.images.slice(currentPage * 6, (currentPage + 1) * 6)
              
              // Detects placeholder folders: contains exactly 1 photo matching placeholder filenames
              const isPlaceholderOnly = folder.images.length === 1 && 
                (folder.images[0].includes('poker1.jpg') || 
                 folder.images[0].includes('ride1.jpg') || 
                 folder.images[0].includes('placeholder_chopper.jpg'))

              return (
                <div 
                  key={folder.folderName} 
                  ref={(el) => (sectionsRef.current[sIdx] = el)}
                  className="gallery-folder-section"
                  style={{ marginBottom: '4rem' }}
                >
                  <h3 className="gallery-section-title">{folder.folderName}</h3>
                  
                  <div className="gallery-section-wrapper" data-folder={folder.folderName}>
                    {/* Left arrow: visible if there are multiple pages of photos */}
                    {totalPages > 1 && (
                      <button 
                        className={`gallery-scroll-arrow gallery-scroll-arrow-left ${currentPage === 0 ? 'disabled' : ''}`}
                        aria-label="Previous Page"
                        onClick={() => handlePageChange(folder.folderName, -1, totalPages, sIdx)}
                      >
                        &#10094;
                      </button>
                    )}

                    <div className="gallery-grid-container" style={isPlaceholderOnly ? { width: '100%' } : {}}>
                      {/* Conditional Render: Split layout for empty folders, normal grid otherwise */}
                      {isPlaceholderOnly ? (
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                          gap: '2.5rem', 
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '1.5rem',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                          {/* Left Column: Interactive placeholder graphic */}
                          <div
                            className="gallery-item"
                            onClick={() => setLightboxIndex(getAbsoluteIndex(folder.images[0]))}
                            style={{ maxWidth: '350px', margin: '0 auto', width: '100%' }}
                          >
                            <img
                              src={`/${folder.images[0]}`}
                              alt={folder.folderName}
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = '/images/placeholder_chopper.jpg'
                              }}
                            />
                            <div className="gallery-item-overlay">
                              <span className="gallery-item-caption">View Photo</span>
                            </div>
                          </div>

                          {/* Right Column: "Pictures Coming Soon" visual notice */}
                          <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <h4 style={{ 
                                fontFamily: 'var(--font-heading)', 
                                color: 'var(--accent-gold)', 
                                fontSize: '2rem', 
                                letterSpacing: '2px',
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase'
                              }}>
                              Pictures Coming Soon
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>
                              We're currently gathering photos for this event. Check back soon for updates!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="gallery-grid">
                          {folder.images.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: '2rem', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', borderRadius: '4px', textAlign: 'center' }}>
                              <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                                No images in this folder yet. Drop image files (.jpg, .png, etc.) inside the{' '}
                                <code>gallery/{folder.folderName}/</code> directory and run <code>update_gallery.bat</code>.
                              </p>
                            </div>
                          ) : (
                            visibleImages.map((imgUrl) => (
                              <div
                                key={imgUrl}
                                className="gallery-item"
                                onClick={() => setLightboxIndex(getAbsoluteIndex(imgUrl))}
                              >
                                <img
                                  src={`/${imgUrl}`}
                                  alt={folder.folderName}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = '/images/placeholder_chopper.jpg'
                                  }}
                                />
                                <div className="gallery-item-overlay">
                                  <span className="gallery-item-caption">View Photo</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right arrow: visible if there are multiple pages of photos */}
                    {totalPages > 1 && (
                      <button 
                        className={`gallery-scroll-arrow gallery-scroll-arrow-right ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
                        aria-label="Next Page"
                        onClick={() => handlePageChange(folder.folderName, 1, totalPages, sIdx)}
                      >
                        &#10095;
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Lightbox UI Component Modal overlay */}
      {lightboxIndex !== null && (
        <div 
          className="lightbox active" 
          style={{ display: 'flex', opacity: 1 }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="lightbox-close" 
            aria-label="Close Lightbox"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>
          
          {/* Previous Arrow */}
          <button 
            className="lightbox-prev lightbox-nav" 
            aria-label="Previous Photo"
            onClick={handlePrev}
          >
            &#10094;
          </button>

          {/* Photo Frame Container */}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              className="lightbox-img" 
              src={`/${allImages[lightboxIndex].url}`} 
              alt="Lightbox View"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/images/placeholder_chopper.jpg'
              }}
            />
            <div className="lightbox-caption">{allImages[lightboxIndex].caption}</div>
          </div>

          {/* Next Arrow */}
          <button 
            className="lightbox-next lightbox-nav" 
            aria-label="Next Photo"
            onClick={handleNext}
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  )
}

export default Gallery
