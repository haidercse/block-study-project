document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    // helper to close the mobile modal nav cleanly
    const closeMobileNav = () => {
      mainNav.classList.remove('open-visible');
      // wait for transition to finish then remove .open
      setTimeout(() => mainNav.classList.remove('open'), 260);
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.textContent = '☰';
      document.body.classList.remove('no-scroll');
      // return focus to the toggle
      navToggle.focus();
    };

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      const newExpanded = !expanded;
      navToggle.setAttribute('aria-expanded', String(newExpanded));
      if (newExpanded) {
        // open flow
        mainNav.classList.add('open');
        // allow CSS to pick up and transition to visible
        requestAnimationFrame(() => mainNav.classList.add('open-visible'));
        // prevent background scrolling
        document.body.classList.add('no-scroll');
        // swap the hamburger to an X for clarity
        navToggle.textContent = '✕';
        // focus the first link for keyboard users
        const firstLink = mainNav.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        // close flow
        closeMobileNav();
      }
    });

    // ensure pressing Escape closes the modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // add a visible close button in the modal (for accessibility)
    let modalClose = mainNav.querySelector('.modal-close');
    if (!modalClose) {
      modalClose = document.createElement('button');
      modalClose.className = 'modal-close';
      modalClose.setAttribute('aria-label', 'Close menu');
      modalClose.textContent = '✕';
      // insert at the top of the menu (before all links) once opened
      // we'll append it to the ul so it sits above links in the modal
      const menuList = mainNav.querySelector('ul');
      if (menuList) menuList.insertAdjacentElement('afterbegin', modalClose);
    }
    modalClose.addEventListener('click', closeMobileNav);

    // Close the mobile menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });

    // Optional: close the menu on wider resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800 && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      }
    });
  }

  let slides = Array.from(document.querySelectorAll('.slide'));
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  const resetBtn = document.getElementById('reset');

  const giantCommands = [
    "Stand still, big fella!",
    "Hold that mountain!",
    "Turn your head, the sun’s in my eyes!",
    "Stop growing, you’re blocking the clouds!",
    "Walk gently, I just planted carrots!"
  ];

  let currentIndex = 0;
  let removedSlides = [];

  // show current slide
  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  };
  showSlide(currentIndex);

  // carousel next/prev
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  // add dismiss buttons
  slides.forEach(slide => {
    const btn = document.createElement('button');
    btn.className = 'dismiss';
    btn.textContent = giantCommands[Math.floor(Math.random() * giantCommands.length)] + " Be gone!";
    slide.appendChild(btn);
  });

  // dismiss handler
  document.addEventListener('click', e => {
    if (e.target.matches('.dismiss')) {
      const slide = e.target.closest('.slide');
      const slideIndex = slides.indexOf(slide);
      
      // Store the removed slide
      removedSlides.push(slide.outerHTML);
      
      // Remove the slide from DOM and our slides array
      slide.remove();
      slides = slides.filter((s, i) => i !== slideIndex);
      
      // If there are remaining slides
      if (slides.length > 0) {
        // If we removed the last slide, show the new last slide
        if (slideIndex >= slides.length) {
          currentIndex = slides.length - 1;
        } else {
          // Otherwise, show the slide at the same index (which will be the next slide)
          currentIndex = slideIndex;
        }
        showSlide(currentIndex);
      } else {
        // If no slides left, show empty message
        const carousel = document.querySelector('.carousel');
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = `
          <h2>No More Giants</h2>
          <p>All giants have departed. Click "Summon Giants Again" to bring them back.</p>
        `;
        carousel.appendChild(emptyMessage);
      }
    }
  });

  // reset handler
  resetBtn.addEventListener('click', () => {
    if (!removedSlides.length) return;
    
    // Remove all current slides first
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = '';
    
    // Add back all slides
    removedSlides.forEach(html => {
      carousel.insertAdjacentHTML('beforeend', html);
    });
    
    // Reset slides array with new elements
    slides = Array.from(document.querySelectorAll('.slide'));
    
    // Remove existing dismiss buttons and add new ones
    slides.forEach(slide => {
      const existingBtn = slide.querySelector('.dismiss');
      if (existingBtn) existingBtn.remove();
      
      const btn = document.createElement('button');
      btn.className = 'dismiss';
      btn.textContent = giantCommands[Math.floor(Math.random() * giantCommands.length)] + " Be gone!";
      slide.appendChild(btn);
    });
    
    // Reset current index and show first slide
    currentIndex = 0;
    showSlide(currentIndex);
    
    // Clear removed slides array
    removedSlides = [];
  });

  // Gallery lightbox behavior
  // Create lightbox markup once
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">×</button>
      <img src="" alt="" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // open lightbox when clicking a gallery image
  function attachGalleryHandlers() {
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', (ev) => {
        lightboxImg.src = ev.currentTarget.src;
        lightboxImg.alt = ev.currentTarget.alt || '';
        lightbox.classList.add('active');
      });
    });
  }

  attachGalleryHandlers();

  // Close handlers
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });

  // Contact form handling (client-side only)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill all fields.');
        return;
      }

      // Show success message and clear form (no network request)
      const success = document.createElement('div');
      success.className = 'form-success';
      success.textContent = 'Thanks! Your message has been received (locally).';
      const contactCard = document.querySelector('.contact-card');
      contactCard.appendChild(success);

      contactForm.reset();

      // remove message after a few seconds
      setTimeout(() => success.remove(), 5000);
    });
  }
});
