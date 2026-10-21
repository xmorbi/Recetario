/* =================================================================
   RECETAS.JS — Los datos de tu recetario
   =================================================================

   👉 ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR.

   CÓMO AGREGAR UNA RECETA NUEVA:
   1. Copia un bloque { ... } completo (desde { hasta },)
   2. Pégalo al final, antes del ];
   3. Cambia los textos que quieras.

   CÓMO AGREGAR UNA FOTO:
   1. Guarda la imagen dentro de la carpeta "img/"
      por ejemplo: img/mi-empanada.jpg
   2. En la receta, cambia  imagen: '',  por  imagen: 'img/mi-empanada.jpg',
   3. Recarga la página.

   SI NO HAY FOTO: deja  imagen: ''  y aparecerá sin imagen (sin error).

   REGLAS BÁSICAS:
   - Cada receta va entre { } y separada por coma.
   - Los textos van entre comillas simples: 'así'.
   - Los ingredientes y pasos son listas: 'uno', 'otro', 'otro'
   - Si un texto tiene comillas simples dentro, escríbelas como \'
   ================================================================= */

const RECETAS = [

  /* ============ 1. EMPANADAS DE PINO ============ */
  {
    titulo: 'Empanadas de pino',
    categoria: 'principales',
    imagen: '',
    tiempo: '90 min + reposo',
    porciones: '12 unidades',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 120 g de manteca derretida',
      'Masa: 1 huevo',
      'Masa: 1 cucharadita de sal',
      'Masa: 200 ml de agua tibia (aprox.)',
      'Pino: 500 g de carne de vacuno picada gruesa',
      'Pino: 2 cebollas grandes en cubos finos',
      'Pino: 1 cucharadita de comino',
      'Pino: 1 cucharadita de orégano',
      'Pino: 2 cucharaditas de ají de color',
      'Pino: Sal y pimienta',
      'Pino: 12 aceitunas, 2 huevos duros, 50 g de pasas'
    ],
    pasos: [
      'Sofríe la cebolla en aceite a fuego medio hasta que esté transparente, unos 10 minutos.',
      'Agrega la carne, el comino, el orégano y el ají de color. Cocina 10 minutos más y condimenta.',
      'Deja enfriar el pino por completo.',
      'Mezcla la harina con la sal, añade la manteca, el huevo y el agua tibia. Amasa hasta lograr una masa lisa.',
      'Reposa la masa 30 minutos. Divídela en 12 bollos y estira cada uno en un disco de unos 15 cm.',
      'Rellena con dos cucharadas de pino, una aceituna, unas pasas y un trozo de huevo duro.',
      'Humedece el borde, cierra con un repulgue y pincha la masa con un tenedor.',
      'Pinta con huevo batido y hornea a 200 °C por 25 a 30 minutos.'
    ],
    dato: 'El repulgue no es decorativo, impide que el jugo del pino se escape en el horno.'
  },

  /* ============ 2. PASTEL DE CHOCLO ============ */
  {
    titulo: 'Pastel de choclo',
    categoria: 'principales',
    imagen: '',
    tiempo: '75 min',
    porciones: '6 personas',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      '6 choclos grandes rallados (o 1 kg de choclo congelado)',
      '1 taza de leche',
      '1 cucharada de mantequilla',
      'Albahaca fresca picada',
      '500 g de carne picada',
      '2 cebollas picadas finas',
      'Comino, ají de color, sal y pimienta',
      '3 huevos duros, 12 aceitunas, 50 g de pasas',
      '1 cucharada de azúcar para gratinar'
    ],
    pasos: [
      'Prepara el pino como para las empanadas: sofríe la cebolla, agrega la carne y condimenta.',
      'Cocina el choclo rallado con la leche y la mantequilla a fuego bajo por 15 minutos hasta que espese.',
      'Agrega la albahaca picada y sal a la pasta de choclo.',
      'En una fuente de greda, extiende el pino. Reparte el huevo duro, las aceitunas y las pasas.',
      'Cubre con la pasta de choclo y espolvorea azúcar por encima.',
      'Hornea a 200 °C por 25 a 30 minutos hasta que la superficie esté dorada.'
    ],
    dato: 'El azúcar forma esa costra dorada que contrasta con el relleno salado.'
  },

  /* ============ 3. CAZUELA DE VACUNO ============ */
  {
    titulo: 'Cazuela de vacuno',
    categoria: 'principales',
    imagen: '',
    tiempo: '70 min',
    porciones: '4 a 6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '1 kg de carne de vacuno con hueso (osobuco o costilla)',
      '2 papas medianas',
      '1/2 zapallo en trozos',
      '1 zanahoria en rodajas',
      '1 choclo cortado en trozos',
      '1 cebolla y 2 dientes de ajo',
      '1/2 taza de arroz',
      'Orégano, sal y pimienta'
    ],
    pasos: [
      'Pon la carne en una olla grande con agua fría, la cebolla y el ajo. Lleva a hervor y retira la espuma.',
      'Cocina a fuego medio por 40 minutos.',
      'Agrega la zanahoria y el zapallo. Cocina 10 minutos.',
      'Incorpora las papas, el choclo y el arroz. Cocina 20 minutos más.',
      'Condimenta con orégano, sal y pimienta. Sirve caliente con el caldo abundante.'
    ],
    dato: 'Cada casa tiene su orden. Algunos agregan el arroz al final para que el caldo quede más limpio.'
  },

  /* ============ 4. CHARQUICÁN ============ */
  {
    titulo: 'Charquicán',
    categoria: 'principales',
    imagen: '',
    tiempo: '40 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de carne picada (o charqui remojado y desmenuzado)',
      '3 papas en cubos',
      '1/2 zapallo en cubos',
      '1 cebolla picada',
      '1 choclo desgranado o 1 taza de arvejas',
      'Comino, ají de color, orégano y sal',
      'Huevos para freír al servir'
    ],
    pasos: [
      'Hierve papas y zapallo en agua con sal hasta que estén blandos. Reserva un poco del agua.',
      'Sofríe la cebolla en otra olla. Agrega la carne y condimenta.',
      'Incorpora el choclo o las arvejas y cocina 5 minutos.',
      'Agrega las papas y el zapallo escurridos. Majan la mezcla con un tenedor.',
      'Sirve con un huevo frito encima.'
    ],
    dato: 'El nombre viene del quechua charquicán, por el charqui, carne seca y salada.'
  },

  /* ============ 5. POROTOS GRANADOS ============ */
  {
    titulo: 'Porotos granados',
    categoria: 'principales',
    imagen: '',
    tiempo: '50 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de porotos granados frescos (o 300 g secos, remojados)',
      '1/2 zapallo en cubos',
      '2 choclos desgranados',
      '1 cebolla picada',
      '1 cucharadita de ají de color',
      'Comino y albahaca fresca',
      'Aceite, sal y pimienta'
    ],
    pasos: [
      'Sofríe la cebolla en aceite. Agrega el ají de color y el comino.',
      'Incorpora los porotos, el zapallo y agua suficiente para cubrirlos.',
      'Cocina 30 a 40 minutos hasta que los porotos estén tiernos y el zapallo se deshaga.',
      'Agrega el choclo y la albahaca. Cocina 10 minutos más.',
      'Condimenta y sirve con un chorrito de aceite crudo.'
    ],
    dato: 'Es el plato de verano por excelencia. Con choclo tierno el sabor cambia por completo.'
  },

  /* ============ 6. HUMITAS ============ */
  {
    titulo: 'Humitas',
    categoria: 'panes',
    imagen: '',
    tiempo: '80 min',
    porciones: '8 unidades',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '6 choclos tiernos rallados',
      '1 cebolla picada muy fina',
      '100 g de manteca',
      '1 cucharadita de ají de color',
      'Albahaca fresca y sal',
      'Hojas de choclo para envolver'
    ],
    pasos: [
      'Sofríe la cebolla en la manteca. Agrega el ají de color y revuelve.',
      'Mezcla el choclo rallado con el sofrito, la albahaca y sal.',
      'Cocina a fuego bajo 10 minutos, revolviendo. Deja enfriar.',
      'Blanquea las hojas de choclo en agua caliente.',
      'Pon dos cucharadas de mezcla en cada hoja, envuelve y amarra.',
      'Cocina en agua con sal hirviendo 30 a 40 minutos, o al horno a 180 °C por 40 minutos.'
    ],
    dato: 'Si el choclo está muy seco, agrega un poco de leche a la mezcla.'
  },

  /* ============ 7. SOPAIPILLAS ============ */
  {
    titulo: 'Sopaipillas',
    categoria: 'panes',
    imagen: '',
    tiempo: '45 min',
    porciones: '20 unidades',
    dificultad: 'fácil',
    tecnica: 'Fritura',
    ingredientes: [
      '500 g de zapallo cocido y molido',
      '500 g de harina',
      '100 g de manteca derretida',
      '1 cucharadita de sal',
      '1 cucharadita de polvos de hornear',
      'Aceite para freír',
      'Opcional: chancaca, canela y cáscara de naranja'
    ],
    pasos: [
      'Mezcla el zapallo molido con la harina, la sal y los polvos de hornear.',
      'Agrega la manteca derretida y amasa hasta que la masa no se pegue en las manos.',
      'Reposa 20 minutos tapada con un paño.',
      'Estira a 5 mm de grosor y corta discos de unos 8 cm.',
      'Pincha cada disco con un tenedor.',
      'Fríe en aceite caliente hasta dorar. Escurre sobre papel absorbente.'
    ],
    dato: 'Para sopaipillas pasadas, hierve chancaca con agua, canela y cáscara de naranja y baña las recién fritas.'
  },

  /* ============ 8. PAN AMASADO ============ */
  {
    titulo: 'Pan amasado',
    categoria: 'panes',
    imagen: '',
    tiempo: '60 min',
    porciones: '12 panes',
    dificultad: 'fácil',
    tecnica: 'Horno',
    ingredientes: [
      '1 kg de harina',
      '200 g de manteca',
      '2 cucharaditas de sal',
      '2 cucharaditas de polvos de hornear',
      '500 ml de agua tibia o leche'
    ],
    pasos: [
      'Mezcla la harina con la sal y los polvos de hornear.',
      'Agrega la manteca y trabaja con las manos hasta que quede como arena gruesa.',
      'Añade el agua tibia de a poco y amasa 10 minutos.',
      'Forma 12 bollos, aplánalos y ponlos en una bandeja engrasada.',
      'Pincha con un tenedor y deja reposar 20 minutos.',
      'Hornea a 200 °C por 25 a 30 minutos.'
    ],
    dato: 'El secreto está en amasar con paciencia. Poco amasado da pan duro.'
  },

  /* ============ 9. LECHE ASADA ============ */
  {
    titulo: 'Leche asada',
    categoria: 'dulces',
    imagen: '',
    tiempo: '70 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Horno',
    ingredientes: [
      '1 litro de leche',
      '6 huevos',
      '150 g de azúcar',
      '1 cucharadita de vainilla',
      '100 g de azúcar para el caramelo'
    ],
    pasos: [
      'Derrite el azúcar en una sartén hasta que tome color dorado. Vierte en el fondo del molde.',
      'Bate los huevos con el azúcar hasta que estén cremosos.',
      'Agrega la leche tibia y la vainilla, mezclando suavemente.',
      'Vierte en el molde caramelizado y cúbrelo con papel aluminio.',
      'Hornea al baño María a 180 °C por 50 a 60 minutos.',
      'Deja enfriar y refrigera al menos 2 horas antes de desmoldar.'
    ],
    dato: 'El baño María es obligatorio. Sin él, la leche se corta.'
  },

  /* ============ 10. MOTE CON HUESILLO ============ */
  {
    titulo: 'Mote con huesillo',
    categoria: 'dulces',
    imagen: '',
    tiempo: '40 min + frío',
    porciones: '6 vasos',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '200 g de mote de trigo cocido',
      '200 g de huesillos secos, remojados desde la noche anterior',
      '1 taza de azúcar o chancaca',
      '1 rama de canela',
      'Cáscara de naranja'
    ],
    pasos: [
      'Remoja los huesillos la noche anterior. Reserva el agua del remojo.',
      'Cocina los huesillos con el agua de remojo, el azúcar, la canela y la cáscara de naranja.',
      'Cocina a fuego medio 30 minutos hasta que los huesillos estén blandos y el jugo tenga consistencia de almíbar.',
      'Deja enfriar y refrigera varias horas.',
      'Sirve en vaso alto: mote escurrido, huesillos y jugo bien frío.'
    ],
    dato: 'Se toma con cuchara. El jugo se bebe y el mote se come al final.'
  },

  /* ============ 11. CAZUELA DE AVE ============ */
  {
    titulo: 'Cazuela de ave',
    categoria: 'sopas',
    imagen: '',
    tiempo: '2 h',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '6 trutros de pollo sin piel',
      '1 zanahoria en rodajas + 1 rallada',
      '½ pimentón rojo en tiras',
      '6 papas peladas',
      '6 trozos de zapallo',
      '6 trozos de choclo',
      '1 taza de porotos verdes picados',
      '½ taza de arroz',
      'Sal, pimienta, orégano',
      '1 L de agua caliente'
    ],
    pasos: [
      'Dora el pollo en aceite 5 min por lado en una olla grande.',
      'Agrega la zanahoria, el pimentón, sal, pimienta y orégano. Saltea 5 min.',
      'Vierte el agua caliente y cocina a fuego lento.',
      'A los 30 min, añade las papas, el zapallo y el choclo.',
      'Encima pon los porotos verdes y el arroz sin revolver. Cocina hasta que todo esté tierno.'
    ],
    dato: 'El secreto está en no revolver después de agregar el arroz.'
  },

  /* ============ 12. CAZUELA DE CERDO ============ */
  {
    titulo: 'Cazuela de cerdo',
    categoria: 'sopas',
    imagen: '',
    tiempo: '1 h 30 min',
    porciones: '4 a 6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de pulpa de cerdo en cubos',
      '200-250 g de costillar ahumado',
      '2 puerros picados gruesos',
      '2 zanahorias en trozos',
      '4 papas medianas',
      '¼ de repollo crespo o 250 g de repollitos de Bruselas',
      '1 cda de aceite, 1 diente de ajo, 1 cdta de páprika',
      'Ramo de olores (perejil, orégano, laurel, apio)',
      'Sal y pimienta'
    ],
    pasos: [
      'Calienta el aceite y sofríe el ajo 30 segundos. Agrega la páprika.',
      'Incorpora los puerros, zanahorias y carnes. Añade 1 cda de agua y tapa.',
      'Vierte 2 litros de agua fría, sal y el ramo de olores. Cocina tapado 1 hora.',
      'Agrega el repollo y las papas. Cocina 30 min más.',
      'Retira el ramo de olores, corrige la sal y sirve con perejil fresco.'
    ],
    dato: 'El costillar ahumado le da un sabor profundo que no se logra solo con la pulpa.'
  },

  /* ============ 13. PANTRUCAS ============ */
  {
    titulo: 'Pantrucas',
    categoria: 'sopas',
    imagen: '',
    tiempo: '50 min',
    porciones: '4 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      'Caldo: 400 g de carne de vacuno (posta o tapapecho)',
      'Caldo: 1 cebolla, 1 zanahoria, ½ pimentón rojo, 1 ajo',
      'Caldo: 3 papas en cubos',
      'Caldo: 1 cdta de ají de color, orégano y ½ cdta de comino',
      'Caldo: 1,5 L de agua hirviendo',
      'Caldo: 2 huevos (opcional) y cilantro fresco',
      'Masa: 2 tazas de harina sin polvos de hornear',
      'Masa: 1 huevo',
      'Masa: ¾ taza de agua tibia',
      'Masa: 1 cdta de aceite o manteca, pizca de sal'
    ],
    pasos: [
      'Sofríe cebolla, ajo, pimentón y zanahoria 5 min. Condimenta.',
      'Agrega la carne, cocina hasta que cambie de color. Añade las papas y el agua hirviendo. Tapa 15 min.',
      'Mezcla la harina, huevo, aceite y sal. Agrega el agua tibia hasta formar masa suave.',
      'Estira la masa fina (2 mm) y córtala en cuadrados.',
      'Echa las pantrucas en el caldo hirviendo. Cocina 5-7 min.',
      'Vierte los huevos batidos en hilo y sirve con cilantro picado.'
    ],
    dato: 'La masa no lleva polvos de hornear; debe quedar firme.'
  },

  /* ============ 14. TOMATICÁN ============ */
  {
    titulo: 'Tomaticán',
    categoria: 'principales',
    imagen: '',
    tiempo: '30 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '1 kg de tomates maduros',
      '1 taza de choclo picado',
      '1 cebolla en pluma',
      '250 g de lomo, asiento o posta en tiras',
      '2 dientes de ajo, perejil, ½ pimentón',
      'Sal, pimienta, orégano, ají de color y aceite'
    ],
    pasos: [
      'Corta la carne en tiritas y los tomates en trozos.',
      'Sofríe la cebolla, el ajo, el perejil y el pimentón con aliños.',
      'Agrega la carne y fríe unos minutos.',
      'Incorpora el choclo y los tomates. Mezcla bien.',
      'Cuando hierva, tapa y cocina a fuego lento 15 min.',
      'Sirve con arroz o papas cocidas.'
    ],
    dato: 'Mientras más maduros los tomates, más dulce queda el plato.'
  },

  /* ============ 15. POROTOS CON MAZAMORRA ============ */
  {
    titulo: 'Porotos con mazamorra',
    categoria: 'principales',
    imagen: '',
    tiempo: '50 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '½ kg de porotos granados',
      '150 g de zapallo camote',
      '2 choclos pasteleros',
      '½ cebolla grande, 1 diente de ajo, pimentón (opcional)',
      '6 hojas de albahaca',
      'Sal, orégano, ají de color, pimienta y aceite'
    ],
    pasos: [
      'Cuece los porotos desde agua fría con sal, pimienta y ají de color por 30 min.',
      'Agrega el zapallo y cocina hasta que esté blando.',
      'Licúa el choclo desgranado con las hojas de albahaca.',
      'Haz un sofrito de cebolla, ajo y pimentón.',
      'Aplasta el zapallo. Agrega el sofrito y la pasta de choclo.',
      'Hierve 10 min más, rectifica sabores y deja reposar 10 min.'
    ],
    dato: 'La mazamorra es el choclo licuado con albahaca, le da cuerpo al caldo.'
  },

  /* ============ 16. AJIACO CHILENO ============ */
  {
    titulo: 'Ajiaco chileno',
    categoria: 'sopas',
    imagen: '',
    tiempo: '40 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de carne asada (vacuno, cerdo o pollo)',
      '4 papas medianas en cubos',
      '1 cebolla grande, 2 dientes de ajo, 1 zanahoria',
      '1 pimentón, orégano, páprika, comino',
      '1 L de caldo de carne',
      'Sal, pimienta, ají seco (opcional)'
    ],
    pasos: [
      'Sofríe la cebolla, zanahoria, pimentón y ajo en aceite.',
      'Agrega la carne asada en trozos y las papas.',
      'Condimenta con orégano, páprika, comino, sal y pimienta.',
      'Cubre con el caldo y cocina hasta que las papas estén tiernas.',
      'Rectifica la sal y sirve caliente.'
    ],
    dato: 'Es la receta perfecta para reutilizar la carne del asado del día anterior.'
  },

  /* ============ 17. CALDILLO DE CONGRIO ============ */
  {
    titulo: 'Caldillo de congrio',
    categoria: 'sopas',
    imagen: '',
    tiempo: '50 min',
    porciones: '4 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '1 kg de congrio en medallones',
      'Cabeza y espinas del congrio',
      '4-5 papas en gajos',
      '1 cebolla grande en pluma',
      '1 zanahoria, 1 pimentón rojo, 2 tomates, 3 ajos',
      '200 ml de vino blanco',
      '100 ml de crema (opcional)',
      'Ají de color, orégano, comino, sal, pimienta y cilantro'
    ],
    pasos: [
      'Hierve la cabeza y espinas con verduras y 2 L de agua por 20-30 min. Cuela.',
      'Haz un sofrito con cebolla, pimentón, zanahoria y ajo. Agrega tomate y condimentos.',
      'Vierte el vino y deja evaporar. Añade las papas y cúbrelas con el caldo.',
      'Cocina 15 min hasta que las papas ablanden.',
      'Pon los medallones encima y cocina tapado 8-10 min a fuego mínimo.',
      'Opcional: añade crema antes de apagar. Sirve con cilantro.'
    ],
    dato: 'El caldo de la cabeza es lo que le da ese sabor profundo; no lo omitas.'
  },

  /* ============ 18. TOMÁTICA ============ */
  {
    titulo: 'Tomática',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '15 min',
    porciones: '4 personas',
    dificultad: 'muy fácil',
    tecnica: 'Fresca',
    ingredientes: [
      '4 tomates maduros',
      '2 dientes de ajo',
      '1 cucharada de aceite de oliva',
      'Orégano fresco o seco',
      'Sal y pimienta',
      'Unas gotas de vinagre (opcional)'
    ],
    pasos: [
      'Pela los tomates y córtalos en cubos.',
      'Pica los ajos muy finos.',
      'Mezcla los tomates con el ajo, el aceite, el orégano, sal y pimienta.',
      'Si queda muy dulce, añade unas gotas de vinagre.',
      'Deja reposar 10 minutos antes de servir para que se mezclen los sabores.'
    ],
    dato: 'Sirve como acompañamiento de carnes asadas, arroz o puré.'
  },

  /* ============ 19. ENSALADA A LA CHILENA ============ */
  {
    titulo: 'Ensalada a la chilena',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '15 min',
    porciones: '5 personas',
    dificultad: 'muy fácil',
    tecnica: 'Fresca',
    ingredientes: [
      '4 tomates maduros',
      '½ cebolla blanca',
      'Cilantro fresco picado',
      'Sal y aceite a gusto'
    ],
    pasos: [
      'Pela y corta los tomates en cubos.',
      'Corta la cebolla en pluma fina y pásala por agua fría para suavizarla.',
      'Mezcla tomates y cebolla. Condimenta con sal y aceite.',
      'Decora con cilantro picado.'
    ],
    dato: 'El agua fría le quita el picor a la cebolla sin perder su textura.'
  },

  /* ============ 20. ENSALADA RUSA CHILENA ============ */
  {
    titulo: 'Ensalada rusa chilena',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '30 min + frío',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Fresca',
    ingredientes: [
      '5 papas medianas',
      '2 zanahorias medianas',
      '½ taza de arvejas cocidas',
      '½ taza de mayonesa',
      '½ taza de yogur griego (opcional)',
      'Cilantro, sal y pimienta',
      '½ cebolla pequeña (opcional)'
    ],
    pasos: [
      'Cuece las papas y zanahorias en agua con sal hasta que estén tiernas. Escurre y enfría.',
      'Pélalas y córtalas en cubos pequeños.',
      'Mezcla con las arvejas y la cebolla si la usas.',
      'Incorpora la mayonesa y el yogur. Salpimenta y añade cilantro.',
      'Refrigera al menos 30 min antes de servir.'
    ],
    dato: 'El yogur griego aligera la mayonesa y le da un toque más fresco.'
  },

  /* ============ 21. CHANCHO EN PIEDRA ============ */
  {
    titulo: 'Chancho en piedra',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '20 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Salsa',
    ingredientes: [
      '1 kg de tomates bien maduros',
      '3 dientes grandes de ajo',
      '2 atados de cilantro y 1 de perejil',
      '3 ajíes verdes',
      'Orégano fresco o seco',
      '1/3 taza de aceite, 10 granos de pimienta, 1 cdta de sal'
    ],
    pasos: [
      'En un mortero de piedra, muele la sal, los ajos y la pimienta hasta formar una pasta.',
      'Pica los ajíes, elimina las pepas y muélelos en el mortero.',
      'Agrega el orégano, perejil y cilantro picados.',
      'Incorpora dos tomates para licuar la pasta y vacía en una fuente.',
      'Añade el resto de los tomates pelados y trozados. Mezcla con el aceite.'
    ],
    dato: 'Si el tomate no tiene suficiente acidez, unas gotas de vinagre tinto equilibran el sabor.'
  },

  /* ============ 22. SOPAIPILLAS PASADAS ============ */
  {
    titulo: 'Sopaipillas pasadas',
    categoria: 'panes',
    imagen: '',
    tiempo: '45 min',
    porciones: '20 unidades',
    dificultad: 'fácil',
    tecnica: 'Fritura',
    ingredientes: [
      'Masa: 500 g de harina',
      'Masa: 300 g de zapallo cocido y molido',
      'Masa: 100 g de manteca derretida',
      'Masa: 1 cdta de sal y 1 cdta de polvos de hornear',
      'Masa: Aceite para freír',
      'Chancaca: 250 g de chancaca',
      'Chancaca: ½ taza de agua',
      'Chancaca: 1 rama de canela',
      'Chancaca: Cáscara de 1 naranja',
      'Chancaca: 2 clavos de olor'
    ],
    pasos: [
      'Mezcla el zapallo, la harina, la sal y los polvos de hornear.',
      'Agrega la manteca y amasa hasta obtener una masa suave.',
      'Reposa 20 min, estira a 5 mm y corta discos de 8 cm.',
      'Pincha con un tenedor y fríe en aceite caliente hasta dorar.',
      'Aparte, hierve la chancaca con el agua, la canela, la cáscara de naranja y los clavos hasta formar un almíbar.',
      'Baña las sopaipillas recién fritas con el almíbar caliente y sirve.'
    ],
    dato: 'Se sirven tibias, cuando el almíbar todavía está brillante y pegajoso.'
  },

  /* ============ 23. EMPANADAS DE QUESO ============ */
  {
    titulo: 'Empanadas de queso',
    categoria: 'panes',
    imagen: '',
    tiempo: '60 min',
    porciones: '12 unidades',
    dificultad: 'fácil',
    tecnica: 'Horno o fritura',
    ingredientes: [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 120 g de manteca derretida',
      'Masa: 1 huevo',
      'Masa: 1 cdta de sal',
      'Masa: 200 ml de agua tibia (aprox.)',
      'Relleno: 500 g de queso chanco o mantecoso rallado',
      'Relleno: 1 cdta de orégano (opcional)',
      'Relleno: 1 huevo batido para pintar'
    ],
    pasos: [
      'Mezcla la harina con la sal, agrega la manteca, el huevo y el agua tibia. Amasa hasta obtener una masa lisa.',
      'Reposa 30 minutos tapada con un paño.',
      'Divide en 12 bollos y estira cada uno en discos de unos 15 cm.',
      'Rellena con abundante queso rallado (y orégano si usas).',
      'Humedece el borde, cierra con un repulgue y pincha la superficie con un tenedor.',
      'Pinta con huevo batido y hornea a 200 °C por 20 a 25 minutos, o fríelas hasta dorar.'
    ],
    dato: 'El queso mantecoso suelta grasa al hornearse; pinchar la masa evita que se abra.'
  },

  /* ============ 24. ARROZ CON LECHE ============ */
  {
    titulo: 'Arroz con leche',
    categoria: 'dulces',
    imagen: '',
    tiempo: '50 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '1 L de leche entera',
      '100 g de arroz de grano corto',
      '150 g de azúcar',
      '1 rama de canela',
      'Cáscara de 1 limón (sin la parte blanca)',
      'Canela molida para servir'
    ],
    pasos: [
      'Lava el arroz y cuécelo en agua hirviendo 10 minutos. Escurre.',
      'Calienta la leche con la canela en rama y la cáscara de limón hasta que hierva.',
      'Agrega el arroz escurrido y cocina a fuego bajo 30 a 40 minutos, revolviendo seguido.',
      'Añade el azúcar y cocina 5 minutos más, hasta que espese.',
      'Retira la canela y el limón, sirve tibio o frío con canela molida encima.'
    ],
    dato: 'Si te gusta más cremoso, agrega 100 ml más de leche al final y cocina 5 minutos extra.'
  },

  /* ============ 25. SOPONES O MACHOS AHOGADOS ============ */
  {
    titulo: 'Sopones o machos ahogados',
    categoria: 'sopas',
    imagen: '',
    tiempo: '30 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '1½ L de caldo de vacuno',
      '125 g de harina sin polvos de hornear',
      '1 huevo',
      '1 cda de cebolla picada fina',
      '1 cda de perejil picado',
      'Aliño completo, sal y pimienta'
    ],
    pasos: [
      'Bate la clara a punto de nieve. Agrega la yema y mezcla.',
      'Incorpora la harina, la cebolla, el perejil y los aliños. Forma una masa espesa.',
      'Con una cuchara, deja caer porciones de masa en el caldo hirviendo.',
      'Cocina 10-15 min hasta que los sopones suban y estén cocidos.',
      'Sirve en platos hondos con el caldo bien caliente.'
    ],
    dato: 'También se conocen como machos ahogados y son el acompañamiento tradicional de la cazuela.'
  },

  /* ============ 26. POLLO ARVEJADO ============ */
  {
    titulo: 'Pollo arvejado',
    categoria: 'principales',
    imagen: '',
    tiempo: '60 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '1,3 kg de trutros de pollo',
      '300 g de arvejas congeladas',
      '2 zanahorias, 1 cebolla, 1 pimentón rojo',
      '3 dientes de ajo',
      '150 ml de vino blanco',
      '200 ml de caldo de pollo',
      'Orégano, comino, laurel, sal, pimienta y perejil'
    ],
    pasos: [
      'Sella el pollo condimentado. Retira y reserva.',
      'Sofríe cebolla, zanahoria, pimentón y ajo en la misma olla.',
      'Devuelve el pollo, agrega el vino, el caldo, orégano y laurel. Tapa y cocina 25 min.',
      'Añade las arvejas congeladas y cocina 5 min más.',
      'Sirve con perejil fresco y acompaña con arroz o papas.'
    ],
    dato: 'Las arvejas se agregan al final para que conserven su color verde vivo.'
  },

  /* ============ 27. POLLO AL JUGO ============ */
  {
    titulo: 'Pollo al jugo',
    categoria: 'principales',
    imagen: '',
    tiempo: '45 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '4 trutros de pollo sin piel',
      '1 cebolla en pluma',
      '1 zanahoria en rodajas',
      '1 ajo picado',
      'Aceite, sal, pimienta, laurel y orégano',
      '1 L de agua hirviendo'
    ],
    pasos: [
      'Dora el pollo en aceite hasta sellar. Retira y reserva.',
      'Sofríe la cebolla 5 min hasta que esté transparente.',
      'Agrega el ajo, la zanahoria, el laurel, el orégano y el pollo.',
      'Cubre con el agua hirviendo y cocina 30 min.',
      'Sirve con puré, arroz o papas cocidas.'
    ],
    dato: 'El jugo que queda en la olla es la salsa; viértelo sobre el puré.'
  },

  /* ============ 28. POLLO ASADO ============ */
  {
    titulo: 'Pollo asado',
    categoria: 'principales',
    imagen: '',
    tiempo: '1 h 30 min',
    porciones: '4 a 6 personas',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      '1 pollo entero',
      '4 cdas de mostaza',
      '2 tabletas de caldo de pollo o verduras',
      '1 taza de vinagre',
      '1 taza de agua',
      '4 cdas de aceite, sal y pimienta'
    ],
    pasos: [
      'Mezcla la mostaza, el caldo disuelto, el vinagre, el agua y el aceite.',
      'Embadurna el pollo por dentro y por fuera. Marina al menos 3 horas (mejor toda la noche).',
      'Precalienta el horno a 200 °C.',
      'Hornea 1 hora a 1 hora 15 min, bañándolo con su jugo cada 20 min.',
      'Deja reposar 10 min antes de cortar.'
    ],
    dato: 'El vinagre y la mostaza ayudan a que la piel quede dorada y crujiente.'
  },

  /* ============ 29. CARNE AL JUGO CON PURÉ ============ */
  {
    titulo: 'Carne al jugo con puré',
    categoria: 'principales',
    imagen: '',
    tiempo: '1 h 30 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      'Carne: 1 kg de tapapecho o posta en trozos',
      'Carne: 1 cebolla en pluma, 2 dientes de ajo',
      'Carne: 1 zanahoria, 1 pimentón',
      'Carne: Sal, pimienta, orégano, comino y laurel',
      'Carne: Agua o caldo para cubrir',
      'Puré: 6 papas medianas',
      'Puré: 3 cdas de mantequilla',
      'Puré: ½ taza de leche',
      'Puré: Sal'
    ],
    pasos: [
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón.',
      'Agrega la carne y dórala. Condimenta.',
      'Cubre con agua o caldo y cocina a fuego lento hasta que la carne esté blanda (1 hora aprox.).',
      'Cuece las papas, mójalas con mantequilla, leche y sal hasta obtener un puré cremoso.',
      'Sirve la carne con su jugo sobre el puré.'
    ],
    dato: 'Si el jugo está muy líquido, déjalo reducir unos minutos.'
  },

  /* ============ 30. PAJARITOS DULCES ============ */
  {
    titulo: 'Pajaritos dulces',
    categoria: 'dulces',
    imagen: '',
    tiempo: '1 h',
    porciones: '12 unidades',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      'Masa: 500 g de harina',
      'Masa: 3 huevos',
      'Masa: 50 g de mantequilla',
      'Masa: 120 g de azúcar',
      'Masa: 15 g de levadura',
      'Masa: Ralladura de limón o naranja',
      'Masa: 100 ml de agua o leche tibia',
      'Merengue: 2 claras de huevo',
      'Merengue: 1 taza de azúcar flor',
      'Merengue: Vainilla y chispitas de colores (opcional)'
    ],
    pasos: [
      'Activa la levadura en el agua tibia con una cucharada de azúcar.',
      'Mezcla la harina con los huevos, mantequilla, azúcar y ralladura. Agrega la levadura y forma una masa suave.',
      'Deja reposar tapada hasta que doble su volumen.',
      'Forma bolitas de unos 70 g, colócalas en una bandeja engrasada y deja levar 30 min más.',
      'Hornea a 180 °C por 25-30 min. Deja enfriar.',
      'Bate las claras a nieve, añade el azúcar flor y la vainilla. Cubre los pancitos con el merengue y decora.'
    ],
    dato: 'El nombre viene de la forma de pajarito que toma el merengue al decorarlos.'
  },

  /* ============ 31. CHILENITOS ============ */
  {
    titulo: 'Chilenitos',
    categoria: 'dulces',
    imagen: '',
    tiempo: '50 min',
    porciones: '20 unidades',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      'Masa: 3 tazas de harina sin polvos de hornear',
      'Masa: 4 yemas de huevo',
      'Masa: 2 cdas de mantequilla derretida',
      'Masa: 2 cdas de vinagre de vino blanco',
      'Masa: ½ taza de agua, pizca de sal',
      'Relleno: 400 g de manjar',
      'Relleno: 2 claras, 1 taza de azúcar granulada, ½ taza de azúcar flor',
      'Relleno: 1 cdta de jugo de limón'
    ],
    pasos: [
      'Mezcla harina y sal. Agrega yemas, mantequilla y vinagre. Añade agua hasta formar una masa suave. Reposa 20 min.',
      'Estira la masa muy fina (2 mm) y corta círculos de 7 cm. Pincha con tenedor.',
      'Hornea a 180 °C por 8-10 min. Enfría.',
      'Prepara un merengue a baño María con las claras, azúcar granulada y limón.',
      'Arma los chilenitos con una capa de manjar entre dos masas y cubre con merengue.',
      'Espolvorea azúcar flor.'
    ],
    dato: 'La masa debe quedar muy delgada; si queda gruesa, pierde su textura crujiente.'
  },

  /* ============ 32. EMPOLVADOS ============ */
  {
    titulo: 'Empolvados',
    categoria: 'dulces',
    imagen: '',
    tiempo: '40 min',
    porciones: '20 unidades',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      '3 huevos a temperatura ambiente',
      'Pizca de sal',
      '120 g de azúcar flor',
      '120 g de harina cernida',
      '½ kg de manjar para rellenar',
      'Azúcar flor para espolvorear'
    ],
    pasos: [
      'Precalienta el horno a 180 °C. Separa claras y yemas.',
      'Bate las claras con la sal y añade el azúcar en partes hasta obtener un merengue firme.',
      'Incorpora las yemas una a una batiendo poco.',
      'Añade la harina con movimientos envolventes.',
      'Forma copos de 5 cm en una bandeja con papel mantequilla.',
      'Hornea 10-12 min. Enfría, rellena con manjar y espolvorea azúcar flor.'
    ],
    dato: 'No batas demasiado después de agregar la harina; perderás el aire y quedarán planos.'
  },

  /* ============ 33. COLEGIAL ============ */
  {
    titulo: 'Colegial (budín de pan)',
    categoria: 'dulces',
    imagen: '',
    tiempo: '1 h 30 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Horno',
    ingredientes: [
      '4 marraquetas o 500 g de pan duro',
      '2 tazas de leche',
      '1 taza de azúcar',
      '3 huevos',
      '1 cdta de esencia de vainilla',
      '1 manzana en láminas finas',
      '½ taza de pasas (opcional)',
      'Mantequilla para engrasar'
    ],
    pasos: [
      'Desmenuza el pan y remójalo en la leche caliente 15-20 min.',
      'Bate los huevos con el azúcar y la vainilla.',
      'Mezcla con el pan remojado, la manzana y las pasas.',
      'Vierte en un molde engrasado y hornea a 180 °C por 45-50 min.',
      'Deja enfriar y espolvorea azúcar flor o leche condensada.'
    ],
    dato: 'Es la receta perfecta para aprovechar el pan de días anteriores.'
  },

  /* ============ 34. EMPANADAS DE PERA ============ */
  {
    titulo: 'Empanadas de pera',
    categoria: 'dulces',
    imagen: '',
    tiempo: '1 h + remojo',
    porciones: '12 unidades',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      'Relleno: 300 g de peras secas, remojadas desde la noche anterior',
      'Relleno: 300 g de azúcar',
      'Relleno: Clavos de olor y canela en palo',
      'Masa: 3 tazas de harina',
      'Masa: 5 yemas de huevo',
      'Masa: 4 cdas de manteca vegetal tibia',
      'Masa: Leche necesaria'
    ],
    pasos: [
      'Cocina las peras molidas con el azúcar, el líquido del remojo, clavos y canela hasta que espese. Enfría.',
      'Forma la masa con harina, yemas, manteca y leche. Amasa hasta que quede elástica.',
      'Estira fina y corta círculos.',
      'Rellena con el dulce de pera y sella los bordes.',
      'Hornea a 180 °C por 15-20 min.'
    ],
    dato: 'Son típicas del centro-sur de Chile y se sirven tibias o frías.'
  },

  /* ============ 35. VALDIVIANO ============ */
  {
    titulo: 'Valdiviano',
    categoria: 'sopas',
    imagen: '',
    tiempo: '40 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '300 g de charqui',
      '4 papas grandes en cubos',
      '2 zanahorias en rodajas',
      '1 cebolla picada, 2 ajos, ½ pimiento rojo',
      '1 tomate picado',
      'Laurel, tomillo, merkén',
      '1 L de agua, 1 caldo en tableta, 2 cdas de aceite'
    ],
    pasos: [
      'Sofríe cebolla, ajo y pimiento hasta dorar.',
      'Agrega el tomate y el charqui desmenuzado. Cocina unos minutos.',
      'Vierte el agua con el caldo, laurel y tomillo. Lleva a ebullición.',
      'Incorpora las papas y zanahorias. Cocina 20-30 min hasta que estén tiernas.',
      'Sirve caliente.'
    ],
    dato: 'El charqui es carne seca y salada; si no lo encuentras, puedes usar carne ahumada.'
  }
