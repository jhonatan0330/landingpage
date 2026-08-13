// D3Apps — Aplica el tema guardado antes del primer pintado (sin flash).
// Se carga síncrono en el <head> de todas las páginas, antes del CSS.
(function () {
  try {
    var t = localStorage.getItem('d3apps-theme');
    if (!t) { t = 'dark'; }
    document.documentElement.dataset.theme = t;
  } catch (e) { document.documentElement.dataset.theme = 'dark'; }
})();
