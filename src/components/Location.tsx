import { contact, mapsDirectionsUrl, mapsEmbedSrc } from "../config/site";
import { Container, PendingNote, SectionHeading } from "./ui";

export function Location() {
  const embed = mapsEmbedSrc();
  const directions = mapsDirectionsUrl();

  return (
    <section id="ubicacion" className="scroll-mt-24 bg-white pb-8 pt-6 md:pb-10 md:pt-8">
      <Container>
        <SectionHeading
          eyebrow="Dónde queda"
          title="Otuzco"
          text="Este es el punto exacto de Casa Serena en Otuzco."
        />
        <div className="mt-10 xl:grid xl:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.4fr)] xl:items-center xl:gap-10 xl:text-left">
          <div className="text-center xl:text-left">
          {contact.address ? (
            <p className="font-display text-4xl tracking-[-0.03em]">{contact.address}</p>
          ) : (
            <PendingNote>Dirección pendiente. No se usó una ubicación aproximada.</PendingNote>
          )}
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed xl:mx-0">
            El mapa usa el punto que Casa Serena compartió. La llegada se coordina por WhatsApp si hace falta un detalle más.
          </p>
          </div>
          <div className="mt-8 text-center xl:mt-0">
            <div className="min-h-[420px] overflow-hidden rounded-[1.4rem] bg-[#E7EEE3] text-left text-ink">
              {embed ? (
                <iframe
                  title="Punto exacto de Casa Serena en Otuzco"
                  src={embed}
                  className="h-full min-h-[420px] w-full border-0"
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
                className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
              >
                Ver en Google Maps
              </a>
            ) : (
              <p className="mt-6 text-sm">Las indicaciones se activan al configurar la dirección.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}