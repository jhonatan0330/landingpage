// D3Apps — Render de la página de precios a partir de PRICING (pricing-data.js).
// Mantiene la UI desacoplada de los datos: si cambias planes/precios/add-ons
// en pricing-data.js, esta página se actualiza sin tocar el HTML.
(function () {
  function svgCheck() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    );
  }

  function renderCopy() {
    const c = PRICING.copy;
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set('pricing-label', c.label);
    set('pricing-hero-title', c.heroTitle);
    set('pricing-hero-sub', c.heroSubtitle);
    set('plans-title', c.plansTitle);
    set('plans-sub', c.plansSubtitle);
    set('addons-label', c.addonsLabel);
    set('addons-title', c.addonsTitle);
    set('addons-sub', c.addonsSubtitle);
    set('how-label', c.howLabel);
    set('how-title', c.howTitle);
    set('how-body', c.howBody);
    set('cta-title', c.ctaTitle);
    set('cta-sub', c.ctaSubtitle);
  }

  function renderPlans() {
    const grid = document.getElementById('plans-grid');
    if (!grid) return;
    const popular = PRICING.copy.popularLabel;

    PRICING.plans
      .filter((p) => p.isActive !== false)
      .forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'price-card reveal' + (p.isPopular ? ' featured' : '');
        if (p.isPopular) card.setAttribute('data-badge', popular);
        if (i > 0) card.classList.add('reveal-delay-' + Math.min(i, 4));

        const features = p.features
          .map((f) => '<li>' + svgCheck() + '<span>' + f + '</span></li>')
          .join('');

        card.innerHTML =
          '<span class="price-badge">' + p.name + '</span>' +
          '<div class="price-units">' + p.units + '</div>' +
          '<div class="price-num">' + p.priceText + '<small>' + p.period + '</small></div>' +
          '<p>' + p.tagline + '</p>' +
          '<ul>' + features + '</ul>' +
          '<a href="' + p.ctaHref + '" class="btn ' + (p.ctaStyle || 'btn-secondary') + '">' +
          p.ctaLabel + '</a>';

        grid.appendChild(card);
      });
  }

  function renderAddons() {
    const grid = document.getElementById('addons-grid');
    if (!grid) return;

    PRICING.addons.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'addon-card reveal' + (i > 0 ? ' reveal-delay-' + Math.min(i, 4) : '');
      card.innerHTML =
        '<div class="addon-units">' + a.units + '</div>' +
        '<div class="addon-price">' + a.priceText + ' <small>' + a.period + '</small></div>' +
        '<span class="addon-note">' + a.note + '</span>' +
        '<a href="crear-cuenta.html" class="btn btn-secondary btn-sm">Agregar capacidad</a>';
      grid.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCopy();
    renderPlans();
    renderAddons();
    // Re-dispara animaciones reveal sobre el contenido recién inyectado.
    if (typeof initRevealAnimations === 'function') initRevealAnimations();
  });
})();
