import { Minus, Plus } from "lucide-react";
import {
  currency,
  formMaxGuests,
  fullWhatsappNumber,
  publishedRooms,
  whatsappDisplay,
} from "../config/site";
import { useBooking } from "../context/BookingContext";
import { countLabel, estimateStay, formatMoney, stayNights } from "../lib/booking";
import { formatCompact, formatLong } from "../lib/dates";
import { Calendar } from "./Calendar";
import { Container, FieldError, SectionHeading } from "./ui";

export function Booking() {
  const booking = useBooking();
  const rooms = publishedRooms();
  const selected = rooms.find((room) => room.id === booking.roomId) ?? null;
  const nights = stayNights(booking);
  const estimate = estimateStay(selected?.pricePerNight ?? null, nights);
  const issue = (field: string) => booking.issues.find((item) => item.field === field)?.message;

  return (
    <section id="reservar" className="scroll-mt-24 pb-4 pt-6 md:pb-6 md:pt-8">
      <Container>
        <SectionHeading
          eyebrow="Tus fechas"
          title="Elige el ingreso y la salida"
          text="Marca las noches en el calendario. La solicitud se abre en WhatsApp y Casa Serena te confirma disponibilidad y precio."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-line bg-white p-5">
            <p id="noches-reserva" className="text-[11px] font-medium uppercase tracking-[0.16em]">
              ¿Cuántas noches?
            </p>
            <div className="mt-4 flex items-center justify-between gap-3" role="group" aria-labelledby="noches-reserva">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label="Menos noches"
                onClick={() => booking.setNights((nights ?? 1) - 1)}
              >
                <Minus aria-hidden="true" />
              </button>
              <p className="font-display text-4xl tracking-[-0.03em]">{nights == null ? "Elige" : countLabel(nights, "noche", "noches")}</p>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label="Más noches"
                onClick={() => booking.setNights((nights ?? 0) + 1)}
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-sm">
              {booking.checkIn && booking.checkOut
                ? `${formatCompact(booking.checkIn)} al ${formatCompact(booking.checkOut)}`
                : "Suma noches o márcalas en el calendario."}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-line bg-white p-5">
            <p id="huespedes-reserva" className="text-[11px] font-medium uppercase tracking-[0.16em]">
              ¿Cuántos huéspedes?
            </p>
            <div className="mt-4 flex items-center justify-between gap-3" role="group" aria-labelledby="huespedes-reserva">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label="Menos huéspedes"
                onClick={() => booking.setGuests(booking.guests - 1)}
              >
                <Minus aria-hidden="true" />
              </button>
              <p className="font-display text-4xl tracking-[-0.03em]">{countLabel(booking.guests, "huésped", "huéspedes")}</p>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line"
                aria-label="Más huéspedes"
                onClick={() => booking.setGuests(booking.guests + 1)}
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-sm">
              {selected?.capacity
                ? `Esta habitación es para ${selected.capacity} ${selected.capacity === 1 ? "persona" : "personas"}.`
                : `Puedes indicar hasta ${formMaxGuests}.`}
              {selected?.capacity && booking.guests > selected.capacity
                ? " Son más de las que caben: confírmalo por WhatsApp."
                : ""}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <Calendar checkIn={booking.checkIn} checkOut={booking.checkOut} onSelect={booking.selectDate} />
          <form
            className="h-fit rounded-[1.75rem] border border-line bg-white p-5 shadow-soft lg:sticky lg:top-28"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60">Pendiente de confirmación</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Elegir fechas no bloquea la habitación ni garantiza que esté libre.
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-ink/60">Ingreso</dt>
                <dd className="font-semibold">{booking.checkIn ? formatLong(booking.checkIn) : "Sin elegir"}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Salida</dt>
                <dd className="font-semibold">{booking.checkOut ? formatLong(booking.checkOut) : "Sin elegir"}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Noches</dt>
                <dd className="font-semibold">{nights == null ? "Sin elegir" : countLabel(nights, "noche", "noches")}</dd>
              </div>
              <div>
                <dt className="text-ink/60">Huéspedes</dt>
                <dd className="font-semibold">{countLabel(booking.guests, "huésped", "huéspedes")}</dd>
              </div>
            </dl>
            <FieldError id="error-ingreso" message={issue("checkIn")} />
            <FieldError id="error-salida" message={issue("checkOut")} />

            <FieldError id="error-huespedes" message={issue("guests")} />

            <label className="mt-4 block text-sm font-semibold" htmlFor="habitacion">
              Habitación
            </label>
            <select
              id="habitacion"
              className="field mt-2"
              value={booking.roomId}
              onChange={(event) => booking.setRoomId(event.target.value)}
            >
              <option value="">Sin preferencia</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {selected?.isExample ? (
              <p className="mt-2 text-sm text-ink/70">Esta ficha es de ejemplo. Ese nombre viajará en el mensaje.</p>
            ) : null}

            <label className="mt-4 block text-sm font-semibold" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              className="field mt-2"
              autoComplete="name"
              maxLength={80}
              value={booking.guestName}
              aria-invalid={Boolean(issue("guestName"))}
              aria-describedby={issue("guestName") ? "error-nombre" : undefined}
              onChange={(event) => booking.setGuestName(event.target.value)}
            />
            <FieldError id="error-nombre" message={issue("guestName")} />

            <label className="mt-4 block text-sm font-semibold" htmlFor="consulta">
              Consulta adicional
            </label>
            <textarea
              id="consulta"
              className="field mt-2 min-h-24 resize-y"
              maxLength={500}
              value={booking.note}
              onChange={(event) => booking.setNote(event.target.value)}
            />
            <p className="mt-1 text-xs text-ink/70">{booking.note.trim().length}/500</p>
            <FieldError id="error-consulta" message={issue("note")} />

            {estimate != null ? (
              <p className="mt-3 text-sm leading-relaxed">
                Estimado referencial: {formatMoney(estimate, currency)}. No es una confirmación ni incluye cargos que el encargado indique después.
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink/70">El precio total se confirma por WhatsApp.</p>
            )}

            <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-ink"
                checked={booking.accepted}
                onChange={(event) => booking.setAccepted(event.target.checked)}
              />
              <span>Leí los términos. Enviar esta solicitud no confirma la reserva, ni garantiza el precio ni las fechas.</span>
            </label>
            <FieldError id="error-aviso" message={issue("accepted")} />

            {booking.issues.length > 0 ? (
              <div className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm" role="alert">
                Revisa los datos antes de abrir WhatsApp.
              </div>
            ) : null}

            {!booking.whatsappReady ? (
              <p className="mt-4 text-sm font-medium" role="status">
                El número de WhatsApp todavía no está configurado. Escríbelo en src/config/site.ts.
              </p>
            ) : (
              <p className="mt-4 text-xs text-ink/60">Se enviará a {whatsappDisplay()}.</p>
            )}

            <a
              href={booking.href ?? "#reservar"}
              target={booking.href ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-full bg-ink px-5 py-3.5 text-center text-base font-bold text-white"
              onClick={booking.onReserveClick}
            >
              Solicitar reserva
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink/60">
              Número usado: {fullWhatsappNumber() || "sin configurar"}. Enviar el mensaje no deja la reserva confirmada.
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold">Ver mensaje de WhatsApp</summary>
              <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-paper p-4 font-sans text-sm leading-relaxed">{booking.message}</pre>
            </details>
            {booking.checkIn || booking.checkOut ? (
              <button type="button" className="mt-3 text-sm font-semibold underline" onClick={booking.clearDates}>
                Limpiar fechas
              </button>
            ) : null}
          </form>
        </div>
      </Container>
    </section>
  );
}
