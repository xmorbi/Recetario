document.addEventListener('DOMContentLoaded', function () {

  // 50% de la porción de adulto para niños.
  const FACTOR_NINO_DEFAULT = 0.5;

  // Plurales para unidades no-métricas
  const PLURALES = {
    presa: 'presas', trozo: 'trozos', unidad: 'unidades',
    diente: 'dientes', cucharada: 'cucharadas', cucharadita: 'cucharaditas',
    hoja: 'hojas', rama: 'ramas', rodaja: 'rodajas', pizca: 'pizcas',
    sobre: 'sobres', pan: 'panes'
  };

  // ============================================================
  // MODO INGREDIENTE
  // ============================================================
  const INGREDIENTES = {
    carne_asado:   { nombre: 'Carne para asado',  unidad: 'g',      principal: 400, guarnicion: 400, usaContexto: false, nota: 'Pierde ~25% al cocinar.' },
    carne_guiso:   { nombre: 'Carne para guiso',  unidad: 'g',      principal: 180, guarnicion: 120, usaContexto: true,  lblPrinc: 'Guiso',  lblGuarn: 'Salsa' },
    pollo:         { nombre: 'Pollo',             unidad: 'g',      principal: 300, guarnicion: 200, usaContexto: true,  nota: 'Equivale a ~1 presa por adulto.' },
    cerdo:         { nombre: 'Cerdo',             unidad: 'g',      principal: 300, guarnicion: 200, usaContexto: true },
    pescado:       { nombre: 'Pescado',           unidad: 'g',      principal: 200, guarnicion: 150, usaContexto: true },
    harina:        { nombre: 'Harina',            unidad: 'g',      principal: 200, guarnicion: 200, usaContexto: false, nota: 'Para pan: 200 g por persona.' },
    pan:           { nombre: 'Pan',               unidad: 'unidad', principal: 2,   guarnicion: 1,   usaContexto: false, nota: '2 panes = 1 marraqueta.' },
    pasta:         { nombre: 'Pasta',             unidad: 'g',      principal: 100, guarnicion: 80,  usaContexto: true },
    arroz:         { nombre: 'Arroz',             unidad: 'g',      principal: 90,  guarnicion: 60,  usaContexto: true },
    papa:          { nombre: 'Papa',              unidad: 'g',      principal: 350, guarnicion: 250, usaContexto: true,  lblPrinc: 'Puré',   lblGuarn: 'Cocidas' },
    legumbres:     { nombre: 'Legumbres',         unidad: 'g',      principal: 100, guarnicion: 80,  usaContexto: true },
    choclo:        { nombre: 'Choclo',            unidad: 'unidad', principal: 1,   guarnicion: 0.5, usaContexto: true,  nota: '1 choclo = 4 trozos (cazuela) o ~150 g desgranado.' },
    zapallo:       { nombre: 'Zapallo',           unidad: 'g',      principal: 200, guarnicion: 150, usaContexto: true },
    tomate:        { nombre: 'Tomate',            unidad: 'g',      principal: 150, guarnicion: 100, usaContexto: false },
    carbon:        { nombre: 'Carbón',            unidad: 'g',      principal: 400, guarnicion: 400, usaContexto: false, nota: 'Regla: 1 kg de carbón por 1 kg de carne.' }
  };

  const RECETAS_POR_INGREDIENTE = {
    carne_asado:  [{ slug: 'chorrillana', nombre: 'Chorrillana' }, { slug: 'bistec-a-lo-pobre', nombre: 'Bistec a lo pobre' }, { slug: 'carne-mechada', nombre: 'Carne mechada' }],
    carne_guiso:  [{ slug: 'cazuela-de-vacuno', nombre: 'Cazuela de vacuno' }, { slug: 'charquican', nombre: 'Charquicán' }, { slug: 'carbonada', nombre: 'Carbonada' }],
    pollo:        [{ slug: 'cazuela-de-ave', nombre: 'Cazuela de ave' }, { slug: 'pollo-arvejado', nombre: 'Pollo arvejado' }, { slug: 'pollo-al-jugo', nombre: 'Pollo al jugo' }, { slug: 'pollo-asado', nombre: 'Pollo asado' }],
    cerdo:        [{ slug: 'cazuela-de-cerdo', nombre: 'Cazuela de cerdo' }, { slug: 'prietas', nombre: 'Prietas' }],
    pescado:      [{ slug: 'pescado-frito', nombre: 'Pescado frito' }, { slug: 'corvina-al-horno', nombre: 'Corvina al horno' }, { slug: 'salmon-al-horno', nombre: 'Salmón al horno' }, { slug: 'caldillo-de-congrio', nombre: 'Caldillo de congrio' }],
    harina:       [{ slug: 'pan-amasado', nombre: 'Pan amasado' }, { slug: 'marraqueta', nombre: 'Marraqueta' }, { slug: 'empanadas-de-pino', nombre: 'Empanadas de pino' }, { slug: 'hallulla', nombre: 'Hallulla' }],
    pan:          [{ slug: 'pan-amasado', nombre: 'Pan amasado' }, { slug: 'marraqueta', nombre: 'Marraqueta' }, { slug: 'hallulla', nombre: 'Hallulla' }],
    pasta:        [{ slug: 'porotos-con-riendas', nombre: 'Porotos con riendas' }],
    arroz:        [{ slug: 'arroz-con-leche', nombre: 'Arroz con leche' }, { slug: 'cazuela-de-ave', nombre: 'Cazuela de ave' }],
    papa:         [{ slug: 'charquican', nombre: 'Charquicán' }, { slug: 'chorrillana', nombre: 'Chorrillana' }, { slug: 'bistec-a-lo-pobre', nombre: 'Bistec a lo pobre' }, { slug: 'pastel-de-choclo', nombre: 'Pastel de choclo' }],
    legumbres:    [{ slug: 'porotos-con-riendas', nombre: 'Porotos con riendas' }, { slug: 'porotos-granados', nombre: 'Porotos granados' }, { slug: 'porotos-con-mazamorra', nombre: 'Porotos con mazamorra' }],
    choclo:       [{ slug: 'pastel-de-choclo', nombre: 'Pastel de choclo' }, { slug: 'humitas', nombre: 'Humitas' }, { slug: 'porotos-granados', nombre: 'Porotos granados' }],
    zapallo:      [{ slug: 'charquican', nombre: 'Charquicán' }, { slug: 'sopaipillas', nombre: 'Sopaipillas' }],
    tomate:       [{ slug: 'ensalada-a-la-chilena', nombre: 'Ensalada a la chilena' }, { slug: 'chancho-en-piedra', nombre: 'Chancho en piedra' }],
    carbon:       [{ slug: 'pollo-asado', nombre: 'Pollo asado' }]
  };

  // ============================================================
  // HELPERS
  // ============================================================
  function redondear(cantidad, unidad) {
    if (unidad === 'g' || unidad === 'ml') return Math.round(cantidad);
    return Math.round(cantidad * 100) / 100;
  }

  function limpiarDecimales(texto) {
    return texto.replace(/0+$/, '').replace(/\.$/, '');
  }

  function formatearCantidad(cantidad, unidad) {
    const c = redondear(cantidad, unidad);
    if (unidad === 'g' && c >= 1000) return limpiarDecimales((c / 1000).toFixed(2)) + ' kg';
    if (unidad === 'ml' && c >= 1000) return limpiarDecimales((c / 1000).toFixed(2)) + ' L';
    const u = (c !== 1 && PLURALES[unidad]) ? PLURALES[unidad] : unidad;
    return `${c} ${u}`;
  }

  function getContexto() {
    const r = document.querySelector('input[name="contexto"]:checked');
    return r ? r.value : 'principal';
  }

  // ============================================================
  // REFERENCIAS DEL DOM — INGREDIENTE
  // ============================================================
  const ingSelect       = document.getElementById('ingrediente');
  const contextoGroup   = document.getElementById('contexto-group');
  const contextoLabel   = document.getElementById('contexto-label');
  const ctxPrincipalLbl = document.getElementById('contexto-principal-label');
  const ctxGuarnLbl     = document.getElementById('contexto-guarnicion-label');
  const numAdultos      = document.getElementById('num-adultos');
  const numNinos        = document.getElementById('num-ninos');
  const btnMasAdultos   = document.getElementById('mas-adultos');
  const btnMenosAdultos = document.getElementById('menos-adultos');
  const btnMasNinos     = document.getElementById('mas-ninos');
  const btnMenosNinos   = document.getElementById('menos-ninos');
  const opcionSobras    = document.getElementById('opcion-sobras');
  const resultadoDiv    = document.getElementById('resultado');
  const desgloseDiv     = document.getElementById('desglose');
  const notaDiv         = document.getElementById('nota');
  const resultadoLbl    = document.getElementById('resultado-label');
  const btnLista        = document.getElementById('btn-lista');
  const btnCompartir    = document.getElementById('btn-compartir');
  const btnReset        = document.getElementById('btn-reset');
  const listaRecetas    = document.getElementById('lista-recetas');

  let ultimoResultadoIngrediente = null;

  function renderRecetas(ingKey) {
    if (!listaRecetas) return;
    const recetas = RECETAS_POR_INGREDIENTE[ingKey] || [];
    listaRecetas.innerHTML = '';
    recetas.forEach(r => {
      const a = document.createElement('a');
      a.href = `recetas/${encodeURIComponent(r.slug)}.html`;
      a.className = 'receta-tag';
      a.textContent = r.nombre;
      listaRecetas.appendChild(a);
    });
    const bloque = document.getElementById('recetas-recomendadas');
    if (bloque) bloque.hidden = !recetas.length;
  }

  function calcularIngrediente() {
    if (!ingSelect) return;
    const key  = ingSelect.value;
    const info = INGREDIENTES[key];
    if (!info) return;

    if (info.usaContexto) {
      contextoGroup.hidden = false;
      contextoLabel.textContent = '¿Es el plato principal o un acompañamiento?';
      ctxPrincipalLbl.textContent = info.lblPrinc || 'Plato principal';
      ctxGuarnLbl.textContent     = info.lblGuarn || 'Acompañamiento';
    } else {
      contextoGroup.hidden = true;
    }

    const contexto = info.usaContexto ? getContexto() : 'principal';
    const porAdulto = contexto === 'guarnicion' ? info.guarnicion : info.principal;
    const porNino   = porAdulto * FACTOR_NINO_DEFAULT;

    const adultos = Math.min(999, Math.max(1, parseInt(numAdultos.value) || 1));
    const ninos   = Math.min(999, Math.max(0, parseInt(numNinos.value)   || 0));
    const factor  = opcionSobras.checked ? 1.1 : 1;

    const total = (porAdulto * adultos + porNino * ninos) * factor;

    resultadoDiv.textContent = formatearCantidad(total, info.unidad);
    const partes = [`${adultos} adulto${adultos > 1 ? 's' : ''} × ${formatearCantidad(porAdulto, info.unidad)}`];
    if (ninos) partes.push(`${ninos} niño${ninos > 1 ? 's' : ''} × ${formatearCantidad(porNino, info.unidad)}`);
    if (opcionSobras.checked) partes.push('+10% para sobras');
    desgloseDiv.textContent = partes.join(' · ');
    notaDiv.textContent = info.nota || '';

    ultimoResultadoIngrediente = {
      id: key, nombre: info.nombre, cantidad: redondear(total, info.unidad), unidad: info.unidad
    };
    renderRecetas(key);
  }

  function enlazarStepper(input, mas, menos, minimo) {
    mas?.addEventListener('click', () => { input.value = Math.min(999, (parseInt(input.value) || 0) + 1); calcularIngrediente(); });
    menos?.addEventListener('click', () => { input.value = Math.max(minimo, (parseInt(input.value) || 0) - 1); calcularIngrediente(); });
    input?.addEventListener('input', calcularIngrediente);
  }
  enlazarStepper(numAdultos, btnMasAdultos, btnMenosAdultos, 1);
  enlazarStepper(numNinos,   btnMasNinos,   btnMenosNinos,   0);

  ingSelect?.addEventListener('change', calcularIngrediente);
  opcionSobras?.addEventListener('change', calcularIngrediente);
  document.querySelectorAll('input[name="contexto"]').forEach(r => r.addEventListener('change', calcularIngrediente));

  btnLista?.addEventListener('click', () => {
    if (!ultimoResultadoIngrediente) return;
    if (typeof window.agregarItemLista !== 'function') { console.warn('lista-compras.js no expone agregarItemLista()'); return; }
    window.agregarItemLista(ultimoResultadoIngrediente);
  });

  btnCompartir?.addEventListener('click', async () => {
    if (!ultimoResultadoIngrediente) return;
    const texto = `${ultimoResultadoIngrediente.nombre}: ${formatearCantidad(ultimoResultadoIngrediente.cantidad, ultimoResultadoIngrediente.unidad)} — Recetario Chileno`;
    try {
      if (navigator.share) await navigator.share({ title: 'Calculadora de porciones', text: texto });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(texto); alert('Resultado copiado al portapapeles.'); }
    } catch (e) { /* cancelado */ }
  });

  btnReset?.addEventListener('click', () => {
    numAdultos.value = 4;
    numNinos.value = 0;
    opcionSobras.checked = false;
    document.querySelector('input[name="contexto"][value="principal"]').checked = true;
    ingSelect.selectedIndex = 0;
    calcularIngrediente();
  });

  // ============================================================
  // PESTAÑAS
  // ============================================================
  const tabs = document.querySelectorAll('.calc-tab');
  const paneles = {
    ingrediente: document.getElementById('panel-ingrediente'),
    plato: document.getElementById('panel-plato')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        const activo = t === tab;
        t.classList.toggle('activo', activo);
        t.setAttribute('aria-selected', activo ? 'true' : 'false');
      });
      Object.keys(paneles).forEach(k => {
        paneles[k].hidden = k !== tab.dataset.tab;
      });
      if (tab.dataset.tab === 'plato') calcularPlato();
    });
  });

  // ============================================================
  // MODO PLATO
  // ============================================================
  const platoSelect    = document.getElementById('plato-select');
  const platoAdultos   = document.getElementById('plato-adultos');
  const platoNinos     = document.getElementById('plato-ninos');
  const platoSobras    = document.getElementById('plato-sobras');
  const platoResult    = document.getElementById('plato-resultado');
  const platoNota      = document.getElementById('plato-nota');
  const platoBtnLista  = document.getElementById('plato-btn-lista');
  const platoBtnCompartir = document.getElementById('plato-btn-compartir'); // NUEVO
  const platoBtnReceta = document.getElementById('plato-btn-receta');

  let platoActual = null;

  function initPlatos() {
    if (!platoSelect) return;

    if (typeof PLATOS === 'undefined' || !Array.isArray(PLATOS) || PLATOS.length === 0) {
      console.error('[Calculadora] PLATOS no está definido. Revisa que platos-data.js exista y cargue ANTES que calculadora.js.');
      platoSelect.innerHTML = '<option value="">⚠️ Error: no se cargaron los platos (platos-data.js)</option>';
      return;
    }

    const grupos = {};
    PLATOS.forEach(p => {
      if (!grupos[p.categoria]) grupos[p.categoria] = [];
      grupos[p.categoria].push(p);
    });

    Object.keys(grupos).forEach(cat => {
      const og = document.createElement('optgroup');
      og.label = cat;
      grupos[cat].forEach(p => {
        const o = document.createElement('option');
        o.value = p.id;
        o.textContent = `${p.emoji || ''} ${p.nombre}`.trim();
        og.appendChild(o);
      });
      platoSelect.appendChild(og);
    });

    platoActual = PLATOS[0];
    platoSelect.value = platoActual.id;
    actualizarLinkReceta();
    calcularPlato();
  }

  function actualizarLinkReceta() {
    if (!platoBtnReceta) return;
    if (platoActual && platoActual.recetaSlug) {
      platoBtnReceta.href = `recetas/${encodeURIComponent(platoActual.recetaSlug)}.html`;
      platoBtnReceta.hidden = false;
    } else {
      platoBtnReceta.hidden = true;
    }
  }

  function calcularPlato() {
    if (!platoActual || !platoResult) return;

    const adultos = Math.min(999, Math.max(1, parseInt(platoAdultos.value) || 1));
    const ninos   = Math.min(999, Math.max(0, parseInt(platoNinos.value)   || 0));
    const factor  = platoSobras.checked ? 1.1 : 1;

    platoResult.innerHTML = '';

    platoActual.ingredientes.forEach(ing => {
      let cantidad;
      let unidad;

      if (ing.fijo) {
        cantidad = ing.fijo.cantidad;
        unidad   = ing.fijo.unidad;
      } else {
        const porNino = (ing.porNino != null) ? ing.porNino : (ing.porAdulto * FACTOR_NINO_DEFAULT);
        cantidad = (ing.porAdulto * adultos + porNino * ninos) * factor;
        unidad   = ing.unidad;
      }

      cantidad = redondear(cantidad, unidad);

      const li = document.createElement('li');
      li.className = 'plato-item';
      li.dataset.id       = ing.id;
      li.dataset.cantidad = cantidad;
      li.dataset.unidad   = unidad;

      const spanNombre = document.createElement('span');
      spanNombre.className = 'plato-item-nombre';
      spanNombre.innerHTML = ing.nombre;

      const spanCant = document.createElement('span');
      spanCant.className = 'plato-item-cantidad';
      spanCant.textContent = formatearCantidad(cantidad, unidad);

      li.appendChild(spanNombre);
      li.appendChild(spanCant);

      if (ing.nota) {
        const spanNota = document.createElement('span');
        spanNota.className = 'plato-item-nota';
        spanNota.innerHTML = ing.nota;
        li.appendChild(spanNota);
      }
      platoResult.appendChild(li);
    });

    platoNota.textContent =
      `Cálculo para ${adultos} adulto${adultos > 1 ? 's' : ''}` +
      (ninos ? ` y ${ninos} niño${ninos > 1 ? 's' : ''}` : '') +
      (platoSobras.checked ? ' · incluye +10% para sobras' : '');
  }

  platoSelect?.addEventListener('change', () => {
    platoActual = PLATOS.find(p => p.id === platoSelect.value) || PLATOS[0];
    actualizarLinkReceta();
    calcularPlato();
  });

  [platoAdultos, platoNinos, platoSobras].forEach(el => {
    el?.addEventListener('input', calcularPlato);
    el?.addEventListener('change', calcularPlato);
  });

  document.getElementById('plato-mas-adultos')?.addEventListener('click', () => {
    platoAdultos.value = Math.min(999, (parseInt(platoAdultos.value) || 0) + 1); calcularPlato();
  });
  document.getElementById('plato-menos-adultos')?.addEventListener('click', () => {
    platoAdultos.value = Math.max(1, (parseInt(platoAdultos.value) || 1) - 1); calcularPlato();
  });
  document.getElementById('plato-mas-ninos')?.addEventListener('click', () => {
    platoNinos.value = Math.min(999, (parseInt(platoNinos.value) || 0) + 1); calcularPlato();
  });
  document.getElementById('plato-menos-ninos')?.addEventListener('click', () => {
    platoNinos.value = Math.max(0, (parseInt(platoNinos.value) || 0) - 1); calcularPlato();
  });

  platoBtnLista?.addEventListener('click', () => {
    if (typeof window.agregarItemLista !== 'function') { console.warn('lista-compras.js no expone agregarItemLista()'); return; }
    document.querySelectorAll('#plato-resultado .plato-item').forEach(li => {
      window.agregarItemLista({
        id: li.dataset.id,
        nombre: li.querySelector('.plato-item-nombre').textContent,
        cantidad: parseFloat(li.dataset.cantidad),
        unidad: li.dataset.unidad
      });
    });
  });

  // ============================================================
  // NUEVA FUNCIÓN: Compartir desde "Por Plato"
  // ============================================================
  platoBtnCompartir?.addEventListener('click', async () => {
    if (!platoActual) return;

    const adultos = parseInt(platoAdultos.value) || 4;
    const ninos   = parseInt(platoNinos.value)   || 0;
    const factor  = platoSobras.checked ? ' (+10% sobras)' : '';

    let texto = `🍽️ Ingredientes para ${platoActual.nombre}\n`;
    texto += `Para ${adultos} adulto${adultos > 1 ? 's' : ''}`;
    if (ninos > 0) texto += ` y ${ninos} niño${ninos > 1 ? 's' : ''}`;
    texto += `${factor}\n\n`;

    // Leer los resultados ya calculados del DOM para evitar repetir la matemática
    document.querySelectorAll('#plato-resultado .plato-item').forEach(li => {
      const nombre = li.querySelector('.plato-item-nombre').textContent;
      const cantidad = li.querySelector('.plato-item-cantidad').textContent;
      texto += `• ${nombre}: ${cantidad}\n`;
    });

    texto += `\n— Recetario Chileno`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `Ingredientes para ${platoActual.nombre}`, text: texto });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        alert('¡Lista de ingredientes copiada al portapapeles!');
      } else {
        prompt('Copia este texto:', texto);
      }
    } catch (e) {
      // El usuario canceló el menú de compartir o hubo un error
    }
  });

  // ============================================================
  // ARRANQUE
  // ============================================================
  calcularIngrediente();
  try { initPlatos(); } catch (e) { console.error('[Calculadora] Error inicializando platos:', e); }
});