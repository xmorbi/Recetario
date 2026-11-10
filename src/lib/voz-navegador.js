/* =================================================================
   VOZ-NAVEGADOR.JS — Selección y uso de voces del navegador
   Usa Web Speech API (speechSynthesis) con:
   - Ranking de calidad (Natural/Neural/Premium/Enhanced primero).
   - Orden de idioma: es-CL → es-419 → es-US → es-MX → es-AR → es-CO → es-VE → es-PE → es-ES.
   - Espera el evento voiceschanged (Chrome carga async).
   - Normalización + troceo por frases antes de hablar.
   - Preferencia de voz y velocidad persistidas en localStorage.
   Sin dependencias externas.
   ================================================================= */

import { normalizarTexto, dividirEnFrases } from './voz-texto.js';

var STORAGE_VOZ = 'mc_voz_preferida';
var STORAGE_RATE = 'mc_voz_rate';
var RATE_DEFAULT = 1.0;
var RATE_MIN = 0.6;
var RATE_MAX = 1.6;

var PREFERENCIAS_CALIDAD = [
  'natural',
  'neural',
  'premium',
  'enhanced',
  'online',
  'wavenet',
  'studio'
];

var ORDEN_LANG = [
  'es-cl',
  'es-419',
  'es-us',
  'es-mx',
  'es-ar',
  'es-co',
  'es-ve',
  'es-pe',
  'es-es'
];

function normalizarLang(lang) {
  return String(lang || '')
    .toLowerCase()
    .replace('_', '-');
}

export function puntuarVoz(voz) {
  if (!voz) return -Infinity;
  var nombre = String(voz.name || '').toLowerCase();
  var lang = normalizarLang(voz.lang);
  if (!lang.startsWith('es')) return -Infinity;

  var puntaje = 0;

  // 1. Idioma preferido
  var idxLang = ORDEN_LANG.indexOf(lang);
  if (idxLang >= 0) puntaje += (ORDEN_LANG.length - idxLang) * 100;

  // 2. Calidad por nombre (Natural, Neural, Premium, Enhanced, Online…)
  for (var i = 0; i < PREFERENCIAS_CALIDAD.length; i++) {
    if (nombre.indexOf(PREFERENCIAS_CALIDAD[i]) >= 0) {
      puntaje += 50 - i * 5;
      break;
    }
  }

  // 3. Ligero bonus a voces de red (suelen ser neuronales).
  //    Si prefieres offline puro, pon esto en 0.
  if (voz.localService === false) puntaje += 10;

  // 4. Penalizar voces por defecto sin nombre descriptivo
  if (nombre.indexOf('default') >= 0) puntaje -= 20;

  return puntaje;
}

export function listarVocesEspanol() {
  return new Promise(function (resolve) {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    function recolectar() {
      var todas;
      try {
        todas = window.speechSynthesis.getVoices() || [];
      } catch (e) {
        todas = [];
      }
      return todas
        .filter(function (v) {
          return normalizarLang(v.lang).startsWith('es');
        })
        .sort(function (a, b) {
          return puntuarVoz(b) - puntuarVoz(a);
        });
    }

    var primeras = recolectar();
    if (primeras.length > 0) {
      resolve(primeras);
      return;
    }

    var resuelto = false;
    function onChanged() {
      if (resuelto) return;
      var voces = recolectar();
      if (voces.length > 0) {
        resuelto = true;
        try {
          window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
        } catch (e) {}
        resolve(voces);
      }
    }

    try {
      window.speechSynthesis.addEventListener('voiceschanged', onChanged);
    } catch (e) {}

    // Timeout de seguridad (algunos navegadores no disparan voiceschanged
    // si no hay voces de red disponibles)
    setTimeout(function () {
      if (resuelto) return;
      resuelto = true;
      try {
        window.speechSynthesis.removeEventListener('voiceschanged', onChanged);
      } catch (e) {}
      resolve(recolectar());
    }, 1500);
  });
}

export function elegirMejorVoz(voces, preferidaURI) {
  if (!Array.isArray(voces) || voces.length === 0) return null;

  if (preferidaURI) {
    var elegida = voces.find(function (v) {
      return v.voiceURI === preferidaURI;
    });
    if (elegida) return elegida;
  }

  var mejor = null;
  var mejorPuntaje = -Infinity;
  voces.forEach(function (v) {
    var p = puntuarVoz(v);
    if (p > mejorPuntaje) {
      mejorPuntaje = p;
      mejor = v;
    }
  });
  return mejor;
}

export function guardarPreferencias(vozURI, rate) {
  try {
    if (vozURI) localStorage.setItem(STORAGE_VOZ, vozURI);
    if (typeof rate === 'number') localStorage.setItem(STORAGE_RATE, String(rate));
  } catch (e) {}
}

export function cargarPreferencias() {
  try {
    return {
      vozURI: localStorage.getItem(STORAGE_VOZ) || null,
      rate: parseFloat(localStorage.getItem(STORAGE_RATE)) || RATE_DEFAULT
    };
  } catch (e) {
    return { vozURI: null, rate: RATE_DEFAULT };
  }
}

export function hablarConNavegador(texto, opciones) {
  opciones = opciones || {};
  if (!('speechSynthesis' in window)) {
    if (typeof opciones.onEnd === 'function') opciones.onEnd();
    return;
  }

  var voz = opciones.voz || null;
  var rate =
    typeof opciones.rate === 'number'
      ? Math.max(RATE_MIN, Math.min(RATE_MAX, opciones.rate))
      : RATE_DEFAULT;

  var textoNormalizado = normalizarTexto(String(texto || ''));
  var frases = dividirEnFrases(textoNormalizado);
  if (frases.length === 0) {
    if (typeof opciones.onEnd === 'function') opciones.onEnd();
    return;
  }

  var idx = 0;
  function siguiente() {
    if (idx >= frases.length) {
      if (typeof opciones.onEnd === 'function') opciones.onEnd();
      return;
    }
    var frase = frases[idx++];
    var u = new SpeechSynthesisUtterance(frase);
    u.lang = voz ? voz.lang : 'es-CL';
    if (voz) u.voice = voz;
    u.rate = rate;
    u.pitch = 1;
    u.onend = siguiente;
    u.onerror = function () {
      siguiente();
    };
    window.speechSynthesis.speak(u);
  }
  siguiente();
}

export function detenerNavegador() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export var RATE = {
  min: RATE_MIN,
  max: RATE_MAX,
  defecto: RATE_DEFAULT
};