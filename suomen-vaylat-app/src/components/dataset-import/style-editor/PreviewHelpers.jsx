import { FILLS, MARKER_SVGS } from "./styleConstants";

const PATH_AREA = 'M10,25L70,15L50,70Z';
const PATH_LINE = 'M10,20L30,60L70,40';
const AREA_CAP = 'butt';

let patternIdCounter = 1;

const isSolid = (patternValue) => patternValue === FILLS.SOLID;

/* Fill pattern defs using the provided FillPatternSvgPreview is kept for the pattern render,
   but for area preview we accept either solid color or pattern url. */
export const AreaPreview = ({ previewSize = 56, strokeDef = {}, fillDef = {} }) => {
  const { color: strokeColor = '#000', width = 1, lineDash = 'solid', lineJoin = 'round' } = strokeDef;
  const { color: fillColor = '#FAEBD7', area = {} } = fillDef;
  const pattern = area?.pattern ?? FILLS.SOLID;

  const dashArray = lineDash === 'dash' ? `5 ${4 + width}` : '';
  const id = `preview-fill-pattern-${patternIdCounter++}`;

  const solid = isSolid(pattern);
  const fill = solid ? fillColor : `url(#${id})`;

  return (
    <svg width={previewSize} height={previewSize} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      {!solid && (
        <defs>
          {/* use FillPatternSvgPreview output as the visual pattern by rendering it into a pattern element */}
          {/* Since FillPatternSvgPreview returns an SVG element, we instead render a small pattern manually resembling it */}
          {/* lightweight pattern approximations to keep things simple in preview */}
          <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
            {/* draw a line depending on pattern value */}
            {pattern === FILLS.THIN_HORIZONTAL && (
              <>
                <rect width="8" height="8" fill="#fff" />
                <line x1="0" y1="4" x2="8" y2="4" stroke={fillColor} strokeWidth="1" />
              </>
            )}
            {pattern === FILLS.THICK_HORIZONTAL && (
              <>
                <rect width="8" height="8" fill="#fff" />
                <line x1="0" y1="4" x2="8" y2="4" stroke={fillColor} strokeWidth="2" />
              </>
            )}
            {pattern === FILLS.THIN_DIAGONAL && (
              <>
                <rect width="8" height="8" fill="#fff" />
                <line x1="0" y1="8" x2="8" y2="0" stroke={fillColor} strokeWidth="1" />
              </>
            )}
            {pattern === FILLS.THICK_DIAGONAL && (
              <>
                <rect width="8" height="8" fill="#fff" />
                <line x1="0" y1="8" x2="8" y2="0" stroke={fillColor} strokeWidth="2" />
              </>
            )}
            {pattern === FILLS.TRANSPARENT && (
              <>
                <rect width="8" height="8" fill="#fff" />
                <rect width="4" height="4" fill="#e5e7ef" />
              </>
            )}
            {/* fallback */}
            {pattern === FILLS.SOLID && <rect width="8" height="8" fill={fillColor} />}
          </pattern>
        </defs>
      )}

      <path
        d={PATH_AREA}
        stroke={strokeColor}
        strokeWidth={width}
        fill={fill}
        strokeLinejoin={lineJoin}
        strokeLinecap={AREA_CAP}
        strokeDasharray={dashArray}
      />
    </svg>
  );
};

export const LinePreview = ({ previewSize = 56, strokeDef = {} }) => {
  const { color = '#000', width = 2, lineCap = 'round', lineDash = 'solid', lineJoin = 'round' } = strokeDef;
  const dashArray = lineDash === 'dash' ? `5 ${4 + width}` : '';
  return (
    <svg width={previewSize} height={previewSize} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <path
        d={PATH_LINE}
        strokeWidth={width}
        strokeLinejoin={lineJoin}
        strokeLinecap={lineCap}
        strokeDasharray={dashArray}
        stroke={color}
        fill="transparent"
      />
    </svg>
  );
};

export const PointPreview = ({ imageDef = {}, previewSize = 56 }) => {

  // Map imageDef.size (1..5) to fixed pixel range 25..45
  const sizeValue = Math.min(5, Math.max(1, Number(imageDef?.size ?? 3)));
  const MIN_PIX = 25;
  const MAX_PIX = 45;
  const sizePx = Math.round(MIN_PIX + ((sizeValue - 1) / (5 - 1)) * (MAX_PIX - MIN_PIX));

  // colors and stroke
  const fillColor = (imageDef?.fill && imageDef.fill.color) || '#F8931F';
  const strokeColor = (imageDef?.stroke && imageDef.stroke.color) || '#333';
  const strokeWidth = imageDef?.stroke?.width ?? 1;

  // Use raw MARKER_SVGS string, parse, patch attributes and render
  const shapeIndex = Math.max(0, Math.min((imageDef.shape ?? 0), (MARKER_SVGS.length - 1)));
  const rawSvg = MARKER_SVGS[shapeIndex] || '';

  if (rawSvg) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      if (svgEl) {
        svgEl.setAttribute('width', String(sizePx));
        svgEl.setAttribute('height', String(sizePx));
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        svgEl.querySelectorAll('[fill]').forEach((el) => {
          try {
            const v = el.getAttribute('fill');
            if (v && v.toLowerCase() !== 'none' && !/^url\(/i.test(v)) {
              el.setAttribute('fill', fillColor);
            }
          } catch (ignore) {}
        });

        svgEl.querySelectorAll('[stroke]').forEach((el) => {
          try {
            el.setAttribute('stroke', strokeColor);
          } catch (ignore) {}
        });

        svgEl.querySelectorAll('[stroke-width]').forEach((el) => {
          try {
            el.setAttribute('stroke-width', String(strokeWidth));
          } catch (ignore) {}
        });

        // fallback root attributes if no inner elements had them
        if (!svgEl.querySelector('[fill]')) {
          svgEl.setAttribute('fill', fillColor);
        }
        if (!svgEl.querySelector('[stroke]')) {
          svgEl.setAttribute('stroke', strokeColor);
        }

        const serializer = new XMLSerializer();
        const patchedSvg = serializer.serializeToString(svgEl);

        return (
          <div
            style={{
              width: previewSize,
              height: previewSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: patchedSvg }}
          />
        );
      }
    } catch (err) {
      // parsing/patching failed -> fall through to final fallback
    }
  }

  // final fallback: simple circle sized by sizePx (keeps it from being too small)
  const r = Math.max(6, Math.round(sizePx / 2));
  const cx = Math.round(previewSize / 2);
  const cy = Math.round(previewSize / 2);
  return (
    <svg width={previewSize} height={previewSize} viewBox={`0 0 ${previewSize} ${previewSize}`} aria-hidden="true" focusable="false">
      <circle cx={cx} cy={cy} r={r} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
  );
};