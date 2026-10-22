document.addEventListener('DOMContentLoaded', function() {
  const tipoSelect = document.getElementById('tipo-conversion');
  const groupIngrediente = document.getElementById('group-ingrediente');
  const ingredienteSelect = document.getElementById('ingrediente');
  const inputCantidad = document.getElementById('num-cantidad');
  const btnMas = document.getElementById('mas-cantidad');
  const btnMenos = document.getElementById('menos-cantidad');
  const resultadoDiv = document.getElementById('resultado');
  const notaDiv = document.getElementById('nota');
  const labelCantidad = document.getElementById('label-cantidad');

  if (!tipoSelect) return;

  // Densidades en gramos por taza (240ml)
  const densidades = {
    harina: 120,
    azucar: 200,
    arroz: 200,
    mantequilla: 225,
    agua: 240
  };

  function calcular() {
    const tipo = tipoSelect.value;
    const cant = parseFloat(inputCantidad.value) || 0;
    
    // Mostrar u ocultar el selector de ingrediente
    if (tipo === 'taza_a_gramos' || tipo === 'gramos_a_taza') {
      groupIngrediente.style.display = 'block';
      labelCantidad.textContent = tipo === 'taza_a_gramos' ? 'Número de tazas' : 'Gramos a convertir';
    } else {
      groupIngrediente.style.display = 'none';
      labelCantidad.textContent = tipo === 'libra_a_kg' ? 'Número de libras' : 
                                  tipo === 'kg_a_libra' ? 'Número de kilos' :
                                  tipo === 'cucharada_a_ml' ? 'Número de cucharadas' : 'Número de tazas';
    }

    let resultado = 0;
    let unidad = '';
    let nota = '';

    const ing = ingredienteSelect.value;

    switch (tipo) {
      case 'taza_a_gramos':
        resultado = cant * densidades[ing];
        unidad = 'g';
        nota = 'Equivalencia basada en 1 taza estándar de 240ml.';
        break;
      case 'gramos_a_taza':
        resultado = cant / densidades[ing];
        unidad = 'tazas';
        nota = 'Equivalencia basada en 1 taza estándar de 240ml.';
        break;
      case 'libra_a_kg':
        resultado = cant * 0.453592;
        unidad = 'kg';
        nota = '1 libra equivale a 453 gramos.';
        break;
      case 'kg_a_libra':
        resultado = cant / 0.453592;
        unidad = 'libras';
        nota = '1 kilo equivale a 2.2 libras.';
        break;
      case 'cucharada_a_ml':
        resultado = cant * 15;
        unidad = 'ml';
        nota = '1 cucharada sopera estándar.';
        break;
      case 'taza_a_ml':
        resultado = cant * 240;
        unidad = 'ml';
        nota = '1 taza estándar de líquido.';
        break;
    }

    // Formatear el resultado
    if (resultado < 0.1 && resultado > 0) {
      resultadoDiv.textContent = resultado.toFixed(2) + ' ' + unidad;
    } else if (resultado % 1 !== 0) {
      resultadoDiv.textContent = resultado.toFixed(1) + ' ' + unidad;
    } else {
      resultadoDiv.textContent = Math.round(resultado) + ' ' + unidad;
    }

    notaDiv.textContent = nota;
  }

  // Eventos
  tipoSelect.addEventListener('change', calcular);
  ingredienteSelect.addEventListener('change', calcular);
  inputCantidad.addEventListener('input', calcular);

  btnMas.addEventListener('click', () => {
    let val = parseFloat(inputCantidad.value) || 0;
    inputCantidad.value = val + 0.5;
    calcular();
  });

  btnMenos.addEventListener('click', () => {
    let val = parseFloat(inputCantidad.value) || 0;
    if (val > 0.5) {
      inputCantidad.value = val - 0.5;
      calcular();
    }
  });

  // Arranque inicial
  calcular();
});