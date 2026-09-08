import { useEffect, useRef, useState } from "react";
import {
  gsap,
  EASE,
  prefersReducedMotion,
  preloadImages,
  useMagnetic,
} from "../lib/core";
import { COORDS, HERO_FRAMES, IMG } from "../data/content";

const PRELOAD_SET = [
  ...HERO_FRAMES,
  IMG.master,
  IMG.dining,
  IMG.water,
  IMG.garden,
  IMG.night,
];

export default function LoadingScreen({ onEnter }: { onEnter: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const enterRef = useMagnetic<HTMLButtonElement>(0.25);

  useEffect(() => {
    let alive = true;
    const work = Promise.all([
      preloadImages(PRELOAD_SET, (p) => {
        if (alive) setProgress(Math.round(p * 96));
      }),
      document.fonts?.ready ?? Promise.resolve(),
    ]);
    work.then(() => {
      if (!alive) return;
      setProgress(100);
      window.setTimeout(() => alive && setReady(true), 350);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleEnter = () => {
    const overlay = overlayRef.current;
    if (prefersReducedMotion() || !overlay) {
      onEnter();
      setGone(true);
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => setGone(true),
    });
    tl.to(
      contentRef.current,
      { autoAlpha: 0, y: -36, duration: 0.45, ease: "power2.in" },
      0
    )
      .call(() => onEnter(), undefined, 0.35)
      .to(
        overlay,
        { clipPath: "inset(0 0 100% 0)", duration: 1.05, ease: EASE.inOut },
        0.25
      );
  };

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-7 text-ivory md:px-12 md:py-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      role="dialog"
      aria-label="Loading Villa Aurelia"
    >
      <div ref={contentRef}>
        <div className="flex items-baseline justify-between">
          <p className="label text-ivory/60">PRIVATE RESIDENCE</p>
          <p className="label hidden text-ivory/60 sm:block">{COORDS}</p>
        </div>

        <div className="mt-[16vh] md:mt-[14vh]">
          <h1 className="font-display text-[18vw] leading-[0.92] font-medium tracking-tight md:text-[10vw]">
            <span className="block overflow-hidden">
              <span className="animate-fade-up block" style={{ animationDelay: "0.15s" }}>
                VILLA
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="animate-fade-up block font-light italic text-sand"
                style={{ animationDelay: "0.3s" }}
              >
                AURELIA
              </span>
            </span>
          </h1>
          <p className="label mt-6 text-ivory/60">
            GOA — INDIA · BETWEEN EARTH &amp; OCEAN
          </p>
        </div>

        <div className="mt-[10vh] flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label mb-3 text-ivory/60">LOADING EXPERIENCE</p>
            <div className="flex items-center gap-5">
              <div className="h-px w-44 overflow-hidden bg-ivory/15 md:w-72">
                <div
                  className="h-full bg-bronze transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="label-lg w-12 text-right tabular-nums text-ivory/80">
                {progress}%
              </span>
            </div>
          </div>

          {ready ? (
            <button
              ref={enterRef}
              type="button"
              onClick={handleEnter}
              className="label-lg group inline-flex w-fit items-center gap-4 border border-ivory/40 px-9 py-4 transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
            >
              ENTER
              <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </button>
          ) : (
            <div className="h-px w-44 overflow-hidden bg-ivory/10 md:w-72">
              <div className="scan-line h-full w-1/3 bg-ivory/40" />
            </div>
          )}
        </div>
      </div>

      <p className="label text-ivory/40">
        A PRIVATE ARCHITECTURAL RETREAT — EST. 2019
      </p>
    </div>
  );
}
