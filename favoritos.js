/* =================================================================
   FAVORITOS.JS — Sistema de recetas guardadas (localStorage)
   ================================================================= */
(function () {
  'use strict';

  const FAV_KEY = 'recetario_favoritos';

  // Obtener array de slugs guardados
  function getFavoritos() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  // Guardar array
  function setFavoritos(arr) {
    localStorage.setItem(FAV_KEY, JSON.stringify(arr));
  }

  // Alternar favorito
  function toggleFavorito(slug) {
    let favs = getFavoritos();
    if (favs.includes(slug)) {
      favs = favs.filter(s => s !== slug); // Quitar
    } else {
      favs.push(slug); // Agregar
    }
    setFavoritos(favs);
    actualizarBotones();
    return favs.includes(slug);
  }

  // Actualizar estado visual de todos los botones en pantalla
  function actualizarBotones() {
    const favs = getFavoritos();
    document.querySelectorAll('.btn-favorito').forEach(btn => {
      const slug = btn.dataset.slug;
      const isFav = favs.includes(slug);
      btn.classList.toggle('activo', isFav);
      btn.setAttribute('aria-label', isFav ? 'Quitar de favoritos' : 'Guardar en favoritos');
      
      // Cambiar el SVG (corazón vacío vs lleno)
      if (isFav) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      }
    });
  }

  // Escuchar clics en botones (delegación de eventos)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-favorito');
    if (!btn) return;
    e.preventDefault();
    const slug = btn.dataset.slug;
    if (slug) toggleFavorito(slug);
  });

  // Inicializar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    actualizarBotones();
    
    // Si estamos en la página "Mis Recetas", renderizar el listado
    const contenedorFavs = document.getElementById('contenedorFavoritos');
    if (contenedorFavs && typeof RECETAS !== 'undefined') {
      renderizarMisRecetas(contenedorFavs);
    }
  });

  function renderizarMisRecetas(contenedor) {
    const favs = getFavoritos();
    const recetasFavs = RECETAS.filter(r => favs.includes(slugify(r.titulo)));

    if (recetasFavs.length === 0) {
      contenedor.innerHTML = `
        <div class="vacio" style="grid-column:1 / -1;">
          <svg class="vacio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          Aún no tienes recetas favoritas.<br>
          <a href="recetario.html" class="btn-limpiar" style="text-decoration:none; margin-top:1rem;">Explorar recetas</a>
        </div>`;
      return;
    }

    // Reutilizamos la función crearTarjeta de app.js si existe, si no, creamos una básica
    if (typeof window.crearTarjetaGlobal === 'function') {
      contenedor.innerHTML = recetasFavs.map((r, i) => window.crearTarjetaGlobal(r, i)).join('');
    } else {
      // Fallback simple
      contenedor.innerHTML = recetasFavs.map(r => `
        <article class="receta">
          <h2><a href="recetas/${slugify(r.titulo)}.html">${r.titulo}</a></h2>
          <div class="receta-acciones" style="margin-top:1rem">
            <a href="recetas/${slugify(r.titulo)}.html" class="receta-cta">Ver receta completa →</a>
          </div>
        </article>
      `).join('');
    }
    
    // Volver a enlazar los botones para que muestren el corazón lleno
    if (window.Favoritos) window.Favoritos.actualizar();
  }

  // Función auxiliar para crear slugs (copia de la de app.js)
  function slugify(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Exponer API pública
  window.Favoritos = {
    obtener: getFavoritos,
    toggle: toggleFavorito,
    actualizar: actualizarBotones
  };
})();