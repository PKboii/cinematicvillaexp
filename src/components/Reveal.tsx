import { useEffect, useRef, type ReactNode } from "react";
import { gsap, EASE, prefersReducedMotion } from "../lib/core";

/* Simple fade + rise on entering the viewport */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 36,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          ease: EASE.out,
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* Line-masked editorial headline reveal */
export function MaskLines({
  lines,
  className = "",
  stagger = 0.13,
}: {
  lines: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-mask-line]"),
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.25,
          ease: EASE.heavy,
          stagger,
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [stagger]);
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span data-mask-line="" className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}

/* Wipe-in image with optional scroll parallax.
   Three separate transform targets — figure (clip), img (scale-once),
   wrapper (scrubbed drift) — so tweens can never overwrite each other. */
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
  const figRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const fig = figRef.current;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!fig || !wrap || !img || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fig,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.4,
          ease: EASE.heavy,
          scrollTrigger: { trigger: fig, start: "top 86%", once: true },
        }
      );
      gsap.fromTo(
        img,
        { scale: 1.18 },
        {
          scale: 1,
          duration: 1.8,
          ease: EASE.out,
          scrollTrigger: { trigger: fig, start: "top 86%", once: true },
        }
      );
      if (parallax) {
        gsap.fromTo(
          wrap,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: fig,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [parallax]);
  return (
    <figure ref={figRef} className={`overflow-hidden ${className}`}>
      <div ref={wrapRef} className="h-[112%] w-full -translate-y-[6%] will-change-transform">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    </figure>
  );
}
