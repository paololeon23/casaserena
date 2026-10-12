import { MessageCircle } from "lucide-react";
import { useBooking } from "../context/BookingContext";

export function WhatsAppFloat() {
  const booking = useBooking();

  return (
    <a
      href={booking.href ?? "#reservar"}
      target={booking.href ? "_blank" : undefined}
      rel="noreferrer"
      aria-label="Reservar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-[0_16px_40px_-18px_rgba(84,108,76,0.55)] md:inline-flex"
      onClick={booking.onReserveClick}
    >
      <MessageCircle aria-hidden="true" />
    </a>
  );
}
