import { extraAmenities, highlights } from "../config/site";
import { Container, PendingNote, SectionHeading } from "./ui";

export function Amenities() {
  return (
    <section id="servicios" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Lo publicado" title="Servicios" text="Solo está lo que el perfil confirma." />
        <ol className="mt-12 border-t border-line">
          {highlights.map((item, index) => (
            <li key={item.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[4.5rem_1fr_1.2fr] sm:items-baseline sm:gap-6">
              <span className="font-display text-2xl italic text-ink/40">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-3xl tracking-[-0.03em]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          {extraAmenities.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {extraAmenities.map((item) => (
                <li key={item} className="rounded-full border border-line bg-white px-4 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <PendingNote>Otros servicios se muestran aquí cuando el propietario los confirme.</PendingNote>
          )}
        </div>
      </Container>
    </section>
  );
}