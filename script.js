/* ======================================================
   Deepak & Rohini — Ultra-Premium Wedding Experience
   GSAP + Lenis + Canvas Particles + Micro-Interactions v2.0
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


  // ═══════════ PRELOADER (CINEMATIC V2) ═══════════
  const preloader = document.getElementById('preloader');
  const preloaderMonogram = document.getElementById('preloaderMonogram');
  const preloaderNames = document.getElementById('preloaderNames');
  const preloaderTagline = document.getElementById('preloaderTagline');
  const preloaderLine = document.getElementById('preloaderLine');
  const preloaderParticles = document.getElementById('preloaderParticles');

  // Create floating preloader dots
  if (preloaderParticles) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'preloader__dot';
      dot.style.width = Math.random() * 4 + 2 + 'px';
      dot.style.height = dot.style.width;
      dot.style.background = `rgba(${Math.random() > 0.5 ? '201,168,124' : '255,255,255'}, ${Math.random() * 0.5 + 0.1})`;
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDelay = Math.random() * 4 + 's';
      preloaderParticles.appendChild(dot);
    }
  }

  const preloaderTL = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        opacity: 0,
        duration: 1.2,
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

  // Fade in preloader background elements
  gsap.to(preloaderParticles, { opacity: 1, duration: 1 });

  // Phase 1: Line draws from center
  preloaderTL.to(preloaderLine, {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    ease: 'power3.inOut'
  });

  // Phase 2: Monogram elegant fade up
  preloaderTL.to(preloaderMonogram, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.4');

  // Phase 3: Names dramatic tracking expansion
  preloaderTL.to(preloaderNames, {
    opacity: 1,
    y: 0,
    letterSpacing: window.innerWidth < 768 ? '6px' : '12px',
    duration: 1.5,
    ease: 'power3.out'
  }, '-=0.6');

  // Phase 4: Tagline appears softly
  preloaderTL.to(preloaderTagline, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.8');

  // Phase 5: Hold, then cinematic push back and fade
  preloaderTL.to('.preloader__content', {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut',
    delay: 1.2
  });

  // Set initial states
  gsap.set(preloaderMonogram, { y: 30, opacity: 0, filter: 'blur(10px)' });
  gsap.set(preloaderNames, { y: 20, opacity: 0, letterSpacing: '4px' });
  gsap.set(preloaderTagline, { y: 20, opacity: 0 });
  gsap.set(preloaderLine, { scaleX: 0, opacity: 0 });
  gsap.set(preloaderParticles, { opacity: 0 });

  // Failsafe
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
  }, 7000);


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
      const colors = [
        '201,168,124',  // champagne
        '212,175,55',   // gold
        '183,110,121',  // rose gold
        '254,252,249',  // pearl
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Floating wave effect
      this.y += Math.sin(this.age * 0.02) * 0.2;
      this.x += Math.cos(this.age * 0.01) * 0.1;
      
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
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = `rgba(${this.color}, ${this.opacity * fadeRatio})`;
      ctx.fill();
    }
  }

  // Create particles (optimized count)
  const particleCount = window.innerWidth < 768 ? 20 : 40;
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


  // ═══════════ CURSOR GLOW (SCREEN BLEND) ═══════════
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  if (window.innerWidth > 767) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follow using linear interpolation
    function updateCursor() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      
      if (cursorGlow) {
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
      }
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }


  // ═══════════ HERO SLIDESHOW ═══════════
  const slides = document.querySelectorAll('.hero__slide');
  let currentSlide = 0;

  function initHeroSlideshow() {
    if (slides.length === 0) return;

    // Cinematic zoom on active slide
    slides.forEach((slide, i) => {
      const img = slide.querySelector('img');
      if (i === 0) {
        gsap.fromTo(img, { scale: 1 }, {
          scale: 1.15,
          duration: 8,
          ease: 'power1.out' // Non-linear zoom for cinematic feel
        });
      }
    });

    setInterval(() => {
      const prevSlide = currentSlide;
      currentSlide = (currentSlide + 1) % slides.length;

      // Crossfade
      gsap.to(slides[prevSlide], { opacity: 0, duration: 2, ease: 'power2.inOut' });
      gsap.to(slides[currentSlide], { opacity: 1, duration: 2, ease: 'power2.inOut' });

      // Zoom effect on new slide
      const img = slides[currentSlide].querySelector('img');
      gsap.fromTo(img, { scale: 1 }, {
        scale: 1.15,
        duration: 8,
        ease: 'power1.out'
      });
    }, 6000);
  }
  initHeroSlideshow();


  // ═══════════ HERO CONTENT ANIMATIONS ═══════════
  function initHeroAnimations() {
    const heroTL = gsap.timeline({ delay: 0.1 });

    // Text splitting for names
    const names = document.querySelectorAll('.hero__name');
    names.forEach(name => {
      const text = name.getAttribute('data-text');
      name.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px) rotate(10deg)';
        name.appendChild(span);
      }
      name.style.opacity = 1;
    });

    heroTL.to('#heroPreTitle', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out'
    })
    // Animate each letter
    .to('.hero__name span', {
      opacity: 1, y: 0, rotation: 0, 
      duration: 1, ease: 'power3.out', 
      stagger: 0.04
    }, '-=0.6')
    .to('.hero__ampersand', {
      opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)'
    }, '-=0.8')
    .to('#heroHeading', {
      opacity: 1, y: 0, letterSpacing: window.innerWidth < 768 ? '4px' : '10px', 
      duration: 1.2, ease: 'power3.out'
    }, '-=0.6')
    .to('#heroCard', {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out'
    }, '-=0.8')
    .to('#heroMiniCountdown', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out'
    }, '-=0.8')
    .to('#heroCtas', {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out'
    }, '-=0.6')
    .to('.hero__scroll', {
      opacity: 1, duration: 1
    }, '-=0.5');

    // Set initial states
    gsap.set('#heroPreTitle', { opacity: 0, y: 20 });
    gsap.set('.hero__ampersand', { opacity: 0, y: 20, scale: 0.8 });
    gsap.set('#heroHeading', { opacity: 0, y: 20, letterSpacing: window.innerWidth < 768 ? '2px' : '6px' });
    gsap.set('#heroCard', { opacity: 0, y: 40, filter: 'blur(10px)' });
    gsap.set('#heroMiniCountdown', { opacity: 0, y: 20 });
    gsap.set('#heroCtas', { opacity: 0, y: 20 });
    gsap.set('.hero__scroll', { opacity: 0 });
    
    // Parallax hero content on scroll
    gsap.to('.hero__content', {
      y: 150,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }


  // ═══════════ SCROLL-TRIGGERED ANIMATIONS ═══════════
  function initScrollAnimations() {

    // Floating RSVP Button visibility
    ScrollTrigger.create({
      start: 'top -500',
      end: 99999,
      toggleClass: {className: 'visible', targets: '.floating-rsvp'}
    });

    // Section headers reveal
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
        filter: 'blur(5px)',
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });
    });

    // Timeline progress line
    const tlProgress = document.getElementById('timelineProgress');
    if (tlProgress) {
      gsap.to(tlProgress, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline__container',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
    }

    // Standard reveal animations
    gsap.utils.toArray('[data-reveal="up"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 60,
        opacity: 0,
        duration: 1,
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
        x: -60,
        opacity: 0,
        duration: 1.2,
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
        x: 60,
        opacity: 0,
        duration: 1.2,
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
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
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
        tl.from(image, { x: -40, opacity: 0, duration: 1, ease: 'power3.out' })
          .from(text, { x: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
      } else {
        tl.from(text, { x: -40, opacity: 0, duration: 1, ease: 'power3.out' })
          .from(image, { x: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
      }

      if (dot) {
        tl.from(dot, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.6');
      }
    });

    // Timeline image parallax
    gsap.utils.toArray('.timeline__image img').forEach(img => {
      gsap.to(img, {
        yPercent: -15,
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
        duration: 0.8,
        delay: (i % 4) * 0.1,
        ease: 'power3.out'
      });
    });

    // Event cards stagger
    gsap.utils.toArray('.events .event-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out'
      });
    });
    
    // Dress code & Guest info cards stagger
    gsap.utils.toArray('.dresscode__card, .guestinfo__card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: (i % 3) * 0.1,
        ease: 'power3.out'
      });
    });

    // Countdown blocks stagger & ring animation
    gsap.utils.toArray('.countdown__block').forEach((block, i) => {
      const ring = block.querySelector('.countdown__ring-fill');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
      
      tl.from(block, {
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.1
      });
      
      if (ring) {
        tl.from(ring, {
          strokeDashoffset: 339.292,
          duration: 1.5,
          ease: 'power2.inOut'
        }, '-=0.4');
      }
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
        scrollTrigger: { trigger: footerEl, start: 'top 95%' },
        scale: 0.7, opacity: 0, duration: 1, ease: 'power3.out'
      });
    }
  }


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
  const circumference = 339.292; // 2 * pi * 54

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '🎉';
      document.getElementById('countHours').textContent = '🎉';
      document.getElementById('countMinutes').textContent = '🎉';
      document.getElementById('countSeconds').textContent = '🎉';
      
      // Update mini countdown
      if(document.getElementById('heroCountDays')) {
        document.getElementById('heroCountDays').textContent = '00';
        document.getElementById('heroCountHours').textContent = '00';
        document.getElementById('heroCountMins').textContent = '00';
        document.getElementById('heroCountSecs').textContent = '00';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update main blocks
    smoothUpdate('countDays', days, 3);
    smoothUpdate('countHours', hours, 2);
    smoothUpdate('countMinutes', minutes, 2);
    smoothUpdate('countSeconds', seconds, 2);
    
    // Update mini countdown in hero
    if(document.getElementById('heroCountDays')) {
      document.getElementById('heroCountDays').textContent = String(days).padStart(2, '0');
      document.getElementById('heroCountHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('heroCountMins').textContent = String(minutes).padStart(2, '0');
      document.getElementById('heroCountSecs').textContent = String(seconds).padStart(2, '0');
    }

    // Update SVG rings
    updateRing('ringDays', days, 365);
    updateRing('ringHours', hours, 24);
    updateRing('ringMinutes', minutes, 60);
    updateRing('ringSeconds', seconds, 60);
  }

  function smoothUpdate(id, value, pad) {
    const el = document.getElementById(id);
    if (!el) return;
    
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

  function updateRing(id, value, max) {
    const ring = document.getElementById(id);
    if (!ring) return;
    
    const percent = value / max;
    const offset = circumference - (percent * circumference);
    
    // Don't animate stroke dash if tab is hidden to save performance
    if (document.visibilityState === 'visible') {
      ring.style.strokeDashoffset = offset;
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
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        const icon = btn.querySelector('i');
        if (icon) {
          gsap.to(icon, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1.2, 0.4)'
        });
        
        const icon = btn.querySelector('i');
        if (icon) {
          gsap.to(icon, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1.2, 0.4)'
          });
        }
      });
    });
  }


  // ═══════════ IMAGE TILT EFFECT ═══════════
  const tiltItems = document.querySelectorAll('.gallery__item, .event-card, .dresscode__card, .guestinfo__card');

  if (window.innerWidth > 767) {
    tiltItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20; // Reduced intensity for luxury feel
        const rotateY = (centerX - x) / 20;

        gsap.to(item, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
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

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

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
      const originalText = btn.innerHTML;
      
      btn.innerHTML = '<i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite;"></i> <span>Sending...</span>';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        gsap.to(rsvpForm, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';

            gsap.fromTo(rsvpSuccess, 
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );

            // Confetti burst
            createConfetti();
          }
        });
      }, 1500);
    });
  }


  // ═══════════ CONFETTI ═══════════
  function createConfetti() {
    const colors = ['#C9A87C', '#D4AF37', '#B76E79', '#E8C4B8', '#F0E4B0', '#A07D50'];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      
      // Mix of circles and rectangles
      const isCircle = Math.random() > 0.5;
      const width = Math.random() * 8 + 4;
      const height = isCircle ? width : Math.random() * 10 + 5;
      
      confetti.style.cssText = `
        position: fixed;
        width: ${width}px;
        height: ${height}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -20px;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.3};
        border-radius: ${isCircle ? '50%' : '2px'};
        z-index: 99999;
        pointer-events: none;
        animation: confettiFall ${Math.random() * 2.5 + 2}s ease-in forwards;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5500);
    }
  }


  // ═══════════ BACK TO TOP ═══════════
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      if(backToTop) backToTop.classList.add('visible');
    } else {
      if(backToTop) backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 2 });
    });
  }


  // ═══════════ LAZY IMAGE FADE-IN ═══════════
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.8s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });


  // ═══════════ HERO CTA SMOOTH SCROLL ═══════════
  document.querySelectorAll('.hero__ctas a, .floating-rsvp').forEach(link => {
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
