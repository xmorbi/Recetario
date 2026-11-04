/* =================================================================
   ESTRELLAS.JS — Sistema de calificación con localStorage
   FASE 2 (auditoría): estrellas convertidas a <button> para teclado.
   FASE 4B (deuda D5): aria-live="polite" movido al inicio del forEach
                       para que la PRIMERA calificación también se anuncie.
   ================================================================= */
document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.rating-container');
  if (!containers.length) return;

  const STORAGE_KEY = 'recetario_calificaciones';

  // Obtener todas las calificaciones guardadas
  function getCalificaciones() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  // Guardar una calificación
  function guardarCalificacion(slug, valor) {
    const cal = getCalificaciones();
    cal[slug] = valor;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
    } catch (e) {}
  }

  containers.forEach(container => {
    const slug = container.dataset.slug;
    const stars = container.querySelectorAll('.rating-star');
    const text = container.querySelector('.rating-text');
    if (!text || !stars.length) return;

    // FASE 4B (deuda D5): declaramos aria-live ANTES del primer render.
    // Antes se aplicaba recién en el primer click, así que:
    //   - al recargar con una calificación persistida, no se anunciaba nada;
    //   - la primera calificación tampoco se anunciaba (el atributo se
    //     añadía DESPUÉS de mutar el textContent, así que el screen reader
    //     ya había procesado el cambio sin la live region activa).
    // Con esto, la región viva está lista desde el primer paint.
    text.setAttribute('aria-live', 'polite');

    // Obtener la calificación previa del usuario (si existe)
    const calificaciones = getCalificaciones();
    let currentRating = calificaciones[slug] || 0;

    // Función para pintar las estrellas + aria-pressed
    function renderStars(rating) {
      stars.forEach((star, idx) => {
        const activa = idx < rating;
        star.classList.toggle('activa', activa);
        star.setAttribute('aria-pressed', activa ? 'true' : 'false');
      });

      if (rating > 0) {
        text.textContent = 'Tu calificación: ' + rating + '/5';
        text.style.color = 'var(--dorado)';
      } else {
        text.textContent = 'Califica esta receta';
        text.style.color = 'var(--suave)';
      }
    }

    // Helper para limpiar el estado hover visual
    function limpiarHover() {
      stars.forEach(s => s.classList.remove('hover'));
    }

    // Helper para pintar hover hasta el índice dado
    function pintarHover(index) {
      stars.forEach((s, idx) => s.classList.toggle('hover', idx <= index));
    }

    // Render inicial
    renderStars(currentRating);

    stars.forEach((star, index) => {
      // Mouse: hover visual
      star.addEventListener('mouseenter', () => pintarHover(index));
      star.addEventListener('mouseleave', limpiarHover);

      // Teclado: focus/blur replican el hover para feedback
      star.addEventListener('focus', () => pintarHover(index));
      star.addEventListener('blur', limpiarHover);

      // Click (también se dispara con Enter/Space nativo de <button>)
      star.addEventListener('click', () => {
        currentRating = index + 1;
        guardarCalificacion(slug, currentRating);
        renderStars(currentRating);
      });
    });
  });
});