/* =================================================================
   PRINT-RECETA.JS — Botón "Imprimir" para páginas individuales
   Añade este script a cada archivo recetas/*.html con:
     <script src="../print-receta.js"></script>
   (o "<script src="print-receta.js"></script>" si están en la raíz)
   ================================================================= */
(function () {
  'use strict';

  var recetaPage = document.querySelector('.receta-page');
  if (!recetaPage) return;

  // Evitar duplicados si se incluye dos veces
  if (recetaPage.querySelector('.btn-imprimir-receta')) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-imprimir btn-imprimir-receta';
  btn.setAttribute('aria-label', 'Imprimir esta receta');
  btn.innerHTML = '🖨️ Imprimir receta';

  btn.addEventListener('click', function () {
    window.print();
  });

  var primeraReceta = recetaPage.querySelector('.receta');
  if (primeraReceta) {
    recetaPage.insertBefore(btn, primeraReceta);
  } else {
    recetaPage.insertBefore(btn, recetaPage.firstChild);
  }
})();