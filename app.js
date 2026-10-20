/* =================================================================
   APP.JS — Motor del recetario con Schema.org y SEO
   ⚠️  NO EDITES EL RESTO DE ESTE ARCHIVO.
   Solo configura el bloque SITE_CONFIG de abajo.
   ================================================================= */

(function () {
  'use strict';

  /* =====================================================
     ⚙️ CONFIGURACIÓN DEL SITIO — EDITA ESTOS VALORES
     ===================================================== */
  const SITE_CONFIG = {
    nombre: 'Recetario Chileno',
    urlBase: 'https://recetariochileno.netlify.app',
    autor: 'Recetario Chileno',
    imagenDefault: 'img/og-default.jpg',
    fechaPublicacion: '2025-01-15'
  };

  /* ---------- Verificación de datos ---------- */
  if (typeof RECETAS === 'undefined' || !Array.isArray(RECETAS)) {
    console.error('❌ No se encontró el archivo recetas.js o no tiene el formato correcto.');
    const contenedorErr = document.getElementById('contenedorRecetas');
    if (contenedorErr) {
      contenedorErr.innerHTML = '<p class="vacio">⚠️ No se pudieron cargar las recetas. Revisa que recetas.js esté en la misma carpeta que recetario.html.</p>';
    }
    return;
  }

  /* ---------- Referencias del DOM ---------- */
  const contenedor      = document.getElementById('contenedorRecetas');
  
  // Si no estamos en la página del recetario (ej. estamos en el index), no ejecutamos el motor
  if (!contenedor) return;

  const buscador        = document.getElementById('buscador');
  const limpiarBtn      = document.getElementById('limpiarBuscador');
  const limpiarVacio    = document.getElementById('limpiarVacio');
  const vacio           = document.getElementById('sinResultados');
  const contador        = document.getElementById('contador');
  const botones         = Array.from(document.querySelectorAll('.filtro'));

  /* ---------- Estado ---------- */
  let categoriaActiva = 'todas';
  let textoBusqueda   = '';
  let tarjetas         = [];

  // Leer categoría desde URL (?cat=principales, ?cat=dulces, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam && ['principales', 'sopas', 'panes', 'ensaladas', 'dulces'].includes(catParam)) {
    categoriaActiva = catParam;
  }

  /* =====================================================
     UTILIDADES
     ===================================================== */

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

  /* Convierte "1 h 30 min" → "PT1H30M" */
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

  /* Genera un slug URL-safe: "Empanadas de pino" → "empanadas-de-pino" */
  function slugify(text) {
    return String(text).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* Categoría legible para Google */
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

  /* URL absoluta de imagen */
  function imagenAbsoluta(ruta) {
    if (!ruta) return SITE_CONFIG.urlBase + '/' + SITE_CONFIG.imagenDefault;
    if (/^https?:\/\//.test(ruta)) return ruta;
    return SITE_CONFIG.urlBase + '/' + ruta.replace(/^\//, '');
  }

  /* =====================================================
     SCHEMA.ORG
     ===================================================== */

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

  /* =====================================================
     CONSTRUCTOR DE TARJETAS
     ===================================================== */

  function crearTarjeta(receta, indice) {
    const id = 'receta-' + indice;
    const slug = slugify(receta.titulo);

    let bloqueImagen = '';
    if (receta.imagen && receta.imagen.trim() !== '') {
      bloqueImagen =
        '<img class="receta-img" src="' + escaparAtributo(receta.imagen) + '" ' +
        'alt="' + escaparAtributo(receta.titulo) + ' - Receta chilena" ' +
        'loading="lazy" ' +
        'onerror="this.style.display=\'none\';this.insertAdjacentHTML(\'afterend\',\'<div class=&quot;receta-img-error&quot;>📷 Foto no encontrada: ' +
        escaparAtributo(receta.imagen) + '</div>\')">';
    }

    const chips = [];
    if (receta.tiempo)     chips.push('<span>⏱ ' + escaparHtml(receta.tiempo) + '</span>');
    if (receta.porciones)  chips.push('<span>🍽 ' + escaparHtml(receta.porciones) + '</span>');
    if (receta.dificultad) chips.push('<span>Dificultad: ' + escaparHtml(receta.dificultad) + '</span>');
    if (receta.tecnica)    chips.push('<span>' + escaparHtml(receta.tecnica) + '</span>');

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
      '<article class="receta" data-cat="' + escaparAtributo(receta.categoria || 'principales') + '" id="' + id + '">' +
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
        '<a class="receta-cta" href="recetas/' + slug + '.html">Ver página completa →</a>' +
      '</article>';
  }

  /* =====================================================
     RENDERIZAR
     ===================================================== */

  function renderizar() {
    const html = RECETAS.map(crearTarjeta).join('');
    contenedor.innerHTML = html;
    tarjetas = Array.from(contenedor.querySelectorAll('.receta'));

    RECETAS.forEach(function (receta) {
      inyectarSchemaReceta(receta);
    });

    inyectarSchemaSitio();
  }

  /* =====================================================
     RESALTADO
     ===================================================== */

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

  /* =====================================================
     FILTRADO + FEEDBACK
     ===================================================== */

  function aplicarFiltros() {
    let visibles = 0;
    const normBusqueda = quitarAcentos(textoBusqueda).toLowerCase();
    const regexResaltado = textoBusqueda ? buildRegex(textoBusqueda) : null;

    tarjetas.forEach(function (tarjeta) {
      limpiarResaltados(tarjeta);

      const coincideCat = categoriaActiva === 'todas' || tarjeta.dataset.cat === categoriaActiva;
      const coincideTxt = !normBusqueda ||
        quitarAcentos(tarjeta.textContent).toLowerCase().indexOf(normBusqueda) !== -1;
      const mostrar = coincideCat && coincideTxt;

      tarjeta.hidden = !mostrar;
      if (mostrar) {
        visibles++;
        if (regexResaltado) resaltar(tarjeta, regexResaltado);
        tarjeta.classList.remove('aparecer');
        void tarjeta.offsetWidth;
        tarjeta.classList.add('aparecer');
      }
    });

    if (vacio) vacio.hidden = visibles !== 0;

    if (contador) {
      contador.innerHTML = '';
      const chip = document.createElement('span');
      chip.className = 'chip';
      if (textoBusqueda) {
        chip.innerHTML =
          '🔍 Buscando <strong>«' + escaparHtml(textoBusqueda) + '»</strong>' +
          ' · <strong>' + visibles + '</strong> ' + (visibles === 1 ? 'receta' : 'recetas');
      } else {
        chip.innerHTML =
          '📖 <strong>' + visibles + '</strong> ' + (visibles === 1 ? 'receta' : 'recetas') +
          (categoriaActiva !== 'todas' ? ' en esta categoría' : ' en total');
      }
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
    botones.forEach(function (b) {
      b.classList.toggle('activo', b.dataset.cat === 'todas');
    });
    aplicarFiltros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =====================================================
     EVENTOS
     ===================================================== */

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

  /* =====================================================
     ARRANQUE
     ===================================================== */

  renderizar();

  // Marcar botón activo según la URL
  botones.forEach(function (b) {
    b.classList.toggle('activo', b.dataset.cat === categoriaActiva);
  });

  aplicarFiltros();
})();