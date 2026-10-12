export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(now = new Date()): string {
  return toISODate(now);
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, amount: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function isPastDate(iso: string, today: string): boolean {
  return iso < today;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatCompact(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseISODate(iso));
}

export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseISODate(iso));
}

export function formatMonth(year: number, month: number): string {
  const label = new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
  return label.charAt(0).toLocaleUpperCase("es-PE") + label.slice(1);
}

export function dayNumber(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function isInRange(iso: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return iso > start && iso < end;
}

export type DateSelection = {
  checkIn: string | null;
  checkOut: string | null;
  rejected: "past" | null;
};

export function applyDateSelection(
  checkIn: string | null,
  checkOut: string | null,
  iso: string,
  today: string,
): DateSelection {
  if (isPastDate(iso, today)) {
    return { checkIn, checkOut, rejected: "past" };
  }
  if (!checkIn || checkOut) {
    return { checkIn: iso, checkOut: null, rejected: null };
  }
  if (iso <= checkIn) {
    return { checkIn: iso, checkOut: null, rejected: null };
  }
  return { checkIn, checkOut: iso, rejected: null };
}

export function monthWeeks(year: number, month: number): Array<Array<string | null>> {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toISODate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<Array<string | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

export function shiftMonth(year: number, month: number, amount: number): { year: number; month: number } {
  const date = new Date(year, month + amount, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}
