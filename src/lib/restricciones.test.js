import { describe, it, expect } from 'vitest';
import {
  normalizar,
  obtenerRecetasSeguras,
  tieneTagPositiva,
} from './restricciones.js';

/* ============================================================
   Helpers
   ============================================================ */
function receta({ titulo, categoria = 'principales', tags = [], ingredientes = [] }) {
  return { titulo, categoria, tags, ingredientes };
}

function titulos(recetas) {
  return recetas.map((r) => r.titulo);
}

/* ============================================================
   normalizar — quita tildes y ñ
   ============================================================ */
describe('normalizar', () => {
  it('quita tildes y diéresis', () => {
    expect(normalizar('Jamón')).toBe('jamon');
    expect(normalizar('Salmón')).toBe('salmon');
    expect(normalizar('Piñón')).toBe('pinon');
    expect(normalizar('Castaña')).toBe('castana');
    expect(normalizar('Maní')).toBe('mani');
    expect(normalizar('Pimentón')).toBe('pimenton');
    expect(normalizar('Merkén')).toBe('merken');
  });

  it('maneja null y undefined', () => {
    expect(normalizar(null)).toBe('');
    expect(normalizar(undefined)).toBe('');
  });
});

/* ============================================================
   Bug histórico: \b no funciona junto a tildes
   ============================================================ */
describe('frutos secos — caso "maní" (bug de \\b con tildes)', () => {
  it('detecta "maní" con tilde', () => {
    const recetaConMani = receta({
      titulo: 'Galletas de maní',
      ingredientes: ['200 g de maní tostado', '100 g de azúcar', '1 huevo'],
    });
    const seguras = obtenerRecetasSeguras([recetaConMani], ['frutos_secos']);
    expect(seguras).toHaveLength(0);
  });

  it('detecta "mani" sin tilde', () => {
    const recetaConMani = receta({
      titulo: 'Galletas',
      ingredientes: ['200 g de mani tostado'],
    });
    const seguras = obtenerRecetasSeguras([recetaConMani], ['frutos_secos']);
    expect(seguras).toHaveLength(0);
  });

  it('NO bloquea "manicura" (falso positivo evitado por \\b)', () => {
    const r = receta({
      titulo: 'Receta rara',
      ingredientes: ['1 manicura'], // palabra inventada para probar el \b
    });
    const seguras = obtenerRecetasSeguras([r], ['frutos_secos']);
    expect(seguras).toHaveLength(1);
  });
});

/* ============================================================
   Gluten — ampliación con trigo, mote, avena, cebada
   ============================================================ */
describe('gluten', () => {
  it.each([
    ['trigo', '1 taza de trigo partido'],
    ['mote', '200 g de mote'],
    ['avena', '100 g de avena'],
    ['cebada', '100 g de cebada perlada'],
    ['centeno', '100 g de harina de centeno'],
    ['harina', '2 tazas de harina'],
    ['pan', '2 rebanadas de pan'],
    ['fideos', '200 g de fideos'],
  ])('detecta %s', (_nombre, ingrediente) => {
    const r = receta({ titulo: 'Receta', ingredientes: [ingrediente] });
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(0);
  });

  it('NO bloquea "harina de almendra" (excepción del lookahead)', () => {
    const r = receta({
      titulo: 'Queque sin gluten',
      ingredientes: ['1 taza de harina de almendra'],
      tags: ['sin-gluten'],
    });
    // Sin el tag, el lookahead igual protege; con el tag también.
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(1);
  });
});

/* ============================================================
   Lácteos — ampliación con nata, ricota
   ============================================================ */
describe('lácteos', () => {
  it.each([
    ['nata', '200 ml de nata'],
    ['ricota', '250 g de ricota'],
    ['leche', '1 vaso de leche entera'],
    ['queso', '100 g de queso'],
  ])('detecta %s', (_nombre, ingrediente) => {
    const r = receta({ titulo: 'Receta', ingredientes: [ingrediente] });
    const seguras = obtenerRecetasSeguras([r], ['lacteos']);
    expect(seguras).toHaveLength(0);
  });

  it('NO bloquea "leche de coco"', () => {
    const r = receta({
      titulo: 'Curry',
      ingredientes: ['400 ml de leche de coco', 'curry en polvo'],
    });
    const seguras = obtenerRecetasSeguras([r], ['lacteos']);
    expect(seguras).toHaveLength(1);
  });
});

