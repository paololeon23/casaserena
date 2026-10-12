import { brand, contact, mapsDirectionsUrl, mapsEmbedSrc } from "../config/site";
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
          text={`${brand.name} está en Otuzco. El mapa muestra la ciudad. La dirección de la puerta se confirma al reservar.`}
        />
        <div className="mx-auto mt-12 max-w-3xl text-center">
          {contact.address ? (
            <p className="font-display text-4xl tracking-[-0.03em]">{contact.address}</p>
          ) : (
            <PendingNote>Dirección pendiente. No se usó una ubicación aproximada.</PendingNote>
          )}
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
            No hay una calle publicada en las fotos ni en los videos, así que el mapa no marca una puerta inventada.
          </p>
          <div className="mt-8 min-h-[420px] overflow-hidden rounded-[1.4rem] bg-[#E7EEE3] text-left text-ink">
            {embed ? (
              <iframe
                title="Mapa de Otuzco, donde está Casa Serena"
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
      </Container>
    </section>
  );
}