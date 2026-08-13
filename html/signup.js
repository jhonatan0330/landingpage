// D3Apps — Script específico de crear-cuenta.html (registro → portal API).
// Se carga al final del <body> solo en crear-cuenta.html.
document.addEventListener('DOMContentLoaded', () => {
  initSignupForm();
});

/* =========================================================================
   1. Signup form (crear-cuenta.html → portal.d3-apps.com/api/account)
      El endpoint recibe { name, email, password, turnstileToken } y responde
      200/201 {status:'pending_confirmation'} o 4xx {code: 'email_exists' |
      'invalid_email' | 'captcha_failed' | 'rate_limited'}.
   ========================================================================= */
const SIGNUP_API_URL = 'https://portal.d3-apps.com/api/account';
const TURNSTILE_SITEKEY = '0x4AAAAAAAXXXXXXXXXXXXXX';
const TURNSTILE_ENABLED = false; // Cambiar a true cuando tengas la sitekey real de Cloudflare

function loadTurnstileScript() {
  return new Promise((resolve) => {
    if (window.turnstile) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  let turnstileWidgetId = null;

  const nameEl = form.querySelector('#su-name');
  const emailEl = form.querySelector('#su-email');
  const passwordEl = form.querySelector('#su-password');
  const password2El = form.querySelector('#su-password2');
  const hpEl = form.querySelector('#su-hp');
  const submit = form.querySelector('#su-submit');
  const successBox = form.querySelector('#signup-success');
  const errorBox = form.querySelector('#signup-error');

  const showError = (msg) => {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.classList.add('show');
  };
  const hideError = () => {
    if (!errorBox) return;
    errorBox.classList.remove('show');
    errorBox.textContent = '';
  };
  const markInvalid = (el) => {
    el.style.borderColor = '#ef4444';
    el.addEventListener('input', () => (el.style.borderColor = ''), { once: true });
  };

  if (TURNSTILE_ENABLED) {
    loadTurnstileScript().then(() => {
      const wrap = document.getElementById('turnstile-wrap');
      if (!wrap || !window.turnstile) return;
      turnstileWidgetId = window.turnstile.render(wrap, {
        sitekey: TURNSTILE_SITEKEY,
        theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
        callback: hideError
      });
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    // Honeypot: si está lleno, fingir éxito y nunca enviar
    if (hpEl && hpEl.value.trim()) {
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      return;
    }

    let valid = true;
    if (!nameEl.value.trim()) { valid = false; markInvalid(nameEl); }
    const emailValue = emailEl.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { valid = false; markInvalid(emailEl); }
    if (passwordEl.value.length < 8) { valid = false; markInvalid(passwordEl); showError('La contraseña debe tener al menos 8 caracteres.'); }
    if (password2El.value !== passwordEl.value) { valid = false; markInvalid(password2El); showError('Las contraseñas no coinciden.'); }

    if (TURNSTILE_ENABLED && window.turnstile && !window.turnstile.getResponse(turnstileWidgetId)) {
      valid = false;
      showError('Completa la verificación de seguridad.');
    }

    if (!valid) return;

    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = 'Creando tu cuenta…';

    const payload = {
      name: nameEl.value.trim(),
      email: emailValue,
      password: passwordEl.value
    };
    if (TURNSTILE_ENABLED && window.turnstile) {
      payload.turnstileToken = window.turnstile.getResponse(turnstileWidgetId);
    }

    try {
      const res = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data = null;
      try { data = await res.json(); } catch (x) { /* sin JSON */ }

      if (res.ok && data && data.status === 'pending_confirmation') {
        const mailEl = document.getElementById('signup-success-email');
        if (mailEl) mailEl.textContent = emailValue;
        if (successBox) {
          successBox.classList.add('show');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        if (window.turnstile && turnstileWidgetId != null) window.turnstile.reset(turnstileWidgetId);
      } else {
        const code = data && data.code;
        if (code === 'email_exists' || res.status === 409) {
          showError('Ese correo ya está registrado. Prueba iniciando sesión.');
        } else if (code === 'invalid_email') {
          showError('El correo electrónico no es válido.');
        } else if (code === 'captcha_failed') {
          showError('No pudimos verificar tu humanidad. Inténtalo de nuevo.');
          if (window.turnstile && turnstileWidgetId != null) window.turnstile.reset(turnstileWidgetId);
        } else if (code === 'rate_limited' || res.status === 429) {
          showError('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
        } else {
          showError('No pudimos crear tu cuenta en este momento. Inténtalo de nuevo más tarde.');
        }
        if (errorBox) errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (err) {
      showError('No pudimos conectarnos con el portal. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
}