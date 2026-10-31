/* =================================================================
   NAV.JS — Menú de navegación responsive (toggle + dropdown + buscador)
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

    // FASE 3 (auditoría): detectar "activo" con URLs limpias (trailing slash)
    // location.pathname ahora termina en "/" → normalizamos ambos lados.
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

    // Fix: cuando el dropdown está abierto, permitir que se desborde
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
    
    // Si no existe el input en esta página, o no se inyectaron las recetas, salir.
    if (!input || !dropdown || typeof window.RECETAS_NAV === 'undefined') return;

    var activo = -1;
    var sugerencias = [];

    // Normalizar texto (quitar acentos y minúsculas)
    function norm(s) {
      return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function buscar(q) {
      var qN = norm(q.trim());
      if (qN.length < 2) return [];
      
      var resultados = [];
      
      // Buscar coincidencias con puntuación para ordenar por relevancia
      window.RECETAS_NAV.forEach(function (r) {
        var tituloNorm = norm(r.titulo);
        var score = 0;
        
        if (tituloNorm === qN) {
          score = 100; // Coincidencia exacta
        } else if (tituloNorm.indexOf(qN) === 0) {
          score = 80; // Empieza con la palabra (ej. "Pan amasado")
        } else {
          // Si la palabra tiene 3 letras o más, buscar como palabra completa
          if (qN.length >= 3) {
            var re = new RegExp('\\b' + qN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            if (re.test(tituloNorm)) {
              score = 60; // Lo contiene como palabra (ej. "Arroz con pan")
            }
          } else {
            // Si es muy corto (ej. "pa"), buscar simplemente si lo contiene
            if (tituloNorm.indexOf(qN) !== -1) {
              score = 40;
            }
          }
        }
        
        if (score > 0) {
          resultados.push({ r: r, score: score });
        }
      });
      
      // Ordenar de mayor a menor puntaje
      resultados.sort(function (a, b) {
        return b.score - a.score;
      });
      
      // Devolver solo los primeros 6
      return resultados.slice(0, 6).map(function(x) { return x.r; });
    }

    function render() {
      if (!sugerencias.length) {
        dropdown.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      // Crear el HTML de las sugerencias
      dropdown.innerHTML = sugerencias.map(function (r, i) {
        return '<li data-idx="' + i + '" role="option" ' +
          (i === activo ? 'class="activo" aria-selected="true"' : '') + '>' +
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
      
      // FASE 3 (auditoría): URL limpia → /recetas/slug/
      window.location.href = '/recetas/' + r.slug + '/';
    }

    // Función auxiliar para evitar inyecciones HTML
    function escaparHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
      });
    }

    // --- EVENTOS ---
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

    // Usar mousedown en vez de click para que el evento ocurra antes del blur
    dropdown.addEventListener('mousedown', function (e) {
      var li = e.target.closest('li[data-idx]');
      if (li) {
        e.preventDefault();
        seleccionar(parseInt(li.dataset.idx, 10));
      }
    });

    // Ocultar el dropdown cuando se pierde el foco
    input.addEventListener('blur', function () {
      setTimeout(function () {
        dropdown.hidden = true;
        activo = -1;
      }, 150);
    });
  })();

})();