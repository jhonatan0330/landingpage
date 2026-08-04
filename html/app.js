// D3Apps — Landing Page Script
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initBrokenLinkRedirect();
  initRevealAnimations();
  initSectorReveal();
  initFooter();
  initThemeToggle();
  initCanvasBackground();
  initHeroQuestions();
  initDemoForms();
  initAuthModal();
});

/* =========================================================================
   1. Shared header component (single source, injected synchronously)
   ========================================================================= */
const HEADER_HTML = `
<header id="site-header">
  <div class="nav-container">
    <a href="index.html" class="brand">
      <img class="brand-icon" src="icons/dark_264x264.png" alt="D3Apps Logo">
      <span>D3Apps</span>
    </a>
    <nav>
      <ul class="nav-links">
        <li><a href="index.html#inicio">Inicio</a></li>
        <li><a href="quienes-somos.html">Nosotros</a></li>
        <li><a href="index.html#soluciones">Soluciones</a></li>
        <li><a href="index.html#precios">Precios</a></li>
        <li><a href="franquicias.html">Franquicias</a></li>
        <li><a href="index.html#sectores">Sectores</a></li>
        <li><a href="index.html#contacto">Contacto</a></li>
      </ul>
    </nav>
    <div class="nav-actions">
      <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
      </button>
      <button type="button" class="btn btn-primary btn-sm nav-btn" data-open-auth>Ingresar al portal</button>
      <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    <a href="index.html#inicio">Inicio</a>
    <a href="quienes-somos.html">Nosotros</a>
    <a href="index.html#soluciones">Soluciones</a>
    <a href="index.html#precios">Precios</a>
    <a href="franquicias.html">Franquicias</a>
    <a href="index.html#sectores">Sectores</a>
    <a href="index.html#contacto">Contacto</a>
    <button type="button" class="btn btn-primary" data-open-auth>Ingresar al portal</button>
  </div>
</header>
`;

function initHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;

  host.innerHTML = HEADER_HTML;

  // En el index, los enlaces de sección deben funcionar sin recargar la página.
  const isIndex =
    !/\.html$/i.test(window.location.pathname) ||
    /index\.html$/i.test(window.location.pathname);

  if (isIndex) {
    host.querySelectorAll('a[href^="index.html"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === 'index.html') {
        a.setAttribute('href', '#inicio');
      } else if (href.indexOf('index.html#') === 0) {
        a.setAttribute('href', href.replace('index.html', ''));
      }
    });
  }

  // Marca la página actual en el nav desktop.
  const basename = window.location.pathname.split('/').pop().toLowerCase();
  host.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === basename) {
      a.classList.add('active');
    }
  });

  bindAnchorSmoothScroll(host);
}

/* =========================================================================
   1. Header shadow on scroll
   ========================================================================= */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =========================================================================
   2. Mobile navigation
   ========================================================================= */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('open');
    });
  });
}

/* =========================================================================
   3. Smooth scrolling with sticky-header offset
   ========================================================================= */
function bindAnchorSmoothScroll(scope) {
  const links = (scope || document).querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    if (link.dataset.smoothBound) return;
    link.dataset.smoothBound = '1';
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initSmoothScroll() {
  bindAnchorSmoothScroll(document);
}

/* =========================================================================
   4. Reveal-on-scroll animations
   ========================================================================= */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}

/* =========================================================================
   5. Reveal the sectors section on demand
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
   6. Theme toggle (dark / light)
   ========================================================================= */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const root = document.documentElement;
  const storageKey = 'd3apps-theme';

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    const isDark = theme === 'dark';
    document.querySelectorAll('header .brand-icon').forEach((img) => {
      img.src = isDark ? 'icons/light_264x264.png' : 'icons/dark_264x264.png';
    });
    document.querySelectorAll('.footer-brand .brand-icon').forEach((img) => {
      img.src = isDark ? 'icons/light_d3_182x182.png' : 'icons/dark_264x264.png';
    });
  };

  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, next); } catch (e) {}
    applyTheme(next);
  });
}

/* =========================================================================
   7. Animated particle & grid canvas background (hero + footer)
   ========================================================================= */
