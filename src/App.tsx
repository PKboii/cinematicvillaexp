import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, scheduleRefresh, scrollApi } from "./lib/core";
import LoadingScreen from "./components/LoadingScreen";
import Cursor from "./components/Cursor";
import Navigation from "./components/Navigation";
import Hero from "./sections/Hero";
import House from "./sections/House";
import Architecture from "./sections/Architecture";
import Rooms from "./sections/Rooms";
import Pool from "./sections/Pool";
import DayTimeline from "./sections/DayTimeline";
import Location from "./sections/Location";
import Reserve from "./sections/Reserve";

export default function App() {
  const [entered, setEntered] = useState(false);

  /* Lenis smooth scroll, synced with GSAP's ticker */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    scrollApi.lenis = lenis;
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scrollApi.lenis = null;
    };
  }, []);

  /* Every layout-affecting event funnels into ONE debounced refresh,
     so pinned sections never desync from late-loading imagery. */
  useEffect(() => {
    const onLoad = () => scheduleRefresh(true);
    const onAnyImg = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.tagName === "IMG") scheduleRefresh();
    };
    window.addEventListener("load", onLoad);
    document.addEventListener("load", onAnyImg, true);
    document.fonts?.ready.then(() => scheduleRefresh(true)).catch(() => undefined);
    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("load", onAnyImg, true);
    };
  }, []);

  const handleEnter = () => {
    setEntered(true);
    scrollApi.lenis?.start();
    scheduleRefresh(true);
  };

  return (
    <div className="bg-ink text-ivory font-sans">
      <div className="grain" aria-hidden="true" />
      <LoadingScreen onEnter={handleEnter} />
      <Cursor />
      <Navigation entered={entered} />
      <main>
        <Hero entered={entered} />
        <House />
        <Architecture />
        <Rooms />
        <Pool />
        <DayTimeline />
        <Location />
        <Reserve />
      </main>
    </div>
  );
}
