import { useState } from "react";
import { currency } from "../config/site";
import { useBooking } from "../context/BookingContext";
import { amenityIcon } from "../lib/amenities";
import { formatMoney } from "../lib/booking";
import type { Room } from "../types";
import { Lightbox } from "./Lightbox";
import { Photo } from "./Photo";

export function RoomCard({ room, mark }: { room: Room; mark: string }) {
  const booking = useBooking();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const total = room.images.length;

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-line bg-white">
      <div className="grid grid-cols-2 gap-0.5 bg-[#E7EEE3] xl:grid-cols-4">
        {total > 0 ? (
          room.images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              className="relative aspect-[3/4] overflow-hidden xl:aspect-[4/5]"
              aria-label={`Abrir foto ${imageIndex + 1} de ${room.name}`}
              onClick={() => {
                setIndex(imageIndex);
                setOpen(true);
              }}
            >
              <Photo src={image.src} alt={image.alt} mark={imageIndex === 0 ? mark : undefined} priority={imageIndex === 0} />
            </button>
          ))
        ) : (
          <div className="col-span-2 aspect-[4/3] xl:col-span-4 xl:aspect-[4/5]">
            <Photo alt={`Fotografía pendiente de ${room.name}`} mark={mark} />
          </div>
        )}
      </div>
      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)_minmax(220px,0.85fr)] xl:items-start xl:gap-8">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ink/70 sm:text-base">{room.kind}</p>
          <h3 className="mt-1 font-display text-[2.35rem] leading-none tracking-[-0.03em] sm:text-5xl">{room.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{room.summary}</p>
          <p className="mt-4 text-sm font-medium">
            {room.capacity == null ? "Capacidad por completar" : `Hasta ${room.capacity} personas`}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">Tu reserva incluye</p>
          {room.amenities.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {room.amenities.map((item) => {
                const Icon = amenityIcon(item.icon);
                return (
                  <li key={item.label} className="flex min-w-0 items-center gap-3 text-sm text-ink">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#546C4C]" strokeWidth={1.5} />
                    <span className="min-w-0 leading-snug">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-ink/70">Por completar</p>
          )}
        </div>
        <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between xl:flex-col xl:items-stretch xl:border-t-0 xl:pt-0">
          <div className="min-w-0">
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
            className="w-full shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white sm:w-auto xl:w-full"
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
