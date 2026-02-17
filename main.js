/* =========================================
   TIXAR TECHNOLOGIES — Main JavaScript
   GSAP Animations, Particles & Interactions
   ========================================= */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// PRELOADER
// ==========================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      animateHero();
    }, 2000);
  });
  document.body.classList.add('no-scroll');
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  // Check if it's a touch device
  if ('ontouchstart' in window) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
  });

  // Smooth follower
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover effects
  const hoverables = document.querySelectorAll('a, button, .btn, .service-card, .about-card, .tech-item');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });
}

// ==========================================
// PARTICLE CANVAS
// ==========================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((width * height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ==========================================
// HERO ANIMATIONS
// ==========================================
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
  })
  .to('.title-word', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.15,
  }, '-=0.4')
  .to('.hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.5')
  .to('.hero-cta-group', {
    opacity: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.5')
  .to('.hero-stats', {
    opacity: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.5')
  .to('.scroll-indicator', {
    opacity: 1,
    duration: 0.8,
  }, '-=0.3');

  // Animate stat numbers
  document.querySelectorAll('.stat-number').forEach((num) => {
    const target = parseInt(num.getAttribute('data-target'));
    gsap.to(num, {
      textContent: target,
      duration: 2,
      delay: 1.5,
      snap: { textContent: 1 },
      ease: 'power2.out',
    });
  });
}

// ==========================================
// SCROLL TRIGGERED ANIMATIONS
// ==========================================
function initScrollAnimations() {
  // Reveal-up elements
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    const delay = parseFloat(el.style.getPropertyValue('--delay') || '0');
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: delay,
      ease: 'power3.out',
    });
  });

  // Section tags and titles
  gsap.utils.toArray('.section-header').forEach((header) => {
    const tag = header.querySelector('.section-tag');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (tag) tl.from(tag, { opacity: 0, y: 20, duration: 0.6 });
    if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
    if (subtitle) tl.from(subtitle, { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
  });

  // Service cards stagger
  ScrollTrigger.batch('.service-card', {
    start: 'top 85%',
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      });
    },
  });

  // Tech items stagger
  ScrollTrigger.batch('.tech-item', {
    start: 'top 85%',
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        x: -20,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
      });
    },
  });

  // Contact info items
  ScrollTrigger.batch('.contact-info-item', {
    start: 'top 85%',
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      });
    },
  });

  // Quote block special animation
  const quoteBlock = document.querySelector('.quote-block');
  if (quoteBlock) {
    gsap.to(quoteBlock, {
      scrollTrigger: {
        trigger: quoteBlock,
        start: 'top 80%',
        toggleActions: 'play none none none',
        onEnter: () => initTypewriter(),
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }

  // Parallax orbs on scroll
  gsap.to('.orb-1', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: -150,
    opacity: 0.1,
  });

  gsap.to('.orb-2', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: -100,
    opacity: 0.1,
  });

  // Fade scroll indicator on scroll
  gsap.to('.scroll-indicator', {
    scrollTrigger: {
      trigger: '.hero',
      start: '10% top',
      end: '30% top',
      scrub: true,
    },
    opacity: 0,
    y: 20,
  });
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el || el.dataset.typed) return;
  el.dataset.typed = 'true';

  const text = el.textContent;
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40);
    }
  }
  type();
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.classList.toggle('no-scroll');
  });

  // Close mobile menu on link click
  links.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.classList.remove('no-scroll');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
function initMagneticButtons() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ==========================================
// 3D TILT EFFECT ON CARDS
// ==========================================
function initTiltCards() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: -y * 8,
        rotateY: x * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

// ==========================================
// FORM HANDLING
// ==========================================
function initForms() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent! ✓</span>';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      input.value = '';
      input.placeholder = 'Subscribed! ✓';
      setTimeout(() => {
        input.placeholder = 'Enter your email';
      }, 3000);
    });
  }
}

// ==========================================
// INIT
// ==========================================
function init() {
  initPreloader();
  initCursor();
  initParticles();
  initNavigation();
  initScrollAnimations();
  initMagneticButtons();
  initTiltCards();
  initForms();
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
