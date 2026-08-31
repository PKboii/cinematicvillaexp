import { useEffect, useRef } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { IMG } from "../data/content";
import { gsap, useReducedMotion } from "../lib/core";

const STATS: [string, string][] = [
  ["24 M", "INFINITY EDGE"],
  ["05", "SUITES"],
  ["10", "GUESTS"],
  ["ON REQUEST", "PRIVATE CHEF"],
];

export default function Pool() {
  const reduced = useReducedMotion();
  const figRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  /* scale on the img, drift on the wrapper — separate targets, no fighting */
  useEffect(() => {
    if (reduced || !figRef.current || !wrapRef.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.16 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: figRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
      gsap.fromTo(
        wrapRef.current,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: figRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="pool" aria-labelledby="pool-title" className="bg-coal text-ivory">
      <h2 id="pool-title" className="sr-only">
        The pool — nothing between you and the horizon
      </h2>
      <div className="px-6 pt-28 pb-14 md:px-14 md:pt-36 md:pb-20">
        <Reveal>
          <p className="label text-bronze">05 — THE POOL</p>
        </Reveal>
        <MaskLines
          className="mt-8 font-display text-[12vw] leading-[0.95] font-medium tracking-tight md:text-[5.6vw]"
          lines={[
            <>NOTHING BETWEEN</>,
            <span key="h" className="font-light italic text-sand">
              YOU &amp; THE HORIZON.
            </span>,
          ]}
        />
      </div>

      <figure ref={figRef} className="relative h-[100vh] overflow-hidden" data-cursor="VIEW">
        <div ref={wrapRef} className="h-[110%] w-full -translate-y-[4.5%] will-change-transform">
          <img
            ref={imgRef}
            src={IMG.water}
            alt="Sunlight caustics dancing across the pale floor of the infinity pool"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="pointer-events-none absolute bottom-4 left-4 md:bottom-8 md:left-10">
          <span className="text-outline font-display text-[26vw] leading-[0.85] font-medium select-none md:text-[12rem]">
            24M
          </span>
        </figcaption>
        <span className="label absolute right-6 bottom-10 hidden max-w-[240px] text-right leading-relaxed text-ivory/80 md:right-14 lg:block">
          SALT-FILTERED · HEATED · ALIGNED TO THE HORIZON
        </span>
      </figure>

      <div className="border-t border-ivory/12">
        <div className="grid grid-cols-2 divide-ivory/12 max-md:divide-y md:grid-cols-4 md:divide-x">
          {STATS.map((s, i) => (
            <Reveal
              key={s[1]}
              delay={i * 0.08}
              className="px-6 py-12 md:px-12 md:py-16"
            >
              <p className="font-display text-3xl font-light tracking-tight md:text-5xl">
                {s[0]}
              </p>
              <p className="label mt-4 text-ivory/55">{s[1]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
