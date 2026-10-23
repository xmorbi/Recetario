/* =================================================================
   NAV.JS — Menú de navegación responsive (toggle + dropdown)
   =================================================================
   Contiene:
     - Toggle del menú hamburguesa en móvil
     - Dropdown "Herramientas" + fix del clipping en escritorio
       (añade/quita .dropdown-abierto en .site-nav-links)
     - Marcado de la herramienta activa (calculadora/conversor)

   ¿Dónde se carga?
     ✓ Recetas individuales (vía generar.html)
     ✓ guia-conservacion.html
     ✓ privacidad.html, contacto.html, gracias.html

   ¿Dónde NO se carga?
     ✗ Páginas que ya cargan app.js (index, recetario, mis-recetas,
       guias, calculadora, conversor, sobre-mi). app.js ya incluye
       esta misma lógica; cargar ambos provocaría doble toggle.

   Si en el futuro unificás todo en nav.js, quitá las dos IIFEs
   initNavToggle / initDropdownHerramientas de app.js.
   ================================================================= */
(function () {
  'use strict';

  // Guard: evita doble inicialización si el script se carga dos veces
  if (window.__navInicializado) return;
  window.__navInicializado = true;

  /* ---------- Menú hamburguesa (móvil) ---------- */
  (function initNavToggle() {
    var toggle = document.querySelector('.site-nav-toggle');
    var links  = document.querySelector('.site-nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('abierto');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ---------- Dropdown Herramientas ---------- */
  (function initDropdownHerramientas() {
    var dropdowns = document.querySelectorAll('.dropdown-tools');
    if (!dropdowns.length) return;

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (d) {
        if (d.open && !d.contains(e.target)) d.open = false;
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdowns.forEach(function (d) { d.open = false; });
      }
    });

    // Cerrar al hacer clic en un enlace del dropdown
    dropdowns.forEach(function (d) {
      d.querySelectorAll('.dropdown-menu a').forEach(function (a) {
        a.addEventListener('click', function () { d.open = false; });
      });
    });

    // Marcar como activo el enlace de la herramienta actual
    // (usa solo el nombre del archivo, ignora ../ de recetas)
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    dropdowns.forEach(function (d) {
      var tieneActivo = false;
      d.querySelectorAll('.dropdown-menu a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        var hrefFile = href.split('/').pop();
        if (hrefFile === path) {
          a.classList.add('activo');
          a.setAttribute('aria-current', 'page');
          tieneActivo = true;
        }
      });
      if (tieneActivo) d.classList.add('tools-activo');
    });

    // Fix: cuando el dropdown está abierto, permitir que se desborde
    // del contenedor .site-nav-links (que tiene overflow-x:auto)
    var navLinks = document.querySelector('.site-nav-links');
    if (navLinks) {
      dropdowns.forEach(function (d) {
        d.addEventListener('toggle', function () {
          var anyOpen = navLinks.querySelector('.dropdown-tools[open]');
          navLinks.classList.toggle('dropdown-abierto', !!anyOpen);
        });
      });
    }
  })();
})();