/* ============================================================
   Mariscos — ampliación con mejillón, langostino, cangrejo,
   trucha, sardina, ostras, erizo
   ============================================================ */
describe('mariscos y pescados', () => {
  it.each([
    ['mejillón', '500 g de mejillón'],
    ['langostino', '500 g de langostinos'],
    ['cangrejo', '1 cangrejo grande'],
    ['trucha', '1 trucha entera'],
    ['sardina', '6 sardinas frescas'],
    ['ostras', '12 ostras'],
    ['erizo', '100 g de erizo de mar'],
    ['camarón', '200 g de camarones'],
    ['salmón', '200 g de salmón'],
  ])('detecta %s', (_nombre, ingrediente) => {
    const r = receta({ titulo: 'Receta', ingredientes: [ingrediente] });
    const seguras = obtenerRecetasSeguras([r], ['mariscos']);
    expect(seguras).toHaveLength(0);
  });
});

/* ============================================================
   Casos end-to-end del planificador
   (los que aparecían y no debían)
   ============================================================ */
describe('casos reales del planificador', () => {
  it('"Panitas de Pollo" NO pasa como sin gluten (tiene harina)', () => {
    const r = receta({
      titulo: 'Panitas de pollo en salsa',
      ingredientes: [
        '500 g de panitas de pollo',
        '2 cucharadas de harina',
        '1 cebolla',
        '2 dientes de ajo',
      ],
    });
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(0);
  });

  it('"Chupe de mariscos" NO pasa como sin gluten (tiene pan)', () => {
    const r = receta({
      titulo: 'Chupe de mariscos',
      categoria: 'sopas',
      ingredientes: [
        '500 g de mariscos',
        '2 rebanadas de pan',
        '1 taza de leche',
        '1 cebolla',
      ],
    });
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(0);
  });

  it('"Pastel de choclo" NO pasa como vegetariano (carne picada)', () => {
    const r = receta({
      titulo: 'Pastel de choclo',
      ingredientes: [
        '4 choclos',
        '500 g de carne picada de vacuno',
        '1 cebolla',
        '2 huevos',
      ],
    });
    const seguras = obtenerRecetasSeguras([r], ['carne']);
    expect(seguras).toHaveLength(0);
  });

  it('"Curanto en hoyo" NO pasa como vegetariano (pollo, cerdo, mariscos)', () => {
    const r = receta({
      titulo: 'Curanto en hoyo',
      ingredientes: [
        '500 g de pollo',
        '500 g de cerdo',
        '500 g de mariscos',
        '1 kg de papas',
      ],
    });
    const seguras = obtenerRecetasSeguras([r], ['carne']);
    expect(seguras).toHaveLength(0);
  });

  it('"Ensalada chilena" SÍ pasa como vegetariano', () => {
    const r = receta({
      titulo: 'Ensalada chilena',
      categoria: 'ensaladas',
      ingredientes: ['2 tomates', '1 cebolla', 'cilantro', 'aceite', 'sal'],
    });
    const seguras = obtenerRecetasSeguras([r], ['carne']);
    expect(titulos(seguras)).toEqual(['Ensalada chilena']);
  });
});

/* ============================================================
   Tags positivas anulan la restricción
   ============================================================ */
