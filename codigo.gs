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
  // Obtenemos todos los datos (Ajusta "A2:G50" al rango real de tu tabla)
  const datos = getCeldas("A2:G50"); 
  
  // Índices de columnas (A=0, B=1, etc.) - Ajusta según tu hoja
  const COL_TEL = 3; 
  const COL_WEB = 4;
  const COL_CORREO = 5;

  let filtrados = datos.filter(fila => {
    let tieneT = fila[COL_TEL] !== "";
    let tieneW = fila[COL_WEB] !== "";
    let tieneC = fila[COL_CORREO] !== "";

    if (arg === 't') return tieneT;
    if (arg === 'w') return tieneW;
    if (arg === 'c') return tieneC;
    if (arg === 'a') return (tieneT && tieneW && tieneC);
    return false;
  });

  console.log("Resultados ls(" + arg + "):", filtrados);
  return filtrados;
}

/**
 * 2. Función lsV(tipoVialidad, nombreVialidad)
 * Filtra negocios por dirección exacta.
 */

function lsV(tipoVialidad, nombreVialidad) {
  const datos = getCeldas("A2:G50");
  const COL_TIPO_V = 1; 
  const COL_NOMBRE_V = 2;

  let filtrados = datos.filter(fila => {
    return fila[COL_TIPO_V].toString().toLowerCase() === tipoVialidad.toLowerCase() &&
           fila[COL_NOMBRE_V].toString().toLowerCase() === nombreVialidad.toLowerCase();
  });

  console.log("Resultados lsV:", filtrados);
  return filtrados;
}

/**
 * 3. Función lsGPS(latitud, longitud)
 * Encuentra los 5 más cercanos en un radio de 3km.
 */

function lsGPS(latitud, longitud) {
  const datos = getCeldas("A2:G50");
  const COL_LAT = 6;
  const COL_LON = 7;
  const RADIO_MAX = 3; // km

  let lat1 = parseFloat(latitud);
  let lon1 = parseFloat(longitud);

  let resultados = datos.map(fila => {
    let d = calcularDistanciaHaversine(lat1, lon1, fila[COL_LAT], fila[COL_LON]);
    return { info: fila, distancia: d };
  })
  .filter(item => item.distancia <= RADIO_MAX)
  .sort((a, b) => a.distancia - b.distancia)
  .slice(0, 5);

  console.log("Negocios cercanos:", resultados);
  return resultados;
}

/**
 * Función auxiliar para cálculo de distancia 
 */
function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}




















