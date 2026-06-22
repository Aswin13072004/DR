/* ======================================================
   Deepak & Rohini — Ultra-Premium Wedding Experience
   GSAP + Lenis + Canvas Particles + Micro-Interactions
   ====================================================== */

(function () {
  'use strict';

  // ═══════════ LENIS SMOOTH SCROLL ═══════════
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  // ═══════════ PRELOADER ═══════════
  const preloader = document.getElementById('preloader');
  const preloaderMonogram = document.getElementById('preloaderMonogram');
  const preloaderNames = document.getElementById('preloaderNames');
  const preloaderTagline = document.getElementById('preloaderTagline');
  const preloaderLine = document.getElementById('preloaderLine');

  const preloaderTL = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
          initHeroAnimations();
          initScrollAnimations();
        }
      });
    }
  });

  // Phase 1: Line draws
  preloaderTL.to(preloaderLine, {
    scaleX: 1,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Phase 2: Monogram appears
  preloaderTL.to(preloaderMonogram, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.3');

  // Phase 3: Names appear
  preloaderTL.to(preloaderNames, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4');

  // Phase 4: Tagline appears
  preloaderTL.to(preloaderTagline, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3');

  // Phase 5: Hold, then fade everything
  preloaderTL.to([preloaderMonogram, preloaderNames, preloaderTagline, preloaderLine], {
    opacity: 0,
    y: -20,
    duration: 0.6,
    stagger: 0.05,
    ease: 'power2.in',
    delay: 0.8
  });

  // Set initial states
  gsap.set([preloaderMonogram, preloaderNames, preloaderTagline], { y: 20, opacity: 0 });
  gsap.set(preloaderLine, { scaleX: 0, opacity: 0 });

  // Failsafe: hide preloader after 6 seconds
  setTimeout(() => {
    if (preloader.style.display !== 'none') {
      preloaderTL.kill();
      gsap.to(preloader, {
        opacity: 0, duration: 0.5,
        onComplete: () => {
          preloader.style.display = 'none';
          initHeroAnimations();
          initScrollAnimations();
        }
      });
    }
  }, 6000);


  // ═══════════ GOLD PARTICLES (Canvas) ═══════════
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let canvasW, canvasH;

  function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvasW;
      this.y = Math.random() * canvasH;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.15 + 0.05;
      this.life = Math.random() * 300 + 200;
      this.age = 0;
      // Gold color variations
      const colors = [
        '201,168,124',  // champagne
        '212,175,55',   // gold
        '183,110,121',  // rose gold
        '232,213,183',  // champagne light
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.age++;
      if (this.age > this.life || this.x < -10 || this.x > canvasW + 10 || this.y < -10 || this.y > canvasH + 10) {
        this.reset();
      }
    }
    draw() {
      const fadeRatio = 1 - (this.age / this.life);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity * fadeRatio})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = window.innerWidth < 768 ? 25 : 50;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // ═══════════ CURSOR GLOW ═══════════
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;

  if (window.innerWidth > 767) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      gsap.to(cursorGlow, {
        x: mouseX,
        y: mouseY,
        duration: 0.8,
        ease: 'power2.out'
      });
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  } else {
    cursorGlow.style.display = 'none';
  }


  // ═══════════ HERO SLIDESHOW ═══════════
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;

  function initHeroSlideshow() {
    if (slides.length === 0) return;

    // Slow zoom on active slide
    slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      if (i === 0) {
        gsap.fromTo(img, { scale: 1 }, {
          scale: 1.15,
          duration: 8,
          ease: 'none'
        });
      }
    });

    setInterval(() => {
      const prevSlide = currentSlide;
      currentSlide = (currentSlide + 1) % slides.length;

      // Fade transition
      slides[prevSlide].classList.remove('active');
      slides[currentSlide].classList.add('active');

      // Zoom effect on new slide
      const img = slides[currentSlide].querySelector('img');
      gsap.fromTo(img, { scale: 1 }, {
        scale: 1.15,
        duration: 8,
        ease: 'none'
      });
    }, 6000);
  }
  initHeroSlideshow();


  // ═══════════ HERO CONTENT ANIMATIONS ═══════════
  function initHeroAnimations() {
    const heroTL = gsap.timeline({ delay: 0.3 });

    heroTL.to('#heroPreTitle', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    })
    .to('.hero__name', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2
    }, '-=0.4')
    .to('.hero__ampersand', {
      opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)'
    }, '-=0.6')
    .to('#heroHeading', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.3')
    .to('#heroCard', {
      opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out'
    }, '-=0.4')
    .to('#heroCtas', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.3');

    // Set initial states
    gsap.set('#heroPreTitle', { opacity: 0, y: 20 });
    gsap.set('.hero__name', { opacity: 0, y: 30 });
    gsap.set('.hero__ampersand', { opacity: 0, y: 20, scale: 0.5 });
    gsap.set('#heroHeading', { opacity: 0, y: 20 });
    gsap.set('#heroCard', { opacity: 0, y: 30, scale: 0.95 });
    gsap.set('#heroCtas', { opacity: 0, y: 20 });
  }


  // ═══════════ SCROLL-TRIGGERED ANIMATIONS ═══════════
  function initScrollAnimations() {

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      const children = header.children;
      gsap.from(children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });
    });

    // Reveal animations
    gsap.utils.toArray('[data-reveal="up"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('[data-reveal="left"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('[data-reveal="right"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('[data-reveal="scale"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Timeline milestones
    gsap.utils.toArray('.timeline__milestone').forEach((milestone, i) => {
      const image = milestone.querySelector('.timeline__image');
      const text = milestone.querySelector('.timeline__text');
      const dot = milestone.querySelector('.timeline__dot');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: milestone,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (i % 2 === 0) {
        tl.from(image, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
          .from(text, { x: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
      } else {
        tl.from(text, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
          .from(image, { x: 60, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
      }

      if (dot) {
        tl.from(dot, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.5');
      }
    });

    // Timeline image parallax
    gsap.utils.toArray('.timeline__image img').forEach(img => {
      gsap.to(img, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.timeline__milestone'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // Gallery items stagger
    gsap.utils.toArray('.gallery__item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: (i % 4) * 0.1,
        ease: 'power3.out'
      });
    });

    // Event cards stagger
    gsap.utils.toArray('.event-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });

    // Countdown blocks stagger
    gsap.utils.toArray('.countdown__block').forEach((block, i) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out'
      });
    });

    // Parallax quote backgrounds
    gsap.utils.toArray('.parallax-quote__bg img').forEach(img => {
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.parallax-quote'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    // Footer reveal
    const footerEl = document.querySelector('.footer');
    if (footerEl) {
      gsap.from('.footer__monogram', {
        scrollTrigger: { trigger: footerEl, start: 'top 90%' },
        scale: 0.7, opacity: 0, duration: 1, ease: 'power3.out'
      });
    }
  }


  // ═══════════ SCROLL PROGRESS BAR ═══════════
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${progress})`;
  });


  // ═══════════ NAVIGATION ═══════════
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('[data-nav]');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Active section highlighting
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
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
  });

  // Smooth scroll on nav click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        lenis.scrollTo(targetEl, { offset: -80, duration: 1.5 });
      }
      // Close mobile menu
      navLinksContainer.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target)) {
      navLinksContainer.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });


  // ═══════════ COUNTDOWN TIMER ═══════════
  const weddingDate = new Date('September 12, 2026 18:30:00').getTime();

  function updateCountdown() {
    const now = Date.now();
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

    smoothUpdate('countDays', days, 3);
    smoothUpdate('countHours', hours, 2);
    smoothUpdate('countMinutes', minutes, 2);
    smoothUpdate('countSeconds', seconds, 2);
  }

  function smoothUpdate(id, value, pad) {
    const el = document.getElementById(id);
    const str = String(value).padStart(pad, '0');
    if (el.textContent !== str) {
      gsap.to(el, {
        y: -4,
        opacity: 0.5,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          el.textContent = str;
          gsap.fromTo(el,
            { y: 4, opacity: 0.5 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
          );
        }
      });
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ═══════════ MAGNETIC BUTTONS ═══════════
  const magneticBtns = document.querySelectorAll('[data-magnetic]');

  if (window.innerWidth > 767) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }


  // ═══════════ IMAGE TILT EFFECT ═══════════
  const tiltItems = document.querySelectorAll('.gallery__item, .event-card');

  if (window.innerWidth > 767) {
    tiltItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        gsap.to(item, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });
  }


  // ═══════════ LIGHTBOX ═══════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lenis.start();
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ═══════════ RSVP FORM ═══════════
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = document.getElementById('rsvpSubmitBtn');
      btn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite;"></i> <span>Sending...</span>';
      btn.disabled = true;

      setTimeout(() => {
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';

        gsap.from(rsvpSuccess, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out'
        });

        // Confetti burst
        createConfetti();
      }, 1500);
    });
  }


  // ═══════════ CONFETTI ═══════════
  function createConfetti() {
    const colors = ['#C9A87C', '#D4AF37', '#B76E79', '#E8C4B8', '#F0E4B0', '#A07D50'];

    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.3};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 99999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4500);
    }
  }


  // ═══════════ BACK TO TOP ═══════════
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 2 });
  });


  // ═══════════ LAZY IMAGE FADE-IN ═══════════
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
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


  // ═══════════ HERO CTA SMOOTH SCROLL ═══════════
  document.querySelectorAll('.hero__ctas a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target, { offset: -80, duration: 1.5 });
        }
      }
    });
  });

})();
