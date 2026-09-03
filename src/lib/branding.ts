/**
 * Generazione della scala di tinte a partire da un solo colore.
 *
 * L'interfaccia usa dieci gradazioni del colore principale (brand-50 … 950).
 * Chiedere all'amministratore di sceglierle tutte sarebbe assurdo: qui se ne
 * ricava l'intera scala da un unico esadecimale, replicando la forma della
 * palette di riferimento — luminosità decrescente e saturazione leggermente
 * più alta ai due estremi, come nelle scale di Tailwind.
 *
 * I valori sono esposti come canali RGB separati da spazio ("29 99 241"),
 * il formato richiesto da `rgb(var(--brand-600) / <alpha-value>)`: così le
 * utility di opacità di Tailwind continuano a funzionare.
 */

export const DEFAULT_PRIMARY_COLOR = '#164ede';

/** Luminosità (0-100) di ciascun gradino della scala. */
const LIGHTNESS: Record<number, number> = {
  50: 96,
  100: 92,
  200: 85,
  300: 74,
  400: 62,
  500: 53,
  600: 47,
  700: 42,
  800: 36,
  900: 31,
  950: 21,
};

/** Fattore applicato alla saturazione: i toni chiari sono meno saturi. */
const SATURATION_FACTOR: Record<number, number> = {
  50: 0.65,
  100: 0.75,
  200: 0.85,
  300: 0.92,
  400: 0.97,
  500: 1,
  600: 1,
  700: 0.98,
  800: 0.94,
  900: 0.88,
  950: 0.8,
};

export const BRAND_STEPS = Object.keys(LIGHTNESS).map(Number);

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeHex(hex: string): string {
  const v = hex.trim().replace('#', '');
  return v.length === 3
    ? v
        .split('')
        .map((c) => c + c)
        .join('')
    : v;
}

function hexToRgb(hex: string): [number, number, number] {
  const v = normalizeHex(hex);
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  const [r1, g1, b1] =
    hp < 1 ? [c, x, 0]
    : hp < 2 ? [x, c, 0]
    : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c]
    : hp < 5 ? [x, 0, c]
    : [c, 0, x];

  const m = ln - c / 2;
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Quanto lo scostamento di luminosità del colore scelto si propaga agli altri
 * gradini: pieno sul 600, sempre più attenuato verso gli estremi, così i toni
 * chiarissimi restano chiari e quelli scurissimi restano scuri anche se il
 * colore scelto è molto acceso o molto cupo.
 */
function shiftWeight(step: number): number {
  const distance = Math.abs(step - 600) / 550; // 0 sul 600, ~1 sugli estremi
  return 1 - 0.8 * distance;
}

/**
 * Scala completa come canali RGB: { 50: "238 246 255", … }
 *
 * Il gradino 600 — quello dei pulsanti principali — è esattamente il colore
 * scelto dall'amministratore, non una sua approssimazione.
 */
export function buildBrandScale(primaryColor: string): Record<number, string> {
  const hex = isValidHexColor(primaryColor) ? primaryColor : DEFAULT_PRIMARY_COLOR;
  const [r0, g0, b0] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r0, g0, b0);
  const delta = l - LIGHTNESS[600]!;

  const scale: Record<number, string> = {};
  for (const step of BRAND_STEPS) {
    if (step === 600) {
      scale[step] = `${r0} ${g0} ${b0}`;
      continue;
    }
    const saturation = clamp(s * SATURATION_FACTOR[step]!, 0, 100);
    const lightness = clamp(LIGHTNESS[step]! + delta * shiftWeight(step), 4, 98);
    const [r, g, b] = hslToRgb(h, saturation, lightness);
    scale[step] = `${r} ${g} ${b}`;
  }
  return scale;
}

/** Blocco CSS da iniettare nel layout per sovrascrivere la palette. */
export function brandScaleToCss(primaryColor: string): string {
  const scale = buildBrandScale(primaryColor);
  const vars = BRAND_STEPS.map((step) => `--brand-${step}: ${scale[step]};`).join('');
  return `:root{${vars}}`;
}

/** Esadecimale di un singolo gradino: serve al PDF, che non usa i CSS. */
export function brandHex(primaryColor: string, step = 700): string {
  const [r, g, b] = buildBrandScale(primaryColor)[step]!.split(' ').map(Number);
  return `#${[r, g, b].map((v) => v!.toString(16).padStart(2, '0')).join('')}`;
}
