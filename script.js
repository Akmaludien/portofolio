/* ============================================================
   Portfolio — Pure Vanilla JavaScript
   Premium single-page portfolio interactions
   ============================================================ */

(() => {
  'use strict';

  /* ----------------------------------------------------------
     0. Theme Toggle
     ---------------------------------------------------------- */
  const initThemeToggle = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (!toggleBtn) return;

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (currentTheme === 'light' || (!currentTheme && prefersLight)) {
      document.documentElement.setAttribute('data-theme', 'light');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }

    toggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    });
  };

  /* ----------------------------------------------------------
     1. Particle Background
     ---------------------------------------------------------- */
  const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const count = 40;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1 + 1,               // 1–2 px
          vx: (Math.random() - 0.5) * 0.4,         // slow drift
          vy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.3 + 0.1        // 0.1–0.4
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineOpacity = (1 - dist / 120) * 0.08;
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const r = isLight ? 0 : 34, g = isLight ? 136 : 193, b = isLight ? 204 : 255;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Particles
      const isLightP = document.documentElement.getAttribute('data-theme') === 'light';
      const pr = isLightP ? 0 : 34, pg = isLightP ? 136 : 193, pb = isLightP ? 204 : 255;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${p.opacity})`;
        ctx.fill();
      }
    };

    const updateParticles = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      }
    };

    const loop = () => {
      updateParticles();
      drawParticles();
      animId = requestAnimationFrame(loop);
    };

    resize();
    createParticles();
    loop();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  };

  /* ----------------------------------------------------------
     2. Typing Animation
     ---------------------------------------------------------- */
  const initTyping = () => {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const roles = [
      'Instrumentation Engineering Student',
      'Machine Learning Enthusiast',
      'Weather & Climate Data Analyst'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const TYPE_SPEED = 50;
    const DELETE_SPEED = 30;
    const PAUSE_AFTER_TYPE = 2000;

    const tick = () => {
      const current = roles[roleIdx];

      if (!isDeleting) {
        // Typing forward
        charIdx++;
        el.textContent = current.substring(0, charIdx);

        if (charIdx === current.length) {
          // Finished typing — pause, then delete
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting backward
        charIdx--;
        el.textContent = current.substring(0, charIdx);

        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 400); // brief pause before next role
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };

    tick();
  };

  /* ----------------------------------------------------------
     3. Scroll Progress Indicator
     ---------------------------------------------------------- */
  const initScrollProgress = () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  };

  /* ----------------------------------------------------------
     4. Scroll Reveal Animations
     ---------------------------------------------------------- */
  const initScrollReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay;
          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
  };

  /* ----------------------------------------------------------
     5. Animated Counters
     ---------------------------------------------------------- */
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  };

  /* ----------------------------------------------------------
     6. Navigation Features
     ---------------------------------------------------------- */
  const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const NAV_HEIGHT = 70;

    /* Sticky background on scroll */
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }

    /* Active section highlight */
    if (sections.length && navLinks.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      }, {
        rootMargin: `-${NAV_HEIGHT}px 0px -40% 0px`,
        threshold: 0
      });

      sections.forEach(sec => sectionObserver.observe(sec));
    }

    /* Mobile menu toggle */
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });

      // Close on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        });
      });
    }

    /* Smooth scroll for all anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };

  /* ----------------------------------------------------------
     7. Scroll-to-Top Button
     ---------------------------------------------------------- */
  const initScrollTop = () => {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ----------------------------------------------------------
     8. Contact Form (placeholder)
     ---------------------------------------------------------- */
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#contact-name')?.value || '';
      const email = form.querySelector('#contact-email')?.value || '';
      const subject = form.querySelector('#contact-subject')?.value || 'Portfolio Contact';
      const message = form.querySelector('#contact-message')?.value || '';

      const mailto = `mailto:ramadhanakmaludien@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.open(mailto, '_blank');

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ Opening email client...';
      btn.style.background = '#10b981';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        form.reset();
      }, 2500);
    });
  };

  /* ----------------------------------------------------------
     9. Navbar Hide / Show on Scroll
     ---------------------------------------------------------- */
  const initNavbarAutoHide = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (currentY < 100) {
        // Always visible near top
        navbar.classList.remove('nav-hidden');
      } else if (delta > 5) {
        // Scrolling down
        navbar.classList.add('nav-hidden');
      } else if (delta < -5) {
        // Scrolling up
        navbar.classList.remove('nav-hidden');
      }

      lastScrollY = currentY;
    }, { passive: true });
  };

  /* ----------------------------------------------------------
     10. Bootstrap Everything on DOMContentLoaded
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Loading screen
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 1500);
    }

    // Initialize all modules
    initThemeToggle();
    initParticles();
    initTyping();
    initScrollProgress();
    initScrollReveal();
    initCounters();
    initNavigation();
    initScrollTop();
    initContactForm();
    initNavbarAutoHide();
  });
})();
