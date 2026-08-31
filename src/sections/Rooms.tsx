import { useCallback, useRef, useState } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { ROOMS } from "../data/content";

export default function Rooms() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [idx, setIdx] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setIdx(Math.min(ROOMS.length - 1, Math.round(p * (ROOMS.length - 1))));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
  }, []);

  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="bg-parchment text-ink">
      <h2 id="rooms-title" className="sr-only">
        The rooms of Villa Aurelia
      </h2>
      <div className="px-6 pt-28 md:px-14 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <p className="label text-bronzedeep">04 — THE ROOMS</p>
            </Reveal>
            <MaskLines
              className="mt-7 font-display text-[13vw] leading-[0.95] font-medium tracking-tight md:text-[6vw]"
              lines={[
                <>FIVE ROOMS.</>,
                <span key="w" className="font-light italic text-bronzedeep">
                  ONE PRIVATE WORLD.
                </span>,
              ]}
            />
          </div>
          <Reveal delay={0.15}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous room"
                className="flex h-12 w-12 items-center justify-center border border-ink/25 text-lg transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-parchment"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next room"
                className="flex h-12 w-12 items-center justify-center border border-ink/25 text-lg transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-parchment"
              >
                →
              </button>
              <span className="label ml-3 hidden text-ink/50 md:block">
                DRAG OR USE ARROWS
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-12 md:mt-20">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="rooms-scroller flex gap-10 px-6 pb-14 max-md:flex-col max-md:gap-20 md:gap-16 md:overflow-x-auto md:px-14 md:snap-x md:snap-mandatory"
        >
          {ROOMS.map((room, i) => (
            <Reveal
              key={room.num}
              delay={0.05}
              className="w-full shrink-0 md:w-[52vw] md:snap-start lg:w-[44vw]"
            >
              <article aria-label={`${room.name} — ${room.area}`}>
                <figure
                  className="group h-[46vh] overflow-hidden md:h-[56vh]"
                  data-cursor="VIEW"
                >
                  <img
                    src={room.image}
                    alt={room.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                  />
                </figure>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <span
                    className="text-outline-ink font-display text-6xl leading-[0.85] font-medium select-none md:text-7xl"
                    aria-hidden="true"
                  >
                    {room.num}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                      {room.name}
                    </h3>
                    <p className="mt-2 font-display text-lg font-light italic text-ink/60 md:text-xl">
                      {room.line}
                    </p>
                  </div>
                  <dl className="hidden shrink-0 text-right sm:block">
                    <dt className="label text-ink/45">AREA</dt>
                    <dd className="label-lg mt-1 text-ink">{room.area}</dd>
                    <dt className="label mt-4 text-ink/45">VIEW</dt>
                    <dd className="label-lg mt-1 text-ink">{room.view}</dd>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
          <div className="hidden w-[14vw] shrink-0 items-end pb-6 md:flex" aria-hidden="true">
            <p className="label text-ink/40">
              EACH ROOM FACES
              <br />
              WATER OR CANOPY —
              <br />
              NEVER A WALL.
            </p>
          </div>
        </div>

        <div className="pointer-events-none flex items-baseline gap-3 px-6 pb-10 md:px-14">
          <span className="font-display text-2xl font-light italic text-bronzedeep tabular-nums">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="label text-ink/50">/ 05 — THE ROOMS</span>
        </div>
        <div className="h-[2px] w-full bg-ink/10">
          <span
            ref={barRef}
            className="block h-full w-full origin-left bg-bronzedeep"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
