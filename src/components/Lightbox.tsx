import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaImage } from "../types";

type LightboxProps = {
  images: MediaImage[];
  index: number;
  title: string;
  onClose: () => void;
  onIndex: (index: number) => void;
};

export function Lightbox({ images, index, title, onClose, onIndex }: LightboxProps) {
  const image = images[index];
  const total = images.length;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndex((index + 1) % total);
      if (event.key === "ArrowLeft") onIndex((index - 1 + total) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onIndex, total]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#243024] text-white" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm">
          {title} · {index + 1} de {total}
        </p>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20" onClick={onClose} aria-label="Cerrar fotos">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
        {total > 1 ? (
          <button
            type="button"
            className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"
            aria-label="Foto anterior"
            onClick={() => onIndex((index - 1 + total) % total)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        ) : null}
        <img src={image.src} alt={image.alt} className="max-h-full max-w-full object-contain" />
        {total > 1 ? (
          <button
            type="button"
            className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"
            aria-label="Foto siguiente"
            onClick={() => onIndex((index + 1) % total)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
