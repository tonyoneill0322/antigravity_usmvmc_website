import React, { useState, useEffect, useRef } from 'react'
import { galleryData } from '../gallery-data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const containerRef = useRef(null)
  const introRef = useRef(null)
  const sectionsRef = useRef([])

  // Flatten all images for sequential lightbox navigation
  const allImages = []
  galleryData.forEach(folder => {
    folder.images.forEach(imgUrl => {
      allImages.push({
        url: imgUrl,
        caption: folder.folderName
      })
    })
  })

  // GSAP animation for gallery page entry and scroll triggers
  useGSAP(() => {
    gsap.fromTo(introRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )

    sectionsRef.current.forEach((section, i) => {
      if (section) {
        const title = section.querySelector('.gallery-section-title')
        const items = section.querySelectorAll('.gallery-item')

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

  // Lightbox keyboard navigation & body scroll lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null)
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'ArrowLeft') handlePrev()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [lightboxIndex])

  const handlePrev = (e) => {
    if (e) e.stopPropagation()
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    if (e) e.stopPropagation()
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  // Find absolute index of image
  const getAbsoluteIndex = (url) => {
    return allImages.findIndex(img => img.url === url)
  }

  return (
    <div ref={containerRef}>
      <section className="section">
        <div ref={introRef} className="gallery-intro">
          <h2>Club Photo Gallery</h2>
          <p>
            Images from our runs, charity events, and times together. Members can add new folders and upload photos by
            dragging and dropping them into directories under the <code>gallery/</code> folder, then double-clicking{' '}
            <code>update_gallery.bat</code> to automatically update the website.
          </p>
        </div>

        {/* Gallery Folder Sections */}
        <div id="gallery-sections">
          {galleryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
              <p>No gallery folders found. Run <code>update_gallery.bat</code> to create directories and scan files.</p>
            </div>
          ) : (
            galleryData.map((folder, sIdx) => (
              <div 
                key={folder.folderName} 
                ref={(el) => (sectionsRef.current[sIdx] = el)}
                className="gallery-folder-section"
                style={{ marginBottom: '4rem' }}
              >
                <h3 className="gallery-section-title">{folder.folderName}</h3>
                <div className="gallery-grid">
                  {folder.images.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '2rem', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)', borderRadius: '4px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
                        No images in this folder yet. Drop image files (.jpg, .png, etc.) inside the{' '}
                        <code>gallery/{folder.folderName}/</code> directory and run <code>update_gallery.bat</code>.
                      </p>
                    </div>
                  ) : (
                    folder.images.map((imgUrl) => (
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
              </div>
            ))
          )}
        </div>
      </section>

      {/* Lightbox UI Component */}
      {lightboxIndex !== null && (
        <div 
          className="lightbox active" 
          style={{ display: 'flex', opacity: 1 }}
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            className="lightbox-close" 
            aria-label="Close Lightbox"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>
          
          <button 
            className="lightbox-prev lightbox-nav" 
            aria-label="Previous Photo"
            onClick={handlePrev}
          >
            &#10094;
          </button>

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