describe('tags positivas', () => {
  it('tag "sin-gluten" anula restricción gluten', () => {
    const r = receta({
      titulo: 'Queque apto celíaco',
      tags: ['sin-gluten'],
      ingredientes: ['2 tazas de harina sin gluten'],
    });
    expect(tieneTagPositiva(r, 'gluten')).toBe(true);
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(1);
  });

  it('tag "vegano" anula restricción vegano', () => {
    const r = receta({
      titulo: 'Receta de prueba',
      tags: ['vegano'],
      ingredientes: ['1 taza de harina', '1 taza de leche de vaca'],
    });
    expect(tieneTagPositiva(r, 'vegano')).toBe(true);
    const seguras = obtenerRecetasSeguras([r], ['vegano']);
    expect(seguras).toHaveLength(1);
  });

  it('sin tag, la misma receta falla la restricción', () => {
    const r = receta({
      titulo: 'Receta de prueba',
      ingredientes: ['1 taza de leche de vaca'],
    });
    const seguras = obtenerRecetasSeguras([r], ['lacteos']);
    expect(seguras).toHaveLength(0);
  });
});

/* ============================================================
   Ingredientes opcionales se ignoran
   ============================================================ */
describe('ingredientes opcionales', () => {
  it('"(opcional)" no bloquea la receta', () => {
    const r = receta({
      titulo: 'Receta sin gluten',
      ingredientes: ['1 taza de arroz', '1 cucharada de salsa de soya (opcional)'],
    });
    // Sin la restricción de gluten, pasaría igual; probamos que el filtro
    // de opcionales no la está considerando por otro motivo.
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(1);
  });

  it('"opcional:" no bloquea la receta', () => {
    const r = receta({
      titulo: 'Receta sin gluten',
      ingredientes: ['1 taza de arroz', 'opcional: 1 chorrito de salsa de soya'],
    });
    const seguras = obtenerRecetasSeguras([r], ['gluten']);
    expect(seguras).toHaveLength(1);
  });
});

/* ============================================================
   Tags excluidos (postre, salsa, etc.)
   ============================================================ */
describe('tags excluidos', () => {
  it('"postre" queda fuera del planificador', () => {
    const r = receta({
      titulo: 'Flan',
      categoria: 'principales',
      tags: ['postre'],
      ingredientes: ['4 huevos', '1 taza de leche', 'azúcar'],
    });
    const seguras = obtenerRecetasSeguras([r], []);
    expect(seguras).toHaveLength(0);
  });

  it('"salsa" queda fuera', () => {
    const r = receta({
      titulo: 'Salsa de tomate',
      categoria: 'principales',
      tags: ['salsa'],
      ingredientes: ['tomates', 'ajo'],
    });
    const seguras = obtenerRecetasSeguras([r], []);
    expect(seguras).toHaveLength(0);
  });
});

/* ============================================================
   Categorías válidas
   ============================================================ */
describe('categorías válidas', () => {
  it('"dulces" no es categoría del planificador', () => {
    const r = receta({
      titulo: 'Torta',
      categoria: 'dulces',
      ingredientes: ['harina', 'huevos'],
    });
    const seguras = obtenerRecetasSeguras([r], []);
    expect(seguras).toHaveLength(0);
  });

  it('"principales" sí es categoría válida', () => {
    const r = receta({
      titulo: 'Cazuela',
      categoria: 'principales',
      ingredientes: ['pollo', 'papas'],
    });
    const seguras = obtenerRecetasSeguras([r], []);
    expect(titulos(seguras)).toEqual(['Cazuela']);
  });
});

/* ============================================================
   Alto en proteína
   ============================================================ */
describe('alto en proteína', () => {
  it('receta con pollo pasa alto_proteina', () => {
    const r = receta({
      titulo: 'Pollo asado',
      ingredientes: ['1 pollo entero', 'sal', 'aceite'],
    });
    const seguras = obtenerRecetasSeguras([r], ['alto_proteina']);
    expect(seguras).toHaveLength(1);
  });

  it('ensalada sin proteína NO pasa alto_proteina', () => {
    const r = receta({
      titulo: 'Ensalada verde',
      categoria: 'ensaladas',
      ingredientes: ['lechuga', 'tomate', 'pepino'],
    });
    const seguras = obtenerRecetasSeguras([r], ['alto_proteina']);
    expect(seguras).toHaveLength(0);
  });
});