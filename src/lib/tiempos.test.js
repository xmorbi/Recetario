import { describe, it, expect } from 'vitest';
import { detectarTiempos } from './tiempos.js';

function minutos(tiempos) {
  return tiempos.map(t => t.minutos);
}

describe('detectarTiempos', () => {
  it('suma horas y minutos pero ignora los "cada N"', () => {
    const r = detectarTiempos('Hornea 2 horas cubierto, bañándolo cada 30 minutos con su jugo.');
    expect(minutos(r)).toEqual([120]);
  });

  it('usa el límite inferior de un rango y lo pone en la etiqueta', () => {
    const r = detectarTiempos('…girar los fierritos cada 2-3 minutos… Cocinar 15-20 minutos en total.');
    expect(r.length).toBe(1);
    expect(r[0].minutos).toBe(15);
    expect(r[0].etiqueta).toBe('15–20 min');
  });

  it('usa el límite inferior de un rango con decimales en horas', () => {
    const r = detectarTiempos('Cocina tapado a fuego medio-bajo 1,5 a 2 horas, dando vuelta cada 30 min.');
    expect(minutos(r)).toEqual([90]);
  });

  it('interpreta 1/2 hora como 30 min', () => {
    const r = detectarTiempos('Dejar en reposo por 1/2 hora.');
    expect(minutos(r)).toEqual([30]);
  });

  it('interpreta 1 1/2 hora como 90 min', () => {
    const r = detectarTiempos('Cocinar a horno caliente durante 1 1/2 hora, rociándolo periódicamente con su jugo.');
    expect(minutos(r)).toEqual([90]);
  });

  it('detecta minutos simples', () => {
    const r = detectarTiempos('Cocina el choclo rallado con la leche y la mantequilla a fuego bajo por 15 minutos hasta que espese.');
    expect(minutos(r)).toEqual([15]);
  });

  it('ignora tiempos seguidos de "antes de"', () => {
    const r = detectarTiempos('Un minuto antes de servir agregar la salsa de soja.');
    expect(r).toEqual([]);
  });

  it('no crea timer para días', () => {
    const r = detectarTiempos('deja fermentar en un lugar oscuro y fresco por 7 a 10 días');
    expect(r).toEqual([]);
  });

  it('no crea timer para "un día"', () => {
    const r = detectarTiempos('Dejar macerar de un día para otro.');
    expect(r).toEqual([]);
  });

  it('media hora = 30', () => {
    const r = detectarTiempos('Cocina media hora.');
    expect(minutos(r)).toEqual([30]);
  });

  it('una hora = 60', () => {
    const r = detectarTiempos('Cocina una hora.');
    expect(minutos(r)).toEqual([60]);
  });

  it('1,5 horas = 90', () => {
    const r = detectarTiempos('Cocina 1,5 horas.');
    expect(minutos(r)).toEqual([90]);
  });

  it('30 segundos = 0,5 min', () => {
    const r = detectarTiempos('Cocina 30 segundos.');
    expect(minutos(r)).toEqual([0.5]);
  });

  it('más de 12 horas no crea timer', () => {
    const r = detectarTiempos('Marina 13 horas.');
    expect(r).toEqual([]);
  });

  it('devuelve varios timers si hay varios tiempos válidos', () => {
    const r = detectarTiempos('Llevar al horno, a los 10 minutos tapar y cocinar 2 horas.');
    expect(minutos(r)).toEqual([10, 120]);
  });

  it('ignora "cada N" aunque sea un rango', () => {
    const r = detectarTiempos('Girar cada 2-3 minutos.');
    expect(r).toEqual([]);
  });

  // --- Falsos positivos corregidos ---

  it('no confunde "un sándwich" con 1 segundo', () => {
    expect(detectarTiempos('Sirve con puré, arroz o en un sándwich.')).toEqual([]);
  });

  it('no confunde "5 sándwiches" con 5 segundos', () => {
    expect(detectarTiempos('Sirve con 5 sándwiches.')).toEqual([]);
  });

  it('no confunde "una sartén" con 1 segundo', () => {
    expect(detectarTiempos('Calienta aceite en una sartén.')).toEqual([]);
  });

  it('no detecta "un minuto" (word-num solo aplica a horas)', () => {
    expect(detectarTiempos('Agrega el orégano y cocina un minuto más.')).toEqual([]);
  });

  it('sigue detectando "30 s" con dígitos', () => {
    const r = detectarTiempos('Espera 30 s.');
    expect(r).toHaveLength(1);
    expect(r[0].minutos).toBe(0.5);
  });
});