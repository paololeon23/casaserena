import { useEffect } from "react";
import { brand, tiktokVideoIds } from "../config/site";
import { Container } from "./ui";

export function TikTokSection() {
  useEffect(() => {
    const src = "https://www.tiktok.com/embed.js";
    document.querySelector(`script[src="${src}"]`)?.remove();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section id="tiktok" className="scroll-mt-24 bg-paper py-24 text-ink md:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em]">
              <span className="h-px w-8 bg-ink" aria-hidden="true" />
              Desde TikTok
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">
              El alojamiento, <span className="italic">en video</span>
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed">
              El reproductor oficial de @{brand.tiktokHandle} muestra las imágenes reales publicadas por Casa Serena.
            </p>
            <a
              href={brand.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full border border-ink px-5 py-3 text-sm font-medium"
            >
              Abrir perfil
            </a>
          </div>
          <div className="overflow-hidden rounded-[1.4rem] bg-white p-2 text-ink sm:p-3">
            {tiktokVideoIds.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {tiktokVideoIds.map((id) => (
                  <blockquote
                    key={id}
                    className="tiktok-embed"
                    cite={`https://www.tiktok.com/@${brand.tiktokHandle}/video/${id}`}
                    data-video-id={id}
                    style={{ maxWidth: "605px", minWidth: "280px" }}
                  >
                    <section>
                      <a target="_blank" rel="noreferrer" href={`https://www.tiktok.com/@${brand.tiktokHandle}/video/${id}`}>
                        Ver video
                      </a>
                    </section>
                  </blockquote>
                ))}
              </div>
            ) : (
              <blockquote
                className="tiktok-embed"
                cite={brand.tiktokUrl}
                data-unique-id={brand.tiktokHandle}
                data-embed-type="creator"
                style={{ maxWidth: "780px", minWidth: "288px" }}
              >
                <section>
                  <a target="_blank" rel="noreferrer" href={`${brand.tiktokUrl}?refer=creator_embed`}>
                    @{brand.tiktokHandle}
                  </a>
                </section>
              </blockquote>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
