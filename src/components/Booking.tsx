import { Minus, Plus } from "lucide-react";
import {
  currency,
  fullWhatsappNumber,
  publishedRooms,
  whatsappDisplay,
} from "../config/site";
import { useBooking } from "../context/BookingContext";
import { countLabel, estimateStay, formatMoney, stayNights } from "../lib/booking";
import { formatLong } from "../lib/dates";
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
          text="Primero la habitación y las noches libres. Después tu nombre, DNI y celular. Con eso se abre WhatsApp."
        />
        <div id="habitaciones-reserva" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_minmax(280px,0.8fr)] xl:items-stretch">
          {rooms.map((room) => {
            const active = booking.roomId === room.id;
            return (
              <button
                key={room.id}
                type="button"
                aria-pressed={active}
                className={`rounded-[1.4rem] border px-5 py-4 text-left ${active ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                onClick={() => booking.setRoomId(room.id)}
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.16em]">{room.kind}</span>
                <span className="mt-1 block font-display text-3xl tracking-[-0.03em]">{room.name}</span>
                <span className={`mt-1 block text-sm ${active ? "text-white/85" : "text-ink/70"}`}>
                  {room.bedType}. {room.capacity} personas.
                </span>
              </button>
            );
          })}
          <div className="sm:col-span-2 xl:col-span-1">
            <div className="h-full rounded-[1.4rem] border border-line bg-white p-5">
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
              <p className="mt-3 text-sm">Mínimo 2 personas. Máximo 4.</p>
            </div>
          </div>
        </div>
        <FieldError id="error-habitacion" message={issue("roomId")} />
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

            <label className="mt-4 block text-sm font-semibold" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              className="field mt-2"
              autoComplete="name"
              maxLength={80}
              placeholder="Tu nombre"
              value={booking.guestName}
              aria-invalid={Boolean(issue("guestName"))}
              aria-describedby={issue("guestName") ? "error-nombre" : undefined}
              onChange={(event) => booking.setGuestName(event.target.value)}
            />
            <FieldError id="error-nombre" message={issue("guestName")} />

            <label className="mt-4 block text-sm font-semibold" htmlFor="dni">
              DNI
            </label>
            <input
              id="dni"
              className="field mt-2"
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
              placeholder="8 dígitos"
              value={booking.dni}
              aria-invalid={Boolean(issue("dni"))}
              aria-describedby={issue("dni") ? "error-dni" : undefined}
              onChange={(event) => booking.setDni(event.target.value)}
            />
            <FieldError id="error-dni" message={issue("dni")} />

            <label className="mt-4 block text-sm font-semibold" htmlFor="celular">
              Celular
            </label>
            <input
              id="celular"
              className="field mt-2"
              inputMode="tel"
              autoComplete="tel"
              maxLength={9}
              placeholder="9 dígitos"
              value={booking.phone}
              aria-invalid={Boolean(issue("phone"))}
              aria-describedby={issue("phone") ? "error-celular" : undefined}
              onChange={(event) => booking.setPhone(event.target.value)}
            />
            <FieldError id="error-celular" message={issue("phone")} />

            {estimate != null ? (
              <p className="mt-3 text-sm leading-relaxed">
                Estimado referencial: {formatMoney(estimate, currency)}. No es una confirmación ni incluye cargos que el encargado indique después.
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink/70">El precio total se confirma por WhatsApp.</p>
            )}

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
              Reservar por WhatsApp
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink/60">
              Número usado: {fullWhatsappNumber() || "sin configurar"}. Enviar el mensaje no deja la reserva confirmada.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
