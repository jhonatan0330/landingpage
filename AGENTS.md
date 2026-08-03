# AGENTS.md — D3Apps Landing Page

Guía para agentes de IA que trabajen en este repositorio.

## Modelo de negocio

- **D3Apps opera bajo un modelo de franquicias**: la empresa central provee el software en
  **SaaS** y cobra por **tokens usados**; las franquicias locales venden y acompañan la
  solución en su región.
- La página debe reflejar este modelo: sección de precios basada en tokens y sección de
  franquicias con opción de "conviértete en franquicia".

## Stack

- Sitio 100% estático (HTML + CSS + JS vanilla), sin framework ni build.
- Servido con Nginx vía Docker Compose.
- Idioma del contenido: **español** (Colombia).
- Fuentes: Outfit (sans) y Space Mono (números) vía Google Fonts.

## Estructura

```
landingpage/
├── AGENTS.md               # este archivo
├── docker-compose.yml      # nginx:alpine, sirve ./html en el puerto 8080
└── html/                   # raíz del sitio estático
    ├── index.html                      # landing principal
    ├── quienes-somos.html              # página "Quiénes somos" (misión + valores)
    ├── franquicias.html                # página "Franquicias" (perfiles + formulario)
    ├── d3-ventas.html                  # páginas de producto (6 total)
    ├── d3-contabilidad-colombia.html
    ├── d3-logistica.html
    ├── d3-transporte.html
    ├── d3-proyectos.html
    ├── d3-formacion.html
    ├── styles.css          # todo el CSS (tema claro + tema oscuro)
    ├── app.js              # JS compartido (nav, scroll, reveal, canvas, forms, footer, tema)
    └── icons/              # logos (PNG) + video de la animación del logo (D3Apps_logo_animation...mp4)
```

## Comandos

- Levantar el sitio con Docker: `docker compose up -d` → http://localhost:8080
- Servidor estático rápido (si Docker no está disponible):
  `python -m http.server 8080 --directory html`
- No hay linter, typecheck ni test runner configurado.

## Convenciones del código

- **Un solo `styles.css` compartido** por todas las páginas. No crear hojas por página.
- **Un solo `app.js` compartido** cargado al final del `<body>` en todas las páginas.
- Todas las páginas comparten el mismo header (nav) y footer, ambos como **componentes únicos**:
  su markup vive en las constantes `HEADER_HTML` y `FOOTER_HTML` de `app.js`, inyectadas de
  forma **síncrona** por `initHeader()` y `initFooter()` en los placeholders
  `<header id="site-header"></header>` y `<div id="site-footer"></div>` de cada página
  (sin `fetch`, así funciona también abriendo los archivos con `file://`). Para modificar
  header o footer basta editar esas constantes; no duplicar markup en las páginas. No crear
  `header.html` ni `footer.html` separados (drift y CORS en `file://`).
- `initHeader()` corre **primero** en `DOMContentLoaded` (antes de `initHeaderScroll`,
  `initMobileNav`, `initSmoothScroll`, `initSectorReveal` e `initThemeToggle`), porque esas
  funciones dependen de `#site-header`, `#nav-toggle`, `#mobile-menu` y `#theme-toggle`.
  El placeholder debe ser el elemento `<header>` (no un `<div>`), para preservar el
  `position: sticky` del CSS.
- En `HEADER_HTML`/`FOOTER_HTML` los enlaces de sección usan `index.html#seccion`; en el index,
  `initHeader()`/`initFooter()` los reescriben a `#seccion` para que el smooth scroll funcione
  sin recargar. `initHeader()` además añade `class="active"` al enlace de la página actual en el
  nav desktop (según `location.pathname`).
- El header usa `icons/dark_264x264.png` (logo oscuro, fondo claro) y el footer usa
  `icons/light_d3_182x182.png` (logo claro, fondo oscuro). Verificar el color correcto
  según el fondo; no asumir cuál usar.
- Variables de diseño definidas en `:root` en `styles.css` (colores, sombras, radios,
  transiciones). Usarlas, no valores hardcodeados.
- Iconos: SVGs inline (stroke="currentColor"). No usar emojis en el diseño (los textos
  con emoji en el copy de index.html son intencionales).
- Animaciones al hacer scroll: añadir clase `reveal` (+ `reveal-delay-1..4`).
- JS se organiza en funciones `init*()` registradas en `DOMContentLoaded` en `app.js`.

