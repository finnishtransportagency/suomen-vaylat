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

const StyledRnd = styled(Rnd)``;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.colors.mainWhite};
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const StyledDialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;

const ContentSizer = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`;

/* ---------------- Utils ---------------- */

const clamp = (v, minV, maxV) => Math.min(maxV ?? v, Math.max(minV ?? v, v));

/**
 * Convert CSS length to px.
 * Supports: px | % | vw | vh | rem | em | number | 'auto'
 * - % / vw / vh are relative to viewport (Rnd is bounded to 'window')
 * - rem is relative to <html> computed font-size
 * - em  is relative to the dialog panel's computed font-size
 */
const toPx = (
  val,
  axis = 'x',
  bounds = { vw: window.innerWidth, vh: window.innerHeight },
  bases = { rem: 16, em: 16 } // <-- NEW: rem/em bases (px)
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
  // Bare number treated as px
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

/** Resolve request/min/max to *pixels*, then clamp to get the effective size. */
const resolveEffectiveSize = (
  reqW,
  reqH,
  minW,
  minH,
  maxW,
  maxH,
  bounds,
  bases // <-- NEW: pass bases through
) => {
  const rW = toPx(reqW, 'x', bounds, bases);
  const rH = toPx(reqH, 'y', bounds, bases);
  const miW = toPx(minW, 'x', bounds, bases);
  const miH = toPx(minH, 'y', bounds, bases);
  const maW = toPx(maxW, 'x', bounds, bases);
  const maH = toPx(maxH, 'y', bounds, bases);

  // Defaults if requested is auto or invalid
  const fallbackW = miW ?? 700;
  const fallbackH = miH ?? 600;

  // Requested size (may be null if 'auto')
  const wantW = rW ?? fallbackW;
  const wantH = rH ?? fallbackH;

  const effW = clamp(wantW, miW ?? wantW, maW ?? wantW);
  const effH = clamp(wantH, miH ?? wantH, maH ?? wantH);
  return {
    width: effW,
    height: effH,
    minW: miW,
    minH: miH,
    maxW: maW,
    maxH: maH
  };
};

/** Compute anchored position for a given size (in px) */
const anchoredPosition = (
  w,
  h,
  anchorOriginX,
  anchorOriginY,
  anchorX,
  anchorY,
  bounds,
  bases // <-- NEW
) => {
  const originX = toPx(anchorOriginX, 'x', bounds, bases) ?? 16;
  const originY = toPx(anchorOriginY, 'y', bounds, bases) ?? 16;
  const shiftX = anchorX === 'center' ? w / 2 : anchorX === 'end' ? w : 0;
  const shiftY = anchorY === 'center' ? h / 2 : anchorY === 'end' ? h : 0;
  const x = clamp(originX - shiftX, 0, Math.max(0, bounds.vw - w));
  const y = clamp(originY - shiftY, 0, Math.max(0, bounds.vh - h));
  return { x, y };
};

/* A tiny global z-index counter so the last focused dialog comes on top */
let __zCounter = 9993;

/* ---------------- Component ---------------- */

const Dialog = ({
  drag = true,
  resize = true,
  backdrop = false,
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

  /** Sizing (strings or numbers; px | % | vw | vh | rem | em | number | 'auto') */
  width = 'auto',
  height = 'auto',
  minWidth,
  minHeight,
  maxWidth = '90vw',
  maxHeight = '90vh',

  /** Anchor-based positioning (initial only) */
  anchorOriginX = '50%', // where *in the viewport* we anchor from
  anchorOriginY = '50%',
  anchorX = 'center', // how the dialog aligns to that origin (start|center|end)
  anchorY = 'center',

  /** Resize sides config (optional object) */
  enableResizingSides,

  /** Auto-fit behavior */
  fitHeightOnOpen = true,
  viewportMarginY = 16,

  /** Content */
  children,

  /** Styling */
  style = {}
}) => {
  const [localState, setLocalState] = useState(type === 'announcement');

  const panelRef = useRef(null); // <-- NEW: to compute `em`
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const contentRef = useRef(null);

  // Track user interactions so we stop auto anchoring afterward
  const [hasUserMoved, setHasUserMoved] = useState(false);
  const [userResized, setUserResized] = useState(false);

  const wantsAutoWidth = width === 'auto' || width == null;
  const wantsAutoHeight = height === 'auto' || height == null;

  // If resize is enabled, keep auto-sizing only until user resizes manually.
  // If resize is disabled, auto-sizing can stay active forever.
  const autoWidthActive = wantsAutoWidth && (!resize || !userResized);
  const autoHeightActive = wantsAutoHeight && (!resize || !userResized);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current;

    const update = () => {
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const em = parseFloat(getComputedStyle(el).fontSize) || rem;
      setBases({ rem, em });
    };

    // Track size/style changes on the panel
    const ro = new ResizeObserver(update);
    ro.observe(el);

    // Also observe <html> font-size changes indirectly by hooking resize (already present)
    // For robustness, you could use a MutationObserver on <html> style attribute, if needed.

    update();
    return () => ro.disconnect();
  }, []);

  // NEW: bases for rem/em
  const [bases, setBases] = useState({ rem: 16, em: 16 });
  useEffect(() => {
    const computeBases = () => {
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const em = panelRef.current
        ? parseFloat(getComputedStyle(panelRef.current).fontSize) || rem
        : rem;
      setBases({ rem, em });
    };
    computeBases();
    window.addEventListener('resize', computeBases);
    return () => window.removeEventListener('resize', computeBases);
  }, []);

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

  // Resolve initial effective size (in px) using *viewport* as bounds
  const initial = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    return resolveEffectiveSize(
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // compute once on mount

  // Initial position from anchors using the *effective* size
  const initialPos = useMemo(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    return anchoredPosition(
      initial.width,
      initial.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [size, setSize] = useState({
    width: initial.width,
    height: initial.height
  });
  const [position, setPosition] = useState({
    x: initialPos.x,
    y: initialPos.y
  });

  useLayoutEffect(() => {
    if (!contentRef.current || !headerRef.current) return;
    if (maximize || minimize) return;
    if (!autoWidthActive && !autoHeightActive) return;

    let rafId = 0;
    let framePending = false;

    const updateSizeFromContent = () => {
      const bounds = { vw: window.innerWidth, vh: window.innerHeight };

      const headerH = headerRef.current?.offsetHeight ?? 0;
      const contentW = contentRef.current?.scrollWidth ?? 0;
      const contentH = contentRef.current?.scrollHeight ?? 0;

      let desiredW = size.width;
      let desiredH = size.height;

      if (autoWidthActive) {
        desiredW = contentW;
      }

      if (autoHeightActive) {
        desiredH = headerH + contentH;
      }

      const resolved = resolveEffectiveSize(
        desiredW,
        desiredH,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        bounds,
        bases
      );

      const nextWidth = autoWidthActive ? resolved.width : size.width;
      const nextHeight = autoHeightActive ? resolved.height : size.height;

      const widthChanged = Math.abs(nextWidth - size.width) > 1;
      const heightChanged = Math.abs(nextHeight - size.height) > 1;

      if (!widthChanged && !heightChanged) return;

      const nextSize = {
        width: nextWidth,
        height: nextHeight
      };

      setSize(nextSize);

      // Keep anchor semantics until the user moves the dialog
      if (!hasUserMoved) {
        const nextPos = anchoredPosition(
          nextSize.width,
          nextSize.height,
          anchorOriginX,
          anchorOriginY,
          anchorX,
          anchorY,
          bounds,
          bases
        );
        setPosition(nextPos);
      }
    };

    const observer = new ResizeObserver(() => {
      if (framePending) return;
      framePending = true;
      rafId = requestAnimationFrame(() => {
        framePending = false;
        updateSizeFromContent();
      });
    });

    observer.observe(contentRef.current);

    // initial run
    updateSizeFromContent();

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    autoWidthActive,
    autoHeightActive,
    maximize,
    minimize,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    anchorOriginX,
    anchorOriginY,
    anchorX,
    anchorY,
    hasUserMoved,
    size.width,
    size.height,
    bases
  ]);

  // If bases (rem/em) change after mount (e.g., user zoom or CSS loads), re-resolve once.
  useEffect(() => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const resolved = resolveEffectiveSize(
      size.width,
      size.height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );
    setSize({ width: resolved.width, height: resolved.height });
    const pos = anchoredPosition(
      resolved.width,
      resolved.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );
    setPosition(pos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bases]);

  // Stacking
  const [zIndex, setZIndex] = useState(++__zCounter);
  const bringToFront = () => setZIndex(++__zCounter);

  // Save/restore around maximize
  const prevRef = useRef({ size, position });

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

  // Auto-fit height on first open (until user resizes)
  useLayoutEffect(() => {
    if (!localState) return;
    if (maximize || minimize) return;
    if (!fitHeightOnOpen || userResized) return;

    const headerH = headerRef.current?.offsetHeight ?? 0;
    const bodyScrollH = bodyRef.current?.scrollHeight ?? size.height;

    const desiredH = headerH + bodyScrollH;

    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const minHpx = toPx(minHeight, 'y', bounds, bases) ?? 0;
    const maxHcap = (() => {
      const propMax = toPx(maxHeight, 'y', bounds, bases);
      const viewportCap = window.innerHeight - viewportMarginY * 2;
      return propMax != null ? Math.min(propMax, viewportCap) : viewportCap;
    })();

    const nextH = clamp(desiredH, minHpx, maxHcap);
    if (Math.abs(size.height - nextH) > 1) {
      setSize((prev) => ({ ...prev, height: nextH }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState, maximize, minimize, fitHeightOnOpen, userResized, bases]);

  /**
   * Re-anchor when:
   * - window resizes (viewport changes), or
   * - any of the sizing props change (if you wire them), and
   * only if the user hasn't interacted and we're not maximized/minimized.
   */
  const reanchorIfNeeded = React.useCallback(() => {
    if (maximize || minimize) return;
    if (hasUserMoved || userResized) return;

    const bounds = { vw: window.innerWidth, vh: window.innerHeight };

    // Re-resolve constraints against new viewport (vh/vw/%/rem/em may change!)
    const resolved = resolveEffectiveSize(
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
      bases
    );

    // Keep current size unless it violates constraints; clamp to new constraints
    const clampedW = clamp(
      size.width,
      resolved.minW ?? size.width,
      resolved.maxW ?? size.width
    );
    const clampedH = clamp(
      size.height,
      resolved.minH ?? size.height,
      resolved.maxH ?? size.height
    );

    // If requested was 'auto', we still let auto-fit effect adjust height; here we just respect min/max.
    const nextSize = { width: clampedW, height: clampedH };

    // Recompute anchored position using the *current/effective* size
    const nextPos = anchoredPosition(
      nextSize.width,
      nextSize.height,
      anchorOriginX,
      anchorOriginY,
      anchorX,
      anchorY,
      bounds,
      bases
    );

    setSize(nextSize);
    setPosition(nextPos);
  }, [
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    anchorOriginX,
    anchorOriginY,
    anchorX,
    anchorY,
    maximize,
    minimize,
    hasUserMoved,
    userResized,
    size.width,
    size.height,
    bases
  ]);

  // Window resize → re-anchor (until user interacts)
  useEffect(() => {
    const onResize = () => {
      if (maximize) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
        setPosition({ x: 0, y: 0 });
        return;
      }
      reanchorIfNeeded();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [reanchorIfNeeded, maximize]);

  // Mobile fullscreen
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

  // Constraints passed to RND (numbers in px) — now em/rem aware
  const bounds = { vw: window.innerWidth, vh: window.innerHeight };
  const minWpx = toPx(minWidth, 'x', bounds, bases) ?? undefined;
  const minHpx = toPx(minHeight, 'y', bounds, bases) ?? undefined;
  const maxWpx = toPx(maxWidth, 'x', bounds, bases) ?? undefined;
  const maxHpx = toPx(maxHeight, 'y', bounds, bases) ?? undefined;

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
        bounds="window"
        minWidth={minWpx}
        minHeight={minHpx}
        maxWidth={maxWpx}
        maxHeight={maxHpx}
        onDragStart={() => {
          bringToFront();
          setHasUserMoved(true); // stop further auto re-anchoring
        }}
        onResizeStart={() => {
          bringToFront();
          setUserResized(true); // stop further auto re-anchoring
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
        {/* Attach ref here so we can read computed font-size for `em` */}
        <Panel ref={panelRef} $fullScreenOnMobile={fullScreenOnMobile}>
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

              {maximizable && window.innerWidth > MIN_SCREEN_WIDTH_MAXIMIZE && (
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

          <Body ref={bodyRef}>
            <ContentSizer ref={contentRef}>{renderedChildren}</ContentSizer>
          </Body>
        </Panel>
      </StyledRnd>
    </>
  );
};

export default Dialog;
