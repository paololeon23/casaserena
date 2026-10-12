import { activeAvailabilityProvider, stayCrossesOccupied } from "./availability";
import { formatLong, nightsBetween } from "./dates";

export type BookingDraft = {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  roomName: string;
  guestName: string;
  note: string;
  accepted: boolean;
  maxGuests: number;
};

export type BookingField = "checkIn" | "checkOut" | "guests" | "guestName" | "note" | "accepted";

export type BookingIssue = {
  field: BookingField;
  message: string;
};

export function validateBooking(draft: BookingDraft, today: string): BookingIssue[] {
  const issues: BookingIssue[] = [];

  if (!draft.checkIn) {
    issues.push({ field: "checkIn", message: "Elige la fecha de ingreso." });
  } else if (activeAvailabilityProvider.statusFor(draft.checkIn, today) === "past") {
    issues.push({ field: "checkIn", message: "La fecha de ingreso no puede ser anterior a hoy." });
  }

  if (!draft.checkOut) {
    issues.push({ field: "checkOut", message: "Elige la fecha de salida." });
  } else if (draft.checkIn && draft.checkOut <= draft.checkIn) {
    issues.push({ field: "checkOut", message: "La salida debe ser posterior al ingreso." });
  } else if (draft.checkIn && stayCrossesOccupied(draft.checkIn, draft.checkOut, today)) {
    issues.push({
      field: "checkOut",
      message: "Esas noches incluyen una fecha ocupada. Elige otras noches.",
    });
  } else if (activeAvailabilityProvider.statusFor(draft.checkOut, today) === "past") {
    issues.push({ field: "checkOut", message: "La fecha de salida no puede estar en el pasado." });
  }

  if (!Number.isInteger(draft.guests) || draft.guests < 1) {
    issues.push({ field: "guests", message: "Indica al menos 1 huésped." });
  } else if (draft.guests > draft.maxGuests) {
    issues.push({
      field: "guests",
      message: `El formulario admite hasta ${draft.maxGuests} huéspedes. Confirma el grupo por WhatsApp.`,
    });
  }

  const name = draft.guestName.trim();
  if (name.length < 2) {
    issues.push({ field: "guestName", message: "Escribe tu nombre para la solicitud." });
  } else if (name.length > 80) {
    issues.push({ field: "guestName", message: "El nombre admite hasta 80 caracteres." });
  }

  if (draft.note.trim().length > 500) {
    issues.push({ field: "note", message: "La consulta adicional admite hasta 500 caracteres." });
  }

  if (!draft.accepted) {
    issues.push({
      field: "accepted",
      message: "Confirma que la solicitud no deja la reserva hecha.",
    });
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
  const room = draft.roomName.trim() || "Sin preferencia";
  return [
    "Hola, Casa Serena Otuzco. Quisiera consultar la disponibilidad para una reserva.",
    "",
    `Nombre: ${draft.guestName.trim()}`,
    `Habitación: ${room}`,
    `Fecha de ingreso: ${draft.checkIn ? formatLong(draft.checkIn) : ""}`,
    `Fecha de salida: ${draft.checkOut ? formatLong(draft.checkOut) : ""}`,
    `Cantidad de huéspedes: ${draft.guests}`,
    `Cantidad de noches: ${nights ?? ""}`,
    `Consulta adicional: ${draft.note.trim()}`,
    "",
    "¿Podrían confirmarme la disponibilidad y el precio total, por favor?",
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