function initParticleCanvas(canvas, host, opts) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const options = opts || {};

  const colorDark = options.colorDark || options.color || { r: 96, g: 165, b: 250 };
  const colorLight = options.colorLight || options.color || colorDark;
  const themeAware = !!options.themeAware;
  const getColor = () =>
    themeAware
      ? (document.documentElement.dataset.theme === 'dark' ? colorDark : colorLight)
      : (options.color || colorDark);

  let color = getColor();

  const maxParticles = options.maxParticles || 70;
  const particleAlpha = options.particleAlpha != null ? options.particleAlpha : 0.25;
  const connectionAlpha = options.connectionAlpha != null ? options.connectionAlpha : 0.09;
  const mouseConnectionAlpha = options.mouseConnectionAlpha != null ? options.mouseConnectionAlpha : 0.14;
  const connectionDistance = 120;
  const mouseConnectionDistance = 180;
  const drawGrid = options.grid !== false;

  const particles = [];
  const mouse = {
    x: null,
    y: null,
    radius: 130,
    active: false
  };

  function resizeCanvas() {
    const w = host ? host.offsetWidth : window.innerWidth;
    const h = host ? host.offsetHeight : window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  if (options.mouse !== false) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    });
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
    }

    update() {
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
          this.radius = this.baseRadius + force * 1.5;
        } else if (this.radius > this.baseRadius) {
          this.radius -= 0.05;
        }
      } else if (this.radius > this.baseRadius) {
        this.radius -= 0.05;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      else if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      else if (this.y > canvas.height) { this.y = canvas.height; this.vy *= -1; }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particleAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * connectionAlpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseConnectionDistance) {
          const alpha = (1 - dist / mouseConnectionDistance) * mouseConnectionAlpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    color = getColor();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (drawGrid) {
      // Subtle grid background
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.03)`;
      ctx.lineWidth = 1;
      const gridSpacing = 90;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();

    requestAnimationFrame(loop);
  }

  loop();
}

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

function initFooterCanvas() {
  const canvas = document.getElementById('footer-canvas');
  if (!canvas) return;
  const footer = document.getElementById('site-footer');
  initParticleCanvas(canvas, footer, {
    themeAware: true,
    colorDark: { r: 96, g: 165, b: 250 },
    colorLight: { r: 37, g: 99, b: 235 },
    maxParticles: 40,
    particleAlpha: 0.14,
    connectionAlpha: 0.05
  });
}

/* =========================================================================
   8. Demo / diagnostic forms (index + product pages)
   ========================================================================= */
function initDemoForms() {
  const forms = document.querySelectorAll('.demo-form');
  forms.forEach((form) => {
    const successBox = form.querySelector('.form-success');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Native validation feedback (novalidate is off via class fallback)
      const fields = form.querySelectorAll('[required]');
      let valid = true;
      fields.forEach((f) => {
        if (!f.value.trim()) {
          valid = false;
          f.style.borderColor = '#ef4444';
          f.addEventListener('input', () => (f.style.borderColor = ''), { once: true });
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.style.borderColor = '#ef4444';
        email.addEventListener('input', () => (email.style.borderColor = ''), { once: true });
      }

      if (!valid) return;

      // Diagnóstico gratuito: abre WhatsApp con el mensaje armado
      const phoneField = form.querySelector('#df-phone');
      if (phoneField) {
        const nameEl = form.querySelector('#df-name');
        const sectorEl = form.querySelector('#df-sector');
        const toolEl = form.querySelector('#df-tool');
        const messageEl = form.querySelector('#df-message');

        const nombre = nameEl ? nameEl.value.trim() : '';
        const sector = sectorEl ? sectorEl.options[sectorEl.selectedIndex].text : '';
        const tool = toolEl ? toolEl.options[toolEl.selectedIndex].text : '';
        const mensaje = messageEl ? messageEl.value.trim() : '';

        const texto = [
          `¡Hola! Soy ${nombre}. Quiero un diagnóstico gratuito.`,
          `Sector: ${sector}`,
          `Herramienta que uso hoy: ${tool}`,
          mensaje ? `\n${mensaje}` : ''
        ].filter(Boolean).join('\n');

        const url = `https://wa.me/573144795868?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank', 'noopener');
      }

      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();

      setTimeout(() => successBox && successBox.classList.remove('show'), 6000);
    });
  });
}

