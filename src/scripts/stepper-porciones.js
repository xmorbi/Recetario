/* =================================================================
   STEPPER DE PORCIONES — cliente
   -----------------------------------------------------------------
   Conecta el stepper de la página de receta con las funciones puras
   y probadas de src/lib/escalado.js. Ya NO reimplementamos parseo
   ni formateo de fracciones/rangos/prefijos: eso vive en la lib.

   Casos que el inline anterior rompía y que aquí quedan cubiertos
   gracias a escalarIngrediente():
     · "1 1/2 taza"     → se trata como 1.5 y se escala una sola vez
     · "4-5 papas"      → se escala cada extremo del rango
     · "Masa: 1 kilo"   → se escala el 1 y se pluraliza a "kilos"
   ================================================================= */

import { escalarIngrediente } from '../lib/escalado.js';

function initStepper() {
  const stepper = document.querySelector('.stepper-porciones');
  if (!stepper) return;

  const base = parseInt(stepper.dataset.base, 10) || 4;
  const input = stepper.querySelector('.stepper-valor');
  const btnMenos = stepper.querySelector('.stepper-menos');
  const btnMas = stepper.querySelector('.stepper-mas');
  if (!input) return;

  let current = parseInt(input.value, 10) || base;

  function aplicarEscala() {
    const ratio = current / base;
    document.querySelectorAll('.ing-texto[data-original]').forEach((span) => {
      const original = span.dataset.original;
      if (original == null) return;
      try {
        span.textContent = escalarIngrediente(original, ratio);
      } catch (err) {
        // Ante cualquier caso raro, dejamos el texto original intacto.
        span.textContent = original;
      }
    });
  }

  function setValor(v) {
    v = Math.max(1, Math.min(50, Math.round(v)));
    current = v;
    input.value = v;
    aplicarEscala();
  }

  if (btnMenos) btnMenos.addEventListener('click', () => setValor(current - 1));
  if (btnMas) btnMas.addEventListener('click', () => setValor(current + 1));
  input.addEventListener('change', () => {
    let v = parseInt(input.value, 10);
    if (isNaN(v)) v = base;
    setValor(v);
  });

  // Estado inicial. Con ratio = 1, escalarIngrediente devuelve el
  // original intacto, así que no hay parpadeo ni reescritura cosmética.
  setValor(current);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStepper);
} else {
  initStepper();
}
