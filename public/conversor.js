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

  // Singular / plural de las unidades de resultado
  const UNIDADES = {
    g:      { uno: 'g',     otros: 'g' },
    ml:     { uno: 'ml',    otros: 'ml' },
    kg:     { uno: 'kg',    otros: 'kg' },
    tazas:  { uno: 'taza',  otros: 'tazas' },
    libras: { uno: 'libra', otros: 'libras' }
  };

  // Paso de los botones + / −, se ajusta según el tipo de conversión
  let pasoActual = 1;

  // Redondea para evitar casos como "1.0 tazas" cuando el valor real es 0.96,
  // y quita los ceros sobrantes ("2.50" -> "2.5").
  function formatearNumero(valor) {
    if (!isFinite(valor) || valor === 0) return '0';
    const r = Math.abs(valor) < 1
      ? Math.round(valor * 100) / 100
      : Math.round(valor * 10) / 10;
    return String(r);
  }

  function calcular() {
    const tipo = tipoSelect.value;
    const cant = parseFloat(inputCantidad.value) || 0;

    // Mostrar u ocultar el selector de ingrediente.
    // El HTML ya llega con el estado inicial correcto (visible), así que al
    // cargar la página no hay ningún salto de layout.
    const necesitaIngrediente = (tipo === 'taza_a_gramos' || tipo === 'gramos_a_taza');
    groupIngrediente.hidden = !necesitaIngrediente;

    if (necesitaIngrediente) {
      labelCantidad.textContent = tipo === 'taza_a_gramos' ? 'Número de tazas' : 'Gramos a convertir';
    } else {
      labelCantidad.textContent = tipo === 'libra_a_kg' ? 'Número de libras' :
                                  tipo === 'kg_a_libra' ? 'Número de kilos' :
                                  tipo === 'cucharada_a_ml' ? 'Número de cucharadas' : 'Número de tazas';
    }

    // Ajustar el paso de los botones según el tipo
    pasoActual = 1;
    if (tipo === 'taza_a_gramos' || tipo === 'taza_a_ml') {
      pasoActual = 0.25;
    } else if (tipo === 'kg_a_libra' || tipo === 'libra_a_kg') {
      pasoActual = 0.5;
    }
    inputCantidad.step = pasoActual;

    let resultado = 0;
    let unidad = 'g';
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

    const texto = formatearNumero(resultado);
    const etiqueta = UNIDADES[unidad];
    const nombreUnidad = (texto === '1') ? etiqueta.uno : etiqueta.otros;

    resultadoDiv.textContent = texto + ' ' + nombreUnidad;
    notaDiv.textContent = nota;
  }

  // Eventos
  tipoSelect.addEventListener('change', calcular);
  ingredienteSelect.addEventListener('change', calcular);
  inputCantidad.addEventListener('input', calcular);

  // Al enfocar el campo, seleccionar todo el texto para poder escribir encima
  inputCantidad.addEventListener('focus', function() {
    inputCantidad.select();
  });

  btnMas.addEventListener('click', () => {
    let val = parseFloat(inputCantidad.value) || 0;
    inputCantidad.value = val + pasoActual;
    calcular();
  });

  btnMenos.addEventListener('click', () => {
    let val = parseFloat(inputCantidad.value) || 0;
    if (val - pasoActual >= 0) {
      inputCantidad.value = val - pasoActual;
      calcular();
    }
  });

  // Arranque inicial
  calcular();
});
