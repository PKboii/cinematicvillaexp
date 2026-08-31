import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { getCachedImage } from "../lib/core";

export type ScrollSequenceHandle = { draw: (p: number) => void };

type Props = {
  frames: string[];
  className?: string;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  scale: number,
  dy: number
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let dw = w;
  let dh = h;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
  } else {
    dw = w;
    dh = w / ir;
  }
  dw *= scale;
  dh *= scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2 + dy, dw, dh);
}

/**
 * Canvas frame-sequence renderer. Scroll progress (0..1) is mapped onto the
 * frame set; between key frames the canvas cross-fades and drifts, which
 * reads as one continuous camera move without shipping hundreds of images.
 */
const ScrollSequence = forwardRef<ScrollSequenceHandle, Props>(function ScrollSequence(
  { frames, className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastP = useRef(0);

  const paint = (p: number) => {
    lastP.current = p;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const imgs = frames
      .map(getCachedImage)
      .filter((i) => i.complete && i.naturalWidth > 0);
    if (!imgs.length) return;

    const w = cv.width;
    const h = cv.height;
    const clamped = Math.min(Math.max(p, 0), 1);
    const seg = clamped * Math.max(imgs.length - 1, 1);
    const idx = Math.max(0, Math.min(imgs.length - 2, Math.floor(seg)));
    const t = imgs.length === 1 ? 0 : smooth(Math.min(seg - idx, 1));
    const zoom = 1.05 + clamped * 0.05;
    const dy = -clamped * h * 0.022;

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#12100c";
    ctx.fillRect(0, 0, w, h);
    drawCover(ctx, imgs[idx], w, h, zoom, dy);
    if (imgs[idx + 1]) {
      ctx.globalAlpha = t;
      drawCover(ctx, imgs[idx + 1], w, h, zoom, dy);
      ctx.globalAlpha = 1;
    }

    /* cinematic vignette for type legibility */
    const top = ctx.createLinearGradient(0, 0, 0, h * 0.34);
    top.addColorStop(0, "rgba(16,14,10,0.62)");
    top.addColorStop(1, "rgba(16,14,10,0)");
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, w, h * 0.34);
    const bot = ctx.createLinearGradient(0, h * 0.55, 0, h);
    bot.addColorStop(0, "rgba(16,14,10,0)");
    bot.addColorStop(1, "rgba(16,14,10,0.68)");
    ctx.fillStyle = bot;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
  };

  useImperativeHandle(ref, () => ({ draw: paint }));

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(cv.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(cv.clientHeight * dpr));
      paint(lastP.current);
    };
    resize();
    window.addEventListener("resize", resize);
    const repaint = () => paint(lastP.current);
    frames.forEach((f) => {
      const img = getCachedImage(f);
      if (!img.complete) img.addEventListener("load", repaint, { once: true });
    });
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
});

export default ScrollSequence;
