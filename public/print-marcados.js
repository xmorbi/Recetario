/* =================================================================
   PRINT-MARCADOS.JS — Imprime solo los ingredientes marcados
   =================================================================
   Añade un botón "Imprimir solo lo marcado" junto al botón de
   imprimir existente. Oculta los ingredientes no marcados durante
   la impresión, sin modificar el HTML original.
   ================================================================= */
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (document.querySelector('.btn-imprimir-marcados')) return;

    var recetaPage = document.querySelector('.receta-page');
    if (!recetaPage) return;

    var ul = recetaPage.querySelector('.ingredientes');
    if (!ul) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-imprimir btn-imprimir-marcados';
    btn.setAttribute('aria-label', 'Imprimir solo los ingredientes marcados');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="20 6 9 17 4 12"/>' +
      '</svg>' +
      '<span>Imprimir marcados</span>';

    btn.addEventListener('click', function () {
      var marcados = ul.querySelectorAll('input[type="checkbox"]:checked');
      if (marcados.length === 0) {
        alert('No has marcado ningún ingrediente.\n\nMarca con el checkbox los ingredientes que quieras incluir en la impresión.');
        return;
      }

      // Ocultar los <li> sin checkbox marcado (a nivel DOM, no con :has)
      var ocultos = [];
      ul.querySelectorAll('li').forEach(function (li) {
        var chk = li.querySelector('input[type="checkbox"]');
        if (chk && !chk.checked) {
          li.classList.add('ingrediente-oculto');
          ocultos.push(li);
        }
      });

      window.print();

      // Restaurar después del diálogo de impresión
      setTimeout(function () {
        ocultos.forEach(function (li) { li.classList.remove('ingrediente-oculto'); });
      }, 500);
    });

    // Insertar junto a los otros botones de acción (imprimir + modo cocina)
    var acciones = recetaPage.querySelector('.receta-acciones-top');
    if (acciones) {
      acciones.appendChild(btn);
    } else {
      var primeraReceta = recetaPage.querySelector('.receta');
      if (primeraReceta) primeraReceta.parentNode.insertBefore(btn, primeraReceta);
    }
  }
})();