import { useState } from "react";
import { faqs, stay } from "../config/site";
import { cn } from "../lib/ui";
import { Container, SectionHeading } from "./ui";

export function Faq() {
  const [open, setOpen] = useState(0);
  const items = [
    ...faqs,
    {
      question: "¿Cuál es el horario de ingreso y salida?",
      answer:
        stay.checkInTime || stay.checkOutTime
          ? `Ingreso: ${stay.checkInTime || "por confirmar"}. Salida: ${stay.checkOutTime || "por confirmar"}.`
          : "Los horarios todavía no están publicados. Confírmalos por WhatsApp.",
    },
    {
      question: "¿Dónde está Casa Serena?",
      answer:
        "En Otuzco, La Libertad. El mapa de la página marca el punto exacto de Casa Serena.",
    },
  ];

  return (
    <section id="preguntas" className="scroll-mt-24 pb-16 pt-6 md:pb-20 md:pt-8">
      <Container>
        <SectionHeading eyebrow="Antes de escribir" title="Preguntas" />
        <div className="mt-10 border-t border-line">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="font-display text-xl tracking-[-0.02em] sm:text-2xl">{item.question}</span>
                  <span className={cn("font-display text-2xl italic text-ink/40", isOpen && "text-ink")} aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen ? <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink/70">{item.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}