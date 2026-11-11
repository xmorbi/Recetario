import { describe, it, expect } from 'vitest';
import { normalizarTexto, dividirEnFrases } from './voz-texto.js';

describe('normalizarTexto — Unidades y números', () => {
  it('convierte gramos, kilos y mililitros', () => {
    expect(normalizarTexto('300 g de carne')).toBe('300 gramos de carne');
    expect(normalizarTexto('1 kg de harina')).toBe('1 kilo de harina');
    expect(normalizarTexto('200 ml de leche')).toBe('200 mililitros de leche');
    expect(normalizarTexto('1 L de agua')).toBe('1 litro de agua');
  });

  it('convierte cucharadas y cucharaditas', () => {
    expect(normalizarTexto('2 cdas de azúcar')).toBe('2 cucharadas de azúcar');
    expect(normalizarTexto('1 cdta de sal')).toBe('1 cucharadita de sal');
  });

  it('convierte tiempos, rangos y temperaturas', () => {
    expect(normalizarTexto('20 min')).toBe('20 minutos');
    expect(normalizarTexto('1 h')).toBe('1 hora');
    expect(normalizarTexto('20-25 min')).toBe('20 a 25 minutos');
    expect(normalizarTexto('1-2 hrs')).toBe('1 a 2 horas');
    expect(normalizarTexto('160 °C')).toBe('160 grados');
    expect(normalizarTexto('350 °F')).toBe('350 grados fahrenheit');
  });

  it('convierte fracciones unicode solas', () => {
    expect(normalizarTexto('½ cucharadita')).toBe('media cucharadita');
    expect(normalizarTexto('¼ taza')).toBe('un cuarto de taza');
    expect(normalizarTexto('¾ cucharadita')).toBe('tres cuartos de cucharadita');
    expect(normalizarTexto('⅓ taza')).toBe('un tercio de taza');
    expect(normalizarTexto('⅔ taza')).toBe('dos tercios de taza');
  });

  it('convierte fracciones textuales a texto', () => {
    expect(normalizarTexto('1/2 taza')).toBe('media taza');
    expect(normalizarTexto('1/4 taza')).toBe('un cuarto de taza');
    expect(normalizarTexto('3/4 taza')).toBe('tres cuartos de taza');
    expect(normalizarTexto('1/8 cucharadita')).toBe('un octavo de cucharadita');
  });

  it('convierte decimales comunes', () => {
    expect(normalizarTexto('0.5 taza')).toBe('media taza');
    expect(normalizarTexto('0,5 cucharadita')).toBe('media cucharadita');
    expect(normalizarTexto('0.25 kg')).toBe('un cuarto de kilo');
    expect(normalizarTexto('1.5 kg')).toBe('un kilo y medio');
    expect(normalizarTexto('2,5 litros')).toBe('dos litros y medio');
  });

  it('convierte unidades menos comunes', () => {
    expect(normalizarTexto('5 mg')).toBe('5 miligramos');
    expect(normalizarTexto('10 cc')).toBe('10 centímetros cúbicos');
    expect(normalizarTexto('30 cm')).toBe('30 centímetros');
    expect(normalizarTexto('15 mm')).toBe('15 milímetros');
    expect(normalizarTexto('30 seg')).toBe('30 segundos');
  });

  it('colapsa espacios múltiples', () => {
    expect(normalizarTexto('  300   g   de   carne  ')).toBe('300 gramos de carne');
  });

  it('devuelve string vacío si el input no es string', () => {
    expect(normalizarTexto(null)).toBe('');
    expect(normalizarTexto(undefined)).toBe('');
    expect(normalizarTexto(123)).toBe('');
  });

  it('no altera números que no son unidades', () => {
    expect(normalizarTexto('Cocina por 3 minutos y agrega 2 huevos')).toBe('Cocina por 3 minutos y agrega 2 huevos');
  });
});

describe('normalizarTexto — Fila 7: Género y fracciones mixtas', () => {
  it('aplica género femenino a unidades femeninas', () => {
    expect(normalizarTexto('0.5 taza')).toBe('media taza');
    expect(normalizarTexto('1/2 cucharadita')).toBe('media cucharadita');
    expect(normalizarTexto('0.5 unidad')).toBe('media unidad');
    expect(normalizarTexto('0.5 lata')).toBe('media lata');
  });

  it('aplica género masculino a unidades masculinas', () => {
    expect(normalizarTexto('0.5 pimentón')).toBe('medio pimentón');
    expect(normalizarTexto('1/2 limón')).toBe('medio limón');
    expect(normalizarTexto('0.5 kilo')).toBe('medio kilo');
    expect(normalizarTexto('0.5 litro')).toBe('medio litro');
  });

  it('convierte fracciones mixtas textuales y unicode', () => {
    expect(normalizarTexto('1½ taza')).toBe('una taza y media');
    expect(normalizarTexto('1 1/2 tazas')).toBe('una taza y media');
    expect(normalizarTexto('1 1/2 kg')).toBe('un kilo y medio');
    expect(normalizarTexto('2½ tazas')).toBe('dos tazas y media');
  });

  it('convierte fracciones mixtas complejas', () => {
    expect(normalizarTexto('1 1/4 tazas')).toBe('una taza y un cuarto');
    expect(normalizarTexto('1 3/4 tazas')).toBe('una taza y tres cuartos');
    expect(normalizarTexto('1,5 horas')).toBe('una hora y media');
    expect(normalizarTexto('2.5 minutos')).toBe('dos minutos y medio');
  });

  it('convierte 0.75 a tres cuartos con género', () => {
    expect(normalizarTexto('0.75 kg')).toBe('tres cuartos de kilo');
    expect(normalizarTexto('0,75 taza')).toBe('tres cuartos de taza');
  });

  it('conserva expresiones ya escritas correctamente', () => {
    expect(normalizarTexto('un cuarto de taza')).toBe('un cuarto de taza');
    expect(normalizarTexto('media taza')).toBe('media taza');
    expect(normalizarTexto('una taza y media')).toBe('una taza y media');
  });

  it('no confunde "medio" con "media" en otros contextos', () => {
    expect(normalizarTexto('medio día')).toBe('medio día');
    expect(normalizarTexto('media hora')).toBe('media hora');
  });

  it('maneja mayúsculas y minúsculas', () => {
    expect(normalizarTexto('1 Taza')).toBe('1 taza');
    expect(normalizarTexto('2 KILOS')).toBe('2 kilos');
  });

  it('convierte texto con números y letras mezcladas', () => {
    expect(normalizarTexto('2 tazas y 1/2 cucharadita')).toBe('2 tazas y media cucharadita');
  });
});

describe('dividirEnFrases', () => {
  it('separa por puntos y signos', () => {
    expect(dividirEnFrases('Primer paso. Segundo paso!')).toEqual(['Primer paso.', 'Segundo paso!']);
    expect(dividirEnFrases('¿Listo? Sí.')).toEqual(['¿Listo?', 'Sí.']);
  });

  it('subdivide frases muy largas por comas', () => {
    const larga = 'a'.repeat(150) + ', ' + 'b'.repeat(150);
    const frases = dividirEnFrases(larga);
    expect(frases.length).toBe(2);
    expect(frases[0].endsWith(',')).toBe(true);
  });

  it('devuelve array vacío si no hay texto', () => {
    expect(dividirEnFrases('')).toEqual([]);
    expect(dividirEnFrases(null)).toEqual([]);
  });
});