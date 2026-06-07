/* ======================================================
   Deepak & Rohini — Wedding Website JavaScript
   Animations, Interactivity & Dynamic Features
   ====================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ============ Preloader ============
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.style.display = 'none', 600);
    }, 1500);
  });

  // Fallback: hide preloader after 4 seconds regardless
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.style.display = 'none', 600);
  }, 4000);


  // ============ Initialize AOS ============
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: 'mobile'
  });


  // ============ Floating Hearts Background ============
  const heartsContainer = document.getElementById('floatingHearts');
  const heartSymbols = ['♥', '♡', '❤', '💕', '✦'];

  function createFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    heart.style.animationDuration = (Math.random() * 15 + 10) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 25000);
  }

  // Create initial batch of hearts
  for (let i = 0; i < 12; i++) {
    setTimeout(createFloatingHeart, i * 800);
  }
  // Continue creating hearts
  setInterval(createFloatingHeart, 3000);


  // ============ Navbar Scroll Effect ============
  const navbar = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link-wedding');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavScroll();
    highlightNavOnScroll();
  });


  // ============ Smooth Scroll for Nav Links ============
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
      // Close mobile menu
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });


  // ============ Countdown Timer ============
  const weddingDate = new Date('September 12, 2026 18:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '🎉';
      document.getElementById('countHours').textContent = '🎉';
      document.getElementById('countMinutes').textContent = '🎉';
      document.getElementById('countSeconds').textContent = '🎉';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateCounterValue('countDays', days);
    animateCounterValue('countHours', hours);
    animateCounterValue('countMinutes', minutes);
    animateCounterValue('countSeconds', seconds);
  }

  function animateCounterValue(id, value) {
    const el = document.getElementById(id);
    const current = el.textContent;
    const padded = String(value).padStart(id === 'countDays' ? 3 : 2, '0');
    if (current !== padded) {
      el.style.transform = 'translateY(-5px)';
      el.style.opacity = '0.5';
      setTimeout(() => {
        el.textContent = padded;
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 150);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ============ Counter Animation (Stats Section) ============
  const counterNumbers = document.querySelectorAll('.counter-number[data-target]');

  function animateCounters() {
    counterNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const increment = target / 80;
      let current = 0;

      function updateCounter() {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      }

      updateCounter();
    });
  }

  // Intersection Observer for counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const countersSection = document.querySelector('.counters-section');
  if (countersSection) counterObserver.observe(countersSection);


  // ============ Scroll Reveal Animations ============
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  // ============ Back to Top Button ============
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============ RSVP Form ============
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = document.getElementById('rsvpSubmitBtn');
      btn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite;"></i> Sending...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
        rsvpSuccess.style.animation = 'fadeSlideDown 0.6s ease';

        // Confetti burst
        createConfetti();
      }, 1500);
    });
  }

  // ============ Confetti Effect ============
  function createConfetti() {
    const colors = ['#c9a87c', '#d4af37', '#e8c4b8', '#f5e6dc', '#a07d50', '#ff6b81', '#ffd700'];
    const container = document.body;

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.2};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 99999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  }

  // Add confetti animation
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(confettiStyle);


  // ============ Sparkle Cursor Effect ============
  let sparkleThrottle = 0;
  document.addEventListener('mousemove', (e) => {
    sparkleThrottle++;
    if (sparkleThrottle % 4 !== 0) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  });


  // ============ Parallax Effect ============
  window.addEventListener('scroll', () => {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    parallaxBgs.forEach(bg => {
      const scrolled = window.scrollY;
      const section = bg.parentElement;
      const sectionTop = section.offsetTop;
      const rate = (scrolled - sectionTop) * 0.3;
      bg.style.transform = `translateY(${rate}px)`;
    });
  });


  // ============ Image Tilt Effect on Gallery ============
  const galleryItems = document.querySelectorAll('.gallery-item, .mosaic-item');
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    item.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });


  // ============ Typewriter Effect for Tagline ============
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    tagline.style.animation = 'none';
    let i = 0;

    setTimeout(() => {
      function typeWriter() {
        if (i < text.length) {
          tagline.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 40);
        }
      }
      typeWriter();
    }, 2200);
  }


  // ============ Gallery Image Fade-In on Load ============
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });


  // ============ Magnetic Button Effect ============
  const magneticBtns = document.querySelectorAll('.btn-rsvp, .venue-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translate(0, 0)';
    });
  });


  // ============ Smooth Section Visibility ============
  const allSections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.05 });

  allSections.forEach(section => {
    section.style.opacity = '1';
    sectionObserver.observe(section);
  });


  // ============ Easter Egg: Konami Code ============
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        createConfetti();
        createConfetti();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

});


// ============ Lightbox Functions (Global) ============
function openLightbox(element) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const img = element.querySelector('img');

  if (img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
