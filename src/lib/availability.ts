import { addDays } from "./dates";

export type DateStatus = "past" | "selectable" | "occupied";

/**
 * Noches de ejemplo, contadas desde hoy.
 * Sirven para mostrar cómo se ve una fecha ocupada.
 * No son reservas reales de Casa Serena.
 * Se evitan los días que usan las pruebas (20–23 de octubre de 2026 y el 2 de noviembre).
 */
export const simulatedOccupiedOffsets = [3, 4, 5, 24, 25, 26, 40, 41];

export interface AvailabilityProvider {
  id: string;
  statusFor(iso: string, today: string, roomId?: string): DateStatus;
}

export function isOccupiedNight(iso: string, today: string): boolean {
  return simulatedOccupiedOffsets.some((offset) => addDays(today, offset) === iso);
}

export const activeAvailabilityProvider: AvailabilityProvider = {
  id: "simulated-occupied",
  statusFor(iso, today) {
    if (iso < today) return "past";
    if (isOccupiedNight(iso, today)) return "occupied";
    return "selectable";
  },
};

/** La salida no se duerme: solo se revisan las noches desde el ingreso hasta el día anterior a la salida. */
export function stayCrossesOccupied(checkIn: string, checkOut: string, today: string): boolean {
  let cursor = checkIn;
  while (cursor < checkOut) {
    if (activeAvailabilityProvider.statusFor(cursor, today) === "occupied") return true;
    cursor = addDays(cursor, 1);
  }
  return false;
}
