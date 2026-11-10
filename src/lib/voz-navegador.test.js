import { describe, it, expect } from 'vitest';
import { puntuarVoz, elegirMejorVoz } from './voz-navegador.js';

function voz(name, lang, localService) {
  return { name: name, lang: lang, localService: localService, voiceURI: name };
}

describe('puntuarVoz', () => {
  it('es-CL gana a es-ES', () => {
    var cl = voz('Voz CL', 'es-CL', true);
    var es = voz('Voz ES', 'es-ES', true);
    expect(puntuarVoz(cl)).toBeGreaterThan(puntuarVoz(es));
  });
  it('Natural gana a voz básica', () => {
    var nat = voz('Microsoft Catalina Natural', 'es-CL', true);
    var bas = voz('Voz', 'es-CL', true);
    expect(puntuarVoz(nat)).toBeGreaterThan(puntuarVoz(bas));
  });
  it('idioma no español → -Infinity', () => {
    expect(puntuarVoz(voz('English', 'en-US', true))).toBe(-Infinity);
  });
  it('nombre default penalizado', () => {
    var def = voz('default', 'es-CL', true);
    var bas = voz('Voz', 'es-CL', true);
    expect(puntuarVoz(bas)).toBeGreaterThan(puntuarVoz(def));
  });
});

describe('elegirMejorVoz', () => {
  it('elige la mejor puntuada si no hay preferida', () => {
    var voces = [
      voz('Voz ES', 'es-ES', true),
      voz('Catalina Natural', 'es-CL', true),
      voz('English', 'en-US', true)
    ];
    var mejor = elegirMejorVoz(voces, null);
    expect(mejor.lang).toBe('es-CL');
  });
  it('respeta la preferida si existe', () => {
    var voces = [
      voz('Voz ES', 'es-ES', true),
      voz('Catalina Natural', 'es-CL', true)
    ];
    var mejor = elegirMejorVoz(voces, 'Voz ES');
    expect(mejor.lang).toBe('es-ES');
  });
  it('lista vacía → null', () => {
    expect(elegirMejorVoz([], null)).toBeNull();
  });
});