/* =========================================================================
   9. Hero questions → scroll to "Nosotros" section
   ========================================================================= */
function initHeroQuestions() {
  const questions = document.querySelectorAll('.hero-question');
  if (questions.length === 0) return;

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
   11. Broken internal links fallback → redirect to index
   ========================================================================= */
function initBrokenLinkRedirect() {
  // Con file:// no se puede verificar la existencia de la página (fetch
  // falla por CORS), así que se deja que el navegador maneje el enlace.
  if (window.location.protocol === 'file:') return;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    // Solo enlaces internos a páginas .html (no anclas, ni http, mailto, tel…)
    if (!/^(\.{0,2}\/)*[A-Za-z0-9][A-Za-z0-9_-]*\.html(?:[?#].*)?$/i.test(href)) return;

    const url = new URL(href, window.location.href);
    const indexPath = url.pathname.split('/').slice(0, -1).concat(['index.html']).join('/');

    e.preventDefault();
    fetch(url.href, { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        if (res.ok) {
          if (link.target === '_blank') {
            window.open(url.href, '_blank', 'noopener');
          } else {
            window.location.href = url.href;
          }
        } else {
          window.location.href = indexPath;
        }
      })
      .catch(() => {
        window.location.href = indexPath;
      });
  });
}

/* =========================================================================
   12. Shared footer component (single source, injected synchronously)
   ========================================================================= */
const FOOTER_HTML = `
<footer class="footer">
  <canvas id="footer-canvas"></canvas>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="index.html" class="brand">
          <img class="brand-icon" src="icons/light_d3_182x182.png" alt="D3Apps Logo">
          <span>D3Apps</span>
        </a>
        <p>Aplicaciones inteligentes para medir indicadores, organizar procesos y tomar decisiones basadas en información real.</p>
        <div class="social-row">
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2a6 6 0 0 1 2-2z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
          <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Productos</h4>
        <ul>
          <li><a href="d3-ventas.html">D3 Ventas</a></li>
          <li><a href="d3-contabilidad-colombia.html">D3 Contabilidad</a></li>
          <li><a href="d3-logistica.html">D3 Logística</a></li>
          <li><a href="d3-transporte.html">D3 Transporte</a></li>
          <li><a href="d3-proyectos.html">D3 Proyectos</a></li>
          <li><a href="d3-formacion.html">D3 Formación</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Sectores</h4>
        <ul>
          <li><a href="index.html#sectores">Sector Ventas</a></li>
          <li><a href="index.html#sectores">Sector Contable</a></li>
          <li><a href="index.html#sectores">Sector Logístico</a></li>
          <li><a href="index.html#sectores">Sector Transporte</a></li>
          <li><a href="index.html#sectores">Sector Proyectos</a></li>
          <li><a href="index.html#sectores">Sector Deportivo</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Nosotros y Contacto</h4>
        <ul>
          <li><a href="quienes-somos.html">Nosotros</a></li>
          <li><a href="index.html#precios">Precios</a></li>
          <li><a href="franquicias.html">Franquicias</a></li>
        </ul>
        <ul class="footer-contact" style="margin-top:1.2rem">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:+573144795868">+57 314 479 5868</a></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><a href="mailto:contacto@d3-apps.com">contacto@d3-apps.com</a></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg><a href="https://wa.me/573144795868" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 D3Apps Inc. Todos los derechos reservados.</span>
      <div class="fb-links">
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <a href="#">Soporte</a>
      </div>
    </div>
  </div>
</footer>
`;

function initFooter() {
  const host = document.getElementById('site-footer');
  if (!host) return;

  host.innerHTML = FOOTER_HTML;
  initFooterCanvas();

  // En el index, los enlaces de sección deben funcionar sin recargar la página.
  const isIndex =
    !/\.html$/i.test(window.location.pathname) ||
    /index\.html$/i.test(window.location.pathname);

  if (isIndex) {
    host.querySelectorAll('a[href^="index.html"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === 'index.html') {
        a.setAttribute('href', '#inicio');
      } else if (href.indexOf('index.html#') === 0) {
        a.setAttribute('href', href.replace('index.html', ''));
      }
    });
    bindAnchorSmoothScroll(host);
  }
}

