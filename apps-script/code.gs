/**
 * Casa Serena Otuzco
 *
 * Pégalo completo en https://script.google.com (un proyecto nuevo, un solo archivo).
 *
 * 1. Ejecuta prepararHojas y acepta los permisos.
 *    En el registro verás la URL del Excel. Ahí quedan dos hojas:
 *    - Calendario: noches que tapas a mano. El nombre no sale a la web.
 *    - Registros: cada persona que pulsa Reservar por WhatsApp.
 *      Nombre, DNI, celular, fecha y hora se guardan ahí.
 *      Esas fechas también tapan el calendario. El nombre no se publica.
 * 2. Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo
 *    Quién tiene acceso: Cualquier persona
 * 3. Copia la URL que termina en /exec.
 * 4. Pégala en src/config/site.ts, en appsScriptUrl, y vuelve a publicar la página.
 *    Si cambias este código, haz una implementación nueva. La URL vieja no se actualiza.
 *
 * Calendario, una fila por reserva:
 * Fecha | Fecha fin | Nombre | Habitacion | Estado | Registrado
 * 14-10-2026 | 16-10-2026 | Nombre del huésped | AURA | reservado |
 * Eso ocupa el 14 y el 15. El 16 es la salida y queda libre.
 * Habitacion: AURA o ALMA.
 * Estado vacío o "reservado" tapa las noches.
 * "consulta", "cancelado" o "anulado" no las tapa.
 *
 * Prueba en el navegador, cambiando la URL:
 * https://script.google.com/macros/s/TU_ID/exec?action=ocupadas
 * Tiene que verse un JSON con "ok": true.
 */

var ZONA = "America/Lima";
var HOJA_CALENDARIO = "Calendario";
var HOJA_REGISTROS = "Registros";
var PROP_LIBRO = "SPREADSHEET_ID";

var ENCABEZADO_CALENDARIO = ["Fecha", "Fecha fin", "Nombre", "Habitacion", "Estado", "Registrado"];
var ENCABEZADO_REGISTROS = [
  "Registrado",
  "Hora",
  "Nombre",
  "DNI",
  "Celular",
  "Habitacion",
  "Fecha",
  "Fecha fin",
  "Huespedes",
  "Noches",
];

function prepararHojas() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_LIBRO);
  var libro = null;
  if (id) {
    try {
      libro = SpreadsheetApp.openById(id);
    } catch (error) {
      libro = null;
    }
  }
  if (!libro) {
    libro = SpreadsheetApp.create("Casa Serena Otuzco");
    props.setProperty(PROP_LIBRO, libro.getId());
  }
  libro.setSpreadsheetTimeZone(ZONA);
  var calendario = asegurarHoja(libro, HOJA_CALENDARIO, ENCABEZADO_CALENDARIO);
  var registros = asegurarHoja(libro, HOJA_REGISTROS, ENCABEZADO_REGISTROS);
  calendario.getRange("A:B").setNumberFormat("dd-mm-yyyy");
  calendario.getRange("C:D").setNumberFormat("@");
  registros.getRange("D:E").setNumberFormat("@");
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
      error: "Ejecuta prepararHojas en el editor y vuelve a implementar la aplicación web.",
      actualizado: ahora(),
      habitaciones: { aura: [], alma: [] },
    };
  }
  var habitaciones = { aura: [], alma: [] };
  leerCalendario(libro, habitaciones);
  leerRegistros(libro, habitaciones);
  habitaciones.aura.sort();
  habitaciones.alma.sort();
  return { ok: true, actualizado: ahora(), habitaciones: habitaciones };
}

function leerCalendario(libro, habitaciones) {
  var sheet = libro.getSheetByName(HOJA_CALENDARIO);
  if (!sheet || sheet.getLastRow() < 2) return;
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getDisplayValues().forEach(function (fila) {
    if (!bloquea(fila[4])) return;
    ocuparRango(habitaciones, parseFecha(fila[0]), parseFecha(fila[1]), habitacionId(fila[3]));
  });
}

function leerRegistros(libro, habitaciones) {
  var sheet = libro.getSheetByName(HOJA_REGISTROS);
  if (!sheet || sheet.getLastRow() < 2) return;
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getDisplayValues().forEach(function (fila) {
    ocuparRango(habitaciones, parseFecha(fila[6]), parseFecha(fila[7]), habitacionId(fila[5]));
  });
}

function ocuparRango(habitaciones, inicio, fin, roomId) {
  if (!inicio || !fin || !roomId || fin <= inicio || !habitaciones[roomId]) return;
  nightsOfStay(inicio, fin).forEach(function (iso) {
    if (habitaciones[roomId].indexOf(iso) === -1) habitaciones[roomId].push(iso);
  });
}

function guardarRegistro(data) {
  var libro = abrirLibro();
  if (!libro) {
    return { ok: false, error: "Ejecuta prepararHojas antes de recibir consultas." };
  }
  var ficha = fichaValida(data);
  if (!ficha) {
    return { ok: false, error: "Faltan nombre, DNI, celular o las fechas de la estadía." };
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
      ficha.nombre,
      ficha.dni,
      ficha.celular,
      ficha.habitacion,
      ficha.fecha,
      ficha.fechaFin,
      ficha.huespedes,
      ficha.noches,
    ]]);
    return { ok: true, actualizado: ahora() };
  } finally {
    lock.releaseLock();
  }
}

function fichaValida(data) {
  var nombre = texto(data.nombre, 80);
  var dni = texto(data.dni, 12).replace(/\D/g, "");
  var celular = texto(data.celular, 15).replace(/\D/g, "");
  var inicio = parseFecha(data.fecha);
  var fin = parseFecha(data.fechaFin);
  var roomId = habitacionId(data.habitacion);
  if (nombre.length < 2 || !/^\d{8}$/.test(dni) || !/^9\d{8}$/.test(celular)) return null;
  if (!inicio || !fin || fin <= inicio || !roomId) return null;
  return {
    nombre: nombre,
    dni: dni,
    celular: celular,
    habitacion: texto(data.habitacion, 40),
    fecha: texto(data.fecha, 20),
    fechaFin: texto(data.fechaFin, 20),
    huespedes: texto(data.huespedes, 4),
    noches: texto(data.noches, 4),
  };
}

function abrirLibro() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_LIBRO);
  if (!id) return null;
  return SpreadsheetApp.openById(id);
}

function asegurarHoja(libro, nombre, encabezados) {
  var sheet = libro.getSheetByName(nombre);
  if (!sheet) sheet = libro.insertSheet(nombre);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(encabezados);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, encabezados.length).setFontWeight("bold");
  }
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
