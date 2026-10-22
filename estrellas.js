/* =================================================================
   ESTRELLAS.JS — Sistema de calificación con localStorage
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
  }

  containers.forEach(container => {
    const slug = container.dataset.slug;
    const stars = container.querySelectorAll('.rating-star');
    const text = container.querySelector('.rating-text');
    
    // Obtener la calificación previa del usuario (si existe)
    const calificaciones = getCalificaciones();
    let currentRating = calificaciones[slug] || 0;

    // Función para pintar las estrellas
    function renderStars(rating) {
      stars.forEach((star, idx) => {
        // Si el índice es menor a la calificación, se marca como activa
        star.classList.toggle('activa', idx < rating);
      });
      
      if (rating > 0) {
        text.textContent = 'Tu calificación: ' + rating + '/5';
        text.style.color = 'var(--dorado)';
      } else {
        text.textContent = 'Califica esta receta';
        text.style.color = 'var(--suave)';
      }
    }

    // Render inicial
    renderStars(currentRating);

    // Eventos del mouse (Hover) y Clic
    stars.forEach((star, index) => {
      // Al pasar el mouse, iluminar hasta la estrella actual
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, idx) => s.classList.toggle('hover', idx <= index));
      });
      
      // Al salir, quitar el efecto hover
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });
      
      // Al hacer clic, guardar
      star.addEventListener('click', () => {
        currentRating = index + 1;
        guardarCalificacion(slug, currentRating);
        renderStars(currentRating);
      });
    });
  });
});