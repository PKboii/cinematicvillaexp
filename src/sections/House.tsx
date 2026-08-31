import { ImageReveal, MaskLines, Reveal } from "../components/Reveal";
import { IMG, MATERIALS } from "../data/content";

export default function House() {
  return (
    <section
      id="house"
      aria-labelledby="house-title"
      className="relative bg-ivory px-6 py-28 text-ink md:px-14 md:py-40"
    >
      <h2 id="house-title" className="sr-only">
        The house — shaped by the land
      </h2>
      <div className="grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Reveal>
              <p className="label text-bronzedeep">02 — THE HOUSE</p>
            </Reveal>
            <MaskLines
              className="mt-8 font-display text-[13vw] leading-[0.95] font-medium tracking-tight md:text-[4.9vw]"
              lines={[
                <>A HOUSE</>,
                <>SHAPED BY</>,
                <span key="i" className="font-light italic text-bronzedeep">
                  THE LAND.
                </span>,
              ]}
            />
            <Reveal delay={0.15} className="mt-10 max-w-md">
              <p className="text-[0.95rem] leading-relaxed text-ink/75">
                Villa Aurelia sits low between the jungle and the water — one long
                horizontal line of travertine, teak and glass. Nothing is imposed
                on the site. Everything is drawn from it.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-14">
              <p className="label mb-6 text-ink/50">MATERIALS</p>
              <ul className="flex flex-wrap gap-x-9 gap-y-6">
                {MATERIALS.map((m) => (
                  <li key={m.name} className="flex items-center gap-3">
                    <span
                      className="block h-9 w-9 border border-ink/15"
                      style={{ backgroundColor: m.hex }}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="label-lg block text-ink">{m.name}</span>
                      <span className="label block text-ink/45">{m.origin}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-7">
          <ImageReveal
            src={IMG.corridor}
            alt="Dark teak corridor framing the bright courtyard and pool beyond"
            className="h-[70vh] md:h-[86vh]"
            parallax
          />
          <Reveal className="mt-4 flex items-baseline justify-between">
            <p className="label text-ink/55">THE WEST CORRIDOR</p>
            <p className="label text-ink/35">FIG. 02</p>
          </Reveal>

          <ImageReveal
            src={IMG.garden}
            alt="Stone path winding through the dense tropical garden"
            className="mt-24 h-[52vh] md:mt-40 md:ml-auto md:h-[62vh] md:w-[80%]"
            parallax
          />
          <Reveal className="mt-4 flex items-baseline justify-between md:w-[80%] md:ml-auto">
            <p className="label text-ink/55">THE GARDEN, KEPT WILD</p>
            <p className="label text-ink/35">FIG. 03</p>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-28 max-w-3xl md:mt-40">
        <p className="font-display text-2xl leading-snug font-light italic text-ink/75 md:text-4xl">
          “We didn’t design a house. We designed a way of walking from the jungle
          to the sea.”
        </p>
        <p className="label mt-6 text-ink/50">N. KAMAT — ARCHITECT</p>
      </Reveal>
    </section>
  );
}
