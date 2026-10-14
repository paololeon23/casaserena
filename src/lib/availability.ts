import { addDays } from "./dates";

export type DateStatus = "past" | "selectable" | "occupied";

/** Noches que se duermen: desde el ingreso inclusive hasta el día anterior a la salida. */
export function nightsOfStay(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  let cursor = checkIn;
  while (cursor < checkOut) {
    nights.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return nights;
}

export function statusForDate(iso: string, today: string, occupied: readonly string[]): DateStatus {
  if (iso < today) return "past";
  if (occupied.includes(iso)) return "occupied";
  return "selectable";
}

export function stayCrossesOccupied(checkIn: string, checkOut: string, occupied: readonly string[]): boolean {
  const blocked = new Set(occupied);
  return nightsOfStay(checkIn, checkOut).some((iso) => blocked.has(iso));
}
