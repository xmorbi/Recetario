import { describe, it, expect } from 'vitest';
import {
  formatearNumero,
  escalarIngrediente,
  extraerPorciones,
  formatearPorciones
} from './escalado.js';

/* ============================================================
   TABLA DEL PLAN — escalarIngrediente con ×2 y ×3
   ============================================================ */
describe('escalarIngrediente — tabla del plan', () => {
  const casos = [
    ['1/2 taza de azúcar', '1 taza de azúcar', '1½ taza de azúcar'],
    ['1 1/2 tazas de harina', '3 tazas de harina', '4½ tazas de harina'],
    ['1,5 kg de papas', '3 kg de papas', '4½ kg de papas'],
    ['1½ tazas de leche', '3 tazas de leche', '4½ tazas de leche'],
    [
      '1 malaya de vacuno (1,5 a 2 kg)',
      '2 malaya de vacuno (3 a 4 kg)',
      '3 malaya de vacuno (4½ a 6 kg)'
    ],
    [
      '250 g de garbanzos secos (remojados 12 horas, sin cocer)',
      '500 g de garbanzos secos (remojados 12 horas, sin cocer)',
      '750 g de garbanzos secos (remojados 12 horas, sin cocer)'
    ],
    [
      '4 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
      '8 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
      '12 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor'
    ]
  ];

  casos.forEach(([original, x2, x3]) => {
    it(`"${original}" ×2`, () => {
      expect(escalarIngrediente(original, 2)).toBe(x2);
    });
    it(`"${original}" ×3`, () => {
      expect(escalarIngrediente(original, 3)).toBe(x3);
    });
  });

  it('factor 1 devuelve el original sin normalizar (conserva "1½")', () => {
    const original = '1½ tazas de leche';
    expect(escalarIngrediente(original, 1)).toBe(original);
  });
});

/* ============================================================
   FACTORES 0.5 y 1.5 SOBRE LÍNEAS REALES DE src/content/recetas
   ============================================================ */
describe('escalarIngrediente — ×0.5 y ×1.5 sobre ingredientes reales', () => {
  const lineas = [
    {
      original: '4 huevos',
      x05: '2 huevos',
      x15: '6 huevos'
    },
    {
      original: '1 cucharadita de azúcar',
      x05: '½ cucharadita de azúcar',
      x15: '1½ cucharadita de azúcar'
    },
    {
      original: '150 g de pasas remojadas en ron o pisco',
      x05: '75 g de pasas remojadas en ron o pisco',
      x15: '225 g de pasas remojadas en ron o pisco'
    }
  ];

  lineas.forEach(({ original, x05, x15 }) => {
    it(`"${original}" ×0.5`, () => {
      expect(escalarIngrediente(original, 0.5)).toBe(x05);
    });
    it(`"${original}" ×1.5`, () => {
      expect(escalarIngrediente(original, 1.5)).toBe(x15);
    });
  });
});

/* ============================================================
   formatearNumero
   ============================================================ */
describe('formatearNumero', () => {
  it('enteros', () => {
    expect(formatearNumero(0)).toBe('0');
    expect(formatearNumero(1)).toBe('1');
    expect(formatearNumero(3)).toBe('3');
    expect(formatearNumero(500)).toBe('500');
  });

  it('fracciones unicode', () => {
    expect(formatearNumero(0.25)).toBe('¼');
    expect(formatearNumero(0.5)).toBe('½');
    expect(formatearNumero(0.75)).toBe('¾');
    expect(formatearNumero(1.5)).toBe('1½');
    expect(formatearNumero(4.5)).toBe('4½');
    expect(formatearNumero(62.5)).toBe('62½');
  });
});

/* ============================================================
   extraerPorciones / formatearPorciones
   ============================================================ */
describe('extraerPorciones', () => {
  it('"6 personas"', () => {
    expect(extraerPorciones('6 personas')).toEqual({
      min: 6, max: null, unidad: 'personas', texto: '6 personas'
    });
  });

  it('"1 molde grande (12 porciones)"', () => {
    expect(extraerPorciones('1 molde grande (12 porciones)')).toEqual({
      min: 12, max: null, unidad: 'porciones', texto: '1 molde grande (12 porciones)'
    });
  });

  it('"10 panes" → fallback al primer número', () => {
    expect(extraerPorciones('10 panes')).toEqual({
      min: 10, max: null, unidad: '', texto: '10 panes'
    });
  });
});

describe('formatearPorciones', () => {
  it('×2 sobre 4 personas', () => {
    expect(formatearPorciones({ min: 4, max: null, unidad: 'personas' }, 2)).toBe('8 personas');
  });

  it('×0.5 sobre 10 (sin unidad)', () => {
    expect(formatearPorciones({ min: 10, max: null, unidad: '' }, 0.5)).toBe('5');
  });

  it('×3 sobre 12 porciones', () => {
    expect(formatearPorciones({ min: 12, max: null, unidad: 'porciones' }, 3)).toBe('36 porciones');
  });
});