import { describe, expect, it } from "vitest";
import { nightsOfStay, statusForDate, stayCrossesOccupied } from "./availability";
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
    roomId: "aura",
    roomName: "AURA (Matrimonial)",
    guestName: "Paolo Leon",
    dni: "12345678",
    phone: "987654321",
    maxGuests: 2,
    occupied: [],
    ...overrides,
  };
}

describe("fechas", () => {
  it("deshabilita las fechas anteriores a hoy y permite hoy", () => {
    expect(isPastDate("2026-10-11", today)).toBe(true);
    expect(isPastDate("2026-10-12", today)).toBe(false);
    expect(statusForDate("2026-10-11", today, [])).toBe("past");
    expect(statusForDate("2026-12-01", today, [])).toBe("selectable");
  });

  it("no afirma que una fecha futura esté disponible", () => {
    const status = statusForDate("2026-11-02", today, []);
    expect(status).toBe("selectable");
    expect(status).not.toBe("available");
  });

  it("ocupa las noches entre el ingreso y la salida, sin contar la salida", () => {
    expect(nightsOfStay("2026-10-14", "2026-10-16")).toEqual(["2026-10-14", "2026-10-15"]);
    expect(stayCrossesOccupied("2026-10-14", "2026-10-16", ["2026-10-15"])).toBe(true);
    expect(stayCrossesOccupied("2026-10-14", "2026-10-16", ["2026-10-16"])).toBe(false);
    expect(statusForDate("2026-10-15", today, ["2026-10-15"])).toBe("occupied");
    expect(statusForDate("2026-10-20", today, ["2026-10-15"])).toBe("selectable");
    expect(
      validateBooking(draft({ checkIn: "2026-10-14", checkOut: "2026-10-16", occupied: ["2026-10-15"] }), today).map(
        (issue) => issue.field,
      ),
    ).toContain("checkOut");
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
  it("exige habitación, noches libres, huéspedes, nombre, DNI y celular", () => {
    const issues = validateBooking(
      draft({
        checkIn: null,
        checkOut: null,
        guests: 0,
        roomId: "",
        guestName: " ",
        dni: "",
        phone: "",
      }),
      today,
    );
    expect(issues.map((issue) => issue.field)).toEqual(["roomId", "checkIn", "checkOut", "guests", "guestName", "dni", "phone"]);
    expect(validateBooking(draft({ guestName: "Ana", dni: "12345678", phone: "987654321" }), today)).toEqual([]);
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

  it("arma un mensaje corto y formal, sin dar la reserva por hecha", () => {
    const message = buildReservationMessage(draft({ roomName: "AURA (Matrimonial)", guests: 2 }));

    expect(message.startsWith("Hola, soy Paolo Leon. Deseo consultar AURA (Matrimonial)")).toBe(true);
    expect(message).toContain("octubre");
    expect(message).toContain("para 2 personas (3 noches)");
    expect(message).toContain("DNI: 12345678");
    expect(message).toContain("Celular: 987654321");
    expect(message).toContain("Quedo atento a su confirmación. Gracias.");
    expect(message.toLowerCase()).not.toContain("reserva confirmada");
    expect(message.toLowerCase()).not.toContain("está disponible");
  });

  it("deja el nombre en blanco si todavía no se escribió", () => {
    const message = buildReservationMessage(draft({ roomName: "  ", guestName: "  " }));
    expect(message).toContain("una habitación");
    expect(message).toContain("Hola, soy ….");
  });

  it("codifica el enlace de WhatsApp y avisa si el número no está listo", () => {
    const message = buildReservationMessage(draft());
    const link = buildWhatsappLink("+51 936 020 432", message);

    expect(link?.startsWith("https://wa.me/51936020432?text=")).toBe(true);
    const decoded = decodeURIComponent(link!.split("?text=")[1]);
    expect(decoded).toContain("Paolo Leon");
    expect(decoded).toContain("3 noches");
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
