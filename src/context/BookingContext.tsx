import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { appsScriptUrl, defaultGuests, formMaxGuests, formMinGuests, fullWhatsappNumber, publishedRooms } from "../config/site";
import { stayCrossesOccupied } from "../lib/availability";
import { buildReservationMessage, buildWhatsappLink, isWhatsappReady, stayNights, validateBooking, type BookingIssue } from "../lib/booking";
import { addDays, applyDateSelection, todayISO } from "../lib/dates";
import { fechaParaHoja, fetchOccupied, sendRegistro, type OccupiedByRoom } from "../lib/sheet";
import { scrollToId } from "../lib/ui";

type CalendarState = "cargando" | "listo" | "sin-enlace" | "error";

type BookingContextValue = {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  roomId: string;
  guestName: string;
  dni: string;
  phone: string;
  attempted: boolean;
  issues: BookingIssue[];
  message: string;
  href: string | null;
  whatsappReady: boolean;
  selectDate: (iso: string) => void;
  clearDates: () => void;
  setNights: (count: number) => void;
  dateNotice: string | null;
  calendarState: CalendarState;
  occupiedNights: string[];
  setGuests: (value: number) => void;
  setRoomId: (id: string) => void;
  consultRoom: (id: string) => void;
  setGuestName: (value: string) => void;
  setDni: (value: string) => void;
  setPhone: (value: string) => void;
  onReserveClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

function clampGuests(value: number): number {
  return Math.min(formMaxGuests, Math.max(formMinGuests, value));
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuestsState] = useState(defaultGuests);
  const [roomId, setRoomIdState] = useState("");
  const [guestName, setGuestName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [dateNotice, setDateNotice] = useState<string | null>(null);
  const [occupied, setOccupied] = useState({} as OccupiedByRoom);
  const initialCalendar: CalendarState = appsScriptUrl ? "cargando" : "sin-enlace";
  const [calendarState, setCalendarState] = useState<"cargando" | "listo" | "sin-enlace" | "error">(initialCalendar);
  const today = todayISO();
  const occupiedNights = occupied[roomId] ?? [];

  useEffect(() => {
    if (!appsScriptUrl) return;
    let stop = false;
    async function load() {
      try {
        const data = await fetchOccupied(appsScriptUrl);
        if (stop) return;
        setOccupied(data.habitaciones);
        setCalendarState("listo");
      } catch {
        if (!stop) setCalendarState("error");
      }
    }
    void load();
    const timer = window.setInterval(() => void load(), 45000);
    window.addEventListener("focus", load);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, []);

  useEffect(() => {
    if (checkIn && checkOut && stayCrossesOccupied(checkIn, checkOut, occupiedNights)) {
      setCheckOut(null);
      setDateNotice("Esas noches ya están reservadas. Elige otra salida.");
    }
  }, [checkIn, checkOut, occupiedNights]);

  const draft = useMemo(() => {
    const room = publishedRooms().find((item) => item.id === roomId);
    return {
      checkIn,
      checkOut,
      guests,
      roomId,
      roomName: room ? `${room.name} (${room.kind})` : "",
      guestName,
      dni,
      phone,
      maxGuests: formMaxGuests,
      occupied: occupiedNights,
    };
  }, [checkIn, checkOut, dni, guestName, guests, occupiedNights, phone, roomId]);

  const liveIssues = useMemo(() => validateBooking(draft, today), [draft, today]);
  const message = useMemo(() => buildReservationMessage(draft), [draft]);
  const businessPhone = fullWhatsappNumber();
  const whatsappReady = isWhatsappReady(businessPhone);
  const href = whatsappReady && liveIssues.length === 0 ? buildWhatsappLink(businessPhone, message) : null;

  const value = useMemo(() => {
    const next: BookingContextValue = {
      checkIn,
      checkOut,
      guests,
      roomId,
      guestName,
      dni,
      phone,
      attempted,
      issues: attempted ? liveIssues : [],
      message,
      href,
      whatsappReady,
      dateNotice,
      calendarState,
      occupiedNights,
      selectDate: (iso) => {
        if (iso < today) return;
        if (occupiedNights.includes(iso)) {
          setDateNotice("Esa noche está reservada. Elige otra.");
          return;
        }
        const next = applyDateSelection(checkIn, checkOut, iso, today);
        if (next.rejected || !next.checkIn) return;
        if (next.checkOut && stayCrossesOccupied(next.checkIn, next.checkOut, occupiedNights)) {
          setCheckIn(next.checkIn);
          setCheckOut(null);
          setDateNotice("Esas noches cruzan una fecha reservada. Elige otra salida.");
          return;
        }
        setDateNotice(null);
        setCheckIn(next.checkIn);
        setCheckOut(next.checkOut);
      },
      clearDates: () => {
        setCheckIn(null);
        setCheckOut(null);
        setDateNotice(null);
      },
      setNights: (count) => {
        if (!checkIn) {
          setDateNotice("Primero elige el día en que llegas. Las noches se cuentan desde esa fecha, no desde hoy.");
          scrollToId("reservar");
          return;
        }
        const nights = Math.min(30, Math.max(1, count));
        const end = addDays(checkIn, nights);
        if (stayCrossesOccupied(checkIn, end, occupiedNights)) {
          setCheckOut(null);
          setDateNotice("Esas noches incluyen una fecha reservada. Prueba con menos noches u otra llegada.");
          return;
        }
        setDateNotice(null);
        setCheckOut(end);
      },
      setGuests: (next) => setGuestsState(clampGuests(next)),
      setRoomId: (id) => {
        const blocked = occupied[id] ?? [];
        setRoomIdState(id);
        setGuestsState((current) => clampGuests(current));
        if (checkIn && checkOut && stayCrossesOccupied(checkIn, checkOut, blocked)) {
          setCheckOut(null);
          setDateNotice("En esta habitación esas noches ya están reservadas. Elige otra salida.");
        }
      },
      consultRoom: (id) => {
        const blocked = occupied[id] ?? [];
        setRoomIdState(id);
        setGuestsState((current) => clampGuests(current));
        if (checkIn && checkOut && stayCrossesOccupied(checkIn, checkOut, blocked)) {
          setCheckOut(null);
          setDateNotice("En esta habitación esas noches ya están reservadas. Elige otra salida.");
        }
        scrollToId("reservar");
      },
      setGuestName,
      setDni: (value) => setDni(value.replace(/\D/g, "").slice(0, 8)),
      setPhone: (value) => setPhone(value.replace(/\D/g, "").slice(0, 9)),
      onReserveClick: (event) => {
        if (whatsappReady && liveIssues.length === 0 && href) {
          const nights = stayNights(draft);
          sendRegistro(appsScriptUrl, {
            nombre: draft.guestName.trim(),
            dni: draft.dni,
            celular: draft.phone,
            habitacion: draft.roomName,
            fecha: draft.checkIn ? fechaParaHoja(draft.checkIn) : "",
            fechaFin: draft.checkOut ? fechaParaHoja(draft.checkOut) : "",
            huespedes: String(draft.guests),
            noches: nights == null ? "" : String(nights),
          });
          return;
        }
        event.preventDefault();
        setAttempted(true);
        if (!whatsappReady) {
          scrollToId("contacto");
          return;
        }
        const field = liveIssues[0]?.field;
        const target =
          field === "guestName"
            ? "nombre"
            : field === "dni"
              ? "dni"
              : field === "phone"
                ? "celular"
                : field === "guests"
                  ? "huespedes-reserva"
                  : field === "roomId"
                    ? "habitaciones-reserva"
                    : "calendario";
        scrollToId(target);
        window.setTimeout(() => document.getElementById(target)?.focus(), 250);
      },
    };
    return next;
  }, [
      attempted,
      calendarState,
      checkIn,
      checkOut,
      dateNotice,
      dni,
      draft,
      guestName,
      guests,
      href,
      liveIssues,
      message,
      occupied,
      occupiedNights,
      phone,
      roomId,
      today,
      whatsappReady,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking debe usarse dentro de BookingProvider");
  return value;
}
