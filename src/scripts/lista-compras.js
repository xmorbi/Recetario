/* =================================================================
   LISTA-COMPRAS.JS — Carrito flotante y lista de compras
   ================================================================= */
import { escaparHtml } from '../lib/html.js';

(function () {
  'use strict';

  const STORAGE_KEY = 'recetario_lista_compras';
  let lista = [];

  try {
    lista = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    lista = [];
  }

  function crearInterfaz() {
    if (document.getElementById('shopping-fab')) return;

    const fab = document.createElement('button');
    fab.id = 'shopping-fab';
    fab.className = 'shopping-fab';
    fab.setAttribute('aria-label', 'Abrir lista de compras');
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span class="shopping-badge" id="shopping-badge">0</span>
    `;
    document.body.appendChild(fab);

    const overlay = document.createElement('div');
    overlay.id = 'shopping-overlay';
    overlay.className = 'shopping-overlay';

    const panel = document.createElement('aside');
    panel.id = 'shopping-panel';
    panel.className = 'shopping-panel';
    panel.innerHTML = `
      <div class="shopping-header">
        <h2>Mi Lista de Compras</h2>
        <button type="button" class="shopping-close" id="shopping-close" aria-label="Cerrar lista">✕</button>
      </div>
      <div class="shopping-content" id="shopping-content">
        <!-- Aquí se inyectan los items -->
      </div>
      <div class="shopping-footer">
        <button type="button" class="btn-compartir-lista" id="btn-compartir-lista" aria-label="Compartir lista por WhatsApp">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="vertical-align:-3px; margin-right:.4rem;">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Compartir por WhatsApp
        </button>
        <button type="button" class="btn-compartir-link" id="btn-compartir-link" aria-label="Copiar enlace para compartir lista">
          🔗 Copiar enlace
        </button>
        <button type="button" class="btn-vaciar" id="btn-vaciar">Vaciar lista</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    fab.addEventListener('click', abrirPanel);
    document.getElementById('shopping-close').addEventListener('click', cerrarPanel);
    overlay.addEventListener('click', cerrarPanel);
    document.getElementById('btn-vaciar').addEventListener('click', vaciarLista);
    document.getElementById('btn-compartir-lista').addEventListener('click', compartirWhatsApp);
    document.getElementById('btn-compartir-link').addEventListener('click', compartirLink);
  }

  function guardar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {}
    actualizarUI();
  }

  function numLimpio(n) {
    return String(Math.round(n * 100) / 100);
  }

  function hostSitio() {
    var base =
      (typeof window !== 'undefined' && window.__SITE_URL) ||
      (typeof location !== 'undefined' && location.origin) ||
      '';
    return String(base)
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '');
  }

  function agregarItem(texto) {
    const textoLimpio = texto.trim();
    if (!textoLimpio) return;
    const existe = lista.find((item) => item.texto.toLowerCase() === textoLimpio.toLowerCase());
    if (existe) {
      if (existe.comprado) {
        existe.comprado = false;
        guardar();
      }
      abrirPanel();
      return;
    }

    lista.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      texto: textoLimpio,
      comprado: false,
    });
    guardar();
    abrirPanel();
  }

  function formatearItemTexto(nombre, cantidad, unidad) {
    if (!cantidad || cantidad === 0) return nombre;
    let cantFormateada;
    if (unidad === 'g' && cantidad >= 1000) {
      cantFormateada = numLimpio(cantidad / 1000) + ' kg';
    } else if (unidad === 'ml' && cantidad >= 1000) {
      cantFormateada = numLimpio(cantidad / 1000) + ' L';
    } else {
      cantFormateada = numLimpio(cantidad) + ' ' + unidad;
    }
    return `${nombre}: ${cantFormateada}`;
  }

  function agregarItemLista(item) {
    if (!item || !item.nombre) return false;

    const cantidad = parseFloat(item.cantidad) || 0;
    const unidad = item.unidad || '';
    const nombre = String(item.nombre).trim();
    const ingId = item.id || null;

    let existente = null;
    if (ingId) {
      existente = lista.find(
        (i) => i._ingredienteId === ingId && i._unidad === unidad && !i.comprado
      );
    }

    if (existente) {
      existente._cantidad = Math.round(((existente._cantidad || 0) + cantidad) * 100) / 100;
      existente.texto = formatearItemTexto(nombre, existente._cantidad, unidad);
      existente.comprado = false;
    } else {
      lista.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        texto: formatearItemTexto(nombre, cantidad, unidad),
        comprado: false,
        _ingredienteId: ingId,
        _nombre: nombre,
        _cantidad: cantidad,
        _unidad: unidad,
      });
    }

    guardar();
    abrirPanel();
    return true;
  }

  function toggleComprado(id) {
    const item = lista.find((i) => i.id === id);
    if (item) {
      item.comprado = !item.comprado;
      guardar();
    }
  }

  function eliminarItem(id) {
    lista = lista.filter((i) => i.id !== id);
    guardar();
  }

  function vaciarLista() {
    if (confirm('¿Seguro que quieres vaciar toda la lista?')) {
      lista = [];
      guardar();
    }
  }

  function compartirWhatsApp() {
    const pendientes = lista.filter((i) => !i.comprado);
    if (pendientes.length === 0) {
      alert(
        'Tu lista está vacía o ya marcaste todo como comprado. Agrega algo antes de compartir.'
      );
      return;
    }

    const host = hostSitio();
    const sufijo = host ? '\n\n_Enviado desde ' + host + '_' : '';

    const texto =
      '🛒 *Mi Lista de Compras*\n' +
      '_Recetario Chileno_\n' +
      '\n' +
      pendientes.map((i) => '• ' + i.texto).join('\n') +
      sufijo;

    const url = 'https://wa.me/?text=' + encodeURIComponent(texto);
    window.open(url, '_blank', 'noopener');
  }

  function compartirLink() {
    if (lista.length === 0) {
      alert('Tu lista está vacía. Agrega algo antes de compartir.');
      return;
    }

    const compacta = lista.map((i) => ({ t: i.texto, c: i.comprado ? 1 : 0 }));

    let encoded;
    try {
      encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compacta))));
    } catch (e) {
      alert('No se pudo generar el enlace. Intenta por WhatsApp.');
      return;
    }

    const baseUrl = location.origin + location.pathname;
    const url = baseUrl + '#lista=' + encoded;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(function () {
          alert(
            '¡Enlace copiado al portapapeles!\n\nPégalo en un chat, correo o donde quieras. Al abrirlo, la otra persona podrá importar la lista.'
          );
        })
        .catch(function () {
          prompt('Copia este enlace y compártelo:', url);
        });
    } else {
      prompt('Copia este enlace y compártelo:', url);
    }
  }

  function importarDesdeHash() {
    const m = location.hash.match(/#lista=([^&]+)/);
    if (!m) return;

    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      if (!Array.isArray(data) || data.length === 0) return;

      const n = data.length;
      const msg =
        'Alguien compartió contigo una lista de compras con ' +
        n +
        (n === 1 ? ' ítem' : ' ítems') +
        '.\n\n' +
        '¿Quieres reemplazar tu lista actual por esta?';

      if (!confirm(msg)) {
        history.replaceState(null, '', location.pathname);
        return;
      }

      lista = data
        .map(function (x, i) {
          return {
            id: 'imp_' + Date.now() + '_' + i,
            texto: String(x.t || '').trim(),
            comprado: !!x.c,
          };
        })
        .filter(function (x) {
          return x.texto;
        });

      guardar();
      history.replaceState(null, '', location.pathname);

      setTimeout(function () {
        abrirPanel();
      }, 300);
    } catch (e) {
      history.replaceState(null, '', location.pathname);
    }
  }

  function actualizarUI() {
    const badge = document.getElementById('shopping-badge');
    const content = document.getElementById('shopping-content');
    if (!badge || !content) return;

    const pendientes = lista.filter((i) => !i.comprado).length;
    badge.textContent = pendientes;
    badge.style.display = lista.length === 0 ? 'none' : 'flex';

    if (lista.length === 0) {
      content.innerHTML =
        '<p style="text-align:center;color:var(--suave);margin-top:2rem;font-style:italic;">Tu lista está vacía.<br>Agrega ingredientes desde las recetas.</p>';
      return;
    }

    const pendientesHTML = lista
      .filter((i) => !i.comprado)
      .map(crearItemHTML)
      .join('');
    const compradosHTML = lista
      .filter((i) => i.comprado)
      .map(crearItemHTML)
      .join('');

    let html = '';
    if (pendientesHTML) html += `<div class="shop-group">${pendientesHTML}</div>`;
    if (compradosHTML)
      html += `<div class="shop-group shop-group-done"><h3>Comprados</h3>${compradosHTML}</div>`;

    content.innerHTML = html;

    content.querySelectorAll('.shop-check').forEach((btn) => {
      btn.addEventListener('click', () => toggleComprado(btn.dataset.id));
    });
    content.querySelectorAll('.shop-del').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        eliminarItem(btn.dataset.id);
      });
    });
  }

  function crearItemHTML(item) {
    return `
      <div class="shop-item ${item.comprado ? 'shop-item-done' : ''}">
        <button class="shop-check" data-id="${item.id}" aria-label="Marcar como comprado">
          ${item.comprado ? '✓' : ''}
        </button>
        <span class="shop-text">${escaparHtml(item.texto)}</span>
        <button class="shop-del" data-id="${item.id}" aria-label="Eliminar">✕</button>
      </div>
    `;
  }

  function abrirPanel() {
    const panel = document.getElementById('shopping-panel');
    const overlay = document.getElementById('shopping-overlay');
    if (!panel || !overlay) return;
    panel.classList.add('abierto');
    overlay.classList.add('abierto');
    document.body.style.overflow = 'hidden';
  }

  function cerrarPanel() {
    const panel = document.getElementById('shopping-panel');
    const overlay = document.getElementById('shopping-overlay');
    if (!panel || !overlay) return;
    panel.classList.remove('abierto');
    overlay.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  window.ListaCompras = {
    agregar: agregarItem,
    agregarItem: agregarItemLista,
    abrir: abrirPanel,
    cerrar: cerrarPanel,
    contar: function () {
      return lista.length;
    },
    compartirWhatsApp: compartirWhatsApp,
    compartirLink: compartirLink,
  };

  window.agregarItemLista = agregarItemLista;

  document.addEventListener('click', function (e) {
    const btnAdd = e.target.closest('.btn-add-ing');
    if (btnAdd) {
      e.preventDefault();
      const texto = btnAdd.dataset.ing;
      if (texto) agregarItem(texto);
      const originalText = btnAdd.textContent;
      btnAdd.textContent = '✓';
      btnAdd.style.color = 'var(--rojo)';
      btnAdd.style.borderColor = 'var(--rojo)';
      setTimeout(() => {
        btnAdd.textContent = originalText;
        btnAdd.style.color = '';
        btnAdd.style.borderColor = '';
      }, 1000);
      return;
    }

    const btnAddAll = e.target.closest('.btn-add-all');
    if (btnAddAll) {
      e.preventDefault();

      let ings = null;

      const dataEl = document.getElementById('receta-data');
      if (dataEl) {
        try {
          const receta = JSON.parse(dataEl.textContent);
          if (receta && Array.isArray(receta.ingredientes)) {
            ings = receta.ingredientes;
          }
        } catch (err) {}
      }

      if (!ings) {
        const recetaIndex = btnAddAll.dataset.index;
        if (typeof RECETAS !== 'undefined' && RECETAS[recetaIndex]) {
          ings = RECETAS[recetaIndex].ingredientes || [];
        }
      }

      if (ings && ings.length > 0) {
        ings.forEach((ing) => agregarItem(ing));
        btnAddAll.textContent = '¡Añadidos!';
        setTimeout(() => {
          btnAddAll.textContent = 'Añadir todos los ingredientes';
        }, 2000);
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    crearInterfaz();
    actualizarUI();
    importarDesdeHash();
  });
})();
