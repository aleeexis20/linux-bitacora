# Tarea: Google Apps Script (GAS) - Computación en la Nube

## Descripción
Este proyecto consiste en el desarrollo de funciones personalizadas en Google Apps Script para gestionar y filtrar información de negocios dentro de una hoja de cálculo de Google Sheets. Se implementaron filtros por criterios de contacto, ubicación vial y proximidad geográfica mediante coordenadas GPS.

## Prácticas y Metodología
Para la resolución de esta actividad se aplicaron las siguientes prácticas de desarrollo:
- **Abstracción de Datos:** Uso de funciones base para desacoplar la lógica de filtrado de la lectura directa de la hoja.
- **Programación Funcional:** Uso de métodos de arreglos en JavaScript como `.filter()`, `.map()` y `.sort()` para un procesamiento de datos más eficiente.
- **Geolocalización:** Implementación de cálculos trigonométricos para resolver problemas de proximidad en un entorno de nube.

## Resolución de las Funciones

### 1. Función `ls(arg)`
Filtra los negocios basándose en la disponibilidad de métodos de contacto.
- **Lógica:** Se recorre la matriz de datos y se verifica que las celdas de Teléfono, Web o Correo no estén vacías según el parámetro solicitado ('t', 'w', 'c' o 'a').

### 2. Función `lsV(tipoVialidad, nombreVialidad)`
Busca negocios que coincidan exactamente con una dirección específica.
- **Lógica:** Se realiza una comparación de cadenas de texto. Se utilizó `.toLowerCase()` para normalizar los datos y evitar errores por diferencias entre mayúsculas y minúsculas.

### 3. Función `lsGPS(latitud, longitud)`
Identifica los 5 negocios más cercanos en un radio máximo de 3 km.
- **Lógica:** 1. Se calcula la distancia entre las coordenadas del usuario y cada negocio usando la **Fórmula de Haversine**.
  2. Se filtran los resultados que exceden los 3 km de rango.
  3. Se ordena la lista de menor a mayor distancia.
  4. Se devuelven únicamente los primeros 5 resultados.

## Funciones Base Implementadas
Se integraron las funciones base proporcionadas en clase, realizando un ajuste de retorno (`return`) para permitir el flujo de datos entre funciones:
- `setCelda(zelda, balor)`
- `getCelda(zelda)`
- `getCeldas(rangoZeldas)`

---
**Estudiante:** Alexis Eduardo Azamar Avalos 
**Materia:** Computación en la Nube
