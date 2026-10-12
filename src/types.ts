export type MediaImage = {
  src: string;
  alt: string;
};

export type Room = {
  id: string;
  isExample: boolean;
  name: string;
  summary: string;
  capacity: number | null;
  bedType: string;
  amenities: string[];
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
