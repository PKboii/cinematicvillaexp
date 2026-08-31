/* ------------------------------------------------------------------ */
/*  VILLA AURELIA — content, imagery and scene data                    */
/*  All imagery is generated for this project and served from a        */
/*  central CDN. Swap the IMG map to re-host without touching code.    */
/* ------------------------------------------------------------------ */

const cdn = (id: string) =>
  `https://image.qwenlm.ai/generated-images/${id}/_result.png`;

export const IMG = {
  aerial: cdn("a3553ed6-91d5-44fc-bf7f-aaf3c72e0d20"),
  exterior: cdn("048bfe23-524d-4fec-974c-2460fd1c7ade"),
  corridor: cdn("6223e16f-8b91-48da-bc20-26a9968041ff"),
  living: cdn("cf3be712-5ba9-4a50-a933-9637f38fe414"),
  poolEdge: cdn("a7f08bee-a23b-4e4b-b9e7-a0251d5bc193"),
  master: cdn("f2341755-7d01-47e7-9c47-a2f21c4fddbc"),
  dining: cdn("6facf77e-fdf8-4f19-a031-1fe26b6cc58e"),
  water: cdn("3684fe9a-3775-417f-be59-9ee8e8b8ef3b"),
  garden: cdn("2834b7ba-dd63-4445-86a3-fe2c8ed76930"),
  night: cdn("1dae8c63-26cb-459f-b7c7-cfdad263b603"),
} as const;

/** Frames of the arrival sequence — jungle approach → ocean. */
export const HERO_FRAMES: string[] = [
  IMG.aerial,
  IMG.exterior,
  IMG.corridor,
  IMG.living,
  IMG.poolEdge,
];

export const NAV_LINKS = [
  { label: "EXPLORE", target: "#model" },
  { label: "THE HOUSE", target: "#house" },
  { label: "ROOMS", target: "#rooms" },
  { label: "EXPERIENCE", target: "#day" },
  { label: "LOCATION", target: "#location" },
] as const;

export const CHAPTERS = [
  { id: "arrival", num: "01", name: "ARRIVAL" },
  { id: "house", num: "02", name: "THE HOUSE" },
  { id: "architecture", num: "03", name: "ARCHITECTURE" },
  { id: "model", num: "04", name: "THE MODEL" },
  { id: "rooms", num: "05", name: "THE ROOMS" },
  { id: "pool", num: "06", name: "THE POOL" },
  { id: "day", num: "07", name: "THE DAY" },
  { id: "location", num: "08", name: "LOCATION" },
  { id: "reserve", num: "09", name: "RESERVATION" },
] as const;

export type Room = {
  num: string;
  name: string;
  area: string;
  view: string;
  line: string;
  image: string;
  alt: string;
};

export const ROOMS: Room[] = [
  {
    num: "01",
    name: "MASTER SUITE",
    area: "68 M²",
    view: "OCEAN — EAST",
    line: "Linen, teak, and the first light over water.",
    image: IMG.master,
    alt: "Master suite with ivory linen bed, teak slat wall and morning ocean light",
  },
  {
    num: "02",
    name: "OCEAN SUITE",
    area: "54 M²",
    view: "HORIZON — SOUTH",
    line: "The horizon is the only artwork.",
    image: IMG.poolEdge,
    alt: "Infinity pool edge meeting the Arabian Sea horizon at golden hour",
  },
  {
    num: "03",
    name: "GARDEN SUITE",
    area: "49 M²",
    view: "CANOPY — WEST",
    line: "You wake under the jungle, not beside it.",
    image: IMG.garden,
    alt: "Stone path winding through dense tropical garden in misty morning light",
  },
  {
    num: "04",
    name: "LIVING PAVILION",
    area: "120 M²",
    view: "POOL — SOUTH",
    line: "A room with no doors.",
    image: IMG.living,
    alt: "Double-height living pavilion with linen sofas opening to pool and sea",
  },
  {
    num: "05",
    name: "DINING PAVILION",
    area: "60 M²",
    view: "TERRACE — DUSK",
    line: "The table moves outside at six.",
    image: IMG.dining,
    alt: "Outdoor dining terrace at dusk with long teak table, candles and lanterns",
  },
];

export type HotspotId = "master" | "pool" | "living" | "dining" | "garden";

export type Hotspot = {
  id: HotspotId;
  num: string;
  name: string;
  copy: string;
  image: string;
  marker: [number, number, number];
  camPos: [number, number, number];
  camTarget: [number, number, number];
};

export const OVERVIEW_CAM = {
  pos: [17, 11.5, 19] as [number, number, number],
  target: [0, 0.8, 1] as [number, number, number],
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "master",
    num: "01",
    name: "MASTER SUITE",
    copy: "The master wing floats above the living pavilion — teak, linen and the first light over water.",
    image: IMG.master,
    marker: [-4.2, 5.7, -1.5],
    camPos: [-11, 7.5, 7.5],
    camTarget: [-4.2, 3.6, -1.5],
  },
  {
    id: "pool",
    num: "02",
    name: "INFINITY POOL",
    copy: "Twenty-four metres, salt-filtered, aligned so precisely to the horizon that the edge disappears.",
    image: IMG.water,
    marker: [-1, 1.15, 8],
    camPos: [-1.5, 5.5, 16.5],
    camTarget: [-1, 0.3, 8],
  },
  {
    id: "living",
    num: "03",
    name: "LIVING PAVILION",
    copy: "A room with no doors. Glass on three sides — on the fourth, the pool.",
    image: IMG.living,
    marker: [-2.4, 3.9, 1.4],
    camPos: [-2.5, 3.4, 9],
    camTarget: [-2.8, 1.4, -1.5],
  },
  {
    id: "dining",
    num: "04",
    name: "DINING TERRACE",
    copy: "Dinner moves outside at dusk — a long teak table under the palms.",
    image: IMG.dining,
    marker: [3.4, 3.3, -1.5],
    camPos: [10, 4.5, 7.5],
    camTarget: [3.4, 1, -1.5],
  },
  {
    id: "garden",
    num: "05",
    name: "GARDEN",
    copy: "Two thousand square metres of jungle, kept wild on purpose.",
    image: IMG.garden,
    marker: [10, 2.3, 5],
    camPos: [16, 6, 12.5],
    camTarget: [9.5, 0.6, 4.5],
  },
];

