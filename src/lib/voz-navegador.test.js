import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hablarConNavegador, detenerNavegador } from './voz-navegador.js';

/* =========================================================
   Mocks mínimos de Web Speech API
   ========================================================= */

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.onend = null;
    this.onerror = null;
  }
}

function crearSpeechMock() {
  const spoken = [];
  let actual = null;
  return {
    spoken,
    get actual() {
      return actual;
    },
    speak(u) {
      actual = u;
      spoken.push(u);
    },
    cancel() {
      // La spec dispara onerror 'canceled' sobre la frase en curso.
      // Nuestro mock lo hace síncrono para que el test pueda observar
      // el efecto de inmediato.
      if (actual) {
        const u = actual;
        actual = null;
        if (u.onerror) u.onerror({ error: 'canceled' });
      }
    },
    getVoices() {
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
  };
}

let speech;

beforeEach(() => {
  speech = crearSpeechMock();
  vi.stubGlobal('window', { speechSynthesis: speech });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/* =========================================================
   Casos
   ========================================================= */

describe('hablarConNavegador — avance normal', () => {
  it('onend avanza a la siguiente frase y llama a onEnd al terminar', () => {
    const onEnd = vi.fn();
    hablarConNavegador('Primera frase del paso uno. Segunda frase del paso uno.', { onEnd });

    expect(speech.spoken.length).toBe(1);
    expect(speech.spoken[0].text).toContain('Primera');

    speech.spoken[0].onend();
    expect(speech.spoken.length).toBe(2);
    expect(speech.spoken[1].text).toContain('Segunda');

    speech.spoken[1].onend();
    expect(speech.spoken.length).toBe(2);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});

describe('hablarConNavegador — cancelación (bug de frases viejas)', () => {
  it('detenerNavegador invalida la cadena: no se oyen frases del paso anterior', () => {
    const onEnd = vi.fn();
    hablarConNavegador('Primera frase del paso uno. Segunda frase del paso uno.', { onEnd });
    expect(speech.spoken.length).toBe(1);

    // Cancelar: el mock dispara onerror({error:'canceled'}) sobre la actual.
    detenerNavegador();

    // Aunque el navegador también dispare onend después, no debe avanzar.
    speech.spoken[0].onend();
    expect(speech.spoken.length).toBe(1);
    expect(onEnd).not.toHaveBeenCalled();

    // Nueva lectura del paso 2 no debe mezclarse con la anterior.
    hablarConNavegador('Primera frase del paso dos. Segunda frase del paso dos.', { onEnd });
    expect(speech.spoken.length).toBe(2);
    expect(speech.spoken[1].text).toContain('paso dos');

    // La cadena vieja sigue sin poder avanzar.
    speech.spoken[0].onend();
    speech.spoken[0].onerror({ error: 'canceled' });
    expect(speech.spoken.length).toBe(2);
  });

  it("onerror 'canceled' no avanza aunque no haya cambio de generación", () => {
    hablarConNavegador('Uno. Dos.', {});
    expect(speech.spoken.length).toBe(1);
    speech.spoken[0].onerror({ error: 'canceled' });
    expect(speech.spoken.length).toBe(1);
  });

  it("onerror 'interrupted' no avanza", () => {
    hablarConNavegador('Uno. Dos.', {});
    expect(speech.spoken.length).toBe(1);
    speech.spoken[0].onerror({ error: 'interrupted' });
    expect(speech.spoken.length).toBe(1);
  });
});

describe('hablarConNavegador — errores reales', () => {
  it("onerror 'network' sí avanza (comportamiento previo preservado)", () => {
    hablarConNavegador('Uno. Dos.', {});
    expect(speech.spoken.length).toBe(1);
    speech.spoken[0].onerror({ error: 'network' });
    expect(speech.spoken.length).toBe(2);
    expect(speech.spoken[1].text).toContain('Dos');
  });
});