/* =================================================================
   LISTA-COMPRAS.JS — Carrito flotante y lista de compras
   ================================================================= */
(function() {
  'use strict';

  const STORAGE_KEY = 'recetario_lista_compras';
  let lista = [];

  // Cargar datos al iniciar
  try {
    lista = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    lista = [];
  }

  // --- CREACIÓN DE LA INTERFAZ (FAB + PANEL) ---
  function crearInterfaz() {
    // Si ya existe (por si acaso), no hacemos nada
    if (document.getElementById('shopping-fab')) return;

    // 1. Botón Flotante (FAB)
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

    // 2. Panel Lateral y Fondo Oscuro
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
        <button type="button" class="btn-vaciar" id="btn-vaciar">Vaciar lista</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // Eventos de abrir/cerrar
    fab.addEventListener('click', abrirPanel);
    document.getElementById('shopping-close').addEventListener('click', cerrarPanel);
    overlay.addEventListener('click', cerrarPanel);
    document.getElementById('btn-vaciar').addEventListener('click', vaciarLista);
  }

  // --- LÓGICA DE DATOS ---
  function guardar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    actualizarUI();
  }

  function agregarItem(texto) {
    const textoLimpio = texto.trim();
    // Evitar duplicados exactos
    const existe = lista.find(item => item.texto.toLowerCase() === textoLimpio.toLowerCase());
    if (existe) {
      // Si existe y ya estaba comprado, lo desmarcamos
      if (existe.comprado) {
        existe.comprado = false;
        guardar();
      }
      abrirPanel(); // Mostramos el panel para que vea que ya está
      return;
    }
    
    lista.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      texto: textoLimpio,
      comprado: false
    });
    guardar();
    abrirPanel();
  }

  function toggleComprado(id) {
    const item = lista.find(i => i.id === id);
    if (item) {
      item.comprado = !item.comprado;
      guardar();
    }
  }

  function eliminarItem(id) {
    lista = lista.filter(i => i.id !== id);
    guardar();
  }

  function vaciarLista() {
    if (confirm('¿Seguro que quieres vaciar toda la lista?')) {
      lista = [];
      guardar();
    }
  }

  // --- RENDERIZADO ---
  function actualizarUI() {
    const badge = document.getElementById('shopping-badge');
    const content = document.getElementById('shopping-content');
    if (!badge || !content) return;

    // Actualizar el globito rojo
    const pendientes = lista.filter(i => !i.comprado).length;
    badge.textContent = pendientes;
    badge.style.display = lista.length === 0 ? 'none' : 'flex';

    // Renderizar la lista
    if (lista.length === 0) {
      content.innerHTML = '<p style="text-align:center;color:var(--suave);margin-top:2rem;font-style:italic;">Tu lista está vacía.<br>Agrega ingredientes desde las recetas.</p>';
      return;
    }

    // Agrupar por estado
    const pendientesHTML = lista.filter(i => !i.comprado).map(crearItemHTML).join('');
    const compradosHTML = lista.filter(i => i.comprado).map(crearItemHTML).join('');

    let html = '';
    if (pendientesHTML) html += `<div class="shop-group">${pendientesHTML}</div>`;
    if (compradosHTML) html += `<div class="shop-group shop-group-done"><h3>Comprados</h3>${compradosHTML}</div>`;
    
    content.innerHTML = html;

    // Agregar eventos a los botones recién creados
    content.querySelectorAll('.shop-check').forEach(btn => {
      btn.addEventListener('click', () => toggleComprado(btn.dataset.id));
    });
    content.querySelectorAll('.shop-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se marque como comprado al borrar
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
        <span class="shop-text">${item.texto}</span>
        <button class="shop-del" data-id="${item.id}" aria-label="Eliminar">✕</button>
      </div>
    `;
  }

  function abrirPanel() {
    document.getElementById('shopping-panel').classList.add('abierto');
    document.getElementById('shopping-overlay').classList.add('abierto');
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
  }

  function cerrarPanel() {
    document.getElementById('shopping-panel').classList.remove('abierto');
    document.getElementById('shopping-overlay').classList.remove('abierto');
    document.body.style.overflow = '';
  }

  // --- EVENTOS GLOBALES (Capturar clics en botones "+") ---
  document.addEventListener('click', function(e) {
    // Botón individual
    const btnAdd = e.target.closest('.btn-add-ing');
    if (btnAdd) {
      e.preventDefault();
      const texto = btnAdd.dataset.ing;
      if (texto) agregarItem(texto);
      // Efecto visual rápido
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

    // Botón "Añadir todos"
    const btnAddAll = e.target.closest('.btn-add-all');
    if (btnAddAll) {
      e.preventDefault();
      const recetaIndex = btnAddAll.dataset.index;
      // Asumimos que RECETAS es global (viene de recetas.js)
      if (typeof RECETAS !== 'undefined' && RECETAS[recetaIndex]) {
        const ings = RECETAS[recetaIndex].ingredientes || [];
        ings.forEach(ing => agregarItem(ing));
        btnAddAll.textContent = '¡Añadidos!';
        setTimeout(() => { btnAddAll.textContent = 'Añadir todos los ingredientes'; }, 2000);
      }
    }
  });

  // --- INICIALIZACIÓN ---
  document.addEventListener('DOMContentLoaded', () => {
    crearInterfaz();
    actualizarUI();
  });

})();