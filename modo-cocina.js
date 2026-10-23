/* =================================================================
   MODO-COCINA.JS — Overlay de cocina a pantalla completa
   Expone window.ModoCocina.abrir(receta) y window.ModoCocina.cerrar()
   Auto-init: si la página tiene <script id="receta-data"> y un
   <button class="btn-modo-cocina">, engancha el botón automáticamente.
   ================================================================= */
(function () {
  'use strict';
  if (window.ModoCocina) return;

  var WAKE_LOCK = null;
  var overlayEl = null;
  var recetaActual = null;
  var pasoActual = 0;
  var botonOrigen = null;
  var onKeyDownHandler = null;

  function escaparHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function crearOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'modo-cocina';
    overlayEl.className = 'mc-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-labelledby', 'mc-titulo');
    overlayEl.innerHTML =
      '<header class="mc-header">' +
        '<h1 id="mc-titulo" class="mc-titulo"></h1>' +
        '<button type="button" class="mc-cerrar" aria-label="Cerrar modo cocina">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</header>' +
      '<details class="mc-ingredientes">' +
        '<summary>Ingredientes (<span class="mc-ing-count">0</span>)</summary>' +
        '<ul class="mc-ing-list"></ul>' +
      '</details>' +
      '<div class="mc-contenido"></div>' +
      '<nav class="mc-nav" aria-label="Navegación de pasos">' +
        '<button type="button" class="mc-prev" aria-label="Paso anterior">← <span>Anterior</span></button>' +
        '<span class="mc-contador" aria-live="polite">1 / 1</span>' +
        '<button type="button" class="mc-next" aria-label="Paso siguiente"><span>Siguiente</span> →</button>' +
      '</nav>';
    document.body.appendChild(overlayEl);

    overlayEl.querySelector('.mc-cerrar').addEventListener('click', cerrar);
    overlayEl.querySelector('.mc-prev').addEventListener('click', pasoAnterior);
    overlayEl.querySelector('.mc-next').addEventListener('click', pasoSiguiente);
    return overlayEl;
  }

  async function solicitarWakeLock() {
    try {
      if ('wakeLock' in navigator && !WAKE_LOCK) {
        WAKE_LOCK = await navigator.wakeLock.request('screen');
        WAKE_LOCK.addEventListener('release', function () { WAKE_LOCK = null; });
      }
    } catch (e) { /* silencioso */ }
  }

  function liberarWakeLock() {
    if (WAKE_LOCK) {
      try { WAKE_LOCK.release(); } catch (e) {}
      WAKE_LOCK = null;
    }
  }

  function abrir(receta) {
    if (!receta) return;
    recetaActual = receta;
    pasoActual = 0;
    botonOrigen = document.activeElement;

    var ov = crearOverlay();
    ov.querySelector('.mc-titulo').textContent = receta.titulo || 'Receta';

    var ings = receta.ingredientes || [];
    ov.querySelector('.mc-ing-count').textContent = ings.length;
    ov.querySelector('.mc-ing-list').innerHTML = ings.map(function (x) {
      return '<li>' + escaparHtml(x) + '</li>';
    }).join('');

    var pasos = receta.pasos || [];
    ov.querySelector('.mc-contenido').innerHTML = pasos.map(function (p, i) {
      return '<div class="mc-paso" data-paso="' + i + '">' +
        '<div class="mc-paso-num">Paso ' + (i + 1) + '</div>' +
        '<p class="mc-paso-texto">' + escaparHtml(p) + '</p>' +
      '</div>';
    }).join('');

    actualizarPaso();
    document.body.classList.add('mc-bloqueado');
    ov.classList.add('abierto');

    onKeyDownHandler = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); pasoAnterior(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); pasoSiguiente(); }
    };
    document.addEventListener('keydown', onKeyDownHandler);

    solicitarWakeLock();
    setTimeout(function () {
      var next = ov.querySelector('.mc-next');
      if (next) next.focus();
    }, 100);
  }

  function cerrar() {
    if (!overlayEl) return;
    overlayEl.classList.remove('abierto');
    document.body.classList.remove('mc-bloqueado');
    if (onKeyDownHandler) {
      document.removeEventListener('keydown', onKeyDownHandler);
      onKeyDownHandler = null;
    }
    liberarWakeLock();
    if (botonOrigen && typeof botonOrigen.focus === 'function') {
      try { botonOrigen.focus(); } catch (e) {}
    }
  }

  function actualizarPaso() {
    if (!overlayEl) return;
    var pasos = overlayEl.querySelectorAll('.mc-paso');
    if (pasos.length === 0) return;
    pasos.forEach(function (el, i) {
      el.classList.toggle('activo', i === pasoActual);
    });
    overlayEl.querySelector('.mc-contador').textContent = (pasoActual + 1) + ' / ' + pasos.length;
    var prev = overlayEl.querySelector('.mc-prev');
    var next = overlayEl.querySelector('.mc-next');
    prev.disabled = pasoActual === 0;
    if (pasoActual === pasos.length - 1) {
      next.classList.add('mc-terminar');
      next.innerHTML = '<span>Terminar</span> ✓';
    } else {
      next.classList.remove('mc-terminar');
      next.innerHTML = '<span>Siguiente</span> →';
    }
    var contenido = overlayEl.querySelector('.mc-contenido');
    contenido.scrollTop = 0;
  }

  function pasoAnterior() {
    if (pasoActual > 0) {
      pasoActual--;
      actualizarPaso();
    }
  }

  function pasoSiguiente() {
    if (!overlayEl) return;
    var pasos = overlayEl.querySelectorAll('.mc-paso');
    if (pasoActual < pasos.length - 1) {
      pasoActual++;
      actualizarPaso();
    } else {
      cerrar();
    }
  }

  // Auto-init para páginas individuales
  document.addEventListener('DOMContentLoaded', function () {
    var dataEl = document.getElementById('receta-data');
    var btn = document.querySelector('.btn-modo-cocina');
    if (!dataEl || !btn) return;
    var receta;
    try { receta = JSON.parse(dataEl.textContent); } catch (e) { return; }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      abrir(receta);
    });
  });

  // Al volver a la pestaña con el overlay abierto, re-solicitar wake lock
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && overlayEl && overlayEl.classList.contains('abierto')) {
      solicitarWakeLock();
    }
  });

  window.ModoCocina = { abrir: abrir, cerrar: cerrar };
})();