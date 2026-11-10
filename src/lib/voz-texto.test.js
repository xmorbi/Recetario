import { describe, it, expect } from 'vitest';
import { normalizarTexto, dividirEnFrases } from './voz-texto.js';

describe('normalizarTexto — unidades', () => {
  it('300 g → 300 gramos', () => {
    expect(normalizarTexto('300 g de carne')).toBe('300 gramos de carne');
  });
  it('1 g → 1 gramo (singular)', () => {
    expect(normalizarTexto('1 g de sal')).toBe('1 gramo de sal');
  });
  it('1 kg → 1 kilo', () => {
    expect(normalizarTexto('1 kg de papas')).toBe('1 kilo de papas');
  });
  it('2 kg → 2 kilos', () => {
    expect(normalizarTexto('2 kg de papas')).toBe('2 kilos de papas');
  });
  it('200 ml → 200 mililitros', () => {
    expect(normalizarTexto('200 ml de leche')).toBe('200 mililitros de leche');
  });
  it('1 L → 1 litro', () => {
    expect(normalizarTexto('1 L de agua')).toBe('1 litro de agua');
  });
  it('160 °C → 160 grados', () => {
    expect(normalizarTexto('Horno a 160 °C')).toBe('Horno a 160 grados');
  });
  it('20°C sin espacio', () => {
    expect(normalizarTexto('a 20°C')).toBe('a 20 grados');
  });
  it('no toca palabras que contienen la unidad', () => {
    expect(normalizarTexto('agua')).toBe('agua');
    expect(normalizarTexto('mermelada')).toBe('mermelada');
    expect(normalizarTexto('3 grandes')).toBe('3 grandes');
  });
});

describe('normalizarTexto — rangos', () => {
  it('20-25 min → 20 a 25 minutos', () => {
    expect(normalizarTexto('20-25 min')).toBe('20 a 25 minutos');
  });
  it('10 a 12 sin cambio', () => {
    expect(normalizarTexto('10 a 12 minutos')).toBe('10 a 12 minutos');
  });
});

describe('normalizarTexto — fracciones y decimales', () => {
  it('0.5 → medio', () => {
    expect(normalizarTexto('0.5 pimentón')).toBe('medio pimentón');
  });
  it('0,5 con coma', () => {
    expect(normalizarTexto('0,5 taza')).toBe('medio taza');
  });
  it('1/2 → medio', () => {
    expect(normalizarTexto('1/2 cucharadita')).toBe('medio cucharadita');
  });
  it('3/4 → tres cuartos', () => {
    expect(normalizarTexto('3/4 taza')).toBe('tres cuartos taza');
  });
  it('½ unicode', () => {
    expect(normalizarTexto('½ limón')).toBe('medio limón');
  });
  it('1.5 kg → uno y medio kilos', () => {
    expect(normalizarTexto('1.5 kg')).toBe('uno y medio kilos');
  });
});

describe('normalizarTexto — casos mixtos', () => {
  it('paso completo', () => {
    expect(normalizarTexto('Cocina 300 g de carne a 160 °C por 20-25 min')).toBe(
      'Cocina 300 gramos de carne a 160 grados por 20 a 25 minutos'
    );
  });
  it('texto sin cambios', () => {
    expect(normalizarTexto('Revolver bien y servir.')).toBe('Revolver bien y servir.');
  });
  it('vacío / no string', () => {
    expect(normalizarTexto('')).toBe('');
    expect(normalizarTexto(null)).toBe('');
    expect(normalizarTexto(123)).toBe('');
  });
});

describe('dividirEnFrases', () => {
  it('una sola frase sin puntuación', () => {
    expect(dividirEnFrases('Revolver bien')).toEqual(['Revolver bien']);
  });
  it('dos frases', () => {
    expect(dividirEnFrases('Lavar. Cortar.')).toEqual(['Lavar.', 'Cortar.']);
  });
  it('mezcla de signos', () => {
    expect(dividirEnFrases('¿Listo? ¡Sí! Sirve.')).toEqual(['¿Listo?', '¡Sí!', 'Sirve.']);
  });
  it('texto largo sin puntuación se subdivide por comas', () => {
    var largo = 'palabra, '.repeat(30) + 'fin';
    var frases = dividirEnFrases(largo);
    expect(frases.length).toBeGreaterThan(1);
    frases.forEach(function (f) {
      expect(f.length).toBeLessThanOrEqual(200);
    });
  });
  it('vacío devuelve []', () => {
    expect(dividirEnFrases('')).toEqual([]);
    expect(dividirEnFrases(null)).toEqual([]);
  });
});