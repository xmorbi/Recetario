/* =================================================================
   FAVORITOS.JS — Sistema de recetas guardadas + notas personales
   ================================================================= */
(function () {
  'use strict';

  const FAV_KEY = 'recetario_favoritos';
  const STORAGE_NOTAS = 'recetario_notas';

  // ---------- Persistencia: favoritos ----------
  function getFavoritos() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function setFavoritos(arr) {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(arr));
    } catch (e) {
      // Modo privado / almacenamiento lleno
    }
  }

  function toggleFavorito(slug) {
    let favs = getFavoritos();
    const estabaFavorito = favs.includes(slug);

    if (estabaFavorito) {
      favs = favs.filter((s) => s !== slug);
    } else {
      favs.push(slug);
    }
    setFavoritos(favs);
    actualizarBotones();

    const contenedorFavs = document.getElementById('contenedorFavoritos');
    if (contenedorFavs && estabaFavorito && !favs.includes(slug)) {
      renderizarMisRecetas(contenedorFavs);
    }

    return favs.includes(slug);
  }

  // ---------- Persistencia: notas ----------
  function getNotas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_NOTAS)) || {};
    } catch (e) {
      return {};
    }
  }

  function setNota(slug, texto) {
    if (!slug) return;
    const n = getNotas();
    if (texto.trim()) {
      n[slug] = texto;
    } else {
      delete n[slug];
    }
    try {
      localStorage.setItem(STORAGE_NOTAS, JSON.stringify(n));
    } catch (e) {}
  }

  // ---------- Estado visual de los botones de favorito ----------
  function actualizarBotones() {
    const favs = getFavoritos();
    document.querySelectorAll('.btn-favorito').forEach((btn) => {
      const slug = btn.dataset.slug;
      const isFav = favs.includes(slug);
      const estado = isFav ? '1' : '0';
      if (btn.dataset.fav === estado && btn.firstElementChild) return;
      btn.dataset.fav = estado;
      btn.classList.toggle('activo', isFav);
      btn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');

      if (isFav) {
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      } else {
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      }
    });
  }

  // ---------- Delegación de clics en favoritos ----------
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-favorito');
    if (!btn) return;
    e.preventDefault();
    const slug = btn.dataset.slug;
    if (slug) toggleFavorito(slug);
  });

  // ---------- Inyección de notas en cada tarjeta ----------
  function inyectarNotas(contenedor) {
    const notas = getNotas();
    contenedor.querySelectorAll('.receta-card').forEach(function (card) {
      if (card.querySelector('.notas-favorito')) return;

      const btnFav = card.querySelector('.btn-favorito');
      if (!btnFav) return;
      const slug = btnFav.dataset.slug;
      if (!slug) return;

      const notaActual = notas[slug] || '';

      const details = document.createElement('details');
      details.className = 'notas-favorito';
      if (notaActual) details.open = true;

      details.innerHTML =
        '<summary>' +
        '📝 Mis notas' +
        (notaActual ? '<span class="notas-punto" aria-hidden="true"></span>' : '') +
        '</summary>' +
        '<textarea class="notas-texto" data-slug="' +
        slug +
        '" ' +
        'placeholder="Ej: a mi familia le gusta con más comino. Duplicar para el domingo." ' +
        'aria-label="Notas personales para esta receta"></textarea>' +
        '<span class="notas-guardado" aria-live="polite">Guardado ✓</span>';

      const ta = details.querySelector('.notas-texto');
      ta.value = notaActual;
      card.appendChild(details);

      let timer = null;
      ta.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          setNota(slug, ta.value);
          mostrarGuardado(details);
          actualizarPuntoNota(details, ta.value);
        }, 400);
      });
    });
  }

  function mostrarGuardado(details) {
    const indicador = details.querySelector('.notas-guardado');
    if (!indicador) return;
    indicador.classList.add('visible');
    clearTimeout(indicador._timer);
    indicador._timer = setTimeout(function () {
      indicador.classList.remove('visible');
    }, 1500);
  }

  function actualizarPuntoNota(details, texto) {
    const summary = details.querySelector('summary');
    if (!summary) return;
    const tieneNota = texto.trim().length > 0;
    const punto = summary.querySelector('.notas-punto');
    if (tieneNota && !punto) {
      const span = document.createElement('span');
      span.className = 'notas-punto';
      span.setAttribute('aria-hidden', 'true');
      summary.appendChild(span);
    } else if (!tieneNota && punto) {
      punto.remove();
    }
  }

  // ---------- Render de "Mis recetas" ----------
  function renderizarMisRecetas(contenedor) {
    const favs = getFavoritos();

    // Si por alguna razón RECETAS no está cargado, abortamos silenciosamente.
    if (typeof RECETAS === 'undefined') return;

    const recetasFavs = RECETAS.filter((r) => favs.includes(r.slug || slugify(r.titulo)));

    if (recetasFavs.length === 0) {
      // FASE 3 (auditoría): URL limpia → /recetario/
      contenedor.innerHTML = `
        <div class="vacio" style="grid-column:1 / -1;">
          <svg class="vacio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          Aún no tienes recetas favoritas.<br>
          <a href="/recetario/" class="btn-limpiar" style="text-decoration:none; margin-top:1rem;">Explorar recetas</a>
        </div>`;
      return;
    }

    if (typeof window.crearTarjetaGlobal !== 'function') {
      setTimeout(function () {
        renderizarMisRecetas(contenedor);
      }, 100);
      return;
    }

    contenedor.innerHTML = recetasFavs.map((r, i) => window.crearTarjetaGlobal(r, i)).join('');

    inyectarNotas(contenedor);

    if (window.Favoritos) window.Favoritos.actualizar();
  }

  // ---------- Helper de slug ----------
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ---------- Inicialización ----------
  function initFavoritos() {
    actualizarBotones();

    const contenedorFavs = document.getElementById('contenedorFavoritos');
    if (contenedorFavs) {
      renderizarMisRecetas(contenedorFavs);
    }
  }

  document.addEventListener('recetas-listas', initFavoritos);

  document.addEventListener('DOMContentLoaded', function () {
    if (window.RECETAS && window.RECETAS.length > 0) {
      initFavoritos();
    }
  });

  // ---------- API pública ----------
  window.Favoritos = {
    obtener: getFavoritos,
    toggle: toggleFavorito,
    actualizar: actualizarBotones,
    obtenerNotas: getNotas,
    guardarNota: setNota,
  };
})();