,

  /* ============ 36. POROTOS CON RIENDAS ============ */
  {
    titulo: 'Porotos con riendas',
    categoria: 'principales',
    imagen: 'img/porotos-con-riendas.png',
    tiempo: '50 min + remojo',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de porotos secos (pueden ser pinto, blanco o burro)',
      '300 g de zapallo camote en cubos',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 longaniza en rodajas (opcional, pero tradicional)',
      '1/2 paquete de tallarines o espaguetis',
      '1 cucharadita de orégano',
      '1/2 cucharadita de comino',
      '1 cucharadita de ají de color',
      'Sal y pimienta al gusto',
      'Aceite para el sofrito'
    ],
    pasos: [
      'La noche anterior, deja los porotos remojando en abundante agua fría. Al día siguiente, escúrrelos y enjuágalos.',
      'En una olla grande, pon los porotos con agua fresca que los cubra por unos 3 dedos. Agrega el zapallo en cubos y cocina a fuego medio hasta que los porotos estén blandos (unos 30-40 minutos).',
      'Mientras se cocinan los porotos, prepara el sofrito: en una sartén con un poco de aceite, sofríe la cebolla, el ajo y la longaniza hasta que doren. Agrega el orégano, comino y ají de color, y revuelve un minuto más.',
      'Incorpora el sofrito a la olla de porotos y mezcla bien. Ajusta la sal y pimienta.',
      'Agrega los tallarines (puedes partirlos por la mitad para que sean más fáciles de comer) y cocina por 8 a 10 minutos más, hasta que la pasta esté al dente y el caldo haya espesado.',
      'Sirve bien caliente en platos hondos, con un chorrito de aceite crudo por encima si te gusta.'
    ],
    dato: 'El nombre "riendas" nace en el campo chileno: antiguamente se usaban tiras de cuero de cerdo que, al cocinarse, parecían las riendas de los caballos. Con el tiempo, la ciudad las reemplazó por tallarines, pero el nombre se mantuvo.'
  },

