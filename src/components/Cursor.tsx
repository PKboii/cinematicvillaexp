import { useEffect, useRef, useState } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "../lib/core";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEnabled(!isTouchDevice() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotP = { ...pos };
    const ringP = { ...pos };
    let raf = 0;

    const loop = () => {
      dotP.x += (pos.x - dotP.x) * 0.55;
      dotP.y += (pos.y - dotP.y) * 0.55;
      ringP.x += (pos.x - ringP.x) * 0.14;
      ringP.y += (pos.y - ringP.y) * 0.14;
      gsap.set(dot, { x: dotP.x, y: dotP.y });
      gsap.set(ring, { x: ringP.x, y: ringP.y });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const setMode = (size: number, text: string | null) => {
      gsap.to(ring, {
        width: size,
        height: size,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 });
      if (text) label.textContent = text;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setMode(76, tagged.dataset.cursor ?? "VIEW");
        return;
      }
      if (t.closest("a, button, select, input, [role='button'], label")) {
        setMode(44, null);
        return;
      }
      setMode(14, null);
    };

    const onLeave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    const onEnterWin = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnterWin);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnterWin);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[98]">
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 mix-blend-difference"
      >
        <span
          ref={labelRef}
          className="label opacity-0"
          style={{ letterSpacing: "0.18em", fontSize: "0.55rem" }}
        />
      </div>
    </div>
  );
}
