document.addEventListener('DOMContentLoaded', () => {
  // Inject shared header and footer
  injectHeader();
  injectFooter();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize gallery features (if on gallery page)
  if (document.querySelector('.gallery-grid') || document.getElementById('gallery-sections')) {
    initGallery();
  }

  // Initialize members page gate (if on members page)
  if (document.getElementById('member-gate') || document.getElementById('members-dashboard')) {
    initMemberGate();
  }

  // Initialize contact form validation (if on contact page)
  if (document.getElementById('join-form')) {
    initContactForm();
  }

  // Initialize biker drive-by animation (on first homepage visit)
  initBikerAnimation();
});

/* ==========================================================================
   Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   Gallery & Lightbox Logic
   ========================================================================== */
let currentImages = [];
let currentImageIndex = 0;

function initGallery() {
  const gallerySectionsContainer = document.getElementById('gallery-sections');
  if (!gallerySectionsContainer) return;

  // Clear container
  gallerySectionsContainer.innerHTML = '';

  // Check if we have folders and images in galleryData (from gallery-data.js)
  if (typeof galleryData === 'undefined' || galleryData.length === 0) {
    gallerySectionsContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0; border: 1px dashed var(--border-color); border-radius: 6px;">
        <p>No gallery folders found. Run <code>update_gallery.bat</code> to create directories and scan files.</p>
      </div>
    `;
    return;
  }

  // Build gallery elements dynamically
  let allImagesForLightbox = [];

  galleryData.forEach(folder => {
    // We only display the folder section if it exists, but let's give instructions if it's empty
    const section = document.createElement('div');
    section.className = 'gallery-folder-section';
    
    let imagesHtml = '';
    if (folder.images.length === 0) {
      imagesHtml = `
        <div style="grid-column: 1 / -1; padding: 2rem; background-color: var(--bg-secondary); border: 1px dashed var(--border-color); border-radius: 4px; text-align: center;">
          <p style="color: var(--text-muted); margin-bottom: 0;">No images in this folder yet. Drop image files (.jpg, .png, etc.) inside the <code>gallery/${folder.folderName}/</code> directory and run <code>update_gallery.bat</code>.</p>
        </div>
      `;
    } else {
      folder.images.forEach(imgUrl => {
        // Track for lightbox sequential viewing
        allImagesForLightbox.push({
          url: imgUrl,
          caption: folder.folderName
        });
        const index = allImagesForLightbox.length - 1;

        imagesHtml += `
          <div class="gallery-item" data-index="${index}">
            <img src="${imgUrl}" alt="${folder.folderName}" loading="lazy" onerror="this.onerror=null; this.src='images/placeholder_chopper.jpg';">
            <div class="gallery-item-overlay">
              <span class="gallery-item-caption">View Photo</span>
            </div>
          </div>
        `;
      });
    }

    section.innerHTML = `
      <h3 class="gallery-section-title">${folder.folderName}</h3>
      <div class="gallery-grid">
        ${imagesHtml}
      </div>
    `;

    gallerySectionsContainer.appendChild(section);
  });

  // Store globally for lightbox navigation
  currentImages = allImagesForLightbox;

  // Setup Lightbox Clicks
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (lightbox && lightboxImg && lightboxCaption) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        openLightbox(index);
      });
    });

    const openLightbox = (index) => {
      currentImageIndex = index;
      lightboxImg.src = currentImages[index].url;
      lightboxCaption.textContent = currentImages[index].caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable scroll
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
    };

    const showNext = (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      lightboxImg.src = currentImages[currentImageIndex].url;
      lightboxCaption.textContent = currentImages[currentImageIndex].caption;
    };

    const showPrev = (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      lightboxImg.src = currentImages[currentImageIndex].url;
      lightboxCaption.textContent = currentImages[currentImageIndex].caption;
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    // Close lightbox on clicking background
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext(e);
      if (e.key === 'ArrowLeft') showPrev(e);
    });
  }
}

/* ==========================================================================
   Members Area Password Gate
   ========================================================================== */
function initMemberGate() {
  const gateSection = document.getElementById('member-gate');
  const dashboardSection = document.getElementById('members-dashboard');
  const gateForm = document.getElementById('gate-form');
  const passcodeFeedback = document.getElementById('passcode-feedback');
  const logoutBtn = document.getElementById('logout-btn');

  const correctPasscode = 'USMV1975';

  const checkAuth = () => {
    const isLoggedIn = sessionStorage.getItem('usmvmc_logged_in') === 'true';
    if (isLoggedIn) {
      if (gateSection) gateSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'block';
    } else {
      if (gateSection) gateSection.style.display = 'block';
      if (dashboardSection) dashboardSection.style.display = 'none';
    }
  };

  // Run immediately on page load
  checkAuth();

  if (gateForm) {
    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputCode = document.getElementById('member-passcode').value;

      if (inputCode === correctPasscode) {
        sessionStorage.setItem('usmvmc_logged_in', 'true');
        passcodeFeedback.style.display = 'none';
        checkAuth();
      } else {
        passcodeFeedback.textContent = 'ACCESS DENIED: Invalid club passcode.';
        passcodeFeedback.className = 'form-feedback error';
        passcodeFeedback.style.display = 'block';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('usmvmc_logged_in');
      checkAuth();
    });
  }
}

/* ==========================================================================
   Contact / Join Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('join-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic local validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service-branch').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        feedback.textContent = 'Please fill out all required fields.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
        return;
      }

      // Simulating successful submission
      feedback.textContent = 'APPLICATION SUBMITTED SUCCESSFULY. A club officer will review your details and contact you shortly. Ride Safe.';
      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';

      // Clear form
      form.reset();
    });
  }
}

/* ==========================================================================
   Biker Drive-by Animation with Sound (One-time per Session)
   ========================================================================== */
function initBikerAnimation() {
  // 1. Only run on the home page
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname === '';
  if (!isHomePage) return;

  // 2. Check if already played in this session
  if (sessionStorage.getItem('bikerAnimationPlayed') === 'true') return;

  // 3. Preload the biker image and audio immediately on page load
  const bikerImg = new Image();
  bikerImg.src = 'images/HarleyWheelie.png';

  const audio = new Audio('images/harleysound.mp3');
  audio.preload = 'auto';
  audio.volume = 1.0;

  let audioPlayed = false;
  let visualStarted = false;

  // Helper to start the visual animation
  const startVisualAnimation = () => {
    if (visualStarted) return;
    visualStarted = true;

    // Create the image container elements
    const container = document.createElement('div');
    container.className = 'biker-animation-container';
    
    bikerImg.alt = 'Harley Wheelie';
    container.appendChild(bikerImg);
    document.body.appendChild(container);

    // Force browser layout reflow to ensure CSS animation triggers cleanly
    container.offsetWidth;

    // Start driving across
    container.classList.add('biker-drive-active');
    
    // Timer for fade-out and cleanup:
    // - Animation takes 3.5s.
    // - If audio is playing, wait 3.5s and then fade out audio.
    // - If audio is not playing, wait 3.5s and then just remove the container.
    setTimeout(() => {
      if (audioPlayed) {
        // Fade out the audio
        const fadeInterval = setInterval(() => {
          if (audio.volume > 0.1) {
            audio.volume -= 0.15;
          } else {
            clearInterval(fadeInterval);
            audio.pause();
            
            // Clean up elements from DOM
            container.remove();
            audio.remove();
          }
        }, 80);
      } else {
        // Clean up elements from DOM immediately
        container.remove();
        audio.remove();
      }
    }, 3500);
  };

  // 4. Define the trigger function
  const triggerAnimation = (source) => {
    // If triggered by scroll, we ONLY proceed if audio can play.
    // If it cannot play (blocked by browser autoplay rules), we do NOT show the graphic,
    // do NOT set sessionStorage, and do NOT clean up the click/touchstart listeners.
    if (source === 'scroll') {
      audio.play().then(() => {
        // Audio succeeded on scroll! Run the animation.
        cleanupListeners();
        sessionStorage.setItem('bikerAnimationPlayed', 'true');
        audioPlayed = true;
        setTimeout(startVisualAnimation, 1000);
      }).catch(err => {
        // Audio failed on scroll. Do not run the animation.
        // Keep click and touchstart listeners active so sound plays on later click.
        console.log("Audio play blocked on scroll, waiting for click/tap.");
      });
      return;
    }

    // If triggered by click or touchstart:
    cleanupListeners();
    sessionStorage.setItem('bikerAnimationPlayed', 'true');

    // A fallback timer: if audio.play() hangs or takes too long,
    // we start the visual animation anyway after 1.2 seconds.
    const fallbackTimer = setTimeout(() => {
      console.log("Audio play timed out or hung, starting animation silently.");
      startVisualAnimation();
    }, 1200);

    // Try playing the audio first
    audio.play().then(() => {
      clearTimeout(fallbackTimer);
      audioPlayed = true;
      // Sound starts! Wait 1 second (1000ms) before starting visual animation
      setTimeout(startVisualAnimation, 1000);
    }).catch(err => {
      clearTimeout(fallbackTimer);
      console.log("Audio play failed or was blocked:", err);
      // Audio failed/blocked. Start the visual animation immediately!
      startVisualAnimation();
    });
  };

  const cleanupListeners = () => {
    window.removeEventListener('click', handleWindowClick);
    window.removeEventListener('scroll', handleWindowScroll);
    window.removeEventListener('touchstart', handleWindowTouchStart);
  };

  // Event handlers to filter out clicks/taps on navigation elements
  const handleWindowClick = (e) => {
    if (e.target && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.hamburger'))) {
      return;
    }
    triggerAnimation('click');
  };

  const handleWindowTouchStart = (e) => {
    if (e.target && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.hamburger'))) {
      return;
    }
    triggerAnimation('touchstart');
  };

  const handleWindowScroll = () => {
    // Remove scroll listener immediately so we don't keep checking on every scroll pixel
    window.removeEventListener('scroll', handleWindowScroll);
    triggerAnimation('scroll');
  };

  // 5. Listen for first user interaction (click, scroll, touch) to bypass browser autoplay blocks
  window.addEventListener('click', handleWindowClick);
  window.addEventListener('scroll', handleWindowScroll, { passive: true });
  window.addEventListener('touchstart', handleWindowTouchStart, { passive: true });
}

/* ==========================================================================
   Shared Header & Footer Injection
   ========================================================================== */
function injectHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  header.innerHTML = `
    <div class="header-container">
      <a href="index.html" class="logo-link" id="nav-logo">
        <img src="images/usmvmc_logo_transparent.png" alt="USMV MC Logo" class="logo-img" onerror="this.style.display='none'; document.getElementById('logo-text').style.display='block';">
        <div id="logo-text" class="logo-fallback" style="display: none;">USMV <span>MC</span></div>
      </a>
      
      <button class="hamburger" aria-label="Toggle Menu" id="hamburger-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="nav-menu">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About & History</a></li>
          <li><a href="events.html">Rides & Events</a></li>
          <li><a href="gallery.html">Photo Gallery</a></li>
          <li><a href="contact.html">Join / Contact</a></li>
          <li><a href="members.html">Members Only</a></li>
        </ul>
      </nav>
    </div>
  `;

  // Set active link based on current path
  const currentPath = window.location.pathname;
  const navLinks = header.querySelectorAll('nav a');
  
  let activeFound = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href)) {
      link.classList.add('active');
      activeFound = true;
    }
  });

  // Fallback for homepage root path
  if (!activeFound) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
      }
    });
  }
}

function injectFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-about">
        <h3>USMV MC</h3>
        <p>The U.S. Military Veterans Motorcycle Club (USMVMC) is a motorcycle club first, founded on the brotherhood, loyalty, and shared values of military veterans while supporting local veteran communities through charitable work and motorcycle advocacy.</p>
      </div>
      <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About & History</a></li>
          <li><a href="events.html">Rides & Events</a></li>
          <li><a href="gallery.html">Photo Gallery</a></li>
          <li><a href="contact.html">Join / Contact</a></li>
          <li><a href="members.html">Members Area</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h3>Contact Info</h3>
        <p>📍 National Headquarters</p>
        <p>✉️ info@usmvmc.org</p>
        <p>🏍️ Ride Safe. Ride Honorably.</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} U.S. Military Veterans Motorcycle Club. All Rights Reserved.</p>
      <p style="font-size: 0.75rem; color: var(--text-muted);">The name U.S. Military Vets MC and Eagle with the U.S. Flag logo are property of the U.S. Military Vets MC Inc., a Florida Not-For-Profit 501(c)(3) Corporation and cannot and will not be used or reproduced without written permission from U.S. Military Vets MC Inc.</p>
    </div>
  `;
}
