// FASE 5C — Tabs Ingredientes / Preparación.
// Solo actúa en móvil (≤720px). En desktop el CSS fuerza ambas columnas.
// Cambia el atributo data-vista en .cuerpo y el aria-selected de las tabs.
// No desmonta el DOM → los checkboxes de ingredientes conservan su estado.
(function () {
  'use strict';

  var cuerpo = document.getElementById('recetaCuerpo');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.receta-tabs > button'));
  if (!cuerpo || tabs.length === 0) return;

  function setVista(vista) {
    cuerpo.setAttribute('data-vista', vista);
    tabs.forEach(function (t) {
      var activa = t.getAttribute('data-tab') === vista;
      t.setAttribute('aria-selected', activa ? 'true' : 'false');
    });
  }

  // En móvil, arrancar en "ingredientes" (ahorra scroll).
  // En desktop, dejar "todo" (el CSS igual muestra ambas columnas).
  if (window.matchMedia('(max-width: 720px)').matches) {
    setVista('ingredientes');
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      setVista(t.getAttribute('data-tab'));
    });
  });

  // Si el usuario rota a desktop, el CSS ya muestra ambas.
  // Si vuelve a móvil, respetar la última selección (ya está en data-vista).
})();