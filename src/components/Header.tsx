import { useState } from "react";
import { Menu, X } from "lucide-react";
import { brand, showingExamples } from "../config/site";
import { scrollToId } from "../lib/ui";

const links = [
  { id: "habitaciones", label: "Habitación" },
  { id: "reservar", label: "Fechas" },
  { id: "ubicacion", label: "Mapa" },
  { id: "terminos", label: "Términos" },
  { id: "preguntas", label: "Preguntas" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  function go(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <div className="sticky top-0 z-40">
      {showingExamples() ? (
        <div className="bg-ink px-5 py-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-white" role="status">
          Borrador · completa los datos reales antes de publicar
        </div>
      ) : null}
      <header className="border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#inicio" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <img src="/logo-mark.png" alt="" className="h-11 w-9 object-contain" width={447} height={602} />
            <span className="truncate font-display text-[0.95rem] uppercase leading-none tracking-[0.08em] sm:text-[1.35rem] sm:tracking-[0.14em]">
              {brand.shortName}
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Secciones">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className="text-[13px] font-medium tracking-wide text-ink/70 transition hover:text-ink"
                onClick={() => go(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white"
              onClick={() => go("reservar")}
            >
              Reservar
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
            </button>
          </div>
        </div>
        {open ? (
          <nav id="menu-movil" className="border-t border-line px-5 py-2 lg:hidden" aria-label="Secciones móviles">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className="block w-full border-b border-line/70 py-3.5 text-left font-display text-2xl tracking-[-0.03em] last:border-0"
                onClick={() => go(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        ) : null}
      </header>
    </div>
  );
}
