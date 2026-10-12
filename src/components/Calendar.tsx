import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { activeAvailabilityProvider } from "../lib/availability";
import { useBooking } from "../context/BookingContext";
import {
  addDays,
  dayNumber,
  formatLong,
  formatMonth,
  isInRange,
  monthWeeks,
  shiftMonth,
  todayISO,
} from "../lib/dates";
import { cn } from "../lib/ui";

const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type CalendarProps = {
  checkIn: string | null;
  checkOut: string | null;
  onSelect: (iso: string) => void;
};

export function Calendar({ checkIn, checkOut, onSelect }: CalendarProps) {
  const today = todayISO();
  const booking = useBooking();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setMonths(media.matches ? 2 : 1);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const min = new Date();
  min.setDate(1);
  const max = new Date(min.getFullYear(), min.getMonth() + 16, 1);
  const cursorDate = new Date(cursor.year, cursor.month, 1);
  const canPrev = cursorDate > min;
  const nextCursor = shiftMonth(cursor.year, cursor.month, 1);
  const canNext = new Date(nextCursor.year, nextCursor.month, 1) <= max;

  function moveFocus(iso: string, step: number) {
    const next = addDays(iso, step);
    document.getElementById(`dia-${next}`)?.focus();
  }

  function renderMonth(year: number, month: number) {
    return (
      <div key={`${year}-${month}`}>
        <h3 className="mb-3 text-center font-display text-2xl">{formatMonth(year, month)}</h3>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold uppercase tracking-wide text-ink/70">
          {weekdays.map((day) => (
            <div key={day} aria-hidden="true">
              {day}
            </div>
          ))}
        </div>
        <div role="grid" aria-label={formatMonth(year, month)} className="mt-2 grid grid-cols-7">
          {monthWeeks(year, month).flat().map((iso, index) => {
            if (!iso) return <div key={`empty-${year}-${month}-${index}`} />;
            const status = activeAvailabilityProvider.statusFor(iso, today);
            const past = status === "past";
            const occupied = status === "occupied";
            const blocked = past || occupied;
            const start = iso === checkIn;
            const end = iso === checkOut;
            const inside = isInRange(iso, checkIn, checkOut);
            const isToday = iso === today;
            const labelParts = [formatLong(iso)];
            if (past) labelParts.push("fecha pasada, no se puede seleccionar");
            else if (occupied) labelParts.push("noche ocupada de ejemplo, no se puede seleccionar");
            else if (start) labelParts.push("fecha de ingreso");
            else if (end) labelParts.push("fecha de salida");
            else if (inside) labelParts.push("dentro de las noches elegidas");
            else labelParts.push("seleccionar");
            if (isToday) labelParts.push("hoy");

            return (
              <div
                key={iso}
                className={cn(
                  "py-0.5",
                  (inside || start || end) && checkOut && "bg-ink/5",
                  start && "rounded-l-full",
                  end && "rounded-r-full",
                )}
              >
                <button
                  id={`dia-${iso}`}
                  type="button"
                  role="gridcell"
                  aria-disabled={blocked}
                  aria-pressed={start || end}
                  aria-label={labelParts.join(", ")}
                  className={cn(
                    "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                    past && "cursor-not-allowed text-ink/30",
                    occupied && "cursor-not-allowed bg-[#E7EEE3] text-ink/45 line-through",
                    (start || end) && "bg-ink text-white",
                    !blocked && !start && !end && "hover:bg-paper",
                    isToday && !start && !end && !occupied && "ring-1 ring-ink",
                  )}
                  onClick={() => {
                    if (!blocked) onSelect(iso);
                  }}
                  onKeyDown={(event) => {
                    const steps: Record<string, number> = {
                      ArrowLeft: -1,
                      ArrowRight: 1,
                      ArrowUp: -7,
                      ArrowDown: 7,
                    };
                    const step = steps[event.key];
                    if (!step) return;
                    event.preventDefault();
                    moveFocus(iso, step);
                  }}
                >
                  {dayNumber(iso)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const visible = [cursor];
  if (months === 2) visible.push(nextCursor);

  return (
    <div className="rounded-[1.4rem] border border-line bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line disabled:opacity-30"
          aria-label="Mes anterior"
          disabled={!canPrev}
          onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <p className="text-center text-sm">Elige ingreso y salida</p>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line disabled:opacity-30"
          aria-label="Mes siguiente"
          disabled={!canNext}
          onClick={() => canNext && setCursor(nextCursor)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className={cn("grid gap-8", months === 2 && "md:grid-cols-2")}>
        {visible.map((item) => renderMonth(item.year, item.month))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">1</span>
          Tu fecha
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E7EEE3] text-[10px] line-through">2</span>
          Ocupada, ejemplo
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-ink text-[10px]">3</span>
          Hoy
        </li>
      </ul>
      {booking.dateNotice ? (
        <p className="mt-3 text-sm font-medium" role="status">
          {booking.dateNotice}
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed">
        Las noches tachadas son un ejemplo para ver el calendario. No son reservas reales. Casa Serena confirma la disponibilidad por WhatsApp.
      </p>
    </div>
  );
}
