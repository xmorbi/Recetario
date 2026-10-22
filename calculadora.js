document.addEventListener('DOMContentLoaded', function() {
  const ingredienteSelect = document.getElementById('ingrediente');
  const contextoRadios = document.querySelectorAll('input[name="contexto"]');
  const numAdultos = document.getElementById('num-adultos');
  const numNinos = document.getElementById('num-ninos');
  const btnMasAdultos = document.getElementById('mas-adultos');
  const btnMenosAdultos = document.getElementById('menos-adultos');
  const btnMasNinos = document.getElementById('mas-ninos');
  const btnMenosNinos = document.getElementById('menos-ninos');
  const resultadoDiv = document.getElementById('resultado');
  const notaDiv = document.getElementById('nota');
  const listaRecetasDiv = document.getElementById('lista-recetas');

  if (!ingredienteSelect) return;

  let adultos = 4;
  let ninos = 0;

  // --- RECETAS RECOMENDADAS (Enlaces internos) ---
  const recetasRecomendadas = {
    carne_asado: [
      { titulo: 'Empanadas de pino', url: 'recetas/empanadas-de-pino.html' },
      { titulo: 'Carne mechada', url: 'recetas/carne-mechada.html' }
    ],
    carne_guiso: [
      { titulo: 'Charquicán', url: 'recetas/charquican.html' },
      { titulo: 'Cazuela de vacuno', url: 'recetas/cazuela-de-vacuno.html' }
    ],
    pollo: [
      { titulo: 'Cazuela de ave', url: 'recetas/cazuela-de-ave.html' },
      { titulo: 'Pollo arvejado', url: 'recetas/pollo-arvejado.html' }
    ],
    cerdo: [
      { titulo: 'Cazuela de cerdo', url: 'recetas/cazuela-de-cerdo.html' }
    ],
    pescado: [
      { titulo: 'Paila marina', url: 'recetas/paila-marina.html' },
      { titulo: 'Pescado frito', url: 'recetas/pescado-frito.html' }
    ],
    harina: [
      { titulo: 'Pan amasado', url: 'recetas/pan-amasado.html' },
      { titulo: 'Marraqueta', url: 'recetas/marraqueta.html' },
      { titulo: 'Hallulla', url: 'recetas/hallulla.html' }
    ],
    pan: [
      { titulo: 'Pebre chileno', url: 'recetas/pebre-chileno.html' },
      { titulo: 'Salsa americana', url: 'recetas/salsa-americana.html' }
    ],
    pasta: [
      { titulo: 'Porotos con riendas', url: 'recetas/porotos-con-riendas.html' }
    ],
    arroz: [
      { titulo: 'Arroz con leche', url: 'recetas/arroz-con-leche.html' },
      { titulo: 'Tomaticán', url: 'recetas/tomatican.html' }
    ],
    papa: [
      { titulo: 'Chorrillana', url: 'recetas/chorrillana.html' },
      { titulo: 'Salchipapas', url: 'recetas/salchipapas.html' }
    ],
    legumbres: [
      { titulo: 'Porotos granados', url: 'recetas/porotos-granados.html' }
    ],
    choclo: [
      { titulo: 'Pastel de choclo', url: 'recetas/pastel-de-choclo.html' },
      { titulo: 'Humitas', url: 'recetas/humitas.html' }
    ],
    zapallo: [
      { titulo: 'Sopaipillas', url: 'recetas/sopaipillas.html' }
    ],
    tomate: [
      { titulo: 'Ensalada a la chilena', url: 'recetas/ensalada-a-la-chilena.html' },
      { titulo: 'Chancho en piedra', url: 'recetas/chancho-en-piedra.html' }
    ],
    carbon: [
      { titulo: 'Pollo asado', url: 'recetas/pollo-asado.html' },
      { titulo: 'Chorrillana', url: 'recetas/chorrillana.html' }
    ]
  };

  // --- PORCIONES (Gramos, Kilos o Unidades por adulto) ---
  const porciones = {
    carne_asado: { 
      principal: { adulto: 400, unidad: 'g', nota: 'Porción generosa para asado. Los niños comen la mitad.' },
      guarnicion: { adulto: 250, unidad: 'g', nota: 'Carne para acompañar.' }
    },
    carne_guiso: { 
      principal: { adulto: 250, unidad: 'g', nota: 'Carne en cubos para guisos.' },
      guarnicion: { adulto: 150, unidad: 'g', nota: 'Porción pequeña para guarnición.' }
    },
    pollo: { 
      principal: { adulto: 400, unidad: 'g', nota: 'Aprox. 1 trutro grande o 1 pechuga.' },
      guarnicion: { adulto: 250, unidad: 'g', nota: 'Aprox. 1 trutro pequeño.' }
    },
    cerdo: { 
      principal: { adulto: 350, unidad: 'g', nota: '2 chuletas o 1 trozo grande de pulpa.' },
      guarnicion: { adulto: 200, unidad: 'g', nota: '1 chuleta gruesa.' }
    },
    pescado: { 
      principal: { adulto: 250, unidad: 'g', nota: '1 filete grande.' },
      guarnicion: { adulto: 150, unidad: 'g', nota: '1 filete pequeño.' }
    },
    harina: {
      principal: { adulto: 200, unidad: 'g', nota: 'Para hacer pan o masas. Añade 100ml de agua por cada 200g.' },
      guarnicion: { adulto: 200, unidad: 'g', nota: 'Para hacer pan o masas.' } // En harina no cambia mucho el contexto
    },
    pan: { 
      principal: { adulto: 1, unidad: 'marraqueta', nota: 'Para once o sándwich.' },
      guarnicion: { adulto: 0.5, unidad: 'marraqueta', nota: 'Medio pan por persona.' }
    },
    pasta: { 
      principal: { adulto: 100, unidad: 'g', nota: 'Pasta cruda como plato principal.' },
      guarnicion: { adulto: 70, unidad: 'g', nota: 'Pasta cruda para ensalada.' }
    },
    arroz: { 
      principal: { adulto: 90, unidad: 'g', nota: 'Arroz crudo. Como plato fuerte.' },
      guarnicion: { adulto: 60, unidad: 'g', nota: 'Arroz crudo para acompañar.' }
    },
    papa: { 
      principal: { adulto: 350, unidad: 'g', nota: 'Papas crudas para puré.' },
      guarnicion: { adulto: 250, unidad: 'g', nota: 'Papas crudas como acompañamiento.' }
    },
    legumbres: { 
      principal: { adulto: 80, unidad: 'g', nota: 'Legumbres crudas. Se duplican al cocinar.' },
      guarnicion: { adulto: 50, unidad: 'g', nota: 'Porción pequeña de legumbres.' }
    },
    choclo: { 
      principal: { adulto: 2, unidad: 'choclos', nota: 'Choclos grandes para pastel.' },
      guarnicion: { adulto: 1, unidad: 'choclo', nota: '1 choclo por persona.' }
    },
    zapallo: { 
      principal: { adulto: 300, unidad: 'g', nota: 'Zapallo camote crudo.' },
      guarnicion: { adulto: 200, unidad: 'g', nota: 'Para acompañar guisos.' }
    },
    tomate: { 
      principal: { adulto: 2, unidad: 'tomates', nota: 'Tomates grandes para ensalada.' },
      guarnicion: { adulto: 1, unidad: 'tomate', nota: '1 tomate mediano.' }
    },
    carbon: {
      principal: { adulto: 400, unidad: 'g', nota: 'Regla 1:1 con la carne. Para asados de 1-2 horas.' },
      guarnicion: { adulto: 200, unidad: 'g', nota: 'Para asados rápidos o parrillas pequeñas.' }
    }
  };

  function obtenerContexto() {
    const seleccionado = Array.from(contextoRadios).find(r => r.checked);
    return seleccionado ? seleccionado.value : 'principal';
  }

  function calcular() {
    const ingrediente = ingredienteSelect.value;
    const contexto = obtenerContexto();
    const data = porciones[ingrediente][contexto];

    if (!data) return;

    const total = (adultos * data.adulto) + (ninos * (data.adulto * 0.5));

    // Formatear el resultado
    if (data.unidad === 'g' && total >= 1000) {
      resultadoDiv.textContent = (total / 1000).toFixed(2) + ' kg';
    } else if (data.unidad === 'g') {
      resultadoDiv.textContent = Math.round(total) + ' g';
    } else {
      // Para unidades (marraquetas, tomates, etc.)
      let valor = total % 1 === 0 ? total : total.toFixed(1);
      resultadoDiv.textContent = valor + ' ' + data.unidad;
    }
    
    let notaExtra = '';
    if (ninos > 0) notaExtra = ' (Calculado con porción de niño a la mitad).';
    notaDiv.textContent = data.nota + notaExtra;
  }

  function actualizarRecetas() {
    const ingrediente = ingredienteSelect.value;
    const recetas = recetasRecomendadas[ingrediente] || [];
    
    listaRecetasDiv.innerHTML = '';
    if (recetas.length === 0) {
      listaRecetasDiv.innerHTML = '<p style="color:var(--suave); font-size:0.9rem;">Pronto agregaremos recetas para este ingrediente.</p>';
      return;
    }

    recetas.forEach(r => {
      const a = document.createElement('a');
      a.href = r.url;
      a.textContent = r.titulo;
      listaRecetasDiv.appendChild(a);
    });
  }

  // Eventos
  btnMasAdultos.addEventListener('click', () => { adultos++; numAdultos.textContent = adultos; calcular(); });
  btnMenosAdultos.addEventListener('click', () => { if (adultos > 1) { adultos--; numAdultos.textContent = adultos; calcular(); } });
  btnMasNinos.addEventListener('click', () => { ninos++; numNinos.textContent = ninos; calcular(); });
  btnMenosNinos.addEventListener('click', () => { if (ninos > 0) { ninos--; numNinos.textContent = ninos; calcular(); } });

  ingredienteSelect.addEventListener('change', () => {
    calcular();
    actualizarRecetas(); 
  });
  
  contextoRadios.forEach(radio => radio.addEventListener('change', calcular));
  
  // Arranque inicial
  calcular();
  actualizarRecetas();
});