import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  cloneElement
} from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import {
  faTimes,
  faWindowMaximize,
  faWindowMinimize,
  faWindowRestore,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isMobile, theme } from '../../theme/theme';
import { Tooltip } from 'react-tooltip';

/* ---------------- Constants ---------------- */

const MIN_SCREEN_WIDTH_MAXIMIZE = 500;

/* ---------------- Styled ---------------- */

/** Rnd: only responsible for size/position/stacking. */
const StyledRnd = styled(Rnd)``;

/** Panel lives INSIDE Rnd and fills it; holds the visual card styles. */
const Panel = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.colors.mainWhite};
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* safely clip content here without clipping handles */

  @media ${(p) => p.theme.device.mobileL} {
    border-radius: ${(p) => (p.$fullScreenOnMobile ? '0px' : '4px')};
    max-width: unset;
    min-width: unset;
    max-height: unset;
  }
`;

const Header = styled.div`
  z-index: 10;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(p) =>
    p.$type === 'warning'
      ? p.theme.colors.secondaryColorDarkOrange
      : p.theme.colors.mainColor1Selected};
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 0 16px;

  /* react-rnd drag handle */
  &.dialog-header {
    cursor: ${(p) => (p.$drag ? 'grab' : 'default')};
    &:active {
      cursor: ${(p) => (p.$drag ? 'grabbing' : 'default')};
    }
  }

  svg {
    color: ${(p) => p.theme.colors.mainWhite};
  }
  @media ${(p) => p.theme.device.mobileL} {
    pointer-events: none;
    svg {
      pointer-events: auto;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  p {
    margin: 0 1rem 0 0;
    font-size: 20px;
    font-weight: bold;
    color: ${(p) => p.theme.colors.mainWhite};
  }
  svg {
    font-size: 20px;
    margin-right: 16px;
  }

  @media ${(p) => p.theme.device.mobileL} {
    p {
      font-size: 16px;
    }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderBtn = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  padding: 8px;
  cursor: pointer;
  svg {
    font-size: 18px;
  }
`;
const CloseBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
`;
const CloseIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-height: 0; /* critical for proper flexbox scrolling */
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

/** Optional backdrop per dialog (sits just under dialog) */
const StyledDialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;

/* ---------------- Utils ---------------- */

const toPxNumber = (v) => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/(-?\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
};

/**
 * Convert CSS length to px. Supports: px, vw, vh, %, number
 * For % we treat it as percentage of viewport/bounds (practical default).
 */
const lenToPx = (
  val,
  axis = 'y',
  bounds = { vw: window.innerWidth, vh: window.innerHeight }
) => {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const s = String(val).trim().toLowerCase();
  if (s.endsWith('px')) return parseFloat(s);
  if (s.endsWith('vw')) return (parseFloat(s) / 100) * bounds.vw;
  if (s.endsWith('vh')) return (parseFloat(s) / 100) * bounds.vh;
  if (s.endsWith('%')) {
    const p = parseFloat(s) / 100;
    return axis === 'x' ? p * bounds.vw : p * bounds.vh;
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

const numberOr = (v, fb) => {
  const n = toPxNumber(v);
  return Number.isFinite(n) ? n : fb;
};

const clamp = (v, minV, maxV) => Math.min(maxV ?? v, Math.max(minV ?? v, v));

/* A tiny global z-index counter so the last focused dialog comes on top */
let __zCounter = 9993;

/* ---------------- Component ---------------- */

const Dialog = ({
  drag = true,
  resize = true,
  backdrop = false, // show per-dialog backdrop under this dialog
  fullScreenOnMobile = false,
  title,
  titleIcon,
  type, // 'normal' | 'warning' | 'announcement'
  hasHelp,
  helpId,
  helpContent,
  closeAction,
  minimizable,
  minimize = null,
  minimizeAction,
  maximizable,
  maximize = false,
  maximizeAction,

  /** Sizing (strings or numbers) */
  width = 'auto', // initial width fallback chain uses minWidth -> 600 if needed
  height = 'auto', // initial height fallback chain uses minHeight -> 400; then we auto-fit height
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,

  /** Anchor-based positioning (initial only) */
  anchorOriginX = '30%', // 'px' | '%' | 'vw' | number
  anchorOriginY = '30%', // 'px' | '%' | 'vh' | number
  anchorX = 'start', // 'start' | 'center' | 'end' (how dialog is anchored horizontally)
  anchorY = 'start', // 'start' | 'center' | 'end' (how dialog is anchored vertically)

  /** Resize sides config (optional object) */
  enableResizingSides,

  /** Auto-fit behavior */
  fitHeightOnOpen = true, // auto-fit height to content on first open
  viewportMarginY = 16, // breathing room vs viewport top/bottom

  /** Content */
  children,

  /** Styling */
  style = {}
}) => {
    console.log(title)
  const [localState, setLocalState] = useState(type === 'announcement');

  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  // Stop auto-fitting after the user resizes
  const [userResized, setUserResized] = useState(false);

  const handleAnnouncementDialog = (selected, id) => {
    setLocalState(false);
    setTimeout(() => {
      closeAction?.(selected, id);
    }, 500);
  };

  const renderedChildren =
    type !== 'announcement'
      ? children
      : cloneElement(children, { handleAnnouncementDialog });

  const renderDialogIcon = (icon) => {
    if (icon && React.isValidElement(icon)) return icon;
    if (icon && typeof icon === 'object')
      return <FontAwesomeIcon icon={icon} />;
    return null;
  };

  // --- initial size/position from props ---
  const initialW = useMemo(
    () => numberOr(width, numberOr(minWidth, 600)),
    [width, minWidth]
  );
  const initialH = useMemo(
    () => numberOr(height, numberOr(minHeight, 400)),
    [height, minHeight]
  );

  // Anchor shifts (how much to subtract from the anchor origin to align the dialog)
  const anchorShiftX = useMemo(() => {
    if (anchorX === 'center') return initialW / 2;
    if (anchorX === 'end') return initialW;
    return 0; // 'start'
  }, [anchorX, initialW]);

  const anchorShiftY = useMemo(() => {
    if (anchorY === 'center') return initialH / 2;
    if (anchorY === 'end') return initialH;
    return 0; // 'start'
  }, [anchorY, initialH]);

  const initialX = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const origin = lenToPx(anchorOriginX, 'x', bounds) ?? 16;
    const x = origin - anchorShiftX;
    return clamp(x, 0, Math.max(0, bounds.vw - initialW));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorOriginX, anchorShiftX, initialW]);

  const initialY = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const origin = lenToPx(anchorOriginY, 'y', bounds) ?? 16;
    const y = origin - anchorShiftY;
    return clamp(y, 0, Math.max(0, bounds.vh - initialH));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorOriginY, anchorShiftY, initialH]);

  const [size, setSize] = useState({ width: initialW, height: initialH });
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  // stacking
  const [zIndex, setZIndex] = useState(++__zCounter);
  const bringToFront = () => setZIndex(++__zCounter);
  console.log(__zCounter)
  console.log(zIndex)

  // remember before maximize
  const prevRef = useRef({ size, position });

  // Maximize -> save/restore
  useEffect(() => {
    if (maximize) {
      prevRef.current = { size, position };
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      const { size: ps, position: pp } = prevRef.current || {};
      if (ps && pp) {
        setSize(ps);
        setPosition(pp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximize]);

  // Keep inside viewport on window resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (maximize) {
        setSize({ width: vw, height: vh });
        setPosition({ x: 0, y: 0 });
        return;
      }
      setSize((s) => ({
        width: Math.min(s.width, vw),
        height: Math.min(s.height, vh)
      }));
      setPosition((p) => ({
        x: Math.min(
          Math.max(p.x, 0),
          Math.max(0, vw - Math.min(size.width, vw))
        ),
        y: Math.min(
          Math.max(p.y, 0),
          Math.max(0, vh - Math.min(size.height, vh))
        )
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maximize, size.width, size.height]);

  // For mobile fullscreen
  useEffect(() => {
    if (isMobile && fullScreenOnMobile && localState) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [localState, fullScreenOnMobile]);

  const disableDragging =
    !drag || minimize || maximize || (isMobile && fullScreenOnMobile);
  const canResize =
    resize && !minimize && !maximize && !(isMobile && fullScreenOnMobile);
  const enableResizing =
    typeof enableResizingSides === 'object' ? enableResizingSides : canResize;

  // Auto-fit height on first open (and until user resizes)
  useLayoutEffect(() => {
    if (!localState) return;
    if (maximize || minimize) return;
    if (!fitHeightOnOpen || userResized) return;

    const headerH = headerRef.current?.offsetHeight ?? 0;
    const bodyScrollH = bodyRef.current?.scrollHeight ?? size.height;

    const desiredH = headerH + bodyScrollH;

    const minH = lenToPx(minHeight, 'y') ?? 0;

    const propMaxH = lenToPx(maxHeight, 'y'); // allow props to cap it
    const viewportCap = window.innerHeight - viewportMarginY * 2;
    const maxH =
      propMaxH != null ? Math.min(propMaxH, viewportCap) : viewportCap;

    const nextH = clamp(desiredH, minH, maxH);

    if (Math.abs((size?.height ?? 0) - nextH) > 1) {
      setSize((prev) => ({ ...prev, height: nextH }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState, maximize, minimize, fitHeightOnOpen, userResized]);

  // If content changes size after open (e.g., async), keep fitting until user resizes
  useEffect(() => {
    if (!localState || maximize || minimize || userResized) return;
    if (!fitHeightOnOpen) return;
    if (!bodyRef.current) return;

    const ro = new ResizeObserver(() => {
      const headerH = headerRef.current?.offsetHeight ?? 0;
      const bodyScrollH = bodyRef.current?.scrollHeight ?? size.height;
      const desiredH = headerH + bodyScrollH;

      const minH = lenToPx(minHeight, 'y') ?? 0;
      const propMaxH = lenToPx(maxHeight, 'y');
      const viewportCap = window.innerHeight - viewportMarginY * 2;
      const maxH =
        propMaxH != null ? Math.min(propMaxH, viewportCap) : viewportCap;

      const nextH = clamp(desiredH, minH, maxH);
      if (Math.abs((size?.height ?? 0) - nextH) > 1) {
        setSize((prev) => ({ ...prev, height: nextH }));
      }
    });

    ro.observe(bodyRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState, maximize, minimize, userResized, fitHeightOnOpen]);

  //if (!localState) return null;

  const showMaximizeButton =
    maximizable && window.innerWidth > MIN_SCREEN_WIDTH_MAXIMIZE;

  const minWNum = lenToPx(minWidth, 'x') ?? undefined;
  const minHNum = lenToPx(minHeight, 'y') ?? undefined;
  const maxWNum = lenToPx(maxWidth, 'x') ?? undefined;
  const maxHNum = lenToPx(maxHeight, 'y') ?? undefined;

  return (
    <>
      {/* Optional per-dialog backdrop: sits just under the dialog */}
      {backdrop && (
        <StyledDialogBackdrop
          style={{ zIndex: zIndex - 1 }}
          onClick={() => closeAction?.()}
        />
      )}

      <StyledRnd
        size={size}
        position={position}
        bounds={'window'}
        minWidth={minWNum}
        minHeight={minHNum}
        maxWidth={maxWNum}
        maxHeight={maxHNum}
        onDragStart={bringToFront}
        onResizeStart={() => {
          bringToFront();
          setUserResized(true);
        }}
        onMouseDown={bringToFront}
        onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
        onResize={(_, __, ref, ___, newPosition) => {
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setPosition(newPosition);
        }}
        dragHandleClassName="dialog-header"
        disableDragging={disableDragging}
        enableResizing={enableResizing}
        style={{ zIndex, ...style }}
      >
        {/* The inner panel fills Rnd and always resizes with it */}
        <Panel $fullScreenOnMobile={fullScreenOnMobile}>
          <Header
            ref={headerRef}
            id={'dialog_header_' + title}
            $type={type}
            $drag={drag && !disableDragging}
            className="dialog-header"
          >
            <Tooltip
              anchorSelect={'#' + helpId}
              style={{ backgroundColor: theme.colors.mainColor1 }}
              disable={isMobile}
              id={helpId + '_tooltip'}
              place="bottom"
              effect="float"
            >
              {helpContent}
            </Tooltip>

            <Title>
              {renderDialogIcon(titleIcon)}
              <p>{title}</p>
            </Title>

            <Right>
              {minimizable && (
                <HeaderBtn onClick={() => minimizeAction?.()}>
                  <FontAwesomeIcon icon={faWindowMinimize} />
                </HeaderBtn>
              )}

              {showMaximizeButton && (
                <HeaderBtn
                  onClick={(e) => {
                    e.preventDefault();
                    maximizeAction?.();
                  }}
                >
                  <FontAwesomeIcon
                    icon={maximize ? faWindowRestore : faWindowMaximize}
                  />
                </HeaderBtn>
              )}

              {hasHelp && (
                <HeaderBtn id={helpId}>
                  <FontAwesomeIcon icon={faQuestion} />
                </HeaderBtn>
              )}

              <CloseBtn
                onClick={() => {
                  if (type !== 'announcement') {
                    closeAction?.();
                  } else {
                    setLocalState(false);
                    setTimeout(() => closeAction?.(null, null), 500);
                  }
                }}
              >
                <CloseIcon icon={faTimes} />
              </CloseBtn>
            </Right>
          </Header>

          <Body ref={bodyRef}>{renderedChildren}</Body>
        </Panel>
      </StyledRnd>
    </>
  );
};

export default Dialog;
