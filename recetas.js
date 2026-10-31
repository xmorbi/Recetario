/* =================================================================
   RECETAS.JS — Recetario chileno consolidado
   Fase 1 (reorganización de categorías) + Fase 2 (formato eficiente)
   ================================================================= */

/*
  Helper: construye una receta desde argumentos posicionales.
  Orden:
    1.  titulo        6.  porciones     11. dato
    2.  categoria     7.  dificultad    12. errores [{error, solucion}]
    3.  tags          8.  tecnica       13. conservacion {refrigerador, congelador, recalentar}
    4.  imagen (o null)
    5.  tiempo        9.  ingredientes
                     10.  pasos
*/
const r = (titulo, categoria, tags, imagen, tiempo, porciones, dificultad, tecnica,
           ingredientes, pasos, dato, errores, conservacion) =>
  ({ titulo, categoria, tags, imagen: imagen || null, tiempo, porciones, dificultad,
     tecnica, ingredientes, pasos, dato, errores, conservacion });

const RECETAS = [

  /* 1. Empanadas de pino */
  r('Empanadas de pino', 'principales',
    ['empanada', 'horno', 'pino', 'plato principal', 'fiestas patrias'],
    'img/Empanadas-de-pino.jpg', '90 min + reposo', '12 unidades', 'media', 'Horno',
    [
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
      'Pino: 12 aceitunas, 2 huevos duros, 50 g de pasas',
    ],
    [
      'Sofríe la cebolla en aceite a fuego medio hasta que esté transparente, unos 10 minutos.',
      'Agrega la carne, el comino, el orégano y el ají de color. Cocina 10 minutos más y condimenta.',
      'Deja enfriar el pino por completo.',
      'Mezcla la harina con la sal, añade la manteca, el huevo y el agua tibia. Amasa hasta lograr una masa lisa.',
      'Reposa la masa 30 minutos. Divídela en 12 bollos y estira cada uno en un disco de unos 15 cm.',
      'Rellena con dos cucharadas de pino, una aceituna, unas pasas y un trozo de huevo duro.',
      'Humedece el borde, cierra con un repulgue y pincha la masa con un tenedor.',
      'Pinta con huevo batido y hornea a 200 °C por 25 a 30 minutos.',
    ],
    'El repulgue no es decorativo, impide que el jugo del pino se escape en el horno.',
    [
      { error: 'El pino está caliente al armar', solucion: 'Si rellenas la masa con el pino caliente, la grasa se derrite y las empanadas se abren en el horno. Prepara el pino el día anterior o déjalo enfriar completamente.' },
      { error: 'La cebolla pica demasiado', solucion: 'Lávala con sal y déjala remojando en agua fría por unos minutos. Otra opción es dejarla reposar en agua hirviendo un par de minutos antes de sofreírla.' },
      { error: 'Masa seca o quebradiza', solucion: 'Amasar en exceso la masa desarrolla el gluten y la vuelve dura. Amasa solo hasta que los ingredientes se integren.' },
      { error: 'Exceso de relleno', solucion: 'Poner demasiado pino impide que el repulgue cierre bien. Usa dos cucharadas generosas por empanada y deja un borde libre.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas en un recipiente hermético.', congelador: 'Hasta 3 meses. Se pueden congelar crudas (armadas) o cocidas.', recalentar: 'Si están crudas: hornear directo del congelador a 180°C por 35-40 min. Si están cocidas: horno o freidora de aire por 5-10 min. Evita el microondas.' }
  ),

  /* 2. Pastel de choclo */
  r('Pastel de choclo', 'principales',
    ['choclo', 'horno', 'plato principal', 'tradicional', 'verano'],
    'img/Pastel-de-choclo.jpg', '75 min', '6 personas', 'media', 'Horno',
    [
      '6 choclos grandes rallados (o 1 kg de choclo congelado)',
      '1 taza de leche',
      '1 cucharada de mantequilla',
      'Albahaca fresca picada',
      '500 g de carne picada',
      '2 cebollas picadas finas',
      'Comino, ají de color, sal y pimienta',
      '3 huevos duros, 12 aceitunas, 50 g de pasas',
      '1 cucharada de azúcar para gratinar',
    ],
    [
      'Prepara el pino como para las empanadas: sofríe la cebolla, agrega la carne y condimenta.',
      'Cocina el choclo rallado con la leche y la mantequilla a fuego bajo por 15 minutos hasta que espese.',
      'Agrega la albahaca picada y sal a la pasta de choclo.',
      'En una fuente de greda, extiende el pino. Reparte el huevo duro, las aceitunas y las pasas.',
      'Cubre con la pasta de choclo y espolvorea azúcar por encima.',
      'Hornea a 200 °C por 25 a 30 minutos hasta que la superficie esté dorada.',
    ],
    'El azúcar forma esa costra dorada que contrasta con el relleno salado. Algunos prefieren la pasta con hollejo (más rústica) y otros la cuelan para una textura más fina; es una elección personal, no un error.',
    [
      { error: 'Pasta de choclo aguada', solucion: 'El choclo suelta mucha agua al cocinarse. Cocina la pasta a fuego bajo hasta que espese y se despegue del fondo de la olla.' },
      { error: 'Falta de sabor en el pino', solucion: 'Sofríe bien la cebolla, condimenta con comino y ají de color, y deja que el pino repose para que se concentren los sabores.' },
      { error: 'El pastel queda crudo en el centro', solucion: 'No abras la puerta del horno durante los primeros 20 minutos: el cambio brusco de temperatura corta la cocción. Si al pinchar el centro aún está líquido, tapa con papel aluminio y hornea 5-10 minutos más a 180 °C.' },
    ],
    { refrigerador: 'Hasta 2 días. Cúbrelo con papel plástico para que no absorba olores.', congelador: 'No recomendado. La pasta de choclo tiende a cortarse y las papas pierden textura.', recalentar: 'En el horno a 180°C por 15 minutos para que recupere la costra dorada.' }
  ),

  /* 3. Cazuela de vacuno */
  r('Cazuela de vacuno', 'principales',
    ['cazuela', 'sopa', 'olla', 'invierno', 'plato principal', 'vacuno'],
    'img/Cazuela-de-vacuno.jpg', '70 min', '4 a 6 personas', 'fácil', 'Olla',
    [
      '1 kg de carne de vacuno con hueso (osobuco o costilla)',
      '2 papas medianas',
      '1/2 zapallo en trozos',
      '1 zanahoria en rodajas',
      '1 choclo cortado en trozos',
      '1 cebolla y 2 dientes de ajo',
      '1/2 taza de arroz',
      'Orégano, sal y pimienta',
    ],
    [
      'Pon la carne en una olla grande con agua fría, la cebolla y el ajo. Lleva a hervor y retira la espuma.',
      'Cocina a fuego medio por 40 minutos.',
      'Agrega la zanahoria y el zapallo. Cocina 10 minutos.',
      'Incorpora las papas, el choclo y el arroz. Cocina 20 minutos más.',
      'Condimenta con orégano, sal y pimienta. Sirve caliente con el caldo abundante.',
    ],
    'Cada casa tiene su orden. Algunos agregan el arroz al final para que el caldo quede más limpio.',
    [
      { error: 'Caldo turbio', solucion: 'Si el agua hierve demasiado fuerte, la grasa y las impurezas se emulsionan. Retira la espuma los primeros minutos y mantén un hervor suave.' },
      { error: 'Verduras deshechas', solucion: 'Agrega los ingredientes por tandas: primero la carne, luego zanahoria, después papas y zapallo, y al final el choclo y el arroz.' },
      { error: 'Sabor soso (Falta de Reacción de Maillard)', solucion: 'Dora muy bien la carne en aceite caliente antes de agregar el agua. Esa costra marrón es puro sabor que se transferirá al caldo.' },
    ],
    { refrigerador: 'Hasta 3 días en un recipiente hermético.', congelador: 'Hasta 2 meses. Idealmente congela sin papas, ya que se ponen aguadas al descongelar.', recalentar: 'A fuego lento en la olla, añadiendo un poco de agua o caldo para evitar que se seque.' }
  ),

  /* 4. Charquicán */
  r('Charquicán', 'principales',
    ['charquican', 'olla', 'plato principal', 'invierno', 'papas', 'verduras'],
    'img/Charquican.jpg', '40 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de carne picada (o charqui remojado y desmenuzado)',
      '3 papas en cubos',
      '1/2 zapallo en cubos',
      '1 cebolla picada',
      '1 choclo desgranado o 1 taza de arvejas',
      'Comino, ají de color, orégano y sal',
      'Huevos para freír al servir',
    ],
    [
      'Hierve papas y zapallo en agua con sal hasta que estén blandos. Reserva un poco del agua.',
      'Sofríe la cebolla en otra olla. Agrega la carne y condimenta.',
      'Incorpora el choclo o las arvejas y cocina 5 minutos.',
      'Agrega las papas y el zapallo escurridos. Maja la mezcla con un tenedor.',
      'Sirve con un huevo frito encima.',
    ],
    'El nombre viene del quechua charquicán, por el charqui, carne seca y salada.',
    [
      { error: 'Puré en vez de guiso', solucion: 'Majarlo demasiado. Usa un tenedor y aplasta suavemente. El charquicán debe tener textura rústica, con trozos visibles.' },
      { error: 'Sabor plano', solucion: 'El charquicán es un plato de campo, necesita aliños generosos. Prueba y ajusta la sal antes de servir.' },
      { error: 'Falta de Umami', solucion: 'Agrega una pizca de glutamato monosódico o pica finamente un par de champiñones. Levantan el sabor de forma increíble sin notarse.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento en la olla. Si está muy espeso, agrega un chorrito de agua o leche.' }
  ),

  /* 5. Porotos granados */
  r('Porotos granados', 'principales',
    ['porotos', 'verano', 'choclo', 'plato principal', 'tradicional', 'vegetariano'],
    'img/porotos-granados.jpg', '50 min', '6 personas', 'fácil', 'Olla',
    [
      '500 g de porotos granados frescos (o 300 g secos, remojados)',
      '1/2 zapallo en cubos',
      '2 choclos desgranados',
      '1 cebolla picada',
      '1 cucharadita de ají de color',
      'Comino y albahaca fresca',
      'Aceite, sal y pimienta',
    ],
    [
      'Sofríe la cebolla en aceite. Agrega el ají de color y el comino.',
      'Incorpora los porotos, el zapallo y agua suficiente para cubrirlos.',
      'Cocina 30 a 40 minutos hasta que los porotos estén tiernos y el zapallo se deshaga.',
      'Agrega el choclo y la albahaca. Cocina 10 minutos más.',
      'Condimenta y sirve con un chorrito de aceite crudo.',
    ],
    'Es el plato de verano por excelencia. Con choclo tierno el sabor cambia por completo.',
    [
      { error: 'Porotos duros', solucion: 'Agregar sal al principio endurece la piel. Agrega la sal solo cuando los porotos estén blandos. (Tip extra: una pizca de bicarbonato los ablanda, pero cambia un poco el sabor).' },
      { error: 'Caldo desabrido', solucion: 'El sofrito de cebolla con ají de color y comino es la base. Debe sofreírse hasta que la cebolla esté bien dorada y aromática.' },
    ],
    { refrigerador: 'Hasta 4 días en su propio caldo y recipiente hermético.', congelador: 'Hasta 3 meses en porciones con un poco de caldo.', recalentar: 'A fuego lento en la olla. Si está muy espeso, añade un poco de agua.' }
  ),

  /* 6. Humitas */
  r('Humitas', 'panes',
    ['humita', 'choclo', 'horno', 'olla', 'plato principal', 'vegetariano'],
    'img/Humitas.jpg', '80 min', '8 unidades', 'media', 'Olla',
    [
      '6 choclos tiernos rallados',
      '1 cebolla picada muy fina',
      '100 g de manteca',
      '1 cucharadita de ají de color',
      'Albahaca fresca y sal',
      'Hojas de choclo para envolver',
    ],
    [
      'Sofríe la cebolla en la manteca. Agrega el ají de color y revuelve.',
      'Mezcla el choclo rallado con el sofrito, la albahaca y sal.',
      'Cocina a fuego bajo 10 minutos, revolviendo. Deja enfriar.',
      'Blanquea las hojas de choclo en agua caliente.',
      'Pon dos cucharadas de mezcla en cada hoja, envuelve y amarra.',
      'Cocina en agua con sal hirviendo 30 a 40 minutos, o al horno a 180 °C por 40 minutos.',
    ],
    'Si el choclo está muy seco, agrega un poco de leche a la mezcla.',
    [
      { error: 'Humitas secas', solucion: 'El choclo utilizado no es lo suficientemente tierno. Agrega un chorrito de leche y una cucharada extra de mantequilla a la mezcla.' },
      { error: 'Se desarman al hervir', solucion: 'Asegúrate de amarrar las hojas firme, pero sin apretar demasiado para que el vapor circule.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas con su hoja.', congelador: 'Hasta 3 meses, bien envueltas en papel plástico.', recalentar: 'Al vapor o en el microondas por 2-3 minutos (con un poco de agua para que no se sequen).' }
  ),

  /* 7. Sopaipillas */
  r('Sopaipillas', 'panes',
    ['sopaipilla', 'fritura', 'invierno', 'pan', 'merienda', 'once'],
    'img/sopaipillas.jpg', '45 min', '20 unidades', 'fácil', 'Fritura',
    [
      '500 g de zapallo cocido y molido',
      '500 g de harina',
      '100 g de manteca derretida',
      '1 cucharadita de sal',
      '1 cucharadita de polvos de hornear',
      'Aceite para freír',
      'Opcional: chancaca, canela y cáscara de naranja',
    ],
    [
      'Mezcla el zapallo molido con la harina, la sal y los polvos de hornear.',
      'Agrega la manteca derretida y amasa hasta que la masa no se pegue en las manos.',
      'Reposa 20 minutos tapada con un paño.',
      'Estira a 5 mm de grosor y corta discos de unos 8 cm.',
      'Pincha cada disco con un tenedor.',
      'Fríe en aceite caliente hasta dorar. Escurre sobre papel absorbente.',
    ],
    'Para sopaipillas pasadas, hierve chancaca con agua, canela y cáscara de naranja y baña las recién fritas.',
    [
      { error: 'Sopaipillas duras', solucion: 'Amasar de más la masa o usar un zapallo muy fibroso. Amasa solo hasta unir y asegúrate de que el zapallo esté bien molido.' },
      { error: 'No se inflan', solucion: 'El aceite no está a la temperatura correcta. Debe estar a fuego medio (aprox. 170°C). Si está muy caliente, se doran por fuera y quedan crudas por dentro.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días. En frío se ponen duras.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'En horno o freidora de aire a 180°C por 5 minutos para recuperar la textura.' }
  ),

  /* 8. Pan amasado */
  r('Pan amasado', 'panes',
    ['pan', 'horno', 'masa', 'desayuno', 'once'],
    'img/Pan-amasado.jpg', '60 min', '12 panes', 'fácil', 'Horno',
    [
      '1 kg de harina',
      '200 g de manteca',
      '2 cucharaditas de sal',
      '2 cucharaditas de polvos de hornear',
      '500 ml de agua tibia o leche',
    ],
    [
      'Mezcla la harina con la sal y los polvos de hornear.',
      'Agrega la manteca y trabaja con las manos hasta que quede como arena gruesa.',
      'Añade el agua tibia de a poco y amasa 10 minutos.',
      'Forma 12 bollos, aplánalos y ponlos en una bandeja engrasada.',
      'Pincha con un tenedor y deja reposar 20 minutos.',
      'Hornea a 200 °C por 25 a 30 minutos.',
    ],
    'El secreto está en amasar con paciencia. Poco amasado da pan duro.',
    [
      { error: 'Pan duro como piedra', solucion: 'El exceso de harina o un mal amasado hacen que el pan quede duro. No agregues toda la harina de golpe; la masa debe quedar suave. Amasa por al menos 10 minutos.' },
      { error: 'El pan no sube', solucion: 'Los polvos de hornear pueden estar vencidos. Revisa la fecha antes de usarlos y guárdalos en un lugar seco y cerrado.' },
      { error: 'Horno seco', solucion: 'Coloca una fuente con agua caliente en el fondo del horno mientras horneas. El vapor mantiene la masa húmeda, permite que suba y evita que quede seca.' },
    ],
    { refrigerador: 'No guardar en frío. A temperatura ambiente 2 días en bolsa de tela o papel.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'Rocía un poco de agua y hornea a 180°C por 5 minutos.' }
  ),

  /* 9. Leche asada */
  r('Leche asada', 'dulces',
    ['postre', 'dulce', 'horno', 'leche', 'tradicional'],
    'img/Leche-Asada.jpg', '70 min', '6 personas', 'fácil', 'Horno',
    [
      '1 litro de leche',
      '6 huevos',
      '150 g de azúcar',
      '1 cucharadita de vainilla',
      '100 g de azúcar para el caramelo',
    ],
    [
      'Derrite el azúcar en una sartén hasta que tome color dorado. Vierte en el fondo del molde.',
      'Bate los huevos con el azúcar hasta que estén cremosos.',
      'Agrega la leche tibia y la vainilla, mezclando suavemente.',
      'Vierte en el molde caramelizado y cúbrelo con papel aluminio.',
      'Hornea al baño María a 180 °C por 50 a 60 minutos.',
      'Deja enfriar y refrigera al menos 2 horas antes de desmoldar.',
    ],
    'El baño María es obligatorio. Sin él, la leche se corta.',
    [
      { error: 'Textura con burbujas (como esponja)', solucion: 'Batir demasiado los huevos incorpora aire. Bate suavemente solo hasta integrar y cuela la mezcla antes de ponerla en el molde.' },
      { error: 'Caramelo amargo', solucion: 'El azúcar se pasó de cocción. Retira el caramelo del fuego cuando tenga un color ámbar claro (dorado).' },
    ],
    { refrigerador: 'Hasta 3 días en un recipiente hermético o cubierto con papel plástico.', congelador: 'No recomendado, la textura del huevo se estropea.', recalentar: 'Se consume fría. Si la quieres tibia, sácala del refrigerador 15 minutos antes.' }
  ),

  /* 10. Mote con huesillo */
  r('Mote con huesillo', 'dulces',
    ['postre', 'dulce', 'verano', 'bebida', 'tradicional'],
    'img/Mote-con-Huesillo.JPG', '40 min + frío', '6 vasos', 'fácil', 'Olla',
    [
      '200 g de mote de trigo cocido',
      '200 g de huesillos secos, remojados desde la noche anterior',
      '1 taza de azúcar o chancaca',
      '1 rama de canela',
      'Cáscara de naranja',
    ],
    [
      'Remoja los huesillos la noche anterior. Reserva el agua del remojo.',
      'Cocina los huesillos con el agua de remojo, el azúcar, la canela y la cáscara de naranja.',
      'Cocina a fuego medio 30 minutos hasta que los huesillos estén blandos y el jugo tenga consistencia de almíbar.',
      'Deja enfriar y refrigera varias horas.',
      'Sirve en vaso alto: mote escurrido, huesillos y jugo bien frío.',
    ],
    'Se toma con cuchara. El jugo se bebe y el mote se come al final.',
    [
      { error: 'Huesillos duros', solucion: 'No remojarlos la noche anterior. Si se te olvidó, cocínalos en agua fría y deja reposar. Usa siempre el líquido del remojo para el jugo.' },
      { error: 'Mote pastoso y sin jugo', solucion: 'Mezclar el mote con los huesillos y el jugo antes de servir. Mezcla solo al momento de servir en el vaso para evitar que absorba todo el líquido.' },
    ],
    { refrigerador: 'Hasta 3 días. Mantén el mote y el jugo en recipientes separados.', congelador: 'No recomendado, el mote se cristaliza.', recalentar: 'Se consume bien frío. No requiere recalentamiento.' }
  ),

  /* 11. Cazuela de ave — categoría: sopas → principales */
  r('Cazuela de ave', 'principales',
    ['cazuela', 'sopa', 'olla', 'invierno', 'pollo'],
    'img/Cazuela-de-Ave-01.JPG', '2 h', '6 personas', 'fácil', 'Olla',
    [
      '6 trutros de pollo sin piel',
      '1 zanahoria en rodajas + 1 rallada',
      '½ pimentón rojo en tiras',
      '6 papas peladas',
      '6 trozos de zapallo',
      '6 trozos de choclo',
      '1 taza de porotos verdes picados',
      '½ taza de arroz',
      'Sal, pimienta, orégano',
      '1 L de agua caliente',
    ],
    [
      'Dora el pollo en aceite 5 min por lado en una olla grande.',
      'Agrega la zanahoria, el pimentón, sal, pimienta y orégano. Saltea 5 min.',
      'Vierte el agua caliente y cocina a fuego lento.',
      'A los 30 min, añade las papas, el zapallo y el choclo.',
      'Encima pon los porotos verdes y el arroz sin revolver. Cocina hasta que todo esté tierno.',
    ],
    'El secreto está en no revolver después de agregar el arroz.',
    [
      { error: 'Pollo crudo o sin sabor', solucion: 'No sellar el pollo antes de hervirlo. Dóralo en aceite por ambos lados antes de agregar el agua. Esto asegura la cocción y le da más sabor al caldo.' },
      { error: 'Arroz pasado', solucion: 'Revolver después de agregar el arroz. Una vez que agregues el arroz en la superficie, no lo revuelvas. Tápalo y déjalo cocinar al vapor.' },
      { error: 'Caldo soso', solucion: 'Aplica la Reacción de Maillard dorando bien el pollo al principio para crear una capa de sabor profundo.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses (idealmente sin papas).', recalentar: 'A fuego lento añadiendo un poco de agua o caldo.' }
  ),

  /* 12. Cazuela de cerdo — categoría: sopas → principales */
  r('Cazuela de cerdo', 'principales',
    ['cazuela', 'sopa', 'olla', 'invierno', 'cerdo'],
    null, '1 h 30 min', '4 a 6 personas', 'fácil', 'Olla',
    [
      '500 g de pulpa de cerdo en cubos',
      '200-250 g de costillar ahumado',
      '2 puerros picados gruesos',
      '2 zanahorias en trozos',
      '4 papas medianas',
      '¼ de repollo crespo o 250 g de repollitos de Bruselas',
      '1 cda de aceite, 1 diente de ajo, 1 cdta de páprika',
      'Ramo de olores (perejil, orégano, laurel, apio)',
      'Sal y pimienta',
    ],
    [
      'Calienta el aceite y sofríe el ajo 30 segundos. Agrega la páprika.',
      'Incorpora los puerros, zanahorias y carnes. Añade 1 cda de agua y tapa.',
      'Vierte 2 litros de agua fría, sal y el ramo de olores. Cocina tapado 1 hora.',
      'Agrega el repollo y las papas. Cocina 30 min más.',
      'Retira el ramo de olores, corrige la sal y sirve con perejil fresco.',
    ],
    'El costillar ahumado le da un sabor profundo que no se logra solo con la pulpa.',
    [
      { error: 'Carne dura y seca', solucion: 'El cerdo se seca rápido si se cocina muy fuerte. Usa un corte con algo de grasa y cocina a fuego muy bajo por al menos 1 hora.' },
      { error: 'Caldo demasiado grasiento', solucion: 'A mitad de la cocción, con una cuchara, retira la capa de grasa que flota en la superficie del caldo.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses (idealmente sin papas).', recalentar: 'A fuego lento en la olla con un poco de caldo.' }
  ),

  /* 13. Pantrucas */
  r('Pantrucas', 'sopas',
    ['sopa', 'olla', 'invierno', 'masa', 'vacuno'],
    'img/pantrucas.JPG', '50 min', '4 personas', 'media', 'Olla',
    [
      'Caldo: 400 g de carne de vacuno (posta o tapapecho)',
      'Caldo: 1 cebolla, 1 zanahoria, ½ pimentón rojo, 1 ajo',
      'Caldo: 3 papas en cubos',
      'Caldo: 1 cdta de ají de color, orégano y ½ cdta de comino',
      'Caldo: 1,5 L de agua hirviendo',
      'Caldo: 2 huevos (opcional) y cilantro fresco',
      'Masa: 2 tazas de harina sin polvos de hornear',
      'Masa: 1 huevo',
      'Masa: ¾ taza de agua tibia',
      'Masa: 1 cdta de aceite o manteca, pizca de sal',
    ],
    [
      'Sofríe cebolla, ajo, pimentón y zanahoria 5 min. Condimenta.',
      'Agrega la carne, cocina hasta que cambie de color. Añade las papas y el agua hirviendo. Tapa 15 min.',
      'Mezcla la harina, huevo, aceite y sal. Agrega el agua tibia hasta formar masa suave.',
      'Estira la masa fina (2 mm) y córtala en cuadrados.',
      'Echa las pantrucas en el caldo hirviendo. Cocina 5-7 min.',
      'Vierte los huevos batidos en hilo y sirve con cilantro picado.',
    ],
    'La masa no lleva polvos de hornear; debe quedar firme.',
    [
      { error: 'Pantrucas duras', solucion: 'Masa muy gruesa o exceso de harina. Estira la masa muy fina (2-3 mm).' },
      { error: 'Pantrucas resbalosas', solucion: 'Cocinar la masa por demasiado tiempo. Agrega las pantrucas al caldo hirviendo y cocínalas por solo 5-7 minutos.' },
      { error: 'Se rompen al revolver', solucion: 'Revolver bruscamente. Usa una cuchara de madera y movimientos suaves.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses (sin papas).', recalentar: 'En olla a fuego lento con un poco de agua para que no se espese demasiado.' }
  ),

  /* 14. Tomaticán */
  r('Tomaticán', 'principales',
    ['tomatican', 'olla', 'plato principal', 'tomate', 'verano'],
    'img/Tomatican.jpg', '30 min', '4 personas', 'fácil', 'Olla',
    [
      '1 kg de tomates maduros',
      '1 taza de choclo picado',
      '1 cebolla en pluma',
      '250 g de lomo, asiento o posta en tiras',
      '2 dientes de ajo, perejil, ½ pimentón',
      'Sal, pimienta, orégano, ají de color y aceite',
    ],
    [
      'Corta la carne en tiritas y los tomates en trozos.',
      'Sofríe la cebolla, el ajo, el perejil y el pimentón con aliños.',
      'Agrega la carne y fríe unos minutos.',
      'Incorpora el choclo y los tomates. Mezcla bien.',
      'Cuando hierva, tapa y cocina a fuego lento 15 min.',
      'Sirve con arroz o papas cocidas.',
    ],
    'Mientras más maduros los tomates, más dulce queda el plato.',
    [
      { error: 'Queda como una sopa aguada', solucion: 'No dejar que los tomates se cocinen lo suficiente. Usa tomates maduros y cocina a fuego lento tapado 20-30 minutos. Si queda líquido, destapa y reduce.' },
      { error: 'Sabor amargo o ácido', solucion: 'Usar tomates verdes o de mala calidad. Usa tomates maduros y dulces. Si están ácidos, agrega una pizca de azúcar.' },
      { error: 'Falta de profundidad de sabor', solucion: 'No dorar bien la carne al principio. Sella la carne en tiras a fuego alto antes de agregar las verduras.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento en una olla, moviendo de vez en cuando.' }
  ),

  /* 15. Porotos con mazamorra */
  r('Porotos con mazamorra', 'principales',
    ['porotos', 'choclo', 'plato principal', 'tradicional', 'verano'],
    'img/porotos-con-mazamorra.png', '50 min', '4 personas', 'fácil', 'Olla',
    [
      '½ kg de porotos granados',
      '150 g de zapallo camote',
      '2 choclos pasteleros',
      '½ cebolla grande, 1 diente de ajo, pimentón (opcional)',
      '6 hojas de albahaca',
      'Sal, orégano, ají de color, pimienta y aceite',
    ],
    [
      'Cuece los porotos desde agua fría con sal, pimienta y ají de color por 30 min.',
      'Agrega el zapallo y cocina hasta que esté blando.',
      'Licúa el choclo desgranado con las hojas de albahaca.',
      'Haz un sofrito de cebolla, ajo y pimentón.',
      'Aplasta el zapallo. Agrega el sofrito y la pasta de choclo.',
      'Hierve 10 min más, rectifica sabores y deja reposar 10 min.',
    ],
    'La mazamorra es el choclo licuado con albahaca, le da cuerpo al caldo.',
    [
      { error: 'Mazamorra sin sabor', solucion: 'No licuar el choclo con la albahaca. La gracia es el aroma que le da la albahaca fresca al choclo.' },
      { error: 'Porotos duros', solucion: 'No agregues sal al principio: endurece la piel. Añádela solo cuando los porotos ya estén completamente blandos. (Tip extra: una pizca de bicarbonato los ablanda, pero cambia un poco el sabor).' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento añadiendo un poco de agua.' }
  ),

  /* 16. Ajiaco chileno */
  r('Ajiaco chileno', 'sopas',
    ['ajiaco', 'sopa', 'olla', 'carne', 'papas'],
    null, '40 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de carne asada (vacuno, cerdo o pollo)',
      '4 papas medianas en cubos',
      '1 cebolla grande, 2 dientes de ajo, 1 zanahoria',
      '1 pimentón, orégano, páprika, comino',
      '1 L de caldo de carne',
      'Sal, pimienta, ají seco (opcional)',
    ],
    [
      'Sofríe la cebolla, zanahoria, pimentón y ajo en aceite.',
      'Agrega la carne asada en trozos y las papas.',
      'Condimenta con orégano, páprika, comino, sal y pimienta.',
      'Cubre con el caldo y cocina hasta que las papas estén tiernas.',
      'Rectifica la sal y sirve caliente.',
    ],
    'Es la receta perfecta para reutilizar la carne del asado del día anterior.',
    [
      { error: 'Papas deshechas y caldo espeso', solucion: 'Usar papas que se deshacen fácilmente. Usa papas de las que se mantienen firmes al cocinar y agrégalas al final.' },
      { error: 'Sabor plano', solucion: 'No dorar bien los aliños. Haz un buen sofrito con la cebolla, el ajo, el pimentón y los condimentos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses (idealmente sin papas).', recalentar: 'A fuego lento con un poco de caldo.' }
  ),

  /* 17. Caldillo de congrio */
  r('Caldillo de congrio', 'sopas',
    ['caldillo', 'sopa', 'pescado', 'marisco', 'olla'],
    'img/Caldillo-de-congrio.JPG', '50 min', '4 personas', 'media', 'Olla',
    [
      '1 kg de congrio en medallones',
      'Cabeza y espinas del congrio',
      '4-5 papas en gajos',
      '1 cebolla grande en pluma',
      '1 zanahoria, 1 pimentón rojo, 2 tomates, 3 ajos',
      '200 ml de vino blanco',
      '100 ml de crema (opcional)',
      'Ají de color, orégano, comino, sal, pimienta y cilantro',
    ],
    [
      'Hierve la cabeza y espinas con verduras y 2 L de agua por 20-30 min. Cuela.',
      'Haz un sofrito con cebolla, pimentón, zanahoria y ajo. Agrega tomate y condimentos.',
      'Vierte el vino y deja evaporar. Añade las papas y cúbrelas con el caldo.',
      'Cocina 15 min hasta que las papas ablanden.',
      'Pon los medallones encima y cocina tapado 8-10 min a fuego mínimo.',
      'Opcional: añade crema antes de apagar. Sirve con cilantro.',
    ],
    'El caldo de la cabeza es lo que le da ese sabor profundo; no lo omitas.',
    [
      { error: 'El pescado se deshace', solucion: 'Hervir el caldo vigorosamente después de agregar el congrio. Baja el fuego al mínimo y cocina pochado por no más de 8-10 minutos.' },
      { error: 'Caldo turbio y amargo', solucion: 'Hervir las espinas y la cabeza a fuego fuerte. Usa fuego lento y retira la espuma que sube a la superficie.' },
      { error: 'Sabor plano', solucion: 'No usar la cabeza y espinas para hacer el caldo. Ese caldo es el que le da la profundidad al plato.' },
    ],
    { refrigerador: 'Hasta 2 días máximo. Al ser pescado, es muy perecedero.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, evitando hervir para que el pescado no se deshaga.' }
  ),

  /* 18. Tomática */
  r('Tomática', 'ensaladas',
    ['ensalada', 'tomate', 'fresca', 'acompañamiento', 'verano'],
    null, '15 min', '4 personas', 'muy fácil', 'Fresca',
    [
      '4 tomates maduros',
      '2 dientes de ajo',
      '1 cucharada de aceite de oliva',
      'Orégano fresco o seco',
      'Sal y pimienta',
      'Unas gotas de vinagre (opcional)',
    ],
    [
      'Pela los tomates y córtalos en cubos.',
      'Pica los ajos muy finos.',
      'Mezcla los tomates con el ajo, el aceite, el orégano, sal y pimienta.',
      'Si queda muy dulce, añade unas gotas de vinagre.',
      'Deja reposar 10 minutos antes de servir para que se mezclen los sabores.',
    ],
    'Sirve como acompañamiento de carnes asadas, arroz o puré.',
    [
      { error: 'Ensalada aguada', solucion: 'Salar los tomates con mucha anticipación. Pélalos y sálalos justo antes de servir.' },
      { error: 'Sabor muy fuerte a ajo', solucion: 'Picar el ajo en trozos grandes. Pícalo muy fino y aplástalo con el lado del cuchillo para que se integre.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, pierde textura.', recalentar: 'Se consume fresca.' }
  ),

  /* 19. Ensalada a la chilena */
  r('Ensalada a la chilena', 'ensaladas',
    ['ensalada', 'tomate', 'cebolla', 'fresca', 'acompañamiento', 'tradicional'],
    'img/Ensalada-a-la-Chilena.jpg', '15 min', '5 personas', 'muy fácil', 'Fresca',
    [
      '4 tomates maduros',
      '½ cebolla blanca',
      'Cilantro fresco picado',
      'Sal y aceite a gusto',
    ],
    [
      'Pela y corta los tomates en cubos.',
      'Corta la cebolla en pluma fina y pásala por agua fría para suavizarla.',
      'Mezcla tomates y cebolla. Condimenta con sal y aceite.',
      'Decora con cilantro picado.',
    ],
    'El agua fría le quita el picor a la cebolla sin perder su textura.',
    [
      { error: 'Ensalada aguada al servir', solucion: 'No salar los tomates con anticipación. Usa un colador para que boten el exceso de agua antes de mezclar.' },
      { error: 'Cebolla muy fuerte', solucion: 'Córtala en pluma fina y remójala en agua fría por al menos 10 minutos. Esto le quita el picor.' },
    ],
    { refrigerador: 'Hasta 2 días. Se recomienda consumir el mismo día.', congelador: 'No recomendado.', recalentar: 'Se consume fresca.' }
  ),

  /* 20. Ensalada rusa chilena */
  r('Ensalada rusa chilena', 'ensaladas',
    ['ensalada', 'papas', 'mayonesa', 'fresca', 'acompañamiento'],
    'img/Ensalada-rusa-chilena.JPG', '30 min + frío', '6 personas', 'fácil', 'Fresca',
    [
      '5 papas medianas',
      '2 zanahorias medianas',
      '½ taza de arvejas cocidas',
      '½ taza de mayonesa',
      '½ taza de yogur griego (opcional)',
      'Cilantro, sal y pimienta',
      '½ cebolla pequeña (opcional)',
    ],
    [
      'Cuece las papas y zanahorias en agua con sal hasta que estén tiernas. Escurre y enfría.',
      'Pélalas y córtalas en cubos pequeños.',
      'Mezcla con las arvejas y la cebolla si la usas.',
      'Incorpora la mayonesa y el yogur. Salpimenta y añade cilantro.',
      'Refrigera al menos 30 min antes de servir.',
    ],
    'El yogur griego aligera la mayonesa y le da un toque más fresco.',
    [
      { error: 'Textura pastosa', solucion: 'Usar papas que se deshacen o cocinarlas demasiado. Usa papas firmes, cuécelas con cáscara y déjalas enfriar.' },
      { error: 'Mayonesa cortada o aguada', solucion: 'Mezclar los ingredientes cuando aún están calientes. Todos los ingredientes deben estar fríos al incorporar la mayonesa.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, la mayonesa se corta y las papas se aguadas.', recalentar: 'Se consume fría.' }
  ),

  /* 21. Chancho en piedra */
  r('Chancho en piedra', 'ensaladas',
    ['picoteo', 'salsa', 'tomate', 'acompañamiento', 'merienda', 'ensalada', 'tradicional'],
    'img/Chancho-en-piedra.jpg', '20 min', '6 personas', 'fácil', 'Salsa',
    [
      '1 kg de tomates bien maduros',
      '3 dientes grandes de ajo',
      '2 atados de cilantro y 1 de perejil',
      '3 ajíes verdes',
      'Orégano fresco o seco',
      '1/3 taza de aceite, 10 granos de pimienta, 1 cdta de sal',
    ],
    [
      'En un mortero de piedra, muele la sal, los ajos y la pimienta hasta formar una pasta.',
      'Pica los ajíes, elimina las pepas y muélelos en el mortero.',
      'Agrega el orégano, perejil y cilantro picados.',
      'Incorpora dos tomates para licuar la pasta y vacía en una fuente.',
      'Añade el resto de los tomates pelados y trozados. Mezcla con el aceite.',
    ],
    'Si el tomate no tiene suficiente acidez, unas gotas de vinagre tinto equilibran el sabor.',
    [
      { error: 'Queda como una sopa de tomate', solucion: 'Usar tomates acuosos. Pélalos y bota el exceso de agua y semillas antes de incorporarlos.' },
      { error: 'Sabor amargo o excesivamente picante', solucion: 'Licuar los ingredientes o usar la parte blanca del ají. Hazlo en mortero y limpia bien los ajíes.' },
    ],
    { refrigerador: 'Hasta 3 días en frasco de vidrio cerrado.', congelador: 'No recomendado, pierde textura el tomate.', recalentar: 'Se consume a temperatura ambiente o frío.' }
  ),

  /* 22. Sopaipillas pasadas */
  r('Sopaipillas pasadas', 'panes',
    ['sopaipilla', 'dulce', 'chancaca', 'invierno', 'merienda', 'once'],
    'img/Sopaipillas-pasadas.jpg', '45 min', '20 unidades', 'fácil', 'Fritura',
    [
      'Masa: 500 g de harina',
      'Masa: 300 g de zapallo cocido y molido',
      'Masa: 100 g de manteca derretida',
      'Masa: 1 cdta de sal y 1 cdta de polvos de hornear',
      'Masa: Aceite para freír',
      'Chancaca: 250 g de chancaca',
      'Chancaca: ½ taza de agua',
      'Chancaca: 1 rama de canela',
      'Chancaca: Cáscara de 1 naranja',
      'Chancaca: 2 clavos de olor',
    ],
    [
      'Mezcla el zapallo, la harina, la sal y los polvos de hornear. Agrega la manteca y amasa hasta obtener una masa suave.',
      'Reposa 20 min, estira a 5 mm y corta discos de 8 cm. Pincha con un tenedor y fríe en aceite caliente hasta dorar.',
      'Aparte, hierve la chancaca con el agua, la canela, la cáscara de naranja y los clavos hasta formar un almíbar.',
      'Baña las sopaipillas recién fritas con el almíbar caliente y sirve.',
    ],
    'Se sirven tibias, cuando el almíbar todavía está brillante y pegajoso.',
    [
      { error: 'Chancaca quemada', solucion: 'Hervir la chancaca a fuego alto sin cuidado. Derrítela a fuego bajo para que no amargue.' },
      { error: 'Sopaipillas frías al bañar', solucion: 'Bañarlas cuando ya están frías. El almíbar debe estar caliente y las sopaipillas recién fritas.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses sin el almíbar. Congela las sopaipillas fritas y luego prepara el almíbar al servir.', recalentar: 'En horno o freidora de aire por 5 minutos. Luego bañar con almíbar caliente.' }
  ),

  /* 23. Empanadas de queso */
  r('Empanadas de queso', 'panes',
    ['empanada', 'horno', 'queso', 'picoteo', 'fritura', 'vegetariano'],
    'img/Empanada-de-queso.jpg', '60 min', '12 unidades', 'fácil', 'Horno o fritura',
    [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 120 g de manteca derretida',
      'Masa: 1 huevo',
      'Masa: 1 cdta de sal',
      'Masa: 200 ml de agua tibia (aprox.)',
      'Relleno: 500 g de queso chanco o mantecoso rallado',
      'Relleno: 1 cdta de orégano (opcional)',
      'Relleno: 1 huevo batido para pintar',
    ],
    [
      'Mezcla la harina con la sal, agrega la manteca, el huevo y el agua tibia. Amasa hasta obtener una masa lisa.',
      'Reposa 30 minutos tapada con un paño.',
      'Divide en 12 bollos y estira cada uno en discos de unos 15 cm.',
      'Rellena con abundante queso rallado (y orégano si usas).',
      'Humedece el borde, cierra con un repulgue y pincha la superficie con un tenedor.',
      'Pinta con huevo batido y hornea a 200 °C por 20 a 25 minutos, o fríelas hasta dorar.',
    ],
    'El queso mantecoso suelta grasa al hornearse; pinchar la masa evita que se abra.',
    [
      { error: 'El queso se sale', solucion: 'El queso se derrite y escapa por bordes mal sellados. Haz un repulgue firme y pincha la masa para que salga el vapor.' },
      { error: 'Masa dura o elástica', solucion: 'Estirar toda la masa de una vez y volver a amasar los recortes. Estira porciones individuales.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses crudas (armadas) o cocidas.', recalentar: 'Horno o freidora de aire por 5-10 minutos. Evita el microondas.' }
  ),

  /* 24. Arroz con leche */
  r('Arroz con leche', 'dulces',
    ['postre', 'dulce', 'olla', 'arroz', 'leche', 'tradicional'],
    'img/Arroz-con-leche.jpg', '50 min', '6 personas', 'fácil', 'Olla',
    [
      '1 L de leche entera',
      '100 g de arroz de grano corto',
      '150 g de azúcar',
      '1 rama de canela',
      'Cáscara de 1 limón (sin la parte blanca)',
      'Canela molida para servir',
    ],
    [
      'Lava el arroz y cuécelo en agua hirviendo 10 minutos. Escurre.',
      'Calienta la leche con la canela en rama y la cáscara de limón hasta que hierva.',
      'Agrega el arroz escurrido y cocina a fuego bajo 30 a 40 minutos, revolviendo seguido.',
      'Añade el azúcar y cocina 5 minutos más, hasta que espese.',
      'Retira la canela y el limón, sirve tibio o frío con canela molida encima.',
    ],
    'Si te gusta más cremoso, agrega 100 ml más de leche al final y cocina 5 minutos extra.',
    [
      { error: 'Se pega en la olla', solucion: 'No revolver con frecuencia o usar fuego muy alto. Cocina a fuego bajo y revuelve constantemente raspando el fondo.' },
      { error: 'Granos duros', solucion: 'El arroz no se cocinó lo suficiente. Usa arroz de grano corto y cocínalo por al menos 30-40 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, el arroz se cristaliza y la leche se separa.', recalentar: 'En olla a fuego bajo con un chorrito de leche fresca, revolviendo constantemente.' }
  ),

    /* 25. Sopones (antes "Sopones o machos ahogados") — rename + tag */
  r('Sopones', 'sopas',
    ['sopa', 'caldo', 'masa', 'olla', 'invierno', 'machos ahogados'],
    null, '30 min', '4 personas', 'fácil', 'Olla',
    [
      '1½ L de caldo de vacuno',
      '125 g de harina sin polvos de hornear',
      '1 huevo',
      '1 cda de cebolla picada fina',
      '1 cda de perejil picado',
      'Aliño completo, sal y pimienta',
    ],
    [
      'Bate la clara a punto de nieve. Agrega la yema y mezcla.',
      'Incorpora la harina, la cebolla, el perejil y los aliños. Forma una masa espesa.',
      'Con una cuchara, deja caer porciones de masa en el caldo hirviendo.',
      'Cocina 10-15 min hasta que los sopones suban y estén cocidos.',
      'Sirve en platos hondos con el caldo bien caliente.',
    ],
    'También se conocen como machos ahogados y son el acompañamiento tradicional de la cazuela.',
    [
      { error: 'Se deshacen en el caldo', solucion: 'La masa está muy blanda o no se batió bien la clara. Bate la clara a punto de nieve y asegúrate de que la masa sea espesa.' },
      { error: 'Sopones crudos por dentro', solucion: 'La masa es muy grande o el caldo no está hirviendo. Haz porciones del tamaño de una cuchara sopera.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, la masa pierde textura.', recalentar: 'A fuego lento en una olla con el caldo.' }
  ),

  /* 26. Pollo arvejado */
  r('Pollo arvejado', 'principales',
    ['pollo', 'guiso', 'olla', 'arvejas', 'plato principal'],
    'img/pollo-arvejado.jpg', '60 min', '4 personas', 'fácil', 'Olla',
    [
      '1,3 kg de trutros de pollo',
      '300 g de arvejas congeladas',
      '2 zanahorias, 1 cebolla, 1 pimentón rojo',
      '3 dientes de ajo',
      '150 ml de vino blanco',
      '200 ml de caldo de pollo',
      'Orégano, comino, laurel, sal, pimienta y perejil',
    ],
    [
      'Sella el pollo condimentado. Retira y reserva.',
      'Sofríe cebolla, zanahoria, pimentón y ajo en la misma olla.',
      'Devuelve el pollo, agrega el vino, el caldo, orégano y laurel. Tapa y cocina 25 min.',
      'Añade las arvejas congeladas y cocina 5 min más.',
      'Sirve con perejil fresco y acompaña con arroz o papas.',
    ],
    'Las arvejas se agregan al final para que conserven su color verde vivo.',
    [
      { error: 'Arvejas descoloridas y pasadas', solucion: 'Agregar las arvejas al principio. Añádelas solo en los últimos 5 minutos de cocción para que mantengan su color y textura.' },
      { error: 'Pollo seco', solucion: 'Cocinar los trutros enteros por demasiado tiempo. Dora el pollo, prepara la salsa y devuélvelo a la olla para que se cocine en su punto.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento en la olla con un poco de caldo.' }
  ),

  /* 27. Pollo al jugo */
  r('Pollo al jugo', 'principales',
    ['pollo', 'olla', 'plato principal', 'guiso'],
    null, '45 min', '4 personas', 'fácil', 'Olla',
    [
      '4 trutros de pollo sin piel',
      '1 cebolla en pluma',
      '1 zanahoria en rodajas',
      '1 ajo picado',
      'Aceite, sal, pimienta, laurel y orégano',
      '1 L de agua hirviendo',
    ],
    [
      'Dora el pollo en aceite hasta sellar. Retira y reserva.',
      'Sofríe la cebolla 5 min hasta que esté transparente.',
      'Agrega el ajo, la zanahoria, el laurel, el orégano y el pollo.',
      'Cubre con el agua hirviendo y cocina 30 min.',
      'Sirve con puré, arroz o papas cocidas.',
    ],
    'El jugo que queda en la olla es la salsa; viértelo sobre el puré.',
    [
      { error: 'Pollo insípido y pálido', solucion: 'Hervir el pollo directamente sin dorarlo. Sella el pollo en aceite caliente hasta que la piel esté dorada para darle sabor.' },
      { error: 'Caldo sin cuerpo', solucion: 'No dejar reducir el líquido. Cuando el pollo esté cocido, retíralo y deja reducir el caldo hasta que tenga consistencia de salsa.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento, bañando el pollo con su propia salsa.' }
  ),

  /* 28. Pollo asado */
  r('Pollo asado', 'principales',
    ['pollo', 'horno', 'plato principal', 'domingo', 'asado'],
    'img/pollo-asado.JPG', '1 h 30 min', '4 a 6 personas', 'media', 'Horno',
    [
      '1 pollo entero',
      '4 cdas de mostaza',
      '2 tabletas de caldo de pollo o verduras',
      '1 taza de vinagre',
      '1 taza de agua',
      '4 cdas de aceite, sal y pimienta',
    ],
    [
      'Mezcla la mostaza, el caldo disuelto, el vinagre, el agua y el aceite.',
      'Embadurna el pollo por dentro y por fuera. Marina al menos 3 horas (mejor toda la noche) siempre en el refrigerador, nunca a temperatura ambiente.',
      'Precalienta el horno a 200 °C.',
      'Hornea 1 hora a 1 hora 15 min, bañándolo con su jugo cada 20 min.',
      'Deja reposar 10 min antes de cortar.',
    ],
    'El vinagre y la mostaza ayudan a que la piel quede dorada y crujiente.',
    [
      { error: 'Piel pálida y blanda', solucion: 'Hornear el pollo húmedo o a temperatura muy baja. Seca muy bien el pollo y hornea a temperatura alta (200°C) los primeros minutos.' },
      { error: 'Pechuga seca', solucion: 'El tiempo de cocción es excesivo. Cubre las pechugas con papel aluminio a mitad de cocción para que no se sequen.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 3 meses (desmenuzado o en porciones).', recalentar: 'Horno o freidora de aire a 180°C por 10 minutos para que la piel recupere textura.' }
  ),

  /* 29. Carne al jugo con puré */
  r('Carne al jugo con puré', 'principales',
    ['carne', 'olla', 'plato principal', 'pure', 'guiso', 'vacuno'],
    'img/carne-al-jugo-con-pure.jpg', '1 h 30 min', '4 personas', 'fácil', 'Olla',
    [
      'Carne: 1 kg de tapapecho o posta en trozos',
      'Carne: 1 cebolla en pluma, 2 dientes de ajo',
      'Carne: 1 zanahoria, 1 pimentón',
      'Carne: Sal, pimienta, orégano, comino y laurel',
      'Carne: Agua o caldo para cubrir',
      'Puré: 6 papas medianas',
      'Puré: 3 cdas de mantequilla',
      'Puré: ½ taza de leche',
      'Puré: Sal',
    ],
    [
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón.',
      'Agrega la carne y dórala. Condimenta.',
      'Cubre con agua o caldo y cocina a fuego lento hasta que la carne esté blanda (1 hora aprox.).',
      'Cuece las papas, mójalas con mantequilla, leche y sal hasta obtener un puré cremoso.',
      'Sirve la carne con su jugo sobre el puré.',
    ],
    'Si el jugo está muy líquido, déjalo reducir unos minutos.',
    [
      { error: 'Carne dura', solucion: 'Usar un corte inadecuado o no cocinar el tiempo suficiente. Usa tapapecho, asiento o posta y cocina lento por 1 a 1.5 horas.' },
      { error: 'Puré con grumos', solucion: 'Batir las papas calientes con leche fría. Usa leche tibia y mantequilla a temperatura ambiente.' },
    ],
    { refrigerador: 'Hasta 3 días por separado (carne y puré).', congelador: 'La carne hasta 2 meses. El puré no se recomienda congelar.', recalentar: 'La carne a fuego lento. El puré en microondas con un poco de leche.' }
  ),

  /* 30. Pajaritos dulces */
  r('Pajaritos dulces', 'dulces',
    ['pan', 'dulce', 'horno', 'merienda', 'once', 'masa'],
    'img/Pajaritos-dulces.jpg', '1 h', '12 unidades', 'media', 'Horno',
    [
      'Masa: 500 g de harina',
      'Masa: 3 huevos',
      'Masa: 50 g de mantequilla',
      'Masa: 120 g de azúcar',
      'Masa: 15 g de levadura',
      'Masa: Ralladura de limón o naranja',
      'Masa: 100 ml de agua o leche tibia',
      'Merengue: 2 claras de huevo',
      'Merengue: 1 taza de azúcar flor',
      'Merengue: Vainilla y chispas de colores (opcional)',
    ],
    [
      'Activa la levadura en el agua tibia con una cucharada de azúcar.',
      'Mezcla la harina con los huevos, mantequilla, azúcar y ralladura. Agrega la levadura y forma una masa suave.',
      'Deja reposar tapada hasta que doble su volumen.',
      'Forma bolitas de unos 70 g, colócalas en una bandeja engrasada y deja levar 30 min más.',
      'Hornea a 180 °C por 25-30 min. Deja enfriar.',
      'Bate las claras a nieve, añade el azúcar flor y la vainilla. Cubre los pancitos con el merengue y decora.',
    ],
    'El nombre viene de la forma de pajarito que toma el merengue al decorarlos.',
    [
      { error: 'Merengue que llora (suelta agua)', solucion: 'Colocar el merengue en un ambiente húmedo o usar claras muy frías. Usa claras a temperatura ambiente y asegúrate de que la masa esté 100% fría.' },
      { error: 'Masa cruda en el centro', solucion: 'Hornear a temperatura muy alta. Hornea a fuego medio (180°C) para que se cocine por dentro sin quemarse.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días. En frío el merengue se humedece.', congelador: 'No recomendado, el merengue se estropea.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 31. Chilenitos */
  r('Chilenitos', 'dulces',
    ['dulce', 'postre', 'horno', 'manjar', 'tradicional', 'once'],
    'img/chilenitos.jpg', '50 min', '20 unidades', 'media', 'Horno',
    [
      'Masa: 3 tazas de harina sin polvos de hornear',
      'Masa: 4 yemas de huevo',
      'Masa: 2 cdas de mantequilla derretida',
      'Masa: 2 cdas de vinagre de vino blanco',
      'Masa: ½ taza de agua, pizca de sal',
      'Relleno: 400 g de manjar',
      'Relleno: 2 claras, 1 taza de azúcar granulada, ½ taza de azúcar flor',
      'Relleno: 1 cdta de jugo de limón',
    ],
    [
      'Mezcla harina y sal. Agrega yemas, mantequilla y vinagre. Añade agua hasta formar una masa suave. Reposa 20 min.',
      'Estira la masa muy fina (2 mm) y corta círculos de 7 cm. Pincha con tenedor.',
      'Hornea a 180 °C por 8-10 min. Enfría.',
      'Prepara un merengue a baño María con las claras, azúcar granulada y limón.',
      'Arma los chilenitos con una capa de manjar entre dos masas y cubre con merengue.',
      'Espolvorea azúcar flor.',
    ],
    'La masa debe quedar muy delgada; si queda gruesa, pierde su textura crujiente.',
    [
      { error: 'Masa blanda o elástica', solucion: 'Amasar demasiado la masa. Mezcla solo hasta integrar. Si la amasas mucho, se encoge en el horno.' },
      { error: 'Se desarman al rellenar', solucion: 'El merengue o la masa no están firmes. Arma los chilenitos cuando las tapas estén completamente frías.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días. En frío el merengue se humedece.', congelador: 'No recomendado, el merengue se estropea.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 32. Empolvados */
  r('Empolvados', 'dulces',
    ['dulce', 'postre', 'horno', 'manjar', 'once'],
    'img/empolvados.png', '40 min', '20 unidades', 'media', 'Horno',
    [
      '3 huevos a temperatura ambiente',
      'Pizca de sal',
      '120 g de azúcar flor',
      '120 g de harina cernida',
      '½ kg de manjar para rellenar',
      'Azúcar flor para espolvorear',
    ],
    [
      'Precalienta el horno a 180 °C. Separa claras y yemas.',
      'Bate las claras con la sal y añade el azúcar en partes hasta obtener un merengue firme.',
      'Incorpora las yemas una a una batiendo poco.',
      'Añade la harina con movimientos envolventes.',
      'Forma copos de 5 cm en una bandeja con papel mantequilla.',
      'Hornea 10-12 min. Enfría, rellena con manjar y espolvorea azúcar flor.',
    ],
    'No batas demasiado después de agregar la harina; perderás el aire y quedarán planos.',
    [
      { error: 'Quedan planos (sin volumen)', solucion: 'Batir mal las claras o incorporar la harina bruscamente. Bate a punto de nieve firme y usa movimientos envolventes.' },
      { error: 'Se pegan al papel', solucion: 'No usar papel mantequilla. Usa siempre papel de horno, no engrases la bandeja.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético, separados por papel.', congelador: 'No recomendado, el merengue se humedece.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 33. Colegial */
  r('Colegial', 'dulces',
    ['dulce', 'postre', 'horno', 'pan', 'reposteria'],
    'img/colegial-budin-de-pan.jpg', '1 h 30 min', '6 personas', 'fácil', 'Horno',
    [
      '4 marraquetas o 500 g de pan duro',
      '2 tazas de leche',
      '1 taza de azúcar',
      '3 huevos',
      '1 cdta de esencia de vainilla',
      '1 manzana en láminas finas',
      '½ taza de pasas (opcional)',
      'Mantequilla para engrasar',
    ],
    [
      'Desmenuza el pan y remójalo en la leche caliente 15-20 min.',
      'Bate los huevos con el azúcar y la vainilla.',
      'Mezcla con el pan remojado, la manzana y las pasas.',
      'Vierte en un molde engrasado y hornea a 180 °C por 45-50 min.',
      'Deja enfriar y espolvorea azúcar flor o leche condensada.',
    ],
    'Es la receta perfecta para aprovechar el pan de días anteriores.',
    [
      { error: 'Queda seco como una piedra', solucion: 'No usar suficiente líquido o hornearlo sin protección. Pon un recipiente con agua en el horno para generar vapor y cubre con aluminio a mitad de horneado.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses en porciones.', recalentar: 'En horno a 180°C por 10 minutos, o en microondas con un poco de leche.' }
  ),

  /* 34. Empanadas de pera */
  r('Empanadas de pera', 'dulces',
    ['dulce', 'empanada', 'horno', 'postre', 'pera'],
    'img/empanadas-de-pera.jpg', '1 h + remojo', '12 unidades', 'media', 'Horno',
    [
      'Relleno: 300 g de peras secas, remojadas desde la noche anterior',
      'Relleno: 300 g de azúcar',
      'Relleno: Clavos de olor y canela en palo',
      'Masa: 3 tazas de harina',
      'Masa: 5 yemas de huevo',
      'Masa: 4 cdas de manteca vegetal tibia',
      'Masa: Leche necesaria',
    ],
    [
      'Cocina las peras molidas con el azúcar, el líquido del remojo, clavos y canela hasta que espese. Enfría.',
      'Forma la masa con harina, yemas, manteca y leche. Amasa hasta que quede elástica.',
      'Estira fina y corta círculos.',
      'Rellena con el dulce de pera y sella los bordes.',
      'Hornea a 180 °C por 15-20 min.',
    ],
    'Son típicas del centro-sur de Chile y se sirven tibias o frías.',
    [
      { error: 'El relleno se sale o queda aguado', solucion: 'Usar el relleno caliente al armar. El dulce de pera debe estar completamente frío y espeso antes de rellenar.' },
      { error: 'Masa dura', solucion: 'No dejar reposar la masa. Debe reposar en frío al menos 30 minutos antes de estirarla.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses (crudas o cocidas).', recalentar: 'Horno o freidora de aire a 180°C por 5-8 minutos.' }
  ),

  /* 35. Valdiviano */
  r('Valdiviano', 'sopas',
    ['sopa', 'charqui', 'olla', 'invierno', 'plato principal'],
    null, '40 min', '4 personas', 'fácil', 'Olla',
    [
      '300 g de charqui',
      '4 papas grandes en cubos',
      '2 zanahorias en rodajas',
      '1 cebolla picada, 2 ajos, ½ pimentón rojo',
      '1 tomate picado',
      'Laurel, tomillo, merkén',
      '1 L de agua, 1 caldo en tableta, 2 cdas de aceite',
    ],
    [
      'Sofríe cebolla, ajo y pimentón hasta dorar.',
      'Agrega el tomate y el charqui desmenuzado. Cocina unos minutos.',
      'Vierte el agua con el caldo, laurel y tomillo. Lleva a ebullición.',
      'Incorpora las papas y zanahorias. Cocina 20-30 min hasta que estén tiernas.',
      'Sirve caliente.',
    ],
    'El charqui es carne seca y salada; si no lo encuentras, puedes usar carne ahumada.',
    [
      { error: 'Plato excesivamente salado', solucion: 'El charqui es muy salado. Remójalo en agua fría la noche anterior o hiérvelo un par de veces botando el agua. Prueba la sal al final.' },
      { error: 'Papas deshechas', solucion: 'Agrega las papas en cubos medianos al final y cocínalas por 15-20 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento en una olla con un poco de agua.' }
  ),

  /* 36. Porotos con riendas */
  r('Porotos con riendas', 'principales',
    ['porotos', 'pasta', 'olla', 'plato principal', 'tradicional'],
    'img/porotos-con-riendas.JPG', '50 min + remojo', '6 personas', 'fácil', 'Olla',
    [
      '500 g de porotos secos (pueden ser pinto, blanco o burro)',
      '300 g de zapallo camote en cubos',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 longaniza en rodajas (opcional, pero tradicional)',
      '1/2 paquete de tallarines o spaghetti',
      '1 cucharadita de orégano',
      '1/2 cucharadita de comino',
      '1 cucharadita de ají de color',
      'Sal y pimienta al gusto',
      'Aceite para el sofrito',
    ],
    [
      'La noche anterior, deja los porotos remojando en abundante agua fría. Al día siguiente, escúrrelos y enjuágalos.',
      'En una olla grande, pon los porotos con agua fresca que los cubra por unos 3 dedos. Agrega el zapallo en cubos y cocina a fuego medio hasta que los porotos estén blandos (unos 30-40 minutos).',
      'Mientras se cocinan los porotos, prepara el sofrito: en una sartén con un poco de aceite, sofríe la cebolla, el ajo y la longaniza hasta que doren. Agrega el orégano, comino y ají de color, y revuelve un minuto más.',
      'Incorpora el sofrito a la olla de porotos y mezcla bien. Ajusta la sal y pimienta.',
      'Agrega los tallarines (puedes partirlos por la mitad para que sean más fáciles de comer) y cocina por 8 a 10 minutos más, hasta que los fideos estén al dente y el caldo haya espesado.',
      'Sirve bien caliente en platos hondos, con un chorrito de aceite crudo por encima si te gusta.',
    ],
    'Según la tradición popular, el nombre "riendas" viene del campo chileno: antiguamente se usaban tiras de cuero de cerdo que, al cocinarse, parecían las riendas de los caballos. Con el tiempo, la ciudad las reemplazó por tallarines, pero el nombre se mantuvo.',
    [
      { error: 'Porotos duros', solucion: 'Agregar sal o ingredientes ácidos al principio. Cocina los porotos en agua sola y agrega la sal al final. (Tip extra: el bicarbonato ablanda, pero cambia el sabor).' },
      { error: 'Fideos pasados', solucion: 'Agregar los tallarines y dejarlos hervir mucho tiempo. Agrégalos en los últimos 8-10 minutos de cocción.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses. Los fideos pueden ablandarse un poco al descongelar.', recalentar: 'A fuego lento con un poco de agua.' }
  ),

  /* 37. Carbonada */
  r('Carbonada', 'principales',
    ['guiso', 'olla', 'carne', 'verduras', 'plato principal', 'invierno'],
    'img/Carbonada.JPG', '50 min', '6 personas', 'fácil', 'Olla',
    [
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
      'Sal, pimienta, orégano, comino y ají de color',
    ],
    [
      'Calienta el aceite en una olla grande. Agrega la carne y séllala hasta que dore por todos lados.',
      'Incorpora la cebolla, el pimentón y los condimentos (ají de color, orégano, comino, sal y pimienta). Sofríe por 5 minutos.',
      'Vierte el agua o caldo caliente, tapa y cocina a fuego medio por 20 minutos.',
      'Agrega las papas, la zanahoria, el zapallo y el choclo. Cocina por 15 minutos más.',
      'Añade el arroz y cocina hasta que los granos estén tiernos y las verduras blandas (unos 15 minutos).',
      'Rectifica la sal y sirve caliente en platos hondos.',
    ],
    'La carbonada es un guiso de invierno por excelencia. Su nombre proviene de "carbón", porque antiguamente se cocinaba en ollas de barro sobre brasas.',
    [
      { error: 'Queda como una sopa líquida', solucion: 'No espesar el guiso. Cuando el zapallo esté blando, aplasta 3 o 4 trozos con el cucharón y revuelve.' },
      { error: 'Sabor avinagrado o extraño', solucion: 'El choclo o el vino utilizado no son de buena calidad. Usa ingredientes frescos y vino de buena calidad.' },
      { error: 'Carne dura', solucion: 'No cocinar el tiempo suficiente a fuego lento. Cocina por al menos 40-50 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses (idealmente sin papas).', recalentar: 'A fuego lento con un poco de caldo.' }
  ),

  /* 38. Chorrillana */
  r('Chorrillana', 'principales',
    ['picoteo', 'carne', 'papas fritas', 'huevo', 'compartir', 'plato principal'],
    'img/chorrillana.jpg', '40 min', '3 a 4 personas', 'fácil', 'Sartén',
    [
      '800 g de papas cortadas en bastones (para freír)',
      '400 g de posta negra o lomo cortado en tiras finas',
      '2 cebollas cortadas en pluma',
      '2 huevos',
      'Aceite para freír',
      'Sal y pimienta al gusto',
      'Salsa de tomate o ketchup (opcional)',
    ],
    [
      'Fríe las papas en abundante aceite caliente hasta que estén doradas y crujientes. Escurre sobre papel absorbente y reserva.',
      'En una sartén grande, sofríe la cebolla en un poco de aceite hasta que esté transparente y ligeramente dorada. Retira y reserva.',
      'En la misma sartén, sube el fuego y saltea la carne en tiras con sal y pimienta hasta que esté cocida y dorada.',
      'Para montar, coloca las papas fritas en la base de una fuente grande o sartén. Encima distribuye la carne y luego la cebolla sofrita.',
      'Fríe los huevos y colócalos encima de la preparación. Sirve inmediatamente para compartir.',
    ],
    'El nombre "chorrillana" proviene del barrio de Chorrillos en Valparaíso, donde se dice que nació este plato en la década de 1970.',
    [
      { error: 'Papas blandas', solucion: 'No secar bien las papas antes de freír. Lávalas y sécalas muy bien con un paño para que queden crujientes.' },
      { error: 'Carne dura', solucion: 'Cocinar la carne en tiras por demasiado tiempo. Saltéalos a fuego muy alto y por poco tiempo para que queden jugosos.' },
    ],
    { refrigerador: 'No recomendado, las papas se ablandan y el huevo se estropea.', congelador: 'No recomendado.', recalentar: 'Se consume recién hecha.' }
  ),

  /* 39. Bistec a lo pobre */
  r('Bistec a lo pobre', 'principales',
    ['carne', 'papas fritas', 'huevo', 'sarten', 'plato principal'],
    'img/Bistec-a-lo-pobre.jpg', '40 min', '2 personas', 'fácil', 'Sartén',
    [
      '2 bistecs de lomo liso o vetado (aprox. 200 g cada uno)',
      '3 papas medianas cortadas en bastones',
      '1 cebolla grande cortada en pluma',
      '2 huevos',
      'Aceite para freír',
      '1 diente de ajo picado',
      'Sal y pimienta al gusto',
    ],
    [
      'Sazona los bistecs con sal, pimienta y ajo. Déjalos reposar mientras preparas el resto.',
      'Fríe las papas en bastones en abundante aceite caliente hasta que estén doradas. Escurre y reserva.',
      'En una sartén, sofríe la cebolla en un poco de aceite hasta que esté caramelizada. Retira y reserva.',
      'En la misma sartén, sube el fuego y cocina los bistecs a la plancha o sartén por 2-3 minutos por lado, o hasta el punto deseado.',
      'Fríe los huevos (uno por persona).',
      'Para servir, coloca el bistec en el plato, cúbrelo con la cebolla y acompaña con las papas fritas y el huevo frito encima.',
    ],
    'Existen varias versiones sobre el origen del nombre "a lo pobre". La más difundida es que la carne se sirve con una guarnición sencilla y abundante (papas, cebolla y huevo) que en otros tiempos era considerada "pobre" frente a la carne.',
    [
      { error: 'Carne seca y dura', solucion: 'Poner la carne directo del refrigerador a la sartén. Saca los bistecs 20 minutos antes para que estén a temperatura ambiente.' },
      { error: 'Papas y carne frías', solucion: 'No coordinar los tiempos. Fríe las papas primero y mantenlas calientes en el horno, luego cocina la carne y por último los huevos.' },
    ],
    { refrigerador: 'No recomendado, se pierde la textura de las papas y el huevo.', congelador: 'No recomendado.', recalentar: 'Se consume recién hecho.' }
  ),

  /* 40. Salchipapas */
  r('Salchipapas', 'principales',
    ['picoteo', 'papas fritas', 'salchicha', 'fritura', 'compartir', 'plato principal'],
    'img/salchipapas.jpg', '25 min', '4 personas', 'muy fácil', 'Fritura',
    [
      '4 papas grandes cortadas en bastones',
      '6 salchichas de buena calidad',
      'Aceite para freír',
      'Ketchup, mayonesa o mostaza al gusto',
    ],
    [
      'Pela y corta las papas en bastones. Lava bien para quitar el almidón y sécalas.',
      'Fríe las papas en abundante aceite caliente hasta que estén doradas y crujientes. Escurre y sala al gusto.',
      'Corta las salchichas en rodajas o en trozos y fríelas en una sartén hasta que estén doradas.',
      'Mezcla las papas fritas con las salchichas o sirve las salchichas encima de las papas.',
      'Acompaña con tus salsas favoritas.',
    ],
    'Es el plato favorito de los niños y también un clásico de las picadas chilenas. Puedes agregar queso derretido encima para una versión aún más contundente.',
    [
      { error: 'Papas blandas o grasosas', solucion: 'Freír a temperatura muy baja. Haz doble fritura: una a fuego medio para cocinarlas y otra a fuego alto antes de servir para que doren.' },
      { error: 'Salchichas insípidas', solucion: 'Hervirlas o freírlas enteras. Córtalas en rodajas y sofríelas con un poquito de cebolla hasta que estén doradas por los bordes.' },
    ],
    { refrigerador: 'No recomendado, las papas se ablandan.', congelador: 'No recomendado.', recalentar: 'Se consume recién hecha.' }
  ),

  /* 41. Carne mechada */
  r('Carne mechada', 'principales',
    ['carne', 'olla', 'plato principal', 'sandwich', 'guiso', 'vacuno'],
    'img/carne-mechada.jpg', '2 h 30 min', '4 a 6 personas', 'media', 'Olla',
    [
      '1 kg de posta negra o pollo ganso (corte para mechar)',
      '1 zanahoria grande en bastones',
      '2 cebollas cortadas en pluma',
      '2 dientes de ajo',
      '1 pimentón rojo en tiras',
      '1 taza de vino tinto (opcional)',
      '1 taza de caldo de carne',
      'Aceite, sal, pimienta, orégano y comino',
    ],
    [
      'Sazona la carne con sal, pimienta y comino. En una olla grande, sella la carne en aceite caliente hasta que dore por todos lados.',
      'Agrega la cebolla, el ajo y el pimentón. Sofríe por unos minutos.',
      'Incorpora el vino tinto (si usas) y deja evaporar un poco. Luego agrega el caldo de carne y los bastones de zanahoria.',
      'Tapa la olla y cocina a fuego lento por 2 horas, hasta que la carne se deshaga fácilmente con un tenedor.',
      'Retira la carne, desmenúzala con dos tenedores y devuélvela a la olla para que se mezcle con la salsa.',
      'Sirve con puré, arroz o en un sándwich.',
    ],
    'La carne mechada es la base del clásico sándwich chileno "barros luco" (con queso) o "barros jarpa". Aprovecha la salsa para humedecer el pan.',
    [
      { error: 'Carne seca y dura', solucion: 'Elegir un corte demasiado magro o cocinar a fuego fuerte. Usa posta negra o pollo ganso y cocina a fuego muy lento por 2 horas.' },
      { error: 'Deshebrar mal la carne', solucion: 'Picarla con cuchillo en lugar de deshebrarla con tenedores. Usa dos tenedores para separar las fibras en hebras largas.' },
      { error: 'Carne nadando en salsa', solucion: 'Agregar demasiado líquido durante la cocción. Agrega solo el líquido justo para cubrir la mitad de la carne.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 3 meses en porciones con un poco de salsa.', recalentar: 'En olla a fuego lento con su salsa, o en microondas con un poco de caldo.' }
  ),

  /* 42. Machas a la parmesana */
  r('Machas a la parmesana', 'principales',
    ['marisco', 'horno', 'entrada', 'queso', 'picoteo'],
    'img/Machas-a-la-parmesana.jpg', '20 min', '4 personas (como entrada)', 'fácil', 'Horno',
    [
      '20 machas frescas con sus conchas (o 1 lata de machas al natural)',
      '100 g de queso parmesano rallado',
      '50 g de mantequilla',
      '1/2 taza de vino blanco seco',
      'Jugo de 1/2 limón',
      'Pimienta negra al gusto',
      'Sal (si es necesario)',
    ],
    [
      'Si usas machas frescas, lávalas bien y ábrelas. Reserva la carne y las conchas. Precalienta el horno a 180 °C.',
      'Coloca las conchas de macha en una bandeja para horno. Si usas machas en conserva, colócalas en conchas o en pailas de greda.',
      'Pon una macha (o un trozo) en cada concha. Rocía con un poco de vino blanco y jugo de limón, y añade una nuez de mantequilla sobre cada una.',
      'Cubre generosamente con queso parmesano rallado y un toque de pimienta negra.',
      'Hornea por 5 a 8 minutos, hasta que el queso esté derretido y ligeramente dorado. Sirve inmediatamente.',
    ],
    'La macha es un marisco típico de las costas chileno-peruanas. Su sabor es dulce y salino, por lo que el queso parmesano realza su sabor sin opacarlo.',
    [
      { error: 'Textura chiclosa (como chicle)', solucion: 'No aplastar la lengua de la macha antes de cocinarla. Aplánala suavemente con el dorso de un cuchillo antes de ponerla en la fuente.' },
      { error: 'Sabor a arena', solucion: 'No limpiar bien las machas. Lávalas bajo el chorro de agua fría y golpéalas suavemente para que boten la arena.' },
      { error: 'Queso quemado y machas recocidas', solucion: 'Hornear por demasiado tiempo o a temperatura muy baja. Usa la función calor envolvente a temperatura alta.' },
    ],
    { refrigerador: 'Hasta 2 días. Consumir idealmente al momento.', congelador: 'Hasta 1 mes (solo la carne de la macha, sin el queso).', recalentar: 'Horno a 180°C por 3-5 minutos, solo hasta que el queso se derrita.' }
  ),

  /* 43. Locos con mayonesa */
  r('Locos con mayonesa', 'principales',
    ['marisco', 'frio', 'entrada', 'mayonesa', 'picoteo'],
    'img/Locos-con-mayonesa.jpg', '1 h 15 min', '4 personas', 'media', 'Olla',
    [
      '4 locos frescos (o 1 lata de locos)',
      '1 taza de mayonesa casera o de buen calidad',
      '1/2 cebolla morada picada en cubos muy pequeños',
      '1 cucharada de cilantro fresco picado',
      'Jugo de 1 limón',
      'Sal y pimienta al gusto',
      'Lechuga para acompañar',
    ],
    [
      'Si usas locos frescos, lávalos y cocínalos en agua hirviendo con sal por 40-50 minutos, hasta que estén tiernos. Deja enfriar en el agua de cocción.',
      'Retira los locos, córtalos en rodajas o trozos y reserva.',
      'En un bol, mezcla la mayonesa con la cebolla morada, el cilantro y el jugo de limón. Salpimenta al gusto.',
      'Sirve los locos sobre una cama de lechuga y cúbrelos con la mayonesa preparada.',
      'También puedes mezclar los locos directamente con la salsa y servir como cóctel.',
    ],
    'El loco es un caracol marino muy preciado en Chile. Se suele servir en ocasiones especiales como fiestas patrias o celebraciones familiares.',
    [
      { error: 'Locos duros (como caucho)', solucion: 'Cocinar los locos por mucho tiempo o a fuego fuerte. Cocínalos por no más de 40-45 minutos y déjalos enfriar en su propio caldo.' },
      { error: 'Mayonesa aguada', solucion: 'Usar una mayonesa muy líquida o no escurrir bien la cebolla. Usa mayonesa espesa y escurre la cebolla morada antes de mezclar.' },
    ],
    { refrigerador: 'Hasta 2 días. Se recomienda consumir el mismo día.', congelador: 'No recomendado, la mayonesa se corta.', recalentar: 'Se consume bien frío.' }
  ),

  /* 44. Paila marina */
  r('Paila marina', 'sopas',
    ['marisco', 'pescado', 'sopa', 'olla', 'caldo'],
    'img/Paila-Marina.jpg', '45 min', '4 personas', 'media', 'Olla',
    [
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
      'Aceite, sal, pimienta, ají de color y orégano',
    ],
    [
      'En una olla grande, sofríe la cebolla, el ajo y el pimentón en aceite hasta que estén transparentes.',
      'Agrega el tomate, el ají de color, orégano, sal y pimienta. Cocina por 5 minutos.',
      'Vierte el vino blanco y el caldo de pescado. Lleva a ebullición.',
      'Incorpora los choritos y las almejas. Tapa y cocina hasta que se abran (unos 5 minutos).',
      'Agrega los trozos de pescado y los camarones. Cocina por 5-7 minutos más, hasta que el pescado esté cocido.',
      'Rectifica la sal y sirve caliente en platos hondos o en una paila de greda.',
    ],
    'La paila marina se sirve tradicionalmente en una paila de greda, que mantiene el calor por más tiempo. Es ideal para compartir en invierno.',
    [
      { error: 'Mariscos gomosos y duros', solucion: 'Cocinar los mariscos por demasiado tiempo. Agrega los mariscos en etapas y cocina el pescado y camarones en los últimos 3-5 minutos.' },
      { error: 'Caldo soso o sin brillo', solucion: 'Usar un vino de mala calidad o no lavar bien los mariscos. Usa un vino que te guste tomar y lava muy bien los mariscos con concha.' },
      { error: 'Mariscos congelados y gomosos', solucion: 'No descongelarlos correctamente. Descongela en el refrigerador la noche anterior.' },
    ],
    { refrigerador: 'Hasta 2 días máximo. Al ser mariscos, es muy perecedero.', congelador: 'Hasta 2 meses (idealmente sin papas).', recalentar: 'A fuego muy suave, evitando hervir para que los mariscos no se endurezcan.' }
  ),

  /* 45. Pescado frito — tags ampliados: merluza, reineta, congrio */
  r('Pescado frito', 'principales',
    ['pescado', 'fritura', 'plato principal', 'sarten', 'merluza', 'reineta', 'congrio'],
    'img/pescado-frito.jpg', '30 min', '4 personas', 'fácil', 'Fritura',
    [
      '4 filetes de pescado blanco (merluza, reineta o congrio)',
      '1 taza de harina',
      '1 cucharadita de polvos de hornear',
      '1 huevo',
      '1/2 taza de agua o cerveza fría',
      'Sal, pimienta y orégano al gusto',
      'Aceite para freír',
      'Limón para servir',
    ],
    [
      'Sazona los filetes de pescado con sal, pimienta y orégano. Déjalos reposar por 10 minutos.',
      'Prepara la mezcla del rebozado: en un bol, mezcla la harina, los polvos de hornear, el huevo y el agua o cerveza hasta obtener una consistencia espesa pero fluida.',
      'Calienta abundante aceite en una sartén honda o freidora a unos 180 °C.',
      'Pasa cada filete por la mezcla, dejando que escurra el exceso, y fríe en el aceite caliente por 3-4 minutos por lado, hasta que estén dorados y crujientes.',
      'Escurre sobre papel absorbente y sirve con rodajas de limón y ensalada a la chilena.',
    ],
    'La cerveza fría en el rebozado le da una textura extra crujiente al pescado frito. Es un secreto de cocina muy popular.',
    [
      { error: 'Rebozado que se cae o queda grasoso', solucion: 'El pescado está muy húmedo o el aceite no está caliente. Seca los filetes con papel absorbente y asegúrate de que el aceite esté a 180°C.' },
      { error: 'Pescado crudo por dentro y quemado por fuera', solucion: 'Fuego demasiado alto. Regula el fuego a medio para que el pescado se cocine por dentro sin quemarse.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, el rebozado pierde textura.', recalentar: 'Horno o freidora de aire a 180°C por 5-8 minutos para recuperar la crocancia.' }
  ),

  /* 46. Corvina al horno */
  r('Corvina al horno', 'principales',
    ['pescado', 'horno', 'plato principal', 'sano'],
    'img/Corvina-al-horno.jpg', '40 min', '2 personas', 'fácil', 'Horno',
    [
      '2 filetes de corvina (o lubina) de unos 200 g cada uno',
      '1 cebolla en rodajas',
      '1 tomate en rodajas',
      '2 dientes de ajo laminados',
      '1/2 taza de vino blanco',
      '2 cucharadas de aceite de oliva',
      'Sal, pimienta y tomillo al gusto',
      'Rodajas de limón',
    ],
    [
      'Precalienta el horno a 180 °C.',
      'En una fuente para horno, coloca una base de cebolla y tomate en rodajas. Coloca los filetes de corvina encima.',
      'Sazona con sal, pimienta y tomillo. Distribuye el ajo laminado sobre el pescado.',
      'Rocía con el vino blanco y el aceite de oliva. Coloca unas rodajas de limón encima.',
      'Hornea por 20-25 minutos, hasta que el pescado esté cocido y se desmenuce fácilmente con un tenedor.',
      'Sirve con papas cocidas o arroz.',
    ],
    'La corvina es un pescado muy versátil. Al hornearla con vino blanco y limón, su carne se mantiene jugosa y absorbe todos los sabores.',
    [
      { error: 'Pescado seco', solucion: 'Hornearlo por demasiado tiempo. Los filetes se cocinan rápido. Con 15-20 minutos a 180°C es suficiente.' },
      { error: 'Se pega al papel o a la fuente', solucion: 'No usar suficiente base grasa. Usa una base de cebolla y tomate o rocía bien el fondo con aceite de oliva.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 1 mes.', recalentar: 'Horno a 150°C por 10 minutos, con un poco de mantequilla o limón para que no se seque.' }
  ),

  /* 47. Salmón al horno */
  r('Salmón al horno', 'principales',
    ['pescado', 'horno', 'plato principal', 'sano'],
    'img/Salmón-al-Horno.JPG', '25 min', '2 personas', 'muy fácil', 'Horno',
    [
      '2 filetes de salmón fresco (aprox. 200 g cada uno)',
      '2 cucharadas de aceite de oliva',
      'Jugo de 1 limón',
      '2 dientes de ajo picados',
      'Sal y pimienta al gusto',
      'Perejil fresco picado',
      'Rodajas de limón',
    ],
    [
      'Precalienta el horno a 200 °C. Forra una bandeja con papel de horno.',
      'Coloca los filetes de salmón en la bandeja. Sazona con sal, pimienta y ajo picado.',
      'Rocía con el aceite de oliva y el jugo de limón. Coloca rodajas de limón encima.',
      'Hornea por 12-15 minutos, dependiendo del grosor del filete, hasta que el salmón esté cocido pero aún jugoso.',
      'Espolvorea con perejil fresco y sirve con ensalada o papas al horno.',
    ],
    'El salmón chileno es famoso por su calidad. No necesitas muchos ingredientes para que quede delicioso; el limón y el ajo son suficientes.',
    [
      { error: 'Salmón se deshace o queda seco', solucion: 'Cocinar más de 12-15 minutos. El salmón no necesita mucho tiempo y debe quedar rosado por dentro.' },
      { error: 'Sabor demasiado fuerte', solucion: 'No usar ácido (limón). Rocía generosamente con jugo de limón antes de hornear para equilibrar el sabor.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'Horno a 150°C por 10 minutos o microondas con cuidado para que no se seque.' }
  ),

  /* 48. Salsa americana */
  r('Salsa americana', 'ensaladas',
    ['salsa', 'picoteo', 'acompañamiento', 'frio'],
    null, '15 min', '1 taza', 'muy fácil', 'Sin cocción',
    [
      '6 cebollitas perla encurtidas',
      '2 zanahorias encurtidas en rodajas',
      '2 pepinillos encurtidos',
      '1/2 taza de mayonesa',
      '1 cucharada de ketchup',
      '1 cucharadita de mostaza',
      'Sal y pimienta al gusto',
    ],
    [
      'Escurre bien las cebollitas, las zanahorias y los pepinillos. Pícalos en trozos muy pequeños.',
      'En un bol, mezcla la mayonesa, el ketchup y la mostaza hasta integrar.',
      'Incorpora los encurtidos picados y mezcla bien. Salpimenta al gusto.',
      'Refrigera por al menos 30 minutos para que los sabores se mezclen antes de servir.',
      'Sirve como acompañamiento de carnes, papas fritas o completos.',
    ],
    'A pesar de su nombre, la salsa americana es un clásico chileno. Se usa mucho en las hamburguesas y completos para darles un toque ácido y crujiente.',
    [
      { error: 'Salsa aguada o con trozos muy grandes', solucion: 'No escurrir bien los encurtidos o picarlos de forma irregular. Escúrrelos perfectamente y pícalos en cubos milimétricos.' },
      { error: 'Sabor desequilibrado', solucion: 'Abusar del ketchup o la mostaza. La base es la mayonesa; el ketchup y la mostaza se agregan solo para dar un toque de color y acidez.' },
    ],
    { refrigerador: 'Hasta 3 días en frasco de vidrio cerrado.', congelador: 'No recomendado, la mayonesa se corta.', recalentar: 'Se consume fría.' }
  ),

  /* 49. Pebre chileno */
  r('Pebre chileno', 'ensaladas',
    ['salsa', 'picoteo', 'acompañamiento', 'fresco', 'tradicional', 'ensalada'],
    'img/Pebre-chileno.jpg', '15 min', '4 personas', 'muy fácil', 'Sin cocción',
    [
      '1 tomate grande maduro, picado en cubos pequeños',
      '1 cebolla mediana, picada en cubos pequeños',
      '1 diente de ajo picado muy fino',
      '3 cucharadas de perejil fresco picado',
      '3 cucharadas de cilantro fresco picado',
      '1 trozo de ají verde picado (opcional)',
      '2 cucharadas de aceite de oliva',
      '1 cucharada de vinagre de vino tinto',
      'Sal y pimienta al gusto',
    ],
    [
      'Pica todos los ingredientes en cubos muy pequeños y uniformes.',
      'En un bol, mezcla el tomate, la cebolla, el ajo, el perejil, el cilantro y el ají.',
      'Condimenta con el aceite de oliva, el vinagre, la sal y la pimienta. Mezcla bien.',
      'Deja reposar por al menos 15 minutos para que los sabores se integren.',
      'Sirve con pan amasado, marraqueta o como acompañamiento de carnes.',
    ],
    'El pebre es el acompañamiento más popular de la mesa chilena. Se sirve en todas las casas, especialmente en las once y en los asados.',
    [
      { error: 'La cebolla pica demasiado', solucion: 'Si no se trata, su sabor crudo y fuerte opaca al resto. Pícala finamente y déjala en un colador bajo el chorro de agua fría, o remójala en agua con hielo por 10 minutos.' },
      { error: 'Textura aguada (sopa)', solucion: 'Usar procesadora de alimentos o licuadora. Pica todo a cuchillo, con paciencia, en cubos muy pequeños. El pebre debe tener consistencia.' },
      { error: 'Sabor desequilibrado', solucion: 'No ajustar la acidez o el picante. Prueba y ajusta poco a poco el limón (o vinagre) y el ají.' },
    ],
    { refrigerador: 'Hasta 3 días en frasco de vidrio cerrado. Soltará agua, escúrrelo antes de servir.', congelador: 'No recomendado, el tomate y la cebolla pierden textura.', recalentar: 'Se consume frío o a temperatura ambiente.' }
  ),

  /* 50. Marraqueta */
  r('Marraqueta', 'panes',
    ['pan', 'horno', 'masa', 'desayuno', 'once', 'tradicional'],
    null, '2 h 30 min', '4 panes', 'media', 'Horno',
    [
      '1 kg de harina sin polvos de hornear',
      '600 ml de agua a temperatura ambiente',
      '20 g de sal',
      '15 g de levadura granulada',
      '1 cucharadita de azúcar (opcional)',
    ],
    [
      'Disuelve la levadura y el azúcar en un poco de agua tibia. Deja reposar por 15 minutos hasta que espume.',
      'En un bol grande, mezcla la harina con la sal. Agrega la levadura disuelta y el resto del agua. Amasa hasta obtener una masa suave y elástica.',
      'Cubre la masa y deja levar en un lugar cálido por 1 hora, o hasta que doble su volumen.',
      'Divide la masa en 4 porciones. Forma bolas y luego aplánalas ligeramente. Haz un corte profundo en el centro de cada pan.',
      'Coloca los panes en una bandeja enharinada y deja levar por 30 minutos más. Precalienta el horno a 220 °C.',
      'Hornea por 20-25 minutos, hasta que estén dorados y suenen huecos al golpear la base.',
    ],
    'La marraqueta es el pan más consumido en Chile. Su corte característico permite separarla en cuatro "marraquetas" para compartir.',
    [
      { error: 'Pan macizo y pesado', solucion: 'Amasar poco (no se desarrolla el gluten) o usar levadura vencida. Amasa con energía por al menos 10-15 minutos hasta que la masa esté elástica.' },
      { error: 'Se despega o se abre mal el corte', solucion: 'No hacer el corte profundo antes de hornear o enharinar en exceso. Haz el corte justo antes de meter al horno.' },
      { error: 'Horno seco', solucion: 'Coloca una fuente con agua caliente en el horno para generar vapor y que las marraquetas crezcan correctamente.' },
    ],
    { refrigerador: 'Nunca en frío (se endurece). A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'Rocía un poco de agua y hornea a 180°C por 5 minutos.' }
  ),

  /* 51. Hallulla */
  r('Hallulla', 'panes',
    ['pan', 'horno', 'masa', 'desayuno', 'once'],
    'img/hallullas.jpg', '2 h', '6 panes', 'media', 'Horno',
    [
      '500 g de harina',
      '150 ml de leche tibia',
      '10 g de levadura seca',
      '1 1/2 cucharaditas de sal',
      '80 g de manteca vegetal',
      '1 cucharadita de azúcar (opcional)',
    ],
    [
      'Activa la levadura en la leche tibia con el azúcar. Deja reposar por 10 minutos.',
      'Mezcla la harina con la sal. Agrega la levadura con la leche y la manteca. Amasa hasta que la masa esté suave y no se pegue.',
      'Deja levar tapada por 1 hora, hasta que doble su volumen.',
      'Divide la masa en 6 bollos. Estira cada uno en forma de disco plano de aproximadamente 1 cm de grosor.',
      'Coloca en una bandeja engrasada y deja levar por 30 minutos más. Precalienta el horno a 200 °C.',
      'Hornea por 15-20 minutos, hasta que estén doradas. Sirve tibias.',
    ],
    'La hallulla es un pan redondo y plano, ideal para sándwiches. Su textura es más suave y compacta que la marraqueta.',
    [
      { error: 'Pan duro y pesado', solucion: 'Amasado insuficiente o levadura vieja. Amasa con energía por al menos 10 minutos y usa levadura fresca.' },
      { error: 'Se aplana en el horno', solucion: 'No dejar levar lo suficiente antes de hornear. Deja que los discos leven por 30 minutos en un lugar cálido.' },
      { error: 'Horno seco', solucion: 'Coloca una fuente con agua caliente en el horno para mantener la humedad y evitar que el pan se seque.' },
    ],
    { refrigerador: 'Nunca en frío. A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'Rocía un poco de agua y hornea a 180°C por 5 minutos.' }
  ),

  /* 52. Prietas */
  r('Prietas', 'principales',
    ['prieta', 'olla', 'sarten', 'plato principal'],
    'img/prietas.jpg', '1 h 30 min', '4 personas', 'media', 'Olla',
    [
      '4 prietas frescas',
      '1 cebolla picada en pluma',
      '2 dientes de ajo picados',
      '1 hoja de laurel',
      '1 cucharada de orégano',
      'Aceite para freír',
      'Sal y pimienta al gusto',
      'Papas cocidas o puré para acompañar',
    ],
    [
      'Pincha las prietas con un tenedor para que no exploten durante la cocción.',
      'En una olla con agua hirviendo, cocina las prietas por 10-15 minutos con una hoja de laurel. Escurre y corta en rodajas gruesas.',
      'En una sartén con un poco de aceite, sofríe la cebolla y el ajo hasta que estén dorados. Agrega el orégano.',
      'Incorpora las rodajas de prieta y fríelas por unos minutos de cada lado hasta que estén doradas y crujientes por fuera.',
      'Sirve caliente con papas cocidas, puré o ensalada.',
    ],
    'La prieta es un embutido de sangre de cerdo típico de la zona sur de Chile. Se suele consumir en fiestas patrias y en invierno.',
    [
      { error: 'Prietas explotadas', solucion: 'Ponerlas a freír directamente sin cocinarlas previamente o no pincharlas. Hiérvelas primero y pínchalas varias veces.' },
      { error: 'Textura gomosa', solucion: 'Freírlas a fuego muy alto. Fríelas a fuego medio para que se doren por fuera pero mantengan su textura suave.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente ya cocidas.', recalentar: 'En sartén a fuego medio para que recuperen la textura crujiente.' }
  ),

  /* 53. Calzones rotos */
  r('Calzones rotos', 'dulces',
    ['dulce', 'fritura', 'invierno', 'once', 'merienda', 'reposteria'],
    'img/calzones-rotos.JPG', '40 min', '20 unidades', 'fácil', 'Fritura',
    [
      '500 g de harina sin polvos de hornear',
      '150 g de azúcar',
      '100 g de mantequilla o manteca a temperatura ambiente',
      '2 huevos',
      '1 cucharadita de polvos de hornear',
      'Ralladura de 1 limón o naranja',
      '1 cucharadita de esencia de vainilla',
      'Aceite para freír',
      'Azúcar flor para espolvorear',
    ],
    [
      'En un bol grande, bate la mantequilla con el azúcar hasta obtener una crema. Agrega los huevos uno a uno y la vainilla.',
      'Incorpora la harina cernida junto con los polvos de hornear y la ralladura de limón. Mezcla hasta formar una masa suave que no se pegue en las manos.',
      'Envuelve la masa en papel plástico o un paño y déjala reposar en el refrigerador por 30 minutos.',
      'Estira la masa sobre una superficie enharinada hasta que tenga unos 5 mm de grosor. Corta rectángulos de aproximadamente 5x10 cm.',
      'Haz un corte longitudinal en el centro de cada rectángulo y pasa uno de los extremos por el agujero para formar la clásica trenza retorcida.',
      'Calienta abundante aceite a fuego medio (unos 170°C). Fríe los calzones hasta que estén dorados por ambos lados.',
      'Escurre sobre papel absorbente y espolvorea generosamente con azúcar flor mientras aún están tibios.',
    ],
    'Se llaman "rotos" porque justamente tienen una forma irregular y rasgada. Se comen tradicionalmente en las tardes de lluvia con un té caliente.',
    [
      { error: 'Masa dura o elástica', solucion: 'Trabajar demasiado la masa o usar mantequilla fría. Usa mantequilla a temperatura ambiente y mezcla solo hasta integrar.' },
      { error: 'Se desinflan o quedan aceitosos', solucion: 'El aceite no está a la temperatura adecuada (muy frío). Mantén la masa en frío y usa aceite a fuego medio (170°C).' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en recipiente hermético.', congelador: 'Hasta 2 meses en bolsa hermética.', recalentar: 'Horno o freidora de aire a 180°C por 5 minutos.' }
  ),

  /* 54. Brownies con cacao */
  r('Brownies con cacao', 'dulces',
    ['dulce', 'postre', 'horno', 'chocolate', 'reposteria'],
    'img/Brownie-con-cacao.jpg', '45 min', '12 porciones', 'fácil', 'Horno',
    [
      '200 g de chocolate amargo o cobertura (o 100 g de cacao en polvo)',
      '150 g de mantequilla',
      '200 g de azúcar',
      '3 huevos',
      '100 g de harina sin polvos de hornear',
      '1 cucharadita de esencia de vainilla',
      '1 pizca de sal',
      '100 g de nueces picadas (opcional)',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa y enharina un molde cuadrado de unos 20x20 cm.',
      'Derrite la mantequilla junto con el chocolate a baño María o en el microondas (con cuidado de no quemarlo). Si usas cacao en polvo, mézclalo con la mantequilla derretida.',
      'En otro bol, bate los huevos con el azúcar hasta que estén espumosos y hayan duplicado un poco su volumen. Agrega la vainilla.',
      'Incorpora la mezcla de chocolate derretido a los huevos y mezcla suavemente con una espátula.',
      'Agrega la harina cernida con la sal y mezcla con movimientos envolventes solo hasta que no queden grumos. No sobrebatas, o los brownies quedarán duros.',
      'Si usas nueces, incorpóralas ahora. Vierte la mezcla en el molde y alisa la superficie.',
      'Hornea por 20 a 25 minutos. Para saber si están listos, inserta un palillo: debe salir con algunas migas húmedas pegadas (no completamente limpio, así queda húmedo por dentro).',
      'Deja enfriar completamente en el molde antes de cortar en cuadrados.',
    ],
    'Para un brownie extra húmedo y denso, deja el centro un poco crudo. Si prefieres un brownie más tipo queque, hornéalo 5 minutos más.',
    [
      { error: 'Quedan secos como un queque', solucion: 'Sobrebatir la mezcla o hornear de más. Mezcla la harina con espátula solo hasta que desaparezca y hornea solo 20-25 minutos.' },
      { error: 'Se queman por abajo', solucion: 'Usar una bandeja muy oscura o muy fina. Usa un molde de vidrio o metal claro. Si tienes moldes oscuros, baja la temperatura a 170°C.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 3 meses, cortados en cuadrados y bien envueltos.', recalentar: 'Microondas por 15 segundos para que recuperen la textura húmeda y densa.' }
  ),

  /* 55. Terremoto */
  r('Terremoto', 'bebidas',
    ['bebida', 'alcohol', 'pipeño', 'fiestas patrias', 'verano', 'tradicional'],
    null, '5 min', '1 vaso', 'muy fácil', 'Sin cocción',
    [
      'Vino pipeño (o vino blanco dulce joven), bien helado',
      '2 bolas de helado de piña',
      '1 chorrito de granadina (para dar color)',
      'Opcional: 1 chorrito de fernet (versión "con afán")',
    ],
    [
      'Saca el pipeño y el helado de piña del frío justo antes de servir; ambos deben estar muy helados.',
      'Pon 2 bolas de helado de piña en un vaso alto.',
      'Vierte el pipeño hasta casi llenar el vaso, dejando espacio para la espuma.',
      'Añade un chorrito de granadina para darle el color rosado característico.',
      'Sirve inmediatamente con cuchara larga o bombilla. Se toma rápido, antes de que el helado se derrita.',
    ],
    'Según la tradición, el nombre nació en Santiago en la década de 1980: la mezcla de pipeño, helado de piña y granadina era tan fuerte que "movía la tierra". El pipeño es un vino blanco joven y dulce, típico del sur de Chile. Existen otras versiones sobre su origen exacto.',
    [
      { error: 'Se siente "aguado" o sin fuerza', solucion: 'Usar pipeño de baja graduación o demasiado helado. Sirve el helado al final, con el pipeño ya frío, para que no se derrita rápido.' },
      { error: 'Demasiado dulce o empalagoso', solucion: 'Exagerar con la granadina o el helado. Con 2 bolas y un chorrito de granadina basta. El pipeño debe sentirse.' },
      { error: 'Se sirve tibio', solucion: 'No helar el pipeño con anticipación. Deja la botella en el congelador 20 min antes de servir (sin llegar a congelarse).' },
    ],
    { refrigerador: 'Se consume al momento. El terremoto no se guarda.', congelador: 'No aplica.', recalentar: 'No aplica. Siempre se sirve helado.' }
  ),

  /* 56. Terremoto infantil */
  r('Terremoto infantil', 'bebidas',
    ['bebida', 'sin alcohol', 'niños', 'fiestas patrias', 'verano', 'tradicional'],
    null, '5 min', '1 vaso', 'muy fácil', 'Sin cocción',
    [
      'Bebida blanca (Sprite, 7Up o Canada Dry), bien helada',
      '2 bolas de helado de piña',
      '1 chorrito de granadina',
    ],
    [
      'Pon 2 bolas de helado de piña en un vaso alto.',
      'Vierte la bebida blanca bien helada hasta casi llenar el vaso.',
      'Añade un chorrito de granadina para el color rosado.',
      'Sirve inmediatamente con cuchara o bombilla.',
    ],
    'Es la misma fiesta que el terremoto, pero sin pipeño. Ideal para que los niños también tengan su "trago" en Fiestas Patrias. El nombre puede ser "terremoto sin", "temblorcito" o simplemente "terremoto infantil".',
    [
      { error: 'Pierde el color rosado', solucion: 'No agregar la granadina. Es la que da el color característico. Un chorrito pequeño basta.' },
      { error: 'El helado se derrite muy rápido', solucion: 'No enfriar bien el vaso. Guarda los vasos en el congelador 10 minutos antes de servir.' },
    ],
    { refrigerador: 'Se consume al momento.', congelador: 'No aplica.', recalentar: 'No aplica. Siempre se sirve helado.' }
  ),

  /* 57. Cola de mono */
  r('Cola de mono', 'bebidas',
    ['bebida', 'alcohol', 'café', 'navidad', 'invierno', 'tradicional'],
    null, '20 min + enfriado', '6 a 8 vasos', 'fácil', 'Olla',
    [
      '1 litro de leche entera',
      '3 cucharadas de café instantáneo (o 1 taza de café pasado fuerte)',
      '1 rama de canela',
      '3 clavos de olor',
      '½ taza de azúcar (ajustar al gusto)',
      '1 cucharadita de esencia de vainilla',
      '½ taza de aguardiente (o pisco)',
      'Ralladura de ½ naranja (opcional)',
    ],
    [
      'En una olla, calienta la leche con la canela, los clavos de olor y la ralladura de naranja. No dejes que hierva.',
      'Disuelve el café instantáneo en un poco de leche caliente aparte y luego viértelo a la olla.',
      'Agrega el azúcar y revuelve hasta disolver. Prueba y ajusta el dulzor.',
      'Retira del fuego, añade la vainilla y deja enfriar por completo.',
      'Cuando esté tibio, agrega el aguardiente. Mezcla bien.',
      'Refrigera por al menos 3 horas antes de servir. Sirve bien frío, con hielo si prefieres, y una pizca de canela molida encima.',
    ],
    'Su nombre nace de la broma: "Cola de Mono" era el apodo de Pedro Montt, presidente de Chile a principios del siglo XX, porque usaba un traje negro y caminaba muy recto. La bebida se servía en su casa y quedó con su apodo.',
    [
      { error: 'Sabor a café amargo o quemado', solucion: 'Usar café ya hervido o dejar que la leche hierva con el café. Calienta sin llegar a ebullición y usa café instantáneo de buena calidad.' },
      { error: 'Se corta la leche', solucion: 'Hervir la leche o agregar el aguardiente en caliente. Deja enfriar la leche antes de añadir el alcohol.' },
      { error: 'Sabe muy fuerte a alcohol', solucion: 'Agregar el aguardiente en caliente. Añádelo cuando la mezcla esté tibia y ajusta la cantidad al gusto.' },
    ],
    { refrigerador: 'Hasta 5 días en botella de vidrio tapada. Agítala antes de servir.', congelador: 'No recomendado, la leche se separa.', recalentar: 'Se consume frío o tibio. Si la quieres tibia, calienta suavemente sin hervir.' }
  ),

  /* 58. Cola de mono infantil */
  r('Cola de mono infantil', 'bebidas',
    ['bebida', 'sin alcohol', 'niños', 'café', 'navidad', 'invierno'],
    null, '20 min + enfriado', '6 a 8 vasos', 'fácil', 'Olla',
    [
      '1 litro de leche entera',
      '2 cucharadas de café instantáneo descafeinado',
      '1 rama de canela',
      '2 clavos de olor',
      '½ taza de azúcar (ajustar al gusto)',
      '1 cucharadita de esencia de vainilla',
      '1 cucharadita de esencia de ron sin alcohol (opcional, para dar aroma)',
      'Ralladura de ½ naranja (opcional)',
    ],
    [
      'En una olla, calienta la leche con la canela, los clavos y la ralladura de naranja. No dejes que hierva.',
      'Disuelve el café descafeinado en un poco de leche caliente aparte y viértelo a la olla.',
      'Agrega el azúcar y revuelve hasta disolver.',
      'Retira del fuego, añade la vainilla y la esencia de ron si usas. Deja enfriar.',
      'Refrigera por al menos 3 horas. Sirve bien frío con una pizca de canela molida encima.',
    ],
    'La versión sin alcohol del clásico navideño. El café descafeinado y la esencia de ron (que no contiene alcohol, solo el aroma) permiten que los niños también disfruten de la tradición.',
    [
      { error: 'Sabe muy aguada o sin gracia', solucion: 'Usar poca leche o no dejar infusionar las especias. Deja reposar la leche con las especias por al menos 10 minutos antes de colar.' },
      { error: 'Demasiado café', solucion: 'Exagerar con el café instantáneo. Con 2 cucharadas es suficiente; el café descafeinado no debe dominar sobre la leche y las especias.' },
    ],
    { refrigerador: 'Hasta 5 días en botella de vidrio tapada. Agítala antes de servir.', congelador: 'No recomendado, la leche se separa.', recalentar: 'Se consume fría o tibia. Si la quieres tibia, calienta suavemente sin hervir.' }
  ),

  /* 59. Melvin (melón con vino) */
  r('Melvin (melón con vino)', 'bebidas',
    ['bebida', 'alcohol', 'melón', 'verano', 'tradicional'],
    null, '20 min + maceración', '4 a 6 personas', 'fácil', 'Sin cocción',
    [
      '1 melón tuna (o calameño) grande, bien maduro',
      '1 botella de vino blanco (Chardonnay, Sauvignon Blanc o pipeño), bien helado',
      '3 cucharadas de azúcar (ajustar al dulzor del melón)',
      'Hielo',
      'Opcional: hojas de menta fresca, jengibre rallado',
    ],
    [
      'Corta el melón por la mitad a lo largo. Retira las semillas con una cuchara.',
      'Con una cuchara, ahueca ligeramente la pulpa para hacer espacio para el vino.',
      'Espolvorea el azúcar dentro de las mitades y deja reposar 15 minutos para que el melón suelte su jugo.',
      'Rellena con el vino blanco bien helado. Añade hielo y, si quieres, menta o jengibre.',
      'Sirve con cuchara y bombilla. Se come el melón y se bebe el vino.',
    ],
    'El Melvin se popularizó en bares de Santiago en la década de 1980. Según la tradición, su nombre remite a un personaje bohemio de la época, aunque la historia exacta no está del todo documentada. El melón tuna es el que da el mejor sabor: carnoso, dulce y aromático.',
    [
      { error: 'Sabe muy alcohólico o fuerte', solucion: 'Usar vino muy fuerte o no azucarar el melón. Usa un vino blanco joven y dulce, y deja macerar el melón con azúcar antes de agregar el vino.' },
      { error: 'El melón queda insípido', solucion: 'Usar un melón poco maduro. Elige un melón tuna que huela dulce y ceda ligeramente al presionar la base.' },
      { error: 'Se derrite todo muy rápido', solucion: 'No enfriar el melón y el vino con anticipación. Deja el melón en el refrigerador 2 horas antes de servir.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente cerrado. El melón se pone blando.', congelador: 'No recomendado, el melón pierde textura.', recalentar: 'Se consume bien frío.' }
  ),

  /* 60. Melón con jugo (versión infantil) */
  r('Melón con jugo (versión infantil)', 'bebidas',
    ['bebida', 'sin alcohol', 'niños', 'melón', 'verano', 'fruta'],
    null, '15 min + maceración', '4 a 6 personas', 'muy fácil', 'Sin cocción',
    [
      '1 melón tuna (o calameño) grande, bien maduro',
      '2 tazas de jugo de uva blanco o bebida blanca, bien helado',
      '2 cucharadas de azúcar (opcional, según el dulzor del melón)',
      'Hielo',
      'Opcional: hojas de menta fresca',
    ],
    [
      'Corta el melón por la mitad y retira las semillas.',
      'Ahueca ligeramente la pulpa con una cuchara.',
      'Espolvorea el azúcar dentro de las mitades y deja reposar 10 minutos.',
      'Rellena con el jugo de uva o bebida blanca bien helada. Añade hielo y menta si usas.',
      'Sirve con cuchara. Se come el melón y se bebe el jugo.',
    ],
    'La versión sin alcohol del Melvin. También se conoce como "melón dulce" o "melón para niños". Es perfecta para las tardes de verano y para que los más chicos también tengan su trago de temporada.',
    [
      { error: 'Queda muy ácido o sin gracia', solucion: 'Usar jugo de uva muy ácido o poca azúcar. Prefiere jugo de uva blanco (dulce) y ajusta el azúcar al melón.' },
      { error: 'El melón no suelta jugo', solucion: 'No espolvorear azúcar. El azúcar hace que el melón suelte su jugo y se mezcle con el líquido.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente cerrado.', congelador: 'No recomendado, el melón pierde textura.', recalentar: 'Se consume bien frío.' }
  ),

  /* 61. Navegado */
  r('Navegado', 'bebidas',
    ['bebida', 'alcohol', 'vino', 'invierno', 'caliente', 'tradicional'],
    null, '15 min', '4 vasos', 'muy fácil', 'Olla',
    [
      '1 botella de vino tinto (Cabernet Sauvignon, Merlot o vino de la zona), de buena calidad',
      '2 naranjas en rodajas (con cáscara bien lavada)',
      '1 rama de canela',
      '3 clavos de olor',
      '3 cucharadas de azúcar (ajustar al gusto)',
      'Opcional: 1 chorrito de pisco o aguardiente',
    ],
    [
      'En una olla, pon el vino tinto con las rodajas de naranja, la canela y los clavos de olor.',
      'Calienta a fuego muy bajo. No dejes que hierva: el alcohol se evapora y el vino se amarga.',
      'Cuando esté caliente, añade el azúcar y revuelve hasta disolver.',
      'Prueba y ajusta el dulzor y las especias. Si quieres, añade un chorrito de pisco.',
      'Cuela si prefieres y sirve caliente en vasos o tazas. Decora con una rodaja de naranja.',
    ],
    'El navegado es la bebida de invierno chilena por excelencia, típica de las tardes frías y lluviosas. Se llama así porque "navega" entre el vino y las especias. En el sur se le agrega a veces un chorrito de aguardiente para "espantar el frío".',
    [
      { error: 'Sabe a alcohol evaporado o amargo', solucion: 'Hervir el vino. Calienta a fuego muy bajo y retira antes de que hierva. El vino debe estar caliente, no hirviendo.' },
      { error: 'Demasiado dulce o especiado', solucion: 'Exagerar con el azúcar, la canela o los clavos. Empieza con menos y ajusta al gusto. Las especias deben sentirse, no dominar.' },
      { error: 'Sabe a vino barato', solucion: 'Usar vino de mala calidad. Usa un vino que te gustaría tomar solo; si no te gusta, tampoco sabrá bien caliente.' },
    ],
    { refrigerador: 'Hasta 2 días en botella cerrada. Recalienta suavemente antes de servir.', congelador: 'No recomendado.', recalentar: 'A fuego muy bajo, sin hervir, hasta que esté caliente.' }
  ),

  /* 62. Navegado infantil */
  r('Navegado infantil', 'bebidas',
    ['bebida', 'sin alcohol', 'niños', 'invierno', 'caliente', 'jugo'],
    null, '15 min', '4 tazas', 'muy fácil', 'Olla',
    [
      '1 litro de jugo de uva (blanco o tinto, sin azúcar añadida)',
      '2 naranjas en rodajas (con cáscara bien lavada)',
      '1 rama de canela',
      '3 clavos de olor',
      '2 cucharadas de azúcar (opcional, ajustar al dulzor del jugo)',
      'Opcional: 1 cucharadita de esencia de ron sin alcohol',
    ],
    [
      'En una olla, pon el jugo de uva con las rodajas de naranja, la canela y los clavos de olor.',
      'Calienta a fuego bajo, sin dejar que hierva.',
      'Cuando esté caliente, añade el azúcar si es necesario y revuelve hasta disolver.',
      'Prueba y ajusta. Si quieres, añade la esencia de ron sin alcohol para dar aroma.',
      'Cuela si prefieres y sirve caliente en tazas. Decora con una rodaja de naranja.',
    ],
    'La versión sin alcohol del navegado. El jugo de uva caliente con especias es una bebida reconfortante para los niños en invierno, y les permite participar de la tradición familiar sin alcohol.',
    [
      { error: 'Sabe muy ácido o sin gracia', solucion: 'Usar jugo de uva muy ácido o no añadir azúcar. Prefiere jugo de uva natural y ajusta el azúcar al gusto.' },
      { error: 'Las especias dominan demasiado', solucion: 'Exagerar con la canela o los clavos. Usa una rama de canela y 3 clavos; si quedan muy fuertes, retíralos antes de servir.' },
    ],
    { refrigerador: 'Hasta 2 días en botella cerrada. Recalienta suavemente antes de servir.', congelador: 'No recomendado.', recalentar: 'A fuego bajo, sin hervir, hasta que esté caliente.' }
  ),

  /* 63. Pan de Pascua */
  r('Pan de Pascua', 'dulces',
    ['navidad', 'dulce', 'horno', 'frutas', 'tradicional', 'pan'],
    null, '1 h 30 min + reposo', '1 molde grande (12 porciones)', 'media', 'Horno',
    [
      '500 g de harina sin polvos de hornear',
      '200 g de mantequilla a temperatura ambiente',
      '200 g de azúcar',
      '4 huevos',
      '1 cucharadita de polvos de hornear',
      '250 g de frutas confitadas picadas (naranja, limón, cereza)',
      '150 g de pasas remojadas en ron o pisco',
      '100 g de nueces picadas',
      '1 cucharadita de canela molida',
      '½ cucharadita de clavo de olor molido',
      '½ cucharadita de jengibre molido',
      'Ralladura de 1 naranja y 1 limón',
      '1 cucharadita de esencia de vainilla',
      '½ taza de leche si es necesario',
      'Azúcar flor para decorar',
    ],
    [
      'Remoja las pasas en ron o pisco al menos 2 horas antes. Escurre y reserva.',
      'Bate la mantequilla con el azúcar hasta obtener una crema. Agrega los huevos uno a uno.',
      'Añade la vainilla, las ralladuras de naranja y limón, y las especias.',
      'Incorpora la harina cernida con los polvos de hornear, mezclando suavemente.',
      'Agrega las frutas confitadas, las pasas y las nueces. Si la masa está muy seca, añade leche cucharada a cucharada.',
      'Vierte la mezcla en un molde engrasado y enharinado. Hornea a 170 °C por 50-60 minutos.',
      'Deja enfriar, desmolda y espolvorea con azúcar flor antes de servir.',
    ],
    'El Pan de Pascua llega a Chile con la tradición alemana. Antiguamente se horneaba en grandes cantidades y se guardaba hasta por semanas, porque el alcohol y las frutas confitadas lo conservaban. Es el rey de la mesa navideña.',
    [
      { error: 'Queda seco como piedra', solucion: 'Hornearlo demasiado o no remojar las pasas. Hornea con un recipiente de agua en el horno para generar vapor, y no excedas los 60 minutos.' },
      { error: 'Las frutas se van al fondo', solucion: 'No enharinar las frutas. Pásalas por un poco de harina antes de incorporarlas para que se distribuyan parejo.' },
      { error: 'No sube o queda crudo en el centro', solucion: 'Horno muy caliente o molde muy hondo. Hornea a 170°C (no más) y usa un molde de no más de 20 cm de alto.' },
    ],
    { refrigerador: 'Hasta 2 semanas envuelto en papel mantequilla y aluminio en un lugar fresco.', congelador: 'Hasta 3 meses, bien envuelto.', recalentar: 'A temperatura ambiente. Si lo quieres tibio, horno a 150°C por 10 minutos.' }
  ),

  /* 64. Camarones al Pil Pil */
  r('Camarones al Pil Pil', 'principales',
    ['marisco', 'camarones', 'sarten', 'ajo', 'plato principal'],
    null, '25 min', '4 personas (como entrada o plato principal)', 'fácil', 'Sartén',
    [
      '500 g de camarones (frescos o congelados, pelados)',
      '6 dientes de ajo laminados',
      '½ taza de aceite de oliva',
      '1 ají verde o merkén al gusto',
      '½ taza de vino blanco',
      '1 cucharada de perejil fresco picado',
      'Sal y pimienta',
      'Pan amasado o marraqueta para acompañar',
    ],
    [
      'Calienta el aceite de oliva en una sartén grande a fuego medio.',
      'Agrega los ajos laminados y sofríe hasta que estén dorados (no quemados). Retira y reserva.',
      'Sube el fuego, agrega los camarones y saltéalos por 2-3 minutos hasta que cambien de color.',
      'Vierte el vino blanco y deja evaporar el alcohol por 1-2 minutos.',
      'Agrega el ají o merkén, sal y pimienta. Revuelve.',
      'Devuelve los ajos a la sartén, añade el perejil y sirve inmediatamente con pan.',
    ],
    'El "Pil Pil" es una técnica de origen vasco que consiste en emulsionar el aceite con el jugo de los camarones moviendo la sartén en círculos. Cuanto más muevas, más espesa queda la salsa. En Chile se sirve con pan amasado para "limpiar" el plato.',
    [
      { error: 'Camarones duros o gomosos', solucion: 'Cocinarlos por demasiado tiempo. Los camarones están listos en 2-3 minutos; en cuanto cambian de color, retíralos del fuego.' },
      { error: 'Ajos quemados y amargos', solucion: 'Sofreírlos a fuego muy alto. Dora los ajos a fuego medio y retíralos antes de que se quemen. Vuelven al final.' },
      { error: 'Salsa aguada', solucion: 'No emulsionar bien el aceite. Mueve la sartén en círculos mientras cocinas, para que el aceite se mezcle con el jugo de los camarones.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, los camarones pierden textura.', recalentar: 'A fuego bajo por 3-5 minutos, moviendo suavemente para no romper la emulsión.' }
  ),

  /* 65. Leche nevada */
  r('Leche nevada', 'dulces',
    ['postre', 'dulce', 'leche', 'frio', 'tradicional', 'huevo'],
    null, '40 min + frío', '6 personas', 'media', 'Olla',
    [
      '1 litro de leche entera',
      '4 huevos (separar claras y yemas)',
      '150 g de azúcar',
      '1 rama de canela',
      '1 cucharadita de esencia de vainilla',
      '2 cucharadas de maicena',
      'Canela molida para servir',
    ],
    [
      'Calienta la leche con la canela en rama sin que hierva.',
      'Bate las yemas con el azúcar hasta que estén pálidas. Añade la maicena y mezcla.',
      'Vierte un poco de leche caliente sobre las yemas (templar) y luego devuelve todo a la olla.',
      'Cocina a fuego bajo, revolviendo constantemente, hasta que espese (unos 5-7 minutos). No dejes que hierva.',
      'Retira la canela, añade la vainilla y vierte en un molde o en copas individuales.',
      'Bate las claras a punto de nieve con un poco de azúcar. Cocínalas en la leche caliente (o al baño María) por cucharadas, hasta que cuajen. Colócalas encima del postre.',
      'Refrigera al menos 3 horas. Sirve con canela molida encima.',
    ],
    'La "nieve" son las claras batidas que flotan sobre la crema de leche. Es un postre de origen español que en Chile se volvió clásico de las once y de las celebraciones familiares.',
    [
      { error: 'La crema se corta', solucion: 'Hervir la mezcla o no templar las yemas. Cocina a fuego bajo y agrega la leche caliente a las yemas de a poco, sin dejar de batir.' },
      { error: 'La crema no espesa', solucion: 'No cocinar el tiempo suficiente o usar poca maicena. Cocina hasta que cubra la cuchara y añade 1 cucharada extra de maicena si es necesario.' },
      { error: 'Las claras se deshacen', solucion: 'Cocinarlas en leche hirviendo o no batirlas bien. Bate a punto de nieve firme y cocínalas en leche muy caliente pero sin hervir.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético o copas cubiertas con papel plástico.', congelador: 'No recomendado, la crema se separa.', recalentar: 'Se consume bien fría.' }
  ),

  /* 66. Chicha */
  r('Chicha', 'bebidas',
    ['bebida', 'alcohol', 'uva', 'fiestas patrias', 'tradicional', 'fermentada'],
    null, '15 min + 10 días de fermentación', '4 litros', 'media', 'Fermentación',
    [
      '4 kg de uva país o uva de mesa bien madura',
      '2 litros de agua hervida (fría)',
      '1 kg de azúcar (ajustar al dulzor de la uva)',
      '1 rama de canela (opcional)',
      '1 puñado de pasas (opcional, para acelerar la fermentación)',
    ],
    [
      'Lava bien las uvas y sepáralas de los tallos.',
      'En un recipiente grande de vidrio o barro (bien limpio y seco), pon las uvas y machácalas ligeramente con las manos o un pisón.',
      'Agrega el agua hervida fría y el azúcar. Revuelve hasta disolver.',
      'Añade la canela y las pasas si usas.',
      'Tapa con un paño limpio o gasa (no hermético) y deja fermentar en un lugar oscuro y fresco por 7 a 10 días, revolviendo una vez al día.',
      'Cuando el líquido deje de burbujear y tenga olor a vino, cuela con un paño fino o filtro de café.',
      'Envasa en botellas de vidrio bien limpias, tapa y deja reposar 2 días más antes de servir. Sirve bien fría.',
    ],
    'La chicha es la bebida de Fiestas Patrias por excelencia. Llegó a Chile con los españoles y se volvió parte de la tradición criolla. Cada familia tiene su receta: con más azúcar, con canela, con pasas. La versión sin fermentar es la "chicha dulce", que es simplemente el jugo de uva antes de fermentar.',
    [
      { error: 'No fermenta (queda dulce)', solucion: 'Usar uvas muy limpias (sin levadura natural en la cáscara) o un recipiente estéril. Deja las uvas sin lavar en exceso o agrega un puñado de pasas para aportar levaduras naturales.' },
      { error: 'Se avinagra o se echa a perder', solucion: 'Dejar fermentar demasiado tiempo o en un lugar caluroso. Fermenta en un lugar fresco y oscuro, y cuela en cuanto deje de burbujear.' },
      { error: 'Sabe muy fuerte a alcohol', solucion: 'Dejar fermentar demasiado o agregar mucha azúcar. Prueba a los 7 días: si ya tiene sabor a vino suave, cuélala.' },
    ],
    { refrigerador: 'Hasta 2 semanas en botellas cerradas en el refrigerador. Una vez abierta, consumir en 3-4 días.', congelador: 'No recomendado, la fermentación se detiene pero pierde textura.', recalentar: 'Se consume bien fría. No se recalienta.' }
  ),

  /* 67. Piscola */
  r('Piscola', 'bebidas',
    ['bebida', 'alcohol', 'pisco', 'cóctel', 'tradicional', 'verano'],
    null, '5 min', '1 vaso', 'muy fácil', 'Sin cocción',
    [
      '1 medida de pisco (40 ml aprox.)',
      'Bebida cola bien helada (Coca-Cola, Pepsi o similar)',
      'Hielo en cubos',
      'Opcional: rodaja de limón',
    ],
    [
      'Llena un vaso alto con hielo.',
      'Vierte el pisco sobre el hielo.',
      'Completa con la bebida cola bien helada.',
      'Revuelve suavemente con una cuchara larga.',
      'Decora con una rodaja de limón si quieres. Sirve inmediatamente.',
    ],
    'La piscola es el trago más popular de Chile, especialmente en verano y en las fondas. Se dice que nació en los años 70 en Valparaíso, y desde entonces compite con el terremoto como el cóctel nacional. La proporción varía: desde 1:3 (suave) hasta 1:1 (fuerte, "con afán").',
    [
      { error: 'Sabe muy fuerte o "quema"', solucion: 'Usar mucho pisco o bebida cola caliente. Usa una proporción de 1:3 (una medida de pisco por tres de cola) y hielo abundante.' },
      { error: 'Se siente aguado o sin gracia', solucion: 'Usar demasiado hielo o bebida cola de mala calidad. Usa hielo en cubos grandes (se derrite más lento) y una bebida cola de buena calidad.' },
      { error: 'No está frío', solucion: 'No enfriar el pisco ni la bebida cola. Deja ambos en el refrigerador al menos 2 horas antes de servir.' },
    ],
    { refrigerador: 'Se consume al momento.', congelador: 'No aplica.', recalentar: 'No aplica. Siempre se sirve helado.' }
  ),

  /* 68. Borgoña */
  r('Borgoña', 'bebidas',
    ['bebida', 'alcohol', 'vino', 'frutillas', 'verano', 'tradicional'],
    null, '15 min + maceración', '6 vasos', 'muy fácil', 'Sin cocción',
    [
      '1 botella de vino tinto (Cabernet Sauvignon, Merlot o vino de la zona), bien helado',
      '500 g de frutillas frescas, lavadas y sin tallo',
      '3 cucharadas de azúcar (ajustar al gusto)',
      'Hielo',
      'Opcional: hojas de menta fresca',
    ],
    [
      'Lava bien las frutillas y córtalas por la mitad.',
      'En una jarra grande, pon las frutillas y espolvorea el azúcar. Deja reposar 15 minutos para que suelten su jugo.',
      'Vierte el vino tinto bien helado sobre las frutillas.',
      'Añade hielo y, si quieres, menta fresca.',
      'Sirve inmediatamente en vasos altos, con algunas frutillas en cada vaso.',
    ],
    'La borgoña es el ponche criollo por excelencia de la zona central de Chile. Se dice que nació en Talca, donde las frutillas son famosas. Es la bebida obligada en las fondas y en las celebraciones de primavera y verano. Su "versión clara" es el Clery, hecho con vino blanco.',
    [
      { error: 'Sabe muy ácida o sin gracia', solucion: 'Usar frutillas poco maduras o no azucarar. Usa frutillas bien maduras y deja macerar con azúcar antes de agregar el vino.' },
      { error: 'Las frutillas se deshacen', solucion: 'Dejar macerar demasiado tiempo o usar frutillas muy blandas. Macera solo 15-20 minutos antes de servir.' },
      { error: 'Sabe muy fuerte a alcohol', solucion: 'Usar un vino muy fuerte o no enfriarlo. Usa un vino tinto joven y frutal, bien helado, y ajusta la cantidad de azúcar.' },
    ],
    { refrigerador: 'Hasta 2 días en jarra cerrada. Las frutillas se ponen blandas.', congelador: 'No recomendado, las frutillas pierden textura.', recalentar: 'Se consume bien frío.' }
  ),

  /* 69. Pisco Sour */
  r('Pisco Sour', 'bebidas',
    ['pisco', 'cóctel', 'tradicional', 'clásico', 'fiestas patrias', 'verano'],
    null, '5 min', '1 vaso', 'fácil', 'Coctelería',
    [
      '3 partes de pisco (40° o más, que te guste tomar solo)',
      '1 parte de jugo de limón de Pica recién exprimido',
      '1 parte de jarabe de goma (o 2 cucharaditas de azúcar flor)',
      '1 clara de huevo por cada 2 vasos',
      'Hielo en cubos',
      '3-4 gotas de amargo de Angostura por vaso',
      'Opcional: canela en polvo para decorar',
    ],
    [
      'Enfría la coctelera y los vasos 10 minutos en el congelador. Un pisco sour tibio no es un pisco sour.',
      'Pon en la coctelera: pisco, jugo de limón, jarabe de goma, la clara de huevo y 4-5 cubos de hielo.',
      'Primero agita en seco (sin hielo) por 10 segundos. Esto airea la clara y es lo que crea la espuma.',
      'Agrega el hielo y agita de nuevo 15 segundos hasta que la coctelera escarche y se empañe.',
      'Cuela con colador doble en un vaso helado, sin hielo dentro del vaso.',
      'Añade 3-4 gotas de amargo de Angostura sobre la espuma. Se dibuja solo.',
      'Decora con una pizca de canela si quieres. Sirve de inmediato.',
    ],
    'La proporción clásica chilena es 3:1:1 (pisco:limón:azúcar). En Perú es más dulce, 4:1:2. La disputa por el origen del pisco sour es uno de los debates gastronómicos más largos de Sudamérica. Chile celebra su "Día Nacional del Pisco Sour" el primer sábado de febrero.',
    [
      { error: 'No sale la espuma', solucion: 'Batir en seco sin hielo primero. Esto es CLAVE: la clara necesita aire antes de enfriarse.' },
      { error: 'Sabe muy ácido o desequilibrado', solucion: 'Ajustar la cantidad de limón o de jarabe según la acidez de los limones. Los limones varían mucho de un día a otro; prueba y ajusta.' },
      { error: 'Sabe a "medicina"', solucion: 'Usar un pisco demasiado barato o muy joven. Elige uno de 40° que te guste tomar solo.' },
    ],
    { refrigerador: 'Se consume al momento. No se guarda.', congelador: 'No aplica.', recalentar: 'No aplica.' }
  ),

  /* 70. Completo italiano */
  r('Completo italiano', 'sandwiches',
    ['completo', 'sándwich', 'callejero', 'italiano', 'palta', 'tomate', 'once'],
    null, '15 min', '2 completos', 'muy fácil', 'Sin cocción',
    [
      '2 panes de completo (alargados, tipo marraqueta alargada)',
      '2 vienesas de buena calidad',
      '1 palta Hass madura',
      '2 tomates maduros',
      'Mayonesa casera o de buena calidad',
      'Sal, limón y aceite (opcional para la palta)',
    ],
    [
      'Cuece las vienesas en agua hirviendo 5 minutos, o ásalas en la plancha hasta que doren. La vienesa hervida es la del carrito; la asada es la de la casa.',
      'Calienta el pan en el horno o plancha 2 minutos por lado: debe quedar crujiente por fuera y suave por dentro.',
      'Prepara la palta: pisa con tenedor, agrega sal, unas gotas de limón y un chorrito de aceite. Cremosa, pero no líquida.',
      'Corta el tomate en cubos pequeños y sala ligeramente justo antes de armar. Si lo salas antes, suelta agua y arruina el pan.',
      'Abre el pan por la mitad, sin llegar al fondo. Pon la vienesa.',
      'Agrega primero la palta, luego el tomate, y por último la mayonesa en línea (no revuelvas).',
      'Sirve inmediatamente, con servilletas.',
    ],
    'El "italiano" nace en el Hoyo de la Luna, un local nocturno del centro de Santiago en los años 70. El nombre viene de los colores de los ingredientes: verde (palta), blanco (mayonesa), rojo (tomate) — la bandera italiana. Existen variantes: el "dinámico" es palta + tomate, el "aliado" es solo mayonesa, el "completo" lleva todo lo anterior más chucrut y americana, el "as" es solo vienesa.',
    [
      { error: 'Pan blando y frío', solucion: 'El pan debe calentarse para que quede crocante. Un pan frío arruina un completo.' },
      { error: 'Palta negra o marrón', solucion: 'Usar palta poco madura o muy madura. La palta debe ceder al presionar pero no deshacerse. Si está muy dura, déjala 2 días a temperatura ambiente con una manzana.' },
      { error: 'Se desarma al comer', solucion: 'Poner demasiada mayonesa o ingredientes muy húmedos. Escurre bien el tomate antes de ponerlo.' },
    ],
    { refrigerador: 'No se guarda armado. Los componentes se guardan por separado hasta 3 días.', congelador: 'No aplica.', recalentar: 'La vienesa y el pan se recalentan. La palta y el tomate, no.' }
  ),

  /* 71. Chacarero */
  r('Chacarero', 'sandwiches',
    ['sándwich', 'callejero', 'chacarero', 'porotos verdes', 'vacuno', 'almuerzo'],
    null, '25 min', '2 sándwiches', 'fácil', 'Plancha',
    [
      '2 panes amasados individuales (o 2 marraquetas pequeñas)',
      '300 g de churrasco de vacuno (posta, lomo o asiento) en 2 filetes',
      '1 taza de porotos verdes cocidos y escurridos',
      '2 tomates maduros en rodajas',
      '1 ají verde sin semillas, en tiras finas (opcional)',
      'Mayonesa casera o de buena calidad',
      'Sal, pimienta y aceite',
    ],
    [
      'Cocina los porotos verdes en agua con sal hirviendo por 5-7 minutos. Deben quedar tiernos pero firmes. Escurre y reserva.',
      'Sazona los filetes con sal y pimienta. Calienta una plancha o sartén a fuego alto con un poco de aceite.',
      'Sella la carne 2-3 minutos por lado. Debe quedar dorada por fuera y jugosa por dentro. Retira y deja reposar.',
      'Calienta los panes cortados por la mitad, 1 minuto por lado en la misma plancha.',
      'Arma: pan, carne, porotos verdes, tomate, ají (si usas), y mayonesa en línea.',
      'Sirve inmediatamente, apretando ligeramente el sándwich con la mano para que se compacte.',
    ],
    'El chacarero nació en la Vega Central de Santiago, el mercado de abastos más grande de la capital. Los porotos verdes son lo distintivo: ningún otro sándwich del mundo los usa como ingrediente principal. Hay dos escuelas sobre el ají: los que dicen que es esencial y los que lo consideran opcional.',
    [
      { error: 'Porotos verdes duros o pasados', solucion: 'Cocerlos demasiado o muy poco. 5-7 minutos exactos: deben quedar tiernos pero firmes. Si están duros, la textura arruina el bocado.' },
      { error: 'Carne seca', solucion: 'Cocinar la carne por demasiado tiempo. Un churrasco delgado se hace en 2-3 minutos por lado a fuego alto.' },
      { error: 'Sándwich aguado', solucion: 'Porotos verdes con agua o tomate muy maduro. Escurre muy bien los porotos y seca el tomate con papel absorbente.' },
    ],
    { refrigerador: 'No se guarda armado. Los componentes se guardan hasta 3 días.', congelador: 'No aplica.', recalentar: 'La carne y el pan se recalentan. Los vegetales, no.' }
  ),

  /* 72. Barros Luco */
  r('Barros Luco', 'sandwiches',
    ['sándwich', 'callejero', 'barros luco', 'vacuno', 'queso', 'historia', 'almuerzo'],
    null, '15 min', '2 sándwiches', 'muy fácil', 'Plancha',
    [
      '2 panes amasados individuales (o 2 marraquetas pequeñas)',
      '300 g de churrasco de vacuno (posta o asiento) en 2 filetes',
      '150 g de queso mantecoso o chanco en láminas gruesas',
      'Sal, pimienta y aceite',
    ],
    [
      'Sazona los bistecs con sal y pimienta. Calienta la plancha a fuego alto.',
      'Sella la carne 2 minutos por lado. Retira y deja reposar mientras preparas el pan.',
      'Calienta los panes cortados por la mitad en la misma plancha, 1 minuto por lado.',
      'Pon el queso encima de la carne aún caliente para que se derrita con el calor residual.',
      'Arma el sándwich: pan, carne con queso derretido, pan.',
      'Sirve inmediatamente. Si quieres, corta en diagonal.',
    ],
    'Lleva el nombre de Ramón Barros Luco, presidente de Chile entre 1910 y 1915. Se dice que lo pedía todos los días en la Confitería Torres, en el centro de Santiago. La receta es minimalista: carne y queso. Nada más. Y así es como debe ser.',
    [
      { error: 'Queso frío que no se derrite', solucion: 'Poner el queso sobre la carne bien caliente, o pasar el sándwich armado por la plancha 30 segundos tapado. El queso debe derretirse.' },
      { error: 'Carne seca', solucion: 'Cocinar de más. Un bistec delgado se hace en 2 minutos por lado a fuego alto.' },
      { error: 'Pan blando', solucion: 'No calentar el pan. El pan amasado o la marraqueta deben ir a la plancha antes de armar.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'En plancha o sándwichera 2 minutos.' }
  ),

  /* 73. Pan con palta */
  r('Pan con palta', 'once',
    ['once', 'pan', 'palta', 'desayuno', 'simple', 'vegetariano', 'tradicional'],
    null, '5 min', '1 persona', 'muy fácil', 'Sin cocción',
    [
      '1 marraqueta o hallulla recién horneada',
      '1/2 palta Hass madura',
      'Sal en escamas o sal fina',
      'Aceite de oliva (opcional)',
      'Opcional: unas gotas de limón',
    ],
    [
      'Abre el pan por la mitad, sin separarlo del todo si es marraqueta.',
      'Pisa la palta con un tenedor dentro de la cáscara, agregando una pizca de sal. La palta debe quedar rústica, no como puré.',
      'Unta generosamente sobre el pan caliente.',
      'Añade unas gotas de aceite de oliva y una pizca más de sal en escamas.',
      'Come inmediatamente. El pan caliente es la mitad del placer.',
    ],
    'El pan con palta es probablemente la preparación más chilena que existe. Se come al desayuno, en la once, como colación, a cualquier hora. Chile es el tercer consumidor de pan del mundo y uno de los mayores consumidores de palta. La combinación es casi inevitable. En la casa tradicional se unta con la mano, sin cubiertos.',
    [
      { error: 'Palta negra o marrón', solucion: 'Usar palta poco madura o muy madura. La palta debe ceder al presionar sin deshacerse. Si está dura, guárdala con una manzana 2 días.' },
      { error: 'Pan frío', solucion: 'Usar pan del día anterior sin calentar. Calienta el pan 2 minutos en el horno o tostador. El pan caliente es la mitad del placer.' },
      { error: 'Falta de sabor', solucion: 'Usar poca sal. La sal es esencial: realza la palta y la hace más cremosa. Prueba antes de servir.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'El pan se puede recalentar. La palta, no.' }
  ),

  /* 74. Ceviche chileno — se mantiene en categoría 'mar' */
  r('Ceviche chileno', 'mar',
    ['ceviche', 'pescado', 'marisco', 'fresco', 'verano', 'tradicional'],
    null, '20 min + frío', '4 personas', 'fácil', 'Sin cocción',
    [
      '500 g de pescado blanco fresco (reineta, corvina, lenguado o merluza)',
      'Jugo de 4-5 limones de Pica (o limón sutil)',
      '1 cebolla morada grande',
      '1 ají verde sin semillas, picado fino (opcional)',
      '1 taza de cilantro fresco picado',
      'Sal y pimienta',
      'Opcional: 1 cucharada de aceite de oliva',
    ],
    [
      'Corta el pescado en cubos de 1,5 cm. Debe estar muy fresco: si tiene olor fuerte, no sirve.',
      'Sala el pescado con sal y pimienta y déjalo reposar 5 minutos.',
      'Corta la cebolla en pluma muy fina y remójala en agua fría 10 minutos. Escurre muy bien.',
      'Exprime los limones y cuela el jugo. Debe ser suficiente para cubrir el pescado.',
      'Mezcla el pescado con el jugo de limón. Refrigera 10-15 minutos: el pescado se "cocina" en el ácido.',
      'Escurre el exceso de jugo, agrega la cebolla, el ají, el cilantro y el aceite. Mezcla suavemente.',
      'Rectifica la sal. Sirve frío, con pan amasado, galletas de soda o marraqueta.',
    ],
    'El ceviche chileno es distinto del peruano: usa más cebolla, menos ají, y a veces lleva aceite de oliva. El pescado no se "cocina" tanto: el limón actúa 10-15 minutos, no horas. El limón de Pica (del oasis de Pica, en Tarapacá) es el más aromático de Chile. Chile tiene 4.300 km de costa: el ceviche no es solo peruano.',
    [
      { error: 'Pescado deshecho', solucion: 'Usar un pescado poco firme o dejar demasiado tiempo en el limón. Usa pescado blanco firme (reineta, corvina) y no más de 15 minutos de limón.' },
      { error: 'Sabe muy ácido', solucion: 'Usar demasiado limón o dejarlo demasiado tiempo. Prueba a los 10 minutos: si ya está cocinado, escurre el jugo y sirve.' },
      { error: 'Cebolla muy picante', solucion: 'No remojar la cebolla. El agua fría le quita el picor sin perder textura. Escurre muy bien antes de agregar.' },
    ],
    { refrigerador: 'Hasta 1 día. El pescado se sigue "cocinando" en el limón: no lo guardes mucho.', congelador: 'No recomendado. La textura cambia completamente.', recalentar: 'Se consume bien frío.' }
  ),

  /* 75. Pastel de jaiba — se mantiene en categoría 'mar' */
  r('Pastel de jaiba', 'mar',
    ['jaiba', 'marisco', 'horno', 'pastel', 'tradicional', 'restaurant'],
    null, '50 min', '4 personas', 'media', 'Horno',
    [
      '500 g de carne de jaiba (fresca o en conserva)',
      '1 cebolla grande picada fina',
      '1 pimentón rojo en cubos pequeños',
      '2 dientes de ajo picados',
      '1/2 taza de vino blanco',
      '1/2 taza de crema',
      '100 g de queso mantecoso o chanco rallado',
      '1 taza de pan molido o miga de pan',
      'Mantequilla, sal, pimienta, merkén y orégano',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón en mantequilla hasta que estén transparentes.',
      'Agrega la carne de jaiba y saltea 3 minutos. Condimenta con sal, pimienta, merkén y orégano.',
      'Vierte el vino blanco y deja evaporar. Agrega la crema y cocina 2 minutos más.',
      'Retira del fuego y mezcla con la mitad del pan molido. Rectifica la sal.',
      'Reparte en pailas de greda individuales o en una fuente para horno.',
      'Cubre con el pan molido restante y luego con el queso rallado.',
      'Hornea a 200 °C por 15-20 minutos, hasta que el queso esté dorado y burbujeante.',
    ],
    'El pastel de jaiba es un clásico de los restaurantes chilenos de mariscos, especialmente en la zona central y sur. La jaiba es un cangrejo pequeño que se come mucho en Chile. Si usas jaiba fresca, el rendimiento es de aproximadamente 100 g de carne por jaiba entera.',
    [
      { error: 'Pastel seco', solucion: 'Hornear demasiado o usar poco líquido. La crema y el vino son esenciales: si usas carne en conserva, agrega 2 cucharadas extra de crema.' },
      { error: 'Sabe a "pescado viejo"', solucion: 'Usar jaiba que no está fresca. La jaiba fresca debe oler a mar, no a pescado fuerte. Si usas conserva, elige una de buena marca y escúrrela bien.' },
      { error: 'Queso quemado y centro frío', solucion: 'Hornear a temperatura muy alta o en molde muy hondo. Usa pailas individuales: se cocinan parejo en 15 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 1 mes, sin el queso de la superficie.', recalentar: 'Horno a 180 °C por 10 minutos, cubierto con papel aluminio los primeros 5 minutos.' }
  ),

  /* 76. Té con leche */
  r('Té con leche', 'once',
    ['once', 'bebida', 'té', 'tradicional', 'invierno'],
    null, '5 min', '1 taza', 'muy fácil', 'Hervidor',
    [
      '1 bolsita de té negro (o 1 cucharadita de té suelto)',
      '150 ml de agua hirviendo',
      '100 ml de leche entera',
      'Azúcar al gusto (1-2 cucharaditas)',
    ],
    [
      'Hierve el agua. Mientras hierve, calienta la leche aparte en una ollita o en el microondas. No debe hervir: solo calentarse hasta que salga vapor.',
      'Pon la bolsita de té en la taza. Vierte el agua hirviendo sobre ella y deja reposar 3-4 minutos. Más tiempo lo pone amargo.',
      'Retira la bolsita sin apretarla contra la taza (si la aprietas, sale más tanino y amarga).',
      'Vierte la leche caliente sobre el té. La proporción clásica chilena es 60% té, 40% leche.',
      'Endulza al gusto y revuelve. Sirve inmediatamente.',
    ],
    'El té con leche es la bebida de la once chilena por excelencia. Se calcula que Chile es uno de los mayores consumidores de té del mundo, solo superado por Turquía, Irlanda y el Reino Unido. La proporción té/leche varía por familia: hay quienes lo toman "cortado" (más leche que té) y quienes lo toman "cargado" (más té).',
    [
      { error: 'Té amargo', solucion: 'Dejar la bolsita demasiado tiempo o apretarla. Con 3-4 minutos es suficiente. Apretar la bolsita contra la taza libera taninos amargos.' },
      { error: 'Leche cortada', solucion: 'Hervir la leche o echarla en el té aún hirviendo. Calienta la leche hasta que salga vapor, sin llegar a hervir.' },
      { error: 'Té tibio', solucion: 'Calentar la taza antes. Vierte un poco de agua hirviendo en la taza, espera 30 segundos, bota el agua y sirve el té. La taza fría baja la temperatura del té 10 grados al instante.' },
    ],
    { refrigerador: 'Se consume al momento. El té recalentado pierde aroma.', congelador: 'No aplica.', recalentar: 'No recomendado.' }
  ),

  /* 77. Pan con huevo */
  r('Pan con huevo', 'once',
    ['once', 'pan', 'huevo', 'desayuno', 'simple', 'tradicional'],
    null, '8 min', '1 persona', 'muy fácil', 'Sartén',
    [
      '1 marraqueta o hallulla recién horneada',
      '1 huevo',
      '1 cucharadita de aceite o mantequilla',
      'Sal y pimienta',
    ],
    [
      'Calienta la sartén a fuego medio con el aceite o la mantequilla.',
      'Casca el huevo directamente sobre la sartén. Salpimenta la yema.',
      'Cocina 2-3 minutos para huevo frito con yema líquida (tapa la sartén los últimos 30 segundos para que la clara cuaje).',
      'Mientras se cocina el huevo, abre el pan por la mitad y tuéstalo ligeramente en el tostador o en la misma sartén.',
      'Pon el huevo frito sobre el pan tostado. Come inmediatamente.',
    ],
    'El pan con huevo es el desayuno y la once más simple de Chile. Se come a cualquier hora. Tradicionalmente se unta la yema con el pan en lugar de usar cubiertos. En muchas casas se sirve con el pan cortado en tiras para "mojar" en la yema.',
    [
      { error: 'Huevo con yema dura', solucion: 'Cocinar demasiado. Para yema líquida, el huevo frito solo necesita 2-3 minutos a fuego medio. Si tapas la sartén los primeros 30 segundos, la clara cuaja sin secar la yema.' },
      { error: 'Clara cruda', solucion: 'Fuego demasiado alto. Baja el fuego a medio para que la clara cuaje parejo sin que la base se queme.' },
      { error: 'Pan frío o blando', solucion: 'No tostar el pan. Un pan tostado es la mitad del placer. Caliéntalo 1 minuto por lado en la sartén o en el tostador.' },
    ],
    { refrigerador: 'No se guarda.', congelador: 'No aplica.', recalentar: 'No recomendado. Se hace al momento.' }
  ),

  /* 78. Pan con manjar */
  r('Pan con manjar', 'once',
    ['once', 'pan', 'manjar', 'dulce', 'desayuno', 'tradicional'],
    null, '3 min', '1 persona', 'muy fácil', 'Sin cocción',
    [
      '1 marraqueta o hallulla recién horneada',
      '2-3 cucharadas de manjar (dulce de leche)',
      'Opcional: mantequilla',
    ],
    [
      'Abre el pan por la mitad. Si quieres, úntalo ligeramente con mantequilla antes del manjar: el contraste salado/dulce es clave.',
      'Unta una capa generosa de manjar.',
      'Si está muy frío, calienta el pan armado 10 segundos en el microondas para que el manjar se derrita ligeramente.',
      'Come inmediatamente. Acompaña con té o café con leche.',
    ],
    'El manjar (llamado "dulce de leche" en Argentina y Uruguay) es una de las preparaciones más queridas de la once chilena. Cada familia tiene su marca favorita y hay verdaderas guerras entre "manjar de marca" y "manjar casero". Las versiones más antiguas se hacían en casa, hirviendo leche con azúcar por horas.',
    [
      { error: 'Manjar muy duro o seco', solucion: 'Está muy frío o la marca es muy densa. Sácalo 15 minutos antes del refrigerador o calienta el pan armado 10 segundos en el microondas.' },
      { error: 'Exceso de dulzor', solucion: 'No usar mantequilla como contrapunto. Un poco de mantequilla salada debajo del manjar equilibra el dulzor.' },
      { error: 'Se escurre', solucion: 'Poner demasiado. Con 2-3 cucharadas es suficiente. El manjar se escurre por los bordes del pan.' },
    ],
    { refrigerador: 'El pan no se guarda. El manjar dura semanas en el refrigerador.', congelador: 'No aplica.', recalentar: 'No aplica.' }
  ),

  /* 79. Once completa */
  r('Once completa', 'once',
    ['once', 'ritual', 'tradicional', 'compartir', 'chile'],
    null, '20 min', '2 personas', 'muy fácil', 'Mesa',
    [
      '1 marraqueta o hallulla recién horneada (o 4 panes amasados pequeños)',
      '1 palta Hass madura',
      '2 huevos',
      '150 g de queso chanco o mantecoso en láminas',
      '2 cucharadas de mantequilla',
      '2 cucharadas de manjar',
      '2 bolsitas de té negro o 1 cucharada de café soluble',
      'Leche para el té o café',
      'Azúcar, sal y aceite',
    ],
    [
      'Pon el agua a hervir para el té. Mientras hierve, calienta los panes en el horno o tostador 2 minutos por lado.',
      'Cocina los huevos fritos con un poco de aceite, dejando la yema líquida.',
      'Pisa la palta con un tenedor, agrégale sal. No hace falta limón.',
      'Pon en la mesa: el pan caliente, la palta, los huevos fritos, el queso en láminas, la mantequilla y el manjar.',
      'Sirve el té con leche (o el café) bien caliente.',
      'Cada persona arma el pan como prefiere: pan con palta, pan con queso, pan con huevo, pan con manjar. Los panes se repiten.',
    ],
    'La once es una institución chilena. Aunque su nombre viene de la hora inglesa ("elevenses", las 11 de la mañana), en Chile se consolidó como la merienda de la tarde (6-8 pm). Es una comida informal pero comunitaria: toda la familia se sienta alrededor de la mesa, se reparten los panes, se conversa. Hay lugares donde la once reemplaza la cena. En Chile se come pan a toda hora, y la once es la excusa perfecta.',
    [
      { error: 'Pan frío', solucion: 'No calentar el pan antes de la once. Un pan recién horneado o tostado es la base. El pan del día anterior sin calentar arruina el ritual.' },
      { error: 'Palta negra o marrón', solucion: 'Usar palta poco madura. La palta debe ceder al presionar sin deshacerse. Si está dura, guárdala con una manzana 2 días.' },
      { error: 'Falta de variedad', solucion: 'Poner solo una cosa. La gracia de la once completa es la variedad: palta, queso, huevo, manjar. Cada uno elige.' },
    ],
    { refrigerador: 'Los componentes se guardan por separado hasta 3 días.', congelador: 'El pan se puede congelar; el resto no.', recalentar: 'El pan en tostador u horno. Los huevos se hacen al momento.' }
  ),

  /* 80. Barros Jarpa */
  r('Barros Jarpa', 'sandwiches',
    ['sándwich', 'callejero', 'barros jarpa', 'jamón', 'queso', 'historia', 'almuerzo'],
    null, '10 min', '2 sándwiches', 'muy fácil', 'Plancha',
    [
      '2 panes amasados individuales (o 2 marraquetas pequeñas)',
      '200 g de jamón de pierna en láminas gruesas',
      '200 g de queso mantecoso o chanco en láminas gruesas',
      'Mantequilla para la plancha',
    ],
    [
      'Calienta la plancha o sartén a fuego medio con un poco de mantequilla.',
      'Abre los panes por la mitad y tuéstalos 1 minuto por lado.',
      'En la misma plancha, pon el jamón 30 segundos por lado hasta que tome temperatura. No lo cocines de más: el jamón se seca.',
      'Pon el jamón sobre la mitad inferior del pan, encima el queso, y tapa con la otra mitad.',
      'Pasa el sándwich armado a la plancha, tapado con una tapa o peso, 1-2 minutos hasta que el queso se derrita.',
      'Sirve inmediatamente, cortado en diagonal si quieres.',
    ],
    'El Barros Jarpa lleva el nombre de Ernesto Barros Jarpa, diplomático chileno y hermano de Ramón Barros Luco (del sándwich homónimo). Se dice que Ernesto pedía siempre jamón con queso caliente en la Confitería Torres, y el maître terminó llamando al sándwich por su nombre. Es el hermano "liviano" del Barros Luco: cambia la carne por jamón.',
    [
      { error: 'Queso frío', solucion: 'No derretir el queso. Pasar el sándwich armado a la plancha tapado 1-2 minutos hasta que el queso se derrita completamente.' },
      { error: 'Jamón seco', solucion: 'Cocinar demasiado el jamón. Solo necesita 30 segundos por lado a fuego medio para tomar temperatura.' },
      { error: 'Pan blando', solucion: 'No tostar el pan. El pan amasado debe ir a la plancha antes de armar.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'En plancha o sándwichera 2 minutos.' }
  ),
  /* 81. Sándwich aliado */
  r('Sándwich aliado', 'sandwiches',
    ['sándwich', 'aliado', 'mayonesa', 'simple', 'once', 'completo'],
    null, '5 min', '1 sándwich', 'muy fácil', 'Sin cocción',
    [
      '1 pan de completo (alargado) o 1 marraqueta',
      '1 vienesa de buena calidad',
      '1-2 cucharadas de mayonesa casera o de buena calidad',
    ],
    [
      'Cuece la vienesa en agua hirviendo 5 minutos.',
      'Calienta el pan en el horno o plancha 2 minutos por lado.',
      'Abre el pan por la mitad sin llegar al fondo.',
      'Pon la vienesa dentro.',
      'Cubre con mayonesa en línea. Sirve inmediatamente.',
    ],
    'El "aliado" es el completo más minimalista que existe: solo vienesa y mayonesa. En el carrito de completos, "aliado" es el que no lleva ni palta ni tomate. El nombre probablemente viene de que la mayonesa es "aliada" de la vienesa: no le agrega nada más. Para muchos chilenos es el completo "de verdad".',
    [
      { error: 'Vienesa fría', solucion: 'Cocer la vienesa al momento o recalentar si estaba hervida de antes. La vienesa debe servirse caliente.' },
      { error: 'Mayonesa industrial', solucion: 'Usar solo mayonesa de bolsa barata. La mayonesa casera o una de buena calidad cambia completamente el sándwich.' },
      { error: 'Pan frío', solucion: 'No calentar el pan. Un pan crujiente y caliente es la mitad del sándwich.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'La vienesa y el pan se recalentan.' }
  ),

  /* 82. Sándwich dinámico */
  r('Sándwich dinámico', 'sandwiches',
    ['sándwich', 'dinámico', 'palta', 'tomate', 'once', 'completo'],
    null, '8 min', '1 sándwich', 'muy fácil', 'Sin cocción',
    [
      '1 pan de completo (alargado) o 1 marraqueta',
      '1 vienesa de buena calidad',
      '1/2 palta Hass madura',
      '1 tomate maduro',
      'Sal y unas gotas de limón (para la palta)',
    ],
    [
      'Cuece la vienesa en agua hirviendo 5 minutos.',
      'Calienta el pan en el horno o plancha 2 minutos por lado.',
      'Pisa la palta con tenedor, agrégale sal y unas gotas de limón.',
      'Corta el tomate en cubos pequeños y sala ligeramente.',
      'Abre el pan, pon la vienesa, luego la palta, y encima el tomate.',
      'Sirve inmediatamente.',
    ],
    'El "dinámico" es el completo italiano sin mayonesa. Verde (palta) y rojo (tomate), pero sin el blanco (mayonesa). Algunos dicen que se llama así porque "se mueve" más que el italiano. Es la versión más saludable del completo, si es que eso es posible.',
    [
      { error: 'Palta negra', solucion: 'Usar palta poco madura o muy madura. La palta debe ceder al presionar sin deshacerse.' },
      { error: 'Tomate aguado', solucion: 'Salar el tomate con anticipación o usar uno muy maduro. Sala el tomate justo antes de armar y escúrrelo si es necesario.' },
      { error: 'Pan blando', solucion: 'No calentar el pan. Un pan frío arruina el sándwich.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'La vienesa y el pan se recalentan. La palta y el tomate, no.' }
  ),

  /* 83. Chupe de mariscos — se mantiene en categoría 'mar' */
  r('Chupe de mariscos', 'mar',
    ['marisco', 'sopa', 'olla', 'invierno', 'contundente', 'tradicional'],
    null, '50 min', '4 personas', 'media', 'Olla',
    [
      '500 g de mariscos variados (choritos, almejas, camarones, machas)',
      '300 g de pescado blanco (congrio, merluza) en trozos',
      '4 papas medianas en cubos',
      '1 cebolla grande picada fina',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros en cubos',
      '1 taza de vino blanco',
      '1 L de caldo de pescado',
      '1 taza de crema (o leche evaporada)',
      '2 cucharadas de mantequilla',
      'Pan rallado y queso parmesano para gratinar',
      'Sal, pimienta, merkén y orégano',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón en mantequilla hasta que estén transparentes.',
      'Agrega los tomates y condimenta con sal, pimienta, merkén y orégano. Cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar el alcohol, unos 2 minutos.',
      'Agrega el caldo y las papas. Cocina 15 minutos hasta que las papas estén casi tiernas.',
      'Incorpora los mariscos, el pescado y la crema. Cocina 5-7 minutos más, solo hasta que los mariscos se abran.',
      'Reparte en pailas de greda individuales o en una fuente para horno.',
      'Espolvorea pan rallado y queso parmesano por encima. Gratina 3-5 minutos en el horno a 200 °C, hasta dorar.',
    ],
    'El chupe es una preparación de origen andino que en Chile se volvió plato de mariscos. La versión chilena es más espesa que la peruana y siempre lleva papas. En el sur de Chile se hace con mariscos locales (cholgas, choritos, picorocos). En las pailas de greda el calor se mantiene por más tiempo.',
    [
      { error: 'Mariscos gomosos', solucion: 'Cocinarlos demasiado. Los mariscos se hacen en 5-7 minutos. Si los dejas más, se endurecen como caucho.' },
      { error: 'Chupe aguado', solucion: 'No dejar reducir o usar poco pan rallado. El chupe debe tener consistencia de guiso espeso. Si queda líquido, agrega más pan rallado o deja reducir unos minutos destapado.' },
      { error: 'Sabe a "pescado viejo"', solucion: 'Usar mariscos que no están frescos. Los mariscos deben oler a mar, no a pescado fuerte. Si usas congelados, descongela en el refrigerador la noche anterior.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético. Al ser mariscos, es muy perecedero.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, agregando un poco de caldo si espesa demasiado.' }
  ),

  /* 84. Empanadas de mariscos — se mantiene en categoría 'mar' */
  r('Empanadas de mariscos', 'mar',
    ['empanada', 'marisco', 'horno', 'fritura', 'picoteo', 'fiestas patrias'],
    null, '90 min', '12 unidades', 'media', 'Horno o fritura',
    [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 120 g de manteca derretida',
      'Masa: 1 huevo',
      'Masa: 1 cucharadita de sal',
      'Masa: 200 ml de agua tibia (aprox.)',
      'Relleno: 300 g de mariscos variados (camarones, choritos, almejas)',
      'Relleno: 200 g de pescado blanco en cubos pequeños',
      'Relleno: 1 cebolla grande picada fina',
      'Relleno: 2 dientes de ajo picados',
      'Relleno: 1 tomate maduro picado',
      'Relleno: 1 cucharadita de merkén',
      'Relleno: 2 cucharadas de pan rallado',
      'Relleno: Sal, pimienta, orégano',
      'Pintar: 1 huevo batido',
    ],
    [
      'Prepara el relleno: sofríe la cebolla y el ajo en aceite. Agrega el tomate y condimenta con merkén, sal, pimienta y orégano.',
      'Cuando la cebolla esté transparente, agrega los mariscos y el pescado. Cocina 5 minutos, solo hasta que los mariscos se abran.',
      'Agrega el pan rallado para absorber el líquido. Mezcla bien y deja enfriar por completo. Es CLAVE que el relleno esté frío al armar.',
      'Prepara la masa: mezcla la harina con la sal, agrega la manteca, el huevo y el agua tibia. Amasa hasta que la masa esté lisa.',
      'Reposa la masa 30 minutos. Divídela en 12 bollos y estira cada uno en un disco de 15 cm.',
      'Rellena con 2 cucharadas del relleno frío. Humedece el borde, cierra con repulgue y pincha con un tenedor.',
      'Pinta con huevo batido. Hornea a 200 °C por 20-25 minutos, o fríe en abundante aceite caliente hasta dorar.',
    ],
    'Las empanadas de mariscos son el orgullo de las panaderías y restaurantes de la costa chilena. En Valparaíso, Viña del Mar y los pueblos del sur se venden en las calles. Tradicionalmente se hacen con mariscos locales: en Chiloé con cholgas, en el norte con camarones y machas, en la zona central con choritos y almejas.',
    [
      { error: 'Relleno aguado', solucion: 'No escurrir los mariscos o no agregar pan rallado. Los mariscos sueltan mucho líquido. Escúrrelos bien y agrega suficiente pan rallado para absorber.' },
      { error: 'Empanadas se abren en el horno', solucion: 'Relleno caliente o repulgue mal sellado. El relleno debe estar completamente frío. Haz un repulgue firme y pincha la superficie para que salga el vapor.' },
      { error: 'Saben a "mar viejo"', solucion: 'Usar mariscos que no están frescos. Usa mariscos muy frescos o congelados de buena calidad, descongelados en el refrigerador.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses crudas (armadas) o cocidas.', recalentar: 'Horno o freidora de aire a 180 °C por 5-10 minutos. Evita el microondas.' }
  ),

  /* 85. Guatitas — categoría: de-olla → principales */
  r('Guatitas', 'principales',
    ['guatitas', 'olla', 'popular', 'tradicional', 'invierno', 'casero'],
    null, '2 h', '4 personas', 'media', 'Olla',
    [
      '1 kg de guatitas de vacuno (mondongo)',
      '2 cebollas grandes picadas finas',
      '4 dientes de ajo picados',
      '2 zanahorias en cubos',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      '1 hoja de laurel',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Lava muy bien las guatitas con agua fría y limón varias veces. Este paso es CLAVE: las guatitas tienen olor fuerte y hay que lavarlas hasta que el agua salga clara.',
      'Cocina las guatitas en agua hirviendo con laurel y un chorrito de vinagre por 1 hora a 1 hora y media, hasta que estén tiernas. Escurre y corta en tiras o trozos.',
      'En otra olla, sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén transparentes.',
      'Agrega el tomate, el ají de color y el orégano. Cocina 5 minutos.',
      'Incorpora las guatitas cocidas y cubre con agua o caldo. Cocina a fuego lento 30 minutos más.',
      'Condimenta con sal y pimienta. Sirve caliente con papas cocidas o arroz.',
    ],
    'Las guatitas son un plato de origen popular, muy común en las fondas y en las casas de antaño. Se preparan con el estómago del vacuno (mondongo), que requiere larga cocción para ablandarse. Existen dos versiones: las "guatitas a la española" (con tomate y pimentón) y las "guatitas con salsa" (más cremosas, con huevo). En Chile son plato de invierno por excelencia.',
    [
      { error: 'Olor fuerte', solucion: 'No lavar bien las guatitas o no cambiar el agua durante la cocción. Lava varias veces con agua y limón hasta que el agua salga clara, y cambia el agua de cocción 2-3 veces.' },
      { error: 'Guatitas duras', solucion: 'Cocinar poco tiempo o a fuego muy alto. Las guatitas necesitan al menos 1 hora y media a fuego medio para ablandarse. Si están duras, sigue cocinando.' },
      { error: 'Sabor plano', solucion: 'No usar suficientes aliños. Las guatitas son un plato de sabor fuerte que necesita cebolla, ajo, ají de color y orégano generosos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego lento en la olla, agregando un poco de agua o caldo.' }
  ),

  /* 86. Chanfaina — categoría: de-olla → principales */
  r('Chanfaina', 'principales',
    ['chanfaina', 'olla', 'popular', 'tradicional', 'invierno', 'cordero'],
    null, '1 h 30 min', '4 personas', 'media', 'Olla',
    [
      '500 g de menudencias de cordero (hígado, corazón, pulmón, riñón)',
      '1 cebolla grande picada fina',
      '3 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '2 papas medianas en cubos',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      '1 hoja de laurel',
      '1 taza de caldo de cordero o agua',
      'Sal, pimienta y aceite',
    ],
    [
      'Lava bien las menudencias. Córtalas en trozos pequeños y uniformes.',
      'Sofríe la cebolla y el ajo en aceite hasta que estén transparentes.',
      'Agrega el pimentón y el tomate. Cocina 5 minutos hasta que se deshaga el tomate.',
      'Incorpora las menudencias y dóralas ligeramente. Condimenta con ají de color, orégano, sal y pimienta.',
      'Vierte el caldo, agrega el laurel y las papas. Cocina a fuego lento 30-40 minutos hasta que las papas estén tiernas.',
      'Rectifica la sal y sirve caliente con arroz o pan.',
    ],
    'La chanfaina es un plato de origen español que en Chile se volvió tradición campesina, especialmente en la zona central y sur. Se prepara con las menudencias del cordero que se faenaba en el campo. Antiguamente era un plato de "aprovechamiento": no se botaba nada del animal. Hoy es un plato de invierno muy apreciado por quienes crecieron comiéndolo.',
    [
      { error: 'Menudencias duras', solucion: 'Cocinar poco tiempo o a fuego muy alto. Las menudencias necesitan cocción lenta. Si están duras, sigue cocinando 15-20 minutos más.' },
      { error: 'Sabor demasiado fuerte', solucion: 'No lavar bien las menudencias. Lava varias veces con agua y limón antes de cocinar. El hígado y el riñón son los que tienen sabor más intenso.' },
      { error: 'Guiso aguado', solucion: 'No dejar reducir el caldo. Si queda muy líquido, destapa y deja reducir 10 minutos a fuego medio.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento en la olla, agregando un poco de caldo si espesa demasiado.' }
  ),

  /* 87. Cazuela de cordero — categoría: de-olla → principales */
  r('Cazuela de cordero', 'principales',
    ['cazuela', 'cordero', 'olla', 'invierno', 'patagonia', 'tradicional'],
    null, '1 h 30 min', '4 a 6 personas', 'fácil', 'Olla',
    [
      '1 kg de cordero en trozos (pierna, costillar o paleta)',
      '4 papas medianas en trozos',
      '1/2 zapallo en trozos',
      '2 zanahorias en rodajas',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 choclo cortado en trozos (opcional)',
      '1/2 taza de arroz (opcional)',
      '1 hoja de laurel',
      '1 cucharadita de orégano',
      '1 cucharadita de merkén (opcional)',
      'Agua o caldo para cubrir',
      'Sal y pimienta',
    ],
    [
      'En una olla grande, dora la carne de cordero en aceite caliente hasta que esté dorada por todos lados. Retira y reserva.',
      'En la misma olla, sofríe la cebolla y el ajo hasta que estén transparentes.',
      'Devuelve la carne a la olla. Agrega agua o caldo frío hasta cubrir, el laurel y el orégano.',
      'Lleva a hervor, baja el fuego y cocina tapado 45 minutos.',
      'Agrega las zanahorias, las papas, el zapallo y el choclo. Cocina 20 minutos más.',
      'Si usas arroz, agrégalo en los últimos 15 minutos de cocción.',
      'Condimenta con sal, pimienta y merkén. Sirve caliente en platos hondos con el caldo.',
    ],
    'La cazuela de cordero es plato típico de la Patagonia chilena (Magallanes y Aysén), donde el cordero es la carne principal. En el resto de Chile se hace con menos frecuencia, pero es igual de tradicional. Se sirve con merkén, el ají ahumado mapuche, que le da un sabor único. En Magallanes se hace con cordero fresco de la zona; en el resto del país se puede usar cordero congelado.',
    [
      { error: 'Carne dura', solucion: 'Cocinar poco tiempo o a fuego muy alto. El cordero necesita cocción lenta y prolongada. Al menos 1 hora a fuego medio-bajo.' },
      { error: 'Caldo grasiento', solucion: 'No retirar la grasa. A mitad de la cocción, retira la grasa que flota en la superficie con una cuchara. El cordero suelta bastante grasa.' },
      { error: 'Verduras deshechas', solucion: 'Agregar todas las verduras al principio. Agrega las papas y el zapallo a mitad de cocción, y el choclo al final, según su dureza.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego lento en la olla con un poco de agua o caldo.' }
  ),

  /* 88. Chupe de locos — se mantiene en categoría 'mar' */
  r('Chupe de locos', 'mar',
    ['marisco', 'loco', 'horno', 'paila', 'lujo', 'tradicional'],
    null, '50 min', '4 personas', 'media', 'Horno',
    [
      '4 locos frescos medianos (o 400 g de carne de loco cocida)',
      '1 cebolla grande picada fina',
      '3 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '2 cucharadas de mantequilla',
      '1 taza de crema',
      '1/2 taza de vino blanco',
      '1 taza de pan rallado',
      '150 g de queso parmesano rallado',
      '1 cucharadita de merkén',
      'Sal, pimienta y orégano',
    ],
    [
      'Si usas locos frescos, cocínalos en agua hirviendo con sal por 40-45 minutos, hasta que estén tiernos. Deja enfriar en el agua y córtalos en láminas de 1 cm de grosor.',
      'Sofríe la cebolla, el ajo y el pimentón en mantequilla hasta que estén transparentes. Agrega el tomate y cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar el alcohol. Condimenta con merkén, sal, pimienta y orégano.',
      'Incorpora la crema y cocina 2 minutos, hasta que la salsa espese ligeramente.',
      'Reparte la mitad de la salsa en pailas de greda individuales. Coloca encima las láminas de loco.',
      'Cubre con el resto de la salsa, espolvorea pan rallado y luego el queso parmesano.',
      'Gratina a 200 °C por 8-10 minutos, hasta que el queso esté dorado y burbujeante.',
    ],
    'El loco (Concholepas concholepas) es un caracol marino endémico de las costas chilenas y peruanas. Su carne es firme, dulce y muy apreciada. El chupe de locos es el plato de lujo del mar chileno: se sirve en las mejores marisquerías y en las casas para ocasiones especiales. En Chile existe una veda del loco por temporadas, así que muchas veces se encuentra fresco solo en ciertos meses del año.',
    [
      { error: 'Locos duros como caucho', solucion: 'No cocerlos el tiempo suficiente o cocerlos a fuego muy fuerte. Cocínalos por al menos 40 minutos a fuego medio y déjalos enfriar en su propio caldo.' },
      { error: 'Sabe a "mar viejo"', solucion: 'Usar locos que no están frescos. Si compras frescos, pídelos vivos: la concha debe cerrarse al tocarla. Si usas conserva, escúrrela y enjuaga bien.' },
      { error: 'Chupe aguado', solucion: 'No escurrir bien los locos o usar poca crema. Escurre bien los locos y usa crema espesa. Si queda aguado, agrega una cucharada extra de pan rallado.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado. Los locos pierden textura.', recalentar: 'Horno a 180 °C por 10 minutos, cubierto con papel aluminio los primeros 5 minutos.' }
  ),

  /* 89. Arrollado huaso */
  r('Arrollado huaso', 'principales',
    ['arrollado', 'cordero', 'cerdo', 'frio', 'picoteo', 'tradicional', 'campo'],
    null, '3 h + reposo de 12 h', '8 a 10 personas', 'media', 'Olla',
    [
      '1 kg de pulpa de cerdo (o mezcla de cerdo y vacuno)',
      '200 g de tocino en tiras',
      '3 dientes de ajo picados',
      '1 cucharada de ají de color',
      '1 cucharadita de orégano',
      '1 cucharadita de comino',
      '1/2 cucharadita de pimienta negra molida',
      '1 cucharada de sal gruesa',
      '1 taza de vinagre de vino tinto',
      '1 taza de agua',
      '1 hoja de laurel',
      'Un paño de algodón limpio (o gasa quirúrgica)',
      'Cordel de cocina',
    ],
    [
      'Extiende la carne sobre una superficie plana. Si tiene partes gruesas, ábrelas en mariposa para que quede pareja. Sazona con sal, ajo, ají de color, orégano, comino y pimienta.',
      'Coloca las tiras de tocino a lo largo sobre la carne. Enrolla la carne sobre sí misma, apretando bien para que no queden huecos.',
      'Ata el arrollado con cordel de cocina dando vueltas cada 3 cm, como si fuera un asado. Esto mantiene la forma durante la cocción.',
      'Envuelve el arrollado en el paño de algodón, apretando firmemente. Ata el paño con más cordel en varios puntos para que quede compacto.',
      'En una olla grande, pon el arrollado envuelto, el vinagre, el agua, el laurel y sal. El líquido debe cubrir el arrollado por la mitad.',
      'Cocina tapado a fuego medio-bajo por 2 horas, dando vuelta cada 30 minutos. El arrollado debe estar muy tierno.',
      'Retira del fuego y deja enfriar en el líquido de cocción. Refrigera al menos 12 horas con el paño puesto.',
      'Al día siguiente, retira el paño y el cordel. Corta en láminas finas y sirve frío con pebre, pan amasado y ensalada chilena.',
    ],
    'El arrollado huaso es un plato tradicional del campo chileno, especialmente de la zona central. Se sirve en fiestas patrias, matrimonios y celebraciones. La clave es la cocción lenta y el reposo en frío, que le da esa textura firme y compacta. El nombre "huaso" hace referencia al campesino chileno, y es un plato que se comía tradicionalmente después de las faenas agrícolas.',
    [
      { error: 'Se desarma al cortar', solucion: 'No atar bien o no dejar reposar en frío. El cordel y el paño son esenciales, y el reposo en frío (mínimo 12 horas) es lo que permite cortar en láminas sin que se deshaga.' },
      { error: 'Sabe a "cerdo viejo"', solucion: 'Usar carne que no está fresca o no usar suficientes especias. Los aliños (ají de color, comino, orégano) son esenciales para darle carácter. Usa carne fresca de buena calidad.' },
      { error: 'Queda seco', solucion: 'Cocinar demasiado o con poca grasa. Usa carne con algo de grasa (el tocino ayuda). Y cocina con el líquido cubriendo la mitad del arrollado, dando vuelta cada 30 min.' },
    ],
    { refrigerador: 'Hasta 5 días bien envuelto en paño o papel aluminio.', congelador: 'Hasta 2 meses, en porciones.', recalentar: 'Se sirve frío. No se recalienta.' }
  ),

  /* 90. Milcao */
  r('Milcao', 'panes',
    ['milcao', 'chiloe', 'papa', 'patrimonio', 'tradicional', 'fritura', 'sur'],
    null, '1 h 30 min', '12 milcaos', 'media', 'Olla o fritura',
    [
      '1 kg de papas crudas',
      '500 g de papas cocidas y hechas puré',
      '100 g de manteca derretida (o chicharrones picados)',
      '2 cucharaditas de sal',
      'Opcional: chicharrones de cerdo picados para rellenar',
      'Aceite para freír (si se fríen)',
    ],
    [
      'Ralla las papas crudas por el lado fino del rallador. Colócalas en un paño limpio y exprímelas muy bien para sacar todo el líquido. Deben quedar secas.',
      'Pela y cuece las otras 500 g de papas. Hazlas puré y mézclalas con la manteca derretida y la sal.',
      'Combina las papas ralladas (bien escurridas) con el puré de papas. Amasa hasta obtener una masa homogénea y firme.',
      'Toma porciones del tamaño de una naranja y aplánalas en la palma de la mano. Si quieres, pon una cucharadita de chicharrones al centro, cierra y aplana de nuevo.',
      'Para la versión tradicional (cocida): envuelve cada milcao en un paño de algodón (o en hoja de repollo), átalo con cordel y cuécelo en agua hirviendo con sal por 30-40 minutos.',
      'Para la versión frita: fríe los milcaos en abundante aceite caliente hasta que estén dorados por ambos lados (3-4 minutos por lado).',
      'Sirve calientes, con pebre o como acompañamiento de curanto y cazuelas.',
    ],
    'El milcao es un plato de Chiloé, declarado Patrimonio de la Humanidad por la UNESCO junto con la cocina chilota. Es un "pan de papa" que se hace rallando papa cruda y mezclándola con puré. Se sirve con curanto, con cazuela, o solo con pebre. En Chiloé se prepara tradicionalmente en grandes cantidades para el curanto en hoyo. La versión frita es la más común en el resto de Chile, pero en Chiloé se prepara cocido al vapor envuelto en paño.',
    [
      { error: 'Queda aguado', solucion: 'No escurrir bien las papas ralladas. Es el paso más importante: exprímelas en un paño hasta que no suelten ni una gota de agua. Si queda agua, el milcao no toma forma.' },
      { error: 'Se deshace al cocinar', solucion: 'Poca proporción de puré o masa muy aguada. La mezcla debe ser 2/3 papa cruda rallada + 1/3 puré. Si la masa queda muy blanda, agrega un poco más de puré.' },
      { error: 'Sabe muy simple', solucion: 'No usar manteca o chicharrones. La grasa es esencial para el sabor y la textura. No omitas la manteca.' },
    ],
    { refrigerador: 'Hasta 3 días cocidos en recipiente hermético.', congelador: 'Hasta 3 meses crudos o cocidos, en bolsa hermética.', recalentar: 'Fritos en sartén 2-3 minutos. O al vapor si eran cocidos.' }
  ),

  /* 91. Cordero al palo */
  r('Cordero al palo', 'principales',
    ['cordero', 'asado', 'patagonia', 'fuego', 'tradicional', 'magallanes', 'parrilla'],
    null, '5 h', '8 a 10 personas', 'media', 'Fuego abierto',
    [
      '1 cordero entero (10-12 kg) o 1 pierna grande (3-4 kg)',
      '3 cucharadas de sal gruesa',
      '2 cucharadas de merkén',
      '1 cucharada de orégano seco',
      '1 cucharada de pimienta negra molida',
      '4 dientes de ajo machacados',
      'Leña de roble o espino (o carbón de leña)',
      '1 palo largo de madera dura (o hierro) para ensartar',
      'Alambre o cordel para atar',
    ],
    [
      'Prepara el fuego: enciende la leña en un hoyo poco profundo o en un asador. Necesitas brasas abundantes y parejas. La leña de roble o espino da el mejor sabor.',
      'Sazona el cordero generosamente por dentro y por fuera con sal, merkén, orégano, pimienta y ajo. La sal debe cubrir toda la superficie.',
      'Ensarta el cordero en el palo largo, de la cabeza a la cola si es entero. Ata las patas y las costillas con alambre o cordel para que no se muevan.',
      'Coloca el palo sobre el fuego, a unos 30-40 cm de las brasas. El cordero debe girar lentamente para cocinarse parejo.',
      'Cocina por 4-5 horas, girando constantemente. La clave es la paciencia: el cordero se cocina por irradiación del calor, no directamente sobre las llamas.',
      'A medida que se cocine, la piel se va dorando y crujiendo. Si algún punto se dora demasiado rápido, mueve las brasas o sube el palo.',
      'Está listo cuando la carne se separa del hueso fácilmente y la piel está crujiente y dorada.',
      'Retira del fuego, deja reposar 15 minutos y corta en presas. Sirve con papas cocidas o ensalada a la chilena.',
    ],
    'El cordero al palo es el plato más emblemático de la Patagonia chilena (Magallanes y Aysén). En Puerto Natales y Punta Arenas es tradición ofrecerlo en las fondas y en las fiestas. La técnica es de origen tehuelche y mapuche: la carne se ensarta en un palo y se cocina junto al fuego, nunca directamente sobre él. La leña de roble o espino (también llamada "leña de la Patagonia") es la que da el sabor ahumado característico.',
    [
      { error: 'Cordero crudo por dentro y quemado por fuera', solucion: 'Fuego demasiado fuerte o palo muy cerca de las brasas. El cordero se cocina por irradiación: el palo debe estar a 30-40 cm de las brasas, y el fuego debe ser constante pero no intenso.' },
      { error: 'Carne seca', solucion: 'Cordero sin grasa o cocción demasiado rápida. Usa cordero con algo de grasa (los corderos magallánicos son naturalmente magros pero tienen grasa). Cocina lentamente, sin apuro.' },
      { error: 'Se quema y sabe amargo', solucion: 'Piel con mucha grasa que gotea sobre las brasas y hace llama. Mantén las brasas parejas y retira la grasa que gotea si hace mucha llama.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, en porciones.', recalentar: 'Horno o parrilla a 180 °C por 15 minutos para que recupere la textura.' }
  ),

  /* 93. Curanto en hoyo */
  r('Curanto en hoyo', 'principales',
    ['curanto', 'chiloé', 'patrimonio', 'hoyo', 'marisco', 'tradicional', 'fiesta'],
    null, '4 h', '10 a 12 personas', 'alta', 'Horno de tierra',
    [
      '2 kg de almejas frescas',
      '2 kg de cholgas',
      '2 kg de choritos',
      '1 kg de picorocos',
      '1 kg de pollo en presas',
      '1 kg de carne de cerdo en trozos',
      '2 longanizas',
      '6 papas grandes',
      '6 camotes',
      '1 kg de milcaos (ver receta)',
      '1 kg de chapaleles',
      'Hojas grandes de nalca, pangue o repollo',
      'Piedras volcánicas o de río grandes',
      'Leña seca abundante',
    ],
    [
      'Escoge un terreno sin raíces. Excava un hoyo de 1 m de diámetro por 60 cm de profundidad. Reserva la tierra.',
      'Enciende una fogata abundante dentro del hoyo y coloca encima las piedras. Deja que se calienten al rojo vivo por 1,5 a 2 horas.',
      'Mientras se calientan las piedras, lava bien los mariscos y prepara las carnes. Sala todo generosamente.',
      'Retira la mitad de las piedras calientes con una pala (con mucho cuidado) y reserva.',
      'Coloca una cama de hojas de nalca o pangue en el fondo. Encima pon la mitad de las piedras calientes y cubre con más hojas.',
      'Ordena por capas: primero las carnes y longanizas, luego los mariscos con concha hacia abajo (para que suelten su jugo), después las papas, camotes, milcaos y chapaleles.',
      'Cubre todo con el resto de las piedras calientes y una capa gruesa de hojas.',
      'Sella el hoyo con la tierra que sacaste. La tierra atrapa el calor y cocina al vapor.',
      'Deja cocinar 1,5 a 2 horas sin destapar. Destapa con cuidado y sirve en una mesa grande, todo junto, para compartir.',
    ],
    'El curanto en hoyo es Patrimonio Cultural Inmaterial de la Humanidad (UNESCO, 2006, junto con la cocina chilota). Su nombre viene del mapudungun "curantü": "piedra caliente". Es el plato más importante de Chiloé y se prepara en fiestas comunitarias. Los mariscos van con la concha hacia abajo para que su jugo no se pierda y se mezcle con los demás ingredientes.',
    [
      { error: 'La comida no se cocina', solucion: 'Piedras no suficientemente calientes o se destapa antes de tiempo. Las piedras deben estar al rojo vivo antes de poner la comida. No destapes el hoyo hasta que pasen al menos 1,5 horas.' },
      { error: 'Sabe a tierra', solucion: 'No poner suficientes hojas entre la tierra y la comida. Las hojas de nalca o pangue son la barrera entre la tierra y los alimentos. Deben cubrir toda la superficie.' },
      { error: 'Mariscos crudos o gomosos', solucion: 'No distribuir bien las capas. Los mariscos van cerca de las piedras calientes de arriba, no en el fondo. Y deben abrirse durante la cocción; si no abren, descártalos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado: los mariscos y las papas pierden textura.', recalentar: 'Horno a 180 °C por 15 minutos, cubierto con papel aluminio, o al vapor.' }
  ),

  /* 94. Curanto en olla */
  r('Curanto en olla', 'principales',
    ['curanto', 'chiloé', 'olla', 'marisco', 'tradicional', 'fiesta'],
    null, '1 h 30 min', '6 personas', 'media', 'Olla',
    [
      '1 kg de almejas',
      '1 kg de choritos',
      '500 g de cholgas',
      '500 g de pollo en presas',
      '500 g de carne de cerdo en trozos',
      '1 longaniza en rodajas',
      '4 papas medianas',
      '2 camotes',
      '4 milcaos (ver receta)',
      '4 chapaleles',
      '1 cebolla grande en pluma',
      '1 taza de vino blanco',
      'Hojas de repollo o de nalca',
      'Sal y merkén',
    ],
    [
      'En el fondo de una olla grande (o paila de greda), pon una cama de hojas de repollo o nalca.',
      'Encima distribuye la cebolla en pluma y las carnes: pollo, cerdo y longaniza.',
      'Añade el vino blanco y ½ taza de agua. Tapa y cocina 20 minutos a fuego medio.',
      'Agrega los mariscos con concha hacia abajo, encima las papas y los camotes pelados.',
      'Coloca encima los milcaos y chapaleles, envueltos en hojas si quieres que no se deshagan.',
      'Tapa la olla con fuerza y cocina 30-40 minutos más a fuego medio-bajo, sin destapar.',
      'Sirve todo junto en una fuente grande, con el caldo de cocción aparte.',
    ],
    'El curanto en olla (o "curanto al chilote") es la versión doméstica del curanto en hoyo. Nació para poder preparar el plato en casa, sin tener que cavar un hoyo. El sabor es similar, aunque menos ahumado. Es el plato típico de las fiestas chilotes en cualquier casa.',
    [
      { error: 'Mariscos gomosos o crudos', solucion: 'Cocinar demasiado tiempo o destapar la olla. Los mariscos se abren solos con el vapor. No destapes la olla durante la cocción, o el vapor se escapa y no se cocinan.' },
      { error: 'Se quema el fondo', solucion: 'No poner suficiente líquido. La cama de hojas evita que se pegue, pero agrega medio vaso de agua o vino si ves que se está secando.' },
      { error: 'Sabe a "mar viejo"', solucion: 'Usar mariscos que no están frescos. El curanto depende de mariscos muy frescos. Lávalos bien y descarta los que estén abiertos antes de cocinar.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Al vapor o en olla tapada a fuego bajo con un poco de agua.' }
  ),

  /* 95. Panqueques con manjar */
  r('Panqueques con manjar', 'dulces',
    ['panqueque', 'once', 'dulce', 'manjar', 'desayuno', 'simple'],
    null, '20 min', '8 a 10 panqueques', 'muy fácil', 'Sartén',
    [
      '2 huevos',
      '1 taza de leche',
      '1 taza de harina sin polvos de hornear',
      '1 cucharada de azúcar',
      '1 pizca de sal',
      '1 cucharada de mantequilla derretida',
      'Manjar (dulce de leche) para rellenar',
    ],
    [
      'Bate los huevos con la leche, el azúcar y la sal.',
      'Incorpora la harina cernida y mezcla hasta obtener una masa lisa. Agrega la mantequilla derretida.',
      'Deja reposar la mezcla 15 minutos: esto hace que los panqueques no se rompan.',
      'Calienta una sartén antiadherente a fuego medio. Unta con un poquito de mantequilla.',
      'Vierte un cucharón de mezcla y extiende girando la sartén. Cocina 1-2 minutos, hasta que los bordes se despeguen.',
      'Da vuelta con una espátula y cocina 30 segundos más. Retira y repite con el resto.',
      'Rellena con manjar, dobla en cuatro y sirve tibios. Si quieres, espolvorea azúcar flor.',
    ],
    'El panqueque con manjar es el favorito de la once chilena, sobre todo en la infancia. Se puede hacer versión "con dulce de leche" (igual) o "con manjar y plátano". Hay familias que los hacen finos y otras gruesos: la textura depende de la cantidad de leche.',
    [
      { error: 'Se rompen al darlos vuelta', solucion: 'No dejar reposar la mezcla o batir demasiado. Deja reposar 15 minutos y no batas en exceso: solo hasta integrar.' },
      { error: 'Quedan gordos y crudos', solucion: 'Echar demasiada mezcla o sartén muy caliente. Usa un cucharón pequeño y extiende bien. La sartén debe estar a fuego medio, no alto.' },
      { error: 'Se pegan a la sartén', solucion: 'Sartén fría o sin grasa. Calienta bien la sartén antes de echar la primera mezcla y úntala con un poquito de mantequilla.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético, separados con papel.', congelador: 'Hasta 2 meses, ya cocidos y separados con papel.', recalentar: 'Sartén a fuego medio 30 segundos por lado, o microondas 20 segundos.' }
  ),

  /* 96. Tortillas de rescoldo */
  r('Tortillas de rescoldo', 'panes',
    ['pan', 'rescoldo', 'ceniza', 'campo', 'tradicional', 'patrimonio'],
    null, '40 min', '8 tortillas', 'media', 'Brasas',
    [
      '500 g de harina sin polvos de hornear',
      '1 cucharadita de sal',
      '1 cucharadita de polvos de hornear',
      '100 g de manteca derretida',
      '200 ml de agua tibia (aprox.)',
    ],
    [
      'Mezcla la harina con la sal y los polvos de hornear.',
      'Agrega la manteca derretida y trabaja con las manos hasta que quede como arena gruesa.',
      'Añade el agua tibia de a poco y amasa hasta obtener una masa suave que no se pegue.',
      'Forma 8 bollos y aplánalos con la mano hasta que queden de 1 cm de grosor.',
      'Prepara brasas abundantes (de leña o carbón). Deja que se forme una capa de ceniza blanca sobre las brasas.',
      'Entierra las tortillas en la ceniza caliente, tapándolas bien. Cocina 5-7 minutos por lado.',
      'Retira con cuidado, sacude la ceniza con un paño limpio y sirve calientes.',
    ],
    'La tortilla de rescoldo es el pan más antiguo de Chile. Se cocía en las brasas del fogón, enterrada en la ceniza caliente. Hoy se sigue haciendo en el campo, en fiestas costumbristas y en fondas. Su nombre viene de "rescoldo": la brasa o ceniza caliente. Es Patrimonio Cultural de Chile.',
    [
      { error: 'Se queman por fuera y quedan crudas', solucion: 'Brasas demasiado fuertes o tortillas muy gruesas. Deja que las brasas se cubran de ceniza blanca y aplana bien las tortillas a 1 cm de grosor.' },
      { error: 'Sabe a ceniza', solucion: 'No limpiarlas bien al sacarlas. Pásalas por un paño limpio y seco antes de servir, o sopla la ceniza restante.' },
      { error: 'Masa dura', solucion: 'Amasado excesivo o falta de grasa. La manteca es clave para la textura. Amasa solo hasta integrar.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 2 meses.', recalentar: 'Horno o sartén a fuego medio 2 minutos por lado.' }
  ),

  /* 97. Frutillas con crema */
  r('Frutillas con crema', 'dulces',
    ['postre', 'frutilla', 'crema', 'verano', 'simple', 'tradicional'],
    null, '10 min + frío', '4 personas', 'muy fácil', 'Sin cocción',
    [
      '500 g de frutillas frescas',
      '300 ml de crema para batir bien fría',
      '3 cucharadas de azúcar flor',
      '1 cucharadita de esencia de vainilla (opcional)',
    ],
    [
      'Lava las frutillas con cuidado y retira los tallos. Córtalas por la mitad o en rodajas.',
      'Bate la crema bien fría con el azúcar flor y la vainilla hasta que forme picos suaves. No la batas de más o se cortará.',
      'Reparte las frutillas en copas o platos.',
      'Cubre con la crema batida. Refrigera 20 minutos antes de servir.',
    ],
    'Las frutillas con crema son el postre de verano chileno por excelencia. En Chile se consumen sobre todo entre noviembre y febrero. La tradición dice que se sirven en copas de vidrio y que la crema debe batirse a mano. En el sur, las frutillas de Huilo Huilo o de la zona de Talca son famosas.',
    [
      { error: 'La crema no monta', solucion: 'La crema no está bien fría o tiene poca grasa. Usa crema para batir con al menos 35% de grasa y mantenla en el refrigerador hasta el momento de batir.' },
      { error: 'La crema se corta', solucion: 'Batir de más o a temperatura ambiente. Bate hasta que forme picos suaves y detente. Si se corta, agrega 1 cucharada de crema fría y vuelve a batir.' },
      { error: 'Sabe aguada', solucion: 'Frutillas muy maduras o mal escurridas. Lava y seca bien las frutillas antes de usar.' },
    ],
    { refrigerador: 'Hasta 1 día, con la crema batida aparte. Se recomienda consumir al momento.', congelador: 'No recomendado, la crema se corta.', recalentar: 'Se consume bien frío.' }
  ),

  /* 98. Chirimoya alegre */
  r('Chirimoya alegre', 'bebidas',
    ['bebida', 'chirimoya', 'jugo', 'verano', 'fruta', 'postre', 'simple'],
    null, '10 min', '4 vasos', 'muy fácil', 'Sin cocción',
    [
      '1 chirimoya grande madura',
      '2 tazas de jugo de naranja recién exprimido',
      '2 cucharadas de azúcar (ajustar al gusto)',
      'Hielo',
      'Opcional: hojas de menta',
    ],
    [
      'Pela la chirimoya y retira las semillas. Corta la pulpa en trozos.',
      'En una juguera, mezcla la pulpa con el jugo de naranja y el azúcar.',
      'Licúa hasta obtener una mezcla homogénea pero con un poco de textura.',
      'Prueba y ajusta el azúcar.',
      'Sirve bien frío en vasos altos con hielo. Decora con menta si quieres.',
    ],
    'La chirimoya alegre es una de las bebidas más chilenas que existen. La chirimoya es una fruta originaria de los Andes, muy aromática y dulce. Se le dice "alegre" justamente por su sabor y color. En Chile se consume sobre todo entre abril y septiembre. También existe la versión "chirimoya alegre con vino" o "con pisco", que se hace agregando un chorrito de alcohol.',
    [
      { error: 'Sabe amarga o con pepas', solucion: 'No retirar bien las semillas. Las semillas de chirimoya son tóxicas y amargas. Retíralas todas con cuidado antes de licuar.' },
      { error: 'Textura arenosa', solucion: 'Chirimoya poco madura o muy madura. La chirimoya debe ceder al presionar sin estar deshecha.' },
      { error: 'Demasiado dulce', solucion: 'Agregar azúcar sin probar. La chirimoya es naturalmente dulce. Prueba antes de agregar azúcar.' },
    ],
    { refrigerador: 'Hasta 1 día en jarra cerrada. Agítala antes de servir.', congelador: 'No recomendado, la chirimoya se oxida y pierde textura.', recalentar: 'Se consume bien frío.' }
  ),

  /* 99. Cazuela de mariscos — categoría: sopas → principales */
  r('Cazuela de mariscos', 'principales',
    ['cazuela', 'marisco', 'sopa', 'olla', 'costa', 'invierno'],
    null, '40 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de mariscos variados (choritos, almejas, camarones)',
      '300 g de pescado blanco en trozos',
      '4 papas medianas en trozos',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 zanahoria en rodajas',
      '1 L de caldo de pescado o agua',
      '½ taza de vino blanco',
      'Sal, pimienta, orégano y merkén',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón en aceite hasta que estén transparentes.',
      'Agrega el tomate y la zanahoria. Condimenta con sal, pimienta, orégano y merkén. Cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar el alcohol.',
      'Añade el caldo o agua y las papas. Cocina 15 minutos hasta que las papas estén casi tiernas.',
      'Incorpora los mariscos y el pescado. Cocina 5-7 minutos más, solo hasta que los mariscos se abran y el pescado esté cocido.',
      'Rectifica la sal y sirve caliente con perejil fresco.',
    ],
    'La cazuela de mariscos es la versión marina de la cazuela de vacuno. Es típica de la costa chilena y se prepara con los mariscos de la zona: en el norte con camarones y machas, en la zona central con choritos y almejas, en el sur con cholgas y picorocos.',
    [
      { error: 'Mariscos gomosos', solucion: 'Cocinarlos demasiado. Los mariscos se hacen en 5-7 minutos. Si los dejas más, se endurecen.' },
      { error: 'Caldo soso', solucion: 'Usar agua en vez de caldo de pescado. El caldo de pescado le da la profundidad que necesita. Si usas agua, agrega una hoja de laurel y una ramita de apio.' },
      { error: 'Sabe a "mar viejo"', solucion: 'Usar mariscos que no están frescos. Los mariscos deben oler a mar. Lávalos bien y descarta los que estén abiertos antes de cocinar.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético. Al ser mariscos, es muy perecedero.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, evitando hervir para que los mariscos no se endurezcan.' }
  ),

  /* 100. Pastel de pescado */
  r('Pastel de pescado', 'principales',
    ['pescado', 'pastel', 'horno', 'casero', 'tradicional'],
    null, '1 h', '4 personas', 'media', 'Horno',
    [
      '600 g de filetes de pescado blanco (merluza, reineta o congrio)',
      '4 papas grandes',
      '½ taza de leche',
      '2 cucharadas de mantequilla',
      '1 cebolla grande picada fina',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 taza de pan rallado',
      '50 g de queso parmesano rallado',
      'Sal, pimienta, orégano y ají de color',
    ],
    [
      'Cuece las papas en agua con sal hasta que estén tiernas. Haz un puré con la leche y la mantequilla. Reserva.',
      'Sofríe la cebolla, el ajo y el pimentón hasta que estén transparentes. Agrega el tomate y condimenta con sal, pimienta, orégano y ají de color. Cocina 5 minutos.',
      'Agrega el pescado en trozos y cocina 3-4 minutos, hasta que se desmenuce fácilmente. Rectifica la sal.',
      'En una fuente para horno, extiende la mitad del puré. Encima distribuye el guiso de pescado.',
      'Cubre con el resto del puré y alisa la superficie con un tenedor.',
      'Espolvorea pan rallado y queso parmesano por encima.',
      'Hornea a 200 °C por 20-25 minutos, hasta que la superficie esté dorada.',
    ],
    'El pastel de pescado es el hermano marino del pastel de choclo y del pastel de papas. Se hace en las casas chilenas sobre todo en Cuaresma y en la costa. Se puede usar pescado fresco o congelado. En el sur se hace con salmón o con congrio; en la zona central con merluza.',
    [
      { error: 'Queda aguado', solucion: 'No escurrir bien el pescado o el tomate. Escurre el pescado y cocina el guiso hasta que se seque un poco. El puré debe quedar espeso.' },
      { error: 'Sabe a pescado fuerte', solucion: 'Usar pescado que no está fresco o no condimentar bien. Usa pescado fresco y condimenta generosamente con orégano y ají de color.' },
      { error: 'Se desarma al servir', solucion: 'No dejar reposar antes de cortar. Deja reposar 10 minutos fuera del horno antes de porcionar.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, el puré se aguada.', recalentar: 'Horno a 180 °C por 15 minutos.' }
  ),

  /* 101. Pernil de cerdo */
  r('Pernil de cerdo', 'principales',
    ['cerdo', 'pernil', 'horno', 'fiesta', 'sandwich', 'navidad'],
    null, '3 h + reposo', '10 a 12 personas', 'media', 'Horno',
    [
      '1 pernil de cerdo de 4 a 5 kg (con hueso)',
      '6 dientes de ajo machacados',
      '2 cucharadas de sal gruesa',
      '1 cucharada de pimienta negra molida',
      '2 cucharadas de ají de color',
      '1 cucharada de orégano seco',
      '1 taza de vinagre de vino tinto',
      '1 taza de vino blanco',
      '2 cebollas en pluma',
      '2 zanahorias en rodajas',
      '2 hojas de laurel',
    ],
    [
      'Mezcla el ajo, la sal, la pimienta, el ají de color y el orégano para formar una pasta. Unta el pernil por todos lados.',
      'Coloca el pernil en una fuente para horno con las cebollas, zanahorias y laurel. Vierte el vinagre y el vino.',
      'Marina en el refrigerador al menos 12 horas (mejor 24), dando vuelta cada tanto.',
      'Precalienta el horno a 180 °C. Cubre el pernil con papel aluminio y hornea 2 horas, bañándolo con su jugo cada 30 minutos.',
      'Sube el horno a 200 °C, retira el aluminio y hornea 30-40 minutos más, hasta que la piel esté dorada y crujiente.',
      'Deja reposar 15 minutos antes de cortar. Sirve en láminas, con su jugo y las verduras asadas.',
    ],
    'El pernil de cerdo es el plato central de la Navidad y Año Nuevo chilenos, aunque también se sirve en cumpleaños y fiestas. Se come caliente con papas o ensalada, y frío en sándwiches. En Chile se suele adobar con ají de color, orégano y ajo. La clave es la cocción lenta y el reposo antes de cortar.',
    [
      { error: 'Carne seca', solucion: 'Cocinar de más o no bañarlo con su jugo. El pernil debe cocinarse cubierto la mayor parte del tiempo y bañarse cada 30 minutos con su jugo.' },
      { error: 'Piel blanda', solucion: 'No subir la temperatura al final. Para que la piel quede crujiente, los últimos 30 minutos deben ser a 200 °C sin aluminio.' },
      { error: 'Sabe a cerdo fuerte', solucion: 'No marinar el tiempo suficiente. El marinado con vinagre y especias es clave para quitarle el sabor fuerte al cerdo. Mínimo 12 horas.' },
    ],
    { refrigerador: 'Hasta 5 días en recipiente hermético, en su jugo.', congelador: 'Hasta 2 meses en porciones.', recalentar: 'Horno a 160 °C por 15-20 minutos, cubierto con aluminio y bañado con su jugo.' }
  ),

  /* 102. Arrollado de malaya */
  r('Arrollado de malaya', 'principales',
    ['arrollado', 'malaya', 'vacuno', 'frio', 'picoteo', 'tradicional'],
    null, '2 h + reposo de 12 h', '8 a 10 personas', 'media', 'Olla',
    [
      '1 malaya de vacuno (1,5 a 2 kg)',
      '200 g de tocino en tiras',
      '2 zanahorias cocidas en bastones',
      '3 huevos duros',
      '3 dientes de ajo machacados',
      '1 cucharada de ají de color',
      '1 cucharadita de orégano',
      '1 cucharadita de comino',
      '1 cucharada de sal',
      '1 cucharadita de pimienta negra',
      '1 taza de vinagre',
      '1 hoja de laurel',
      'Cordel de cocina',
    ],
    [
      'Extiende la malaya sobre una superficie plana. Sazona con sal, ajo, ají de color, orégano, comino y pimienta.',
      'Coloca las tiras de tocino, los bastones de zanahoria y los huevos duros a lo largo.',
      'Enrolla la malaya apretando bien y ata con cordel cada 3 cm. La malaya debe quedar compacta.',
      'Coloca el arrollado en una olla con el vinagre, el laurel y agua hasta cubrir la mitad. Cocina tapado a fuego medio-bajo 1,5 a 2 horas, dando vuelta cada 30 minutos.',
      'Retira del fuego y deja enfriar en el líquido. Refrigera al menos 12 horas.',
      'Retira el cordel y corta en láminas finas. Sirve frío con pebre, pan amasado y ensalada chilena.',
    ],
    'El arrollado de malaya es un plato tradicional del campo chileno, típico de fiestas patrias, matrimonios y celebraciones. La malaya es un corte de vacuno del cuarto trasero, con fibras largas y algo de grasa, ideal para enrollar. A diferencia del arrollado huaso (que es de cerdo), la malaya es de vacuno y lleva huevo y zanahoria dentro.',
    [
      { error: 'Se desarma al cortar', solucion: 'No atar bien o no dejar reposar en frío. El cordel y el reposo de 12 horas son esenciales para que el arrollado se compacte y se pueda cortar en láminas.' },
      { error: 'Queda seco', solucion: 'Cocinar demasiado o con poco líquido. La malaya necesita cocción lenta con líquido que cubra la mitad del arrollado, y debe reposar en su propio jugo.' },
      { error: 'Sabe plano', solucion: 'No condimentar bien. La malaya necesita aliños generosos: ajo, ají de color, comino y orégano. El tocino le da la grasa que necesita.' },
    ],
    { refrigerador: 'Hasta 5 días envuelto en papel aluminio o paño.', congelador: 'Hasta 2 meses en porciones.', recalentar: 'Se sirve frío. No se recalienta.' }
  ),

  /* 103. Chupe de pollo */
  r('Chupe de pollo', 'sopas',
    ['pollo', 'chupe', 'sopa', 'olla', 'comfort', 'casero'],
    null, '50 min', '4 personas', 'fácil', 'Olla',
    [
      '1 pollo trozado (o 4 trutros)',
      '4 papas medianas en cubos',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 taza de crema o leche evaporada',
      '1 taza de pan rallado',
      '100 g de queso parmesano o mantecoso rallado',
      '2 cucharadas de mantequilla',
      'Sal, pimienta, orégano y merkén',
    ],
    [
      'Cocina el pollo en agua con sal por 20 minutos. Retira, desmenuza la carne y reserva el caldo.',
      'Sofríe la cebolla, el ajo y el pimentón en mantequilla hasta que estén transparentes. Agrega el tomate y condimenta.',
      'Añade las papas y el caldo de pollo (unos 2 litros). Cocina 15 minutos hasta que las papas estén tiernas.',
      'Incorpora el pollo desmenuzado y la crema. Cocina 5 minutos más.',
      'Reparte en pailas de greda individuales o en una fuente para horno.',
      'Espolvorea pan rallado y queso por encima. Gratina 5 minutos en el horno a 200 °C, hasta dorar.',
    ],
    'El chupe de pollo es el comfort food chileno por excelencia. Se hace cuando alguien está resfriado, cuando hace frío, o cuando hay que alimentar a mucha gente. Es una adaptación del chupe andino (que originalmente se hacía con papa y queso).',
    [
      { error: 'Queda aguado', solucion: 'No agregar suficiente pan rallado o no dejar reducir. El chupe debe tener consistencia de guiso espeso. Agrega más pan rallado o deja reducir destapado 5 minutos.' },
      { error: 'Pollo seco', solucion: 'Cocinarlo demasiado. El pollo se desmenuza cuando está cocido, en 20 minutos. No lo dejes más.' },
      { error: 'Sabe plano', solucion: 'No condimentar bien. El chupe necesita sal, pimienta, orégano y merkén. Prueba y ajusta antes de gratinar.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego lento en la olla, agregando un poco de caldo si espesa demasiado.' }
  ),

  /* 104. Caldillo de mariscos — se mantiene en categoría 'mar' */
  r('Caldillo de mariscos', 'mar',
    ['caldillo', 'marisco', 'sopa', 'olla', 'costa', 'invierno'],
    null, '35 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de mariscos variados (choritos, almejas, camarones)',
      '200 g de pescado blanco en trozos',
      '3 papas medianas en cubos',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 zanahoria en rodajas',
      '1,5 L de caldo de pescado',
      '½ taza de vino blanco',
      'Sal, pimienta, orégano y merkén',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón hasta que estén transparentes.',
      'Agrega el tomate y la zanahoria. Condimenta y cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar.',
      'Añade el caldo y las papas. Cocina 15 minutos.',
      'Incorpora los mariscos y el pescado. Cocina 5-7 minutos más.',
      'Sirve caliente con perejil fresco y pan.',
    ],
    'El caldillo de mariscos es más liviano que la paila marina: menos ingredientes, más caldo, y se sirve como sopa. Es típico de las caletas de la costa chilena y se come con pan para "mojar".',
    [
      { error: 'Mariscos gomosos', solucion: 'Cocinarlos demasiado. Los mariscos se hacen en 5-7 minutos.' },
      { error: 'Caldo soso', solucion: 'Usar agua en vez de caldo de pescado. El caldo de pescado le da la profundidad que necesita.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, evitando hervir.' }
  ),

  /* 105. Picorocos — se mantiene en categoría 'mar' */
  r('Picorocos', 'mar',
    ['picoroco', 'marisco', 'chiloé', 'patrimonio', 'sur', 'tradicional'],
    null, '30 min', '4 personas', 'fácil', 'Olla',
    [
      '8 picorocos frescos',
      '1 cebolla en pluma',
      '2 dientes de ajo',
      '1 hoja de laurel',
      'Sal',
      'Mayonesa casera o pebre para acompañar',
    ],
    [
      'Lava bien los picorocos bajo el chorro de agua fría.',
      'En una olla grande, pon agua con sal, la cebolla, el ajo y el laurel. Lleva a hervor.',
      'Cocina los picorocos 15-20 minutos, hasta que la concha se abra ligeramente.',
      'Retira y sirve calientes, con mayonesa o pebre. Se come la carne que está dentro de la concha, con un tenedor o una pinza.',
    ],
    'El picoroco es un crustáceo endémico de la costa de Chiloé, conocido como "cangrejo pigmeo" o "balano gigante". Su carne es dulce y jugosa, parecida a la del centollo. Es uno de los mariscos más preciados del sur de Chile y solo se encuentra en la zona de Chiloé y Guaitecas.',
    [
      { error: 'Se pasan de cocción', solucion: 'Cocinarlos demasiado tiempo. Los picorocos se hacen en 15-20 minutos. Si los dejas más, la carne se endurece.' },
      { error: 'Saben a "mar viejo"', solucion: 'Usar picorocos que no están frescos. Deben estar vivos al momento de cocinar (la concha se cierra si los tocas).' },
    ],
    { refrigerador: 'Hasta 2 días cocidos en recipiente hermético.', congelador: 'No recomendado, la carne pierde textura.', recalentar: 'Al vapor 3-5 minutos o en microondas 1 minuto.' }
  ),

  /* 106. Cholgas al pil pil — se mantiene en categoría 'mar' */
  r('Cholgas al pil pil', 'mar',
    ['cholga', 'marisco', 'chiloé', 'sartén', 'ajo', 'tradicional'],
    null, '25 min', '4 personas (como entrada)', 'fácil', 'Sartén',
    [
      '1 kg de cholgas frescas con concha',
      '6 dientes de ajo laminados',
      '½ taza de aceite de oliva',
      '1 ají verde o merkén al gusto',
      '½ taza de vino blanco',
      '1 cucharada de perejil fresco picado',
      'Sal y pimienta',
      'Pan amasado o marraqueta para acompañar',
    ],
    [
      'Lava bien las cholgas y descarta las que estén abiertas.',
      'Calienta el aceite en una sartén grande a fuego medio. Dora los ajos laminados y retíralos antes de que se quemen.',
      'Sube el fuego, agrega las cholgas y saltéalas hasta que se abran (3-5 minutos).',
      'Vierte el vino blanco y deja evaporar el alcohol.',
      'Agrega el ají o merkén, sal y pimienta. Devuelve los ajos a la sartén.',
      'Espolvorea perejil y sirve inmediatamente con pan.',
    ],
    'La cholga es un mejillón grande típico de Chiloé. Al pil pil se prepara igual que los camarones: con ajo, aceite de oliva y ají. Es una entrada clásica de las marisquerías del sur de Chile.',
    [
      { error: 'Cholgas gomosas', solucion: 'Cocinarlas demasiado. Las cholgas se abren en 3-5 minutos; apenas se abran, están listas.' },
      { error: 'Ajos quemados', solucion: 'Sofreírlos a fuego muy alto. Dora los ajos a fuego medio y retíralos antes de que se quemen.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'A fuego bajo 3-5 minutos.' }
  ),

  /* 107. Empanadas de cholga — se mantiene en categoría 'mar' */
  r('Empanadas de cholga', 'mar',
    ['empanada', 'cholga', 'marisco', 'chiloé', 'horno', 'fritura'],
    null, '90 min', '12 unidades', 'media', 'Horno o fritura',
    [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 120 g de manteca derretida',
      'Masa: 1 huevo',
      'Masa: 1 cucharadita de sal',
      'Masa: 200 ml de agua tibia (aprox.)',
      'Relleno: 500 g de carne de cholga cocida y picada',
      'Relleno: 1 cebolla grande picada fina',
      'Relleno: 2 dientes de ajo picados',
      'Relleno: 1 tomate maduro picado',
      'Relleno: 1 cucharadita de merkén',
      'Relleno: 2 cucharadas de pan rallado',
      'Relleno: Sal, pimienta y orégano',
      'Pintar: 1 huevo batido',
    ],
    [
      'Prepara el relleno: sofríe la cebolla y el ajo. Agrega el tomate y condimenta con merkén, sal, pimienta y orégano.',
      'Agrega la cholga picada y cocina 3 minutos. Añade el pan rallado para absorber el líquido. Deja enfriar por completo.',
      'Prepara la masa: mezcla la harina con la sal, agrega la manteca, el huevo y el agua tibia. Amasa hasta que esté lisa.',
      'Reposa 30 minutos. Divide en 12 bollos y estira discos de 15 cm.',
      'Rellena con 2 cucharadas del relleno frío. Cierra con repulgue y pincha con tenedor.',
      'Pinta con huevo batido. Hornea a 200 °C por 20-25 minutos, o fríe hasta dorar.',
    ],
    'Las empanadas de cholga son típicas de Chiloé y se venden en las panaderías y ferias de la isla. La cholga tiene un sabor más intenso que el chorito, por eso se condimenta con merkén. Se pueden hacer fritas o al horno.',
    [
      { error: 'Relleno aguado', solucion: 'No escurrir bien la cholga o no agregar pan rallado. La cholga suelta mucho líquido. Escúrrela bien y agrega suficiente pan rallado.' },
      { error: 'Empanadas se abren', solucion: 'Relleno caliente o repulgue mal sellado. El relleno debe estar frío y el repulgue firme.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses crudas o cocidas.', recalentar: 'Horno o freidora de aire a 180 °C por 5-10 minutos.' }
  ),

  /* 108. Torta de manjar */
  r('Torta de manjar', 'dulces',
    ['torta', 'manjar', 'dulce', 'horno', 'cumpleaños', 'reposteria'],
    null, '1 h', '12 porciones', 'media', 'Horno',
    [
      'Bizcocho: 4 huevos',
      'Bizcocho: 120 g de azúcar',
      'Bizcocho: 100 g de harina',
      'Bizcocho: 1 cucharadita de polvos de hornear',
      'Bizcocho: 1 cucharadita de vainilla',
      'Relleno y cubierta: 500 g de manjar',
      'Relleno y cubierta: 300 ml de crema para batir',
      'Relleno y cubierta: 2 cucharadas de azúcar flor',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa y enharina un molde redondo.',
      'Bate los huevos con el azúcar hasta que estén pálidos y hayan triplicado su volumen (unos 8 minutos).',
      'Incorpora la harina cernida con los polvos de hornear y la vainilla con movimientos envolventes.',
      'Vierte en el molde y hornea 25-30 minutos. Deja enfriar y corta en 3 discos.',
      'Bate la crema con el azúcar flor hasta que monte.',
      'Arma la torta: disco, manjar, crema; repite. Cubre toda la torta con manjar y decora con crema.',
      'Refrigera al menos 2 horas antes de servir.',
    ],
    'La torta de manjar es la torta de cumpleaños chilena por excelencia. Se hace con bizcocho liviano, manjar entre las capas y crema batida. Hay familias que le agregan nueces, chocolate rallado o merengue. El manjar (dulce de leche) puede ser casero o comprado.',
    [
      { error: 'Bizcocho se baja', solucion: 'Abrir el horno durante la cocción o batir de menos los huevos. No abras el horno los primeros 20 minutos. Bate los huevos hasta que estén bien espumosos.' },
      { error: 'Bizcocho seco', solucion: 'Hornear de más. El bizcocho está listo cuando se despega del borde del molde. Sácalo apenas esté listo.' },
      { error: 'La crema no monta', solucion: 'Crema no bien fría o batir de más. Usa crema para batir bien fría y detente cuando forme picos suaves.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, la crema se corta.', recalentar: 'Se consume fría o a temperatura ambiente.' }
  ),

  /* 109. Flan */
  r('Flan', 'dulces',
    ['postre', 'flan', 'horno', 'baño maría', 'clásico', 'huevo'],
    null, '1 h 15 min', '6 personas', 'fácil', 'Horno',
    [
      '1 litro de leche',
      '6 huevos',
      '150 g de azúcar',
      '1 cucharadita de vainilla',
      '100 g de azúcar para el caramelo',
      '3 cucharadas de agua',
    ],
    [
      'Precalienta el horno a 180 °C. Prepara el caramelo: derrite el azúcar con el agua en una sartén hasta que tome color ámbar. Vierte en el fondo del molde.',
      'Bate los huevos con el azúcar hasta que estén cremosos. Agrega la leche tibia y la vainilla, mezclando suavemente.',
      'Cuela la mezcla para eliminar impurezas y burbujas.',
      'Vierte en el molde caramelizado.',
      'Hornea al baño María a 180 °C por 50-60 minutos, hasta que el flan esté cuajado (un palillo debe salir limpio).',
      'Deja enfriar y refrigera al menos 4 horas antes de desmoldar.',
    ],
    'El flan es un postre de origen español que en Chile se volvió clásico de la once y de las celebraciones. Se diferencia de la leche asada en que el flan es más suave y cremoso, mientras la leche asada es más rústica y lleva más huevo. El baño María es obligatorio para que no se corte.',
    [
      { error: 'Se corta o queda con burbujas', solucion: 'Batir demasiado los huevos o no colar la mezcla. Bate suavemente y cuela antes de hornear.' },
      { error: 'Caramelo amargo', solucion: 'El azúcar se pasó de cocción. Retira el caramelo del fuego cuando tenga color ámbar claro.' },
      { error: 'Queda crudo en el centro', solucion: 'Hornear poco tiempo o a temperatura muy alta. Hornea al baño María a 180 °C por al menos 50 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, el huevo se estropea.', recalentar: 'Se consume frío.' }
  ),

  /* 110. Pie de limón */
  r('Pie de limón', 'dulces',
    ['postre', 'pie', 'limón', 'horno', 'clásico', 'reposteria'],
    null, '1 h + frío', '8 porciones', 'media', 'Horno',
    [
      'Masa: 200 g de galletas de champaña o de agua',
      'Masa: 100 g de mantequilla derretida',
      'Relleno: 1 tarro de leche condensada (397 g)',
      'Relleno: 3 yemas de huevo',
      'Relleno: ½ taza de jugo de limón recién exprimido',
      'Relleno: 1 cucharadita de ralladura de limón',
      'Merengue: 3 claras de huevo',
      'Merengue: ½ taza de azúcar',
    ],
    [
      'Tritura las galletas y mézclalas con la mantequilla derretida. Presiona en el fondo y bordes de un molde para pie.',
      'Hornea la base a 180 °C por 10 minutos. Deja enfriar.',
      'Bate las yemas con la leche condensada, el jugo y la ralladura de limón hasta que espese.',
      'Vierte el relleno sobre la base fría.',
      'Bate las claras con el azúcar hasta que formen un merengue firme.',
      'Cubre el pie con el merengue y dora en el horno a 200 °C por 5-8 minutos, hasta que el merengue esté dorado.',
      'Refrigera al menos 4 horas antes de servir.',
    ],
    'El pie de limón es un clásico de la repostería chilena, especialmente en las casas de la zona central. Llegó con la influencia inglesa y se adaptó con limones chilenos. Se hace con leche condensada, lo que le da esa textura cremosa. Es el postre favorito de muchas familias en cumpleaños y once.',
    [
      { error: 'El relleno no espesa', solucion: 'No batir lo suficiente o usar limones muy grandes. Bate hasta que la mezcla espese visiblemente. El ácido del limón "cocina" las yemas y espesa la mezcla.' },
      { error: 'El merengue llora (suelta agua)', solucion: 'No sellar bien el merengue con la base. Extiende el merengue hasta los bordes de la masa, tocándola, para que no se forme agua entre el relleno y el merengue.' },
      { error: 'Base blanda', solucion: 'No hornear la base antes de rellenar. La base debe hornearse 10 minutos para que quede firme.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, el merengue se estropea.', recalentar: 'Se consume frío.' }
  ),
  /* 111. Pan de huevo */
  r('Pan de huevo', 'panes',
    ['pan', 'huevo', 'horno', 'masa', 'once', 'tradicional'],
    null, '2 h 30 min', '12 panes', 'media', 'Horno',
    [
      '500 g de harina sin polvos de hornear',
      '150 g de azúcar',
      '100 g de mantequilla a temperatura ambiente',
      '4 huevos',
      '15 g de levadura granulada',
      '100 ml de leche tibia',
      '1 cucharadita de vainilla',
      'Ralladura de 1 limón',
      '1 pizca de sal',
      '1 huevo batido para pintar',
    ],
    [
      'Activa la levadura en la leche tibia con una cucharadita de azúcar. Reposa 10 minutos hasta que espume.',
      'Bate la mantequilla con el azúcar. Agrega los huevos uno a uno, la vainilla y la ralladura.',
      'Incorpora la levadura y la harina cernida con la sal. Amasa hasta obtener una masa suave.',
      'Deja levar tapada 1 hora, hasta que doble su volumen.',
      'Forma 12 bollos y colócalos en una bandeja engrasada. Deja levar 30 minutos más.',
      'Pinta con huevo batido y hornea a 180 °C por 20-25 minutos, hasta dorar.',
    ],
    'El pan de huevo es un pan dulce tradicional de la once chilena, especialmente en el sur. Se hace con huevos, mantequilla y azúcar, y tiene una miga suave y esponjosa. Es primo de la brioche francesa y del pan de bono colombiano. En Chile se come con mantequilla, con manjar o solo.',
    [
      { error: 'No sube', solucion: 'Levadura vencida o leche muy caliente. La leche debe estar tibia (no caliente) para activar la levadura sin matarla.' },
      { error: 'Queda seco', solucion: 'Hornear de más. El pan de huevo se hace en 20-25 minutos. Sácalo apenas esté dorado.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'Horno a 180 °C por 5 minutos.' }
  ),

  /* 112. Dobladitas */
  r('Dobladitas', 'panes',
    ['pan', 'dobladita', 'horno', 'masa', 'once', 'tradicional'],
    null, '1 h 30 min', '12 unidades', 'media', 'Horno',
    [
      '500 g de harina sin polvos de hornear',
      '200 g de manteca vegetal',
      '1 cucharadita de sal',
      '1 cucharadita de polvos de hornear',
      '200 ml de agua tibia (aprox.)',
    ],
    [
      'Mezcla la harina con la sal y los polvos de hornear.',
      'Agrega la manteca y trabaja con las manos hasta que quede como arena gruesa.',
      'Añade el agua tibia de a poco y amasa hasta obtener una masa suave.',
      'Estira la masa en un rectángulo de ½ cm de grosor. Unta con manteca derretida y espolvorea un poco de harina.',
      'Dobla la masa en tres (como una carta). Estira de nuevo y repite el doblez 3 veces más.',
      'Corta rectángulos de 8x5 cm. Haz un corte en el centro de cada uno (opcional) y dóblalos por la mitad.',
      'Coloca en bandeja engrasada y hornea a 200 °C por 20-25 minutos, hasta dorar.',
    ],
    'La dobladita es un pan tradicional chileno, típico de la once y del desayuno. Su nombre viene de la forma de doblar la masa en tres, como una carta. Es hojaldrada y crujiente por fuera, suave por dentro. En el sur se hace con chicharrones y se llama "dobladita de chicharrón".',
    [
      { error: 'No queda hojaldrada', solucion: 'No hacer suficientes dobleces o usar mantequilla en vez de manteca. Los dobleces son los que crean las capas. Haz al menos 3 dobleces.' },
      { error: 'Queda dura', solucion: 'Amasado excesivo. La masa de dobladita no debe amasarse mucho. Solo hasta integrar.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 2 meses.', recalentar: 'Horno a 180 °C por 5 minutos.' }
  ),

  /* 113. Pan de papa */
  r('Pan de papa', 'panes',
    ['pan', 'papa', 'horno', 'masa', 'chiloé', 'tradicional'],
    null, '2 h', '10 panes', 'media', 'Horno',
    [
      '500 g de harina sin polvos de hornear',
      '250 g de papas cocidas y hechas puré',
      '150 ml de leche tibia',
      '10 g de levadura granulada',
      '1 cucharadita de sal',
      '2 cucharadas de manteca derretida',
      '1 cucharadita de azúcar',
    ],
    [
      'Activa la levadura en la leche tibia con el azúcar. Reposa 10 minutos.',
      'Mezcla el puré de papas con la harina, la sal y la manteca.',
      'Agrega la levadura y amasa hasta obtener una masa suave.',
      'Deja levar tapada 1 hora, hasta que doble su volumen.',
      'Forma 10 bollos y colócalos en bandeja engrasada. Deja levar 30 minutos más.',
      'Hornea a 190 °C por 25-30 minutos, hasta dorar.',
    ],
    'El pan de papa es típico de Chiloé y del sur de Chile. La papa le da una miga muy suave y húmeda, que se mantiene tierna por más tiempo. Es primo del milcao (que es de papa cruda rallada), pero el pan de papa lleva harina y levadura, y se hornea.',
    [
      { error: 'Queda pesado', solucion: 'Puré de papa muy húmedo o harina de más. El puré debe estar seco. Si la masa está muy pegajosa, agrega harina cucharada a cucharada.' },
      { error: 'No sube', solucion: 'Levadura vencida o leche caliente. La leche debe estar tibia, no caliente.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en bolsa de tela.', congelador: 'Hasta 3 meses en bolsa hermética.', recalentar: 'Horno a 180 °C por 5 minutos.' }
  ),

  /* 114. Torta curicana */
  r('Torta curicana', 'dulces',
    ['torta', 'curicó', 'dulce', 'horno', 'tradicional', 'reposteria'],
    null, '1 h 30 min', '12 porciones', 'alta', 'Horno',
    [
      'Masa: 500 g de harina',
      'Masa: 250 g de mantequilla',
      'Masa: 100 g de azúcar',
      'Masa: 2 yemas',
      'Masa: 100 ml de agua fría',
      'Relleno: 500 g de manjar',
      'Relleno: 200 g de nueces picadas',
      'Relleno: 100 g de pasas',
      'Cubierta: azúcar flor',
    ],
    [
      'Mezcla la harina con el azúcar. Agrega la mantequilla fría en cubos y trabaja con los dedos hasta que quede como arena.',
      'Agrega las yemas y el agua fría. Amasa hasta obtener una masa lisa.',
      'Envuelve en papel plástico y refrigera 1 hora.',
      'Divide la masa en 6 porciones. Estira cada una en un disco delgado.',
      'Hornea cada disco a 180 °C por 10-12 minutos, hasta que esté dorado.',
      'Mezcla el manjar con las nueces y pasas.',
      'Arma la torta: disco, relleno, disco, relleno, hasta terminar. Cubre con azúcar flor.',
    ],
    'La torta curicana es tradicional de Curicó, en la zona central de Chile. Se dice que nació en el siglo XIX en las casas de las familias más tradicionales de la ciudad. Es una torta de masa quebrada con relleno de manjar, nueces y pasas. Se sirve en cumpleaños y celebraciones.',
    [
      { error: 'Masa dura', solucion: 'Amasar demasiado o usar mantequilla caliente. La mantequilla debe estar fría y la masa no debe amasarse mucho.' },
      { error: 'Se desarma al cortar', solucion: 'No dejar reposar la torta. Deja reposar la torta armada al menos 2 horas en frío antes de cortar.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 115. Higos rellenos */
  r('Higos rellenos', 'dulces',
    ['dulce', 'higo', 'nuez', 'tradicional', 'navidad', 'postre'],
    null, '30 min + reposo', '20 higos', 'fácil', 'Sin cocción',
    [
      '20 higos secos',
      '100 g de nueces picadas',
      '50 g de almendras picadas',
      '2 cucharadas de miel',
      '1 cucharada de azúcar flor',
      '1 cucharadita de canela en polvo',
      'Opcional: 1 cucharada de pisco o ron',
    ],
    [
      'Abre los higos por la mitad, sin separarlos del todo.',
      'Mezcla las nueces, almendras, miel, azúcar flor, canela y el licor si usas.',
      'Rellena cada higo con la mezcla.',
      'Presiona ligeramente para cerrar.',
      'Deja reposar al menos 2 horas antes de servir para que los sabores se integren.',
    ],
    'Los higos rellenos son un dulce tradicional chileno, típico de Navidad y de las celebraciones de fin de año. Se hacen con higos secos rellenos de nueces y bañados en miel. En el campo se preparan con higos frescos secados al sol.',
    [
      { error: 'Higos muy duros', solucion: 'No remojarlos antes. Si los higos están muy secos, remójalos en agua tibia 30 minutos antes de rellenar.' },
      { error: 'Relleno se sale', solucion: 'No presionar bien los higos. Presiona suavemente para cerrar y deja reposar en frío.' },
    ],
    { refrigerador: 'Hasta 2 semanas en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 116. Duraznos en conserva */
  r('Duraznos en conserva', 'dulces',
    ['postre', 'durazno', 'conserva', 'verano', 'tradicional', 'fruta'],
    null, '40 min + frío', '6 personas', 'fácil', 'Olla',
    [
      '1 kg de duraznos maduros pero firmes',
      '2 tazas de agua',
      '1 taza de azúcar',
      '1 rama de canela',
      '3 clavos de olor',
      'Cáscara de ½ naranja (opcional)',
    ],
    [
      'Lava los duraznos y hazles una cruz en la base. Sumérgelos en agua hirviendo 30 segundos, luego en agua fría. Pélalos fácilmente.',
      'Córtalos por la mitad y retira el carozo.',
      'En una olla, hierve el agua con el azúcar, la canela, los clavos y la cáscara de naranja hasta disolver el azúcar.',
      'Agrega los duraznos y cocina a fuego bajo 10-15 minutos, hasta que estén tiernos pero firmes.',
      'Retira del fuego y deja enfriar en el almíbar.',
      'Refrigera al menos 4 horas antes de servir. Se pueden servir solos o con manjar.',
    ],
    'Los duraznos en conserva son un postre de verano chileno. Se hacen con duraznos de la zona central, famosos por su dulzura. También se conocen como "duraznos al jugo". Con manjar encima son un postre de fiestas. En Chile se conservan en frascos esterilizados para comer en invierno.',
    [
      { error: 'Duraznos se deshacen', solucion: 'Cocinarlos demasiado. Los duraznos se hacen en 10-15 minutos. Si los dejas más, se deshacen.' },
      { error: 'No se pelan bien', solucion: 'No hacerles la cruz o no sumergirlos en agua hirviendo. La cruz y el choque térmico son clave para pelarlos fácilmente.' },
    ],
    { refrigerador: 'Hasta 1 semana en frasco cerrado.', congelador: 'No recomendado, pierden textura.', recalentar: 'Se consumen fríos.' }
  ),

  /* 117. Sopa de fideos */
  r('Sopa de fideos', 'sopas',
    ['sopa', 'fideos', 'caldo', 'olla', 'simple', 'cotidiano'],
    null, '25 min', '4 personas', 'muy fácil', 'Olla',
    [
      '1,5 L de caldo de pollo o de verduras',
      '200 g de fideos cabello de ángel o de sopa',
      '1 cebolla pequeña picada fina',
      '1 zanahoria en cubos pequeños',
      '1 ramita de apio picada',
      '1 cucharada de aceite',
      'Sal, pimienta y orégano',
    ],
    [
      'Sofríe la cebolla, la zanahoria y el apio en aceite hasta que estén tiernos.',
      'Agrega el caldo y lleva a hervor.',
      'Añade los fideos y cocina según las instrucciones del paquete (3-5 minutos para cabello de ángel).',
      'Condimenta con sal, pimienta y orégano.',
      'Sirve caliente con perejil fresco si quieres.',
    ],
    'La sopa de fideos es la sopa más simple y cotidiana de Chile. Se hace con caldo de pollo o de verduras, fideos finos y verduras. Es el plato de invierno por excelencia en las casas chilenas, y se sirve como entrada o como plato único.',
    [
      { error: 'Fideos pasados', solucion: 'Cocinarlos demasiado. Los fideos finos se hacen en 3-5 minutos. Si los dejas más, se deshacen.' },
      { error: 'Caldo soso', solucion: 'Usar agua en vez de caldo. El caldo de pollo o verduras es lo que le da sabor.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, los fideos se pasan.', recalentar: 'A fuego lento con un poco de caldo.' }
  ),

  /* 118. Arroz con huevo */
  r('Arroz con huevo', 'principales',
    ['arroz', 'huevo', 'simple', 'cotidiano', 'once', 'economico'],
    null, '20 min', '2 personas', 'muy fácil', 'Olla',
    [
      '1 taza de arroz',
      '2 tazas de agua',
      '1 cucharada de aceite',
      '1 pizca de sal',
      '2 huevos',
      '1 cucharada de mantequilla',
      'Sal y pimienta',
    ],
    [
      'Lava el arroz hasta que el agua salga clara. Escurre.',
      'En una olla, calienta el aceite y sofríe el arroz 1 minuto.',
      'Agrega el agua y la sal. Lleva a hervor, baja el fuego, tapa y cocina 15 minutos.',
      'Mientras se cocina el arroz, fríe los huevos en mantequilla con sal y pimienta.',
      'Sirve el arroz caliente con el huevo frito encima.',
    ],
    'El arroz con huevo es el plato más simple y económico de la cocina chilena. Se come en la once, como almuerzo rápido, o cuando no hay mucho en la casa. Muchas familias le agregan salsa de tomate o cebolla frita. Es el comfort food de la infancia.',
    [
      { error: 'Arroz pasado', solucion: 'Cocinar demasiado o con mucha agua. La proporción es 1 taza de arroz por 2 de agua. Cocina 15 minutos tapado.' },
      { error: 'Huevo con yema dura', solucion: 'Cocinar de más. El huevo frito necesita 2-3 minutos a fuego medio para yema líquida.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 3 minutos.' }
  ),

  /* 119. Pollo al limón */
  r('Pollo al limón', 'principales',
    ['pollo', 'limón', 'sartén', 'horno', 'plato principal', 'simple'],
    null, '50 min', '4 personas', 'fácil', 'Sartén u horno',
    [
      '4 trutros de pollo (o 1 pollo trozado)',
      'Jugo de 3 limones',
      '2 cucharadas de mantequilla',
      '2 cucharadas de aceite',
      '2 dientes de ajo picados',
      '1 cucharadita de azúcar',
      'Sal, pimienta y orégano',
    ],
    [
      'Sazona el pollo con sal, pimienta y orégano. Marina en el jugo de 2 limones por 30 minutos.',
      'Calienta la mantequilla y el aceite en una sartén grande. Dora el pollo por ambos lados.',
      'Agrega el ajo, el jugo del tercer limón y el azúcar. Tapa y cocina 25-30 minutos a fuego medio, dando vuelta cada tanto.',
      'Destapa y deja reducir la salsa 5 minutos. Rectifica la sal.',
      'Sirve con la salsa por encima y acompañado de arroz o papas.',
    ],
    'El pollo al limón es un plato simple pero elegante, típico de las casas chilenas. Se puede hacer en sartén o al horno. El limón le da un sabor ácido que equilibra la grasa del pollo. Es una de esas recetas que cada familia hace a su manera.',
    [
      { error: 'Sabe muy ácido', solucion: 'Usar demasiado limón. Empieza con 2 limones y ajusta. El azúcar equilibra la acidez.' },
      { error: 'Pollo seco', solucion: 'Cocinarlo demasiado o sin tapar. Cocina tapado para que el pollo se mantenga jugoso.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con su salsa.' }
  ),

  /* 120. Pollo a la mostaza */
  r('Pollo a la mostaza', 'principales',
    ['pollo', 'mostaza', 'sartén', 'plato principal', 'simple'],
    null, '45 min', '4 personas', 'fácil', 'Sartén',
    [
      '4 trutros de pollo',
      '3 cucharadas de mostaza de Dijon',
      '2 cucharadas de mantequilla',
      '1 cucharada de aceite',
      '1 cebolla picada',
      '2 dientes de ajo picados',
      '½ taza de vino blanco',
      '½ taza de crema',
      'Sal y pimienta',
    ],
    [
      'Sazona el pollo con sal y pimienta. Úntalo con 2 cucharadas de mostaza.',
      'Calienta la mantequilla y el aceite en una sartén. Dora el pollo por ambos lados. Retira y reserva.',
      'En la misma sartén, sofríe la cebolla y el ajo hasta que estén transparentes.',
      'Agrega el vino blanco y deja evaporar. Añade la crema y la cucharada de mostaza restante. Revuelve.',
      'Devuelve el pollo a la sartén, tapa y cocina 20-25 minutos a fuego medio.',
      'Rectifica la sal y sirve con arroz o papas.',
    ],
    'El pollo a la mostaza es un plato de origen francés que en Chile se volvió clásico de las casas. La mostaza de Dijon le da un sabor intenso, y la crema suaviza. Es una receta elegante pero fácil.',
    [
      { error: 'Sabor muy fuerte a mostaza', solucion: 'Usar demasiada mostaza o no cocinarla. La mostaza se suaviza al cocinarse con la crema. Si queda muy fuerte, agrega más crema.' },
      { error: 'Salsa se corta', solucion: 'Hervir la crema o usar crema fría. Agrega la crema a fuego bajo y no dejes que hierva.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, la crema se corta.', recalentar: 'A fuego lento con un poco de crema o leche.' }
  ),

  /* 121. Pollo al ajillo */
  r('Pollo al ajillo', 'principales',
    ['pollo', 'ajo', 'sartén', 'plato principal', 'simple', 'español'],
    null, '40 min', '4 personas', 'fácil', 'Sartén',
    [
      '4 trutros de pollo',
      '8 dientes de ajo laminados',
      '½ taza de aceite de oliva',
      '½ taza de vino blanco',
      '1 hoja de laurel',
      '1 cucharadita de ají de color',
      'Sal, pimienta y perejil',
    ],
    [
      'Sazona el pollo con sal, pimienta y ají de color.',
      'Calienta el aceite en una sartén grande. Dora los ajos laminados y retíralos antes de que se quemen.',
      'Dora el pollo en el mismo aceite por ambos lados.',
      'Agrega el vino blanco y el laurel. Tapa y cocina 25-30 minutos a fuego medio, dando vuelta cada tanto.',
      'Devuelve los ajos a la sartén, espolvorea perejil y sirve con papas o arroz.',
    ],
    'El pollo al ajillo es de origen español y en Chile se volvió parte de la cocina casera. El ajo es el protagonista: se dora entero y se deja en la salsa. Es un plato simple pero lleno de sabor.',
    [
      { error: 'Ajos quemados y amargos', solucion: 'Sofreírlos a fuego muy alto. Dora los ajos a fuego medio y retíralos antes de que se quemen. Vuelven al final.' },
      { error: 'Pollo seco', solucion: 'Cocinarlo destapado o demasiado tiempo. Cocina tapado para que se mantenga jugoso.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con su salsa.' }
  ),

  /* 122. Carne asada a la plancha */
  r('Carne asada a la plancha', 'principales',
    ['carne', 'asado', 'plancha', 'vacuno', 'simple', 'cotidiano'],
    null, '20 min', '2 personas', 'muy fácil', 'Plancha',
    [
      '2 bistecs de vacuno (lomo, posta o asiento) de 200 g cada uno',
      '1 cucharada de aceite',
      'Sal gruesa',
      'Pimienta negra molida',
      'Opcional: 1 diente de ajo',
    ],
    [
      'Saca la carne del refrigerador 20 minutos antes de cocinar. Debe estar a temperatura ambiente.',
      'Calienta la plancha a fuego alto hasta que humee ligeramente. Agrega el aceite.',
      'Sala la carne justo antes de ponerla en la plancha.',
      'Cocina 2-3 minutos por lado para término medio. No la muevas mientras se cocina.',
      'Retira y deja reposar 5 minutos sobre una tabla antes de cortar.',
      'Sirve con sal gruesa y pimienta, y acompañamientos a gusto.',
    ],
    'La carne asada a la plancha es la base de la cocina chilena. Un buen bistec solo necesita sal, pimienta y una plancha bien caliente. El reposo después de cocinar es clave: permite que los jugos se redistribuyan y la carne quede más jugosa.',
    [
      { error: 'Carne seca', solucion: 'Cocinarla de más o no dejarla reposar. La carne debe reposar 5 minutos después de cocinada para que los jugos se redistribuyan.' },
      { error: 'No se dora', solucion: 'Plancha fría o carne húmeda. La plancha debe estar muy caliente y la carne seca antes de cocinar.' },
      { error: 'Carne dura', solucion: 'Usar un corte inadecuado o cocinarla demasiado. Usa cortes tiernos como lomo o posta, y no pases de término medio.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, pierde jugosidad.', recalentar: 'Sartén a fuego alto 1 minuto por lado.' }
  ),

  /* 123. Lomo a la plancha */
  r('Lomo a la plancha', 'principales',
    ['lomo', 'carne', 'plancha', 'vacuno', 'simple'],
    null, '15 min', '2 personas', 'muy fácil', 'Plancha',
    [
      '2 medallones de lomo liso de 200 g cada uno',
      '1 cucharada de mantequilla',
      '1 cucharada de aceite',
      'Sal y pimienta',
      'Opcional: 1 ramita de romero o tomillo',
    ],
    [
      'Saca el lomo del refrigerador 20 minutos antes. Sazona con sal y pimienta.',
      'Calienta la plancha a fuego alto con el aceite.',
      'Sella el lomo 2-3 minutos por lado. Agrega la mantequilla y las hierbas en el último minuto, bañando la carne con la espuma.',
      'Retira y deja reposar 5 minutos antes de cortar.',
      'Sirve con sal gruesa y acompañamientos.',
    ],
    'El lomo a la plancha es el corte más tierno del vacuno. Se cocina rápido y se sirve con sal gruesa. Es el plato de las ocasiones especiales en las casas chilenas. A diferencia del bistec, el lomo es más magro y suave.',
    [
      { error: 'Lomo seco', solucion: 'Cocinarlo de más. El lomo es magro y se seca rápido. 2-3 minutos por lado es suficiente para término medio.' },
      { error: 'No se dora', solucion: 'Plancha fría o lomo húmedo. La plancha debe estar muy caliente y la carne seca.' },
    ],
    { refrigerador: 'Hasta 2 días.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego alto 1 minuto por lado.' }
  ),

  /* 124. Cazuela de pescado — categoría: sopas → principales */
  r('Cazuela de pescado', 'principales',
    ['cazuela', 'pescado', 'sopa', 'olla', 'costa', 'invierno'],
    null, '40 min', '4 personas', 'fácil', 'Olla',
    [
      '600 g de pescado blanco en trozos (congrio, merluza, reineta)',
      '4 papas medianas en trozos',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 zanahoria en rodajas',
      '1,5 L de caldo de pescado o agua',
      '½ taza de vino blanco',
      'Sal, pimienta, orégano y merkén',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón hasta que estén transparentes.',
      'Agrega el tomate y la zanahoria. Condimenta y cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar.',
      'Añade el caldo y las papas. Cocina 15 minutos.',
      'Incorpora el pescado y cocina 5-7 minutos, hasta que esté cocido pero firme.',
      'Rectifica la sal y sirve con perejil fresco.',
    ],
    'La cazuela de pescado es la versión marina de la cazuela de vacuno. Es típica de la costa chilena y se prepara con el pescado de la zona. El pescado se agrega al final para que no se deshaga.',
    [
      { error: 'Pescado se deshace', solucion: 'Cocinarlo demasiado o revolver. Agrega el pescado al final y no revuelvas: solo mueve la olla.' },
      { error: 'Caldo soso', solucion: 'Usar agua en vez de caldo de pescado. El caldo le da la profundidad que necesita.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, el pescado se deshace.', recalentar: 'A fuego muy suave, sin hervir.' }
  ),

  /* 125. Sopa de verduras */
  r('Sopa de verduras', 'sopas',
    ['sopa', 'verduras', 'olla', 'saludable', 'cotidiano', 'vegetariano'],
    null, '35 min', '4 personas', 'muy fácil', 'Olla',
    [
      '1 cebolla picada',
      '2 zanahorias en cubos',
      '2 papas en cubos',
      '1 ramita de apio picada',
      '1 pimiento rojo en cubos',
      '1 taza de porotos verdes picados',
      '1 taza de arroz o fideos (opcional)',
      '1,5 L de caldo de verduras',
      '2 cucharadas de aceite',
      'Sal, pimienta y orégano',
    ],
    [
      'Sofríe la cebolla y el apio en aceite hasta que estén tiernos.',
      'Agrega la zanahoria y el pimiento. Cocina 5 minutos.',
      'Vierte el caldo y lleva a hervor.',
      'Añade las papas y los porotos verdes. Cocina 15 minutos.',
      'Si usas arroz o fideos, agrégalos y cocina según el tiempo indicado.',
      'Condimenta con sal, pimienta y orégano. Sirve caliente.',
    ],
    'La sopa de verduras es la sopa más versátil y cotidiana de Chile. Se hace con las verduras que haya en la casa. Es el plato de invierno por excelencia y se sirve como entrada o plato único. Cada familia tiene su versión.',
    [
      { error: 'Verduras deshechas', solucion: 'Cocinarlas demasiado. Agrega las verduras por tandas: primero las duras (zanahoria, papa) y después las blandas (porotos verdes).' },
      { error: 'Caldo soso', solucion: 'No sofreír las verduras. El sofrito inicial le da sabor a la sopa.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego lento con un poco de caldo.' }
  ),

  /* 126. Sopa de pollo */
  r('Sopa de pollo', 'sopas',
    ['sopa', 'pollo', 'caldo', 'olla', 'comfort', 'invierno'],
    null, '50 min', '4 personas', 'fácil', 'Olla',
    [
      '1 pollo trozado o 4 trutros',
      '1 cebolla picada',
      '2 zanahorias en rodajas',
      '1 ramita de apio picada',
      '2 papas en cubos',
      '1 taza de fideos o arroz',
      '2 L de agua',
      'Sal, pimienta y orégano',
      'Perejil fresco',
    ],
    [
      'Cocina el pollo en agua con sal por 30 minutos. Retira, desmenuza y reserva el caldo.',
      'En otra olla, sofríe la cebolla, la zanahoria y el apio.',
      'Agrega el caldo de pollo colado y lleva a hervor.',
      'Añade las papas y cocina 15 minutos.',
      'Incorpora el pollo desmenuzado y los fideos o arroz. Cocina según el tiempo indicado.',
      'Condimenta con sal, pimienta y orégano. Sirve con perejil fresco.',
    ],
    'La sopa de pollo es el remedio de la abuela chilena. Se toma cuando alguien está resfriado, cuando hace frío, o cuando se necesita un plato reconfortante. Es más liviana que la cazuela y se sirve como entrada o plato único.',
    [
      { error: 'Caldo turbio', solucion: 'Hervir a fuego fuerte. Mantén un hervor suave y retira la espuma que sube a la superficie.' },
      { error: 'Pollo seco', solucion: 'Cocinarlo demasiado. El pollo se desmenuza a los 20-30 minutos. No lo dejes más.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin fideos.', recalentar: 'A fuego lento con un poco de caldo.' }
  ),

  /* 127. Tallarines con salsa de tomate */
  r('Tallarines con salsa de tomate', 'principales',
    ['pasta', 'tallarines', 'tomate', 'salsa', 'simple', 'cotidiano'],
    null, '30 min', '4 personas', 'muy fácil', 'Olla',
    [
      '500 g de tallarines',
      '1 kg de tomates maduros (o 1 tarro de tomates pelados)',
      '1 cebolla picada',
      '2 dientes de ajo picados',
      '3 cucharadas de aceite de oliva',
      '1 cucharadita de azúcar',
      'Hojas de albahaca fresca',
      'Sal y pimienta',
    ],
    [
      'Cocina los tallarines en abundante agua con sal según las instrucciones del paquete.',
      'Mientras tanto, sofríe la cebolla y el ajo en aceite de oliva hasta que estén transparentes.',
      'Agrega los tomates pelados y picados (o el tarro). Condimenta con sal, pimienta y azúcar.',
      'Cocina a fuego medio 15 minutos, hasta que la salsa espese.',
      'Agrega la albahaca fresca al final.',
      'Escurre los tallarines y mézclalos con la salsa. Sirve con queso rallado.',
    ],
    'Los tallarines con salsa de tomate son el plato de pasta más simple y cotidiano de Chile. La salsa de tomate casera es la base de muchas recetas. El azúcar equilibra la acidez del tomate, y la albahaca fresca le da el toque final.',
    [
      { error: 'Salsa ácida', solucion: 'No agregar azúcar o usar tomates muy verdes. Una cucharadita de azúcar equilibra la acidez.' },
      { error: 'Tallarines pegados', solucion: 'No revolver o cocinar en poca agua. Usa abundante agua y revuelve los primeros minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'La salsa se puede congelar hasta 2 meses. Los tallarines no.', recalentar: 'Sartén a fuego medio 3 minutos.' }
  ),

  /* 128. Torta de chocolate */
  r('Torta de chocolate', 'dulces',
    ['torta', 'chocolate', 'horno', 'dulce', 'cumpleaños', 'reposteria'],
    null, '1 h', '12 porciones', 'media', 'Horno',
    [
      'Bizcocho: 3 huevos',
      'Bizcocho: 150 g de azúcar',
      'Bizcocho: 120 g de harina',
      'Bizcocho: 40 g de cacao en polvo',
      'Bizcocho: 1 cucharadita de polvos de hornear',
      'Bizcocho: 100 ml de leche',
      'Bizcocho: 100 g de mantequilla derretida',
      'Cubierta: 200 g de chocolate amargo',
      'Cubierta: 200 ml de crema para batir',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa un molde.',
      'Bate los huevos con el azúcar hasta que estén pálidos y espumosos.',
      'Incorpora la harina, el cacao y los polvos de hornear con movimientos envolventes.',
      'Agrega la leche y la mantequilla derretida. Mezcla hasta integrar.',
      'Vierte en el molde y hornea 30-35 minutos. Deja enfriar.',
      'Para la cubierta, calienta la crema y viértela sobre el chocolate picado. Revuelve hasta obtener una ganache lisa.',
      'Cubre la torta con la ganache y refrigera 2 horas antes de servir.',
    ],
    'La torta de chocolate es la favorita de los cumpleaños chilenos. Hay dos escuelas: la torta húmeda (con ganache) y la torta seca (con manjar y chocolate). Esta receta es la versión húmeda, con ganache de chocolate.',
    [
      { error: 'Bizcocho seco', solucion: 'Hornear de más o no agregar suficiente líquido. La leche y la mantequilla son clave para la humedad.' },
      { error: 'Ganache se corta', solucion: 'Chocolate muy caliente o crema fría. La crema debe estar caliente pero no hirviendo, y el chocolate picado fino.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'El bizcocho se puede congelar hasta 2 meses. La ganache no.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 129. Torta tres leches */
  r('Torta tres leches', 'dulces',
    ['torta', 'tres leches', 'dulce', 'horno', 'cumpleaños', 'reposteria'],
    null, '1 h + frío', '12 porciones', 'media', 'Horno',
    [
      'Bizcocho: 5 huevos',
      'Bizcocho: 200 g de azúcar',
      'Bizcocho: 200 g de harina',
      'Bizcocho: 1 cucharadita de polvos de hornear',
      'Bizcocho: 1 cucharadita de vainilla',
      'Mezcla de tres leches: 1 tarro de leche condensada (397 g)',
      'Mezcla de tres leches: 1 tarro de leche evaporada (354 ml)',
      'Mezcla de tres leches: 1 taza de crema',
      'Cubierta: 300 ml de crema para batir',
      'Cubierta: 3 cucharadas de azúcar flor',
      'Cubierta: canela en polvo (opcional)',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa un molde rectangular.',
      'Bate los huevos con el azúcar hasta que estén pálidos y espumosos. Agrega la vainilla.',
      'Incorpora la harina cernida con los polvos de hornear con movimientos envolventes.',
      'Vierte en el molde y hornea 25-30 minutos. Deja enfriar.',
      'Mezcla la leche condensada, evaporada y crema.',
      'Pincha el bizcocho con un tenedor y vierte la mezcla de tres leches lentamente, dejando que absorba.',
      'Refrigera al menos 4 horas (mejor toda la noche).',
      'Bate la crema con el azúcar y cubre la torta. Espolvorea canela si quieres.',
    ],
    'La torta tres leches es de origen latinoamericano y en Chile se volvió clásica de cumpleaños y celebraciones. Se llama así por las tres leches que la empapan: condensada, evaporada y crema. Es una torta húmeda y dulce, que se sirve bien fría.',
    [
      { error: 'Bizcocho no absorbe la leche', solucion: 'No pincharlo bien o verter la leche de golpe. Pincha el bizcocho con un tenedor y vierte la leche de a poco, dejando que absorba.' },
      { error: 'Queda muy dulce o empalagosa', solucion: 'Usar demasiada leche condensada. La proporción clásica es 1 tarro de cada leche. Si queda muy dulce, sirve con crema batida sin azúcar.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'No recomendado, la crema se corta.', recalentar: 'Se consume fría.' }
  ),

  /* 130. Mousse de chocolate */
  r('Mousse de chocolate', 'dulces',
    ['postre', 'chocolate', 'mousse', 'frio', 'simple', 'reposteria'],
    null, '20 min + frío', '4 personas', 'fácil', 'Sin horno',
    [
      '200 g de chocolate amargo',
      '3 huevos (separar claras y yemas)',
      '2 cucharadas de azúcar',
      '200 ml de crema para batir bien fría',
      '1 pizca de sal',
    ],
    [
      'Derrite el chocolate a baño María o en el microondas. Deja templar.',
      'Bate las yemas y agrégalas al chocolate derretido. Mezcla bien.',
      'Bate las claras con la sal y el azúcar hasta que formen picos firmes.',
      'Bate la crema hasta que monte.',
      'Incorpora las claras y la crema al chocolate con movimientos envolventes, con cuidado de no bajar el aire.',
      'Reparte en copas y refrigera al menos 4 horas antes de servir.',
    ],
    'El mousse de chocolate es un postre de origen francés que en Chile se volvió favorito de las cenas y celebraciones. Se sirve en copas y se puede decorar con crema, chocolate rallado o frutillas. La clave es no batir de más al incorporar las claras y la crema.',
    [
      { error: 'Mousse se baja', solucion: 'Batir de más al incorporar o chocolate muy caliente. El chocolate debe estar tibio, no caliente, y se mezcla con movimientos suaves.' },
      { error: 'Textura granulada', solucion: 'Chocolate quemado o yemas cocidas. Derrite el chocolate a baño María y deja templar antes de agregar las yemas.' },
    ],
    { refrigerador: 'Hasta 3 días en copas cubiertas con papel plástico.', congelador: 'No recomendado, la textura cambia.', recalentar: 'Se consume frío.' }
  ),

  /* 131. Tiramisú */
  r('Tiramisú', 'dulces',
    ['postre', 'tiramisú', 'café', 'mascarpone', 'italiano', 'reposteria'],
    null, '30 min + frío', '8 porciones', 'media', 'Sin horno',
    [
      '500 g de queso mascarpone',
      '4 huevos (separar claras y yemas)',
      '100 g de azúcar',
      '1 taza de café espresso frío',
      '2 cucharadas de licor (amaretto o ron)',
      '200 g de galletas de champaña o bizcochos de soletilla',
      'Cacao en polvo para espolvorear',
    ],
    [
      'Bate las yemas con el azúcar hasta que estén pálidas. Agrega el mascarpone y mezcla bien.',
      'Bate las claras a punto de nieve e incorpóralas a la mezcla de mascarpone con movimientos envolventes.',
      'Mezcla el café con el licor en un plato hondo.',
      'Moja las galletas en el café (solo 1-2 segundos por lado) y colócalas en el fondo de una fuente.',
      'Cubre con la mitad de la crema de mascarpone. Repite con otra capa de galletas y el resto de la crema.',
      'Refrigera al menos 4 horas (mejor toda la noche).',
      'Espolvorea cacao en polvo antes de servir.',
    ],
    'El tiramisú es un postre italiano que en Chile se volvió muy popular en las últimas décadas. El nombre significa "levántame" en italiano, por el café y el azúcar. En Chile se hace con queso mascarpone (que se encuentra en supermercados) o con una mezcla de queso crema y crema.',
    [
      { error: 'Galletas muy blandas', solucion: 'Mojarlas demasiado en el café. Las galletas solo necesitan 1-2 segundos por lado. Si se mojan mucho, se deshacen.' },
      { error: 'Crema muy líquida', solucion: 'No batir bien las claras o usar mascarpone a temperatura ambiente. El mascarpone debe estar frío y las claras bien batidas.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Se consume frío.' }
  ),

  /* 132. Cheesecake */
  r('Cheesecake', 'dulces',
    ['postre', 'queso', 'cheesecake', 'horno', 'reposteria', 'clásico'],
    null, '1 h 30 min + frío', '12 porciones', 'media', 'Horno',
    [
      'Base: 200 g de galletas de champaña o de agua',
      'Base: 100 g de mantequilla derretida',
      'Relleno: 600 g de queso crema',
      'Relleno: 200 g de azúcar',
      'Relleno: 3 huevos',
      'Relleno: 200 ml de crema',
      'Relleno: 1 cucharadita de vainilla',
      'Relleno: 2 cucharadas de maicena',
      'Cubierta: mermelada de frutillas o frutos rojos (opcional)',
    ],
    [
      'Precalienta el horno a 160 °C. Tritura las galletas y mézclalas con la mantequilla derretida. Presiona en el fondo de un molde desmontable.',
      'Hornea la base 10 minutos. Deja enfriar.',
      'Bate el queso crema con el azúcar hasta que esté liso. Agrega los huevos uno a uno, la crema, la vainilla y la maicena.',
      'Vierte el relleno sobre la base.',
      'Hornea a 160 °C por 50-60 minutos, hasta que el centro esté casi cuajado (puede temblar ligeramente).',
      'Apaga el horno y deja el cheesecake dentro con la puerta entreabierta 1 hora. Esto evita que se agriete.',
      'Refrigera al menos 4 horas. Cubre con mermelada si quieres.',
    ],
    'El cheesecake es de origen estadounidense pero en Chile se volvió favorito de las cartas de restaurantes y de las casas. Se hace con queso crema (tipo Philadelphia) y se hornea a baño María para que no se agriete. La versión chilena suele llevar mermelada de frutillas encima.',
    [
      { error: 'Se agrieta', solucion: 'Hornear a temperatura muy alta o no enfriarlo lentamente. Hornea a 160 °C y deja enfriar dentro del horno con la puerta entreabierta.' },
      { error: 'Queda líquido en el centro', solucion: 'Hornear poco tiempo. El cheesecake debe hornearse hasta que el centro esté casi cuajado, pero puede temblar ligeramente.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 2 meses, bien envuelto.', recalentar: 'Se consume frío.' }
  ),

  /* 133. Empanadas de manzana */
  r('Empanadas de manzana', 'dulces',
    ['empanada', 'dulce', 'manzana', 'horno', 'postre', 'tradicional'],
    null, '1 h', '12 unidades', 'media', 'Horno',
    [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 200 g de mantequilla',
      'Masa: 100 g de azúcar',
      'Masa: 2 yemas',
      'Masa: 100 ml de agua fría',
      'Relleno: 4 manzanas verdes peladas y en cubos',
      'Relleno: ½ taza de azúcar',
      'Relleno: 1 cucharadita de canela',
      'Relleno: 2 cucharadas de pasas (opcional)',
      'Pintar: 1 huevo batido',
      'Azúcar flor para espolvorear',
    ],
    [
      'Prepara la masa: mezcla la harina con el azúcar. Agrega la mantequilla fría en cubos y trabaja con los dedos. Añade las yemas y el agua fría. Amasa hasta que esté lisa. Refrigera 30 minutos.',
      'Para el relleno, cocina las manzanas con el azúcar y la canela a fuego medio 10 minutos, hasta que estén tiernas. Agrega las pasas y deja enfriar.',
      'Estira la masa y corta círculos de 15 cm.',
      'Rellena con 2 cucharadas del relleno frío. Cierra con repulgue y pincha con tenedor.',
      'Pinta con huevo batido y hornea a 180 °C por 20-25 minutos, hasta dorar.',
      'Espolvorea azúcar flor antes de servir.',
    ],
    'Las empanadas de manzana son el postre de las fiestas patrias chilenas. Se hacen con manzanas verdes (tipo Granny Smith) y se condimentan con canela. En el sur se hacen con manzanas de la zona. Se sirven tibias o frías.',
    [
      { error: 'Relleno se sale', solucion: 'Relleno caliente o repulgue mal sellado. El relleno debe estar frío y el repulgue firme.' },
      { error: 'Masa dura', solucion: 'Amasado excesivo o mantequilla caliente. La mantequilla debe estar fría y la masa no debe amasarse mucho.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses crudas o cocidas.', recalentar: 'Horno a 180 °C por 5-8 minutos.' }
  ),

  /* 134. Empanadas de alcayota */
  r('Empanadas de alcayota', 'dulces',
    ['empanada', 'dulce', 'alcayota', 'horno', 'postre', 'tradicional'],
    null, '1 h', '12 unidades', 'media', 'Horno',
    [
      'Masa: 500 g de harina sin polvos de hornear',
      'Masa: 200 g de mantequilla',
      'Masa: 100 g de azúcar',
      'Masa: 2 yemas',
      'Masa: 100 ml de agua fría',
      'Relleno: 500 g de dulce de alcayota (ver receta)',
      'Relleno: 50 g de nueces picadas (opcional)',
      'Pintar: 1 huevo batido',
      'Azúcar flor para espolvorear',
    ],
    [
      'Prepara la masa igual que para las empanadas de manzana: mezcla harina y azúcar, agrega mantequilla fría, yemas y agua. Amasa, refrigera 30 minutos.',
      'Estira la masa y corta círculos de 15 cm.',
      'Rellena con 2 cucharadas de dulce de alcayota frío. Agrega nueces si quieres.',
      'Cierra con repulgue y pincha con tenedor.',
      'Pinta con huevo batido y hornea a 180 °C por 20-25 minutos.',
      'Espolvorea azúcar flor antes de servir.',
    ],
    'La alcayota es una fruta de la familia de la calabaza, típica de la zona central de Chile. Su dulce es un clásico de la repostería chilena, especialmente en fiestas patrias. Las empanadas de alcayota son primas de las de manzana, pero con un sabor más suave y dulce.',
    [
      { error: 'Relleno se sale', solucion: 'Relleno caliente o repulgue mal sellado. El dulce de alcayota debe estar frío y espeso.' },
      { error: 'Masa dura', solucion: 'Amasado excesivo. La masa debe trabajarse lo justo.' },
    ],
    { refrigerador: 'Hasta 3 días cocidas.', congelador: 'Hasta 3 meses crudas o cocidas.', recalentar: 'Horno a 180 °C por 5-8 minutos.' }
  ),

  /* 135. Dulce de alcayota */
  r('Dulce de alcayota', 'dulces',
    ['dulce', 'alcayota', 'conserva', 'postre', 'tradicional', 'chile'],
    null, '1 h 30 min', '4 frascos', 'fácil', 'Olla',
    [
      '1 alcayota grande (2 a 3 kg)',
      '1 kg de azúcar',
      '1 rama de canela',
      '3 clavos de olor',
      'Cáscara de 1 naranja',
      'Jugo de 1 limón',
    ],
    [
      'Pela la alcayota, córtala por la mitad y retira las semillas y la pulpa fibrosa.',
      'Corta la pulpa en tiras o cubos. Cocínala en agua hirviendo 20 minutos, hasta que esté tierna. Escurre.',
      'En una olla, mezcla la alcayota cocida con el azúcar, la canela, los clavos y la cáscara de naranja.',
      'Cocina a fuego medio-bajo, revolviendo de vez en cuando, por 40-50 minutos, hasta que el dulce espese y tome color.',
      'Agrega el jugo de limón al final y revuelve.',
      'Envasa en frascos esterilizados calientes y tapa. Deja enfriar y refrigera.',
    ],
    'El dulce de alcayota es un clásico de la repostería chilena. La alcayota (o alcayota) es una fruta originaria de Chile, de la familia de las cucurbitáceas. Su pulpa es fibrosa y dulce, y se usa para hacer dulces, mermeladas y empanadas. En Chile se cultiva sobre todo en la zona central.',
    [
      { error: 'Queda muy líquido', solucion: 'No cocinar el tiempo suficiente. El dulce debe espesar y tomar color. Cocina a fuego medio-bajo hasta que tenga consistencia de mermelada espesa.' },
      { error: 'Sabe amargo', solucion: 'No retirar bien las semillas y la pulpa fibrosa. La alcayota tiene una parte fibrosa que es amarga. Retírala bien antes de cocinar.' },
    ],
    { refrigerador: 'Hasta 1 mes en frasco esterilizado cerrado.', congelador: 'Hasta 6 meses.', recalentar: 'A temperatura ambiente o tibio.' }
  ),

  /* 136. Tortilla de papas */
  r('Tortilla de papas', 'principales',
    ['tortilla', 'papa', 'huevo', 'sartén', 'español', 'simple'],
    null, '40 min', '4 personas', 'fácil', 'Sartén',
    [
      '4 papas medianas peladas y en láminas finas',
      '1 cebolla grande en pluma',
      '6 huevos',
      '½ taza de aceite de oliva',
      'Sal y pimienta',
    ],
    [
      'Calienta el aceite en una sartén grande. Cocina las papas y la cebolla a fuego medio-bajo 15-20 minutos, hasta que estén tiernas pero no doradas. Escurre el exceso de aceite.',
      'Bate los huevos con sal y pimienta. Agrega las papas y la cebolla y mezcla.',
      'Deja reposar la mezcla 5 minutos para que los huevos absorban el sabor.',
      'En la misma sartén (con un poco de aceite), vierte la mezcla y cocina a fuego medio 5-7 minutos, hasta que los bordes se despeguen.',
      'Da vuelta la tortilla con un plato o tapa y cocina 3-4 minutos más.',
      'Sirve tibia o fría, cortada en porciones.',
    ],
    'La tortilla de papas es de origen español y en Chile se volvió parte de la cocina casera, especialmente en la once. Se sirve tibia o fría, como entrada o plato principal. La versión chilena suele llevar cebolla, a diferencia de la española que a veces no la lleva.',
    [
      { error: 'Se rompe al dar vuelta', solucion: 'No cocinar bien de un lado o usar una sartén pequeña. Cocina 5-7 minutos de un lado, hasta que los bordes se despeguen bien, y usa un plato grande para dar vuelta.' },
      { error: 'Queda cruda por dentro', solucion: 'Fuego muy alto. Cocina a fuego medio para que cuaje por dentro sin quemarse.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 2 minutos por lado, o microondas 30 segundos.' }
  ),

  /* 137. Lentejas */
  r('Lentejas', 'principales',
    ['lentejas', 'legumbre', 'guiso', 'olla', 'invierno', 'cotidiano'],
    null, '50 min', '4 personas', 'fácil', 'Olla',
    [
      '1 taza de lentejas (remojadas 2 horas o usar lentejas que no requieren remojo)',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 zanahoria en cubos',
      '1 pimentón rojo en cubos',
      '1 longaniza en rodajas (opcional)',
      '1 hoja de laurel',
      '1 cucharadita de orégano',
      '1 cucharadita de ají de color',
      '1 taza de arroz (opcional)',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón en aceite hasta que estén tiernos.',
      'Agrega la longaniza si usas y cocina 3 minutos. Añade el ají de color y el orégano.',
      'Incorpora las lentejas escurridas y cubre con agua o caldo. Agrega el laurel.',
      'Cocina a fuego medio 30-40 minutos, hasta que las lentejas estén blandas.',
      'Si usas arroz, agrégalo en los últimos 15 minutos. Condimenta con sal y pimienta.',
      'Sirve caliente con pan amasado.',
    ],
    'Las lentejas son el plato de invierno más cotidiano de Chile. Se hacen con o sin arroz, con longaniza o sin ella. Cada familia tiene su versión: hay quienes le ponen papas, otros zapallo, otros solo verduras. La del sur suele llevar longaniza; la de la zona central, más liviana.',
    [
      { error: 'Lentejas duras', solucion: 'No remojarlas o cocinarlas con sal al principio. Si no las remojaste, cocínalas 15 minutos más. Agrega la sal al final.' },
      { error: 'Quedan secas', solucion: 'No agregar suficiente líquido. Las lentejas absorben mucho; revisa y agrega agua caliente si es necesario.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua o caldo.' }
  ),

  /* 138. Porotos partidos */
  r('Porotos partidos', 'principales',
    ['porotos', 'legumbre', 'guiso', 'olla', 'invierno', 'cotidiano'],
    null, '1 h + remojo', '4 personas', 'fácil', 'Olla',
    [
      '500 g de porotos partidos (remojados desde la noche anterior)',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 zanahoria en cubos',
      '1 pimentón rojo en cubos',
      '1 longaniza en rodajas (opcional)',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Remoja los porotos partidos la noche anterior. Escurre y enjuaga.',
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén tiernos.',
      'Agrega la longaniza si usas, el ají de color y el orégano.',
      'Incorpora los porotos y cubre con agua o caldo. Cocina a fuego medio 45-60 minutos, hasta que estén blandos y el caldo espese.',
      'Condimenta con sal y pimienta al final. Sirve caliente con pan.',
    ],
    'Los porotos partidos son un clásico de invierno chileno. Se hacen con longaniza o sin ella, y se sirven con pan amasado para "mojar". Son primos de los porotos granados, pero con porotos secos partidos, lo que da una textura más cremosa.',
    [
      { error: 'Porotos duros', solucion: 'No remojarlos o agregar sal al principio. Remoja desde la noche anterior y agrega la sal al final.' },
      { error: 'Quedan aguados', solucion: 'No dejar reducir el caldo. Si están muy líquidos, destapa y cocina 10 minutos más a fuego medio.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua.' }
  ),

  /* 139. Garbanzos */
  r('Garbanzos', 'principales',
    ['garbanzos', 'legumbre', 'guiso', 'olla', 'invierno', 'cotidiano'],
    null, '1 h + remojo', '4 personas', 'fácil', 'Olla',
    [
      '500 g de garbanzos (remojados desde la noche anterior)',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 zanahoria en cubos',
      '1 pimentón rojo en cubos',
      '1 longaniza en rodajas (opcional)',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      '1 hoja de laurel',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Remoja los garbanzos la noche anterior. Escurre y enjuaga.',
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén tiernos.',
      'Agrega la longaniza si usas, el ají de color, el orégano y el laurel.',
      'Incorpora los garbanzos y cubre con agua o caldo. Cocina a fuego medio 45-60 minutos, hasta que estén blandos.',
      'Condimenta con sal y pimienta al final. Sirve caliente con arroz o pan.',
    ],
    'Los garbanzos son una legumbre muy querida en Chile, sobre todo en invierno. Se hacen guisados con longaniza o sin ella, y se sirven con arroz. En el sur se les agrega zapallo para espesar.',
    [
      { error: 'Garbanzos duros', solucion: 'No remojarlos o cocinarlos con sal al principio. Remoja desde la noche anterior y agrega la sal al final.' },
      { error: 'Se deshacen', solucion: 'Cocinarlos demasiado. Los garbanzos deben quedar enteros pero blandos. Revisa a los 45 minutos.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua.' }
  ),

  /* 140. Arvejas partidas */
  r('Arvejas partidas', 'principales',
    ['arvejas', 'legumbre', 'guiso', 'olla', 'invierno', 'cotidiano'],
    null, '1 h + remojo', '4 personas', 'fácil', 'Olla',
    [
      '500 g de arvejas partidas (remojadas desde la noche anterior)',
      '1 cebolla picada fina',
      '2 dientes de ajo picados',
      '1 zanahoria en cubos',
      '1 pimentón rojo en cubos',
      '1 longaniza en rodajas (opcional)',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Remoja las arvejas partidas la noche anterior. Escurre y enjuaga.',
      'Sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén tiernos.',
      'Agrega la longaniza si usas, el ají de color y el orégano.',
      'Incorpora las arvejas y cubre con agua o caldo. Cocina a fuego medio 45-60 minutos, hasta que estén blandas y el caldo espese.',
      'Condimenta con sal y pimienta al final. Sirve caliente con pan.',
    ],
    'Las arvejas partidas son una legumbre de invierno muy chilena. Se hacen guisadas, con longaniza o sin ella. Son más dulces que los porotos y se sirven con pan amasado.',
    [
      { error: 'Quedan duras', solucion: 'No remojarlas o cocinarlas con sal al principio. Remoja desde la noche anterior.' },
      { error: 'Quedan muy espesas', solucion: 'No agregar suficiente líquido. Las arvejas partidas absorben mucho; revisa y agrega agua caliente si es necesario.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua.' }
  ),
  /* 141. Pastel de papas */
  r('Pastel de papas', 'principales',
    ['pastel', 'papa', 'carne', 'horno', 'plato principal', 'cotidiano'],
    null, '1 h', '6 personas', 'media', 'Horno',
    [
      '6 papas grandes',
      '½ taza de leche',
      '2 cucharadas de mantequilla',
      '500 g de carne picada',
      '1 cebolla grande picada fina',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      '3 huevos duros, 12 aceitunas, 50 g de pasas',
      'Sal, pimienta y aceite',
    ],
    [
      'Cuece las papas y haz un puré con la leche y la mantequilla. Reserva.',
      'Sofríe la cebolla, el ajo y el pimentón. Agrega la carne y condimenta con ají de color, orégano, sal y pimienta.',
      'Cocina la carne 10 minutos, agrega el tomate y deja reducir.',
      'En una fuente para horno, extiende la mitad del puré. Encima pon el pino, los huevos duros, las aceitunas y las pasas.',
      'Cubre con el resto del puré y alisa la superficie con un tenedor.',
      'Hornea a 200 °C por 25-30 minutos, hasta que la superficie esté dorada.',
    ],
    'El pastel de papas es el hermano del pastel de choclo, pero con puré de papas en vez de pasta de choclo. Es igual de tradicional y se hace en las casas chilenas todo el año. Se le puede agregar azúcar por encima para gratinar, igual que al de choclo.',
    [
      { error: 'Puré aguado', solucion: 'Cocer las papas con poca agua y escurrir bien. El puré debe quedar espeso para que sostenga el relleno.' },
      { error: 'Se desarma al servir', solucion: 'No dejar reposar antes de cortar. Deja reposar 10 minutos fuera del horno antes de porcionar.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, el puré se aguada.', recalentar: 'Horno a 180 °C por 15 minutos.' }
  ),

  /* 142. Fideos con albóndigas */
  r('Fideos con albóndigas', 'principales',
    ['pasta', 'fideos', 'albóndigas', 'carne', 'cotidiano', 'salsa de tomate'],
    null, '45 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de fideos (tallarines, spaghetti o corbatas)',
      '400 g de carne picada',
      '1 huevo',
      '½ taza de pan rallado',
      '2 dientes de ajo picados',
      '1 cebolla picada fina',
      '1 zanahoria rallada',
      '1 tarro de tomates pelados (o 6 tomates maduros)',
      '1 cucharadita de azúcar',
      'Sal, pimienta, orégano y albahaca',
      'Aceite',
    ],
    [
      'Mezcla la carne picada con el huevo, el pan rallado, la mitad del ajo, sal y pimienta. Forma bolitas del tamaño de una nuez.',
      'Dora las albóndigas en aceite caliente. Retira y reserva.',
      'En la misma olla, sofríe la cebolla, el ajo restante y la zanahoria. Agrega los tomates y condimenta con azúcar, orégano y albahaca.',
      'Devuelve las albóndigas a la salsa y cocina a fuego bajo 20 minutos.',
      'Cocina los fideos en abundante agua con sal. Escurre.',
      'Sirve los fideos con la salsa y las albóndigas encima. Espolvorea queso rallado si quieres.',
    ],
    'Los fideos con albóndigas son el plato de pasta más cotidiano de Chile, después de los tallarines con salsa de tomate. Se hacen con carne picada de vacuno o una mezcla de vacuno y cerdo. La salsa de tomate casera es la base.',
    [
      { error: 'Albóndigas duras', solucion: 'Usar carne muy magra o no agregar suficiente pan rallado. La carne debe tener algo de grasa y el pan rallado le da jugosidad.' },
      { error: 'Se deshacen en la salsa', solucion: 'No dorarlas antes de ponerlas en la salsa. Dorarlas en aceite caliente sella la superficie y evita que se deshagan.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'La salsa con albóndigas hasta 2 meses. Los fideos no.', recalentar: 'A fuego lento en la olla.' }
  ),

  /* 143. Atún con arroz o pasta */
  r('Atún con arroz o pasta', 'principales',
    ['atún', 'arroz', 'pasta', 'cotidiano', 'rápido', 'economico'],
    null, '20 min', '2 personas', 'muy fácil', 'Olla',
    [
      '1 taza de arroz (o 200 g de pasta)',
      '1 tarro de atún al agua o al aceite (180 g)',
      '1 cebolla pequeña picada fina',
      '1 diente de ajo picado',
      '1 tomate maduro picado (o 2 cucharadas de salsa de tomate)',
      '2 cucharadas de aceite',
      'Sal, pimienta y orégano',
    ],
    [
      'Cocina el arroz o la pasta según las instrucciones del paquete.',
      'Mientras tanto, sofríe la cebolla y el ajo en aceite hasta que estén transparentes.',
      'Agrega el tomate y cocina 3 minutos. Añade el atún escurrido y desmenuzado.',
      'Condimenta con sal, pimienta y orégano. Cocina 2 minutos.',
      'Mezcla con el arroz o la pasta cocida. Sirve caliente.',
    ],
    'El atún con arroz o pasta es el clásico "no hay nada en la casa" chileno. Se hace en 20 minutos y salva cualquier almuerzo o cena. Se le puede agregar choclo, arvejas o lo que haya en el refrigerador.',
    [
      { error: 'Queda seco', solucion: 'No agregar suficiente tomate o salsa. El atún necesita algo de líquido para no quedar seco.' },
      { error: 'Sabe muy fuerte a atún', solucion: 'No escurrir bien el atún. Escúrrelo bien y desmenúzalo antes de agregarlo.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 3 minutos.' }
  ),

  /* 144. Croquetas de jurel */
  r('Croquetas de jurel', 'principales',
    ['jurel', 'pescado', 'croqueta', 'fritura', 'cotidiano', 'economico'],
    null, '40 min', '4 personas (12 croquetas)', 'fácil', 'Fritura',
    [
      '2 filetes de jurel cocidos y desmenuzados (o 1 tarro de jurel)',
      '2 papas medianas cocidas y hechas puré',
      '1 cebolla pequeña picada muy fina',
      '1 huevo',
      '½ taza de pan rallado',
      '2 cucharadas de perejil picado',
      'Sal, pimienta y orégano',
      'Aceite para freír',
      'Harina para empanar',
    ],
    [
      'Mezcla el jurel desmenuzado con el puré de papas, la cebolla, el huevo, el perejil y los condimentos.',
      'Forma croquetas del tamaño de una nuez grande. Pásalas por harina, luego por huevo batido y finalmente por pan rallado.',
      'Fríe en abundante aceite caliente hasta que estén doradas por ambos lados.',
      'Escurre sobre papel absorbente y sirve calientes con ensalada o arroz.',
    ],
    'Las croquetas de jurel son un clásico de la cocina chilena económica. El jurel es un pescado abundante y barato en Chile, y las croquetas son una forma rica de comerlo. Se pueden hacer con jurel fresco o en conserva.',
    [
      { error: 'Se deshacen al freír', solucion: 'La mezcla está muy húmeda o no se empanó bien. Escurre bien el jurel, agrega más pan rallado si es necesario y empaniza con harina, huevo y pan rallado.' },
      { error: 'Quedan aceitosas', solucion: 'El aceite no está caliente. Fríe a fuego medio (170 °C) para que se cocinen por dentro sin absorber aceite.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, ya empanizadas y crudas.', recalentar: 'Horno o freidora de aire a 180 °C por 5-8 minutos.' }
  ),

  /* 145. Mariscos en salsa verde */
  r('Mariscos en salsa verde', 'principales',
    ['marisco', 'salsa verde', 'olla', 'plato principal', 'costa'],
    null, '30 min', '4 personas', 'fácil', 'Olla',
    [
      '500 g de mariscos variados (choritos, almejas, camarones)',
      '200 g de pescado blanco en trozos',
      '1 cebolla grande picada fina',
      '3 dientes de ajo picados',
      '1 pimentón verde en cubos',
      '1 taza de perejil fresco picado',
      '½ taza de vino blanco',
      '½ taza de aceite de oliva',
      '1 cucharada de harina',
      'Sal, pimienta y ají verde al gusto',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón en aceite de oliva hasta que estén tiernos.',
      'Agrega la harina y revuelve 1 minuto. Vierte el vino blanco y deja evaporar.',
      'Incorpora los mariscos y el pescado. Cocina 5-7 minutos, hasta que los mariscos se abran.',
      'Agrega el perejil, el ají, sal y pimienta. Cocina 2 minutos más.',
      'Sirve caliente con arroz o pan.',
    ],
    'Los mariscos en salsa verde son un plato típico de la costa chilena. La salsa verde se hace con perejil, ajo, vino blanco y aceite de oliva. Es una preparación simple que resalta el sabor del marisco. Se puede hacer con mariscos frescos o congelados.',
    [
      { error: 'Mariscos gomosos', solucion: 'Cocinarlos demasiado. Los mariscos se hacen en 5-7 minutos. Agrega el pescado al final.' },
      { error: 'Salsa sin sabor', solucion: 'No usar suficiente perejil o ajo. La salsa verde depende del perejil fresco y el ajo.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, sin hervir.' }
  ),

  /* 146. Mariscal */
  r('Mariscal', 'principales',
    ['marisco', 'pescado', 'guiso', 'olla', 'plato principal', 'costa'],
    null, '40 min', '4 personas', 'media', 'Olla',
    [
      '300 g de mariscos variados (choritos, almejas, camarones)',
      '300 g de pescado blanco en trozos',
      '200 g de pulpo o calamar en trozos (opcional)',
      '4 papas medianas en cubos',
      '1 cebolla grande picada',
      '2 dientes de ajo picados',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 taza de vino blanco',
      '1 L de caldo de pescado',
      'Sal, pimienta, orégano y merkén',
      'Aceite de oliva',
    ],
    [
      'Sofríe la cebolla, el ajo y el pimentón en aceite de oliva hasta que estén tiernos.',
      'Agrega el tomate y condimenta con sal, pimienta, orégano y merkén. Cocina 5 minutos.',
      'Vierte el vino blanco y deja evaporar.',
      'Añade el caldo y las papas. Cocina 15 minutos.',
      'Incorpora los mariscos, el pescado y el pulpo si usas. Cocina 7-10 minutos, hasta que los mariscos se abran.',
      'Rectifica la sal y sirve con perejil fresco.',
    ],
    'El mariscal es una mezcla de mariscos y pescado, típica de la costa chilena. Es como una cazuela de mariscos pero más espesa. Se sirve con papas y caldo. En el sur se hace con cholgas y picorocos; en la zona central con choritos y almejas.',
    [
      { error: 'Mariscos gomosos', solucion: 'Cocinarlos demasiado. Agrega los mariscos al final y cocina solo hasta que se abran.' },
      { error: 'Caldo soso', solucion: 'Usar agua en vez de caldo de pescado. El caldo de pescado es la base del sabor.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, idealmente sin papas.', recalentar: 'A fuego muy suave, sin hervir.' }
  ),

  /* 147. Tortilla de acelga */
  r('Tortilla de acelga', 'principales',
    ['tortilla', 'acelga', 'huevo', 'sartén', 'vegetariano', 'cotidiano'],
    null, '25 min', '4 personas', 'muy fácil', 'Sartén',
    [
      '1 atado de acelgas (solo las hojas, sin los tallos)',
      '1 cebolla pequeña picada fina',
      '6 huevos',
      '2 cucharadas de aceite',
      'Sal, pimienta y nuez moscada (opcional)',
    ],
    [
      'Lava bien las acelgas y pícalas finas. Escúrrelas bien.',
      'Sofríe la cebolla en aceite hasta que esté transparente. Agrega la acelga y cocina 3-4 minutos, hasta que se ablande.',
      'Bate los huevos con sal, pimienta y nuez moscada. Agrega la acelga y la cebolla.',
      'Vierte la mezcla en la sartén y cocina a fuego medio 5-7 minutos, hasta que los bordes se despeguen.',
      'Da vuelta la tortilla con un plato y cocina 3-4 minutos más.',
      'Sirve tibia o fría, cortada en porciones.',
    ],
    'La tortilla de acelga es un clásico de la once y del almuerzo rápido chileno. Se hace con acelga, huevo y cebolla. Es una forma rica de comer verduras. Se puede hacer también con espinaca.',
    [
      { error: 'Queda aguada', solucion: 'No escurrir bien la acelga. La acelga suelta mucha agua al cocinarse. Escúrrela bien antes de mezclarla con los huevos.' },
      { error: 'Se rompe al dar vuelta', solucion: 'No cocinar bien de un lado. Cocina 5-7 minutos de un lado, hasta que los bordes se despeguen bien.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 2 minutos por lado.' }
  ),

  /* 148. Tortilla de espinaca */
  r('Tortilla de espinaca', 'principales',
    ['tortilla', 'espinaca', 'huevo', 'sartén', 'vegetariano', 'cotidiano'],
    null, '25 min', '4 personas', 'muy fácil', 'Sartén',
    [
      '1 atado de espinacas frescas',
      '1 cebolla pequeña picada fina',
      '6 huevos',
      '2 cucharadas de aceite',
      'Sal, pimienta y nuez moscada (opcional)',
    ],
    [
      'Lava bien las espinacas y pícalas finas. Escúrrelas bien.',
      'Sofríe la cebolla en aceite hasta que esté transparente. Agrega la espinaca y cocina 3-4 minutos, hasta que se ablande.',
      'Bate los huevos con sal, pimienta y nuez moscada. Agrega la espinaca y la cebolla.',
      'Vierte la mezcla en la sartén y cocina a fuego medio 5-7 minutos, hasta que los bordes se despeguen.',
      'Da vuelta la tortilla con un plato y cocina 3-4 minutos más.',
      'Sirve tibia o fría, cortada en porciones.',
    ],
    'La tortilla de espinaca es la hermana de la tortilla de acelga. Se hace igual, pero con espinaca. Es una forma rica de comer verduras y se sirve en la once o como entrada.',
    [
      { error: 'Queda aguada', solucion: 'No escurrir bien la espinaca. La espinaca suelta agua al cocinarse. Escúrrela bien antes de mezclarla.' },
      { error: 'Se rompe al dar vuelta', solucion: 'No cocinar bien de un lado. Cocina 5-7 minutos de un lado antes de dar vuelta.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 2 minutos por lado.' }
  ),

  /* 149. Tortilla de fideos */
  r('Tortilla de fideos', 'principales',
    ['tortilla', 'fideos', 'pasta', 'huevo', 'sartén', 'cotidiano', 'economico'],
    null, '25 min', '4 personas', 'muy fácil', 'Sartén',
    [
      '200 g de fideos cocidos (del día anterior sirven perfecto)',
      '1 cebolla pequeña picada fina',
      '6 huevos',
      '2 cucharadas de aceite',
      'Sal, pimienta y orégano',
    ],
    [
      'Sofríe la cebolla en aceite hasta que esté transparente.',
      'Bate los huevos con sal, pimienta y orégano. Agrega los fideos cocidos y la cebolla.',
      'Vierte la mezcla en la sartén y cocina a fuego medio 5-7 minutos, hasta que los bordes se despeguen.',
      'Da vuelta la tortilla con un plato y cocina 3-4 minutos más.',
      'Sirve tibia o fría, cortada en porciones.',
    ],
    'La tortilla de fideos es el plato de aprovechamiento chileno por excelencia. Se hace con los fideos que sobraron del día anterior. Es económica, rápida y rica. Se puede hacer con cualquier tipo de fideo: tallarines, corbatas, spaghetti.',
    [
      { error: 'Se desarma', solucion: 'No batir bien los huevos o usar demasiados fideos. La proporción es 6 huevos por 200 g de fideos cocidos.' },
      { error: 'Queda seca', solucion: 'Cocinarla demasiado. La tortilla de fideos debe quedar jugosa por dentro.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Sartén a fuego medio 2 minutos por lado.' }
  ),

  /* 150. Fritos de coliflor */
  r('Fritos de coliflor', 'principales',
    ['coliflor', 'fritura', 'vegetariano', 'cotidiano', 'entrada'],
    null, '30 min', '4 personas', 'fácil', 'Fritura',
    [
      '1 coliflor mediana',
      '2 huevos',
      '1 taza de harina',
      '½ taza de leche',
      '1 cucharadita de polvos de hornear',
      'Sal, pimienta y nuez moscada',
      'Aceite para freír',
    ],
    [
      'Corta la coliflor en ramilletes y cuécela en agua con sal 5-7 minutos, hasta que esté tierna pero firme. Escurre bien.',
      'Prepara la mezcla: bate los huevos con la harina, la leche, los polvos de hornear, sal, pimienta y nuez moscada. Debe quedar como una pasta espesa.',
      'Pasa los ramilletes de coliflor por la mezcla.',
      'Fríe en abundante aceite caliente hasta que estén dorados. Escurre sobre papel absorbente.',
      'Sirve calientes con sal y limón, o con salsa de tomate.',
    ],
    'Los fritos de coliflor son un clásico de la cocina chilena de invierno. Se hacen rebozados y fritos, y se sirven como entrada o acompañamiento. Son una forma rica de comer coliflor, que a muchos no les gusta hervida.',
    [
      { error: 'Quedan aceitosos', solucion: 'El aceite no está caliente o la coliflor está muy húmeda. Seca bien la coliflor y fríe a fuego medio (170 °C).' },
      { error: 'El rebozado se cae', solucion: 'La coliflor está muy húmeda o la mezcla muy líquida. Seca bien la coliflor y haz la mezcla más espesa.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Horno o freidora de aire a 180 °C por 5 minutos.' }
  ),

  /* 151. Puré con huevo */
  r('Puré con huevo', 'principales',
    ['puré', 'papa', 'huevo', 'cotidiano', 'simple', 'comfort'],
    null, '25 min', '4 personas', 'muy fácil', 'Olla',
    [
      '6 papas medianas',
      '3 cucharadas de mantequilla',
      '½ taza de leche',
      'Sal y pimienta',
      '4 huevos',
      'Aceite para freír',
    ],
    [
      'Cuece las papas en agua con sal hasta que estén tiernas. Escurre.',
      'Haz un puré con la mantequilla, la leche, sal y pimienta. Bate hasta que quede cremoso.',
      'Fríe los huevos en aceite con sal y pimienta.',
      'Sirve el puré en platos y pon un huevo frito encima de cada porción.',
    ],
    'El puré con huevo es el plato más simple y reconfortante de la cocina chilena. Se come en la once, en el almuerzo, o cuando no hay ganas de cocinar. El huevo frito con yema líquida sobre el puré caliente es una combinación perfecta.',
    [
      { error: 'Puré con grumos', solucion: 'Batir las papas calientes con leche fría. Usa leche tibia y mantequilla a temperatura ambiente.' },
      { error: 'Huevo con yema dura', solucion: 'Cocinar de más. El huevo frito necesita 2-3 minutos a fuego medio para yema líquida.' },
    ],
    { refrigerador: 'Hasta 2 días por separado.', congelador: 'No recomendado.', recalentar: 'Puré en microondas con un poco de leche. Huevo al momento.' }
  ),

  /* 152. Papas al horno */
  r('Papas al horno', 'principales',
    ['papa', 'horno', 'acompañamiento', 'simple', 'vegetariano'],
    null, '45 min', '4 personas', 'muy fácil', 'Horno',
    [
      '6 papas medianas',
      '3 cucharadas de aceite de oliva',
      '1 cucharadita de sal gruesa',
      '1 cucharadita de pimentón (opcional)',
      '1 cucharadita de romero o tomillo (opcional)',
    ],
    [
      'Precalienta el horno a 200 °C.',
      'Lava bien las papas y córtalas en gajos o cubos. No las peles si quieres que queden más crujientes.',
      'Mezcla las papas con el aceite, la sal, el pimentón y las hierbas.',
      'Extiéndelas en una bandeja para horno en una sola capa.',
      'Hornea 30-40 minutos, dando vuelta a mitad de cocción, hasta que estén doradas y crujientes.',
      'Sirve como acompañamiento de carnes o pollo.',
    ],
    'Las papas al horno son el acompañamiento más versátil de la cocina chilena. Se hacen con aceite de oliva, sal y las hierbas que tengas. Son más sanas que las fritas y quedan igual de ricas.',
    [
      { error: 'Quedan blandas', solucion: 'No precalentar el horno o ponerlas muy juntas. Precalienta bien el horno y extiéndelas en una sola capa.' },
      { error: 'Se pegan a la bandeja', solucion: 'No usar suficiente aceite. Unta bien la bandeja o usa papel de horno.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Horno o freidora de aire a 180 °C por 5-8 minutos.' }
  ),

  /* 153. Ensalada de betarraga */
  r('Ensalada de betarraga', 'ensaladas',
    ['ensalada', 'betarraga', 'fresca', 'acompañamiento', 'vegetariano'],
    null, '10 min + cocción', '4 personas', 'muy fácil', 'Fresca',
    [
      '2 betarragas medianas cocidas',
      '1 cebolla morada pequeña',
      '2 cucharadas de aceite de oliva',
      '1 cucharada de vinagre',
      'Sal y pimienta',
      'Cilantro fresco picado (opcional)',
    ],
    [
      'Cuece las betarragas en agua con sal hasta que estén tiernas (30-40 minutos). Pélalas y córtalas en cubos.',
      'Corta la cebolla morada en pluma fina y remójala en agua fría 10 minutos. Escurre.',
      'Mezcla la betarraga con la cebolla, el aceite, el vinagre, sal y pimienta.',
      'Agrega cilantro picado si quieres. Sirve fría.',
    ],
    'La ensalada de betarraga es un clásico de la mesa chilena, sobre todo en invierno. Se hace con betarraga cocida, cebolla morada y aceite de oliva. La betarraga tiñe todo de rojo, así que no te asustes si la cebolla queda rosada.',
    [
      { error: 'Betarraga dura', solucion: 'No cocerla el tiempo suficiente. La betarraga necesita 30-40 minutos de cocción. Pincha con un cuchillo para verificar.' },
      { error: 'Cebolla muy fuerte', solucion: 'No remojarla en agua fría. El agua le quita el picor sin perder textura.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Se consume fría.' }
  ),

  /* 154. Ensalada de lechuga */
  r('Ensalada de lechuga', 'ensaladas',
    ['ensalada', 'lechuga', 'fresca', 'acompañamiento', 'simple', 'vegetariano'],
    null, '5 min', '4 personas', 'muy fácil', 'Fresca',
    [
      '1 lechuga grande (o 2 pequeñas)',
      '2 cucharadas de aceite de oliva',
      '1 cucharada de vinagre o jugo de limón',
      'Sal y pimienta',
    ],
    [
      'Lava bien la lechuga y escúrrela. Córtala en trozos.',
      'Pon la lechuga en una ensaladera.',
      'Condimenta con aceite, vinagre o limón, sal y pimienta justo antes de servir.',
      'Mezcla suavemente y sirve.',
    ],
    'La ensalada de lechuga es la ensalada más simple de Chile. Se sirve como acompañamiento de casi todos los platos. Se condimenta con aceite, vinagre o limón, y sal. Parece obvio, pero no puede faltar en un recetario chileno.',
    [
      { error: 'Se pone aguada', solucion: 'No escurrir bien la lechuga o condimentarla con anticipación. Escurre bien y condimenta justo antes de servir.' },
      { error: 'Sabe simple', solucion: 'No usar buen aceite. Un aceite de oliva de calidad cambia completamente la ensalada.' },
    ],
    { refrigerador: 'Hasta 1 día sin condimentar.', congelador: 'No recomendado.', recalentar: 'Se consume fresca.' }
  ),

  /* 155. Ensalada de repollo */
  r('Ensalada de repollo', 'ensaladas',
    ['ensalada', 'repollo', 'fresca', 'acompañamiento', 'vegetariano', 'economico'],
    null, '10 min', '4 personas', 'muy fácil', 'Fresca',
    [
      '½ repollo mediano',
      '1 zanahoria rallada',
      '2 cucharadas de aceite',
      '1 cucharada de vinagre',
      'Sal y pimienta',
      'Jugo de limón (opcional)',
    ],
    [
      'Corta el repollo en tiras finas. Lávalo y escúrrelo bien.',
      'Ralla la zanahoria.',
      'Mezcla el repollo con la zanahoria.',
      'Condimenta con aceite, vinagre, sal y pimienta. Si quieres, agrega jugo de limón.',
      'Sirve fría.',
    ],
    'La ensalada de repollo es la ensalada más económica de la cocina chilena. Se hace con repollo y zanahoria, y se condimenta con aceite y vinagre. Es crocante y fresca, y acompaña muy bien las carnes y los guisos.',
    [
      { error: 'Queda muy dura', solucion: 'No cortar el repollo bien fino. El repollo debe cortarse en tiras muy finas para que sea fácil de comer.' },
      { error: 'Sabe muy fuerte', solucion: 'No condimentar con suficiente limón o vinagre. El ácido suaviza el sabor del repollo.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Se consume fría.' }
  ),

  /* 156. Tomate relleno */
  r('Tomate relleno', 'ensaladas',
    ['tomate', 'relleno', 'atún', 'once', 'fresco', 'clásico'],
    null, '20 min', '4 personas', 'muy fácil', 'Sin cocción',
    [
      '4 tomates grandes maduros pero firmes',
      '1 tarro de atún (180 g) o 1 taza de pollo cocido desmenuzado',
      '3 cucharadas de mayonesa',
      '1 cucharadita de mostaza (opcional)',
      '1 cucharada de cebolla picada muy fina',
      '1 cucharada de perejil picado',
      'Sal y pimienta',
    ],
    [
      'Lava los tomates y córtales la tapa (la parte de arriba). Reserva las tapas.',
      'Con una cuchara, vacía ligeramente los tomates, sacando las semillas y un poco de pulpa. Reserva la pulpa.',
      'Mezcla el atún (o pollo) con la mayonesa, la mostaza, la cebolla, el perejil, sal y pimienta. Agrega un poco de la pulpa del tomate picada.',
      'Rellena los tomates con la mezcla.',
      'Tapa con las tapas reservadas y refrigera 15 minutos antes de servir.',
    ],
    'El tomate relleno es un clásico de la once y de las entradas chilenas. Se rellena con atún, pollo o carne, mezclado con mayonesa. Es fresco, rápido y rico. Se sirve frío, como entrada o acompañamiento.',
    [
      { error: 'Queda aguado', solucion: 'No vaciar bien los tomates o no escurrir el atún. Vacía bien los tomates y escurre el atún antes de mezclar.' },
      { error: 'Se desarma', solucion: 'Usar tomates muy maduros. Usa tomates firmes para que sostengan el relleno.' },
    ],
    { refrigerador: 'Hasta 1 día en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Se consume frío.' }
  ),

  /* 157. Palta reina */
  r('Palta reina', 'ensaladas',
    ['palta', 'relleno', 'pollo', 'mayonesa', 'entrada', 'clásico'],
    null, '15 min', '4 personas', 'muy fácil', 'Sin cocción',
    [
      '2 paltas Hass maduras',
      '1 taza de pollo cocido desmenuzado (o atún)',
      '3 cucharadas de mayonesa',
      '1 cucharadita de mostaza (opcional)',
      '1 cucharada de cebolla picada muy fina',
      'Sal y pimienta',
      'Jugo de limón',
    ],
    [
      'Corta las paltas por la mitad y retira el carozo. Rocía con jugo de limón para que no se oxiden.',
      'Mezcla el pollo (o atún) con la mayonesa, la mostaza, la cebolla, sal y pimienta.',
      'Rellena las mitades de palta con la mezcla.',
      'Sirve frío como entrada o acompañamiento.',
    ],
    'La palta reina es un clásico de la cocina chilena. Se hace con palta rellena de pollo o atún mezclado con mayonesa. Se sirve como entrada en las casas y restaurantes. Es fresca, cremosa y muy rica.',
    [
      { error: 'Palta negra', solucion: 'No rociarla con limón. El limón evita que la palta se oxide y se ponga negra.' },
      { error: 'Relleno se sale', solucion: 'No hacer un hueco más grande en la palta. Saca un poco de pulpa para hacer espacio, pero no demasiado.' },
    ],
    { refrigerador: 'Hasta 1 día en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'Se consume fría.' }
  ),

  /* 158. Quesadillas */
  r('Quesadillas', 'once',
    ['once', 'quesadilla', 'queso', 'pan', 'simple', 'tradicional'],
    null, '15 min', '4 personas', 'muy fácil', 'Sartén',
    [
      '8 rebanadas de pan de molde (o 4 panes amasados pequeños)',
      '200 g de queso mantecoso o chanco en láminas',
      '2 cucharadas de mantequilla',
    ],
    [
      'Si usas pan de molde, corta los bordes. Si usas pan amasado, córtalo por la mitad.',
      'Pon una lámina de queso entre dos rebanadas de pan.',
      'Unta la sartén con mantequilla y calienta a fuego medio.',
      'Dora las quesadillas 2-3 minutos por lado, hasta que el pan esté dorado y el queso derretido.',
      'Sirve calientes, cortadas en triángulos.',
    ],
    'Las quesadillas son un clásico de la once chilena. Se hacen con pan de molde o pan amasado y queso. Son rápidas, ricas y gustan a todos. Se pueden hacer en sartén o en sandwichera.',
    [
      { error: 'Queso no se derrite', solucion: 'Usar queso frío o fuego muy alto. Usa queso a temperatura ambiente y cocina a fuego medio para que se derrita sin quemarse.' },
      { error: 'Pan se quema', solucion: 'Fuego muy alto. Cocina a fuego medio y revisa constantemente.' },
    ],
    { refrigerador: 'No se guardan armadas.', congelador: 'No aplica.', recalentar: 'Sartén a fuego medio 1 minuto por lado.' }
  ),

  /* 159. Pan con queso */
  r('Pan con queso', 'once',
    ['once', 'pan', 'queso', 'desayuno', 'simple', 'tradicional'],
    null, '5 min', '1 persona', 'muy fácil', 'Sin cocción',
    [
      '1 marraqueta o hallulla recién horneada',
      '2 láminas de queso mantecoso o chanco',
      'Opcional: mantequilla',
    ],
    [
      'Abre el pan por la mitad.',
      'Si quieres, úntalo con un poco de mantequilla.',
      'Pon las láminas de queso dentro del pan.',
      'Si quieres el queso derretido, calienta el pan armado 1 minuto en el horno o sandwichera.',
      'Come inmediatamente.',
    ],
    'El pan con queso es la once más simple de Chile. Se come a cualquier hora y no necesita más que pan y queso. Si es pan recién horneado, mejor. Si el queso se derrite, es el paraíso.',
    [
      { error: 'Queso frío', solucion: 'No derretirlo. Si quieres el queso derretido, calienta el pan armado 1 minuto en el horno o sandwichera.' },
      { error: 'Pan frío', solucion: 'No calentar el pan. Un pan caliente es la mitad del placer.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'No aplica.' }
  ),

  /* 160. Pan con mermelada */
  r('Pan con mermelada', 'once',
    ['once', 'pan', 'mermelada', 'dulce', 'desayuno', 'simple'],
    null, '3 min', '1 persona', 'muy fácil', 'Sin cocción',
    [
      '1 marraqueta o hallulla recién horneada',
      '2 cucharadas de mermelada (de frutilla, damasco, membrillo o la que prefieras)',
      'Opcional: mantequilla',
    ],
    [
      'Abre el pan por la mitad.',
      'Si quieres, úntalo con un poco de mantequilla.',
      'Unta la mermelada generosamente.',
      'Come inmediatamente.',
    ],
    'El pan con mermelada es el desayuno y la once más simple de Chile. Se hace con mermelada casera o comprada. La mermelada de frutilla y la de membrillo son las favoritas. Se puede hacer con pan de molde o con marraqueta.',
    [
      { error: 'Mermelada se escurre', solucion: 'Poner demasiada. Con 2 cucharadas es suficiente.' },
      { error: 'Pan frío', solucion: 'No calentar el pan. Un pan caliente es la mitad del placer.' },
    ],
    { refrigerador: 'No se guarda armado.', congelador: 'No aplica.', recalentar: 'No aplica.' }
  ),

  /* 161. Huevos revueltos */
  r('Huevos revueltos', 'once',
    ['once', 'huevo', 'desayuno', 'simple', 'cotidiano'],
    null, '10 min', '2 personas', 'muy fácil', 'Sartén',
    [
      '4 huevos',
      '2 cucharadas de mantequilla',
      '2 cucharadas de leche',
      'Sal y pimienta',
      'Opcional: cebollín picado, queso rallado',
    ],
    [
      'Bate los huevos con la leche, sal y pimienta.',
      'Calienta la mantequilla en una sartén a fuego medio-bajo.',
      'Vierte los huevos y revuelve suavemente con una espátula.',
      'Cocina 2-3 minutos, hasta que estén cuajados pero aún cremosos. No los cocines de más.',
      'Sirve con pan tostado.',
    ],
    'Los huevos revueltos son el desayuno más rápido y rico de Chile. Se hacen con mantequilla, leche y sal. El secreto es cocinarlos a fuego bajo y no dejar que se sequen. Se pueden hacer con cebollín, queso o jamón.',
    [
      { error: 'Quedan secos', solucion: 'Cocinarlos demasiado o a fuego alto. Cocina a fuego medio-bajo y retira del fuego cuando aún estén cremosos.' },
      { error: 'Se pegan a la sartén', solucion: 'No usar suficiente mantequilla o sartén fría. Calienta bien la sartén y usa mantequilla.' },
    ],
    { refrigerador: 'No se guardan bien.', congelador: 'No recomendado.', recalentar: 'No recomendado.' }
  ),

  /* 162. Asado de tira al horno con vino */
  r('Asado de tira al horno con vino', 'principales',
    ['asado', 'tira', 'vacuno', 'horno', 'vino', 'domingo', 'plato principal'],
    null, '2 h', '4 personas', 'fácil', 'Horno',
    [
      '1,5 kg de asado de tira de vacuno',
      '2 cebollas en pluma',
      '2 zanahorias en rodajas',
      '4 dientes de ajo machacados',
      '1 taza de vino tinto',
      '1 taza de caldo de carne',
      '2 hojas de laurel',
      '1 cucharadita de orégano',
      '1 cucharadita de ají de color',
      'Sal, pimienta y aceite',
    ],
    [
      'Sazona el asado de tira con sal, pimienta, ajo, orégano y ají de color. Déjalo reposar 30 minutos.',
      'En una fuente para horno, pon la cebolla, la zanahoria y el laurel como cama. Encima coloca el asado.',
      'Vierte el vino tinto y el caldo. Cubre con papel aluminio.',
      'Hornea a 180 °C por 1 hora y 30 minutos, bañándolo con su jugo cada 30 minutos.',
      'Retira el aluminio y sube el horno a 200 °C por 15-20 minutos más, hasta que la superficie esté dorada.',
      'Deja reposar 10 minutos antes de cortar. Sirve con papas al horno o puré.',
    ],
    'El asado de tira al horno con vino es el plato de domingo chileno. El vino tinto y la cocción lenta lo dejan muy tierno. La clave es bañarlo con su jugo para que no se seque.',
    [
      { error: 'Carne seca', solucion: 'No bañarlo con su jugo o cocinarlo destapado todo el tiempo. Mantenlo cubierto la mayor parte de la cocción y baña cada 30 minutos.' },
      { error: 'Sabe muy fuerte a vino', solucion: 'No dejar evaporar el alcohol. Hornea cubierto para que el alcohol se evapore lentamente y quede solo el sabor.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético, en su jugo.', congelador: 'Hasta 2 meses.', recalentar: 'Horno a 160 °C por 15 minutos, cubierto con aluminio y bañado con su jugo.' }
  ),

  /* 163. Costillar de cerdo al horno */
  r('Costillar de cerdo al horno', 'principales',
    ['cerdo', 'costillar', 'horno', 'domingo', 'plato principal'],
    null, '2 h', '4 personas', 'fácil', 'Horno',
    [
      '1,5 kg de costillar de cerdo',
      '4 dientes de ajo machacados',
      '2 cucharadas de ají de color',
      '1 cucharada de orégano',
      '1 cucharada de sal gruesa',
      '1 cucharadita de pimienta negra',
      '½ taza de vinagre',
      '½ taza de agua',
      '2 cebollas en pluma',
    ],
    [
      'Mezcla el ajo, ají de color, orégano, sal y pimienta para hacer una pasta. Unta el costillar por todos lados.',
      'Pon el costillar en una fuente con las cebollas, el vinagre y el agua. Marina en frío al menos 4 horas (mejor toda la noche).',
      'Cubre con papel aluminio y hornea a 180 °C por 1 hora y 30 minutos.',
      'Retira el aluminio, sube a 200 °C y hornea 20-30 minutos más, hasta que la superficie esté dorada y crujiente.',
      'Deja reposar 10 minutos y corta en porciones. Sirve con papas o ensalada.',
    ],
    'El costillar de cerdo al horno es un clásico de las casas chilenas del sur, donde el cerdo es tradición. El vinagre y el ají de color le dan ese color y sabor característicos.',
    [
      { error: 'Queda seco', solucion: 'Cocinarlo destapado todo el tiempo o a fuego muy alto. La mayor parte de la cocción debe ser cubierto y a fuego medio.' },
      { error: 'Piel blanda', solucion: 'No subir la temperatura al final. Los últimos 20 minutos a 200 °C son los que dejan la piel crujiente.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'Horno a 180 °C por 10-15 minutos.' }
  ),

  /* 164. Chuletas de cerdo */
  r('Chuletas de cerdo', 'principales',
    ['cerdo', 'chuleta', 'sartén', 'plancha', 'plato principal', 'cotidiano'],
    null, '25 min', '4 personas', 'muy fácil', 'Sartén o plancha',
    [
      '4 chuletas de cerdo (lomo o centro) de 1,5 cm de grosor',
      '2 dientes de ajo machacados',
      '1 cucharadita de orégano',
      '1 cucharadita de ají de color',
      'Sal y pimienta',
      '2 cucharadas de aceite',
      'Opcional: jugo de ½ limón',
    ],
    [
      'Sazona las chuletas con ajo, orégano, ají de color, sal y pimienta. Déjalas reposar 15 minutos.',
      'Calienta el aceite en una sartén o plancha a fuego medio-alto.',
      'Cocina las chuletas 3-4 minutos por lado, hasta que estén doradas y cocidas por dentro.',
      'Si quieres, rocía con jugo de limón al final.',
      'Deja reposar 3 minutos antes de servir. Acompaña con papas o ensalada.',
    ],
    'Las chuletas de cerdo son el plato de día de semana chileno. Se hacen a la plancha o sartén en menos de 25 minutos. El ají de color y el orégano les dan el sabor de casa.',
    [
      { error: 'Quedan secas', solucion: 'Cocinarlas demasiado. La chuleta de cerdo se hace en 3-4 minutos por lado. Si la dejas más, se seca.' },
      { error: 'Quedan crudas por dentro', solucion: 'Fuego muy alto. Cocina a fuego medio para que se cocinen parejo sin quemarse por fuera.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, pierden jugosidad.', recalentar: 'Sartén a fuego medio 1 minuto por lado.' }
  ),

  /* 165. Pavo navideño */
  r('Pavo navideño', 'principales',
    ['pavo', 'navidad', 'horno', 'fiesta', 'tradicional'],
    null, '4 h + marinado', '10 a 12 personas', 'alta', 'Horno',
    [
      '1 pavo entero de 5 a 6 kg',
      '1 taza de mantequilla a temperatura ambiente',
      '4 dientes de ajo machacados',
      '2 cucharadas de orégano',
      '1 cucharada de tomillo',
      '1 cucharada de romero',
      'Sal y pimienta',
      '2 cebollas en cuartos',
      '2 zanahorias en trozos',
      '1 taza de vino blanco',
      '1 taza de caldo de pollo',
    ],
    [
      'Mezcla la mantequilla con el ajo, orégano, tomillo y romero. Unta el pavo por dentro y por fuera, y sazona con sal y pimienta.',
      'Marina en frío al menos 12 horas (mejor 24), cubierto con papel plástico.',
      'Precalienta el horno a 180 °C. Rellena la cavidad del pavo con la cebolla y la zanahoria.',
      'Pon el pavo en una fuente para horno y vierte el vino y el caldo. Cubre con papel aluminio.',
      'Hornea 2 horas cubierto, bañándolo cada 30 minutos con su jugo.',
      'Retira el aluminio y hornea 1 hora más a 180 °C, hasta que la piel esté dorada y crujiente. El pavo está listo cuando el jugo sale claro al pinchar la parte más gruesa.',
      'Deja reposar 20 minutos antes de cortar. Sirve con su jugo y las verduras asadas.',
    ],
    'El pavo navideño es el plato central de la Navidad chilena. La mantequilla con hierbas y el marinado largo son la clave para que quede jugoso. En Chile se suele servir con papas duquesas, ensalada a la chilena y pan de Pascua de postre.',
    [
      { error: 'Queda seco', solucion: 'Cocinarlo destapado todo el tiempo o no bañarlo. Mantenlo cubierto la mayor parte de la cocción y baña cada 30 minutos.' },
      { error: 'Queda crudo por dentro', solucion: 'Horno muy caliente o pavo muy grande. Cocina a 180 °C, no más, y verifica con un termómetro: la pechuga debe llegar a 75 °C.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético, en su jugo.', congelador: 'Hasta 3 meses en porciones.', recalentar: 'Horno a 160 °C por 20 minutos, cubierto con aluminio y bañado con su jugo.' }
  ),

  /* 166. Chunchules */
  r('Chunchules', 'principales',
    ['chunchules', 'tripas', 'popular', 'fritura', 'tradicional', 'invierno'],
    null, '2 h', '4 personas', 'media', 'Olla y fritura',
    [
      '1 kg de chunchules (tripas delgadas de vacuno)',
      '1 cebolla en cuartos',
      '2 dientes de ajo',
      '1 hoja de laurel',
      '1 cucharada de vinagre',
      'Sal',
      'Aceite para freír',
      'Pebre para acompañar',
    ],
    [
      'Lava muy bien los chunchules con agua fría y limón varias veces. Este paso es clave para quitarles el olor fuerte.',
      'En una olla, pon los chunchules con la cebolla, el ajo, el laurel, el vinagre y sal. Cubre con agua y cocina 1 hora y 30 minutos a fuego medio, hasta que estén tiernos.',
      'Escurre y corta en trozos de 5 cm. Sécalos bien con papel absorbente.',
      'Fríe en abundante aceite caliente hasta que estén dorados y crujientes. Escurre sobre papel absorbente.',
      'Sala al gusto y sirve calientes con pebre y pan amasado.',
    ],
    'Los chunchules son un plato popular chileno, típico de invierno y de fondas. Son las tripas delgadas del vacuno, que se cuecen hasta ablandarse y luego se fríen. Se comen con pebre y pan. En el campo se preparan en las fiestas y después de las faenas.',
    [
      { error: 'Quedan duros como caucho', solucion: 'No cocerlos el tiempo suficiente. Los chunchules necesitan al menos 1 hora y media de cocción para ablandarse. Si están duros, sigue cocinando.' },
      { error: 'Saben muy fuerte', solucion: 'No lavarlos bien. Lávalos varias veces con agua y limón hasta que el agua salga clara. El vinagre en la cocción también ayuda a quitarles el olor.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético, ya cocidos.', congelador: 'Hasta 2 meses, ya cocidos y sin freír.', recalentar: 'Sartén a fuego alto 2-3 minutos para que recuperen la textura crujiente.' }
  ),

  /* 167. Picante de guatitas */
  r('Picante de guatitas', 'principales',
    ['guatitas', 'picante', 'popular', 'olla', 'tradicional', 'invierno'],
    null, '2 h', '4 personas', 'media', 'Olla',
    [
      '1 kg de guatitas de vacuno (mondongo)',
      '2 cebollas grandes picadas finas',
      '4 dientes de ajo picados',
      '2 zanahorias en cubos',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '2 cucharadas de ají de color',
      '1 cucharadita de merkén o ají picante',
      '1 cucharadita de orégano',
      '1 hoja de laurel',
      '2 papas en cubos',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Lava muy bien las guatitas con agua fría y limón varias veces, hasta que el agua salga clara.',
      'Cocínalas en agua hirviendo con laurel y un chorrito de vinagre por 1 hora y media, hasta que estén tiernas. Escurre y corta en tiras.',
      'En otra olla, sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén tiernos.',
      'Agrega el tomate, el ají de color, el merkén y el orégano. Cocina 5 minutos.',
      'Incorpora las guatitas y las papas. Cubre con agua o caldo y cocina a fuego lento 30 minutos más.',
      'Condimenta con sal y pimienta. Sirve caliente con arroz o pan.',
    ],
    'El picante de guatitas es la versión con ají picante de las guatitas. Es un plato popular chileno, típico de fondas y de casas de antaño. El merkén le da el toque ahumado y picante que lo caracteriza.',
    [
      { error: 'Olor fuerte', solucion: 'No lavar bien las guatitas. Lávalas varias veces con agua y limón, y cambia el agua de cocción 2-3 veces.' },
      { error: 'Quedan duras', solucion: 'Cocerlas poco tiempo. Las guatitas necesitan al menos 1 hora y media a fuego medio para ablandarse.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua o caldo.' }
  ),

  /* 168. Guatitas a la jardinera */
  r('Guatitas a la jardinera', 'principales',
    ['guatitas', 'jardinera', 'verduras', 'olla', 'tradicional', 'invierno'],
    null, '2 h', '4 personas', 'media', 'Olla',
    [
      '1 kg de guatitas de vacuno (mondongo)',
      '2 cebollas grandes picadas finas',
      '4 dientes de ajo picados',
      '2 zanahorias en cubos',
      '1 taza de arvejas',
      '1 taza de choclo desgranado',
      '1 pimentón rojo en cubos',
      '2 tomates maduros picados',
      '1 cucharadita de ají de color',
      '1 cucharadita de orégano',
      '1 hoja de laurel',
      'Agua o caldo para cubrir',
      'Sal, pimienta y aceite',
    ],
    [
      'Lava muy bien las guatitas con agua fría y limón varias veces, hasta que el agua salga clara.',
      'Cocínalas en agua hirviendo con laurel y un chorrito de vinagre por 1 hora y media, hasta que estén tiernas. Escurre y corta en tiras.',
      'En otra olla, sofríe la cebolla, el ajo, la zanahoria y el pimentón hasta que estén tiernos.',
      'Agrega el tomate, el ají de color y el orégano. Cocina 5 minutos.',
      'Incorpora las guatitas, las arvejas y el choclo. Cubre con agua o caldo y cocina a fuego lento 30 minutos.',
      'Condimenta con sal y pimienta. Sirve caliente con arroz o papas.',
    ],
    'Las guatitas a la jardinera son la versión con verduras de las guatitas. Se llaman "a la jardinera" por la mezcla de verduras: arvejas, choclo, zanahoria y pimentón. Es un plato de invierno muy completo y rendidor.',
    [
      { error: 'Olor fuerte', solucion: 'No lavar bien las guatitas. Lávalas varias veces con agua y limón hasta que el agua salga clara.' },
      { error: 'Verduras deshechas', solucion: 'Agregar todas las verduras al principio. Agrega las arvejas y el choclo al final para que mantengan su textura.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'A fuego lento con un poco de agua o caldo.' }
  ),

  /* 169. Pollo rebozado estilo KFC */
  r('Pollo rebozado estilo KFC', 'principales',
    ['pollo', 'rebozado', 'fritura', 'crujiente', 'estilo kfc', 'plato principal'],
    null, '40 min + marinado', '4 personas', 'media', 'Fritura',
    [
      '8 presas de pollo (muslos, trutros o alitas)',
      '2 tazas de harina',
      '1 cucharada de sal',
      '1 cucharadita de pimienta negra',
      '1 cucharadita de páprika',
      '1 cucharadita de ajo en polvo',
      '1 cucharadita de cebolla en polvo',
      '1 cucharadita de orégano seco',
      '1 cucharadita de polvos de hornear',
      '2 huevos',
      '1 taza de leche',
      'Aceite para freír',
    ],
    [
      'Marina el pollo en la leche con sal y pimienta por al menos 2 horas en el refrigerador.',
      'Mezcla la harina con la sal, pimienta, páprika, ajo en polvo, cebolla en polvo, orégano y polvos de hornear.',
      'Pasa cada presa de pollo por la mezcla de harina, luego por huevo batido y de nuevo por la harina, apretando bien para que se pegue.',
      'Calienta abundante aceite a 170 °C (fuego medio).',
      'Fríe las presas 15-20 minutos, dando vuelta, hasta que estén doradas y cocidas por dentro.',
      'Escurre sobre papel absorbente y sirve calientes.',
    ],
    'El pollo rebozado estilo KFC es el favorito de los niños chilenos. La clave está en el doble empanizado (harina, huevo, harina) y en el aceite a temperatura media para que se cocine por dentro sin quemarse. Los polvos de hornear en la harina lo dejan más crujiente.',
    [
      { error: 'Queda crudo por dentro', solucion: 'Aceite muy caliente o presas muy gruesas. Fríe a 170 °C y pincha la parte más gruesa para verificar.' },
      { error: 'El rebozado se cae', solucion: 'No apretar bien la harina o el pollo muy húmedo. Pasa el pollo por harina, huevo y harina de nuevo, apretando bien cada capa.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado, el rebozado pierde textura.', recalentar: 'Horno o freidora de aire a 180 °C por 8-10 minutos.' }
  ),

  /* 170. Queque de plátano */
  r('Queque de plátano', 'dulces',
    ['queque', 'plátano', 'horno', 'once', 'dulce', 'reposteria'],
    null, '1 h', '10 porciones', 'fácil', 'Horno',
    [
      '3 plátanos maduros',
      '2 huevos',
      '150 g de azúcar',
      '100 g de mantequilla derretida',
      '200 g de harina',
      '1 cucharadita de polvos de hornear',
      '1 cucharadita de bicarbonato',
      '1 pizca de sal',
      '1 cucharadita de vainilla',
      '½ taza de nueces picadas (opcional)',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa un molde de queque.',
      'Pisa los plátanos con un tenedor hasta hacer un puré.',
      'Bate los huevos con el azúcar hasta que estén espumosos. Agrega la mantequilla derretida y la vainilla.',
      'Incorpora el puré de plátano.',
      'Añade la harina cernida con los polvos de hornear, el bicarbonato y la sal. Mezcla con movimientos envolventes.',
      'Si usas nueces, incorpóralas ahora. Vierte en el molde.',
      'Hornea 45-50 minutos, hasta que un palillo salga limpio.',
    ],
    'El queque de plátano es el queque de once chileno por excelencia. Se hace con plátanos muy maduros (mientras más negros, más dulce). Es húmedo y aromático, y se conserva bien por varios días.',
    [
      { error: 'Queda seco', solucion: 'Usar plátanos poco maduros o hornear de más. Los plátanos deben estar muy maduros y el queque no debe hornearse más de 50 minutos.' },
      { error: 'No sube', solucion: 'Batir de menos los huevos o mezclar de más la harina. Bate bien los huevos y mezcla la harina con movimientos suaves.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 2 meses, en porciones.', recalentar: 'A temperatura ambiente o tibio en microondas 15 segundos.' }
  ),

  /* 171. Queque de zanahoria */
  r('Queque de zanahoria', 'dulces',
    ['queque', 'zanahoria', 'horno', 'once', 'dulce', 'reposteria'],
    null, '1 h', '10 porciones', 'fácil', 'Horno',
    [
      '3 zanahorias medianas ralladas',
      '3 huevos',
      '200 g de azúcar',
      '150 ml de aceite',
      '200 g de harina',
      '1 cucharadita de polvos de hornear',
      '1 cucharadita de bicarbonato',
      '1 cucharadita de canela',
      '1 pizca de sal',
      '½ taza de nueces picadas (opcional)',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa un molde de queque.',
      'Bate los huevos con el azúcar hasta que estén espumosos. Agrega el aceite y mezcla.',
      'Incorpora la zanahoria rallada.',
      'Añade la harina cernida con los polvos de hornear, el bicarbonato, la canela y la sal. Mezcla con movimientos envolventes.',
      'Si usas nueces, incorpóralas. Vierte en el molde.',
      'Hornea 45-50 minutos, hasta que un palillo salga limpio.',
    ],
    'El queque de zanahoria es el queque de once chileno más querido después del de plátano. Es húmedo, especiado con canela y muy fácil de hacer. Se puede cubrir con un glaseado de queso crema para una versión más elegante.',
    [
      { error: 'Queda seco', solucion: 'Hornear de más o no usar suficiente aceite. El aceite es clave para la humedad del queque de zanahoria.' },
      { error: 'Sabe a harina', solucion: 'No mezclar bien la harina o usar poca canela. La canela y la zanahoria son las protagonistas del sabor.' },
    ],
    { refrigerador: 'Hasta 4 días en recipiente hermético.', congelador: 'Hasta 2 meses, en porciones.', recalentar: 'A temperatura ambiente o tibio en microondas 15 segundos.' }
  ),

  /* 172. Kuchen */
  r('Kuchen', 'dulces',
    ['kuchen', 'torta', 'horno', 'alemán', 'sur', 'once', 'reposteria'],
    null, '1 h 15 min', '12 porciones', 'media', 'Horno',
    [
      'Masa: 300 g de harina',
      'Masa: 150 g de mantequilla fría',
      'Masa: 100 g de azúcar',
      'Masa: 1 huevo',
      'Masa: 1 cucharadita de polvos de hornear',
      'Relleno: 1 kg de frutas (manzanas, ciruelas, duraznos o frutillas)',
      'Relleno: 3 cucharadas de azúcar',
      'Relleno: 1 cucharadita de canela',
      'Cubierta: 2 cucharadas de azúcar flor',
    ],
    [
      'Precalienta el horno a 180 °C. Engrasa un molde redondo.',
      'Prepara la masa: mezcla la harina con los polvos de hornear y el azúcar. Agrega la mantequilla fría en cubos y trabaja con los dedos hasta que quede como arena. Añade el huevo y amasa hasta formar una masa lisa. Refrigera 30 minutos.',
      'Estira la masa y forra el molde. Pincha con un tenedor.',
      'Pela y corta las frutas. Mezcla con el azúcar y la canela.',
      'Distribuye las frutas sobre la masa.',
      'Hornea 45-50 minutos, hasta que la masa esté dorada y las frutas tiernas.',
      'Deja enfriar y espolvorea azúcar flor antes de servir.',
    ],
    'El kuchen es la herencia alemana en la repostería chilena, especialmente en el sur (Valdivia, Osorno, Puerto Montt). Se hace con masa quebrada y frutas de la estación. El kuchen de manzana es el más clásico, pero también se hace de ciruela, durazno y frutilla.',
    [
      { error: 'Masa dura', solucion: 'Amasar demasiado o usar mantequilla caliente. La mantequilla debe estar fría y la masa no debe amasarse mucho.' },
      { error: 'Frutas sueltan mucho jugo', solucion: 'No escurrirlas o usar frutas muy maduras. Escurre bien las frutas y si es necesario espolvorea un poco de harina o maicena sobre la masa antes de ponerlas.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'Hasta 2 meses.', recalentar: 'Horno a 180 °C por 5-8 minutos.' }
  ),

  /* 173. Torta de milhojas */
  r('Torta de milhojas', 'dulces',
    ['torta', 'milhojas', 'manjar', 'reposteria', 'cumpleaños', 'dulce'],
    null, '1 h 30 min', '12 porciones', 'alta', 'Horno',
    [
      '500 g de harina',
      '250 g de mantequilla fría',
      '100 ml de agua fría',
      '1 pizca de sal',
      '1 huevo para pintar',
      '500 g de manjar',
      'Azúcar flor para espolvorear',
    ],
    [
      'Mezcla la harina con la sal. Agrega la mantequilla fría en cubos y trabaja con los dedos hasta que quede como arena. Añade el agua fría y amasa hasta formar una masa lisa. Refrigera 1 hora.',
      'Estira la masa muy fina y corta discos del tamaño del molde. Necesitas 6 discos.',
      'Pincha cada disco con un tenedor y hornea a 180 °C por 10-12 minutos, hasta que estén dorados. Deja enfriar.',
      'Arma la torta: disco, capa de manjar, disco, capa de manjar, hasta terminar con un disco.',
      'Espolvorea azúcar flor generosamente por encima.',
      'Refrigera al menos 2 horas antes de cortar.',
    ],
    'La torta de milhojas es la torta de cumpleaños y de celebraciones chilenas por excelencia. Se hace con masa de hojaldre y manjar. La clave está en estirar la masa muy fina y hornear los discos hasta que estén bien dorados y crujientes.',
    [
      { error: 'Masa blanda o elástica', solucion: 'Amasar demasiado o usar mantequilla caliente. La mantequilla debe estar fría y la masa no debe amasarse mucho.' },
      { error: 'Se desarma al cortar', solucion: 'No dejar reposar la torta en frío. Refrigera al menos 2 horas antes de cortar para que el manjar se asiente.' },
    ],
    { refrigerador: 'Hasta 3 días en recipiente hermético.', congelador: 'No recomendado, el manjar se estropea.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 174. Berlines */
  r('Berlines', 'dulces',
    ['berlines', 'fritura', 'dulce', 'once', 'merienda', 'reposteria'],
    null, '1 h 30 min + levado', '12 unidades', 'media', 'Fritura',
    [
      '500 g de harina',
      '10 g de levadura granulada',
      '150 ml de leche tibia',
      '80 g de azúcar',
      '2 huevos',
      '100 g de mantequilla a temperatura ambiente',
      '1 pizca de sal',
      'Aceite para freír',
      'Manjar o mermelada para rellenar',
      'Azúcar granulada para espolvorear',
    ],
    [
      'Activa la levadura en la leche tibia con una cucharadita de azúcar. Reposa 10 minutos.',
      'Mezcla la harina con el azúcar y la sal. Agrega los huevos, la mantequilla y la levadura. Amasa hasta obtener una masa suave.',
      'Deja levar tapada 1 hora, hasta que doble su volumen.',
      'Forma bolitas de unos 60 g y colócalas en una bandeja enharinada. Deja levar 30 minutos más.',
      'Fríe en abundante aceite a 170 °C, 2-3 minutos por lado, hasta que estén doradas.',
      'Escurre sobre papel absorbente. Cuando estén tibias, rellena con manjar o mermelada con una manga o jeringa.',
      'Pasa por azúcar granulada y sirve.',
    ],
    'Los berlines son el dulce frito favorito de la once chilena. Se hacen con masa de levadura, se fríen y se rellenan con manjar. Son primos de los donuts, pero más esponjosos. En Chile se venden en las panaderías y se comen en la once o en las celebraciones.',
    [
      { error: 'Quedan duros', solucion: 'Amasar de menos o no dejar levar lo suficiente. La masa necesita levar 1 hora + 30 minutos para quedar esponjosa.' },
      { error: 'Quedan aceitosos', solucion: 'El aceite no está caliente. Fríe a 170 °C para que se cocinen por dentro sin absorber aceite.' },
    ],
    { refrigerador: 'A temperatura ambiente 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, sin rellenar.', recalentar: 'Horno o freidora de aire a 180 °C por 5 minutos.' }
  ),

  /* 175. Picarones */
  r('Picarones', 'dulces',
    ['picarones', 'fritura', 'dulce', 'chancaca', 'once', 'tradicional'],
    null, '1 h', '20 unidades', 'media', 'Fritura',
    [
      '500 g de zapallo cocido y molido',
      '250 g de harina',
      '1 cucharadita de levadura',
      '1 cucharadita de anís',
      '1 pizca de sal',
      'Aceite para freír',
      'Chancaca: 250 g de chancaca',
      'Chancaca: ½ taza de agua',
      'Chancaca: 1 rama de canela',
      'Chancaca: Cáscara de 1 naranja',
    ],
    [
      'Mezcla el zapallo molido con la harina, la levadura, el anís y la sal. Amasa hasta obtener una masa suave y pegajosa.',
      'Deja reposar 30 minutos tapada.',
      'Calienta abundante aceite a 170 °C.',
      'Con las manos húmedas, toma porciones de masa y forma anillos. Fríe hasta que estén dorados por ambos lados.',
      'Escurre sobre papel absorbente.',
      'Para el almíbar, hierve la chancaca con el agua, la canela y la cáscara de naranja hasta que espese.',
      'Baña los picarones con el almíbar caliente y sirve.',
    ],
    'Los picarones son de origen peruano, pero en Chile se volvieron parte de la once y de las fondas. Se hacen con zapallo y se bañan en chancaca. Son primos de las sopaipillas pasadas, pero con forma de anillo y masa más liviana.',
    [
      { error: 'Quedan duros', solucion: 'Masa muy seca o aceite muy caliente. La masa debe quedar pegajosa y el aceite a 170 °C.' },
      { error: 'No toman forma', solucion: 'Masa muy líquida o no dejar reposar. Deja reposar 30 minutos y agrega harina si es necesario.' },
    ],
    { refrigerador: 'A temperatura ambiente 1 día. Se recomienda consumir al momento.', congelador: 'No recomendado.', recalentar: 'Horno o freidora de aire a 180 °C por 5 minutos, y bañar con almíbar caliente.' }
  ),

  /* 176. Churros */
  r('Churros', 'dulces',
    ['churros', 'fritura', 'dulce', 'once', 'merienda', 'reposteria'],
    null, '30 min', '15 churros', 'fácil', 'Fritura',
    [
      '250 ml de agua',
      '150 g de harina',
      '1 cucharada de azúcar',
      '1 pizca de sal',
      '1 cucharadita de polvos de hornear',
      'Aceite para freír',
      'Azúcar granulada y canela para espolvorear',
      'Opcional: manjar o chocolate para rellenar',
    ],
    [
      'Hierve el agua con el azúcar y la sal. Retira del fuego y agrega la harina de golpe. Revuelve hasta formar una masa espesa.',
      'Agrega los polvos de hornear y mezcla.',
      'Pon la masa en una manga pastelera con boquilla de estrella.',
      'Calienta abundante aceite a 180 °C.',
      'Forma churros de 10 cm directamente en el aceite caliente. Fríe hasta que estén dorados por ambos lados.',
      'Escurre sobre papel absorbente. Pasa por azúcar con canela y sirve calientes.',
    ],
    'Los churros son el dulce frito de las tardes chilenas, sobre todo en invierno y en las ferias. Se hacen con masa de agua y harina, y se espolvorean con azúcar y canela. Si quieres, se pueden rellenar con manjar o chocolate.',
    [
      { error: 'Quedan duros', solucion: 'Masa muy seca o aceite muy caliente. La masa debe quedar espesa pero maleable, y el aceite a 180 °C.' },
      { error: 'Se deshacen en el aceite', solucion: 'Masa muy líquida. Agrega un poco más de harina hasta que la masa sostenga la forma.' },
    ],
    { refrigerador: 'No se recomienda, se ablandan.', congelador: 'No recomendado.', recalentar: 'Horno o freidora de aire a 180 °C por 3-5 minutos.' }
  ),

  /* 177. Dulce de membrillo */
  r('Dulce de membrillo', 'dulces',
    ['dulce', 'membrillo', 'conserva', 'once', 'tradicional'],
    null, '1 h 30 min', '4 frascos', 'fácil', 'Olla',
    [
      '1 kg de membrillos',
      '800 g de azúcar',
      'Jugo de 1 limón',
      '1 rama de canela (opcional)',
    ],
    [
      'Lava los membrillos, córtalos en cuartos y retira las semillas y el corazón.',
      'Cocínalos en agua hirviendo 30-40 minutos, hasta que estén tiernos. Escurre y pásalos por un colador o procesador hasta obtener un puré.',
      'En una olla, mezcla el puré con el azúcar y el jugo de limón.',
      'Cocina a fuego medio-bajo, revolviendo constantemente, por 40-50 minutos, hasta que el dulce espese y tome color.',
      'Envasa en frascos esterilizados calientes y tapa. Deja enfriar y refrigera.',
    ],
    'El dulce de membrillo es un clásico de la once chilena. Se come con pan, con queso o solo. El membrillo es una fruta dura y ácida que se vuelve dulce y rosada al cocinarse con azúcar. En Chile se hace en las casas y se guarda en frascos para todo el año.',
    [
      { error: 'Queda muy líquido', solucion: 'No cocinar el tiempo suficiente. El dulce debe espesar y despegarse del fondo de la olla. Cocina a fuego medio-bajo y revuelve constantemente.' },
      { error: 'Sabe amargo', solucion: 'No retirar bien las semillas. Las semillas del membrillo son amargas. Retíralas todas antes de cocinar.' },
    ],
    { refrigerador: 'Hasta 1 mes en frasco esterilizado cerrado.', congelador: 'Hasta 6 meses.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 178. Mermelada casera */
  r('Mermelada casera', 'dulces',
    ['mermelada', 'conserva', 'fruta', 'once', 'desayuno', 'tradicional'],
    null, '1 h', '4 frascos', 'fácil', 'Olla',
    [
      '1 kg de fruta (frutilla, damasco, ciruela, durazno o la que prefieras)',
      '700 g de azúcar',
      'Jugo de 1 limón',
      '1 rama de canela (opcional)',
    ],
    [
      'Lava y pela la fruta. Córtala en trozos.',
      'En una olla, mezcla la fruta con el azúcar y el jugo de limón. Deja reposar 30 minutos para que la fruta suelte su jugo.',
      'Cocina a fuego medio-bajo, revolviendo de vez en cuando, por 40-50 minutos, hasta que la mermelada espese.',
      'Si usas canela, agrégala en los últimos 10 minutos.',
      'Envasa en frascos esterilizados calientes y tapa. Deja enfriar y refrigera.',
    ],
    'La mermelada casera es un clásico de la once chilena. Se hace con la fruta de la estación y se guarda en frascos para todo el año. La frutilla y el damasco son las favoritas. El limón ayuda a que la mermelada cuaje y le da un toque ácido.',
    [
      { error: 'Queda muy líquida', solucion: 'No cocinar el tiempo suficiente o usar fruta muy madura. Cocina hasta que la mermelada espese y se despegue del fondo de la olla.' },
      { error: 'Se fermenta o se echa a perder', solucion: 'No esterilizar los frascos. Lava bien los frascos con agua caliente y sécalos en el horno antes de usarlos.' },
    ],
    { refrigerador: 'Hasta 1 mes en frasco esterilizado cerrado. Una vez abierta, consumir en 2 semanas.', congelador: 'Hasta 6 meses.', recalentar: 'A temperatura ambiente.' }
  ),

  /* 179. Waffles */
  r('Waffles', 'dulces',
    ['waffles', 'desayuno', 'once', 'dulce', 'reposteria', 'simple'],
    null, '25 min', '6 waffles', 'fácil', 'Waflera',
    [
      '2 huevos',
      '1 taza de leche',
      '1 taza de harina',
      '2 cucharadas de azúcar',
      '1 cucharadita de polvos de hornear',
      '1 pizca de sal',
      '50 g de mantequilla derretida',
      '1 cucharadita de vainilla',
    ],
    [
      'Bate los huevos con el azúcar y la vainilla.',
      'Agrega la leche y la mantequilla derretida.',
      'Incorpora la harina cernida con los polvos de hornear y la sal. Mezcla hasta obtener una masa lisa.',
      'Calienta la waflera y engrásala ligeramente.',
      'Vierte la masa y cocina según las instrucciones de tu waflera (3-5 minutos), hasta que estén dorados y crujientes.',
      'Sirve calientes con manjar, mermelada, frutas o miel.',
    ],
    'Los waffles son el desayuno de fin de semana chileno. Se hacen en waflera y se sirven con manjar, mermelada o frutas. Son crujientes por fuera y suaves por dentro. Si no tienes waflera, puedes hacerlos en sartén como panqueques.',
    [
      { error: 'Quedan blandos', solucion: 'No precalentar bien la waflera o usar poca grasa. Precalienta la waflera y engrásala ligeramente.' },
      { error: 'Se pegan a la waflera', solucion: 'No engrasar o masa muy líquida. Engrasa la waflera y verifica que la masa tenga la consistencia correcta.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'Hasta 2 meses, separados con papel.', recalentar: 'Tostador o horno a 180 °C por 3 minutos.' }
  ),

  /* 180. Café con leche */
  r('Café con leche', 'bebidas',
    ['bebida', 'café', 'desayuno', 'once', 'simple', 'caliente'],
    null, '5 min', '1 taza', 'muy fácil', 'Hervidor',
    [
      '1 cucharadita de café soluble (o 1 taza de café pasado)',
      '150 ml de agua hirviendo',
      '100 ml de leche entera',
      'Azúcar al gusto',
    ],
    [
      'Calienta la leche en una ollita o en el microondas. No debe hervir, solo calentarse hasta que salga vapor.',
      'Disuelve el café soluble en el agua hirviendo. Si usas café pasado, ya estará listo.',
      'Vierte el café en la taza y agrega la leche caliente.',
      'Endulza al gusto y revuelve. Sirve inmediatamente.',
    ],
    'El café con leche es la bebida de la once chilena, junto con el té. La proporción varía: hay quienes lo toman "cortado" (más leche que café) y quienes lo toman "cargado" (más café). En Chile se usa mucho el café soluble, pero el café pasado es otra historia.',
    [
      { error: 'Leche hervida', solucion: 'Hervir la leche le cambia el sabor. Caliéntala hasta que salga vapor, sin llegar a hervir.' },
      { error: 'Café frío', solucion: 'No calentar la taza. Calienta la taza con agua hirviendo antes de servir.' },
    ],
    { refrigerador: 'Se consume al momento.', congelador: 'No aplica.', recalentar: 'No recomendado.' }
  ),

  /* 181. Leche con plátano */
  r('Leche con plátano', 'bebidas',
    ['bebida', 'leche', 'plátano', 'desayuno', 'once', 'fruta'],
    null, '5 min', '2 vasos', 'muy fácil', 'Juguera',
    [
      '2 tazas de leche fría',
      '1 plátano maduro',
      '1 cucharada de azúcar (opcional)',
      '1 pizca de canela (opcional)',
      'Hielo (opcional)',
    ],
    [
      'Pela el plátano y córtalo en trozos.',
      'Licúa la leche con el plátano, el azúcar y la canela hasta obtener una mezcla homogénea.',
      'Si quieres, agrega hielo y licúa de nuevo.',
      'Sirve inmediatamente en vasos altos.',
    ],
    'La leche con plátano es el desayuno y la once chilena por excelencia, sobre todo en la infancia. Se hace con leche fría y plátano maduro. Es dulce, cremosa y muy fácil de hacer. En algunas casas se le agrega avena para hacerla más contundente.',
    [
      { error: 'Queda muy espesa', solucion: 'Usar plátano muy grande o poca leche. Ajusta la cantidad de leche al gusto.' },
      { error: 'Sabe a plátano verde', solucion: 'Usar plátano poco maduro. El plátano debe estar maduro, con la cáscara amarilla y algunas manchas.' },
    ],
    { refrigerador: 'Se consume al momento.', congelador: 'No recomendado.', recalentar: 'No aplica.' }
  ),

  /* 182. Avena */
  r('Avena', 'bebidas',
    ['avena', 'desayuno', 'invierno', 'caliente', 'simple', 'saludable'],
    null, '10 min', '2 personas', 'muy fácil', 'Olla',
    [
      '1 taza de avena',
      '2 tazas de leche',
      '2 cucharadas de azúcar (o miel)',
      '1 pizca de sal',
      '1 rama de canela (opcional)',
      'Opcional: pasas, nueces, plátano en rodajas',
    ],
    [
      'En una olla, calienta la leche con la canela y la sal.',
      'Agrega la avena y cocina a fuego medio-bajo, revolviendo constantemente, por 5-7 minutos, hasta que espese.',
      'Endulza con azúcar o miel al gusto.',
      'Sirve caliente en tazones y agrega pasas, nueces o plátano si quieres.',
    ],
    'La avena caliente es el desayuno de invierno chileno. Se hace con leche y avena, y se endulza con azúcar o miel. Es reconfortante, económica y muy nutritiva. En Chile se le agrega canela y a veces pasas o frutas.',
    [
      { error: 'Queda muy espesa', solucion: 'Cocinarla demasiado o usar poca leche. Agrega más leche caliente si es necesario.' },
      { error: 'Se pega a la olla', solucion: 'No revolver con frecuencia. Cocina a fuego medio-bajo y revuelve constantemente.' },
    ],
    { refrigerador: 'Hasta 2 días en recipiente hermético.', congelador: 'No recomendado.', recalentar: 'A fuego lento con un poco de leche.' }
  ),
];