/* =================================================================
   MODO-COCINA.JS — Overlay de cocina a pantalla completa
   Fase 1: Focus trap, inert externo, aria-live, atajos de teclado
   Fase 2: Marcar pasos hechos, progreso persistente, pantalla final
   Fase 3: Temporizadores, vibración, persistencia
   FASE 4: Mise en place
   FASE 5: Text-to-Speech (TTS) y Comandos de Voz (Manos Libres)
   FASE 6: Recordatorio visual de comandos y Auto-Timer con cuenta regresiva
   FASE 7 (mise): Comandos de voz específicos para mise en place
   FASE 7 (voz fiable): interpretarComando, eco, pausa/reanudar/tiempo/ingredientes,
                 sin alert() ni confirm() (reinicio con doble toque).
   FASE 8: al abrir el overlay, se envía CACHE_RECIPE al service worker
           para guardar la página de la receta y su imagen.
   FASE 9: alarma visible a pantalla completa cuando termina un timer.
   FASE 10: si la receta trae revisado_v2 === true, usa ingredientes_v2,
            pasos_v2 y preparacion para el mise en place; reemplaza {ing:N}
            en los pasos; desactiva el aviso de la Fase 3.
   FASE 6H (rediseño móvil): header minimalista (Cerrar · Título+Paso · Mic · ⋯)
            y bottom sheet (action sheet) con tipografía, TTS, mise en place,
            reiniciar y atajos. En desktop el sheet es un popover.
   ================================================================= */

import { detectarTiempos } from '../lib/tiempos.js';
import { interpretarComando } from '../lib/voz.js';
import {
  formatearIngredienteEstructurado,
  reemplazarMarcasIngredientes
} from '../lib/escalado.js';

