import { createContext, useContext, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import {
  defaultGuests,
  formMaxGuests,
  fullWhatsappNumber,
  publishedRooms,
} from "../config/site";
import { activeAvailabilityProvider, stayCrossesOccupied } from "../lib/availability";
import { buildReservationMessage, buildWhatsappLink, isWhatsappReady, validateBooking, type BookingIssue } from "../lib/booking";
import { addDays, applyDateSelection, todayISO } from "../lib/dates";
import { scrollToId } from "../lib/ui";

type BookingContextValue = {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  roomId: string;
  guestName: string;
  note: string;
  accepted: boolean;
  attempted: boolean;
  issues: BookingIssue[];
  message: string;
  href: string | null;
  whatsappReady: boolean;
  selectDate: (iso: string) => void;
  clearDates: () => void;
  setNights: (count: number) => void;
  dateNotice: string | null;
  setGuests: (value: number) => void;
  setRoomId: (id: string) => void;
  consultRoom: (id: string) => void;
  setGuestName: (value: string) => void;
  setNote: (value: string) => void;
  setAccepted: (value: boolean) => void;
  onReserveClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuestsState] = useState(defaultGuests);
  const [roomId, setRoomId] = useState(() => {
    const rooms = publishedRooms();
    return rooms.length === 1 ? rooms[0].id : "";
  });
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [dateNotice, setDateNotice] = useState<string | null>(null);
  const today = todayISO();

  function firstSelectable(from: string): string {
    let cursor = from;
    for (let step = 0; step < 60; step += 1) {
      if (activeAvailabilityProvider.statusFor(cursor, today) === "selectable") return cursor;
      cursor = addDays(cursor, 1);
    }
    return from;
  }

  const draft = useMemo(() => {
    const room = publishedRooms().find((item) => item.id === roomId);
    return {
      checkIn,
      checkOut,
      guests,
      roomName: room?.name ?? "",
      guestName,
      note,
      accepted,
      maxGuests: formMaxGuests,
    };
  }, [accepted, checkIn, checkOut, guestName, guests, note, roomId]);

  const liveIssues = useMemo(() => validateBooking(draft, today), [draft, today]);
  const message = useMemo(() => buildReservationMessage(draft), [draft]);
  const phone = fullWhatsappNumber();
  const whatsappReady = isWhatsappReady(phone);
  const href = whatsappReady && liveIssues.length === 0 ? buildWhatsappLink(phone, message) : null;

  const value = useMemo<BookingContextValue>(
    () => ({
      checkIn,
      checkOut,
      guests,
      roomId,
      guestName,
      note,
      accepted,
      attempted,
      issues: attempted ? liveIssues : [],
      message,
      href,
      whatsappReady,
      dateNotice,
      selectDate: (iso) => {
        const status = activeAvailabilityProvider.statusFor(iso, today);
        if (status === "past") return;
        if (status === "occupied") {
          setDateNotice("Esa noche está ocupada en el ejemplo. Elige otra.");
          return;
        }
        const next = applyDateSelection(checkIn, checkOut, iso, today);
        if (next.rejected || !next.checkIn) return;
        if (next.checkOut && stayCrossesOccupied(next.checkIn, next.checkOut, today)) {
          setCheckIn(next.checkIn);
          setCheckOut(null);
          setDateNotice("Esas noches cruzan una fecha ocupada. Elige otra salida.");
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
        const nights = Math.min(30, Math.max(1, count));
        const start =
          checkIn && activeAvailabilityProvider.statusFor(checkIn, today) === "selectable"
            ? checkIn
            : firstSelectable(today);
        const end = addDays(start, nights);
        if (stayCrossesOccupied(start, end, today)) {
          setCheckIn(start);
          setCheckOut(null);
          setDateNotice("Esas noches incluyen una fecha ocupada. Prueba con menos noches u otro ingreso.");
          return;
        }
        setDateNotice(null);
        setCheckIn(start);
        setCheckOut(end);
      },
      setGuests: (next) => setGuestsState(Math.min(formMaxGuests, Math.max(1, next))),
      setRoomId,
      consultRoom: (id) => {
        setRoomId(id);
        scrollToId("reservar");
      },
      setGuestName,
      setNote,
      setAccepted,
      onReserveClick: (event) => {
        if (whatsappReady && liveIssues.length === 0 && href) return;
        event.preventDefault();
        setAttempted(true);
        if (!whatsappReady) {
          scrollToId("contacto");
          return;
        }
        const field = liveIssues[0]?.field;
        const target =
          field === "guestName" ? "nombre" : field === "guests" ? "huespedes-reserva" : "noches-reserva";
        scrollToId(target);
        window.setTimeout(() => document.getElementById(target)?.focus(), 250);
      },
    }),
    [
      accepted,
      attempted,
      checkIn,
      checkOut,
      dateNotice,
      guestName,
      guests,
      href,
      liveIssues,
      message,
      note,
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
