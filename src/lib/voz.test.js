import { describe, it, expect } from 'vitest';
import { interpretarComando, aPlano } from './voz.js';

describe('aPlano', () => {
  it('quita tildes y pasa a minúsculas', () => {
    expect(aPlano('Atrás')).toBe('atras');
    expect(aPlano('SIGUIENTE')).toBe('siguiente');
    expect(aPlano('cuánto falta')).toBe('cuanto falta');
  });
});

describe('interpretarComando — tabla del plan', () => {
  it('siguiente → siguiente', () => {
    expect(interpretarComando('siguiente', false)).toBe('siguiente');
  });
  it('atrás → atras', () => {
    expect(interpretarComando('atrás', false)).toBe('atras');
  });
  it('listo → listo', () => {
    expect(interpretarComando('listo', false)).toBe('listo');
  });
  it('cuánto falta → tiempo', () => {
    expect(interpretarComando('cuánto falta', false)).toBe('tiempo');
  });
  it('ya está listo el arroz → null (5 palabras)', () => {
    expect(interpretarComando('ya está listo el arroz', false)).toBeNull();
  });
  it('el siguiente paso es hervir el agua → null (7 palabras)', () => {
    expect(interpretarComando('el siguiente paso es hervir el agua', false)).toBeNull();
  });
});

describe('interpretarComando — normalización y palabra completa', () => {
  it('acepta mayúsculas y sin tildes', () => {
    expect(interpretarComando('SIGUIENTE', false)).toBe('siguiente');
    expect(interpretarComando('ATRAS', false)).toBe('atras');
    expect(interpretarComando('AtRáS', false)).toBe('atras');
  });
  it('no matchea substrings', () => {
    expect(interpretarComando('listones', false)).toBeNull();
    expect(interpretarComando('siguientes', false)).toBeNull();
    expect(interpretarComando('atrasado', false)).toBeNull();
  });
  it('ya esta listo (3 palabras) → listo', () => {
    expect(interpretarComando('ya esta listo', false)).toBe('listo');
  });
});

describe('interpretarComando — sinónimos', () => {
  it('avanzar → siguiente', () => {
    expect(interpretarComando('avanzar', false)).toBe('siguiente');
  });
  it('anterior → atras', () => {
    expect(interpretarComando('anterior', false)).toBe('atras');
  });
  it('hecho / marcar → listo', () => {
    expect(interpretarComando('hecho', false)).toBe('listo');
    expect(interpretarComando('marcar', false)).toBe('listo');
  });
  it('leer → repetir', () => {
    expect(interpretarComando('leer', false)).toBe('repetir');
  });
});

describe('interpretarComando — comandos nuevos (modo normal)', () => {
  it('pausa / pausar → pausa', () => {
    expect(interpretarComando('pausa', false)).toBe('pausa');
    expect(interpretarComando('pausar', false)).toBe('pausa');
  });
  it('reanudar → reanudar', () => {
    expect(interpretarComando('reanudar', false)).toBe('reanudar');
  });
  it('tiempo / cuanto tiempo → tiempo', () => {
    expect(interpretarComando('tiempo', false)).toBe('tiempo');
    expect(interpretarComando('cuanto tiempo', false)).toBe('tiempo');
  });
  it('ingredientes → ingredientes', () => {
    expect(interpretarComando('ingredientes', false)).toBe('ingredientes');
  });
});

describe('interpretarComando — modo mise', () => {
  it('comandos de mise funcionan', () => {
    expect(interpretarComando('siguiente', true)).toBe('siguiente');
    expect(interpretarComando('atras', true)).toBe('atras');
    expect(interpretarComando('listo', true)).toBe('listo');
    expect(interpretarComando('repetir', true)).toBe('repetir');
    expect(interpretarComando('empezar', true)).toBe('empezar');
    expect(interpretarComando('cocinar', true)).toBe('empezar');
    expect(interpretarComando('continuar', true)).toBe('empezar');
    expect(interpretarComando('vamos', true)).toBe('empezar');
  });
  it('comandos de timer/ingredientes no aplican en mise', () => {
    expect(interpretarComando('pausa', true)).toBeNull();
    expect(interpretarComando('reanudar', true)).toBeNull();
    expect(interpretarComando('tiempo', true)).toBeNull();
    expect(interpretarComando('cuanto falta', true)).toBeNull();
    expect(interpretarComando('ingredientes', true)).toBeNull();
  });
  it('frases largas siguen siendo null en mise', () => {
    expect(interpretarComando('ya está listo el arroz', true)).toBeNull();
  });
});

/* ============================================================
   FASE 7 — guarda "no"
   ============================================================ */
describe('interpretarComando — guarda "no" (Fase 7)', () => {
  it('"no está listo" → null', () => {
    expect(interpretarComando('no está listo', false)).toBeNull();
  });
  it('"no listo" → null', () => {
    expect(interpretarComando('no listo', false)).toBeNull();
  });
  it('"aún no" → null', () => {
    expect(interpretarComando('aún no', false)).toBeNull();
  });
  it('"todavía no está" → null', () => {
    expect(interpretarComando('todavía no está', false)).toBeNull();
  });
  it('"no, listo" → null (con coma)', () => {
    expect(interpretarComando('no, listo', false)).toBeNull();
  });
  it('"no repetir" → null', () => {
    expect(interpretarComando('no repetir', false)).toBeNull();
  });
  it('"no" → null', () => {
    expect(interpretarComando('no', false)).toBeNull();
  });
  it('"no" en mise también bloquea', () => {
    expect(interpretarComando('no listo', true)).toBeNull();
    expect(interpretarComando('no está listo', true)).toBeNull();
  });
  it('"siguiente" sin "no" sigue funcionando', () => {
    expect(interpretarComando('siguiente', false)).toBe('siguiente');
  });
  it('"cuanto falta" no contiene "no" como palabra, sigue siendo tiempo', () => {
    expect(interpretarComando('cuanto falta', false)).toBe('tiempo');
  });
});

describe('interpretarComando — entradas inválidas', () => {
  it('vacío / null / undefined / número → null', () => {
    expect(interpretarComando('', false)).toBeNull();
    expect(interpretarComando('   ', false)).toBeNull();
    expect(interpretarComando(null, false)).toBeNull();
    expect(interpretarComando(undefined, false)).toBeNull();
    expect(interpretarComando(123, false)).toBeNull();
    expect(interpretarComando({}, false)).toBeNull();
  });
  it('3 palabras sin comando → null', () => {
    expect(interpretarComando('una dos tres', false)).toBeNull();
  });
  it('4 palabras con comando → null', () => {
    expect(interpretarComando('por favor di siguiente', false)).toBeNull();
  });
});
