import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { showingExamples } from "../config/site";
import { cn, scrollToId } from "../lib/ui";

const links = [
  { id: "habitaciones", label: "Habitaciones" },
  { id: "reservar", label: "Fechas" },
  { id: "ubicacion", label: "Mapa" },
  { id: "terminos", label: "Términos" },
  { id: "preguntas", label: "Preguntas" },
  { id: "contacto", label: "Contacto" },
];

const topLinks = links.slice(0, 3);

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40">
        {showingExamples() ? (
          <div className="bg-ink px-5 py-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-white" role="status">
            Borrador · completa los datos reales antes de publicar
          </div>
        ) : null}
        <header
          className={cn(
            "transition-[background-color,box-shadow] duration-300",
            scrolled ? "bg-[#546C4C] text-white shadow-sm" : "bg-transparent text-white",
          )}
        >
          <div
            className={cn(
              "mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8",
              scrolled ? "py-3" : "py-3.5 sm:py-5",
            )}
          >
            <a
              href="#inicio"
              className="flex min-w-0 items-center gap-0.5 sm:gap-1.5"
              onClick={() => setOpen(false)}
            >
              <img
                src="/logo-casa-serena.png"
                alt=""
                width={220}
                height={300}
                className={cn(
                  "-mr-0.5 shrink-0 object-contain object-center mix-blend-screen transition-[height,width] duration-300",
                  scrolled
                    ? "h-11 w-9 sm:h-12 sm:w-10"
                    : "h-11 w-9 sm:h-16 sm:w-12 lg:h-20 lg:w-16",
                )}
              />
              <span
                className={cn(
                  "whitespace-nowrap font-display leading-none tracking-[-0.04em] transition-[font-size] duration-300",
                  scrolled
                    ? "text-[1.95rem] sm:text-3xl md:text-4xl"
                    : "text-[2rem] sm:text-5xl lg:text-6xl xl:text-7xl",
                )}
              >
                Casa Serena
              </span>
            </a>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
              <nav className="hidden items-center gap-6 lg:flex" aria-label="Secciones">
                {topLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/85 transition hover:text-white"
                    onClick={() => go(link.id)}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <button
                type="button"
                className={cn(
                  "rounded-full px-3 py-2.5 text-[12px] font-medium transition sm:px-4 sm:text-[13px]",
                  scrolled ? "bg-white text-[#546C4C]" : "bg-ink text-white",
                )}
                onClick={() => go("reservar")}
              >
                Reservar
              </button>

              <button
                type="button"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                  scrolled
                    ? "border-white text-white"
                    : "border-white/70 bg-black/20 text-white",
                )}
                aria-expanded={open}
                aria-controls="menu-lateral"
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setOpen((value) => !value)}
              >
                <Menu aria-hidden="true" size={20} strokeWidth={2} className="text-white" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 transition-[visibility] duration-300",
          open ? "visible" : "invisible pointer-events-none",
        )}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-[#1c2618]/45 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />

        <aside
          id="menu-lateral"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-[#546C4C] text-white shadow-[-18px_0_50px_-28px_rgba(28,38,24,0.55)] transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          aria-hidden={!open}
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <div className="flex min-w-0 items-center gap-1">
              <img
                src="/logo-casa-serena.png"
                alt=""
                width={220}
                height={300}
                className="h-10 w-8 shrink-0 object-contain mix-blend-screen"
              />
              <p className="font-display text-2xl tracking-[-0.03em]">Casa Serena</p>
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-2" aria-label="Menú">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className="block w-full border-b border-white/15 py-4 text-left text-[13px] font-medium uppercase tracking-[0.18em] text-white/90 transition last:border-0 hover:text-white"
                onClick={() => go(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/15 p-5">
            <button
              type="button"
              className="w-full rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#546C4C]"
              onClick={() => go("reservar")}
            >
              Reservar
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