/* ============ 37. CARBONADA ============ */
  {
    titulo: 'Carbonada',
    categoria: 'principales',
    imagen: '',
    tiempo: '50 min',
    porciones: '6 personas',
    dificultad: 'fácil',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de posta de vacuno picada en cubos',
      '2 cucharadas de aceite',
      '1 cebolla picada en cubitos',
      '1/4 de pimentón rojo picado',
      '2 papas medianas en cubos',
      '1 zanahoria en rodajas',
      '1 taza de zapallo en cubos',
      '1 choclo desgranado',
      '1/2 taza de arroz',
      '1 litro de agua caliente o caldo de carne',
      'Sal, pimienta, orégano, comino y ají de color'
    ],
    pasos: [
      'Calienta el aceite en una olla grande. Agrega la carne y séllala hasta que dore por todos lados.',
      'Incorpora la cebolla, el pimentón y los condimentos (ají de color, orégano, comino, sal y pimienta). Sofríe por 5 minutos.',
      'Vierte el agua o caldo caliente, tapa y cocina a fuego medio por 20 minutos.',
      'Agrega las papas, la zanahoria, el zapallo y el choclo. Cocina por 15 minutos más.',
      'Añade el arroz y cocina hasta que los granos estén tiernos y las verduras blandas (unos 15 minutos).',
      'Rectifica la sal y sirve caliente en platos hondos.'
    ],
    dato: 'La carbonada es un guiso de invierno por excelencia. Su nombre proviene de "carbón", porque antiguamente se cocinaba en ollas de barro sobre brasas.'
  },

  /* ============ 38. CHORRILLANA ============ */
  {
    titulo: 'Chorrillana',
    categoria: 'principales',
    imagen: '',
    tiempo: '40 min',
    porciones: '3 a 4 personas',
    dificultad: 'fácil',
    tecnica: 'Sartén',
    ingredientes: [
      '800 g de papas cortadas en bastones (para freír)',
      '400 g de posta negra o lomo cortado en tiras finas',
      '2 cebollas cortadas en pluma',
      '2 huevos',
      'Aceite para freír',
      'Sal y pimienta al gusto',
      'Salsa de tomate o ketchup (opcional)'
    ],
    pasos: [
      'FrÍe las papas en abundante aceite caliente hasta que estén doradas y crujientes. Escurre sobre papel absorbente y reserva.',
      'En una sartén grande, sofríe la cebolla en un poco de aceite hasta que esté transparente y ligeramente dorada. Retira y reserva.',
      'En la misma sartén, sube el fuego y saltea la carne en tiras con sal y pimienta hasta que esté cocida y dorada.',
      'Para montar, coloca las papas fritas en la base de una fuente grande o sartén. Encima distribuye la carne y luego la cebolla sofrita.',
      'Fríe los huevos y colócalos encima de la preparación. Sirve inmediatamente para compartir.'
    ],
    dato: 'El nombre "chorrillana" proviene del barrio de Chorrillos en Valparaíso, donde se dice que nació este plato en la década de 1970.'
  },

  /* ============ 39. BISTEC A LO POBRE ============ */
  {
    titulo: 'Bistec a lo pobre',
    categoria: 'principales',
    imagen: '',
    tiempo: '40 min',
    porciones: '2 personas',
    dificultad: 'fácil',
    tecnica: 'Sartén',
    ingredientes: [
      '2 bistecs de lomo liso o vetado (aprox. 200 g cada uno)',
      '3 papas medianas cortadas en bastones',
      '1 cebolla grande cortada en pluma',
      '2 huevos',
      'Aceite para freír',
      '1 diente de ajo picado',
      'Sal y pimienta al gusto'
    ],
    pasos: [
      'Sazona los bistecs con sal, pimienta y ajo. Déjalos reposar mientras preparas el resto.',
      'FrÍe las papas en bastones en abundante aceite caliente hasta que estén doradas. Escurre y reserva.',
      'En una sartén, sofríe la cebolla en un poco de aceite hasta que esté caramelizada. Retira y reserva.',
      'En la misma sartén, sube el fuego y cocina los bistecs a la plancha o sartén por 2-3 minutos por lado, o hasta el punto deseado.',
      'Fríe los huevos (uno por persona).',
      'Para servir, coloca el bistec en el plato, cúbrelo con la cebolla y acompaña con las papas fritas y el huevo frito encima.'
    ],
    dato: 'El "a lo pobre" no se refiere a la falta de dinero, sino a la abundancia de acompañamientos (papas, cebolla y huevo) que hacen que el plato parezca "de pobres" por lo sencillo de sus ingredientes.'
  },

  /* ============ 40. SALCHIPAPAS ============ */
  {
    titulo: 'Salchipapas',
    categoria: 'principales',
    imagen: '',
    tiempo: '25 min',
    porciones: '4 personas',
    dificultad: 'muy fácil',
    tecnica: 'Fritura',
    ingredientes: [
      '4 papas grandes cortadas en bastones',
      '6 salchichas de buena calidad',
      'Aceite para freír',
      'Ketchup, mayonesa o mostaza al gusto'
    ],
    pasos: [
      'Pela y corta las papas en bastones. Lava bien para quitar el almidón y sécalas.',
      'FrÍe las papas en abundante aceite caliente hasta que estén doradas y crujientes. Escurre y sala al gusto.',
      'Corta las salchichas en rodajas o en trozos y fríelas en una sartén hasta que estén doradas.',
      'Mezcla las papas fritas con las salchichas o sirve las salchichas encima de las papas.',
      'Acompaña con tus salsas favoritas.'
    ],
    dato: 'Es el plato favorito de los niños y también un clásico de las picadas chilenas. Puedes agregar queso derretido encima para una versión aún más contundente.'
  },

  /* ============ 41. CARNE MECHADA ============ */
  {
    titulo: 'Carne mechada',
    categoria: 'principales',
    imagen: '',
    tiempo: '2 h 30 min',
    porciones: '4 a 6 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '1 kg de posta negra o pollo ganso (corte para mechar)',
      '1 zanahoria grande en bastones',
      '2 cebollas cortadas en pluma',
      '2 dientes de ajo',
      '1 pimentón rojo en tiras',
      '1 taza de vino tinto (opcional)',
      '1 taza de caldo de carne',
      'Aceite, sal, pimienta, orégano y comino'
    ],
    pasos: [
      'Sazona la carne con sal, pimienta y comino. En una olla grande, sella la carne en aceite caliente hasta que dore por todos lados.',
      'Agrega la cebolla, el ajo y el pimentón. Sofríe por unos minutos.',
      'Incorpora el vino tinto (si usas) y deja evaporar un poco. Luego agrega el caldo de carne y los bastones de zanahoria.',
      'Tapa la olla y cocina a fuego lento por 2 horas, hasta que la carne se deshaga fácilmente con un tenedor.',
      'Retira la carne, desmenúzala con dos tenedores y devuélvela a la olla para que se mezcle con la salsa.',
      'Sirve con puré, arroz o en un sándwich.'
    ],
    dato: 'La carne mechada es la base del clásico sándwich chileno "barros luco" (con queso) o "barros jarpa". Aprovecha la salsa para humedecer el pan.'
  },

  /* ============ 42. MACHAS A LA PARMESANA ============ */
  {
    titulo: 'Machas a la parmesana',
    categoria: 'principales',
    imagen: '',
    tiempo: '20 min',
    porciones: '4 personas (como entrada)',
    dificultad: 'fácil',
    tecnica: 'Horno',
    ingredientes: [
      '20 machas frescas con sus conchas (o 1 lata de machas al natural)',
      '100 g de queso parmesano rallado',
      '50 g de mantequilla',
      '1/2 taza de vino blanco seco',
      'Jugo de 1/2 limón',
      'Pimienta negra al gusto',
      'Sal (si es necesario)'
    ],
    pasos: [
      'Si usas machas frescas, lávalas bien y ábrelas. Reserva la carne y las conchas. Precalienta el horno a 180 °C.',
      'Coloca las conchas de macha en una bandeja para horno. Si usas machas en conserva, colócalas en conchas o en ramequines.',
      'Pon una macha (o un trozo) en cada concha. Rocía con un poco de vino blanco y jugo de limón, y añade una nuez de mantequilla sobre cada una.',
      'Cubre generosamente con queso parmesano rallado y un toque de pimienta negra.',
      'Hornea por 5 a 8 minutos, hasta que el queso esté derretido y ligeramente dorado. Sirve inmediatamente.'
    ],
    dato: 'Las machas son un marisco endémico de las costas chilenas. Su sabor es dulce y salino, por lo que el queso parmesano realza su sabor sin opacarlo.'
  },

  /* ============ 43. LOCOS CON MAYONESA ============ */
  {
    titulo: 'Locos con mayonesa',
    categoria: 'principales',
    imagen: '',
    tiempo: '1 h 15 min',
    porciones: '4 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '4 locos frescos (o 1 lata de locos)',
      '1 taza de mayonesa casera o de buen calidad',
      '1/2 cebolla morada picada en cubos muy pequeños',
      '1 cucharada de cilantro fresco picado',
      'Jugo de 1 limón',
      'Sal y pimienta al gusto',
      'Lechuga para acompañar'
    ],
    pasos: [
      'Si usas locos frescos, lávalos y cocínalos en agua hirviendo con sal por 40-50 minutos, hasta que estén tiernos. Deja enfriar en el agua de cocción.',
      'Retira los locos, córtalos en rodajas o trozos y reserva.',
      'En un bol, mezcla la mayonesa con la cebolla morada, el cilantro y el jugo de limón. Salpimenta al gusto.',
      'Sirve los locos sobre una cama de lechuga y cúbrelos con la mayonesa preparada.',
      'También puedes mezclar los locos directamente con la salsa y servir como cóctel.'
    ],
    dato: 'El loco es un caracol marino muy preciado en Chile. Se suele servir en ocasiones especiales como fiestas patrias o celebraciones familiares.'
  },

  /* ============ 44. PAILA MARINA ============ */
  {
    titulo: 'Paila marina',
    categoria: 'sopas',
    imagen: '',
    tiempo: '45 min',
    porciones: '4 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '500 g de pescado blanco (congrio, merluza) en trozos',
      '250 g de choritos (mejillones) con concha',
      '250 g de almejas con concha',
      '1 taza de camarones pelados',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates pelados y picados',
      '1/2 taza de vino blanco',
      '1 litro de caldo de pescado',
      'Aceite, sal, pimienta, ají de color y orégano'
    ],
    pasos: [
      'En una olla grande, sofríe la cebolla, el ajo y el pimentón en aceite hasta que estén transparentes.',
      'Agrega el tomate, el ají de color, orégano, sal y pimienta. Cocina por 5 minutos.',
      'Vierte el vino blanco y el caldo de pescado. Lleva a ebullición.',
      'Incorpora los choritos y las almejas. Tapa y cocina hasta que se abran (unos 5 minutos).',
      'Agrega los trozos de pescado y los camarones. Cocina por 5-7 minutos más, hasta que el pescado esté cocido.',
      'Rectifica la sal y sirve caliente en platos hondos o en una paila de greda.'
    ],
    dato: 'La paila marina se sirve tradicionalmente en una paila de greda, que mantiene el calor por más tiempo. Es ideal para compartir en invierno.'
  },

  /* ============ 45. PESCADO FRITO ============ */
  {
    titulo: 'Pescado frito',
    categoria: 'principales',
    imagen: '',
    tiempo: '30 min',
    porciones: '4 personas',
    dificultad: 'fácil',
    tecnica: 'Fritura',
    ingredientes: [
      '4 filetes de pescado blanco (merluza, reineta o congrio)',
      '1 taza de harina',
      '1 cucharadita de polvos de hornear',
      '1 huevo',
      '1/2 taza de agua o cerveza fría',
      'Sal, pimienta y orégano al gusto',
      'Aceite para freír',
      'Limón para servir'
    ],
    pasos: [
      'Sazona los filetes de pescado con sal, pimienta y orégano. Déjalos reposar por 10 minutos.',
      'Prepara la mezcla para el batido: en un bol, mezcla la harina, los polvos de hornear, el huevo y el agua o cerveza hasta obtener una consistencia espesa pero fluida.',
      'Calienta abundante aceite en una sartén honda o freidora a unos 180 °C.',
      'Pasa cada filete por la mezcla, dejando que escurra el exceso, y fríe en el aceite caliente por 3-4 minutos por lado, hasta que estén dorados y crujientes.',
      'Escurre sobre papel absorbente y sirve con rodajas de limón y ensalada a la chilena.'
    ],
    dato: 'La cerveza fría en el batido le da una textura extra crujiente al pescado frito. Es un secreto de cocina muy popular.'
  },

  /* ============ 46. CORVINA AL HORNO ============ */
  {
    titulo: 'Corvina al horno',
    categoria: 'principales',
    imagen: '',
    tiempo: '40 min',
    porciones: '2 personas',
    dificultad: 'fácil',
    tecnica: 'Horno',
    ingredientes: [
      '2 filetes de corvina (o lubina) de unos 200 g cada uno',
      '1 cebolla en rodajas',
      '1 tomate en rodajas',
      '2 dientes de ajo laminados',
      '1/2 taza de vino blanco',
      '2 cucharadas de aceite de oliva',
      'Sal, pimienta y tomillo al gusto',
      'Rodajas de limón'
    ],
    pasos: [
      'Precalienta el horno a 180 °C.',
      'En una fuente para horno, coloca una base de cebolla y tomate en rodajas. Coloca los filetes de corvina encima.',
      'Sazona con sal, pimienta y tomillo. Distribuye el ajo laminado sobre el pescado.',
      'Rocía con el vino blanco y el aceite de oliva. Coloca unas rodajas de limón encima.',
      'Hornea por 20-25 minutos, hasta que el pescado esté cocido y se desmenuce fácilmente con un tenedor.',
      'Sirve con papas cocidas o arroz.'
    ],
    dato: 'La corvina es un pescado muy versátil. Al hornearla con vino blanco y limón, su carne se mantiene jugosa y absorbe todos los sabores.'
  },

  /* ============ 47. SALMÓN AL HORNO ============ */
  {
    titulo: 'Salmón al horno',
    categoria: 'principales',
    imagen: '',
    tiempo: '25 min',
    porciones: '2 personas',
    dificultad: 'muy fácil',
    tecnica: 'Horno',
    ingredientes: [
      '2 filetes de salmón fresco (aprox. 200 g cada uno)',
      '2 cucharadas de aceite de oliva',
      'Jugo de 1 limón',
      '2 dientes de ajo picados',
      'Sal y pimienta al gusto',
      'Perejil fresco picado',
      'Rodajas de limón'
    ],
    pasos: [
      'Precalienta el horno a 200 °C. Forra una bandeja con papel de horno.',
      'Coloca los filetes de salmón en la bandeja. Sazona con sal, pimienta y ajo picado.',
      'Rocía con el aceite de oliva y el jugo de limón. Coloca rodajas de limón encima.',
      'Hornea por 12-15 minutos, dependiendo del grosor del filete, hasta que el salmón esté cocido pero aún jugoso.',
      'Espolvorea con perejil fresco y sirve con ensalada o papas al horno.'
    ],
    dato: 'El salmón chileno es famoso por su calidad. No necesitas muchos ingredientes para que quede delicioso; el limón y el ajo son suficientes.'
  },

  /* ============ 48. SALSA AMERICANA ============ */
  {
    titulo: 'Salsa americana',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '15 min',
    porciones: '1 taza',
    dificultad: 'muy fácil',
    tecnica: 'Sin cocción',
    ingredientes: [
      '6 cebollitas perla encurtidas',
      '2 zanahorias encurtidas en rodajas',
      '2 pepinillos encurtidos',
      '1/2 taza de mayonesa',
      '1 cucharada de ketchup',
      '1 cucharadita de mostaza',
      'Sal y pimienta al gusto'
    ],
    pasos: [
      'Escurre bien las cebollitas, las zanahorias y los pepinillos. Pícalos en trozos muy pequeños.',
      'En un bol, mezcla la mayonesa, el ketchup y la mostaza hasta integrar.',
      'Incorpora los encurtidos picados y mezcla bien. Salpimenta al gusto.',
      'Refrigera por al menos 30 minutos para que los sabores se mezclen antes de servir.',
      'Sirve como acompañamiento de carnes, papas fritas o completos.'
    ],
    dato: 'A pesar de su nombre, la salsa americana es un clásico chileno. Se usa mucho en las hamburguesas y completos para darles un toque ácido y crujiente.'
  },

  /* ============ 49. PEBRE CHILENO ============ */
  {
    titulo: 'Pebre chileno',
    categoria: 'ensaladas',
    imagen: '',
    tiempo: '15 min',
    porciones: '4 personas',
    dificultad: 'muy fácil',
    tecnica: 'Sin cocción',
    ingredientes: [
      '1 tomate grande maduro, picado en cubos pequeños',
      '1 cebolla mediana, picada en cubos pequeños',
      '1 diente de ajo picado muy fino',
      '3 cucharadas de perejil fresco picado',
      '3 cucharadas de cilantro fresco picado',
      '1 trozo de ají verde picado (opcional)',
      '2 cucharadas de aceite de oliva',
      '1 cucharada de vinagre de vino tinto',
      'Sal y pimienta al gusto'
    ],
    pasos: [
      'Pica todos los ingredientes en cubos muy pequeños y uniformes.',
      'En un bol, mezcla el tomate, la cebolla, el ajo, el perejil, el cilantro y el ají.',
      'Condimenta con el aceite de oliva, el vinagre, la sal y la pimienta. Mezcla bien.',
      'Deja reposar por al menos 15 minutos para que los sabores se integren.',
      'Sirve con pan amasado, marraqueta o como acompañamiento de carnes.'
    ],
    dato: 'El pebre es el acompañamiento más popular de la mesa chilena. Se sirve en todas las casas, especialmente en las once y en los asados.'
  },

  /* ============ 50. MARRAQUETA ============ */
  {
    titulo: 'Marraqueta',
    categoria: 'panes',
    imagen: '',
    tiempo: '2 h 30 min',
    porciones: '4 panes',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      '1 kg de harina sin polvos de hornear',
      '600 ml de agua a temperatura ambiente',
      '20 g de sal',
      '15 g de levadura granulada',
      '1 cucharadita de azúcar (opcional)'
    ],
    pasos: [
      'Disuelve la levadura y el azúcar en un poco de agua tibia. Deja reposar por 15 minutos hasta que espume.',
      'En un bol grande, mezcla la harina con la sal. Agrega la levadura disuelta y el resto del agua. Amasa hasta obtener una masa suave y elástica.',
      'Cubre la masa y deja levar en un lugar cálido por 1 hora, o hasta que doble su volumen.',
      'Divide la masa en 4 porciones. Forma bolas y luego aplánalas ligeramente. Haz un corte profundo en el centro de cada pan.',
      'Coloca los panes en una bandeja enharinada y deja levar por 30 minutos más. Precalienta el horno a 220 °C.',
      'Hornea por 20-25 minutos, hasta que estén dorados y suenen huecos al golpear la base.'
    ],
    dato: 'La marraqueta es el pan más consumido en Chile. Su corte característico permite separarla en cuatro "marraquetas" para compartir.'
  },

  /* ============ 51. HALLULLA ============ */
  {
    titulo: 'Hallulla',
    categoria: 'panes',
    imagen: '',
    tiempo: '2 h',
    porciones: '6 panes',
    dificultad: 'media',
    tecnica: 'Horno',
    ingredientes: [
      '500 g de harina',
      '150 ml de leche tibia',
      '10 g de levadura seca',
      '1 1/2 cucharaditas de sal',
      '80 g de manteca vegetal',
      '1 cucharadita de azúcar (opcional)'
    ],
    pasos: [
      'Activa la levadura en la leche tibia con el azúcar. Deja reposar por 10 minutos.',
      'Mezcla la harina con la sal. Agrega la levadura con la leche y la manteca. Amasa hasta que la masa esté suave y no se pegue.',
      'Deja levar tapada por 1 hora, hasta que doble su volumen.',
      'Divide la masa en 6 bollos. Estira cada uno en forma de disco plano de aproximadamente 1 cm de grosor.',
      'Coloca en una bandeja engrasada y deja levar por 30 minutos más. Precalienta el horno a 200 °C.',
      'Hornea por 15-20 minutos, hasta que estén doradas. Sirve tibias.'
    ],
    dato: 'La hallulla es un pan redondo y plano, ideal para sándwiches. Su textura es más suave y compacta que la marraqueta.'
  },

  /* ============ 52. SOPAIPILLAS PASADAS ============ */
  {
    titulo: 'Sopaipillas pasadas',
    categoria: 'panes',
    imagen: '',
    tiempo: '45 min',
    porciones: '20 unidades',
    dificultad: 'fácil',
    tecnica: 'Fritura',
    ingredientes: [
      'Masa: 500 g de harina',
      'Masa: 300 g de zapallo cocido y molido',
      'Masa: 100 g de manteca derretida',
      'Masa: 1 cdta de sal y 1 cdta de polvos de hornear',
      'Masa: Aceite para freír',
      'Chancaca: 250 g de chancaca',
      'Chancaca: ½ taza de agua',
      'Chancaca: 1 rama de canela',
      'Chancaca: Cáscara de 1 naranja',
      'Chancaca: 2 clavos de olor'
    ],
    pasos: [
      'Mezcla el zapallo, la harina, la sal y los polvos de hornear. Agrega la manteca y amasa hasta obtener una masa suave.',
      'Reposa 20 min, estira a 5 mm y corta discos de 8 cm. Pincha con un tenedor y fríe en aceite caliente hasta dorar.',
      'Aparte, hierve la chancaca con el agua, la canela, la cáscara de naranja y los clavos hasta formar un almíbar.',
      'Baña las sopaipillas recién fritas con el almíbar caliente y sirve.'
    ],
    dato: 'Se sirven tibias, cuando el almíbar todavía está brillante y pegajoso. Es el dulce perfecto para un día de lluvia.'
  },

  /* ============ 53. PRIETAS ============ */
  {
    titulo: 'Prietas',
    categoria: 'principales',
    imagen: '',
    tiempo: '1 h 30 min',
    porciones: '4 personas',
    dificultad: 'media',
    tecnica: 'Olla',
    ingredientes: [
      '4 prietas (morcillas) frescas',
      '1 cebolla picada en pluma',
      '2 dientes de ajo picados',
      '1 hoja de laurel',
      '1 cucharada de orégano',
      'Aceite para freír',
      'Sal y pimienta al gusto',
      'Papas cocidas o puré para acompañar'
    ],
    pasos: [
      'Pincha las prietas con un tenedor para que no exploten durante la cocción.',
      'En una olla con agua hirviendo, cocina las prietas por 10-15 minutos con una hoja de laurel. Escurre y corta en rodajas gruesas.',
      'En una sartén con un poco de aceite, sofríe la cebolla y el ajo hasta que estén dorados. Agrega el orégano.',
      'Incorpora las rodajas de prieta y fríelas por unos minutos de cada lado hasta que estén doradas y crujientes por fuera.',
      'Sirve caliente con papas cocidas, puré o ensalada.'
    ],
    dato: 'La prieta es un embutido de sangre de cerdo típico de la zona sur de Chile. Se suele consumir en fiestas patrias y en invierno.'
  }

];