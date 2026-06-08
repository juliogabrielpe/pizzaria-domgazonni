/* =========================================
   DOM GAZZONI PIZZARIA — script.js
   Premium Restaurant Interactive Logic
   ========================================= */

'use strict';

/* ─────────────── Header Scroll ─────────────── */
const header = document.getElementById('header');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Header glass effect
  header.classList.toggle('scrolled', scrollY > 60);

  // Back to top button
  backTop.classList.toggle('visible', scrollY > 500);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────── Mobile Menu ─────────────── */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─────────────── Scroll Reveal ─────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ─────────────── Smooth Nav Active Link ─────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle(
          'active-nav',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─────────────── Cardápio: Filtro por Categoria ─────────────── */
const filterTabs  = document.querySelectorAll('.filter-tab');
const pizzaCards  = document.querySelectorAll('.pizza-card');
const searchInput = document.getElementById('searchPizza');

function filterCards() {
  const activeCat = document.querySelector('.filter-tab.active')?.dataset.cat || 'todos';
  const searchVal = searchInput.value.toLowerCase().trim();

  pizzaCards.forEach(card => {
    const cat   = card.dataset.cat;
    const name  = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const desc  = card.querySelector('p')?.textContent.toLowerCase()  || '';

    const catMatch    = activeCat === 'todos' || cat === activeCat;
    const searchMatch = !searchVal || name.includes(searchVal) || desc.includes(searchVal);

    if (catMatch && searchMatch) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = '';
        card.style.animationName = 'fadeCardIn';
        card.style.animationDuration = '.4s';
        card.style.animationFillMode = 'both';
      });
    } else {
      card.classList.add('hidden');
    }
  });
}

// Inject keyframe for card fade
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeCardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nav-link.active-nav { color: var(--gold) !important; }
`;
document.head.appendChild(style);

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterCards();
  });
});

searchInput.addEventListener('input', filterCards);

/* ─────────────── Lightbox ─────────────── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(el) {
  const img = el.querySelector('img');
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Prevent close when clicking on image itself
lightboxImg.addEventListener('click', e => e.stopPropagation());

/* ─────────────── Rating Bar Animation ─────────────── */
const ratingSection = document.querySelector('.rating-summary');
if (ratingSection) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.bar-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = fill.style.width; // trigger reflow
          }, i * 120);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  barObserver.observe(ratingSection);
}

/* ─────────────── Number Counter Animation ─────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-number');
      nums.forEach(num => {
        const text = num.textContent;
        const match = text.match(/\d+/);
        if (match) {
          const suffix = text.replace(match[0], '');
          animateCounter(num, parseInt(match[0], 10), suffix);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.sobre-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ─────────────── Smooth Scroll for anchor links ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─────────────── WhatsApp Float Tooltip auto-show ─────────────── */
const wppFloat = document.querySelector('.whatsapp-float');
const wppTooltip = document.querySelector('.wpp-tooltip');

setTimeout(() => {
  if (wppTooltip) {
    wppTooltip.style.opacity = '1';
    setTimeout(() => { wppTooltip.style.opacity = ''; }, 3000);
  }
}, 4000);

/* ─────────────── Lazy Image Observer ─────────────── */
const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ─────────────── Parallax subtle on Hero ─────────────── */
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.matchMedia('(min-width: 900px)').matches) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroImg.style.transform = `scale(1.05) translateY(${offset * 0.15}px)`;
  }, { passive: true });
}

/* ─────────────── Console Brand ─────────────── */
console.log(
  '%c🍕 Dom Gazzoni Pizzaria %c\nTradição, sabor e qualidade em cada fatia.',
  'background:#C62828;color:#fff;font-size:18px;font-weight:bold;padding:8px 16px;border-radius:6px 6px 0 0;',
  'background:#111;color:#D4AF37;font-size:13px;padding:4px 16px 8px;border-radius:0 0 6px 6px;'
);
