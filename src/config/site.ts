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
  latitude: -7.9035368,
  longitude: -78.5629959,
  mapEmbedUrl: "https://maps.google.com/maps?q=-7.9035368,-78.5629959&z=17&output=embed",
  googleMapsUrl: "https://maps.app.goo.gl/a7vh6eCLc6vVzhTj8",
};

/**
 * Aplicación web de Google Apps Script.
 * La página lee la hoja Calendario y guarda cada consulta en la hoja Registros.
 */
export const appsScriptUrl =
  "https://script.google.com/macros/s/AKfycby0Byjy1GYKkWRqTsEwftYUmiEHRDnYoN9UaSxB4PZkUe9k5XW0WMjaev5AwuLhrDov/exec";

export const stay = {
  checkInTime: "",
  checkOutTime: "",
  reservationPolicy: "",
  cancellationPolicy: "",
};

/** El formulario admite de 2 a 4 personas. */
export const formMinGuests = 2;
export const formMaxGuests = 4;
export const defaultGuests = 2;
export const currency = "PEN";

/**
 * Si realRooms tiene fichas, esas son las que se publican.
 * Los ejemplos solo aparecen cuando realRooms está vacío y esta bandera es true.
 * Ponla en false antes de publicar si aún no cargas habitaciones reales.
 */
export const showExampleRooms = false;

export const heroImage = "/media/aura/01.jpg";
export const heroImageAlt = "Habitación matrimonial AURA de Casa Serena, con una cama amplia y luz de la ventana.";

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
    id: "aura",
    isExample: false,
    name: "AURA",
    kind: "Matrimonial",
    summary: "Una cama matrimonial, baño privado, TV y un rincón con cafetera. Para 2 personas.",
    capacity: 2,
    bedType: "Una cama matrimonial",
    amenities: ["Cama matrimonial", "Baño privado", "TV", "Cafetera"],
    pricePerNight: null,
    images: [
      { src: "/media/aura/01.jpg", alt: "Habitación AURA con cama matrimonial, mesa y ventana." },
      { src: "/media/aura/04.jpg", alt: "Baño de la habitación AURA, con lavatorio y espejo iluminado." },
      { src: "/media/aura/03.jpg", alt: "Televisor de la habitación AURA." },
      { src: "/media/aura/02.jpg", alt: "Mesa y cafetera de la habitación AURA." },
    ],
  },
  {
    id: "alma",
    isExample: false,
    name: "ALMA",
    kind: "Doble",
    summary: "Dos camas, baño privado y un sillón. Para 2 personas.",
    capacity: 2,
    bedType: "Dos camas",
    amenities: ["Dos camas", "Baño privado", "Sillón"],
    pricePerNight: null,
    images: [
      { src: "/media/alma/01.jpg", alt: "Habitación ALMA con dos camas, cuadros y un sillón." },
      { src: "/media/alma/04.jpg", alt: "Las dos camas de la habitación ALMA." },
      { src: "/media/alma/02.jpg", alt: "Baño de la habitación ALMA, con lavatorio e inodoro." },
      { src: "/media/alma/03.jpg", alt: "Sillón de la habitación ALMA." },
    ],
  },
];

export const exampleRooms: Room[] = [
  {
    id: "ejemplo-1",
    isExample: true,
    kind: "Ejemplo",
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
    kind: "Ejemplo",
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
    text: "El mapa de esta página marca el punto exacto publicado por Casa Serena.",
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
      "Una noche tachada está reservada. No se muestra el nombre de quien la tomó. La salida no se duerme: del 14 al 16 se ocupan el 14 y el 15. La reserva queda firme cuando Casa Serena la confirma por WhatsApp.",
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
