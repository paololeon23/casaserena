import { heroImage, heroImageAlt } from "../config/site";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <div className="bg-paper">
      <section id="inicio" className="relative overflow-hidden bg-paper text-white">
        <h1 className="sr-only">Casa Serena Otuzco</h1>
        <div className="relative min-h-[420px] h-[58vh] max-h-[640px] sm:h-[68vh] sm:min-h-[682px] sm:max-h-[760px]">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="h-full w-full object-cover"
            width={1600}
            height={1200}
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c2618]/65 via-[#1c2618]/20 to-[#1c2618]/35" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t from-[#141c12]/75 via-[#141c12]/28 to-transparent" />
          <div className="absolute inset-x-0 bottom-24 z-[2] px-5 sm:bottom-28 sm:px-8">
            <div className="mx-auto max-w-7xl text-center sm:text-left">
              <p
                className="max-w-xl font-display text-2xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.15rem]"
                style={{ textShadow: "0 2px 4px rgba(20,28,18,0.65), 0 12px 36px rgba(20,28,18,0.55)" }}
              >
                Una experiencia distinta en Otuzco
              </p>
              <p
                className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white sm:text-xs"
                style={{ textShadow: "0 1px 3px rgba(20,28,18,0.7), 0 8px 24px rgba(20,28,18,0.5)" }}
              >
                Confort - Privacidad - Calidez
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="relative z-10 -mt-8 px-5 sm:-mt-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
