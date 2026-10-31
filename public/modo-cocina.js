/* =================================================================
   MODO-COCINA.JS — Overlay de cocina a pantalla completa
   Fase 1: Focus trap, inert externo, aria-live, atajos de teclado
   Fase 2: Marcar pasos hechos, progreso persistente, pantalla final
   Fase 3: Temporizadores, vibración, persistencia
   FASE 4: Mise en place
   FASE 5: Text-to-Speech (TTS) y Comandos de Voz (Manos Libres)
   FASE 6: Recordatorio visual de comandos y Auto-Timer con cuenta regresiva
   FASE 7: Comandos de voz específicos para mise en place
           (listo / siguiente / atrás / repetir / empezar)
   FASE 7 (fix): "listo" por voz marca + avanza siempre (marcarYAvanzar)
                 autoAvanzar default = true (el toggle del panel lo desactiva)
   FASE 1 (auditoría): fix guardarTTS + no auto-timer en mise en place
   ================================================================= */
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
  var miseActual = -1;           // FASE 7: índice de la tarea actual en mise
  
  // FASE 5 y 6
  var ttsActivo = false;         
  var microActivo = false;
  var recognition = null;
  var autoTimerActivo = true;     
  var countdownInterval = null;   

  // ---- Constantes ----
  var STORAGE_PROGRESO = 'mc_progreso_';
  var STORAGE_AUTOAVANZAR = 'mc_autoavanzar';
  var STORAGE_TIMERS = 'mc_timers_';      
  var STORAGE_SONIDO = 'mc_sonido';       
  var STORAGE_MISE = 'mc_mise_';          
  var STORAGE_TTS = 'mc_tts';             
  var STORAGE_AUTOTIMER = 'mc_autotimer'; 
  var AUTO_ADVANCE_DELAY = 400;
  var TICK_MS = 250;                      

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

  function getFocusables(container) {
    var selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
    var nodes = container.querySelectorAll(selector);
    return Array.prototype.filter.call(nodes, function (el) {
      if (el.hidden) return false;
      var style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  // ---- FASE 6: Auto-Timer y Recordatorio de comandos ----
  function limpiarAutoTimer() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function iniciarCuentaRegresiva(btnTimer, minutos, pasoIdx) {
    limpiarAutoTimer();
    let segundos = 4;
    const textoOriginal = btnTimer.innerHTML;

    btnTimer.innerHTML = `<span aria-hidden="true">⏳</span> Iniciando en ${segundos}s...`;
    btnTimer.disabled = true;
    btnTimer.classList.add('mc-timer-countdown');

    countdownInterval = setInterval(() => {
      segundos--;
      if (segundos > 0) {
        btnTimer.innerHTML = `<span aria-hidden="true">⏳</span> Iniciando en ${segundos}s...`;
      } else {
        limpiarAutoTimer();
        btnTimer.innerHTML = textoOriginal;
        btnTimer.disabled = false;
        btnTimer.classList.remove('mc-timer-countdown');
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

  // ---- FASE 5 y 7: TTS y Comandos de Voz ----
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
      var texto = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      
      // FASE 7: En mise en place, comandos específicos
      if (enMise) {
        if (texto.includes('empezar') || texto.includes('cocinar') || texto.includes('continuar') || texto.includes('vamos')) {
          salirMise();
        } else if (texto.includes('listo') || texto.includes('hecho') || texto.includes('marcar') || texto.includes('ya está') || texto.includes('ya esta')) {
          marcarTareaMiseActual();
        } else if (texto.includes('siguiente') || texto.includes('avanzar')) {
          siguienteTareaMise();
        } else if (texto.includes('atrás') || texto.includes('atras') || texto.includes('anterior')) {
          anteriorTareaMise();
        } else if (texto.includes('repetir') || texto.includes('leer')) {
          leerTareaMiseActual();
        }
        return;
      }
      
      // Comandos normales de pasos (fuera de mise)
      if (texto.includes('siguiente') || texto.includes('avanzar')) {
        if (typeof pasoSiguiente === 'function') pasoSiguiente();
      } else if (texto.includes('atrás') || texto.includes('atras') || texto.includes('anterior')) {
        if (typeof pasoAnterior === 'function') pasoAnterior();
      } else if (texto.includes('listo') || texto.includes('hecho') || texto.includes('marcar')) {
        // FASE 7 (fix): "listo" por voz marca + avanza SIEMPRE, sin depender de autoAvanzar
        if (typeof marcarYAvanzar === 'function') marcarYAvanzar();
      } else if (texto.includes('repetir') || texto.includes('leer')) {
        var stepText = overlayEl.querySelector('.mc-paso.activo .mc-paso-texto');
        if (stepText) {
          leerTexto(stepText.textContent, true);
        }
      }
    };
    
    recognition.onerror = function(e) {
        if(e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            alert('Permiso de micrófono denegado. No se pueden usar los comandos de voz.');
            microActivo = false;
            actualizarBotonMicro();
        }
    };
    
    recognition.onend = function() {
        if (microActivo) {
            try { recognition.start(); } catch(e) {}
        }
    };
  }

  // FASE 7: forzar=true permite leer aunque TTS esté apagado
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
      autoTimerActivo = localStorage.getItem(STORAGE_AUTOTIMER) !== 'false';
      ttsActivo = localStorage.getItem(STORAGE_TTS) === 'true';
      // FASE 7 (fix): default true. El usuario lo desactiva explícitamente con el toggle.
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

  // ---- Focus trap + inert externo ----
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

  // ---- Persistencia ----
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

  // ---- Audio ----
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

  // ---- Tiempos y Timers ----
  function detectarTiempo(texto) {
    if (!texto) return null; var totalMin = 0; var tiene = false; var m;
    var reHoras = /(\d+)\s*(?:h|hrs?|horas?)\b/gi; while ((m = reHoras.exec(texto)) !== null) { totalMin += parseInt(m[1], 10) * 60; tiene = true; }
    var reMin = /(\d+)\s*(?:min|mins|minutos?)\b/gi; while ((m = reMin.exec(texto)) !== null) { totalMin += parseInt(m[1], 10); tiene = true; }
    if (!tiene || totalMin <= 0) return null; return { minutos: totalMin };
  }
  function formatTiempo(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000)); var h = Math.floor(totalSec / 3600); var mi = Math.floor((totalSec % 3600) / 60); var s = totalSec % 60;
    if (h > 0) return h + ':' + String(mi).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return String(mi).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function guardarTimers() {
    if (!recetaSlug) return;
    try {
      var data = timers.map(function (t) { return { id: t.id, paso: t.paso, duracionTotal: t.duracionTotal, finTimestamp: t.finTimestamp, restanteAlPausar: t.restanteAlPausar, estado: t.estado, etiqueta: t.etiqueta }; });
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
        if (estado === 'corriendo' && t.finTimestamp && t.finTimestamp <= ahora) estado = 'terminado';
        return { id: t.id, paso: t.paso, duracionTotal: t.duracionTotal, finTimestamp: t.finTimestamp, restanteAlPausar: t.restanteAlPausar || 0, estado: estado, etiqueta: t.etiqueta, yaAlertado: estado === 'terminado' };
      });
    } catch (e) { return []; }
  }

  function iniciarTimer(paso, minutos) {
    if (minutos <= 0) return;
    initAudio(); var ahora = Date.now();
    timers.push({ id: 't_' + ahora + '_' + Math.random().toString(36).slice(2, 7), paso: paso, duracionTotal: minutos * 60 * 1000, finTimestamp: ahora + minutos * 60 * 1000, restanteAlPausar: 0, estado: 'corriendo', etiqueta: 'Paso ' + (paso + 1) + ' — ' + minutos + ' min', yaAlertado: false });
    guardarTimers(); playTick(); renderTimers(); anunciar('Temporizador iniciado: ' + minutos + ' minutos');
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
    timers = timers.filter(function (x) { return x.id !== id; }); guardarTimers(); renderTimers(); anunciar('Temporizador cancelado');
  }

  function dispararAlerta(timer) {
    playDing();
    if ('vibrate' in navigator) { try { navigator.vibrate([200, 100, 200, 100, 400]); } catch (e) {} }
    anunciar('Temporizador finalizado: ' + timer.etiqueta);
    if (ttsActivo) leerTexto('El temporizador del ' + timer.etiqueta + ' ha terminado');
  }

  function tickTimers() {
    if (!overlayEl || !overlayEl.classList.contains('abierto')) return;
    var ahora = Date.now(); var cambioEstado = false;
    timers.forEach(function (t) {
      if (t.estado === 'corriendo' && t.finTimestamp <= ahora) {
        t.estado = 'terminado'; cambioEstado = true;
        if (!t.yaAlertado) { t.yaAlertado = true; dispararAlerta(t); }
      }
    });
    if (cambioEstado) { guardarTimers(); renderTimers(); return; }
    timers.forEach(function (t) {
      if (t.estado !== 'corriendo') return;
      var el = overlayEl.querySelector('.mc-timer-chip[data-id="' + t.id + '"] .mc-timer-tiempo');
      if (el) el.textContent = formatTiempo(Math.max(0, t.finTimestamp - ahora));
    });
  }

  function renderTimers() {
    if (!overlayEl) return; var cont = overlayEl.querySelector('.mc-timers'); if (!cont) return;
    if (timers.length === 0) { cont.innerHTML = ''; cont.hidden = true; return; }
    cont.hidden = false; var ahora = Date.now();
    cont.innerHTML = timers.map(function (t) {
      var restante = t.estado === 'corriendo' ? Math.max(0, t.finTimestamp - ahora) : (t.estado === 'pausado' ? t.restanteAlPausar : 0);
      var clase = 'mc-timer-chip' + (t.estado === 'terminado' ? ' mc-timer-terminado' : (t.estado === 'pausado' ? ' mc-timer-pausado' : ''));
      var botones = '';
      if (t.estado === 'corriendo') botones += '<button type="button" class="mc-timer-btn" data-action="pausar" data-id="' + t.id + '" aria-label="Pausar temporizador">⏸</button>';
      else if (t.estado === 'pausado') botones += '<button type="button" class="mc-timer-btn" data-action="reanudar" data-id="' + t.id + '" aria-label="Reanudar temporizador">▶</button>';
      botones += '<button type="button" class="mc-timer-btn" data-action="agregar" data-id="' + t.id + '" aria-label="Añadir 1 minuto">+1</button>';
      botones += '<button type="button" class="mc-timer-btn mc-timer-btn-cerrar" data-action="cancelar" data-id="' + t.id + '" aria-label="Cancelar temporizador">×</button>';
      var icono = t.estado === 'terminado' ? '🔔' : '⏱';
      return '<div class="' + clase + '" data-id="' + t.id + '"><span class="mc-timer-icono" aria-hidden="true">' + icono + '</span><span class="mc-timer-label">P' + (t.paso + 1) + '</span><span class="mc-timer-tiempo">' + formatTiempo(restante) + '</span><div class="mc-timer-acciones">' + botones + '</div></div>';
    }).join('');
  }

  // ---- Wake lock ----
  async function solicitarWakeLock() { try { if ('wakeLock' in navigator && !WAKE_LOCK) { WAKE_LOCK = await navigator.wakeLock.request('screen'); WAKE_LOCK.addEventListener('release', function () { WAKE_LOCK = null; }); } } catch (e) {} }
  function liberarWakeLock() { if (WAKE_LOCK) { try { WAKE_LOCK.release(); } catch (e) {} WAKE_LOCK = null; } }

  // ================= MISE EN PLACE =================
  var VERBOS = { remojar: 'Remojar', cocer: 'Cocer', enfriar: 'Enfriar', lavar: 'Lavar', pelar: 'Pelar', cascara: 'Sacar la cáscara', desgranar: 'Desgranar', cortar: 'Cortar', picar: 'Picar', laminar: 'Laminar', rallar: 'Rallar', exprimir: 'Exprimir', moler: 'Pisar', desmenuzar: 'Desmenuzar', derretir: 'Derretir', batir: 'Batir', cernir: 'Cernir' };
  var ORDEN_VERBOS = ['remojar', 'cocer', 'enfriar', 'lavar', 'pelar', 'cascara', 'desgranar', 'cortar', 'picar', 'laminar', 'rallar', 'exprimir', 'moler', 'desmenuzar', 'derretir', 'batir', 'cernir'];
  var BUCKET_DE = { remojar: 'adelantar', cocer: 'adelantar', enfriar: 'adelantar', lavar: 'limpiar', pelar: 'limpiar', cascara: 'limpiar', desgranar: 'limpiar', cortar: 'cortar', picar: 'cortar', laminar: 'cortar', rallar: 'rallar', exprimir: 'rallar', moler: 'rallar', desmenuzar: 'rallar', derretir: 'mezclar', batir: 'mezclar', cernir: 'mezclar' };
  var BUCKETS = [ { id: 'adelantar', icono: '⏳', titulo: 'Adelantar (toma tiempo)' }, { id: 'limpiar', icono: '🧼', titulo: 'Lavar y pelar' }, { id: 'cortar', icono: '🔪', titulo: 'Cortar y picar' }, { id: 'rallar', icono: '🧀', titulo: 'Rallar, exprimir y desmenuzar' }, { id: 'mezclar', icono: '🥣', titulo: 'Derretir, batir y cernir' } ];
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

  // ================= FASE 7: Navegación de tareas en mise =================
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
      var fin = 'No hay más tareas pendientes. Decí empezar para cocinar.';
      anunciar(fin);
      if (ttsActivo) leerTexto(fin);
    }
  }

  function marcarTareaMiseActual() {
    if (!prep) return;
    if (miseActual < 0) {
      var todoHecho = miseHechas.every(function (v) { return v; });
      var msgNo = todoHecho ? '¡Todo listo! Decí empezar para cocinar.' : 'No hay tarea actual.';
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
      msg = 'Listo: ' + tareaHecha.etiqueta + ' ' + tareaHecha.texto + '. ¡Todo listo! Decí empezar para cocinar.';
    }
    anunciar(msg);
    if (ttsActivo) leerTexto(msg);
  }

  function siguienteTareaMise() {
    if (!prep) return;
    avanzarTareaMise();
  }

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
      if (pendiente >= 0) {
        miseActual = pendiente;
        actualizarTareaActualMise();
      }
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
      if (miseActual >= 0) {
        f = overlayEl.querySelector('.mc-mise-check[data-id="' + miseActual + '"]');
      }
      if (!f) f = overlayEl.querySelector('.mc-mise-empezar');
      if (f) f.focus();
    }, 60);
  }

  function entrarMise() {
    if (!overlayEl || !prep || prep.tareas.length === 0) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel(); 
    limpiarAutoTimer();
    if (miseActual < 0 || miseHechas[miseActual]) {
      miseActual = buscarTareaPendiente(0);
    }
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

  // ---- Construcción del overlay ----
  function crearOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement('div');
    overlayEl.id = 'modo-cocina'; overlayEl.className = 'mc-overlay';
    overlayEl.setAttribute('role', 'dialog'); overlayEl.setAttribute('aria-modal', 'true'); overlayEl.setAttribute('aria-labelledby', 'mc-titulo');

    overlayEl.innerHTML =
      '<div class="mc-live" aria-live="polite" aria-atomic="true"></div>' +
      '<header class="mc-header">' +
        '<h1 id="mc-titulo" class="mc-titulo"></h1>' +
        '<div class="mc-header-acciones">' +
          '<button type="button" class="mc-btn-icon mc-tts-toggle" aria-pressed="false" aria-label="Leer pasos en voz alta" title="Leer pasos en voz alta" style="display:none;">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>' +
          '</button>' +
          '<button type="button" class="mc-btn-icon mc-mic-toggle" aria-pressed="false" aria-label="Activar manos libres (comandos de voz)" title="Manos libres (Comandos de Voz)" style="display:none;">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' +
          '</button>' +
          '<details class="mc-atajos">' +
            '<summary aria-label="Ayuda y atajos de teclado">?</summary>' +
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
              '</ul>' +
              '<label class="mc-atajos-setting"><span>Avanzar al marcar hecho</span><input type="checkbox" class="mc-toggle-autoavanzar"></label>' +
              '<label class="mc-atajos-setting"><span>Iniciar timer automáticamente</span><input type="checkbox" class="mc-toggle-autotimer"></label>' +
              '<label class="mc-atajos-setting"><span>Sonido de alarma</span><input type="checkbox" class="mc-toggle-sonido"></label>' +
              '<label class="mc-atajos-setting"><span>Leer pasos en voz alta</span><input type="checkbox" class="mc-toggle-tts"></label>' +
            '</div>' +
          '</details>' +
          '<button type="button" class="mc-btn-icon mc-mise-toggle" aria-pressed="false" aria-label="Preparación (mise en place)" title="Preparación (mise en place)" hidden>' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 8 9 4"/><polyline points="3 14 5 16 9 12"/><line x1="13" y1="6" x2="21" y2="6"/><line x1="13" y1="14" x2="21" y2="14"/><line x1="3" y1="21" x2="21" y2="21"/></svg>' +
          '</button>' +
          '<button type="button" class="mc-btn-icon mc-reiniciar" aria-label="Reiniciar progreso" title="Reiniciar progreso">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' +
          '</button>' +
          '<button type="button" class="mc-btn-icon mc-cerrar" aria-label="Cerrar modo cocina">' +
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</header>' +
      '<div class="mc-voice-hint" hidden>🎤 Di: "Siguiente", "Atrás", "Listo", "Repetir" o "Empezar"</div>' +
      '<div class="mc-progreso" aria-hidden="true"><div class="mc-progreso-barra"><div class="mc-progreso-fill"></div></div><div class="mc-progreso-texto">0 de 0 pasos completados</div></div>' +
      '<div class="mc-timers" hidden></div>' +
      '<details class="mc-ingredientes"><summary>Ingredientes (<span class="mc-ing-count">0</span>)</summary><ul class="mc-ing-list"></ul></details>' +
      '<section class="mc-mise" aria-labelledby="mc-mise-titulo"></section>' +
      '<div class="mc-contenido"></div>' +
      '<nav class="mc-nav" aria-label="Navegación de pasos">' +
        '<button type="button" class="mc-prev" aria-label="Paso anterior">← <span>Anterior</span></button>' +
        '<span class="mc-contador" aria-live="polite">1 / 1</span>' +
        '<button type="button" class="mc-next" aria-label="Paso siguiente"><span>Siguiente</span> →</button>' +
      '</nav>';

    document.body.appendChild(overlayEl);

    overlayEl.querySelector('.mc-cerrar').addEventListener('click', cerrar);
    overlayEl.querySelector('.mc-prev').addEventListener('click', pasoAnterior);
    overlayEl.querySelector('.mc-next').addEventListener('click', pasoSiguiente);
    overlayEl.querySelector('.mc-reiniciar').addEventListener('click', function () { reiniciarProgreso(false); });

    overlayEl.querySelector('.mc-mise-toggle').addEventListener('click', function () { if (enMise) salirMise(); else entrarMise(); });
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
    });
    toggleTTS.addEventListener('change', function() { if (this.checked !== ttsActivo) ttsBtn.click(); });

    var micBtn = overlayEl.querySelector('.mc-mic-toggle');
    micBtn.addEventListener('click', function() {
      if (!recognition) return;
      microActivo = !microActivo;
      actualizarBotonMicro();
      if (microActivo) {
        try { recognition.start(); anunciar(enMise ? 'Comandos de voz activados. Decí listo, siguiente, atrás o empezar.' : 'Comandos de voz activados.'); } catch(e) { console.error(e); microActivo = false; actualizarBotonMicro(); }
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
        limpiarAutoTimer();
        var mins = parseInt(iniciarBtn.getAttribute('data-minutos'), 10); var pasoIdx = parseInt(iniciarBtn.getAttribute('data-paso'), 10); 
        if (!isNaN(mins) && !isNaN(pasoIdx)) iniciarTimer(pasoIdx, mins); 
        return; 
      }
      var accion = e.target.closest('[data-accion]');
      if (accion) {
        var act = accion.getAttribute('data-accion');
        if (act === 'cerrar') cerrar(); else if (act === 'reiniciar') reiniciarProgreso(true); else if (act === 'ver-pasos') salirCompletado();
      }
    });

    overlayEl.querySelector('.mc-timers').addEventListener('click', function (e) {
      var btn = e.target.closest('.mc-timer-btn'); if (!btn) return;
      var action = btn.getAttribute('data-action'); var id = btn.getAttribute('data-id');
      if (action === 'pausar') pausarTimer(id); else if (action === 'reanudar') reanudarTimer(id); else if (action === 'agregar') agregarTiempo(id, 1); else if (action === 'cancelar') cancelarTimer(id);
    });

    document.addEventListener('click', function (e) {
      if (!overlayEl || !overlayEl.classList.contains('abierto')) return;
      var atajos = overlayEl.querySelector('.mc-atajos');
      if (atajos && atajos.open && !atajos.contains(e.target)) atajos.open = false;
    }, true);

    return overlayEl;
  }

  // ---- Abrir ----
  function abrir(receta) {
    if (!receta) return;
    recetaActual = receta;
    botonOrigen = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;

    var slugBtn = document.querySelector('.btn-favorito[data-slug]');
    recetaSlug = slugBtn ? slugBtn.getAttribute('data-slug') : slugify(receta.titulo || 'default');

    var pasos = receta.pasos || [];
    var saved = cargarEstado(pasos.length);
    if (saved) { pasoActual = saved.pasoActual; pasosHechos = saved.pasosHechos; }
    else { pasoActual = 0; pasosHechos = new Array(pasos.length).fill(false); }

    cargarAjustes();
    timers = cargarTimersGuardados();
    microActivo = false; 
    
    initAudio();
    initTTS();

    var ov = crearOverlay();
    ov.classList.remove('completado');
    ov.querySelector('.mc-titulo').textContent = receta.titulo || 'Receta';
    ov.querySelector('.mc-toggle-autoavanzar').checked = autoAvanzar;
    ov.querySelector('.mc-toggle-sonido').checked = sonidoActivo;
    ov.querySelector('.mc-toggle-autotimer').checked = autoTimerActivo;

    var ttsBtn = ov.querySelector('.mc-tts-toggle');
    var toggleTTS = ov.querySelector('.mc-toggle-tts');
    if ('speechSynthesis' in window) {
      ttsBtn.style.display = 'inline-flex';
      ttsBtn.setAttribute('aria-pressed', ttsActivo ? 'true' : 'false');
      ttsBtn.classList.toggle('activo', ttsActivo);
      toggleTTS.checked = ttsActivo;
    }

    var micBtn = ov.querySelector('.mc-mic-toggle');
    if (recognition) {
      micBtn.style.display = 'inline-flex';
    } else {
      micBtn.style.display = 'none';
    }
    actualizarBotonMicro();

    prep = analizarPrep(receta.ingredientes || []);
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

    var ings = receta.ingredientes || [];
    ov.querySelector('.mc-ing-count').textContent = ings.length;
    ov.querySelector('.mc-ing-list').innerHTML = ings.map(function (x) { return '<li>' + escaparHtml(x) + '</li>'; }).join('');

    var htmlPasos = pasos.map(function (p, i) {
      var tiempo = detectarTiempo(p);
      var botonTimer = tiempo ? '<button type="button" class="mc-timer-iniciar" data-paso="' + i + '" data-minutos="' + tiempo.minutos + '" aria-label="Iniciar temporizador de ' + tiempo.minutos + ' minutos"><span aria-hidden="true">⏱</span> Iniciar ' + tiempo.minutos + ' min</button>' : '';
      var btnLeer = '<button type="button" class="mc-leer-btn" aria-label="Escuchar este paso"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Escuchar</button>';

      return '<div class="mc-paso" data-paso="' + i + '">' +
        '<div class="mc-paso-header"><div class="mc-paso-num">Paso ' + (i + 1) + '</div><button type="button" class="mc-marcar" data-paso="' + i + '" aria-pressed="false" aria-label="Marcar paso ' + (i + 1) + ' como hecho"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></button></div>' +
        '<p class="mc-paso-texto">' + escaparHtml(p) + '</p>' +
        '<div class="mc-paso-acciones">' + btnLeer + botonTimer + '</div>' +
      '</div>';
    }).join('');

    var htmlCompletado = '<div class="mc-completado"><div class="mc-completado-emoji" aria-hidden="true">🎉</div><h2>¡Buen provecho!</h2><p>Completaste los ' + pasos.length + ' pasos de <strong>' + escaparHtml(receta.titulo || 'esta receta') + '</strong>. ¡Esperamos que te haya quedado delicioso!</p><div class="mc-completado-acciones"><button type="button" class="mc-btn-accion mc-btn-accion-primario" data-accion="cerrar">Volver a la receta</button><button type="button" class="mc-btn-accion mc-btn-accion-secundario" data-accion="ver-pasos">Revisar pasos</button><button type="button" class="mc-btn-accion mc-btn-accion-secundario" data-accion="reiniciar">Cocinar de nuevo</button></div></div>';

    ov.querySelector('.mc-contenido').innerHTML = htmlPasos + htmlCompletado;

    actualizarPaso(true);
    actualizarProgreso();
    renderTimers();

    if (todosLosPasosHechos()) ov.classList.add('completado');

    document.body.classList.add('mc-bloqueado');
    ov.classList.add('abierto');
    aplicarInert(true);

    if (intervaloTick) clearInterval(intervaloTick);
    intervaloTick = setInterval(tickTimers, TICK_MS);

    onKeyDownHandler = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
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
  }

  function cerrar() {
    if (!overlayEl) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognition && microActivo) { try { recognition.stop(); } catch(e) {} microActivo = false; }
    limpiarAutoTimer();
    
    overlayEl.classList.remove('abierto');
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

    var prev = overlayEl.querySelector('.mc-prev');
    var next = overlayEl.querySelector('.mc-next');
    prev.disabled = pasoActual === 0;
    if (pasoActual === pasosEls.length - 1) { next.classList.add('mc-terminar'); next.innerHTML = '<span>Terminar</span> ✓'; }
    else { next.classList.remove('mc-terminar'); next.innerHTML = '<span>Siguiente</span> →'; }

    overlayEl.querySelector('.mc-contenido').scrollTop = 0;

    // FASE 6: Auto-timer (no en mise)
    limpiarAutoTimer();
    if (!enMise) {
      const elPaso = pasosEls[pasoActual];
      const btnTimer = elPaso.querySelector('.mc-timer-iniciar');
      if (btnTimer && autoTimerActivo) {
        const mins = parseInt(btnTimer.getAttribute('data-minutos'), 10);
        const yaCorriendo = timers.some(t => t.paso === pasoActual && t.estado === 'corriendo');
        if (!isNaN(mins) && !yaCorriendo) {
          iniciarCuentaRegresiva(btnTimer, mins, pasoActual);
        }
      }
    }

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

  // FASE 7 (fix): "listo" por voz marca + avanza SIEMPRE, sin depender de autoAvanzar.
  // El toggle "Avanzar al marcar hecho" queda solo para el clic manual.
  function marcarYAvanzar() {
    if (!recetaActual) return;
    var pasos = recetaActual.pasos || [];
    if (pasoActual < 0 || pasoActual >= pasos.length) return;

    aplicarMarcaPaso(pasoActual, true);
    anunciar('Paso ' + (pasoActual + 1) + ' marcado como hecho');

    if (todosLosPasosHechos()) {
      entrarCompletado();
      return;
    }

    if (pasoActual >= pasos.length - 1) {
      // Último paso: ya completado arriba; por si acaso, no avanzar más
      return;
    }

    pasoActual++;
    actualizarPaso();       // anuncia "Paso N de M" y lee en TTS si está activo
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
    if (!skipConfirm && tieneProgreso) { if (!confirm('¿Reiniciar el progreso de esta receta?')) return; }
    pasosHechos = new Array((recetaActual && recetaActual.pasos || []).length).fill(false);
    pasoActual = 0; limpiarEstado(); guardarEstado();
    if (overlayEl) overlayEl.classList.remove('completado');
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
    var dataEl = document.getElementById('receta-data'); var btn = document.querySelector('.btn-modo-cocina');
    if (!dataEl || !btn) return; var receta;
    try { receta = JSON.parse(dataEl.textContent); } catch (e) { return; }
    btn.addEventListener('click', function (e) { e.preventDefault(); abrir(receta); });
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && overlayEl && overlayEl.classList.contains('abierto')) {
      solicitarWakeLock();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
    }
  });

  window.ModoCocina = { abrir: abrir, cerrar: cerrar, analizarPrep: analizarPrep };
})();