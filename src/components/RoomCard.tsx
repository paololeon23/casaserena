import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { currency } from "../config/site";
import { useBooking } from "../context/BookingContext";
import { formatMoney } from "../lib/booking";
import type { Room } from "../types";
import { Lightbox } from "./Lightbox";
import { Photo } from "./Photo";

export function RoomCard({ room, mark }: { room: Room; mark: string }) {
  const booking = useBooking();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const total = room.images.length;
  const current = room.images[index];

  function move(step: number) {
    if (total < 2) return;
    setIndex((value) => (value + step + total) % total);
  }

  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-line bg-white">
      <div className="relative aspect-[4/3] bg-[#E7EEE3] sm:aspect-[16/10]">
        <Photo src={current?.src} alt={current?.alt ?? `Fotografía pendiente de ${room.name}`} mark={mark} />
        {total > 0 ? (
          <button type="button" className="absolute inset-0" aria-label={`Abrir fotos de ${room.name}`} onClick={() => setOpen(true)} />
        ) : null}
        {room.isExample ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink">
            Ejemplo
          </span>
        ) : null}
        {total > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink"
              aria-label="Imagen anterior"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink"
              aria-label="Imagen siguiente"
              onClick={() => move(1)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-[1.7rem] leading-none tracking-[-0.03em]">{room.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{room.summary}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">Capacidad</dt>
            <dd className="mt-1">{room.capacity == null ? "Por completar" : `Hasta ${room.capacity}`}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">Cama</dt>
            <dd className="mt-1">{room.bedType || "Por completar"}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">Servicios</p>
          {room.amenities.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {room.amenities.map((item) => (
                <li key={item} className="rounded-full bg-paper px-3 py-1 text-xs">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-ink/70">Por completar</p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em]">La noche</p>
            {room.pricePerNight == null ? (
              <>
                <p className="mt-1 font-display text-3xl leading-none tracking-[-0.03em]">Por confirmar</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed">
                  El total de tus fechas se responde por WhatsApp. Esta página no publica un precio que no esté confirmado.
                </p>
              </>
            ) : (
              <p className="mt-1">
                <span className="font-display text-4xl tracking-[-0.03em]">{formatMoney(room.pricePerNight, currency)}</span>
                <span className="text-ink/70"> / noche</span>
              </p>
            )}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
            onClick={() => booking.consultRoom(room.id)}
          >
            Elegir fechas
          </button>
        </div>
      </div>
      {open && total > 0 ? (
        <Lightbox images={room.images} index={index} title={room.name} onClose={() => setOpen(false)} onIndex={setIndex} />
      ) : null}
    </article>
  );
}
