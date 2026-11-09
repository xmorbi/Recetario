/* =================================================================
   PRINT-MARCADOS.JS — Menú único "Imprimir" (FASE B)
   =================================================================
   Antes: creaba un botón "Imprimir marcados" aparte.
   Ahora: escucha los dos <button> del <details> nativo que vive en
   [slug].astro:
     [data-imprimir="todo"]      → window.print() directo
     [data-imprimir="marcados"]  → oculta <li> no marcados y luego print()

   Extras:
   - Cierra el menú al hacer clic fuera o con Escape.
   - Contador "X/Y" en la opción "Solo ingredientes marcados",
     visible solo si hay al menos 1 marcado.
   ================================================================= */
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var recetaPage = document.querySelector('.receta-page');
    if (!recetaPage) return;

    var ul = recetaPage.querySelector('.ingredientes');
    if (!ul) return;

    var menu = recetaPage.querySelector('.btn-imprimir-menu');
    if (!menu) return;

    var btnTodo = menu.querySelector('[data-imprimir="todo"]');
    var btnMarcados = menu.querySelector('[data-imprimir="marcados"]');
    var contador = menu.querySelector('.contador-marcados');

    /* ---------- Opción 1: imprimir toda la receta ---------- */
    if (btnTodo) {
      btnTodo.addEventListener('click', function () {
        cerrarMenu(menu);
        // pequeño delay para que el details se cierre antes de print
        setTimeout(function () {
          window.print();
        }, 60);
      });
    }

    /* ---------- Opción 2: imprimir solo marcados ---------- */
    if (btnMarcados) {
      btnMarcados.addEventListener('click', function () {
        var marcados = ul.querySelectorAll('input[type="checkbox"]:checked');

        if (marcados.length === 0) {
          cerrarMenu(menu);
          alert(
            'No has marcado ningún ingrediente.\n\nMarca con el checkbox los ingredientes que quieras incluir en la impresión.'
          );
          return;
        }

        // Ocultar los <li> sin checkbox marcado
        var ocultos = [];
        ul.querySelectorAll('li').forEach(function (li) {
          var chk = li.querySelector('input[type="checkbox"]');
          if (chk && !chk.checked) {
            li.classList.add('ingrediente-oculto');
            ocultos.push(li);
          }
        });

        cerrarMenu(menu);

        setTimeout(function () {
          window.print();
          // Restaurar después del diálogo de impresión
          setTimeout(function () {
            ocultos.forEach(function (li) {
              li.classList.remove('ingrediente-oculto');
            });
          }, 500);
        }, 60);
      });
    }

    /* ---------- Contador "X/Y" al abrir el menú ---------- */
    if (contador) {
      menu.addEventListener('toggle', function () {
        if (!menu.open) return;
        actualizarContador(ul, contador);
      });
    }

    /* ---------- Cerrar al hacer clic fuera ---------- */
    document.addEventListener('click', function (e) {
      if (!menu.open) return;
      if (!menu.contains(e.target)) {
        menu.removeAttribute('open');
      }
    });

    /* ---------- Cerrar con Escape ---------- */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.open) return;
      menu.removeAttribute('open');
      var summary = menu.querySelector('summary');
      if (summary) summary.focus();
    });
  }

  function cerrarMenu(menu) {
    if (menu && menu.open) menu.removeAttribute('open');
  }

  function actualizarContador(ul, contador) {
    var total = ul.querySelectorAll('input[type="checkbox"]').length;
    var marcados = ul.querySelectorAll('input[type="checkbox"]:checked').length;
    if (marcados === 0) {
      contador.hidden = true;
      contador.textContent = '';
    } else {
      contador.hidden = false;
      contador.textContent = '(' + marcados + '/' + total + ')';
    }
  }
})();