## Secciones del landing (index.html)

Orden del contenido:

1. `hero` (`id="inicio"`) — incluye `<canvas id="background-canvas">` con la animación
   de partículas/rejilla (inicializada en `initCanvasBackground()` en `app.js`).
2. `hero` — el mockup `.dashboard` incluye el video de la animación del logo
   (`icons/D3Apps_logo_animation_data_design_202606181210.mp4`) en `.dashboard-video`
   (solo en index; las páginas de producto conservan sus mockups con KPIs/gráficos).
3. `about-section` (`id="nosotros"`) — "Si tienes dudas... estás en el lugar correcto".
4. `options-section` (`id="soluciones"`) — 4 tarjetas "¿Qué quieres empezar a gestionar?".
5. `sectors-section` (`id="sectores"`, oculta por defecto) — 6 sectores.
6. `pricing-section` (`id="precios"`) — 3 tarjetas de paquetes de tokens y la
   **tabla de valores de tokens** (`.token-table`).
7. `franchise-section` (`id="franquicias"`) — franquicias actuales (Termilago, Macrsas) y un
   CTA que enlaza a `franquicias.html` para conocer beneficios y postularse. El formulario
   "Conviértete en franquicia" vive en `franquicias.html#contacto`.
8. `demo-section` (`id="contacto"`) — formulario de diagnóstico gratuito (`#demo-form`):
   Nombre, Teléfono/WhatsApp (obligatorio, `#df-phone`), Sector (`#df-sector`),
   Herramienta (`#df-tool`) y mensaje (`#df-message`). Al guardar arma un mensaje
   (nombre + sector + herramienta + lo que nos cuenta) y abre WhatsApp
   (`https://wa.me/573144795868?text=...`). No usa correo.
9. `cta-band` — "Empieza a tomar decisiones con información real." con dos botones.
10. Footer compartido.

## Precios y tokens

- Los precios, valores de tokens, franquicias y descripciones de franquicias son
  **placeholders**. Confirmar con el cliente antes de publicar cifras definitivas.
- Tabla de valores actual (referencia): Pago por uso `$200/token`, Starter 1.000 `$180.000`
  (`$180/token`), Pro 5.000 `$750.000` (`$150/token`), Business 10.000 `$1.200.000`
  (`$120/token`), Enterprise 25.000+ a medida.
- Copy del modelo: "D3Apps provee su software en modelo SaaS y cobra por tokens usados".

## Franquicias

- Franquicias actuales (listadas en `#franquicias` del index y en `franquicias.html`):
  **Termilago** y **Macrsas**. Sus descripciones son placeholders; actualizar con la información real.
- Cada tarjeta de franquicia tiene botones de contacto (WhatsApp y correo).
- El formulario "Conviértete en franquicia" es un `.demo-form` dentro de `.franchise-cta`
  ubicado en `franquicias.html#contacto`. El index solo conserva un CTA con enlace a
  `franquicias.html`.

## Quiénes somos (quienes-somos.html)

- Página institucional con hero de producto (`product-hero`), una sección de historia/misión,
  misión + visión en `.mv-grid`/`.mv-card`, y los valores de la empresa:
  **Verdad**, **Agradecimiento** y **Respeto** (tarjetas `.about-card` en `#valores`).
- Mantener los tres valores y sus íconos si se reescribe el copy; son placeholders de redacción
  pero la tríada es decisión del cliente.
- Cierra con `cta-band` y el footer compartido.

## Estructura de cada página de producto

Cada `d3-*.html` debe mantener el mismo layout para consistencia:

1. `product-hero` — breadcrumb, nombre del producto, descripción corta y botón
   "Solicitar una demostración" (enlaza a `#diagnostico`).
2. `benefits-section` — 6 tarjetas de beneficios.
3. `features-section` — 8 características.
4. `diagnostic-section` (`id="diagnostico"`) — formulario `.demo-form` con las preguntas
   de diagnóstico y un `.form-success`.
5. `cta-band` — "Empieza a tomar decisiones con información real." con dos botones.
6. Footer compartido.

**Forma de contacto por producto**: cada formulario de diagnóstico incluye los campos
`Teléfono / WhatsApp` (`#d-telefono`) y `Medio de contacto preferido` (`#d-contacto` con
opciones WhatsApp / Correo / Teléfono), además del correo y el botón de WhatsApp del CTA.

