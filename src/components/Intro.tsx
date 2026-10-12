import { brand } from "../config/site";
import { Container } from "./ui";

export function Intro() {
  return (
    <section className="scroll-mt-24 pb-24 pt-16 md:pb-32 md:pt-24" aria-labelledby="presentacion-titulo">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55">El alojamiento</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <h2 id="presentacion-titulo" className="max-w-xl font-display text-4xl leading-[1.02] tracking-[-0.03em] sm:text-6xl">
            Una experiencia <span className="italic">distinta</span> en Otuzco.
          </h2>
          <div>
            <p className="text-lg leading-relaxed text-ink/75">{brand.bio}</p>
            <a
              className="mt-5 inline-flex text-sm font-medium underline decoration-ink/30 underline-offset-4"
              href={brand.tiktokUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{brand.tiktokHandle}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
