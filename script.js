/* ══════════════════════════════════════════
   SHREE KARNI ESTATE — script.js
   Trust • Value • Legacy | Udaipur, Rajasthan
   ══════════════════════════════════════════ */

'use strict';

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 700);
  }, 2000);
});

/* ── PARTICLES ── */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const left     = Math.random() * 100;
    const duration = 4 + Math.random() * 8;
    const delay    = Math.random() * 6;
    const size     = 2 + Math.random() * 4;
    p.style.cssText = `
      left: ${left}%;
      bottom: ${Math.random() * 40}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // back to top
  const bt = document.getElementById('backTop');
  if (bt) bt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
// close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── PAGE NAVIGATION ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
  // trigger fade-ins for this page
  setTimeout(triggerFadeIns, 100);
  // trigger stats if home
  if (id === 'home') setTimeout(animateStats, 400);
}

// Nav link click handler
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href').replace('#', '');
    showPage(target);
  });
});

// Initialise first page
showPage('home');

/* ── SCROLL-TRIGGERED FADE INS ── */
function triggerFadeIns() {
  const elements = document.querySelectorAll('.page.active .fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
}
// Apply fade-in class to relevant elements
document.querySelectorAll(`
  .why-card, .testi-card, .prop-card,
  .invest-card, .masonry-item, .stat-item,
  .spotlight-card, .about-img-frame, .about-text-col
`).forEach(el => el.classList.add('fade-in'));

/* ── COUNTER ANIMATION ── */
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ── STATS INTERSECTION ── */
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateStats(); statsObserver.disconnect(); }
  });
}, { threshold: 0.3 });
const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

/* ── TESTIMONIAL CAROUSEL ── */
(function initTestiCarousel() {
  const track  = document.getElementById('testiTrack');
  const dotsEl = document.getElementById('testiDots');
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(n) {
    current = (n + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.testi-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  document.getElementById('testiPrev')?.addEventListener('click', () => {
    goTo(current - 1); resetAuto();
  });
  document.getElementById('testiNext')?.addEventListener('click', () => {
    goTo(current + 1); resetAuto();
  });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  resetAuto();
})();

/* ── PROPERTY FILTER ── */
function filterProperties() {
  const loc    = document.getElementById('filterLoc')?.value || '';
  const budget = document.getElementById('filterBudget')?.value || '';
  const type   = document.getElementById('filterType')?.value || '';

  const cards = document.querySelectorAll('#propsGrid .prop-card');
  let visibleCount = 0;
  cards.forEach(card => {
    const cardLoc    = card.dataset.loc || '';
    const cardBudget = card.dataset.budget || '';
    const cardType   = card.dataset.type || '';

    const matchLoc    = !loc    || cardLoc === loc;
    const matchBudget = !budget || cardBudget === budget;
    const matchType   = !type   || cardType === type;

    const show = matchLoc && matchBudget && matchType;
    card.classList.toggle('hidden', !show);
    if (show) visibleCount++;
  });

  // Show no-results message
  let noRes = document.getElementById('noResults');
  if (visibleCount === 0) {
    if (!noRes) {
      noRes = document.createElement('div');
      noRes.id = 'noResults';
      noRes.style.cssText = `
        grid-column: 1/-1; text-align: center;
        padding: 60px; color: var(--text-light);
        font-family: var(--font-royal); font-size: 1.2rem;
      `;
      noRes.innerHTML = `
        <div style="font-size:3rem;margin-bottom:16px">🏠</div>
        <p>No properties found matching your criteria.</p>
        <p style="font-size:0.85rem;margin-top:10px">Try adjusting your filters or <a href="https://wa.me/919588228299" style="color:var(--gold)">contact us</a> for more options.</p>
      `;
      document.getElementById('propsGrid').appendChild(noRes);
    }
    noRes.style.display = 'block';
  } else if (noRes) {
    noRes.style.display = 'none';
  }
}

/* ── GALLERY FILTER + LIGHTBOX ── */
(function initGallery() {
  // Category filter
  const filters = document.querySelectorAll('.gal-filter');
  const items   = document.querySelectorAll('.masonry-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('gal-hidden', !show);
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');
  if (!lightbox) return;

  let visibleItems = () => [...items].filter(i => !i.classList.contains('gal-hidden'));
  let currentLb = 0;

  function openLb(index) {
    const vis = visibleItems();
    currentLb = index;
    const img = vis[currentLb]?.querySelector('img');
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navLb(dir) {
    const vis = visibleItems();
    currentLb = (currentLb + dir + vis.length) % vis.length;
    const img = vis[currentLb]?.querySelector('img');
    if (img) { lbImg.src = img.src; lbImg.alt = img.alt; }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const vis = visibleItems();
      const vi  = vis.indexOf(item);
      if (vi !== -1) openLb(vi);
    });
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click',  () => navLb(-1));
  lbNext.addEventListener('click',  () => navLb(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });
})();

/* ── FORM SUBMIT ── */
function submitForm(e) {
  e.preventDefault();
  const form    = document.getElementById('visitForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;
  // Simulate submission
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Submitting…';
  btn.disabled = true;
  setTimeout(() => {
    form.classList.add('hidden');
    success.classList.remove('hidden');
  }, 1200);
}

/* ── BACK TO TOP ── */
document.getElementById('backTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── SMOOTH ANCHOR NAV from buttons ── */
// Buttons in hero that use onclick="showPage(...)" work via the global function above.
// But also handle any plain <a href="#section"> anchor clicks not covered above.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').replace('#','');
    const page = document.getElementById(id);
    if (page && page.classList.contains('page')) {
      e.preventDefault();
      showPage(id);
    }
  });
});

/* ── ADD FADE-IN TO MORE ELEMENTS ── */
document.querySelectorAll('.section-label, .section-title').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.05}s`;
});
