/**
 * Casa Serena Otuzco
 *
 * Este script vive DENTRO del Excel CASA SERENA. No crea otro archivo.
 *
 * 1. Abre el Excel CASA SERENA.
 * 2. Extensiones > Apps Script. Pega este archivo y guarda.
 * 3. Ejecuta prepararHojas y acepta los permisos.
 *    En ese mismo Excel quedan dos pestañas:
 *    - Calendario: lo que tapa noches en la página. El nombre no sale a la web.
 *    - Registros: interesados. La misma fecha inicio y fecha fin puede repetirse
 *      entre personas distintas. No tapa el calendario.
 * 4. Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo
 *    Quién tiene acceso: Cualquier persona
 * 5. Copia la URL que termina en /exec y pégala en src/config/site.ts, en appsScriptUrl.
 *    Si cambias este código, haz una implementación nueva. La URL vieja no se actualiza.
 *
 * Calendario, una fila por reserva confirmada:
 * Fecha inicio | Fecha fin | Nombre | Habitacion | Dni | Celular | Hora registro
 * Habitacion es una lista. Se elige AURA o ALMA, no se escribe.
 * 15-10-2026 | 16-10-2026 | Nombre del huésped | AURA (Matrimonial) | 12345678 | 987654321 | 14:30:00
 * Eso ocupa el 15. El 16 es la salida y queda libre.
 *
 * Prueba en el navegador, cambiando la URL:
 * https://script.google.com/macros/s/TU_ID/exec?action=ocupadas
 * Tiene que verse un JSON con "ok": true.
 */

var ZONA = "America/Lima";
var HOJA_CALENDARIO = "Calendario";
var HOJA_REGISTROS = "Registros";
var VERDE = "#546C4C";
var BLANCO = "#FFFFFF";

var LISTA_HABITACION = ["AURA", "ALMA"];
var ENCABEZADO_CALENDARIO = ["Fecha inicio", "Fecha fin", "Nombre", "Habitacion", "Dni", "Celular", "Hora registro"];
var ENCABEZADO_REGISTROS = [
  "Registrado",
  "Hora",
  "Nombre",
  "DNI",
  "Celular",
  "Habitacion",
  "Fecha inicio",
  "Fecha fin",
  "Huespedes",
  "Noches",
];

function prepararHojas() {
  var libro = abrirLibro();
  if (!libro) {
    throw new Error("Abre el Excel CASA SERENA y entra por Extensiones > Apps Script. Este código no crea otro archivo.");
  }
  libro.setSpreadsheetTimeZone(ZONA);
  var calendario = asegurarHoja(libro, HOJA_CALENDARIO, ENCABEZADO_CALENDARIO);
  var registros = asegurarHoja(libro, HOJA_REGISTROS, ENCABEZADO_REGISTROS);
  calendario.getRange("A:B").setNumberFormat("dd-mm-yyyy");
  calendario.getRange("E:F").setNumberFormat("@");
  ponerListaHabitacion(calendario, 4);
  registros.getRange("D:E").setNumberFormat("@");
  registros.getRange("G:H").setNumberFormat("@");
  quitarHojaVacia(libro, "Hoja 1");
  Logger.log(libro.getUrl());
  return libro.getUrl();
}

function probar() {
  var resultado = ocupadasPublicas();
  Logger.log(JSON.stringify(resultado));
  return resultado;
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = String(params.action || "ocupadas");
    if (action === "ocupadas") return responder(e, ocupadasPublicas());
    if (action === "ping") return responder(e, { ok: true, servicio: "casa-serena", actualizado: ahora() });
    return responder(e, { ok: false, error: "Acción no reconocida.", habitaciones: {} });
  } catch (error) {
    return responder(e, { ok: false, error: String(error && error.message ? error.message : error), habitaciones: {} });
  }
}

