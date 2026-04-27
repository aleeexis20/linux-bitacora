/** 
 * Funciones base */

function setCelda(zelda, balor){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(zelda).setValue(balor);
}

function getCelda(zelda){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let valor = sheet.getRange(zelda).getValue();
  return valor;
}

function getCeldas(rangoZeldas){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let valores = sheet.getRange(rangoZeldas).getValues();
  return valores;
}

/**
 * 1. Función ls(arg)
 * Muestra negocios según disponibilidad de contacto.
 * @param {string} arg - 't', 'w', 'c' o 'a'
 */

function ls(arg) {
  const datos = getCeldas("A2:AZ100"); 
  const COL_ID = 0;      // Columna A
  const COL_NOMBRE = 1;  // Columna B
  const COL_TEL = 27;    // Columna AB
  const COL_CORREO = 28; // Columna AC
  const COL_WEB = 29;    // Columna AD

  let filtrados = datos.filter(fila => {
    let tieneT = fila[COL_TEL] !== "";
    let tieneW = fila[COL_WEB] !== "";
    let tieneC = fila[COL_CORREO] !== "";

    // Filtro
    if (arg === 't') {
      return tieneT;
    } else if (arg === 'w') {
      return tieneW;
    } else if (arg === 'c') {
      return tieneC;
    } else if (arg === 'a') {
      return (tieneT && tieneW && tieneC);
    } else {
      // Error por opción invalida
      throw new Error(`ls: argumento inválido '${arg}'. Opciones válidas: 't', 'w', 'c', 'a'.`);
    }
  });

  // --- Impresión en consola ---
  filtrados.forEach(negocio => {
    let tel = negocio[COL_TEL] ? negocio[COL_TEL] : "N/A";
    let correo = negocio[COL_CORREO] ? negocio[COL_CORREO] : "N/A";
    let web = negocio[COL_WEB] ? negocio[COL_WEB] : "N/A";

    console.log(`📞 [${negocio[COL_ID]}] ${negocio[COL_NOMBRE]} | Tel: ${tel} | Correo: ${correo} | Web: ${web}`);
  });

  return filtrados;
}

/**
 * 2. Función lsV - Filtro por vialidad
 */
function lsV(tipoVialidad, nombreVialidad) {
  const datos = getCeldas("A2:AZ100");
  const COL_ID = 0;       // Columna A
  const COL_NOMBRE = 1;   // Columna B
  const COL_TIPO = 5;     // Columna F
  const COL_NOMBRE_V = 6; // Columna G

  // Limpiamos los parámetros de búsqueda 
  let tipoBusqueda = tipoVialidad.toString().trim().toLowerCase();
  let nombreBusqueda = nombreVialidad.toString().trim().toLowerCase();

  let filtrados = datos.filter(fila => 
    fila[COL_TIPO] !== "" && fila[COL_NOMBRE_V] !== "" &&
    // El .trim() limpia los espacios extra del Excel antes de comparar
    fila[COL_TIPO].toString().trim().toLowerCase() === tipoBusqueda &&
    fila[COL_NOMBRE_V].toString().trim().toLowerCase() === nombreBusqueda
  );

  // Impresión en consola
  if (filtrados.length === 0) {
    console.log("Resultados lsV: No se encontraron negocios en esa vialidad.");
  } else {
    filtrados.forEach(negocio => {
      console.log(`🛣️ [${negocio[COL_ID]}] ${negocio[COL_NOMBRE]} | Ubicación: ${negocio[COL_TIPO]} ${negocio[COL_NOMBRE_V]}`);
    });
  }

  return filtrados;
}

/**
 * 3. Función lsGPS(latitud, longitud)
 * Encuentra los 5 más cercanos en un radio de 3km.
 */

function lsGPS(latitud, longitud) {
  const datos = getCeldas("A2:AZ100"); 
  
  const COL_ID = 0;     // Columna A (CLEE / ID)
  const COL_NOMBRE = 1; // Columna B (nom_estab)
  const COL_GPS = 30;   // Columna AE (Coordenadas conjuntas)
  const RADIO_MAX = 500;  // km

  // --- Limpieza de parámetros de entrada ---
  let latIn = latitud.toString().trim();
  let lonIn = longitud.toString().trim();

  // Ingresar punto decimal en caso que no de no ponerlo
  if (!latIn.includes('.')) latIn = latIn.slice(0, 2) + "." + latIn.slice(2);
  if (!lonIn.includes('.')) lonIn = lonIn.slice(0, 4) + "." + lonIn.slice(4);

  let lat1 = parseFloat(latIn);
  let lon1 = parseFloat(lonIn);

  // --- Procesamiento de la base de datos ---
  let cercanos = datos
  .filter(fila => fila[COL_GPS] && fila[COL_GPS].toString().includes(',')) 
  .map(fila => {
    let partesGps = fila[COL_GPS].toString().split(',');
    let latString = partesGps[0].trim();
    let lonString = partesGps[1].trim();
    
    // punto decimal x2
    let lat2 = parseFloat(latString.slice(0, 2) + "." + latString.slice(2));
    let lon2 = parseFloat(lonString.slice(0, 4) + "." + lonString.slice(4));

    let d = calcularDistancia(lat1, lon1, lat2, lon2);
    
    return { id: fila[COL_ID], nombre: fila[COL_NOMBRE], distancia: d };
  })
  .filter(item => item.distancia <= RADIO_MAX)
  .sort((a, b) => a.distancia - b.distancia)
  .slice(0, 5);

  // --- Impresión de resultados ---
  if (cercanos.length === 0) {
    console.log("No se encontraron negocios a menos de 3 km.");
  } else {
    cercanos.forEach(negocio => {
      console.log(`📌 [${negocio.id}] ${negocio.nombre} | Distancia: ${negocio.distancia.toFixed(2)} km`);
    });
  }

  return cercanos;
}

/**
 * Función auxiliar para cálculo de distancia 
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * ==========================================
 * PRUEBAS 
 * ==========================================
 */

function hacerPruebas() {
  console.log("💻 === INICIANDO FUNCIÓN DE PRUEBAS === 🎰");

  // ---------------------------------------------------------
  console.log("--- 1. Probando Filtro por Contacto (ls) ---");
  // 'a' busca los que tienen todos los datos (tel, web y correo). 
  // Puedes cambiarlo por 'a','t', 'w' o 'c'
  //'t' muestra los que tiene telefono
  //'w' muestra los que tiene pagina web
  //'c' muestra los que tiene correo electronico
  //'a' muestra solo los que tiene los tres componentes telefono, web y correo electronico
  ls('a'); 

  // ---------------------------------------------------------
  console.log("--- 2. Probando Filtro por Vialidad (lsV) ---");
  // Busca negocios en "CALLE" con nombre "JUÁREZ" 
  lsV('CALLE', 'SAN FELIPE'); 

  // ---------------------------------------------------------
  console.log("--- 3. Probando Búsqueda GPS (lsGPS) ---");
  // Búsqueda con coordenadas
  lsGPS('3186540587','-11663089337'); 

  console.log("✅ === PRUEBAS FINALIZADAS === ✅");
}