export type DayStop = {
  time: string;
  title: string;
  copy: string;
  bg: string;
  fg: string;
  image: string;
  alt: string;
};

export const DAY_STOPS: DayStop[] = [
  {
    time: "06:30",
    title: "FIRST LIGHT",
    copy: "The pool turns bronze before the house wakes.",
    bg: "#e3d3b2",
    fg: "#241f15",
    image: IMG.exterior,
    alt: "Villa exterior in the first warm light of sunrise",
  },
  {
    time: "09:00",
    title: "LONG BREAKFAST",
    copy: "Coffee on the terrace. The sea already warm.",
    bg: "#efe8d7",
    fg: "#251f15",
    image: IMG.living,
    alt: "Morning light raking across the living pavilion floor",
  },
  {
    time: "13:00",
    title: "STILL WATER",
    copy: "Noon belongs to the pool — and to nothing else.",
    bg: "#d9e0d2",
    fg: "#232920",
    image: IMG.water,
    alt: "Sunlight caustics under the surface of the pool",
  },
  {
    time: "17:45",
    title: "GOLDEN HOUR",
    copy: "Twenty minutes when everything is amber.",
    bg: "#debd8c",
    fg: "#2a2013",
    image: IMG.poolEdge,
    alt: "Infinity pool edge dissolving into the golden sea horizon",
  },
  {
    time: "20:30",
    title: "DINNER OUTSIDE",
    copy: "Lanterns, teak, a long table under the palms.",
    bg: "#38302a",
    fg: "#efe6d4",
    image: IMG.dining,
    alt: "Dining terrace at night lit by candles and woven lanterns",
  },
  {
    time: "23:00",
    title: "UNDER THE STARS",
    copy: "The house goes dark. The sky doesn't.",
    bg: "#131a14",
    fg: "#e8e2d2",
    image: IMG.night,
    alt: "Villa at night glowing warm against a deep starlit sky",
  },
];

export type PlanRoom = {
  id: string;
  name: string;
  area: string;
  note: string;
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
  labelX?: number;
  labelY?: number;
};

export const PLAN_ROOMS: PlanRoom[] = [
  {
    id: "living",
    name: "LIVING PAVILION",
    area: "120 M²",
    note: "A room with no doors — glass on three sides, the pool on the fourth.",
    image: IMG.living,
    x: 70,
    y: 120,
    w: 250,
    h: 190,
  },
  {
    id: "dining",
    name: "DINING PAVILION",
    area: "60 M²",
    note: "The table moves outside at dusk. It rarely comes back.",
    image: IMG.dining,
    x: 320,
    y: 120,
    w: 150,
    h: 190,
  },
  {
    id: "master",
    name: "MASTER SUITE",
    area: "68 M²",
    note: "First light over the water. Drawn teak, deep linen.",
    image: IMG.master,
    x: 470,
    y: 90,
    w: 250,
    h: 150,
  },
  {
    id: "ocean",
    name: "OCEAN SUITE",
    area: "54 M²",
    note: "The horizon is the only artwork.",
    image: IMG.poolEdge,
    x: 470,
    y: 240,
    w: 125,
    h: 125,
  },
  {
    id: "garden-suite",
    name: "GARDEN SUITE",
    area: "49 M²",
    note: "Waking under the canopy.",
    image: IMG.garden,
    x: 595,
    y: 240,
    w: 125,
    h: 125,
  },
  {
    id: "terrace",
    name: "TERRACE",
    area: "96 M²",
    note: "Travertine, kept cool by the afternoon sea breeze.",
    image: IMG.exterior,
    x: 70,
    y: 310,
    w: 400,
    h: 30,
  },
  {
    id: "pool",
    name: "INFINITY POOL",
    area: "24 M",
    note: "Salt-filtered, heated, aligned to the horizon.",
    image: IMG.water,
    x: 70,
    y: 340,
    w: 400,
    h: 90,
  },
  {
    id: "garden",
    name: "GARDEN",
    area: "2,000 M²",
    note: "Kept wild on purpose.",
    image: IMG.garden,
    x: 470,
    y: 365,
    w: 250,
    h: 65,
  },
];

export const MATERIALS = [
  { name: "TRAVERTINE", origin: "RAJASTHAN", hex: "#d3c5a4" },
  { name: "TEAK", origin: "KERALA", hex: "#5c4630" },
  { name: "CONCRETE", origin: "CAST ON SITE", hex: "#a9a496" },
  { name: "BRONZE", origin: "BRUSHED", hex: "#a9834f" },
  { name: "LINEN", origin: "UNDYED", hex: "#e6dcc6" },
] as const;

export const DISTANCES = [
  ["DABOLIM AIRPORT", "42 MIN"],
  ["OLD GOA", "28 MIN"],
  ["PANJIM", "33 MIN"],
  ["PRIVATE BEACH", "4 MIN WALK"],
  ["ARABIAN SEA", "AT THE GATE"],
] as const;

export const COORDS = "15.29° N — 73.92° E";
