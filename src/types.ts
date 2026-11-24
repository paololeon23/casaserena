export type MediaImage = {
  src: string;
  alt: string;
};

export type AmenityIcon = "bed" | "bath" | "shower" | "tv" | "coffee" | "armchair" | "users" | "wifi" | "closet";

export type RoomAmenity = {
  label: string;
  icon: AmenityIcon;
};

export type Room = {
  id: string;
  isExample: boolean;
  name: string;
  kind: string;
  summary: string;
  capacity: number | null;
  bedType: string;
  amenities: RoomAmenity[];
  pricePerNight: number | null;
  images: MediaImage[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Highlight = {
  title: string;
  text: string;
  source: string;
};
