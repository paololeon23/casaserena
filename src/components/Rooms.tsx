import { publishedRooms, stayVideos } from "../config/site";
import { Container } from "./ui";
import { RoomCard } from "./RoomCard";

export function Rooms() {
  const rooms = publishedRooms();

  return (
    <section id="habitaciones" className="scroll-mt-24 bg-paper pb-2 pt-10 md:pt-24">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em]">La habitación</p>
        <h2 className="mt-3 max-w-xl font-display text-4xl leading-[1.02] tracking-[-0.03em] sm:text-6xl">
          Mira el lugar. <span className="italic">Elige la fecha.</span>
        </h2>
        <div className="mt-10 grid gap-8">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} mark={String(index + 1).padStart(2, "0")} />
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stayVideos.map((video) => (
            <figure key={video.src} className="overflow-hidden rounded-[1.4rem] bg-[#1c2618]">
              <video
                className="h-[420px] w-full bg-black object-cover sm:h-[520px]"
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <figcaption className="px-4 py-3 text-sm text-white">
                <span className="font-medium">{video.title}</span>
                <span className="mt-1 block text-white/80">{video.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
