import { useEffect, useRef } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { COORDS, DISTANCES } from "../data/content";
import { gsap, useReducedMotion } from "../lib/core";

export default function Location() {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced || !svgRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: svgRef.current, start: "top 75%", once: true },
      });
      tl.fromTo(
        "[data-draw]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.7, stagger: 0.4 }
      ).fromTo(
        "[data-pt]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.2 },
        "-=1.1"
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  const dash = reduced
    ? undefined
    : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 };

  return (
    <section
      id="location"
      aria-labelledby="location-title"
      className="relative bg-ivory px-6 py-28 text-ink md:px-14 md:py-40"
    >
      <h2 id="location-title" className="sr-only">
        Location — South Goa, India
      </h2>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="label text-bronzedeep">07 — LOCATION</p>
          </Reveal>
          <MaskLines
            className="mt-7 font-display text-[16vw] leading-[0.9] font-medium tracking-tight md:text-[7vw]"
            lines={[
              <>GOA,</>,
              <span key="i" className="font-light italic text-bronzedeep">
                INDIA.
              </span>,
            ]}
          />
          <Reveal delay={0.15} className="mt-9 max-w-md">
            <p className="text-[0.95rem] leading-relaxed text-ink/75">
              South of Panjim, past the laterite villages and the cashew groves,
              the road narrows to a single red-earth drive. It ends at a pair of
              teak gates — and the sound of water.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-12">
            <ul className="max-w-md">
              {DISTANCES.map(([place, time]) => (
                <li
                  key={place}
                  className="flex items-baseline justify-between border-t border-ink/15 py-4"
                >
                  <span className="label-lg text-ink/80">{place}</span>
                  <span className="font-display text-lg font-light italic text-bronzedeep">
                    {time}
                  </span>
                </li>
              ))}
            </ul>
            <p className="label mt-8 text-ink/45">{COORDS} — SOUTH GOA</p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <svg
            ref={svgRef}
            viewBox="0 0 600 680"
            role="img"
            aria-label="Stylised map of South Goa showing the route from Dabolim airport to Villa Aurelia on the coast"
            className="w-full"
          >
            {/* sea texture */}
            <g stroke="rgba(78,110,102,0.5)" strokeWidth={1} fill="none">
              {[
                "M 40 150 q 30 -14 60 0 q 30 14 60 0",
                "M 70 240 q 30 -14 60 0 q 30 14 60 0",
                "M 35 340 q 30 -14 60 0 q 30 14 60 0",
                "M 75 440 q 30 -14 60 0 q 30 14 60 0",
                "M 45 540 q 30 -14 60 0 q 30 14 60 0",
              ].map((d, i) => (
                <path key={i} d={d} data-draw={dash ? "" : undefined} pathLength={dash ? 1 : undefined} strokeDasharray={dash ? 1 : undefined} strokeDashoffset={dash ? 1 : undefined} style={dash ? { transition: "none" } : undefined} />
              ))}
            </g>
            <g data-pt="">
              <text
                x={88}
                y={392}
                transform="rotate(-90 88 392)"
                textAnchor="middle"
                fill="rgba(78,110,102,0.9)"
                fontSize={13}
                letterSpacing={6}
                fontFamily="Space Grotesk, sans-serif"
              >
                ARABIAN SEA
              </text>
            </g>

            {/* coastline */}
            <path
              d="M 300 -10 C 262 80 302 160 252 240 C 206 314 236 402 206 470 C 180 536 212 612 196 690"
              fill="none"
              stroke="rgba(22,20,15,0.75)"
              strokeWidth={1.6}
              data-draw=""
              pathLength={dash ? 1 : undefined}
              strokeDasharray={dash ? 1 : undefined}
              strokeDashoffset={dash ? 1 : undefined}
            />
            {/* beach */}
            <path
              d="M 244 268 C 232 292 226 316 224 340"
              fill="none"
              stroke="#c2af87"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.85}
              data-draw=""
              pathLength={dash ? 1 : undefined}
              strokeDasharray={dash ? 1 : undefined}
              strokeDashoffset={dash ? 1 : undefined}
            />

            {/* land contours */}
            <g fill="none" stroke="rgba(22,20,15,0.12)">
              <ellipse cx={420} cy={200} rx={120} ry={70} />
              <ellipse cx={430} cy={210} rx={86} ry={48} />
              <ellipse cx={470} cy={480} rx={100} ry={60} />
              <ellipse cx={460} cy={470} rx={64} ry={36} />
            </g>

            {/* route */}
            <path
              d="M 470 600 C 420 540 382 482 336 426 C 300 380 276 342 252 302"
              fill="none"
              stroke="#8f6f47"
              strokeWidth={1.6}
              data-draw=""
              pathLength={dash ? 1 : undefined}
              strokeDasharray={dash ? 1 : undefined}
              strokeDashoffset={dash ? 1 : undefined}
            />

            {/* airport */}
            <g data-pt="">
              <rect x={464} y={594} width={12} height={12} fill="none" stroke="rgba(22,20,15,0.8)" strokeWidth={1.4} />
              <text x={486} y={605} fill="rgba(22,20,15,0.75)" fontSize={11} letterSpacing={2.4} fontFamily="Space Grotesk, sans-serif">
                DABOLIM AIRPORT
              </text>
            </g>
            {/* old goa */}
            <g data-pt="">
              <circle cx={336} cy={426} r={4.5} fill="none" stroke="rgba(22,20,15,0.8)" strokeWidth={1.4} />
              <text x={352} y={431} fill="rgba(22,20,15,0.75)" fontSize={11} letterSpacing={2.4} fontFamily="Space Grotesk, sans-serif">
                OLD GOA
              </text>
            </g>
            {/* beach label */}
            <g data-pt="">
              <text
                x={206}
                y={300}
                textAnchor="end"
                fill="rgba(143,111,71,0.95)"
                fontSize={11}
                letterSpacing={2.4}
                fontFamily="Space Grotesk, sans-serif"
              >
                PRIVATE BEACH
              </text>
            </g>
            {/* villa */}
            <g data-pt="">
              <circle
                cx={252}
                cy={302}
                r={10}
                fill="none"
                stroke="#8f6f47"
                strokeWidth={1}
                className="pulse-ring"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <path d="M 252 294 L 260 302 L 252 310 L 244 302 Z" fill="#8f6f47" />
              <text
                x={252}
                y={272}
                textAnchor="middle"
                fill="rgba(22,20,15,0.9)"
                fontSize={13}
                letterSpacing={3}
                fontFamily="Space Grotesk, sans-serif"
                fontWeight={600}
              >
                VILLA AURELIA
              </text>
            </g>

            {/* compass */}
            <g data-pt="" transform="translate(540, 84)" aria-hidden="true">
              <circle r={20} fill="none" stroke="rgba(22,20,15,0.35)" />
              <line x1={0} y1={11} x2={0} y2={-11} stroke="#8f6f47" strokeWidth={1.2} />
              <path d="M0 -11 L-4.5 -3 L4.5 -3 Z" fill="#8f6f47" />
              <text y={-28} textAnchor="middle" fill="rgba(22,20,15,0.6)" fontSize={11} letterSpacing={2} fontFamily="Space Grotesk, sans-serif">
                N
              </text>
            </g>
          </svg>
          <p className="label mt-4 text-ink/40">
            NOT TO SCALE — DRAWN FROM MEMORY OF THE DRIVE
          </p>
        </div>
      </div>
    </section>
  );
}
