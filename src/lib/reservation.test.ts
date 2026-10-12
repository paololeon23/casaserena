import { describe, expect, it } from "vitest";
import { activeAvailabilityProvider } from "./availability";
import {
  buildReservationMessage,
  buildWhatsappLink,
  estimateStay,
  isWhatsappReady,
  stayNights,
  validateBooking,
  type BookingDraft,
} from "./booking";
import { addDays, applyDateSelection, formatLong, isPastDate, nightsBetween } from "./dates";
import { fullWhatsappNumber } from "../config/site";

const today = "2026-10-12";

function draft(overrides: Partial<BookingDraft> = {}): BookingDraft {
  return {
    checkIn: "2026-10-20",
    checkOut: "2026-10-23",
    guests: 2,
    roomName: "",
    guestName: "María Ñañez",
    note: "Llegamos por la tarde",
    accepted: true,
    maxGuests: 10,
    ...overrides,
  };
}

describe("fechas", () => {
  it("deshabilita las fechas anteriores a hoy y permite hoy", () => {
    expect(isPastDate("2026-10-11", today)).toBe(true);
    expect(isPastDate("2026-10-12", today)).toBe(false);
    expect(activeAvailabilityProvider.statusFor("2026-10-11", today)).toBe("past");
    expect(activeAvailabilityProvider.statusFor("2026-12-01", today)).toBe("selectable");
  });

  it("no afirma que una fecha futura esté disponible", () => {
    const status = activeAvailabilityProvider.statusFor("2026-11-02", today, "habitacion");
    expect(status).toBe("selectable");
    expect(status).not.toBe("available");
  });

  it("marca como ocupadas solo las noches de ejemplo", () => {
    expect(activeAvailabilityProvider.statusFor("2026-10-15", today)).toBe("occupied");
    expect(activeAvailabilityProvider.statusFor("2026-10-17", today)).toBe("occupied");
    expect(activeAvailabilityProvider.statusFor("2026-10-20", today)).toBe("selectable");
    expect(validateBooking(draft({ checkIn: "2026-10-14", checkOut: "2026-10-16" }), today).map((issue) => issue.field)).toContain(
      "checkOut",
    );
  });

  it("calcula las noches y cruza de mes", () => {
    expect(nightsBetween("2026-10-12", "2026-10-15")).toBe(3);
    expect(nightsBetween("2026-10-12", "2026-10-13")).toBe(1);
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
  });

  it("rechaza una fecha pasada y arma el rango de ingreso y salida", () => {
    expect(applyDateSelection(null, null, "2026-10-01", today).rejected).toBe("past");

    const first = applyDateSelection(null, null, "2026-10-20", today);
    expect(first).toMatchObject({ checkIn: "2026-10-20", checkOut: null, rejected: null });

    const second = applyDateSelection(first.checkIn, first.checkOut, "2026-10-23", today);
    expect(second).toMatchObject({ checkIn: "2026-10-20", checkOut: "2026-10-23" });

    const earlier = applyDateSelection("2026-10-20", null, "2026-10-18", today);
    expect(earlier).toMatchObject({ checkIn: "2026-10-18", checkOut: null });

    const restart = applyDateSelection("2026-10-20", "2026-10-23", "2026-11-01", today);
    expect(restart).toMatchObject({ checkIn: "2026-11-01", checkOut: null });
  });

  it("escribe la fecha en español", () => {
    const label = formatLong("2026-10-12").toLowerCase();
    expect(label).toContain("12");
    expect(label).toContain("octubre");
    expect(label).toContain("2026");
  });
});

describe("validación y WhatsApp", () => {
  it("exige noches, huéspedes, una fecha libre y el nombre", () => {
    const issues = validateBooking(
      draft({
        checkIn: null,
        checkOut: null,
        guests: 0,
        guestName: " ",
        accepted: false,
      }),
      today,
    );
    expect(issues.map((issue) => issue.field)).toEqual(["checkIn", "checkOut", "guests", "guestName"]);
    expect(validateBooking(draft({ guestName: "", accepted: false }), today).map((issue) => issue.field)).toEqual([
      "guestName",
    ]);
    expect(validateBooking(draft({ accepted: false }), today)).toEqual([]);
  });

  it("impide que la salida sea el mismo día o una fecha pasada", () => {
    expect(validateBooking(draft({ checkIn: "2026-10-20", checkOut: "2026-10-20" }), today)[0]?.message).toMatch(
      /posterior/,
    );
    expect(validateBooking(draft({ checkIn: "2026-10-01", checkOut: "2026-10-03" }), today)[0]?.field).toBe(
      "checkIn",
    );
  });

  it("acepta una solicitud completa", () => {
    expect(validateBooking(draft(), today)).toEqual([]);
    expect(stayNights(draft())).toBe(3);
  });

  it("arma el mensaje con los datos elegidos y no da la reserva por hecha", () => {
    const message = buildReservationMessage(
      draft({ roomName: "Habitación principal (ejemplo)", guests: 3, note: "¿Hay estacionamiento?" }),
    );

    expect(message).toContain("Hola, Casa Serena Otuzco. Quisiera consultar la disponibilidad para una reserva.");
    expect(message).toContain("Nombre: María Ñañez");
    expect(message).toContain("Habitación: Habitación principal (ejemplo)");
    expect(message).toContain("Fecha de ingreso:");
    expect(message).toContain("octubre");
    expect(message).toContain("Fecha de salida:");
    expect(message).toContain("Cantidad de huéspedes: 3");
    expect(message).toContain("Cantidad de noches: 3");
    expect(message).toContain("Consulta adicional: ¿Hay estacionamiento?");
    expect(message).toContain("¿Podrían confirmarme la disponibilidad y el precio total, por favor?");
    expect(message.toLowerCase()).not.toContain("reserva confirmada");
    expect(message.toLowerCase()).not.toContain("está disponible");
  });

  it("usa Sin preferencia y omite nombre y consulta si no hay datos", () => {
    const message = buildReservationMessage(draft({ roomName: "  ", note: "  ", guestName: "  " }));
    expect(message).toContain("Habitación: Sin preferencia");
    expect(message).not.toContain("Consulta adicional");
    expect(message).not.toContain("Nombre:");
  });

  it("codifica el enlace de WhatsApp y avisa si el número no está listo", () => {
    const message = buildReservationMessage(draft());
    const link = buildWhatsappLink("+51 936 020 432", message);

    expect(link?.startsWith("https://wa.me/51936020432?text=")).toBe(true);
    const decoded = decodeURIComponent(link!.split("?text=")[1]);
    expect(decoded).toContain("María Ñañez");
    expect(decoded).toContain("Cantidad de noches: 3");
    expect(link).toContain("%0A");

    expect(buildWhatsappLink("", message)).toBeNull();
    expect(buildWhatsappLink("51", message)).toBeNull();
    expect(isWhatsappReady(fullWhatsappNumber())).toBe(true);
    expect(fullWhatsappNumber().endsWith("936020432")).toBe(true);
  });

  it("solo estima un total cuando hay precio y noches", () => {
    expect(estimateStay(null, 3)).toBeNull();
    expect(estimateStay(120, null)).toBeNull();
    expect(estimateStay(120, 3)).toBe(360);
  });
});
