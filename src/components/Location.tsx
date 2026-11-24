import { contact, mapsDirectionsUrl, mapsEmbedSrc } from "../config/site";
import { Container, PendingNote } from "./ui";

export function Location() {
  const embed = mapsEmbedSrc();
  const directions = mapsDirectionsUrl();

  return (
    <section id="ubicacion" className="scroll-mt-24 bg-white pb-8 pt-6 md:pb-10 md:pt-8">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.35fr)] lg:gap-12">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60">
              <span className="h-px w-8 bg-ink" aria-hidden="true" />
              Dónde queda
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl">
              Otuzco
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Este es el punto exacto de Casa Serena en Otuzco.
            </p>

            <div className="mt-8 border-t border-line pt-8">
              {contact.address ? (
                <p className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">{contact.address}</p>
              ) : (
                <PendingNote>Dirección pendiente. No se usó una ubicación aproximada.</PendingNote>
              )}
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                El mapa usa el punto que Casa Serena compartió. La llegada se coordina por WhatsApp si hace falta un detalle más.
              </p>
            </div>
          </div>

          <div>
            <div className="min-h-[360px] overflow-hidden rounded-[1.4rem] bg-[#E7EEE3] lg:min-h-[480px]">
              {embed ? (
                <iframe
                  title="Punto exacto de Casa Serena en Otuzco"
                  src={embed}
                  className="h-full min-h-[360px] w-full border-0 lg:min-h-[480px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full min-h-72 flex-col justify-end p-6">
                  <p className="font-display text-4xl italic tracking-[-0.03em]">Mapa por confirmar</p>
                  <p className="mt-3 max-w-xs text-sm">Faltan las coordenadas reales del alojamiento.</p>
                </div>
              )}
            </div>
            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white sm:w-auto"
              >
                Ver en Google Maps
              </a>
            ) : (
              <p className="mt-5 text-sm">Las indicaciones se activan al configurar la dirección.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
