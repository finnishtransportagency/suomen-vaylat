import { FILLS, POINT_SHAPES } from "./styleConstants";

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
  // Attempt to use Oskari.custom.getSvg if available (keeps parity with your environment)
  try {
    if (typeof window !== 'undefined' && window.Oskari && window.Oskari.custom && typeof window.Oskari.custom.getSvg === 'function') {
      const { src, scale } = window.Oskari.custom.getSvg(imageDef);
      const size = (window.Oskari.custom.SVG_SIZE || 24) * (scale || 1);
      return (
        <div style={{ width: previewSize, height: previewSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={src} width={size} height={size} alt="" aria-hidden="true" />
        </div>
      );
    }
  } catch (e) {
    // ignore and fallback
  }

  // fallback to POINT_SHAPES preview node if defined
  const shapeIndex = imageDef?.shape ?? 0;
  const shape = POINT_SHAPES[shapeIndex];
  if (shape && shape.preview) {
    return <div style={{ width: previewSize, height: previewSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{shape.preview}</div>;
  }

  // final fallback: simple circle
  const r = Math.max(6, Math.floor(previewSize * 0.18));
  const cx = Math.floor(previewSize / 2);
  const cy = Math.floor(previewSize / 2);
  const fill = (imageDef?.fill && imageDef.fill.color) || '#F8931F';
  return (
    <svg width={previewSize} height={previewSize} viewBox={`0 0 ${previewSize} ${previewSize}`}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke="#333" strokeWidth="1" />
    </svg>
  );
};