## Mapas de navegación

- Tarjetas de index.html → páginas de producto:
  - El dinero → `d3-contabilidad-colombia.html`
  - Tu tiempo → `d3-proyectos.html`
  - Tus actividades → `d3-logistica.html`
  - Por sector → revela `#sectores`
- Sectores → páginas de producto:
  - Ventas → `d3-ventas.html`, Contable → `d3-contabilidad-colombia.html`,
    Logístico → `d3-logistica.html`, Transporte → `d3-transporte.html`,
    Proyectos → `d3-proyectos.html`, Formación → `d3-formacion.html`
- Nav (en las 9 páginas): Inicio, **Nosotros** (`quienes-somos.html`), Soluciones, Precios,
  **Franquicias** (`franquicias.html`), Sectores, Contacto. En las páginas de producto los
  enlaces apuntan a `index.html#sección`.

## Tema claro/oscuro

- El tema se controla con el atributo `data-theme` en `<html>` (`light`/`dark`). Los valores
  dark se definen en `[data-theme="dark"]` en `styles.css` redefiniendo las variables de `:root`
  (nunca hardcodear colores dark por selector salvo casos puntuales con
  `[data-theme="dark"] .clase { ... }`).
- Un script inline en el `<head>` de las 9 páginas aplica el tema antes de pintar (lee
  `localStorage('d3apps-theme')`; si no hay preferencia guardada, el default es **dark**).
  Esto evita el "flash" de tema incorrecto.
- `initThemeToggle()` (en `app.js`) maneja el botón `#theme-toggle` y persiste la elección en
  `localStorage`. El tema por defecto es **oscuro**; no sigue a `prefers-color-scheme`.
- `--surface` es la variable de "superficie/card" (equivale a `var(--white)` en claro). Usar
  `var(--surface)` para fondos de tarjetas/secciones; `var(--white)` queda reservado para texto
  e iconos blancos sobre elementos de color (botones, CTA, footer), que deben seguir blancos
  en dark.
- El logo del header se intercambia por JS según el tema (`dark_264x264.png` claro /
  `light_264x264.png` oscuro). El footer conserva siempre `light_d3_182x182.png`.
- El canvas de partículas del hero adapta su color al tema (azul 600 en claro, azul 400 en dark).

## Detalles a tener en cuenta

- La sección `#sectores` está oculta (`hidden`) y se revela con JS al hacer clic en
  `.sector-trigger` o en `a[href="#sectores"]`.
- La foto del gerente en `.hero-questions` usa `icons/manager.png` (una persona mirando un
  computador hacia el **lado derecho**). Las preguntas se superponen al **lado izquierdo** de la
  imagen con un degradado para legibilidad (`.hero-question-list`, overlay dentro de `.hero-questions`).
  Si se cambia la imagen, mantener ese layout.
- La animación de partículas usa un `<canvas>` dentro del hero (no fijo en viewport).
  Adaptarla a la paleta clara si se cambia la identidad visual.
- El footer también tiene su animación de partículas (`#footer-canvas` en `FOOTER_HTML`),
  reutilizando `initParticleCanvas()`. En el footer el color es fijo azul 400 (fondo siempre
  oscuro), con 40 partículas y menor opacidad para no afectar la legibilidad.
- Los formularios (`.demo-form`) solo simulan el envío mostrando `.form-success`.
  No hay backend. El diagnóstico gratuito (`#demo-form`) además abre WhatsApp con el
  mensaje armado (nombre, sector, herramienta y mensaje) hacia `wa.me/573144795868`.
- Contacto de WhatsApp real: `+57 314 479 5868` (`https://wa.me/573144795868`,
  `tel:+573144795868`). El correo `contacto@d3-apps.com` y las redes sociales con `href="#"`
  siguen siendo placeholders.
- El botón "Ingresar al portal" del header (en las 9 páginas, desktop y menú móvil) y el
  botón "Comienza ahora mismo" del hero enlazan a `https://portal.d3-apps.com`, donde estará
  instalada la aplicación para que los usuarios se registren o autentiquen.
- Verificar tras cada cambio: enlaces internos (relativos `d3-*.html`), que los IDs
  usados por `app.js` existan (`site-header`, `nav-toggle`, `mobile-menu`, `sectores`,
  `theme-toggle`; vienen de `HEADER_HTML`/`FOOTER_HTML`), y que las páginas respondan 200
  (servidor estático).
