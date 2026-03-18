/* main.js — loaded on every page */

/* ── Lenis smooth scroll ── */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
}

/* ── Page transition ── */
const cover = document.getElementById('page-cover');

function pageIn() {
  gsap.fromTo(cover,
    { scaleY: 1, transformOrigin: 'top' },
    { scaleY: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.05 }
  );
}

function pageOut(href) {
  lenis && lenis.stop();
  gsap.fromTo(cover,
    { scaleY: 0, transformOrigin: 'bottom' },
    {
      scaleY: 1, duration: 0.55, ease: 'power3.inOut',
      onComplete: () => { window.location.href = href; }
    }
  );
}

/* ── Nav link intercept ── */
function initNav() {
  document.querySelectorAll('a[data-trans]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
        e.preventDefault();
        pageOut(href);
      }
    });
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
}

/* ── Hero stagger (index only) ── */
function initHeroStagger() {
  const items = document.querySelectorAll('.hero-stagger');
  if (!items.length) return;
  gsap.fromTo(items,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.3
    }
  );
}

/* ── Mouse-track tilt on gallery cards ── */
function initTilt() {
  document.querySelectorAll('.gallery-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power1.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
}

/* ── Vinyl spin control ── */
function initVinylTilt() {
  const vinyl = document.getElementById('vinyl-disc');
  if (!vinyl) return;
  vinyl.addEventListener('mousemove', e => {
    const r = vinyl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(vinyl, { rotateY: x * 12, rotateX: -y * 12, transformPerspective: 600, duration: 0.3 });
  });
  vinyl.addEventListener('mouseleave', () => {
    gsap.to(vinyl, { rotateY: 0, rotateX: 0, duration: 0.5 });
  });
}

/* ── Writing modal open/close ── */
function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.style.display = 'flex';
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  gsap.fromTo(overlay.querySelector('.modal-box'),
    { opacity: 0, y: 30, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
  );
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  lenis && lenis.stop();
}

function closeModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  gsap.to(overlay.querySelector('.modal-box'),
    { opacity: 0, y: 20, scale: 0.97, duration: 0.3, ease: 'power2.in' }
  );
  gsap.to(overlay, {
    opacity: 0, duration: 0.35,
    onComplete: () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      lenis && lenis.start();
    }
  });
}

window.openModal  = openModal;
window.closeModal = closeModal;

/* ── Cover card border draw ── */
function initCoverCards() {
  document.querySelectorAll('.cover-card[data-song]').forEach(card => {
    card.addEventListener('click', e => {
      const idx = parseInt(card.dataset.song);
      if (window.player) {
        window.player.loadSong(idx);
        window.player.play();
      }
    });
  });
}

/* ── Escape key closes modals ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay[style*="flex"]').forEach(m => {
      const id = m.id.replace('modal-', '');
      closeModal(id);
    });
  }
});

/* ── Close modal on overlay click ── */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    const id = e.target.id.replace('modal-', '');
    closeModal(id);
  }
});

/* ── Init everything on load ── */
window.addEventListener('DOMContentLoaded', () => {
  initLenis();
  pageIn();
  initNav();
  initReveal();
  initHeroStagger();
  initTilt();
  initVinylTilt();
  initCoverCards();
});
