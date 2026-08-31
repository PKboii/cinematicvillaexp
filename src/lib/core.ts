import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import type Lenis from "lenis";

export { gsap };

export const EASE = {
  out: "power3.out",
  soft: "power2.out",
  heavy: "expo.out",
  inOut: "power3.inOut",
} as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = (): boolean =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* ---------------- smooth scroll api ---------------- */

export const scrollApi: { lenis: Lenis | null } = { lenis: null };

export function scrollToTarget(target: string | number, offset = 0): void {
  if (typeof target === "string") {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (scrollApi.lenis) {
      scrollApi.lenis.scrollTo(el, { offset, duration: 1.6 });
    } else {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  } else if (scrollApi.lenis) {
    scrollApi.lenis.scrollTo(target, { duration: 1.4 });
  } else {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/* ---------------- shared image cache ---------------- */

const imageCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): HTMLImageElement {
  let img = imageCache.get(src);
  if (!img) {
    img = new Image();
    img.decoding = "async";
    img.src = src;
    imageCache.set(src, img);
  }
  return img;
}

export function preloadImages(
  srcs: string[],
  onProgress?: (p: number) => void
): Promise<void> {
  if (!srcs.length) {
    onProgress?.(1);
    return Promise.resolve();
  }
  let done = 0;
  return new Promise<void>((resolve) => {
    srcs.forEach((src) => {
      const img = getCachedImage(src);
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        done += 1;
        onProgress?.(done / srcs.length);
        if (done >= srcs.length) resolve();
      };
      if (img.complete && img.naturalWidth > 0) {
        queueMicrotask(finish);
        return;
      }
      img.addEventListener("load", finish, { once: true });
      img.addEventListener("error", finish, { once: true });
    });
  });
}

/* ---------------- hooks ---------------- */

export function useInView<T extends Element>(
  rootMargin = "0px 0px -8% 0px"
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref as unknown as RefObject<T>, inView];
}

export function useMagnetic<T extends HTMLElement>(strength = 0.3): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouchDevice() || prefersReducedMotion()) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.7, ease: "power3.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref as unknown as RefObject<T>;
}
