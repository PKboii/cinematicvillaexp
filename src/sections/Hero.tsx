import { useEffect, useRef } from "react";
import ScrollSequence, { type ScrollSequenceHandle } from "../components/ScrollSequence";
import { useReducedMotion } from "../lib/core";
import { COORDS, HERO_FRAMES, IMG } from "../data/content";

const seg = (p: number, a: number, b: number): number => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Hero({ entered }: { entered: boolean }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<ScrollSequenceHandle>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /* sticky camera: wrapper is tall, the stage sticks to the viewport and
     scroll progress drives frames + text. No pinned ScrollTrigger. */
  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const stmts = Array.from(wrap.querySelectorAll<HTMLElement>("[data-stmt]"));
    const intro = Array.from(wrap.querySelectorAll<HTMLElement>("[data-intro]"));
    const introDone = { v: false };

    /* entrance choreography, once the visitor steps in */
    if (!prefersReducedLocal()) {
      intro.forEach((el, i) => {
        el.style.transition = `transform 1.25s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.14}s, opacity 1.1s ease ${0.15 + i * 0.14}s`;
        el.style.transform = "translateY(115%)";
        el.style.opacity = "0";
      });
      if (cueRef.current) {
        cueRef.current.style.transition = "opacity 1s ease 1s";
        cueRef.current.style.opacity = "0";
      }
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          intro.forEach((el) => {
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
          });
          if (cueRef.current) cueRef.current.style.opacity = "1";
          introDone.v = true;
        })
      );
    } else {
      introDone.v = true;
    }

    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      seqRef.current?.draw(p);

      const set = (el: HTMLElement | null, op: number, y: number, unit = "px") => {
        if (!el) return;
        el.style.opacity = op.toFixed(3);
        el.style.transform = `translate3d(0, ${y.toFixed(1)}${unit}, 0)`;
      };

      set(cueRef.current, 1 - seg(p, 0.02, 0.09), 0);
      const out = seg(p, 0.1, 0.2);
      set(brandRef.current, 1 - out, -90 * out);
      stmts.forEach((el, i) => {
        const inS = seg(p, 0.2 + i * 0.05, 0.3 + i * 0.05);
        const outS = seg(p, 0.47 + i * 0.03, 0.56 + i * 0.03);
        el.style.opacity = (inS * (1 - outS)).toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - inS) * 118 - outS * 118).toFixed(1)}%, 0)`;
      });
      const cIn = seg(p, 0.57, 0.66);
      const cOut = seg(p, 0.77, 0.86);
      set(chapterRef.current, cIn * (1 - cOut), (1 - cIn) * 42 - cOut * 30);
      const eIn = seg(p, 0.86, 0.95);
      set(endRef.current, eIn, (1 - eIn) * 26);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, entered]);

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
    <section id="arrival" aria-label="Arrival at Villa Aurelia">
      <div ref={wrapRef} className="relative h-[340vh]">
        <div className="sticky top-0 h-svh overflow-hidden bg-[#12100c]">
          <ScrollSequence ref={seqRef} frames={HERO_FRAMES} />

          <div ref={brandRef} className="absolute inset-x-0 bottom-[9vh] px-6 md:px-14">
            <p className="label mb-4 text-ivory/70">
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

          <div ref={chapterRef} className="pointer-events-none absolute top-[34vh] px-6 md:px-14" style={{ opacity: 0 }}>
            <p className="label text-bronze">CHAPTER 01 — ARRIVAL</p>
            <p className="mt-4 max-w-sm font-display text-2xl leading-snug font-light md:text-4xl">
              The approach through the jungle.
            </p>
          </div>

          <div
            ref={endRef}
            className="pointer-events-none absolute right-6 bottom-[9vh] flex flex-col items-end gap-2 md:right-14"
            style={{ opacity: 0 }}
          >
            <span className="label text-ivory/85">CONTINUE</span>
            <span className="font-display text-xl font-light italic text-sand md:text-2xl">
              the house awaits ↓
            </span>
          </div>

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
      </div>
    </section>
  );
}

function prefersReducedLocal(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
