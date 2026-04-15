
export const clamp = (v, minV, maxV) => Math.min(maxV ?? v, Math.max(minV ?? v, v));

/**
 * Convert CSS length to px.
 * Supports: px | % | vw | vh | rem | em | number | 'auto'
 * - % / vw / vh are relative to viewport (Rnd is bounded to 'window')
 * - rem is relative to <html> computed font-size
 * - em  is relative to the dialog panel's computed font-size
 */
export const toPx = (
  val,
  axis = 'x',
  bounds = { vw: window.innerWidth, vh: window.innerHeight },
  bases = { rem: 16, em: 16 }
) => {
  if (val == null) return null;
  if (typeof val === 'number') return val;

  const s = String(val).trim().toLowerCase();
  if (s === 'auto') return null;
  if (s.endsWith('px')) return parseFloat(s);
  if (s.endsWith('vw')) return (parseFloat(s) / 100) * bounds.vw;
  if (s.endsWith('vh')) return (parseFloat(s) / 100) * bounds.vh;
  if (s.endsWith('%')) {
    const p = parseFloat(s) / 100;
    return axis === 'x' ? p * bounds.vw : p * bounds.vh;
  }
  if (s.endsWith('rem')) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n * (bases.rem || 16) : null;
  }
  if (s.endsWith('em')) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n * (bases.em || bases.rem || 16) : null;
  }

  // bare number treated as px
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

/** Resolve request/min/max to px, then clamp to get effective size */
export const resolveEffectiveSize = (
  reqW,
  reqH,
  minW,
  minH,
  maxW,
  maxH,
  bounds,
  bases
) => {
  const rW = toPx(reqW, 'x', bounds, bases);
  const rH = toPx(reqH, 'y', bounds, bases);
  const miW = toPx(minW, 'x', bounds, bases);
  const miH = toPx(minH, 'y', bounds, bases);
  const maW = toPx(maxW, 'x', bounds, bases);
  const maH = toPx(maxH, 'y', bounds, bases);

  const fallbackW = miW ?? 700;
  const fallbackH = miH ?? 600;

  const wantW = rW ?? fallbackW;
  const wantH = rH ?? fallbackH;

  return {
    width: clamp(wantW, miW ?? wantW, maW ?? wantW),
    height: clamp(wantH, miH ?? wantH, maH ?? wantH),
    minW: miW,
    minH: miH,
    maxW: maW,
    maxH: maH
  };
};

export const anchoredPosition = (
  w,
  h,
  anchorOriginX,
  anchorOriginY,
  anchorX,
  anchorY,
  bounds,
  bases
) => {
  const originX = toPx(anchorOriginX, 'x', bounds, bases) ?? 16;
  const originY = toPx(anchorOriginY, 'y', bounds, bases) ?? 16;
  const shiftX = anchorX === 'center' ? w / 2 : anchorX === 'end' ? w : 0;
  const shiftY = anchorY === 'center' ? h / 2 : anchorY === 'end' ? h : 0;

  return {
    x: clamp(originX - shiftX, 0, Math.max(0, bounds.vw - w)),
    y: clamp(originY - shiftY, 0, Math.max(0, bounds.vh - h))
  };
};