import { extraerPorciones, formatearPorciones, escalarIngrediente } from '../lib/escalado.js';

/* =================================================================
   ESCALADOR.JS — Ajusta las cantidades de una receta
   =================================================================
   - Lee la receta desde #receta-data (JSON embebido por generar.html)
   - Detecta las porciones base desde receta.porciones
   - Ofrece multiplicadores rápidos: ½× · 1× · 1½× · 2× · 3×
   - El input personalizado pide PORCIONES FINALES (no factor)
   - Reescala el texto de cada ingrediente (respeta fracciones y decimales)
   - Actualiza #receta-data para que "Añadir todos" y "Modo cocina"
     usen las cantidades ajustadas
   - Restaura las cantidades originales si el usuario vuelve a 1×
   - Las funciones puras viven en ../lib/escalado.js (Fase 2)
   ================================================================= */
(function () {
  'use strict';

  // Esperar a que el DOM esté listo (por si el script no lleva defer)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Guard: evitar duplicados si el script se carga dos veces
    if (document.querySelector('.escalador')) return;

    var dataEl = document.getElementById('receta-data');
    if (!dataEl) return;

    var receta;
    try {
      receta = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    if (!receta || !Array.isArray(receta.ingredientes) || receta.ingredientes.length === 0) {
      return;
    }

    var ul = document.querySelector('.receta-page .ingredientes');
    if (!ul) return;

    // Guardar copia original para poder volver a 1×
    var dataOriginal = JSON.parse(JSON.stringify(receta));

    // Detectar porciones base
    var porciones = extraerPorciones(receta.porciones || '');
    if (!porciones) return;

    // Porciones base numéricas (ej: 6 personas)
    var baseNum = parseInt(porciones.min, 10) || 4;

    // Guardar los spans de ingredientes para manipular su texto
    var labels = Array.prototype.slice.call(ul.querySelectorAll('label span'));

    // Crear el panel (ahora recibe baseNum y la unidad)
    var panel = crearPanel(porciones, baseNum);

    // Insertar antes del <h3>Ingredientes</h3> (o antes de la <ul> si no hay h3)
    var prev = ul.previousElementSibling;
    if (prev && prev.tagName === 'H3') {
      prev.parentNode.insertBefore(panel, prev);
    } else {
      ul.parentNode.insertBefore(panel, ul);
    }

    // ---- Estado ----
    var factorActual = 1;

    // ---- Aplicar factor ----
    function aplicarFactor(factor) {
      if (factor === factorActual) return;
      factorActual = factor;

      // 1. Calcular nuevos textos de ingredientes
      var nuevos = dataOriginal.ingredientes.map(function (ing) {
        return escalarIngrediente(ing, factor);
      });

      // 2. Actualizar el DOM visible
      labels.forEach(function (span, i) {
        if (nuevos[i] != null) span.textContent = nuevos[i];
      });

      // 3. Actualizar #receta-data (para modo cocina + añadir todos)
      var nuevaData = JSON.parse(JSON.stringify(dataOriginal));
      nuevaData.ingredientes = nuevos;
      try {
        dataEl.textContent = JSON.stringify(nuevaData);
      } catch (e) {}

      // 4. Actualizar el resumen de porciones
      var nuevoSpan = panel.querySelector('.escalador-nuevo');
      if (nuevoSpan) {
        nuevoSpan.textContent = formatearPorciones(porciones, factor);
      }

      // 5. Actualizar el chip de porciones en el hero (si lo encontramos)
      actualizarChipHeroPorciones(porciones, factor);

      // 6. Anunciar accesiblemente
      var live = panel.querySelector('.escalador-live');
      if (live) {
        live.textContent = 'Cantidades ajustadas: ' + formatearPorciones(porciones, factor);
      }
    }

    // ---- Wiring: botones de factor ----
    panel.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-factor]');
      if (!btn) return;
      var factor = parseFloat(btn.dataset.factor);
      if (isNaN(factor)) return;

      panel.querySelectorAll('button[data-factor]').forEach(function (b) {
        b.classList.remove('activo');
      });
      btn.classList.add('activo');

      // Actualizar el input con las porciones calculadas
      var custom = panel.querySelector('.escalador-custom');
      if (custom) custom.value = Math.round(baseNum * factor);

      aplicarFactor(factor);
    });

    // ---- Wiring: input de porciones finales ----
    var customInput = panel.querySelector('.escalador-custom');
    if (customInput) {
      customInput.addEventListener('input', function () {
        var val = parseInt(customInput.value, 10);
        if (isNaN(val) || val <= 0) return;

        var f = val / baseNum;
        if (f <= 0 || f > 100) return; // Límite de seguridad

        // Desmarcar botones si el factor no coincide exactamente con un preset
        panel.querySelectorAll('button[data-factor]').forEach(function (b) {
          b.classList.remove('activo');
        });
        var preset = panel.querySelector('button[data-factor="' + f + '"]');
        if (preset) preset.classList.add('activo');

        aplicarFactor(f);
      });
    }
  }

  /* ============================================================
     CHIP DE PORCIONES EN EL HERO
     ============================================================ */
  function actualizarChipHeroPorciones(porciones, factor) {
    var chips = document.querySelectorAll('.hero-receta .meta span');
    if (!chips.length) return;

    for (var i = 0; i < chips.length; i++) {
      var chip = chips[i];
      var svg = chip.querySelector('svg.meta-icon');
      if (!svg) continue;
      // El path del icono de porciones empieza con "M5 2v6"
      if (svg.innerHTML.indexOf('M5 2v6') === -1) continue;

      // Encontrado: actualizar los nodos de texto (sin tocar el SVG)
      var nuevoTexto = formatearPorciones(porciones, factor);
      var textoSet = false;
      for (var j = 0; j < chip.childNodes.length; j++) {
        var n = chip.childNodes[j];
        if (n.nodeType === 3 && n.textContent.trim() !== '') {
          n.textContent = nuevoTexto;
          textoSet = true;
          break;
        }
      }
      if (!textoSet) {
        chip.appendChild(document.createTextNode(nuevoTexto));
      }
      return;
    }
  }

  /* ============================================================
     CREACIÓN DEL PANEL
     ============================================================ */
  function crearPanel(porciones, baseNum) {
    var panel = document.createElement('div');
    panel.className = 'escalador';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Ajustar cantidades de la receta');

    var factorLabel = porciones.max != null
      ? porciones.min + ' a ' + porciones.max
      : porciones.min;
    var unidadLabel = porciones.unidad ? ' ' + porciones.unidad : '';

    // Determinar el texto del label del input
    var unidadInput = porciones.unidad || 'porciones';
    // Si la unidad es plural (ej: personas), la usamos tal cual. Si es singular, la pluralizamos.
    if (unidadInput === 'persona') unidadInput = 'personas';
    else if (unidadInput === 'porción') unidadInput = 'porciones';
    else if (unidadInput === 'unidad') unidadInput = 'unidades';
    else if (unidadInput === 'vaso') unidadInput = 'vasos';
    else if (unidadInput === 'taza') unidadInput = 'tazas';
    else if (unidadInput === 'molde') unidadInput = 'moldes';

    panel.innerHTML =
      '<div class="escalador-cab">' +
        '<span class="escalador-titulo">Ajustar porciones</span>' +
        '<span class="escalador-resumen" aria-live="polite">' +
          'Receta original para <strong class="escalador-nuevo">' + factorLabel + unidadLabel + '</strong>' +
        '</span>' +
      '</div>' +
      '<div class="escalador-botones" role="group" aria-label="Multiplicador de cantidades">' +
        '<button type="button" data-factor="0.5" aria-label="Media receta">½×</button>' +
        '<button type="button" data-factor="1" class="activo" aria-label="Receta original">1×</button>' +
        '<button type="button" data-factor="1.5" aria-label="Receta y media">1½×</button>' +
        '<button type="button" data-factor="2" aria-label="Receta doble">2×</button>' +
        '<button type="button" data-factor="3" aria-label="Receta triple">3×</button>' +
        '<span class="escalador-o">o para</span>' +
        '<input type="number" class="escalador-custom" min="1" max="200" step="1" value="' + baseNum + '" inputmode="numeric" aria-label="Cantidad de porciones finales">' +
        '<span class="escalador-unidad-input">' + unidadInput + '</span>' +
      '</div>' +
      '<div class="escalador-live" aria-live="polite"></div>';

    return panel;
  }
})();