/* =========================================================================
   13. Login / Register modal (header "Ingresar al portal")
   ========================================================================= */
const AUTH_MODAL_HTML = `
<div class="modal" id="auth-modal" aria-hidden="true">
  <div class="modal-backdrop" data-close></div>
  <div class="modal-card">
    <button type="button" class="modal-close" data-close aria-label="Cerrar">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>

    <div class="auth-tabs">
      <button type="button" class="auth-tab active" data-tab="login">Iniciar sesión</button>
      <button type="button" class="auth-tab" data-tab="register">Registrarse</button>
    </div>

    <form id="auth-login" class="auth-form">
      <label class="auth-field">Correo electrónico
        <input type="email" name="email" required autocomplete="email" placeholder="tu@correo.com">
      </label>
      <label class="auth-field">Contraseña
        <input type="password" name="password" required autocomplete="current-password" placeholder="••••••••">
      </label>
      <div class="auth-row">
        <label class="auth-check"><input type="checkbox" name="remember"> Recordar contraseña</label>
        <a href="#" class="auth-link">¿Olvidaste tu contraseña?</a>
      </div>
      <button type="submit" class="btn btn-primary btn-block">Iniciar sesión</button>
      <p class="auth-error" hidden></p>
    </form>

    <form id="auth-register" class="auth-form" hidden>
      <label class="auth-field">Nombre completo
        <input type="text" name="name" required autocomplete="name">
      </label>
      <label class="auth-field">Correo electrónico
        <input type="email" name="email" required autocomplete="email">
      </label>
      <label class="auth-field">Contraseña
        <input type="password" name="password" required minlength="8" autocomplete="new-password">
      </label>
      <button type="submit" class="btn btn-primary btn-block">Crear cuenta</button>
      <p class="auth-error" hidden></p>
    </form>

    <div class="auth-divider"><span>o continúa con</span></div>

    <div class="auth-social">
      <button type="button" class="btn btn-social" data-provider="google">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continuar con Google
      </button>
      <button type="button" class="btn btn-social" data-provider="facebook">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z"/></svg>
        Continuar con Facebook
      </button>
    </div>
  </div>
</div>
`;

function initAuthModal() {
  let modal = document.getElementById('auth-modal');
  if (!modal) {
    const root = document.createElement('div');
    root.innerHTML = AUTH_MODAL_HTML;
    document.body.appendChild(root.firstElementChild);
    modal = document.getElementById('auth-modal');
  }
  if (!modal) return;

  const login = modal.querySelector('#auth-login');
  const register = modal.querySelector('#auth-register');

  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = login.querySelector('input');
    if (first) first.focus();
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-auth]')) {
      e.preventDefault();
      open();
    }
  });

  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  modal.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.auth-tab').forEach((t) => t.classList.toggle('active', t === tab));
      login.hidden = tab.dataset.tab !== 'login';
      register.hidden = tab.dataset.tab !== 'register';
    });
  });

  const showError = (form, msg) => {
    const err = form.querySelector('.auth-error');
    if (!err) return;
    err.textContent = msg;
    err.hidden = false;
  };

  login.addEventListener('submit', (e) => {
    e.preventDefault();
    const remember = login.querySelector('[name="remember"]');
    try { localStorage.setItem('d3apps-remember', remember && remember.checked ? '1' : '0'); } catch (x) {}
    showError(login, 'Demo: la autenticación aún no está conectada al portal.');
  });

  register.addEventListener('submit', (e) => {
    e.preventDefault();
    showError(register, 'Demo: el registro aún no está conectado al portal.');
  });

  modal.querySelectorAll('.auth-link').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  modal.querySelectorAll('[data-provider]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showError(login, `Demo: continuar con ${btn.dataset.provider} aún no configurado.`);
    });
  });
}
