import { useState } from "react";
import { scrollToId } from "../lib/ui";

const frases = ["Hola, bienvenido.", "Tu refugio en Otuzco.", "Elige la fecha libre."];

export function SearchBar() {
  const [frase, setFrase] = useState(0);
  const texto = frases[frase] ?? frases[0];

  return (
    <form
      className="rounded-[1.6rem] border border-white/70 bg-white p-2 text-ink shadow-[0_24px_60px_-32px_rgba(84,108,76,0.45)] lg:flex lg:items-center lg:gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        scrollToId("reservar");
      }}
    >
      <button
        type="button"
        className="min-w-0 flex-1 rounded-2xl px-4 py-3 text-left transition hover:bg-paper"
        aria-live="polite"
        onClick={() => setFrase((actual) => (actual + 1) % frases.length)}
      >
        <span className="block font-display text-2xl tracking-[-0.03em] sm:text-3xl">{texto}</span>
        <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60">Toca para otra frase</span>
      </button>
      <button type="submit" className="mt-1 w-full rounded-2xl bg-ink px-6 py-3.5 text-sm font-medium text-white lg:mt-0 lg:w-auto lg:shrink-0">
        Ver el calendario
      </button>
    </form>
  );
}