function doPost(e) {
  try {
    var data = leerPayload(e);
    var guardado = guardarRegistro(data);
    return responder(e, guardado);
  } catch (error) {
    return responder(e, { ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function ocupadasPublicas() {
  var libro = abrirLibro();
  if (!libro) {
    return {
      ok: false,
      error: "Abre el Excel CASA SERENA, Extensiones > Apps Script, ejecuta prepararHojas y publica desde ahí.",
      actualizado: ahora(),
      habitaciones: { aura: [], alma: [] },
    };
  }
  var sheet = libro.getSheetByName(HOJA_CALENDARIO);
  var habitaciones = { aura: [], alma: [] };
  if (!sheet || sheet.getLastRow() < 2) {
    return { ok: true, actualizado: ahora(), habitaciones: habitaciones };
  }
  var filas = sheet.getRange(2, 1, sheet.getLastRow() - 1, ENCABEZADO_CALENDARIO.length).getDisplayValues();
  filas.forEach(function (fila) {
    var inicio = parseFecha(fila[0]);
    var fin = parseFecha(fila[1]);
    var roomId = habitacionId(fila[3]);
    if (!inicio || !fin || !roomId || fin <= inicio) return;
    nightsOfStay(inicio, fin).forEach(function (iso) {
      if (habitaciones[roomId].indexOf(iso) === -1) habitaciones[roomId].push(iso);
    });
  });
  habitaciones.aura.sort();
  habitaciones.alma.sort();
  return { ok: true, actualizado: ahora(), habitaciones: habitaciones };
}

function guardarRegistro(data) {
  var libro = abrirLibro();
  if (!libro) {
    return { ok: false, error: "Abre el Excel CASA SERENA, Extensiones > Apps Script, ejecuta prepararHojas y publica desde ahí." };
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = asegurarHoja(libro, HOJA_REGISTROS, ENCABEZADO_REGISTROS);
    var momento = new Date();
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 4, 1, 2).setNumberFormat("@");
    sheet.getRange(row, 1, 1, ENCABEZADO_REGISTROS.length).setValues([[
      Utilities.formatDate(momento, ZONA, "dd-MM-yyyy"),
      Utilities.formatDate(momento, ZONA, "HH:mm:ss"),
      texto(data.nombre, 80),
      texto(data.dni, 12),
      texto(data.celular, 15),
      texto(data.habitacion, 40),
      texto(data.fecha, 20),
      texto(data.fechaFin, 20),
      texto(data.huespedes, 4),
      texto(data.noches, 4),
    ]]);
    return { ok: true, actualizado: ahora() };
  } finally {
    lock.releaseLock();
  }
}

function abrirLibro() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (error) {
    return null;
  }
}

function quitarHojaVacia(libro, nombre) {
  var sobra = libro.getSheetByName(nombre);
  if (!sobra || sobra.getLastRow() > 0) return;
  if (libro.getSheets().length < 2) return;
  libro.deleteSheet(sobra);
}

function asegurarHoja(libro, nombre, encabezados) {
  var sheet = libro.getSheetByName(nombre);
  if (!sheet) sheet = libro.insertSheet(nombre);
  var rango = sheet.getRange(1, 1, 1, encabezados.length);
  rango.setValues([encabezados]);
  rango
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setFontColor(BLANCO)
    .setBackground(VERDE)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  encabezados.forEach(function (titulo, indice) {
    sheet.setColumnWidth(indice + 1, Math.max(120, titulo.length * 11 + 28));
  });
  return sheet;
}

function leerPayload(e) {
  var raw = "";
  if (e && e.parameter && e.parameter.payload) raw = e.parameter.payload;
  else if (e && e.postData && e.postData.contents) raw = e.postData.contents;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function responder(e, data) {
  var body = JSON.stringify(data);
  var callback = e && e.parameter ? String(e.parameter.callback || "") : "";
  if (/^[A-Za-z_][A-Za-z0-9_]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + body + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

function bloquea(estado) {
  var value = String(estado || "").trim().toLowerCase();
  return !value || value === "reservado" || value === "ocupado" || value === "confirmado";
}

function ponerListaHabitacion(sheet, columna) {
  var regla = SpreadsheetApp.newDataValidation()
    .requireValueInList(LISTA_HABITACION, true)
    .setAllowInvalid(false)
    .setHelpText("Elige AURA o ALMA")
    .build();
  sheet.getRange(2, columna, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(regla);
}

function habitacionId(value) {
  var text = String(value || "").trim().toLowerCase();
  if (text.indexOf("aura") !== -1 || text === "matrimonial") return "aura";
  if (text.indexOf("alma") !== -1 || text === "doble") return "alma";
  return "";
}

function parseFecha(value) {
  var text = String(value || "").trim();
  var local = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (local) return local[3] + "-" + dos(local[2]) + "-" + dos(local[1]);
  var iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[1] + "-" + iso[2] + "-" + iso[3];
  return "";
}

function nightsOfStay(inicio, fin) {
  var nights = [];
  var cursor = inicio;
  var guard = 0;
  while (cursor < fin && guard < 62) {
    nights.push(cursor);
    cursor = addIsoDays(cursor, 1);
    guard += 1;
  }
  return nights;
}

function addIsoDays(iso, days) {
  var parts = iso.split("-");
  var date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  date.setUTCDate(date.getUTCDate() + days);
  return Utilities.formatDate(date, "UTC", "yyyy-MM-dd");
}

function ahora() {
  return Utilities.formatDate(new Date(), ZONA, "yyyy-MM-dd'T'HH:mm:ss");
}

function dos(value) {
  return ("0" + String(value)).slice(-2);
}

function texto(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}
