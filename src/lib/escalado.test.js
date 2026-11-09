import { describe, it, expect } from 'vitest';
import {
  formatearNumero,
  escalarIngrediente,
  extraerPorciones,
  formatearPorciones,
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
      '3 malaya de vacuno (4½ a 6 kg)',
    ],
    [
      '250 g de garbanzos secos (remojados 12 horas, sin cocer)',
      '500 g de garbanzos secos (remojados 12 horas, sin cocer)',
      '750 g de garbanzos secos (remojados 12 horas, sin cocer)',
    ],
    [
      '4 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
      '8 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
      '12 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
    ],
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
      x15: '6 huevos',
    },
    {
      original: '1 cucharadita de azúcar',
      x05: '½ cucharadita de azúcar',
      x15: '1½ cucharadita de azúcar',
    },
    {
      original: '150 g de pasas remojadas en ron o pisco',
      x05: '75 g de pasas remojadas en ron o pisco',
      x15: '225 g de pasas remojadas en ron o pisco',
    },
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
   FASE 2: PLURALIZACIÓN DE UNIDADES
   ============================================================ */
describe('escalarIngrediente — pluralización de unidades (Fase 2)', () => {
  it('taza → tazas al duplicar', () => {
    expect(escalarIngrediente('1 taza de azúcar', 2)).toBe('2 tazas de azúcar');
  });

  it('taza → tazas al triplicar', () => {
    expect(escalarIngrediente('1 taza de azúcar', 3)).toBe('3 tazas de azúcar');
  });

  it('diente → dientes al duplicar', () => {
    expect(escalarIngrediente('1 diente de ajo', 2)).toBe('2 dientes de ajo');
  });

  it('diente → dientes al triplicar', () => {
    expect(escalarIngrediente('1 diente de ajo', 3)).toBe('3 dientes de ajo');
  });

  it('cucharada → cucharadas al duplicar', () => {
    expect(escalarIngrediente('1 cucharada de aceite', 2)).toBe('2 cucharadas de aceite');
  });

  it('huevo → huevos al duplicar', () => {
    expect(escalarIngrediente('1 huevo', 2)).toBe('2 huevos');
  });

  it('tazas → taza al reducir a la mitad desde 2', () => {
    expect(escalarIngrediente('2 tazas de azúcar', 0.5)).toBe('1 taza de azúcar');
  });

  it('dientes → diente al reducir a la mitad desde 2', () => {
    expect(escalarIngrediente('2 dientes de ajo', 0.5)).toBe('1 diente de ajo');
  });

  it('no pluraliza en 1× (devuelve original)', () => {
    expect(escalarIngrediente('1 taza de azúcar', 1)).toBe('1 taza de azúcar');
  });

  it('1½ queda en singular (entre 1 y 2, no se toca)', () => {
    expect(escalarIngrediente('1 taza de azúcar', 1.5)).toBe('1½ taza de azúcar');
  });

  it('ya plural no se toca al duplicar', () => {
    expect(escalarIngrediente('4 huevos', 2)).toBe('8 huevos');
  });

  it('palabra no listada (malaya) no se toca', () => {
    expect(escalarIngrediente('1 malaya de vacuno', 2)).toBe('2 malaya de vacuno');
  });

  it('kg no se toca (invariante)', () => {
    expect(escalarIngrediente('1 kg de papas', 2)).toBe('2 kg de papas');
  });

  it('palabras de tiempo (hora, minuto) no se escalan ni se pluralizan', () => {
    expect(escalarIngrediente('1 hora de cocción', 2)).toBe('1 hora de cocción');
  });

  it('pluraliza cada par número+palabra del texto', () => {
    expect(escalarIngrediente('1 taza de harina y 1 cucharada de azúcar', 2)).toBe(
      '2 tazas de harina y 2 cucharadas de azúcar'
    );
  });

  it('pluraliza aunque el segundo par ya esté plural', () => {
    expect(escalarIngrediente('1 taza de harina y 2 cucharadas de azúcar', 2)).toBe(
      '2 tazas de harina y 4 cucharadas de azúcar'
    );
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
  });

  it('redondea a entero cuando n > 20 (gramos, ml)', () => {
    expect(formatearNumero(62.5)).toBe('63');
    expect(formatearNumero(21.4)).toBe('21');
    expect(formatearNumero(500)).toBe('500');
  });
});

/* ============================================================
   extraerPorciones / formatearPorciones
   ============================================================ */
describe('extraerPorciones', () => {
  it('"6 personas"', () => {
    expect(extraerPorciones('6 personas')).toEqual({
      min: 6,
      max: null,
      unidad: 'personas',
      texto: '6 personas',
    });
  });

  it('"1 molde grande (12 porciones)"', () => {
    expect(extraerPorciones('1 molde grande (12 porciones)')).toEqual({
      min: 12,
      max: null,
      unidad: 'porciones',
      texto: '1 molde grande (12 porciones)',
    });
  });

  it('"10 panes" → fallback al primer número', () => {
    expect(extraerPorciones('10 panes')).toEqual({
      min: 10,
      max: null,
      unidad: '',
      texto: '10 panes',
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