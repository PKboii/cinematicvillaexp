import { useEffect, useRef } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { ROOMS } from "../data/content";
import { gsap, useReducedMotion } from "../lib/core";

export default function Rooms() {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  /* pinned horizontal gallery — desktop only; vertical flow elsewhere */
  useEffect(() => {
    if (reduced || !outerRef.current || !trackRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const track = trackRef.current;
      if (!track) return;
      const amount = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              ROOMS.length,
              Math.round(self.progress * (ROOMS.length - 1)) + 1
            );
            if (counterRef.current) {
              counterRef.current.textContent = String(idx).padStart(2, "0");
            }
            if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="bg-parchment text-ink">
      <h2 id="rooms-title" className="sr-only">
        The rooms of Villa Aurelia
      </h2>
      <div className="px-6 pt-28 md:px-14 md:pt-36">
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

      <div ref={outerRef} className="relative mt-10 overflow-hidden md:mt-16">
        <div
          ref={trackRef}
          className="flex gap-10 px-6 py-10 will-change-transform md:gap-16 md:px-14 md:py-16 max-md:flex-col max-md:gap-24 max-md:pb-24"
        >
          {ROOMS.map((room) => (
            <article
              key={room.num}
              aria-label={`${room.name} — ${room.area}`}
              className="w-[86vw] shrink-0 md:w-[60vw] lg:w-[50vw] max-md:w-full"
            >
              <figure className="group h-[50vh] overflow-hidden md:h-[60vh]" data-cursor="VIEW">
                <img
                  src={room.image}
                  alt={room.alt}
                  loading="lazy"
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
          ))}
          <div className="hidden w-[16vw] shrink-0 items-end pb-6 md:flex" aria-hidden="true">
            <p className="label text-ink/40">EACH ROOM FACES / WATER OR CANOPY — / NEVER A WALL.</p>
          </div>
        </div>

        {/* counter + progress (pinned desktop view) */}
        <div className="pointer-events-none absolute bottom-7 left-6 hidden items-baseline gap-3 md:left-14 md:flex">
          <span ref={counterRef} className="font-display text-2xl font-light italic text-bronzedeep">
            01
          </span>
          <span className="label text-ink/50">/ 05 — THE ROOMS</span>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-ink/10">
          <span
            ref={barRef}
            className="block h-full w-full origin-left scale-x-0 bg-bronzedeep"
          />
        </div>
      </div>
    </section>
  );
}
