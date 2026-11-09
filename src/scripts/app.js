/* =================================================================
   APP.JS — Lógica principal del listado de recetas (portada + recetario)
   ================================================================= */
import { escaparHtml } from '../lib/html.js';

(function () {
  'use strict';

  // Centralización de dominio: window.__SITE_URL lo inyecta Layout.astro en <head>.
  const SITE_CONFIG = {
    nombre: 'Recetario Chileno',
    urlBase: (window.__SITE_URL || 'https://recetariochileno.netlify.app').replace(/\/$/, ''),
    imagenDefault: '/img/og-default.jpg',
  };

  /* ---------- ICONOS ---------- */
  var ICONS = {
    clock:
      '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    porciones:
      '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 2v6a3 3 0 0 0 6 0V2"/><path d="M8 11v11"/><path d="M20 2c-2 3-3 6-3 9h3v11"/></svg>',
    dificultad:
      '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    tecnica:
      '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    chef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>',
  };

  /* ---------- Utilidades ---------- */
  function quitarAcentos(str) {
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
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
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* ---------- VARIABLES GLOBALES DEL ARCHIVO ---------- */
  let contenedor;
  let buscador;
  let limpiarBtn;
  let limpiarVacio;
  let vacio;
  let contador;
  let botones = [];
  let categoriaActiva = 'todas';
  let textoBusqueda = '';
  let tarjetas = [];
  const CATS_MODO_ONCE = ['panes', 'once', 'sandwiches'];
  let modoOnceBanner;
  let heroH1;

  let recetasPorTitulo = null;

  /* ---------- Receta destacada (portada) ---------- */
  function renderizarDestacada() {
    var cont = document.getElementById('recetaDestacada');
    if (!cont) return;
    if (typeof RECETAS === 'undefined' || !Array.isArray(RECETAS) || RECETAS.length === 0) return;

    var conFoto = RECETAS.filter(function (r) {
      return r.imagen && r.imagen.trim() !== '';
    });
    var pool = conFoto.length > 0 ? conFoto : RECETAS;
    var dia = Math.floor(Date.now() / 86400000);
    var indice = dia % pool.length;
    var r = pool[indice];
    var slug = r.slug || slugify(r.titulo);
    var img = r.imagen && r.imagen.trim() !== '' ? r.imagen.trim() : '';

    // Fix: Asegurar que la ruta de la imagen tenga la barra inicial
    if (img && !img.startsWith('/') && !img.startsWith('http')) {
      img = '/' + img;
    }

    var chips = [];
    if (r.tiempo) chips.push('<span>' + ICONS.clock + escaparHtml(r.tiempo) + '</span>');
    if (r.porciones) chips.push('<span>' + ICONS.porciones + escaparHtml(r.porciones) + '</span>');
    if (r.dificultad)
      chips.push(
        '<span>' + ICONS.dificultad + 'Dificultad: ' + escaparHtml(r.dificultad) + '</span>'
      );

    var mediaHTML;
    if (img) {
      mediaHTML =
        '<div class="receta-destacada-media"><img src="' +
        escaparHtml(img) +
        '" alt="' +
        escaparHtml(r.titulo) +
        '" loading="lazy"></div>';
    } else {
      mediaHTML =
        '<div class="receta-destacada-media"><div class="sin-foto">' +
        escaparHtml(r.titulo) +
        '</div></div>';
    }

    var descripcion = r.dato
      ? escaparHtml(r.dato)
      : 'Una receta tradicional chilena explicada paso a paso.';

    cont.innerHTML =
      '<p class="receta-destacada-eyebrow">Receta destacada del día</p>' +
      '<a class="receta-destacada" href="/recetas/' +
      escaparHtml(slug) +
      '/">' +
      mediaHTML +
      '<div class="receta-destacada-body">' +
      '<span class="receta-destacada-tag">' +
      ICONS.chef +
      'Para hoy</span>' +
      '<h2>' +
      escaparHtml(r.titulo) +
      '</h2>' +
      '<p>' +
      descripcion +
      '</p>' +
      '<div class="meta">' +
      chips.join('') +
      '</div>' +
      '<span class="receta-destacada-cta">Ver receta completa →</span>' +
      '</div>' +
      '</a>';
  }

  /* ---------- Constructor de tarjetas ---------- */
  function crearTarjeta(receta, indice) {
    const slug = receta.slug || slugify(receta.titulo);
    const id = 'receta-' + slug;
    const tituloSeguro = escaparHtml(receta.titulo);

    var searchParts = [receta.titulo];
    if (receta.ingredientes) searchParts = searchParts.concat(receta.ingredientes);
    if (receta.tags) searchParts = searchParts.concat(receta.tags);
    if (receta.dato) searchParts.push(receta.dato);
    if (receta.tecnica) searchParts.push(receta.tecnica);

    const tagsStr = (receta.tags || []).join('|');
    const searchText = escaparHtml(searchParts.join(' | '));

    var fotoHTML = '';
    if (receta.imagen && receta.imagen.trim() !== '') {
      let srcImagen = receta.imagen.trim();
      // Fix: Asegurar que la ruta de la imagen tenga la barra inicial
      if (!srcImagen.startsWith('/') && !srcImagen.startsWith('http')) {
        srcImagen = '/' + srcImagen;
      }

      fotoHTML =
        '<div class="receta-card-foto">' +
        '<img src="' +
        escaparHtml(srcImagen) +
        '" ' +
        'alt="' +
        tituloSeguro +
        ' - Receta chilena" ' +
        'loading="lazy" ' +
        'onerror="this.style.opacity=\'0\'">' +
        '</div>';
    }

    const chips = [];
    if (receta.tiempo) chips.push('<span>' + ICONS.clock + escaparHtml(receta.tiempo) + '</span>');
    if (receta.porciones)
      chips.push('<span>' + ICONS.porciones + escaparHtml(receta.porciones) + '</span>');
    if (receta.dificultad)
      chips.push('<span>' + ICONS.dificultad + escaparHtml(receta.dificultad) + '</span>');
    if (receta.tecnica)
      chips.push('<span>' + ICONS.tecnica + escaparHtml(receta.tecnica) + '</span>');

    const desc = receta.dato
      ? escaparHtml(receta.dato)
      : 'Receta tradicional chilena explicada paso a paso.';

    return (
      '' +
      '<article class="receta-card" data-cat="' +
      escaparHtml(receta.categoria || 'principales') +
      '" ' +
      'data-tags="' +
      escaparHtml(tagsStr) +
      '" ' +
      'data-titulo="' +
      tituloSeguro +
      '" ' +
      'data-search="' +
      searchText +
      '" ' +
      'id="' +
      escaparHtml(id) +
      '">' +
      '<a href="/recetas/' +
      escaparHtml(slug) +
      '/" class="receta-card-link">' +
      fotoHTML +
      '<div class="receta-card-body">' +
      '<h2>' +
      escaparHtml(receta.titulo) +
      '</h2>' +
      '<div class="meta">' +
      chips.join('') +
      '</div>' +
      '<p class="receta-card-desc">' +
      desc +
      '</p>' +
      '<span class="receta-card-cta">Ver receta completa →</span>' +
      '</div>' +
      '</a>' +
      '<button type="button" class="btn-favorito" data-slug="' +
      escaparHtml(slug) +
      '" aria-label="Guardar en favoritos">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
      '</button>' +
      '<span class="receta-card-faltan" hidden></span>' +
      '</article>'
    );
  }

  /* ---------- Renderizar listado ---------- */
  function renderizar() {
    const html = RECETAS.map(crearTarjeta).join('');
    contenedor.innerHTML = html;
    tarjetas = Array.from(contenedor.querySelectorAll('.receta-card'));

    if (window.Favoritos) window.Favoritos.actualizar();
  }

  /* ---------- Resaltado (buscador) ---------- */
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
      },
    });
    const nodos = [];
    while (walker.nextNode()) nodos.push(walker.currentNode);
    nodos.forEach(function (nodo) {
      regex.lastIndex = 0;
      if (!regex.test(nodo.nodeValue)) return;
      regex.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let ultimo = 0,
        m;
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
     DESPENSA
     ===================================================== */
  let ingredientesDespensa = [];

  function escaparRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function textoIngredientes(receta) {
    return quitarAcentos(String((receta.ingredientes || []).join(' ')).toLowerCase());
  }

  function coincideIngrediente(textoNorm, chip) {
    const chipNorm = quitarAcentos(String(chip).toLowerCase());
    if (!chipNorm) return false;
    const esc = escaparRegex(chipNorm);
    const re = new RegExp('\\b' + esc + '(?:s|es)?\\b', 'i');
    return re.test(textoNorm);
  }

  function calcularMatch(receta, chips) {
    if (!chips || chips.length === 0) {
      return { matches: 0, faltantes: 0, pct: 0 };
    }
    const texto = textoIngredientes(receta);
    let matches = 0;
    chips.forEach(function (chip) {
      if (coincideIngrediente(texto, chip)) matches++;
    });
    const faltantes = chips.length - matches;
    const pct = chips.length > 0 ? matches / chips.length : 0;
    return { matches: matches, faltantes: faltantes, pct: pct };
  }

  function filtrarChipsUtiles(chipsCandidatos) {
    return chipsCandidatos.filter(function (chip) {
      return RECETAS.some(function (r) {
        return coincideIngrediente(textoIngredientes(r), chip);
      });
    });
  }

  /* =====================================================
     FILTROS AVANZADOS
     ===================================================== */
  let filtrosAvanzados = { tiempo: null, dificultad: null, tipo: [], ocasion: [] };

  const MIN_POR_TIEMPO = { 30: 30, 60: 60, 9999: 9999 };

  function minutosDeReceta(receta) {
    if (!receta.tiempo) return 0;
    const t = String(receta.tiempo).toLowerCase();
    let min = 0;
    const h = t.match(/(\d+(?:[.,]\d+)?)\s*h/);
    const m = t.match(/(\d+)\s*min/);
    if (h) min += parseFloat(h[1].replace(',', '.')) * 60;
    if (m) min += parseInt(m[1], 10);
    return min;
  }

  function esVegetariano(receta) {
    if (
      (receta.tags || []).some(function (t) {
        return /vegetarian/i.test(t);
      })
    )
      return true;
    const textoCrudo =
      (receta.titulo || '') +
      ' ' +
      (receta.ingredientes || []).join(' ') +
      ' ' +
      (receta.tags || []).join(' ');
    const texto = quitarAcentos(textoCrudo).toLowerCase();
    const carnesRegex =
      /\b(carne(?! de (soya|soja|trigo|vegetal))|vacuno|vaca|bife|bistec|churrasco|lomo|posta|asiento|tapapecho|plateada|osobuco|costilla|costillar|malaya|arrollado|mechada|pollo|trutro|pechuga|panita|gallina|pavo|pavita|cordero|borrego|cerdo|chancho|pulpa|chuleta|pernil|tocino|chicharron|hamburguesa|vienesa|salchicha|chorizo|longaniza|prieta|morcilla|jamon|cecina|pate|guatita|chunchule|rinon|higado|corazon|seso|chanfaina|menudencia|charqui|hueso|caldo|pescado|marisco|camaron|chorito|almeja|macha|loco|jaiba|centolla|congrio|corvina|merluza|reineta|salmon|atun|jurel|pulpo|calamar|picoroco|cholga|ostion)s?\b/i;
    return !carnesRegex.test(texto);
  }

  function esVegano(receta) {
    return (receta.tags || []).some(function (t) {
      return /vegan/i.test(t);
    });
  }

  function esSinHorno(receta) {
    return (receta.tecnica || '').toLowerCase() !== 'horno';
  }

  function coincideFiltrosAvanzados(receta) {
    if (filtrosAvanzados.tiempo) {
      const min = minutosDeReceta(receta);
      const lim = MIN_POR_TIEMPO[filtrosAvanzados.tiempo];
      if (min > lim) return false;
    }
    if (filtrosAvanzados.dificultad) {
      if ((receta.dificultad || '').toLowerCase() !== filtrosAvanzados.dificultad) return false;
    }

    if (filtrosAvanzados.tipo.length > 0) {
      const cumpleTipos = filtrosAvanzados.tipo.every((tipo) => {
        if (tipo === 'vegetariano') return esVegetariano(receta);
        if (tipo === 'vegano') return esVegano(receta);
        if (tipo === 'sin-horno') return esSinHorno(receta);
        return true;
      });
      if (!cumpleTipos) return false;
    }

    if (filtrosAvanzados.ocasion.length > 0) {
      const tags = (receta.tags || []).map(function (t) {
        return quitarAcentos(t.toLowerCase());
      });
      const cumpleOcasiones = filtrosAvanzados.ocasion.every((ocasion) => {
        const ocasionBuscada = quitarAcentos(ocasion.toLowerCase());
        return tags.some((t) => t.includes(ocasionBuscada));
      });
      if (!cumpleOcasiones) return false;
    }

    return true;
  }

  /* ---------- Filtrado + feedback ---------- */
  function aplicarFiltros(opciones) {
    opciones = opciones || {};
    const reordenar = !!opciones.reordenar;
    const normBusqueda = quitarAcentos(textoBusqueda).toLowerCase();
    const regexResaltado = textoBusqueda ? buildRegex(textoBusqueda) : null;
    const hayDespensa = ingredientesDespensa.length > 0;
    const hayAvanzados = !!(
      filtrosAvanzados.tiempo ||
      filtrosAvanzados.dificultad ||
      filtrosAvanzados.tipo.length > 0 ||
      filtrosAvanzados.ocasion.length > 0
    );

    let visibles = 0;
    const conScore = [];

    tarjetas.forEach(function (tarjeta) {
      limpiarResaltados(tarjeta);

      let coincideCat;
      if (categoriaActiva === 'todas') {
        coincideCat = true;
      } else if (categoriaActiva === 'modo-once') {
        coincideCat = CATS_MODO_ONCE.indexOf(tarjeta.dataset.cat) !== -1;
      } else if (categoriaActiva === 'mar') {
        const textoReceta = (tarjeta.dataset.search || '').toLowerCase();
        const esMarino =
          /pescado|camarón|camaron|chorito|almeja|macha|loco|jaiba|centolla|congrio|corvina|merluza|reineta|salmón|salmon|atún|atun|jurel|pulpo|calamar|picoroco|cholga|ostión|ostion|marisco/i.test(
            textoReceta
          );

        const tagsTarjeta = (tarjeta.dataset.tags || '').split('|');
        coincideCat = tarjeta.dataset.cat === 'mar' || tagsTarjeta.includes('mar') || esMarino;
      } else {
        const tagsTarjeta = (tarjeta.dataset.tags || '').split('|');
        coincideCat =
          tarjeta.dataset.cat === categoriaActiva || tagsTarjeta.includes(categoriaActiva);
      }

      const searchText = quitarAcentos(tarjeta.dataset.search || '').toLowerCase();
      const tituloNorm = quitarAcentos(tarjeta.dataset.titulo || '').toLowerCase();

      let coincideTxt = true;
      let scoreBusqueda = 0;

      if (normBusqueda) {
        let coincideEnTexto = false;
        if (normBusqueda.length >= 3) {
          const re = new RegExp('\\b' + normBusqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          coincideEnTexto = re.test(searchText);
        } else {
          coincideEnTexto = searchText.indexOf(normBusqueda) !== -1;
        }

        if (coincideEnTexto) {
          if (tituloNorm === normBusqueda) scoreBusqueda = 100;
          else if (tituloNorm.indexOf(normBusqueda) === 0) scoreBusqueda = 80;
          else if (tituloNorm.indexOf(normBusqueda) !== -1) scoreBusqueda = 60;
          else scoreBusqueda = 20;
        } else {
          coincideTxt = false;
        }
      }

      const titulo = tarjeta.dataset.titulo;
      const receta = recetasPorTitulo ? recetasPorTitulo.get(titulo) : null;

      let matchInfo = { matches: 0, faltantes: 0, pct: 0 };
      let coincideDespensa = true;
      if (hayDespensa && receta) {
        matchInfo = calcularMatch(receta, ingredientesDespensa);
        coincideDespensa = matchInfo.matches > 0;
      } else if (hayDespensa && !receta) {
        coincideDespensa = false;
      }

      let coincideAvanzados = true;
      if (receta && hayAvanzados) {
        coincideAvanzados = coincideFiltrosAvanzados(receta);
      }

      const mostrar = coincideCat && coincideTxt && coincideDespensa && coincideAvanzados;
      tarjeta.hidden = !mostrar;

      if (mostrar) {
        tarjeta.dataset.scoreBusqueda = scoreBusqueda;
        visibles++;
        if (regexResaltado) resaltar(tarjeta, regexResaltado);
        conScore.push({ tarjeta: tarjeta, pct: matchInfo.pct, faltantes: matchInfo.faltantes });
      }

      const badge = tarjeta.querySelector('.receta-card-faltan');
      if (badge) {
        if (hayDespensa && mostrar) {
          badge.textContent =
            matchInfo.faltantes === 0 ? '¡Tienes todo!' : 'Te faltan ' + matchInfo.faltantes;
          badge.classList.toggle('todo', matchInfo.faltantes === 0);
          badge.hidden = false;
        } else {
          badge.hidden = true;
        }
      }
    });

    if (normBusqueda && !hayDespensa) {
      const tarjetasArray = Array.from(contenedor.children);
      tarjetasArray.sort(function (a, b) {
        if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
        return parseInt(b.dataset.scoreBusqueda || 0) - parseInt(a.dataset.scoreBusqueda || 0);
      });
      tarjetasArray.forEach(function (t) {
        contenedor.appendChild(t);
      });
    }

    if (reordenar && hayDespensa) {
      conScore.sort(function (a, b) {
        if (b.pct !== a.pct) return b.pct - a.pct;
        return a.faltantes - b.faltantes;
      });
      conScore.forEach(function (item) {
        contenedor.appendChild(item.tarjeta);
      });
    }

    const filtrosActivos = [];
    if (categoriaActiva !== 'todas') {
      const nombresCats = {
        principales: 'Platos de fondo',
        sopas: 'Sopas',
        panes: 'Masas',
        ensaladas: 'Ensaladas',
        dulces: 'Dulces',
        bebidas: 'Bebidas',
        once: 'Once',
        sandwiches: 'Sándwiches',
        mar: 'Del mar',
        'modo-once': 'Modo Once',
      };
      filtrosActivos.push({
        tipo: 'cat',
        valor: categoriaActiva,
        texto: nombresCats[categoriaActiva] || categoriaActiva,
      });
    }
    if (textoBusqueda) {
      filtrosActivos.push({ tipo: 'texto', valor: textoBusqueda, texto: `"${textoBusqueda}"` });
    }
    if (filtrosAvanzados.tiempo) {
      filtrosActivos.push({
        tipo: 'tiempo',
        valor: filtrosAvanzados.tiempo,
        texto: `≤ ${filtrosAvanzados.tiempo} min`,
      });
    }
    if (filtrosAvanzados.dificultad) {
      filtrosActivos.push({
        tipo: 'dificultad',
        valor: filtrosAvanzados.dificultad,
        texto: filtrosAvanzados.dificultad,
      });
    }

    if (filtrosAvanzados.tipo.length > 0) {
      filtrosAvanzados.tipo.forEach((t) => {
        filtrosActivos.push({ tipo: 'tipo', valor: t, texto: t });
      });
    }
    if (filtrosAvanzados.ocasion.length > 0) {
      filtrosAvanzados.ocasion.forEach((o) => {
        filtrosActivos.push({ tipo: 'ocasion', valor: o, texto: o });
      });
    }

    if (hayDespensa) {
      filtrosActivos.push({
        tipo: 'despensa',
        valor: 'all',
        texto: `Despensa (${ingredientesDespensa.length} ing.)`,
      });
    }

    const contenedorFiltrosActivos = document.getElementById('filtros-activos-container');
    if (contenedorFiltrosActivos) {
      // Hotfix XSS: Uso de escaparHtml para evitar inyección en atributos y contenido
      contenedorFiltrosActivos.innerHTML = filtrosActivos
        .map(
          (f) =>
            `<button type="button" class="chip-activo" data-tipo="${escaparHtml(f.tipo)}" data-valor="${escaparHtml(f.valor)}">${escaparHtml(f.texto)} ✕</button>`
        )
        .join('');
    }

    if (vacio) {
      vacio.hidden = visibles !== 0;
      if (visibles === 0) {
        const msgEl = document.getElementById('mensaje-vacio-texto');
        if (msgEl) {
          if (filtrosActivos.length > 0) {
            // Hotfix XSS
            const lista = filtrosActivos.map((f) => `<strong>${escaparHtml(f.texto)}</strong>`).join(' + ');
            msgEl.innerHTML = `No hay recetas que coincidan con: ${lista}.`;
          } else {
            msgEl.innerHTML = 'No encontramos recetas con ese criterio.';
          }
        }
      }
    }

    if (contador) {
      contador.innerHTML = '';
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = `<strong>${visibles}</strong> ${visibles === 1 ? 'receta' : 'recetas'} encontradas`;
      contador.appendChild(chip);
    }

    if (limpiarBtn && buscador) {
      limpiarBtn.hidden = buscador.value.length === 0;
      buscador.classList.toggle('con-texto', buscador.value.length > 0);
    }

    if (modoOnceBanner) {
      modoOnceBanner.hidden = categoriaActiva !== 'modo-once';
    }
    if (heroH1) {
      if (categoriaActiva === 'modo-once') {
        if (!heroH1.dataset.original) heroH1.dataset.original = heroH1.textContent;
        heroH1.textContent = '🧉 Modo Once: la hora del té';
      } else if (heroH1.dataset.original) {
        heroH1.textContent = heroH1.dataset.original;
        delete heroH1.dataset.original;
      }
    }
  }

  function resetear() {
    if (buscador) buscador.value = '';
    textoBusqueda = '';

    if (heroH1 && heroH1.dataset.original) {
      heroH1.textContent = heroH1.dataset.original;
      delete heroH1.dataset.original;
    }
    if (modoOnceBanner) modoOnceBanner.hidden = true;

    categoriaActiva = 'todas';
    ingredientesDespensa = [];
    filtrosAvanzados = { tiempo: null, dificultad: null, tipo: [], ocasion: [] };

    document.querySelectorAll('.chip-despensa').forEach(function (c) {
      c.classList.remove('activo');
    });
    document.querySelectorAll('.filtro-chip').forEach(function (c) {
      c.classList.remove('activo');
    });

    botones.forEach(function (b) {
      b.classList.toggle('activo', b.dataset.cat === 'todas');
    });
    aplicarFiltros({ reordenar: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =====================================================
     AUTOCOMPLETADO DEL BUSCADOR
     ===================================================== */
  function initAutocompletado(input, recetas) {
    if (!input) return;
    const dropdown = document.getElementById('buscador-sugerencias');
    if (!dropdown) return;

    let activo = -1;
    let sugerencias = [];

    const norm = function (s) {
      return String(s)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    };

    function buscar(q) {
      const qN = norm(q.trim());
      if (qN.length < 2) return [];
      return recetas
        .map(function (r) {
          const t = norm(r.titulo);
          let score = 0;
          if (t === qN) score = 100;
          else if (t.indexOf(qN) === 0) score = 80;
          else if (t.indexOf(qN) !== -1) score = 60;
          else if (
            (r.ingredientes || []).some(function (i) {
              return norm(i).indexOf(qN) !== -1;
            })
          )
            score = 30;
          else if (
            (r.tags || []).some(function (tg) {
              return norm(tg).indexOf(qN) !== -1;
            })
          )
            score = 20;
          return { r: r, score: score };
        })
        .filter(function (x) {
          return x.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 8);
    }

    function render() {
      if (!sugerencias.length) {
        dropdown.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      dropdown.innerHTML = sugerencias
        .map(function (s, i) {
          return (
            '<li data-idx="' +
            i +
            '" role="option"' +
            (i === activo ? ' class="activo" aria-selected="true"' : '') +
            '>' +
            '<span class="ac-titulo">' +
            escaparHtml(s.r.titulo) +
            '</span>' +
            '<span class="ac-cat">' +
            escaparHtml(s.r.categoria || '') +
            '</span>' +
            '</li>'
          );
        })
        .join('');
      dropdown.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function seleccionar(idx) {
      const s = sugerencias[idx];
      if (!s) return;
      input.value = s.r.titulo;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      dropdown.hidden = true;
      activo = -1;
      input.setAttribute('aria-expanded', 'false');
    }

    input.addEventListener('input', function () {
      sugerencias = buscar(input.value);
      activo = -1;
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (dropdown.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activo = Math.min(sugerencias.length - 1, activo + 1);
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activo = Math.max(0, activo - 1);
        render();
      } else if (e.key === 'Enter' && activo >= 0) {
        e.preventDefault();
        seleccionar(activo);
      } else if (e.key === 'Escape') {
        dropdown.hidden = true;
        activo = -1;
        input.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.addEventListener('mousedown', function (e) {
      const li = e.target.closest('li[data-idx]');
      if (li) {
        e.preventDefault();
        seleccionar(parseInt(li.dataset.idx, 10));
      }
    });

    input.addEventListener('blur', function () {
      setTimeout(function () {
        dropdown.hidden = true;
        activo = -1;
      }, 150);
    });
  }

  /* =====================================================
     INICIALIZACIÓN
     ===================================================== */
  let appIniciada = false;

  function initApp() {
    if (appIniciada) return;
    appIniciada = true;

    if (typeof RECETAS === 'undefined' || !Array.isArray(RECETAS)) {
      console.error('No se encontraron las recetas en window.RECETAS');
      return;
    }

    recetasPorTitulo = new Map();
    RECETAS.forEach(function (r) {
      if (!recetasPorTitulo.has(r.titulo)) {
        recetasPorTitulo.set(r.titulo, r);
      }
    });

    renderizarDestacada();

    buscador = document.getElementById('buscador');
    if (buscador) {
      initAutocompletado(buscador, RECETAS);
    }

    contenedor = document.getElementById('contenedorRecetas');
    if (!contenedor) {
      window.crearTarjetaGlobal = crearTarjeta;
      return;
    }

    limpiarBtn = document.getElementById('limpiarBuscador');
    limpiarVacio = document.getElementById('limpiarVacio');
    vacio = document.getElementById('sinResultados');
    contador = document.getElementById('contador');
    botones = Array.from(document.querySelectorAll('.filtro'));

    modoOnceBanner = document.getElementById('modoOnceBanner');
    heroH1 = document.querySelector('.hero-receta h1');

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (
      catParam &&
      [
        'principales',
        'sopas',
        'panes',
        'ensaladas',
        'dulces',
        'bebidas',
        'once',
        'sandwiches',
        'mar',
        'modo-once',
      ].includes(catParam)
    ) {
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
        tipeoTimer = setTimeout(function () {
          aplicarFiltros({ reordenar: false });
        }, 80);
      });
      buscador.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          buscador.value = '';
          textoBusqueda = '';
          aplicarFiltros({ reordenar: false });
        }
      });
    }
    if (limpiarBtn) {
      limpiarBtn.addEventListener('click', function () {
        buscador.value = '';
        textoBusqueda = '';
        buscador.focus();
        aplicarFiltros({ reordenar: false });
      });
    }
    if (limpiarVacio) {
      limpiarVacio.addEventListener('click', resetear);
    }
    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        botones.forEach(function (b) {
          b.classList.remove('activo');
        });
        boton.classList.add('activo');
        categoriaActiva = boton.dataset.cat;
        aplicarFiltros({ reordenar: true });
      });
    });

    /* =====================================================
       LÓGICA DE LA DESPENSA (MODAL)
       ===================================================== */
    const despensaIngredientesList = [
      'huevo',
      'leche',
      'mantequilla',
      'queso',
      'yogur',
      'crema',
      'parmesano',
      'harina',
      'arroz',
      'avena',
      'maicena',
      'pan',
      'marraqueta',
      'hallulla',
      'tallarines',
      'pasta',
      'fideos',
      'polvos de hornear',
      'levadura',
      'carne',
      'vacuno',
      'pollo',
      'cerdo',
      'longaniza',
      'chorizo',
      'prieta',
      'charqui',
      'pulpa',
      'posta',
      'bistec',
      'vienesa',
      'jamón',
      'tocino',
      'cebolla',
      'ajo',
      'tomate',
      'zanahoria',
      'papa',
      'choclo',
      'zapallo',
      'camote',
      'pimentón',
      'ají',
      'porotos verdes',
      'arvejas',
      'puerro',
      'repollo',
      'palta',
      'limón',
      'cilantro',
      'perejil',
      'albahaca',
      'laurel',
      'menta',
      'champiñón',
      'porotos',
      'lentejas',
      'garbanzos',
      'chancaca',
      'azúcar',
      'sal',
      'aceite',
      'vinagre',
      'merkén',
      'comino',
      'orégano',
      'ají de color',
      'canela',
      'clavo de olor',
      'vainilla',
      'pasas',
      'nueces',
      'manjar',
      'atún',
      'aceituna',
      'mostaza',
      'ketchup',
      'mayonesa',
      'bicarbonato',
      'agua',
      'vino',
      'vino tinto',
      'vino blanco',
      'pisco',
      'caldo',
    ];

    const modalDespensa = document.getElementById('modalDespensa');
    const btnDespensa = document.getElementById('btnDespensa');
    const cerrarDespensa = document.getElementById('cerrarDespensa');
    const listaDespensa = document.getElementById('listaDespensa');
    const btnLimpiarDespensa = document.getElementById('limpiarDespensa');
    const btnAplicarDespensa = document.getElementById('aplicarDespensa');

    if (btnDespensa && modalDespensa) {
      var chipsUtiles = filtrarChipsUtiles(despensaIngredientesList);

      listaDespensa.innerHTML = chipsUtiles
        .map(function (ing) {
          return (
            '<button type="button" class="chip-despensa" data-ing="' +
            escaparHtml(ing) +
            '">' +
            escaparHtml(ing) +
            '</button>'
          );
        })
        .join('');

      btnDespensa.addEventListener('click', function () {
        modalDespensa.classList.add('abierto');
        document.body.style.overflow = 'hidden';
      });

      const cerrarModal = function () {
        modalDespensa.classList.remove('abierto');
        document.body.style.overflow = '';
      };
      cerrarDespensa.addEventListener('click', cerrarModal);
      modalDespensa.addEventListener('click', function (e) {
        if (e.target === modalDespensa) cerrarModal();
      });

      listaDespensa.addEventListener('click', function (e) {
        const chip = e.target.closest('.chip-despensa');
        if (!chip) return;
        chip.classList.toggle('activo');
        const ing = chip.dataset.ing;

        if (chip.classList.contains('activo')) {
          if (ingredientesDespensa.indexOf(ing) === -1) ingredientesDespensa.push(ing);
        } else {
          ingredientesDespensa = ingredientesDespensa.filter(function (i) {
            return i !== ing;
          });
        }
      });

      const buscarDespensa = document.getElementById('buscarDespensa');
      if (buscarDespensa) {
        buscarDespensa.addEventListener('input', function () {
          const q = quitarAcentos(buscarDespensa.value).toLowerCase();
          listaDespensa.querySelectorAll('.chip-despensa').forEach(function (chip) {
            const txt = quitarAcentos(chip.textContent).toLowerCase();
            chip.hidden = q.length > 0 && txt.indexOf(q) === -1;
          });
        });
      }

      btnLimpiarDespensa.addEventListener('click', function () {
        ingredientesDespensa = [];
        listaDespensa.querySelectorAll('.chip-despensa').forEach(function (c) {
          c.classList.remove('activo');
        });
        if (buscarDespensa) {
          buscarDespensa.value = '';
          listaDespensa.querySelectorAll('.chip-despensa').forEach(function (c) {
            c.hidden = false;
          });
        }
      });

      btnAplicarDespensa.addEventListener('click', function () {
        aplicarFiltros({ reordenar: true });
        cerrarModal();
      });
    }

    /* =====================================================
       FILTROS AVANZADOS — WIRING
       ===================================================== */
    const btnFiltrosAvanzados = document.getElementById('btnFiltrosAvanzados');
    const panelFiltrosAvanzados = document.getElementById('filtrosAvanzados');
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

    if (btnFiltrosAvanzados && panelFiltrosAvanzados) {
      btnFiltrosAvanzados.addEventListener('click', function (e) {
        e.stopImmediatePropagation();

        const estabaAbierto = !panelFiltrosAvanzados.hidden;
        panelFiltrosAvanzados.hidden = estabaAbierto;
        btnFiltrosAvanzados.setAttribute('aria-expanded', estabaAbierto ? 'false' : 'true');
        btnFiltrosAvanzados.classList.toggle('activo', !estabaAbierto);
      });

      panelFiltrosAvanzados.querySelectorAll('.filtro-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          const grupo = chip.dataset.tiempo
            ? 'tiempo'
            : chip.dataset.dificultad
              ? 'dificultad'
              : chip.dataset.tipo
                ? 'tipo'
                : chip.dataset.ocasion
                  ? 'ocasion'
                  : null;
          if (!grupo) return;

          const valor = chip.dataset[grupo];

          if (grupo === 'tiempo' || grupo === 'dificultad') {
            const yaActivo = filtrosAvanzados[grupo] === valor;
            filtrosAvanzados[grupo] = yaActivo ? null : valor;
          } else {
            const index = filtrosAvanzados[grupo].indexOf(valor);
            if (index > -1) {
              filtrosAvanzados[grupo].splice(index, 1);
            } else {
              filtrosAvanzados[grupo].push(valor);
            }
          }

          panelFiltrosAvanzados.querySelectorAll('.filtro-chip').forEach(function (c) {
            const g = c.dataset.tiempo
              ? 'tiempo'
              : c.dataset.dificultad
                ? 'dificultad'
                : c.dataset.tipo
                  ? 'tipo'
                  : c.dataset.ocasion
                    ? 'ocasion'
                    : null;
            if (g === grupo) {
              if (grupo === 'tiempo' || grupo === 'dificultad') {
                c.classList.toggle('activo', c.dataset[g] === filtrosAvanzados[grupo]);
              } else {
                c.classList.toggle('activo', filtrosAvanzados[grupo].includes(c.dataset[g]));
              }
            }
          });
          aplicarFiltros({ reordenar: true });
        });
      });

      if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', function () {
          filtrosAvanzados = { tiempo: null, dificultad: null, tipo: [], ocasion: [] };
          panelFiltrosAvanzados.querySelectorAll('.filtro-chip').forEach(function (c) {
            c.classList.remove('activo');
          });
          aplicarFiltros({ reordenar: true });
        });
      }
    }

    document.addEventListener('click', function (e) {
      const chip = e.target.closest('.chip-activo');
      if (!chip) return;

      const tipo = chip.getAttribute('data-tipo');
      const valor = chip.getAttribute('data-valor');

      if (tipo === 'cat') {
        categoriaActiva = 'todas';
        botones.forEach((b) => b.classList.toggle('activo', b.dataset.cat === 'todas'));
      } else if (tipo === 'texto') {
        textoBusqueda = '';
        if (buscador) buscador.value = '';
      } else if (tipo === 'despensa') {
        ingredientesDespensa = [];
        document.querySelectorAll('.chip-despensa').forEach((c) => c.classList.remove('activo'));
      } else if (tipo === 'tiempo' || tipo === 'dificultad') {
        filtrosAvanzados[tipo] = null;
        document.querySelectorAll('.filtro-chip').forEach((c) => {
          if (c.dataset[tipo] === valor) c.classList.remove('activo');
        });
      } else {
        const index = filtrosAvanzados[tipo].indexOf(valor);
        if (index > -1) filtrosAvanzados[tipo].splice(index, 1);

        document.querySelectorAll('.filtro-chip').forEach((c) => {
          if (c.dataset[tipo] === valor) c.classList.remove('activo');
        });
      }

      aplicarFiltros({ reordenar: true });
    });

    /* ---------- Arranque ---------- */
    renderizar();
    botones.forEach(function (b) {
      b.classList.toggle('activo', b.dataset.cat === categoriaActiva);
    });
    aplicarFiltros({ reordenar: false });

    window.crearTarjetaGlobal = crearTarjeta;
  }

  // Iniciar cuando las recetas estén disponibles
  document.addEventListener('recetas-listas', initApp);
  if (window.RECETAS && window.RECETAS.length > 0) {
    initApp();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.RECETAS && window.RECETAS.length > 0) initApp();
    });
  }
})();