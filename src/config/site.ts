import type { FaqItem, Highlight, MediaImage, Room } from "../types";

/**
 * Casa Serena Otuzco — único archivo que el propietario debe editar.
 *
 * Datos tomados del perfil público de TikTok @casaserenaotuzco
 * (consulta del 12 de octubre de 2026):
 * - Nombre público: CASA.SERENA | AIRBNB OTUZCO
 * - Bio: “Una experiencia distinta en Otuzco. Confort, privacidad,
 *   detalles únicos. Ubicación privilegiada. Tu refugio exclusivo en Otuzco.”
 * - Reservas: 936020432
 *
 * Lo que el perfil no publica se deja vacío a propósito:
 * dirección, mapa, precios, camas, horarios y políticas.
 *
 * Fotos: guarda los archivos en public/media y escribe la ruta,
 * por ejemplo "/media/portada.jpg".
 * Los videos se cargan desde el reproductor oficial de TikTok.
 */

export const brand = {
  name: "Casa Serena Otuzco",
  shortName: "Casa Serena",
  publicName: "CASA.SERENA | AIRBNB OTUZCO",
  tagline: "Tu refugio en Otuzco",
  bio: "Una experiencia distinta en Otuzco. Confort, privacidad y detalles únicos. Tu refugio exclusivo en Otuzco.",
  cityLabel: "Otuzco, Perú",
  tiktokHandle: "casaserenaotuzco",
  tiktokUrl: "https://www.tiktok.com/@casaserenaotuzco",
  tiktokBioNote: "Texto publicado en la bio de TikTok @casaserenaotuzco.",
};

/**
 * Número local publicado en TikTok como “936020432 | Reservas”.
 * El 51 es el código de país de Perú, necesario para el enlace wa.me.
 * Déjalo en blanco si quieres ocultar WhatsApp hasta confirmarlo.
 */
export const whatsappCountryCode = "51";
export const whatsappLocalNumber = "936020432";
export const whatsappSource =
  "Bio pública de TikTok @casaserenaotuzco: 936020432 | Reservas. Se antepone +51 porque el número es de Perú.";

export const contact = {
  email: "",
  address: "Otuzco, La Libertad, Perú",
  latitude: null as number | null,
  longitude: null as number | null,
  mapEmbedUrl: "",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Otuzco%2C%20La%20Libertad%2C%20Per%C3%BA",
};

export const stay = {
  checkInTime: "",
  checkOutTime: "",
  reservationPolicy: "",
  cancellationPolicy: "",
};

/** Límite del formulario. No representa la capacidad real del alojamiento. */
export const formMaxGuests = 10;
export const defaultGuests = 2;
export const currency = "PEN";

/**
 * Si realRooms tiene fichas, esas son las que se publican.
 * Los ejemplos solo aparecen cuando realRooms está vacío y esta bandera es true.
 * Ponla en false antes de publicar si aún no cargas habitaciones reales.
 */
export const showExampleRooms = false;

export const heroImage = "/media/habitacion.jpg";
export const heroImageAlt =
  "Habitación doble de Casa Serena en Otuzco, con dos camas, luz natural y decoración en verde.";

export const gallery: MediaImage[] = [
  {
    src: "/media/habitacion.jpg",
    alt: "Habitación doble de Casa Serena con dos camas, espejos y luz de la ventana.",
  },
];

export const stayVideos = [
  {
    src: "/media/otuzco.mp4",
    poster: "/media/poster-otuzco.jpg",
    title: "Otuzco y la habitación",
    caption: "El pueblo y el lugar donde te quedas.",
  },
  {
    src: "/media/detalle.mp4",
    poster: "/media/poster-detalle.jpg",
    title: "El detalle",
    caption: "Si buscabas dónde quedarte en Otuzco, encontraste.",
  },
];

/** IDs de videos si más adelante se copian desde Compartir > Insertar en TikTok. */
export const tiktokVideoIds: string[] = [];

/** URL pública del sitio, cuando exista. Ejemplo: https://casaserenaotuzco.com */
export const publicUrl = "";

