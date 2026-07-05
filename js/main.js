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

const cover = document.getElementById('page-cover');

function pageIn() {
  if (!cover) return;
  gsap.fromTo(cover,
    { scaleY: 1, transformOrigin: 'top' },
    { scaleY: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.05 }
  );
}

function pageOut(href) {
  if (!cover) {
    window.location.href = href;
    return;
  }
  lenis && lenis.stop();
  gsap.fromTo(cover,
    { scaleY: 0, transformOrigin: 'bottom' },
    {
      scaleY: 1, duration: 0.55, ease: 'power3.inOut',
      onComplete: () => { window.location.href = href; }
    }
  );
}

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

function initReveal() {
  gsap.utils.toArray('.reveal').forEach((el) => {
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

function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.body.classList.add('reader-open');
  
  if (lenis) lenis.stop();
  
  gsap.fromTo(overlay, 
    { opacity: 0 },
    { opacity: 1, duration: 0.35, ease: 'power2.out' }
  );
  
  gsap.fromTo(overlay.querySelector('.modal-box'),
    { opacity: 0, y: 20, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', delay: 0.05 }
  );
}

function closeModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  
  gsap.to(overlay.querySelector('.modal-box'),
    { opacity: 0, y: 15, scale: 0.98, duration: 0.25, ease: 'power2.in' }
  );
  
  gsap.to(overlay, {
    opacity: 0, duration: 0.3, ease: 'power2.in',
    delay: 0.1,
    onComplete: () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      document.body.classList.remove('reader-open');
      if (lenis) lenis.start();
    }
  });
}

window.openModal  = openModal;
window.closeModal = closeModal;

function initCoverCards() {
  document.querySelectorAll('.cover-card[data-song]').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.song);
      if (window.player && typeof window.player.loadSong === 'function') {
        window.player.loadSong(idx);
        window.player.play();
      }
    });
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const visibleModal = document.querySelector('.modal-overlay[style*="flex"]');
    if (visibleModal) {
      const id = visibleModal.id.replace('modal-', '');
      closeModal(id);
    }
  }
});

function getModalSequence() {
  const buttons = Array.from(document.querySelectorAll('.wr-read-btn'));
  return buttons.map(b => {
    const oc = b.getAttribute('onclick');
    const match = oc ? oc.match(/openModal\(['"]([^'"]+)['"]\)/) : null;
    return match ? match[1] : null;
  }).filter(Boolean);
}

function navigateModal(dir, currentId) {
  const seq = getModalSequence();
  const i = seq.indexOf(currentId);
  if (i === -1) return;
  
  const nextIndex = dir === 'next' 
    ? (i + 1) % seq.length 
    : (i - 1 + seq.length) % seq.length;
  
  const nextId = seq[nextIndex];
  if (!nextId || nextId === currentId) return;
  
  closeModal(currentId);
  setTimeout(() => openModal(nextId), 350);
}

window.navigateModal = navigateModal;

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    const id = e.target.id.replace('modal-', '');
    closeModal(id);
  }
});

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