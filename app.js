/* =================================================================
   APP.JS — Motor del recetario con Schema.org y SEO
   ================================================================= */

(function () {
  'use strict';

  const SITE_CONFIG = {
    nombre: 'Recetario Chileno',
    urlBase: 'https://recetariochileno.netlify.app',
    autor: 'Recetario Chileno',
    imagenDefault: 'img/og-default.jpg',
    fechaPublicacion: '2025-01-15'
  };

  /* ---------- ICONOS (SVG inline, bold) ---------- */
  var ICONS = {
    clock: '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    porciones: '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2v6a3 3 0 0 0 6 0V2"/><path d="M8 11v11"/><path d="M20 2c-2 3-3 6-3 9h3v11"/></svg>',
    dificultad: '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    tecnica: '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    imprimir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    chef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>',
    corazon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
  };

  /* ---------- Nav toggle (todas las páginas) ---------- */
  (function initNavToggle() {
    var toggle = document.querySelector('.site-nav-toggle');
    var links  = document.querySelector('.site-nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('abierto');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ---------- Utilidades ---------- */
  function quitarAcentos(str) {
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function buildRegex(termino) {
    const norm = quitarAcentos(termino);
    let pattern = '';
    for (let i = 0; i < norm.length; i++) {
      const ch = norm[i];
      const lc = ch.toLowerCase();
      if (lc === 'a') pattern += '[aáàäâãAÁÀÄÂÃ]';
      else if (lc === 'e') pattern += '[eéèëêEÉÈËÊ]';
      else if (lc === 'i') pattern += '[iíìïîIÍÌÏÎ]';
      else if (lc === 'o') pattern += '[oóòöôõOÓÒÖÔÕ]';
      else if (lc === 'u') pattern += '[uúùüûUÚÙÜÛ]';
      else if (lc === 'n') pattern += '[nñNÑ]';
      else if (/[.*+?^${}()|[\]\\]/.test(ch)) pattern += '\\' + ch;
      else pattern += ch;
    }
    return pattern ? new RegExp(pattern, 'gi') : null;
  }
  function escaparHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }
  function escaparAtributo(s) {
    return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function parseTiempo(texto) {
    if (!texto) return 'PT60M';
    const t = String(texto).toLowerCase();
    let horas = 0, minutos = 0;
    const hMatch = t.match(/(\d+)\s*h/);
    const mMatch = t.match(/(\d+)\s*min/);
    if (hMatch) horas = parseInt(hMatch[1], 10);
    if (mMatch) minutos = parseInt(mMatch[1], 10);
    if (horas === 0 && minutos === 0) return 'PT60M';
    let iso = 'PT';
    if (horas > 0) iso += horas + 'H';
    if (minutos > 0) iso += minutos + 'M';
    return iso;
  }
  function slugify(text) {
    return String(text).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function mapearCategoria(cat) {
    const mapa = {
      'principales': 'Plato principal',
      'sopas': 'Sopa',
      'panes': 'Pan',
      'ensaladas': 'Ensalada',
      'dulces': 'Postre'
    };
    return mapa[cat] || 'Plato principal';
  }
  function imagenAbsoluta(ruta) {
    if (!ruta) return SITE_CONFIG.urlBase + '/' + SITE_CONFIG.imagenDefault;
    if (/^https?:\/\//.test(ruta)) return ruta;
    return SITE_CONFIG.urlBase + '/' + ruta.replace(/^\//, '');
  }

  /* ---------- Schema.org ---------- */
  function inyectarSchemaReceta(receta) {
    const rutaImagen = receta.imagen && receta.imagen.trim() !== ''
      ? receta.imagen
      : SITE_CONFIG.imagenDefault;

    const schema = {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": receta.titulo,
      "image": [imagenAbsoluta(rutaImagen)],
      "author": { "@type": "Organization", "name": SITE_CONFIG.autor },
      "publisher": { "@type": "Organization", "name": SITE_CONFIG.nombre },
      "datePublished": SITE_CONFIG.fechaPublicacion,
      "description": "Receta tradicional chilena de " + receta.titulo +
                     (receta.dato ? '. ' + receta.dato : '.'),
      "recipeCuisine": "Chilena",
      "recipeCategory": mapearCategoria(receta.categoria),
      "keywords": (receta.tags || []).join(', '),
      "totalTime": parseTiempo(receta.tiempo),
      "recipeYield": receta.porciones || "4 porciones",
      "recipeIngredient": receta.ingredientes || [],
      "recipeInstructions": (receta.pasos || []).map(function (paso, i) {
        return { "@type": "HowToStep", "position": i + 1, "text": paso };
      })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  function inyectarSchemaSitio() {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": SITE_CONFIG.nombre,
      "url": SITE_CONFIG.urlBase,
      "inLanguage": "es-CL",
      "description": "Recetario chileno con las mejores recetas tradicionales explicadas paso a paso."
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /* ---------- Receta destacada (portada) ---------- */
  function renderizarDestacada() {
    var cont = document.getElementById('recetaDestacada');
    if (!cont) return;
    if (typeof RECETAS === 'undefined' || !Array.isArray(RECETAS) || RECETAS.length === 0) return;

    var dia = Math.floor(Date.now() / 86400000);
    var indice = dia % RECETAS.length;
    var r = RECETAS[indice];
    var slug = slugify(r.titulo);
    var img = r.imagen && r.imagen.trim() !== '' ? r.imagen : '';

    var chips = [];
    if (r.tiempo)     chips.push('<span>' + ICONS.clock + escaparHtml(r.tiempo) + '</span>');
    if (r.porciones)  chips.push('<span>' + ICONS.porciones + escaparHtml(r.porciones) + '</span>');
    if (r.dificultad) chips.push('<span>' + ICONS.dificultad + 'Dificultad: ' + escaparHtml(r.dificultad) + '</span>');

    var mediaHTML;
    if (img) {
      mediaHTML = '<div class="receta-destacada-media"><img src="' + escaparAtributo(img) + '" alt="' + escaparAtributo(r.titulo) + '" loading="lazy"></div>';
    } else {
      mediaHTML = '<div class="receta-destacada-media"><div class="sin-foto">' + escaparHtml(r.titulo) + '</div></div>';
    }

    var descripcion = r.dato ? escaparHtml(r.dato) : 'Una receta tradicional chilena explicada paso a paso.';

    cont.innerHTML =
      '<p class="receta-destacada-eyebrow">Receta destacada del día</p>' +
      '<a class="receta-destacada" href="recetas/' + slug + '.html">' +
        mediaHTML +
        '<div class="receta-destacada-body">' +
          '<span class="receta-destacada-tag">' + ICONS.chef + 'Para hoy</span>' +
          '<h2>' + escaparHtml(r.titulo) + '</h2>' +
          '<p>' + descripcion + '</p>' +
          '<div class="meta">' + chips.join('') + '</div>' +
          '<span class="receta-destacada-cta">Ver receta completa →</span>' +
        '</div>' +
      '</a>';
  }

  /* ---------- Constructor de tarjetas ---------- */
  function crearTarjeta(receta, indice) {
    const id = 'receta-' + indice;
    const slug = slugify(receta.titulo);
    const tagsStr = (receta.tags || []).join(' ');

    let bloqueImagen = '';
    if (receta.imagen && receta.imagen.trim() !== '') {
      bloqueImagen =
        '<img class="receta-img" src="' + escaparAtributo(receta.imagen) + '" ' +
        'alt="' + escaparAtributo(receta.titulo) + ' - Receta chilena" ' +
        'loading="lazy" ' +
        'onerror="this.style.display=\'none\';this.insertAdjacentHTML(\'afterend\',\'<div class=&quot;receta-img-error&quot;>Foto no encontrada: ' +
        escaparAtributo(receta.imagen) + '</div>\')">';
    }

    const chips = [];
    if (receta.tiempo)     chips.push('<span>' + ICONS.clock + escaparHtml(receta.tiempo) + '</span>');
    if (receta.porciones)  chips.push('<span>' + ICONS.porciones + escaparHtml(receta.porciones) + '</span>');
    if (receta.dificultad) chips.push('<span>' + ICONS.dificultad + 'Dificultad: ' + escaparHtml(receta.dificultad) + '</span>');
    if (receta.tecnica)    chips.push('<span>' + ICONS.tecnica + escaparHtml(receta.tecnica) + '</span>');

    const ingredientesHTML = (receta.ingredientes || []).map(function (ing) {
      return '<li><label><input type="checkbox"><span>' + escaparHtml(ing) + '</span></label></li>';
    }).join('');

    const pasosHTML = (receta.pasos || []).map(function (paso) {
      return '<li>' + escaparHtml(paso) + '</li>';
    }).join('');

    const datoHTML = receta.dato
      ? '<p class="dato"><strong>Dato:</strong> ' + escaparHtml(receta.dato) + '</p>'
      : '';

    const tituloIngredientes = receta.tituloIngredientes || 'Ingredientes';

    return '' +
      '<article class="receta" data-cat="' + escaparAtributo(receta.categoria || 'principales') + '" data-tags="' + escaparAtributo(tagsStr) + '" id="' + id + '">' +
        bloqueImagen +
        '<h2><a href="recetas/' + slug + '.html">' + escaparHtml(receta.titulo) + '</a></h2>' +
        '<div class="meta">' + chips.join('') + '</div>' +
        '<div class="cuerpo">' +
          '<div>' +
            '<h3>' + escaparHtml(tituloIngredientes) + '</h3>' +
            '<ul class="ingredientes">' + ingredientesHTML + '</ul>' +
          '</div>' +
          '<div>' +
            '<h3>Preparación</h3>' +
            '<ol class="preparacion">' + pasosHTML + '</ol>' +
            datoHTML +
          '</div>' +
        '</div>' +
        '<div class="receta-acciones">' +
          '<a class="receta-cta" href="recetas/' + slug + '.html">Ver página completa →</a>' +
          '<button type="button" class="btn-modo-cocina" data-index="' + indice + '" aria-label="Abrir modo cocina">' + ICONS.chef + '<span>Modo cocina</span></button>' +
          '<button type="button" class="btn-imprimir" aria-label="Imprimir esta receta">' + ICONS.imprimir + '<span>Imprimir</span></button>' +
          '<button type="button" class="btn-favorito" data-slug="' + slug + '" aria-label="Guardar en favoritos">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  /* ---------- Renderizar listado ---------- */
  function renderizar() {
    const html = RECETAS.map(crearTarjeta).join('');
    contenedor.innerHTML = html;
    tarjetas = Array.from(contenedor.querySelectorAll('.receta'));

    RECETAS.forEach(function (receta) {
      inyectarSchemaReceta(receta);
    });

    inyectarSchemaSitio();
    
    // Inicializar estado visual de los botones de favoritos
    if (window.Favoritos) window.Favoritos.actualizar();
  }

  /* ---------- Imprimir ---------- */
  function imprimirTarjeta(tarjeta) {
    document.querySelectorAll('.receta').forEach(function (t) {
      t.classList.remove('imprimir-esta');
    });
    tarjeta.classList.add('imprimir-esta');
    document.body.classList.add('modo-impresion');

    var limpiar = function () {
      document.body.classList.remove('modo-impresion');
      tarjeta.classList.remove('imprimir-esta');
      window.removeEventListener('afterprint', limpiar);
    };
    window.addEventListener('afterprint', limpiar);
    window.print();
    setTimeout(limpiar, 2000);
  }

  /* ---------- Resaltado ---------- */
  function limpiarResaltados(root) {
    root.querySelectorAll('mark').forEach(function (m) {
      const padre = m.parentNode;
      padre.replaceChild(document.createTextNode(m.textContent), m);
      padre.normalize();
    });
  }
  function resaltar(root, regex) {
    if (!regex) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (nodo) {
        if (!nodo.nodeValue || !nodo.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (nodo.parentNode.nodeName === 'MARK') return NodeFilter.FILTER_REJECT;
        if (nodo.parentNode.nodeName === 'INPUT') return NodeFilter.FILTER_REJECT;
        if (nodo.parentNode.nodeName === 'SCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodos = [];
    while (walker.nextNode()) nodos.push(walker.currentNode);
    nodos.forEach(function (nodo) {
      regex.lastIndex = 0;
      if (!regex.test(nodo.nodeValue)) return;
      regex.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let ultimo = 0, m;
      while ((m = regex.exec(nodo.nodeValue)) !== null) {
        frag.appendChild(document.createTextNode(nodo.nodeValue.slice(ultimo, m.index)));
        const mark = document.createElement('mark');
        mark.textContent = m[0];
        frag.appendChild(mark);
        ultimo = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(nodo.nodeValue.slice(ultimo)));
      nodo.parentNode.replaceChild(frag, nodo);
    });
  }

  /* ---------- Filtrado + feedback ---------- */
  let ingredientesDespensa = []; // Estado de la despensa

  function aplicarFiltros() {
    let visibles = 0;
    const normBusqueda = quitarAcentos(textoBusqueda).toLowerCase();
    const regexResaltado = textoBusqueda ? buildRegex(textoBusqueda) : null;

    // 1. Calcular estado y puntuación de cada tarjeta
    const estadoTarjetas = tarjetas.map(tarjeta => {
      limpiarResaltados(tarjeta);

      const coincideCat = categoriaActiva === 'todas' || tarjeta.dataset.cat === categoriaActiva;
      const textoCompleto = tarjeta.textContent + ' ' + (tarjeta.dataset.tags || '');
      const textoLimpio = quitarAcentos(textoCompleto).toLowerCase();
      
      const coincideTxt = !normBusqueda || textoLimpio.indexOf(normBusqueda) !== -1;
      
      // Lógica de relevancia de despensa (Puntuación)
      let scoreDespensa = 0;
      if (ingredientesDespensa.length > 0) {
        ingredientesDespensa.forEach(ing => {
          if (textoLimpio.indexOf(quitarAcentos(ing).toLowerCase()) !== -1) {
            scoreDespensa++;
          }
        });
      }

      // Si hay ingredientes seleccionados, la receta debe tener al menos 1
      const coincideDespensa = ingredientesDespensa.length === 0 || scoreDespensa > 0;

      return {
        tarjeta,
        mostrar: coincideCat && coincideTxt && coincideDespensa,
        scoreDespensa
      };
    });

    // 2. Filtrar las que se van a mostrar
    const visiblesArr = estadoTarjetas.filter(e => e.mostrar);
    visibles = visiblesArr.length;

    // 3. Ordenar
    if (ingredientesDespensa.length > 0) {
      // Ordenar por puntuación de mayor a menor (más ingredientes de la despensa = más arriba)
      visiblesArr.sort((a, b) => b.scoreDespensa - a.scoreDespensa);
    } else {
      // Si no hay filtro de despensa, mantener el orden original
      visiblesArr.sort((a, b) => tarjetas.indexOf(a.tarjeta) - tarjetas.indexOf(b.tarjeta));
    }

    // 4. Ocultar todas y mostrar las visibles en orden
    tarjetas.forEach(t => t.hidden = true);
    
    visiblesArr.forEach(e => {
      e.tarjeta.hidden = false;
      if (regexResaltado) resaltar(e.tarjeta, regexResaltado);
      e.tarjeta.classList.remove('aparecer');
      void e.tarjeta.offsetWidth;
      e.tarjeta.classList.add('aparecer');
      
      // Mover al final del contenedor (esto reordena el DOM)
      contenedor.appendChild(e.tarjeta);
    });

    // Mover las tarjetas ocultas al final para no interrumpir el orden visual
    tarjetas.forEach(t => {
      if (t.hidden) contenedor.appendChild(t);
    });

    // 5. Actualizar UI
    if (vacio) vacio.hidden = visibles !== 0;

    if (contador) {
      contador.innerHTML = '';
      const chip = document.createElement('span');
      chip.className = 'chip';
      
      let textoChip = '';
      if (textoBusqueda) textoChip += 'Buscando <strong>«' + escaparHtml(textoBusqueda) + '»</strong> · ';
      if (ingredientesDespensa.length > 0) textoChip += 'Filtro despensa (' + ingredientesDespensa.length + ') · ';
      
      textoChip += '<strong>' + visibles + '</strong> ' + (visibles === 1 ? 'receta' : 'recetas');
      if (categoriaActiva !== 'todas' && !textoBusqueda && ingredientesDespensa.length === 0) {
        textoChip += ' en esta categoría';
      } else if (!textoBusqueda && ingredientesDespensa.length === 0) {
        textoChip += ' en total';
      }
      
      chip.innerHTML = textoChip;
      contador.appendChild(chip);
      contador.classList.remove('flash');
      void contador.offsetWidth;
      contador.classList.add('flash');
    }

    if (limpiarBtn && buscador) {
      limpiarBtn.hidden = buscador.value.length === 0;
      buscador.classList.toggle('con-texto', buscador.value.length > 0);
    }
  }

  function resetear() {
    if (buscador) buscador.value = '';
    textoBusqueda = '';
    categoriaActiva = 'todas';
    ingredientesDespensa = [];
    document.querySelectorAll('.chip-despensa').forEach(c => c.classList.remove('activo'));
    botones.forEach(function (b) {
      b.classList.toggle('activo', b.dataset.cat === 'todas');
    });
    aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =====================================================
     VERIFICACIÓN DE DATOS
     ===================================================== */
  if (typeof RECETAS === 'undefined' || !Array.isArray(RECETAS)) {
    console.error('No se encontró el archivo recetas.js o no tiene el formato correcto.');
    var contenedorErr = document.getElementById('contenedorRecetas');
    if (contenedorErr) {
      contenedorErr.innerHTML = '<p class="vacio">No se pudieron cargar las recetas. Revisa que recetas.js esté en la misma carpeta que recetario.html.</p>';
    }
    return;
  }

  /* =====================================================
     PORTADA: receta destacada
     ===================================================== */
  renderizarDestacada();

  /* =====================================================
     LISTADO: si no estamos en recetario.html, salimos
     ===================================================== */
  const contenedor = document.getElementById('contenedorRecetas');
  if (!contenedor) {
    window.crearTarjetaGlobal = crearTarjeta;
    return;
  }

  const buscador     = document.getElementById('buscador');
  const limpiarBtn   = document.getElementById('limpiarBuscador');
  const limpiarVacio = document.getElementById('limpiarVacio');
  const vacio        = document.getElementById('sinResultados');
  const contador     = document.getElementById('contador');
  const botones      = Array.from(document.querySelectorAll('.filtro'));

  let categoriaActiva = 'todas';
  let textoBusqueda   = '';
  let tarjetas        = [];

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam && ['principales', 'sopas', 'panes', 'ensaladas', 'dulces'].includes(catParam)) {
    categoriaActiva = catParam;
  }
  const buscarParam = urlParams.get('buscar');
  if (buscarParam && buscarParam.trim() !== '') {
    textoBusqueda = buscarParam.trim();
    if (buscador) buscador.value = textoBusqueda;
  }

  let tipeoTimer = null;
  if (buscador) {
    buscador.addEventListener('input', function () {
      textoBusqueda = buscador.value.trim();
      clearTimeout(tipeoTimer);
      tipeoTimer = setTimeout(aplicarFiltros, 80);
    });
    buscador.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        buscador.value = '';
        textoBusqueda = '';
        aplicarFiltros();
      }
    });
  }
  if (limpiarBtn) {
    limpiarBtn.addEventListener('click', function () {
      buscador.value = '';
      textoBusqueda = '';
      buscador.focus();
      aplicarFiltros();
    });
  }
  if (limpiarVacio) {
    limpiarVacio.addEventListener('click', resetear);
  }
  botones.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botones.forEach(function (b) { b.classList.remove('activo'); });
      boton.classList.add('activo');
      categoriaActiva = boton.dataset.cat;
      aplicarFiltros();
    });
  });

  contenedor.addEventListener('click', function (e) {
    var btnMc = e.target.closest('.btn-modo-cocina');
    if (btnMc) {
      e.preventDefault();
      var idx = parseInt(btnMc.dataset.index, 10);
      if (window.ModoCocina && !isNaN(idx) && RECETAS[idx]) {
        window.ModoCocina.abrir(RECETAS[idx]);
      }
      return;
    }
    var btnImp = e.target.closest('.btn-imprimir');
    if (btnImp) {
      var tarjeta = btnImp.closest('.receta');
      if (!tarjeta) return;
      e.preventDefault();
      imprimirTarjeta(tarjeta);
    }
  });

  /* =====================================================
     LÓGICA DE LA DESPENSA (MODAL)
     ===================================================== */
  const despensaIngredientesList = [
    'huevo', 'harina', 'carne', 'pollo', 'papa', 'arroz', 'tomate', 
    'cebolla', 'queso', 'pan', 'leche', 'mantequilla', 'choclo', 
    'zapallo', 'pasta', 'atún', 'limón'
  ];

  const modalDespensa = document.getElementById('modalDespensa');
  const btnDespensa = document.getElementById('btnDespensa');
  const cerrarDespensa = document.getElementById('cerrarDespensa');
  const listaDespensa = document.getElementById('listaDespensa');
  const btnLimpiarDespensa = document.getElementById('limpiarDespensa');
  const btnAplicarDespensa = document.getElementById('aplicarDespensa');

  if (btnDespensa && modalDespensa) {
    // Renderizar chips
    listaDespensa.innerHTML = despensaIngredientesList.map(ing => 
      `<button type="button" class="chip-despensa" data-ing="${ing}">${ing}</button>`
    ).join('');

    // Abrir modal
    btnDespensa.addEventListener('click', () => {
      modalDespensa.classList.add('abierto');
      document.body.style.overflow = 'hidden';
    });

    // Cerrar modal
    const cerrarModal = () => {
      modalDespensa.classList.remove('abierto');
      document.body.style.overflow = '';
    };
    cerrarDespensa.addEventListener('click', cerrarModal);
    modalDespensa.addEventListener('click', (e) => {
      if (e.target === modalDespensa) cerrarModal();
    });

    // Toggle de ingredientes
    listaDespensa.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-despensa');
      if (!chip) return;
      chip.classList.toggle('activo');
      const ing = chip.dataset.ing;
      
      if (chip.classList.contains('activo')) {
        if (!ingredientesDespensa.includes(ing)) ingredientesDespensa.push(ing);
      } else {
        ingredientesDespensa = ingredientesDespensa.filter(i => i !== ing);
      }
    });

    // Limpiar todo
    btnLimpiarDespensa.addEventListener('click', () => {
      ingredientesDespensa = [];
      listaDespensa.querySelectorAll('.chip-despensa').forEach(c => c.classList.remove('activo'));
    });

    // Aplicar filtros y cerrar
    btnAplicarDespensa.addEventListener('click', () => {
      aplicarFiltros();
      cerrarModal();
    });
  }

  /* ---------- Arranque ---------- */
  renderizar();
  botones.forEach(function (b) {
    b.classList.toggle('activo', b.dataset.cat === categoriaActiva);
  });
  aplicarFiltros();

  // Exponer para favoritos.js
  window.crearTarjetaGlobal = crearTarjeta;
})();