// D3Apps — Script específico de index.html (hero, partículas, sectores, about).
// Se carga al final del <body> solo en index.html.
document.addEventListener('DOMContentLoaded', () => {
  initSectorReveal();
  initCanvasBackground();
  initHeroTextReveal();
  initHeroQuestions();
  initAboutCards();
});

/* =========================================================================
   1. Reveal the sectors section on demand
   ========================================================================= */
function initSectorReveal() {
  const sectorSection = document.getElementById('sectores');
  if (!sectorSection) return;

  const revealSectors = (e) => {
    e.preventDefault();
    if (sectorSection.hidden) {
      sectorSection.hidden = false;
      // Trigger reveal animations inside after it becomes visible
      requestAnimationFrame(() => {
        sectorSection.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
      });
    }
    sectorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('.sector-trigger, a[href="#sectores"]').forEach((el) => {
    el.addEventListener('click', revealSectors);
  });
}

/* =========================================================================
   2. Animated particle & grid canvas background (hero)
   ========================================================================= */
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;
  const hero = document.getElementById('hero');
  initParticleCanvas(canvas, hero, {
    themeAware: true,
    colorDark: { r: 96, g: 165, b: 250 },
    colorLight: { r: 37, g: 99, b: 235 }
  });
}

/* =========================================================================
   3. Hero text reveal — word-by-word title + scale-in for hero elements
   ========================================================================= */
function initHeroTextReveal() {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;

  // Wrap each word in .hero-word span
  const html = h1.innerHTML;
  const wrapped = html.replace(/(<[^>]+>)?([^<]*)/g, (match, tag, text) => {
    if (!text.trim()) return match;
    if (tag && tag.includes('accent')) return match;
    const words = text.split(/(\s+)/);
    return words.map(w => {
      if (!w.trim()) return w;
      return `<span class="hero-word">${w}</span>`;
    }).join('');
  });
  h1.innerHTML = wrapped;

  // Stagger animation per word
  const words = h1.querySelectorAll('.hero-word');
  words.forEach((word, i) => {
    word.style.animationDelay = `${i * 0.07}s`;
    word.classList.add('word-reveal');
  });

  // Scale-in for other hero elements
  const scaleTargets = [
    { el: document.querySelector('.hero-badge'), delay: 0 },
    { el: document.querySelector('.hero-sub'), delay: 0.15 },
    { el: document.querySelector('.hero-visual'), delay: 0.3 },
    { el: document.querySelector('.hero-visual .hero-actions'), delay: 0.45 },
    { el: document.querySelector('.hero-trust'), delay: 0.55 },
  ];
  scaleTargets.forEach(({ el, delay }) => {
    if (!el) return;
    el.classList.add('hero-scale');
    setTimeout(() => el.classList.add('scale-in'), delay * 1000);
  });

  // Impact phrase animation
  const impact = document.querySelector('.hero-impact');
  if (impact) {
    impact.classList.add('word-reveal');
  }
}

/* =========================================================================
   4. Hero questions → stagger reveal + scroll to "Nosotros"
   ========================================================================= */
function initHeroQuestions() {
  const questions = document.querySelectorAll('.hero-question');
  if (questions.length === 0) return;

  // Stagger reveal: each question appears 2s apart
  questions.forEach((q, i) => {
    setTimeout(() => q.classList.add('q-visible'), 1500 + i * 2000);
  });

  const goToAbout = () => {
    const target = document.getElementById('nosotros');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  questions.forEach((q) => {
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.addEventListener('click', goToAbout);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToAbout();
      }
    });
  });
}

/* =========================================================================
   5. About cards → switch video on card click
   ========================================================================= */
function initAboutCards() {
  const cards = document.querySelectorAll('.about-card[data-video]');
  const video = document.querySelector('.about-video-player');
  if (cards.length === 0 || !video) return;

  const sources = Array.from(cards).map((c) => c.getAttribute('data-video'));
  let currentIndex = 0;

  function playCard(index) {
    currentIndex = index;
    cards.forEach((c) => c.classList.remove('active'));
    cards[index].classList.add('active');
    const source = video.querySelector('source');
    if (source) {
      source.src = sources[index];
      video.load();
      video.play().catch(() => {});
    }
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => playCard(i));
  });

  // Auto-advance to next video when current ends
  video.addEventListener('ended', () => {
    const next = (currentIndex + 1) % sources.length;
    playCard(next);
  });
}