(function () {
  'use strict';
  if (window.ModoCocina) return;

  // ---- Estado ----
  var WAKE_LOCK = null;
  var overlayEl = null;
  var recetaActual = null;
  var recetaSlug = null;
  var pasoActual = 0;
  var pasosHechos = [];
  var autoAvanzar = true;
  var timers = [];
  var audioCtx = null;
  var sonidoActivo = true;
  var intervaloTick = null;
  var botonOrigen = null;
  var onKeyDownHandler = null;
  var inertedElements = [];
  var prep = null;
  var miseHechas = [];
  var miseTerminada = false;
  var enMise = false;
  var miseActual = -1;

  // FASE 10: datos v2 de la receta actual
  var esV2 = false;
  var ingredientesV2 = null;
  var pasosV2 = null;

  var ttsActivo = false;
  var microActivo = false;
  var recognition = null;
  var autoTimerActivo = true;
  var countdownInterval = null;
  var countdownBtn = null;
  var autoTimerLanzados = new Set();

  // FASE 7: eco de voz y avisos dentro del overlay
  var ecoTimeout = null;
  var avisoTimeout = null;
  var reiniciarPendiente = null;

  // FASE 9: alarma visible + loop de sonido
  var alarmaTimer = null;
  var alarmaLoopTimeout = null;

  // FASE 6: tamaño de letra del paso
  var NIVELES_FS = [1, 1.25, 1.5];
  var fsNivel = 0;

  // ---- Constantes ----
  var STORAGE_PROGRESO = 'mc_progreso_';
  var STORAGE_AUTOAVANZAR = 'mc_autoavanzar';
  var STORAGE_TIMERS = 'mc_timers_';
  var STORAGE_SONIDO = 'mc_sonido';
  var STORAGE_MISE = 'mc_mise_';
  var STORAGE_TTS = 'mc_tts';
  var STORAGE_AUTOTIMER = 'mc_autotimer';
  var STORAGE_FS = 'mc_fs';
  var STORAGE_NOTIF_PEDIDO = 'mc_notif_pedido';
  var AUTO_ADVANCE_DELAY = 400;
  var TICK_MS = 250;
  var ALARMA_REPETIR_MS = 3000;

  var ETIQUETAS_VOZ = {
    'siguiente': 'siguiente',
    'atras': 'atrás',
    'listo': 'listo',
    'repetir': 'repetir',
    'empezar': 'empezar',
    'pausa': 'pausa',
    'reanudar': 'reanudar',
    'tiempo': 'cuánto falta',
    'ingredientes': 'ingredientes'
  };

  // ---- Utilidades ----
  function escaparHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function slugify(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function anunciar(msg) {
    if (!overlayEl) return;
    var live = overlayEl.querySelector('.mc-live');
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 50);
  }

  function mostrarEcoVoz(cmd) {
    if (!overlayEl) return;
    var eco = overlayEl.querySelector('.mc-voz-eco');
    if (!eco) return;
    eco.textContent = 'Entendí: ' + (ETIQUETAS_VOZ[cmd] || cmd);
    eco.hidden = false;
    if (ecoTimeout) clearTimeout(ecoTimeout);
    ecoTimeout = setTimeout(function () { eco.hidden = true; }, 2000);
  }

  function mostrarAvisoOverlay(msg) {
    if (!overlayEl) return;
    var aviso = overlayEl.querySelector('.mc-aviso-voz');
    if (!aviso) return;
    aviso.textContent = msg;
    aviso.hidden = false;
    anunciar(msg);
    if (avisoTimeout) clearTimeout(avisoTimeout);
    avisoTimeout = setTimeout(function () { aviso.hidden = true; }, 5000);
  }

  function getFocusables(container) {
    var selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    var nodes = container.querySelectorAll(selector);
    return Array.prototype.filter.call(nodes, function (el) {
      if (el.hidden) return false;
      var style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function limpiarAutoTimer() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    if (countdownBtn) {
      countdownBtn.innerHTML = countdownBtn.dataset.label;
      countdownBtn.disabled = false;
      countdownBtn.classList.remove('mc-timer-countdown');
      countdownBtn = null;
    }
  }

  function iniciarCuentaRegresiva(btnTimer, minutos, pasoIdx) {
    limpiarAutoTimer();
    let segundos = 4;

    if (!btnTimer.dataset.label) {
      btnTimer.dataset.label = btnTimer.innerHTML;
    }
    countdownBtn = btnTimer;

    btnTimer.innerHTML = `<span aria-hidden="true">⏳</span> Iniciando en ${segundos}s… toca para cancelar`;
    btnTimer.classList.add('mc-timer-countdown');

    countdownInterval = setInterval(() => {
      segundos--;
      if (segundos > 0) {
        btnTimer.innerHTML = `<span aria-hidden="true">⏳</span> Iniciando en ${segundos}s… toca para cancelar`;
      } else {
        limpiarAutoTimer();
        iniciarTimer(pasoIdx, minutos);
      }
    }, 1000);
  }

  function actualizarBotonMicro() {
    if (!overlayEl) return;
    var btn = overlayEl.querySelector('.mc-mic-toggle');
    var hint = overlayEl.querySelector('.mc-voice-hint');
    if (btn) {
      btn.setAttribute('aria-pressed', microActivo ? 'true' : 'false');
      btn.classList.toggle('activo', microActivo);
    }
    if (hint) {
      hint.hidden = !microActivo;
    }
  }

  function cargarFs() {
    try {
      var v = parseFloat(localStorage.getItem(STORAGE_FS));
      if (!isNaN(v)) {
        var idx = NIVELES_FS.indexOf(v);
        if (idx >= 0) fsNivel = idx;
      }
    } catch (e) {}
  }

  function guardarFs() {
    try { localStorage.setItem(STORAGE_FS, String(NIVELES_FS[fsNivel])); } catch (e) {}
  }

  function aplicarFs() {
    if (!overlayEl) return;
    overlayEl.style.setProperty('--mc-fs', String(NIVELES_FS[fsNivel]));
    var btnMenos = overlayEl.querySelector('.mc-fs-menos');
    var btnMas = overlayEl.querySelector('.mc-fs-mas');
    if (btnMenos) btnMenos.disabled = fsNivel === 0;
    if (btnMas) btnMas.disabled = fsNivel === NIVELES_FS.length - 1;
    // FASE 6H — valor visible en el sheet
    var fsValor = overlayEl.querySelector('.mc-sheet-fs-valor');
    if (fsValor) fsValor.textContent = Math.round(NIVELES_FS[fsNivel] * 100) + '%';
  }

  function cambiarFs(delta) {
    var nuevo = fsNivel + delta;
    if (nuevo < 0 || nuevo >= NIVELES_FS.length) return;
    fsNivel = nuevo;
    guardarFs();
    aplicarFs();
    anunciar('Tamaño de letra: ' + Math.round(NIVELES_FS[fsNivel] * 100) + '%');
  }

  function initTTS() {
    if (!('speechSynthesis' in window)) {
      var ttsBtn = overlayEl.querySelector('.mc-tts-toggle');
      if (ttsBtn) ttsBtn.style.display = 'none';
    } else {
      window.speechSynthesis.getVoices();
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      var micBtn = overlayEl.querySelector('.mc-mic-toggle');
      if (micBtn) micBtn.style.display = 'none';
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'es-CL';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = function(e) {
      if (!microActivo) return;
      var texto = e.results[e.results.length - 1][0].transcript;
      var cmd = interpretarComando(texto, enMise);

      if (cmd === null) return;

      mostrarEcoVoz(cmd);

      if (enMise) {
        if (cmd === 'empezar') salirMise();
        else if (cmd === 'listo') marcarTareaMiseActual();
        else if (cmd === 'siguiente') siguienteTareaMise();
        else if (cmd === 'atras') anteriorTareaMise();
        else if (cmd === 'repetir') leerTareaMiseActual();
        return;
      }

      if (cmd === 'siguiente') {
        pasoSiguiente();
      } else if (cmd === 'atras') {
        pasoAnterior();
      } else if (cmd === 'listo') {
        marcarYAvanzar();
      } else if (cmd === 'repetir') {
        var stepText = overlayEl.querySelector('.mc-paso.activo .mc-paso-texto');
        if (stepText) leerTexto(stepText.textContent, true);
      } else if (cmd === 'pausa') {
        var timerCorriendo = null;
        for (var i = 0; i < timers.length; i++) {
          if (timers[i].paso === pasoActual && timers[i].estado === 'corriendo') {
            timerCorriendo = timers[i];
            break;
          }
        }
        if (timerCorriendo) pausarTimer(timerCorriendo.id);
        else {
          anunciar('No hay temporizador activo en este paso.');
        }
      } else if (cmd === 'reanudar') {
        var timerPausado = null;
        for (var j = 0; j < timers.length; j++) {
          if (timers[j].paso === pasoActual && timers[j].estado === 'pausado') {
            timerPausado = timers[j];
            break;
          }
        }
        if (timerPausado) reanudarTimer(timerPausado.id);
        else {
          anunciar('No hay temporizador pausado en este paso.');
        }
      } else if (cmd === 'tiempo') {
        leerTiempoRestante();
      } else if (cmd === 'ingredientes') {
        leerIngredientes();
      }
    };

    recognition.onerror = function(e) {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        microActivo = false;
        actualizarBotonMicro();
        mostrarAvisoOverlay('Permiso de micrófono denegado. No se pueden usar los comandos de voz.');
      } else if (e.error === 'network') {
        microActivo = false;
        actualizarBotonMicro();
        mostrarAvisoOverlay('Los comandos de voz necesitan internet en este navegador.');
      }
    };

    recognition.onend = function() {
      if (microActivo) {
        try { recognition.start(); } catch(e) {}
      }
    };
  }

  function formatTiempoVoz(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(totalSec / 3600);
    var mi = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var partes = [];
    if (h > 0) partes.push(h + (h === 1 ? ' hora' : ' horas'));
    if (mi > 0) partes.push(mi + (mi === 1 ? ' minuto' : ' minutos'));
    if (s > 0 || partes.length === 0) partes.push(s + (s === 1 ? ' segundo' : ' segundos'));
    return partes.join(' y ');
  }

  function leerTiempoRestante() {
    var timerActivo = null;
    for (var i = 0; i < timers.length; i++) {
      if (timers[i].paso === pasoActual && timers[i].estado === 'corriendo') {
        timerActivo = timers[i];
        break;
      }
    }
    if (!timerActivo) {
      for (var j = 0; j < timers.length; j++) {
        if (timers[j].paso === pasoActual && timers[j].estado === 'pausado') {
          timerActivo = timers[j];
          break;
        }
      }
    }
    if (!timerActivo) {
      var msg = 'No hay temporizador activo en este paso.';
      anunciar(msg);
      leerTexto(msg, true);
      return;
    }
    var restante = timerActivo.estado === 'corriendo'
      ? Math.max(0, timerActivo.finTimestamp - Date.now())
      : timerActivo.restanteAlPausar;
    var msgOk = 'Quedan ' + formatTiempoVoz(restante);
    anunciar(msgOk);
    leerTexto(msgOk, true);
  }

  function leerIngredientes() {
    var ings;
    if (esV2 && Array.isArray(ingredientesV2)) {
      ings = ingredientesV2.map(formatearIngredienteEstructurado);
    } else {
      ings = (recetaActual && recetaActual.ingredientes) || [];
    }
    if (ings.length === 0) {
      var msg = 'Esta receta no tiene ingredientes listados.';
      anunciar(msg);
      leerTexto(msg, true);
      return;
    }
    var msgOk = 'Ingredientes: ' + ings.join(', ');
    anunciar('Leyendo ingredientes');
    leerTexto(msgOk, true);
  }

  function leerTexto(texto, forzar) {
    if (!('speechSynthesis' in window)) return;

    if (recognition && microActivo) {
      try { recognition.stop(); } catch(e) {}
    }

    window.speechSynthesis.cancel();
    if (!ttsActivo && !forzar) return;

    var msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'es-CL';
    msg.rate = 0.95;
    msg.pitch = 1;

    var voces = window.speechSynthesis.getVoices();
    var vozEs = voces.find(function(v) { return v.lang === 'es-CL'; }) ||
                voces.find(function(v) { return v.lang.startsWith('es'); });
    if (vozEs) msg.voice = vozEs;

    msg.onend = function() {
      if (recognition && microActivo) {
        try { recognition.start(); } catch(e) {}
      }
    };

    window.speechSynthesis.speak(msg);
  }

  function cargarAjustes() {
    try {
      autoTimerActivo = localStorage.getItem(STORAGE_AUTOTIMER) === 'true';
      ttsActivo = localStorage.getItem(STORAGE_TTS) === 'true';
      autoAvanzar = localStorage.getItem(STORAGE_AUTOAVANZAR) !== 'false';
      sonidoActivo = localStorage.getItem(STORAGE_SONIDO) !== 'false';
    } catch(e) {}
  }

  function guardarAutoTimer(v) {
    try { localStorage.setItem(STORAGE_AUTOTIMER, v ? 'true' : 'false'); } catch (e) {}
  }

  function guardarTTS(v) {
    try { localStorage.setItem(STORAGE_TTS, v ? 'true' : 'false'); } catch (e) {}
  }

  function aplicarInert(activo) {
    if (activo) {
      inertedElements = [];
      var children = document.body.children;
      for (var i = 0; i < children.length; i++) {
        var el = children[i];
        if (el === overlayEl) continue;
        if (el.hasAttribute('inert')) continue;
        var tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'LINK' || tag === 'META') continue;
        el.setAttribute('inert', '');
        inertedElements.push(el);
      }
    } else {
      inertedElements.forEach(function (el) { el.removeAttribute('inert'); });
      inertedElements = [];
    }
  }

  function manejarTab(e) {
    if (e.key !== 'Tab') return;
    var focusables = getFocusables(overlayEl);
    if (focusables.length === 0) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function guardarEstado() {
    if (!recetaSlug) return;
    try { localStorage.setItem(STORAGE_PROGRESO + recetaSlug, JSON.stringify({ pasoActual: pasoActual, pasosHechos: pasosHechos, version: 1 })); } catch (e) {}
  }

  function cargarEstado(totalPasos) {
    if (!recetaSlug) return null;
    try {
      var raw = localStorage.getItem(STORAGE_PROGRESO + recetaSlug);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.pasosHechos) || data.pasosHechos.length !== totalPasos) return null;
      var pa = parseInt(data.pasoActual, 10);
      if (isNaN(pa) || pa < 0 || pa >= totalPasos) pa = 0;
      return { pasoActual: pa, pasosHechos: data.pasosHechos.map(function (v) { return !!v; }) };
    } catch (e) { return null; }
  }

  function limpiarEstado() { if (!recetaSlug) return; try { localStorage.removeItem(STORAGE_PROGRESO + recetaSlug); } catch (e) {} }
  function guardarAutoAvanzar(v) { try { localStorage.setItem(STORAGE_AUTOAVANZAR, v ? 'true' : 'false'); } catch (e) {} }

  function initAudio() { if (audioCtx) return; try { var Ctx = window.AudioContext || window.webkitAudioContext; if (Ctx) audioCtx = new Ctx(); } catch (e) { audioCtx = null; } }

  function playDing() {
    if (!audioCtx || !sonidoActivo) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    function golpe() {
      if (!audioCtx || !sonidoActivo) return;
      var ahora = audioCtx.currentTime;
      [880, 1320, 1760].forEach(function (freq, i) {
        var osc = audioCtx.createOscillator(); var gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ahora); gain.gain.linearRampToValueAtTime(0.25 / (i + 1), ahora + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, ahora + 1.2);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(ahora); osc.stop(ahora + 1.3);
      });
    }
    golpe(); setTimeout(golpe, 1400);
  }

  function playTick() {
    if (!audioCtx || !sonidoActivo) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    var ahora = audioCtx.currentTime; var osc = audioCtx.createOscillator(); var gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = 660;
    gain.gain.setValueAtTime(0, ahora); gain.gain.linearRampToValueAtTime(0.15, ahora + 0.01); gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.15);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(ahora); osc.stop(ahora + 0.2);
  }

  function guardarSonido(v) { try { localStorage.setItem(STORAGE_SONIDO, v ? 'true' : 'false'); } catch (e) {} }

  function formatTiempo(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000)); var h = Math.floor(totalSec / 3600); var mi = Math.floor((totalSec % 3600) / 60); var s = totalSec % 60;
    if (h > 0) return h + ':' + String(mi).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return String(mi).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function guardarTimers() {
    if (!recetaSlug) return;
    try {
      var data = timers.map(function (t) {
        return {
          id: t.id, paso: t.paso, duracionTotal: t.duracionTotal,
          finTimestamp: t.finTimestamp, restanteAlPausar: t.restanteAlPausar,
          estado: t.estado, etiqueta: t.etiqueta, yaAlertado: !!t.yaAlertado
        };
      });
      localStorage.setItem(STORAGE_TIMERS + recetaSlug, JSON.stringify(data));
    } catch (e) {}
  }

  function cargarTimersGuardados() {
    if (!recetaSlug) return [];
    try {
      var raw = localStorage.getItem(STORAGE_TIMERS + recetaSlug); if (!raw) return [];
      var data = JSON.parse(raw); if (!Array.isArray(data)) return [];
      var ahora = Date.now();
      return data.map(function (t) {
        var estado = t.estado;
        if (estado === 'corriendo' && t.finTimestamp && t.finTimestamp <= ahora) {
          estado = 'terminado';
          return {
            id: t.id, paso: t.paso, duracionTotal: t.duracionTotal,
            finTimestamp: t.finTimestamp, restanteAlPausar: t.restanteAlPausar || 0,
            estado: estado, etiqueta: t.etiqueta, yaAlertado: false
          };
        }
        return {
          id: t.id, paso: t.paso, duracionTotal: t.duracionTotal,
          finTimestamp: t.finTimestamp, restanteAlPausar: t.restanteAlPausar || 0,
          estado: estado, etiqueta: t.etiqueta, yaAlertado: t.yaAlertado === true
        };
      });
    } catch (e) { return []; }
  }

  function iniciarTimer(paso, minutos) {
    if (minutos <= 0) return;
    initAudio();
    var ahora = Date.now();
    timers.push({
      id: 't_' + ahora + '_' + Math.random().toString(36).slice(2, 7),
      paso: paso,
      duracionTotal: minutos * 60 * 1000,
      finTimestamp: ahora + minutos * 60 * 1000,
      restanteAlPausar: 0,
      estado: 'corriendo',
      etiqueta: 'Paso ' + (paso + 1) + ' — ' + minutos + ' min',
      yaAlertado: false
    });
    guardarTimers(); playTick(); renderTimers();
    anunciar('Temporizador iniciado: ' + minutos + ' minutos');
  }

  function pausarTimer(id) {
    var t = timers.find(function (x) { return x.id === id; }); if (!t || t.estado !== 'corriendo') return;
    t.restanteAlPausar = Math.max(0, t.finTimestamp - Date.now()); t.estado = 'pausado'; guardarTimers(); renderTimers(); anunciar('Temporizador pausado');
  }

  function reanudarTimer(id) {
    var t = timers.find(function (x) { return x.id === id; }); if (!t || t.estado !== 'pausado') return;
    t.finTimestamp = Date.now() + t.restanteAlPausar; t.estado = 'corriendo'; guardarTimers(); renderTimers(); anunciar('Temporizador reanudado');
  }

  function agregarTiempo(id, minutos) {
    var t = timers.find(function (x) { return x.id === id; }); if (!t) return;
    var extra = minutos * 60 * 1000;
    if (t.estado === 'terminado') { t.estado = 'corriendo'; t.finTimestamp = Date.now() + extra; t.duracionTotal = extra; t.yaAlertado = false; }
    else if (t.estado === 'pausado') { t.restanteAlPausar += extra; t.duracionTotal += extra; }
    else { t.finTimestamp += extra; t.duracionTotal += extra; }
    guardarTimers(); renderTimers(); anunciar('Añadido ' + minutos + (minutos === 1 ? ' minuto' : ' minutos'));
  }

  function cancelarTimer(id) {
    timers = timers.filter(function (x) { return x.id !== id; });
    guardarTimers(); renderTimers(); anunciar('Temporizador cancelado');
  }

  // ---- FASE 9: alarma y notificación ----
  function minutosDesdeFin(timer) {
    if (!timer || !timer.finTimestamp) return 0;
    var deltaMs = Date.now() - timer.finTimestamp;
    if (deltaMs < 60000) return 0;
    return Math.floor(deltaMs / 60000);
  }

  function iniciarLoopAlarma() {
    detenerLoopAlarma();
    function loop() {
      if (!alarmaTimer) return;
      playDing();
      alarmaLoopTimeout = setTimeout(loop, ALARMA_REPETIR_MS);
    }
    playDing();
    alarmaLoopTimeout = setTimeout(loop, ALARMA_REPETIR_MS);
  }

  function detenerLoopAlarma() {
    if (alarmaLoopTimeout) { clearTimeout(alarmaLoopTimeout); alarmaLoopTimeout = null; }
  }

  function mostrarAlarma(timer) {
    if (!overlayEl) return;
    var alarma = overlayEl.querySelector('.mc-alarma');
    if (!alarma) return;

    alarma.querySelector('.mc-alarma-paso').textContent = 'Paso ' + (timer.paso + 1);
    alarma.querySelector('.mc-alarma-etiqueta').textContent = timer.etiqueta || '';

    var deltaMin = minutosDesdeFin(timer);
    var texto = deltaMin >= 1
      ? 'Se acabó el tiempo (hace ' + deltaMin + (deltaMin === 1 ? ' minuto' : ' minutos') + ')'
      : 'Se acabó el tiempo';
    alarma.querySelector('.mc-alarma-texto').textContent = texto;

    alarma.hidden = false;
    alarmaTimer = timer;

    var btnDetener = alarma.querySelector('.mc-alarma-detener');
    if (btnDetener) {
      try { btnDetener.focus({ preventScroll: true }); } catch (e) { btnDetener.focus(); }
    }

    iniciarLoopAlarma();
  }

  function detenerAlarma() {
    detenerLoopAlarma();
    if (overlayEl) {
      var alarma = overlayEl.querySelector('.mc-alarma');
      if (alarma) alarma.hidden = true;
    }
    alarmaTimer = null;
  }

  function mostrarNotificacion(timer, msg) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready.then(function (reg) {
      reg.showNotification('Se acabó el tiempo — ' + timer.etiqueta, {
        body: msg,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'mc-timer-' + timer.id,
        requireInteraction: true
      });
    }).catch(function () {});
  }

  function pedirPermisoNotif() {
    if (!('Notification' in window)) {
      anunciar('Este navegador no soporta notificaciones');
      return;
    }
    Notification.requestPermission().then(function (permiso) {
      try { localStorage.setItem(STORAGE_NOTIF_PEDIDO, 'true'); } catch (e) {}
      if (permiso === 'granted') anunciar('Notificaciones activadas');
      else if (permiso === 'denied') anunciar('Notificaciones bloqueadas por el navegador');
      else anunciar('Notificaciones no permitidas');
      renderTimers();
    });
  }

  function dispararAlerta(timer) {
    var deltaMin = minutosDesdeFin(timer);
    var msg;
    if (deltaMin >= 1) {
      msg = 'El temporizador del ' + timer.etiqueta + ' terminó hace ' + deltaMin + (deltaMin === 1 ? ' minuto' : ' minutos');
    } else {
      msg = 'Temporizador finalizado: ' + timer.etiqueta;
    }
    anunciar(msg);
    if (ttsActivo) leerTexto(msg);

    mostrarAlarma(timer);

    if (document.hidden) {
      mostrarNotificacion(timer, msg);
    }
  }

  function tickTimers() {
    if (!overlayEl || !overlayEl.classList.contains('abierto')) return;
    var ahora = Date.now(); var cambioEstado = false;
    timers.forEach(function (t) {
      if (t.estado === 'corriendo' && t.finTimestamp <= ahora) {
        t.estado = 'terminado'; cambioEstado = true;
        if (!t.yaAlertado) { t.yaAlertado = true; dispararAlerta(t); }
      } else if (t.estado === 'terminado' && !t.yaAlertado) {
        t.yaAlertado = true;
        cambioEstado = true;
        dispararAlerta(t);
      }
    });
    if (cambioEstado) { guardarTimers(); renderTimers(); return; }
    timers.forEach(function (t) {
      if (t.estado !== 'corriendo') return;
      var el = overlayEl.querySelector('.mc-timer-chip[data-id="' + t.id + '"] .mc-timer-tiempo');
      if (el) el.textContent = formatTiempo(Math.max(0, t.finTimestamp - ahora));
    });
  }

  function renderTimerChip(t, enPaso, esPrimerActivo) {
    var ahora = Date.now();
    var restante = t.estado === 'corriendo' ? Math.max(0, t.finTimestamp - ahora) : (t.estado === 'pausado' ? t.restanteAlPausar : 0);
    var clase = 'mc-timer-chip' + (t.estado === 'terminado' ? ' mc-timer-terminado' : (t.estado === 'pausado' ? ' mc-timer-pausado' : ''));
    var botones = '';
    if (t.estado === 'corriendo') botones += '<button type="button" class="mc-timer-btn" data-action="pausar" data-id="' + t.id + '" aria-label="Pausar temporizador">⏸</button>';
    else if (t.estado === 'pausado') botones += '<button type="button" class="mc-timer-btn" data-action="reanudar" data-id="' + t.id + '" aria-label="Reanudar temporizador">▶</button>';
    botones += '<button type="button" class="mc-timer-btn" data-action="agregar" data-id="' + t.id + '" aria-label="Añadir 1 minuto">+1</button>';
    botones += '<button type="button" class="mc-timer-btn mc-timer-btn-cerrar" data-action="cancelar" data-id="' + t.id + '" aria-label="Cancelar temporizador">×</button>';
    var icono = t.estado === 'terminado' ? '🔔' : '⏱';
    var labelHtml = enPaso ? '' : '<span class="mc-timer-label">Paso ' + (t.paso + 1) + '</span>';
    var chip = '<div class="' + clase + '" data-id="' + t.id + '"><span class="mc-timer-icono" aria-hidden="true">' + icono + '</span>' + labelHtml + '<span class="mc-timer-tiempo">' + formatTiempo(restante) + '</span><div class="mc-timer-acciones">' + botones + '</div></div>';

    var extras = '';
    if (esPrimerActivo) {
      extras += '<div class="mc-timer-aviso">Para que suene, deja esta pantalla abierta</div>';
      var permisoDefault = ('Notification' in window) && Notification.permission === 'default';
      var yaPedido = false;
      try { yaPedido = localStorage.getItem(STORAGE_NOTIF_PEDIDO) === 'true'; } catch (e) {}
      if (permisoDefault && !yaPedido && t.estado === 'corriendo') {
        extras += '<button type="button" class="mc-timer-notif-btn" data-action="pedir-notif">🔔 Avisarme cuando termine</button>';
      }
    }
    return chip + extras;
  }

  function renderTimers() {
    if (!overlayEl) return;
    overlayEl.querySelectorAll('.mc-paso-timer').forEach(function (c) { c.innerHTML = ''; c.hidden = true; });
    var pasoCont = overlayEl.querySelector('.mc-paso.activo .mc-paso-timer');
    var strip = overlayEl.querySelector('.mc-timers');
    var delPaso = timers.filter(function (t) { return t.paso === pasoActual; });
    var otros = timers.filter(function (t) { return t.paso !== pasoActual; });

    var primerTimerActivo = timers.find(function (t) { return t.estado !== 'terminado'; });
    var primerId = primerTimerActivo ? primerTimerActivo.id : null;

    if (pasoCont && delPaso.length > 0) {
      pasoCont.innerHTML = delPaso.map(function (t) {
        return renderTimerChip(t, true, t.id === primerId);
      }).join('');
      pasoCont.hidden = false;
    }
    if (!strip) return;
    if (otros.length === 0) { strip.innerHTML = ''; strip.hidden = true; return; }
    strip.hidden = false;
    strip.innerHTML = otros.map(function (t) {
      return renderTimerChip(t, false, t.id === primerId);
    }).join('');
  }

  async function solicitarWakeLock() { try { if ('wakeLock' in navigator && !WAKE_LOCK) { WAKE_LOCK = await navigator.wakeLock.request('screen'); WAKE_LOCK.addEventListener('release', function () { WAKE_LOCK = null; }); } } catch (e) {} }
  function liberarWakeLock() { if (WAKE_LOCK) { try { WAKE_LOCK.release(); } catch (e) {} WAKE_LOCK = null; } }

  // ================= MISE EN PLACE =================
  var VERBOS = { remojar: 'Remojar', cocer: 'Cocer', enfriar: 'Enfriar', lavar: 'Lavar', pelar: 'Pelar', cascara: 'Sacar la cáscara', desgranar: 'Desgranar', cortar: 'Cortar', picar: 'Picar', laminar: 'Laminar', rallar: 'Rallar', exprimir: 'Exprimir', moler: 'Pisar', desmenuzar: 'Desmenuzar', derretir: 'Derretir', batir: 'Batir', cernir: 'Cernir' };
  var ORDEN_VERBOS = ['remojar', 'cocer', 'enfriar', 'lavar', 'pelar', 'cascara', 'desgranar', 'cortar', 'picar', 'laminar', 'rallar', 'exprimir', 'moler', 'desmenuzar', 'derretir', 'batir', 'cernir'];
  var BUCKET_DE = { remojar: 'adelantar', cocer: 'adelantar', enfriar: 'adelantar', lavar: 'limpiar', pelar: 'limpiar', cascara: 'limpiar', desgranar: 'limpiar', cortar: 'cortar', picar: 'cortar', laminar: 'cortar', rallar: 'rallar', exprimir: 'rallar', moler: 'rallar', desmenuzar: 'rallar', derretir: 'mezclar', batir: 'mezclar', cernir: 'mezclar' };
  var BUCKETS = [
    { id: 'adelantar', icono: '⏳', titulo: 'Adelantar (toma tiempo)' },
    { id: 'limpiar', icono: '🧼', titulo: 'Lavar y pelar' },
    { id: 'cortar', icono: '🔪', titulo: 'Cortar y picar' },
    { id: 'rallar', icono: '🧀', titulo: 'Rallar, exprimir y desmenuzar' },
    { id: 'mezclar', icono: '🥣', titulo: 'Derretir, batir y cernir' },
    { id: 'preparar', icono: '📋', titulo: 'Preparar' }
  ];
  var RE_CORTE = /\ben\s+(?:cubos|cubitos|cuadraditos|daditos|rodajas|rodajitas|trozos|trocitos|tiras|gajos|bastones|pluma|medallones|laminas|mitades|cuartos|rebanadas|juliana|aros)(?:\s+(?:muy\s+)?(?:finos?|finas?|pequenos?|pequenas?|gruesos?|gruesas?|medianos?|medianas?|delgados?|delgadas?|grandes))?\b/;
  var RE_OPCIONAL = /\(\s*opcional\b[^)]*\)/i;
  var RE_CALIDAD = /^\s+(?:muy\s+|bien\s+)?(?:fin[oa]s?|finamente|grues[oa]s?|menud[oa]s?|chic[oa]s?)\b/;
  var RE_SOLO_DESCRIPTOR = /^(?:bien\s+|muy\s+)?(?:remojad|lavad|picad|cortad|rallad|helad|desmenuzad|molid|cocid|derretid|batid|cernid|laminad|pelad|desgranad)[oa]s?\b|^en\s+(?:cubos|cubitos|rodajas|trozos|tiras|gajos|bastones|pluma|medallones|laminas|mitades|cuartos|rebanadas)\b/;

  function aPlano(s) { var out = ''; for (var i = 0; i < s.length; i++) { var c = s.charAt(i).normalize('NFD').charAt(0); out += c.toLowerCase(); } return out; }
  function dividirPiezas(texto) {
    var piezas = [], cur = '', depth = 0;
    for (var i = 0; i < texto.length; i++) { var ch = texto.charAt(i); if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1); if (depth === 0 && (ch === ',' || ch === ';')) { piezas.push(cur); cur = ''; continue; } cur += ch; }
    piezas.push(cur); var res = []; piezas.forEach(function (p) { p.split(/\s\+\s/).forEach(function (q) { q = q.trim(); if (q) res.push(q); }); });
    var unidas = []; res.forEach(function (p) { if (unidas.length && RE_SOLO_DESCRIPTOR.test(aPlano(p))) { unidas[unidas.length - 1] += ' ' + p; } else { unidas.push(p); } }); return unidas;
  }
  function limpiarBase(s) { return s.replace(/\s+/g, ' ').replace(/\s+([,.;)])/g, '$1').replace(/^[\s,;]+|[\s,;]+$/g, '').replace(/^y\s+/i, '').replace(/\s+(?:y|en|de|al)$/i, '').replace(/\s*\(\s*\)/g, '').trim(); }

  function analizarPieza(p, nounPrevio) {
    var plano = aPlano(p); var d = plano.replace(/\([^)]*\)/g, function (m) { return new Array(m.length + 1).join(' '); });
    if (/\bhielo\b/.test(d)) return null;
    var verbos = [], detalles = [], quitar = [], anticipado = false;
    function reg(k) { if (verbos.indexOf(k) < 0) verbos.push(k); }
    function marcar(a, b) { quitar.push([a, b]); }
    function buscar(re) { return re.exec(d); }
    var m;

    if ((m = buscar(/^(?:jugo|zumo) de\s+/))) { reg('exprimir'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/^ralladura de\s+/))) { reg('rallar'); detalles.push('solo la cáscara'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/^cascara de\s+/))) { reg('cascara'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\blavad[oa]s?\b/))) { reg('lavar'); marcar(m.index, m.index + m[0].length); } else {
      var pr = /\(([^)]*)\)/g, pm; while ((pm = pr.exec(plano))) { if (/^o\s/.test(pm[1])) continue; if (/\blavad[oa]s?\b/.test(pm[1])) reg('lavar'); }
    }
    if ((m = buscar(/\bpelad[oa]s?\b/))) { reg('pelar'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\bdesgranad[oa]s?\b/))) { reg('desgranar'); marcar(m.index, m.index + m[0].length); }

    if ((m = buscar(/\bremojad[oa]s?\b/))) {
      reg('remojar'); var fin = m.index + m[0].length; var cola = d.slice(fin); var corte = cola.search(/\s+y\s|[,;+]|$/); var trozo = cola.slice(0, corte);
      if (/^\s+(?:desde|en|por|durante|toda|con)\b/.test(trozo)) { detalles.push(p.slice(fin, fin + corte).trim()); marcar(m.index, fin + corte); if (/noche|hora|dia/.test(trozo)) anticipado = true; } else { marcar(m.index, fin); }
    }

    var coc = buscar(/\bcocid[oa]s?(?=\s+y\s+molid)/); if (coc) { reg('cocer'); marcar(coc.index, coc.index + coc[0].length); }
    if ((m = buscar(/\bhuevos?\s+(duros?)\b/))) { reg('cocer'); detalles.push('duros'); marcar(m.index + m[0].length - m[1].length - 1, m.index + m[0].length); }
    if (coc && (m = buscar(/(?:\by\s+)?\bmolid[oa]s?\b/))) { reg('moler'); marcar(m.index, m.index + m[0].length); }

    if ((m = buscar(/(\bde\s+)?(\bbien\s+)?\bhelad[oa]s?\s*$/)) && !m[1]) { reg('enfriar'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\bdesmenuzad[oa]s?\b/))) { reg('desmenuzar'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\bderretid[oa]s?\b/))) { reg('derretir'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\bbatid[oa]s?\b/))) { reg('batir'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\bcernid[oa]s?\b/))) { reg('cernir'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\blaminad[oa]s?\b/))) { reg('laminar'); marcar(m.index, m.index + m[0].length); }
    if ((m = buscar(/\brallad[oa]s?\b/))) { reg('rallar'); marcar(m.index, m.index + m[0].length); }

    if ((m = buscar(/\b(picad|cortad)[oa]s?\b/))) {
      reg(m[1] === 'picad' ? 'picar' : 'cortar'); var finP = m.index + m[0].length; marcar(m.index, finP);
      var q = RE_CALIDAD.exec(d.slice(finP)); if (q) { detalles.push(p.slice(finP, finP + q[0].length).trim()); marcar(finP, finP + q[0].length); }
    }
    if ((m = buscar(RE_CORTE))) { if (verbos.indexOf('picar') < 0) reg('cortar'); detalles.push(p.slice(m.index, m.index + m[0].length).trim()); marcar(m.index, m.index + m[0].length); }

    if (!verbos.length) return null;

    quitar.sort(function (a, b) { return a[0] - b[0]; }); var base = '', pos = 0;
    quitar.forEach(function (r) { if (r[0] >= pos) { base += p.slice(pos, r[0]); pos = r[1]; } else if (r[1] > pos) { pos = r[1]; } }); base += p.slice(pos);

    var opcional = RE_OPCIONAL.test(base); base = base.replace(RE_OPCIONAL, '');
    var para = /\s+(para\s+[a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)?)$/i.exec(base);
    if (para) { detalles.push(para[1]); base = base.slice(0, para.index); }
    base = limpiarBase(base);

    if (/^[\d½¼¾\/.,\- ]+$/.test(base) && nounPrevio) base = (base + ' ' + nounPrevio).trim();
    verbos.sort(function (a, b) { return ORDEN_VERBOS.indexOf(a) - ORDEN_VERBOS.indexOf(b); });
    var vistos = {}; detalles = detalles.filter(function (x) { x = x.trim(); if (!x || vistos[x]) return false; vistos[x] = 1; return true; });

    return { verbos: verbos, base: base, detalle: detalles.join(', '), opcional: opcional, anticipado: anticipado };
  }

  function etiquetaVerbos(verbos) {
    var nombres = verbos.map(function (k, i) { return i === 0 ? VERBOS[k] : VERBOS[k].charAt(0).toLowerCase() + VERBOS[k].slice(1); });
    if (nombres.length <= 1) return nombres[0] || '';
    return nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
  }

  function analizarPrep(ingredientes) {
    var tareas = [], amano = [];
    (ingredientes || []).forEach(function (linea) {
      var texto = String(linea).trim(); if (!texto) return;
      var seccion = '', opcionalLinea = false;
      var sm = /^([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñÑ ]{1,24}):\s+/.exec(texto);
      if (sm) { seccion = sm[1].trim(); texto = texto.slice(sm[0].length); if (/^opcional$/i.test(seccion)) { opcionalLinea = true; seccion = ''; } }
      var nounPrevio = '';
      dividirPiezas(texto).forEach(function (pieza) {
        var r = analizarPieza(pieza, nounPrevio);
        if (r) {
          var b = BUCKET_DE[r.verbos[0]];
          tareas.push({ id: tareas.length, seccion: seccion, verbos: r.verbos, etiqueta: etiquetaVerbos(r.verbos), texto: r.base || pieza, detalle: r.detalle, opcional: r.opcional || opcionalLinea, anticipado: r.anticipado, bucket: b });
          nounPrevio = r.base.replace(/^[\d½¼¾\/.,\- ]+(?:(?:g|kg|ml|l|cc|cdas?|cdtas?|tazas?|cucharadas?|cucharaditas?)\s+(?:de\s+)?)?/i, '');
        } else {
          amano.push({ seccion: seccion, texto: pieza.replace(RE_OPCIONAL, '').trim(), opcional: opcionalLinea || RE_OPCIONAL.test(pieza) });
          nounPrevio = pieza.replace(/^[\d½¼¾\/.,\- ]+(?:(?:g|kg|ml|l|cc|cdas?|cdtas?|tazas?|cucharadas?|cucharaditas?)\s+(?:de\s+)?)?/i, '');
        }
      });
    });
    return { tareas: tareas, amano: amano };
  }

  // FASE 10: tareas de mise en place a partir de ingredientes_v2 (revisados).
  function tareasDesdeEstructurado(ingsV2) {
    var tareas = [], amano = [];
    (ingsV2 || []).forEach(function (ing) {
      var prep = ing && ing.preparacion ? String(ing.preparacion).trim() : '';
      var etiqueta = prep ? prep.charAt(0).toUpperCase() + prep.slice(1) : 'Tener a mano';
      if (prep) {
        tareas.push({
          id: tareas.length,
          seccion: ing.seccion || '',
          verbos: [],
          etiqueta: etiqueta,
          texto: formatearIngredienteEstructurado(ing),
          detalle: '',
          opcional: !!ing.opcional,
          anticipado: /anticip|remoj|repos|noche|hora/i.test(prep),
          bucket: 'preparar'
        });
      } else {
        amano.push({
          seccion: ing.seccion || '',
          texto: formatearIngredienteEstructurado(ing),
          opcional: !!ing.opcional
        });
      }
    });
    return { tareas: tareas, amano: amano };
  }

  function guardarMise() { if (!recetaSlug) return; try { localStorage.setItem(STORAGE_MISE + recetaSlug, JSON.stringify({ hechas: miseHechas, terminada: miseTerminada, n: miseHechas.length, version: 1 })); } catch (e) {} }
  function cargarMise(n) {
    if (!recetaSlug || n === 0) return null;
    try {
      var raw = localStorage.getItem(STORAGE_MISE + recetaSlug); if (!raw) return null;
      var data = JSON.parse(raw); if (!data || !Array.isArray(data.hechas) || data.hechas.length !== n) return null;
      return { hechas: data.hechas.map(function (v) { return !!v; }), terminada: !!data.terminada };
    } catch (e) { return null; }
  }
  function limpiarMise() { if (!recetaSlug) return; try { localStorage.removeItem(STORAGE_MISE + recetaSlug); } catch (e) {} }

  var ICONO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function filaMise(t) {
    var chips = '';
    if (t.seccion) chips += '<span class="mc-mise-chip">' + escaparHtml(t.seccion) + '</span>';
    if (t.anticipado) chips += '<span class="mc-mise-chip mc-mise-chip-ant">⏰ con anticipación</span>';
    if (t.opcional) chips += '<span class="mc-mise-chip">opcional</span>';
    var esActual = !miseHechas[t.id] && t.id === miseActual;
    var claseActual = esActual ? ' actual' : '';
    return '<li class="mc-mise-item"><label class="mc-mise-fila' + claseActual + '"><input type="checkbox" class="mc-mise-check" data-id="' + t.id + '"' + (miseHechas[t.id] ? ' checked' : '') + '><span class="mc-mise-caja">' + ICONO_CHECK + '</span><span class="mc-mise-cuerpo"><span class="mc-mise-meta"><span class="mc-mise-verbo">' + escaparHtml(t.etiqueta) + '</span>' + chips + '</span><span class="mc-mise-texto">' + escaparHtml(t.texto) + '</span>' + (t.detalle ? '<span class="mc-mise-detalle">' + escaparHtml(t.detalle) + '</span>' : '') + '</span></label></li>';
  }

  function renderMise() {
    if (!overlayEl) return; var cont = overlayEl.querySelector('.mc-mise'); if (!cont) return;
    if (!prep || prep.tareas.length === 0) { cont.innerHTML = ''; return; }

    var h = '<div class="mc-mise-scroll"><header class="mc-mise-cab"><p class="mc-mise-kicker">Antes de cocinar</p><h2 id="mc-mise-titulo" class="mc-mise-titulo">Mise en place</h2><p class="mc-mise-sub">Deja todo cortado y a mano antes de encender el fuego. Después, cocinar es solo seguir los pasos.</p><div class="mc-progreso-barra mc-mise-barra" aria-hidden="true"><div class="mc-progreso-fill mc-mise-fill"></div></div><div class="mc-mise-conteo"></div></header>';

    BUCKETS.forEach(function (b) {
      var items = prep.tareas.filter(function (t) { return t.bucket === b.id; }); if (!items.length) return;
      h += '<section class="mc-mise-grupo"><h3 class="mc-mise-grupo-t"><span aria-hidden="true">' + b.icono + '</span> ' + escaparHtml(b.titulo) + '</h3><ul class="mc-mise-lista">' + items.map(filaMise).join('') + '</ul></section>';
    });

    if (prep.amano.length) {
      h += '<details class="mc-mise-mano"><summary>Medir y tener a mano <span class="mc-mise-mano-n">(' + prep.amano.length + ')</span></summary><ul class="mc-mise-mano-lista">' + prep.amano.map(function (a) { return '<li>' + (a.seccion ? '<span class="mc-mise-chip">' + escaparHtml(a.seccion) + '</span> ' : '') + escaparHtml(a.texto) + (a.opcional ? ' <span class="mc-mise-chip">opcional</span>' : '') + '</li>'; }).join('') + '</ul></details>';
    }
    h += '</div><div class="mc-mise-pie"><button type="button" class="mc-btn-accion mc-btn-accion-primario mc-mise-empezar" data-accion="empezar"></button><button type="button" class="mc-btn-accion mc-btn-accion-secundario mc-mise-todo" data-accion="marcar-todo">Marcar todo como listo</button></div>';
    cont.innerHTML = h; actualizarMiseProgreso(true);
  }

  function etiquetaEmpezar() { var yaCocinando = pasosHechos.some(function (v) { return v; }) || pasoActual > 0; return (miseTerminada || yaCocinando) ? 'Volver a los pasos →' : 'Empezar a cocinar →'; }

  function actualizarMiseProgreso(silencioso) {
    if (!overlayEl || !prep) return;
    var total = miseHechas.length; var hechas = miseHechas.filter(function (v) { return v; }).length;
    var fill = overlayEl.querySelector('.mc-mise-fill'); var conteo = overlayEl.querySelector('.mc-mise-conteo'); var btn = overlayEl.querySelector('.mc-mise-empezar');
    var listo = total > 0 && hechas === total;
    if (fill) fill.style.width = (total ? Math.round(hechas / total * 100) : 0) + '%';
    if (conteo) conteo.textContent = listo ? '¡Todo listo! Ya puedes cocinar.' : hechas + ' de ' + total + ' tareas listas';
    if (btn) {
      btn.textContent = etiquetaEmpezar(); var eraListo = btn.classList.contains('mc-listo'); btn.classList.toggle('mc-listo', listo);
      if (listo && !eraListo && !silencioso) anunciar('Preparación completa. Ya puedes empezar a cocinar.');
    }
  }

  function buscarTareaPendiente(desde) {
    for (var i = desde; i < miseHechas.length; i++) {
      if (!miseHechas[i]) return i;
    }
    return -1;
  }

  function actualizarTareaActualMise() {
    if (!overlayEl) return;
    var filas = overlayEl.querySelectorAll('.mc-mise-fila');
    filas.forEach(function (fila) {
      var checkbox = fila.querySelector('.mc-mise-check');
      if (!checkbox) return;
      var id = parseInt(checkbox.getAttribute('data-id'), 10);
      fila.classList.toggle('actual', id === miseActual);
    });
    var actual = overlayEl.querySelector('.mc-mise-fila.actual');
    if (actual) {
      setTimeout(function () {
        try { actual.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      }, 100);
    }
  }

  function avanzarTareaMise() {
    if (!prep) return;
    var sig = buscarTareaPendiente(miseActual + 1);
    if (sig >= 0) {
      miseActual = sig;
      actualizarTareaActualMise();
      var t = prep.tareas[sig];
      var msg = 'Siguiente: ' + t.etiqueta + ' ' + t.texto + '.';
      anunciar(msg);
      if (ttsActivo) leerTexto(msg);
    } else {
      miseActual = -1;
      actualizarTareaActualMise();
      var fin = 'No hay más tareas pendientes. Di empezar para cocinar.';
      anunciar(fin);
      if (ttsActivo) leerTexto(fin);
    }
  }

  function marcarTareaMiseActual() {
    if (!prep) return;
    if (miseActual < 0) {
      var todoHecho = miseHechas.every(function (v) { return v; });
      var msgNo = todoHecho ? '¡Todo listo! Di empezar para cocinar.' : 'No hay tarea actual.';
      anunciar(msgNo);
      if (ttsActivo) leerTexto(msgNo);
      return;
    }
    if (miseHechas[miseActual]) {
      avanzarTareaMise();
      return;
    }
    miseHechas[miseActual] = true;
    var checkbox = overlayEl.querySelector('.mc-mise-check[data-id="' + miseActual + '"]');
    if (checkbox) checkbox.checked = true;
    guardarMise();
    var tareaHecha = prep.tareas[miseActual];
    var sig = buscarTareaPendiente(miseActual + 1);
    var msg;
    if (sig >= 0) {
      miseActual = sig;
      actualizarTareaActualMise();
      actualizarMiseProgreso(true);
      var tareaSig = prep.tareas[sig];
      msg = 'Listo: ' + tareaHecha.etiqueta + ' ' + tareaHecha.texto + '. Siguiente: ' + tareaSig.etiqueta + ' ' + tareaSig.texto + '.';
    } else {
      miseActual = -1;
      actualizarTareaActualMise();
      actualizarMiseProgreso(true);
      msg = 'Listo: ' + tareaHecha.etiqueta + ' ' + tareaHecha.texto + '. ¡Todo listo! Di empezar para cocinar.';
    }
    anunciar(msg);
    if (ttsActivo) leerTexto(msg);
  }

  function siguienteTareaMise() { if (!prep) return; avanzarTareaMise(); }

  function anteriorTareaMise() {
    if (!prep) return;
    var ant = -1;
    for (var i = miseActual - 1; i >= 0; i--) {
      if (!miseHechas[i]) { ant = i; break; }
    }
    if (ant < 0 && miseActual > 0) ant = miseActual - 1;
    if (ant >= 0) {
      miseActual = ant;
      actualizarTareaActualMise();
      var t = prep.tareas[ant];
      var msg = 'Anterior: ' + t.etiqueta + ' ' + t.texto + '.';
      anunciar(msg);
      if (ttsActivo) leerTexto(msg);
    } else {
      var msgNo = 'No hay tarea anterior.';
      anunciar(msgNo);
      if (ttsActivo) leerTexto(msgNo);
    }
  }

  function leerTareaMiseActual() {
    if (!prep) return;
    if (miseActual < 0) {
      var msgNo = 'No hay tarea actual.';
      anunciar(msgNo);
      leerTexto(msgNo, true);
      return;
    }
    var t = prep.tareas[miseActual];
    var msg = t.etiqueta + ' ' + t.texto + (t.detalle ? ', ' + t.detalle : '') + '.';
    anunciar(msg);
    leerTexto(msg, true);
  }

  function setTareaMise(id, valor) {
    if (id < 0 || id >= miseHechas.length) return;
    miseHechas[id] = !!valor;
    guardarMise();
    actualizarMiseProgreso(false);
    if (miseActual < 0) {
      var pendiente = buscarTareaPendiente(0);
      if (pendiente >= 0) { miseActual = pendiente; actualizarTareaActualMise(); }
    }
  }

  function marcarTodoMise() {
    miseHechas = miseHechas.map(function () { return true; });
    overlayEl.querySelectorAll('.mc-mise-check').forEach(function (c) { c.checked = true; });
    miseActual = -1;
    guardarMise();
    actualizarTareaActualMise();
    actualizarMiseProgreso(false);
  }

  function enfocarMise() {
    setTimeout(function () {
      if (!overlayEl || !enMise) return;
      var f;
      if (miseActual >= 0) f = overlayEl.querySelector('.mc-mise-check[data-id="' + miseActual + '"]');
      if (!f) f = overlayEl.querySelector('.mc-mise-empezar');
      if (f) f.focus();
    }, 60);
  }

  function entrarMise() {
    if (!overlayEl || !prep || prep.tareas.length === 0) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    limpiarAutoTimer();
    if (miseActual < 0 || miseHechas[miseActual]) miseActual = buscarTareaPendiente(0);
    enMise = true;
    overlayEl.classList.remove('completado');
    overlayEl.classList.add('mise');
    overlayEl.querySelector('.mc-mise-toggle').setAttribute('aria-pressed', 'true');
    renderMise();
    actualizarMiseProgreso(true);
    actualizarTareaActualMise();

    var pendientes = miseHechas.filter(function (v) { return !v; }).length;
    var msg = 'Preparación: ' + pendientes + ' tareas pendientes.';
    if (miseActual >= 0) {
      var t = prep.tareas[miseActual];
      msg += ' Empezamos con: ' + t.etiqueta + ' ' + t.texto + '.';
    }
    anunciar(msg);
    if (ttsActivo) leerTexto(msg);
    enfocarMise();
  }

  function salirMise() {
    if (!overlayEl || !enMise) return;
    enMise = false; miseTerminada = true; guardarMise();
    overlayEl.classList.remove('mise'); overlayEl.querySelector('.mc-mise-toggle').setAttribute('aria-pressed', 'false');
    if (todosLosPasosHechos()) overlayEl.classList.add('completado');
    actualizarPaso(false); anunciar('Paso ' + (pasoActual + 1));
    setTimeout(function () { var next = overlayEl.querySelector('.mc-next'); if (next && next.offsetParent !== null) next.focus(); }, 50);
  }

  function reiniciarMise() {
    if (!prep || prep.tareas.length === 0) return;
    miseHechas = new Array(prep.tareas.length).fill(false);
    miseTerminada = false;
    miseActual = 0;
    limpiarMise();
    entrarMise();
  }

  // ================= FASE 6H: control del bottom sheet =================
  function abrirSheet() {
    if (!overlayEl) return;
    var sheet = overlayEl.querySelector('.mc-sheet');
    var backdrop = overlayEl.querySelector('.mc-sheet-overlay');
    if (!sheet || !backdrop) return;
    if (!sheet.hidden && sheet.classList.contains('mc-sheet-abierto')) return;
    sheet.hidden = false;
    backdrop.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add('mc-sheet-abierto');
    backdrop.classList.add('mc-sheet-overlay-abierto');
    var btn = overlayEl.querySelector('.mc-mas-toggle');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    anunciar('Opciones de cocina abiertas');
    setTimeout(function () {
      var first = sheet.querySelector('button:not([disabled]):not([hidden]), summary');
      if (first) try { first.focus({ preventScroll: true }); } catch (e) {}
    }, 120);
  }

  function cerrarSheet() {
    if (!overlayEl) return;
    var sheet = overlayEl.querySelector('.mc-sheet');
    var backdrop = overlayEl.querySelector('.mc-sheet-overlay');
    if (!sheet || !backdrop) return;
    if (sheet.hidden) return;
    sheet.classList.remove('mc-sheet-abierto');
    backdrop.classList.remove('mc-sheet-overlay-abierto');
    var btn = overlayEl.querySelector('.mc-mas-toggle');
    if (btn) btn.setAttribute('aria-pressed', 'false');
    setTimeout(function () {
      if (!sheet.classList.contains('mc-sheet-abierto')) {
        sheet.hidden = true;
        backdrop.hidden = true;
      }
    }, 450);
  }

  // ---- Construcción del overlay ----
  function crearOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'modo-cocina'; overlayEl.className = 'mc-overlay';
    overlayEl.setAttribute('role', 'dialog'); overlayEl.setAttribute('aria-modal', 'true'); overlayEl.setAttribute('aria-labelledby', 'mc-titulo');

    overlayEl.innerHTML =
      '<div class="mc-live" aria-live="polite" aria-atomic="true"></div>' +
      '<div class="mc-aviso-voz" hidden></div>' +
      '<header class="mc-header">' +
        '<button type="button" class="mc-btn-icon mc-cerrar" aria-label="Cerrar modo cocina">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<div class="mc-titulo-wrap">' +
          '<h1 id="mc-titulo" class="mc-titulo"></h1>' +
          '<span class="mc-header-paso">Paso 1 de 1</span>' +
        '</div>' +
        '<div class="mc-header-acciones">' +
          '<button type="button" class="mc-btn-icon mc-mic-toggle" aria-pressed="false" aria-label="Activar manos libres (comandos de voz)" title="Manos libres (Comandos de Voz)" style="display:none;">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' +
          '</button>' +
          '<button type="button" class="mc-btn-icon mc-mas-toggle" aria-pressed="false" aria-label="Más opciones" title="Más opciones">' +
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="mc-sheet-overlay" hidden></div>' +
      '<div class="mc-sheet" hidden role="dialog" aria-labelledby="mc-sheet-titulo">' +
        '<div class="mc-sheet-handle" aria-hidden="true"></div>' +
        '<h2 id="mc-sheet-titulo" class="mc-sheet-titulo">Opciones</h2>' +
        '<section class="mc-sheet-seccion">' +
          '<h3 class="mc-sheet-label">Tamaño de letra</h3>' +
          '<div class="mc-sheet-fs" role="group" aria-label="Tamaño de letra">' +
            '<button type="button" class="mc-fs-btn mc-fs-menos" aria-label="Reducir letra">A−</button>' +
            '<span class="mc-sheet-fs-valor" aria-live="polite">100%</span>' +
            '<button type="button" class="mc-fs-btn mc-fs-mas" aria-label="Aumentar letra">A+</button>' +
          '</div>' +
        '</section>' +
        '<section class="mc-sheet-seccion">' +
          '<h3 class="mc-sheet-label">Acciones</h3>' +
          '<button type="button" class="mc-sheet-item mc-tts-toggle" aria-pressed="false" style="display:none;">' +
            '<span class="mc-sheet-item-icon" aria-hidden="true">🔊</span>' +
            '<span class="mc-sheet-item-texto">Leer en voz alta</span>' +
            '<span class="mc-sheet-item-estado mc-tts-estado">Desactivado</span>' +
          '</button>' +
          '<button type="button" class="mc-sheet-item mc-mise-toggle" aria-pressed="false" hidden>' +
            '<span class="mc-sheet-item-icon" aria-hidden="true">📋</span>' +
            '<span class="mc-sheet-item-texto">Mise en place</span>' +
            '<span class="mc-sheet-item-estado">Abrir</span>' +
          '</button>' +
          '<button type="button" class="mc-sheet-item mc-reiniciar" aria-label="Reiniciar progreso">' +
            '<span class="mc-sheet-item-icon" aria-hidden="true">↺</span>' +
            '<span class="mc-sheet-item-texto">Reiniciar progreso</span>' +
          '</button>' +
          '<details class="mc-atajos mc-sheet-details">' +
            '<summary class="mc-sheet-item">' +
              '<span class="mc-sheet-item-icon" aria-hidden="true">?</span>' +
              '<span class="mc-sheet-item-texto">Atajos y ayuda</span>' +
              '<span class="mc-sheet-item-chevron" aria-hidden="true">›</span>' +
            '</summary>' +
            '<div class="mc-atajos-panel">' +
              '<h3>Atajos de teclado</h3>' +
              '<ul>' +
                '<li><span>Paso anterior</span><span><kbd>←</kbd></span></li>' +
                '<li><span>Paso siguiente</span><span><kbd>→</kbd></span></li>' +
                '<li><span>Marcar hecho</span><span><kbd>M</kbd></span></li>' +
                '<li><span>Cerrar</span><span><kbd>Esc</kbd></span></li>' +
              '</ul>' +
              '<h3 style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,.15); padding-top: 1rem;">Comandos de voz</h3>' +
              '<ul>' +
                '<li><span>Siguiente</span><span>→</span></li>' +
                '<li><span>Atrás</span><span>←</span></li>' +
                '<li><span>Listo / Hecho</span><span>✓</span></li>' +
                '<li><span>Repetir / Leer</span><span>🔊</span></li>' +
                '<li><span>Empezar / Cocinar</span><span>▶</span></li>' +
                '<li><span>Pausa / Reanudar</span><span>⏸</span></li>' +
                '<li><span>Cuánto falta</span><span>⏱</span></li>' +
                '<li><span>Ingredientes</span><span>🛒</span></li>' +
              '</ul>' +
              '<label class="mc-atajos-setting"><span>Avanzar al marcar hecho</span><input type="checkbox" class="mc-toggle-autoavanzar"></label>' +
              '<label class="mc-atajos-setting"><span>Iniciar timer automáticamente</span><input type="checkbox" class="mc-toggle-autotimer"></label>' +
              '<label class="mc-atajos-setting"><span>Sonido de alarma</span><input type="checkbox" class="mc-toggle-sonido"></label>' +
              '<label class="mc-atajos-setting"><span>Leer pasos en voz alta</span><input type="checkbox" class="mc-toggle-tts"></label>' +
            '</div>' +
          '</details>' +
        '</section>' +
      '</div>' +
      '<div class="mc-aviso-escala" hidden></div>' +
      '<div class="mc-voice-hint" hidden>🎤 Di: "Siguiente", "Atrás", "Listo", "Repetir", "Empezar", "Pausa", "Tiempo" o "Ingredientes"</div>' +
      '<div class="mc-voz-eco" hidden aria-live="polite"></div>' +
      '<div class="mc-progreso" aria-hidden="true"><div class="mc-progreso-barra"><div class="mc-progreso-fill"></div></div><div class="mc-progreso-texto">0 de 0 pasos completados</div></div>' +
      '<div class="mc-timers" hidden></div>' +
      '<details class="mc-ingredientes"><summary>Ingredientes (<span class="mc-ing-count">0</span>)</summary><ul class="mc-ing-list"></ul></details>' +
      '<section class="mc-mise" aria-labelledby="mc-mise-titulo"></section>' +
      '<div class="mc-contenido"></div>' +
      '<nav class="mc-nav" aria-label="Navegación de pasos">' +
        '<button type="button" class="mc-prev" aria-label="Paso anterior">← <span>Anterior</span></button>' +
        '<span class="mc-contador" aria-live="polite">1 / 1</span>' +
        '<button type="button" class="mc-next" aria-label="Paso siguiente"><span>Siguiente</span> →</button>' +
      '</nav>' +
      '<div class="mc-alarma" hidden role="alertdialog" aria-labelledby="mc-alarma-texto">' +
        '<div class="mc-alarma-contenido">' +
          '<div class="mc-alarma-icono" aria-hidden="true">⏰</div>' +
          '<div class="mc-alarma-paso"></div>' +
          '<h2 id="mc-alarma-texto" class="mc-alarma-texto">Se acabó el tiempo</h2>' +
          '<div class="mc-alarma-etiqueta"></div>' +
          '<button type="button" class="mc-alarma-detener" data-action="detener-alarma">Detener</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlayEl);

    overlayEl.querySelector('.mc-cerrar').addEventListener('click', cerrar);

    // FASE 6H — toggle del bottom sheet y su backdrop
    var masBtn = overlayEl.querySelector('.mc-mas-toggle');
    masBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var sheet = overlayEl.querySelector('.mc-sheet');
      if (!sheet) return;
      if (sheet.classList.contains('mc-sheet-abierto')) cerrarSheet();
      else abrirSheet();
    });

    var sheetBackdrop = overlayEl.querySelector('.mc-sheet-overlay');
    if (sheetBackdrop) sheetBackdrop.addEventListener('click', cerrarSheet);

    overlayEl.querySelector('.mc-prev').addEventListener('click', pasoAnterior);
    overlayEl.querySelector('.mc-next').addEventListener('click', pasoSiguiente);
    overlayEl.querySelector('.mc-reiniciar').addEventListener('click', function () { reiniciarProgreso(false); });

    overlayEl.querySelector('.mc-fs-menos').addEventListener('click', function () { cambiarFs(-1); });
    overlayEl.querySelector('.mc-fs-mas').addEventListener('click', function () { cambiarFs(1); });

    overlayEl.querySelector('.mc-mise-toggle').addEventListener('click', function () {
      if (enMise) salirMise(); else entrarMise();
      cerrarSheet();
    });
    var miseEl = overlayEl.querySelector('.mc-mise');
    miseEl.addEventListener('change', function (e) { var c = e.target.closest('.mc-mise-check'); if (c) setTareaMise(parseInt(c.getAttribute('data-id'), 10), c.checked); });
    miseEl.addEventListener('click', function (e) {
      var a = e.target.closest('[data-accion]'); if (!a) return;
      var act = a.getAttribute('data-accion');
      if (act === 'empezar') salirMise(); else if (act === 'marcar-todo') marcarTodoMise();
    });

    var toggleAA = overlayEl.querySelector('.mc-toggle-autoavanzar');
    toggleAA.addEventListener('change', function () { autoAvanzar = toggleAA.checked; guardarAutoAvanzar(autoAvanzar); anunciar(autoAvanzar ? 'Avance automático activado' : 'Avance automático desactivado'); });

    var toggleAutoTimer = overlayEl.querySelector('.mc-toggle-autotimer');
    toggleAutoTimer.addEventListener('change', function () { autoTimerActivo = toggleAutoTimer.checked; guardarAutoTimer(autoTimerActivo); anunciar(autoTimerActivo ? 'Timer automático activado' : 'Timer automático desactivado'); if (!autoTimerActivo) limpiarAutoTimer(); });

    var toggleSonido = overlayEl.querySelector('.mc-toggle-sonido');
    toggleSonido.addEventListener('change', function () { sonidoActivo = toggleSonido.checked; guardarSonido(sonidoActivo); anunciar(sonidoActivo ? 'Sonido activado' : 'Sonido desactivado'); if (sonidoActivo) playTick(); });

    var ttsBtn = overlayEl.querySelector('.mc-tts-toggle');
    var toggleTTS = overlayEl.querySelector('.mc-toggle-tts');
    ttsBtn.addEventListener('click', function() {
      ttsActivo = !ttsActivo;
      this.setAttribute('aria-pressed', ttsActivo ? 'true' : 'false');
      this.classList.toggle('activo', ttsActivo);
      guardarTTS(ttsActivo); toggleTTS.checked = ttsActivo;
      anunciar(ttsActivo ? 'Lectura en voz alta activada' : 'Lectura en voz alta desactivada');
      if (!ttsActivo) { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
      else if (!enMise) { var currentStepText = overlayEl.querySelector('.mc-paso.activo .mc-paso-texto'); if (currentStepText) leerTexto(currentStepText.textContent); }
      // FASE 6H — reflejar estado en el sheet
      var estado = overlayEl.querySelector('.mc-tts-estado');
      if (estado) estado.textContent = ttsActivo ? 'Activado' : 'Desactivado';
    });
    toggleTTS.addEventListener('change', function() { if (this.checked !== ttsActivo) ttsBtn.click(); });

    var micBtn = overlayEl.querySelector('.mc-mic-toggle');
    micBtn.addEventListener('click', function() {
      if (!recognition) return;
      microActivo = !microActivo;
      actualizarBotonMicro();
      if (microActivo) {
        try { recognition.start(); anunciar(enMise ? 'Comandos de voz activados. Di listo, siguiente, atrás o empezar.' : 'Comandos de voz activados.'); } catch(e) { console.error(e); microActivo = false; actualizarBotonMicro(); }
      } else {
        try { recognition.stop(); anunciar('Comandos de voz desactivados.'); } catch(e) {}
      }
    });

    overlayEl.querySelector('.mc-contenido').addEventListener('click', function (e) {
      var leerBtn = e.target.closest('.mc-leer-btn');
      if (leerBtn) { var pasoTexto = leerBtn.closest('.mc-paso').querySelector('.mc-paso-texto').textContent; leerTexto(pasoTexto, true); return; }
      var marcar = e.target.closest('.mc-marcar');
      if (marcar) { var idx = parseInt(marcar.getAttribute('data-paso'), 10); if (!isNaN(idx)) marcarHecho(idx, !pasosHechos[idx]); return; }
      var iniciarBtn = e.target.closest('.mc-timer-iniciar');
      if (iniciarBtn) {
        if (countdownBtn === iniciarBtn) { limpiarAutoTimer(); return; }
        limpiarAutoTimer();
        var mins = parseFloat(iniciarBtn.getAttribute('data-minutos')); var pasoIdx = parseInt(iniciarBtn.getAttribute('data-paso'), 10);
        if (!isNaN(mins) && !isNaN(pasoIdx)) iniciarTimer(pasoIdx, mins);
        return;
      }
      var accion = e.target.closest('[data-accion]');
      if (accion) {
        var act = accion.getAttribute('data-accion');
        if (act === 'cerrar') cerrar(); else if (act === 'reiniciar') reiniciarProgreso(true); else if (act === 'ver-pasos') salirCompletado();
      }
    });

    overlayEl.addEventListener('click', function (e) {
      var detener = e.target.closest('[data-action="detener-alarma"]');
      if (detener) { detenerAlarma(); return; }
      var notifBtn = e.target.closest('[data-action="pedir-notif"]');
      if (notifBtn) { pedirPermisoNotif(); return; }
    });

    overlayEl.querySelector('.mc-timers').addEventListener('click', function (e) {
      var btn = e.target.closest('.mc-timer-btn'); if (!btn) return;
      var action = btn.getAttribute('data-action'); var id = btn.getAttribute('data-id');
      if (action === 'pausar') pausarTimer(id); else if (action === 'reanudar') reanudarTimer(id); else if (action === 'agregar') agregarTiempo(id, 1); else if (action === 'cancelar') cancelarTimer(id);
    });

    var contenidoEl = overlayEl.querySelector('.mc-contenido');
    var swipeStart = null;
    contenidoEl.addEventListener('pointerdown', function (e) {
      if (enMise) return;
      if (e.target.closest('button, .mc-timers, .mc-paso-timer, input, summary, a')) return;
      swipeStart = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    contenidoEl.addEventListener('pointerup', function (e) {
      if (!swipeStart || enMise) { swipeStart = null; return; }
      var dx = e.clientX - swipeStart.x;
      var dy = e.clientY - swipeStart.y;
      var dt = Date.now() - swipeStart.t;
      swipeStart = null;
      if (dt > 600) return;
      var adx = Math.abs(dx), ady = Math.abs(dy);
      if (adx < 60) return;
      if (adx < ady * 1.5) return;
      if (dx < 0) pasoSiguiente(); else pasoAnterior();
    });
    contenidoEl.addEventListener('pointercancel', function () { swipeStart = null; });

    document.addEventListener('click', function (e) {
      if (!overlayEl || !overlayEl.classList.contains('abierto')) return;
      var atajos = overlayEl.querySelector('.mc-atajos');
      if (atajos && atajos.open && !atajos.contains(e.target)) atajos.open = false;
    }, true);

    return overlayEl;
  }

  // ---- FASE 3: helpers para el aviso de escalado ----
  function formatearFactorTexto(f) {
    if (f === 0.5) return '½';
    if (f === 1.5) return '1½';
    if (f === 2.5) return '2½';
    if (f === 3.5) return '3½';
    return String(f).replace('.', ',');
  }

  function pasosTienenCantidades(pasos) {
    if (!Array.isArray(pasos)) return false;
    var re = /(\d\s*(?:g|kg|ml|l)\b)|(\b(?:tazas?|cucharadas?|cucharaditas?)\b)/i;
    return pasos.some(function (p) { return typeof p === 'string' && re.test(p); });
  }

  // ---- FASE 4: timers manuales por receta ----
  function timersDeReceta(receta, i) {
    if (!receta || !Array.isArray(receta.timers)) return null;
    var manual = receta.timers.filter(function (t) { return t.paso === i + 1; });
    if (manual.length === 0) return null;
    return manual.map(function (t) {
      return { minutos: t.minutos, etiqueta: t.etiqueta || (String(t.minutos).replace('.', ',') + ' min') };
    });
  }

  // FASE 10: timers de pasos_v2[i] (revisados a mano).
  function timersDePasoV2(i) {
    if (!Array.isArray(pasosV2)) return null;
    var p = pasosV2[i];
    if (!p || !Array.isArray(p.timers) || p.timers.length === 0) return null;
    return p.timers.map(function (t) {
      return { minutos: t.minutos, etiqueta: t.etiqueta || (String(t.minutos).replace('.', ',') + ' min') };
    });
  }

  // FASE 10: HTML "Ingredientes de este paso" a partir de los índices.
  function htmlIngredientesPasoV2(i) {
    if (!Array.isArray(pasosV2) || !Array.isArray(ingredientesV2)) return '';
    var p = pasosV2[i];
    if (!p || !Array.isArray(p.ingredientes) || p.ingredientes.length === 0) return '';
    var items = p.ingredientes
      .map(function (n) { return ingredientesV2[n - 1]; })
      .filter(Boolean)
      .map(function (ing) { return '<li>' + escaparHtml(formatearIngredienteEstructurado(ing)) + '</li>'; })
      .join('');
    if (!items) return '';
    return '<div class="mc-paso-ings"><span class="mc-paso-ings-titulo">Ingredientes de este paso</span><ul class="mc-paso-ings-lista">' + items + '</ul></div>';
  }

  // ---- Abrir ----
  function abrir(receta) {
    if (!receta) return;

    // FASE 8: pedir al service worker que guarde esta receta y su imagen
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (!reg.active) return;
        var imgRel = receta.imagen || null;
        var imgAbs = imgRel ? new URL(imgRel, window.location.origin).href : null;
        reg.active.postMessage({ type: 'CACHE_RECIPE', url: window.location.pathname, imageUrl: imgAbs });
      }).catch(function () {});
    }

    recetaActual = receta;
    botonOrigen = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;

    var slugBtn = document.querySelector('.btn-favorito[data-slug]');
    recetaSlug = slugBtn ? slugBtn.getAttribute('data-slug') : slugify(receta.titulo || 'default');

    // FASE 10: activar v2 si está revisado y hay datos estructurados.
    esV2 = receta.revisado_v2 === true &&
           Array.isArray(receta.ingredientes_v2) &&
           receta.ingredientes_v2.length > 0;
    ingredientesV2 = esV2 ? receta.ingredientes_v2 : null;
    pasosV2 = esV2 && Array.isArray(receta.pasos_v2) ? receta.pasos_v2 : null;

    var pasos = receta.pasos || [];
    var saved = cargarEstado(pasos.length);
    if (saved) { pasoActual = saved.pasoActual; pasosHechos = saved.pasosHechos; }
    else { pasoActual = 0; pasosHechos = new Array(pasos.length).fill(false); }

    cargarAjustes();
    timers = cargarTimersGuardados();
    microActivo = false;
    autoTimerLanzados.clear();

    alarmaTimer = null;
    detenerLoopAlarma();

    initAudio();
    initTTS();

    var ov = crearOverlay();
    cargarFs();
    aplicarFs();
    ov.classList.remove('completado');
    ov.querySelector('.mc-titulo').textContent = receta.titulo || 'Receta';

    // FASE 6H — inicializar subtítulo del paso en el header
    var pasoLabelInit = ov.querySelector('.mc-header-paso');
    if (pasoLabelInit) pasoLabelInit.textContent = 'Paso 1 de ' + (pasos.length || 1);

    // FASE 6H — asegurar sheet cerrado al abrir el overlay
    var sheetInit = ov.querySelector('.mc-sheet');
    var backdropInit = ov.querySelector('.mc-sheet-overlay');
    if (sheetInit) { sheetInit.classList.remove('mc-sheet-abierto'); sheetInit.hidden = true; }
    if (backdropInit) { backdropInit.classList.remove('mc-sheet-overlay-abierto'); backdropInit.hidden = true; }

    var alarmaEl = ov.querySelector('.mc-alarma');
    if (alarmaEl) alarmaEl.hidden = true;

    var avisoEscala = ov.querySelector('.mc-aviso-escala');
    if (avisoEscala) {
      var factorEsc = receta.factorEscalado;
      // FASE 10: con v2 revisado no mostramos el aviso de la Fase 3
      // (las marcas {ing:N} se reemplazan automáticamente).
      var mostrarAviso = !esV2 && (factorEsc != null) && (factorEsc !== 1) && pasosTienenCantidades(pasos);
      if (mostrarAviso) {
        avisoEscala.textContent = 'Cantidades ×' + formatearFactorTexto(factorEsc) +
          '. Las cantidades escritas dentro de los pasos no se ajustan; revísalas.';
        avisoEscala.hidden = false;
      } else {
        avisoEscala.textContent = '';
        avisoEscala.hidden = true;
      }
    }

    ov.querySelector('.mc-toggle-autoavanzar').checked = autoAvanzar;
    ov.querySelector('.mc-toggle-sonido').checked = sonidoActivo;
    ov.querySelector('.mc-toggle-autotimer').checked = autoTimerActivo;

    var ttsBtn = ov.querySelector('.mc-tts-toggle');
    var toggleTTS = ov.querySelector('.mc-toggle-tts');
    if ('speechSynthesis' in window) {
      ttsBtn.style.display = 'flex';
      ttsBtn.setAttribute('aria-pressed', ttsActivo ? 'true' : 'false');
      ttsBtn.classList.toggle('activo', ttsActivo);
      toggleTTS.checked = ttsActivo;
      // FASE 6H — inicializar estado visual del TTS en el sheet
      var ttsEstadoInit = ov.querySelector('.mc-tts-estado');
      if (ttsEstadoInit) ttsEstadoInit.textContent = ttsActivo ? 'Activado' : 'Desactivado';
    }

    var micBtn = ov.querySelector('.mc-mic-toggle');
    if (recognition) {
      micBtn.style.display = 'inline-flex';
    } else {
      micBtn.style.display = 'none';
    }
    actualizarBotonMicro();

    // FASE 10: mise en place desde preparacion si hay v2; si no, analizarPrep.
    if (esV2 && Array.isArray(ingredientesV2)) {
      prep = tareasDesdeEstructurado(ingredientesV2);
    } else {
      prep = analizarPrep(receta.ingredientes || []);
    }

    var nPrep = prep.tareas.length;
    var stMise = cargarMise(nPrep);
    miseHechas = stMise ? stMise.hechas : new Array(nPrep).fill(false);
    miseTerminada = stMise ? stMise.terminada : false;
    var sinProgreso = !pasosHechos.some(function (v) { return v; }) && pasoActual === 0;
    enMise = nPrep > 0 && sinProgreso && !miseTerminada;
    ov.querySelector('.mc-mise-toggle').hidden = nPrep === 0;
    ov.querySelector('.mc-mise-toggle').setAttribute('aria-pressed', enMise ? 'true' : 'false');
    miseActual = enMise ? buscarTareaPendiente(0) : -1;
    renderMise();
    ov.classList.toggle('mise', enMise);

    // Panel de ingredientes del overlay (para consulta rápida).
    var ingsTexto;
    if (esV2 && Array.isArray(ingredientesV2)) {
      ingsTexto = ingredientesV2.map(formatearIngredienteEstructurado);
    } else {
      ingsTexto = receta.ingredientes || [];
    }
    ov.querySelector('.mc-ing-count').textContent = ingsTexto.length;
    ov.querySelector('.mc-ing-list').innerHTML = ingsTexto.map(function (x) { return '<li>' + escaparHtml(x) + '</li>'; }).join('');

    var htmlPasos = pasos.map(function (p, i) {
      var tiempos;
      if (esV2) {
        var tV2 = timersDePasoV2(i);
        tiempos = tV2 !== null ? tV2 : [];
      } else {
        var manuales = timersDeReceta(receta, i);
        tiempos = manuales !== null ? manuales : detectarTiempos(p);
      }
      var botonesTimers = tiempos.map(function (t) {
        return '<button type="button" class="mc-timer-iniciar" data-paso="' + i + '" data-minutos="' + t.minutos + '" aria-label="Iniciar temporizador de ' + t.etiqueta + '"><span aria-hidden="true">⏱</span> Iniciar ' + t.etiqueta + '</button>';
      }).join('');
      var btnLeer = '<button type="button" class="mc-leer-btn" aria-label="Escuchar este paso"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Escuchar</button>';

      // FASE 10: reemplazar {ing:N} en el texto si v2.
      var textoPaso = p;
      if (esV2 && Array.isArray(pasosV2) && pasosV2[i] && typeof pasosV2[i].texto === 'string') {
        textoPaso = reemplazarMarcasIngredientes(pasosV2[i].texto, ingredientesV2);
      } else if (esV2 && Array.isArray(ingredientesV2)) {
        textoPaso = reemplazarMarcasIngredientes(p, ingredientesV2);
      }

      var ingsPasoHtml = esV2 ? htmlIngredientesPasoV2(i) : '';

      return '<div class="mc-paso" data-paso="' + i + '">' +
        '<div class="mc-paso-header"><div class="mc-paso-num">Paso ' + (i + 1) + '</div><button type="button" class="mc-marcar" data-paso="' + i + '" aria-pressed="false" aria-label="Marcar paso ' + (i + 1) + ' como hecho"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></button></div>' +
        '<p class="mc-paso-texto">' + escaparHtml(textoPaso) + '</p>' +
        ingsPasoHtml +
        '<div class="mc-paso-acciones">' + btnLeer + botonesTimers + '</div>' +
        '<div class="mc-paso-timer" hidden></div>' +
      '</div>';
    }).join('');

    var htmlCompletado = '<div class="mc-completado"><div class="mc-completado-emoji" aria-hidden="true">🎉</div><h2>¡Buen provecho!</h2><p>Completaste los ' + pasos.length + ' pasos de <strong>' + escaparHtml(receta.titulo || 'esta receta') + '</strong>. ¡Esperamos que te haya quedado delicioso!</p><div class="mc-completado-acciones"><button type="button" class="mc-btn-accion mc-btn-accion-primario" data-accion="cerrar">Volver a la receta</button><button type="button" class="mc-btn-accion mc-btn-accion-secundario" data-accion="ver-pasos">Revisar pasos</button><button type="button" class="mc-btn-accion mc-btn-accion-secundario" data-accion="reiniciar">Cocinar de nuevo</button></div></div>';

    ov.querySelector('.mc-contenido').innerHTML = htmlPasos + htmlCompletado;

    actualizarPaso(true);
    actualizarProgreso();

    if (todosLosPasosHechos()) ov.classList.add('completado');

    document.body.classList.add('mc-bloqueado');
    ov.classList.add('abierto');
    aplicarInert(true);

    if (intervaloTick) clearInterval(intervaloTick);
    intervaloTick = setInterval(tickTimers, TICK_MS);

    onKeyDownHandler = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        var sheetE = overlayEl && overlayEl.querySelector('.mc-sheet');
        if (sheetE && sheetE.classList.contains('mc-sheet-abierto')) { cerrarSheet(); return; }
        cerrar(); return;
      }
      if (e.key === 'Tab') { manejarTab(e); return; }
      if (enMise) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); pasoAnterior(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); pasoSiguiente(); return; }
      if (e.key === 'm' || e.key === 'M') {
        var tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        e.preventDefault();
        if (pasos.length > 0) marcarHecho(pasoActual, !pasosHechos[pasoActual]);
      }
    };
    document.addEventListener('keydown', onKeyDownHandler);

    solicitarWakeLock();

    setTimeout(function () {
      if (ov.classList.contains('mise')) {
        var pendientes = miseHechas.filter(function (v) { return !v; }).length;
        var msg = 'Preparación: ' + pendientes + ' tareas pendientes.';
        if (miseActual >= 0) {
          var t = prep.tareas[miseActual];
          msg += ' Empezamos con: ' + t.etiqueta + ' ' + t.texto + '.';
        }
        anunciar(msg);
        if (ttsActivo) leerTexto(msg);
        enfocarMise();
      }
      else if (ov.classList.contains('completado')) { var firstBtn = ov.querySelector('.mc-completado-acciones .mc-btn-accion'); if (firstBtn) firstBtn.focus(); }
      else { var next = ov.querySelector('.mc-next'); if (next) next.focus(); }
    }, 100);

    setTimeout(function () { tickTimers(); }, 300);
  }

  function cerrar() {
    if (!overlayEl) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognition && microActivo) { try { recognition.stop(); } catch(e) {} microActivo = false; }
    limpiarAutoTimer();
    detenerAlarma();
    if (reiniciarPendiente) { clearTimeout(reiniciarPendiente); reiniciarPendiente = null; }
    if (ecoTimeout) { clearTimeout(ecoTimeout); ecoTimeout = null; }
    if (avisoTimeout) { clearTimeout(avisoTimeout); avisoTimeout = null; }

    overlayEl.classList.remove('abierto');
    // FASE 6H — cerrar el sheet sin animación al cerrar el overlay
    var sheetC = overlayEl.querySelector('.mc-sheet');
    var backdropC = overlayEl.querySelector('.mc-sheet-overlay');
    if (sheetC) { sheetC.classList.remove('mc-sheet-abierto'); sheetC.hidden = true; }
    if (backdropC) { backdropC.classList.remove('mc-sheet-overlay-abierto'); backdropC.hidden = true; }
    var masBtnReset = overlayEl.querySelector('.mc-mas-toggle');
    if (masBtnReset) masBtnReset.setAttribute('aria-pressed', 'false');

    document.body.classList.remove('mc-bloqueado');
    aplicarInert(false);
    if (onKeyDownHandler) { document.removeEventListener('keydown', onKeyDownHandler); onKeyDownHandler = null; }
    if (intervaloTick) { clearInterval(intervaloTick); intervaloTick = null; }
    guardarTimers(); liberarWakeLock();
    if (botonOrigen && typeof botonOrigen.focus === 'function') {
      try { botonOrigen.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  // ---- Render / estado ----
  function actualizarPaso(silencioso) {
    if (!overlayEl) return;
    var pasosEls = overlayEl.querySelectorAll('.mc-paso');
    if (pasosEls.length === 0) return;

    pasosEls.forEach(function (el, i) {
      el.classList.toggle('activo', i === pasoActual);
      el.classList.toggle('hecho', !!pasosHechos[i]);
      var marcarBtn = el.querySelector('.mc-marcar');
      if (marcarBtn) {
        marcarBtn.setAttribute('aria-pressed', pasosHechos[i] ? 'true' : 'false');
        marcarBtn.setAttribute('aria-label', (pasosHechos[i] ? 'Desmarcar paso ' : 'Marcar paso ') + (i + 1) + (pasosHechos[i] ? '' : ' como hecho'));
      }
    });

    overlayEl.querySelector('.mc-contador').textContent = (pasoActual + 1) + ' / ' + pasosEls.length;

    // FASE 6H — subtítulo del header con el paso actual
    var pasoLabel = overlayEl.querySelector('.mc-header-paso');
    if (pasoLabel) pasoLabel.textContent = 'Paso ' + (pasoActual + 1) + ' de ' + pasosEls.length;

    var prev = overlayEl.querySelector('.mc-prev');
    var next = overlayEl.querySelector('.mc-next');
    prev.disabled = pasoActual === 0;
    if (pasoActual === pasosEls.length - 1) { next.classList.add('mc-terminar'); next.innerHTML = '<span>Terminar</span> ✓'; }
    else { next.classList.remove('mc-terminar'); next.innerHTML = '<span>Siguiente</span> →'; }

    overlayEl.querySelector('.mc-contenido').scrollTop = 0;

    limpiarAutoTimer();
    if (!enMise) {
      const elPaso = pasosEls[pasoActual];
      const btnTimer = elPaso.querySelector('.mc-timer-iniciar');
      if (btnTimer && autoTimerActivo && !autoTimerLanzados.has(pasoActual)) {
        const mins = parseFloat(btnTimer.getAttribute('data-minutos'));
        const yaCorriendo = timers.some(t => t.paso === pasoActual);
        if (!isNaN(mins) && !yaCorriendo) {
          autoTimerLanzados.add(pasoActual);
          iniciarCuentaRegresiva(btnTimer, mins, pasoActual);
        }
      }
    }

    renderTimers();

    if (!silencioso) {
      anunciar('Paso ' + (pasoActual + 1) + ' de ' + pasosEls.length);
      if (ttsActivo && !enMise) {
        var stepText = pasosEls[pasoActual].querySelector('.mc-paso-texto');
        if (stepText) leerTexto(stepText.textContent);
      }
    }
  }

  function actualizarProgreso() {
    if (!overlayEl) return;
    var total = pasosHechos.length; var hechos = pasosHechos.filter(function (v) { return v; }).length;
    var pct = total > 0 ? Math.round((hechos / total) * 100) : 0;
    var fill = overlayEl.querySelector('.mc-progreso-fill'); var texto = overlayEl.querySelector('.mc-progreso-texto');
    if (fill) fill.style.width = pct + '%';
    if (texto) texto.textContent = hechos + ' de ' + total + ' pasos completados';
  }

  function aplicarMarcaPaso(index, valor) {
    pasosHechos[index] = valor;
    var stepEl = overlayEl.querySelector('.mc-paso[data-paso="' + index + '"]');
    if (stepEl) {
      stepEl.classList.toggle('hecho', valor);
      var btn = stepEl.querySelector('.mc-marcar');
      if (btn) {
        btn.setAttribute('aria-pressed', valor ? 'true' : 'false');
        btn.setAttribute('aria-label', (valor ? 'Desmarcar paso ' : 'Marcar paso ') + (index + 1) + (valor ? '' : ' como hecho'));
      }
    }
    actualizarProgreso(); guardarEstado();
  }

  function todosLosPasosHechos() { return pasosHechos.length > 0 && pasosHechos.every(function (v) { return v; }); }

  function marcarHecho(index, valor) {
    if (!recetaActual) return;
    var pasos = recetaActual.pasos || []; if (index < 0 || index >= pasos.length) return;
    aplicarMarcaPaso(index, valor);
    anunciar(valor ? 'Paso ' + (index + 1) + ' marcado como hecho' : 'Paso ' + (index + 1) + ' desmarcado');

    if (todosLosPasosHechos()) { entrarCompletado(); return; }
    else if (overlayEl.classList.contains('completado')) { overlayEl.classList.remove('completado'); }

    if (valor && autoAvanzar && index < pasos.length - 1 && index === pasoActual) {
      setTimeout(function () {
        if (pasoActual === index) {
          pasoActual = index + 1; actualizarPaso(); guardarEstado();
          var newMarcar = overlayEl.querySelector('.mc-paso[data-paso="' + pasoActual + '"] .mc-marcar'); if (newMarcar) newMarcar.focus();
        }
      }, AUTO_ADVANCE_DELAY);
    }
  }

  function marcarYAvanzar() {
    if (!recetaActual) return;
    var pasos = recetaActual.pasos || [];
    if (pasoActual < 0 || pasoActual >= pasos.length) return;
    aplicarMarcaPaso(pasoActual, true);
    anunciar('Paso ' + (pasoActual + 1) + ' marcado como hecho');
    if (todosLosPasosHechos()) { entrarCompletado(); return; }
    if (pasoActual >= pasos.length - 1) return;
    pasoActual++;
    actualizarPaso();
    guardarEstado();
  }

  function entrarCompletado() {
    if (!overlayEl) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    limpiarAutoTimer();
    overlayEl.classList.add('completado');
    anunciar('¡Completaste todos los pasos de la receta!');
    setTimeout(function () { var firstBtn = overlayEl.querySelector('.mc-completado-acciones .mc-btn-accion'); if (firstBtn) firstBtn.focus(); }, 100);
  }

  function salirCompletado() {
    if (!overlayEl) return; overlayEl.classList.remove('completado'); actualizarPaso(true);
    setTimeout(function () { var next = overlayEl.querySelector('.mc-next'); if (next) next.focus(); }, 50);
  }

  function reiniciarProgreso(skipConfirm) {
    var tieneProgreso = pasosHechos.some(function (v) { return v; }) || pasoActual > 0 || miseHechas.some(function (v) { return v; });

    if (!skipConfirm && tieneProgreso) {
      if (reiniciarPendiente === null) {
        reiniciarPendiente = setTimeout(function () {
          reiniciarPendiente = null;
          var btnT = overlayEl && overlayEl.querySelector('.mc-reiniciar');
          if (btnT) {
            btnT.classList.remove('mc-reiniciar-confirmar');
            btnT.innerHTML = '<span class="mc-sheet-item-icon" aria-hidden="true">↺</span><span class="mc-sheet-item-texto">Reiniciar progreso</span>';
          }
        }, 5000);
        var btn = overlayEl && overlayEl.querySelector('.mc-reiniciar');
        if (btn) {
          btn.classList.add('mc-reiniciar-confirmar');
          btn.innerHTML = '<span class="mc-sheet-item-icon" aria-hidden="true">⚠️</span><span class="mc-sheet-item-texto">¿Seguro? Toca otra vez</span>';
        }
        anunciar('Toca otra vez para reiniciar el progreso');
        return;
      }
    }

    if (reiniciarPendiente) { clearTimeout(reiniciarPendiente); reiniciarPendiente = null; }
    var btnX = overlayEl && overlayEl.querySelector('.mc-reiniciar');
    if (btnX) {
      btnX.classList.remove('mc-reiniciar-confirmar');
      btnX.innerHTML = '<span class="mc-sheet-item-icon" aria-hidden="true">↺</span><span class="mc-sheet-item-texto">Reiniciar progreso</span>';
    }

    detenerAlarma();
    pasosHechos = new Array((recetaActual && recetaActual.pasos || []).length).fill(false);
    pasoActual = 0; limpiarEstado(); guardarEstado();
    timers = []; guardarTimers(); renderTimers();
    autoTimerLanzados.clear();
    if (overlayEl) overlayEl.classList.remove('completado');
    // FASE 6H — cerrar el sheet tras reiniciar
    cerrarSheet();
    actualizarPaso(true); actualizarProgreso();
    anunciar('Progreso reiniciado'); reiniciarMise();
    setTimeout(function () { if (enMise) return; var next = overlayEl && overlayEl.querySelector('.mc-next'); if (next) next.focus(); }, 50);
  }

  function pasoAnterior() {
    if (pasoActual > 0) {
      limpiarAutoTimer();
      pasoActual--; actualizarPaso(); guardarEstado();
    }
  }

  function pasoSiguiente() {
    if (!overlayEl) return;
    var pasosEls = overlayEl.querySelectorAll('.mc-paso'); if (pasosEls.length === 0) return;
    var esUltimo = pasoActual >= pasosEls.length - 1;
    limpiarAutoTimer();
    if (autoAvanzar && !pasosHechos[pasoActual]) aplicarMarcaPaso(pasoActual, true);
    if (todosLosPasosHechos()) { entrarCompletado(); return; }
    if (esUltimo) { cerrar(); }
    else { pasoActual++; actualizarPaso(); guardarEstado(); }
  }

  // ---- Auto-init ----
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.btn-modo-cocina');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var dataEl = document.getElementById('receta-data');
      if (!dataEl) return;
      var receta;
      try { receta = JSON.parse(dataEl.textContent); } catch (err) { return; }
      abrir(receta);
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (!overlayEl || !overlayEl.classList.contains('abierto')) return;
    tickTimers();
    if (!document.hidden) {
      solicitarWakeLock();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
      if (alarmaTimer && !alarmaLoopTimeout) iniciarLoopAlarma();
    }
  });

  window.ModoCocina = { abrir: abrir, cerrar: cerrar, analizarPrep: analizarPrep };
})();