export const realRooms: Room[] = [
  {
    id: "doble",
    isExample: false,
    name: "Habitación doble",
    summary:
      "Si buscabas dónde quedarte en Otuzco, encontraste. Dos camas, decoración propia y baño privado.",
    capacity: 2,
    bedType: "Dos camas",
    amenities: ["Baño privado", "TV", "Decoración"],
    pricePerNight: null,
    images: [
      {
        src: "/media/habitacion.jpg",
        alt: "Habitación doble de Casa Serena con dos camas vestidas de blanco y verde.",
      },
    ],
  },
];

export const exampleRooms: Room[] = [
  {
    id: "ejemplo-1",
    isExample: true,
    name: "Habitación principal (ejemplo)",
    summary:
      "Ficha de ejemplo para revisar el diseño. Sustitúyela por el nombre, las fotos y los datos reales.",
    capacity: null,
    bedType: "",
    amenities: [],
    pricePerNight: null,
    images: [],
  },
  {
    id: "ejemplo-2",
    isExample: true,
    name: "Segunda habitación (ejemplo)",
    summary:
      "Segunda ficha de ejemplo. No describe una habitación real de Casa Serena.",
    capacity: null,
    bedType: "",
    amenities: [],
    pricePerNight: null,
    images: [],
  },
];

export const highlights: Highlight[] = [
  {
    title: "Confort",
    text: "Un espacio pensado para descansar.",
    source: "Bio de TikTok",
  },
  {
    title: "Privacidad",
    text: "La estadía se presenta con privacidad.",
    source: "Bio de TikTok",
  },
  {
    title: "Detalles únicos",
    text: "El perfil destaca el cuidado de los detalles.",
    source: "Bio de TikTok",
  },
  {
    title: "En Otuzco",
    text: "Se anuncia como un refugio en Otuzco. La dirección exacta todavía no está publicada en esta web.",
    source: "Bio de TikTok",
  },
];

/** Servicios adicionales confirmados por el propietario. No agregues nada que no ofrezcas. */
export const extraAmenities: string[] = [];

export const faqs: FaqItem[] = [
  {
    question: "¿Enviar el mensaje confirma mi reserva?",
    answer:
      "No. El mensaje solo abre WhatsApp para consultar. La reserva queda confirmada cuando Casa Serena responde y acepta las fechas.",
  },
  {
    question: "¿El calendario muestra noches libres?",
    answer:
      "Las fechas tachadas son un ejemplo de noches ocupadas, para que veas cómo se verá. No son reservas reales. La disponibilidad de verdad la confirma Casa Serena por WhatsApp.",
  },
  {
    question: "¿Puedo pagar por esta página?",
    answer:
      "No. Esta web no cobra ni crea una cuenta. El acuerdo de pago se conversa directamente por WhatsApp.",
  },
];

export function fullWhatsappNumber(): string {
  return `${whatsappCountryCode}${whatsappLocalNumber}`.replace(/\D/g, "");
}

export function whatsappDisplay(): string {
  const local = whatsappLocalNumber.replace(/\D/g, "");
  if (!local) return "";
  const grouped = local.match(/^(\d{3})(\d{3})(\d{3})$/);
  const pretty = grouped ? `${grouped[1]} ${grouped[2]} ${grouped[3]}` : local;
  return whatsappCountryCode ? `+${whatsappCountryCode} ${pretty}` : pretty;
}

export function publishedRooms(): Room[] {
  if (realRooms.length > 0) return realRooms;
  if (showExampleRooms) return exampleRooms;
  return [];
}

export function showingExamples(): boolean {
  return realRooms.length === 0 && showExampleRooms && exampleRooms.length > 0;
}

export function mapsDirectionsUrl(): string | null {
  if (contact.googleMapsUrl.trim()) return contact.googleMapsUrl.trim();
  if (contact.latitude != null && contact.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${contact.latitude},${contact.longitude}`;
  }
  if (contact.address.trim()) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address.trim())}`;
  }
  return null;
}

export function mapsEmbedSrc(): string | null {
  if (contact.mapEmbedUrl.trim()) return contact.mapEmbedUrl.trim();
  if (contact.latitude != null && contact.longitude != null) {
    return `https://maps.google.com/maps?q=${contact.latitude},${contact.longitude}&z=16&output=embed`;
  }
  if (contact.address.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(contact.address.trim())}&z=16&output=embed`;
  }
  return null;
}
