import { useEffect, useRef, type ReactNode } from "react";
import { isTouchDevice, prefersReducedMotion, useInView, useReducedMotion } from "../lib/core";

/* ---------- fade + rise ---------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 34,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ["--reveal-y" as never]: `${y}px` }}
    >
      {children}
    </div>
  );
}

/* ---------- line-masked headline ---------- */

export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  stagger = 0.13,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden ${lineClassName}`}>
          <span
            className={`mask-line ${inView ? "mask-line-in" : ""}`}
            style={{ transitionDelay: `${i * stagger}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ---------- clip-wipe image, optional rAF parallax ---------- */

export function ImageReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
  parallax = false,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  eager?: boolean;
}) {
  const [figRef, inView] = useInView<HTMLElement>();
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  const useParallax = parallax && !reduced && !isTouchDevice();

  /* lightweight rAF drift — separate element from the wipe/scale, so
     nothing can ever fight anything */
  useEffect(() => {
    if (!useParallax || !innerRef.current || !figRef.current) return;
    const fig = figRef.current;
    const inner = innerRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = fig.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      const mid = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5 in view
      inner.style.transform = `translate3d(0, ${(-mid * 7).toFixed(3)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [useParallax, figRef]);

  return (
    <figure ref={figRef} className={`img-clip ${inView ? "img-clip-in" : ""} overflow-hidden ${className}`}>
      <div ref={innerRef} className={`h-full w-full ${useParallax ? "h-[112%] -mt-[6%]" : ""}`}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={`img-settle ${inView ? "img-settle-in" : ""} h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    </figure>
  );
}
