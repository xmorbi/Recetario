/* =================================================================
   RESTRICCIONES.JS — Filtro puro de recetas por restricciones
   ================================================================= */
export const CATEGORIAS_VALIDAS = ['principales', 'sopas', 'ensaladas', 'mar'];
export const TAGS_EXCLUIDOS = ['salsa', 'picoteo', 'acompañamiento', 'postre', 'merienda'];

const TAGS_EXCLUIDOS_SET = new Set(TAGS_EXCLUIDOS.map(normalizar));

export function normalizar(texto) {
  if (texto == null) return '';
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ---------------------------------------------------------------
// Diccionarios (ASCII, texto normalizado)
// ---------------------------------------------------------------

const LACTEOS =
  /\b(leche(?! de (coco|almendra|soya|soja|avena|arroz))|queso|quesos|mantequilla|crema(?! de (coco|almendra|verduras))|yogur|yogurt|parmesano|manjar|manteca|suero|caseina|nata|natas|ricota|requeson|mozzarella|provolone|gouda|cheddar|gruyere|brie|camembert|mascarpone)\b/;

const GLUTEN =
  /\b(harina(?! de (almendra|coco|arroz))|pan|panes|panqueque|panqueques|marraqueta|marraquetas|hallulla|hallullas|fideo|fideos|tallarin|tallarines|pasta|pastas|galleta|galletas|masa|masas|semola|polvos de hornear|levadura|cerveza|trigo|mote|avena|cebada|centeno|malta|espelta|cuscus|couscous|bulgur)\b/;

const FRUTOS_SECOS =
  /\b(nuez|nueces|nuez moscada|almendra|almendras|mani|manies|avellana|avellanas|pistacho|pistachos|castana|castanas|pinon|pinones|maranon|maranones|pecana|pecanas)\b/;

const MARISCOS =
  /\b(pescado|pescados|camaron|camarones|chorito|choritos|almeja|almejas|macha|machas|loco|locos|jaiba|jaibas|centolla|centollas|congrio|congrios|corvina|corvinas|merluza|merluzas|reineta|reinetas|salmon|atun|jurel|jureles|pulpo|pulpos|calamar|calamares|picoroco|picorocos|cholga|cholgas|ostion|ostiones|marisco|mariscos|mejillon|mejillones|langostino|langostinos|cangrejo|cangrejos|trucha|truchas|sardina|sardinas|ostra|ostras|erizo|erizos)\b/;

const HUEVO = /\b(huevo|huevos|mayonesa|clara|claras|yema|yemas)\b/;

const CARNE =
  /\b(carne(?! de (soya|soja|trigo|vegetal|girasol))|carnes(?! de (soya|soja|trigo|vegetal|girasol))|pollo|pollos|cerdo|cerdos|vacuno|vacunos|pavo|pavos|cordero|corderos|bistec|bistecs|churrasco|churrascos|salchicha|salchichas|vienesa|vienesas|chorizo|chorizos|jamon|jamones|tocino|tocinos|prieta|prietas|longaniza|longanizas|costillar|costillares|pulpa|pulpas|posta|postas|charqui|charquis|hueso|huesos|menudencia|menudencias|guatita|guatitas|chunchule|chunchules|pernil|perniles|malaya|malayas)\b/;

const ANIMALES_VEGANO =
  /\b(carne(?! de (soya|soja|trigo|vegetal|girasol))|carnes(?! de (soya|soja|trigo|vegetal|girasol))|pollo|pollos|cerdo|cerdos|vacuno|vacunos|pavo|pavos|cordero|corderos|bistec|bistecs|churrasco|churrascos|salchicha|salchichas|vienesa|vienesas|chorizo|chorizos|jamon|jamones|tocino|tocinos|prieta|prietas|longaniza|longanizas|costillar|costillares|pulpa|pulpas|posta|postas|charqui|charquis|hueso|huesos|menudencia|menudencias|guatita|guatitas|chunchule|chunchules|pernil|perniles|malaya|malayas|pescado|pescados|camaron|camarones|chorito|choritos|almeja|almejas|macha|machas|loco|locos|jaiba|jaibas|centolla|centollas|congrio|congrios|corvina|corvinas|merluza|merluzas|reineta|reinetas|salmon|atun|jurel|jureles|pulpo|pulpos|calamar|calamares|picoroco|picorocos|cholga|cholgas|ostion|ostiones|marisco|mariscos|mejillon|mejillones|langostino|langostinos|cangrejo|cangrejos|trucha|truchas|sardina|sardinas|ostra|ostras|erizo|erizos|leche(?! de (coco|almendra|soya|soja|avena|arroz))|queso|quesos|mantequilla|crema(?! de (coco|almendra|verduras))|yogur|yogurt|parmesano|manjar|manteca|suero|caseina|nata|natas|ricota|requeson|huevo|huevos|mayonesa|clara|claras|yema|yemas|miel|caldo de carne|caldo de pollo|caldo de hueso)\b/;

const KETO =
  /\b(harina|harinas|pan|panes|marraqueta|marraquetas|hallulla|hallullas|fideo|fideos|tallarin|tallarines|pasta|pastas|galleta|galletas|masa|masas|semola|arroz|arroces|papa|papas|patata|patatas|camote|camotes|choclo|choclos|arveja|arvejas|poroto|porotos|lenteja|lentejas|garbanzo|garbanzos|azucar|chancaca|miel|manjar|fruta|frutas|platano|platanos|manzana|manzanas|pera|peras|durazno|duraznos|naranja|naranjas|jugo|jugos|cerveza|cervezas|vino|vinos)\b/;

const SIN_AZUCAR =
  /\b(azucar|chancaca|miel|manjar|caramelo|camelos|jarabe|jarabes|syrup|mermelada|mermeladas|dulce|dulces)\b/;

export const PROTEINAS =
  /\b(carne|carnes|pollo|pollos|cerdo|cerdos|vacuno|vacunos|pavo|pavos|cordero|corderos|bistec|bistecs|churrasco|churrascos|pescado|pescados|camaron|camarones|chorito|choritos|almeja|almejas|huevo|huevos|queso|quesos|manjar|lenteja|lentejas|poroto|porotos|garbanzo|garbanzos|atun|salmon|jurel|jureles|leche(?! de (coco|almendra|soya|soja|avena|arroz)))\b/;

export const DICCIONARIO_RESTRICCIONES = {
  lacteos: LACTEOS,
  gluten: GLUTEN,
  frutos_secos: FRUTOS_SECOS,
  mariscos: MARISCOS,
  huevo: HUEVO,
  carne: CARNE,
  vegano: ANIMALES_VEGANO,
  keto: KETO,
  sin_azucar: SIN_AZUCAR,
};

export const TAGS_POSITIVAS = {
  lacteos: /\bsin[- ]?lacteos?\b|\bsin[- ]?leche\b|\bvegan[oa]?\b/i,
  gluten: /\bsin[- ]?gluten\b|\bsin[- ]?tacc\b|\bceliac[oa]?\b|\bapto[- ]?celiac/i,
  frutos_secos: /\bsin[- ]?frutos?[- ]?secos?\b|\bsin[- ]?nueces?\b|\bsin[- ]?mani\b/i,
  mariscos: /\bsin[- ]?mariscos?\b|\bsin[- ]?pescado\b|\bvegetarian[oa]?\b|\bvegan[oa]?\b/i,
  huevo: /\bsin[- ]?huevos?\b|\bvegan[oa]?\b/i,
  carne: /\bvegetarian[oa]?\b|\bvegan[oa]?\b|\bsin[- ]?carne\b/i,
  vegano: /\bvegan[oa]?\b|\b100%[- ]?vegetal\b/i,
  keto: /\bketo\b|\blow[- ]?carb\b|\bcetogenic[oa]\b/i,
  sin_azucar: /\bsin[- ]?azucar\b|\bsugar[- ]?free\b|\bdiabetic[oa]\b/i,
  alto_proteina: /\balto[- ]?en[- ]?proteina\b|\bhigh[- ]?protein\b/i,
};

export function tieneTagPositiva(receta, restriccion) {
  const tagsTexto = normalizar((receta.tags || []).join(' '));
  const regex = TAGS_POSITIVAS[restriccion];
  return regex ? regex.test(tagsTexto) : false;
}

export function obtenerRecetasSeguras(recetas, restricciones) {
  const lista = Array.isArray(restricciones) ? restricciones : [];
  if (!Array.isArray(recetas)) return [];

  return recetas.filter((receta) => {
    if (!CATEGORIAS_VALIDAS.includes(receta.categoria)) return false;
    
    // Seguridad: Si la receta no trae ingredientes (error de caché viejo), la descartamos.
    if (!Array.isArray(receta.ingredientes) || receta.ingredientes.length === 0) return false;

    if (
      receta.tags &&
      receta.tags.some((t) => TAGS_EXCLUIDOS_SET.has(normalizar(t)))
    ) {
      return false;
    }

    const ingredientesValidos = receta.ingredientes.filter(
      (ing) => !/\(opcional\)/i.test(ing) && !/opcional:/i.test(ing)
    );

    const textoReceta = normalizar(
      (receta.titulo || '') +
        ' ' +
        ingredientesValidos.join(' ') +
        ' ' +
        (receta.tags || []).join(' ')
    );

    for (let i = 0; i < lista.length; i++) {
      const filtro = lista[i];
      if (filtro === 'alto_proteina') continue;
      if (tieneTagPositiva(receta, filtro)) continue;
      const regex = DICCIONARIO_RESTRICCIONES[filtro];
      if (regex && regex.test(textoReceta)) return false;
    }

    if (lista.includes('alto_proteina') && !PROTEINAS.test(textoReceta)) return false;
    return true;
  });
}