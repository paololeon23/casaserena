import { Minus, Plus } from "lucide-react";
import { formMaxGuests } from "../config/site";
import { useBooking } from "../context/BookingContext";
import { countLabel, stayNights } from "../lib/booking";
import { formatCompact } from "../lib/dates";
import { scrollToId } from "../lib/ui";

export function SearchBar() {
  const booking = useBooking();
  const nights = stayNights(booking);
  const checkInLabel = booking.checkIn ? formatCompact(booking.checkIn) : "Elige el día";
  const checkOutLabel = booking.checkOut ? formatCompact(booking.checkOut) : "Elige el día";

  return (
    <form
      className="rounded-[1.6rem] border border-white/70 bg-white p-2 text-ink shadow-[0_24px_60px_-32px_rgba(84,108,76,0.45)]"
      onSubmit={(event) => {
        event.preventDefault();
        scrollToId("reservar");
      }}
    >
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
        <button type="button" className="rounded-2xl px-4 py-3 text-left hover:bg-paper" onClick={() => scrollToId("reservar")}>
          <span className="block text-[10px] font-medium uppercase tracking-[0.16em]">Ingreso</span>
          <span className="mt-1 block text-sm font-medium">{checkInLabel}</span>
        </button>
        <button type="button" className="rounded-2xl px-4 py-3 text-left hover:bg-paper md:border-l md:border-line" onClick={() => scrollToId("reservar")}>
          <span className="block text-[10px] font-medium uppercase tracking-[0.16em]">Salida</span>
          <span className="mt-1 block text-sm font-medium">{checkOutLabel}</span>
        </button>
        <div className="rounded-2xl px-3 py-3 md:border-l md:border-line">
          <span id="noches-busqueda" className="block text-[10px] font-medium uppercase tracking-[0.16em]">
            Noches
          </span>
          <div className="mt-1 flex items-center justify-between gap-2" role="group" aria-labelledby="noches-busqueda">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
              aria-label="Menos noches"
              onClick={() => booking.setNights((nights ?? 1) - 1)}
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="text-sm font-medium">{nights == null ? "Elige" : countLabel(nights, "noche", "noches")}</span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
              aria-label="Más noches"
              onClick={() => booking.setNights((nights ?? 0) + 1)}
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="rounded-2xl px-3 py-3 md:border-l md:border-line">
          <span id="huespedes-busqueda" className="block text-[10px] font-medium uppercase tracking-[0.16em]">
            Huéspedes
          </span>
          <div className="mt-1 flex items-center justify-between gap-2" role="group" aria-labelledby="huespedes-busqueda">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
              aria-label="Menos huéspedes"
              onClick={() => booking.setGuests(booking.guests - 1)}
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="text-sm font-medium">{countLabel(booking.guests, "huésped", "huéspedes")}</span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
              aria-label="Más huéspedes"
              onClick={() => booking.setGuests(booking.guests + 1)}
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only">Máximo del formulario: {formMaxGuests}</p>
        </div>
      </div>
      <button type="submit" className="mt-1 w-full rounded-2xl bg-ink px-4 py-3.5 text-sm font-medium text-white">
        Ver noches y huéspedes
      </button>
    </form>
  );
}
