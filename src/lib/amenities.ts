import {
  Armchair,
  Bath,
  BedDouble,
  Coffee,
  Shirt,
  ShowerHead,
  Tv,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { AmenityIcon } from "../types";

const icons: Record<AmenityIcon, LucideIcon> = {
  bed: BedDouble,
  bath: Bath,
  shower: ShowerHead,
  tv: Tv,
  coffee: Coffee,
  armchair: Armchair,
  users: Users,
  wifi: Wifi,
  closet: Shirt,
};

export function amenityIcon(name: AmenityIcon): LucideIcon {
  return icons[name];
}
