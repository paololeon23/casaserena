import { brand, showingExamples } from "../config/site";

const checklist = [
  "Confirmar el WhatsApp y el prefijo +51.",
  "Escribir la dirección real y el mapa.",
  "Agregar la portada y las fotos.",
  "Reemplazar las habitaciones de ejemplo.",
  "Completar horarios de ingreso y salida.",
  "Redactar reserva y cancelación.",
  "Agregar el correo, si existe.",
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {showingExamples() ? (
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">Antes de publicar</p>
            <ul className="mt-5 grid gap-x-10 gap-y-2 text-sm text-white/90 sm:grid-cols-2">
              {checklist.map((item) => (
                <li key={item} className="border-t border-white/10 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/logo-mark.png" alt="" className="h-16 w-12 object-contain brightness-0 invert" width={447} height={602} />
          <p className="mt-4 font-display text-4xl uppercase tracking-[0.12em]">Casa Serena</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
            Esta página no confirma la reserva. La disponibilidad y el precio los responde el encargado.
          </p>
        </div>
        <div className="text-sm">
          <a className="underline decoration-white/30 underline-offset-4" href={brand.tiktokUrl} target="_blank" rel="noreferrer">
            @{brand.tiktokHandle}
          </a>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/80">Otuzco, Perú</p>
        </div>
      </div>
    </footer>
  );
}
