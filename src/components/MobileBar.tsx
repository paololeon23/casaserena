import { useBooking } from "../context/BookingContext";

export function MobileBar() {
  const booking = useBooking();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-4 pt-2.5 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(0.7rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={booking.href ?? "#reservar"}
        target={booking.href ? "_blank" : undefined}
        rel="noreferrer"
        className="flex w-full items-center justify-center rounded-full bg-ink py-3.5 text-sm font-semibold text-white"
        onClick={booking.onReserveClick}
      >
        Reservar por WhatsApp
      </a>
      <p className="mt-1.5 text-center text-[10px] tracking-wide text-ink/60">
        {booking.attempted && booking.issues[0] ? booking.issues[0].message : "Enviar la solicitud no confirma la reserva."}
      </p>
    </div>
  );
}
