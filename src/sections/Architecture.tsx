import { useState } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { PLAN_ROOMS, type PlanRoom } from "../data/content";
import { scrollToTarget, useInView } from "../lib/core";

export default function Architecture() {
  const [active, setActive] = useState<PlanRoom>(PLAN_ROOMS[0]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [planRef, inView] = useInView<HTMLDivElement>("200px");

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="relative bg-ink px-6 py-28 text-ivory md:px-14 md:py-40"
    >
      <h2 id="architecture-title" className="sr-only">
        Architecture — the plan
      </h2>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="label text-bronze">03 — ARCHITECTURE</p>
          </Reveal>
          <MaskLines
            className="mt-7 font-display text-[15vw] leading-[0.92] font-medium tracking-tight md:text-[7vw]"
            lines={[<>THE</>, <span key="p" className="font-light italic text-sand">PLAN.</span>]}
          />
        </div>
        <Reveal delay={0.2}>
          <p className="label max-w-[220px] text-right leading-relaxed text-ivory/45">
            SELECT A ROOM —
            <br />
            READ THE HOUSE
          </p>
        </Reveal>
      </div>

      <div ref={planRef} className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <svg
            viewBox="0 0 840 540"
            role="group"
            aria-label="Interactive floor plan of Villa Aurelia"
            className={`w-full transition-opacity duration-1000 ${inView ? "opacity-100" : "opacity-0"}`}
          >
            {/* plot boundary */}
            <rect
              x={50}
              y={70}
              width={690}
              height={420}
              fill="none"
              stroke="rgba(242,236,223,0.22)"
              strokeWidth={1}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={inView ? 0 : 1}
              style={{ transition: "stroke-dashoffset 2s ease 0.2s" }}
            />
            {/* entry */}
            <line x1={395} y1={70} x2={395} y2={120} stroke="#b08d5f" strokeWidth={1} />
            <text
              x={395}
              y={56}
              textAnchor="middle"
              fill="rgba(242,236,223,0.55)"
              fontSize={11}
              letterSpacing={3}
              fontFamily="Space Grotesk, sans-serif"
            >
              FROM THE DRIVE
            </text>
            {/* north */}
            <g transform="translate(786, 108)" aria-hidden="true">
              <circle r={17} fill="none" stroke="rgba(242,236,223,0.3)" />
              <line x1={0} y1={9} x2={0} y2={-9} stroke="#b08d5f" strokeWidth={1.2} />
              <path d="M0 -9 L-4 -2 L4 -2 Z" fill="#b08d5f" />
              <text y={-24} textAnchor="middle" fill="rgba(242,236,223,0.6)" fontSize={10} letterSpacing={2} fontFamily="Space Grotesk, sans-serif">
                N
              </text>
            </g>

            {PLAN_ROOMS.map((room, i) => {
              const isActive = active.id === room.id;
              const isHover = hovered === room.id;
              return (
                <g
                  key={room.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${room.name}, ${room.area}`}
                  aria-pressed={isActive}
                  onClick={() => setActive(room)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(room);
                    }
                  }}
                  onMouseEnter={() => setHovered(room.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(room.id)}
                  onBlur={() => setHovered(null)}
                  className="cursor-pointer outline-none"
                >
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={inView ? 0 : 1}
                    style={{
                      transition: `stroke-dashoffset 1.4s ease ${0.3 + i * 0.09}s, fill 0.5s ease, stroke 0.5s ease`,
                      fill: isActive
                        ? "rgba(176,141,95,0.16)"
                        : isHover
                          ? "rgba(242,236,223,0.06)"
                          : "transparent",
                      stroke: isActive ? "#b08d5f" : "rgba(242,236,223,0.42)",
                      strokeWidth: isActive ? 1.8 : 1,
                    }}
                  />
                  <text
                    x={room.x + 12}
                    y={room.y + 24}
                    fill={isActive ? "#e5d3b3" : "rgba(242,236,223,0.78)"}
                    fontSize={13}
                    letterSpacing={2.5}
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {room.name}
                  </text>
                  <text
                    x={room.x + 12}
                    y={room.y + 42}
                    fill="rgba(176,141,95,0.9)"
                    fontSize={11}
                    letterSpacing={2}
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {room.area}
                  </text>
                </g>
              );
            })}

            {/* pool dimension */}
            <g aria-hidden="true">
              <line x1={70} y1={452} x2={470} y2={452} stroke="rgba(176,141,95,0.8)" strokeWidth={1} />
              <line x1={70} y1={446} x2={70} y2={458} stroke="rgba(176,141,95,0.8)" strokeWidth={1} />
              <line x1={470} y1={446} x2={470} y2={458} stroke="rgba(176,141,95,0.8)" strokeWidth={1} />
              <text
                x={270}
                y={474}
                textAnchor="middle"
                fill="rgba(176,141,95,0.95)"
                fontSize={12}
                letterSpacing={3}
                fontFamily="Space Grotesk, sans-serif"
              >
                24 M — INFINITY EDGE
              </text>
            </g>
          </svg>
          <p className="label mt-6 text-ivory/35">
            LEVEL 00 — SCALE 1:200 · ALL MEASURES APPROXIMATE
          </p>
        </div>

        <div className="lg:col-span-5">
          <div
            key={active.id}
            className="animate-fade-up border border-ivory/12 bg-coal p-7 md:p-9"
          >
            <p className="label text-bronze">{active.area}</p>
            <h3 className="mt-3 font-display text-4xl font-light tracking-tight md:text-5xl">
              {active.name}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">{active.note}</p>
            <img
              src={active.image}
              alt={`${active.name} at Villa Aurelia`}
              loading="lazy"
              decoding="async"
              className="mt-7 h-44 w-full object-cover md:h-52"
            />
            <button
              type="button"
              onClick={() => scrollToTarget("#model")}
              className="label-lg link-line mt-7 inline-block text-bronze"
            >
              VIEW IN THE MODEL →
            </button>
          </div>
          <Reveal className="mt-8">
            <p className="max-w-sm text-sm leading-relaxed text-ivory/55">
              The plan is a single stroke: living and dining face the water, the
              suites turn toward the morning, and the garden is allowed to remain
              exactly what it was.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
