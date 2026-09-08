import { DAY_STOPS } from "../data/content";
import { scrollToTarget, useReducedMotion } from "../lib/core";

export default function DayTimeline() {
  const reduced = useReducedMotion();

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
        <p className="label text-bronzedeep">06 — A DAY AT AURELIA</p>
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

  /* sticky-stacked day: each hour is a full panel that slides over the last.
     Pure CSS stacking — cannot desync, cannot overlap other sections. */
  return (
    <section id="day" aria-labelledby="day-title" className="relative">
      <h2 id="day-title" className="sr-only">
        A day at Aurelia — from first light to the stars
      </h2>
      {DAY_STOPS.map((s, i) => (
        <div
          key={s.time}
          id={`day-stop-${i}`}
          className="sticky top-0 h-svh overflow-hidden shadow-[0_-20px_60px_rgba(10,8,5,0.35)]"
          style={{ zIndex: i + 1 }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: s.bg, color: s.fg }}>
            <img
              src={s.image}
              alt={s.alt}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${s.bg}F2 0%, ${s.bg}B8 34%, ${s.bg}00 72%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(0deg, ${s.bg}CC 0%, ${s.bg}00 32%)` }}
            />

            <div className="absolute top-[16vh] left-6 md:top-[18vh] md:left-14">
              <p className="label opacity-75">06 — A DAY AT AURELIA</p>
              <p className="mt-6 font-display text-[17vw] leading-[0.9] font-medium tabular-nums md:text-[8vw]">
                {s.time}
              </p>
              <h3 className="mt-3 font-display text-2xl font-light italic md:text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-xs text-sm opacity-85 md:text-base">{s.copy}</p>
            </div>

            <div className="absolute right-6 bottom-7 left-6 md:right-14 md:left-14">
              <div
                className="flex items-end justify-between gap-4 overflow-x-auto"
                role="tablist"
                aria-label="Times of day"
              >
                {DAY_STOPS.map((t, k) => (
                  <button
                    key={t.time}
                    type="button"
                    role="tab"
                    aria-selected={k === i}
                    onClick={() => scrollToTarget(`#day-stop-${k}`)}
                    className={`label-lg shrink-0 pb-3 transition-opacity duration-300 ${
                      k === i ? "opacity-100" : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    {t.time}
                    <span
                      className={`mt-2 block h-px w-full ${
                        k === i ? "bg-current" : "bg-current opacity-25"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
