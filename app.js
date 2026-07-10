// D3Apps Landing Page Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  initHeadlineAnimation();
  initCanvasBackground();
  initPortalTabs();
  initMetricsCounter();
  initSmoothScroll();
  initGoogleAuth();
});

/* =========================================================================
   1. Word-by-Word Headline Animation
   ========================================================================= */
function initHeadlineAnimation() {
  const headline = document.getElementById('animated-headline');
  if (!headline) return;

  const text = headline.textContent.trim();
  const words = text.split(/\s+/);
  
  // Clear original text and replace with spans
  headline.innerHTML = '';
  
  const spans = words.map((word, index) => {
    const span = document.createElement('span');
    span.className = 'headline-word';
    span.textContent = word;
    // Add extra margin for spacing
    headline.appendChild(span);
    // Add space after word (except the last one)
    if (index < words.length - 1) {
      headline.appendChild(document.createTextNode(' '));
    }
    return span;
  });

  // Fade in word-by-word with delay
  spans.forEach((span, index) => {
    setTimeout(() => {
      span.classList.add('visible');
    }, 150 + index * 100);
  });
}

/* =========================================================================
   2. Canvas Particles & Electric Grid Background
   ========================================================================= */
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Particle configuration
  const particles = [];
  const maxParticles = 80;
  const connectionDistance = 110;
  const mouseConnectionDistance = 180;
  
  // Mouse state
  const mouse = {
    x: null,
    y: null,
    radius: 120, // repulsion radius
    active: false
  };

  // Resize canvas to fill window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse coordinates
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

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4; // subtle velocity
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
    }

    update() {
      // Repel from mouse
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Smooth push
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
          
          // Make particle slightly larger / glowing near cursor
          this.radius = this.baseRadius + force * 1.5;
        } else {
          if (this.radius > this.baseRadius) {
            this.radius -= 0.05;
          }
        }
      } else {
        if (this.radius > this.baseRadius) {
          this.radius -= 0.05;
        }
      }

      // Move particle
      this.x += this.vx;
      this.y += this.vy;

      // Bounce/Wrap boundary conditions
      if (this.x < 0) {
        this.x = 0;
        this.vx *= -1;
      } else if (this.x > canvas.width) {
        this.x = canvas.width;
        this.vx *= -1;
      }

      if (this.y < 0) {
        this.y = 0;
        this.vy *= -1;
      } else if (this.y > canvas.height) {
        this.y = canvas.height;
        this.vy *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 110, 247, 0.4)';
      ctx.fill();
    }
  }

  // Populate particles array
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Draw lines connecting particles and mouse
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      // Lines between particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(79, 110, 247, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Lines from mouse to particles
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseConnectionDistance) {
          const alpha = (1 - dist / mouseConnectionDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(79, 110, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  // Canvas render loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background subtle electric grid lines (static grid as background structure)
    ctx.strokeStyle = 'rgba(79, 110, 247, 0.015)';
    ctx.lineWidth = 1;
    const gridSpacing = 80;
    
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

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();

    animationFrameId = requestAnimationFrame(loop);
  }

  // Start the render loop
  loop();
}

/* =========================================================================
   3. Portal Card Login/Register Tabs
   ========================================================================= */
function initPortalTabs() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const groupName = document.getElementById('group-name');
  const groupConfirm = document.getElementById('group-confirm');
  const optionsRow = document.getElementById('auth-options');
  const submitBtn = document.getElementById('form-submit-btn');
  const footerText = document.getElementById('footer-text');
  const toggleLink = document.getElementById('toggle-form-link');
  const authForm = document.getElementById('portal-auth-form');
  const successBanner = document.getElementById('form-success-banner');
  const successMsg = document.getElementById('form-success-message');

  let currentTab = 'login'; // 'login' or 'register'

  function switchTab(targetTab) {
    if (targetTab === currentTab) return;
    currentTab = targetTab;

    // Reset validation/feedback styling
    successBanner.style.display = 'none';

    if (currentTab === 'login') {
      // Toggle buttons states
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      
      // Hide name and confirm fields
      groupName.classList.add('hidden');
      groupConfirm.classList.add('hidden');
      
      // Make name input not required
      document.getElementById('reg-name').required = false;
      document.getElementById('auth-confirm').required = false;
      
      // Show login options (remember me)
      optionsRow.style.display = 'flex';
      
      // Adjust texts
      submitBtn.textContent = 'Ingresar';
      footerText.textContent = '¿No tienes cuenta aún?';
      toggleLink.textContent = 'Regístrate';
      toggleLink.setAttribute('data-target', 'register');
    } else {
      // Toggle buttons states
      tabLogin.classList.remove('active');
      tabRegister.classList.add('active');
      
      // Show name and confirm fields
      groupName.classList.remove('hidden');
      groupConfirm.classList.remove('hidden');
      
      // Make name and confirm password required
      document.getElementById('reg-name').required = true;
      document.getElementById('auth-confirm').required = true;
      
      // Hide login options (remember me)
      optionsRow.style.display = 'none';
      
      // Adjust texts
      submitBtn.textContent = 'Registrarse';
      footerText.textContent = '¿Ya tienes cuenta?';
      toggleLink.textContent = 'Inicia sesión';
      toggleLink.setAttribute('data-target', 'login');
    }
  }

  // Tab button clicks
  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));

  // Toggle footer link click
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = toggleLink.getAttribute('data-target');
    switchTab(target);
  });

  // Handle Form Submission Mock
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation for registration password matching
    if (currentTab === 'register') {
      const password = document.getElementById('auth-password').value;
      const confirm = document.getElementById('auth-confirm').value;
      if (password !== confirm) {
        alert('Las contraseñas no coinciden. Por favor, verifica de nuevo.');
        return;
      }
    }

    // Success styling feedback
    if (currentTab === 'login') {
      successMsg.textContent = '¡Ingreso exitoso! Redirigiendo al portal...';
    } else {
      successMsg.textContent = '¡Registro completo! Cuenta creada con éxito.';
    }

    successBanner.style.display = 'flex';
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reset inputs after delay
    setTimeout(() => {
      authForm.reset();
      successBanner.style.display = 'none';
    }, 4000);
  });
}

