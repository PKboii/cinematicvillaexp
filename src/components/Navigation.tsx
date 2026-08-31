import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, scrollToTarget, scrollApi, EASE } from "../lib/core";
import { ambient } from "../lib/audio";
import { CHAPTERS, COORDS, NAV_LINKS } from "../data/content";

export default function Navigation({ entered }: { entered: boolean }) {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [chapter, setChapter] = useState({ num: "01", name: "ARRIVAL" });
  const progressRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  /* chapter tracker + scroll progress */
  useEffect(() => {
    if (!entered) return;
    const ctx = gsap.context(() => {
      CHAPTERS.forEach((c) => {
        ScrollTrigger.create({
          trigger: `#${c.id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setChapter({ num: c.num, name: c.name });
          },
        });
      });
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [entered]);

  /* full-screen menu choreography */
  useEffect(() => {
    if (prefersReduced()) {
      if (open) scrollApi.lenis?.stop();
      else scrollApi.lenis?.start();
      return;
    }
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (open) {
      scrollApi.lenis?.stop();
      const tl = gsap.timeline();
      tl.fromTo(
        overlay,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: EASE.inOut },
        0
      ).fromTo(
        linksRef.current?.querySelectorAll("[data-menu-link]") ?? [],
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: EASE.heavy, stagger: 0.07 },
        0.25
      );
      return () => {
        tl.kill();
      };
    }
    scrollApi.lenis?.start();
    return undefined;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleSound = () => setSoundOn(ambient.toggle());

  const go = (target: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToTarget(target), open ? 350 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] mix-blend-difference transition-opacity duration-700 ${
          entered ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 text-ivory md:h-20 md:px-10">
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="font-display text-sm font-medium tracking-[0.24em] md:text-base"
            aria-label="Villa Aurelia — back to top"
          >
            VILLA AURELIA
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.target}
                type="button"
                onClick={() => go(l.target)}
                className="label link-line text-ivory/85 transition-colors hover:text-ivory"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-5 md:gap-7">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="label link-line hidden text-ivory/70 transition-colors hover:text-ivory md:block"
            >
              SOUND {soundOn ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => go("#reserve")}
              className="label-lg border border-ivory/50 px-4 py-2 transition-colors duration-400 hover:bg-ivory hover:text-ink md:px-5"
            >
              RESERVE
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span className="block h-px w-6 bg-ivory" />
              <span className="block h-px w-6 bg-ivory" />
            </button>
          </div>
        </div>
      </header>

      {/* chapter + progress */}
      <div
        className={`fixed bottom-6 left-5 z-[65] hidden items-baseline gap-3 mix-blend-difference transition-opacity duration-700 md:flex md:left-10 ${
          entered && !open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <span className="font-display text-xl font-light italic text-ivory">{chapter.num}</span>
        <span className="label text-ivory/70">{chapter.name}</span>
        <span className="label text-ivory/40">/ 08</span>
      </div>
      <div
        className={`fixed bottom-6 right-5 z-[65] hidden h-24 w-px mix-blend-difference md:right-10 md:block ${
          entered && !open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div className="h-full w-px bg-ivory/20">
          <span ref={progressRef} className="block h-full w-px origin-top bg-ivory" />
        </div>
      </div>

      {/* full-screen menu */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[80] flex flex-col justify-between overflow-y-auto bg-pine px-6 py-24 text-ivory md:px-14 md:py-20"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm tracking-[0.24em]">VILLA AURELIA</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="label link-line text-ivory/80"
            >
              CLOSE ✕
            </button>
          </div>

          <nav ref={linksRef} aria-label="Menu" className="flex flex-col gap-1 md:gap-2">
            {NAV_LINKS.map((l, i) => (
              <span key={l.target} className="block overflow-hidden">
                <button
                  data-menu-link
                  type="button"
                  onClick={() => go(l.target)}
                  className="group flex w-full items-baseline gap-5 py-1 text-left font-display text-[11vw] leading-[1.05] font-light transition-colors duration-300 hover:text-sand md:text-[5.5vw]"
                >
                  <span className="label text-bronze">0{i + 1}</span>
                  {l.label}
                </button>
              </span>
            ))}
            <span className="block overflow-hidden">
              <button
                data-menu-link
                type="button"
                onClick={() => go("#reserve")}
                className="flex w-full items-baseline gap-5 py-1 text-left font-display text-[11vw] leading-[1.05] font-light italic text-sand md:text-[5.5vw]"
              >
                <span className="label text-bronze">06</span>
                RESERVE
              </button>
            </span>
          </nav>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <p className="label text-ivory/50">{COORDS} — SOUTH GOA, INDIA</p>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="label link-line w-fit text-ivory/70"
            >
              SOUND {soundOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
