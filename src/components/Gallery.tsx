import { useState } from "react";
import { gallery } from "../config/site";
import { Lightbox } from "./Lightbox";
import { Photo } from "./Photo";
import { Container, SectionHeading } from "./ui";

const frames = ["01", "02", "03"];

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <section id="galeria" className="scroll-mt-24 bg-white pb-24 md:pb-32">
      <Container>
        <SectionHeading
          eyebrow="El lugar"
          title="Galería"
          text="Las fotografías propias se abren a pantalla completa. Mientras llegan, los videos oficiales están en TikTok."
        />
        {gallery.length === 0 ? (
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {frames.map((frame) => (
                <div key={frame} className="aspect-[4/5] overflow-hidden rounded-[1.2rem] first:col-span-2 md:first:col-span-1 md:aspect-[3/4]">
                  <Photo alt={`Espacio ${frame} de la galería, fotografía por llegar`} mark={frame} />
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/65">
              Aún no hay fotos cargadas. Van en public/media y se registran en la configuración.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((image, imageIndex) => (
              <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                <Photo src={image.src} alt={image.alt} />
                <button
                  type="button"
                  className="absolute inset-0"
                  aria-label={`Ampliar ${image.alt}`}
                  onClick={() => {
                    setIndex(imageIndex);
                    setOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Container>
      {open ? (
        <Lightbox images={gallery} index={index} title="Galería de Casa Serena" onClose={() => setOpen(false)} onIndex={setIndex} />
      ) : null}
    </section>
  );
}
