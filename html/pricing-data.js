// D3Apps — Configuración central de precios y capacidad (Usage Units).
// ÚNICA fuente de verdad para planes, add-ons y copy comercial.
// No hardcodear precios ni nombres en el markup: editar aquí y el render
// (pricing.js) se actualiza solo.
//
// NOTA INTERNA (no se muestra al usuario): la conversión de referencia es
// 1.000 Usage Units ≈ 1 MB. Los dos clientes reales conocidos calibraron bien:
//   Cliente B ≈ 15,6 MB/mes  → 25K Units  → $80.000/mes
//   Cliente A ≈ 450 MB/mes   → 500K Units → $350.000/mes
// Esta constante es el punto de partida para calibrar MB→Units con más clientes.
const INTERNAL_MB_PER_1K_UNITS = 1; // 1 MB ≈ 1K Units (oculto al cliente)

const PRICING = {
  // ----- Copy de la página -----
  copy: {
    label: 'Precios',
    heroTitle: 'Empieza gratis. Crece cuando lo necesites.',
    heroSubtitle:
      'Comienza con 1K Usage Units gratis cada día y amplía tu capacidad cuando tu proyecto crezca.',
    plansTitle: 'Planes para cada etapa',
    plansSubtitle:
      'Una sola unidad para medir todo lo que usas. Sin costos ocultos ni métricas técnicas.',
    popularLabel: 'Más popular',
    addonsLabel: 'Capacidad adicional',
    addonsTitle: 'Amplía tu capacidad',
    addonsSubtitle:
      '¿Necesitas más espacio o más recursos? Compra Usage Units adicionales, independientes de tu plan.',
    howLabel: 'Modelo sencillo',
    howTitle: '¿Cómo funcionan los Usage Units?',
    howBody:
      'Los Usage Units son la forma sencilla de medir cuánto utilizas nuestra plataforma. ' +
      'Empieza gratis con 1K Usage Units cada día, y cuando necesites más espacio o más recursos, ' +
      'amplías tu capacidad con un plan superior o comprando Units adicionales.',
    ctaTitle: 'Empieza a tomar decisiones con información real.',
    ctaSubtitle: 'Crea tu cuenta gratis o conversa con un asesor. Te ayudamos a elegir la mejor opción.',
  },

  // ----- Planes -----
  // isActive:false oculta el plan sin borrar la configuración.
  // isPopular:true muestra la badge "Más popular" (texto en copy.popularLabel).
  plans: [
    {
      slug: 'free',
      name: 'FREE',
      tagline: 'Prueba la plataforma sin pagar nada.',
      units: '1K Usage Units',
      priceText: '$0',
      period: 'COP · siempre',
      isFree: true,
      isPopular: false,
      isActive: true,
      features: [
        '1K Usage Units gratis cada día',
        'Renovación automática diaria',
        'Acceso a todos los productos D3Apps',
        'Soporte por comunidad',
      ],
      ctaLabel: 'Crear cuenta gratis',
      ctaHref: 'crear-cuenta.html',
      ctaStyle: 'btn-secondary',
    },
    {
      slug: 'starter',
      name: 'STARTER',
      tagline: 'Para empezar a medir tus primeras métricas.',
      units: '25K Usage Units',
      priceText: '$80.000',
      period: 'COP / mes',
      isFree: false,
      isPopular: false,
      isActive: true,
      features: [
        '25K Usage Units al mes',
        '1 producto D3Apps',
        'Reportes mensuales',
        'Soporte por correo',
        'Hasta 3 usuarios',
      ],
      ctaLabel: 'Elegir Starter',
      ctaHref: 'crear-cuenta.html',
      ctaStyle: 'btn-secondary',
    },
    {
      slug: 'growth',
      name: 'GROWTH',
      tagline: 'El equilibrio para equipos en crecimiento.',
      units: '100K Usage Units',
      priceText: '$150.000',
      period: 'COP / mes',
      isFree: false,
      isPopular: false,
      isActive: true,
      features: [
        '100K Usage Units al mes',
        'Todos los productos D3Apps',
        'Reportes ilimitados',
        'Exportación a Excel',
        'Soporte prioritario',
      ],
      ctaLabel: 'Elegir Growth',
      ctaHref: 'crear-cuenta.html',
      ctaStyle: 'btn-secondary',
    },
    {
      slug: 'business',
      name: 'BUSINESS',
      tagline: 'Para empresas que necesitan control total.',
      units: '500K Usage Units',
      priceText: '$350.000',
      period: 'COP / mes',
      isFree: false,
      isPopular: true,
      isActive: true,
      features: [
        '500K Usage Units al mes',
        'Todo lo de Growth',
        'Alertas automáticas',
        'Usuarios y permisos avanzados',
        'Asesor dedicado',
      ],
      ctaLabel: 'Elegir Business',
      ctaHref: 'crear-cuenta.html',
      ctaStyle: 'btn-primary',
    },
    {
      slug: 'pro',
      name: 'PRO',
      tagline: 'Máximo poder de indicadores y escala.',
      units: '1M Usage Units',
      priceText: '$500.000',
      period: 'COP / mes',
      isFree: false,
      isPopular: false,
      isActive: true,
      features: [
        '1M Usage Units al mes',
        'Todo lo de Business',
        'Capacidad ampliable a la carta',
        'Integraciones avanzadas',
        'Soporte prioritario 24/7',
      ],
      ctaLabel: 'Elegir Pro',
      ctaHref: 'crear-cuenta.html',
      ctaStyle: 'btn-secondary',
    },
    {
      slug: 'enterprise',
      name: 'ENTERPRISE',
      tagline: 'Para operaciones a gran escala.',
      units: '5M+ Usage Units',
      priceText: 'A medida',
      period: 'según capacidad',
      isFree: false,
      isPopular: false,
      isActive: true,
      features: [
        '5M+ Usage Units a medida',
        'Todo lo de Pro',
        'SLA y disponibilidad garantizada',
        'Implementación a medida',
        'Contacto directo con ventas',
      ],
      ctaLabel: 'Contactar ventas',
      ctaHref: 'https://wa.me/573144795868',
      ctaStyle: 'btn-secondary',
    },
  ],

  // ----- Add-ons de capacidad (independientes del plan) -----
  // Precios placeholder: configurar desde administración cuando exista backend.
  addons: [
    { units: '+100K Usage Units', priceText: '$60.000', period: 'COP', note: 'Pago único' },
    { units: '+500K Usage Units', priceText: '$250.000', period: 'COP', note: 'Pago único' },
    { units: '+1M Usage Units', priceText: '$400.000', period: 'COP', note: 'Pago único' },
    { units: '+5M Usage Units', priceText: '$1.500.000', period: 'COP', note: 'Pago único' },
  ],
};
