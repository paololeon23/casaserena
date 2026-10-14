import { brand, heroImage, heroImageAlt } from "../config/site";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <div className="bg-paper">
      <section id="inicio" className="relative overflow-hidden bg-paper text-white">
        <div className="relative h-[360px] sm:h-[68vh] sm:min-h-[520px] sm:max-h-[760px]">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="h-full w-full object-cover"
            width={1600}
            height={1200}
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2618]/80 via-[#1c2618]/20 to-[#1c2618]/10" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-14 sm:px-8 sm:pb-20">
            <div className="mx-auto max-w-6xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/90">{brand.cityLabel}</p>
              <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">
                Tu refugio
                <span className="sr-only"> {brand.name}</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white sm:text-base">
                Matrimonial AURA y doble ALMA. Dos personas en cada una. Elige la fecha libre.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="relative z-10 -mt-8 px-5 sm:-mt-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
