import { useEffect, useRef } from "react";
import ScrollSequence, { type ScrollSequenceHandle } from "../components/ScrollSequence";
import { gsap, ScrollTrigger, EASE, useReducedMotion } from "../lib/core";
import { COORDS, HERO_FRAMES, IMG } from "../data/content";

export default function Hero({ entered }: { entered: boolean }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<ScrollSequenceHandle>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const master = useRef<gsap.core.Timeline | null>(null);

  /* text choreography mapped to scroll progress 0..1 */
  useEffect(() => {
    if (reduced) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
    tl.to(cueRef.current, { autoAlpha: 0, duration: 0.06 }, 0.02)
      .to(brandRef.current, { autoAlpha: 0, y: -70, duration: 0.1 }, 0.1)
      .fromTo(
        "[data-stmt]",
        { yPercent: 118 },
        { yPercent: 0, duration: 0.12, stagger: 0.05 },
        0.2
      )
      .to("[data-stmt]", { yPercent: -118, duration: 0.1, stagger: 0.04 }, 0.47)
      .fromTo(
        chapterRef.current,
        { autoAlpha: 0, y: 42 },
        { autoAlpha: 1, y: 0, duration: 0.09 },
        0.58
      )
      .to(chapterRef.current, { autoAlpha: 0, y: -28, duration: 0.07 }, 0.78)
      .fromTo(
        endRef.current,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.08 },
        0.87
      );
    master.current = tl;
    return () => {
      tl.kill();
      master.current = null;
    };
  }, [reduced]);

  /* pin + scrub once the visitor has entered */
  useEffect(() => {
    if (!entered || reduced) return;
    const intro = gsap.timeline({ defaults: { ease: EASE.heavy } });
    intro
      .fromTo(
        "[data-intro]",
        { yPercent: 118 },
        { yPercent: 0, duration: 1.35, stagger: 0.13 },
        0.1
      )
      .fromTo(metaRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.6)
      .fromTo(cueRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0.9);

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "+=340%",
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      onUpdate: (self) => {
        seqRef.current?.draw(self.progress);
        master.current?.progress(self.progress);
      },
    });
    seqRef.current?.draw(0);
    return () => {
      st.kill();
      intro.kill();
    };
  }, [entered, reduced]);

  if (reduced) {
    return (
      <section id="arrival" aria-label="Arrival at Villa Aurelia" className="relative">
        <div className="relative h-svh min-h-[560px] overflow-hidden bg-[#12100c]">
          <img
            src={IMG.exterior}
            alt="Villa Aurelia — a long travertine and teak volume reflected in a still pool at golden hour"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#10100c]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-[10vh] px-6 md:px-14">
            <p className="label mb-4 text-ivory/70">PRIVATE RESIDENCE — GOA, INDIA</p>
            <h1 className="font-display text-[18vw] leading-[0.92] font-medium tracking-tight md:text-[10vw]">
              VILLA <span className="font-light italic text-sand">AURELIA</span>
            </h1>
            <p className="mt-6 max-w-md font-display text-xl font-light italic text-ivory/85 md:text-2xl">
              Between earth &amp; ocean.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="arrival" aria-label="Arrival at Villa Aurelia" className="relative">
      <div ref={wrapRef} className="relative h-svh overflow-hidden bg-[#12100c]">
        <ScrollSequence ref={seqRef} frames={HERO_FRAMES} />

        {/* brand — opening title */}
        <div ref={brandRef} className="absolute inset-x-0 bottom-[9vh] px-6 md:px-14">
          <p ref={metaRef} className="label mb-4 text-ivory/70">
            PRIVATE RESIDENCE — GOA, INDIA · {COORDS}
          </p>
          <h1 className="font-display text-[19vw] leading-[0.88] font-medium tracking-tight md:text-[10.5vw]">
            <span className="block overflow-hidden">
              <span data-intro="" className="block">
                VILLA
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-intro="" className="block font-light italic text-sand">
                AURELIA
              </span>
            </span>
          </h1>
        </div>

        {/* statement — appears mid-sequence */}
        <div className="pointer-events-none absolute inset-x-0 top-[24vh] px-6 md:px-14">
          <p className="font-display text-[12vw] leading-[1.02] font-medium tracking-tight md:text-[7.5vw]">
            <span className="block overflow-hidden">
              <span data-stmt="" className="block">
                BETWEEN
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-stmt="" className="block font-light italic text-sand">
                EARTH &amp; OCEAN.
              </span>
            </span>
          </p>
        </div>

        {/* chapter marker */}
        <div
          ref={chapterRef}
          className="pointer-events-none absolute top-[34vh] px-6 md:px-14"
        >
          <p className="label text-bronze">CHAPTER 01 — ARRIVAL</p>
          <p className="mt-4 max-w-sm font-display text-2xl leading-snug font-light md:text-4xl">
            The approach through the jungle.
          </p>
        </div>

        {/* end hint */}
        <div
          ref={endRef}
          className="pointer-events-none absolute right-6 bottom-[9vh] flex flex-col items-end gap-2 md:right-14"
        >
          <span className="label text-ivory/85">CONTINUE</span>
          <span className="font-display text-xl font-light italic text-sand md:text-2xl">
            the house awaits ↓
          </span>
        </div>

        {/* scroll cue */}
        <div
          ref={cueRef}
          className="absolute bottom-[4vh] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          aria-hidden="true"
        >
          <span className="label text-ivory/60">SCROLL</span>
          <span className="block h-14 w-px overflow-hidden bg-ivory/20">
            <span className="cue-dot block h-full w-px bg-bronze" />
          </span>
        </div>
      </div>
    </section>
  );
}
