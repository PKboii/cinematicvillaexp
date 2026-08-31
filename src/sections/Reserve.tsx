import { useState, type FormEvent } from "react";
import { MaskLines, Reveal } from "../components/Reveal";
import { COORDS, NAV_LINKS } from "../data/content";
import { scrollToTarget, useMagnetic } from "../lib/core";

type Phase = "closed" | "form" | "sending" | "done";

export default function Reserve() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [email, setEmail] = useState("");
  const ctaRef = useMagnetic<HTMLButtonElement>(0.22);
  const today = new Date().toISOString().slice(0, 10);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!arrival || !departure) return;
    setPhase("sending");
    window.setTimeout(() => setPhase("done"), 1200);
  };

  return (
    <>
      <section
        id="reserve"
        aria-labelledby="reserve-title"
        className="relative bg-pine px-6 pt-28 pb-20 text-ivory md:px-14 md:pt-40"
      >
        <h2 id="reserve-title" className="sr-only">
          Reservation — your time at Aurelia
        </h2>
        <Reveal>
          <p className="label text-bronze">08 — RESERVATION</p>
        </Reveal>
        <MaskLines
          className="mt-8 font-display text-[15vw] leading-[0.92] font-medium tracking-tight md:text-[7.5vw]"
          lines={[
            <>YOUR TIME</>,
            <span key="a">
              <span className="font-light italic text-sand">AT</span> AURELIA.
            </span>,
          ]}
        />
        <Reveal delay={0.15} className="mt-9 max-w-md">
          <p className="text-[0.95rem] leading-relaxed text-ivory/70">
            Villa Aurelia is reserved privately, season by season. Tell us when —
            a residence curator will take care of the rest.
          </p>
        </Reveal>

        <div className="mt-12">
          {phase === "closed" && (
            <button
              ref={ctaRef}
              type="button"
              onClick={() => setPhase("form")}
              className="label-lg group inline-flex items-center gap-4 border border-ivory/40 px-9 py-4 transition-colors duration-500 hover:border-ivory hover:bg-ivory hover:text-ink"
              data-cursor="RESERVE"
            >
              CHECK AVAILABILITY
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </button>
          )}

          {phase === "form" && (
            <form onSubmit={submit} className="animate-fade-up max-w-2xl" aria-label="Reservation request">
              <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
                <div className="field">
                  <label htmlFor="arrival" className="label text-ivory/55">
                    ARRIVAL
                  </label>
                  <input
                    id="arrival"
                    type="date"
                    required
                    min={today}
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="departure" className="label text-ivory/55">
                    DEPARTURE
                  </label>
                  <input
                    id="departure"
                    type="date"
                    required
                    min={arrival || today}
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="guests" className="label text-ivory/55">
                    GUESTS
                  </label>
                  <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "GUEST" : "GUESTS"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="email" className="label text-ivory/55">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@somewhere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <p className="label mt-9 text-ivory/40">
                MINIMUM STAY — 3 NIGHTS · RATES ON REQUEST
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-7">
                <button
                  type="submit"
                  className="label-lg border border-bronze bg-bronze/10 px-8 py-4 text-bronze transition-colors duration-500 hover:bg-bronze hover:text-ink"
                >
                  REQUEST YOUR STAY
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("closed")}
                  className="label link-line text-ivory/60"
                >
                  CLOSE
                </button>
              </div>
            </form>
          )}

          {phase === "sending" && (
            <div className="flex items-center gap-6" role="status">
              <p className="label text-ivory/70">SENDING YOUR REQUEST</p>
              <div className="h-px w-44 overflow-hidden bg-ivory/15">
                <div className="scan-line h-full w-1/3 bg-bronze" />
              </div>
            </div>
          )}

          {phase === "done" && (
            <div className="animate-fade-up max-w-xl">
              <p className="font-display text-4xl font-light italic text-sand md:text-5xl">
                Request received.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                Our residence curator will write to you within one day — with
                availability for {arrival} → {departure}, {guests}{" "}
                {guests === "1" ? "guest" : "guests"}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase("closed");
                  setArrival("");
                  setDeparture("");
                  setEmail("");
                }}
                className="label-lg link-line mt-8 text-bronze"
              >
                MAKE ANOTHER REQUEST
              </button>
            </div>
          )}
        </div>

        <footer className="mt-28 border-t border-ivory/12 pt-16 md:mt-36">
          <p className="font-display text-[13.5vw] leading-[0.9] font-medium tracking-tight select-none md:text-[8.5vw]">
            VILLA <span className="font-light italic text-sand">AURELIA</span>
          </p>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            <nav aria-label="Footer">
              <p className="label text-ivory/45">INDEX</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.target}>
                    <button
                      type="button"
                      onClick={() => scrollToTarget(l.target)}
                      className="label-lg link-line text-ivory/75 transition-colors hover:text-ivory"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToTarget("#reserve")}
                    className="label-lg link-line text-ivory/75 transition-colors hover:text-ivory"
                  >
                    RESERVE
                  </button>
                </li>
              </ul>
            </nav>
            <div>
              <p className="label text-ivory/45">CONTACT</p>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm text-ivory/75">
                <li>
                  <a href="mailto:stay@villa-aurelia.in" className="link-line">
                    stay@villa-aurelia.in
                  </a>
                </li>
                <li>+91 832 240 0000</li>
                <li className="text-ivory/45">By appointment only</li>
              </ul>
            </div>
            <div>
              <p className="label text-ivory/45">COORDINATES</p>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm text-ivory/75">
                <li>{COORDS}</li>
                <li>SOUTH GOA — INDIA</li>
                <li className="text-ivory/45">BETWEEN EARTH &amp; OCEAN</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col gap-4 border-t border-ivory/12 pt-7 pb-2 md:flex-row md:items-center md:justify-between">
            <p className="label text-ivory/35">
              © 2026 VILLA AURELIA — A FICTIONAL CONCEPT EXPERIENCE
            </p>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="label link-line w-fit text-ivory/60"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </footer>
      </section>
    </>
  );
}