/* =========================================================================
   4. Metrics Counter Scroll Animation
   ========================================================================= */
function initMetricsCounter() {
  const metricsContainer = document.getElementById('metrics-container');
  const counters = document.querySelectorAll('.counter-val');
  if (!metricsContainer || counters.length === 0) return;

  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const updateCount = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = easeProgress * target;
        
        counter.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  // Intersection Observer to run animation when visual
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(metricsContainer);
}

/* =========================================================================
   5. Smooth Scrolling for Navigation
   ========================================================================= */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* =========================================================================
   6. Google Authentication Button
   =========================================================================
   NOTE: Wire this up to your real OAuth provider (Firebase, Google Identity
   Services, etc.). The current implementation shows a loading state for UI
   demonstration and logs a placeholder message to the console.
   ========================================================================= */
function initGoogleAuth() {
  const btn = document.getElementById('btn-google-auth');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Show loading state
    btn.classList.add('loading');

    // ─── Replace the setTimeout below with your real Google OAuth call ───
    // Example with Firebase:
    //   import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
    //   const provider = new GoogleAuthProvider();
    //   signInWithPopup(getAuth(), provider)
    //     .then(result => { /* handle success */ })
    //     .catch(err  => { /* handle error  */ })
    //     .finally(() => btn.classList.remove('loading'));
    // ────────────────────────────────────────────────────────────────────
    setTimeout(() => {
      btn.classList.remove('loading');
      console.log('[D3Apps] Google OAuth — integración pendiente.');
    }, 1800);
  });
}
