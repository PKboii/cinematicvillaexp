import { lazy, Suspense, useRef, useState } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { HOTSPOTS, type HotspotId } from "../data/content";
import { isTouchDevice, useInView } from "../lib/core";
import type { VillaApi } from "./VillaScene";

const VillaScene = lazy(() => import("./VillaScene"));

function StageFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#15120e]">
      <p className="label text-ivory/60">PREPARING THE MODEL</p>
      <div className="h-px w-48 overflow-hidden bg-ivory/15">
        <div className="scan-line h-full w-1/3 bg-bronze" />
      </div>
    </div>
  );
}

export default function Explorer() {
  const apiRef = useRef<VillaApi>(null);
  const [active, setActive] = useState<HotspotId | null>(null);
  const [sectionRef, near] = useInView<HTMLElement>("650px");
  const spot = HOTSPOTS.find((h) => h.id === active) ?? null;
  const touch = isTouchDevice();

  const select = (id: HotspotId | null) => {
    setActive(id);
    if (id) apiRef.current?.focus(id);
    else apiRef.current?.reset();
  };

  return (
    <section
      id="model"
      ref={sectionRef}
      aria-labelledby="model-title"
      className="relative bg-coal px-6 py-28 text-ivory md:px-14 md:py-36"
    >
      <h2 id="model-title" className="sr-only">
        The model — explore the villa in 3D
      </h2>
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Reveal>
            <p className="label text-bronze">04 — THE MODEL</p>
          </Reveal>
          <MaskLines
            className="mt-7 font-display text-[15vw] leading-[0.92] font-medium tracking-tight md:text-[7vw]"
            lines={[
              <>WALK</>,
              <span key="s" className="font-light italic text-sand">
                THE SITE.
              </span>,
            ]}
          />
        </div>
        <Reveal delay={0.15} className="md:col-span-5">
          <p className="max-w-sm text-sm leading-relaxed text-ivory/65">
            A working model of the villa, drawn to the same stroke as the plan.
            Orbit it, or choose a place to stand.
          </p>
          <p className="label mt-5 text-ivory/40">
            {touch
              ? "DRAG TO ORBIT — PINCH TO ZOOM — TAP A MARKER"
              : "DRAG — ORBIT · SCROLL — ZOOM · CLICK A MARKER"}
          </p>
        </Reveal>
      </div>

      <div
        className="relative mt-14 h-[66vh] min-h-[460px] overflow-hidden border border-ivory/12 bg-[#15120e]"
        data-cursor="DRAG"
      >
        {near && (
          <Suspense fallback={<StageFallback />}>
            <VillaScene
              ref={apiRef}
              onSelect={(id) => select(id)}
              activeId={active}
            />
          </Suspense>
        )}
        {!near && <StageFallback />}

        {/* hotspot index — desktop */}
        <div className="absolute top-6 left-6 z-10 hidden flex-col gap-1 md:flex">
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => select(active === h.id ? null : h.id)}
              aria-pressed={active === h.id}
              className={`label-lg flex items-baseline gap-3 py-1 text-left transition-colors duration-300 ${
                active === h.id ? "text-ivory" : "text-ivory/40 hover:text-ivory/80"
              }`}
            >
              <span
                className={`font-display text-sm italic ${
                  active === h.id ? "text-bronze" : "text-ivory/35"
                }`}
              >
                {h.num}
              </span>
              {h.name}
            </button>
          ))}
        </div>

        {/* hotspot index — mobile chips */}
        <div className="absolute inset-x-4 bottom-4 z-10 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => select(active === h.id ? null : h.id)}
              aria-pressed={active === h.id}
              className={`label whitespace-nowrap border px-3 py-2 transition-colors duration-300 ${
                active === h.id
                  ? "border-bronze bg-bronze/15 text-ivory"
                  : "border-ivory/25 bg-[#15120e]/70 text-ivory/70"
              }`}
            >
              {h.num} {h.name}
            </button>
          ))}
        </div>

        {/* room panel */}
        {spot && (
          <div className="animate-fade-up absolute bottom-16 left-5 right-5 z-10 border border-ivory/15 bg-[#191610]/95 p-6 md:bottom-6 md:left-auto md:right-6 md:w-[340px]">
            <p className="label text-bronze">{spot.num} — SELECTED</p>
            <h3 className="mt-2 font-display text-3xl font-light tracking-tight">
              {spot.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/70">{spot.copy}</p>
            <img
              src={spot.image}
              alt={`${spot.name} at Villa Aurelia`}
              loading="lazy"
              decoding="async"
              className="mt-4 h-32 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => select(null)}
              className="label-lg link-line mt-5 inline-block text-bronze"
            >
              ← RETURN TO OVERVIEW
            </button>
          </div>
        )}
      </div>

      <Reveal className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
        <p className="max-w-md text-sm leading-relaxed text-ivory/50">
          Massing study, 1:200 — travertine volumes, teak screens and the long
          axis of water that carries the eye to the sea.
        </p>
        <p className="label text-ivory/35">MODEL 04 — SOUTH ELEVATION</p>
      </Reveal>
    </section>
  );
}
