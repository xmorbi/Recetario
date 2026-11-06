/* =================================================================
   NAV.JS — Menú de navegación responsive (toggle + dropdown + buscador)
   ================================================================= */
(function () {
  'use strict';

  // Guard: evita doble inicialización si el script se carga dos veces
  if (window.__navInicializado) return;
  window.__navInicializado = true;

  /* ---------- Menú hamburguesa (móvil) ---------- */
  // FASE 2: el botón hamburguesa ya no existe en el HTML.
  // Esta IIFE retorna temprano (toggle === null) y no hace nada.
  // Se conserva por si en el futuro se reactiva el patrón.
  (function initNavToggle() {
    var toggle = document.querySelector('.site-nav-toggle');
    var links  = document.querySelector('.site-nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('abierto');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ---------- Dropdown Herramientas (desktop) ---------- */
  (function initDropdownHerramientas() {
    var dropdowns = document.querySelectorAll('.dropdown-tools');
    if (!dropdowns.length) return;

    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (d) {
        if (d.open && !d.contains(e.target)) d.open = false;
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdowns.forEach(function (d) { d.open = false; });
      }
    });

    dropdowns.forEach(function (d) {
      d.querySelectorAll('.dropdown-menu a').forEach(function (a) {
        a.addEventListener('click', function () { d.open = false; });
      });
    });

    var path = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean).pop() || '';
    path = path.toLowerCase();
    dropdowns.forEach(function (d) {
      var tieneActivo = false;
      d.querySelectorAll('.dropdown-menu a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        var hrefFile = href.replace(/\.html$/, '').replace(/\/+$/, '').split('/').filter(Boolean).pop() || '';
        if (hrefFile === path) {
          a.classList.add('activo');
          a.setAttribute('aria-current', 'page');
          tieneActivo = true;
        }
      });
      if (tieneActivo) d.classList.add('tools-activo');
    });

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

  /* ---------- Buscador del Nav (Autocompletado) ---------- */
  (function initNavSearch() {
    var input = document.getElementById('nav-buscador');
    var dropdown = document.getElementById('nav-buscador-sugerencias');
    if (!input || !dropdown) return;

    var activo = -1;
    var sugerencias = [];

    function norm(s) {
      return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function cargarNav() {
      if (window.RECETAS_NAV) return Promise.resolve();
      return fetch('/api/recetas-nav.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { window.RECETAS_NAV = d; })
        .catch(function () { window.RECETAS_NAV = []; });
    }

    function buscar(q) {
      if (!window.RECETAS_NAV) return [];

      var qN = norm(q.trim());
      if (qN.length < 2) return [];

      var resultados = [];

      window.RECETAS_NAV.forEach(function (r) {
        var tituloNorm = norm(r.titulo);
        var score = 0;

        if (tituloNorm === qN) {
          score = 100;
        } else if (tituloNorm.indexOf(qN) === 0) {
          score = 80;
        } else {
          if (qN.length >= 3) {
            var re = new RegExp('\\b' + qN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            if (re.test(tituloNorm)) {
              score = 60;
            }
          } else {
            if (tituloNorm.indexOf(qN) !== -1) {
              score = 40;
            }
          }
        }

        if (score > 0) {
          resultados.push({ r: r, score: score });
        }
      });

      resultados.sort(function (a, b) {
        return b.score - a.score;
      });

      return resultados.slice(0, 6).map(function(x) { return x.r; });
    }

    function render() {
      if (!sugerencias.length) {
        dropdown.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      dropdown.innerHTML = sugerencias.map(function (r, i) {
        var isActivo = i === activo;
        return '<li data-idx="' + i + '" role="option" aria-selected="' + (isActivo ? 'true' : 'false') + '"' +
          (isActivo ? ' class="activo"' : '') + '>' +
          '<span class="ac-titulo">' + escaparHtml(r.titulo) + '</span>' +
          '<span class="ac-cat">' + escaparHtml(r.categoria || '') + '</span>' +
        '</li>';
      }).join('');

      dropdown.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function seleccionar(idx) {
      var r = sugerencias[idx];
      if (!r) return;
      window.location.href = '/recetas/' + r.slug + '/';
    }

    function escaparHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
      });
    }

    input.addEventListener('focus', function () {
      cargarNav().then(function () {
        if (input.value) input.dispatchEvent(new Event('input'));
      });
    }, { once: true });

    input.addEventListener('input', function () {
      sugerencias = buscar(input.value);
      activo = -1;
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (dropdown.hidden) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activo = Math.min(sugerencias.length - 1, activo + 1);
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activo = Math.max(0, activo - 1);
        render();
      } else if (e.key === 'Enter' && activo >= 0) {
        e.preventDefault();
        seleccionar(activo);
      } else if (e.key === 'Escape') {
        dropdown.hidden = true;
        activo = -1;
        input.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.addEventListener('mousedown', function (e) {
      var li = e.target.closest('li[data-idx]');
      if (li) {
        e.preventDefault();
        seleccionar(parseInt(li.dataset.idx, 10));
      }
    });

    input.addEventListener('blur', function () {
      setTimeout(function () {
        dropdown.hidden = true;
        activo = -1;
      }, 150);
    });
  })();

  /* ---------- FASE 2: Tabbar inferior — panel Herramientas ---------- */
  (function initTabbarTools() {
    var tools = document.querySelector('.tabbar-tools');
    if (!tools) return;

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (tools.open && !tools.contains(e.target)) tools.open = false;
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tools.open) tools.open = false;
    });

    // Cerrar al tocar cualquier enlace del panel
    tools.querySelectorAll('.tabbar-tools-menu a').forEach(function (a) {
      a.addEventListener('click', function () { tools.open = false; });
    });
  })();

})();