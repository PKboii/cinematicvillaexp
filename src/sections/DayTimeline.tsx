import { useEffect, useRef, useState } from "react";
import { DAY_STOPS } from "../data/content";
import { gsap, ScrollTrigger, scrollToTarget, useReducedMotion } from "../lib/core";

export default function DayTimeline() {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || !outerRef.current || !innerRef.current) return;
    const stops = DAY_STOPS;

    const applyBg = (bg: string) => {
      if (innerRef.current) innerRef.current.style.backgroundColor = bg;
      if (scrimRef.current) {
        scrimRef.current.style.background = `linear-gradient(90deg, ${bg}F2 0%, ${bg}B0 36%, ${bg}00 74%)`;
      }
    };
    applyBg(stops[0].bg);

    const st = ScrollTrigger.create({
      trigger: outerRef.current,
      start: "top top",
      end: () => `+=${(stops.length - 1) * 100}%`,
      pin: innerRef.current,
      scrub: true,
      onUpdate: (self) => {
        const f = self.progress * (stops.length - 1);
        const i = Math.min(stops.length - 2, Math.floor(f));
        const t = f - i;
        applyBg(gsap.utils.interpolate(stops[i].bg, stops[i + 1].bg, t));
        if (textRef.current) {
          textRef.current.style.color = gsap.utils.interpolate(
            stops[i].fg,
            stops[i + 1].fg,
            t
          );
        }
        imgRefs.current.forEach((el, k) => {
          if (!el) return;
          el.style.opacity = k === i ? String(1 - t) : k === i + 1 ? String(t) : "0";
        });
        const r = Math.min(stops.length - 1, Math.round(f));
        setIdx((prev) => (prev === r ? prev : r));
      },
    });
    stRef.current = st;
    return () => {
      st.kill();
      stRef.current = null;
    };
  }, [reduced]);

  const jump = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (i / (DAY_STOPS.length - 1)) * (st.end - st.start);
    scrollToTarget(y);
  };

  if (reduced) {
    return (
      <section
        id="day"
        aria-labelledby="day-title"
        className="bg-parchment px-6 py-28 text-ink md:px-14"
      >
        <h2 id="day-title" className="sr-only">
          A day at Aurelia
        </h2>
        <p className="label text-bronzedeep">07 — A DAY AT AURELIA</p>
        <div className="mt-14 grid gap-16">
          {DAY_STOPS.map((s) => (
            <div key={s.time} className="grid gap-6 md:grid-cols-2 md:items-center">
              <img
                src={s.image}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover"
              />
              <div>
                <p className="font-display text-5xl font-medium tabular-nums">{s.time}</p>
                <p className="mt-2 font-display text-2xl font-light italic text-ink/70">
                  {s.title}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="day" aria-labelledby="day-title">
      <h2 id="day-title" className="sr-only">
        A day at Aurelia — from first light to the stars
      </h2>
      <div ref={outerRef} className="relative">
        <div
          ref={innerRef}
          className="relative h-svh overflow-hidden"
          style={{ backgroundColor: DAY_STOPS[0].bg }}
        >
          {DAY_STOPS.map((s, i) => (
            <img
              key={s.time}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              src={s.image}
              alt={s.alt}
              aria-hidden={i !== idx}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div ref={scrimRef} className="pointer-events-none absolute inset-0" />

          <div
            ref={textRef}
            className="pointer-events-none absolute inset-0"
            style={{ color: DAY_STOPS[0].fg }}
          >
            <div className="absolute top-[17vh] left-6 md:top-[19vh] md:left-14">
              <p className="label opacity-75">07 — A DAY AT AURELIA</p>
              <div key={idx} className="animate-fade-up">
                <p className="mt-6 font-display text-[17vw] leading-[0.9] font-medium tabular-nums md:text-[8vw]">
                  {DAY_STOPS[idx].time}
                </p>
                <h3 className="mt-3 font-display text-2xl font-light italic md:text-4xl">
                  {DAY_STOPS[idx].title}
                </h3>
                <p className="mt-3 max-w-xs text-sm opacity-85 md:text-base">
                  {DAY_STOPS[idx].copy}
                </p>
              </div>
            </div>

            <div className="pointer-events-auto absolute right-6 bottom-7 left-6 md:right-14 md:left-14">
              <div
                className="flex items-end justify-between gap-4 overflow-x-auto"
                role="tablist"
                aria-label="Times of day"
              >
                {DAY_STOPS.map((s, i) => (
                  <button
                    key={s.time}
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    onClick={() => jump(i)}
                    className={`label-lg shrink-0 pb-3 transition-opacity duration-300 ${
                      i === idx ? "opacity-100" : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    {s.time}
                    <span
                      className={`mt-2 block h-px w-full ${
                        i === idx ? "bg-current" : "bg-current opacity-25"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
