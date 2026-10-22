document.addEventListener('DOMContentLoaded', function() {
  const ingredienteSelect = document.getElementById('ingrediente');
  const personasInput = document.getElementById('personas');
  const resultadoDiv = document.getElementById('resultado');
  const notaDiv = document.getElementById('nota');

  // Datos de porciones por persona (en gramos)
  const porciones = {
    carne: { base: 380, unidad: 'g', nota: 'Para un asado con acompañamientos. Sube a 500g si es el plato principal.' },
    arroz: { base: 90, unidad: 'g', nota: 'Como plato principal. Para guarnición, usa 65g por persona.' },
    papa: { base: 250, unidad: 'g', nota: 'Para acompañamiento. Para un plato principal (ej. puré), usa 350g.' },
    pasta: { base: 90, unidad: 'g', nota: 'Porción estándar como plato principal.' }
  };

  function calcular() {
    const ingrediente = ingredienteSelect.value;
    const personas = parseInt(personasInput.value) || 1;
    const data = porciones[ingrediente];

    if (!data) return;

    const total = data.base * personas;

    // Formatear el resultado
    if (total >= 1000) {
      resultadoDiv.textContent = (total / 1000).toFixed(2) + ' kg';
    } else {
      resultadoDiv.textContent = total + ' ' + data.unidad;
    }
    
    notaDiv.textContent = data.nota;
  }

  ingredienteSelect.addEventListener('change', calcular);
  personasInput.addEventListener('input', calcular);
  
  // Calcular al cargar la página
  calcular();
});