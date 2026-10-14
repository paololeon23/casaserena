import { stayCrossesOccupied } from "./availability";
import { formatLong, nightsBetween } from "./dates";

export type BookingDraft = {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  roomId: string;
  roomName: string;
  guestName: string;
  dni: string;
  phone: string;
  maxGuests: number;
  occupied: string[];
};

export type BookingField = "checkIn" | "checkOut" | "guests" | "roomId" | "guestName" | "dni" | "phone";

export type BookingIssue = {
  field: BookingField;
  message: string;
};

export function validateBooking(draft: BookingDraft, today: string): BookingIssue[] {
  const issues: BookingIssue[] = [];

  if (!draft.roomId) {
    issues.push({ field: "roomId", message: "Elige AURA o ALMA." });
  }

  if (!draft.checkIn) {
    issues.push({ field: "checkIn", message: "Elige la fecha de ingreso." });
  } else if (draft.checkIn < today) {
    issues.push({ field: "checkIn", message: "La fecha de ingreso no puede ser anterior a hoy." });
  } else if (draft.occupied.includes(draft.checkIn)) {
    issues.push({ field: "checkIn", message: "Esa noche está reservada. Elige otra." });
  }

  if (!draft.checkOut) {
    issues.push({ field: "checkOut", message: "Elige la fecha de salida." });
  } else if (draft.checkIn && draft.checkOut <= draft.checkIn) {
    issues.push({ field: "checkOut", message: "La salida debe ser posterior al ingreso." });
  } else if (draft.checkIn && stayCrossesOccupied(draft.checkIn, draft.checkOut, draft.occupied)) {
    issues.push({
      field: "checkOut",
      message: "Esas noches incluyen una fecha reservada. Elige otras noches.",
    });
  } else if (draft.checkOut < today) {
    issues.push({ field: "checkOut", message: "La fecha de salida no puede estar en el pasado." });
  }

  if (!Number.isInteger(draft.guests) || draft.guests < 2) {
    issues.push({ field: "guests", message: "El mínimo es 2 personas." });
  } else if (draft.guests > draft.maxGuests) {
    issues.push({
      field: "guests",
      message: `El máximo es ${draft.maxGuests} personas.`,
    });
  }

  const name = draft.guestName.trim();
  if (name.length < 2) {
    issues.push({ field: "guestName", message: "Escribe tu nombre." });
  } else if (name.length > 80) {
    issues.push({ field: "guestName", message: "El nombre admite hasta 80 caracteres." });
  }

  const dni = draft.dni.replace(/\D/g, "");
  if (dni.length !== 8) {
    issues.push({ field: "dni", message: "Escribe tu DNI de 8 dígitos." });
  }

  const phone = draft.phone.replace(/\D/g, "");
  if (!/^9\d{8}$/.test(phone)) {
    issues.push({ field: "phone", message: "Escribe tu celular de 9 dígitos." });
  }

  return issues;
}

export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function stayNights(draft: Pick<BookingDraft, "checkIn" | "checkOut">): number | null {
  if (!draft.checkIn || !draft.checkOut || draft.checkOut <= draft.checkIn) return null;
  return nightsBetween(draft.checkIn, draft.checkOut);
}

export function buildReservationMessage(draft: BookingDraft): string {
  const nights = stayNights(draft);
  const room = draft.roomName.trim() || "una habitación";
  const people = countLabel(Math.max(draft.guests, 0), "persona", "personas");
  const stay =
    draft.checkIn && draft.checkOut
      ? `del ${formatLong(draft.checkIn)} al ${formatLong(draft.checkOut)}`
      : "en las fechas que conversemos";
  const nightText = nights ? ` (${countLabel(nights, "noche", "noches")})` : "";
  return [
    `Hola, soy ${draft.guestName.trim() || "…"}. Deseo consultar ${room}, ${stay}, para ${people}${nightText}.`,
    "",
    `DNI: ${draft.dni.replace(/\D/g, "")}`,
    `Celular: ${draft.phone.replace(/\D/g, "")}`,
    "",
    "Quedo atento a su confirmación. Gracias.",
  ].join("\n");
}

export function whatsappDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isWhatsappReady(phone: string): boolean {
  const digits = whatsappDigits(phone);
  return digits.length >= 10 && digits.length <= 15;
}

export function buildWhatsappLink(phone: string, message: string): string | null {
  if (!isWhatsappReady(phone)) return null;
  return `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(message)}`;
}

export function formatMoney(amount: number, currency = "PEN"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function estimateStay(pricePerNight: number | null, nights: number | null): number | null {
  if (pricePerNight == null || nights == null || nights < 1) return null;
  return pricePerNight * nights;
}
